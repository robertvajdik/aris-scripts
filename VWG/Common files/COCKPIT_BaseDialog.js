function BaseDialog() {

  this.a = 0;
}

BaseDialog.EMPTY_STRING = "";

BaseDialog.templateWidth = 720;
BaseDialog.templateHeight = 420;//480 def value,150% zoom 420
BaseDialog.tableColumnWidth = 25;
BaseDialog.tableOneThirdColumnWidth = 33;
BaseDialog.oneQuaterWidth = Math.floor(BaseDialog.templateWidth / 4);
BaseDialog.threeQuaterWidth = BaseDialog.templateWidth - BaseDialog.oneQuaterWidth;
BaseDialog.oneThirdHeight = Math.floor(BaseDialog.templateHeight / 3);
BaseDialog.twoThirdHeight = BaseDialog.templateHeight - BaseDialog.oneThirdHeight;
BaseDialog.halfHeight = Math.floor(BaseDialog.templateHeight / 2);
BaseDialog.halfWidth = Math.floor(BaseDialog.templateWidth / 2);
BaseDialog.pushButtonWidth = 130;
BaseDialog.pushButtoHeight = 20;
BaseDialog.TOPIC_COMMENTARY_INDEX = 3;
BaseDialog.TOPIC_GUID_INDEX = 4;

BaseDialog.isNullOrEmpty = function (array) {
  return array === undefined || array === null || array.length === 0;
}
BaseDialog.isArisObjectNullOrInvalid = function (object) {
  return object === null || object === undefined || object.IsValid() === false;
}
BaseDialog.isChecked = function (row) {
  var checked = row[0].toLowerCase();
  return checked.localeCompare("true") === 0 ||
      checked.localeCompare("1") === 0;
}
BaseDialog.isNotChecked = function (row) {

  var checked = row[0].toLowerCase();
  return checked.localeCompare("false") === 0 ||
      checked.localeCompare("0") === 0;

}
BaseDialog.accountNameSort = function (itemA, itemB) {
  return itemA[1] > itemB[1] ? 1 : -1;
}
BaseDialog.systemNameSort = function (itemA, itemB) {
  return itemA[0] > itemB[0] ? 1 : -1;
}
BaseDialog.stringSort = function (itemA, itemB) {
  if (itemA < itemB) return -1;
  if (itemA > itemB) return 1;
  return 0;
}
BaseDialog.getDescription = function (guid, locale) {

  var object = ArisData.getActiveDatabase().FindGUID(guid, Constants.CID_OBJDEF);
  if (BaseDialog.isArisObjectNullOrInvalid(object)) return "";

  return object.Attribute(Constants.AT_DESC, locale).getValue();

}
BaseDialog.isArrayEqual = function (arrayA, arrayB) {
  var trash = [];
  arrayA = arrayA.toString().split(',').map(String);
  arrayB = arrayB.toString().split(',').map(String);

  for (var i in arrayA) {
    if (arrayB.indexOf(arrayA[i]) === -1) trash.push(arrayA[i]);
  }
  for (i in arrayB) {
    if (arrayA.indexOf(arrayB[i]) === -1) trash.push(arrayB[i]);
  }
  return trash.length === 0;
}
BaseDialog.accountNameSort = function (itemA, itemB) {
  return itemA[1] > itemB[1] ? 1 : -1;
}
BaseDialog.insertIntoListAttributes = function (table, attributes, attribute) {

  var currentAttribute = attributes.get(attribute);
  if (currentAttribute != null) table.put(attribute, currentAttribute.get());

}
BaseDialog.buildSearchQuery = function (type, content) {

  var ldapQuery = "(&(objectCategory=person)(objectClass=user))";
  if (content instanceof Array) {
    return "";
  }

  return [
    ldapQuery.slice(0, ldapQuery.length() - 1),
    "(",
    type,
    "=",
    content,
    ")",
    ldapQuery.slice(ldapQuery.length() - 1)
  ].join("");
}
BaseDialog.buildAllDomainsList = function (domains, exclude) {

  return domains.filter(
      function (domain) {
        return domain.dc.localeCompare(exclude) !== 0;
      })
      .reduce(function (allDomains, domain) {
        return allDomains.concat([domain.dc, domain.url]);
      }, []);

}
BaseDialog.getMaintainedObjectName = function (object, locale) {
  return BaseDialog.getMaintainedObjectAttribute(object, Constants.AT_NAME, locale);
}
BaseDialog.getMaintainedObjectAttribute = function (object, attribute, locale) {

  if (BaseDialog.isArisObjectNullOrInvalid(object)) return "";
  var nameAttribute = object.Attribute(attribute, locale);
  if (nameAttribute.IsMaintained()) return nameAttribute.getValue();

  var localeToBrowse = SUPPORTED_LANGUAGES.filter(function (language) {
    return language !== locale;
  });
  var objectNames = localeToBrowse.filter(function (language) {
    return object.Attribute(attribute, language).IsMaintained();
  }).map(function (language) {
    var name = object.Attribute(attribute, language).getValue();
    var localeInfo = ArisData.getActiveDatabase().getDbLanguage().convertLocale(language);

    return name + " (" + localeInfo.getLocale().getLanguage().toUpperCase() + ")";
  });

  if (objectNames.length > 0) return objectNames[0];
  return nameAttribute.getValue();
}
BaseDialog.getStringFromStringTable = function (title, localeId) {


  var locales = ArisData.getActiveDatabase().LanguageList().filter(function (language) {
    return localeId === language.LocaleId();
  });

  var content = locales.map(function (locale) {
    var currentLocale = locale.LocaleInfo().getLocale();
    return getString(String(title), currentLocale);
  }).filter(function (content) {
    return content.length > 0 && content.indexOf("String not found") === -1;
  });

  if (content.length > 0) return content[0];
  return title;
}
BaseDialog.getAllStringFromStringTable = function (title) {

  var locales = ArisData.getActiveDatabase().LanguageList().filter(function (language) {
    return SUPPORTED_LANGUAGES.some(function (localeId) {
      return localeId === language.LocaleId();
    });
  });

  return locales.map(function (locale) {
    var currentLocale = locale.LocaleInfo().getLocale();
    var content = getString(String(title), currentLocale);

    if (content.length > 0 && content.indexOf("String not found") === -1) return [locale.LocaleInfo().getLocaleID(), content];
    return [locale.LocaleInfo().getLocaleID(), title];
  });

}
BaseDialog.getMaxItemCount = function (arrayOfArray) {

  return arrayOfArray.map(function (array) {
    return array.length;
  }).reduce(function (array, item) {
    return array.concat(item);
  }, []).reduce(function (max, item) {
    return Math.max(max, item);
  }, 0);
}
BaseDialog.findItemByTreeIndex = function(items,selection) {

  var result = [];
  for (var position = 0; position < items.length; position++) {
    result = BaseDialog.findSpecificNodeByTreeIndex(items[position], selection, result);
  }
  return result.length === 0 ? null : result[0];
}
BaseDialog.findSpecificNodeByTreeIndex = function (node, index, result) {

  if (node.treeIndex === index) result.push(node);

  for (var position = 0; position < node.children.length; position++) {
    BaseDialog.findSpecificNodeByTreeIndex(node.children[position], index, result);
  }
  return result;
}

BaseDialog.prototype.markAllItemsSelected = function (pageNumber, elementIdentifier, checkBoxPosition, state) {

  var table = this.getPageElement(pageNumber, elementIdentifier);
  if (table === null) return false;

  var rows = table.getItems();
  rows.forEach(function (row) {
    row[checkBoxPosition] = state
  });
  table.setItems(rows);
}
BaseDialog.prototype.getPageElement = function (pageNumber, elementIdentifier) {

  var page = this.dialog.getPage(pageNumber);
  if (page === null) return null;
  return page.getDialogElement(elementIdentifier);
}
BaseDialog.prototype.searchText = function (searchingText, cache) {

  var result = [];
  var iterator = cache.keySet().iterator();
  while (iterator.hasNext()) {
    var key = iterator.next();

    if (key.toLowerCase().indexOf(searchingText.toLowerCase()) === -1) continue;
    result.push(cache.get(key));
  }
  return result;
}
BaseDialog.prototype.loadTypedObjOccFromModel = function (model, type) {

  if (model === null) return [];
  if (type === null) return [];

  return model.ObjOccListFilter(type);

}
BaseDialog.prototype.getSpecificConnectionType = function (connectionOccurrences, connectionType) {
  return connectionOccurrences.filter(function (connectionOccurrence) {
    return connectionOccurrence.getDefinition().TypeNum() === connectionType;
  })
}
BaseDialog.prototype.getConnectionReason = function (connectionOccurrences, connectionType, connectionAttribute, locale) {


  var connections = this.getSpecificConnectionType(connectionOccurrences, connectionType);
  if (BaseDialog.isNullOrEmpty(connections)) return BaseDialog.EMPTY_STRING;
  var connectionDefinition = connections[0].getDefinition();
  return connectionDefinition.Attribute(connectionAttribute, locale).IsMaintained() ?
      connectionDefinition.Attribute(connectionAttribute, locale).getValue() :
      BaseDialog.EMPTY_STRING;

}
BaseDialog.prototype.buildTree = function (group, objectType, locale) {

  if (BaseDialog.isArisObjectNullOrInvalid(group)) {
    writeLog(sm72tc, "Input group is null nor invalid ARIS object", "error");
    throw new Packages.java.lang.NullPointerException("Input group is null nor invalid ARIS object");
  }

  if (BaseDialog.isNullOrEmpty(objectType)) {
    writeLog(sm72tc, "Object type is null", "error");
    throw new Packages.java.lang.NullPointerException("Object type is null");
  }

  if (BaseDialog.isNullOrEmpty(locale)) {
    writeLog(sm72tc, "Locale is null", "error");
    throw new Packages.java.lang.NullPointerException("Locale is null");
  }

  var definitions = group.ObjDefListFilter(objectType);
  var tree = new TreeNode(group, definitions, locale);

  var stack = [tree];
  while (stack.length > 0) {
    var node = stack.pop();
    if (!BaseDialog.isArisObjectNullOrInvalid(node.group)) {
      var childGroups = ArisData.sort(node.group.Childs(), Constants.SORT_GROUPPATH, locale);
      if (!BaseDialog.isNullOrEmpty(childGroups)) {
        childGroups.forEach(function (childGroup) {
          var definitions = childGroup.ObjDefListFilter(objectType);
          var childNode = new TreeNode(childGroup, definitions, locale);
          node.children.push(childNode);
          stack.push(childNode);
        });
      }
    }
  }
  return tree;

}
BaseDialog.prototype.fillTreeElement = function (tree, treeElement, locale) {

  var searchContext = new Packages.java.util.HashMap();

  if (BaseDialog.isNullOrEmpty(tree)) {
    writeLog(sm72tc, "Base dialog fillTreeElement is called with null tree", "error");
    throw new Packages.java.lang.NullPointerException("Tree is null");
  }

  if (BaseDialog.isNullOrEmpty(treeElement)) {
    writeLog(sm72tc, "Base dialog fillTreeElement is called with null tree element", "error");
    throw new Packages.java.lang.NullPointerException("Tree element is null");
  }

  var index = 0;
  var parentTreeItem = treeElement.addChild(null, tree.groupName, index++);
  tree.treeIndex = 0;

  if (tree.children.length === 0) {
    this.insertIntoSearchContext(tree.getObjects(),0,searchContext,locale);
  }


  for (var position = 0; position < tree.children.length; position++) {
    var child = tree.children[position];
    index = this.insertTreeItem(treeElement, parentTreeItem, child, index, locale, searchContext);

  }


  return searchContext;
}
BaseDialog.prototype.insertTreeItem = function (treeElement, parentTreeItem, node, index, locale, searchingContext) {

  this.insertIntoSearchContext(node.getObjects(), index, searchingContext, locale);
  node.treeIndex = index;
  parentTreeItem = treeElement.addChild(parentTreeItem, node.groupName, index++);

  if (node.children.length === 0) return index;
  for (var position = 0; position < node.children.length; position++) {
    index = this.insertTreeItem(treeElement, parentTreeItem, node.children[position], index, locale, searchingContext);
  }
  return index;
}
BaseDialog.prototype.insertIntoSearchContext = function (items, baseIndex, searchContext, locale) {

  if (BaseDialog.isNullOrEmpty(searchContext)) {
    writeLog(sm72tc, "searchContext variable is not defined", "error");
    throw new Packages.java.lang.NullPointerException("searchContext variable is not defined");
  }
  if (BaseDialog.isNullOrEmpty(locale)) {
    writeLog(sm72tc, "locale variable is not defined", "error");
    throw new Packages.java.lang.NullPointerException("locale variable is not defined");
  }

  if (BaseDialog.isNullOrEmpty(items)) return searchContext;
  if (BaseDialog.isNullOrEmpty(baseIndex)) return searchContext;

  if (typeof items.length !== 'undefined' && items.length > 0) {

    items.forEach(function (item) {
      var name = BaseDialog.getMaintainedObjectName(item, locale);
      searchContext.put(name, [item, baseIndex]);
    });
  }

}
BaseDialog.prototype.removeFromAssignedItems = function(listBox) {

  if (BaseDialog.isNullOrEmpty(listBox)) return false;
  var selection = listBox.getSelection();

  this.assignedItems = this.assignedItems.filter(function (item, index) {
    return !selection.some(function (number) {
      return index === number
    });
  });

  var items = this.assignedItems.map(function (item) {
    return item.name;
  });
  listBox.setItems(items);
}
BaseDialog.prototype.mapAssignedItems = function () {
  return this.assignedItems.map(function (item) {
    return item.name;
  });
}
BaseDialog.prototype.insertItemsIntoTree = function (items,treeBox) {

  var index = 0;
  items.filter(function (item) {
    return item.isFolder;
  }).forEach(function (item) {
    item.treeIndex = index;
    var parent = treeBox.addChild(null, item.name, index++);
    if (item.children.length > 0) {
      item.children.filter(function (subItem) {
        return subItem.isFolder;
      }).forEach(function (subItem) {
        subItem.treeIndex = index;
        treeBox.addChild(parent, subItem.name, index++);
      });
    }
  });
  return index;
}
BaseDialog.prototype.filterAssignedItems = function (selection) {

  var listBoxItems = this.cache.filter(function (item, index) {
    return selection.some(function (number) {
      return number === index;
    });
  })
  this.cache = this.cache.filter(function (item) {
    return !listBoxItems.some(function (subItem) {
      return subItem.name.localeCompare(item.name) === 0;
    });
  })
  this.assignedItems.push.apply(this.assignedItems, listBoxItems);
}