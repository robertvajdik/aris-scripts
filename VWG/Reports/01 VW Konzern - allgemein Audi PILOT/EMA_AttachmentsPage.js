function Item(name, isFolder, object, parent) {
    this.name = String(name);
    this.parent = parent;
    this.isFolder = isFolder;
    this.object = object;
    this.children = [];
    this.treeIndex = -1;
    this.guid = String(object.GUID());
}

Item.prototype.addChild = function (item) {

    var isIn = this.children.some(function (child) {
        return child.name.localeCompare(item.name) === 0;
    });

    if (!isIn) this.children.push(item);
}

function TreeNode(group, objects, locale) {
    this.group = group;
    this.objects = objects;
    this.children = [];
    this.treeIndex = 0;
    this.locale = locale;
    this.groupName = this.getGroupName(locale);
}

TreeNode.prototype.getObjects = function () {
    return this.objects;
}

TreeNode.prototype.getGroupName = function (locale) {
    return this.group.Name(locale);
}

function attachmentsHandling() {
    var assignedDoucuments = transformAttributeToItems(g_tMainObject.tADoc.sAttr_Anlagen_GUID, g_nLoc);
    var dialogResult = runAttachmentsDocumentDialog(CorpKey, assignedDoucuments, g_oStartingModel, g_nLoc);
    if (!dialogResult.isOk) return false;
    g_tMainObject.tADoc.sAttr_Anlagen_GUID = dialogResult.assignedDocuments.map(function (item) {
                                                             return String(item.object.GUID());
                                                         })
                                                         .join(";");

    return true;
}

function AttachmentsPage() {

    var userDialog = Dialogs.createNewDialogTemplate(0, 0, 870, 472,
        g_tMainObject.sName + " (" + g_tMainObject.sType + ")" + (g_bReadOnly === true ? g_sReadOnlyTxt : ""),
        "funcAttachmentsPage");
    userDialog.GroupBox(10, 5, 691, 480, getString("ATTACHMENTS_INFO_GROUP"), "ATTACHMENTS_INFO_GROUP");
    userDialog.Table(20, 14, 582, 450,
        [
            getString("ATTACHMENTS_TABLE_COLUMN_ONE"),
            getString("ATTACHMENTS_TABLE_COLUMN_TWO"),
            getString("ATTACHMENTS_TABLE_COLUMN_THREE"),
            getString("ATTACHMENTS_TABLE_COLUMN_FOUR")
        ],
        [
            Constants.TABLECOLUMN_MULTILINE,
            Constants.TABLECOLUMN_MULTILINE,
            Constants.TABLECOLUMN_MULTILINE,
            Constants.TABLECOLUMN_MULTILINE
        ],
        [25, 25, 25, 25],
        "ATTACHMENTS_RESULT_TABLE",
        Constants.TABLE_STYLE_DEFAULT | Constants.TABLE_STYLE_HEIGHT_2X | Constants.TABLE_STYLE_ALLROWSSAMEHEIGHT
    );

    userDialog.PushButton(625, 14, 48, 16, "...", "ATTACHMENTS_NEW_BUTTON"); //für das doppelklicken im Dialog


    userDialog.CancelButton();
    userDialog.OKButton();
    g_PageSelection.addPageSelectionButtons(userDialog);
    g_LanguageSwitch.addButtons(userDialog);

    var dlg = Dialogs.createUserDialog(userDialog);
    currentDialog = dlg;
    return Dialogs.show(dlg);
}

function funcAttachmentsPage(DlgItem, Action) {

    switch (Action) {

        case 1:
            g_LanguageSwitch.initButtons(currentDialog, g_nLoc);
            currentDialog.setDlgEnable("AttachmentsButton", false);
            currentDialog.setDlgEnable("ATTACHMENTS_RESULT_TABLE", !g_bReadOnly);
            currentDialog.setDlgEnable("ATTACHMENTS_NEW_BUTTON", !g_bReadOnly);
            var items = createAttachmentsTableData(transformAttributeToItems(g_tMainObject.tADoc.sAttr_Anlagen_GUID, g_nLoc));
            currentDialog.setDlgListBoxArray("ATTACHMENTS_RESULT_TABLE", items);
            break;
        case 2:
            switch (DlgItem) {
                case "OK":
                    c_DlgValue = c_Button_OK;
                    return false;
                case "Cancel":
                    c_DlgValue = c_Button_CANCEL;
                    return false;
                case "btnLangSelected":
                    g_tMainObject.saveValues();
                    // TMainObject in anderer Sprache initialisieren.
                    g_nLoc = g_nSelectedLoc;
                    g_tMainObject.init(g_nLoc);
                    g_LanguageSwitch.changeLanguage(currentDialog);
                    return true;
                case "btnLangDefault": // Objektattribute werden nicht in andere Sprache kopiert
                    g_tMainObject.saveValues();
                    // report zum kopieren in andere Sprachen aufrufen
                    var sScriptID = AUDIConfigReader.getConfigString("ReportCategory", "CommonReports", "ZAUDICOMMON",
                        "AUDI_Config.xml");
                    var report = Context.getComponent("Report");
                    var execInf = report.createExecInfo(sScriptID + "/956f1bd0-8351-11de-7e09-001a6b3c78e6",
                        [g_oStartingModel], g_nLoc);
                    execInf.setProperty("maintainAlternativeLangOnly", "true");
                    report.execute(execInf);
                    try {
                        g_oSourceDB.refreshObjects([g_oStartingModel], false);
                    } catch (e) {
                    }
                    // TMainObject in anderer Sprache initialisieren.
                    g_nLoc = g_nAlterLoc;
                    g_tMainObject.init(g_nLoc);
                    g_LanguageSwitch.changeLanguage(currentDialog);
                    return true;
                case "ATTACHMENTS_NEW_BUTTON":
                    c_DlgValue = 20002;
                    return false;
                default:
                    return g_PageSelection.changePage(currentDialog, DlgItem, g_threadLoader);
            }
    }
}

function createAttachmentsTableData(input) {

    return input.reduce(function (array, item) {
        var description = item.object.Attribute(Constants.AT_DESC, g_nLoc).getValue();
        var link = item.object.Attribute(Constants.AT_ADS_LINK_1, g_nLoc).getValue();
        var linkName = item.object.Attribute(Constants.AT_ADS_TITL1, g_nLoc).getValue();

        array.push(item.name);
        array.push(description);
        array.push(linkName);
        array.push(link);

        return array;
    }, []);

}

function transformAttributeToItems(guids, locale) {
    var objects = String(guids)
        .split(";")
        .map(function (guid) {
            return ArisData.getActiveDatabase().FindGUID(guid, Constants.CID_OBJDEF);
        })
        .filter(function (object) {
            return object.IsValid()
        })
        .map(function (object) {
            var group = object.Group();
            var parentItem = new Item(group.Name(locale), true, group, null);
            return new Item(object.Name(locale), false, object, parentItem);
        });

    return ArisData.sort(objects, Constants.AT_NAME, locale);

}

function runAttachmentsDocumentDialog(corporateKey, assignedDocuments, model, locale) {

    var dialogFunction = new AttachmentsDocumentDialog(corporateKey, assignedDocuments, model, locale);
    return Dialogs.showDialog(dialogFunction, Constants.DIALOG_TYPE_ACTION, getString("ASSIGN_ATTACHMENTS_DIALOG_TITLE"));

}

function AttachmentsDocumentDialog(corporateKey, assignedDocuments, model, locale) {

    this.assignedDocuments = assignedDocuments;
    this.oldAssignedDocuments = assignedDocuments.map(function (item) {
        return item;
    });
    this.corporateKey = corporateKey;
    this.documentStructure = null;
    this.model = model;
    this.locale = locale;
    this.cache = [];
    this.dialogResult = {
        isOk: false
    }

    this.init = function () {

        this.clearTree();
        this.loadDocumentsStructure();
        this.initDocumentTree();
        this.reloadListBox();
        if (this.assignedDocuments.length > 0) {
            var assignedListBox = this.getPageElement(0, "ATTACHMENTS_ASSIGNED_LIST_BOX");
            var items = this.assignedDocuments.map(function (item) {
                return item.name;
            });
            assignedListBox.setItems(items);
        }


    }
    this.isInValidState = function () {

        var assignedListBox = this.getPageElement(0, "ATTACHMENTS_ASSIGNED_LIST_BOX");
        var assignListBox = this.getPageElement(0, "ATTACHMENTS_ASSIGN_LIST_BOX");
        var addPushButton = this.getPageElement(0, "ATTACHMENTS_ADD_BUTTON");
        var editPushButton = this.getPageElement(0, "ATTACHMENTS_EDIT_BUTTON");
        var deletePushButton = this.getPageElement(0, "ATTACHMENTS_DELETE_BUTTON");



        addPushButton.setEnabled(false);
        editPushButton.setEnabled(false);
        deletePushButton.setEnabled(false);

        if (assignedListBox.getItems().length > 0) {
            if (assignedListBox.getSelection() !== null && assignedListBox.getSelection().length > 0) deletePushButton.setEnabled(
                true);
        }
        if (assignListBox.getItems().length > 0) {
            if (assignListBox.getSelection() !== null && assignListBox.getSelection().length === 1) editPushButton.setEnabled(true);
            if (assignListBox.getSelection() !== null && assignListBox.getSelection().length > 0) addPushButton.setEnabled(true);
        }



        return this.isChanged();
    }
    this.getPages = function () {
        var pages = [];
        pages.push(this.createPage());
        return pages;
    }
    this.onClose = function (pageNumber, bOk) {
        this.dialogResult.isOk = bOk;
        this.dialogResult.assignedDocuments = this.assignedDocuments;
    }
    this.getResult = function () {
        return this.dialogResult;
    }
    this.ATTACHMENTS_TREE_selChanged = function (selection) {
        var those = this;
        var item = this.findItemByTreeIndex(selection);
        this.cache = item.getObjects().filter(function (item) {
            return !those.assignedDocuments.some(function (subItem) {
                return item.guid.startsWith(subItem.guid)
            });
        })
        this.reloadListBox();

    }
    this.ATTACHMENTS_ADD_BUTTON_pressed = function () {
        var listBox = this.getPageElement(0, "ATTACHMENTS_ASSIGN_LIST_BOX");
        var assignedListBox = this.getPageElement(0, "ATTACHMENTS_ASSIGNED_LIST_BOX");
        var selection = listBox.getSelection();
        var locale = this.locale;
        if (selection === null || selection.length === 0) return false;

        var notValidDocument =  this.cache.filter(function (item, index) {
            return selection.some(function (number) {
                return number === index;
            });
        }).some(function(item){
            return !item.object.Attribute(Constants.AT_ADS_LINK_1,locale).IsMaintained();
        });

        if(notValidDocument) {

            this.dialog.setMsgBox("WARNING_DIALOG",getString("NOT_VALID_DOCUMENT_MESSAGE"),
                Constants.MSGBOX_BTN_OK | Constants.MSGBOX_ICON_WARNING, getString("WARNING_DIALOG_TITLE") );

            return false;
        }

        var listBoxItems = this.cache.filter(function (item, index) {
            return selection.some(function (number) {
                return number === index;
            });
        })
        this.cache = this.cache.filter(function (item) {
            return !listBoxItems.some(function (subItem) {
                return subItem.name.localeCompare(item.name) === 0;
            });        })
        this.assignedDocuments.push.apply(this.assignedDocuments, listBoxItems);
        assignedListBox.setItems(this.mapAssignedItems());
        this.reloadListBox();
    }
    this.ATTACHMENTS_DELETE_BUTTON_pressed = function () {

        var assignedListBox = this.getPageElement(0, "ATTACHMENTS_ASSIGNED_LIST_BOX");
        var treeBoxElement = this.getPageElement(0,"ATTACHMENTS_TREE");
        this.removeFromAssignedItems(assignedListBox);

        if(treeBoxElement.getSelection()!== null && treeBoxElement.getSelection().length > 0) {
            this.ATTACHMENTS_TREE_selChanged(treeBoxElement.getSelection()[0]);
        }
    }
    this.ATTACHMENTS_SEARCH_TEXT_BOX_changed = function () {

        var treeBoxElement = this.getPageElement(0,"ATTACHMENTS_TREE");
        var textBox = this.getPageElement(0, "ATTACHMENTS_SEARCH_TEXT_BOX");
        var text = textBox.getText();

        this.cache = [];
        if (text.length() === 0) {
            if(treeBoxElement.getSelection()!== null && treeBoxElement.getSelection().length > 0) {
                this.ATTACHMENTS_TREE_selChanged(treeBoxElement.getSelection()[0]);
            }
            return false;
        }
        var those = this;
        var stack = [this.documentStructure];
        while (stack.length > 0) {

            var data = stack.pop();
            var found = data.getObjects().filter(function (object) {
                writeLog(sm72tc,"Object "+ object.name,"info");
                writeLog(sm72tc,new Packages.java.lang.String(object.name.toLowerCase()).contains(text.toLowerCase()),"info");

                return new Packages.java.lang.String(object.name.toLowerCase()).contains(text.toLowerCase());
            });

            found = found.filter(function(item){
                return !those.assignedDocuments.some(function(document){
                    return new Packages.java.lang.String(document.name).equalsIgnoreCase(item.name);
                });
            })

            if (found.length > 0) {
                this.cache.push.apply(this.cache, found);
            }
            if (data.children.length > 0) stack.push.apply(stack, data.children);
        }

        this.reloadListBox(false);
    }
    this.ATTACHMENTS_NEW_BUTTON_pressed = function () {

        var dialogFunction = new DocumentHandlingDialog(this.corporateKey, null, this.locale, false, true);
        this.dialog.setSubDialog("ATTACHMENT_SUB_DIALOG", dialogFunction, Constants.DIALOG_TYPE_ACTION, getString("ASSIGN_DOCUMENT_DIALOG_TITLE"));
    }
    this.ATTACHMENTS_EDIT_BUTTON_pressed = function () {

        var listBox = this.getPageElement(0, "ATTACHMENTS_ASSIGN_LIST_BOX");
        var selection = listBox.getSelection();
        var object = this.cache[selection[0]].object;
        var dialogFunction = new DocumentHandlingDialog(this.corporateKey, object, this.locale, true, true);
        this.dialog.setSubDialog("ATTACHMENT_SUB_DIALOG", dialogFunction, Constants.DIALOG_TYPE_ACTION,  getString("ASSIGN_DOCUMENT_DIALOG_TITLE"));
    }
    this.ATTACHMENT_SUB_DIALOG_subDialogClosed = function (subResult, bOk) {

        if (!bOk) return false;
        var object = subResult.object;
        if (!subResult.isEdit && subResult.storeIn === STORE_IN_MODEL_FOLDER) {
            object = this.model.Group().GetOrCreateObjDef(OBJ_DOC, 2, subResult.name, this.locale);
        }
        object.Attribute(Constants.AT_NAME, this.locale).setValue(subResult.name);
        object.Attribute(Constants.AT_DESC, this.locale).setValue(subResult.description);
        object.Attribute(Constants.AT_ADS_LINK_1, this.locale).setValue(subResult.link);
        object.Attribute(Constants.AT_ADS_TITL1, this.locale).setValue(subResult.linkName);
        this.init();
        this.ATTACHMENTS_TREE_selChanged(0);

        return true;
    }
}

AttachmentsDocumentDialog.prototype.createPage = function () {

    var page = Dialogs.createNewDialogTemplate(0, 0, 700, 360,
        g_tMainObject.sName + " (" + g_tMainObject.sType + ")" + (g_bReadOnly === true ? g_sReadOnlyTxt : "")); // %GRID:10,7,1,1

    page.GroupBox(15, 8, 682, 240, getString("ATTACHMENTS_ASSIGN_GROUP"), "ATTACHMENTS_ASSIGN_GROUP")
    page.Text(20, 12, 672, 20, getString("SEARCH_TEXT_BOX"), "ATTACHMENTS_SEARCH_TEXT_LABEL");
    page.TextBox(20, 25, 672, 20, "ATTACHMENTS_SEARCH_TEXT_BOX");
    page.Text(20, 45, 672, 20, getString("ATTACHMENTS_ASSIGN_LIST_BOX"), "ATTACHMENTS_ASSIGN_LIST_LABEL");
    page.Tree(20, 57, 242, 165, "ATTACHMENTS_TREE");
    page.ListBox(260, 57, 440, 165, [], "ATTACHMENTS_ASSIGN_LIST_BOX", 1);
    page.PushButton(285, 221, 130, 20, getString("DLG_ALLOC_4"), "ATTACHMENTS_NEW_BUTTON");
    page.PushButton(420, 221, 130, 20, getString("ABSTIMPROTOCOL_EDIT_BUTTON_TEXT"), "ATTACHMENTS_EDIT_BUTTON");
    page.PushButton(555, 221, 130, 20, getString("DLG_ALLOC_3"), "ATTACHMENTS_ADD_BUTTON");


    page.GroupBox(15, 250, 682, 132, getString("ATTACHMENTS_ASSIGNED_GROUP"), "ATTACHMENTS_ASSIGNED_GROUP");
    page.ListBox(20, 255, 672, 100, [], "ATTACHMENTS_ASSIGNED_LIST_BOX", 1);
    page.PushButton(555, 355, 130, 20, getString("ABSTIMPROTOCOL_DELETE_BUTTON_TEXT"), "ATTACHMENTS_DELETE_BUTTON");

    return page;
}
AttachmentsDocumentDialog.prototype.getPageElement = function (pageNumber, elementIdentifier) {

    var page = this.dialog.getPage(pageNumber);
    if (page === null) return null;
    return page.getDialogElement(elementIdentifier);
}
AttachmentsDocumentDialog.prototype.loadDocumentsStructure = function () {
    var group = this.model.Group()
    var locale = this.locale;

    var objectDefinitions = group.ObjDefListFilter(OBJ_DOC).map(function (object) {
        return new Item(object.Name(locale), false, object, null);
    });

    this.documentStructure = new TreeNode(group, objectDefinitions, this.locale);
    var stack = [this.documentStructure];

    while (stack.length > 0) {

        var node = stack.pop();
        if (node.group.IsValid()) {
            var childGroups = ArisData.sort(node.group.Childs(), Constants.SORT_GROUPPATH, this.locale);
            childGroups.forEach(function (childGroup) {
                var objectDefinitions = childGroup.ObjDefListFilter(OBJ_DOC).map(function (object) {
                    return new Item(object.Name(locale), false, object, null);
                });
                var childNode = new TreeNode(childGroup, objectDefinitions, locale);
                node.children.push(childNode);
                stack.push(childNode);
            });

        }
    }

}
AttachmentsDocumentDialog.prototype.initDocumentTree = function () {
    var treeElement = this.getPageElement(0, "ATTACHMENTS_TREE");

    var index = 0;
    var parentTreeItem = treeElement.addChild(null, this.documentStructure.groupName, index++);
    this.documentStructure.treeIndex = 0;

    for (var position = 0; position < this.documentStructure.children.length; position++) {
        var child = this.documentStructure.children[position];
        index = this.insertTreeItem(treeElement, parentTreeItem, child, index);

    }
}
AttachmentsDocumentDialog.prototype.insertTreeItem = function (treeElement, parentTreeItem, node, index) {

    node.treeIndex = index;
    parentTreeItem = treeElement.addChild(parentTreeItem, node.groupName, index++);

    if (node.children.length === 0) return index;
    for (var position = 0; position < node.children.length; position++) {
        index = this.insertTreeItem(treeElement, parentTreeItem, node.children[position], index);
    }
    return index;
}
AttachmentsDocumentDialog.prototype.findItemByTreeIndex = function (index) {
    var result = [];
    result = this.findSpecificNodeByTreeIndex(this.documentStructure, index, result);
    return result.length === 0 ? null : result[0];
}
AttachmentsDocumentDialog.prototype.findSpecificNodeByTreeIndex = function (node, index, result) {

    if (node.treeIndex === index) result.push(node);

    for (var position = 0; position < node.children.length; position++) {
        this.findSpecificNodeByTreeIndex(node.children[position], index, result);
    }
    return result;
}
AttachmentsDocumentDialog.prototype.mapAssignedItems = function () {
    return this.assignedDocuments.map(function (item) {
        return item.name;
    });
}
AttachmentsDocumentDialog.prototype.reloadListBox = function () {

    var listBox = this.getPageElement(0, "ATTACHMENTS_ASSIGN_LIST_BOX");
    var items = this.cache.map(function (item) {
        return item.name;
    });

    listBox.setItems(items);

}
AttachmentsDocumentDialog.prototype.removeFromAssignedItems = function (listBox) {

    var selection = listBox.getSelection();
    this.assignedDocuments = this.assignedDocuments.filter(function (item, index) {
        return !selection.some(function (number) {
            return index === number
        });
    });

    listBox.setItems(this.mapAssignedItems());
    listBox.setSelection([]);
}
AttachmentsDocumentDialog.prototype.clearTree = function () {

    var treeElement = this.getPageElement(0, "ATTACHMENTS_TREE");
    treeElement.deleteItemByIndex(0);
    this.documentStructure = null;
    this.reloadListBox();

}
AttachmentsDocumentDialog.prototype.isChanged = function () {
    if (this.oldAssignedDocuments.length !== this.assignedDocuments.length) return true;
    var those = this;
    return this.oldAssignedDocuments.every(function (item) {
        return !those.assignedDocuments.some(function (subItem) {
            return item.guid.startsWith(subItem.guid);
        });
    });

}