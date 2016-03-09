var PORT = process.env.PORT || 3000;
var express = require('express');
var app = new express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var moment = require('moment');

app.use(express.static(__dirname+'/public'));

io.on('connection' , function(socket){
	console.log('User connected via socket.io');
	socket.on('message', function(message){
		console.log('Message Received:');
		console.log(message.text);
		message.timestamp= moment().valueOf();
		io.emit('message',message);
		//socket.broadcast.emit('message', message); // only to others
		//io.broadcast.emit() ... to everyone including sender
	});
	socket.emit('message', {
		timestamp: moment().valueOf(),
		text: 'Welcome to the chat application'
	});
}); //listen for events

http.listen(PORT, function(){
	console.log("Server started on port " + PORT);
});
