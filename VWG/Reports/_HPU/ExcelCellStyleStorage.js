function ExcelCellStyleStorage(excel)
{
    this.excel = excel;
    this.headerStyle = null;
    this.grayStyle = null;
    this.redStyle = null;
    this.redNumericStyle = null;
    this.centeredStyle = null;
    this.normalStyle = null;
    this.yellowNumericStyle = null;
    this.yellowStyle = null;
    this.operatorStyle =  null;
    this.normalNumericStyle = null;
    this.lightGrayStyle = null;
    this.lightRedNumericStyle = null;
    this.lightRedStyle = null;
    this.nameStyle = null;

    this.headerFont = null;
    this.blackBoldFont = null;
    this.normalFont = null;
    this.boldFont = null;
    this.whiteBoldFont = null;
    this.operatorFont = null;
    this.nameFont = null;
    this.colorCreator  = new ColorCreator();
}

ExcelCellStyleStorage.prototype.createHeaderStyle = function() {

    var backgroundColor = this.colorCreator.createBackgroundColor(64,64,64);
    var fontColor = this.colorCreator.createBackgroundColor(255,255,255);
    this.headerFont = this.excel.createFont("Segoe UI",12,fontColor,true,false,false,false,0);
    this.headerStyle = this.excel.createStyle(this.headerFont,
        Constants.BORDER_THIN, Constants.BORDER_THIN, Constants.BORDER_THIN, Constants.BORDER_THIN,
        Constants.C_GRAY, Constants.C_GRAY, Constants.C_GRAY, Constants.C_GRAY,
        Constants.ALIGN_LEFT,
        Constants.ALIGN_LEFT,
        Constants.C_BLACK, backgroundColor, Constants.SOLID_FOREGROUND, Constants.XL_CELL_DATAFORMAT_TEXT,
        false, 0, false, 0, true);
};

ExcelCellStyleStorage.prototype.createGrayStyle = function () {

    var backgroundColor = this.colorCreator.createBackgroundColor(128,128,128);
    this.grayStyle = this.excel.createStyle(this.headerFont,
        Constants.BORDER_THIN, Constants.BORDER_THIN, Constants.BORDER_THIN, Constants.BORDER_THIN,
        Constants.C_GRAY, Constants.C_GRAY, Constants.C_GRAY, Constants.C_GRAY,
        Constants.ALIGN_LEFT,
        Constants.ALIGN_LEFT,
        Constants.C_BLACK, backgroundColor, Constants.SOLID_FOREGROUND, Constants.XL_CELL_DATAFORMAT_TEXT,
        false, 0, false, 0, false);
};

ExcelCellStyleStorage.prototype.createRedStyle = function () {

    var background = this.colorCreator.createBackgroundColor(255,128,128);
    var fontColor = this.colorCreator.createBackgroundColor(0,0,0);
    this.blackBoldFont = this.excel.createFont("Segoe UI",12,fontColor,true,false,false,false,0);
    this.redStyle = this.excel.createStyle(this.blackBoldFont,
        Constants.BORDER_THIN, Constants.BORDER_THIN, Constants.BORDER_THIN, Constants.BORDER_THIN,
        Constants.C_GRAY, Constants.C_GRAY, Constants.C_GRAY, Constants.C_GRAY,
        Constants.ALIGN_LEFT,
        Constants.ALIGN_LEFT,
        Constants.C_BLACK, background, Constants.SOLID_FOREGROUND, Constants.XL_CELL_DATAFORMAT_TEXT,
        false, 0, false, 0, false);
};

ExcelCellStyleStorage.prototype.createRedNumericStyle = function () {
    var background = this.colorCreator.createBackgroundColor(255,128,128);
    var fontColor = this.colorCreator.createBackgroundColor(0,0,0);
    this.blackBoldFont = this.excel.createFont("Segoe UI",12,fontColor,true,false,false,false,0);
    this.redNumericStyle = this.excel.createStyle(this.blackBoldFont,
        Constants.BORDER_THIN, Constants.BORDER_THIN, Constants.BORDER_THIN, Constants.BORDER_THIN,
        Constants.C_GRAY, Constants.C_GRAY, Constants.C_GRAY, Constants.C_GRAY,
        Constants.ALIGN_RIGHT,
        Constants.ALIGN_LEFT,
        Constants.C_BLACK, background, Constants.SOLID_FOREGROUND, Constants.XL_CELL_DATAFORMAT_2DIG,
        false, 0, false, 0, false);
};

ExcelCellStyleStorage.prototype.createCenteredStyle = function() {

    var fontColor = this.colorCreator.createBackgroundColor(0,0,0);
    this.boldFont = this.excel.createFont("Segoe UI",10,fontColor,true,false,false,false,0);
    this.centeredStyle = this.excel.createStyle(this.boldFont,
        Constants.BORDER_THIN, Constants.BORDER_THIN, Constants.BORDER_THIN, Constants.BORDER_THIN,
        Constants.C_GRAY, Constants.C_GRAY, Constants.C_GRAY, Constants.C_GRAY,
        Constants.ALIGN_CENTER,
        Constants.ALIGN_LEFT,
        Constants.C_BLACK, Constants.C_WHITE, Constants.NO_FILL, Constants.XL_CELL_DATAFORMAT_TEXT,
        false, 0, false, 0, false);
};

ExcelCellStyleStorage.prototype.createNormalStyle = function() {

    var fontColor = this.colorCreator.createBackgroundColor(0,0,0);
    this.normalFont = this.excel.createFont("Segoe UI",10,fontColor,false,false,false,false,0);
    this.normalStyle = this.excel.createStyle(this.normalFont,
        Constants.BORDER_THIN, Constants.BORDER_THIN, Constants.BORDER_THIN, Constants.BORDER_THIN,
        Constants.C_GRAY, Constants.C_GRAY, Constants.C_GRAY, Constants.C_GRAY,
        Constants.ALIGN_LEFT,
        Constants.ALIGN_LEFT,
        Constants.C_BLACK, Constants.C_WHITE, Constants.NO_FILL, Constants.XL_CELL_DATAFORMAT_TEXT,
        false, 0, false, 0, false);
};

ExcelCellStyleStorage.prototype.createYellowNumericStyle = function(){
    var fontColor = this.colorCreator.createBackgroundColor(0,0,0);
    this.normalFont = this.excel.createFont("Segoe UI",10,fontColor,false,false,false,false,0);
    this.yellowNumericStyle = this.excel.createStyle(this.normalFont,
        Constants.BORDER_THIN, Constants.BORDER_THIN, Constants.BORDER_THIN, Constants.BORDER_THIN,
        Constants.C_GRAY, Constants.C_GRAY, Constants.C_GRAY, Constants.C_GRAY,
        Constants.ALIGN_RIGHT,
        Constants.ALIGN_LEFT,
        Constants.C_BLACK, Constants.C_YELLOW, Constants.SOLID_FOREGROUND, Constants.XL_CELL_DATAFORMAT_2DIG,
        false, 0, false, 0, false);
};

ExcelCellStyleStorage.prototype.createYellowStyle = function(){
    var fontColor = this.colorCreator.createBackgroundColor(0,0,0);
    this.normalFont = this.excel.createFont("Segoe UI",10,fontColor,false,false,false,false,0);
    this.yellowStyle = this.excel.createStyle(this.normalFont,
        Constants.BORDER_THIN, Constants.BORDER_THIN, Constants.BORDER_THIN, Constants.BORDER_THIN,
        Constants.C_GRAY, Constants.C_GRAY, Constants.C_GRAY, Constants.C_GRAY,
        Constants.ALIGN_RIGHT,
        Constants.ALIGN_LEFT,
        Constants.C_BLACK, Constants.C_YELLOW, Constants.SOLID_FOREGROUND, Constants.XL_CELL_DATAFORMAT_TEXT,
        false, 0, false, 0, false);
};

ExcelCellStyleStorage.prototype.createOperatorStyle = function() {
    var fontColor = this.colorCreator.createBackgroundColor(0,0,0);
    this.operatorFont = this.excel.createFont("Segoe UI",10,fontColor,true,false,false,false,0);
    this.operatorStyle = this.excel.createStyle(this.operatorFont,
        Constants.BORDER_THIN, Constants.BORDER_THIN, Constants.BORDER_THIN, Constants.BORDER_THIN,
        Constants.C_GRAY, Constants.C_GRAY, Constants.C_GRAY, Constants.C_GRAY,
        Constants.ALIGN_LEFT,
        Constants.ALIGN_LEFT,
        Constants.C_BLACK, Constants.C_WHITE, Constants.NO_FILL, Constants.XL_CELL_DATAFORMAT_TEXT,
        false, 0, false, 0, false);
};

ExcelCellStyleStorage.prototype.createNormalNumericStyle = function() {

    var fontColor = this.colorCreator.createBackgroundColor(0,0,0);
    this.normalFont = this.excel.createFont("Segoe UI",10,fontColor,false,false,false,false,0);
    this.normalNumericStyle = this.excel.createStyle(this.normalFont,
        Constants.BORDER_THIN, Constants.BORDER_THIN, Constants.BORDER_THIN, Constants.BORDER_THIN,
        Constants.C_GRAY, Constants.C_GRAY, Constants.C_GRAY, Constants.C_GRAY,
        Constants.ALIGN_RIGHT,
        Constants.ALIGN_LEFT,
        Constants.C_BLACK, Constants.C_WHITE, Constants.NO_FILL, Constants.XL_CELL_DATAFORMAT_2DIG,
        false, 0, false, 0, false);
};

ExcelCellStyleStorage.prototype.createLightGrayStyle = function() {

    var background = this.colorCreator.createBackgroundColor(174,170,170);
    var fontColor = this.colorCreator.createBackgroundColor(255,255,255);
    this.whiteBoldFont = this.excel.createFont("Segoe UI",12,fontColor,true,false,false,false,0);

    this.lightGrayStyle = this.excel.createStyle(this.whiteBoldFont,
        Constants.BORDER_THIN, Constants.BORDER_THIN, Constants.BORDER_THIN, Constants.BORDER_THIN,
        Constants.C_GRAY, Constants.C_GRAY, Constants.C_GRAY, Constants.C_GRAY, Constants.ALIGN_LEFT,
        Constants.ALIGN_LEFT, Constants.C_BLACK, background, Constants.SOLID_FOREGROUND, Constants.XL_CELL_DATAFORMAT_TEXT,
        false, 0, false, 0, false);

};

ExcelCellStyleStorage.prototype.createLightRedNumericStyle = function() {

    var background = this.colorCreator.createBackgroundColor(252,228,214);
    if ( this.blackBoldFont === null) {
        var fontColor = this.colorCreator.createBackgroundColor(0, 0, 0);
        this.blackBoldFont = this.excel.createFont("Segoe UI", 12, fontColor, true, false, false, false, 0);
    }

    this.lightRedNumericStyle = this.excel.createStyle(this.blackBoldFont,
        Constants.BORDER_THIN, Constants.BORDER_THIN, Constants.BORDER_THIN, Constants.BORDER_THIN,
        Constants.C_GRAY, Constants.C_GRAY, Constants.C_GRAY, Constants.C_GRAY, Constants.ALIGN_RIGHT,
        Constants.ALIGN_LEFT, Constants.C_BLACK, background, Constants.SOLID_FOREGROUND, Constants.XL_CELL_DATAFORMAT_2DIG,
        false, 0, false, 0, false);

};

ExcelCellStyleStorage.prototype.createLightRedStyle = function() {

    var background = this.colorCreator.createBackgroundColor(252,228,214);
    if ( this.blackBoldFont === null) {
        var fontColor = this.colorCreator.createBackgroundColor(0, 0, 0);
        this.blackBoldFont = this.excel.createFont("Segoe UI", 12, fontColor, true, false, false, false, 0);
    }

    this.lightRedStyle = this.excel.createStyle(this.blackBoldFont,
        Constants.BORDER_THIN, Constants.BORDER_THIN, Constants.BORDER_THIN, Constants.BORDER_THIN,
        Constants.C_GRAY, Constants.C_GRAY, Constants.C_GRAY, Constants.C_GRAY, Constants.ALIGN_RIGHT,
        Constants.ALIGN_LEFT, Constants.C_BLACK, background, Constants.SOLID_FOREGROUND, Constants.XL_CELL_DATAFORMAT_TEXT,
        false, 0, false, 0, false);

};

ExcelCellStyleStorage.prototype.createNameStyle = function() {
    var fontColor = this.colorCreator.createBackgroundColor(0,0,0);
    this.nameFont = this.excel.createFont("Segoe UI",16,fontColor,true,false,false,false,0);
    this.nameStyle = this.excel.createStyle(this.nameFont,
        Constants.BORDER_THIN, Constants.BORDER_THIN, Constants.BORDER_THIN, Constants.BORDER_THIN,
        Constants.C_GRAY, Constants.C_GRAY, Constants.C_GRAY, Constants.C_GRAY,
        Constants.ALIGN_LEFT,
        Constants.ALIGN_LEFT,
        Constants.C_BLACK, Constants.C_WHITE, Constants.NO_FILL, Constants.XL_CELL_DATAFORMAT_TEXT,
        false, 0, false, 0, false);
};




ExcelCellStyleStorage.prototype.getHeaderStyle = function () {
    if (this.headerStyle === null) this.createHeaderStyle();
    return this.headerStyle;
};

ExcelCellStyleStorage.prototype.getGrayStyle = function () {
    if (this.grayStyle === null) this.createGrayStyle();
    return this.grayStyle;
};

ExcelCellStyleStorage.prototype.getRedStyle = function () {
    if (this.redStyle === null) this.createRedStyle();
    return this.redStyle;
};

ExcelCellStyleStorage.prototype.getRedNumericStyle = function () {
    if (this.redNumericStyle === null) this.createRedNumericStyle();
    return this.redNumericStyle;
};

ExcelCellStyleStorage.prototype.getCenteredStyle = function () {
    if (this.centeredStyle === null) this.createCenteredStyle();
    return this.centeredStyle;
};

ExcelCellStyleStorage.prototype.getNormalStyle = function () {
    if (this.normalStyle === null) this.createNormalStyle();
    return this.normalStyle;
};

ExcelCellStyleStorage.prototype.getYellowStyle = function () {
    if (this.yellowStyle === null) this.createYellowStyle();
    return this.yellowStyle;
};

ExcelCellStyleStorage.prototype.getYellowNumericStyle = function () {
    if (this.yellowNumericStyle === null) this.createYellowNumericStyle();
    return this.yellowNumericStyle;
};

ExcelCellStyleStorage.prototype.getOperatorStyle = function () {
    if (this.operatorStyle === null) this.createOperatorStyle();
    return this.operatorStyle;
};

ExcelCellStyleStorage.prototype.getNormalNumericStyle = function () {
    if (this.normalNumericStyle === null) this.createNormalNumericStyle();
    return this.normalNumericStyle;
};

ExcelCellStyleStorage.prototype.getLightGrayStyle = function () {
    if (this.lightGrayStyle === null) this.createLightGrayStyle();
    return this.lightGrayStyle;
};

ExcelCellStyleStorage.prototype.getLightRedNumericStyle = function () {
    if (this.lightRedNumericStyle === null) this.createLightRedNumericStyle();
    return this.lightRedNumericStyle;
};

ExcelCellStyleStorage.prototype.getLightRedStyle = function () {
    if (this.lightRedStyle === null) this.createLightRedStyle();
    return this.lightRedStyle;
};

ExcelCellStyleStorage.prototype.getNameStyle = function () {
    if (this.nameStyle === null) this.createNameStyle();
    return this.nameStyle;
};