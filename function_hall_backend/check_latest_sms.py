import sys
import os
sys.path.insert(0, '.')
os.chdir('d:/flask-projects/functionhall/function_hall_backend')

from twilio.rest import Client
from twilio_config import TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN
import time

print("Checking SMS delivery status...")
print("Waiting 5 seconds for Twilio to process...\n")
time.sleep(5)

client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)

message = client.messages('SM60936d2659225b8bbf7b68f4c5df90ee').fetch()

print(f"📱 SMS Status Check:")
print(f"   To: {message.to}")
print(f"   Status: {message.status}")
print(f"   Error Code: {message.error_code}")
print(f"   Error Message: {message.error_message}")

if message.status == 'delivered':
    print(f"\n✅ SMS DELIVERED! Check phone +916281438990")
elif message.status == 'sent':
    print(f"\n⏳ SMS sent, waiting for delivery...")
elif message.status == 'failed':
    print(f"\n❌ SMS FAILED!")
    print(f"   Error: {message.error_code} - {message.error_message}")
else:
    print(f"\n⚠️ Status: {message.status}")
