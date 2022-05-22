const express = require("express");
const req = require("express/lib/request");
const morgan = require("morgan");
const path = require("path");
const app = express();
const bodyParser = require("body-parser");
const fs = require("fs");
const Swal = require("sweetalert2");
const names = require('./names.json')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// Fav icon
var favicon = require("serve-favicon");
app.use(favicon(path.join(__dirname, "public", "images", "favicon.ico")));

// settings
app.set("port", 8080);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// middlewares
app.use(morgan("dev"));

// routes
app.use(require("./routes"));

// static files
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "css")));
app.use(express.static(path.join(__dirname, "js")));
app.use(express.static(path.join(__dirname, "php")));

var urlencodedParser = bodyParser.urlencoded({ extended: false });

var os = require("os");
const vttParser = require("subtitles-parser-vtt");

app.get("/getCues", urlencodedParser, function (req, res) {
	let lFileString = fs.readFileSync(
		"./src/public/tracks/Top13_Track.vtt",
		"utf8"
	);
	let lData = vttParser.fromVtt(lFileString, true);
	res.send(lData);
});

app.post("/add", urlencodedParser, function (req, res) {
	let lJSON = JSON.stringify(req.body, null, 2);
	let lFormArray = JSON.parse(lJSON);

	let lFileString = fs.readFileSync(
		"./src/public/tracks/Top13_Track.vtt",
		"utf8"
	);

	if (lFileString == "")
		fs.writeFileSync("./src/public/tracks/Top13_Track.vtt", "WEBVTT" + os.EOL);

	let lData = [];
	let lCueToAdd = {};

	lCueToAdd.id = lFormArray.songs_number;
	lCueToAdd.startTime = lFormArray.start_time.toHHMMSS();
	lCueToAdd.endTime = lFormArray.end_time.toHHMMSS();
	delete lFormArray["previous_songs_number"];
	delete lFormArray["songs_number"];
	delete lFormArray["start_time"];
	delete lFormArray["end_time"];
	lCueToAdd.text = JSON.stringify(lFormArray);

	lData.push(lCueToAdd);

	let lDataVtt = vttParser.toVtt(lData, true);

	fs.appendFileSync("./src/public/tracks/Top13_Track.vtt", lDataVtt);

	res.render("editor", { qs: req.query });
});

app.post("/edit", urlencodedParser, function (req, res) {
	let lJSON = JSON.stringify(req.body, null, 2);
	let lFormArray = JSON.parse(lJSON);

	let lFileString = fs.readFileSync(
		"./src/public/tracks/Top13_Track.vtt",
		"utf8"
	);

	let lData = vttParser.fromVtt(lFileString, true);

	let lCueToEdit = lData.filter(
		(elem) => elem.id == lFormArray.previous_songs_number
	);

	lCueToEdit[0].id = lFormArray.songs_number;
	lCueToEdit[0].startTime = lFormArray.start_time.toHHMMSS();
	lCueToEdit[0].endTime = lFormArray.end_time.toHHMMSS();
	delete lFormArray["pervious_songs_number"];
	delete lFormArray["songs_number"];
	delete lFormArray["start_time"];
	delete lFormArray["end_time"];
	lCueToEdit[0].text = JSON.stringify(lFormArray);

	let lDataVtt = vttParser.toVtt(lData, true);

	fs.writeFileSync("./src/public/tracks/Top13_Track.vtt", "WEBVTT" + os.EOL);
	fs.appendFileSync("./src/public/tracks/Top13_Track.vtt", lDataVtt);
});

app.post("/delete", urlencodedParser, function (req, res) {
	let lJSON = JSON.stringify(req.body, null, 2);
	let lFormArray = JSON.parse(lJSON);

	let lFileString = fs.readFileSync(
		"./src/public/tracks/Top13_Track.vtt",
		"utf8"
	);
	let lData = vttParser.fromVtt(lFileString, true);
	let lNewData = lData.filter((elem) => elem.id != lFormArray.songs_number);

	let lDataVtt = vttParser.toVtt(lNewData, true);

	fs.writeFileSync("./src/public/tracks/Top13_Track.vtt", "WEBVTT" + os.EOL);
	fs.appendFileSync("./src/public/tracks/Top13_Track.vtt", lDataVtt);

	res.render("editor", { qs: req.query });
});

String.prototype.toHHMMSS = function () {
	var sec_num = parseInt(this, 10); // don't forget the second param
	var hours = Math.floor(sec_num / 3600);
	var minutes = Math.floor((sec_num - hours * 3600) / 60);
	var seconds = sec_num - hours * 3600 - minutes * 60;

	if (hours < 10) {
		hours = "0" + hours;
	}
	if (minutes < 10) {
		minutes = "0" + minutes;
	}
	if (seconds < 10) {
		seconds = "0" + seconds;
	}
	return hours + ":" + minutes + ":" + seconds + ".000";
};

// listening the server
app.listen(app.get("port"), () => {
	console.log("Server on port", app.get("port"));
});


let active_users = new Map();

app.post("/users", urlencodedParser, function (req, res) {
	let user_id = req.body;
	user_id = user_id.user;

	const color = names[Math.round(Math.random() * names.length)]['color'];
	const name = names[Math.round(Math.random() * names.length)]['name'];

	active_users.set(user_id, { name: name, color: color, id: user_id })
	console.log("Added: " + user_id + " - " + name + " - " + color)

	res.send([name, color])
});


app.post("/end", urlencodedParser, function (req, res) {
	let user_id = req.body;
	user_id = user_id.user;

	let user = active_users.get(user_id);
	active_users.delete(user_id)

	console.log("Removed: " + user_id + " - " + user.name + " - " + user.color)
});

app.get("/active-users", urlencodedParser, function (req, res) {
	let users = []
	active_users.forEach((value, key) => {
		users.push(value)
		// res.send(value)
	})

	res.send(users)
});