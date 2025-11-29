import sys
import os
sys.path.insert(0, '.')
os.chdir('d:/flask-projects/functionhall/function_hall_backend')

from app import create_app, db
from app.models import Booking, Customer, FunctionHall
from sms_utils import send_sms

app = create_app()

with app.app_context():
    # Get pending booking
    booking = Booking.query.filter_by(status='Pending').first()
    
    if not booking:
        print("❌ No pending bookings!")
        sys.exit(1)
    
    print(f"✅ Found Booking #{booking.id}")
    
    # Get details
    customer = Customer.query.get(booking.customer_id)
    hall = FunctionHall.query.get(booking.hall_id)
    
    print(f"\n📋 Details:")
    print(f"   Customer: {customer.name}")
    print(f"   Phone: {customer.phone}")
    print(f"   Hall: {hall.name}")
    print(f"   Date: {booking.event_date}")
    print(f"   Amount: ₹{booking.total_amount}")
    
    # Format phone
    customer_phone = customer.phone
    if not customer_phone.startswith('+'):
        customer_phone = '+91' + customer_phone[1:] if customer_phone.startswith('0') else '+91' + customer_phone
    
    print(f"\n📱 Formatted Phone: {customer_phone}")
    
    # Create message
    message = f"""🎉 Booking Confirmed!

Dear {customer.name},

Your booking at {hall.name} has been CONFIRMED!

Event Date: {booking.event_date.strftime('%B %d, %Y')}
Amount: ₹{booking.total_amount}
Location: {hall.location}

Hall Contact: {hall.contact_number}
Owner: {hall.owner_name}

Thank you for choosing us!"""

    print(f"\n✉️ Message:")
    print(message)
    print("\n" + "="*60)
    
    # Send SMS
    print("\n📤 Sending SMS...")
    result = send_sms(customer_phone, message)
    
    print(f"\n📊 Result:")
    print(f"   Success: {result['success']}")
    print(f"   Message: {result['message']}")
    if 'sid' in result:
        print(f"   SID: {result['sid']}")
    
    if result['success']:
        print(f"\n✅ SMS SENT SUCCESSFULLY to {customer_phone}!")
        print(f"   Check phone {customer.phone} for message")
    else:
        print(f"\n❌ SMS FAILED!")
        print(f"   Reason: {result['message']}")
