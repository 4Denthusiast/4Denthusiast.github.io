makeFloaterDraggable(document.getElementById("titleMenu"), "Title");

attributes.characterName.addEffect(attributes.title, set, 0, identity);
attributes.titleType.addEffect(attributes.title, shooseTitle, 1, identity);
attributes.customTitle.addEffect(attributes.title, seOr, 2, identity);

function shooseTitle(name, type){
	if(type=="default")
		return "New character sheet";
	if(!name)
		return "nalselme'e";
	if(type=="full")
		return name;
	if(type=="first" || type=="last"){
		name = name.split(" ");
		if(type=="first")
			return name[0];
		else
			return name[name.length-1];
	}
	throw "Unknown title type.";
}
