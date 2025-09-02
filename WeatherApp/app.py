from flask import Flask, request, jsonify, send_from_directory
import requests
import os

# Initialize the Flask app
# We set static_folder to '.' to serve files from the current directory
app = Flask(__name__, static_folder='.', static_url_path='')

# --- Routes ---

@app.route('/')
def index():
    """Serves the main index.html file."""
    return send_from_directory('.', 'index.html')

@app.route('/weather')
def get_weather():
    """
    This is the backend endpoint that the frontend will call.
    It takes a 'city' parameter, calls the OpenWeatherMap API,
    and returns the weather data.
    """
    city = request.args.get('city')
    if not city:
        return jsonify({"error": "City parameter is required"}), 400

    # It's best practice to store API keys as environment variables
    # For this example, I'm using the one from your script as a fallback
    api_key = os.environ.get("OPENWEATHER_API_KEY", "626271337a7023b34164bbd07d9762b3")
    
    url = f"https://api.openweathermap.org/data/2.5/weather?q={city}&appid={api_key}&units=metric"
    
    try:
        response = requests.get(url)
        # Forward the JSON response from the weather API to our frontend
        return response.json(), response.status_code
    except requests.exceptions.RequestException as e:
        print(f"Error calling weather API: {e}")
        return jsonify({"error": "Could not connect to the weather service."}), 500

# --- Main execution ---

if __name__ == '__main__':
    # Running on 0.0.0.0 makes the app accessible from your local network
    app.run(host='0.0.0.0', port=5000, debug=True)
