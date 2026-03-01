FROM python:3.10-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Install system dependencies (needed for OpenCV headless etc)
RUN apt-get update && apt-get install -y \
    libgl1 \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy dependencies
COPY requirements.txt .

# Install dependencies (upgrade pip first)
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application
COPY app/ app/
COPY core/ core/
COPY detection/ detection/
COPY services/ services/
COPY models/ models/

# Setup storage directories
RUN mkdir -p storage/uploads storage/frames storage/outputs && chmod -R 777 storage/

# Expose port
EXPOSE 8000

# Start up command
CMD ["uvicorn", "app.api:app", "--host", "0.0.0.0", "--port", "8000"]
