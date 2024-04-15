"""
depressiLess/__init__.py
Individual app's package initializer

"""
from flask import Blueprint

depressiLess_bp = Blueprint('depressiLess', __name__)

from .api import user_info, mental_health_history, medical_history, questionnaire, chat
from .models.ai_model import text_analysis
# from .models import depression_model
