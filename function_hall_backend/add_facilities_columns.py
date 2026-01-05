"""
Add facilities columns to function_halls table
Run this once to update existing database
"""
from app import create_app, db
from sqlalchemy import text

app = create_app()

with app.app_context():
    try:
        # Check if columns exist, if not add them
        with db.engine.connect() as conn:
            # Add has_basic_rooms column
            try:
                conn.execute(text("""
                    ALTER TABLE function_halls 
                    ADD COLUMN has_basic_rooms BOOLEAN DEFAULT TRUE
                """))
                print("✅ Added has_basic_rooms column")
            except Exception as e:
                if "already exists" in str(e) or "duplicate" in str(e).lower():
                    print("ℹ️  has_basic_rooms column already exists")
                else:
                    print(f"❌ Error adding has_basic_rooms: {e}")
            
            # Add has_stage column
            try:
                conn.execute(text("""
                    ALTER TABLE function_halls 
                    ADD COLUMN has_stage BOOLEAN DEFAULT TRUE
                """))
                print("✅ Added has_stage column")
            except Exception as e:
                if "already exists" in str(e) or "duplicate" in str(e).lower():
                    print("ℹ️  has_stage column already exists")
                else:
                    print(f"❌ Error adding has_stage: {e}")
            
            # Add basic_rooms_count column
            try:
                conn.execute(text("""
                    ALTER TABLE function_halls 
                    ADD COLUMN basic_rooms_count INTEGER DEFAULT 2
                """))
                print("✅ Added basic_rooms_count column")
            except Exception as e:
                if "already exists" in str(e) or "duplicate" in str(e).lower():
                    print("ℹ️  basic_rooms_count column already exists")
                else:
                    print(f"❌ Error adding basic_rooms_count: {e}")
            
            conn.commit()
        
        print("\n✅ Migration completed successfully!")
        print("All facilities columns are now available in the database.")
        
    except Exception as e:
        print(f"❌ Migration failed: {e}")
