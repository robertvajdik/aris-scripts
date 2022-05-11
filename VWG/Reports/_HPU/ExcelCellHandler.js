function ExcelCellHandler(row) {
    this.row = row;
    this.cell = null;
    this.column = null;
}

ExcelCellHandler.prototype.createCell = function(column) {
    this.column = column;
    this.cell = this.row.createCell(this.column);

};

ExcelCellHandler.prototype.setValue = function (value,type) {
    if (this.cell === null) return;
    this.setCellType(type);
    this.setCellValue(type);
};

ExcelCellHandler.prototype.setCellType = function (type) {
    if (type === null) return;
    if (this.cell === null) return;
    this.cell.setCellType(type);
};

ExcelCellHandler.prototype.setCellValue = function(value) {
    if (this.cell === null) return;
    this.cell.setCellValue(value);
};

ExcelCellHandler.prototype.setCellStyle = function (style) {
    if (this.cell === null) return;
    this.cell.setCellStyle(style);
};

ExcelCellHandler.prototype.setCellFormula = function (formula) {
    if (this.cell === null) return;
    this.cell.setCellFormula(formula);
};