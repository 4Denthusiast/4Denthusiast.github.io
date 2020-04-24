var currentFloaterMaxZIndex = 0;
var prevFloaterTouched = undefined;

function floatersMouseMove(ev){
	if(document.activeElement && document.activeElement != document.body)//to allow fields insside of floaters to work better
		return;
	if(!(ev.buttons & 1))//Left mousse button not presssed
		return;
	var left = parseFloat(this.style.left);
	if(isNaN(left))
		left = innerWidth-this.offsetWidth-parseFloat(this.style.right);
	var top = parseFloat(this.style.top);
	if(isNaN(top))
		top = innerHeight-this.offsetHeight-parseFloat(this.style.bottom);
	left = Math.max(0,left+ev.movementX);
	top  = Math.max(0,top +ev.movementY);
	var right = Math.max(0,innerWidth-left-this.offsetWidth);
	var bottom= Math.max(0,innerHeight-top-this.offsetHeight);
	if(left<right){
		this.style.left = left+"px";
		this.style.right = "";
	}else{
		this.style.right = right+"px";
		this.style.left = "";
	}
	if(top<bottom){
		this.style.top = top+"px";
		this.style.bottom = "";
	}else{
		this.style.bottom = bottom+"px";
		this.style.top = "";
	}
	if(prevFloaterTouched != this){
		prevFloaterTouched = this;
		this.style.zIndex = currentFloaterMaxZIndex++;
		if(currentFloaterMaxZIndex > 24){
			console.log("Floating menu z indexs overflow");
			var allFloaters = document.getElementsByClassName("floater");
			var arr = [];
			for(var i=0; i<allFloaters.length; i++)
				arr[i] = allFloaters[i];
			allFloaters = arr.sort((a,b) => a.style.zIndex - b.style.zIndex);
			for(var i=0; i<allFloaters.length; i++)
				allFloaters[i].style.zIndex = i;
			currentFloaterMaxZIndex = allFloaters.length;
		}
	}
}

function makeFloaterDraggable(float, name){
	float.addEventListener("mousemove", floatersMouseMove);
	var button = float.getElementsByClassName("floaterHeader")[0];
	if(button){
		button = button.children[button.children.length-1];
		if(button){
			button.addEventListener("click", closeFloater);
			button.floater = float;
		}
	}
	if(name){
		var tr = document.createElement("tr");
		tr.appendChild(document.createElement("td"));
		tr.appendChild(document.createElement("td"));
		tr.children[0].textContent = name;
		var dockButton = document.createElement("button");
		if(button)
			button.dockButton = dockButton;
		dockButton.dockButton = dockButton;
		dockButton.floater = float;
		dockButton.addEventListener("click", closeFloater);
		dockButton.textContent = "□";
		dockButton.className = "floatersDockButton";
		tr.children[1].appendChild(dockButton);
		floatersDockTable.children[0].appendChild(tr);
		float.style.display = "none";
	}
}

function closeFloater(ev){
	var floater = this.floater;
	var dockButton = this.dockButton;
	var prevHidden = floater.style.display == "none";
	floater.style.display = prevHidden?"flex":"none";
	if(dockButton)
		dockButton.textContent = prevHidden?"_":"□";
	floater.style.zIndex = currentFloaterMaxZIndex++;
}

var floatersDockTable = document.getElementById("floatersDock").children[1];
makeFloaterDraggable(floatersDockTable.parentNode);
