var promise = require( 'bluebird' );
var EventEmitter = require( 'events' ).EventEmitter;

module.exports = room;

function room( memory, roomId ) {

	if( !( this instanceof room ) )
		return new room( memory, roomId );

	this.memory = memory;

	/**
	 * The room id. Users can use the room's id to enter this room.
	 * 
	 * @type {String}
	 */
	this.id = roomId;

	/**
	 * The current key for the room. If this value is null no key is set for the room.
	 * 
	 * The room key can be used to enter the room. It is equivalent to using a room id 
	 * but generally the key is shorter and the key should be returned at some point
	 * 
	 * @type {String}
	 */
	this.key = null;

	memory.on( roomId, function( info ) {

		this.emit( 'user', info );
	}.bind( this ));
}

var p = room.prototype = new EventEmitter();

/**
 * getKey will reserve a key for this room. This key can be shared
 * to allow other users to enter into this room.
 * 
 * @return {Promise} this promise will return the key for this room
 */
p.getKey = function() {

	if( this.key === null ) {

		return this.memory.getKey( this.id )
			   .then( function( key ) { 

			   		this.key = key; 

			   		return key;
			   }.bind( this ) );
	} else {

		return promise.resolve( this.key );
	}
};

/**
 * Return the key that this room was using. This will ensure there will be enough keys in the inn.
 * There can be way more roomid's there than can be keys. Therefore it's always good practice to
 * return a key for a room when we're finished with it.
 *
 * For example your room can have 3 guests max. Once we've reached the max room size we may want to
 * return the key back to the pool of keys.
 * 
 * @return {Promise} this promise will always succeed even if no key was made for the room
 */
p.returnKey = function() {

	if( this.key !== null )
		return this.memory.returnKey( this.id, this.key )
			   .then( function() { this.key = null; }.bind( this ) );
	else
		promise.resolve();
};

/**
 * Sets a variable on the room. All users in the room will receive an event that a variable
 * change happened.
 * 
 * @param {String} key The name of the variable you want to set
 * @param {*} value A value which will be stored for this key
 * @return {Promise} This promise will resolve and return the value passed when the value was set
 */
p.setVar = function( key, value ) {

	return this.memory.setRoomDataVar( this.id, key, value );
};

/**
 * Gets a variable set in the room. If this variable does not exist undefined will be returned.
 * 
 * @param  {String} key a string which is the variable name for a variable
 * @return {Promise} This promise will resolve once the room data has been written
 */
p.getVar = function( key ) {

	return this.memory.getRoomDataVar( this.id, key );
};

/**
 * If you want to delete a variable from the room's data.
 * 
 * @param  {String} key Key for the variable you want to delete
 * @return {Promise} A promise will be returned which will resolve once then variable is deleted the value passed was the deleted value
 */
p.deleteVar = function( key ) {

	return this.memory.delRoomDataVar( this.id, key );
};

/**
 * Set the data stored in the room. All users in the room will receive an event that room data
 * was changed.
 *
 * @param {Object} data The data used by this room.
 * @return {Promise} A promise will be returned which will resolve once the room data is set
 */
p.setRoomData = function( data ) {

	return this.memory.setRoomData( this.id, data );
};

/**
 *	Get the data stored for this room as an Object.
 * 
 * @return {Promise} A promise which will return room data.
 */
p.getRoomData = function() {

	return this.memory.getRoomData( this.id );
};

/**
 * Get users currently in the room.
 * 
 * @return {Promise} A promise when it resolves returns an array of users
 */
p.getUsers = function() {

	return this.memory.getUsers( this.id );
};