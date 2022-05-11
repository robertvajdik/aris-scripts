function ProcessesOverviewPage(object, pageNumber, locale, dialog) {

    this.object = object;
    this.pageNumber = pageNumber;
    this.locale = locale;
    this.dialog = dialog;

    this.predecessorProcess = null;
    this.successorProcess = null;
    this.possibleCompletionRate = [BaseDialog.getStringFromStringTable("NONE_COMPLETION_TEXT",
        this.locale),
        BaseDialog.getStringFromStringTable("POP_0_PERCENT_LABEL", this.locale),
        BaseDialog.getStringFromStringTable("POP_25_PERCENT_LABEL", this.locale),
        BaseDialog.getStringFromStringTable("POP_50_PERCENT_LABEL", this.locale),
        BaseDialog.getStringFromStringTable("POP_75_PERCENT_LABEL", this.locale),
        BaseDialog.getStringFromStringTable("POP_100_PERCENT_LABEL", this.locale)];
    this.selectedPrecedingCompletionRate = 0;
    this.selectedSucceedingCompletionRate = 0;
    this.totalCompletionRate = 0;


}

ProcessesOverviewPage.prototype = Object.create(BaseDialog.prototype);
ProcessesOverviewPage.prototype.constructor = ProcessesOverviewPage;

ProcessesOverviewPage.prototype.createPage = function () {

    var height = Math.floor((BaseDialog.templateHeight - 5) / 3.0);

    var page = Dialogs.createNewDialogTemplate(BaseDialog.templateWidth, BaseDialog.templateHeight,
        BaseDialog.getStringFromStringTable("PROCESSES_OVERVIEW_PAGE_TITLE", this.locale));

    var dyGroup = 30;
    var dyGroup2 = 0;
    page.GroupBox(5, 5, BaseDialog.templateWidth - 5, height - dyGroup,
        BaseDialog.getStringFromStringTable("POP_MAIN_GROUP_BOX", this.locale),
        "POP_MAIN_GROUP_BOX");


    page.Text(15, 25, BaseDialog.halfWidth - 15, 20,
        BaseDialog.getStringFromStringTable("POP_PREDECESSOR_PROCESS_LABEL", this.locale),
        "POP_PREDECESSOR_PROCESS_LABEL");
    page.TextBox(15, 36, BaseDialog.halfWidth - 15, 20, "POP_PREDECESSOR_PROCESS_TEXT", 0);

    page.Text(BaseDialog.halfWidth + 15, 25, BaseDialog.halfWidth - 30, 20,
        BaseDialog.getStringFromStringTable("POP_PREDECESSOR_OWNER_LABEL", this.locale), "POP_PREDECESSOR_OWNER_LABEL");
    page.TextBox(BaseDialog.halfWidth + 15, 36, BaseDialog.halfWidth - 30, 20, "POP_PREDECESSOR_OWNER_TEXT", 0);


    page.Text(15, 60, BaseDialog.halfWidth - 15, 20,
        BaseDialog.getStringFromStringTable("POP_SUCCESSOR_PROCESS_LABEL", this.locale), "POP_SUCCESSOR_PROCESS_LABEL");
    page.TextBox(15, 71, BaseDialog.halfWidth - 15, 20, "POP_SUCCESSOR_PROCESS_TEXT", 0);


    page.Text(BaseDialog.halfWidth + 15, 60, BaseDialog.halfWidth - 30, 20,
        BaseDialog.getStringFromStringTable("POP_SUCCESSOR_OWNER_LABEL", this.locale), "POP_SUCCESSOR_OWNER_LABEL");
    page.TextBox(BaseDialog.halfWidth + 15, 71, BaseDialog.halfWidth - 30, 20, "POP_SUCCESSOR_OWNER_TEXT", 0);

    var yPosGroup2 = 95 + dyGroup;
    page.GroupBox(5, yPosGroup2, BaseDialog.templateWidth - 5, height - dyGroup2,
        BaseDialog.getStringFromStringTable("POP_GENERAL_GROUP_BOX", this.locale), "POP_GENERAL_GROUP_BOX");

    page.Text(15, 10 + yPosGroup2, BaseDialog.templateWidth - 5, 20,
        BaseDialog.getStringFromStringTable("POP_NAME_LABEL", this.locale), "POP_NAME_LABEL");
    page.TextBox(15, 22 + yPosGroup2, BaseDialog.templateWidth - 30, 20, "POP_NAME_TEXT", 0);

    page.Text(15, 40  + yPosGroup2, BaseDialog.templateWidth - 5, 20,
        BaseDialog.getStringFromStringTable("POP_ID_LABEL", this.locale), "POP_ID_LABEL");
    page.TextBox(15, 52 + yPosGroup2, BaseDialog.templateWidth - 30, 20, "POP_ID_TEXT", 0);

    page.Text(15, 70 + yPosGroup2, BaseDialog.templateWidth - 5, 20,
        BaseDialog.getStringFromStringTable("POP_STORY_LABEL", this.locale), "POP_STORY_LABEL");
    page.TextBox(15, 83 + yPosGroup2, BaseDialog.templateWidth - 30, 40, "POP_STORY_TEXT", 1);

    var yPosGroup3 = yPosGroup2 + height;
    page.GroupBox(5, 10 + yPosGroup3, BaseDialog.templateWidth - 5, height - dyGroup2,
        BaseDialog.getStringFromStringTable("POP_COMPLETION_GROUP_BOX", this.locale), "POP_COMPLETION_GROUP_BOX");

    page.Text(15, 15 + yPosGroup3, BaseDialog.templateWidth - 5, 20,
        BaseDialog.getStringFromStringTable("POP_COMPLETION_PREDECESSOR_LABEL", this.locale),
        "POP_PRECEDING_COMPLETION_LABEL")
    page.DropListBox(15, 28 + yPosGroup3, BaseDialog.templateWidth - 30, 20, this.possibleCompletionRate,
        "POP_PRECEDING_COMPLETION_DROP_BOX");


    page.Text(15, 50 + yPosGroup3, BaseDialog.templateWidth - 5, 20,
        BaseDialog.getStringFromStringTable("POP_COMPLETION_SUCCESSOR_LABEL", this.locale),
        "POP_SUCCEEDING_COMPLETION_LABEL")
    page.DropListBox(15, 65 + yPosGroup3, BaseDialog.templateWidth - 30, 20, this.possibleCompletionRate,
        "POP_SUCCEEDING_COMPLETION_DROP_BOX");

    page.Text(15, 85 + yPosGroup3, BaseDialog.templateWidth - 5, 20,
        BaseDialog.getStringFromStringTable("POP_COMPLETION_TOTAL_LABEL", this.locale), "POP_TOTAL_COMPLETION_LABEL")
    page.TextBox(15, 100 + yPosGroup3, BaseDialog.templateWidth - 30, 20, "POP_TOTAL_COMPLETION_TEXT_BOX");

    page.HelpButton(this.loadHelp())

    return page;

}

ProcessesOverviewPage.prototype.init = function () {

    this.predecessorProcess = PRP_Helper.getObjectConnectionHierarchy(this.object.ObjDef(), PRP_Constants.PREDECESSOR,
        PRP_Constants.TOGAF_PREDECESSOR_CONNECTION_TYPE);
    this.successorProcess = PRP_Helper.getObjectConnectionHierarchy(this.object.ObjDef(), PRP_Constants.SUCCESSOR,
        PRP_Constants.TOGAF_SUCCESSOR_CONNECTION_TYPE);


    var predecessorProcessOwner = PRP_Helper.getProcessOwner(this.predecessorProcess, this.locale);
    var successorProcessOwner = PRP_Helper.getProcessOwner(this.successorProcess, this.locale);


    this.fillTextBox("POP_PREDECESSOR_PROCESS_TEXT", this.predecessorProcess, Constants.AT_NAME, false);
    this.fillTextBox("POP_SUCCESSOR_PROCESS_TEXT", this.successorProcess, Constants.AT_NAME, false);

    this.fillTextBox("POP_PREDECESSOR_OWNER_TEXT", predecessorProcessOwner, null, false);
    this.fillTextBox("POP_SUCCESSOR_OWNER_TEXT", successorProcessOwner, null, false);

    this.fillTextBox("POP_NAME_TEXT", this.object.ObjDef(), Constants.AT_NAME, true);
    this.fillTextBox("POP_ID_TEXT", this.object.ObjDef(), Constants.AT_ID, true);
    this.fillTextBox("POP_STORY_TEXT", this.object.ObjDef(), PRP_Constants.PRP_STORY_ATTRIBUTE, true);

    this.dialog.getPageElement(this.pageNumber, "POP_TOTAL_COMPLETION_TEXT_BOX").setEnabled(false);


    var precedingDropBox = this.dialog.getPageElement(this.pageNumber, "POP_PRECEDING_COMPLETION_DROP_BOX");
    var succeedingDropBox = this.dialog.getPageElement(this.pageNumber, "POP_SUCCEEDING_COMPLETION_DROP_BOX");
    var totalTextBox = this.dialog.getPageElement(this.pageNumber, "POP_TOTAL_COMPLETION_TEXT_BOX");
    var completionPrecedingRateAttribute = this.object.ObjDef().
        Attribute(PRP_Constants.PRECEDING_COMPLETION_ATTRIBUTE, this.locale);
    var completionSucceedingRateAttribute = this.object.ObjDef().
        Attribute(PRP_Constants.SUCCEEDING_COMPLETION_ATTRIBUTE, this.locale);

    this.setCompletionRate(precedingDropBox, completionPrecedingRateAttribute, this.setPrecedingCompletionRate);
    this.setCompletionRate(succeedingDropBox, completionSucceedingRateAttribute, this.setSucceedingCompletionRate);

    var totalRateAttribute = this.object.ObjDef().Attribute(PRP_Constants.OVERALL_COMPLETION_ATTRIBUTE, this.locale);
    if (totalRateAttribute.IsMaintained()) {
        this.totalCompletionRate = parseFloat(totalRateAttribute.getValue()).toFixed(2);
        totalTextBox.setText(this.totalCompletionRate + "%");
    } else {
        this.totalCompletionRate = 0;
        totalTextBox.setText("0.00%");
    }


}

ProcessesOverviewPage.prototype.fillTextBox = function (textBoxElementIdentifier, object, attribute, isEnabled) {
    var textBox = this.dialog.getPageElement(this.pageNumber, textBoxElementIdentifier);


    if (attribute === null) {
        textBox.setText(object);
    } else {
        if (!BaseDialog.isArisObjectNullOrInvalid(object)) {
            var text = BaseDialog.getMaintainedObjectAttribute(object, attribute, this.locale);
            textBox.setText(text);
        } else textBox.setText("");
    }
    textBox.setEnabled(isEnabled);

}

ProcessesOverviewPage.prototype.completionPrecedingDropBoxChangeEvent = function (selection) {

    this.selectedPrecedingCompletionRate = selection;
    this.changeTotalCompletionRate();
}

ProcessesOverviewPage.prototype.completionSucceedingDropBoxChangeEvent = function (selection) {

    this.selectedSucceedingCompletionRate = selection;

    this.changeTotalCompletionRate();
}

ProcessesOverviewPage.prototype.isChanged = function () {

    var precedingCompletionRateAttribute = this.object.ObjDef().
        Attribute(PRP_Constants.PRECEDING_COMPLETION_ATTRIBUTE, this.locale);
    var succeedingCompletionRateAttribute = this.object.ObjDef().
        Attribute(PRP_Constants.SUCCEEDING_COMPLETION_ATTRIBUTE, this.locale);
    var story = this.object.ObjDef().Attribute(PRP_Constants.PRP_STORY_ATTRIBUTE,this.locale).getValue();
    var identifier = this.object.ObjDef().Attribute(Constants.AT_ID,this.locale).getValue();
    var name =  this.object.ObjDef().Attribute(Constants.AT_NAME,this.locale).getValue();

    var newName =  this.dialog.getPageElement(this.pageNumber,"POP_NAME_TEXT").getText();
    var newIdentifier =  this.dialog.getPageElement(this.pageNumber,"POP_ID_TEXT").getText();
    var newStory =  this.dialog.getPageElement(this.pageNumber,"POP_STORY_TEXT").getText();



    var isPrecedingChanged = this.isCompletionChanged(precedingCompletionRateAttribute,
        this.selectedPrecedingCompletionRate);

    var isSucceedingChanged = this.isCompletionChanged(succeedingCompletionRateAttribute,
        this.selectedSucceedingCompletionRate);

    var isNameChanged = name.equalsIgnoreCase(newName);
    var isStoryChanged = story.equalsIgnoreCase(newStory);
    var isIdChanged = identifier.equalsIgnoreCase(newIdentifier);

    writeLog(sm72tc, "isNameChanged " + isNameChanged,"info" );
    writeLog(sm72tc, "isStoryChanged " + isStoryChanged,"info" );
    writeLog(sm72tc, "isIdChanged " + isIdChanged,"info" );

    return isPrecedingChanged || isSucceedingChanged || !isNameChanged || !isStoryChanged || !isIdChanged ;
}

ProcessesOverviewPage.prototype.setCompletionRate = function (dropBox, attribute, setter) {

    if (attribute.IsMaintained()) {
        var selection = attribute.getValue();
        var index = Math.floor(parseFloat(selection) / 25.0);
        dropBox.setSelection(index + 1);
        setter(index + 1, this);

    } else {
        dropBox.setSelection(0);
        setter(0, this);

    }
}

ProcessesOverviewPage.prototype.changeTotalCompletionRate = function () {

    var precedingCompletionRate = (this.selectedPrecedingCompletionRate - 1) === -1 ? 0 : (this.selectedPrecedingCompletionRate - 1) * 0.25;
    var succeedingCompletionRate = (this.selectedSucceedingCompletionRate - 1) === -1 ? 0 : (this.selectedSucceedingCompletionRate - 1) * 0.25;

    writeLog(sm72tc, "precedingCompletionRate " + this.selectedPrecedingCompletionRate, "info");
    writeLog(sm72tc, "succeedingCompletionRate " + this.selectedSucceedingCompletionRate, "info");
    writeLog(sm72tc, "precedingCompletionRate " + precedingCompletionRate, "info");
    writeLog(sm72tc, "succeedingCompletionRate " + succeedingCompletionRate, "info");

    this.totalCompletionRate = (((precedingCompletionRate + succeedingCompletionRate) / 2.0) * 100.0).toFixed(2);


    var totalCompletionTextBox = this.dialog.getPageElement(this.pageNumber, "POP_TOTAL_COMPLETION_TEXT_BOX");
    totalCompletionTextBox.setText(this.totalCompletionRate + "%");

}

ProcessesOverviewPage.prototype.setPrecedingCompletionRate = function (rate, those) {
    those.selectedPrecedingCompletionRate = rate;
}

ProcessesOverviewPage.prototype.setSucceedingCompletionRate = function (rate, those) {
    those.selectedSucceedingCompletionRate = rate;
}

ProcessesOverviewPage.prototype.isCompletionChanged = function (attribute, currentValue) {

    if (attribute.IsMaintained()) {
        var selection = attribute.getValue();
        var index = Math.floor(parseFloat(selection) / 25.0);

        return ((index + 1) !== currentValue);
    }
    return (0 !== currentValue);

}

ProcessesOverviewPage.prototype.loadHelp = function() {

    var helpData = Context.getFile("ProcessOverviewPageHelp.html",Constants.LOCATION_SCRIPT);
    if (helpData.length  === 0) return "";
    return new Packages.java.lang.String(helpData, Packages.java.nio.charset.StandardCharsets.UTF_8)
}

