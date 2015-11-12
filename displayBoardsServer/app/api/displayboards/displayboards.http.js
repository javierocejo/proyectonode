var express = require('express');
var router = express.Router();
var DisplayBoards = require('./DisplayBoards.controller');

function getOne(req,res,next){
  DisplayBoards.getOne(req.body.id)
    .then(function(data){
      res.send(data);
    })
    .catch(function(err){
      res.status = 500;
      res.send(err);
    });
}

function getByName(req,res,next){
  DisplayBoards.getByName(req.body.name)
    .then(function(data){
      res.send(data);
    })
    .catch(function(err){
      res.status = 500;
      res.send(err);
    });
}

function getMany(req,res,next){
  DisplayBoards.getMany()
    .then(function(data){
      res.send(data);
    })
    .catch(function(err){
      res.status = 500;
      res.send(err);
    });
}

function create(req,res,next){
  var b= req.body;
  var params = { hostname: b.hostname, name: b.hostname, b.url };
  DisplayBoards.create(params)
    .then(function(department){
      res.status = 201;
      res.send(department);
    })
    .catch(function(err){
      res.status = 500;
      res.send(err);
    });
}

function update(req,res,next){
  DisplayBoards.update(req.body.id,req.body.hostname)
    .then(function(){
      res.status = 204;
      res.send();
    })
    .catch(function(err){
      res.status = 500;
      res.send(err);
    });
}

function delete(req,res,next){
  DisplayBoards.delete(req.body.id)
    .then(function(){
      res.send();
    })
    .catch(function(err){
      res.status = 500;
      res.send(err);
    });
}

module.exports = function(app){
  DisplayBoards = new DisplayBoards(app);
  router.post('/',create);
  router.get('/',getMany);
  router.get('/:id',getOne);
  router.put('/:id',update);
  router.delete('/:id',remove);
  return router;
};



/*Create a new DisplayBoardsClient:

POST /displayboards { "hostname": "display01.hospital.net", "name": "First Display" }
Edit an existing DisplayBoardsClient

PUT /displayboards/:id { "hostname": "displayxx01.hospital.net" }

Get a single display boards client

GET /displayboards/:id

Get all the display boards clients

GET /displayboards

Get all the display boards client whose name equals Cock 

GET /displayboards?name=Cock

*/