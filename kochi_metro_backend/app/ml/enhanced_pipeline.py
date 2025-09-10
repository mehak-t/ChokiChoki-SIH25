from app.ml.pipeline import RiskPredictor
from app.ai.ollama_client import OllamaClient
from app.schemas.ai_response import EnhancedPredictionResponse, AIExplanation, AIRefinement
from typing import Dict, List, Optional
import logging
from datetime import datetime

logger = logging.getLogger(__name__)

class EnhancedMLPipeline(RiskPredictor):
    def __init__(self):
        super().__init__()
        self.ollama_client = OllamaClient()
        self.ai_enabled = False
        
    async def initialize_ai(self) -> bool:
        """Initialize and verify Ollama connection."""
        self.ai_enabled = await self.ollama_client.health_check()
        if self.ai_enabled:
            logger.info("Ollama Gemma 2B integration enabled")
        else:
            logger.warning("Ollama not available - running without AI enhancement")
        return self.ai_enabled
    
    async def predict_risk_enhanced(self, train_data: Dict) -> EnhancedPredictionResponse:
        """Enhanced prediction with AI explanations and refinement."""
        
        # Get base prediction from parent class (expects list, so wrap in list)
        base_predictions = self.predict_risk([train_data])
        base_prediction = base_predictions[0] if base_predictions else {}
        
        # Prepare enhanced response
        enhanced_response = EnhancedPredictionResponse(
            asset_id=train_data.get('asset_id', ''),
            asset_num=train_data.get('asset_num', ''),
            final_risk_score=base_prediction.get('final_risk_score', 0.0),
            priority_level=base_prediction.get('priority_level', 'LOW'),
            risk_factors=base_prediction.get('risk_factors', []),
            ml_risk_score=base_prediction.get('ml_risk_score', 0.0),
            rules_risk_score=base_prediction.get('rules_risk_score', 0.0),
            days_since_maint=train_data.get('days_since_maint', 0),
            current_mileage=train_data.get('current_mileage', 0.0),
            prediction_timestamp=datetime.now(),
            model_version=getattr(self, 'model_version', '1.0')
        )
        
        if not self.ai_enabled:
            return enhanced_response
        
        try:
            # Generate AI explanation
            explanation_dict = await self.ollama_client.generate_explanation(
                prediction_data=base_prediction,
                risk_factors=base_prediction.get('risk_factors', []),
                asset_details=train_data
            )
            
            enhanced_response.ai_explanation = AIExplanation(**explanation_dict)
            
            # Get historical context for refinement
            historical_context = await self._get_historical_context(train_data['asset_id'])
            asset_specs = train_data.get('asset_specifications', [])
            
            # Apply AI refinement
            refined_prediction = await self.ollama_client.refine_prediction(
                current_prediction=base_prediction,
                historical_context=historical_context,
                asset_specifications=asset_specs
            )
            
            if 'ai_refinement' in refined_prediction:
                enhanced_response.ai_refinement = AIRefinement(**refined_prediction['ai_refinement'])
                enhanced_response.final_risk_score = refined_prediction['final_risk_score']
                
                # Recalculate priority based on refined score
                enhanced_response.priority_level = self._calculate_priority(
                    refined_prediction['final_risk_score']
                )
            
        except Exception as e:
            logger.error(f"AI enhancement failed for {train_data.get('asset_num', 'Unknown')}: {e}")
        
        return enhanced_response
    
    async def _get_historical_context(self, asset_id: str) -> List[Dict]:
        """Get recent maintenance history for AI context."""
        try:
            from app.db.client import db
            
            recent_outcomes = await db.historical_outcomes.find_many(
                where={"asset_id": asset_id},
                order_by={"event_date": "desc"},
                take=5
            )
            
            context = []
            for outcome in recent_outcomes:
                context.append({
                    "maintenance_type": outcome.maintenance_type,
                    "days_ago": (datetime.now() - outcome.event_date).days,
                    "failure_occurred": outcome.failure_occurred,
                    "cost_impact": float(outcome.cost_impact or 0)
                })
            
            return context
            
        except Exception as e:
            logger.error(f"Error getting historical context: {e}")
            return []
    
    def _calculate_priority(self, risk_score: float) -> str:
        """Calculate priority level based on risk score."""
        if risk_score >= 0.8:
            return "CRITICAL"
        elif risk_score >= 0.6:
            return "HIGH"
        elif risk_score >= 0.4:
            return "MEDIUM"
        else:
            return "LOW"

    async def batch_predict_enhanced(self, assets_data: List[Dict]) -> List[EnhancedPredictionResponse]:
        """Enhanced batch prediction with AI insights."""
        
        if not await self.initialize_ai():
            logger.info("Running batch prediction without AI enhancement")
        
        enhanced_predictions = []
        
        for asset_data in assets_data:
            try:
                prediction = await self.predict_risk_enhanced(asset_data)
                enhanced_predictions.append(prediction)
            except Exception as e:
                logger.error(f"Failed to process asset {asset_data.get('asset_num', 'Unknown')}: {e}")
        
        return enhanced_predictions
