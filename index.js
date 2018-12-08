var AVLTree = require('./avltree');
var CONSTANTS = require("./constants");

var users = AVLTree.CreateObject();
console.log('index.js - √ users created');

var rooms = AVLTree.CreateObject();
console.log('index.js - √ rooms created');

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
  //res.sendFile(__dirname + '/start.html');
});

// when a client connect, we give that client users and rooms data
io.on('connect', function(socket) {
    console.log(' connect ! ');
    socket.emit('init', users.flatten(), rooms.flatten());
});


// the io object listens for 'connection' events
// when it happens, we know that a client has connected to us.
// the callback gives us the socket object so we can see the details.

// the socket object is important, as it will listen for other messages.
// It will always give us a callback for what we want to do after the event.
io.on('connection', function(socket) {

    socket.on('user-disconnect', function(userId){
        console.log(userId + ' wants to disconnect');
        socket.disconnect(true);
        users.removeAndBalance(userId);
        io.emit('info', userId + ' has left the room.', userId); // send msg to everyone
        io.emit('user-disconnected', userId, users.flatten());
    });

    socket.on('disconnect', function(socket) {
        console.log('index.js - disconnect');
       
        //io.emit('myCustomEvent', {customEvent: 'Custom Message'})
        //console.log('Socket disconnected: ' + _id);
    });

    // the socket object (passed in parameter) for that client will listen for a 'chat message' mevent.
    // when it gets it, we simply get the string msg.
    socket.on('chat message', function(msg, userId) {
        console.log(userId + ': ' + msg);
        io.emit('chat message', msg, userId); // send msg to everyone
    });

    socket.on(CONSTANTS.SIGN_IN, function(userID){
        console.log(userID + ' wants to sign in...');
        console.log(new String(userID));

        users.insertAndBalance(new String(userID));
        console.log(users.flatten());
        io.emit(CONSTANTS.SIGN_IN, userID, userID + ' signed in', users.flatten());
    });

});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

