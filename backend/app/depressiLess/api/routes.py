
#depressiLess/api/routes.py

"""
This file defines the routes for depressiLess. 
It includes a route for handling POST requests to /UserInfoForm and 
includes a function validate_user_data for input validation. 
This file is crucial as it contains the logic for user data handling and saving to the database. 
The code includes error handling for database operations.
"""

from flask import Blueprint, request, jsonify
from flask_cors import cross_origin
from sqlalchemy.exc import SQLAlchemyError
from ..models import User
from ..db import depressiless_db

depressiless_bp = Blueprint('depressiLess', __name__)

@depressiless_bp.route('/UserInfoForm', methods=['POST'])
@cross_origin(origins="http://localhost:3000/")
def create_userinfo():
    data = request.get_json()
    validation_errors = validate_user_data(data)
    if validation_errors:
        return jsonify({"errors": validation_errors}), 400
    
    try:
        user = User(name=data['name'], gender_identity=data['genderIdentity'],
                    sex_assigned_at_birth=data['sexAssignedAtBirth'], age=data['age'],
                    nationality=data['nationality'], sexual_orientation=data.get('sexualOrientation', ''))
        depressiless_db.session.add(user)
        depressiless_db.session.commit()
        return jsonify({'message': 'User information saved successfully', 'id': user.id}), 201
    except SQLAlchemyError as e:
        depressiless_db.session.rollback()
        return jsonify({"error": "Could not save user info", "message": str(e)}), 500

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
    return errors
