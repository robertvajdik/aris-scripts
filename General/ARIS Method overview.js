/****************************************************************************************************************/
/*  Author:         RV                                                                                          */
/*  Organisation:   IDSA                                              .                                         */
/*  Date:           2021/10                                                                                     */
/*  Description:    Method Info                                                                                */
/****************************************************************************************************************/
Context.setProperty("excel-formulas-allowed", false); //default value is provided by server setting (tenant-specific): "abs.report.excel-formulas-allowed" 

var g_Output = Context.createOutputObject();
var g_Locale = 1033;
var g_Loc = Context.getSelectedLanguage();

var oDB = ArisData.getActiveDatabase();
var methodFilter = ArisData.ActiveFilter();
var sFilterName = ArisData.ActiveFilter().Name(Context.getSelectedLanguage());

var sTenantName = ArisData.getTenantName();

var g_CurrentRowName = "";
var g_CurrentSheetStartName = "";


var nallallowedosymbolstypes = new Array();
var hm_symbols = new Packages.java.util.HashMap();
var treeSet = new Packages.java.util.TreeSet();
 
function addValueToArray(symbolType,symbolNum, API_NAME  ) {
    this.symbolType = symbolType;
    this.symbolNum = symbolNum;
    this.API_NAME = API_NAME;
  
}

main();

function main() {

    if (!methodFilter.IsFullMethod()) {
        Dialogs.MsgBox(getString("FITLTER"), Constants.MSGBOX_BTN_OK | Constants.MSGBOX_ICON_INFORMATION, Context.getScriptInfo(Constants.SCRIPT_NAME));
        return;
    }

    initializeOutput();

    var nallallowedmodeltypes = methodFilter.ModelTypes(Constants.ARISVIEW_ALL);
    // nallallowedmodeltypes = ArisData.sort( nallallowedmodeltypes, Constants.AT_NAME, Context.getSelectedLanguage() );
    nallallowedmodeltypes = nallallowedmodeltypes.sort();

    var nallallowedobjecttypes = methodFilter.ObjTypes();
    nallallowedobjecttypes = nallallowedobjecttypes.sort(sortByObjTypeName);




    overviewALL(nallallowedmodeltypes, nallallowedobjecttypes);
    overviewModels(nallallowedmodeltypes, nallallowedobjecttypes);
    overviewObjects(nallallowedmodeltypes, nallallowedobjecttypes);
    overviewSymbols(nallallowedosymbolstypes);

    g_Output.WriteReport();
}

function overviewALL(nallallowedmodeltypes, nallallowedobjecttypes) {
    startTableSheet();
    newTableRow();
    writeHeader(getString("REPORT_TITLE"), 3);
    newTableRow();
    writeDescription(getString("REPORT_DESCRIPTION") + " " + ArisData.getActiveDatabase().ServerName(), 3);
    newTableRow();
    writeTableCell("");
    newTableRow();

    writeTableHeaderCell(getString("COLUMN_MODELS"), 70);
    writeTableHeaderCell(getString("COLUMN_OBJECTS"), 60);
    writeTableHeaderCell(getString("COLUMN_SYMBOLS"), 80);

    /* writeTableHeaderCell(getString("COLUMN_NAME"), 70);
     writeTableHeaderCell(getString("COLUMN_ORIGINAL_NAME"), 50);
     writeTableHeaderCell(getString("COLUMN_TYPE_NUMBER"), 40);
     writeTableHeaderCell(getString("COLUMN_API_NAME"), 50);
     writeTableHeaderCell(getString("COLUMN_TYPE"), 40);*/
    newTableRow();
    var isEvenRow = true;
    for (var i = 0; i < nallallowedmodeltypes.length; i++) {
        var bFirstModel = true;
        isEvenRow = !isEvenRow;

        var sModelType = methodFilter.ModelTypeName(nallallowedmodeltypes[i]);
        var sModelAPI_NAME = methodFilter.getAPIName(Constants.CID_MODEL, nallallowedmodeltypes[i]);

        for (var j = 0; j < nallallowedobjecttypes.length; j++) {
            var bFirstObject = true;
            var sObjectType = methodFilter.ObjTypeName(nallallowedobjecttypes[j]);
            var sObjectTAPI_NAME = methodFilter.getAPIName(Constants.CID_OBJDEF, nallallowedobjecttypes[j]);
            var nsymtypenum = methodFilter.Symbols(nallallowedmodeltypes[i], nallallowedobjecttypes[j]);
            nsymtypenum.sort(sortBySymbolName);

            for (var k = 0; k < nsymtypenum.length; k++) {
                var sSymbolType = methodFilter.SymbolName(nsymtypenum[k]);
                var sSymbolTAPI_NAME = methodFilter.getAPIName(Constants.CID_OBJOCC, nsymtypenum[k]);

                newTableRow();
                writeTableCell(sModelType + " [" + nallallowedmodeltypes[i] + "]" + " (" + sModelAPI_NAME + ")", 70, isEvenRow);
                writeTableCell(sObjectType + " [" + nallallowedobjecttypes[j] + "]" + " (" + sObjectTAPI_NAME + ")", 60, isEvenRow);
                writeTableCell(sSymbolType + " [" + nsymtypenum[k] + "]" + " (" + sSymbolTAPI_NAME + ")", 80, isEvenRow);
                newTableRow();
                //1.version keep duplicity
                //nallallowedosymbolstypes.push(new addValueToArray(sSymbolType, sSymbolTAPI_NAME,nsymtypenum[k]));
                //2. method redundant
                 hm_symbols.put(sSymbolType, new addValueToArray(sSymbolType, nsymtypenum[k], sSymbolTAPI_NAME));
 
            }
        }
    }
    /*

     var allLocales = methodFilter.getMethodLocales()
     for (var i = 0; i < allLocales.length; i++) {
         //english name of the language
         //  var sName = allLocales[i].getLocale().getDisplayName(new java.util.Locale("en", "US"))
     }*/
    endTableSheet(getIndexedSheetName(ArisData.getActiveDatabase().ServerName(), getString("OVERVIEW_ALL")));
}


function overviewModels(nallallowedmodeltypes, nallallowedobjecttypes) {
    startTableSheet();
    newTableRow();

    writeTableHeaderCell(getString("COLUMN_NAME"), 70);
    //writeTableHeaderCell(getString("COLUMN_ORIGINAL_NAME"), 50);
    writeTableHeaderCell(getString("COLUMN_TYPE_NUMBER"), 40);
    writeTableHeaderCell(getString("COLUMN_API_NAME"), 50);
    writeTableHeaderCell(getString("COLUMN_TYPE"), 40);
    writeTableHeaderCell(getString("COLUMN_VIEW"), 40);
    newTableRow();
    var isEvenRow = true;


    nallallowedmodeltypes = nallallowedmodeltypes.sort(sortByModelTypeName);
    
    for (var i = 0; i < nallallowedmodeltypes.length; i++) {
        var bFirstModel = true;
        isEvenRow = !isEvenRow;

        var sModelType = methodFilter.ModelTypeName(nallallowedmodeltypes[i]);
        // var sModelOriginalTypeName = methodFilter.getOriginalAttrTypeName (nallallowedmodeltypes[i]);
        var sModelOriginalTypeName = methodFilter.getOriginalAttrValueTypeName(nallallowedmodeltypes[i]);
        var sModelAPI_NAME = methodFilter.getAPIName(Constants.CID_MODEL, nallallowedmodeltypes[i]);
        var bUserDefinedModelType = methodFilter.isUserDefinedModelType(nallallowedmodeltypes[i]);

        var sarisview = ""; // String for the ARIS - View.
        switch (methodFilter.View(nallallowedmodeltypes[i])) {
            case Constants.ARISVIEW_ORG:
                sarisview = getString("TEXT_1");
                break;
            case Constants.ARISVIEW_FUNC:
                sarisview = getString("TEXT_2");
                break;
            case Constants.ARISVIEW_DATA:
                sarisview = getString("TEXT_3");
                break;
            case Constants.ARISVIEW_CTRL:
                sarisview = getString("TEXT_4");
                break;
            case Constants.ARISVIEW_OUTPUT:
                sarisview = getString("TEXT_5");
                break;
        }

        newTableRow();
        writeTableCell(sModelType, 70, isEvenRow);
       // writeTableCell("", 40, isEvenRow);
        writeTableCell(nallallowedmodeltypes[i], 20, isEvenRow);
        writeTableCell(sModelAPI_NAME, 40, isEvenRow);
        writeTableCell(getARISAdminType(bUserDefinedModelType), 40, isEvenRow);
        writeTableCell(sarisview, 40, isEvenRow);
    }
    endTableSheet(getIndexedSheetName(getString("METHOD"), getString("OVERVIEW_MODELS")));
}

function overviewObjects(nallallowedmodeltypes, nallallowedobjecttypes) {
    startTableSheet();
    newTableRow();

    writeTableHeaderCell(getString("COLUMN_NAME"), 70);
   // writeTableHeaderCell(getString("COLUMN_ORIGINAL_NAME"), 50);
    writeTableHeaderCell(getString("COLUMN_TYPE_NUMBER"), 40);
    writeTableHeaderCell(getString("COLUMN_API_NAME"), 50);
    //writeTableHeaderCell(getString("COLUMN_TYPE"), 40);
    writeTableHeaderCell(getString("COLUMN_VIEW"), 40);
    newTableRow();
    var isEvenRow = true;

    for (var j = 0; j < nallallowedobjecttypes.length; j++) {
        var bFirstObject = true;
        var sObjectType = methodFilter.ObjTypeName(nallallowedobjecttypes[j]);
        var sObjectTAPI_NAME = methodFilter.getAPIName(Constants.CID_OBJDEF, nallallowedobjecttypes[j]);
        isEvenRow = !isEvenRow;

        var bUserDefinedModelType = methodFilter.isUserDefinedModelType(nallallowedobjecttypes[i]);

        var sarisview = ""; // String for the ARIS - View.
        switch (methodFilter.View(nallallowedmodeltypes[i])) {
            case Constants.ARISVIEW_ORG:
                sarisview = getString("TEXT_1");
                break;
            case Constants.ARISVIEW_FUNC:
                sarisview = getString("TEXT_2");
                break;
            case Constants.ARISVIEW_DATA:
                sarisview = getString("TEXT_3");
                break;
            case Constants.ARISVIEW_CTRL:
                sarisview = getString("TEXT_4");
                break;
            case Constants.ARISVIEW_OUTPUT:
                sarisview = getString("TEXT_5");
                break;
        }

        newTableRow();
        writeTableCell(sObjectType, 70, isEvenRow);
       // writeTableCell("", 40, isEvenRow);
        writeTableCell(nallallowedobjecttypes[j], 20, isEvenRow);
        writeTableCell(sObjectTAPI_NAME, 40, isEvenRow);
        // writeTableCell("", 40, isEvenRow);
        writeTableCell(sarisview, 40, isEvenRow);

    }
    //} 

    endTableSheet(getIndexedSheetName(getString("METHOD"), getString("OVERVIEW_OBJECTS")));
}

function overviewSymbols(nallallowedosymbolstypes) {
    startTableSheet();
    newTableRow();

    writeTableHeaderCell(getString("COLUMN_NAME"), 70);
   // writeTableHeaderCell(getString("COLUMN_ORIGINAL_NAME"), 50);
    writeTableHeaderCell(getString("COLUMN_TYPE_NUMBER"), 40);
    writeTableHeaderCell(getString("COLUMN_API_NAME"), 50);    
    writeTableHeaderCell(getString("COLUMN_TYPE"), 40);

     var isEvenRow= true;
     var ts_symbols_sorted = new Packages.java.util.TreeSet(hm_symbols.keySet());
     var it = ts_symbols_sorted.iterator(); // Iterator interface

     while (it.hasNext()) {
         isEvenRow = !isEvenRow;
         var key = it.next();
         var value = hm_symbols.get(key);
         var bUserDefinedModelType = methodFilter.isUserDefinedSymbol(value.symbolNum);

         newTableRow();
         writeTableCell(key, 70, isEvenRow);
         writeTableCell(value.symbolNum, 20, isEvenRow);
         writeTableCell(value.API_NAME, 40, isEvenRow);
         writeTableCell(getARISAdminType(bUserDefinedModelType), 40, isEvenRow);
      }
   endTableSheet(getIndexedSheetName(getString("METHOD"), getString("OVERVIEW_SYMBOLS")));
}

function getARISAdminType(bUserDefinedModelType){

  var sUserDefinedModelType = ""; // String for the ARIS - View.
        switch (bUserDefinedModelType) {
            case true:
                //sUserDefinedModelType = "ARIS default(customized)";
                sUserDefinedModelType = "derived";
                break;
            case false:
                sUserDefinedModelType = "";
                break;
        }
        
        return sUserDefinedModelType;
}

function sortByModelTypeName(a, b) {
    return StrComp(methodFilter.ModelTypeName(a), methodFilter.ModelTypeName(b));
}

function sortByObjTypeName(a, b) {
    return StrComp(methodFilter.ObjTypeName(a), methodFilter.ObjTypeName(b));
}

function sortBySymbolName(a, b) {
    return StrComp(methodFilter.SymbolName(a), methodFilter.SymbolName(b));
}


function writeTableCell(text, width, isEvenRow) {
    if (!width) width = 40;
    bgcolor = Constants.C_WHITE;
    if (isEvenRow) bgcolor = setColor(242, 242, 242);
    g_Output.TableCell(text, width, getString("ID_DEFAULT_FONT"), 10, Constants.C_BLACK, bgcolor, 0, Constants.FMT_VTOP | Constants.FMT_LEFT, 0);
}

function writeTableCell2(text, width, isEvenRow2) {
    if (!width) width = 40;
    bgcolor = Constants.C_WHITE;
    if (isEvenRow2) bgcolor = setColor(116, 187, 251);
    g_Output.TableCell(text, width, getString("ID_DEFAULT_FONT"), 10, Constants.C_BLACK, bgcolor, 0, Constants.FMT_VTOP | Constants.FMT_LEFT, 0);
}


function newTableRow() {
    if (!addTableRow()) {
        endTableSheet(getIndexedSheetName(g_CurrentSheetStartName, g_CurrentRowName));
        startTableSheet();
        g_CurrentSheetStartName = g_CurrentRowName;
        addTableRow();
    }
}