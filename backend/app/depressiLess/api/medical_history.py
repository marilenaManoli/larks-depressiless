
from flask import request, jsonify
from ..models.depressiLess_models import UserMentalHealthHistory,UserInformation,UserMedicalHistory
from app import db
from sqlalchemy.exc import SQLAlchemyError, IntegrityError
from .. import depressiLess_bp
from app.endpoints import auth_bp
import logging

def validate_medical_history_data(data):
    errors = {}
    if 'user_id' not in data or not UserInformation.query.get(data['user_id']):
        errors['user_id'] = 'Invalid or missing user_id.'
    if not data.get('pastMedicalHistory', '').strip():
        errors['pastMedicalHistory'] = 'Past medical history is required.'
    if not data.get('familyMedicalHistory', '').strip():
        errors['familyMedicalHistory'] = 'Family medical history is required.'
    if not data.get('medicationHistory', '').strip():
        errors['medicationHistory'] = 'Medication history is required.'
    return errors

@auth_bp.route('/api/depressiLess/UserMedicalHistory', methods=['POST'])
def create_medical_history():
    data = request.get_json()
    print("Received data:", data)
    validation_errors = validate_medical_history_data(data)
    
    if validation_errors:
        return jsonify({"errors": validation_errors}), 400

    try:
        medical_history = UserMedicalHistory(**data)
        db.session.add(medical_history)
        db.session.commit()
        return jsonify({'message': 'Medical history saved successfully', 'id': medical_history.id}), 201
    except IntegrityError as e:
        db.session.rollback()
        logging.error("Integrity Error: %s", str(e))
        return jsonify({"error": "Database integrity error", "message": str(e)}), 500
    except SQLAlchemyError as e:
        db.session.rollback()
        logging.error("SQLAlchemy Error: %s", str(e))
        return jsonify({"error": "Could not save medical history due to SQLAlchemy error", "message": str(e)}), 500
    except Exception as e:
        db.session.rollback()
        exception_type = type(e).__name__
        logging.error("Unexpected Error - Type: %s, Message: %s", exception_type, str(e))
        return jsonify({"error": "An unexpected error occurred", "type": exception_type, "message": str(e)}), 500