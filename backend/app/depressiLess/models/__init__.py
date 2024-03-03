#depressiLess/models/__init__.py
#database models

from ..db import depressiless_db
import datetime

class User(depressiless_db.Model):
    id = depressiless_db.Column(depressiless_db.Integer, primary_key=True)
    name = depressiless_db.Column(depressiless_db.String(120), nullable=False)
    genderIdentity = depressiless_db.Column(depressiless_db.String(50), nullable=False)
    sexAssignedAtBirth = depressiless_db.Column(depressiless_db.String(50), nullable=False)
    age = depressiless_db.Column(depressiless_db.Integer, nullable=False)
    nationality = depressiless_db.Column(depressiless_db.String(120), nullable=False)
    sexualOrientation = depressiless_db.Column(depressiless_db.String(50), nullable=True)

    created_at = depressiless_db.Column(depressiless_db.DateTime, default=datetime.datetime.utcnow)
    updated_at = depressiless_db.Column(depressiless_db.DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    def __repr__(self):
        return f'<User {self.name}>'
