const express = require("express");
const router = express.Router();

// Set path to index page
router.get("/", (req, res) => {
	res.render("index", { title: "Video" });
});

// Set path to editor page
router.get("/editorpage", (req, res) => {
	res.render("editor", { title: "Editor" });
});

module.exports = router;
