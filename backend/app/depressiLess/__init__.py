"""
depressiLess/__init__.py
Individual app's package initializer

"""
from flask import Blueprint

depressiLess_bp = Blueprint('depressiLess', __name__)

from .api import speech_to_text, text_class, user_info, mental_health_history, medical_history

