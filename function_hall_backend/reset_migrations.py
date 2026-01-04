"""Reset migration state in database - run once to fix migration errors"""
from app import create_app, db

app = create_app()

with app.app_context():
    # Drop the alembic_version table to reset migration state
    db.engine.execute("DROP TABLE IF EXISTS alembic_version;")
    print("Migration state reset successfully!")
