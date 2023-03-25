import os
import subprocess

## readline sampke text for len # libes
## call below 
# FILEIN = open('sample.txt', 'r')
subprocess.run(['./run', 'sample.txt'])

with open('outputIngestible.txt') as f:
    info = f.readlines()

info = [i.strip('\n') for i in info]
owners = [i.split()[0] for i in info]
repos = [i.split()[1] for i in info]
ingestibility = [int(i.split()[2]) for i in info]
print(info)
subprocess.run(['rm', 'outputIngestible.txt'])

idx = 0
for idx in range(len(info)):
    
    if (ingestibility[idx] == -1) :
        print('Sorry,', repos[idx], 'was determined to be not ingestible. Try another repo.')
    elif (ingestibility[idx] == 0):
        ## do something
        print('Congrats,', repos[idx], 'was determined to be ingestible. Downloading now.')
    else:
        print("Error slay! :P")
        print(ingestibility[idx])