from app import create_app, db
from app.models import AdminUser
from werkzeug.security import generate_password_hash, check_password_hash

# This script will re-hash any admin password that is not already hashed
# WARNING: You must know the original plain-text password to re-hash it correctly.
# If you do not know the original password, you should reset it to a new value.

def is_hashed(pw_hash):
    # Werkzeug hashes start with 'pbkdf2:' or similar
    return pw_hash and pw_hash.startswith('pbkdf2:')

def main():
    app = create_app()
    with app.app_context():
        admins = AdminUser.query.all()
        for admin in admins:
            if not is_hashed(admin.password_hash):
                print(f"Admin {admin.email} has a non-hashed password. Resetting to 'admin123'.")
                admin.set_password('admin123')  # Set a new password and hash it
                db.session.commit()
                print(f"Password for {admin.email} has been reset and hashed.")
            else:
                print(f"Admin {admin.email} password is already hashed.")

if __name__ == '__main__':
    main()
