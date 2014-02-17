var turn = function(){
	var cube = $('#cube');
	cube.animate({
		"transform": "rotateY(75deg) rotate(75deg)",
		"-webkit-transform": "rotateY(75deg) rotateX(75deg)",
		"-moz-transform": "rotateY(75deg) rotateX(75deg)",
		"-ms-transform": "rotateY(75deg) rotateX(75deg)"
	}, 500)
}

$(function(){
	var turnButton = $('#turn');
	turnButton.on("click", function(){
		turn();
		console.log("Works")
	})
})