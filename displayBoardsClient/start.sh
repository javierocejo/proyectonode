#!/bin/bash
docker build -t javiocejo/node .
# docker run -it --rm --name testingwithbechi -v /var/www/proyectonode/app:/usr/src/myapp javiocejo/node forever -l log.txt -o out.txt -e err.txt --spinSleepTime 10000 --minUptime 5000 -c 'nodemon --exitcrash ' npm install
# docker run -it --rm --name testingwithbechi -e UID=$(id -u) -v /var/www/proyectonode/app:/usr/src/myapp javiocejo/node chown -R $UID .
docker run -it --rm --name testingwithbechi -v /var/www/proyectonode/app:/usr/src/myapp javiocejo/node forever -l log.txt -o out.txt -e err.txt --spinSleepTime 10000 --minUptime 5000 -c 'nodemon --exitcrash ' index.js
