class Fish {
	static personality_types = [
		"curiosity", "athleticism", "boisterousness", "laziness", "carelessness",
		"sophistication", "elitism", "assertiveness", "optimism", "sociableness"
	]

	static personality_natures = [
		{
			"name": "Curious",
			"base": 0,
			"value": 1.3,
			"pts_raw": [["curiosity", 1]],
			"pts_pct": [],
		},

		{
			"name": "Athletic",
			"base": 0,
			"value": 1.3,
			"pts_raw": [["athleticism", 1]],
			"pts_pct": [],
		},

		{
			"name": "Boisterous",
			"base": 0,
			"value": 1,
			"pts_raw": [["boisterousness", 1]],
			"pts_pct": [],
		},

		{
			"name": "Lazy",
			"base": 0,
			"value": 0.7,
			"pts_raw": [["laziness", 1]],
			"pts_pct": [],
		},

		{
			"name": "Careless",
			"base": 0,
			"value": 0.7,
			"pts_raw": [["carelessness", 1]],
			"pts_pct": [],
		},

		{
			"name": "Sophisticated",
			"base": 0,
			"value": 1.2,
			"pts_raw": [["sophistication", 1]],
			"pts_pct": [],
		},

		{
			"name": "Elitist",
			"base": 0,
			"value": 0.9,
			"pts_raw": [["elitism", 1]],
			"pts_pct": [],
		},

		{
			"name": "Assertive",
			"base": 0,
			"value": 1.1,
			"pts_raw": [["assertiveness", 1]],
			"pts_pct": [],
		},

		{
			"name": "Optimistic",
			"base": 0,
			"value": 1.1,
			"pts_raw": [["optimism", 1]],
			"pts_pct": [],
		},

		{
			"name": "Sociable",
			"base": 0.075,
			"value": 1.2,
			"pts_raw": [["sociableness", 1]],
			"pts_pct": [],
		},

		{
			"name": "Erudite",
			"base": 0.15,
			"value": 1.9,
			"pts_raw": [["curiosity", 0.5], ["sophistication", 0.5]],
			"pts_pct": [],
		},

		{
			"name": "Perfectionist",
			"base": 0.8,
			"value": 1.6,
			"pts_raw": [["carelessness", -0.6], ["laziness", -0.3], ["elitism", 0.5]],
			"pts_pct": [],
		},

		{
			"name": "Hot-headed",
			"base": -0.2,
			"value": 1.7,
			"pts_raw": [["laziness", -0.4], ["curiosity", 0.2], ["athleticism", 0.3], ["sociableness", 0.3], ["boisterousness", 0.7]],
			"pts_pct": [],
		},

		{
			"name": "Lackadaisical",
			"base": 0,
			"value": 1.1,
			"pts_raw": [["laziness", 0.65], ["carelessness", 0.65]],
			"pts_pct": [],
		},

		{
			"name": "Gregarious",
			"base": -0.8,
			"value": 1.7,
			"pts_raw": [["sociableness", 2], ["curiosity", 0.2], ["sophistication", 0.3]],
			"pts_pct": [],
		},

		{
			"name": "Enterprising",
			"base": -0.5,
			"value": 2,
			"pts_raw": [["curiosity", 0.6], ["laziness", -0.7], ["carelessness", -0.4], ["sociableness", 0.2], ["optimism", 0.4], ["elitism", 0.1], ["assertiveness", 0.8]],
			"pts_pct": [],
		},

		{
			"name": "Silly",
			"base": 0.3,
			"value": 2.5,
			"pts_raw": [["optimism", 0.5], ["sociableness", 0.7], ["elitism", -1], ["sophistication", -1]],
			"pts_pct": [],
		},

		{
			"name": "Diplomatic",
			"base": -0.2,
			"value": 2,
			"pts_raw": [["optimism", 0.3], ["assertiveness", 0.7], ["sociableness", 0.5], ["carelessness", -0.5]],
			"pts_pct": [],
		},

		{
			"name": "Forceful",
			"base": -0.7,
			"value": 1.6,
			"pts_raw": [["assertiveness", 1], ["boisterousness", 1]],
			"pts_pct": [],
		},

		{
			"name": "People-pleasing",
			"base": 0.3,
			"value": 1,
			"pts_raw": [["assertiveness", -2], ["sociableness", 1], ["elitism", -0.5], ["sophistication", 0.2]],
			"pts_pct": [],
		},

		{
			"name": "Unmotivated Genius",
			"base": -0.05,
			"value": 10,
			"pts_raw": [["curiosity", -3], ["athleticism", 0.2], ["laziness", 0.6], ["carelessness", 0.6]],
			"pts_pct": [],
		},

		{
			"name": "Thoughtful",
			"base": 0.6,
			"value": 1,
			"pts_raw": [["curiosity", 0.3], ["boisterousness", -0.4], ["carelessness", -0.6], ["optimism", 0.3]],
			"pts_pct": [],
		},

		{
			"name": "Uninteresting",
			"base": 2.5,
			"value": 0.3,
			"pts_raw": [
				["boisterousness", -1],
				["sophistication", -1],
				["elitism", -1],
				["assertiveness", -1],
				["optimism", -1],
				["sociableness", -1],
			],
			"pts_pct": [],
		},

		{
			"name": "Secretive",
			"base": 4.2,
			"value": 5,
			"pts_raw": [
				["curiosity", -1],
				["athleticism", -1],
				["boisterousness", -1],
				["laziness", -1],
				["carelessness", -1],
				["sophistication", -1],
				["elitism", -1],
				["assertiveness", -1],
				["optimism", -1],
				["sociableness", -1],
			],
			"pts_pct": [],
		},

		{
			"name": "Gentle",
			"base": 0.9,
			"value": 4,
			"pts_raw": [["boisterousness", -1], ["sociableness", 0.3], ["assertiveness", -0.6]],
			"pts_pct": [],
		},

		{
			"name": "Domineering",
			"base": -0.2,
			"value": 3,
			"pts_raw": [["boisterousness", 1], ["sociableness", -0.3], ["assertiveness", 0.6]],
			"pts_pct": [],
		},

		{
			"name": "Hesitant",
			"base": 1.4,
			"value": 2,
			"pts_raw": [["curiosity", -0.5], ["carelessness", -0.5], ["optimism", -0.7]],
			"pts_pct": [],
		},

		{
			"name": "Chaotic",
			"base": -6.5,
			"value": 6,
			"pts_raw": [
				["curiosity", 1],
				["athleticism", 1],
				["boisterousness", 1],
				["laziness", 1],
				["carelessness", 1],
				["sophistication", 1],
				["elitism", 1],
				["assertiveness", 1],
				["optimism", 1],
				["sociableness", 1],
			],
			"pts_pct": [],
		}
	] 

	static dna_types = [
		// each allele is given either "dominant" or "recessive", which will skew the child:
		// pick 4 random numbers between parents' values, then:
		//  1/4 chance to pick closest to dominant
		//  2/4 chance to pick second closest
		//  1/4 chance to pick closest to recessive
		// all values 0-1
		"silt_yield", "sand_yield", "clay_yield",
		"particulates_yield", "wetstuff_yield", "nonsilt_yield",
		"all_yield", "all_yield_penalty",
		"time_add", "time_sub", "time_variance",
		"chance_time_penalty", "chance_yield_penalty",
		"chance_critical_yield", "critical_bonus", "death_chance", /* chance / 5 */
		"coin_gain_chance", "fishbux_gain_chance"
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

	static generate(type_index_override=null, rarity_override=null, personality_override=null, dna_override=null) {
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

		let dna = dna_override;
		if (!dna_override) {
			dna = {};
			Fish.dna_types.forEach(p => dna[p] = Math.random());
		}

		return new Fish(
			random_from_array(fish_types[type_index].names),
			type_index, rarity, personality, dna
		);
	}

    static get_fish_nature(fish) {
		let total_personality = Fish.personality_types.reduce((p, c) => {
			return p + fish.personality[c];
		}, 0);

		return Fish.personality_natures.reduce((prev, cur) => {
			let score = cur.base + cur.pts_raw.reduce((p, c) => {
				return p + (fish.personality[c[0]] * c[1]);
			}, 0) + cur.pts_pct.reduce((p, c) => {
				return p + ((fish.personality[c[0]] / total_personality) * c[1])
			}, 0);

			if (!prev || score > prev.score) {
				return {score: score, personality: cur};
			} else {
				return prev;
			}
		}, null).name;
	}

	constructor(name, type_index, rarity, personality, dna) {
		this.name = name;
		this.rarity = rarity;
		this.personality = personality;
		this.dna = dna;

		if (!this.personality) {
			this.personality = {};
			Fish.personality_types.forEach(p => this.personality[p] = Math.random());
		}

		if (!this.dna) {
			this.dna = {};
			Fish.dna_types.forEach(p => this.dna[p] = Math.random());
		}

		this.nature = this.get_nature();

		this.corrupted = false;

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

    get_nature() {
        return Fish.get_fish_nature(this);
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