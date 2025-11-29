"""
Add new fields to Customer model:
- country_code
- aadhar_number
- is_phone_verified
"""

import sys
import os
sys.path.insert(0, '.')
os.chdir('d:/flask-projects/functionhall/function_hall_backend')

from app import create_app, db
from sqlalchemy import text

app = create_app()

with app.app_context():
    print("🔄 Adding new columns to customers table...")
    
    # Check existing columns
    result = db.session.execute(text("PRAGMA table_info(customers)"))
    existing_columns = [row[1] for row in result]
    print(f"Existing columns: {existing_columns}")
    
    try:
        # Add country_code column
        if 'country_code' not in existing_columns:
            db.session.execute(text("ALTER TABLE customers ADD COLUMN country_code VARCHAR(5) DEFAULT '+91'"))
            print("✅ Added country_code column")
        else:
            print("⏭️ country_code column already exists")
        
        # Add aadhar_number column
        if 'aadhar_number' not in existing_columns:
            db.session.execute(text("ALTER TABLE customers ADD COLUMN aadhar_number VARCHAR(12)"))
            print("✅ Added aadhar_number column")
        else:
            print("⏭️ aadhar_number column already exists")
        
        # Add is_phone_verified column
        if 'is_phone_verified' not in existing_columns:
            db.session.execute(text("ALTER TABLE customers ADD COLUMN is_phone_verified BOOLEAN DEFAULT 0"))
            print("✅ Added is_phone_verified column")
        else:
            print("⏭️ is_phone_verified column already exists")
        
        db.session.commit()
        print("\n✅ Migration completed successfully!")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        db.session.rollback()
