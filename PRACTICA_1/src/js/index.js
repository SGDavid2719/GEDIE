$(() => {
	loadImages();
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
			document.getElementById("videos-title").innerHTML = lSong.includes("20")
				? "Top 20 - Singles"
				: "Top 13 - 90s Hits";
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
	let ret = '';
	for (let lIndex = 0; lIndex < lCues.length; lIndex++) {
		let lCue_Data = JSON.parse(lCues[lIndex].text);
		ret += '<a class="dropdown-item" href="#">' + "Top: " + lCues[lIndex].id + ". " + lCue_Data.title + '</a>'
	}
	lVideoIndex.innerHTML = ret;

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
	let lCueTime = lSelectedCue.startTime;

	let lVideo = document.getElementById("video");
	lVideo.currentTime = lCueTime;
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
			? lCover + "Top13_Cover.jpg"
			: lCover + "Top20_Cover.jpg";
	lImage.setAttribute("src", lCover);
	lImage.setAttribute("alt", lCover);
	// Append 'img' to 'a'
	lLink_Element.appendChild(lImage);
	// Append 'a' to 'div'
	lOtherVideos_Element.appendChild(lLink_Element);
}

function UpdateInfoSection(pData) {
	document.getElementById("song-title").innerHTML = pData.title;
	document.getElementById("songs-title").innerHTML = pData.title;
	document.getElementById("songs-author").innerHTML = pData.author;
	document.getElementById("songs-genre").innerHTML = pData.genre;
	document.getElementById("songs-year").innerHTML = pData.year;
	document.getElementById("songs-fullvideo").innerHTML =
		'<a href="' + pData.fullVideo + '">' + pData.fullVideo + "</a>";
	document.getElementById("songs-cover").setAttribute("src", pData.cover);
}
