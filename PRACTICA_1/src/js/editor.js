$(document).ready(function () {
	$("#submit-btn").click(function () {
		$.post("/editor", $("form").serializeArray(), function (data, status) {
			console.log(data);
		});
	});
});
