var g_Output = Context.createOutputObject();
var g_nloc = Context.getSelectedLanguage();
var UMC = Context.getComponent("UMC");
var arryTMP = new Array();
main();

function main() {
    initializeOutput();
    g_Output.BeginTable(100, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_LEFT | Constants.FMT_REPEAT_HEADER, 0)

    g_Output.TableRow();
    writeHeader(getString("REPORT_TITLE"), 7);
    g_Output.TableRow();
    writeDescription(getString("REPORT_DESCRIPTION"), 7);
    g_Output.TableRow();
    writeTableCell("");
    g_Output.TableRow();

    writeTableHeaderCell(getString("COLUMN_PATH"), 40);
    writeTableHeaderCell(getString("COLUMN_USERGROUP_NAME"), 40);
    writeTableHeaderCell(getString("COLUMN_LAST_NAME"), 30);
    writeTableHeaderCell(getString("COLUMN_FIRST_NAME"), 30);
    writeTableHeaderCell(getString("COLUMN_EMAIL_ADDRESS"), 50);
    writeTableHeaderCell(getString("COLUMN_USER_NAME"), 30);

    var selectedUsergroupNames = getSelectionList();

    var usergroups = UMC.getAllUsergroups();
    var getAllUsers = UMC.getAllUsers();
    oDB = ArisData.getActiveDatabase();
    var isEvenCell = true;


    var aGroupGuids = getGroupGuids(true);
    for (var i = 0; i < aGroupGuids.length; i++) {
        var userGroup = oDB.FindGUID(aGroupGuids[i], Constants.CID_GROUP);
        var accessMap = userGroup.AccessRights()
        var it = accessMap.entrySet().iterator()



        while (it.hasNext()) {
            var entry = it.next()
            var assignedUserGUID = entry.getKey();
            var userrights = entry.getValue();
            arryTMP.push(assignedUserGUID,userGroup);
        }
    }
    




for (var i = 0; i < usergroups.size(); i++) {
    isEvenCell = !isEvenCell;
    var usergroup = usergroups.get(i);
    var name = usergroup.getName();

    if (!selectedUsergroupNames.isEmpty() && !selectedUsergroupNames.contains(name)) {
        continue;
    }

    g_Output.TableRow();

    // var licensePrivileges = UMC.getPrivilegesForUsergroup(usergroup, false, true);
    // var functionPrivileges = UMC.getPrivilegesForUsergroup(usergroup, true, false);
    var assignedUsers = UMC.getAssignedUsersForUsergroup(usergroup);


    writeTableCell(name, 40, isEvenCell);
    var rows = getMax(assignedUsers.size());
    for (var j = 0; j < rows; j++) {
        if (j != 0) {
            g_Output.TableRow();
            writeTableCell("", 40, isEvenCell);
        }

        if (assignedUsers.size() > j) {
            var user = assignedUsers.get(j);
                    writeTableCell(user.getLastName(), 30, isEvenCell);
                    writeTableCell(user.getFirstName(), 30, isEvenCell);
                    writeTableEmailCell(user.getEmail(), 50, isEvenCell);
                    writeTableCell(user.getName(), 30, isEvenCell);
                    writeTableCell(user.getId(), 50, isEvenCell);
                } else {
                    writeTableCell("", 30, isEvenCell);
                    writeTableCell("", 30, isEvenCell);
                    writeTableCell("", 40, isEvenCell);
                    writeTableCell("", 30, isEvenCell);
                    writeTableCell("", 30, isEvenCell);
                
            
        }
    }
}

for (var k = 0; k < arryTMP.length; k++) {

    g_Output.TableRow();
     writeTableCell(arryTMP[k][0], 30, isEvenCell);
     writeTableEmailCell(arryTMP[k][1], 50, isEvenCell);
     writeTableCell("", 30, isEvenCell);  
     writeTableCell("", 30, isEvenCell); 
}
g_Output.WriteReport();
}



// ------------------------------------------------------------------
// Creates array with all groups (sorted)
// ------------------------------------------------------------------
function getGroupGuids(bRecursive) {
    var aGroupGuids = new Array();

    var oGroups = ArisData.getSelectedGroups();
    if (bRecursive) {
        var oGroups_tmp = oGroups;
        for (var i = 0; i < oGroups_tmp.length; i++) {
            oGroups = oGroups.concat(oGroups_tmp[i].Childs(true));
        }
    }
    oGroups = ArisData.sort(oGroups, Constants.SORT_GROUPPATH, g_nloc);

    for (var i = 0; i < oGroups.length; i++) {
        aGroupGuids.push(oGroups[i].GUID());
    }
    oGroups = null;

    return aGroupGuids;
}