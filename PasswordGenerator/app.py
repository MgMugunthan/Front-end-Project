from flask import Flask, request, jsonify, send_from_directory
import random
import string

# Initialize the Flask app
# The static_folder is set to '.' to serve files from the current directory
app = Flask(__name__, static_folder='.', static_url_path='')

# --- Routes ---

@app.route('/')
def index():
    """Serves the main index.html file to the user."""
    return send_from_directory('.', 'index.html')

@app.route('/generate-password')
def generate_password_route():
    """
    API endpoint to generate a password based on query parameters.
    This is where the core logic now lives.
    """
    try:
        # Get parameters from the request URL (e.g., ?length=12)
        length = int(request.args.get('length', 12))
        use_uppercase = request.args.get('uppercase', 'true').lower() == 'true'
        use_numbers = request.args.get('numbers', 'true').lower() == 'true'
        use_special = request.args.get('special', 'true').lower() == 'true'

        # Build the character set based on the user's choices
        characters = string.ascii_lowercase
        if use_uppercase:
            characters += string.ascii_uppercase
        if use_numbers:
            characters += string.digits
        if use_special:
            characters += string.punctuation

        if not characters:
             return jsonify({"error": "At least one character set must be selected"}), 400

        # Generate the password using Python's random module
        password = ''.join(random.choice(characters) for _ in range(length))

        # Return the generated password as a JSON response
        return jsonify({"password": password})

    except Exception as e:
        # Handle potential errors, like invalid length
        return jsonify({"error": str(e)}), 500

# --- Main execution ---

if __name__ == '__main__':
    # Run the app on host 0.0.0.0 to make it accessible on your network
    app.run(host='0.0.0.0', port=5000, debug=True)

