"""
PostgreSQL Database Setup Script
Creates the database and initializes tables
"""

import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Database configuration
DB_USER = os.getenv('DB_USER', 'postgres')
DB_PASSWORD = os.getenv('DB_PASSWORD', 'postgres')
DB_HOST = os.getenv('DB_HOST', 'localhost')
DB_PORT = os.getenv('DB_PORT', '5432')
DB_NAME = os.getenv('DB_NAME', 'functionhall_db')

def create_database():
    """Create the PostgreSQL database if it doesn't exist"""
    try:
        # Connect to PostgreSQL server
        conn = psycopg2.connect(
            user=DB_USER,
            password=DB_PASSWORD,
            host=DB_HOST,
            port=DB_PORT,
            database='postgres'  # Connect to default database
        )
        conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cursor = conn.cursor()
        
        # Check if database exists
        cursor.execute(f"SELECT 1 FROM pg_database WHERE datname = '{DB_NAME}'")
        exists = cursor.fetchone()
        
        if not exists:
            cursor.execute(f'CREATE DATABASE {DB_NAME}')
            print(f'✅ Database "{DB_NAME}" created successfully!')
        else:
            print(f'ℹ️  Database "{DB_NAME}" already exists.')
        
        cursor.close()
        conn.close()
        
    except Exception as e:
        print(f'❌ Error creating database: {e}')
        return False
    
    return True

def initialize_tables():
    """Initialize database tables using Flask-SQLAlchemy"""
    try:
        from app import create_app, db
        
        app = create_app()
        with app.app_context():
            db.create_all()
            print('✅ Database tables created successfully!')
            
    except Exception as e:
        print(f'❌ Error initializing tables: {e}')
        return False
    
    return True

def create_super_admin():
    """Create default super admin user"""
    try:
        from app import create_app, db
        from app.models import AdminUser
        
        app = create_app()
        with app.app_context():
            # Check if super admin already exists
            admin = AdminUser.query.filter_by(email='admin@example.com').first()
            
            if not admin:
                admin = AdminUser(
                    name='Gen',
                    email='admin@example.com',
                    role='super_admin',
                    is_approved=True
                )
                admin.set_password('admin123')
                db.session.add(admin)
                db.session.commit()
                print('✅ Super admin created successfully!')
                print('   Email: admin@example.com')
                print('   Password: admin123')
            else:
                print('ℹ️  Super admin already exists.')
                
    except Exception as e:
        print(f'❌ Error creating super admin: {e}')
        return False
    
    return True

if __name__ == '__main__':
    print('\n🚀 PostgreSQL Database Setup\n')
    print(f'Database: {DB_NAME}')
    print(f'Host: {DB_HOST}:{DB_PORT}')
    print(f'User: {DB_USER}\n')
    
    # Step 1: Create database
    if create_database():
        # Step 2: Initialize tables
        if initialize_tables():
            # Step 3: Create super admin
            create_super_admin()
            print('\n✅ Setup completed successfully!')
        else:
            print('\n❌ Setup failed at table initialization.')
    else:
        print('\n❌ Setup failed at database creation.')
