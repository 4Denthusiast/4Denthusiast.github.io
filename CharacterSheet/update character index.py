#! /usr/bin/python

import os

def indexFolder(path):
    index = open(path + "/index.txt", "w")
    contents = os.listdir(path)
    for file in contents:
        if file == "index.txt":
            continue
        newPath = path + "/" + file
        if os.path.isdir(newPath):
            index.write("directory "+file+"\n")
            indexFolder(newPath)
        else:
            index.write("character "+file+"\n")
    index.close()

indexFolder("./characters")
