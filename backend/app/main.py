import cv2
import os
import logging
from collections import deque
from services.cloudinary_service import upload_accident_image
from services.firestore_service import update_accident

logger = logging.getLogger(__name__)

def annotate_frame(image, results, model, class_ids):
    """
    Draws ultra-professional HUD bounding boxes. 
    Accidents get full red boxes with overlays. Regular objects get minimalist corners.
    Coordinates are clipped to prevent off-screen floating visual artifacts.
    """
    annotated_img = image.copy()
    h, w = image.shape[:2]
    
    for r in results:
        boxes = r.boxes
        for box in boxes:
            x1, y1, x2, y2 = map(int, box.xyxy[0])
            
            # Clip coords to frame to prevent out-of-bounds messy artifact lines
            x1, y1 = max(0, x1), max(0, y1)
            x2, y2 = min(w, x2), min(h, y2)
            
            # Prevent invalid dimensions
            if x2 <= x1 or y2 <= y1:
                continue

            cls_id = int(box.cls[0].item())
            conf = float(box.conf[0].item())
            is_accident = cls_id in class_ids
            
            # Professional Short Labels
            full_label = model.names[cls_id].upper()
            short_label = full_label[:3].replace(" ", "")
            
            if is_accident:
                label_text = f"ACC {conf:.0%}"
                color = (0, 0, 255) # Bright Red
            else:
                label_text = short_label
                color = (0, 255, 120) # Tactical Green
                
            if is_accident:
                # Full red box for true accidents
                cv2.rectangle(annotated_img, (x1, y1), (x2, y2), color, 2)
                # Subtle red fill overlay
                overlay = annotated_img.copy()
                cv2.rectangle(overlay, (x1, y1), (x2, y2), color, -1)
                cv2.addWeighted(overlay, 0.15, annotated_img, 0.85, 0, annotated_img)
            else:
                # Precision HUD corners only for standard traffic (eliminates childish clutter)
                length = 8
                thick = 1
                cv2.line(annotated_img, (x1, y1), (min(x1+length, x2), y1), color, thick)
                cv2.line(annotated_img, (x1, y1), (x1, min(y1+length, y2)), color, thick)
                cv2.line(annotated_img, (x2, y1), (max(x2-length, x1), y1), color, thick)
                cv2.line(annotated_img, (x2, y1), (x2, min(y1+length, y2)), color, thick)
                cv2.line(annotated_img, (x1, y2), (min(x1+length, x2), y2), color, thick)
                cv2.line(annotated_img, (x1, y2), (x1, max(y2-length, y1)), color, thick)
                cv2.line(annotated_img, (x2, y2), (max(x2-length, x1), y2), color, thick)
                cv2.line(annotated_img, (x2, y2), (x2, max(y2-length, y1)), color, thick)

            # Ultra-clean small tag
            font = cv2.FONT_HERSHEY_SIMPLEX
            font_scale = 0.35 if is_accident else 0.25
            
            # Get text dimensions for solid black background plate
            (tw, th), _ = cv2.getTextSize(label_text, font, font_scale, 1)
            
            bg_y1 = max(0, y1 - th - 4)
            if bg_y1 > 0:
                cv2.rectangle(annotated_img, (x1, bg_y1), (min(w, x1 + tw + 2), y1), (0, 0, 0), -1)
                text_pos = (x1 + 1, y1 - 2)
            else:
                cv2.rectangle(annotated_img, (x1, y1), (min(w, x1 + tw + 2), y1 + th + 4), (0, 0, 0), -1)
                text_pos = (x1 + 1, y1 + th + 2)
                
            text_col = (255, 255, 255) if is_accident else color
            cv2.putText(annotated_img, label_text, text_pos, font, font_scale, text_col, 1, cv2.LINE_AA)

    return annotated_img



def process_image(file_path, model, class_ids, visualize=False, output_path=None, accident_id=None, enable_email=True, enable_sms=True, enable_call=True):
    """
    Process a single image for accident detection.
    """
    try:
        img = cv2.imread(file_path)
        if img is None:
            return {"error": "Failed to read image"}

        # Run inference
        results = model(img)
        
        accident_detected = False
        best_confidence = 0.0
        label = "No Accident"

        # Check results
        for r in results:
            boxes = r.boxes
            for box in boxes:
                cls_id = int(box.cls[0])
                conf = float(box.conf[0])
                
                if cls_id in class_ids:
                    accident_detected = True
                    if conf > best_confidence:
                        best_confidence = conf
                        label = model.names[cls_id]

        # Handle Snapshots and DB
        before_url = None
        after_url = None

        if accident_detected and accident_id:
            # 1. Upload RAW image as BEFORE to Cloudinary
            before_url = upload_accident_image(file_path, accident_id, "before")
            
            # 2. Generate and Upload ANNOTATED image as AFTER to Cloudinary
            if output_path:
                annotated_frame = annotate_frame(img, results, model, class_ids)
                cv2.imwrite(output_path, annotated_frame)
                
                after_url = upload_accident_image(output_path, accident_id, "after")
                
                # Cleanup local annotated file
                if after_url:
                    try: os.remove(output_path)
                    except: pass
            
            # 3. Save both to Firestore
            if before_url or after_url:
                update_accident(accident_id, {
                    "beforeImageUrl": before_url,
                    "afterImageUrl": after_url,
                    "status": "pending"
                })
                
                # DISPATCH SYSTEM ALERTS
                import threading
                from services.notification_service import dispatch_immediate_alerts, dispatch_detailed_email
                
                print(f"DEBUG: [Image] Attempting to spawn dispatch threads for {accident_id}")
                if enable_sms or enable_call:
                    print(f"DEBUG: Spawning Immediate Alert Thread (SMS={enable_sms}, Call={enable_call})")
                    threading.Thread(
                        target=dispatch_immediate_alerts,
                        args=(accident_id, label, best_confidence, after_url or before_url or "Unavailable", enable_sms, enable_call),
                        daemon=True
                    ).start()
                if enable_email:
                    print(f"DEBUG: Spawning Detailed Email Thread for {accident_id}")
                    threading.Thread(
                        target=dispatch_detailed_email,
                        args=(accident_id, label, best_confidence, before_url or "Unavailable", after_url or "Unavailable"),
                        daemon=True
                    ).start()
        
        # Cleanup source upload
        try: os.remove(file_path)
        except: pass
            
        return {
            "accident_detected": accident_detected,
            "best_confidence": best_confidence,
            "label": label,
            "boxes": [box.xyxy[0].tolist() for r in results for box in r.boxes],
            "before_snapshot_url": before_url,
            "after_snapshot_url": after_url,
            "image_url": after_url or before_url # Compatibility
        }

    except Exception as e:
        logger.error(f"Error processing image: {e}")
        return {"error": str(e)}


def generate_frames(video_path, model, class_ids, status_tracker=None, enable_email=True, enable_sms=True, enable_call=True):
    """
    Generator function to yield MJPEG frames from a video file.
    Runs YOLO inference on frames and updates status_tracker.
    """
    cap = cv2.VideoCapture(video_path)
    
    if not cap.isOpened():
        logger.error(f"Could not open video: {video_path}")
        if status_tracker:
            status_tracker["status"] = "error"
        return

    # Update status to processing
    if status_tracker:
        status_tracker["status"] = "processing"
        status_tracker["label"] = "Analyzing..."

    frame_count = 0
    fps = cap.get(cv2.CAP_PROP_FPS) or 30
    
    # Buffer for "before" snapshot (e.g., 2 seconds window)
    buffer_size = int(fps * 2) 
    frame_buffer = deque(maxlen=buffer_size)
    
    accident_start_frame = None
    after_snapshot_frame_index = None
    
    try:
        while True:
            success, raw_frame = cap.read()
            if not success:
                break

            frame_count += 1
            
            # Run inference
            results = model(raw_frame)
            
            # Annotate frame with custom colors
            annotated_frame = annotate_frame(raw_frame, results, model, class_ids)
            
            # Check for accidents
            is_accident = False
            max_conf = 0.0
            current_label = "No Accident"

            for r in results:
                boxes = r.boxes
                for box in boxes:
                    cls_id = int(box.cls[0])
                    conf = float(box.conf[0])
                    
                    if cls_id in class_ids:
                        is_accident = True
                        if conf > max_conf:
                            max_conf = conf
                            current_label = model.names[cls_id]

            # Update status
            if status_tracker:
                status_tracker["accident_detected"] = status_tracker["accident_detected"] or is_accident
                status_tracker["boxes"] = [box.xyxy[0].tolist() for r in results for box in r.boxes]
                if is_accident:
                     status_tracker["label"] = current_label
                     if max_conf > status_tracker["confidence"]:
                         status_tracker["confidence"] = max_conf
                
                # Snapshot Logic
                # 1. Detect accident start
                if is_accident and accident_start_frame is None:
                    accident_start_frame = frame_count
                    acc_id = status_tracker.get("accident_id", "unknown")
                    
                    # Oldest frame in buffer represents "before"
                    before_frame = frame_buffer[0] if len(frame_buffer) > 0 else annotated_frame
                        
                    snap_path_before = os.path.join("storage", "outputs", f"{acc_id}_before.jpg")
                    cv2.imwrite(snap_path_before, before_frame)
                    
                    # Upload to Cloudinary
                    cloudinary_url = upload_accident_image(snap_path_before, acc_id, "before")
                    status_tracker["before_snapshot_url"] = cloudinary_url
                    
                    # IMMEDIATELY SAVE TO FIRESTORE
                    if cloudinary_url and acc_id != "unknown":
                        update_accident(acc_id, {"beforeImageUrl": cloudinary_url})
                        
                        # DISPATCH SYSTEM ALERTS IMMEDIATELY
                        if enable_sms or enable_call:
                            import threading
                            from services.notification_service import dispatch_immediate_alerts
                            print(f"DEBUG: [Video] Spawning Immediate Alert Thread for {acc_id}")
                            threading.Thread(
                                target=dispatch_immediate_alerts,
                                args=(acc_id, status_tracker.get("label", "Unknown"), status_tracker.get("confidence", 0.0), status_tracker.get("before_snapshot_url", "Unavailable"), enable_sms, enable_call),
                                daemon=True
                            ).start()
                    
                    # Cleanup local if uploaded
                    if cloudinary_url:
                        try: os.remove(snap_path_before)
                        except: pass
                    
                    # Schedule AFTER snapshot (e.g. 2 seconds / 60 frames later)
                    after_snapshot_frame_index = frame_count + int(fps * 2)

                # 2. Capture after snapshot
                if after_snapshot_frame_index and frame_count >= after_snapshot_frame_index:
                    if not status_tracker.get("after_snapshot_url"):
                        acc_id = status_tracker.get("accident_id", "unknown")
                        snap_path_after = os.path.join("storage", "outputs", f"{acc_id}_after.jpg")
                        cv2.imwrite(snap_path_after, annotated_frame)
                        
                        # Upload to Cloudinary
                        cloudinary_url_after = upload_accident_image(snap_path_after, acc_id, "after")
                        status_tracker["after_snapshot_url"] = cloudinary_url_after
                        
                        # IMMEDIATELY SAVE TO FIRESTORE
                        if cloudinary_url_after and acc_id != "unknown":
                            update_accident(acc_id, {"afterImageUrl": cloudinary_url_after})

                            # DISPATCH HTML EMAIL
                            if enable_email:
                                import threading
                                from services.notification_service import dispatch_detailed_email
                                threading.Thread(
                                    target=dispatch_detailed_email,
                                    args=(acc_id, status_tracker.get("label", "Unknown"), status_tracker.get("confidence", 0.0), status_tracker.get("before_snapshot_url", "Unavailable"), cloudinary_url_after),
                                    daemon=True
                                ).start()

                        # Cleanup local if uploaded
                        if cloudinary_url_after:
                            try: os.remove(snap_path_after)
                            except: pass

            frame_buffer.append(raw_frame)

            # Encode frame to JPEG
            ret, buffer = cv2.imencode('.jpg', annotated_frame)
            if not ret:
                continue
                
            frame_bytes = buffer.tobytes()
            
            # Yield frame for streaming
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')

    except Exception as e:
        logger.error(f"Error in video generation: {e}")
        if status_tracker:
            status_tracker["status"] = "error"
            
    finally:
        cap.release()
        
        # DELETE THE SOURCE VIDEO AS REQUESTED
        if os.path.exists(video_path):
            try:
                os.remove(video_path)
                logger.info(f"Storage Cleanup: Deleted video {video_path}")
            except Exception as e:
                logger.error(f"Cleanup error for {video_path}: {e}")

        if status_tracker:
            status_tracker["status"] = "done"
            if not status_tracker.get("label") or status_tracker["label"] == "Analyzing...":
                 status_tracker["label"] = "Analysis Complete"

