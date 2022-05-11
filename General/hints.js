unction isValidLink(oAttr) {
    var sLink = oAttr.getValue();
    return isURL(sLink) ? isValidURL(sLink) : isValidFile(sLink);
}   
 
function isValidURL(sLink) {
    try {
        var url = new java.net.URL(sLink);
        var connection = /*(HttpURLConnection)*/ url.openConnection();
        connection.setRequestMethod("GET");
        connection.connect();
        var responseCode = connection.getResponseCode();
        if(responseCode == 200/*OK*/ || responseCode == 302/*Found*/) {
            if (CHECK_ADS_DOCUMENT && isADSLink(sLink)) {
                return isValidADSLink(sLink)
            }
            return true;
        }
        if (responseCode == 301/*Moved permanently*/) {
            var redirectLink = connection.getHeaderField("Location");
            return isValidURL(redirectLink);
        }
    } catch(e) {
    }
    return false;
}
     
function isValidFile(sLink) {
    if (ignoreDMSLink(sLink)) return true;
    try {
        var file = new java.io.File(sLink);
        if (file.exists()) return true;
    } catch(e) {
    }
    return false;
}
 
function isBigEnough(value) {
  return value >= 10
}
 
let filtered = [12, 5, 8, 130, 44].filter(isBigEnough)
// filtered is [12, 130, 44]
  
g_nMap = ArisData.getActiveDatabase().ItemAttrMap(all_Groups, g_nLoc, Constants.AT_NAME);
    all_Groups = all_Groups.sort(sortByNameMapFunc);
    try {
        all_Groups.forEach(function (group) {
            var attr = getNameAttrFromAttrMap(group);
            if (attr == null) {
                sGroups.push("(Untitled)"); //all_Groups[i].Name(g_nLoc);
                g_Anzeige_SubGroups.push(group);
            }
   
 
   this.model.getGfxObjects().forEach(function (object) {
        those.model.deleteGfxObj(object);
    });
    this.model.CxnOccList().forEach(this.setZOrder(940));
 
  var listBoxItems = this.cache.filter(function (item, index) {
    return selection.some(function (number) {
      return number === index;
    });
  })
 
 
      var user = ArisData.ActiveUser();
      var isInGroup = user.UserGroups().some(function (userGroup) {
         
        return g_AUDIWritePermissionUserGroups.some(function (group) {
          return userGroup.IsEqual(group);
        });
          
 
function filterCxns(oCxns) {
        var oFilteredCxns = new Array();
        for (var i in oCxns) {
            var oCxn = oCxns[i];
            if (oCxn.KindNum() == Constants.CID_CXNOCC) oCxn = oCxn.Cxn();
             
            var oConnObjDef = getConnObjDef(oCxn);
             
            if (p_oOrgObject.IsEqual(oConnObjDef)) {
                oFilteredCxns.push(oCxn);
            }
        }
        return oFilteredCxns;
    }
     
    function getConnObjDef(oCxn) {
        if (getDirection() == Constants.EDGES_OUT)
            return oCxn.TargetObjDef();
        else
            return oCxn.SourceObjDef();
    }
 
 
Struktury v poli pro ulozeni vice hodnot
 
function addValueToArray(depth, model) {
    this.depth = depth;
    this.model = model;
}
 
  
 var assignedModels_ORG_DIAGRAMS = objOcc.ObjDef().AssignedModels([ORG_DIAGRAM]);
    if (isOrgChartSel) {
        for (var k = 0; k < assignedModels_ORG_DIAGRAMS.length; k++) {
           // modelList_ORGCHART.push([1, assignedModels_ORG_DIAGRAMS[k]]);
            ar_ORGCHART.push(new addValueToArray(1, assignedModels_ORG_DIAGRAMS[k]));
        } //for
    }
 
 
// cyklus for
for (var i in p_oProcessModels) {
        var oFuncDefs = p_oProcessModels[i].ObjDefListFilter(Constants.OT_FUNC);
        oFuncObjects = oFuncObjects.concat(oFuncDefs);
    }
 
 
// sort by value
function sortRelation(a, b) {
    var tmp_lhs = new java.lang.String(a.depth);
    return tmp_lhs.compareTo(new java.lang.String(b.depth));
}
 
function printFirstSheet() {
 
    ar_PEROSNAL.sort(sortRelation); //sort
    for (var i = 0; i < ar_PEROSNAL.length; i++) {
        var rowInfo = ar_PEROSNAL[i];
------------------------------------------------------------------------------------------------
 
 
 
Prepinani mezi dialogovymi okny.
Dialogs.MsgBox("Dialog without setActiveWizardPages, runs correct")
Dialogs.showDialog(new my_dialog(false), Constants.DIALOG_TYPE_WIZARD_NONLINEAR, "Title" )
 
Dialogs.MsgBox("Dialog with setActiveWizardPages, doesn't run correct")
Dialogs.showDialog(new my_dialog(true), Constants.DIALOG_TYPE_WIZARD_NONLINEAR, "Title" )
 
function my_dialog(bDoActiveWizardPages){
     
    this.getPages = function(){
        var Template0 = Dialogs.createNewDialogTemplate(520, 300, "Dialog 0");
        Template0.Text (10,10,400,20, "Text 0")
         
        var Template1 = Dialogs.createNewDialogTemplate(520, 300, "Dialog 1");
        Template1.Text    (10,10,400,20, "Next textbox must have value")
        Template1.TextBox (10,30,400,20, "txtBox1",0)
         
        var Template2 = Dialogs.createNewDialogTemplate(520, 300, "Dialog 2");
        Template2.Text (10,10,400,20, "Text 2")
         
        return [Template0, Template1, Template2]
    }
    this.init = function(){
        if (bDoActiveWizardPages){
            this.dialog.setActiveWizardPages([1,2]);           // <<<< this is the trouble making call
        }
    }
    this.isInValidState = function (iPageNumber){
        return true
    }
    this.canFinish = function (iPageNumber){
        return true
    }
 
    this.canGotoNextPage = function (iPageNumber){
        var lBool = true
        switch(iPageNumber){       
           case 1:
                var sName = this.dialog.getDialogElement("txtBox1").getText()
                if (sName==""){                   
                   lBool = false                   
                }
                break
        }
        return lBool
    } 
}
 
 
zalohovani
function DbBackup()
{
    var ADB   = ArisData.getActiveDatabase();
    var oFile;
    var oDbAdmin;
    var lOK;
    var sPath = "C:\\Download";
    var sFile = "WorkDB "+Date();
 
    Context.setSelectedPath(sPath);
    Context.setSelectedFile(sFile);
    oFile     = new java.io.File(sPath, sFile);
    oDbAdmin  = Context.getComponent("ServerAdmin");
    lOK       = oDbAdmin.backupDatabase(ADB, oFile);
 
    return;
}
 
 
Formatovani bunek v XLS
 var wb = Context.createExcelWorkbook("Excel_cellWithDateFormat.xls");
    var sheet = wb.createSheet("info");
    var stdStyle = sheet.cell(1, 1).getCellStyle();
    var cellStyle = wb.createCellStyle(wb.getFontAt(stdStyle.getFontIndex()), 5, 5, 5, 5, Constants.C_GREEN, Constants.C_GREEN, Constants.C_GREEN, Constants.C_GREEN, 1, 1, Constants.C_TRANSPARENT, Constants.C_TRANSPARENT, 0);
    var cellStyleVertical= wb.createCellStyle(wb.getFontAt(stdStyle.getFontIndex()), Constants.BORDER_THIN,Constants.BORDER_THIN,Constants.BORDER_THIN,Constants.BORDER_THIN,Constants.C_BLACK,Constants.C_BLACK,Constants.C_BLACK,Constants.C_BLACK,Constants.ALIGN_LEFT, Constants.ALIGN_LEFT,Constants.C_BLACK,Constants.C_WHITE,Constants.NO_FILL,Constants.XL_CELL_DATAFORMAT_GENERAL,false, 0, false, 90, true);
  
    var cellStyleDate = wb.createCellStyle(wb.getFontAt(stdStyle.getFontIndex()), Constants.BORDER_THIN,Constants.BORDER_THIN,Constants.BORDER_THIN,Constants.BORDER_THIN,Constants.C_BLACK,Constants.C_BLACK,Constants.C_BLACK,Constants.C_BLACK,Constants.ALIGN_LEFT, Constants.ALIGN_LEFT,Constants.C_BLACK,Constants.C_WHITE,Constants.NO_FILL,Constants.XL_CELL_DATAFORMAT_M_D_YY,false, 0, false, 0, true);
   actualDate = new Packages.java.util.Date();
  // var fSimpleDateFormat = new Packages.java.text.SimpleDateFormat("dd.MM.yyyy HH:mm:ss");
  // var fSimpleDateFormat = new Packages.java.text.SimpleDateFormat("dd.MM.yyyy");
   //sDate = fSimpleDateFormat.format(actualDate);
    
    sheet.cell(2, 2).setCellStyle(cellStyle);
     
    var myCell = sheet.cell(3,3)
    myCell.setCellValue("Vertical");
    myCell.setCellStyle(cellStyleVertical);
     
    var myCell_1 = sheet.cell(4,4)
    myCell_1.setCellValue(actualDate);
    myCell_1.setCellStyle(cellStyleDate);
     
     
    wb.write();
 
 
 
 
 
Fomrmatovani vystupu
var today = new Date();
var reportFileName = "report_"+today.getDate()+"-"+(today.getMonth()+1)+"-"+today.getFullYear()+".pdf";
Context.setSelectedFile(reportFileName);
Context.setSelectedPath("C:/DataLink/Reports/");
Context.setSelectedFormat(Constants.OutputPDF);
Vysledek se pak ulozi do "C:\DataLink\Reports\report_14-2-2018.pdf" kde datum odpovida dnu spusteni, da se i stejnym zpusobem doplnit hodinu, minuta pokud to bude nutne a to tak, ze
se do radku reportFileName prida
var reportFileName = "report_"+today.getDate()+"-"+(today.getMonth()+1)+"-"+today.getFullYear()+"-"+today.getHours()+
"-"+today.getMinutes()+".pdf"; 
Vysledkem pak budereport_14-2-2018-19-40.pdf
 
 
 
 
//Deleting disturbig blanks in object names
function clearName(oDef){
    var sName = oDef.Attribute(Constants.AT_NAME,nloc).getValue();
    sName = sName.replaceAll("  ", " ");
    sName = sName.replaceAll(" \n", "\n");
    sName = sName.replaceAll(" \r", "\r");
    oDef.Attribute(Constants.AT_NAME,nloc).setValue(sName);
 
    return oDef;
}
 
 
 
 
java.util.Collections.sort(listSortedProductCodes);
 
  for each(var oFuncOcc in oFuncOccList) {
        if (!(isProcessInterface(oFuncOcc.SymbolNum()) || isStatus(oFuncOcc.SymbolNum()))) {
            oSuperObjDef.push(oFuncOcc.ObjDef());
        }
    }
 
 for (foundIndex in found) {
 
       var cxnDef = found[foundIndex];
   }
 
   var myHashMap = new Packages.java.util.HashMap();
   myHashMap.put(sKey, sValue);
 
   for (var entry = myHashMap.keySet().iterator(); entry.hasNext();) {
       var valueMAP = entry.next();
       var key = myHashMap.get(valueMAP);
   }
 
 
   //sortovani hashmapy
   keysa = new Packages.java.util.TreeSet(myHashMap.keySet());
 
   var aa = getKeysByValue(myHashMap, "S")
 
   function getKeysByValue(myHashMap, value) {
       var keys = new Packages.java.util.HashMap();
       for (var entry = myHashMap.keySet().iterator(); entry.hasNext();) {
           var valueMAP = entry.next();
           var key = myHashMap.get(valueMAP);
 
           if (StrComp(value, key) == 0) {
               //keys.put(valueMAP/*entry.getKey()*/);
               aa.push(valueMAP)
           }
 
       }
 
       return aa;