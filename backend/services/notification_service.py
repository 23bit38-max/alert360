import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import logging
from twilio.rest import Client

logger = logging.getLogger(__name__)

# State cache to prevent explosive spam on every single video frame
_last_sms_id = None
_last_email_id = None

def get_env_var(key, fallback=""):
    val = os.getenv(key, fallback)
    if not val:
        logger.warning(f"Notification Service: Missing environment variable {key}.")
    return val

# Dedicated persistent log for debugging dispatches
DISPATCH_LOG_PATH = os.path.join("storage", "logs", "dispatch_audit.log")
os.makedirs(os.path.dirname(DISPATCH_LOG_PATH), exist_ok=True)

def audit_log(message: str):
    import datetime
    timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    with open(DISPATCH_LOG_PATH, "a", encoding="utf-8") as f:
        f.write(f"[{timestamp}] {message}\n")
    logger.info(message)

def send_email_alert(subject: str, text_body: str, html_body: str = None):
    """Sends an email alert using SMTP."""
    try:
        smtp_host = get_env_var("EMAIL_HOST", "smtp.gmail.com")
        smtp_port = int(get_env_var("EMAIL_PORT", "587"))
        sender_email = get_env_var("EMAIL_ADDRESS")
        sender_password = get_env_var("EMAIL_PASSWORD")
        receiver_emails = get_env_var("ALERT_EMAILS").split(",")

        if not sender_email or not sender_password or not receiver_emails:
            logger.error("Email configuration missing. Cannot send email.")
            return False

        msg = MIMEMultipart("alternative")
        msg['From'] = f"Alert360 Emergency System <{sender_email}>"
        msg['To'] = ", ".join(receiver_emails)
        msg['Subject'] = subject
        
        msg.attach(MIMEText(text_body, 'plain'))
        if html_body:
            msg.attach(MIMEText(html_body, 'html'))

        with smtplib.SMTP(smtp_host, smtp_port) as server:
            server.starttls()
            server.login(sender_email, sender_password)
            server.send_message(msg)

        logger.info(f"📧 Emergency Email Alert successfully broadcasted to {len(receiver_emails)} addresses.")
        return True
    except Exception as e:
        logger.error(f"Failed to send email alert: {e}")
        return False

def send_sms_alert(body: str):
    """Sends an SMS alert using Twilio."""
    logger.info(f"📱 Attempting to send SMS: '{body[:50]}...'")
    try:
        account_sid = get_env_var("TWILIO_ACCOUNT_SID")
        auth_token = get_env_var("TWILIO_AUTH_TOKEN")
        from_phone = get_env_var("TWILIO_PHONE_NUMBER")
        to_phones_raw = get_env_var("ALERT_PHONE_NUMBERS")
        
        if not to_phones_raw:
            logger.error("❌ ALERT_PHONE_NUMBERS is empty or missing in .env")
            return False
            
        to_phones = to_phones_raw.split(",")

        if not account_sid or not auth_token or not from_phone or not to_phones:
            logger.error(f"❌ Twilio SMS configuration incomplete: SID={bool(account_sid)}, Token={bool(auth_token)}, From={bool(from_phone)}, ToCount={len(to_phones)}")
            return False

        client = Client(account_sid, auth_token)
        for phone in to_phones:
            phone = phone.strip()
            if phone:
                logger.info(f"📡 Dispatching to {phone} via Twilio...")
                message = client.messages.create(
                    body=body,
                    from_=from_phone,
                    to=phone
                )
                logger.info(f"✅ Emergency SMS dispatched to {phone}. SID: {message.sid}")
        return True
    except Exception as e:
        logger.error(f"💥 Failed to send SMS alert: {e}")
        return False

def send_voice_call_alert(twiml_message: str):
    """Initiates an automated voice call using Twilio."""
    try:
        account_sid = get_env_var("TWILIO_ACCOUNT_SID")
        auth_token = get_env_var("TWILIO_AUTH_TOKEN")
        from_phone = get_env_var("TWILIO_PHONE_NUMBER")
        to_phones = get_env_var("ALERT_PHONE_NUMBERS").split(",")

        if not account_sid or not auth_token or not from_phone or not to_phones:
            logger.error("Twilio Voice configuration missing. Cannot initiate call.")
            return False

        client = Client(account_sid, auth_token)
        for phone in to_phones:
            phone = phone.strip()
            if phone:
                call = client.calls.create(
                    twiml=f"<Response><Say>{twiml_message}</Say></Response>",
                    from_=from_phone,
                    to=phone
                )
                logger.info(f"📞 Emergency Voice Call initiated to {phone}. SID: {call.sid}")
        return True
    except Exception as e:
        logger.error(f"Failed to initiate voice call alert: {e}")
        return False

def dispatch_immediate_alerts(accident_id: str, accident_type: str, confidence: float, snapshot_url: str = "Unavailable", enable_sms: bool = True, enable_call: bool = True):
    """
    Fires SMS and Phone Calls instantly to alert admins without waiting for the 'after' snapshot.
    """
    try:
        audit_log(f"🔔 DISPATCH START: ID={accident_id}, Type={accident_type}, Conf={confidence:.2f}, SMS={enable_sms}")
        
        global _last_sms_id
        if accident_id == _last_sms_id:
            audit_log(f"⚠️ DEDUPLICATED: Alert for {accident_id} already sent. Skipping.")
            return
            
        _last_sms_id = accident_id
        
        conf_pct = round(confidence * 100)
        
        text_body = (
            f"🚨 ALERT360 CRITICAL DISPATCH 🚨\n"
            f"Incident Type: {accident_type.upper()}\n"
            f"Confidence: {conf_pct}%\n"
            f"Incident ID: {accident_id}\n"
            f"View Snapshot: {snapshot_url}"
        )
        
        twiml_script = (
            f"Alert 360 Emergency Dispatch. A {accident_type} has been detected by the AI monitoring system "
            f"with {conf_pct} percent confidence. Please check the dashboard immediately for footage."
        )

        if enable_sms:
            audit_log(f"📤 Triggering SMS dispatch sequence for {accident_id}...")
            result = send_sms_alert(text_body)
            audit_log(f"🏁 SMS send_sms_alert returned: {result}")
        else:
            audit_log(f"⏭️ SMS disabled by flag for {accident_id}.")

        if enable_call:
            audit_log(f"📤 Triggering CALL dispatch sequence for {accident_id}...")
            result = send_voice_call_alert(twiml_script)
            audit_log(f"🏁 CALL send_voice_call_alert returned: {result}")
            
        audit_log(f"✅ DISPATCH COMPLETE for {accident_id}")
        
    except Exception as e:
        audit_log(f"💥 CRITICAL DISPATCH ERROR: {str(e)}")
        import traceback
        audit_log(traceback.format_exc())

def dispatch_detailed_email(accident_id: str, accident_type: str, confidence: float, before_url: str, after_url: str):
    """
    Broadcasts a professional, high-density, wide-layout operator-level HTML email alert.
    Optimized for desktop command center views.
    """
    global _last_email_id
    if accident_id == _last_email_id:
        return
        
    _last_email_id = accident_id
    import datetime
    now_str = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S UTC")
    conf_pct = round(confidence * 100)
    subject = f"🛑 OPERATIONAL PRIORITY 1: {accident_type.upper().replace('_', ' ')} INGESTION [{conf_pct}% CONF]"

    html_body = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700&family=JetBrains+Mono:wght@400;700&family=Inter:wght@400;600;800&display=swap');
            
            body {{ background-color: #0f172a; color: #cbd5e1; font-family: 'Inter', sans-serif; margin: 0; padding: 0; -webkit-font-smoothing: antialiased; }}
            .email-wrapper {{ width: 100%; table-layout: fixed; padding: 40px 0; background-color: #020617; }}
            .main-container {{ width: 900px; margin: 0 auto; background: #1e293b; border-radius: 8px; overflow: hidden; border: 1px solid #334155; box-shadow: 0 50px 100px -20px rgba(0, 0, 0, 0.7); }}
            
            /* Header Section */
            .header {{ background: #991b1b; padding: 30px 40px; border-bottom: 2px solid #ef4444; }}
            .system-banner {{ font-family: 'Orbitron', sans-serif; color: #fecaca; font-size: 11px; letter-spacing: 5px; text-transform: uppercase; margin-bottom: 5px; }}
            .incident-title {{ color: #ffffff; font-size: 28px; font-weight: 800; text-transform: uppercase; margin: 0; letter-spacing: 1px; }}
            
            /* Status Bar */
            .status-bar {{ background: #0f172a; padding: 15px 40px; border-bottom: 1px solid #334155; display: flex; align-items: center; justify-content: space-between; }}
            .status-pill {{ background: rgba(239, 68, 68, 0.15); border: 1px solid #ef4444; color: #fca5a5; padding: 5px 15px; border-radius: 100px; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; }}
            .timestamp-meta {{ font-family: 'JetBrains Mono', monospace; font-size: 12px; color: #64748b; }}

            /* Technical Metrics Section */
            .technical-metrics {{ padding: 30px 40px; background: #111827; border-bottom: 1px solid #334155; }}
            .metrics-grid {{ width: 100%; border-collapse: collapse; }}
            .metric-cell {{ padding: 15px; background: #1e293b; border: 1px solid #334155; }}
            .metric-label {{ font-size: 10px; color: #64748b; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 4px; font-weight: 700; }}
            .metric-value {{ font-family: 'JetBrains Mono', monospace; color: #f1f5f9; font-size: 14px; font-weight: 700; }}
            
            /* Assets Comparison Section */
            .assets-header {{ padding: 25px 40px 10px; font-size: 13px; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 2px; }}
            .assets-comparison {{ padding: 0 40px 40px; }}
            .asset-grid {{ width: 100%; border-collapse: separate; border-spacing: 20px 0; }}
            .asset-card {{ width: 50%; vertical-align: top; }}
            .asset-label {{ font-size: 11px; font-weight: 700; color: #fca5a5; background: rgba(239, 68, 68, 0.1); padding: 4px 10px; border-radius: 4px; display: inline-block; margin-bottom: 10px; }}
            .image-viewport {{ background: #000; border: 1px solid #475569; border-radius: 4px; overflow: hidden; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.5); }}
            .image-viewport img {{ width: 100%; display: block; }}
            
            /* Action Footer */
            .action-panel {{ background: #0f172a; padding: 40px; text-align: center; border-top: 1px solid #334155; }}
            .action-button {{ background: #3b82f6; color: #ffffff; text-decoration: none; padding: 18px 45px; border-radius: 4px; font-weight: 800; font-size: 13px; text-transform: uppercase; letter-spacing: 2px; display: inline-block; box-shadow: 0 4px 0 #1d4ed8; transition: all 0.2s; }}
            .action-button:hover {{ transform: translateY(-1px); box-shadow: 0 6px 0 #1d4ed8; }}
            
            .legal-footer {{ padding: 30px; text-align: center; color: #475569; font-size: 11px; line-height: 1.8; }}
        </style>
    </head>
    <body>
        <div class="email-wrapper">
            <div class="main-container">
                <div class="header">
                    <div class="system-banner">Alert360 Intelligence Grid</div>
                    <h1 class="incident-title">Critical Incident Detected</h1>
                </div>
                
                <div class="status-bar">
                    <div class="status-pill">Emergency Dispatch Active</div>
                    <div class="timestamp-meta">Event Recorded: {now_str}</div>
                </div>
                
                <div class="technical-metrics">
                    <table class="metrics-grid">
                        <tr>
                            <td class="metric-cell">
                                <div class="metric-label">Object Classification</div>
                                <div class="metric-value" style="color: #ef4444;">{accident_type.upper().replace('_', ' ')}</div>
                            </td>
                            <td class="metric-cell">
                                <div class="metric-label">AI Confidence</div>
                                <div class="metric-value">{conf_pct}%</div>
                            </td>
                            <td class="metric-cell">
                                <div class="metric-label">System Node</div>
                                <div class="metric-value">MAIN_DETECTOR_NODE_01</div>
                            </td>
                        </tr>
                        <tr>
                            <td class="metric-cell" colspan="3">
                                <div class="metric-label">Unique Incident UUID</div>
                                <div class="metric-value">{accident_id}</div>
                            </td>
                        </tr>
                    </table>
                </div>
                
                <div class="assets-header">Visual Evidence Comparison</div>
                <div class="assets-comparison">
                    <table class="asset-grid">
                        <tr>
                            <td class="asset-card">
                                <div class="asset-label">Baseline (T-2s)</div>
                                <div class="image-viewport">
                                    <img src="{before_url}" alt="Baseline Snapshot" />
                                </div>
                            </td>
                            <td class="asset-card">
                                <div class="asset-label" style="color: #93c5fd; background: rgba(59, 130, 246, 0.1);">AI Annotated (T+0s)</div>
                                <div class="image-viewport" style="border-color: #3b82f6;">
                                    <img src="{after_url}" alt="Annotated Capture" />
                                </div>
                            </td>
                        </tr>
                    </table>
                </div>

                <div class="action-panel">
                    <div style="color: #94a3b8; font-size: 13px; margin-bottom: 25px; line-height: 1.6;">
                        This incident has been categorized as <strong>Priority Level 1</strong>.<br/>
                        Immediate situational awareness is required. Verify findings via the Command Interface.
                    </div>
                    <a href="http://localhost:5173/dashboard" class="action-button">Access Operational Dashboard</a>
                </div>
                
                <div class="legal-footer">
                    &copy; 2026 Alert360 Automated Security. All rights reserved.<br/>
                    Confidential Security Transmission. Authorized Personnel Only.<br/>
                    IP Address Tracked: SYSTEM_INTERNAL_LOOPBACK
                </div>
            </div>
        </div>
    </body>
    </html>
    """
    
    send_email_alert(subject, "", html_body)
    logger.info(f"📧 Operator-level wide email dispatch for {accident_id} completed.")
