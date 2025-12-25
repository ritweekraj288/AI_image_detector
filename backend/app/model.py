import os
import torch
import gdown
from transformers import AutoImageProcessor, AutoModelForImageClassification

DEVICE = "cuda" if torch.cuda.is_available() else "cpu"

MODEL_ROOT = "vit-ai-image-detector"
MODEL_ZIP = "model.zip"

GDRIVE_URL = "https://drive.google.com/uc?id=1mjxVrAVhFVtokSSCLHBnPI2nX5-EQ3q0"

# Download ZIP if needed
if not os.path.exists(MODEL_ZIP):
    print("Downloading model ZIP from Google Drive...")
    gdown.download(GDRIVE_URL, MODEL_ZIP, quiet=False)

# Unzip only if model folder missing
if not os.path.exists(os.path.join(MODEL_ROOT, "config.json")):
    print("Extracting model...")
    os.system(f"unzip -o {MODEL_ZIP}")

print("Loading model...")
image_processor = AutoImageProcessor.from_pretrained(MODEL_ROOT)
model = AutoModelForImageClassification.from_pretrained(MODEL_ROOT)

model.to(DEVICE)
model.eval()
