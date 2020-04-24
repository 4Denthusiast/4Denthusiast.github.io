attributes.flatFootAC.addEffect(attributes.AC, add, 0, identity);

attributes.classes.priest.addEffect(attributes.toHitAdjust, Math.max, 0, l => Math.floor((l-1)/3)*2);
attributes.classes.priest.addEffect(attributes.unproficientAttackPenalty, Math.min, 0, l => l?3:Infinity);
attributes.classes.rogue.addEffect(attributes.toHitAdjust, Math.max, 0, l => Math.floor((l-1)/2));
attributes.classes.rogue.addEffect(attributes.unproficientAttackPenalty, Math.min, 0, l => l?3:Infinity);
attributes.classes.warrior.addEffect(attributes.toHitAdjust, Math.max, 0, l => l-1);
attributes.classes.warrior.addEffect(attributes.unproficientAttackPenalty, Math.min, 0, l => l?2:Infinity);
attributes.classes.wizard.addEffect(attributes.toHitAdjust, Math.max, 0, l => Math.floor((l-1)/3));
attributes.classes.wizard.addEffect(attributes.unproficientAttackPenalty, Math.min, 0, l => l?5:Infinity);

attributes.toHitAdjust.addEffect(attributes.meleeAdjust, add, 0, identity);
attributes.toHitAdjust.addEffect(attributes.missileAdjust, add, 0, identity);
attributes.missileAttackAdjust.addEffect(attributes.missileAdjust, add, 0, identity);
attributes.attackAdjust.addEffect(attributes.meleeAdjust, add, 0, identity);
attributes.meleeAdjust.addEffect(attributes.unproficientMeleeAdjust, add, 0, identity);
attributes.missileAdjust.addEffect(attributes.unproficientMissileAdjust, add, 0, identity);
attributes.unproficientAttackPenalty.defaultBase = Infinity;
attributes.unproficientAttackPenalty.addEffect(attributes.unproficientMeleeAdjust, add, 0, times(-1));
attributes.unproficientAttackPenalty.addEffect(attributes.unproficientMissileAdjust, add, 0, times(-1));

attributes.savingThrowDeath.defaultBase = 20;
attributes.savingThrowWand.defaultBase = 20;
attributes.savingThrowPetrification.defaultBase = 20;
attributes.savingThrowBreathWeapon.defaultBase = 20;
attributes.savingThrowSpell.defaultBase = 20;
attributes.savingThrowDeath.addEffect(attributes.savingThrowPoison, add, 0, identity);
attributes.classes.priest.addEffect(attributes.savingThrowDeath, Math.min, 0, [20,10,10,10,9,9,9,7,7,7,6,6,6,5,5,5,4,4,4,2]);
attributes.classes.priest.addEffect(attributes.savingThrowWand, Math.min, 0, [20,14,14,14,13,13,13,11,11,11,10,10,10,9,9,9,8,8,8,6]);
attributes.classes.priest.addEffect(attributes.savingThrowPetrification, Math.min, 0, [20,13,13,13,12,12,12,10,10,10,9,9,9,8,8,8,7,7,7,5,5,5]);
attributes.classes.priest.addEffect(attributes.savingThrowBreathWeapon, Math.min, 0, [20,16,16,16,15,15,15,13,13,13,12,12,12,11,11,11,10,10,10,8]);
attributes.classes.priest.addEffect(attributes.savingThrowSpell, Math.min, 0, [20,15,15,15,14,14,14,12,12,12,11,11,11,10,10,10,9,9,9,7,7,7]);

attributes.classes.rogue.addEffect(attributes.savingThrowDeath, Math.min, 0, [20,13,13,13,13,12,12,12,12,11,11,11,11,10,10,10,10,9,9,9,9,8]);
attributes.classes.rogue.addEffect(attributes.savingThrowWand, Math.min, 0, [20,14,14,14,14,12,12,12,12,10,10,10,10,8,8,8,8,6,6,6,6,4]);
attributes.classes.rogue.addEffect(attributes.savingThrowPetrification, Math.min, 0, [20,12,12,12,12,11,11,11,11,10,10,10,10,9,9,9,9,8,8,8,8,7]);
attributes.classes.rogue.addEffect(attributes.savingThrowBreathWeapon, Math.min, 0, [20,16,16,16,16,15,15,15,15,14,14,14,14,13,13,13,13,12,12,12,12,11]);
attributes.classes.rogue.addEffect(attributes.savingThrowSpell, Math.min, 0, [20,15,15,15,15,13,13,13,13,11,11,11,11,9,9,9,9,7,7,7,7,5]);

attributes.classes.warrior.addEffect(attributes.savingThrowDeath, Math.min, 0, [16,14,14,13,13,11,11,10,10,8,8,7,7,5,5,4,4,3]);
attributes.classes.warrior.addEffect(attributes.savingThrowWand, Math.min, 0, [18,16,16,15,15,13,13,12,12,10,10,9,9,7,7,6,6,5]);
attributes.classes.warrior.addEffect(attributes.savingThrowPetrification, Math.min, 0, [17,15,15,14,14,12,12,11,11,9,9,8,8,6,6,5,5,4]);
attributes.classes.warrior.addEffect(attributes.savingThrowBreathWeapon, Math.min, 0, [20,17,17,16,16,13,13,12,12,9,9,8,8,5,5,4]);
attributes.classes.warrior.addEffect(attributes.savingThrowSpell, Math.min, 0, [19,17,17,16,16,14,14,13,13,11,11,10,10,8,8,7,7,6]);

attributes.classes.wizard.addEffect(attributes.savingThrowDeath, Math.min, 0, [20,14,14,14,14,14,13,13,13,13,13,11,11,11,11,11,10,10,10,10,10,8]);
attributes.classes.wizard.addEffect(attributes.savingThrowWand, Math.min, 0, [20,11,11,11,11,11,9,9,9,9,9,7,7,7,7,7,5,5,5,5,5,3]);
attributes.classes.wizard.addEffect(attributes.savingThrowPetrification, Math.min, 0, [20,13,13,13,13,13,11,11,11,11,11,9,9,9,9,9,7,7,7,7,7,5]);
attributes.classes.wizard.addEffect(attributes.savingThrowBreathWeapon, Math.min, 0, [20,15,15,15,15,15,13,13,13,13,13,11,11,11,11,11,9,9,9,9,9,7]);
attributes.classes.wizard.addEffect(attributes.savingThrowSpell, Math.min, 0, [20,12,12,12,12,12,10,10,10,10,10,8,8,8,8,8,6,6,6,6,6,4]);
