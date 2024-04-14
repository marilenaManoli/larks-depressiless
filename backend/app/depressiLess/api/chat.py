#chat.py
from flask import g, request, jsonify
from app import db
from ..models.depressiLess_models import TextClassification, ChatMessage
from .. import depressiLess_bp
import logging
from sqlalchemy.exc import SQLAlchemyError
from ..models.ai_model.text_analysis import classify_text

@depressiLess_bp.route('/api/chat', methods=['POST'])
def chat():
    # Assuming the user_id is already set in the Flask's g context by an authentication decorator or a before_request function
    if not hasattr(g, 'user_id'):
        return jsonify({'error': 'Authentication required'}), 401

    data = request.json
    message = data["message"]
    current_user_id = g.user_id  # g.user_id is set by your authentication process

    # Perform classification
    classification, confidence = classify_text(message)

    # Save the chat message and its classification to the database
    try:
        new_message = ChatMessage(
            user_id=current_user_id,
            message=message,
        )
        new_classification = TextClassification(
            user_input=message,
            classification=classification,
            confidence=confidence,
            user_id=current_user_id
        )
        db.session.add(new_message)
        db.session.add(new_classification)
        db.session.commit()
    except SQLAlchemyError as e:
        logging.error("Database error occurred", exc_info=e)
        db.session.rollback()
        return jsonify({'error': 'Database error occurred'}), 500

    # Create a response object with the classification result
    response = {
        "message": "Here's what I think about your message:",
        "classification": classification,
        "confidence": confidence
    }

    return jsonify(response)
