const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
	res.render("index.html", { title: "P1" });
});

router.get("/secondpage", (req, res) => {
	res.render("editor.html", { title: "P1" });
});

module.exports = router;
