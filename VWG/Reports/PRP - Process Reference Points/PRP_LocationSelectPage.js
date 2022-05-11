function LocationSelectPage(pageNumber, locale, dialog) {

    this.pageNumber = pageNumber;
    this.locale = locale;
    this.dialog = dialog;
    this.brands = [];
    this.cache = [];
    this.assignedItems = [];
    this.brands = PRP_Helper.loadCompanies(PRP_Constants.COMPANIES_OVERVIEW_MODEL, locale);
    this.treeItems = [];
    this.lastIndex = -1;


}

LocationSelectPage.prototype = Object.create(BaseDialog.prototype);
LocationSelectPage.prototype.constructor = LocationSelectPage;

LocationSelectPage.prototype.createPage = function () {

    var height = Math.floor((BaseDialog.templateHeight - 5) / 3.0);
    var width = Math.floor((BaseDialog.templateWidth - 5) / 2.0);

    var page = Dialogs.createNewDialogTemplate(BaseDialog.templateWidth, BaseDialog.templateHeight,
        BaseDialog.getStringFromStringTable("LOCATION_SELECT_PAGE_TITLE", this.locale));

    page.GroupBox(5, 5, BaseDialog.templateWidth - 5, 2 * height,
        BaseDialog.getStringFromStringTable("LSP_ASSIGN_GROUP_BOX", this.locale), "LSP_ASSIGN_GROUP_BOX");

    page.Text(8, 7, BaseDialog.templateWidth - 10, 20, BaseDialog.getStringFromStringTable("SEARCH_LABEL", this.locale),
        "LSP_SEARCH_TITLE");
    page.TextBox(8, 19, BaseDialog.templateWidth - 10, 20, "LSP_SEARCH_TEXT_BOX");

    var listHeigh = (2 * height) - 45;
    page.Text(8, 39, width, 20,
        BaseDialog.getStringFromStringTable("LSP_TREE_BOX_TITLE", this.locale), "LSP_TREE_BOX_TEXT");
    page.Tree(8, 51, width, listHeigh, "LSP_TREE_BOX", 1);

    page.Text(8 + width + 4, 39, width, 20,
        BaseDialog.getStringFromStringTable("LSP_LIST_BOX_TITLE", this.locale), "LSP_LIST_BOX_TEXT");
    page.ListBox(8 + width + 4, 51, width - 12, listHeigh, [], "LSP_LIST_BOX", 1);

    page.GroupBox(/**/5, 5 + (2 * height) + 5, BaseDialog.templateWidth - 5, height,
        BaseDialog.getStringFromStringTable("LSP_ASSIGNED_GROUP_BOX", this.locale), "LSP_ASSIGNED_GROUP_BOX");

    page.PushButton(12, 5 + (2 * height) + 9, BaseDialog.pushButtonWidth, BaseDialog.pushButtoHeight,
        BaseDialog.getStringFromStringTable("ADD_BUTTON_TEXT", this.locale), "LSP_ADD_BUTTON");

    page.PushButton(12 + BaseDialog.pushButtonWidth + 5, 5 + (2 * height) + 9, BaseDialog.pushButtonWidth,
        BaseDialog.pushButtoHeight,
        BaseDialog.getStringFromStringTable("DELETE_BUTTON_TEXT", this.locale), "LSP_REMOVE_BUTTON");

    var listBoxHeight = BaseDialog.templateHeight - ( 5 + (2 * height) + BaseDialog.pushButtoHeight + 14);
    page.ListBox(8, 5 + (2 * height) + BaseDialog.pushButtoHeight + 14, BaseDialog.templateWidth - 12, listBoxHeight, [],
        "LSP_ASSIGNED_LIST_BOX", 1);

    return page;
}
LocationSelectPage.prototype.init = function () {
    this.clearTree();
    this.initLocationTree(this.brands);

}
LocationSelectPage.prototype.initLocationTree = function (items) {
    var treeBox = this.dialog.getPageElement(this.pageNumber, "LSP_TREE_BOX");
    this.treeItems = items.map(function (item) {
        return item.clone()
    });
    this.lastIndex = this.insertItemsIntoTree(this.treeItems, treeBox);
}

//Helper functions
LocationSelectPage.prototype.reloadListBox = function () {

    var listBox = this.dialog.getPageElement(this.pageNumber, "LSP_LIST_BOX");

    this.cache = this.cache.sort(function (itemA, itemB) {
        return itemA.name.localeCompare(itemB.name);
    });

    var items = this.cache.map(function (item) {
        return item.name;
    });

    listBox.setItems(items);
    listBox.setSelection([]);
}
LocationSelectPage.prototype.reloadTreeBox = function (items) {

    this.clearTree();
    items = items.sort(function (itemA, itemB) {
        return itemA.name.localeCompare(itemB.name);
    });
    this.initLocationTree(items);
}
LocationSelectPage.prototype.clearTree = function () {

    var treeElement = this.dialog.getPageElement(this.pageNumber, "LSP_TREE_BOX");
    var index = this.lastIndex - 1;
    var treeItem = treeElement.getItem(index);
    while (treeItem !== null) {
        treeElement.deleteItem(treeItem);
        index = index - 1;
        treeItem = treeElement.getItem(index);
    }

}

// Events
LocationSelectPage.prototype.treeBoxChangeEvent = function (selection) {
    var item = BaseDialog.findItemByTreeIndex(this.treeItems, selection);
    var listBox = this.dialog.getPageElement(this.pageNumber, "LSP_LIST_BOX");
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
LocationSelectPage.prototype.addButtonPressEvent = function () {

    var treeBox = this.dialog.getPageElement(this.pageNumber, "LSP_TREE_BOX");
    var listBox = this.dialog.getPageElement(this.pageNumber, "LSP_LIST_BOX");
    var assignedListBox = this.dialog.getPageElement(this.pageNumber, "LSP_ASSIGNED_LIST_BOX");


    var listBoxSelection = listBox.getSelection();
    var treeBoxSelection = treeBox.getSelection();

    if (listBoxSelection !== null && listBoxSelection.length > 0) {
        this.filterAssignedItems(listBoxSelection);
        listBox.setSelection([]);
    } else if (treeBoxSelection !== null && treeBoxSelection.length > 0) {
        var those = this;
        var treeBoxItems = treeBoxSelection.filter(function (number) {
            var node = BaseDialog.findItemByTreeIndex(those.treeItems, number);
            return !those.assignedItems.some(function (item) {
                return new Packages.java.lang.String(item.name).equalsIgnoreCase(node.name);
            });
        }).map(function (number) {
            return BaseDialog.findItemByTreeIndex(those.treeItems, number);
        });
        this.assignedItems.push.apply(this.assignedItems, treeBoxItems);
        treeBox.setSelection([]);
    }


    this.reloadListBox();
    this.reloadTreeBox(this.treeItems);
    assignedListBox.setItems(this.mapAssignedItems());
}
LocationSelectPage.prototype.removeButtonPressEvent = function () {

    var assignedListBox = this.dialog.getPageElement(this.pageNumber, "LSP_ASSIGNED_LIST_BOX");
    var selection = assignedListBox.getSelection();

    this.assignedItems = this.assignedItems.filter(function (item, index) {
        return !selection.some(function (number) {
            return index === number
        });
    });

    var items = this.assignedItems.map(function (item) {
        if (!item.isFolder && item.parent !== null) return item.parent.name + " " + item.name;
        return item.name;
    });
    assignedListBox.setItems(items);
    assignedListBox.setSelection([]);

}
LocationSelectPage.prototype.searchTexBoxChangeEvent = function () {

    var textBox = this.dialog.getPageElement(this.pageNumber, "LSP_SEARCH_TEXT_BOX");
    var text = textBox.getText();
    this.cache = [];
    if (text.length() === 0) {
        this.init();
        this.reloadListBox();
        return false;
    }

    var newTree = [];
    var isIn = false;
    var stack = [];
    stack.push.apply(stack, this.brands);
    while (stack.length > 0) {

        var brand = stack.pop();
        var isSame = new Packages.java.lang.String(brand.name.toLowerCase()).contains(text.toLowerCase());
        if (!brand.isFolder) {
            isIn = this.assignedItems.some(function (item) {
                return item.name.localeCompare(brand.name) === 0;
            });
        } else {
            isIn = newTree.some(function (item) {
                return item.name.localeCompare(brand.name) === 0;
            });
        }

        if (!isIn && isSame) {
            if (brand.isFolder) newTree.push(brand);
            else this.cache.push(brand);
        }

        if (brand.children.length > 0) stack.push.apply(stack, brand.children);
    }
    this.reloadTreeBox(newTree);
    this.reloadListBox();
}
LocationSelectPage.prototype.isInValidState = function () {

    var removeButton = this.dialog.getPageElement(this.pageNumber, "LSP_REMOVE_BUTTON");
    var addButton = this.dialog.getPageElement(this.pageNumber, "LSP_ADD_BUTTON");

    var assignedListBox = this.dialog.getPageElement(this.pageNumber, "LSP_ASSIGNED_LIST_BOX");
    var treeBox = this.dialog.getPageElement(this.pageNumber, "LSP_TREE_BOX");
    var assignListBox = this.dialog.getPageElement(this.pageNumber, "LSP_LIST_BOX");


    addButton.setEnabled(false);
    removeButton.setEnabled(false);
    if (assignedListBox.getSelection() !== null && assignedListBox.getSelection().length > 0) {
        removeButton.setEnabled(true);
    }

    if ((treeBox.getSelection() !== null && treeBox.getSelection().length > 0) ||
        (assignListBox.getSelection() !== null && assignListBox.getSelection().length > 0)) {
        addButton.setEnabled(true);
    }
    return true;
}
LocationSelectPage.prototype.mapAssignedItems = function () {

    this.assignedItems = this.assignedItems.sort(function (itemA, itemB) {
        var nameA = itemA.parent === null ? itemA.name : itemA.parent.name + " " + itemA.name
        var nameB = itemB.parent === null ? itemB.name : itemB.parent.name + " " + itemB.name
        return nameA.localeCompare(nameB);
    });
    return this.assignedItems.map(function (item) {
        if (item.parent !== null) return item.parent.name + " " + item.name;
        return item.name;
    });

}