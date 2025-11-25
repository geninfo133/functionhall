from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_marshmallow import Marshmallow
import os

# Initialize extensions
db = SQLAlchemy()
ma = Marshmallow()

def create_app():
    app = Flask(__name__)
    
    # Configure session - Using 'Lax' for localhost development
    app.config['SECRET_KEY'] = 'your-secret-key-here-change-in-production'
    app.config['SESSION_TYPE'] = 'filesystem'
    app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'  # Lax allows same-site cookies
    app.config['SESSION_COOKIE_SECURE'] = False  # False for localhost (no HTTPS)
    app.config['SESSION_COOKIE_HTTPONLY'] = False  # Allow JavaScript access for debugging
    app.config['SESSION_COOKIE_NAME'] = 'session'
    app.config['SESSION_COOKIE_PATH'] = '/'
    app.config['SESSION_COOKIE_DOMAIN'] = None
    
    # Configure CORS to support credentials - include both localhost and 127.0.0.1
    CORS(app, 
         supports_credentials=True, 
         origins=['http://localhost:3000', 'http://localhost:3001', 'http://127.0.0.1:3000', 'http://127.0.0.1:3001'],
         allow_headers=['Content-Type', 'Authorization'],
         expose_headers=['Set-Cookie'],
         methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'])

    # Configure Database
    BASE_DIR = os.path.abspath(os.path.dirname(__file__))
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(BASE_DIR, 'functionhall.db')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # Initialize extensions
    db.init_app(app)
    ma.init_app(app)

    # Register routes
    from app.routes import main
    app.register_blueprint(main)

    from .auth import auth
    app.register_blueprint(auth)

    with app.app_context():
        db.create_all()

    return app
