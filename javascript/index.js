var hideAnimated_img = function (){
	var animatedJar = document.querySelector('#animated_img');
		animatedJar.style.visibility='hidden'
		setTimeout(function()
			{ animatedJar.style.visibility="visible" },
			 1000);
};