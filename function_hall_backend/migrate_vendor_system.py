"""
Migration script to add vendor support to existing database
Run this script to update the database schema for the vendor system
"""
from app import create_app, db
from app.models import AdminUser, FunctionHall
from sqlalchemy import text

app = create_app()

with app.app_context():
    print("🔄 Starting vendor system migration...")
    
    try:
        # Add new columns to admin_users table
        with db.engine.connect() as conn:
            # Check if columns exist before adding
            result = conn.execute(text("PRAGMA table_info(admin_users)"))
            columns = [row[1] for row in result]
            
            if 'phone' not in columns:
                print("📝 Adding phone column to admin_users...")
                conn.execute(text("ALTER TABLE admin_users ADD COLUMN phone VARCHAR(20)"))
                conn.commit()
            
            if 'business_name' not in columns:
                print("📝 Adding business_name column to admin_users...")
                conn.execute(text("ALTER TABLE admin_users ADD COLUMN business_name VARCHAR(150)"))
                conn.commit()
            
            if 'is_approved' not in columns:
                print("📝 Adding is_approved column to admin_users...")
                conn.execute(text("ALTER TABLE admin_users ADD COLUMN is_approved BOOLEAN DEFAULT 0"))
                conn.commit()
            
            # Update role column default for existing records
            print("📝 Updating existing admin roles...")
            conn.execute(text("UPDATE admin_users SET role = 'super_admin' WHERE role = 'admin'"))
            conn.execute(text("UPDATE admin_users SET is_approved = 1 WHERE role = 'super_admin'"))
            conn.commit()
        
        # Add vendor_id column to function_halls table
        with db.engine.connect() as conn:
            result = conn.execute(text("PRAGMA table_info(function_halls)"))
            columns = [row[1] for row in result]
            
            if 'vendor_id' not in columns:
                print("📝 Adding vendor_id column to function_halls...")
                conn.execute(text("ALTER TABLE function_halls ADD COLUMN vendor_id INTEGER REFERENCES admin_users(id)"))
                conn.commit()
        
        print("✅ Migration completed successfully!")
        print("\n📋 Summary:")
        print("   - Added phone, business_name, is_approved columns to admin_users")
        print("   - Added vendor_id column to function_halls")
        print("   - Updated existing admin roles to 'super_admin'")
        print("\n⚠️  Next steps:")
        print("   1. Existing admins are now 'super_admin' with is_approved=True")
        print("   2. New vendors will register with role='vendor' and is_approved=False")
        print("   3. Super admins can approve vendors through the admin panel")
        
    except Exception as e:
        print(f"❌ Migration failed: {str(e)}")
        db.session.rollback()
