import requests

url = 'http://127.0.0.1:5000/package/lodash'
data = {"metadata": {"Name": "string", "Version": "4.17.21", "ID": "string"},
 "data": {"Content": "string", "URL": "string", "JSProgram": "string"}}

response = requests.put(url, json=data)

if response.status_code == 200:
    print(response.json())
else:
    print('Error:', response.status_code)
