
#depressiLess/api/questionnaire

from flask import request, jsonify
from ..models.depressiLess_models import UserMedicalHistory, UserMentalHealthHistory,UserInformation
from ..models.depressiLess_models import QuestionnaireForm
from app import db
from sqlalchemy.exc import SQLAlchemyError, IntegrityError
from .. import depressiLess_bp
from app.endpoints import auth_bp
import logging

@depressiLess_bp.route('/api/depressiLess/QuestionnaireForm', methods=['POST'])
def create_questionnaire():
    data = request.get_json()
    logging.info('Received data: %s', data)  # Logs the data received from the request
    
    # Validate questionnaire data
    errors = validate_questionnaire(data)
    if errors:
        logging.warning('Validation errors: %s', errors)  # Logs validation errors if any
        return jsonify({"errors": errors}), 400
    
    try:
        # Create a new QuestionnaireForm instance
        questionnaire = QuestionnaireForm(**data)
        logging.info('Questionnaire object before commit: %s', questionnaire)  # Logs the questionnaire object

        # Add to the session and commit to the database
        db.session.add(questionnaire)
        db.session.commit()
        logging.info('Questionnaire object after commit: %s', questionnaire)  # Logs the questionnaire object again

        # Return success message with the ID of the new questionnaire entry
        return jsonify({'message': 'Questionnaire saved successfully', 'id': questionnaire.id}), 201

    except IntegrityError as e:
        db.session.rollback()
        logging.error("Integrity Error: %s", str(e))
        return jsonify({"error": "Database integrity error", "message": str(e)}), 500
    except SQLAlchemyError as e:
        db.session.rollback()
        logging.error("SQLAlchemy Error: %s", str(e))
        return jsonify({"error": "Could not save questionnaire due to SQLAlchemy error", "message": str(e)}), 500
    except Exception as e:
        db.session.rollback()
        exception_type = type(e).__name__
        logging.error("Unexpected Error - Type: %s, Message: %s", exception_type, str(e))
        return jsonify({"error": "An unexpected error occurred", "type": exception_type, "message": str(e)}), 500

def validate_questionnaire(data):
    """Validates the questionnaire data."""
    errors = {}
    required_fields = [
        'recentExperiences', 'emotionalState', 
        'emotionalTriggers', 'copingMethods', 'safetyCheck'
    ]
    if not data.get('user_id') or not UserInformation.query.get(data['user_id']):
        errors['user_id'] = 'Invalid or missing user_id.'
    for field in required_fields:
        if not data.get(field, '').strip():
            errors[field] = f'This answer is required.'
    return errors
