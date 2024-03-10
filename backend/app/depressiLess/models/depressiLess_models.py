"""
depressiLess/models/depressiLess_models.py

"""
from app import db
from datetime import datetime

class UserInformation(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    genderIdentity = db.Column(db.String(50), nullable=False)
    sexAssignedAtBirth = db.Column(db.String(50), nullable=False)
    age = db.Column(db.Integer, nullable=False)
    nationality = db.Column(db.String(120), nullable=False)
    sexualOrientation = db.Column(db.String(50), nullable=True)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f'<User {self.name}>'

    # Assuming a relationship (One to Many) between UserInfo and UserMentalHealthHistory
    # Need to add a foreign key to the UserMentalHealthHistory model for this relationship to work
    mental_health_histories = db.relationship('UserMentalHealthHistory', backref='user', lazy=True)

class UserMentalHealthHistory(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    psychiatricHistory = db.Column(db.Text, nullable=False)
    stressLevels = db.Column(db.Text, nullable=False)
    copingMechanisms = db.Column(db.Text, nullable=False)

    user_id = db.Column(db.Integer, db.ForeignKey('user_information.id'), nullable=False)  # Adjusted ForeignKey to match UserInfo table name
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f'<UserMentalHealthHistory {self.id}>'

class UserMedicalHistory(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    pastMedicalHistory = db.Column(db.Text, nullable=False)
    familyMedicalHistory = db.Column(db.Text, nullable=True)
    medicationHistory = db.Column(db.Text, nullable=True)
    
    user_id = db.Column(db.Integer, db.ForeignKey('user_information.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f'<UserMedicalHistory {self.id}>'


