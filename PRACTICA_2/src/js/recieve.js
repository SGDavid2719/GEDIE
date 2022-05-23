function initialize() {
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
		// Allow only a single connection
		if (conn && conn.open) {
			c.on("open", function () {
				c.send("Already connected to another client");
				setTimeout(function () {
					c.close();
				}, 500);
			});
			return;
		}

		conn = c;
		console.log("Connected to: " + conn.peer);
		ready();
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

function ready() {
	conn.on("data", function (data) {
		console.log(`Other: ${data}`);
	});
}

initialize();

var conn = null;

function send() {
	var input = document.getElementById("userMessageText");
	console.log(`Me: ${input.value}`);
	conn.send(input.value);
}
