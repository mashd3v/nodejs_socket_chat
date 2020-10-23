// emit: send informarion; on: listen for information
var socket = io();

var params = new URLSearchParams(window.location.search);
if (!params.has('name') || !params.has('party')) {
    window.location = 'index.html';
    throw new Error('User name and party chat are necessary.')
}

var user = {
    name: params.get('name'),
    party: params.get('party'),
}

socket.on('connect', function() {

    console.log('Server connected.');

    socket.emit('loginChat', user, function(res) {
        console.log('Connected users: ', res);
    });

});

socket.on('disconnect', function() {
    console.log('Server connection lost.');
});

// Send info
socket.emit('sendMessage', {
    user: 'Miguel',
    message: 'Hello World',
}, function(res) {
    console.log('Server response:', res);
});

// Listen info
socket.on('createMessage', function(message) {
    console.log('Server:', message);
});

// Listen users changes
socket.on('peopleList', function(people) {
    console.log(people);
});

// Private messages
socket.on('privateMessage', function(message) {
    console.log('Private message: ', message);
});