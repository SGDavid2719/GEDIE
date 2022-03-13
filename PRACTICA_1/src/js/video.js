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
//							Volume						//
//////////////////////////////////////////////////////////

const lVolumeButton = document.getElementById("volume-btn");
const lVolume = document.getElementById("volume");
lVolume.addEventListener("input", updateVolume);
lVideo.addEventListener("volumechange", updateVolumeIcon);

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

	lVideo.volume = lVideo.value;
}

// updateVolumeIcon updates the volume icon so that it correctly reflects
// the volume of the video
function updateVolumeIcon() {
	lVolumeButton.setAttribute("data-title", "Mute (m)");

	if (lVideo.muted || lVideo.volume === 0) {
		$(".fa-volume-high").addClass("d-none");
		$(".fa-volume-low").addClass("d-none");
		$(".fa-volume-xmark").removeClass("d-none");
		volumeButton.setAttribute("data-title", "Unmute (m)");
	} else if (lVideo.volume > 0 && lVideo.volume <= 0.5) {
		volumeLow.classList.remove("hidden");
		$(".fa-volume-high").addClass("d-none");
		$(".fa-volume-low").removeClass("d-none");
		$(".fa-volume-xmark").addClass("d-none");
	} else {
		volumeHigh.classList.remove("hidden");
		$(".fa-volume-high").removeClass("d-none");
		$(".fa-volume-low").addClass("d-none");
		$(".fa-volume-xmark").addClass("d-none");
	}
}
