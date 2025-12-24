from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import torch

from app.model import model
from app.utils import preprocess_image

app = FastAPI(title="AI Image Detector API")

# Allow React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten in production
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def health_check():
    return {"status": "API is running"}

@app.post("/predict")
async def predict_image(file: UploadFile = File(...)):
    image = Image.open(file.file)

    pixel_values = preprocess_image(image)

    with torch.no_grad():
        outputs = model(pixel_values)
        logits = outputs.logits
        probs = torch.softmax(logits, dim=1)

    confidence, pred = torch.max(probs, dim=1)

    label = model.config.id2label[pred.item()]

    return {
        "prediction": label,
        "confidence": round(confidence.item() * 100, 2)
    }
