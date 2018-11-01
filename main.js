$(document).ready(function () {
	$('button').on('click', function(e) {
		$('.gif').fadeOut();

		var value = $('input').val();

		var xhr = $.get("http://api.giphy.com/v1/gifs/search?q=" + value + "&api_key=9MZJw8INDF2Zb5NZyXYeRnE2dz4K6vfP&limit=5");

		xhr.done(function(data) { 
			showGifs(data);
		});
	});

	function showGifs(data) {
		$.each(data.data, function(d, i) {
			var template = '<img class="gif" src="' + this.embed_url + '">'

			$('.gif-container').append(template);
		});
	}
});