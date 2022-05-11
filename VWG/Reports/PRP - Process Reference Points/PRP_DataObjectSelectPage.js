function DataObjectSelectPage(pageNumber, locale, dialog) {

    this.pageNumber = pageNumber;
    this.locale = locale;
    this.dialog = dialog;
    this.dataStructure = [];
    this.assignedItems = [];
    this.treeItems = [];
    this.lastIndex = -1;
    this.newObject = null;

}

DataObjectSelectPage.prototype = Object.create(BaseDialog.prototype);
DataObjectSelectPage.prototype.constructor = DataObjectSelectPage;

DataObjectSelectPage.prototype.createPage = function () {

    var height = Math.floor((BaseDialog.templateHeight - 5) / 3.0);
    var width = Math.floor((BaseDialog.templateWidth - 5) / 2.0);

    var page = Dialogs.createNewDialogTemplate(BaseDialog.templateWidth, BaseDialog.templateHeight,
        BaseDialog.getStringFromStringTable("DATA_OBJECT_SELECT_PAGE_TITLE", this.locale));

    page.GroupBox(5, 5, BaseDialog.templateWidth - 5, 2 * height,
        BaseDialog.getStringFromStringTable("DOS_ASSIGN_GROUP_BOX", this.locale), "DOS_ASSIGN_GROUP_BOX");

    page.Text(8, 7, BaseDialog.templateWidth - 10, 20, BaseDialog.getStringFromStringTable("SEARCH_LABEL", this.locale),
        "DOS_SEARCH_TITLE");
    page.TextBox(8, 19, BaseDialog.templateWidth - 10, 20, "DOS_SEARCH_TEXT_BOX");

    var listHeight = (2 * height) - 75;
    page.Text(8, 39, width, 20, BaseDialog.getStringFromStringTable("DOS_TREE_BOX_TITLE", this.locale),
        "DOS_TREE_BOX_TEXT");
    page.Tree(8, 51, width, listHeight, "DOS_TREE_BOX", 1);

    page.Text(8 + width + 4, 39, width, 20, BaseDialog.getStringFromStringTable("DOS_LIST_BOX_TITLE", this.locale),
        "DOS_LIST_BOX_TEXT");
    page.ListBox(8 + width + 4, 51, width - 12, listHeight, [], "DOS_LIST_BOX", 1);

    page.PushButton(BaseDialog.templateWidth - 5 - BaseDialog.pushButtonWidth, 51 + listHeight + 2,
        BaseDialog.pushButtonWidth,
        BaseDialog.pushButtoHeight, BaseDialog.getStringFromStringTable("EDIT_BUTTON_TEXT", this.locale),
        "DOS_EDIT_BUTTON");
    page.PushButton(BaseDialog.templateWidth - 15 - (2 * BaseDialog.pushButtonWidth), 51 + listHeight + 2,
        BaseDialog.pushButtonWidth,
        BaseDialog.pushButtoHeight, BaseDialog.getStringFromStringTable("NEW_BUTTON_TEXT", this.locale),
        "DOS_NEW_BUTTON");

    page.GroupBox(5, 5 + (2 * height) + 5, BaseDialog.templateWidth - 5, height,
        BaseDialog.getStringFromStringTable("DOS_ASSIGNED_GROUP_BOX", this.locale), "DOS_ASSIGNED_GROUP_BOX");

    page.PushButton(12, 14 + (2 * height), BaseDialog.pushButtonWidth, BaseDialog.pushButtoHeight,
        BaseDialog.getStringFromStringTable("ADD_BUTTON_TEXT", this.locale), "DOS_ADD_BUTTON");

    page.PushButton(19 + BaseDialog.pushButtonWidth, 14 + (2 * height), BaseDialog.pushButtonWidth,
        BaseDialog.pushButtoHeight,
        BaseDialog.getStringFromStringTable("DELETE_BUTTON_TEXT", this.locale), "DOS_REMOVE_BUTTON");

   var listBoxHeight = BaseDialog.templateHeight - ( 5 + (2 * height) + BaseDialog.pushButtoHeight + 14);
    page.ListBox(8, 19 + (2 * height) + BaseDialog.pushButtoHeight, BaseDialog.templateWidth - 12, listBoxHeight, [],
        "DOS_ASSIGNED_LIST_BOX", 1);


    return page;
}
DataObjectSelectPage.prototype.init = function () {

    this.clearTree();
    this.loadDataObjects();
    this.initDataObjectTree(this.dataStructure);
}

//Getters
DataObjectSelectPage.prototype.getSelectedObject = function () {

    var treeElement = this.dialog.getPageElement(this.pageNumber, "DOS_TREE_BOX");

    var selection = treeElement.getSelection();
    var item = BaseDialog.findItemByTreeIndex(this.treeItems, selection[0]);
    return item.object.KindNum === Constants.CID_GROUP ? null : item;
}
//Helper function
DataObjectSelectPage.prototype.initDataObjectTree = function (input) {
    var treeElement = this.dialog.getPageElement(this.pageNumber, "DOS_TREE_BOX");

    this.treeItems = input.map(function (item) {
        return item.clone()
    });
    this.lastIndex = this.insertItemsIntoTree(this.treeItems, treeElement);


}
DataObjectSelectPage.prototype.loadDataObjects = function () {

    this.dataStructure = [];
    var group = ArisData.getActiveDatabase().FindGUID(PRP_Constants.dataObjectFolder, Constants.CID_GROUP);
    if (BaseDialog.isArisObjectNullOrInvalid(group)) {
        writeLog(sm72tc, "Cannot found group with guid " + PRP_Constants.dataObjectFolder, "error");
        throw new Packages.java.lang.NullPointerException(
            "Cannot found group with guid " + PRP_Constants.dataObjectFolder);
    }

    var locale = this.locale;
    var definitions = group.ObjDefListFilter(PRP_Constants.TOGAF_DATA_OBJECT_TYPE);
    var groups = ArisData.sort(group.Childs(), Constants.SORT_GROUPPATH, locale);

    var stack = [];
    stack.push.apply(stack, groups.reverse());

    while (stack.length > 0) {

        var subGroup = stack.pop();
        var groupName = BaseDialog.getMaintainedObjectName(subGroup, locale);
        var parentGroup = subGroup.Parent();
        var parent = this.dataStructure.filter(function (data) {
            return data.isFolder && data.object.IsEqual(parentGroup);
        })
        var item = new Item(groupName, true, subGroup, parent.length > 0 ? parent[0] : null);
        var objects = subGroup.ObjDefListFilter(PRP_Constants.TOGAF_DATA_OBJECT_TYPE);
        var objectItems = this.transformDefinitionsIntoItem(objects, item, locale);
        if (objectItems.length > 0) {
            objectItems.forEach(function (subItem) {
                item.addChild(subItem);
            })
        }
        this.dataStructure.push(item);
        if (subGroup.Childs().length > 0) {
            var subGroups = ArisData.sort(subGroup.Childs(), Constants.SORT_GROUPPATH, locale);
            stack.push.apply(stack, subGroups);
        }
    }

    var items = this.transformDefinitionsIntoItem(definitions, null, locale);
    this.dataStructure.push.apply(this.dataStructure, items);

}
DataObjectSelectPage.prototype.transformDefinitionsIntoItem = function (definitions, parent, locale) {
    return definitions.map(function (object) {
        var itemName = BaseDialog.getMaintainedObjectName(object, locale);
        return new Item(itemName, true, object, parent);
    });
}
DataObjectSelectPage.prototype.clearTree = function () {

    var treeElement = this.dialog.getPageElement(this.pageNumber, "DOS_TREE_BOX");
    var index = this.lastIndex - 1;

    var treeItem = treeElement.getItem(index);
    while (treeItem !== null) {
        treeElement.deleteItem(treeItem);
        index = index - 1;
        treeItem = treeElement.getItem(index);
    }

}

//Events
DataObjectSelectPage.prototype.treeBoxChangeEvent = function (selection) {

    var locale = this.locale;

    var item = BaseDialog.findItemByTreeIndex(this.treeItems, selection);
    var listBox = this.dialog.getPageElement(this.pageNumber, "DOS_LIST_BOX");
    var items = [];

    var object = item.object;
    var models = object.AssignedModels(PRP_Constants.IE_DATA_MODEL_TYPE);
    if (!BaseDialog.isNullOrEmpty(models)) {
        var model = models[0];
        var attributes = model.ObjOccListFilter(PRP_Constants.RELEVANT_OBJECT_TYPE,
            PRP_Constants.RELEVANT_OBJECT_SYMBOL);
        attributes = ArisData.sort(attributes, Constants.AT_NAME, locale);
        if (attributes.length > 0) {
            items = attributes.map(function (attribute) {
                return BaseDialog.getMaintainedObjectName(attribute.ObjDef(), locale);
            });
        }
    }

    listBox.setItems(items);
}
DataObjectSelectPage.prototype.addButtonPressEvent = function () {

    var those = this;
    var treeBox = this.dialog.getPageElement(this.pageNumber, "DOS_TREE_BOX");
    var assignedListBox = this.dialog.getPageElement(this.pageNumber, "DOS_ASSIGNED_LIST_BOX");
    var treeBoxSelection = treeBox.getSelection();
    if (treeBoxSelection === null || treeBoxSelection.length === 0) return false;

    var dataObjects = treeBoxSelection.map(function (number) {
        return BaseDialog.findItemByTreeIndex(those.treeItems, number);
    }).filter(function (item) {
        return item.object.KindNum() !== Constants.CID_GROUP;
    }).filter(function (item) {
        return !those.assignedItems.some(function (subItem) {
            return subItem.object.IsEqual(item.object);
        });
    });

    this.assignedItems.push.apply(this.assignedItems, dataObjects);
    var items = this.assignedItems.map(function (item) {
        return item.name;
    });

    assignedListBox.setItems(items);
    treeBox.setSelection([]);


}
DataObjectSelectPage.prototype.removeButtonPressEvent = function () {

    var assignedListBox = this.dialog.getPageElement(this.pageNumber, "DOS_ASSIGNED_LIST_BOX");
    this.removeFromAssignedItems(assignedListBox);

}
DataObjectSelectPage.prototype.newObjectCreateEvent = function () {

    if (this.newObject !== null) {
        writeLog(sm72tc, "New object is created " + this.newObject.Name(this.locale), "info");
        var searchBox = this.getPageElement(this.pageNumber, "DOS_SEARCH_TEXT_BOX");
        searchBox.setText(this.newObject.Name(this.locale));
        this.newObject = null;
    }
}
DataObjectSelectPage.prototype.searchTexBoxChangeEvent = function () {
    var textBox = this.dialog.getPageElement(this.pageNumber, "DOS_SEARCH_TEXT_BOX");
    var text = textBox.getText();
    if (text.length() === 0) {
        this.init();
        return false;
    }


    var newTree = [];
    var stack = [];
    stack.push.apply(stack, this.dataStructure);
    while (stack.length > 0) {

        var dataObject = stack.pop();
        if (dataObject.isFolder) {

            var isSame = new Packages.java.lang.String(dataObject.name.toLowerCase()).contains(text.toLowerCase());
            var isIn = newTree.some(function (item) {
                return item.name.localeCompare(dataObject.name) === 0;
            });
            if (!isIn && isSame) {
                if (dataObject.isFolder) newTree.push(dataObject);

            }
        }
        if (dataObject.children.length > 0) stack.push.apply(stack, dataObject.children);
    }
    this.clearTree();
    newTree = newTree.sort(function (itemA, itemB) {
        return itemA.name.localeCompare(itemB.name);
    });
    this.initDataObjectTree(newTree);


}
DataObjectSelectPage.prototype.isInValidState = function () {

    var those = this;
    var addButton = this.dialog.getPageElement(this.pageNumber, "DOS_ADD_BUTTON");
    var editButton = this.dialog.getPageElement(this.pageNumber, "DOS_EDIT_BUTTON");
    var removeButton = this.dialog.getPageElement(this.pageNumber, "DOS_REMOVE_BUTTON");
    var treeBox = this.dialog.getPageElement(this.pageNumber, "DOS_TREE_BOX");
    var assignedListBox = this.dialog.getPageElement(this.pageNumber, "DOS_ASSIGNED_LIST_BOX");


    addButton.setEnabled(false);
    editButton.setEnabled(false);
    removeButton.setEnabled(false);

    if (assignedListBox.getSelection() !== null && assignedListBox.getSelection().length > 0) removeButton.setEnabled(
        true);
    if (treeBox.getSelection() !== null && treeBox.getSelection().length > 0) {
        var isDataObjectSelected = treeBox.getSelection().some(function (index) {
            var item = BaseDialog.findItemByTreeIndex(those.treeItems, index);
            return item !== null && item.object.KindNum() !== Constants.CID_GROUP;
        });
        addButton.setEnabled(isDataObjectSelected);
    }
    if (treeBox.getSelection() !== null && treeBox.getSelection().length === 1) {
        var item = BaseDialog.findItemByTreeIndex(this.treeItems, treeBox.getSelection()[0]);
        editButton.setEnabled((item !== null && item.object.KindNum() !== Constants.CID_GROUP));
    }

}