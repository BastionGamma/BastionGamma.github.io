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

	$(".home-link").click(function(e) {
		e.preventDefault();
    $('html, body').animate({
        scrollTop: $("#home-link").offset().top
    }, 1000);
	});

	$(".dev-link").click(function(e) {
		e.preventDefault();
    $('html, body').animate({
        scrollTop: $("#dev-link").offset().top
    }, 1000);
	});

	$(".resume-link").click(function(e) {
		e.preventDefault();
    $('html, body').animate({
        scrollTop: $("#resume-link").offset().top
    }, 1000);
	});

	$(".arrow-to-dev").click(function(e) {
		e.preventDefault();
    $('html, body').animate({
        scrollTop: $("#dev-link").offset().top
    }, 1000);
	});

	$(".arrow-to-res").click(function(e) {
		e.preventDefault();
    $('html, body').animate({
        scrollTop: $("#resume-link").offset().top
    }, 1000);
	});

	$(".arrow-to-top").click(function(e) {
		e.preventDefault();
    $('html, body').animate({
        scrollTop: $("#home-link").offset().top
    }, 1000);
	});
});

function parallaxScroll(){
	var scrolled = $(window).scrollTop();
	$('#parallax-bg').css('top', (0 - (scrolled * .75)) + 'px');
	$('#parallax-bg2').css('top', (0 - (scrolled * .50)) + 'px');
}

function redrawDotNav(){
	var section1Top =  0;
	var section2Top =  $('#dev-link').offset().top - (($('#resume-link').offset().top - $('#dev-link').offset().top) / 2);
	var section3Top =  $('#resume-link').offset().top - (($(document).height() - $('#resume-link').offset().top) / 2);
	$('nav#primary a').removeClass('active');
	if ($(document).scrollTop() >= section1Top && $(document).scrollTop() < section2Top){
		$('nav#primary a.home-link').addClass('active');
	} else if ($(document).scrollTop() >= section2Top && $(document).scrollTop() < section3Top){
		$('nav#primary a.dev-link').addClass('active');
	} else if ($(document).scrollTop() >= section3Top) {
		$('nav#primary a.resume-link').addClass('active');
	}
}