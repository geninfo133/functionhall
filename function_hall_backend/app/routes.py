from flask import Blueprint, jsonify, request
from app import db
from app.models import FunctionHall, Package, Customer, Booking, Inquiry
from datetime import datetime, date

main = Blueprint('main', __name__)

# -------------------------
# FUNCTION HALLS
# -------------------------
@main.route('/api/halls', methods=['GET'])
def get_halls():
    halls = FunctionHall.query.all()
    result = []
    for hall in halls:
        result.append({
            'id': hall.id,
            'name': hall.name,
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
    return jsonify({
        'id': hall.id,
        'name': hall.name,
        'location': hall.location,
        'capacity': hall.capacity,
        'price_per_day': hall.price_per_day,
        'contact_number': hall.contact_number,
        'description': hall.description
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


# -------------------------
# CUSTOMERS
# -------------------------
@main.route('/api/customers', methods=['GET'])
def get_customers():
    customers = Customer.query.all()
    result = [{'id': c.id, 'name': c.name, 'email': c.email, 'phone': c.phone, 'address': c.address} for c in customers]
    return jsonify(result)


@main.route('/api/customers', methods=['POST'])
def add_customer():
    data = request.get_json()
    cust = Customer(
        name=data['name'],
        email=data['email'],
        phone=data.get('phone'),
        address=data.get('address')
    )
    db.session.add(cust)
    db.session.commit()
    return jsonify({"message": "Customer added successfully!", "id": cust.id}), 201


# -------------------------
# BOOKINGS
# -------------------------
@main.route('/api/bookings', methods=['GET'])
def get_bookings():
    bookings = Booking.query.all()
    result = []
    for b in bookings:
        result.append({
            'id': b.id,
            'customer_id': b.customer_id,
            'hall_id': b.hall_id,
            'event_date': b.event_date.isoformat(),
            'status': b.status,
            'total_amount': b.total_amount
        })
    return jsonify(result)


@main.route('/api/bookings', methods=['POST'])
def add_booking():
    data = request.get_json()
    booking = Booking(
        customer_id=data['customer_id'],
        hall_id=data['hall_id'],
        event_date=datetime.strptime(data['event_date'], "%Y-%m-%d").date(),
        status=data.get('status', 'Pending'),
        total_amount=data.get('total_amount')
    )
    db.session.add(booking)
    db.session.commit()
    return jsonify({"message": "Booking created successfully!", "id": booking.id}), 201


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
@main.route('/api/inquiries', methods=['GET'])
def get_inquiries():
    inquiries = Inquiry.query.all()
    result = [{'id': i.id, 'customer_name': i.customer_name, 'email': i.email, 'hall_id': i.hall_id, 'message': i.message} for i in inquiries]
    return jsonify(result)


@main.route('/api/inquiries', methods=['POST'])
def add_inquiry():
    data = request.get_json()
    inquiry = Inquiry(
        customer_id=data.get('customer_id'),
        hall_id=data.get('hall_id'),
        customer_name=data.get('customer_name'),
        email=data.get('email'),
        message=data.get('message')
    )
    db.session.add(inquiry)
    db.session.commit()
    return jsonify({"message": "Inquiry submitted successfully!", "id": inquiry.id}), 201
