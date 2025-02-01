class pukeko {
	constructor(x, y) {
		const quotes = [
		//format is Sprite, Quote
		//exclamations are added afterwards. don't include them unless you want to be funny
		//sprite formats are png, added later.
		//try to keep them sorted by their sprite.
			["normal",	"SALVATION"],
			["normal",	"DAMNATION"],
			["normal",	"ANNIHILATION"],
			["normal",	"OBLIVION"],
			["normal",	"OSMOREGULATION"],
			["normal",	"PERFECTION"],
			["normal",	"PROCRASTINATION"],
			["invert",	"INVERSION"],
			["obfus",	"OBFUSCATION"],
			["cubes",	"OPTIMISATION"],
			["ident",	"IDENTIFICATION"],
			["magni",	"MAGNIFICATION"],
			["detect",	"INVESTIGATION"],
			["detect",	"DEDUCTION"],
			["minimal",	"MINIMALISATION"],
			["minimal",	"SIMPLIFICATION"],
			["jpeg",	"COMPRESSION"],
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
			["fire",	"INCINERATION"],
			["ashes",	"CREMATION"],
			["ashes",	"DISINTEGRATION"],
			["travel",	"TRANSPORTATION"],
			["travel",	"LOCOMOTION"],
			["3nf",		"NORMALISATION"],
			["float",	"FLOATATION"],
			["farmer",	"CULTIVATION"],
			["master",	"CULTIVATION"],
			["egg",		"INCUBATION"],
			["money",	"DONATION"],
			["draw1",	"INTERPRETATION"]
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