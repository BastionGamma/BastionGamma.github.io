$(document).ready(function () {
	$('button').on('click', function(e) {
		$('.gif').fadeOut();

		var value = $('input').val(),
				url = "http://api.giphy.com/v1/gifs/search?q=" + value + "&api_key=9MZJw8INDF2Zb5NZyXYeRnE2dz4K6vfP&limit=5";

		$.ajax({
	    type: "GET",                                            // GET or POST
	    url: url,                                               // Path to file
	    timeout: 2000,                                          // Waiting time
	    beforeSend: function() {                                // Before Ajax 
	      $('body').append('<div id="load">Loading</div>');      // Load message
	    },
	    complete: function() {                                  // Once finished
	      $('#load').remove();                                  // Clear message
	    },
	    success: function(data) {                               // Show content
	    	console.log('Success!', data);

	      showGifs(data);
	    },
	    error: function(error) {                                     // Show error msg 
	      console.warn(error);
	    }
	  });

		// var xhr = $.getJSON("http://cors.io/?u=http://api.giphy.com/v1/gifs/search?q=" + value + "&api_key=9MZJw8INDF2Zb5NZyXYeRnE2dz4K6vfP&limit=5");

		// xhr.done(function(data) { 
		// 	console.log('Success!', data);

		// 	showGifs(data);
		// });
	});

	function showGifs(data) {
		$.each(data.data, function(d, i) {
			var template = '<img class="gif" src="' + this.bitly_gif_url + '">'

			console.log(template);

			// $('.gif-container').append(template);
		});
	}
});