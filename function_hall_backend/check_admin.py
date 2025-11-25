from app import create_app, db
from app.models import AdminUser

app = create_app()

with app.app_context():
    admins = AdminUser.query.all()
    print(f"\n{'='*50}")
    print(f"Total Admins in Database: {len(admins)}")
    print(f"{'='*50}\n")
    
    for admin in admins:
        print(f"ID: {admin.id}")
        print(f"Name: {admin.name}")
        print(f"Email: {admin.email}")
        print(f"Role: {admin.role}")
        print(f"Password Hash: {admin.password_hash[:20]}...")
        print()
        
        # Test password
        if admin.check_password("admin123"):
            print("✅ Password 'admin123' is CORRECT for this admin")
        else:
            print("❌ Password 'admin123' is INCORRECT for this admin")
        print(f"{'-'*50}\n")
