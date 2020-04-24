String.prototype.padStart = String.prototype.padStart || function(length, str){
	length -= this.length;
	str = str || " ";
	result = str.substring(str.length-(length%str.length));
	for( ; length >= str.length; length -= str.length)
		result += str;
	return result+this;
};

(function(){
	var coloursMenu = document.getElementById("coloursMenu");
	makeFloaterDraggable(coloursMenu, "Colours");
	
	var defaultColours = [
		"#ffffff",
		"#000000",
		"#ffe0e0",
		"#e0e0ff",
		"#d0ffd0",
		"#909090",
		"#c0c0c0"
	];
	
	var colourNames = [
		"background",
		"foreground",
		"input",
		"output",
		"highlight",
		"drag-handle",
		"filler-row",
		"faint-highlight",
		"floater-background",
		"floater-border",
		"faint-line",
		"drag-handle-1",
		"drag-handle-2"
	];
	
	var colours = {};
	for(var i=0; i<colourNames.length; i++){
		colours[i] = colours[colourNames[i]] = new Attribute(colourNames[i]+"-colour");
		colours[i].display = colourDisplay;
	}

	var tBody = coloursMenu.children[2].tBodies[0];
	for(var i=0; i<tBody.rows.length; i++){
		var row = tBody.rows[i];
		var itd = document.createElement("itd");
		var inp = document.createElement("input");
		inp.type = "color";
		inp.value = localStorage.getItem(colourNames[i]+"-colour") || defaultColours[i];
		colours[i].setDefaultBase(defaultColours[i]);
		colours[i].setInput(inp);
		itd.appendChild(inp);
		row.appendChild(itd);
	}
	
	colours.background.addEffect(colours["faint-highlight"], set, 0, identity);
	colours.highlight.addEffect(colours["faint-highlight"], blendColours(0.5), 0, identity);
	
	colours.background.addEffect(colours["floater-background"], set, 0, identity);
	colours.foreground.addEffect(colours["floater-background"], blendColours(1/32), 0, identity);
	
	colours.foreground.addEffect(colours["floater-border"], set, 0, identity);
	colours.background.addEffect(colours["floater-border"], blendColours(1/16), 0, identity);
	
	colours.foreground.addEffect(colours["faint-line"], set, 0, identity);
	colours.background.addEffect(colours["faint-line"], blendColours(0.8), 0, identity);
	
	colours["drag-handle"].addEffect(colours["drag-handle-1"], set, 0, identity);
	colours.background.addEffect(colours["drag-handle-1"], blendColours(0.1), 0, identity);
	colours["drag-handle"].addEffect(colours["drag-handle-2"], set, 0, identity);
	colours.foreground.addEffect(colours["drag-handle-2"], blendColours(0.1), 0, identity);
	
	function colourDisplay(c){
		if(this.inputElement){
			if(c == this.defaultBase)
				localStorage.removeItem(this.name);
			else
				localStorage.setItem(this.name, c);
		}
		document.body.style.setProperty("--"+this.name, c);
	}
	
	function blendHex(x, h1, h2){
		return Math.round(
				(1-x)*parseInt(h1, 16) + 
				x    *parseInt(h2, 16)
			).toString(16)
			.padStart(2, "0");
	}
	
	function blendColours(x){
		return function(c1,c2){
			return "#"
				+blendHex(x, c1.substring(1,3), c2.substring(1,3))
				+blendHex(x, c1.substring(3,5), c2.substring(3,5))
				+blendHex(x, c1.substring(5,7), c2.substring(5,7));
		}
	}
	
	document.getElementById("resetColoursButton").addEventListener("click", function(){
		for(var i=0; i<defaultColours.length; i++){
			colours[i].inputElement.value = defaultColours[i];
			colours[i].recalculate();
		}
	});
})();
