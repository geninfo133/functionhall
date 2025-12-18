
import os

TWILIO_ACCOUNT_SID = os.environ.get("TWILIO_ACCOUNT_SID", "")
TWILIO_AUTH_TOKEN = os.environ.get("TWILIO_AUTH_TOKEN", "")
TWILIO_PHONE_NUMBER = os.environ.get("TWILIO_PHONE_NUMBER", "")
SMS_ENABLED = os.environ.get("SMS_ENABLED", "False").lower() == "true"

print(f"DEBUG: SMS_ENABLED={os.environ.get('SMS_ENABLED')} (raw), SMS_ENABLED (bool)={SMS_ENABLED}")