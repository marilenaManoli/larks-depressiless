# depressiLess/api/text_class.py

from flask import request, jsonify
from transformers import BertTokenizer, BertForSequenceClassification
from nltk.sentiment import SentimentIntensityAnalyzer
from .. import depressiLess_bp
from ..models.depressiLess_models import TextClassification
from app import db
from sqlalchemy.exc import SQLAlchemyError, IntegrityError
import logging

tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')
model = BertForSequenceClassification.from_pretrained('bert-base-uncased', num_labels=2)

sia = SentimentIntensityAnalyzer()

def validate_chat_input(data):
    errors = {}
    if not data.get('text', '').strip():
        errors['text'] = 'Let us help you. Type something in the text box.'
    return errors

@depressiLess_bp.route('/api/text_class/classify', methods=['POST'])
def classify_text():
    data = request.get_json()
    print("Received data:", data)
    validation_errors = validate_chat_input(data)
    user_text = data['text']

    if validation_errors:
        return jsonify({"errors": validation_errors}), 400
    
    try:
        # Perform sentiment analysis
        sentiment = sia.polarity_scores(user_text)

        # Determine the classification based on sentiment
        response, confidence = generate_response_based_on_sentiment(sentiment['compound'])

        # Save the classification result to the database
        classification_entry = TextClassification(
            user_input=user_text,
            classification=response,
            confidence=confidence,
            # user_id should be the ID of the user, obtained from the session or token
            user_id=1  # Replace with the actual logic to obtain the user ID
        )
        db.session.add(classification_entry)
        db.session.commit()

        return jsonify({'classification': response, 'confidence': confidence})

    except Exception as e:
        logging.error("An error occurred: ", exc_info=e)
        return jsonify({'error': 'Internal Server Error'}), 500


def generate_response_based_on_sentiment(score):
    # Define response logic based on sentiment score
    if score > 0.05:  # positive sentiment
        return "It seems like you're feeling good, and that's great to hear!"
    elif score < -0.05:  # negative sentiment
        return "I'm here for you. It seems you might be feeling down. Would you like to talk more about it?"
    else:  # neutral sentiment
        return "I'm here to listen to you. Tell me more about your day."