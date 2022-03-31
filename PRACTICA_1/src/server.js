const express = require("express");
const req = require("express/lib/request");
const morgan = require("morgan");
const path = require("path");
const app = express();
const bodyParser = require("body-parser");
const fs = require("fs");

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

// Handling request
app.get("/editor", function (req, res) {
	res.render("editor", { qs: req.query });
});

var os = require("os");

app.post("/editor", urlencodedParser, function (req, res) {
	let lJSON = JSON.stringify(req.body, null, 2);
	let lArray = JSON.parse(lJSON);
	let lNumber = os.EOL + lArray.songs_number + os.EOL;
	let lInterval = lArray.start_time + " --> " + lArray.end_time + os.EOL;
	delete lArray["songs_number"];
	delete lArray["start_time"];
	delete lArray["end_time"];
	fs.appendFile("./src/public/tracks/Top13_Track.vtt", lNumber, function (err) {
		if (err) {
			throw err;
		} else {
			fs.appendFile(
				"./src/public/tracks/Top13_Track.vtt",
				lInterval,
				function (err) {
					if (err) {
						throw err;
					} else {
						fs.appendFile(
							"./src/public/tracks/Top13_Track.vtt",
							JSON.stringify(lArray, null, 2),
							function (err) {
								if (err) {
									throw err;
								} else {
									fs.appendFile(
										"./src/public/tracks/Top13_Track.vtt",
										os.EOL,
										function (err) {
											if (err) throw err;
											console.log("Saved!");
										}
									);
								}
							}
						);
					}
				}
			);
		}
	});
	res.render("editor", { qs: req.query });
});

const lineReader = require("line-reader");

app.post("/test", urlencodedParser, function (req, res) {
	let lJSON = JSON.stringify(req.body, null, 2);

	console.log(lJSON);

	let lArray = JSON.parse(lJSON);
	let lEdit = false;

	lineReader.eachLine("./src/public/tracks/Top13_Track.vtt", function (line) {
		if (line == lArray.songs_number) {
			console.log(line);
			lEdit = true;
		}
		if (line.includes("-->") && lEdit == true) {
			console.log(line.split(" --> "));
		}
		if (line.includes("songs_title") && lEdit == true) {
			console.log(line.split(": ")[1]);
		}
		if (line.includes("authors_name") && lEdit == true) {
			console.log(line.split(": ")[1]);
		}
		if (line.includes("genre") && lEdit == true) {
			console.log(line.split(": ")[1]);
		}
		if (line.includes("year") && lEdit == true) {
			console.log(line.split(": ")[1]);
		}
		if (line.includes("video_url") && lEdit == true) {
			console.log(line.split(": ")[1]);
		}
		if (line.includes("lyrics") && lEdit == true) {
			console.log(line.split(": ")[1]);
			line.replace('"lyrics": "fdjksaghdsañlhgjk"', lArray.lyrics);
			console.log(line);
			lEdit = false;
		}
		// fs.appendFile(
		// 	"./src/public/tracks/Top13_Track_copy.vtt",
		// 	line,
		// 	function () {
		// 		//console.log(line);
		// 	}
		// );
	});

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
	//res.render("test", { qs: req.query });
});

app.post("/testdelete", urlencodedParser, function (req, res) {
	let lJSON = JSON.stringify(req.body, null, 2);

	console.log(lJSON);

	let lArray = JSON.parse(lJSON);
	let lDelete = false;

	lineReader.eachLine("./src/public/tracks/Top13_Track.vtt", function (line) {
		if (line == lArray.songs_number) {
			lDelete = true;
		}
		if (lDelete == false) {
			try {
				let lNewLine = line + os.EOL;
				fs.appendFileSync("./src/public/tracks/Top13_Track_copy.vtt", lNewLine);
			} catch (err) {
				console.log("Error writing: " + err.message);
			}
		} else if (line == "}" && lDelete == true) {
			lDelete = false;
		}
	});
});

// listening the server
app.listen(app.get("port"), () => {
	console.log("Server on port", app.get("port"));
});
