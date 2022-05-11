function ERMObjectEditSubDialog(object, locale, isEdit) {

    this.object = object;
    this.locale = locale;
    this.isEdit = isEdit;
    this.ermModel = this.getERMAttributeModel(object);
    this.dialogResult = {
        isOk: false
    }
    this.assignedObjects = [];
    this.cache = [];
    this.tree = null;
    this.searchContext = null;
    this.database = ArisData.getActiveDatabase();
    this.selectedTreeNode = null;

    this.getPages = function () {

        return [this.createPage()];
    }

    this.init = function () {
        if (this.isEdit) {

            var textBox = this.getPageElement(0, "EOE_NAME_TEXT");
            var descriptionBox = this.getPageElement(0, "EOE_DESCRIPTION_TEXT");

            textBox.setText(BaseDialog.getMaintainedObjectName(this.object, this.locale));
            descriptionBox.setText(
                BaseDialog.getMaintainedObjectAttribute(this.object, Constants.AT_DESC, this.locale));

            this.setCurrentAssignedObjects(this.ermModel);
        }

        this.fillTree();
    }

    this.isInValidState = function () {

        this.validElementsListBoxButtons();
        this.validAssignedListBoxButtons();
        var nameTextBox = this.getPageElement(0,"EOE_NAME_TEXT");
        return nameTextBox.getText().length() > 0
    }

    this.onClose = function (pageNumber, bOk) {
        this.dialogResult.isOk = bOk;
        this.dialogResult.isEdit = this.isEdit;
        this.dialogResult.object = this.object;
        this.dialogResult.assignedERMAttributes = this.assignedObjects;
        this.dialogResult.newName = this.getPageElement(0, "EOE_NAME_TEXT").getText();
        this.dialogResult.newDescription = this.getPageElement(0, "EOE_DESCRIPTION_TEXT").getText();

    }

    this.getResult = function () {
        return this.dialogResult;
    }

    this.EOE_KPI_SUBGROUPS_TREE_BOX_selChanged = function (selectedIndex) {

        try {
            this.treeBoxChangeEvent(selectedIndex);
        } catch (ex) {
            writeLog(sm72tc, "Event EOE_KPI_SUBGROUPS_TREE_BOX_selChanged", "info");
            writeLog(sm72tc, "Exception occurred " + ex, "error");
            throw ex;
        }

    }

    this.EOE_ADD_KPI_PUSH_BUTTON_pressed = function () {
        try {
            this.addButtonPressEvent();
        } catch (ex) {
            writeLog(sm72tc, "Event EOE_ADD_KPI_PUSH_BUTTON_pressed", "info");
            writeLog(sm72tc, "Exception occurred " + ex, "error");
            throw ex;
        }
    }

    this.EOE_KPI_REMOVE_BUTTON_pressed = function () {

        try {
            this.deleteButtonPressEvent();
        } catch (ex) {
            writeLog(sm72tc, "Event EOE_KPI_REMOVE_BUTTON_pressed", "info");
            writeLog(sm72tc, "Exception occurred " + ex, "error");
            throw ex;

        }


    }

    this.EOE_SEARCH_KPI_TEXT_changed = function () {

        this.cache = [];

        var searchBox = this.getPageElement(0, "EOE_SEARCH_KPI_TEXT");
        var listBox = this.getPageElement(0, "EOE_KPI_ELEMENTS_LIST_BOX");

        if (BaseDialog.isNullOrEmpty(searchBox)) return false;
        if (BaseDialog.isNullOrEmpty(listBox)) return false;
        var searchingText = searchBox.getText();

        if (searchingText.length() === 0) {

            listBox.setItems([]);
            return true;
        }

        this.cache = this.tryToSearch(searchingText);
        var locale = this.locale;
        var items = this.cache
        .sort(function (itemA, itemB) {
            var itemAName = BaseDialog.getMaintainedObjectName(itemA[0], locale);
            var itemBName = BaseDialog.getMaintainedObjectName(itemB[0], locale);
            return BaseDialog.stringSort(itemAName, itemBName);
        })
        .map(function (item) {
            return BaseDialog.getMaintainedObjectName(item[0], locale);
        });

        listBox.setItems(items);
    }

    this.EOE_EDIT_KPI_PUSH_BUTTON_pressed = function () {

        var input = this.getSelectedObject();
        var dialogFunction = new ERMAttributeEditSubDialog(null, input, PRP_Constants.RELEVANT_OBJECT_TYPE, this.locale,
            true);
        this.dialog.setSubDialog("EDIT_OR_CREATE_SUBDIALOG", dialogFunction, Constants.DIALOG_TYPE_ACTION,
            BaseDialog.getStringFromStringTable("EOE_ERM_DIALOG_EDIT_TITLE", this.locale));

    }

    this.EOE_NEW_KPI_PUSH_BUTTON_pressed = function () {
        try {
            var dialogFunction = new ERMAttributeEditSubDialog(PRP_Constants.ERM_ATTRIBUTE_GROUP_GUID, null,
                PRP_Constants.RELEVANT_OBJECT_TYPE, this.locale, false);
            this.dialog.setSubDialog("EDIT_OR_CREATE_SUBDIALOG", dialogFunction, Constants.DIALOG_TYPE_ACTION,
                BaseDialog.getStringFromStringTable("EOE_ERM_DIALOG_NEW_TITLE", this.locale));
        } catch (ex) {
            writeLog(sm72tc, "Action EOE_KPI_REMOVE_BUTTON_pressed was running", "info");
            writeLog(sm72tc, "Exception: " + ex + " line number " + ex.lineNumber, "error");
        }
    }

    this.EDIT_OR_CREATE_SUBDIALOG_subDialogClosed = function (subResult, bOk) {

        try {
            if (!subResult.isOk) return false;
            if (!subResult.isEdit) {

                if (!BaseDialog.isNullOrEmpty(subResult.object)) return false;

                var locale = this.locale;
                var group = ArisData.getActiveDatabase().FindGUID(subResult.folderGUID, Constants.CID_GROUP);
                var firstLetter = subResult.newName.substring(0, 1).toUpperCase();

                var validGroup = group.Childs().filter(function (group) {
                    var name = BaseDialog.getMaintainedObjectName(group, locale);
                    return name.startsWith(firstLetter);
                });
                if (validGroup.length > 0) {
                    if (BaseDialog.isArisObjectNullOrInvalid(validGroup[0])) return false;
                    var object = validGroup[0].CreateObjDef(subResult.objectType, subResult.newName, this.locale);
                    object.Attribute(Constants.AT_DESC, this.locale).setValue(subResult.newDescription);
                    return true;
                }
                else {
                    var validGroup = group.CreateChildGroup(firstLetter, this.locale);
                    if (BaseDialog.isArisObjectNullOrInvalid(validGroup)) return false;
                    var object = validGroup.CreateObjDef(subResult.objectType, subResult.newName, this.locale);
                    object.Attribute(Constants.AT_DESC, this.locale).setValue(subResult.newDescription);
                    return true;
                }

            }

            if (BaseDialog.isNullOrEmpty(subResult.object)) return false;
            subResult.object.Attribute(Constants.AT_NAME, this.locale).setValue(subResult.newName);
            subResult.object.Attribute(Constants.AT_DESC, this.locale).setValue(subResult.newDescription);
        } catch (ex) {
            writeLog(sm72tc, "Action EDIT_OR_CREATE_SUBDIALOG_subDialogClosed was running", "info");
            writeLog(sm72tc, "Exception: " + ex + " line number " + ex.lineNumber, "error");

        } finally {

            if(bOk) {


                this.getPageElement(0, "EOE_KPI_ELEMENTS_LIST_BOX").setSelection([]);
                this.init();

                var searchBox = this.getPageElement(0, "EOE_SEARCH_KPI_TEXT");
                if (!subResult.isEdit) searchBox.setText(object.Name(this.locale));
                else searchBox.setText(subResult.newName);

                this.EOE_SEARCH_KPI_TEXT_changed();
            }


        }
    }


}


ERMObjectEditSubDialog.prototype = Object.create(BaseDialog.prototype);
ERMObjectEditSubDialog.prototype.constructor = ERMObjectEditSubDialog;

ERMObjectEditSubDialog.prototype.createPage = function () {

    var pageHeight = Math.floor(BaseDialog.halfHeight * 1.75);
    var groupBoxHeight = Math.floor((pageHeight - 5) / 5);
    var pageWidth = Math.floor(1.25 * BaseDialog.templateWidth);

    var searchWidth = pageWidth - 40
    var halfPage = Math.floor((pageWidth - 40) / 2.0);
    var page = Dialogs.createNewDialogTemplate(pageWidth, pageHeight, "");

    page.GroupBox(5, 5, pageWidth - 5, groupBoxHeight,
        BaseDialog.getStringFromStringTable("EOE_ASSIGN_GROUP", this.locale), "EOE_ASSIGN_GROUP");
    page.Text(20, 8, pageWidth - 40, 20, "Name", "EOE_NAME_LABEL");
    page.TextBox(20, 20, pageWidth - 40, 20, "EOE_NAME_TEXT");

    page.Text(20, 38, pageWidth - 40, 20, "Description", "EOE_DESCRIPTION_LABEL")
    page.TextBox(20, 50, pageWidth - 40, 20, "EOE_DESCRIPTION_TEXT", 1);

    var secondPartY = 5 + groupBoxHeight;
    var secondGroupBoxHeight = Math.floor(3 * groupBoxHeight);
    var oneThird = Math.floor(secondGroupBoxHeight / 4);

    page.GroupBox(5, secondPartY + 5, pageWidth - 5, secondGroupBoxHeight - 30,
        BaseDialog.getStringFromStringTable("EOE_KPI_ASSIGN_GROUP", this.locale), "EOE_KPI_ASSIGN_GROUP");
    page.Text(20, secondPartY + 8, pageWidth - 40, 20,
        BaseDialog.getStringFromStringTable("FBHP_SEARCH_LABEL", this.locale), "EOE_SEARCH_KPI_LABEL")
    page.TextBox(20, secondPartY + 20, searchWidth, 20, "EOE_SEARCH_KPI_TEXT");

    page.Tree(20, secondPartY + 50, halfPage, 3 * oneThird - 50, "EOE_KPI_SUBGROUPS_TREE_BOX");
    page.ListBox(20 + halfPage, secondPartY + 50, halfPage, 3 * oneThird - 50, [], "EOE_KPI_ELEMENTS_LIST_BOX", 1);
    page.PushButton(20 + pageWidth - 40 - 2 * BaseDialog.pushButtonWidth - 5, secondPartY + 53 + 3 * oneThird - 50,
        BaseDialog.pushButtonWidth, BaseDialog.pushButtoHeight,
        BaseDialog.getStringFromStringTable("EDIT_BUTTON_TEXT", this.locale), "EOE_EDIT_KPI_PUSH_BUTTON");
    page.PushButton(20 + pageWidth - 40 - BaseDialog.pushButtonWidth, secondPartY + 53 + 3 * oneThird - 50,
        BaseDialog.pushButtonWidth, BaseDialog.pushButtoHeight,
        BaseDialog.getStringFromStringTable("NEW_BUTTON_TEXT", this.locale), "EOE_NEW_KPI_PUSH_BUTTON");

    var thirdPartY = 5 + groupBoxHeight + secondGroupBoxHeight - 35;

    page.GroupBox(5, thirdPartY + 15, pageWidth - 5, groupBoxHeight + 50,
        BaseDialog.getStringFromStringTable("EOE_KPI_ASSIGNED_GROUP", this.locale), "EOE_KPI_ASSIGNED_GROUP");


    page.PushButton(12, thirdPartY + 20, BaseDialog.pushButtonWidth, BaseDialog.pushButtoHeight,
        BaseDialog.getStringFromStringTable("ADD_BUTTON_TEXT", this.locale), "EOE_ADD_KPI_PUSH_BUTTON");

    page.PushButton(22 + BaseDialog.pushButtonWidth, thirdPartY + 20, BaseDialog.pushButtonWidth, BaseDialog.pushButtoHeight,
        BaseDialog.getStringFromStringTable("DELETE_BUTTON_TEXT", this.locale), "EOE_KPI_REMOVE_BUTTON");

    page.ListBox(12, thirdPartY + 25 + BaseDialog.pushButtoHeight, pageWidth - 30, groupBoxHeight + 10, [],
        "EOE_KPI_ASSIGNED_LIST_BOX", 1);


    return page;
}
ERMObjectEditSubDialog.prototype.getERMAttributeModel = function (object) {

    if (BaseDialog.isNullOrEmpty(object)) return null;
    var models = object.AssignedModels(PRP_Constants.IE_DATA_MODEL_TYPE);
    if (BaseDialog.isNullOrEmpty(models)) return null;

    return models[0];
}
ERMObjectEditSubDialog.prototype.setCurrentAssignedObjects = function (model) {
    if (BaseDialog.isArisObjectNullOrInvalid(model)) return false;

    var pageElement = this.getPageElement(0, "EOE_KPI_ASSIGNED_LIST_BOX");

    if (BaseDialog.isNullOrEmpty(pageElement)) return false;


    var modelOccurrences = model.ObjOccListFilter(PRP_Constants.RELEVANT_OBJECT_TYPE,
        PRP_Constants.RELEVANT_OBJECT_SYMBOL);

    if (BaseDialog.isNullOrEmpty(modelOccurrences)) return false;

    this.assignedObjects = modelOccurrences.map(function (occurrence) {
        return occurrence.ObjDef();
    })

    var locale = this.locale;
    var items = modelOccurrences.map(function (occurrence) {
        return BaseDialog.getMaintainedObjectName(occurrence.ObjDef(), locale);
    });

    pageElement.setItems(items);
}
ERMObjectEditSubDialog.prototype.fillTree = function () {

    var group = this.database.FindGUID(PRP_Constants.ERM_ATTRIBUTE_GROUP_GUID, Constants.CID_GROUP);

    if (BaseDialog.isArisObjectNullOrInvalid(group)) {
        writeLog(sm72tc, "Cannot found group with guid " + PRP_Constants.ERM_ATTRIBUTE_GROUP_GUID, "error");
        throw new Packages.java.lang.NullPointerException(
            "Cannot found group with guid " + PRP_Constants.ERM_ATTRIBUTE_GROUP_GUID);
    }

    this.tree = this.buildTree(group, PRP_Constants.RELEVANT_OBJECT_TYPE, this.locale);


    var treeElement = this.getPageElement(0, "EOE_KPI_SUBGROUPS_TREE_BOX");
    var listElement = this.getPageElement(0, "EOE_KPI_ELEMENTS_LIST_BOX")

    if (!BaseDialog.isNullOrEmpty(treeElement) && !BaseDialog.isNullOrEmpty(listElement)) {
        treeElement.deleteItemByIndex(0);
        listElement.setItems([]);
        this.searchContext = this.fillTreeElement(this.tree, treeElement, this.locale);
    }
    else {
        writeLog(sm72tc, "Cannot find a tree dialgo element", "error");
        throw new Packages.java.lang.NullPointerException("Cannot find a tree dialog element");
    }

}
ERMObjectEditSubDialog.prototype.findItemByTreeIndexA = function (index) {

    var result = []
    result = this.findSpecificNodeByTreeIndexA(this.tree, index, result);
    return result.length === 0 ? null : result[0]

}
ERMObjectEditSubDialog.prototype.findSpecificNodeByTreeIndexA = function (node, index, result) {

    if (node.treeIndex === index) result.push(node);

    for (var position = 0; position < node.children.length; position++) {
        this.findSpecificNodeByTreeIndexA(node.children[position], index, result);
    }
    return result;
}
ERMObjectEditSubDialog.prototype.getAssignedObjects = function () {
    return this.assignedObjects;
}
ERMObjectEditSubDialog.prototype.tryToSearch = function (searchingText) {
    return this.searchText(searchingText, this.searchContext);
}
ERMObjectEditSubDialog.prototype.getSelectedObject = function () {

    var listBox = this.getPageElement(0, "EOE_KPI_ELEMENTS_LIST_BOX");
    if (BaseDialog.isNullOrEmpty(listBox)) return -1;
    var selectedIndex = listBox.getSelectedIndex();
    if (selectedIndex === -1) return -1;

    return this.cache[selectedIndex][0];
}
ERMObjectEditSubDialog.prototype.getSelectedAssignedObject = function () {

    var listBox = this.getPageElement(0, "EOE_KPI_ASSIGNED_LIST_BOX");
    if (BaseDialog.isNullOrEmpty(listBox)) return -1;
    var selectedIndex = listBox.getSelectedIndex();
    if (selectedIndex === -1) return -1;

    return this.assignedObjects[selectedIndex];
}
ERMObjectEditSubDialog.prototype.rebuildElementsList = function () {

    var listBox = this.getPageElement(0, "EOE_KPI_ELEMENTS_LIST_BOX");

    if (BaseDialog.isNullOrEmpty(listBox)) {
        writeLog(sm72tc, "Cannot find EOE_KPI_ELEMENTS_LIST_BOX in dialog (ERMObjectEditSubDialog)", "error");
        throw new Packages.java.lang.NullPointerException(
            "Cannot find EOE_KPI_ELEMENTS_LIST_BOX in dialog (ERMObjectEditSubDialog)");
    }

    if (this.selectedTreeNode === null) return false;

    this.cache = [];

    var those = this;
    var locale = this.locale;
    var items = this.selectedTreeNode
    .getObjects()
    .filter(function (item) {
        var assignedObjects = those.getAssignedObjects();
        return !assignedObjects.some(function (object) {
            return item.IsEqual(object);
        });
    })
    .sort(function (itemA, itemB) {
        var itemAName = BaseDialog.getMaintainedObjectName(itemA, locale);
        var itemBName = BaseDialog.getMaintainedObjectName(itemB, locale);
        return BaseDialog.stringSort(itemAName, itemBName);
    })
    .map(function (item) {
        those.cache.push([item, those.selectedTreeNode.treeIndex]);
        return BaseDialog.getMaintainedObjectName(item, locale);
    });

    listBox.setItems(items);
}
ERMObjectEditSubDialog.prototype.rebuildAssignedList = function () {

    var assignedListBox = this.getPageElement(0, "EOE_KPI_ASSIGNED_LIST_BOX");

    if (BaseDialog.isNullOrEmpty(assignedListBox)) {
        writeLog(sm72tc, "Cannot find EOE_KPI_ASSIGNED_LIST_BOX in dialog (ERMObjectEditSubDialog)", "error");
        throw new Packages.java.lang.NullPointerException(
            "Cannot find EOE_KPI_ASSIGNED_LIST_BOX in dialog (ERMObjectEditSubDialog)");
    }
    var locale = this.locale;
    var items = this.assignedObjects.map(function (object) {
        return BaseDialog.getMaintainedObjectName(object, locale);
    });

    assignedListBox.setItems(items);
}
ERMObjectEditSubDialog.prototype.setSelectedObjects = function (selectedIndex) {

    var treeBox = this.getPageElement(0, "EOE_KPI_SUBGROUPS_TREE_BOX");

    if (BaseDialog.isNullOrEmpty(treeBox)) {
        writeLog(sm72tc, "Cannot find EOE_KPI_SUBGROUPS_TREE_BOX in dialog (ERMObjectEditSubDialog)", "error");
        throw new Packages.java.lang.NullPointerException(
            "Cannot find EOE_KPI_SUBGROUPS_TREE_BOX in dialog (ERMObjectEditSubDialog)");
    }

    var treeNode = this.findItemByTreeIndexA(selectedIndex);

    if (BaseDialog.isNullOrEmpty(treeNode)) return false;

    this.selectedTreeNode = treeNode;
    treeBox.setSelection([]);
}
ERMObjectEditSubDialog.prototype.validElementsListBoxButtons = function () {

    var elementsListBox = this.getPageElement(0, "EOE_KPI_ELEMENTS_LIST_BOX");
    var editButton = this.getPageElement(0, "EOE_EDIT_KPI_PUSH_BUTTON");

    editButton.setEnabled(false);

    if (elementsListBox.getSelection() !== null && elementsListBox.getSelection().length === 1) editButton.setEnabled(true);

}
ERMObjectEditSubDialog.prototype.validAssignedListBoxButtons = function () {

    var removeButton = this.getPageElement(0, "EOE_KPI_REMOVE_BUTTON");
    var addButton = this.getPageElement(0, "EOE_ADD_KPI_PUSH_BUTTON");
    var assignedListBox = this.getPageElement(0, "EOE_KPI_ASSIGNED_LIST_BOX");
    var elementsListBox = this.getPageElement(0, "EOE_KPI_ELEMENTS_LIST_BOX");


    removeButton.setEnabled(false);
    addButton.setEnabled(false);

    if (assignedListBox.getSelection() !== null && assignedListBox.getSelection().length > 0) removeButton.setEnabled(true);
    if (elementsListBox.getSelection() !== null && elementsListBox.getSelection().length > 0) addButton.setEnabled(true);


}

//Events
ERMObjectEditSubDialog.prototype.addButtonPressEvent = function () {

    var listBox = this.getPageElement(0, "EOE_KPI_ELEMENTS_LIST_BOX");

    if (BaseDialog.isNullOrEmpty(listBox)) {
        writeLog(sm72tc, "Cannot find EOE_KPI_ELEMENTS_LIST_BOX in dialog (ERMObjectEditSubDialog)", "error");
        throw new Packages.java.lang.NullPointerException(
            "Cannot find EOE_KPI_ELEMENTS_LIST_BOX in dialog (ERMObjectEditSubDialog)");
    }


    var selections = listBox.getSelection();
    if (selections.length === 0) return false;

    var objects = this.cache.filter(function (item, index) {
        return selections.some(function (subIndex) {
            return subIndex === index;
        })
    }).map(function (item) {
        return item[0];
    });

    this.assignedObjects.push.apply(this.assignedObjects, objects);
    this.rebuildElementsList();
    this.rebuildAssignedList();
    listBox.setSelection([]);

}
ERMObjectEditSubDialog.prototype.treeBoxChangeEvent = function (selectedIndex) {

    this.setSelectedObjects(selectedIndex);
    this.rebuildElementsList();
    this.rebuildAssignedList();
}
ERMObjectEditSubDialog.prototype.deleteButtonPressEvent = function () {

    var listBox = this.getPageElement(0, "EOE_KPI_ASSIGNED_LIST_BOX");

    if (BaseDialog.isNullOrEmpty(listBox)) {
        writeLog(sm72tc, "Cannot find EOE_KPI_ASSIGNED_LIST_BOX in dialog (ERMObjectEditSubDialog)", "error");
        throw new Packages.java.lang.NullPointerException(
            "Cannot find EOE_KPI_ASSIGNED_LIST_BOX in dialog (ERMObjectEditSubDialog)");
    }

    var selections = listBox.getSelection();
    if (BaseDialog.isNullOrEmpty(selections)) return false;

    this.assignedObjects = this.assignedObjects.filter(function (object, index) {
        return !selections.some(function (subIndex) {
            return subIndex === index
        });
    });

    this.rebuildElementsList();
    this.rebuildAssignedList();
}
