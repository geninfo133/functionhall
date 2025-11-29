import sys
import os
sys.path.insert(0, '.')
os.chdir('d:/flask-projects/functionhall/function_hall_backend')

from app import create_app, db
from app.models import Customer

app = create_app()

with app.app_context():
    # Update Lakshith's phone to correct customer number
    customer = Customer.query.get(2)
    
    print(f"📋 Customer ID: {customer.id}")
    print(f"   Name: {customer.name}")
    print(f"   Phone before: {customer.phone}")
    
    customer.phone = '6281438990'  # Customer's verified number
    db.session.commit()
    
    print(f"   Phone after: {customer.phone}")
    print(f"\n✅ Phone updated to customer's verified number!")
    print(f"\n💡 When formatted, it will become: +916281438990")
