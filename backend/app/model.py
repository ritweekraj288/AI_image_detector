import os
import torch
import gdown
import zipfile
from transformers import AutoImageProcessor, AutoModelForImageClassification

DEVICE = "cpu"  # FORCE CPU

MODEL_ROOT = "vit-ai-image-detector"
MODEL_ZIP = "model.zip"
GDRIVE_ID = "1mjxVrAVhFVtokSSCLHBnPI2nX5-EQ3q0"

model = None
image_processor = None

def download_and_extract():
    if not os.path.exists(MODEL_ROOT):
        print("⬇️ Downloading model from Google Drive...")
        url = f"https://drive.google.com/uc?id={GDRIVE_ID}"
        gdown.download(url, MODEL_ZIP, quiet=False)

        print("📦 Extracting model...")
        with zipfile.ZipFile(MODEL_ZIP, "r") as zip_ref:
            zip_ref.extractall(".")

def load_model():
    global model, image_processor

    if model is None:
        download_and_extract()

        print("🧠 Loading model...")
        image_processor = AutoImageProcessor.from_pretrained(MODEL_ROOT)
        model = AutoModelForImageClassification.from_pretrained(MODEL_ROOT)

        model.to(DEVICE)
        model.eval()

    return model, image_processor
