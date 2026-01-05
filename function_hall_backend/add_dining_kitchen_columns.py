#!/usr/bin/env python3
"""
Migration script to add dining hall and kitchen columns to function_halls table
"""
from app import create_app, db
from sqlalchemy import text

def add_dining_kitchen_columns():
    app = create_app()
    with app.app_context():
        try:
            # Check and add has_dining_hall column
            result = db.session.execute(text("""
                SELECT column_name 
                FROM information_schema.columns 
                WHERE table_name='function_halls' AND column_name='has_dining_hall';
            """))
            
            if not result.fetchone():
                db.session.execute(text("""
                    ALTER TABLE function_halls 
                    ADD COLUMN has_dining_hall BOOLEAN DEFAULT TRUE;
                """))
                print("✓ Added 'has_dining_hall' column")
            else:
                print("✓ Column 'has_dining_hall' already exists")
            
            # Check and add has_kitchen column
            result = db.session.execute(text("""
                SELECT column_name 
                FROM information_schema.columns 
                WHERE table_name='function_halls' AND column_name='has_kitchen';
            """))
            
            if not result.fetchone():
                db.session.execute(text("""
                    ALTER TABLE function_halls 
                    ADD COLUMN has_kitchen BOOLEAN DEFAULT TRUE;
                """))
                print("✓ Added 'has_kitchen' column")
            else:
                print("✓ Column 'has_kitchen' already exists")
            
            # Update existing halls to have these facilities
            db.session.execute(text("""
                UPDATE function_halls 
                SET has_dining_hall = TRUE, has_kitchen = TRUE 
                WHERE has_dining_hall IS NULL OR has_kitchen IS NULL;
            """))
            
            db.session.commit()
            print("✓ Successfully added dining hall and kitchen columns to function_halls table")
            print("✓ All existing halls now have dining hall and kitchen facilities enabled")
            
        except Exception as e:
            print(f"✗ Error adding columns: {e}")
            db.session.rollback()

if __name__ == "__main__":
    add_dining_kitchen_columns()
