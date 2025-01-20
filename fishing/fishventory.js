const inventory = document.getElementById("inventoryLimiter");
var snd_kaching = new Audio("sound/kaching.ogg");
var snd_click = new Audio("sound/click.ogg");

var fishs = [];
if (localStorage.getItem("fishs") === null) {
	localStorage.setItem("fishs", "[]");
} else {
	try {
		fishs = JSON.parse(localStorage.getItem("fishs"));
	} catch {
		fishs = [];
	}
}

function add_inventory_item(index) {
	let rarity = fishs[index].rarity[1];
	let sprite = fishs[index].sprite;
	let name = fishs[index].name;
	let value = fishs[index].value;
	let mod_class_name = "";

	if (rarity != "") {
		if (rarity == "Pure gold") {
			mod_class_name = "Puregold";
		} else if (rarity == "Pure platinum") {
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
	//aboutsection
	let aboutfish = node.querySelector(".aboutfish");
	aboutfish.querySelector("b").className = mod_class_name;
	aboutfish.querySelector("b").textContent = rarity;
	aboutfish.querySelector("span.fishname").textContent = name;
	//value
	let fishvaluebox = node.querySelector(".fishvaluebox");
	fishvaluebox.querySelector("span.valuetext").textContent = "Coin Value";
	fishvaluebox.querySelector(".fishvalue").textContent = value;
	fishvaluebox.querySelector("button").setAttribute("onclick", "sell_fish("+index+", "+fishs[index].personality.curiosity+")");
	fishvaluebox.querySelector("button").setAttribute("id", "b"+index);

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
			add_inventory_item(i);
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