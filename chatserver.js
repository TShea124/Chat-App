var net = require('net');
var port = 3000;
var fs = require('fs');
var chalk = require('chalk');
// var cowsay = require('cowsay');
var clients = []; // Keep Track Of Clients Connected
var chathistory = [];


var server = net.createServer( function (socket) {
	// console.log("Client Connected.");
	// socket.write("Hello Client.");
	socket.name = (socket.remoteAddress + ":" + socket.remotePort); // Client Indentifier.
	clients.push(socket); // Putting Clients into a List
	socket.write("Client Identity: " + socket.name + "\n");
	console.log(socket.name + " Connected.");

// fs.readFile('convohistory.txt',function (err,data) {
//     	if (err) {
//     		console.log(err);
// 	    } else{
// 	    	socket.write("Chat History:\n" + data.toString());
// 	    }
//   	});
 
//  socket.on('data', function(data) {      
//       var convo = data.toString().trim();
//       	chathistory.push(convo + '\n');
//       	fs.writeFile('convohistory.txt', chathistory, function (err) {
//     		if(err) {
//     			console.log(err);
//     		}
//     	});
//     });

socket.on('data', function(data) {
 		var command = data.toString().trim();
 		var commandsArray = command.split(" ");

 		if(command === 'yell') {
				broadcast(socket.name + " AHHHH!!!" + '\n',socket);
				console.log("AHHHH!!!");
			} else if (command ==='tableflip') {
				broadcast(socket.name + '(╯°□°）╯︵ ┻━┻' + '\n',socket);
				console.log('(╯°□°）╯︵ ┻━┻');	
			} else if (commandsArray[0] === 'yell' && commandsArray.length > 1) {
				var shift = commandsArray.shift();
 				var upcase = commandsArray.join(' ').toUpperCase();
		    	broadcast(socket.name + ' ' + upcase + '\n',socket);
		    	console.log(upcase);
			} else {
				broadcast(socket.name + command + '\n',socket);
			}
		
	 });

	var broadcast = function (message, sender) {
	clients.forEach (function (client) {  // For Each Client.
		if (client === sender) {    // Doesn't display to Sender.
			return;
		} else {
			client.write(message);
		}
	});
}

process.stdin.setEncoding('utf8');
process.stdin.on('readable', function() {
	var chunk = process.stdin.read();
	if (chunk != null) {
		broadcast(chunk);
	}
});

socket.on('data', function(data) {
	console.log(data.toString().trim());
});

socket.on('end', function() {
	clients.splice(clients.indexOf(socket), 1);        // Able to send messages to clients still connected.
	broadcast(socket.name + "  Is Left In The Chat.\n"); // Disconnected Clients will Not recieve messages and will Not Cuase an Error.
});

socket.on('end', function (data) {
	console.log("Client Disconnected.")
});

});

server.listen( port, function() {
	console.log("Listening on Port " + port);
});