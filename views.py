from flask import Flask, request, redirect, render_template, send_from_directory
from validate_email import validate_email

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('register.html')

@app.route('/register', methods=['POST'])
def register():
    email = request.form['email']
    password = request.form['password']

    print(email, password)

    # # Validate the email address
    # if not validate_email(email):
    #     return "Invalid email address"

    # Register the user to the database
    # ...

    # Redirect to a new page
    return render_template('searchBar.html')

if __name__ == '__main__':
    app.run(debug=True)