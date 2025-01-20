// load sounds.
var snd_click = new Audio("sound/click.ogg");
var snd_ding = new Audio("sound/ding.ogg");
var snd_kaching = new Audio("sound/kaching.ogg");
var snd_splash = new Audio("sound/splash.ogg");
var snd_bigsplash = new Audio("sound/bigsplash.ogg");
var snd_success = new Audio("sound/success.ogg");

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

let fishs = [];
if (localStorage.getItem("fishs") === null) {
	localStorage.setItem("fishs", "[]");
} else {
	try {
		fishs = JSON.parse(localStorage.getItem("fishs"));
	} catch {
		fishs = [];
	}
}
let got_fish = null;


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
	static personality_types = [
		"curiosity", "athleticism", "boisterousness", "laziness", "carelessness", "sophistication", "elitism", "assertiveness"
	]

	static rarities = normalise_weighted_arr([
		// [name, chance(relative), value_mult, value_plus]
		[0.4,    "",                1, 0],
		[0.2,    "Uncommon",        1.5, 0.5],
		[0.1,    "Rare",            2, 1],
		[0.05,   "Legendary",       3, 1.5],
		[0.02,   "Mythical",        5, 2],
		[0.01,   "Immortal",        10, 3],
		[0.005,  "Pure Gold",       50, 4],
		[0.0025, "Pure Platinum",   100, 5],
		[0.001,  "Divine",          1000, 7],
		[0.0002, "Chocolate",       10000, 10],
	])

	static generate(type_index_override=null, rarity_override=null, personality_override=null) {
		let type_index = type_index_override;
		if (!type_index) {
			type_index = random_int(0, fish_types.length);
		}

		let rarity = rarity_override;
		if (!rarity_override) {
			rarity = weighted_random_from_arr(Fish.rarities);
		}

		let personality = personality_override;
		if (!personality) {
			personality = {};
			Fish.personality_types.forEach(p => personality[p] = Math.random());
		}

		return new Fish(
			random_from_array(fish_types[type_index].names),
			type_index, rarity, personality
		);
	}

	constructor(name, type_index, rarity, personality) {
		this.name = name;
		this.rarity = rarity;
		this.personality = personality;

		//fuk u dont break my fish
		if ((Number.isInteger(type_index) == false)) {
			this.type = fish_unknown;
			this.value = this.get_coin_value();
		} else {
			this.type = fish_types[type_index];
			this.value = this.get_coin_value();
		}

		this.sprite = this.get_fish_sprite();
		this.full_name = `${this.rarity[1]} ${this.name}`;
	}
	
	//returns a sprite location to use in an img src for the fish.
	get_fish_sprite() {
		const x = "fishes/"
		switch(this.type.sprite) {
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
	
	get_coin_value() {
		// coin value doesnt care about personality or size, only rarity and type
		return Math.ceil((this.type.base_value + this.rarity[3]) * this.rarity[2])
	}
}

function sell_fish(fish) {
	let money = parseInt(localStorage.getItem("coins"));
	localStorage.setItem("coins", money + fish.value);
	snd_kaching.play();
}

function put_fish_into_inventory(fish) {
	fishs.push(JSON.parse(JSON.stringify(fish)));
	localStorage.setItem("fishs", JSON.stringify(fishs));
	snd_success.play();
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
		cookie_creator("isFishing", "true, please don't delete me gaarg", getRandomArbitrary(1,10));
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

const fish_unknown = [
	{sprite: "generic_fish", lengths: [10, 40], weight_mults: [0.3, 0.6], base_value: -1, names: ["MISSINGNO."]}
];

//types of fish. todo - add MORE
const fish_types = [
	{sprite: "koi", lengths: [40, 120], weight_mults: [0.4, 0.7], base_value: 1, names: [
		"Behkko", "Asargee", "Kohark", "Tarnchau", "Sarke", "Goro", "Hikar"
	]},
	{sprite: "marlin", lengths: [300, 600], weight_mults: [1.3, 2], base_value: 3, names: [
		"Fishmourne", "Dune Conqueror Three", "Arthas", "Rapierfish", "Skirmisher", "Jerry"
	]},
	{sprite: "salmon", lengths: [90, 150], weight_mults: [0.2, 0.32], base_value: 2, names: [
		"Gorgo", "Glembi", "Gimblo", "Florpi", "Glumbus", "Blaot", "Cevapi", "Boinglu"
	]},
	{sprite: "tiny", lengths: [4, 8], weight_mults: [0.0014, 0.0021], base_value: 0.1, names: [
		"Lei-La", "La-Lou", "Ley-La", "Squi-shii", "Fu-nii", "Fun-ki", "Ami-la"
	]},
	{sprite: "weird", lengths: [200, 360], weight_mults: [0.06, 0.09], base_value: 0.2, names: [
		"Unknown Fish-like Object", "Sea snake?", "Sea serpent?", "Squiggly guy?", "Non-electric Eel", "Anomalous Creature"
	]},
	{sprite: "goldkoi", lengths: [60, 130], weight_mults: [0.45, 0.75], base_value: 5, names: [
		"Xen", "Pen", "Gui", "Yin", "Yan", "Yos", "Vos"
	]},
];

function get_fish() {
	got_fish = Fish.generate();

	console.log(got_fish);
	snd_ding.play();
	
	document.getElementById("innertext").innerHTML = `You got a fish!<br><img src='${got_fish.sprite}'><br><p>${got_fish.full_name}<br>Liquidate for <span class='highlight'>${got_fish.value}</span> coins, or keep it?`;
	document.getElementById("buttons").innerHTML = "<button id='sell' onclick='sell_fish(got_fish); reset_buttons(); update_counters();'>Sell Fish</button><button id='keep' onclick='put_fish_into_inventory(got_fish); reset_buttons(); update_counters();'>Keep Fish</button>"
	
	let fishcaught = parseInt(localStorage.getItem("fish_caught"));
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