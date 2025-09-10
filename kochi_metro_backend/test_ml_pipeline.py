import asyncio
import uuid
from app.db.client import db
from app.ml.pipeline import risk_predictor
from app.core.task_manager import get_task_status
import time

async def test_pipeline():
    """
    Tests the complete ML pipeline from training to evaluation
    and prediction. This is useful for troubleshooting.
    """
    print("Connecting to database...")
    await db.connect()
    
    # Check if we have training data
    count = await db.historical_outcomes.count()
    print(f"Found {count} training records in database")
    
    if count < 20:
        print("Not enough training data. Please run load_training_data.py first.")
        return
    
    # Test training
    print("\n=== Testing Model Training ===")
    train_task_id = str(uuid.uuid4())
    print(f"Starting training with task ID: {train_task_id}")
    
    # Start the training process
    asyncio.create_task(risk_predictor.train_model(train_task_id))
    
    # Monitor the training progress
    while True:
        status = get_task_status(train_task_id)
        if status and status["progress"] == 100:
            print(f"\nTraining complete: {status}")
            break
        elif status:
            print(f"Training progress: {status['status']} ({status['progress']}%)", end="\r")
        time.sleep(1)
    
    # Test evaluation
    print("\n\n=== Testing Model Evaluation ===")
    eval_task_id = str(uuid.uuid4())
    print(f"Starting evaluation with task ID: {eval_task_id}")
    
    # Start the evaluation process
    asyncio.create_task(risk_predictor.train_and_evaluate(eval_task_id))
    
    # Monitor the evaluation progress
    while True:
        status = get_task_status(eval_task_id)
        if status and status["progress"] == 100:
            print(f"\nEvaluation complete: {status}")
            
            if "result" in status and "error" not in status["result"]:
                print("\nModel Evaluation Metrics:")
                for key, value in status["result"].items():
                    print(f"  {key}: {value}")
            break
        elif status:
            print(f"Evaluation progress: {status['status']} ({status['progress']}%)", end="\r")
        time.sleep(1)
    
    # Test prediction
    print("\n\n=== Testing Prediction ===")
    test_assets = [
        {"asset_num": "TRAIN-001", "current_mileage": 50000, "days_since_maint": 30},
        {"asset_num": "TRAIN-002", "current_mileage": 100000, "days_since_maint": 90},
        {"asset_num": "TRAIN-003", "current_mileage": 20000, "days_since_maint": 10}
    ]
    
    assets_with_risk = risk_predictor.predict_risk(test_assets)
    print("\nPrediction Results:")
    for asset in assets_with_risk:
        print(f"  {asset['asset_num']}: Risk Score = {asset['risk_score']} " +
              f"(Mileage: {asset['current_mileage']}, Days since maint: {asset.get('days_since_maint', 15)})")
    
    # Disconnect from DB
    await db.disconnect()
    print("\nTest completed successfully!")

if __name__ == "__main__":
    asyncio.run(test_pipeline())
