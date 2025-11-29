# Twilio Configuration
# Get your Account SID and Auth Token from https://www.twilio.com/console
# Get your Twilio phone number from https://www.twilio.com/console/phone-numbers

import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

TWILIO_ACCOUNT_SID = os.getenv('TWILIO_ACCOUNT_SID', '')
TWILIO_AUTH_TOKEN = os.getenv('TWILIO_AUTH_TOKEN', '')
TWILIO_PHONE_NUMBER = os.getenv('TWILIO_PHONE_NUMBER', '+15074739939')

# Set to True to enable SMS sending, False to just log messages
SMS_ENABLED = os.getenv('SMS_ENABLED', 'True') == 'True'

