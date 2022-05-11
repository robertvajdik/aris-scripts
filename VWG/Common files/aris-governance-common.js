/**
 * Copyright (C) 2020 Software AG, Darmstadt, Germany and/or Software AG USA Inc., Reston, VA, USA,
 * and/or its subsidiaries and/or its affiliates and/or their licensors.
 *
 * Use, reproduction, transfer, publication or disclosure is prohibited
 * except as specifically provided for in your License Agreement with Software AG.
 *
 * Version: 10.0.12.0.1470486
 */

/*
 * Sort input array or aris data selected objects according to passed "selectedOrder" property value
 */
function makeAPGorder(inputSelectedItems){
    var g_database = ArisData.getActiveDatabase();
	var sSelectedOrder = Context.getProperty("selectedOrder");
	var sOrder = new Array();
	if (sSelectedOrder != null) {
		sOrder = sSelectedOrder.split(";");
	}
	if (sOrder.length == 0 ) {
		return inputSelectedItems;
	}

	for(var i in sOrder){
		sOrder[i] = sOrder[i].substring(2) + "";
	}

	var count = 0;
	var outputSelectedItems = new Array();
	for (var i in inputSelectedItems){
		count = sOrder.indexOf(inputSelectedItems[i].GUID()+"");
		outputSelectedItems[count] = g_database.FindGUID(sOrder[count]);
	}
	return outputSelectedItems;
}

function dateToString(p_date) {
	return Context.getComponent("Process").dateToString(p_date);
}

function stringToDate(p_string) {
	return Context.getComponent("Process").stringToDate(p_string);
}

function stringToUTCDate(p_string){
    d = Context.getComponent("Process").stringToDate(p_string);
    if(p_string && p_string.endsWith("Z")){
        // this is already UTC zulu format, just keep it
    } else {
        d.setTime( d.getTime() - d.getTimezoneOffset()*60*1000 );
    }
    return d;
}

function maskXMLCharacters(p_string) {
	return Context.getComponent("Process").maskReservedXMLCharacters(p_string);
}
