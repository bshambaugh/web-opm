/*   
 *    Web OPM: online case tool for Object-Process Methodology
 *    Copyright 2012 Israel Institute of Technology - Technion
 *    The code is licensed under GNU General Public License, v2
 * 
 *    File context description:
 *    File contains function to open channel (Google Channel API)
 * 
 *    Author: Michael Krasnopolsky
 * */

var channel = null;
var channelOpen = function() {
	// the method opens a channel with the server by GET request
	obj = new Message("openChannel", null, currentUser.id);
	jsonObj = JSON.encode(obj);
	var request = encodeURIComponent(jsonObj);
	JSONRequest.get("http://localhost:8080/rpc?JSONRequest="+request, function(sn, result, error){ 
//		alert(result);
		channel = new goog.appengine.Channel(result);
		socket = channel.open();
		/* Callback functions:
		 * onmessage: receives object with one field "data" , its what the server sends
		 * onerror: receives object with 2 fields , "code" - the http error code , and "description"
		 * */
		socket.onopen = function() { alert("channel opened"); }
		socket.onmessage = function(msg) { alert("answer :"+ msg.data ); }
		socket.onerror = function(err) { alert(err.code + ":" + err.description )};
  		socket.onclose = function() { alert("channel closed"); };
	});
}