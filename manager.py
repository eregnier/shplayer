from os import popen
from tools import Tool

def fuzzygen():

	popen('cd "{0}";find . -name "*.mp3" > {1}'.format(
		Tool.get('music_folder'),
		Tool.get('music_database'),
	))

fuzzygen()
