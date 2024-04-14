import nltk
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
from nltk.sentiment import SentimentIntensityAnalyzer
from transformers import AutoModelForSequenceClassification, AutoTokenizer

# Initialization of NLTK resources
lemmatizer = WordNetLemmatizer()
stop_words = set(stopwords.words('english'))  # Load stopwords once, to improve performance
sia = SentimentIntensityAnalyzer()

# Load the model and tokenizer at the start-up of the application
model = AutoModelForSequenceClassification.from_pretrained('./depressiLess/models/depression_model')
tokenizer = AutoTokenizer.from_pretrained('./depressiLess/models/depression_model')

def classify_text(text):
    """
    Classify the sentiment of the text using a pre-trained model.
    Args:
        text (str): Input text to classify.
    Returns:
        tuple: Classification label and confidence score.
    """
    processed_text, sentiment_score = preprocess_text(text)

    inputs = tokenizer(processed_text, return_tensors="pt", truncation=True, max_length=512)
    outputs = model(**inputs)
    probs = outputs.logits.softmax(dim=-1)
    predicted_class_id = probs.argmax(-1).item()
    confidence_score = probs.max().item()

    classification = convert_prediction_to_classification(predicted_class_id)
    return classification, confidence_score

def preprocess_text(text):
    """
    Preprocess text by removing stopwords and lemmatizing.
    Args:
        text (str): Text to preprocess.
    Returns:
        tuple: Preprocessed text and sentiment score.
    """
    tokens = [lemmatizer.lemmatize(word) for word in nltk.word_tokenize(text.lower()) if word.isalpha() and word not in stop_words]
    processed_text = ' '.join(tokens)
    sentiment_score = sia.polarity_scores(processed_text)['compound']
    return processed_text, sentiment_score

def convert_prediction_to_classification(predicted_class_id):
    """
    Convert a predicted class ID to a label.
    Args:
        predicted_class_id (int): The predicted class ID from the model.
    Returns:
        str: Classification label.
    """
    label_map = {0: "Non-Depression", 1: "Depression"}
    return label_map[predicted_class_id]
