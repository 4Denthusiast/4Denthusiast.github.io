function getSaveString(){
	data = {};
	var gmSalt = prepareGmKey();
	saveAllIn(data, document.getElementById("info"));
	saveAllIn(data, document.getElementById("stats"));
	data.weapons = formatTableForSave(weaponsTable);
	saveAllIn(data, document.getElementById("middleBit").children[0]);
	data.languages = formatTableForSave(languagesTable);
	saveAllIn(data, document.getElementById("health"));
	saveAllIn(data, document.getElementById("experience"));
	data.followers = formatTableForSave(followersTable);
	data.weaponProficiencies = formatTableForSave(attributes.weaponProficiencies.table);
	data.nonweaponProficiencies = formatTableForSave(attributes.proficiencies.table);
	data.memorisedSpells = formatTableForSave(spellTable);
	saveAllIn(data, document.getElementById("skullduggery"));
	saveAllIn(data, document.getElementById("titleMenu"));
	data.carriedEquipment = equipment.carriedTable;
	data.droppedEquipment = equipment.droppedTable;
	for(var d in data){
		if(!data[d])
			delete data[d];
	}
	var encData = encrypt(data, gmSalt);
	return encData && JSON.stringify(encData);
}

function saveAllIn(data, element, name){
	if(element.id)
		name = element.id;
	if(element.classList.contains("input")){
		var datum = getContentForSave(element);
		if(datum)
			data[name] = datum;
	}
	for(var i=0; i<element.children.length; i++)
		saveAllIn(data, element.children[i], name);
}

function formatTableForSave(table, format){
	format = format || table.format;
	table = table.tBodies[0];
	var result = [];
	for(var i=0; i<table.rows.length; i++){
		result[i] = {};
		for(var j=0; j<format.length; j++){
			if(format[j] && table.rows[i].cells[j+1].unlocked !== false)
				result[i][format[j]] = getContent(table.rows[i].cells[j+1]);
		}
	}
	return result;
}

EquipmentList.prototype.toJSON = function(){
	var result = [];
	for(var i=0; i<this.table.rows.length-1; i++)
		result[i] = this.table.rows[i+1].item;
	return result;
}

Item.prototype.toJSON = function(){
	var result={
		name:this.name.base,
		weight:this.weight.base,
		initialized:this.initialized,
		container:this.container.base,
		emptyWeight:this.emptyWeight.base,
		maxCarry:this.maxCarry.base,
		magicalContainer:this.magicalContainer.base,
		active:this.active.base,
		value:this.value.base,
		armour:this.armour.base,
		AC:parseFloat(this.AC.base),
		shield:this.shield.base,
		magicalArmour:this.magicalArmour.base,
		skullduggeryArmourType:parseFloat(this.skullduggeryArmourType.base),
		comments:this.comments.base,
		gmComments:gmEncrypt(this.gmComments.base, this.gmComments)
	};
	for(i in result){
		if(!result[i])
			delete(result[i])
	}
	if(this.container.base)
		result.contained = this.contained;
	if(this.number.base != 1)//Thiss has a different default value.
		result.number = parseFloat(this.number.base);
	return result;
}

function save(){
	var saveString = getSaveString();
	prevSavedHash = CryptoJS.MD5(saveString).toString();
	var blob = new Blob([saveString], {type: "text/x.character-sheet"});
	saveAs(blob, getName(), true);
}

var prevSavedHash;
window.addEventListener("load", ()=>(prevSavedHash = CryptoJS.MD5(getSaveString()).toString()));
window.addEventListener("beforeunload", function(e){
	var newSaveHash = CryptoJS.MD5(getSaveString()).toString();
	if(newSaveHash != prevSavedHash){
		return e.returnValue = "There seem to be unsaved changes. Are you sure you want to leave?";
	}
});
	

function getName(){
	var titleType = attributes.titleType.final;
	var title = attributes.title.final;
	if(titleType == "default")
		return "character.dndc";
	else
		return attributes.title.final+".dndc";
}

// Load 00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
if("registerContentHandler" in navigator){
	try{
		navigator.registerContentHandler("text/x.character-sheet", "character%20sheet.html?file=%s", "4Denthusiast's character sheet");
	}catch(SecurityException){
		console.log("Unable to register content handler.");
	}
}

makeFloaterDraggable(document.getElementById("saveMenu"), "Save & load");
var loadFileSelector = document.getElementById("loadFileSelector");

function loadFile(){
	var file = loadFileSelector.files[0];
	if(!file)
		return;
	var fileReader = new FileReader();
	fileReader.onload = useLoadedFileData;
	fileReader.readAsText(file);
}

function useLoadedFileData(){
	var fullData;
	var data;
	try{
		fullData = JSON.parse(this.result);
	}catch(e1){
		try{
			fullData = convertToNewtype(this.result);
		}catch(e2){
			alert("That file was not valid JSON. It is either the wrong file or from the wrong version of the character sheet.");
			return;
		}
	}
	if(fullData.version != 1){//I'll only change the version number when I make a change that actually breaks compatibility, and I'll try to avoid doing that.
		alert("Unsupported save-file version: "+fullData.version);
		return;
	}
	data = decrypt(fullData);
	if(!data)
		return;
	if("gmSalt" in encryptionDetails)
		gmKey = CryptoJS.PBKDF2(gmPassword, encryptionDetails.gmSalt, {keySize:4});
	else
		gmKey = undefined;
	loadFileData = data;
	loadAllIn(data, document.getElementById("info"));
	loadAllIn(data, document.getElementById("stats"));
	loadTableFromSave(data.weapons, weaponsTable);
	loadAllIn(data, document.getElementById("middleBit").children[0]);
	loadTableFromSave(data.languages, languagesTable);
	loadAllIn(data, document.getElementById("health"));
	loadAllIn(data, document.getElementById("experience"));
	loadTableFromSave(data.followers, followersTable);
	loadTableFromSave(data.weaponProficiencies, attributes.weaponProficiencies.table);
	loadTableFromSave(data.nonweaponProficiencies, attributes.proficiencies.table);
	//Besst not messs with the sspell table's rows.
	spellTable.loadFromSave(data.memorisedSpells);
	loadAllIn(data, document.getElementById("skullduggery"));
	loadAllIn(data, document.getElementById("titleMenu"));
	setCarriedTable(new EquipmentList("Carried:", data.carriedEquipment));//It'ss nicse how "carry" and "dropp" have the ssame length.
	setDroppedTable(new EquipmentList("Dropped:", data.droppedEquipment));
	prevSavedHash = CryptoJS.MD5(getSaveString()).toString();
}

function loadAllIn(data, element, name){
	if(element.id)
		name = element.id;
	if(element.classList.contains("input"))
		setContentForLoad(element, data[name] || "");
	for(var i=0; i<element.children.length; i++)
		loadAllIn(data, element.children[i], name);
}

function loadTableFromSave(data, table){
	table.disableAutoAddRow = true;
	var tBody = table.tBodies[0];
	while(tBody.rows.length>0){
		var row = tBody.rows[0];
		if(row.onDelete)
			row.onDelete();//I'm glad I have thiss sset up already.
		if(row.parentNode)//It might have deleted itself in onDelete.
			row.parentNode.removeChild(row);
	}
	if(data){//Backwards compatibility
		for(var i=0; i<data.length; i++)
			table.addRow(data[i]);
	}else
		table.addRow({});
	table.disableAutoAddRow = false;
}
