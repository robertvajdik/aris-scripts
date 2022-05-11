function EMA_LDAPSearchComponent() {
  
  this.baseDomains = [];
  this.dnsMappers = new Packages.java.util.TreeMap();
  this.initialize();
}

EMA_LDAPSearchComponent.prototype.searchLDAPUsers = function (searchQuery, ldapServer, baseDN,referralType,timeout) {
  
  
  writeLog(sm72tc, "Searching parameter searchQuery " + searchQuery, "info");
  writeLog(sm72tc, "Searching parameter ldapServer " + ldapServer, "info");
  writeLog(sm72tc, "Searching parameter baseDN " + baseDN, "info");
  writeLog(sm72tc, "Searching parameter referralType " + referralType, "info");
  writeLog(sm72tc, "Searching parameter timeout " + timeout, "info");
  
  var env = new Packages.java.util.Hashtable(11);
  var foundUsers = new Packages.java.util.TreeMap();
  env.put(javax.naming.Context.INITIAL_CONTEXT_FACTORY, "com.sun.jndi.ldap.LdapCtxFactory");
  
  env.put(javax.naming.Context.SECURITY_AUTHENTICATION, "simple");
  env.put(javax.naming.Context.SECURITY_PRINCIPAL, "SAHDUPJ@skoda.vwg");
  env.put(javax.naming.Context.SECURITY_CREDENTIALS, "U6M2ToS.2015");
  
  env.put(javax.naming.Context.PROVIDER_URL, "ldap://" + ldapServer);
  env.put(javax.naming.Context.REFERRAL, referralType);
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

        EMA_Helper.insertIntoListAttributes(hashTable, attributes, "cn");
        EMA_Helper.insertIntoListAttributes(hashTable, attributes, "mail");
        EMA_Helper.insertIntoListAttributes(hashTable, attributes, "displayName");
        EMA_Helper.insertIntoListAttributes(hashTable, attributes, "distinguishedName");
        EMA_Helper.insertIntoListAttributes(hashTable, attributes, "sAMAccountName");

        var accountName = attributes.get("sAMAccountName");
        if (accountName !== null) foundUsers.put(accountName.get(), hashTable);
      }
    }
  } catch (ex) {
    writeLog(sm72tc, "Searching ends with exception" + ex, "error");
    writeLog(sm72tc, "Stack trace " + Packages.org.apache.commons.lang.exception.ExceptionUtils.getStackTrace(ex.javaException),"error");
  }
  finally {
    if (searchResults !== null && !(typeof searchResults === "undefined")) searchResults.close();
    if (dirContext !== null && !(typeof dirContext === "undefined")) dirContext.close();
  }

  return foundUsers.size() === 0 ? [] : this.transformUsersToArray(foundUsers);

}

EMA_LDAPSearchComponent.prototype.transformUsersToArray = function (users) {
  
  var output = [];
  var iterator = users.entrySet().iterator();
  
  while (iterator.hasNext()) {
    var entry = iterator.next();
    var row = this.createTableRow(entry.getKey(), entry.getValue());
    if (row.length > 0) output.push(row);
  }
  return output;
}

EMA_LDAPSearchComponent.prototype.createTableRow = function (key, item) {
 
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

EMA_LDAPSearchComponent.prototype.initialize = function () {
  
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
    var referralType = domain.getChild("ReferralType").getText();
    
    writeLog(sm72tc,"referralType " + referralType,"info");
    
    
    this.dnsMappers.put(title, {displayName: title, dc: ad, corpList: corpList, url: ldapUrl, referral: referralType});
  }
  
  
  var keySet = this.dnsMappers.keySet();
  var iterator = keySet.iterator();
  while (iterator.hasNext()) {
    var key = iterator.next();
    var value = this.dnsMappers.get(key);
    this.baseDomains.push(value.displayName);
  }
}

EMA_LDAPSearchComponent.prototype.getDNSMappers = function () {
  return this.dnsMappers;
}
EMA_LDAPSearchComponent.prototype.getBaseDomains = function () {
  return this.baseDomains;
}
