/**
 * Copyright (C) 2020 Software AG, Darmstadt, Germany and/or Software AG USA Inc., Reston, VA, USA,
 * and/or its subsidiaries and/or its affiliates and/or their licensors.
 *
 * Use, reproduction, transfer, publication or disclosure is prohibited
 * except as specifically provided for in your License Agreement with Software AG.
 *
 * Version: 10.0.12.0.1470486
 */

// BLUE-17650 - Import/Usage of 'convertertools.js' removed  
 
/*const COL_SAG_BLUE_1 = RGB( 31,  57,  86);  // #1f3956
const COL_SAG_BLUE_2 = RGB(  0, 112, 150);  // #007096
const COL_SAG_BLUE_3 = RGB(  5, 137, 161);  // #0589a1
const COL_SAG_GREY_1 = RGB(242, 242, 242);  // #f2f2f2
const COL_SAG_GREY_2 = RGB(166, 166, 166);  // #a6a6a6*/

/** Write title page with report name and username of the user that generated the report
 * @param {Output} outputObj The output object
 */
function writeTitlePage(outputObj, isArcmReport) {
    var username = "";
    if (isArcmReport) {
        var user = ARCM.getCurrentUser();
        username = user.getLastName() + " " + user.getFirstName();
    } else {
        var user = ArisData.getActiveUser();
        username = user.Attribute(Constants.AT_LAST_NAME, nLocale).getValue() + " " + user.Attribute(Constants.AT_FIRST_NAME, nLocale).getValue();
    }
	emptyLine(outputObj, 21);
	outputObj.OutputLnF(Context.getScriptInfo(Constants.SCRIPT_NAME), "TITLE_PAGE_TITLE");
	emptyLine(outputObj, 21);
	outputObj.OutputLnF(username, "TITLE_PAGE_USER");
}

/** Write table of content on its own page(s)
 * @param {Output} outputObj The output object
 */
function writeTableOfContent(outputObj){
    if(isExcel()) return; // TOC is not working properly within excel
	newPage(outputObj);
    outputObj.OutputLnF(getString("HEADING_TABLE_OF_CONTENTS"), "TITLE_PAGE_TITLE");
    emptyLine(outputObj, 2);
	
    var lineSpacing = 1.2;
    outputObj.SetTOCFormat(0, defaultFont, 10, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_LEFT | Constants.FMT_VCENTER, 0, 0, 0, 0, 0, lineSpacing);
    outputObj.SetTOCFormat(1, defaultFont, 10, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_LEFT | Constants.FMT_VCENTER, 3, 0, 0, 0, 0, lineSpacing);
    outputObj.SetTOCFormat(2, defaultFont, 10, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_LEFT | Constants.FMT_VCENTER, 6, 0, 0, 0, 0, lineSpacing);
    outputObj.SetTOCFormat(3, defaultFont, 10, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_LEFT | Constants.FMT_VCENTER, 9, 0, 0, 0, 0, lineSpacing);
    outputObj.SetTOCFormat(4, defaultFont, 10, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_LEFT | Constants.FMT_VCENTER, 12, 0, 0, 0, 0, lineSpacing);
    outputObj.SetTOCFormat(5, defaultFont, 10, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_LEFT | Constants.FMT_VCENTER, 15, 0, 0, 0, 0, lineSpacing);
    outputObj.SetTOCFormat(6, defaultFont, 10, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_LEFT | Constants.FMT_VCENTER, 18, 0, 0, 0, 0, lineSpacing);
            
    outputObj.OutputField(Constants.FIELD_TOC, defaultFont, 10, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_CENTER);
	emptyLine(outputObj); // without this, data will continue on the same page as TOC
	newPage(outputObj);
}

function writeFAD(outputObj, model, headingLevel) {
	writeModel(outputObj, model, headingLevel);
	writeObjectOccurencesOfFAD(outputObj, model, headingLevel + 1);
}

function writeModel(outputObj, model, headingLevel) {
	// NEW PAGE FOR ALL EXCEPT FIRST MODEL IN REPORT
	if (isFirstModel)
		isFirstModel = false;
	else
		newPage(outputObj);
	
	// HEADING
	outputObj.OutputLnF(model.Name(nLocale), getHeaderStyleName(headingLevel));

	// ATTRIBUTES
	writeAttributesTable(outputObj, model, COL_SAG_BLUE_1);
	
	// GRAPHIC
	writeModelGraphic(outputObj, model);
}

function writeObjectOccurencesOfFAD(outputObj, model, headingLevel) {
	var objectOccurences = model.ObjOccList();
	if (objectOccurences.length > 0) {
		
		newPage(outputObj);
		outputObj.OutputLnF(getString("HEADING_OBJECTS"), getHeaderStyleName(headingLevel));
		
		var bObjColored = true;
		objectOccurences = ArisData.sort(objectOccurences, Constants.SORT_OBJDEF_NAME, Constants.SORT_NONE, Constants.SORT_NONE, nLocale);
		objectOccurences = sortOccurencesByType(objectOccurences);
		
		for (var i = 0; i < objectOccurences.length; i++){
			var objOcc = objectOccurences[i];
			var objDef = objOcc.ObjDef();
			if (objDef.IsValid()) {
				//writeObjOccPicture(outputObj, objDef, objOcc);
				
				writeAttributesTable(outputObj, objDef, COL_SAG_BLUE_2);
			}
		}
	}
}

function writeObjOccPicture(outputObj, objDef, objOcc) {
    var oSymPic = ArisData.ActiveFilter().SymbolGraphic(objOcc.getSymbol(), objOcc.getShaded(), false, true);
    
    outputObj.SetFrameStyle(Constants.FRAME_RIGHT, 0);
    outputObj.SetFrameStyle(Constants.FRAME_BOTTOM, 0);
    outputObj.SetFrameStyle(Constants.FRAME_LEFT, 0);
    outputObj.SetFrameStyle(Constants.FRAME_TOP, 0);    
    
    outputObj.BeginTable(100, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_LEFT, 0);
    outputObj.TableCell("", 25, defaultFont, 10, Constants.C_BLACK, Constants.C_TRANSPARENT, 0, Constants.FMT_LEFT | Constants.FMT_VTOP, 0);
    outputObj.OutGraphic(oSymPic, -1, 200, 200);
    outputObj.TableCell(objDef.Name(nLocale), 75, defaultFont, 10, Constants.C_BLACK, Constants.C_TRANSPARENT, 0, Constants.FMT_LEFT | Constants.FMT_VCENTER, 0);
	outputObj.EndTable("", 100, defaultFont, 12, Constants.C_BLACK, Constants.C_TRANSPARENT, 0, Constants.FMT_LEFT | Constants.FMT_VTOP, 0);
    
    outputObj.ResetFrameStyle();
}

function writeAttributesTable(outputObj, modelOrObjDef, tableHeaderBgColor) {
	var colHeadings = new Array(modelOrObjDef.Name(nLocale), modelOrObjDef.Type());
	var attributes = modelOrObjDef.AttrList(nLocale);
	
	outputObj.BeginTable(100, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_LEFT, 0);
	writeTableHeaderWithColorWidths(outputObj, colHeadings, 10, tableHeaderBgColor, Constants.C_WHITE , [40,60]);
	writeAttributes(outputObj, attributes);
	outputObj.EndTable("", 100, defaultFont, 12, Constants.C_BLACK, Constants.C_TRANSPARENT, 0, Constants.FMT_LEFT | Constants.FMT_VTOP, 0);
	emptyLine(outputObj);
}

function writeSpecificAttributesTable(outputObj, modelOrObjDef, attributeNums, tableHeaderBgColor, showOnlyIfNotEmpty) {
    var colHeadings = new Array(modelOrObjDef.Name(nLocale), modelOrObjDef.Type());
    var attributes = [];
    for (var i = 0; i < attributeNums.length; i++) {
        attributes[i] = modelOrObjDef.Attribute(attributeNums[i], nLocale);
    }
    outputObj.BeginTable(100, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_LEFT, 0);
    writeTableHeaderWithColorWidths(outputObj, colHeadings, 10, tableHeaderBgColor, Constants.C_WHITE, [40, 60]);
    writeAttributes(outputObj, attributes, showOnlyIfNotEmpty);
    outputObj.EndTable("", 100, defaultFont, 12, Constants.C_BLACK, Constants.C_TRANSPARENT, 0, Constants.FMT_LEFT | Constants.FMT_VTOP, 0);
    emptyLine(outputObj);
}

function writeAttributes(outputObj, attributes, showOnlyIfNotEmpty) {
    if (attributes.length > 0) {
        sortedAttributes = ArisData.sort(attributes, Constants.SORT_METHOD, Constants.SORT_NONE, Constants.SORT_NONE, nLocale);
        for (var i = 0; i < sortedAttributes.length; i++) {
            attribute = sortedAttributes[i];
            if (attribute.TypeNum() == Constants.AT_NAME || attribute.TypeNum() == Constants.AT_TYPE_1 || attribute.TypeNum() == Constants.AT_TYPE_6 || inCaseRange(attribute.TypeNum(), Constants.AT_TYP1, Constants.AT_TYP7) || (showOnlyIfNotEmpty != null && showOnlyIfNotEmpty.indexOf(i) != -1 && attribute.getValue() == "")) {
                // No output for objects Name and Type, because they are in the table heading already, also if the attribute index is in showOnlyIfNotEmpty array, its not shown if empty.
            } else {
                outputObj.TableRow();
                outputObj.TableCell(("     " + attribute.Type()), 40, defaultFont, 10, Constants.C_BLACK, Constants.C_GREY_80_PERCENT, 0, Constants.FMT_LEFT | Constants.FMT_VTOP, 0);
                outputObj.TableCell(attribute.GetValue(true), 60, defaultFont, 10, Constants.C_BLACK, Constants.C_WHITE, 0, Constants.FMT_LEFT | Constants.FMT_VTOP, 0);
            }
        }
    }
}

function writeModelGraphic(outputObj, model) {
	var picture = model.Graphic(false, false, nLocale);
	outputObj.OutGraphic(picture, -1, 300, 300);
	emptyLine(outputObj);
}

/**
 *  function writeTableHeader
 *  writes table header for specified column headings
 *  @param outfile     file to write header to
 *  @param colHeadings array with column headings
 *  @param fontSize    font size
 *  @param backColor   background color
 *  @param textColor   text color
 *  @param widths      array with column widths
 */
function writeTableHeaderWithColorWidths(outputObj, colHeadings, fontSize, backColor, textColor, colWidths) {
	var defaultWidth;
	if (!colWidths)
		defaultWidth = 100 / colHeadings.length;
	outputObj.TableRow();	  
	for(var i=0;i<colHeadings.length;i++)
		if (!colWidths)
			outputObj.TableCell(colHeadings[i], defaultWidth, defaultFont, fontSize, textColor, backColor, 0, Constants.FMT_BOLD | Constants.FMT_LEFT | Constants.FMT_VTOP, 0);
		else
			outputObj.TableCell(colHeadings[i], colWidths[i], defaultFont, fontSize, textColor, backColor, 0, Constants.FMT_BOLD | Constants.FMT_LEFT | Constants.FMT_VTOP, 0);
}

function sortOccurencesByType(objectOccurences) {
	var functions = [];
	var orgUnits = [];
	var appSystems = [];
	var clusters = [];
	var otherObjects = [];
	
	for (var i = 0; i < objectOccurences.length; i++) {
		var typeNum = objectOccurences[i].ObjDef().TypeNum();
		switch (typeNum) {
			case Constants.OT_FUNC:
				functions.push(objectOccurences[i]);
				break;
			case Constants.OT_ORG_UNIT:
				orgUnits.push(objectOccurences[i]);
				break;
			case Constants.OT_APPL_SYS_TYPE:
				appSystems.push(objectOccurences[i]);
				break;
			case Constants.OT_CLST:
				clusters.push(objectOccurences[i]);
				break;
			default:
				otherObjects.push(objectOccurences[i]);
				break;
		}
	}
	var sortedOccurences = functions.concat(orgUnits, appSystems, clusters, otherObjects);
	return sortedOccurences;
}

function getTableCellColor_AttrBk(p_bColored) {
    if (p_bColored)
        return COL_SAG_GREY_1;
        
    return Constants.C_TRANSPARENT;
}

/** Check for excel format output
 */
function isExcel() {
	if (Context.getSelectedFormat()==Constants.OutputXLS) return true;
	if (Context.getSelectedFormat()==Constants.OutputXLSX) return true;
	return false;
}

function newPage(outputObj) {
	outputObj.OutputField(Constants.FIELD_NEWPAGE, defaultFont, 10, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_CENTER);
}

function emptyLine(outputObj, nRepeat) {
	if (nRepeat && nRepeat > 0) {
		for (var i = 0; i < nRepeat; i++) {
			outputObj.OutputLn("", defaultFont, 12, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_LEFT, 0);
		}
	} else {
		outputObj.OutputLn("", defaultFont, 12, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_LEFT, 0);
	}	
}

function getHeaderStyleName(level) {
	switch (level) {
		case 1:
			return "REPORT_HD1";
		case 2:
			return "REPORT_HD2";
		case 3:
			return "REPORT_HD3";
		case 4:
			return "REPORT_HD4";
		case 5:
			return "REPORT_HD5";
	}
}

function RGB(r, g, b) {
	return (new java.awt.Color(r/255.0,g/255.0,b/255.0,1)).getRGB() & 0xFFFFFF
}

/**
 *  function setReportHeaderFooter
 *  set report header and footer settings
 *  @param outfile  					output file
 *  @param nloc     					locale
 *  @param sTitle
 *  @param bDisplayServer			flag for writing server name
 *  @param bDisplayDatabase		flag for writing database name
 *  @param bDisplayUser				flag for writing user name
 */
function setReportHeaderFooter(outfile, nloc) {
    var sTitle = Context.getScriptInfo(Constants.SCRIPT_TITLE);
    setReportHeaderFooterWithTitle(outfile, nloc, sTitle)
}

function setReportHeaderFooterWithTitle(outfile, nloc, sTitle) {
    // graphics used in header
    var pictleft  = null; 
    var pictright = null; 
    pictleft  = Context.createPicture(Constants.IMAGE_LOGO_LEFT);
    pictright = Context.createPicture(Constants.IMAGE_LOGO_RIGHT);
    
    // header + footer settings
    outfile.BeginHeader();
    outfile.BeginTable(100, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_LEFT, 0);
    outfile.TableRow();
    outfile.TableCell("", 26, defaultFont, 12, Constants.C_BLACK, Constants.C_TRANSPARENT, 0, Constants.FMT_CENTER | Constants.FMT_VCENTER, 0);
    outfile.OutGraphic(pictleft, - 1, 40, 15);
    outfile.TableCell(sTitle, 48, defaultFont, 12, Constants.C_BLACK, Constants.C_TRANSPARENT, 0, Constants.FMT_CENTER | Constants.FMT_VCENTER, 0);
    outfile.TableCell("", 26, defaultFont, 12, Constants.C_BLACK, Constants.C_TRANSPARENT, 0, Constants.FMT_CENTER | Constants.FMT_VCENTER, 0);
    outfile.OutGraphic(pictright, - 1, 40, 15);
    outfile.EndTable("", 100, defaultFont, 10, Constants.C_BLACK, Constants.C_TRANSPARENT, 0, Constants.FMT_LEFT | Constants.FMT_VTOP, 0);
    outfile.EndHeader();
    
    outfile.BeginFooter();
    outfile.BeginTable(100, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_LEFT, 0);
    outfile.TableRow();
    outfile.TableCell("", 26, defaultFont, 10, Constants.C_BLACK, Constants.C_TRANSPARENT, 0, Constants.FMT_CENTER | Constants.FMT_VCENTER, 0);
    outfile.OutputField(Constants.FIELD_DATE, defaultFont, 10, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_CENTER);
    outfile.Output(" ", defaultFont, 10, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_CENTER, 0);
    outfile.OutputField(Constants.FIELD_TIME, defaultFont, 10, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_CENTER);
    outfile.TableCell(Context.getSelectedFile(), 48, defaultFont, 10, Constants.C_BLACK, Constants.C_TRANSPARENT, 0, Constants.FMT_CENTER | Constants.FMT_VCENTER, 0);
    outfile.TableCell("", 26, defaultFont, 10, Constants.C_BLACK, Constants.C_TRANSPARENT, 0, Constants.FMT_CENTER | Constants.FMT_VCENTER, 0);
    outfile.Output("Page ", defaultFont, 10, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_CENTER, 0);
    outfile.OutputField(Constants.FIELD_PAGE, defaultFont, 10, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_CENTER);
    outfile.Output(" of ", defaultFont, 10, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_CENTER, 0);
    outfile.OutputField(Constants.FIELD_NUMPAGES, defaultFont, 10, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_CENTER);
    outfile.EndTable("", 100, defaultFont, 10, Constants.C_BLACK, Constants.C_TRANSPARENT, 0, Constants.FMT_LEFT | Constants.FMT_VTOP, 0);
    outfile.EndFooter();
}

function inCaseRange(val, lower, upper)
{
  return (val >=lower) && (val <= upper);
}