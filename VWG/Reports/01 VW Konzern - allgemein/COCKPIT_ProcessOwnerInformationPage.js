function ProcessOwnerInformationPage(groupGUID, corporateKey, locale) {
    
    this.groupGUID = groupGUID;
    this.locale = locale;
    this.corporateKey = corporateKey;
}

ProcessOwnerInformationPage.prototype = Object.create(BaseDialog.prototype);
ProcessOwnerInformationPage.prototype.constructor = ProcessOwnerInformationPage;

ProcessOwnerInformationPage.prototype.getProcessOwnerGroupGUID = function () {
    return this.groupGUID;
}

ProcessOwnerInformationPage.prototype.getCorporateKey = function () {
    return this.corporateKey;
}

ProcessOwnerInformationPage.prototype.setResponsiblePersonName = function (dialog, pageNumber, name) {
    
    var textBox = dialog.getPageElement(pageNumber, "PIOP_OWNER_NAME_TEXT");
    if (BaseDialog.isNullOrEmpty(textBox)) return false;
    
    textBox.setText(name);
}

ProcessOwnerInformationPage.prototype.setRoleName = function (dialog, pageNumber, name) {
    
    var textBox = dialog.getPageElement(pageNumber, "PIOP_ROLE_NAME_TEXT");
    if (BaseDialog.isNullOrEmpty(textBox)) return false;
    
    textBox.setText(name);
}


ProcessOwnerInformationPage.prototype.createPage = function () {
    
    var page = Dialogs.createNewDialogTemplate(BaseDialog.templateWidth, BaseDialog.templateHeight, BaseDialog.getStringFromStringTable("PROCESS_OWNER_PAGE_TITLE", this.locale));
    page.GroupBox(10, 10, BaseDialog.threeQuaterWidth - 10, BaseDialog.templateHeight - 10,"", "POIP_MAIN_GROUP_BOX");
    
    
    page.Text(15, 15, BaseDialog.threeQuaterWidth - 20, 20, BaseDialog.getStringFromStringTable("PIOP_ROLE_NAME_LABEL", this.locale), "PIOP_ROLE_NAME_LABEL");
    page.TextBox(15, 30, BaseDialog.threeQuaterWidth - 20, 20, "PIOP_ROLE_NAME_TEXT", 0);
    
    page.Text(15, 65, BaseDialog.threeQuaterWidth - 20, 20, BaseDialog.getStringFromStringTable("PIOP_OWNER_NAME_LABEL", this.locale), "PIOP_OWNER_NAME_LABEL");
    page.TextBox(15, 80, BaseDialog.threeQuaterWidth - 20, 20, "PIOP_OWNER_NAME_TEXT", 0);
    
    
    var pushButtonX = BaseDialog.threeQuaterWidth + (Math.floor(BaseDialog.oneQuaterWidth / 2) - Math.floor(BaseDialog.pushButtonWidth / 2))
    page.PushButton(pushButtonX, 10,
                    BaseDialog.pushButtonWidth, BaseDialog.pushButtoHeight,
                    BaseDialog.getStringFromStringTable("MANAGE_BUTTON_TEXT", this.locale), "POIP_MANAGE_BUTTON");
    return page;
}

ProcessOwnerInformationPage.prototype.init = function (dialog, pageNumber, fadModel) {
    
    
    if (BaseDialog.isNullOrEmpty(dialog)) return null;
    if (BaseDialog.isNullOrEmpty(pageNumber)) return null;
    if (pageNumber < 0) return null;
    
    var roleNameTextBox = dialog.getPageElement(pageNumber, "PIOP_ROLE_NAME_TEXT");
    var processOwnerTextBox = dialog.getPageElement(pageNumber, "PIOP_OWNER_NAME_TEXT");
    
    if (BaseDialog.isNullOrEmpty(roleNameTextBox) || BaseDialog.isNullOrEmpty(processOwnerTextBox)) return null;
    
    roleNameTextBox.setEnabled(false);
    processOwnerTextBox.setEnabled(false);
    
    if (BaseDialog.isNullOrEmpty(fadModel)) return null;
    
    var occurrences = fadModel.ObjOccListFilter(FadModelManager.processOwnerType, FadModelManager.processOwnerSymbol);
    if (BaseDialog.isNullOrEmpty(occurrences)) return null;
    var occurrence = occurrences[0];
    
    var name = BaseDialog.getMaintainedObjectName(occurrence.ObjDef(), this.locale);
    var person = BaseDialog.getMaintainedObjectAttribute(occurrence.ObjDef(), ProcessOwnerHandlingSubDialog.ATT_PROC_RESP, this.locale);
    
    roleNameTextBox.setText(name);
    processOwnerTextBox.setText(person);
    return occurrence.ObjDef();
    
}

ProcessOwnerInformationPage.prototype.isInValidState = function (dialog, pageNumber, fadModel) {
    
    var roleName = dialog.getPageElement(pageNumber, "PIOP_ROLE_NAME_TEXT");
    var personName = dialog.getPageElement(pageNumber, "PIOP_OWNER_NAME_TEXT");
    
    if (BaseDialog.isNullOrEmpty(roleName)) return true;
    if (BaseDialog.isNullOrEmpty(personName)) return true;
    
    
    var isValid = true;
    
    if (!BaseDialog.isArisObjectNullOrInvalid(fadModel)) {
        var assigned = fadModel.ObjOccListFilter(FadModelManager.processOwnerType, FadModelManager.processOwnerSymbol);
        var locale = this.locale;
        
        if (assigned.length > 0) {
            if (assigned.length > 0 && roleName.getText().length() === 0 && personName.getText() === 0) {
                return true;
                
            }
            assigned.forEach(function (occurrence) {
                var name = BaseDialog.getMaintainedObjectName(occurrence.ObjDef(), locale);
                var responsible = BaseDialog.getMaintainedObjectAttribute(occurrence.ObjDef(), ProcessOwnerHandlingSubDialog.ATT_PROC_RESP, locale);
                
                isValid = isValid || String(name).equals(String(roleName.getText()));
                isValid = isValid || String(responsible).equals(String(personName.getText()));
                
                
            });
            return isValid;
        }
        
    }
    return roleName.getText().length() > 0 && personName.getText().length() > 0;
}
