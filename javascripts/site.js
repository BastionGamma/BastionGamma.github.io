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

	$(".home_link").click(function(e) {
		e.preventDefault();
    $('html, body').animate({
        scrollTop: $("#home_link").offset().top
    }, 1000);
	});

	$(".dev_link").click(function(e) {
		e.preventDefault();
    $('html, body').animate({
        scrollTop: $("#dev_link").offset().top
    }, 1000);
	});

	$(".design_link").click(function(e) {
		e.preventDefault();
    $('html, body').animate({
        scrollTop: $("#design_link").offset().top
    }, 1000);
	});

	$(".resume_link").click(function(e) {
		e.preventDefault();
    $('html, body').animate({
        scrollTop: $("#resume_link").offset().top
    }, 1000);
	});

	$(".contact_link").click(function(e) {
		e.preventDefault();
    $('html, body').animate({
        scrollTop: $("#contact_link").offset().top
    }, 1000);
	});

	$(window).scroll(function () {
		$('#secondary').removeClass('.stick')
    winHeight = $(window).height();
    if ($(window).scrollTop() > winHeight) {
        $('#secondary').addClass('.stick');
    }
	});
});

function parallaxScroll(){
	var scrolled = $(window).scrollTop();
	$('#parallax-bg').css('top', (0 - (scrolled * .75)) + 'px');
	$('#parallax-bg2').css('top', (0 - (scrolled * .50)) + 'px');
}

function redrawDotNav(){
	var section1Top =  0;
	var section2Top =  $('#dev_link').offset().top - (($('#design_link').offset().top - $('#dev_link').offset().top) / 2);
	var section3Top =  $('#design_link').offset().top - (($('#resume_link').offset().top - $('#design_link').offset().top) / 2);
	var section4Top =  $('#resume_link').offset().top - (($('#contact_link').offset().top - $('#resume_link').offset().top) / 2);
	var section5Top =  $('#contact_link').offset().top - (($(document).height() - $('#contact_link').offset().top) / 2);
	$('nav#primary a').removeClass('active');
	if ($(document).scrollTop() >= section1Top && $(document).scrollTop() < section2Top){
		$('nav#primary a.home_link').addClass('active');
	} else if ($(document).scrollTop() >= section2Top && $(document).scrollTop() < section3Top){
		$('nav#primary a.dev_link').addClass('active');
	} else if ($(document).scrollTop() >= section3Top && $(document).scrollTop() < section4Top){
		$('nav#primary a.design_link').addClass('active');
	} else if ($(document).scrollTop() >= section4Top && $(document).scrollTop() < section5Top){
		$('nav#primary a.resume_link').addClass('active');
	} else if ($(document).scrollTop() >= section5Top){
		$('nav#primary a.contact_link').addClass('active');
	}
}