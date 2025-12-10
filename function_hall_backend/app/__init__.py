
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
    
    # Configure session - Simplified for localhost
    app.config['SECRET_KEY'] = 'your-secret-key-here-change-in-production'
    app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'
    app.config['SESSION_COOKIE_SECURE'] = False
    app.config['SESSION_COOKIE_HTTPONLY'] = False
    
    # Configure file uploads
    app.config['UPLOAD_FOLDER'] = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'uploads', 'hall_photos')
    app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size
    app.config['ALLOWED_EXTENSIONS'] = {'png', 'jpg', 'jpeg', 'gif', 'webp'}
    
    # Create upload folder if it doesn't exist
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
    
    # Configure CORS to support credentials - include both localhost and 127.0.0.1
    CORS(app, 
         supports_credentials=True, 
         origins=['http://localhost:3000', 'http://localhost:3001', 'http://127.0.0.1:3000', 'http://127.0.0.1:3001'],
         allow_headers=['Content-Type', 'Authorization'],
         expose_headers=['Set-Cookie'],
         methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'])

    # Configure Database - PostgreSQL
    # Import configuration
    import config
    
    app.config['SQLALCHEMY_DATABASE_URI'] = f'postgresql://{config.DB_USER}:{config.DB_PASSWORD}@{config.DB_HOST}:{config.DB_PORT}/{config.DB_NAME}'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # Initialize extensions
    db.init_app(app)
    ma.init_app(app)

    # Register routes
    from app.routes import main
    app.register_blueprint(main)

    # Register auth routes
    from app.auth import auth
    from app.auth_jwt import auth_jwt
    app.register_blueprint(auth)
    app.register_blueprint(auth_jwt)

    with app.app_context():
        db.create_all()

    return app
