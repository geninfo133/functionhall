from datetime import datetime
from app import db
from werkzeug.security import generate_password_hash, check_password_hash

# -------------------------
# Admin User Model
# -------------------------
class AdminUser(db.Model):
    __tablename__ = 'admin_users'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.String(200), nullable=False)
    role = db.Column(db.String(20), default='vendor')  # 'super_admin' or 'vendor'
    phone = db.Column(db.String(20))
    business_name = db.Column(db.String(150))  # For vendors
    is_approved = db.Column(db.Boolean, default=False)  # Vendors need approval
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationship to halls (for vendors)
    halls = db.relationship('FunctionHall', backref='vendor', lazy=True)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def __repr__(self):
        return f'<AdminUser {self.email}>'

# -------------------------
# Function Hall Model
# -------------------------
class FunctionHall(db.Model):
    __tablename__ = 'function_halls'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    owner_name = db.Column(db.String(100))
    location = db.Column(db.String(150))
    capacity = db.Column(db.Integer)
    contact_number = db.Column(db.String(20))
    price_per_day = db.Column(db.Float)
    description = db.Column(db.Text)
    vendor_id = db.Column(db.Integer, db.ForeignKey('admin_users.id'), nullable=True)  # Link to vendor
    is_approved = db.Column(db.Boolean, default=False)  # Super admin approval required
    approval_status = db.Column(db.String(20), default='pending')  # pending, approved, rejected

    # Relationships
    packages = db.relationship('Package', backref='hall', lazy=True)
    bookings = db.relationship('Booking', backref='hall', lazy=True)
    calendar_entries = db.relationship('Calendar', backref='hall', lazy=True)
    photos = db.relationship('HallPhoto', backref='hall', lazy=True)
    pending_changes = db.relationship('HallChangeRequest', backref='hall', lazy=True)
    functional_rooms = db.relationship('FunctionalRoom', backref='hall', lazy=True)
    guest_rooms = db.relationship('GuestRoom', backref='hall', lazy=True)

    def __repr__(self):
        return f'<FunctionHall {self.name}>'
# -------------------------
# Hall Photo Model
# -------------------------
class HallPhoto(db.Model):
    __tablename__ = 'hall_photos'

    id = db.Column(db.Integer, primary_key=True)
    hall_id = db.Column(db.Integer, db.ForeignKey('function_halls.id'), nullable=False)
    url = db.Column(db.String(300), nullable=False)

    def __repr__(self):
        return f'<HallPhoto {self.url}>'


# -------------------------
# Package Model
# -------------------------
class Package(db.Model):
    __tablename__ = 'packages'

    id = db.Column(db.Integer, primary_key=True)
    hall_id = db.Column(db.Integer, db.ForeignKey('function_halls.id'), nullable=False)
    package_name = db.Column(db.String(100), nullable=False)
    price = db.Column(db.Float)
    details = db.Column(db.Text)

    def __repr__(self):
        return f'<Package {self.package_name}>'


# -------------------------
# Functional Room Model (VIP, Green Room, Conference)
# -------------------------
class FunctionalRoom(db.Model):
    __tablename__ = 'functional_rooms'

    id = db.Column(db.Integer, primary_key=True)
    hall_id = db.Column(db.Integer, db.ForeignKey('function_halls.id'), nullable=False)
    room_type = db.Column(db.String(50), nullable=False)  # 'VIP', 'Green Room', 'Conference/Meeting'
    room_name = db.Column(db.String(100), nullable=False)
    price = db.Column(db.Float, nullable=False)
    capacity = db.Column(db.Integer)  # For conference rooms
    amenities = db.Column(db.Text)  # JSON string or comma-separated
    description = db.Column(db.Text)

    def __repr__(self):
        return f'<FunctionalRoom {self.room_type} - {self.room_name}>'


# -------------------------
# Guest Room Model (Hotel-style accommodation)
# -------------------------
class GuestRoom(db.Model):
    __tablename__ = 'guest_rooms'

    id = db.Column(db.Integer, primary_key=True)
    hall_id = db.Column(db.Integer, db.ForeignKey('function_halls.id'), nullable=False)
    room_category = db.Column(db.String(50), nullable=False)  # 'Standard', 'Deluxe', 'Suite'
    total_rooms = db.Column(db.Integer, nullable=False)  # Total number of this room type
    price_per_room = db.Column(db.Float, nullable=False)
    bed_type = db.Column(db.String(50))  # 'Single', 'Double', 'Queen', 'King'
    amenities = db.Column(db.Text)  # AC, TV, WiFi, etc.
    max_occupancy = db.Column(db.Integer)  # Max persons per room
    description = db.Column(db.Text)

    def __repr__(self):
        return f'<GuestRoom {self.room_category} - {self.total_rooms} rooms>'


# -------------------------
# Customer Model (B2C)
# -------------------------
class Customer(db.Model):
    __tablename__ = 'customers'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    phone = db.Column(db.String(20))
    address = db.Column(db.String(200))
    password_hash = db.Column(db.String(256))
    is_approved = db.Column(db.Boolean, default=False)  # Super admin approval required
    approval_status = db.Column(db.String(20), default='pending')  # pending, approved, rejected
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    bookings = db.relationship('Booking', backref='customer', lazy=True)
    inquiries = db.relationship('Inquiry', backref='customer', lazy=True)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def __repr__(self):
        return f'<Customer {self.name}>'


# -------------------------
# Booking Model
# -------------------------
class Booking(db.Model):
    __tablename__ = 'bookings'

    id = db.Column(db.Integer, primary_key=True)
    customer_id = db.Column(db.Integer, db.ForeignKey('customers.id'), nullable=False)
    hall_id = db.Column(db.Integer, db.ForeignKey('function_halls.id'), nullable=False)
    event_date = db.Column(db.Date, nullable=False)
    status = db.Column(db.String(20), default='Pending')
    total_amount = db.Column(db.Float)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f'<Booking {self.id} - {self.status}>'


# -------------------------
# Inquiry Model
# -------------------------
class Inquiry(db.Model):
    __tablename__ = 'inquiries'

    id = db.Column(db.Integer, primary_key=True)
    customer_id = db.Column(db.Integer, db.ForeignKey('customers.id'))
    hall_id = db.Column(db.Integer, db.ForeignKey('function_halls.id'), nullable=True)
    customer_name = db.Column(db.String(100))
    email = db.Column(db.String(100))
    phone = db.Column(db.String(20))
    message = db.Column(db.Text)
    status = db.Column(db.String(20), default='Pending')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f'<Inquiry {self.customer_name}>'


# -------------------------
# Notification Model
# -------------------------
class Notification(db.Model):
    __tablename__ = 'notifications'

    id = db.Column(db.Integer, primary_key=True)
    recipient_email = db.Column(db.String(100), nullable=False)  # Vendor/owner email
    recipient_name = db.Column(db.String(100))
    subject = db.Column(db.String(200))
    message = db.Column(db.Text, nullable=False)
    booking_id = db.Column(db.Integer, db.ForeignKey('bookings.id'))
    is_read = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f'<Notification to {self.recipient_email}>'


# -------------------------
# Partner / Vendor Model (B2B)
# -------------------------
class Partner(db.Model):
    __tablename__ = 'partners'

    id = db.Column(db.Integer, primary_key=True)
    company_name = db.Column(db.String(100), nullable=False)
    contact_person = db.Column(db.String(100))
    email = db.Column(db.String(100))
    service_type = db.Column(db.String(100))  # e.g., Catering, Decoration, Photography
    phone = db.Column(db.String(20))

    def __repr__(self):
        return f'<Partner {self.company_name}>'


# -------------------------
# Calendar Model
# -------------------------
class Calendar(db.Model):
    __tablename__ = 'calendar'

    id = db.Column(db.Integer, primary_key=True)
    hall_id = db.Column(db.Integer, db.ForeignKey('function_halls.id'), nullable=False)
    date = db.Column(db.Date, nullable=False)
    is_booked = db.Column(db.Boolean, default=False)

    def __repr__(self):
        return f'<Calendar {self.date} - {self.is_booked}>'


# -------------------------
# Hall Change Request Model
# -------------------------
class HallChangeRequest(db.Model):
    __tablename__ = 'hall_change_requests'

    id = db.Column(db.Integer, primary_key=True)
    hall_id = db.Column(db.Integer, db.ForeignKey('function_halls.id'), nullable=True)  # Null for new halls
    vendor_id = db.Column(db.Integer, db.ForeignKey('admin_users.id'), nullable=False)
    action_type = db.Column(db.String(20), nullable=False)  # 'add', 'edit', 'delete'
    status = db.Column(db.String(20), default='pending')  # 'pending', 'approved', 'rejected'
    
    # Store the changes as JSON
    old_data = db.Column(db.Text)  # JSON string of old hall data (for edit/delete)
    new_data = db.Column(db.Text)  # JSON string of new hall data (for add/edit)
    
    # Metadata
    requested_at = db.Column(db.DateTime, default=datetime.utcnow)
    reviewed_at = db.Column(db.DateTime)
    reviewed_by = db.Column(db.Integer, db.ForeignKey('admin_users.id'))  # Super admin who approved/rejected
    rejection_reason = db.Column(db.Text)  # Reason if rejected

    def __repr__(self):
        return f'<HallChangeRequest {self.action_type} - {self.status}>'
