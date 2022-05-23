$(document).ready(function () {
	$("#showChatButton").click(() => {
		console.log("?");

		$("#chatModal").show();
	});

	$("#closeChatModal").click(() => {
		console.log("?");

		$("#chatModal").hide();
	});

	$("#userChatSendButton").click(() => {
		send();

		$("#userChatForm").submit(function (e) {
			e.preventDefault();
		});
	});
});
