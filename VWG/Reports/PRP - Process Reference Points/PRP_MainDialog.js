function runMainDialog(object, assignedItems) {

    var locale = Context.getSelectedLanguage();
    var dialogFunction = new MainDialog(locale, object, assignedItems);
    return Dialogs.showDialog(dialogFunction, Constants.DIALOG_TYPE_PROPERTY,
        BaseDialog.getStringFromStringTable("COCKPIT_PROJECT_DIALOG_TITLE", locale));

}

MainDialog.prototype = Object.create(BaseDialog.prototype);
MainDialog.prototype.constructor = MainDialog;

MainDialog.processesOverviewPageNumber = 0;
MainDialog.locationSelectPageNumber = 1;
MainDialog.dataObjectSelectPageNumber = 2;
MainDialog.documentSelectPageNumber = 3;
MainDialog.itSystemSelectPageNumber = 4;
MainDialog.overviewSelectPageNumber = 5;

function MainDialog(locale, object, assignedItems) {

    this.object = object;
    this.locale = locale;
    this.assignedItems = assignedItems;
    this.prcocessesOverviewPage = new ProcessesOverviewPage(object, MainDialog.processesOverviewPageNumber, this.locale,
        this);
    this.locationSelectPage = new LocationSelectPage(MainDialog.locationSelectPageNumber, this.locale, this);
    this.dataObjectSelectPage = new DataObjectSelectPage(MainDialog.dataObjectSelectPageNumber, this.locale, this);
    this.documentSelectPage = new DocumentSelectPage(MainDialog.documentSelectPageNumber, this.locale, this);
    this.itSystemSelectPage = new ITSystemSelectPage(MainDialog.itSystemSelectPageNumber, this.locale, this);
    this.overviewSelectPage = new OverviewSelectPage(this.locationSelectPage, this.dataObjectSelectPage,
        this.itSystemSelectPage,
        this.documentSelectPage, assignedItems, MainDialog.overviewSelectPageNumber, this.locale, this);

    this.dialogResult = {
        isOk: false
    }

    this.init = function () {

        this.prcocessesOverviewPage.init();
        this.locationSelectPage.init();
        this.dataObjectSelectPage.init();
        this.documentSelectPage.init();
        this.itSystemSelectPage.init();
        this.overviewSelectPage.init();

    }

    this.getPages = function () {
        var pages = [];

        pages.push(this.prcocessesOverviewPage.createPage());
        pages.push(this.locationSelectPage.createPage());
        pages.push(this.dataObjectSelectPage.createPage());
        pages.push(this.documentSelectPage.createPage());
        pages.push(this.itSystemSelectPage.createPage());
        pages.push(this.overviewSelectPage.createPage());

        return pages;
    }

    this.getResult = function () {
        return this.dialogResult;
    }

    this.onClose = function (pageNumber, bOk) {
        this.dialogResult.isOk = bOk;
        this.dialogResult.assignedItems = this.overviewSelectPage.assignedItems;
        this.dialogResult.name = this.getPageElement(MainDialog.processesOverviewPageNumber, "POP_NAME_TEXT").getText();
        this.dialogResult.id = this.getPageElement(MainDialog.processesOverviewPageNumber, "POP_ID_TEXT").getText();
        this.dialogResult.story = this.getPageElement(MainDialog.processesOverviewPageNumber, "POP_STORY_TEXT").
            getText();
        this.dialogResult.precedingCompletionRate = this.prcocessesOverviewPage.selectedPrecedingCompletionRate;
        this.dialogResult.succeedingCompletionRate = this.prcocessesOverviewPage.selectedSucceedingCompletionRate;
        this.dialogResult.totalCompletionRate = this.prcocessesOverviewPage.totalCompletionRate;
    }

    this.isInValidState = function (pageNumber) {

        if (pageNumber === MainDialog.overviewSelectPageNumber) this.overviewSelectPage.isInValidState();
        if (pageNumber === MainDialog.locationSelectPageNumber) this.locationSelectPage.isInValidState();
        if (pageNumber === MainDialog.dataObjectSelectPageNumber) this.dataObjectSelectPage.isInValidState();
        if (pageNumber === MainDialog.itSystemSelectPageNumber) this.itSystemSelectPage.isInValidState();
        if (pageNumber === MainDialog.documentSelectPageNumber) this.documentSelectPage.isInValidState();
        return this.overviewSelectPage.isChanged() || this.prcocessesOverviewPage.isChanged();
    }

    this.canFinish = function (pageNumber) {

        var oldId = BaseDialog.getMaintainedObjectAttribute(this.object.ObjDef(), Constants.AT_ID, this.locale);
        var newId = this.getPageElement(MainDialog.processesOverviewPageNumber, "POP_ID_TEXT").getText();
        if (!oldId.equalsIgnoreCase(newId) && newId.length() > 0) {
            var activeDB = ArisData.getActiveDatabase();
            var sameObject = activeDB.Find(Constants.SEARCH_OBJDEF, this.object.ObjDef().TypeNum(), Constants.AT_ID,
                this.locale,
                newId, Constants.SEARCH_CMP_CASESENSITIVE | Constants.SEARCH_CMP_EQUAL);
            if (sameObject.length > 0) {
                var title = BaseDialog.getStringFromStringTable("MSG_BOX_TITLE",this.locale);
                var messageFormat = BaseDialog.getStringFromStringTable("MSG_BOX_FORMAT_MESSAGE",this.locale);
                var message = Packages.java.lang.String.format(messageFormat,newId);
                this.dialog.setMsgBox("ERROR_MSG_BOX", message, Constants.MSGBOX_BTN_OK | Constants.MSGBOX_ICON_ERROR , title )
                return false;
            }
        }
        return true;
    }

    this.onActivatePage = function (pageNumber) {
        if (pageNumber === MainDialog.overviewSelectPageNumber) this.overviewSelectPage.init();
    }

    this.POP_PRECEDING_COMPLETION_DROP_BOX_selChanged = function (selection) {
        try {
            this.prcocessesOverviewPage.completionPrecedingDropBoxChangeEvent(selection);

        } catch (ex) {
            writeLog(sm72tc, "Action POP_PRECEDING_COMPLETION_DROP_BOX_selChanged was running", "info");
            writeLog(sm72tc, "Exception: " + ex + " line number " + ex.lineNumber, "error");
        }
    }
    this.POP_SUCCEEDING_COMPLETION_DROP_BOX_selChanged = function (selection) {
        try {
            this.prcocessesOverviewPage.completionSucceedingDropBoxChangeEvent(selection);

        } catch (ex) {
            writeLog(sm72tc, "Action POP_SUCCEEDING_COMPLETION_DROP_BOX_selChanged was running", "info");
            writeLog(sm72tc, "Exception: " + ex + " line number " + ex.lineNumber, "error");
        }
    }

    this.LSP_TREE_BOX_selChanged = function (selection) {
        try {
            this.locationSelectPage.treeBoxChangeEvent(selection);

        } catch (ex) {
            writeLog(sm72tc, "Action LSP_TREE_BOX_selChanged was running", "info");
            writeLog(sm72tc, "Exception: " + ex + " line number " + ex.lineNumber, "error");
        }
    }
    this.LSP_ADD_BUTTON_pressed = function () {
        try {
            this.locationSelectPage.addButtonPressEvent();

        } catch (ex) {
            writeLog(sm72tc, "Action LSP_ADD_BUTTON_pressed was running", "info");
            writeLog(sm72tc, "Exception: " + ex + " line number " + ex.lineNumber, "error");
        }
    }
    this.LSP_REMOVE_BUTTON_pressed = function () {
        try {
            this.locationSelectPage.removeButtonPressEvent();

        } catch (ex) {
            writeLog(sm72tc, "Action LSP_REMOVE_BUTTON_pressed was running", "info");
            writeLog(sm72tc, "Exception: " + ex + " line number " + ex.lineNumber, "error");
        }
    }
    this.LSP_SEARCH_TEXT_BOX_changed = function () {

        try {
            this.locationSelectPage.searchTexBoxChangeEvent();

        } catch (ex) {
            writeLog(sm72tc, "Action LSP_SEARCH_TEXT_BOX_changed was running", "info");
            writeLog(sm72tc, "Exception: " + ex + " line number " + ex.lineNumber, "error");
        }
    }

    this.DOS_TREE_BOX_selChanged = function (selection) {
        try {
            this.dataObjectSelectPage.treeBoxChangeEvent(selection);

        } catch (ex) {
            writeLog(sm72tc, "Action DOS_TREE_BOX_selChanged was running", "info");
            writeLog(sm72tc, "Exception: " + ex + " line number " + ex.lineNumber, "error");
        }
    }
    this.DOS_ADD_BUTTON_pressed = function () {
        try {
            this.dataObjectSelectPage.addButtonPressEvent();

        } catch (ex) {
            writeLog(sm72tc, "Action DOS_ADD_BUTTON_pressed was running", "info");
            writeLog(sm72tc, "Exception: " + ex + " line number " + ex.lineNumber, "error");
        }
    }
    this.DOS_EDIT_BUTTON_pressed = function () {

        try {
            var object = this.dataObjectSelectPage.getSelectedObject();
            if (object === null) return false;
            var dialogFunction = new ERMObjectEditSubDialog(object.object, this.locale, true);
            this.dialog.setSubDialog("DOS_SUBDIALOG", dialogFunction, Constants.DIALOG_TYPE_ACTION,
                BaseDialog.getStringFromStringTable("DOS_HANDLING_DIALOG_EDIT_TITLE", this.locale)); //DOS_HANDLING_DIALOG_EDIT_TITLE

        } catch (ex) {
            writeLog(sm72tc, "Action DOS_EDIT_BUTTON_pressed was running", "info");
            writeLog(sm72tc, "Exception: " + ex + " line number " + ex.lineNumber, "error");
        }
    }
    this.DOS_NEW_BUTTON_pressed = function () {
        try {
            var dialogFunction = new ERMObjectEditSubDialog(null, this.locale, false);
            this.dialog.setSubDialog("DOS_SUBDIALOG", dialogFunction, Constants.DIALOG_TYPE_ACTION,
                BaseDialog.getStringFromStringTable("DOS_HANDLING_DIALOG_NEW_TITLE", this.locale)); //DOS_HANDLING_DIALOG_NEW_TITLE

        } catch (ex) {
            writeLog(sm72tc, "Event DOS_NEW_BUTTON_pressed", "info");
            writeLog(sm72tc, "Exception occurred " + ex, "error");
            throw ex;
        }
    }
    this.DOS_REMOVE_BUTTON_pressed = function () {
        try {
            this.dataObjectSelectPage.removeButtonPressEvent();

        } catch (ex) {
            writeLog(sm72tc, "Action DOS_REMOVE_BUTTON_pressed was running", "info");
            writeLog(sm72tc, "Exception: " + ex + " line number " + ex.lineNumber, "error");
        }
    }
    this.DOS_SEARCH_TEXT_BOX_changed = function () {

        try {
            this.dataObjectSelectPage.searchTexBoxChangeEvent();

        } catch (ex) {
            writeLog(sm72tc, "Action DOS_SEARCH_TEXT_BOX_changed was running", "info");
            writeLog(sm72tc, "Exception: " + ex + " line number " + ex.lineNumber, "error");
        }
    }
    this.DOS_SUBDIALOG_subDialogClosed = function (subResult, bOk) {

        var group;
        var locale = this.locale;
        try {
            if (!bOk) return false;

            var object = subResult.object;
            if (subResult.isEdit) {
                subResult.object.Attribute(Constants.AT_NAME, this.locale).setValue(subResult.newName);
                subResult.object.Attribute(Constants.AT_DESC, this.locale).setValue(subResult.newDescription);

            } else {

                group = ArisData.getActiveDatabase().FindGUID(PRP_Constants.dataObjectFolder, Constants.CID_GROUP);
                var validGroup;

                var firstLetter = subResult.newName.substring(0, 1).toUpperCase();

                var groups = group.Childs().filter(function (group) {
                    var name = BaseDialog.getMaintainedObjectName(group, locale);
                    return name.startsWith(firstLetter);
                });
                if (groups.length > 0) {
                    validGroup = groups[0];
                } else {
                    validGroup = group.CreateChildGroup(firstLetter, this.locale);
                }


                if (BaseDialog.isArisObjectNullOrInvalid(validGroup)) return false;

                var newObject = validGroup.GetOrCreateObjDef(PRP_Constants.TOGAF_DATA_OBJECT_TYPE, 2, subResult.newName,
                    this.locale);
                if (BaseDialog.isArisObjectNullOrInvalid(newObject)) return false;

                if (!BaseDialog.isNullOrEmpty(subResult.newDescription)) {
                    newObject.Attribute(Constants.AT_DESC, this.locale).setValue(subResult.newDescription);
                }
                object = newObject;


            }

            var assignedModels = object.AssignedModels(PRP_Constants.IE_DATA_MODEL_TYPE);
            var assignedModel;
            if (BaseDialog.isNullOrEmpty(assignedModels)) {

                var objectName = BaseDialog.getMaintainedObjectName(object, locale);
                group = object.Group();
                assignedModel = group.CreateModel(PRP_Constants.IE_DATA_MODEL_TYPE, objectName, locale);
                object.CreateAssignment(assignedModel, true);
            } else {
                assignedModel = assignedModels[0];
            }
            var dataModelManager = new DataModelManager(assignedModel, object, this.locale);
            dataModelManager.update(subResult.assignedERMAttributes);

        } catch (ex) {
            writeLog(sm72tc, "Action DOS_SUBDIALOG_subDialogClosed was running", "info");
            writeLog(sm72tc, "Exception: " + ex + " line number " + ex.lineNumber, "error");
        } finally {
            this.reloadPage(MainDialog.dataObjectSelectPageNumber);
            if (bOk && !subResult.isEdit) {
                var searchBox = this.getPageElement(MainDialog.dataObjectSelectPageNumber, "DOS_SEARCH_TEXT_BOX");
                writeLog(sm72tc, "SearchBox " + searchBox, "info");
                searchBox.setText(object.Name(this.locale));
                this.dataObjectSelectPage.searchTexBoxChangeEvent();
            }
        }
    }

    this.ITS_TREE_BOX_selChanged = function (selection) {
        try {
            this.itSystemSelectPage.treeBoxChangeEvent(selection);

        } catch (ex) {
            writeLog(sm72tc, "Action ITS_TREE_BOX_selChanged was running", "info");
            writeLog(sm72tc, "Exception: " + ex + " line number " + ex.lineNumber, "error");
        }
    }
    this.ITS_ADD_BUTTON_pressed = function () {
        try {
            this.itSystemSelectPage.addButtonPressEvent();

        } catch (ex) {
            writeLog(sm72tc, "Action ITS_ADD_BUTTON_pressed was running", "info");
            writeLog(sm72tc, "Exception: " + ex + " line number " + ex.lineNumber, "error");
        }
    }
    this.ITS_REMOVE_BUTTON_pressed = function () {
        try {
            this.itSystemSelectPage.removeButtonPressEvent();

        } catch (ex) {
            writeLog(sm72tc, "Action ITS_REMOVE_BUTTON_pressed was running", "info");
            writeLog(sm72tc, "Exception: " + ex + " line number " + ex.lineNumber, "error");
        }
    }
    this.ITS_SEARCH_TEXT_BOX_changed = function () {

        try {
            this.itSystemSelectPage.searchTexBoxChangeEvent();

        } catch (ex) {
            writeLog(sm72tc, "Action ITS_SEARCH_TEXT_BOX_changed was running", "info");
            writeLog(sm72tc, "Exception: " + ex + " line number " + ex.lineNumber, "error");
        }
    }

    this.OVS_ADD_PUSH_BUTTON_pressed = function () {

        try {
            this.overviewSelectPage.addButtonPressEvent();

        } catch (ex) {
            writeLog(sm72tc, "Action OVS_ADD_PUSH_BUTTON_pressed was running", "info");
            writeLog(sm72tc, "Exception: " + ex + " line number " + ex.lineNumber, "error");
        }
    }
    this.OVS_REMOVE_PUSH_BUTTON_pressed = function () {

        writeLog(sm72tc, "Action OVS_REMOVE_PUSH_BUTTON_pressed was running", "info");

        try {
            this.overviewSelectPage.removeButtonPressEvent();

        } catch (ex) {
            writeLog(sm72tc, "Action OVS_REMOVE_PUSH_BUTTON_pressed was running", "info");
            writeLog(sm72tc, "Exception: " + ex + " line number " + ex.lineNumber, "error");
        }
    }

    this.DSP_TREE_BOX_selChanged = function (selection) {
        try {
            this.documentSelectPage.treeBoxChangeEvent(selection);

        } catch (ex) {
            writeLog(sm72tc, "Action DSP_TREE_BOX_selChanged was running", "info");
            writeLog(sm72tc, "Exception: " + ex + " line number " + ex.lineNumber, "error");
        }
    }
    this.DSP_ADD_BUTTON_pressed = function () {
        try {
            this.documentSelectPage.addButtonPressEvent();

        } catch (ex) {
            writeLog(sm72tc, "Action DSP_ADD_BUTTON_pressed was running", "info");
            writeLog(sm72tc, "Exception: " + ex + " line number " + ex.lineNumber, "error");
        }
    }
    this.DSP_REMOVE_BUTTON_pressed = function () {
        try {
            this.documentSelectPage.removeButtonPressEvent();

        } catch (ex) {
            writeLog(sm72tc, "Action DSP_REMOVE_BUTTON_pressed was running", "info");
            writeLog(sm72tc, "Exception: " + ex + " line number " + ex.lineNumber, "error");
        }
    }
    this.DSP_SEARCH_TEXT_BOX_changed = function () {

        try {
            this.documentSelectPage.searchTexBoxChangeEvent();

        } catch (ex) {
            writeLog(sm72tc, "Action DSP_SEARCH_TEXT_BOX_changed was running", "info");
            writeLog(sm72tc, "Exception: " + ex + " line number " + ex.lineNumber, "error");
        }
    }
    this.DSP_NEW_BUTTON_pressed = function () {
        try {
            var dialogFunction = new DocumentEditSubDialog(null, this.locale, false);
            this.dialog.setSubDialog("DSP_SUBDIALOG", dialogFunction, Constants.DIALOG_TYPE_ACTION,
                BaseDialog.getStringFromStringTable("DOCUMENT_HANDLING_DIALOG_NEW_TITLE", this.locale));

        } catch (ex) {
            writeLog(sm72tc, "Event DSP_NEW_BUTTON_pressed", "info");
            writeLog(sm72tc, "Exception occurred " + ex, "error");
            throw ex;
        }
    }
    this.DSP_EDIT_BUTTON_pressed = function () {

        try {
            var object = this.documentSelectPage.getSelectedObject();
            if (object === null) return false;
            writeLog(sm72tc, "Action DSP_EDIT_BUTTON_pressed was running" + object.name, "info");

            var dialogFunction = new DocumentEditSubDialog(object.object, this.locale, true);
            this.dialog.setSubDialog("DSP_SUBDIALOG", dialogFunction, Constants.DIALOG_TYPE_ACTION,
                BaseDialog.getStringFromStringTable("DOCUMENT_HANDLING_DIALOG_EDIT_TITLE", this.locale));

        } catch (ex) {
            writeLog(sm72tc, "Action DSP_EDIT_BUTTON_pressed was running", "info");
            writeLog(sm72tc, "Exception: " + ex + " line number " + ex.lineNumber, "error");
        }
    }
    this.DSP_SUBDIALOG_subDialogClosed = function (subResult, bOk) {

        var validGroup;
        var group;
        var locale = this.locale;
        try {
            if (!bOk) return false;
            var object = subResult.object;
            if (subResult.isEdit) {
                object.Attribute(Constants.AT_NAME, this.locale).setValue(subResult.name);
                object.Attribute(Constants.AT_DESC, this.locale).setValue(subResult.description);
                object.Attribute(Constants.AT_ADS_LINK_1, this.locale).setValue(subResult.link);
                object.Attribute(Constants.AT_ADS_TITL1, this.locale).setValue(subResult.linkName);


            } else {

                group = ArisData.getActiveDatabase().
                    FindGUID(PRP_Constants.DOCUMENTS_ROOT_GROUP_GUID, Constants.CID_GROUP);

                var firstLetter = subResult.name.substring(0, 1).toUpperCase();

                var groups = group.Childs().filter(function (group) {
                    var name = BaseDialog.getMaintainedObjectName(group, locale);
                    return name.startsWith(firstLetter);
                });
                if (groups.length > 0) {
                    validGroup = groups[0];
                } else {
                    validGroup = group.CreateChildGroup(firstLetter, this.locale);
                }


                if (BaseDialog.isArisObjectNullOrInvalid(validGroup)) return false;

                var newObject = validGroup.GetOrCreateObjDef(PRP_Constants.DOCUMENT_TYPE, 2, subResult.name,
                    this.locale);
                if (BaseDialog.isArisObjectNullOrInvalid(newObject)) return false;


                if (!BaseDialog.isNullOrEmpty(subResult.description)) {
                    newObject.Attribute(Constants.AT_DESC, this.locale).setValue(subResult.description);
                }
                if (!BaseDialog.isNullOrEmpty(subResult.link)) {
                    newObject.Attribute(Constants.AT_ADS_LINK_1, this.locale).setValue(subResult.link);
                }

                if (!BaseDialog.isNullOrEmpty(subResult.linkName)) {
                    newObject.Attribute(Constants.AT_ADS_TITL1, this.locale).setValue(subResult.linkName);
                }

                object = newObject
            }
        } catch (ex) {
            writeLog(sm72tc, "Action DOS_SUBDIALOG_subDialogClosed was running", "info");
            writeLog(sm72tc, "Exception: " + ex + " line number " + ex.lineNumber, "error");
        } finally {
            this.reloadPage(MainDialog.documentSelectPageNumber);
            if (bOk && !subResult.isEdit) {
                var searchBox = this.getPageElement(MainDialog.documentSelectPageNumber, "DSP_SEARCH_TEXT_BOX");
                writeLog(sm72tc, "SearchBox " + searchBox, "info");
                searchBox.setText(object.Name(this.locale));
                this.documentSelectPage.searchTexBoxChangeEvent();
            }
        }
    }


}

MainDialog.prototype.reloadPage = function (page) {

    switch (page) {
        case MainDialog.processesOverviewPageNumber:
            this.prcocessesOverviewPage.init();
            break;
        case MainDialog.dataObjectSelectPageNumber:
            this.dataObjectSelectPage.init();
            break;
        case MainDialog.documentSelectPageNumber:
            this.documentSelectPage.init();
            break;
        default:
            writeLog(sm72tc, "Page(" + page + ") for reloading was not found", "error");
            break;
    }
}

