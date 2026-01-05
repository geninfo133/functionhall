from flask import Blueprint, jsonify, request, send_from_directory, current_app
from app import db
from app.models import FunctionHall, Package, Customer, Booking, Inquiry, Notification, HallChangeRequest, AdminUser, HallPhoto, FunctionalRoom, GuestRoom
from datetime import datetime, date
from sms_utils import send_sms
from app import otp_service
from cloudinary_config import upload_to_cloudinary
import json
import os

main = Blueprint('main', __name__)

# Route to serve uploaded files
@main.route('/uploads/hall_photos/<filename>')
def serve_hall_photo(filename):
    upload_folder = current_app.config['UPLOAD_FOLDER']
    return send_from_directory(upload_folder, filename)

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
        photos = [photo.url for photo in hall.photos]
        packages = [{'id': p.id, 'package_name': p.package_name, 'price': p.price, 'details': p.details} for p in hall.packages]
        result.append({
            'id': hall.id,
            'name': hall.name,
            'owner_name': hall.owner_name,
            'location': hall.location,
            'capacity': hall.capacity,
            'price_per_day': hall.price_per_day,
            'contact_number': hall.contact_number,
            'description': hall.description,
            'photos': photos,
            'packages': packages,
            'has_basic_rooms': getattr(hall, 'has_basic_rooms', True),
            'has_stage': getattr(hall, 'has_stage', True),
            'basic_rooms_count': getattr(hall, 'basic_rooms_count', 2),
            'has_dining_hall': getattr(hall, 'has_dining_hall', True),
            'has_kitchen': getattr(hall, 'has_kitchen', True)
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
        'photos': photos,
        'has_basic_rooms': getattr(hall, 'has_basic_rooms', True),
        'has_stage': getattr(hall, 'has_stage', True),
        'basic_rooms_count': getattr(hall, 'basic_rooms_count', 2),
        'has_dining_hall': getattr(hall, 'has_dining_hall', True),
        'has_kitchen': getattr(hall, 'has_kitchen', True)
    })

@main.route('/api/vendor/<int:vendor_id>/halls', methods=['GET'])
def get_vendor_halls(vendor_id):
    """Get all halls belonging to a specific vendor"""
    halls = FunctionHall.query.filter_by(vendor_id=vendor_id).all()
    result = []
    for hall in halls:
        photos = [photo.url for photo in hall.photos]
        result.append({
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
    return jsonify(result)

@main.route('/api/halls', methods=['POST'])
def add_hall():
    from werkzeug.utils import secure_filename
    import uuid
    from flask import current_app
    
    # Check if request has files or JSON
    if request.content_type and 'multipart/form-data' in request.content_type:
        # Handle file upload
        data = request.form.to_dict()
        files = request.files.getlist('photos')
        print(f"📝 Adding new hall with {len(files)} photo files: {data}")
        
        # Upload files to Cloudinary and get their URLs
        photo_paths = []
        for file in files:
            if file and file.filename:
                print(f"☁️ Uploading {file.filename} to Cloudinary...")
                result = upload_to_cloudinary(file)
                if result['success']:
                    photo_paths.append(result['url'])
                    print(f"✅ Uploaded: {result['url']}")
                else:
                    print(f"❌ Upload failed: {result.get('error')}")
    else:
        # Handle JSON request (for backward compatibility)
        data = request.get_json()
        photo_paths = data.get('photos', [])
        print(f"📝 Adding new hall: {data}")
    
    # Get vendor_id from request (if provided)
    vendor_id = data.get('vendor_id')
    if vendor_id:
        vendor_id = int(vendor_id)
    is_admin = data.get('is_admin', False)  # Check if request is from super admin
    
    # If request is from vendor, create a change request instead
    if vendor_id and not is_admin:
        vendor = AdminUser.query.get(vendor_id)
        if vendor and vendor.role == 'vendor':
            # Parse packages if provided
            print(f"━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
            print(f"📦 PACKAGE DEBUG - BACKEND RECEIVING HALL")
            print(f"📦 All form data keys: {list(data.keys())}")
            print(f"📦 Looking for 'packages' key...")
            
            packages_data = None
            if 'packages' in data:
                print(f"✅ 'packages' key FOUND in data!")
                raw_packages = data['packages']
                print(f"📦 Raw packages value: {raw_packages}")
                print(f"📦 Raw packages type: {type(raw_packages)}")
                
                try:
                    packages_data = json.loads(raw_packages) if isinstance(raw_packages, str) else raw_packages
                    print(f"✅ Parsed packages data: {packages_data}")
                    print(f"✅ Number of packages: {len(packages_data) if packages_data else 0}")
                except Exception as e:
                    print(f"❌ ERROR parsing packages: {e}")
                    print(f"❌ Exception type: {type(e).__name__}")
                    packages_data = None
            else:
                print(f"❌ 'packages' key NOT FOUND in data!")
                print(f"❌ Available keys: {data.keys()}")
            
            print(f"📦 Final packages_data to store: {packages_data}")
            print(f"━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
            
            # Parse functional rooms if provided
            functional_rooms_data = None
            if 'functional_rooms' in data:
                try:
                    functional_rooms_data = json.loads(data['functional_rooms']) if isinstance(data['functional_rooms'], str) else data['functional_rooms']
                    print(f"✅ Parsed {len(functional_rooms_data)} functional rooms")
                except Exception as e:
                    print(f"❌ Error parsing functional rooms: {e}")
                    functional_rooms_data = None
            
            # Parse guest rooms if provided
            guest_rooms_data = None
            if 'guest_rooms' in data:
                try:
                    guest_rooms_data = json.loads(data['guest_rooms']) if isinstance(data['guest_rooms'], str) else data['guest_rooms']
                    print(f"✅ Parsed {len(guest_rooms_data)} guest room types")
                except Exception as e:
                    print(f"❌ Error parsing guest rooms: {e}")
                    guest_rooms_data = None
            
            # Create a change request for approval
            change_request = HallChangeRequest(
                vendor_id=vendor_id,
                action_type='add',
                new_data=json.dumps({
                    'name': data.get('name'),
                    'owner_name': data.get('owner_name'),
                    'location': data.get('location'),
                    'capacity': int(data.get('capacity')) if data.get('capacity') else 0,
                    'price_per_day': int(data.get('price_per_day')) if data.get('price_per_day') else 0,
                    'contact_number': data.get('contact_number'),
                    'description': data.get('description'),
                    'vendor_id': vendor_id,
                    'photos': photo_paths,
                    'packages': packages_data,
                    'functional_rooms': functional_rooms_data,
                    'guest_rooms': guest_rooms_data,
                    'has_basic_rooms': data.get('has_basic_rooms', 'true').lower() == 'true',
                    'has_stage': data.get('has_stage', 'true').lower() == 'true',
                    'basic_rooms_count': int(data.get('basic_rooms_count', 2))
                }),
                status='pending'
            )
            db.session.add(change_request)
            db.session.commit()
            print(f"Change request created! ID: {change_request.id}")
            return jsonify({
                "message": "Hall submission received! Pending admin approval.",
                "request_id": change_request.id,
                "status": "pending"
            }), 201
    
    # Super admin adding hall directly - no approval needed
    hall = FunctionHall(
        name=data.get('name'),
        owner_name=data.get('owner_name'),
        location=data.get('location'),
        capacity=data.get('capacity'),
        price_per_day=data.get('price_per_day'),
        contact_number=data.get('contact_number'),
        description=data.get('description'),
        vendor_id=vendor_id,
        is_approved=True,
        approval_status='approved',
        has_basic_rooms=data.get('has_basic_rooms', True) if isinstance(data.get('has_basic_rooms'), bool) else str(data.get('has_basic_rooms', 'true')).lower() == 'true',
        has_stage=data.get('has_stage', True) if isinstance(data.get('has_stage'), bool) else str(data.get('has_stage', 'true')).lower() == 'true',
        basic_rooms_count=int(data.get('basic_rooms_count', 2)),
        has_dining_hall=data.get('has_dining_hall', True) if isinstance(data.get('has_dining_hall'), bool) else str(data.get('has_dining_hall', 'true')).lower() == 'true',
        has_kitchen=data.get('has_kitchen', True) if isinstance(data.get('has_kitchen'), bool) else str(data.get('has_kitchen', 'true')).lower() == 'true'
    )
    db.session.add(hall)
    db.session.flush()  # Get hall.id before creating packages
    
    # Handle packages - support both old (package_ids) and new (packages array) format
    packages_data = data.get('packages', [])
    package_ids = data.get('package_ids', [])
    
    if packages_data:
        # New format: array of package objects
        for pkg_data in packages_data:
            package = Package(
                hall_id=hall.id,
                package_name=pkg_data.get('package_name'),
                price=pkg_data.get('price'),
                details=pkg_data.get('details')
            )
            db.session.add(package)
        print(f"✅ Created {len(packages_data)} packages for hall {hall.id}")
    elif package_ids:
        # Old format: array of package IDs (backward compatibility)
        for pkg_id in package_ids:
            package = Package.query.get(pkg_id)
            if package:
                # If package belongs to different hall, create a copy
                if package.hall_id != hall.id:
                    new_package = Package(
                        hall_id=hall.id,
                        package_name=package.package_name,
                        price=package.price,
                        details=package.details
                    )
                    db.session.add(new_package)
    
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
    print(f"📦 GET /api/halls/{hall_id}/packages - Found {len(packages)} packages")
    result = [{'id': p.id, 'package_name': p.package_name, 'price': p.price, 'details': p.details} for p in packages]
    print(f"📦 Returning packages: {result}")
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
# ROOMS
# -------------------------
@main.route('/api/halls/<int:hall_id>/rooms', methods=['GET'])
def get_rooms_by_hall(hall_id):
    # Get functional rooms
    functional_rooms = FunctionalRoom.query.filter_by(hall_id=hall_id).all()
    functional_rooms_data = [{
        'id': r.id,
        'room_type': r.room_type,
        'room_name': r.room_name,
        'price': r.price,
        'capacity': r.capacity,
        'amenities': r.amenities,
        'description': r.description
    } for r in functional_rooms]
    
    # Get guest rooms
    guest_rooms = GuestRoom.query.filter_by(hall_id=hall_id).all()
    guest_rooms_data = [{
        'id': r.id,
        'room_category': r.room_category,
        'total_rooms': r.total_rooms,
        'price_per_room': r.price_per_room,
        'bed_type': r.bed_type,
        'max_occupancy': r.max_occupancy,
        'amenities': r.amenities,
        'description': r.description
    } for r in guest_rooms]
    
    return jsonify({
        'functional_rooms': functional_rooms_data,
        'guest_rooms': guest_rooms_data
    })


# -------------------------
# CUSTOMERS
# -------------------------
@main.route('/api/customers', methods=['GET'])
def get_customers():
    customers = Customer.query.all()
    result = [{
        'id': c.id, 
        'name': c.name, 
        'email': c.email, 
        'phone': c.phone, 
        'address': c.address,
        'is_approved': c.is_approved,
        'approval_status': c.approval_status
    } for c in customers]
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


@main.route('/api/customers/<int:customer_id>', methods=['DELETE'])
def delete_customer(customer_id):
    try:
        customer = Customer.query.get(customer_id)
        if not customer:
            return jsonify({"error": "Customer not found"}), 404
        
        # Delete all related bookings
        Booking.query.filter_by(customer_id=customer_id).delete()
        
        # Delete all related inquiries
        Inquiry.query.filter_by(customer_id=customer_id).delete()
        
        # Delete the customer
        db.session.delete(customer)
        db.session.commit()
        
        return jsonify({"message": "Customer deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


# -------------------------
# BOOKINGS
# -------------------------
@main.route('/api/bookings', methods=['GET'])
def get_bookings():
    bookings = Booking.query.all()
    result = []
    for b in bookings:
        # Get customer details
        customer = Customer.query.get(b.customer_id)
        # Get hall details
        hall = FunctionHall.query.get(b.hall_id)
        
        result.append({
            'id': b.id,
            'customer_id': b.customer_id,
            'customer_name': customer.name if customer else 'Unknown Customer',
            'customer_email': customer.email if customer else 'N/A',
            'customer_phone': customer.phone if customer else 'N/A',
            'hall_id': b.hall_id,
            'hall_name': hall.name if hall else 'Unknown Hall',
            'event_date': b.event_date.isoformat(),
            'event_type': b.event_type if hasattr(b, 'event_type') else 'N/A',
            'number_of_guests': b.number_of_guests if hasattr(b, 'number_of_guests') else 0,
            'package_id': b.package_id if hasattr(b, 'package_id') else None,
            'package_name': b.package_name if hasattr(b, 'package_name') else None,
            'total_price': b.total_amount,
            'status': b.status,
            'total_amount': b.total_amount,
            'created_at': b.created_at.isoformat() if hasattr(b, 'created_at') else None,
            'special_requests': b.special_requests if hasattr(b, 'special_requests') else None
        })
    return jsonify(result)


@main.route('/api/bookings', methods=['POST'])
def add_booking():
    data = request.get_json()
    customer_id = data['customer_id']
    
    # Check if customer is approved
    customer = Customer.query.get(customer_id)
    if not customer:
        return jsonify({"error": "Customer not found"}), 404
    
    if not customer.is_approved or customer.approval_status != 'approved':
        return jsonify({
            "error": "Your account is not approved yet. Please wait for admin approval.",
            "status": "not_approved"
        }), 403
    
    booking = Booking(
        customer_id=customer_id,
        hall_id=data['hall_id'],
        event_date=datetime.strptime(data['event_date'], "%Y-%m-%d").date(),
        function_type=data.get('function_type'),
        status=data.get('status', 'Pending'),
        total_amount=data.get('total_amount')
    )
    db.session.add(booking)
    db.session.commit()
    
    # Get customer and hall details
    hall = FunctionHall.query.get(booking.hall_id)
    customer = Customer.query.get(booking.customer_id)
    
    if hall and customer:
        # Send notification to hall owner
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
        print(f"✅ Booking #{booking.id} confirmed! Sending advance payment SMS...")
        
        # Get customer and hall details
        customer = Customer.query.get(booking.customer_id)
        hall = FunctionHall.query.get(booking.hall_id)
        
        if customer and hall:
            # Calculate advance amount (25% of total)
            advance_amount = booking.total_amount // 4
            
            # Format customer phone number
            customer_phone = customer.phone
            country_code = getattr(customer, 'country_code', '+91')
            if not customer_phone.startswith('+'):
                customer_phone = country_code + customer_phone
            
            # Send advance payment details SMS to customer (keep under 160 chars for single SMS)
            message = f"""Booking CONFIRMED! {hall.name} on {booking.event_date.strftime('%d %b')}. Advance: Rs.{advance_amount}/- (25%). Pay: gens@upi or 9866168995 within 24hrs. ID#{booking.id}"""

            sms_result = send_sms(customer_phone, message)
            print(f"📱 SMS Result: {sms_result}")
            
            if sms_result.get('success'):
                print(f"✉️ Advance payment SMS sent to {customer.name} at {customer_phone}")
            else:
                print(f"❌ SMS failed: {sms_result.get('error')}")
    
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
    inquiries = Inquiry.query.order_by(Inquiry.created_at.desc()).all()
    result = []
    for i in inquiries:
        hall = FunctionHall.query.get(i.hall_id) if i.hall_id else None
        result.append({
            'id': i.id,
            'customer_name': i.customer_name,
            'customer_phone': i.phone,
            'email': i.email,
            'hall_id': i.hall_id,
            'hall_name': hall.name if hall else None,
            'location': hall.location if hall else None,
            'message': i.message,
            'status': i.status or 'Pending',
            'created_at': i.created_at.isoformat() if i.created_at else None
        })
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


@main.route('/api/inquiries/<int:id>/status', methods=['PUT'])
def update_inquiry_status(id):
    data = request.get_json()
    new_status = data.get('status')
    
    if not new_status:
        return jsonify({"error": "Status is required"}), 400
    
    inquiry = Inquiry.query.get(id)
    if not inquiry:
        return jsonify({"error": "Inquiry not found"}), 404
    
    inquiry.status = new_status
    db.session.commit()
    
    return jsonify({"message": "Status updated successfully", "id": inquiry.id, "status": inquiry.status}), 200


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


# -------------------------
# OTP VERIFICATION
# -------------------------
@main.route('/api/otp/send', methods=['POST'])
def send_otp():
    """Send OTP to phone number"""
    data = request.get_json()
    phone_number = data.get('phone_number')
    country_code = data.get('country_code', '+91')
    
    if not phone_number:
        return jsonify({"error": "Phone number is required"}), 400
    
    result = otp_service.send_otp(phone_number, country_code)
    
    if result['success']:
        return jsonify({"message": result['message']}), 200
    else:
        return jsonify({"error": result['message']}), 500


@main.route('/api/otp/verify', methods=['POST'])
def verify_otp():
    """Verify OTP for phone number"""
    data = request.get_json()
    phone_number = data.get('phone_number')
    otp = data.get('otp')
    country_code = data.get('country_code', '+91')
    
    if not phone_number or not otp:
        return jsonify({"error": "Phone number and OTP are required"}), 400
    
    result = otp_service.verify_otp(phone_number, otp, country_code)
    
    if result['success']:
        return jsonify({"message": result['message']}), 200
    else:
        return jsonify({"error": result['message']}), 400


# -------------------------
# VENDOR HALL MANAGEMENT WITH APPROVAL
# -------------------------

@main.route('/api/vendor/halls/<int:hall_id>/edit', methods=['POST'])
def vendor_edit_hall(hall_id):
    """Vendor requests to edit a hall - requires admin approval"""
    from werkzeug.utils import secure_filename
    import uuid
    from flask import current_app
    
    # Check if request has files or JSON
    if request.content_type and 'multipart/form-data' in request.content_type:
        # Handle file upload
        data = request.form.to_dict()
        files = request.files.getlist('photos')
        print(f"📝 Editing hall {hall_id} with {len(files)} photo files: {data}")
        
        # Save uploaded files and get their paths
        photo_paths = []
        for file in files:
            if file and file.filename:
                print(f"☁️ Uploading {file.filename} to Cloudinary...")
                result = upload_to_cloudinary(file)
                if result['success']:
                    photo_paths.append(result['url'])
                    print(f"✅ Uploaded: {result['url']}")
                else:
                    print(f"❌ Upload failed: {result.get('error')}")
    else:
        # Handle JSON request (for backward compatibility)
        data = request.get_json()
        photo_paths = []
        print(f"📝 Editing hall {hall_id}: {data}")
    
    vendor_id = data.get('vendor_id')
    
    if not vendor_id:
        return jsonify({"error": "Vendor ID is required"}), 400
    
    vendor_id = int(vendor_id)
    hall = FunctionHall.query.get_or_404(hall_id)
    
    # Verify vendor owns this hall
    if hall.vendor_id != vendor_id:
        return jsonify({"error": "Unauthorized - You don't own this hall"}), 403
    
    # Store old data
    old_data = {
        'name': hall.name,
        'owner_name': hall.owner_name,
        'location': hall.location,
        'capacity': hall.capacity,
        'price_per_day': hall.price_per_day,
        'contact_number': hall.contact_number,
        'description': hall.description
    }
    
    # Store new data with photos
    new_data = {
        'name': data.get('name', hall.name),
        'owner_name': data.get('owner_name', hall.owner_name),
        'location': data.get('location', hall.location),
        'capacity': int(data.get('capacity', hall.capacity)) if data.get('capacity') else hall.capacity,
        'price_per_day': int(data.get('price_per_day', hall.price_per_day)) if data.get('price_per_day') else hall.price_per_day,
        'contact_number': data.get('contact_number', hall.contact_number),
        'description': data.get('description', hall.description),
        'photos': photo_paths if photo_paths else None
    }
    
    # Create change request
    change_request = HallChangeRequest(
        hall_id=hall_id,
        vendor_id=vendor_id,
        action_type='edit',
        old_data=json.dumps(old_data),
        new_data=json.dumps(new_data),
        status='pending'
    )
    db.session.add(change_request)
    db.session.commit()
    
    print(f"✅ Edit request created! ID: {change_request.id}")
    return jsonify({
        "message": "Edit request submitted! Pending admin approval.",
        "request_id": change_request.id
    }), 201


@main.route('/api/vendor/halls/<int:hall_id>/delete', methods=['POST'])
def vendor_delete_hall(hall_id):
    """Vendor requests to delete a hall - requires admin approval"""
    data = request.get_json()
    vendor_id = data.get('vendor_id')
    
    if not vendor_id:
        return jsonify({"error": "Vendor ID is required"}), 400
    
    hall = FunctionHall.query.get_or_404(hall_id)
    
    # Verify vendor owns this hall
    if hall.vendor_id != vendor_id:
        return jsonify({"error": "Unauthorized - You don't own this hall"}), 403
    
    # Store hall data before deletion
    old_data = {
        'name': hall.name,
        'owner_name': hall.owner_name,
        'location': hall.location,
        'capacity': hall.capacity,
        'price_per_day': hall.price_per_day,
        'contact_number': hall.contact_number,
        'description': hall.description
    }
    
    # Create change request
    change_request = HallChangeRequest(
        hall_id=hall_id,
        vendor_id=vendor_id,
        action_type='delete',
        old_data=json.dumps(old_data),
        status='pending'
    )
    db.session.add(change_request)
    db.session.commit()
    
    return jsonify({
        "message": "Delete request submitted! Pending admin approval.",
        "request_id": change_request.id
    }), 201


# -------------------------
# ADMIN APPROVAL MANAGEMENT
# -------------------------

@main.route('/api/admin/hall-requests', methods=['GET'])
def get_hall_requests():
    """Get all pending hall change requests"""
    status = request.args.get('status', 'pending')
    
    requests = HallChangeRequest.query.filter_by(status=status).order_by(HallChangeRequest.requested_at.desc()).all()
    
    result = []
    for req in requests:
        vendor = AdminUser.query.get(req.vendor_id)
        hall_name = None
        if req.hall_id:
            hall = FunctionHall.query.get(req.hall_id)
            hall_name = hall.name if hall else None
        
        result.append({
            'id': req.id,
            'hall_id': req.hall_id,
            'hall_name': hall_name,
            'vendor_id': req.vendor_id,
            'vendor_name': vendor.name if vendor else None,
            'vendor_business': vendor.business_name if vendor else None,
            'action_type': req.action_type,
            'status': req.status,
            'old_data': json.loads(req.old_data) if req.old_data else None,
            'new_data': json.loads(req.new_data) if req.new_data else None,
            'requested_at': req.requested_at.isoformat(),
            'reviewed_at': req.reviewed_at.isoformat() if req.reviewed_at else None,
            'rejection_reason': req.rejection_reason
        })
    
    return jsonify(result)


@main.route('/api/admin/hall-requests/<int:request_id>/approve', methods=['POST'])
def approve_hall_request(request_id):
    """Admin approves a hall change request"""
    # Get JWT token from Authorization header
    auth_header = request.headers.get('Authorization')
    
    if not auth_header or not auth_header.startswith('Bearer '):
        return jsonify({"error": "Authorization token required"}), 401
    
    token = auth_header.split(' ')[1]
    
    try:
        # Decode JWT token
        import jwt
        import os
        SECRET_KEY = os.environ.get('SECRET_KEY', 'your-secret-key-change-in-production')
        decoded = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        admin_id = decoded.get('admin_id')
        
        # Verify admin is super_admin
        admin = AdminUser.query.get(admin_id)
        if not admin or admin.role != 'super_admin':
            return jsonify({"error": "Unauthorized - Super admin access required"}), 403
    except jwt.ExpiredSignatureError:
        return jsonify({"error": "Token expired"}), 401
    except jwt.InvalidTokenError:
        return jsonify({"error": "Invalid token"}), 401
    
    change_request = HallChangeRequest.query.get_or_404(request_id)
    
    if change_request.status != 'pending':
        return jsonify({"error": "Request already processed"}), 400
    
    # Process based on action type
    if change_request.action_type == 'add':
        # Create new hall
        new_data = json.loads(change_request.new_data)
        hall = FunctionHall(
            name=new_data.get('name'),
            owner_name=new_data.get('owner_name'),
            location=new_data.get('location'),
            capacity=new_data.get('capacity'),
            price_per_day=new_data.get('price_per_day'),
            contact_number=new_data.get('contact_number'),
            description=new_data.get('description'),
            vendor_id=change_request.vendor_id,
            is_approved=True,
            approval_status='approved',
            has_basic_rooms=new_data.get('has_basic_rooms', True),
            has_stage=new_data.get('has_stage', True),
            basic_rooms_count=new_data.get('basic_rooms_count', 2),
            has_dining_hall=new_data.get('has_dining_hall', True),
            has_kitchen=new_data.get('has_kitchen', True)
        )
        db.session.add(hall)
        db.session.flush()  # Get hall.id before creating photos
        
        # Create photos if provided
        photos = new_data.get('photos', [])
        for photo_path in photos:
            if photo_path and photo_path.strip():
                # Cloudinary URLs are already complete, no need to modify
                hall_photo = HallPhoto(
                    hall_id=hall.id,
                    url=photo_path
                )
                db.session.add(hall_photo)
        
        # Create packages if provided
        packages = new_data.get('packages', [])
        if packages:
            for pkg_data in packages:
                package = Package(
                    hall_id=hall.id,
                    package_name=pkg_data.get('package_name'),
                    price=pkg_data.get('price'),
                    details=pkg_data.get('details')
                )
                db.session.add(package)
            print(f"Created {len(packages)} packages for hall {hall.id}")
        
        # Create functional rooms if provided
        functional_rooms = new_data.get('functional_rooms', [])
        if functional_rooms:
            for room_data in functional_rooms:
                functional_room = FunctionalRoom(
                    hall_id=hall.id,
                    room_type=room_data.get('room_type'),
                    room_name=room_data.get('room_name'),
                    price=room_data.get('price'),
                    capacity=room_data.get('capacity', 0),
                    amenities=room_data.get('amenities'),
                    description=room_data.get('description')
                )
                db.session.add(functional_room)
            print(f"Created {len(functional_rooms)} functional rooms for hall {hall.id}")
        
        # Create guest rooms if provided
        guest_rooms = new_data.get('guest_rooms', [])
        if guest_rooms:
            for room_data in guest_rooms:
                guest_room = GuestRoom(
                    hall_id=hall.id,
                    room_category=room_data.get('room_category'),
                    total_rooms=room_data.get('total_rooms'),
                    price_per_room=room_data.get('price_per_room'),
                    bed_type=room_data.get('bed_type'),
                    max_occupancy=room_data.get('max_occupancy'),
                    amenities=room_data.get('amenities'),
                    description=room_data.get('description')
                )
                db.session.add(guest_room)
            print(f"Created {len(guest_rooms)} guest room types for hall {hall.id}")
        
        change_request.hall_id = hall.id
        
    elif change_request.action_type == 'edit':
        # Update existing hall
        hall = FunctionHall.query.get(change_request.hall_id)
        if hall:
            new_data = json.loads(change_request.new_data)
            hall.name = new_data.get('name')
            hall.owner_name = new_data.get('owner_name')
            hall.location = new_data.get('location')
            hall.capacity = new_data.get('capacity')
            hall.price_per_day = new_data.get('price_per_day')
            hall.contact_number = new_data.get('contact_number')
            hall.description = new_data.get('description')
            hall.has_basic_rooms = new_data.get('has_basic_rooms', True)
            hall.has_stage = new_data.get('has_stage', True)
            hall.basic_rooms_count = new_data.get('basic_rooms_count', 2)
            hall.has_dining_hall = new_data.get('has_dining_hall', True)
            hall.has_kitchen = new_data.get('has_kitchen', True)
            
            # Add new photos if provided
            photos = new_data.get('photos', [])
            if photos:
                for photo_url in photos:
                    if photo_url and photo_url.strip():
                        # Cloudinary URLs are already complete
                        hall_photo = HallPhoto(
                            hall_id=hall.id,
                            url=photo_url
                        )
                        db.session.add(hall_photo)
    
    elif change_request.action_type == 'delete':
        # Delete hall
        hall = FunctionHall.query.get(change_request.hall_id)
        if hall:
            db.session.delete(hall)
    
    # Update request status
    change_request.status = 'approved'
    change_request.reviewed_at = datetime.utcnow()
    change_request.reviewed_by = admin_id
    
    try:
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        print(f"Database commit error: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": f"Failed to approve request: {str(e)}"}), 500
    
    return jsonify({"message": f"Hall {change_request.action_type} request approved successfully!"}), 200


@main.route('/api/admin/hall-requests/<int:request_id>/reject', methods=['POST'])
def reject_hall_request(request_id):
    """Admin rejects a hall change request"""
    # Get JWT token from Authorization header
    auth_header = request.headers.get('Authorization')
    
    if not auth_header or not auth_header.startswith('Bearer '):
        return jsonify({"error": "Authorization token required"}), 401
    
    token = auth_header.split(' ')[1]
    
    try:
        # Decode JWT token
        import jwt
        import os
        SECRET_KEY = os.environ.get('SECRET_KEY', 'your-secret-key-change-in-production')
        decoded = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        admin_id = decoded.get('admin_id')
        
        # Verify admin is super_admin
        admin = AdminUser.query.get(admin_id)
        if not admin or admin.role != 'super_admin':
            return jsonify({"error": "Unauthorized - Super admin access required"}), 403
    except jwt.ExpiredSignatureError:
        return jsonify({"error": "Token expired"}), 401
    except jwt.InvalidTokenError:
        return jsonify({"error": "Invalid token"}), 401
    
    data = request.get_json() or {}
    reason = data.get('reason', 'No reason provided')
    
    change_request = HallChangeRequest.query.get_or_404(request_id)
    
    if change_request.status != 'pending':
        return jsonify({"error": "Request already processed"}), 400
    
    # Update request status
    change_request.status = 'rejected'
    change_request.reviewed_at = datetime.utcnow()
    change_request.reviewed_by = admin_id
    change_request.rejection_reason = reason
    
    db.session.commit()
    
    return jsonify({"message": "Hall request rejected"}), 200


@main.route('/api/vendor/<int:vendor_id>/requests', methods=['GET'])
def get_vendor_requests(vendor_id):
    """Get all change requests submitted by a vendor"""
    requests = HallChangeRequest.query.filter_by(vendor_id=vendor_id).order_by(HallChangeRequest.requested_at.desc()).all()
    
    result = []
    for req in requests:
        hall_name = None
        if req.hall_id:
            hall = FunctionHall.query.get(req.hall_id)
            hall_name = hall.name if hall else None
        
        result.append({
            'id': req.id,
            'hall_id': req.hall_id,
            'hall_name': hall_name,
            'action_type': req.action_type,
            'status': req.status,
            'new_data': json.loads(req.new_data) if req.new_data else None,
            'requested_at': req.requested_at.isoformat(),
            'reviewed_at': req.reviewed_at.isoformat() if req.reviewed_at else None,
            'rejection_reason': req.rejection_reason
        })
    
    return jsonify(result)


# -------------------------
# CUSTOMER APPROVAL MANAGEMENT
# -------------------------

@main.route('/api/admin/customers/pending', methods=['GET'])
def get_pending_customers():
    """Get all customers pending approval"""
    status = request.args.get('status', 'pending')
    customers = Customer.query.filter_by(approval_status=status).order_by(Customer.created_at.desc()).all()
    
    result = []
    for customer in customers:
        result.append({
            'id': customer.id,
            'name': customer.name,
            'email': customer.email,
            'phone': customer.phone,
            'address': customer.address,
            'approval_status': customer.approval_status,
            'created_at': customer.created_at.isoformat() if customer.created_at else None
        })
    
    return jsonify(result)


@main.route('/api/admin/customers/<int:customer_id>/approve', methods=['POST'])
def approve_customer(customer_id):
    """Admin approves a customer"""
    # Get JWT token from Authorization header
    auth_header = request.headers.get('Authorization')
    
    if not auth_header or not auth_header.startswith('Bearer '):
        return jsonify({"error": "Authorization token required"}), 401
    
    token = auth_header.split(' ')[1]
    
    try:
        # Decode JWT token
        import jwt
        import os
        SECRET_KEY = os.environ.get('SECRET_KEY', 'your-secret-key-change-in-production')
        decoded = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        admin_id = decoded.get('admin_id')
        
        # Verify admin is super_admin
        admin = AdminUser.query.get(admin_id)
        if not admin or admin.role != 'super_admin':
            return jsonify({"error": "Unauthorized - Super admin access required"}), 403
    except jwt.ExpiredSignatureError:
        return jsonify({"error": "Token expired"}), 401
    except jwt.InvalidTokenError:
        return jsonify({"error": "Invalid token"}), 401
    
    customer = Customer.query.get_or_404(customer_id)
    
    if customer.approval_status != 'pending':
        return jsonify({"error": "Customer already processed"}), 400
    
    customer.is_approved = True
    customer.approval_status = 'approved'
    
    db.session.commit()
    
    return jsonify({"message": "Customer approved successfully!"}), 200


@main.route('/api/admin/customers/<int:customer_id>/reject', methods=['POST'])
def reject_customer(customer_id):
    """Admin rejects a customer"""
    # Get JWT token from Authorization header
    auth_header = request.headers.get('Authorization')
    
    if not auth_header or not auth_header.startswith('Bearer '):
        return jsonify({"error": "Authorization token required"}), 401
    
    token = auth_header.split(' ')[1]
    
    try:
        # Decode JWT token
        import jwt
        import os
        SECRET_KEY = os.environ.get('SECRET_KEY', 'your-secret-key-change-in-production')
        decoded = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        admin_id = decoded.get('admin_id')
        
        # Verify admin is super_admin
        admin = AdminUser.query.get(admin_id)
        if not admin or admin.role != 'super_admin':
            return jsonify({"error": "Unauthorized - Super admin access required"}), 403
    except jwt.ExpiredSignatureError:
        return jsonify({"error": "Token expired"}), 401
    except jwt.InvalidTokenError:
        return jsonify({"error": "Invalid token"}), 401
    
    data = request.get_json() or {}
    reason = data.get('reason', 'No reason provided')
    
    customer = Customer.query.get_or_404(customer_id)
    
    if customer.approval_status != 'pending':
        return jsonify({"error": "Customer already processed"}), 400
    
    customer.approval_status = 'rejected'
    
    db.session.commit()
    
    return jsonify({"message": "Customer rejected", "reason": reason}), 200
