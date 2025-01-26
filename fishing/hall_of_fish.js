let fishs = [];

function populate() {
	fishs = load_fishs();
	// save fish back so any regenerated ones are now set in stone
	localStorage.setItem("fishs", JSON.stringify(fishs));

	// go through each hall of fish category and make the divs
	// start with overall, then go through each type in order
	let best_fishs = JSON.parse(localStorage.getItem("best_fishs"));

	make_fish_row(best_fishs["overall"], "Overall");

	Object.keys(best_fishs).forEach(cat => {
		if (cat != "overall") {
			make_fish_row(best_fishs[cat], cat);
		}
	})
}

function make_fish_row(category, categoryname) {
	let parent = document.querySelector("#hof_main");
	let template = document.querySelector("#hof_fish_template");

	let cols = document.createElement("div");
	cols.classList.add("columns");

	Object.keys(category).forEach(c => {
		let new_template = template.cloneNode(true);
		new_template.classList.remove("hidden-template");

		if (category[c]) {
			let fish = Fish.from_data(category[c]);

			new_template.querySelector(".fishyimage").src = `${fish.sprite}`;
			
			new_template.querySelector(".plaque .award-category").textContent = c;
			new_template.querySelector(".plaque .fishname").textContent = fish.name;

			let mod_class_name = "Normal";
			if (fish.rarity) {
				if (fish.rarity[1] == "Pure Gold") {
					mod_class_name = "Puregold";
				} else if (fish.rarity[1] == "Pure Platinum") {
					mod_class_name = "Pureplatinum";
				} else if (fish.rarity[1]) {
					mod_class_name = fish.rarity[1];
				}
			}

			new_template.querySelector(".plaque .fish-rarity").textContent = fish.rarity[1] ? fish.rarity[1] : "Normal";
			new_template.querySelector(".plaque .fish-rarity").classList.add(mod_class_name);

			["value", "nature"].forEach(p => {
				new_template.querySelector(`.plaque .${p}`).textContent = fish[p];
			});

			new_template.querySelector(".length").textContent = fish.length > 100 ? `${fish.length / 100}m` : `${fish.length}cm`;
			new_template.querySelector(".weight").textContent = fish.weight < 1 ? `${fish.weight * 1000}g` : `${Math.round(fish.weight * 10) / 10}kg`;
		} else {
			new_template.querySelector(".fishyimage").style.display = "none";
			
			new_template.querySelector(".plaque .award-category").textContent = c;
			new_template.querySelector(".plaque .fishname").textContent = "???";

			new_template.querySelector(".plaque .fish-rarity").textContent = "???";

			["length", "weight", "value", "nature"].forEach(p => {
				new_template.querySelector(`.plaque .${p}`).textContent = "?"
			});
		}

		cols.appendChild(new_template);
	})

	parent.appendChild(cols);
}