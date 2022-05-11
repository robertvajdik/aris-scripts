/**
 * Copyright (C) 2019 Software AG, Darmstadt, Germany and/or Software AG USA Inc., Reston, VA, USA,
 * and/or its subsidiaries and/or its affiliates and/or their licensors.
 *
 * Use, reproduction, transfer, publication or disclosure is prohibited
 * except as specifically provided for in your License Agreement with Software AG.
 *
 * Version: 10.0.8.0.1298116
 */
function getSelectionList() {
    var resultList = new java.util.ArrayList();
    var selectionAsXML = Context.getProperty("selectionAsXML");
    if (selectionAsXML != null) {
        selectionAsXML = unmaskXMLChars(selectionAsXML);
        selectionAsXML = selectionAsXML.replace("<users>", "");
        selectionAsXML = selectionAsXML.replace("</users>", "");
        selectionAsXML = selectionAsXML.replace("</user>", "");
        var users = java.util.Arrays.asList(selectionAsXML.split("<user>"));
        for (var i = 0; i < users.size(); i++) {
            if (!users.get(i).isEmpty()) {
                resultList.add(users.get(i));
            }
        }
    } else {
        var selection = Context.getProperty("selection");
        if (selection != null) {
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
    for (var i = 0; i < arguments.length; i++) {
        if (arguments[i] > returnValue) {
            returnValue = arguments[i];
        }
    }
    return returnValue;
}

function writeHeader(text, colspan) {
    g_Output.TableCell(text, 1, colspan, getString("ID_DEFAULT_FONT"), 16, setColor(242, 79, 0), Constants.C_WHITE, 0, Constants.FMT_VTOP | Constants.FMT_LEFT | Constants.FMT_BOLD, 0);
}

function writeSubTitle(text, colspan) {
    g_Output.TableCell(text, 1, colspan, getString("ID_DEFAULT_FONT"), 10, setColor(242, 79, 0), Constants.C_WHITE, 0, Constants.FMT_VTOP | Constants.FMT_LEFT | Constants.FMT_BOLD, 0);
}

function writeSubTitleLevelTwo(text, colspan) {
    g_Output.TableCell(text, 1, colspan, getString("ID_DEFAULT_FONT"), 12, setColor(242, 79, 0), Constants.C_WHITE, 0, Constants.FMT_VTOP | Constants.FMT_LEFT | Constants.FMT_BOLD, 0);
}

function writeSubTitleLevelThree(text, colspan) {
    g_Output.TableCell(text, 1, colspan, getString("ID_DEFAULT_FONT"), 11, setColor(0, 133, 173), Constants.C_WHITE, 0, Constants.FMT_VTOP | Constants.FMT_LEFT | Constants.FMT_BOLD, 0);
}

function writeDescription(text, colspan) {
    g_Output.TableCell(text, 1, colspan, getString("ID_DEFAULT_FONT"), 10, Constants.C_BLACK, Constants.C_WHITE, 0, Constants.FMT_VTOP | Constants.FMT_LEFT, 0);
}

function writeTableHeaderCell(text, width) {
    if (!width) width = 40;
    g_Output.TableCell(text, width, getString("ID_DEFAULT_FONT"), 10, Constants.C_WHITE, setColor(242, 79, 0), 0, Constants.FMT_VTOP | Constants.FMT_LEFT, 0);
}
function writeTableCell_colspan(text, colspan) {
      g_Output.TableCell(text, 1, colspan, getString("ID_DEFAULT_FONT"), 10, Constants.C_BLACK, Constants.C_WHITE, 0, Constants.FMT_VTOP | Constants.FMT_LEFT, 0);
}

function writeTableCell(text, width, isEvenRow) {
    if (!width) width = 40;
    bgcolor = Constants.C_WHITE;
    if (isEvenRow) bgcolor = setColor(242, 242, 242);
    g_Output.TableCell(text, width, getString("ID_DEFAULT_FONT"), 10, Constants.C_BLACK, bgcolor, 0, Constants.FMT_VTOP | Constants.FMT_LEFT, 0);
}

function writeTableCellBold(text, width, isEvenRow) {
    if (!width) width = 40;
    bgcolor = Constants.C_WHITE;
    if (isEvenRow) bgcolor = setColor(242, 242, 242);
    g_Output.TableCell(text, width, getString("ID_DEFAULT_FONT"), 10, Constants.C_BLACK, bgcolor, 0, Constants.FMT_VTOP | Constants.FMT_LEFT | Constants.FMT_BOLD, 0);
}


function writeTableEmailCell(email, width, isEvenRow) {
    bgcolor = Constants.C_WHITE;
    if (isEvenRow) bgcolor = setColor(242, 242, 242);
    writeTableCell("", width, isEvenRow);
    if (email && email.length() > 0) {
        if (!email.contains(" ") && !email.contains("<") && !email.contains(">") && !email.contains("\n") && !email.contains("\t")) {
            g_Output.OutputLink(email, ("mailto:" + email + ""), getString("ID_DEFAULT_FONT"), 11, Constants.C_BLUE, Constants.C_TRANSPARENT, Constants.FMT_UNDERLINE | Constants.FMT_LEFT);
        } else {
            g_Output.Output(email, getString("ID_DEFAULT_FONT"), 11, setColor(242, 79, 0), Constants.C_TRANSPARENT, Constants.FMT_UNDERLINE | Constants.FMT_LEFT, 0);
        }
    }
}

/*
 * insert picture
 */
function writeTableCellPicture( model,zoom, widthForPicture) {
   
/*
   var dimSizeImage = getImageSize(aGraphic, getZoomFactor(model));

function getZoomFactor(p_model) {   // BLUE-14499
    var nZoom = 100;
    if (nZoom == -1)   nZoom = 100;
    if (nZoom == null) nZoom = p_model.getPrintScale();
    if (nZoom > 100) nZoom = 100;
    return nZoom/100;
}

   
    //java.awt.Dimension in mm
function getImageSize(graphic, p_zoomFactor)
{
    var FORCE_VECTOR_IMAGES = true //this would force this report to use vector image even if the image is larger than 55,87cm (will be scaled down to 55,87cm max h/w)
    var USE_VECTOR_FOR_1_IMAGE = true //true would use vector image for 1-model-selections of size<=558.7 x 558.7mm

    // output settings
    var PAGE_WIDTH    = 210
    var PAGE_HEIGHT   = 297
    var MARGIN_LEFT   = 10
    var MARGIN_RIGHT  = 10    
    var MARGIN_TOP    = 15
    var MARGIN_BOTTOM = 10
    var DIST_TOP      = 5
    var DIST_BOTTOM   = 5
    var CUT_OBJECTS   = false
    var FULL_SIZE     = true
    var ZOOM          = -1
    var USE_BGCOLOR   = false       // BLUE-13448 Use background color

    var nGWidth     = p_zoomFactor * graphic.getWidth(Constants.SIZE_LOMETRIC);
    var nGHeight    = p_zoomFactor * graphic.getHeight(Constants.SIZE_LOMETRIC);
    
    // define a minimum size (for very small models) of 5cm x 5cm
    nGWidth  = Math.max(500, nGWidth)
    nGHeight = Math.max(500, nGHeight)

    if(FORCE_VECTOR_IMAGES)
    {
        var maxwidth  = Math.min(5587-(MARGIN_LEFT*10+MARGIN_RIGHT*10), nGWidth)
        var maxheight = Math.min(5587-(MARGIN_TOP*10+MARGIN_BOTTOM*10+50), nGHeight)
        
        if(maxwidth<nGWidth || maxheight<nGHeight)
        {
            var xfactor = maxwidth / nGWidth
            var yfactor = maxheight / nGHeight
            var factor  = Math.min(xfactor, yfactor)
            
            nGWidth  = nGWidth  * factor
            nGHeight = nGHeight * factor
        }
    }
    else
    {
        // AGA-13846 Otherwise to high memory usage up to 6GB
        // define a maximum size (for very small models) of 3m x 3m 
        nGWidth  = Math.min(30000, nGWidth)
        nGHeight = Math.min(30000, nGHeight)
    }
    
    var result = new java.awt.Dimension()
    result.setSize(nGWidth, nGHeight)
    return result;
}

  
 */
    var pic = model.Graphic(false, false, g_Locale);
    //  var sfileName = model.GUID() + ".png";
    var width = pic.getWidth((Constants.SIZE_PIXEL) * 20 * (100.0 / 125.0) );   //twips, correction factor because of excel anomaly (X): * (100.0/125.0)
    var xCells = width / 1024;
    var xTwips = width % 1024;
    var height = pic.getHeight((Constants.SIZE_PIXEL) * 20 * (100.0 / 133.0) ); //twips, correction factor because of excel anomaly (Y): \*(100.0/133.0)
    var yCells = height / 256;
    var yTwips = height % 256;
    if (height > 1200 || width > 3000)
       zoom = 30;   //RV fix
    
  
 
 
  /*  var nGWidth     = 100 * pic.getWidth(Constants.SIZE_LOMETRIC);
    var nGHeight    = 100 * pic.getHeight(Constants.SIZE_LOMETRIC);
    
    // define a minimum size (for very small models) of 5cm x 5cm
    nGWidth  = Math.max(500, nGWidth)
    nGHeight = Math.max(500, nGHeight)*/

     
    //g_Output.TableCell("aaa", 216,"Arial", 10, Constants.C_BLACK, Constants.C_TRANSPARENT, 0, Constants.FMT_LEFT, 0)
    g_Output.BeginParagraph(Constants.FMT_LEFT, 0, 0, 0, 0, 0)
    g_Output.TableCell("", widthForPicture,"Arial", 10, Constants.C_BLACK, Constants.C_TRANSPARENT, 0, Constants.FMT_LEFT, 0)
    //g_Output.TableCell("", 1, colspan, getString("ID_DEFAULT_FONT"), 11, setColor(0, 133, 173), Constants.C_WHITE, 0, Constants.FMT_VTOP | Constants.FMT_LEFT | Constants.FMT_BOLD, 0);
    //var aGraphic = model.Graphic(false, false, g_Locale, false);
    g_Output.OutGraphic(pic, zoom, xTwips, yTwips)
    g_Output.EndParagraph();

}


function writeTableFooterCell(text, colspan) {
    g_Output.TableCell(text, 1, colspan, getString("ID_DEFAULT_FONT"), 12, Constants.C_WHITE, setColor(166, 166, 166), 0, Constants.FMT_VTOP | Constants.FMT_LEFT | Constants.FMT_BOLD, 0);
}

/******** Excel row and sheet handling ********/

var g_TotalRowCount = 0;
var g_CurrentSheetRowCount = 0;



function startTableSheetRepat2Rows() {
    g_Output.BeginTable(100, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_LEFT /*| Constants.FMT_REPEAT_HEADER*/, 0,2);
    g_CurrentSheetRowCount = 0;
}

function startTableSheetRepat3Rows() {
    g_Output.BeginTable(100, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_LEFT /*| Constants.FMT_REPEAT_HEADER*/, 0,3);
    g_CurrentSheetRowCount = 0;
}
/*Non repat*/
function startTableSheet() {
    g_Output.BeginTable(100, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_LEFT /*| Constants.FMT_REPEAT_HEADER*/, 0);
    g_CurrentSheetRowCount = 0;
}


function startTableSheetFreezeHeader() {
    g_Output.BeginTable(100, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_LEFT | Constants.FMT_REPEAT_HEADER, 0);
    g_CurrentSheetRowCount = 0;
}

function endTableSheet(sheetName) {
    if (sheetName.length > 31) {
        sheetName = sheetName.substring(0, 31);
    }
    g_Output.EndTable(sheetName, 100, "Arial", 10, Constants.C_BLACK, Constants.C_WHITE, Constants.C_TRANSPARENT, Constants.FMT_LEFT | Constants.FMT_REPEAT_HEADER, 0);
}

function addTableRow() {
    if (g_CurrentSheetRowCount >= 65536) {
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
        sheetName = sheetName + from.substring(0, 11) + "...";
    } else {
        sheetName = sheetName + from;
    }
    sheetName = sheetName + " - "
    if (to.length > 14) {
        sheetName = sheetName + to.substring(0, 11) + "...";
    } else {
        sheetName = sheetName + to;
    }
    return sheetName;
}

/************* output helper ***************/

function initializeOutput() {
    g_Output.DefineF("ID_STYLE_RD_HEADER_FOOTER", getString("ID_DEFAULT_FONT"), 9, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_LEFT | Constants.FMT_VTOP, 0, 0, 0, 0, 0, 1)
    g_Output.DefineF("ID_STYLE_RD_HEADING_4", getString("ID_DEFAULT_FONT"), 12, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_ITALIC | Constants.FMT_BOLD | Constants.FMT_LEFT | Constants.FMT_VTOP | Constants.FMT_TOCENTRY3, 0, 0, 0, 0, 0, 1)
    g_Output.DefineF("ID_STYLE_RD_HEADING_2", getString("ID_DEFAULT_FONT"), 14, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_ITALIC | Constants.FMT_BOLD | Constants.FMT_LEFT | Constants.FMT_VTOP | Constants.FMT_TOCENTRY1, 0, 0, 2, 2, 0, 1)
    g_Output.DefineF("ID_STYLE_RD_TABLE_CONTENT", getString("ID_DEFAULT_FONT"), 8, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_LEFT | Constants.FMT_VTOP, 0, 0, 0, 0, 0, 1)
    g_Output.DefineF("ID_STYLE_RD_DEFAULT", getString("ID_DEFAULT_FONT"), 11, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_LEFT | Constants.FMT_VTOP, 0, 0, 0, 0, 0, 1)
    g_Output.DefineF("ID_STYLE_RD_INFO", getString("ID_DEFAULT_FONT"), 14, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_BOLD | Constants.FMT_CENTER | Constants.FMT_VTOP, 0, 0, 1.76, 8.82, 0, 1)
    g_Output.DefineF("ID_STYLE_RD_HEADING_3", getString("ID_DEFAULT_FONT"), 12, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_ITALIC | Constants.FMT_BOLD | Constants.FMT_LEFT | Constants.FMT_VTOP | Constants.FMT_TOCENTRY2, 0, 0, 1, 1, 0, 1)
    g_Output.DefineF("ID_STYLE_RD_HEADING_1", getString("ID_DEFAULT_FONT"), 18, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_BOLD | Constants.FMT_LEFT | Constants.FMT_VTOP | Constants.FMT_TOCENTRY0, 0, 0, 4, 4, 0, 1)
    g_Output.DefineF("ID_STYLE_RD_TITLE", getString("ID_DEFAULT_FONT"), 21, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_BOLD | Constants.FMT_CENTER | Constants.FMT_VTOP, 0, 0, 1.76, 8.82, 0, 1)
    g_Output.DefineF("ID_STYLE_RD_TABLE_HEAD", getString("ID_DEFAULT_FONT"), 8, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_BOLD | Constants.FMT_CENTER | Constants.FMT_VTOP, 0, 0, 0, 0, 0, 1)
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
    if (!myText) myText = "";
    if (!fontsize) fontsize = 12;
    g_Output.OutputLn(myText, getString("ID_DEFAULT_FONT"), fontsize, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_LEFT, 0)
}

function printLink(linkName, bookmark) {
    g_Output.OutputLink(linkName, bookmark, getString("ID_DEFAULT_FONT"), 11, Constants.C_BLUE, Constants.C_TRANSPARENT, Constants.FMT_UNDERLINE | Constants.FMT_LEFT)
    printLn("_", 11);
}

function currentTime() {
    var calendar = java.util.Calendar.getInstance();
    return formatTime(calendar.getTime());
}

function formatTime(date) {
    var format = "dd-MM-yyyy hh:mm a";
    var dataFormat = new java.text.SimpleDateFormat(format);
    var sDate = dataFormat.format(date);
    return sDate;
}