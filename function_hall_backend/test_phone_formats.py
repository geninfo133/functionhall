import sys
import os
sys.path.insert(0, '.')
os.chdir('d:/flask-projects/functionhall/function_hall_backend')

from sms_utils import send_sms

# Test with both formats
numbers_to_test = [
    '+916281438990',      # No space
    '+91 6281438990',     # Space after country code
    '+91 62814 38990',    # Space as shown in Twilio console
]

message = "Test message - Booking confirmation test from Function Hall system"

print("🔍 Testing different phone number formats...\n")

for number in numbers_to_test:
    print(f"📱 Testing: {number}")
    result = send_sms(number, message)
    print(f"   Result: {result['success']}")
    if result['success']:
        print(f"   ✅ SUCCESS! SID: {result.get('sid')}")
        print(f"   This format works: {number}")
        break
    else:
        print(f"   ❌ Failed: {result['message']}")
    print()
