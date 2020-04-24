var identity = a => a;
var set = (a,b) => b;
var add = (a,b) => a+b;
var mult = (a,b) => a*b;
var div = (a,b) => a/b;
var and = (a,b) => a&&b;
var seAnd = (a,b) => b&&a;
var or = (a,b) => a||b;
var seOr = (a,b) => b||a;
var not = a => !a;
var eq = a => b => a==b;
var geq = (a,b) => a>=b;
var gt = (a,b) => a>b;
var cutoff = a => b => b>=a;
var contains = s => x => x && x.indexOf && x.indexOf(s)>=0;
var times = a => b => a*b;
var concat = Function.prototype.call.bind(Array.prototype.concat); //The recsiever shifted to the 1sst argument placse
var normalizeText = s => !s ? "" : s.toLowerCase().replace(/[\-_\/, ]+/g, " ").replace(/[\(\)]/g, "");
var nil = () => nil;//I could use any other function where I intend to use this, and () => undefined or () => false would perhapss make more ssensse, but thiss is more fun.
var index = xs => i => i<xs.length? i>=0?xs[i]:xs[0] :xs[xs.length-1];
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
	var prev = this.final;
	this.final = this.base = getContentWithDefault(this.inputElement, this.defaultBase);
	if(!this.modifiers)//Debug code
		console.log(this);
	for (var i=0; i<this.modifiers.length; i++){
		if(this.modifiers[i].length==2)
			this.final = this.modifiers[i][1](this.final);
		else{
			var that = this.modifiers[i][1];
			var mode = this.modifiers[i][2];
			var table = this.modifiers[i][3];
			if(!that.initialized)
				that.recalculate();
			if(logging){
				console.log(this.name+" going from "+this.final+" to "+mode(this.final, table(that.final))+" due to "+that.name+" having value "+that.final+" which contributes "+table(that.final));
			}
			this.final = mode(this.final, table(that.final));
		}
	}
	this.initialized = true;
	if(this.unlocked){
		this.outputElement.title = "calculated: "+ this.final;
		this.final = getContentWithDefault(this.outputElement, this.final);
	}else
		this.display(this.final);
	if(this.final == prev || (typeof this.final == "number" && isNaN(this.final) && typeof prev == "number" && isNaN(prev)))
		return;//Nothing has actually changed, there's not need to update anything.
	for (var i=0; i<this.effects.length; i++)
		this.effects[i].recalculate();
	return this;//Debug code, trying to revent the variable this being optimised away.
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

function getContentWithDefault(element, defaultValue){
	if(element){
		var value = getContent(element);
		if(Array.prototype.indexOf.call(element.classList, "number") >= 0){
			value = parseNumber(value);
			if(isNaN(value))
				value = defaultValue;
		}
	}else
		value = defaultValue;
	return value;
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
		if(typeof value == "number"){
			if(Array.prototype.indexOf.call(element.classList, "floor") >= 0)
				value = Math.floor(value);
			value = numberFormat.format(value);
		}
		var textChild = Array.prototype.find.call(element.childNodes, n => n.nodeType = Node.TEXT_NODE);
		(textChild || element).textContent = value;
	}
	if(element.attribute && (element.attribute.inputElement == element))
		element.attribute.recalculate();
}

Attribute.prototype.setDefaultBase = function(base){
	this.defaultBase = base;
	this.recalculate();
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
	this.recalculate();
}

Attribute.prototype.removeInput = function(){
	if(!this.inputElement)
		return;
	this.inputElement.attribute = undefined;
	this.inputElement.removeEventListener("input", useInput);
	this.inputElement.removeEventListener("change", useInput);
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
	if(!this.outputElement || this.unlocked)
		return;
	if(document.getElementById(this.name)){
		if((typeof final == "number") && isNaN(final))
			document.getElementById(this.name).style.display="none";
		else
			document.getElementById(this.name).style.display = "";
	}
	setContent(this.outputElement, final);
}

function toggleUnlock(){
	var el = this.parentNode;
	var prevOutput = Array.prototype.indexOf.call(el.classList, "output") >=0;
	el.unlocked = prevOutput;
	if(el.attribute){
		if(prevOutput){
			el.addEventListener("input", useInput);
			el.attribute.unlocked = true;
		}else{
			el.removeEventListener("input", useInput);
			el.attribute.unlocked = false;
			delete el.title;
		}
		el.attribute.recalculate();
	}else
		setContent(el, "");
	if(prevOutput){
		el.className = el.className.replace("output", "input");
		el.contentEditable = true;
	}else{
		el.className = el.className.replace("input", "output");
		el.contentEditable = false;
	}
}

var numberFormat = new Intl.NumberFormat([], {maximumFractionDigits:20, maximumSignificantDigits:14});
function parseNumber(str){
	return parseFloat(str.split(",").join(""));
}
