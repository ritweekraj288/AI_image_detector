from PIL import Image
import torch
from app.model import image_processor, DEVICE

def preprocess_image(image: Image.Image):
    image = image.convert("RGB")
    inputs = image_processor(image, return_tensors="pt")
    return inputs["pixel_values"].to(DEVICE)
