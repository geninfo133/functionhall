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
    role = db.Column(db.String(20), default='admin')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

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

    # Relationships
    packages = db.relationship('Package', backref='hall', lazy=True)
    bookings = db.relationship('Booking', backref='hall', lazy=True)
    calendar_entries = db.relationship('Calendar', backref='hall', lazy=True)
    photos = db.relationship('HallPhoto', backref='hall', lazy=True)

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
# Customer Model (B2C)
# -------------------------
class Customer(db.Model):
    __tablename__ = 'customers'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    phone = db.Column(db.String(20))
    address = db.Column(db.String(200))

    bookings = db.relationship('Booking', backref='customer', lazy=True)
    inquiries = db.relationship('Inquiry', backref='customer', lazy=True)

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
    message = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f'<Inquiry {self.customer_name}>'


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
