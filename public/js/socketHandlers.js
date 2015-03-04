var Crypt = new Crypt();

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

  $("#send").click(function(){
    var msg = $("#msg").val();
    var ciphertext = Crypt.AES.encrypt(msg, $('#key').val());
    socket.emit("message", ciphertext);
    $("#msg").val("");
  });

  $("#msg").keypress(function(event){
    if(event.which == 13) {
      var msg = $("#msg").val();
      var ciphertext = Crypt.AES.encrypt(msg, $('#key').val());
      socket.emit("message", ciphertext);
      $("#msg").val("");
    }
  });

  socket.on("update", function(user){
    socket.emit("user-list", name);
    if(ready === true) {
      $("#users").html("<li>" + name + "</li>");
    }
  });

  socket.on("update", function(msg) {
    if(ready) {
      $("#msgs").append("<li>" + msg + "</li>");
    }
  });

  socket.on("update-disconnect", function(user) {
    socket.emit("user-list", name);
    if(ready === true) {
      $("#users").html("<li>" + name + "</li>");
    }
  });

  socket.on("update-disconnect", function(user) {
    if(ready === true) {
      $("#msgs").append("<li>" + user + "</li>");
    }
  })

  socket.on("chat", function(who, msg){
    if(ready) {
      var plaintext = Crypt.AES.decrypt(msg, $('#key').val());
      if (plaintext != null) {
        $("#msgs").append("<li><strong><span class='text-success'>" + who + "</span></strong>: " + plaintext + "</li>");
      }
    }
  });

  socket.on("disconnect", function(){
    $("#msgs").append("<li><strong><span class='text-warning'>The server is not available</span></strong></li>");
    $("#msg").attr("disabled", "disabled");
    $("#send").attr("disabled", "disabled");
  });

  socket.on("logged-in-users", function(who){
    if(ready === true){
      var users = '';
      $.each(who, function(index, person) {
        users += '<li>' + person + '</li>'
      })
      $('#users').append(users);
    }
  });

});