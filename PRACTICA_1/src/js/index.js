$(() => {
	loadImages();
});

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
