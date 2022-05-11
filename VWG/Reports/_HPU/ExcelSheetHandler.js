function ExcelSheetHandler(name, excel) {
    this.name = name;
    this.sheet = excel.createSheet(name);

    this.rows = new Packages.java.util.HashMap();
}

ExcelSheetHandler.prototype.createCell = function (row, column) {
    if (this.sheet === null) return false;

    if (this.rows.get(row)) {
        var cell = this.rows.get(row).getCellAt(column);
        if (cell === null) {
            this.rows.get(row).createCell(column);
        }
        return true;
    } else {
        var excelRow = new ExcelRowHandler(this.sheet);
        excelRow.createRow(row);
        excelRow.createCell(column);
        this.rows.put(row, excelRow);
    }

};

ExcelSheetHandler.prototype.getCellAt = function(row,column) {
    var row = this.rows.get(row);
    var cell = row.getCellAt(column);
    return cell;
};

ExcelSheetHandler.prototype.setCellValue = function (row, column, value) {
    var cell = this.getCellAt(row,column);
    cell.setCellValue(value)
};

ExcelSheetHandler.prototype.setColumnWidth = function(column,width) {
    this.sheet.setColumnWidth(column,width);
};

ExcelSheetHandler.prototype.setCellStyle = function(row,column,style) {
    var cell = this.getCellAt(row,column);
    cell.setCellStyle(style)

};

ExcelSheetHandler.prototype.setCellFormula = function(row,column,formula) {
    var cell = this.getCellAt(row,column);
    cell.setCellFormula(formula);
};

ExcelSheetHandler.prototype.setRegion = function  (beginColumn, endColumn,beginRow, endRow) {
    if (this.sheet === null) return null;
    this.sheet.addRegion(beginColumn,endColumn,beginRow,endRow);

};