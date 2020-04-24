var identity = a => a;
var set = (a,b) => b;
var add = (a,b) => a+b;
var mult = (a,b) => a*b;
var div = (a,b) => a/b;
var and = (a,b) => a&&b;
var or = (a,b) => a||b;
var seOr = (a,b) => b||a;
var not = a => !a;
var eq = a => b => a==b;
var geq = (a,b) => a>=b;
var gt = (a,b) => a>b;
var cutoff = a => b => b>=a;
var concat;
if(Array.concat)
	concat = Array.concat;
else
	concat = (a,b) => a.concat(b);
var contains = s => x => x && x.indexOf && x.indexOf(s)>=0;
var times = a => b => a*b;
var normalizeText = s => !s ? "" : s.toLowerCase().replace(/[\-_\/, ]+/g, " ").replace(/[\(\)]/g, "");
var nil = () => nil;//I could use any other function where I intend to use this, and () => undefined or () => false would perhapss make more ssensse, but thiss is more fun.
var index = xs => i => i<xs.length?xs[i]:xs[xs.length-1];
var chain = (f,g) => x => (f(x),g(x));
function d(n,s,dr){
	if(!s){ s = n; n = 1; }
	var result = [];
	for(var i=0; i<n; i++)
		result[i] = Math.floor(Math.random()*s)+1;
	return result.sort().slice(dr).reduce((a,b)=>a+b);
}

var chrome = navigator.userAgent.indexOf("Chrome")>=0;

var attributes = {};

function Attribute(name){
	this.name = name;
	this.defaultBase = 0;
	this.base = 0;
	this.modifiers = [];
	this.effects = [];
	this.final = 0;
	this.display = nil;
	this.initialized = false;
}

Attribute.prototype.addEffect = function(that, mode, priority, table){
	if(!that)//Debug code
		throw "That affected thing doesn't exist.";
	if(table instanceof Array)
		table = index(table);
	this.effects.push(that);
	that.modifiers.push([priority,this,mode,table]);
	that.modifiers.sort((a,b) => a[0]-b[0]);
	that.recalculate();
}

Attribute.prototype.addModifier = function(priority, f){
	this.modifiers.push([priority,f]);
	this.modifiers.sort((a,b) => a[0]-b[0]);
	this.recalculate();
}

Attribute.prototype.recalculate = function(logging){
	prev = this.final;
	if(this.inputElement){
		if(logging)
			console.log("input element found");
		this.base = getContent(this.inputElement);
		if(logging)
			console.log("Value before number parsing:" + this.base);
		if(this.numberInput){
			this.base = parseFloat(this.base);
			if(logging)
				console.log("Value after number parsing: "+this.base);
			if(isNaN(this.base))
				this.base = this.defaultBase;
		}
	}else
		this.base = this.defaultBase;
	this.final = this.base;
	if(!this.modifiers)//Debug code
		console.log(this);
	for (var i=0; i<this.modifiers.length; i++){
		if(this.modifiers[i].length==2)
			this.final = this.modifiers[i][1](this.final);
		else{
			that = this.modifiers[i][1];
			mode = this.modifiers[i][2];
			table = this.modifiers[i][3];
			if(!that.initialized)
				that.recalculate();
			if(logging){
				console.log(this.name+" going from "+this.final+" to "+mode(this.final, table(that.final))+" due to "+that.name+" having value "+that.final+" which contributes "+table(that.final));
			}
			this.final = mode(this.final, table(that.final));
		}
	}
	this.initialized = true;
	this.display(this.final);
	if(this.final == prev || (typeof this.final == "number" && isNaN(this.final) && typeof prev == "number" && isNaN(prev)))
		return;//Nothing has actually changed, there's not need to update anything.
	for (var i=0; i<this.effects.length; i++)
		this.effects[i].recalculate();
}

function getContent(element){
	while("input" in element)
		element = element.input;
	var nodeName = element.nodeName.toLowerCase();
	if(element.type == "checkbox")
		return element.checked;
	if(nodeName=="select" || nodeName=="input" || nodeName=="textarea")
		return element.value;
	else
		return element.textContent;
}

function setContent(element, value){
	while("input" in element)
		element = element.input;
	var nodeName = element.nodeName.toLowerCase();
	if(element.type == "checkbox")
		element.checked = value;
	else if(nodeName=="select" || nodeName=="input" || nodeName=="textarea")
		element.value = value;
	else{
		if(typeof value == "number")
			value = numberFormat.format(value);
		element.textContent = value;
	}
	if(element.attribute)
		element.attribute.recalculate();
}

Attribute.prototype.removeEffect = function(that){
	this.effects = this.effects.filter(x => x!=that);
	that.modifiers = that.modifiers.filter(m => m[1] != this);
	that.recalculate();
}

Attribute.prototype.setInput = function(el){
	el.attribute = this;
	if(el.nodeName.toLowerCase() != "input" && el.nodeName.toLowerCase() != "select"){
		el.contentEditable = true;
		el.addEventListener("input", useInput);
	}else
		el.addEventListener("change", useInput);
	this.inputElement = el;
	this.numberInput = false;
	for(var j in el.classList){
		if(el.classList[j]=="number")
			this.numberInput = true;
	}
	this.recalculate();
}

Attribute.prototype.removeInput = function(){
	if(!this.inputElement)
		return;
	this.inputElement.attribute = undefined;
	this.inputElement.removeEventListener("input", useInput);
	this.inputElement.removeEventListener("change", useInput);
	this.numberInput = false;
	this.inputElement = undefined;
}

Attribute.prototype.freezeInput = function(){
	if(this.inputElement){
		this.defaultBase = this.base;
		this.removeInput();
	}
}

Attribute.prototype.toString = function(){
	return this.name + ":" + this.base + "," + this.final;
}

function useInput(ev){
	this.attribute.recalculate();
}

function writeToElement(final){
	if(!this.outputElement)
		return;
	if(document.getElementById(this.name)){
		if((typeof final == "number") && isNaN(final))
			document.getElementById(this.name).style.display="none";
		else
			document.getElementById(this.name).style.display = "";
	}
	setContent(this.outputElement, final);
}

var numberFormat = new Intl.NumberFormat([], {maximumFractionDigits:20, maximumSignificantDigits:14});
