'use strict';
var q = require('q');
var winston = require('winston');
var _ = require('lodash');
var mockupData = require('./dispalyboards.mock');
var faker = require('faker');

var moment = require('moment');
var mssql = require('mssql');
var url = require('url');

function DisplayBoardsCtrl(app) {
  if (!(this instanceof DisplayBoardsCtrl)) {
    return new DisplayBoardsCtrl(app);
  }
  this.dbConn = app.get('dbConn');
}

// TODO implement the methods below using a database connection

DisplayBoardsCtrl.prototype.create = function create(displayboard) {
  //department.id = faker.random.number();
  //return q.resolve(department);

var request = this.dbConn.request();
  var query = 'INSERT INTO display_boards ' +
    '(display_board_id, hostname, name, last_seen_at, url, display_board_status_id) ' +
    'VALUES (@username, @startedUtc, null);';
  request.input('username', mssql.VarChar, username);
  request.input('startedUtc', mssql.DateTime2, moment.utc().toISOString());
  return request.query(query).then(function(data) {
    return data[0];
  }).catch(function(err) {
    err.query = query;
    return q.reject(err);
  });

};

DisplayBoardsCtrl.prototype.getMany = function getMany() {
  var request = this.dbConn.request();
  var query = 'SELECT * FROM display_boards;';
  return request.query(query)
    .then(function(data){
      return q.resolve(data);
    })
    .catch(function(err) {
      err.query = query;
      return q.reject(err);
    });
};

DisplayBoardsCtrl.prototype.getOne = function getOne(id) {
  var request = this.dbConn.request();
  var query = 'SELECT * FROM display_board_id WHERE diplay_board_id = '+id+';';
  return request.query(query)
    .then(function(data){
      return q.resolve(data);
    })
    .catch(function(err) {
      err.query = query;
      return q.reject(err);
    });
};

DisplayBoardsCtrl.prototype.getByName = function getOne(name) {
  var request = this.dbConn.request();
  var query = 'SELECT * FROM display_board_id WHERE name = '+name+';';
  return request.query(query)
    .then(function(data){
      return q.resolve(data);
    })
    .catch(function(err) {
      err.query = query;
      return q.reject(err);
    });
};

DisplayBoardsCtrl.prototype.update = function update(id,newData) {
  var request = this.dbConn.request();
  var query = 'UPDATE display_boards ' +
    'SET hostname = '+newData+' ' +
    'WHERE display_board_id = id;';
  return request.query(query).catch(function(err) {
    err.query = query;
    return q.reject(err);
  });
};

DisplayBoardsCtrl.prototype.delete = function delete(id) {
  var request = this.dbConn.request();
  var query = 'DELETE FROM display_boards ' +
    'WHERE display_board_id = '+id+';';
  return request.query(query).catch(function(err) {
    err.query = query;
    return q.reject(err);
  });

module.exports = DisplayBoardsCtrl;
