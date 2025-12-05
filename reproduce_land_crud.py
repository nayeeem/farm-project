import requests
import time

BASE_URL = "http://localhost:8000"
TOKEN = None

def login():
    global TOKEN
    try:
        data = {'username': 'admin', 'password': 'admin123'}
        # Assuming our previous fix works, this should use x-www-form-urlencoded
        response = requests.post(f"{BASE_URL}/token", data=data)
        if response.status_code == 200:
            TOKEN = response.json()['access_token']
            print("Login Successful")
            return True
        else:
            print(f"Login Failed: {response.text}")
            return False
    except Exception as e:
        print(f"Login Error: {e}")
        return False

def get_headers():
    return {'Authorization': f'Bearer {TOKEN}'}

def test_lands():
    if not login(): return

    print("\n--- Testing Create Land ---")
    land_data = {
        "name": "Test Land 1",
        "location": "North Sector",
        "size": 50.5,
        "soil_type": "Loam",
        "tax_amount": 100.0,
        "farmer_id": None
    }
    
    land_id = None
    try:
        response = requests.post(f"{BASE_URL}/lands/", json=land_data, headers=get_headers())
        if response.status_code == 200:
            print("Create Land Success")
            print(response.json())
            land_id = response.json()['id']
        else:
            print(f"Create Land Failed: {response.text}")
            return
    except Exception as e:
        print(f"Create Land Error: {e}")
        return

    print("\n--- Testing Read Lands ---")
    try:
        response = requests.get(f"{BASE_URL}/lands/", headers=get_headers())
        if response.status_code == 200:
            lands = response.json()
            print(f"Read Lands Success. Total lands: {len(lands)}")
            found = any(l['id'] == land_id for l in lands)
            print(f"Newly created land found in list: {found}")
        else:
            print(f"Read Lands Failed: {response.text}")
    except Exception as e:
        print(f"Read Lands Error: {e}")

    print("\n--- Testing Update Land ---")
    update_data = {
        "name": "Updated Land 1",
        "size": 60.0
    }
    try:
        response = requests.put(f"{BASE_URL}/lands/{land_id}", json=update_data, headers=get_headers())
        if response.status_code == 200:
            print("Update Land Success")
            print(response.json())
        else:
            print(f"Update Land Failed: {response.text}")
    except Exception as e:
        print(f"Update Land Error: {e}")

    print("\n--- Testing Delete Land ---")
    try:
        response = requests.delete(f"{BASE_URL}/lands/{land_id}", headers=get_headers())
        if response.status_code == 200:
            print("Delete Land Success")
        else:
            print(f"Delete Land Failed: {response.text}")
    except Exception as e:
        print(f"Delete Land Error: {e}")

    # Verify deletion
    try:
        response = requests.get(f"{BASE_URL}/lands/{land_id}", headers=get_headers())
        if response.status_code == 404:
            print("Verification: Land successfully deleted (404 Not Found)")
        else:
            print(f"Verification Failed: Status {response.status_code}")
    except Exception as e:
        print(f"Verification Error: {e}")

if __name__ == "__main__":
    test_lands()
