import os
DB_USER = "postgres"
DB_PASSWORD = "gen"
DB_HOST = "localhost"
DB_PORT = "5432"
DB_NAME = "functionhall_db"
SQLALCHEMY_DATABASE_URI = os.environ.get("DATABASE_URL")
