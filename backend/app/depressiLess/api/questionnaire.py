
#depressiLess/api/questionnaire

from flask import request, jsonify
from ..models.depressiLess_models import UserMedicalHistory, UserMentalHealthHistory,UserInformation
from ..models.depressiLess_models import QuestionnaireForm
from app import db
from sqlalchemy.exc import SQLAlchemyError, IntegrityError
from .. import depressiLess_bp
from app.endpoints import auth_bp
import logging

def validate_questionnaire(data):
    errors = {}
    if 'user_id' not in data or not UserInformation.query.get(data['user_id']):
        errors['user_id'] = 'Invalid or missing user_id.'
    if not data.get('currentMood', '').strip():
        errors['currentMood'] = 'This answer is required.'
    if not data.get('recentExperiences', '').strip():
        errors['recentExperiences'] = 'This answer is required.'
    if not data.get('emotionalState', '').strip():
        errors['emotionalState'] = 'This answer is required.'
    if not data.get('emotionalTriggers', '').strip():
        errors['emotionalTriggers'] = 'This answer is required.'
    if not data.get('copingMethods', '').strip():
        errors['copingMethods'] = 'This answer is required.'
    if not data.get('safetyCheck', '').strip():
        errors['safetyCheck'] = 'This answer is required.'
    return errors

@auth_bp.route('/api/depressiLess/QuestionnaireForm', methods=['POST'])
def create_questionnaire():
    data = request.get_json()
    logging.info('Received data: %s', data)  # Logs the data received from the request
    
    validation_errors = validate_questionnaire(data)
    if validation_errors:
        logging.warning('Validation errors: %s', validation_errors)  # Logs validation errors if any
        return jsonify({"errors": validation_errors}), 400
    
    try:
        questionnaire = QuestionnaireForm(**data)
        logging.info('Questionnaire object before commit: %s', questionnaire)  # Logs the questionnaire object

        db.session.add(questionnaire)
        db.session.commit()
        logging.info('Questionnaire object after commit: %s', questionnaire)  # Logs the questionnaire object again

        return jsonify({'message': 'Questionnaire saved successfully', 'id': questionnaire.id}), 201

    except IntegrityError as e:
        db.session.rollback()
        logging.error("Integrity Error: %s", str(e))
        return jsonify({"error": "Database integrity error", "message": str(e)}), 500
    except SQLAlchemyError as e:
        db.session.rollback()
        # If the original error is available, log that as well
        orig_error = getattr(e, 'orig', None)
        if orig_error:
            logging.error("Original SQLAlchemy Error: %s", str(orig_error))
        logging.error("SQLAlchemy Error: %s", str(e))
        return jsonify({"error": "Could not save questionnaire due to SQLAlchemy error", "message": str(e)}), 500
    except Exception as e:
        db.session.rollback()
        exception_type = type(e).__name__
        logging.error("Unexpected Error - Type: %s, Message: %s", exception_type, str(e))
        return jsonify({"error": "An unexpected error occurred", "type": exception_type, "message": str(e)}), 500

"""
@auth_bp.route('/api/depressiLess/QuestionnaireForm', methods=['POST'])
def create_questionnaire():
    data = request.get_json()
    print('Received data:', data)
    validation_errors = validate_questionnaire(data)

    if validation_errors:
        return jsonify({"errors": validation_errors}), 400

    try:
        questionnaire = QuestionnaireForm(**data)
        db.session.add(questionnaire)
        db.session.commit()
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
"""