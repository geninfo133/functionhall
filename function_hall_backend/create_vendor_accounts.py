"""
Script to create vendor accounts for existing hall owners and link them to their halls
"""
from app import create_app, db
from app.models import AdminUser, FunctionHall
from sqlalchemy import text

app = create_app()

# Define vendor accounts for existing hall owners
vendors_data = [
    {
        "name": "Ch. Gopala Krishna Mohan",
        "email": "gopal@functionhall.com",
        "password": "gopal123",
        "phone": "+919876543210",
        "business_name": "Gopal's Function Halls",
        "owner_name": "Ch. Gopala Krishna Mohan"  # Match with FunctionHall.owner_name
    },
    {
        "name": "K. Meenakshi",
        "email": "meenakshi@functionhall.com",
        "password": "meenakshi123",
        "phone": "+919876543211",
        "business_name": "Lakshmi Kalyana Manapam",
        "owner_name": "K. Meenakshi"
    },
    {
        "name": "Ch. Bharani",
        "email": "bharani@functionhall.com",
        "password": "bharani123",
        "phone": "+919876543212",
        "business_name": "Celebrations Function Hall",
        "owner_name": "Ch. Bharani"
    }
]

with app.app_context():
    print("🔄 Creating vendor accounts for existing hall owners...")
    print("=" * 60)
    
    created_count = 0
    updated_count = 0
    
    for vendor_data in vendors_data:
        try:
            # Check if vendor already exists
            existing_vendor = AdminUser.query.filter_by(email=vendor_data['email']).first()
            
            if existing_vendor:
                print(f"\n⚠️  Vendor already exists: {vendor_data['email']}")
                print(f"   Updating password and approving account...")
                existing_vendor.set_password(vendor_data['password'])
                existing_vendor.is_approved = True
                existing_vendor.phone = vendor_data['phone']
                existing_vendor.business_name = vendor_data['business_name']
                vendor = existing_vendor
                updated_count += 1
            else:
                # Create new vendor account
                print(f"\n✅ Creating vendor: {vendor_data['name']} ({vendor_data['email']})")
                vendor = AdminUser(
                    name=vendor_data['name'],
                    email=vendor_data['email'],
                    phone=vendor_data['phone'],
                    business_name=vendor_data['business_name'],
                    role='vendor',
                    is_approved=True  # Auto-approve existing owners
                )
                vendor.set_password(vendor_data['password'])
                db.session.add(vendor)
                db.session.flush()  # Get vendor.id without committing
                created_count += 1
            
            # Find halls owned by this person
            halls = FunctionHall.query.filter_by(owner_name=vendor_data['owner_name']).all()
            
            if halls:
                print(f"   📍 Linking {len(halls)} hall(s) to vendor:")
                for hall in halls:
                    hall.vendor_id = vendor.id
                    print(f"      - {hall.name} (ID: {hall.id})")
            else:
                print(f"   ⚠️  No halls found for owner: {vendor_data['owner_name']}")
            
            db.session.commit()
            
        except Exception as e:
            print(f"\n❌ Error processing {vendor_data['name']}: {str(e)}")
            db.session.rollback()
    
    print("\n" + "=" * 60)
    print(f"✅ Migration completed!")
    print(f"   - Created: {created_count} new vendor(s)")
    print(f"   - Updated: {updated_count} existing vendor(s)")
    print(f"   - All vendors are approved and can login immediately")
    
    print("\n📋 Vendor Login Credentials:")
    print("-" * 60)
    for vendor_data in vendors_data:
        print(f"   Email: {vendor_data['email']}")
        print(f"   Password: {vendor_data['password']}")
        print(f"   Business: {vendor_data['business_name']}")
        print()
    
    print("🔗 Vendors can login at: http://localhost:3000/vendor/login")
