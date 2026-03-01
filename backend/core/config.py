import os
from dotenv import load_dotenv

def load_environment():
    """Load environment variables from .env file."""
    load_dotenv()
    # No strictly required vars for the core model logic in its current minimal state.
    # Optional vars can be checked per-service if added back.
    pass