const lUrl = new URL(window.location.href);
var lSong = "/video/";
lSong =
	lUrl.searchParams.get("song") == null
		? lSong + "Top_20.mp4"
		: lSong + lUrl.searchParams.get("song");

const lEditorUrl = window.location.href;

lSong = lEditorUrl.includes("editorpage") ? "/video/Top_13.mp4" : lSong;

$(() => {
	try {
		loadVideo();
		getCurrentCueData();
	} catch (lException) {
		console.log(lException);
	}
});

//////////////////////////////////////////////////////////
//						Load Video						//
//////////////////////////////////////////////////////////

function loadVideo() {
	let lVideo_Element = document.getElementById("video");
	let lSource = document.createElement("source");
	let lTrack = document.createElement("track");
	let lSubtitle = document.createElement("track");
	let lVideo_Can_Be_Played;
	try {
		lVideo_Can_Be_Played = lVideo_Element.canPlayType("video/mp4");
		if (lVideo_Can_Be_Played) {
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
			if (document.getElementById("videos-title") != null) {
				document.getElementById("videos-title").innerHTML = lSong.includes("20")
					? "Top 20 - Singles"
					: "Top 13 - 90s Hits";
			}
			// Change video's track
			let lSrcTrack = "/tracks/";
			lSrcTrack =
				lSong == "/video/Top_20.mp4"
					? lSrcTrack + "Top20_Track.vtt"
					: lSrcTrack + "Top13_Track.vtt";
			lTrack.setAttribute("id", "default-track");
			lTrack.setAttribute("label", "Metadata");
			lTrack.setAttribute("kind", "metadata");
			lTrack.setAttribute("srclang", "en");
			lTrack.setAttribute("src", lSrcTrack);
			lTrack.setAttribute("default", true);
			// Set event listener
			lTrack.addEventListener("load", function () {
				loadIndex(lTrack.track);
			});
			// Change video's subtitles
			let lSrcSubtitle = "/tracks/";
			lSrcSubtitle =
				lSong == "/video/Top_20.mp4"
					? lSrcSubtitle + "Top20_Subtitles.vtt"
					: lSrcSubtitle + "Top13_Subtitles.vtt";
			lSubtitle.setAttribute("label", "English");
			lSubtitle.setAttribute("kind", "subtitles");
			lSubtitle.setAttribute("srclang", "en");
			lSubtitle.setAttribute("src", lSrcSubtitle);
			lSubtitle.setAttribute("mode", "hidden");
		}
		lVideo_Element.appendChild(lSource);
		lVideo_Element.appendChild(lTrack);
		lVideo_Element.appendChild(lSubtitle);
		// Disable each captioning track
		for (var lIndex = 0; lIndex < lVideo_Element.textTracks.length; lIndex++) {
			if (lVideo_Element.textTracks[lIndex].kind === "subtitles") {
				lVideo_Element.textTracks[lIndex].mode = "hidden";
			}
		}
	} catch (lError) {
		console.log(lError);
	}
}

//////////////////////////////////////////////////////////
//						Load Index						//
//////////////////////////////////////////////////////////

function loadIndex(pTrack) {
	let lCues = pTrack.cues;
	let lVideoIndex = document.getElementById("song-list-btn");
	let lList = "";
	for (let lIndex = 0; lIndex < lCues.length; lIndex++) {
		let lCue_Data = JSON.parse(lCues[lIndex].text);
		lList +=
			'<a class="dropdown-item" href="#">' +
			"Top: " +
			lCues[lIndex].id +
			". " +
			lCue_Data.title +
			"</a>";
	}
	// Create event listener
	lVideoIndex.innerHTML = lList;
	$(".dropdown-item").click(function (e) {
		e.preventDefault();
		setActiveCue($(this).html());
	});
}

function setActiveCue(pActiveCue) {
	pActiveCue = pActiveCue.slice(
		pActiveCue.indexOf(":") + 2,
		pActiveCue.indexOf(".")
	);
	pActiveCue = pActiveCue.replace('<a href="">', "");

	let lTracks = document.querySelector("video").textTracks;

	let lSelectedCue = lTracks[0].cues.getCueById(pActiveCue);
	let lCueTime;

	if (lSelectedCue != null) {
		lCueTime = lSelectedCue.startTime;
		let lVideo = document.getElementById("video");
		lVideo.currentTime = lCueTime;
	}
}

//////////////////////////////////////////////////////////
//						   Cues						    //
//////////////////////////////////////////////////////////

function getCurrentCueData() {
	var lVideoElement = document.querySelector("video");
	// Get all text tracks for the current player.
	var lTracks_Array = lVideoElement.textTracks;

	for (var i = 0; i < lTracks_Array.length; i++) {
		var lTrack = lTracks_Array[i];

		// Find the English captions track and mark it as "showing".
		if (lTrack.kind === "metadata" && lTrack.language === "en") {
			lTrack.mode = "showing";
			lTrack.oncuechange = function () {
				// Obtenemos el cue en cuestión
				if (this.activeCues.length == 1) {
					lCue = this.activeCues[0];
				} else {
					lCue = this.activeCues[1];
				}

				// Control de errores
				if (lCue == null) {
					if (lEditorUrl.includes("editorpage")) UpdateFormFields(undefined);
					console.log("Cue null!");
					return;
				}

				// Pasamos el cue a un objeto de JS mediante la función parse
				if (document.getElementById("video-info") != null) {
					UpdateInfoSection(JSON.parse(lCue.text));
				}

				if (lEditorUrl.includes("editorpage")) {
					UpdateFormFields(lCue);
				}
			};
		}
	}
}
