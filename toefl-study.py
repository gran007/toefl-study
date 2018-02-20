#-*- coding: utf-8 -*-
from flask import Flask, request
from lib import fileManager as fm
import json
import sys
import os
import logging
log = logging.getLogger('werkzeug')
log.setLevel(logging.ERROR)

app = Flask(__name__,
            static_url_path='',
            static_folder='static')

def find_data_file(filename):
    if getattr(sys, 'frozen', False):
        datadir = os.path.dirname(sys.executable)
    else:
        datadir = os.path.dirname(__file__)

    return os.path.join(datadir, filename)

@app.route('/')
def getIndex():
    return app.send_static_file('index.html')

@app.route('/voca')
def getVoca():
    return app.send_static_file('voca.html')

@app.route('/writingFileList')
def getFileList():
    return json.dumps(fm.readTextFileList(find_data_file('texts')), ensure_ascii=False)

@app.route('/vocaFileList')
def getVocaFileList():
    return json.dumps(fm.readTextFileList(find_data_file('voca')), ensure_ascii=False)

@app.route('/readFile', methods=['POST'])
def getReadFile():
    data = json.loads(request.data.decode('utf-8'))
    return json.dumps(fm.readTextFile(data['filePath']), ensure_ascii=False)

if __name__ == '__main__':
    if len(sys.argv) == 1:
        print("please input port number")
        sys.exit()
    print(sys.argv[0]+':'+sys.argv[1])
    if not sys.argv[1].isdigit():
        print("error please check if it is number of not")
        sys.exit()

    port = sys.argv[1]
    app.run(debug=True, host='0.0.0.0', port=int(port), use_reloader=False, threaded=True)