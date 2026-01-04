"""
Script to create an admin user directly in Railway database
Run with: railway run python3 create_admin_railway.py
"""
import os
import sys
from app import create_app, db
from app.models import AdminUser

def list_users():
    """List all admin users"""
    users = AdminUser.query.all()
    
    if not users:
        print("\n❌ No admin users found in Railway database.")
        return
    
    print(f"\n=== Admin Users in Railway (Total: {len(users)}) ===")
    for user in users:
        print(f"\nID: {user.id}")
        print(f"Name: {user.name}")
        print(f"Email: {user.email}")
        print(f"Role: {user.role}")
        print(f"Phone: {user.phone or 'N/A'}")
        print(f"Business Name: {user.business_name or 'N/A'}")
        print(f"Approved: {user.is_approved}")
        print(f"Created: {user.created_at}")
        print("-" * 40)

def create_admin():
    """Create a super admin user"""
    # Check current database
    db_url = os.environ.get("DATABASE_URL", "Not set")
    print(f"\n🔗 Connected to: {db_url[:50]}..." if len(db_url) > 50 else f"\n🔗 Connected to: {db_url}")
    
    if "localhost" in db_url or "127.0.0.1" in db_url:
        print("⚠️  WARNING: You seem to be connected to a local database!")
        print("   Make sure to run this script with: railway run python3 create_admin_railway.py")
        response = input("\nDo you want to continue anyway? (yes/no): ")
        if response.lower() != "yes":
            return
    
    # First list existing users
    print("\n📋 Checking existing users...")
    list_users()
    
    print("\n" + "="*50)
    print("CREATE NEW ADMIN USER")
    print("="*50)
    
    # Get user details
    email = input("\nEnter email: ").strip()
    if not email:
        print("❌ Email is required!")
        return
    
    existing_user = AdminUser.query.filter_by(email=email).first()
    if existing_user:
        print(f"❌ User with email {email} already exists!")
        return
    
    name = input("Enter name: ").strip()
    if not name:
        print("❌ Name is required!")
        return
    
    password = input("Enter password: ").strip()
    if not password:
        print("❌ Password is required!")
        return
    
    role = input("Enter role (super_admin/vendor) [super_admin]: ").strip() or "super_admin"
    if role not in ["super_admin", "vendor"]:
        print("❌ Role must be 'super_admin' or 'vendor'")
        return
    
    phone = input("Enter phone (optional): ").strip() or None
    business_name = input("Enter business name (optional, for vendors): ").strip() or None
    
    # Create new admin user
    admin = AdminUser(
        name=name,
        email=email,
        role=role,
        phone=phone,
        business_name=business_name,
        is_approved=True  # Auto-approve
    )
    admin.set_password(password)
    
    # Save to database
    try:
        db.session.add(admin)
        db.session.commit()
        
        print(f"\n✅ Admin user created successfully in Railway database!")
        print(f"\n📝 Details:")
        print(f"  ID: {admin.id}")
        print(f"  Name: {admin.name}")
        print(f"  Email: {admin.email}")
        print(f"  Role: {admin.role}")
        print(f"  Phone: {admin.phone or 'N/A'}")
        print(f"  Business Name: {admin.business_name or 'N/A'}")
        print(f"  Approved: {admin.is_approved}")
        print(f"  Created at: {admin.created_at}")
    except Exception as e:
        db.session.rollback()
        print(f"\n❌ Error creating user: {str(e)}")

if __name__ == "__main__":
    app = create_app()
    
    with app.app_context():
        if len(sys.argv) > 1 and sys.argv[1] == "list":
            db_url = os.environ.get("DATABASE_URL", "Not set")
            print(f"🔗 Connected to: {db_url[:50]}..." if len(db_url) > 50 else f"🔗 Connected to: {db_url}")
            list_users()
        else:
            create_admin()
