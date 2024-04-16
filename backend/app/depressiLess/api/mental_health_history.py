
#depressiLess/api/mental_health_history

from flask import request, jsonify
from ..models.depressiLess_models import UserMentalHealthHistory,UserInformation
from app import db
from sqlalchemy.exc import SQLAlchemyError, IntegrityError
from .. import depressiLess_bp
from app.endpoints import auth_bp
import logging


def validate_mental_health_data(data):
    errors = {}
    if 'user_id' not in data or not UserInformation.query.get(data['user_id']):
        errors['user_id'] = 'Invalid or missing user_id.'
    if not data.get('psychiatricHistory', '').strip():
        errors['psychiatricHistory'] = 'Psychiatric history is required.'
    if not data.get('stressLevels', '').strip():
        errors['stressLevels'] = 'Stress levels are required.'
    if not data.get('copingMechanisms', '').strip():
        errors['copingMechanisms'] = 'Coping mechanisms are required.'
    return errors

@auth_bp.route('/api/depressiLess/UserMentalHealthHistory', methods=['POST'])
def create_user_mental_health_history():
    data = request.get_json()
    validation_errors = validate_mental_health_data(data)

    if validation_errors:
        return jsonify({"errors": validation_errors}), 400

    try:
        mental_health_history = UserMentalHealthHistory(**data)
        db.session.add(mental_health_history)
        db.session.commit()
        return jsonify({'message': 'User mental health history saved successfully', 'id': mental_health_history.id}), 201

    except IntegrityError as e:
        db.session.rollback()
        logging.error("Integrity Error: %s", str(e))
        return jsonify({"error": "Database integrity error", "message": str(e)}), 500
    except SQLAlchemyError as e:
        db.session.rollback()
        logging.error("SQLAlchemy Error: %s", str(e))
        return jsonify({"error": "Could not save user mental health history due to SQLAlchemy error", "message": str(e)}), 500
    except Exception as e:
        db.session.rollback()
        exception_type = type(e).__name__
        logging.error("Unexpected Error - Type: %s, Message: %s", exception_type, str(e))
        return jsonify({"error": "An unexpected error occurred", "type": exception_type, "message": str(e)}), 500
    