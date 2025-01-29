var snd_pop = new Audio("pop.ogg");

//if we somehow don't have them already.
if (localStorage.getItem("coins") === null) {
	localStorage.setItem("coins", 0);
}
if (localStorage.getItem("fishing_bait") === null) {
	localStorage.setItem("fishing_bait", 1);
}
if (localStorage.getItem("shop_items") === null) {
	localStorage.setItem("shop_items", "[]");
}

const shopkeep_lines_intro = [
	"...welcome traveller.",
	"...a customer? here?",
	"feel free to... browse my wares",
	"...oh?",
	"you've found... me.",
	"...mhm.",
	"you're from... glembo?",
	"...have you been fishing?",
	"lamp... oil?",
	"bombs...?"
];
const shopkeep_lines_buy = [
	"thank you...",
	"much... appreciated...",
	"i hope it was... exactly what you sought.",
	"...!",
	"...? you wanted that? thanks...",
	"an excellent... choice.",
	"it's yours my... friend.",
	"no refunds... store policy."
];
const shopkeep_lines_cant_afford = [
	"...bring more.",
	"you are... lacking in wealth.",
	"sorry... i don't give credit.",
	"come back when you're... a little richer?",
	"sorry, i'll... keep it waiting for you here.",
	"i appreciate the thought..."
];

const introtext = document.getElementById("introtext");

//todo - make it pause a little on periods.
//it's a small detail but it'll add so much.
function write_to_div(given_text, target, clear=true) {
	if (!given_text || !target)  {
		console.log("Attempted to write without text or a target!");
		return;
	}
	if (clear == true) {
		target.innerHTML = "";
	}
	for (let i = 0; i < given_text.length; i++) {
		setTimeout(function(x) {
			target.innerHTML += x;
			snd_pop.cloneNode().play();
		}, 50 * i, given_text[i]);
	}
}

function get_sprite_name(item_name) {
	x = "items/"
	switch(item_name) {
		case "Fish Orb":
			return x + "fish_orb.png";
		case "Rope":
			return x + "rope.png";
		case "Glass Sphere":
			return x + "marble.png";
		case "Novelty Mug":
			return x + "gaarg_mug.png";
		case "Green Triangle?":
			return x + "triangle.png";
		case "Sunflower Seeds":
			return x + "sunflower_seeds.png";
		case "Biscuit":
			return x + "biscuit.png";
		case "Map of Glembo":
			return x + "glembo_map.png";
		case "Hyper-bait":
			return x + "hyperbait.png";
		case "Choc Fish Replica":
			return x + "fake_choccy.png";
		case "Mahjong Tile":
			return x + "mahjong.png";
		case "9mm Bullet":
			return x + "bullet.png";
		case "A 'goddamn' bicycle":
			return x + "bicycle.png";
		default:
			return x + "placeholder.png";
	}
}

function add_shop_item(item) {
	const wrapper = document.getElementById("shopcontwrapper");
	const item_template = document.querySelector(".shopitem");
	let node = item_template.cloneNode(true);
	
	let id = item[0];
	let name = item[1];
	let currency = item[2];
	let price = item[3];
	let description = item[4];
	let sprite = get_sprite_name(name);
	
	//image and button
	let imgcol = node.querySelector(".imgcolumn");
	imgcol.querySelector(".itemimg").src = sprite;
	imgcol.querySelector(".shopbutton").setAttribute("onclick", "buy_item("+id+")");
	//itemtext
	let textcol = node.querySelector(".itemtitle");
	textcol.querySelector(".value").textContent = price + " " + currency;
	textcol.querySelector(".title").textContent = name;
	textcol.querySelector(".owned").textContent = "0 owned."; //todo - include count of amount earned
	textcol.querySelector(".owned").setAttribute("id", "item_" + id);
	//description
	node.querySelector(".itemdescription").textContent = description;
	
	wrapper.appendChild(node);
}

function currency_retriever(currency) {
	switch(currency) {
		case "coins":
			return localStorage.getItem("coins");
		case "bait":
			return localStorage.getItem("fishing_bait");
		default:
			console.log("Invalid currency.");
			return
	}
}

//todo - this function.
function buy_item(item_id) {
	const inventory = JSON.parse(localStorage.getItem("shop_items"));
	let used_currency = currency_retriever(items[item_id][2]);
	//you're broke.
	if (used_currency < items[item_id][3]) {
		write_to_div(shopkeep_lines_cant_afford[Math.floor(Math.random() * shopkeep_lines_cant_afford.length)], introtext);
		return
	}
	//do this if we're just adding a value.
	//todo - fix this because it's bork.
	if (inventory.includes(items[item_id][1])) {
		let item_index = inventory.indexOf(items[item_id][1]);
		
	} else { //if we're adding a new item to the list.
		inventory.push([items[item_id][1], 1]);
		localStorage.setItem("shop_items", JSON.stringify(inventory));
	}
	write_to_div(shopkeep_lines_buy[Math.floor(Math.random() * shopkeep_lines_buy.length)], introtext);
	return
}

function populate_shop() {
	if (items.length) {
		for (let i = 0; i < items.length; i++) {
			add_shop_item(items[i]);
		}
	} else {
		console.log("Failed to retrieve item list.");
	}
}

function loader() {
	write_to_div(shopkeep_lines_intro[Math.floor(Math.random() * shopkeep_lines_intro.length)], introtext);
	populate_shop();
}