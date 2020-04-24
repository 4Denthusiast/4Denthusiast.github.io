function getAncestralID(el){
	while(el){
		if(el.id)
			return el.id;
		el = el.parentNode;
	}
}

var inputElements = document.getElementsByClassName("input");

for(var i = 0; i<inputElements.length; i++){
	var el = inputElements[i];
	if(["input", "select", "textarea"].indexOf(el.nodeName.toLowerCase()) < 0)
		el.contentEditable = "true";
	var id = getAncestralID(el);
	if(id && (attributes[id] || attributes.skullduggery[id])){
		var att = attributes[id] || attributes.skullduggery[id];
		att.setInput(el);
	}
	if(id && id.startsWith("itemTraits"))
		itemTraitsInputElements[id.substring(10).toLowerCase()] = el;
	el.gmHidden = Array.prototype.indexOf.call(el.classList, "gm")>=0;
}

var outputElements = document.getElementsByClassName("output");

for(var i=0; i<outputElements.length; i++){
	var id = getAncestralID(outputElements[i]);
	if(id && (attributes[id] || attributes.skullduggery[id])){
		var att = attributes[id] || attributes.skullduggery[id];
		att.outputElement = outputElements[i];
		att.display = writeToElement;
		att.display(att.final);
	}
}
