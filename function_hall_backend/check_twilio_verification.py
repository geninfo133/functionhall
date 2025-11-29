"""
Script to verify phone numbers in Twilio and check SMS delivery status
"""
from twilio.rest import Client
from twilio_config import TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN

def check_verification():
    """Check verified numbers in Twilio account"""
    print("\n" + "="*60)
    print("CHECKING TWILIO VERIFICATION STATUS")
    print("="*60)
    
    try:
        client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
        
        # Get verified numbers (for trial accounts)
        print("\n📋 Verified Caller IDs:")
        try:
            verified_numbers = client.outgoing_caller_ids.list(limit=20)
            
            if verified_numbers:
                for number in verified_numbers:
                    print(f"   ✓ {number.phone_number} - {number.friendly_name}")
            else:
                print("   ⚠️ No verified caller IDs found!")
        except Exception as e:
            print(f"   ℹ️ Could not fetch verified numbers: {e}")
            print("   💡 For trial accounts, recipient numbers must be verified")
        
        print("\n" + "="*60)
        print("💡 TO VERIFY A NEW NUMBER:")
        print("="*60)
        print("1. Go to: https://console.twilio.com/us1/develop/phone-numbers/manage/verified")
        print("2. Click 'Add a new number'")
        print("3. Enter the phone number with country code (e.g., +916281438990)")
        print("4. Choose 'SMS' verification")
        print("5. Enter the code you receive")
        print()
        
        # Check recent messages
        print("="*60)
        print("📱 RECENT SMS MESSAGES (Last 5):")
        print("="*60)
        messages = client.messages.list(limit=5)
        
        for msg in messages:
            status_icon = "✅" if msg.status == "delivered" else "⚠️"
            print(f"\n{status_icon} SID: {msg.sid}")
            print(f"   To: {msg.to}")
            print(f"   Status: {msg.status}")
            print(f"   Date: {msg.date_created}")
            if msg.error_code:
                print(f"   ❌ Error Code: {msg.error_code}")
                print(f"   Error Message: {msg.error_message}")
        
        print("\n" + "="*60)
        
    except Exception as e:
        print(f"\n❌ Error: {str(e)}")
        print("\nPlease check your Twilio credentials in .env file")
        print("Required variables:")
        print("  - TWILIO_ACCOUNT_SID")
        print("  - TWILIO_AUTH_TOKEN")
        print()

if __name__ == "__main__":
    check_verification()
