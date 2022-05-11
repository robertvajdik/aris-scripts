

function runMergeRuleDialog(locale) {

    var dialogFunction = new MergeRuleDialog(locale);
    var result = Dialogs.showDialog(dialogFunction, Constants.DIALOG_TYPE_WIZARD, "Nastavení skriptu do mergování");
    if (dialogFunction.targetDatabase !== null) dialogFunction.targetDatabase.close();
    return result;

}

function MergeRuleDialog(locale) {

    this.locale = locale;
    this.targetDatabase = null
    this.dialogResult = {
        isOk: false,
        sourceFolders: [],
        sourceDatabase: null,
        targetDatabase: null,
        targetFolderForNaming: null,
        trashFolder: null,
        reorgFolder: null,
        ruleName : ""

    }

    this.init = function (pages) {

        this.getPageElement(1, "REMOVE").setEnabled(false);
        this.getPageElement(1, "FOLDER_LIST").setEnabled(false);
        this.getPageElement(2, "SELECTED_DATABASE").setEnabled(false);
        this.getPageElement(3, "TRASH_FOLDER").setEnabled(false);
        this.getPageElement(6, "INFO").setEnabled(false);
        this.dialogResult.sourceDatabase = ArisData.getActiveDatabase().Name(this.locale);
        var databases = [];
        databases.push(" ");
        ArisData.GetDatabaseNames().forEach(function (name) {
            databases.push(name);
        });

        databases.sort(function (nameA, nameB) {
            return nameA.localeCompare(nameB);
        })
        this.getPageElement(2, "DATABASE_LIST").setItems(databases);

    }

    this.getPages = function () {

        var pages = [];
        pages.push(this.selectRuleTitlePage())
        pages.push(this.selectFolderPage());
        pages.push(this.selectTargetDatabasePage());
        pages.push(this.selectTrashFolderPage());
        pages.push(this.selectTargetDatabaseParentPage());
        pages.push(this.selectFolderForReogranization());
        pages.push(this.infoPage());

        return pages;
    }

    this.canFinish = function () {
        this.dialogResult.ruleName = this.getPageElement(0,"RULE_TITLE").getText();
        return this.getPageElement(1, "FOLDER_LIST").getItems().length > 0 && this.dialogResult.targetDatabase !== null
            && this.dialogResult.trashFolder !== null;
    }

    this.isInValidState = function (pageNumber) {
        if (this.getPageElement(1, "FOLDER_LIST").getItems().length > 0) this.getPageElement(1, "REMOVE").setEnabled(true);


        if (pageNumber === 1) {
            return this.getPageElement(1, "FOLDER_LIST").getItems().length > 0
        }
        if (pageNumber === 2) {
            return this.dialogResult.targetDatabase !== null;
        }

        if (pageNumber === 3) {
            return this.dialogResult.trashFolder !== null;
        }

        if (pageNumber === 6) {

            var message = "";
            var those = this;

            message += this.dialogResult.ruleName + "\r\n";
            message += "Ze zdrojové database " + this.dialogResult.sourceDatabase + " budou sloučeny následující složky \r\n";
            message += this.getDatabaseFolderPath(this.dialogResult.sourceDatabase, this.dialogResult.sourceFolders);
            message += "V cilové databázy " + this.dialogResult.targetDatabase + " bude použita následujicí košosložka \r\n";
            message += this.getDatabaseFolderPath(this.dialogResult.targetDatabase, [this.dialogResult.trashFolder]);
            message += "V cílové databázy " + this.dialogResult.targetDatabase + " bude použitá následující složka " +
                this.getDatabaseFolderPath(this.dialogResult.targetDatabase, [this.dialogResult.targetFolderForNaming])
                + " pro zachování názvu\r\n";

            message += "V cílové databázy " + this.dialogResult.targetDatabase + " bude použitá následující složka " +
                this.getDatabaseFolderPath(this.dialogResult.targetDatabase, [this.dialogResult.reorgFolder])
                + " pro reorganizaci\r\n";
            this.getPageElement(6, "INFO").setText(message);
        }
        return true;
    }

    this.canGotoNextPage = function (pageNumber) {
        if (pageNumber === 1) {
            return this.getPageElement(1, "FOLDER_LIST").getItems().length > 0;
        }
        if (pageNumber === 2) {
            return this.dialogResult.targetDatabase !== null;
        }
        if (pageNumber === 3) {
            return this.dialogResult.trashFolder !== null;
        }
        return true;
    }

    this.getResult = function () {
        return this.dialogResult;

    };

    this.onClose = function (pageNumber, bOk) {

        this.dialogResult.isOk = bOk;


    };

    this.ADD_pressed = function () {
        var activeDB = ArisData.getActiveDatabase();
        this.dialog.setBrowseArisItems("FOLDERSELECTOR", "Vyberte složky ke sloučení ze zdrojové databáze", "Složky, které budou sloučeny ve cilové databázi.", activeDB.ServerName(), activeDB.Name(Context.getSelectedLanguage()), Constants.CID_GROUP, []);


    }

    this.ADD_TRASH_pressed = function () {

        this.targetDatabase = ArisData.openDatabase(this.dialogResult.targetDatabase, g_MergeUser, g_MergePWD, g_EntireMethode, this.locale, true);
        this.dialog.setBrowseArisItems("TRASHSELECTOR", "Vyber košosložky", "Košosložka v cílové databázi, do které se budou ukládat rozdílové objekty.", this.targetDatabase.ServerName(), this.targetDatabase.Name(Context.getSelectedLanguage()), Constants.CID_GROUP, []);

    }

    this.ADD_TARGET_FOLDER_pressed = function () {

        if (!this.targetDatabase.IsValid())  this.targetDatabase = ArisData.openDatabase(this.dialogResult.targetDatabase, g_MergeUser, g_MergePWD, g_EntireMethode, this.locale, true);
        this.dialog.setBrowseArisItems("TARGETFOLDERSELECTOR", "Vyber košosložky", "Složka v cílové databázi, ze které se použije jméno po sloučení.", this.targetDatabase.ServerName(), this.targetDatabase.Name(Context.getSelectedLanguage()), Constants.CID_GROUP, []);

    }

    this.ADD_REORG_FOLDER_pressed = function () {

        if (!this.targetDatabase.IsValid())  this.targetDatabase = ArisData.openDatabase(this.dialogResult.targetDatabase, g_MergeUser, g_MergePWD, g_EntireMethode, this.locale, true);
        this.dialog.setBrowseArisItems("REORGFOLDERSELECTOR", "Vyber košosložky", "Složka v cílové databázi, ve které se provede reorganizace.", this.targetDatabase.ServerName(), this.targetDatabase.Name(Context.getSelectedLanguage()), Constants.CID_GROUP, []);

    }



    this.REMOVE_TRASH_pressed  = function () {

        this.dialogResult.trashFolder = null;
        this.getPageElement(3,"TRASH_FOLDER").setText("");
    }

    this.REMOVE_TARGET_FOLDER_pressed  = function () {

        this.dialogResult.targetFolderForNaming = null;
        this.getPageElement(4,"TARGET_FOLDER").setText("");
    }

    this.REMOVE_REORG_FOLDER_pressed  = function () {

        this.dialogResult.targetFolderForNaming = null;
        this.getPageElement(5,"REORG_FOLDER").setText("");
    }

    this.REMOVE_pressed = function () {

        var selectedIndex = this.getPageElement(1, "FOLDER_LIST").getSelectedIndex();
        if (selectedIndex === -1) return;

        var items = this.getPageElement(1, "FOLDER_LIST").getItems();
        var result = items.filter(function (item, index) {
            return index !== selectedIndex;
        });

        this.dialogResult.sourceFolders = this.dialogResult.sourceFolders.filter(function (item, index) {
            return index !== selectedIndex;
        })

        this.getPageElement(1, "FOLDER_LIST").setItems(result);

    }

    this.FOLDERSELECTOR_subDialogClosed = function (result, ok) {
        if (!ok) return;


        var those = this;
        newFolders = result.split(";").reduce(function (array, oid) {
            var foundGroup = ArisData.getActiveDatabase().FindOID(oid);
            if (foundGroup.KindNum() === Constants.CID_GROUP) {
                var guid = foundGroup.GUID();
                array.push(foundGroup.Path(those.locale));
                if (those.dialogResult.sourceFolders.indexOf(guid) === -1) {
                    those.dialogResult.sourceFolders.push(guid);
                }
            }
            return array;
        }, []);

        var folders = this.getPageElement(1, "FOLDER_LIST").getItems();
        if (folders.length === 0) this.getPageElement(1, "FOLDER_LIST").setItems(newFolders);
        else {
            var addition = newFolders.filter(function (folder) {
                var found = folders.some(function (group) {
                    return group.localeCompare(folder) === 0;
                })
                return !found;
            });
            folders = folders.concat(addition);
            this.getPageElement(1, "FOLDER_LIST").setItems(folders);
        }
        this.getPageElement(1, "FOLDER_LIST").setEnabled(true);

    }

    this.TRASHSELECTOR_subDialogClosed = function (result, ok) {
        if (!ok) return;

        try {
            var oid = result.split(";")[0];

            var foundGroup = this.targetDatabase.FindOID(oid);
            if (foundGroup.KindNum() === Constants.CID_GROUP) {
                var guid = foundGroup.GUID()
                this.dialogResult.trashFolder = guid;
                this.getPageElement(3, "TRASH_FOLDER").setText(foundGroup.Path(this.locale));
            }

        }
        catch(e) {

        }

    }

    this.TARGETFOLDERSELECTOR_subDialogClosed = function(result,ok) {
        if (!ok) return;

        try {
            var oid = result.split(";")[0];

            var foundGroup = this.targetDatabase.FindOID(oid);
            if (foundGroup.KindNum() === Constants.CID_GROUP) {
                var guid = foundGroup.GUID()
                this.dialogResult.targetFolderForNaming = guid;
                this.getPageElement(4, "TARGET_FOLDER").setText(foundGroup.Path(this.locale));
            }

        }
        catch(e) {

        }
    }

    this.REORGFOLDERSELECTOR_subDialogClosed = function(result,ok) {
        if (!ok) return;

        try {
            var oid = result.split(";")[0];

            var foundGroup = this.targetDatabase.FindOID(oid);
            if (foundGroup.KindNum() === Constants.CID_GROUP) {
                var guid = foundGroup.GUID()
                this.dialogResult.reorgFolder = guid;
                this.getPageElement(5, "REORG_FOLDER").setText(foundGroup.Path(this.locale));
            }

        }
        catch(e) {

        }
    }

    this.DATABASE_LIST_selChanged = function (index) {

        var databaseNames = this.getPageElement(2, "DATABASE_LIST").getItems();

        var selection = databaseNames[index];

        if (selection.localeCompare(" ") === 0) this.dialogResult.targetDatabase = null;
        else this.dialogResult.targetDatabase = selection;
        this.getPageElement(2, "SELECTED_DATABASE").setText(selection);
    }


}

MergeRuleDialog.pageWidth = 640;
MergeRuleDialog.pageHeight = 240;


MergeRuleDialog.prototype.selectRuleTitlePage = function () {

    var page = Dialogs.createNewDialogTemplate(0, 0, MergeRuleDialog.pageWidth, MergeRuleDialog.pageHeight, "Pojmenování pravidla sloučení");

    page.GroupBox(10, 5, MergeRuleDialog.pageWidth - 10, MergeRuleDialog.pageHeight - 10, "Zadání jména pravidla");
    page.TextBox(20, 5 + ((MergeRuleDialog.pageHeight-25)/2), MergeRuleDialog.pageWidth - 25, 20,"RULE_TITLE");

    return page;
}

MergeRuleDialog.prototype.selectFolderPage = function () {

    var page = Dialogs.createNewDialogTemplate(0, 0, MergeRuleDialog.pageWidth, MergeRuleDialog.pageHeight, "Výběr zdrojových složek");

    page.GroupBox(10, 5, MergeRuleDialog.pageWidth - 10, MergeRuleDialog.pageHeight - 10, "Vyberte zdrojové složky");
    page.ListBox(20, 10, MergeRuleDialog.pageWidth - 65, (0.8 * MergeRuleDialog.pageHeight), [], "FOLDER_LIST");
    page.PushButton(MergeRuleDialog.pageWidth - 40, 30, 30, 20, "+", "ADD");
    page.PushButton(MergeRuleDialog.pageWidth - 40, 60, 30, 20, "-", "REMOVE");
    return page;
}

MergeRuleDialog.prototype.selectTrashFolderPage = function () {

    var page = Dialogs.createNewDialogTemplate(0, 0, MergeRuleDialog.pageWidth, MergeRuleDialog.pageHeight, "Výběr cílové košosložky");

    page.GroupBox(10, 5, MergeRuleDialog.pageWidth - 10, MergeRuleDialog.pageHeight - 10, "Vyberte košosložku");
    page.TextBox(20, 10, MergeRuleDialog.pageWidth - 120, 20, "TRASH_FOLDER");
    page.PushButton(MergeRuleDialog.pageWidth - 90, 8, 30, 20, "+", "ADD_TRASH");
    page.PushButton(MergeRuleDialog.pageWidth - 40, 8, 30, 20, "-", "REMOVE_TRASH");
    return page;
}

MergeRuleDialog.prototype.selectTargetDatabasePage = function () {

    var page = Dialogs.createNewDialogTemplate(0, 0, MergeRuleDialog.pageWidth, MergeRuleDialog.pageHeight, "Výběr cílové databáze");

    page.GroupBox(10, 5, MergeRuleDialog.pageWidth - 10, MergeRuleDialog.pageHeight - 5, "Vyberte cílovou databázi");
    page.DropListBox(20, 10, MergeRuleDialog.pageWidth - 65, 140, [], "DATABASE_LIST");
    page.Text(20, 40, MergeRuleDialog.pageWidth - 65, 20, "Vybraná cilová databáze", "SELECTED_DATABASE_LABEL");
    page.TextBox(20, 60, MergeRuleDialog.pageWidth - 65, 20, "SELECTED_DATABASE");

    return page;
}

MergeRuleDialog.prototype.selectTargetDatabaseParentPage = function () {

    var page = Dialogs.createNewDialogTemplate(0, 0, MergeRuleDialog.pageWidth, MergeRuleDialog.pageHeight, "Výběr složky pro zachování názvu");

    page.GroupBox(10, 5, MergeRuleDialog.pageWidth - 10, MergeRuleDialog.pageHeight - 5, "Vyberte složku v cílové databázi pro zachování jejího názvu");
    page.TextBox(20, 10, MergeRuleDialog.pageWidth - 120, 20, "TARGET_FOLDER");
    page.PushButton(MergeRuleDialog.pageWidth - 90, 8, 30, 20, "+", "ADD_TARGET_FOLDER");
    page.PushButton(MergeRuleDialog.pageWidth - 40, 8, 30, 20, "-", "REMOVE_TARGET_FOLDER");

    return page;
}

MergeRuleDialog.prototype.selectFolderForReogranization = function() {

    var page = Dialogs.createNewDialogTemplate(0, 0, MergeRuleDialog.pageWidth, MergeRuleDialog.pageHeight, "Výběr složky pro reorganizaci");

    page.GroupBox(10, 5, MergeRuleDialog.pageWidth - 10, MergeRuleDialog.pageHeight - 5, "Vyberte složku v cílové databázi, ve které se provede reorganizace");
    page.TextBox(20, 10, MergeRuleDialog.pageWidth - 120, 20, "REORG_FOLDER");
    page.PushButton(MergeRuleDialog.pageWidth - 90, 8, 30, 20, "+", "ADD_REORG_FOLDER");
    page.PushButton(MergeRuleDialog.pageWidth - 40, 8, 30, 20, "-", "REMOVE_REORG_FOLDER");

    return page;
}

MergeRuleDialog.prototype.infoPage = function () {

    var page = Dialogs.createNewDialogTemplate(0, 0, MergeRuleDialog.pageWidth, MergeRuleDialog.pageHeight, "Informace o nastavení sloučení");

    page.GroupBox(10, 5, MergeRuleDialog.pageWidth - 10, MergeRuleDialog.pageHeight - 5, "Nastavení");
    page.TextBox(20, 10, MergeRuleDialog.pageWidth - 30, MergeRuleDialog.pageHeight - 20, "INFO",1);
    return page;
}

MergeRuleDialog.prototype.getPageElement = function (pageNumber, elementIdentifier) {

    var page = this.dialog.getPage(pageNumber);
    if (page === null) return null;

    return page.getDialogElement(elementIdentifier);
};

MergeRuleDialog.prototype.getDatabaseFolderPath = function (databaseName, folders) {
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