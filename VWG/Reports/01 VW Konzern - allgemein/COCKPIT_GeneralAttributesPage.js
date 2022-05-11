function GeneralAttributesPage(object, pageNumber, processIdentifierModelGUID, locale, dialog) {
    this.object = object;
    this.dialog = dialog;
    this.locale = locale;
    this.pageNumber = pageNumber;
    this.identifiers = this.loadIdentifiers(processIdentifierModelGUID);
    this.processIdentifierModelGUID = processIdentifierModelGUID;
}

GeneralAttributesPage.prototype = Object.create(BaseDialog.prototype);
GeneralAttributesPage.prototype.constructor = GeneralAttributesPage;

GeneralAttributesPage.prototype.createPage = function () {
    
    var halfWidth = Math.floor((BaseDialog.templateWidth - 15) / 2) - 25;
    var oneThirdWith = Math.floor((BaseDialog.templateWidth - 15) / 3) - 10;
    var page = Dialogs.createNewDialogTemplate(BaseDialog.templateWidth, BaseDialog.templateHeight, BaseDialog.getStringFromStringTable("GENERAL_ATTRIBUTES_PAGE_TITLE", this.locale));
    page.GroupBox(5, 5, BaseDialog.templateWidth - 5, BaseDialog.templateHeight - 5, BaseDialog.getStringFromStringTable("GNA_MAIN_GROUP_BOX", this.locale), "GNA_MAIN_GROUP_BOX");
    
    page.GroupBox(10, 10, BaseDialog.templateWidth - 15, BaseDialog.templateHeight-15, "", "GNA_MODEL_SUBGROUP_BOX");
    
    page.Text(15, 5, halfWidth, 20, BaseDialog.getStringFromStringTable("GNA_PROCESS_NAME_LABEL", this.locale), "GNA_PROCESS_NAME_LABEL");
    page.TextBox(15, 16, halfWidth, 20, "GNA_PROCESS_NAME_TEXT", 0);
    
    page.Text(15,  41, BaseDialog.templateWidth - 25, 20,BaseDialog.getStringFromStringTable("GNA_PROCESS_PURPOSE_LABEL", this.locale) , "GNA_PROCESS_PURPOSE_LABEL");
    page.TextBox(15, 54, BaseDialog.templateWidth - 25, 80, "GNA_PROCESS_PURPOSE_TEXT", 1);
    
    page.Text(15, 140, oneThirdWith, 20, BaseDialog.getStringFromStringTable("GNA_PROCESS_LEVEL_LABEL", this.locale), "GNA_PROCESS_LEVEL_LABEL");
    page.TextBox(15, 153, oneThirdWith, 20, "GNA_PROCESS_LEVEL_TEXT", 0);
    
    page.Text(15 + oneThirdWith + 10, 140, oneThirdWith, 20, BaseDialog.getStringFromStringTable("GNA_PROCESS_IDENTIFIER_LABEL", this.locale) , "GNA_PROCESS_IDENTIFIER_LABEL");
    page.DropListBox(15 + oneThirdWith + 10, 153, oneThirdWith, 20, [], "GNA_PROCESS_IDENTIFIER_DROP_BOX");
    
    page.Text(15 + 2 * (oneThirdWith + 10), 140, oneThirdWith, 20, BaseDialog.getStringFromStringTable("GNA_PROCESS_NAMING_LABEL", this.locale) , "GNA_PROCESS_NAMING_LABEL");
    page.TextBox(15 + 2 * (oneThirdWith + 10), 153, oneThirdWith, 20, "GNA_PROCESS_NAMING_TEXT", 0);
    
    page.Text(15, 173, BaseDialog.templateWidth - 25, 20, BaseDialog.getStringFromStringTable("GNA_RULES_DESCRIPTION_LABEL", this.locale), "GNA_RULES_DESCRIPTION_LABEL");
    page.TextBox(15, 186, BaseDialog.templateWidth - 25, 80, "GNA_RULES_DESCRIPTION_TEXT", 1);
    
    
    page.Text(15, 280, BaseDialog.templateWidth - 25, 20, BaseDialog.getStringFromStringTable("GNA_MANDATORY_LABEL", this.locale), "GNA_MANDATORY_LABEL");
    
    
    return page;
}

GeneralAttributesPage.prototype.init = function () {
    
    var processNameElement = this.dialog.getPageElement(this.pageNumber, "GNA_PROCESS_NAME_TEXT");
    var processRuleDescriptionElement = this.dialog.getPageElement(this.pageNumber, "GNA_RULES_DESCRIPTION_TEXT");
    var identifierNumberElement = this.dialog.getPageElement(this.pageNumber, "GNA_PROCESS_IDENTIFIER_DROP_BOX");
    var levelElement = this.dialog.getPageElement(this.pageNumber, "GNA_PROCESS_LEVEL_TEXT");
    var processPurposeElement = this.dialog.getPageElement(this.pageNumber, "GNA_PROCESS_PURPOSE_TEXT");
    
    
    if (!BaseDialog.isNullOrEmpty(identifierNumberElement)) {
        identifierNumberElement.setItems(this.identifiers);
        identifierNumberElement.setSelection(0);
    }
    
    if (!BaseDialog.isNullOrEmpty(processNameElement)) {
        processNameElement.setText(this.object.Name(this.locale));
    }
    
    if (!BaseDialog.isNullOrEmpty(processRuleDescriptionElement) &&
        !BaseDialog.isArisObjectNullOrInvalid(this.object.Attribute(Constants.AT_DESC, this.locale))) {
        processRuleDescriptionElement.setText(this.object.Attribute(Constants.AT_DESC, this.locale).getValue())
    }
    
    
    if (!BaseDialog.isNullOrEmpty(identifierNumberElement) &&
        !BaseDialog.isArisObjectNullOrInvalid(this.object.Attribute(Constants.AT_ID, this.locale))) {
        
        var objectIdentifier = String(this.object.Attribute(Constants.AT_ID, this.locale).getValue());
        var index = 0;
        this.identifiers.some(function (item, currentIndex) {
            if (!item.equals(objectIdentifier)) return false;
            index = currentIndex;
            return true;
        });
        identifierNumberElement.setSelection(index);
    }
    
    if (!BaseDialog.isNullOrEmpty(levelElement) &&
        !BaseDialog.isArisObjectNullOrInvalid(this.object.Attribute(OBJECT_LEVEL_ATTRIBUTE, this.locale))) {
        levelElement.setText(this.object.Attribute(OBJECT_LEVEL_ATTRIBUTE, this.locale).getValue());
    }
    
    if (!BaseDialog.isNullOrEmpty(processPurposeElement) &&
        !BaseDialog.isArisObjectNullOrInvalid(this.object.Attribute(OBJECT_PROCESS_PURPOSE_ATTRIBUTE,this.locale))) {
        processPurposeElement.setText(this.object.Attribute(OBJECT_PROCESS_PURPOSE_ATTRIBUTE,this.locale).getValue());
    }
    
    
    
}

GeneralAttributesPage.prototype.isInValidState = function () {
    
    var processNameElement = this.dialog.getPageElement(this.pageNumber, "GNA_PROCESS_NAME_TEXT");
    var processRuleDescriptionElement = this.dialog.getPageElement(this.pageNumber, "GNA_RULES_DESCRIPTION_TEXT");
    var levelElement = this.dialog.getPageElement(this.pageNumber, "GNA_PROCESS_LEVEL_TEXT");
    var processIdentifierElement = this.dialog.getPageElement(this.pageNumber, "GNA_PROCESS_IDENTIFIER_DROP_BOX");
    var processNamingElement = this.dialog.getPageElement(this.pageNumber, "GNA_PROCESS_NAMING_TEXT");
    var processPurposeElement = this.dialog.getPageElement(this.pageNumber, "GNA_PROCESS_PURPOSE_TEXT");
    
    var isValid = false;
    
    
    if (!BaseDialog.isNullOrEmpty(processNameElement)) {
        var objectName = String(this.object.Attribute(Constants.AT_NAME, this.locale).getValue());
        var currentObjectName = String(processNameElement.getText());
        
        isValid = isValid || (currentObjectName.length > 0 && !objectName.equals(currentObjectName));
        
    }
    
    if (!BaseDialog.isNullOrEmpty(processRuleDescriptionElement)) {
        var objectDescription = String(this.object.Attribute(Constants.AT_DESC, this.locale).getValue());
        var currentObjectDescription = String(processRuleDescriptionElement.getText());
        
        isValid = isValid || (currentObjectDescription.length > 0 && !objectDescription.equals(currentObjectDescription));
    }
    
    
    if (!BaseDialog.isNullOrEmpty(levelElement)) {
        var objectLevel = String(this.object.Attribute(OBJECT_LEVEL_ATTRIBUTE, this.locale).getValue());
        var currentObjectLevel = String(levelElement.getText());
        
        isValid = isValid || (currentObjectLevel.length > 0 && !objectLevel.equals(currentObjectLevel));
    }
    
    
    if (!BaseDialog.isNullOrEmpty(processPurposeElement)) {
        var processPurpose = String(this.object.Attribute(OBJECT_PROCESS_PURPOSE_ATTRIBUTE,this.locale).getValue());
        var currentProcessPurpose = String(processPurposeElement.getText());
        
        isValid = isValid || (currentProcessPurpose.length > 0 && !processPurpose.equals(currentProcessPurpose));
    }
    
    if (!BaseDialog.isNullOrEmpty(processNameElement) && !BaseDialog.isNullOrEmpty(levelElement) &&
        !BaseDialog.isNullOrEmpty(processIdentifierElement)) {
        var identifier = this.identifiers[processIdentifierElement.getSelection()];
        var level = levelElement.getText();
        var name = processNameElement.getText();
        
        var processNaming = String(level + "_" + identifier + name);
        if (!BaseDialog.isNullOrEmpty(processNamingElement)) processNamingElement.setText(processNaming);
        
    }
    
    return isValid;
    
}

GeneralAttributesPage.prototype.getResults = function () {
    
    var results = {};
    
    results.name = this.dialog.getPageElement(this.pageNumber, "GNA_PROCESS_NAME_TEXT").getText();
    results.description = this.dialog.getPageElement(this.pageNumber, "GNA_RULES_DESCRIPTION_TEXT").getText();
    results.level = this.dialog.getPageElement(this.pageNumber, "GNA_PROCESS_LEVEL_TEXT").getText();
    results.identifier = this.identifiers[this.dialog.getPageElement(this.pageNumber, "GNA_PROCESS_IDENTIFIER_DROP_BOX").getValue()];
    results.processNaming = this.dialog.getPageElement(this.pageNumber, "GNA_PROCESS_NAMING_TEXT").getText();
    results.processPurpose = this.dialog.getPageElement(this.pageNumber,"GNA_PROCESS_PURPOSE_TEXT").getText();
    return results;
}

GeneralAttributesPage.prototype.loadIdentifiers = function (modelGUID) {
    
    var model = ArisData.getActiveDatabase().FindGUID(modelGUID, Constants.CID_MODEL);
    if (BaseDialog.isArisObjectNullOrInvalid(model)) return [];
    
    var objects = model.ObjDefList();
    objects = ArisData.sort(objects, Constants.AT_NAME, this.locale);
    
    var locale = this.locale;
    
    return objects.map(function (object) {
        return String(object.Attribute(Constants.AT_NAME, locale).getValue());
    });
    
}
