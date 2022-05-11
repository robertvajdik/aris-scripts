function ProcessOwnerHandlingSubDialog(locale, groupGUID, processOwner, processName, corporateKey) {

    this.locale = locale;
    this.groupGUID = groupGUID;
    this.processOwner = BaseDialog.isNullOrEmpty(processOwner) ? null : processOwner.KindNum() === Constants.CID_OBJOCC ? processOwner.ObjDef() : processOwner;
    this.corporateKey = corporateKey;
    this.processName = processName;
    this.searchingContext = new Packages.java.util.HashMap();
    this.maximalUserCount = 1;


    this.dialogResult = {
        isOk: false,
        selection: []
    };

    this.getPages = function () {
        return [this.createPage()];
    }

    this.getResult = function () {
        return this.dialogResult;
    }

    this.onClose = function (pageNumber, bOk) {

        var targetTable = this.getPageElement(0, "POHSD_TARGET_TABLE");

        this.dialogResult.isOk = bOk;
        this.dialogResult.selection.push.apply(this.dialogResult.selection, targetTable.getItems());
    }

    this.init = function () {

        this.searchingContext.clear();
        var sourceTable = this.getPageElement(0, "POHSD_SOURCE_TABLE")
        var targetTable = this.getPageElement(0, "POHSD_TARGET_TABLE")

        if (BaseDialog.isNullOrEmpty(sourceTable)) return false;
        if (BaseDialog.isNullOrEmpty(targetTable)) return false;


        var group = ArisData.getActiveDatabase().FindGUID(this.groupGUID, Constants.CID_GROUP);
        if (BaseDialog.isArisObjectNullOrInvalid(group)) return false;

        var roles = group.ObjDefListFilter(Constants.OT_PERS_TYPE);
        if (BaseDialog.isNullOrEmpty(roles)) return false;
        var locale = this.locale;
        var sourceItems = [];
        var targetItems = [];
        var those = this;
        roles.forEach(function (role) {
            var responsiblePerson = BaseDialog.getMaintainedObjectAttribute(role,
                ProcessOwnerHandlingSubDialog.ATT_PROC_RESP, locale);
            var name = BaseDialog.getMaintainedObjectName(role, locale);

            if (BaseDialog.isNullOrEmpty(those.processOwner) || !String(role.GUID()).equals(those.processOwner.GUID())) {
                sourceItems.push([false, name, responsiblePerson, role.GUID()]);
            }
            else targetItems.push([false, name, responsiblePerson, role.GUID()]);
            those.searchingContext.put(name, role);

        });

        sourceTable.setItems(sourceItems);
        targetTable.setItems(targetItems);


    }

    this.isInValidState = function (pageNumber) {

        try {
            var targetTable = this.getPageElement(pageNumber, "POHSD_TARGET_TABLE");
            var sourceTable = this.getPageElement(pageNumber, "POHSD_SOURCE_TABLE");
            var addButton = this.getPageElement(pageNumber, "POHSD_ADD");
            var removeButton = this.getPageElement(pageNumber, "POHSD_REMOVE");
            var editButton = this.getPageElement(pageNumber, "POHSD_EDIT");

            var length = targetTable.getItems().length;


            if (length === this.maximalUserCount) addButton.setEnabled(false);
            else addButton.setEnabled(true);

            var isSourceSelected = sourceTable.getItems().some(BaseDialog.isChecked);
            var isTargetSelected = targetTable.getItems().some(BaseDialog.isChecked);

            var sourceSelectedCount = sourceTable.getItems().filter(BaseDialog.isChecked).length;
            var targetSelectedCount = targetTable.getItems().filter(BaseDialog.isChecked).length;


            if (isSourceSelected) addButton.setEnabled(true);
            else addButton.setEnabled(false);
            if (isTargetSelected) removeButton.setEnabled(true);
            else removeButton.setEnabled(false);

            if (
                (sourceSelectedCount === 1 && targetSelectedCount !== 1) ||
                (sourceSelectedCount !== 1 && targetSelectedCount === 1)
            ) editButton.setEnabled(true);
            else editButton.setEnabled(false);

            return true;
        } catch (ex) {
            return false;
        }
    }

    this.POHSD_NEW_pressed = function () {
        var dialogFunction = new LdapSearchDialog(null, null, null, 1, this.corporateKey,false);
        this.dialog.setSubDialog("SUBDIALOG", dialogFunction, Constants.DIALOG_TYPE_ACTION, "Search process owner");
    }

    this.POHSD_EDIT_pressed = function () {

        var targetTable = this.getPageElement(0, "POHSD_TARGET_TABLE");
        var sourceTable = this.getPageElement(0, "POHSD_SOURCE_TABLE");

        var isSourceSelected = sourceTable.getItems().some(BaseDialog.isChecked);
        var isTargetSelected = targetTable.getItems().some(BaseDialog.isChecked);
        var assignedUsers = [];
        var processOwnerGUID = null;

        if (isSourceSelected) {
            var sourceSelected = sourceTable.getItems().filter(BaseDialog.isChecked);
            processOwnerGUID = sourceSelected[0][3];
        } else if (isTargetSelected) {
            var targetSelected = targetTable.getItems().filter(BaseDialog.isChecked);
            processOwnerGUID = targetSelected[0][3];
        } else {
            return;
        }

        var processOwner = ArisData.getActiveDatabase().FindGUID(processOwnerGUID, Constants.CID_OBJDEF);

        if (!processOwner.IsValid()) return;

        //DZC740E|Gajdusek, Pavel (IDS Advisory s.r.o.)|ext.Pavel.Gajdusek@skoda-auto.cz|DC=skoda,DC=vwg
        var items = String(
            processOwner.Attribute(ProcessOwnerHandlingSubDialog.ATT_PROC_RESP_ID, this.locale).getValue()).split("|");
        assignedUsers.push([false, items[0], items[1], items[2], items[3]]);
        var processName = BaseDialog.getMaintainedObjectAttribute(processOwner,Constants.AT_NAME,this.locale);

        var dialogFunction = new LdapSearchDialog(processName, assignedUsers, processOwner, 1, this.corporateKey,true);
        this.dialog.setSubDialog("SUBDIALOG", dialogFunction, Constants.DIALOG_TYPE_ACTION, "Search process owner");
    }


    this.SUBDIALOG_subDialogClosed = function (subResult, bOk) {
        if (!bOk) return false;

        var group = ArisData.getActiveDatabase().FindGUID(this.groupGUID, Constants.CID_GROUP);

        if (BaseDialog.isArisObjectNullOrInvalid(group)) return false;

        var objDef;
        var roleName = subResult.roleName;
        if(subResult.isEdit) {

            objDef = subResult.processOwnerObject;
            objDef.Attribute(Constants.AT_NAME,this.locale).setValue(roleName);

        }
        else {

            objDef = group.GetOrCreateObjDef(Constants.OT_PERS_TYPE, 2, roleName, this.locale);
        }


        if (!BaseDialog.isNullOrEmpty(subResult.selectedUsers)) {

            var userAttributeName = subResult.selectedUsers[0][2];
            var userAttributeIdValue = this.constructProcessOwnerID(subResult.selectedUsers[0]);
            if (!BaseDialog.isArisObjectNullOrInvalid(
                objDef.Attribute(ProcessOwnerHandlingSubDialog.ATT_PROC_RESP, this.locale))) objDef.Attribute(
                ProcessOwnerHandlingSubDialog.ATT_PROC_RESP, this.locale).setValue(userAttributeName);
            if (!BaseDialog.isArisObjectNullOrInvalid(
                objDef.Attribute(ProcessOwnerHandlingSubDialog.ATT_PROC_RESP_ID, this.locale))) objDef.Attribute(
                ProcessOwnerHandlingSubDialog.ATT_PROC_RESP_ID, this.locale).setValue(userAttributeIdValue);
        }


        this.init();

    }

    this.POHSD_SELECT_ALL_SOURCE_pressed = function () {
        this.markAllItemsSelected(0, "POHSD_SOURCE_TABLE", 0, true);
    }

    this.POHSD_SELECT_NONE_SOURCE_pressed = function () {
        this.markAllItemsSelected(0, "POHSD_SOURCE_TABLE", 0, false);
    }

    this.POHSD_SELECT_ALL_TARGET_pressed = function () {
        this.markAllItemsSelected(0, "POHSD_TARGET_TABLE", 0, true);
    }

    this.POHSD_SELECT_NONE_TARGET_pressed = function () {
        this.markAllItemsSelected(0, "POHSD_TARGET_TABLE", 0, false);
    }

    this.POHSD_ADD_pressed = function () {
        if (!this.isSourceSelectionValid()) return false;
        this.changeContainOfTable("POHSD_SOURCE_TABLE", "POHSD_TARGET_TABLE");
    }

    this.POHSD_REMOVE_pressed = function () {
        this.changeContainOfTable("POHSD_TARGET_TABLE", "POHSD_SOURCE_TABLE");
    }

    this.POHSD_NAME_SEARCH_BOX_changed = function () {

        try {
            var sourceTable = this.getPageElement(0, "POHSD_SOURCE_TABLE");
            var targetTable = this.getPageElement(0, "POHSD_TARGET_TABLE");
            var searchTextBox = this.getPageElement(0, "POHSD_NAME_SEARCH_BOX");

            if (sourceTable === null || targetTable === null || searchTextBox === null) return false;

            var searchingText = searchTextBox.getText();
            if (searchingText.length === 0) return this.insertIntoSourceTable(null, sourceTable, targetTable);


            var elements = this.searchText(searchingText, this.searchingContext);

            if (elements.length === 0) return false

            var locale = this.locale;
            var sources = elements.reduce(function (array, item) {
                var row = ProcessOwnerHandlingSubDialog.createSourceTableRow(item, locale)
                array.push(row);
                return array;
            }, []);

            return this.insertIntoSourceTable(sources, sourceTable, targetTable);
        } catch (ex) {
        }
    }


}

ProcessOwnerHandlingSubDialog.prototype = Object.create(BaseDialog.prototype);
ProcessOwnerHandlingSubDialog.prototype.constructor = ProcessOwnerHandlingSubDialog;

ProcessOwnerHandlingSubDialog.tableColumnStyle = [
    Constants.TABLECOLUMN_BOOL_EDIT,
    Constants.TABLECOLUMN_SINGLELINE,
    Constants.TABLECOLUMN_SINGLELINE,
    Constants.TABLECOLUMN_SINGLELINE

];
ProcessOwnerHandlingSubDialog.tableColumnsHeader = [
    BaseDialog.getStringFromStringTable("MRP_TABLE_CHECK_COLUMN_TEXT", Context.getSelectedLanguage()),
    BaseDialog.getStringFromStringTable("MRP_TABLE_NAME_COLUMN_TEXT", Context.getSelectedLanguage()),
    BaseDialog.getStringFromStringTable("MRP_TABLE_RESPONSIBLE_PERSON_COLUMN_TEXT", Context.getSelectedLanguage()),
    "GUID"
];
ProcessOwnerHandlingSubDialog.tableColumnWidths = [
    10,
    45,
    44,
    1
];
ProcessOwnerHandlingSubDialog.ATT_PROC_RESP = VWAudiConstants.ATT_PROC_RESP;
ProcessOwnerHandlingSubDialog.ATT_PROC_RESP_ID = VWAudiConstants.ATT_PROC_RESP_ID;

ProcessOwnerHandlingSubDialog.prototype.createPage = function () {

    var page = Dialogs.createNewDialogTemplate(BaseDialog.templateWidth, BaseDialog.templateHeight, "Process Owner");
    page.Text(20, 18, BaseDialog.templateWidth, 20, BaseDialog.getStringFromStringTable("SHSD_NAME_LABEL", this.locale),
        "NAME_LABEL");
    page.TextBox(20, 30, 450, 20, "POHSD_NAME_SEARCH_BOX");

    page.PushButton(480, 28, BaseDialog.pushButtonWidth, BaseDialog.pushButtoHeight,
        BaseDialog.getStringFromStringTable("NEW_BUTTON_TEXT", this.locale), "POHSD_NEW");
    page.PushButton(630, 28, BaseDialog.pushButtonWidth, BaseDialog.pushButtoHeight,
        BaseDialog.getStringFromStringTable("EDIT_BUTTON_TEXT", this.locale), "POHSD_EDIT");

    page.Table(20, 60, 480, 320,
        ProcessOwnerHandlingSubDialog.tableColumnsHeader,
        ProcessOwnerHandlingSubDialog.tableColumnStyle,
        ProcessOwnerHandlingSubDialog.tableColumnWidths,
        "POHSD_SOURCE_TABLE",
        Constants.TABLE_STYLE_SORTED);

    page.PushButton(20, 390, BaseDialog.pushButtonWidth, BaseDialog.pushButtoHeight,
        BaseDialog.getStringFromStringTable("SHSD_SELECT_ALL_SOURCE", this.locale), "POHSD_SELECT_ALL_SOURCE");
    page.PushButton(170, 390, BaseDialog.pushButtonWidth, BaseDialog.pushButtoHeight,
        BaseDialog.getStringFromStringTable("SHSD_SELECT_NONE_SOURCE", this.locale), "POHSD_SELECT_NONE_SOURCE");

    page.Table(665, 60, 480, 320,
        ProcessOwnerHandlingSubDialog.tableColumnsHeader,
        ProcessOwnerHandlingSubDialog.tableColumnStyle,
        ProcessOwnerHandlingSubDialog.tableColumnWidths,
        "POHSD_TARGET_TABLE",
        Constants.TABLE_STYLE_SORTED);


    page.PushButton(670, 390, BaseDialog.pushButtonWidth, BaseDialog.pushButtoHeight,
        BaseDialog.getStringFromStringTable("SHSD_SELECT_ALL_SOURCE", this.locale), "POHSD_SELECT_ALL_TARGET");
    page.PushButton(820, 390, BaseDialog.pushButtonWidth, BaseDialog.pushButtoHeight,
        BaseDialog.getStringFromStringTable("SHSD_SELECT_NONE_SOURCE", this.locale), "POHSD_SELECT_NONE_TARGET");

    page.PushButton(520, 100, BaseDialog.pushButtonWidth, BaseDialog.pushButtoHeight,
        BaseDialog.getStringFromStringTable("SHSD_ADD_BUTTON_TEXT", this.locale), "POHSD_ADD");
    page.PushButton(520, 130, BaseDialog.pushButtonWidth, BaseDialog.pushButtoHeight,
        BaseDialog.getStringFromStringTable("SHSD_REMOVE_BUTTON_TEXT", this.locale), "POHSD_REMOVE");

    page.Text(20, 420, BaseDialog.templateWidth - 100, 40,
        BaseDialog.getStringFromStringTable("SEARCHING_PATTERN_LABEL", this.locale), "SEARCHING_PATTERN_LABEL");
    return page;
}

ProcessOwnerHandlingSubDialog.prototype.isSourceSelectionValid = function () {

    var sourceTable = this.getPageElement(0, "POHSD_SOURCE_TABLE");
    var targetTable = this.getPageElement(0, "POHSD_TARGET_TABLE");

    var targetLength = targetTable.getItems().length;

    var selectedItems = sourceTable.getItems().filter(BaseDialog.isChecked)

    if (selectedItems.length > (this.maximalUserCount - targetLength)) {

        if (this.maximalUserCount === 1) this.showWarningDialogBox(
            "Too many selected users. Please selected only " + this.maximalUserCount + " user");
        else this.showWarningDialogBox(
            "Too many selected users. Please selected only " + (this.maximalUserCount - targetLength) + " users");
        return false;
    }

    return true;
}

ProcessOwnerHandlingSubDialog.prototype.showWarningDialogBox = function (message) {
    this.dialog.setMsgBox("WARNING", message, Constants.MSGBOX_BTN_OK | Constants.MSGBOX_ICON_WARNING,
        "Maximum users warning");
}

ProcessOwnerHandlingSubDialog.prototype.changeContainOfTable = function (sourceIdentifier, targetIdentifier) {

    var sourceTable = this.getPageElement(0, sourceIdentifier);
    var targetTable = this.getPageElement(0, targetIdentifier);


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
    this.markAllItemsSelected(0, targetIdentifier, 0, false);
}

ProcessOwnerHandlingSubDialog.prototype.insertIntoSourceTable = function (elements, sourceTable, targetTable) {

    if (elements === null) elements = this.getSourceElements();

    var targets = targetTable.getItems();
    var sources = elements.reduce(function (array, item) {

        var itemLength = item.length;
        var isContained = targets.some(function (targetItem) {
            var length = targetItem.length;
            return String(item[itemLength - 1]).equals(String(targetItem[length - 1]));
        });
        if (isContained === true) return array;
        array.push(item)
        return array;
    }, []);

    sourceTable.setItems(sources);

}

ProcessOwnerHandlingSubDialog.prototype.getSourceElements = function () {

    var group = ArisData.getActiveDatabase().FindGUID(this.groupGUID, Constants.CID_GROUP);
    if (BaseDialog.isArisObjectNullOrInvalid(group)) return false;

    var roles = group.ObjDefListFilter(Constants.OT_PERS_TYPE);
    if (BaseDialog.isNullOrEmpty(roles)) return false;
    var locale = this.locale;
    var items = [];

    roles.forEach(function (role) {
        var personName = role.Attribute(ProcessOwnerHandlingSubDialog.ATT_PROC_RESP, locale).getValue();
        items.push([false, role.Name(locale), personName, role.GUID()]);
    });
    return items;
}

ProcessOwnerHandlingSubDialog.createSourceTableRow = function (object, locale) {

    var objectName = BaseDialog.getMaintainedObjectName(object, locale);
    var personName = BaseDialog.getMaintainedObjectAttribute(object, ProcessOwnerHandlingSubDialog.ATT_PROC_RESP,
        locale);
    var objectGUID = object.GUID();
    return [false, objectName, personName, objectGUID];
}

ProcessOwnerHandlingSubDialog.prototype.constructProcessOwnerID = function (user) {

    user.splice(0, 1);
    return user.join("|");
}