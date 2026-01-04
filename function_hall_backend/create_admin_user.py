"""
Script to create an admin user in the Railway database
"""
import os
import sys
from app import create_app, db
from app.models import AdminUser

def create_admin():
    """Create a super admin user"""
    app = create_app()
    
    with app.app_context():
        # Check if user already exists
        email = input("Enter email: ")
        existing_user = AdminUser.query.filter_by(email=email).first()
        
        if existing_user:
            print(f"User with email {email} already exists!")
            return
        
        # Get user details
        name = input("Enter name: ")
        password = input("Enter password: ")
        role = input("Enter role (super_admin/vendor) [super_admin]: ").strip() or "super_admin"
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
        db.session.add(admin)
        db.session.commit()
        
        print(f"\n✓ Admin user created successfully!")
        print(f"  ID: {admin.id}")
        print(f"  Name: {admin.name}")
        print(f"  Email: {admin.email}")
        print(f"  Role: {admin.role}")
        print(f"  Approved: {admin.is_approved}")
        print(f"  Created at: {admin.created_at}")

if __name__ == "__main__":
    create_admin()
