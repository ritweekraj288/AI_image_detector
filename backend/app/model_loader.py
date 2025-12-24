import os
import gdown
import torch

MODEL_ID = os.getenv("MODEL_GDRIVE_FILE_ID")
if MODEL_ID is None:
    raise RuntimeError("MODEL_GDRIVE_FILE_ID environment variable not set")

# Where the model will be saved
MODEL_PATH = "/opt/render/project/.cache/model.pth"

def download_model():
    if not os.path.exists(MODEL_PATH):
        os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)
        print("Downloading model from Google Drive...")
        gdown.download(
            f"https://drive.google.com/uc?id={MODEL_ID}",
            MODEL_PATH,
            quiet=False
        )
    else:
        print("Model already exists, skipping download")
    return MODEL_PATH

def load_model():
    download_model()
    model = torch.load(MODEL_PATH, map_location="cpu")  # change "cpu" to "cuda" if using GPU
    model.eval()
    return model
