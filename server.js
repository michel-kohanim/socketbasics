var PORT = process.env.PORT || 3000;
var express = require('express');
var app = new express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var moment = require('moment');

app.use(express.static(__dirname+'/public'));

var clientInfo = {};

/**
Sends current users to the provided socket
**/
function sendCurrentUsers(socket)
{
	var info = clientInfo[socket.id];
	var users = [];

	if (typeof info === 'undefined')
	{
		return;
	}

	Object.keys(clientInfo).forEach(function (socketId){
		var userInfo = clientInfo[socketId];

		if (info.room === userInfo.room)
			users.push(userInfo.name);
	});
	socket.emit('message', {
		name: 'System',
		text: 'Current users: ' + users.join(', '),
		timestamp: moment().valueOf()
	});
}

io.on('connection' , function(socket){
	console.log('User connected via socket.io');

	socket.on('disconnect', function(){
		//first check to see if the user is part of the chat room
		if (typeof clientInfo[socket.id] !== 'undefined')
		{
			socket.leave(clientInfo[socket.id].room);
			io.to(clientInfo[socket.id].room).emit('message',{
				name: 'System',
				text: clientInfo[socket.id].name + ' ' + ' has left!',
				timestamp: moment().valueOf()
			});
			delete clientInfo[socket.id];
		}
	});
	//req {name:, room}
	socket.on('joinRoom', function(req){
		clientInfo[socket.id] = req;
		socket.join(req.room);
		socket.broadcast.to(req.room).emit('message',{
			name: 'System',
			text: req.name + ' has joined!',
			timestamp: moment.valueOf()
		}); //only people in the room see this message
	});

	socket.on('message', function(message){
		if (message.text === '@currentUsers')
		{
			sendCurrentUsers(socket);
		}
		else
		{
			message.timestamp= moment().valueOf();
			io.to(clientInfo[socket.id].room).emit('message',message);
		}
		//socket.broadcast.emit('message', message); // only to others
		//io.broadcast.emit() ... to everyone including sender
	});
	socket.emit('message', {
		name: 'System',
		timestamp: moment().valueOf(),
		text: 'Welcome to the chat application'
	});
}); //listen for events

http.listen(PORT, function(){
	console.log("Server started on port " + PORT);
});
