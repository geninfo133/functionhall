# SMS Notification Setup Guide

## Overview
The system sends SMS notifications to hall owners when customers submit enquiries.

## Features
- Sends SMS to hall owner's mobile number when an enquiry is submitted
- Includes customer name, phone, email, and message in the SMS
- Works in test mode (console logging) by default
- Easy to enable with Twilio credentials

## Setup Instructions

### 1. Create a Twilio Account
1. Go to https://www.twilio.com/try-twilio
2. Sign up for a free account
3. Verify your phone number

### 2. Get Your Credentials
After signing up, you'll get:
- **Account SID** - Found in your Twilio Console Dashboard
- **Auth Token** - Found in your Twilio Console Dashboard  
- **Phone Number** - Get a free trial number from Console > Phone Numbers

### 3. Configure the Application
Edit `twilio_config.py` and update:

```python
TWILIO_ACCOUNT_SID = 'ACxxxxxxxxxxxxxxxxxxxxx'  # Your Account SID
TWILIO_AUTH_TOKEN = 'your_auth_token_here'      # Your Auth Token
TWILIO_PHONE_NUMBER = '+1234567890'             # Your Twilio phone number
SMS_ENABLED = True  # Change to True to enable SMS sending
```

### 4. Phone Number Format
Hall owner's contact number in the database must be in international format:
- India: `+919876543210`
- US: `+11234567890`

## Testing

### Test Mode (Default)
By default, `SMS_ENABLED = False`, so messages are only logged to console:
```
📱 SMS (disabled): To +919876543210
   Message: New Enquiry from John Doe...
```

### Live Mode
Set `SMS_ENABLED = True` in `twilio_config.py` to send actual SMS messages.

## Twilio Free Trial Limitations
- You get $15 free credit
- Can only send SMS to verified phone numbers
- SMS will have "Sent from your Twilio trial account" prefix

To remove limitations, upgrade to a paid account.

## Troubleshooting

### "Phone number not verified"
- In trial mode, you must verify recipient numbers in Twilio Console
- Go to Console > Phone Numbers > Verified Caller IDs

### "Invalid phone number format"
- Ensure phone numbers are in E.164 format: +[country code][number]
- Example: +919876543210 (India), +11234567890 (US)

### Check SMS Logs
- Login to Twilio Console
- Go to Messaging > Logs > Messages
- View all sent messages and their status

## Cost
After free trial:
- SMS to India: ~₹0.50-1 per message
- SMS to US: ~$0.0075 per message

## Support
For issues:
1. Check Flask backend console for error messages
2. Verify Twilio credentials are correct
3. Ensure phone numbers are in correct format
4. Check Twilio Console logs
