"""
Script to clean database - removes all data except super admin users
"""

import psycopg2
import config

def clean_database():
    try:
        conn = psycopg2.connect(
            user=config.DB_USER,
            password=config.DB_PASSWORD,
            host=config.DB_HOST,
            port=config.DB_PORT,
            database=config.DB_NAME
        )
        cursor = conn.cursor()
        
        print("🧹 Starting database cleanup...")
        print("⚠️  This will remove all data except super admin users")
        
        # Delete in order to respect foreign key constraints
        
        print("📝 Deleting notifications...")
        cursor.execute("DELETE FROM notifications;")
        
        print("📝 Deleting bookings...")
        cursor.execute("DELETE FROM bookings;")
        
        print("📝 Deleting inquiries...")
        cursor.execute("DELETE FROM inquiries;")
        
        print("📝 Deleting calendar entries...")
        cursor.execute("DELETE FROM calendar;")
        
        print("📝 Deleting hall change requests...")
        cursor.execute("DELETE FROM hall_change_requests;")
        
        print("📝 Deleting packages...")
        cursor.execute("DELETE FROM packages;")
        
        print("📝 Deleting hall photos...")
        cursor.execute("DELETE FROM hall_photos;")
        
        print("📝 Deleting function halls...")
        cursor.execute("DELETE FROM function_halls;")
        
        print("📝 Deleting customers...")
        cursor.execute("DELETE FROM customers;")
        
        print("📝 Deleting partners...")
        cursor.execute("DELETE FROM partners;")
        
        print("📝 Deleting vendor users (keeping super admins)...")
        cursor.execute("DELETE FROM admin_users WHERE role != 'super_admin';")
        
        # Get count of remaining data
        cursor.execute("SELECT COUNT(*) FROM admin_users WHERE role = 'super_admin';")
        super_admin_count = cursor.fetchone()[0]
        
        conn.commit()
        
        print("\n✅ Database cleaned successfully!")
        print(f"\n📊 Remaining data:")
        print(f"   • Super Admin Users: {super_admin_count}")
        
        # Show remaining super admins
        if super_admin_count > 0:
            cursor.execute("SELECT id, name, email FROM admin_users WHERE role = 'super_admin';")
            admins = cursor.fetchall()
            print(f"\n👤 Super Admin Accounts:")
            for admin in admins:
                print(f"   • ID: {admin[0]}, Name: {admin[1]}, Email: {admin[2]}")
        
        cursor.close()
        conn.close()
        
    except Exception as e:
        print(f"❌ Cleanup failed: {e}")
        if conn:
            conn.rollback()

if __name__ == "__main__":
    response = input("⚠️  This will DELETE ALL DATA except super admin users. Continue? (yes/no): ")
    if response.lower() == 'yes':
        clean_database()
    else:
        print("❌ Operation cancelled")
