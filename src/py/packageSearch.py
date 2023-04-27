import os
import subprocess
# import regex

def searchPackage(package_name):
    process1 = subprocess.Popen(['npm', 'search', package_name], stdout=subprocess.PIPE)

    process2 = subprocess.Popen(['grep', f'^{package_name}\\b'], stdin=process1.stdout, stdout=subprocess.PIPE)
    process1.stdout.close()
    output = process2.communicate()[0].decode()
    print(output)

if __name__ == '__main__':
    searchPackage('nodist') #change input into user input