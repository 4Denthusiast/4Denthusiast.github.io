function convertToNewtype(cs) { //returns object form of data, ready for JSON stringify if needed.
	//console.info("Converting..."); 
	var skeletonKey = document.createElement("div");
	function htmlUnescape(input){
		skeletonKey.innerHTML = input;
		return skeletonKey.textContent;
	}
	
	if(typeof cs !== "string") {
		throw new TypeError("Parameter must be string.");
	}
	
	var versionIndex = cs.indexOf("version");
	if(versionIndex < 0) {
		throw new Error("Malformed character sheet: no apparent version.");
	}
	var versionEnd = ((cs.indexOf("\n", versionIndex)+1) || (cs.indexOf(";", versionIndex)+1))-1;
	if(versionEnd < 0) {
		throw new Error("Malformed character sheet: no apparent version endpoint.");
	}
	var versionEquals = cs.indexOf("=", versionIndex);
	if(versionEquals < 0 || versionEquals > versionEnd) {
		throw new Error("Malformed character sheet: no apparent version value.");
	}
	
	var version = parseFloat(cs.substring(versionEquals+1, versionEnd));
	
	if(isNaN(version) || version < 0) {
		console.warn("Invalid version: using latest.");
		version = 9;
	}
	
	var postVersion = cs.substring(versionEnd+1);
	//console.log(postVersion);
	var dataStart = postVersion.indexOf("[");
	if(postVersion.lastIndexOf(";") === (dataEnd = (postVersion.length - 1)))
		dataEnd--;
	if(dataStart < 0) {
		throw new Error("Malformed character sheet: no apparent array of data.");
	}
	var data = "{\"data\":" + postVersion.substring(dataStart, dataEnd + 1) + "}";
	if(!data || typeof data !== "string" || data.length < 12)  {
		throw new Error("Malformed character sheet: array of data is invalid or too small.");
	}
	
	try {
		var parsed = JSON.parse(data);
		data = parsed.data; //the array, parsed securely with JSON.
	} catch(e) {
		console.error(e);
		console.error(data);
		throw new Error("Malformed character sheet: array of data couldn't be parsed.");
	}
	
	if(version < 9) {
		var updates = [ function(charinfo){  },
			function(charinfo){ charinfo.push([0,""]); }, 
			function(charinfo){ charinfo[1][0][2] = "-"; },
			function(charinfo){ var ci = ["un-named pet"]; for(var i = 0; i < charinfo[14].length; i++) if(i!=6)ci.push(charinfo[14][i]); charinfo[14] = []; charinfo[14][0] = ci; },
			function(charinfo){ charinfo[1][0][2] = "-"; },
			function(charinfo){ charinfo[16] = []; },
			function(charinfo){ charinfo[17] = []; },
			function(charinfo){ charinfo[18] = []; },
			function(charinfo){ charinfo[19] = []; charinfo[20] = []; }
		];
		
		while(9 > version)
			updates[version++](data);
			
	}
	
	//data is now the array or an error should've been thrown.
	
	
	var newdata = { memorisedSpells:[] };
	
	//don't do any parsing if it's just giong to error anyway.
	if(typeof data[0] === "undefined") {
		throw new Error("Malformed character sheet: array of data has no base info.");
	}
	if(typeof data[1] === "undefined") {
		throw new Error("Malformed character sheet: array of data has no stats.");
	}
	if(typeof data[2] === "undefined") {
		throw new Error("Malformed character sheet: array of data has no weapons.");
	}
	if(typeof data[3] === "undefined") {
		throw new Error("Malformed character sheet: array of data has no notes.");
	}
	if(typeof data[4] === "undefined") {
		throw new Error("Malformed character sheet: array of data has no wealth.");
	}
	if(typeof data[7] === "undefined") {
		throw new Error("Malformed character sheet: array of data has no languages.");
	}
	if(typeof data[8] === "undefined") {
		throw new Error("Malformed character sheet: array of data has no health.");
	}
	if(typeof data[9] === "undefined") {
		throw new Error("Malformed character sheet: array of data has no experience.");
	}
	if(typeof data[10] === "undefined") {
		throw new Error("Malformed character sheet: array of data has no weapon proficiencies.");
	}
	if(typeof data[11] === "undefined") {
		throw new Error("Malformed character sheet: array of data has no proficiencies.");
	}
	if(typeof data[12] === "undefined") {
		throw new Error("Malformed character sheet: array of data has no thief skills.");
	} else while(data[12].length < 8) {
		data[12].push(["",""]);
	}
	if(typeof data[13] === "undefined" || typeof data[13][0] === "undefined") {
		throw new Error("Malformed character sheet: array of data has no equipment.");
	}
	if(typeof data[14] === "undefined") {
		throw new Error("Malformed character sheet: array of data has no followers/pets.");
	}
	if(typeof data[15] === "undefined") {
		throw new Error("Malformed character sheet: array of data has no document metadata.");
	}
	//aligned with tabs for your viewing pleasure
	
	newdata.playerName = 			data[0][0] || "";
	newdata.characterName = 		data[0][1] || "";
	newdata.aliases = 				data[0][2] || "";
	newdata.race = 					data[0][3] || "";
	newdata.class = 				data[0][4] || "";
	newdata.alignment = 			data[0][5] || "";
	newdata.gender = 				data[0][6] || "";
	newdata.age = 					data[0][7] || "";
	newdata.handedness = 			data[0][8] || "";
	newdata.appearance =			data[0][9] || "";
	
	
	newdata.strength = 				data[1][0][0] || 0;
	newdata.strengthAdjust = 		data[1][0][1] || 0;
	newdata.exceptionalStrength = 	data[1][0][2] || 0;
	newdata.dexterity = 				data[1][1][0] || 0;
	newdata.dexterityAdjust = 		data[1][1][1] || 0;
	newdata.constitution = 			data[1][2][0] || 0;
	newdata.constitutionAdjust = 		data[1][2][1] || 0;
	newdata.intelligence = 			data[1][3][0] || 0;
	newdata.intelligenceAdjust = 		data[1][3][1] || 0;
	newdata.wildom = 				data[1][4][0] || 0;
	newdata.wildomAdjust = 			data[1][4][1] || 0;
	newdata.charisma = 				data[1][5][0] || 0;
	newdata.charismaAdjust = 		data[1][5][1] || 0;
	newdata.perception = 			data[1][6][0] || 0;
	newdata.perceptionAdjust = 		data[1][6][1] || 0;
	
	
	newdata.weapons = [];
	
	for(var i = 0; i < data[2].length; i++) {
		var wep = {};
		var ranged = isNaN(parseFloat(data[2][i][5])); //fun fact, 1 + true === 2
		wep.name =				data[2][i][0] || "";
		wep.attackAdjust = 		parseFloat(data[2][i][1 + ranged]) || 0;
		wep.damageAdjust = 	parseFloat(data[2][i][3 + ranged]) || 0;
		wep.melee = 			!ranged;
		wep.shortRange = 		parseFloat(data[2][i][5 + ranged]) || 1;
		wep.mediumRange = 	parseFloat(data[2][i][7]) || 1;
		wep.longRange = 		parseFloat(data[2][i][8]) || 1;
		wep.smallDamage = 		parseFloat(data[2][i][9 + ranged]) || 1;
		wep.largeDamage = 		parseFloat(data[2][i][11 + ranged]) || 1;
		wep.size = 				parseFloat(data[2][i][13]) || 1;
		wep.damageType = 		data[2][i][14 + ranged] || "bludgeoning";
		wep.speed = 			parseFloat(data[2][i][16 + ranged]) || 1;
		wep.rof = 				parseFloat(data[2][i][18 + ranged]) || 1;
		
		newdata.weapons.push(wep);
	}
	
	
	
	
	
	newdata.notes = data[3] + "\nwealth:\n" + data[4];
	
	//AC is calculated automatically in new sheet
	/*
	if(!data[5]) {
		throw new Error("Malformed character sheet: array of data has no armour.");
	}
	
	for(var i = 0; i < data[5].length; i++) {
		
	}
	
	//Similarly here
	if(typeof data[6] === "undefined") {
		throw new Error("Malformed character sheet: array of data has no moverate.");
	}
	
	*/
	
	
	
	var languageList = htmlUnescape(data[7]).split(" "); //Best I can be bothered with right now
	newdata.languages = [];
	
	for(var i = 0; i < languageList.length; i++) {
		var lang = {};
		lang.name = languageList[i];
		lang.spokenLevel = "";
		lang.writtenLevel = "";
		newdata.languages.push(lang);
	}
	
	
	newdata.maximumHP = 	data[8][0] || "1";
	newdata.currentHP =		data[8][1] || "1";
	newdata.wounds =		htmlUnescape(data[8][2]) || "";
	newdata.temporaryHP =	data[8][3] || "0";
	
	newdata.experience = (data[9] && data[9].split(",").join("")) || "0";
	
	newdata.weaponProficiencies = [];
	for(var i = 0; i < data[10].length; i++) {
		var prof = {};
		prof.name = 	data[10][i][0] || "";
		prof.slots = 	parseInt(data[10][i][1]) || 0;
		newdata.weaponProficiencies.push(prof);
	}
	
	newdata.nonweaponProficiencies = [];
	for(var i = 0; i < data[11].length; i++) {
		var prof = {};
		prof.name = 	data[11][i][0] || "";
		prof.slots = 	parseInt(data[11][i][2]) || 0; //[1] is check, should be automatic now
		newdata.nonweaponProficiencies.push(prof);
	}
	
	//Thief skills here
	newdata.pickPocketsPointsSpent = 		data[12][0][1] || "0";
	newdata.openLocksPointsSpent = 		data[12][1][1] || "0";
	newdata.findRemoveTrapsPointsSpent = 	data[12][2][1] || "0";
	newdata.moveSilentlyPointsSpent = 		data[12][3][1] || "0";
	newdata.hideInShadowsPointsSpent = 	data[12][4][1] || "0";
	newdata.detectNoisePointsSpent = 		data[12][5][1] || "0";
	newdata.climbWallsPointsSpent = 			data[12][6][1] || "0";
	newdata.readLanguagesPointsSpent = 	data[12][7][1] || "0";
	
	
	newdata.carriedEquipment = [];
	var parseEq = function(eqArr) { //I made this because I though I had recursive equipment, the I realised I didn't
		var item = {};
		item.name = eqArr[0] || "";
		item.weight = eqArr[1] || "";
		item.number = eqArr[2] || "";
		return item;
	};
	
	var containersAdded = [];
	for(var i = 1; i < data[13].length; i++) { //containers
		var cont = {};
		cont.name = data[13][i][0][0];
		cont.container = true;
		cont.initialized = true;
		cont.contained = [];
		for(var i2 = 0; i2 < data[13][i].length; i2++) { //containers items
			cont.contained.push(parseEq(data[13][i][i2]));
		}
		newdata.carriedEquipment.push(cont);
		containersAdded.push(cont.name);
	}
	
	for(var i = 0; i < data[13][0].length; i++) { //main eq
		if((ri = containersAdded.indexOf(data[13][0][i])) < 0) {
			newdata.carriedEquipment.push(parseEq(data[13][0][i]));
		} else {
			containersAdded = containersAdded.concat(containersAdded.splice(ri).splice(1));
		}
	}
	
	delete parseEq;
	
	newdata.followers = [];
	for(var i = 0; i < data[14].length; i++) { //pets
		newdata.followers[i] = { 
			name:data[14][i][0], 
			type:data[14][i][1], 
			maximumHP:data[14][i][2], 
			currentHP:data[14][i][3], 
			wounds:data[14][i][4], 
			AC:data[14][i][5], 
			attack:data[14][i][6], 
			moveRate:data[14][i][7], 
			equipment:data[14][i][8], 
			notes:data[14][i][9] 
		}; 
	}
	
	if((typeof data[15][1] === "string") && data[15][1].length > 0 && data[15][1] !== "undefined") 
		newdata.customTitle = data[15][1];
	newdata.titleType = ["first", "last", "default", "default", "default"][data[15][0]];
	
	for(var i = 0; i < data[16].length; i++) { //comments
		newdata.notes += "\n" + data[16][i]; //I'll just dump any to notes so that they aren't lost
	}
	newdata.notes = htmlUnescape(newdata.notes);
	//Spells is a nightmare
	//I doubt anyone really used it anyway
	//I'll just let people add that back manually
	
	return { version:1, encryptionType:0, data:newdata };
}