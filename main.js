$(document).ready(function () {
	$('button').on('click', function(e) {
		$('.gif').fadeOut();

		var value = $('input').val();

		var xhr = $.getJSON("https://cors.io/http://api.giphy.com/v1/gifs/search?q=" + value + "&api_key=9MZJw8INDF2Zb5NZyXYeRnE2dz4K6vfP&limit=5");

		xhr.done(function(data) { 
			console.log('Success!', data);

			showGifs(data);
		});
	});

	function showGifs(data) {
		$.each(data.data, function(d, i) {
			var template = '<img class="gif" src="' + this.bitly_gif_url + '">'

			console.log(template);

			// $('.gif-container').append(template);
		});
	}
});