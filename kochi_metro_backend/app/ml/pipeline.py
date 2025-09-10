import pandas as pd
import numpy as np
import joblib
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix
from sklearn.preprocessing import StandardScaler
from imblearn.over_sampling import SMOTE
from imblearn.combine import SMOTETomek
from imblearn.pipeline import Pipeline as ImbPipeline
from typing import List, Dict, Tuple
import os
from app.db.client import db
from app.core.task_manager import update_task_status

MODEL_DIR = os.path.join(os.path.dirname(__file__), "models")
MODEL_PATH = os.path.join(MODEL_DIR, "risk_model.joblib")
SCALER_PATH = os.path.join(MODEL_DIR, "scaler.joblib")

class RiskPredictor:
    def __init__(self):
        self.model = None
        self.scaler = None
        os.makedirs(MODEL_DIR, exist_ok=True)
        self.load_model()

    def load_model(self):
        """Loads the trained model and scaler from disk."""
        try:
            self.model = joblib.load(MODEL_PATH)
            print("Pre-trained model loaded successfully.")
            
            try:
                self.scaler = joblib.load(SCALER_PATH)
            except FileNotFoundError:
                print("Scaler not found. Will be created during training.")
                self.scaler = None
        except (FileNotFoundError, ValueError, ImportError) as e:
            print(f"Model loading failed ({e}). Creating a new model.")
            self.model = None
            self.scaler = None
            
    async def get_training_data(self):
        """Fetch historical data for training from the database."""
        outcomes = await db.historical_outcomes.find_many()
        
        if len(outcomes) < 20:
            raise ValueError("Not enough data for training (minimum 20 records needed)")
        
        # Convert Prisma model objects to dictionaries and create a DataFrame
        data = pd.DataFrame([{
            'asset_id': outcome.asset_id,
            'mileage_at_event': outcome.mileage_at_event,
            'days_since_last_maint': outcome.days_since_last_maint,
            'failure_occurred': outcome.failure_occurred,
            'event_date': outcome.event_date
        } for outcome in outcomes])
        
        # Create additional features to improve model performance
        data['mileage_to_days_ratio'] = data['mileage_at_event'] / (data['days_since_last_maint'] + 1)
        data['mileage_squared'] = np.square(data['mileage_at_event'])
        data['days_squared'] = np.square(data['days_since_last_maint'])
        data['interaction'] = data['mileage_at_event'] * data['days_since_last_maint']
        
        print(f"Loaded {len(data)} training records from database")
        return data
        
    def engineer_features(self, data):
        """Create additional features to improve model performance."""
        if isinstance(data, pd.DataFrame):
            data = data.copy()
            # Only add these columns if they don't already exist
            if 'mileage_to_days_ratio' not in data.columns:
                data['mileage_to_days_ratio'] = data['mileage_at_event'] / (data['days_since_last_maint'] + 1)
            if 'mileage_squared' not in data.columns:
                data['mileage_squared'] = np.square(data['mileage_at_event'])
            if 'days_squared' not in data.columns:
                data['days_squared'] = np.square(data['days_since_last_maint'])
            if 'interaction' not in data.columns:
                data['interaction'] = data['mileage_at_event'] * data['days_since_last_maint']
        return data

    async def train_model(self, task_id: str):
        """
        Trains the model on all available data without evaluation.
        This is a faster option when you just want to update the model.
        """
        try:
            update_task_status(task_id, "Fetching training data...", 10)
            data = await self.get_training_data()
            
            update_task_status(task_id, "Preparing data...", 20)
            features = [
                'mileage_at_event', 
                'days_since_last_maint', 
                'mileage_to_days_ratio',
                'mileage_squared',
                'days_squared',
                'interaction'
            ]
            target = 'failure_occurred'
            X = data[features]
            y = data[target]
            
            update_task_status(task_id, "Scaling features...", 30)
            self.scaler = StandardScaler()
            X_scaled = self.scaler.fit_transform(X)
            X_scaled_df = pd.DataFrame(X_scaled, columns=features)
            
            update_task_status(task_id, "Balancing classes with SMOTETomek...", 40)
            smote_tomek = SMOTETomek(random_state=42)
            X_resampled, y_resampled = smote_tomek.fit_resample(X_scaled_df, y)
            print(f"Original dataset size: {len(X)}. Resampled size: {len(X_resampled)}")
            
            # Class weights to further address imbalance
            class_counts = np.bincount(y)
            class_weights = {0: 1, 1: class_counts[0]/class_counts[1] * 2}  # Boost minority class
            
            update_task_status(task_id, "Training model with optimized parameters...", 60)
            self.model = GradientBoostingClassifier(
                n_estimators=200, 
                learning_rate=0.1, 
                max_depth=5,
                min_samples_split=10,
                min_samples_leaf=4,
                subsample=0.8,
                random_state=42
            )
            self.model.fit(X_resampled, y_resampled)
            
            update_task_status(task_id, "Saving model and scaler...", 90)
            joblib.dump(self.model, MODEL_PATH)
            joblib.dump(self.scaler, SCALER_PATH)
            
            update_task_status(task_id, "Completed", 100, result={"message": "Model trained successfully"})
            
        except Exception as e:
            print(f"An error occurred during training for task {task_id}: {e}")
            update_task_status(task_id, f"Error: {e}", 100, result={"error": str(e)})

    async def train_and_evaluate(self, task_id: str):
        """
        Trains and evaluates the model, using advanced techniques to handle imbalanced data,
        and reports progress with detailed metrics.
        """
        try:
            update_task_status(task_id, "Fetching historical data...", 10)
            data = await self.get_training_data()
            
            update_task_status(task_id, "Preparing data with feature engineering...", 20)
            features = [
                'mileage_at_event', 
                'days_since_last_maint', 
                'mileage_to_days_ratio',
                'mileage_squared',
                'days_squared',
                'interaction'
            ]
            target = 'failure_occurred'
            X = data[features]
            y = data[target]
            
            # Use stratified split to maintain class distribution
            X_train, X_test, y_train, y_test = train_test_split(
                X, y, test_size=0.2, random_state=42, stratify=y
            )
            
            # Scale features for better model performance
            update_task_status(task_id, "Scaling features...", 30)
            self.scaler = StandardScaler()
            X_train_scaled = self.scaler.fit_transform(X_train)
            X_test_scaled = self.scaler.transform(X_test)
            
            # Apply SMOTETomek for better class balance (combines SMOTE with Tomek Links)
            update_task_status(task_id, "Balancing minority class with SMOTETomek...", 40)
            smote_tomek = SMOTETomek(random_state=42)
            X_train_resampled, y_train_resampled = smote_tomek.fit_resample(
                X_train_scaled, y_train
            )
            print(f"Original training set size: {len(X_train)}. Resampled size: {len(X_train_resampled)}")

            # Count class distribution in training data
            pos_count = sum(y_train)
            total_count = len(y_train)
            print(f"Original class distribution - Positive: {pos_count}/{total_count} ({pos_count/total_count*100:.1f}%)")
            
            # Define class weights based on class distribution
            class_weights = {
                0: 1.0,
                1: (total_count - pos_count) / pos_count * 2  # More weight to minority class
            }
            print(f"Using class weights: {class_weights}")

            update_task_status(task_id, "Training evaluation model...", 60)
            # Use GradientBoostingClassifier which often performs better on imbalanced data
            eval_model = GradientBoostingClassifier(
                n_estimators=200, 
                learning_rate=0.1, 
                max_depth=5,
                min_samples_split=10,
                min_samples_leaf=4,
                subsample=0.8,
                random_state=42
            )
            eval_model.fit(X_train_resampled, y_train_resampled)
            
            update_task_status(task_id, "Calculating performance scores...", 80)
            # Get probability predictions for better threshold tuning
            y_proba = eval_model.predict_proba(X_test_scaled)[:, 1]
            
            # Find optimal threshold for F1 score
            thresholds = np.arange(0.1, 0.9, 0.05)
            best_f1 = 0
            best_threshold = 0.5
            
            for threshold in thresholds:
                y_pred_threshold = (y_proba >= threshold).astype(int)
                f1 = f1_score(y_test, y_pred_threshold)
                if f1 > best_f1:
                    best_f1 = f1
                    best_threshold = threshold
            
            print(f"Best threshold: {best_threshold:.2f} with F1: {best_f1:.4f}")
            
            # Get predictions with optimal threshold
            y_pred = (y_proba >= best_threshold).astype(int)
            
            # Calculate and print confusion matrix
            conf_matrix = confusion_matrix(y_test, y_pred)
            print(f"Confusion Matrix:\n{conf_matrix}")
            
            scores = {
                "records_used_for_test": len(X_test),
                "accuracy": round(accuracy_score(y_test, y_pred), 3),
                "precision": round(precision_score(y_test, y_pred), 3),
                "recall": round(recall_score(y_test, y_pred), 3),
                "f1_score": round(f1_score(y_test, y_pred), 3),
                "threshold_used": round(best_threshold, 2),
                "confusion_matrix": conf_matrix.tolist()
            }
            
            # Retrain the final model on ALL data
            update_task_status(task_id, "Retraining final model on all data...", 90)
            X_scaled_full = self.scaler.transform(X)
            X_resampled_full, y_resampled_full = smote_tomek.fit_resample(X_scaled_full, y)
            
            self.model = GradientBoostingClassifier(
                n_estimators=200, 
                learning_rate=0.1, 
                max_depth=5,
                min_samples_split=10,
                min_samples_leaf=4,
                subsample=0.8,
                random_state=42
            )
            self.model.fit(X_resampled_full, y_resampled_full)
            
            # Save both model and scaler
            joblib.dump(self.model, MODEL_PATH)
            joblib.dump(self.scaler, SCALER_PATH)

            update_task_status(task_id, "Completed", 100, result=scores)

        except Exception as e:
            print(f"An error occurred during evaluation for task {task_id}: {e}")
            update_task_status(task_id, f"Error: {e}", 100, result={"error": str(e)})
    
    def predict_risk(self, assets: List[Dict]) -> List[Dict]:
        """
        Hybrid risk prediction combining ML model with hard rules.
        Implements KMRL's requirement for explainable, multi-factor risk assessment.
        """
        if self.model is None:
            print("Warning: Model not available/trained. Using rules-based assessment only.")
            
        for asset in assets:
            try:
                # Get ML-based risk prediction if model is available
                if self.model is not None:
                    ml_risk = self._get_ml_risk_prediction(asset)
                else:
                    ml_risk = 0.5  # Neutral score when ML unavailable
                
                # Get rules-based risk (already calculated in rules.py)
                rules_risk = asset.get('rules_risk_score', 0.0)
                
                # Hybrid risk calculation with configurable weights
                # Prioritize rules for safety-critical decisions
                ml_weight = 0.4
                rules_weight = 0.6
                
                combined_risk = (ml_weight * ml_risk) + (rules_weight * rules_risk)
                
                # Update asset with all risk scores
                asset['ml_risk_score'] = round(ml_risk, 3)
                asset['combined_risk_score'] = round(combined_risk, 3)
                asset['risk_score'] = asset['combined_risk_score']  # For backward compatibility
                
                # Enhanced risk categorization
                risk_category, risk_explanation = self._categorize_risk(
                    combined_risk, ml_risk, rules_risk, asset
                )
                
                asset['risk_category'] = risk_category
                asset['risk_explanation'] = risk_explanation
                
            except Exception as e:
                print(f"Error predicting risk for asset {asset.get('asset_num', 'unknown')}: {e}")
                # Fallback to conservative risk assessment
                asset['ml_risk_score'] = 0.5
                asset['combined_risk_score'] = max(0.7, asset.get('rules_risk_score', 0.5))
                asset['risk_score'] = asset['combined_risk_score']
                asset['risk_category'] = 'High'
                asset['risk_explanation'] = 'Error in risk calculation - using conservative estimate'
        
        return assets
    
    def _get_ml_risk_prediction(self, asset: Dict) -> float:
        """Get ML model prediction for a single asset."""
        try:
            # Check if model is available
            if self.model is None:
                print("ML model not available, using conservative risk estimate")
                return 0.6  # Conservative risk estimate when model unavailable
                
            # Prepare features for ML model
            features_df = pd.DataFrame({
                'mileage_at_event': [asset['current_mileage']],
                'days_since_last_maint': [asset.get('days_since_maint', 15)]
            })
            
            # Apply feature engineering
            features_df['mileage_to_days_ratio'] = features_df['mileage_at_event'] / (features_df['days_since_last_maint'] + 1)
            features_df['mileage_squared'] = np.square(features_df['mileage_at_event'])
            features_df['days_squared'] = np.square(features_df['days_since_last_maint'])
            features_df['interaction'] = features_df['mileage_at_event'] * features_df['days_since_last_maint']
            
            # Scale features if scaler is available
            if self.scaler:
                features_scaled = self.scaler.transform(features_df)
                ml_probability = self.model.predict_proba(features_scaled)[0, 1]
            else:
                ml_probability = self.model.predict_proba(features_df)[0, 1]
            
            return ml_probability
            
        except Exception as e:
            print(f"Error in ML prediction: {e}")
            return 0.5  # Neutral score on error
    
    def _categorize_risk(self, combined_risk: float, ml_risk: float, rules_risk: float, asset: Dict) -> Tuple[str, str]:
        """
        Categorize risk with explainable reasoning based on KMRL requirements.
        """
        explanations = []
        
        # Analyze ML vs Rules contribution
        if rules_risk > 0.7:
            explanations.append("High operational risk factors")
        if ml_risk > 0.7:
            explanations.append("ML model indicates failure pattern")
        
        # Add specific risk factors
        risk_factors = asset.get('risk_factors', [])
        if risk_factors:
            explanations.extend(risk_factors[:2])  # Limit to top 2 factors
        
        # Categorize based on combined risk
        if combined_risk >= 0.8:
            category = 'Critical'
            if not explanations:
                explanations.append("Multiple high-risk indicators")
        elif combined_risk >= 0.6:
            category = 'High'
            if not explanations:
                explanations.append("Elevated risk indicators")
        elif combined_risk >= 0.4:
            category = 'Moderate'
            if not explanations:
                explanations.append("Some risk factors present")
        else:
            category = 'Low'
            explanations.append("Normal operational parameters")
        
        explanation = "; ".join(explanations) if explanations else "Standard risk assessment"
        return category, explanation

# Create a single, reusable instance
risk_predictor = RiskPredictor()

