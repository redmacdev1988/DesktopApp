
var CONSTANTS = require("./constants");

var users = require('./LinkedListHashTable');
console.log('index.js - √ users created');

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
  //res.sendFile(__dirname + '/start.html');
});

function isString(data) {
    return ((typeof data === 'string') ||  (data instanceof String));
}
// the io object listens for 'connection' events
// when it happens, we know that a client has connected to us.
// the callback gives us the socket object so we can see the details.

// the socket object is important, as it will listen for other messages.
// It will always give us a callback for what we want to do after the event.
io.on('connection', function(socket) {

    socket.on('user-exists', function(userId) {
        console.log('USER-EXISTS ----------------> ');
        var isFound = users.search(userId) ? true : false;
        console.log('server: user-exists, ' + isFound);
        socket.emit('is-user-found', isFound, users.flatten());
    });

    socket.on('user-disconnect', function(userId){
        console.log('USER-DISCONNECT ----------------> ');
        socket.disconnect(true);
        if (users.remove(userId)) {
            console.log('server removed user ' + userId);
        } else {
            console.log('uh oh, user ' + userId + ' was not removed');
        }

        io.emit('info', userId + ' has left the room.', userId); // send msg to everyone
        io.emit('user-disconnected', userId, users.flatten());
    });

    socket.on('disconnect', function(socket) {
        console.log('index.js - disconnect');
    });

    // the socket object (passed in parameter) for that client will listen for a 'chat message' mevent.
    // when it gets it, we simply get the string msg.
    socket.on('chat message', function(msg, userId) {
        console.log('emit ' + msg + ' from ' + userId + ' ... to every client');
        io.emit('chat message', msg, userId); // send msg to everyone
    });

    socket.on(CONSTANTS.SIGN_IN, function(userID){
        console.log('server: sign in user ' + userID);

        if (isString(userID)) {
            var searchResult = users.search(userID);
            if (searchResult) {
                console.log('(+) signing in ' + userID);
                io.emit(CONSTANTS.SIGN_IN, userID, userID + ' signed in', users.flatten());
            } else {
                console.log(userID + ', does not exist..., we will insert ' + userID);
                users.insert(new String(userID));
                console.log('(+) signing in ' + userID);
                io.emit(CONSTANTS.SIGN_IN, userID, userID + ' signed in', users.flatten());
            }
        }

       
    });
});


http.listen(3000, function(){
  console.log('listening on *:3000');
});

