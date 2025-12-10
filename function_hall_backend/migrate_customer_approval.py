"""
Migration script to add customer approval system
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
        
        print("🚀 Starting customer approval migration...")
        
        # Add approval fields to customers table
        print("📝 Adding approval fields to customers table...")
        cursor.execute("""
            ALTER TABLE customers 
            ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT FALSE,
            ADD COLUMN IF NOT EXISTS approval_status VARCHAR(20) DEFAULT 'pending',
            ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
        """)
        
        # Set existing customers to pending (no auto-approval)
        cursor.execute("""
            UPDATE customers 
            SET is_approved = FALSE, approval_status = 'pending' 
            WHERE is_approved IS NULL;
        """)
        
        conn.commit()
        print("✅ Customer approval system migration completed successfully!")
        
        cursor.close()
        conn.close()
        
    except Exception as e:
        print(f"❌ Migration failed: {e}")
        if conn:
            conn.rollback()

if __name__ == "__main__":
    migrate()
