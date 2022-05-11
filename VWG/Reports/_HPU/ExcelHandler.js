function ExcelHandler() {
    this.excel = null;
}

ExcelHandler.prototype.init = function(file) {
    this.excel = Context.createExcelWorkbook(file);
};

ExcelHandler.prototype.createSheet = function(sheetName) {
    return this.excel.createSheet(sheetName);
};

ExcelHandler.prototype.createFont = function(fontName, fontHeight, fontColor, isBold, isItalic, isUnderLine, isStrikeout, typeOffset) {
    return this.excel.getFont(fontName,fontHeight,fontColor,isBold,isItalic,isUnderLine,isStrikeout,typeOffset);
};
//  ( XlsFont p_Font, short p_TopBorder, short p_RightBorder, short p_BottomBorder, short p_LeftBorder, int p_TopBorderColor, int p_RightBorderColor, int p_BottomBorderColor, int p_LeftBorderColor,
//  short p_HorizontalAlignment, short p_VerticalAlignment, int p_BackgroundColor, int p_ForegroundColor, short p_FillPattern, short p_dataFormat, boolean p_bHidden, short p_indent, boolean p_bLocked, short p_rotation, boolean p_bWrapText )

ExcelHandler.prototype.createStyle = function(font,
                                              topBorder,rightBorder,bottomBorder,leftBorder,
                                              topBorderColor,rightBorderColor,bottomBorderColor,leftBorderColor,
                                              horizontalAlignment,verticalAlignment,
                                              backgroundColor,foregroundColor,
                                              fillPattern,
                                              dataFormat,
                                              hiddent,indent,blocked,rotation,textWrap) {
    return this.excel.createCellStyle(font,
        topBorder,rightBorder,bottomBorder,leftBorder,
        topBorderColor,rightBorderColor,bottomBorderColor,leftBorderColor,
        horizontalAlignment,verticalAlignment,
        backgroundColor,foregroundColor,
        fillPattern,
        dataFormat,
        hiddent,indent,blocked,rotation,textWrap)

};



ExcelHandler.prototype.getExcelFile = function() {
    return this.excel;
};