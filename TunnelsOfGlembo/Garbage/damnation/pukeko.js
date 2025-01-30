class pukeko {
	//format is Sprite, Quote
	//exclamations are added afterwards. don't include them unless you want to be funny
	//sprite formats are png, added later.
	//try to keep them sorted by their sprite.
	static quotes = [
		["normal",	"SALVATION"],
		["normal",	"DAMNATION"],
		["normal",	"ANNIHILATION"],
		["normal",	"OBLIVION"],
		["normal",	"OSMOREGULATION"],
		["normal",	"PERFECTATION"],
		["invert",	"INVERSION"],
		["obfus",	"ENCRYPTION"],
		["obfus",	"OBFUSCATION"],
		["ident",	"IDENTIFICATION"],
		["magni",	"MAGNIFICATION"],
		["detect",	"INVESTIGATION"],
		["detect",	"DEDUCTION"],
		["minimal",	"MINIMALISATION"],
		["minimal", "SIMPLIFICATION"],
		["jpeg", 	"COMPRESSION"],
		["crab",	"CARCINIZATION"],
		["student",	"EDUCATION"],
		["mage",	"INVOCATION"],
		["mage",	"DIVINATION"],
		["split",	"DIVISION"],
		["shy",		"INFATUATION"],
		["glowGrn",	"RADIATION"],
		["glowBlu",	"IONISATION"],
		["glowBlu",	"CRYSTALISATION"],
		["fire",	"IGNITION"],
		["travel",	"TRANSPORTATION"],
		["travel",	"LOCOMOTION"],
		["3nf",		"NORMALISATION"],
		["float",	"FLOATATION"]
	]
	
	constructor(x, y) {
		//location logic should be handled elsewhere
		this.pos_x = x
		this.pos_y = y
		
		this.type = quotes[Math.floor(Math.random() * quotes.length)];
		this.quote = exaggeration(type[1], Math.floor(Math.random() * 6) + 1);
		this.sprite = sprite_maker(type[0]);
	}
	
	//formats a sprite. doesn't make sure that sprite exists, just if it's defined in the quotes array.
	//banking on YOU to add the sprite.
	sprite_maker(name) {
		let valid_name = (e) => e == name;
		if (quotes.some(valid_name)) {
			return "pukekos/${name}.png";
		} else {
			console.log("Failed to find sprite, given ${name}. Check sprite_maker.");
			return "pukekos/normal.png";
		}
	}
	
	//woah!!!!!!!!!!!
	exaggeration(quote, exclamations) {
		for (let i = 0; i < exclamations; i++) {
			quote = quote + "!";
		}
		return quote;
	}
}