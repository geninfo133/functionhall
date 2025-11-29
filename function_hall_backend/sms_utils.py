"""
SMS Utility for sending messages via Twilio
"""
from twilio_config import TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER, SMS_ENABLED

def send_sms(to_number, message):
    """
    Send SMS to a phone number
    
    Args:
        to_number (str): Recipient phone number (format: +919876543210)
        message (str): Message content
    
    Returns:
        dict: Result with 'success' and 'message' keys
    """
    if not SMS_ENABLED:
        print(f"📱 SMS (disabled): To {to_number}")
        print(f"   Message: {message}")
        return {
            'success': True,
            'message': 'SMS sending is disabled. Message logged to console.',
            'sid': 'DISABLED'
        }
    
    try:
        from twilio.rest import Client
        
        client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
        
        sms = client.messages.create(
            body=message,
            from_=TWILIO_PHONE_NUMBER,
            to=to_number
        )
        
        print(f"✅ SMS sent successfully! SID: {sms.sid}")
        return {
            'success': True,
            'message': 'SMS sent successfully',
            'sid': sms.sid
        }
        
    except Exception as e:
        print(f"❌ SMS sending failed: {str(e)}")
        return {
            'success': False,
            'message': f'Failed to send SMS: {str(e)}'
        }
