from flask import Flask, send_from_directory, request, jsonify, abort
import os
from functools import wraps

# Initialize Flask app
app = Flask(__name__, 
            static_folder='front-end', 
            static_url_path='/front-end',
            template_folder='front-end')

# Add CORS headers for development
@app.after_request
def add_cors_headers(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type,Authorization'
    response.headers['Access-Control-Allow-Methods'] = 'GET,POST,PUT,DELETE,OPTIONS'
    return response

# Helper function to serve pages with proper error handling
def serve_page(page_name):
    try:
        return send_from_directory('front-end/pages', f'{page_name}.html')
    except:
        return send_from_directory('front-end', 'pages/404.html'), 404

# Route to serve the home page
@app.route('/')
def index():
    return serve_page('home')

@app.route('/login')
def login():
    return serve_page('login')

@app.route('/register')
def register():
    return serve_page('register')

@app.route('/explanation')
def explanation():
    return serve_page('explanation')

@app.route('/predict-risk')
def predict_risk():
    return serve_page('predict-risk')

@app.route('/easy-test')
def easy_test():
    return serve_page('easy-test')

@app.route('/advance-test')
def advance_test():
    return serve_page('advance-test')

@app.route('/results')
def results():
    return serve_page('results')

@app.route('/report')
def report():
    return serve_page('report')

@app.route('/health-insights')
def health_insights():
    return serve_page('health-insights')

@app.route('/user-profile')
def user_profile():
    return serve_page('user-profile')

@app.route('/settings')
def settings():
    return serve_page('settings')

# Route to serve static files (CSS, JS, Images, Templates)
@app.route('/<path:path>')
def static_files(path):
    # First try to serve from the root static folder
    try:
        return send_from_directory('front-end', path)
    except:
        pass
    
    # Then try to serve from the pages directory
    try:
        return send_from_directory('front-end/pages', path)
    except:
        pass
    
    # Then try to serve from the templates directory
    try:
        return send_from_directory('front-end/templates', path)
    except:
        pass
    
    # If file not found, return 404
    return send_from_directory('front-end', 'pages/404.html'), 404

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
    try:
        return send_from_directory('front-end/pages', '404.html'), 404
    except:
        return "Page not found", 404

# Run the Flask development server only if running locally
if __name__ == '__main__':
    app.run(debug=True)
