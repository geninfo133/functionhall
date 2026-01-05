
from flask import Flask
from dotenv import load_dotenv
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from flask_marshmallow import Marshmallow
import os

# Initialize extensions
db = SQLAlchemy()
ma = Marshmallow()
migrate = Migrate()

def create_app():
    load_dotenv()  # Ensure .env variables are loaded
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
    
    # Configure CORS - Allow all origins for now
    CORS(app, 
         resources={r"/*": {"origins": "*"}},
         allow_headers=['Content-Type', 'Authorization'],
         methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'])

    # Configure Database - PostgreSQL
    # Use DATABASE_URL from environment (Railway or .env)
    app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL')
    print("DB URI:", app.config['SQLALCHEMY_DATABASE_URI'])  # Debug: Print the DB URI being used
    # Initialize extensions
    db.init_app(app)
    ma.init_app(app)
    migrate.init_app(app, db)

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
