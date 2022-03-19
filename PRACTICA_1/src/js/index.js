const lUrl = new URL(window.location.href);
var lSong = "/video/";
lSong =
	lUrl.searchParams.get("song") == null
		? lSong + "Top_20.mp4"
		: lSong + lUrl.searchParams.get("song");

loadVideo();
loadImages();
getCurrentCueData();

//////////////////////////////////////////////////////////
//						Load Video						//
//////////////////////////////////////////////////////////

function loadVideo() {
	let lVideo_Element = document.getElementById("video");
	let lSource = document.createElement("source");
	let lTrack = document.createElement("track");
	if (lVideo_Element.canPlayType("video/mp4")) {
		// Set video
		lSource.setAttribute("src", lSong);
		lSource.setAttribute("type", "video/mp4");
		// Set cover
		let lCover = "/images/";
		lCover =
			lSong == "/video/Top_20.mp4"
				? lCover + "Top20_Cover.png"
				: lCover + "Top13_Cover.png";
		// Change poster
		lVideo_Element.setAttribute("poster", lCover);
		// Change title
		document.getElementById("videos-title").innerHTML = lSong.includes("20")
			? "Top 20 - Singles"
			: "Top 13 - 90s Hits";
		// Change video's track
		let lSrcTrack = "/tracks/";
		lSrcTrack =
			lSong == "/video/Top_20.mp4"
				? lCover + "Top20_Track.vtt"
				: lCover + "Top13_Track.vtt";
		lTrack.setAttribute("label", "Metadata");
		lTrack.setAttribute("kind", "metadata");
		lTrack.setAttribute("srclang", "en");
		lTrack.setAttribute("src", "/tracks/Top20_Track.vtt");
		lTrack.setAttribute("default", true);
	}
	lVideo_Element.appendChild(lSource);
	lVideo_Element.appendChild(lTrack);
}

//////////////////////////////////////////////////////////
//						Load Images						//
//////////////////////////////////////////////////////////

function loadImages() {
	// Get 'div'
	let lOtherVideos_Element = document.getElementById("other-videos");
	// Create an 'a' tag
	let lLink_Element = document.createElement("a");
	let lAll_URL = window.location.href;
	let lReal_URL = lAll_URL.substr(0, lAll_URL.indexOf("/"));
	let lRedirect_URL = lReal_URL + "/?song=";
	lRedirect_URL =
		lSong == "/video/Top_20.mp4"
			? lRedirect_URL + "Top_13.mp4"
			: lRedirect_URL + "Top_20.mp4";
	lLink_Element.setAttribute("href", lRedirect_URL);
	// Create an 'img' tag'
	let lImage = document.createElement("img");
	let lCover = "/images/";
	lCover =
		lSong == "/video/Top_20.mp4"
			? lCover + "Top13_Cover.png"
			: lCover + "Top20_Cover.png";
	lImage.setAttribute("src", lCover);
	lImage.setAttribute("alt", lCover);
	// Append 'img' to 'a'
	lLink_Element.appendChild(lImage);
	// Append 'a' to 'div'
	lOtherVideos_Element.appendChild(lLink_Element);
}

//////////////////////////////////////////////////////////
//						   Cues						    //
//////////////////////////////////////////////////////////

function getCurrentCueData() {
	var videoElement = document.querySelector("video");
	// Get all text tracks for the current player.
	var tracks = videoElement.textTracks;

	for (var i = 0; i < tracks.length; i++) {
		var track = tracks[i];

		// Find the English captions track and mark it as "showing".
		if (track.kind === "metadata" && track.language === "en") {
			track.mode = "showing";
			track.oncuechange = function () {
				// Obtenemos el cue en cuestión
				if (this.activeCues.length == 1) {
					cue = this.activeCues[0];
				} else {
					cue = this.activeCues[1];
				}

				// Control de errores
				if (cue == null) {
					console.log("Cue null!");
					return;
				}

				// Pasamos el cue a un objeto de JS mediante la función parse
				var obj = JSON.parse(cue.text);
				updateInfoSection(obj);
			};
		}
	}
}

function updateInfoSection(pData) {
	console.log(pData);
	document.getElementById("songs-title").innerHTML = pData.title;
	document.getElementById("songs-author").innerHTML = pData.author;
	document.getElementById("songs-genre").innerHTML = pData.genre;
	document.getElementById("songs-year").innerHTML = pData.year;
	document.getElementById("songs-fullvideo").innerHTML = pData.fullVideo;
}
