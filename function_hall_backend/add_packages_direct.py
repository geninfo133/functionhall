"""
Direct script to add packages to hall in Railway database
Usage: python3 add_packages_direct.py
"""
import psycopg2
import sys

# Package templates
PACKAGE_TEMPLATES = [
    {
        "package_name": "Basic Package",
        "price": 50000,
        "details": "Includes: Hall rental, Basic lighting, Tables & chairs, Air conditioning"
    },
    {
        "package_name": "Standard Package",
        "price": 75000,
        "details": "Includes: Hall rental, Premium lighting, Tables & chairs, Air conditioning, Sound system, Stage setup"
    },
    {
        "package_name": "Premium Package",
        "price": 100000,
        "details": "Includes: Hall rental, Premium lighting & effects, Decorated tables & chairs, Air conditioning, Professional sound system, Stage with backdrop, Complementary parking"
    },
    {
        "package_name": "Wedding Package",
        "price": 200000,
        "details": "Includes: Hall rental for 2 days, Complete wedding lighting & decoration, Premium furniture, Central AC, Professional sound & music, Mandap setup, Valet parking, Welcome area setup, Green room facilities"
    }
]

def list_halls(db_url):
    """List all halls"""
    try:
        conn = psycopg2.connect(db_url)
        cur = conn.cursor()
        
        cur.execute("""
            SELECT id, name, location, 
                   (SELECT COUNT(*) FROM packages WHERE hall_id = function_halls.id) as package_count
            FROM function_halls 
            ORDER BY id
        """)
        
        halls = cur.fetchall()
        
        if not halls:
            print("\n❌ No halls found.")
            cur.close()
            conn.close()
            return None
        
        print("\n=== Available Halls ===")
        for hall in halls:
            print(f"\nID: {hall[0]}")
            print(f"Name: {hall[1]}")
            print(f"Location: {hall[2]}")
            print(f"Existing Packages: {hall[3]}")
            print("-" * 40)
        
        cur.close()
        conn.close()
        return halls
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return None

def add_packages(db_url, hall_id, package_indices=None):
    """Add packages to a hall"""
    try:
        conn = psycopg2.connect(db_url)
        cur = conn.cursor()
        
        # Check if hall exists
        cur.execute("SELECT id, name FROM function_halls WHERE id = %s", (hall_id,))
        hall = cur.fetchone()
        
        if not hall:
            print(f"\n❌ Hall with ID {hall_id} not found!")
            cur.close()
            conn.close()
            return False
        
        print(f"\n📦 Adding packages to hall: {hall[1]} (ID: {hall[0]})")
        
        # If no specific packages selected, add all
        if package_indices is None:
            packages_to_add = PACKAGE_TEMPLATES
        else:
            packages_to_add = [PACKAGE_TEMPLATES[i] for i in package_indices if i < len(PACKAGE_TEMPLATES)]
        
        created_count = 0
        for pkg in packages_to_add:
            # Check if package already exists
            cur.execute("""
                SELECT id FROM packages 
                WHERE hall_id = %s AND package_name = %s
            """, (hall_id, pkg['package_name']))
            
            if cur.fetchone():
                print(f"⚠️  '{pkg['package_name']}' already exists, skipping...")
                continue
            
            # Insert package
            cur.execute("""
                INSERT INTO packages (hall_id, package_name, price, details)
                VALUES (%s, %s, %s, %s)
            """, (hall_id, pkg['package_name'], pkg['price'], pkg['details']))
            
            created_count += 1
            print(f"✅ Added: {pkg['package_name']} - ₹{pkg['price']:,}")
        
        if created_count > 0:
            conn.commit()
            print(f"\n✅ Successfully added {created_count} packages!")
        else:
            print(f"\n⚠️  No new packages added (all already exist)")
        
        cur.close()
        conn.close()
        return True
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return False

if __name__ == "__main__":
    print("\n" + "="*60)
    print("Add Packages to Hall - Railway Database")
    print("="*60)
    
    print("\n📋 To get your PUBLIC database URL:")
    print("   1. Go to railway.app dashboard")
    print("   2. Select your Postgres service")
    print("   3. Go to 'Connect' tab")
    print("   4. Copy the 'Postgres Connection URL' (public)")
    print("   5. The URL should look like: postgresql://postgres:xxx@xxxx.proxy.rlwy.net:12345/railway")
    
    db_url = input("\n🔗 Enter Railway PUBLIC database URL: ").strip()
    
    if not db_url or "railway.internal" in db_url:
        print("\n⚠️  Please use the PUBLIC database URL, not the internal one!")
        sys.exit(1)
    
    # List all halls
    halls = list_halls(db_url)
    
    if not halls:
        sys.exit(1)
    
    # Get hall ID
    print("\n" + "="*60)
    hall_id_input = input("\nEnter Hall ID to add packages: ").strip()
    
    try:
        hall_id = int(hall_id_input)
    except ValueError:
        print("❌ Invalid Hall ID!")
        sys.exit(1)
    
    # Ask which packages to add
    print("\n=== Available Package Templates ===")
    for i, pkg in enumerate(PACKAGE_TEMPLATES):
        print(f"{i+1}. {pkg['package_name']} - ₹{pkg['price']:,}")
    
    print("\nOptions:")
    print("  - Press ENTER to add all packages")
    print("  - Or enter package numbers separated by commas (e.g., 1,2,4)")
    
    selection = input("\nYour choice: ").strip()
    
    if selection:
        try:
            indices = [int(x.strip()) - 1 for x in selection.split(',')]
            add_packages(db_url, hall_id, indices)
        except ValueError:
            print("❌ Invalid input!")
            sys.exit(1)
    else:
        add_packages(db_url, hall_id)
    
    print("\n✅ Done! Packages have been added to the Railway database.")
    print("   Refresh your hall details page to see the packages!")
