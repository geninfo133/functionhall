# ...existing imports...
from flask import Blueprint, jsonify, request
from twilio.rest import Client
import os
#from app.twilio_config import TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM_NUMBER
from app import db
from datetime import datetime, date
from flask import session

# Create blueprint FIRST
main = Blueprint('main', __name__)

# Import models and dependencies after Blueprint to avoid circular import
from app.models import FunctionHall, Package, Customer, Booking, Inquiry, AdminUser

# -------------------------
# LIST CUSTOMER ENQUIRIES
# -------------------------
@main.route('/api/enquiry', methods=['GET'])
def list_enquiries():
    enquiries = Inquiry.query.order_by(Inquiry.created_at.desc()).all()
    result = []
    for enquiry in enquiries:
        result.append({
            'id': enquiry.id,
            'customer_name': enquiry.customer_name,
            'email': enquiry.email,
            'message': enquiry.message,
            'created_at': enquiry.created_at.strftime('%Y-%m-%d %H:%M:%S')
        })
    return jsonify(result)
# -------------------------
# CUSTOMER ENQUIRY
# -------------------------
@main.route('/api/enquiry', methods=['POST'])
def customer_enquiry():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    phone = data.get('phone')
    message = data.get('message')
    hall_id = data.get('hall_id')
    if not name or not email or not message or not hall_id:
        return jsonify({'error': 'Name, email, hall, and message are required.'}), 400
    enquiry = Inquiry(
        customer_name=name,
        email=email,
        message=message,
        hall_id=hall_id
    )
    db.session.add(enquiry)
    db.session.commit()
    # Notify vendor (hall owner) via SMS using Twilio
    # Twilio/SMS sending removed. Only store enquiry in DB.
    return jsonify({'message': 'Enquiry submitted successfully!'}), 201
from werkzeug.security import generate_password_hash, check_password_hash
from flask import session

@main.route('/api/admin/register', methods=['POST'])
def admin_register():
    data = request.get_json()
    if not data.get('email') or not data.get('password') or not data.get('name'):
        return jsonify({'error': 'Name, email, and password are required.'}), 400
    if AdminUser.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email already registered.'}), 400
    admin = AdminUser(
        name=data['name'],
        email=data['email'],
        role='admin'
    )
    admin.set_password(data['password'])
    db.session.add(admin)
    db.session.commit()
    return jsonify({'message': 'Admin registered successfully!'}), 201

@main.route('/api/admin/login', methods=['POST'])
def admin_login():
    data = request.get_json()
    if not data.get('email') or not data.get('password'):
        return jsonify({'error': 'Email and password are required.'}), 400
    admin = AdminUser.query.filter_by(email=data['email']).first()
    if admin and admin.check_password(data['password']):
        # For simplicity, just return success and role (no JWT/session here)
        return jsonify({'message': 'Login successful!', 'role': admin.role, 'name': admin.name, 'email': admin.email}), 200
    return jsonify({'error': 'Invalid credentials.'}), 401
from datetime import datetime, date

# -------------------------
# UPDATE HALL
# -------------------------
@main.route('/api/halls/<int:hall_id>', methods=['PUT', 'PATCH'])
def update_hall(hall_id):
    hall = FunctionHall.query.get_or_404(hall_id)
    data = request.get_json()
    hall.name = data.get('name', hall.name)
    hall.owner_name = data.get('owner_name', hall.owner_name)
    hall.location = data.get('location', hall.location)
    hall.capacity = data.get('capacity', hall.capacity)
    hall.price_per_day = data.get('price_per_day', hall.price_per_day)
    hall.contact_number = data.get('contact_number', hall.contact_number)
    hall.description = data.get('description', hall.description)
    db.session.commit()
    return jsonify({"message": "Hall updated successfully!"})

# -------------------------
# DELETE HALL
# -------------------------
@main.route('/api/halls/<int:hall_id>', methods=['DELETE'])
def delete_hall(hall_id):
    hall = FunctionHall.query.get_or_404(hall_id)
    db.session.delete(hall)
    db.session.commit()
    return jsonify({"message": "Hall deleted successfully!"})

# -------------------------
# FUNCTION HALLS
# -------------------------
@main.route('/api/halls', methods=['GET'])
def get_halls():
    # Get query params
    location = request.args.get('location')
    name = request.args.get('name')
    guests = request.args.get('guests')
    date_str = request.args.get('date')
    sort = request.args.get('sort')
    query = FunctionHall.query
    if location:
        query = query.filter(FunctionHall.location.ilike(f"%{location}%"))
    if name:
        query = query.filter(FunctionHall.name.ilike(f"%{name}%"))
    if guests:
        try:
            guests_int = int(guests)
            query = query.filter(FunctionHall.capacity >= guests_int)
        except (ValueError, TypeError):
            pass  # Ignore invalid guest input
    if date_str:
        try:
            from datetime import datetime
            date_obj = datetime.strptime(date_str, "%Y-%m-%d").date()
            from app.models import Booking
            booked_hall_ids = [b.hall_id for b in Booking.query.filter_by(event_date=date_obj).all()]
            if booked_hall_ids:
                query = query.filter(~FunctionHall.id.in_(booked_hall_ids))
        except Exception:
            pass  # Ignore invalid date input
    # Sorting
    if sort == "price_asc":
        query = query.order_by(FunctionHall.price_per_day.asc())
    elif sort == "price_desc":
        query = query.order_by(FunctionHall.price_per_day.desc())
    elif sort == "capacity_asc":
        query = query.order_by(FunctionHall.capacity.asc())
    elif sort == "capacity_desc":
        query = query.order_by(FunctionHall.capacity.desc())
    halls = query.all()
    result = []
    for hall in halls:
        result.append({
            'id': hall.id,
            'name': hall.name,
            'owner_name': hall.owner_name,
            'location': hall.location,
            'capacity': hall.capacity,
            'price_per_day': hall.price_per_day,
            'contact_number': hall.contact_number,
            'description': hall.description
        })
    return jsonify(result)


@main.route('/api/halls/<int:hall_id>', methods=['GET'])
def get_hall(hall_id):
    hall = FunctionHall.query.get_or_404(hall_id)
    photos = [photo.url for photo in hall.photos]
    return jsonify({
        'id': hall.id,
        'name': hall.name,
        'owner_name': hall.owner_name,
        'location': hall.location,
        'capacity': hall.capacity,
        'price_per_day': hall.price_per_day,
        'contact_number': hall.contact_number,
        'description': hall.description,
        'photos': photos
    })


@main.route('/api/halls', methods=['POST'])
def add_hall():
    data = request.get_json()
    hall = FunctionHall(
        name=data['name'],
        location=data.get('location'),
        capacity=data.get('capacity'),
        price_per_day=data.get('price_per_day'),
        contact_number=data.get('contact_number'),
        description=data.get('description')
    )
    db.session.add(hall)
    db.session.commit()
    return jsonify({"message": "Hall added successfully!", "id": hall.id}), 201


# -------------------------
# PACKAGES
# -------------------------
@main.route('/api/packages', methods=['GET'])
def get_packages():
    packages = Package.query.all()
    result = []
    for pkg in packages:
        result.append({
            'id': pkg.id,
            'hall_id': pkg.hall_id,
            'package_name': pkg.package_name,
            'price': pkg.price,
            'details': pkg.details
        })
    return jsonify(result)


@main.route('/api/halls/<int:hall_id>/packages', methods=['GET'])
def get_packages_by_hall(hall_id):
    packages = Package.query.filter_by(hall_id=hall_id).all()
    result = [{'id': p.id, 'package_name': p.package_name, 'price': p.price, 'details': p.details} for p in packages]
    return jsonify(result)


@main.route('/api/packages', methods=['POST'])
def add_package():
    data = request.get_json()
    pkg = Package(
        hall_id=data['hall_id'],
        package_name=data['package_name'],
        price=data.get('price'),
        details=data.get('details')
    )
    db.session.add(pkg)
    db.session.commit()
    return jsonify({"message": "Package added successfully!", "id": pkg.id}), 201



@main.route('/api/bookings', methods=['POST'])
def add_booking():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'error': 'Unauthorized. Please log in.'}), 401
    
    data = request.get_json()
    hall_id = data.get('hall_id')
    event_date = data.get('event_date')
    package_id = data.get('package_id')
    
    if not hall_id or not event_date:
        return jsonify({'error': 'Hall ID and event date are required'}), 400
    
    # Get hall details
    hall = FunctionHall.query.get(hall_id)
    if not hall:
        return jsonify({'error': 'Hall not found'}), 404
    
    # Calculate total amount
    total_amount = hall.price_per_day
    if package_id:
        package = Package.query.get(package_id)
        if package:
            total_amount += package.price
    
    # Check if date is already booked
    existing_booking = Booking.query.filter_by(
        hall_id=hall_id,
        event_date=datetime.strptime(event_date, "%Y-%m-%d").date()
    ).filter(Booking.status.in_(['Pending', 'Confirmed'])).first()
    
    if existing_booking:
        return jsonify({'error': 'This hall is already booked for the selected date'}), 400
    
    # Create booking
    booking = Booking(
        customer_id=user_id,
        hall_id=hall_id,
        event_date=datetime.strptime(event_date, "%Y-%m-%d").date(),
        status='Pending',
        total_amount=total_amount
    )
    db.session.add(booking)
    db.session.commit()
    
    print(f"✅ Booking created: ID={booking.id}, Customer={user_id}, Hall={hall_id}, Date={event_date}")
    
    return jsonify({
        "message": "Booking created successfully!",
        "id": booking.id,
        "total_amount": total_amount,
        "status": "Pending"
    }), 201


@main.route('/api/bookings/<int:booking_id>', methods=['PUT'])
def update_booking_status(booking_id):
    booking = Booking.query.get_or_404(booking_id)
    data = request.get_json()
    booking.status = data.get('status', booking.status)
    db.session.commit()
    return jsonify({"message": f"Booking {booking.id} status updated to {booking.status}"})


# -------------------------
# INQUIRIES
# -------------------------
@main.route('/api/enquiries', methods=['GET'])
def get_inquiries():
    inquiries = Inquiry.query.all()
    result = [{'id': i.id, 'customer_name': i.customer_name, 'email': i.email, 'hall_id': i.hall_id, 'message': i.message} for i in inquiries]
    return jsonify(result)


@main.route('/api/my-bookings', methods=['GET'])
def get_my_bookings():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'error': 'Unauthorized'}), 401

    bookings = Booking.query.filter_by(customer_id=user_id).all()
    result = []
    for booking in bookings:
        result.append({
            'id': booking.id,
            'hall_name': booking.hall.name,
            'event_date': booking.event_date.strftime('%Y-%m-%d'),
            'status': booking.status,
            'total_amount': booking.total_amount
        })
    return jsonify(result)


@main.route('/api/profile', methods=['GET'])
def get_profile():
    user_id = session.get('user_id')
    print(f"🔍 Profile request - Session: {dict(session)}, user_id: {user_id}")
    if not user_id:
        print("❌ No user_id in session - Unauthorized")
        return jsonify({'error': 'Unauthorized'}), 401

    customer = Customer.query.get(user_id)
    if not customer:
        print(f"❌ Customer not found for user_id: {user_id}")
        return jsonify({'error': 'User not found'}), 404

    print(f"✅ Profile returned for: {customer.email}")
    return jsonify({
        'id': customer.id,
        'name': customer.name,
        'email': customer.email,
        'phone': customer.phone,
        'address': customer.address
    })


@main.route('/api/profile', methods=['PUT'])
def update_profile():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'error': 'Unauthorized'}), 401

    customer = Customer.query.get(user_id)
    if not customer:
        return jsonify({'error': 'User not found'}), 404

    data = request.get_json()
    customer.name = data.get('name', customer.name)
    customer.phone = data.get('phone', customer.phone)
    customer.address = data.get('address', customer.address)
    db.session.commit()

    return jsonify({
        'id': customer.id,
        'name': customer.name,
        'email': customer.email,
        'phone': customer.phone,
        'address': customer.address
    })


# Customer-specific profile endpoints
@main.route('/api/customer/profile', methods=['GET'])
def get_customer_profile():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'error': 'Unauthorized'}), 401

    customer = Customer.query.get(user_id)
    if not customer:
        return jsonify({'error': 'User not found'}), 404

    return jsonify({
        'id': customer.id,
        'name': customer.name,
        'email': customer.email,
        'phone': customer.phone,
        'address': customer.address
    })


@main.route('/api/customer/profile', methods=['PUT'])
def update_customer_profile():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'error': 'Unauthorized'}), 401

    customer = Customer.query.get(user_id)
    if not customer:
        return jsonify({'error': 'User not found'}), 404

    data = request.get_json()
    customer.name = data.get('name', customer.name)
    customer.phone = data.get('phone', customer.phone)
    customer.address = data.get('address', customer.address)
    db.session.commit()

    return jsonify({
        'id': customer.id,
        'name': customer.name,
        'email': customer.email,
        'phone': customer.phone,
        'address': customer.address
    })



