#!/usr/bin/env python3
"""
Run all pending migrations on Railway
Execute this once on Railway to update the production database
"""

import sys
import os

# Add the backend directory to the path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

def run_migration(script_name):
    """Run a migration script and handle errors"""
    print(f"\n{'='*60}")
    print(f"Running: {script_name}")
    print(f"{'='*60}\n")
    
    try:
        with open(script_name, 'r') as f:
            code = f.read()
        exec(code, {'__name__': '__main__'})
        print(f"\n✓ {script_name} completed successfully\n")
        return True
    except Exception as e:
        print(f"\n✗ Error in {script_name}: {e}\n")
        return False

if __name__ == "__main__":
    print("\n" + "="*60)
    print("RAILWAY DATABASE MIGRATIONS")
    print("="*60)
    
    migrations = [
        'add_function_type_column.py',
        'add_dining_kitchen_columns.py'
    ]
    
    results = {}
    for migration in migrations:
        results[migration] = run_migration(migration)
    
    print("\n" + "="*60)
    print("MIGRATION SUMMARY")
    print("="*60)
    for migration, success in results.items():
        status = "✓ SUCCESS" if success else "✗ FAILED"
        print(f"{status}: {migration}")
    
    all_success = all(results.values())
    if all_success:
        print("\n✓ All migrations completed successfully!")
    else:
        print("\n✗ Some migrations failed. Check the logs above.")
        sys.exit(1)
