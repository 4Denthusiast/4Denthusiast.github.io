attributes["class"].addModifier(0, normalizeText);
attributes.classes = {};
var classList = [];
var groupNames = []; //The names of those class groups which don't yet have a prototypical representative
attributes.multiClassList.defaultBase = [];

function addClassGroup(name){
	attributes.classes[name] = new Attribute(name);
	if(activeClassGroups.length)
		attributes.classes[name].addEffect(activeClassGroups[activeClassGroups.length-1], Math.max, 0, identity);
	groupNames.push(name);
	activeClassGroups.push(attributes.classes[name]);
}

var optionalBox = r => f => f?[r]:[];

function addClass(name){
	var classs = new Attribute(name);
	attributes.classes[name] = classs;
	classList.push(classs);
	attributes["class"].addEffect(classs, Math.max, 0, contains(name));
	classs.addEffect(attributes.multiClassList, concat, 0, optionalBox(classs))
	if(activeClassGroups.length)
		classs.addEffect(activeClassGroups[activeClassGroups.length-1], Math.max, 0, identity);
	while(groupNames.length>0){
		attributes["class"].addEffect(classs, Math.max, 0, contains(groupNames.pop()));
	}
}

var activeClassGroups = [];

addClassGroup("warrior");
	addClass("fighter");
	addClass("ranger");
	addClass("paladin");
	activeClassGroups.pop();
addClassGroup("wizard");
	addClass("mage");
	addClassGroup("specialist");
		addClass("illusionist");
		addClass("abjurer");
		addClass("conjurer");
		addClass("diviner");
		addClass("enchanter");
		addClass("invoker");
		addClass("necromancer");
		addClass("transmuter");
		activeClassGroups.pop();
	activeClassGroups.pop();
addClassGroup("priest");
	addClass("cleric");
	addClass("druid");
	activeClassGroups.pop();
addClassGroup("rogue");
	addClass("thief");
	addClass("bard");
	activeClassGroups.pop();

delete activeClassGroups;

attributes.multiClassList.display = function(){
	var levelTable = document.getElementById("level");
	levelTable.rows[2].cells[1].colSpan = this.final.length;
	for(var i=0; i<3; i++){
		var row = levelTable.rows[[0,1,3][i]];
		while(row.children.length>this.final.length+1)
			row.removeChild(row.children[this.final.length+1]);
		while(row.children.length<this.final.length+1){
			newElement = document.createElement("td");
			newElement.className = i==0?"output":"output number";
			row.appendChild(newElement);
		}
	}
	for(var i=0; i<this.final.length; i++){
		levelTable.rows[0].cells[i+1].textContent = this.final[i].name;
		levelTable.rows[1].cells[i+1].textContent = this.final[i].final;
		levelTable.rows[3].cells[i+1].textContent = this.final[i].nextExperienceLevelFunction(this.final[i].final)*this.final.length;
	}
}

attributes.classes.warrior.addEffect(attributes.exceptionalStrengthAllowed, and, 0, identity);
attributes.classes.warrior.addEffect(attributes.HPAdjust, (h,w) => w?h:Math.min(h,2), 1, identity);

attributes.classes.rogue.addEffect(attributes.skullduggeryUser, or, 0, identity);
attributes.classes.ranger.addEffect(attributes.skullduggeryUser, or, 0, identity);

attributes.skullduggeryUser.display = function(){
	document.getElementById("skullduggery").parentNode.style.display = this.final?"flex":"none";
}

/*attributes.classes.wizard.display = function(){
	document.getElementById("spellBook").style.display = this.final?"flex":"none";
}*/


// Level 00000000000000000000000000000000000000000000000000000000000000000000000000000000000000
attributes.experience.addEffect(attributes.effectiveExperience, set, 0, identity);
attributes.multiClassList.addEffect(attributes.effectiveExperience, div, 1, a => a.length);

(function(){arguments.__proto__.map = Array.prototype.map})();//Yeah, thiss is definitely the right approach.
function getLevelFromExp(){
	var expTable = arguments.map(times(1000));
	return {forward:function(exp){
		if(isNaN(exp))
			return 1;//Otherwise thiss inssisstss everything is level 0 if it previoussly was, sso it stays that way.
		if(exp<expTable[expTable.length-1]){
			var level = 1;
			while(exp>=expTable[level]) level++;//I *could* binary-ssearch thiss, but I can't be bothered.
			return level;
		}else
			return Math.floor((exp-expTable[expTable.length-1])/expTable[0])+expTable.length;
		//Do max-level limit sstuff.
	},reverse:function(level){
		if(isNaN(level))
			return expTable[1];
		if(level < expTable.length)
			return expTable[level];
		return expTable[expTable.length-1] + (level+1-expTable.length)*expTable[0];
	}};
}

//Csircular referencses, what could posssibly go wrong?
function setClassExpTable(classs, expTable){
	attributes.effectiveExperience.addEffect(classs, mult, 1, expTable.forward);
	classs.nextExperienceLevelFunction = expTable.reverse;
}
setClassExpTable(attributes.classes.fighter, getLevelFromExp(250,2,4,8,16,32,64,125,250));
rangerLevels = getLevelFromExp(300,2.25,4.5,9,18,36,75,150,300,600,900);
setClassExpTable(attributes.classes.ranger, rangerLevels);
setClassExpTable(attributes.classes.paladin, rangerLevels);

wizardLevels = getLevelFromExp(375,2.5,5,10,20,40,60,90,135,250,375);
wizards = [attributes.classes.mage, attributes.classes.abjurer, attributes.classes.conjurer, attributes.classes.diviner, attributes.classes.enchanter, attributes.classes.illusionist, attributes.classes.invoker, attributes.classes.necromancer, attributes.classes.transmuter];
for(var i=0; i<wizards.length; i++)
	setClassExpTable(wizards[i], wizardLevels);

setClassExpTable(attributes.classes.cleric, getLevelFromExp(225,1.5,3,6,13,27.5,55,110,225));
setClassExpTable(attributes.classes.druid, getLevelFromExp(500,2,4,7.5,12.5,20,35,60,90,125,200,300,750,1500,3000));//I'm not even going to try to capture all the intricacies of heirophantics.

rogueLevels = getLevelFromExp(220,1.25,2.5,5,10,20,40,70,110,160,220,440,660,880,1100);
setClassExpTable(attributes.classes.thief, rogueLevels);
setClassExpTable(attributes.classes.bard, rogueLevels);
