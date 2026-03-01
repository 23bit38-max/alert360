from ultralytics import YOLO
import logging

def detect_accident_classes(model: YOLO):
    accident_class_ids = [
        idx for idx, name in model.names.items() if "accident" in name.lower()
    ]
    accident_class_names = [
        name for name in model.names.values() if "accident" in name.lower()
    ]
    logging.info("Accident classes found: %s", accident_class_names)
    if not accident_class_ids:
        logging.error("❌ No class containing 'accident' found in model.names.")
        raise ValueError("No accident classes found in the model")
    return accident_class_ids, accident_class_names