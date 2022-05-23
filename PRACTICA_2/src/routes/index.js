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

// Set path to editor page
router.get("/chatpage", (req, res) => {
	res.render("chat", { title: "Chat" });
});

module.exports = router;
