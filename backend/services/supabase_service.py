
import os
import logging
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
SUPABASE_BUCKET = os.getenv("SUPABASE_BUCKET", "accidents")

_client = None

def get_supabase() -> Client:
    global _client
    if _client is None:
        if not SUPABASE_URL or not SUPABASE_KEY:
            logging.error("Supabase credentials missing in .env")
            return None
        _client = create_client(SUPABASE_URL, SUPABASE_KEY)
    return _client

def upload_image(file_path: str, remote_name: str):
    client = get_supabase()
    if not client:
        return None
    
    try:
        with open(file_path, "rb") as f:
            # Enforce bucket: accidents
            client.storage.from_("accidents").upload(
                remote_name, f, file_options={"contentType": "image/jpeg"}
            )
        # Get public URL
        res = client.storage.from_("accidents").get_public_url(remote_name)
        # Handle cases where it might return an object (depending on lib version)
        if hasattr(res, 'public_url'):
            return res.public_url
        return str(res)
    except Exception as e:
        # If file already exists, just return the URL (don't fail)
        if "already exists" in str(e):
            res = client.storage.from_("accidents").get_public_url(remote_name)
            if hasattr(res, 'public_url'):
                return res.public_url
            return str(res)
        logging.error(f"Supabase upload failed: {e}")
        return None

def save_media_to_db(accident_id: str, before_url: str = None, after_url: str = None):
    """
    Saves or updates the accidents_media record.
    """
    client = get_supabase()
    if not client: return
    
    try:
        # Check if record exists
        res = client.table("accidents_media").select("*").eq("accident_id", accident_id).execute()
        
        data = {}
        if before_url: data["before_image_url"] = before_url
        if after_url: data["after_image_url"] = after_url
        
        if res.data:
            # Update
            client.table("accidents_media").update(data).eq("accident_id", accident_id).execute()
        else:
            # Insert
            data["accident_id"] = accident_id
            client.table("accidents_media").insert(data).execute()
            
    except Exception as e:
        logging.error(f"Failed to save media to DB: {e}")
