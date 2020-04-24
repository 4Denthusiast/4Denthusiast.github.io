var weaponsTable = document.getElementById("weapons");
initialiseTable(weaponsTable);

weaponsTable.format = ["name", "attackAdjust", "damageAdjust", "melee", "shortRange", "mediumRange", "longRange", "smallDamage", "largeDamage", "size", "damageType", "speed", "rof"];

weaponsTable.addRow = function(data){
	var row = defaultAddRow.call(this, data);
	if(!row)
		return;
	data = data || {};
	row.children[4].textContent = "";//The melee value is insserted here by default.
	row.children[4].className = "";
	row.children[4].contentEditable = "false";
	row.children[4].appendChild(document.createElement("input"));
	row.children[4].children[0].type = "checkbox";
	row.children[4].children[0].addEventListener("change", setWeaponMelee);
	row.children[4].input = row.children[4].children[0];
	row.previouslyEmpty = row.textContent=="";
	weaponsTable.tBodies[0].appendChild(row);
	if("melee" in data && data.melee)
		row.children[4].children[0].click();
}

weaponsTable.rowOnInput = function(ev){
	checkRowEmptyChange.call(this);
	if(this.textContent == this.cells[1].textContent)
		guessWeapon(this);
}

function setWeaponMelee(ev){
	var checkbox = this;
	checkbox.parentNode.className = checkbox.checked?"meleeCheckbox":"";
	var row = checkbox.parentNode.parentNode;
	row.children[5].colSpan = checkbox.checked?3:1;
	if(checkbox.checked){
		row.children[6].textContent = "";
		row.children[7].textContent = "";
	}
}

function guessWeapon(row){
	var name = normalizeText(row.children[1].textContent);
	if(weapons[name]){
		weapon = weapons[name];
		row.children[8].textContent=weapon[0];
		row.children[9].textContent=weapon[1];
		row.children[10].textContent=weapon[2];
		row.children[11].textContent=weapon[3];
		row.children[12].textContent=weapon[4];
		row.children[4].children[0].checked = weapon[5];
		setWeaponMelee.call(row.children[4].children[0]);
		if(!weapon[5]){
			row.children[5].textContent = weapon[6];
			row.children[6].textContent = weapon[7];
			row.children[7].textContent = weapon[8];
			//I shan't sset the ROF automatically, because then people might asssume I'd taken sspecialization into account.
		}
	}
}

weapons = {};
weapons["arquebus"]=["1d10","1d10","M","P","15",false,50,150,210];
weapons["battle axe"]=["1d8","1d8","M","S","7",true];
weapons["blowgun barbed dart"]=["1d3","1d2","L","P","5",false,10,20,30];
weapons["blowgun needle"]=["1","1","L","P","5",false,10,20,30];
weapons["composite short bow"]=["1d6","1d6","M","P","6",false,50,100,180];
weapons["short bow"]=["1d6","1d6","M","P","7",false,50,100,150];
weapons["long bow flight arrow"]=["1d6","1d6","L","P","8",false,70,140,210];
weapons["long bow sheaf arrow"]=["1d8","1d8","L","P","8",false,50,100,170];
weapons["composite long bow flight arrow"]=["1d6","1d6","L","P","7",false,60,120,210];
weapons["composite long bow sheaf arrow"]=["1d8","1d8","L","P","7",false,40,80,170];
weapons["club"]=["1d6","1d3","M","B","4",true];
weapons["hand crossbow"]=["1d3","1d2","S","P","5",false,20,40,60];
weapons["heavy crossbow"]=["1d4+1","1d6+1","M","P","10",false,80,160,240];
weapons["light crossbow"]=["1d4","1d4","M","P","7",false,60,120,180];
weapons["dagger"]=weapons["dirk"]=["1d4","1d3","S","P","2",false,10,20,30];
weapons["dart"]=["1d3","1d2","S","P","2",false,10,20,40];
weapons["footman's flail"]=["1d6+1","2d4","M","B","7",true];
weapons["footman's mace"]=["1d6+1","1d6","M","B","7",true];
weapons["footman's pick"]=["1d6+1","2d4","M","P","7",true];
weapons["hand axe"]=["1d6","1d4","M","S","4",true];
weapons["throwing axe"]=["1d6","M","S","4",false,10,20,30];
weapons["harpoon"]=["2d4","2d6","L","P","7",false,10,20,30];
weapons["horseman's flail"]=["1d4+1","1d4+1","M","B","6",true];
weapons["horseman's mace"]=["1d6","1d4","M","B","6",true];
weapons["horseman's pick"]=["1d4+1","1d4","M","P","5",true];
weapons["javelin"]=["1d6","1d6","M","P","4",false,20,40,60];
weapons["knife"]=["1d3","1d2","S","P/S","2",true];
weapons["heavy horse lance"]=["1d8+1","3d6","L","P","8",true];
weapons["light horse lance"]=["1d6","1d8","L","P","6",true];
weapons["jousting lance"]=["1d3-1","1d2-1","L","P","10",true];
weapons["medium horse lance"]=["1d6+1","2d6","L","P","7",true];
weapons["mancatcher"]=["--","--","L","--","7",true];
weapons["morning star"]=["2d4","1d6+1","M","B","7",true];
weapons["awl pike"]=["1d6","1d12","L","P","13",true];
weapons["bardiche"]=["2d4","2d6","L","S","9",true];
weapons["bec de corbin"]=["1d8","1d6","L","P/B","9",true];
weapons["bill guisarme"]=["2d4","1d10","L","P/S","10",true];
weapons["fauchard"]=["1d6","1d8","L","P/S","8",true];
weapons["fauchard fork"]=["1d8","1d10","L","P/S","8",true];
weapons["glaive"]=["1d6","1d10","L","S","8",true];
weapons["glaive guisarme"]=["2d4","2d6","L","P/S","9",true];
weapons["guisarme"]=["2d4","1d8","L","S","8",true];
weapons["guisarme voulge"]=["2d4","2d4","L","P/S","10",true];
weapons["halberd"]=["1d10","2d6","L","P/S","9",true];
weapons["hook fauchard"]=["1d4","1d4","L","P/S","9",true];
weapons["lucern hammer"]=["2d4","1d6","L","P/B","9",true];
weapons["military fork"]=["1d8","2d4","L","P","7",true];
weapons["partisan"]=["1d6","1d6+1","L","P","9",true];
weapons["ranseur"]=["2d4","2d4","L","P","8",true];
weapons["spetum"]=["1d6+1","2d6","L","P","8",true];
weapons["voulge"]=["2d4","2d4","L","S","10",true];
weapons["quarterstaff"]=["1d6","1d6","L","B","4",true];
weapons["scourge"]=["1d4","1d2","S","--","5",true];
weapons["sickle"]=["1d4+1","1d4","S","S","4",true];
weapons["sling bullet"]=["1d4+1","1d6+1","S","B","6",false,50,100,200];
weapons["sling stone"]=weapons["sling rock"]=["1d4","1d4","S","B","6",false,40,80,160];
weapons["spear"]=["1d6","1d8","M","P","6",true];
weapons["staff sling bullet"]=["1d4+1","1d6+1","M","B","11",false,"--","30-60",90];
weapons["staff sling stone"]=["1d4","1d4","M","B","11",false,"--","30-60",90];
weapons["bastard sword one handed"]=["1d8","1d12","M","S","6",true];
weapons["bastard sword two handed"]=["2d4","2d8","M","S","8",true];
weapons["broad sword"]=["2d4","1d6+1","M","S","5",true];
weapons["khopesh"]=["2d4","1d6","M","S","9",true];
weapons["long sword"]=["1d8","1d12","M","S","5",true];
weapons["scimitar"]=["1d8","1d8","M","S","5",true];
weapons["short sword"]=["1d6","1d8","S","P","3",true];
weapons["two handed sword"]=["1d10","3d6","L","S","10",true];
weapons["trident"]=["1d6+1","3d4","L","P","7",true];
weapons["warhammer"]=["1d4+1","1d4","M","B","4",true];
weapons["whip"]=["1d2","1","M","--","8",true];

for(name in weapons){
	var n = name;
	if(n.indexOf(" ")==-1)
		continue;
	while(n.indexOf(" ")>=0)
		n = n.replace(" ","")
	weapons[n] = weapons[name];
}

weaponsTable.addRow();
