/*	
 * Web OPM: online case tool for Object-Process Methodology
 * Copyright © 2012 Israel Institute of Technology - Technion
 * The code is licensed under GNU General Public License, v2
 * 
 * Context: set of functions for work w/ SVG canvas
 * 
 * Author: Sergey N. Bolshchikov  
 * */

var svg = document.getElementsByTagName('svg')[0];
var svgNS = svg.getAttribute('xmlns');
var xlinkNS = svg.getAttribute('xmlns:xlink');

var activeSVGDiagram = document.getElementById('sd');
var activeSVGElement = null;

var currentX = 0;
var currentY = 0;
var currentMatrix = 0;
var objId = 0; 
var prcId = 0;
var lnkId = 0;


var addObject = function() {
	try {
		if (activeSVGElement !== null) { deselect(); }
		objId++;
		
		//Create instance of UIObject class (GUI)
		var obj = new UIObject(objId);
		obj.draw();
		activeUIDiagram.addElement(obj);
		
		//Create instance of OPMObject class (Client-side Logic)
		var opmobj = new OPMObject();
		opmobj.id = obj.id
		opmobj.name = obj.name.value;
		activeOPMDiagram.addElement(opmobj);
		opmobj.addDiagram(activeOPMDiagram);
	}
	catch(e) {
		alert(e.message);
	}
}

var addProcess = function() {
	try {
		if (activeSVGElement !== null) { deselect(); }
		prcId++;
		
		//Create instance of UIProcess class (GUI)
		var prc = new UIProcess(prcId);
		prc.draw();
		activeUIDiagram.addElement(prc);
		
		//Create instance of OPMProcess class (Client-side Logic)
		var opmprc = new OPMProcess();
		opmprc.id = prc.id
		opmprc.name = prc.name.value;
		activeOPMDiagram.addElement(opmprc);
		opmprc.addDiagram(activeOPMDiagram);
	}
	catch(e) {
		alert(e.message);
	}
}

var addState = function() {
	try {
		//Check
		if (activeSVGElement === null) {
			var msg = "Please, click on the relevant object first";
			var err = new Error(msg);
			if (!err.message) {
				err.message = msg;
			}
			throw err;
		}
		else {
			var type = activeSVGElement.getAttributeNS(null, 'id').slice(0,3);
			if (type == 'prc') {
				var msg = "Process cannot have a state";
				var err = new Error(msg);
				if (!err.message) {
					err.message = msg;
				}
				throw err;
			}
			
			//Execute this if error are caught
			//Create instance of UIState class (GUI)
			var stt = new UIState(activeUIElement);
			activeUIElement.addState(stt);
			stt.draw();
			
			//Create instance of OPMState class (Client-side Logic)
			var parent = activeOPMDiagram.getElement(activeUIElement.id);
			var opmstt = new OPMState(parent);
			opmstt.id = stt.id;
			opmstt.name = stt.name.value;
			parent.addState(opmstt);
			
		}			
	}
	catch(e) {
		alert(e.message);
	}
}


/*Source and Destination are determined according to 
 * events of the mouse on elements*/
var src = null;
var dest = null;

//Flag that the link is on/off and its type
var linkOn = {
		status: false,
		type: null,
		off: function() {
			this.status = false;
			this.type = null;
			}
}; 			
var turnLinkOn = function(type) {
	if(activeSVGElement) { deselect(); }
	linkOn.status = true;
	linkOn.type = type;
}
var addLink = function(src, dest) {
	try {
		lnkId++;
		switch(linkOn.type) {
		case 'udr':
			var opmlink = new OPMStructuralLink();
			opmlink.id = linkOn.type + lnkId;
			opmlink.setType('Unidirectional');
			if (src.id.slice(0,3) === 'stt') {
				var parent = activeOPMDiagram.getElement(src.parent.id);
				opmlink.setSource(parent.getState(src.id));
			}
			if (dest.id.slice(0,3) === 'stt') {
				var parent = activeOPMDiagram.getElement(dest.parent.id);
				opmlink.setDestination(parent.getState(dest.id))
			}
			opmlink.setSource(activeOPMDiagram.getElement(src.id));
			opmlink.setDestination(activeOPMDiagram.getElement(dest.id));
			if (opmlink.verifyLink()) {
				var lnk = new UILink(opmlink.id);
				lnk.draw(src, dest);
				activeUIDiagram.addElement(lnk);
				activeOPMDiagram.addElement(opmlink);
				opmlink.source.addLink(opmlink);
				opmlink.destination.addLink(opmlink);
				linkOn.off();
			}
			else {
				delete opmlink;
				lnkId--;
				linkOn.off();
			}
			break;
		case 'rcl':
			var opmlink = new OPMProceduralLink();
			opmlink.id = linkOn.type + lnkId;
			opmlink.setType('Result-Consumption');
			if (src.id.slice(0,3) === 'stt') {
				var parent = activeOPMDiagram.getElement(src.parent.id);
				opmlink.setSource(parent.getState(src.id));
			}
			if (dest.id.slice(0,3) === 'stt') {
				var parent = activeOPMDiagram.getElement(dest);
				opmlink.setDestination(parent.getState(dest.id));
			}
			opmlink.setSource(activeOPMDiagram.getElement(src.id));
			opmlink.setDestination(activeOPMDiagram.getElement(dest.id));
			if (opmlink.verifyLink()) {
				var lnk = new UILink(opmlink.id);
				lnk.draw(src, dest);
				activeUIDiagram.addElement(lnk);
				activeOPMDiagram.addElement(opmlink);
				opmlink.source.addLink(opmlink);
				opmlink.destination.addLink(opmlink);
				linkOn.off();
			}
			else {
				delete opmlink;
				lnkId--;
				linkOn.off();
			}
			break;
		}
	}
	catch(e) {
		alert(e.message);
	}
}


var diagramZoom = function(scale) {
	deselect();
	var diagramWidth = activeSVGDiagram.getBBox().width + 2;
	var diagramHeight = activeSVGDiagram.getBBox().height + 2;
	var scaleMatrix = activeSVGDiagram.getAttributeNS(null, 'transform').slice(7, -1).split(' ');
	for (var i = 0; i < scaleMatrix.length; i++) { scaleMatrix[i] = parseFloat(scaleMatrix[i]); }
	for (var i = 0; i < scaleMatrix.length; i++) { scaleMatrix[i] *= scale; }
	scaleMatrix[4] += (1 - scale) * diagramWidth/2;
	scaleMatrix[5] += (1 - scale) * diagramHeight/2;
	var newMatrix = "matrix(" + scaleMatrix.join(' ') + ")";
	activeSVGDiagram.setAttributeNS(null, 'transform', newMatrix);
}