/*   
 *    Web OPM: online case tool for Object-Process Methodology
 *    Copyright ɠ2012 Israel Institute of Technology - Technion
 *    The code is licensed under GNU General Public License, v2
 * 
 *    File context description:
 *    File contains classes description used for OPM
 * 
 *    Authors: Rochai Ben-Mordechai & Sameer Makladeh (The Horses)
 * */

function User(email, password) {
   this.id = randomFromTo(1, 1000);
   this.provider = null;                     //mechanism used for oauth2.0: {google, facebook, twitter}
   this.token = null;                        //used for oauth2.0
   this.email = email;
   this.firstName = null;
   this.lastName = null;
   this.password = password;
   this.models = { };
   this.lastLogin = new Date();                //timestamp
   this.loginStatus = null;                   //boolean
}

/*Working functions*/
User.prototype.getId = function() { 
   return this.id; 
}
User.prototype.getEmail = function() { 
   return this.email; 
}
User.prototype.getName = function() {
   //returns user's full name
   var x = this.firstName;
   var y = this.lastName;
   return x + " " + y;
}
User.prototype.setName = function(newFirstName, newLastName) {
   this.firstName = newFirstName;
   this.lastName = newLastName;
}
User.prototype.getModels = function() {
  //call JSON function and receives list of all Model IDs of this user.
   return this.models;
}
User.prototype.addModel = function(model) {
   //add model to the list
   this.models[model.id] = model;
}
User.prototype.getLastLogin = function() {
   return this.lastLogin;
}
User.prototype.setLastLogin = function() {
   this.lastLogin = new Date();
}
User.prototype.setToken = function(token) {
   /*Token is given to the user after she signs in via provider. 
    *Token is needed to be kep in order to sign in user automatically when she enters web-site repeatedly*/
   this.token = token;
}
User.prototype.getToken = function() {
   return this.token
}
User.prototype.setPassword = function(newPassword) {
   //called if user wants to change password
   this.password = newPassword;
}
User.prototype.getLoginStatus = function() {
   return this.loginStatus;
}
User.prototype.setProvider = function(provider) {
   this.provider = provider;
}
User.prototype.getProvider = function() {
   return this.provider;
}
/*None-Working functions*/
User.prototype.getPassword = function() {
   //called if user forgets passwords
   //TODO: send request to DB and send the letter w/ password to User
}
User.prototype.deleteModel = function(model) {
   //TODO: should this be a recursive function, or is it enough to call the model's destructor 
}
User.prototype.login = function() {
   //call FB/Google/LinkedIn/Twitter login algorithm and process via Python 
}
User.prototype.logout = function() {
   this.loginStatus = false;
}
User.prototype.objForJson = function() {
  var obj = new Object();
  obj.id = this.id;
  obj.provider = this.provider;
  obj.token = this.token;
  obj.email = this.email;
  obj.firstName = this.firstName;
  obj.lastName = this.lastName;
  obj.password = this.password;
  obj.lastLogin = this.lastLogin;
  obj.loginStatus = this.loginStatus;
  obj.models = [];
  var count = 0;
  for (var i in this.models){
      obj.models[count] = this.models[i].id;
      count = count+1;
  }
  return obj;
}




function OPMModel(creator) {                     
   this.id = randomFromTo(1, 1000);
   this.creator = creator;
   this.name = 'New Model';                         //default value
   this.type = 'System';
   this.participants = { }
   this.sd = new OPMDiagram('sd', null, 0, this.id);            //create first SD for model, with level=0
   this.diagrams = { };                           //map object with diagrams in a model
   this.lastUpdate = new Date();
   this.creationDate = new Date();
}

/*Working functions*/
OPMModel.prototype.getId = function(){ 
   return this.id;
}
OPMModel.prototype.getCreator = function() {
   return this.creator;
}
OPMModel.prototype.getName = function() {
   return this.name;     
}
OPMModel.prototype.setName = function(name) {
   this.name = name;
}
OPMModel.prototype.share = function(newUser) { 
   //share model with additional users
   this.participants[newUser.id] = newUser;
}
OPMModel.prototype.unshare = function(user) {
   //removes a specific user from the participants list
   delete this.participants[user.id];
}
OPMModel.prototype.getParticipants = function() {
   //returns a list of users with permissions to edit this model
   return this.participants;
}
OPMModel.prototype.getType = function() {
   return this.type;
}
OPMModel.prototype.setType = function(newType) {
   this.type = newType;
}
OPMModel.prototype.addDiagram = function(diagram) {
   this.diagrams[diagram.id] = diagram;
}
OPMModel.prototype.getDiagrams = function() {
   //returns list of all diagrams in model
   return this.diagrams;
}
OPMModel.prototype.removeDiagram = function(diagram) {
   //removes diagram for diagram list
   delete this.diagrams[diagram.id];
}
OPMModel.prototype.getLastUpdate = function() {
   return this.lastUpdate;
}
OPMModel.prototype.setLastUpdate = function() {
   this.lastUpdate = new Date();
}
OPMModel.prototype.getCreationDate = function() {
   return this.creationDate;
}
OPMModel.prototype.getSd = function() {
   return this.sd;
}
/*Non-working functions*/
OPMModel.prototype.load = function() {
   //need procedure for loading a model from DB
}
OPMModel.prototype.destructor = function(){
    //need procedure for deleting Model from database, including all children.
   var answer = confirm ( "You are about to Completely remove\n all Model diagrams. Are you sure you wish to continue " )
   if (answer) {
      try {
        delete this.creator.models[this.id];
        delete this;                          //FIXME: is this expression true  
      }
      catch(err) {
         txt="There was an error deleting the model.\n\n";
         txt+="Error description: " + err.message + "\n\n";
         txt+="Click OK to continue.\n\n";
         alert(txt);
      }
   }
}
OPMModel.prototype.objForJson = function() {
  var obj = new Object();
  obj.id = this.id;
  obj.creator = this.creator;
  obj.name = this.name;
  obj.type = this.type;
  obj.lastUpdate = this.lastUpdate;
  obj.creationDate = this.creationDate;
  obj.sd = this.sd.id
  obj.diagrams = [];
  obj.participants = [];
  var count=0;
  for (var i in this.diagrams){
     obj.diagrams[count] = this.diagrams[i].id;
     count = count+1;
  }
  count = 0;
  for (var i in this.participants){
    obj.participants[count] = this.participants[i].id;
    count = count+1;
  }
  return obj;
}



function OPMDiagram(id, predecessor, level, modelId) {   
   this.id = id;
   this.modelId = modelId;
   this.predecessor = predecessor;                     //diagram object of the "father", can be null
   this.successors = { };                           //map of successors
   this.elements = { };                           //map of elements that diagram contains
   this.name = 'New Diagram';                        //default value
   this.number = null;
   this.OPL = null;
   this.level = level;                            //int
}
/*Working functions*/
OPMDiagram.prototype.getId = function() {
   return this.id;
}
OPMDiagram.prototype.getName = function() {
   return this.name;
}
OPMDiagram.prototype.setName = function(name) {
   this.name = name;
}
OPMDiagram.prototype.getNumber = function() {
   return this.number;
}
OPMDiagram.prototype.setNumber = function(number) {
   this.number = number;
}
OPMDiagram.prototype.addElement = function(element) {
   this.elements[element.id] = element;
}
OPMDiagram.prototype.getElement = function(id) {
   return this.elements[id];
}
OPMDiagram.prototype.getElements = function() {
   return this.elements;
}
OPMDiagram.prototype.removeElement = function(element) {
   delete this.elements[element.id]
}
OPMDiagram.prototype.getPredecessor = function() {
    return this.predecessor;
}
OPMDiagram.prototype.getSuccessors = function() {
    return this.successors;
}
OPMDiagram.prototype.addSuccessor = function(diagram) {
    //receives OPMDiagram object to add to the map of successor diagrams
    this.successors[diagram.id] = diagram;
}
OPMDiagram.prototype.removeSuccessor = function(diagram) {
   delete this.successors[diagram.id];
}
OPMDiagram.prototype.getLevel = function() {
    return this.level;
}
OPMDiagram.prototype.getOPL = function() {
   return this.OPL;
}
OPMDiagram.prototype.getModelId = function() {
	return this.modelId;
}
/*Non-working function*/
OPMDiagram.prototype.reLevel = function(levels) {          
   //if level-up - enter positive int, otherwise negative
    //recursively re-assigns levels to entire diagrams (nodes) in the tree.
   try   {
      if (this.successors === null) {
         return;
      }
      this.level = this.level - levels;
      for (var i in this.successors) {
         this.successors.reLevel(levels);
      }
    }
   catch(err) {
      txt="There was an error deleting the model.\n\n";
      txt+="Error description: " + err.message + "\n\n";
      txt+="Click OK to continue.\n\n";
      alert(txt);
   }
}
OPMDiagram.prototype.print = function() {
   //need implementation of print procedure.
   //including XML function
}      
OPMDiagram.prototype.writeOPL = function(text) {
   //TODO: need to think of a more clever way to add text to the OPL.
   //changes to OPL are done per element creation. therefore, at each creation of each type of element
   //we'll need an OPL "generator".
}   
OPMDiagram.prototype.destructor = function() {
   //need procedure for deleting diagram from database, including all children.
   if (answer) {
      try {  
         delete this;
      }
      catch(err) {
         txt="There was an error deleting the model.\n\n";
         txt+="Error description: " + err.message + "\n\n";
         txt+="Click OK to continue.\n\n";
         alert(txt);
      }
   }
   //call destructor function of each element in diagram
}
OPMDiagram.prototype.objForJson = function() {
  var obj = new Object();
  obj.id = this.id;
  obj.modelId = this.modelId;
  obj.predecessor = this.predecessor.id;
  obj.name = this.name;
  obj.number = this.number
  obj.OPL = this.OPL;
  obj.level = this.level;
  obj.elements = [];  
  var count=0;
  for (var i in this.elements){
     obj.elements[count] = this.elements[i].id;
     count = count+1;
  }
  obj.successors = [];
  count=0;
  for (var i in this.successors){
     obj.successors[count] = this.successors[i].id;
     count = count+1;
  }
  return obj;
}




function OPMElement(id) {
    this.id = id;
    this.diagrams = { };                          //may be part of a few diagrams, so using map
	this.description = null;
}
OPMElement.prototype.getId = function() {
    return this.id;
}
OPMElement.prototype.getDescription = function() {
    return this.description;  
}
OPMElement.prototype.setDescription = function(description) {
    this.description = description;  
}
OPMElement.prototype.getDiagrams = function() {
    return this.diagrams;
}
OPMElement.prototype.addDiagram = function(diagram) {
    //receives diagram object
    this.diagrams[diagram.id] = diagram;
}
OPMElement.prototype.removeDiagram = function(diagram) {
   //removes diagram from the element's list of diagrams
    delete this.diagrams[diagram.id];
}




OPMEntity.prototype = new OPMElement();       //inheriting from OPMElement
function OPMEntity() {
   this.name = null;
//   this.inLinks = { };                     //map - keys are source of links
//   this.outLinks = { };                  //map - keys are destination of links
}
/*Working functions*/
OPMEntity.prototype.getName = function() {
   return this.name;
}
OPMEntity.prototype.setName = function(name) {
   this.name = name;
}

OPMEntity.prototype.getInLinks = function() {
   return this.inLinks;
}
OPMEntity.prototype.getOutLinks = function() {
   return this.outLinks;
}
OPMEntity.prototype.addLink = function(link) {
        if (link.source.id === this.id) {
                this.outLinks[link.destination.id] = link.destination;
        }
        else {
                this.inLinks[link.source.id] = link.source;
        }
}
OPMEntity.prototype.removeLink = function(link) {
//remove link from source and destination
        try {
                if(link.source.id === this.id){
                        delete this.outLinks[link.destination.id].destination.inLinks[link.source.id];
                        delete this.outLinks[link.destination.id];
                }
                else if(link.destination.id === this.id){
                        delete this.inLinks[link.source.id].source.outLinks[link.destination.id];
                        delete this.inLinks[link.source.id];
                }
    }
    catch (err) {
        txt="There was an error deleting the link.\n\n";
        txt+="Error description: " + err.message + "\n\n";
        txt+="Click OK to continue.\n\n";
        alert(txt);
    }
}

/*Non-working functions*/
OPMEntity.prototype.destructor = function() {
      this.removeLink(this.inLinks);
      this.removeLink(this.outLinks);
      delete this;
}
  


OPMThing.prototype = new OPMEntity();          // inheriting from OPMEntity 
function OPMThing()   {
   this.essence = "Informatical";
    this.affiliation = "Systemic";            //default value
    this.scope = "Public";
    this.unfoldDiag = { };                  //diagram instance which is created by unfolding of this object
    this.inzoomDiag = { };                  //diagram instance which is created by inzooming of this object
    this.things = { };
    this.url = null;
}
/*Working function*/
OPMThing.prototype.getEssence = function() {
    return this.essence;
}
OPMThing.prototype.setEssence = function(ess) {
    this.essence = ess;
}
OPMThing.prototype.getAffiliation = function() {
    return this.affiliation;
}
OPMThing.prototype.setAffiliation = function(aff) {
    this.affiliation = aff;
}
OPMThing.prototype.getScope = function() {
    return this.scope;
}
OPMThing.prototype.setScope = function(scope) {
    this.scope = scope;
}
OPMThing.prototype.addThing = function(thing) {
    this.things[thing.id] = thing;   
}
OPMThing.prototype.removeThing = function(thing) {
    var currId = thing.id;                                     //once destructor is used, ID is no longer available
    this.things[thing.id].destructor();
    delete this.things[currId];
    delete currId;
}
OPMThing.prototype.getThing = function() {
   return this.things;
}
OPMThing.prototype.getURL = function() {
   return this.url;
}
OPMThing.prototype.setURL = function(newURL) {
   this.url = newURL;
}
OPMThing.prototype.getUnfoldDiag = function() {
   return this.unfoldDiag;
}
OPMThing.prototype.getInzoomDiag = function() {
   return this.inzoomDiag;
}
/*Non-working functions*/
OPMThing.prototype.unfolding = function(newDiagId, fatherDiag) {
   //unfold object/process
   this.unfoldDiag = new OPMDiagram(newDiagId, fatherDiag, fatherDiag.level + 1);
   this.unfoldDiag.elements[this.id] = this;                           //add current element to new unfolded diagram
   return this.unfoldDiag;
}
OPMThing.prototype.inzooming = function(newDiagId, fatherDiag) {
    //inzoom object/process, returns new Diagram object
    this.inzoomDiag = new OPMDiagram(newDiagId, fatherDiag, fatherDiag.level + 1);
    this.inzoomDiag.elements[this.id] = this;                              //add current element to new inzoomed diagram
    return this.inzoomDiag;
}



OPMObject.prototype = new OPMThing();
function OPMObject() {
   this.classType = 'OPMObject';
  this.states = { };
   this.initValue = null;
   this.type = "Compound Object";
   this.inLinks = { };
   this.outLinks = { };
}
/*Working function*/
OPMObject.prototype.getInitValue = function() {
   return this.initValue
}
OPMObject.prototype.setInitValue = function(newInitValue) {
   this.initValue = newInitValue;
}
OPMObject.prototype.getType = function() {
   return this.type;
}
OPMObject.prototype.setType = function(newType) {
   this.type = newType;
}
OPMObject.prototype.setInitValue = function(newInitValue) {
   this.initValue = newInitValue;
}
OPMObject.prototype.addState = function(state) {
   this.states[state.id] = state; 
}
OPMObject.prototype.removeState = function(state) {
   delete this.states[state.id];
}
OPMObject.prototype.getStates = function() {
   return this.states;
}
OPMObject.prototype.getState = function(id) {
   return this.states[id];
}
OPMObject.prototype.objForJson = function(){
	 var obj = new Object();  
	obj.classType = this.classType;
    obj.initValue = this.initValue;
     obj.type = this.type;
     obj.essence = this.essence;
    obj.affiliation = this.affiliation; 
    obj.scope = this.scope;
    obj.url = this.url;
     obj.name = this.name;
    obj.id = this.id;
    obj.description = this.description;
    obj.states = [];
    var count = 0;
    for (var i in this.states){
    	obj.states[count] = this.states[i].id;
     	count = count+1;
    }
	obj.inLinks = [];
    count=0;
    for (var i in this.inLinks){
    	obj.inLinks[count] = this.inLinks[i].source.id;
     	count = count+1;
    }
    obj.outLinks = [];
    count = 0;
    for (var i in this.outLinks){
    	obj.outLinks[count] = this.outLinks[i].destination.id;
     	count = count+1;
    }
    obj.unfoldDiag = [];
    count = 0;
    for (var i in this.unfoldDiag){
    	obj.unfoldDiag[count] = this.unfoldDiag[i].id;
     	count = count+1;
    }
    obj.inzoomDiag = [];
    count = 0;
    for (var i in this.inzoomDiag){
    	obj.inzoomDiag[count] = this.inzoomDiag[i].id;
     	count = count+1;
    } 
    obj.things = [];
    count = 0;
    for (var i in this.things){
    	obj.things[count] = this.things[i].id;
     	count = count+1;
    }
    this.diagrams = [];
    count = 0;
    for (var i in this.diagrams){
    	obj.diagrams[count] = this.diagrams[i].id;
     	count = count+1;
    }
    return obj;
}


OPMProcess.prototype = new OPMThing();
function OPMProcess() {
  this.classType = 'OPMProcess';
  this.inLinks = { };
   this.outLinks = { };
   this.minActivationTime = null;
   this.maxActivationTime = null;
}
/*Working functions*/
OPMProcess.prototype.getMinActivationTime = function() {
    return this.minActivationTime;
}
OPMProcess.prototype.setMinActivationTime = function(minTime) {
    this.minActivationTime = minTime;
}
OPMProcess.prototype.getMaxActivationTime = function() {
    return this.maxActivationTime;
}
OPMProcess.prototype.setMaxActivationTime = function(maxTime) {
    this.maxActivationTime = maxTime;
}
OPMProcess.prototype.objForJson = function(){
    var obj = new Object();
    obj.classType = this.classType;
     obj.minActivationTime = this.minActivationTime;
     obj.maxActivationTime = this.maxActivationTime;
	obj.essence = this.essence;
    obj.affiliation = this.affiliation; 
    obj.scope = this.scope;
    obj.description = this.description;
    obj.url = this.url;
     obj.name = this.name;
    obj.id = this.id;
    obj.inLinks = [];
    var count=0;
    for (var i in this.inLinks){
    	obj.inLinks[count] = this.inLinks[i].source.id;
     	count = count+1;
    }
    obj.outLinks = [];
    count = 0;
    for (var i in this.outLinks){
    	obj.outLinks[count] = this.outLinks[i].destination.id;
     	count = count+1;
    }
    obj.unfoldDiag = [];
    count = 0;
    for (var i in this.unfoldDiag){
    	obj.unfoldDiag[count] = this.unfoldDiag[i].id;
     	count = count+1;
    }
    obj.inzoomDiag = [];
    count = 0;
    for (var i in this.inzoomDiag){
    	obj.inzoomDiag[count] = this.inzoomDiag[i].id;
     	count = count+1;
    } 
    obj.things = [];
    count = 0;
    for (var i in this.things){
    	obj.things[count] = this.things[i].id;
     	count = count+1;
    }
    
    this.diagrams = [];
    count = 0;
    for (var i in this.diagrams){
    	obj.diagrams[count] = this.diagrams[i].id;
     	count = count+1;
    }
    return obj;
}



OPMState.prototype = new OPMEntity();
function OPMState(parent) {                           //parent is an object which contains the state
  this.classType = 'OPMState';  
  this.type = null;                              //final, default, initial
    this.parent = parent;                           //of type OPMObject
    this.minActivationTime = null;
    this.maxActivationTime = null;
    this.inLinks = { };
    this.outLinks = { };
}

/*Working functions*/
OPMState.prototype.getParent = function() {
   return this.parent;
}
OPMState.prototype.getType = function() {
    return this.type;
}  
OPMState.prototype.setType = function(type) {
    this.type = type;
}
OPMState.prototype.getMinActivationTime = function() {
    return this.minActivationTime;
}
OPMState.prototype.setMinActivationTime = function(minTime) {
    this.minActivationTime = minTime;
}
OPMState.prototype.getMaxActivationTime = function() {
    return this.maxActivationTime;
}
OPMState.prototype.setMaxActivationTime = function(maxTime) {
    this.maxActivationTime = maxTime;
}
/*Non-working functions*/
OPMEntity.prototype.destructor = function() {//overloaded to delete State reference in Parent Object
    this.removeLink(this.inLinks);
    this.removeLink(this.outLinks);
    delete this.parent.states[this.id];
    delete this;
}
OPMState.prototype.objForJson = function(){  
  this.classType = 'OPMProcess';
  this.inLinks = { };
   this.outLinks = { };
   this.minActivationTime = null;
   this.maxActivationTime = null;
   this.name = null;
  this.id = id;
  this.diagrams = { };
  this.description = null;
}


OPMLink.prototype = new OPMElement();
function OPMLink(src, dest, category, type) {
   this.source = src;
   this.destination = dest;
    this.category = category;                     //categories are strings, two values: "Structural" and "Procedural"
    this.type = type;                           //types are strings, some values: "Instrument", "Agent" etc.
}
/*Working function*/
OPMLink.prototype.getDestination = function() {
    return this.destination;
}
OPMLink.prototype.setDestination = function(dest) {
    this.destination = dest;
}
OPMLink.prototype.getSource = function() {
    return this.source;
} 
OPMLink.prototype.setSource = function(src) {
    this.source = src;
}
OPMLink.prototype.getType = function() {
    return this.type;
}
OPMLink.prototype.setType = function(newType) {
   this.type = newType;
}
OPMLink.prototype.getCategory = function() {
    return this.category;
}
OPMLink.prototype.setCategory = function(newCategory) {
   this.category = newCategory;
}



OPMProceduralLink.prototype = new OPMLink();
function OPMProceduralLink() {               //input source and destination Objects
   this.category = 'Procedural';
   this.xor = { };
   this.or = { }; 
}
/*Working functions*/
OPMProceduralLink.prototype.opmRulesCheck = function(src_chk,dest_chk){
  switch (src_chk.classType) {
  case "OPMObject":
      if (dest_chk.classType === "OPMProcess") {
          if (this.type === "Invocation" || this.type === "Exception") { return false; }
          else { return true; }
      }
      else if (dest_chk.classType === "OPMObject" || dest_chk.classType === "OPMState") { return false; }
  case "OPMProcess":
      if (dest_chk.classType === "OPMObject" || dest_chk.classType ==="OPMState") {
          if (this.type === "Result-Consumption" || this.type === "Effect") { return true; }
          else { return false; } 
      }
      else if (dest_chk.classType === "OPMProcess") {
          if (this.type === "Invocation" || this.type === "Exception") { return true; }
          else { return false; }
      }
  case "OPMState":
      if (dest_chk.classType === "OPMProcess") {
          if (this.type === "Invocation" || this.type === "Exception") { return false; }
          else { return true; }
      }
      else if (dest_chk.classType === "OPMObject" || dest_chk.classType === "OPMState") { return false; }
  }
}
OPMProceduralLink.prototype.verifyLink = function() {
        //check for existing type of procedural link between two entities
    if (typeof this.source.outLinks[this.destination.id] === 'undefined' || typeof this.destination.inLinks[this.source.id] === 'undefined') {  //check if two elements are linked - if not, perform link check according to basic opm rules
                var x = (this.opmRulesCheck(this.source,this.destination));
                return x;
    }
   
    else if (this.source.outLinks[ this.destination.id ].category ===  this.destination.inLinks[ this.source.id ].category) {
        alert("Cannot connect two Objects with more than one " + this.type + " Link");
                return false;
    }
    //rest of Logic rules using Switch, by source type. many more rules are to be added
        this.opmRulesCheck(this.source, this.destination);
}
OPMProceduralLink.prototype.addXor = function(link) {
    this.xor[link.id] = link;
}
OPMProceduralLink.prototype.removeXor = function(link) {
    delete this.xor[link.id];
}
OPMProceduralLink.prototype.getXor = function() {
   return this.xor;
}
OPMProceduralLink.prototype.addOr = function(link) {
    this.or[link.id] = link;
}
OPMProceduralLink.prototype.removeOr = function(link) {
    delete this.or[link.id];
}
OPMProceduralLink.prototype.getOr = function() {
   return this.or;
}
/*Non-working functions*/
OPMProceduralLink.prototype.destructor = function() {
    delete this.source.inLinks[this.id];
    delete this.destination.outLinks[this.id];
    delete this;
}
OPMProceduralLink.prototype.objForJson = function(){
	var obj = new Object();
	obj.id = this.id;
    obj.description = this.description;
    obj.source = this.source.id;
    obj.destination = this.destination.id;
    obj.category = this.category;
    obj.type = this.type;
    obj.diagrams = [];
	var count=0;
    for (var i in this.diagrams){
    	obj.diagrams[count] = this.diagrams[i].id;
     	count = count+1;
    }
	obj.xor = [];
	count=0;
    for (var i in this.xor){
    	obj.xor[count] = this.xor[i].id;
     	count = count+1;
    }
    obj.or = [];
	count=0;
    for (var i in this.or){
    	obj.or[count] = this.or[i].id;
     	count = count+1;
    }
    return obj;
}

OPMStructuralLink.prototype = new OPMLink();
function OPMStructuralLink() {
    this.category = 'Structural';
    this.participationConst = null;
    this.participationVal = null;
    this.cardinality = 1;
    this.tag = null;                                                   //description shown on link itself - only for uni/bi-directional relations
}  
/*Working function*/
OPMStructuralLink.prototype.opmRulesCheck = function(src_chk,dest_chk){
  switch (src_chk.classType) {                                                      //rest of Logic rules using Switch, by source type.
  case "OPMObject":
      if (dest_chk.classType === "OPMProcess") {
          if (this.type === "Exhibition") { return true; }
      else { return false; } 
      }
      if (dest_chk.classType === "OPMObject") { return true; }
  case "OPMProcess":
      if (dest_chk.classType === "OPMObject") {
          if (this.type === "Exhibition") { return true; }
      else { return false; }
      }
      if (dest_chk.classType === "OPMProcess") { return true; }
  case "OPMState": return false;
  }
}
OPMStructuralLink.prototype.verifyLink = function() {
  if (typeof this.source.outLinks[this.destination.id] === 'undefined' || typeof this.destination.inLinks[this.source.id] === 'undefined') {  //check if two elements are linked
                var x = (this.opmRulesCheck(this.source,this.destination));
                return x;
        }

  else if (this.source.outLinks[this.destination.id].category ===  this.destination.inLinks[this.destination.id].category) {         //check for existing type of structural link between two entities
        if (this.type === "Unidirectional" || this.type === "Bidirectional") { return true; }
        else {
                alert("Cannot connect two Objects with more than one " + this.type + " Link");
                return false;
        }
    }
        
        this.opmRulesCheck(this.source,this.destination);
        
}
OPMStructuralLink.prototype.getCardinality = function() {
    return this.cardinality;
}
OPMStructuralLink.prototype.setCardinality = function(card) {
    this.cardinality = card;
}
OPMStructuralLink.prototype.getTag = function() {
    return this.tag;
}
OPMStructuralLink.prototype.setTag = function(tag) {
    this.tag = tag;
}
OPMStructuralLink.prototype.getParticipationConst = function() {
    return this.participationConst;
}

OPMStructuralLink.prototype.setParticipationConst = function(partConst) {
    this.participationConst = partConst;
}

OPMStructuralLink.prototype.getParticipationVal = function() {
    return this.participationVal;
}

OPMStructuralLink.prototype.setParticipationVal = function(val) {
    this.participationVal = val;
}
/*Non-working function*/
OPMStructuralLink.prototype.destructor = function() {
    delete this.source.inLinks[this.id];
    delete this.destination.outLinks[this.id];
    delete this;
}


