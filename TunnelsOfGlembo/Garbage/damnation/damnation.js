const snd_squeak1 = new Audio("squeaks/1.ogg");
const snd_squeak2 = new Audio("squeaks/2.ogg");
const snd_squeak3 = new Audio("squeaks/3.ogg");
const snd_squeak4 = new Audio("squeaks/4.ogg");
const snd_squeak5 = new Audio("squeaks/5.ogg");
const snd_damn = new Audio("squeaks/damn.mp3");
var hash = document.location.hash.split(":");

function squeak() {
	//include another check here so it updates in realtime
	hash = document.location.hash.split(":");
	if (hash[0] == "#DAMN" || hash[0] == "#DAMNATION") {
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
var pukekos = [];

function new_pukeko(x_override = null, y_override = null) {
	let screenWidth = window.innerWidth - 320;
	let screenHeight = window.innerHeight - 160;
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
	pukekos.push(fresh_pukeko);
	let pukeko_node = pukeko_template.cloneNode(true);
	pukeko_node.querySelector(".pukeko_speech").textContent = fresh_pukeko.quote;
	pukeko_node.querySelector(".pukeko_bubble").setAttribute("class", "pukeko_bubble " + fresh_pukeko.box_colour);
	pukeko_node.querySelector(".pukeko_image").src = fresh_pukeko.sprite;
	pukeko_node.setAttribute("style", "top:"+fresh_pukeko.pos_y+"px; left:"+fresh_pukeko.pos_x+"px");
	
	document.getElementById("pukeko_space").appendChild(pukeko_node);
	squeak();
}

if (hash[0] == "#DAMNATION") {
	console.log("DAMNATION!!!! MODE ACTIVE!!! GOOD LUCK!!!");
	(function () {
		var interval = 2000;
		timer = function() {
			interval -= 20;
			new_pukeko();
			console.log("DAMNATION AT "+interval+"ms");
			interval = interval < 220 ? 220 : interval;
			if (pukekos.length < 200) {
				setTimeout(timer, interval);
			} else {
				console.log("DAMNATION COMPLETE!!!!!!");
				return
			}
		};
		timer();
	})();
} else {
	new_pukeko();
}
