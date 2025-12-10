# PostgreSQL Migration Guide

## Prerequisites

1. **PostgreSQL installed** - Download from https://www.postgresql.org/download/
2. **Python packages** - Install required packages

## Setup Steps

### 1. Install PostgreSQL Driver

```bash
pip install -r requirements.txt
```

This will install `psycopg2-binary` which is the PostgreSQL adapter for Python.

### 2. Configure Database

Copy `.env.example` to `.env` and update with your PostgreSQL credentials:

```bash
cp .env.example .env
```

Edit `.env` file:

```env
# PostgreSQL Database Configuration
DB_USER=postgres
DB_PASSWORD=your_actual_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=functionhall_db

# Flask Configuration
SECRET_KEY=your-secret-key-here-change-in-production
FLASK_ENV=development
```

### 3. Create Database and Tables

Run the setup script:

```bash
python setup_postgres.py
```

This will:
- Create the `functionhall_db` database
- Initialize all tables
- Create a default super admin user

### 4. Run the Application

```bash
python run.py
```

## Default Super Admin Credentials

After setup, you can login with:
- **Email:** admin@example.com
- **Password:** admin123

⚠️ **Important:** Change the default password after first login!

## Database Connection String

The application uses the following format:
```
postgresql://{user}:{password}@{host}:{port}/{database}
```

Example:
```
postgresql://postgres:mypassword@localhost:5432/functionhall_db
```

## Troubleshooting

### Connection Error
If you get "could not connect to server":
1. Make sure PostgreSQL service is running
2. Check your credentials in `.env`
3. Verify PostgreSQL is listening on the correct port

### Database Already Exists
If you need to reset the database:
```sql
-- Connect to PostgreSQL
psql -U postgres

-- Drop and recreate database
DROP DATABASE functionhall_db;
```

Then run `python setup_postgres.py` again.

### Permission Denied
Make sure your PostgreSQL user has permission to create databases:
```sql
ALTER USER postgres CREATEDB;
```

## Migration from SQLite

If you have existing data in SQLite and want to migrate:

1. Export data from SQLite
2. Clean the new PostgreSQL database
3. Import the data

Or use a migration tool like `pgloader`:
```bash
pgloader functionhall.db postgresql://postgres:password@localhost/functionhall_db
```

## Benefits of PostgreSQL

- ✅ Better performance for concurrent users
- ✅ Advanced features (JSON, full-text search)
- ✅ Better suited for production
- ✅ Improved data integrity
- ✅ Better scalability
