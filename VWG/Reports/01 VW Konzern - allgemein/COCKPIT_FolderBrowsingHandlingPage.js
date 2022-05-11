function FolderBrowsingHandlingPage(
  prefix,
  pageTitle,
  objectType,
  objectSymbol,
  sourceFolderGUID,
  newObjectFolderGUID,
  database,
  locale,
  pageNumber,
  dialog
) {
  
  if (BaseDialog.isNullOrEmpty(prefix)) throw new Packages.java.lang.NullPointerException("Parameter prefix is null or empty");
  
  this.prefix = prefix;
  this.pageTitle = pageTitle;
  this.objectType = objectType;
  this.objectSymbol = objectSymbol;
  this.sourceFolderGUID = sourceFolderGUID;
  this.newObjectFolderGUID = newObjectFolderGUID;
  this.database = database;
  this.locale = locale;
  this.tree = null;
  this.isChanged = false;
  this.pageNumber = pageNumber;
  this.dialog = dialog;
  
  this.assignedObject = [];
  this.cache = [];
  this.searchingContext = new Packages.java.util.HashMap();
  
  
}

FolderBrowsingHandlingPage.prototype = Object.create(BaseDialog.prototype)
FolderBrowsingHandlingPage.prototype.constructor = FolderBrowsingHandlingPage;

FolderBrowsingHandlingPage.prototype.getAssignedObjects = function () {
  return this.assignedObject;
}

FolderBrowsingHandlingPage.prototype.getSelectedObject = function () {
  
  var listBox = this.dialog.getPageElement(this.pageNumber, this.prefix + "_ELEMENTS_LIST_BOX");
  if (BaseDialog.isNullOrEmpty(listBox)) return -1;
  var selectedIndex = listBox.getSelectedIndex();
  if (selectedIndex === -1) return -1;
  
  return this.cache[selectedIndex][0]
}

FolderBrowsingHandlingPage.prototype.getSelectedAssignedObject = function () {
  
  var listBox = this.dialog.getPageElement(this.pageNumber, this.prefix + "_ASSIGNED_LIST_BOX");
  if (BaseDialog.isNullOrEmpty(listBox)) return -1;
  var selectedIndex = listBox.getSelectedIndex();
  if (selectedIndex === -1) return -1;
  
  return this.assignedObject[selectedIndex];
}

FolderBrowsingHandlingPage.prototype.createPage = function () {
  
  var page = Dialogs.createNewDialogTemplate(BaseDialog.templateWidth, BaseDialog.templateHeight, this.pageTitle);
  
  page.GroupBox(5, 5, BaseDialog.templateWidth - 5, BaseDialog.templateHeight - 5,
                BaseDialog.getStringFromStringTable(this.prefix + "_ASSIGN_GROUP", this.locale),
                this.prefix + "_ASSIGN_GROUP"
  );
  
  page.Text(20, 8, BaseDialog.templateWidth - 40, 20,
            BaseDialog.getStringFromStringTable("FBHP_SEARCH_LABEL", this.locale), this.prefix + "_SEARCH_LABEL"
  );
  
  page.TextBox(20, 20, BaseDialog.templateWidth - 40, 20, this.prefix + "_SEARCH_BOX");
  
  page.Tree(20, 45, (BaseDialog.templateWidth - 40) / 2,
            BaseDialog.twoThirdHeight - 2 * BaseDialog.pushButtoHeight - 46, this.prefix + "_SUBGROUPS_TREE_BOX"
  );
  
  page.ListBox(BaseDialog.templateWidth / 2, 45, (BaseDialog.templateWidth - 40) / 2,
               BaseDialog.twoThirdHeight - 2 * BaseDialog.pushButtoHeight - 46, [], this.prefix + "_ELEMENTS_LIST_BOX", 1
  );
  
  page.PushButton(BaseDialog.threeQuaterWidth - 2 * (BaseDialog.pushButtonWidth) - 20,
                  BaseDialog.twoThirdHeight - 2 * BaseDialog.pushButtoHeight, BaseDialog.pushButtonWidth,
                  BaseDialog.pushButtoHeight,
                  BaseDialog.getStringFromStringTable("ADD_BUTTON_TEXT", this.locale),
                  this.prefix + "_ADD_PUSH_BUTTON"
  );
  
  page.PushButton(BaseDialog.threeQuaterWidth - BaseDialog.pushButtonWidth - 10,
                  BaseDialog.twoThirdHeight - 2 * BaseDialog.pushButtoHeight,
                  BaseDialog.pushButtonWidth, BaseDialog.pushButtoHeight,
                  BaseDialog.getStringFromStringTable("EDIT_BUTTON_TEXT", this.locale),
                  this.prefix + "_EDIT_PUSH_BUTTON"
  );
  
  page.PushButton(BaseDialog.threeQuaterWidth, BaseDialog.twoThirdHeight - 2 * BaseDialog.pushButtoHeight,
                  BaseDialog.pushButtonWidth, BaseDialog.pushButtoHeight,
                  BaseDialog.getStringFromStringTable("NEW_BUTTON_TEXT", this.locale),
                  this.prefix + "_NEW_PUSH_BUTTON"
  );
  
  page.GroupBox(5, BaseDialog.twoThirdHeight, BaseDialog.templateWidth - 5,
                BaseDialog.oneThirdHeight,
                BaseDialog.getStringFromStringTable(this.prefix + "_ASSIGNED_GROUP", this.locale),
                this.prefix + "_ASSIGNED_GROUP"
  );
  
  page.ListBox(20, BaseDialog.twoThirdHeight + 20, BaseDialog.templateWidth - 40,
               BaseDialog.oneThirdHeight - 2 * BaseDialog.pushButtoHeight - 10, [],
               this.prefix + "_ASSIGNED_LIST_BOX", 1
  );
  
  
  page.PushButton(BaseDialog.threeQuaterWidth - BaseDialog.pushButtonWidth - 10,
                  BaseDialog.templateHeight - BaseDialog.pushButtoHeight - 10,
                  BaseDialog.pushButtonWidth, BaseDialog.pushButtoHeight,
                  BaseDialog.getStringFromStringTable("EDIT_BUTTON_TEXT", this.locale),
                  this.prefix + "_SECOND_EDIT_PUSH_BUTTON"
  );
  
  page.PushButton(BaseDialog.threeQuaterWidth,
                  BaseDialog.templateHeight - BaseDialog.pushButtoHeight - 10,
                  BaseDialog.pushButtonWidth, BaseDialog.pushButtoHeight,
                  BaseDialog.getStringFromStringTable("DELETE_BUTTON_TEXT", this.locale),
                  this.prefix + "_DELETE_PUSH_BUTTON"
  );
  
  return page;
}

FolderBrowsingHandlingPage.prototype.init = function (fadModel) {
  
  var group = this.database.FindGUID(this.sourceFolderGUID, Constants.CID_GROUP);
  if (BaseDialog.isArisObjectNullOrInvalid(group)) return false;
  
  this.buildTree(group);
  
  var treeElement = this.dialog.getPageElement(this.pageNumber, this.prefix + "_SUBGROUPS_TREE_BOX");
  var listElement = this.dialog.getPageElement(this.pageNumber, this.prefix + "_ELEMENTS_LIST_BOX")
  if (!BaseDialog.isNullOrEmpty(treeElement) && !BaseDialog.isNullOrEmpty(listElement)) {
    treeElement.deleteItemByIndex(0);
    listElement.setItems([]);
    this.fillTreeElement(treeElement);
  } else throw new Packages.java.lang.NullPointerException("Cannot find a tree dialog element");
  
  if (BaseDialog.isNullOrEmpty(fadModel)) return true;
  this.setCurrentAssignedObjects(fadModel);
  return true;
}

FolderBrowsingHandlingPage.prototype.buildTree = function (group) {
  
  if (BaseDialog.isArisObjectNullOrInvalid(group)) return false;
  if (BaseDialog.isNullOrEmpty(this.objectType)) return false;
  if (BaseDialog.isNullOrEmpty(this.locale)) return false;
  
  var searchObjectType = this.objectType;
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

FolderBrowsingHandlingPage.prototype.fillTreeElement = function (treeElement) {
  
  if (BaseDialog.isNullOrEmpty(treeElement)) return false;
  var index = 0;
  var parentTreeItem = treeElement.addChild(null, this.tree.groupName, index++);
  this.tree.treeIndex = 0;
  
  for (var position = 0; position < this.tree.children.length; position++) {
    var child = this.tree.children[position];
    index = this.insertTreeItem(treeElement, parentTreeItem, child, index);
    
  }
}

FolderBrowsingHandlingPage.prototype.insertTreeItem = function (treeElement, parentTreeItem, node, index) {
  
  this.insertIntoSearchContext(node.getObjects(), index);
  node.treeIndex = index;
  parentTreeItem = treeElement.addChild(parentTreeItem, node.groupName, index++);
  
  if (node.children.length === 0) return index;
  for (var position = 0; position < node.children.length; position++) {
    index = this.insertTreeItem(treeElement, parentTreeItem, node.children[position], index);
  }
  return index;
}

FolderBrowsingHandlingPage.prototype.insertIntoSearchContext = function (items, baseIndex) {
  
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

FolderBrowsingHandlingPage.prototype.tryToSearch = function (searchingText) {
  var those = this;
  var found = this.searchText(searchingText, this.searchingContext);
  found = found.filter(function (item) {
    return !those.assignedObject.some(function (object) {
      return item[0].IsEqual(object);
    });
  });
  return found;
}

FolderBrowsingHandlingPage.prototype.searchBoxChangeEvent = function () {
  
  var searchBox = this.dialog.getPageElement(this.pageNumber, this.prefix + "_SEARCH_BOX");
  var listBox = this.dialog.getPageElement(this.pageNumber, this.prefix + "_ELEMENTS_LIST_BOX");
  
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
    return BaseDialog.getMaintainedObjectName(item[0], locale);
  }).sort(BaseDialog.stringSort);
  listBox.setItems(items);
}

FolderBrowsingHandlingPage.prototype.treeBoxChangeEvent = function (selectedIndex) {
  
  this.cache = [];
  
  var treeBox = this.dialog.getPageElement(this.pageNumber, this.prefix + "_SUBGROUPS_TREE_BOX");
  var listBox = this.dialog.getPageElement(this.pageNumber, this.prefix + "_ELEMENTS_LIST_BOX");
  
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

FolderBrowsingHandlingPage.prototype.addButtonPressEvent = function (fadModel) {
  
  var locale = this.locale;
  
  var assignedListBox = this.dialog.getPageElement(this.pageNumber, this.prefix + "_ASSIGNED_LIST_BOX");
  var listBox = this.dialog.getPageElement(this.pageNumber, this.prefix + "_ELEMENTS_LIST_BOX");
  
  if (BaseDialog.isNullOrEmpty(assignedListBox)) return false;
  if (BaseDialog.isNullOrEmpty(listBox)) return false;
  
  
  var selections = listBox.getSelection();
  
  if (selections === null || selections.length === 0) return false;
  
  var objects = this.cache.filter(function (object, index) {
    return selections.some(function (selectedIndex) {
      return selectedIndex === index;
    });
  });
  
  this.cache = this.cache.filter(function (object, index) {
    return !selections.some(function (selectedIndex) {
      return selectedIndex === index;
    });
  });
  
  var elementNames = this.cache.map(function (object) { return BaseDialog.getMaintainedObjectName(object[0], locale);});
  listBox.setItems(elementNames);
  
  this.assignedObject = objects.map(function (object) {
    return object[0];
  }).reduce(function (array, item) {
    
    if (!array.some(function (subItem) { return item.IsEqual(subItem)})) array.push(item);
    return array;
  }, this.assignedObject);
  
  var names = this.assignedObject.map(function (object) { return BaseDialog.getMaintainedObjectName(object, locale)}).sort(BaseDialog.stringSort);
  assignedListBox.setItems(names);
  
  if (BaseDialog.isArisObjectNullOrInvalid(fadModel)) {
    this.isChanged = true;
    return false;
  }
  
  
}

FolderBrowsingHandlingPage.prototype.deleteButtonPressEvent = function () {
  
  var assignedListBox = this.dialog.getPageElement(this.pageNumber, this.prefix + "_ASSIGNED_LIST_BOX");
  if (BaseDialog.isNullOrEmpty(assignedListBox)) return false;
  
  var selections = assignedListBox.getSelection();
  
  var names = assignedListBox.getItems().filter(function (item, index) {
    return selections.some(function (subIndex) { return index === subIndex;});
  });
  
  var locale = this.locale;
  this.assignedObject = this.assignedObject.filter(function (object) {
    return !names.some(function (name) {
      var objectName = BaseDialog.getMaintainedObjectName(object, locale);
      return String(objectName).equals(String(name));
    });
  });
  
  names = this.assignedObject.map(function (object) {
    return BaseDialog.getMaintainedObjectName(object, locale);
  });
  assignedListBox.setItems(names);
  
}

FolderBrowsingHandlingPage.prototype.setCurrentAssignedObject = function (fadModel) {
  
  if (BaseDialog.isArisObjectNullOrInvalid(fadModel)) return false;
  
  var assignedListBox = this.dialog.getPageElement(this.pageNumber, this.prefix + "_ASSIGNED_LIST_BOX");
  if (BaseDialog.isNullOrEmpty(assignedListBox)) return false;
  
  
  var fadModelOccurrences = fadModel.ObjOccListFilter(this.objectType, this.objectSymbol);
  
  if (BaseDialog.isNullOrEmpty(fadModelOccurrences)) return false;
  
  this.assignedObject = fadModelOccurrences.map(function (occurrence) {
    return occurrence.ObjDef();
  })
  
  var locale = this.locale;
  var objectNames = this.assignedObject.map(function (occurrence) {
    return occurrence.ObjDef().Name(locale);
  }).sort(BaseDialog.stringSort);
  assignedListBox.setItems(objectNames);
  
}

FolderBrowsingHandlingPage.prototype.findItemByTreeIndex = function (index) {
  
  var result = []
  result = this.findSpecificNodeBByTreeIndex(this.tree, index, result);
  return result.length === 0 ? null : result[0]
  
}

FolderBrowsingHandlingPage.prototype.findSpecificNodeBByTreeIndex = function (node, index, result) {
  
  if (node.treeIndex === index) result.push(node);
  
  for (var position = 0; position < node.children.length; position++) {
    this.findSpecificNodeBByTreeIndex(node.children[position], index, result);
  }
  return result;
}

FolderBrowsingHandlingPage.prototype.isInValidState = function (dialog, fadModel) {
  
  
  this.validAssignedListBoxButtons();
  this.validElementListBoxButtons();
  this.checkChangedContext(fadModel);
  return this.isChanged;
  
}

FolderBrowsingHandlingPage.prototype.validElementListBoxButtons = function () {
  
  var documentListBox = this.dialog.getPageElement(this.pageNumber, this.prefix + "_ELEMENTS_LIST_BOX");
  var pushButtonAdd = this.dialog.getPageElement(this.pageNumber, this.prefix + "_ADD_PUSH_BUTTON");
  var pushButtonEdit = this.dialog.getPageElement(this.pageNumber, this.prefix + "_EDIT_PUSH_BUTTON");
  
  
  var selections = documentListBox.getSelection();
  if (selections === null || selections.length === 0) {
    pushButtonAdd.setEnabled(false);
    pushButtonEdit.setEnabled(false);
  } else if (selections.length === 1) {
    pushButtonAdd.setEnabled(true);
    pushButtonEdit.setEnabled(true);
  } else {
    pushButtonAdd.setEnabled(true);
    pushButtonEdit.setEnabled(false);
  }
}

FolderBrowsingHandlingPage.prototype.validAssignedListBoxButtons = function () {
  
  var assignedListBox = this.dialog.getPageElement(this.pageNumber, this.prefix + "_ASSIGNED_LIST_BOX");
  var pushButtonDelete = this.dialog.getPageElement(this.pageNumber, this.prefix + "_DELETE_PUSH_BUTTON");
  var pushButtonSecondEdit = this.dialog.getPageElement(this.pageNumber, this.prefix + "_SECOND_EDIT_PUSH_BUTTON");
  
  var selections = assignedListBox.getSelection();
  
  if (selections === null || selections.length === 0) {
    
    pushButtonDelete.setEnabled(false);
    pushButtonSecondEdit.setEnabled(false);
  } else if (selections.length === 1) {
    
    pushButtonDelete.setEnabled(true);
    pushButtonSecondEdit.setEnabled(true);
  } else {
    pushButtonDelete.setEnabled(true);
    pushButtonSecondEdit.setEnabled(false);
  }
}

FolderBrowsingHandlingPage.prototype.setCurrentAssignedObjects = function (model) {
  
  var pageElement = this.dialog.getPageElement(this.pageNumber, this.prefix + "_ASSIGNED_LIST_BOX");
  
  if (BaseDialog.isNullOrEmpty(pageElement)) return false;
  
  var locale = this.locale
  
  var modelOccurreces = model.ObjOccListFilter(this.objectType, this.objectSymbol).sort(function (itemA, itemB) {
    var nameA = BaseDialog.getMaintainedObjectName(itemA.ObjDef(), locale);
    var nameB = BaseDialog.getMaintainedObjectName(itemB.ObjDef(), locale);
    return nameA.localeCompare(nameB);
  });
  
  if (BaseDialog.isNullOrEmpty(modelOccurreces)) return false;
  
  if (this.assignedObject.length === 0) {
    this.assignedObject = modelOccurreces.map(function (occurrence) {
      return occurrence.ObjDef();
    })
  } else {
    this.assignedObject = this.assignedObject.sort(function (itemA, itemB) {
      var nameA = BaseDialog.getMaintainedObjectName(itemA, locale);
      var nameB = BaseDialog.getMaintainedObjectName(itemB, locale);
      return nameA.localeCompare(nameB);
    });
    
  }
  
  var objectNames = this.assignedObject.map(function (objectDefinition) {
    return BaseDialog.getMaintainedObjectName(objectDefinition, locale);
  });
  pageElement.setItems(objectNames);
  
}

FolderBrowsingHandlingPage.prototype.checkChangedContext = function (fadModel) {

   if (!BaseDialog.isNullOrEmpty(fadModel)) {
     var fadModelOccurrences = fadModel.ObjOccListFilter(this.objectType, this.objectSymbol);
  
     if (!BaseDialog.isNullOrEmpty(fadModelOccurrences)) {
       var those = this;
       this.isChanged = !fadModelOccurrences.every(function (occurrence) {
         return those.assignedObject.some(function (object) { return object.IsEqual(occurrence.ObjDef());});
       });
     } else this.isChanged = true;
   }
   this.isChanged = true;
}
