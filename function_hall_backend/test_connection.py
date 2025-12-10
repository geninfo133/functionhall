from app import create_app, db
from app.models import FunctionHall, Customer, Booking, AdminUser

app = create_app()
print('✓ App created successfully!')

with app.app_context():
    halls = FunctionHall.query.all()
    customers = Customer.query.all()
    bookings = Booking.query.all()
    vendors = AdminUser.query.filter_by(role='vendor').all()
    
    print(f'\n✓ Database Connection Successful!')
    print(f'\nDatabase Statistics:')
    print(f'  - Function Halls: {len(halls)}')
    print(f'  - Customers: {len(customers)}')
    print(f'  - Bookings: {len(bookings)}')
    print(f'  - Vendors: {len(vendors)}')
    
    print(f'\nSample Function Halls:')
    for h in halls[:3]:
        print(f'  - {h.name} ({h.location}) - Capacity: {h.capacity}, Price: ₹{h.price_per_day:,.2f}')
    
    print(f'\n✓ PostgreSQL migration completed successfully!')
