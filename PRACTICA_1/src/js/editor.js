// $(document).ready(function () {
// 	$("#submit-btn").click(function () {
// 		$.post("/editor", $("form").serializeArray(), function (data, status) {
// 			console.log(data);
// 		});
// 	});
// });

$(document).ready(function () {
	$("#submit-btn").click(function () {
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
	// Testing
	$("#add-btn-container").addClass("d-none");
	$("#edit-btn-container").addClass("d-none");
	$("#delete-btn-container").addClass("d-none");
	if (pCue.id == undefined) {
		$("#add-btn-container").removeClass("d-none");
	} else {
		$("#edit-btn-container").removeClass("d-none");
		$("#delete-btn-container").removeClass("d-none");
	}
}
