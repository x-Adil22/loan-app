from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import pandas as pd
import shap
import numpy as np

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model
try:
    model = joblib.load('model.pkl')
    explainer = shap.TreeExplainer(model)
except Exception as e:
    model = None
    explainer = None
    print(f"Failed to load model: {e}")

class LoanApplication(BaseModel):
    Age: int
    Income: float
    Credit_Score: int
    Loan_Amount: float
    Employment_Status: int
    Previous_Defaults: int

@app.get("/")
def read_root():
    return {"status": "Backend running", "model_loaded": model is not None}

@app.post("/api/predict")
def predict_loan(app_data: LoanApplication):
    if model is None:
        raise HTTPException(status_code=500, detail="Model not loaded")
        
    data = pd.DataFrame([app_data.dict()])
    
    # Model prediction
    try:
        prob = model.predict_proba(data)[0][1]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
        
    prediction = int(prob > 0.5)
    
    # SHAP local explanation
    shap_values = explainer.shap_values(data)
    
    # Binary classification SHAP values format can vary depends on sklearn / shap version
    if isinstance(shap_values, list):
        if len(shap_values) > 1:
            local_shap = shap_values[1][0].tolist()
            expected_value = explainer.expected_value[1]
        else:
            local_shap = shap_values[0][0].tolist()
            expected_value = explainer.expected_value[0]
    else:
        # shap returns an array shape (1, n_features, 2) in latest version or just (1, n_features)
        if len(shap_values.shape) == 3:
            local_shap = shap_values[0, :, 1].tolist()
            if isinstance(explainer.expected_value, list):
                expected_value = explainer.expected_value[1]
            elif isinstance(explainer.expected_value, np.ndarray):
                expected_value = explainer.expected_value[1]
            else:
                expected_value = explainer.expected_value
        else:
            local_shap = shap_values[0].tolist()
            if isinstance(explainer.expected_value, (list, np.ndarray)):
                expected_value = explainer.expected_value[1] if len(explainer.expected_value) > 1 else explainer.expected_value[0]
            else:
                expected_value = explainer.expected_value

    # Format the SHAP explanation
    shap_series = pd.Series(local_shap, index=data.columns)
    
    features_explanation = []
    for feature in data.columns:
        features_explanation.append({
            "feature": feature,
            "value": float(data[feature].iloc[0]),
            "contribution": float(shap_series[feature])
        })
        
    return {
        "prediction": "Approved" if prediction == 1 else "Rejected",
        "probability": float(prob),
        "expected_value": float(expected_value),
        "shap_values": features_explanation
    }
