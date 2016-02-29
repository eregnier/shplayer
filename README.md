
Self Hosting Player
===================

This project is a simple self hosting web play for music files.

It is simple because:
 - it is easy to install
 - it is easy to use

General information
===================

This is a python project on server side. Once setup, the frontend web application is based on angular js framework.

Features
========

- Web music player
- Self hosted
- File system based library structure
- Music search engine (optional, default enabled)
- Covers
- Lightweight


Options
=======

Project configuration is managed through the etc/main.yaml file.

This file contains the following options:

level: Debug level for log verbosity and debug behavior of the application
logfile: path to the log file on the system
port: listen port when running directly with flask (debug purpose)
music_database: path to the search database that have to be denerated via the manager.py file
search_limit: number of results in the search engine (UI)
use_fuzzy: Use a search engine with fuzzy implementation, more powerfull but may be not efficient on large music collections
use_match: Use a simple comparison filter on the music collection. Support search on large music sets
music_folder: Path to the music folder that the web UI will allow to browse
title: The application html title page

Security
========

Authentication is done on my side thanks to my webserver Basic auth mechanism that provide simple system authentication method.
This can be done on majors webservers like apache, nginx or lightppd. A lot of documentation is available for this purpose.

Maybe in the future, a simple auth system module may be implemented.

Requirements
============

Python >= 2.7
pip (apt-get install python-pip)

Installation
============

The recomanded way to install this project is to use a python virtual environment. This allow to keep this project isolated from your system general installation.


Install virtual env on your system:

``sudo pip install virtualenv``

Then create a folder where will live this project. This can be the git repository of this project:

``cd /home/<user>``
``git clone git@github.com:eregnier/shplayer.git``

Go to the newly created folder

``cd shplayer``

``virtualenv .``

Now that you have a ready python isolated environment, set this environment up:

``source bin/activate``

you are in the shplayer virtualenv.

Install python dependencies

``pip install -r requirements.txt``

This will install this projects python dependencies within the virtualenv

Change the path where your music are located on your file system by editing the etc/main.yaml. You may put a path where many symlinks feed your whole music collection.

If you activated the fuzzy search feature (in configuration file), you should run the manager.py script that will generate a data file from your music folder. If your music folder structure evolve, you may have to run again the manager to update the music database. when the script has finished running, the server restart is required to take care of database changes

Then the server is ready to run

``python server.py``

This will make the application listen on the port 5000 that is now reachable from your browser.

For production mode, I recomand using gunicorn (that is listed in the python requirements). you also may want to use a frontal webserver such as nginx that provide basic authentication system. You can run the server like so with gunicorn when the virtualenv is ready.

Live demo
=========

http://demoshplayer.utopland.net


Licence
=======

MIT
