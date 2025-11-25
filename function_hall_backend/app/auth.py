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
    db.session.add(customer)
    db.session.commit()

    return jsonify({'message': 'Registration successful!'}), 201

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

    session['user_id'] = customer.id
    session.permanent = True  # Make session permanent
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
    session.clear()  # Clear entire session
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
                'email': customer.email
            }), 200
    print("❌ Not authenticated - returning false")
    return jsonify({'authenticated': False}), 200

# -------------------------
# Admin Authentication
# -------------------------

@auth.route('/api/admin/login', methods=['POST'])
def admin_login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'error': 'Email and password are required.'}), 400

    admin = AdminUser.query.filter_by(email=email).first()
    if not admin or not admin.check_password(password):
        return jsonify({'error': 'Invalid admin credentials.'}), 401

    session['admin_id'] = admin.id
    session['is_admin'] = True
    session.permanent = True
    print(f"✅ Admin login successful for admin_id: {admin.id}, Session: {dict(session)}")
    return jsonify({
        'message': 'Admin login successful!', 
        'admin_id': admin.id,
        'name': admin.name,
        'email': admin.email,
        'role': admin.role
    }), 200

@auth.route('/api/admin/logout', methods=['POST'])
def admin_logout():
    admin_id = session.get('admin_id')
    session.clear()
    print(f"🚪 Admin logout successful for admin_id: {admin_id}")
    return jsonify({'message': 'Admin logout successful!'}), 200

@auth.route('/api/admin/check-auth', methods=['GET'])
def admin_check_auth():
    admin_id = session.get('admin_id')
    is_admin = session.get('is_admin')
    print(f"🔐 Admin check-auth request - Session: {dict(session)}, admin_id: {admin_id}")
    if admin_id and is_admin:
        admin = AdminUser.query.get(admin_id)
        if admin:
            print(f"✅ Admin authenticated: {admin.email}")
            return jsonify({
                'authenticated': True,
                'admin_id': admin.id,
                'name': admin.name,
                'email': admin.email,
                'role': admin.role
            }), 200
    print("❌ Admin not authenticated - returning false")
    return jsonify({'authenticated': False}), 200