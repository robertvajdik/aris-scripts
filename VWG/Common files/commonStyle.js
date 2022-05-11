/**
 * Copyright (C) 2020 Software AG, Darmstadt, Germany and/or Software AG USA Inc., Reston, VA, USA,
 * and/or its subsidiaries and/or its affiliates and/or their licensors.
 *
 * Use, reproduction, transfer, publication or disclosure is prohibited
 * except as specifically provided for in your License Agreement with Software AG.
 *
 * Version: 10.0.12.0.1470486
 */

/**
 * Utilities for a common style of report output.
 *
 * Those are colors and format templates as well as functions creating
 * parts of the report, like a table of contents, headers or footers.
 */

const FONT_SIZE = 11;
const FONT_SIZE_TBL_HEAD = FONT_SIZE*.8;
const FONT_SIZE_TBL_S = FONT_SIZE*.9;

// Colors
const COL_HEADING      = getColorByRGB(  8, 153, 204);
const COL_TBL_BORDER   = getColorByRGB(204, 204, 203);
const COL_TBL_HEAD_TXT = getColorByRGB(152, 152, 152);
const COL_TXT_LIGHT    = getColorByRGB(152, 152, 152);

// Misc
const MAX_TBL_INDENT = 9; // Maximum table indent

/**
 * Define format templates and set table borders.
 *
 * @param {object} p_oOut  Output object.
 * @param (string} p_sFont Font name
 */
function initStyles(p_oOut, p_sFont) {
    // Body text
    p_oOut.DefineF("STD", p_sFont, FONT_SIZE, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_JUSTIFY, 0, 0, 0, 2, 0, 1.1);
    // Headings
    p_oOut.DefineF("HEADING1", p_sFont, FONT_SIZE*1.33, COL_HEADING, Constants.C_TRANSPARENT, Constants.FMT_LEFT | Constants.FMT_BOLD | Constants.FMT_TOCENTRY0, 0, 0, 8, 4, 0, 1.1);
    p_oOut.DefineF("HEADING1_NOTOC", p_sFont, FONT_SIZE*1.33, COL_HEADING, Constants.C_TRANSPARENT, Constants.FMT_LEFT | Constants.FMT_BOLD, 0, 0, 8, 4, 0, 1.1);
    p_oOut.DefineF("HEADING2", p_sFont, FONT_SIZE*1.17, COL_HEADING, Constants.C_TRANSPARENT, Constants.FMT_LEFT | Constants.FMT_BOLD | Constants.FMT_TOCENTRY1, 0, 0, 6, 4, 0, 1.1);
    p_oOut.DefineF("HEADING3", p_sFont, FONT_SIZE*1.08, COL_HEADING, Constants.C_TRANSPARENT, Constants.FMT_LEFT | Constants.FMT_BOLD | Constants.FMT_TOCENTRY2, 0, 0, 4, 2, 0, 1.1);
    p_oOut.DefineF("MINISEC", p_sFont, FONT_SIZE, COL_HEADING, Constants.C_TRANSPARENT, Constants.FMT_LEFT | Constants.FMT_BOLD, 0, 0, 4, 2, 0, 1.1); // Small section with no TOC entry
    // Tables
    p_oOut.DefineF("TBL_STD", p_sFont, FONT_SIZE, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_LEFT | Constants.FMT_VTOP, 0, 0, 2, 2, 0, 1.1);
    p_oOut.DefineF("TBL_STD_COL", p_sFont, FONT_SIZE, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_LEFT | Constants.FMT_VTOP, 0, 0, 2, 2, 0, 1.1); // For colored rows in striped tables
    p_oOut.DefineF("TBL_STD_S", p_sFont, FONT_SIZE_TBL_S, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_LEFT | Constants.FMT_VTOP, 0, 0, 2, 2, 0, 1.1); // Smaller font size
    p_oOut.DefineF("TBL_STD_S_COL", p_sFont, FONT_SIZE_TBL_S, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_LEFT | Constants.FMT_VTOP, 0, 0, 2, 2, 0, 1.1); // Smaller font size. For colored rows in striped tables
    p_oOut.DefineF("TBL_LIGHT", p_sFont, FONT_SIZE, COL_TXT_LIGHT, Constants.C_TRANSPARENT, Constants.FMT_LEFT | Constants.FMT_VTOP, 0, 0, 2, 2, 0, 1.1); // Light text color
    p_oOut.DefineF("TBL_LIGHT_COL", p_sFont, FONT_SIZE, COL_TXT_LIGHT, Constants.C_TRANSPARENT, Constants.FMT_LEFT | Constants.FMT_VTOP, 0, 0, 2, 2, 0, 1.1); // Light text color. For colored rows in striped tables
    p_oOut.DefineF("TBL_HEAD", p_sFont, FONT_SIZE_TBL_HEAD, COL_TBL_HEAD_TXT, Constants.C_TRANSPARENT, Constants.FMT_LEFT | Constants.FMT_VBOTTOM, 0, 0, 0, 1, 0, 1.1); // Table head
    for (var i=0; i<=MAX_TBL_INDENT; i++) {
        p_oOut.DefineF("TBL_STD_INDENT"+i, p_sFont, FONT_SIZE, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_LEFT | Constants.FMT_VTOP, i*3, 0, 2, 2, 0, 1.1); // For cells with indented text.
        p_oOut.DefineF("TBL_STD_COL_INDENT"+i, p_sFont, FONT_SIZE, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_LEFT | Constants.FMT_VTOP, i*3, 0, 2, 2, 0, 1.1); // For cells with indented text. For colored rows in striped tables.
    }
    // Table of contents
    p_oOut.SetTOCFormat(0, p_sFont, FONT_SIZE, Constants.C_BLACK, Constants.C_WHITE, Constants.FMT_LEFT, 0, 0, 0, 1, 0, 1.1);
    p_oOut.SetTOCFormat(1, p_sFont, FONT_SIZE, Constants.C_BLACK, Constants.C_WHITE, Constants.FMT_LEFT, 5, 0, 0, 1, 0, 1.1);
    p_oOut.SetTOCFormat(2, p_sFont, FONT_SIZE, Constants.C_BLACK, Constants.C_WHITE, Constants.FMT_LEFT, 10, 0, 0, 1, 0, 1.1);
    p_oOut.SetTOCFormat(3, p_sFont, FONT_SIZE, Constants.C_BLACK, Constants.C_WHITE, Constants.FMT_LEFT, 15, 0, 0, 1, 0, 1.1);
    // Other
    p_oOut.DefineF("HIER_TREE", p_sFont, FONT_SIZE, COL_TXT_LIGHT, Constants.C_TRANSPARENT, Constants.FMT_JUSTIFY, 0, 0, 0, 2, 0, 1.1);
    // Table borders
    setTableBorders(p_oOut);
}

/**
 * Set table borders.
 *
 * @param {object} p_oOut Output object.
 */
function setTableBorders(p_oOut) {
    p_oOut.SetFrameStyle(Constants.FRAME_TOP, 1);
    p_oOut.SetFrameStyle(Constants.FRAME_BOTTOM, 1);
    p_oOut.SetFrameStyle(Constants.FRAME_LEFT, 0);
    p_oOut.SetFrameStyle(Constants.FRAME_RIGHT, 0);
}

/**
 * Disable table borders.
 *
 * @param {object} p_oOut Output object.
 */
function disableTableBorders(p_oOut) {
    p_oOut.SetFrameStyle(Constants.FRAME_TOP, 0);
    p_oOut.SetFrameStyle(Constants.FRAME_BOTTOM, 0);
    p_oOut.SetFrameStyle(Constants.FRAME_LEFT, 0);
    p_oOut.SetFrameStyle(Constants.FRAME_RIGHT, 0);
}

/**
 * Create the header and footer.
 *
 * initStyles() has to be called before this function can be used.
 *
 * @param {object} p_oOut               Output object.
 * @param {string} [p_sTextFooterRight] Text to be displayed on the right side of the footer.
 */
function outHeaderFooter(p_oOut, p_sFont, p_sTextFooterRight) {
    if (p_sTextFooterRight == null) p_sTextFooterRight = "";
    // Header
    p_oOut.BeginHeader();
    p_oOut.BeginTable(100, Constants.C_TRANSPARENT, Constants.C_TRANSPARENT, Constants.FMT_LEFT, 0);
    p_oOut.TableRow();
    p_oOut.TableCellF("", 50, "TBL_STD");
    p_oOut.OutGraphic(Context.createPicture(Constants.IMAGE_LOGO_LEFT), -1, 40, 15);
    p_oOut.EndTable("", 100, p_sFont, FONT_SIZE, Constants.C_BLACK, Constants.C_TRANSPARENT, 0, Constants.FMT_CENTER, 0);
    p_oOut.EndHeader();
    // Footer
    p_oOut.BeginFooter();
    p_oOut.BeginTable(100, Constants.C_TRANSPARENT, Constants.C_TRANSPARENT, Constants.FMT_LEFT, 0);
    p_oOut.TableRow();
    p_oOut.TableCellF("", 50, "TBL_STD");
    p_oOut.OutputField(Constants.FIELD_PAGE, p_sFont, FONT_SIZE, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_LEFT);
    p_oOut.TableCell(p_sTextFooterRight, 50, p_sFont, FONT_SIZE, COL_TXT_LIGHT, Constants.C_TRANSPARENT, 0, Constants.FMT_RIGHT, 0);
    p_oOut.EndTable("", 100, p_sFont, FONT_SIZE, Constants.C_BLACK, Constants.C_TRANSPARENT, 0, Constants.FMT_CENTER, 0);
    p_oOut.EndFooter();
}

/**
 * Create the title page.
 *
 * @param p_oOut              {object} Output object.
 * @param p_sTitle            {string} Title of the report.
 * @param [p_sDate]           {string} Label for showing the date on the title page.
 * @param [p_aDetails]        {array}  Further details shown like the date. This has to be an array of label/value pairs.
 * @param [p_sLabelTitlePage] {string} Label of the title page tab in spreadsheet output.
 */
function outTitlePage(p_oOut, p_sFont, p_sTitle, p_sDate, p_aDetails, p_sLabelTitlePage) {
    // The title page does not work with these formats, so don't generate it.
    if (Context.getSelectedFormat() == Constants.OutputXLS ||
        Context.getSelectedFormat() == Constants.OutputHTML) return;

    p_oOut.BeginSection(false, Constants.SECTION_COVER);

    var nHeightUpperPart = Math.round(p_oOut.getPageHeight()/1.618);
    var nHeightLowerPart = p_oOut.getPageHeight() - nHeightUpperPart;

    p_oOut.BeginTable(100, [new java.lang.Double(100), new java.lang.Double(0)], Constants.C_TRANSPARENT, Constants.C_TRANSPARENT, Constants.FMT_LEFT, 0);
    // Logo
    p_oOut.TableRow();
    p_oOut.DefineF("TITLE_LOGO", p_sFont, FONT_SIZE, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_LEFT, 0, 0, 0, 0, 0, 1.1);
    p_oOut.TableCellF("", 1, 1, "TITLE_LOGO");
    p_oOut.OutGraphic(Context.createPicture(Constants.IMAGE_LOGO_LEFT), -1, 70, 70);
    p_oOut.TableCell("", 1, 1, p_sFont, FONT_SIZE, Constants.C_BLACK, Constants.C_TRANSPARENT, 0, Constants.FMT_LEFT | Constants.FMT_VTOP, 0);
    var oRule = Context.createPicture();
    var nRuleHeight = Math.round((nHeightUpperPart - p_oOut.getTopMargin())/2) - 2; // Without the small reduction the cells get too tall
    oRule.FillRect(0, 0, 0, nRuleHeight, Constants.C_TRANSPARENT);
    p_oOut.OutGraphic(oRule, -1, 0, nRuleHeight);
    // Title
    p_oOut.TableRow();
    p_oOut.DefineF("TITLE", p_sFont, FONT_SIZE*3, COL_HEADING, Constants.C_TRANSPARENT, Constants.FMT_LEFT | Constants.FMT_BOLD | Constants.FMT_VBOTTOM, 0, 0, 0, 5, 0, 1.1);
    p_oOut.TableCellF(p_sTitle, 1, 1, "TITLE");
    p_oOut.TableCell("", 1, 1, p_sFont, FONT_SIZE, Constants.C_BLACK, Constants.C_TRANSPARENT, 0, Constants.FMT_LEFT | Constants.FMT_VBOTTOM, 0);
    p_oOut.OutGraphic(oRule, -1, 0, (nHeightUpperPart - p_oOut.getTopMargin())/2);
    // Details
    p_oOut.TableRow();
    var nColorTitleDetails = Constants.C_WHITE;
    // The background created with OutGraphicAbsolute() is not shown in spreadsheet output, so we use a text color that works on white background.
    if (isSpreadsheet()) nColorTitleDetails = Constants.C_BLACK;
    p_oOut.DefineF("TITLE_DETAILS_FIRST_LINE", p_sFont, FONT_SIZE, nColorTitleDetails, Constants.C_TRANSPARENT, Constants.FMT_LEFT | Constants.FMT_VTOP, 0, 0, 5, 1, 0, 1.1);
    p_oOut.DefineF("TITLE_DETAILS", p_sFont, FONT_SIZE, nColorTitleDetails, Constants.C_TRANSPARENT, Constants.FMT_LEFT | Constants.FMT_VTOP, 0, 0, 0, 1, 0, 1.1);
    p_oOut.TableCellF("", 1, 1, "TITLE_DETAILS_FIRST_LINE");
    if (isSpreadsheet()) p_oOut.OutputLnF("", "TITLE_DETAILS_FIRST_LINE"); // Add some space between the title and the details in spreadsheet output.
    if (p_sDate != null) {
        p_oOut.OutputF(p_sDate + " ", "TITLE_DETAILS_FIRST_LINE");
        p_oOut.OutputField(Constants.FIELD_DATE, p_sFont, FONT_SIZE, nColorTitleDetails, Constants.C_TRANSPARENT, Constants.FMT_LEFT);
        p_oOut.OutputLnF("", "TITLE_DETAILS_FIRST_LINE");
    }
    if (p_aDetails != null) {
        for (var i=0; i<p_aDetails.length; i++) {
            p_oOut.OutputLnF(p_aDetails[i][0] + " " + p_aDetails[i][1], "TITLE_DETAILS");
        }
    }
    p_oOut.TableCell("", 1, 1, p_sFont, FONT_SIZE, Constants.C_BLACK, Constants.C_TRANSPARENT, 0, Constants.FMT_LEFT, 0);
    p_oOut.EndTable((p_sLabelTitlePage != null && isSpreadsheet()) ? p_sLabelTitlePage : "", 100, p_sFont, FONT_SIZE, Constants.C_BLACK, Constants.C_TRANSPARENT, 0, Constants.FMT_CENTER, 0);

    var oBackground = Context.createPicture();
    var nSizeMultiplier = 1000;
    // Making the rectangle very large minimizes the empty areas generated by OutGraphicAbsolute to the right and at the bottom
    oBackground.FillRect(0, 0, p_oOut.getPageWidth()*nSizeMultiplier, nHeightLowerPart*nSizeMultiplier, COL_HEADING);
    // Add a little bit of height and width to push the empty areas out of the page
    p_oOut.OutGraphicAbsolute(oBackground, 0, nHeightUpperPart, p_oOut.getPageWidth() + 5, nHeightLowerPart + 5, true);

    p_oOut.EndSection();
}

/**
 * Check if the output is a spreadsheet.
 *
 * @return {boolean} True if the output is a spreadsheet, false otherwise.
 */
function isSpreadsheet() {
	if (Context.getSelectedFormat()==Constants.OutputXLS) return true;
	if (Context.getSelectedFormat()==Constants.OutputXLSX) return true;
	return false;
}

/**
 * Get the table cell style for a certain indentation level and odd/even row.
 *
 * Example return value: TBL_STD_COL_INDENT2
 *
 * @param {integer} p_nLevel Indentation level.
 * @param {boolean} p_bColored True if the style is for a colored row in a striped table or false otherwise.
 * 
 * @return {string} Name of style.
 */
function getStyleTableIndent(p_nLevel, p_bColored) {
    if (p_nLevel > MAX_TBL_INDENT) p_nLevel = MAX_TBL_INDENT;
    return "TBL_STD".concat((p_bColored) ? "_COL" : "").concat("_INDENT").concat(p_nLevel);
}

/**
 * Get the colored or uncolored version of a style.
 *
 * @param {string}  p_sBaseStyle Name of the base style.
 * @param {boolean} p_bColored   True if the style is for a colored row in a striped table or false otherwise.
 *
 * @return {string} Name of style.
 */
function getStyleColored(p_sBaseStyle, p_bColored) {
    return p_sBaseStyle.concat((p_bColored) ? "_COL" : "");
}

/**
 * Convert the integers in an array to doubles.
 *
 * This is helpful for crosstab tables where the BeginTable() function expects an array of doubles.
 *
 * @param {array}  p_anArray Array of integers.
 *
 * @return {array} Array with the same values as the input array but converted to doubles.
 */
function convertToDoubles(p_anArray) {
    for (var i=0; i<p_anArray.length; i++) {
        p_anArray[i] = new java.lang.Double(p_anArray[i]);
    }
    return p_anArray;
}
