import sys
sys.path.insert(0, '.')

from app import create_app, db
from app.models import Booking, Customer, FunctionHall
from sms_utils import send_sms
from datetime import datetime

app = create_app()

with app.app_context():
    # Get a pending booking
    booking = Booking.query.filter_by(status='Pending').first()
    
    if not booking:
        print("❌ No pending bookings found!")
        print("\n📋 All bookings:")
        bookings = Booking.query.all()
        for b in bookings:
            customer = Customer.query.get(b.customer_id)
            hall = FunctionHall.query.get(b.hall_id)
            print(f"  Booking #{b.id}: {customer.name if customer else 'Unknown'} -> {hall.name if hall else 'Unknown'} - Status: {b.status}")
        sys.exit(1)
    
    print(f"✅ Found Pending Booking #{booking.id}")
    
    # Get customer and hall
    customer = Customer.query.get(booking.customer_id)
    hall = FunctionHall.query.get(booking.hall_id)
    
    print(f"\n📋 Booking Details:")
    print(f"   Customer: {customer.name}")
    print(f"   Email: {customer.email}")
    print(f"   Phone: {customer.phone}")
    print(f"   Hall: {hall.name}")
    print(f"   Event Date: {booking.event_date}")
    print(f"   Amount: ₹{booking.total_amount}")
    print(f"   Current Status: {booking.status}")
    
    # Format phone number
    customer_phone = customer.phone
    if not customer_phone.startswith('+'):
        customer_phone = '+91' + customer_phone[1:] if customer_phone.startswith('0') else '+91' + customer_phone
    
    print(f"\n📱 Formatted Phone: {customer_phone}")
    
    # Create confirmation message
    message = f"""🎉 Booking Confirmed!

Dear {customer.name},

Your booking at {hall.name} has been CONFIRMED!

Event Date: {booking.event_date.strftime('%B %d, %Y')}
Amount: ₹{booking.total_amount}
Location: {hall.location}

Hall Contact: {hall.contact_number}
Owner: {hall.owner_name}

Thank you for choosing us!"""

    print(f"\n✉️ Message to send:")
    print(message)
    print("\n" + "="*50)
    
    # Send SMS
    print("\n📤 Sending SMS...")
    result = send_sms(customer_phone, message)
    
    print(f"\n📊 Result: {result}")
    
    if result['success']:
        print(f"\n✅ SMS sent successfully!")
        print(f"   Message SID: {result.get('sid', 'N/A')}")
        
        # Update booking status
        booking.status = 'Confirmed'
        db.session.commit()
        print(f"\n✅ Booking #{booking.id} status updated to Confirmed")
    else:
        print(f"\n❌ SMS failed: {result['message']}")
