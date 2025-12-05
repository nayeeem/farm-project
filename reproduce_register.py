import requests

BASE_URL = "http://localhost:8000"

def test_register_and_login():
    print("Testing Registration...")
    username = "new_test_user"
    password = "testpassword123"
    
    # 1. Register
    reg_url = f"{BASE_URL}/users/register"
    reg_data = {
        "username": username,
        "password": password
    }
    # Note: frontend sends {username, password}, implying role/is_active are optional or handled by backend
    
    try:
        response = requests.post(reg_url, json=reg_data)
        if response.status_code == 200:
            print("Registration Success!")
            print(response.json())
        elif response.status_code == 400 and "already registered" in response.text:
             print("User already exists, proceeding to login...")
        else:
            print(f"Registration Failed: {response.status_code} - {response.text}")
            return
    except Exception as e:
        print(f"Registration Error: {e}")
        return

    print("-" * 20)

    # 2. Login
    print("Testing Login with new user...")
    login_url = f"{BASE_URL}/token"
    login_data = {
        "username": username,
        "password": password
    }
    
    try:
        response = requests.post(login_url, data=login_data)
        if response.status_code == 200:
            print("Login Success!")
            print(f"Token: {response.json().get('access_token')[:20]}...")
        else:
            print(f"Login Failed: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"Login Error: {e}")

if __name__ == "__main__":
    test_register_and_login()
