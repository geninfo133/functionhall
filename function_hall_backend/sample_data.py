from app import create_app, db
from app.models import FunctionHall, Package, Customer, Booking, Inquiry
from datetime import date

app = create_app()

with app.app_context():
    # -------------------------
    # Clear existing data (optional)
    # -------------------------
    db.drop_all()
    db.create_all()

    # -------------------------
    # Add Function Halls
    # -------------------------
    hall1 = FunctionHall(
        name="Grand Royale Hall",
        location="Downtown",
        capacity=200,
        contact_number="1234567890",
        price_per_day=5000,
        description="Luxury hall for weddings and events"
    )
    hall2 = FunctionHall(
        name="Sunset Banquet Hall",
        location="Uptown",
        capacity=150,
        contact_number="9876543210",
        price_per_day=3500,
        description="Affordable hall with garden view"
    )
    db.session.add_all([hall1, hall2])
    db.session.commit()

    # -------------------------
    # Add Packages
    # -------------------------
    pkg1 = Package(hall_id=hall1.id, package_name="Silver Wedding", price=2000, details="Basic decoration + food")
    pkg2 = Package(hall_id=hall1.id, package_name="Gold Wedding", price=5000, details="Premium decoration + food + photography")
    pkg3 = Package(hall_id=hall2.id, package_name="Birthday Special", price=1500, details="Cake + Decoration + Music")
    db.session.add_all([pkg1, pkg2, pkg3])
    db.session.commit()

    # -------------------------
    # Add Customers
    # -------------------------
    cust1 = Customer(name="Alice Sharma", email="alice@example.com", phone="1112223333", address="123 Main St")
    cust2 = Customer(name="Bob Mehta", email="bob@example.com", phone="4445556666", address="456 Park Ave")
    db.session.add_all([cust1, cust2])
    db.session.commit()

    # -------------------------
    # Add Bookings
    # -------------------------
    booking1 = Booking(customer_id=cust1.id, hall_id=hall1.id, event_date=date(2025, 11, 20), status="Confirmed", total_amount=7000)
    booking2 = Booking(customer_id=cust2.id, hall_id=hall2.id, event_date=date(2025, 12, 5), status="Pending", total_amount=5000)
    db.session.add_all([booking1, booking2])
    db.session.commit()

    # -------------------------
    # Add Inquiry
    # -------------------------
    inquiry1 = Inquiry(customer_id=cust1.id, hall_id=hall2.id, customer_name="Alice Sharma", email="alice@example.com", message="Is the hall available on 25th Dec?")
    db.session.add(inquiry1)
    db.session.commit()

    print("Sample data inserted successfully!")
