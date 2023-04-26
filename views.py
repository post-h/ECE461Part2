from flask import Flask, request, redirect, render_template, send_from_directory, session

from validate_email import validate_email
import sqlite3

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

    conn = sqlite3.connect('users.db')
    c = conn.cursor()

    c.execute('''CREATE TABLE IF NOT EXISTS User
            (name TEXT, isAdmin BOOL, password TEXT)''')
    
    if request.method == 'POST':
        username = request.form['email']
        password = request.form['password']

        c.execute("SELECT password FROM User WHERE name=?", (username,))
        result = c.fetchone()

        if result and result[0] == password:
            session['username'] = username
            conn.commit()
            conn.close()
            return redirect('/search')
        else:
            error = 'Invalid username or password'
            conn.commit()
            conn.close()
            return render_template('login.html', error=error)
    else:
        conn.commit()
        conn.close()
        return render_template('login.html')


@app.route('/register', methods=['GET', 'POST'])
def register():

    conn = sqlite3.connect('users.db')
    c = conn.cursor()

    c.execute('''CREATE TABLE IF NOT EXISTS User
            (name TEXT, isAdmin BOOL, password TEXT)''')

    if request.method == 'POST':
        username = request.form['email']
        password = request.form['password']

        conn = sqlite3.connect('users.db')
        cursor = conn.cursor()

        cursor.execute('SELECT name FROM User WHERE name = ?', (username,))
        existing_user = cursor.fetchone()

        if existing_user is not None:
            error_message = 'Existing account found, please log in.'
            conn.commit()
            conn.close()
            return render_template('login.html', error_message=error_message)
        else:
            cursor.execute("INSERT INTO User (name, isAdmin, password) VALUEs (?, ?, ?)", (username, False, password))
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
    if 'username' in session:
        return 'Welcome, ' + session['username'] + '!'
    else:
        error_message = 'You must be logged in to access this page.'
        return render_template('login.html', error_message=error_message)
        
if __name__ == '__main__':
    app.run(debug=True)