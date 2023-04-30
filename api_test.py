import requests

url = 'http://127.0.0.1:5000/package'
data = {"URL": "https://github.com/lodash/lodash"}

response = requests.post(url, json=data)

if response.status_code == 200:
    print(response.json())
else:
    print('Error:', response.status_code)
