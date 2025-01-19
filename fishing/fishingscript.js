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

//cookie functions. i'm afraid of these.
function cookie_creator(name, value, mins) {
	if (mins) {
		var date = new Date();
		date.setTime(date.getTime() + (mins * 60 * 1000));
		var expires = "; expires="+date.toGMTString();
	} else {
		var expires = "";
	}
	document.cookie = name + "=" + value + expires + "; path=/";
}
function delete_cookie(name) {
  document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}
//msdn my beloved coming in clutch
function getRandomArbitrary(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}


//updates counters in bottom right
function update_counters() {
	document.getElementById("coinAmt").innerHTML = parseInt(localStorage.getItem("coins"));;
	document.getElementById("baitAmt").innerHTML = parseInt(localStorage.getItem("fishing_bait"));;
	document.getElementById("fishAmt").innerHTML = parseInt(localStorage.getItem("fish_caught"));;
}

function reset_buttons() {
	document.getElementById("buttons").innerHTML = "<button id='btnBait' onclick='buy_bait()'>Buy Bait</button><button id='btnFishing' onclick='go_fishing()'>Start Fishing</button>"
	document.getElementById("innertext").innerHTML = "You could always catch more fish.";
}

class Fish {
	constructor(name, type, modifier, base_value) {
		this.name = name;
		this.modifier = modifier;
		this.type = type;
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
	get_mod_name() {
		switch(this.modifier) {
			case 1:
				return "Lethargic";
			case 2:
				return "Basic";
			case 3:
				return "Uncommon";
			case 4:
				return "Rare";
			case 5:
				return "Ludicrous";
			case 6:
				return "Unfathomable";
			case 7:
				return "Legendary";
			case 8:
				return "Pure gold";
			default:
				return "Corrupted";
		}
	}
	
	//returns a sprite location to use in an img src for the fish.
	get_fish_sprite() {
		const x = "fishes/"
		switch(this.type) {
			case "koi":
				return x + "koi.png";
			case "marlin":
				return x + "marlin.png";
			case "salmon":
				return x + "salmon.png";
			case "tiny":
				return x + "tiny_fish.png";
			case "weird":
				return x + "weird_eel.png";
			case "goldkoi":
				return x + "gold_koi.png";
			default:
				return x + "generic_fish.png";
		}
	}
	
	//sells the fish
	//todo - figure out how to delete a javascript object
	sell() {
		if (this.sold !== true) {
			var fish_caught = parseInt(localStorage.getItem("fish_caught"));
			var money = parseInt(localStorage.getItem("coins"));
			localStorage.setItem("fish_caught", fish_caught += 1);
			localStorage.setItem("coins", money += this.true_value);
			this.true_value = 0;
			this.sold = true;
			snd_kaching.play();
		} else {
			console.log("You can't sell a fish you've already sold!");
		}
	}
}

function buy_bait() {
	var button = document.getElementById("btnBait");
	var money = parseInt(localStorage.getItem("coins"));
	var bait = parseInt(localStorage.getItem("fishing_bait"));
	button.disabled = true;
	
	if (money >= 3) {
		localStorage.setItem("coins", money -= 3);
		localStorage.setItem("fishing_bait", bait += 1);
		update_counters();
		snd_kaching.play();
		setTimeout(() => {
			button.disabled = false;
		}, 850);
	} else {
		snd_click.play();
		button.innerHTML = "You're too poor for bait! (3 coins)";
		setTimeout(() => {
			button.innerHTML = "Buy Bait"
			button.disabled = false;
		}, 2000);
	}
}

function go_fishing() {
	var button = document.getElementById("btnFishing");
	var text = document.getElementById("innertext");
	var buttonsDiv = document.getElementById("buttons");
	var bobber = document.getElementById("bobber");
	
	var bait = parseInt(localStorage.getItem("fishing_bait"));
	button.disabled = true;
	
	if (bait >= 1) {
		localStorage.setItem("fishing_bait", bait -= 1);
		snd_bigsplash.play();
		update_counters();
		buttonsDiv.style = "display:none;";
		bobber.style = "display:inline;"
		text.innerHTML = "You are now fishing.<br>Come back soon to claim your fish.";
		cookie_creator("isFishing", "true, please don't delete me gaarg", Math.floor(Math.random() * 10));
		cookie_creator("Fish", "also don't delete me gaarg, i'm required to claim a fish!");
		
	} else {
		snd_click.play();
		button.innerHTML = "You don't have any bait!";
		setTimeout(() => {
			button.innerHTML = "Start Fishing";
			button.disabled = false;
		}, 2000);
	}
}

//names for our fishies
const fish_names = [
	"Gorgo", "Glembi", "Fishmourne", "Gimblo", "Florpi", "Dune Conqueror Three", "Arthas", "Glumbus", "Blaot", "Cevapi", "Boinglu", "Lei-La", "Unknown Fish-like Object", "Angry Fish"
];
//types of fish. todo - add MORE
const fish_types = [
	"koi", "marlin", "salmon", "tiny", "weird", "goldkoi"
];
var fishy;
function get_fish() {
	fishy = new Fish(
		fish_names[getRandomArbitrary(0, fish_names.length)], //name
		fish_types[getRandomArbitrary(0, fish_types.length)], //type
		getRandomArbitrary(1, 8), //modifier
		getRandomArbitrary(1, 5) //base value
	);
	console.log(fishy);
	snd_ding.play();
	document.getElementById("innertext").innerHTML = "You got a fish!<br><img src='"+fishy.get_fish_sprite()+"'><br><p>"+fishy.get_mod_name()+" "+fishy.name+"<br>Valued at "+fishy.true_value+" coins!";
	document.getElementById("buttons").innerHTML = "<button id='sell' onclick='fishy.sell(); reset_buttons();'>Sell Fish</button><button id='keep' disabled=true>Save Fish (WIP)</button>"
	var fishcaught = parseInt(localStorage.getItem("fish_caught"));
	localStorage.setItem("fish_caught", fishcaught += 1);
	update_counters();
}

//arcane code from mozilla to find my cookie.
const is_fishing_cookie = document.cookie.split("; ").find((row) => row.startsWith("isFishing"))?.split("=")[1];
const is_fish_cookie = document.cookie.split("; ").find((row) => row.startsWith("Fish"))?.split("=")[1];
if (is_fishing_cookie) {
	document.getElementById("buttons").style = "display:none;";
	document.getElementById("bobber").style = "display:inline;";
	document.getElementById("innertext").innerHTML = "You're still fishing.<br>Come back later.";
} else if (is_fish_cookie) {
	delete_cookie("Fish");
	get_fish();
}