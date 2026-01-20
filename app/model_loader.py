import os
import torch
import numpy as np
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
MODELS_DIR = BASE_DIR / "models"
MODEL_FILE = MODELS_DIR / "BrainAgeResNet(RawT1-Ice-TransferLearningOnIXI).pt"

_model = None

def load_model():
    global _model
    if _model is not None:
        return _model
    if not MODEL_FILE.exists():
        raise FileNotFoundError(f"Model file not found: {MODEL_FILE}")
    _model = torch.load(MODEL_FILE, map_location=torch.device("cpu"))
    _model.eval()
    return _model

def predict_age(volume_array: np.ndarray) -> float:
    model = load_model()
    tensor = torch.tensor(volume_array, dtype=torch.float32).unsqueeze(0).unsqueeze(0)
    with torch.no_grad():
        pred = model(tensor).cpu().numpy().ravel()[0]
    return float(pred)
