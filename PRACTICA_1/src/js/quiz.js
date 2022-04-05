$(() => {
	$("#enableBtn").click(function () {
		lPlay = !lPlay;
		lQuizPuntuation = 0;
		if (lPlay) {
			$("#video-info").addClass("d-none");
		} else {
			$("#video-info").removeClass("d-none");
		}
	});
});

var lQuizPuntuation = 0;

var lQuiz = [
	{
		question: "Video's genre",
		answers: {
			a: "Heavy metal",
			b: "Pop",
			c: "Funk",
		},
		correctAnswer: "c",
	},
	{
		question: "Video's genre",
		answers: {
			a: "Pop",
			b: "House",
			c: "Blues",
		},
		correctAnswer: "a",
	},
	{
		question: "Video's genre",
		answers: {
			a: "Indie",
			b: "Balada",
			c: "Pop",
		},
		correctAnswer: "c",
	},
	{
		question: "Video's genre",
		answers: {
			a: "Folk",
			b: "Pop",
			c: "Rock",
		},
		correctAnswer: "b",
	},
	{
		question: "Video's genre",
		answers: {
			a: "Hip-Hop",
			b: "Pop",
			c: "Rap",
		},
		correctAnswer: "b",
	},
	{
		question: "Video's genre",
		answers: {
			a: "Rock",
			b: "Indie",
			c: "Indie-Rock",
		},
		correctAnswer: "c",
	},
	{
		question: "Video's genre",
		answers: {
			a: "Soul",
			b: "Blues",
			c: "Pop",
		},
		correctAnswer: "a",
	},
	{
		question: "Video's genre",
		answers: {
			a: "House",
			b: "Pop",
			c: "Soul",
		},
		correctAnswer: "b",
	},
	{
		question: "Video's genre",
		answers: {
			a: "Trap",
			b: "Hip-Hop",
			c: "Rap",
		},
		correctAnswer: "b",
	},
	{
		question: "Video's genre",
		answers: {
			a: "Pop",
			b: "Electronic",
			c: "Techno",
		},
		correctAnswer: "a",
	},
	{
		question: "Video's genre",
		answers: {
			a: "Soul",
			b: "Pop",
			c: "Indie",
		},
		correctAnswer: "b",
	},
	{
		question: "Video's genre",
		answers: {
			a: "Hip-Hop",
			b: "Soul",
			c: "Rap",
		},
		correctAnswer: "b",
	},
	{
		question: "Video's genre",
		answers: {
			a: "Rap",
			b: "Pop",
			c: "Hip-Hop",
		},
		correctAnswer: "b",
	},
	{
		question: "Video's genre",
		answers: {
			a: "Hip-Hop",
			b: "Pop",
			c: "Rap",
		},
		correctAnswer: "a",
	},
	{
		question: "Video's genre",
		answers: {
			a: "Folk",
			b: "Blues",
			c: "Pop",
		},
		correctAnswer: "c",
	},
	{
		question: "Video's genre",
		answers: {
			a: "Hip-Hop",
			b: "Pop",
			c: "Folk",
		},
		correctAnswer: "b",
	},
	{
		question: "Video's genre",
		answers: {
			a: "Pop",
			b: "Soul",
			c: "Indie",
		},
		correctAnswer: "c",
	},
	{
		question: "Video's genre",
		answers: {
			a: "House",
			b: "Electronic",
			c: "Pop",
		},
		correctAnswer: "a",
	},
	{
		question: "Video's genre",
		answers: {
			a: "Hip-Hop",
			b: "Reggaeton",
			c: "Rap",
		},
		correctAnswer: "a",
	},
	{
		question: "Video's genre",
		answers: {
			a: "Hip-Hop",
			b: "Pop",
			c: "Rap",
		},
		correctAnswer: "b",
	},
];
