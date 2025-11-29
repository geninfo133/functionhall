"""
CHECK TWILIO SMS DELIVERY STATUS
=================================

SMS was sent with SID: SM0e6dcc26beeac798a4e111594ab55e94
To: +916281438990

Possible reasons why SMS not received:
----------------------------------------

1. NUMBER NOT VERIFIED IN TWILIO
   - Go to: https://console.twilio.com/us1/develop/phone-numbers/manage/verified
   - Check if +916281438990 is listed
   - If not, verify it NOW

2. TRIAL ACCOUNT MESSAGE PREFIX
   - Twilio trial adds prefix: "Sent from your Twilio trial account - "
   - Check spam/junk folder
   - Message might look different than expected

3. NETWORK DELAY
   - SMS can take 1-5 minutes to arrive
   - Wait a few minutes

4. INCORRECT PHONE FORMAT
   - Current: +916281438990
   - Should be: +91 6281438990 (with space)
   - OR: +916281438990 (no space)
   
5. PHONE NUMBER TYPO
   - Verify the actual customer phone number
   - Is it really 6281438990?
   - Or should it be 6282438990 or 6381438990?

IMMEDIATE ACTION:
-----------------
1. Go to Twilio Console: https://console.twilio.com/us1/monitor/logs/sms
2. Search for SID: SM0e6dcc26beeac798a4e111594ab55e94
3. Check "Status" column - should be "delivered"
4. If status is "failed" or "undelivered", check error message
"""

print(__doc__)

import sys
sys.path.insert(0, '.')
import os
os.chdir('d:/flask-projects/functionhall/function_hall_backend')

from twilio.rest import Client
from twilio_config import TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN

print("\n" + "="*60)
print("CHECKING SMS DELIVERY STATUS...")
print("="*60)

try:
    client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
    
    # Get message status
    message = client.messages('SM0e6dcc26beeac798a4e111594ab55e94').fetch()
    
    print(f"\n📱 SMS Details:")
    print(f"   SID: {message.sid}")
    print(f"   To: {message.to}")
    print(f"   From: {message.from_}")
    print(f"   Status: {message.status}")
    print(f"   Date Sent: {message.date_sent}")
    print(f"   Date Updated: {message.date_updated}")
    print(f"   Error Code: {message.error_code}")
    print(f"   Error Message: {message.error_message}")
    
    if message.status == 'delivered':
        print(f"\n✅ SMS WAS DELIVERED SUCCESSFULLY!")
        print(f"   Check phone again, it should be there")
    elif message.status == 'sent':
        print(f"\n⏳ SMS IS SENT but not yet delivered")
        print(f"   Wait 1-2 minutes and check again")
    elif message.status == 'failed' or message.status == 'undelivered':
        print(f"\n❌ SMS FAILED!")
        print(f"   Error Code: {message.error_code}")
        print(f"   Error: {message.error_message}")
        print(f"\n💡 Common fixes:")
        print(f"   - Verify phone number in Twilio console")
        print(f"   - Check if phone can receive SMS")
        print(f"   - Try different phone number")
    else:
        print(f"\n⚠️ SMS Status: {message.status}")
        print(f"   Wait a few minutes and check phone")
        
except Exception as e:
    print(f"\n❌ Error checking SMS status: {e}")
    print(f"\nManually check at:")
    print(f"https://console.twilio.com/us1/monitor/logs/sms")
