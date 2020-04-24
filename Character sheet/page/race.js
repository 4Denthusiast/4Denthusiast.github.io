attributes.race.addModifier(0, normalizeText);
attributes.races = {};
attributes.races.human = new Attribute("human");//Thiss will probably have hardly any effects.
attributes.races.elf = new Attribute("elf");
attributes.races.dwarf = new Attribute("dwarf");
attributes.races.gnome = new Attribute("gnome");
attributes.races.halfElf = new Attribute("halfElf");
attributes.races.halfling = new Attribute("halfling");
attributes.races.satyr = new Attribute("satyr");
attributes.race.addEffect(attributes.races.human, set, 0, eq("human"));
attributes.race.addEffect(attributes.races.elf, set, 0, eq("elf"));
attributes.race.addEffect(attributes.races.dwarf, set, 0, eq("dwarf"));
attributes.race.addEffect(attributes.races.gnome, set, 0, eq("gnome"));
attributes.race.addEffect(attributes.races.halfElf, set, 0, eq("half elf"));
attributes.race.addEffect(attributes.races.halfling, set, 0, eq("halfling"));
attributes.race.addEffect(attributes.races.satyr, set, 0, eq("satyr"));

attributes.races.halfling.addEffect(attributes.exceptionalStrengthAllowed, and, 0, not);
attributes.races.dwarf.addEffect(attributes.constitution, add, 0, identity);
attributes.races.dwarf.addEffect(attributes.charisma, add, 0, times(-1));
attributes.races.elf.addEffect(attributes.dexterity, add, 0, identity);
attributes.races.elf.addEffect(attributes.constitution, add, 0, times(-1));
attributes.races.gnome.addEffect(attributes.intelligence, add, 0, identity);
attributes.races.gnome.addEffect(attributes.wildom, add, 0, times(-1));
attributes.races.halfling.addEffect(attributes.dexterity, add, 0, identity);
attributes.races.halfling.addEffect(attributes.strength, add, 0, times(-1));
attributes.races.satyr.addEffect(attributes.dexterity, add, 0, identity);
attributes.races.satyr.addEffect(attributes.constitution, add, 0, identity);
attributes.races.satyr.addEffect(attributes.intelligence, add, 0, times(-1));
attributes.races.satyr.addEffect(attributes.charisma, add, 0, times(-1));

attributes.races.dwarf.addEffect(attributes.racialMagicSaveBonus, add, 0, identity);
attributes.races.gnome.addEffect(attributes.racialMagicSaveBonus, add, 0, identity);
attributes.races.halfling.addEffect(attributes.racialMagicSaveBonus, add, 0, identity);
attributes.constitution.addEffect(attributes.racialMagicSaveBonus, and, 1, con => Math.floor(con/3.5));
attributes.racialMagicSaveBonus.addEffect(attributes.savingThrowWand, add, 0, times(-1));
attributes.racialMagicSaveBonus.addEffect(attributes.savingThrowSpell, add, 0, times(-1));
attributes.races.dwarf.addEffect(attributes.conPoisonSaveModifier, (s,d) => d?attributes.racialMagicSaveBonus.final:s, 1, identity);
attributes.races.halfling.addEffect(attributes.conPoisonSaveModifier, (s,h) => h?attributes.racialMagicSaveBonus.final:s, 1, identity);
attributes.racialMagicSaveBonus.addEffect(attributes.conPoisonSaveModifier, identity, 0, nil);

attributes.races.dwarf.addEffect(attributes.baseMaxAge, add, 0, times(250));
attributes.races.elf.addEffect(attributes.baseMaxAge, add, 0, times(350));
attributes.races.gnome.addEffect(attributes.baseMaxAge, add, 0, times(200));
attributes.races.halfElf.addEffect(attributes.baseMaxAge, add, 0, times(125));
attributes.races.halfling.addEffect(attributes.baseMaxAge, add, 0, times(100));
attributes.races.human.addEffect(attributes.baseMaxAge, add, 0, times(90));
attributes.races.satyr.addEffect(attributes.baseMaxAge, add, 0, times(130));

attributes.races.dwarf.addEffect(attributes.flatFootAC, add, 0, times(10));
attributes.races.elf.addEffect(attributes.flatFootAC, add, 0, times(10));
attributes.races.gnome.addEffect(attributes.flatFootAC, add, 0, times(10));
attributes.races.halfElf.addEffect(attributes.flatFootAC, add, 0, times(10));
attributes.races.halfling.addEffect(attributes.flatFootAC, add, 0, times(10));
attributes.races.human.addEffect(attributes.flatFootAC, add, 0, times(10));
attributes.races.satyr.addEffect(attributes.flatFootAC, add, 0, times(15));

attributes.races.dwarf.addEffect(attributes.moveRateBase, add, 0, times(6));
attributes.races.elf.addEffect(attributes.moveRateBase, add, 0, times(12));
attributes.races.gnome.addEffect(attributes.moveRateBase, add, 0, times(6));
attributes.races.halfElf.addEffect(attributes.moveRateBase, add, 0, times(12));
attributes.races.halfling.addEffect(attributes.moveRateBase, add, 0, times(6));
attributes.races.human.addEffect(attributes.moveRateBase, add, 0, times(12));
attributes.races.satyr.addEffect(attributes.moveRateBase, add, 0, times(18));

attributes.age.addEffect(attributes.middleAge, set, 0, identity);
attributes.age.addEffect(attributes.oldAge, set, 0, identity);
attributes.age.addEffect(attributes.venerableAge, set, 0, identity);
attributes.baseMaxAge.addEffect(attributes.middleAge, geq, 1, times(1/2));
attributes.baseMaxAge.addEffect(attributes.oldAge, geq, 1, times(2/3));
attributes.baseMaxAge.addEffect(attributes.venerableAge, geq, 1, identity);

attributes.middleAge.addEffect(attributes.strength, add, 0, times(-1));
attributes.middleAge.addEffect(attributes.constitution, add, 0, times(-1));
attributes.middleAge.addEffect(attributes.intelligence, add, 0, identity);
attributes.middleAge.addEffect(attributes.wildom, add, 0, identity);
attributes.oldAge.addEffect(attributes.strength, add, 0, times(-2));
attributes.oldAge.addEffect(attributes.constitution, add, 0, times(-1));
attributes.oldAge.addEffect(attributes.dexterity, add, 0, times(-2));
attributes.oldAge.addEffect(attributes.wildom, add, 0, identity);
attributes.venerableAge.addEffect(attributes.strength, add, 0, times(-1));
attributes.venerableAge.addEffect(attributes.constitution, add, 0, times(-1));
attributes.venerableAge.addEffect(attributes.dexterity, add, 0, times(-1));
attributes.venerableAge.addEffect(attributes.intelligence, add, 0, identity);
attributes.venerableAge.addEffect(attributes.wildom, add, 0, identity);
