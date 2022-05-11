function runEMAManagementSystemsDialog(storedManagementSystems, attributeManagementSystems, attributeManagementSystemsGuid, locale) {
    var dialogFunction = new EMA_ManagementSystemsDialog(storedManagementSystems, attributeManagementSystems, attributeManagementSystemsGuid, locale);
    return Dialogs.showDialog(dialogFunction, Constants.DIALOG_TYPE_ACTION, "");
}

EMA_ManagementSystemsDialog = function (storedManagementSystemsModel, attributeManagementSystems, attributeManagementSystemsGuid, locale) {


    this.storedManagementSystemsModel = storedManagementSystemsModel;
    this.attributeManagementSystems = attributeManagementSystems;
    this.attributeManagementSystemsGuid = attributeManagementSystemsGuid;
    this.currentManagementSystems = new Packages.java.util.HashMap();
    this.commentaryMap = new Packages.java.util.HashMap();
    this.locale = locale;
    this.searchingShortCutContext = new Packages.java.util.TreeMap();
    this.searchingFullNameContext = new Packages.java.util.TreeMap();

    this.dialogResult = {
        isOk: false,
        selection: []
    };

    this.sourceTableColumnsStyle = [
        Constants.TABLECOLUMN_BOOL_EDIT, Constants.TABLECOLUMN_SINGLELINE,
        Constants.TABLECOLUMN_SINGLELINE, Constants.TABLECOLUMN_SINGLELINE,Constants.TABLECOLUMN_SINGLELINE

    ];

    this.sourceTableColumnsHeader = [
        getString("DLG_CHECK"), getString("DLG_NAME"),
        getString("DLG_TABLE_FULL_NAME"), getString("DLG_TABLE_DESCRIPTION"),getString("DLG_TALE_GUID")
    ];

    this.targetTableColumnsStyle = [
        Constants.TABLECOLUMN_BOOL_EDIT, Constants.TABLECOLUMN_SINGLELINE,
        Constants.TABLECOLUMN_SINGLELINE, Constants.TABLECOLUMN_MULTILINE_EDIT,
        Constants.TABLECOLUMN_SINGLELINE
    ];

    this.targetTableColumnsHeader = [
        getString("DLG_CHECK"), getString("DLG_NAME"),
        getString("DLG_TABLE_FULL_NAME"), getString("DLG_TABLE_REASON"),
        getString("DLG_TALE_GUID")
    ];

    this.sourceTableStyle = Constants.TABLE_STYLE_SORTED;
    this.targetTableStyle = Constants.TABLE_STYLE_HEIGHT_2X | Constants.TABLE_STYLE_SORTED |
        Constants.TABLE_STYLE_ALLROWSSAMEHEIGHT | Constants.TABLE_STYLE_SORTED;


    this.getPages = function () {

        var page = Dialogs.createNewDialogTemplate(0, 0, 960, 80, "Table issue");
        page.Text(20, 18, 450, 20, getString("DLG_USR_1"), "FULL_NAME_LABEL"); //Name of Managmeent system
        page.TextBox(20, 30, 450, 20, "FULL_NAME_TEXT_BOX");
        page.Text(550, 18, 450, 20, getString("DLG_MNGMT_SHORT"), "SHORTCUT_LABEL"); //Shortcut
        page.TextBox(550, 30, 450, 20, "SHORTCUT_TEXT_BOX");

        page.Table(20, 110, 540, 260, this.sourceTableColumnsHeader, this.sourceTableColumnsStyle,
            [10, 29, 30,30, 1], "S_TABLE", this.sourceTableStyle);

        page.PushButton(20, 380, 130, 20, getString("DLG_USR_SEL_ALL"), "SELECT_ALLS");
        page.PushButton(170, 380, 130, 20, getString("DLG_USR_SEL_NONE"), "SELECT_NONES");

        page.PushButton(605, 105, 130, 20, getString("DLG_USR_ADD"), "ADD");
        page.PushButton(605, 130, 130, 20, getString("DLG_USR_REMOVE"), "REMOVE");


        page.Table(770, 110, 540, 260, this.targetTableColumnsHeader, this.targetTableColumnsStyle,
            [10, 19, 25, 45, 1], "T_TABLE", this.targetTableStyle);

        page.PushButton(770, 380, 130, 20, getString("DLG_USR_SEL_ALL"), "SELECT_ALLT");
        page.PushButton(910, 380, 130, 20, getString("DLG_USR_SEL_NONE"), "SELECT_NONET");

        page.Text(20, 320, 450, 40, getString("DLG_USR_4"), "SEARCHING_PATTERN_LABEL");
        return [page];
    }

    this.init = function () {

        if (this.storedManagementSystemsModel == null || !this.storedManagementSystemsModel.IsValid()) return;


        var modelsManagementSystems = this.storedManagementSystemsModel.ObjOccListFilter([Constants.OT_KNWLDG_CAT]);
        var those = this;
        modelsManagementSystems.forEach(function (managementSystem) {

            var systemName = managementSystem.ObjDef().Name(those.locale);
            var systemFullName = managementSystem.ObjDef().Attribute(Constants.AT_NAME_FULL, those.locale).getValue();
            var description = managementSystem.ObjDef().Attribute(Constants.AT_DESC, those.locale).IsMaintained() ?managementSystem.ObjDef().Attribute(Constants.AT_DESC, those.locale).getValue() : " ";
            those.currentManagementSystems.put(managementSystem.ObjDef(),
                [false, systemName, systemFullName,description, managementSystem.ObjDef().GUID()]);

        });

        this.attributeManagementSystems.split(";").forEach(function (system) {
            var tuple = system.split("|");
            those.commentaryMap.put(tuple[0], tuple[1]);
        });


        var sourceTable = this.getPageElement(0, "S_TABLE");
        var targetTable = this.getPageElement(0, "T_TABLE");
        sourceTable.setItems(this.getSources());
        targetTable.setItems(this.getTargets());

        this.buildShortCutSearchingContext();
        this.buildFullNameSearchingContext();

    }

    this.isInValidState = function (pageNumber) {

        var targetTable = this.getPageElement(pageNumber, "T_TABLE");
        var sourceTable = this.getPageElement(pageNumber, "S_TABLE");
        var addButton = this.getPageElement(pageNumber, "ADD");
        var removeButton = this.getPageElement(pageNumber, "REMOVE");


        if (targetTable === null || addButton === null || removeButton === null) return true;

        var isSourceSelected = sourceTable.getItems().some(EMA_Helper.isChecked);
        var isTargetSelected = targetTable.getItems().some(EMA_Helper.isChecked);

        if (isSourceSelected) addButton.setEnabled(true);
        else addButton.setEnabled(false);
        if (isTargetSelected) removeButton.setEnabled(true);
        else removeButton.setEnabled(false);

        var length = targetTable.getItems().length;
        var noChanged = false;
        if (length === this.attributeManagementSystemsGuid.split(";").length) {

            var targets = targetTable.getItems();
            targets.sort(EMA_Helper.accountNameSort)
            noChanged = this.attributeManagementSystems.split(";")
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

        if (length === 0 && this.attributeManagementSystemsGuid.length === 0 ) return false;
        var isFilled = targetTable.getItems().every(function (row) {
            var commentary = row[3];
            
            return commentary !== null && " ".localeCompare(commentary) !== 0 && commentary.length > 0;
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

    this.SHORTCUT_TEXT_BOX_changed = function () {

        var sourceTable = this.getPageElement(0, "S_TABLE");
        var targetTable = this.getPageElement(0, "T_TABLE");
        var shortCutTextBox = this.getPageElement(0, "SHORTCUT_TEXT_BOX");


        if (sourceTable === null || targetTable === null || shortCutTextBox === null) return;
        this.search(shortCutTextBox.getText(), this.searchingFullNameContext);

    }

    this.FULL_NAME_TEXT_BOX_changed = function () {


        var sourceTable = this.getPageElement(0, "S_TABLE");
        var targetTable = this.getPageElement(0, "T_TABLE");
        var fullNameTextBox = this.getPageElement(0, "FULL_NAME_TEXT_BOX");


        if (sourceTable === null || targetTable === null || fullNameTextBox === null) return;
        this.search(fullNameTextBox.getText(), this.searchingShortCutContext);
    }

}

EMA_ManagementSystemsDialog.prototype.getSources = function () {

    var those = this;
    return this.currentManagementSystems.values().toArray()
        .filter(function (row) {
            return !those.attributeManagementSystemsGuid.includes(row[4]);
        })
        .reduce(function (sources, row) {
            sources.push(row);
            return sources;
        }, []);
}

EMA_ManagementSystemsDialog.prototype.getTargets = function () {


    var those = this;
    return this.currentManagementSystems.values().toArray()
        .filter(function (row) {
            return those.attributeManagementSystemsGuid.includes(row[4]);
        })
        .reduce(function (targets, row) {
            var commentary = those.commentaryMap.get(row[1]);
            if (commentary === null)  commentary = "";
            targets.push([false,row[1],row[2],commentary,row[4]]);
            return targets;
        }, []);
}

EMA_ManagementSystemsDialog.prototype.changeContainOfTable = function (sourceElementIdentifier, targetElementIdentifier,isAdd) {

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
            subResult.push([row[0],row[1],row[2]," ",row[4]]);
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

EMA_ManagementSystemsDialog.prototype.getPageElement = function (pageNumber, elementIdentifier) {

    var page = this.dialog.getPage(pageNumber);
    if (page === null) return null;

    return page.getDialogElement(elementIdentifier);
};

EMA_ManagementSystemsDialog.prototype.markAllItemsSelected = function (pageNumber, elementIdentifier, state) {

    var table = this.getPageElement(pageNumber, elementIdentifier);
    if (table === null) return false;

    var rows = table.getItems();

    rows.forEach(function (row) {
        row[0] = state
    });

    table.setItems(rows);
}

EMA_ManagementSystemsDialog.prototype.buildShortCutSearchingContext = function () {
    var iterator = this.currentManagementSystems.entrySet().iterator();
    while (iterator.hasNext()) {
        var managementSystemEntry = iterator.next();
        this.searchingShortCutContext.put(managementSystemEntry.getKey().Name(this.locale), managementSystemEntry.getKey())
    }
}

EMA_ManagementSystemsDialog.prototype.buildFullNameSearchingContext = function () {
    var iterator = this.currentManagementSystems.entrySet().iterator();
    while (iterator.hasNext()) {
        var managementSystemEntry = iterator.next();
        this.searchingFullNameContext.put(managementSystemEntry.getKey().Attribute(Constants.AT_NAME_FULL, this.locale).getValue(), managementSystemEntry.getKey())
    }
}

EMA_ManagementSystemsDialog.prototype.search = function (text, searchingContext) {


    var sourceTable = this.getPageElement(0, "S_TABLE");
    var targetTable = this.getPageElement(0, "T_TABLE");

    var result = [];
    var length = text.length();
    var those = this;
    if (length > 0) {

        var founded = EMA_Helper.findItemByText(text, searchingContext);
        result = founded.reduce(function (sources, item) {

            var name = item.Name(those.locale);
            var fullName = item.Attribute(Constants.AT_NAME_FULL, those.locale).getValue();
            var description = item.Attribute(Constants.AT_DESC, those.locale).getValue()
            sources.push([false, name, fullName,description, item.GUID()])
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

EMA_ManagementSystemsDialog.prototype.findDescription = function(guid) {
    var object = ArisData.getActiveDatabase().FindGUID(guid,Constants.CID_OBJDEF);
    if (object.IsValid()) {
        return object.Attribute(Constants.AT_DESC,this.locale).getValue();
    }
    return ""
}

