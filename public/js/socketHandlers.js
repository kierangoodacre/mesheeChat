$(document).ready(function(){

  var socket = io();
  $("#chat").hide();
  $("#name").focus();
  $("form").submit(function(event){
      event.preventDefault();
  });

  $("#join").click(function(){
    var name = $("#name").val();
    if (name != "") {
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
      if (name != "") {
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

  socket.on("chat", function(who, msg){
    if(ready) {
      $("#msgs").append("<li><strong><span class='text-success'>" + who + "</span></strong> says: " + msg + "</li>");
    }
  });

  socket.on("disconnect", function(){
    $("#msgs").append("<li><strong><span class='text-warning'>The server is not available</span></strong></li>");
    $("#msg").attr("disabled", "disabled");
    $("#send").attr("disabled", "disabled");
  });

  $("#send").click(function(){
    var msg = $("#msg").val();
    socket.emit("send", msg);
    $("#msg").val("");
  });

  $("#msg").keypress(function(e){
    if(e.which == 13) {
      var msg = $("#msg").val();
      socket.emit("send", msg);
      $("#msg").val("");
    }
  });
});