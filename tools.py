#! /usr/bin/python
from flask import jsonify
import json
import logging
from yaml import load


class Tool(object):

    allowed_extensions = ['mp3']

    def __init__(self):
        self.music_folder = self.get('music_folder')

    @staticmethod
    def ok(message, data=None):
        """Return formated Ok json response"""
        response = {
            'message': message,
            'success': True
        }
        if data is not None:
            response['data'] = data
        return jsonify(response)

    @staticmethod
    def ko(message):
        """Return formated Ko json response"""
        return jsonify({
            'message': message,
            'success': False
        })

    @staticmethod
    def get(configuration_key=None, filename='main'):

        configuration_filepath = 'etc/{}.yaml'.format(filename)

        with open(configuration_filepath) as f:
            configuration = load(f.read())
        return configuration.get(configuration_key, None)

    @staticmethod
    def log(message):
        """
        Print system message to log file

        :param message: text message to log.
        """
        logging.info(message)
        if Tool.level == 'DEBUG':
            print (message)

    @staticmethod
    def debug(message):
        """
        Print or dump messages to log file and std out when debug mode

        :param message: message / data to log.
        """
        if isinstance(message, dict) or isinstance(message, list):
            message = json.dumps(message, indent=4)
        logging.debug(message)
        if Tool.level == 'DEBUG':
            print (message)

    @staticmethod
    def yesno(question):
        """
        Return a boolean depending on user input

        :param question: is the text prompted to the user
        """
        response = ''
        while response.lower() not in ['y', 'n']:
            response = raw_input('{} [y/n]'.format(question))
        return {'y': True, 'n': False}[response]


Tool.level = Tool.get('level')

logging.basicConfig(
    level=Tool.level,
    filename=Tool.get('logfile'),
    format='%(asctime)s %(name)s %(levelname)s %(message)s'
)
