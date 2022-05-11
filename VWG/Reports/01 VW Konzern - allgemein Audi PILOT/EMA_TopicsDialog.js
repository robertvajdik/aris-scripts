function runEMATopicsDialog(storedTopics, attributeTopics, attributeTopicsGuid, locale) {
    var dialogFunction = new EMA_TopicsDialog(storedTopics, attributeTopics, attributeTopicsGuid, locale);
    return Dialogs.showDialog(dialogFunction, Constants.DIALOG_TYPE_ACTION, "");
}

function EMA_TopicsDialog(storedTopics, attributeTopics, attributeTopicsGuid, locale) {

    this.storedTopicsModel = storedTopics;
    this.attributeTopics = attributeTopics;
    this.attributeTopicsGuid = attributeTopicsGuid;
    this.currentTopics = new Packages.java.util.HashMap();
    this.commentaryMap = new Packages.java.util.HashMap();
    this.searchingContext = new Packages.java.util.TreeMap();
    this.cannotCreateObjDef = false;
    this.locale = locale;

    this.dialogResult = {
        isOk: false,
        selection: []
    };

    this.sourceTableColumnsStyle = [
        Constants.TABLECOLUMN_BOOL_EDIT, Constants.TABLECOLUMN_SINGLELINE,
        Constants.TABLECOLUMN_SINGLELINE, Constants.TABLECOLUMN_SINGLELINE,
        Constants.TABLECOLUMN_SINGLELINE

    ];

    this.sourceTableColumnsHeader = [
        getString("DLG_CHECK"), getString("DLG_NAME_2"),
        getString("DLG_TABLE_FULL_NAME"), getString("DLG_TABLE_DESCRIPTION"),
       getString("DLG_TALE_GUID")
    ];

    this.targetTableColumnsStyle = [
        Constants.TABLECOLUMN_BOOL_EDIT, Constants.TABLECOLUMN_SINGLELINE,
        Constants.TABLECOLUMN_SINGLELINE, Constants.TABLECOLUMN_MULTILINE_EDIT,
        Constants.TABLECOLUMN_SINGLELINE
    ];

    this.targetTableColumnsHeader = [
        getString("DLG_CHECK"), getString("DLG_NAME_2"),
        getString("DLG_TABLE_FULL_NAME"), getString("DLG_TABLE_REASON"),
        getString("DLG_TALE_GUID")
    ];

    this.sourceTableStyle = Constants.TABLE_STYLE_SORTED;
    this.targetTableStyle = Constants.TABLE_STYLE_HEIGHT_2X | Constants.TABLE_STYLE_SORTED |
        Constants.TABLE_STYLE_ALLROWSSAMEHEIGHT | Constants.TABLE_STYLE_SORTED;

    this.getPages = function () {

        var page = Dialogs.createNewDialogTemplate(0, 0, 960, 80, "Table issue");
        page.Text(20, 18, 200, 20, getString("DLG_USR_11"), "SURNAME_LABEL"); //Name of Managmeent system
        page.TextBox(20, 30, 450, 20, "SEARCH");

        page.PushButton(550, 29, 130, 20, getString("DLG_BUTTON_NEW_TOPIC"), "NEW_TOPIC_BUTTON");

        page.Table(20, 110, 540, 260, this.sourceTableColumnsHeader, this.sourceTableColumnsStyle,
            [10, 34, 27,28, 1], "S_TABLE", this.sourceTableStyle);
        page.PushButton(20, 380, 130, 20, getString("DLG_USR_SEL_ALL"), "SELECT_ALLS");
        page.PushButton(170, 380, 130, 20, getString("DLG_USR_SEL_NONE"), "SELECT_NONES");

        page.Table(770, 110, 540, 260, this.targetTableColumnsHeader, this.targetTableColumnsStyle,
            [10, 14, 25, 50, 1], "T_TABLE", this.targetTableStyle);
        page.PushButton(770, 380, 130, 20, getString("DLG_USR_SEL_ALL"), "SELECT_ALLT");
        page.PushButton(910, 380, 130, 20, getString("DLG_USR_SEL_NONE"), "SELECT_NONET");

        page.PushButton(605, 105, 130, 20, getString("DLG_USR_ADD"), "ADD");
        page.PushButton(605, 130, 130, 20, getString("DLG_USR_REMOVE"), "REMOVE");


        page.Text(20, 320, 450, 40, getString("DLG_USR_4"), "SEARCHING_PATTERN_LABEL");
        return [page];

    }

    this.init = function (pages) {

        if (this.storedTopicsModel === null || !this.storedTopicsModel.IsValid()) return;

        var modelsTopics = this.storedTopicsModel.ObjOccListFilter([Constants.OT_TECH_TRM]);
        var those = this;
        modelsTopics.forEach(function (topic) {

            var topicName = topic.ObjDef().Name(those.locale);
            var topicFullName = topic.ObjDef().Attribute(Constants.AT_NAME_FULL, those.locale).getValue()
            var topicDescription = topic.ObjDef().Attribute(Constants.AT_DESC, those.locale).getValue();
            those.currentTopics.put(topic.ObjDef(),
                [false, topicName, topicFullName, topicDescription, topic.ObjDef().GUID()]);
        });


        this.attributeTopics.split(";").forEach(function (topic) {
            var tuple = topic.split("|");
            those.commentaryMap.put(tuple[0], tuple[1]);
        });

        var sourceTable = this.getPageElement(0, "S_TABLE");
        var targetTable = this.getPageElement(0, "T_TABLE");

        sourceTable.setItems(this.getSources());
        targetTable.setItems(this.getTargets());

        this.buildSearchingContext();
        this.getPageElement(0, "NEW_TOPIC_BUTTON").setVisible(false);
    }

    this.isInValidState = function (pageNumber) {

        var targetTable = this.getPageElement(pageNumber, "T_TABLE");
        var sourceTable = this.getPageElement(pageNumber, "S_TABLE");
        var addButton = this.getPageElement(pageNumber, "ADD");
        var removeButton = this.getPageElement(pageNumber, "REMOVE");

        if(this.cannotCreateObjDef === true) {
            var message = "Lieber ARIS-User, \n" +
                "leider besitzen sie nicht die Rechte, um ein neues Thema anzulegen. Zu diesem Zweck kontaktieren sie bitte das „Zentralbereich Prozessmanagement, I/SO-3\". \n" +
                "Vielen Dank!";

            var message2 = "Lieber ARIS-User, \n" +
                "leider besitzen sie nicht die Rechte, um ein neues Thema anzulegen. Zu diesem Zweck kontaktieren sie bitte das „Zentralbereich Prozessmanagement\". \n" +
                "Vielen Dank!";

            if(CorpKey.equals("0200")) this.dialog.setMsgBox("WARNING", message, Constants.MSGBOX_BTN_OK | Constants.MSGBOX_ICON_WARNING, "False Rechte");
            else this.dialog.setMsgBox("WARNING", message2, Constants.MSGBOX_BTN_OK | Constants.MSGBOX_ICON_WARNING, "False Rechte");
            this.cannotCreateObjDef = false;
        }

        if (targetTable === null || addButton === null || removeButton === null) return true;

        var isSourceSelected = sourceTable.getItems().some(EMA_Helper.isChecked);
        var isTargetSelected = targetTable.getItems().some(EMA_Helper.isChecked);

        if (isSourceSelected) addButton.setEnabled(true);
        else addButton.setEnabled(false);
        if (isTargetSelected) removeButton.setEnabled(true);
        else removeButton.setEnabled(false);

        var length = targetTable.getItems().length;
        var noChanged = false;
        var those = this;
        if (length === this.attributeTopics.split(";").length) {

            var targets = targetTable.getItems()
                .sort(EMA_Helper.accountNameSort)

            noChanged = this.attributeTopics.split(";")
                .sort(EMA_Helper.systemNameSort)
                .map(function (item, index) {
                    var system = item.split("|")[0];
                    var commentary = item.split("|")[1];

                    if (commentary === undefined)  return false;
                    return system.localeCompare(targets[index][1]) === 0 &&
                        commentary.localeCompare(targets[index][3]) === 0
                })
                .reduce(function (previous, current) {
                    return previous && current
                }, true);
        }


        if (length === 0 && this.attributeTopicsGuid.length === 0 ) return false;

        var isFilled = targetTable.getItems().every(function (row) {
            var commentary = row[3];
            return commentary !== null && commentary.length > 0;
        });
        return (isFilled && (noChanged === false));
    }


    this.onClose = function (pageNumber, bOk) {

        var targetTable = this.getPageElement(0, "T_TABLE");

        this.dialogResult.isOk = bOk;
        this.dialogResult.selection.push.apply(this.dialogResult.selection, targetTable.getItems());
    }

    this.getResult = function () {
        return this.dialogResult;
    }

    this.SELECT_ALLS_pressed = function () {
        this.markAllItemsSelected(0, "S_TABLE", true);
    }

    this.SELECT_NONES_pressed = function () {
        this.markAllItemsSelected(0, "S_TABLE", false);
    }

    this.SELECT_ALLT_pressed = function () {
        this.markAllItemsSelected(0, "T_TABLE", true);
    }

    this.SELECT_NONET_pressed = function () {
        this.markAllItemsSelected(0, "T_TABLE", false);
    }

    this.ADD_pressed = function () {
        this.changeContainOfTable("S_TABLE", "T_TABLE",true);
    }

    this.REMOVE_pressed = function () {
        this.changeContainOfTable("T_TABLE", "S_TABLE",false);
    }

    this.SEARCH_changed = function() {

        var sourceTable = this.getPageElement(0, "S_TABLE");
        var targetTable = this.getPageElement(0, "T_TABLE");
        var searchTextBox = this.getPageElement(0, "SEARCH");


        if (sourceTable === null || targetTable === null || searchTextBox === null) return;
        this.search(searchTextBox.getText(), this.searchingContext);
    }

    this.NEW_TOPIC_BUTTON_pressed = function () {
        var dialogFunction = new EMA_NewTopicDialog(this.storedTopicsModel,this.locale);
        this.dialog.setSubDialog("NEWTOPICDIALOG", dialogFunction, Constants.DIALOG_TYPE_ACTION, getString("DLG_BUTTON_NEW_TOPIC"));
    }

    this.NEWTOPICDIALOG_subDialogClosed = function (subResult, bOk) {

        if (bOk) {

            var name = subResult.name;
            var description = subResult.description;
            var fullName = subResult.fullName;
            var group = this.storedTopicsModel.Group();
            try {
                var objDef = group.CreateObjDef(Constants.OT_TECH_TRM, name, this.locale);
                if (objDef.IsValid()) {
                    objDef.Attribute(Constants.AT_DESC, g_nLoc).setValue(description);
                    objDef.Attribute(Constants.AT_NAME_FULL,g_nLoc).setValue(fullName);
                    this.storedTopicsModel.createObjOcc(Constants.ST_TECH_TERM, objDef, 0, 0);
                    var sourceTable = this.getPageElement(0, "S_TABLE");
                    var sourceArray = sourceTable.getItems();
                    sourceArray.push([false, name, fullName,description, objDef.GUID()]);
                    this.currentTopics.put(objDef, [false, name, fullName, description, objDef.GUID()]);
                    this.buildSearchingContext();
                    sourceTable.setItems(sourceArray.sort(EMA_Helper.accountNameSort));
                    this.layoutModel();
                } else {
                    this.cannotCreateObjDef = true;

                }
            }
            catch(e) {
                this.cannotCreateObjDef = true;
            }

        }

    };
}

EMA_TopicsDialog.prototype.getPageElement = function (pageNumber, elementIdentifier) {

    var page = this.dialog.getPage(pageNumber);
    if (page === null) return null;

    return page.getDialogElement(elementIdentifier);
};

EMA_TopicsDialog.prototype.getSources = function () {

    var those = this;
    return this.currentTopics.values().toArray()
        .filter(function (row) {
            return !those.attributeTopicsGuid.includes(row[4])
        })
        .reduce(function (sources, row) {
            sources.push(row)
            return sources;
        }, []);
}

EMA_TopicsDialog.prototype.getTargets = function () {
    var those = this;

    return this.currentTopics.values().toArray()
        .filter(function (row) {
            return those.attributeTopicsGuid.includes(row[4]);
        })
        .reduce(function (targets, row) {

            var commentary = those.commentaryMap.get(row[1]);
            if (commentary === null)  commentary = "";

            targets.push([false,row[1],row[2],commentary,row[4]]);
            return targets;
        }, []);
}

EMA_TopicsDialog.prototype.buildSearchingContext = function () {
    var iterator = this.currentTopics.entrySet().iterator();
    while(iterator.hasNext()) {
        var topicEntry = iterator.next();
        this.searchingContext.put(topicEntry.getKey().Name(this.locale),topicEntry.getKey());
    }
}

EMA_TopicsDialog.prototype.markAllItemsSelected = function (pageNumber, elementIdentifier, state) {

    var table = this.getPageElement(pageNumber, elementIdentifier);
    if (table === null) return false;

    var rows = table.getItems();

    rows.forEach(function (row) {
        row[0] = state
    });

    table.setItems(rows);
}

EMA_TopicsDialog.prototype.changeContainOfTable = function (sourceElementIdentifier, targetElementIdentifier,isAdd) {

    var those = this;
    var sourceTable = this.getPageElement(0, sourceElementIdentifier);
    var targetTable = this.getPageElement(0, targetElementIdentifier);

    if (sourceTable === null || targetTable === null) return;

    var result = targetTable.getItems();
    var sources = sourceTable.getItems();
    var targets = targetTable.getItems();


    var remains = sources.filter(EMA_Helper.isNotChecked);
    var selected = sources.filter(EMA_Helper.isChecked)

    var subResult = selected.filter(function (source) {
        var sourceGuid = source[source.length - 1].toLowerCase();
        var sameTargets = targets.filter(function (target) {
            var targetGuid = target[target.length - 1].toLowerCase();
            return targetGuid.localeCompare(sourceGuid) === 0;
        });

        return sameTargets.length === 0;
    }).reduce(function (subResult, row) {

        if (isAdd) {
            subResult.push([row[0],row[1],row[2],"",row[4]]);
        }
        else {
            var description = those.findDescription(row[4]);
            subResult.push([row[0],row[1],row[2],description,row[4]]);
        }
        return subResult;
    }, []);

    result.push.apply(result, subResult);
    targetTable.setItems(result);
    sourceTable.setItems(remains);
    this.markAllItemsSelected(0, targetElementIdentifier, false);

}

EMA_TopicsDialog.prototype.search = function (text, searchingContext) {


    var sourceTable = this.getPageElement(0, "S_TABLE");
    var targetTable = this.getPageElement(0, "T_TABLE");

    var result;
    var length = text.length();
    var those = this;
    if (length > 0) {

        var founded = EMA_Helper.findItemByText(text, searchingContext);
        result = founded.reduce(function (sources, item) {

            var name = item.Name(those.locale);
            var description = item.Attribute(Constants.AT_DESC, those.locale).getValue();
            var fullName = item.Attribute(Constants.AT_NAME_FULL, those.locale).getValue();
            sources.push([false, name, fullName, description, item.GUID()]);
            return sources;
        }, []);

    } else {
        result = this.getSources();
    }

    result = result.reduce(function (result, item) {

        var isInTarger = targetTable.getItems().some(function (target) {
            return item[item.length - 1].localeCompare(target[target.length - 1]) === 0;
        })

        if (isInTarger === false) {
           result.push(item);
        }
        return result;
    }, []);

    sourceTable.setItems(result);
}

EMA_TopicsDialog.prototype.layoutModel = function() {

    var those = this;
    var objectOccList = this.storedTopicsModel.ObjOccList().sort(function(occurrenceA,occurrenceB) {
        var nameA = occurrenceA.ObjDef().Name(those.locale);
        var nameB = occurrenceB.ObjDef().Name(those.locale);
        return nameA.localeCompare(nameB);
    })

    var xCoordinate = 100;
    var yCoordinate = 0;

    objectOccList.forEach(function(occurrance,index){


        if (index % 10 === 0) { yCoordinate = yCoordinate + occurrance.Height() + 50; xCoordinate = 100; }
        else xCoordinate = xCoordinate + occurrance.Width() + 50;


        occurrance.SetPosition(xCoordinate,yCoordinate);
    });

}

EMA_TopicsDialog.prototype.findDescription = function(guid) {
    var object = ArisData.getActiveDatabase().FindGUID(guid,Constants.CID_OBJDEF);
    if (object.IsValid()) {
        return object.Attribute(Constants.AT_DESC,this.locale).getValue();
    }
    return ""
}