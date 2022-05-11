function ObjectiveEditSubDialog(input, locale, isEdit, cockpitHelper, corporateKey) {
    
    this.locale = locale;
    this.input = input;
    this.isEdit = isEdit;
    this.cockpitHelper = cockpitHelper;
    this.corporateKey = corporateKey;
    this.tree = null;
    this.database = ArisData.getActiveDatabase();
    this.objectType = FadModelManager.kpiType;
    this.objectSymbol = FadModelManager.kpiSymbol;
    
    this.assignedObject = [];
    this.cache = [];
    this.searchingContext = new Packages.java.util.HashMap();
    this.fadModel = this.getKPIModel(input);
    this.isChanged = false;
    this.assignedObject = [];
    this.dialogResult = {
        isOk: false
    };
    
    
    this.getPages = function () {
        
        return [this.createPage()];
    }
    
    this.init = function () {
        
        if (isEdit) {
            var textBox = this.getPageElement(0, "OESB_NAME_TEXT");
            var descriptionBox = this.getPageElement(0, "OESB_DESCRIPTION_TEXT");
            
            textBox.setText(BaseDialog.getMaintainedObjectName(this.input, this.locale));
            descriptionBox.setText(this.input.Attribute(Constants.AT_DESC, this.locale).getValue());
            
            this.setCurrentAssignedObjects(this.fadModel);
        }
        
        this.fillTree();
        
    }
    
    this.isInValidState = function (pageNumber) {
        
        var assignedTable = this.getPageElement(0, "OESB_KPI_ASSIGNED_TABLE_BOX");
        var documentListBox = this.getPageElement(0, "OESB_KPI_ELEMENTS_LIST_BOX");
        var pushButtonDelete = this.getPageElement(0, "OESB_KPI_REMOVE_BUTTON");
        var pushButtonAdd = this.getPageElement(0, "OESB_ADD_KPI_PUSH_BUTTON");
        var pushButtonEdit = this.getPageElement(0, "OESB_EDIT_KPI_PUSH_BUTTON");
        var pushButtonSecondEdit = this.getPageElement(0, "OESB_SECOND_EDIT_KPI_PUSH_BUTTON");
        var textBox = this.getPageElement(0, "OESB_NAME_TEXT");
        
        if (BaseDialog.isNullOrEmpty(assignedTable)) return true;
        if (BaseDialog.isNullOrEmpty(documentListBox)) return true;
        if (BaseDialog.isNullOrEmpty(pushButtonDelete)) return true;
        if (BaseDialog.isNullOrEmpty(pushButtonAdd)) return true;
        if (BaseDialog.isNullOrEmpty(pushButtonSecondEdit)) return true;
        if (BaseDialog.isNullOrEmpty(pushButtonEdit)) return true;
        if (BaseDialog.isNullOrEmpty(textBox)) return true;
        
        if (BaseDialog.isNullOrEmpty(assignedTable.getItems())) {
            
            pushButtonSecondEdit.setEnabled(false);
            pushButtonDelete.setEnabled(false);
            if (BaseDialog.isNullOrEmpty(this.fadModel)) this.isChanged = false;
            
        } else {
            if (assignedTable.getSelection() !== null) {
                pushButtonSecondEdit.setEnabled(true);
                pushButtonDelete.setEnabled(true);
                
            } else {
                pushButtonSecondEdit.setEnabled(false);
                pushButtonDelete.setEnabled(false);
            }
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
        
        if (isEdit) {
            this.isChanged = this.isChanged || !BaseDialog.getMaintainedObjectName(this.input, this.locale).equals(String(textBox.getText())) &&
                textBox.getText().length() > 2
            
        } else {
            this.isChanged = this.isChanged || textBox.getText().length() > 2;
        }
        
        return this.isChanged;
        
    }
    
    this.getResult = function () {
        return this.dialogResult;
    }
    
    this.onClose = function (pageNumber, bOk) {
        this.dialogResult.isOk = bOk;
        this.dialogResult.isEdit = this.isEdit;
        this.dialogResult.object = this.input;
        this.dialogResult.assignedKPI = this.assignedObject;
        this.dialogResult.newName = this.getPageElement(0, "OESB_NAME_TEXT").getText();
        this.dialogResult.newDescription = this.getPageElement(0, "OESB_DESCRIPTION_TEXT").getText();
        
    }
    
    this.OESB_NEW_KPI_PUSH_BUTTON_pressed = function () {
        var folderGUID = this.cockpitHelper.getNewKPIFolder(this.corporateKey);
        var dialogFunction = new KPIEditSubDialog(folderGUID, null, this.locale, false);
        this.dialog.setSubDialog("OESB_NEW_KPI_SUBDIALOG", dialogFunction, Constants.DIALOG_TYPE_ACTION, "Create new KPI");
    }
    
    this.OESB_EDIT_KPI_PUSH_BUTTON_pressed = function () {
        var input = this.getSelectedObject();
        var dialogFunction = new KPIEditSubDialog(null, input, this.locale, true);
        this.dialog.setSubDialog("OESB_NEW_KPI_SUBDIALOG", dialogFunction, Constants.DIALOG_TYPE_ACTION, "Edit KPI");
    }
    
    this.OESB_ADD_KPI_PUSH_BUTTON_pressed = function () {
        
        var listBox = this.getPageElement(0, "OESB_KPI_ELEMENTS_LIST_BOX");
        var table = this.getPageElement(0, "OESB_KPI_ASSIGNED_TABLE_BOX");
        
        if (BaseDialog.isNullOrEmpty(listBox)) return false;
        if (BaseDialog.isNullOrEmpty(table)) return false;
        
        var selectedIndex = listBox.getValue();
        if (selectedIndex === -1) return false;
        
        var objectName = BaseDialog.getMaintainedObjectName(this.cache[selectedIndex][0], this.locale);
        var objectGUID = this.cache[selectedIndex][0].GUID();
        
        var isAlreadyAssigned = this.assignedObject.some(function (object) {
            return object.GUID().equals(objectGUID);
        })
        
        if (isAlreadyAssigned) {
            
            var message = "Element with name " + objectName + " is assigned. Please choose different";
            this.dialog.setMsgBox("WARNING", message, Constants.MSGBOX_BTN_OK | Constants.MSGBOX_ICON_WARNING, "Assignation Warning");
            return false;
        }
        
        
        this.assignedObject.push(this.cache[selectedIndex][0]);
        var locale = this.locale;
        var items = this.assignedObject.map(function (object) {
            
            var name = BaseDialog.getMaintainedObjectName(object, locale);
            var definition = BaseDialog.getMaintainedObjectAttribute(object, Constants.AT_DESC, locale);
            var planValue = BaseDialog.getMaintainedObjectAttribute(object, Constants.AT_PL_VAL, locale);
            var actualValue = BaseDialog.getMaintainedObjectAttribute(object, Constants.AT_ACT_VAL, locale);
            var unit = BaseDialog.getMaintainedObjectAttribute(object, Constants.AT_BSC_UNIT, locale);
            var guid = object.GUID();
            return [name, definition, planValue, actualValue, unit, guid]
        });
        table.setItems(items);
        
        if (BaseDialog.isArisObjectNullOrInvalid(this.fadModel)) {
            this.isChanged = true;
            return false;
        }
        
        var fadModelOccurrences = this.fadModel.ObjOccListFilter(this.objectType, this.objectSymbol);
        
        if (!BaseDialog.isNullOrEmpty(fadModelOccurrences)) {
            var selectedObject = this.cache[selectedIndex][0];
            this.isChanged = !fadModelOccurrences.every(function (occurrence) {
                return occurrence.ObjDef().GUID().equals(selectedObject.GUID());
            });
        } else this.isChanged = true;
        
    }
    
    this.OESB_KPI_REMOVE_BUTTON_pressed = function () {
        
        var assignedTable = this.getPageElement(0, "OESB_KPI_ASSIGNED_TABLE_BOX");
        if (BaseDialog.isNullOrEmpty(assignedTable)) return false;
        
        var selections = assignedTable.getSelection();
        if (BaseDialog.isNullOrEmpty(selections)) return false;
        
        
        var currentContent = assignedTable.getItems();
        var guid = currentContent[selections[0]][5];
        currentContent.splice(selections[0], 1);
        
        assignedTable.setItems(currentContent);
        var locale = this.locale
        this.assignedObject = this.assignedObject.filter(function (object) {
            var objectGuid = object.GUID();
            return !String(objectGuid).equals(String(guid));
        });
        this.isChanged = true;
        
    }
    
    this.OESB_SECOND_EDIT_KPI_PUSH_BUTTON_pressed = function () {
        
        var assignedTable = this.getPageElement(0, "OESB_KPI_ASSIGNED_TABLE_BOX");
        if (BaseDialog.isNullOrEmpty(assignedTable)) return false;
        
        var selections = assignedTable.getSelection();
        if (BaseDialog.isNullOrEmpty(selections)) return false;
        
        
        var currentContent = assignedTable.getItems();
        var guid = currentContent[selections[0]][5];
        var selectedObject = this.assignedObject.filter(function (object) {
            var objectGuid = object.GUID();
            return String(objectGuid).equals(String(guid));
        });
        
        var dialogFunction = new KPIEditSubDialog(null, selectedObject[0], this.locale, true);
        this.dialog.setSubDialog("OESB_NEW_KPI_SUBDIALOG", dialogFunction, Constants.DIALOG_TYPE_ACTION, "Edit KPI");
        
    }
    
    this.OESB_SEARCH_KPI_TEXT_changed = function () {
        
        
        this.cache = [];
        
        var searchBox = this.getPageElement(0, "OESB_SEARCH_KPI_TEXT");
        var listBox = this.getPageElement(0, "OESB_KPI_ELEMENTS_LIST_BOX");
        
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
        
        listBox.setItems(items)
    }
    
    this.OESB_KPI_SUBGROUPS_TREE_BOX_selChanged = function (selectedIndex) {
        
        this.cache = [];
        
        var treeBox = this.getPageElement(0, "OESB_KPI_SUBGROUPS_TREE_BOX");
        var listBox = this.getPageElement(0, "OESB_KPI_ELEMENTS_LIST_BOX");
        
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
    
    this.OESB_NEW_KPI_SUBDIALOG_subDialogClosed = function (subResult, bOk) {
        
        if (!subResult.isOk) return false;
        
        if (subResult.isEdit) {
            
            var object = subResult.object;
            object.Attribute(Constants.AT_NAME, this.locale).setValue(subResult.title);
            object.Attribute(Constants.AT_DESC, this.locale).setValue(subResult.description);
            object.Attribute(Constants.AT_PL_VAL, this.locale).setValue(subResult.planValue);
            object.Attribute(Constants.AT_ACT_VAL, this.locale).setValue(subResult.actualValue);
            object.Attribute(Constants.AT_BSC_UNIT, this.locale).setValue(subResult.unit);
            this.fillTree();
            this.init();
            return true;
        }
        this.createNewKPI(subResult);
        this.init();
        
    }
}

ObjectiveEditSubDialog.prototype = Object.create(BaseDialog.prototype)
ObjectiveEditSubDialog.prototype.constructor = ObjectiveEditSubDialog;

ObjectiveEditSubDialog.tableColumnsHeader =
    [
        BaseDialog.getStringFromStringTable("MRP_TABLE_NAME_COLUMN_TEXT", Context.getSelectedLanguage()),
        BaseDialog.getStringFromStringTable("MRP_TABLE_DEFINITION_COLUMN_TEXT", Context.getSelectedLanguage()),
        BaseDialog.getStringFromStringTable("MRP_TABLE_PLAN_VALUE_COLUMN_TEXT", Context.getSelectedLanguage()),
        BaseDialog.getStringFromStringTable("MRP_TABLE_ACTUAL_VALUE_COLUMN_TEXT", Context.getSelectedLanguage()),
        BaseDialog.getStringFromStringTable("MRP_TABLE_UNIT_COLUMN_TEXT", Context.getSelectedLanguage()),
        "GUID"
    ];

ObjectiveEditSubDialog.tableColumnsStyle =
    [
        Constants.TABLECOLUMN_SINGLELINE,
        Constants.TABLECOLUMN_SINGLELINE,
        Constants.TABLECOLUMN_SINGLELINE,
        Constants.TABLECOLUMN_SINGLELINE,
        Constants.TABLECOLUMN_SINGLELINE,
        Constants.TABLECOLUMN_SINGLELINE,
    
    ];

ObjectiveEditSubDialog.tableColumnsWidth =
    [
        18,
        27,
        18,
        18,
        18,
        1
    ];

ObjectiveEditSubDialog.prototype.createPage = function () {
    
    var pageHeight = Math.floor(BaseDialog.halfHeight * 1.75);
    var groupBoxHeight = Math.floor((pageHeight - 5) / 5);
    var pageWidth = Math.floor(1.25 * BaseDialog.templateWidth);
    
    var searchWidth = pageWidth - 40
    var halfPage = Math.floor((pageWidth - 40) / 2.0);
    var page = Dialogs.createNewDialogTemplate(pageWidth, pageHeight, "");
    
    page.GroupBox(5, 5, pageWidth - 5, groupBoxHeight, BaseDialog.getStringFromStringTable("OESB_ASSIGN_GROUP", this.locale), "OESB_ASSIGN_GROUP");
    page.Text(20, 8, pageWidth - 40, 20, "Object Name", "OESB_NAME_LABEL");
    page.TextBox(20, 20, pageWidth - 40, 20, "OESB_NAME_TEXT");
    
    page.Text(20, 48, pageWidth - 40, 20, "Object Description", "OESB_DESCRIPTION_LABEL")
    page.TextBox(20, 60, pageWidth - 40, 20, "OESB_DESCRIPTION_TEXT", 1);
    
    var secondPartY = 5 + groupBoxHeight;
    var secondGroupBoxHeight = Math.floor(3 * groupBoxHeight);
    var oneThird = Math.floor(secondGroupBoxHeight / 4);
    
    page.GroupBox(5, secondPartY + 5, pageWidth - 5, secondGroupBoxHeight - 30, BaseDialog.getStringFromStringTable("OESB_KPI_ASSIGN_GROUP", this.locale), "OESB_KPI_ASSIGN_GROUP");
    page.Text(20, secondPartY + 8, pageWidth - 40, 20, BaseDialog.getStringFromStringTable("FBHP_SEARCH_LABEL", this.locale), "OESB_SEARCH_KPI_LABEL")
    page.TextBox(20, secondPartY + 20, searchWidth, 20, "OESB_SEARCH_KPI_TEXT");
    
    page.Tree(20, secondPartY + 50, halfPage, 3 * oneThird - 40, "OESB_KPI_SUBGROUPS_TREE_BOX");
    page.ListBox(20 + halfPage, secondPartY + 50, halfPage, 3 * oneThird - 40, [], "OESB_KPI_ELEMENTS_LIST_BOX");
    page.PushButton(20 + pageWidth - 40 - 3 * BaseDialog.pushButtonWidth - 10, secondPartY + 53 + 3 * oneThird - 40, BaseDialog.pushButtonWidth, BaseDialog.pushButtoHeight, BaseDialog.getStringFromStringTable("ADD_BUTTON_TEXT", this.locale), "OESB_ADD_KPI_PUSH_BUTTON");
    page.PushButton(20 + pageWidth - 40 - 2 * BaseDialog.pushButtonWidth - 5, secondPartY + 53 + 3 * oneThird - 40, BaseDialog.pushButtonWidth, BaseDialog.pushButtoHeight, BaseDialog.getStringFromStringTable("EDIT_BUTTON_TEXT", this.locale), "OESB_EDIT_KPI_PUSH_BUTTON");
    page.PushButton(20 + pageWidth - 40 - BaseDialog.pushButtonWidth, secondPartY + 53 + 3 * oneThird - 40, BaseDialog.pushButtonWidth, BaseDialog.pushButtoHeight, BaseDialog.getStringFromStringTable("NEW_BUTTON_TEXT", this.locale), "OESB_NEW_KPI_PUSH_BUTTON");
    
    var thirdPartY = 5 + groupBoxHeight + secondGroupBoxHeight - 35;
    
    page.GroupBox(5, thirdPartY + 15, pageWidth - 5, groupBoxHeight + 50, BaseDialog.getStringFromStringTable("OESB_KPI_ASSIGNED_GROUP", this.locale), "OESB_KPI_ASSIGNED_GROUP");
    page.Table(
        20,
        thirdPartY + 20,
        pageWidth - 40,
        groupBoxHeight + 40 - 5 - BaseDialog.pushButtoHeight,
        ObjectiveEditSubDialog.tableColumnsHeader,
        ObjectiveEditSubDialog.tableColumnsStyle,
        ObjectiveEditSubDialog.tableColumnsWidth,
        "OESB_KPI_ASSIGNED_TABLE_BOX",
        Constants.TABLE_STYLE_DEFAULT
    );
    
    page.PushButton(20 + pageWidth - 40 - 2 * BaseDialog.pushButtonWidth - 5, thirdPartY + 20 + groupBoxHeight + 35 + 5 - BaseDialog.pushButtoHeight, BaseDialog.pushButtonWidth, BaseDialog.pushButtoHeight, BaseDialog.getStringFromStringTable("EDIT_BUTTON_TEXT", this.locale), "OESB_SECOND_EDIT_KPI_PUSH_BUTTON");
    page.PushButton(20 + pageWidth - 40 - BaseDialog.pushButtonWidth, thirdPartY + 20 + groupBoxHeight + 35 + 5 - BaseDialog.pushButtoHeight, BaseDialog.pushButtonWidth, BaseDialog.pushButtoHeight, BaseDialog.getStringFromStringTable("DELETE_BUTTON_TEXT", this.locale), "OESB_KPI_REMOVE_BUTTON");
    
    return page;
}

ObjectiveEditSubDialog.prototype.buildTree = function (group) {
    
    if (BaseDialog.isArisObjectNullOrInvalid(group)) return false;
    if (BaseDialog.isNullOrEmpty(this.objectType)) return false;
    if (BaseDialog.isNullOrEmpty(this.locale)) return false;
    
    var searchType = this.objectType;
    var locale = this.locale;
    var objectDefinitions = group.ObjDefListFilter(searchType);
    this.tree = new TreeNode(group, objectDefinitions, locale);
    var stack = [this.tree];
    
    while (stack.length > 0) {
        
        var node = stack.pop();
        if (!BaseDialog.isArisObjectNullOrInvalid(node.group)) {
            var childGroups = ArisData.sort(node.group.Childs(), Constants.SORT_GROUPPATH, locale);
            if (!BaseDialog.isNullOrEmpty(childGroups)) {
                
                childGroups.forEach(function (childGroup) {
                    var objectDefinitions = childGroup.ObjDefListFilter(searchType);
                    var childNode = new TreeNode(childGroup, objectDefinitions, locale);
                    node.children.push(childNode);
                    stack.push(childNode);
                });
            }
        }
    }
}

ObjectiveEditSubDialog.prototype.fillTreeElement = function (treeElement) {
    
    if (BaseDialog.isNullOrEmpty(treeElement)) return false;
    var index = 0;
    var parentTreeItem = treeElement.addChild(null, this.tree.groupName, index++);
    this.tree.treeIndex = 0;
    
    for (var position = 0; position < this.tree.children.length; position++) {
        var child = this.tree.children[position];
        index = this.insertTreeItem(treeElement, parentTreeItem, child, index);
        
    }
}

ObjectiveEditSubDialog.prototype.insertTreeItem = function (treeElement, parentTreeItem, node, index) {
    
    this.insertIntoSearchContext(node.getObjects(), index);
    node.treeIndex = index;
    parentTreeItem = treeElement.addChild(parentTreeItem, node.groupName, index++);
    
    if (node.children.length === 0) return index;
    for (var position = 0; position < node.children.length; position++) {
        index = this.insertTreeItem(treeElement, parentTreeItem, node.children[position], index);
    }
    return index;
}

ObjectiveEditSubDialog.prototype.insertIntoSearchContext = function (items, baseIndex) {
    
    if (BaseDialog.isNullOrEmpty(items)) return false;
    if (BaseDialog.isNullOrEmpty(baseIndex)) return false;
    var those = this;
    var locale = this.locale;
    items.forEach(function (item) {
        var name = BaseDialog.getMaintainedObjectName(item, locale);
        var content = [item, baseIndex]
        those.searchingContext.put(name, content);
    })
}

ObjectiveEditSubDialog.prototype.findItemByTreeIndex = function (index) {
    
    var result = []
    result = this.findSpecificNodeBByTreeIndex(this.tree, index, result);
    return result.length === 0 ? null : result[0]
    
}

ObjectiveEditSubDialog.prototype.findSpecificNodeBByTreeIndex = function (node, index, result) {
    
    if (node.treeIndex === index) result.push(node);
    
    for (var position = 0; position < node.children.length; position++) {
        this.findSpecificNodeBByTreeIndex(node.children[position], index, result);
    }
    return result;
}

ObjectiveEditSubDialog.prototype.getAssignedObjects = function () {
    return this.assignedObject;
}


ObjectiveEditSubDialog.prototype.fillTree = function () {
    
    this.tree = null;
    var group = this.database.FindGUID(this.cockpitHelper.getKPIFolder(this.corporateKey), Constants.CID_GROUP);
    if (BaseDialog.isArisObjectNullOrInvalid(group)) return false;
    
    this.buildTree(group)
    
    
    var treeElement = this.getPageElement(0, "OESB_KPI_SUBGROUPS_TREE_BOX");
    var listElement = this.getPageElement(0, "OESB_KPI_ELEMENTS_LIST_BOX");
    if (!BaseDialog.isNullOrEmpty(treeElement) && !BaseDialog.isNullOrEmpty(listElement)) {
        treeElement.deleteItemByIndex(0);
        listElement.setItems([]);
        this.fillTreeElement(treeElement);
    } else throw new Packages.java.lang.NullPointerException("Cannot find a tree dialog element");
    
}

ObjectiveEditSubDialog.prototype.createNewKPI = function (subResult) {
    
    var folderGUID = this.cockpitHelper.getNewKPIFolder(this.corporateKey);
    var folder = ArisData.getActiveDatabase().FindGUID(folderGUID, Constants.CID_GROUP);
    if (BaseDialog.isArisObjectNullOrInvalid(folder)) return false;
    
    var object = folder.GetOrCreateObjDef(FadModelManager.kpiType, 2, subResult.title, this.locale);
    if (!BaseDialog.isArisObjectNullOrInvalid(object)) {
        
        object.Attribute(Constants.AT_DESC, this.locale).setValue(subResult.description);
        object.Attribute(Constants.AT_PL_VAL, this.locale).setValue(subResult.planValue);
        object.Attribute(Constants.AT_ACT_VAL, this.locale).setValue(subResult.actualValue);
        object.Attribute(Constants.AT_BSC_UNIT, this.locale).setValue(subResult.unit);
        
        
    }
    this.fillTree();
}

ObjectiveEditSubDialog.prototype.getSelectedObject = function () {
    
    var listBox = this.getPageElement(0, "OESB_KPI_ELEMENTS_LIST_BOX");
    if (BaseDialog.isNullOrEmpty(listBox)) return -1;
    var selectedIndex = listBox.getSelectedIndex();
    if (selectedIndex === -1) return -1;
    
    return this.cache[selectedIndex][0]
}

ObjectiveEditSubDialog.prototype.getKPIModel = function (object) {
    
    if (BaseDialog.isNullOrEmpty(object)) return null;
    var models = object.AssignedModels(Constants.MT_KPI_ALLOC_DGM);
    if (BaseDialog.isNullOrEmpty(models)) return null;
    
    return models[0];
}

ObjectiveEditSubDialog.prototype.setCurrentAssignedObjects = function (model) {
    
    if (BaseDialog.isArisObjectNullOrInvalid(model)) return false;
    
    var pageElement = this.getPageElement(0, "OESB_KPI_ASSIGNED_TABLE_BOX");
    
    if (BaseDialog.isNullOrEmpty(pageElement)) return false;
    
    
    var modelOccurreces = model.ObjOccListFilter(this.objectType, this.objectSymbol);
    
    if (BaseDialog.isNullOrEmpty(modelOccurreces)) return false;
    
    this.assignedObject = modelOccurreces.map(function (occurrence) {
        return occurrence.ObjDef();
    })
    
    var locale = this.locale;
    var items = modelOccurreces.map(function (occurrence) {
        
        var name = BaseDialog.getMaintainedObjectName(occurrence.ObjDef(), locale);
        var definition = BaseDialog.getMaintainedObjectAttribute(occurrence.ObjDef(), Constants.AT_DESC, locale);
        var planValue = BaseDialog.getMaintainedObjectAttribute(occurrence.ObjDef(), Constants.AT_PL_VAL, locale);
        var actualValue = BaseDialog.getMaintainedObjectAttribute(occurrence.ObjDef(), Constants.AT_ACT_VAL, locale);
        var unit = BaseDialog.getMaintainedObjectAttribute(occurrence.ObjDef(), Constants.AT_BSC_UNIT, locale);
        var guid = occurrence.ObjDef().GUID();
        
        
        return [name, definition, planValue, actualValue, unit, guid]
    });
    
    pageElement.setItems(items);
    
}

ObjectiveEditSubDialog.prototype.tryToSearch = function (searchingText) {
    return this.searchText(searchingText, this.searchingContext);
}
