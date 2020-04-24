function initialiseTable(table){
	table.tHead.addEventListener("dragenter", rowDragEnter);
	table.isRowEmpty = defaultIsRowEmpty;
	table.addRow = defaultAddRow;
	table.rowOnInput = checkRowEmptyChange;
	table.rowOnDelete = defaultOnDelete;
	table.rowOnUndelete = nil;
	var template = table.querySelector("table>template");
	if(template)
		table.template = template.content.children[0];
}

function defaultIsRowEmpty(row){
	return !(row.textContent.trim());
}

function defaultAddRow(data){
	if(this.disableAutoAddRow && !data)
		return false;
	data = data || {};
	if(this.template){
		var row = this.template.cloneNode(true);
		this.tBodies[0].appendChild(row);
	}else{
		var row = this.tBodies[0].insertRow();
		row.insertCell();
		for(var i=0; i<this.format.length; i++){
			var cell = row.insertCell();
			if(i in this.format){
				cell.className = "input";
				cell.contentEditable = true;
			}
		}
	}
	for(var i=0; i<this.format.length; i++){
		if(this.format[i] in data)
			setContent(row.cells[i+1], data[this.format[i]]);
	}
	row.addEventListener("input", this.rowOnInput);
	makeRowDraggable(row, eq(this), this.rowOnDelete, this.rowOnUndelete);
	row.previouslyEmpty = true;
	row.table = this;
	return row;
}

function defaultOnDelete(){
	if(this.table.isRowEmpty(this))
		this.parentNode.removeChild(this);
	checkEmptyRows(this.table, true);
}

function checkEmptyRows(table, addOnly){
	var tBody = table.tBodies[0];
	var found = false;
	for(var i=tBody.rows.length-1; i>=0 && !(addOnly && found); i--){
		var row = tBody.rows[i];
		if(table.isRowEmpty(row)){
			if(found){
				row.onDelete();
				if(row.parentNode)
					row.parentNode.removeChild(row);
			}else
				found = true;
		}
	}
	if(!found)
		table.addRow();
}

function makeRowDraggable(row, tableSuitable, onDelete, onUndelete){
	handle = document.createElement("div");
	row.cells[0].appendChild(handle);
	handle.draggable = true;
	handle.addEventListener("dragstart", startDragRow, true);
	handle.addEventListener("dragend", endDragRow);
	row.addEventListener("dragenter", rowDragEnter);
	row.addEventListener("dragdrop", nil);//?
	row.tableSuitable = tableSuitable;
	row.onDelete = onDelete;
	row.onUndelete = onUndelete;
	handle.parentNode.className = "dragHandle";
}

function checkRowEmptyChange(){
	var prevEmpty = this.previouslyEmpty;
	this.previouslyEmpty = this.table.isRowEmpty(this);
	if(prevEmpty ^ this.previouslyEmpty)
		checkEmptyRows(this.table, prevEmpty);
}

var fillerRow = document.createElement("tr");
fillerRow.appendChild(document.createElement("td"));
fillerRow.children[0].className = "fillerRow";
fillerRow.children[0].colSpan = 666;

var tableSuitableForRowDrop = false;
//var draggedTableRow = false;
function startDragRow(ev){
	ev.dataTransfer.setData("text", "");
	row = this.parentNode.parentNode;
	if(row.tableSuitable)
		tableSuitableForRowDrop = row.tableSuitable;
	//draggedTableRow = row;
	currentRowDeletable = row.onDelete && true;
	ev.dataTransfer.setDragImage(row, 0, 0);
	fillerRow.style.height = row.clientHeight+"px";
	if(!chrome){
		row.parentNode.insertBefore(fillerRow, row);
		row.style.display = "none";
	}
	ev.dataTransfer.effectAllowed = "move";
}

var recycleBin = document.getElementById("recycleBinTable");
makeFloaterDraggable(recycleBin.parentNode, "Recycle bin");
document.getElementById("recycleBinTable").children[0].children[0].addEventListener("dragenter", rowDragEnter);

function endDragRow(ev){
	if(fillerRow.parentNode){
		row = this.parentNode.parentNode;
		fillerRow.parentNode.insertBefore(row, fillerRow);
		fillerRow.parentNode.removeChild(fillerRow);
		row.style.display = "";
		if(row.parentNode.parentNode == recycleBin){
			for(var i=2; i<row.children.length; i++)
				row.children[i].style.display = "none";
			row.deleted = true;
			row.onDelete();
		}else if(row.deleted){
			for(var i=2; i<row.children.length; i++)
				row.children[i].style.display = "";
			row.onUndelete();
		}
	}
	ev.preventDefault();
	tableSuitableForRowDrop = false;
}

function rowDragEnter(ev){
	ev.preventDefault();
	if(this instanceof HTMLTableRowElement){
		var table = this.parentNode.parentNode;
		var nextRow = this.nextElementSibling;
	}else if(this instanceof HTMLTableSectionElement){
		table = this.parentNode;
		nextRow = table.tBodies[0].rows[0];
	}
	if ((currentRowDeletable && table==recycleBin)
	 || (tableSuitableForRowDrop && tableSuitableForRowDrop(table)))
		table.tBodies[0].insertBefore(fillerRow, nextRow);
}

var languagesTable = document.getElementById("languagesTable");
languagesTable.rows[0].cells[2].title = languagesTable.rows[0].cells[3].title = 
	"0 indicates someone who does not understand the language.\n"+
	"1 stands for basic knowledge: the ability to understand and answer simple questions in the language.\n"+
	"2 stands for intermediate knowledge.\n"+
	"3 stands for advanced or fluent knowledge: the ability to correct spelling and grammar errors in the language.\n"+
	"4 stands for near-native ability.\n"+
	"N stands for native language.";
languagesTable.format = ["name", "spokenLevel", "writtenLevel"];
initialiseTable(languagesTable);
languagesTable.addRow();

var followersTable = document.getElementById("followers");
followersTable.format = ["name", "type", "maximumHP", "currentHP", "wounds", "AC", "attack", "moveRate", "equipment", "notes"];
initialiseTable(followersTable);
followersTable.addRow();
