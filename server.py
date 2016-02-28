# coding: utf-8
from flask import Flask, render_template, send_from_directory
from os.path import isdir, isfile
from os import listdir
from tools import Tool
from fuzzywuzzy import process

app = Flask(__name__)
tool = Tool()

with open(tool.get('music_database')) as f:
    fuzzy_choices = f.read().strip().split('\n')

search_limit = tool.get('search_limit')

@app.route('/static/<path:path>', methods=['GET'])
def serve_static(path):
        return send_from_directory('static', path)


@app.route('/', methods=['GET'])
def index():
    return render_template('home.html')

@app.route('/configuration', methods=['GET'])
def configuration():
    configuration = {
        'use_fuzzy': tool.get('use_fuzzy')
    }
    return tool.ok('Configuration', data=configuration)


@app.route('/search/<token>', methods=['GET'])
def search(token):
    return Tool.ok(
        'Search complete',
        data=process.extract(
            token, fuzzy_choices, limit=search_limit
        )
    )

@app.route('/covers/', methods=['GET'])
@app.route('/covers/<path:path>', methods=['GET'])
def covers(path=''):

    absolute_path = u'{0}/{1}'.format(tool.music_folder, path)
    covers = []
    if isdir(absolute_path):
        file_list = listdir(absolute_path)
        for file_path in file_list:
            ext = file_path.lower()
            if ext.endswith('jpg') or ext.endswith('png'):
                covers.append(u'{0}/{1}'.format(path, file_path))
    return tool.ok('Cover results', data=covers)

@app.route('/music', methods=['GET'])
@app.route('/music/<path:path>', methods=['GET'])
def music(path=''):

    absolute_path = u'{0}/{1}'.format(tool.music_folder, path)
    if isdir(absolute_path):

        info = {
            'folders': [],
            'files': []
        }

        for path in listdir(absolute_path):
            try:
                full_path = u'{0}/{1}'.format(absolute_path, path)
                if isdir(full_path) and not path.startswith('.'):
                    info['folders'].append(path)
                elif isfile(full_path) and full_path.lower().endswith('.mp3'):
                    info['files'].append(path)
            except Exception as e:
                pass
                tool.debug(u'Invalid folder {0}'.format(e))

        info['folders'].sort()
        info['files'].sort()

        return Tool.ok('Folder found !', data=info)

    else:
        return Tool.ko('Not a music folder')


@app.route('/file/<path:path>', methods=['GET'])
def file(path):

    absolute_path = u'{0}/{1}'.format(tool.music_folder, path)

    if isfile(absolute_path):
        return send_from_directory(tool.music_folder, path)
    return Tool.ko('Not a valid song path')

if __name__ == "__main__":
    app.run(debug=Tool.level == 'DEBUG', host='0.0.0.0', port=Tool.get('port'))
