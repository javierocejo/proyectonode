#!/bin/bash
docker build -t javiocejo/node .
docker run -it --rm --name testingwithbechi javiocejo/node
