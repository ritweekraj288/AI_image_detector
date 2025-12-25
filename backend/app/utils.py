from PIL import Image
import torch
from app.model import load_model, DEVICE

def preprocess_image(image: Image.Image):
    _, image_processor = load_model()
    image = image.convert("RGB")
    inputs = image_processor(image, return_tensors="pt")
    return inputs["pixel_values"].to(DEVICE)
