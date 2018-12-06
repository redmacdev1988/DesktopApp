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
});


io.on('connect', onConnect);

function onConnect(socket) {
    // remember to flatten the avl tree
    socket.emit('init', users, rooms);
}

// the io object listens for 'connection' events
// when it happens, we know that a client has connected to us.
// the callback gives us the socket object so we can see the details.

// the socket object is important, as it will listen for other messages.
// It will always give us a callback for what we want to do after the event.
io.on('connection', function(socket) {
    
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

    socket.on(CONSTANTS.SIGN_IN, function(userID){
        console.log(userID + ' wants to sign in...');
        users.insertAndBalance(parseInt(userID, 10));
        io.emit(CONSTANTS.SIGN_IN, userID, userID + ' signed in');
    });

    socket.on(CONSTANTS.INIT, function() {

        console.log('will return all users');

    })
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

