"""
TWILIO ERROR 30044 - PHONE NUMBER NOT VERIFIED
================================================

Error Code: 30044
Message: "The phone number is not verified for trial accounts"

SOLUTION:
---------
The phone number +916281438990 is NOT verified in your Twilio account.

You said it was "verified", but Twilio says it's NOT.

STEPS TO VERIFY:
----------------
1. Go to: https://console.twilio.com/us1/develop/phone-numbers/manage/verified

2. Click "Add a new number" or the red "+" button

3. Select country: India (+91)

4. Enter number: 6281438990 (without +91)

5. Choose verification method:
   - SMS (recommended)
   - Voice Call

6. Twilio will send a 6-digit code to +916281438990

7. Enter the code to verify

8. Wait for "Verified" status

CURRENT VERIFIED NUMBERS:
--------------------------
✅ +919866168995 (Hall Owner) - VERIFIED
❌ +916281438990 (Customer) - NOT VERIFIED

ALTERNATIVE:
------------
If you cannot verify +916281438990:
1. Use the already verified number +919866168995 for testing
2. Or verify a different customer phone number
3. Or upgrade Twilio account to remove verification requirement
"""

print(__doc__)
