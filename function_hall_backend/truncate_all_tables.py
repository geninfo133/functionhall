from app import create_app, db

app = create_app()

table_names = [
    'hall_photos',
    'bookings',
    'packages',
    'function_halls',
    'admin_users',
    'customers',
    'inquiries',
    'notifications',
    'hall_change_requests',
    'partners',
    'calendar',
]

with app.app_context():
    db.session.execute(f'TRUNCATE TABLE {", ".join(f'"{name}"' for name in table_names)} RESTART IDENTITY CASCADE;')
    db.session.commit()
    print("All tables truncated.")
