"""
Script to add packages to an existing hall in Railway database
Usage: python3 add_packages_to_hall.py
"""
import os
import sys
from app import create_app, db
from app.models import FunctionHall, Package

# Package templates
PACKAGE_TEMPLATES = [
    {
        "package_name": "Basic Package",
        "price": 50000,
        "details": "Includes: Hall rental, Basic lighting, Tables & chairs, Air conditioning"
    },
    {
        "package_name": "Standard Package",
        "price": 75000,
        "details": "Includes: Hall rental, Premium lighting, Tables & chairs, Air conditioning, Sound system, Stage setup"
    },
    {
        "package_name": "Premium Package",
        "price": 100000,
        "details": "Includes: Hall rental, Premium lighting & effects, Decorated tables & chairs, Air conditioning, Professional sound system, Stage with backdrop, Complementary parking"
    },
    {
        "package_name": "Wedding Package",
        "price": 200000,
        "details": "Includes: Hall rental for 2 days, Complete wedding lighting & decoration, Premium furniture, Central AC, Professional sound & music, Mandap setup, Valet parking, Welcome area setup, Green room facilities"
    }
]

def list_halls():
    """List all halls"""
    app = create_app()
    
    with app.app_context():
        halls = FunctionHall.query.all()
        
        if not halls:
            print("\n❌ No halls found.")
            return None
        
        print("\n=== Available Halls ===")
        for hall in halls:
            # Count existing packages
            existing_packages = Package.query.filter_by(hall_id=hall.id).count()
            print(f"\nID: {hall.id}")
            print(f"Name: {hall.name}")
            print(f"Location: {hall.location}")
            print(f"Existing Packages: {existing_packages}")
            print("-" * 40)
        
        return halls

def add_packages_to_hall(hall_id, package_indices=None):
    """Add selected packages to a hall"""
    app = create_app()
    
    with app.app_context():
        hall = FunctionHall.query.get(hall_id)
        
        if not hall:
            print(f"\n❌ Hall with ID {hall_id} not found!")
            return False
        
        # If no specific packages selected, add all
        if package_indices is None:
            packages_to_add = PACKAGE_TEMPLATES
        else:
            packages_to_add = [PACKAGE_TEMPLATES[i] for i in package_indices if i < len(PACKAGE_TEMPLATES)]
        
        print(f"\n📦 Adding {len(packages_to_add)} packages to hall: {hall.name}")
        
        created_count = 0
        for pkg_data in packages_to_add:
            # Check if package already exists
            existing = Package.query.filter_by(
                hall_id=hall_id,
                package_name=pkg_data['package_name']
            ).first()
            
            if existing:
                print(f"⚠️  Package '{pkg_data['package_name']}' already exists, skipping...")
                continue
            
            package = Package(
                hall_id=hall_id,
                package_name=pkg_data['package_name'],
                price=pkg_data['price'],
                details=pkg_data['details']
            )
            db.session.add(package)
            created_count += 1
            print(f"✅ Added: {pkg_data['package_name']} - ₹{pkg_data['price']}")
        
        if created_count > 0:
            db.session.commit()
            print(f"\n✅ Successfully added {created_count} packages to hall '{hall.name}'!")
        else:
            print(f"\n⚠️  No new packages added (all already exist)")
        
        return True

if __name__ == "__main__":
    print("\n" + "="*60)
    print("Add Packages to Hall - Railway Database")
    print("="*60)
    
    # List all halls
    halls = list_halls()
    
    if not halls:
        sys.exit(1)
    
    # Get hall ID
    print("\n" + "="*60)
    hall_id_input = input("\nEnter Hall ID to add packages: ").strip()
    
    try:
        hall_id = int(hall_id_input)
    except ValueError:
        print("❌ Invalid Hall ID!")
        sys.exit(1)
    
    # Ask which packages to add
    print("\n=== Available Package Templates ===")
    for i, pkg in enumerate(PACKAGE_TEMPLATES):
        print(f"{i+1}. {pkg['package_name']} - ₹{pkg['price']}")
    
    print("\nOptions:")
    print("  - Press ENTER to add all packages")
    print("  - Or enter package numbers separated by commas (e.g., 1,2,4)")
    
    selection = input("\nYour choice: ").strip()
    
    if selection:
        try:
            indices = [int(x.strip()) - 1 for x in selection.split(',')]
            add_packages_to_hall(hall_id, indices)
        except ValueError:
            print("❌ Invalid input!")
            sys.exit(1)
    else:
        add_packages_to_hall(hall_id)
