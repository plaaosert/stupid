const snd_squeak1 = new Audio("squeaks/1.ogg");
const snd_squeak2 = new Audio("squeaks/2.ogg");
const snd_squeak3 = new Audio("squeaks/3.ogg");
const snd_squeak4 = new Audio("squeaks/4.ogg");
const snd_squeak5 = new Audio("squeaks/5.ogg");
const snd_damn = new Audio("squeaks/damn.mp3");

const snd_explosion = new Audio("squeaks/explosion.ogg");
const snd_clank = new Audio("squeaks/clank.ogg");

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
var purge_ready = false;

function new_pukeko(x_override = null, y_override = null, no_sound = false, type_override = null) {
	if (pukekos.length > 1000) {
		console.log("PUKEKO SINGULARITY ACHIEVED. ANNIHILATION IMMINENT");
		purge_pukekos();
		return
	}
	let screenWidth = window.innerWidth + 40;
	let screenHeight = window.innerHeight + 20;
	
	fresh_pukeko = new pukeko(0,0, type_override);
	pukekos.push(fresh_pukeko);
	let pukeko_node = pukeko_template.cloneNode(true);
	pukeko_node.querySelector(".pukeko_speech").textContent = fresh_pukeko.quote;
	pukeko_node.querySelector(".pukeko_bubble").setAttribute("class", "pukeko_bubble " + fresh_pukeko.box_colour);
	pukeko_node.querySelector(".pukeko_image").src = fresh_pukeko.sprite;
	document.getElementById("pukeko_space").appendChild(pukeko_node);
	
	
	let pukeko_box = pukeko_node.getBoundingClientRect()
	if (x_override != null) {
		fresh_pukeko.pos_x = x_override;
	} else {
		fresh_pukeko.pos_x = Math.floor(Math.random() * (screenWidth - pukeko_box.width));
	}
	if (y_override != null) {
		fresh_pukeko.pos_y = y_override;
	} else {
		fresh_pukeko.pos_y = Math.floor(Math.random() * (screenHeight - pukeko_box.height));
	}
	pukeko_node.setAttribute("style", "top:"+fresh_pukeko.pos_y+"px; left:"+fresh_pukeko.pos_x+"px");
	if (no_sound == false) {
		squeak();
	}
	if (pukekos.length >= 50 && purge_ready != true) {
		snd_clank.cloneNode().play();
		document.getElementById("purge").style.display = "block";
		purge_ready = true;
	}
}

function debug_pukeko(amt) {
	if (amt > 1000 || pukekos.length + amt > 1000) {
		console.log("TOO MUCH!!!!!!!!!!! (greater than 2500)");
		return
	}
	console.log("DAMN!!!!!! "+amt+" PUKEKOS INCOMING!!!!!!!!!!"); 
	for (let i = 0; i < amt; i++) {
		new_pukeko(null,null,true);
	}
}

//this entire city must be purged
function purge_pukekos() {
	let plagued_pukekos = document.getElementsByClassName("pukeko");
	snd_explosion.cloneNode().play();
	snd_damn.cloneNode().play();
	for (let i = pukekos.length; i > 0; --i) {
		plagued_pukekos[i].remove();
	}
	pukekos = [];
	document.getElementById("purge").style.display = "none";
	new_pukeko();
	purge_ready = false;
	console.log("IT IS DONE.");
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
	console.log("DAMN!!!!")
	new_pukeko();
}
