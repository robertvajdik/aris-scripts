function ExcelRowHandler(sheet) {
    this.sheet = sheet;
    this.row = null;
    this.columns =  new Packages.java.util.HashMap();
}

ExcelRowHandler.prototype.createRow = function(index) {
    this.row = this.sheet.createRow(index);

};

ExcelRowHandler.prototype.createCell = function(column) {
    if (this.row === null) return;
    var cell = new ExcelCellHandler(this.row);
    cell.createCell(column);
    this.columns.put(column,cell);

};

ExcelRowHandler.prototype.getCellAt = function(column) {
    if (this.row === null) return null;
    if (this.columns.size() === 0) return null;
    return this.columns.get(column);
};

ExcelRowHandler.prototype.getColumns = function() {
    return this.columns;
};


