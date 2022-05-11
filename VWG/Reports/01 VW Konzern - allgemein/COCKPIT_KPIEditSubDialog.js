function KPIEditSubDialog(folderGUID, input, locale, isEdit) {
    
    this.folderGUID = folderGUID;
    this.locale = locale;
    this.input = input;
    this.isEdit = isEdit;
    this.dialogResult = {
        isOk: false
    };
    
    
    this.getPages = function () {
        return [this.createPage()];
    }
    
    this.init = function () {
        
        if (this.isEdit) {
            var title = BaseDialog.getMaintainedObjectAttribute(input, Constants.AT_NAME, this.locale);
            var definition = BaseDialog.getMaintainedObjectAttribute(input, Constants.AT_DESC, this.locale);
            var planValue = BaseDialog.getMaintainedObjectAttribute(input,Constants.AT_PL_VAL, this.locale);
            var actualValue = BaseDialog.getMaintainedObjectAttribute(input,Constants.AT_ACT_VAL, this.locale);
            var unit = BaseDialog.getMaintainedObjectAttribute(input,Constants.AT_BSC_UNIT, this.locale);
            
            this.getPageElement(0, "KESD_TITLE_TEXT").setText(title);
            this.getPageElement(0, "KESD_DEFINITION_TEXT").setText(definition);
            this.getPageElement(0, "KESD_PLAN_VALUE_TEXT").setText(planValue);
            this.getPageElement(0, "KESD_ACTUAL_VALUE_TEXT").setText(actualValue);
            this.getPageElement(0, "KESD_UNIT_TEXT").setText(unit);
            
        }
    }
    
    this.isInValidState = function () {
        
        var titleText = this.getPageElement(0, "KESD_TITLE_TEXT");
        var definitionText = this.getPageElement(0, "KESD_DEFINITION_TEXT");
        var planText = this.getPageElement(0, "KESD_PLAN_VALUE_TEXT");
        var actualText = this.getPageElement(0, "KESD_ACTUAL_VALUE_TEXT");
        var unitText = this.getPageElement(0, "KESD_UNIT_TEXT");
        
        if (this.isEdit) {
            
            var title = BaseDialog.getMaintainedObjectAttribute(input, Constants.AT_NAME, this.locale);
            var definition = BaseDialog.getMaintainedObjectAttribute(input, Constants.AT_DESC, this.locale);
            var planValue = BaseDialog.getMaintainedObjectAttribute(input,Constants.AT_PL_VAL, this.locale);
            var actualValue = BaseDialog.getMaintainedObjectAttribute(input,Constants.AT_ACT_VAL, this.locale);
            var unit = BaseDialog.getMaintainedObjectAttribute(input,Constants.AT_BSC_UNIT, this.locale);
            
            var isChanged = [
                String(planValue).localeCompare(planText.getText()) !== 0,
                String(actualValue).localeCompare(actualText.getText()) !== 0,
                String(unit).localeCompare(unitText.getText()) !== 0,
                String(title).localeCompare(titleText.getText()) !== 0,
                String(definition).localeCompare(definitionText.getText()) !== 0
            ];
    
            return isChanged.reduce(function(previous,current) {
                return previous || current;
            },false);
            
        }
        return true;
        
    }
    
    this.getResult = function () {
        return this.dialogResult;
    }
    
    this.onClose = function (pageNumber, bOk) {
        this.dialogResult.isOk = bOk;
        this.dialogResult.isEdit = this.isEdit;
        this.dialogResult.object = this.input;
        this.dialogResult.title = this.getPageElement(0, "KESD_TITLE_TEXT").getText();
        this.dialogResult.description = this.getPageElement(0, "KESD_DEFINITION_TEXT").getText();
        this.dialogResult.planValue = this.getPageElement(0, "KESD_PLAN_VALUE_TEXT").getText();
        this.dialogResult.actualValue = this.getPageElement(0, "KESD_ACTUAL_VALUE_TEXT").getText();
        this.dialogResult.unit = this.getPageElement(0, "KESD_UNIT_TEXT").getText();
        
    }
    
    
}

KPIEditSubDialog.prototype = Object.create(BaseDialog.prototype)
KPIEditSubDialog.prototype.constructor = KPIEditSubDialog;

KPIEditSubDialog.prototype.createPage = function () {
    
    var pageHeight = Math.floor(BaseDialog.halfHeight * 0.75);
    var pageWidth = Math.floor(0.75 * BaseDialog.templateWidth);
    var textBoxWidth = pageWidth - 140;
    var pageWidthSixth = Math.floor((pageWidth - 10) / 6);
    
    var page = Dialogs.createNewDialogTemplate(pageWidth, pageHeight, "");
    
    page.Text(5, 15, 120, 20, BaseDialog.getStringFromStringTable("KESD_TITLE_LABEL",this.locale), "KESD_TITLE_LABEL");
    page.TextBox(130, 10, textBoxWidth, 20, "KESD_TITLE_TEXT");
    
    page.Text(5, 40, 120, 20, BaseDialog.getStringFromStringTable("KESD_DEFINITION_LABEL",this.locale), "KESD_DEFINITION_LABEL");
    page.TextBox(130, 35, textBoxWidth, 40, "KESD_DEFINITION_TEXT", 1);
    
    page.Text(5, 90, 120, 20, BaseDialog.getStringFromStringTable("KESD_PLAN_VALUE_LABEL",this.locale), "KESD_PLAN_VALUE_LABEL");
    page.TextBox(130, 85, 2 * pageWidthSixth, 20, "KESD_PLAN_VALUE_TEXT", 0);
    
    page.Text(5, 115, 120, 20, BaseDialog.getStringFromStringTable("KESD_ACTUAL_VALUE_LABEL",this.locale), "KESD_ACTUAL_VALUE_LABEL");
    page.TextBox(130, 110, 2 * pageWidthSixth, 20, "KESD_ACTUAL_VALUE_TEXT", 0);
    
    page.Text(5, 140, 120, 20, BaseDialog.getStringFromStringTable("KESD_UNIT_LABEL",this.locale), "KESD_UNIT_LABEL");
    page.TextBox(130, 135, 2 * pageWidthSixth, 20, "KESD_UNIT_TEXT", 0);
    
    
    return page;
}
