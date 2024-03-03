
#depressiLess/__init__.py

"""
This file sets up the Flask application, initializes the database with depressiless_db, 
and registers the depressiless_bp Blueprint. 
It also sets up CORS for the specified routes.
"""

from flask import Flask
from flask_cors import CORS
from .api.routes import depressiless_bp
from .config import Config
from .db import depressiless_db

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    depressiless_db.init_app(app)
    with app.app_context():
        depressiless_db.create_all()

    CORS(app, resources={r"/depressiLess/*": {"origins": "http://localhost:3000"}})
    app.register_blueprint(depressiless_bp, url_prefix='/depressiless')

    return app
