from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import torch
import os

from app.model_loader import load_model
from app.utils import preprocess_image

app = FastAPI(title="AI Image Detector API")

# Load model if environment variable exists
model = None
try:
    model = load_model()
except RuntimeError as e:
    print(f"Warning: {e}. /predict endpoint will not work until model is set.")

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
    if model is None:
        return {"error": "Model not loaded. Set MODEL_GDRIVE_FILE_ID to enable prediction."}

    image = Image.open(file.file).convert("RGB")
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

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))  # Render assigned port
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=port)
