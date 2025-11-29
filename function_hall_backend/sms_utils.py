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
    print(f"\n{'='*60}")
    print(f"📱 SENDING SMS")
    print(f"{'='*60}")
    print(f"To: {to_number}")
    print(f"From: {TWILIO_PHONE_NUMBER}")
    print(f"Message Preview: {message[:100]}...")
    print(f"{'='*60}\n")
    
    if not SMS_ENABLED:
        print(f"⚠️ SMS DISABLED - Message logged only")
        print(f"Full Message:\n{message}\n")
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
        
        print(f"✅ SMS SENT SUCCESSFULLY!")
        print(f"   SID: {sms.sid}")
        print(f"   Status: {sms.status}")
        print(f"   To: {sms.to}")
        print(f"   From: {sms.from_}")
        print(f"\n⚠️ IMPORTANT: For Twilio Trial accounts:")
        print(f"   - This number ({to_number}) must be verified in Twilio console")
        print(f"   - Visit: https://console.twilio.com/us1/develop/phone-numbers/manage/verified")
        print(f"   - Check delivery status: https://console.twilio.com/us1/monitor/logs/sms")
        print(f"   - Search for SID: {sms.sid}\n")
        
        return {
            'success': True,
            'message': 'SMS sent successfully',
            'sid': sms.sid,
            'status': sms.status,
            'to': sms.to
        }
        
    except Exception as e:
        error_msg = str(e)
        print(f"❌ SMS SENDING FAILED!")
        print(f"   Error: {error_msg}")
        
        # Check for common errors
        if "30034" in error_msg:
            print(f"   → Error 30034: 'To' number is not a valid phone number")
            print(f"   → Check phone number format: {to_number}")
        elif "21211" in error_msg:
            print(f"   → Error 21211: Invalid 'To' phone number")
        elif "21608" in error_msg:
            print(f"   → Error 21608: Unverified number (Trial account)")
            print(f"   → Verify this number in Twilio console!")
        elif "21614" in error_msg:
            print(f"   → Error 21614: 'To' number not verified (Trial account)")
            print(f"   → Add {to_number} to verified numbers in Twilio")
        
        print()
        return {
            'success': False,
            'message': f'Failed to send SMS: {error_msg}',
            'error': error_msg
        }
