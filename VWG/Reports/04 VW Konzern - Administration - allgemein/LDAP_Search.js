function LDAP_Search() {

    this.displayNameRegex = /([a-z]*,)(\s[a-z]*)(\s[0-9]*)*/gi;
    this.emailRegex = /[a-z0-9._-]+@[a-z0-9.-]+\.[a-z]{2,4}/gi
    this.excludeDomain = "DC=vwg";
    this.dnsMappers = new Packages.java.util.TreeMap();
    this.baseDomains = [];
    this.selectedBaseDN = null;
}

LDAP_Search.prototype.buildDomainList = function () {

    var file = file = Context.getFile("ModellObjektDialog.xml", Constants.LOCATION_SCRIPT);
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
};

LDAP_Search.prototype.getDomainList = function () {
    if (this.baseDomains.length === 0) this.buildDomainList();
    return this.baseDomains;
}

LDAP_Search.prototype.searchUserByMultiInput = function (textBox, dropBox, dropBoxIndex) {

    var searchQuery = "(&(sAMAccountType=805306368)";
    var text = textBox.getText();
    if (text.indexOf(";") === -1) {

        searchQuery += ("(|(mail=" + text + ")");
        searchQuery += ("(displayName=" + text + ")");
        searchQuery += ("(sAMAccountName=" + text + ")");

        searchQuery += "))";
        var users = this.searchLDAPUsers(searchQuery,
            this.getSelectedLdapUrl(dropBox, dropBoxIndex),
            this.getSelectedBaseDomainName(dropBox, dropBoxIndex));
        this.selectedBaseDN = null;
        return users;
    }


    var emails = text.match(this.emailRegex);
    var displayNames = text.match(this.displayNameRegex);


    if (emails !== null || displayNames !== null) {
        return this.searchBy(emails, displayNames, null);
    }

    var loginNames = text.split(";");
    this.selectedBaseDN = null;
    return this.searchBy(null, null, loginNames);

}

LDAP_Search.prototype.searchBy = function (emails, displayNames, loginNames) {


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
    var searchParameters = this.buildAllDomainsList(this.dnsMappers.values().toArray(), this.excludeDomain);
  
    var users = searchParameters.reduce(function (users, searchParameter) {
      
        return users.concat(those.searchLDAPUsers(searchQuery, searchParameter[1], searchParameter[0]));
    }, []);
    return users;
}

LDAP_Search.prototype.buildSearchQuery = function (type, content) {

    var ldapQuery = "(&(objectCategory=person)(objectClass=user))";
    if (content instanceof Array) {
        return "";
    }

    return [ldapQuery.slice(0, ldapQuery.length() - 1),
        "(",
        type,
        "=",
        content,
        ")",
        ldapQuery.slice(ldapQuery.length() - 1)].join("");
}

LDAP_Search.prototype.buildAllDomainsList = function (domains, exclude) {

    return domains.filter(
        function (domain) {
            return domain.dc.localeCompare(exclude) !== 0;
        })
        .reduce(function (allDomains, domain) {
            var item = [domain.dc, domain.url];
            allDomains.push(item);
            return allDomains;
        }, []);

}

LDAP_Search.prototype.searchLDAPUsers = function (searchQuery, ldapServer, baseDN) {

    var env = new Packages.java.util.Hashtable(11);
    var timeout = 30;
    var foundUsers = new Packages.java.util.TreeMap();
    env.put(javax.naming.Context.INITIAL_CONTEXT_FACTORY, "com.sun.jndi.ldap.LdapCtxFactory");

    env.put(javax.naming.Context.SECURITY_AUTHENTICATION, "simple");
    env.put(javax.naming.Context.SECURITY_PRINCIPAL, "SAHDUPJ@skoda.vwg");
    env.put(javax.naming.Context.SECURITY_CREDENTIALS, "U6M2ToS.2015");

    if (baseDN.equals(this.excludeDomain)===true)  {
        env.put(javax.naming.Context.PROVIDER_URL, "ldap://VWGWOD00011.vwg:389");
        env.put(javax.naming.Context.REFERRAL, "follow");
        timeout = 360;
    }
    else if (baseDN.equals("DC=na,DC=vwg")===true) {
        env.put(javax.naming.Context.PROVIDER_URL, "ldap://" + ldapServer);
        env.put(javax.naming.Context.REFERRAL, "follow");
        timeout = 360;
    }
    else if (baseDN.equals("DC=emea,DC=vwg")===true) {
        env.put(javax.naming.Context.PROVIDER_URL, "ldap://" + ldapServer);
        env.put(javax.naming.Context.REFERRAL, "follow");
        timeout = 360;
    }
    else if (baseDN.equals("DC=sa,DC=vwg")===true) {
        env.put(javax.naming.Context.PROVIDER_URL, "ldap://" + ldapServer);
        env.put(javax.naming.Context.REFERRAL, "follow");
        timeout = 360;
    }
     else if (baseDN.equals("DC=bentley,DC=emea,DC=vwg") === true) {
        env.put(javax.naming.Context.PROVIDER_URL, "ldap://" + ldapServer);
        env.put(javax.naming.Context.REFERRAL, "follow");
        timeout = 360;
     }
    else {
        env.put(javax.naming.Context.REFERRAL, "ignore");
        env.put(javax.naming.Context.PROVIDER_URL, "ldap://" + ldapServer);
    }
    // Create initial context
    try {

        var dirContext = new Packages.javax.naming.directory.InitialDirContext(env);
        var controls = new Packages.javax.naming.directory.SearchControls();

        controls.setCountLimit(1000);
        controls.setDerefLinkFlag(true);
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

                this.insertIntoListAttributes(hashTable, attributes, "cn");
                this.insertIntoListAttributes(hashTable, attributes, "mail");
                this.insertIntoListAttributes(hashTable, attributes, "displayName");
                this.insertIntoListAttributes(hashTable, attributes, "distinguishedName");
                this.insertIntoListAttributes(hashTable, attributes, "sAMAccountName");

                var accountName = attributes.get("sAMAccountName");
                if (accountName !== null) foundUsers.put(accountName.get(), hashTable);

            }
            moreReferrals = false;
            searchResults.close();
        }
        dirContext.close();
        return this.transformUsersToArray(foundUsers);
    } catch (ex) {
        var message = ex.javaException.getMessage();
        var stack = Packages.org.apache.commons.lang.exception.ExceptionUtils.getStackTrace(ex.javaException)
        _logger.info("LDAP SEARCH EXCEPTION " + message);
        _logger.info("LDAP SEARCH EXCEPTION " + stack );
        return [];
    }
}

LDAP_Search.prototype.insertIntoListAttributes = function (table, attributes, attribute) {

    var currentAttribute = attributes.get(attribute);
    if (currentAttribute != null) table.put(attribute, currentAttribute.get());

}

LDAP_Search.prototype.transformUsersToArray = function (users) {

    var output = [];
    var iterator = users.entrySet().iterator();

    while (iterator.hasNext()) {
        var entry = iterator.next();
        var row = this.createTableRow(entry.getKey(), entry.getValue());
        if (row.length > 0) output.push(row);
    }
    return output;
}

LDAP_Search.prototype.createTableRow = function (key, item) {
    var row = [];
    var displayName = item.get("displayName");
    var email = item.get("mail");
    var dcName = item.get("distinguishedName");
    dcName = dcName.substring(dcName.indexOf(",DC=") + 1, dcName.length());
    if (displayName != null && email != null && dcName != null) {
        row.push(false);
        row.push(key);
        row.push(displayName);
    }
    return row;
}

LDAP_Search.prototype.getSelectedLdapUrl = function (dropBox,selection ) {

    var items = dropBox.getItems();
    return this.getLdapUrl(items[selection]);


}

LDAP_Search.prototype.getLdapUrl = function (domainName) {

    if (this.dnsMappers.size() === 0) return "";

    var iterator = this.dnsMappers.entrySet().iterator();
    while (iterator.hasNext()) {
        var entry = iterator.next();
        var value = entry.getValue();
        if (value.displayName.localeCompare(domainName) === 0) return value.url;
    }
    return "";
}

LDAP_Search.prototype.getSelectedBaseDomainName = function (dropBox,selection) {

    if (this.selectedBaseDN == null) {
        var items = dropBox.getItems();
        this.selectedBaseDN = this.getDomainContent(items[selection]);
    }

    return this.selectedBaseDN;
}

LDAP_Search.prototype.getDomainContent = function (domainName) {

    if (this.dnsMappers.size() === 0) return "";

    var iterator = this.dnsMappers.entrySet().iterator();
    while (iterator.hasNext()) {
        var entry = iterator.next();
        var value = entry.getValue();
        if (value.displayName.localeCompare(domainName) === 0) return value.dc;
    }
    return "";
}