const express = require("express");
const req = require("express/lib/request");
const morgan = require("morgan");
const path = require("path");
const app = express();
const bodyParser = require("body-parser");
const fs = require("fs");
const Swal = require("sweetalert2");

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

app.post("/add", urlencodedParser, function (req, res) {
	let lJSON = JSON.stringify(req.body, null, 2);
	let lFormArray = JSON.parse(lJSON);

	let lNumber = os.EOL + lFormArray.songs_number + os.EOL;
	let lInterval =
		lFormArray.start_time.toHHMMSS() +
		" --> " +
		lFormArray.end_time.toHHMMSS() +
		os.EOL;
	delete lFormArray["songs_number"];
	delete lFormArray["start_time"];
	delete lFormArray["end_time"];

	if (fs.existsSync("./src/public/tracks/Top13_Track.vtt")) {
		if (fs.readFileSync("./src/public/tracks/Top13_Track.vtt").length === 0) {
			fs.appendFileSync(
				"./src/public/tracks/Top13_Track.vtt",
				"WEBVTT",
				function (err) {
					if (err) {
						throw err;
					} else {
						console.log("File init succesfully");
					}
				}
			);
		}
		let lDataArray = [os.EOL, lNumber, lInterval, JSON.stringify(lFormArray)];
		for (let lIndex = 0; lIndex < lDataArray.length; lIndex++) {
			fs.appendFileSync(
				"./src/public/tracks/Top13_Track.vtt",
				lDataArray[lIndex],
				function (err) {
					if (err) throw err;
				}
			);
		}
	}

	res.render("editor", { qs: req.query });
});

// const lineReader = require("line-reader");
const lineByLine = require("n-readlines");

app.post("/edit", urlencodedParser, function (req, res) {
	let lJSON = JSON.stringify(req.body, null, 2);

	console.log(lJSON);

	let lArray = JSON.parse(lJSON);
	let lEdit = false;

	const lFile = new nReadlines("./src/public/tracks/Top13_Track.vtt");

	let line;
	let lineNumber = 1;

	while ((line = lFile.next())) {
		console.log(`Line ${lineNumber} has: ${line.toString("ascii")}`);
		lineNumber++;
	}

	// lineReader.eachLine("./src/public/tracks/Top13_Track.vtt", function (line) {
	// 	if (line == lArray.songs_number) {
	// 		console.log(line);
	// 		lEdit = true;
	// 	}
	// 	if (line.includes("-->") && lEdit == true) {
	// 		console.log(line.split(" --> "));
	// 	}
	// 	if (line.includes("songs_title") && lEdit == true) {
	// 		console.log(line.split(": ")[1]);
	// 	}
	// 	if (line.includes("authors_name") && lEdit == true) {
	// 		console.log(line.split(": ")[1]);
	// 	}
	// 	if (line.includes("genre") && lEdit == true) {
	// 		console.log(line.split(": ")[1]);
	// 	}
	// 	if (line.includes("year") && lEdit == true) {
	// 		console.log(line.split(": ")[1]);
	// 	}
	// 	if (line.includes("video_url") && lEdit == true) {
	// 		console.log(line.split(": ")[1]);
	// 	}
	// 	if (line.includes("lyrics") && lEdit == true) {
	// 		console.log(line.split(": ")[1]);
	// 		line.replace('"lyrics": "fdjksaghdsañlhgjk"', lArray.lyrics);
	// 		console.log(line);
	// 		lEdit = false;
	// 	}
	// 	try {
	// 		let lNewLine = line + os.EOL;
	// 		fs.appendFileSync("./src/public/tracks/Top13_Track_copy.vtt", lNewLine);
	// 	} catch (err) {
	// 		console.log("Error writing: " + err.message);
	// 	}
	// });

	// fs.readFile(
	// 	"./src/public/tracks/Top13_Track.vtt",
	// 	"utf8",
	// 	function (err, data) {
	// 		// var newValue = data.replace("dsaffdsa", lArray.test);
	// 		console.log(data);
	// 		console.log(JSON.stringify(data, null, 2));
	// 		console.log(JSON.parse(JSON.stringify(data, null, 2)));
	// 		if (data == lArray.test) {
	// 			console.log("same");
	// 		}
	// 		// fs.writeFile(
	// 		// 	"./src/public/tracks/Top13_Track_copy.vtt",
	// 		// 	newValue,
	// 		// 	function () {
	// 		// 		console.log(newValue);
	// 		// 	}
	// 		// );
	// 	}
	// );

	// fs.appendFile("./src/public/tracks/Top13_Track.vtt", lNumber, function (err) {
	// 	if (err) {
	// 		throw err;
	// 	} else {
	// 		console.log("Test Saved!");
	// 	}
	// });
	res.render("editor", { qs: req.query });
});

app.post("/delete", urlencodedParser, function (req, res) {
	let lJSON = JSON.stringify(req.body, null, 2);

	let lFormArray = JSON.parse(lJSON);
	let lDelete = false;

	// lineReader.eachLine("./src/public/tracks/Top13_Track.vtt", function (line) {
	// 	console.log();
	// 	if (line == lFormArray.songs_number) {
	// 		lDelete = true;
	// 	}
	// 	if (lDelete == false && line != os.EOL) {
	// 		try {
	// 			let lNewLine = line == "}" ? line : line + os.EOL;
	// 			fs.appendFileSync("./src/public/tracks/Top13_Track_copy.vtt", lNewLine);
	// 		} catch (err) {
	// 			console.log("Error writing: " + err.message);
	// 		}
	// 	} else if (line == "}" && lDelete == true) {
	// 		lDelete = false;
	// 	}
	// });

	let lLiner = new lineByLine("./src/public/tracks/Top13_Track.vtt");

	let lLine;

	while ((lLine = lLiner.next())) {
		console.log(lLine.toString("ascii"));
		if (lLine.toString("ascii") == lFormArray.songs_number) {
			lDelete = true;
		}
		if (lDelete == false && lLine.toString("ascii") != os.EOL) {
			try {
				let lNewLine = lLine.toString("ascii");
				fs.appendFileSync("./src/public/tracks/Top13_Track_copy.vtt", lNewLine);
			} catch (err) {
				console.log("Error writing: " + err.message);
			}
		} else if (lLine.toString("ascii") == "}" && lDelete == true) {
			lDelete = false;
			fs.appendFileSync("./src/public/tracks/Top13_Track_copy.vtt", os.EOL);
		}
	}

	console.log("End of file");

	fs.copyFileSync(
		"./src/public/tracks/Top13_Track_copy.vtt",
		"./src/public/tracks/Top13_Track.vtt"
	);

	res.render("editor", { qs: req.query });
});

app.post("/copy", urlencodedParser, function (req, res) {
	console.log("??????????????????");
	let lFile = fs.readFileSync(
		"./src/public/tracks/Top13_Track_copy.vtt",
		"utf8"
	);
	console.log(lFile);
	// let lFirstLine = true;
	// let lNewLine;
	// lineReader.eachLine(
	// 	"./src/public/tracks/Top13_Track_copy.vtt",
	// 	function (line) {
	// 		console.log("?: " + line);
	// 		if (lFirstLine) {
	// 			try {
	// 				fs.writeFileSync("./src/public/tracks/Top13_Track.vtt", "", (err) => {
	// 					if (err) {
	// 						console.error(err);
	// 						return;
	// 					}
	// 				});
	// 				lFirstLine = false;
	// 				console.log("1.");
	// 				lNewLine = line + os.EOL;
	// 				fs.appendFileSync(
	// 					"./src/public/tracks/Top13_Track.vtt",
	// 					lNewLine,
	// 					(err) => {
	// 						if (err) {
	// 							console.error(err);
	// 							return;
	// 						}
	// 						//file written successfully
	// 					}
	// 				);
	// 			} catch (err) {
	// 				console.log("Error writing: " + err.message);
	// 			}
	// 		} else {
	// 			try {
	// 				lNewLine = line + os.EOL;
	// 				fs.appendFileSync(
	// 					"./src/public/tracks/Top13_Track.vtt",
	// 					lNewLine,
	// 					(err) => {
	// 						if (err) {
	// 							console.error(err);
	// 							return;
	// 						}
	// 						//file written successfully
	// 					}
	// 				);
	// 				console.log("2.");
	// 			} catch (err) {
	// 				console.log("Error writing: " + err.message);
	// 			}
	// 		}
	// 	}
	// );

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
