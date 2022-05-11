function runEMAUserGroupSearchDialog(assignedUsers, maximalUserCount, sourceUserGroups) {
  var dialogFunction = new EMA_UserGroupSearchDialog(assignedUsers, maximalUserCount, sourceUserGroups);
  return Dialogs.showDialog(dialogFunction, Constants.DIALOG_TYPE_ACTION, "Search users");
  
}

function EMA_UserGroupSearchDialog(assignedUsers, maxUserCount, sourceUserGroups) {
  
  this.UMC = Context.getComponent("UMC");
  this.users = [];
  this.assignedUsers = assignedUsers;
  this.maximalUserCount = maxUserCount;
  this.sourceUserGroups = sourceUserGroups;
  this.dialogResult = {
    isOk: false,
    selectedUsers: []
  };
  this.ldapSearchComponent = new EMA_LDAPSearchComponent();
  this.noChanges = true;
  
  
  this.getPages = function () {
    
    return [this.createPage()];
  }
  
  this.init = function () {
    var sourceTable = this.getPageElement(0, "S_TABLE");
    var targetTable = this.getPageElement(0, "T_TABLE");
    
    var those = this;
    this.users = this.sourceUserGroups.map(function (userGroup) {
        var umcUserGroup = those.UMC.getUsergroupById(userGroup.GUID());
        if (umcUserGroup === null) return [];
        return UMC.getAssignedUsersForUsergroup(umcUserGroup).toArray()
      })
      .filter(function (users) {
        return users.length > 0;
      })
      .reduce(function (array, item) {
        return array.concat(item);
      }, [])
      .map(function (user) {
        var dn = user.getLDAPDN();

        var dc = dn.length() > 0 ? dn.substring(dn.indexOf("DC=")) : "DC=vwg";
        var name = user.getName().toUpperCase();
        var email = user.getEmail();
        var firstName = user.getFirstName();
        var lastName = user.getLastName();
        var department = user.getAttributes().get("department");
        var displayName = lastName + ", " + firstName + " (" + department + ")";
        return [false, name, displayName, email, dc];
      });
    
    if (this.users.length < 50) {
      var items = this.users
        .filter(function (user) {
          return !assignedUsers.some(function (u) {
            return u[1].indexOf(user[1]) !== -1;
          })
        })
        .map(function (user){
        var displayName = those.getDisplayName(user[1], user[4]);
        return [user[0], user[1], displayName, user[3], user[4]];
      });
      sourceTable.setItems(items);
    }
    
    if (targetTable !== null) {
      targetTable.setItems(this.assignedUsers);
    }
    
  }
  
  this.isInValidState = function (pageNumber) {
    
    var targetTable = this.getPageElement(pageNumber, "T_TABLE");
    var sourceTable = this.getPageElement(pageNumber, "S_TABLE");
    var searchButton = this.getPageElement(pageNumber, "SEARCH_BUTTON");
    var addButton = this.getPageElement(pageNumber, "ADD");
    var removeButton = this.getPageElement(pageNumber, "REMOVE");
    var multiInputTextBox = this.getPageElement(pageNumber, "MULTI_USER_SEARCH");
    
    if (targetTable === null || addButton === null || searchButton === null || removeButton === null || sourceTable === null) return true;
    
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
    
    
    if (length === this.assignedUsers.length) {
      var targets = targetTable.getItems();
      targets.sort(EMA_Helper.accountNameSort)
      this.noChanges =
        this.assignedUsers
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
    
    var searchTextBox = this.getPageElement(0, "MULTI_USER_SEARCH");
    var targetTable = this.getPageElement(0, "T_TABLE");
    var sourceTable = this.getPageElement(0, "S_TABLE");
    if (searchTextBox === null) return false;
    if (targetTable === null) return false;
    
    var searchText = searchTextBox.getText().toLowerCase()
    var searchParts = searchText.match(/\S+\s*/g);
    searchParts = searchParts.map(function (part) {
      return part.trim();
    });
    var regexExpression = "^.*(" + searchParts.join("|") + ").*$"
    var foundUsers = this.users
      .filter(function (user) {
        return !assignedUsers.some(function (u) {
          return u[1].indexOf(user[1]) !== -1;
        })
      })
      .filter(function (user, index) {
        
        var userId = user[1].toLowerCase();
        var userEmail = user[3].toLowerCase();
        var userDisplayName = user[2].toLowerCase();
        
        return userId.match(regexExpression) ||
          userEmail.match(regexExpression) ||
          userDisplayName.match(regexExpression)
      });
    
    
    if (foundUsers.length === 0) this.showWarningDialogBox("Cannot find users. Please check searching query and setting.")
    var those = this;
    var correctedUsers = foundUsers.map(function (user) {
      var displayName = those.getDisplayName(user[1], user[4]);
      return [user[0], user[1], displayName, user[3], user[4]];
    })
    sourceTable.setItems(correctedUsers);
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

EMA_UserGroupSearchDialog.tableColumnsStyle = [
  Constants.TABLECOLUMN_BOOL_EDIT,
  Constants.TABLECOLUMN_SINGLELINE,
  Constants.TABLECOLUMN_SINGLELINE,
  Constants.TABLECOLUMN_SINGLELINE,
  Constants.TABLECOLUMN_SINGLELINE
];

EMA_UserGroupSearchDialog.tableColumnsHeader = [
  getString("DLG_CHECK"),
  getString("DLG_LOGIN"),
  getString("DLG_NAME"),
  getString("DLG_SPEZ_EM"),
  "dc"
];

EMA_UserGroupSearchDialog.tableColumnsWidth = [
  12,
  27,
  30,
  30,
  1
]


EMA_UserGroupSearchDialog.prototype.getPageElement = function (pageNumber, elementIdentifier) {
  var page = this.dialog.getPage(pageNumber);
  if (page === null) return null;
  
  return page.getDialogElement(elementIdentifier);
}

EMA_UserGroupSearchDialog.prototype.createPage = function () {
  
  var template = Dialogs.createNewDialogTemplate(0, 0, 960, 480, "Search users");
  
  
  template.Text(20, 18, 720, 20, getString("DLG_USR_MULTI"), "MULTI_SEARCH_LABEL");
  template.TextBox(20, 30, 720, 20, "MULTI_USER_SEARCH");
  template.PushButton(780, 29, 130, 20, getString("DLG_USER_SEARCH_BTN"), "SEARCH_BUTTON");
  
  template.Table(20, 110, 540, 260,
                 EMA_UserGroupSearchDialog.tableColumnsHeader,
                 EMA_UserGroupSearchDialog.tableColumnsStyle,
                 EMA_UserGroupSearchDialog.tableColumnsWidth,
                 "S_TABLE",
                 Constants.TABLE_STYLE_SORTED
  );
  template.PushButton(20, 380, 130, 20, getString("DLG_USR_SEL_ALL"), "SELECT_ALLS");
  template.PushButton(170, 380, 130, 20, getString("DLG_USR_SEL_NONE"), "SELECT_NONES");
  
  template.PushButton(605, 105, 130, 20, getString("DLG_USR_ADD"), "ADD");
  template.PushButton(605, 130, 130, 20, getString("DLG_USR_REMOVE"), "REMOVE");
  
  
  template.Table(770, 110, 540, 260,
                 EMA_UserGroupSearchDialog.tableColumnsHeader,
                 EMA_UserGroupSearchDialog.tableColumnsStyle,
                 EMA_UserGroupSearchDialog.tableColumnsWidth,
                 "T_TABLE",
                 Constants.TABLE_STYLE_SORTED
  );
  template.PushButton(770, 380, 130, 20, getString("DLG_USR_SEL_ALL"), "SELECT_ALLT");
  template.PushButton(910, 380, 130, 20, getString("DLG_USR_SEL_NONE"), "SELECT_NONET");
  
  
  template.Text(20, 5, 960, 10,
                "<b style='color: red;'>" + getString("DLG_USR_MAX_1") + this.maximalUserCount + getString("DLG_USR_MAX_2") + ".</b>",
                "MAX_USERS_LABEL"
  );
  template.Text(20, 320, 450, 40, getString("DLG_USR_4"), "SEARCHING_PATTERN_LABEL");
  
  return template;
}

EMA_UserGroupSearchDialog.prototype.markAllItemsSelected = function (table, state) {
  if (table === null) return;
  
  var items = table.getItems();
  items.forEach(function (item) {
    item[0] = state;
  });
  table.setItems(items);
  
}

EMA_UserGroupSearchDialog.prototype.changeContainOfTable = function (sourceTable, targetTable) {
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

EMA_UserGroupSearchDialog.prototype.isSourceSelectionValid = function () {
  
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

EMA_UserGroupSearchDialog.prototype.showWarningDialogBox = function (message) {
  this.dialog.setMsgBox("WARNING", message, Constants.MSGBOX_BTN_OK | Constants.MSGBOX_ICON_WARNING, "Maximum users warning");
}

EMA_UserGroupSearchDialog.prototype.getDisplayName = function (userId, ldapDC) {
  
  var searchQuery = "(&(sAMAccountType=805306368)";
  searchQuery += ("(sAMAccountName=" + userId + ")");
  searchQuery += ")";
  
  var users = this.ldapSearchComponent.searchLDAPUsers(searchQuery, this.getLdapUrl(ldapDC), ldapDC, "follow", 10);
  
  if (users.length > 0) {
    writeLog(sm72tc, "Found users list " + users[0][2], "info");
    
    return users[0][2];
  }
  return "";
}

EMA_UserGroupSearchDialog.prototype.getLdapUrl = function (ldapDC) {
  if (this.ldapSearchComponent.getDNSMappers().size() === 0) return "";
  
  var iterator = this.ldapSearchComponent.getDNSMappers().entrySet().iterator();
  while (iterator.hasNext()) {
    var entry = iterator.next();
    var value = entry.getValue();
    if (value.dc.toLowerCase().localeCompare(ldapDC.toLowerCase()) === 0) return value.url;
  }
  return "";
}
