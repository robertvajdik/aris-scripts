function ADSNewDocumentSubDialog(folderPath, locale) {

    this.folderPath = folderPath;
    this.locale = locale;
    this.file = null;


    this.isInValidState = function (pageNumber) {

        var titleTextBox = this.getPageElement(0, "TITLE_TEXT_BOX");

        return this.file !== null && String(titleTextBox.getText()).length > 0;
    }
    this.init = function () {
        this.getPageElement(0, "LOCAL_FILE_PATH").setEnabled(false);
        this.getPageElement(0, "ROOT_TEXT_BOX").setEnabled(false);
        var root = Context.getComponent("ADS").getADSRepository("portal").getFolder(this.folderPath);

        this.getPageElement(0, "ROOT_TEXT_BOX").setText(root.getPath());
    }

    this.getPages = function () {

        var pages = [];
        pages.push(this.createPage());
        return pages;
    }

    this.onClose = function (pageNumber, bOk) {


        if (!bOk) return false;

        var title = this.getPageElement(0, "TITLE_TEXT_BOX").getText();
        var description = this.getPageElement(0, "DESCRIPTION_TEXT_BOX").getText();
        /*
        var adsMananger = new ADSManager();
        var db = ArisData.getActiveDatabase();
        var user = ArisData.ActiveUser();
        var rights = adsMananger.assignADSPriviledges(db, user, "010100|0|0 Libraries|7b7a7dc1-8892-11eb-7c47-005056af6d0b|U|RWD");
        if (!rights) writeLog(sm72tc, "Access to usergroup 010100|0|0 Libraries|7b7a7dc1-8892-11eb-7c47-005056af6d0b|U|RWD was not" +
            " granted");
            */
        try {
            var folder = Context.getComponent("ADS").getADSRepository("portal").getFolder(this.folderPath);
            if (folder !== null) {
                var documentInfo = Context.getComponent("ADS").getADSRepository("portal")
                                          .createDocumentMetaInfo(title, this.file.getName(), description);
                var document = Context.getComponent("ADS").getADSRepository("portal")
                                      .createAndOverwriteExistingDocument(folder, documentInfo,
                                          new Packages.java.io.ByteArrayInputStream(this.file.getData()));
            }
        } catch (ex) {
            writeLog(sm72tc, "ADS Component error " + ex + " occurred", "error");
        }
        /*
        rights = adsMananger.unassignADSPriviledges(db, user, "010100|0|0 Libraries|7b7a7dc1-8892-11eb-7c47-005056af6d0b|U|RWD");
        if (!rights) writeLog(sm72tc, "Access to usergroup 010100|0|0 Libraries|7b7a7dc1-8892-11eb-7c47-005056af6d0b|U|RWD was not" +
            " removed");

*/
    }

    this.LOAD_LOCAL_FILE_BUTTON_pressed = function () {

        this.dialog.setBrowseFiles("LOCAL_FILE_BROWSER_DIALOG", "", "Excel files|*.xlsx|Word files|*.docx|Pdf files|*.pdf||", "",
            "Select a document", 0);
    }
    this.LOCAL_FILE_BROWSER_DIALOG_subDialogClosed = function (subResults, bOk) {

        if (!bOk) return false;
        var fileTextBox = this.getPageElement(0, "LOCAL_FILE_PATH");
        this.file = subResults[0];
        fileTextBox.setText(this.file.getName());

    }
}

ADSNewDocumentSubDialog.prototype = Object.create(BaseDialog.prototype);
ADSNewDocumentSubDialog.prototype.constructor = ADSHandlingDialog;

ADSNewDocumentSubDialog.prototype.createPage = function () {

    var page = Dialogs.createNewDialogTemplate(0, 0, 580, 160, "Create a document in ADS");

    page.Text(5, 9, 60, 20, getString("FILE_LABEL"), "FILE_LABEL");
    page.TextBox(85, 5, 530, 20, "LOCAL_FILE_PATH");
    page.PushButton(620, 4, 20, 20, "...", "LOAD_LOCAL_FILE_BUTTON");

    page.Text(5, 34, 60, 20, getString("ROOT_LABEL"), "ROOT_LABEL");
    page.TextBox(85, 30, 530, 20, "ROOT_TEXT_BOX");

    page.Text(5, 59, 75, 20, getString("TITLE_LABEL"), "TITLE_LABEL");
    page.TextBox(85, 55, 530, 20, "TITLE_TEXT_BOX");
    page.Text(5, 110, 85, 20, getString("DESCRIPTION_LABEL"), "DESCRIPTION_LABEL");
    page.TextBox(85, 80, 530, 80, "DESCRIPTION_TEXT_BOX", 1);


    return page;
}