import requests

url = 'http://127.0.0.1:5000/packages'
data = [
  {
    "Version": "Exact (1.2.3)\nBounded range (1.2.3-2.1.0)\nCarat (^1.2.3)\nTilde (~1.2.0)",
    "Name": "string"
  }
]
# data = {"URL": "https://github.com/lodash/lodash"}

response = requests.post(url, json=data)

if response.status_code == 200:
    print(response.json())
else:
    print('Error:', response.status_code)
