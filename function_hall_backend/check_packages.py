#!/usr/bin/env python3
"""
Check existing packages in the database
"""
import psycopg2

DB_URL = 'postgresql://postgres:tQOEqfExiGKGYKWOdHJKtYYLMUAoAWRM@yamabiko.proxy.rlwy.net:14904/railway'

def check_packages():
    conn = psycopg2.connect(DB_URL)
    cur = conn.cursor()
    
    print("="*80)
    print("Checking Packages in Database")
    print("="*80)
    
    cur.execute('SELECT id, hall_id, package_name, price, details FROM packages ORDER BY hall_id, id')
    packages = cur.fetchall()
    
    if not packages:
        print("❌ No packages found in database")
    else:
        print(f"\n✅ Found {len(packages)} package(s):\n")
        for pkg_id, hall_id, pkg_name, price, details in packages:
            print(f"ID: {pkg_id} | Hall: {hall_id} | {pkg_name} | ₹{price:,}")
            print(f"Details: {details}")
            print("-" * 80)
    
    cur.close()
    conn.close()

if __name__ == '__main__':
    try:
        check_packages()
    except Exception as e:
        print(f'❌ Error: {e}')
