#depressiLess/config/__init__.py
#Configuration settings

import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY', 'default_secret_key')
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URI', 'sqlite:///depressiless.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
