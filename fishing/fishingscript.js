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

let fishs = load_fishs();
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
//mdn my beloved coming in clutch
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
		snd_kaching.cloneNode().play();
		setTimeout(() => {
			button.disabled = false;
		}, 150);
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