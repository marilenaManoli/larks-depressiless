"""
depressiLess/api/init.py
blueprint definition of depressiless

"""
from flask import Blueprint

depressiLess_bp = Blueprint('depressiLess', __name__)

# Import all endpoints after the Blueprint is defined to avoid circular dependencies
from . import user_info, text_class, speech_to_text
