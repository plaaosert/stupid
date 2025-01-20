//builders
const inventory_div = document.getElementById("inventory_div");
const div_creator = document.createElement("div");
const img_creator = document.createElement("img");

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

function add_inventory_item(fish) {
	
}