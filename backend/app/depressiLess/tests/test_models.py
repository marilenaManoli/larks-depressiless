import unittest
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

# Assuming this is your application factory
from depressiLess import create_depressiLess, db
from depressiLess.app.models import User, ContactInfo, MedicalHistory, QuestionnaireResponse, MentalHealthHistory

class UserTestCase(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.app = create_depressiLess('testing')
        cls.app_context = cls.app.app_context()
        cls.app_context.push()
        db.create_all()

    @classmethod
    def tearDownClass(cls):
        db.session.remove()
        db.drop_all()
        cls.app_context.pop()

    def setUp(self):
        db.session.begin_nested()  # Start a new transaction for each test

    def tearDown(self):
        db.session.rollback()  # Roll back the transaction to clean up the database

    def test_user_creation(self):
        user = User(name='Alice', gender_identity='Female', sex_assigned_at_birth='Female',
                    age=30, nationality='American', sexual_orientation='Straight')
        db.session.add(user)
        db.session.commit()
        self.assertIsNotNone(user.id)
        self.assertEqual(user.name, 'Alice')
        # Add more assertions as necessary
    
    def test_contact_info_creation(self):
        user = User(name='Bob', gender_identity='Male', sex_assigned_at_birth='Male',
                    age=25, nationality='Canadian', sexual_orientation='Gay')
        db.session.add(user)
        db.session.commit()
        contact_info = ContactInfo(user_id=user.id, address='123 Maple Street', phone_number='555-1234', email='bob@example.com')
        db.session.add(contact_info)
        db.session.commit()
        self.assertEqual(contact_info.user_id, user.id)
        # Add more assertions as necessary
    
    def test_medical_history_creation(self):
        user = User(name='Rob', gender_identity='Male', sex_assigned_at_birth='Male',
                    age=15, nationality='British', sexual_orientation='Straight')
        medical_history = MedicalHistory(user_id=user.id, past_medical_history='None', family_medical_history='None', medication_history='None')
        db.session.add(medical_history)
        db.session.commit()
        self.assertEqual(medical_history.user_id, user.id)
        # Add more assertions as necessary
    
    def test_questionnaire_response_creation(self):
        user = User(name='Lola', gender_identity='Female', sex_assigned_at_birth='Female',
                    age=18, nationality='French', sexual_orientation='Gay')
        questionnaire_response = QuestionnaireResponse(user_id=user.id, questionnaire_type='Mental Health Assessment', responses='{"Q1": "Yes", "Q2": "No"}')
        db.session.add(questionnaire_response)
        db.session.commit()
        self.assertTrue(isinstance(questionnaire_response.responses, dict))
        # Add more assertions as necessary

    def test_mental_health_history_creation(self):
        user = User(name='Maria', gender_identity='Female', sex_assigned_at_birth='Male',
                    age=23, nationality='Greek', sexual_orientation='Gay')
        mental_health_history = MentalHealthHistory(user_id=user.id, psychiatric_history='None', stress_levels='Low', coping_mechanisms='Exercise')
        db.session.add(mental_health_history)
        db.session.commit()
        self.assertEqual(mental_health_history.stress_levels, 'Low')
        # Add more assertions as necessary





