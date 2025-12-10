"""
Script to create sample data for the Function Hall Management System
This will populate the PostgreSQL database with realistic sample data
"""

from app import create_app, db
from app.models import (
    AdminUser, FunctionHall, HallPhoto, Package, Customer, 
    Booking, Inquiry, Notification, Partner, Calendar
)
from datetime import datetime, timedelta, date
import random

def create_sample_data():
    app = create_app()
    
    with app.app_context():
        # Clear existing data
        print("Clearing existing data...")
        db.drop_all()
        db.create_all()
        print("Database tables created successfully!")

        # 1. Create Super Admin
        print("\n1. Creating Super Admin...")
        super_admin = AdminUser(
            name="Super Admin",
            email="admin@functionhall.com",
            role="super_admin",
            phone="+919876543210",
            is_approved=True
        )
        super_admin.set_password("admin123")
        db.session.add(super_admin)

        # 2. Create Vendors
        print("2. Creating Vendors...")
        vendors = []
        vendor_data = [
            {
                "name": "Rajesh Kumar",
                "email": "rajesh@venue.com",
                "phone": "+919876543211",
                "business_name": "Royal Palace Venues"
            },
            {
                "name": "Priya Sharma",
                "email": "priya@events.com",
                "phone": "+919876543212",
                "business_name": "Elite Event Spaces"
            },
            {
                "name": "Amit Patel",
                "email": "amit@halls.com",
                "phone": "+919876543213",
                "business_name": "Grand Celebrations"
            }
        ]

        for vendor_info in vendor_data:
            vendor = AdminUser(
                name=vendor_info["name"],
                email=vendor_info["email"],
                role="vendor",
                phone=vendor_info["phone"],
                business_name=vendor_info["business_name"],
                is_approved=True
            )
            vendor.set_password("vendor123")
            vendors.append(vendor)
            db.session.add(vendor)

        db.session.commit()
        print(f"   Created {len(vendors)} vendors")

        # 3. Create Function Halls
        print("3. Creating Function Halls...")
        halls = []
        hall_data = [
            {
                "name": "Grand Palace Banquet",
                "owner_name": "Rajesh Kumar",
                "location": "Jubilee Hills, Hyderabad",
                "capacity": 500,
                "contact_number": "+919876543211",
                "price_per_day": 75000.00,
                "description": "Luxurious banquet hall with modern amenities, perfect for weddings and large celebrations. Features include AC, LED screens, DJ setup, and premium catering services.",
                "vendor_id": vendors[0].id,
                "photos": [
                    "https://images.unsplash.com/photo-1519167758481-83f29da8c397",
                    "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3",
                    "https://images.unsplash.com/photo-1478146896981-b80fe463b330"
                ]
            },
            {
                "name": "Crystal Garden Hall",
                "owner_name": "Priya Sharma",
                "location": "Banjara Hills, Hyderabad",
                "capacity": 300,
                "contact_number": "+919876543212",
                "price_per_day": 50000.00,
                "description": "Beautiful garden-themed hall with indoor and outdoor seating. Ideal for intimate weddings, receptions, and corporate events.",
                "vendor_id": vendors[1].id,
                "photos": [
                    "https://images.unsplash.com/photo-1511795409834-ef04bbd61622",
                    "https://images.unsplash.com/photo-1519225421980-715cb0215aed",
                    "https://images.unsplash.com/photo-1505236858219-8359eb29e329"
                ]
            },
            {
                "name": "Sapphire Convention Center",
                "owner_name": "Amit Patel",
                "location": "HITEC City, Hyderabad",
                "capacity": 800,
                "contact_number": "+919876543213",
                "price_per_day": 120000.00,
                "description": "Ultra-modern convention center with state-of-the-art facilities. Perfect for large weddings, corporate events, and conferences.",
                "vendor_id": vendors[2].id,
                "photos": [
                    "https://images.unsplash.com/photo-1505236858219-8359eb29e329",
                    "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14",
                    "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3"
                ]
            },
            {
                "name": "Maharaja Celebration Hall",
                "owner_name": "Rajesh Kumar",
                "location": "Madhapur, Hyderabad",
                "capacity": 400,
                "contact_number": "+919876543211",
                "price_per_day": 60000.00,
                "description": "Traditional yet elegant hall with royal decor. Suitable for weddings, engagements, and cultural events.",
                "vendor_id": vendors[0].id,
                "photos": [
                    "https://images.unsplash.com/photo-1478146896981-b80fe463b330",
                    "https://images.unsplash.com/photo-1519167758481-83f29da8c397"
                ]
            },
            {
                "name": "Pearl Banquet & Lawns",
                "owner_name": "Priya Sharma",
                "location": "Gachibowli, Hyderabad",
                "capacity": 600,
                "contact_number": "+919876543212",
                "price_per_day": 85000.00,
                "description": "Spacious hall with beautiful lawns. Perfect for destination-style weddings within the city.",
                "vendor_id": vendors[1].id,
                "photos": [
                    "https://images.unsplash.com/photo-1511795409834-ef04bbd61622",
                    "https://images.unsplash.com/photo-1519225421980-715cb0215aed"
                ]
            }
        ]

        for hall_info in hall_data:
            photos = hall_info.pop('photos')
            hall = FunctionHall(**hall_info)
            halls.append(hall)
            db.session.add(hall)
            db.session.flush()  # Get the hall ID
            
            # Add photos
            for photo_url in photos:
                photo = HallPhoto(hall_id=hall.id, url=photo_url)
                db.session.add(photo)

        db.session.commit()
        print(f"   Created {len(halls)} function halls")

        # 4. Create Packages
        print("4. Creating Packages...")
        packages_data = [
            # Packages for Grand Palace Banquet
            {"hall_id": halls[0].id, "package_name": "Basic Wedding Package", "price": 100000.00, 
             "details": "Venue rental, basic decoration, seating for 500, sound system"},
            {"hall_id": halls[0].id, "package_name": "Premium Wedding Package", "price": 200000.00, 
             "details": "Venue rental, premium decoration, catering (veg/non-veg), DJ, photography"},
            {"hall_id": halls[0].id, "package_name": "Luxury Wedding Package", "price": 350000.00, 
             "details": "Complete wedding solution with luxury decor, catering, photography, videography, entertainment"},
            
            # Packages for Crystal Garden Hall
            {"hall_id": halls[1].id, "package_name": "Garden Party Package", "price": 80000.00, 
             "details": "Venue rental, garden decoration, seating for 300, refreshments"},
            {"hall_id": halls[1].id, "package_name": "Reception Package", "price": 150000.00, 
             "details": "Complete reception setup with catering, decoration, and entertainment"},
            
            # Packages for Sapphire Convention Center
            {"hall_id": halls[2].id, "package_name": "Corporate Event Package", "price": 180000.00, 
             "details": "Venue rental, AV equipment, seating for 800, refreshments"},
            {"hall_id": halls[2].id, "package_name": "Grand Wedding Package", "price": 500000.00, 
             "details": "Ultra-luxury wedding with premium catering, decor, entertainment, and hospitality"},
            
            # Packages for Maharaja Celebration Hall
            {"hall_id": halls[3].id, "package_name": "Traditional Wedding Package", "price": 120000.00, 
             "details": "Traditional decor, catering, priest arrangement, seating for 400"},
            
            # Packages for Pearl Banquet & Lawns
            {"hall_id": halls[4].id, "package_name": "Lawn Wedding Package", "price": 160000.00, 
             "details": "Outdoor and indoor setup, decoration, catering for 600 guests"}
        ]

        for package_info in packages_data:
            package = Package(**package_info)
            db.session.add(package)

        db.session.commit()
        print(f"   Created {len(packages_data)} packages")

        # 5. Create Customers
        print("5. Creating Customers...")
        customers = []
        customer_data = [
            {"name": "Sanjay Reddy", "email": "sanjay@gmail.com", "phone": "+919876543301", 
             "address": "123, Kondapur, Hyderabad"},
            {"name": "Meera Iyer", "email": "meera@gmail.com", "phone": "+919876543302", 
             "address": "456, Kukatpally, Hyderabad"},
            {"name": "Vikram Singh", "email": "vikram@gmail.com", "phone": "+919876543303", 
             "address": "789, Miyapur, Hyderabad"},
            {"name": "Divya Naidu", "email": "divya@gmail.com", "phone": "+919876543304", 
             "address": "321, Ameerpet, Hyderabad"},
            {"name": "Karthik Rao", "email": "karthik@gmail.com", "phone": "+919876543305", 
             "address": "654, Secunderabad"},
            {"name": "Anjali Menon", "email": "anjali@gmail.com", "phone": "+919876543306", 
             "address": "987, Begumpet, Hyderabad"},
            {"name": "Rahul Verma", "email": "rahul@gmail.com", "phone": "+919876543307", 
             "address": "135, SR Nagar, Hyderabad"},
        ]

        for customer_info in customer_data:
            customer = Customer(**customer_info)
            customer.set_password("customer123")
            customers.append(customer)
            db.session.add(customer)

        db.session.commit()
        print(f"   Created {len(customers)} customers")

        # 6. Create Bookings
        print("6. Creating Bookings...")
        bookings = []
        today = date.today()
        
        booking_data = [
            # Past bookings
            {"customer_id": customers[0].id, "hall_id": halls[0].id, 
             "event_date": today - timedelta(days=30), "status": "Confirmed", "total_amount": 200000.00},
            {"customer_id": customers[1].id, "hall_id": halls[1].id, 
             "event_date": today - timedelta(days=15), "status": "Completed", "total_amount": 150000.00},
            
            # Upcoming bookings
            {"customer_id": customers[2].id, "hall_id": halls[2].id, 
             "event_date": today + timedelta(days=30), "status": "Confirmed", "total_amount": 500000.00},
            {"customer_id": customers[3].id, "hall_id": halls[3].id, 
             "event_date": today + timedelta(days=45), "status": "Confirmed", "total_amount": 120000.00},
            {"customer_id": customers[4].id, "hall_id": halls[4].id, 
             "event_date": today + timedelta(days=60), "status": "Pending", "total_amount": 160000.00},
            
            # Current month bookings
            {"customer_id": customers[5].id, "hall_id": halls[0].id, 
             "event_date": today + timedelta(days=10), "status": "Confirmed", "total_amount": 350000.00},
            {"customer_id": customers[6].id, "hall_id": halls[1].id, 
             "event_date": today + timedelta(days=20), "status": "Confirmed", "total_amount": 80000.00},
        ]

        for booking_info in booking_data:
            booking = Booking(**booking_info)
            bookings.append(booking)
            db.session.add(booking)

        db.session.commit()
        print(f"   Created {len(bookings)} bookings")

        # 7. Create Calendar Entries
        print("7. Creating Calendar Entries...")
        calendar_entries = []
        
        # Mark dates for existing bookings
        for booking in bookings:
            calendar_entry = Calendar(
                hall_id=booking.hall_id,
                date=booking.event_date,
                is_booked=True
            )
            calendar_entries.append(calendar_entry)
            db.session.add(calendar_entry)
        
        # Add some available dates for next 90 days
        for hall in halls[:3]:  # For first 3 halls
            for days_ahead in range(1, 91):
                check_date = today + timedelta(days=days_ahead)
                # Check if not already booked
                existing = any(ce.hall_id == hall.id and ce.date == check_date for ce in calendar_entries)
                if not existing and random.random() > 0.3:  # 70% availability
                    calendar_entry = Calendar(
                        hall_id=hall.id,
                        date=check_date,
                        is_booked=False
                    )
                    db.session.add(calendar_entry)

        db.session.commit()
        print(f"   Created calendar entries")

        # 8. Create Inquiries
        print("8. Creating Inquiries...")
        inquiry_data = [
            {"customer_id": customers[0].id, "hall_id": halls[0].id, 
             "customer_name": "Sanjay Reddy", "email": "sanjay@gmail.com", 
             "phone": "+919876543301", "message": "Interested in booking for wedding in March 2026",
             "status": "Pending"},
            {"customer_id": customers[1].id, "hall_id": halls[2].id, 
             "customer_name": "Meera Iyer", "email": "meera@gmail.com", 
             "phone": "+919876543302", "message": "Need pricing details for corporate event",
             "status": "Responded"},
            {"customer_id": None, "hall_id": halls[1].id, 
             "customer_name": "Rajiv Kumar", "email": "rajiv@gmail.com", 
             "phone": "+919876543310", "message": "Want to know about garden wedding packages",
             "status": "Pending"},
            {"customer_id": customers[3].id, "hall_id": halls[3].id, 
             "customer_name": "Divya Naidu", "email": "divya@gmail.com", 
             "phone": "+919876543304", "message": "Checking availability for December 2025",
             "status": "Responded"},
        ]

        for inquiry_info in inquiry_data:
            inquiry = Inquiry(**inquiry_info)
            db.session.add(inquiry)

        db.session.commit()
        print(f"   Created {len(inquiry_data)} inquiries")

        # 9. Create Notifications
        print("9. Creating Notifications...")
        notification_data = [
            {"recipient_email": "rajesh@venue.com", "recipient_name": "Rajesh Kumar",
             "subject": "New Booking Received", 
             "message": "You have received a new booking for Grand Palace Banquet",
             "booking_id": bookings[0].id, "is_read": True},
            {"recipient_email": "priya@events.com", "recipient_name": "Priya Sharma",
             "subject": "Booking Confirmed", 
             "message": "Booking for Crystal Garden Hall has been confirmed",
             "booking_id": bookings[1].id, "is_read": False},
            {"recipient_email": "amit@halls.com", "recipient_name": "Amit Patel",
             "subject": "New Inquiry", 
             "message": "New inquiry received for Sapphire Convention Center",
             "booking_id": None, "is_read": False},
        ]

        for notification_info in notification_data:
            notification = Notification(**notification_info)
            db.session.add(notification)

        db.session.commit()
        print(f"   Created {len(notification_data)} notifications")

        # 10. Create Partners
        print("10. Creating Partners (B2B)...")
        partner_data = [
            {"company_name": "Royal Caterers", "contact_person": "Suresh Reddy",
             "email": "contact@royalcaterers.com", "service_type": "Catering",
             "phone": "+919876543401"},
            {"company_name": "Elite Decorators", "contact_person": "Swathi Menon",
             "email": "info@elitedecorators.com", "service_type": "Decoration",
             "phone": "+919876543402"},
            {"company_name": "Pixel Perfect Photography", "contact_person": "Arun Kumar",
             "email": "bookings@pixelperfect.com", "service_type": "Photography",
             "phone": "+919876543403"},
            {"company_name": "DJ Beats Entertainment", "contact_person": "Ravi Sharma",
             "email": "djbeats@music.com", "service_type": "Entertainment",
             "phone": "+919876543404"},
            {"company_name": "Dream Weddings Planners", "contact_person": "Neha Kapoor",
             "email": "hello@dreamweddings.com", "service_type": "Wedding Planning",
             "phone": "+919876543405"},
        ]

        for partner_info in partner_data:
            partner = Partner(**partner_info)
            db.session.add(partner)

        db.session.commit()
        print(f"   Created {len(partner_data)} partners")

        print("\n" + "="*60)
        print("✓ Sample data created successfully!")
        print("="*60)
        print("\nLogin Credentials:")
        print("-" * 60)
        print("SUPER ADMIN:")
        print("  Email: admin@functionhall.com")
        print("  Password: admin123")
        print("\nVENDORS:")
        print("  Email: rajesh@venue.com | Password: vendor123")
        print("  Email: priya@events.com | Password: vendor123")
        print("  Email: amit@halls.com | Password: vendor123")
        print("\nCUSTOMERS:")
        print("  Email: sanjay@gmail.com | Password: customer123")
        print("  Email: meera@gmail.com | Password: customer123")
        print("  Email: vikram@gmail.com | Password: customer123")
        print("  (and more...)")
        print("="*60)
        
        print("\nDatabase Statistics:")
        print(f"  - Function Halls: {len(halls)}")
        print(f"  - Packages: {len(packages_data)}")
        print(f"  - Customers: {len(customers)}")
        print(f"  - Bookings: {len(bookings)}")
        print(f"  - Inquiries: {len(inquiry_data)}")
        print(f"  - Partners: {len(partner_data)}")
        print(f"  - Vendors: {len(vendors)}")
        print("="*60)

if __name__ == '__main__':
    create_sample_data()
