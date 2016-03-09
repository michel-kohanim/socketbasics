var PORT = process.env.PORT || 3000;
var express = require('express');
var app = new express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname+'/public'));

io.on('connection' , function(socket){
	console.log('User connected via socket.io');
	socket.on('message', function(message){
		console.log('Message Received:');
		console.log(message.text);
		socket.broadcast.emit('message', message); // only to other
		//io.broadcast.emit() ... to everyone including sender
	});
	socket.emit('message', {
		text: 'Welcome to the chat application'
	});
}); //listen for events

http.listen(PORT, function(){
	console.log("Server started on port " + PORT);
});
