"""
Direct script to add admin user to Railway database
Usage: python3 add_admin_direct.py <public_database_url>
"""
import sys
import psycopg2
from werkzeug.security import generate_password_hash
from datetime import datetime

def add_admin_user(db_url, name, email, password, role="super_admin", phone=None, business_name=None):
    """Add admin user directly to database"""
    try:
        # Connect to database
        conn = psycopg2.connect(db_url)
        cur = conn.cursor()
        
        # Check if user exists
        cur.execute("SELECT id, email FROM admin_users WHERE email = %s", (email,))
        existing = cur.fetchone()
        
        if existing:
            print(f"❌ User with email {email} already exists (ID: {existing[0]})")
            cur.close()
            conn.close()
            return False
        
        # Hash password
        password_hash = generate_password_hash(password)
        
        # Insert new user
        query = """
            INSERT INTO admin_users 
            (name, email, password_hash, role, phone, business_name, is_approved, created_at)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING id, created_at
        """
        
        cur.execute(query, (
            name,
            email,
            password_hash,
            role,
            phone,
            business_name,
            True,  # is_approved
            datetime.utcnow()
        ))
        
        result = cur.fetchone()
        user_id = result[0]
        created_at = result[1]
        
        conn.commit()
        
        print(f"\n✅ Admin user created successfully in Railway database!")
        print(f"\n📝 Details:")
        print(f"  ID: {user_id}")
        print(f"  Name: {name}")
        print(f"  Email: {email}")
        print(f"  Role: {role}")
        print(f"  Phone: {phone or 'N/A'}")
        print(f"  Business Name: {business_name or 'N/A'}")
        print(f"  Approved: True")
        print(f"  Created at: {created_at}")
        
        cur.close()
        conn.close()
        return True
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return False

def list_admin_users(db_url):
    """List all admin users"""
    try:
        conn = psycopg2.connect(db_url)
        cur = conn.cursor()
        
        cur.execute("""
            SELECT id, name, email, role, phone, business_name, is_approved, created_at 
            FROM admin_users 
            ORDER BY id
        """)
        
        users = cur.fetchall()
        
        if not users:
            print("\n❌ No admin users found in Railway database.")
        else:
            print(f"\n=== Admin Users in Railway (Total: {len(users)}) ===")
            for user in users:
                print(f"\nID: {user[0]}")
                print(f"Name: {user[1]}")
                print(f"Email: {user[2]}")
                print(f"Role: {user[3]}")
                print(f"Phone: {user[4] or 'N/A'}")
                print(f"Business Name: {user[5] or 'N/A'}")
                print(f"Approved: {user[6]}")
                print(f"Created: {user[7]}")
                print("-" * 40)
        
        cur.close()
        conn.close()
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")

if __name__ == "__main__":
    print("\n" + "="*60)
    print("Railway Admin User Manager")
    print("="*60)
    
    # Get database URL from Railway
    print("\n📋 To get your PUBLIC database URL:")
    print("   1. Go to railway.app dashboard")
    print("   2. Select your Postgres service")
    print("   3. Go to 'Connect' tab")
    print("   4. Copy the 'Postgres Connection URL' (public)")
    print("   5. The URL should look like: postgresql://postgres:xxx@xxxx.proxy.rlwy.net:12345/railway")
    
    db_url = input("\n🔗 Enter Railway PUBLIC database URL: ").strip()
    
    if not db_url or "railway.internal" in db_url:
        print("\n⚠️  Please use the PUBLIC database URL, not the internal one!")
        print("   The public URL should contain '.proxy.rlwy.net' or similar.")
        sys.exit(1)
    
    print("\n" + "="*60)
    print("Choose an option:")
    print("  1. List existing admin users")
    print("  2. Create new admin user")
    print("="*60)
    
    choice = input("\nEnter choice (1 or 2): ").strip()
    
    if choice == "1":
        list_admin_users(db_url)
    elif choice == "2":
        print("\n" + "="*60)
        print("CREATE NEW ADMIN USER")
        print("="*60)
        
        # First list existing users
        print("\n📋 Current users:")
        list_admin_users(db_url)
        
        print("\n" + "="*60)
        
        name = input("\nEnter name: ").strip()
        email = input("Enter email: ").strip()
        password = input("Enter password: ").strip()
        role = input("Enter role (super_admin/vendor) [super_admin]: ").strip() or "super_admin"
        phone = input("Enter phone (optional): ").strip() or None
        business_name = input("Enter business name (optional): ").strip() or None
        
        if not name or not email or not password:
            print("❌ Name, email, and password are required!")
            sys.exit(1)
        
        add_admin_user(db_url, name, email, password, role, phone, business_name)
    else:
        print("❌ Invalid choice!")
