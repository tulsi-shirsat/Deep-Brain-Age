from pydantic import BaseModel
from datetime import datetime

class PredictResponse(BaseModel):
    predicted_brain_age: float
    confidence_score: float
    mean_absolute_error: float
    processing_time_ms: int
    status: str
    analysis_date: datetime
