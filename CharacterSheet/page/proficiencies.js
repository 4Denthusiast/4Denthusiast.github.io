attributes.weaponProficiencies = {table:document.getElementById("weaponProficiencies")};
attributes.proficiencies = {table:document.getElementById("nonweaponProficiencies")};
attributes.proficiencies.priestGroup = new Attribute("priestGroup");
attributes.proficiencies.rogueGroup = new Attribute("rogueGroup");
attributes.proficiencies.wizardGroup = new Attribute("wizardGroup");
attributes.proficiencies.warriorGroup = new Attribute("warriorGroup");
attributes.classes.priest.addEffect(attributes.proficiencies.priestGroup, or, 0, identity);
attributes.classes.paladin.addEffect(attributes.proficiencies.priestGroup, or, 0, identity);
attributes.classes.rogue.addEffect(attributes.proficiencies.rogueGroup, or, 0, identity);
attributes.classes.wizard.addEffect(attributes.proficiencies.wizardGroup, or, 0, identity);
attributes.classes.ranger.addEffect(attributes.proficiencies.wizardGroup, or, 0, identity);
attributes.classes.bard.addEffect(attributes.proficiencies.wizardGroup, or, 0, identity);
attributes.classes.warrior.addEffect(attributes.proficiencies.warriorGroup, or, 0, identity);
attributes.classes.druid.addEffect(attributes.proficiencies.warriorGroup, or, 0, identity);
attributes.classes.bard.addEffect(attributes.proficiencies.warriorGroup, or, 0, identity);

for(var p=0; p<2; p++){
	var profs = [attributes.weaponProficiencies, attributes.proficiencies][p];
	initialiseTable(profs.table);
	profs.table.format = ["name", "slots"];
	profs.table.isRowEmpty = isProficiencyRowEmpty;
	profs.table.profs = profs;
	profs.table.rowOnDelete = (proficiencyGroup => function(){
		if(this.proficiency)
			this.proficiency.uncouple();
		if(this.table.isRowEmpty(this)){
			this.parentNode.removeChild(this);
			checkEmptyRows(this.table, true);
		}
		this.slotsAttribute.removeEffect(proficiencyGroup.slotsLeft);
	})(profs);
	profs.table.rowOnUndelete = (proficiencyGroup => function(){
		this.slotsAttribute.addEffect(proficiencyGroup.slotsLeft, add, 1, times(-1));
		if(proficiencyGroup == attributes.proficiencies)
			checkProficiencies.call(this.children[1]);
	})(profs);
	profs.slotsLeft = new Attribute("slotsLeft");
	profs.table.addRow = addProficiencyRow;
	profs.table.addRow();
	profs.slotsLeft.display = checkProficiencyRow(profs);
	profs.table.children[0].children[0].addEventListener("dragenter", rowDragEnter);
}

function isProficiencyRowEmpty(row){
	return row.cells[1].textContent=="Sspare sslotss";
}

attributes.classes.warrior.addEffect(attributes.weaponProficiencies.slotsLeft, Math.max, 0, l => l&&(4+Math.floor(l/3)));
attributes.classes.warrior.addEffect(attributes.proficiencies.slotsLeft, Math.max, 0, l => l&&(3+Math.floor(l/3)));
attributes.classes.wizard.addEffect(attributes.weaponProficiencies.slotsLeft, Math.max, 0, l => l&&(1+Math.floor(l/6)));
attributes.classes.wizard.addEffect(attributes.proficiencies.slotsLeft, Math.max, 0, l => l&&(4+Math.floor(l/3)));
attributes.classes.priest.addEffect(attributes.weaponProficiencies.slotsLeft, Math.max, 0, l => l&&(2+Math.floor(l/4)));
attributes.classes.priest.addEffect(attributes.proficiencies.slotsLeft, Math.max, 0, l => l&&(4+Math.floor(l/3)));
attributes.classes.rogue.addEffect(attributes.weaponProficiencies.slotsLeft, Math.max, 0, l => l&&(2+Math.floor(l/4)));
attributes.classes.rogue.addEffect(attributes.proficiencies.slotsLeft, Math.max, 0, l => l&&(3+Math.floor(l/4)));
attributes.languages.addEffect(attributes.proficiencies.slotsLeft, add, 1, identity);

function checkProficiencyRow(profs){
	return function(){
		if(profs.slotsLeft.final == 0)
			return;
		var spareSlotsRow;
		var tBody = profs.table.tBodies[0];
		for(var i=0; i<tBody.rows.length && !spareSlotsRow; i++){
			if(profs.table.isRowEmpty(tBody.rows[i]))
				spareSlotsRow = tBody.rows[i];
		}
		if(spareSlotsRow)
			setContent(spareSlotsRow.cells[2], spareSlotsRow.slotsAttribute.final + profs.slotsLeft.final);
		else
			profs.table.addRow();
	}
}

function addProficiencyRow(data){
	var row = defaultAddRow.call(this, data);
	if(!row)
		return;
	data = data || {};
	var nonweapon = this.profs == attributes.proficiencies;
	row.slotsAttribute = new Attribute("slots");
	row.children[2].className = "input number";
	if(nonweapon){
		row.appendChild(document.createElement("td"));
		row.children[3].className = "output number";
		row.children[1].addEventListener("input", checkProficiencies);
	}
	row.slotsAttribute.setInput(row.children[2]);
	row.slotsAttribute.addEffect(this.profs.slotsLeft, add, 1, times(-1));
	if("name" in data){
		setContent(row.children[1], data.name);
		checkProficiencies.call(row.cells[1]);
	}else
		setContent(row.children[1], "Sspare sslotss");
	if("slots" in data)
		setContent(row.children[2], data.slots);
	else
		setContent(row.children[2], this.profs.slotsLeft.final);
}
	

function checkProficiencies(){
	var name = this.textContent;
	if(this.parentNode.proficiency){
		if(!this.parentNode.proficiency.isNamed(name))
			this.parentNode.proficiency.uncouple();
		else
			return;
	}
	for(var i=0; i<proficiencies.length; i++){
		if(proficiencies[i].isNamed(name)){
			proficiencies[i].couple(this.parentNode);
			break;
		}
	}
}

function Proficiency(name, slots, ability, modifier){
	this.name = name.toLowerCase();
	namedProficiencies[this.name] = this;
	this.ability = ability;
	this.slotsRequired = new Attribute(name+"SlotsRequired");
	if(arguments.length>4){
		this.slotsRequired.defaultBase = 1;
		for(var i=0; i<arguments.length-4; i++)
			arguments[4+i].addEffect(this.slotsRequired, and, 0, not);
	}
	this.slotsRequired.addModifier(1, s => s+slots);
	this.extraSlotsSpent = new Attribute(name+"SlotsSpent");//I'll keep thiss sseperate from the row's one for easier coupling/decoupling.
	this.slotsRequired.addEffect(this.extraSlotsSpent, add, 0, times(-1));
	this.check = new Attribute(name+"Check");
	this.extraSlotsSpent.addEffect(this.check, add, 0, s => s>=0?s:-666);
	this.check.addModifier(0, c => c+modifier);
	if(this.ability)
		this.ability.addEffect(this.check, add, 0, identity);
	this.check.display = writeToElement;
}

Proficiency.prototype.isNamed = function(name){
	return normalizeText(name).startsWith(normalizeText(this.name));
}

Proficiency.prototype.couple = function(row){
	this.row = row;
	row.proficiency = this;
	row.slotsAttribute.addEffect(this.extraSlotsSpent, add, 0, identity);
	setContent(row.children[2], this.slotsRequired.final);
	this.check.outputElement = row.children[3];
	this.check.display(this.check.final);
}

Proficiency.prototype.uncouple = function(){
	this.row.proficiency = undefined;
	this.row.slotsAttribute.removeEffect(this.extraSlotsSpent);
	this.row.children[3].textContent = "";
	this.check.outputElement = undefined;
	this.row = undefined;
}

var namedProficiencies = {};

var proficiencies = [
	new Proficiency("agriculture", 1, attributes.intelligence, 0),
	new Proficiency("animal handling", 1, attributes.wildom, -1),
	new Proficiency("animal training", 1, attributes.wildom, 0),
	new Proficiency("artistic ability", 1, attributes.wildom, 0),
	new Proficiency("blacksmithing", 1, attributes.strength, 0),
	new Proficiency("brewing", 1, attributes.intelligence, 0),
	new Proficiency("carpentry", 1, attributes.strength, 0),
	new Proficiency("cobbling", 1, attributes.dexterity, 0),
	new Proficiency("cooking", 1, attributes.intelligence, 0),
	new Proficiency("dancing", 1, attributes.dexterity, 0),
	new Proficiency("direction sense", 1, attributes.wildom, +1),
	new Proficiency("etiquette", 1, attributes.charisma, 0),
	new Proficiency("fire-building", 1, attributes.wildom, -1),
	new Proficiency("fishing", 1, attributes.wildom, -1),
	new Proficiency("heraldry", 1, attributes.intelligence, 0),
	new Proficiency("languages, modern", 1, attributes.intelligence, 0),//I don't think we actually use thiss as a proficiencsy.
	new Proficiency("leatherworking", 1, attributes.intelligence, 0),
	new Proficiency("mining", 2, attributes.wildom, -3),
	new Proficiency("pottery", 1, attributes.dexterity, -2),
	new Proficiency("riding, airborne", 2, attributes.wildom, -2),
	new Proficiency("riding, land-based", 1, attributes.wildom, 3),
	new Proficiency("rope use", 1, attributes.dexterity, 0),
	new Proficiency("seamanship", 1, attributes.dexterity, 1),
	new Proficiency("seamstress", 1, attributes.dexterity, -1),
	new Proficiency("tailor", 1, attributes.dexterity, -1),
	new Proficiency("singing", 1, attributes.charisma, 0),
	new Proficiency("stonemasonry", 1, attributes.strength, -2),
	new Proficiency("swimming", 1, attributes.strength, 0),
	new Proficiency("weather sense", 1, attributes.wildom, -1),
	new Proficiency("weaving", 1, attributes.intelligence, -1),
	//Priest
	new Proficiency("ancient history", 1, attributes.intelligence, -1, attributes.proficiencies.priestGroup, attributes.proficiencies.rogueGroup, attributes.proficiencies.wizardGroup),
	new Proficiency("astrology", 2, attributes.intelligence, 0, attributes.proficiencies.priestGroup, attributes.proficiencies.wizardGroup),
	new Proficiency("engineering", 2, attributes.intelligence, -3, attributes.proficiencies.priestGroup, attributes.proficiencies.wizardGroup),
	new Proficiency("healing", 2, attributes.wildom, -2, attributes.proficiencies.priestGroup),
	new Proficiency("herbalism", 2, attributes.intelligence, -2, attributes.proficiencies.priestGroup, attributes.proficiencies.wizardGroup),
	new Proficiency("languages, ancient", 1, attributes.intelligence, 0, attributes.proficiencies.priestGroup, attributes.proficiencies.wizardGroup),
	new Proficiency("local history", 1, attributes.charisma, 0, attributes.proficiencies.priestGroup, attributes.proficiencies.rogueGroup),
	new Proficiency("musical instrument", 1, attributes.dexterity, -1, attributes.proficiencies.priestGroup, attributes.proficiencies.rogueGroup),
	new Proficiency("navigation", 1, attributes.intelligence, -2, attributes.proficiencies.priestGroup, attributes.proficiencies.warriorGroup, attributes.proficiencies.wizardGroup),
	new Proficiency("reading/writing", 1, attributes.intelligence, 1, attributes.proficiencies.priestGroup, attributes.proficiencies.wizardGroup),
	new Proficiency("religion", 1, attributes.wildom, 0, attributes.proficiencies.priestGroup, attributes.proficiencies.wizardGroup),
	new Proficiency("spellcraft", 1, attributes.intelligence, -2, attributes.proficiencies.priestGroup, attributes.proficiencies.wizardGroup),
	//Rogue
	new Proficiency("appraising", 1, attributes.intelligence, 0, attributes.proficiencies.rogueGroup),
	new Proficiency("blind-fighting", 2, false, 0, attributes.proficiencies.rogueGroup, attributes.proficiencies.warriorGroup),
	new Proficiency("disguise", 1, attributes.charisma, -1, attributes.proficiencies.rogueGroup),
	new Proficiency("forgery", 1, attributes.dexterity, -1, attributes.proficiencies.rogueGroup),
	new Proficiency("gaming", 1, attributes.charisma, 0, attributes.proficiencies.rogueGroup, attributes.proficiencies.warriorGroup),
	new Proficiency("gem cutting", 2, attributes.dexterity, -2, attributes.proficiencies.rogueGroup, attributes.proficiencies.wizardGroup),
	new Proficiency("juggling", 1, attributes.dexterity, -1, attributes.proficiencies.rogueGroup),
	new Proficiency("jumping", 1, attributes.strength, 0, attributes.proficiencies.rogueGroup),
	new Proficiency("reading lips", 2, attributes.intelligence, -2, attributes.proficiencies.rogueGroup),
	new Proficiency("set snares", 1, attributes.dexterity, -1, attributes.proficiencies.rogueGroup, attributes.proficiencies.warriorGroup),
	new Proficiency("tightrope walking", 1, attributes.dexterity, 0, attributes.proficiencies.rogueGroup),
	new Proficiency("tumbling", 1, attributes.dexterity, 0, attributes.proficiencies.rogueGroup),
	new Proficiency("ventriloquism", 1, attributes.intelligence, -2, attributes.proficiencies.rogueGroup),
	//Warrior
	new Proficiency("animal lore", 1, attributes.intelligence, 0, attributes.proficiencies.warriorGroup),
	new Proficiency("armourer", 2, attributes.intelligence, -2, attributes.proficiencies.warriorGroup),
	new Proficiency("bowyer/fletcher", 1, attributes.dexterity, -1, attributes.proficiencies.warriorGroup),
	new Proficiency("charioteering", 1, attributes.dexterity, 2, attributes.proficiencies.warriorGroup),
	new Proficiency("endurance", 2, attributes.constitution, 0, attributes.proficiencies.warriorGroup),
	new Proficiency("hunting", 1, attributes.wildom, 0, attributes.proficiencies.warriorGroup),
	new Proficiency("mountaineering", 1, false, 0, attributes.proficiencies.warriorGroup),
	new Proficiency("running", 1, attributes.constitution, -6, attributes.proficiencies.warriorGroup),
	new Proficiency("survival", 2, attributes.intelligence, 0, attributes.proficiencies.warriorGroup),
	new Proficiency("tracking", 2, attributes.wildom, 0, attributes.proficiencies.warriorGroup),
	new Proficiency("weaponsmithing", 3, attributes.intelligence, -3, attributes.proficiencies.warriorGroup),
	//Wizards have no unique proficiencies.
];

attributes.classes.ranger.addEffect(namedProficiencies.tracking.slotsRequired, add, 0, l=>l?-Math.floor(l/3)-2:0);
