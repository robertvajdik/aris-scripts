function EditOrCreateNewObjectSubDialog(folderGUID, object, objectType, locale, isEdit,page) {

    this.folderGUID = folderGUID;
    this.object = object;
    this.locale = locale;
    this.objectType = objectType;
    this.isEdit = isEdit;
    this.page = page;

    this.dialogResult = {
        isOk: false,
        newName: null,
        object: object,
        isEdit: isEdit,
        folderGUID: folderGUID,
        objectType: objectType
    }

    this.getPages = function () {

        var pages = [];
        pages.push(this.createPage())
        return pages;
    }

    this.isInValidState = function () {

        var textBox = this.getPageElement(0, "EOCNOSD_NAME_TEXT");
        var descriptionTextBox = this.getPageElement(0,"EOCNOSD_DESCRIPTION_TEXT");
        if (isEdit) {
            return (!BaseDialog.getMaintainedObjectName(this.object,this.locale).equals(String(textBox.getText())) && textBox.getText().length() > 2)
             || descriptionTextBox.getText().length() > 0;

        }


        return textBox.getText().length() > 2;
    }

    this.init = function () {

        if (isEdit) {
            var textBox = this.getPageElement(0, "EOCNOSD_NAME_TEXT");
            var descriptionBox = this.getPageElement(0, "EOCNOSD_DESCRIPTION_TEXT");

            textBox.setText(BaseDialog.getMaintainedObjectName(this.object,this.locale));
            descriptionBox.setText(this.object.Attribute(Constants.AT_DESC,this.locale).getValue());
        }

    }

    this.onClose = function (pageNumber, bOk) {
        this.dialogResult.isOk = bOk;
        this.dialogResult.newName = this.getPageElement(0, "EOCNOSD_NAME_TEXT").getText();
        this.dialogResult.newDescription = this.getPageElement(0,"EOCNOSD_DESCRIPTION_TEXT").getText();
        this.dialogResult.object = this.object;
        this.dialogResult.isEdit = this.isEdit;
        this.dialogResult.folderGUID = this.folderGUID;
        this.dialogResult.objectType = this.objectType;
        this.dialogResult.page = this.page;

    }

    this.getResult = function () {
        return this.dialogResult;
    }

}

EditOrCreateNewObjectSubDialog.prototype = Object.create(BaseDialog.prototype)
EditOrCreateNewObjectSubDialog.prototype.constructor = EditOrCreateNewObjectSubDialog;


EditOrCreateNewObjectSubDialog.prototype.createPage = function () {

    var page = Dialogs.createNewDialogTemplate(Math.floor(BaseDialog.templateWidth), 120, "Documents");

    page.Text(20, 8, BaseDialog.templateWidth - 40, 20, BaseDialog.getStringFromStringTable("ATTR_OBJECT_NAME",this.locale), "EOCNOSD_NAME_LABEL");
    page.TextBox(20, 20, BaseDialog.templateWidth - 40, 20, "EOCNOSD_NAME_TEXT");

    page.Text(20,48,BaseDialog.templateWidth - 40, 20, BaseDialog.getStringFromStringTable("ATTR_DESCRIPTION",this.locale), "EOCNOSD_DESCRIPTION_LABEL")
    page.TextBox(20, 60, BaseDialog.templateWidth - 40, 120, "EOCNOSD_DESCRIPTION_TEXT",1);

    return page;
}
