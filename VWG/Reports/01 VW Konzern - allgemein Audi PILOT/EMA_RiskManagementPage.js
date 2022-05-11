var RISK_OPTION_1 = 0;
var RISK_OPTION_2 = 1;
var RISK_OPTION_3 = 2;

function riskHandling() {

    var assignedRisks = RiskUtils.transformToObjects(g_tMainObject.Risks.sAttr_Risk, CorpKey);
    var dialogResult = runRiskManagementAddDialog(g_oStartingModel, assignedRisks, CorpKey, g_nLoc);
    if (dialogResult.isOk) {

        var option3Risks = dialogResult.assignedRisks.filter(function (object) {
            var typeNum = object.TypeNum();
            var riskType = RiskUtils.getRiskType(typeNum, object, g_nLoc);
            var isRiskCreated = object.TypeNum() === Constants.OT_RISK ? true : object.getConnectedObjs(
                Constants.OT_RISK).length > 0;
            var isInModel = RiskUtils.isInModel(dialogResult.options3OverviewModel, object);
            return riskType === RISK_OPTION_3 && (!isRiskCreated || !isInModel);
        });

        option3Risks.forEach(function (object) {
            var group = dialogResult.options3OverviewModel.Group();

            dialogResult.options3OverviewModel.setTemplate("90035e81-4129-11d4-857d-00005a4053ff");
            var objDef = group.GetOrCreateObjDef(Constants.OT_RISK, 2, object.Name(g_nLoc), g_nLoc);
            var value = VWAudiConstants.fMethod.AttrValueType(
                VWAudiConstants.ATT_RISK_SOURCE_TYPE,
                VWAudiConstants.checkUserDefinedAttributeValueTypeNum(VWAudiConstants.ATT_RISK_SOURCE_TYPE,
                    VWAudiConstants.ATT_RISK_SOURCE_TYPE_VALUE_OPT3));

            objDef.Attribute(VWAudiConstants.ATT_RISK_SOURCE_TYPE, g_nLoc).setValue(value);

            var riskObjOcc = dialogResult.options3OverviewModel.createObjOcc(Constants.ST_RISK_1, objDef, 0, 0, false,
                false);
            var documentObjOcc = dialogResult.options3OverviewModel.createObjOcc(SYM_MGU, object,
                riskObjOcc.Width() + 150, 0, false, false);
            dialogResult.options3OverviewModel.CreateCxnOcc(riskObjOcc, documentObjOcc,
                Constants.CT_IS_REPO_BY, [], false, false);


        });
        g_tMainObject.Risks.sAttr_Risk = RiskUtils.transformToJson(dialogResult.assignedRisks);

        formatModel(dialogResult.options1OverviewModel);
        formatModel(dialogResult.options2OverviewModel);
        formatModelExtra(dialogResult.options3OverviewModel);

    }
}

function writeRisksIntoModel(model) {

    try {
        model.ObjOccListFilter(Constants.OT_RISK).forEach(function (r) {
            r.Remove();
        });

        var objects = RiskUtils.transformToObjects(g_tMainObject.Risks.sAttr_Risk, CorpKey);

        if (objects.length === 0) return;

        var statusObject;
        if(model.TypeNum() === MOD_eBPMNCOL || model.TypeNum() === MOD_eBPMNPRC) {
            statusObject = model.ObjOccListFilter(-1, SYM_STAT_BPMN);
        }
        else {
            statusObject = model.ObjOccListFilter(-1, SYM_STAT);
        }
        
        if (statusObject.length === 0) return;


        var statusObjectMiddleY = statusObject[0].Y() + Math.floor(statusObject[0].Height() / 2.0);

        var occurrences = model.ObjOccListFilter(OBJ_DOC).filter(function (occurrence) {
            var connections = occurrence.CxnOccList();
            return connections.length === 0;
        }).filter(function (occurrence) {
            var occurrenceMiddleY = occurrence.Y() + Math.floor(occurrence.Height() / 2.0);
            var diff = Math.abs(occurrenceMiddleY - statusObjectMiddleY);
            return diff < 250;
        }).sort(function (occA, occB) {
            var xA = occA.X();
            var xB = occB.X();
            var yA = occA.Y();
            var yB = occB.Y();

            if (yA === yB) return xB - xA;
            return yA - yB;
        });


        var startY = 15;
        if (occurrences.length > 0) {
            startY = occurrences[occurrences.length - 1].Y() + occurrences[occurrences.length - 1].Height() + 10;
        }

        var startX = statusObject[0].X() + statusObject[0].Width() + 25;

        objects.forEach(function (object) {

            var risk;
            var oAttrOcc;
            var riskDef = object;
            if (object.TypeNum() === Constants.OT_INFO_CARR) {
                riskDef = object.getConnectedObjs(Constants.OT_RISK)[0];
            }

            risk = model.createObjOcc(Constants.ST_RISK_1, riskDef, startX, startY);
            oAttrOcc = risk.AttrOcc(Constants.AT_NAME);
            if (!oAttrOcc.Exist())
                oAttrOcc.Create(Constants.ATTROCC_CENTER, ArisData.getActiveDatabase().defaultFontStyle());

            startX += risk.Width() + 25;
        })
    } catch (ex) {
        writeLog(sm72tc, "Write Risk to Model throws exception: " + ex + " line number " + ex.lineNumber, "error");
    }

}

function formatModel(model) {

    if (!model.IsValid()) return;
    try {
        model.setTemplate("90035e81-4129-11d4-857d-00005a4053ff");
        var risks = model.ObjOccListFilter(Constants.OT_RISK);

        risks = ArisData.sort(risks, Constants.AT_NAME, g_nLoc);

        var x = 10;
        var y = 10;

        risks.forEach(function (risk) {

            risk.SetPosition(x, y);

            if ((y + risk.Height() + 15) < 50000) {
                y += risk.Height() + 15;
            } else {
                y = 10;
                x += risk.Width() + 15;
            }

        });
        model.ApplyTemplate();
    } catch (e) {
        writeLog(sm72tc, "During formatting model " + model.Group().Path(g_nLoc) + "\\" + model.Name(
            g_nLoc) + " error occurred " + e, "info");
    }
}

function formatModelExtra(model) {

    if (!model.IsValid()) return;
    try {
        model.setTemplate("90035e81-4129-11d4-857d-00005a4053ff");
        var risks = model.ObjOccListFilter(Constants.OT_RISK);

        risks = ArisData.sort(risks, Constants.AT_NAME, g_nLoc);

        var x = 10;
        var y = 10;
        var documentX = 0;

        risks.forEach(function (risk) {

            risk.SetPosition(x, y);
            var docY = y;
            var docX = x;

            risk.getConnectedObjOccs([SYM_MGU, Constants.ST_DOC]).forEach(function (document) {
                docX += risk.Width() + 150;
                documentX = x + risk.Width() + 150 + document.Width();
                document.SetPosition(docX, docY);
                document.CxnOccList().filter(function (occurrence) {
                    return occurrence.Model().IsEqual(model) &&
                        (occurrence.TargetObjOcc().ObjDef().TypeNum() === Constants.OT_RISK ||
                            occurrence.SourceObjOcc().ObjDef().TypeNum() === Constants.OT_RISK)
                }).forEach(function (connection) {
                    connection.setPoints([
                        new Packages.java.awt.Point(risk.X() + risk.Width(), y + Math.floor(risk.Height() / 2.0)),
                        new Packages.java.awt.Point(document.X(), docY + Math.floor(document.Height() / 2.0))
                    ]);
                });

            });

            if ((y + risk.Height() + 15) < 50000) {
                y += risk.Height() + 15;
            } else {
                y = 10;
                x = documentX + 50;
            }

        });

        model.ApplyTemplate();
    } catch (e) {
        writeLog(sm72tc, "During formatting model " + model.Group().Path(g_nLoc) + "\\" + model.Name(
            g_nLoc) + " error occurred " + e, "info");
    }
}

function RiskManagementPage() {

    var userDialog = Dialogs.createNewDialogTemplate(0, 0, 870, 472,
        g_tMainObject.sName + " (" + g_tMainObject.sType + ")" + (g_bReadOnly === true ? g_sReadOnlyTxt : ""),
        "funcRiskManagementPage"); // %GRID:10,7,1,1
    userDialog.PushButton(0, 0, 0, 0, "", "myDummy"); //für das doppelklicken im Dialog
    userDialog.GroupBox(10, 5, 691, 480, getString("RISK_MANAGEMENT_INFO_GROUP"), "RISK_MANAGEMENT_INFO_GROUP");

    userDialog.Table(30, 14, 582, 384,
        [

            getString("RISK_MANAGEMENT_TABLE_COLUMN_TITLE"),
            getString("RISK_MANAGEMENT_TABLE_COLUMN_ID"),
            getString("RISK_MANAGEMENT_TABLE_COLUMN_STEERING")
        ],
        [
            Constants.TABLECOLUMN_MULTILINE,
            Constants.TABLECOLUMN_MULTILINE,
            Constants.TABLECOLUMN_MULTILINE

        ], [30, 37, 38],
        "RISK_MANAGEMENT_OVERVIEW_TABLE",
        Constants.TABLE_STYLE_SORTED | Constants.TABLE_STYLE_HEIGHT_3X
    );
    userDialog.PushButton(625, 14, 48, 16, "...", "MANAGE_RISK_MANAGEMENT_BUTTON");


    userDialog.CancelButton();
    userDialog.OKButton();
    g_PageSelection.addPageSelectionButtons(userDialog);
    g_LanguageSwitch.addButtons(userDialog);

    var dlg = Dialogs.createUserDialog(userDialog);
    currentDialog = dlg;
    return Dialogs.show(dlg);
}

function funcRiskManagementPage(DlgItem, Action) {

    var result = false;


    switch (Action) {
        case 1: // Dialogbox-Initialisierung

            g_LanguageSwitch.initButtons(currentDialog, g_nLoc);
            if (
                (typeof g_tMainObject.Risks.sAttr_Risk === 'object' && g_tMainObject.Risks.sAttr_Risk.length() > 0) ||
                (typeof g_tMainObject.Risks.sAttr_Risk === 'string' && g_tMainObject.Risks.sAttr_Risk.length > 0)
            ) {
                var array = String(g_tMainObject.Risks.sAttr_Risk).split("|").map(function (item) {
                    return JSON.parse(item);
                });

                var items = array.map(function (json) {

                    var guid = json.guid;
                    var type = json.riskType;
                    var risk = ArisData.getActiveDatabase().FindGUID(guid, Constants.CID_OBJDEF);
                    var name = risk.Name(g_nLoc);
                    switch (type) {
                        case RISK_OPTION_1:
                            var desc = risk.Attribute(Constants.AT_DESC, g_nLoc).getValue();
                            return [name, "", desc];
                        case RISK_OPTION_2:

                            var id = risk.Attribute(Constants.AT_ID, g_nLoc).getValue();
                            return [name, id, ""];
                        case RISK_OPTION_3:
                            return [name, "", ""];

                    }

                }).reduce(function (array, item) {
                    array.push(item[0]);
                    array.push(item[1]);
                    array.push(item[2]);
                    return array;
                }, []);

                if (items.length > 0) {
                    currentDialog.setDlgListBoxArray("RISK_MANAGEMENT_OVERVIEW_TABLE", items);
                }
            } else currentDialog.setDlgListBoxArray("RISK_MANAGEMENT_OVERVIEW_TABLE", []);

            if (g_bReadOnly === true) {
                currentDialog.setDlgEnable("MANAGE_RISK_MANAGEMENT_BUTTON", false);
                currentDialog.setDlgEnable("RISK_MANAGEMENT_OVERVIEW_TABLE", false);


            }
            break;
        case 2: // Werte verändern oder Button gedrückt
            //Rem funcDlgModGen = True ' Verhindere Button-Druck vorm Schließen der Dialogbox

            switch (DlgItem) {
                case "myDummy":
                    result = true;
                    break;
                case "MANAGE_RISK_MANAGEMENT_BUTTON":
                    c_DlgValue = 20001;
                    return false;
                case "OK":
                    c_DlgValue = c_Button_OK;
                    return false;
                case "Cancel":
                    c_DlgValue = c_Button_CANCEL;
                    return false;
                case "btnLangSelected":
                    g_tMainObject.saveValues();
                    // TMainObject in anderer Sprache initialisieren.
                    g_nLoc = g_nSelectedLoc;
                    g_tMainObject.init(g_nLoc);
                    g_LanguageSwitch.changeLanguage(currentDialog);
                    result = true;
                    break;
                case "btnLangDefault": // Objektattribute werden nicht in andere Sprache kopiert
                    g_tMainObject.saveValues();
                    // report zum kopieren in andere Sprachen aufrufen
                    var sScriptID = AUDIConfigReader.getConfigString("ReportCategory", "CommonReports", "ZAUDICOMMON",
                        "AUDI_Config.xml");
                    var report = Context.getComponent("Report");
                    var execInf = report.createExecInfo(sScriptID + "/956f1bd0-8351-11de-7e09-001a6b3c78e6",
                        [g_oStartingModel], g_nLoc);
                    execInf.setProperty("maintainAlternativeLangOnly", "true");
                    report.execute(execInf);
                    try {
                        g_oSourceDB.refreshObjects([g_oStartingModel], false);
                    } catch (e) {
                    }
                    // TMainObject in anderer Sprache initialisieren.
                    g_nLoc = g_nAlterLoc;
                    g_tMainObject.init(g_nLoc);
                    g_LanguageSwitch.changeLanguage(currentDialog);
                    result = true;
                    break;
                default:
                    result = g_PageSelection.changePage(currentDialog, DlgItem, g_threadLoader);
            }
            break;
        case 3: // Textbox oder Comboboxtext verändert
            break;
        case 4: // Fokus verändert
            break;
        case 5: // Leerlauf
            //Rem funcDlgModGen = True ' Leerlaufaktionen einholen fortfahren
            break;
        case 6: // Funktionstaste
            break;
        case 8:
            break;
        /*
         {"guid":"39e53661-ae15-11e9-50ea-005056af6d0b","riskType":2}|{"guid":"11a9e221-b20d-11e0-39b5-002481dea4fa","riskType":2}|{"guid":"5ebdd511-d297-11e2-10f0-0017a4773c34","riskType":2}
         */
    }

    return result;
}

function runRiskManagementAddDialog(model, assignedRisks, corporateKey, locale) {
    var dialogFunction = new RiskManagementAddDialog(model, assignedRisks, corporateKey, locale);
    return Dialogs.showDialog(dialogFunction, Constants.DIALOG_TYPE_ACTION, getString("RISK_MANAGEMENT_TITLE"));
}

function RiskManagementAddDialog(model, assignedRisks, corporateKey, locale) {

    this.corporateKey = corporateKey;
    this.cache = [];

    this.model = model;
    this.locale = locale;
    this.assignedRisks = assignedRisks !== null ? assignedRisks : [];
    this.original = assignedRisks !== null ? assignedRisks : [];
    this.dialogResult = {
        isOk: false
    };


    this.options1OverviewModel = this.getModel(this.getConfiguration("RiskFreetextModel"));
    this.options2OverviewModel = this.getModel(this.getConfiguration("RiskRadarModel"));
    this.options3OverviewModel = this.getModel(this.getConfiguration("RiskDocumentModel"));

    this.options1Folder = this.getGroup(this.getConfiguration("RiskFreetext"));
    this.options2Folder = this.getGroup(this.getConfiguration("RiskRadar"));


    this.getPages = function () {

        return [this.createPage()];
    }

    this.init = function () {

        var options = [];
        options.push(getString("RISK_MANAGEMENT_RISK_TYPE_1")); //Option 1: Risiko als Freitext erfassen
        options.push(getString("RISK_MANAGEMENT_RISK_TYPE_2")); //Option 2: Risiko anhand der Prozessrisiko-ID (RiskRadar/IKS) erfassen
        options.push(getString("RISK_MANAGEMENT_RISK_TYPE_3")); //Option 3: Risiko über ein separates \"mitgeltendes Dokument\" erfassen

        this.getPageElement(0, "RISK_MANAGEMENT_RISK_TYPE_SELECTOR").setItems(options);
        this.getPageElement(0, "RISK_MANAGEMENT_RISK_TYPE_SELECTOR").setSelection(0);
        var locale = this.locale;
        if (this.assignedRisks !== null && this.assignedRisks.length > 0) {
            var names = this.assignedRisks.map(function (risk) {
                return risk.Name(locale);
            });
            this.getPageElement(0, "RISK_MANAGEMENT_RISK_ASSIGNED_RISK_LIST_BOX").setItems(names);
        }


        var listBox = this.getPageElement(0, "RISK_MANAGEMENT_RISK_ASSIGN_RISK_LIST_BOX");
        this.cache = this.getObjectDefinitionFromModel(this.options1OverviewModel);
        listBox.setItems(this.getObjectNames(this.cache));
    }

    this.isInValidState = function () {

        var selectedOption = this.getPageElement(0, "RISK_MANAGEMENT_RISK_TYPE_SELECTOR").getSelectedIndex();
        var listBox = this.getPageElement(0, "RISK_MANAGEMENT_RISK_ASSIGN_RISK_LIST_BOX");

        this.getPageElement(0, "RISK_MANAGEMENT_NEW_BUTTON").setVisible(true);
        this.getPageElement(0, "RISK_MANAGEMENT_EDIT_BUTTON").setVisible(true);


        switch (selectedOption) {
            case RISK_OPTION_1:
                this.getPageElement(0, "RISK_MANAGEMENT_NEW_BUTTON").setEnabled(true);
                break;
            case RISK_OPTION_2:
                this.getPageElement(0, "RISK_MANAGEMENT_NEW_BUTTON").setEnabled(true);
                break;
            case RISK_OPTION_3:
                if (g_tMainObject.tMDoc.sAttr_Mitgeltende_GUID.length === 0) this.getPageElement(0,
                    "RISK_MANAGEMENT_ADD_BUTTON").setEnabled(false);
                else this.getPageElement(0, "RISK_MANAGEMENT_ADD_BUTTON").setEnabled(true);

                this.getPageElement(0, "RISK_MANAGEMENT_NEW_BUTTON").setVisible(false);
                this.getPageElement(0, "RISK_MANAGEMENT_EDIT_BUTTON").setVisible(false);
                break;
        }

        if (listBox.getItems().length > 0) this.getPageElement(0, "RISK_MANAGEMENT_ADD_BUTTON").setEnabled(true);
        else this.getPageElement(0, "RISK_MANAGEMENT_ADD_BUTTON").setEnabled(false);


        if (listBox.getSelection() !== null && listBox.getSelection().length === 1) this.getPageElement(0,
            "RISK_MANAGEMENT_EDIT_BUTTON").setEnabled(true);
        else this.getPageElement(0, "RISK_MANAGEMENT_EDIT_BUTTON").setEnabled(false);


        var those = this;
        var changed = this.assignedRisks.every(function (risk) {
            return those.original.some(function (orig) {
                return orig.IsEqual(risk);
            });
        });

        return this.assignedRisks.length > 0 || changed;
    }

    this.onClose = function (pageNumber, bOk) {
        this.dialogResult.isOk = bOk;
        this.dialogResult.selectedOption = this.getPageElement(0, "RISK_MANAGEMENT_RISK_TYPE_SELECTOR").
            getSelectedIndex();
        this.dialogResult.assignedRisks = this.assignedRisks;
        this.dialogResult.options1OverviewModel = this.options1OverviewModel;
        this.dialogResult.options2OverviewModel = this.options2OverviewModel;
        this.dialogResult.options3OverviewModel = this.options3OverviewModel;
    }

    this.getResult = function () {
        return this.dialogResult;
    }

    this.RISK_MANAGEMENT_RISK_TYPE_SELECTOR_selChanged = function (selection) {

        var those = this;
        var listBox = this.getPageElement(0, "RISK_MANAGEMENT_RISK_ASSIGN_RISK_LIST_BOX");

        switch (selection) {
            case RISK_OPTION_1:
                this.cache = this.getObjectDefinitionFromModel(this.options1OverviewModel);
                break;
            case RISK_OPTION_2:
                this.cache = this.getObjectDefinitionFromModel(this.options2OverviewModel);
                break;
            case RISK_OPTION_3:
                this.cache = [];
                if (g_tMainObject.tMDoc.sAttr_Mitgeltende_GUID.length === 0) {
                    this.showWarningDialogBox(
                        "Oh, there are not filled applicable documents. Please fill it and after this action, you can assign a risk");
                } else {

                    var documents = this.getObjectFromGUIDs(g_tMainObject.tMDoc.sAttr_Mitgeltende_GUID);

                    this.cache = documents.filter(function (object) {
                        return !those.assignedRisks.some(function (risk) {
                            return risk.IsEqual(object);
                        });
                    });
                    this.cache = ArisData.sort(this.cache, Constants.AT_NAME, this.locale);
                }
                break;
        }
        listBox.setItems(this.getObjectNames(this.cache));
    }
    this.RISK_MANAGEMENT_ADD_BUTTON_pressed = function () {


        var listBox = this.getPageElement(0, "RISK_MANAGEMENT_RISK_ASSIGN_RISK_LIST_BOX");
        var assignedListBox = this.getPageElement(0, "RISK_MANAGEMENT_RISK_ASSIGNED_RISK_LIST_BOX");
        var selections = listBox.getSelection();

        var objects = this.cache.filter(function (object, index) {
            return selections.some(function (selectedIndex) {
                return selectedIndex === index;
            });
        });

        this.cache = this.cache.filter(function (object, index) {
            return !selections.some(function (selectedIndex) {
                return selectedIndex === index;
            });
        });

        listBox.setItems(this.getObjectNames(this.cache));

        this.assignedRisks = objects.reduce(function (array, item) {

            if (!array.some(function (subItem) {
                return item.IsEqual(subItem)
            })) array.push(item);
            return array;
        }, this.assignedRisks);

        this.assignedRisks = ArisData.sort(this.assignedRisks, Constants.AT_NAME, this.locale);

        assignedListBox.setItems(this.getObjectNames(this.assignedRisks));


        listBox.setItems(this.getObjectNames(this.cache));
    }
    this.RISK_MANAGEMENT_REMOVE_BUTTON_pressed = function () {

        var those = this;
        var assignedListBox = this.getPageElement(0, "RISK_MANAGEMENT_RISK_ASSIGNED_RISK_LIST_BOX");
        var assignListBox = this.getPageElement(0, "RISK_MANAGEMENT_RISK_ASSIGN_RISK_LIST_BOX");
        var optionsSelector = this.getPageElement(0, "RISK_MANAGEMENT_RISK_TYPE_SELECTOR");
        var option = optionsSelector.getSelectedIndex();
        var selections = assignedListBox.getSelection();

        this.assignedRisks = this.assignedRisks.filter(function (object, index) {

            var found = selections.some(function (i) {
                return i === index;
            });
            var objectType = object.TypeNum();
            var riskType = RiskUtils.getRiskType(objectType, object, those.locale);
            if (found && (riskType === option)) those.cache.push(object);
            return !found
        });

        this.cache = ArisData.sort(this.cache, Constants.AT_NAME, this.locale);
        this.assignedRisks = ArisData.sort(this.assignedRisks, Constants.AT_NAME, this.locale);

        assignedListBox.setItems(this.getObjectNames(this.assignedRisks));
        assignListBox.setItems(this.getObjectNames(this.cache));


    }

    this.RISK_MANAGEMENT_NEW_BUTTON_pressed = function () {

        var optionSelector = this.getPageElement(0, "RISK_MANAGEMENT_RISK_TYPE_SELECTOR");

        var type = optionSelector.getSelectedIndex();
        var comment = optionSelector.getItems()[type];
        var dialogFunction = new RiskManagementNewDialog(type, comment, this.cache, this.locale, null, false);
        this.dialog.setSubDialog("NEW_RISK_SUBDIALOG", dialogFunction, Constants.DIALOG_TYPE_ACTION, "Create a risk");

    }
    this.RISK_MANAGEMENT_EDIT_BUTTON_pressed = function () {

        var optionSelector = this.getPageElement(0, "RISK_MANAGEMENT_RISK_TYPE_SELECTOR");
        var listBox = this.getPageElement(0, "RISK_MANAGEMENT_RISK_ASSIGN_RISK_LIST_BOX");
        var object = this.cache[listBox.getSelection()[0]];

        var type = optionSelector.getSelectedIndex();
        var comment = optionSelector.getItems()[type];
        var dialogFunction = new RiskManagementNewDialog(type, comment, this.cache, this.locale, object, true);
        this.dialog.setSubDialog("NEW_RISK_SUBDIALOG", dialogFunction, Constants.DIALOG_TYPE_ACTION, "Edit a risk");
    }

    this.RISK_MANAGEMENT_RISK_SEARCH_TEXT_BOX_changed = function () {

        var locale = this.locale;
        var textBox = this.getPageElement(0, "RISK_MANAGEMENT_RISK_SEARCH_TEXT_BOX");
        var listBox = this.getPageElement(0, "RISK_MANAGEMENT_RISK_ASSIGN_RISK_LIST_BOX");

        var text = textBox.getText().toLowerCase();

        var items = this.cache;

        if (text.length() > 0) {
            items = this.cache.filter(function (object) {
                var name = object.Name(locale);
                return name.toLowerCase().startsWith(text);
            });
        }
        listBox.setItems(this.getObjectNames(items));
    }
    //5db784d1-cb3c-11e1-39b5-002481dea4fa;
    //681dc9a0-c107-11e1-39b5-002481dea4fa;
    //d534ad31-e630-11eb-4062-005056af7044;
    //d3af1491-45e9-11e3-10f0-0017a4773c34;
    //7e763c61-bc9f-11e8-50ea-005056af6d0b;
    //39e53661-ae15-11e9-50ea-005056af6d0b;

    //e82a2e01-121e-11ec-4062-005056af7044;
    //86b49ec1-1215-11ec-4062-005056af7044;
    //126246d1-1210-11ec-4062-005056af7044

    this.NEW_RISK_SUBDIALOG_subDialogClosed = function (subResult) {

        if (subResult.isOk) {

            var listBox = this.getPageElement(0, "RISK_MANAGEMENT_RISK_ASSIGN_RISK_LIST_BOX");
            var listBoxAssigned = this.getPageElement(0, "RISK_MANAGEMENT_RISK_ASSIGNED_RISK_LIST_BOX");
            if (!subResult.isEdit) {

                switch (subResult.type) {
                    case RISK_OPTION_1:
                        this.createNewRisk(this.options1OverviewModel, this.options1Folder, subResult.firstPart,
                            subResult.secondPart, RISK_OPTION_1);
                        this.cache = this.getObjectDefinitionFromModel(this.options1OverviewModel);
                        break;
                    case RISK_OPTION_2:
                        this.createNewRisk(this.options2OverviewModel, this.options2Folder, subResult.firstPart,
                            subResult.secondPart, RISK_OPTION_2);
                        this.cache = this.getObjectDefinitionFromModel(this.options2OverviewModel);
                        break;

                }
            } else {
                switch (subResult.type) {
                    case RISK_OPTION_1:
                        writeLog(sm72tc, "Update Risk type 1", "info");
                        subResult.object.Attribute(Constants.AT_NAME, this.locale).setValue(subResult.firstPart);
                        subResult.object.Attribute(Constants.AT_DESC, this.locale).setValue(subResult.secondPart);
                        this.cache = this.getObjectDefinitionFromModel(this.options1OverviewModel);
                        break;
                    case RISK_OPTION_2:
                        writeLog(sm72tc, "Update Risk type 2", "info");
                        subResult.object.Attribute(Constants.AT_NAME, this.locale).setValue(subResult.firstPart);
                        subResult.object.Attribute(Constants.AT_ID, this.locale).setValue(subResult.secondPart);
                        this.cache = this.getObjectDefinitionFromModel(this.options2OverviewModel);
                        break;

                }
            }
            listBox.setItems(this.getObjectNames(this.cache));
            listBoxAssigned.setItems(this.getObjectNames(this.assignedRisks));
        }
    }
}

RiskManagementAddDialog.prototype.getPageElement = function (pageNumber, elementIdentifier) {
    var page = this.dialog.getPage(pageNumber);
    if (page === null) return null;

    return page.getDialogElement(elementIdentifier);
}

RiskManagementAddDialog.prototype.createPage = function () {

    var template = Dialogs.createNewDialogTemplate(0, 0, 640, 360, "Assign Risk Management Data");

    template.GroupBox(5, 5, 635, 283, getString("RISK_MANAGEMENT_RISK_TYPE_GROUP_BOX"),
        "RISK_MANAGEMENT_RISK_TYPE_GROUP_BOX");
    template.DropListBox(10, 10, 628, 20, [], "RISK_MANAGEMENT_RISK_TYPE_SELECTOR");


    template.Text(10, 30, 628, 20, getString("RISK_MANAGEMENT_RISK_SEARCH_TEXT"),
        "RISK_MANAGEMENT_RISK_SEARCH_TEXT")
    template.TextBox(10, 50, 628, 20, "RISK_MANAGEMENT_RISK_SEARCH_TEXT_BOX");
    template.ListBox(10, 72, 628, 180, [], "RISK_MANAGEMENT_RISK_ASSIGN_RISK_LIST_BOX", 1);

    template.PushButton(500, 260, 130, 20, getString("ADD_BUTTON_TEXT"), "RISK_MANAGEMENT_ADD_BUTTON");
    template.PushButton(360, 260, 130, 20, getString("ABSTIMPROTOCOL_EDIT_BUTTON_TEXT"),
        "RISK_MANAGEMENT_EDIT_BUTTON");
    template.PushButton(220, 260, 130, 20, getString("NEW_BUTTON_TEXT"), "RISK_MANAGEMENT_NEW_BUTTON");

    //template.Text(10, 290, 628, 20, getString("RISK_MANAGEMENT_RISK_ASSIGNED_RISK_TEXT"));
    template.GroupBox(5, 290, 635, 132, getString("RISK_MANAGEMENT_RISK_ASSIGNED_RISK_TEXT"),
        "RISK_MANAGEMENT_RISK_ASSIGNED_RISK_TEXT");
    template.ListBox(10, 295, 628, 85, [], "RISK_MANAGEMENT_RISK_ASSIGNED_RISK_LIST_BOX", 1);
    template.PushButton(500, 390, 130, 20, getString("REMOVE_BUTTON_TEXT"), "RISK_MANAGEMENT_REMOVE_BUTTON");

    return template
}

RiskManagementAddDialog.prototype.showWarningDialogBox = function (message) {
    this.dialog.setMsgBox("WARNING", message, Constants.MSGBOX_BTN_OK | Constants.MSGBOX_ICON_WARNING, "WARNING");
}

RiskManagementAddDialog.prototype.getConfiguration = function (section) {

    var validKey = 'a' + this.corporateKey;
    return AUDIConfigReader.getConfigString(validKey, section, "", "ModellObjektDialog.xml");

}

RiskManagementAddDialog.prototype.getObjectDefinitionFromModel = function (model) {

    var those = this;
    if (model === null || !model.IsValid()) return [];
    var objects = model.ObjDefListFilter(Constants.OT_RISK);

    objects = objects.filter(function (object) {
        return !those.assignedRisks.some(function (risk) {
            return risk.IsEqual(object);
        });
    });
    return ArisData.sort(objects, Constants.AT_NAME, this.locale);
}

RiskManagementAddDialog.prototype.getModel = function (guid) {
    var model = ArisData.getActiveDatabase().FindGUID(guid, Constants.CID_MODEL);
    return model.IsValid() ? model : null;

}

RiskManagementAddDialog.prototype.getGroup = function (guid) {
    var group = ArisData.getActiveDatabase().FindGUID(guid, Constants.CID_GROUP);
    return group.IsValid() ? group : null;

}

RiskManagementAddDialog.prototype.getObjectNames = function (array) {

    var locale = this.locale;
    return array.map(function (object) {
        return object.Name(locale);
    });
}

RiskManagementAddDialog.prototype.getObjectFromGUIDs = function (guids) {

    var those = this;
    guids = guids.split(";");
    if (guids.length === 0) return [];

    return guids.map(function (guid) {
        return ArisData.getActiveDatabase().FindGUID(guid, Constants.CID_OBJDEF);
    }).filter(function (object) {
        return object !== null && object.IsValid();
    }).filter(function (object) {
        return !those.assignedRisks.some(function (risk) {
            return risk.IsEqual(object);
        })
    });
}

RiskManagementAddDialog.prototype.createNewRisk = function (model, group, first, second, type) {


    try {
        var object = group.CreateObjDef(Constants.OT_RISK, first, this.locale);
        var value = "";
        if (object.IsValid()) {
            switch (type) {

                case RISK_OPTION_1:
                    object.Attribute(Constants.AT_DESC, this.locale).setValue(second);
                    value = VWAudiConstants.fMethod.AttrValueType(
                        VWAudiConstants.ATT_RISK_SOURCE_TYPE,
                        VWAudiConstants.checkUserDefinedAttributeValueTypeNum(VWAudiConstants.ATT_RISK_SOURCE_TYPE,
                            VWAudiConstants.ATT_RISK_SOURCE_TYPE_VALUE_OPT1));
                    break;
                case RISK_OPTION_2:
                    object.Attribute(Constants.AT_ID, this.locale).setValue(second);
                    value = VWAudiConstants.fMethod.AttrValueType(
                        VWAudiConstants.ATT_RISK_SOURCE_TYPE,
                        VWAudiConstants.checkUserDefinedAttributeValueTypeNum(VWAudiConstants.ATT_RISK_SOURCE_TYPE,
                            VWAudiConstants.ATT_RISK_SOURCE_TYPE_VALUE_OPT2));

                    object.Attribute(VWAudiConstants.ATT_RISK_SOURCE_TYPE, this.locale).setValue(value);
                    break;
            }
            object.Attribute(VWAudiConstants.ATT_RISK_SOURCE_TYPE, this.locale).setValue(value);
        }


        var created = model.createObjOcc(Constants.ST_RISK_1, object, 0, 0, false, false);
        if (created === null) writeLog(sm72tc, "Cannot create obj occ in model " + model.Name(this.locale), "error");
        ArisData.Save(Constants.SAVE_NOW);
    } catch (ex) {
        writeLog(sm72tc, ex, "error");
    }
}


function RiskManagementNewDialog(type, comment, cache, locale, object, isEdit) {
    this.type = type;
    this.object = object;
    this.locale = locale;
    this.comment = comment;
    this.cache = cache;
    this.isEdit = isEdit;
    this.dialogResult = {
        isOk: false,
        isEdit: isEdit,
        object: object,
        type: type,
        firstPart: "",
        secondPart: ""
    };

    this.getPages = function () {

        return [this.createPage()];

    }

    this.init = function () {

        if (this.isEdit) {
            var firstPart = this.getPageElement(0, "RISK_MANAGEMENT_RISK_FIRST_TEXT_BOX");
            var secondPart = this.getPageElement(0, "RISK_MANAGEMENT_RISK_SECOND_TEXT_BOX");

            switch (this.type) {
                case RISK_OPTION_1:
                    firstPart.setText(this.object.Attribute(Constants.AT_NAME, this.locale).getValue());
                    secondPart.setText(this.object.Attribute(Constants.AT_DESC, this.locale).getValue());
                    break;
                case RISK_OPTION_2:
                    firstPart.setText(this.object.Attribute(Constants.AT_NAME, this.locale).getValue());
                    secondPart.setText(this.object.Attribute(Constants.AT_ID, this.locale).getValue());
                    break;
            }
        }

    }
    this.onClose = function (pageNumber, bOk) {
        this.dialogResult.isOk = bOk;
        this.dialogResult.firstPart = this.getPageElement(0, "RISK_MANAGEMENT_RISK_FIRST_TEXT_BOX").getText();
        this.dialogResult.secondPart = this.getPageElement(0, "RISK_MANAGEMENT_RISK_SECOND_TEXT_BOX").getText();

    }

    this.canFinish = function () {

        if (!this.isEdit) {
            var firstPart = this.getPageElement(0, "RISK_MANAGEMENT_RISK_FIRST_TEXT_BOX").getText();
            return !this.cache.some(function (object) {
                var name = object.Name(locale);
                return name.indexOf(firstPart) === 0;
            });
        }
        return true;
    }

    this.getResult = function () {
        return this.dialogResult;
    }

    this.isInValidState = function () {

        var firstElement = this.getPageElement(0, "RISK_MANAGEMENT_RISK_FIRST_TEXT_BOX");
        var secondElement = this.getPageElement(0, "RISK_MANAGEMENT_RISK_SECOND_TEXT_BOX");

        if (!this.isEdit) {
            var locale = this.locale;
            var firstPart = this.getPageElement(0, "RISK_MANAGEMENT_RISK_FIRST_TEXT_BOX").getText();
            if (firstPart.length() > 0) {
                var found = this.cache.some(function (object) {
                    var name = object.Name(locale);
                    return name.equals(firstPart);
                });

                if (found === true) {
                    this.showWarningDialogBox(getString("RISK_MANAGEMENT_EXISTING_RISK_TEXT"));
                }

                return !found;
            }
        }
        return firstElement.getText().length() > 0 && secondElement.getText().length() > 0;

    }
}

RiskManagementNewDialog.prototype.createPage = function () {


    var height = this.type === RISK_OPTION_1 ? 240 : 120;

    var template = Dialogs.createNewDialogTemplate(0, 0, 320, height, "Create a new risk");

    template.GroupBox(5, 5, 450, 235, this.comment, "RISK_MANAGEMENT_NEW_DIALOG_GROUP_BOX");
    switch (this.type) {
        case RISK_OPTION_1:
            template.Text(10, 10, 440, 20, getString("RISK_MANAGEMENT_RISK_NAME_TEXT"),
                "RISK_MANAGEMENT_RISK_FIRST_TEXT");
            template.TextBox(10, 22, 440, 20, "RISK_MANAGEMENT_RISK_FIRST_TEXT_BOX");

            template.Text(10, 40, 440, 20, getString("RISK_MANAGEMENT_RISK_DESC_TEXT"),
                "RISK_MANAGEMENT_RISK_SECOND_TEXT");
            template.TextBox(10, 52, 440, 180, "RISK_MANAGEMENT_RISK_SECOND_TEXT_BOX", 1);

            break;
        case RISK_OPTION_2:

            template.Text(10, 10, 440, 20, getString("RISK_MANAGEMENT_RISK_NAME_TEXT"),
                "RISK_MANAGEMENT_RISK_FIRST_TEXT");
            template.TextBox(10, 22, 440, 20, "RISK_MANAGEMENT_RISK_FIRST_TEXT_BOX");

            template.Text(10, 40, 440, 20, getString("RISK_MANAGEMENT_RISK_ID_TEXT"),
                "RISK_MANAGEMENT_RISK_SECOND_TEXT");
            template.TextBox(10, 52, 440, 20, "RISK_MANAGEMENT_RISK_SECOND_TEXT_BOX");

            break;
    }
    return template;
}

RiskManagementNewDialog.prototype.getPageElement = function (pageNumber, elementIdentifier) {
    var page = this.dialog.getPage(pageNumber);
    if (page === null) return null;

    return page.getDialogElement(elementIdentifier);
}

RiskManagementNewDialog.prototype.showWarningDialogBox = function (message) {
    this.dialog.setMsgBox("WARNING", message, Constants.MSGBOX_BTN_OK | Constants.MSGBOX_ICON_WARNING, "WARNING");
}


function RiskUtils() {

}

RiskUtils.getRiskType = function (typeNum, object, locale) {

    if (typeNum === Constants.OT_INFO_CARR) return RISK_OPTION_3;

    var rawValue = object.Attribute(VWAudiConstants.ATT_RISK_SOURCE_TYPE, locale).getValue();

    var option1Value = VWAudiConstants.fMethod.AttrValueType(VWAudiConstants.ATT_RISK_SOURCE_TYPE,
        VWAudiConstants.checkUserDefinedAttributeValueTypeNum(VWAudiConstants.ATT_RISK_SOURCE_TYPE,
            VWAudiConstants.ATT_RISK_SOURCE_TYPE_VALUE_OPT1));

    var option2Value = VWAudiConstants.fMethod.AttrValueType(VWAudiConstants.ATT_RISK_SOURCE_TYPE,
        VWAudiConstants.checkUserDefinedAttributeValueTypeNum(VWAudiConstants.ATT_RISK_SOURCE_TYPE,
            VWAudiConstants.ATT_RISK_SOURCE_TYPE_VALUE_OPT2));


    if (rawValue.startsWith(option1Value)) return RISK_OPTION_1;
    if (rawValue.startsWith(option2Value)) return RISK_OPTION_2;

    return RISK_OPTION_3;

}

RiskUtils.transformToJson = function (objects) {

    if (objects.length === 0) return "";
    var array = objects.map(function (object) {

        var typeNum = object.TypeNum();
        var riskType = RiskUtils.getRiskType(typeNum, object, g_nLoc);

        return {
            guid: object.GUID(),
            riskType: riskType
        };

    }).map(function (object) {
        return new Packages.com.google.gson.Gson().toJson(object);
    })


    return array.join("|");

}

RiskUtils.transformToObjects = function (input, corporateKey) {


    var validKey = 'a' + corporateKey;
    var groupGUID = AUDIConfigReader.getConfigString(validKey, "RiskDocument", "", "ModellObjektDialog.xml");
    var group = ArisData.getActiveDatabase().FindGUID(groupGUID, Constants.CID_GROUP);

    if (!group.IsValid()) return [];

    if (input.length === 0) return [];

    return String(input).split("|").map(function (item) {
        return JSON.parse(item);
    }).map(function (json) {
        if (json.riskType !== RISK_OPTION_3) {
            return ArisData.getActiveDatabase().FindGUID(json.guid, Constants.CID_OBJDEF);
        } else {
            var document = ArisData.getActiveDatabase().FindGUID(json.guid, Constants.CID_OBJDEF);
            var risks = document.getConnectedObjs(Constants.OT_RISK).filter(function (risk) {
                return risk.Group().IsEqual(group);
            });
            if (risks.length > 0) return document;
            return null;
        }
    }).filter(function (object) {
        return object !== null && object.IsValid();
    });
}

RiskUtils.isInModel = function (model, object) {

    return model.ObjOccListFilter(Constants.OT_INFO_CARR).filter(function (occurrence) {
        return object.IsEqual(occurrence.ObjDef())
    }).length === 1;
}

