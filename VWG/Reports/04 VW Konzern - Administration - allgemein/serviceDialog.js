function serviceDialog() {

    this.dialogResult = {};

    this.init = function () {

        this.dialogResult["definitionInputFile"] = null;
        this.dialogResult["relationInputFile"] = null;

        this.getPageElement(this.dialog.getPage(0), "DEFINITION_FILE_TEXT_BOX").setEnabled(false);
        this.getPageElement(this.dialog.getPage(0), "RELATION_FILE_TEXT_BOX").setEnabled(false);


    };

    this.getPages = function () {

        var template = Dialogs.createNewDialogTemplate(0, 0, 720, 240, "Simple Dashboard");

        template.Text(5, 5, 715, 16, "Definition input file");
        template.TextBox(5, 18, 620, 16, "DEFINITION_FILE_TEXT_BOX", 0);
        template.PushButton(650, 16, 80, 20, "...", "DEFINITION_READ_FILE_BUTTON");

        template.Text(5, 44, 715, 16, "Relation input file");
        template.TextBox(5, 58, 620, 16, "RELATION_FILE_TEXT_BOX", 0);
        template.PushButton(650, 56, 80, 20, "...", "RELATION_READ_FILE_BUTTON");

        template.Text(5, 80, 120, 16, "Model name");
        template.TextBox(5, 92, 620, 16, "MODEL_NAME_TEXT_BOX", 0);


        return [template];
    };

    this.getResult = function () {
        return this.dialogResult;
    };

    this.onClose = function (pageNumber, bOk) {

        this.dialogResult["modelName"] = this.getPageElement(this.dialog.getPage(0), "MODEL_NAME_TEXT_BOX").getText();
        this.dialogResult["finished"] = bOk;
    };

    this.canFinish = function (pageNumber) {

        var modelName = this.getPageElement(this.dialog.getPage(0), "MODEL_NAME_TEXT_BOX");

        return   (this.dialogResult["definitionInputFile"] !== null && this.dialogResult["definitionInputFile"].getData().length > 0)
            && ( this.dialogResult["relationInputFile"] !== null && this.dialogResult["relationInputFile"].getData().length > 0)

            && modelName.getText().length() > 0;
    };

    this.getPageElement = function (page, templateName) {
        return page.getDialogElement(templateName);
    };

    this.DEFINITION_READ_FILE_BUTTON_pressed = function () {
        this.dialog.setBrowseFiles("DBF",
            "",
            "*.csv!!CSV Files (*.csv)|*.csv|All Files (*.*)|*.*||",
            "",
            "Select definition input file",
            0);
    };

    this.RELATION_READ_FILE_BUTTON_pressed = function () {
        this.dialog.setBrowseFiles("RBF",
            "",
            "*.csv!!CSV Files (*.csv)|*.csv|All Files (*.*)|*.*||",
            "",
            "Select relation input file",
            0);
    };

    this.DBF_subDialogClosed = function (subResult, bOk) {

        if (bOk) {
            this.dialogResult["definitionInputFile"] = subResult[0];
            this.getPageElement(this.dialog.getPage(0), "DEFINITION_FILE_TEXT_BOX").setText(subResult[0].getName());
        }
    };

    this.RBF_subDialogClosed = function (subResult, bOk) {
        if (bOk) {
            this.dialogResult["relationInputFile"] = subResult[0];
            this.getPageElement(this.dialog.getPage(0), "RELATION_FILE_TEXT_BOX").setText(subResult[0].getName());
        }
    }
}