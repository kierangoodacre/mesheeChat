$(document).ready(function(){
  var socket = io();
  $("#chat").hide();
  $("#name").focus();
  $("form").submit(function(event){
      event.preventDefault();
  });

  $("#join").click(function(){
    var name = $("#name").val();
    if (name !== "") {
      socket.emit("join", name);
      $("#login").detach();
      $("#chat").show();
      $("#msg").focus();
      ready = true;
    }
  });

  $("#name").keypress(function(e){
    if(e.which == 13) {
      var name = $("#name").val();
      if (name !== "") {
        socket.emit("join", name);
        ready = true;
        $("#login").detach();
        $("#chat").show();
        $("#msg").focus();
      }
    }
  });

  socket.on("update", function(msg) {
    if(ready)
      $("#msgs").append("<li>" + msg + "</li>");
  })

  socket.on("update-people", function(people){
    if(ready) {
      $("#people").empty();
      $.each(people, function(clientid, name) {
        $('#people').append("<li>" + name + "</li>");
      });
    }
  });

  socket.on("chat", function(person, msg){
    if(ready) {
      $("#msgs").append("<li><strong><span class='text-success'>" + person.name + "</span></strong> says: " + msg + "</li>");
    }
  });

  socket.on("disconnect", function(){
    $("#msgs").append("<li><strong><span class='text-warning'>The server is not available</span></strong></li>");
    $("#msg").attr("disabled", "disabled");
    $("#send").attr("disabled", "disabled");
  });

  $("#send").click(function(){
    console.log('I tried to send')
    var msg = $("#msg").val();
    socket.emit("message", msg);
    $("#msg").val("");
  });

  $("#msg").keypress(function(event){
    if(event.which == 13) {
      var msg = $("#msg").val();
      socket.emit("message", msg);
      $("#msg").val("");
    }
  });

  $('#create-room-btn').click(function() {
    var roomExists = false;
    var roomName   = $('#create-room-name').val();
    socket.emit('check', roomName, function(data) {
      roomExists = data.result;
      if(roomExists) {
        console.log('error room exists')
      } else {
        if(roomName.length > 0) {
          socket.emit('createRoom', roomName);
          $("#msgs").append("<li>" + roomName + ' created' + "</li>");
        }
      }
    });
  });

  socket.on('roomList', function(data){
    $('#rooms').text("");
    $('#rooms').append("<li class=\"list-group-item active\"> Meshee Rooms: <span class=\"badge\">" + "INCOMPLETE TOTAL" + "</span></li>") // add data count
      if(!jQuery.isEmptyObject(data.rooms)) {
        $.each(data.rooms, function(id, room) {
          var html = "<button id='joinroom' class='joinRoomBtn btn btn-default btn-xs' >Join</button>" + " " + "<button id="+id+" class='removeRoomBtn btn btn-default btn-xs'>Remove</button>";
          $('#rooms').append("<li id="+id+" class='list-group-item'><span>" + room.name + "</span> " + html + "</li");
        });
      } else {
        $('#rooms').append("<li class='list-group-item'>There are no rooms yet.</li>");
      }
  });
});