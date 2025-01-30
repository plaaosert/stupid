const snd_squeak1 = new Audio("squeaks/1.ogg");
const snd_squeak2 = new Audio("squeaks/2.ogg");
const snd_squeak3 = new Audio("squeaks/3.ogg");
const snd_squeak4 = new Audio("squeaks/4.ogg");
const snd_squeak5 = new Audio("squeaks/5.ogg");
const snd_damn = new Audio("squeaks/damn.mp3");

var screenWidth = window.innerWidth - 600;
var screenHeight = window.innerHeight - 200;


function squeak() {
	let hash = document.location.hash.split(":");
	if (hash[0] == "#DAMN") {
		snd_damn.cloneNode().play();
	} else {
		let x = Math.floor(Math.random() * 5) + 1;
		switch(x) {
			case 1:
				snd_squeak1.cloneNode().play();
				return
			case 2:
				snd_squeak2.cloneNode().play();
				return
			case 3:
				snd_squeak3.cloneNode().play();
				return
			case 4:
				snd_squeak4.cloneNode().play();
				return
			case 5:
				snd_squeak5.cloneNode().play();
				return
			default:
				console.log("Failed to find a valid sound.");
				snd_squeak1.cloneNode().play();
				return
		}
	}
}
const pukeko_template = document.querySelector(".pukeko");

function new_pukeko(x_override = null, y_override = null) {
	let x, y;
	if (x_override != null) {
		x = x_override;
	} else {
		x = Math.floor(Math.random() * screenWidth);
	}
	if (y_override != null) {
		y = y_override;
	} else {
		y = Math.floor(Math.random() * screenHeight);
	}
	
	fresh_pukeko = new pukeko(x, y);
	let pukeko_node = pukeko_template.cloneNode(true);
	pukeko_node.querySelector(".pukeko_speech").textContent = fresh_pukeko.quote;
	pukeko_node.querySelector(".pukeko_image").src = fresh_pukeko.sprite;
	pukeko_node.setAttribute("style", "top:"+y+"px; left:"+x+"px");
	
	document.getElementById("pukeko_space").appendChild(pukeko_node);
	squeak();
}