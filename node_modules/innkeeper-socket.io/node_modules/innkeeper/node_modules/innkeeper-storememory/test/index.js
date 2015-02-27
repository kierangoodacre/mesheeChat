var test = require( 'tape' ),
	promise = require( 'bluebird' ),
	storeMemory = require( './..' );

var USER_ID = 0, OTHER_USER_ID = 1,
	store, roomId, key;

test( 'create a room', function( t ) {

	t.plan( 2 );

	store = storeMemory();

	t.ok( store, 'A store was created' );

	store.createRoom( USER_ID )
	.then( function( id ) {

		roomId = id;
		t.ok( roomId, 'Created a room' );
	});
});

test( 'joining a room', function( t ) {

	t.plan( 5 );

	var gotInfo = false;

	store.on( roomId, function( info ) {

		gotInfo = true;

		t.equal( info.action, 'join', 'action was correct' );
		t.equal( info.user, OTHER_USER_ID, 'user was correct' );
		t.ok( info.users.indexOf( USER_ID ) > -1, 'user 1 was found in users' );
		t.ok( info.users.indexOf( OTHER_USER_ID ) > -1, 'user 2 was found in users' );

		store.removeAllListeners();
	});

	store.joinRoom( OTHER_USER_ID, roomId )
	.then( function() {

		t.ok( gotInfo, 'received event before promise resolved' );
	});
});

test( 'leaving a room', function( t ) {

	t.plan( 5 );

	var gotInfo = false;

	store.on( roomId, function( info ) {

		gotInfo = true;

		t.equal( info.action, 'leave', 'action was correct' );
		t.equal( info.user, OTHER_USER_ID, 'user was correct' );
		t.ok( info.users.indexOf( USER_ID ) > -1, 'user 1 was found in users' );
		t.ok( info.users.indexOf( OTHER_USER_ID ) == -1, 'user 2 was not found in users' );

		store.removeAllListeners();
	});

	store.leaveRoom( OTHER_USER_ID, roomId )
	.then( function() {

		t.ok( gotInfo, 'received event before promise resolved' );
	});
});

test( 'room keys', function( t ) {

	t.plan( 5 );

	var testGood = function() {

		return store.getKey( roomId )
		.then( function( k ) {

			key = k;

			t.ok( key, 'Received a key' );

			return key;
		}, function() {

			t.fail( 'Didn\'t receive a key' );
			t.end();
		})
		.then( function( key ) {

			return store.getRoomIdForKey( key );
		})
		.then( function( id ) {

			t.equal( roomId, id, 'Key returned correct roomId' );

			return id;
		}, function() {

			t.fail( 'Failed getting roomId from key' );
		})
		.then( function() {

			return store.returnKey( roomId, key );

		})
		.then( function() {

			t.pass( 'Returned the key' );
		}, function() {

			t.fail( 'Wasn\'t able to return key' );
			t.end();
		})
		.catch( function( err ) {

			t.fail( err.message );
			t.end();
		});
	};

	var testBad = function() {

		store.getRoomIdForKey( key )
		.then( function() {

			t.fail( 'Key was not returned properly' );

			// attempt to return the key again
			return store.returnKey( key );
		}, function() {

			t.pass( 'Key was returned properly' );

			// attempt to return the key again
			return store.returnKey( key );
		})
		.then( function() {

			t.fail( 'Returned key that didn\'t exist' );
		}, function() {

			t.pass( 'Handled returning failing key properly' );
		});
	};

	testGood()
	.then( testBad );
});

test( 'room get set variables', function( t ) {

	t.plan( 4 );

	var testVarName = 'testVar',
		testVarValue = 'had by the snake';

	// test getting a variable for a room that doesn't exist
	store.getRoomDataVar( 'roomiddoesntexist' )
	.then( function() {

		t.fail( 'Passed back a variable for a room that did\'t exist' );
	}, function() {

		t.pass( 'Did\'t resolve because room didn\'t exist' );
	});

	// test getting a variable that doesn't exist
	store.getRoomDataVar( roomId, 'variableDoesntExist' )
	.then( function( value ) {

		t.equal( value, undefined, 'undefined variable is undefined' );
	});

	// test setting a variable
	store.setRoomDataVar( roomId, testVarName, testVarValue )
	.then( function( value ) {

		t.equal( value, testVarValue, 'variable passed and set match' );		
	})
	.then( function() {

		return store.delRoomDataVar( roomId, testVarName );
	})
	.then( function( value ) {

		t.equal( value, testVarValue, 'deleted variable value did match' );
	}, function() {

		t.fail( 'Could not delete room variable' );
	});
});

test( 'room get set data object', function( t ) {

	t.plan( 9 );

	// test getting data for room that doesnt exist
	store.getRoomData( 'room doesnt exist' )
	.then( function() {

		t.fail( 'Returned a data object for a room that doesnt exist' );
	}, function() {

		t.pass( 'Failed while getting data for a room that doesnt exist' );
	});

	store.getRoomData( roomId )
	.then( function( roomData ) {

		t.ok( roomData, 'returned room data' );
		t.equal( Object.keys( roomData ).length, 0, 'returned room data for empty object' );
	}, function() {

		t.fail( 'no empty room data was returned' );
		t.end();
	})
	.then( function() {

		return store.setRoomData( roomId, { snake: 333 } );
	})
	.then( function( roomData ) {

		t.ok( roomData, 'received room data' );
		t.equal( Object.keys( roomData ).length, 1, 'room data only has one prop after write' );
		t.equal( roomData.snake, 333, 'room data variable was correct value' );
	}, function() {

		t.fail( 'didn\'t set room data' );
		t.end();
	})
	.then( function() {

		return store.getRoomData( roomId );
	})
	.then( function( roomData ) {

		t.ok( roomData, 'received room data from get' );
		t.equal( Object.keys( roomData ).length, 1, 'room data only has one prop after write from get' );
		t.equal( roomData.snake, 333, 'room data variable was correct value from get' );
	}, function() {

		t.fail( 'didn\'t get room data from get' );
		t.end();
	})
});