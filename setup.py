__author__ = ''


import sys
from glob import glob # glob will help us search for files based on their extension or filename.
from distutils.core import setup # distutils sends the data py2exe uses to know which file compile
import py2exe

data_files = []
setup(
    name='toeflStudy',
    console=['toefl-study.py'],

    options={
        'py2exe': {
            'packages':[],
            'dist_dir': 'toeflStudy', # The output folder
            'compressed': True, # If you want the program to be compressed to be as small as possible
            'includes':[ 'flask', 'json', 'os', 'pathlib', 'sys', 'logging'],
			'excludes':['jinja2.asyncsupport','jinja2.asyncfilters']
        }
    },

    data_files=data_files # Finally, pass the
)