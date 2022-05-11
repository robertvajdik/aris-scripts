function DocumentEditSubDialog(object, locale, isEdit) {

    this.locale = locale;
    this.isEdit = isEdit;
    this.object = object;
    this.dialogResult = {
        isOk: false,
        object: this.object,
        name: null,
        description: null,
        link: null,
        linkName: null,
        isEdit: this.isEdit
    };

    this.init = function () {

        if (this.isEdit && this.object !== null && this.object.IsValid()) {
            var name = this.object.Attribute(Constants.AT_NAME, this.locale).getValue();
            var description = this.object.Attribute(Constants.AT_DESC, this.locale).getValue();
            var link = this.object.Attribute(Constants.AT_ADS_LINK_1, this.locale).getValue();
            var linkName = this.object.Attribute(Constants.AT_ADS_TITL1, this.locale).getValue();

            this.getPageElement(0, "DOCUMENT_HANDLING_DIALOG_ADS_LINK_TEXT_BOX").setText(link);
            this.getPageElement(0, "DOCUMENT_HANDLING_DIALOG_ADS_LINK_NAME_TEXT_BOX").setText(linkName);
            this.getPageElement(0, "DOCUMENT_HANDLING_DIALOG_NAME_TEXT_BOX").setText(name);
            this.getPageElement(0, "DOCUMENT_HANDLING_DIALOG_DESC_TEXT_BOX").setText(description);

        }
    }
    this.getPages = function () {

        var pages = [];
        pages.push(this.createPage());
        return pages;
    }
    this.getResult = function () {
        return this.dialogResult;
    }
    this.onClose = function (pageNumber, bOk) {

        this.dialogResult.isOk = bOk;
        this.dialogResult.name = this.getPageElement(0, "DOCUMENT_HANDLING_DIALOG_NAME_TEXT_BOX").getText();
        this.dialogResult.description = this.getPageElement(0, "DOCUMENT_HANDLING_DIALOG_DESC_TEXT_BOX").getText();
        this.dialogResult.link = this.getPageElement(0, "DOCUMENT_HANDLING_DIALOG_ADS_LINK_TEXT_BOX").getText();
        this.dialogResult.linkName = this.getPageElement(0, "DOCUMENT_HANDLING_DIALOG_ADS_LINK_NAME_TEXT_BOX").getText();
    }
    this.isInValidState = function (pageNumber) {

        var textBox = this.getPageElement(0, "DOCUMENT_HANDLING_DIALOG_NAME_TEXT_BOX");
        var linkBox = this.getPageElement(0, "DOCUMENT_HANDLING_DIALOG_ADS_LINK_TEXT_BOX");
        return textBox.getText().length() >0;

    }


}

DocumentEditSubDialog.prototype = Object.create(BaseDialog.prototype);
DocumentEditSubDialog.prototype.constructor = DocumentEditSubDialog;

DocumentEditSubDialog.prototype.createPage = function () {

    var template = Dialogs.createNewDialogTemplate(0, 0, 480, 220, getString("DOCUMENT_HANDLING_DIALOG_TITLE")); //Document handling

    template.GroupBox(5, 10, 490, 220, getString("DOCUMENT_HANDLING_DIALOG_GROUP_BOX"));
    template.Text(10, 15, 475, 20, getString("DLG_ALLOC_11"), "DOCUMENT_HANDLING_DIALOG_NAME_TEXT");
    template.TextBox(10, 27, 475, 20, "DOCUMENT_HANDLING_DIALOG_NAME_TEXT_BOX");
    template.Text(10, 50, 475, 20, getString("DLG_ALLOC_22"), "DOCUMENT_HANDLING_DIALOG_DESC_TEXT");
    template.TextBox(10, 63, 475, 80, "DOCUMENT_HANDLING_DIALOG_DESC_TEXT_BOX", 1);
    template.Text(10, 143, 475, 20, getString("DOCUMENT_HANDLING_DIALOG_ADS_LINK_NAME_TEXT"),
        "DOCUMENT_HANDLING_DIALOG_ADS_LINK_NAME_TEXT");
    template.TextBox(10, 155, 420, 20, "DOCUMENT_HANDLING_DIALOG_ADS_LINK_NAME_TEXT_BOX");
    template.Text(10, 173, 475, 20, getString("DOCUMENT_HANDLING_DIALOG_ADS_LINK_TEXT"), "DOCUMENT_HANDLING_DIALOG_ADS_LINK_TEXT");
    template.TextBox(10, 185, 475, 20, "DOCUMENT_HANDLING_DIALOG_ADS_LINK_TEXT_BOX");

    return template;

}