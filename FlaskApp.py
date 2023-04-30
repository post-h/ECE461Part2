from flask import Flask, request, redirect, render_template, send_from_directory, session, json, jsonify, abort
# from validate_email import validate_email
import sqlite3
import secrets
import re
from flask_httpauth import HTTPTokenAuth
import jwt
import datetime
import requests
import base64
import subprocess

app = Flask(__name__)
app.secret_key = '4gPM<+8;Nwe7ayZ_'
auth = HTTPTokenAuth(scheme='Bearer')

@app.route('/')
def index():
    return render_template('login.html')

@app.route('/templates/register.html')
def routeRegister():
    return redirect('/register')

@app.route('/templates/login.html')
def routeLogin():
    return redirect('/login')

@app.route('/login', methods=['GET', 'POST'])
def login():

    conn = sqlite3.connect('./data/users.db')
    c = conn.cursor()

    c.execute('''CREATE TABLE IF NOT EXISTS Users
            (name TEXT, isAdmin BOOL, password TEXT)''')
    
    if request.method == 'POST':
        username = request.form['email']
        password = request.form['password']

        c.execute("SELECT password FROM Users WHERE name=?", (username,))
        result = c.fetchone()

        if result and result[0] == password:
            session['username'] = username
            token = secrets.token_hex(32)
            session['token'] = token
            conn.commit()
            conn.close()
            redirect('/search')
            return jsonify({'token': token})
        else:
            error = 'Invalid username or password'
            conn.commit()
            conn.close()
            abort(401)
    else:
        conn.commit()
        conn.close()
        return render_template('login.html')

@app.errorhandler(401)
def invalidCredential(error):
    return render_template('login.html', error_message='Incorrect password, please try again.')

@app.route('/register', methods=['GET', 'POST'])
def register():

    conn = sqlite3.connect('./data/users.db')
    c = conn.cursor()

    c.execute('''CREATE TABLE IF NOT EXISTS Users
            (name TEXT, isAdmin BOOL, password TEXT)''')

    if request.method == 'POST':
        username = request.form['email']
        password = request.form['password']

        conn = sqlite3.connect('./data/users.db')
        cursor = conn.cursor()

        cursor.execute('SELECT name FROM Users WHERE name = ?', (username,))
        existing_user = cursor.fetchone()

        if existing_user is not None:
            error_message = 'Existing account found, please log in.'
            conn.commit()
            conn.close()
            return render_template('login.html', error_message=error_message)
        else:
            cursor.execute("INSERT INTO Users (name, isAdmin, password) VALUEs (?, ?, ?)", (username, False, password))
            session['username'] = username
            conn.commit()
            conn.close()
            return redirect('/search') 

    else:
        conn.commit()
        conn.close()  
        return render_template('register.html')
        

@app.route('/search')
def search():
    render_template('searchBar.html')
    if 'username' in session:
        return 'Welcome, ' + session['username'] + '!'
    else:
        error_message = 'You must be logged in to access this page.'
        return render_template('login.html', error_message=error_message)

@app.route('/packages', methods=['POST'])
def getPackages():
    pattern = r'\((.*?)\)'
    data = json.loads(request.data)
    print(data)
    versions = data['Version']
    versions = re.findall(pattern, versions)
    
    conn = sqlite3.connect('./data/modules.db')
    c = conn.cursor()

    c.execute('SELECT * FROM modules WHERE Version IN ({seq})'.format(seq=','.join(['?']*len(versions))), versions)
    modules = c.fetchall()

    results = []
    for module in modules:
        results.append({"Version": module[1], "Name": module[0], "ID": module[2]})

    return json.dumps(results)

@app.route('/package/<id>', methods=['GET', 'PUT', 'DELETE'])
def returnPackage(id):
    conn = sqlite3.connect('./data/modules.db')
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM modules WHERE ID = ?', (id,))
    module = cursor.fetchone()

    if request.method == 'GET':
        if module is None:
            abort(404)
        url = module[3]
        owner = url.split('/')[3]
        repo = url.split('/')[4]

        response = requests.get(f'https://api.github.com/repos/{owner}/{repo}/releases/latest')
        
        zip_url = response.json()['zipball_url']
        
        response_zip = requests.get(zip_url)
        encoded_package_data = response.content
        base64_data = base64.b64encode(encoded_package_data)
        data_string = base64_data.decode('utf-8')
        return data_string

    elif request.method == 'DELETE':
        if module is not None:
            if id in module:
                cursor.execute('DELETE FROM modules WHERE ID = ?', (id,)) 
                conn.commit()
                conn.close()
                data = {'message': 'Success, package deleted!'}
                return jsonify(data), 200
            else:
                abort(404)
        else:
            abort(400)
    
    elif request.method == 'PUT':
        if module is not None:
            if id in module:
                data = request.get_json()
                version = data['metadata']['Version']
                cursor.execute('UPDATE modules SET Version = ? WHERE ID = ?', (version, id,))
                conn.commit()
                conn.close()
                subprocess.run(['npm', 'install', f"{id}@{version}"])
                retMessage ={'message': 'Success, package updated!'}
                return jsonify(retMessage), 200
            else:
                return jsonify({'error': 'Invalid credentials, try again.'}), 400
        else:
            return jsonify({'error': 'Package does not exist'}), 404
    
        
## AUTHENTICATION IS A BITCH AND I HATE CLASSES
@app.route('/authenticate', methods=['PUT'])
def strReturn():
    return 501
#     user = request.json['User']
#     secret = request.json['Secret']
#     correct_user = 'ece30861defaultadminuser'
#     correct_password = "correcthorsebatterystaple123(!__+@**(A'\"`;DROP TABLE packages;"
#     print(user['isAdmin'])
#     if ((user['name'] == correct_user) and user['isAdmin'] and (secret['password'] == correct_password)):
#         # print('hi')
#         payload = { 
#             "sub": correct_user,
#             "exp": datetime.datetime.utcnow() + datetime.timedelta(days=1)
#         }
#         jwt_obj = jwt.JWT()
#         jwt_token = jwt_obj.encode(payload, self.secret_key)
#         return jsonify({'token': jwt_token.decode('utf-8')})
#     else:
#         return jsonify({'error': 'Invalid credentials'}), 401


if __name__ == '__main__':
    app.run(debug=True)