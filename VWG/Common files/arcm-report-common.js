/**
 * Copyright (C) 2020 Software AG, Darmstadt, Germany and/or Software AG USA Inc., Reston, VA, USA,
 * and/or its subsidiaries and/or its affiliates and/or their licensors.
 *
 * Use, reproduction, transfer, publication or disclosure is prohibited
 * except as specifically provided for in your License Agreement with Software AG.
 *
 * Version: 10.0.12.0.1470486
 */

const COL_SAG_BLUE_1 = getColorByRGB( 31,  57,  86);  // #1f3956
const COL_SAG_BLUE_2 = getColorByRGB(  0, 112, 150);  // #007096
const COL_SAG_BLUE_3 = getColorByRGB(  5, 137, 161);  // #0589a1
const COL_SAG_GREY_1 = getColorByRGB(242, 242, 242);  // #f2f2f2
const COL_SAG_GREY_2 = getColorByRGB(166, 166, 166);  // #a6a6a6

function getColorByRGB(R, G, B) {
    return (new java.awt.Color(R/255.0 ,G/255.0, B/255.0, 1)).getRGB() & 0xFFFFFF;
} 

var arisReportFileName = Context.getProperty(com.aris.arcm.apiclient.ArisReportingServiceConstants.ATTR_OUTPUT_FILENAME);
if(arisReportFileName != null){
    Context.setSelectedFile(arisReportFileName);
}
    
var g_ooutfile = Context.createOutputObject();
var tableMode = "";
var TABLE_MODE_SPAN = "TABLE_MODE_SPAN";
var tableColumnsWidths = new java.util.ArrayList();
var iconDataSource;
var COLOR_GREY = COL_SAG_GREY_1;
var tableStarted = false;
var sectionStarted = false;

var client = Context.getProperty(com.aris.arcm.apiclient.ArisReportingServiceConstants.CLIENT_SIGN);
var role = Context.getProperty(com.aris.arcm.apiclient.ArisReportingServiceConstants.ROLE);
var user_id = Context.getProperty(com.aris.arcm.apiclient.ArisReportingServiceConstants.USER_ID);
ARCM.setUser(user_id, role, client);

/**
 * Starting point; should be called by each report;
 **/
function main() {
    var definition = getReportDefinition();
    var datasource = _getMainDatasource(definition);
    iconDataSource = datasource;
    var data = readData(definition);
    var reportTitle = getReportHeaderTitle(datasource);
    calcColumnWidths(data);
    arcmStartNewTableIfXls(); // xls uses only one general table, which holds also header
    _writeHeader(reportTitle);
    _writeFooter();
    arcmStartNewTableIfNotXls(); // start table if it was not started with header
    writeReportContent(data, reportTitle);
    writeChartsForXls();
    arcmEndTable();
    arcmEndSection();
    _writeReport();
}

function _getMainDatasource(definition){
    if(definition instanceof Array){
        for(var i=0; i<definition.length; i++){
            if(typeof(definition[i].datasource) != 'undefined'){
                return definition[i].datasource;
            }
        }
    } else {
        return definition.datasource;
    }
    return null;
}

/** *******************************************************************************************
 * !!! - copied from commonUtils.js - as it is the only used function from entire file !!!
 **********************************************************************************************
 *sets the java RGB color or nuance of gray (0-100) parameters{int R, int G, int B) or (str "GRAY", int %) <br />
 *<i>commonUtils.color.setColor({int R, int G, int B) or (str "GRAY", int %)})</i><br />     
 *@return java.awt.color
 *@type java.awt.color     
 *@param arguments (int R, int G, int B) or (str "GRAY", int %)
 */
function setColor(/*parameters set: (int R, int G, int B) or (str "GRAY", int %) */){
var red,green,blue,myColor;

  if(arguments.length == 3){
    red   = (Math.round((100/255)*arguments[0]))/100;
    green = (Math.round((100/255)*arguments[1]))/100;
    blue  = (Math.round((100/255)*arguments[2]))/100;
  } 
  if(arguments.length == 2){
   red   = (100-arguments[1])/100; 
   green = (100-arguments[1])/100; 
   blue  = (100-arguments[1])/100;
  }
myColor = new java.awt.Color(red, green, blue).getRGB();  
return myColor;  
}

/**
 * defines common text styles objects
 **/
var commonStyles = {
    'BASE_TEXT': {
    },
    'BASE_TEXT_GREYBG': {
            bgColor: COLOR_GREY
    },
    'BASE_TEXT_GREYBG_CENTER': {
            bgColor: COLOR_GREY,
            format: Constants.FMT_CENTER | Constants.FMT_VCENTER
    },
    'BASE_TEXT_GREYBG_TOP': {
            bgColor: COLOR_GREY,
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
    }
}

function getReportHeaderTitle(datasource) {
    return datasource.getReportTitle();
}

/**
 * writes the report title to the top of report
 **/
function _writeHeader(title){
    if(isExcelOutputFormat()){
        writeTableTitle(title, "HEADER");
        writeEmptyLine();
    } else {
//        g_ooutfile.BeginHeader();
 //       g_ooutfile.OutputF(datasource.getReportTitle(), "HEADER");
  //      g_ooutfile.EndHeader();
      writeReportHeaderFooter(title);
    }
}

/**
 * writes the page number to the bottom of the report
 **/
function _writeFooter(){
    if(!isExcelOutputFormat()){
        g_ooutfile.BeginFooter();
            g_ooutfile.SetFrameStyle(Constants.FRAME_LEFT, 0);
            g_ooutfile.SetFrameStyle(Constants.FRAME_RIGHT, 0);
            g_ooutfile.BeginTable(100, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_LEFT, 0);
                g_ooutfile.TableRow();
                var localStyle = getStyleByName("BASE_TEXT_CENTER");
                g_ooutfile.TableCell("", 100, localStyle.font, localStyle.fontSize, localStyle.fontColor, localStyle.bgColor, localStyle.shading, localStyle.format, localStyle.indent);
                localStyle = getStyleByName("FOOTER");
				g_ooutfile.Output(getString("PAGE") + " ", localStyle.font, localStyle.fontSize, localStyle.fontColor, localStyle.bgColor, localStyle.format, localStyle.indent);
                g_ooutfile.OutputField(Constants.FIELD_PAGE, getString("ID_DEFAULT_FONT"), 14, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_CENTER);
                g_ooutfile.Output(" " + getString("OF") + " ", localStyle.font, localStyle.fontSize, localStyle.fontColor, localStyle.bgColor, localStyle.format, localStyle.indent);
                g_ooutfile.OutputField(Constants.FIELD_NUMPAGES, getString("ID_DEFAULT_FONT"), 14, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_CENTER);
            g_ooutfile.EndTable("", 100, getString("ID_DEFAULT_FONT"), 10, 0, - 1, 0, 136, 0);
            g_ooutfile.ResetFrameStyle();
        g_ooutfile.EndFooter();
    }
}
/**
 *  function writeReportHeaderFooter
 *  set report header and footer settings
 */
function writeReportHeaderFooter(reportTitle)
{
  var ocurrentuser = null;   // Current user.

  // graphics used in header
  var pictleft  = null; 
  var pictright = null; 
  pictleft  = Context.createPicture(Constants.IMAGE_LOGO_LEFT);
  pictright = Context.createPicture(Constants.IMAGE_LOGO_RIGHT);

  // header + footer settings
  g_ooutfile.BeginHeader();
  g_ooutfile.BeginTable(100, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_LEFT, 0);
  g_ooutfile.TableRow();
  g_ooutfile.TableCell("", 26, getString("ID_DEFAULT_FONT"), 12, Constants.C_BLACK, Constants.C_TRANSPARENT, 0, Constants.FMT_CENTER | Constants.FMT_VCENTER, 0);
  g_ooutfile.OutGraphic(pictleft, - 1, 40, 15);
  g_ooutfile.TableCell(reportTitle, 48, getString("ID_DEFAULT_FONT"), 12, Constants.C_BLACK, Constants.C_TRANSPARENT, 0, Constants.FMT_CENTER | Constants.FMT_VCENTER, 0);
  g_ooutfile.TableCell("", 26, getString("ID_DEFAULT_FONT"), 12, Constants.C_BLACK, Constants.C_TRANSPARENT, 0, Constants.FMT_CENTER | Constants.FMT_VCENTER, 0);
  g_ooutfile.OutGraphic(pictright, - 1, 40, 15);
  g_ooutfile.EndTable("", 100, getString("ID_DEFAULT_FONT"), 10, Constants.C_BLACK, Constants.C_TRANSPARENT, 0, Constants.FMT_LEFT | Constants.FMT_VTOP, 0);
  g_ooutfile.EndHeader();

  g_ooutfile.BeginFooter();
  g_ooutfile.BeginTable(100, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_LEFT, 0);
  g_ooutfile.TableRow();
  g_ooutfile.TableCell("", 26, getString("ID_DEFAULT_FONT"), 10, Constants.C_BLACK, Constants.C_TRANSPARENT, 0, Constants.FMT_CENTER | Constants.FMT_VCENTER, 0);
  g_ooutfile.OutputField(Constants.FIELD_DATE, getString("ID_DEFAULT_FONT"), 10, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_CENTER);
  g_ooutfile.Output(" ", getString("ID_DEFAULT_FONT"), 10, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_CENTER, 0);
  g_ooutfile.OutputField(Constants.FIELD_TIME, getString("ID_DEFAULT_FONT"), 10, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_CENTER);
  g_ooutfile.TableCell(Context.getSelectedFile(), 48, getString("ID_DEFAULT_FONT"), 10, Constants.C_BLACK, Constants.C_TRANSPARENT, 0, Constants.FMT_CENTER | Constants.FMT_VCENTER, 0);
  g_ooutfile.TableCell("", 26, getString("ID_DEFAULT_FONT"), 10, Constants.C_BLACK, Constants.C_TRANSPARENT, 0, Constants.FMT_CENTER | Constants.FMT_VCENTER, 0);
  g_ooutfile.Output(getString("PAGE")+" ", getString("ID_DEFAULT_FONT"), 10, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_CENTER, 0);
  g_ooutfile.OutputField(Constants.FIELD_PAGE, getString("ID_DEFAULT_FONT"), 10, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_CENTER);
  g_ooutfile.Output(" "+getString("OF")+" ", getString("ID_DEFAULT_FONT"), 10, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_CENTER, 0);
  g_ooutfile.OutputField(Constants.FIELD_NUMPAGES, getString("ID_DEFAULT_FONT"), 10, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_CENTER);
  g_ooutfile.EndTable("", 100, getString("ID_DEFAULT_FONT"), 10, Constants.C_BLACK, Constants.C_TRANSPARENT, 0, Constants.FMT_LEFT | Constants.FMT_VTOP, 0);
  g_ooutfile.EndFooter();
}



/**
 * starts the report composition; should be called after everything is set up;
 **/
function _writeReport(){
    g_ooutfile.WriteReport();
}

/**
 * writes a title row within table or simply a title line
 * @param String text - the title
 * @param style - style which should be used for the string
 **/
function writeTableTitle(text, style){
    g_ooutfile.SetFrameStyle(Constants.FRAME_LEFT, 0);
    g_ooutfile.SetFrameStyle(Constants.FRAME_RIGHT, 0);
    g_ooutfile.SetFrameStyle(Constants.FRAME_TOP, 0);
    g_ooutfile.SetFrameStyle(Constants.FRAME_BOTTOM, 0);
    g_ooutfile.TableRow();
    arcmTableCellF(text, null, style, 1, tableColumnsWidths.size() );
    g_ooutfile.ResetFrameStyle();
}

/**
 * main method for writing value into started table; handles differen types of values
 * supported value types:
 *      - String
 *      - com.aris.arcm.api.rs.report.model.value.BaseReportValue
 *      - com.aris.arcm.api.rs.report.model.value.ComplexReportValue
 * @param celldata - value to be written
 * @param int width - width of cell; used only if nospan table is used;
 * @param styleName - name of style in which the value should be written
 * @param int rowSpan - how many rows should the value cover
 * @param int colSpan - how many columns should the value cover
 * @param object extraSettings - aditional settings used to write value differently depending on location etc. possible options:
 *                          - oneValueOnOneRow - mode for complex value output; values are written vertically
 *                          - hideLeftBorder - if one value consists of multiple columns, the inner columns should not contain borders - this specifies, if the value is inner or not
 *                          - minimizeSpaces - minimize spaces arround the icon and value
 **/
function writeTableCell(celldata, width, styleName, rowSpan, colSpan, extraSettings){
    if(!rowSpan) rowSpan = 1;
    if(!colSpan) colSpan = 1;
    if(!extraSettings) extraSettings = {};
    if(isBaseValue(celldata)){
        _writeBaseTableCell(celldata, width, styleName, rowSpan, colSpan, extraSettings);
    } else if(isComplexValue(celldata)){
        _writeComplexTableCell(celldata, width, styleName, rowSpan, colSpan, extraSettings);
    } else {
        _writeCellValue(celldata, styleName, null, rowSpan, colSpan, extraSettings);
    }
}

/**
 * @param value - value to check
 * @return true if value is instance of BaseReportValue
 **/
function isBaseValue(value){
    return value instanceof com.aris.modeling.server.bl.components.arcm.model.impl.object.ARCMBaseReportValue;
}

/**
 * @param value - value to check
 * @return true if value is instance of ComplexReportValue
 **/
function isComplexValue(value){
    return value instanceof com.aris.modeling.server.bl.components.arcm.model.impl.object.ARCMComplexReportValue;
}

/**
 * writes the BaseReportValue
 * @param celldata - value to be written
 * @param int width - width of cell; used only if nospan table is used;
 * @param styleName - name of style in which the value should be written
 * @param int rowSpan - how many rows should the value cover
 * @param int colSpan - how many columns should the value cover
 **/
function _writeBaseTableCell(celldata, width, style, rowSpan, colSpan, extraSettings){
    var asHeader = celldata.getStyleValue("header");
    if(asHeader != null){
        style.bgColor = COLOR_GREY;
    }
    style = createCustomizedStyle(style, celldata);
    _writeCellValue(celldata, style, null, rowSpan, colSpan, extraSettings);
}

/**
 * writes the ComplexReportValue
 * @param celldata - value to be written
 * @param int width - width of cell; used only if nospan table is used;
 * @param styleName - name of style in which the value should be written
 * @param int rowSpan - how many rows should the value cover
 * @param int colSpan - how many columns should the value cover
 * @param boolean oneValueOnOneRow - mode for complex value output; values are written vertically
 **/
function _writeComplexTableCell(celldata, width, style, rowSpan, colSpan, extraSettings){
    if(isComplexValue(celldata)){
        if(celldata.getValues() == null || celldata.getValues().size() <= 0){
            arcmTableCellF("", width, style, rowSpan, colSpan);
        }
        var valueColCnt = celldata.getValues().size();
        var colCnt = colSpan;
        var oneValueOnOneRow = extraSettings.oneValueOnOneRow;
        extraSettings.oneValueOnOneRow = null;
        for(var value in Iterator(celldata.getValues())){
            colSpan = oneValueOnOneRow ? colSpan : Math.ceil(colCnt / valueColCnt);
            writeTableCell(value, width, style, rowSpan, colSpan, extraSettings);
            colCnt -= colSpan;
            valueColCnt--;
            if(oneValueOnOneRow || isComplexValue(value)) g_ooutfile.TableRow();
        }
    }
}

function isEnumTextVisible(cellParams, definition){
    var attributeId = String(cellParams.get("attributeId"));
    var visible = false;
    var visible = definition.visibleText != null && attributeId != 'null' && definition.visibleText.indexOf(attributeId) < 0;
    return visible;
}

/**
 * writes the icon and value to the last created cell
 * @param celldata - value to be written
 * @param styleName - name of style in which the value should be written
 * @param boolean asLine - should value end with newline
 **/
function _writeCellValue(celldata, styleName, asLine, rowSpan, colSpan, extraSettings){
  
    if(isBaseValue(celldata)){
        if(celldata.getStyleValue("section")=="true"){
          arcmTableSeparator(false,2);
        }
        var icon = celldata.getIconPath();
        var value = celldata.getValue()== null ? " " : celldata.getValue();
        var orgSpaces;
        if(icon != null && arcmGetIcon(icon) != null){
            if(extraSettings.hideLeftBorder){
                g_ooutfile.SetFrameStyle(Constants.FRAME_LEFT, 0);
            }
            g_ooutfile.SetFrameStyle(Constants.FRAME_RIGHT, 0);
             if(celldata.getStyleValue("bold")===true){
                style ='BASE_TEXT_BOLD';
                arcmTableCellF("", 0, style, rowSpan, 1);
            }else{
                arcmTableCellF("", 0, styleName, rowSpan, 1);
            }
            if(extraSettings.minimizeSpaces) orgSpaces = arcmCleanCellSpacing();
            g_ooutfile.OutGraphic(Context.createPicture(arcmGetIcon(icon).getImage(), Constants.IMAGE_FORMAT_PNG), -1, 1, 1);
            colSpan--;
            g_ooutfile.ResetFrameStyle();
            g_ooutfile.SetFrameStyle(Constants.FRAME_LEFT, 0);
            
        }
        arcmTableCellF("", 0, styleName, rowSpan, colSpan);
        if(orgSpaces) arcmCleanCellSpacing();
        var style = celldata.getStyleValue("showText");
        if(celldata.getStyleValue("bold")=="true"){
           styleName ='HEADER';         
        }
        if(style != 'false'||extraSettings.writeText){
            _writeValue(value, styleName, asLine);
        }
        g_ooutfile.ResetFrameStyle();
        if(orgSpaces){
            arcmSetCellSpacing(orgSpaces);
        }
    } else {
        arcmTableCellF("", 0, styleName, rowSpan, colSpan);
        _writeValue(celldata, styleName, asLine);  
        return;
    }
}

/**
 * helper method for repeating string amount times
 * @param String string - string to repeat
 * @param int amount - how many times the string should be repeated
 **/
function repeatString(string, amount){
    var result = "";
    for(var i=0; i<amount; i++){
        result += string;
    }
    return result;
}

/**
 * gets icon by path from global icon storage
 */
function arcmGetIcon(iconPath){
    return iconDataSource.getIcon(iconPath);
}

/**
 * adds datasource icons to global icon storage
*/
function arcmAddIcons(icons){
    iconDataSource.addIcons(icons);
}

/**
 * writes String or BaseReportValue
 * @param value - value to be written
 * @param styleName - name of style in which the value should be written
 * @param boolean asLine - should value end with newline
 **/
function _writeValue(value, style, asLine){
    if (typeof(style) === 'string') {
        style = getStyleByName(style);
    } else {
        style = extendObj(getDefaultCellStyle(), style) // in case not the whole style object is received from script (list report sends {'format': format} )
    }
    if(asLine && !isExcelOutputFormat()){
        g_ooutfile.OutputLn(value, style.font, style.fontSize, style.fontColor, style.bgColor, style.format, style.indent);
    } else {
        g_ooutfile.Output(value, style.font, style.fontSize, style.fontColor, style.bgColor, style.format, style.indent);
    }
}

/**
 * it adds empty table row if within table or empty line if not within table
 **/
function writeEmptyLine(amount){
    if(!amount) amount = 1;
    for(var i=0; i<amount; i++){
        if(isExcelOutputFormat()){
            g_ooutfile.SetFrameStyle(Constants.FRAME_LEFT, 0);
            g_ooutfile.SetFrameStyle(Constants.FRAME_RIGHT, 0);
            g_ooutfile.SetFrameStyle(Constants.FRAME_TOP, 0);
            g_ooutfile.SetFrameStyle(Constants.FRAME_BOTTOM, 0);
            g_ooutfile.TableRow();
            arcmTableCellF("", 30, "BASE_TEXT");
            g_ooutfile.ResetFrameStyle();
        } else {
            var localStyle = getStyleByName("BASE_TEXT");
            g_ooutfile.OutputLn("", localStyle.font, localStyle.fontSize, localStyle.fontColor, localStyle.bgColor, localStyle.format, localStyle.indent);
        }
    }
}

/**
 * sets the widths of the columns
 * @param int[] widths - array of int values
 **/

function arcmSetColumnWidthsXls(widths){
    if(tableColumnsWidths.size() == 0 || !isExcelOutputFormat()){
        tableColumnsWidths = new java.util.ArrayList();
        for(var i=0; i<widths.length; i++){
            tableColumnsWidths.add(widths[i]);
        }
    }
}

/**
 * determines if we are exporting into excel
 **/
function isExcelOutputFormat(){
    var selectedFormat = Context.getSelectedFormat();
    return selectedFormat.compareTo(Constants.OutputXLS) === 0 || selectedFormat.compareTo(Constants.OutputXLSX) === 0;
}

/**
 * separator which should be used for separing different tables
 **/
function arcmTableSeparator(hideSpace, linesAmount){
    if(!isExcelOutputFormat()){
        arcmEndTable();
        if(!hideSpace) writeEmptyLine(linesAmount);
        arcmStartTable();
    } else {
        if(!hideSpace) writeEmptyLine(linesAmount);
    }
}

/**
 * separator for sheets or pages
 **/
function arcmSheetSeparator(){
    if(!isExcelOutputFormat()){
        arcmPageBreak();
    } else {
        arcmEndTable();        
        arcmStartTable();
    }
}

function arcmStartLandscapeSection(title){
    if(!isExcelOutputFormat() && isPortrait()){
        arcmEndTable(); 
        if(sectionStarted){
            arcmEndSection();
        } else {
            g_ooutfile.BeginSection(g_ooutfile.GetPageWidth(), g_ooutfile.GetPageHeight(), 
                                    g_ooutfile.GetDistHeader(), g_ooutfile.GetDistFooter(), 
                                    g_ooutfile.GetLeftMargin(), g_ooutfile.GetRightMargin(), 
                                    g_ooutfile.GetTopMargin(), g_ooutfile.GetBottomMargin(), 
                                    false, Constants.SECTION_DEFAULT);
                                    _writeHeader(title);
                                    _writeFooter();
            sectionStarted = true;
        }
        arcmStartTable();
    } 
}

function arcmStartPortraitSection(title){
    if(!isExcelOutputFormat() && !isPortrait()){
        arcmEndTable();
        if(sectionStarted){
            arcmEndSection();
        } else {
            g_ooutfile.BeginSection(g_ooutfile.GetPageWidth(), g_ooutfile.GetPageHeight(), 
                                    g_ooutfile.GetDistHeader(), g_ooutfile.GetDistFooter(), 
                                    g_ooutfile.GetLeftMargin(), g_ooutfile.GetRightMargin(), 
                                    g_ooutfile.GetTopMargin(), g_ooutfile.GetBottomMargin(), 
                                    false, Constants.SECTION_DEFAULT);
                                    _writeHeader(title);
                                    _writeFooter();
            sectionStarted = true;
        }
        arcmStartTable();
    } 
}

function isPortrait(){
    return g_ooutfile.GetPageHeight()>g_ooutfile.GetPageWidth();
}

function arcmEndSection(){
    if(!isExcelOutputFormat() && sectionStarted){
        g_ooutfile.EndSection();
        sectionStarted = false;
    } 
}

/**
 * forces new page start; does not work for excel
 **/
function arcmPageBreak(){
    if(!isExcelOutputFormat()){
        arcmEndTable();
        g_ooutfile.OutputField(Constants.FIELD_NEWPAGE, getString("ID_DEFAULT_FONT"), 10, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_CENTER);
        arcmStartTable();
    }
}

/**
 * start new table if we are not exporting into xls only
 **/
function arcmStartNewTableIfNotXls(){
    if(!isExcelOutputFormat()){
        arcmStartTable();
    }
}

/**
 * start new table if we are exporting into xls only
 **/
function arcmStartNewTableIfXls(){
    if(isExcelOutputFormat()){
        arcmStartTable();
    }
}

/**
 * main method for starting new table
 * @param String mode - by default TABLE_MODE_SPAN is used; any other value start nospan table
 **/
function arcmStartTable(mode){
    mode = TABLE_MODE_SPAN;
    tableMode = mode;
    if(mode == TABLE_MODE_SPAN){
        g_ooutfile.BeginTable(100, tableColumnsWidths, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_LEFT, 0);
    } else {
        g_ooutfile.BeginTable(100, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_LEFT, 0);
    }
    tableStarted = true;
}

/**
 * method used for table end
 **/
function arcmEndTable(){
    if(tableStarted){
        g_ooutfile.EndTable ("", 100, getString("ID_DEFAULT_FONT"), 10, Constants.C_BLACK, Constants.C_TRANSPARENT, 0, Constants.FMT_LEFT | Constants.FMT_VTOP, 0);
        tableStarted = false;
    }
}

/**
 * starting new table row
 **/
function arcmTableRow(){
    g_ooutfile.TableRow();
}

/**
 * method used for placing image into report
 * @param byte[] image - picture which should be placed into report
 **/
function arcmOuptutPicture(image){
    g_ooutfile.SetFrameStyle(Constants.FRAME_LEFT, 0);
    g_ooutfile.SetFrameStyle(Constants.FRAME_RIGHT, 0);
    g_ooutfile.SetFrameStyle(Constants.FRAME_TOP, 0);
    g_ooutfile.SetFrameStyle(Constants.FRAME_BOTTOM, 0);
    g_ooutfile.TableRow();
    arcmTableCellF("", null, "BASE_TEXT", 1, tableColumnsWidths.size());
    //g_ooutfile.OutGraphicAbsolute(Context.createPicture(image, Constants.IMAGE_FORMAT_PNG), 100, 100, 400, 200, false);
    g_ooutfile.OutGraphic(image, 85, 300, 130);
    g_ooutfile.ResetFrameStyle();
}

/**
 * creates table cell with specified style
 * @param sText - value to be written
 * @param int width - width of cell; used only if nospan table is used;
 * @param style - name of style in which the value should be written
 * @param int rowSpan - how many rows should the value cover
 * @param int colSpan - how many columns should the value cover
 **/
function arcmTableCellF(sText, width, style, rowSpan, colSpan){
    if (typeof(style) === 'string') {
        style = getStyleByName(style);
    } else {
        style = extendObj(getDefaultCellStyle(), style) // in case not the whole style object is received from script (list report sends {'format': format} )
    }
    if(tableMode == TABLE_MODE_SPAN){
        rowSpan = typeof(rowSpan) == 'undefined' ? 1 : rowSpan;
        colSpan = typeof(colSpan) == 'undefined' ? 1 : colSpan;
        g_ooutfile.TableCell(sText, rowSpan, colSpan, style.font, style.fontSize, style.fontColor, style.bgColor, style.shading, style.format, style.indent);
    } else {
        g_ooutfile.TableCell(sText, width, style.font, style.fontSize, style.fontColor, style.bgColor, style.shading, style.format, style.indent);
    }
}

function arcmOutputF(sText, style) {
    g_ooutfile.Output(sText, style.font, style.fontSize, style.fontColor, style.bgColor, style.format, style.indent);
}

/**
 * creates a clone of style and replaces all custom style values that are defined in celldata object
 * @param originalStyle - style to clone
 * @param celldata - cell data (arcm reportValue)
 * @return 
 **/
function createCustomizedStyle(originalStyle, celldata) {
    if (typeof(originalStyle) === 'string') originalStyle = getStyleByName(originalStyle);
    var styles = celldata.getStyle();
    if (styles.size() <= 0) {
        return originalStyle;
    } else {
        var customProperties = {};
        for (var style in Iterator(styles.entrySet())) {
            customProperties[style.getKey()] = style.getValue();
        }
        var newStyle = extendObj(originalStyle, customProperties);
        
        // if bfColor is still represented as a hexadecimal string, change to RGB color object
        var newBgColor = createRgbColorFromHexString(newStyle.bgColor);
        if (newBgColor != null) newStyle.bgColor = newBgColor;
        
        return newStyle;
    }
}

/**
 * creates RGB color object from a string that contains hex color value '#aa46ff'
 * @param bgHexString - string containing hex color value, for example: '#aa46ff'
 * @return rgb color object
 **/
function createRgbColorFromHexString(bgHexString) {
    var hexColor = getHexColorValueFromString(bgHexString);
    if (hexColor != null) {
        var r = parseInt(hexColor.substring(0,2),16);
        var g = parseInt(hexColor.substring(2,4),16);
        var b = parseInt(hexColor.substring(4,6),16);
        return getColorByRGB(r, g, b);
    }
}

/**
 * returns hexadecimal color value from string (without '#')
 * @param stringValue - hexadecimal color value 'aaccff'
 * @return hexadecimal color value 'aa59ff'; null if string doesn't contain hex color value
 **/
function getHexColorValueFromString(stringValue) {
    var hexColorPattern = /#[a-f0-9]{6}/i;
    var hexColor = hexColorPattern.exec(stringValue);
    if (hexColor != null) {
        hexColor = hexColor[0].slice(1); // trim "#"
        return hexColor;
    }
}

/**
 * returns default style of cell
 **/
function getDefaultCellStyle(){
    return {
        'font': getString("ID_DEFAULT_FONT"),
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

/*****************************************************************************
                            EXTENDED REPORTS
*****************************************************************************/

var objectIdKey   = com.aris.arcm.apiclient.ArisReportingServiceConstants.ATTR_OBJECT_ID;
var objectTypeKey = com.aris.arcm.apiclient.ArisReportingServiceConstants.ATTR_OBJECT_TYPE;
var objectGUIDKey = com.aris.arcm.apiclient.ArisReportingServiceConstants.ATTR_OBJECT_GUID;
var limitKey      = com.aris.arcm.apiclient.ArisReportingServiceConstants.PARAMS_LIMIT;
var defaultObjectColumnWidths = [35, 65];
var pdfTableWidthCorectionColumnIdx = 0; // temporary - workarround for not always same table widths

/************************** CALCULATE COLUMN WIDTHS ****************************/
/**
 * sets widths of report table columns
 */
function calcColumnWidths(data){
    if(isExcelOutputFormat()){
        var widths = calcWidths(data);
        if(widths.length == 0){
            widths = defaultObjectColumnWidths;
        } else {
            normalizeColumnWidths(widths);
        }
        arcmSetColumnWidthsXls(widths);
    } else {
        arcmSetColumnWidthsXls(defaultObjectColumnWidths);// it is recalculated for each table separatelly, default is needed for title f.e.
    }
}

/**
 * calculates widths of columns based on all read datasources
 */
function calcWidths(data){
    var widths = [];
    for(var i=0; i<data.length; i++){
        var obj = data[i];
        if(obj.type == 'object'){
            updateWidths(widths, readObjectColumnsWidths(obj));
            if(typeof(obj.children) != 'undefined'){
                for(var m=0; m<obj.children.length; m++){
                    updateWidths(widths, calcWidths(obj.children[m]));
                }
            }
        } else if(obj.type == 'list'){
            if(obj.columnsHeaders.length > 0 && obj.objects.length > 0){
                updateWidths(widths, readListColumnsWidths(obj.columnsHeaders));
            }
        }else{
            if(typeof(obj.children) != 'undefined'){
                for(var m=0; m<obj.children.length; m++){
                    updateWidths(widths, calcWidths(obj.children[m]));
                }
            }
        }
    }
    return widths;
}

/**
 * reads widths for one datasource object
 */
function readObjectColumnsWidths(obj){
    var objWidths = [defaultObjectColumnWidths[0]];
    return objWidths.concat(getObjValuesWidths(obj, defaultObjectColumnWidths[1]));
}

/**
 * reads the max columns needed for displaying selected object
 */
function getObjValuesWidths(obj, maxWidth){
    var widths = [];
    for(var k=0; k<obj.attributeGroups.length; k++){
        var group = obj.attributeGroups[k];
        for(var j=0; j<group.length; j++){
            var valWidths = getObjectValueColWidths(group[j].getValue(), maxWidth, true);
            if(valWidths.length > widths.length){
                updateWidths(widths, valWidths);
            }
        }
    }
    return widths;
}

function getObjectValueColWidths(value, maxWidth, oneValueOnOneRow){
    var widths = []; //1 for simple value
    var treeLevelWidths = [];
    var treeLevel = value.getStyleValue("treeLevel");
    var iconWidth = treeLevel != null ? 2 : (g_ooutfile.GetPageWidth() < 290 ? 3.5 : 2.5);
    var treeLevelWidth = iconWidth;
    if(treeLevel != null){
        for(var i=0; i<treeLevel-1; i++){
            treeLevelWidths.push(treeLevelWidth);
            maxWidth -= treeLevelWidth;
        }
    }
    if(isComplexValue(value)){
        var rows = value.getValues();
        widths = [maxWidth];
        var rowWidths = [];
        for(var i=0; i<rows.size(); i++){
            var row = rows.get(i);
            if(isComplexValue(row)){
                var values = row.getValues();
                var baseCellWidth = maxWidth / values.size();
                rowWidths = [];
                for(var j=0; j<values.size(); j++){
                    rowWidths = rowWidths.concat(getObjectValueColWidths(values.get(j), baseCellWidth));
                }
            } else {
                if(oneValueOnOneRow){
                    rowWidths = getObjectValueColWidths(row, maxWidth);
                } else {
                    rowWidths = rowWidths.concat(getObjectValueColWidths(row, maxWidth/rows.size()));
                }
            }
            if(rowWidths.length > widths.length){
                widths = rowWidths;
            }
        }
    } else { // BaseValue
        if(value.getIconPath() != null){
            widths = [iconWidth, Math.max(0, maxWidth-iconWidth)];
        } else {
            widths = [maxWidth];
        }
    }
    return treeLevelWidths.concat(widths);
}

/**
 * extends widths with new values
 */
function updateWidths(widths, newWidths){
    var resultWidths = [];
    var widthsCounter = 0;
    var usedWidth = 0;
    var newUsedWidth = 0;
    if(widths.length == 0){
        resultWidths = newWidths;
    } else {
        for(var i=0; widthsCounter<widths.length || i<newWidths.length;){
            var br = true; // only cycle prevention
            if(i<newWidths.length && (usedWidth + widths[widthsCounter] >= newUsedWidth + newWidths[i] || widthsCounter >= widths.length)){
                var w = newUsedWidth + newWidths[i] - usedWidth;
                if(w > 0){
                    resultWidths.push(Math.min(newWidths[i], w));
                }
                newUsedWidth += newWidths[i];
                i++;
                br = false;
            } else if(widthsCounter < widths.length){
                var w = usedWidth + widths[widthsCounter] - newUsedWidth;
                if(w > 0){
                    resultWidths.push(Math.min(widths[widthsCounter], w));
                }
                usedWidth += widths[widthsCounter];
                widthsCounter++;
                br = false;
            }
            if(br){
                break;
            }
        }
    }
    for(var i=0; i<resultWidths.length; i++){
        widths[i] = resultWidths[i];
    }
    return widths;
}

/**
 * updates widths for different report objects - only used for non xls formats
 */
function updateColumnWidths(widths, hideSpace){
    var badTableSizeInPdfCorrection = !isExcelOutputFormat() === 0 ? 3 : 0;
    if(widths.length > 0) widths[pdfTableWidthCorectionColumnIdx] += badTableSizeInPdfCorrection;
    arcmSetColumnWidthsXls(widths);
    arcmTableSeparator(hideSpace);
}

/****************************** READ REPORT DATASOURCES **************************************/
/**
 * reads all datasources and composes data array of objects which can be written to report
 */
function readData(definition){
    var data;
    if(definition.type == 'object'){
        data = readObjectData(definition);
    } else if (definition.type == 'log') {
        data = definition.datasource;
    } else if(definition.type == 'list'){
        data = readListData(definition);
    } else if(definition.type == 'evaluation'){
        data = readEvaluationData(definition);
    } else if(definition.type == 'arismodel'){
        data = readArisModelData(definition);
    } else if(definition.type == 'title'){
        data = [cloneObject(definition)];
        data[0].title = readTitle(null, definition.title);
    } else if(definition.type == 'text'){
        data = [cloneObject(definition)];
        fillStringParams(null, data[0]);
    } else if(definition instanceof Array){
        data = [];
        for(var i=0; i<definition.length; i++){
            data = data.concat(readData(definition[i]));
        }
    } else {
        data = [cloneObject(definition)];
    }
    return data;
}

/**
 * reads data for one object
 */
function readObjectData(definition){
    var data = [];
    var source = definition.datasource != null ? definition.datasource : loadLinkedObjectsDatasource(definition);
    if(source == null) return data;
    var objects = source.getReportObjects();
    for(var i=0; i<objects.size(); i++){
        var object = objects.get(i);
        var objData = {
            type: definition.type,
            objectDelimiter: definition.objectDelimiter,
            sectionDelimiter: definition.sectionDelimiter,
            portrait: definition.portrait,
            landscape:definition.landscape,
            objId: String(object.getAttribute(objectIdKey).getValue().getValue()),
            objType: String(object.getAttribute(objectTypeKey).getValue().getValue()),
            attributeGroups: readAttributeGroups(object, definition),
            userInfo: source.getUserInfo()
        };
        if(typeof(definition.title) != 'undefined'){
            objData.title = readTitle(object, definition.title);
        }
        objData = readChildren(definition, objData, objData.objId, objData.objType, object);
        if(objData != null){
            data.push(objData);
        }
    }
    return data;
}

function readChildren(definition, parentData, objId, objType, parentObj){
    if(typeof(definition.children) == 'undefined') return parentData;
    parentData.children = [];
    for(var j=0; j<definition.children.length; j++){
        var childDef = definition.children[j];
        // set context/parent object
        if(!childDef.params) childDef.params = {};
        if(objId != null)   {
            childDef.params[objectIdKey] = objId;
            if(childDef.addToFilterParentObjectIdWithName != null){
                childDef.filter[childDef.addToFilterParentObjectIdWithName] = ((objId.split(":"))[0]);
            }
        }
        if(objType != null) childDef.params[objectTypeKey] = objType;
        childDef.parentObj = parentObj;
        if(childDef.parentRefAttr && parentData.type == 'object'){ // only for object implemented
            if(parentObj.getAttribute(childDef.parentRefAttr)!=null){
                childDef.parentRef = buildRefAttr(parentObj.getAttribute(childDef.parentRefAttr).getValue());
            }else{
                childDef.parentRef ={};
            }
                
        }
        var parentRecursionLevel = definition.title && definition.title.recursionLevel ? definition.title.recursionLevel : 0;
        if(childDef.title){
            if(typeof(childDef.title.recursionLevel) == 'undefined') childDef.title.recursionLevel = parentRecursionLevel;
            else childDef.title.recursionLevel++;
        }
        var childData = readData(childDef);
        if(childDef.title){
            if(childDef.title.recursionLevel <= parentRecursionLevel) childDef.title.recursionLevel = undefined;
            else childDef.title.recursionLevel--;
        }
        if(typeof(childDef.modifyChildData) == 'function'){
            childData = childDef.modifyChildData(childData, parentData);
        }
        if(typeof(childDef.modifyParentData) == 'function'){
            parentData = childDef.modifyParentData(parentData, childData);
            if(parentData == null) break;
        }
        if(childData != null){
            parentData.children.push(childData);
        }
    }
    return parentData;
}

/**
 * some object attributes are links to other objects, this method collects all the referenced ids for selected attribute
 */
function buildRefAttr(attributeValue){
    var ref = {};
    if(isBaseValue(attributeValue)){
        ref = {refId: attributeValue.getRefId(), refType: attributeValue.getRefType()};
    } else if(isComplexValue(attributeValue)){
        var values = attributeValue.getValues();
        for(var i=0; i<values.size(); i++){
            var value = buildRefAttr(values.get(i));
            if(i==0) ref.refType = value.refType;
            if(!ref.refId) ref.refId = value.refId;
            else ref.refId += "|"+value.refId;
        }
    }
    return ref;
}

/**
 * reads data for selected list
 */
function readListData(definition){
    var data = [];
    var source = definition.datasource != null ? definition.datasource : loadLinkedObjectsListDatasource(definition);
    if(source == null) return data;
    var objIds = [];
    var tableHeader = createTableHeader(source, definition)
    var listData = {
        type: definition.type,
        objectDelimiter: definition.objectDelimiter,
        sectionDelimiter: definition.sectionDelimiter,
        portrait: definition.portrait,
        landscape:definition.landscape,
        userInfo: source.getUserInfo(),
        filters: source.getFilters(),
        header: tableHeader,
        columnsHeaders: getHeaderLeafNodes(tableHeader[0]),
        objects: [],
	    showFilters: definition.showFilters,
        datasource: source
    };
    if(typeof(definition.title) != 'undefined'){
        listData.title = readTitle(source, definition.title);
    }

    var maxRowCellsWidths = {};
    var objects = source.getListAppObjects();
    for(var i=0; i<objects.size(); i++){
        var objectData = {
            objectType: '',
            objectId: '',
            attributes: []
        };
        var colCounter = 0;
        var objectAttrs = objects.get(i).getAttributes();
        var rowCellsWidths = {};
        for(var j=0; j<objectAttrs.size(); j++){
            var attr = objectAttrs.get(j);
            var value = attr.getValue();
            if(attr.getId() == objectTypeKey) objectData.objectType = value.getValue();
            if(attr.getId() == objectIdKey){
                objectData.objectId = value.getValue();
                objIds.push(objectData.objectId);
            }
            if(value.getStyleValue('invisible')) continue;
            var headerCellData = getColumnHeaderCellData(colCounter, listData.columnsHeaders);
            if(!headerCellData) continue;
            var headerCell = headerCellData.headerCell;
            if(!headerCell || headerCell['isHidden']){
                colCounter += headerCell.colspan;
                continue;
            }
            if(!headerCell['isIconVisible']){
                removeValueIcon(value);
            }
            objectData.attributes.push({
                headerCell: headerCell,
                value: value,
                showText:headerCell['showText']
            });
            if(!rowCellsWidths[headerCellData.idx]){
                rowCellsWidths[headerCellData.idx] = {
                    subCellsWidths: [],
                    valueColumnsCnt: 0,
                    headerCell: headerCell
                };
            }
            var cellWidths = rowCellsWidths[headerCellData.idx];
            var colWidths = getObjectValueColWidths(value, headerCell.width);
            if(headerCell.colspan <= colWidths.length){ // if value covers more columns than header column, next value belongs to next header column
                colCounter += headerCell.colspan;
            } else {
                colCounter += colWidths.length;
                colWidths = getObjectValueColWidths(value, headerCell.width / headerCell.colspan);
            }
            cellWidths.valueColumnsCnt++;
            cellWidths.subCellsWidths = cellWidths.subCellsWidths.concat(colWidths);
        }
        for(var j in rowCellsWidths){
            var cellWidths = rowCellsWidths[j];
            if(!maxRowCellsWidths[j] || maxRowCellsWidths[j].subCellsWidths.length < cellWidths.subCellsWidths.length){
                maxRowCellsWidths[j] = {
                    subCellsWidths: cellWidths.subCellsWidths,
                    valueColumnsCnt: cellWidths.valueColumnsCnt,
                    headerCell: cellWidths.headerCell
                };
            }
        }
        listData.objects.push(objectData);
    }
    for(var j in maxRowCellsWidths){
        var cellWidths = maxRowCellsWidths[j];
        var headerCell = cellWidths.headerCell;
        if(headerCell.colspan < cellWidths.subCellsWidths.length || !headerCell.subCellsWidths || !headerCell.valueColumnsCnt){
            headerCell.subCellsWidths = cellWidths.subCellsWidths;
            headerCell.valueColumnsCnt = cellWidths.valueColumnsCnt;
            setHeaderCellColSpan(headerCell, cellWidths.subCellsWidths.length);
        }
    }
    if(objIds.length > 0){
        listData = readChildren(definition, listData, objIds.join("|"), listData.objects[0].objectType, null);
    }
    if(listData != null){
        data.push(listData);
    }
    return data;
}

function getColumnHeaderCellData(colIdx, headers){
    var lastHeaderColumnIdx = 0;
    for(var i=0; i<headers.length; i++){
        lastHeaderColumnIdx += headers[i].colspan;
        if(colIdx < lastHeaderColumnIdx){
            return {
                idx: 'c_'+i,
                headerCell: headers[i]
            }
        }
    }
    return null;
}

function setHeaderCellColSpan(cell, newColspan){
    var increment = newColspan - cell.colspan;
    cell.colspan = newColspan;
    if(cell.parent != null){
        setHeaderCellColSpan(cell.parent, cell.parent.colspan + increment);
    }
}

/**
 * reads data for selected evaluation
 */
function readEvaluationData(definition){
    var data = [];
    var source = definition.datasource != null ? definition.datasource : loadLinkedEvaluationDatasource(definition);
    if(source == null) return data;
    var dataTables = source.getDataTables();
    for(var i=0; i<dataTables.size(); i++){
        var listDataSource = dataTables.get(i);
        var listDef = extendObj(definition, {type: 'list'});
        listDef.datasource = listDataSource;
        data = data.concat(readListData(listDef));
    }
    if(dataTables.size() <= 0){
        data.push({
            title: readTitle(source, definition.title)
        });
    }
    
    var charts = source.getCharts().getChartImages();
    for(var i=0; i<charts.size(); i++){
        var image = charts.get(i);
        var chartData = {
            type: 'chart',
            objectDelimiter: definition.objectDelimiter,
            sectionDelimiter: definition.sectionDelimiter,
            portrait: definition.portrait,
            landscape:definition.landscape,
            image: image
        };  
        chartData = readChildren(definition, chartData, null, null, image);
        if(chartData != null){
            data.push(chartData);
        }
    }
    
    data[0].userInfo = source.getUserInfo();
    data[0].filters = source.getFilters();
	data[0].showFilters = definition.showFilters;
    return data;
}

/**
 * reads aris model image data
 */
function readArisModelData(definition){
    var data = [];
    var locale = Context.getSelectedLanguage();
    var db = ArisData.openDatabase(definition.dbName, com.aris.modeling.server.common.AServerRuntime.theInstance().getGUIDFactory().getFULLMETHODGUID(), locale, false);
    if(db != null && definition.objectGUID && definition.objectGUID.parentObjectAttr){
        var nodeGuid = valueToString(definition.parentObj.getAttribute(definition.objectGUID.parentObjectAttr).getValue());        
        var node = db.FindGUID(nodeGuid);
        if(node != null && node.OccList){
            var occs = node.OccList();
            var p_model = occs[0].Model();
            data.push({
                type: definition.type,
                objectDelimiter: definition.objectDelimiter,
                sectionDelimiter: definition.sectionDelimiter,
                portrait: definition.portrait,
                landscape:definition.landscape,
                title: readTitle(p_model, definition.title),
                graphic: p_model.Graphic(false, false, locale)
            });
        }
    }
    return data;
}

/**
 * evaluates title attribute of report objects/lists/evaluations
 */
function readTitle(object, titledef){
    var title = cloneObject(titledef);
    if(title.recursionLevel){
        increaseTitleLevel(title, title.recursionLevel);
    }
    if(title.params){
        fillStringParams(object, title);
    }
    return title;
}

function fillStringParams(object, title){
    for(var key in title.params){
        var value = title.params[key];
        if(typeof(value.objectAttr) != 'undefined'){
            var attr = object.getAttribute(value.objectAttr);
            value = attr == null ? '' : valueToString(attr.getValue());
        } else if(typeof(value.listTitle) != 'undefined' && value.listTitle == 1){
            value = object.getListTitle();
            var level = object.getTitleLevel();
            if(level > 0){
                increaseTitleLevel(title, level)
            }
        } else if(typeof(value.arisModelTitle) != 'undefined' && value.arisModelTitle == 1){
            value = object.Name(Context.getSelectedLanguage(), true);
        }
        var regex = new RegExp(":"+key, "g");
        title.text = title.text.replace(regex, value);
    }
}

function increaseTitleLevel(title, increment){
    var currentLevel = parseInt(title.level.substr(1), 10);
    title.level = 'h'+(increment+currentLevel);
}

/**
 * converts report value into string, complex value is serialized into coma separated string
 */
function valueToString(value){
    var str = "";
    if(isBaseValue(value)){
        str = value.getValue();
    } else if(isComplexValue(value)){
        var values = value.getValues();
        for(var i=0; i<values.size(); i++){
            var substr = valueToString(values.get(i));
            if(str == "") str = substr;
            else str += ", "+substr;
        }
    }
    return str;
}

/**
 * reads object attribute groups
 */
function readAttributeGroups(object, definition){
    var attrGroups = [];
    for(var i=0; i<object.getGroupInfo().size(); i++){
        var group = object.getGroupInfo().get(i);
        var attrGrp = [];
        for(var attributeId in Iterator(group.getAttributeIds())){
            var attrId = String(attributeId);
            if(definition.selectedAttribs != null && definition.selectedAttribs.indexOf(attrId) < 0) continue;
            if(definition.excludedAttribs != null && definition.excludedAttribs.indexOf(attrId) >= 0) continue;
            var attribute = object.getAttribute(attributeId);
            if(!_isIconVisible(definition, attrId)){
                removeValueIcon(attribute.getValue());
            }
            attrGrp.push(attribute);
        }
        attrGroups.push(attrGrp);
    }
    return attrGroups;
}

function removeValueIcon(value){
    value.setIconPath(null);
    if(isComplexValue(value)){
        var values = value.getValues();
        for(var i=0; i<values.size(); i++){
            removeValueIcon(values.get(i));
        }
    }
}

function _isIconVisible(definition, valueId){
    var hideIcon = 
        definition.selectedIconProperties != null && definition.selectedIconProperties.indexOf(valueId) < 0
     || definition.excludedIconProperties != null && definition.excludedIconProperties.indexOf(valueId) >= 0
    ;
    return !hideIcon;
}

/*********************** LOAD DATA FROM ARCM SERVER ***********************************************/
/**
 * loads objects linked to parent object by some list
 */
function loadLinkedObjectsDatasource(definition){
    var subObjectsType = null;
    var subObjectsIds = "";
    if(definition.listName || definition.viewName){
        var subObjectsList = loadLinkedObjectsListDatasource(definition).getListAppObjects();
        for (var i = 0; i < subObjectsList.size(); i++) {
            if(subObjectsType == null){
                subObjectsType = getListObjectAttribute(subObjectsList.get(i), objectTypeKey);
            }
            subObjectsIds += getListObjectAttribute(subObjectsList.get(i), objectIdKey);
            if(i < subObjectsList.size()-1){
                subObjectsIds += "|";
            }
        }
    } else if(definition.parentRef){
        subObjectsType = definition.parentRef.refType;
        subObjectsIds = definition.parentRef.refId;
    } else if(definition.params && definition.params[objectIdKey] && definition.params[objectTypeKey]){
        subObjectsType = definition.params[objectTypeKey];
        subObjectsIds = definition.params[objectIdKey];
    }
    var objects = null;
    if(subObjectsType != null){
        objects = ARCM.getAppObjDataSource(subObjectsType, subObjectsIds);
        arcmAddIcons(objects.getIcons());
    }
    return objects;
}

/**
 * loads list datasource
 */
function loadLinkedObjectsListDatasource(definition){
    if(!definition.filter) definition.filter = {};
    if(!definition.params) definition.params = {};
    if(definition.limit) definition.params[limitKey] = definition.limit;
    var objectsList;
    if(definition.viewName){
        objectsList = ARCM.getListViewDataSource(
            definition.viewName,
            definition.filter,
            definition.params);
    } else {
        objectsList = ARCM.getListDataSource(
            definition.listName,
            definition.filter,
            definition.params);
    }
    arcmAddIcons(objectsList.getIcons());
    return objectsList;
}

/**
 * retrieves list object attribute by name
 */
function getListObjectAttribute(object, attribute){
    for(var i=0; i<object.getAttributes().size(); i++){
        if(object.getAttributes().get(i).getId() == attribute){
            return object.getAttributes().get(i).getValue().getValue();
        }
    }
    return null;
}

/**
 * loads evaluation datasource
 */
function loadLinkedEvaluationDatasource(definition){
    if(!definition.filter) definition.filter = {};
    if(!definition.params) definition.params = {};
    var evaluations = ARCM.getEvaluationDataSource(
        definition.evaluationId,
        definition.filter,
        definition.params);
    arcmAddIcons(evaluations.getIcons());
    return evaluations;
}

/***************************** WRITE REPORT DATA ********************************************/
/**
 * writes report data into ouptut document
 */
var reportChartData = [];
function writeReportData(data, headerTitle){
    for(var i=0; i<data.length; i++){
        var obj = data[i];
        
        if(obj.portrait && !isPortrait()) {
            arcmStartPortraitSection(headerTitle);
        } else if(obj.landscape && isPortrait()){
            arcmStartLandscapeSection(headerTitle);
        } else {
            if(obj.objectDelimiter && i > 0) _writeSeparator(obj.objectDelimiter);
            if(obj.sectionDelimiter && i == 0) _writeSeparator(obj.sectionDelimiter);
        }

        if(obj.title != null){
            outputTitle(obj.title.text, obj.title.level);
        }
        if(obj.type == 'text'){
            writeTableTitle(obj.text, (obj.style ? obj.style : "BASE_TEXT"));
        } else if(obj.type == 'object'){
            pdfTableWidthCorectionColumnIdx = 0;
            if(!isExcelOutputFormat())
                updateColumnWidths(readObjectColumnsWidths(obj));
            writeObjectData(obj);
        } else if(obj.type == 'list'){
            if(obj.columnsHeaders.length > 0){
                pdfTableWidthCorectionColumnIdx = obj.columnsHeaders[0].colspan - 1;
                writeListData(obj);
            }
        } else if(obj.type == 'chart'){
            if(isExcelOutputFormat()){
                reportChartData.push({ // ouput of charts into excel, damages the document layout - first column is too wide - the charts will be exported to second sheet
                    obj: obj
                });
            } else {
                var widths = [100];
                pdfTableWidthCorectionColumnIdx = 0;
                updateColumnWidths(widths, false);
                writeChartData(obj);
            }
        } else if(obj.type == 'arismodel'){
            writeArisModelData(obj);
        }
        if(typeof(obj.children) != 'undefined'){
            for(var j=0; j<obj.children.length; j++){
                writeReportData(obj.children[j], headerTitle);
            }
        }
    }
}

function writeChartsForXls(){
    if(reportChartData && reportChartData.length > 0){
        arcmSheetSeparator();
        for(var i=0; i<reportChartData.length; i++){
            writeChartData(reportChartData[i].obj);
        }
    }
}

function _writeSeparator(delimiter){
    switch(delimiter){
        case "newPage":
            writeObjectSeparator();
        break;
        case "emptyLines":
            arcmTableSeparator(false, 3);
        break;
    }
}

/**
 * outputs object data - attributes
 */
function writeObjectData(object){
    for(var i=0; i<object.attributeGroups.length; i++){
        var group = object.attributeGroups[i];
        for(var j=0; j<group.length; j++){
            writeTableRow(group[j]);
        }
        if(i < object.attributeGroups.length -1 && group.length > 0){
            writeObjectAttrGroupSeparator();
        }
    }
}

function writeObjectAttrGroupSeparator(){
    g_ooutfile.SetFrameStyle(Constants.FRAME_LEFT, 0);
    g_ooutfile.SetFrameStyle(Constants.FRAME_RIGHT, 0);
    g_ooutfile.SetFrameStyle(Constants.FRAME_TOP, 0);
    g_ooutfile.SetFrameStyle(Constants.FRAME_BOTTOM, 0);
    g_ooutfile.TableRow();
    arcmTableCellF("", 30, "BASE_TEXT", 1, tableColumnsWidths.size());
    g_ooutfile.ResetFrameStyle();
}

/**
 * outputs list data - table header and rows
 */
function writeListData(list){
    if(list.objects.length > 0){
        if(list.showFilters) {
            writeFilters(list.filters);
        }
        if(!isExcelOutputFormat())
            updateColumnWidths(readListColumnsWidths(list.columnsHeaders));
        outputObjectsList(list);
    } else {
        writeTableTitle(getString("NONE"), "BASE_TEXT");
    }
}

/**
 * outputs chart images
 */
function writeChartData(chart){
    arcmOuptutPicture(Context.createPicture(chart.image, Constants.IMAGE_FORMAT_PNG));
    writeEmptyLine();
}

/**
 * outputs aris model image
 */
function writeArisModelData(model){
    if(model.graphic){
        arcmOuptutPicture(model.graphic);
    }
}

/**
 * outputs section title, the title will be included into TOC
 */
function outputTitle(text, level){
    if(text == null || text == '') return; // title is used within TOC - empty strings are not acceptable
    arcmTableSeparator();
    var titleIndent = 5;
    var style = extendObj(getStyleByName("HEADER"), {formatExtend: Constants.FMT_TOCENTRY0, indent: titleIndent});
    switch(level){
        case 'h2':
            style = extendObj(getStyleByName("SUBHEADER"), {formatExtend: Constants.FMT_TOCENTRY1, indent: titleIndent+1});
        break;
        case 'h3':
            style = extendObj(getStyleByName("SUBHEADER"), {formatExtend: Constants.FMT_TOCENTRY2, indent: titleIndent+3});
        break;
        case 'h4':
            style = extendObj(getStyleByName("SUBHEADER"), {formatExtend: Constants.FMT_TOCENTRY3, indent: titleIndent+6});
        break;
        case 'h5':
            style = extendObj(getStyleByName("SUBHEADER"), {formatExtend: Constants.FMT_TOCENTRY4, indent: titleIndent+9});
        break;
        case 'h6':
            style = extendObj(getStyleByName("SUBHEADER"), {formatExtend: Constants.FMT_TOCENTRY5, indent: titleIndent+12});
        break;
        case 'h7':
            style = extendObj(getStyleByName("SUBHEADER"), {formatExtend: Constants.FMT_TOCENTRY6, indent: titleIndent+15});
        break;
        case 'h8':
            style = extendObj(getStyleByName("SUBHEADER"), {formatExtend: Constants.FMT_TOCENTRY7, indent: titleIndent+18});
        break;
    };
    writeTableTitle(text, style);
    arcmTableSeparator();
}

/**
 * writes separator of different objects - to have all objects separated the same way
 */
function writeObjectSeparator(){
    if(isExcelOutputFormat()){
        writeEmptyLine();
        writeEmptyLine();
        writeEmptyLine();
    } else {
        arcmPageBreak();
    }
}

/**
 * writes objects attribute row
 */
function writeTableRow(attribute){
    arcmTableRow();
    var name = attribute.getName();
    var value = attribute.getValue();
    var headerRowSpan = 1;
    var valueColspan = 2;
    var oneValueOnOneRow = false;
    
    if(isComplexValue(value)){
        headerRowSpan = isComplexValue(value) ? value.getValues().size() : 1;
        oneValueOnOneRow = true;
    }
    var colspans = divideToColspans(defaultObjectColumnWidths);
    writeTableCell(name, 0, "BASE_TEXT_GREYBG", headerRowSpan, colspans[0]);
    writeTableCell(value, 0, "BASE_TEXT", 1, colspans[1], {oneValueOnOneRow: true});
}

/**
 * divides actual column division to colspans by specified percentual size
 */
function divideToColspans(widths){
    var colspans = [];
    var colwidths = [];
    var colCounter = 0;
    for(var width in Iterator(tableColumnsWidths)){
        var w = parseFloat(width);
        if(typeof(colwidths[colCounter]) != 'undefined' && colwidths[colCounter] + w > widths[colCounter] && colCounter < widths.length-1){
            colCounter++;
        }
        if(!colspans[colCounter]){
            colspans[colCounter] = 0;
            colwidths[colCounter] = 0;
        }
        colwidths[colCounter] += w;
        colspans[colCounter]++;
    }
    return colspans;
}

/*************************************************************************************************
                                            LISTS
*************************************************************************************************/

/**
 * writes list table header and rows to output document
 */
function outputObjectsList(objectList){
    writeListHeader(objectList);
    for (var i = 0; i < objectList.objects.length; i++) {
        arcmTableRow();
        outputListObject(objectList.objects[i]);
    }
    writeListFooter(objectList);
}

/**
 * composes table header - header is constructed from bottom to top;
 */
function createTableHeader(objectList, definition){
    var headerInfos = objectList.getHeaderInfo();
    var tableHeader = [];
    var subheaderRow = null;
    for(var level=headerInfos.size()-1; level>=0; level--){
        var headerRow = createHeaderRow(headerInfos, level, definition);
        tableHeader[level] = headerRow.cells;
        if(subheaderRow != null){
            linkSubHeader(headerRow, subheaderRow);
        }
        subheaderRow = headerRow;
    }
    return tableHeader;
}

/**
 * reads table column headers
 */
function getHeaderLeafNodes(firstHeaderRow){
    var leafNodes = [];
    if(firstHeaderRow){
        for(var i=0; i<firstHeaderRow.length; i++){
            var headerCell = firstHeaderRow[i];
            if(headerCell.children == null){
                leafNodes.push(headerCell);
            } else {
                leafNodes = leafNodes.concat(getHeaderLeafNodes(headerCell.children));
            }
        }
    }
    return leafNodes;
}

/**
 * reads widths of different list columns
 */
function readListColumnsWidths(leafNodes){
    var widths = [];
    for(var i=0; i<leafNodes.length; i++){
        var lnode = leafNodes[i];
        if(!lnode.isHidden){
            var colwidth = lnode.width / lnode.colspan;
            for(var j=0; j<lnode.colspan; j++){
                if(lnode.subCellsWidths && lnode.subCellsWidths.length == lnode.colspan){
                    widths.push(lnode.subCellsWidths[j]);
                } else {
                    widths.push(colwidth);
                }
            }
        }
    }
    normalizeColumnWidths(widths);
    return widths;
}

/**
 * writes list table header into output document
 */
function writeListHeader(list) {
    if(isExcelOutputFormat()) updateHeaderColspans(list);
    var tableHeader = list.header;
    for (var i=0; i<tableHeader.length; i++) {
        arcmTableRow();
        var heraderRow = tableHeader[i];
        for (var j=0; j<heraderRow.length; j++) {
            var headerCell = heraderRow[j];
            if(!headerCell.isHidden){
                var style = extendObj(getStyleByName("BASE_TEXT_GREYBG"), decodeHeaderCellStyle(headerCell));
                writeTableCell(headerCell["name"], headerCell["width"], style, headerCell["rowspan"], headerCell["colspan"]);
            }
        }
    }
}

function updateHeaderColspans(list){
    var colspans = divideToColspans(readListColumnsWidths(list.columnsHeaders));
    var cidx = 0;
    for(var i=0; i<list.columnsHeaders.length; i++){
        var cell = list.columnsHeaders[i];
        var cols = 0;
        for(var j=0; j<cell.colspan; j++){
            cols += colspans[cidx++];
        }
        setHeaderCellColSpan(cell, cols);
    }
}

/**
 * creates one line of headerCell objects
 */
function createHeaderRow(headerInfos, level, definition){
    var headerData = {
        cells: [],
        rowCount: 0,
        colCount: 0
    };
    var headerInfo = headerInfos.get(level).getHeaders();
    for(var i=0; i<headerInfo.size(); i++){
        var cellObj = createHeaderCellObj(headerInfo.get(i), definition);
        headerData.cells.push(cellObj);
        if(headerData.rowCount < cellObj.rowspan){
            headerData.rowCount = cellObj.rowspan;
        }
        headerData.colCount += cellObj.colspan;
    }
    return headerData;
}

/**
 * links subheader to parent header
 */
function linkSubHeader(headerRow, subheaderRow){
    subheaderRow.position = 0;
    for(var i=0; i<headerRow.cells.length; i++){
        if(headerRow.cells[i].rowspan < headerRow.rowCount || subheaderRow.colCount == headerRow.colCount){
            var cell = headerRow.cells[i];
            var subheader = getSubheader(subheaderRow, cell.colspan);
            cell.children = subheader.cells;
            cell.colspan = subheader.colCount;
            cell.isHidden = subheader.isHidden;
            for(var j=0; j<subheader.cells.length; j++){
                subheader.cells[j].parent = cell;
            }
        }
    }
}

/**
 * returns requested amount of subheader columns
 */
function getSubheader(subheaderRow, requestedColAmount){
    var subheader = {
        cells: [],
        colCount: 0,
        isHidden: true
    };
    for(; subheaderRow.position<subheaderRow.cells.length; subheaderRow.position++){
        if(subheader.colCount < requestedColAmount){
            var subCell = subheaderRow.cells[subheaderRow.position];
            subheader.cells.push(subCell);
            if(!subCell.isHidden){
                subheader.colCount += subCell.colspan;
                subheader.isHidden = false;
            }
        } else {
            break;
        }
    }
    return subheader;
}

/**
 * creates headerCell object
 */
function createHeaderCellObj(headerCellData, definition){
    var params = headerCellData.getParameters();
    var width = params.get("width") == null ? 0 : parseFloat(params.get("width").replace("%", ""));
    var headerObj = {
        'width': width,// * (isExcelOutputFormat() ? 1.3 : 1),
        'params': params,
        'colspan': parseInt(params.get("colspan"), 10),
        'rowspan': parseInt(params.get("rowspan"), 10),
        'name': params.get("name"),
        'isHidden': isHidden(params, definition),
        'showText': showEnumsText(params, definition),
        'isIconVisible': _isIconVisible(definition, String(params.get("attributeId"))),
        'subCellsWidths': null,
        'parent': null,
        'children': null
    };
    return headerObj;
}

/**
 * checks if selected cell shoud be hidden
 */
function isHidden(cellParams, definition){
    var attributeId = String(cellParams.get("attributeId"));
    var isCellHidden = definition.selectedColumns != null && attributeId != 'null' && definition.selectedColumns.indexOf(attributeId) < 0;
    if(definition.excludedColumns != null && attributeId != 'null' && definition.excludedColumns.indexOf(attributeId) >= 0){
        isCellHidden = true;
    }
    return isCellHidden;
}

/**
 * check if enum text should be allowed
 */
function showEnumsText(cellParams, definition){
    var attributeId = String(cellParams.get("attributeId"));
    var showText = definition.showEIName != null && attributeId != 'null' && definition.showEIName.indexOf(attributeId) >= 0;
    return showText;
}


/**
 * normalizes column widths to 100%
 */
function normalizeColumnWidths(widths){
    var total = widths.reduce(function(a, b) { return a + b; }, 0);
    for(var i=0; i<widths.length; i++){
        widths[i] = widths[i]*100/total;
    }
    return widths;
}

/**
 * writes onle table row
 */
function outputListObject(listObject) {
    for (var i = 0; i < listObject.attributes.length; i++) {
        var value = listObject.attributes[i].value;
        var headerCell = listObject.attributes[i].headerCell;
        var style = decodeHeaderCellStyle(headerCell, true);
        var colspan = headerCell.colspan / headerCell.valueColumnsCnt;
        var treeLevel = value.getStyleValue("treeLevel");
        if(treeLevel != null){
            var orgSpaces;
            g_ooutfile.SetFrameStyle(Constants.FRAME_RIGHT, 0);
            for(var j=0; j<treeLevel-1; j++){
                writeTableCell("", 0, style, 1, 1);
                if(j == 0){
                    orgSpaces = arcmCleanCellSpacing();
                    g_ooutfile.SetFrameStyle(Constants.FRAME_LEFT, 0);
                }
            }
            colspan -= treeLevel - 1;
            g_ooutfile.ResetFrameStyle();
            if(orgSpaces) arcmSetCellSpacing(orgSpaces);
        }
        writeTableCell(value, 0, style, 1, colspan, {hideLeftBorder: headerCell.colspan > colspan, minimizeSpaces: treeLevel != null,writeText:headerCell.showText});
    }
}

function decodeHeaderCellStyle(headerCell, forColumn){
    var style = {};
    if(forColumn){
        style['format'] = _processAlign(0, headerCell.params.get("horizontalAlignmentColumn"), headerCell.params.get("verticalAlignmentColumn"));
    } else {
        style['format'] = _processAlign(0, headerCell.params.get("horizontalAlignment"), headerCell.params.get("verticalAlignment"));
        if(headerCell.params.get("backgroundColor")){
            style['bgColor'] = createRgbColorFromHexString(headerCell.params.get("backgroundColor"));
        }
        if(headerCell.params.get("fontColor")){
            style['fontColor'] = createRgbColorFromHexString(headerCell.params.get("fontColor"));
        }
    }
    
    return style;
}

function _processAlign(format, horizontalAlign, verticalAlign){
    switch(String(horizontalAlign)){
        case 'left': format |= Constants.FMT_LEFT; break;
        case 'right': format |= Constants.FMT_RIGHT; break;
        case 'center': format |= Constants.FMT_CENTER; break;
    }
    switch(String(verticalAlign)){
        case 'top': format |= Constants.FMT_VTOP; break;
        case 'middle': format |= Constants.FMT_VCENTER; break;
        case 'bottom': format |= Constants.FMT_VBOTTOM; break;
    }
    return format;
}

function writeListFooter(objectList){
    arcmTableRow();
    var colspans = divideToColspans([100]);
    writeTableCell(getString("TOTAL_ENTRIES")+" "+objectList.objects.length, 0, extendObj(getStyleByName("BASE_TEXT_GREYBG"), {'format': Constants.FMT_RIGHT}), 1, colspans[0]);
}

function arcmCleanCellSpacing(){
    if(isExcelOutputFormat()) return null;
    var spaces = {
        top: g_ooutfile.getCellSpacingTop(),
        bottom: g_ooutfile.getCellSpacingBottom(),
        left: g_ooutfile.getCellSpacingLeft(),
        right: g_ooutfile.getCellSpacingRight()
    };
    g_ooutfile.setCellSpacing(spaces.top, spaces.bottom, 1, 1);
    return spaces;
}

function arcmSetCellSpacing(spaces){
    if(isExcelOutputFormat()) return;
    g_ooutfile.setCellSpacing(spaces.top, spaces.bottom, spaces.left, spaces.right);
}

/**
 * writes user info into report
 */
function writeUserData(userInfo){
    var widths = [35, 65];
    pdfTableWidthCorectionColumnIdx = 0;
    updateColumnWidths(widths, true);
    arcmTableRow();
    var division = divideToColspans(widths);
    writeTableCell(getString("USER"), widths[0], "BASE_TEXT_GREYBG", 1, division[0]);
    writeTableCell(userInfo.getName(), widths[1], "BASE_TEXT", 1, division[1]);
    arcmTableRow();
    writeTableCell(getString("DATE"), widths[0], "BASE_TEXT_GREYBG", 1, division[0]);
    var date = new Date();
    writeTableCell(userInfo.getReportCreationDateAsString(), widths[1], "BASE_TEXT", 1, division[1]);
}

/**
 * writes filter settings into report
 */
function writeFilters(filters){
    writeTableTitle(getString("FILTER_SETTINGS"), "SUBHEADER");
    var startNewRow = false;
    var filterWidths = [25,25,25,25];
    pdfTableWidthCorectionColumnIdx = 0;
    if(!isExcelOutputFormat()) updateColumnWidths(filterWidths);
    var division = divideToColspans(filterWidths);
    if(division.length < 4){
        division = [1, division.length - 1]
    }
    var divisionIdxCorection = 0;
    for(var filter in Iterator(filters.entrySet())){
        if(startNewRow = !startNewRow || division.length < 4){
            arcmTableRow();
            divisionIdxCorection = 0;
        } else {
            divisionIdxCorection = 2;
        }
        writeTableCell(filter.getKey(), null, "BASE_TEXT_GREYBG", 1, division[0+divisionIdxCorection]);
        writeTableCell(filter.getValue(), null, "BASE_TEXT", 1, division[1+divisionIdxCorection]);
    }
    if(!isExcelOutputFormat()){
        arcmTableSeparator();
    }
}

function writeTableOfContent(disablePageBreak){
    if(!isExcelOutputFormat()){ // TOC is not working properly within excel
        writeTableTitle(getString("TABLE_OF_CONTENTS"), "HEADER");
        writeEmptyLine(2);
        arcmEndTable();
		
		var TOCstyle = getStyleByName("BASE_TEXT");
		var lineSpacing = 1.2;
		g_ooutfile.SetTOCFormat(0, TOCstyle.font, TOCstyle.fontSize, TOCstyle.fontColor, TOCstyle.bgColor, TOCstyle.format, 0, 0, 0, 0, 0, lineSpacing);
		g_ooutfile.SetTOCFormat(1, TOCstyle.font, TOCstyle.fontSize, TOCstyle.fontColor, TOCstyle.bgColor, TOCstyle.format, 3, 0, 0, 0, 0, lineSpacing);
		g_ooutfile.SetTOCFormat(2, TOCstyle.font, TOCstyle.fontSize, TOCstyle.fontColor, TOCstyle.bgColor, TOCstyle.format, 6, 0, 0, 0, 0, lineSpacing);
		g_ooutfile.SetTOCFormat(3, TOCstyle.font, TOCstyle.fontSize, TOCstyle.fontColor, TOCstyle.bgColor, TOCstyle.format, 9, 0, 0, 0, 0, lineSpacing);
		g_ooutfile.SetTOCFormat(4, TOCstyle.font, TOCstyle.fontSize, TOCstyle.fontColor, TOCstyle.bgColor, TOCstyle.format, 12, 0, 0, 0, 0, lineSpacing);
		g_ooutfile.SetTOCFormat(5, TOCstyle.font, TOCstyle.fontSize, TOCstyle.fontColor, TOCstyle.bgColor, TOCstyle.format, 15, 0, 0, 0, 0, lineSpacing);
		g_ooutfile.SetTOCFormat(6, TOCstyle.font, TOCstyle.fontSize, TOCstyle.fontColor, TOCstyle.bgColor, TOCstyle.format, 18, 0, 0, 0, 0, lineSpacing);
				
        g_ooutfile.OutputField(Constants.FIELD_TOC, getString("ID_DEFAULT_FONT"), 10, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_CENTER);
        arcmStartTable();
        if(!disablePageBreak){
            writeObjectSeparator();
        }
    }
}


/*************************************************************************************************
                                             LOG
      used to highlight attribute differences in different object version in log reports
*************************************************************************************************/

/**
 * highligths value using background color (usable for base and complex value)
 */
var valueHighlighter = {
    _defaultHighlightColorHex: "#DBDBDB",
    
	highlightValue: function(value) {
        this.highlightValueToHexColor(value, this._defaultHighlightColorHex);
	},
    
    highlightValueToHexColor: function(value, color) {
        if (isBaseValue(value)) {
			value.addAStyleValue("bgColor", color);
		} else if (isComplexValue(value)) {
			for (var i = 0; i < value.getValues().size(); i++) {
				this.highlightValue(value.getValues().get(i));
			}
		}
    }
}

/**
 * used to compare two attributes and to find changes in two versions of the same attribute
 */
var attributeComparator = {
	_excludedAttributes: [
	    "version_number",
		"change_date",
		"aris_change_date",
		"change_type"],
    
	hasAttributeChanged: function(attributeId, newAttribute, oldAttribute) {
        var changed = false;
        if (!this._attributeIsExcluded(attributeId)) {
			var newValue = newAttribute != null ? newAttribute.getValue() : "";
			var oldValue = oldAttribute != null ? oldAttribute.getValue() : "";
            var changed = this._compareValues(newValue, oldValue);
        }
        return changed;
	},
    
	_compareValues: function(newValue, oldValue) {
		return (valueToString(newValue) != valueToString(oldValue));
	},
    
	_attributeIsExcluded: function(attributeId) {
		return (this._excludedAttributes.indexOf(String(attributeId)) >= 0);
	}
}
