var equipment = {};
var equipmentDiv = document.getElementById("equipment");

function EquipmentList(label, data){
	this.outerDiv = document.createElement("div");
	this.outerDiv.className = "box";
	this.label = document.createElement("span");
	this.label.textContent = label;
	this.label.className = "label";
	this.outerDiv.appendChild(this.label);
	this.table = document.createElement("table");
	this.table.className = "equipment"
	this.table.equipmentList = this;
	this.outerDiv.appendChild(this.table);
	weightLabel = document.createElement("div");
	weightLabel.appendChild(document.createElement("span"));
	weightLabel.children[0].className = "label";
	weightLabel.children[0].textContent = "Weight:";
	weightLabel.appendChild(document.createElement("span"));
	weightLabel.children[1].className = "output number textfield";
	this.outerDiv.appendChild(weightLabel);
	this.table.appendChild(document.createElement("tbody"));
	var headers = document.createElement("tr");
	this.table.children[0].appendChild(headers);
	for(var i=0; i<5; i++)
		headers.appendChild(document.createElement("th"));
	headers.children[0].textContent = "Drag";
	headers.children[1].textContent = "Item name";
	headers.children[2].textContent = "Number";
	headers.children[3].textContent = "Weight";
	headers.children[4].textContent = "Traits";
	headers.addEventListener("dragenter", rowDragEnter);
	equipmentDiv.appendChild(this.outerDiv);
	this.weight = new Attribute("totalWeight");
	this.weight.display = writeToElement;
	this.weight.outputElement = weightLabel.children[1];
	this.encumbranceWeight = new Attribute("encumbranceWeight");
	this.hasEmptyRow = new Attribute("hasEmptyRow");
	data = data || [false];
	for(var i=0; i<data.length; i++)
		this.addRow(data[i]);
	var list = this;
	this.hasEmptyRow.display = function(f){if(!f)list.addRow();};
}

EquipmentList.prototype.addRow = function(data){
	var row = document.createElement("tr");
	for(var i=0; i<5; i++)
		row.appendChild(document.createElement("td"));
	row.children[0].className = "dragHandle";
	row.children[1].className = "input";
	row.children[2].className = "input number";
	row.children[3].className = "input";//I'm not making it a number, because thiss has sspecial parssing rules.
	row.children[4].appendChild(document.createElement("button"));
	if(data){
		if("name" in data)
			row.children[1].textContent = data.name;
		if("number" in data)
			row.children[2].textContent = data.number;
		if("weight" in data)
			row.children[3].textContent = data.weight;
	}
	row.item = new Item(row, this, data);
	makeRowDraggable(row, notContainedInItem(row.item), markRowDeleted, markRowUndeleted);
	row.children[0].children[0].addEventListener("dragend", shiftItemToNewContainer);
	this.table.children[0].appendChild(row);
}

function Item(row, equipmentList, data){
	this.row = row;
	row.item = this;
	this.equipmentList = equipmentList;
	this.name = new Attribute("name");
	this.name.setInput(row.children[1]);
	this.name.addEffect(equipmentList.hasEmptyRow, or, 0, not);
	this.name.display = nameDisplay(this);
	this.number = new Attribute("number");
	this.number.defaultBase = 1;
	this.number.setInput(row.children[2]);
	this.weight = new Attribute("weight");
	this.weight.setInput(row.children[3]);
	this.weight.display = writeToElement;//If thiss becomes a container, the weight column will be an output insstead.
	row.children[4].addEventListener("click", openItemTraitsMenu);
	this.weight.addModifier(0, equipment.parseWeight);
	this.totalWeight = new Attribute("totalWeight");//I'm keeping thiss sseperate sso that the weight of containers is dissplayed correctly.
	this.encumbranceWeight = new Attribute("encumbranceWeight");
	this.weight.addEffect(this.totalWeight, set, 0, identity);
	this.number.addEffect(this.totalWeight, mult, 1, identity);
	this.totalWeight.addEffect(equipmentList.weight, add, 0, identity);
	this.totalWeight.addEffect(this.encumbranceWeight, add, 0, identity);
	this.encumbranceWeight.addEffect(equipmentList.encumbranceWeight, add, 0, identity);
	this.initialized = data && data.initialized && true;
	this.deleted = new Attribute("itemDeleted");
	this.container = new Attribute("container");
	this.emptyWeight = new Attribute("containerEmptyWeight");
	this.maxCarry = new Attribute("containerMaxCarry");
	this.magicalContainer = new Attribute("containerMagical");
	this.active = new Attribute("active");
	this.value = new Attribute("value");
	this.armour = new Attribute("armour");
	this.AC = new Attribute("armourAC");
	this.shield = new Attribute("armourShield");
	this.magicalArmour = new Attribute("armourMagical");
	this.skullduggeryArmourType = new Attribute("armourSkullduggeryType");
	this.comments = new Attribute("comments");
	this.gmComments = new Attribute("gmComments");
	this.comments.defaultBase = "";
	this.gmComments.defaultBase = "";
	this.menuTraits = [this.container, this.emptyWeight, this.maxCarry, this.magicalContainer, this.active, this.value, this.armour, this.AC, this.shield, this.magicalArmour, this.skullduggeryArmourType, this.comments, this.gmComments];
	this.containerCarriedWeight = new Attribute("containerCarriedWeight");
	this.container.addEffect(this.emptyWeight, mult, 1, identity);
	this.container.addEffect(this.containerCarriedWeight, mult, 1, identity);
	this.container.display = containerDisplay(this);
	this.maxCarry.addModifier(0, equipment.parseWeight);
	this.emptyWeight.addModifier(0, equipment.parseWeight);
	this.emptyWeight.addEffect(this.weight, add, 1, identity);
	this.effectiveCarriedWeight = new Attribute("effectiveCarriedWeight");
	this.containerCarriedWeight.addEffect(this.effectiveCarriedWeight, set, 0, identity);
	this.magicalContainer.addEffect(this.effectiveCarriedWeight, mult, 1, not);
	this.effectiveCarriedWeight.addEffect(this.weight, add, 1, identity);
	this.overWeight = new Attribute("excess weight");
	this.containerCarriedWeight.addEffect(this.overWeight, set, 0, identity);
	this.maxCarry.addEffect(this.overWeight, (w,m)=>m==0?false:w>m, 1, identity);
	this.overWeight.display = displayContainerOverWeight(this);
	this.deleted.addEffect(this.active, and, 0, not);
	this.active.addEffect(this.AC, mult, 0, identity);
	this.active.addEffect(this.magicalArmour, mult, 0, identity);
	this.active.addEffect(this.skullduggeryArmourType, mult, 0, identity);
	this.magicalArmour.addEffect(this.encumbranceWeight, mult, 1, not);
	this.armourAC = new Attribute("wornArmourAC");//The AC due to suitss of armour exscluding shields
	this.shieldAC = new Attribute("shieldAC");
	this.AC.addEffect(this.armourAC, set, 0, identity);
	this.AC.addEffect(this.shieldAC, set, 0, identity);
	this.shield.addEffect(this.armourAC, mult, 1, not);
	this.shield.addEffect(this.shieldAC, mult, 1, identity);
	this.armourAC.addEffect(attributes.flatFootAC, setAC, 1, identity);
	this.shieldAC.addEffect(attributes.flatFootAC, add, 2, identity);
	this.armour.addEffect(this.skullduggeryArmourType, mult, 0, identity);
	attributes.classes.bard.addEffect(this.skullduggeryArmourType, (c,b) => (c>=4)&&!b?5:c, 1, identity);
	this.skullduggeryArmourType.addEffect(attributes.skullduggeryArmourType, Math.max, 0, identity);
	this.value.addModifier(0, equipment.parseMoney);
	this.number.addEffect(this.value, mult, 1, identity);
	this.deleted.addEffect(this.value, mult, 1, not);
	this.value.addEffect(attributes.wealth, add, 0, identity);
	if(data){
		if("contained" in data)
			this.addContained(data.contained);
		if("gmComments" in data)
			this.gmComments.defaultBase = gmDecrypt(data.gmComments, this.gmComments);
		var menuTraitsSaveNames = ["container", "emptyWeight", "maxCarry", "magicalContainer", "active", "value", "armour", "AC", "shield", "magicalArmour", "skullduggeryArmourType", "comments"];
		for(var i=0; i<this.menuTraits.length; i++){
			var name = menuTraitsSaveNames[i];
			if(name in data){
				this.menuTraits[i].defaultBase = data[name];
			}
		}
	}
	for(var i=0; i<this.menuTraits.length; i++)
		this.menuTraits[i].recalculate();
}

function markRowDeleted(){
	this.item.markDeleted();
}
function markRowUndeleted(){
	this.item.markUndeleted();
}

Item.prototype.markDeleted = function(){
	this.deleted.defaultBase = true;
	this.deleted.recalculate();
	if(this == equipment.currentMenuItem)
		closeItemTraitsmenu();
	if(this.contained)
		this.contained.markDeleted();
}
Item.prototype.markUndeleted = function(){
	this.deleted.defaultBase = false;
	this.deleted.recalculate();
	if(this.contained)
		this.contained.markUndeleted();
}

Item.prototype.addContained = function(data){
	this.contained = new EquipmentList(this.name.final+":", data);
	this.contained.weight.addEffect(this.containerCarriedWeight, set, 0, identity);
	this.contained.container = this;
}

EquipmentList.prototype.markDeleted = function(){
	if(!this.outerDiv.parentNode)
		return;
	this.encumbranceWeight.removeEffect(attributes.encumbranceEffectiveWeight);
	this.weight.removeEffect(attributes.weightCarried);
	for(var i=1; i<this.table.rows.length; i++)
		this.table.rows[i].item.markDeleted();
	this.outerDiv.parentNode.removeChild(this.outerDiv);
}
EquipmentList.prototype.markUndeleted = function(){
	if(!this.container)
		console.log("markUndeleted is not prepared for the undeletion of top-level equipment lists.");
	if(this.outerDiv.parentNode)
		return;
	for(var i=1; i<this.table.rows.length; i++)
		this.table.rows[i].item.markUndeleted();
	document.getElementById("equipment").appendChild(this.outerDiv);
}

function setAC(base, armour){
	if(!armour)
		return base;
	if(armour<=base)
		return base+1;
	return armour;
}

var parseUnits = units => function(str){
	if(!str)
		return 0;
	var unitStart = str.length;
	while(unitStart>0 && str.charAt(unitStart-1).search(/\d|\./)==-1)unitStart--;
	number = parseFloat(str.substring(0, unitStart));
	unit = equipment.weightUnits[str.substring(unitStart)];
	if(isNaN(number))
		return 0;
	if(!unit)
		unit = 1;
	return number*unit
}
equipment.weightUnits = {
	gr:1/7000,
	dr:1/256,
	oz:1/16,
	lb:1,
	st:14,
	qtr:28,
	cwt:112,
	t:2240,
	mg:0.000002204622622,
	g:0.002204622622,
	kg:2.204622622,
	T:2204.622622
};
equipment.parseWeight = parseUnits(equipment.weightUnits);
equipment.parseMoney = parseUnits({pp:10,gp:1,sp:0.1,cp:0.01});
	

function openItemTraitsMenu(ev){
	closeItemTraitsMenu();
	item = this.parentNode.item;
	if(!item.initialized)
		item.guessValues();
	itemTraitsMenu.style.display = "flex";
	equipment.currentMenuItem = item;
	item.armour.display = armourDisplay;
	for(var i=0; i<item.menuTraits.length; i++){
		name = item.menuTraits[i].name.toLowerCase();
		el = itemTraitsInputElements[name];
		if(el){
			setContent(el, item.menuTraits[i].defaultBase);
			item.menuTraits[i].setInput(itemTraitsInputElements[name]);
		}
	}
	if(item.contained)
		item.contained.outerDiv.className = "box highlighted";
	item.name.recalculate();//Thiss is the easiesst way to update the title.
}

function closeItemTraitsMenu(){
	item = equipment.currentMenuItem;
	if(!item)
		return;
	equipment.currentMenuItem = undefined;
	itemTraitsMenu.style.display = "none";
	for(var i=0; i<item.menuTraits.length; i++)
		item.menuTraits[i].freezeInput();
	item.armour.display = nil;
	if(item.contained)
		item.contained.outerDiv.className = "box";
}

var containerDisplay = item => function(c){
	if(item == equipment.currentMenuItem)
		containerTraitsMenu.style.display = c?"":"none";
	if(c){
		if(!item.contained)
			item.addContained();
		item.contained.markUndeleted();
		item.row.children[3].className = "output";
		item.row.children[3].contentEditable = false;
		item.weight.removeInput();
		item.weight.outputElement = item.row.children[3];
		if(equipment.currentMenuItem==item)
			item.contained.outerDiv.className = "box highlighted";
	}else if(item.contained){
		item.contained.markDeleted();
		item.row.children[3].className = "input";
		item.row.children[3].contentEditable = true;
		item.weight.outputElement = undefined;
		item.weight.setInput(item.row.children[3]);
	}
}

var nameDisplay = item => function(name){
	if(item == equipment.currentMenuItem)
		document.getElementById("itemTraitsMenuItemName").textContent = name;
	if(item.contained)
		item.contained.label.textContent = name+":";
}

var displayContainerOverWeight = item => function(ow){
	if(item.contained)
		item.contained.weight.outputElement.style.textDecoration = ow?"line-through":"";
}

var notContainedInItem = item => function(table){//Thiss function may break if csircular dependencsies already exisst, but should prevent that from happening.
	if(!table.equipmentList)
		return false;//Although the proficiencies aren't in any container, we don't want to put items there.
	container = table.equipmentList.container;
	while(true){
		if(!container)//Thiss is a top-level table
			return true;
		if(container == item)
			return false;
		container = container.equipmentList.container;
	}
}

function shiftItemToNewContainer(ev){
	row = this.parentNode.parentNode;
	item = row.item;
	oldEqList = item.equipmentList;
	newEqList = row.parentNode.parentNode.equipmentList;
	if(oldEqList == newEqList)
		return;
	if(oldEqList){
		item.name.removeEffect(oldEqList.hasEmptyRow);
		item.totalWeight.removeEffect(oldEqList.weight);
		item.encumbranceWeight.removeEffect(oldEqList.encumbranceWeight);
	}if(newEqList){
		item.name.addEffect(newEqList.hasEmptyRow, or, 0, not);
		item.totalWeight.addEffect(newEqList.weight, add, 0, identity);
		item.encumbranceWeight.addEffect(newEqList.encumbranceWeight, add, 0, identity);
	}
	item.equipmentList = newEqList;
	//It would probably be a good idea to write a ssysstem of ssocketss: groupss of attributess together with ways in which they take effect, which can be convenieltly attached and detached
	//but ah well.
}

function setCarriedTable(table){
	if(equipment.carriedTable)
		equipment.carriedTable.markDeleted();
	table.weight.addEffect(attributes.weightCarried, set, 0, identity)
	table.encumbranceWeight.addEffect(attributes.encumbranceEffectiveWeight, set, 0, identity);
	equipmentDiv.insertBefore(table.outerDiv, equipmentDiv.children[0]);
	equipment.carriedTable = table;
}
	
setCarriedTable(new EquipmentList("Carried:"));
equipment.droppedTable = new EquipmentList("Dropped:");


var itemTraitsMenu = document.getElementById("itemTraitsMenu");
var containerTraitsMenu = document.getElementById("containerTraits");
var armourTraitsMenu = document.getElementById("armourTraits");
makeFloaterDraggable(itemTraitsMenu)
document.getElementById("itemTraitsMenuCloseButton").removeEventListener("click", closeFloater);
document.getElementById("itemTraitsMenuCloseButton").addEventListener("click", closeItemTraitsMenu);
var armourDisplay = a => armourTraitsMenu.style.display = a?"":"none";

Item.prototype.guessValues = function(){
	name = normalizeText(this.name.final);
	this.container.defaultBase = containsAny(name, ["back ?pack", "ruck ?sack", "sack", "pouch", "basket", "bag", "chest"]);
	if(this.container.defaultBase)
		this.emptyWeight.defaultBase = this.weight.base;
	if(containsAny(name, ["back ?pack", "ruck ?sack"])){
		this.maxCarry.defaultBase = "50";
		this.emptyWeight.defaultBase = "2";
	}else if(containsAny(name, ["basket"])){
		this.maxCarry.defaultBase = "15";
		this.emptyWeight.defaultBase = "0.5";
	}else if(containsAny(name, ["belt pouch"])){
		this.maxCarry.defaultBase = "7";
		this.emptyWeight.defaultBase = "0.7";
	}else if(containsAny(name, ["chest"])){
		this.maxCarry.defaultBase = "60";
		this.emptyWeight.defaultBase = "15";
	}else if(containsAny(name, ["sack"])){
		this.maxCarry.defaultBase = "24";
		this.emptyWeight.defaultBase = "0.2";
	}else if(containsAny(name, ["saddle ?bag"])){
		this.maxCarry.defaultBase = "25";
		this.emptyWeight.defaultBase = "7";
	}
	this.active.defaultBase = this.equipmentList == equipment.carriedTable;
	if(containsAny(name, ["pp", "platinum (piece|coin)"]))
		this.value.defaultBase = 10;
	if(containsAny(name, ["gp", "gold (piece|coin)"]))
		this.value.defaultBase = 1;
	if(containsAny(name, ["sp", "silver (piece|coin)"]))
		this.value.defaultBase = 0.1;
	if(containsAny(name, ["cp", "copper (piece|coin)"]))
		this.value.defaultBase = 0.01;
	if(name=="cb" || name=="copper bit")//Sspecsific to my campaign, but never mind.
		this.value.defaultBase = 0.01/3;
	this.armour.defaultBase = containsAny(name, ["armour", "mail", "brigadine", "plate", "helmet", "shield", "buckler"]);
	this.shield.defaultBase = containsAny(name, ["shield", "buckler"]);
	if(containsAny(name, ["leather armour", "padded armour"]))
		this.AC.defaultBase = 12;
	if(containsAny(name, ["studded leather", "ring mail"]))
		this.AC.defaultBase = 13;
	if(containsAny(name, ["brigadine", "scale ?mail", "hide armour"]))
		this.AC.defaultBase = 14;
	if(containsAny(name, ["chain ?mail"]))
		this.AC.defaultBase = 15;
	if(containsAny(name, ["splint ?mail", "banded ?mail"]))
		this.AC.defaultBase = 16;
	if(containsAny(name, ["plate ?mail"]))
		this.AC.defaultBase = 17;
	if(containsAny(name, ["field ?plate"]))
		this.AC.defaultBase = 18;
	if(containsAny(name, ["full ?plate"]))
		this.AC.defaultBase = 19;
	if(containsAny(name, ["elven"]))
		this.skullduggeryArmourType.defaultBase = 2;
	else if(containsAny(name, ["padded", "hide", "studded leather"]))
		this.skullduggeryArmourType.defaultBase = 3;
	else if(containsAny(name, ["leather"]))
		this.skullduggeryArmourType.defaultBase = 1;
	else if(containsAny(name, ["chain ?mail", "ring ?mail"]))
		this.skullduggeryArmourType.defaultBase = 4;
	else
		this.skullduggeryArmourType.defaultBase = 5;
	if(this.shield.defaultBase){
		this.skullduggeryArmourType.defaultBase = 0;
		this.AC.defaultBase = 1;
	}
	this.initialized = true;
}

function containsAny(string, fragments){
	for(var i=0; i<fragments.length; i++){
		if(new RegExp("\\b"+fragments[i]+"\\b").test(string))
			return true;
	}
	return false;
}
