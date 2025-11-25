from app import create_app, db
from app.models import Customer

app = create_app()

with app.app_context():
    # Update all customer passwords to plain text
    customers = Customer.query.all()
    
    for customer in customers:
        # Set password to "password123" for all existing customers
        customer.password = "password123"
    
    db.session.commit()
    
    print(f"Updated {len(customers)} customer passwords to plain text.")
    print("\nCustomers:")
    for customer in customers:
        print(f"  - {customer.email} / password123")
