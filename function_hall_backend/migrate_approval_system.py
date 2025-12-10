"""
Migration script to add hall approval system
- Adds approval fields to function_halls table
- Creates hall_change_requests table
"""

import psycopg2
import config

def migrate():
    try:
        conn = psycopg2.connect(
            user=config.DB_USER,
            password=config.DB_PASSWORD,
            host=config.DB_HOST,
            port=config.DB_PORT,
            database=config.DB_NAME
        )
        cursor = conn.cursor()
        
        print("🚀 Starting migration...")
        
        # Add approval fields to function_halls table
        print("📝 Adding approval fields to function_halls table...")
        cursor.execute("""
            ALTER TABLE function_halls 
            ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT FALSE,
            ADD COLUMN IF NOT EXISTS approval_status VARCHAR(20) DEFAULT 'pending';
        """)
        
        # Update existing halls to be approved
        cursor.execute("""
            UPDATE function_halls 
            SET is_approved = TRUE, approval_status = 'approved' 
            WHERE is_approved IS NULL OR is_approved = FALSE;
        """)
        
        # Create hall_change_requests table
        print("📝 Creating hall_change_requests table...")
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS hall_change_requests (
                id SERIAL PRIMARY KEY,
                hall_id INTEGER REFERENCES function_halls(id) ON DELETE CASCADE,
                vendor_id INTEGER NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
                action_type VARCHAR(20) NOT NULL,
                status VARCHAR(20) DEFAULT 'pending',
                old_data TEXT,
                new_data TEXT,
                requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                reviewed_at TIMESTAMP,
                reviewed_by INTEGER REFERENCES admin_users(id),
                rejection_reason TEXT
            );
        """)
        
        # Create index for faster queries
        cursor.execute("""
            CREATE INDEX IF NOT EXISTS idx_change_requests_status 
            ON hall_change_requests(status);
        """)
        
        cursor.execute("""
            CREATE INDEX IF NOT EXISTS idx_change_requests_vendor 
            ON hall_change_requests(vendor_id);
        """)
        
        conn.commit()
        print("✅ Migration completed successfully!")
        print("\nNew features added:")
        print("  • Hall approval system")
        print("  • Vendor change request tracking")
        print("  • Admin approval workflow")
        
        cursor.close()
        conn.close()
        
    except Exception as e:
        print(f"❌ Migration failed: {e}")
        if conn:
            conn.rollback()

if __name__ == "__main__":
    migrate()
