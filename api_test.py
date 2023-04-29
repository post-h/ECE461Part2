import requests

url = 'http://127.0.0.1:5000/package/underscore'
response = requests.delete(url)

if response.status_code == 200:
    print(response.json())
else:
    print('Error:', response.status_code)
