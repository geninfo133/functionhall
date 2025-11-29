"""
Delete all customers from database
"""

import sys
import os
sys.path.insert(0, '.')
os.chdir('d:/flask-projects/functionhall/function_hall_backend')

from app import create_app, db
from app.models import Customer

app = create_app()

with app.app_context():
    print("🗑️ Deleting all customers...")
    
    # Get count before deletion
    count = Customer.query.count()
    print(f"   Found {count} customers")
    
    # Delete all customers
    Customer.query.delete()
    db.session.commit()
    
    print(f"\n✅ Deleted {count} customers successfully!")
    print("   Database is now clean and ready for fresh customer registrations")
