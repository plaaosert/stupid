// load sounds.
var snd_click = new Audio("sound/click.ogg");
var snd_ding = new Audio("sound/ding.ogg");
var snd_kaching = new Audio("sound/kaching.ogg");
var snd_splash = new Audio("sound/splash.ogg");
var snd_bigsplash = new Audio("sound/bigsplash.ogg");

// prepare localstorage.
if (localStorage.getItem("coins") === null) {
	localStorage.setItem("coins", 0);
}
if (localStorage.getItem("fishing_bait") === null) {
	localStorage.setItem("fishing_bait", 1); //you get one bait for free.
}
if (localStorage.getItem("fish_caught") === null) {
	localStorage.setItem("fish_caught", 0);
}

//plays a specific sound based on option string.
function sound_player(option) {
	switch (option) {
		case "click":
			snd_click.play();
			break;
		case "ding":
			snd_ding.play();
			break;
		case "sale":
			snd_kaching.play();
			break;
		case "splash":
			snd_splash.play();
			break;
		default:
			if (option) {
				console.log(option + " is not a valid sound.");
			} else {
				console.log("No sound given.");
			}
	}
}

//updates counters in bottom right
function update_counters() {
	document.getElementById("coinAmt").innerHTML = parseInt(localStorage.getItem("coins"));;
	document.getElementById("baitAmt").innerHTML = parseInt(localStorage.getItem("fishing_bait"));;
	document.getElementById("fishAmt").innerHTML = parseInt(localStorage.getItem("fish_caught"));;
}

class Fish {
	constructor(name, modifier, base_value) {
		this.name = name;
		this.modifier = modifier;
		if (Number.isInteger(base_value)) {
			this.base_value = base_value
		} else {
			this.base_value = -5;
		}
		this.true_value = Math.floor(base_value * (modifier / 2));
		this.sold = false;
		
		//fuk u dont break my fish
		if ((Number.isInteger(this.modifier) == false)) {
			this.modifier = -5;
		}
	}
	//gets string for fish modifier
	//from 1 to 8, with 8 being the highest.
	modifier_name() {
		switch(this.modifier) {
			case 1:
				return "lethargic";
			case 2:
				return "basic";
			case 3:
				return "uncommon";
			case 4:
				return "rare";
			case 5:
				return "ludicrous";
			case 6:
				return "unfathomable";
			case 7:
				return "legendary";
			case 8:
				return "pure gold";
			default:
				return "corrupted";
		}
	}
	//sells the fish
	sell() {
		if (this.sold !== true) {
			var fish_caught = parseInt(localStorage.getItem("fish_caught"));
			var money = parseInt(localStorage.getItem("coins"));
			localStorage.setItem("fish_caught", fish_caught += 1);
			localStorage.setItem("coins", money += this.true_value);
			this.true_value = 0;
			this.sold = true;
			sound_player("sale")
		} else {
			console.log("You can't sell a fish you've already sold!");
		}
	}
}