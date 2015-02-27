var promise = require( 'bluebird' );
var EventEmitter = require( 'events').EventEmitter;

var curId = Number.MIN_VALUE, 
	idToKey = {},
	keyToId = {},
	roomData = {},
	roomUsers = {},
	keys;

module.exports = storeMemory;

/**
 * storeMemory is used to store data in memory on one process. This is not ideal
 * for clustered servers as each process may have different data. Use another
 * memory store if your server is clustered however use this memory store just
 * to get up and running fast or if your server is not clustered.
 * 
 * @return {storeMemory} An new instance of storeMemory
 */
function storeMemory() {

	if( !( this instanceof storeMemory ) )
		return new storeMemory();

	EventEmitter.call( this );

	this.generateKeys();
}

var p = storeMemory.prototype = Object.create( EventEmitter.prototype );

/**
 * This will create a roomID, roomDataObject, and users array for the room
 * 
 * @return {Promise} This promise will return a room id once the room is created
 */
p.createRoom = function( userID ) {

	var id = curId;

	curId++;

	if( curId == Number.MAX_VALUE )
		curId = Number.MIN_VALUE;

	roomUsers[ id ] = [];

	return this.setRoomData( id, {} )
		   .then( this.joinRoom.bind( this, userID, id ) )
		   .then( function() {

		   		return id;
		   });
};

/**
 * Join an existing room
 * 
 * @param  {String} userID an id for the user whose joining
 * @param  {String} roomID an id for the room the user is joing
 * @return {Promise} A promise which will resolve and return a roomID
 */
p.joinRoom = function( userID, roomID ) {

	if( roomUsers[ roomID ] === undefined ) {

		return promise.reject( 'No room with the id: ' + roomID );
	} else {

		if( roomUsers[ roomID ].indexOf( userID ) != -1 ) {

			return promise.reject( 'User is already in room' );
		} else {

			roomUsers[ roomID ].push( userID );

			this.emit( roomID, {

				action: 'join',
				user: userID,
				users: roomUsers[ roomID ]
			});

			return promise.resolve( roomID );	
		}
	}
};

/**
 * Remove a user from a room
 * 
 * @param  {String} userID an id for the user whose leaving
 * @param  {String} roomID an id for the room the user is leaving
 * @return {Promise} When this promise resolves it will send the number of users in the room
 */
p.leaveRoom = function( userID, roomID ) {

	var userCount;

	if( roomUsers[ roomID ] === undefined ) {

		return promise.reject( 'No room with the id: ' + roomID );
	} else {

		var userIDX = roomUsers[ roomID ].indexOf( userID );

		if( userIDX != -1 ) {

			roomUsers[ roomID ].splice( userIDX, 1 );

			userCount = roomUsers[ roomID ].length;

			if( userCount == 0 ) {

				delete roomUsers[ roomID ];
			}

			this.emit( roomID, {

				action: 'leave',
				user: userID,
				users: roomUsers[ roomID ]
			});

			return promise.resolve( userCount );
		} else {

			return promise.reject( 'User ' + userID + ' is not in the room: ' + roomID );
		}
	}
};

/**
 * Get all users for a room
 * 
 * @param  {String} roomID room id where to retrieve users
 * @return {Promise} A promise is returned which will return all users in a room
 */
p.getUsers = function( roomID ) {

	var setName = 'roomUsers:' + roomID;

	return promise.resolve( roomUsers[ roomID ] );
};

/**
 * get a key which can be used to enter a room vs entering room via
 * roomID
 * 
 * @param  {String} roomID id of the room you'd like a key for
 * @return {Promise} A promise will be returned which will return a roomKey on success
 */
p.getKey = function( roomID ) {

	if( keys.length > 0 ) {

		var randIdx = Math.round( Math.random() * ( keys.length - 1 ) ),
			key = keys.splice( randIdx, 1 )[ 0 ];

		keyToId[ key ] = roomID;
		idToKey[ roomID ] = key;

		return promise.resolve( key );
	} else {

		return promise.reject( 'Run out of keys' );
	}
};

/**
 * return a room key so someone else can use it.
 * 
 * @param  {String} roomID id of the room you'll be returning a key for
 * @param  {String} key the key you'd like to return
 * @return {Promise} This promise will succeed when the room key was returned
 */
p.returnKey = function( roomID, key ) {

	return this.getRoomIdForKey( key )
	.then( function( savedRoomId ) {

		if( savedRoomId == roomID ) {

			delete idToKey[ roomID ];
			delete keyToId[ key ];

			keys.push( key );

			return promise.resolve();
		} else {

			return promise.reject( 'roomID and roomID for key do not match' );
		}
	});
};

/**
 * return the room id for the given key
 * 
 * @param  {String} key key used to enter the room
 * @return {Promise} This promise will succeed with the room id and fail if no room id exists for key
 */
p.getRoomIdForKey = function( key ) {

	var savedRoomId = keyToId[ key ];

	if( savedRoomId ) {

		return promise.resolve( savedRoomId );
	} else {

		return promise.reject();
	}
};

/**
 * set a variable on the rooms data object
 * 
 * @param {String} roomID id for the room whose 
 * @param {String} key variable name/key that you want to set
 * @param {*} value Value you'd like to set for the variable
 * @return {Promise} once this promise succeeds the rooms variable will be set
 */
p.setRoomDataVar = function( roomID, key, value ) {

	if( roomData[ roomID ] === undefined )
		roomData[ roomID ] = {};

	roomData[ roomID ][ key ] = value;

	return promise.resolve( value );
};

/**
 * get a variable from the rooms data object
 * 
 * @param {String} roomID id for the room
 * @param {String} key variable name/key that you want to get
 * @return {Promise} once this promise succeeds it will return the variable value it will fail if the variable does not exist
 */
p.getRoomDataVar = function( roomID, key ) {

	if( roomData[ roomID ] === undefined ) {

		return promise.reject( 'There is no room by that id' );
	} else {

		return promise.resolve( roomData[ roomID ][ key ] );
	}
};

/**
 * delete a variable from the rooms data object
 * 
 * @param {String} roomID id for the room 
 * @param {String} key variable name/key that you want to delete
 * @return {Promise} once this promise succeeds it will return the value that was stored before delete
 */
p.delRoomDataVar = function( roomID, key ) {

	var oldVal;

	if( roomData[ roomID ] === undefined ) {

		return promise.reject( 'There is no room by that id' );
	} else {

		oldVal = roomData[ roomID ][ key ];

		delete roomData[ roomID ][ key ];

		return promise.resolve( oldVal );
	}
};

/**
 * Receive the data stored for a room.
 * 
 * @param  {String} roomID id for the room you'd like data for
 * @return {Promise} This promise will succeed when data is received for the room
 */
p.getRoomData = function( roomID ) {

	if( roomData[ roomID ] )
		return promise.resolve( roomData[ roomID ] );
	else
		return promise.reject( 'No room data' );
};

/**
 * Set data stored for a room.
 * 
 * @param  {String} roomID id for the room you'd like to set data for
 * @return {Promise} This promise will succeed when data is set for the room
 */
p.setRoomData = function( roomID, data ) {

	roomData[ roomID ] = data;

	return promise.resolve( data );
};

/**
 * generateKeys is a function which will create and store a set of 
 * keys which can be used to enter a room instead of a room id
 */
p.generateKeys = function() {

	if( !keys ) {

		keys = [];

		for( var i = 0; i < 9999; i++ ) {

			keys.push( i );
		}
	}
};