#!/usr/bin/env python3
"""
Migration script to add function_type column to bookings table
"""
from app import create_app, db
from sqlalchemy import text

def add_function_type_column():
    app = create_app()
    with app.app_context():
        try:
            # Check if column already exists
            result = db.session.execute(text("""
                SELECT column_name 
                FROM information_schema.columns 
                WHERE table_name='bookings' AND column_name='function_type';
            """))
            
            if result.fetchone():
                print("✓ Column 'function_type' already exists in bookings table")
                return
            
            # Add the column
            db.session.execute(text("""
                ALTER TABLE bookings 
                ADD COLUMN function_type VARCHAR(100);
            """))
            db.session.commit()
            print("✓ Successfully added 'function_type' column to bookings table")
            
        except Exception as e:
            print(f"✗ Error adding column: {e}")
            db.session.rollback()

if __name__ == "__main__":
    add_function_type_column()
