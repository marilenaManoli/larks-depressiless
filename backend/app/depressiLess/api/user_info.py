
#depressiLess/api/user_info

from flask import request, jsonify
from ..models.depressiLess_models import UserInformation
from app import db
from sqlalchemy.exc import SQLAlchemyError
from .. import depressiLess_bp
from app.endpoints import auth_bp
import logging

def validate_user_data(data):
    errors = {}
    if not data.get('name', '').strip():
        errors['name'] = 'Name is required.'
    if not data.get('genderIdentity', '').strip():
        errors['genderIdentity'] = 'Gender Identity is required.'
    if not data.get('sexAssignedAtBirth', '').strip():
        errors['sexAssignedAtBirth'] = 'Sex assigned at birth is required.'
    try:
        age = int(data.get('age', 0))
        if age <= 0:
            errors['age'] = 'Valid age is required.'
    except ValueError:
        errors['age'] = 'Valid age is required.'
    if not data.get('nationality', '').strip():
        errors['nationality'] = 'Nationality is required.'
    if not data.get('sexualOrientation', '').strip():
        errors['sexualOrientation'] = 'Sexual Orientation is required.'
    return errors

# Import the Blueprint within the function that uses it
def get_blueprint():
    from . import depressiLess_bp
    return depressiLess_bp

@auth_bp.route('/api/depressiLess/UserInfoForm', methods=['POST'])
def create_userinfo():
    logging.info("Attempting to create user info")
    data = request.get_json()
    validation_errors = validate_user_data(data)
    if validation_errors:
        logging.warning("Validation errors occurred: %s", validation_errors)
        return jsonify({"errors": validation_errors}), 400
        
    try:
        user = UserInformation(**data) 
        db.session.add(user)
        db.session.commit()
        logging.info("User information saved successfully for user ID: %s", user.id)
        return jsonify({'message': 'User information saved successfully', 'id': user.id}), 201

    except SQLAlchemyError as e:
        db.session.rollback()
        logging.info("User information saved successfully for user ID: %s", user.id)
        return jsonify({"error": "Could not save user info", "message": str(e)}), 500
