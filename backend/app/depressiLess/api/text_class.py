
#depressiLess/api/text_class.py

from flask import request, jsonify
import torch
from transformers import BertTokenizer, BertForSequenceClassification
from .. import depressiLess_bp

tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')
model = BertForSequenceClassification.from_pretrained('bert-base-uncased')

def classify_text():
    inputs = tokenizer(text, padding=True, truncation=True, max_length=512, return_tensors="pt")
    with torch.no_grad():
        logits = model(**inputs).logits
    prediction = torch.argmax(logits, dim=-1).numpy()
    return prediction

# Import the Blueprint within the function that uses it
def get_blueprint():
    from . import depressiLess_bp
    return depressiLess_bp

@depressiLess_bp.route('/classify', methods=['POST'])
def classify():
    data = request.get_json()
    if not data or 'text' not in data:
        return jsonify({'error': 'No text provided'}), 400
    
    text = data['text']
    prediction = classify_text(text)
    classification = "Class 1" if prediction == 1 else "Class 0"
    return jsonify({'classification': classification})
