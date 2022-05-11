/***************************************************
 * Copyright (c) Software AG. All Rights Reserved. *
 ***************************************************/

function getSelectionList() {
    var resultList = new java.util.ArrayList();
    var selectionAsXML = Context.getProperty("selectionAsXML");
	if(selectionAsXML != null) {
		selectionAsXML = unmaskXMLChars(selectionAsXML);
		selectionAsXML = selectionAsXML.replace("<users>","");
		selectionAsXML = selectionAsXML.replace("</users>","");
		selectionAsXML = selectionAsXML.replace("</user>","");
		var users = java.util.Arrays.asList(selectionAsXML.split("<user>"));
		for(var i = 0 ; i < users.size() ; i++) {
			if(!users.get(i).isEmpty()) {
				resultList.add(users.get(i));
			}   
		}
	} else {
		var selection = Context.getProperty("selection");
		if(selection != null) {
			resultList.addAll(java.util.Arrays.asList(selection.split(",")));
		} 
	}
	
    return resultList;
}

function unmaskXMLChars(p_sText) {
    p_sText = p_sText.replaceAll("&amp;", "&");
    p_sText = p_sText.replaceAll("&lt;", "<");
    p_sText = p_sText.replaceAll("&gt;", ">");
    p_sText = p_sText.replaceAll("&quot;", "\"");
    p_sText = p_sText.replaceAll("&apos;", "\'");
    return p_sText;
}

function getMax() {
    var returnValue = 0;
    for(var i = 0 ; i < arguments.length ; i++) {
        if(arguments[i] > returnValue) {
			returnValue = arguments[i];
		}
	}
	return returnValue;
}

function writeHeader(text, colspan) {
    g_Output.TableCell(text, 1, colspan, getString("ID_DEFAULT_FONT"), 16, setColor(0, 133, 173), Constants.C_WHITE, 0, Constants.FMT_VTOP | Constants.FMT_LEFT | Constants.FMT_BOLD, 0);
} 

function writeDescription(text, colspan) {
    g_Output.TableCell(text, 1, colspan, getString("ID_DEFAULT_FONT"), 10, Constants.C_BLACK, Constants.C_WHITE, 0, Constants.FMT_VTOP | Constants.FMT_LEFT, 0);
} 

function writeTableHeaderCell(text, width) {
    if(!width) width = 40;
    g_Output.TableCell(text, width, getString("ID_DEFAULT_FONT"), 10, Constants.C_WHITE, setColor(0, 133, 173), 0, Constants.FMT_VTOP | Constants.FMT_LEFT, 0);
} 

function writeTableCell(text, width, isEvenRow) {
    if(!width) width = 40;
    bgcolor = Constants.C_WHITE;
    if(isEvenRow) bgcolor = setColor(242,242,242);
    g_Output.TableCell(text, width, getString("ID_DEFAULT_FONT"), 10, Constants.C_BLACK, bgcolor, 0, Constants.FMT_VTOP | Constants.FMT_LEFT, 0);
} 

function writeTableEmailCell(email, width, isEvenRow) {
    bgcolor = Constants.C_WHITE;
    if(isEvenRow) bgcolor = setColor(242,242,242);
    writeTableCell("", width, isEvenRow);
    if(email && email.length() > 0) {
        if(!email.contains(" ") && !email.contains("<") && !email.contains(">") && !email.contains("\n") && !email.contains("\t")) {
            g_Output.OutputLink(email, ("mailto:"+ email + ""), getString("ID_DEFAULT_FONT"), 11, Constants.C_BLUE, Constants.C_TRANSPARENT,  Constants.FMT_UNDERLINE | Constants.FMT_LEFT);
        } else {
            g_Output.Output(email, getString("ID_DEFAULT_FONT"), 11, Constants.C_BLUE, Constants.C_TRANSPARENT,  Constants.FMT_UNDERLINE | Constants.FMT_LEFT, 0);
        }    
    }  
}

function writeTableFooterCell(text, colspan) {
    g_Output.TableCell(text, 1, colspan, getString("ID_DEFAULT_FONT"), 12, Constants.C_WHITE, setColor(166, 166, 166), 0, Constants.FMT_VTOP |  Constants.FMT_LEFT | Constants.FMT_BOLD, 0);
} 

/******** Excel row and sheet handling ********/

var g_TotalRowCount = 0;
var g_CurrentSheetRowCount = 0;

function startTableSheet() {
    g_Output.BeginTable(100, Constants.C_BLACK, Constants.C_TRANSPARENT,  Constants.FMT_LEFT | Constants.FMT_REPEAT_HEADER, 0); 
    g_CurrentSheetRowCount = 0;
}

function endTableSheet(sheetName) {
    if(sheetName.length > 31) {
        sheetName = sheetName.substring(0,31);   
    }
    g_Output.EndTable(sheetName, 100, "Arial", 10, Constants.C_BLACK, Constants.C_WHITE, Constants.C_TRANSPARENT, Constants.FMT_LEFT | Constants.FMT_REPEAT_HEADER, 0);
}

function addTableRow() {
    if(g_CurrentSheetRowCount >= 65536) {
        // excel does not support more rows
        return false;
    }
    g_Output.TableRow();
    g_TotalRowCount++;
    g_CurrentSheetRowCount++;
    return true;
}

function getIndexedSheetName(from, to) {
    var sheetName = "";
    if (from.length > 14) {
        sheetName = sheetName + from.substring(0,11) + "...";   
    } else {
        sheetName = sheetName + from;   
    }
    sheetName = sheetName + " - " 
    if (to.length > 14) {
        sheetName = sheetName + to.substring(0,11) + "...";   
    } else {
        sheetName = sheetName + to;   
    }
    return sheetName;
}

/************* output helper ***************/

function initializeOutput() {
    g_Output.DefineF("ID_STYLE_RD_HEADER_FOOTER", getString("ID_DEFAULT_FONT"), 9, Constants.C_BLACK, Constants.C_TRANSPARENT,  Constants.FMT_LEFT| Constants.FMT_VTOP, 0, 0, 0, 0, 0, 1)
    g_Output.DefineF("ID_STYLE_RD_HEADING_4", getString("ID_DEFAULT_FONT"), 12, Constants.C_BLACK, Constants.C_TRANSPARENT,  Constants.FMT_ITALIC | Constants.FMT_BOLD | Constants.FMT_LEFT| Constants.FMT_VTOP| Constants.FMT_TOCENTRY3 , 0, 0, 0, 0, 0, 1)
    g_Output.DefineF("ID_STYLE_RD_HEADING_2", getString("ID_DEFAULT_FONT"), 14, Constants.C_BLACK, Constants.C_TRANSPARENT,  Constants.FMT_ITALIC | Constants.FMT_BOLD | Constants.FMT_LEFT| Constants.FMT_VTOP| Constants.FMT_TOCENTRY1 , 0, 0, 2, 2, 0, 1)
    g_Output.DefineF("ID_STYLE_RD_TABLE_CONTENT", getString("ID_DEFAULT_FONT"), 8, Constants.C_BLACK, Constants.C_TRANSPARENT,  Constants.FMT_LEFT| Constants.FMT_VTOP, 0, 0, 0, 0, 0, 1)
    g_Output.DefineF("ID_STYLE_RD_DEFAULT", getString("ID_DEFAULT_FONT"), 11, Constants.C_BLACK, Constants.C_TRANSPARENT,  Constants.FMT_LEFT| Constants.FMT_VTOP, 0, 0, 0, 0, 0, 1)
    g_Output.DefineF("ID_STYLE_RD_INFO", getString("ID_DEFAULT_FONT"), 14, Constants.C_BLACK, Constants.C_TRANSPARENT,  Constants.FMT_BOLD | Constants.FMT_CENTER| Constants.FMT_VTOP, 0, 0, 1.76, 8.82, 0, 1)
    g_Output.DefineF("ID_STYLE_RD_HEADING_3", getString("ID_DEFAULT_FONT"), 12, Constants.C_BLACK, Constants.C_TRANSPARENT,  Constants.FMT_ITALIC | Constants.FMT_BOLD | Constants.FMT_LEFT| Constants.FMT_VTOP| Constants.FMT_TOCENTRY2 , 0, 0, 1, 1, 0, 1)
    g_Output.DefineF("ID_STYLE_RD_HEADING_1", getString("ID_DEFAULT_FONT"), 18, Constants.C_BLACK, Constants.C_TRANSPARENT,  Constants.FMT_BOLD | Constants.FMT_LEFT| Constants.FMT_VTOP| Constants.FMT_TOCENTRY0 , 0, 0, 4, 4, 0, 1)
    g_Output.DefineF("ID_STYLE_RD_TITLE", getString("ID_DEFAULT_FONT"), 21, Constants.C_BLACK, Constants.C_TRANSPARENT,  Constants.FMT_BOLD | Constants.FMT_CENTER| Constants.FMT_VTOP, 0, 0, 1.76, 8.82, 0, 1)
    g_Output.DefineF("ID_STYLE_RD_TABLE_HEAD", getString("ID_DEFAULT_FONT"), 8, Constants.C_BLACK, Constants.C_TRANSPARENT,  Constants.FMT_BOLD | Constants.FMT_CENTER| Constants.FMT_VTOP, 0, 0, 0, 0, 0, 1)
    g_Output.SetPageWidth(210)
	g_Output.SetPageHeight(297)
	g_Output.SetLeftMargin(20)
	g_Output.SetRightMargin(20)
	g_Output.SetTopMargin(30)
	g_Output.SetBottomMargin(30)
	g_Output.SetDistHeader(10)
	g_Output.SetDistFooter(10)
	g_Output.SetAutoTOCNumbering(true)
    g_Output.SetTitle(Context.getScriptInfo(Constants.SCRIPT_NAME));
}

function printLn(myText, fontsize) {
    if(!myText) myText = "";
    if(!fontsize) fontsize = 12;
    g_Output.OutputLn(myText, getString("ID_DEFAULT_FONT"), fontsize, Constants.C_BLACK, Constants.C_TRANSPARENT,  Constants.FMT_LEFT, 0)
}

function printLink(linkName, bookmark) {
    g_Output.OutputLink(linkName, bookmark , getString("ID_DEFAULT_FONT"), 11, Constants.C_BLUE, Constants.C_TRANSPARENT,  Constants.FMT_UNDERLINE | Constants.FMT_LEFT)
    printLn("_", 11);
}