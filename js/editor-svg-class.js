/*	
 * 	Web OPM: online case tool for Object-Process Methodology
 * 	Copyright © 2012 Israel Institute of Technology - Technion
 * 	The code is licensed under GNU General Public License, v2
 * 
 * 	File context description:
 * 	File contains classes description used for GUI
 * 
 *  Author: Sergey N. Bolshchikov
 * */


function UIDiagram(id) {
	this.id = id;
	this.transform = 'matrix(1 0 0 1 0 0)';
	this.active = true;
	this.elements = { };
	this.type = 'diagram';
}
UIDiagram.prototype.draw = function() {
	var group = document.createElementNS(svgNS, 'g');
	group.setAttributeNS(null, 'id', this.id);
	group.setAttributeNS(null, 'transform', this.transform);
	group.setAttributeNS(null, 'type', 'diagram');
	svg.appendChild(group);
}
UIDiagram.prototype.addElement = function(element) {
	this.elements[element.id] = element;
}
UIDiagram.prototype.returnElement = function(id) {
	for (el in this.elements) {
		if (this.elements[el].id == id) { return this.elements[el]; }
	}
}

function UIName(name) {
	//Class holding the name of any element
	this.x = null;
	this.y = null;
	this.fill = 'black';
	this.fontFamily = 'Helvetica';
	this.fontWeight = 'bold';
	this.fontSize = '15';
	this.value = name;
}
UIName.prototype.rename = function(newName) {
	this.value = newName;
}
UIName.prototype.updateLocation = function(newX, newY) {
	this.x = newX;
	this.y = newY;
}
UIName.prototype.updateFont = function(newFont) {
	this.fontFamily = newFont;
}
UIName.prototype.updateSize = function(newSize) {
	this.fontSize = newSize;
}
 
function UIObject(obj) {
	this.id = obj.id;
	this.x = randomFromTo(90, 1150);
	this.y = randomFromTo(5, 420);
	this.width = 110;
	this.height = 70;
	this.fill = 'white';
	this.stroke = 'limeGreen';
	this.strokeWidth = 2;
	this.name = new UIName(obj.name);
	this.states = { }
	this.statesAmount = 0;
	this.icon = null;
	this.type = 'object';
}
UIObject.prototype.addState = function(state) {
	this.states[state.id] = state;
	this.statesAmount++;
}
UIObject.prototype.draw = function() {
	//Draw a group first
	var group = document.createElementNS(svgNS, 'g');
	group.setAttributeNS(null, 'id', this.id);
	group.setAttributeNS(null, 'transform', 'matrix(1 0 0 1 0 0)');
	group.setAttributeNS(null, 'onmousedown', 'setSrc(evt)');
	group.setAttributeNS(null, 'onmouseup', 'setDest(evt)');
	group.setAttributeNS(null, 'onclick', 'select(evt)');
	group.setAttributeNS(null, 'type', 'object');
	activeSVGDiagram.appendChild(group);
	//Draw rectangle, appended to the group
	var rect = document.createElementNS(svgNS, 'rect');
	rect.setAttributeNS(null, 'x', this.x);
	rect.setAttributeNS(null, 'y', this.y);
	rect.setAttributeNS(null, 'width', this.width);
	rect.setAttributeNS(null, 'height', this.height);
	rect.setAttributeNS(null, 'fill', this.fill);
	rect.setAttributeNS(null, 'stroke', this.stroke);
	rect.setAttributeNS(null, 'stroke-width', this.strokeWidth);
	group.appendChild(rect);
	//Draw grip
	var grip = document.createElementNS(svgNS, 'image');
	grip.setAttributeNS(null, 'x', this.x + 100);
	grip.setAttributeNS(null, 'y', this.y + 60);
	grip.setAttributeNS(null, 'width', '9');
	grip.setAttributeNS(null, 'height', '9');
	grip.setAttributeNS(xlinkNS, 'xlink:href', 'img/gripsmall-se.png');
	grip.setAttributeNS(null, 'visibility', 'hidden');
	group.appendChild(grip);
	//Draw name
	this.name.updateLocation(this.x + 26, this.y + 42);
	var rectName = document.createElementNS(svgNS, 'text');
	rectName.setAttributeNS(null, 'x', this.name.x);
	rectName.setAttributeNS(null, 'y', this.name.y);
	rectName.setAttributeNS(null, 'font-family', this.name.fontFamily);
	rectName.setAttributeNS(null, 'font-weight', this.name.fontWeight);
	rectName.setAttributeNS(null, 'font-size', this.name.fontSize);	
	var caption = document.createTextNode(this.name.value);
	rectName.appendChild(caption);
	group.appendChild(rectName);
}
UIObject.prototype.updateLocation = function(newX, newY) {
	if (newX) { this.x = newX; }
	if (newY) { this.y = newY; }
}
UIObject.prototype.updateSize = function(newWidth, newHeight) {
	if (newWidth) { this.width = newWidth; }
	if (newHeight) { this.height = newHeight; }
}
UIObject.prototype.updateColor = function(color) {
	this.fill = color
}
UIObject.prototype.updateBorder = function(newStroke, newStrokeWidth) {
	if (newStroke) { this.stroke = newStroke; }
	if (newStrokeWidth) { this.strokeWidth = newStrokeWidth; }
}

function UIProcess(prc) {
	this.id = prc.id
	this.x = randomFromTo(90, 1150);
	this.y = randomFromTo(5, 420);
	this.rx = 60;
	this.ry = 40;
	this.fill = 'white';
	this.stroke = 'RoyalBlue';
	this.strokeWidth = 2;
	this.name = new UIName(prc.name);
	this.icon = null;
	this.type = 'process';
}
UIProcess.prototype.draw = function() {
	var group = document.createElementNS(svgNS, 'g');
	group.setAttributeNS(null, 'id', this.id);
	group.setAttributeNS(null, 'transform', 'matrix(1 0 0 1 0 0)');
	group.setAttributeNS(null, 'onmousedown', 'setSrc(evt)');
	group.setAttributeNS(null, 'onmouseup', 'setDest(evt)');
	group.setAttributeNS(null, 'onclick', 'select(evt)');
	group.setAttributeNS(null, 'type', 'process');
	activeSVGDiagram.appendChild(group);
	var ellipse = document.createElementNS(svgNS, 'ellipse');
	ellipse.setAttributeNS(null, 'cx', this.x);
	ellipse.setAttributeNS(null, 'cy', this.y);
	ellipse.setAttributeNS(null, 'rx', this.rx);
	ellipse.setAttributeNS(null, 'ry', this.ry);
	ellipse.setAttributeNS(null, 'fill', this.fill);
	ellipse.setAttributeNS(null, 'stroke', this.stroke);
	ellipse.setAttributeNS(null, 'stroke-width', this.strokeWidth);
	group.appendChild(ellipse);
	var grip = document.createElementNS(svgNS, 'image');
	grip.setAttributeNS(null, 'x', this.x + 51);
	grip.setAttributeNS(null, 'y', this.y + 31);
	grip.setAttributeNS(null, 'width', '9');
	grip.setAttributeNS(null, 'height', '9');
	grip.setAttributeNS(xlinkNS, 'xlink:href', 'img/gripsmall-se.png');
	grip.setAttributeNS(null, 'visibility', 'hidden');
	group.appendChild(grip);
	this.name.updateLocation(this.x - 33, this.y + 6);
	var elName = document.createElementNS(svgNS, 'text');
	elName.setAttributeNS(null, 'x', this.name.x);
	elName.setAttributeNS(null, 'y', this.name.y);
	elName.setAttributeNS(null, 'font-family', this.name.fontFamily);
	elName.setAttributeNS(null, 'font-weight', this.name.fontWeight);
	elName.setAttributeNS(null, 'font-size', this.name.fontSize);	
	var caption = document.createTextNode(this.name.value);
	elName.appendChild(caption);
	group.appendChild(elName);
}
UIProcess.prototype.updateLocation = function(newX, newY) {
	if (newX) { this.x = newX; }
	if (newY) { this.y = newY; }
}
UIProcess.prototype.updateSize = function(newRx, newRy) {
	if (newRx) { this.rx = newRx; }
	if (newRy) { this.ry = newRy; }
}
UIProcess.prototype.updateColor = function(color) {
	this.fill = color
}
UIProcess.prototype.updateBorder = function(newStroke, newStrokeWidth) {
	if (newStroke) { this.stroke = newStroke; }
	if(newStrokeWidth) { this.strokeWidth = newStrokeWidth; }
}

var objHeightStep = 35;					//Amount of pixels to enlarge the object height when a new state is added
var stateYDelta = 10;					//Distance between states
function UIState(parent, inst) {
	this.id = inst.id
	this.x = activeSVGElement.firstChild.x.baseVal.value + 20;
	this.y = activeSVGElement.firstChild.y.baseVal.value + 55;
	this.rx = 6;			
	this.ry = 6;			
	this.width = 70;	
	this.height = 25; 	
	this.fill = 'white';
	this.stroke = '#002e00';
	this.strokeWidth = 1;
	this.name = new UIName(inst.name);
	this.parent = parent;
	this.icon = null;
	this.type = 'state';
}
UIState.prototype.draw = function(){
	var group = document.createElementNS(svgNS, 'g');
	group.setAttributeNS(null, 'id', this.id);
	group.setAttributeNS(null, 'transform', 'matrix(1 0 0 1 0 0)');
	group.setAttributeNS(null, 'type', 'state');
	activeSVGElement.appendChild(group);
	
	//Increase height of parent rect
	var oldHeight = this.parent.height;
	var newHeight = oldHeight + objHeightStep;
	activeSVGElement.firstChild.setAttributeNS(null, 'height', newHeight);
	this.parent.updateSize(null, newHeight);
	var grip = activeSVGElement.getElementsByTagNameNS(svgNS, 'image').item(0);
	var gripY = grip.y.baseVal.value;
	grip.setAttributeNS(null, 'y', gripY + (newHeight - oldHeight));
	
	//Update and y coordinate of state rect
	this.y = this.y + (this.parent.statesAmount - 1) * this.height + (this.parent.statesAmount - 1) * stateYDelta;
	
	//Drawing	
	var rect = document.createElementNS(svgNS, 'rect');
	rect.setAttributeNS(null, 'x', this.x);
	rect.setAttributeNS(null, 'y', this.y);
	rect.setAttributeNS(null, 'rx', this.rx);
	rect.setAttributeNS(null, 'ry', this.ry)
	rect.setAttributeNS(null, 'width', this.width);
	rect.setAttributeNS(null, 'height', this.height);
	rect.setAttributeNS(null, 'fill', this.fill);
	rect.setAttributeNS(null, 'stroke', this.stroke);
	rect.setAttributeNS(null, 'stroke-width', this.strokeWidth);
	group.appendChild(rect);

	this.name.updateLocation(this.x + 14, this.y + 17);
	this.name.updateSize(13);
	var rectName = document.createElementNS(svgNS, 'text');
	rectName.setAttributeNS(null, 'x', this.name.x);
	rectName.setAttributeNS(null, 'y', this.name.y);
	rectName.setAttributeNS(null, 'font-family', this.name.fontFamily);
	rectName.setAttributeNS(null, 'font-weight', this.name.fontWeight);
	rectName.setAttributeNS(null, 'font-size', this.name.fontSize);	
	var caption = document.createTextNode(this.name.value);
	rectName.appendChild(caption);
	group.appendChild(rectName);
}
UIState.prototype.updateLocation = function(newX, newY) {
	this.x = newX;
	this.y = newY;
}
UIState.prototype.updateSize = function(newRx, newRy, newWidth, newHeight) {
	this.rx = newRx;
	this.ry = newRy;
	this.width = newWidth;
	this.height = newHeight;
}
UIState.prototype.updateColor = function(color) {
	this.fill = color;
}
UIState.prototype.updateBorder = function(newStroke, newStrokeWidth) {
	this.stroke = newStroke;
	if(newStrokeWidth) { this.strokeWidth = newStrokeWidth; }
}

function UILink(parent) {
	this.id = parent.id;
	this.d = null;
	this.fill = 'none';
	this.stroke = 'DimGrey';
	this.strokeWidth = 2;
	this.name = null;
	this.type = 'link';
}
UILink.prototype.updateLink = function(newD) {
	this.d = newD;
}
UILink.prototype.updateColor = function(color) {
	this.stroke = color;
}
UILink.prototype.draw = function(src, dest) {
	//Calculating coordinates of connection point
	switch(linkOn.type) {
	case 'udr':
		var srcCenter = [src.x + src.width / 2, src.y + src.height / 2];
		var destCenter = [dest.x + dest.width / 2, dest.y + dest.height / 2];
		
		var srcSizeMin = [src.x, src.y];
		var srcSizeMax = [src.x + src.width, src.y + src.height];
		var destSizeMin = [dest.x, dest.y];
		var destSizeMax = [dest.x + dest.width, dest.y + dest.height];
		var srcBorderPoint = lssbClipping(srcCenter, destCenter, srcSizeMin, srcSizeMax);
		var destBorderPoint = lssbClipping(srcCenter, destCenter, destSizeMin, destSizeMax);
		
		var group = document.createElementNS(svgNS, 'g');
		group.setAttributeNS(null, 'id', this.id);
		activeSVGDiagram.appendChild(group);
		
		var newD = 'M ' + srcBorderPoint.join(',') + ' L ' + destBorderPoint.join(',');
		this.updateLink(newD);
		//Drawing a link
		var path = document.createElementNS(svgNS, 'path');
		path.setAttributeNS(null, 'marker-end', 'url(#udr)');
		path.setAttributeNS(null, 'd', this.d);
		path.setAttributeNS(null, 'stroke', this.stroke);
		path.setAttributeNS(null, 'stroke-width', this.strokeWidth);
		path.setAttributeNS(null, 'fill', this.fill);
		group.appendChild(path);
		break;
	
	case 'rcl':

		if (src.type === 'process') { var srcCenter = [src.x, src.y]; }
		else { 
			var srcCenter = [src.x + src.width / 2, src.y + src.height / 2]; 
			var srcSizeMin = [src.x, src.y];
			var srcSizeMax = [src.x + src.width, src.y + src.height];
		}
		if (dest.type === 'process') { var destCenter = [dest.x, dest.y]; }
		else { 
			var destCenter = [dest.x + dest.width / 2, dest.y + dest.height / 2]; 
			var destSizeMin = [dest.x, dest.y];
			var destSizeMax = [dest.x + dest.width, dest.y + dest.height];
		}

		
		if (src.type === 'process') { 
			var params = { cx: src.x, cy: src.y, rx: src.rx, ry: src.ry }
			var srcBorderPoint = ellipClipping(srcCenter, destCenter, params);
		}
		else {
			var srcBorderPoint = lssbClipping(srcCenter, destCenter, srcSizeMin, srcSizeMax);
		}
		
		if (dest.type === 'process') { 
			var params = { cx: dest.x, cy: dest.y, rx: dest.rx, ry: dest.ry }
			var destBorderPoint = ellipClipping(srcCenter, destCenter, params);
		}
		else {
			var destBorderPoint = lssbClipping(srcCenter, destCenter, destSizeMin, destSizeMax);
		}
		

		var group = document.createElementNS(svgNS, 'g');
		group.setAttributeNS(null, 'id', this.id);
		activeSVGDiagram.appendChild(group);
		
		var newD = 'M ' + srcBorderPoint.join(',') + ' L ' + destBorderPoint.join(',');
		this.updateLink(newD);
		//Drawing a link
		var path = document.createElementNS(svgNS, 'path');
		path.setAttributeNS(null, 'marker-end', 'url(#rcl)');
		path.setAttributeNS(null, 'd', this.d);
		path.setAttributeNS(null, 'stroke', this.stroke);
		path.setAttributeNS(null, 'stroke-width', this.strokeWidth);
		path.setAttributeNS(null, 'fill', this.fill);
		group.appendChild(path);
		
		break;
	}

}

//Data Structure Implementation
//Data Structure 
var UIDiagramList = { };
//Data Structure Methods
UIDiagramList.addDiagram = function(diagram) {	
	this[diagram.id] = diagram;
}
UIDiagramList.returnActive = function() {
	for (d in this) {
		if (this[d].active === true) { return this[d]; }
	}
}