/****************************************************************************************************************/
/*  Author:         RV                                                                                          */
/*  Organisation:   IDSA                                                                                        */
/*  Date:           2020/11                                                                                     */
/*  Description:    list of reports by categories - green rows are customized items                             */                                                         */
/****************************************************************************************************************/
var hideExtendedScripts = true; //show help files for scripts!!
list of reports by categories
var g_Output = Context.createOutputObject();
var gnLoc = Context.getSelectedLanguage()

/**
 *returns true if array contains an element or false if not.
 *@return boolean
 *@type boolean
 *@param {-} p_element an element which should be find in the Array
 *@addon
 */
Array.prototype.contains = function(p_element) {
    for (var i = 0; i < this.length; i++) {
        if (this[i].toString().equals(p_element.toString())) return true;
    }
    return false;
}

function main() {

    initializeOutput();
    var isEvenRow = false;

    var lComponentID = [1, 3, 5, 6, 7, 10, 11]; //all [0,1- reposts,3 -semantic check,5,6,7 -macro,10,11]
    var scriptAdminComponent = Context.getComponent("ScriptAdmin")
    var aScriptComponentInfo = scriptAdminComponent.getScriptComponents().sort();;
    for (var i = 0; i < aScriptComponentInfo.length; i++) {
        var componentID = aScriptComponentInfo[i].getComponentID();
        var sheetName = aScriptComponentInfo[i].getComponentName();
        if (sheetName == "ClientScript")
            sheetName = "Macros";

        if (lComponentID.contains(componentID) == true) { // risks
            var categories = scriptAdminComponent.getCategories(componentID, gnLoc)
            categories = ArisData.sort(categories, Constants.AT_NAME, gnLoc);

            startTableSheet();
            newTableRow();
            writeHeader(getString("REPORT_TITLE"), 7);
            newTableRow();

            writeDescription(getString("REPORT_DESCRIPTION") + ArisData.getActiveDatabase().ServerName() + " (" + ArisData.getActiveUser().Name(gnLoc) + ") Lang:" + gnLoc + " Date: " + new Date().toLocaleDateString().split("/"), 7);
            newTableRow();
            writeTableCell("", 0, Constants.C_BLACK, Constants.C_TRANSPARENT);
            newTableRow();

            writeTableHeaderCell(getString("COLUMN_CATEGORIE"), 20);
            writeTableHeaderCell(getString("COLUMN_GUID"), 30);
            writeTableHeaderCell(getString("COLUMN_NAME"), 30);
            writeTableHeaderCell(getString("COLUMN_DESC"), 30);
            writeTableHeaderCell("Company EN"); // 1033
            writeTableHeaderCell("Company DE"); //1031
            writeTableHeaderCell("Author EN");
            writeTableHeaderCell("Author DE");

            var bColored = false;
            for (var j = 0; j < categories.length; j++) {
                var category = categories[j];
                if (componentID == 0) {
                    var scriptInfos = scriptAdminComponent.getScriptInfos(componentID, null, gnLoc).sort(sortName);
                }

                var scriptInfos = scriptAdminComponent.getScriptInfos(componentID, category.getCategoryID(), gnLoc).sort(sortName);
                var scriptInfosEN = scriptAdminComponent.getScriptInfos(componentID, category.getCategoryID(), 1033).sort(sortName);
                var scriptInfosDE = scriptAdminComponent.getScriptInfos(componentID, category.getCategoryID(), 1031).sort(sortName);
                var bFirst = true;

                for (var k = 0; k < scriptInfos.length; k++) {

                    var scriptInfo = scriptInfos[k];
                    var scriptInfoEN = scriptInfosEN[k];
                    var scriptInfoDE = scriptInfosDE[k];

                    if (hideExtendedScripts)
                        if (scriptInfo.isSimpleFile()) continue;
                    var bgColor = bColored ? RGB(220, 230, 241) : Constants.C_TRANSPARENT;
                    var catColor = bFirst ? Constants.C_BLACK : Constants.C_GREY_80_PERCENT;

                    var categoryName = getCategoryName(category);
                    var sID = scriptInfo.getID();
                    var sName = scriptInfo.getName();
                    var sDesc = scriptInfo.getDescription();
                    var sComapany = scriptInfo.getCompany();
                    var sAuthor = scriptInfo.getAuthor();

                    var sComapanyEN = scriptInfoEN.getCompany();
                    var sAuthorEN = scriptInfoEN.getAuthor();
                    var sComapanyDE = scriptInfoDE.getCompany();
                    var sAuthorDE = scriptInfoDE.getAuthor();

                    newTableRow();
                    if ((sComapany == "Software AG" && sAuthor == "Software AG") &&
                        (sComapanyEN == "Software AG" && sAuthorEN == "Software AG") &&
                        (sComapanyDE == "Software AG" && sAuthorDE == "Software AG")) {

                        writeTableCellCus(categoryName, 40, catColor, bgColor);
                        writeTableCell(sID, 40, catColor, bgColor);
                        writeTableCell(sName, 40, catColor, bgColor);
                        writeTableCell(sDesc, 60, catColor, bgColor);

                        writeTableCell(sComapanyEN, 20, catColor, bgColor);
                        writeTableCell(sAuthorEN, 20, catColor, bgColor);
                        writeTableCell(sComapanyDE, 20, catColor, bgColor);
                        writeTableCell(sAuthorDE, 20, catColor, bgColor);
                    } else {
                        writeTableCellCus(categoryName, 40, catColor, bgColor);
                        writeTableCellRED(sID, 40, catColor, bgColor);
                        writeTableCellRED(sName, 40, catColor, bgColor);
                        writeTableCellRED(sDesc, 60, catColor, bgColor);

                        writeTableCellRED(sComapanyEN, 20, catColor, bgColor);
                        writeTableCellRED(sAuthorEN, 20, catColor, bgColor);
                        writeTableCellRED(sComapanyDE, 20, catColor, bgColor);
                        writeTableCellRED(sAuthorDE, 20, catColor, bgColor);
                    }
                    newTableRow();
                    bFirst = false;
                }
                // bColored = !bColored;
            }
            endTableSheet(getIndexedSheetName("ARIS", sheetName));
        }
    }

    function getCategoryName(category) {
        if (componentID == 3) { //COMP_SEMCHECK
            if (category.getCategoryID() == "9b676eb9-ec3d-4b53-b508-a62475f4d433") return getString("RULETYPES");
            if (category.getCategoryID() == "54e057ed-80b1-4521-9545-6496bcd27cd1") return getString("PROFILES");
        }
        return category.getName();
    }

    function writeTableCell(text, width, catColor, bgColor) {
        // if (!width) width = 40;
        // bgcolor = Constants.C_WHITE;
        //  if (isEvenRow) bgcolor = setColor(240, 128, 128);
        g_Output.TableCell(text, width, getString("ID_DEFAULT_FONT"), 10, Constants.C_BLACK, Constants.C_TRANSPARENT, 0, Constants.FMT_VTOP | Constants.FMT_LEFT, 0);
    }

    function writeTableCellCus(text, width, catColor, bgColor) {
        // if (!width) width = 40;
        // bgcolor = Constants.C_WHITE;
        // if (isEvenRow) bgcolor = setColor(240, 128, 128);
        g_Output.TableCell(text, width, getString("ID_DEFAULT_FONT"), 10, catColor, bgColor, 0, Constants.FMT_VTOP | Constants.FMT_LEFT, 0);
    }

    function writeTableCellRED(text, width, catColor, bgColor) {
        // if (!width) width = 40;
        // bgcolor = Constants.C_WHITE;
        //if (isEvenRow) bgcolor = setColor(240, 128, 128);
        g_Output.TableCell(text, width, getString("ID_DEFAULT_FONT"), 10, Constants.C_BLACK, RGB(66, 189, 59), 0, Constants.FMT_VTOP | Constants.FMT_LEFT, 0);
    }
    g_Output.WriteReport();
    ArisData.getActiveDatabase().clearCaches();
}

function RGB(r, g, b) {
    return (new java.awt.Color(r / 255.0, g / 255.0, b / 255.0, 1)).getRGB();
}

function newTableRow() {
    if (!addTableRow()) {
        endTableSheet(getIndexedSheetName(g_CurrentSheetStartName, g_CurrentRowName));
        startTableSheet();
        g_CurrentSheetStartName = g_CurrentRowName;
        addTableRow();
    }
}

function sortName(a, b) {
    return StrComp(a.getName(), b.getName());
}

main();