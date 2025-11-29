import sys
sys.path.insert(0, '.')

from app import create_app, db
from app.models import Customer

app = create_app()

with app.app_context():
    # Update Lakshith's phone to verified number
    customer = Customer.query.get(2)
    
    print(f"📋 Customer ID: {customer.id}")
    print(f"   Name: {customer.name}")
    print(f"   Phone before: {customer.phone}")
    
    customer.phone = '9866168995'  # Verified number
    db.session.commit()
    
    print(f"   Phone after: {customer.phone}")
    print(f"\n✅ Phone updated to verified number!")
    print(f"\n💡 Now Lakshith can receive SMS when booking is confirmed")
