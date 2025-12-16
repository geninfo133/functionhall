import os

# Local development defaults (change as needed)
DB_USER = os.environ.get('DB_USER', 'your_db_user')
DB_PASSWORD = os.environ.get('DB_PASSWORD', 'your_db_password')
DB_HOST = os.environ.get('DB_HOST', 'localhost')
DB_PORT = os.environ.get('DB_PORT', '5432')
DB_NAME = os.environ.get('DB_NAME', 'functionhall_db')
