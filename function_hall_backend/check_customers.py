import sys
sys.path.insert(0, '.')

from app import create_app, db
from app.models import Customer, Booking, FunctionHall

app = create_app()

with app.app_context():
    print("📋 All Customers:")
    customers = Customer.query.all()
    for c in customers:
        print(f"\n  ID: {c.id}")
        print(f"  Name: {c.name}")
        print(f"  Email: {c.email}")
        print(f"  Phone: {c.phone}")
        
        # Check bookings
        bookings = Booking.query.filter_by(customer_id=c.id).all()
        if bookings:
            print(f"  Bookings: {len(bookings)}")
            for b in bookings:
                hall = FunctionHall.query.get(b.hall_id)
                print(f"    - Booking #{b.id}: {hall.name if hall else 'Unknown'} - {b.status}")
    
    print("\n" + "="*60)
    print("✅ Verified Twilio number: +919866168995")
    print("💡 To test SMS, customer phone must be: 9866168995 or +919866168995")
