from twilio.rest import Client
import os
from dotenv import load_dotenv

load_dotenv()  # Loads variables from .env

account_sid = os.environ.get("TWILIO_ACCOUNT_SID")
auth_token = os.environ.get("TWILIO_AUTH_TOKEN")
client = Client(account_sid, auth_token)

message = client.messages.create(
    body="Test message from Twilio",
    from_=os.environ.get("TWILIO_PHONE_NUMBER"),
    to="+916281438990"  # Replace with your mobile number
)
print("Message SID:", message.sid)