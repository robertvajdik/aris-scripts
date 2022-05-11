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
// Funktionsbibliothek zum Bearbeiten von Process Support units
//
//////////////////////////////////////////////////////////////////

///////////////////
// Config

var language = Context.getSelectedLanguage();

var g_oFilter = ArisData.ActiveFilter();

var differentValues = "#########";

var CXN_BELONGS2PROCUNIT    = Constants.CT_BELONGS_TO_PROC_SUPPORT_UNIT; 	//eingehend von ast zu psu =202        
var CXN_SUPPORTS            = Constants.CT_CAN_SUPP_1; 										// ausgehend von psu zu funct =221                         
var CXN_CAN_BE_LOCATED_AT   = Constants.CT_CAN_BE_LOC_AT; 								//ausgehend von psu zu loc =165
var CXN_CAN_BE_USER         = Constants.CT_CAN_BE_USER; 									// eingehend von OE zu psu =230  
var oStopWatch;
var aProcessSupportStates = new Array(g_oFilter.AttrValueType(Constants.AVT_START_PLANNING_PHASE_IN),
                                      g_oFilter.AttrValueType(Constants.AVT_TO_BE_PHASED_IN),
                                      g_oFilter.AttrValueType(Constants.AVT_PHASED_IN),
                                      g_oFilter.AttrValueType(Constants.AVT_START_PLANNING_PHASE_OUT),
                                      g_oFilter.AttrValueType(Constants.AVT_TO_BE_PHASED_OUT),
                                      g_oFilter.AttrValueType(Constants.AVT_PHASED_OUT));                     
                        
function AST_DATA(oAstDef) {
    this.oAstDef = oAstDef;
    this.aCxn2UnitData = new Array();
}

function CXN2UNIT_DATA(oUnitDef, aCxnAttributes) {
    this.oUnitDef = oUnitDef;
    this.aCxnAttributes = new Array();
    for (var i = 0; i < aCxnAttributes.length; i++) {
        this.aCxnAttributes[i] = aCxnAttributes[i];
    }
}


function updateLastChangesReport(theUnitDef) {
    var now = new java.util.Date();

    var dateformat = new java.text.SimpleDateFormat("dd.MM.yyyy HH:mm:ss");
    var gnarfbuffer = new java.lang.StringBuffer();
    var nowString = dateformat.format(now, gnarfbuffer, new java.text.FieldPosition(1));
    theUnitDef.Attribute(Constants.AT_LAST_CHNG_2, -1).setValue(nowString);
}


function SortByNameReport(aObj, bObj){
    var x = new java.lang.String(aObj.Attribute (Constants.AT_NAME, language, true/*Fallback*/));
    var y = new java.lang.String(aObj.Attribute (Constants.AT_NAME, language, true/*Fallback*/));

    return x.compareToIgnoreCase(y);
}

function SortByString(aObj, bObj){
    return aObj.compareToIgnoreCase(bObj);
}

function checkDate(currentDlg, bMultiple) {
    var startplanphasein =  currentDlg.getDlgText("datechooser_startplanphasein");
    var phaseinplan =       currentDlg.getDlgText("datechooser_phaseinplan");
    var phasein =           currentDlg.getDlgText("datechooser_phasein");
    var startplanphaseout = currentDlg.getDlgText("datechooser_startplanphaseout");
    var phaseoutplan =      currentDlg.getDlgText("datechooser_phaseoutplan");
    var phaseout =          currentDlg.getDlgText("datechooser_phaseout");    
    
    if (!doCheckDate(startplanphasein, bMultiple)) return false;
    if (!doCheckDate(phaseinplan, bMultiple)) return false;
    if (!doCheckDate(phasein, bMultiple)) return false;
    if (!doCheckDate(startplanphaseout, bMultiple)) return false;
    if (!doCheckDate(phaseoutplan, bMultiple)) return false;
    if (!doCheckDate(phaseout, bMultiple)) return false;

    return true;
}

function checkPlausibility(currentDlg, bMultiple) {
    var startplanphasein =  currentDlg.getDlgText("datechooser_startplanphasein");
    var phaseinplan =       currentDlg.getDlgText("datechooser_phaseinplan");
    var phasein =           currentDlg.getDlgText("datechooser_phasein");
    var startplanphaseout = currentDlg.getDlgText("datechooser_startplanphaseout");
    var phaseoutplan =      currentDlg.getDlgText("datechooser_phaseoutplan");
    var phaseout =          currentDlg.getDlgText("datechooser_phaseout");    

    if (!doCheckPlausibility(startplanphasein, phaseinplan, true, bMultiple)) return false;
    if (!doCheckPlausibility(startplanphasein, phasein, true, bMultiple)) return false;
    if (!doCheckPlausibility(startplanphasein, startplanphaseout, true, bMultiple)) return false;
    if (!doCheckPlausibility(startplanphasein, phaseoutplan, true, bMultiple)) return false;
    if (!doCheckPlausibility(startplanphasein, phaseout, true, bMultiple)) return false;
/*
    if (!doCheckPlausibility(phaseinplan, phaseoutplan, false, bMultiple)) return false;
    if (!doCheckPlausibility(phaseinplan, phaseout, false, bMultiple)) return false;
*/
    if (!doCheckPlausibility(phasein, phaseoutplan, false, bMultiple)) return false;
    if (!doCheckPlausibility(phasein, phaseout, false, bMultiple)) return false;

    if (!doCheckPlausibility(startplanphaseout, phaseoutplan, true, bMultiple)) return false;
    if (!doCheckPlausibility(startplanphaseout, phaseout, true, bMultiple)) return false;
    
    return true;

    function doCheckPlausibility(smallerDate, biggerDate, bCanBeEqual, bMultiple) {
        if (bMultiple && (compareString(smallerDate, differentValues) == 0 || compareString(biggerDate, differentValues) == 0)) return true;
        
        if (smallerDate == "" || smallerDate == null || biggerDate == "" || biggerDate == null) return true;
        
        var smallerDateArray = smallerDate.split("/");      // BLUE-18196
        var smaller_mm = parseInt(getDayOrMonth(smallerDateArray[0]));
        var smaller_dd = parseInt(getDayOrMonth(smallerDateArray[1]));
        var smaller_yyyy = parseInt(smallerDateArray[2]);
        
        var biggerDateArray = biggerDate.split("/");        // BLUE-18196
        var bigger_mm = parseInt(getDayOrMonth(biggerDateArray[0]));
        var bigger_dd = parseInt(getDayOrMonth(biggerDateArray[1]));
        var bigger_yyyy = parseInt(biggerDateArray[2]);
        
        if (smaller_yyyy > bigger_yyyy) return false;
        if (smaller_yyyy == bigger_yyyy) {
            if (smaller_mm > bigger_mm)  return false;
            
            if (smaller_mm == bigger_mm) {
                if (smaller_dd > bigger_dd) return false;
                if (!bCanBeEqual && (smaller_dd == bigger_dd)) return false;
            }
        }
        return true;    
    }
}
function checkProcessSupportStatus2(attributeArray) {
    var methodFilter = ArisData.getActiveDatabase().ActiveFilter();
    var stringToChangeTo = "";
    var bFoundState = attributeArray[6] == "";
    for (var i=0; i<aProcessSupportStates.length; i++){
        if (bFoundState && attributeArray[i]!=""){
            stringToChangeTo = aProcessSupportStates[i];
        }
        //Dialogs.MsgBox(attributeArray[6] + "==" + aProcessSupportStates[i] + "=" + attributeArray[6].equals(aProcessSupportStates[i]));
        if (attributeArray[6].equals(aProcessSupportStates[i])){
            bFoundState = true;
        }
    }
    if (stringToChangeTo != "") {
        attributeArray[6] = stringToChangeTo;
    }
    return attributeArray;
}
///////////////////////////////////////////////////
// Edit-Dialog

function createEditDialog(selectedIdx, bMultiple, aAstData, selectedUnitDefs, bIgnoreCheckBox_ToBe) {
    var standalone = selectedIdx < 0;
    
    // Füllen der Combobox
    var statusArray = getStatusArray(bMultiple);

    if(standalone) {
        var astName = Context.getProperty("theAstName");
    } else {
        var astName = aAstData[selectedIdx].oAstDef.Name(language, true);
    }

    var editDialog = Dialogs.createNewDialogTemplate(0, 0,  585, 310, getString("EDIT_AST"));
    
    // 1. Gruppe: Properties of the cell
    editDialog.GroupBox(5, 5, 570, 80, getString("PROPERTIES_OF_THE_PSU"));
    if (bMultiple) {
        editDialog.Text(20, 20, 550, 70, getString("SEVERAL_UNITS_EDITED"));
    } else {
        editDialog.Text(20, 20, 230, 15, getString("COLUMN_HEADER"));
        editDialog.TextBox(250, 20, 280, 15, "txtbox_processname");
        editDialog.Text(20, 40, 230, 15, getString("ROW_HEADER"));
        editDialog.TextBox(250, 40, 280, 15, "txtbox_orgunitname");
    }
    editDialog.Text(20, 60, 230, 15, getString("ALLOCATION"));
    editDialog.TextBox(250, 60, 280, 15, "txtbox_itsystemname");   
    
    // 2. Gruppe: Properties of the allocation
    editDialog.GroupBox(5, 90, 570, 220, getString("PROPERTIES_OF_THE_ALLOCATION"));
    editDialog.Text(35, 110, 265, 15, g_oFilter.AttrTypeName(Constants.AT_START_PLAN_PHASE_IN) + ":");
    editDialog.DateChooser(300, 110, 250, 15, "datechooser_startplanphasein");
    editDialog.Text(35, 130, 265, 15, g_oFilter.AttrTypeName(Constants.AT_PHASE_IN_PLAN) + ":");
    editDialog.DateChooser(300, 130, 250, 15, "datechooser_phaseinplan");
    editDialog.Text(35, 150, 265, 15, g_oFilter.AttrTypeName(Constants.AT_PHASE_IN_AS_IS) + ":");
    editDialog.DateChooser(300, 150, 250, 15, "datechooser_phasein");
    editDialog.Text(35, 170, 265, 15, g_oFilter.AttrTypeName(Constants.AT_START_PLAN_PHASE_OUT) + ":");
    editDialog.DateChooser(300, 170, 250, 15, "datechooser_startplanphaseout");
    editDialog.Text(35, 190, 265, 15, g_oFilter.AttrTypeName(Constants.AT_PHASE_OUT_PLAN) + ":");
    editDialog.DateChooser(300, 190, 250, 15, "datechooser_phaseoutplan");
    editDialog.Text(35, 210, 265, 15, g_oFilter.AttrTypeName(Constants.AT_PHASE_OUT_AS_IS) + ":");
    editDialog.DateChooser(300, 210, 250, 15, "datechooser_phaseout");
    editDialog.Text(35, 230, 265, 15, g_oFilter.AttrTypeName(Constants.AT_PROC_SUPPORT_STATUS) + ":");
    editDialog.ComboBox(300, 230,250, 15, statusArray, "combo_statusofprocesssupport");
    //editDialog.TextBox(200, 150, 250, 15, "txtbox_statusofprocesssupport");
    editDialog.Text(35, 250, 265, 15, getString("SHORT_DESCRIPTION"));
    editDialog.TextBox(300, 250, 250, 30, "txtbox_shortdescription", 1);
    if (bMultiple) {
        editDialog.CheckBox(35, 265, 200, 15, getString("TO_BE"), "checkbox_tobe", 2);      // 3 state
        editDialog.CheckBox(35, 280, 400, 15, getString("EXPAND_OCCS"), "checkbox_expand");
    } else {
        editDialog.CheckBox(35, 265, 200, 15, getString("TO_BE"), "checkbox_tobe");
    }
    
    // Buttons am Ende: OK, Cancel und Help
    editDialog.OKButton();
    if (!standalone) editDialog.CancelButton();
    editDialog.HelpButton("HID_psmReport_dlg_01.hlp");
    
    editDlg = Dialogs.createUserDialog(editDialog);
    
    ////////////////////////////////////////////////////////
    // Funktionalität des Dialogs
    
    if (!bMultiple) {
        editDlg.setDlgEnable("txtbox_processname", false);
        editDlg.setDlgText("txtbox_processname", Context.getProperty("theFuncName"));
        
        editDlg.setDlgEnable("txtbox_orgunitname", false);
        editDlg.setDlgText("txtbox_orgunitname", Context.getProperty("theOrgName"));
    } else {
        var bExpand = aAstData[selectedIdx].aCxn2UnitData.length < selectedUnitDefs.length;
        editDlg.setDlgEnable("checkbox_expand", bExpand);
    }
    editDlg.setDlgVisible("checkbox_tobe", !bIgnoreCheckBox_ToBe); // Anubis 478424

    editDlg.setDlgEnable("txtbox_itsystemname", false);
    editDlg.setDlgText("txtbox_itsystemname", astName);
    
    var aCxnAttributesToShow = new Array();
    if (standalone) {
        var aCxnAttributes = aAstData[0].aCxn2UnitData[0].aCxnAttributes;
        for (var i = 0; i < aCxnAttributes.length; i++) {
            if (aCxnAttributes[i] != "null") {
                aCxnAttributesToShow[i] = aCxnAttributes[i];
            }
        }
    } else {
        var aCxn2UnitData = aAstData[selectedIdx].aCxn2UnitData;
        for (var i = 0; i < aCxn2UnitData.length; i++) {
    
            var aCxnAttributes = aCxn2UnitData[i].aCxnAttributes;
            for (var j = 0; j < aCxnAttributes.length; j++) {
                if (aCxnAttributesToShow[j] == null) {
                    aCxnAttributesToShow[j] = aCxnAttributes[j];
                } else if (compareString(aCxnAttributesToShow[j], aCxnAttributes[j]) != 0) {
                    aCxnAttributesToShow[j] = differentValues;
                }
            }
        }
    }
    setDialogAttributes(editDlg, aCxnAttributesToShow, statusArray);
    
    
    
    var newEditDialog = undefined;
    
    for (;;) {
                
        newEditDialog = Dialogs.show(editDlg);

        if (newEditDialog == 0) {
            return null;
        }    
    
        if (!checkDate(editDlg, bMultiple)) {
            // Alertmeldung und abbruch
            Dialogs.MsgBox(getString("DATEERROR"));
        }
        else if (!checkPlausibility(editDlg, bMultiple)) {
            Dialogs.MsgBox(getString("PLAUSIBILITY_ERROR"));
        }
        else {
            if (standalone) {
                saveSingleAST(editDlg, statusArray);
            } else {
                saveEditedAst(editDlg, statusArray, selectedIdx, aAstData, selectedUnitDefs);
            }
            break;
        }
    }
}

function saveEditedAst(dlg, statusArray, selectedIdx, aAstData, selectedUnitDefs) {
    var newAstAttributes = getDialogAttributes(dlg, statusArray);

    var hasDifferentValues = false;
    for (var i = 0; i < 6; i++) {
        if (compareString(newAstAttributes[i], differentValues) == 0) hasDifferentValues = true;
    }
    if (!hasDifferentValues) {
        newAstAttributes = checkProcessSupportStatus2(newAstAttributes);
    }
    
    var expand = false;
    if (editDlg.getDlgValue("checkbox_expand") == 1) expand = true;
    
    if (selectedIdx >= 0) {
        var aCxn2UnitData = aAstData[selectedIdx].aCxn2UnitData;
        
        // AST existiert an dieser Unit noch nicht --> neu anlegen, falls different Values, Standard-Werte übernehmen
        if (expand) {
            for (var i = 0; i < selectedUnitDefs.length; i++) {
                var oUnitDef = selectedUnitDefs[i];
                var nUnitIndex = getCxn2UnitDataIndex(oUnitDef, aCxn2UnitData);
                if (nUnitIndex < 0) {
                    // add new cxn2unit data object
                    nUnitIndex = aCxn2UnitData.length;
                    aCxn2UnitData[nUnitIndex] = new CXN2UNIT_DATA(oUnitDef, ["", "", "", "", "", "", "", "", 0]);
                }
            }
        }
        
        for (var i = 0; i < aCxn2UnitData.length; i++) {        
            var aCxnAttributes = aCxn2UnitData[i].aCxnAttributes;             
            for (var j = 0; j < newAstAttributes.length; j++) {
                if (compareString(newAstAttributes[j], differentValues) != 0) {
                    aCxnAttributes[j] = newAstAttributes[j];
                }
            }
            if (expand) {
                if (compareString(newAstAttributes[6], differentValues) == 0) { 
                    aCxnAttributes[6] = statusArray[2];                         // falls Status unterschiedlich, hier PHASED_IN einstellen
                }
            }
        }
    }
}

function saveSingleAST(dlg, statusArray) {
    var aCxnAttributes = getDialogAttributes(dlg, statusArray);
    aCxnAttributes[6] = convertAttrText2Value(aCxnAttributes[6], Constants.AT_PROC_SUPPORT_STATUS);
    
    var newAstAttributeString = aCxnAttributes[0] + "::" + 
                                aCxnAttributes[1] + "::" + 
                                aCxnAttributes[2] + "::" + 
                                aCxnAttributes[3] + "::" + 
                                aCxnAttributes[4] + "::" + 
                                aCxnAttributes[5] + "::" + 
                                aCxnAttributes[6] + "::" + 
                                aCxnAttributes[7] + "::" + 
                                aCxnAttributes[8];
    Context.setProperty("attributes", newAstAttributeString);
}

function convertAttrText2Value(sAttrText, nATN) {
    if (sAttrText != null) {
        // Austauschen des Wertattribut-Strings durch die Konstante
        var nAVTNs = g_oFilter.AttrValueTypeNums(nATN);
        for (var i = 0; i < nAVTNs.length; i++) {
            var nAVTN = nAVTNs[i];
            if (g_oFilter.AttrValueType(nAVTN).compareTo(sAttrText) == 0) return nAVTN;
        }
    }
    return undefined;
}

function getValueTypes(nATN) {
    var sValueTypes = new Array();
    var nAVTNs = g_oFilter.AttrValueTypeNums(nATN);
    for (var i = 0; i < nAVTNs.length; i++) {
        sValueTypes.push(g_oFilter.AttrValueType(nAVTNs[i]));
    }
    return sValueTypes;
}

function getCxn2UnitDataIndex(oUnitDef, aCxn2UnitData) {
    for (var i = 0; i < aCxn2UnitData.length; i++) {
        if (aCxn2UnitData[i].oUnitDef.IsEqual(oUnitDef)) return i;
    }
    return -1;
}

function sortAstDataByName(astDataA, astDataB) {
    var sNameA = new java.lang.String(astDataA.oAstDef.Name(language));
    var sNameB = new java.lang.String(astDataB.oAstDef.Name(language));

    return sNameA.compareToIgnoreCase(sNameB);
}

function getCxnAttributes(oCxn) {
    var aCxnAttributes = ["", "", "", "", "", "", "", "", 0];   
    if (oCxn != null) {             
        aCxnAttributes[0] = oCxn.Attribute(Constants.AT_START_PLAN_PHASE_IN, language).getValueStd();
        aCxnAttributes[1] = oCxn.Attribute(Constants.AT_PHASE_IN_PLAN, language).getValueStd();
        aCxnAttributes[2] = oCxn.Attribute(Constants.AT_PHASE_IN_AS_IS, language).getValueStd();
        aCxnAttributes[3] = oCxn.Attribute(Constants.AT_START_PLAN_PHASE_OUT, language).getValueStd();
        aCxnAttributes[4] = oCxn.Attribute(Constants.AT_PHASE_OUT_PLAN, language).getValueStd();
        aCxnAttributes[5] = oCxn.Attribute(Constants.AT_PHASE_OUT_AS_IS, language).getValueStd();
        aCxnAttributes[6] = oCxn.Attribute(Constants.AT_PROC_SUPPORT_STATUS, language).getValue();
        aCxnAttributes[7] = oCxn.Attribute(Constants.AT_DESC, language).getValue();
        aCxnAttributes[8] = getBoolAttrAsString(oCxn, Constants.AT_TO_BE);
    }
    return aCxnAttributes;        
    
    function getBoolAttrAsString(oItem, nAttrTypeNum) {
        if (isboolattributetrue(oItem, nAttrTypeNum, language)) return "True";
        return "False";
    }
}

function setDialogAttributes(dlg, aCxnAttributes, statusArray) {
    dlg.setDlgText("datechooser_startplanphasein",  getDialogText(aCxnAttributes, 0));
    dlg.setDlgText("datechooser_phaseinplan",       getDialogText(aCxnAttributes, 1));
    dlg.setDlgText("datechooser_phasein",           getDialogText(aCxnAttributes, 2));
    dlg.setDlgText("datechooser_startplanphaseout", getDialogText(aCxnAttributes, 3));
    dlg.setDlgText("datechooser_phaseoutplan",      getDialogText(aCxnAttributes, 4));
    dlg.setDlgText("datechooser_phaseout",          getDialogText(aCxnAttributes, 5));
    if (statusArray != null) {
        var statusIndex = getListIndex(aCxnAttributes[6], statusArray);
        statusArray = getStatusArray(statusIndex == 6);
        dlg.setDlgListBoxArray("combo_statusofprocesssupport", statusArray);
        dlg.setDlgSelection("combo_statusofprocesssupport", statusIndex);
    } else {
        dlg.setDlgText("txtbox_statusofprocesssupport", getDialogText(aCxnAttributes, 6));
    }    
    dlg.setDlgText("txtbox_shortdescription",       getDialogText(aCxnAttributes, 7));
    dlg.setDlgValue("checkbox_tobe",                getDialogValue(aCxnAttributes, 8));
    
    function getDialogText(aCxnAttributes, nIndex) {
        if (aCxnAttributes != null && aCxnAttributes[nIndex] != null) return aCxnAttributes[nIndex];
        return "";
    }
    
    function getDialogValue(aCxnAttributes, nIndex) {
        if (aCxnAttributes != null && aCxnAttributes[nIndex] != null) {
            if (compareString(aCxnAttributes[nIndex], "True") == 0) return 1;
            if (compareString(aCxnAttributes[nIndex], differentValues) == 0) return 2;
        }
        return 0;
    }
    
    function getListIndex(sCurrentValue, sValueList) {
        if (sCurrentValue != null) {
            if (!isNaN(sCurrentValue) && parseInt(sCurrentValue) > 0) {
                sCurrentValue = g_oFilter.AttrValueType(parseInt(sCurrentValue));
            }
            for (var i = 0; i < sValueList.length; i++) {
                var sValue = new java.lang.String(sValueList[i]);
                if (sValue.compareTo(new java.lang.String(sCurrentValue)) == 0) return i;
            }
        }
        if (compareString(sValueList[0], differentValues) == 0) return 6;
        return 1;
    }
}

function getDialogAttributes(dlg, statusArray) {
    var aCxnAttributes = new Array();
    aCxnAttributes[0] = dlg.getDlgText("datechooser_startplanphasein");
    aCxnAttributes[1] = dlg.getDlgText("datechooser_phaseinplan");
    aCxnAttributes[2] = dlg.getDlgText("datechooser_phasein");
    aCxnAttributes[3] = dlg.getDlgText("datechooser_startplanphaseout");
    aCxnAttributes[4] = dlg.getDlgText("datechooser_phaseoutplan");
    aCxnAttributes[5] = dlg.getDlgText("datechooser_phaseout");
    aCxnAttributes[6] = statusArray[dlg.getDlgSelection("combo_statusofprocesssupport")[0]];    
    aCxnAttributes[7] = dlg.getDlgText("txtbox_shortdescription");
    aCxnAttributes[8] = getValueAsString(dlg.getDlgValue("checkbox_tobe"));

    return aCxnAttributes;
    
    function getValueAsString(nValue) {
        if (nValue == 1) return "True";
        if (nValue == 2) return differentValues;
        return "False";
    }
}

function getStatusArray(bExtended) {
    var statusArray = new Array();
    statusArray[0] = g_oFilter.AttrValueType(Constants.AVT_START_PLANNING_PHASE_IN);
    statusArray[1] = g_oFilter.AttrValueType(Constants.AVT_TO_BE_PHASED_IN);
    statusArray[2] = g_oFilter.AttrValueType(Constants.AVT_PHASED_IN);
    statusArray[3] = g_oFilter.AttrValueType(Constants.AVT_START_PLANNING_PHASE_OUT);
    statusArray[4] = g_oFilter.AttrValueType(Constants.AVT_TO_BE_PHASED_OUT);
    statusArray[5] = g_oFilter.AttrValueType(Constants.AVT_PHASED_OUT);    
    if (bExtended) statusArray[6] = differentValues;    
    return statusArray;
}
function stopWatch(p_sMakroname){
    this.start = new Date().getTime();
    this.lastStopOver = this.start;
    this.sMessage = p_sMakroname;
    this.stopOver = function(p_sMessage){        
        var end = new Date().getTime();
        var oDuration = (end-this.lastStopOver)/1000;
        this.sMessage = this.sMessage + "\n" + p_sMessage + " dauerte " + oDuration + " sec";
        this.lastStopOver = end;
    }
    this.end = function(p_sMessage){
        this.stopOver(p_sMessage);        
        var end = new Date().getTime();
        var oDuration = (end-this.start)/1000;
        Dialogs.MsgBox(this.sMessage +"\nDas Makro dauerte " + oDuration + " sec");
    }   
}

function isFreezeModel(oModel) {
    return isboolattributetrue(oModel, Constants.AT_FREEZE_MODEL, language);
}