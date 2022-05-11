function runManageRuleDialog(locale, attribute) {

    var dialogFunction = new ManageRuleDialog(locale, attribute);
    var result = Dialogs.showDialog(dialogFunction, Constants.DIALOG_TYPE_ACTION, "Výběr pravidla pro sloučení");
    return result;

}

function ManageRuleDialog(locale, attribute) {

    this.locale = locale;
    this.attribute = attribute;
    this.rules = [];

    this.dialogResult = {
        isOk: false,
        deleteRules: []
    }

    this.init = function (pages) {

        var descriptions = [];
        var ruleList = this.getPageElement(0, "RULE_LIST");
        var those = this;
        var value = String(this.attribute.getValue());
        value.split("|").forEach(function (item) {

            try {
                var rule = JSON.parse(item);
                those.rules.push(rule);
                descriptions.push(rule.ruleName);
            } catch (e) {

            }
        });

        ruleList.setItems(descriptions);

        this.getPageElement(0, "INFO_RULE_BOX").setEnabled(false);
        this.getPageElement(0, "SELECTED_RULE_BOX").setEnabled(false);
        this.getPageElement(0, "ADD").setEnabled(false);
        this.getPageElement(0, "REMOVE").setEnabled(false);

    }

    this.isInValidState = function (pages) {
        return this.dialogResult.deleteRules.length > 0;
    }

    this.getPages = function () {

        var pages = [];
        pages.push(this.selectRulePage());
        return pages;
    }

    this.getResult = function () {
        return this.dialogResult;
    };

    this.onClose = function (pageNumber, bOk) {

        this.dialogResult.isOk = bOk;
    };

    this.RULE_LIST_selChanged = function (index) {
        var rule = this.rules[index];
        this.getPageElement(0, "ADD").setEnabled(true);
        var textBox = this.getPageElement(0, "INFO_RULE_BOX");

        var message = rule.ruleName + "\r\n";
        message += "Ze zdrojové database " + rule.sourceDatabase + " budou sloučeny následující složky \r\n";
        message += this.getDatabaseFolderPath(rule.sourceDatabase, String(rule.folders).split(";"));
        message += "V cilové databázy " + rule.targetDatabase + " bude použita následujicí košosložka \r\n";
        message += this.getDatabaseFolderPath(rule.targetDatabase, [rule.trashFolder]);
        message += "V cílové databázy " + rule.targetDatabase + " bude použitá následující složka " +
            this.getDatabaseFolderPath(rule.targetDatabase, [rule.targetFolder])
            + " pro zachování názvu\r\n";

        message += "V cílové databázy " + rule.targetDatabase + " bude použitá následující složka " +
            this.getDatabaseFolderPath(rule.targetDatabase, [rule.reorgFolder])
            + " pro reorganizaci\r\n";
        textBox.setText(message);

        var found = this.dialogResult.deleteRules.some(function (storedRule) {
            return storedRule.sha256 === rule.sha256;
        });
        if (found) this.getPageElement(0, "ADD").setEnabled(false);
        else this.getPageElement(0, "ADD").setEnabled(true);
    }

    this.ADD_pressed = function () {
        this.getPageElement(0, "REMOVE").setEnabled(true);
        var textBox = this.getPageElement(0, "SELECTED_RULE_BOX");
        var index = this.getPageElement(0, "RULE_LIST").getSelectedIndex();
        var rule = this.rules[index];
        var found = this.dialogResult.deleteRules.some(function (storedRule) {
            return storedRule.sha256 === rule.sha256;
        });


        if (!found) {
            var infoText = textBox.getText();
            if (infoText.length() > 0) infoText += ";" + rule.ruleName;
            else infoText = rule.ruleName;
            this.dialogResult.deleteRules.push(rule);
            textBox.setText(infoText);
            this.getPageElement(0, "ADD").setEnabled(false);
        }


    }

    this.REMOVE_pressed = function () {
        this.getPageElement(0, "REMOVE").setEnabled(true);
        var index = this.getPageElement(0, "RULE_LIST").getSelectedIndex();
        var rule = this.rules[index];
        var textBox = this.getPageElement(0, "SELECTED_RULE_BOX");

        var found = this.dialogResult.deleteRules.some(function (storedRule) {
            return storedRule.sha256 === rule.sha256;
        });

        if (found) {
            var position = this.dialogResult.deleteRules.indexOf(rule);
            this.dialogResult.deleteRules.splice(position, 1);
            var infoText = "";
            var length = this.dialogResult.deleteRules.length;
            this.dialogResult.deleteRules.forEach(function (storedRule, position) {
                infoText += storedRule.ruleName;
                if (position !== length - 1) infoText += ";";
            });
            this.getPageElement(0, "ADD").setEnabled(true);

            textBox.setText(infoText);
        }







    }
}

ManageRuleDialog.pageWidth = 720;
ManageRuleDialog.pageHeight = 420;

ManageRuleDialog.prototype.selectRulePage = function () {

    var page = Dialogs.createNewDialogTemplate(0, 0, ManageRuleDialog.pageWidth, ManageRuleDialog.pageHeight, "Výběr pravidel pro odstranění");
    page.GroupBox(10, 5, ManageRuleDialog.pageWidth - 5, ManageRuleDialog.pageHeight - 5, "Vyberte pravidla pro odstranění");
    page.ListBox(20, 10, ManageRuleDialog.pageWidth - 65, (0.4 * ManageRuleDialog.pageHeight), [], "RULE_LIST");
    page.Text(20, 12 + (0.4 * ManageRuleDialog.pageHeight), ManageRuleDialog.pageWidth - 35, 20, "Informace o pravidlu");

    page.TextBox(20, 25 + (0.4 * ManageRuleDialog.pageHeight), ManageRuleDialog.pageWidth - 35, (0.2 * ManageRuleDialog.pageHeight), "INFO_RULE_BOX", 1);
    page.Text(20, 35 + (0.4 * ManageRuleDialog.pageHeight) + (0.2 * ManageRuleDialog.pageHeight), ManageRuleDialog.pageWidth - 35, 20, "Vybráná pravidla pro odstranění");
    page.TextBox(20, 50 + (0.4 * ManageRuleDialog.pageHeight) + (0.2 * ManageRuleDialog.pageHeight), ManageRuleDialog.pageWidth - 35, (0.2 * ManageRuleDialog.pageHeight) + 30, "SELECTED_RULE_BOX", 1);
    page.PushButton(ManageRuleDialog.pageWidth - 40, 30, 30, 20, "+", "ADD");
    page.PushButton(ManageRuleDialog.pageWidth - 40, 60, 30, 20, "-", "REMOVE");
    return page;
}

ManageRuleDialog.prototype.getPageElement = function (pageNumber, elementIdentifier) {

    var page = this.dialog.getPage(pageNumber);
    if (page === null) return null;

    return page.getDialogElement(elementIdentifier);
};

ManageRuleDialog.prototype.getDatabaseFolderPath = function (databaseName, folders) {
    var paths = "";
    var db = ArisData.openDatabase(databaseName, g_MergeUser, g_MergePWD, g_EntireMethode, this.locale, true);
    var those = this;
    folders.forEach(function (folderGUID) {
        var group = db.FindGUID(folderGUID, Constants.CID_GROUP);
        if (group.IsValid()) {
            paths += group.Path(those.locale);
            paths += "\r\n";
        }
    })


    db.close();
    return paths;
}