STORE_IN_NEW_DOCUMENT_FOLDER = 0;
STORE_IN_MODEL_FOLDER = 1;
ADS_ITEM_TYPE_GROUP = 0;
ADS_ITEM_TYPE_FILE = 1;


function ADSVirtualNode(item, type) {

    this.item = item;
    this.type = type;
    this.children = [];
    this.treeIndex = 0;

}

function handlingNewDocument(corporateKey, object, locale, isEdit) {

    var dialogFunction = new DocumentHandlingDialog(corporateKey, object, locale, isEdit, false);
    var dialogResult = Dialogs.showDialog(dialogFunction, Constants.DIALOG_TYPE_ACTION, getString("ASSIGN_DOCUMENT_DIALOG_TITLE"));
    if (dialogResult.isOk) {

        var odNewDoc = dialogResult.object;
        if (dialogResult.storeIn === STORE_IN_NEW_DOCUMENT_FOLDER && !dialogResult.isEdit) {
            g_newObj = true;
            odNewDoc = g_GroupNewDoc.CreateObjDef(g_Type_ZuOrdnung, dialogResult.name, g_nSelectedLoc);

        }
        if (odNewDoc.IsValid()) {
            odNewDoc.Attribute(Constants.AT_NAME, g_nAlterLoc).setValue(dialogResult.name);
            if(dialogResult.description !== null) {
                odNewDoc.Attribute(Constants.AT_DESC, g_nSelectedLoc).setValue(dialogResult.description);
            }
            if(dialogResult.link !== null) {
                odNewDoc.Attribute(Constants.AT_ADS_LINK_1, g_nSelectedLoc).setValue(dialogResult.link);
            }
            if(dialogResult.linkName !== null) {
                odNewDoc.Attribute(Constants.AT_ADS_TITL1, g_nSelectedLoc).setValue(dialogResult.linkName);
            }
        }
    }
}


function DocumentHandlingDialog(corporateKey, object, locale, isEdit, isLocal) {

    this.corporateKey = corporateKey;
    this.locale = locale;
    this.isEdit = isEdit;
    this.object = object;
    this.dialogResult = {
        isOk: false,
        storeIn: isLocal ? STORE_IN_MODEL_FOLDER : STORE_IN_NEW_DOCUMENT_FOLDER,
        object: this.object,
        name: null,
        description: null,
        link: null,
        linkName: null,
        isEdit: this.isEdit
    };

    this.init = function () {

        var validKey = 'a' + this.corporateKey;
        var adsRootGroup = AUDIConfigReader.getConfigString(validKey, "ADSAttachment", null, "ModellObjektDialog.xml");
        this.getPageElement(0, "DOCUMENT_HANDLING_DIALOG_ADS_LINK_TEXT_BOX").setEnabled(false);

        if (adsRootGroup === null) {
            this.getPageElement(0, "DOCUMENT_HANDLING_DIALOG_ADS_LINK_NAME_TEXT").setVisible(false);
            this.getPageElement(0, "DOCUMENT_HANDLING_DIALOG_ADS_LINK_NAME_TEXT_BOX").setVisible(false);
            this.getPageElement(0, "DOCUMENT_HANDLING_DIALOG_ADS_LINK_TEXT").setVisible(false);
            this.getPageElement(0, "DOCUMENT_HANDLING_DIALOG_ADS_LINK_TEXT_BOX").setVisible(false);
            this.getPageElement(0, "DOCUMENT_HANDLING_DIALOG_ADS_LINK_PUSH_BUTTON").setVisible(false);
        }

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

    this.isInValidState = function (pageNumber) {

        var textBox = this.getPageElement(0, "DOCUMENT_HANDLING_DIALOG_NAME_TEXT_BOX");
        if (!this.isEdit) return textBox.getText().length() > 0;
        return true;
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

    this.DOCUMENT_HANDLING_DIALOG_ADS_LINK_PUSH_BUTTON_pressed = function () {

        var validKey = 'a' + this.corporateKey;
        var adsRootGroup = AUDIConfigReader.getConfigString(validKey, "ADSAttachment", "", "ModellObjektDialog.xml");
        var dialogFunction = new ADSHandlingDialog(adsRootGroup, this.locale);
        this.dialog.setSubDialog("ADS_HANDLING_SUBDIALOG", dialogFunction, Constants.DIALOG_TYPE_ACTION, getString("ASSIGN_ADS_DOCUMENT_TITLE"));
    }

    this.ADS_HANDLING_SUBDIALOG_subDialogClosed = function (subResult, bOk) {

        if (bOk) {
            this.getPageElement(0, "DOCUMENT_HANDLING_DIALOG_ADS_LINK_TEXT_BOX").setText(subResult.documentUrl);
            this.getPageElement(0, "DOCUMENT_HANDLING_DIALOG_ADS_LINK_NAME_TEXT_BOX").setText(subResult.documentName);
        }
    }

}

DocumentHandlingDialog.prototype.getPageElement = function (pageNumber, elementIdentifier) {
    var page = this.dialog.getPage(pageNumber);
    if (page === null) return null;

    return page.getDialogElement(elementIdentifier);
}
DocumentHandlingDialog.prototype.createPage = function () {

    var template = Dialogs.createNewDialogTemplate(0, 0, 480, 220, getString("DOCUMENT_HANDLING_DIALOG_TITLE")); //Document handling
    // dialog  Dokumentenbearbeitung

    template.GroupBox(5, 10, 490, 220, getString("DOCUMENT_HANDLING_DIALOG_GROUP_BOX"));
    template.Text(10, 15, 475, 20, getString("DLG_ALLOC_11"), "DOCUMENT_HANDLING_DIALOG_NAME_TEXT");
    template.TextBox(10, 27, 475, 20, "DOCUMENT_HANDLING_DIALOG_NAME_TEXT_BOX");
    template.Text(10, 50, 475, 20, getString("DLG_ALLOC_22"), "DOCUMENT_HANDLING_DIALOG_DESC_TEXT");
    template.TextBox(10, 63, 475, 80, "DOCUMENT_HANDLING_DIALOG_DESC_TEXT_BOX", 1);
    template.Text(10, 143, 475, 20, getString("DOCUMENT_HANDLING_DIALOG_ADS_LINK_NAME_TEXT"),
        "DOCUMENT_HANDLING_DIALOG_ADS_LINK_NAME_TEXT");
    template.TextBox(10, 155, 420, 20, "DOCUMENT_HANDLING_DIALOG_ADS_LINK_NAME_TEXT_BOX");
    template.Text(10, 173, 475, 20, getString("DOCUMENT_HANDLING_DIALOG_ADS_LINK_TEXT"), "DOCUMENT_HANDLING_DIALOG_ADS_LINK_TEXT");
    template.TextBox(10, 185, 420, 30, "DOCUMENT_HANDLING_DIALOG_ADS_LINK_TEXT_BOX", 1);
    template.PushButton(440, 183, 48, 16, "...", "DOCUMENT_HANDLING_DIALOG_ADS_LINK_PUSH_BUTTON");

    return template;

}

function ADSHandlingDialog(adsRootGroup, locale) {

    this.adsRootGroup = adsRootGroup;
    this.selectedDocument = null;
    this.locale = locale;
    this.adsComponent = Context.getComponent("ADS");
    this.cache = [];
    this.tree = null;
    this.selectedFolderPath = null;

    this.dialogResult = {
        isOk: false,
        documentUrl: "",
        documentName: ""
    };
    this.init = function () {

        this.clearTree();
        this.loadADSRootContent();
        this.getPageElement(0,"ADS_DOCUMENT_TREE").setSelection([0]);
        this.ADS_DOCUMENT_TREE_selChanged(0);
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
        if (this.selectedDocument !== null) {
            this.dialogResult.documentUrl = this.selectedDocument.item.getHyperLink();
            this.dialogResult.documentName = this.selectedDocument.item.getDocumentMetaInfo().getDocumentName();

        }
    }
    this.isInValidState = function () {

        var newButton = this.getPageElement(0, "ADS_DOCUMENT_NEW_BUTTON");
        var addButton = this.getPageElement(0, "ADS_DOCUMENT_ADD_BUTTON");
        var deleteButton = this.getPageElement(0, "ADS_DOCUMENT_DELETE_BUTTON");
        var table = this.getPageElement(0, "ADS_FOLDER_CONTENT_TABLE");
        var treeBox = this.getPageElement(0, "ADS_DOCUMENT_TREE");

        addButton.setEnabled(false);
        deleteButton.setEnabled(false);
        newButton.setEnabled(false);


        if (this.selectedDocument !== null) deleteButton.setEnabled(true);
        if (table.getItems().length > 0 && this.selectedDocument === null) addButton.setEnabled(true);
        if (treeBox.getSelection() !== null && treeBox.getSelection().length === 1) newButton.setEnabled(true);

        return this.selectedDocument !== null;
    }
    this.ADS_DOCUMENT_TREE_selChanged = function (selection) {

        var those = this;
        var node = this.findItemByTreeIndex(selection);
        if (node === null) return false;
        this.cache = [];
        var repository = this.adsComponent.getADSRepository("portal");
        var files = repository.getAllDocuments(node.item);
        this.selectedFolderPath = node.item.getPath();
        if (files.length === 0) return this.reloadContentTable()
        this.cache = files.filter(function (file) {
                              if (those.selectedDocument === null) return true;
                              return !those.selectedDocument.item.getIdentifier().equalsIgnoreCase(file.getIdentifier());
                          })
                          .map(function (file) {
                              return new ADSVirtualNode(file, ADS_ITEM_TYPE_FILE);
                          });

        this.reloadContentTable();

    }
    this.ADS_DOCUMENT_SEARCH_TEXT_BOX_changed = function () {

        var those = this;
        this.cache = [];

        var textBox = this.getPageElement(0, "ADS_DOCUMENT_SEARCH_TEXT_BOX");

        var repository = this.adsComponent.getADSRepository("portal");
        var text = textBox.getText().toLowerCase();

        if (text.length() === 0) {
            this.reloadContentTable();
            return false;
        }

        var stack = [];
        var index = 0;
        var item = this.findItemByTreeIndex(index++);
        stack.push(item);

        while (stack.length > 0) {
            var adsItem = stack.pop();
            var files = repository.getAllDocuments(adsItem.item).filter(function (file) {
                var documentMetaInfo = file.getDocumentMetaInfo();
                var fileName = documentMetaInfo.getFileName().toLowerCase();
                var documentName = documentMetaInfo.getDocumentName().toLowerCase();
                return fileName.contains(text) || documentName.contains(text);
            });
            if (files.length > 0) {
                var items = files.filter(function (file) {
                                     if (those.selectedDocument === null) return true;
                                     return !those.selectedDocument.item.getIdentifier().equalsIgnoreCase(file.getIdentifier());
                                 })
                                 .map(function (file) {
                                     return new ADSVirtualNode(file, ADS_ITEM_TYPE_FILE);
                                 });
                this.cache.push.apply(this.cache, items);
            }
            item = this.findItemByTreeIndex(index++);
            if (item !== null) stack.push(item);

        }
        this.reloadContentTable();
    }
    this.ADS_DOCUMENT_ADD_BUTTON_pressed = function () {
        var table = this.getPageElement(0, "ADS_FOLDER_CONTENT_TABLE");
        var index = table.getSelection();

        this.selectedDocument = new ADSVirtualNode(this.cache[index].item, ADS_ITEM_TYPE_FILE);
        var those = this;
        this.cache = this.cache.filter(function (subItem) {
                return !subItem.item.getIdentifier().equalsIgnoreCase(those.selectedDocument.item.getIdentifier());
            }
        );
        table.setSelection([]);
        this.reloadAssignTable();
        this.reloadContentTable();
    }
    this.ADS_DOCUMENT_DELETE_BUTTON_pressed = function () {

        this.cache.push(new ADSVirtualNode(this.selectedDocument.item, ADS_ITEM_TYPE_FILE));
        this.selectedDocument = null;
        this.reloadAssignTable();
        this.reloadContentTable();
    }
    this.ADS_DOCUMENT_NEW_BUTTON_pressed = function () {

        this.getPageElement(0, "ADS_DOCUMENT_ASSIGN_GROUP").setEnabled(false);
        this.getPageElement(0, "ADS_DOCUMENT_ASSIGN_GROUP").setEnabled(false);
        this.getPageElement(0, "ADS_DOCUMENT_SEARCH_TEXT_BOX").setEnabled(false);
        this.getPageElement(0, "ADS_DOCUMENT_TREE").setEnabled(false);
        this.getPageElement(0, "ADS_FOLDER_CONTENT_TABLE").setEnabled(false);
        this.getPageElement(0, "ADS_DOCUMENT_NEW_BUTTON").setEnabled(false);
        this.getPageElement(0, "ADS_DOCUMENT_ADD_BUTTON").setEnabled(false);
        this.getPageElement(0, "ADS_FOLDER_ASSIGNED_TABLE").setEnabled(false);
        this.getPageElement(0, "ADS_DOCUMENT_DELETE_BUTTON").setEnabled(false);

        var dialogFunction = new ADSNewObjectDialog(this.selectedFolderPath, this.locale);
        this.dialog.setSubDialog("ADS_CREATING_SUBDIALOG", dialogFunction, Constants.DIALOG_TYPE_ACTION, getString("ADS_NEW_DOCUMENT_TITLE"));

    }
    this.ADS_CREATING_SUBDIALOG_subDialogClosed = function (subResults, bOk) {
        this.getPageElement(0, "ADS_DOCUMENT_ASSIGN_GROUP").setEnabled(true);
        this.getPageElement(0, "ADS_DOCUMENT_ASSIGN_GROUP").setEnabled(true);
        this.getPageElement(0, "ADS_DOCUMENT_SEARCH_TEXT_BOX").setEnabled(true);
        this.getPageElement(0, "ADS_DOCUMENT_TREE").setEnabled(true);
        this.getPageElement(0, "ADS_FOLDER_CONTENT_TABLE").setEnabled(true);
        this.getPageElement(0, "ADS_DOCUMENT_NEW_BUTTON").setEnabled(true);
        this.getPageElement(0, "ADS_DOCUMENT_ADD_BUTTON").setEnabled(true);
        this.getPageElement(0, "ADS_FOLDER_ASSIGNED_TABLE").setEnabled(true);
        this.getPageElement(0, "ADS_DOCUMENT_DELETE_BUTTON").setEnabled(true);
        if (bOk) {
            this.clearTree();
            this.loadADSRootContent();
            this.getPageElement(0, "ADS_FOLDER_CONTENT_TABLE").setItems([]);
        }
        return bOk;
    }
}

ADSHandlingDialog.prototype.getPageElement = function (pageNumber, elementIdentifier) {
    var page = this.dialog.getPage(pageNumber);
    if (page === null) return null;

    return page.getDialogElement(elementIdentifier);
}
ADSHandlingDialog.prototype.createPage = function () {

    var page = Dialogs.createNewDialogTemplate(0, 0, 640, 340, getString("ASSIGN_ADS_DOCUMENT_TITLE"));

    page.GroupBox(15, 8, 682, 240, getString("ADS_DOCUMENT_ASSIGN_GROUP_BOX"), "ADS_DOCUMENT_ASSIGN_GROUP")
    page.Text(20, 12, 672, 20, getString("SEARCH_TEXT_BOX"), "ADS_DOCUMENT_SEARCH_TEXT_LABEL");
    page.TextBox(20, 25, 672, 20, "ADS_DOCUMENT_SEARCH_TEXT_BOX");
    page.Text(20, 45, 672, 20, getString("ADS_DOCUMENT_ASSIGN_LIST_BOX"), "ADS_DOCUMENT_ASSIGN_LIST_LABEL");
    page.Tree(20, 57, 235, 165, "ADS_DOCUMENT_TREE");
    page.Table(260, 57, 435, 165,
        [
            getString("ADSHANDLING_TABLE_COLUMN_ONE"),
            getString("ADSHANDLING_TABLE_COLUMN_TWO"),
            "hash"
        ],
        [
            Constants.TABLECOLUMN_MULTILINE,
            Constants.TABLECOLUMN_MULTILINE,
            Constants.TABLECOLUMN_SINGLELINE,

        ],
        [
            50, 49, 1
        ],
        "ADS_FOLDER_CONTENT_TABLE",
        Constants.TABLE_STYLE_DEFAULT);

    page.PushButton(420, 221, 130, 20, getString("ADS_DOCUMENT_NEW_BUTTON"), "ADS_DOCUMENT_NEW_BUTTON");
    page.PushButton(555, 221, 130, 20, getString("DLG_ALLOC_3"), "ADS_DOCUMENT_ADD_BUTTON");


    page.GroupBox(15, 250, 682, 132, getString("DOCUMENT_ASSIGNED_DIALOG_GROUP_BOX"), "ADS_DOCUMENT_ASSIGNED_GROUP");
    page.Table(20, 255, 672, 100,
        [
            getString("ADSHANDLING_TABLE_COLUMN_ONE"),
            getString("ADSHANDLING_TABLE_COLUMN_TWO")
        ],
        [
            Constants.TABLECOLUMN_MULTILINE,
            Constants.TABLECOLUMN_MULTILINE

        ],
        [
            50, 50
        ],
        "ADS_FOLDER_ASSIGNED_TABLE",
        Constants.TABLE_STYLE_DEFAULT);
    page.PushButton(555, 355, 130, 20, getString("ABSTIMPROTOCOL_DELETE_BUTTON_TEXT"), "ADS_DOCUMENT_DELETE_BUTTON");
    return page;
}
ADSHandlingDialog.prototype.loadADSRootContent = function () {

    var repository = this.adsComponent.getADSRepository("portal");
    var rootGroup = repository.getFolder(this.adsRootGroup);

    this.buildTree(rootGroup, repository);
    this.fillTreeElement();

}
ADSHandlingDialog.prototype.getItemName = function (item) {

    if (item.type === ADS_ITEM_TYPE_GROUP) return item.item.getFolderName();
    var documentName = item.item.getDocumentMetaInfo().getDocumentName();
    var fileName = item.item.getDocumentMetaInfo().getFileName();
    var suffix = fileName.substring(fileName.lastIndexOf("."));
    return documentName + suffix;
}
ADSHandlingDialog.prototype.buildTree = function (rootGroup, repository) {

    this.tree = new ADSVirtualNode(rootGroup, ADS_ITEM_TYPE_GROUP);
    var stack = [this.tree];
    while (stack.length > 0) {

        var item = stack.pop();
        if (item.type === ADS_ITEM_TYPE_GROUP) {

            var childGroups = repository.getExistingChildFolders(item.item);
            if (childGroups.length > 0) {

                childGroups.forEach(function (childGroup) {
                    writeLog(sm72tc,
                        "Group " + item.item.getFolderName() + " contains group " + childGroup.getFolderName(),
                        "info");
                    var node = new ADSVirtualNode(childGroup, ADS_ITEM_TYPE_GROUP);
                    item.children.push(node);
                    stack.push(node);
                });

            }
        }
    }
}
ADSHandlingDialog.prototype.clearTree = function () {

    var treeElement = this.getPageElement(0, "ADS_DOCUMENT_TREE");
    treeElement.deleteItemByIndex(0);
}
ADSHandlingDialog.prototype.fillTreeElement = function () {

    var treeElement = this.getPageElement(0, "ADS_DOCUMENT_TREE");
    var index = 0;

    this.tree.treeIndex = index;
    var rootTreeItem = treeElement.addChild(null, this.getItemName(this.tree), index++);

    for (var position = 0; position < this.tree.children.length; position++) {
        var child = this.tree.children[position];
        index = this.insertTreeItem(treeElement, rootTreeItem, child, index);
    }

}
ADSHandlingDialog.prototype.insertTreeItem = function (treeElement, rootTreeItem, child, index) {

    child.treeIndex = index;
    rootTreeItem = treeElement.addChild(rootTreeItem, this.getItemName(child), index++);
    if (child.children.length === 0) return index;
    for (var position = 0; position < child.children.length; position++) {
        index = this.insertTreeItem(treeElement, rootTreeItem, child.children[position], index);
    }
    return index;
}
ADSHandlingDialog.prototype.findItemByTreeIndex = function (index) {

    var result = []
    result = this.findSpecificNodeByTreeIndex(this.tree, index, result);
    return result.length === 0 ? null : result[0];

}
ADSHandlingDialog.prototype.findSpecificNodeByTreeIndex = function (node, index, result) {

    if (node.treeIndex === index) result.push(node);

    for (var position = 0; position < node.children.length; position++) {
        this.findSpecificNodeByTreeIndex(node.children[position], index, result);
    }
    return result;
}
ADSHandlingDialog.prototype.reloadContentTable = function () {

    var table = this.getPageElement(0, "ADS_FOLDER_CONTENT_TABLE");

    var items = this.cache
                    .map(function (node) {
                        var fileName = node.item.getDocumentMetaInfo().getFileName();
                        var documentName = node.item.getDocumentMetaInfo().getDocumentName();
                        var identifier = node.item.getIdentifier();
                        return [fileName, documentName, identifier];
                    });

    table.setItems(items);
}
ADSHandlingDialog.prototype.reloadAssignTable = function () {

    var table = this.getPageElement(0, "ADS_FOLDER_ASSIGNED_TABLE");
    if (this.selectedDocument === null) table.setItems([]);
    else {
        var filename = this.selectedDocument.item.getDocumentMetaInfo().getFileName();
        var documentName = this.selectedDocument.item.getDocumentMetaInfo().getDocumentName();
        writeLog(sm72tc, "filename " + filename, "info");
        writeLog(sm72tc, "documentName " + documentName, "info");

        table.setItems([[filename, documentName]]);
    }
}

function ADSNewObjectDialog(folderPath, locale) {

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
        ;
        var description = this.getPageElement(0, "DESCRIPTION_TEXT_BOX").getText();
        ;
        var adsMananger = new ADSManager();
        var db = ArisData.getActiveDatabase();
        var user = ArisData.ActiveUser();
        var rights = adsMananger.assignADSPriviledges(db, user, "010100|0|0 Libraries|7b7a7dc1-8892-11eb-7c47-005056af6d0b|U|RWD");
        if (!rights) writeLog(sm72tc, "Access to usergroup 010100|0|0 Libraries|7b7a7dc1-8892-11eb-7c47-005056af6d0b|U|RWD was not" +
            " granted");
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
        rights = adsMananger.unassignADSPriviledges(db, user, "010100|0|0 Libraries|7b7a7dc1-8892-11eb-7c47-005056af6d0b|U|RWD");
        if (!rights) writeLog(sm72tc, "Access to usergroup 010100|0|0 Libraries|7b7a7dc1-8892-11eb-7c47-005056af6d0b|U|RWD was not" +
            " removed");


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

ADSNewObjectDialog.prototype.getPageElement = function (pageNumber, elementIdentifier) {
    var page = this.dialog.getPage(pageNumber);
    if (page === null) return null;

    return page.getDialogElement(elementIdentifier);
}
ADSNewObjectDialog.prototype.createPage = function () {

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

