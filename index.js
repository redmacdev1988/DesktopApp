
console.log('index.js - √ setting up the server');

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);


app.get('/', function(req, res){
  //res.send('<h1>Hello world</h1>');
  res.sendFile(__dirname + '/index.html');
});

// the io object listens for 'connection' events
// when it happens, we know that a client has connected to us.
// the callback gives us the socket object so we can see the details.

// the socket object is important, as it will listen for other messages.
// It will always give us a callback for what we want to do after the event.
io.on('connection', function(socket) {
    
    // some time for the request from html to get here to the server

    console.log(new Date().getTime()); // 3
    console.log('a user connected');
    //console.log(socket);
    console.log(new Date().getTime()); // 4

    // the socket object (passed in parameter) for that client will listen for a 'disconnect' event.
    // when it disconnects, it'll hit this callback.
    socket.on('disconnect', function() {
        console.log('user disconnected');
    });

    // the socket object (passed in parameter) for that client will listen for a 'chat message' mevent.
    // when it gets it, we simply get the string msg.
    socket.on('chat message', function(msg) {
        console.log('received message: ' + msg);
        io.emit('chat message', msg); // send msg to everyone
    });



});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

console.log("index.js - √ end");