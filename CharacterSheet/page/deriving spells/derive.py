#! /usr/bin/python

def derive(className):
	inFile = open("./raw "+className+"s.txt", "r")
	outFile = open("./baked "+className+"s.js", "w")
	outFile.write("var s = [];\n");
	
	level = 0
	prevLine = "";
	prevPrevLine = "";
	for nextLine in inFile:
		if nextLine.startswith("(") and nextLine.endswith(")\n"):
			if prevPrevLine.strip().endswith("-Level Spells"):
				level += 1
			name = prevLine.strip().lower()
			reversible, sphere, range_, duration, aoe, components, castingTime, savingThrow = False, "", "", "", "", "", "", ""
			while True:
				nextLine = inFile.next().strip()
				lineName, _, value = nextLine.partition(": ")
				if lineName == "Reversible":
					reversible = True
				elif lineName == "Sphere":
					sphere = value
				elif lineName == "Range":
					range_ = value
				elif lineName == "Duration":
					duration = value
				elif lineName == "Area of Effect":
					aoe = value
				elif lineName == "Components":
					components = value
				elif lineName == "Casting Time":
					castingTime = value
				elif lineName == "Saving Throw":
					savingThrow = value
				else:
					break
			for n in name.split("/"):
				outFile.write('s["'+n+'"]=['+str(level)+',"'+range_+'","'+duration+'","'+castingTime+'","'+aoe+'","'+savingThrow+'","'+components+'",'+("1" if reversible else "0")+'];\n');
		prevPrevLine, prevLine = prevLine, nextLine

	outFile.write("var "+className+"Spells = s;\ndelete(s)")
	inFile.close()
	outFile.close()

derive("priest")
derive("wizard")
