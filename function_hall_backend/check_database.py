import psycopg2
import config

try:
    # Connect to database
    conn = psycopg2.connect(
        user=config.DB_USER,
        password=config.DB_PASSWORD,
        host=config.DB_HOST,
        port=config.DB_PORT,
        database=config.DB_NAME
    )
    cursor = conn.cursor()
    
    print(f"✓ Connected to database: {config.DB_NAME}")
    print("\n" + "="*60)
    
    # Get all tables
    cursor.execute("""
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
        ORDER BY table_name;
    """)
    
    tables = cursor.fetchall()
    print(f"\nTables in database ({len(tables)}):")
    print("-" * 60)
    for table in tables:
        print(f"  • {table[0]}")
    
    print("\n" + "="*60)
    
    # Get row counts for each table
    print("\nTable Row Counts:")
    print("-" * 60)
    for table in tables:
        table_name = table[0]
        cursor.execute(f"SELECT COUNT(*) FROM {table_name}")
        count = cursor.fetchone()[0]
        print(f"  {table_name}: {count} rows")
    
    cursor.close()
    conn.close()
    print("\n✓ Database check completed successfully!")
    
except Exception as e:
    print(f"✗ Error: {e}")
