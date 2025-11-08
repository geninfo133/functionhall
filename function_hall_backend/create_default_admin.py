from app import create_app, db
from app.models import AdminUser

app = create_app()

with app.app_context():
    # Create a default admin if not exists
    if not AdminUser.query.filter_by(email="admin@example.com").first():
        admin = AdminUser(name="Super Admin", email="admin@example.com", role="admin")
        admin.set_password("admin123")
        db.session.add(admin)
        db.session.commit()
        print("Default admin created: admin@example.com / admin123")
    else:
        print("Default admin already exists.")
