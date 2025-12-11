# PostgreSQL Migration Complete! ✓

Your Function Hall Management System has been successfully migrated from SQLite to PostgreSQL.

## Database Information
- **Database Name:** functionhall_db
- **Host:** localhost
- **Port:** 5432
- **User:** postgres

## Sample Data Created

### Statistics:
- **Function Halls:** 5 halls with photos and packages
- **Packages:** 9 different packages across halls  
- **Customers:** 7 registered customers
- **Bookings:** 7 bookings (past, current, and upcoming)
- **Vendors:** 3 approved vendors managing the halls
- **Inquiries:** 4 customer inquiries
- **Partners:** 5 B2B partners (caterers, decorators, etc.)
- **Admin Users:** 1 super admin + 3 vendors

## Login Credentials

### Super Admin:
- **Email:** admin@functionhall.com
- **Password:** admin123

### Vendors:
- **Email:** rajesh@venue.com | **Password:** vendor123
- **Email:** priya@events.com | **Password:** vendor123
- **Email:** amit@halls.com | **Password:** vendor123

### Customers:
- **Email:** sanjay@gmail.com | **Password:** customer123
- **Email:** meera@gmail.com | **Password:** customer123
- **Email:** vikram@gmail.com | **Password:** customer123
- **Email:** divya@gmail.com | **Password:** customer123
- **Email:** karthik@gmail.com | **Password:** customer123
- **Email:** anjali@gmail.com | **Password:** customer123
- **Email:** rahul@gmail.com | **Password:** customer123

## Sample Function Halls:

1. **Grand Palace Banquet** (Jubilee Hills, Hyderabad)
   - Capacity: 500 guests
   - Price: ₹75,000/day
   - 3 packages available

2. **Crystal Garden Hall** (Banjara Hills, Hyderabad)
   - Capacity: 300 guests
   - Price: ₹50,000/day
   - 2 packages available

3. **Sapphire Convention Center** (HITEC City, Hyderabad)
   - Capacity: 800 guests
   - Price: ₹1,20,000/day
   - 2 packages available

4. **Maharaja Celebration Hall** (Madhapur, Hyderabad)
   - Capacity: 400 guests
   - Price: ₹60,000/day
   - 1 package available

5. **Pearl Banquet & Lawns** (Gachibowli, Hyderabad)
   - Capacity: 600 guests
   - Price: ₹85,000/day
   - 1 package available

## How to Run the Application

### Backend (Flask):
```bash
cd d:\flask-projects\functionhall\function_hall_backend
python app.py
```
The backend will run on http://localhost:5000

### Frontend (Next.js):
```bash
cd d:\flask-projects\functionhall\function_hall_frontend
npm run dev
```
The frontend will run on http://localhost:3000

## Database Commands

### Connect to PostgreSQL:
```bash
psql -U postgres -h localhost -d functionhall_db
```

### View all tables:
```sql
\dt
```

### Check data:
```sql
SELECT * FROM function_halls;
SELECT * FROM customers;
SELECT * FROM bookings;
```

## Features Included in Sample Data:

- ✓ Multiple function halls with different capacities and pricing
- ✓ Each hall has multiple photos (using Unsplash placeholder images)
- ✓ Various packages (Basic, Premium, Luxury) for each hall
- ✓ Registered customers with hashed passwords
- ✓ Past, current, and upcoming bookings
- ✓ Calendar entries showing availability for next 90 days
- ✓ Customer inquiries (both registered and guest inquiries)
- ✓ Vendor accounts managing specific halls
- ✓ B2B partners (caterers, photographers, decorators, etc.)
- ✓ Notifications for vendors about bookings and inquiries

## Scripts Created:

1. **create_sample_data.py** - Populates database with realistic sample data
2. **test_connection.py** - Tests PostgreSQL connection and displays stats

## Notes:

- The .env file encoding issue has been fixed with error handling in twilio_config.py
- SMS is disabled by default (set SMS_ENABLED=False)
- All passwords are properly hashed using werkzeug security
- Calendar system tracks availability for next 90 days
- Vendor accounts are pre-approved and can manage their assigned halls

## Next Steps:

1. Start the Flask backend: `python app.py`
2. Start the Next.js frontend: `npm run dev`  
3. Login with any of the credentials above
4. Test the full application with pre-populated data!

---
**Migration Date:** December 8, 2025
**Database:** PostgreSQL 17.5
**Status:** ✓ Complete and Tested
