import os
from app import create_app, db

# Delete the database file if it exists
db_path = os.path.join('app', 'functionhall.db')
if os.path.exists(db_path):
    try:
        os.remove(db_path)
        print(f"Deleted old database: {db_path}")
    except Exception as e:
        print(f"Error deleting database: {e}")
        print("Please close any applications using the database and try again.")
        exit(1)

# Create fresh database with all tables
app = create_app()
with app.app_context():
    db.create_all()
    print("Database recreated successfully with all tables!")
    print("\nNext steps:")
    print("1. Run: python add_sample_data.py")
    print("2. Run: python run.py")
