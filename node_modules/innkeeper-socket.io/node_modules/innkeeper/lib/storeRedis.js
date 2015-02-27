var promise = require( 'bluebird' );

var curId = Number.MIN_VALUE, 
	idToKey = {},
	keyToId = {},
	roomData = {},
	roomUsers = {},
	keys;

module.exports = storeRedis;

/**
 * storeRedis is used to store data in a Redis DB. This is used for very fast
 * room management on clustered servers. Or servers which have been horizontally scaled.
 *
 * @param {Redis} redis A redis client which will be used for communication ( redis == require('redis') )
 * @return {storeRedis} An new instance of storeRedis
 */
function storeRedis( redis ) {

	if( !( this instanceof storeRedis ) )
		return new storeRedis( redis );

	this.redis = redis;

	this.generateKeys();
}

storeRedis.prototype = {

	/**
	 * This will create a roomID, roomDataObject, and users array for the room
	 * 
	 * @return {Promise} This promise will return a room id once the room is created
	 */
	createRoom: function( userID ) {

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
	},

	joinRoom: function( userID, roomID ) {

		if( roomUsers[ roomID ] === undefined ) {

			return promise.reject( 'No room with the id: ' + roomID );
		} else {

			if( roomUsers[ roomID ].indexOf( userID ) != -1 ) {

				return promise.reject( 'User is already in room' );
			} else {

				roomUsers[ roomID ].push( userID );

				return promise.resolve( roomID );	
			}
		}
	},

	/**
	 * Remove a user from a room
	 * 
	 * @param  {String} userID an id for the user whose leaving
	 * @param  {String} roomID an id for the room the user is leaving
	 * @return {Promise} When this promise resolves it will send the number of users in the room
	 */
	leaveRoom: function( userID, roomID ) {

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

				return promise.resolve( userCount );
			} else {

				return promise.reject( 'User ' + userID + ' is not in the room: ' + roomID );
			}
		}
	},

	/**
	 * get a key which can be used to enter a room vs entering room via
	 * roomID
	 * 
	 * @param  {String} roomID id of the room you'd like a key for
	 * @return {Promise} A promise will be returned which will return a roomKey on success
	 */
	getKey: function( roomID ) {

		if( keys.length > 0 ) {

			var randIdx = Math.round( Math.random() * ( keys.length - 1 ) ),
				key = keys.splice( randIdx, 1 )[ 0 ];

			keyToId[ key ] = roomID;
			idToKey[ roomID ] = key;

			return promise.resolve( key );
		} else {

			return promise.reject( 'Run out of keys' );
		}
	},

	/**
	 * return a room key so someone else can use it.
	 * 
	 * @param  {String} roomID id of the room you'll be returning a key for
	 * @param  {String} key the key you'd like to return
	 * @return {Promise} This promise will succeed when the room key was returned
	 */
	returnKey: function( roomID, key ) {

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
	},

	/**
	 * return the room id for the given key
	 * 
	 * @param  {String} key key used to enter the room
	 * @return {Promise} This promise will succeed with the room id and fail if no room id exists for key
	 */
	getRoomIdForKey: function( key ) {

		var savedRoomId = keyToId[ key ];

		if( savedRoomId ) {

			return promise.resolve( savedRoomId );
		} else {

			return promise.reject();
		}
	},

	/**
	 * set a variable on the rooms data object
	 * 
	 * @param {String} roomID id for the room whose 
	 * @param {String} key variable name/key that you want to set
	 * @param {*} value Value you'd like to set for the variable
	 * @return {Promise} once this promise succeeds the rooms variable will be set
	 */
	setRoomDataVar: function( roomID, key, value ) {

		if( roomData[ roomID ] === undefined )
			roomData[ roomID ] = {};

		roomData[ roomID ][ key ] = value;

		return promise.resolve( value );
	},

	/**
	 * get a variable from the rooms data object
	 * 
	 * @param {String} roomID id for the room
	 * @param {String} key variable name/key that you want to get
	 * @return {Promise} once this promise succeeds it will return the variable value it will fail if the variable does not exist
	 */
	getRoomDataVar: function( roomID, key ) {

		if( roomData[ roomID ] === undefined ) {

			return promise.reject( 'There is no room by that id' );
		} else {

			return promise.resolve( roomData[ roomID ][ key ] );
		}
	},

	/**
	 * delete a variable from the rooms data object
	 * 
	 * @param {String} roomID id for the room 
	 * @param {String} key variable name/key that you want to delete
	 * @return {Promise} once this promise succeeds it will return the value that was stored before delete
	 */
	delRoomDataVar: function( roomID, key ) {

		var oldVal;

		if( roomData[ roomID ] === undefined ) {

			return promise.reject( 'There is no room by that id' );
		} else {

			oldVal = roomData[ roomID ][ key ];

			delete roomData[ roomID ][ key ];

			return promise.resolve( oldVal );
		}
	},

	/**
	 * Receive the data stored for a room.
	 * 
	 * @param  {String} roomID id for the room you'd like data for
	 * @return {Promise} This promise will succeed when data is received for the room
	 */
	getRoomData: function( roomID ) {

		if( roomData[ roomID ] )
			return promise.resolve( roomData[ roomID ] );
		else
			return promise.reject( 'No room data' );
	},

	/**
	 * Set data stored for a room.
	 * 
	 * @param  {String} roomID id for the room you'd like to set data for
	 * @return {Promise} This promise will succeed when data is set for the room
	 */
	setRoomData: function( roomID, data ) {

		roomData[ roomID ] = data;

		return promise.resolve( data );
	},

	/**
	 * generateKeys is a function which will create and store a set of 
	 * keys which can be used to enter a room instead of a room id
	 */
	generateKeys: function() {

		if( !keys ) {

			keys = [];

			for( var i = 0; i < 9999; i++ ) {

				keys.push( i );
			}
		}
	}
};