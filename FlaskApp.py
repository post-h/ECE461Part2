from flask import Flask, request, redirect, render_template, send_from_directory, session, jsonify, abort
from validate_email import validate_email
import sqlite3
import secrets

app = Flask(__name__)
app.secret_key = '4gPM<+8;Nwe7ayZ_'

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
        
if __name__ == '__main__':
    app.run(debug=True)