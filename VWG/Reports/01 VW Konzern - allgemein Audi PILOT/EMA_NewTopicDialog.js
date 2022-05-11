function EMA_NewTopicDialog(model,locale) {

    this.model = model;
    this.locale = locale;

    this.dialogResult = {
        isOk : false,
        name : "",
        description : ""
    }

    this.getPages = function () {
        var page = Dialogs.createNewDialogTemplate(0, 0, 640, 80, "New topic");

        page.Text(20, 20, 620, 20, getString("DLG_NAME_2"), "TT_NAME"); //Name of Managmeent system
        page.TextBox(20, 35, 620, 20, "T_NAME");
        page.Text(20, 55, 620, 20, getString("DLG_TABLE_FULL_NAME"), "TT_DESCRIPTION"); //Shortcut
        page.TextBox(20, 68, 620, 175, "T_DESCRIPTION", 1);
        return [page];
    };

    this.getResult = function () {
        return this.dialogResult;
    };

    this.onClose = function (pageNumber, bOk) {
        this.dialogResult.name = this.getPageElement(pageNumber,"T_NAME").getText();
        this.dialogResult.description = this.getPageElement(pageNumber,"T_DESCRIPTION").getText();
        this.dialogResult.isOk = bOk
    };

    this.canFinish = function () {
        var name = this.dialog.getPage(0).getDialogElement("T_NAME");

        var currentDB = ArisData.getActiveDatabase();
        var currentLocale = Context.getSelectedLanguage();
        var searchItem = currentDB.createSearchItem(Constants.AT_NAME, currentLocale, name.getText(), Constants.SEARCH_CMP_EQUAL, true, false);
        var existing = this.model.Group().ObjDefList(true, [Constants.OT_TECH_TRM], searchItem).length > 0;


        return name.getText().length() > 0 && !existing;
    };

}

EMA_NewTopicDialog.prototype.getPageElement = function (pageNumber, elementIdentifier) {

    var page = this.dialog.getPage(pageNumber);
    if (page === null) return null;

    return page.getDialogElement(elementIdentifier);
};