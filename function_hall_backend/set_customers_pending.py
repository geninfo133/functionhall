import psycopg2
import config

conn = psycopg2.connect(
    user=config.DB_USER,
    password=config.DB_PASSWORD,
    host=config.DB_HOST,
    port=config.DB_PORT,
    database=config.DB_NAME
)
cursor = conn.cursor()
cursor.execute("UPDATE customers SET is_approved = FALSE, approval_status = 'pending'")
conn.commit()
print(f"✅ All customers set to pending approval")
cursor.execute("SELECT COUNT(*) FROM customers WHERE approval_status = 'pending'")
count = cursor.fetchone()[0]
print(f"📊 Total customers pending: {count}")
cursor.close()
conn.close()
