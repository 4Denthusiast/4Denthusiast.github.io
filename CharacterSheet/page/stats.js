attributes.strengthAdjust.addEffect(attributes.strength, add, 0, identity);
attributes.strength.addEffect(attributes.effectiveStrength, add, 0, str => str<=18?str:str+5);
attributes.exceptionalStrengthAllowed.defaultBase = true;
attributes.strength.addEffect(attributes.exceptionalStrengthAllowed, and, 0, s => s==18);
attributes.exceptionalStrengthAllowed.addEffect(attributes.exceptionalStrength, seAnd, 0, identity);
attributes.exceptionalStrength.addEffect(attributes.effectiveStrength, add, 0, s => s<=0?0:s<=50?1:s<=75?2:s<=90?3:s<=99?4:5);
attributes.effectiveStrength.addEffect(attributes.attackAdjust, set, 0, [-666,-5,-3,-3,-2,-2,-1,-1,0,0,0,0,0,0,0,0,0,1,1,1,2,2,2,3,3,3,4,4,5,6,7]);
attributes.effectiveStrength.addEffect(attributes.damageAdjust, set, 0, [-666,-4,-2,-1,-1,-1,0,0,0,0,0,0,0,0,0,0,1,1,2,3,3,4,5,6,7,8,9,10,11,12,14]);
attributes.effectiveStrength.addEffect(attributes.weightAllow, set, 0, [-666,1,1,5,10,10,20,20,35,35,40,40,45,45,55,55,70,85,110,135,160,185,235,335,485,535,635,785,935,1235,1535]);
attributes.effectiveStrength.addEffect(attributes.maxPress, set, 0, [-666,3,5,10,25,25,55,55,90,90,115,115,140,140,170,170,195,220,255,280,305,330,380,480,640,700,810,970,1130,1440,1750]);
attributes.effectiveStrength.addEffect(attributes.openStuckDoors, set, 0, [-666,1,1,2,3,3,4,4,5,5,6,6,7,7,8,8,9,10,11,12,13,14,15,16,16,17,17,18,18,19,19]);
attributes.effectiveStrength.addEffect(attributes.openLockedDoors, set, 0, [-666,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,6,8,10,12,14,16,17,18]);
attributes.openDoors.defaultBase = "";
attributes.openStuckDoors.addEffect(attributes.openDoors, add, 0, identity);
attributes.openLockedDoors.addEffect(attributes.openDoors, add, 1, n => n?"("+n+")":"");
attributes.effectiveStrength.addEffect(attributes.bendBars, set, 0, [-666,0,0,0,0,0,0,0,1,1,2,2,4,4,7,7,10,13,16,20,25,30,35,40,50,60,70,80,90,95,99]);

attributes.dexterityAdjust.addEffect(attributes.dexterity, add, 0, identity);
attributes.dexterity.addEffect(attributes.speedAdjust, set, 0, [-666,-6,-4,-3,-2,-1,0,0,0,0,0,0,0,0,0,0,1,2,2,3,3,4,4,4,5,5]);
attributes.dexterity.addEffect(attributes.missileAttackAdjust, set, 0, [-666,-6,-4,-3,-2,-1,0,0,0,0,0,0,0,0,0,0,1,2,2,3,3,4,4,4,5,5]);
attributes.dexterity.addEffect(attributes.defensiveAdjust, set, 0, [-666,-5,-5,-4,-3,-2,-1,0,0,0,0,0,0,0,0,1,2,3,4,4,4,5,5,5,6,6]);
attributes.defensiveAdjust.addEffect(attributes.AC, add, 2, identity);

attributes.constitutionAdjust.addEffect(attributes.constitution, add, 0, identity);
attributes.constitution.addEffect(attributes.HPAdjust, set, 0, [-666,-3,-2,-2,-1,-1,-1,0,0,0,0,0,0,0,0,1,2,3,4,5,5,6,6,6,7,7]);
attributes.constitution.addEffect(attributes.systemShock, set, 0, [-666,25,30,35,40,45,50,55,60,65,70,75,80,85,88,90,95,97,99,99,99,99,99,99,99,100]);
attributes.constitution.addEffect(attributes.ressurectionChance, set, 0, [-666,30,35,40,45,50,55,60,65,70,75,80,85,90,92,94,96,98,100,100,100,100,100,100,100,100]);
attributes.constitution.addEffect(attributes.conPoisonSaveModifier, set, 0, [-666,-2,-1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1]);
attributes.constitution.addEffect(attributes.regeneration, set, 0, [-666,"—","—","—","—","—","—","—","—","—","—","—","—","—","—","—","—","—","—","—","1 per 6 turns","1 per 5 turns","1 per 4 turns","1 per 3 turns","1 per 2 turns","1 per turn"]);
attributes.conPoisonSaveModifier.addEffect(attributes.savingThrowPoison, add, 1, times(-1));

attributes.intelligenceAdjust.addEffect(attributes.intelligence, add, 0, identity);
attributes.intelligence.addEffect(attributes.languages, set, 0, [-666,0,1,1,1,1,1,1,1,2,2,2,3,3,4,4,5,6,7,8,9,10,11,12,15,20]);
attributes.intelligence.addEffect(attributes.maxSpellLevel, set, 0, [-666,0,0,0,0,0,0,0,0,4,5,5,6,6,7,7,8,8,9,9,9,9,9,9,9,9]);
attributes.intelligence.addEffect(attributes.chanceToLearn, set, 0, [-666,0,0,0,0,0,0,0,0,35,40,45,50,55,60,65,70,75,85,95,96,97,98,99,100,100]);
attributes.intelligence.addEffect(attributes.maxSpellsPerLevel, set, 0, [-666,0,0,0,0,0,0,0,0,6,7,7,7,9,9,11,11,14,18,"All","All","All","All","All","All","All"]);

attributes.wildomAdjust.addEffect(attributes.wildom, add, 0, identity);
attributes.wildom.addEffect(attributes.mentalDefenceAdjust, set, 0, [-666,-6,-4,-3,-2,-1,-1,-1,0,0,0,0,0,0,0,1,2,3,4,4,4,4,4,4,4,4]);
attributes.wildom.addEffect(attributes.bonusSpellsReadable, set, 0, [-666,"—","—","—","—","—","—","—","—","—","—","—","—","1*1st","2*1st","2*1st, 1*2nd","2*1st, 2*2nd","2*1st, 2*2nd, 1*3rd","2*1st, 2*2nd, 1*3rd, 1*4th","3*1st, 2*2nd, 2*3rd, 1*4th","3*1st, 3*2nd, 2*3rd, 2*4th","3*1st, 3*2nd, 3*3rd, 2*4th, 1*5th","3*1st, 3*2nd, 3*3rd, 3*4th, 2*5th","4*1st, 3*2nd, 3*3rd, 3*4th, 2*5th, 1*6th","4*1st, 3*2nd, 3*3rd, 3*4th, 3*5th, 2*6th","4*1st, 3*2nd, 3*3rd, 3*4th, 3*5th, 3*6th, 1*7th"]);
attributes.wildom.addEffect(attributes.spellFailure, set, 0, [-666,80,60,50,45,40,35,30,25,20,15,10,5,0,0,0,0,0,0,0,0,0,0,0,0,0]);
attributes.wildom.addEffect(attributes.spellImmunity, set, 0, [-666,"—","—","—","—","—","—","—","—","—","—","—","—","—","—","—","—","—","—","cause fear, charm person, command, friends, hypnotism","cause fear, charm person, command, friends, hypnotism, forget, hold person, ray of enfeeblement, scare","cause fear, charm person, command, friends, hypnotism, forget, hold person, ray of enfeeblement, scare, fear","cause fear, charm person, command, friends, hypnotism, forget, hold person, ray of enfeeblement, scare, fear, charm monster, confusion, emotion, fumble, suggestion","cause fear, charm person, command, friends, hypnotism, forget, hold person, ray of enfeeblement, scare, fear, charm monster, confusion, emotion, fumble, suggestion, chaos, feeblemind, hold monster, magic jar, quest","cause fear, charm person, command, friends, hypnotism, forget, hold person, ray of enfeeblement, scare, fear, charm monster, confusion, emotion, fumble, suggestion, chaos, feeblemind, hold monster, magic jar, quest, geas, mass suggestion, rod of rulership","cause fear, charm person, command, friends, hypnotism, forget, hold person, ray of enfeeblement, scare, fear, charm monster, confusion, emotion, fumble, suggestion, chaos, feeblemind, hold monster, magic jar, quest, geas, mass suggestion, rod of rulership, antipathy/sympathy, death spell, mass charm"]);

attributes.charismaAdjust.addEffect(attributes.charisma, add, 0, identity);
attributes.charisma.addEffect(attributes.henchbeetles, set, 0, [-666,0,1,1,1,2,2,3,3,4,4,4,5,5,6,7,8,10,15,20,25,30,35,40,45,50]);
attributes.charisma.addEffect(attributes.loyaltyBase, set, 0, [-666,-8,-7,-6,-5,-4,-3,-2,-1,0,0,0,0,0,1,3,4,6,8,10,12,14,16,18,20,20]);
attributes.charisma.addEffect(attributes.reactionAdjust, set, 0, [-666,-7,-6,-5,-4,-3,-2,-1,0,0,0,0,0,1,2,3,5,6,7,8,9,10,11,12,13,14]);

attributes.perceptionAdjust.addEffect(attributes.perception, add, 0, identity);
attributes.perception.addEffect(attributes.surpriseAdjust, set, 0, [-666,-6,-4,-3,-2,-1,0,0,0,0,0,0,0,0,0,0,1,2,2,3,3,4,4,4,5,5]);
attributes.perception.addEffect(attributes.illusionImmunity, set, 0, [-666,"—","—","—","—","—","—","—","—","—","—","—","—","—","—","—","—","—","—","1nd-level","2nd-level","3th-level","4th-level","5th-level","6th-level","7th-level"]);
attributes.perception.addEffect(attributes.hearingAdjust, set, 0, [-666,-50,-45,-40,-35,-30,-25,-20,-15,-10,-5,0,0,0,0,0,5,10,15,20,25,30,35,40,45,50]);

var basicStatsAttributes = [attributes.strength, attributes.dexterity, attributes.constitution, attributes.intelligence, attributes.wildom, attributes.charisma, attributes.perception];
function rollStats(){
	for(var i=0; i<basicStatsAttributes.length; i++)
		setContent(basicStatsAttributes[i].inputElement, d(4,6,1));
}
