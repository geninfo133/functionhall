from app import create_app, db
from app.models import FunctionHall, HallPhoto, Package, Customer, Booking
from datetime import date

app = create_app()

with app.app_context():
    # Clear all tables
    db.session.query(HallPhoto).delete()
    db.session.query(Package).delete()
    db.session.query(Booking).delete()
    db.session.query(Customer).delete()
    db.session.query(FunctionHall).delete()
    db.session.commit()

    # Sample Function Halls
    halls = [
        FunctionHall(name="Grand Palace", owner_name="Mr. Reddy", location="Hyderabad", capacity=500, contact_number="1234567890", price_per_day=25000, description="Spacious and elegant hall for weddings and events."),
        FunctionHall(name="Lotus Banquet", owner_name="Mrs. Sharma", location="Vijayawada", capacity=300, contact_number="9876543210", price_per_day=18000, description="Modern banquet hall with premium amenities."),
        FunctionHall(name="Crystal Hall", owner_name="Mr. Khan", location="Chennai", capacity=700, contact_number="5556667777", price_per_day=32000, description="Luxurious hall for large gatherings.")
    ]
    db.session.add_all(halls)
    db.session.commit()

    # Sample Hall Photos
    sample_images = [
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1521737852567-6949f3f9f2b5?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1465101178521-c1a4c8a0f8f9?auto=format&fit=crop&w=600&q=80"
    ]
    for hall in halls:
        for i in range(3):
            photo = HallPhoto(hall_id=hall.id, url=sample_images[(hall.id + i) % len(sample_images)])
            db.session.add(photo)
    db.session.commit()

    # Sample Packages
    packages = [
        Package(hall_id=halls[0].id, package_name="Silver", price=5000, details="Basic decoration and sound system."),
        Package(hall_id=halls[0].id, package_name="Gold", price=10000, details="Premium decoration, sound, and lighting."),
        Package(hall_id=halls[1].id, package_name="Standard", price=7000, details="Standard amenities and catering."),
        Package(hall_id=halls[2].id, package_name="Platinum", price=15000, details="All-inclusive package with luxury services.")
    ]
    db.session.add_all(packages)
    db.session.commit()

    # Sample Customers
    customers = [
        Customer(name="Alice", email="alice@example.com", phone="1112223333", address="Hyderabad"),
        Customer(name="Bob", email="bob@example.com", phone="4445556666", address="Vijayawada")
    ]
    db.session.add_all(customers)
    db.session.commit()

    # Sample Bookings
    bookings = [
        Booking(customer_id=customers[0].id, hall_id=halls[0].id, event_date=date(2025, 12, 25), status="Confirmed", total_amount=30000),
        Booking(customer_id=customers[1].id, hall_id=halls[1].id, event_date=date(2025, 11, 20), status="Pending", total_amount=20000)
    ]
    db.session.add_all(bookings)
    db.session.commit()

    print("Sample data added to all tables.")
