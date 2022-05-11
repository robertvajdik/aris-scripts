/**
 * Copyright (C) 2020 Software AG, Darmstadt, Germany and/or Software AG USA Inc., Reston, VA, USA,
 * and/or its subsidiaries and/or its affiliates and/or their licensors.
 *
 * Use, reproduction, transfer, publication or disclosure is prohibited
 * except as specifically provided for in your License Agreement with Software AG.
 *
 * Version: 10.0.12.0.1470486
 */

var g_bTestManagementExport = false;
var g_bRiskManagementExport = false;
var g_bSurveyManagementExport = false;
var g_bAuditManagementExport = false;
var g_bPolicyManagementExport = false;
var g_bGDPRExport = false;

//---------------------------------------------------------------------------------------
//---------------------------------- MODE HANDLING --------------------------------------

/*---------------------------------------------------------------------------------------
    Determine the modules to export data for; default is:
    - do Test management
    - do Risk management
    - do Survey management
    - do Audit management
    - do Policy management
    - do GDPR
    Returns true if at least one mode is active, otherwise false.
---------------------------------------------------------------------------------------*/
function determineModules() {

    var licenseList = Context.getComponent("UMC").getAllLicenses();
    for (var i=0; i<licenseList.size(); i++) {
        var license = licenseList.get(i);
        var prod = license.getProduct();
        if (prod != null) {
            if (prod.getCode() == "YRCTM") {g_bTestManagementExport = true;}
            if (prod.getCode() == "YRCRM") {g_bRiskManagementExport = true;}
            if (prod.getCode() == "YRCSM") {g_bSurveyManagementExport = true;}
            if (prod.getCode() == "YRCAM") {g_bAuditManagementExport = true;}
            if (prod.getCode() == "YRCPM") {g_bPolicyManagementExport = true;}
        }
    }

    g_bGDPRExport = true;
}


//---------------------------------------------------------------------------------------------------
//---------------------------------- TOPOLOGICAL SORT HANDLING --------------------------------------

/*---------------------------------------------------------------------------------------
    Performs a topological sort on a given Array of elements.
    Returns the follwoing result object:
		- property "objDefSet": 	new sorted LinkedHashSet with all elements from
                                    objDefSet which are not part of any cycle
		- property "cycleArrays":	array of arrays which in turn contain the elements
									of the different detected cycles
---------------------------------------------------------------------------------------*/
function sortTopological(objDefSet, hm_parentObjDef2ChildObjDefsSet, hm_childObjDef2ParentObjDefsSet) {
    
    if (objDefSet == null) {
        return {
            objDefSet: objDefSet,
            cycleArrays: []
        }
    }
    
    var objDefArray = convertHashSetToJSArray(objDefSet);
    var unsortedObjDefArray = objDefArray.concat(new Array());
    if (objDefArray.length == 0 || hm_parentObjDef2ChildObjDefsSet == null || hm_childObjDef2ParentObjDefsSet == null) {
        return {
            objDefSet: new java.util.LinkedHashSet(),
            cycleArrays: []
        }
    }  
    
    //create successor and predecessor count maps
    var objDefSuccessorCounts = new java.util.HashMap(); //ObjDef -> count
    var objDefPredecessorCounts = new java.util.HashMap(); //ObjDef -> count
    for (var i=0; i<objDefArray.length; i++) {
        //successor count
		var count = 0; 
        var childrenSet = hm_parentObjDef2ChildObjDefsSet.get(objDefArray[i]);
        if (childrenSet != null) {
            count = childrenSet.size();
        }
        objDefSuccessorCounts.put(objDefArray[i], count);
		//predecessor count
		count = 0; 
        var childrenSet = hm_childObjDef2ParentObjDefsSet.get(objDefArray[i]);
        if (childrenSet != null) {
            count = childrenSet.size();
        }
        objDefPredecessorCounts.put(objDefArray[i], count);
    }
    
    //sort all cycle-free elements from bottom-up direction (i.e. no child elements)...
    var sortedObjDefArray = new Array();
    var bottomUpSortedObjDefArray = new Array();
    sortTopologicalBottomUp(unsortedObjDefArray, bottomUpSortedObjDefArray, objDefSuccessorCounts, hm_childObjDef2ParentObjDefsSet);
    sortedObjDefArray = sortedObjDefArray.concat(bottomUpSortedObjDefArray);
    //...if there are still unsorted elements left then sort all cycle-free elements from top-down direction (i.e. no parent elements)
    //this step is only done to narrow down the cycles more exactly
    if (unsortedObjDefArray.length > 0) {
        var topDownSortedObjDefArray = new Array();
        sortTopologicalTopDown(unsortedObjDefArray, topDownSortedObjDefArray, objDefPredecessorCounts, hm_parentObjDef2ChildObjDefsSet);
        sortedObjDefArray = sortedObjDefArray.concat(topDownSortedObjDefArray);
    }
    
    //if there remain unsorted elements then sorting was not successful - determine the cycles between them
    var cycles = new Array(); //array of cycle arrays
    if (unsortedObjDefArray.length > 0) {
        cycles = determineCycles(unsortedObjDefArray, hm_parentObjDef2ChildObjDefsSet);
    }
    
    var sortedObjDefLinkedHashSet = new java.util.LinkedHashSet();
    for (var m=0; m<sortedObjDefArray.length; m++) {
        sortedObjDefLinkedHashSet.add(sortedObjDefArray[m]);
    }
    
    return {
        objDefSet: sortedObjDefLinkedHashSet,
        cycleArrays: cycles
    }
}


/*---------------------------------------------------------------------------------------
    Fills bottomUpSortedObjDefArray with topologically sorted elements - order is
    children first.
    Leaves all elements that could not be sorted topologically bottom up in
    unsortedObjDefArray.
---------------------------------------------------------------------------------------*/
function sortTopologicalBottomUp(unsortedObjDefArray, bottomUpSortedObjDefArray, objDefSuccessorCounts, hm_childObjDef2ParentObjDefsSet) {
    var furtherIteration = true;
    while (furtherIteration) {
        //separate the elements by the criterion "successors" / "no successors"
        var objDefsWithoutSuccessors = new Array();
        var objDefsWithSuccessors = new Array();
        for (var i=0; i<unsortedObjDefArray.length; i++) {
            var count = objDefSuccessorCounts.get(unsortedObjDefArray[i]);
            if (count == 0) {
                bottomUpSortedObjDefArray.push(unsortedObjDefArray[i]);
                objDefsWithoutSuccessors.push(unsortedObjDefArray[i]); //mark the ObjDef as relevant for count updates of the parent ObjDefs
     
            } else {
                objDefsWithSuccessors.push(unsortedObjDefArray[i]);
            }
        }
        
        furtherIteration = objDefsWithoutSuccessors.length > 0 && objDefsWithSuccessors.length != unsortedObjDefArray.length;
        //in the next iteration only the elements with (unprocessed) successors will be checked
        unsortedObjDefArray.length = 0; //clear the array
        for (var h=0; h<objDefsWithSuccessors.length; h++) {
            unsortedObjDefArray.push(objDefsWithSuccessors[h]);
        }
        
        //update the successor count map
        for (var j=0; j<objDefsWithoutSuccessors.length; j++) {
            var parentObjDefsSet = hm_childObjDef2ParentObjDefsSet.get(objDefsWithoutSuccessors[j]);
            if (parentObjDefsSet != null) {
                var parentObjDefsArray = convertHashSetToJSArray(parentObjDefsSet);
                for (var k=0; k<parentObjDefsArray.length; k++) { 
                    var currentChildCount = objDefSuccessorCounts.get(parentObjDefsArray[k]);
                    objDefSuccessorCounts.put(parentObjDefsArray[k], --currentChildCount);
                }
            }
        }
    }
}


/*---------------------------------------------------------------------------------------
    Fills topDownSortedObjDefArray with topologically sorted elements - order is
    children(!) first.
    Leaves all elements that could not be  sorted topologically top down in
    unsortedObjDefArray.
---------------------------------------------------------------------------------------*/
function sortTopologicalTopDown(unsortedObjDefArray, topDownSortedObjDefArray, objDefPredecessorCounts, hm_parentObjDef2ChildObjDefsSet) {
    var furtherIteration = true;
    while (furtherIteration) {
        //separate the elements by the criterion "predecessors" / "no predecessors"
        var objDefsWithoutPredecessors = new Array();
        var objDefsWithPredecessors = new Array();
        for (var i=0; i<unsortedObjDefArray.length; i++) {
            var count = objDefPredecessorCounts.get(unsortedObjDefArray[i]);
            if (count == 0) {
                topDownSortedObjDefArray.push(unsortedObjDefArray[i]);
                objDefsWithoutPredecessors.push(unsortedObjDefArray[i]); //mark the ObjDef as relevant for count updates of the parent ObjDefs
     
            } else {
                objDefsWithPredecessors.push(unsortedObjDefArray[i]);
            }
        }
        
        furtherIteration = objDefsWithoutPredecessors.length > 0 && objDefsWithPredecessors.length != unsortedObjDefArray.length;
        //in the next iteration only the elements with (unprocessed) predecessors will be checked
        unsortedObjDefArray.length = 0; //clear the array
        for (var h=0; h<objDefsWithPredecessors.length; h++) {
            unsortedObjDefArray.push(objDefsWithPredecessors[h]);
        }
        
        //update the predecessor count map
        for (var j=0; j<objDefsWithoutPredecessors.length; j++) {
            var childObjDefsSet = hm_parentObjDef2ChildObjDefsSet.get(objDefsWithoutPredecessors[j]);
            if (childObjDefsSet != null) {
                var childObjDefsArray = convertHashSetToJSArray(childObjDefsSet);
                for (var k=0; k<childObjDefsArray.length; k++) { 
                    var currentParentCount = objDefPredecessorCounts.get(childObjDefsArray[k]);
                    objDefPredecessorCounts.put(childObjDefsArray[k], --currentParentCount);
                }
            }
        }
    }
    
    topDownSortedObjDefArray.reverse();
}


function determineCycles(unsortedObjDefsToCheckArray, hm_parentObjDef2ChildObjDefsSet) {
    
    var uncheckedObjDefs = unsortedObjDefsToCheckArray.concat(new Array());
    var cycles = new Array();
    
    while (uncheckedObjDefs.length > 0) {
        var startObjDef = uncheckedObjDefs[0];
        //find out to which cycle the start ObjDef belongs - cycleArray is filled by recursion
        var cycleArray = new Array();
        determineCycleForObjDefRecursive(startObjDef, unsortedObjDefsToCheckArray, hm_parentObjDef2ChildObjDefsSet, cycleArray);
        //add the ObjDef array representing the recognized cycle to the result
        cycles.push(cycleArray);
        //remove all cycle member from the array of objects to check
        for (var i=0; i<cycleArray.length; i++) {
            var index = uncheckedObjDefs.indexOf(cycleArray[i]);
            uncheckedObjDefs.splice(index, 1);
        }
    }
    
    return cycles;
}


function determineCycleForObjDefRecursive(ojDef, objDefsToCheckArray, hm_parentObjDef2ChildObjDefsSet, cycleArray) {
    var index = cycleArray.indexOf(ojDef);
    if (index >= 0) {
        return;
    }
    cycleArray.push(ojDef);
    var childObjDefSet = hm_parentObjDef2ChildObjDefsSet.get(ojDef);
    var childObjDefArray = convertHashSetToJSArray(childObjDefSet);
    for (var i=0; i<childObjDefArray.length; i++) {
        var childIndex = objDefsToCheckArray.indexOf(childObjDefArray[i]);
        //do recursion only for those children whose cycle membership is to check
        if (childIndex >= 0) {
            determineCycleForObjDefRecursive(childObjDefArray[i], objDefsToCheckArray, hm_parentObjDef2ChildObjDefsSet, cycleArray);
        }
    }
}


//---------------------------------------------------------------------------------------------------
//---------------------------------- REPORT EXCEPTION HANDLING --------------------------------------

/*---------------------------------------------------------------------------------------
    Convenience method for setting exceptions as properties at the report execution
    context.
---------------------------------------------------------------------------------------*/
function setExceptionProperty(ex) {
    Context.setProperty("exception", ex);
    Context.setProperty("scriptName", Context.getScriptInfo(Constants.SCRIPT_NAME));
    
}