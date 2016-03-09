var moment = require ('moment');
var now = moment();

console.log(now.format());
console.log(now.format('X')); //secnods since epoch
console.log(now.format('x')); //millisecnods since epoch
console.log(now.valueOf()); //integer

var timestamp = now.valueOf(); //integer in UTC
var timestampMoment = moment.utc(timestamp); //convert from UTC
console.log(timestampMoment.local().format('h:mm a')); //convert to local


/*
now.subtract(1, 'year');
console.log(now.format());
console.log(now.format("MMM Do YYYY, h:mm a")); //5:45 PM
*/

