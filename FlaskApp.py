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
import zipfile

app = Flask(__name__)
app.secret_key = '4gPM<+8;Nwe7ayZ_'
auth = HTTPTokenAuth(scheme='Bearer')


@app.route('/')
def index():
    return render_template('login.html')


@app.route('/templates/home.html')
def reroute():
    return redirect('/')


@app.route('/packages', methods=['POST'])
def getPackages():
    pattern = r'\((.*?)\)'
    data = json.loads(request.data)
    versions = data[0]['Version']
    versions = re.findall(pattern, versions)

    conn = sqlite3.connect('./data/modules.db')
    c = conn.cursor()

    c.execute('SELECT * FROM modules WHERE Version IN ({seq})'.format(
        seq=','.join(['?']*len(versions))), versions)
    modules = c.fetchall()

    results = []
    if (len(modules) < 30):
        if modules is not None:
            for module in modules:
                results.append(
                    {"Version": module[1], "Name": module[0], "ID": module[2]})

            data = json.dumps(results)
            # return jsonify(data).json
            if request.headers.get('Accept') == 'application/json':
                return jsonify(data).json, 200
            else:
                return render_template('success.html', content=jsonify({'message': 'To search for packages, please make the appropriate request via API calls.'}).json)

            # return render_template('success.html', results=jsonify(data).json), 200
            # if module not in modules:
            #     return jsonify({'error': 'Invalid credentials, try again.'}), 400
        else:
            if request.headers.get('Accept') == 'application/json':
                return jsonify({'error': 'Invalid credentials, try again.'}), 400
            else:
                return render_template('error.html', content=jsonify({'error': 'Invalid credentials, try again.'}).json)
            # return render_template('error.html', jsonify({'error': 'Invalid credentials, try again.'})), 400
    else:
        # return render_template('error.html', jsonify({'error': 'Too many packages, try again.'})), 413
        if request.headers.get('Accept') == 'application/json':
            return jsonify({'error': 'Too many packages, try again.'}), 413
        else:
            return render_template('error.html', content='Too many packages, try again.')


@app.route('/reset', methods=['DELETE'])
def reset():
    conn = sqlite3.connect('./data/modules.db')
    c = conn.cursor()

    c.execute('DELETE FROM modules')
    c.execute('DELETE FROM ratings')
    conn.commit()
    conn.close()
    # return render_template('success.html', jsonify({'message': 'Success, registry reset.'})), 200
    if request.headers.get('Accept') == 'application/json':
        return jsonify({'message': 'Success, registry reset.'}), 200
    else:
        return render_template('success.html', content='Success, registry reset.')

####################################################################################################################################
# NOTE2SELF:
# come back to render requests
####################################################################################################################################


@app.route('/package/<id>', methods=['GET', 'PUT', 'DELETE'])
def returnPackage(id):
    conn = sqlite3.connect('./data/modules.db')
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM modules WHERE ID = ?', (id,))
    module = cursor.fetchone()

    if request.method == 'GET':
        if module is None:
            # return render_template('error.html', content=jsonify({'error': 'Package does not exist, try again.'})), 404
            if request.headers.get('Accept') == 'application/json':
                return jsonify({'error': 'Package does not exist, try again.'}), 404
            else:
                return render_template('error.html', content='Package does not exist, try again.')
        url = module[3]
        owner = url.split('/')[3]
        repo = url.split('/')[4]
        cursor.execute('SELECT Version FROM modules where ID = ?', (repo,))
        version = cursor.fetchone()[0]

        response = requests.get(
            f'https://api.github.com/repos/{owner}/{repo}/releases/latest')
        if response is None:
            if request.headers.get('Accept') == 'application/json':
                return jsonify({'error': 'Invalid credentials, try again'}), 400
            else:
                return render_template('error.html', jsonify({'error': 'Invalid credentials, try again'})), 400

        zip_url = response.json()['zipball_url']
        response_zip = requests.get(zip_url)
        encoded_package_data = response.content
        base64_data = base64.b64encode(encoded_package_data)
        data_string = base64_data.decode('utf-8')
        response_return = {"metadata": {"Name": repo.capitalize(), "Version": version, "ID": repo}, "data": {"Content": data_string}}
        if request.headers.get('Accept') == 'application/json':
            return jsonify(response_return), 200
        else:
            return render_template('success.html', content='Success. Package found')

    elif request.method == 'DELETE':
        if module is not None:
            if id in module:
                cursor.execute('DELETE FROM modules WHERE ID = ?', (id,))
                conn.commit()
                conn.close()
                if request.headers.get('Accept') == 'application/json':
                    return jsonify({'message': 'Success, registry reset.'}), 200
                else:
                    return render_template('success.html', content=jsonify({'message': 'Success, registry reset.'}).json)
                # return render_template('success.html', jsonify({'message': 'Success, package deleted!'})), 200
            else:
                # return render_template('error.html', jsonify({'error': 'Invalid credentials, try again.'})), 404
                if request.headers.get('Accept') == 'application/json':
                    return jsonify({'error': 'Invalid credentials, try again.'}), 404
                else:
                    return render_template('error.html', content=jsonify({'error': 'Invalid credentials, try again.'}).json)
        else:
            # return render_template('error.html', jsonify({'error': 'Package does not exist, try again.'})), 400
            if request.headers.get('Accept') == 'application/json':
                return jsonify({'error': 'Package does not exist, try again.'}), 400
            else:
                return render_template('error.html', content=jsonify({'error': 'Package does not exist, try again.'}).json)

    elif request.method == 'PUT':
        if module is not None:
            if id in module:
                data = request.get_json()
                version = data['metadata']['Version']
                cursor.execute(
                    'UPDATE modules SET Version = ? WHERE ID = ?', (version, id,))
                conn.commit()
                conn.close()
                subprocess.run(['npm', 'install', f"{id}@{version}"])
                retMessage = {'message': 'Success, package updated!'}
                # return render_template('success.html', jsonify(retMessage)), 200
                if request.headers.get('Accept') == 'application/json':
                    return jsonify(retMessage), 200
                else:
                    return render_template('success.html', content=jsonify(retMessage).json)
            else:
                # return render_template('error.html', jsonify({'error': 'Invalid credentials, try again.'})), 400
                if request.headers.get('Accept') == 'application/json':
                    return jsonify({'error': 'Invalid credentials, try again.'}), 400
                else:
                    return render_template('error.html', content=jsonify({'error': 'Invalid credentials, try again.'}).json)
        else:
            # return render_template('error.html', jsonify({'error': 'Package does not exist'})), 404
            if request.headers.get('Accept') == 'application/json':
                return jsonify({'error': 'Package does not exist, try again.'}), 404
            else:
                return render_template('error.html', content=jsonify({'error': 'Package does not exist, try again.'}).json)


@app.route('/package', methods=['POST'])
def packageUpload():

    if request.method == 'POST':
        data = request.get_json()
        if 'Content' in data and 'URL' in data:
            # return render_template('package.html', jsonify({'error': 'Invalid entry, both content and url cannot be set, try again.'})), 400
            if request.headers.get('Accept') == 'application/json':
                return jsonify({'error': 'Invalid entry, both content and url cannot be set, try again.'}), 400
            else:
                return render_template('error.html', content=jsonify({'error': 'Invalid entry, both content and url cannot be set, try again.'}).json)
        elif 'URL' in data:
            url = data['URL']
            owner = url.split('/')[3]
            repo = url.split('/')[4]

            conn = sqlite3.connect('./data/modules.db')
            c = conn.cursor()
            c.execute('SELECT * FROM ratings where ID = ?', (repo,))
            repo_info = c.fetchone()

            if repo_info is not None:
                # return render_template('error.html', jsonify({'error': 'Package already exists, try again.'})), 409
                if request.headers.get('Accept') == 'application/json':
                    return jsonify({'error': 'Package already exists, try again.'}), 409
                else:
                    return render_template('error.html', content=jsonify({'error': 'Package already exists, try again.'}).json)
                # abort(409) # Package exists

            with open('url.txt', 'w') as fp:
                fp.write(url)

            subprocess.run(['./run', './url.txt'])

            c.execute('SELECT * FROM ratings where ID = ?', (repo,))
            repo_info = c.fetchone()
            c.execute('SELECT Version FROM modules where ID = ?', (repo,))
            version = c.fetchone()[0]

            for idx, score in enumerate(repo_info):
                if idx > 0 and score < 0.5:
                    # abort(424)
                    # return render_template('package.html', jsonify({'error': 'Package not uploaded due to disqualifying rating. Try a different package.'})), 424
                    if request.headers.get('Accept') == 'application/json':
                        return jsonify({'error': 'Package not uploaded due to disqualifying rating. Try a different package.'}), 424
                    else:
                        return render_template('error.html', content=jsonify({'error': 'Package not uploaded due to disqualifying rating. Try a different package.'}).json)
            response = requests.get(
                f'https://api.github.com/repos/{owner}/{repo}/releases/latest')
            if response is None:
                # return jsonify({'error': 'Invalid credentials, try again'}), 400
                if request.headers.get('Accept') == 'application/json':
                    return jsonify({'error': 'Invalid credentials, try again.'}), 400
                else:
                    return render_template('error.html', content=jsonify({'error': 'Invalid credentials, try again.'}).json)

            response = requests.get(
                f'https://api.github.com/repos/{owner}/{repo}/releases/latest')

            zip_url = response.json()['zipball_url']
            response_zip = requests.get(zip_url)
            encoded_package_data = response.content
            base64_data = base64.b64encode(encoded_package_data)
            data_string = base64_data.decode('utf-8')
            response_return = {"metadata": {"Name": repo.capitalize(), "Version": version, "ID": repo}, "data": {"Content": data_string}}
            return json.loads(response_return), 201
        elif 'Content' in data:
            # Get the base64-encoded zip file from the request
            data = request.data
            zip_file_b64 = data['Content']

            # Decode the base64-encoded zip file
            zip_file_bytes = base64.b64decode(zip_file_b64)

            # Read the contents of package.json from the zip file
            with zipfile.ZipFile(zip_file_bytes) as zip_file:
                package_json_bytes = zip_file.read('package.json')
                package_json_str = package_json_bytes.decode('utf-8')

            # Extract the value of the 'url' field from package.json
            package_json = json.loads(package_json_str)
            if 'repository' in package_json:
                url = package_json['repository']['url']
                owner = url.split('/')[3]
                repo = url.split('/')[4]

                with open('url.txt', 'w') as fp:
                    fp.write(url)

                subprocess.run(['node', 'main.ts', 'url.txt'])
                conn = sqlite3.connect('./data/modules.db')
                c = conn.cursor()
                c.execute('SELECT * FROM modules where ID = ?', (repo,))
                repo_info = c.fetchall()
                response_data = {
                    {"metadata": {"Name": repo_info[0], "Version": repo_info[1], "ID": repo_info[2]}}}
                subprocess.run(['npm', 'install', repo])
                # return jsonify(response_data), 201
                if request.headers.get('Accept') == 'application/json':
                    return jsonify(response_data), 201
                else:
                    # CHECK DIS
                    return render_template('success.html', content=jsonify({'message': 'Successful package upload.'}).json)
                # WHAT IS THE INDENTATION EVERYTHING KEEPS GETTING MOVED IM CONFUSED THIS IS IN CAPS SO I DONT GET SIDE TRACKED AND FORGET
                # response = requests.get(f'https://api.github.com/repos/{owner}/{repo}/releases/latest')
            else:
                # abort(400)
                if request.headers.get('Accept') == 'application/json':
                    return jsonify({'error': 'Invalid credentials, try again.'}), 400
                else:
                    return render_template('error.html', content=jsonify({'error': 'Invalid credentials, try again.'}).json)


@app.route('/package/<id>/rate', methods=['GET'])
def packageRating(id):
    conn = sqlite3.connect('./data/modules.db')
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM ratings where ID = ?', (id,))
    query_response = cursor.fetchall()
    unrounded = query_response[0][1:]
    ratings = [round(f, 2) for f in unrounded]

    if request.method == 'GET':
        if ratings is not None:
            if (len(ratings) == 8):
                for rating in ratings:
                    results = {"BusFactor": ratings[0], "Correctness": ratings[1], "RampUp": ratings[2],
                               "ResponsiveMaintainer": ratings[3], "LicenseScore": ratings[4], "GoodPinningPractice": ratings[5],
                               "PullRequest": ratings[6], "NetScore": ratings[7]}
                    # return json.dumps(results), 200
                    if request.headers.get('Accept') == 'application/json':
                        return jsonify(results), 200
                    else:
                        # bruh idk (note2self)
                        return render_template('success.html', content=jsonify({'message': 'Successful ratings request.'}).json)
            else:
                # return jsonify({'error': 'The package rating system choked on at least one of the metrics.'}), 500
                if request.headers.get('Accept') == 'application/json':
                    return jsonify({'error': 'Package rating system choked on at least one metric, try again.'}), 500
                else:
                    return render_template('error.html', content=jsonify({'error': 'Package system choked on at least one metric, try again.'}).json)
        else:
            # return jsonify({'error': 'Package does not exist.'}), 404
            if request.headers.get('Accept') == 'application/json':
                return jsonify({'error': 'Package does not exist.'}), 404
            else:
                return render_template('error.html', content=jsonify({'error': 'Package does not exist.'}).json)


# @app.route('/login', methods=['GET', 'POST'])
# def login():

#     conn = sqlite3.connect('./data/users.db')
#     c = conn.cursor()

#     c.execute('''CREATE TABLE IF NOT EXISTS Users
#             (name TEXT, isAdmin BOOL, password TEXT)''')

#     if request.method == 'POST':
#         username = request.form['email']
#         password = request.form['password']

#         c.execute("SELECT password FROM Users WHERE name=?", (username,))
#         result = c.fetchone()

#         if result and result[0] == password:
#             session['username'] = username
#             token = secrets.token_hex(32)
#             session['token'] = token
#             conn.commit()
#             conn.close()
#             redirect('/search')
#             return jsonify({'token': token})
#         else:
#             error = 'Invalid username or password'
#             conn.commit()
#             conn.close()
#             abort(401)
#     else:
#         conn.commit()
#         conn.close()
#         return render_template('login.html')

# # @app.errorhandler(401)
# # def invalidCredential(error):
# #     return render_template('login.html', error_message='Incorrect password, please try again.')


# @app.route('/register', methods=['GET', 'POST'])
# def register():

#     conn = sqlite3.connect('./data/users.db')
#     c = conn.cursor()

#     c.execute('''CREATE TABLE IF NOT EXISTS Users
#             (name TEXT, isAdmin BOOL, password TEXT)''')

#     if request.method == 'POST':
#         username = request.form['email']
#         password = request.form['password']

#         conn = sqlite3.connect('./data/users.db')
#         cursor = conn.cursor()

#         cursor.execute('SELECT name FROM Users WHERE name = ?', (username,))
#         existing_user = cursor.fetchone()

#         if existing_user is not None:
#             error_message = 'Existing account found, please log in.'
#             conn.commit()
#             conn.close()
#             return render_template('login.html', error_message=error_message)
#         else:
#             cursor.execute(
#                 "INSERT INTO Users (name, isAdmin, password) VALUEs (?, ?, ?)", (username, False, password))
#             session['username'] = username
#             conn.commit()
#             conn.close()
#             return redirect('/search')

#     else:
#         conn.commit()
#         conn.close()
#         return render_template('register.html')


# @app.route('/search')
# def search():
#     render_template('searchBar.html')
#     if 'username' in session:
#         return 'Welcome, ' + session['username'] + '!'
#     else:
#         error_message = 'You must be logged in to access this page.'
#         return render_template('login.html', error_message=error_message)



@app.route('/authenticate', methods=['PUT'])
def strReturn():
    abort(501)
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
