import requests
import json

# Test login endpoint
url = 'http://127.0.0.1:5000/api/login'
data = {
    'email': 'alice@example.com',
    'password': 'password123'
}

print("Testing login API...")
print(f"URL: {url}")
print(f"Data: {json.dumps(data, indent=2)}\n")

try:
    response = requests.post(url, json=data)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    print(f"\nCookies: {response.cookies}")
except requests.exceptions.ConnectionError:
    print("ERROR: Could not connect to Flask server.")
    print("Make sure Flask is running on http://127.0.0.1:5000")
except Exception as e:
    print(f"ERROR: {e}")
