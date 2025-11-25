from app import create_app, db
from app.models import AdminUser

app = create_app()

with app.app_context():
    # Check if admin exists
    admin = AdminUser.query.filter_by(email="admin@example.com").first()
    
    if not admin:
        # Create new admin
        admin = AdminUser(name="Gen", email="admin@example.com", role="admin")
        admin.set_password("admin123")
        db.session.add(admin)
        db.session.commit()
        print("✅ Default admin created: admin@example.com / admin123")
    else:
        # Update existing admin name and password
        admin.name = "Gen"
        admin.set_password("admin123")
        db.session.commit()
        print("✅ Admin updated: admin@example.com / admin123")
    
    # Test the password
    if admin.check_password("admin123"):
        print("✅ Password verification successful!")
    else:
        print("❌ Password verification failed!")
