attributes.attackAdjust.addEffect(attributes.moveRateBase, add, 1, identity);
attributes.speedAdjust.addEffect(attributes.moveRateBase, add, 1, identity);
attributes.moveRateBase.addEffect(attributes.moveRateLight, add, 0, times(2/3));
attributes.moveRateBase.addEffect(attributes.moveRateMedium, add, 0, times(1/2));
attributes.moveRateBase.addEffect(attributes.moveRateHeavy, add, 0, times(1/3));
attributes.moveRateBase.addEffect(attributes.moveRateSevere, add, 0, times(0));
attributes.moveRateSevere.defaultBase = 1;

attributes.effectiveStrength.addEffect(attributes.encumbranceBase  , set, 0, [-666,0,2,6,11,11,21,21,36,36,41,41,46,46,56,56,71,86,111,136,161,186,236,336]);
attributes.effectiveStrength.addEffect(attributes.encumbranceLight , set, 0, [-666,0,3,7,14,14,30,30,51,51,59,59,70,70,86,86,101,122,150,175,200,225,275,375]);
attributes.effectiveStrength.addEffect(attributes.encumbranceMedium, set, 0, [-666,0,4,8,17,17,39,39,66,66,77,77,94,94,116,116,131,158,189,214,239,264,314,414]);
attributes.effectiveStrength.addEffect(attributes.encumbranceHeavy , set, 0, [-666,0,5,10,20,20,47,47,81,81,97,97,118,118,146,146,161,194,228,253,278,303,353,453]);
attributes.effectiveStrength.addEffect(attributes.encumbranceSevere, set, 0, [-666,0,6,10,25,25,55,55,90,90,110,110,140,140,170,170,195,220,255,280,305,330,380,480]);

attributes.encumbranceEffectiveWeight.addEffect(attributes.encumbrance, set, 0, w => [true, w]);
attributes.encumbranceBase.addEffect(attributes.encumbrance, (e,l) => e[0]&&e[1]<l?[0,0]:e, 1.0, identity);
attributes.encumbranceLight.addEffect(attributes.encumbrance, (e,l) => e[0]&&e[1]<l?[0,1]:e, 1.1, identity);
attributes.encumbranceMedium.addEffect(attributes.encumbrance, (e,l) => e[0]&&e[1]<l?[0,2]:e, 1.2, identity);
attributes.encumbranceHeavy.addEffect(attributes.encumbrance, (e,l) => e[0]&&e[1]<l?[0,3]:e, 1.3, identity);
attributes.encumbranceSevere.addEffect(attributes.encumbrance, (e,l) => e[0]&&e[1]<l?[0,4]:e, 1.4, identity);
attributes.encumbrance.addModifier(2,  e => e[0]?5:e[1]);

attributes.encumbrance.display = function(e){
	for(var i=0; i<5; i++)
		document.getElementById("encumbrance").rows[i+1].className = i==e?"highlighted":"";
	equipment.carriedTable.weight.outputElement.style.textDecoration = e>4?"line-through":"";
}

attributes.encumbrance.addEffect(attributes.defensiveAdjust, (a,p) => Math.min(a,Math.max(0,a+p)), 1, [0,-1,-Infinity,-Infinity,-Infinity,-Infinity]);
attributes.encumbrance.addEffect(attributes.meleeAdjust, add, 1, [0,0,-1,-2,-4,-666]);
attributes.encumbrance.addEffect(attributes.flatFootAC, add, 2, [0,0,0,-1,-3,-666]);
