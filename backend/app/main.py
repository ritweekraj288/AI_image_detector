from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import torch
import io
import os

from app.model import load_model
from app.utils import preprocess_image

app = FastAPI(title="AI Image Detector API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup():
    load_model()  # LOAD ONCE

@app.get("/")
def health_check():
    return {"status": "API is running"}

@app.post("/predict")
async def predict_image(file: UploadFile = File(...)):
    try:
        image_bytes = await file.read()
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")

        pixel_values = preprocess_image(image)
        model, _ = load_model()

        with torch.no_grad():
            outputs = model(pixel_values)
            probs = torch.softmax(outputs.logits, dim=1)

        confidence, pred = torch.max(probs, dim=1)
        label = model.config.id2label[pred.item()]

        return {
            "prediction": label,
            "confidence": round(confidence.item() * 100, 2)
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
