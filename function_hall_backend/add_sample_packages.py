"""
Add sample packages to function halls
"""
from app import create_app, db
from app.models import FunctionHall, Package

app = create_app()

# Sample packages with different price ranges
PACKAGE_TEMPLATES = [
    {
        "name": "Basic Package",
        "price": 25000,
        "details": "Includes: Hall rental, Basic lighting, Sound system, 100 chairs, Stage setup"
    },
    {
        "name": "Standard Package",
        "price": 45000,
        "details": "Includes: Hall rental, LED lighting, Premium sound system, 200 chairs, Stage with backdrop, Air conditioning, Parking"
    },
    {
        "name": "Premium Package",
        "price": 75000,
        "details": "Includes: Hall rental, LED lighting with effects, Premium sound & DJ, 300 chairs, Premium stage setup, AC, Parking, Catering setup, Decoration"
    },
    {
        "name": "Deluxe Package",
        "price": 120000,
        "details": "Includes: Hall rental, Advanced LED lighting, Professional sound & DJ, 400+ chairs, Premium stage & backdrop, AC, Valet parking, Full catering setup, Premium decoration, Photography area"
    },
    {
        "name": "Wedding Package",
        "price": 150000,
        "details": "Includes: Full hall rental, Wedding stage setup, LED lighting, Professional DJ, AC, 500 chairs, VIP seating, Catering setup, Bridal room, Parking, Decoration with flowers"
    },
    {
        "name": "Corporate Package",
        "price": 60000,
        "details": "Includes: Hall rental, Professional lighting, AV equipment, Projector & screen, 200 chairs, Podium, AC, WiFi, Parking, Catering setup"
    },
    {
        "name": "Birthday Party Package",
        "price": 35000,
        "details": "Includes: Hall rental, Colorful lighting, Music system, 150 chairs, Party decorations, Cake table setup, Games area, AC, Parking"
    },
    {
        "name": "Reception Package",
        "price": 90000,
        "details": "Includes: Hall rental, Elegant lighting, Sound system, 350 chairs, Reception stage, AC, Parking, Catering setup, Premium decoration"
    }
]

with app.app_context():
    print("📦 Adding sample packages to halls...")
    
    # Get all halls
    halls = FunctionHall.query.all()
    
    if not halls:
        print("❌ No halls found in database")
    else:
        for hall in halls:
            # Check if hall already has packages
            existing_packages = Package.query.filter_by(hall_id=hall.id).count()
            
            if existing_packages > 0:
                print(f"⏭️  Hall '{hall.name}' already has {existing_packages} package(s), skipping...")
                continue
            
            # Add 4-6 packages for each hall based on capacity
            num_packages = 4 if hall.capacity < 200 else 6 if hall.capacity < 400 else 8
            
            for i in range(min(num_packages, len(PACKAGE_TEMPLATES))):
                template = PACKAGE_TEMPLATES[i]
                
                # Adjust price based on hall capacity
                price_multiplier = 1.0
                if hall.capacity >= 500:
                    price_multiplier = 1.3
                elif hall.capacity >= 300:
                    price_multiplier = 1.1
                elif hall.capacity <= 150:
                    price_multiplier = 0.8
                
                adjusted_price = int(template['price'] * price_multiplier)
                
                package = Package(
                    hall_id=hall.id,
                    package_name=template['name'],
                    price=adjusted_price,
                    details=template['details']
                )
                db.session.add(package)
            
            print(f"✅ Added {num_packages} packages to '{hall.name}' (Capacity: {hall.capacity})")
        
        db.session.commit()
        print(f"\n🎉 Sample packages added successfully!")
        
        # Show summary
        total_packages = Package.query.count()
        print(f"📊 Total packages in database: {total_packages}")
