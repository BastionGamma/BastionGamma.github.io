var showHome = function(){
	$('#wrapper').empty()
	$('#wrapper').hide().append($('#home_template').html()).fadeIn(300)

	$('#project_link').on("click", function(){
		showProject();
	})

	$('#resume_link').on("click", function(){
		showResume();
	})

	$('#contact_link').on("click", function(){
		showContact();
	})
}

var showResume = function(){
	$('#wrapper').empty()
	$('#wrapper').hide().append($('#resume_template').html()).fadeIn(300)

	$('#home_link').on("click", function(){
		showHome();
	})

	$('#project_link').on("click", function(){
		showProject();
	})

	$('#contact_link').on("click", function(){
		showContact();
	})
}

var showContact = function(){
	$('#wrapper').empty()
	$('#wrapper').hide().append($('#contact_template').html()).fadeIn(300)

	$('#home_link').on("click", function(){
		showHome();
	})

	$('#project_link').on("click", function(){
		showProject();
	})

	$('#resume_link').on("click", function(){
		showResume();
	})
}

var showProject = function(){
	$('#wrapper').empty()
	$('#wrapper').hide().append($('#project_template').html()).fadeIn(300)

	$('#home_link').on("click", function(){
		showHome();
	})

	$('#resume_link').on("click", function(){
		showResume();
	})

	$('#contact_link').on("click", function(){
		showContact();
	})
}

$(function(){
	$('#wrapper').append($('#home_template').html())

	$('#project_link').on("click", function(){
		showProject();
	})

	$('#resume_link').on("click", function(){
		showResume();
	})

	$('#contact_link').on("click", function(){
		showContact();
	})
})