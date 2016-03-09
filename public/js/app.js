
var socket = io();

socket.on('connect', function(){
	console.log('Connected to socket.io server');

});

socket.on('message', function(message){
	console.log('New mesage:');
	console.log(message.text);
});

//handles submitting a new message
var $form = jQuery('#message-form'); //select the element in the DOM ID need #

//this will get called with form is submitted
$form.on('submit', function(event){
	var $message = $form.find('input[name=message]'); //.val() //find message within the form
	event.preventDefault();	 //used on the form when you don't want to refresh the entire page
	socket.emit('message', {
		text: $message.val() //find message within the form
	});
	$message.val(''); //clear the form

});