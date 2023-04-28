import requests

url = 'http://127.0.0.1:5000/authenticate'
data = {"User": {"name": "ece30861defaultadminuser", "isAdmin": True}, "Secret": {"password": "correcthorsebatterystaple123(!__+@**(A'\"`;DROP TABLE packages;"}}
response = requests.put(url, json=data)

if response.status_code == 200:
    print(response.json())
else:
    print('Error:', response.status_code)
