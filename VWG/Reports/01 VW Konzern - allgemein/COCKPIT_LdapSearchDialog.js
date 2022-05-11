function LdapSearchDialog(processName, users, processOwnerObject,maximalUserCount, corporateKey,isEdit) {


    //(((<)([a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4})(>));)/gi -- regex for parsing emails from text
    //(([a-z]+,\s[a-z]+\s+\([a-z0-9-/]+\)))/gi - regex for names

    this.processName = processName;
    this.users = users;
    this.maximalUserCount = maximalUserCount;
    this.corporateKey = corporateKey;
    this.selectedBaseDN = null;
    this.dnsMappers = new Packages.java.util.TreeMap();
    this.baseDomains = [];
    this.isEdit = isEdit;
    this.processOwnerObject = processOwnerObject;

    this.noChanges = true;


    this.dialogResult = {
        isOk: false,
        selectedUsers: [],
        roleName: null,
        isEdit: false,
        processOwnerObject: null
    };


    this.displayNameRegex = /([a-z]*,)(\s[a-z]*)(\s[0-9]*)*/gi;
    this.emailRegex = /[a-z0-9._-]+@[a-z0-9.-]+\.[a-z]{2,4}/gi
    this.excludeDomain = "DC=vwg";


    this.getPages = function () {

        var page = Dialogs.createNewDialogTemplate(0, 0, 960, 280, "Search LDAP users");

        page.Text(20, 18, 720, 20, BaseDialog.getStringFromStringTable("ROLE_NAME_LABEL", Context.getSelectedLanguage()), "ROLE_NAME_LABEL");
        page.TextBox(20, 30, 720, 20, "ROLE_NAME_TEXT_BOX");

        page.Text(20, 50, 720, 20, BaseDialog.getStringFromStringTable("MULTI_SEARCH_LABEL", Context.getSelectedLanguage()), "MULTI_SEARCH_LABEL");
        page.TextBox(20, 60, 720, 20, "MULTI_USER_SEARCH");
        page.PushButton(780, 62, 130, 20, BaseDialog.getStringFromStringTable("SEARCH_BUTTON_TEXT", Context.getSelectedLanguage()), "SEARCH_BUTTON");
        page.DropListBox(20, 85, 350, 20, this.baseDomains, "SELECT_BASE_DN", 0);


        page.Table(20, 110, 540, 120, LdapSearchDialog.tableColumnsHeader, LdapSearchDialog.tableColumnsStyle, [12, 20, 40, 40, 0], "S_TABLE", Constants.TABLE_STYLE_SORTED);
        page.PushButton(20, 233, 130, 20, BaseDialog.getStringFromStringTable("SHSD_SELECT_ALL_SOURCE", Context.getSelectedLanguage()), "SELECT_ALLS");
        page.PushButton(170, 233, 130, 20, BaseDialog.getStringFromStringTable("SHSD_SELECT_NONE_SOURCE", Context.getSelectedLanguage()), "SELECT_NONES");

        page.PushButton(605, 105, 130, 20, BaseDialog.getStringFromStringTable("SHSD_ADD_BUTTON_TEXT", Context.getSelectedLanguage()), "ADD");
        page.PushButton(605, 130, 130, 20, BaseDialog.getStringFromStringTable("SHSD_REMOVE_BUTTON_TEXT", Context.getSelectedLanguage()), "REMOVE");
        page.Table(770, 110, 540, 120, LdapSearchDialog.tableColumnsHeader, LdapSearchDialog.tableColumnsStyle, [12, 20, 40, 40, 0], "T_TABLE", Constants.TABLE_STYLE_SORTED);
        page.PushButton(770, 233, 130, 20, BaseDialog.getStringFromStringTable("SHSD_SELECT_ALL_SOURCE", Context.getSelectedLanguage()), "SELECT_ALLT");
        page.PushButton(910, 233, 130, 20, BaseDialog.getStringFromStringTable("SHSD_SELECT_NONE_SOURCE", Context.getSelectedLanguage()), "SELECT_NONET");

        page.Text(20, 5, 960, 10, "<b style='color: red;'>" + BaseDialog.getStringFromStringTable("LDAP_MAXIMAL_USER_COUNT", Context.getSelectedLanguage()) + this.maximalUserCount + BaseDialog.getStringFromStringTable("LDAP_MAXIMAL_USER_COUNT_2", Context.getSelectedLanguage()) + "</b>", "MAX_USERS_LABEL");
        page.Text(20, 260, 450, 40, BaseDialog.getStringFromStringTable("SEARCHING_PATTERN_LABEL", Context.getSelectedLanguage()), "SEARCHING_PATTERN_LABEL");

        return [page];
    }

    this.init = function () {

        this.initializeVariables();
        var sourceTable = this.getPageElement(0, "S_TABLE");
        var targetTable = this.getPageElement(0, "T_TABLE");
        var searchButton = this.getPageElement(0, "SURNAME");
        var roleNameTextBox = this.getPageElement(0, "ROLE_NAME_TEXT_BOX");
        var domainsDropBox = this.getPageElement(0, "SELECT_BASE_DN");

        if (sourceTable !== null) sourceTable.setEnabled(true);
        if (targetTable !== null && this.users !== null) {
            targetTable.setEnabled(true);
            targetTable.setItems(this.users);
        }

        if (searchButton !== null) searchButton.setEnabled(true);
        if (domainsDropBox !== null) {
            domainsDropBox.setEnabled(true);
            domainsDropBox.setItems(this.baseDomains);
        }

        this.setDomainsDropBoxByCorporateKey(domainsDropBox);

        if (BaseDialog.isNullOrEmpty(roleNameTextBox)) return false;

        if (this.processName !== null) roleNameTextBox.setText(this.processName);


    }

    this.isInValidState = function (pageNumber) {

        var targetTable = this.getPageElement(pageNumber, "T_TABLE");
        var sourceTable = this.getPageElement(pageNumber, "S_TABLE");
        var searchButton = this.getPageElement(pageNumber, "SEARCH_BUTTON");
        var addButton = this.getPageElement(pageNumber, "ADD");
        var removeButton = this.getPageElement(pageNumber, "REMOVE");
        var multiInputTextBox = this.getPageElement(pageNumber, "MULTI_USER_SEARCH");
        var dropBox = this.getPageElement(pageNumber, "SELECT_BASE_DN");
        var roleNameTextBox = this.getPageElement(pageNumber, "ROLE_NAME_TEXT_BOX");

        if (BaseDialog.isNullOrEmpty(targetTable) ||
            BaseDialog.isNullOrEmpty(addButton) ||
            BaseDialog.isNullOrEmpty(searchButton) ||
            BaseDialog.isNullOrEmpty(removeButton) ||
            BaseDialog.isNullOrEmpty(sourceTable) ||
            BaseDialog.isNullOrEmpty(dropBox) ||
            BaseDialog.isNullOrEmpty(roleNameTextBox)) return true;

        var length = targetTable.getItems().length;

        if (length === this.maximalUserCount) addButton.setEnabled(false);
        else addButton.setEnabled(true);

        var isSourceSelected = sourceTable.getItems().some(BaseDialog.isChecked);

        var isTargetSelected = targetTable.getItems().some(BaseDialog.isChecked);


        if (isSourceSelected) addButton.setEnabled(true);
        else addButton.setEnabled(false);
        if (isTargetSelected) removeButton.setEnabled(true);
        else removeButton.setEnabled(false);

        if (multiInputTextBox.getText().length() < 3) searchButton.setEnabled(false);
        else searchButton.setEnabled(true);

        if (multiInputTextBox.getText().indexOf(";") === -1) dropBox.setEnabled(true);
        else dropBox.setEnabled(false);

        if (this.users !== null && length === this.users.length) {
            var targets = targetTable.getItems();
            targets.sort(BaseDialog.accountNameSort)
            this.noChanges =
                this.users
                .sort(BaseDialog.accountNameSort)
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



        return !this.noChanges && roleNameTextBox.getText().length() > 5 || roleNameTextBox.getText().localeCompare(this.processName) !== 0;

    }

    this.getResult = function () {
        return this.dialogResult;
    }

    this.onClose = function (pageNumber, bOk) {

        var targetTable = this.getPageElement(0, "T_TABLE");
        var roleNameTextBox = this.getPageElement(0, "ROLE_NAME_TEXT_BOX");

        this.dialogResult.isOk = bOk;
        this.dialogResult.selectedUsers.push.apply(this.dialogResult.selectedUsers, targetTable.getItems());
        this.dialogResult.roleName = roleNameTextBox.getText();
        this.dialogResult.isEdit = this.isEdit;
        this.dialogResult.processOwnerObject = this.processOwnerObject;
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

LdapSearchDialog.tableColumnsStyle = [
    Constants.TABLECOLUMN_BOOL_EDIT,
    Constants.TABLECOLUMN_SINGLELINE,
    Constants.TABLECOLUMN_SINGLELINE,
    Constants.TABLECOLUMN_SINGLELINE,
    Constants.TABLECOLUMN_SINGLELINE
];

LdapSearchDialog.tableColumnsHeader = [
    BaseDialog.getStringFromStringTable("MRP_TABLE_CHECK_COLUMN_TEXT", Context.getSelectedLanguage()),
    BaseDialog.getStringFromStringTable("MRP_TABLE_USER_ID_COLUMN_TEXT", Context.getSelectedLanguage()),
    BaseDialog.getStringFromStringTable("MRP_TABLE_NAME_COLUMN_TEXT", Context.getSelectedLanguage()),
    BaseDialog.getStringFromStringTable("MRP_TABLE_EMAIL_COLUMN_TEXT", Context.getSelectedLanguage()),
    "dc"
];


LdapSearchDialog.prototype.initializeVariables = function () {

    var file = file = Context.getFile("ModellObjektDialog.xml", Constants.LOCATION_COMMON_FILES);
    if (file === null || file.length === 0) return;
    var root = Context.getXMLParser(file).getRootElement();
    var domains = root.getChild("General").getChild("ActiveDomains").getChildren();

    for (var i = 0; i < domains.size(); i++) {
        var domain = domains.get(i);
        var ad = domain.getChild("AD").getText();
        var title = domain.getChild("ADTitle").getText();
        var corpList = domain.getChild("CorpList").getText();
        var ldapUrl = domain.getChild("LDAPUrl").getText();

        this.dnsMappers.put(title, {displayName: title, dc: ad, corpList: corpList, url: ldapUrl});
    }


    var keySet = this.dnsMappers.keySet();
    var iterator = keySet.iterator();
    while (iterator.hasNext()) {
        var key = iterator.next();
        var value = this.dnsMappers.get(key);
        this.baseDomains.push(value.displayName);
    }
}

LdapSearchDialog.prototype.getPageElement = function (pageNumber, elementIdentifier) {
    var page = this.dialog.getPage(pageNumber);
    if (page === null) return null;

    return page.getDialogElement(elementIdentifier);
}

LdapSearchDialog.prototype.setDomainsDropBoxByCorporateKey = function (dropBoxElement) {

    if (dropBoxElement === null) return;
    if (this.dnsMappers.size() === 0) return;

    var displayName = this.getDisplayName();
    if (displayName == null || displayName.length === 0) return;

    var dropBoxContent = dropBoxElement.getItems();

    dropBoxContent.forEach(function (domainName, index) {
        if (domainName.localeCompare(displayName) === 0) dropBoxElement.setSelection(index);
    })
}

LdapSearchDialog.prototype.getDisplayName = function () {

    if (this.dnsMappers.size() === 0) return "";
    var set = this.dnsMappers.entrySet();
    var iterator = set.iterator();
    while (iterator.hasNext()) {
        var entry = iterator.next();
        var value = entry.getValue();
        if (value.corpList.contains(this.corporateKey)) return value.displayName;
    }

}

LdapSearchDialog.prototype.markAllItemsSelected = function (table, state) {
    if (table === null) return;

    var items = table.getItems();
    items.forEach(function (item) {
        item[0] = state;
    });
    table.setItems(items);

}

LdapSearchDialog.prototype.changeContainOfTable = function (sourceTable, targetTable) {
    if (sourceTable === null || targetTable === null) return;

    var result = targetTable.getItems();

    var sources = sourceTable.getItems();
    var targets = targetTable.getItems();

    var remains = sources.filter(BaseDialog.isNotChecked);
    var selected = sources.filter(BaseDialog.isChecked);

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

LdapSearchDialog.prototype.getDomainContent = function (domainName) {

    if (this.dnsMappers.size() === 0) return "";

    var iterator = this.dnsMappers.entrySet().iterator();
    while (iterator.hasNext()) {
        var entry = iterator.next();
        var value = entry.getValue();
        if (value.displayName.localeCompare(domainName) === 0) return value.dc;
    }
    return "";
}

LdapSearchDialog.prototype.getLdapUrl = function (domainName) {

    if (this.dnsMappers.size() === 0) return "";

    var iterator = this.dnsMappers.entrySet().iterator();
    while (iterator.hasNext()) {
        var entry = iterator.next();
        var value = entry.getValue();
        if (value.displayName.localeCompare(domainName) === 0) return value.url;
    }
    return "";
}

LdapSearchDialog.prototype.isSourceSelectionValid = function () {

    var sourceTable = this.getPageElement(0, "S_TABLE");
    var targetTable = this.getPageElement(0, "T_TABLE");
    if (sourceTable === null || targetTable === null) return false;

    var targetLength = targetTable.getItems().length;

    var selectedItems = sourceTable.getItems().filter(BaseDialog.isChecked)

    if (selectedItems.length > (this.maximalUserCount - targetLength)) {

        if (this.maximalUserCount === 1) this.showWarningDialogBox("Too many selected users. Please selected only " + this.maximalUserCount + " user");
        else this.showWarningDialogBox("Too many selected users. Please selected only " + (this.maximalUserCount - targetLength) + " users");
        return false;
    }

    return true;
}

LdapSearchDialog.prototype.showWarningDialogBox = function (message) {
    this.dialog.setMsgBox("WARNING", message, Constants.MSGBOX_BTN_OK | Constants.MSGBOX_ICON_WARNING, "Maximum users warning");
}

LdapSearchDialog.prototype.searchUserByMultiInput = function (textBox) {

    var searchQuery = "(&(sAMAccountType=805306368)";
    var text = textBox.getText().trim();
    if (text.indexOf(";") === -1) {

        searchQuery += ("(|(mail=" + text + ")");
        searchQuery += ("(displayName=" + text + ")");
        searchQuery += ("(sAMAccountName=" + text + ")");
        searchQuery += "))";
        var users = this.searchLDAPUsers(searchQuery, this.getSelectedLdapUrl(), this.getSelectedBaseDomainName());
        this.fillSourceTable(users)
        return;
    }


    try {
        var emails = text.match(this.emailRegex);
        var displayNames = text.match(this.displayNameRegex);
        writeLog(sm72tc, "Action LDAP Searching was running", "info");
        writeLog(sm72tc, emails.length, "info");
        writeLog(sm72tc, displayNames.length, "info");



        if (emails !== null || displayNames !== null) this.searchBy(emails, displayNames, null);
        else {
            var loginNames = text.split(";");
            this.searchBy(null, null, loginNames);
        }
    } catch (ex) {
        writeLog(sm72tc, "Action LDAP Searching was running", "info");
        writeLog(sm72tc, "Exception: " + ex + " line number " + ex.lineNumber, "error");

        if (typeof  ex.javaException !== "undefined") {
            if (ex.javaException.getMessage() !== null) writeLog(sm72tc, ex.javaException.getMessage(), "error");
            writeLog(sm72tc, Packages.org.apache.commons.lang.exception.ExceptionUtils.getStackTrace(ex.javaException), "error");
            return [];
        }
    }
}

LdapSearchDialog.prototype.fillSourceTable = function (foundUsers) {

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

LdapSearchDialog.prototype.searchLDAPUsers = function (searchQuery, ldapServer, baseDN) {

    var env = new Packages.java.util.Hashtable(11);
    var timeout = 30;
    var foundUsers = new Packages.java.util.TreeMap();
    env.put(javax.naming.Context.INITIAL_CONTEXT_FACTORY, "com.sun.jndi.ldap.LdapCtxFactory");

    env.put(javax.naming.Context.SECURITY_AUTHENTICATION, "simple");
    env.put(javax.naming.Context.SECURITY_PRINCIPAL, "SAHDUPJ@skoda.vwg");
    env.put(javax.naming.Context.SECURITY_CREDENTIALS, "U6M2ToS.2015");

    if (baseDN.equals(this.excludeDomain) === true) {
        env.put(javax.naming.Context.PROVIDER_URL, "ldap://VWGWOD00011.vwg:389");
        env.put(javax.naming.Context.REFERRAL, "follow");
        timeout = 360;
    } else if (baseDN.equals("DC=na,DC=vwg") === true) {
        env.put(javax.naming.Context.PROVIDER_URL, "ldap://" + ldapServer);
        env.put(javax.naming.Context.REFERRAL, "follow");
        timeout = 360;
    } else if (baseDN.equals("DC=emea,DC=vwg") === true) {
        env.put(javax.naming.Context.PROVIDER_URL, "ldap://" + ldapServer);
        env.put(javax.naming.Context.REFERRAL, "follow");
        timeout = 360;
    } else if (baseDN.equals("DC=sa,DC=vwg") === true) {
        env.put(javax.naming.Context.PROVIDER_URL, "ldap://" + ldapServer);
        env.put(javax.naming.Context.REFERRAL, "follow");
        timeout = 360;
    } else if (baseDN.equals("DC=bentley,DC=emea,DC=vwg") === true) {
        env.put(javax.naming.Context.PROVIDER_URL, "ldap://" + ldapServer);
        env.put(javax.naming.Context.REFERRAL, "follow");
        timeout = 360;
    } else {
        env.put(javax.naming.Context.REFERRAL, "ignore");
        env.put(javax.naming.Context.PROVIDER_URL, "ldap://" + ldapServer);
    }
    // Create initial context
    try {

        var dirContext = new Packages.javax.naming.directory.InitialDirContext(env);
        var controls = new Packages.javax.naming.directory.SearchControls();

        controls.setCountLimit(1000);
        controls.setDerefLinkFlag(false);
        controls.setReturningAttributes(["cn", "mail", "displayName", "sAMAccountName", "distinguishedName"]);
        controls.setReturningObjFlag(false);
        controls.setSearchScope(Packages.javax.naming.directory.SearchControls.SUBTREE_SCOPE);
        controls.setTimeLimit(timeout * 1000);


        var searchResults = dirContext.search(baseDN, searchQuery, controls);
        if (searchResults != null) {
            while (searchResults.hasMore()) {
                var result = searchResults.next();
                var attributes = result.getAttributes();
                var hashTable = new Packages.java.util.Hashtable();

                BaseDialog.insertIntoListAttributes(hashTable, attributes, "cn");
                BaseDialog.insertIntoListAttributes(hashTable, attributes, "mail");
                BaseDialog.insertIntoListAttributes(hashTable, attributes, "displayName");
                BaseDialog.insertIntoListAttributes(hashTable, attributes, "distinguishedName");
                BaseDialog.insertIntoListAttributes(hashTable, attributes, "sAMAccountName");

                var accountName = attributes.get("sAMAccountName");
                if (accountName !== null) foundUsers.put(accountName.get(), hashTable);

            }
            searchResults.close();
        }
        dirContext.close();
        return this.transformUsersToArray(foundUsers);
    } catch (ex) {
        writeLog(sm72tc, "Action LDAP Searching was running", "info");
        writeLog(sm72tc, "Exception: " + ex + " line number " + ex.lineNumber, "error");
        if (typeof ex.javaException !== undefined) {
            if (ex.javaException.getMessage() !== null) writeLog(sm72tc, ex.javaException.getMessage(), "error");

            writeLog(sm72tc, Packages.org.apache.commons.lang.exception.ExceptionUtils.getStackTrace(ex.javaException), "error");
        }
        return [];
    }
}

LdapSearchDialog.prototype.transformUsersToArray = function (users) {

    var output = [];
    var iterator = users.entrySet().iterator();

    while (iterator.hasNext()) {
        var entry = iterator.next();
        var row = this.createTableRow(entry.getKey(), entry.getValue());
        if (row.length > 0) output.push(row);
    }
    return output;
}

LdapSearchDialog.prototype.createTableRow = function (key, item) {
    var row = [];
    var displayName = item.get("displayName");
    var email = item.get("mail");
    var dcName = item.get("distinguishedName");
    dcName = dcName.substring(dcName.indexOf(",DC=") + 1, dcName.length());
    if (displayName != null && email != null && dcName != null) {
        row.push(false);
        row.push(key);
        row.push(displayName);
        row.push(email);
        row.push(dcName);
    }
    return row;
}

LdapSearchDialog.prototype.getSelectedBaseDomainName = function () {

    if (this.selectedBaseDN == null) {
        var dropBox = this.getPageElement(0, "SELECT_BASE_DN");
        var items = dropBox.getItems();
        var selection = dropBox.getSelectedIndex();
        this.selectedBaseDN = this.getDomainContent(items[selection]);
    }

    return this.selectedBaseDN;
}

LdapSearchDialog.prototype.getSelectedLdapUrl = function () {

    var dropBox = this.getPageElement(0, "SELECT_BASE_DN");
    var items = dropBox.getItems();
    var selection = dropBox.getSelectedIndex();
    return this.getLdapUrl(items[selection]);


}

LdapSearchDialog.prototype.searchBy = function (emails, displayNames, loginNames) {


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
    var searchParameters = BaseDialog.buildAllDomainsList(this.dnsMappers.values().toArray(), this.excludeDomain);
    var users = searchParameters.reduce(function (users, searchParameter) {
        writeLog(sm72tc, "Action LDAP searchBy was running", "info");
        writeLog(sm72tc, searchParameter, "info");

        return users.concat(those.searchLDAPUsers(searchQuery, searchParameter[1], searchParameter[0]));
    }, []);
    this.fillSourceTable(users);
}
