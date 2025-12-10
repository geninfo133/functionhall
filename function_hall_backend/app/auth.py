from flask import Blueprint, request, jsonify, session
from werkzeug.security import generate_password_hash, check_password_hash
from app.models import Customer, AdminUser
from app import db

auth = Blueprint('auth', __name__)

@auth.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')

    if not name or not email or not password:
        return jsonify({'error': 'Name, email, and password are required.'}), 400

    if Customer.query.filter_by(email=email).first():
        return jsonify({'error': 'Email already registered.'}), 400

    customer = Customer(name=name, email=email, password=password)
    customer.is_approved = False
    customer.approval_status = 'pending'
    db.session.add(customer)
    db.session.commit()

    return jsonify({
        'message': 'Registration submitted! Waiting for admin approval.',
        'status': 'pending_approval'
    }), 201

@auth.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'error': 'Email and password are required.'}), 400

    customer = Customer.query.filter_by(email=email).first()
    if not customer or customer.password != password:
        return jsonify({'error': 'Invalid credentials.'}), 401

    # Check if customer is approved
    if not customer.is_approved or customer.approval_status != 'approved':
        if customer.approval_status == 'pending':
            return jsonify({'error': 'Your account is pending admin approval.', 'status': 'pending'}), 403
        elif customer.approval_status == 'rejected':
            return jsonify({'error': 'Your account has been rejected by admin.', 'status': 'rejected'}), 403

    session['user_id'] = customer.id
    session.permanent = True
    print(f"✅ Login successful for user_id: {customer.id}, Session: {dict(session)}")
    return jsonify({
        'message': 'Login successful!', 
        'user_id': customer.id,
        'name': customer.name,
        'email': customer.email
    }), 200

@auth.route('/api/logout', methods=['POST'])
def logout():
    user_id = session.get('user_id')
    session.clear()
    print(f"🚪 Logout successful for user_id: {user_id}")
    return jsonify({'message': 'Logout successful!'}), 200

@auth.route('/api/check-auth', methods=['GET'])
def check_auth():
    user_id = session.get('user_id')
    print(f"🔐 Check-auth request - Session: {dict(session)}, user_id: {user_id}")
    if user_id:
        customer = Customer.query.get(user_id)
        if customer:
            print(f"✅ Authenticated: {customer.email}")
            return jsonify({
                'authenticated': True,
                'user_id': customer.id,
                'name': customer.name,
                'email': customer.email,
                'is_approved': customer.is_approved,
                'approval_status': customer.approval_status
            }), 200
    print("❌ Not authenticated - returning false")
    return jsonify({'authenticated': False}), 200

@auth.route('/api/customer/approval-status', methods=['GET'])
def check_approval_status():
    """Check if current logged-in customer is approved"""
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'error': 'Not authenticated'}), 401
    
    customer = Customer.query.get(user_id)
    if not customer:
        return jsonify({'error': 'Customer not found'}), 404
    
    return jsonify({
        'is_approved': customer.is_approved,
        'approval_status': customer.approval_status,
        'message': 'Approved' if customer.is_approved else 'Pending admin approval'
    }), 200

# Note: Admin authentication now handled by auth_jwt.py using JWT tokens
