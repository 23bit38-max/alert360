import os

class Settings:
    CONFIDENCE_THRESHOLD = 0.65
    IOU_THRESHOLD = 0.45
    MODEL_DIR = "models/accident-detection"
    ACTIVE_VERSION = "v1"

    @classmethod
    def get_model_path(cls):
        return os.path.join(cls.MODEL_DIR, cls.ACTIVE_VERSION, "best.pt")

settings = Settings()
