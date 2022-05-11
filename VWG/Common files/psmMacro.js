/**
 * Copyright (C) 2020 Software AG, Darmstadt, Germany and/or Software AG USA Inc., Reston, VA, USA,
 * and/or its subsidiaries and/or its affiliates and/or their licensors.
 *
 * Use, reproduction, transfer, publication or disclosure is prohibited
 * except as specifically provided for in your License Agreement with Software AG.
 *
 * Version: 10.0.12.0.1470486
 */

//////////////////////////////////////////////////////////////////
//
// Funktionsbibliothek zum Bearbeiten von Process Support units in Makros
//
//////////////////////////////////////////////////////////////////
var oStopWatch;// = new stopWatch("Macro common");
var g_DBLanguages = getDBLanguages();

var unitSymbolNormal = Constants.ST_PROCESS_SUPPORT_UNIT;
var unitSymbolHidden = Constants.ST_PROCESS_SUPPORT_UNIT_1;

// Farben
var colorStartToBePhasedIn = java.awt.Color(1.0,1.0,0.75);
var colorToBePhasedIn = java.awt.Color.YELLOW;
var colorPhasedIn = java.awt.Color.GREEN;
var colorStartToBePhasedOut = java.awt.Color(0,0.4,0.18);
var colorToBePhasedOut = java.awt.Color.ORANGE;
var colorPhasedOut = java.awt.Color.RED;
var colorNoStatus = java.awt.Color.WHITE;
var colorBorderToBe = java.awt.Color.BLUE;
var colorBorderNormal = java.awt.Color.BLACK;

var colorNoDelete = java.awt.Color.BLACK;

var borderWidthToBe = 5;
var borderWidthNormal = 3;

var borderStyleNormal = Constants.PEN_PS_SOLID;
var borderStyleDashed = Constants.PEN_PS_DASH; 

// Konfig Labels:

var fillColor = new java.awt.Color(0.9,0.9,0.9);
var fillColorFreeze = new java.awt.Color(1,0,0);

var CXN_BELONGS2PROCUNIT    = Constants.CT_BELONGS_TO_PROC_SUPPORT_UNIT; 	//eingehend von ast zu psu =202        
var CXN_SUPPORTS            = Constants.CT_CAN_SUPP_1; 						// ausgehend von psu zu funct =221                         
var CXN_CAN_BE_LOCATED_AT   = Constants.CT_CAN_BE_LOC_AT; 					//ausgehend von psu zu loc =165
var CXN_CAN_BE_USER         = Constants.CT_CAN_BE_USER; 					// eingehend von OE zu psu =230  
var bFinalSave = true;
var bEndUndo = true;
var aProcessSupportStates = new Array(Constants.AVT_START_PLANNING_PHASE_IN,Constants.AVT_TO_BE_PHASED_IN,Constants.AVT_PHASED_IN,
                        Constants.AVT_START_PLANNING_PHASE_OUT,Constants.AVT_TO_BE_PHASED_OUT,Constants.AVT_PHASED_OUT);

function boolHolder(bVal) {    // BLUE-4768
    this.value = bVal;
    this.getValue = function() { return this.value; }
    this.setValue = function(bVal) { this.value = bVal; }
}

function startFkt(p_oFkt, p_oModel){ 
    var isOpenedByMacro = new boolHolder(false);    // BLUE-4768

    var bOptionCreateImplicitConnections = Designer.getOptionCreateImplicitConnections();
    var bNotOpen = false; 
    try {
        var bIsOpen = isOpenAndWritable(p_oModel, isOpenedByMacro);
        if (bIsOpen){   
            var selectedOccsInModel = Designer.getSelection(p_oModel);            
            Designer.setOptionCreateImplicitConnections(true);
            Designer.setHideAssignmentSymbol(p_oModel,true);
            Designer.setGridActive(p_oModel,false);
            Designer.setDrawBlocked(p_oModel,true);
            Designer.beginUndoCommand(p_oModel); 
            getCurrentSymbolScaleFactor(p_oModel);
            setGlobalLayoutDimVars(iCurrentSymbolScaleFactor);
            p_oFkt();
            Designer.setSelection(p_oModel,selectedOccsInModel);
            if (bEndUndo) Designer.endUndoCommand(p_oModel);
        } else {
            Context.MsgBox(getString("MODEL_NOT_READABLE"));
        }
    } catch (e if e instanceof PsmError) {
        var ex = e
        Context.MsgBox(ex.message);
        Designer.endUndoCommand(p_oModel);
        bEndUndo = false;
        Designer.undo(p_oModel);
    } catch (e){
        var ex = e
        Context.MsgBox(getString("UNKNOWN_ERROR") +ex+" (" + ex.lineNumber+")" );
        Designer.endUndoCommand(p_oModel);
        bEndUndo = false;
        Designer.undo(p_oModel);
    } 
    if (bIsOpen) {
        Designer.setOptionCreateImplicitConnections(bOptionCreateImplicitConnections);
        Designer.setReadonlyFlag(p_oModel, true);
        setModelManipulation(p_oModel,true);
        Designer.clearUndoStack(p_oModel); 
        Designer.save(p_oModel);

        /*if (bFinalSave) Designer.save(p_oModel)
        else if (!bSilent) {
            Designer.clearCache();
            Context.MsgBox("clearCache");
        }*/ 
    }    
    Designer.setDrawBlocked(p_oModel,false);

    if (isOpenedByMacro.getValue()) 
        Designer.closeModel(p_oModel);		// BLUE-7972
}

function getCurrentSymbolScaleFactor(p_oModel){    	
	var oldViewAttr = Designer.getAttribute(p_oModel, Constants.AT_LAST_GENERATED_VIEW_PSM, null);
	iCurrentSymbolScaleFactor = 1;
	if (oldViewAttr != null) {
	    var oldView = oldViewAttr.getValue();
	    var oldViewArray = oldView.split(",");
	    if (oldViewArray[2]) iCurrentSymbolScaleFactor = oldViewArray[2];
    }    
}	
function isOpenAndWritable(p_oModel, p_isOpenedByMacro) {
    p_isOpenedByMacro.setValue(false);
    if (!Designer.isOpen(p_oModel)) {
        Designer.openModel(p_oModel, false/*readOnly*/, false/*visible*/, true/*silent*/);  
        p_isOpenedByMacro.setValue(true);
    }
    // BLUE-4766 Obsolete 'save()' removed
    Designer.setReadonlyFlag(p_oModel, false);
    return !Designer.isReadonly(p_oModel);
}
function writeDateAttribute(p_oModel,p_oCxnDef,newAttribute,attributeType){
    try {        
        var newDateFmt = new java.text.SimpleDateFormat("MM/dd/yyyy hh:mm:ss z");   // BLUE-18196
        if (newAttribute != "") {
            var newDateString = newAttribute + " 00:00:00 GMT";
            var newDate = newDateFmt.parse(newDateString);
            Designer.setAttribute(p_oModel, p_oCxnDef, attributeType, newDate, null);
        }
        else {
            Designer.deleteAttribute(p_oModel, p_oCxnDef, attributeType, null);
        }
    }
    catch (e) {
        //ARHI wenn hier ein Fehler passiert ist dieser auch auszuwerten 
    }
}
function CheckAndWriteDate(p_oModel,p_oCxnDef,p_oObj,p_oOldDate,p_oNewDate,p_iAttrType,p_oHistoryHelper){
    if (p_oOldDate!=p_oNewDate) {
        writeDateAttribute(p_oModel,p_oCxnDef,p_oNewDate,p_iAttrType);
        p_oHistoryHelper.addChangedDate(p_oObj, p_iAttrType, p_oNewDate);
    }
}
function CheckAndWriteState(p_oModel,p_oCxnDef,p_oObj,p_oOldState,p_oNewState,p_iAttrType,p_oHistoryHelper){
    if (p_oOldState!=p_oNewState) {
        Designer.setAttribute(p_oModel, p_oCxnDef, p_iAttrType, parseInt(p_oNewState), null);
        p_oHistoryHelper.addChangedState(p_oObj, p_iAttrType, p_oNewState);
    }  
}
function CheckAndWriteBoolean(p_oModel,p_oCxnDef,p_oObj,p_bOldValue,p_bNewValue,p_iAttrType,p_oHistoryHelper){
    if (p_bOldValue!=p_bNewValue) {        
      var bAttrValue = (p_bNewValue == "True");
      Designer.setAttribute(p_oModel, p_oCxnDef, p_iAttrType, bAttrValue, null);
      p_oHistoryHelper.addChangedToBe(p_oObj, p_iAttrType, bAttrValue);
    }  
}
function writeAttributes(p_oModel,p_oCxnDef,p_oObj,newAttributeArray,p_oHistoryHelper) {
      var aOldValues = getCxnAttrValues(p_oCxnDef)
	  CheckAndWriteDate(p_oModel,p_oCxnDef,p_oObj,aOldValues[0],newAttributeArray[0],Constants.AT_START_PLAN_PHASE_IN, p_oHistoryHelper);
	  CheckAndWriteDate(p_oModel,p_oCxnDef,p_oObj,aOldValues[1],newAttributeArray[1],Constants.AT_PHASE_IN_PLAN, p_oHistoryHelper);
	  CheckAndWriteDate(p_oModel,p_oCxnDef,p_oObj,aOldValues[2],newAttributeArray[2],Constants.AT_PHASE_IN_AS_IS, p_oHistoryHelper);
	  CheckAndWriteDate(p_oModel,p_oCxnDef,p_oObj,aOldValues[3],newAttributeArray[3],Constants.AT_START_PLAN_PHASE_OUT, p_oHistoryHelper);
	  CheckAndWriteDate(p_oModel,p_oCxnDef,p_oObj,aOldValues[4],newAttributeArray[4],Constants.AT_PHASE_OUT_PLAN, p_oHistoryHelper);
	  CheckAndWriteDate(p_oModel,p_oCxnDef,p_oObj,aOldValues[5],newAttributeArray[5],Constants.AT_PHASE_OUT_AS_IS, p_oHistoryHelper);    
 
      //setAttrValue_ComboBox(cxnDef, Constants.AT_PROC_SUPPORT_STATUS, newAttributeArray[6]);   
      checkProcessSupportStatus(p_oModel, p_oCxnDef, newAttributeArray);
      CheckAndWriteState(p_oModel,p_oCxnDef,p_oObj,aOldValues[6],newAttributeArray[6],Constants.AT_PROC_SUPPORT_STATUS,p_oHistoryHelper);
      if (newAttributeArray[7] != null) {
        Designer.setAttribute(p_oModel, p_oCxnDef, Constants.AT_DESC, newAttributeArray[7], null);   
      }
      CheckAndWriteBoolean(p_oModel,p_oCxnDef,p_oObj,aOldValues[8],newAttributeArray[8],Constants.AT_TO_BE,p_oHistoryHelper);
}

function getCxnAttrValues(p_oCxnDef){    
    var oAttributeArray = new Array();
    var oAttrValueHelper = new attrValueHelper();
    oAttributeArray[0] = oAttrValueHelper.getDateValue(p_oCxnDef,Constants.AT_START_PLAN_PHASE_IN);
    oAttributeArray[1] = oAttrValueHelper.getDateValue(p_oCxnDef,Constants.AT_PHASE_IN_PLAN);
    oAttributeArray[2] = oAttrValueHelper.getDateValue(p_oCxnDef,Constants.AT_PHASE_IN_AS_IS);
    oAttributeArray[3] = oAttrValueHelper.getDateValue(p_oCxnDef,Constants.AT_START_PLAN_PHASE_OUT);
    oAttributeArray[4] = oAttrValueHelper.getDateValue(p_oCxnDef,Constants.AT_PHASE_OUT_PLAN);
    oAttributeArray[5] = oAttrValueHelper.getDateValue(p_oCxnDef,Constants.AT_PHASE_OUT_AS_IS);
    if (Designer.getAttribute(p_oCxnDef, Constants.AT_PROC_SUPPORT_STATUS, null)!=null){
        oAttributeArray[6] = Designer.getAttribute(p_oCxnDef, Constants.AT_PROC_SUPPORT_STATUS, null).getValue();
    }    
    oAttributeArray[7] = oAttrValueHelper.getTxtValue(p_oCxnDef,Constants.AT_DESC);
    oAttributeArray[8] = oAttrValueHelper.getBoolValue(p_oCxnDef,Constants.AT_TO_BE);
    return oAttributeArray;
}
function attrValueHelper(){    
    this.oSDF = new java.text.SimpleDateFormat("MM/dd/yyyy");   // BLUE-18196
    this.oFieldPosition = new java.text.FieldPosition(1);
    
    this.getDateValue = function(p_oDef,p_iAttrType){
        var oSb = new java.lang.StringBuffer();
        var oAttr = Designer.getAttribute(p_oDef, p_iAttrType, null);                      
        if (oAttr != null) {
           return this.oSDF.format(oAttr.getValue(), oSb, this.oFieldPosition);
        } else {
           return "";
        }
    } 
    this.getTxtValue = function(p_oDef,p_iAttrType){  
        var oAttr = Designer.getAttribute(p_oDef, p_iAttrType, null);             
        if (oAttr != null) {
            return oAttr.getValue();
        }
        else {
            return ""
        }
    }
    this.getBoolValue = function(p_oDef,p_iAttrType){ 
        var oAttr = Designer.getAttribute(p_oDef, p_iAttrType, null);                   
        if (oAttr != null) {
            if (oAttr.getValue()==true) return "True"
        }        
        return "False";
    }
}
///////////////////////////////////////////////////////
// Hilfsfunktionen

function getLabelATV(p_attrValueTypeNum) {
    g_method = Context.getArisMethod();
    return g_method.AttrValueType(p_attrValueTypeNum)
}

function checkProcessSupportStatus(p_oModel, cxnDef, attributeArray) {
    var valueToChangeTo = 0;
    var bFoundState = attributeArray[6] == null;
    //Designer.save(cxnDef);
    for (var i=0; i<aProcessSupportStates.length; i++){
        if (bFoundState && attributeArray[i]!=0){
            valueToChangeTo = aProcessSupportStates[i]
        }
        if (attributeArray[6]==aProcessSupportStates[i]){
            bFoundState = true;
        }
    }
    if (valueToChangeTo != 0) {
        attributeArray[6] = valueToChangeTo;
        //Designer.setAttribute(p_oModel, cxnDef, Constants.AT_PROC_SUPPORT_STATUS, valueToChangeTo, null);    
    }
}

//ARHI Funktion gibt es auch in vielen andern Makros
function SortByPosX(aObj, bObj){
    var x = Designer.getPosition(Designer.getModel(aObj), aObj).getX();
    var y = Designer.getPosition(Designer.getModel(bObj), bObj).getX();        

    return x-y;
}

function SortByPosY(aObj, bObj){
    var x = Designer.getPosition(Designer.getModel(aObj), aObj).getY();
    var y = Designer.getPosition(Designer.getModel(bObj), bObj).getY();        

    return x-y;
}

function SortByName(aObj, bObj){
    var oAttr1 = Designer.getAttribute(Designer.getDefinition(aObj), Constants.AT_NAME, null);
    if (oAttr1 == null) return -1;   
    var oAttr2 = Designer.getAttribute(Designer.getDefinition(bObj), Constants.AT_NAME, null);   
    if (oAttr2 == null) return 1;   
    var x = oAttr1.getValue();
    var y = oAttr2.getValue();
    return x.compareToIgnoreCase(y);    
}

//ARHI Auslesen der Zuordnungen aus dem vom Report übergebenen String

function readZuordnungenFromString(p_sZuordnungen,p_oAstArray,p_oAttributeHashmap){        
   var zuordnungen = p_sZuordnungen.split("##");   
   if (zuordnungen != "") {
       for (var i=0; i<zuordnungen.length; i++) {
          if (zuordnungen[i]!="") {
             var einzelneZuordnung = zuordnungen[i].split("::"); // GUID :: Attribute
             var astObj = Designer.getObjDefByGUID(database, einzelneZuordnung[0]);
             p_oAstArray.push(astObj);
             var attribute = einzelneZuordnung[1].split(";;");
             p_oAttributeHashmap.put(astObj, attribute);
          }  
       }
   }
}
//ARHI New Common Classes
function psmAssignedAllocationHelper(p_oModel,p_iModelView,p_oAnalysisDate){
    this.oModel = p_oModel; 
    this.isToBe = false;   
    this.procSupportStatus = null;      
    this.iModelView = p_iModelView;
    this.oAnalysisDate = p_oAnalysisDate;
    this.startPlanPhaseIn = null;    
    this.PhaseInPlan = null;
    this.PhaseIn = null;
    this.startPlanPhaseOut = null;
    this.PhaseOutPlan = null;
    this.PhaseOut = null;   
    // Kantenattribute auslesen    
    this.getPSMDate = function(p_oCxnDef,o_iTypeNum){
        var attr = Designer.getAttribute(p_oCxnDef, o_iTypeNum, null);
        if (attr != null) return attr.getValue();
        return null;
    }
    this.setAssignmentDates = function(p_oCxnDef){   
        this.startPlanPhaseIn = this.getPSMDate(p_oCxnDef,Constants.AT_START_PLAN_PHASE_IN);  
        this.PhaseInPlan = this.getPSMDate(p_oCxnDef,Constants.AT_PHASE_IN_PLAN);
        this.PhaseIn = this.getPSMDate(p_oCxnDef,Constants.AT_PHASE_IN_AS_IS);
        this.startPlanPhaseOut = this.getPSMDate(p_oCxnDef,Constants.AT_START_PLAN_PHASE_OUT);
        this.PhaseOutPlan = this.getPSMDate(p_oCxnDef,Constants.AT_PHASE_OUT_PLAN);
        this.PhaseOut = this.getPSMDate(p_oCxnDef,Constants.AT_PHASE_OUT_AS_IS);  
        
        var attr = Designer.getAttribute(p_oCxnDef, Constants.AT_TO_BE, null);
        if (attr != null) this.isToBe = attr.getValue();
        else this.isToBe = false;
        attr = Designer.getAttribute(p_oCxnDef, Constants.AT_PROC_SUPPORT_STATUS, null);
        if (attr != null) this.procSupportStatus = attr.getValue();
        else this.procSupportStatus = null;
        //return new Array(this.startPlanPhaseIn,this.PhaseInPlan,this.PhaseIn,this.startPlanPhaseOut,this.PhaseOutPlan,this.PhaseOut);
    }    
             
    this.isVisable = function(p_oCxnDef){  
        this.setAssignmentDates(p_oCxnDef);
        if (this.procSupportStatus==null || this.procSupportStatus==0) return false;
        if (this.iModelView==Constants.AVT_PSV_ALL ){
            return true;
        }          
        if (this.iModelView==Constants.AVT_PSV_TO_BE){
            return (this.isToBe==true);
        }   
        if (this.iModelView==Constants.AVT_PSV_AS_IS){
            if (this.procSupportStatus==Constants.AVT_TO_BE_PHASED_IN){
                return false;
            }
            if (this.procSupportStatus==Constants.AVT_PHASED_IN || this.procSupportStatus==Constants.AVT_START_PLANNING_PHASE_OUT || this.procSupportStatus==Constants.AVT_TO_BE_PHASED_OUT){
                if (this.nullOrGreaterEqual(this.oAnalysisDate,this.PhaseIn)) { 
                    // AST is or has been phased in at analysis date 
                    return true;
                } else {
                    // At analysis date the AST hasn't been phased in
                    return false;
                }    
            } else if (this.procSupportStatus==Constants.AVT_PHASED_OUT){ 
                if (this.nullOrGreaterEqual(this.oAnalysisDate,this.PhaseIn) && this.notNullAndLower(this.oAnalysisDate,this.PhaseOut)) { 
                    // AST is or has been phased in and has not been phased out at analysis date
                    return true;
                } else {
                    return false;
                }    
            }
            return false;
        }  
        if (this.iModelView==Constants.AVT_PSV_PLAN){
            
            if (this.nullOrGreaterEqual(this.oAnalysisDate,this.startPlanPhaseIn)) { 
                // AST is or has been phased in at analysis date
                if (this.procSupportStatus==Constants.AVT_PHASED_OUT) {
                    if (this.notNullAndLower(this.oAnalysisDate,this.PhaseOut)) {
                        // AST is or has been phased in and has not been phased out at analysis date
                        return true;
                    } else {
                        // AST is or has been phased out at analysis date
                        return false;
                    }   
                } else {
                    // At analysis date the AST is or has been phased in
                    return true;
                }    
            }
            return false;
        }
        return false;
    }
    this.setAllocationBGColor = function(p_oAstOcc){        
        var oBgColor = colorNoStatus;
        if (this.procSupportStatus == Constants.AVT_START_PLANNING_PHASE_IN) {
            oBgColor = colorStartToBePhasedIn;
        } else if (this.procSupportStatus == Constants.AVT_TO_BE_PHASED_IN) {
            oBgColor = colorToBePhasedIn;
        } else if (this.procSupportStatus == Constants.AVT_PHASED_IN) {
            oBgColor = colorPhasedIn;
        } else if (this.procSupportStatus == Constants.AVT_START_PLANNING_PHASE_OUT) {
            oBgColor = colorStartToBePhasedOut;
        } else if (this.procSupportStatus == Constants.AVT_TO_BE_PHASED_OUT) {
            oBgColor = colorToBePhasedOut;
        } else if (this.procSupportStatus == Constants.AVT_PHASED_OUT) {
            oBgColor = colorPhasedOut;
        }
        var oBorderStyle = borderStyleNormal;
        if (this.iModelView == Constants.AVT_PSV_AS_IS){            
            if (this.procSupportStatus==Constants.AVT_TO_BE_PHASED_OUT || this.procSupportStatus==Constants.AVT_PHASED_OUT){
                if (this.notNullAndLower(this.oAnalysisDate,this.PhaseOutPlan)) {
                    oBgColor = colorPhasedIn;
                } else {
                    oBgColor = colorToBePhasedOut;
                }   
            }  
        }
        if (this.iModelView == Constants.AVT_PSV_PLAN){
            if (this.procSupportStatus == Constants.AVT_TO_BE_PHASED_IN){
               if (this.notNullAndLower(this.oAnalysisDate,this.PhaseInPlan)){                
                    oBgColor = colorStartToBePhasedIn;
               } else {               
                    oBgColor = colorPhasedIn;
                    oBorderStyle = borderStyleDashed;
               }    
            }
            if (this.procSupportStatus == Constants.AVT_PHASED_IN){  
                if (this.notNullAndLower(this.oAnalysisDate,this.PhaseInPlan)){                
                    oBgColor = colorStartToBePhasedIn;
                } else if (this.notNullAndLower(this.oAnalysisDate,this.PhaseIn)){                
                    oBgColor = colorPhasedIn;
                    oBorderStyle = borderStyleDashed;
                }    
            }
            if (this.procSupportStatus == Constants.AVT_START_PLANNING_PHASE_OUT){  
                if (this.notNullAndLower(this.oAnalysisDate,this.PhaseInPlan)){                
                    oBgColor = colorStartToBePhasedIn;
                } else if (this.notNullAndLower(this.oAnalysisDate,this.PhaseIn)){                
                    oBgColor = colorPhasedIn;
                    oBorderStyle = borderStyleDashed;
                } else if (this.notNullAndLower(this.oAnalysisDate,this.startPlanPhaseOut)){                
                    oBgColor = colorPhasedIn;
                }    
            }            
            if (this.procSupportStatus == Constants.AVT_TO_BE_PHASED_OUT){  
                if (this.notNullAndLower(this.oAnalysisDate,this.PhaseInPlan)){                
                    oBgColor = colorStartToBePhasedIn;
                } else if (this.notNullAndLower(this.oAnalysisDate,this.PhaseIn)){                 
                    oBgColor = colorPhasedIn;
                    oBorderStyle = borderStyleDashed;
                } else if (this.notNullAndLower(this.oAnalysisDate,this.startPlanPhaseOut)){                
                    oBgColor = colorPhasedIn;
                } else if (this.notNullAndLower(this.oAnalysisDate,this.PhaseOutPlan)){                
                    oBgColor = colorStartToBePhasedOut;
                }  else {                                    
                    oBgColor = colorPhasedOut;  
                    oBorderStyle = borderStyleDashed;
                }    
            }            
            if (this.procSupportStatus == Constants.AVT_PHASED_OUT){  
                if (this.notNullAndLower(this.oAnalysisDate,this.PhaseInPlan)){                
                    oBgColor = colorStartToBePhasedIn;
                } else if (this.notNullAndLower(this.oAnalysisDate,this.PhaseIn)){                
                    oBgColor = colorPhasedIn;
                    oBorderStyle = borderStyleDashed;
                } else if (this.notNullAndLower(this.oAnalysisDate,this.startPlanPhaseOut)){                
                    oBgColor = colorPhasedIn;
                } else if (this.notNullAndLower(this.oAnalysisDate,this.PhaseOutPlan)){                
                    oBgColor = colorStartToBePhasedOut;
                } else if (this.notNullAndLower(this.oAnalysisDate,this.PhaseOut)){                
                    oBgColor = colorPhasedOut;
                    oBorderStyle = borderStyleDashed;
                }    
            }                      
        }
        
        Designer.setFillColor(this.oModel, p_oAstOcc, oBgColor);
        Designer.setLineStyle(this.oModel, p_oAstOcc, oBorderStyle);
    }
    this.setAllocationBorderStyle = function(p_oAstOcc){        
        if (this.isToBe == true) {
            Designer.setLineColor(this.oModel, p_oAstOcc, colorBorderToBe);
            Designer.setLineWidth(this.oModel, p_oAstOcc, borderWidthToBe);
        }
        else {
            Designer.setLineColor(this.oModel, p_oAstOcc, colorBorderNormal);
            Designer.setLineWidth(this.oModel, p_oAstOcc, borderWidthNormal);
        }
    }
    this.nullOrGreaterEqual = function(date1,date2){
        if (date2==null){
            return true;
        } else {
            return date1.compareTo(date2) >= 0;
        }
    }
    this.notNullAndLower = function(date1,date2){
        if (date2==null){
            return false;
        } else {
            return date1.compareTo(date2) < 0;
        }
    }
    this.nullOrLower = function(date1,date2){
        if (date2==null){
            return true;
        } else {
            return date1.compareTo(date2) < 0;
        }
    }
}

function psmHelper(p_oModel){
    this.oModel = p_oModel;    
    this.oGroupCreator = new classGroupCreator(p_oModel);
    this.oGroup = Designer.getParentGroup(p_oModel);  
    this.heute = new java.util.Date();    
    this.oAnalysisDate = this.heute; 
    this.iModelView = Constants.AVT_PSV_ALL;
    this.modelDate="";
    this.oCols = null;
    this.oRows = null;
    this.oPsmMatrix = null;     
    this.allDefs = new Packages.java.util.HashMap();
    this.allNonObjects = new Array();
    this.allAssignmentOccs = new Array();
    this.allOtherOccs = new Array();
    this.ColHeaderUnitDefs = new java.util.HashMap(); //For inspected ColHeaders it contains an Array of UnitDefs 
    this.UnitDefsColHeader = new java.util.HashMap(); //For inspected UnitDefs it contains an Arraylist with related ColHeaders
    this.UnitDefsRowHeader = new java.util.HashMap(); //For inspected UnitDefs it contains an Arraylist with related RowHeaders    
    this.newCreatedUnitDefs = new Array();
    this.newCreatedUnitDefRowHeaders = new Array();
    this.newCreatedUnitDefColHeaders = new Array();
    this.oDBLang = Designer.getLanguage(p_oModel);  // BLUE-4790

    this.oldViewAttrValue = getOldViewAttrValue();
    
    function getOldViewAttrValue() {
        var oldViewAttr = Designer.getAttribute(p_oModel, Constants.AT_LAST_GENERATED_VIEW_PSM, null);
        if (oldViewAttr != null) {
            return oldViewAttr.getValue();
        }
        return "";
    }
    
    this.getDef = function(oOcc){
        var oDef = this.allDefs.get(oOcc);
        if (oDef == null){
            oDef = Designer.getDefinition(oOcc);
        }
        return oDef;
    }    
    this.hasWriteAccess = function(){
       return Designer.hasWriteAccess(this.oGroup); 
    }    
    this.writeUnitAttributes = function(p_oUnitDef, p_oColDef, p_oRowDef, language) {
        updateUnitAttributes(p_oUnitDef, p_oColDef, p_oRowDef, language, this.oModel);
    }
    this.addUnitsColRowHeader = function(p_oUnitDefsHeader,p_oUnitDef,p_oObjDef){
       if (p_oUnitDefsHeader.containsKey(p_oUnitDef)){
           var oUnitRels = p_oUnitDefsHeader.get(p_oUnitDef);
           if (!oUnitRels.contains(p_oObjDef)) oUnitRels.add(p_oObjDef);
       } else {
           var oUnitRels = new java.util.ArrayList();
           oUnitRels.add(p_oObjDef);
           p_oUnitDefsHeader.put(p_oUnitDef,oUnitRels);
       }
    }
    this.setConnectedColRowHeader = function(p_oCxnDef){  
        var oType = p_oCxnDef.getType();
        if (this.isColHeaderCxn(oType)) { 
            var oColDef = Designer.getTarget(p_oCxnDef);   
            if (this.isColHeaderObj(oColDef.getType())){
                var oUnitDef = Designer.getSource(p_oCxnDef);
                this.addUnitsColRowHeader(this.UnitDefsColHeader,oUnitDef,oColDef);
            }
        } 
        if (this.isRowHeaderCxn(oType)) {                  
            var oSrcDef = Designer.getSource(p_oCxnDef);
            var oTrgDef = Designer.getTarget(p_oCxnDef);
            if (this.isUnitObj(oSrcDef.getType())&&this.isRowHeaderObj(oTrgDef.getType())) {
                this.addUnitsColRowHeader(this.UnitDefsRowHeader,oSrcDef,oTrgDef);
            } else if (this.isUnitObj(oTrgDef.getType())&& this.isRowHeaderObj(oSrcDef.getType())){                        
                this.addUnitsColRowHeader(this.UnitDefsRowHeader,oTrgDef,oSrcDef);
            }   
        }    
    } 
    this.setConnectedColRowHeaders = function(p_oUnitDefs){   
        var oUnitCons = Designer.getConnections(p_oUnitDefs);        
        Designer.loadAttributes(oUnitCons, [this.oDBLang]);     // BLUE-4790
        for (var i=0; i<oUnitCons.length; i++) {  
            this.setConnectedColRowHeader(oUnitCons[i])
        } 
    }
    this.getConnectedUnitDef = function(p_oColDef){
        var oUnitDefs = new Array();      
        var oCxns = Designer.getIncomingCxns(p_oColDef);
        for (var i=0; i<oCxns.length; i++){
            var oCxn = oCxns[i];
            if (this.isColHeaderCxn(oCxn.getType())){
                var oUnitDef = Designer.getSource(oCxn);
                if (this.isUnitObj(oUnitDef.getType())) oUnitDefs.push(oUnitDef); 
            }
        }
        this.ColHeaderUnitDefs.put(p_oColDef,oUnitDefs);
        if (oUnitDefs.length > 0) this.setConnectedColRowHeaders(oUnitDefs);
        return oUnitDefs;
    } 
    this.initNewUnits = function(){               
        Designer.loadAttributes(this.newCreatedUnitDefs, null);
        for (var j = 0; j<this.newCreatedUnitDefs.length;j++) {
            var oUnitDef = this.newCreatedUnitDefs[j];
            var oRowDef = this.newCreatedUnitDefRowHeaders[j];
            var oColDef = this.newCreatedUnitDefColHeaders[j];
            for (var i = 0; i < g_DBLanguages.length; i++) {
                this.writeUnitAttributes(oUnitDef, oColDef, oRowDef, g_DBLanguages[i]);
            }
            setInitialUnitHistory(this.oModel, oUnitDef);
        }    
    }
    this.createNewUnitDef = function(oColDef, oRowDef) {
        var oUnitDefs = new Array();
        var sUnitName = createUnitName(oColDef, oRowDef, null);
        var oNewGrp = this.oGroupCreator.createGroup4PSU(oColDef,oRowDef);
        var oUnitDef = Explorer.createObjDef(oNewGrp, sUnitName, Constants.OT_PROCESS_SUPPORT_UNIT, Constants.ST_PROCESS_SUPPORT_UNIT);        
        if (oUnitDef != null) {
            /*for (var i = 0; i < g_DBLanguages.length; i++) {
                this.writeUnitAttributes(oUnitDef, oColDef, oRowDef, g_DBLanguages[i]);
            }
            setInitialUnitHistory(this.oModel, oUnitDef);*/
            /*if (oRowDef.getType() == Constants.OT_LOC) {
                Designer.createCxnDefPersistent(oUnitDef, oRowDef, Constants.CT_CAN_BE_LOC_AT);
            } else if (oRowDef.getType() == Constants.OT_PERF) {
                Designer.createCxnDefPersistent(oUnitDef, oRowDef, Constants.CT_CAN_SUPP_1);
            } else {
                Designer.createCxnDefPersistent(oRowDef, oUnitDef, Constants.CT_CAN_BE_USER);
            }
            Designer.createCxnDefPersistent(oUnitDef, oColDef, Constants.CT_CAN_SUPP_1);*/
            if (this.ColHeaderUnitDefs.containsKey(oColDef)) {
                oUnitDefs = this.ColHeaderUnitDefs.get(oColDef);
            } 
            oUnitDefs.push(oUnitDef)
            this.ColHeaderUnitDefs.put(oColDef,oUnitDefs);
            this.addUnitsColRowHeader(this.UnitDefsColHeader,oUnitDef,oColDef);
            this.addUnitsColRowHeader(this.UnitDefsRowHeader,oUnitDef,oRowDef);
        }
        this.newCreatedUnitDefs.push(oUnitDef);
        this.newCreatedUnitDefRowHeaders.push(oRowDef);
        this.newCreatedUnitDefColHeaders.push(oColDef);
        return oUnitDef;
    }    
    this.getUnitDef = function(p_oColDef,p_oRowDef){   
        var oUnitDef = null;
        var oUnitDefs = null;          
        if (this.ColHeaderUnitDefs.containsKey(p_oColDef)){
            oUnitDefs = this.ColHeaderUnitDefs.get(p_oColDef);
        } else { 
            oUnitDefs = this.getConnectedUnitDef(p_oColDef);
        }          
        for (var i=0;i<oUnitDefs.length;i++){
            var oUnitDefToCheck = oUnitDefs[i];
            var oColHeaders = this.UnitDefsColHeader.get(oUnitDefToCheck);
            var oRowHeaders = this.UnitDefsRowHeader.get(oUnitDefToCheck);
            if (oColHeaders == null || oRowHeaders == null) continue;			// Anubis 508732
            
            if (oColHeaders.size()==1 && oRowHeaders.size()==1) {
                if (oColHeaders.contains(p_oColDef) && oRowHeaders.contains(p_oRowDef)) {
                    if (oUnitDef==null){
                        oUnitDef = oUnitDefToCheck; 
                    } else {
                        var sMsgText = formatText2(getString("MORE_THAN_ONE_UNIT_2_MSG"), getAttribute_Name(p_oColDef, null), getAttribute_Name(p_oRowDef, null));
                        Context.MsgBox(sMsgText);
                        return -1;
                    }
                }                
            } else {
                var sMsgText = formatText2(getString("UNIT_NOT_UNIQUE_MSG"), getAttribute_Name(p_oColDef, null), getAttribute_Name(p_oRowDef, null));
                Context.MsgBox(sMsgText);
                return -1;
            }
        }
        if (oUnitDef==null){            
            oUnitDef = this.createNewUnitDef(p_oColDef, p_oRowDef);
        }
        return oUnitDef;
    }
    this.fillMissingUnits = function(){
        var oHeadersWithoutUnits = this.oPsmMatrix.getHeadersWithoutUnits();
        var addedUnits = new Array();
        for (var i=0;i<oHeadersWithoutUnits.length;i++){
            var oHeadersWithoutUnit = oHeadersWithoutUnits[i];
            var oColDef = this.getDef(oHeadersWithoutUnit.oObjCol);
            var oRowDef = this.getDef(oHeadersWithoutUnit.oObjRow);
            var oUnitDef = this.getUnitDef(oColDef,oRowDef);
            if (oUnitDef != -1) {
                this.oPsmMatrix.addNewUnitOcc(oUnitDef,oHeadersWithoutUnit.iRow,oHeadersWithoutUnit.iCol);
                addedUnits.push(oUnitDef);
            }    
        }
        this.initNewUnits();
        return addedUnits;
    }
    this.checkNotReadableUnits = function(){
        var oHeadersWithoutUnits = this.oPsmMatrix.getHeadersWithoutUnits();    
        var oObjDefToCheckMap = new java.util.HashMap();
        var oObjDefToCheck = new Array();
        for (var i=0;i<oHeadersWithoutUnits.length;i++){
            var oHeadersWithoutUnit = oHeadersWithoutUnits[i];
            var oDef = this.getDef(oHeadersWithoutUnit.oObjCol);
            if (!oObjDefToCheckMap.containsKey(oDef)){
                oObjDefToCheckMap.put(oDef,null);
                oObjDefToCheck.push(oDef);
            }    
            oDef = this.getDef(oHeadersWithoutUnit.oObjRow); 
            if (!oObjDefToCheckMap.containsKey(oDef)){
                oObjDefToCheckMap.put(oDef,null);
                oObjDefToCheck.push(oDef);
            }        
        }        
        var result = checkNotReadableUnits(oObjDefToCheck);
        return result;
    }    
    this.getFmtDateString = function(oDate){        
        var oSDF = new java.text.SimpleDateFormat("dd.MM.yyyy");
        var oSB = new java.lang.StringBuffer();
        return oSDF.format(oDate, oSB, new java.text.FieldPosition(1));
    }    
    this.updateLastChangeModel = function(){
        var sAnalysisDateString = this.getFmtDateString(this.oAnalysisDate);
        var sViewString = this.iModelView + "," + sAnalysisDateString + "," + iSymbolScaleFactor;        

        if (iPaletteGuid != "") {                   // from psmCommon.js, AGA-10251
            sViewString += "," + iPaletteGuid;      // Add information about current palette Guid
        }
        Designer.setAttribute(this.oModel, this.oModel, Constants.AT_LAST_GENERATED_VIEW_PSM, sViewString, null);

        var date = new java.util.Date();
        Designer.setAttribute(this.oModel, this.oModel, Constants.AT_LAST_UPDATE_PSM, date, null);
    }
    this.updateLabels = function() {
        for (var i=0; i<this.allNonObjects.length; i++) {
            Designer.deleteOcc(this.oModel, this.allNonObjects[i]);
        }
        var oLO = this.oPsmMatrix.getLabelPoint();
        var oDim = this.oPsmMatrix.getLabelDim();

        var currFillColor = isFreezeModel(this.oModel) ? fillColorFreeze : fillColor;   // Model is frozen -> different fill color
        var oNewRectangle = Designer.createRectangle(this.oModel, oLO.getX() + 1, oLO.getY() + 1, oDim.getWidth(), oDim.getHeight(), currFillColor, java.awt.Color.black, 1, 0);   
        this.allNonObjects.push(oNewRectangle);
        var sModelViewString = getString("LABEL_VIEW") + "\n" + getLabelATV(this.iModelView);
        var oNewTextOcc = Designer.createTextOcc(this.oModel, oLO.getX()+ 5, oLO.getY()+ 10, sModelViewString, Constants.TEXT_ALLIGN_LEFT, false);
        var oNewPosition = new java.awt.Point(oLO.getX()+ 5, oLO.getY() + 10);
        Designer.setPosition(this.oModel, oNewTextOcc, oNewPosition);
    
        if (this.iModelView == Constants.AVT_PSV_AS_IS || this.iModelView == Constants.AVT_PSV_PLAN) {            
            var sAnalysisDateString = this.getFmtDateString(this.oAnalysisDate);            
            var sDatumString = getString("LABEL_ANALYSIS_DATE") + "\n" + sAnalysisDateString;
            var oNewTextOcc = Designer.createTextOcc(this.oModel,oLO.getX()+ 5, oLO.getY()+ 130, sDatumString, Constants.TEXT_ALLIGN_LEFT, false);
            var oNewPosition = new java.awt.Point(oLO.getX()+ 5, oLO.getY()+ 130);
            Designer.setPosition(this.oModel, oNewTextOcc, oNewPosition);
        }
    }
    this.isNewView = function() {
        // Aktuelle View auslesen
        var analysisDateFormat = new java.text.SimpleDateFormat("dd.MM.yyyy");
        var oSb = new java.lang.StringBuffer();
        var analysisDateString = analysisDateFormat.format(this.oAnalysisDate, oSb, new java.text.FieldPosition(1));
        analysisDateString = analysisDateString + "";
        
        // alte View auslesen
        var oldViewAttr = Designer.getAttribute(this.oModel, Constants.AT_LAST_GENERATED_VIEW_PSM, null);
        if (oldViewAttr == null) {
            return true;            
        } else {
            var oldView = oldViewAttr.getValue();
            var oldViewArray = oldView.split(",");
            var oldView = parseInt(oldViewArray[0]);
            var oldViewDate = oldViewArray[1];
            if ("" + iCurrentSymbolScaleFactor!="" + iSymbolScaleFactor) {  
                return true;                
            }   
            // AGA-10251 Check whether palette Guid has changed
            if (oldViewArray.length >= 4) {
                var oldPaletteGuid = oldViewArray[3];
                if (compareString(oldPaletteGuid, iPaletteGuid) != 0) {
                    return true;                        // Palette Guid has changed
                }
            } else {
                if (!isOldPalette()) {                  // from psmCommon.js
                    return true;                        // Palette Guid has changed
                }
            }
            
            if (this.iModelView == Constants.AVT_PSV_ALL || this.iModelView == Constants.AVT_PSV_TO_BE) {
                if (oldView == this.iModelView) {
                    return false;
                }
                else {
                    return true;
                }
            }
            else {
                if (oldView == this.iModelView) {
                    if (analysisDateString.equals(oldViewDate)) {
                        return false;
                    }
                    else {
                        return true;
                    }
                }
                else {
                    return true;
                }
            }
        }
    } 
    this.init = function(){   
        var oCheckFilter = new checkFilter(Context.getArisMethod());
        if (!oCheckFilter.isValidPSMFilter()) throw new PsmError("NO_PSM_FILTER"); 
        if (oStopWatch) oStopWatch.stopOver("Init start");    
        this.oPsmMatrix = new psmMatrix(this.oModel);
        this.units4Update = new Array();
        var aAllDefs = new Array();
        var aAllHeaders = new Array();
        var aAllHeaderOccs = [];
        // Modellattribute auslesen
        var attr = Designer.getAttribute(this.oModel, Constants.AT_PROCESS_SUPPORT_VIEW, null);
        if (attr != null){
            this.iModelView = attr.getValue();
        } else {
            Designer.setAttribute(this.oModel, this.oModel, Constants.AT_PROCESS_SUPPORT_VIEW, Constants.AVT_PSV_ALL, null);
        }  
        attr = Designer.getAttribute(this.oModel, Constants.AT_ANALYSIS_DATE, null);
        if (attr != null){
            this.oAnalysisDate = attr.getValue();
        }                
        attr = Designer.getAttribute(this.oModel, Constants.AT_LAST_UPDATE_PSM, null);
        if (attr != null) {
            this.modelDate = attr.getValue();
        }
        
        var oObjOccs = Designer.getAllOccs(this.oModel);
        for(var i=0;i<oObjOccs.length;i++) {
            var oObjOcc = oObjOccs[i];
            var oObjDef = Designer.getDefinition(oObjOcc);            
            if ((oObjDef == null && oObjOcc.getItemKind() == Constants.CID_OBJOCC)) {
                continue;
            }
            if (oObjOcc.getItemKind() == Constants.CID_GFXOBJ || oObjOcc.getItemKind() == Constants.CID_TEXTOCC || oObjOcc.getItemKind() == Constants.CID_COMOBJDEF) {
                this.allNonObjects.push(oObjOcc);
                continue;
            }  
            if ((oObjOcc.getItemKind() != Constants.CID_CXNOCC && oObjOcc.getItemKind() != Constants.CID_OBJOCC))  continue;
            this.allDefs.put(oObjOcc,oObjDef);
            aAllDefs.push(oObjDef);
            var iTypeNum = oObjDef.getType();
            
            if (oObjOcc.getItemKind() == Constants.CID_CXNOCC && oObjOcc.isValid()) {                    
                if (this.isAssignmentCxn(iTypeNum)) {
                    var oUnitOcc = Designer.getTarget(this.oModel,oObjOcc);
                    var oAssignedOcc = Designer.getSource(this.oModel,oObjOcc);                 
                    var oldDim = Designer.getSize(this.oModel, oAssignedOcc);
                    if (!oldDim.equals(astDimension)) Designer.setSize(this.oModel, oAssignedOcc, astDimension);
                    if (oUnitOcc!=null) this.oPsmMatrix.addOccAssignment(oUnitOcc,oAssignedOcc,oObjOcc);
                } else {
                    var oSrcOcc = Designer.getSource(this.oModel,oObjOcc);
                    var oTrgOcc = Designer.getTarget(this.oModel,oObjOcc);
                    if (oSrcOcc!=null&&!oTrgOcc!=null){
                        var oSrc = Designer.getDefinition(oSrcOcc);
                        var oTrg = Designer.getDefinition(oTrgOcc);
                        if (this.isColHeaderCxn(iTypeNum)) { 
                            if (this.isUnitObj(oSrc.getType())&&this.isColHeaderObj(oTrg.getType())) {
                                this.oPsmMatrix.addColHeaderCxn(oSrcOcc,oTrgOcc,oObjOcc);
                            }    
                        } 
                        if (this.isRowHeaderCxn(iTypeNum)) { 
                            if (this.isUnitObj(oSrc.getType())&&this.isRowHeaderObj(oTrg.getType())) {
                                this.oPsmMatrix.addRowHeaderCxn(oSrcOcc,oTrgOcc,oObjOcc);
                            } else if (this.isUnitObj(oTrg.getType())&&this.isRowHeaderObj(oSrc.getType())){                        
                                this.oPsmMatrix.addRowHeaderCxn(oTrgOcc,oSrcOcc,oObjOcc);
                            } 
                        } 
                    }    
                }    
            } else if (oObjOcc.getItemKind() == Constants.CID_OBJOCC) {
                if (this.isUnitObj(iTypeNum)||this.isColHeaderObj(iTypeNum) ||this.isRowHeaderObj(iTypeNum)) {
                     if (this.isColHeaderObj(iTypeNum) ||this.isRowHeaderObj(iTypeNum)) {
                        aAllHeaders.push(oObjDef);
                        aAllHeaderOccs.push(oObjOcc);
                     }   
                     if (!this.oPsmMatrix.add(oObjOcc)){ 
                         var sMsgText = formatText1(getString("MORE_THAN_ONE_UNIT_MSG"), getAttribute_Name(Designer.getDefinition(oObjOcc), null));
                         var iResult = Context.MsgBox(sMsgText, getString("MORE_THAN_ONE_UNIT_TITLE"), Constants.MSGBOX_ICON_WARNING, Constants.MSGBOX_BTN_OK);
                         return false;   
                     }   
                } else if (this.isAssignedObj(iTypeNum)) {
                    this.allAssignmentOccs.push(oObjOcc);
                } else this.allOtherOccs.push(oObjOcc);
            }   
        }
        if (oStopWatch) oStopWatch.addMessageText("AssignedOccs at init = "+this.allAssignmentOccs.length);
        if (oStopWatch) oStopWatch.stopOver("End Init");
        var result = this.noIsoAllocation();
        Designer.loadAttributes(aAllHeaders, [this.oDBLang]);   // BLUE-4790
        checkUsedSymbols(aAllHeaderOccs);
        return result;
        function checkUsedSymbols(p_aAllHeaderOccs){
            for (var i=0; i <p_aAllHeaderOccs.length;i++){
                iDefaultSym = g_oPsmConfig.getDefDefaultSymbol(Designer.getDefinition(p_aAllHeaderOccs[i]));
                if (p_aAllHeaderOccs[i].getSymbolNum() != iDefaultSym){
                    Designer.setSymbol(this.oModel,p_aAllHeaderOccs[i],iDefaultSym);
                    Designer.setDefaultProperties(this.oModel, p_aAllHeaderOccs[i]);
                }    
            }    
        }
    }    
    this.noIsoAllocation = function(){
        var result = true;
        var sMessage = "";
        for (var i=0;i<this.allAssignmentOccs.length;i++){
            var oOcc = this.allAssignmentOccs[i];
            if (!this.oPsmMatrix.oAllAssigmentObjOccs.containsKey(oOcc)) sMessage = sMessage +"\n" + getAttribute_Name(this.allDefs.get(oOcc), null);
        }
        if (sMessage != "") {
            Context.MsgBox(getString("ISOAST")+sMessage);
            var result = true;
        }
        return result;
    }
    this.setAssignmentDef = function (p_oCxnDef){
        if (this.isAssignmentCxn(p_oCxnDef.getType())){
            var oAssignedDef = Designer.getSource(p_oCxnDef);
            var oUnitDef = Designer.getTarget(p_oCxnDef);
            this.oPsmMatrix.addAssignedDefs(oUnitDef,oAssignedDef,p_oCxnDef);
        }    
    }
    this.checkHiddenAssignements = function(p_unitOcc){
        var oAssignments = this.oPsmMatrix.getAssignedOccs(p_unitOcc);
        var oUnitZOrder = Designer.getZ
        var sHiddenAssignments = "";
        for (var i=0; i < oAssignments.length; i++){
        }
    }
    this.checkPSM = function(){
        var oUnits2Check = this.oPsmMatrix.oUnitDefArray;
        var oUnitCons2Check = Designer.getConnections(oUnits2Check);        
        Designer.loadAttributes(oUnitCons2Check, [this.oDBLang]);       // BLUE-4790
        for (var i=0; i<oUnitCons2Check.length; i++) {
            this.setAssignmentDef(oUnitCons2Check[i]);
            this.setConnectedColRowHeader(oUnitCons2Check[i]);
        }         
        for (var i=0; i<oUnits2Check.length; i++) {
            var oUnit2Check = oUnits2Check[i];
            var oColHeader = null;
            var oRowHeader = null;
            if (this.UnitDefsColHeader.containsKey(oUnit2Check)) oColHeader = this.UnitDefsColHeader.get(oUnit2Check); 
            if (this.UnitDefsRowHeader.containsKey(oUnit2Check)) oRowHeader = this.UnitDefsRowHeader.get(oUnit2Check);
            if (oColHeader == null || oRowHeader == null) {
                Context.MsgBox("Der Unit " + getAttribute_Name(oUnit2Check,null) + " fehlt mindestens eine Zuordnung zu einem Zeilen oder Spalten definierenden Objekttyp");
            }
            if (oColHeader.size() >1 || oRowHeader.size() >1) {
                Context.MsgBox("Für die Unit " + getAttribute_Name(oUnit2Check,null) + " gibt es mehr als eine Zuordnung von Objekttypen die eine Zeile oder Spalte definiert");
            }
            var oProcType = Designer.getAttribute(oUnit2Check, Constants.AT_PROCESSING_TYPE, null);
            var bNoSystem = true;
            if (oProcType != null) bNoSystem = (oProcType.getValue() != Constants.AVT_SYSTEM);
            if (bNoSystem && this.oPsmMatrix.getAssignedDefs(oUnit2Check).length>0) {
                Context.MsgBox("Die Unit " + getAttribute_Name(oUnit2Check,null) + " ist bebaut obwohl der Status nicht System ist");
            }    
        } 
    }
    this.updatePSM = function(){
        var newLabel = this.isNewView();
       
        if (this.units4Update.length==0){
            if (this.modelDate=="" || newLabel){
                this.units4Update = this.oPsmMatrix.oUnitDefArray;   
                Designer.loadAttributes(this.units4Update, [this.oDBLang]);     // BLUE-4790
            } else {
                this.setUnits4Update();
            } 
        }  
        
        var oUnitCons4Update = Designer.getConnections(this.units4Update);        
        Designer.loadAttributes(oUnitCons4Update, [this.oDBLang]);        // BLUE-4790
        for (var i=0; i<oUnitCons4Update.length; i++) {
            this.setAssignmentDef(oUnitCons4Update[i]);
        }  
        var oPsmAssignedAstHelper = new psmAssignedAllocationHelper(this.oModel,this.iModelView,this.oAnalysisDate);  
        var iAssignedOccs = 0;
        for (var i=0; i<this.units4Update.length; i++){
            var oUnitDef = this.units4Update[i];
            var oAssignedDefs = this.oPsmMatrix.getAssignedDefs(oUnitDef);
            var oUnitOccs = this.oPsmMatrix.getUnitOccs(oUnitDef);
            for (var j=0; j<oUnitOccs.length; j++){
                var oPsmUnitHelper = new psmUnitHelper(oUnitOccs[j],this.oModel);
                var oAssignedOccs = this.oPsmMatrix.getAssignedOccs(oUnitOccs[j]);
                if (oAssignedOccs.length == 0) this.oPsmMatrix.oAssignedObjOccs.put(oUnitOccs[j],oAssignedOccs);
                oPsmUnitHelper.updateAssignedOccs(oAssignedOccs,oAssignedDefs,this.allDefs,oPsmAssignedAstHelper);
                oPsmUnitHelper.updateAttrOccs();
                iAssignedOccs = iAssignedOccs + oAssignedOccs.length;
            } 
        }   
        if (oStopWatch) oStopWatch.addMessageText("new AssignedOccs = "+iAssignedOccs); 
        if (oStopWatch) oStopWatch.endSum("deleteAssignedOcc");                              
        if (oStopWatch) oStopWatch.endSum("createObjOcc");                           
        if (oStopWatch) oStopWatch.endSum("createCxnOcc");
        if (newLabel) this.updateLabels();
        this.updateLastChangeModel();
    }
    this.updateUnits = function(p_oUnits4Update){
        this.units4Update = p_oUnits4Update;
        this.updatePSM();
    }
    this.setUnits4Update = function(){
        var oUnitDefs = this.oPsmMatrix.oUnitDefArray;
        Designer.loadAttributes(oUnitDefs, [this.oDBLang]);     // BLUE-4790
        for (var i=0; i<oUnitDefs.length; i++) {
            var unitDate = Designer.getAttribute(oUnitDefs[i], Constants.AT_LAST_CHNG_2, null).getValue();
            if (this.modelDate.compareTo(unitDate) <= 0) {
                this.units4Update.push(oUnitDefs[i]);
            }
        }
    }
    this.layoutUnits = function(p_oUnitsToUpdate){
        var result = this.oPsmMatrix.layoutPsm(p_oUnitsToUpdate);
        if ("" + iCurrentSymbolScaleFactor!="" + iSymbolScaleFactor) this.updateLabels();
        return result;
    }
    this.layoutPsm = function(){
        var result = this.oPsmMatrix.layoutPsm(this.units4Update);
        if ("" + iCurrentSymbolScaleFactor!="" + iSymbolScaleFactor) this.updateLabels();

        // AGA-10251 Check whether palette Guid has changed -> adapt label
        var oldView = this.oldViewAttrValue;    // Read from this member because attribute was (possibly) changed in this.updatePSM()
        var oldViewArray = oldView.split(",");
        if (oldViewArray.length >= 4) {
            var oldPaletteGuid = oldViewArray[3];
            if (compareString(oldPaletteGuid, iPaletteGuid) != 0) {
                this.updateLabels(); 
            }
        } else {
            if (!isOldPalette()) {                  // from psmCommon.js
                this.updateLabels(); 
            }
        }  
        return result;
    }
    this.isUnitObj = function(p_iTypeNum){
        return p_iTypeNum==Constants.OT_PROCESS_SUPPORT_UNIT;
    }
    this.isAssignedObj = isAssignedObj;
    /*function(p_iTypeNum){
        return p_iTypeNum==Constants.OT_APPL_SYS || p_iTypeNum==Constants.OT_APPL_SYS_CLS || p_iTypeNum==Constants.OT_APPL_SYS_TYPE;
    }*/
    this.isColHeaderObj = isColHeaderObj;
    /*function(p_iTypeNum){
        return p_iTypeNum==Constants.OT_FUNC || p_iTypeNum==Constants.OT_IS_FUNC || p_iTypeNum==Constants.OT_FUNC_CLUSTER;
    }*/
    this.isRowHeaderObj = isRowHeaderObj; 
    /*function(p_iTypeNum){
        return p_iTypeNum==Constants.OT_GRP || p_iTypeNum==Constants.OT_ORG_UNIT || p_iTypeNum==Constants.OT_ORG_UNIT_TYPE || 
               p_iTypeNum==Constants.OT_PERS || p_iTypeNum==Constants.OT_PERS_TYPE || p_iTypeNum==Constants.OT_POS || p_iTypeNum==Constants.OT_LOC || 
               p_iTypeNum==Constants.OT_PERF;
    }*/
    this.isAssignmentCxn = isAssignmentCxn;
    /*function(p_iTypeNum){
        return p_iTypeNum==Constants.CT_BELONGS_TO_PROC_SUPPORT_UNIT;
    }*/
    this.isColHeaderCxn = isColHeaderCxn;
    /*function(p_iTypeNum){
        return p_iTypeNum==Constants.CT_CAN_SUPP_1;
    }*/
    this.isRowHeaderCxn = isRowHeaderCxn;
    /*function(p_iTypeNum){
        return p_iTypeNum==Constants.CT_CAN_BE_USER || p_iTypeNum==Constants.CT_CAN_BE_LOC_AT || p_iTypeNum==Constants.CT_CAN_SUPP_1;
    }*/
    this.getHeader = function(p_oUnitOcc, p_bRow){
        var oUnitHeader = this.oPsmMatrix.getHeader(p_oUnitOcc, p_bRow);
        return oUnitHeader;
    }
    this.getAllUnitOccs = function(){
        var oAllUnitOccs = this.oPsmMatrix.getAllUnitOccs()
        return oAllUnitOccs;
    }
    this.addAssignedDefs = function(p_oUnitDef,p_oAssignedDef,p_oCxnDef){ 
        this.oPsmMatrix.addAssignedDefs(p_oUnitDef,p_oAssignedDef,p_oCxnDef);
    }
    this.addOccAssignment = function(p_oUnitOcc,p_oObjOcc,p_oCxnOcc){
       this.oPsmMatrix.addOccAssignment(p_oUnitOcc,p_oObjOcc,p_oCxnOcc); 
    } 
    this.deleteAssignedOcc = function(p_oUnitOcc,p_oAssignedOcc){
        this.oPsmMatrix.deleteAssignedOcc(p_oUnitOcc,p_oAssignedOcc);
    }     
    this.deleteOccAssignment = function(p_oUnitOcc){
        this.oPsmMatrix.deleteOccAssignment(p_oUnitOcc);
    }    
    this.updateAttrOccs = function(p_oUnitOcc) {
        this.oPsmMatrix.updateAttrOccs(p_oUnitOcc)
    }    
    this.getPSUHelper = function(p_RowHeaderOcc, p_ColHeaderOcc){
        var oUnitHelper = null;
        var oUnitOcc = this.oPsmMatrix.getUnitOcc4Headers(p_RowHeaderOcc, p_ColHeaderOcc);
        if (oUnitOcc!=null) oUnitHelper = new psmUnitHelper(oUnitOcc, this.oModel);
        return oUnitHelper
    }      
    this.getAllocations = function(p_RowHeaderOcc, p_ColHeaderOcc){
        var oUnitHelper = null;
        var oUnitOcc = this.oPsmMatrix.getUnitOcc4Headers(p_RowHeaderOcc, p_ColHeaderOcc);
        if (oUnitOcc!=null) oUnitHelper = new psmUnitHelper(oUnitOcc, this.oModel);
        return oUnitHelper
    } 
}
function psmMatrix(p_oModel){  
    this.oModel = p_oModel;       
    this.oRows = Designer.getHorizontalLanes(this.oModel);
    this.oCols = Designer.getVerticalLanes(this.oModel);
    this.iRows = this.oRows.length;
    this.iCols = this.oCols.length;
    this.iColHeaderRow = 0;
    this.iRowHeaderCol = 0;
    this.iLastCol = 0;
    this.iLastRow = 0;
    this.oMatrix = new Array(this.iRows);
    var iMapSize = this.iRows * this.iCols*2;
    this.oUnitOccMap = new Packages.java.util.HashMap(iMapSize);//Contains the position of all unitOccs
    this.oUnitOccToLayout = new Packages.java.util.HashMap(iMapSize);//Contains all unitOccs to be layouted
    this.oUnitOccArray = new Array();//Contains all unitoccs
    this.oUnitDefMap = new Packages.java.util.HashMap(iMapSize);//Contains for all unitdefs an array off positions for the related unitOccs    
    this.oUnitDefArray = new Array();//contains all unitdefs
    this.oColHeaderMap = new Packages.java.util.HashMap(this.iCols*2);//contains the column index for a column header object occ
    this.oRowHeaderMap = new Packages.java.util.HashMap(this.iRows*2);//contains the row index for a row header object occ
    //this.oAssignedObjOccDefs = new Packages.java.util.HashMap(); //Contains for each unitOcc an Array of the currently assigned ObjDefs  
    this.oAssignedObjOccs = new Packages.java.util.HashMap(); //Contains for each unitOcc an Array with all currently assignments as pairs cxnOcc and objocc
    this.oAllAssigmentObjOccs = new Packages.java.util.HashMap(); //Contains all currently assignmentOccs contained in the model, only used to check for IsoAST
    this.oAssignedObjDefs = new Packages.java.util.HashMap(); //Contains for each unitDef an Array with all assignments as pairs cxnDef and objDef
    this.oAssignedObjDefsMap = new Packages.java.util.HashMap(); //Contains for each unitDef an Arraylist with all assignd objDef     
    this.oRelatedColHeaders = new Packages.java.util.HashMap(this.iCols*2); //Contains for each column header objocc an Array of all related units
    this.oRelatedRowHeaders = new Packages.java.util.HashMap(this.iRows*2); //Contains for each row header objocc an Array of all related units
    this.oRelatedOthers = new Packages.java.util.HashMap(iMapSize);
    this.oDBLang = Designer.getLanguage(p_oModel);  // BLUE-4790

    var oMethod = Context.getArisMethod();
    for (var i=0;i<this.iRows;i++) {
        this.oMatrix[i] = new Array(this.iCols);
        if (oMethod.IsHeaderLane(Constants.MT_SYS_LAY_OUT_PLAN,this.oRows[i].getType(),false)) this.iColHeaderRow=i;

    }
    for (var i=0;i<this.iCols;i++) {
        if (oMethod.IsHeaderLane(Constants.MT_SYS_LAY_OUT_PLAN,this.oCols[i].getType(),true)) { 
            this.iRowHeaderCol=i;
            break;
        }    
    }
    /*this.getAssignmentLst = function(p_oUnitOcc){        
        if (this.oAssignedObjOccDefs.containsKey(p_oUnitOcc)){
            return this.oAssignedObjOccDefs.get(p_oUnitOcc);
        } else {
            return null;
        }        
    }*/
    this.getLabelPoint = function(){
        var iY = Designer.getStart(this.oModel,this.oRows[this.iColHeaderRow]);
        var iX = Designer.getStart(this.oModel,this.oCols[this.iRowHeaderCol]);
        return new java.awt.Point(iX,iY);
    }
    this.getLabelDim = function(){
        var iDY = Designer.getEnd(this.oModel,this.oRows[this.iColHeaderRow]) - Designer.getStart(this.oModel,this.oRows[this.iColHeaderRow])-2;
        var iDX = Designer.getEnd(this.oModel,this.oCols[this.iRowHeaderCol]) - Designer.getStart(this.oModel,this.oCols[this.iRowHeaderCol])-2;
        //var iDY = 3 * astHeight + 4 * offsetHori-4;
        //var iDX = astWidth + 2 * offsetVert-2;
        return new java.awt.Dimension(iDX,iDY);
    }
    this.getHeadersWithoutUnits = function(){ 
        var oHeaderWithoutUnits = new Array();             
        for (var i=1;i<this.iRows;i++){
            for (var j=1; j<this.iCols; j++){
                var oUnitOcc = this.oMatrix[i][j];
                if (oUnitOcc == null){
                    var oRowHeader = this.getObjOcc(i,this.iRowHeaderCol);
                    var oColHeader = this.getObjOcc(this.iColHeaderRow,j);
                    if (oRowHeader!=null && oColHeader!=null) oHeaderWithoutUnits.push(new relatedHeaderObjOcc(oRowHeader, oColHeader, i, j));                   
                }    
            }
        } 
        return oHeaderWithoutUnits;
    }
    this.updateAttrOccs = function(p_oUnitOcc) {
        // delete name
        oPsmUnitHelper = new psmUnitHelper(p_oUnitOcc, this.oModel);
        oPsmUnitHelper.updateAttrOccs();
        /*var oAttrOccs = Designer.getAttrOccs(this.oModel, p_oUnitOcc);
        for (var i = 0; i < oAttrOccs.length; i++) {
            var oAttrOcc = oAttrOccs[i];
            if (oAttrOcc.getAttrTypeNum() == Constants.AT_NAME) {
                Designer.deleteAttrOcc(this.oModel, oAttrOcc);
                break;
            }
        }
        // add processing type
        Designer.createAttrOcc(this.oModel, p_oUnitOcc, Constants.ATTROCC_CENTER, Constants.AT_PROCESSING_TYPE, Constants.ATTROCC_ALIGN_CENTER, Constants.ATTROCC_SYMBOL); */
    }
    this.addNewUnitOcc = function(p_oUnitDef,p_iRow,p_iCol){
        if (p_oUnitDef != null) {
            var iColStart = Designer.getStart(this.oModel,this.oCols[p_iCol]) + 1;
            var iRowStart = Designer.getStart(this.oModel,this.oRows[p_iRow]) + 1;           
            var oUnitOcc = Designer.createObjOcc(this.oModel, p_oUnitDef, Constants.ST_PROCESS_SUPPORT_UNIT, new java.awt.Point(iColStart, iRowStart));
            var oNewUnitDim = new java.awt.Dimension(Designer.getEnd(this.oModel,this.oCols[p_iCol])-iColStart -1,Designer.getEnd(this.oModel,this.oRows[p_iRow])-iRowStart -1);
            Designer.setSize(this.oModel, oUnitOcc, oNewUnitDim);
            //this.updateAttrOccs(oUnitOcc);
            this.oMatrix[p_iRow][p_iCol] = oUnitOcc;
            this.addUnit(oUnitOcc, p_oUnitDef, p_iRow, p_iCol)
        }
    }
    this.getHeader = function(p_oUnitOcc, p_bRow){
        oUnitPos = this.oUnitOccMap.get(p_oUnitOcc);
        if (oUnitPos==null) return null;
        if (p_bRow) {
            return this.getObjOcc(oUnitPos[0],this.iRowHeaderCol);
        } else return this.getObjOcc(this.iColHeaderRow,oUnitPos[1]);
    }
    this.getAllUnitOccs = function(){
        return this.oUnitOccArray;
    }
    this.getUnitOccs = function(p_oUnitDef){
        var oPosArrays = this.oUnitDefMap.get(p_oUnitDef);
        var unitOccs = new Array();
        for (var i=0; i<oPosArrays.length; i++){
            var oPosArray = oPosArrays[i];
            unitOccs.push(this.oMatrix[oPosArray[0]][oPosArray[1]]);
        }
        return unitOccs;
    }
    this.getAssignedOccs = function(p_oUnitOcc){
        if (this.oAssignedObjOccs.containsKey(p_oUnitOcc)){
            return this.oAssignedObjOccs.get(p_oUnitOcc);
        }
        return new Array();
    }
    this.getAssignedDefs = function(p_oUnitDef){        
        if (this.oAssignedObjDefs.containsKey(p_oUnitDef)){
            return this.oAssignedObjDefs.get(p_oUnitDef);
        }
        return new Array();
    }
    this.getRow = function(p_iRow){
        if (p_iRow<this.iRows) return this.oMatrix[p_iRow];
        return null;
    }
    this.getCol = function(p_iCol){
        if (p_iCol<this.iCols) {
            var res = new Array();
            for (var i=0;i<this.iRows;i++) {
                res.push(this.oMatrix[i][p_iCol])
            }
            return res;
        }    
        return null;
    }
    this.getHeaders = function(p_bRowHeader){
        var aHeaders = new Array();
        if (p_bRowHeader){
            aHeaders = this.getCol(this.iRowHeaderCol);
            aHeaders.splice(this.iColHeaderRow,1);
        } else {
            aHeaders = this.getRow(this.iColHeaderRow);
            aHeaders.splice(this.iRowHeaderCol,1);
        }    
        return aHeaders;
    }
    this.getUnitOcc4Headers = function(p_RowHeaderOcc, p_ColHeaderOcc){
        var oUnitOcc;
        var iColIndex = this.oColHeaderMap.get(p_ColHeaderOcc);
        var iRowIndex = this.oRowHeaderMap.get(p_RowHeaderOcc);
        if (iColIndex!=null && iRowIndex!=null){
            oUnitOcc = this.oMatrix[parseInt(iRowIndex)][parseInt(iColIndex)];
        }
        return oUnitOcc;
    }
    this.addAssignedDefs = function(p_oUnitDef,p_oAssignedDef,p_oCxnDef){                                    
        if (this.oAssignedObjDefs.containsKey(p_oUnitDef)){
            var oAssignments = this.oAssignedObjDefs.get(p_oUnitDef);
            if (this.oAssignedObjDefsMap.containsKey(p_oUnitDef)){
                var oAssignmentLst = this.oAssignedObjDefsMap.get(p_oUnitDef);
                if (!oAssignmentLst.contains(p_oAssignedDef)){
                    oAssignments.push(new relatedCxnObj(p_oCxnDef, p_oAssignedDef));
                }
            } else {
                oAssignments.push(new relatedCxnObj(p_oCxnDef, p_oAssignedDef));
            }    
        } else {
            var oAssignments = new Array(new relatedCxnObj(p_oCxnDef, p_oAssignedDef));
            this.oAssignedObjDefs.put(p_oUnitDef,oAssignments);
        }  
        if (this.oAssignedObjDefsMap.containsKey(p_oUnitDef)){
            var oAssignmentLst = this.oAssignedObjDefsMap.get(p_oUnitDef);
            if (!oAssignmentLst.contains(p_oAssignedDef)){
                oAssignmentLst.add(p_oAssignedDef);  
            }    
        } else {
            var oAssignmentLst = new java.util.ArrayList();
            oAssignmentLst.add(p_oAssignedDef);
            this.oAssignedObjDefsMap.put(p_oUnitDef,oAssignmentLst);
        }
    }
    this.addColHeaderCxn = function(p_unitOcc,p_oObjOcc,p_oCxnOcc){        
        if (this.oRelatedColHeaders.containsKey(p_oObjOcc)){
            var oAssignments = this.oRelatedColHeaders.get(p_oObjOcc);
            oAssignments.push(new relatedCxnObj(p_oCxnOcc, p_unitOcc));
        } else {
            var oAssignments = new Array(new relatedCxnObj(p_oCxnOcc, p_unitOcc));
            this.oRelatedColHeaders.put(p_oObjOcc,oAssignments);
        }
    }
    this.addRowHeaderCxn = function(p_oUnitOcc,p_oObjOcc,p_oCxnOcc){        
        if (this.oRelatedColHeaders.containsKey(p_oObjOcc)){
            var oAssignments = this.oRelatedRowHeaders.get(p_oObjOcc);
            oAssignment.push(new relatedCxnObj(p_oCxnOcc, p_oUnitOcc));
        } else {
            var oAssignments = new Array(new relatedCxnObj(p_oCxnOcc, p_oUnitOcc));
            this.oRelatedRowHeaders.put(p_oObjOcc,oAssignments);
        }
    }
    this.addOccAssignment = function(p_oUnitOcc,p_oObjOcc,p_oCxnOcc){
        if (p_oUnitOcc!=null && p_oObjOcc!=null){
            if (this.oAssignedObjOccs.containsKey(p_oUnitOcc)){
                var oAssignments = this.oAssignedObjOccs.get(p_oUnitOcc);
                oAssignments.push(new relatedCxnObj(p_oCxnOcc, p_oObjOcc));
            } else {
                var oAssignments = new Array(new relatedCxnObj(p_oCxnOcc, p_oObjOcc));
                this.oAssignedObjOccs.put(p_oUnitOcc,oAssignments);
            }
            this.oAllAssigmentObjOccs.put(p_oObjOcc,null);
        }    
        /*if (this.oAssignedObjOccDefs.containsKey(p_oUnitOcc)){
            var oAssignmentLst = this.oAssignedObjOccDefs.get(p_oUnitOcc);
            oAssignmentLst.add(Designer.getDefinition(p_oObjOcc));
        } else {
            var oAssignmentLst = new java.util.ArrayList();
            oAssignmentLst.add(Designer.getDefinition(p_oObjOcc));
            this.oAssignedObjOccDefs.put(p_oUnitOcc,oAssignments);
        }*/
        
    }  
    this.deleteOccAssignment = function(p_oUnitOcc){
        if (p_oUnitOcc!=null){
            this.oAssignedObjOccs.remove(p_oUnitOcc)
        } 
        
    }  
    this.deleteAssignedOcc = function(p_oUnitOcc,p_oAssignedOcc){
        if (p_oUnitOcc!=null && p_oAssignedOcc!=null){
            var oAssignedObjOccs = this.oAssignedObjOccs.get(p_oUnitOcc);
            if (oAssignedObjOccs!=null){
                for (var i=0; i<oAssignedObjOccs.length; i++){
                    var oAssignedObjOcc = oAssignedObjOccs[i].oObj;
                    if (oAssignedObjOcc.equals(p_oAssignedOcc)){
                        oAssignedObjOccs.splice(i,1);
                    }
                }
            }    
        }    
        /*if (this.oAssignedObjOccDefs.containsKey(p_oUnitOcc)){
            var oAssignmentLst = this.oAssignedObjOccDefs.get(p_oUnitOcc);
            oAssignmentLst.add(Designer.getDefinition(p_oObjOcc));
        } else {
            var oAssignmentLst = new java.util.ArrayList();
            oAssignmentLst.add(Designer.getDefinition(p_oObjOcc));
            this.oAssignedObjOccDefs.put(p_oUnitOcc,oAssignments);
        }*/
        
    }  
    this.col4ObjOcc = function(p_objOcc){
        var iCol = this.iLastCol;
        var oPos = Designer.getPosition(this.oModel,p_objOcc);
        for (var i=0; i<this.oCols.length;i++){
            if (Designer.getStart(this.oModel,this.oCols[iCol])<=oPos.getX() && oPos.getX()<=Designer.getEnd(this.oModel,this.oCols[iCol])) {
                return iCol;
           } else {
               iCol++;
               if (iCol == this.oCols.length){
                   iCol=0;
               }    
           }
        }
    }    
    this.row4ObjOcc = function(p_objOcc){
        var iRow = this.iLastRow;
        var oPos = Designer.getPosition(this.oModel,p_objOcc);
        for (var i=0; i<this.oRows.length;i++){
            if (Designer.getStart(this.oModel,this.oRows[iRow])<=oPos.getY() && oPos.getY()<=Designer.getEnd(this.oModel,this.oRows[iRow])) {
                return iRow;
           } else {
               iRow++;
               if (iRow == this.oRows.length){
                   iRow=0;
               }    
           }
        }
    }  
    this.add = function(p_oObjOcc){           
        this.iLastRow = this.row4ObjOcc(p_oObjOcc);
        this.iLastCol = this.col4ObjOcc(p_oObjOcc);
        if (this.oMatrix[this.iLastRow][this.iLastCol]!=null) {            
            if (Designer.getDefinition(p_oObjOcc).equals(Designer.getDefinition(this.oMatrix[this.iLastRow][this.iLastCol]))){                         
               var iResult = Context.MsgBox(formatText1(getString("DOUBLE_UNITOCC_MSG"), getAttribute_Name(Designer.getDefinition(p_oObjOcc), null)), getString("DOUBLE_UNITOCC_TITLE"),Constants.MSGBOX_ICON_WARNING,Constants.MSGBOX_BTN_OKCANCEL);
               if (iResult = Constants.MSGBOX_RESULT_OK) {
                   Designer.deleteOcc(this.oModel, p_oObjOcc);
               } else {                            
                   return false;   
               }
            } else {                            
                return false;   
            }
        } else {
            this.oMatrix[this.iLastRow][this.iLastCol] = p_oObjOcc;
            if (this.iLastRow==this.iColHeaderRow) this.oColHeaderMap.put(p_oObjOcc,this.iLastCol);
            if (this.iLastCol==this.iRowHeaderCol) this.oRowHeaderMap.put(p_oObjOcc,this.iLastRow);
            if (this.iLastRow!=this.iColHeaderRow && this.iLastCol!=this.iRowHeaderCol) {
                var oUnitDef = Designer.getDefinition(p_oObjOcc);
                this.addUnit(p_oObjOcc, oUnitDef, this.iLastRow, this.iLastCol);
            }
        }    
        return true;
    }     
    this.addUnit = function(p_oObjOcc, p_oObjDef, p_iLastRow, p_iLastCol){   
        this.oUnitOccMap.put(p_oObjOcc, new Array(p_iLastRow, p_iLastCol));
        this.oUnitOccArray.push(p_oObjOcc);
        if (this.oUnitDefMap.containsKey(p_oObjDef)) {
            var oUnitDefOccs = this.oUnitDefMap.get(p_oObjDef);
            oUnitDefOccs.push(new Array(p_iLastRow, p_iLastCol));
        } else {
            this.oUnitDefMap.put(p_oObjDef, new Array(new Array(p_iLastRow, p_iLastCol)));
            this.oUnitDefArray.push(p_oObjDef);
        }
    }
    this.getObjOcc = function(p_iRow,p_iCol){
        if (p_iRow<this.iRows && p_iCol<this.iCols){
            return this.oMatrix[p_iRow][p_iCol];
        }
        return null;
    }
    this.get3PacksSqrt = function(p_iCount){
        var result = p_iCount / 3;
        var i3Packs = Math.ceil(result);
        return Math.sqrt(i3Packs);
    }
    this.getHightDiff = function(p_iLaneStart, p_iLaneEnd, p_iCount){
        var i3PacksRows = 3 * Math.ceil(this.get3PacksSqrt(p_iCount));
        //var iNewHight = i3PacksRows * astWidth + (i3PacksRows + 1) * offsetVert;
        var iNewHight = i3PacksRows * astHeight + (i3PacksRows + 1) * offsetVert;
        var iOldHight = p_iLaneEnd - p_iLaneStart
        return iNewHight - iOldHight;
    }
    this.getWidthDiff = function(p_iLaneStart, p_iLaneEnd, p_iCount){        
        var i3PacksCols = Math.round(this.get3PacksSqrt(p_iCount));
        var iNewWidth = i3PacksCols * astWidth + (i3PacksCols + 1) * offsetHori;
        var iOldWidth = p_iLaneEnd - p_iLaneStart;
        return iNewWidth - iOldWidth;
    }
    this.refillAssignments = function(p_oUnitOcc,p_iRowStart,p_iColStart,p_iDim){
        var iColEnd = p_iColStart + p_iDim;
        var oAssignments = this.getAssignedOccs(p_oUnitOcc);
        var oAssignmentOccs = new Array();
        var bNewRow = true;
        oAssignments.sort(SortRelByName);
        oAssignmentPos = new java.awt.Point(p_iColStart + offsetHori, p_iRowStart + offsetVert);
        for (var j=0; j<oAssignments.length; j++) {
            var oAssignmentOcc = oAssignments[j].oObj;
            //oAssignmentOccs .push(oAssignments[j].oObj);
            Designer.setPosition(this.oModel, oAssignmentOcc, oAssignmentPos);
            Designer.setShaded(this.oModel, oAssignmentOcc, false);  
            if (p_iDim > 0) {
                bNewRow =  oAssignmentPos.x + 2* astWidth + offsetHori> iColEnd;           
                if (bNewRow) { // -> new Row
                    oAssignmentPos.x = p_iColStart + offsetHori;
                    oAssignmentPos.y = oAssignmentPos.y + astHeight + offsetVert;
                }
                else { // new Col
                    oAssignmentPos.x = oAssignmentPos.x + astWidth + offsetHori;     
                }
            }  
            Designer.setSize(this.oModel, oAssignmentOcc, astDimension);
        }
        //if (oAssignmentOccs.length>0) Designer.toFront(selectedModel,oAssignmentOccs);
    } 
    this.rePosResize = function(p_oOcc, p_iRowStart, p_iRowDim, p_iColStart, p_iColDim, p_oDim){  
        if (p_oOcc!=null){          
            var oX = p_iColStart + (p_iColDim - p_oDim.getWidth()) / 2;        
            var oY = p_iRowStart + (p_iRowDim - p_oDim.getHeight()) / 2;
            var oPos = new java.awt.Point(oX, oY);
            Designer.setPosition(this.oModel, p_oOcc, oPos);
            Designer.setSize(this.oModel, p_oOcc, p_oDim); 
            Designer.setShaded(this.oModel, p_oOcc, false);  
        }    
    } 
    this.RenameLaneHeader = function(p_lane,p_headerOcc){
        if (p_headerOcc!=null){
            var sHeaderName=getAttribute_Name(Designer.getDefinition(p_headerOcc),null);
            var oldName = Designer.getAttribute(p_lane, Constants.AT_NAME, null);
            if (oldName==null || oldName.getValue() != sHeaderName) {
                Designer.setAttribute(this.oModel, p_lane, Constants.AT_NAME, sHeaderName, null);
            }
        }
    }    
    this.addUnitOccsToLayout = function(p_oUnitDef){
        var oPosArrays = this.oUnitDefMap.get(p_oUnitDef);
        var unitOccs = new Array();
        for (var i=0; i<oPosArrays.length; i++){
            var oPosArray = oPosArrays[i];
            this.oUnitOccToLayout.put(this.oMatrix[oPosArray[0]][oPosArray[1]],null);
        }
    }
    this.setUnitOccsToUpdate = function(p_oUnitsToUpdate){
        for (var i=0; i<p_oUnitsToUpdate.length;i++){
            this.addUnitOccsToLayout(p_oUnitsToUpdate[i]);
            
        }
    }
    
    this.layoutPsm = function(p_oUnitsToUpdate){
    	if ("" + iCurrentSymbolScaleFactor!="" + iSymbolScaleFactor){
           setGlobalLayoutDimVars(iSymbolScaleFactor);
           Designer.loadAttributes(this.oUnitDefArray, [this.oDBLang]);     // BLUE-4790
           this.setUnitOccsToUpdate(this.oUnitDefArray);
        }  else this.setUnitOccsToUpdate(p_oUnitsToUpdate);
        if (this.iRows>1 && this.iCols>1){
            var oColsMax = new Array(this.iCols);
            var oRowsMax = new Array(this.iRows); 
            var oColsDiffs = new Array(this.iCols);
            var oRowsDiffs = new Array(this.iRows);
            var oColsDims = new Array(this.iCols);
            var oRowsDims = new Array(this.iRows);
            var oColsStart = new Array(this.iCols);
            var oRowsStart = new Array(this.iRows);
            for (var i=0;i<this.iRows;i++){     
                oRowsMax[i] = 1;
                for (var j=0; j<this.iCols; j++){
                    if (i == 0) oColsMax[j] = 1;
                    if (i==this.iColHeaderRow || j==this.iRowHeaderCol) continue;
                    var oUnitOcc = this.oMatrix[i][j];
                    if (oUnitOcc !=null){
                        var oAssignedOccsLength = this.getAssignedOccs(oUnitOcc).length; 
                        if (oRowsMax[i]<=oAssignedOccsLength) oRowsMax[i] = oAssignedOccsLength;
                        if (oColsMax[j]<=oAssignedOccsLength) oColsMax[j] = oAssignedOccsLength;
                    } 
                }
            }          
            for (var i=0; i<this.iRows; i++){ 
                var oRow = this.oRows[i];                
                if (i!=this.iColHeaderRow) this.RenameLaneHeader(oRow,this.getObjOcc(i,this.iRowHeaderCol));
                var iRowStart = Designer.getStart(this.oModel,oRow);
                var iRowEnd = Designer.getEnd(this.oModel,oRow);   
                oRowsStart[i] = iRowStart;
                var iRowDiff = this.getHightDiff(iRowStart, iRowEnd, oRowsMax[i]);
                oRowsDiffs[i] = iRowDiff;
                oRowsDims[i] = iRowEnd - iRowStart + iRowDiff;
                if (iRowDiff>1) {
                    if (Designer.getEnd(this.oModel,this.oRows[this.iRows-1]) + iRowDiff > Constants.MODEL_CANVAS_MAXHEIGHT) return false;
                    Designer.resize(this.oModel, oRow, iRowEnd + iRowDiff);
                } 
                this.rePosResize(this.oMatrix[i][this.iRowHeaderCol], iRowStart, oRowsDims[i], Designer.getStart(this.oModel,this.oCols[this.iRowHeaderCol]), Designer.getEnd(this.oModel,this.oCols[this.iRowHeaderCol])- Designer.getStart(this.oModel,this.oCols[this.iRowHeaderCol]) + this.getWidthDiff(Designer.getStart(this.oModel,this.oCols[this.iRowHeaderCol]), Designer.getEnd(this.oModel,this.oCols[this.iRowHeaderCol]), 1), locDimension);
                /*if (iRowDiff>1 || iRowDiff<-1) {
                    this.rePositionRowHeader(this.oMatrix[i][0], iRowStart, oRowsDims[i]);
                } */   
            } 
            for (var j=0; j<this.iCols; j++){
                var oCol = this.oCols[j];            
                if (j!=this.iRowHeaderCol) this.RenameLaneHeader(oCol,this.getObjOcc(this.iColHeaderRow,j));
                var iColStart = Designer.getStart(this.oModel, oCol);
                var iColEnd = Designer.getEnd(this.oModel, oCol); 
                oColsStart[j] = iColStart;
                var iColDiff = this.getWidthDiff(iColStart, iColEnd, oColsMax[j]);
                oColsDiffs[j] = iColDiff;
                oColsDims[j] = iColEnd - iColStart + iColDiff;
                if (iColDiff>1) {
                    if (Designer.getEnd(this.oModel,this.oCols[this.iCols-1]) + iColDiff > Constants.MODEL_CANVAS_MAXHEIGHT) return false;
                    Designer.resize(this.oModel, oCol, iColEnd + iColDiff);
                } 
                this.rePosResize(this.oMatrix[this.iColHeaderRow][j], Designer.getStart(this.oModel,this.oRows[this.iColHeaderRow]), oRowsDims[this.iColHeaderRow], iColStart, oColsDims[j], funcDimension);  
                /*if (iColDiff>1 || iColDiff<-1) {           
                    this.rePositionColHeader(this.oMatrix[0][j], iColStart, oColsDims[j])
                }*/    
            }     
            if (this.oUnitOccToLayout.size()>0){
                for (var i=0;i<this.iRows;i++){ 
                    if (i==this.iColHeaderRow) continue;
                    var iRowStart = oRowsStart[i];
                    for (var j=0; j<this.iCols; j++){
                        if (j==this.iRowHeaderCol) continue;
                        var iColStart = oColsStart[j];
                        var iColDim = oColsDims[j];
                        var oUnitOcc = this.oMatrix[i][j];
                        if (oUnitOcc == null || (!this.oUnitOccToLayout.containsKey(oUnitOcc) && oRowsDiffs[i]>-1  && oRowsDiffs[i]<1 && oColsDiffs[j]>-1 && oColsDiffs[j]<1)) continue; //unit is not changed and col and row are not resized
                        if (oRowsDiffs[i]<-1 && oColsDiffs[j]<-1) { //Row and Col get smaller
                            this.refillAssignments(oUnitOcc,iRowStart,iColStart,iColDim);
                        } else if ((oRowsDiffs[i]<-1 && oColsDiffs[j]>=-1) || (oRowsDiffs[i]>=-1 && oColsDiffs[j]<-1)) this.refillAssignments(oUnitOcc,iRowStart,iColStart,0); //only one gets smaller all have to be refilled in the upper left corner
                        var oNewUnitDim = new java.awt.Dimension(iColDim-2,oRowsDims[i]-2);            
                        this.rePosResize(this.oMatrix[i][j],  iRowStart, oRowsDims[i] , iColStart, iColDim, oNewUnitDim); 
                        /*if ((oRowsDiffs[i]>1 || oRowsDiffs[i]<-1) || (oColsDiffs[j]>1 || oColsDiffs[j]<-1)){
                            var oNewUnitDim = new java.awt.Dimension(iColDim-2,oRowsDims[i]-2);
                            Designer.setSize(this.oModel,oUnitOcc,oNewUnitDim);
                        } */
                        if ((oRowsDiffs[i]>=-1 || oColsDiffs[j]>=-1)) this.refillAssignments(oUnitOcc,iRowStart,iColStart,iColDim); //if at least one dim gets bigger
                    }
                }    
            }
            for (var i=0; i<this.iRows; i++){ 
                var oRow = this.oRows[i];
                var iRowEnd = Designer.getEnd(this.oModel,oRow);
                if (oRowsDiffs[i]<-1) {
                    Designer.resize(this.oModel, oRow, iRowEnd + oRowsDiffs[i]);
                } 
            } 
            for (var j=0; j<this.iCols; j++){
                var oCol = this.oCols[j];
                var iColEnd = Designer.getEnd(this.oModel, oCol); 
                if (oColsDiffs[j]<-1) {
                    Designer.resize(this.oModel, oCol, iColEnd + oColsDiffs[j]);
                } 
            }
        }    
        
        return true;
    } 
}
function psmUnitHelper(p_oUnitOcc, p_oModel){
    this.oUnitOcc = p_oUnitOcc;
    this.oModel = p_oModel; 
    this.oUnitDef = Designer.getDefinition(p_oUnitOcc);
    this.oUnitStatus = Designer.getAttribute(this.oUnitDef, Constants.AT_PROCESSING_TYPE, null);
    this.iUnitSymbol = Designer.getSymbol(this.oModel, this.oUnitOcc);      
    this.oUnitPosition = Designer.getPosition(this.oModel, this.oUnitOcc);
    this.iUnitSymbolNormal = Constants.ST_PROCESS_SUPPORT_UNIT;
    this.iUnitSymbolHidden = Constants.ST_PROCESS_SUPPORT_UNIT_1;  
    this.oUnitName = Designer.getAttributeWithFallbackAndLanguageSuffix(this.oUnitDef, Constants.AT_NAME, null);
    this.oPsmHistoryHelper = new psmHistoryHelper(p_oModel,this.oUnitDef);
    this.updateAssignedOccs = function(p_oAssignedObjOccs,p_oAssignedObjDefs,p_oAllDefs,p_oPsmAssignedAstHelper){
        //if (this.isToHide()){
        if (this.iUnitSymbol==this.iUnitSymbolNormal){    
            var oCxnDefLst = new java.util.ArrayList();
            var iLength = p_oAssignedObjOccs.length;
            for (var i=0; i<iLength; i++){
                var oUnitRelation = p_oAssignedObjOccs[i];
                var oAssignedOcc = oUnitRelation.oObj;
                var oCxnDef = p_oAllDefs.get(oUnitRelation.oCxn);        
                if (!oCxnDefLst.contains(oCxnDef)){
                    oCxnDefLst.add(oCxnDef)          
                    if (p_oPsmAssignedAstHelper.isVisable(oCxnDef)){
                        p_oPsmAssignedAstHelper.setAllocationBGColor(oAssignedOcc);
                        p_oPsmAssignedAstHelper.setAllocationBorderStyle(oAssignedOcc);
                    } else {                                                         
                        Designer.deleteOcc(this.oModel, oAssignedOcc);          
                        if (oStopWatch) oStopWatch.sum("deleteAssignedOcc");
                        p_oAssignedObjOccs.splice(i,1);
                        iLength--;
                        i--;            
                    }
                } else {                    
                    Designer.deleteOcc(this.oModel, oAssignedOcc);
                    p_oAssignedObjOccs.splice(i,1);
                    iLength--;
                    i--;                
                }    
            }        
            for (var i=0; i<p_oAssignedObjDefs.length; i++){
                var oUnitRelation = p_oAssignedObjDefs[i];
                if (!oCxnDefLst.contains(oUnitRelation.oCxn)) {
                    if (p_oPsmAssignedAstHelper.isVisable(oUnitRelation.oCxn)){                                 
                        var oRelationOcc = this.addCxnAndAllocationOcc(oUnitRelation.oCxn, oUnitRelation.oObj);   
                        p_oAssignedObjOccs.push(oRelationOcc);
                        p_oPsmAssignedAstHelper.setAllocationBGColor(oRelationOcc.oObj);
                        p_oPsmAssignedAstHelper.setAllocationBorderStyle(oRelationOcc.oObj);                           
                    } 
                }    
            } 
        }
    }    
    this.hasWriteAccess = function(){
       return Designer.hasWriteAccess(this.oUnitDef); 
    }
    this.isToHide = function(){
        var result = false;
        if (this.oUnitStatus != null){
            result = (this.iUnitSymbol==this.iUnitSymbolNormal && this.oUnitStatus.getValue()==Constants.AVT_SYSTEM)
        }
        return result;
    }  
    this.isHidden = function(){
        var result = false;
        if (this.oUnitStatus != null){
            result = (this.iUnitSymbol==this.iUnitSymbolHidden && this.oUnitStatus.getValue()==Constants.AVT_SYSTEM)
        }
        return result;
    }    
    this.setHideSymbol= function(){
        // Symbol austauschen
        Designer.setSymbol(this.oModel, this.oUnitOcc, this.iUnitSymbolHidden);
    }    
    this.setNormalSymbol= function(){
        // Symbol austauschen
        Designer.setSymbol(this.oModel, this.oUnitOcc, this.iUnitSymbolNormal);
    }        
    this.isValidAssignedAllocation = function(cxnDef) {
        var statusSupport = Designer.getAttribute(cxnDef, Constants.AT_PROC_SUPPORT_STATUS, null);
        if (statusSupport != null && statusSupport.getValue() != 0) {
            return true;
        }
        else {
            return false;
        }
    }
    this.getCxnOcc4Allocation = function(p_oAstDef){
        var oCxnOccs = Designer.getIncomingCxns(this.oModel,this.oUnitOcc);        
        for (var j=0; j<oCxnOccs.length; j++) {
            var oCxnOcc = oCxnOccs[j];
            var oCxnDef = Designer.getDefinition(oCxnOcc);
            if (isAssignmentCxn(oCxnDef.getType())){ 
                var oAstOcc = Designer.getSource(this.oModel,oCxnOcc);
                var oAstDef = Designer.getDefinition(oAstOcc);
                if (oAstDef.equals(p_oAstDef)){
                    return oCxnOcc;
                }
            }
        }    
        return null; 
    }
    this.getAllocationOcc = function(p_oAstDef){
        var oCxnOcc= this.getCxnOcc4Allocation(p_oAstDef);
        if (oCxnOcc!=null){
            return Designer.getSource(this.oModel,oCxnOcc);
        }
        return null;
    }
    this.getAllocations = function() {
        var oCxnObjDefList = new Array();
        var oCxns = Designer.getIncomingCxns(this.oUnitDef);
        for (var i = 0; i < oCxns.length; i++) {   
            var oCxnDef = oCxns[i];
            if (isAssignmentCxn(oCxnDef.getType()) && this.isValidAssignedAllocation(oCxnDef)) {
                var oSourceObjDef = Designer.getSource(oCxnDef);
                //if (isAssignedObj(oSourceObjDef.getType())) {
                if (g_oPsmConfig.isValidAllocation(oSourceObjDef)) {                    
                    oCxnObjDefList.push(new relatedCxnObj(oCxnDef, oSourceObjDef));
                }
            }
        }
        return oCxnObjDefList;
    }          
    this.findTargetCxnDef = function(oAllocDef,aTargetCxnObjDefs){                  
        for (var j = 0; j < aTargetCxnObjDefs.length; j++) {
            var oTargetDef = aTargetCxnObjDefs[j].oObj;   
            if (oAllocDef.equals(oTargetDef)  && this.isValidAssignedAllocation(aTargetCxnObjDefs[j].oCxn)) return aTargetCxnObjDefs[j].oCxn;
        }
        return null;
    }
    this.copyUnitInformation = function(oSourceUnit, bSourceOverwritesTarget) {
        this.copyAttr_ProcessingType(oSourceUnit, bSourceOverwritesTarget);

        var aSourceCxnObjDefs = oSourceUnit.getAllocations();
        var aTargetCxnObjDefs = this.getAllocations();        
        for (var j = 0; j < aSourceCxnObjDefs.length; j++) {
            var oSourceDef = aSourceCxnObjDefs[j].oObj;
            var oSourceCxn = aSourceCxnObjDefs[j].oCxn;        
    
            var oTargetCxn = this.findTargetCxnDef(oSourceDef,aTargetCxnObjDefs);
            if (oTargetCxn!=null && bSourceOverwritesTarget){                
                var aSourceValues = getCxnAttrValues(oSourceCxn);
                writeAttributes(this.oModel,oTargetCxn,oSourceDef,aSourceValues,this.oPsmHistoryHelper); 
            } else {
                var oNewAlloc = this.addNewAllocation(oSourceDef);
                oTargetCxn = Designer.getDefinition(oNewAlloc.oCxn);
                var aSourceValues = getCxnAttrValues(oSourceCxn);
                writeAttributes(this.oModel,oTargetCxn,oSourceDef,aSourceValues,this.oPsmHistoryHelper);       
            }
        }
        this.updateLastChangeTStamp();
    }
    this.copyAttr_ProcessingType = function(oSourceUnit, bSourceOverwritesTarget) {
        var nATN = Constants.AT_PROCESSING_TYPE;
        var oSourceAttr = oSourceUnit.oUnitStatus;            
        var bCopyAttr = false;
        if (oSourceAttr != null) {
            var sourceValue = oSourceAttr.getValue();
    
            if (this.oUnitStatus == null) {
                bCopyAttr = true;
            } else {
                targetValue = this.oUnitStatus.getValue();
                if (targetValue != Constants.AVT_SYSTEM) {
                    if (sourceValue == Constants.AVT_MANUAL || sourceValue == Constants.AVT_NO_PROCESSING) {
                        bCopyAttr = bSourceOverwritesTarget;
                    } else {
                        bCopyAttr = true;                
                    }
                }
            }
        }
        if (bCopyAttr) this.setProcessingType(sourceValue);
    }
    this.setProcessingType = function(p_oNewState){
        var iOldState = 0;
        if (this.oUnitStatus !=null) iOldState = this.oUnitStatus.getValue() 
        if (iOldState!=p_oNewState) {
            if (p_oNewState <= 0) {
                Designer.deleteAttribute(this.oModel,this.oUnitDef, Constants.AT_PROCESSING_TYPE, null);
                this.oUnitStatus = null;
            } else {
                Designer.setAttribute (this.oModel,this.oUnitDef, Constants.AT_PROCESSING_TYPE, p_oNewState, null);
                this.oUnitStatus = Designer.getAttribute(this.oUnitDef, Constants.AT_PROCESSING_TYPE, null);
            }    
            this.oPsmHistoryHelper.addChangedProcessingType(null, Constants.AT_PROCESSING_TYPE, p_oNewState);
        };
    }     
    this.updateAttrOccs = function(){
        // delete name
        var oAttrOccs = Designer.getAttrOccs(this.oModel, this.oUnitOcc);
        for (var i = 0; i < oAttrOccs.length; i++) {
            var oAttrOcc = oAttrOccs[i];
            if (oAttrOcc.getAttrTypeNum() == Constants.AT_NAME || oAttrOcc.getAttrTypeNum() == Constants.AT_PROCESSING_TYPE || oAttrOcc.getAttrTypeNum() == Constants.AT_REM) {
                Designer.deleteAttrOcc(this.oModel, oAttrOcc);
            }
        }
        if (this.oUnitStatus==null) {
            // add processing type
            Designer.createAttrOcc(this.oModel, p_oUnitOcc, Constants.ATTROCC_CENTER, Constants.AT_REM, Constants.ATTROCC_ALIGN_CENTER, Constants.ATTROCC_TEXT); 
        } else if (this.oUnitStatus.getValue()==Constants.AVT_MANUAL ||this.oUnitStatus.getValue()==Constants.AVT_NO_PROCESSING) {
            // add processing type
            Designer.createAttrOcc(this.oModel, p_oUnitOcc, Constants.ATTROCC_CENTER, Constants.AT_PROCESSING_TYPE, Constants.ATTROCC_ALIGN_CENTER, Constants.ATTROCC_SYMBOL); 
        }
    }
    this.setComment = function(p_sPSUComment){
        Designer.setAttribute (this.oModel,this.oUnitDef, Constants.AT_REM, p_sPSUComment, null);
    }  
    this.addNewAllocation = function(p_oAstDef){        
       var oAstPoint = new java.awt.Point(this.oUnitPosition.x + 5, this.oUnitPosition.y + offsetHori); 
       var oAstOcc = Designer.createObjOcc(this.oModel, p_oAstDef, g_oPsmConfig.getDefaultSymbol(p_oAstDef.getType())/*Constants.ST_APPL_SYS_TYPE_2*/, oAstPoint);
       Designer.setSize(this.oModel, oAstOcc, astDimension);
       var oCxnPoints = new Array();
       var oCxnOcc = Designer.createCxnOccAndDefinition(this.oModel, oAstOcc, this.oUnitOcc, CXN_BELONGS2PROCUNIT, oCxnPoints, true, true);      
       var sStr = "Add Allocation";      
       this.oPsmHistoryHelper.addStartText(sStr);
       this.setProcessingType(Constants.AVT_SYSTEM); 
       this.oPsmHistoryHelper.addObjInfoStr(p_oAstDef);
       return new relatedCxnObj(oCxnOcc, oAstOcc);       
    }
    this.addCxnAndAllocationOcc = function(p_oCxnDef, p_oAstDef){
       var oAstPoint = new java.awt.Point(this.oUnitPosition.x + 5, this.oUnitPosition.y + offsetHori); 
       var oAstOcc = Designer.createObjOcc(this.oModel, p_oAstDef, g_oPsmConfig.getDefaultSymbol(p_oAstDef.getType())/*Constants.ST_APPL_SYS_TYPE_2*/, oAstPoint);
       Designer.setSize(this.oModel, oAstOcc, astDimension);                              
       if (oStopWatch) oStopWatch.sum("createObjOcc");
       var oCxnOcc = Designer.createCxnOcc(this.oModel, oAstOcc, this.oUnitOcc, p_oCxnDef, CXN_BELONGS2PROCUNIT, null, false, true);                           
       if (oStopWatch) oStopWatch.sum("createCxnOcc");
       return new relatedCxnObj(oCxnOcc, oAstOcc);
    }
    this.addCxnsAndAllocationOccs = function(p_oRelatedCxnObjs) {
        for (var j=0; j<p_oRelatedCxnObjs.length; j++) {
            var oRelatedCxnObj = p_oRelatedCxnObjs[j];
            this.addCxnAndAllocationOcc(oRelatedCxnObj.oCxn,oRelatedCxnObj.oObj);
        }
    }  
    this.deletePsmAllocationOccs = function(oInComingCxnOccs){
        for (var j=0; j<oInComingCxnOccs.length; j++) {
            var oIncomingCxnDef = Designer.getDefinition(oInComingCxnOccs[j]);
            if (oIncomingCxnDef.getType() == CXN_BELONGS2PROCUNIT) {
                var astOcc = Designer.getSource(this.oModel, oInComingCxnOccs[j]);
                Designer.deleteOcc(this.oModel, astOcc);
            }
        }
    }
    this.deleteHiddeenAllocationOcc = function(p_oAstDef){
        var sStr = "Deleted Allocation";      
        this.oPsmHistoryHelper.addStartText(sStr);
        this.oPsmHistoryHelper.addObjInfoStr(p_oAstDef);
    }
    this.deleteAllocationOcc = function(p_oAstOcc){
        Designer.deleteOcc(this.oModel, p_oAstOcc); 
        var sStr = "Deleted Allocation";      
        this.oPsmHistoryHelper.addStartText(sStr);
        this.oPsmHistoryHelper.addObjInfoStr(Designer.getDefinition(p_oAstOcc));
    }
    this.updateLastChangeTStamp = function() {
        var bChanged = this.oPsmHistoryHelper.addHistory();
        touchUnit(this.oModel, this.oUnitDef);
        return bChanged;
    }
    this.deletePsmAttributes = function(p_oCxnDef) {
        Designer.deleteAttribute(this.oModel, p_oCxnDef, Constants.AT_PROC_SUPPORT_STATUS, null);
        Designer.deleteAttribute(this.oModel, p_oCxnDef, Constants.AT_START_PLAN_PHASE_IN, null);
        Designer.deleteAttribute(this.oModel, p_oCxnDef, Constants.AT_PHASE_IN_PLAN, null);
        Designer.deleteAttribute(this.oModel, p_oCxnDef, Constants.AT_PHASE_IN_AS_IS, null);
        Designer.deleteAttribute(this.oModel, p_oCxnDef, Constants.AT_START_PLAN_PHASE_OUT, null);
        Designer.deleteAttribute(this.oModel, p_oCxnDef, Constants.AT_PHASE_OUT_PLAN, null);
        Designer.deleteAttribute(this.oModel, p_oCxnDef, Constants.AT_PHASE_OUT_AS_IS, null);
        Designer.deleteAttribute(this.oModel, p_oCxnDef, Constants.AT_TO_BE, null);
    }
}
function touchUnit(oModel, oUnitDef) {
    var now = new java.util.Date();
    if (oModel != null) {
        Designer.setAttribute(oModel, oUnitDef, Constants.AT_LAST_CHNG_2, now, null);    
    } else {
        Designer.setAttributePersistent(oUnitDef, Constants.AT_LAST_CHNG_2, now, null);        
    }
}

function relatedCxnObj(p_oCxn, p_oObj){
   this.oCxn = p_oCxn;
   this.oObj = p_oObj;        
}
function relatedHeaderObjOcc(p_oObjRow, p_oObjCol,p_iRow, p_iCol){
   this.oObjRow = p_oObjRow;
   this.oObjCol = p_oObjCol;        
   this.iRow = p_iRow;
   this.iCol = p_iCol;  
}
function setModelManipulation(p_oModel,p_bAllow){    
    Designer.setOperationAllowedInSpecialReadonlyMode(p_oModel, Constants.DESIGNER_OP_PASTE, p_bAllow);
    Designer.setOperationAllowedInSpecialReadonlyMode(p_oModel, Constants.DESIGNER_OP_MOVE, p_bAllow);
    Designer.setOperationAllowedInSpecialReadonlyMode(p_oModel, Constants.DESIGNER_OP_DELETE, p_bAllow);
    Designer.setOperationAllowedInSpecialReadonlyMode(p_oModel, Constants.DESIGNER_OP_DELETE_LANE, p_bAllow);
    Designer.setOperationAllowedInSpecialReadonlyMode(p_oModel, Constants.DESIGNER_OP_ADD_LANE, p_bAllow);
    Designer.setOperationAllowedInSpecialReadonlyMode(p_oModel, Constants.DESIGNER_OP_MOVE_LANE, p_bAllow);
}

function checkAllocationType(oObj) {
    if (isAssignedObj(oObj.getType())) return true;
    return false;
}
function noEscNoEvents(p_bChange){      
    enableCancellation(!p_bChange);
    setDispatchEvents(!p_bChange);
}
function prepairModel4Change(p_bChange){    
//    enableCancellation(!p_bChange);
//    setDispatchEvents(!p_bChange);
}

function getColHeaderName(theUnitDef) {
    var cxn_unit2function = Designer.getConnections([theUnitDef]);
    var oColHeader = null;
    for (var i = 0; i < cxn_unit2function.length; i++) {
        var oCxn = cxn_unit2function[i];         
        var oType = oCxn.getType();
        if (this.isColHeaderCxn(oType)) { 
            var oColDef = Designer.getTarget(oCxn);   
            if (this.isColHeaderObj(oColDef.getType())){
                oColHeader = oColDef;
            }
        } 
    }
    if (oColHeader != null) return getAttribute_Name(oColHeader, null);
    return new java.lang.String("");
}

function getRowHeaderName(theUnitDef) {
    var cxn_org2unit = Designer.getConnections([theUnitDef]);
    var oRowHeader = null;    
    for (var i = 0; i < cxn_org2unit.length; i++) {
        var oCxn = cxn_org2unit[i];              
        var oType = oCxn.getType();        
        if (this.isRowHeaderCxn(oType)) {                  
            var oSrcDef = Designer.getSource(oCxn);
            var oTrgDef = Designer.getTarget(oCxn);
            if (this.isUnitObj(oSrcDef.getType())&&this.isRowHeaderObj(oTrgDef.getType())) {
                oRowHeader = oTrgDef;
            } else if (this.isUnitObj(oTrgDef.getType())&& this.isRowHeaderObj(oSrcDef.getType())){                        
                oRowHeader = oSrcDef;
            }   
        } 
    }
    if (oRowHeader != null) return getAttribute_Name(oRowHeader, null);
    return new java.lang.String("");
}
function SortRelByName(aRel, bRel){
    return SortByName(aRel.oObj, bRel.oObj);
}

function stopWatch(p_sMakroname){
    this.start = new Date().getTime();
    this.lastStopOver = this.start;
    this.sMessage = p_sMakroname;
    this.sumMessage = new java.util.HashMap();
    this.sumDuration = new Array();
    this.nextSum = new Number(0);
    this.lastStopSum = this.lastStopOver;
    this.sum = function(p_sMessage){          
        var end = new Date().getTime();
        if (this.lastStopSum<this.lastStopOver) this.lastStopSum=this.lastStopOver;
        var oDuration = (end-this.lastStopSum)/1000;
        this.lastStopSum = end;
        if (this.sumMessage.containsKey(p_sMessage)){
            var sIndex = this.sumMessage.get(p_sMessage);
            this.sumDuration[sIndex] = this.sumDuration[sIndex] + oDuration;
        } else {            
            this.sumDuration.push(oDuration); 
            this.sumMessage.put(p_sMessage,this.nextSum);
            this.nextSum = new Number(this.nextSum+1);
        }            
    }
    this.endSum = function(p_sMessage){
        this.sum(p_sMessage);
        if (this.sumMessage.containsKey(p_sMessage)) {
            var sIndex = this.sumMessage.get(p_sMessage);
            var oDuration = this.sumDuration[sIndex];
            this.sMessage = this.sMessage + "\n" + p_sMessage + " dauerte in Summe :" + oDuration + " sec";
        }    
    }  
    this.stopOver = function(p_sMessage){
        var end = new Date().getTime();
        var oDuration = (end-this.lastStopOver)/1000;
        this.sMessage = this.sMessage + "\n" + p_sMessage + " dauerte :" + oDuration + " sec";
        this.lastStopOver = end;
    }
    this.end = function(p_sMessage){
        this.stopOver(p_sMessage);        
        var end = new Date().getTime();
        var oDuration = (end-this.start)/1000;
        Context.MsgBox(this.sMessage +"\nDas Makro dauerte :" + oDuration + " sec");
    } 
    this.addMessageText = function(p_sMessage){
        this.sMessage = this.sMessage + "\n" + p_sMessage;
    }
}

function createHeaderOccInLane(oModel, oHeaderObjDef, oPredLane, bNewLane, bNewPsm) {
    // get lane information
    var laneType;
    var laneIsVert;
    var oLane;
    var iHeadType = oHeaderObjDef.getType();
    if (isColHeaderObj(iHeadType)) {
            laneType = Constants.LT_SUPPORTS;
            laneIsVert = true;
    } else if (iHeadType == Constants.OT_LOC) {
            laneType = Constants.LT_CAN_BE_LOC_AT;
            laneIsVert = false;
    } else if (isRowHeaderObj(iHeadType)){
            laneType = Constants.LT_CAN_BE_USER_2;
            laneIsVert = false;
    }
    if (bNewLane) {
        oLane = Designer.createLane(oModel, oPredLane, laneType, laneIsVert); 
    } else {
        oLane = oPredLane;
    } 
    var laneStart = Designer.getStart(oModel, oLane);
    var laneEnd;
    var headerSymbol = g_oPsmConfig.getDefDefaultSymbol(oHeaderObjDef);
    // get obj occ information 
    
    var sStr = "Added Column Header";
    if (isColHeaderObj(iHeadType)) {
            laneEnd = laneStart + laneWidth;
            var headerPos = new java.awt.Point(laneStart + offsetHori, offsetVert);
            var headerSize = funcDimension;
    } else if (isRowHeaderObj(iHeadType)){
            laneEnd = laneStart + laneHeight;
            var headerPos = new java.awt.Point(offsetVert, laneStart + offsetHori)
            var headerSize = locDimension;
            sStr = "Added Row Header";
    }
    if (!bNewPsm) {
        var oPsmHistoryHelper = new psmHistoryHelper(oModel,oModel);
        oPsmHistoryHelper.addStartText(sStr);
        oPsmHistoryHelper.addObjInfoStr(oHeaderObjDef);
        oPsmHistoryHelper.addHistory();
    }    
    Designer.resize(oModel, oLane, laneEnd);

    var oHeaderObjOcc = Designer.createObjOcc(oModel, oHeaderObjDef, headerSymbol, headerPos);
    Designer.setSize(oModel, oHeaderObjOcc, headerSize);

    return oHeaderObjOcc;
}


function createUnitName(oColDef, oRowDef, language) {
    var halfLength = 40;
    var name1 = getAttribute_Name(oRowDef, language);
    var name2 = getAttribute_Name(oColDef, language);
   
    if (name1.length() + name2.length() > 2*halfLength) {   
        if (name1.length() > halfLength) {
            name1 = name1.substring(0, Math.max(halfLength, 2*halfLength - name2.length()));
        }
        if (name2.length() > halfLength) {
            name2 = name2.substring(0, Math.max(halfLength, 2*halfLength - name1.length()));
        }
    }
    return concatText(name1, name2);
}

function concatText(text1, text2) {
    if (text1 == "" && text2 == "") return ""; 
    return text1 + "_" + text2;
}

function getAttribute_Name(oItem, language) {
    var sName = Designer.getAttributeWithFallbackAndLanguageSuffix(oItem, Constants.AT_NAME, language);
    if (sName!= null) return sName.replaceAll("\n", " ");
    else return new java.lang.String("");
}

function getDBLanguages() {
    return Designer.getAllDBLanguages(getDatabase());
    
    function getDatabase() {
        if (Context.getSelectedDatabases().length > 0) {
            return Context.getSelectedDatabases()[0];
        }
        return Context.getLoginInfo(getSelection()[0]).getDatabase();
        
        function getSelection() {
            var selection = Context.getSelectedModels();
            if (selection.length == 0) selection = Context.getSelectedObjects();
            if (selection.length == 0) selection = Context.getSelectedObjOccs();
            if (selection.length == 0) selection = Context.getSelectedGroups();
            return selection;
        }    
    }        
}

function PsmError(message) {
   this.message = getString(message);
   this.toString = function() {
      return this.message
   }
}

function checkNotReadableUnits(oObjDefToCheck){        
        var result = true;
        var objTypes = new Array();
        objTypes[0] = Constants.OT_PROCESS_SUPPORT_UNIT;
        var groups = Designer.getNonReadableGroupsWithConnectedObjects(oObjDefToCheck, objTypes);
        var sMessage = ""
        for (var i = 0; i < groups.length; i++) {
            if (i==0) sMessage = sMessage + getString("UNREADABLE_UNITS") + "\n";
            sMessage = sMessage + Explorer.getGroupPath(groups[i]) + "\n";
        }
        if (sMessage!="") {
            Context.MsgBox(sMessage);
            result = false;
        }  
        return result;
    }
    
function isMacroSupportedModel(oModel) {
    var oAttr = Designer.getAttribute(oModel, Constants.AT_MACRO_SUPPORT, null);
    if (oAttr != null) {
        return (oAttr.getValue() == true);
    }
    return false;
}

function setAttr_MacroSupported(oModel, bValue) {
    Designer.setAttribute(oModel, oModel, Constants.AT_MACRO_SUPPORT, bValue, null);
}

function isFreezeModel(oModel) {
        var oAttr = Designer.getAttribute(oModel, Constants.AT_FREEZE_MODEL, null);
        if (oAttr != null) {
            return (oAttr.getValue() == true);
        }
    return false;
}

function setAttr_FreezeModel( oModel, bValue ){
    Designer.setAttribute( oModel, oModel, Constants.AT_FREEZE_MODEL, bValue, null);
    // Update history
    var oPsmHistoryHelper = new psmHistoryHelper(oModel, oModel);
    oPsmHistoryHelper.addStartText(bValue == true ? "<Freeze>" : "<Unfreeze>");
    oPsmHistoryHelper.addHistory();
}

function formatText1(sText, sValue1) {
    return (new String(sText)).replace("@1", sValue1);
}

function formatText2(sText, sValue1, sValue2) {
    var sNewText = (new String(sText)).replace("@1", sValue1);
    sNewText = sNewText.replace("@2", sValue2);
    return sNewText;
}

function updateUnitAttributes(p_oUnitDef, p_oColDef, p_oRowDef, language, oModel) {
    var sName = createUnitName(p_oColDef, p_oRowDef, language);
    var sFullname = concatText(getAttribute_Name(p_oRowDef, language) + getTypeNumber(p_oRowDef), getAttribute_Name(p_oColDef, language) + getTypeNumber(p_oColDef));
    var sSource = concatText(Designer.getGUID(p_oRowDef) + getTypeNumber(p_oRowDef), Designer.getGUID(p_oColDef) + getTypeNumber(p_oColDef));
    
    if (oModel != null) {
        Designer.setAttribute(oModel, p_oUnitDef, Constants.AT_NAME, sName, language);
        Designer.setAttribute(oModel, p_oUnitDef, Constants.AT_NAME_FULL, sFullname, language);
        Designer.setAttribute(oModel, p_oUnitDef, Constants.AT_SRC, sSource, language);
    } else {
        Designer.setAttributePersistent(p_oUnitDef, Constants.AT_NAME, sName, language);
        Designer.setAttributePersistent(p_oUnitDef, Constants.AT_NAME_FULL, sFullname, language);
        Designer.setAttributePersistent(p_oUnitDef, Constants.AT_SRC, sSource, language); 
    }
    
    function getTypeNumber(p_oDef) {
        return "(TypeNum:" + p_oDef.getType() + ")";
    }
}
function setInitialUnitHistory(p_oModel, p_oUnitDef){
    var sHistory = "Model created for: " + getAttribute_Name(p_oModel, null)+ ", " + Designer.getGUID(p_oModel) + ", " + Context.getLoginInfo(p_oModel).getUserName()+ ";";
    Designer.setAttribute(p_oModel, p_oUnitDef, Constants.AT_CHANGE_HISTORY, sHistory, null);
    //Designer.setAttributePersistent(p_oUnitDef, Constants.AT_CHANGE_HISTORY, sHistory, null); 
}
function psmHistoryHelper(p_oModel,p_oObj){
    this.oMethod = Context.getArisMethod();
    this.UserName = ""
    this.oModel = p_oModel;
    this.oObj = p_oObj
    this.sHistory = "";
    this.sHistoryLine = "";
    this.iHistoryAttr = Constants.AT_CHANGE_HISTORY;
    //if (p_oObj.getItemKind() == Constants.CID_MODEL) this.iHistoryAttr = Constants.AT_DESC;
    this.addStartText = function(p_sTxt){
        if (this.sHistoryLine!="") this.sHistory = this.sHistory + this.sHistoryLine + "\n"
        this.sHistoryLine = p_sTxt + ": ";
    }
    this.addObjInfoStr = function(p_oObj){
        this.sHistoryLine = this.sHistoryLine + getAttribute_Name(p_oObj, null) + ", " + this.oMethod.ObjTypeName(p_oObj.getType()) + ", " + Designer.getGUID(p_oObj) + "; ";
    } 
    this.addUserTStampInfo = function(){
        if (this.UserName=="") {
            var login = Context.getLoginInfo(this.oModel)
            this.UserName = login.getUserName();
        }              
        var oSDF = new java.text.SimpleDateFormat("dd.MM.yyyy hh:mm:ss");
        var oSB = new java.lang.StringBuffer();
        
        this.sHistoryLine = this.sHistoryLine + this.UserName + ", " +  oSDF.format(new Date(), oSB, new java.text.FieldPosition(1)) + ";";
    }
    this.initEmptyHistory = function(p_oObj,p_sPrefix){        
        if (this.sHistory == "" && this.sHistoryLine == "") {
            this.addStartText(p_sPrefix);
            if (p_oObj!=null) this.addObjInfoStr(p_oObj);
            //this.addUserTStampInfo();
        }    
    }    
    this.addChangedProcessingType = function(p_oObj, p_iAttrTypeNum, p_iAttrValueTypeNum){
        this.initEmptyHistory(p_oObj,"Changed processing type");
        var sState = "not maintained";
        if (p_iAttrValueTypeNum!=0) sState = this.oMethod.AttrValueType(p_iAttrTypeNum,p_iAttrValueTypeNum);
        this.sHistoryLine = this.sHistoryLine + this.oMethod.AttrTypeName(p_iAttrTypeNum) + ": " +  sState + ";";
    }      
    this.addChangedState = function(p_oObj, p_iAttrTypeNum, p_iAttrValueTypeNum){
        this.initEmptyHistory(p_oObj,"Changed allocation");
        var sState = "not maintained";
        if (p_iAttrValueTypeNum!=0) sState = this.oMethod.AttrValueType(p_iAttrTypeNum,p_iAttrValueTypeNum);
        this.sHistoryLine = this.sHistoryLine + this.oMethod.AttrTypeName(p_iAttrTypeNum) + ": " +  sState + ";";
    }    
    this.addChangedToBe = function(p_oObj, p_iAttrTypeNum, p_bValue){
        this.initEmptyHistory(p_oObj,"Changed allocation");
        this.sHistoryLine = this.sHistoryLine + this.oMethod.AttrTypeName(p_iAttrTypeNum) + ": " +  p_bValue + ";";
    }
    this.addChangedDate = function(p_oObj, p_iAttrTypeNum, p_sDate){
        this.initEmptyHistory(p_oObj,"Changed allocation");
        this.sHistoryLine = this.sHistoryLine + this.oMethod.AttrTypeName(p_iAttrTypeNum) + ": " +  p_sDate + ";";
    }
    this.addHistory = function(){
        var bHistoryChanged = false;
        if ((this.sHistory + this.sHistoryLine)!= "") {
            var oOldHistory = Designer.getAttribute(this.oObj ,this.iHistoryAttr, null);
            var sOldHistory = "";
            if (oOldHistory!=null) sOldHistory = oOldHistory.getValue() + "\n";
            this.addUserTStampInfo();
            this.sHistory = sOldHistory + this.sHistory + this.sHistoryLine;
            Designer.setAttribute(this.oModel, this.oObj,this.iHistoryAttr, this.sHistory ,null);
            bHistoryChanged = true;
        }   
        return bHistoryChanged;
    }    
} 
function classGroupCreator(p_oModel){
    this.oModel = p_oModel;
    this.oFilter = Context.getArisMethod();    
    var oDB = Context.getLoginInfo (p_oModel).getDatabase();
    var oDBLanguages = Designer.getAllDBLanguages(oDB);
    var idAttr = Constants.AT_REFERENCE_ID;
    this.createGroup4PSU = function(p_oColHeader,p_oRowHeader){
        var colHeaderGrp = this.getOrCreateGrp4Header(oPSURoot, p_oColHeader);   
        return this.getOrCreateGrp4Header(colHeaderGrp, p_oRowHeader);
    }  
    this.getOrCreateGrp4Header = function(p_StartGrp, p_oHeader){
        var oOTGrp = this.getOrCreateGrp(p_StartGrp, p_oHeader, true);
        return this.getOrCreateGrp(oOTGrp, p_oHeader, false);
    }
    this.getOrCreateGrp = function(p_StartGrp, p_oHeader, p_bType){  
        var iAttrType = Constants.AT_NAME;
        var sSearchTxt = Designer.getGUID(p_oHeader);
        var sGrpName = Designer.getAttributeWithFallback(p_oHeader, Constants.AT_NAME, null);
        if (p_bType) {
            iAttrType = Constants.AT_TYPE_6;
            sSearchTxt = ""+p_oHeader.getType();
            sGrpName = Designer.getAttributeWithFallback(p_oHeader, Constants.AT_TYPE_6, null);//g_oFilter.ObjTypeName(p_oHeader.getType());
        }
        if (sGrpName==null) sGrpName = "";
        else sGrpName=java.lang.String(sGrpName).trim();
        var aSearchStr = new Array();
        aSearchStr.push(new java.lang.String(sSearchTxt));
        var oOTGrps = Search.searchGroups(p_StartGrp,"*", Constants.SEARCH_OPTION_MATCH_PATTERN, true, Constants.SEARCH_OPTION_CASE_SENSITIVE, [Constants.SEARCH_ATTR_OPERATOR_EQUALS], [idAttr], [sSearchTxt]);
        var oOTGrp = null;
        if (oOTGrps.length==0) {
            if (!Designer.hasWriteAccess(p_StartGrp)) throw new PsmError("NO_WRITE_ACCESS");
            oOTGrp = createNewGroup(sGrpName);  // Anubis 547880
            Designer.setAttribute(this.oModel, oOTGrp, idAttr, sSearchTxt, null);
            this.writeGrpAttributes(oOTGrp, p_oHeader, iAttrType);
            Designer.save(oOTGrp);
        } else oOTGrp = oOTGrps[0];
        return oOTGrp;
        
        function createNewGroup(sGrpName) {
            var oNewGrp = null;
            var sNewGrpName = sGrpName;
            var i = 1;
            while (oNewGrp == null) {
                try {
                    oNewGrp = Explorer.createGroup(p_StartGrp,sNewGrpName);
                } catch(e) {
                    oNewGrp = null;
                    i++;
                    sNewGrpName = sGrpName+"("+i+")";
                }
            }
            return oNewGrp;
        }
    }
    this.writeGrpAttributes = function(p_oGrp, p_oHeader,p_iAttrType){
        for (var i=0;i<oDBLanguages.length;i++){
            var oLang = oDBLanguages[i];
            sAttr = Designer.getAttributeWithFallback (p_oHeader, p_iAttrType, oLang);
            if (sAttr!=null) Designer.setAttribute(this.oModel, p_oGrp, Constants.AT_NAME, sAttr, oLang);            
        } 
    }    
}

function getConnectedPSUOccs(oModel, oHeaderOcc) {
    var aConnectedObjOccs = new Array();
    
    var oCxnOccs = Designer.getConnections(oModel, [oHeaderOcc], true, true, null);
    for (var i = 0; i < oCxnOccs.length; i++) {
        var oConnectedOcc = getConnectedOcc(oModel, oHeaderOcc, oCxnOccs[i]);
        if (isUnitObj(Designer.getDefinition(oConnectedOcc).getType())) aConnectedObjOccs.push(oConnectedOcc);
    }
    return aConnectedObjOccs;
}

function getFirstOccInModel(oModel, oObjDef) {
    var oAllOccs = Designer.getAllOccs(oModel);
    for (var i = 0; i < oAllOccs.length; i++) {
        var oCurrenOcc = oAllOccs[i];
        if (oCurrenOcc.getItemKind() == Constants.CID_OBJOCC && Designer.getDefinition(oCurrenOcc).equals(oObjDef)) {
            return oCurrenOcc;
        }
    }
    return null;
}

function getCrossHeaderOcc(oModel, oUnitOcc, bColumn) {
    var oCxnOccs = Designer.getConnections(oModel, [oUnitOcc], true, true, null);
    for (var i = 0; i < oCxnOccs.length; i++) {
        var oCxnOcc = oCxnOccs[i];
        if (bColumn) {
            // get row header occ
            if (isRowHeaderCxn(Designer.getDefinition(oCxnOcc).getType())) {
                var oConnOcc = getConnectedOcc(oModel, oUnitOcc, oCxnOcc);
                if (isRowHeaderObj(Designer.getDefinition(oConnOcc).getType())) return oConnOcc;
            }
        } else {
            // get column header occ        
            if (isColHeaderCxn(Designer.getDefinition(oCxnOcc).getType())) {
                var oConnOcc = getConnectedOcc(oModel, oUnitOcc, oCxnOcc);
                if (isColHeaderObj(Designer.getDefinition(oConnOcc).getType())) return oConnOcc;
            }
        }
    }
    return null;
} 

function getConnectedOcc(oModel, oObjOcc, oCxnOcc) {
    var oConnOcc = Designer.getSource(oModel, oCxnOcc);
    if (oObjOcc.equals(oConnOcc)) oConnOcc = Designer.getTarget(oModel, oCxnOcc);
    return oConnOcc;
}