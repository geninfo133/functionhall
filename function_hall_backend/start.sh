#!/bin/bash

# Clear old migration metadata if it exists
python3 << EOF
try:
    from app import create_app, db
    app = create_app()
    with app.app_context():
        db.engine.execute("DROP TABLE IF EXISTS alembic_version")
        print("Cleared old migration metadata")
except Exception as e:
    print(f"No migration metadata to clear: {e}")
EOF

# Run migrations
python3 -m flask db upgrade

# Start the application
python3 app.py
