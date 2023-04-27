import tkinter as tk
import sqlite3
### Key for pages:
### window  = main page
### featurePage = page after login/register
### 

window = tk.Tk()

def close_main():
    ### Closing main page
    window.withdraw()

def register():
    ### Function used when user clicks register
    userName = nameEntry.get()
    password = passwordEntry.get()
    
    # Can save username & password to database?
    # conn = sqlite3.connect('database.db')
    # cursor = conn.cursor()
    # cursor.execute("INSERT INTO users (username, password) VALUES (?, ?)", (userName, password))
    # conn.commit()
    # conn.close()

    message_label.config(text="User registered successfully")
    window.after(2000, lambda: featurePage(userName, password)) # delays page change

def logIn():
    ### Function used when user clicks Login
    userName = nameEntry.get()
    password = passwordEntry.get()

    # Can check if username & password in database?
    # conn = sqlite3.connect('database.db')
    # cursor = conn.cursor()
    # cursor.execute("SELECT * FROM users WHERE username=? AND password=?", (userName, password))
    # result = cursor.fetchone()
    # conn.close()

    # if result is None:
    #     message_label.config(text="Incorrect username or password.")
    # else:
    #     message_label.config(text="Login successful")
    #     window.after(2000, lambda: featurePage(userName, password))

def search(packageEntry):
    ### Search user input package here
    print("search")

def reset():
    # Reset Function here
    # conn = sqlite3.connect('database.db')
    # cursor = conn.cursor()
    # cursor.execute("DROP TABLE IF EXISTS users")
    # cursor.execute("CREATE TABLE users (username TEXT, password TEXT)")
    # cursor.execute("INSERT INTO users VALUES ('user1', 'password1')")
    # cursor.execute("INSERT INTO users VALUES ('user2', 'password2')")
    # conn.commit()
    # conn.close()
    print("reset")

def featurePage(userName, password):
    ### Function that searches packages and resets to default 
    # Can display list of available packages here?
    close_main()

    feature_window = tk.Toplevel()
    feature_window.title("Access Features")
    feature_window.geometry('350x250')
    
    packageName = tk.Label(feature_window, text="Package Name")
    packageEntry = tk.Entry(feature_window, width = 35)
    search_button = tk.Button(feature_window, text="Search", command=lambda:search(packageEntry.get()))
    reset_button = tk.Button(feature_window, text="Reset", command=reset)

    packageName.grid(row=1, column=0)
    packageEntry.grid(row=1, column=1)
    search_button.grid(row=2, column=0)
    reset_button.grid(row=2, column=1)
    feature_window.mainloop()


### Creating widgets and design
# Setting Title
window.title('Welcome!')
# Setting window dimension (weight x height)
window.geometry('350x250')

userName = tk.Label(window, text="User Name")
nameEntry = tk.Entry(window, width = 35)
password = tk.Label(window, text="Password")
passwordEntry = tk.Entry(window, show="*", width=35)

register_button = tk.Button(window, text="Register", command=register)
login_button = tk.Button(window, text="Login", command=logIn)

message_label = tk.Label(window)

# Position of widgets
userName.grid(row=1, column=0)
nameEntry.grid(row=1, column=1)
password.grid(row=2, column=0)
passwordEntry.grid(row=2, column=1)
register_button.grid(row=3, column=0)
login_button.grid(row=3, column=1)
message_label.grid(row=4, column=1)

window.mainloop()
