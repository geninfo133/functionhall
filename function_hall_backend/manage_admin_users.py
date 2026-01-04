"""
Script to manage admin users in the Railway database
"""
import os
import sys
from app import create_app, db
from app.models import AdminUser

def list_users():
    """List all admin users"""
    app = create_app()
    
    with app.app_context():
        users = AdminUser.query.all()
        
        if not users:
            print("No admin users found.")
            return
        
        print("\n=== Admin Users ===")
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

def create_user_with_details(name, email, password, role="super_admin", phone=None, business_name=None):
    """Create a user with provided details"""
    app = create_app()
    
    with app.app_context():
        # Check if user already exists
        existing_user = AdminUser.query.filter_by(email=email).first()
        
        if existing_user:
            print(f"❌ User with email {email} already exists!")
            return False
        
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
        db.session.add(admin)
        db.session.commit()
        
        print(f"\n✓ Admin user created successfully!")
        print(f"  ID: {admin.id}")
        print(f"  Name: {admin.name}")
        print(f"  Email: {admin.email}")
        print(f"  Role: {admin.role}")
        print(f"  Approved: {admin.is_approved}")
        print(f"  Created at: {admin.created_at}")
        return True

def interactive_create():
    """Interactively create an admin user"""
    app = create_app()
    
    with app.app_context():
        # Get user details
        email = input("Enter email: ")
        
        existing_user = AdminUser.query.filter_by(email=email).first()
        if existing_user:
            print(f"❌ User with email {email} already exists!")
            return
        
        name = input("Enter name: ")
        password = input("Enter password: ")
        role = input("Enter role (super_admin/vendor) [super_admin]: ").strip() or "super_admin"
        phone = input("Enter phone (optional): ").strip() or None
        business_name = input("Enter business name (optional, for vendors): ").strip() or None
        
        # Create user
        create_user_with_details(name, email, password, role, phone, business_name)

if __name__ == "__main__":
    if len(sys.argv) > 1:
        command = sys.argv[1].lower()
        
        if command == "list":
            list_users()
        elif command == "create":
            if len(sys.argv) >= 5:
                # create <name> <email> <password> [role] [phone] [business_name]
                name = sys.argv[2]
                email = sys.argv[3]
                password = sys.argv[4]
                role = sys.argv[5] if len(sys.argv) > 5 else "super_admin"
                phone = sys.argv[6] if len(sys.argv) > 6 else None
                business_name = sys.argv[7] if len(sys.argv) > 7 else None
                
                create_user_with_details(name, email, password, role, phone, business_name)
            else:
                interactive_create()
        else:
            print("Usage:")
            print("  python3 manage_admin_users.py list")
            print("  python3 manage_admin_users.py create")
            print("  python3 manage_admin_users.py create <name> <email> <password> [role] [phone] [business_name]")
    else:
        print("Usage:")
        print("  python3 manage_admin_users.py list")
        print("  python3 manage_admin_users.py create")
        print("  python3 manage_admin_users.py create <name> <email> <password> [role] [phone] [business_name]")
