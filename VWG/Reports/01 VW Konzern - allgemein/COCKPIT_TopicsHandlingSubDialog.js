TopicsHandlingSubDialog = function (locale, mainTopicsModel, fadStoredTopics) {

    this.locale = locale;
    this.mainModel = mainTopicsModel;
    this.cache = new Packages.java.util.TreeMap();
    this.fadStoredTopics = fadStoredTopics;
    this.currentTopics = new Packages.java.util.HashMap();
    this.reasonConnectionType = Constants.CT_IS_CHCKD_BY;
    this.reasonConnectionAttribute = Constants.AT_DESC;
    this.attributeTopicsGuid = "";

    this.dialogResult = {
        isOk: false,
        selection: []
    };


    this.getPages = function () {
        return [this.createPage()];
    }

    this.init = function () {

        if (BaseDialog.isArisObjectNullOrInvalid(this.mainModel)) return false;
        var occurrences = this.mainModel.ObjOccListFilter(Constants.OT_TECH_TRM);
        if (BaseDialog.isNullOrEmpty(occurrences)) return false;

        var sourceTable = this.getPageElement(0, "THSD_SOURCE_TABLE");
        var targetTable = this.getPageElement(0, "THSD_TARGET_TABLE");


        var locale = this.locale;
        var those =  this;
        occurrences.forEach(function (occurrence) {
            var object = occurrence.ObjDef();
            var tableArray = TopicsHandlingSubDialog.createSourceTableRow(object, locale);
            those.currentTopics.put(object, tableArray);
        });

        sourceTable.setItems(this.getSourceElements());
        targetTable.setItems(this.getTargetElements());
        this.buildSearchingContext();
    }

    this.isInValidState = function (pageNumber) {

        var targetTable = this.getPageElement(pageNumber, "THSD_TARGET_TABLE");
        var sourceTable = this.getPageElement(pageNumber, "THSD_SOURCE_TABLE");
        var addButton = this.getPageElement(pageNumber, "THSD_ADD");
        var removeButton = this.getPageElement(pageNumber, "THSD_REMOVE");

        if (this.cannotCreateObjDef === true) {
            var message = "Lieber ARIS-User, \n" +
                "leider besitzen sie nicht die Rechte, um ein neues Thema anzulegen. Zu diesem Zweck kontaktieren sie bitte das „Zentralbereich Prozessmanagement, I/SO-3\". \n" +
                "Vielen Dank!";

            var message2 = "Lieber ARIS-User, \n" +
                "leider besitzen sie nicht die Rechte, um ein neues Thema anzulegen. Zu diesem Zweck kontaktieren sie bitte das „Zentralbereich Prozessmanagement\". \n" +
                "Vielen Dank!";

            if (CorpKey.equals("0200")) this.dialog.setMsgBox("WARNING", message, Constants.MSGBOX_BTN_OK | Constants.MSGBOX_ICON_WARNING, "False Rechte");
            else this.dialog.setMsgBox("WARNING", message2, Constants.MSGBOX_BTN_OK | Constants.MSGBOX_ICON_WARNING, "False Rechte");
            this.cannotCreateObjDef = false;
        }

        if (targetTable === null || addButton === null || removeButton === null) return true;

        var isSourceSelected = sourceTable.getItems().some(BaseDialog.isChecked);
        var isTargetSelected = targetTable.getItems().some(BaseDialog.isChecked);

        if (isSourceSelected) addButton.setEnabled(true);
        else addButton.setEnabled(false);
        if (isTargetSelected) removeButton.setEnabled(true);
        else removeButton.setEnabled(false);

        return targetTable.getItems().every(function (row) {
            var commentary = row[3];
            return commentary !== null && commentary.length > 0;
        });
    }

    this.getResult = function () {
        return this.dialogResult;
    }

    this.onClose = function (pageNumber, bOk) {

        var targetTable = this.getPageElement(0, "THSD_TARGET_TABLE");

        this.dialogResult.isOk = bOk;
        this.dialogResult.selection.push.apply(this.dialogResult.selection, targetTable.getItems());
    }

    this.THSD_SEARCH_BOX_changed = function () {

        var sourceTable = this.getPageElement(0, "THSD_SOURCE_TABLE");
        var targetTable = this.getPageElement(0, "THSD_TARGET_TABLE");
        var searchTextBox = this.getPageElement(0, "THSD_SEARCH_BOX");

        if (sourceTable === null || targetTable === null || searchTextBox === null) return false;

        var searchingText = searchTextBox.getText();
        if (searchingText.length === 0) return this.insertIntoSourceTable(null, sourceTable, targetTable);

        var elements = this.searchText(searchingText, this.cache);

        if (elements.length === 0) return false

        var locale = this.locale;
        var sources = elements.reduce(function (array, item) {
            var row = TopicsHandlingSubDialog.createSourceTableRow(item, locale)
            array.push(row);
            return array;
        }, []);


        return this.insertIntoSourceTable(sources, sourceTable, targetTable);
    }

    this.THSD_SELECT_ALL_SOURCE_pressed = function () {
        this.markAllItemsSelected(0, "THSD_SOURCE_TABLE", 0, true);
    }

    this.THSD_SELECT_NONE_SOURCE_pressed = function () {
        this.markAllItemsSelected(0, "THSD_SOURCE_TABLE", 0, false);
    }

    this.THSD_SELECT_ALL_TARGET_pressed = function () {
        this.markAllItemsSelected(0, "THSD_TARGET_TABLE", 0, true);
    }

    this.THSD_SELECT_NONE_TARGET_pressed = function () {
        this.markAllItemsSelected(0, "THSD_TARGET_TABLE", 0, false);
    }

    this.THSD_ADD_pressed = function () {
        this.changeContainOfTable("THSD_SOURCE_TABLE", "THSD_TARGET_TABLE", true);
    }

    this.THSD_REMOVE_pressed = function () {
        this.changeContainOfTable("THSD_TARGET_TABLE", "THSD_SOURCE_TABLE", false);
    }
}

TopicsHandlingSubDialog.prototype = Object.create(BaseDialog.prototype);
TopicsHandlingSubDialog.prototype.constructor = TopicsHandlingSubDialog;


TopicsHandlingSubDialog.sourceTableColumnsStyle = [
    Constants.TABLECOLUMN_BOOL_EDIT,
    Constants.TABLECOLUMN_SINGLELINE,
    Constants.TABLECOLUMN_SINGLELINE,
    Constants.TABLECOLUMN_SINGLELINE,
    Constants.TABLECOLUMN_SINGLELINE

];
TopicsHandlingSubDialog.sourceTableColumnsHeader = [
    BaseDialog.getStringFromStringTable("MRP_TABLE_CHECK_COLUMN_TEXT", Context.getSelectedLanguage()),
    BaseDialog.getStringFromStringTable("MRP_TABLE_NAME_COLUMN_TEXT", Context.getSelectedLanguage()),
    BaseDialog.getStringFromStringTable("MRP_TABLE_FULL_NAME_COLUMN_TEXT", Context.getSelectedLanguage()),
    BaseDialog.getStringFromStringTable("MRP_TABLE_DESCRIPTION_COLUMN_TEXT", Context.getSelectedLanguage()),
    "GUID"
];
TopicsHandlingSubDialog.targetTableColumnsStyle = [
    Constants.TABLECOLUMN_BOOL_EDIT,
    Constants.TABLECOLUMN_SINGLELINE,
    Constants.TABLECOLUMN_SINGLELINE,
    Constants.TABLECOLUMN_MULTILINE_EDIT,
    Constants.TABLECOLUMN_SINGLELINE
];
TopicsHandlingSubDialog.targetTableColumnsHeader = [
    BaseDialog.getStringFromStringTable("MRP_TABLE_CHECK_COLUMN_TEXT", Context.getSelectedLanguage()),
    BaseDialog.getStringFromStringTable("MRP_TABLE_NAME_COLUMN_TEXT", Context.getSelectedLanguage()),
    BaseDialog.getStringFromStringTable("MRP_TABLE_FULL_NAME_COLUMN_TEXT", Context.getSelectedLanguage()),
    BaseDialog.getStringFromStringTable("MRP_TABLE_COMMENT_COLUMN_TEXT", Context.getSelectedLanguage()),
    "GUID"
];
TopicsHandlingSubDialog.sourceTableStyle = Constants.TABLE_STYLE_SORTED;
TopicsHandlingSubDialog.targetTableStyle = Constants.TABLE_STYLE_HEIGHT_2X | Constants.TABLE_STYLE_SORTED | Constants.TABLE_STYLE_ALLROWSSAMEHEIGHT | Constants.TABLE_STYLE_SORTED;

TopicsHandlingSubDialog.createSourceTableRow = function (object, locale) {

    var objectName = BaseDialog.getMaintainedObjectName(object,locale);
    var objectFullName = BaseDialog.getMaintainedObjectAttribute(object,Constants.AT_NAME_FULL,locale);
    var objectDescription = BaseDialog.getMaintainedObjectAttribute(object,Constants.AT_DESC,locale);
    var objectGUID = object.GUID();

    return [false, objectName, objectFullName, objectDescription, objectGUID];


}

TopicsHandlingSubDialog.prototype.createPage = function () {

    var page = Dialogs.createNewDialogTemplate(BaseDialog.templateWidth, BaseDialog.templateHeight, "Topics");
    page.Text(20, 18, 200, 20, BaseDialog.getStringFromStringTable("SHSD_NAME_LABEL", this.locale), "SURNAME_LABEL"); //Name of Managmeent system
    page.TextBox(20, 30, 450, 20, "THSD_SEARCH_BOX");
    page.Table(20, 110, 540, 260, TopicsHandlingSubDialog.sourceTableColumnsHeader, TopicsHandlingSubDialog.sourceTableColumnsStyle,
        [10, 34, 27, 28, 1], "THSD_SOURCE_TABLE", TopicsHandlingSubDialog.sourceTableStyle);
    page.PushButton(20, 380, 130, 20, BaseDialog.getStringFromStringTable("SHSD_SELECT_ALL_SOURCE", this.locale), "THSD_SELECT_ALL_SOURCE");
    page.PushButton(170, 380, 130, 20, BaseDialog.getStringFromStringTable("SHSD_SELECT_NONE_SOURCE", this.locale), "THSD_SELECT_NONE_SOURCE");

    page.Table(770, 110, 540, 260, TopicsHandlingSubDialog.targetTableColumnsHeader, TopicsHandlingSubDialog.targetTableColumnsStyle,
        [10, 14, 25, 50, 1], "THSD_TARGET_TABLE", TopicsHandlingSubDialog.targetTableStyle);
    page.PushButton(770, 380, 130, 20, BaseDialog.getStringFromStringTable("SHSD_SELECT_ALL_SOURCE", this.locale), "THSD_SELECT_ALL_TARGET");
    page.PushButton(910, 380, 130, 20, BaseDialog.getStringFromStringTable("SHSD_SELECT_NONE_SOURCE", this.locale), "THSD_SELECT_NONE_TARGET");

    page.PushButton(605, 105, 130, 20, BaseDialog.getStringFromStringTable("SHSD_ADD_BUTTON_TEXT", this.locale), "THSD_ADD");
    page.PushButton(605, 130, 130, 20, BaseDialog.getStringFromStringTable("SHSD_REMOVE_BUTTON_TEXT", this.locale), "THSD_REMOVE");

    page.Text(20, 420, 450, 40, BaseDialog.getStringFromStringTable("SEARCHING_PATTERN_LABEL", this.locale), "SEARCHING_PATTERN_LABEL");
    return page;
}

TopicsHandlingSubDialog.prototype.getSourceElements = function () {
    var those = this;
    return this.currentTopics.values().toArray()
        .filter(function (row) {
            var isInFad = those.fadStoredTopics.some(function (occurrence) {
                return occurrence.ObjDef().GUID().indexOf(row[BaseDialog.TOPIC_GUID_INDEX]) === 0;
            })
            return !isInFad;
        })
        .reduce(function (sources, row) {
            sources.push(row)
            return sources;
        }, []);
}

TopicsHandlingSubDialog.prototype.getTargetElements = function () {

    var those = this;
    return this.currentTopics.values().toArray()
        .filter(function (row) {
            return those.fadStoredTopics.some(function (occurrence) {
                return occurrence.ObjDef().GUID().indexOf(row[BaseDialog.TOPIC_GUID_INDEX]) === 0;
            });
        })
        .reduce(function (sources, row) {

            var commentary = those.getCommentary(row[BaseDialog.TOPIC_GUID_INDEX]);
            row.splice(3, 1, commentary);
            sources.push(row)
            return sources;
        }, []);
}

TopicsHandlingSubDialog.prototype.insertIntoSourceTable = function (elements, sourceTable, targetTable) {

    if (elements === null) elements = this.getSourceElements();

    var targets = targetTable.getItems();
    var sources = elements.reduce(function (array, item) {

        var itemLength = item.length;
        var isContained = targets.some(function (targetItem) {
            var length = targetItem.length;
            return item[itemLength - 1].equals(targetItem[length - 1]);
        });
        if (isContained === true) return array;
        array.push(item)
        return array;
    }, []);

    sourceTable.setItems(sources);

}


TopicsHandlingSubDialog.prototype.getCommentary = function (guid) {

    var occurrences = this.fadStoredTopics.filter(function (occurrence) {
        return occurrence.ObjDef().GUID().equals(guid);
    });

    if (BaseDialog.isNullOrEmpty(occurrences)) return "";
    return this.getConnectionReason(occurrences[0].Cxns(), this.reasonConnectionType, this.reasonConnectionAttribute, this.locale);
}


TopicsHandlingSubDialog.prototype.changeContainOfTable = function (sourceIdentifier, targetIdentifier, isAdd) {


    var those = this;
    var sourceTable = this.getPageElement(0, sourceIdentifier);
    var targetTable = this.getPageElement(0, targetIdentifier);

    if (sourceTable === null || targetTable === null) return;

    var result = targetTable.getItems();
    var sources = sourceTable.getItems();
    var targets = targetTable.getItems();


    var remains = sources.filter(BaseDialog.isNotChecked);
    var selected = sources.filter(BaseDialog.isChecked);

    var subResult = selected.filter(function (source) {
        var sourceGuid = source[source.length - 1].toLowerCase();
        var sameTargets = targets.filter(function (target) {
            var targetGuid = target[target.length - 1].toLowerCase();
            return targetGuid.localeCompare(sourceGuid) === 0;
        });

        return sameTargets.length === 0;
    }).reduce(function (subResult, row) {

        if (isAdd) {
            row.splice(3, 1, "");
        } else {
            var commentary = BaseDialog.getDescription(row[BaseDialog.TOPIC_GUID_INDEX],those.locale);
            row.splice(3, 1, commentary);
        }
        subResult.push(row);

        return subResult;
    }, []);

    result.push.apply(result, subResult);
    targetTable.setItems(result);
    sourceTable.setItems(remains);
    this.markAllItemsSelected(0, targetIdentifier,0, false);

}

TopicsHandlingSubDialog.prototype.buildSearchingContext = function () {
    var iterator = this.currentTopics.entrySet().iterator();
    while(iterator.hasNext()) {
        var topicEntry = iterator.next();
        var name = BaseDialog.getMaintainedObjectName(topicEntry.getKey(),this.locale);
        this.cache.put(name,topicEntry.getKey());
    }
}