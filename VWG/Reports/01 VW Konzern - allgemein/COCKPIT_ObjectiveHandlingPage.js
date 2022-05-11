function ObjectiveHandlingPage(pageTitle,
                               objectiveType,
                               objectiveSymbol,
                               sourceFolderGUID,
                               locale,
                               pageNumber,
                               dialog) {
    
    this.pageTitle = pageTitle;
    this.objectiveType = objectiveType;
    this.objectiveSymbol = objectiveSymbol;
    this.sourceFolderGUID = sourceFolderGUID;
    this.locale = locale;
    this.pageNumber = pageNumber;
    this.dialog = dialog;
    this.database = ArisData.getActiveDatabase();
    this.assignedObject = [];
    this.cache = [];
    this.searchingContext = new Packages.java.util.HashMap();
    this.tree = null;
    this.isChanged = false;
}

ObjectiveHandlingPage.prototype = Object.create(BaseDialog.prototype)
ObjectiveHandlingPage.prototype.constructor = ObjectiveHandlingPage;

ObjectiveHandlingPage.prototype.createPage = function () {
    
    var page = Dialogs.createNewDialogTemplate(BaseDialog.templateWidth, BaseDialog.templateHeight, this.pageTitle);
    page.GroupBox(5, 5, BaseDialog.templateWidth - 5, BaseDialog.templateHeight - 5, BaseDialog.getStringFromStringTable("OHP_ASSIGN_GROUP", this.locale), "OHP_ASSIGN_GROUP");
    page.Text(20, 8, BaseDialog.templateWidth - 40, 20, BaseDialog.getStringFromStringTable("FBHP_SEARCH_LABEL", this.locale), "OHP_SEARCH_LABEL");
    page.TextBox(20, 20, BaseDialog.templateWidth - 40, 20, "OHP_SEARCH_BOX");
    
    page.Tree(20, 45, (BaseDialog.templateWidth - 40) / 2, BaseDialog.twoThirdHeight - 2 * BaseDialog.pushButtoHeight - 46, "OHP_SUBGROUPS_TREE_BOX");
    page.ListBox(BaseDialog.templateWidth / 2, 45, (BaseDialog.templateWidth - 40) / 2, BaseDialog.twoThirdHeight - 2 * BaseDialog.pushButtoHeight - 46, [], "OHP_ELEMENTS_LIST_BOX");
    page.PushButton(BaseDialog.threeQuaterWidth - 2 * (BaseDialog.pushButtonWidth) - 20, BaseDialog.twoThirdHeight - 2 * BaseDialog.pushButtoHeight, BaseDialog.pushButtonWidth, BaseDialog.pushButtoHeight, BaseDialog.getStringFromStringTable("ADD_BUTTON_TEXT", this.locale), "OHP_ADD_PUSH_BUTTON");
    page.PushButton(BaseDialog.threeQuaterWidth - BaseDialog.pushButtonWidth - 10, BaseDialog.twoThirdHeight - 2 * BaseDialog.pushButtoHeight, BaseDialog.pushButtonWidth, BaseDialog.pushButtoHeight, BaseDialog.getStringFromStringTable("EDIT_BUTTON_TEXT", this.locale), "OHP_EDIT_PUSH_BUTTON");
    page.PushButton(BaseDialog.threeQuaterWidth, BaseDialog.twoThirdHeight - 2 * BaseDialog.pushButtoHeight, BaseDialog.pushButtonWidth, BaseDialog.pushButtoHeight, BaseDialog.getStringFromStringTable("NEW_BUTTON_TEXT", this.locale), "OHP_NEW_PUSH_BUTTON");
    
    page.GroupBox(5, BaseDialog.twoThirdHeight, BaseDialog.templateWidth - 5, BaseDialog.oneThirdHeight, BaseDialog.getStringFromStringTable("OHP_ASSIGNED_GROUP", this.locale), "OHP_ASSIGNED_GROUP");
    page.Tree(20, BaseDialog.twoThirdHeight + 20, BaseDialog.templateWidth - 40, BaseDialog.oneThirdHeight - 2 * BaseDialog.pushButtoHeight - 10, "OHP_ASSIGNED_TREE_BOX");
    page.PushButton(BaseDialog.threeQuaterWidth - BaseDialog.pushButtonWidth - 10, BaseDialog.templateHeight - BaseDialog.pushButtoHeight - 10, BaseDialog.pushButtonWidth, BaseDialog.pushButtoHeight, BaseDialog.getStringFromStringTable("EDIT_BUTTON_TEXT", this.locale), "OHP_SECOND_EDIT_PUSH_BUTTON");
    page.PushButton(BaseDialog.threeQuaterWidth,BaseDialog.templateHeight - BaseDialog.pushButtoHeight - 10, BaseDialog.pushButtonWidth, BaseDialog.pushButtoHeight, BaseDialog.getStringFromStringTable("DELETE_BUTTON_TEXT", this.locale), "OHP_DELETE_PUSH_BUTTON");
    
    
    return page;
}

ObjectiveHandlingPage.prototype.isInValidState = function (dialog, fadModel) {
    
    var assignedTreeBox = this.dialog.getPageElement(this.pageNumber, "OHP_ASSIGNED_TREE_BOX");
    var documentListBox = this.dialog.getPageElement(this.pageNumber, "OHP_ELEMENTS_LIST_BOX");
    var pushButtonDelete = this.dialog.getPageElement(this.pageNumber, "OHP_DELETE_PUSH_BUTTON");
    var pushButtonAdd = this.dialog.getPageElement(this.pageNumber, "OHP_ADD_PUSH_BUTTON");
    var pushButtonEdit = this.dialog.getPageElement(this.pageNumber, "OHP_EDIT_PUSH_BUTTON");
    var pushButtonSecondEdit = this.dialog.getPageElement(this.pageNumber, "OHP_SECOND_EDIT_PUSH_BUTTON");
    
    if (BaseDialog.isNullOrEmpty(assignedTreeBox)) return true;
    if (BaseDialog.isNullOrEmpty(documentListBox)) return true;
    if (BaseDialog.isNullOrEmpty(pushButtonDelete)) return true;
    if (BaseDialog.isNullOrEmpty(pushButtonAdd)) return true;
    if (BaseDialog.isNullOrEmpty(pushButtonEdit)) return true;
    if (BaseDialog.isNullOrEmpty(pushButtonSecondEdit)) return true;
    
        if (assignedTreeBox.getSelection() === null || assignedTreeBox.getSelection().length === 0 ) {
            
            pushButtonDelete.setEnabled(false);
            pushButtonSecondEdit.setEnabled(false);
            if (BaseDialog.isNullOrEmpty(fadModel)) this.isChanged = false;
            
        } else {
            
            pushButtonDelete.setEnabled(true);
            pushButtonSecondEdit.setEnabled(true);
            
        }
    
    
    if (BaseDialog.isNullOrEmpty(documentListBox.getItems())) {
        pushButtonAdd.setEnabled(false);
        pushButtonEdit.setEnabled(false);
        
    } else {
        if (documentListBox.getSelectedIndex() !== -1) {
            pushButtonAdd.setEnabled(true);
            pushButtonEdit.setEnabled(true);
        } else {
            pushButtonAdd.setEnabled(false);
            pushButtonEdit.setEnabled(false);
            
        }
    }
    
    return this.isChanged;
    
}

ObjectiveHandlingPage.prototype.init = function (fadModel) {
    
    var group = this.database.FindGUID(this.sourceFolderGUID, Constants.CID_GROUP);
    if (BaseDialog.isArisObjectNullOrInvalid(group)) return false;
    
    this.buildTree(group);
    
    var treeElement = this.dialog.getPageElement(this.pageNumber, "OHP_SUBGROUPS_TREE_BOX");
    var listElement = this.dialog.getPageElement(this.pageNumber, "OHP_ELEMENTS_LIST_BOX")
    if (!BaseDialog.isNullOrEmpty(treeElement) && !BaseDialog.isNullOrEmpty(listElement)) {
        treeElement.deleteItemByIndex(0);
        listElement.setItems([]);
        this.fillTreeElement(treeElement);
    } else throw new Packages.java.lang.NullPointerException("Cannot find a tree dialog element");
    
    if (BaseDialog.isNullOrEmpty(fadModel)) return true;
    this.setCurrentAssignedObjects(fadModel);
    return true;
}

ObjectiveHandlingPage.prototype.buildTree = function (group) {
    
    if (BaseDialog.isArisObjectNullOrInvalid(group)) return false;
    if (BaseDialog.isNullOrEmpty(this.objectiveType)) return false;
    if (BaseDialog.isNullOrEmpty(this.locale)) return false;
    
    var searchObjectType = this.objectiveType;
    var locale = this.locale;
    var objectDefinitions = group.ObjDefListFilter(searchObjectType);
    this.tree = new TreeNode(group, objectDefinitions, this.locale);
    var stack = [this.tree];
    
    while (stack.length > 0) {
        
        var node = stack.pop();
        if (!BaseDialog.isArisObjectNullOrInvalid(node.group)) {
            var childGroups = ArisData.sort(node.group.Childs(), Constants.SORT_GROUPPATH, this.locale);
            if (!BaseDialog.isNullOrEmpty(childGroups)) {
                
                childGroups.forEach(function (childGroup) {
                    var objectDefinitions = childGroup.ObjDefListFilter(searchObjectType);
                    var childNode = new TreeNode(childGroup, objectDefinitions, locale);
                    node.children.push(childNode);
                    stack.push(childNode);
                });
            }
        }
    }
}

ObjectiveHandlingPage.prototype.fillTreeElement = function (treeElement) {
    
    if (BaseDialog.isNullOrEmpty(treeElement)) return false;
    var index = 0;
    var parentTreeItem = treeElement.addChild(null, this.tree.groupName, index++);
    this.tree.treeIndex = 0;
    
    for (var position = 0; position < this.tree.children.length; position++) {
        var child = this.tree.children[position];
        index = this.insertTreeItem(treeElement, parentTreeItem, child, index);
        
    }
}

ObjectiveHandlingPage.prototype.insertTreeItem = function (treeElement, parentTreeItem, node, index) {
    
    this.insertIntoSearchContext(node.getObjects(), index);
    node.treeIndex = index;
    parentTreeItem = treeElement.addChild(parentTreeItem, node.groupName, index++);
    
    if (node.children.length === 0) return index;
    for (var position = 0; position < node.children.length; position++) {
        index = this.insertTreeItem(treeElement, parentTreeItem, node.children[position], index);
    }
    return index;
}

ObjectiveHandlingPage.prototype.insertIntoSearchContext = function (items, baseIndex) {
    
    if (BaseDialog.isNullOrEmpty(items)) return false;
    if (BaseDialog.isNullOrEmpty(baseIndex)) return false;
    var those = this;
    var locale = this.locale;
    items.forEach(function (item) {
        var name = item.Name(locale);
        var content = [item, baseIndex]
        those.searchingContext.put(name, content);
    })
}

ObjectiveHandlingPage.prototype.setCurrentAssignedObjects = function (model) {
    
    
    var pageElement = this.dialog.getPageElement(this.pageNumber, "OHP_ASSIGNED_TREE_BOX");
    
    if (BaseDialog.isNullOrEmpty(pageElement)) return false;
    
    
    var modelOccurreces = model.ObjOccListFilter(this.objectiveType, this.objectiveSymbol);
    
    if (BaseDialog.isNullOrEmpty(modelOccurreces)) return false;
    this.emptyTreeElement(pageElement);
    this.assignedObject = modelOccurreces.map(function (occurrence) {
        return occurrence.ObjDef();
    })
    this.addAssignedObjectIntoElement(pageElement);
    
}

ObjectiveHandlingPage.prototype.findItemByTreeIndex = function (index) {
    
    var result = []
    result = this.findSpecificNodeBByTreeIndex(this.tree, index, result);
    return result.length === 0 ? null : result[0]
    
}

ObjectiveHandlingPage.prototype.findSpecificNodeBByTreeIndex = function (node, index, result) {
    
    if (node.treeIndex === index) result.push(node);
    
    for (var position = 0; position < node.children.length; position++) {
        this.findSpecificNodeBByTreeIndex(node.children[position], index, result);
    }
    return result;
}

ObjectiveHandlingPage.prototype.getAssignedObjects = function () {
    return this.assignedObject;
}

ObjectiveHandlingPage.prototype.getSelectedAssignedObject = function () {
    
    var treeBox = this.dialog.getPageElement(this.pageNumber,"OHP_ASSIGNED_TREE_BOX");
    if (BaseDialog.isNullOrEmpty(treeBox)) return -1;
    var selections = treeBox.getSelection();
    
    
    var indexes = selections.map(function (position) {
        
        var item = treeBox.getItem(position);
        var index = item.getIndex();
        
        
        while (item !== null) {
            if (item.getParentItem().getName().localeCompare("tree_root") !== 0 ) {
                index = item.getParentItem().getIndex();
                item = item.getParentItem();
            }
            else item = null;
            
        }
        return index;
    });
    var index = indexes[indexes.length - 1];
    var objects = this.mapAndSortContent();
    var object = objects.filter(function(object){
        return object.index === index;
    });
    
    return object[0].object;
}


ObjectiveHandlingPage.prototype.getSelectedObject = function () {
    
    var listBox = this.dialog.getPageElement(this.pageNumber, "OHP_ELEMENTS_LIST_BOX");
    if (BaseDialog.isNullOrEmpty(listBox)) return -1;
    var selectedIndex = listBox.getSelectedIndex();
    if (selectedIndex === -1) return -1;
    
    return this.cache[selectedIndex][0]
}


ObjectiveHandlingPage.prototype.deleteButtonPressEvent = function () {
    
    var locale = this.locale;
    var assignedTreeBox = this.dialog.getPageElement(this.pageNumber, "OHP_ASSIGNED_TREE_BOX");
    
    if (BaseDialog.isNullOrEmpty(assignedTreeBox)) return false;
    
    var selections = assignedTreeBox.getSelection();
    
    if (BaseDialog.isNullOrEmpty(selections)) return false;
    
    var names = selections.map(function (position) {
        
        var item = assignedTreeBox.getItem(position);
        var name = item.getName();
        while (item !== null) {
            if (item.getParentItem().getName().localeCompare("tree_root") !== 0 ) {
                name = item.getParentItem().getName();
                item = item.getParentItem();
            }
            else item = null;
            
        }
        return String(name);
        
    });
    
    this.emptyTreeElement(assignedTreeBox)
    this.assignedObject = this.assignedObject.filter(function (object) {
        var found = names.some(function (name) {
            var objectName = BaseDialog.getMaintainedObjectName(object, locale);
            return name.trim().localeCompare(objectName.trim()) === 0;
        });
        return !found;
    });
    
    this.addAssignedObjectIntoElement(assignedTreeBox);
    
    this.isChanged = true;
    
}

ObjectiveHandlingPage.prototype.addButtonPressEvent = function (fadModel) {
    
    var locale = this.locale;
    var assignedListBox = this.dialog.getPageElement(this.pageNumber, "OHP_ASSIGNED_TREE_BOX");
    var listBox = this.dialog.getPageElement(this.pageNumber, "OHP_ELEMENTS_LIST_BOX");
    
    if (BaseDialog.isNullOrEmpty(assignedListBox)) return false;
    if (BaseDialog.isNullOrEmpty(listBox)) return false;
    
    var selectedIndex = listBox.getValue();
    if (selectedIndex === -1) return false;
    
    var objectName = BaseDialog.getMaintainedObjectName(this.cache[selectedIndex][0], locale);
    var objectGUID = this.cache[selectedIndex][0].GUID();
    
    var isAlreadyAssigned = this.assignedObject.some(function (object) {
        return object.GUID().equals(objectGUID);
    })
    
    if (isAlreadyAssigned) {
        
        var message = "Element with name " + objectName + " is assigned. Please choose different";
        this.dialog.dialog.setMsgBox("WARNING", message, Constants.MSGBOX_BTN_OK | Constants.MSGBOX_ICON_WARNING, "Assignation Warning");
        return false;
    }
    
    this.emptyTreeElement(assignedListBox);
    this.assignedObject.push(this.cache[selectedIndex][0]);
    this.addAssignedObjectIntoElement(assignedListBox);
    
    if (BaseDialog.isArisObjectNullOrInvalid(fadModel)) {
        this.isChanged = true;
        return false;
    }
    
    var fadModelOccurrences = fadModel.ObjOccListFilter(this.objectiveType, this.objectiveSymbol);
    
    if (!BaseDialog.isNullOrEmpty(fadModelOccurrences)) {
        var selectedObject = this.cache[selectedIndex][0];
        this.isChanged = !fadModelOccurrences.every(function (occurrence) {
            return occurrence.ObjDef().GUID().equals(selectedObject.GUID());
        });
    } else this.isChanged = true;
    
}

ObjectiveHandlingPage.prototype.searchBoxChangeEvent = function () {
    
    var searchBox = this.dialog.getPageElement(this.pageNumber, "OHP_SEARCH_BOX");
    var listBox = this.dialog.getPageElement(this.pageNumber, "OHP_ELEMENTS_LIST_BOX");
    
    if (BaseDialog.isNullOrEmpty(searchBox)) return false;
    if (BaseDialog.isNullOrEmpty(listBox)) return false;
    
    var searchingText = searchBox.getText();
    
    if (searchingText.length() === 0) {
        
        this.cache = [];
        listBox.setItems([]);
        return true;
    }
    
    this.cache = this.tryToSearch(searchingText);
    var locale = this.locale;
    var items = this.cache.map(function (item) {
        return item[0].Name(locale);
    }).sort(BaseDialog.stringSort);
    listBox.setItems(items)
}

ObjectiveHandlingPage.prototype.treeBoxChangeEvent = function (selectedIndex) {
    
    this.cache = [];
    
    var treeBox = this.dialog.getPageElement(this.pageNumber, "OHP_SUBGROUPS_TREE_BOX");
    var listBox = this.dialog.getPageElement(this.pageNumber, "OHP_ELEMENTS_LIST_BOX");
    
    if (BaseDialog.isNullOrEmpty(treeBox)) return false;
    if (BaseDialog.isNullOrEmpty(listBox)) return false;
    
    listBox.setSelection(-1);
    var treeNode = this.findItemByTreeIndex(selectedIndex);
    
    if (BaseDialog.isNullOrEmpty(treeNode)) return false;
    var objects = treeNode.getObjects();
    
    if (BaseDialog.isNullOrEmpty(objects)) {
        listBox.setItems([]);
        return false;
    }
    
    
    var those = this;
    var locale = this.locale;
    var items = objects.filter(function (item) {
        var assignedObjects = those.getAssignedObjects();
        return !assignedObjects.some(function (object) {
            return item.GUID().equals(object.GUID());
        });
    }).sort(function (itemA, itemB) {
        var itemAName = BaseDialog.getMaintainedObjectName(itemA, locale);
        var itemBName = BaseDialog.getMaintainedObjectName(itemB, locale);
        return BaseDialog.stringSort(itemAName, itemBName);
    })
        .map(function (item) {
            those.cache.push([item, treeNode.treeIndex]);
            return BaseDialog.getMaintainedObjectName(item, locale);
        });
    listBox.setItems(items);
}

ObjectiveHandlingPage.prototype.mapAndSortContent = function () {
    
    var those = this;
    var locale = this.locale;
    var stepIndex = 0;
    var content = this.assignedObject.sort(function (objectA, objectB) {
        var nameA = BaseDialog.getMaintainedObjectName(objectA, locale);
        var nameB = BaseDialog.getMaintainedObjectName(objectB, locale);
        return String(nameA).localeCompare(String(nameB));
    }).map(function (object,index) {
        var result = {
            object: object,
            name: BaseDialog.getMaintainedObjectName(object, locale),
            kpis: those.getKPIs(object),
            index: stepIndex
        };
        stepIndex += result.kpis.length + 1;
        return result;
    });
    return content
}

ObjectiveHandlingPage.prototype.tryToSearch = function (searchingText) {
    return this.searchText(searchingText, this.searchingContext);
}

ObjectiveHandlingPage.prototype.getKPIs = function (object) {
    
    if (BaseDialog.isNullOrEmpty(object)) return [];
    
    var models = object.AssignedModels(Constants.MT_KPI_ALLOC_DGM);
    if (BaseDialog.isNullOrEmpty(models)) return [];
    
    
    return models[0].ObjOccListFilter(FadModelManager.kpiType, FadModelManager.kpiSymbol);
    
}

ObjectiveHandlingPage.prototype.addAssignedObjectIntoElement = function (element) {
    
    if (BaseDialog.isNullOrEmpty(element)) return false;
    
    var locale = this.locale;
    var objects = this.mapAndSortContent();
    var stepIndex = 0;
    objects.forEach(function (object, index) {
        var parent = element.addChild(null, object.name, stepIndex++);
        
        if (!BaseDialog.isNullOrEmpty(object.kpis)) {
            object.kpis.forEach(function (kpi, subIndex) {
                element.addChild(parent, BaseDialog.getMaintainedObjectName(kpi.ObjDef(), locale), stepIndex++);
            });
        }
    });
}

ObjectiveHandlingPage.prototype.emptyTreeElement = function (element) {
    
    var objects = this.mapAndSortContent();
    var stepIndex = 0;
    objects.forEach(function (object) {
        element.deleteItemByIndex(stepIndex++);
        if (object.kpis.length > 0) {
            object.kpis.forEach(function (i) {
                element.deleteItemByIndex(stepIndex++);
                
            });
        }
    });
    
}
