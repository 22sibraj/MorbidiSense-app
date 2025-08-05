from flask import Flask, send_from_directory, request, jsonify
import os

app = Flask(__name__, static_folder='front-end', static_url_path='/front-end')

# Route to serve login page at root URL
@app.route('/')
def index():
    return send_from_directory('front-end/pages', 'home.html')

# Route to serve other static files (CSS, JS, Images)
@app.route('/<path:path>')
def static_files(path):
    return send_from_directory('front-end', path)

# Example API Route (For Predict)
@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    return jsonify({'risk_score': 85})

# DO NOT write app.run() here. Azure will use 'gunicorn app:app'
