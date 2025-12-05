import requests

try:
    response = requests.post("http://localhost:8000/users/register", json={"username": "testuser", "password": "testpassword"})
    print(response.status_code)
    print(response.text)
except Exception as e:
    print(e)
