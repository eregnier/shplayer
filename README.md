
Self Hosting Player
===================

This project is a simple self hosting web play for music files.

It is simple because:
 - it is easy to install
 - it is easy to use

General information
===================

This is a python project on server side. Once setup, the frontend web application is based on angular js framework.

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

Then the server is ready to run

``python server.py``

This will make the application listen on the port 5000 that is now reachable from your browser.

For production mode, I recomand using gunicorn (that is listed in the python requirements). you also may want to use a frontal webserver such as nginx that provide basic authentication system.

Live demo
=========

http://demoshplayer.utopland.net


Licence: MIT
------------
