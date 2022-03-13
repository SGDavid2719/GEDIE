// Select html elements by ID
const lVideo = document.getElementById("video");
const lVideoControls = document.getElementById("video-controls");

const playbackIcons = document.querySelectorAll(".playback-icons use");

// Gets if the video can be played by the user's browser
const lVideoWorks = !!document.createElement("video").canPlayType;
if (lVideoWorks) {
	// Hides native controls
	lVideo.controls = false;
	lVideoControls.classList.remove("hidden");
}

// Play button
const playButton = document.getElementById("play");
// Play event listener
//playButton.addEventListener("click", togglePlay());

//lVideo.addEventListener("play", updatePlayButton);
//lVideo.addEventListener("pause", updatePlayButton);

// Functions

function togglePlay() {
	if (lVideo.paused || lVideo.ended) {
		lVideo.play();
	} else {
		lVideo.pause();
	}
}

function updatePlayButton() {
	playbackIcons.forEach((icon) => icon.classList.toggle("hidden"));

	if (lVideo.paused) {
		playButton.setAttribute("data-title", "Play (k)");
	} else {
		playButton.setAttribute("data-title", "Pause (k)");
	}
}
