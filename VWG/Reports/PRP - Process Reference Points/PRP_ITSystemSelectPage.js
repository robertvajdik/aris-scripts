function ITSystemSelectPage(pageNumber, locale, dialog) {

    this.pageNumber = pageNumber;
    this.locale = locale;
    this.dialog = dialog;
    this.dataStructure = [];
    this.assignedItems = [];
    this.cache = [];
}

ITSystemSelectPage.prototype = Object.create(BaseDialog.prototype);
ITSystemSelectPage.prototype.constructor = ITSystemSelectPage;

ITSystemSelectPage.prototype.createPage = function () {

    var height = Math.floor((BaseDialog.templateHeight - 5) / 3.0);
    var width = Math.floor((BaseDialog.templateWidth - 5) / 2.0);

    var page = Dialogs.createNewDialogTemplate(BaseDialog.templateWidth, BaseDialog.templateHeight,
                                               BaseDialog.getStringFromStringTable("IT_SYSTEM_SELECT_PAGE_TITLE", this.locale));

    page.GroupBox(5, 5, BaseDialog.templateWidth - 5, 2 * height,
                  BaseDialog.getStringFromStringTable("ITS_ASSIGN_GROUP_BOX", this.locale), "ITS_ASSIGN_GROUP_BOX");

    page.Text(8, 7, BaseDialog.templateWidth - 10, 20,
        BaseDialog.getStringFromStringTable("SEARCH_LABEL", this.locale), "ITS_SEARCH_TITLE");

    page.TextBox(8, 19, BaseDialog.templateWidth - 10, 20, "ITS_SEARCH_TEXT_BOX");

    var listHeigh = (2 * height) - 48;
    page.Text(8, 39, width, 20,
        BaseDialog.getStringFromStringTable("ITS_TREE_BOX_TITLE", this.locale), "ITS_TREE_BOX_TEXT");
    page.Tree(8, 51, width, listHeigh, "ITS_TREE_BOX");

    page.Text(8 + width + 4, 39, width, 20,
        BaseDialog.getStringFromStringTable("ITS_LIST_BOX_TITLE", this.locale), "ITS_LIST_BOX_TEXT");
    page.ListBox(8 + width + 4, 51, width - 12, listHeigh, [], "ITS_LIST_BOX", 1);


    page.GroupBox(5, 5 + (2 * height) + 5, BaseDialog.templateWidth - 5, height,
                  BaseDialog.getStringFromStringTable("ITS_ASSIGNED_GROUP_BOX", this.locale), "ITS_ASSIGNED_GROUP_BOX");

    page.PushButton(12, 5 + (2 * height) + 9, BaseDialog.pushButtonWidth, BaseDialog.pushButtoHeight,
        BaseDialog.getStringFromStringTable("ADD_BUTTON_TEXT", this.locale), "ITS_ADD_BUTTON");
    page.PushButton(12 + BaseDialog.pushButtonWidth+5, 5 + (2 * height) + 9, BaseDialog.pushButtonWidth, BaseDialog.pushButtoHeight,
        BaseDialog.getStringFromStringTable("DELETE_BUTTON_TEXT", this.locale), "ITS_REMOVE_BUTTON");


    var listBoxHeight = BaseDialog.templateHeight - ( 5 + (2 * height) + BaseDialog.pushButtoHeight + 14);
    page.ListBox(8, 5 + (2 * height) + BaseDialog.pushButtoHeight + 14,BaseDialog.templateWidth - 12, listBoxHeight, [], "ITS_ASSIGNED_LIST_BOX", 1);

    return page;
}
ITSystemSelectPage.prototype.init = function () {

    this.clearTree();
    this.loadStoredItSystems();
    this.initDataObjectTree(this.dataStructure);

}

//Helper functions
ITSystemSelectPage.prototype.loadStoredItSystems = function () {
    var group = ArisData.getActiveDatabase().FindGUID(PRP_Constants.IT_SYSTEM_ROOT_GROUP_GUID, Constants.CID_GROUP);
    if (BaseDialog.isArisObjectNullOrInvalid(group)) {
        throw new Packages.java.lang.NullPointerException("Cannot found group with guid " + PRP_Constants.IT_SYSTEM_ROOT_GROUP_GUID);
    }

    var locale = this.locale;

    var definitions = group.ObjDefListFilter(PRP_Constants.IT_SYSTEM);
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
        var objects = subGroup.ObjDefListFilter(PRP_Constants.IT_SYSTEM);
        objects = ArisData.sort(objects, Constants.AT_NAME, this.locale)
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
ITSystemSelectPage.prototype.clearTree = function () {

    var treeElement = this.dialog.getPageElement(this.pageNumber, "DOS_TREE_BOX");
    this.dataStructure.reverse().forEach(function (item) {
        treeElement.deleteItemByIndex(item.treeIndex);
    });
    this.dataStructure = [];

}
ITSystemSelectPage.prototype.initDataObjectTree = function (items) {
    var treeBox = this.dialog.getPageElement(this.pageNumber, "ITS_TREE_BOX");
    this.insertItemsIntoTree(items,treeBox);
}
ITSystemSelectPage.prototype.transformDefinitionsIntoItem = function (definitions, parent, locale) {
    return definitions.map(function (object) {
        var itemName = BaseDialog.getMaintainedObjectName(object, locale);
        return new Item(itemName, false, object, parent);
    });
}
ITSystemSelectPage.prototype.reloadListBox = function () {

    var listBox = this.dialog.getPageElement(this.pageNumber, "ITS_LIST_BOX");
    var items = this.cache.map(function (item) {
        return item.name;
    });

    listBox.setItems(items);
    listBox.setSelection([]);
}
//Events
ITSystemSelectPage.prototype.treeBoxChangeEvent = function (selection) {

    var item = BaseDialog.findItemByTreeIndex(this.dataStructure,selection);
    var listBox = this.dialog.getPageElement(this.pageNumber, "ITS_LIST_BOX");
    listBox.setItems([]);
    if (item.children.length > 0) {

        var those = this;
        this.cache = item.children.filter(function (item) {
            return !item.isFolder;
        }).filter(function (item) {
            return !those.assignedItems.some(function (subItem) {
                return item.name.localeCompare(subItem.name) === 0;
            });
        });
        this.reloadListBox();

    }


}
ITSystemSelectPage.prototype.addButtonPressEvent = function () {

    var listBox = this.dialog.getPageElement(this.pageNumber, "ITS_LIST_BOX");
    var assignedListBox = this.dialog.getPageElement(this.pageNumber, "ITS_ASSIGNED_LIST_BOX");

    var listBoxSelection = listBox.getSelection();

    if (listBoxSelection !== null && listBoxSelection.length > 0) {
        this.filterAssignedItems(listBoxSelection);
        listBox.setSelection([]);
    }
    assignedListBox.setItems(this.mapAssignedItems());
    this.reloadListBox();
}
ITSystemSelectPage.prototype.removeButtonPressEvent = function () {

    var assignedListBox = this.dialog.getPageElement(this.pageNumber, "ITS_ASSIGNED_LIST_BOX");
    this.removeFromAssignedItems(assignedListBox);

}
ITSystemSelectPage.prototype.searchTexBoxChangeEvent = function () {

    var textBox = this.dialog.getPageElement(this.pageNumber, "ITS_SEARCH_TEXT_BOX");
    var text = textBox.getText();

    this.cache = [];
    if (text.length() === 0) {
        return this.reloadListBox();
    }

    var stack = [];
    stack.push.apply(stack, this.dataStructure);
    while (stack.length > 0) {

        var data = stack.pop();
        if (!data.isFolder) {
            var isIn = this.assignedItems.some(function (item) {
                return item.name.startsWith(data.name);
            });
            if (!isIn && data.name.toLowerCase().startsWith(text.toLowerCase())) {
                this.cache.push(data);
            }
        }

        if (data.children.length > 0) stack.push.apply(stack, data.children);
    }

    this.reloadListBox();
}
ITSystemSelectPage.prototype.isInValidState = function () {

    var addButton = this.dialog.getPageElement(this.pageNumber, "ITS_ADD_BUTTON");
    var removeButton = this.dialog.getPageElement(this.pageNumber, "ITS_REMOVE_BUTTON");
    var listBox = this.dialog.getPageElement(this.pageNumber, "ITS_LIST_BOX");
    var assignedListBox = this.dialog.getPageElement(this.pageNumber, "ITS_ASSIGNED_LIST_BOX");

    addButton.setEnabled(true);
    removeButton.setEnabled(true);
    if (listBox.getSelection() === null || listBox.getSelection().length === 0) addButton.setEnabled(false);
    if (assignedListBox.getSelection() === null || assignedListBox.getSelection().length === 0) removeButton.setEnabled(false);
}


