from flask import Blueprint, jsonify, request
from app import db
from app.models import FunctionHall, Package, Customer, Booking, Inquiry, Notification
from datetime import datetime, date
from sms_utils import send_sms

main = Blueprint('main', __name__)

# -------------------------
# FUNCTION HALLS
# -------------------------
@main.route('/api/halls', methods=['GET'])
def get_halls():
    # Get search parameters
    name_query = request.args.get('name', '').strip()
    location_query = request.args.get('location', '').strip()
    guests = request.args.get('guests', type=int)
    date_query = request.args.get('date', '').strip()
    
    print(f"🔍 Search params - name: {name_query}, location: {location_query}, guests: {guests}, date: {date_query}")
    
    # Start with base query
    query = FunctionHall.query
    
    # Apply filters
    if name_query:
        query = query.filter(FunctionHall.name.ilike(f'%{name_query}%'))
    if location_query:
        query = query.filter(FunctionHall.location.ilike(f'%{location_query}%'))
    if guests:
        print(f"🔢 Filtering by guests >= {guests}")
        query = query.filter(FunctionHall.capacity >= guests)
    
    halls = query.all()
    
    # Filter by date availability if date is provided
    if date_query:
        try:
            check_date = datetime.strptime(date_query, '%Y-%m-%d').date()
            available_halls = []
            for hall in halls:
                # Check if hall is available on the selected date
                booking = Booking.query.filter_by(hall_id=hall.id, event_date=check_date).filter(
                    Booking.status.in_(['Confirmed', 'Pending'])
                ).first()
                if not booking:
                    available_halls.append(hall)
            halls = available_halls
        except ValueError:
            pass  # Invalid date format, skip date filtering
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
    print(f"📝 Adding new hall: {data}")
    
    hall = FunctionHall(
        name=data.get('name'),
        owner_name=data.get('owner_name'),
        location=data.get('location'),
        capacity=data.get('capacity'),
        price_per_day=data.get('price_per_day'),
        contact_number=data.get('contact_number'),
        description=data.get('description')
    )
    db.session.add(hall)
    db.session.commit()
    
    print(f"✅ Hall added successfully! ID: {hall.id}")
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
    # Check for hall_id query parameter
    hall_id = request.args.get('hall_id', type=int)
    
    if hall_id:
        # Filter by hall_id
        bookings = Booking.query.filter_by(hall_id=hall_id).all()
    else:
        # Get all bookings
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
    
    # Send notification to hall owner
    hall = FunctionHall.query.get(booking.hall_id)
    customer = Customer.query.get(booking.customer_id)
    
    if hall and customer:
        notification = Notification(
            recipient_email=hall.contact_number,  # Using contact for now, should be owner email
            recipient_name=hall.owner_name,
            subject=f"New Booking Request for {hall.name}",
            message=f"New booking request from {customer.name} ({customer.email}) for {booking.event_date.strftime('%B %d, %Y')}. Amount: ₹{booking.total_amount}. Status: {booking.status}.",
            booking_id=booking.id
        )
        db.session.add(notification)
        db.session.commit()
    
    return jsonify({"message": "Booking created successfully!", "id": booking.id}), 201


@main.route('/api/bookings/<int:booking_id>', methods=['PUT'])
def update_booking_status(booking_id):
    booking = Booking.query.get_or_404(booking_id)
    data = request.get_json()
    
    old_status = booking.status
    new_status = data.get('status', booking.status)
    booking.status = new_status
    db.session.commit()
    
    # Send SMS notification to customer when booking is confirmed
    if old_status == 'Pending' and new_status == 'Confirmed':
        print(f"✅ Booking #{booking.id} confirmed! Sending SMS notification...")
        
        # Get customer and hall details
        customer = Customer.query.get(booking.customer_id)
        hall = FunctionHall.query.get(booking.hall_id)
        
        if customer and hall:
            # Format customer phone number
            customer_phone = customer.phone
            if not customer_phone.startswith('+'):
                customer_phone = '+91' + customer_phone[1:] if customer_phone.startswith('0') else '+91' + customer_phone
            
            # Send confirmation SMS to customer
            message = f"""🎉 Booking Confirmed!

Dear {customer.name},

Your booking at {hall.name} has been CONFIRMED!

Event Date: {booking.event_date.strftime('%B %d, %Y')}
Amount: ₹{booking.total_amount}
Location: {hall.location}

Hall Contact: {hall.contact_number}
Owner: {hall.owner_name}

Thank you for choosing us!"""

            sms_result = send_sms(customer_phone, message)
            print(f"📱 SMS Result: {sms_result}")
            
            if sms_result['success']:
                print(f"✉️ Confirmation SMS sent to {customer.name} at {customer_phone}")
            else:
                print(f"❌ SMS failed: {sms_result['message']}")
    
    return jsonify({"message": f"Booking {booking.id} status updated to {booking.status}"})

@main.route('/api/halls/<int:hall_id>/availability', methods=['GET'])
def check_hall_availability(hall_id):
    date_str = request.args.get('date')
    if not date_str:
        return jsonify({"error": "Date parameter required"}), 400
    
    try:
        check_date = datetime.strptime(date_str, "%Y-%m-%d").date()
    except ValueError:
        return jsonify({"error": "Invalid date format"}), 400
    
    # Check if hall exists
    hall = FunctionHall.query.get_or_404(hall_id)
    
    # Check if there's already a confirmed or pending booking for this date
    existing_booking = Booking.query.filter_by(
        hall_id=hall_id,
        event_date=check_date
    ).filter(
        Booking.status.in_(['Confirmed', 'Pending'])
    ).first()
    
    if existing_booking:
        return jsonify({
            "available": False,
            "message": f"Hall is already booked for this date (Booking #{existing_booking.id})"
        })
    
    return jsonify({
        "available": True,
        "message": "Hall is available for this date"
    })

@main.route('/api/customer/<int:customer_id>/bookings', methods=['GET'])
def get_customer_bookings(customer_id):
    bookings = Booking.query.filter_by(customer_id=customer_id).all()
    result = []
    for b in bookings:
        hall = FunctionHall.query.get(b.hall_id)
        result.append({
            'id': b.id,
            'hall_name': hall.name if hall else 'Unknown',
            'hall_location': hall.location if hall else '',
            'event_date': b.event_date.isoformat(),
            'status': b.status,
            'total_amount': b.total_amount,
            'created_at': b.created_at.isoformat() if hasattr(b, 'created_at') and b.created_at else None
        })
    return jsonify(result)


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

@main.route('/api/enquiry', methods=['POST'])
def add_enquiry():
    data = request.get_json()
    hall_id = data.get('hall_id')
    customer_phone = data.get('phone', '')
    
    # Format phone number to international format if needed
    if customer_phone and not customer_phone.startswith('+'):
        if customer_phone.startswith('0'):
            customer_phone = '+91' + customer_phone[1:]  # Remove leading 0 and add +91
        else:
            customer_phone = '+91' + customer_phone  # Add +91
    
    print(f"📝 Enquiry received - Hall ID: {hall_id}, Customer Phone: {customer_phone}")
    
    inquiry = Inquiry(
        customer_name=data.get('name'),
        email=data.get('email'),
        phone=customer_phone,
        message=data.get('message'),
        hall_id=hall_id
    )
    db.session.add(inquiry)
    db.session.commit()
    
    print(f"✅ Enquiry #{inquiry.id} saved to database")
    
    # Send SMS to hall owner and customer if hall_id is provided
    if hall_id:
        print(f"🔍 Looking up hall #{hall_id}")
        hall = FunctionHall.query.get(hall_id)
        if hall:
            print(f"📍 Hall found: {hall.name}")
            print(f"📞 Owner contact: {hall.contact_number}")
            
            from sms_utils import send_sms
            
            # 1. Send SMS to hall owner
            if hall.contact_number:
                owner_message = f"New Enquiry from {inquiry.customer_name}\n"
                owner_message += f"Phone: {inquiry.phone}\n"
                owner_message += f"Email: {inquiry.email}\n"
                owner_message += f"Message: {inquiry.message}\n"
                owner_message += f"Hall: {hall.name}"
                
                print(f"📱 Sending SMS to hall owner: {hall.contact_number}")
                result = send_sms(hall.contact_number, owner_message)
                print(f"✉️ Owner SMS result: {result}")
            else:
                print(f"⚠️ No contact number for hall {hall.name}")
            
            # 2. Send confirmation SMS to customer (from Hall Owner)
            if inquiry.phone:
                customer_message = f"From {hall.name} - {hall.owner_name}\n\n"
                customer_message += f"Dear {inquiry.customer_name},\n"
                customer_message += f"Thank you for your enquiry. We have received your message and will contact you soon with the details.\n\n"
                customer_message += f"We will send you complete information through your email: {inquiry.email}\n\n"
                customer_message += f"Contact us: {hall.contact_number}\n"
                customer_message += f"Best regards,\n{hall.owner_name}"
                
                print(f"📱 Sending confirmation SMS to customer: {inquiry.phone}")
                customer_result = send_sms(inquiry.phone, customer_message)
                print(f"✉️ Customer SMS result: {customer_result}")
        else:
            print(f"❌ Hall #{hall_id} not found")
    else:
        print(f"⚠️ No hall_id provided in enquiry")
    
    return jsonify({"message": "Enquiry submitted successfully!", "id": inquiry.id}), 201

# -------------------------
# OTP VERIFICATION
# -------------------------
@main.route('/api/otp/send', methods=['POST'])
def send_otp_endpoint():
    """Send OTP to phone number"""
    from app.otp_service import send_otp
    
    data = request.get_json()
    phone = data.get('phone')
    country_code = data.get('country_code', '+91')
    
    if not phone:
        return jsonify({"error": "Phone number is required"}), 400
    
    print(f"📱 Sending OTP to {country_code}{phone}")
    result = send_otp(phone, country_code)
    
    if result['success']:
        return jsonify({
            "message": result['message'],
            "phone": result['phone']
        }), 200
    else:
        return jsonify({"error": result['message']}), 400

@main.route('/api/otp/verify', methods=['POST'])
def verify_otp_endpoint():
    """Verify OTP for phone number"""
    from app.otp_service import verify_otp
    
    data = request.get_json()
    phone = data.get('phone')
    otp = data.get('otp')
    country_code = data.get('country_code', '+91')
    
    if not phone or not otp:
        return jsonify({"error": "Phone and OTP are required"}), 400
    
    print(f"🔍 Verifying OTP for {country_code}{phone}")
    result = verify_otp(phone, otp, country_code)
    
    if result['success']:
        return jsonify({
            "message": result['message'],
            "phone": result['phone'],
            "verified": True
        }), 200
    else:
        return jsonify({
            "error": result['message'],
            "verified": False
        }), 400

# -------------------------
# CUSTOMER PROFILE
# -------------------------
@main.route('/api/customer/<int:customer_id>/profile', methods=['PUT'])
def update_customer_profile(customer_id):
    customer = Customer.query.get_or_404(customer_id)
    data = request.get_json()
    
    customer.name = data.get('name', customer.name)
    customer.email = data.get('email', customer.email)
    customer.phone = data.get('phone', customer.phone)
    customer.address = data.get('address', customer.address)
    
    db.session.commit()
    return jsonify({
        "message": "Profile updated successfully!",
        "customer": {
            "id": customer.id,
            "name": customer.name,
            "email": customer.email,
            "phone": customer.phone,
            "address": customer.address
        }
    }), 200

# -------------------------
# ADMIN DASHBOARD STATS
# -------------------------
@main.route('/api/admin/stats', methods=['GET'])
def get_admin_stats():
    total_halls = FunctionHall.query.count()
    total_bookings = Booking.query.count()
    total_customers = Customer.query.count()
    
    # Calculate total revenue from all bookings
    bookings = Booking.query.all()
    total_revenue = sum(booking.total_amount for booking in bookings if booking.total_amount)
    
    return jsonify({
        'total_halls': total_halls,
        'total_bookings': total_bookings,
        'total_customers': total_customers,
        'total_revenue': total_revenue
    })
