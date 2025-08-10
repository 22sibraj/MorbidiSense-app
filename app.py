from flask import Flask, send_from_directory, request, jsonify
import os

# Initialize Flask app
app = Flask(__name__, static_folder='front-end', static_url_path='/front-end')

# Route to serve the home page
@app.route('/')
def index():
    return send_from_directory('front-end/pages', 'home.html')

@app.route('/explanation')
def explanation():
    return send_from_directory('front-end/pages', 'explanation.html')

@app.route('/predict-risk')
def predict_risk():
    return send_from_directory('front-end/pages', 'predict-risk.html')

@app.route('/results')
def results():
    return send_from_directory('front-end/pages', 'results.html')

@app.route('/report')
def report():
    return send_from_directory('front-end/pages', 'report.html')

@app.route('/health-insights')
def health_insights():
    return send_from_directory('front-end/pages', 'health-insights.html')

@app.route('/user-profile')
def user_profile():
    return send_from_directory('front-end/pages', 'user-profile.html')

@app.route('/settings')
def settings():
    return send_from_directory('front-end/pages', 'logout.html')  # Assuming logout.html for settings page.

# Route to serve other static files (CSS, JS, Images)
@app.route('/<path:path>')
def static_files(path):
    return send_from_directory('front-end', path)

# Example API Route (For ML Predictions)
@app.route('/predict', methods=['POST'])
def predict():
    data = request.json  # Get JSON data from POST request
    # Here you can add your ML model prediction logic
    # For now, we're sending a dummy risk score
    return jsonify({'risk_score': 85})

# Catch-All Route to handle SPA routing (404 Fix)
@app.errorhandler(404)
def not_found(e):
    return send_from_directory('front-end/pages', 'home.html')

# Run the Flask development server only if running locally
if __name__ == '__main__':
    app.run(debug=True)
