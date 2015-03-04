var chai = require('chai');
var expect = chai.expect;
var Room = require('../../app/src/room.js');

describe("Rooms", function() {

  var room;

  before(function() {
    room = new Room();
  });

  it("should add a person to the room", function() {
    room.addPerson('Jake');
    expect(room.people.shift()).to.equal('Jake');
  });

});