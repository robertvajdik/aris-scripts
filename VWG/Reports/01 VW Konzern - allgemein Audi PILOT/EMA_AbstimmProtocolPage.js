var VALID_ABSTIMPROTOCOL_OBJ_TYPES = [Constants.OT_ORG_UNIT, Constants.OT_PERS_TYPE,Constants.OT_GRP];

function VotingProtocolPage() {

    var userDialog = Dialogs.createNewDialogTemplate(0, 0, 870, 472,
        g_tMainObject.sName + " (" + g_tMainObject.sType + ")" + (g_bReadOnly == true ? g_sReadOnlyTxt : ""),
        "funcVotingProtocolPage"); // %GRID:10,7,1,1
    userDialog.PushButton(0, 0, 0, 0, "", "myDummy"); //für das doppelklicken im Dialog
    userDialog.GroupBox(10, 5, 691, 480, getString("ABSTIMPROTOCOL_INFO_GROUP"), "ABSTIM_PROTOCOL_INFO_GROUP");
    userDialog.Table(20, 14, 582, 450,
        [
            getString("ABSTIMPROTOCOL_TABLE_COLUMN_ONE"),
            getString("ABSTIMPROTOCOL_TABLE_COLUMN_TWO"),
            getString("ABSTIMPROTOCOL_TABLE_COLUMN_THREE")
        ],
        [
            Constants.TABLECOLUMN_MULTILINE,
            Constants.TABLECOLUMN_SINGLELINE,
            Constants.TABLECOLUMN_MULTILINE
        ],
        [33, 34, 33],
        "ABSTIMPROTOCOL_RESULT_TABLE",
        Constants.TABLE_STYLE_DEFAULT | Constants.TABLE_STYLE_HEIGHT_2X | Constants.TABLE_STYLE_ALLROWSSAMEHEIGHT
    );

    userDialog.PushButton(625, 14, 48, 16, "...", "ABSTIMPROTOCOL_NEW_BUTTON"); //für das doppelklicken im Dialog

    userDialog.CancelButton();
    userDialog.OKButton();
    g_PageSelection.addPageSelectionButtons(userDialog);
    g_LanguageSwitch.addButtons(userDialog);

    var dlg = Dialogs.createUserDialog(userDialog);
    currentDialog = dlg;
    return Dialogs.show(dlg);
}

function funcVotingProtocolPage(DlgItem, Action, SuppValue) {

    var result = false;

    switch (Action) {
        case 1: // Dialogbox-Initialisierung

            currentDialog.setDlgEnable("ABSTIMPROTOCOL_DELETE_BUTTON", false);
            g_LanguageSwitch.initButtons(currentDialog, g_nLoc);
            var data = transformAttributeToVotingData(g_tMainObject.VotingProtocol.content);
            var items = createVotingTableData(data);
            currentDialog.setDlgListBoxArray("ABSTIMPROTOCOL_RESULT_TABLE", items);
            if (g_bReadOnly === true) {
                currentDialog.setDlgEnable("ABSTIM_PROTOCOL_INFO_GROUP", false);
                currentDialog.setDlgEnable("ABSTIMPROTOCOL_RESULT_TABLE", false);
                currentDialog.setDlgEnable("ABSTIMPROTOCOL_NEW_BUTTON", false);

            }
            break;
        case 2: // Werte verändern oder Button gedrückt
            //Rem funcDlgModGen = True ' Verhindere Button-Druck vorm Schließen der Dialogbox

            switch (DlgItem) {
                case "myDummy":
                    result = true;
                    break;
                case "ABSTIMPROTOCOL_NEW_BUTTON":
                    c_DlgValue = 20000;
                    break;
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
                    reloadLocalizedPageEntrys("Special", currentDialog, g_tMainObject);
                    g_LanguageSwitch.changeLanguage(currentDialog);
                    result = true;
                    break;
                case "btnLangDefault": // Objektattribute werden nicht in andere Sprache kopiert
                    g_tMainObject.saveValues();
                    // report zum kopieren in andere Sprachen aufrufen
                    var sScriptID = AUDIConfigReader.getConfigString("ReportCategory", "CommonReports", "ZAUDICOMMON",
                        "AUDI_Config.xml");
                    var report = Context.getComponent("Report");
                    writeLog(sm72tc, "Start CopyReport", "info")
                    var execInf = report.createExecInfo(sScriptID + "/956f1bd0-8351-11de-7e09-001a6b3c78e6", [g_oStartingModel],
                        g_nLoc);
                    execInf.setProperty("maintainAlternativeLangOnly", "true");
                    var result = report.execute(execInf);
                    try {
                        g_oSourceDB.refreshObjects([g_oStartingModel], false);
                    } catch (e) {
                    }
                    // TMainObject in anderer Sprache initialisieren.
                    g_nLoc = g_nAlterLoc;
                    g_tMainObject.init(g_nLoc);
                    writeLog(sm72tc, "reload attributes", "info");
                    reloadLocalizedPageEntrys("Special", currentDialog, g_tMainObject)
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
            writeLog(sm72tc, "Table Edit " + SuppValue, "info");
            writeLog(sm72tc, "Table Edit " + currentDialog.getValue("ABSTIMPROTOCOL_RESULT_TABLE"), "info");

            break;

    }

    return result;
}

function createVotingTableData(input) {

    writeLog(sm72tc, typeof input, "info");
    var locale = g_nLoc;
    var content = [];
    input.forEach(function (data) {
        var userName = data.user.split("|")[1];
        var roles = data.roles.map(function (role) {
            if (role === null) return "invalid object";
            return role.Name(locale);
        }).join(",");
        var orgUnits = data.orgUnits.map(function (orgUnit) {
            return orgUnit.Name(locale);
        }).join(",")

        content.push(roles);
        content.push(userName);
        content.push(orgUnits);

    });
    return content;
}

function transformAttributeToVotingData(input) {

    if (input === null || typeof input === 'undefined' || input.length === 0) return [];
    var objects = String(input).split("||");

    return objects
        .map(function (object) {
            return JSON.parse(object);
        })
        .map(function (object) {

            var roles = object.roles.split(";").map(function (guid) {
                var objDef = ArisData.getActiveDatabase().FindGUID(guid.trim(), Constants.CID_OBJDEF);

                if (objDef.IsValid()) return objDef;
                return null;
            });

            var orgUnits = object.orgUnits.split(";").map(function (guid) {
                var objDef = ArisData.getActiveDatabase().FindGUID(guid.trim(), Constants.CID_OBJDEF);

                if (objDef.IsValid()) return objDef;
                return null;
            })
            return {
                user: object.user,
                roles: roles,
                orgUnits: orgUnits,
                hash: AssignVotingProtocolDialog.createHash(object.user, roles, orgUnits)
            };
        })
}

function runAssignVotingProtocolDialog(assignedVotingData, model, modelObjects, locale) {

    var dialogFunction = new AssignVotingProtocolDialog(assignedVotingData, model, modelObjects, locale);
    return Dialogs.showDialog(dialogFunction, Constants.DIALOG_TYPE_ACTION, "Assign Voting protocol data");
}

function AssignVotingProtocolDialog(assignedVotingData, model, modelObjects, locale) {

    this.assignedVotingData = assignedVotingData;

    this.model = model;
    this.locale = locale;
    this.roles = this.getAllRoles();
    this.users = this.getAllUsers();
    this.orgUnits = this.getAllOrgUnits(modelObjects);
    this.userLastSelectedIndex = -1;
    this.dialogResult = {
        isOk: false,
        assignedVotingData: []
    };

    this.getPages = function () {

        var pages = [];
        pages.push(this.createPage());
        return pages;

    }

    this.init = function () {

        var locale = this.locale;

        var rolesListBox = this.getPageElement(0, "ABSTIMPROTOCOL_SEARCH_ROLES_LIST_BOX");
        var usersListBox = this.getPageElement(0, "ABSTIMPROTOCOL_SEARCH_USERS_LIST_BOX");
        var orgUnitsListBox = this.getPageElement(0, "ABSTIMPROTOCOL_SEARCH_ORGS_LIST_BOX");
        var table = this.getPageElement(0, "ABSTIMPROTOCOL_RESULT_TABLE");



        var rolesName = this.roles.map(function (role) {
            return role.Name(locale);
        });

        var usersName = this.users.map(function (user) {
            return user.split("|")[1];
        });

        var orgUnitsName = this.orgUnits.map(function (orgUnit) {
            if (orgUnit !== null && orgUnit.IsValid()) return orgUnit.Name(locale);
            else getString("INIT_ASSOBJ_ERR");
        })

        rolesListBox.setItems(rolesName);
        usersListBox.setItems(usersName);
        orgUnitsListBox.setItems(orgUnitsName);
        if (this.assignedVotingData.length > 0) {
            table.setItems(this.transformAssignedVotingData([]));
        }
    }

    this.onClose = function (subResult, bOk) {
        this.dialogResult.isOk = bOk;
        this.dialogResult.assignedVotingData = this.assignedVotingData
    }


    this.getResult = function () {
        return this.dialogResult;
    }

    this.isInValidState = function (pageNumber) {

        var rolesListBox = this.getPageElement(0, "ABSTIMPROTOCOL_SEARCH_ROLES_LIST_BOX");
        var usersListBox = this.getPageElement(0, "ABSTIMPROTOCOL_SEARCH_USERS_LIST_BOX");
        var orgUnitsListBox = this.getPageElement(0, "ABSTIMPROTOCOL_SEARCH_ORGS_LIST_BOX");
        var assignPushButton = this.getPageElement(0, "ABSTIMPROTOCOL_ASSIGN_PUSH_BUTTON");
        var table = this.getPageElement(0, "ABSTIMPROTOCOL_RESULT_TABLE");
        var removePushButton = this.getPageElement(0, "ABSTIMPROTOCOL_REMOVE_PUSH_BUTTON");


        if (rolesListBox.getSelection() === null && orgUnitsListBox.getSelection() === null &&
            usersListBox.getSelectedIndex() === -1) {
            writeLog(sm72tc, "First condition", "info");
            assignPushButton.setEnabled(false);
        }
        else if (

            (rolesListBox.getSelection() !== null && rolesListBox.getSelection().length > 0) &&
            (orgUnitsListBox.getSelection() !== null && orgUnitsListBox.getSelection().length > 0) &&
            usersListBox.getSelectedIndex() > -1) {
            writeLog(sm72tc, "Second condition", "info");
            assignPushButton.setEnabled(true);
        }
        else {
            assignPushButton.setEnabled(false);
        }


        var items = table.getItems();

        var isSelected = items
            .map(function (row) {
                return (row[0].localeCompare("1") === 0);
            }).reduce(function (prev, next) {
                writeLog(sm72tc, "test " + (prev && next), "info");
                writeLog(sm72tc, "prev " + prev, "info");
                writeLog(sm72tc, "next " + next, "info");
                return prev || next;
            }, false);

        writeLog(sm72tc, "isSelected " + isSelected, "info");

        if (isSelected === false) {
            removePushButton.setEnabled(false);
        }
        else {
            removePushButton.setEnabled(true);
        }
        return true;
    }

    this.ABSTIMPROTOCOL_SEARCH_USERS_LIST_BOX_selChanged = function (selection) {


        var rolesListBox = this.getPageElement(0, "ABSTIMPROTOCOL_SEARCH_ROLES_LIST_BOX");
        var orgUnitsListBox = this.getPageElement(0, "ABSTIMPROTOCOL_SEARCH_ORGS_LIST_BOX");

        if (this.userLastSelectedIndex > -1) {
            rolesListBox.setSelection([]);
            orgUnitsListBox.setSelection([]);
        }
        this.userLastSelectedIndex = selection;
    }
    this.ABSTIMPROTOCOL_ASSIGN_PUSH_BUTTON_pressed = function () {

        var rolesListBox = this.getPageElement(0, "ABSTIMPROTOCOL_SEARCH_ROLES_LIST_BOX");
        var orgUnitsListBox = this.getPageElement(0, "ABSTIMPROTOCOL_SEARCH_ORGS_LIST_BOX");
        var usersListBox = this.getPageElement(0, "ABSTIMPROTOCOL_SEARCH_USERS_LIST_BOX");
        var table = this.getPageElement(0, "ABSTIMPROTOCOL_RESULT_TABLE");

        var roles = this.roles.filter(function (role, index) {
            return rolesListBox.getSelection().some(function (selection) {
                return index === selection;
            });
        });
        var orgUnits = this.orgUnits.filter(function (role, index) {
            return orgUnitsListBox.getSelection().some(function (selection) {
                return index === selection;
            });
        });

        var user = this.users[usersListBox.getSelectedIndex()];

        var newData = {
            user: user,
            roles: roles,
            orgUnits: orgUnits,
            hash: AssignVotingProtocolDialog.createHash(user, roles, orgUnits)
        };

        var isContained = this.assignedVotingData.some(function (data) {
            return data.hash == newData.hash;
        });

        if (!isContained) {
            this.assignedVotingData.push(newData);
        }

        var items = this.transformAssignedVotingData(table.getItems());

        table.setItems(items);

    }
    this.ABSTIMPROTOCOL_REMOVE_PUSH_BUTTON_pressed = function () {

        var table = this.getPageElement(0, "ABSTIMPROTOCOL_RESULT_TABLE");
        var deleteItems = table.getItems().filter(function (row) {
            return row[0].localeCompare("1") === 0;
        });


        this.assignedVotingData = this.assignedVotingData.filter(function (data) {
            return !deleteItems.some(function (item) {
                return item[4].localeCompare(data.hash) === 0;
            });
        });


        var items = this.assignedVotingData.map(function (data) {

            var userName = data.user.split("|")[1];
            var roles = data.roles.map(function (role) {
                return role.Name(locale);
            }).join(",");
            var orgUnits = data.orgUnits.map(function (orgUnit) {
                return orgUnit.Name(locale);
            }).join(",");

            return [false, roles, userName, orgUnits, data.hash];
        });
        table.setItems(items);
    }

}

AssignVotingProtocolDialog.prototype.getPageElement = function (pageNumber, elementIdentifier) {
    var page = this.dialog.getPage(pageNumber);
    if (page === null) return null;

    return page.getDialogElement(elementIdentifier);
}

AssignVotingProtocolDialog.prototype.createPage = function () {

    var template = Dialogs.createNewDialogTemplate(0, 0, 1080, 360, "Assign voting protocol data");
    var oneThird = Math.floor(1080 / 3.0);

    template.GroupBox(5, 5, 1070, 240, getString("ABSTIMPROTOCOL_ASSIG_RESULTS_GROUP_BOX_TEXT"),
        "ABSTIMPROTOCOL_ASSIGN_RESULTS_GROUP_BOX");

    template.Text(10, 8, oneThird - 10, 10, getString("ABSTIMPROTOCOL_TABLE_COLUMN_ONE"), "ABSTIMPROTOCOL_SEARCH_ROLES_TEXT");
    template.ListBox(10, 22, oneThird - 10, 178, [], "ABSTIMPROTOCOL_SEARCH_ROLES_LIST_BOX", 1);


    template.Text(10 + oneThird, 8, oneThird - 10, 10, getString("ABSTIMPROTOCOL_TABLE_COLUMN_TWO"),
        "ABSTIMPROTOCOL_SEARCH_USER_TEXT");
    template.ListBox(10 + oneThird, 22, oneThird - 10, 178, [], "ABSTIMPROTOCOL_SEARCH_USERS_LIST_BOX");

    template.Text(10 + 2 * oneThird, 8, oneThird - 20, 10, getString("ABSTIMPROTOCOL_TABLE_COLUMN_THREE"),
        "ABSTIMPROTOCOL_SEARCH_ORGS_TEXT");
    template.ListBox(10 + 2 * oneThird, 22, oneThird - 20, 178, [], "ABSTIMPROTOCOL_SEARCH_ORGS_LIST_BOX", 1);


    template.PushButton(Math.floor(1080 / 2) - Math.floor(130 / 2), 210, 130, 20, getString("ABSTIMPROTOCOL_NEW_BUTTON_TEXT"),
        "ABSTIMPROTOCOL_ASSIGN_PUSH_BUTTON");

    template.GroupBox(5, 260, 1070, 170, getString("ABSTIMPROTOCOL_ASSIGNED_RESULTS_GROUP_BOX_TEXT"),
        "ABSTIMPROTOCOL_ASSIGNED_RESULTS_GROUP_BOX");

    template.Table(10, 265, 1060, 130,
        [
            "Check",
            getString("ABSTIMPROTOCOL_TABLE_COLUMN_ONE"),
            getString("ABSTIMPROTOCOL_TABLE_COLUMN_TWO"),
            getString("ABSTIMPROTOCOL_TABLE_COLUMN_THREE"),
            getString("ABSTIMPROTOCOL_TABLE_COLUMN_FOUR")

        ],
        [
            Constants.TABLECOLUMN_BOOL_EDIT,
            Constants.TABLECOLUMN_MULTILINE,
            Constants.TABLECOLUMN_SINGLELINE,
            Constants.TABLECOLUMN_MULTILINE,
            Constants.TABLECOLUMN_SINGLELINE
        ],
        [5, 35, 30, 30, 0],
        "ABSTIMPROTOCOL_RESULT_TABLE",
        Constants.TABLE_STYLE_DEFAULT | Constants.TABLE_STYLE_HEIGHT_2X | Constants.TABLE_STYLE_ALLROWSSAMEHEIGHT | Constants.TABLE_STYLE_MULTISELECT);

    template.PushButton(Math.floor(1080 / 2) - Math.floor(130 / 2), 400, 130, 20, getString("ABSTIMPROTOCOL_DELETE_BUTTON_TEXT"),
        "ABSTIMPROTOCOL_REMOVE_PUSH_BUTTON");

    return template;
}

AssignVotingProtocolDialog.prototype.getAllRoles = function () {

    if (this.model === null || !this.model.IsValid()) return [];

    var roles = this.model.ObjOccListFilter().filter(function (occurrence) {
        return VALID_ABSTIMPROTOCOL_OBJ_TYPES.some(function (typeNumber) {
            return typeNumber === occurrence.ObjDef().TypeNum();
        })
    }).map(function (occurrence) {
        return occurrence.ObjDef();
    });

    return ArisData.sort(roles,Constants.AT_NAME,this.locale)
}

AssignVotingProtocolDialog.prototype.getAllUsers = function () {

    return String(g_tMainObject.tSpeziell.sAttr_Creator_ID).split(";")
        .sort(function (a,b){
            var nameA = a.split("|")[1];
            var nameB = b.split("|")[1];
            writeLog(sm72tc,"Name A "+ nameA,"info");
            writeLog(sm72tc,"Name B "+ nameB,"info");
            writeLog(sm72tc,"localeCompare "+ (nameA.localeCompare(nameB)),"info");
            return nameA.localeCompare(nameB);
    });


}

AssignVotingProtocolDialog.prototype.getAllOrgUnits = function (objects) {

    var those = this;
    var orgUnits = objects.toArray().filter(function (object) {
        return object.lType === Constants.OT_ORG_UNIT;
    }).map(function (object) {
        return object.sGUID;
    }).map(function (guid) {
            return those.findObjDef(guid);
        });

    return ArisData.sort(orgUnits,Constants.AT_NAME,this.locale);
}

AssignVotingProtocolDialog.prototype.findObjDef = function (guid) {
    var objDef = ArisData.getActiveDatabase().FindGUID(guid.trim(), Constants.CID_OBJDEF);

    if (objDef.IsValid()) return objDef;
    return null;
}

AssignVotingProtocolDialog.prototype.transformAssignedVotingData = function (currentItems) {
    var locale = this.locale;
    return this.assignedVotingData.map(function (data) {

        var userName = data.user.split("|")[1];
        var roles = data.roles.map(function (role) {
            if (role === null) return "invalid object";
            return role.Name(locale);
        }).join(",");
        var orgUnits = data.orgUnits.map(function (orgUnit) {
            return orgUnit.Name(locale);
        }).join(",");

        var item = currentItems.filter(function (item) {
            return item[4].localeCompare(data.hash) === 0;
        });

        if (item.length === 0) {

            return [false, roles, userName, orgUnits, data.hash];
        }
        return item[0];

    });
}

AssignVotingProtocolDialog.createHash = function (user, roles, orgUnits) {

    var hashFunction = Packages.com.google.common.hash.Hashing.sha256();

    var json = "{" +
        "user:" + user + "," +
        "roles:" + roles + "," +
        "orgUnits:" + orgUnits +
        "}";

    return hashFunction.hashString(json, Packages.java.nio.charset.StandardCharsets.UTF_8).toString();
}
/*
{
"user":"DZC740E|Gajdusek, Pavel (IDS Advisory s.r.o.)|ext.Pavel.Gajdusek@skoda-auto.cz|DC=skoda,DC=vwg","roles":"99ca1a36-21bc-11ec-4062-005056af7044","orgUnits":"4c55e9c1-a119-11e3-10f0-0017a4773c34;94bd1c20-a1a7-11e5-0d25-005056af6d0b;4d29b481-a119-11e3-10f0-0017a4773c34;5bc1dc61-a11a-11e3-10f0-0017a4773c34","hash":"8496067f96a371deb694fab5c7efa3cc282da26a62d822ff0324c1bd918ad8a0"}
 */