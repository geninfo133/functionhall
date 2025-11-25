import requests
import json

# Create a session to persist cookies
session = requests.Session()

print("=" * 60)
print("TEST 1: Login")
print("=" * 60)

# Test login
login_url = 'http://127.0.0.1:5000/api/login'
login_data = {
    'email': 'alice@example.com',
    'password': 'password123'
}

response = session.post(login_url, json=login_data)
print(f"Status Code: {response.status_code}")
print(f"Response: {json.dumps(response.json(), indent=2)}")
print(f"Cookies: {session.cookies.get_dict()}")

print("\n" + "=" * 60)
print("TEST 2: Check Authentication")
print("=" * 60)

# Check if authenticated
check_url = 'http://127.0.0.1:5000/api/check-auth'
response = session.get(check_url)
print(f"Status Code: {response.status_code}")
print(f"Response: {json.dumps(response.json(), indent=2)}")

print("\n" + "=" * 60)
print("TEST 3: Get Profile")
print("=" * 60)

# Get profile
profile_url = 'http://127.0.0.1:5000/api/profile'
response = session.get(profile_url)
print(f"Status Code: {response.status_code}")
print(f"Response: {json.dumps(response.json(), indent=2)}")

print("\n" + "=" * 60)
print("TEST 4: Get My Bookings")
print("=" * 60)

# Get bookings
bookings_url = 'http://127.0.0.1:5000/api/my-bookings'
response = session.get(bookings_url)
print(f"Status Code: {response.status_code}")
print(f"Response: {json.dumps(response.json(), indent=2)}")
