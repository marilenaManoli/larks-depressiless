"""
#depressiLess/api/speech_to_text.py

from flask import request, jsonify


import soundfile as sf
from transformers import Wav2Vec2Tokenizer, Wav2Vec2ForCTC
import torch
import io
from .. import depressiLess_bp

tokenizer = Wav2Vec2Tokenizer.from_pretrained("facebook/wav2vec2-base-960h")
model = Wav2Vec2ForCTC.from_pretrained("facebook/wav2vec2-base-960h")

def speech_to_text(audio_input):
    speech, samplerate = sf.read(audio_input, dtype="float32")
    input_values = tokenizer(speech, return_tensors="pt").input_values
    logits = model(input_values).logits
    predicted_ids = torch.argmax(logits, dim=-1)
    transcription = tokenizer.decode(predicted_ids[0])
    return transcription

# Import the Blueprint within the function that uses it
def get_blueprint():
    from . import depressiLess_bp
    return depressiLess_bp

@depressiLess_bp.route('/transcribe', methods=['POST'])
def transcribe_audio():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    if file:
        audio_input = io.BytesIO(file.read())
        transcription = speech_to_text(audio_input)
        return jsonify({'transcribedText': transcription})
"""