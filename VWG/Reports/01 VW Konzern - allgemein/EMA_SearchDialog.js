function runEMADialog(users, maximalUserCount, corporateKey) {
  var dialogFunction = new EMA_SearchDialog(users, maximalUserCount, corporateKey);
  return Dialogs.showDialog(dialogFunction, Constants.DIALOG_TYPE_ACTION, "Search LDAP users dialog");
}

function EMA_SearchDialog(users, maximalUserCount, corporateKey) {
  
  
  //(((<)([a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4})(>));)/gi -- regex for parsing emails from text
  //(([a-z]+,\s[a-z]+\s+\([a-z0-9-/]+\)))/gi - regex for names
  
  this.users = users;
  this.maximalUserCount = maximalUserCount;
  this.corporateKey = corporateKey;
  this.selectedBaseDN = null;
  this.baseDomains = [];
  this.ldapSearchComponent = new EMA_LDAPSearchComponent();
  this.noChanges = true;
  
  
  this.dialogResult = {
    isOk: false,
    selectedUsers: []
  };
  
  
  this.tableColumnsStyle = [
    Constants.TABLECOLUMN_BOOL_EDIT, Constants.TABLECOLUMN_SINGLELINE,
    Constants.TABLECOLUMN_SINGLELINE, Constants.TABLECOLUMN_SINGLELINE,
    Constants.TABLECOLUMN_SINGLELINE
  ];
  
  this.tableColumnsHeader = [
    getString("DLG_CHECK"), getString("DLG_LOGIN"),
    getString("DLG_NAME"), getString("DLG_SPEZ_EM"),
    "dc"
  ];
  
  this.displayNameRegex = /([a-z]*,)(\s[a-z]*)(\s[0-9]*)*/gi;
  this.emailRegex = /[a-z0-9._-]+@[a-z0-9.-]+\.[a-z]{2,4}/gi
  this.excludeDomain = "DC=vwg";
  
  
  this.getPages = function () {
    
    var page = Dialogs.createNewDialogTemplate(0, 0, 960, 80, "Search LDAP users");
    
    
    page.Text(20, 18, 720, 20, getString("DLG_USR_MULTI"), "MULTI_SEARCH_LABEL");
    page.TextBox(20, 30, 720, 20, "MULTI_USER_SEARCH");
    page.PushButton(780, 29, 130, 20, getString("DLG_USER_SEARCH_BTN"), "SEARCH_BUTTON");
    page.DropListBox(20, 70, 350, 20, this.ldapSearchComponent.getBaseDomains(), "SELECT_BASE_DN", 0);
    
    
    page.Table(20, 110, 540, 260, this.tableColumnsHeader, this.tableColumnsStyle, [12, 20, 40, 40, 0], "S_TABLE", Constants.TABLE_STYLE_SORTED);
    page.PushButton(20, 380, 130, 20, getString("DLG_USR_SEL_ALL"), "SELECT_ALLS");
    page.PushButton(170, 380, 130, 20, getString("DLG_USR_SEL_NONE"), "SELECT_NONES");
    
    page.PushButton(605, 105, 130, 20, getString("DLG_USR_ADD"), "ADD");
    page.PushButton(605, 130, 130, 20, getString("DLG_USR_REMOVE"), "REMOVE");
    
    
    page.Table(770, 110, 540, 260, this.tableColumnsHeader, this.tableColumnsStyle, [12, 20, 40, 40, 0], "T_TABLE", Constants.TABLE_STYLE_SORTED);
    page.PushButton(770, 380, 130, 20, getString("DLG_USR_SEL_ALL"), "SELECT_ALLT");
    page.PushButton(910, 380, 130, 20, getString("DLG_USR_SEL_NONE"), "SELECT_NONET");
    page.PushButton(1050, 380, 180, 20, getString("DLG_USR_DEL_INACTIVE"), "DELETE_INACTIVE");
    
    
    page.Text(20, 5, 960, 10, "<b style='color: red;'>" + getString("DLG_USR_MAX_1") + this.maximalUserCount + getString("DLG_USR_MAX_2") + ".</b>", "MAX_USERS_LABEL");
    page.Text(20, 320, 450, 40, getString("DLG_USR_4"), "SEARCHING_PATTERN_LABEL");
    
    
    return [page];
  }
  
  this.init = function (pages) {
    
    var sourceTable = this.getPageElement(0, "S_TABLE");
    var targetTable = this.getPageElement(0, "T_TABLE");
    var searchButton = this.getPageElement(0, "SURNAME");
    var domainsDropBox = this.getPageElement(0, "SELECT_BASE_DN");
    
    if (sourceTable !== null) sourceTable.setEnabled(true);
    if (targetTable !== null) {
      targetTable.setEnabled(true);
      targetTable.setItems(this.users);
    }
    
    if (searchButton !== null) searchButton.setEnabled(true);
    if (domainsDropBox !== null) {
      domainsDropBox.setEnabled(true);
      domainsDropBox.setItems(this.ldapSearchComponent.getBaseDomains());
    }
    
    this.setDomainsDropBoxByCorporateKey(domainsDropBox);
    
    
  }
  
  this.isInValidState = function (pageNumber) {
    
    var targetTable = this.getPageElement(pageNumber, "T_TABLE");
    var sourceTable = this.getPageElement(pageNumber, "S_TABLE");
    var searchButton = this.getPageElement(pageNumber, "SEARCH_BUTTON");
    var addButton = this.getPageElement(pageNumber, "ADD");
    var removeButton = this.getPageElement(pageNumber, "REMOVE");
    var multiInputTextBox = this.getPageElement(pageNumber, "MULTI_USER_SEARCH");
    var dropBox = this.getPageElement(pageNumber, "SELECT_BASE_DN");
    
    if (targetTable === null || addButton === null || searchButton === null || removeButton === null || sourceTable === null
      || dropBox === null) return true;
    
    var length = targetTable.getItems().length;
    
    if (length === this.maximalUserCount) addButton.setEnabled(false);
    else addButton.setEnabled(true);
    
    var isSourceSelected = sourceTable.getItems().some(EMA_Helper.isChecked);
    
    var isTargetSelected = targetTable.getItems().some(EMA_Helper.isChecked);
    
    
    if (isSourceSelected) addButton.setEnabled(true);
    else addButton.setEnabled(false);
    if (isTargetSelected) removeButton.setEnabled(true);
    else removeButton.setEnabled(false);
    
    if (multiInputTextBox.getText().length() < 3) searchButton.setEnabled(false);
    else searchButton.setEnabled(true);
    
    if (multiInputTextBox.getText().indexOf(";") === -1) dropBox.setEnabled(true);
    else dropBox.setEnabled(false);
    
    if (length === this.users.length) {
      var targets = targetTable.getItems();
      targets.sort(EMA_Helper.accountNameSort)
      this.noChanges =
        this.users
          .sort(EMA_Helper.accountNameSort)
          .map(function (user, index) {
            return user[1].localeCompare(targets[index][1]) === 0 &&
              user[2].localeCompare(targets[index][2]) === 0;
          })
          .reduce(function (previous, current) {
            return previous && current
          }, true);
    } else {
      this.noChanges = false;
    }
    
    
    return !this.noChanges;
    
  }
  
  this.getResult = function () {
    return this.dialogResult;
  }
  
  this.onClose = function (pageNumber, bOk) {
    
    var targetTable = this.getPageElement(0, "T_TABLE");
    
    this.dialogResult.isOk = bOk;
    this.dialogResult.selectedUsers.push.apply(this.dialogResult.selectedUsers, targetTable.getItems());
  }
  
  this.SEARCH_BUTTON_pressed = function () {
    
    
    var multiInputTextBox = this.getPageElement(0, "MULTI_USER_SEARCH");
    
    if (multiInputTextBox === null) return;
    
    if (multiInputTextBox.getText().length() >= 3) this.searchUserByMultiInput(multiInputTextBox);
    
  }
  
  this.SELECT_BASE_DN_selChanged = function (selection) {
    
    var dropBox = this.getPageElement(0, "SELECT_BASE_DN");
    if (dropBox === null) return;
    
    var items = dropBox.getItems();
    var domainName = items[selection];
    this.selectedBaseDN = this.getDomainContent(domainName);
  }
  
  this.SELECT_ALLS_pressed = function () {
    this.markAllItemsSelected(
      this.getPageElement(0, "S_TABLE"),
      true
    );
  }
  
  this.SELECT_NONES_pressed = function () {
    this.markAllItemsSelected(
      this.getPageElement(0, "S_TABLE"),
      false
    );
  }
  
  this.SELECT_ALLT_pressed = function () {
    this.markAllItemsSelected(
      this.getPageElement(0, "T_TABLE"),
      true
    );
  }
  
  this.SELECT_NONET_pressed = function () {
    this.markAllItemsSelected(
      this.getPageElement(0, "T_TABLE"),
      false
    );
  }
  
  this.ADD_pressed = function () {
    
    if (!this.isSourceSelectionValid()) return;
    
    this.changeContainOfTable(
      this.getPageElement(0, "S_TABLE"),
      this.getPageElement(0, "T_TABLE")
    );
  }
  
  this.REMOVE_pressed = function () {
    
    
    this.changeContainOfTable(
      this.getPageElement(0, "T_TABLE"),
      this.getPageElement(0, "S_TABLE")
    );
    
  }
  
  
}


EMA_SearchDialog.prototype.getPageElement = function (pageNumber, elementIdentifier) {
  var page = this.dialog.getPage(pageNumber);
  if (page === null) return null;
  
  return page.getDialogElement(elementIdentifier);
}

EMA_SearchDialog.prototype.setDomainsDropBoxByCorporateKey = function (dropBoxElement) {
  
  if (dropBoxElement === null) return;
  if (this.ldapSearchComponent.getDNSMappers().size() === 0) return;
  
  var displayName = this.getDisplayName();
  if (displayName == null || displayName.length === 0) return;
  
  var dropBoxContent = dropBoxElement.getItems();
  
  dropBoxContent.forEach(function (domainName, index) {
    if (domainName.localeCompare(displayName) === 0) dropBoxElement.setSelection(index);
  })
}

EMA_SearchDialog.prototype.getDisplayName = function () {
  
  if (this.ldapSearchComponent.getDNSMappers().size() === 0) return "";
  var set = this.ldapSearchComponent.getDNSMappers().entrySet();
  var iterator = set.iterator();
  while (iterator.hasNext()) {
    var entry = iterator.next();
    var value = entry.getValue();
    if (value.corpList.contains(this.corporateKey)) return value.displayName;
  }
  
}

EMA_SearchDialog.prototype.markAllItemsSelected = function (table, state) {
  if (table === null) return;
  
  var items = table.getItems();
  items.forEach(function (item) {
    item[0] = state;
  });
  table.setItems(items);
  
}

EMA_SearchDialog.prototype.changeContainOfTable = function (sourceTable, targetTable) {
  if (sourceTable === null || targetTable === null) return;
  
  var result = targetTable.getItems();
  
  var sources = sourceTable.getItems();
  var targets = targetTable.getItems();
  
  var remains = sources.filter(EMA_Helper.isNotChecked);
  var selected = sources.filter(EMA_Helper.isChecked)
  
  var subResult = selected.filter(function (source) {
    var sourceName = source[1].toLowerCase();
    var sameTargets = targets.filter(function (target) {
      var targetName = target[1].toLowerCase();
      return targetName.localeCompare(sourceName) === 0;
    });
    
    return sameTargets.length === 0;
    
    
  });
  
  result.push.apply(result, subResult);
  targetTable.setItems(result);
  sourceTable.setItems(remains);
  this.markAllItemsSelected(targetTable, false);
}

EMA_SearchDialog.prototype.getDomainContent = function (domainName) {
  
  if (this.ldapSearchComponent.getDNSMappers().size() === 0) return "";
  
  var iterator = this.ldapSearchComponent.getDNSMappers().entrySet().iterator();
  while (iterator.hasNext()) {
    var entry = iterator.next();
    var value = entry.getValue();
    if (value.displayName.localeCompare(domainName) === 0) return value.dc;
  }
  return "";
}

EMA_SearchDialog.prototype.getLdapUrl = function (domainName) {
  
  if (this.ldapSearchComponent.getDNSMappers().size() === 0) return "";
  
  var iterator = this.ldapSearchComponent.getDNSMappers().entrySet().iterator();
  while (iterator.hasNext()) {
    var entry = iterator.next();
    var value = entry.getValue();
    if (value.displayName.localeCompare(domainName) === 0) return value.url;
  }
  return "";
}

EMA_SearchDialog.prototype.getReferralType = function(domainName) {
  
  if (this.ldapSearchComponent.getDNSMappers().size() === 0) return "";
  
  var iterator = this.ldapSearchComponent.getDNSMappers().entrySet().iterator();
  while (iterator.hasNext()) {
    var entry = iterator.next();
    var value = entry.getValue();
    if (value.displayName.localeCompare(domainName) === 0) return value.referral;
  }
  return "";
}

EMA_SearchDialog.prototype.isSourceSelectionValid = function () {
  
  var sourceTable = this.getPageElement(0, "S_TABLE");
  var targetTable = this.getPageElement(0, "T_TABLE");
  if (sourceTable === null || targetTable === null) return false;
  
  var targetLength = targetTable.getItems().length;
  
  var selectedItems = sourceTable.getItems().filter(EMA_Helper.isChecked)
  
  if (selectedItems.length > (this.maximalUserCount - targetLength)) {
    
    if (this.maximalUserCount === 1) this.showWarningDialogBox("Too many selected users. Please selected only " + this.maximalUserCount + " user");
    else this.showWarningDialogBox("Too many selected users. Please selected only " + (this.maximalUserCount - targetLength) + " users");
    return false;
  }
  
  return true;
}

EMA_SearchDialog.prototype.showWarningDialogBox = function (message) {
  this.dialog.setMsgBox("WARNING", message, Constants.MSGBOX_BTN_OK | Constants.MSGBOX_ICON_WARNING, "Maximum users warning");
}

EMA_SearchDialog.prototype.searchUserByMultiInput = function (textBox) {
  
  var searchQuery = "(&(sAMAccountType=805306368)";
  var text = textBox.getText();
  if (text.indexOf(";") === -1) {
    
    searchQuery += ("(|(mail=" + text + ")");
    searchQuery += ("(displayName=" + text + ")");
    searchQuery += ("(sAMAccountName=" + text + ")");
    
    searchQuery += "))";
    var users = this.ldapSearchComponent.searchLDAPUsers(searchQuery, this.getSelectedLdapUrl(), this.getSelectedBaseDomainName(),this.getSelectedReferralType(),360);
    this.fillSourceTable(users)
    return;
  }
  
  
  var emails = text.match(this.emailRegex);
  var displayNames = text.match(this.displayNameRegex);
  
  
  if (emails !== null || displayNames !== null) {
    this.searchBy(emails, displayNames, null);
  } else {
    var loginNames = text.split(";");
    this.searchBy(null, null, loginNames);
  }
}

EMA_SearchDialog.prototype.fillSourceTable = function (foundUsers) {
  
  var sourceTable = this.getPageElement(0, "S_TABLE");
  if (foundUsers === null || foundUsers.length === 0 || foundUsers.length > 1000) {
    sourceTable.setItems([]);
    if (foundUsers.length > 1000) {
      return this.showWarningDialogBox("Searching query returns lots of items. Please change it to narrower query")
    }
    return this.showWarningDialogBox("Cannot find users. Please check searching query and setting.")
  }
  
  sourceTable.setItems(foundUsers);
}

EMA_SearchDialog.prototype.getSelectedBaseDomainName = function () {
  
  if (this.selectedBaseDN == null) {
    var dropBox = this.getPageElement(0, "SELECT_BASE_DN");
    var items = dropBox.getItems();
    var selection = dropBox.getSelectedIndex();
    this.selectedBaseDN = this.getDomainContent(items[selection]);
  }
  
  return this.selectedBaseDN;
}

EMA_SearchDialog.prototype.getSelectedLdapUrl = function () {
  
  var dropBox = this.getPageElement(0, "SELECT_BASE_DN");
  var items = dropBox.getItems();
  var selection = dropBox.getSelectedIndex();
  return this.getLdapUrl(items[selection]);
}

EMA_SearchDialog.prototype.getSelectedReferralType = function() {
  
  var dropBox = this.getPageElement(0, "SELECT_BASE_DN");
  var items = dropBox.getItems();
  var selection = dropBox.getSelectedIndex();
  return this.getReferralType(items[selection]);
}

EMA_SearchDialog.prototype.searchBy = function (emails, displayNames, loginNames) {

  var searchQuery = "(&(sAMAccountType=805306368)(|";
  
  if (emails !== null && emails.length > 0) {
    emails.forEach(function (user) {
      searchQuery += "(mail=" + user + "*)"
    });
  }
  if (displayNames !== null && displayNames.length > 0) {
    
    displayNames.forEach(function (user) {
      searchQuery += "(displayName=" + user + "*)"
    });
  }
  
  if (loginNames !== null && loginNames.length > 0) {
    
    loginNames.forEach(function (loginName) {
      searchQuery += "(sAMAccountName=" + loginName + "*)";
    })
  }
  
  if (emails !== null || displayNames !== null || loginNames !== null) searchQuery += ")";
  
  searchQuery += ")";
  var those = this;
  var searchParameters = EMA_Helper.buildAllDomainsList(this.ldapSearchComponent.getDNSMappers().values().toArray(), this.excludeDomain);
  var users = searchParameters.reduce(function (users, searchParameter) {
   
    writeLog(sm72tc,"searchParameter " + searchParameter.toString(),"info" );
    writeLog(sm72tc,"users " + users.toString(),"info" );
  
    var found = those.ldapSearchComponent.searchLDAPUsers(searchQuery, searchParameter[1], searchParameter[0],searchParameter[2],30);
    return users.concat(found);
  }, [])
  this.fillSourceTable(users);
}
