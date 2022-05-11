/**
 * Customized by IDSA
 */
var g_bStandardEnvironment = Context.getEnvironment().equals(Constants.ENVIRONMENT_STD);
var g_Loc = Context.getSelectedLanguage();
//var g_aNotAssignedFuncs         = new java.util.HashSet();
var g_oOut;

var g_aModelTypes;
var g_aRoleTypes;
var g_aCxnTypes_R;
var g_aCxnTypes_A;
var g_aCxnTypes_S;
var g_aCxnTypes_C;
var g_aCxnTypes_I;

var g_oProcessModels = new Array();
var g_oDoneModels = new Array();
var g_sModelNames = [getString("TEXT_1")];

/************************************************************************************/



g_aModelTypes = initModelTypes();
g_aRoleTypes = initRoleTypes();

g_aCxnTypes_R = initCxnTypes_R();
/*g_aCxnTypes_A = initCxnTypes_A();
g_aCxnTypes_S = initCxnTypes_S();
g_aCxnTypes_C = initCxnTypes_C();
g_aCxnTypes_I = initCxnTypes_I();*/

g_oProcessModels = getProcessModels(0);



/************************************************************************************/
// fill Array with data information
function getData(oFuncObjects, oOrgObjects, oProcessModel) {
    var arrOuter = new Array();

    for (var i = 0; i < oFuncObjects.length; i++) {
        var oFuncObject = oFuncObjects[i];

        var arrInner = new Array();

        for (var j = 0; j < oOrgObjects.length; j++) {

            var oOrgObject = oOrgObjects[j];

            var result = getRASCIValue(oFuncObject, oOrgObject, oProcessModel);
            var nCellColor = Constants.C_WHITE;
            var nCount = 0;

            if (result.indexOf("R") >= 0) {
                nCellColor = nCellColor = RGB(255, 255, 255); //CEZ RGB(242, 79, 0
                nCount = nCount + 100000;
            }
            if (result.indexOf("A") >= 0) {
                nCellColor = new java.awt.Color(0.99609375, 0.5, 0.75).getRGB();
                nCount = nCount + 10000;
            }
            if (result.indexOf("S") >= 0) {
                nCellColor = new java.awt.Color(0.5, 0.5, 0.99609375).getRGB();
                nCount = nCount + 1000;
            }
            if (result.indexOf("C") >= 0) {
                nCellColor = new java.awt.Color(0.99609375, 0.81640625, 0.640625).getRGB();
                nCount = nCount + 100;
            }
            if (result.indexOf("I") >= 0) {
                nCellColor = new java.awt.Color(0.7890625, 0.99609375, 0.99609375).getRGB();
                nCount = nCount + 10;
            }

            if (result.length > 1) { // multiple entries like "R, A, ..."
                nCellColor = nCellColor = Constants.C_LIME;
            }

            var myOut = new myOutput(oFuncObject, oOrgObject);
            myOut.rasciValue = result;
            myOut.colour = nCellColor;
            myOut.nCount = nCount;
            arrInner.push(myOut);
        }
        if (arrInner.length > 0) arrOuter.push(arrInner);
    }
    return arrOuter;
}

//Output
function outTables(arrOuter, sProcessName, bCheckFuncAssignments) {
    var nMAX_COUNT = 50; //max objdefs in Matrix!!!

    if (arrOuter.length <= 0) return;

    arrOuter = sortArray(arrOuter);

    var nCount = 0;
    var bLoop = true;
    var nStart = 0;
    var nEnd = nStart + nMAX_COUNT;
    if (nEnd > arrOuter[0].length) nEnd = arrOuter[0].length;

    while (bLoop) {

        g_oOut.BeginTable(100, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_LEFT, 0);
        g_oOut.TableRow();
        if (bCheckFuncAssignments) {
            /***********/
            g_oOut.TableCell(getString("TEXT_2"), 20, getString("TEXT_FONT_DEFAULT"), 10, Constants.C_BLACK, new java.awt.Color(0.65625, 0.8984375, 0.57421875).getRGB(), 0,  Constants.FMT_CENTER | Constants.FMT_VTOP, 0);
            /*************/
        }
       // g_oOut.ResetFrameStyle();
       // g_oOut.SetFrameStyle(Constants.FRAME_TOP, 0) // 0: zeichnet z.B. keine */
       // g_oOut.SetFrameStyle(Constants.FRAME_BOTTOM, 0) // 0: zeichnet z.B. keine */
       // g_oOut.SetFrameStyle(Constants.FRAME_LEFT, 0) // 0: zeichnet z.B. keine */
        
       //g_oOut.SetFrameStyle(Constants.FRAME_TOP, 10) // 0: zeichnet z.B. keine */
           
        g_oOut.TableCell("Funkce↓/Role→", 22, getString("TEXT_FONT_DEFAULT"), 10, Constants.C_BLACK, Constants.C_WHITE, 0, Constants.FMT_BOLD | Constants.FMT_CENTER | Constants.FMT_VCENTER, 0);

       
        for (var j = nStart; j < nEnd; j++) {
             g_oOut.TableCell(arrOuter[0][j].roleElemDef.Name(g_Loc), 10, getString("TEXT_FONT_DEFAULT"), 10, Constants.C_BLACK, RGB(255, 255, 255), 0,  Constants.FMT_CENTER | Constants.FMT_VERT_UP, 0);
            /*
            if (arrOuter[0][j].roleElemDef.TypeNum() == Constants.OT_APPL_SYS_TYPE)
                g_oOut.TableCell(arrOuter[0][j].roleElemDef.Name(g_Loc), 6, getString("TEXT_FONT_DEFAULT"), 10, Constants.C_BLACK, RGB(150, 255, 255), 0, Constants.FMT_BOLD | Constants.FMT_CENTER | Constants.FMT_VERT_UP, 0);
            else
                g_oOut.TableCell(arrOuter[0][j].roleElemDef.Name(g_Loc), 6, getString("TEXT_FONT_DEFAULT"), 10, Constants.C_BLACK, RGB(255, 255, 150), 0, Constants.FMT_BOLD | Constants.FMT_CENTER | Constants.FMT_VERT_UP, 0);
            */
        }
         g_oOut.ResetFrameStyle();
        

        for (var i = 0; i < arrOuter.length; i++) {
          //  if (hasFunctionAworth(arrOuter[i]) == true) {
                g_oOut.TableRow();

                if (bCheckFuncAssignments) {
                    g_oOut.TableCell(getProcessAssignment(arrOuter[i][0].funcDef), 22, getString("TEXT_FONT_DEFAULT"), 10, Constants.C_BLACK, RGB(149, 259, 149), 0,  Constants.FMT_LEFT | Constants.FMT_VTOP, 0);
                }
               // g_oOut.ResetFrameStyle();
               // g_oOut.SetFrameStyle(Constants.FRAME_LEFT, 0) // 0: zeichnet z.B. keine */
               // g_oOut.SetFrameStyle(Constants.FRAME_RIGHT, 0) // 0: zeichnet z.B. keine */
      
                var keyIndex = "";
             //   if (arrOuter[i][0].funcDef.Attribute(1208, g_Loc).IsMaintained())
                    keyIndex = arrOuter[i][0].funcDef.Attribute(1208, g_Loc).getValue() + " ";
                 g_oOut.TableCell(keyIndex + arrOuter[i][0].funcDef.Name(g_Loc), 22, getString("TEXT_FONT_DEFAULT"), 10, Constants.C_BLACK, RGB(255, 255, 255), 0,  Constants.FMT_LEFT | Constants.FMT_VTOP, 0);
                //g_oOut.TableCell(keyIndex + arrOuter[i][0].funcDef.Name(g_Loc), 22, getString("TEXT_FONT_DEFAULT"), 10, Constants.C_BLACK, RGB(150, 255, 150), 0, Constants.FMT_BOLD | Constants.FMT_LEFT | Constants.FMT_VTOP, 0);

                 g_oOut.ResetFrameStyle();
                for (var j = nStart; j < nEnd; j++) {
                    g_oOut.TableCell(arrOuter[i][j].rasciValue, 10, getString("TEXT_FONT_DEFAULT"), 10, Constants.C_BLACK, arrOuter[i][j].colour, 0, Constants.FMT_BOLD | Constants.FMT_CENTER | Constants.FMT_VCENTER, 0);
                }
         /*   } else {
                if (bCheckFuncAssignments) {
                    g_aNotAssignedFuncs.add(arrOuter[i][0].funcDef);
                }
            }*/
        }
        var sTableName = sProcessName;
        if (nCount > 0) sTableName = "" + (nCount + 1) + ". " + sProcessName;
        g_oOut.EndTable("", 100, getString("TEXT_FONT_DEFAULT"), 10, Constants.C_BLACK, Constants.C_TRANSPARENT, 0, Constants.FMT_LEFT | Constants.FMT_VTOP, 0);

        if (nEnd == arrOuter[0].length) {
            bLoop = false;
        } else {
            nStart = nEnd;
            nEnd = nStart + nMAX_COUNT;
            if (nEnd > arrOuter[0].length) nEnd = arrOuter[0].length;
            nCount++;
        }
    }
}

// Output of the functions which are not in List 
function outNotAssignedFuncsList() {
    g_oOut.BeginTable(100, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_LEFT, 0);
    for (var iter = g_aNotAssignedFuncs.iterator(); iter.hasNext();) {
        var func = iter.next();
        g_oOut.TableRow();
        g_oOut.TableCell(func.Name(g_Loc), 20, getString("TEXT_FONT_DEFAULT"), 10, Constants.C_BLACK, new java.awt.Color(0.72265625, 0.99609375, 0.72265625).getRGB(), 0, Constants.FMT_BOLD | Constants.FMT_CENTER | Constants.FMT_VERT_DOWN, 0);
        g_oOut.TableCell(getProcessAssignment(func), 20, getString("TEXT_FONT_DEFAULT"), 10, Constants.C_BLACK, Constants.C_TRANSPARENT, 0, Constants.FMT_BOLD | Constants.FMT_CENTER | Constants.FMT_VTOP, 0);
    }
    g_oOut.EndTable(getString("TEXT_4"), 100, getString("TEXT_FONT_DEFAULT"), 10, Constants.C_BLACK, Constants.C_TRANSPARENT, 0, Constants.FMT_LEFT | Constants.FMT_VTOP, 0);
}

function getProcessAssignment(funcDef) {
    var sModelList = "";
    var oObjOccList = funcDef.OccList()
    for (var i = 0; i < oObjOccList.length; i++) {
        var oObjOcc = oObjOccList[i];
        var oModel = oObjOcc.Model();

        if (isModelInList(oModel, g_oProcessModels, false /*p_bAddToList*/ )) {
            if (sModelList.length > 0) sModelList = sModelList + ", ";
            sModelList = sModelList + oModel.Name(g_Loc);
        }
    }
    return sModelList;
}

//
function hasFunctionAworth(p_arrInner) {
    var nCount = 0;
    for (var i = 0; i < p_arrInner.length; i++) {
        nCount = nCount + p_arrInner[i].nCount;
    }
    return (nCount > 0);
}

function getProcessModels(p_nMaxHierarchyLevel) {
    var oProcessModels = new Array();
    var oSelModels = ArisData.getSelectedModels();
    // get relevant process models
    for (var i = 0; i < oSelModels.length; i++) {
        var oModel = oSelModels[i];
        addProcessModel(oModel, oProcessModels, 0, p_nMaxHierarchyLevel);
    }
    return oProcessModels;
}

function addProcessModel(p_oModel, p_oProcessModels, p_nHierarchyLevel, p_nMaxHierarchyLevel) {
    if (!isModelInList(p_oModel, g_oDoneModels, true /*p_bAddToList*/ )) {
        var bCheck = checkTypeNum(p_oModel.OrgModelTypeNum(), g_aModelTypes);
        if (bCheck == true) {
            p_oProcessModels.push(p_oModel);

            if (p_nHierarchyLevel < p_nMaxHierarchyLevel) {
                addHierarchyModels(p_oModel, p_oProcessModels, p_nHierarchyLevel + 1);
            }
        }
    }

    function addHierarchyModels(p_oModel, p_oProcessModels, p_nHierarchyLevel) {
        var oFuncDefs = p_oModel.ObjDefListFilter(Constants.OT_FUNC);
        for (var i = 0; i < oFuncDefs.length; i++) {
            var oFuncDef = oFuncDefs[i];
            var oAssignedModels = oFuncDef.AssignedModels();

            for (var j = 0; j < oAssignedModels.length; j++) {
                addProcessModel(oAssignedModels[j], p_oProcessModels, p_nHierarchyLevel, p_nMaxHierarchyLevel);
            }
        }
    }
}

function isModelInList(p_oModel, p_oModelList, p_bAddToList) {
    for (var i = 0; i < p_oModelList.length; i++) {
        if (p_oModel.IsEqual(p_oModelList[i])) return true;
    }
    if (p_bAddToList) { // AGA-5707, Call-ID 297980
        p_oModelList.push(p_oModel);
    }
    return false;
}

function getFunctionObjects(p_oProcessModels) {
    var oFuncObjects = new Array();
    for (var i = 0; i < p_oProcessModels.length; i++) {
        //for (var i in p_oProcessModels) {
        //var oFuncDefs = p_oProcessModels[i].ObjDefListFilter(Constants.OT_FUNC); //all funcs
          var oFuncDefs = getFuncObjDefFromModel(p_oProcessModels[i], Constants.ST_FUNC); // all hnizda
        
        oFuncObjects = oFuncObjects.concat(oFuncDefs);
    }
    oFuncObjects = ArisData.Unique(oFuncObjects);
    //oFuncObjects = ArisData.sort(oFuncObjects, Constants.AT_NAME, g_Loc);
    //oFuncObjects = ArisData.sort(oFuncObjects, attr_KeyIdentifier, g_Loc);
    oFuncObjects = ArisData.sort(oFuncObjects, 1208, Constants.AT_NAME, g_Loc);
    return oFuncObjects;
}

/*Get Defs from first column of swim lane model */
function getRoleObjectsFromLane(oModel){
    var oRoleDefs = new Array();
    var lanes =oModel.GetLanes (Constants.LANE_VERTICAL);
  
  if(lanes.length>0){
        var occs = lanes[0].ObjOccs();
        for (var j = 0; j < occs.length; j++) {
            oRoleDefs.push(occs[j].ObjDef());
      }
    }
    oRoleDefs = ArisData.sort(oRoleDefs,Constants.AT_NAME, g_Loc );
    return ArisData.Unique(oRoleDefs);
}

/*Get Occs from first column of swim lane model */
function getRoleOccsFromLane(oModel){
    var oRoleOccs= new Array();
    var lanes =oModel.GetLanes (Constants.LANE_VERTICAL);
  
    if(lanes.length>0){
        var occs = lanes[0].ObjOccs();
        for (var j = 0; j < occs.length; j++) {
            oRoleOccs.push(occs[j]);
      }
    }
    oRoleOccs = ArisData.sort(oRoleOccs,Constants.AT_NAME, g_Loc );
    return ArisData.Unique(oRoleOccs);
}


function getRoleObjects(p_oProcessModels) {
    var oOrgObjects = new Array();
    // for (var i in p_oProcessModels) {
    for (var i = 0; i < p_oProcessModels.length; i++) {
        var oProcessModel = p_oProcessModels[i];
        oOrgObjects = oOrgObjects.concat(getOrgElements(oProcessModel));
        // BLUE-6519
        var oAssignedFadModels = getAssignedFadModels(oProcessModel);
        for (var j = 0; j < oAssignedFadModels.length; j++) {
            //for (var j in oAssignedFadModels) {
            oOrgObjects = oOrgObjects.concat(getOrgElements(oAssignedFadModels[j]));
        }
    }
    oOrgObjects = ArisData.Unique(oOrgObjects);
    return oOrgObjects.sort();

    function getOrgElements(p_oModel) {
        var oOrgDefs = new Array();
        var oObjDefs = p_oModel.ObjDefList();
        for (var i = 0; i < oObjDefs.length; i++) {
            //for (var i  in oObjDefs) {
            var oObjDef = oObjDefs[i];
            if (checkTypeNum(oObjDef.TypeNum(), g_aRoleTypes)) {
                oOrgDefs.push(oObjDef);
            }
        }
    return oOrgDefs.sort();
    }

    function getAssignedFadModels(p_oModel) {
        var oAssignedFadModels = new Array();
        var oFuncDefs = p_oModel.ObjDefListFilter(Constants.OT_FUNC);
        for (var i = 0; i < oFuncDefs.length; i++) {
            //for (var i in oFuncDefs) {
            oAssignedFadModels = oAssignedFadModels.concat(oFuncDefs[i].AssignedModels(Constants.MT_FUNC_ALLOC_DGM));
        }
        return oAssignedFadModels;
    }
}

function getRASCIValue(p_oFuncObject, p_oOrgObject, p_oModel) {
    var sRasciValue = "";
    var oRASCICxns = new Array();

    var oCxns = getRASCICxns(p_oFuncObject, p_oOrgObject, p_oModel);
    for (var i = 0; i < oCxns.length; i++) {
        oCxn = oCxns[i];
        // R
        var bCheck = checkTypeNum(oCxn.TypeNum(), g_aCxnTypes_R);
        if (bCheck == true) sRasciValue = writeRasciValue(sRasciValue, "R"); //return "R";
        /*
        // A
        var bCheck = checkTypeNum(oCxn.TypeNum(), g_aCxnTypes_A);
        if (bCheck == true) sRasciValue = writeRasciValue(sRasciValue, "A");  //return "A";
        // S
        var bCheck = checkTypeNum(oCxn.TypeNum(), g_aCxnTypes_S);
        if (bCheck == true) sRasciValue = writeRasciValue(sRasciValue, "S");  //return "S";
        // C
        var bCheck = checkTypeNum(oCxn.TypeNum(), g_aCxnTypes_C);
        if (bCheck == true) sRasciValue = writeRasciValue(sRasciValue, "C");  //return "C";
        // I
        var bCheck = checkTypeNum(oCxn.TypeNum(), g_aCxnTypes_I);
        if (bCheck == true) sRasciValue = writeRasciValue(sRasciValue, "I");  //return "I";*/
    }
    return sRasciValue;
}

function writeRasciValue(sRasciValue, sCurrentValue) {
    if (sRasciValue.length > 0) {
        sRasciValue = sRasciValue + ", ";
    }
    sRasciValue = sRasciValue + sCurrentValue;
    return sRasciValue;
}

function getRASCICxns(p_oFuncObject, p_oOrgObject, p_oModel) {
    // RichClient, all models -> Evaluate all cxn defs
    if (g_bStandardEnvironment && p_oModel == null) {
        return filterCxns(p_oFuncObject.CxnList(getDirection()));
    }
    // else evaluate cxn occs in relevant models
    var oRelevantCxns = new Array();
    var oModels = getRelevantModels();
    for (var i = 0; i < oModels.length; i++) {
        //for (var i in oModels) {
        var oFuncObjOccs = p_oFuncObject.OccListInModel(oModels[i]);
        oFuncObjOccs = oFuncObjOccs.concat(getFuncOccsInAssignedFadModel()); // BLUE-6519

        //for (var j in oFuncObjOccs) {
        for (var j = 0; j < oFuncObjOccs.length; j++) {
            oRelevantCxns = oRelevantCxns.concat(getRelevantCxns(oFuncObjOccs[j]));
        }
    }
    return ArisData.Unique(oRelevantCxns);

    function getRelevantModels() {
        if (p_oModel == null) return g_oProcessModels;
        return [p_oModel];
    }

    function getRelevantCxns(oFuncObjOcc) {
        var oCxnOccs = getFunctionCxns();
        return filterCxns(oCxnOccs);

        function getFunctionCxns() {
            if (getDirection() == Constants.EDGES_OUT)
                return oFuncObjOcc.OutEdges(Constants.EDGES_ALL);
            else
                return oFuncObjOcc.InEdges(Constants.EDGES_ALL);
        }
    }

    function getDirection() {
        //        if (p_oOrgObject.TypeNum() == Constants.OT_SYS_ORG_UNIT_TYPE)
        //            return Constants.EDGES_OUT;
        //        else
        return Constants.EDGES_IN;
    }

    function filterCxns(oCxns) {
        var oFilteredCxns = new Array();
        for (var i = 0; i < oCxns.length; i++) {
            // for (var i in oCxns) {
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

    function getFuncOccsInAssignedFadModel() {
        var oAssignedFuncOccs = new Array();
        var oAssignedFadModels = p_oFuncObject.AssignedModels(Constants.MT_FUNC_ALLOC_DGM);
        for (var i = 0; i < oAssignedFadModels.length; i++) {
            //for (var i in oAssignedFadModels) {
            var oFuncOccs = p_oFuncObject.OccListInModel(oAssignedFadModels[i]);
            if (oFuncOccs.length > 0) {
                oAssignedFuncOccs = oAssignedFuncOccs.concat(oFuncOccs);
            }
        }
        return oAssignedFuncOccs;
    }
}

// check typenum
function checkTypeNum(p_nType, p_aTypes) {
    for (var i = 0; i < p_aTypes.length; i++) {
        if (p_nType == p_aTypes[i]) return true;
    }
    return false;
}

// init list of model types
function initModelTypes() {
    return [Constants.MT_EEPC,
        Constants.MT_EEPC_COLUMN,
        Constants.MT_EEPC_MAT,
        Constants.MT_EEPC_ROW,
        Constants.MT_EEPC_TAB,
        Constants.MT_EEPC_TAB_HORIZONTAL,
        Constants.MT_IND_PROC,
        Constants.MT_OFFICE_PROC,
        Constants.MT_PRCS_CHN_DGM,
        Constants.MT_PCD_MAT,
        Constants.MT_VAL_ADD_CHN_DGM,
        Constants.MT_BPMN_COLLABORATION_DIAGRAM,
        Constants.MT_BPMN_PROCESS_DIAGRAM,
        Constants.MT_ENTERPRISE_BPMN_COLLABORATION,
        Constants.MT_ENTERPRISE_BPMN_PROCESS
    ];
}

// init list of Role types
function initRoleTypes() {
    return [Constants.OT_PERS,
        Constants.OT_POS, //funkcni misto
        Constants.OT_EMPL_INST,
        Constants.OT_GRP,
        Constants.OT_ORG_UNIT_TYPE,
        Constants.OT_ORG_UNIT,
        Constants.OT_PERS_TYPE,
        Constants.OT_SYS_ORG_UNIT_TYPE,

        //IT System
        Constants.OT_APPL_SYS_TYPE

    ];
}

//init list of Cxn types "Responsible"
function initCxnTypes_R() {
    return [Constants.CT_DECD_ON,
        Constants.CT_AGREES,
        Constants.CT_EXEC_1,
        Constants.CT_EXEC_2,
        Constants.CT_DECID_ON,

        Constants.CT_CAN_SUPP_1 //Cnx to IT System
    ];
}

//init list of Cxn types "Accountable"
function initCxnTypes_A() {
    return [Constants.CT_IS_DP_RESP_1,
        Constants.CT_IS_DP_RESP_2,
        Constants.CT_IS_TECH_RESP_1,
        Constants.CT_IS_TECH_RESP_3
    ];
}

//init list of Cxn types "Supportive"
function initCxnTypes_S() {
    return [Constants.CT_CONTR_TO_2,
        Constants.CT_CONTR_TO_1,
        Constants.CT_IS_ASSIG_1,
        Constants.CT_CAN_BE_ASSIG
    ];
}

//init list of Cxn types "Consulted"
function initCxnTypes_C() {
    return [Constants.CT_HAS_CONSLT_ROLE_IN_2,
        Constants.CT_HAS_CONSLT_ROLE_IN_1
    ];
}

//init list of Cxn types "Informed"
function initCxnTypes_I() {
    return [Constants.CT_MUST_BE_INFO_ABT_1,
        Constants.CT_MUST_BE_INFO_ABT_2,
        Constants.CT_MUST_BE_INFO_ON_CNC_1,
        Constants.CT_MUST_BE_INFO_ON_CNC_2,
        Constants.CT_MUST_INFO_ABT_RES_OF,
        Constants.CT_MUST_INFO_ABT_RES
    ];
}

function myOutput(p_funcDef, p_roleElemDef) {
    this.funcDef = p_funcDef;
    this.roleElemDef = p_roleElemDef;
    this.rasciValue = "";
    this.nCount = 0;
    this.colour = Constants.C_TRANSPARENT;
}

function sortArray(aArray) {
    if (aArray.length > 0 && aArray[0].length > 0) {
        var aTmpArray = turnArray(aArray);

        aTmpArray.sort(sortRasci);
        return turnArray(aTmpArray);
    }
    return aArray;
}

function sortRasci(a, b) {
    return (getSum(b) - getSum(a));
}

function getSum(innerArray) {
    var sum = 0;
    for (var i = 0; i < innerArray.length; i++) {
        sum = sum + innerArray[i].nCount;
    }
    return sum;
}

function turnArray(aArray) {
    var aNewOuter = new Array();

    if (aArray.length > 0) {
        var innerMax = aArray[0].length;
        for (var inner = 0; inner < innerMax; inner++) {
            var aNewInner = new Array();
            for (var outer = 0; outer < aArray.length; outer++) {
                aNewInner.push(aArray[outer][inner]);
            }
            aNewOuter.push(aNewInner);
        }
    }
    return aNewOuter;
}

function getModelName(modelName) {
    var nIdx = 1;
    var modelName = getValidName(modelName);
    while (!isAllowedName(modelName)) {
        modelName = modelName.substr(0, modelName.length - 3) + formatstring1("(@1)", nIdx++);
    }
    g_sModelNames.push(modelName.toLowerCase());
    return modelName;

    function isAllowedName(modelName) {
        for (var i = 0; i < g_sModelNames.length; i++) {
            if (StrComp(modelName.toLowerCase(), g_sModelNames[i]) == 0) return false;
        }
        return true;
    }

    function getValidName(sName) {
        sName = "" + sName;
        var npos = serchforspecialchar(sName);
        if (npos >= 0 && npos <= 31) {
            nPos = Math.min(npos, 28);
            sName = sName.substr(0, npos) + "...";
        }
        if (sName.length > 31) {
            sName = sName.substr(0, 28) + "...";
        }
        return sName;
    }
}

function showOptionsDialog() {
    /*  var nHierarchyLevel = 0;

      var binput = false;   // Variable to check if input is correct
      var nuserdlg = 0;   // Variable to check if the user choose in the dialog the alternative "cancel"
      while (binput == false && ! (nuserdlg == 1)) {
          var userdialog = Dialogs.createNewDialogTemplate(0, 0, 450, 120, getString("TEXT_5"));
          
          userdialog.GroupBox(10, 10, 440, 45, getString("TEXT_6"));
          userdialog.Text(20, 25, 140, 15, getString("TEXT_6"));
          userdialog.TextBox(185, 25, 60, 21, "txtLinkLevels");
          userdialog.OKButton();
          userdialog.CancelButton();
        //userdialog.HelpButton("HID_277051f0_77e9_11dc_0f7d_0014224a1763_dlg_01.hlp");
          
          var dlg = Dialogs.createUserDialog(userdialog); 
          dlg.setDlgText("txtLinkLevels", nHierarchyLevel);
          
          nuserdlg = Dialogs.show( __currentDialog = dlg);       // Show Dialog and waiting for confirmation with  OK
          
          nHierarchyLevel = dlg.getDlgText("txtLinkLevels");        
          if (isNaN(nHierarchyLevel)) {
              Dialogs.MsgBox(getString("TEXT_7"), Constants.MSGBOX_BTN_OK, getString("TEXT_8"));
          } else {
              nHierarchyLevel = parseInt(nHierarchyLevel);
              if (nHierarchyLevel < 0) {
                  Dialogs.MsgBox(getString("TEXT_9"), Constants.MSGBOX_BTN_OK, getString("TEXT_8"));          
              } else { 
                  binput = true;
              }
          }
          if (!binput) nHierarchyLevel = 0;
      }
      if (nuserdlg == 0) return null;*/
    return 0;
}

///
function RGB(r, g, b) {
    return (new java.awt.Color(r / 255.0, g / 255.0, b / 255.0, 1)).getRGB() & 0xFFFFFF;
}