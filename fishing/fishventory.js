const inventory = document.getElementById("inventoryLimiter");
var snd_kaching = new Audio("sound/kaching.ogg");
var snd_clack = new Audio("sound/clack.ogg");
var snd_quality = new Audio("../Quality/noise.mp3");
const coconut_div = document.getElementById("quality");
let fishs = load_fishs();

//quality street quest
function coconut() {
	let streets = JSON.parse(localStorage.getItem("qualitystreets"));
	streets.push("coconut-eclair");
	localStorage.setItem("qualitystreets", JSON.stringify(streets));
	snd_quality.play();
	coconut_div.innerHTML = "";
}
if (localStorage.getItem("qualitystreets") === null) {
    localStorage.setItem("qualitystreets", "[]");
}
if (fishs.length >= 50 && localStorage.getItem("qualitystreets")) {
	let streets = JSON.parse(localStorage.getItem("qualitystreets"));
	if (!(streets.includes("coconut-eclair"))) {
		coconut_div.innerHTML = "<img onclick='coconut()' src='../Quality/coconut-eclair.png'>";
		setTimeout(() => {
			snd_quality.cloneNode().play();
		}, 1900);
	}
}

//end of quality

function add_inventory_item(index) {
	let rarity = fishs[index].rarity[1];
	let sprite = fishs[index].sprite;
	let name = fishs[index].name;
	let value = fishs[index].value;
	let mod_class_name = "";

	if (rarity != "") {
		if (rarity == "Pure Gold") {
			mod_class_name = "Puregold";
		} else if (rarity == "Pure Platinum") {
			mod_class_name = "Pureplatinum";
		} else {
			mod_class_name = rarity;
		}
	} else {
		mod_class_name = "Normal";
		rarity = "Normal";
	}
	
	const fishy_template = document.querySelector(".fishy");
	let node = fishy_template.cloneNode(true);
	//image
	node.querySelector(".fishyimage").src = sprite;
	node.querySelector(".fishyimage").classList.add(mod_class_name);
	//aboutsection
	let aboutfish = node.querySelector(".aboutfish");
	aboutfish.querySelector("b").className = mod_class_name;
	aboutfish.querySelector("b").textContent = rarity;
	aboutfish.querySelector("span.fishname").textContent = name;
	aboutfish.querySelector("span.personalitytype").textContent = Fish.get_fish_nature(fishs[index]);
	//value
	let fishvaluebox = node.querySelector(".fishvaluebox");
	fishvaluebox.querySelector("span.valuetext").textContent = "Coin Value";
	fishvaluebox.querySelector(".fishvalue").textContent = value;
	fishvaluebox.querySelector("button").setAttribute("onclick", "sell_fish("+index+", "+fishs[index].personality.curiosity+")");
	fishvaluebox.querySelector("button").setAttribute("id", "b"+index);

	let length = fishs[index].length;
	let weight = fishs[index].weight;
	node.querySelector(".fishlength").textContent = length > 100 ? `${length / 100}m` : `${length}cm`;
	node.querySelector(".fishweight").textContent = weight < 1 ? `${weight * 1000}g` : `${Math.round(weight * 10) / 10}kg`;

	inventory.appendChild(node);
}

//sells and removes a fish from the localstorage
function sell_fish(fish_id, unique_identifier) {
	let button = document.getElementById("b"+fish_id);
	let new_id = fish_id;
	for (let i = 0; i < fishs.length; i++){
		if (fishs[i].personality.curiosity == unique_identifier) {
			new_id = i;
		}
	}
	if (localStorage.getItem("fishs") !== null) {
		let money = parseInt(localStorage.getItem("coins"));
		localStorage.setItem("coins", money += fishs[new_id].value);
	} else {
		localStorage.setItem("coins", fishs[new_id].value);
	}
	//removes one fish based on the index, which is already given from the button.
	fishs.splice(new_id, 1)
	save_fishs_to_localstorage();
	
	button.disabled = true;
	button.innerHTML = "Sold!";
	update_counter_values();
	snd_kaching.cloneNode().play();
}

function save_fishs_to_localstorage() {
	localStorage.setItem("fishs", JSON.stringify(fishs));
}
//retrieves all fish in localstorage
function populate() {
	if (fishs.length) {
		for (let i = 0; i < fishs.length; i++) {
			setTimeout(() => {
				add_inventory_item(i);
				if (i <= 15) { //so that big inventories aren't an endless blast of clicks
					snd_clack.cloneNode().play();
				}
			}, 100 * i);
		}
	} else {
		document.getElementById("inventoryLimiter").innerHTML = "you have no fish :(";
	}
	update_counter_values();
}

function update_counter_values() {
	document.getElementById("coinAmt").innerHTML = localStorage.getItem("coins");
	if (fishs.length) {
		document.getElementById("count_of_fish").innerHTML = fishs.length;
	} else {
		document.getElementById("count_of_fish").innerHTML = "0";
	}
}