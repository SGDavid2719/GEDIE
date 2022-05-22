const peer = new Peer();
var currentCall;

myId = null;
myName = null;
myColor = null;

peerId = null;
var conn = null;

function joinChat() {
    conn = peer.connect(peerId);
    conn.on('open', function () {
        // here you have conn.id

        // conn.send('hi!');
    });
    conn.on('data', function (data) {
        // Will print 'hi!'
        console.log(data);
        var chatdiv = document.getElementById('chat-text-div');
        chatdiv.innerHTML += '<div class="col-md-12">' + data + '</div>'

        var messageBody = document.querySelector('#chat-text-div');
        messageBody.scrollTop = messageBody.scrollHeight - messageBody.clientHeight;
    });
    conn.on('close', function () {
        console.log("Connection closed")
        document.querySelector("#menu").style.display = "block";
        document.querySelector("#live").style.display = "none";
        document.getElementById("chatBox").style.display = "none";

        var chatdiv = document.getElementById('chat-text-div');
        chatdiv.innerHTML = ''
        var chatdiv = document.getElementById('private-chat-input');
        chatdiv.value = ''
        peerId = null;
    });
}

peer.on('connection', function (connec) {
    conn = connec
    connec.on('data', function (data) {
        // Will print 'hi!'
        console.log(data);
        var chatdiv = document.getElementById('chat-text-div');
        chatdiv.innerHTML += '<div class="col-md-12">' + data + '</div>'

        var messageBody = document.querySelector('#chat-text-div');
        messageBody.scrollTop = messageBody.scrollHeight - messageBody.clientHeight;
    });
    connec.on('close', function () {
        console.log("Connection closed")
        document.querySelector("#menu").style.display = "block";
        document.querySelector("#live").style.display = "none";
        document.getElementById("chatBox").style.display = "none";

        var chatdiv = document.getElementById('chat-text-div');
        chatdiv.innerHTML = ''

        var chatdiv = document.getElementById('private-chat-input');
        chatdiv.value = ''

        peerId = null;
    });
});

peer.on("open", async function (id) {
    myId = id;
    $.post("/users", { user: myId }, function (return_data) {
        document.getElementById("active-users-div").innerHTML += '<div class="col-md-12">' + return_data[1] + return_data[0] + '</div>'
        document.getElementById('uuid').innerHTML = "My username and ID: " + return_data[1] + return_data[0] + " - " + id;
    }, 'json');
    getActiveUsers()
});

async function callUser() {
    // get the id entered by the user
    // const peerId = document.querySelector("input").value;
    peerId = document.getElementById("insertedID").value;

    // grab the camera and mic
    const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
    });
    // switch to the video call and play the camera preview
    document.getElementById("menu").style.display = "none";
    document.getElementById("live").style.display = "block";
    document.getElementById("chatBox").style.display = "block";
    document.getElementById("local-video").srcObject = stream;
    document.getElementById("local-video").play();
    // make the call
    const call = peer.call(peerId, stream);
    call.on("stream", (stream) => {
        document.getElementById("remote-video").srcObject = stream;
        document.getElementById("remote-video").play();
    });
    call.on("data", (stream) => {
        document.querySelector("#remote-video").srcObject = stream;
    });
    joinChat();
    call.on("error", (err) => {
        console.log(err);
    });
    call.on('close', () => {
        endCall()
    })
    // save the close function
    currentCall = call;
}

peer.on("call", (call) => {
    var result = confirm(`Accept call from ${call.peer}?`)
    // if (result) {
    // grab the camera and mic
    navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
            // play the local preview
            document.querySelector("#local-video").srcObject = stream;
            document.querySelector("#local-video").play();
            // answer the call
            call.answer(stream);
            // save the close function
            currentCall = call;
            // change to the video view
            document.querySelector("#menu").style.display = "none";
            document.querySelector("#live").style.display = "block";
            document.getElementById('chatBox').style.display = 'block';

            call.on("stream", (remoteStream) => {
                // when we receive the remote stream, play it
                document.getElementById("remote-video").srcObject = remoteStream;
                document.getElementById("remote-video").play();
            });
        })
        .catch((err) => {
            console.log("Failed to get local stream:", err);
        });
    // } else {
    //     // user rejected the call, close it
    //     call.close();
    // }
});

function endCall() {
    // Go back to the menu
    document.querySelector("#menu").style.display = "block";
    document.querySelector("#live").style.display = "none";
    document.getElementById("chatBox").style.display = "none";

    var chatdiv = document.getElementById('chat-text-div');
    chatdiv.innerHTML = ''

    var chatdiv = document.getElementById('private-chat-input');
    chatdiv.value = ''
    // If there is no current call, return
    if (!currentCall) return;
    // Close the call, and reset the function
    try {
        currentCall.close();
    } catch { }
    currentCall = undefined;
    conn.close()
    peerId = null;
}


function sendMsg() {
    var val = document.getElementById('private-chat-input').value;
    conn.send(val)

    var chatdiv = document.getElementById('chat-text-div');
    chatdiv.innerHTML += '<div class="col-md-12 priv-inpt" style="text-align: right;">' + val + '</div>'

    var messageBody = document.querySelector('#chat-text-div');
    messageBody.scrollTop = messageBody.scrollHeight - messageBody.clientHeight;
}


var input = document.getElementById("private-chat-input");

// Execute a function when the user presses a key on the keyboard
input.addEventListener("keypress", function (event) {
    // If the user presses the "Enter" key on the keyboard
    if (event.key === "Enter") {
        // Cancel the default action, if needed
        event.preventDefault();
        // Trigger the button element with a click
        sendMsg();
    }
});

function clearChat() {
    var chatdiv = document.getElementById('chat-text-div');
    chatdiv.innerHTML = ''
}


window.onbeforeunload = closingCode;
function closingCode() {

    $.post("/end", { user: myId }, function (return_data) {
        alert(return_data.message);
        console.log("first")
    }, 'json');

    return null;
}


let active_users = null;
window.onload = getActiveUsers;
function getActiveUsers() {
    console.log(myName)
    $.get("/active-users", "", function (data) {
        active_users = data;
    });

    var idx = 0

    while (active_users[idx] !== undefined) {
        // <i onclick="connect_peer(' + active_users[idx].id + ')" class="fa-solid fa-link link-peer"></i>
        document.getElementById("active-users-div").innerHTML += '<div class="col-md-12">' + active_users[idx].color + active_users[idx].name + ` <i onclick='connect_peer(` + JSON.stringify(active_users[idx].id) + `) ' class="fa-solid fa-link link-peer"></i> </div>`
        idx++
    }
}

function connect_peer(peer_id) {
    alert(peer_id)
}