var lTrackData;

$(document).ready(function () {
	$("#addCueBtn").click(function () {
		UpdateFormFields(undefined);
		$("#formContainer").modal("show");
		$("#addBtn").removeClass("d-none");
		$("#editBtn").addClass("d-none");
	});

	$("#closeModal").click(function () {
		$("#formContainer").modal("toggle");
	});

	$("#closeBtn").click(function () {
		$("#formContainer").modal("toggle");
	});

	CreateTrackTable();

	///// Add button
	$("#addBtn").click(function () {
		let lFormData = $("#trackForm").serializeArray();

		let lValidInterval = CheckStartEndInterval(
			lFormData[6].value,
			lFormData[7].value
		);
		if (lValidInterval) {
			document.getElementById("previous_songs_number").value = "";
			$.post("/add", $("#trackForm").serializeArray(), function (data, status) {
				console.log(data);
			});
			window.location.reload();
		} else {
			///// Prevent window reload
			$("#trackForm").submit(function (e) {
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
	$("#editBtn").click(function () {
		let lFormData = $("#trackForm").serializeArray();

		let lValidInterval = CheckStartEndInterval(
			lFormData[6].value,
			lFormData[7].value
		);
		if (lValidInterval) {
			$.post("/edit", lFormData, function (data, status) {
				console.log(data);
			});
			window.location.reload();
		} else {
			///// Prevent window reload
			$("#trackForm").submit(function (e) {
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
		document.getElementById("trackForm").reset();
	}
}

function CheckStartEndInterval(pStartTime, pEndTime) {
	// let lAux = lTrackData.filter(
	// 	(elem) =>
	// 		elem.startTime < pStartTime.toString().toHHMMSS ||
	// 		elem.endTime > pEndTime.toString().toHHMMSS
	// );
	// console.log("lAux");
	// console.log(lAux);
	return parseInt(pStartTime) < parseInt(pEndTime);
}

String.prototype.toHHMMSS = function () {
	var sec_num = parseInt(this, 10); // don't forget the second param
	var hours = Math.floor(sec_num / 3600);
	var minutes = Math.floor((sec_num - hours * 3600) / 60);
	var seconds = sec_num - hours * 3600 - minutes * 60;

	if (hours < 10) {
		hours = "0" + hours;
	}
	if (minutes < 10) {
		minutes = "0" + minutes;
	}
	if (seconds < 10) {
		seconds = "0" + seconds;
	}
	return hours + ":" + minutes + ":" + seconds + ".000";
};

function CreateTrackTable() {
	///// Get cues
	$.get("/getCues", "", function (data, status) {
		lTrackData = data;

		let lTable = document.getElementById("track-table");
		// let lTHead = document.createElement("thead");
		let lTBody = document.createElement("tbody");

		for (let lCueIndex = 0; lCueIndex < lTrackData.length; lCueIndex++) {
			//// Text (JSON)
			let lTextData = JSON.parse(lTrackData[lCueIndex].text);
			///// ID
			let lHeaderRow = document.createElement("tr");
			let lRowTH = document.createElement("th");
			lRowTH.setAttribute("scope", "row");
			let lRowCellText = document.createTextNode(lTrackData[lCueIndex].id);
			lRowTH.appendChild(lRowCellText);
			lHeaderRow.appendChild(lRowTH);
			///// Title
			let lTitleCell = document.createElement("td");
			let lTitleCellText = document.createTextNode(lTextData.title);
			lTitleCell.appendChild(lTitleCellText);
			lHeaderRow.appendChild(lTitleCell);
			///// Start time
			let lStartTimeleCell = document.createElement("td");
			let lStartTimeCellText = document.createTextNode(
				lTrackData[lCueIndex].startTime
			);
			lStartTimeleCell.appendChild(lStartTimeCellText);
			lHeaderRow.appendChild(lStartTimeleCell);
			///// End time
			let lEndTimeCell = document.createElement("td");
			let lEndTimeCellText = document.createTextNode(
				lTrackData[lCueIndex].endTime
			);
			lEndTimeCell.appendChild(lEndTimeCellText);
			lHeaderRow.appendChild(lEndTimeCell);
			///// Author
			let lAuthorCell = document.createElement("td");
			let lAuthorCellText = document.createTextNode(lTextData.author);
			lAuthorCell.appendChild(lAuthorCellText);
			lHeaderRow.appendChild(lAuthorCell);
			///// Genre
			let lGenreCell = document.createElement("td");
			let lGenreCellText = document.createTextNode(lTextData.genre);
			lGenreCell.appendChild(lGenreCellText);
			lHeaderRow.appendChild(lGenreCell);
			///// Year
			let lFullVideCell = document.createElement("td");
			let lFullVideCellText = document.createTextNode(lTextData.year);
			lFullVideCell.appendChild(lFullVideCellText);
			lHeaderRow.appendChild(lFullVideCell);
			///// Lyrics
			let lFullVideoCell = document.createElement("td");
			let lFullVideoCellText = document.createTextNode(lTextData.fullVideo);
			lFullVideoCell.appendChild(lFullVideoCellText);
			lHeaderRow.appendChild(lFullVideoCell);
			///// Lyrics
			let lLyricsCell = document.createElement("td");
			let lLyricsCellText = document.createTextNode(lTextData.lyrics);
			lLyricsCell.appendChild(lLyricsCellText);
			lHeaderRow.appendChild(lLyricsCell);
			///// Delete button
			let lDeleteCell = document.createElement("td");
			let lDeteleButton = document.createElement("button");
			lDeteleButton.setAttribute("id", "deleteBtn" + lTrackData[lCueIndex].id);
			lDeteleButton.innerHTML = "<i class='fa-solid fa-trash-can'></i>";
			lDeteleButton.setAttribute(
				"onclick",
				"DeleteBtnOnClick(" + lTrackData[lCueIndex].id + ")"
			);
			lDeleteCell.appendChild(lDeteleButton);
			lHeaderRow.appendChild(lDeleteCell);
			///// Edit button
			let lEditCell = document.createElement("td");
			let lEditButton = document.createElement("button");
			lEditButton.setAttribute("id", "editBtn" + lTrackData[lCueIndex].id);
			lEditButton.innerHTML = "<i class='fa-solid fa-pen'></i>";
			lEditButton.setAttribute(
				"onclick",
				"EditBtnOnClick(" + lTrackData[lCueIndex].id + ")"
			);
			lEditCell.appendChild(lEditButton);
			lHeaderRow.appendChild(lEditCell);
			///// Append
			lTBody.appendChild(lHeaderRow);
			lTable.appendChild(lTBody);
		}
	});
}

function DeleteBtnOnClick(pID) {
	let lAux = lTrackData.filter((elem) => elem.id == pID);
	UpdateFormFields(lAux[0]);
	$.post("/delete", $("#trackForm").serializeArray(), function (data, status) {
		console.log(data);
	});
	window.location.reload();
}

function EditBtnOnClick(pID) {
	let lTrackDataFilter = lTrackData.filter((elem) => elem.id == pID);
	if (typeof lTrackDataFilter[0].startTime === "string") {
		///// Format start time
		let lAuxStartTime = lTrackDataFilter[0].startTime.split(".")[0].split(":");
		let lStartTimeInSeconds =
			+lAuxStartTime[0] * 60 * 60 + +lAuxStartTime[1] * 60 + +lAuxStartTime[2];
		lTrackDataFilter[0].startTime = lStartTimeInSeconds;
		///// Format end time
		let lAuxEndTime = lTrackDataFilter[0].endTime.split(".")[0].split(":");
		let lEndTimeInSeconds =
			+lAuxEndTime[0] * 60 * 60 + +lAuxEndTime[1] * 60 + +lAuxEndTime[2];
		lTrackDataFilter[0].endTime = lEndTimeInSeconds;
	}
	UpdateFormFields(lTrackDataFilter[0]);
	$("#formContainer").modal("show");
	$("#addBtn").addClass("d-none");
	$("#editBtn").removeClass("d-none");
}
