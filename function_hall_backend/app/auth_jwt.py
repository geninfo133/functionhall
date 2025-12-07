from flask import Blueprint, request, jsonify
from app.models import AdminUser, Customer
from app import db
import jwt
from datetime import datetime, timedelta
import os

auth_jwt = Blueprint('auth_jwt', __name__)

SECRET_KEY = os.environ.get('SECRET_KEY', 'your-secret-key-change-in-production')

# -------------------------
# Admin/Vendor JWT Authentication
# -------------------------

@auth_jwt.route('/api/admin/login', methods=['POST'])
def admin_login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'error': 'Email and password are required.'}), 400

    admin = AdminUser.query.filter_by(email=email).first()
    if not admin or not admin.check_password(password):
        return jsonify({'error': 'Invalid credentials.'}), 401
    
    # Check if vendor is approved
    if admin.role == 'vendor' and not admin.is_approved:
        return jsonify({'error': 'Your vendor account is pending approval. Please wait for admin approval.'}), 403

    # Create JWT token
    token = jwt.encode({
        'admin_id': admin.id,
        'email': admin.email,
        'role': admin.role,
        'is_admin': True,
        'exp': datetime.utcnow() + timedelta(days=1)
    }, SECRET_KEY, algorithm='HS256')
    
    return jsonify({
        'message': 'Login successful!',
        'token': token,
        'admin': {
            'id': admin.id,
            'name': admin.name,
            'email': admin.email,
            'role': admin.role,
            'business_name': admin.business_name,
            'phone': admin.phone,
            'is_approved': admin.is_approved
        }
    }), 200

@auth_jwt.route('/api/vendor/register', methods=['POST'])
def vendor_register():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    phone = data.get('phone')
    business_name = data.get('business_name')

    if not name or not email or not password or not business_name:
        return jsonify({'error': 'Name, email, password, and business name are required.'}), 400

    # Check if email already exists
    existing_user = AdminUser.query.filter_by(email=email).first()
    if existing_user:
        return jsonify({'error': 'Email already registered.'}), 400

    # Create new vendor (not approved by default)
    vendor = AdminUser(
        name=name,
        email=email,
        phone=phone,
        business_name=business_name,
        role='vendor',
        is_approved=False
    )
    vendor.set_password(password)
    db.session.add(vendor)
    db.session.commit()

    return jsonify({
        'message': 'Vendor registration successful! Your account is pending approval.',
        'vendor': {
            'id': vendor.id,
            'name': vendor.name,
            'email': vendor.email,
            'business_name': vendor.business_name,
            'is_approved': False
        }
    }), 201

@auth_jwt.route('/api/admin/logout', methods=['POST'])
def admin_logout():
    return jsonify({'message': 'Admin logout successful!'}), 200

@auth_jwt.route('/api/admin/check-auth', methods=['GET'])
def admin_check_auth():
    auth_header = request.headers.get('Authorization')
    
    if not auth_header or not auth_header.startswith('Bearer '):
        return jsonify({'authenticated': False}), 401
    
    token = auth_header.split(' ')[1]
    
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        admin_id = payload.get('admin_id')
        
        admin = AdminUser.query.get(admin_id)
        if not admin:
            return jsonify({'authenticated': False}), 401
        
        return jsonify({
            'authenticated': True,
            'admin': {
                'id': admin.id,
                'name': admin.name,
                'email': admin.email,
                'role': admin.role,
                'business_name': admin.business_name,
                'phone': admin.phone,
                'is_approved': admin.is_approved
            }
        }), 200
    except jwt.ExpiredSignatureError:
        return jsonify({'authenticated': False, 'error': 'Token expired'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'authenticated': False, 'error': 'Invalid token'}), 401

@auth_jwt.route('/api/admin/vendors', methods=['GET'])
def get_all_vendors():
    """Get all vendors (requires super_admin authentication)"""
    auth_header = request.headers.get('Authorization')
    
    if not auth_header or not auth_header.startswith('Bearer '):
        return jsonify({'error': 'Unauthorized'}), 401
    
    token = auth_header.split(' ')[1]
    
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        admin_id = payload.get('admin_id')
        
        admin = AdminUser.query.get(admin_id)
        if not admin or admin.role != 'super_admin':
            return jsonify({'error': 'Only super admins can access this resource'}), 403
        
        vendors = AdminUser.query.filter_by(role='vendor').all()
        
        return jsonify({
            'vendors': [{
                'id': v.id,
                'name': v.name,
                'email': v.email,
                'phone': v.phone,
                'business_name': v.business_name,
                'is_approved': v.is_approved,
                'created_at': v.id  # Using id as proxy for creation order
            } for v in vendors]
        }), 200
    except jwt.ExpiredSignatureError:
        return jsonify({'error': 'Token expired'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'error': 'Invalid token'}), 401

@auth_jwt.route('/api/admin/vendors/<int:vendor_id>/approve', methods=['PUT'])
def approve_vendor(vendor_id):
    """Approve or reject a vendor (requires super_admin authentication)"""
    auth_header = request.headers.get('Authorization')
    
    if not auth_header or not auth_header.startswith('Bearer '):
        return jsonify({'error': 'Unauthorized'}), 401
    
    token = auth_header.split(' ')[1]
    
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        admin_id = payload.get('admin_id')
        
        admin = AdminUser.query.get(admin_id)
        if not admin or admin.role != 'super_admin':
            return jsonify({'error': 'Only super admins can approve vendors'}), 403
        
        vendor = AdminUser.query.get(vendor_id)
        if not vendor or vendor.role != 'vendor':
            return jsonify({'error': 'Vendor not found'}), 404
        
        data = request.get_json()
        is_approved = data.get('is_approved', True)
        
        vendor.is_approved = is_approved
        db.session.commit()
        
        return jsonify({
            'message': f'Vendor {"approved" if is_approved else "rejected"} successfully',
            'vendor': {
                'id': vendor.id,
                'name': vendor.name,
                'email': vendor.email,
                'business_name': vendor.business_name,
                'is_approved': vendor.is_approved
            }
        }), 200
    except jwt.ExpiredSignatureError:
        return jsonify({'error': 'Token expired'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'error': 'Invalid token'}), 401

# -------------------------
# Customer JWT Authentication
# -------------------------

@auth_jwt.route('/api/customer/register', methods=['POST'])
def customer_register():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    phone = data.get('phone')
    address = data.get('address')

    if not name or not email or not password:
        return jsonify({'error': 'Name, email and password are required.'}), 400

    # Check if customer already exists
    existing_customer = Customer.query.filter_by(email=email).first()
    if existing_customer:
        return jsonify({'error': 'Email already registered.'}), 400

    # Create new customer
    customer = Customer(name=name, email=email, phone=phone, address=address)
    customer.set_password(password)
    db.session.add(customer)
    db.session.commit()

    # Create JWT token
    token = jwt.encode({
        'customer_id': customer.id,
        'email': customer.email,
        'is_admin': False,
        'exp': datetime.utcnow() + timedelta(days=7)
    }, SECRET_KEY, algorithm='HS256')

    return jsonify({
        'message': 'Registration successful!',
        'token': token,
        'customer': {
            'id': customer.id,
            'name': customer.name,
            'email': customer.email,
            'phone': customer.phone
        }
    }), 201

@auth_jwt.route('/api/customer/login', methods=['POST'])
def customer_login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'error': 'Email and password are required.'}), 400

    customer = Customer.query.filter_by(email=email).first()
    if not customer:
        return jsonify({'error': 'Invalid credentials.'}), 401
    
    # Check if customer has a password hash (new accounts)
    if not customer.password_hash:
        return jsonify({'error': 'Account not set up with password. Please register again.'}), 401
    
    if not customer.check_password(password):
        return jsonify({'error': 'Invalid credentials.'}), 401

    # Create JWT token
    token = jwt.encode({
        'customer_id': customer.id,
        'email': customer.email,
        'is_admin': False,
        'exp': datetime.utcnow() + timedelta(days=7)
    }, SECRET_KEY, algorithm='HS256')
    
    return jsonify({
        'message': 'Login successful!',
        'token': token,
        'customer': {
            'id': customer.id,
            'name': customer.name,
            'email': customer.email,
            'phone': customer.phone
        }
    }), 200

@auth_jwt.route('/api/customer/check-auth', methods=['GET'])
def customer_check_auth():
    auth_header = request.headers.get('Authorization')
    
    if not auth_header or not auth_header.startswith('Bearer '):
        return jsonify({'authenticated': False}), 401
    
    token = auth_header.split(' ')[1]
    
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        customer_id = payload.get('customer_id')
        
        customer = Customer.query.get(customer_id)
        if not customer:
            return jsonify({'authenticated': False}), 401
        
        return jsonify({
            'authenticated': True,
            'customer': {
                'id': customer.id,
                'name': customer.name,
                'email': customer.email,
                'phone': customer.phone,
                'address': customer.address
            }
        }), 200
    except jwt.ExpiredSignatureError:
        return jsonify({'authenticated': False, 'error': 'Token expired'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'authenticated': False, 'error': 'Invalid token'}), 401
