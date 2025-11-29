import random
import string
from datetime import datetime, timedelta
from sms_utils import send_sms

# In-memory storage for OTPs (in production, use Redis or database)
otp_storage = {}

def generate_otp(length=6):
    """Generate a random numeric OTP"""
    return ''.join(random.choices(string.digits, k=length))

def send_otp(phone_number, country_code='+91'):
    """
    Generate and send OTP to the given phone number
    Returns: dict with success status and message
    """
    try:
        # Generate 6-digit OTP
        otp = generate_otp(6)
        
        # Store OTP with expiry (10 minutes)
        key = f"{country_code}{phone_number}"
        otp_storage[key] = {
            'otp': otp,
            'expiry': datetime.now() + timedelta(minutes=10),
            'attempts': 0
        }
        
        # Format phone number with country code
        full_phone = f"{country_code}{phone_number}"
        
        # Send SMS
        message = f"Your GenS Services verification code is: {otp}. Valid for 10 minutes."
        sms_result = send_sms(full_phone, message)
        
        if sms_result.get('success'):
            return {
                'success': True,
                'message': 'OTP sent successfully'
            }
        else:
            return {
                'success': False,
                'message': sms_result.get('error', 'Failed to send OTP')
            }
    except Exception as e:
        return {
            'success': False,
            'message': str(e)
        }

def verify_otp(phone_number, otp, country_code='+91'):
    """
    Verify the OTP for the given phone number
    Returns: dict with success status and message
    """
    key = f"{country_code}{phone_number}"
    
    # Check if OTP exists
    if key not in otp_storage:
        return {
            'success': False,
            'message': 'OTP not found. Please request a new one.'
        }
    
    stored_data = otp_storage[key]
    
    # Check if OTP has expired
    if datetime.now() > stored_data['expiry']:
        del otp_storage[key]
        return {
            'success': False,
            'message': 'OTP has expired. Please request a new one.'
        }
    
    # Check attempts
    if stored_data['attempts'] >= 3:
        del otp_storage[key]
        return {
            'success': False,
            'message': 'Too many failed attempts. Please request a new OTP.'
        }
    
    # Verify OTP
    if stored_data['otp'] == otp:
        # OTP is correct, remove it from storage
        del otp_storage[key]
        return {
            'success': True,
            'message': 'Phone number verified successfully'
        }
    else:
        # Increment failed attempts
        stored_data['attempts'] += 1
        otp_storage[key] = stored_data
        
        return {
            'success': False,
            'message': f'Invalid OTP. {3 - stored_data["attempts"]} attempts remaining.'
        }
