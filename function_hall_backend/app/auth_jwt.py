from flask import Blueprint, request, jsonify
from app.models import AdminUser, Customer
from app import db
import jwt
from datetime import datetime, timedelta
import os

auth_jwt = Blueprint('auth_jwt', __name__)

SECRET_KEY = os.environ.get('SECRET_KEY', 'your-secret-key-change-in-production')

# -------------------------
# Admin JWT Authentication
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
        return jsonify({'error': 'Invalid admin credentials.'}), 401

    # Create JWT token
    token = jwt.encode({
        'admin_id': admin.id,
        'email': admin.email,
        'is_admin': True,
        'exp': datetime.utcnow() + timedelta(days=1)
    }, SECRET_KEY, algorithm='HS256')
    
    return jsonify({
        'message': 'Admin login successful!',
        'token': token,
        'admin': {
            'id': admin.id,
            'name': admin.name,
            'email': admin.email,
            'role': admin.role
        }
    }), 200

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
                'role': admin.role
            }
        }), 200
    except jwt.ExpiredSignatureError:
        return jsonify({'authenticated': False, 'error': 'Token expired'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'authenticated': False, 'error': 'Invalid token'}), 401

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
    if not customer or not customer.check_password(password):
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
