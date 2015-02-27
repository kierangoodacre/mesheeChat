var test = require( 'tape' ),
		innkeeper = require( './..' ),
		Room = require( '../lib/room' );

var ID_1 = 'id1',
	ID_2 = 'id2',
	ID_3 = 'id3',
	keeper, room, key;

test( 'reserving room', function( t ) {

	t.plan( 2 );

	keeper = innkeeper();

	t.ok( keeper, 'keeper was created' );

	keeper.reserve( ID_1 )
	.then( function( createdRoom ) {

		room = createdRoom;

		t.ok( room instanceof Room, 'received a room' );
	});
});

test( 'leaving room', function( t ) {

	t.plan( 3 );

	room.on( 'user', function( info ) {

		room.removeAllListeners( 'user' );

		t.equal( info.action, 'leave', 'action was correct' );
		t.equal( info.user, ID_1, 'user was correct' );
	});

	keeper.leave( ID_1, room.id )
	.then( function( room ) {

		t.equal( room, null, 'User left room and no one is in room' );
	});
});

test( 'create another room', function( t ) {

	t.plan( 1 );

	keeper.reserve( ID_1 )
	.then( function( createdRoom ) {

		room = createdRoom;

		t.ok( room instanceof Room, 'received a room' );
	});
});

test( 'creating a key for a room', function( t ) {

	t.plan( 1 );

	room.getKey()
	.then( function( createdKey ) {

		key = createdKey;

		t.ok( key, 'received a key to enter the room' );
	}, function() {

		t.fail( 'didnt receive key to enter room' );
	});
});

test( 'entering room with an id', function( t ) {

	t.plan( 6 );

	room.on( 'user', function( info ) {

		room.removeAllListeners( 'user' );

		t.equal( info.action, 'join', 'action was correct' );
		t.equal( info.user, ID_2, 'user was correct' );
		t.ok( info.users.indexOf( ID_1 ) > -1, 'ID_1 was in room' );
		t.ok( info.users.indexOf( ID_2 ) > -1, 'ID_2 was in room' );
	});

	keeper.enter( ID_2, room.id )
	.then( function( joinedRoom ) {

		t.ok( room === joinedRoom, 'Joined the same room' );
	}, function( message ) {

		t.fail( 'unable join existing room: ' + room.id + ' ' + message );
	});


	keeper.enter( ID_1, room.id )
	.then( function( joinedRoom ) {

		t.fail( 'was able to join room twice with id' );
	}, function( message ) {

		t.pass( 'was not able to join room twice with id' );
	});
});

test( 'entering room with a key', function( t ) {

	t.plan( 2 );

	keeper.enterWithKey( ID_3, key )
	.then( function( joinedRoom ) {

		t.ok( room === joinedRoom, 'Joined the same room' );
	}, function( message ) {

		t.fail( 'Failed entering with key: ' + key + ' ' + message );
	});

	keeper.enterWithKey( ID_1, key )
	.then( function( joinedRoom ) {

		t.fail( 'was able to join room twice with key' );
	}, function( message ) {

		t.pass( 'was not able to join room twice with key' );
	});
});