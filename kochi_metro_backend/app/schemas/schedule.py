from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

# --- Input Schema ---
class ScheduleRequest(BaseModel):
    num_trains_for_service: int = Field(
        ..., 
        gt=0, 
        description="The number of trains required for revenue service."
    )

# --- Output Schemas ---
class TrainDetail(BaseModel):
    asset_num: str
    reason: str
    risk_score: Optional[float] = None

class ScheduleResponse(BaseModel):
    service: List[TrainDetail]
    standby: List[TrainDetail]
    maintenance: List[TrainDetail]

# --- ML Task Schemas ---
class TaskResponse(BaseModel):
    task_id: str
    message: str

class TaskStatus(BaseModel):
    status: str
    progress: int
    result: Optional[Dict[str, Any]] = None

# --- Model Evaluation Schema ---
class ModelEvaluationResponse(BaseModel):
    records_used_for_test: int
    accuracy: float = Field(..., description="Overall percentage of correct predictions.")
    precision: float = Field(..., description="Of all trains we predicted would fail, how many actually failed?")
    recall: float = Field(..., description="Of all the trains that actually failed, how many did we correctly identify?")
    f1_score: float = Field(..., description="A balanced score between precision and recall.")

# --- Evaluation Summary Schema ---
class EvaluationSummary(BaseModel):
    task_id: str
    completed_at: str
    records_used_for_test: int
    accuracy: float
    precision: float
    recall: float
    f1_score: float

class AllEvaluationsResponse(BaseModel):
    latest_evaluation: Optional[EvaluationSummary] = None
    completed_tasks: Dict[str, TaskStatus] = {}

