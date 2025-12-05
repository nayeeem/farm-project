import requests

try:
    response = requests.post("http://localhost:8000/token", data={"username": "admin", "password": "admin123"})
    print(response.status_code)
    print(response.text)
except Exception as e:
    print(e)
