#-*- coding: utf-8 -*-
import os
import pathlib

def readTextFileList(path):
    list = []

    for p in pathlib.Path(path).iterdir():
        if p.is_dir():
            sublist = readTextFileList(path+'/'+p.name)
            folderName = p.name#.deocde('ecu-kr')
            list.append({'name':str(folderName), 'type':'folder', 'subList': sublist})
        elif p.is_file() and p.suffix == '.txt':
            fileName = p.name#.deocde('ecu-kr')
            fileName = os.path.splitext(fileName)[0]
            filePath = p.__str__().decode('euc-kr').encode('utf-8');
            obj = {'path':filePath, 'name':str(fileName), 'type':'file'}
            list.append(obj)
    return list

def readTextFile(filePath):
    textList = []
    with open(filePath, 'rb') as file:
        tempList = file.readlines()
        for text in tempList:
            text = text.decode('euc-kr')
            textList.append(text)
    return textList