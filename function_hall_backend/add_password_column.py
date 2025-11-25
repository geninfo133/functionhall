import sqlite3
import os

db_path = os.path.join('app', 'functionhall.db')

if not os.path.exists(db_path):
    print(f"Database not found at {db_path}")
    exit(1)

try:
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Check if password column already exists
    cursor.execute("PRAGMA table_info(customers)")
    columns = [col[1] for col in cursor.fetchall()]
    
    if 'password' in columns:
        print("Password column already exists in customers table.")
    else:
        # Add password column with default value
        cursor.execute("ALTER TABLE customers ADD COLUMN password VARCHAR(255) DEFAULT 'password'")
        conn.commit()
        print("Successfully added password column to customers table.")
        print("\nIMPORTANT: Existing customers have default password 'password'")
        print("Run add_sample_data.py to update with hashed passwords, or manually update them.")
    
    conn.close()
    
except Exception as e:
    print(f"Error: {e}")
    exit(1)
