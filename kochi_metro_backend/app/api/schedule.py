from fastapi import APIRouter, HTTPException, BackgroundTasks
from app.schemas.schedule import (
    ScheduleRequest, ScheduleResponse, ModelEvaluationResponse, 
    TaskResponse, TaskStatus, EvaluationSummary, AllEvaluationsResponse
)
from app.core.rules import get_eligible_trains
from app.core.optimizer import get_optimized_schedule
from app.ml.pipeline import risk_predictor
from app.core.task_manager import get_task_status, get_latest_evaluation, get_all_completed_tasks
import traceback
import uuid

router = APIRouter()

@router.post(
    "/v1/generate-schedule", 
    response_model=ScheduleResponse, 
    tags=["Scheduling"]
)
async def generate_schedule(request: ScheduleRequest):
    """
    This endpoint runs the full train induction planning pipeline.
    """
    try:
        eligible_assets, ineligible_assets = await get_eligible_trains()
        
        if not eligible_assets:
            return get_optimized_schedule([], ineligible_assets, 0)

        eligible_assets_with_risk = risk_predictor.predict_risk(eligible_assets)
        
        schedule = get_optimized_schedule(
            eligible_assets_with_risk, 
            ineligible_assets, 
            request.num_trains_for_service
        )
        return schedule
    except Exception as e:
        print(f"An error occurred in generate_schedule: {e}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="An unexpected error occurred.")

@router.post(
    "/v1/evaluate-model", 
    response_model=TaskResponse, 
    tags=["ML Admin"]
)
async def evaluate_model_endpoint(background_tasks: BackgroundTasks):
    """
    Evaluates the current model's performance on a held-out test set
    and returns key performance metrics. This also retrains the production
    model on all available data.
    """
    try:
        task_id = str(uuid.uuid4())
        background_tasks.add_task(risk_predictor.train_and_evaluate, task_id)
        return {"task_id": task_id, "message": "Model evaluation started in background"}
    except Exception as e:
        print(f"An error occurred during evaluation: {e}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Failed to evaluate model.")

@router.post(
    "/v1/train-model", 
    response_model=TaskResponse,
    tags=["ML Admin"]
)
async def train_model_endpoint(background_tasks: BackgroundTasks):
    """
    Trains the model on all available data without evaluation.
    This is useful when you want to quickly update the model with new data.
    """
    try:
        task_id = str(uuid.uuid4())
        background_tasks.add_task(risk_predictor.train_model, task_id)
        return {"task_id": task_id, "message": "Model training started in background"}
    except Exception as e:
        print(f"An error occurred during training: {e}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Failed to train model.")

@router.get(
    "/v1/model-status/{task_id}", 
    tags=["ML Admin"],
    response_model=TaskStatus
)
async def get_model_training_status(task_id: str):
    """
    Get the status of a model training/evaluation task.
    """
    status = get_task_status(task_id)
    if not status:
        raise HTTPException(status_code=404, detail="Task not found")
    
    return status

@router.get(
    "/v1/model-evaluation/latest",
    tags=["ML Admin"],
    response_model=EvaluationSummary
)
async def get_latest_model_evaluation():
    """
    Get the latest model evaluation results.
    """
    evaluation = get_latest_evaluation()
    if not evaluation:
        raise HTTPException(status_code=404, detail="No evaluation results found")
    
    return evaluation

@router.get(
    "/v1/model-evaluation/all",
    tags=["ML Admin"],
    response_model=AllEvaluationsResponse
)
async def get_all_model_evaluations():
    """
    Get all completed model evaluations and training tasks.
    """
    latest = get_latest_evaluation()
    completed = get_all_completed_tasks()
    
    return {
        "latest_evaluation": latest,
        "completed_tasks": completed
    }