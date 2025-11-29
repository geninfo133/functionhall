import sys
sys.path.insert(0, '.')

from app import create_app, db
from app.models import Booking, Customer, FunctionHall

app = create_app()

with app.app_context():
    # Get first booking
    booking = Booking.query.first()
    
    if not booking:
        print("❌ No bookings found!")
        sys.exit(1)
    
    customer = Customer.query.get(booking.customer_id)
    hall = FunctionHall.query.get(booking.hall_id)
    
    print(f"📋 Booking #{booking.id}")
    print(f"   Customer: {customer.name} ({customer.phone})")
    print(f"   Hall: {hall.name}")
    print(f"   Current Status: {booking.status}")
    
    # Change to Pending
    booking.status = 'Pending'
    db.session.commit()
    
    print(f"\n✅ Status changed to: Pending")
    print(f"\n💡 Now test by going to admin dashboard and clicking 'Confirm'")
    print(f"   Customer {customer.name} should receive SMS at {customer.phone}")
