import os
from flask import Flask
from flask_cors import CORS
from .models import db
from .routes import api_bp

def create_app(database_url: str | None = None):
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = database_url or os.getenv('DATABASE_URL', 'sqlite:///./notes.db')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-change-me')

    db.init_app(app)
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    app.register_blueprint(api_bp, url_prefix='/api')

    @app.get('/health')
    def health():
        return {'status': 'ok'}

    # Optional auto create tables on boot
    if os.getenv('AUTO_CREATE_DB', '1') == '1':
        with app.app_context():
            db.create_all()

    return app
