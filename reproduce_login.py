import requests

def test_login():
    url = "http://localhost:8000/token"
    # Test 1: Multipart (Current Frontend behavior - likely failing)
    try:
        print("Testing Multipart/Form-Data...")
        files = {'username': (None, 'admin'), 'password': (None, 'admin123')}
        response = requests.post(url, files=files)
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            print("Success!")
        else:
            print(f"Failed: {response.text}")
    except Exception as e:
        print(f"Multipart Error: {e}")

    print("-" * 20)

    # Test 2: URL Encoded (Proposed Fix)
    try:
        print("Testing URL Encoded...")
        data = {'username': 'admin', 'password': 'admin123'}
        response = requests.post(url, data=data)
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            print("Success!")
        else:
            print(f"Failed: {response.text}")
    except Exception as e:
        print(f"URL Encoded Error: {e}")

if __name__ == "__main__":
    test_login()
