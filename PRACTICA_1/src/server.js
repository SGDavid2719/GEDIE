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

// Handling request
app.post("/request", (req, res) => {
	res.json([
		{
			name_recieved: req.body.name,
			designation_recieved: req.body.designation,
		},
	]);
});

// listening the server
app.listen(app.get("port"), () => {
	console.log("Server on port", app.get("port"));
});
