$(function(){

	redrawDotNav();

	$(window).bind('scroll', function(e){
		parallaxScroll();
		redrawDotNav();
	});

	$('nav#primary a').hover(
		function(){
			$(this).prev('h1').show();
		},
		function(){
			$(this).prev('h1').hide();
		}
	);

});

function parallaxScroll(){
	var scrolled = $(window).scrollTop();
	$('#parallax-bg').css('top', (0 - (scrolled * .25)) + 'px');
	$('#parallax-bg2').css('top', (0 - (scrolled * .50)) + 'px');
	$('#parallax-bg3').css('top', (0 - (scrolled * .75)) + 'px');
}

function redrawDotNav(){
	var section1Top =  0;
	var section2Top =  $('#project_link').offset().top - (($('#resume_link').offset().top - $('#project_link').offset().top) / 2);
	var section3Top =  $('#resume_link').offset().top - (($('#contact_link').offset().top - $('#resume_link').offset().top) / 2);
	var section4Top =  $('#contact_link').offset().top - (($(document).height() - $('#contact_link').offset().top) / 2);;
	$('nav#primary a').removeClass('active');
	if($(document).scrollTop() >= section1Top && $(document).scrollTop() < section2Top){
		$('nav#primary a.home_link').addClass('active');
	} else if ($(document).scrollTop() >= section2Top && $(document).scrollTop() < section3Top){
		$('nav#primary a.project_link').addClass('active');
	} else if ($(document).scrollTop() >= section3Top && $(document).scrollTop() < section4Top){
		$('nav#primary a.resume_link').addClass('active');
	} else if ($(document).scrollTop() >= section4Top){
		$('nav#primary a.contact_link').addClass('active');
	}
}