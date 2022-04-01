$(document).ready(function () {
	///// Prevent window reload
	$("#track-form").submit(function (e) {
		e.preventDefault();
		document.getElementById("track-form").reset();
		document.getElementById("default-track").src = "./tracks/Top13_Track.vtt";
	});
	///// Add button
	$("#add-btn").click(function () {
		$.post(
			"/editor",
			$("#track-form").serializeArray(),
			function (data, status) {
				console.log(data);
			}
		);
	});
	///// Edit button
	$("#edit-btn").click(function () {
		$.post("/test", $("#track-form").serializeArray(), function (data, status) {
			console.log(data);
		});
	});
	///// Delete button
	$("#delete-btn").click(function () {
		$.post(
			"/testdelete",
			$("#track-form").serializeArray(),
			function (data, status) {
				console.log(data);
			}
		);
	});
});

function UpdateFormFields(pCue) {
	if (pCue != undefined) {
		console.log(pCue);
		let lData = JSON.parse(pCue.text);
		document.getElementById("songs_number").value = pCue.id;
		document.getElementById("title").value = lData.title;
		document.getElementById("author").value = lData.author;
		document.getElementById("genre").value = lData.genre;
		document.getElementById("year").value = lData.year;
		document.getElementById("start_time").value = pCue.startTime;
		document.getElementById("end_time").value = pCue.endTime;
		document.getElementById("fullVideo").value = lData.fullVideo;
		document.getElementById("lyrics").value = lData.lyrics;
	} else {
		document.getElementById("track-form").reset();
	}
	// Testing
	$("#add-btn-container").addClass("d-none");
	$("#edit-btn-container").addClass("d-none");
	$("#delete-btn-container").addClass("d-none");
	if (pCue == undefined) {
		$("#add-btn-container").removeClass("d-none");
	} else {
		$("#edit-btn-container").removeClass("d-none");
		$("#delete-btn-container").removeClass("d-none");
	}
}
