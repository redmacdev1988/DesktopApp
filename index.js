
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

var userFactory = require('./User');

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
        var foundUser = users.searchUserByUserName(userId);
        if (foundUser) {
            console.log('----- - - - - - ');
            console.dir(foundUser.data);
            console.dir(foundUser.data.constructor.name);
        }
     
        socket.emit('is-user-found', foundUser, users.flatten());
    });

    socket.on('user-disconnect', function(userId){
        socket.disconnect(true);
        if (users.removeUserByUserName(userId)) {
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
            var searchResult = users.searchUserByUserName(userID);
           
            if (searchResult) {
                console.log('-----------> user found √');
                console.log(searchResult);

                console.log('(+) signing in ' + userID);
                io.emit(CONSTANTS.SIGN_IN, searchResult, userID + ' signed in', users.flatten());
            } else {
                console.log(userID + ', does not exist..., we will insert ' + userID);

                var aUser = (Math.random() > 0.5) ? userFactory.user.createUser(new String(userID), "my pwd") : userFactory.admin.createAdmin(new String(userID), "my pwd");
                users.insertUser(aUser);
                console.log('(+) signing in ' + aUser.name);
                users.print();
                console.log(aUser);
                console.log(aUser.constructor.name);
                
                io.emit(CONSTANTS.SIGN_IN, aUser, userID + ' signed in', users.flatten());
            }
        }
    });
});


http.listen(3000, function(){
  console.log('listening on *:3000');
});

