function InputOutputHandlingPage(inputGroup, database, locale, pageNumber, dialog) {
  
  this.inputGroup = inputGroup;
  this.database = database;
  this.locale = locale;
  this.tree = null;
  this.searchingContext = new Packages.java.util.HashMap();
  this.searchCache = [];
  this.assignedInputs = [];
  this.assignedOutputs = [];
  this.isChanged = false;
  this.dialog = dialog;
  this.pageNumber = pageNumber;
  
}


InputOutputHandlingPage.prototype = Object.create(BaseDialog.prototype);
InputOutputHandlingPage.prototype.constructor = InputOutputHandlingPage;

InputOutputHandlingPage.prototype.getAssignedInputs = function () {
  return this.assignedInputs;
}

InputOutputHandlingPage.prototype.getAssignedOutputs = function () {
  return this.assignedOutputs;
}

InputOutputHandlingPage.prototype.getSelectedObject = function () {
  
  var listBox = this.dialog.getPageElement(this.pageNumber, "IOHP_ELEMENTS_LIST_BOX");
  if (BaseDialog.isNullOrEmpty(listBox)) return -1;
  var selectedIndex = listBox.getSelectedIndex();
  if (selectedIndex === -1) return -1;
  
  return this.searchCache[selectedIndex][0];
}


InputOutputHandlingPage.prototype.getSelectedInput = function () {
  
  var listBox = this.dialog.getPageElement(this.pageNumber, "IOHP_INPUT_ASSIGNED_LIST_BOX");
  if (BaseDialog.isNullOrEmpty(listBox)) return -1;
  var selectedIndex = listBox.getSelectedIndex();
  if (selectedIndex === -1) return -1;
  
  return this.assignedInputs[selectedIndex];
}

InputOutputHandlingPage.prototype.getSelectedOutput = function () {
  
  var listBox = this.dialog.getPageElement(this.pageNumber, "IOHP_OUTPUT_ASSIGNED_LIST_BOX");
  if (BaseDialog.isNullOrEmpty(listBox)) return -1;
  var selectedIndex = listBox.getSelectedIndex();
  if (selectedIndex === -1) return -1;
  
  return this.assignedOutputs[selectedIndex];
}


InputOutputHandlingPage.prototype.createPage = function () {
  
  
  var page = Dialogs.createNewDialogTemplate(BaseDialog.templateWidth, BaseDialog.templateHeight, BaseDialog.getStringFromStringTable("INPUTS_OUTPUTS_PAGE_TITLE", this.locale));
  page.GroupBox(5, 5, BaseDialog.templateWidth - 5, BaseDialog.templateHeight - 5, BaseDialog.getStringFromStringTable("IO_ASSIGN_GROUP", this.locale), "IO_ASSIGN_GROUP");
  page.Text(20, 8, BaseDialog.templateWidth - 40, 20, BaseDialog.getStringFromStringTable("FBHP_SEARCH_LABEL", this.locale), "IOHP_SEARCH_LABEL");
  page.TextBox(20, 20, BaseDialog.templateWidth - 40, 20, "IOHP_SEARCH_BOX");
  
  page.Tree(20, 45, (BaseDialog.templateWidth - 40) / 2, BaseDialog.twoThirdHeight - 2 * BaseDialog.pushButtoHeight - 46, "IOHP_SUBGROUPS_TREE_BOX");
  page.ListBox(BaseDialog.templateWidth / 2, 45, (BaseDialog.templateWidth - 40) / 2, BaseDialog.twoThirdHeight - 2 * BaseDialog.pushButtoHeight - 46, [], "IOHP_ELEMENTS_LIST_BOX", 1);
  
  page.PushButton(BaseDialog.threeQuaterWidth - 3 * BaseDialog.pushButtonWidth - 30, BaseDialog.twoThirdHeight - 2 * BaseDialog.pushButtoHeight, BaseDialog.pushButtonWidth, BaseDialog.pushButtoHeight, BaseDialog.getStringFromStringTable("IOHP_ADD_INPUT_PUSH_BUTTON", this.locale), "IOHP_ADD_INPUT_PUSH_BUTTON");
  
  page.PushButton(BaseDialog.threeQuaterWidth - 2 * BaseDialog.pushButtonWidth - 20, BaseDialog.twoThirdHeight - 2 * BaseDialog.pushButtoHeight, BaseDialog.pushButtonWidth, BaseDialog.pushButtoHeight, BaseDialog.getStringFromStringTable("IOHP_ADD_OUTPUT_PUSH_BUTTON", this.locale), "IOHP_ADD_OUTPUT_PUSH_BUTTON");
  
  page.PushButton(BaseDialog.threeQuaterWidth - BaseDialog.pushButtonWidth - 10, BaseDialog.twoThirdHeight - 2 * BaseDialog.pushButtoHeight, BaseDialog.pushButtonWidth, BaseDialog.pushButtoHeight, BaseDialog.getStringFromStringTable("EDIT_BUTTON_TEXT", this.locale), "IOHP_EDIT_PUSH_BUTTON");
  
  
  page.PushButton(BaseDialog.threeQuaterWidth, BaseDialog.twoThirdHeight - 2 * BaseDialog.pushButtoHeight, BaseDialog.pushButtonWidth, BaseDialog.pushButtoHeight, BaseDialog.getStringFromStringTable("NEW_BUTTON_TEXT", this.locale), "IOHP_NEW_PUSH_BUTTON");
  
  page.Text(20, BaseDialog.twoThirdHeight - 5, BaseDialog.halfWidth - 10, 20, BaseDialog.getStringFromStringTable("IOHP_ASSIGNED_INPUTS_LABEL", this.locale), "IOHP_ASSIGNED_INPUTS_LABEL");
  page.ListBox(20, BaseDialog.twoThirdHeight + 10, (BaseDialog.templateWidth / 2) - 22, BaseDialog.oneThirdHeight - 2 * BaseDialog.pushButtoHeight - 10, [], "IOHP_INPUT_ASSIGNED_LIST_BOX", 1);
  page.Text((BaseDialog.templateWidth / 2), BaseDialog.twoThirdHeight - 5, BaseDialog.halfWidth - 10, 20, BaseDialog.getStringFromStringTable("IOHP_ASSIGNED_OUTPUTS_LABEL", this.locale), "IOHP_ASSIGNED_OUTPUTS_LABEL");
  page.ListBox((BaseDialog.templateWidth / 2), BaseDialog.twoThirdHeight + 10, (BaseDialog.templateWidth / 2) - 20, BaseDialog.oneThirdHeight - 2 * BaseDialog.pushButtoHeight - 10, [], "IOHP_OUTPUT_ASSIGNED_LIST_BOX", 1);
  
  
  page.PushButton(BaseDialog.oneQuaterWidth, BaseDialog.templateHeight - BaseDialog.pushButtoHeight - 10, BaseDialog.pushButtonWidth, BaseDialog.pushButtoHeight, BaseDialog.getStringFromStringTable("DELETE_BUTTON_TEXT", this.locale), "IOHP_INPUT_DELETE_PUSH_BUTTON");
  page.PushButton(BaseDialog.oneQuaterWidth - BaseDialog.pushButtonWidth - 10, BaseDialog.templateHeight - BaseDialog.pushButtoHeight - 10, BaseDialog.pushButtonWidth, BaseDialog.pushButtoHeight, BaseDialog.getStringFromStringTable("EDIT_BUTTON_TEXT", this.locale), "IOHP_INPUT_EDIT_PUSH_BUTTON");
  
  page.PushButton(BaseDialog.threeQuaterWidth, BaseDialog.templateHeight - BaseDialog.pushButtoHeight - 10, BaseDialog.pushButtonWidth, BaseDialog.pushButtoHeight, BaseDialog.getStringFromStringTable("DELETE_BUTTON_TEXT", this.locale), "IOHP_OUTPUT_DELETE_PUSH_BUTTON");
  page.PushButton(BaseDialog.threeQuaterWidth - BaseDialog.pushButtonWidth - 10, BaseDialog.templateHeight - BaseDialog.pushButtoHeight - 10, BaseDialog.pushButtonWidth, BaseDialog.pushButtoHeight, BaseDialog.getStringFromStringTable("EDIT_BUTTON_TEXT", this.locale), "IOHP_OUTPUT_EDIT_PUSH_BUTTON");
  return page;
}

InputOutputHandlingPage.prototype.init = function (fadModel) {
  var group = this.database.FindGUID(this.inputGroup, Constants.CID_GROUP);
  if (BaseDialog.isArisObjectNullOrInvalid(group)) return false;
  
  
  this.buildTree(group);
  
  var treeElement = this.dialog.getPageElement(this.pageNumber, "IOHP_SUBGROUPS_TREE_BOX");
  var listElement = this.dialog.getPageElement(this.pageNumber, "IOHP_ELEMENTS_LIST_BOX")
  if (!BaseDialog.isNullOrEmpty(treeElement) && !BaseDialog.isNullOrEmpty(listElement)) {
    treeElement.deleteItemByIndex(0);
    listElement.setItems([]);
    this.insertContent(treeElement);
  } else throw new Packages.java.lang.NullPointerException("Cannot find a tree dialog element");
  
  if (BaseDialog.isNullOrEmpty(fadModel)) return true;
  this.setCurrentAssignedInputsOutputs(fadModel);
  
  
}

InputOutputHandlingPage.prototype.isInValidState = function (dialog, fadModel) {
  
  var assignedInputBox = this.dialog.getPageElement(this.pageNumber, "IOHP_INPUT_ASSIGNED_LIST_BOX");
  var assignedOutputBox = this.dialog.getPageElement(this.pageNumber, "IOHP_OUTPUT_ASSIGNED_LIST_BOX");
  var elementListBox = this.dialog.getPageElement(this.pageNumber, "IOHP_ELEMENTS_LIST_BOX");
  var pushButtonInputDelete = this.dialog.getPageElement(this.pageNumber, "IOHP_INPUT_DELETE_PUSH_BUTTON");
  var pushButtonOutputDelete = this.dialog.getPageElement(this.pageNumber, "IOHP_OUTPUT_DELETE_PUSH_BUTTON");
  var pushButtonInputEdit = this.dialog.getPageElement(this.pageNumber, "IOHP_INPUT_EDIT_PUSH_BUTTON");
  var pushButtonOutputEdit = this.dialog.getPageElement(this.pageNumber, "IOHP_OUTPUT_EDIT_PUSH_BUTTON");
  
  
  var pushButtonInputAdd = this.dialog.getPageElement(this.pageNumber, "IOHP_ADD_INPUT_PUSH_BUTTON");
  var pushButtonOutputAdd = this.dialog.getPageElement(this.pageNumber, "IOHP_ADD_OUTPUT_PUSH_BUTTON");
  var pushButtonEdit = this.dialog.getPageElement(this.pageNumber, "IOHP_EDIT_PUSH_BUTTON");
  
  if (BaseDialog.isNullOrEmpty(assignedInputBox)) return true;
  if (BaseDialog.isNullOrEmpty(assignedOutputBox)) return true;
  
  
  if (BaseDialog.isNullOrEmpty(elementListBox)) return true;
  if (BaseDialog.isNullOrEmpty(pushButtonInputDelete)) return true;
  if (BaseDialog.isNullOrEmpty(pushButtonOutputDelete)) return true;
  if (BaseDialog.isNullOrEmpty(pushButtonInputAdd)) return true;
  if (BaseDialog.isNullOrEmpty(pushButtonOutputAdd)) return true;
  
  
  if (BaseDialog.isNullOrEmpty(assignedInputBox.getItems())) {
    
    pushButtonInputDelete.setEnabled(false);
    
    
  } else {
    pushButtonInputDelete.setEnabled(true);
    var selections = assignedInputBox.getSelection();
    
    if (selections !== null && selections.length === 1) pushButtonInputEdit.setEnabled(true);
    else pushButtonInputEdit.setEnabled(false);
    
  }
  
  
  if (BaseDialog.isNullOrEmpty(assignedOutputBox.getItems())) {
    
    pushButtonOutputDelete.setEnabled(false);
    pushButtonOutputEdit.setEnabled(false);
    
  } else {
    pushButtonOutputDelete.setEnabled(true);
    var selections = assignedOutputBox.getSelection();
    
    if (selections !== null && selections.length === 1) pushButtonOutputEdit.setEnabled(true);
    else pushButtonOutputEdit.setEnabled(false);
  }
  
  
  if (BaseDialog.isNullOrEmpty(elementListBox.getItems())) {
    pushButtonInputAdd.setEnabled(false);
    pushButtonEdit.setEnabled(false);
    pushButtonOutputAdd.setEnabled(false);
    
  } else {
    var selections = elementListBox.getSelection();
    
    if (selections === null || selections.length === 0) {
      
      pushButtonInputAdd.setEnabled(false);
      pushButtonOutputAdd.setEnabled(false);
      pushButtonEdit.setEnabled(false);
      
    } else if (selections.length === 1) {
      
      pushButtonInputAdd.setEnabled(true);
      pushButtonOutputAdd.setEnabled(true);
      pushButtonEdit.setEnabled(true);
      
    } else {
      pushButtonInputAdd.setEnabled(true);
      pushButtonOutputAdd.setEnabled(true);
      pushButtonEdit.setEnabled(false);
    }
    
  }
  
  return this.isChanged;
}

InputOutputHandlingPage.prototype.buildTree = function (group) {
  
  if (BaseDialog.isArisObjectNullOrInvalid(group)) return false;
  
  var locale = this.locale;
  var objectDefinitions = group.ObjDefListFilter(Constants.OT_PERF);
  this.tree = new TreeNode(group, objectDefinitions, this.locale);
  var stack = [this.tree];
  
  while (stack.length > 0) {
    
    var node = stack.pop();
    if (!BaseDialog.isArisObjectNullOrInvalid(node.group)) {
      var childGroups = ArisData.sort(node.group.Childs(), Constants.SORT_GROUPPATH, this.locale);
      if (!BaseDialog.isNullOrEmpty(childGroups)) {
        
        childGroups.forEach(function (childGroup) {
          var objectDefinitions = childGroup.ObjDefListFilter(Constants.OT_PERF);
          var childNode = new TreeNode(childGroup, objectDefinitions, locale);
          node.children.push(childNode);
          stack.push(childNode);
        });
      }
    }
  }
  
  
}

InputOutputHandlingPage.prototype.insertContent = function (treeElement) {
  
  if (BaseDialog.isNullOrEmpty(treeElement)) return false;
  var index = 0;
  var parentTreeItem = treeElement.addChild(null, this.tree.groupName, index++);
  this.tree.treeIndex = 0;
  
  for (var position = 0; position < this.tree.children.length; position++) {
    var child = this.tree.children[position];
    index = this.insertTreeItem(treeElement, parentTreeItem, child, index);
    
  }
  
}

InputOutputHandlingPage.prototype.traverse = function (node, path, result) {
  if (node === null) return result;
  if (node.children.length === 0) result.push(path);
  
  for (var position = 0; position < node.children.length; position++) {
    this.traverse(node.children[position], path.concat(node.children[position]), result);
  }
  return result;
}

InputOutputHandlingPage.prototype.insertTreeItem = function (treeElement, parentTreeItem, node, index) {
  
  this.insertIntoSearchContext(node.getObjects(), index);
  node.treeIndex = index;
  parentTreeItem = treeElement.addChild(parentTreeItem, node.groupName, index++);
  
  if (node.children.length === 0) return index;
  for (var position = 0; position < node.children.length; position++) {
    index = this.insertTreeItem(treeElement, parentTreeItem, node.children[position], index);
  }
  return index;
}

InputOutputHandlingPage.prototype.insertIntoSearchContext = function (items, baseIndex) {
  
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


InputOutputHandlingPage.prototype.treeBoxChangeEvent = function (selectedIndex) {
  
  
  this.searchCache = [];
  
  var treeBox = this.dialog.getPageElement(this.pageNumber, "IOHP_SUBGROUPS_TREE_BOX");
  var listBox = this.dialog.getPageElement(this.pageNumber, "IOHP_ELEMENTS_LIST_BOX");
  
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
    var assignedObjects = [];
    assignedObjects = assignedObjects.concat(those.getAssignedInputs());
    assignedObjects = assignedObjects.concat(those.getAssignedOutputs());
    
    return !assignedObjects.some(function (object) {
      return item.GUID().equals(object.GUID());
    });
  }).sort(function (itemA, itemB) {
      var itemAName = BaseDialog.getMaintainedObjectName(itemA, locale);
      var itemBName = BaseDialog.getMaintainedObjectName(itemB, locale);
      return BaseDialog.stringSort(itemAName, itemBName);
    })
    .map(function (item) {
      those.searchCache.push([item, treeNode.treeIndex]);
      return BaseDialog.getMaintainedObjectName(item, locale);
    });
  listBox.setItems(items);
  
}

InputOutputHandlingPage.prototype.findItemByTreeIndex = function (index) {
  
  var result = []
  result = this.findSpecificNodeBByTreeIndex(this.tree, index, result);
  return result.length === 0 ? null : result[0]
  
}

InputOutputHandlingPage.prototype.findSpecificNodeBByTreeIndex = function (node, index, result) {
  
  if (node.treeIndex === index) result.push(node);
  
  for (var position = 0; position < node.children.length; position++) {
    this.findSpecificNodeBByTreeIndex(node.children[position], index, result);
  }
  return result;
}

InputOutputHandlingPage.prototype.addInputButtonPressEvent = function (dialog, fadModel) {
  
  
  var assignedDocumentListBox = this.dialog.getPageElement(this.pageNumber, "IOHP_INPUT_ASSIGNED_LIST_BOX");
  var documentListBox = this.dialog.getPageElement(this.pageNumber, "IOHP_ELEMENTS_LIST_BOX");
  
  var selections = documentListBox.getSelection();
  
  if (selections === null || selections.length === 0) return false;
  this.assignObjectsBySelection(selections, this.assignedInputs, assignedDocumentListBox);
  
  
}

InputOutputHandlingPage.prototype.addOutputButtonPressEvent = function (dialog, fadModel) {
  
  var assignedDocumentListBox = this.dialog.getPageElement(this.pageNumber, "IOHP_OUTPUT_ASSIGNED_LIST_BOX");
  var documentListBox = this.dialog.getPageElement(this.pageNumber, "IOHP_ELEMENTS_LIST_BOX");
  
  var selections = documentListBox.getSelection();
  
  if (selections === null || selections.length === 0) return false;
  this.assignObjectsBySelection(selections, this.assignedOutputs, assignedDocumentListBox);
  
}

InputOutputHandlingPage.prototype.isInList = function (guid, list) {
  
  if (BaseDialog.isNullOrEmpty(list)) return false;
  
  return list.some(function (item) {
    return item.GUID().equals(guid);
  });
}


InputOutputHandlingPage.prototype.deleteInputButtonPressEvent = function (dialog) {
  
  var elementList = this.dialog.getPageElement(this.pageNumber, "IOHP_INPUT_ASSIGNED_LIST_BOX");
  this.changeAssignation(elementList, false);
  
}

InputOutputHandlingPage.prototype.deleteOutputButtonPressEvent = function () {
  
  var elementList = this.dialog.getPageElement(this.pageNumber, "IOHP_OUTPUT_ASSIGNED_LIST_BOX");
  this.changeAssignation(elementList, true);
}

InputOutputHandlingPage.prototype.changeAssignation = function (elementList, isOutput) {
  
  if (BaseDialog.isNullOrEmpty(elementList)) return false;
  
  var locale = this.locale;
  var selections = elementList.getSelection();
  var names = elementList.getItems().filter(function (item, index) {
    return selections.some(function (subIndex) { return index === subIndex;});
  });
  
  if (!isOutput) {
    this.assignedInputs = this.assignedInputs.filter(function (object) {
      return !names.some(function (name) {
        var objectName = BaseDialog.getMaintainedObjectName(object, locale);
        return String(objectName).equals(String(name));
      });
    });
    names = this.assignedInputs.map(function (object) {
      return BaseDialog.getMaintainedObjectName(object, locale);
    });
    elementList.setItems(names);
  } else {
    this.assignedOutputs = this.assignedOutputs.filter(function (object) {
      return !names.some(function (name) {
        var objectName = BaseDialog.getMaintainedObjectName(object, locale);
        return String(objectName).equals(String(name));
      });
    });
    names = this.assignedOutputs.map(function (object) {
      return BaseDialog.getMaintainedObjectName(object, locale);
    });
    elementList.setItems(names);
  }
  
  this.isChanged = true;
  
}

InputOutputHandlingPage.prototype.setCurrentAssignedInputsOutputs = function (fadModel) {
  
  var assignedInputListBox = this.dialog.getPageElement(this.pageNumber, "IOHP_INPUT_ASSIGNED_LIST_BOX");
  
  
  var assignedOutputListBox = this.dialog.getPageElement(this.pageNumber, "IOHP_OUTPUT_ASSIGNED_LIST_BOX");
  if (BaseDialog.isNullOrEmpty(assignedInputListBox)) return false;
  if (BaseDialog.isNullOrEmpty(assignedOutputListBox)) return false;
  
  if (BaseDialog.isArisObjectNullOrInvalid(fadModel)) return false;
  
  var occurrences = fadModel.ObjOccListFilter(FadModelManager.outputType, FadModelManager.outputSymbol);
  
  if (BaseDialog.isNullOrEmpty(occurrences)) return false;
  
  
  if (this.assignedInputs.length === 0) {
    this.assignedInputs = this.getObjects(occurrences, FadModelManager.inputConnectionType);
  }
  
  if (this.assignedOutputs.length === 0) {
    this.assignedOutputs = this.getObjects(occurrences, FadModelManager.outputConnectionType);
    
  }
  
  
  var locale = this.locale;
  var outputNames = this.assignedOutputs.map(function (occurrence) {
    return BaseDialog.getMaintainedObjectName(occurrence, locale);
  });
  
  var inputNames = this.assignedInputs.map(function (occurrence) {
    return BaseDialog.getMaintainedObjectName(occurrence, locale);
  });
  
  assignedOutputListBox.setItems(outputNames);
  assignedInputListBox.setItems(inputNames);
  
}

InputOutputHandlingPage.prototype.searchEvent = function (text) {
  var objects = this.searchText(text, this.searchingContext);
  var those = this;
  objects = objects.filter(function(item){
     return !those.assignedInputs.some(function(object) { return item[0].IsEqual(object)})
  });
  
  objects = objects.filter(function(item){
    return !those.assignedOutputs.some(function(object) { return item[0].IsEqual(object)})
  });
  return objects;
}

InputOutputHandlingPage.prototype.searchBoxChangeEvent = function () {
  
  var searchTextBox = this.dialog.getPageElement(this.pageNumber, "IOHP_SEARCH_BOX");
  var elementsListBox = this.dialog.getPageElement(this.pageNumber, "IOHP_ELEMENTS_LIST_BOX");
  
  if (BaseDialog.isNullOrEmpty(searchTextBox)) return false;
  if (BaseDialog.isNullOrEmpty(elementsListBox)) return false;
  
  
  var text = searchTextBox.getText();
  
  if (text.length() > 0) {
    this.searchCache = this.searchEvent(text);
    var results = [];
    for (var position = 0; position < this.searchCache.length; position++) {
      var resultOfSearching = this.searchCache[position];
      var documentName = resultOfSearching[0].Name(this.locale);
      results.push(documentName);
    }
    if (BaseDialog.isNullOrEmpty(results)) return false;
    elementsListBox.setItems(results);
  } else {
    this.searchDocumentCache = [];
    elementsListBox.setItems([]);
  }
}

InputOutputHandlingPage.prototype.getObjects = function (occurrences, connectionType) {
  
  var locale = this.locale;
  return occurrences.filter(function (occurrence) {
    return occurrence.CxnOccList().some(function (connectionOccurrence) {
      return connectionOccurrence.getDefinition().TypeNum() === connectionType;
    })
  }).map(function (occurrence) {
    return occurrence.ObjDef();
  }).sort(function (itemA, itemB) {
    var itemAName = BaseDialog.getMaintainedObjectName(itemA, locale);
    var itemBName = BaseDialog.getMaintainedObjectName(itemB, locale);
    return BaseDialog.stringSort(itemAName, itemBName);
  });
}


InputOutputHandlingPage.prototype.assignObjectsBySelection = function (selections, container, element) {
  
  var locale = this.locale;
  var documentListBox = this.dialog.getPageElement(this.pageNumber, "IOHP_ELEMENTS_LIST_BOX");
  
  var objects = this.searchCache.filter(function (object, index) {
    return selections.some(function (selectedIndex) {
      return selectedIndex === index;
    });
  });
  
  this.searchCache = this.searchCache.filter(function (object, index) {
    return !selections.some(function (selectedIndex) {
      return selectedIndex === index;
    });
  });
  
  var elementNames = this.searchCache.map(function (object) { return BaseDialog.getMaintainedObjectName(object[0], locale);});
  documentListBox.setItems(elementNames);
  
  container = objects.map(function (object) {
    return object[0];
  }).reduce(function (array, item) {
    
    if (!array.some(function (subItem) { return item.IsEqual(subItem)})) array.push(item);
    return array;
  }, container);
  
  var names = container.map(function (object) { return BaseDialog.getMaintainedObjectName(object, locale)}).sort(BaseDialog.stringSort);
  element.setItems(names);
  
}
