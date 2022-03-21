console.log(callServer());

function callServer() {
	var lData;
	$.ajax({
		type: "POST",
		url: "editor.php",
		data: { test: "Working" },
		async: false,
		success: function (lResult) {
			lData = lResult;
		},
	});
	return lData;
}
