import os
import torch
import gdown
from transformers import AutoImageProcessor, AutoModelForImageClassification

DEVICE = "cuda" if torch.cuda.is_available() else "cpu"

MODEL_DIR = "vit-ai-image-detector"
MODEL_ZIP = "model.zip"

GDRIVE_URL = "https://drive.google.com/uc?id=1mjxVrAVhFVtokSSCLHBnPI2nX5-EQ3q0"

# Download & extract model if not present
if not os.path.exists(MODEL_DIR):
    print("Downloading model from Google Drive...")
    gdown.download(GDRIVE_URL, MODEL_ZIP, quiet=False)
    os.system(f"unzip {MODEL_ZIP} -d .")

print("Loading model...")
image_processor = AutoImageProcessor.from_pretrained(MODEL_DIR)
model = AutoModelForImageClassification.from_pretrained(MODEL_DIR)

model.to(DEVICE)
model.eval()
