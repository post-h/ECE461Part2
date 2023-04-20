import tkinter as tk

def register():
    ### Function used when user clicks register
    userName = nameEntry.get()
    password = passwordEntry.get()

    # Can save username & password to database

    featurePage(userName, password)

def logIn():
    ### Function used when user clicks Login
    userName = nameEntry.get()
    password = passwordEntry.get()

    # Can check if username & password in database

    featurePage(userName, password)

def search(packageEntry):
    ### Search user input package here
    print("search")

def reset():
    # Reset Function here
    print("reset")

def featurePage(userName, password):
    ### Function that searches packages and resets to default 
    # Can display list of available packages here?
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

### Main Page
window = tk.Tk()

### Creating widgets and design
# Setting Title
window.title('Welcome! Enter User Info to Login')
# Setting window dimension (weight x height)
window.geometry('350x250')

userName = tk.Label(window, text="User Name")
nameEntry = tk.Entry(window, width = 35)
password = tk.Label(window, text="Password")
passwordEntry = tk.Entry(window, show="*", width=35)

register_button = tk.Button(window, text="Register", command=register)
login_button = tk.Button(window, text="Login", command=logIn)

# Position of widgets
userName.grid(row=1, column=0)
nameEntry.grid(row=1, column=1)
password.grid(row=2, column=0)
passwordEntry.grid(row=2, column=1)
register_button.grid(row=3, column=0)
login_button.grid(row=3, column=1)

window.mainloop()