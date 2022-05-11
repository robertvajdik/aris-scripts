/**************************************************************************/
/*  Script: Popis pracovního místa                                        */
/*  @Author: RV (in case of help mail me to robert.vajdik@idsa.cz)        */
/*  Date: 2021/06                                                         */
/*  Context: Object                                                       */
//  History: draft                                                        */
//  History: 2021/06 I/O objects                                          */
/**************************************************************************/



/**** User define values *****/
//var cnx_KPI_attr = getAttributNumber("87d6c570-38bd-11e2-42d5-d4bed91e03ba"); //  GUID of attribut KPI (Váha KPI-(motivace) ) - User define attribute

/**** User define values *****/
var g_nLoc = Context.getSelectedLanguage();
//var aSelObjDefs= ArisData.getSelectedObjDefs(); 
var aSelObjDefs = -1;
var aSelObjOccs = ArisData.getSelectedObjOccs();
var isPracovnik = false; // Context is FM or Employee
var isManager = false; // Context is FM or Employee

var showRidiUtvar = true; // Context is FM or Employee

var tmpEPC_models = new Array();

//step 7d
var listOfDocKonwlege_Process = new Array();



var MT = Array("MT_EEPC", "MT_EEPC_COLUMN", "MT_EEPC_TAB_HORIZONTAL", "MT_EEPC_INST", "MT_EEPC_MAT",
    "MT_EEPC_ROW", "MT_EEPC_TAB", "MT_OFFICE_PROC", "MT_PRCS_CHN_DGM", "MT_BPD_BPMN",
    "MT_SCEN_DGM", "MT_IND_PROC", "MT_PCD_MAT",
    "MT_ENTERPRISE_BPMN_COLLABORATION", "MT_ENTERPRISE_BPMN_PROCESS"); // BLUE-10581



function main() {
    outfile = Context.createOutputObject(Constants.OUTWORD, Context.getSelectedFile());
    outfile.Init(g_nLoc);
    defineStyle()

    if (aSelObjDefs.length > 0) {
        for (var i = 0; i < aSelObjDefs.length; i++) {
            var occList = aSelObjDefs[i].OccList();
            for (var j = 0; j < occList.length; j++) {
                doPPM(occList[j]);
            }
        } //for
        //TODO pousti se jen nad OCC    
    } else if (aSelObjOccs.length > 0) {
        for (var j = 0; j < aSelObjOccs.length; j++) {
            doPPM(aSelObjOccs[j]);
        }
    }

    outfile.WriteReport(Context.getSelectedPath(), Context.getSelectedFile());
    Context.setProperty(Constants.PROPERTY_SHOW_OUTPUT_FILE, true);
    Context.setProperty(Constants.PROPERTY_SHOW_SUCCESS_MESSAGE, false);
}

/**
 * Definition of Style
 */
function defineStyle() {
    outfile.DefineF("REPORT1", getString("TEXT_FONT_DEFAULT"), 24, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_BOLD | Constants.FMT_CENTER, 0, 21, 0, 0, 0, 1);
    outfile.DefineF("Header_Left_Blue", getString("TEXT_FONT_DEFAULT"), 9, RGB(29, 74, 119), Constants.C_TRANSPARENT, Constants.FMT_LEFT, 0, 0, 0, 0, 0, 1);
    outfile.DefineF("Header_Center_Blue", getString("TEXT_FONT_DEFAULT"), 9, RGB(29, 74, 119), Constants.C_TRANSPARENT, Constants.FMT_VCENTER, 0, 21, 0, 0, 0, 1);
    outfile.DefineF("Header_Big_Blue", getString("TEXT_FONT_DEFAULT"), 14, RGB(29, 74, 119), Constants.C_TRANSPARENT, Constants.FMT_LEFT | Constants.FMT_BOLD, 0, 21, 0, 0, 0, 1);

    outfile.DefineF("Heading 0", getString("TEXT_STYLE_HEADER1"), 11, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_LEFT, 0, 21, 0, 0, 0, 1);
    outfile.DefineF(getString("TEXT_STYLE_DEFAULT"), getString("TEXT_FONT_DEFAULT"), 9, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_LEFT, 0, 21, 0, 0, 0, 1);
    outfile.DefineF("CELL_STYLE_LONG", getString("TEXT_FONT_DEFAULT"), 9, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_LEFT, 0, 0, 0, 0, 0, 1);
    outfile.DefineF("CELL_STYLE_CENTER", getString("TEXT_FONT_DEFAULT"), 9, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_CENTER, 0, 0, 0, 0, 0, 1); //for "-" symbol

    outfile.DefineF("Default_BoldOnBrown", getString("TEXT_FONT_DEFAULT"), 10, RGB(29, 74, 119), RGB(241, 241, 241), Constants.FMT_BOLD | Constants.FMT_LEFT | Constants.FMT_VCENTER, 1, 0, 0, 0, 0, 1);

    setReportHeaderFooterPPM(outfile, g_nLoc, false, false, false);
}

/**
 * Main logic
 */
function doPPM(occ) {
    /*   if (occ.ObjDef().TypeNum() == 46 && occ.SymbolNum() == 2) { //context is Pracovnik
           isPracovnik = true;
           var name = occ.ObjDef().Attribute(Constants.AT_NAME, g_nLoc).getValue();
           var osobniCislo = occ.ObjDef().Attribute(numAttr_OsobniCislo, g_nLoc).getValue();

           var cnxOut_Occs = getCnxOut_FM(occ); //get FM
           var pracovniPozice = "";
           var cisloPM = "";
           var cinnosti = ""

           //loop FM
           for (var e = 0; e < cnxOut_Occs.length; e++) {
               var jeClenemOrganu = "";
               var tmp_clenTypu = getCnxOut_clenOrangu(cnxOut_Occs[e]);
               if (tmp_clenTypu.length > 0) {
                   for (var r = 0; r < tmp_clenTypu.length; r++) {
                       jeClenemOrganu += tmp_clenTypu[r].Name(g_nLoc) + " ";
                   } //for
               }
               if (isManager) {
                   var superiorObjs = getCnx_SuperiorObjs(cnxOut_Occs[e]);
                   var KPI_Names = new Array();
                   var KPI_Percents = new Array();

                   for (var a = 0; a < superiorObjs.length; a++) {
                       var aCnxs = superiorObjs[a].CxnListFilter(Constants.EDGES_OUT);
                       for (var b = 0; b < aCnxs.length; b++) {
                           if (aCnxs[b].TypeNum() == 486) {
                               Context.writeLog("CIL Target " + aCnxs[b].TypeNum() + " " + aCnxs[b].TargetObjDef().Name(-1))
                               var percent = aCnxs[b].Attribute(cnx_KPI_attr, -1).getValue()
                               KPI_Names.push(aCnxs[b].TargetObjDef().Name(g_nLoc));
                               KPI_Percents.push(percent);
                           }
                       } //for
                   }
                   var types = getCnxOut_RoleAssign(cnxOut_Occs[e]); //part3
               } else {
                   var types = getCnxOut_TypPracovnika(cnxOut_Occs[e]); //part3
               }
               //Part4
               var typPracovnika = getCnxOut_TypPracovnika(cnxOut_Occs[e]);

           } //for FM

           //Part5
           var listOfFunctions = getFunctionOfOccsTypPracovnika(typPracovnika); //typPracovnika is Array
           var listOfApplications = getConnectedApplications(listOfFunctions); // Functions

           //part 7a
           var listOfDocKnowlege_EPC = getConnectedDocKnowledge(listOfFunctions); // Functions
      

           //ORG
           var ORG_name = "";
           if (cnxOut_Occs.length > 0) {
               for (var i = 0; i < cnxOut_Occs.length; i++) {
                   pracovniPozice += cnxOut_Occs[i].ObjDef().Name(g_nLoc) + " ";
                   cisloPM += cnxOut_Occs[i].ObjDef().Attribute(numAttr_cislo_PM, g_nLoc).getValue() + " ";
                   nakladoveStredisko += cnxOut_Occs[i].ObjDef().Attribute(numAttr_NakladoveStre, g_nLoc).getValue() + " ";

                   // get supperior cnx
                   var occs_ORG = getCnxOut_ORG(cnxOut_Occs[i]);
                   if (occs_ORG.length > 0) {
                       for (var j = 0; j < occs_ORG.length; j++) {
                           if (j == occs_ORG.length)
                               ORG_name += occs_ORG[j].ObjDef().Name(g_nLoc) + "\n";
                           else
                               ORG_name += occs_ORG[j].ObjDef().Name(g_nLoc) + " ";
                       } //for
                   }
               } //for
           } //if
           ////////////////////////////////////////////////////////////////////////////////////////////////
       } else*/
    if (occ.ObjDef().TypeNum() == 45 && (occ.SymbolNum() == 143 || occ.SymbolNum() == 467)) { // Context is Funkcni misto
        isPracovnik = false; //Context is FM
        if (occ.SymbolNum() == 467)
            isManager = true;
        var name = occ.ObjDef().Attribute(Constants.AT_NAME_FULL, g_nLoc).getValue();
        var typPracovnika = getCnxOut_TypPracovnika(occ);

        var jeClenemOrganu = "";
        var tmp_clenTypu = getCnxOut_clenOrangu(occ);
        if (tmp_clenTypu.length > 0) {
            for (var r = 0; r < tmp_clenTypu.length; r++) {
                jeClenemOrganu += tmp_clenTypu[r].Name(g_nLoc) + " ";
            } //for
        }
        if (isManager) {
            var superiorObjs = getCnx_SuperiorObjs(occ);
            var KPI_Names = new Array();
            var KPI_Percents = new Array();

            for (var a = 0; a < superiorObjs.length; a++) {
                var aCnxs = superiorObjs[a].CxnListFilter(Constants.EDGES_OUT);
                for (var b = 0; b < aCnxs.length; b++) {
                    if (aCnxs[b].TypeNum() == 486) {
                        Context.writeLog("CIL Target " + aCnxs[b].TypeNum() + " " + aCnxs[b].TargetObjDef().Name(-1))
                        var percent = aCnxs[b].Attribute(cnx_KPI_attr, -1).getValue()
                        KPI_Names.push(aCnxs[b].TargetObjDef().Name(g_nLoc));
                        KPI_Percents.push(percent);
                    }
                } //for
            }
            var types = getCnxOut_RoleAssign(occ); //part3
        } else {
            var types = getCnxOut_TypPracovnika(occ); //part3
        }
        //part 4
        //already load var typPracovnika = getCnxOut_TypPracovnika(occ);

        //part 5
        //  var typPracovnika = getCnxOut_TypPracovnika(occ);
        var listOfFunctions = getFunctionOfOccsTypPracovnika(typPracovnika); //typPracovnika is Array
        var listOfApplications = getConnectedApplications(listOfFunctions); // Functions

        //part 7
        var listOfDocKnowlege_EPC = getConnectedDocKnowledge(listOfFunctions); // Functions

        //FM      
        var pracovniPozice = occ.ObjDef().Name(g_nLoc);
        //        var cisloPM = occ.ObjDef().Attribute(numAttr_cislo_PM, g_nLoc).getValue();
        //    var nakladoveStredisko = occ.ObjDef().Attribute(numAttr_NakladoveStre, g_nLoc).getValue();
        //ORG
        var ORG_name = "";

        //PM
        var occs_Employees = getCnxOut_Employee(occ);
        if (occs_Employees.length > 0) {
            for (var s = 0; s < occs_Employees.length; s++) {
                name += occs_Employees[s].ObjDef().Name(g_nLoc) + " ";
                osobniCislo += occs_Employees[s].ObjDef().Attribute(numAttr_OsobniCislo, g_nLoc).getValue() + " ";
            } //for
        }

        // get supperior cnx -ridi
        var occs_ORG = getCnxOut_ORG(occ);
        if (occs_ORG.length > 0) {
            for (var j = 0; j < occs_ORG.length; j++) {
                if (j == occs_ORG.length)
                    ORG_name += occs_ORG[j].ObjDef().Name(g_nLoc) + "\n";
                else
                    ORG_name += occs_ORG[j].ObjDef().Name(g_nLoc) + " ";
            } //for
        }
    } //else if

    //part 1 - table
    outfile.BeginTable(100, Constants.C_TRANSPARENT, Constants.C_TRANSPARENT, Constants.FMT_CENTER, 0);
    outfile.TableRow();
    outfile.TableCell(getString("TEXT_TABLE1_A1"), 25, getString("TEXT_FONT_DEFAULT"), 9, RGB(29, 74, 119), Constants.C_TRANSPARENT, 0, Constants.FMT_LEFT, 0);
    outfile.TableCell(name, 75, getString("TEXT_FONT_DEFAULT"), 11, Constants.C_BLACK, Constants.C_TRANSPARENT, 0, Constants.FMT_LEFT | Constants.FMT_BOLD, 0);
    /* outfile.TableCell(getString("TEXT_TABLE1_B1"), 25, getString("TEXT_FONT_DEFAULT"), 9, RGB(29, 74, 119), Constants.C_TRANSPARENT, 0, Constants.FMT_LEFT | Constants.FMT_VCENTER, 0);
     outfile.TableCell(osobniCislo, 25, getString("TEXT_FONT_DEFAULT"), 9, Constants.C_BLACK, Constants.C_TRANSPARENT, 0, Constants.FMT_LEFT | Constants.FMT_BOLD, 0);
    */
    outfile.TableRow();
    outfile.TableCell(getString("TEXT_TABLE1_A2"), 25, getString("TEXT_FONT_DEFAULT"), 9, RGB(29, 74, 119), Constants.C_TRANSPARENT, 0, Constants.FMT_LEFT | Constants.FMT_VCENTER, 0);
    outfile.TableCell(pracovniPozice, 75, getString("TEXT_FONT_DEFAULT"), 9, Constants.C_BLACK, Constants.C_TRANSPARENT, 0, Constants.FMT_LEFT | Constants.FMT_BOLD, 0);
    /*   outfile.TableCell(getString("TEXT_TABLE1_B2"), 25, getString("TEXT_FONT_DEFAULT"), 9, RGB(29, 74, 119), Constants.C_TRANSPARENT, 0, Constants.FMT_LEFT | Constants.FMT_VCENTER, 0);
       outfile.TableCell(nakladoveStredisko, 25, getString("TEXT_FONT_DEFAULT"), 10, Constants.C_BLACK, Constants.C_TRANSPARENT, 0, Constants.FMT_LEFT | Constants.FMT_VCENTER, 0);
       outfile.TableRow();
     /*  outfile.TableCell(getString("TEXT_TABLE1_A3"), 25, "Header_Left_Blue", 9, RGB(29, 74, 119), Constants.C_TRANSPARENT, 0, Constants.FMT_LEFT | Constants.FMT_VCENTER, 0);
       outfile.TableCell(cisloPM, 25, getString("TEXT20"), 9, Constants.C_BLACK, Constants.C_TRANSPARENT, 0, Constants.FMT_LEFT | Constants.FMT_VCENTER, 0);
       outfile.TableCell("", 25, getString("TEXT_FONT_DEFAULT"), 9, Constants.C_BLACK, Constants.C_TRANSPARENT, 0, Constants.FMT_LEFT | Constants.FMT_VCENTER, 0);
       outfile.TableCell("", 25, getString("TEXT_FONT_DEFAULT"), 9, Constants.C_BLACK, Constants.C_TRANSPARENT, 0, Constants.FMT_LEFT | Constants.FMT_VCENTER, 0);
       outfile.TableRow();*/
    /* outfile.TableCell(getString("TEXT_TABLE1_A4"), 25, "Header_Left_Blue", 9, RGB(29, 74, 119), Constants.C_TRANSPARENT, 0, Constants.FMT_LEFT | Constants.FMT_VCENTER, 0);
    outfile.TableCell(ORG_name, 25, getString("TEXT_FONT_DEFAULT"), 9, Constants.C_BLACK, Constants.C_TRANSPARENT, 0, Constants.FMT_LEFT | Constants.FMT_VCENTER, 0);
    outfile.TableCell("", 25, getString("TEXT_FONT_DEFAULT"), 9, Constants.C_BLACK, Constants.C_TRANSPARENT, 0, Constants.FMT_LEFT | Constants.FMT_VCENTER, 0);
    outfile.TableCell("", 25, getString("TEXT_FONT_DEFAULT"), 9, Constants.C_BLACK, Constants.C_TRANSPARENT, 0, Constants.FMT_LEFT | Constants.FMT_VCENTER, 0);
  outfile.TableRow(); */

    /*   if (ORG_name != "" && showRidiUtvar == true) {
           outfile.TableCell(getString("TEXT_TABLE1_A5"), 25, "Header_Left_Blue", 9, RGB(29, 74, 119), Constants.C_TRANSPARENT, 0, Constants.FMT_LEFT | Constants.FMT_VCENTER, 0);
           outfile.TableCell(ORG_name, 25, getString("TEXT_FONT_DEFAULT"), 9, Constants.C_BLACK, Constants.C_TRANSPARENT, 0, Constants.FMT_LEFT | Constants.FMT_VCENTER, 0);
           outfile.TableCell("", 25, getString("TEXT_FONT_DEFAULT"), 9, Constants.C_BLACK, Constants.C_TRANSPARENT, 0, Constants.FMT_LEFT | Constants.FMT_VCENTER, 0);
           outfile.TableCell("", 25, getString("TEXT_FONT_DEFAULT"), 9, Constants.C_BLACK, Constants.C_TRANSPARENT, 0, Constants.FMT_LEFT | Constants.FMT_VCENTER, 0);
       }*/
    outfile.TableRow();
    outfile.EndTable(" ", 100, getString("TEXT_FONT_DEFAULT"), 12, Constants.C_BLACK, Constants.C_TRANSPARENT, 0, Constants.FMT_LEFT | Constants.FMT_VTOP, 0);


    //part 2
    outfile.OutputLnF(getString("TEXT_LABEL1"), "Header_Big_Blue");
    //Je členem orgánů / týmů
    doPart2(jeClenemOrganu);
    //part 3
    outfile.OutputLnF(getString("TEXT_LABEL2"), "Header_Big_Blue");
    doPart3(types);
    //part 4  
    outfile.OutputLnF(getString("TEXT_LABEL3"), "Header_Big_Blue");

    doPart4(typPracovnika);
    // part 5  application systems output
  //  outfile.OutputLnF(getString("TEXT_LABEL4"), "Header_Big_Blue");
   // doPart5(listOfApplications);

    // part 7 RV added 10_2014                      
  //  outfile.OutputLnF(getString("TEXT_LABEL7"), "Header_Big_Blue");

    // part 7b
  //  var listOfDocKnowlege_FAD_cinnost = getConnectedFAD_fromEPCmodels_DocKnowledge(tmpEPC_models); // EPC modely

    //make it unique
    //listOfDocKonwlege_Process = listOfDocKonwlege_Process.sort(new ArraySortComparator(Constants.AT_NAME, Constants.SORT_NONE, Constants.SORT_NONE, g_nLoc).compare);

  //  doPart7(listOfDocKnowlege_EPC, listOfDocKnowlege_FAD_cinnost, listOfDocKonwlege_Process);

    // part 6
    outfile.OutputLnF(getString("TEXT_LABEL5"), "Header_Big_Blue");
    doPart6(superiorObjs, KPI_Names, KPI_Percents);

}




/*
 * Get Function of all occs from array occ typPracovnika - Part5a
 * @return Functions
 */
function getFunctionOfOccsTypPracovnika(typPracovnika) {
    var arrayCnxToFunctions = new Array();
    for (var i = 0; i < typPracovnika.length; i++) {
        Context.writeLog("  part5a: Get Occs of TypPracovnik " + typPracovnika[i].ObjDef().Name(g_nLoc));
        var occsTypPracovika = typPracovnika[i].ObjDef().OccList();
        for (var j = 0; j < occsTypPracovika.length; j++) {
            var occ = occsTypPracovika[j];

            //has Cnx to Function
            var aCnxs = occ.CxnOccList();
            if (aCnxs.length > 0) {
                for (var k = 0; k < aCnxs.length; k++) {
                    if (aCnxs[k].CxnDef().TypeNum() == 218 || aCnxs[k].CxnDef().TypeNum() == 324) { //provadi, spolupracuje
                        var cnxOut_Occ = aCnxs[k].TargetObjOcc();
                        if (aCnxs[k].TargetObjOcc().ObjDef().TypeNum() == 22) { //Funkce
                            arrayCnxToFunctions.push(cnxOut_Occ)
                        } //if
                    }
                } //for
            } //if

        } //for
    } //for
    return arrayCnxToFunctions.sort(new ArraySortComparator(Constants.AT_NAME, Constants.SORT_NONE, Constants.SORT_NONE, g_nLoc).compare);;
}

/*
 * Get list of connected Document knowledge Part 7
 * @return Functions
 */
function getConnectedDocKnowledge(listOfFunctions) {
    var arrayCnxToKnowledgeDoc = new Array();
    for (var i = 0; i < listOfFunctions.length; i++) {
        // Context.writeLog("  part7: Get Occs of TypPracovnik " + listOfFunctions[i].ObjDef().Name(g_nLoc));
        var aCnxs = listOfFunctions[i].CxnOccList();
        if (aCnxs.length > 0) {
            for (var j = 0; j < aCnxs.length; j++) {
                if (aCnxs[j].CxnDef().TypeNum() == 453) { //podporuje
                    Context.writeLog("  part7a: Get Occs of TypPracovnik " + listOfFunctions[i].ObjDef().Name(g_nLoc));
                    var cnxOut_Occ = aCnxs[j].SourceObjOcc();
                    Context.writeLog("     part7a: Document knowledge " + aCnxs[j].SourceObjOcc().ObjDef().Name(-1) + " " + aCnxs[j].SourceObjOcc().ObjDef().TypeNum());

                    if (aCnxs[j].SourceObjOcc().ObjDef().TypeNum() == 231) { //Funkce
                        arrayCnxToKnowledgeDoc.push(cnxOut_Occ)
                    } //if
                } //if
            } //for
        } //if

    } //for
    return arrayCnxToKnowledgeDoc.sort(new ArraySortComparator(Constants.AT_NAME, Constants.SORT_NONE, Constants.SORT_NONE, g_nLoc).compare);
}

function getConnectedFAD_fromEPCmodels_DocKnowledge(tmpEPC_models) {
    for (var i = 0; i < tmpEPC_models.length; i++) {
        Context.writeLog("  part7b : EPC model " + tmpEPC_models[i].Name(g_nLoc));
        var superiorObjs = tmpEPC_models[i].SuperiorObjDefs();

        for (var j = 0; j < superiorObjs.length; j++) {
            Context.writeLog("    Superior Obj " + superiorObjs[j].Name(g_nLoc));
            getDocFromProcess(superiorObjs[j]);
        } //for 
    }

    list = ArisData.Unique(list);
    list.sort();
    for (var k = 0; k < list.length; k++) {
        Context.writeLog(" !!" + list[k].ObjDef().Name(-1))
        checkAssignedModels(list[k])
    } //for 

}

/*
 * jump throw EPC model into VACD model
 */
function getDocFromProcess(superiorObjs) {
    counter = 0;
    var aObjOccs = superiorObjs.OccList();
    for (var i = 0; i < aObjOccs.length; i++) {
        var oModel = aObjOccs[i].Model();
        if (oModel.TypeNum() == Constants.MT_VAL_ADD_CHN_DGM) { //MODEL TVORBY PRIDANE HODNOTY - 12, skip EPC..
            var aSupObjs = oModel.SuperiorObjDefs();
            for (j = 0; j < aSupObjs.length; j++) {
                Context.writeLog("      Superior Func (" + aSupObjs[j].TypeNum() + ") " + aSupObjs[j].Name(g_nLoc));
                var aSupOcc = aSupObjs[j].OccListInModel(oModel); //in actual model
                if (aSupOcc.length > 0) {
                    for (var k = 0; k < aSupOcc.length; k++) {
                        Context.writeLog("        Model(" + aSupOcc[k].Model().TypeNum() + ")" + aSupOcc[k].Model().Name(g_nLoc));
                        //checkAssignedModels(aSupOcc[k]);
                        myRecu(aSupOcc[k].Model(), aSupOcc[k].ObjDef());

                    } //for
                }
            }
        }
    }
}

var list = Array();
var tmp = "";
var tmp2 = true;
/*recursion, check from list to top*/
function myRecu(entryModel, superiorObjs) {
    if (counter < 100) {
        var aObjOccs = superiorObjs.OccList();
        for (var i = 0; i < aObjOccs.length; i++) {
            if (tmp2 == true) {
                if (entryModel.GUID() != aObjOccs[i].Model().GUID()) {
                    if (tmp != aObjOccs[i].Model().SuperiorObjDefs()[0].Name(-1)) {

                        list.push(aObjOccs[i]);
                        Context.writeLog("     OBJ " + aObjOccs[i].ObjDef().Name(-1) + "  Model Name " + aObjOccs[i].Model().Name(-1));
                        Context.writeLog("      SUPer " + aObjOccs[i].Model().SuperiorObjDefs()[0].Name(-1));
                        tmp = aObjOccs[i].Model().SuperiorObjDefs()[0].Name(-1)
                        myRecu(aObjOccs[i].Model(), aObjOccs[i].Model().SuperiorObjDefs()[0]);
                    } else {
                        Context.writeLog("Reach Top model in tree: " + aObjOccs[i].Model().Name(-1));

                        return false;
                    }
                }
            }
            return false;
        }
    } //counter
}

function getDocFromProcess2(superiorObjs) {
    var aObjOccs = superiorObjs.OccList();
    for (var i = 0; i < aObjOccs.length; i++) {
        var oModel = aObjOccs[i].Model();
        if (oModel.TypeNum() == Constants.MT_VAL_ADD_CHN_DGM) { //MODEL TVORBY PRIDANE HODNOTY - 12, skip EPC..
            var aSupObjs = oModel.SuperiorObjDefs();
            for (j = 0; j < aSupObjs.length; j++) {
                Context.writeLog("      Superior Func (" + aSupObjs[j].TypeNum() + ") " + aSupObjs[j].Name(g_nLoc));
                var aSupOcc = aSupObjs[j].OccListInModel(oModel); //in actual model
                if (aSupOcc.length > 0) {
                    for (var k = 0; k < aSupOcc.length; k++) {
                        Context.writeLog("        Model(" + aSupOcc[k].Model().TypeNum() + ")" + aSupOcc[k].Model().Name(g_nLoc));
                        checkAssignedModels(aSupOcc[k]);

                    } //for
                }
            }
        }
    }
}



/*
 * Check if is FAD model assigned
 */
function checkAssignedModels(aSupOcc) {
    var oSupModel = aSupOcc.Model();
    var assignedModels = aSupOcc.ObjDef().AssignedModels();
    for (var i = 0; i < assignedModels.length; i++) {
        if (assignedModels[i].TypeNum() == Constants.MT_FUNC_ALLOC_DGM) {
            var funcs = assignedModels[i].ObjOccListFilter(Constants.OT_FUNC);
            for (var j = 0; j < funcs.length; j++) {
                Context.writeLog("          Occs " + funcs[j].ObjDef().Name(g_nLoc));
                getdocKnowFromFAD_process(funcs[j], aSupOcc); //get Doc from FAD model
            }
        }
    } //for
}

/*
 * Pro proces
 */
var docKnw_map_process = new java.util.TreeMap();

function getdocKnowFromFAD_process(objOcc, aSupOcc) {
    var cnxOccs = objOcc.CxnOccList();
    if (cnxOccs.length > 0) {
        for (var i = 0; i < cnxOccs.length; i++) {
            if (cnxOccs[i].CxnDef().TypeNum() == 453) {
                //  listOfDocKonwlege_Process.push(cnxOccs[i].CxnDef().SourceObjDef()+","+aSupOcc.ObjDef().Name(g_nLoc)+";");

                docKnw_map_process.put(cnxOccs[i].CxnDef().SourceObjDef().Name(g_nLoc), aSupOcc.ObjDef().Name(g_nLoc));
                Context.writeLog("              !!" + cnxOccs[i].CxnDef().SourceObjDef().Name(g_nLoc) + "," + aSupOcc.ObjDef().Name(g_nLoc) + ";");
            }
            if (cnxOccs[i].CxnDef().TypeNum() == 454) {
                //  listOfDocKonwlege_Process.push(cnxOccs[i].CxnDef().TargetObjDef()+","+aSupOcc.ObjDef().Name(g_nLoc)+";");
                docKnw_map_process.put(cnxOccs[i].CxnDef().TargetObjDef().Name(g_nLoc), aSupOcc.ObjDef().Name(g_nLoc));
                Context.writeLog("              !!" + cnxOccs[i].CxnDef().TargetObjDef().Name(g_nLoc) + "," + aSupOcc.ObjDef().Name(g_nLoc) + ";");
            }
        }
        return listOfDocKonwlege_Process;
    }
}

/*
* Pro cinnost

function getdocKnowFromFAD(obj){
    var tmpdocKonw= new Array();
    var cnxs = obj.CxnListFilter(Constants.EDGES_INOUT) 
     for (var i = 0; i < cnxs[i].length; i++) {
         if(cnxs[i].TypeNum()=453){
           tmpdocKonw.push(cnxs[i].SourceObjDef());  
         }
         if(cnxs[i].TypeNum()=454){
           tmpdocKonw.push(cnxs[i].TargetObjDef());  
         } 
    }
     return tmpdocKonw;
}*/

/*
 * Get list of connected applications Part5b
 * @return Functions
 */
function getConnectedApplications(listOfFunctions) {
    var arrayCnxToApplications = new Array();
    for (var i = 0; i < listOfFunctions.length; i++) {
        var aCnxs = listOfFunctions[i].CxnOccList();
        if (aCnxs.length > 0) {
            for (var j = 0; j < aCnxs.length; j++) {
                if (aCnxs[j].CxnDef().TypeNum() == 221) { //podporuje
                    Context.writeLog("  part5b: Get Occs of TypPracovnik " + listOfFunctions[i].ObjDef().Name(g_nLoc));
                    var cnxOut_Occ = aCnxs[j].SourceObjOcc();
                    Context.writeLog("    part5b: Application " + aCnxs[j].SourceObjOcc().ObjDef().Name(-1) + " " + aCnxs[j].SourceObjOcc().ObjDef().TypeNum());

                    if (aCnxs[j].SourceObjOcc().ObjDef().TypeNum() == 6) { //Funkce
                        arrayCnxToApplications.push(cnxOut_Occ)
                    } //if
                } //if
            } //for
        } //if

    } //for
    return arrayCnxToApplications.sort(new ArraySortComparator(Constants.AT_NAME, Constants.SORT_NONE, Constants.SORT_NONE, g_nLoc).compare);
}


/*
 * Get  - Part4
 * @return Functions
 */
function getOccsTypPracovnika(typPracovnika) {
    var arrayCnxToFunctions = new Array();
    for (var i = 0; i < typPracovnika.length; i++) {
        Context.writeLog("  part4: Get Occs of TypPracovnik " + typPracovnika[i].ObjDef().Name(g_nLoc));
        var occsTypPracovika = typPracovnika[i].ObjDef().OccList();
        occsTypPracovika.sort();;
        var tmp = "";
        for (var j = 0; j < occsTypPracovika.length; j++) {
            var occ = occsTypPracovika[j];

            if (tmp != occ.Model().GUID()) {
                Context.writeLog("  part4: Model name (nazev tab) " + occ.Model().Name(g_nLoc));
                var tmp = occ.Model().GUID();
                //has Cnx to Function
                var aCnxs = occ.CxnOccList();
                aCnxs.sort();
                if (aCnxs.length > 0) {
                    for (var k = 0; k < aCnxs.length; k++) {
                        Context.writeLog("    part4: Typ Vazby " + aCnxs[k].CxnDef().ActiveType());
                        Context.writeLog("    part4: Cinnost   " + aCnxs[k].TargetObjOcc().ObjDef().Name(-1));
                    } //for
                } //if
            } else {
                Context.writeLog("    part4: odpovednost " + occ.ObjDef().Name(g_nLoc));
                var tmp = occ.Model().GUID();

                //has Cnx to Function
                var aCnxs = occ.CxnOccList();
                aCnxs.sort();
                if (aCnxs.length > 0) {
                    for (var k = 0; k < aCnxs.length; k++) {
                        Context.writeLog("    part4: Typ Vazby " + aCnxs[k].CxnDef().ActiveType());
                        Context.writeLog("    part4: Cinnost   " + aCnxs[k].TargetObjOcc().ObjDef().Name(-1));
                    } //for
                } //if

            }
        }
    }
}



/*
 * Get Process Owner - FM
 * @return ObjDef
 */
function getCnxOut_RoleAssign(occ_FM) {
    var arrayCnxObjs = new Array();

    var aCnxs = occ_FM.ObjDef().CxnListFilter(Constants.EDGES_ASSIGN);
    if (aCnxs.length > 0) {
        for (var i = 0; i < aCnxs.length; i++) {
            if (aCnxs[i].TypeNum() == 480) {
                var cnxOut_Obj = aCnxs[i].TargetObjDef();
                arrayCnxObjs.push(cnxOut_Obj)
            }
        } //for
        return arrayCnxObjs.sort(new ArraySortComparator(Constants.AT_NAME, Constants.SORT_NONE, Constants.SORT_NONE, g_nLoc).compare);;
    }
}

/*
 * Get Process Owner - FM
 * @return ObjDef
 */

function getCnxOwnerOfProcess(occ_FM) {
    var arrayCnxObjs = new Array();
    var aCnxs = occ_FM.ObjDef().CxnListFilter(Constants.EDGES_OUT);
    if (aCnxs.length > 0) {
        for (var i = 0; i < aCnxs.length; i++) {
            if (aCnxs[i].TypeNum() == 480) {
                var cnxOut_Obj = aCnxs[i].TargetObjDef();
                arrayCnxObjs.push(cnxOut_Obj)
            }
        } //for
        return arrayCnxObjs;
    }
}

/*
 * Get KPIs - Context FM
 */
function getCnx_SuperiorObjs(occFM) {
    var superiorObjs = new Array();
    var oObjDefFM = occFM.ObjDef();
    var occsFM = oObjDefFM.OccList();
    for (i = 0; i < occsFM.length; i++) {
        var oModel = occsFM[i].Model();
        var aSupObjs = oModel.SuperiorObjDefs();
        if (aSupObjs.length > 0) {
            for (j = 0; j < aSupObjs.length; j++) {
                if (aSupObjs[j].TypeNum() == 86) {
                    Context.writeLog("Superior Obj " + aSupObjs[j].Name(g_nLoc));
                    superiorObjs.push(aSupObjs[j]);
                }
            } //for
        }
    } //for
    return superiorObjs;
}

/*
 * Get Employee - Context FM
 */
function getCnxOut_Employee(occ_Employee) {
    var arrayCnxOccs = new Array();
    var aCnxs = occ_Employee.CxnOccList();
    if (aCnxs.length > 0) {
        for (var i = 0; i < aCnxs.length; i++) {
            if (aCnxs[i].CxnDef().TypeNum() == 210) {
                var cnxOut_Occ = aCnxs[i].SourceObjOcc();
                arrayCnxOccs.push(cnxOut_Occ)
            }
        } //for
        return arrayCnxOccs;
    }
}

/*
 * Get Typ Pracovnika - Context FM
 */
function getCnxOut_TypPracovnika(occ_FM) {
    var arrayCnxOccs = new Array();
    var aCnxs = occ_FM.CxnOccList();
    if (aCnxs.length > 0) {
        for (var i = 0; i < aCnxs.length; i++) {
            if (aCnxs[i].CxnDef().TypeNum() == 480) {
                var cnxOut_Occ = aCnxs[i].TargetObjOcc();
                arrayCnxOccs.push(cnxOut_Occ)
            }
        } //for
        return ArisData.sort(arrayCnxOccs, Constants.AT_NAME, Constants.SORT_NONE);
    }
}

/*
 * Get Clen Ogranu - FM - vedouci
 * @return ObjDef
 */

function getCnxOut_clenOrangu(occ_FM) {
    var arrayCnxOccs = new Array();
    var aCnxsOCC = occ_FM.CxnOccList();
    if (aCnxsOCC.length > 0) {
        for (var i = 0; i < aCnxsOCC.length; i++) {
            Context.writeLog("A " + aCnxsOCC[i].CxnDef().TypeNum() + " " + aCnxsOCC[i].TargetObjOcc().ObjDef().Name(-1))
            if (aCnxsOCC[i].CxnDef().TypeNum() == 9) { //cnx type ridi
                var cnxOut_Occ = aCnxsOCC[i].TargetObjOcc();
                arrayCnxOccs.push(cnxOut_Occ);
                isManager = true; //manager, veoduci
            }
            if (aCnxsOCC[i].CxnDef().TypeNum() == 480) {
                var cnxOut_Occ = aCnxsOCC[i].TargetObjOcc();
                arrayCnxOccs.push(cnxOut_Occ);
            }
        } //for
    }
    var arrayCnxObjs = new Array();
    if (isManager) {
        // find connected ObjDef    
        var aCnxs = occ_FM.ObjDef().CxnListFilter(Constants.EDGES_OUT);
        if (aCnxs.length > 0) {
            for (var j = 0; j < aCnxs.length; j++) {
                Context.writeLog("BB " + aCnxs[j].TypeNum() + " " + aCnxs[j].TargetObjDef().Name(-1))
                if (aCnxs[j].TypeNum() == 395) {
                    var cnxOut_Obj = aCnxs[j].TargetObjDef();
                    arrayCnxObjs.push(cnxOut_Obj);
                }
            } //for
            return arrayCnxObjs;
        }
    } else {
        for (var k = 0; k < arrayCnxOccs.length; k++) {
            Context.writeLog("CC " + arrayCnxOccs[k].ObjDef().Name(-1))
            var tmp = (getCnxOut_Skupina(arrayCnxOccs[k]))
            for (var l = 0; l < tmp.length; l++) {
                arrayCnxObjs.push(tmp[l]);
            }
        } //for

        return arrayCnxObjs
    }
}


/*
 * Get Je Clenem - typ pracovnika
 * @return ObjDef
 */

function getCnxOut_Skupina(typPracovnika) {
    var arrayCnxObjs = new Array();
    var aCnxs = typPracovnika.ObjDef().CxnListFilter(Constants.EDGES_IN);
    if (aCnxs.length > 0) {
        for (var i = 0; i < aCnxs.length; i++) {
            if (aCnxs[i].TypeNum() == 6) {
                var cnxOut_Obj = aCnxs[i].SourceObjDef();
                arrayCnxObjs.push(cnxOut_Obj)
            }
        } //for
        return arrayCnxObjs;
    }
}
/*
function getCnxOut_Odpovednost(typPracovnika) {
    var arrayCnxActiveType = new Array();
    var aCnxs = typPracovnika.ObjDef().CxnListFilter(Constants.EDGES_OUT);
    if (aCnxs.length > 0) {
        for (var i = 0; i < aCnxs.length; i++) {
            arrayCnxActiveType.push(aCnxs[i].ActiveType());

        } //for
        return arrayCnxActiveType;
    }
}

function getCnxOut_Role(typPracovnika) {
    var arrayCnxObjs = new Array();
    var aCnxs = typPracovnika.ObjDef().CxnListFilter(Constants.EDGES_OUT);
    if (aCnxs.length > 0) {
        for (var i = 0; i < aCnxs.length; i++) {
            if (aCnxs[i].TypeNum() == 218) {
                var cnxOut_Obj = aCnxs[i].SourceObjDef();
                arrayCnxObjs.push(cnxOut_Obj)
            }
        } //for
        return arrayCnxObjs;
    }
}

function getCnxOut_Cinnost(typPracovnika) {
    var arrayCnxObjs = new Array();
    var aCnxs = typPracovnika.ObjDef().CxnListFilter(Constants.EDGES_OUT);
    if (aCnxs.length > 0) {
        for (var i = 0; i < aCnxs.length; i++) {
            if (aCnxs[i].TypeNum() == 218) {
                var cnxOut_Obj = aCnxs[i].TargetObjDef();
                arrayCnxObjs.push(cnxOut_Obj)
            }
        } //for
        //myArray.sort(new ArraySortComparator(Constants.AT_NAME, Constants.SORT_NONE, Constants.SORT_NONE, locale).compare );
        return arrayCnxObjs.sort(new ArraySortComparator(Constants.AT_NAME, Constants.SORT_NONE, Constants.SORT_NONE, g_nLoc).compare);
    }
}
*/
/*
 * Work Positions - Context Employee
 */

function getCnxOut_FM(occ_FM) {
    var arrayCnxOccs = new Array();
    var aCnxs = occ_FM.CxnOccList();
    if (aCnxs.length > 0) {
        for (var i = 0; i < aCnxs.length; i++) {
            if (aCnxs[i].CxnDef().TypeNum() == 210) {
                var cnxOut_Occ = aCnxs[i].TargetObjOcc();
                arrayCnxOccs.push(cnxOut_Occ)
            }
        } //for
        return arrayCnxOccs;
    }
}

/*
 * Get number PM - Context Employee
 */
function getCnxOut_ORG(occ_ORG) {
    var arrayCnxOccs_ORG = new Array();
    var aCnxs = occ_ORG.CxnOccList();
    if (aCnxs.length > 0) {
        for (var i = 0; i < aCnxs.length; i++) {
            if (aCnxs[i].CxnDef().TypeNum() == 9) {
                var cnxOut_Occ = aCnxs[i].TargetObjOcc();
                arrayCnxOccs_ORG.push(cnxOut_Occ)
            }

        } //for
        if (arrayCnxOccs_ORG.length == 0) { //RV added 102014
            for (var i = 0; i < aCnxs.length; i++) {
                if (aCnxs[i].CxnDef().TypeNum() == 7) {
                    var cnxOut_Occ = aCnxs[i].SourceObjOcc();
                    arrayCnxOccs_ORG.push(cnxOut_Occ);
                    showRidiUtvar = false;
                }
            }
        }
        return arrayCnxOccs_ORG;
    }
}

function doPart2(jeClenemOrganu) {
    //for(var i=0;i<jeClenemOrganu.length;i++){
    outfile.OutputLnF(jeClenemOrganu, getString("TEXT_STYLE_DEFAULT"));
    // }
}

function doPart3(types) {
    var employee = getString("TEXT_EMPLOYEE");
    if (isManager) { //vedouci zamestanaec
        var employeeLeader = getString("TEXT_EMPLOYEE_LEADER");
        //  var types = getCnxOut_RoleAssign(occ);
        var HR_Role = "";
        var otherRole = "";
        if (types != null) {
            for (var i = 0; i < types.length; i++) {
                var tmpHRstate = types[i].Attribute(199909, g_nLoc).getValue();
                if (tmpHRstate != "") {
                    HR_Role += types[i].Name(g_nLoc) + "\n";
                } else if (tmpHRstate == "") {
                    otherRole += types[i].Name(g_nLoc) + "\n";
                }
            } //for
        }
        outfile.BeginTable(100, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_CENTER, 0);
        outfile.TableRow();
        /*
        addCell(outfile, [0, 0, 0, 0], getString("TEXT_TABLE2_1"), 1, 1, 25, "Header_Center_Blue");
        addCell(outfile, [0, 0, 0, 0], getString("TEXT_TABLE2_2"), 1, 1, 25, "Header_Center_Blue");
        addCell(outfile, [0, 0, 0, 0], getString("TEXT_TABLE2_3"), 1, 1, 25, "Header_Center_Blue");
        addCell(outfile, [0, 0, 0, 0], getString("TEXT_TABLE2_4"), 1, 1, 25, "Header_Center_Blue");
        outfile.TableRow();
        */
        addCell(outfile, [0, 0, 0, 0], employeeLeader, 1, 1, 25, "CELL_STYLE_LONG");
        addCell(outfile, [0, 0, 0, 0], HR_Role, 1, 1, 25, "CELL_STYLE_LONG");
        addCell(outfile, [0, 0, 0, 0], otherRole, 1, 1, 25, "CELL_STYLE_LONG");
        addCell(outfile, [0, 0, 0, 0], employee, 1, 1, 25, getString("TEXT_STYLE_DEFAULT"));
        outfile.TableRow();
        outfile.EndTable(" ", 100, getString("TEXT_FONT_DEFAULT"), 12, Constants.C_BLACK, Constants.C_TRANSPARENT, 0, Constants.FMT_CENTER, 0);
    } else {
        var HR_Role = "";
        var otherRole = "";
        if (types != null) {
            for (var i = 0; i < types.length; i++) {
                var tmpHRstate = types[i].ObjDef().Attribute(199909, g_nLoc).getValue();
                if (tmpHRstate != "") {
                    HR_Role += types[i].ObjDef().Name(g_nLoc) + "\n";
                } else if (tmpHRstate == "") {
                    otherRole += types[i].ObjDef().Name(g_nLoc) + "\n";
                }
            } //for
        }

        outfile.BeginTable(100, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_CENTER, 0);
        outfile.TableRow();
        /*
        addCell(outfile, [0, 0, 0, 0], getString("TEXT_TABLE2_1"), 1, 1, 25, "Header_Center_Blue");
        addCell(outfile, [0, 0, 0, 0], getString("TEXT_TABLE2_2"), 1, 1, 25, "Header_Center_Blue");
        addCell(outfile, [0, 0, 0, 0], getString("TEXT_TABLE2_3"), 1, 1, 25, "Header_Center_Blue");
        addCell(outfile, [0, 0, 0, 0], getString("TEXT_TABLE2_4"), 1, 1, 25, "Header_Center_Blue");
        outfile.TableRow();
        */
        addCell(outfile, [0, 0, 0, 0], HR_Role, 1, 1, 25, "CELL_STYLE_LONG");
        addCell(outfile, [0, 0, 0, 0], otherRole, 1, 1, 25, "CELL_STYLE_LONG");
        addCell(outfile, [0, 0, 0, 0], employee, 1, 1, 25, getString("TEXT_STYLE_DEFAULT"));
        addCell(outfile, [0, 0, 0, 0], "-", 1, 1, 25, "CELL_STYLE_CENTER");
        outfile.TableRow();
        outfile.EndTable(" ", 100, getString("TEXT_FONT_DEFAULT"), 12, Constants.C_BLACK, Constants.C_TRANSPARENT, 0, Constants.FMT_CENTER, 0);
    }
}


//For all occurences the uniqe relevant models are returned
function getModels(obj_occ) {
    var models = new Array();
    for (var i = 0; i < obj_occ.length; i++) {
        for (var j = 0; j < MT.length; j++) {
            if (obj_occ[i].Model().TypeNum() == Constants[MT[j]]) {
                models.push(obj_occ[i].Model());
            }
        }
    }
    return ArisData.Unique(models);
}

function doPart4(typPracovnika) {

    if (typPracovnika != null) {
        typPracovnika = ArisData.sort(typPracovnika, Constants.AT_NAME, Constants.SORT_NONE);

        for (var i = 0; i < typPracovnika.length; i++) {
            Context.writeLog("!! part4: Get Occs of TypPracovnik " + typPracovnika[i].ObjDef().Name(g_nLoc));
            var models = getModels(typPracovnika[i].ObjDef().OccList()); //get relevat models 
            models = ArisData.sort(models, Constants.AT_NAME, Constants.SORT_NONE);

            for (var j = 0; j < models.length; j++) {

                outfile.BeginTable(100, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_CENTER, 0);
                outfile.TableRow();
                addCell(outfile, [1, 1, 1, 1], " Role: " + typPracovnika[i].ObjDef().Name(g_nLoc) + "   Model: " + models[j].Name(g_nLoc), 1, 1, 100, "Default_BoldOnBrown");
                outfile.TableRow();
                addCell(outfile, [1, 0, 0, 1], getString("TEXT_TABLE3_1"), 1, 1, 14, "Header_Left_Blue");
                addCell(outfile, [1, 0, 0, 1], getString("TEXT_TABLE3_2"), 1, 1, 14, "Header_Left_Blue");

                addCell(outfile, [1, 0, 0, 1], getString("TEXT_TABLE3_3"), 1, 1, 14, "Header_Left_Blue");
                addCell(outfile, [1, 0, 0, 1], getString("TEXT_TABLE3_4"), 1, 1, 14, "Header_Left_Blue");
                addCell(outfile, [1, 0, 0, 1], getString("TEXT_TABLE3_5"), 1, 1, 14, "Header_Left_Blue");
                addCell(outfile, [1, 0, 0, 1], getString("TEXT_TABLE3_6"), 1, 1, 14, "Header_Left_Blue");
                addCell(outfile, [1, 0, 0, 1], getString("TEXT_TABLE3_7"), 1, 1, 14, "Header_Left_Blue");
                addCell(outfile, [1, 0, 0, 1], getString("TEXT_TABLE3_8"), 1, 1, 14, "Header_Left_Blue");
                outfile.TableRow();

                var occs = typPracovnika[i].ObjDef().OccListInModel(models[j])
                occs = ArisData.sort(occs, Constants.AT_NAME, Constants.SORT_Y);

                for (var k = 0; k < occs.length; k++) {
                    var aCnxs = occs[k].CxnOccList();
                    occs = ArisData.sort(occs, Constants.AT_NAME, Constants.SORT_Y);

                    var cinnost = aCnxs[0].TargetObjOcc();
                    var inputs = getInputs(cinnost);
                    var outputs = getOutputs(cinnost);
                    var systems = getSystems(cinnost);
                    var data = getData(cinnost);
                    var documents = getDocouments(cinnost);


                    outfile.TableRow();
                    addCell(outfile, [1, 0, 0, 1], cinnost.ObjDef().Name(g_nLoc), 1, 1, 14, "CELL_STYLE_LONG");
                    addCell(outfile, [1, 0, 0, 1], aCnxs[0].CxnDef().ActiveType(), 1, 1, 14, "CELL_STYLE_LONG");
                    addCell(outfile, [1, 0, 0, 1], inputs, 1, 1, 14, "CELL_STYLE_LONG");
                    addCell(outfile, [1, 0, 0, 1], outputs, 1, 1, 14, "CELL_STYLE_LONG");
                    addCell(outfile, [1, 0, 0, 1], systems, 1, 1, 14, "CELL_STYLE_LONG");
                    addCell(outfile, [1, 0, 0, 1], data, 1, 1, 14, "CELL_STYLE_LONG");
                    addCell(outfile, [1, 0, 0, 1], documents, 1, 1, 14, "CELL_STYLE_LONG");
                    outfile.TableRow();
                }

                outfile.EndTable(" ", 100, getString("TEXT_FONT_DEFAULT"), 12, Constants.C_BLACK, Constants.C_TRANSPARENT, 0, Constants.FMT_CENTER, 0);
                outfile.OutputLnF("", getString("TEXT_STYLE_DEFAULT"));
            }
        }
    }
}


function getInputs(cinnost) {
    var listValues = "";

    var aCnxs = cinnost.Cxns(Constants.EDGES_IN, Constants.EDGES_STRUCTURE);
    aCnxs = ArisData.sort(aCnxs, Constants.AT_NAME, Constants.SORT_NONE);

    for (var i = 0; i < aCnxs.length; i++) {
        if (aCnxs[i].SourceObjOcc().ObjDef().TypeNum() != Constants.OT_RULE)
            listValues += aCnxs[i].SourceObjOcc().ObjDef().Name(g_nLoc) + "\n";
    }
    if (listValues == "")
        return "-"

    return listValues;

}


function getOutputs(cinnost) {
    var listValues = "";

    var aCnxs = cinnost.Cxns(Constants.EDGES_OUT, Constants.EDGES_STRUCTURE);
    aCnxs = ArisData.sort(aCnxs, Constants.AT_NAME, Constants.SORT_NONE);

    for (var i = 0; i < aCnxs.length; i++) {
        if (aCnxs[i].TargetObjOcc().ObjDef().TypeNum() != Constants.OT_RULE)
            listValues += aCnxs[i].TargetObjOcc().ObjDef().Name(g_nLoc) + "\n";

    }
    if (listValues == "")
        return "-"

    return listValues;

}

function getSystems(cinnost) {
    var listValues = "";


    var iCnxs = cinnost.Cxns(Constants.EDGES_IN, Constants.EDGES_NONSTRUCTURE);
    var oCnxs = cinnost.Cxns(Constants.EDGES_OUT, Constants.EDGES_NONSTRUCTURE);

    iCnxs = ArisData.sort(iCnxs, Constants.AT_NAME, Constants.SORT_NONE);
    oCnxs = ArisData.sort(oCnxs, Constants.AT_NAME, Constants.SORT_NONE);

    for (var i = 0; i < iCnxs.length; i++) {
        if (iCnxs[i].SourceObjOcc().ObjDef().TypeNum() == Constants.OT_APPL_SYS_TYPE)
            listValues += iCnxs[i].SourceObjOcc().ObjDef().Name(g_nLoc) + "\n";
    }

    for (var i = 0; i < oCnxs.length; i++) {
        if (oCnxs[i].TargetObjOcc().ObjDef().TypeNum() == Constants.OT_APPL_SYS_TYPE)
            listValues += oCnxs[i].TargetObjOcc().ObjDef().Name(g_nLoc) + "\n";
    }

    if (listValues == "")
        return "-"

    return listValues;

}


function getData(cinnost) {
    var listValues = "";


    var iCnxs = cinnost.Cxns(Constants.EDGES_IN, Constants.EDGES_NONSTRUCTURE);
    var oCnxs = cinnost.Cxns(Constants.EDGES_OUT, Constants.EDGES_NONSTRUCTURE);

    iCnxs = ArisData.sort(iCnxs, Constants.AT_NAME, Constants.SORT_NONE);
    oCnxs = ArisData.sort(oCnxs, Constants.AT_NAME, Constants.SORT_NONE);

    for (var i = 0; i < iCnxs.length; i++) {
        if (iCnxs[i].SourceObjOcc().ObjDef().TypeNum() == Constants.OT_CLST)
            listValues += iCnxs[i].SourceObjOcc().ObjDef().Name(g_nLoc) + "\n";
    }

    for (var i = 0; i < oCnxs.length; i++) {
        if (oCnxs[i].TargetObjOcc().ObjDef().TypeNum() == Constants.OT_CLST)
            listValues += oCnxs[i].TargetObjOcc().ObjDef().Name(g_nLoc) + "\n";
    }

    if (listValues == "")
        return "-"

    return listValues;

}


function getDocouments(cinnost) {
    var listValues = "";
    
    if(cinnost.ObjDef().Name(-1) == "Založení osobního spisu nového zaměstnance")
        true

    var iCnxs = cinnost.Cxns(Constants.EDGES_IN, Constants.EDGES_NONSTRUCTURE);
    var oCnxs = cinnost.Cxns(Constants.EDGES_OUT, Constants.EDGES_NONSTRUCTURE);

    iCnxs = ArisData.sort(iCnxs, Constants.AT_NAME, Constants.SORT_NONE);
    oCnxs = ArisData.sort(oCnxs, Constants.AT_NAME, Constants.SORT_NONE);

    for (var i = 0; i < iCnxs.length; i++) {
        if (iCnxs[i].SourceObjOcc().ObjDef().TypeNum() == Constants.OT_INFO_CARR || iCnxs[i].TargetObjOcc().ObjDef().TypeNum()==Constants.OT_DOC_KNWLDG)
            listValues += iCnxs[i].SourceObjOcc().ObjDef().Name(g_nLoc) + "\n";
    }

    for (var i = 0; i < oCnxs.length; i++) {
        if (oCnxs[i].TargetObjOcc().ObjDef().TypeNum() == Constants.OT_INFO_CARR || oCnxs[i].TargetObjOcc().ObjDef().TypeNum()==Constants.OT_DOC_KNWLDG)
            listValues += oCnxs[i].TargetObjOcc().ObjDef().Name(g_nLoc) + "\n";
        
    }

    if (listValues == "")
        return "-"

    return listValues;

}




function doPart5(listOfApplications) {
    var tmpArray = new Array();
    if (listOfApplications != "") {
        for (var i = 0; i < listOfApplications.length; i++) {
            tmpArray.push(listOfApplications[i].ObjDef().Name(g_nLoc))
        }
        var uniqueArray_apps = ArisData.Unique(tmpArray);
        uniqueArray_apps.sort();
    }
    //aplikacni systemy
    outfile.BeginTable(100, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_CENTER, 0);
    outfile.TableRow();
    /* addCell(outfile, [0, 0, 0, 0], getString("TEXT_TABLE5_1"), 1, 1, 25, "Header_Center_Blue");
     addCell(outfile, [0, 0, 0, 0], getString("TEXT_TABLE5_2"), 1, 1, 25, "Header_Center_Blue");
     addCell(outfile, [0, 0, 0, 0], getString("TEXT_TABLE5_3"), 1, 1, 25, "Header_Center_Blue");
     addCell(outfile, [0, 0, 0, 0], getString("TEXT_TABLE5_4"), 1, 1, 25, "Header_Center_Blue");
     */
    if (uniqueArray_apps != null) {
        for (var j = 0; j < uniqueArray_apps.length; j++) {
            addCell(outfile, [1, 0, 0, 1], uniqueArray_apps[j], 1, 1, 25, "CELL_STYLE_LONG");
            addCell(outfile, [1, 0, 0, 1], "", 1, 1, 25, getString("TEXT_STYLE_DEFAULT"));
            addCell(outfile, [1, 0, 0, 1], "", 1, 1, 25, getString("TEXT_STYLE_DEFAULT"));
            addCell(outfile, [1, 0, 0, 1], "", 1, 1, 25, getString("TEXT_STYLE_DEFAULT"));
            outfile.TableRow();
        } //for
    } else {
        addCell(outfile, [1, 0, 0, 1], "-", 1, 1, 25, getString("TEXT_STYLE_DEFAULT"));
        addCell(outfile, [1, 0, 0, 1], "", 1, 1, 25, getString("TEXT_STYLE_DEFAULT"));
        addCell(outfile, [1, 0, 0, 1], "", 1, 1, 25, getString("TEXT_STYLE_DEFAULT"));
        addCell(outfile, [1, 0, 0, 1], "", 1, 1, 25, getString("TEXT_STYLE_DEFAULT"));
        outfile.TableRow();
    }
    outfile.EndTable(" ", 100, getString("TEXT_FONT_DEFAULT"), 12, Constants.C_BLACK, Constants.C_TRANSPARENT, 0, Constants.FMT_CENTER, 0);
}

function doPart6(superiorObjs, KPI_Names, KPI_Percents) {

    outfile.BeginTable(85, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_LEFT, 0);
    outfile.TableRow();
    addCell(outfile, [0, 0, 0, 0], getString("TEXT_TABLE6_1_TARGET"), 1, 1, 25, "Header_Center_Blue");
    addCell(outfile, [0, 0, 0, 0], getString("TEXT_TABLE6_2_KPI"), 1, 1, 25, "Header_Center_Blue");
    addCell(outfile, [0, 0, 0, 0], getString("TEXT_TABLE6_3_BALANCE"), 1, 1, 25, "Header_Center_Blue");
    outfile.TableRow();
    if (superiorObjs != "" && superiorObjs != null) {
        for (var i = 0; i < superiorObjs.length; i++) {
            addCell(outfile, [1, 0, 0, 1], superiorObjs[i].Name(g_nLoc), 1, 1, 25, "CELL_STYLE_LONG");
            var KPI_n = "";
            var KPI_p = "";
            for (var j = 0; j < KPI_Names.length; j++) {
                KPI_n += KPI_Names[j] + "\n";
                KPI_p += KPI_Percents[j] + " %\n";
            }
            addCell(outfile, [1, 0, 0, 1], KPI_n, 1, 1, 25, "CELL_STYLE_LONG");
            addCell(outfile, [1, 0, 0, 1], KPI_p, 1, 1, 25, "CELL_STYLE_LONG");
            outfile.TableRow();
        }
    } else {
        addCell(outfile, [1, 0, 0, 1], "-", 1, 1, 25, getString("TEXT_STYLE_DEFAULT"));
        addCell(outfile, [1, 0, 0, 1], "-", 1, 1, 25, getString("TEXT_STYLE_DEFAULT"));
        addCell(outfile, [1, 0, 0, 1], "-", 1, 1, 25, getString("TEXT_STYLE_DEFAULT"));
        outfile.TableRow();
    }
    outfile.EndTable(" ", 100, getString("TEXT_FONT_DEFAULT"), 12, Constants.C_BLACK, Constants.C_TRANSPARENT, 0, Constants.FMT_CENTER, 0);
}

function doPart7(listOfDocKnowlege_EPC, listOfDocKnowlege_FAD_cinnost, listOfDocKonwlege_Process) {

    //Dokumentovane znalosti / predipsy
    outfile.BeginTable(100, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_CENTER, 0);
    outfile.TableRow();
    addCell(outfile, [0, 0, 0, 0], getString("TEXT_LABEL7_0"), 1, 1, 25, "Header_Center_Blue");
    addCell(outfile, [0, 0, 0, 0], getString("TEXT_LABEL7_1"), 1, 1, 35, "Header_Center_Blue");
    addCell(outfile, [0, 0, 0, 0], getString("TEXT_LABEL7_2"), 1, 1, 25, "Header_Center_Blue");
    addCell(outfile, [0, 0, 0, 0], "", 1, 1, 25, "Header_Center_Blue");
    outfile.TableRow();

    if (listOfDocKnowlege_EPC != "") { //functions
        for (var i = 0; i < listOfDocKnowlege_EPC.length; i++) {
            var nameDocKnow = listOfDocKnowlege_EPC[i].ObjDef().Name(g_nLoc);
            var proces = getSuperProcesFromDocKnow(listOfDocKnowlege_EPC[i]);
            var cinnost = getCnxCinnostFromDocKnow(listOfDocKnowlege_EPC[i]);

            addCell(outfile, [1, 0, 0, 1], nameDocKnow, 1, 1, 25, "CELL_STYLE_LONG");
            addCell(outfile, [1, 0, 0, 1], proces, 1, 1, 35, "CELL_STYLE_LONG");
            addCell(outfile, [1, 0, 0, 1], cinnost, 1, 1, 50, getString("TEXT_STYLE_DEFAULT"));
            // addCell(outfile, [1, 0, 0, 1], getString("TEXT_PART7_FROM_EPC"), 1, 1, 25, getString("TEXT_STYLE_DEFAULT"));
            outfile.TableRow();
        } //for
    }
    if (docKnw_map_process.size() > 0) {

        keys = docKnw_map_process.keySet();
        for (i = keys.iterator(); i.hasNext();) {
            doc_key = i.next();
            activity = docKnw_map_process.get(doc_key);

            addCell(outfile, [1, 0, 0, 1], doc_key, 1, 1, 25, "CELL_STYLE_LONG");
            addCell(outfile, [1, 0, 0, 1], activity, 1, 1, 25, "CELL_STYLE_LONG");
            addCell(outfile, [1, 0, 0, 1], "", 1, 1, 25, getString("TEXT_STYLE_DEFAULT"));
            addCell(outfile, [1, 0, 0, 1], getString("TEXT_PART7_FROM_FAD"), 1, 1, 25, getString("TEXT_STYLE_DEFAULT"));
            outfile.TableRow();
        } //for  
    }
    if (listOfDocKnowlege_EPC == "") {
        if (docKnw_map_process.size() == 0) {
            addCell(outfile, [1, 0, 0, 1], "-", 1, 1, 25, getString("TEXT_STYLE_DEFAULT"));
            addCell(outfile, [1, 0, 0, 1], "", 1, 1, 25, getString("TEXT_STYLE_DEFAULT"));
            addCell(outfile, [1, 0, 0, 1], "", 1, 1, 25, getString("TEXT_STYLE_DEFAULT"));
            addCell(outfile, [1, 0, 0, 1], "", 1, 1, 25, getString("TEXT_STYLE_DEFAULT"));
            outfile.TableRow();
        }
    }
    outfile.EndTable(" ", 100, getString("TEXT_FONT_DEFAULT"), 12, Constants.C_BLACK, Constants.C_TRANSPARENT, 0, Constants.FMT_CENTER, 0);
}


/*
 *Get Func from docKnow
 */
function docToCinnost(oObjDef) {
    var name = "";

    //in
    var aCnxs = oObjDef.CxnListFilter(Constants.EDGES_IN);
    if (aCnxs.length > 0) {
        for (var i = 0; i < aCnxs.length; i++) {
            name += aCnxs[i].SourceObjDef().Name(g_nLoc) + " ";
        }
        return name;
    }
    //out
    var aCnxs = oObjDef.CxnListFilter(Constants.EDGES_OUT);
    if (aCnxs.length > 0) {
        for (var i = 0; i < aCnxs.length; i++) {
            name += aCnxs[i].TargetObjDef().Name(g_nLoc) + " ";
        }
        return name;
    }

    if (name == "")
        return "-";
}



function getSuperProcesFromDocKnow(docKnow) {
    var arryof_superiorObjDef = new Array();
    var epcModel = docKnow.Model();
    Context.writeLog(" ---part 7a get assigned Proces for document knowledge")
    Context.writeLog("    doc knowledge: " + docKnow.ObjDef().Name(-1))
    var superObjs = epcModel.getSuperiorObjDefs();
    for (var r = 0; r < superObjs.length; r++) {
        Context.writeLog("       " + superObjs[r].Name(-1))
    }
    if (superObjs.length > 0) {
        return superObjs[0].Name(g_nLoc);
    } else {
        return "-";
    }
}

function getCnxCinnostFromDocKnow(docKnow) {
    var docFunction = new Array();
    var aCnxs = docKnow.CxnOccList();
    if (aCnxs.length > 0) {
        for (var j = 0; j < aCnxs.length; j++) {
            if (aCnxs[j].CxnDef().TypeNum() == 453) { //podporuje
                var cnxOut_Occ = aCnxs[j].TargetObjOcc();
                Context.writeLog("     ss: Document knowledge " + aCnxs[j].TargetObjOcc().ObjDef().Name(-1) + " " + aCnxs[j].TargetObjOcc().ObjDef().TypeNum());

                if (aCnxs[j].TargetObjOcc().ObjDef().TypeNum() == 22) { //Funkce
                    return aCnxs[j].TargetObjOcc().ObjDef().Name(g_nLoc);

                } //if
            } //if
        } //for
    } //if
}



/*
 * RGB convertor
 */
function RGB(r, g, b) {
    return (new java.awt.Color(r / 255.0, g / 255.0, b / 255.0, 1)).getRGB() & 0xFFFFFF;
}

/*
 * add cell to table
 */
function addCell(p_Output, p_fStyle, p_Text, p_Row, p_Col, p_PerCnt, p_txtStyle) {
    // Usage: addCell( p_Output, [0,1,1,0], "text", 1, 1, 25, getString("TEXT_STYLE_DEFAULT") );
    // Set new Frame Style
    if (p_fStyle.length > 0) {
        setNewFrameStyle(p_Output, p_fStyle);
    }
    // Create output according to Selected Format
    gn_Format = Context.getSelectedFormat()
    if (gn_Format == Constants.OUTPDF) {
        p_Output.TableCellF(p_Text, p_PerCnt, p_txtStyle);
    } else {
        //p_Output.TableCellF(p_Text, p_Row, p_Col, p_txtStyle);
        p_Output.TableCellF(p_Text, p_PerCnt, p_txtStyle)
    }
} //END::addCell()

/*
 * Frame border
 */
function setNewFrameStyle(p_Output, p_Style) {
    p_Output.ResetFrameStyle();
    p_Output.SetFrameStyle(Constants.FRAME_BOTTOM, p_Style[0]);
    p_Output.SetFrameStyle(Constants.FRAME_LEFT, p_Style[1]);
    p_Output.SetFrameStyle(Constants.FRAME_RIGHT, p_Style[2]);
    p_Output.SetFrameStyle(Constants.FRAME_TOP, p_Style[3]);
} //END::setNewFrameStyle()


/* Convert GUID to attribut number
 * @return attrNum
 */
function getAttributNumber(attr_GUID) {
    var attr_Num = ArisData.ActiveFilter().UserDefinedAttributeTypeNum(attr_GUID);
    if (attr_Num == -1) {
        var filtrName = ArisData.ActiveFilter().Name(-1);
        Dialogs.MsgBox("GUID \"" + attr_GUID + "\" doesnt exist in Filter " + filtrName, Constants.MSGBOX_ICON_ERROR + 512, "Message from Report")
        Context.setScriptError(Constants.ERR_CANCEL);
        return -1;
    } else {
        return attr_Num; //ok
    }
}
main();