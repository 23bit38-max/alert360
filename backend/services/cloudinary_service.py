import cloudinary
import cloudinary.uploader
import os
from dotenv import load_dotenv

load_dotenv()

# Configuration 
cloudinary.config(
    cloud_name = os.getenv("CLOUDINARY_NAME"),
    api_key = os.getenv("CLOUDINARY_KEY"),
    api_secret = os.getenv("CLOUDINARY_SECRET"),
    secure = True
)

def upload_accident_image(file_source, accident_id: str, image_type: str) -> str:
    """
    Uploads an image to Cloudinary and returns the secure URL.
    file_source: Can be a file path, file-like object, or URL.
    accident_id: The unique ID of the accident.
    image_type: 'before' or 'after'.
    """
    folder_path = f"accidents/{accident_id}/{image_type}"
    
    upload_result = cloudinary.uploader.upload(
        file_source,
        folder = folder_path,
        use_filename = True,
        unique_filename = True,
        resource_type = "image"
    )
    
    return upload_result.get("secure_url")
