
var name = getQueryVariable('name') || 'Annonymous' ;
var room = getQueryVariable('room') || 'No room';
var socket = io();

console.log(name + ' wants to join ' + room);
jQuery('.room-title').text(room);


socket.on('connect', function(){
	console.log('Connected to socket.io server');
	//group sockets
	socket.emit('joinRoom', {
		name: name,
		room: room
	});

});

//targets:
//target by id or name use $
//target by class use '.classname'

socket.on('message', function(message){
	var ts = moment.utc(message.timestamp); //convert from UTC
	var $message = jQuery('.messages');
	$message.append('<p><strong>'+message.name + ' ' + ts.local().format('h:mm:ss a')+'</strong></p>')
	$message.append('<p>' + message.text + '</p>');
});

//handles submitting a new message
var $form = jQuery('#message-form'); //select the element in the DOM ID need #

//this will get called with form is submitted
$form.on('submit', function(event){
	var $message = $form.find('input[name=message]'); //.val() //find message within the form
	event.preventDefault();	 //used on the form when you don't want to refresh the entire page
	socket.emit('message', {
		name: name,
		room: room,
	//	timestamp: moment().valueOf(),
		text: $message.val() //find message within the form
	});
	$message.val(''); //clear the form

});