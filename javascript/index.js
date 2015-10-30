function hideAnimated_img(){
		document.getElementById('animated_img').style.display='none'
		setTimeout(function()
			{ document.getElementById("animated_img").style.display="inline" },
			 1000);
	};