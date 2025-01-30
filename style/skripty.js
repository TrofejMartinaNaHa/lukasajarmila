function scrollto_byid(obj_id, sp){
	if(!$(obj_id).length){return false}
	if(typeof sp==undefined) var sp = 500;
	$('html, body').animate({
		scrollTop: $(obj_id).offset().top
	}, sp);
}

function countToDate(domIdSelector, toDate, finishMessage){
	
	// Set the date we're counting down to
	var countDownDate = new Date(toDate).getTime();

	// Update the count down every 1 second
	var x = setInterval(function() {

		// Get todays date and time
		var now = new Date().getTime();

		// Find the distance between now an the count down date
		var distance = countDownDate - now;

		// Time calculations for days, hours, minutes and seconds
		var days = Math.floor(distance / (1000 * 60 * 60 * 24));
		var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
		var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
		var seconds = Math.floor((distance % (1000 * 60)) / 1000);

		// Display the result in the element with id="demo"
		document.getElementById(domIdSelector).innerHTML = days + " dní " + hours + " hodin "
		+ minutes + " minut " + seconds + " sekund";

		// If the count down is finished, write some text 
		if (distance < 0) {
			clearInterval(x);
			document.getElementById(domIdSelector).innerHTML = finishMessage;
		}
	}, 1000);
	
	
}


$(function(){
	// Poznamka
	/*
		Poznamka
		na nekolik radku
	*/
	
	$(".scroll_button").click( function(){
		var odkaz = $(this).attr('href');
		if(odkaz.length<2 || !$(odkaz).length){
			return false;
		}
		scrollto_byid(odkaz);
	});

	$('.gallery-item').magnificPopup({
		type:'image',
		gallery:{
			enabled: true
		}
	});
	
	$('#ytlogo1').magnificPopup({
		items: {
			src: 'https://www.youtube.com/watch?v=JKCQGhUms7w'
		},
		type: 'iframe' // this is default type
	});
		
	$('#myTabs a').click(function (e) {
		e.preventDefault()
		$(this).tab('show')
	})

	countToDate('dday', "May 31, 2025 13:30:00", "HURA!");

	//Get the button
	let mybutton = document.getElementById("btn-back-to-top");

	// When the user scrolls down 20px from the top of the document, show the button
	window.onscroll = function () {
		scrollFunction();
	};

	function scrollFunction() {
		if (
			document.body.scrollTop > 20 ||
			document.documentElement.scrollTop > 20
		) {
			mybutton.style.display = "block";
		} else {
			mybutton.style.display = "none";
		}
	}
	
	// When the user clicks on the button, scroll to the top of the document
	mybutton.addEventListener("click", backToTop);

	function backToTop() {
		scrollto_byid('#home');
	}

});
