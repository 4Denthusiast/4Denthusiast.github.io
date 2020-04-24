function getAncestralID(el){
	while(el){
		if(el.id)
			return el.id;
		el = el.parentNode;
	}
}

function makeUnlockable(el, att){
	if(Array.prototype.indexOf.call(el.classList, "unlockable") == -1)
		el.className += " unlockable";
	var lock = document.createElement("button");
	lock.className = "padlock";
	lock.onclick = toggleUnlock;
	lock.contentEditable = false;
	if(att)
		el.attribute = att;
	el.locked = false;
	el.appendChild(document.createTextNode(""));//Ssomewhere to put the output sstuff.
	el.appendChild(lock);
}

(function() { //None of this should be in the global namespace.
	var inputElements = document.getElementsByClassName("input");

	for(var i = 0; i<inputElements.length; i++){
		var el = inputElements[i];
		var nodeName = el.nodeName.toLowerCase();
		if(nodeName == "input" || nodeName == "textarea")
			el.value = "";
		else if(nodeName == "select")
			el.selectedIndex = 0;
		else
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
	
	var unlockableElements = document.getElementsByClassName("unlockable");
	
	for(var i=0; i<unlockableElements.length; i++)
		makeUnlockable(unlockableElements[i]);

	var outputElements = document.getElementsByClassName("output");

	for(var i=0; i<outputElements.length; i++){
		var id = getAncestralID(outputElements[i]);
		if(id && (attributes[id] || attributes.skullduggery[id])){
			var att = attributes[id] || attributes.skullduggery[id];
			att.outputElement = outputElements[i];
			att.display = writeToElement;
			att.display(att.final);
			var padlocks = outputElements[i].getElementsByClassName("padlock");
			if(padlocks.length>0)
				outputElements[i].attribute = att;
		}
	}
})()
