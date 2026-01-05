#!/usr/bin/env python3
"""
Script to remove 'Hall rental' text from existing package descriptions
"""
import psycopg2
import os

# Use Railway DB URL or local
DB_URL = os.getenv('DATABASE_URL', 'postgresql://postgres:tQOEqfExiGKGYKWOdHJKtYYLMUAoAWRM@yamabiko.proxy.rlwy.net:14904/railway')

def update_package_descriptions():
    conn = psycopg2.connect(DB_URL)
    cur = conn.cursor()
    
    print("="*60)
    print("Updating Package Descriptions - Removing 'Hall rental'")
    print("="*60)
    
    # Get all packages
    cur.execute('SELECT id, package_name, details FROM packages')
    packages = cur.fetchall()
    
    updated_count = 0
    
    for pkg_id, pkg_name, details in packages:
        if details and ('Hall rental' in details or 'Hall Rental' in details):
            # Remove "Hall rental, " or "Hall rental for 2 days, "
            new_details = details.replace('Hall rental for 2 days, ', '')
            new_details = new_details.replace('Hall rental, ', '')
            new_details = new_details.replace('Hall Rental, ', '')
            new_details = new_details.replace('Hall Rental for 2 days, ', '')
            
            # Update the package
            cur.execute('UPDATE packages SET details = %s WHERE id = %s', (new_details, pkg_id))
            print(f'✅ Updated: {pkg_name}')
            print(f'   Old: {details}')
            print(f'   New: {new_details}\n')
            updated_count += 1
    
    conn.commit()
    cur.close()
    conn.close()
    
    print("="*60)
    print(f'✅ Updated {updated_count} package(s) successfully!')
    print("="*60)

if __name__ == '__main__':
    try:
        update_package_descriptions()
    except Exception as e:
        print(f'❌ Error: {e}')
