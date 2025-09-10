from pydantic import BaseModel, Field
from typing import Dict, List, Optional, Any
from datetime import datetime

class AIExplanation(BaseModel):
    summary: str
    technical_reasoning: str
    business_impact: str
    recommended_action: str
    
class AIRefinement(BaseModel):
    original_risk: float
    adjustment_factor: float
    confidence: str
    reasoning: str
    model_used: str

class EnhancedPredictionResponse(BaseModel):
    asset_id: str
    asset_num: str
    final_risk_score: float
    priority_level: str
    risk_factors: List[str]
    
    # AI Enhancement
    ai_explanation: Optional[AIExplanation] = None
    ai_refinement: Optional[AIRefinement] = None
    
    # Technical details
    ml_risk_score: float
    rules_risk_score: float
    days_since_maint: int
    current_mileage: float
    
    # Timestamps
    prediction_timestamp: datetime = Field(default_factory=datetime.now)
    model_version: Optional[str] = None
