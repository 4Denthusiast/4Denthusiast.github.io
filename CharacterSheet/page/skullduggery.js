var nanMax = (a,b) => isNaN(a)?b:isNaN(b)?a:Math.max(a,b);
var nannify = a => b => b?a:NaN;

attributes.skullduggeryPointsLeft.defaultBase = NaN;
attributes.classes.thief.addEffect(attributes.skullduggeryPointsLeft, nanMax, 0, l => nannify(30+30*l)(l));
attributes.classes.bard.addEffect(attributes.skullduggeryPointsLeft, nanMax, 0, l => nannify(5+15*l)(l));

function addSkullduggery(name, thiefInitial){
	skill = new Attribute(name);
	skill.defaultBase = NaN;
	attributes.classes.thief.addEffect(skill, nanMax, 0, nannify(thiefInitial));
	attributes.skullduggery[name] = skill;
	pointsSpent = new Attribute(name+"PointsSpent");
	pointsSpent.addEffect(skill, add, 1, identity);
	pointsSpent.addEffect(attributes.skullduggeryPointsLeft, add, 1, times(-1));
	attributes.skullduggery[name+"PointsSpent"] = pointsSpent;
}
addSkullduggery("pickPockets", 15);
attributes.classes.bard.addEffect(attributes.skullduggery.pickPockets, nanMax, 0, nannify(10));
addSkullduggery("openLocks", 10);
addSkullduggery("findRemoveTraps", 5);
addSkullduggery("moveSilently", 10);
attributes.classes.ranger.addEffect(attributes.skullduggery.moveSilently, nanMax, 0, [NaN,15,21,27,33,40,47,55,62,70,78,86,94,99]);
addSkullduggery("hideInShadows", 5);
attributes.classes.ranger.addEffect(attributes.skullduggery.hideInShadows, nanMax, 0, [NaN,10,15,20,25,31,37,43,49,56,63,70,77,85,93,99]);
addSkullduggery("detectNoise", 15);
attributes.classes.bard.addEffect(attributes.skullduggery.detectNoise, nanMax, 0, nannify(20));
addSkullduggery("climbWalls", 60);
attributes.classes.bard.addEffect(attributes.skullduggery.climbWalls, nanMax, 0, nannify(50));
addSkullduggery("readLanguages", 0);
attributes.classes.bard.addEffect(attributes.skullduggery.readLanguages, nanMax, 0, nannify(5));

attributes.races.dwarf.addEffect(attributes.skullduggery.openLocks, add, 1, times(10));
attributes.races.dwarf.addEffect(attributes.skullduggery.findRemoveTraps, add, 1, times(15));
attributes.races.dwarf.addEffect(attributes.skullduggery.climbWalls, add, 1, times(-10));
attributes.races.dwarf.addEffect(attributes.skullduggery.readLanguages, add, 1, times(-5));
attributes.races.elf.addEffect(attributes.skullduggery.pickPockets, add, 1, times(5));
attributes.races.elf.addEffect(attributes.skullduggery.openLocks, add, 1, times(-5));
attributes.races.elf.addEffect(attributes.skullduggery.moveSilently, add, 1, times(5));
attributes.races.elf.addEffect(attributes.skullduggery.hideInShadows, add, 1, times(10));
attributes.races.elf.addEffect(attributes.skullduggery.detectNoise, add, 1, times(5));
attributes.races.gnome.addEffect(attributes.skullduggery.openLocks, add, 1, times(5));
attributes.races.gnome.addEffect(attributes.skullduggery.findRemoveTraps, add, 1, times(10));
attributes.races.gnome.addEffect(attributes.skullduggery.moveSilently, add, 1, times(5));
attributes.races.gnome.addEffect(attributes.skullduggery.hideInShadows, add, 1, times(5));
attributes.races.gnome.addEffect(attributes.skullduggery.detectNoise, add, 1, times(10));
attributes.races.gnome.addEffect(attributes.skullduggery.climbWalls, add, 1, times(-15));
attributes.races.halfElf.addEffect(attributes.skullduggery.pickPockets, add, 1, times(10));
attributes.races.halfElf.addEffect(attributes.skullduggery.detectNoise, add, 1, times(5));
attributes.races.halfling.addEffect(attributes.skullduggery.pickPockets, add, 1, times(5));
attributes.races.halfling.addEffect(attributes.skullduggery.openLocks, add, 1, times(5));
attributes.races.halfling.addEffect(attributes.skullduggery.findRemoveTraps, add, 1, times(5));
attributes.races.halfling.addEffect(attributes.skullduggery.moveSilently, add, 1, times(10));
attributes.races.halfling.addEffect(attributes.skullduggery.hideInShadows, add, 1, times(15));
attributes.races.halfling.addEffect(attributes.skullduggery.detectNoise, add, 1, times(5));
attributes.races.halfling.addEffect(attributes.skullduggery.climbWalls, add, 1, times(-15));
attributes.races.halfling.addEffect(attributes.skullduggery.readLanguages, add, 1, times(-5));
attributes.races.satyr.addEffect(attributes.skullduggery.openLocks, add, 1, times(-5));
attributes.races.satyr.addEffect(attributes.skullduggery.findRemoveTraps, add, 1, times(10));
attributes.races.satyr.addEffect(attributes.skullduggery.moveSilently, add, 1, times(-5));
attributes.races.satyr.addEffect(attributes.skullduggery.hideInShadows, add, 1, times(10));
attributes.races.satyr.addEffect(attributes.skullduggery.climbWalls, add, 1, times(-20));

attributes.dexterity.addEffect(attributes.skullduggery.pickPockets, add, 1, [-666,-666,-666,-666,-666,-666,-666,-666,-666,-15,-10,-5,0,0,0,0,0,5,10,15]);
attributes.dexterity.addEffect(attributes.skullduggery.openLocks, add, 1, [-666,-666,-666,-666,-666,-666,-666,-666,-666,-10,-5,0,0,0,0,0,5,10,15,20]);
attributes.dexterity.addEffect(attributes.skullduggery.findRemoveTraps, add, 1, [-666,-666,-666,-666,-666,-666,-666,-666,-666,-10,-10,-5,0,0,0,0,0,0,5,10]);
attributes.dexterity.addEffect(attributes.skullduggery.moveSilently, add, 1, [-666,-666,-666,-666,-666,-666,-666,-666,-666,-20,-15,-10,-5,0,0,0,0,5,10,15]);
attributes.dexterity.addEffect(attributes.skullduggery.hideInShadows, add, 1, [-666,-666,-666,-666,-666,-666,-666,-666,-666,-10,-5,0,0,0,0,0,0,5,10,15]);

attributes.skullduggeryArmourType.addEffect(attributes.skullduggery.pickPockets, add, 1, [5,0,-20,-30,-25,NaN]);
attributes.skullduggeryArmourType.addEffect(attributes.skullduggery.openLocks, add, 1, [0,0,-5,-10,-10,NaN]);
attributes.skullduggeryArmourType.addEffect(attributes.skullduggery.findRemoveTraps, add, 1, [0,0,-5,-10,-10,NaN]);
attributes.skullduggeryArmourType.addEffect(attributes.skullduggery.moveSilently, add, 1, [10,0,-10,-20,-15,NaN]);
attributes.skullduggeryArmourType.addEffect(attributes.skullduggery.hideInShadows, add, 1, [5,0,-10,-20,-15,NaN]);
attributes.skullduggeryArmourType.addEffect(attributes.skullduggery.detectNoise, add, 1, [0,0,-5,-10,-5,NaN]);
attributes.skullduggeryArmourType.addEffect(attributes.skullduggery.climbWalls, add, 1, [10,0,-20,-30,-25,NaN]);
