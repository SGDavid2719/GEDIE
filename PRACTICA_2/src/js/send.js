function initialize() {
	// Create own peer object with connection to shared PeerJS server
	peer = new Peer(null, {
		debug: 2,
	});

	peer.on("open", function (id) {
		// Workaround for peer.reconnect deleting previous id
		if (peer.id === null) {
			console.log("Received null id from peer open");
			peer.id = lastPeerId;
		} else {
			lastPeerId = peer.id;
		}

		console.log("ID: " + peer.id);
	});
	peer.on("connection", function (c) {
		// Disallow incoming connections
		c.on("open", function () {
			c.send("Sender does not accept incoming connections");
			setTimeout(function () {
				c.close();
			}, 500);
		});
	});
	peer.on("disconnected", function () {
		console.log("Connection lost. Please reconnect");

		// Workaround for peer.reconnect deleting previous id
		peer.id = lastPeerId;
		peer._lastServerId = lastPeerId;
		peer.reconnect();
	});
	peer.on("close", function () {
		conn = null;
		console.log("Connection destroyed");
	});
	peer.on("error", function (err) {
		console.log(err);
		alert("" + err);
	});
}

initialize();

// Start peer connection on click
var connectButton = document.getElementById("connect-button");
connectButton.addEventListener("click", join);
var conn = null;
var recvIdInput = document.getElementById("receiver-id");

function join() {
	console.log();

	// Close old connection
	if (conn) {
		conn.close();
	}

	// Create connection to destination peer specified in the input field
	conn = peer.connect(recvIdInput.value, {
		reliable: true,
	});

	conn.on("open", function () {
		console.log("Connected to: " + conn.peer);
	});
	// Handle incoming data (messages only since this is the signal sender)
	conn.on("data", function (data) {
		console.log(`Other: ${data}`);
	});
	conn.on("close", function () {
		console.log("Connection closed");
	});
}

var txtButton = document.getElementById("text-button");
txtButton.addEventListener("click", send);

function send() {
	var input = document.getElementById("receiver-text");
	console.log(`Me: ${input.value}`);
	conn.send(input.value);
}
