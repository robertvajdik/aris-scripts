function ManagementRelevancePage(locale) {
  this.locale = locale;
  this.model = null;
  this.storedSystems = [];
  this.storedTopics = [];
  this.objectSystemType = Constants.OT_KNWLDG_CAT;
  this.objectTopicsType = Constants.OT_TECH_TRM;
  
  this.connectionSystemType = Constants.CT_IS_NEEDED_BY;
  this.connectionTopicType = Constants.CT_IS_CHCKD_BY;
  this.connectionReasonAttribute = Constants.AT_DESC;
  
  
}


ManagementRelevancePage.prototype = Object.create(BaseDialog.prototype);
ManagementRelevancePage.prototype.constructor = ManagementRelevancePage;


ManagementRelevancePage.tableHeader = [
  BaseDialog.getStringFromStringTable("MRP_TABLE_NAME_COLUMN_TEXT", Context.getSelectedLanguage()),
  BaseDialog.getStringFromStringTable("MRP_TABLE_FULL_NAME_COLUMN_TEXT", Context.getSelectedLanguage()),
  BaseDialog.getStringFromStringTable("MRP_TABLE_DESCRIPTION_COLUMN_TEXT", Context.getSelectedLanguage()),
  BaseDialog.getStringFromStringTable("MRP_TABLE_COMMENT_COLUMN_TEXT", Context.getSelectedLanguage()),
  "GUID"
];

ManagementRelevancePage.tableHeaderStyle = [
  Constants.TABLECOLUMN_SINGLELINE,
  Constants.TABLECOLUMN_SINGLELINE,
  Constants.TABLECOLUMN_SINGLELINE,
  Constants.TABLECOLUMN_SINGLELINE,
  Constants.TABLECOLUMN_SINGLELINE


];

ManagementRelevancePage.tableColumnWidths = [
  BaseDialog.tableColumnWidth,
  BaseDialog.tableColumnWidth,
  BaseDialog.tableColumnWidth,
  BaseDialog.tableColumnWidth - 1,
  1
];

ManagementRelevancePage.prototype.createPage = function () {
  
  var page = Dialogs.createNewDialogTemplate(BaseDialog.templateWidth, BaseDialog.templateHeight, BaseDialog.getStringFromStringTable("MANAGEMENT_RELEVANCE_PAGE_TITLE", this.locale));
  
  page.GroupBox(5, 5, BaseDialog.threeQuaterWidth - 5, BaseDialog.halfHeight - 10, BaseDialog.getStringFromStringTable("MRP_SYSTEMS_GROUP_BOX", this.locale), "MRP_SYSTEMS_GROUP_BOX");
  page.Table(10, 10, BaseDialog.threeQuaterWidth - 15, BaseDialog.halfHeight - 25,
             ManagementRelevancePage.tableHeader,
             ManagementRelevancePage.tableHeaderStyle,
             ManagementRelevancePage.tableColumnWidths,
             "SIF_TABLE",
             Constants.TABLE_STYLE_SORTED
  );
  
  var pushButtonX = BaseDialog.threeQuaterWidth + (Math.floor(BaseDialog.oneQuaterWidth / 2) - Math.floor(BaseDialog.pushButtonWidth / 2))
  page.PushButton(pushButtonX, 10,
                  BaseDialog.pushButtonWidth, BaseDialog.pushButtoHeight,
                  BaseDialog.getStringFromStringTable("MANAGE_BUTTON_TEXT", this.locale), "MSIP_MANAGE_BUTTON"
  );
  
  
  return page;
}

ManagementRelevancePage.prototype.isInValidState = function (dialog, fadModel) {
  
  var sifTable = dialog.getPageElement(MainDialog.managementRelevancePageNumber, "SIF_TABLE");
  var loadStoredSystems = this.loadStoredSystems();
  
  
  if (BaseDialog.isNullOrEmpty(sifTable) && BaseDialog.isNullOrEmpty(tifTable)) return true;
  var sifTableItems = sifTable.getItems();
  
  if (BaseDialog.isNullOrEmpty(loadStoredSystems) && BaseDialog.isNullOrEmpty(sifTableItems)) return false;
  
  var isAllSame = false;
  if (loadStoredSystems.length === sifTableItems.length) {
    
    for (var position = 0; position < loadStoredSystems.length; position++) {
      isAllSame = isAllSame || (BaseDialog.isArrayEqual(loadStoredSystems[position], sifTableItems[position]) === false);
    }
  }
  
  return isAllSame;
  
  
}

ManagementRelevancePage.prototype.init = function (dialog, pageNumber, fadModel) {
  
  if (!BaseDialog.isNullOrEmpty(fadModel)) {
    var load = this.getStoredSystems(fadModel);
    var table = dialog.getPageElement(pageNumber, "SIF_TABLE");
    if (!BaseDialog.isNullOrEmpty(table)) table.setItems(load);
    
    load = this.getStoredTopics(fadModel)
    var table = dialog.getPageElement(pageNumber, "TIF_TABLE");
    if (!BaseDialog.isNullOrEmpty(table)) table.setItems(load);
    
  }
  
}

ManagementRelevancePage.prototype.getStoredSystems = function (model) {
  
  if (model === null) return [];
  this.model = model;
  if (BaseDialog.isNullOrEmpty(this.storedSystems)) this.storedSystems = this.loadStoredSystems();
  
  return this.storedSystems;
}

ManagementRelevancePage.prototype.getStoredTopics = function (model) {
  
  if (model === null) return [];
  this.model = model;
  if (BaseDialog.isNullOrEmpty(this.storedTopics)) this.storedTopics = this.loadStoredTopics();
  
  return this.storedTopics;
}

ManagementRelevancePage.prototype.loadStoredSystems = function () {
  
  var objects = this.loadTypedObjOccFromModel(this.model, this.objectSystemType);
  if (BaseDialog.isNullOrEmpty(objects)) return [];
  return this.constructTable(objects, this.connectionSystemType, this.connectionReasonAttribute);
  
}

ManagementRelevancePage.prototype.loadStoredTopics = function () {
  
  var objects = this.loadTypedObjOccFromModel(this.model, this.objectTopicsType);
  if (BaseDialog.isNullOrEmpty(objects)) return [];
  return this.constructTable(objects, this.connectionTopicType, this.connectionReasonAttribute);
  
  
}

ManagementRelevancePage.prototype.constructTable = function (objects, connectionType, connectionAttribute) {
  
  var locale = this.locale;
  var those = this;
  return objects.map(function (occurrence) {
    var object = occurrence.ObjDef();
    var objectName = BaseDialog.getMaintainedObjectName(object, locale);
    var objectFullName = BaseDialog.getMaintainedObjectAttribute(object, Constants.AT_NAME_FULL, locale);
    var objectDescription = BaseDialog.getMaintainedObjectAttribute(object, Constants.AT_DESC, locale);
    var reason = those.getConnectionReason(occurrence.Cxns(), connectionType, connectionAttribute, locale);
    var objectGUID = object.GUID();
    return [objectName, objectFullName, objectDescription, reason, objectGUID];
  });
}
