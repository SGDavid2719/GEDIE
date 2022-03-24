/* -------------------- Init -------------------- */

const lVideo = document.getElementById("video");
const lVideoControls = document.getElementById("video-controls");

// Gets if the video can be played by the user's browser
const lVideoWorks = !!document.createElement("video").canPlayType;
if (lVideoWorks) {
	// Hides native controls
	lVideo.controls = false;
	lVideoControls.classList.remove("hidden");
}

//////////////////////////////////////////////////////////
//					Play-Pause Buttons					//
//////////////////////////////////////////////////////////

const lPlayButton = document.getElementById("play");
lPlayButton.addEventListener("click", togglePlay);
lVideo.addEventListener("play", updatePlayButton);
lVideo.addEventListener("pause", updatePlayButton);

lVideo.addEventListener("click", togglePlay);

//////////////////////////////////////////////////////////
//						Time elapsed					//
//////////////////////////////////////////////////////////

const lTimeElapsed = document.getElementById("time-elapsed");
const lDuration = document.getElementById("duration");
lVideo.addEventListener("loadedmetadata", initializeVideo);
lVideo.addEventListener("timeupdate", updateTimeElapsed);

//////////////////////////////////////////////////////////
//						Progress bar					//
//////////////////////////////////////////////////////////

const lProgressBar = document.getElementById("progress-bar");
const lSeek = document.getElementById("seek");
lVideo.addEventListener("timeupdate", updateProgress);
const lSeekTooltip = document.getElementById("seek-tooltip");
lSeek.addEventListener("mousemove", updateSeekTooltip);
lSeek.addEventListener("input", skipAhead);

//////////////////////////////////////////////////////////
//						Volume							//
//////////////////////////////////////////////////////////

const lVolumeButton = document.getElementById("volume-btn");
const lVolume = document.getElementById("volume");
lVolume.addEventListener("input", updateVolume);
lVideo.addEventListener("volumechange", updateVolumeIcon);
lVolumeButton.addEventListener("click", toggleMute);

//////////////////////////////////////////////////////////
//						Full-Screen						//
//////////////////////////////////////////////////////////

const lFullscreenButton = document.getElementById("fullscreen-btn");
const lVideoContainer = document.getElementById("video-container");
lFullscreenButton.onclick = toggleFullScreen;
lVideoContainer.addEventListener("fullscreenchange", updateFullscreenButton);

//////////////////////////////////////////////////////////
//						Captions						//
//////////////////////////////////////////////////////////

const lCaptionsButton = document.getElementById("captioning-btn");
lCaptionsButton.onclick = toggleCaptioning;

//////////////////////////////////////////////////////////
//					Keyboard shortcuts					//
//////////////////////////////////////////////////////////

const lEditorUrl = window.location.href;
if (!lEditorUrl.includes("editorpage"))
	document.addEventListener("keyup", keyboardShortcuts);

/* -------------------- Functions -------------------- */

//////////////////////////////////////////////////////////
//					Play-Pause Buttons					//
//////////////////////////////////////////////////////////

function togglePlay() {
	if (lVideo.paused || lVideo.ended) {
		lVideo.play();
	} else {
		lVideo.pause();
	}
}

function updatePlayButton() {
	if (lVideo.paused) {
		$(".fa-pause").addClass("d-none");
		$(".fa-play").removeClass("d-none");
		document.querySelector("#play span").setAttribute("title", "Play (k)");
	} else {
		$(".fa-pause").removeClass("d-none");
		$(".fa-play").addClass("d-none");
		document.querySelector("#play span").setAttribute("title", "Pause (k)");
	}
}

//////////////////////////////////////////////////////////
//						Time elapsed					//
//////////////////////////////////////////////////////////

function formatTime(lTimeInSeconds) {
	const lResult = new Date(lTimeInSeconds * 1000).toISOString().substr(11, 8);

	return {
		minutes: lResult.substr(3, 2),
		seconds: lResult.substr(6, 2),
	};
}

function initializeVideo() {
	const lVideoDuration = Math.round(lVideo.duration);
	lSeek.setAttribute("max", lVideoDuration);
	lProgressBar.setAttribute("max", lVideoDuration);
	const lTime = formatTime(lVideoDuration);
	lDuration.innerText = `${lTime.minutes}:${lTime.seconds}`;
	lDuration.setAttribute("datetime", `${lTime.minutes}m ${lTime.seconds}s`);
}

function updateTimeElapsed() {
	const lTime = formatTime(Math.round(lVideo.currentTime));
	lTimeElapsed.innerText = `${lTime.minutes}:${lTime.seconds}`;
	lTimeElapsed.setAttribute("datetime", `${lTime.minutes}m ${lTime.seconds}s`);
}

//////////////////////////////////////////////////////////
//						Progress bar					//
//////////////////////////////////////////////////////////

function updateProgress() {
	lSeek.value = Math.floor(lVideo.currentTime);
	lProgressBar.value = Math.floor(lVideo.currentTime);
}

function updateSeekTooltip(pEvent) {
	const lSkipTo = Math.round(
		(pEvent.offsetX / pEvent.target.clientWidth) *
			parseInt(pEvent.target.getAttribute("max"), 10)
	);
	lSeek.setAttribute("data-seek", lSkipTo);
	const lTime = formatTime(lSkipTo);
	lSeekTooltip.textContent = `${lTime.minutes}:${lTime.seconds}`;
	const lRect = lVideo.getBoundingClientRect();
	lSeekTooltip.style.left = `${pEvent.pageX - lRect.left}px`;
}

function skipAhead(pEvent) {
	const skipTo = pEvent.target.dataset.seek
		? pEvent.target.dataset.seek
		: pEvent.target.value;
	lVideo.currentTime = skipTo;
	lProgressBar.value = skipTo;
	lSeek.value = skipTo;
}

//////////////////////////////////////////////////////////
//							Volume						//
//////////////////////////////////////////////////////////

function updateVolume() {
	if (lVideo.muted) {
		lVideo.muted = false;
	}
	lVideo.volume = lVolume.value;
}

// updateVolumeIcon updates the volume icon so that it correctly reflects
// the volume of the video
function updateVolumeIcon() {
	document.querySelector("#volume-btn span").setAttribute("title", "Mute (m)");

	if (lVideo.muted || lVideo.volume === 0) {
		$(".fa-volume-high").addClass("d-none");
		$(".fa-volume-low").addClass("d-none");
		$(".fa-volume-xmark").removeClass("d-none");
		document
			.querySelector("#volume-btn span")
			.setAttribute("title", "Unmute (m)");
	} else if (lVideo.volume > 0 && lVideo.volume <= 0.5) {
		$(".fa-volume-high").addClass("d-none");
		$(".fa-volume-low").removeClass("d-none");
		$(".fa-volume-xmark").addClass("d-none");
	} else {
		$(".fa-volume-high").removeClass("d-none");
		$(".fa-volume-low").addClass("d-none");
		$(".fa-volume-xmark").addClass("d-none");
	}
}

// toggleMute mutes or unmutes the video when executed
// When the video is unmuted, the volume is returned to the value
// it was set to before the video was muted
function toggleMute() {
	lVideo.muted = !lVideo.muted;

	if (lVideo.muted) {
		lVolume.setAttribute("data-volume", lVolume.value);
		lVolume.value = 0;
	} else {
		lVolume.value = lVolume.dataset.volume;
	}
}

//////////////////////////////////////////////////////////
//						Full-Screen						//
//////////////////////////////////////////////////////////

// toggleFullScreen toggles the full screen state of the video
// If the browser is currently in fullscreen mode,
// then it should exit and vice versa.
function toggleFullScreen() {
	if (document.fullscreenElement) {
		document.exitFullscreen();
		$("#video").removeClass("fullScreen");
		$("#video-controls").removeClass("bottom-bar");
	} else if (document.webkitFullscreenElement) {
		// Need this to support Safari
		document.webkitExitFullscreen();
		$("#video").removeClass("fullScreen");
		$("#video-controls").removeClass("bottom-bar");
	} else if (lVideoContainer.webkitRequestFullscreen) {
		// Need this to support Safari
		lVideoContainer.webkitRequestFullscreen();
		$("#video").addClass("fullScreen");
		$("#video-controls").addClass("bottom-bar");
	} else {
		lVideoContainer.requestFullscreen();
		$("#video").addClass("fullScreen");
		$("#video-controls").addClass("bottom-bar");
	}
}

function updateFullscreenButton() {
	if (document.fullscreenElement) {
		document
			.querySelector("#fullscreen-btn span")
			.setAttribute("title", "Exit full screen (f)");
		$(".fa-compress").removeClass("d-none");
		$(".fa-expand").addClass("d-none");
	} else {
		document
			.querySelector("#fullscreen-btn span")
			.setAttribute("title", "Full screen (f)");
		$(".fa-expand").removeClass("d-none");
		$(".fa-compress").addClass("d-none");
	}
}

//////////////////////////////////////////////////////////
//						Captions						//
//////////////////////////////////////////////////////////

function toggleCaptioning() {
	console.log(lVideo);
	console.log(lVideo.textTracks);

	// Get all text tracks for the current player.
	var lTracks = lVideo.textTracks;

	for (var lIndex = 0; lIndex < lTracks.length; lIndex++) {
		var lTrack = lTracks[lIndex];

		// Find the English captions track and mark it as "showing".
		if (lTrack.kind === "subtitles" && lTrack.language === "en") {
			if (lTrack.mode == "showing") {
				lTrack.mode = "hidden";
			} else {
				lTrack.mode = "showing";
				document.getElementById("subtitles-label").innerHTML = lTrack;
			}
		}
	}
}

//////////////////////////////////////////////////////////
//					Keyboard shortcuts					//
//////////////////////////////////////////////////////////

// keyboardShortcuts executes the relevant functions for
// each supported shortcut key
function keyboardShortcuts(event) {
	const { key } = event;
	switch (key) {
		case "k":
			togglePlay();
			animatePlayback();
			if (video.paused) {
				showControls();
			} else {
				setTimeout(() => {
					hideControls();
				}, 2000);
			}
			break;
		case "m":
			toggleMute();
			break;
		case "f":
			toggleFullScreen();
			break;
		case "Escape":
			if (document.fullscreenElement) {
				toggleFullScreen();
			}
			break;
		case "c":
			toggleCaptioning();
			break;
	}
}
