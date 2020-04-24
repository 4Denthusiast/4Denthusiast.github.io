#! /usr/bin/python

inFile = open("./raw priests.txt", "r")
outFile = open("./baked priests.js", "w")
outFile.write("var s = [];\n");

level = 0
prevLine = "";
prevPrevLine = "";
for nextLine in inFile:
	if nextLine.startswith("(") and nextLine.endswith(")\n"):
		if prevPrevLine.strip().endswith("-Level Spells"):
			level += 1
		name = prevLine.strip().lower()
		reversibleLine = inFile.next().strip()
		reversible = reversibleLine=="Reversible"
		if reversible:
			sphere = inFile.next().strip()[8:]
		else:
			sphere = reversibleLine[8:]
		range_ = inFile.next().strip()[7:]
		duration = inFile.next().strip()[10:]
		aoe = inFile.next().strip()[16:]
		components = inFile.next().strip()[12:]
		castingTime = inFile.next().strip()[14:]
		savingThrow = inFile.next().strip()[14:]
		outFile.write('s["'+name+'"]=['+str(level)+',"'+range_+'","'+duration+'","'+castingTime+'","'+aoe+'","'+savingThrow+'","'+components+'"];\n');
	prevPrevLine, prevLine = prevLine, nextLine

outFile.write("var priestSpells = s;\ndelete(s)")
inFile.close()
outFile.close()

inFile = open("./raw wizards.txt", "r")
outFile = open("./baked wizards.js", "w")
outFile.write("var s = [];\n");

level = 0
prevLine = "";
prevPrevLine = "";
for nextLine in inFile:
	if nextLine.startswith("(") and nextLine.endswith(")\n"):
		if prevPrevLine.strip().endswith("-Level Spells"):
			level += 1
		name = prevLine.strip().lower()
		reversibleLine = inFile.next().strip()
		reversible = reversibleLine=="Reversible"
		if reversible:
			range_ = inFile.next().strip()[7:]
		else:
			range_ = reversibleLine[7:]
		duration = inFile.next().strip()[10:]
		aoe = inFile.next().strip()[16:]
		components = inFile.next().strip()[12:]
		castingTime = inFile.next().strip()[14:]
		savingThrow = inFile.next().strip()[14:]
		outFile.write('s["'+name+'"]=['+str(level)+',"'+range_+'","'+duration+'","'+castingTime+'","'+aoe+'","'+savingThrow+'","'+components+'"];\n');
	prevPrevLine, prevLine = prevLine, nextLine

outFile.write("var wizardSpells = s;\ndelete(s)")
inFile.close()
outFile.close()
