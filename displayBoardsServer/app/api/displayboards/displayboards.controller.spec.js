'use strict';
var should = require('should');
var faker = require('faker');
var DepartmentsController = require('./departments.controller');
var department = { name: faker.name.findName() };
var app = null;

function create() {
  it('Creates Department', function(done) {
    DepartmentsController.create(department)
      .then(function(newDepartmentRow) {
        newDepartmentRow.should.have.property('id');
        department = newDepartmentRow;
        done();
      })
      .catch(done);
  });
}

function getMany() {
  it('Get many Departments', function(done) {
    DepartmentsController.getMany()
      .then(function(rows) {
        rows.length.should.be.above(0);
        done();
      })
      .catch(done);
  });
}

function getOne() {
  it('Get a single Department', function(done) {
    DepartmentsController.getOne(1)
      .then(function(row) {
        row.should.have.property('id');
        row.should.have.property('name');
        done();
      })
      .catch(done);
  });
}

function update() {
  it('Updates a single Department', function(done) {
    var data = {
      name: 'UPDATED '+faker.name.findName()
    };

    DepartmentsController.update(1,data)
      .then(function(){
        done();
      })
      .catch(done);
  });
}

function remove() {
  it('Removes a Department', function(done) {
    DepartmentsController.remove(1)
      .then(function(){
        done();
      })
      .catch(done);
  });
}

function testSuite() {
  before(function(done) {
    require('../../index.js')
      .then(function(result) {
        app = result;
        DepartmentsController = new DepartmentsController(app);
        done();
      })
      .catch(done);
  });

  describe('create',create);
  describe('getMany',getMany);
  describe('getOne', getOne);
  describe('update', update);
  describe('remove', remove);
}

describe('Departments Controller', testSuite);
