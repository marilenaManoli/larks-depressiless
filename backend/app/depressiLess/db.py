
#db.py
"""
initializes the SQLAlchemy object and provides an init_app function 
to initialize it with the Flask app.
"""
from flask_sqlalchemy import SQLAlchemy

depressiless_db = SQLAlchemy()

def init_app(app):
    depressiless_db.init_app(app)

