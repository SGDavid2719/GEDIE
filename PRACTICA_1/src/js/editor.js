$(document).ready(function () {
	///// Add button
	$("#add-btn").click(function () {
		let lFormData = $("#track-form").serializeArray();

		let lValidInterval = CheckStartEndInterval(
			lFormData[6].value,
			lFormData[7].value
		);
		if (lValidInterval) {
			document.getElementById("previous_songs_number").value = "";
			$.post(
				"/add",
				$("#track-form").serializeArray(),
				function (data, status) {
					console.log(data);
				}
			);
			$("#track-form").submit(function (e) {
				window.location.reload();
			});
		} else {
			///// Prevent window reload
			$("#track-form").submit(function (e) {
				e.preventDefault();
			});
			Swal.fire({
				icon: "error",
				title: "Oops...",
				text: "Wrong time interval",
				footer: "",
			});
		}
	});
	///// Edit button
	$("#edit-btn").click(function () {
		$.post("/edit", $("#track-form").serializeArray(), function (data, status) {
			console.log(data);
		});
	});
	///// Delete button
	$("#delete-btn").click(function () {
		$.post(
			"/delete",
			$("#track-form").serializeArray(),
			function (data, status) {
				console.log(data);
			}
		);
	});
});

function UpdateFormFields(pCue) {
	if (pCue != undefined) {
		let lData = JSON.parse(pCue.text);
		document.getElementById("previous_songs_number").value = pCue.id;
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

function CheckStartEndInterval(pStartTime, pEndTime) {
	console.log(pStartTime, pEndTime);
	return parseInt(pStartTime) < parseInt(pEndTime);
}
