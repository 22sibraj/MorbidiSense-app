from flask import Flask, send_from_directory, request, jsonify
import os

app = Flask(__name__, static_folder='../front-end', static_url_path='')

@app.route('/')
def index():
    return send_from_directory('pages', 'login.html')

@app.route('/<path:path>')
def static_files(path):
    return send_from_directory('../front-end', path)

# Example API route
@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    # Load ML model & predict
    return jsonify({'risk_score': 85})

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000)
