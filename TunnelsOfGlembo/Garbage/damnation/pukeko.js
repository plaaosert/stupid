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
			["normal",	"VISUALISATION"],
			["invert",	"INVERSION"],
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
			["mage",	"ALCHEMISATION"],
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
			["ufo",		"ABDUCTION"],
			["ufo",		"ALIENATION"],
			["tired",	"EXHAUSTION"],
			["tired",	"INTOXICATION"],
			["drunk",	"INTOXICATION"],
			["drunk",	"INEBRIATION"],
			["drunk",	"DEPRESSION"],
			["satur8",	"SATURATION"],
			["dlc",		"MONETISATION"],
			["censor",	"IMPLICATION"],
			["info",	"INFORMATION"],
			["info",	"DIRECTION"],
			["arrow",	"INDICATION"],
			["arrow",	"NOTIFICATION"],
			["pinged",	"NOTIFICATION"],
			["amalg",	"AMALGAMATION"],
			["amalg",	"ABOMINATION"],
			["amalg",	"MODIFICATION"],
			["draw1",	"ILLUSTRATION"],
			["taxation","TAXATION"],
			["observ",	"OBSERVATION"],
			["rblx",	"####"],
			["mtgcard",	"Damnation, Sorcery - Destroy all creatures. They can't be regenerated"]
		]

		//textbox colours
		const colours = [
			"Default", "Blue", "Red", "Green", "Purple", "Yellow", "Orange", "Pink", "DarkCyan", "DarkGreen", "Swamp", "Orchid", "Maroon", "Black"
		]
		//location logic should be handled elsewhere
		this.pos_x = x
		this.pos_y = y

		this.box_colour = colours[Math.floor(Math.random() * colours.length)];

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