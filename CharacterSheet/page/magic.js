attributes.spellSlots.defaultBase = [];
//The representation I'll be using is inefficient, but never mind.

var addSpellSlots = cName => function(spellSlots, table){
	result = spellSlots.slice(0);
	for(var i=0; i<table.length; i++){
		for(var j=0; j<table[i]; j++)
			result.push([cName,i+1]);
	}
	return result;
}
var compareSpellSlots = (a,b) => (a[1]-b[1])*3+(a[0]>b[0])-(a[0]<b[0])
var sortSpellSlots = function(spellSlots){
	result = spellSlots.slice(0);
	result.sort(compareSpellSlots);
	return result;
}

var filterLevel = cName => function(spellSlots, level){
	return spellSlots.filter(s => (s[0] != cName) || (s[1] <= level));
}

attributes.classes.wizard.addEffect(attributes.spellSlots, addSpellSlots("Arcane"), 0, [[],
	[1],
	[2],
	[2,1],
	[3,2],
	[4,2,1],
	[4,2,2],
	[4,3,2,1],
	[4,3,3,2],
	[4,3,3,2,1],
	[4,4,3,2,2],
	[4,4,4,3,3],
	[4,4,4,4,4,1],
	[5,5,5,4,4,2],
	[5,5,5,4,4,2,1],
	[5,5,5,5,5,2,1],
	[5,5,5,5,5,3,2,1],
	[5,5,5,5,5,3,3,2],
	[5,5,5,5,5,3,3,2,1],
	[5,5,5,5,5,3,3,3,1],
	[5,5,5,5,5,4,3,3,2]]);
attributes.classes.specialist.addEffect(attributes.spellSlots, addSpellSlots("Specialist"), 0, [[],
	[1],
	[1],
	[1,1],
	[1,1],
	[1,1,1],
	[1,1,1],
	[1,1,1,1],
	[1,1,1,1],
	[1,1,1,1,1],
	[1,1,1,1,1],
	[1,1,1,1,1],
	[1,1,1,1,1,1],
	[1,1,1,1,1,1],
	[1,1,1,1,1,1,1],
	[1,1,1,1,1,1,1],
	[1,1,1,1,1,1,1,1],
	[1,1,1,1,1,1,1,1],
	[1,1,1,1,1,1,1,1,1],
	[1,1,1,1,1,1,1,1,1],
	[1,1,1,1,1,1,1,1,1]]);
attributes.classes.priest.addEffect(attributes.spellSlots, addSpellSlots("Divine"), 0, [[],
	[1],
	[2],
	[2,1],
	[3,2],
	[3,3,1],
	[3,3,2],
	[3,3,2,1],
	[3,3,3,2],
	[4,4,3,2,1],
	[4,4,3,3,2],
	[5,4,4,3,2,1],
	[6,5,5,3,2,2],
	[6,6,6,4,2,2],
	[6,6,6,5,3,2,1],
	[6,6,6,6,4,2,1],
	[7,7,7,6,4,3,1],
	[7,7,7,7,5,3,2],
	[8,8,8,8,6,4,2],
	[9,9,8,8,6,4,2],
	[9,9,9,8,7,5,2]]);
attributes.classes.paladin.addEffect(attributes.spellSlots, addSpellSlots("Divine"), 0, [[],[],[],[],[],[],[],[],[],
	[1],
	[2],
	[2,1],
	[2,2],
	[2,2,1],
	[3,2,1],
	[3,2,1,1],
	[3,3,2,1],
	[3,3,3,2],
	[3,3,3,1],
	[3,3,3,1],
	[3,3,3,2],
	[3,3,3,3]]);
attributes.classes.ranger.addEffect(attributes.spellSlots, addSpellSlots("Divine"), 0, [[],[],[],[],[],[],[],[],
	[1],
	[2],
	[2,1],
	[2,2],
	[2,2,1],
	[3,2,1],
	[3,2,2],
	[3,3,2],
	[3,3,3]]);
attributes.classes.bard.addEffect(attributes.spellSlots, addSpellSlots("Arcane"), 0, [[],[],
	[1],
	[2],
	[2,1],
	[3,1],
	[3,2],
	[3,2,1],
	[3,3,1],
	[3,3,2],
	[3,3,2,1],
	[3,3,3,1],
	[3,3,3,2],
	[3,3,3,2,1],
	[3,3,3,3,1],
	[3,3,3,3,2],
	[4,3,3,3,2,1],
	[4,4,3,3,3,1],
	[4,4,4,3,3,2],
	[4,4,4,4,3,2],
	[4,4,4,4,4,3]]);
attributes.bonusSpells.defaultBase = [];
attributes.wildom.addEffect(attributes.bonusSpells, addSpellSlots("Divine"), 0, [[],[],[],[],[],[],[],[],[],[],[],[],[],[1],[2],[2,1],[2,2],[2,2,1],[2,2,1,1],[3,2,2,1],[3,3,2,2],[3,3,3,2,1],[3,3,3,3,2],[4,3,3,3,2,1],[4,3,3,3,3,2]]);
attributes.classes.priest.addEffect(attributes.bonusSpells, filterLevel("Divine"), 1, [0,1,1,2,2,3,3,4,4,5,5,6,6,6,7]);
attributes.bonusSpells.addEffect(attributes.spellSlots, concat, 1, identity);
attributes.maxSpellLevel.addEffect(attributes.spellSlots, filterLevel("Arcane"), 2, identity);
attributes.maxSpellLevel.addEffect(attributes.spellSlots, filterLevel("Specialist"), 2, identity);
attributes.wildom.addEffect(attributes.spellSlots, filterLevel("Divine"), 2, [0,0,0,0,0,0,0,0,0,5,5,5,5,5,5,5,5,6,7]);
attributes.spellSlots.addModifier(3, sortSpellSlots);

var spellTable = document.getElementById("spells");
spellTable.format = ["cast", "name"];//Coincidentally, the firsst column isn't included even though these rows aren't draggable.
attributes.spellSlots.display = function(spellSlots){
	spellTable.parentNode.style.display = spellSlots.length?"":"none";
	var tBody = spellTable.tBodies[0];
	for(var i=0; i<spellSlots.length; i++){
		if(i >= tBody.rows.length)
			break;
		var tableSlot = tBody.rows[i].slotType;
		var rel = compareSpellSlots(spellSlots[i],tableSlot);
		if(rel>0){
			tBody.removeChild(tBody.rows[i]);
			i--;//Repeat this bit
		}else if(rel<0)
			tBody.insertBefore(makeSpellTableRow(spellSlots[i]), tBody.rows[i]);
	}
	for(var i=tBody.rows.length; i<spellSlots.length; i++)
		tBody.appendChild(makeSpellTableRow(spellSlots[i]));
	for(var i=spellSlots.length; i<tBody.rows.length; i++)
		tBody.removeChild(tBody.rows[i]);
}

function makeSpellTableRow(slotType){
	row = document.createElement("tr");
	for(var i=0; i<9; i++){
		row.appendChild(document.createElement("td"));
		row.children[i].className = "output";
	}
	row.slotType = slotType;
	row.children[0].textContent = slotType[0] + ",  " + slotType[1];
	row.children[1].appendChild(document.createElement("input"));
	row.children[1].children[0].type = "checkbox";
	row.children[1].className = "";
	row.children[1].input = row.children[1].children[0];
	row.children[2].className = "input";
	row.children[2].contentEditable = true;
	row.children[2].oninput = updateSpellSlot;
	return row;
}

var emptySpell = ["","","","","","","",""]
function updateSpellSlot(ev){
	var row = ev.currentTarget.parentNode;
	var spellName = normalizeText(ev.currentTarget.textContent);
	if(row.slotType[0] == "Arcane" || row.slotType[0] == "Specialist")
		var spell = wizardSpells[spellName];
	if(row.slotType[0] == "Divine")
		spell = priestSpells[spellName];
	if(!spell || spell[0] > row.slotType[1])
		spell = emptySpell;
	for(var i=1; i<=6; i++)
		row.children[i+2].textContent = spell[i];
}

spellTable.loadFromSave = function(data){
	var tBody = spellTable.tBodies[0];
	for(var i=0; i<data.length && i<tBody.rows.length; i++){
		var row = tBody.rows[i];
		if("cast" in data[i])
			setContent(row.children[1].children[0], data[i].cast);
		if("name" in data[i])
			setContent(row.children[2], data[i].name);
		updateSpellSlot({currentTarget:row.children[2]});
	}
}
