/**
 * Copyright (C) 2020 Software AG, Darmstadt, Germany and/or Software AG USA Inc., Reston, VA, USA,
 * and/or its subsidiaries and/or its affiliates and/or their licensors.
 *
 * Use, reproduction, transfer, publication or disclosure is prohibited
 * except as specifically provided for in your License Agreement with Software AG.
 *
 * Version: 10.0.12.0.1470486
 */

var g_ooutfile;

function createOutputFile() {
    g_ooutfile = Context.createOutputObject();
    setDefaultStyles(g_ooutfile);    
}

 /***********************
    Styles 
 **********************/
var defaultFont = getString("ID_DEFAULT_FONT");

const COL_SAG_BLUE_1 = getColorByRGB( 31,  57,  86);  // #1f3956
const COL_SAG_BLUE_2 = getColorByRGB(  0, 112, 150);  // #007096
const COL_SAG_BLUE_3 = getColorByRGB(  5, 137, 161);  // #0589a1
const COL_SAG_GREY_1 = getColorByRGB(242, 242, 242);  // #f2f2f2
const COL_SAG_GREY_2 = getColorByRGB(166, 166, 166);  // #a6a6a6
var DEACTIVATED_OBJ_FONT_COLOR = getColorByRGB(177, 177, 177); //#b1b1b1
var COL_LOGO = getColorByRGB( 23, 118, 191);

function setDefaultStyles(outputFile) {
    g_ooutfile.DefineF("Heading 1",defaultFont,14,Constants.C_BLACK,Constants.C_TRANSPARENT,Constants.FMT_LEFT | Constants.FMT_BOLD,7,0,0,3,-7,0);
    g_ooutfile.DefineF("Heading 2",defaultFont,14,Constants.C_BLACK,Constants.C_TRANSPARENT,Constants.FMT_LEFT | Constants.FMT_BOLD,14,0,0,3,-10,0);
    g_ooutfile.DefineF("Heading 3",defaultFont,14,Constants.C_BLACK,Constants.C_TRANSPARENT,Constants.FMT_LEFT | Constants.FMT_BOLD,26,0,0,3,-14,0);
    g_ooutfile.DefineF("Heading 4",defaultFont,14,Constants.C_BLACK,Constants.C_TRANSPARENT,Constants.FMT_LEFT | Constants.FMT_BOLD,32,0,0,3,-17,0);
    g_ooutfile.DefineF("Heading 5",defaultFont,14,Constants.C_BLACK,Constants.C_TRANSPARENT,Constants.FMT_LEFT | Constants.FMT_BOLD,44,0,0,3,-20,0);
    g_ooutfile.DefineF("Heading 6",defaultFont,14,Constants.C_BLACK,Constants.C_TRANSPARENT,Constants.FMT_LEFT | Constants.FMT_BOLD,56,0,0,3,-24,0);
    g_ooutfile.DefineF("Heading 7",defaultFont,14,Constants.C_BLACK,Constants.C_TRANSPARENT,Constants.FMT_LEFT | Constants.FMT_BOLD,67,0,0,3,-28,0);
    g_ooutfile.DefineF("Heading 8",defaultFont,14,Constants.C_BLACK,Constants.C_TRANSPARENT,Constants.FMT_LEFT | Constants.FMT_BOLD,79,0,0,3,-32,0);
    g_ooutfile.DefineF("Heading 9",defaultFont,14,Constants.C_BLACK,Constants.C_TRANSPARENT,Constants.FMT_LEFT | Constants.FMT_BOLD,89,0,0,3,-36,0);
    g_ooutfile.DefineF("Group Heading 1",defaultFont,12,Constants.C_BLACK,Constants.C_TRANSPARENT,Constants.FMT_LEFT,-2,0,0,1,0,0);
    g_ooutfile.DefineF("Group Heading 2",defaultFont,10,Constants.C_BLACK,Constants.C_TRANSPARENT,Constants.FMT_LEFT,-2,0,0,1,0,0); 
}

function getColorByRGB(R, G, B) {
    return (new java.awt.Color(R/255.0 ,G/255.0, B/255.0, 1)).getRGB() & 0xFFFFFF;
}

function getStyle(newStyle){
    if(newStyle == null) newStyle = {};
    return {
        'width': newStyle.width || 25,
        'font': newStyle.font || defaultFont,
        'fontSize': newStyle.fontSize || 10,
        'fontColor': newStyle.fontColor || Constants.C_BLACK,
        'bgColor': newStyle.bgColor || Constants.C_TRANSPARENT,
        'shading': newStyle.shading || 0,
        'format': newStyle.format || (Constants.FMT_CENTER | Constants.FMT_VCENTER),
//        'format': newStyle.format || (Constants.FMT_VCENTER),
        'indent': newStyle.indent || 0,
        'rowspan': newStyle.rowspan || 1,
        'colspan': newStyle.colspan || 1
    }
}

var commonStyles = {
    'BASE_TEXT': {
    },
    'BASE_TEXT_GREYBG': {
            bgColor: COL_SAG_GREY_1
    },
    'BASE_TEXT_GREYBG_CENTER': {
            bgColor: COL_SAG_GREY_1,
            format: Constants.FMT_CENTER | Constants.FMT_VCENTER
    },
    'BASE_TEXT_GREYBG_TOP': {
            bgColor: COL_SAG_GREY_1,
            format: Constants.FMT_LEFT | Constants.FMT_VTOP
    },
    'BASE_TEXT_CENTER': {
            format: Constants.FMT_CENTER | Constants.FMT_VCENTER
    },
    'HEADER': {
            fontSize: 16,
            format: Constants.FMT_BOLD
    },
    'SUBHEADER': {
            fontSize: 12,
            format: Constants.FMT_BOLD
    },
    'FOOTER': {
            fontSize: 14,
            format: Constants.FMT_CENTER
    },
    'BASE_TEXT_BOLD': {
            fontSize: 9,
            format: Constants.FMT_BOLD
    },
    'TABLE_OF_CONTENTS': {
            fontSize: 16,
            format: Constants.FMT_BOLD| Constants.FMT_VLEFT
    }
}
  
/***********************
    One object output 
 **********************/

 function writeAppObject(arcmAppObject, outputObj, widths) {
    if (outputObj) {
		g_ooutfile = outputObj;
        setDefaultStyles(g_ooutfile);
    }
    var groups = getGroupsOfAttributesToDisplay(arcmAppObject);
    var dataColumnCount = getColumnCount(groups);
	if (!widths) {
		widths = getColWidths(dataColumnCount);
    }
    for (var i = 0; i < groups.length; i++) {
        var group = groups[i];
        var name = group.name;
        if(name != "" && ((group.totalAttr.length > 0 && group.isTopLevel) || (group.attributes.length > 0 && !group.isTopLevel))) {
            if(group.level == 1) {
                writeTitle(name, "Group Heading 1");
            }
            else {
                writeTitle(name, "Group Heading 2");
            }
        }            
        if(!isExcelOutputFormat()) beginTable(widths);
        writeGroup(groups[i].attributes, dataColumnCount);
        if(!isExcelOutputFormat()) endTable();
//        writeEmptyLines(1);
        writeTitle("", "Group Heading 2");
        
    }
}

function writeGroup(attributes, dataColumnCount) {
    for (var i = 0; i < attributes.length; i++) {
        var attribute = attributes[i];
        if (attribute && attribute.visible){
            writeAttribute(attribute, dataColumnCount);
        }
    }
}

function writeAttribute(attribute, dataColumnCount) {
    var rowCount = attribute.valueRows.length;
    g_ooutfile.TableRow();
    tableCell(attribute.name, {'bgColor':Constants.C_GREY_80_PERCENT, 'format':Constants.FMT_LEFT | Constants.FMT_VCENTER, 'rowspan':rowCount});
    for (var i = 0; i < rowCount; i++) {
        if (i > 0) g_ooutfile.TableRow();
        writeAttributeRow(attribute.valueRows[i], dataColumnCount);
    }
}

function writeAttributeRow(valueRow, dataColumnCount) {
    var baseColspan = 2; // for icon and uiValue
    var colsInRow = valueRow.valueCols.length;
    for (var i = 0; i < colsInRow; i++) {
        var col = valueRow.valueCols[i];
        var style = {'format':Constants.FMT_LEFT | Constants.FMT_VCENTER, 'colspan':baseColspan * (dataColumnCount / colsInRow)};
        writeAttributeColumn(col, style);
    }
}

function writeAttributeColumn(valueCol, style) {
    if (valueCol.deactivated) {
        style.fontColor = DEACTIVATED_OBJ_FONT_COLOR;
    }
    writeAttributeCell(valueCol.uiValue, style, valueCol.icon);
}

function writeAttributeCell(uiValue, style, icon) {
    if (icon) {
        var totalColspan = style.colspan;
        style.colspan = 1;
        g_ooutfile.SetFrameStyle(Constants.FRAME_RIGHT, 0);
        var image = icon.getImage();
        tableCell("", style);
        g_ooutfile.OutGraphic(Context.createPicture(image, Constants.IMAGE_FORMAT_PNG), -1, 1, 1);
        g_ooutfile.ResetFrameStyle();
        
        style.colspan = totalColspan - 1;
        g_ooutfile.SetFrameStyle(Constants.FRAME_LEFT, 0);
        tableCell(uiValue, style);
        g_ooutfile.ResetFrameStyle();
    } else {
        tableCell(uiValue, style);
    }
}

function getGroupsOfAttributesToDisplay(object) {
    var groups = [];
    var totalAttr = [];
    var metadataGroups = object.getMetadata().getGroups();
    for (var i = 0; i < metadataGroups.size(); i++) {
        var arcmGroup = metadataGroups.get(i);
        var attributeTypes = arcmGroup.getAttributeTypes();
        var attributes = [];
        if(arcmGroup.isTopLevelGroup()) {
            totalAttr = [];        
        }

        var group = {"attributes" : attributes, "name": arcmGroup.getGroupName(), "totalAttr": totalAttr, "level": arcmGroup.getGroupLevel(), "isTopLevel" : arcmGroup.isTopLevelGroup()};        
                  
        for (var j = 0; j < attributeTypes.size(); j++) {
            var attr = getAttribute(object, attributeTypes.get(j));
            attributes.push(attr);      
            if(attr !== undefined) {
                if(attr.visible) {
                    totalAttr.push(attr);
                }
            }    
        }
        groups.push(group);
    }
    return groups;
}

function getColumnCount(groups) {
    var columnCount = 1;
    for (var i = 0; i < groups.length; i++) {
        for (var j = 0; j < groups[i].attributes.length; j++) {
            var attribute = groups[i].attributes[j];
            var rowCount = attribute ? attribute.valueRows.length : 0;
            for (var k = 0; k < rowCount; k++) {
                var attributeRowCols = attribute.valueRows[k].valueCols.length;
                if (attributeRowCols > columnCount)
                    columnCount = attributeRowCols;
            }
        }
    }
    return columnCount;
}

/***********************
          List 
 **********************/

function writeAppObjectList(objects, attributeTypes, columnWidths) {
    if (!columnWidths) columnWidths = getColWidthsForList(attributeTypes.length);
    
    beginTable(columnWidths);
    g_ooutfile.TableRow();
    writeHeadersRow(objects[0], attributeTypes);
    for (var i = 0; i < objects.length; i++) {
        writeObjectRowInList(objects[i], attributeTypes);
    }
    endTable();
}

function writeHeadersRow(object, attributeTypes) {
    var baseColspan = 2; // for icon and uiValue
    for (var i = 0; i < attributeTypes.length; i++) {
        var attributeUiName = getAttributeTypeName(object, attributeTypes[i]);
        var style = {'bgColor':Constants.C_GREY_80_PERCENT, 'format':Constants.FMT_LEFT | Constants.FMT_VCENTER, 'colspan':baseColspan};
        writeAttributeCell(attributeUiName, style);
    }
}

function writeObjectRowInList(object, attributeTypes) {
    var attributes = [];
    var rowsForObj = 1;
    g_ooutfile.TableRow();
    for (var i = 0; i < attributeTypes.length; i++) {
        isColspanTable = true;
        var attribute = getAttributeForList(object, attributeTypes[i]);
        attributes.push(attribute);
        if (attribute.valueRows.length > rowsForObj) rowsForObj = attribute.valueRows.length;
    }
    
    for (var attrRow = 0; attrRow < rowsForObj; attrRow++) {
        writeAttributeRowInList(attrRow, attributes, rowsForObj);
    }
}

function writeAttributeRowInList(attrRow, attributes, rowsForObj) {
    var baseColspan = 2; // for icon and uiValue
    g_ooutfile.TableRow();
    for (var i = 0; i < attributes.length; i++) {
        var valueRow = attributes[i].valueRows[attrRow];
        if (valueRow) {
            var col = valueRow.valueCols[0];
            var rowspan = rowsForObj / attributes[i].valueRows.length;
            var style = {'format':Constants.FMT_LEFT | Constants.FMT_VCENTER, 'colspan':baseColspan, 'rowspan':rowspan};
            writeAttributeColumn(col, style);
        }
    }
}

/***********************
          Data
 **********************/

function getAttribute(object, attributeType) {
    if (object.isValueAttributeType(attributeType)) {
        return getValueAttribute(object, attributeType);
    } else if (object.isEnumAttributeType(attributeType)) {
        return getEnumAttribute(object, attributeType);
    } else if (object.isListAttributeType(attributeType)) {
        return getListAttribute(object, attributeType);
    } else if (object.isCompositeAttributeType(attributeType)) {
        return getCompositeAttribute(object, attributeType);
    }
}

function getAttributeForList(object, attributeType) {
    if (object.isValueAttributeType(attributeType)) {
        return getValueAttribute(object, attributeType);
    } else if (object.isEnumAttributeType(attributeType)) {
        return getEnumAttribute(object, attributeType);
    } else if (object.isListAttributeType(attributeType)) {
        return getListAttributeForList(object, attributeType);
    }
}

function getValueAttribute(object, attributeType) {
    var attribute = {attributeType: attributeType, valueRows: [], name: "", visible: true, isEmpty: true};
    var attr = object.getValueAttribute(attributeType);
    attribute.name = attr.getName();
    attribute.visible = attr.isVisible();
	attribute.isEmpty = attr.isEmpty();
    var valueRow = {};
    valueRow.valueCols = [];
    var value = {};
    value.uiValue = attr.getUiValue();
    value.icon = attr.getIcon();
    valueRow.valueCols.push(value);
    attribute.valueRows.push(valueRow);
    
    return attribute;
}

function getEnumAttribute(object, attributeType) {
    var attribute = {attributeType: attributeType, valueRows: [], name: "", visible: true, isEmpty: true};
    var attr = object.getEnumAttribute(attributeType);
    var selectedItems = attr.getSelectedItems();
    attribute.name = attr.getName();
    attribute.visible = attr.isVisible();
	attribute.isEmpty = attr.isEmpty();
    for (var i = 0; i < selectedItems.size(); i++) {
        var valueRow = {};
        valueRow.valueCols = [];
        var value = {};
        value.uiValue = selectedItems.get(i).getUiName();
        value.icon = selectedItems.get(i).getIcon();
        valueRow.valueCols.push(value);
        attribute.valueRows.push(valueRow);
    }
    if (selectedItems.size() == 0) { // make sure there is at least one empty cell, if no enums are selected
        attribute.valueRows.push({valueCols: [{uiValue: ""}]});
    }
    return attribute;
}

function getListAttribute(object, attributeType) {
    var attribute = {attributeType: attributeType, valueRows: [], name: "", visible: true, isEmpty: true};
    var attr = object.getListAttribute(attributeType);
    var connectedObjects = attr.getConnectedObjects();
    attribute.name = attr.getName();
    attribute.visible = attr.isVisible();
	attribute.isEmpty = attr.isEmpty();
    
    if (connectedObjects.size() == 0) {
        attribute.valueRows.push({valueCols: [{uiValue: ""}]});
    } else {
        for (var i = 0; i < connectedObjects.size(); i++) {
			var conObj = connectedObjects.get(i);
            if (attr.hasCxnObjects() && i == 0) {
                var cxnObject = attr.getCxnObject(conObj);
                var types = cxnObject.getAttributeTypes();
                var headerRow = {};
                headerRow.valueCols = [];
                headerRow.valueCols.push({uiValue: ""});
                for (var j = 0; j < types.size(); j ++) {
                    var name = getAttributeTypeName(cxnObject, types.get(0));
                    headerRow.valueCols.push({uiValue: name});
                }
                attribute.valueRows.push(headerRow);
            }
            
            var valueRow = {};
            valueRow.valueCols = [];
            var cell = {};
			cell.uiValue = getUiValueOfConnectedObject(conObj);
            cell.icon = conObj.getIcon();
			cell.deactivated = false;
            if (isObjectDeactivated(conObj)) {
                cell.deactivated = true;
            }
            valueRow.valueCols.push(cell);
			// add object type column for issue relevant objects (ACR-9641)
			if (attributeType == "issueRelevantObjects") {
				var objTypeCell = {uiValue: conObj.getValueAttribute('obj_type').getUiValue()};
				valueRow.valueCols.push(objTypeCell);
			}
            if (attr.hasCxnObjects()) {
                var cxnObject = attr.getCxnObject(conObj);
                var types = cxnObject.getAttributeTypes();
                for (var j = 0; j < types.size(); j ++) {
                    var cxnAttr = getAttribute(cxnObject, types.get(j));
                    if (cxnAttr.valueRows[0].valueCols) { // there shouldnt be more than index 0, because list attributes contain just value or enum attributes and they don't contain more than 1 value column.
                        valueRow.valueCols.push(cxnAttr.valueRows[0].valueCols[0]);
                    }
                }
            }
            attribute.valueRows.push(valueRow);
        }
    }
    return attribute;
}

function getListAttributeForList(object, attributeType) {
    var attribute = {attributeType: attributeType, valueRows: [], name: "", visible: true, isEmpty: true};
    var attr = object.getListAttribute(attributeType);
    var connectedObjects = attr.getConnectedObjects();
    attribute.name = attr.getName();
    attribute.visible = attr.isVisible();
	attribute.isEmpty = attr.isEmpty();
    
    if (connectedObjects.size() == 0) {
        attribute.valueRows.push({valueCols: [{uiValue: ""}]});
    } else {
        for (var i = 0; i < connectedObjects.size(); i++) {
            var conObj = connectedObjects.get(i);
            var valueRow = {};
            valueRow.valueCols = [];
            var cell = {};
            cell.uiValue = getUiValueOfConnectedObject(conObj);
            cell.icon = conObj.getIcon();
            cell.deactivated = false;
            if (isObjectDeactivated(conObj)) {
                cell.deactivated = true;
            }
            valueRow.valueCols.push(cell);
            attribute.valueRows.push(valueRow);
        }
    }
    return attribute;
}

function getCompositeAttribute(object, attributeType){
    var reportAttribute = {attributeType: attributeType, valueRows: [], name: "", visible: true, isEmpty: true};
    var attr = object.getCompositeAttribute(attributeType);
    reportAttribute.name = attr.getName();
    reportAttribute.visible = attr.isVisible();
    reportAttribute.isEmpty = attr.isEmpty();
    
    var valueRow = {};
    valueRow.valueCols = [];
    var value = {};
    value.uiValue = attr.getUiValue();
    valueRow.valueCols.push(value);
    reportAttribute.valueRows.push(valueRow);
    return reportAttribute;
}

function getUiValueOfConnectedObject(obj) {
    var displayAttribute = obj.getMetadata().getDisplayAttributeType();
    var isObjIdActiveDisplayAttribute = false;
	// uiValue may be created differently for object types using templates in ARCM
	var uiValue = "";
	if (String(obj.getValueAttribute("obj_type").getRawValue()) === "RA_IMPACTTYPE") {
		uiValue = getDisplayValueOfObject(obj.getListAttribute("impacttype").getConnectedObjects().get(0)); // impacttype display value instead of RAimpacttype
	} else {
        if (shouldNameBeUiValueInsteadOfObjId(obj)) {
            uiValue = obj.getValueAttribute("name").getUiValue();
        } else {
            uiValue = getDisplayValueOfObject(obj);
            if (displayAttribute == "obj_id") {
                isObjIdActiveDisplayAttribute = true;
            }
        }
	}
    
    
	// add " (ID 00000)" to list attribute uivalue if id is not display attribute (ACR-9641 and ACR-9843)
	if (!isObjIdActiveDisplayAttribute) {
		uiValue += " " + getIdConventionString(obj);
	}
	return uiValue;
}

function getIdConventionString(obj) {
    var dataKind = obj.getMetadata().getDataKind();
    if (dataKind != "transactiondata") {
        return "";
    }
    
    return " " + getObjIdInBrackets(obj);
}

function getObjIdInBrackets(obj) {
    var objId = obj.getValueAttribute("obj_id").getUiValue();
    return "(" + getString("TEXT_ID") + " " + objId + ")";
}

function shouldNameBeUiValueInsteadOfObjId(obj) {
    if (obj.getMetadata().getDisplayAttributeType() == "obj_id" 
            && obj.getValueAttribute("name") 
            && obj.getValueAttribute("name").getUiValue() != "") {
        return true;
    }
    return false;
}

function isObjectDeactivated(obj) {
    return obj.getValueAttribute("deactivated").getRawValue() == true;
}

function getDisplayValueOfObject(object) {
    var displayAttrType = object.getMetadata().getDisplayAttributeType();
    var displayAttr = object.getValueAttribute(displayAttrType);
    return displayAttr.getUiValue();
}

function getAttributeTypeName(object, attributeType) {
    if (object.isValueAttributeType(attributeType)) {
        return object.getValueAttribute(attributeType).getName();
    } else if (object.isEnumAttributeType(attributeType)) {
        return object.getEnumAttribute(attributeType).getName();
    } else if (object.isListAttributeType(attributeType)) {
        return object.getListAttribute(attributeType).getName();
    }
}

/***********************
    Header and Footer 
 **********************/
function writeReportHeader(title){
    if(isExcelOutputFormat()) return;
    if (!title) {
        title = Context.getScriptInfo(Constants.SCRIPT_TITLE);
    }    
    g_ooutfile.SetFrameStyle(Constants.FRAME_TOP, 0, Constants.BRDR_NORMAL);
    g_ooutfile.SetFrameStyle(Constants.FRAME_LEFT, 0, Constants.BRDR_NORMAL);
    g_ooutfile.SetFrameStyle(Constants.FRAME_RIGHT, 0, Constants.BRDR_NORMAL);
    g_ooutfile.SetFrameStyle(Constants.FRAME_BOTTOM, 50);
    g_ooutfile.BeginHeader();
    g_ooutfile.BeginTable(100, COL_LOGO, Constants.C_TRANSPARENT, Constants.FMT_LEFT, 0);
    g_ooutfile.TableRow();
    g_ooutfile.TableCell("", 26, "Arial", 12, Constants.C_BLACK, Constants.C_TRANSPARENT, 0, Constants.FMT_LEFT | Constants.FMT_VCENTER, 0);
    g_ooutfile.OutGraphic(Context.createPicture(Constants.IMAGE_LOGO_LEFT), - 1, 40, 15);
    g_ooutfile.TableCell(title, 48, "Arial", 12, Constants.C_BLACK, Constants.C_TRANSPARENT, 0, Constants.FMT_CENTER | Constants.FMT_VCENTER, 0);
    g_ooutfile.TableCell("", 26, "Arial", 12, Constants.C_BLACK, Constants.C_TRANSPARENT, 0, Constants.FMT_RIGHT | Constants.FMT_VCENTER, 0);
    g_ooutfile.OutGraphic(Context.createPicture(Constants.IMAGE_LOGO_RIGHT), - 1, 40, 15);
    g_ooutfile.EndTable("", 100, "Arial", 10, Constants.C_BLACK, Constants.C_TRANSPARENT, 0, Constants.FMT_LEFT | Constants.FMT_VTOP, 0);
    g_ooutfile.EndHeader();
    g_ooutfile.ResetFrameStyle();
}

function writeReportFooter(){
    if(isExcelOutputFormat()) return;
    g_ooutfile.SetFrameStyle(Constants.FRAME_TOP, 0, Constants.BRDR_NORMAL);
    g_ooutfile.SetFrameStyle(Constants.FRAME_LEFT, 0, Constants.BRDR_NORMAL);
    g_ooutfile.SetFrameStyle(Constants.FRAME_RIGHT, 0, Constants.BRDR_NORMAL);
    g_ooutfile.SetFrameStyle(Constants.FRAME_BOTTOM, 0, Constants.BRDR_NORMAL);
    g_ooutfile.SetFrameStyle(Constants.FRAME_TOP, 50);
    g_ooutfile.BeginFooter();
    g_ooutfile.BeginTable(100, COL_LOGO, Constants.C_TRANSPARENT, Constants.FMT_LEFT, 0);
    g_ooutfile.TableRow();
    g_ooutfile.TableCell("", 26, "Arial", 10, Constants.C_BLACK, Constants.C_TRANSPARENT, 0, Constants.FMT_LEFT | Constants.FMT_VCENTER, 0);
    g_ooutfile.OutputField(Constants.FIELD_DATE, "Arial", 10, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_LEFT);
    g_ooutfile.Output(" ", "Arial", 10, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_LEFT, 0);
    g_ooutfile.OutputField(Constants.FIELD_TIME, "Arial", 10, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_LEFT);
    g_ooutfile.TableCell(Context.getSelectedFile(), 48, "Arial", 10, Constants.C_BLACK, Constants.C_TRANSPARENT, 0, Constants.FMT_CENTER | Constants.FMT_VCENTER, 0);
    g_ooutfile.TableCell("", 26, "Arial", 10, Constants.C_BLACK, Constants.C_TRANSPARENT, 0, Constants.FMT_RIGHT | Constants.FMT_VCENTER, 0);
    g_ooutfile.Output("Page ", "Arial", 10, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_RIGHT, 0);
    g_ooutfile.OutputField(Constants.FIELD_PAGE, "Arial", 10, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_RIGHT);
    g_ooutfile.Output(" of ", "Arial", 10, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_RIGHT, 0);
    g_ooutfile.OutputField(Constants.FIELD_NUMPAGES, "Arial", 10, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_RIGHT);
    g_ooutfile.EndTable("", 100, "Arial", 10, Constants.C_BLACK, Constants.C_TRANSPARENT, 0, Constants.FMT_LEFT | Constants.FMT_VTOP, 0);
    g_ooutfile.EndFooter();
    g_ooutfile.ResetFrameStyle();
}

/***********************
      Begin table 
 **********************/
function beginTable(colWidths, style){
    style = getStyle(style);
    if(colWidths){
        _beginColspanTable(colWidths, style);
    } else {
        _beginStandardTable(style);
    }
    insideTable = true;
}

function _beginColspanTable(colWidths, style){
    columnWidths = toJavaList(colWidths);
    g_ooutfile.BeginTable(100, columnWidths, style.fontColor, style.bgColor, style.format, style.indent);
    isColspanTable = true;
}

function _beginStandardTable(style){
    g_ooutfile.BeginTable(100, style.fontColor, style.bgColor, style.format, style.indent);
    isColspanTable = false;
}

function toJavaList(colWidths){
    var colWidthList = new java.util.ArrayList();
    for(var i in colWidths){
        colWidthList.add(colWidths[i]);
    }
    return colWidthList;
}

/***********************
       End table 
 **********************/
function endTable(style){
    style = getStyle(style);
    g_ooutfile.EndTable("", 100, style.font, style.fontSize, style.fontColor, style.bgColor, style.shading, style.format, style.indent);
    isColspanTable = false;
    insideTable = false;
    columnWidths = null;
}

/***********************
    Output functions 
 **********************/
function tableCell(text, style){
    style = getStyle(style);
    if(isColspanTable){
        g_ooutfile.TableCell(text, style.rowspan, style.colspan, style.font, style.fontSize, style.fontColor, style.bgColor, style.shading, style.format, style.indent);
    } else {
        g_ooutfile.TableCell(text, style.width, style.font, style.fontSize, style.fontColor, style.bgColor, style.shading, style.format, style.indent); 
    }
}

function output(text, style){
    style = getStyle(style);
    g_ooutfile.Output(text, style.font, style.fontSize, style.fontColor, style.bgColor, style.format, style.indent);
}

function outputLn(text, style){
    style = getStyle(style);
    g_ooutfile.OutputLn(text, style.font, style.fontSize, style.fontColor, style.bgColor, style.format, style.indent);
}

function outputField(field, style){
    style = getStyle(style);
    g_ooutfile.OutputField(field, style.font, style.fontSize, style.fontColor, style.bgColor, style.format);
}

/***********************
     Table of content
 **********************/
 
function writeObjectAttributeAsTitle(appObject, attribute, definedStyle, prefix){
    var attr = appObject.getValueAttribute(attribute);
	var attributeValue = null;
	if (attr) {
		attributeValue = attr.getRawValue();
	}
    if(attributeValue == null){
		attributeValue = getDisplayValueOfObject(appObject);
	}
        
    writeTitle(attributeValue, definedStyle);
}

function writeTitle(text, definedStyle){ // as definedStyle can be used any style defined by g_ooutfile.DefineF; For titles which should be a part of TOC use "Heading 1", "Heading 2", etc
    if(!definedStyle) definedStyle = "Heading 1";
    g_ooutfile.OutputLnF(text, definedStyle);
}

function writeTableOfContent(disablePageBreak){
    if(isExcelOutputFormat()) return; // TOC is not working properly within excel
    var style =  getStyleByName("TABLE_OF_CONTENTS");
    g_ooutfile.OutputLn(getString("TABLE_OF_CONTENTS"), style.font, style.fontSize, style.fontColor, style.bgColor, style.format, style.indent);
    writeEmptyLines(2);
		
    var TOCstyle = getStyleByName("BASE_TEXT");
    var lineSpacing = 1.2;
    g_ooutfile.SetTOCFormat(0, TOCstyle.font, TOCstyle.fontSize, TOCstyle.fontColor, TOCstyle.bgColor, TOCstyle.format, 0, 0, 0, 0, 0, lineSpacing);
    g_ooutfile.SetTOCFormat(1, TOCstyle.font, TOCstyle.fontSize, TOCstyle.fontColor, TOCstyle.bgColor, TOCstyle.format, 3, 0, 0, 0, 0, lineSpacing);
    g_ooutfile.SetTOCFormat(2, TOCstyle.font, TOCstyle.fontSize, TOCstyle.fontColor, TOCstyle.bgColor, TOCstyle.format, 6, 0, 0, 0, 0, lineSpacing);
    g_ooutfile.SetTOCFormat(3, TOCstyle.font, TOCstyle.fontSize, TOCstyle.fontColor, TOCstyle.bgColor, TOCstyle.format, 9, 0, 0, 0, 0, lineSpacing);
    g_ooutfile.SetTOCFormat(4, TOCstyle.font, TOCstyle.fontSize, TOCstyle.fontColor, TOCstyle.bgColor, TOCstyle.format, 12, 0, 0, 0, 0, lineSpacing);
    g_ooutfile.SetTOCFormat(5, TOCstyle.font, TOCstyle.fontSize, TOCstyle.fontColor, TOCstyle.bgColor, TOCstyle.format, 15, 0, 0, 0, 0, lineSpacing);
    g_ooutfile.SetTOCFormat(6, TOCstyle.font, TOCstyle.fontSize, TOCstyle.fontColor, TOCstyle.bgColor, TOCstyle.format, 18, 0, 0, 0, 0, lineSpacing);
            
    g_ooutfile.OutputField(Constants.FIELD_TOC, defaultFont, 10, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_CENTER);
    if(!disablePageBreak){
        writeObjectSeparator();
    }
    writeEmptyLines(1);

}

/***********************
         Other 
 **********************/
function isExcelOutputFormat(){
    var selectedFormat = Context.getSelectedFormat();
    return selectedFormat.compareTo(Constants.OutputXLS) === 0 || selectedFormat.compareTo(Constants.OutputXLSX) === 0;
}

function getColWidths(colCount) {
    var firstColumnWidth = 18;
    var iconColWidth = 4;
    var widthWithoutIconsAndFirstColumn = 100 - firstColumnWidth - colCount * iconColWidth;
    var colWidths = [];
    var attrValueColWidth = widthWithoutIconsAndFirstColumn / colCount;
    if (Context.getSelectedFormat().compareTo(Constants.OUTPDF) === 0)
        colWidths.push(firstColumnWidth + 2); //pdf makes the table narrower, therefore adding to width of first column
    else
        colWidths.push(firstColumnWidth);
    for (var i = 0; i < colCount; i++) {
        colWidths.push(iconColWidth);
        colWidths.push(attrValueColWidth);
    }
    return colWidths;
}

function getColWidthsForList(attributeTypeCount) {
    var colWidths = [];
    var iconColWidth = 3;
    var widthWithoutIconCols = 100 - attributeTypeCount * iconColWidth;
    for (var i = 0; i < attributeTypeCount; i++) {
        colWidths.push(iconColWidth);
        colWidths.push(widthWithoutIconCols / attributeTypeCount);
    }
    return colWidths;
}
/*
 * writes separator of different objects - to have all objects separated the same way
 */
function writeObjectSeparator(){
    if(isExcelOutputFormat()){
        writeEmptyLines(3);
    } else {
        pageBreak();
    }
}
/**
*function for writing default empty line
**/
function writeEmptyLines(count, style){
for (var i = 0; i < count; i++) {
    if(isExcelOutputFormat()){
        writeNoBorderTableRow(style);
    }else{
       outputLn("", style);
    }}
}

/**
* function for writing empty table row
**/
function writeNoBorderTableRow(style, text){
    if(!text) text = "";
    g_ooutfile.SetFrameStyle(Constants.FRAME_LEFT, 0);
    g_ooutfile.SetFrameStyle(Constants.FRAME_RIGHT, 0);
    g_ooutfile.SetFrameStyle(Constants.FRAME_TOP, 0);
    g_ooutfile.SetFrameStyle(Constants.FRAME_BOTTOM, 0);
    g_ooutfile.TableRow();
    style = getStyle(style);
    tableCell(text, style);
    g_ooutfile.ResetFrameStyle();
} 
/**
 * forces new page start; does not work for excel
 **/
function pageBreak(){
    if(!isExcelOutputFormat()){
        g_ooutfile.OutputField(Constants.FIELD_NEWPAGE, defaultFont, 10, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_CENTER);
    }
}

function getDefaultCellStyle(){
    return {
        'font': defaultFont,
        'fontSize': 9,
        'fontColor': Constants.C_BLACK,
        'bgColor': Constants.C_TRANSPARENT,
        'shading': 0,
        'format': Constants.FMT_LEFT | Constants.FMT_VCENTER,
        'indent': 0
    }
}
/**
 * helper method for overriding object properties
 * @param {} mainObj - object which should be modified
 * @param {} params - object with properties which should be overriden
 **/
function extendObj(mainObj, params){
    var target = cloneObject(mainObj);
    for(var key in params){
        if(params[key] != null){
            if(key == 'formatExtend'){
                target['format'] |= params[key];
            } else {
                target[key] = params[key];
            }
        }
    }
    return target;
}

/**
 * helper method for object clone
 * @param {} obj - object which should be cloned
 **/
function cloneObject(obj) {
    var clone = {};
    for(var i in obj) {
        if(typeof(obj[i])=="object" && obj[i] != null && !(obj[i] instanceof java.lang.Object))
            clone[i] = cloneObject(obj[i]);
        else
            clone[i] = obj[i];
    }
    return clone;
}

/**
 * returns style object from commonStyles
 * @param name - name of the style
 * @return style object
 **/
function getStyleByName(styleName) {
    return extendObj(getDefaultCellStyle(), commonStyles[styleName]);
}


/**
* starts landscape section, section must be closed with arcmEndSection function
**/
function arcmStartLandscapeSection(){
    if(!isExcelOutputFormat() && isPortrait()){
           beginSection();   
    } 
}

/**
* starts portrait section, section must be closed with arcmEndSection function
**/
function arcmStartPortraitSection(title){
    if(!isExcelOutputFormat() && !isPortrait()){
           beginSection();
   }
}

/**
* beging section with reverted height and width
**/
function beginSection(){
    g_ooutfile.BeginSection(g_ooutfile.GetPageWidth(), g_ooutfile.GetPageHeight(), 
                                    g_ooutfile.GetDistHeader(), g_ooutfile.GetDistFooter(), 
                                    g_ooutfile.GetLeftMargin(), g_ooutfile.GetRightMargin(), 
                                    g_ooutfile.GetTopMargin(), g_ooutfile.GetBottomMargin(), 
                                    false, Constants.SECTION_DEFAULT);
                                    writeReportHeader();
                                    writeReportFooter();
}
/**
* close section
**/
function arcmEndSection(){
    g_ooutfile.EndSection();
}

function isPortrait(){
    return g_ooutfile.GetPageHeight()>g_ooutfile.GetPageWidth();
}

function hexToRgb(hex) {
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}
