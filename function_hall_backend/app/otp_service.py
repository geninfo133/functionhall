"""
OTP Service for Customer Verification
Generates and validates OTP codes sent via SMS
"""

import random
import string
from datetime import datetime, timedelta
from sms_utils import send_sms

# In-memory storage for OTPs (in production, use Redis or database)
otp_storage = {}

def generate_otp(length=6):
    """Generate a random 6-digit OTP"""
    return ''.join(random.choices(string.digits, k=length))

def send_otp(phone_number, country_code='+91'):
    """
    Generate and send OTP to phone number
    Returns: dict with success status and message
    """
    # Format phone number
    full_phone = f"{country_code}{phone_number}" if not phone_number.startswith('+') else phone_number
    
    # Generate OTP
    otp = generate_otp()
    
    # Store OTP with expiry (10 minutes)
    expiry = datetime.now() + timedelta(minutes=10)
    otp_storage[full_phone] = {
        'otp': otp,
        'expiry': expiry,
        'attempts': 0
    }
    
    # Send SMS
    message = f"""Your Function Hall Booking OTP is: {otp}

Valid for 10 minutes.
Do not share this OTP with anyone.

- Function Hall Team"""
    
    result = send_sms(full_phone, message)
    
    if result['success']:
        return {
            'success': True,
            'message': 'OTP sent successfully',
            'phone': full_phone
        }
    else:
        return {
            'success': False,
            'message': f'Failed to send OTP: {result["message"]}'
        }

def verify_otp(phone_number, otp, country_code='+91'):
    """
    Verify OTP for phone number
    Returns: dict with success status and message
    """
    # Format phone number
    full_phone = f"{country_code}{phone_number}" if not phone_number.startswith('+') else phone_number
    
    # Check if OTP exists
    if full_phone not in otp_storage:
        return {
            'success': False,
            'message': 'No OTP found. Please request a new OTP.'
        }
    
    stored_data = otp_storage[full_phone]
    
    # Check expiry
    if datetime.now() > stored_data['expiry']:
        del otp_storage[full_phone]
        return {
            'success': False,
            'message': 'OTP expired. Please request a new OTP.'
        }
    
    # Check attempts (max 3)
    if stored_data['attempts'] >= 3:
        del otp_storage[full_phone]
        return {
            'success': False,
            'message': 'Too many failed attempts. Please request a new OTP.'
        }
    
    # Verify OTP
    if stored_data['otp'] == otp:
        del otp_storage[full_phone]
        return {
            'success': True,
            'message': 'OTP verified successfully',
            'phone': full_phone
        }
    else:
        stored_data['attempts'] += 1
        return {
            'success': False,
            'message': f'Invalid OTP. {3 - stored_data["attempts"]} attempts remaining.'
        }

def clear_otp(phone_number, country_code='+91'):
    """Clear OTP for phone number"""
    full_phone = f"{country_code}{phone_number}" if not phone_number.startswith('+') else phone_number
    if full_phone in otp_storage:
        del otp_storage[full_phone]
