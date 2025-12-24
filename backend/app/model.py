import torch
from transformers import AutoImageProcessor, AutoModelForImageClassification

MODEL_PATH = "vit-ai-image-detector"
DEVICE = "cuda" if torch.cuda.is_available() else "cpu"

image_processor = AutoImageProcessor.from_pretrained(MODEL_PATH)
model = AutoModelForImageClassification.from_pretrained(MODEL_PATH)

model.to(DEVICE)
model.eval()
