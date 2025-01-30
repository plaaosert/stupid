class pukeko {
	//format is Sprite, Quote
	//exclamations are added afterwards. don't include them unless you want to be funny
	//sprite formats are png, added later.
	//try to keep them sorted by their sprite.
	
	constructor(x, y) {
		const quotes = [
			["normal",	"SALVATION"],
			["normal",	"DAMNATION"],
			["normal",	"ANNIHILATION"],
			["normal",	"OBLIVION"],
			["normal",	"OSMOREGULATION"],
			["normal",	"PERFECTION"],
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
		//location logic should be handled elsewhere
		this.pos_x = x
		this.pos_y = y
		
		this.type = quotes[Math.floor(Math.random() * quotes.length)];
		this.quote = this.exaggeration(this.type[1], Math.floor(Math.random() * 8) + 3);
		this.sprite = this.sprite_maker(this.type[0]);
	}
	
	//error protection is for cowards.
	sprite_maker(name) {
		return "pukekos/"+name+".png";
	}
	
	//woah!!!!!!!!!!!
	exaggeration(quote, exclamations) {
		for (let i = 0; i < exclamations; i++) {
			quote = quote + "!";
		}
		return quote;
	}
}