/****************************************************************************************************************/
/*  Author:         RV                                                                                          */
/*  Organisation:   IDSA                                              .                                          */
/*  Date:           2020/11a                                                                                     */
/*  Description:    Export RASI /DMI to XLSX                                                                    */
/****************************************************************************************************************/

/*
RASCI > RASI
R = Responsible (Durchführung): Führt die Aktivität aus
A = Approval (Genehmigung): Genehmigt oder billigt eine Aktivität (z. B. durch Unterschrift)   >Accountable
S = Support (Unterstützung): Unterstützt eine Aktivität (z. B. durch Bereitstellung von Informationen, Hilfsmitteln, Beratung) >Supportive
I = Informed (Information): Wird über eine Aktivität informiert
     
DEMI > DMI
D steht für Durchführungsverantwortung
E steht für Ergebnisverantwortung
M steht für Mitarbeit
I steht für Information */


function doMatrix(g_Outfile, oModel, bRASI, g_sortMethod) {

    /**
     *returns true if array contains an element or false if not.
     *@return boolean
     *@type boolean
     *@param {-} p_element an element which should be find in the Array
     *@addon
     */
    Array.prototype.contains = function(p_element) {
        for(var i = 0; i < this.length; i++) {
            if(this[i].toString().equals(p_element.toString())) return true;
        }
        return false;
    }


    var g_nLoc = Context.getSelectedLanguage();
    var g_nLocDE = 1033;
    var g_nLocEN = 1031;
    var isAUDI = false;
    var oSelModels = ArisData.getSelectedModels();
    var isTooComplex = false;

    //var SYM_STAT = ArisData.ActiveFilter().UserDefinedAttributeTypeNum("9676fb91-8159-11e4-5006-b7d8c0bff8d4"); //VWAudiConstants.SYM_STAT_OB;
    var SYM_STAT = VWAudiConstants.SYM_STAT_OBJ;
    var funcs = new Array();

    // Report Configuration
    const SHOW_DIALOGS_IN_CONNECT = false; // Show dialogs in ARIS Connect - Default=false (BLUE-12274)
    const EVAL_SATELLITES = SAG_INTERNAL.hasConfiguration(); // BLUE-20839

    /****************************************************/
    Context.setProperty("excel-formulas-allowed", false); //default value is provided by server setting (tenant-specific): "abs.report.excel-formulas-allowed"
    // Dialog support depends on script runtime environment (STD resp. BP, TC)
    var g_bStandardEnvironment = 0; // isDialogSupported(); no hiearchy

    var g_nLoc = Context.getSelectedLanguage();
    var g_aNotAssignedFuncs = new java.util.HashSet();
    var oOutputFile = g_Outfile;

    var R = "R";
    var A = "A";
    var S = "S";
    var I = "I";

    var D = "D";
    var M = "M";
    var I = "I";

    var g_aModelTypes;
    var g_aOrgTypes;
    var g_aCxnTypes_R;
    var g_aCxnTypes_A;
    var g_aCxnTypes_S;
    //var g_aCxnTypes_C;
    var g_aCxnTypes_I;

    var g_aCxnTypes_D;
    var g_aCxnTypes_M;

    var g_oProcessModels = new Array();
    var g_oDoneModels = new Array();
    var g_sModelNames = [getString("ALL_OVERVIEW")];

    var nHierarchyLevel = 0; // EC-5656 - Hierarchiy level = 0
    //var bRASI = false; // true: RASI, false: RCI
    //var g_sortMethod = 0; //0 flow for funcs, asc 1 desc 2 

    //202101 without these rolles
    var db = ArisData.getActiveDatabase();

    var skipRollesGUID = new Array();
    //TODO extra here, consult
    var SteuerungUndUnterstützungsprozesse = "6e8767b1-6578-11ea-50ea-005056af6d0b";
    var Steuerungsprozesse = "2b6ee4a7-e311-4954-92a5-894944f96883";
    var Unterstützungsprozesse = "b573b913-d1ff-11df-3814-002481dea4fa";

    skipRollesGUID.push(SteuerungUndUnterstützungsprozesse);
    skipRollesGUID.push(Steuerungsprozesse);
    skipRollesGUID.push(Unterstützungsprozesse);

    search_SteuerUndUnterprozesse = "Steueru*proz*";
    search_Unterprozesse = "Unter*proz*";

    var searchItem = db.createSearchItem(Constants.AT_NAME, 1031, search_SteuerUndUnterprozesse, Constants.SEARCH_CMP_EQUAL, true, true) //case sensitive, allow wildcards  // Steuerungsprozesse; Steuerung && Unterstützungsprozesse!
    var searchItem2 = db.createSearchItem(Constants.AT_NAME, 1031, search_Unterprozesse, Constants.SEARCH_CMP_EQUAL, true, true) //case sensitive, allow wildcards
    var result = db.Find(Constants.SEARCH_OBJDEF, [Constants.OT_PERS_TYPE], searchItem.or(searchItem2))


    for(var i = 0; i < result.length; i++) {
        skipRollesGUID.push(result[i].GUID());
    }

    skipRollesGUID = ArisData.Unique(skipRollesGUID);



    isAUDI = IDSA.isAudiFolder(oSelModels[0]);

    /* if(!Context.getEnvironment().equals(Constants.ENVIRONMENT_BP)) { // Never show dialog in Business Publisher
     
     /*    var aOptions = showOptionsDialog(g_bStandardEnvironment);
         if(aOptions != null) {
             bRASI = (aOptions[0] == 0);
             nHierarchyLevel = aOptions[1];
             g_sortMethod = aOptions[2];
         } else {
             nHierarchyLevel = null;
         }
     }
     */




    if(nHierarchyLevel != null) {
        g_aModelTypes = initModelTypes();
        g_aOrgTypes = initOrgTypes();

        if(bRASI) { //RASI
            g_aCxnTypes_R = initCxnTypes_R();
            g_aCxnTypes_A = initCxnTypes_A();
            g_aCxnTypes_S = initCxnTypes_S();
            g_aCxnTypes_I = initCxnTypes_I();
        } else { //DMI
            g_aCxnTypes_D = initCxnTypes_D();
            g_aCxnTypes_M = initCxnTypes_M();
            g_aCxnTypes_I = initCxnTypes_I();
        }

        g_oProcessModels = getProcessModels(nHierarchyLevel);

        if(g_oProcessModels.length > 0) {
            //  oOutputFile = Context.createOutputObject();

            // var oFuncObjects = getFunctionObjects(g_oProcessModels); // get relevant function objects
            // var oOrgObjects = getOrgObjects(g_oProcessModels); // get relevant org objects

            //overview all
            //var arrOuter = getData(oFuncObjects, oOrgObjects, null);
            // outTables(arrOuter, getString("ALL_OVERVIEW"), true);

            var j = 1;
            for(var i = 0; i < g_oProcessModels.length; i++) {
                var oModel = g_oProcessModels[i];
                var modelName = getModelName(oModel.Name(g_nLoc));

                var oFuncDefs = getFunctionObjects([oModel]);
                var oOrgDefs = getOrgObjects([oModel]);

                var arrOuter = getData(oFuncDefs, oOrgDefs, oModel);

                if(arrOuter.length > 0) {
                    g_Outfile.OutputLn(getString("TXT_DMI_DESC", g_sLoc), "Arial", 12, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_LEFT, 8);
                }

                if(isAUDI) {
                    outTables_AUDI(arrOuter, modelName, false);
                } else
                    outTables_VW(arrOuter, modelName, false);
            }

            if(isTooComplex) {
                Dialogs.MsgBox(getString("TEXT_WARN_TOO_COMPLEX"), Constants.MSGBOX_ICON_WARNING, Context.getScriptInfo(Constants.SCRIPT_TITLE));
            }
            //outNotAssignedFuncsList();
            // oOutputFile.WriteReport();
        } else {
            if(g_bStandardEnvironment) {
                Dialogs.MsgBox(getString("TEXT_11"), Constants.MSGBOX_BTN_OK, Context.getScriptInfo(Constants.SCRIPT_TITLE));
                // Context.setScriptError(Constants.ERR_NOFILECREATED);
            } else {
                outEmptyResult(); // BLUE-10824 Output empty result in Connect
            }
        }
    } else {
        // Context.setScriptError(Constants.ERR_CANCEL);
    }


    /**********************/

    /************************************************************************************/
    // fill Array with data information
    function getData(oFuncObjects, oOrgObjects, oProcessModel) {

        var arrOuter = new Array();
        for(var i = 0; i < oFuncObjects.length; i++) {
            var oFuncObject = oFuncObjects[i];
            var arrInner = new Array();

            for(var j = 0; j < oOrgObjects.length; j++) {

                var oOrgObject = oOrgObjects[j];
                var result = getRASI_DMIValue(oFuncObject, oOrgObject, oProcessModel);
                var nCellColor = isAUDI ? Constants.C_WHITE : RGB(175, 194, 209);
                var nCount = 0;

                if(result.indexOf(R) >= 0 || result.indexOf(D) >= 0) {
                    var nCellColor = isAUDI ? Constants.C_WHITE : RGB(255, 199, 206);
                    nCount = nCount + 100000;
                }
                if(result.indexOf(A) >= 0) {
                    var nCellColor = isAUDI ? Constants.C_WHITE : RGB(237, 125, 49);
                    nCount = nCount + 10000;
                }
                if(result.indexOf(S) >= 0 || result.indexOf(M) >= 0) {
                    var nCellColor = isAUDI ? Constants.C_WHITE : RGB(255, 217, 102);
                    nCount = nCount + 1000;
                }
                /* if (result.indexOf("C") >= 0) {
                     var nCellColor = isAUDI ? RGB(255, 255, 153) : Constants.C_WHITE;
                     nCount = nCount + 100;
                 }*/
                if(result.indexOf(I) >= 0) {
                    var nCellColor = isAUDI ? Constants.C_WHITE : RGB(221, 235, 247);
                    nCount = nCount + 10;
                }

                if(result.length > 1) { // multiple entries like "R, A, ..."
                    nCellColor = nCellColor = Constants.C_WHITE;
                }

                var myOut = new myOutput(oFuncObject, oOrgObject);
                myOut.rasciValue = result;
                myOut.colour = nCellColor;
                myOut.nCount = nCount;
                arrInner.push(myOut);
            }
            if(arrInner.length > 0) arrOuter.push(arrInner);
        }
        return arrOuter;
    }

    function RGB(r, g, b) {
        return (new java.awt.Color(r / 255.0, g / 255.0, b / 255.0, 1)).getRGB();
    }


    function setFrame(t, l, r, b) {
        oOutputFile.SetFrameStyle(Constants.FRAME_TOP, t, Constants.BRDR_NORMAL)
        oOutputFile.SetFrameStyle(Constants.FRAME_LEFT, l, Constants.BRDR_NORMAL)
        oOutputFile.SetFrameStyle(Constants.FRAME_RIGHT, r, Constants.BRDR_NORMAL)
        oOutputFile.SetFrameStyle(Constants.FRAME_BOTTOM, b, Constants.BRDR_NORMAL) // 0: zeichnet z.B. keine */
    }

    // Output of the functions which are not in List
    function outNotAssignedFuncsList() {
        oOutputFile.BeginTable(100, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_LEFT, 0);
        for(var iter = g_aNotAssignedFuncs.iterator(); iter.hasNext();) {
            var func = iter.next();
            oOutputFile.TableRow();
            oOutputFile.TableCell(func.Name(g_nLoc), 20, "Arial", 9, Constants.C_BLACK, new java.awt.Color(0.72265625, 0.99609375, 0.72265625).getRGB(), 0, Constants.FMT_BOLD | Constants.FMT_CENTER | Constants.FMT_VTOP, 0);
            oOutputFile.TableCell(getProcessAssignment(func), 20, "Arial", 9, Constants.C_BLACK, Constants.C_TRANSPARENT, 0, Constants.FMT_BOLD | Constants.FMT_CENTER | Constants.FMT_VTOP, 0);
        }
        oOutputFile.EndTable(getString("TEXT_4"), 100, "Arial", 9, Constants.C_BLACK, Constants.C_TRANSPARENT, 0, Constants.FMT_LEFT | Constants.FMT_VTOP, 0);
    }

    function getProcessAssignment(funcDef) {
        var sModelList = "";
        var oObjOccList = funcDef.OccList()
        for(var i = 0; i < oObjOccList.length; i++) {
            var oObjOcc = oObjOccList[i];
            var oModel = oObjOcc.Model();

            if(isModelInList(oModel, g_oProcessModels, false /*p_bAddToList*/ )) {
                if(sModelList.length > 0) sModelList = sModelList + ", ";
                sModelList = sModelList + oModel.Name(g_nLoc);
            }
        }
        return sModelList;
    }

    //
    function hasFunctionAworth(p_arrInner) {
        var nCount = 0;
        for(var i = 0; i < p_arrInner.length; i++) {
            nCount = nCount + p_arrInner[i].nCount;
        }
        return (nCount > 0);
    }

    function getProcessModels(p_nMaxHierarchyLevel) {
        var oProcessModels = new Array();
        var oSelModels = getModelSelection(); // BLUE-10824 Context extended to model + group
        // get relevant process models
        for(var i = 0; i < oSelModels.length; i++) {
            var oModel = oSelModels[i];
            addProcessModel(oModel, oProcessModels, 0, p_nMaxHierarchyLevel);
        }
        return oProcessModels;
    }

    function getModelSelection() {
        // Models selected
        var oSelModels = ArisData.getSelectedModels();
        if(oSelModels.length > 0) return oSelModels;

        /* Groups selected
        var aModelTypes = Context.getDefinedItemTypes(Constants.CID_MODEL);
        oSelModels = new Array();
        var oSelGroups = ArisData.getSelectedGroups();
        for (var i = 0; i < oSelGroups.length; i++) {
            oSelModels = oSelModels.concat(filterModels(oSelGroups[i], aModelTypes));
        }
        return oSelModels;

        function filterModels(oGroup, aTypeNums) {
            if (aTypeNums.length == 0 || (aTypeNums.length == 1 && aTypeNums[0] == -1)) {
                // All/None type nums selected
                return oGroup.ModelList();
            }
            return oGroup.ModelList(false/* bRecursive/, aTypeNums);
        }*/
    }

    function addProcessModel(p_oModel, p_oProcessModels, p_nHierarchyLevel, p_nMaxHierarchyLevel) {
        if(!isModelInList(p_oModel, g_oDoneModels, true /*p_bAddToList*/ )) {
            var bCheck = checkTypeNum(p_oModel.OrgModelTypeNum(), g_aModelTypes);
            if(bCheck == true) {
                p_oProcessModels.push(p_oModel);

                if(p_nHierarchyLevel < p_nMaxHierarchyLevel) {
                    addHierarchyModels(p_oModel, p_oProcessModels, p_nHierarchyLevel + 1);
                }
            }
        }

        function addHierarchyModels(p_oModel, p_oProcessModels, p_nHierarchyLevel) {
            var oFuncDefs = p_oModel.ObjDefListFilter(Constants.OT_FUNC);
            for(var i = 0; i < oFuncDefs.length; i++) {
                var oFuncDef = oFuncDefs[i];
                var oAssignedModels = oFuncDef.AssignedModels();

                for(var j = 0; j < oAssignedModels.length; j++) {
                    addProcessModel(oAssignedModels[j], p_oProcessModels, p_nHierarchyLevel, p_nMaxHierarchyLevel);
                }
            }
        }
    }

    function isModelInList(p_oModel, p_oModelList, p_bAddToList) {
        for(var i = 0; i < p_oModelList.length; i++) {
            if(p_oModel.IsEqual(p_oModelList[i])) return true;
        }
        if(p_bAddToList) { // AGA-5707, Call-ID 297980
            p_oModelList.push(p_oModel);
        }
        return false;
    }

    function getFunctionObjects(p_oProcessModels) {
        var oFuncObjects = new Array();
        p_oProcessModels.forEach(function(model) {
            var oFuncDefs = model.ObjDefListFilter(Constants.OT_FUNC);
            oFuncObjects = oFuncObjects.concat(oFuncDefs);
        });
        // oFuncObjects = ArisData.Unique(oFuncObjects); /// func A column
        if(g_sortMethod == 0) {
            // return DFS(); // RV do hloubky
            var summaryPath = examineSummaryModelUnique(oSelModels[0]); //do sirky BFS
            var funcs = summaryPath.filter(function(objOcc) {
                return objOcc.ObjDef().TypeNum() === 22 || objOcc.ObjDef().TypeNum() === 50;
            }).map(function(objOcc) {
                return objOcc.ObjDef();
            })
            //getFuncs(summaryPath);
            return funcs;

        } else if(g_sortMethod == 1) {
            oFuncObjects = ArisData.sort(oFuncObjects, Constants.AT_NAME, g_nLoc); //asc
        } else if(g_sortMethod == 2) { //flow funcs - sort by cxn
            oFuncObjects = oFuncObjects.sort(sortNameDesc); //desc
        }
        return oFuncObjects;
    }


    function getFuncs(inputItems) {
        var arry_objcs = new Array();
        var keys = inputItems.keySet();
        var it = keys.iterator();

        while(it.hasNext()) {
            var key = it.next();
            var items = inputItems.get(key);
            for(var listPosition = 0; listPosition < items.size(); listPosition++) {
                var item = items.get(listPosition);

                if(item.objOcc != null) {
                    if(item.objOcc.ObjDef().TypeNum() === 22 || item.objOcc.ObjDef().TypeNum() === 50) {
                        arry_objcs.push(item.objOcc.ObjDef());
                    }
                }
            }
        }

        return arry_objcs;
    }



    function DFS(model) { //do hloubky
        var funcs = new Array();
        var index = 0;
        var used = new java.util.HashSet()

        model.BuildGraph(true)
        model.Cycles()
        var startOccList = ArisData.sort(model.StartNodeList(), Constants.SORT_Y, Constants.SORT_X, g_nLoc)
        for(i in startOccList) {
            var occ = model.DFSGetFirstNode(startOccList[i])
            while(occ != null && occ.IsValid()) {
                if(occ.ObjDef().TypeNum() == Constants.OT_FUNC && !used.contains(occ.ObjectID())) {
                    //   occ.ObjDef().Attribute(Constants.AT_ID, g_nLoc).setValue("index " + index);
                    //var name = occ.ObjDef().Name(-1)
                    funcs.push(occ.ObjDef())
                    used.add(occ.ObjectID())
                    index++;
                }
                occ = model.DFSNextNode()
            }
        }
        return funcs;
    }

    /***/
    function examinePathsInModel(model) {
        var bq = model.BuildGraph(true);
        var startNodes = model.StartNodeList(); // all start nodes (objOccs) in Model
        var endNodes = model.EndNodeList(); // all start nodes (objOccs) in Model

        var paths = new Packages.java.util.TreeMap();
        for(var startNodesPosition = 0; startNodesPosition < startNodes.length; startNodesPosition++) {
            var startNode = startNodes[startNodesPosition];
            if(startNode.SymbolNum() == SYM_STAT) continue;

            for(var endNodesPosition = 0; endNodesPosition < endNodes.length; endNodesPosition++) {
                var endNode = endNodes[endNodesPosition];
                if(endNode.SymbolNum() == SYM_STAT) continue;
                examinePath(model, startNode, endNode, paths);
            }
        }
        return paths;
        //return funcs;
    }

    function examinePath(model, startOcc, endOcc, paths) {
        var isVisited = new Packages.java.util.HashMap();
        var innerPath = new Packages.java.util.ArrayList();
        innerPath.add(startOcc);
        examineInnerPath(model, startOcc, endOcc, isVisited, innerPath, paths);
    }

    function examineInnerPath(model, startOcc, endOcc, isVisited, currentPath, paths) {

        if(isVisited.containsKey(startOcc)) {
            isVisited.remove(startOcc);
            isVisited.put(startOcc, true);
        } else {
            isVisited.put(startOcc, true);
        }

        if(startOcc.equals(endOcc)) {
            isVisited.replace(startOcc, true, false);
            var count = paths.keySet().size();
            paths.put(count + 1, new Packages.java.util.ArrayList());
            var iterator = currentPath.iterator();
            while(iterator.hasNext()) {
                paths.get(count + 1).add(iterator.next());
            }
            return;

        }
        var outEdges = startOcc.OutEdges(Constants.EDGES_STRUCTURE);
        for(var position = 0; position < outEdges.length; position++) {
            var objOcc = outEdges[position].getTarget();
            if(!isVisited.containsKey(objOcc)) {
                isVisited.put(objOcc, false);
            }
            if(isVisited.get(objOcc) == false) {
                currentPath.add(objOcc);
                examineInnerPath(model, objOcc, endOcc, isVisited, currentPath, paths);
                currentPath.remove(objOcc);
            }
        }
        isVisited.replace(startOcc, true, false);
    }

    function sortNameDesc(a, b) {
        return StrComp(b.Name(g_nLoc), a.Name(g_nLoc));
    }

    function getOrgObjects(p_oProcessModels) {
        var oOrgObjects = new Array();
        for(var i = 0; i < p_oProcessModels.length; i++) {
            var oProcessModel = p_oProcessModels[i];
            oOrgObjects = oOrgObjects.concat(getOrgElements(oProcessModel));
            // BLUE-6519
            var oAssignedFadModels = getAssignedFadModels(oProcessModel);
            for(var j = 0; j < oAssignedFadModels.length; j++) {
                oOrgObjects = oOrgObjects.concat(getOrgElements(oAssignedFadModels[j]));
            }

            if(EVAL_SATELLITES) {
                oOrgObjects = oOrgObjects.concat(getOrgSatellites(oProcessModel));
            }
        }

        oOrgObjects = ArisData.Unique(oOrgObjects);
        //RV remove rolles
        var oOrgObjects_skippedRolles = new Array();
        for(var i = 0; i < oOrgObjects.length; i++) {
            if(skipRollesGUID.contains(oOrgObjects[i].GUID()) == false) { // prcces o
                oOrgObjects_skippedRolles.push(oOrgObjects[i]);
            }
        }

        return oOrgObjects_skippedRolles;

        function getOrgElements(p_oModel) {
            var oOrgDefs = new Array();
            var oObjDefs = p_oModel.ObjDefList();
            for(var i = 0; i < oObjDefs.length; i++) {
                var oObjDef = oObjDefs[i];
                if(checkTypeNum(oObjDef.TypeNum(), g_aOrgTypes)) {
                    oOrgDefs.push(oObjDef);
                }
            }
            return oOrgDefs;
        }

        function getAssignedFadModels(p_oModel) {
            var oAssignedFadModels = new Array();
            var oFuncDefs = p_oModel.ObjDefListFilter(Constants.OT_FUNC);
            for(var i = 0; i < oFuncDefs; i++) {
                oAssignedFadModels = oAssignedFadModels.concat(oFuncDefs[i].AssignedModels(Constants.MT_FUNC_ALLOC_DGM));
            }
            return oAssignedFadModels;
        }

        function getOrgSatellites(p_oModel) {
            var oOrgSatellites = new Array();
            var oFuncOccs = p_oModel.ObjOccListFilter(Constants.OT_FUNC);
            for(var i = 0; i < oFuncOccs; i++) {
                oOrgSatellites = oOrgSatellites.concat(SAG_INTERNAL.getInventoryObjects(oFuncOccs[i], g_aOrgTypes));
            }
            return oOrgSatellites;
        }
    }

    function getRASI_DMIValue(p_oFuncObject, p_oOrgObject, p_oModel) {
        var sRasciValue = "";
        var oRASCICxns = new Array();

        var oCxns = getRASCICxns(p_oFuncObject, p_oOrgObject, p_oModel);
        for(var i = 0; i < oCxns.length; i++) {
            oCxn = oCxns[i];

            if(bRASI) {
                // R
                var bCheck = checkTypeNum(oCxn.TypeNum(), g_aCxnTypes_R);
                if(bCheck == true) sRasciValue = writeRasciValue(sRasciValue, R); //return "R";
                // A
                var bCheck = checkTypeNum(oCxn.TypeNum(), g_aCxnTypes_A);
                if(bCheck == true) sRasciValue = writeRasciValue(sRasciValue, A); //return "A";
                // S
                var bCheck = checkTypeNum(oCxn.TypeNum(), g_aCxnTypes_S);
                if(bCheck == true) sRasciValue = writeRasciValue(sRasciValue, S); //return "S";
                // I
                var bCheck = checkTypeNum(oCxn.TypeNum(), g_aCxnTypes_I);
                if(bCheck == true) sRasciValue = writeRasciValue(sRasciValue, I); //return "I";
            } else {
                // D
                var bCheck = checkTypeNum(oCxn.TypeNum(), g_aCxnTypes_D);
                if(bCheck == true) sRasciValue = writeRasciValue(sRasciValue, D); //return "D";
                // M
                var bCheck = checkTypeNum(oCxn.TypeNum(), g_aCxnTypes_M);
                if(bCheck == true) sRasciValue = writeRasciValue(sRasciValue, M); //return "M";
                // I
                var bCheck = checkTypeNum(oCxn.TypeNum(), g_aCxnTypes_I);
                if(bCheck == true) sRasciValue = writeRasciValue(sRasciValue, I); //return "I";
            }

        }
        return sRasciValue;
    }

    function writeRasciValue(sRasciValue, sCurrentValue) {
        if(sRasciValue.length > 0) {
            sRasciValue = sRasciValue + ", ";
        }
        sRasciValue = sRasciValue + sCurrentValue;
        return sRasciValue;
    }

    function getRASCICxns(p_oFuncObject, p_oOrgObject, p_oModel) {
        // RichClient, all models -> Evaluate all cxn defs
        if(g_bStandardEnvironment && p_oModel == null) {
            return filterCxns(p_oFuncObject.CxnList(getDirection()));
        }
        // else evaluate cxn occs in relevant models
        var oRelevantCxns = new Array();
        var oModels = getRelevantModels();

        for(var i = 0; i < oModels.length; i++) {
            var oFuncObjOccs = p_oFuncObject.OccListInModel(oModels[i]);
            oFuncObjOccs = oFuncObjOccs.concat(getFuncOccsInAssignedFadModel()); // BLUE-6519

            for(var j = 0; j < oFuncObjOccs.length; j++) {
                oRelevantCxns = oRelevantCxns.concat(getRelevantCxns(oFuncObjOccs[j]));
            }
        }

        if(EVAL_SATELLITES) {
            // BLUE-20149, BLUE-20839 - Consider cxns maintained in properties panel
            oRelevantCxns = oRelevantCxns.concat(getRelevantCxnDefs(p_oFuncObject));
        }
        return ArisData.Unique(oRelevantCxns);

        function getRelevantModels() {
            if(p_oModel == null) return g_oProcessModels;
            return [p_oModel];
        }

        function getRelevantCxns(oFuncObjOcc) {
            var oCxnOccs = getFunctionCxns();
            return filterCxns(oCxnOccs);

            function getFunctionCxns() {
                if(getDirection() == Constants.EDGES_OUT)
                    return oFuncObjOcc.OutEdges(Constants.EDGES_ALL);
                else
                    return oFuncObjOcc.InEdges(Constants.EDGES_ALL);
            }
        }

        function getRelevantCxnDefs(oFuncObjDef) {
            var oCxnDefs = getFunctionCxns();
            return filterCxns(oCxnDefs);

            function getFunctionCxns() {
                var cxns = oFuncObjDef.CxnList(getDirection())
                var result = new Array()
                for(var i in cxns) {
                    var oCxn = cxns[i]
                    if(oCxn.isInventoryCxn())
                        result.push(oCxn);
                }
                return result;
            }
        }

        function getDirection() {
            if(p_oOrgObject.TypeNum() == Constants.OT_SYS_ORG_UNIT_TYPE)
                return Constants.EDGES_OUT;
            else
                return Constants.EDGES_IN;
        }

        function filterCxns(oCxns) {
            var oFilteredCxns = new Array();
            for(var i = 0; i < oCxns.length; i++) {
                var oCxn = oCxns[i];
                if(oCxn.KindNum() == Constants.CID_CXNOCC) oCxn = oCxn.Cxn();

                var oConnObjDef = getConnObjDef(oCxn);

                if(p_oOrgObject.IsEqual(oConnObjDef)) {
                    oFilteredCxns.push(oCxn);
                }
            }
            return oFilteredCxns;
        }

        function getConnObjDef(oCxn) {
            if(getDirection() == Constants.EDGES_OUT)
                return oCxn.TargetObjDef();
            else
                return oCxn.SourceObjDef();
        }

        function getFuncOccsInAssignedFadModel() {
            var oAssignedFuncOccs = new Array();
            var oAssignedFadModels = p_oFuncObject.AssignedModels(Constants.MT_FUNC_ALLOC_DGM);
            for(var i = 0; i < oAssignedFadModels; i++) {
                var oFuncOccs = p_oFuncObject.OccListInModel(oAssignedFadModels[i]);
                if(oFuncOccs.length > 0) {
                    oAssignedFuncOccs = oAssignedFuncOccs.concat(oFuncOccs);
                }
            }
            return oAssignedFuncOccs;
        }
    }

    // check typenum
    function checkTypeNum(p_nType, p_aTypes) {
        for(var i = 0; i < p_aTypes.length; i++) {
            if(p_nType == p_aTypes[i]) return true;
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
            Constants.MT_VAL_ADD_CHN_DGM,
            Constants.MT_BPMN_COLLABORATION_DIAGRAM,
            Constants.MT_BPMN_PROCESS_DIAGRAM,
            Constants.MT_ENTERPRISE_BPMN_COLLABORATION,
            Constants.MT_ENTERPRISE_BPMN_PROCESS
        ];
    }

    // init list of org types
    function initOrgTypes() {
        return [Constants.OT_PERS,
            Constants.OT_POS,
            Constants.OT_GRP,
            Constants.OT_ORG_UNIT_TYPE,
            Constants.OT_ORG_UNIT,
            Constants.OT_PERS_TYPE
        ];
    }

    //init list of Cxn types "Responsible"
    function initCxnTypes_R() {
        return [Constants.CT_EXEC_1, Constants.CT_EXEC_2];
    }

    //init list of Cxn types "Accountable"
    function initCxnTypes_A() {
        return [Constants.CT_DECD_ON, Constants.CT_AGREES];
    }

    //init list of Cxn types "Supportive" in RASI format
    function initCxnTypes_S() {
        // if (!bRASI) return [];
        return [Constants.CT_CONTR_TO_2, Constants.CT_CONTR_TO_1, Constants.CT_HAS_CONSLT_ROLE_IN_2, Constants.CT_IS_DP_RESP_2, Constants.CT_IS_TECH_RESP_3, Constants.CT_IS_TECH_RESP_1, Constants.CT_IS_TECH_RESP_2, Constants.CT_HAS_CONSLT_ROLE_IN_1];
    }

    //init list of Cxn types "Consulted" - not used in RASI format
    /*function initCxnTypes_C() {
        if (!bRASI) return [];
        return [Constants.CT_HAS_CONSLT_ROLE_IN_2, Constants.CT_IS_DP_RESP_2, Constants.CT_IS_TECH_RESP_3, Constants.CT_IS_TECH_RESP_1, Constants.CT_IS_TECH_RESP_2, Constants.CT_HAS_CONSLT_ROLE_IN_1];
    }*/

    //init list of Cxn types "Informed" //same for all formats RASCI, RASI, DEMI, DMI
    function initCxnTypes_I() {
        return [Constants.CT_MUST_BE_INFO_ABT_2, Constants.CT_MUST_INFO_ABT_RES_OF, Constants.CT_MUST_BE_INFO_ON_CNC_1, Constants.CT_MUST_BE_INFO_ON_CNC_2];
    }

    //----------------------------------------------------------------//
    //init list of Cxn types "D" in DMI format
    function initCxnTypes_D() {
        return [Constants.CT_EXEC_2, Constants.CT_EXEC_1, Constants.CT_DECD_ON, Constants.CT_AGREES];
    }

    //init list of Cxn types "M" in DMI format
    function initCxnTypes_M() {
        // if (!bRASI) return [];
        return [Constants.CT_CONTR_TO_2, Constants.CT_CONTR_TO_1, Constants.CT_HAS_CONSLT_ROLE_IN_2, Constants.CT_IS_DP_RESP_2, Constants.CT_IS_TECH_RESP_3, Constants.CT_IS_TECH_RESP_1, Constants.CT_IS_TECH_RESP_2, Constants.CT_HAS_CONSLT_ROLE_IN_1];
    }

    function myOutput(p_funcDef, p_orgElemDef) {
        this.funcDef = p_funcDef;
        this.orgElemDef = p_orgElemDef;
        this.rasciValue = "";
        this.nCount = 0;
        this.colour = Constants.C_TRANSPARENT;
    }

    function sortArray(aArray) {
        if(aArray.length > 0 && aArray[0].length > 0) {
            var aTmpArray = turnArray(aArray); //Row 1 - X

            if(g_sortMethod == 0)
                aTmpArray.sort(sortRasci); //asc
            else if(g_sortMethod == 1)
                aTmpArray.sort(sortRasci); //always ASC, requirement !!
            //aTmpArray.sort(sortRasciDesc);
            else if(g_sortMethod == 2)
                aTmpArray.sort(sortRasci); //always ASC, requirement !!
            return turnArray(aTmpArray);
        }
        return aArray;
    }

    function sortRasci(a, b) {
        return (getSum(b) - getSum(a));
    }

    function sortRasciDesc(a, b) {
        return (getSum(a) - getSum(b));
    }

    function getSum(innerArray) {
        var sum = 0;
        for(var i = 0; i < innerArray.length; i++) {
            sum = sum + innerArray[i].nCount;
        }
        return sum;
    }

    function turnArray(aArray) {
        var aNewOuter = new Array();
        if(aArray.length > 0) {
            var innerMax = aArray[0].length;
            for(var inner = 0; inner < innerMax; inner++) {
                var aNewInner = new Array();
                for(var outer = 0; outer < aArray.length; outer++) {
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
        while(!isAllowedName(modelName)) {
            modelName = modelName.substr(0, modelName.length - 3) + formatstring1("(@1)", nIdx++);
        }
        g_sModelNames.push(modelName.toLowerCase());
        return modelName;

        function isAllowedName(modelName) {
            for(var i = 0; i < g_sModelNames.length; i++) {
                if(StrComp(modelName.toLowerCase(), g_sModelNames[i]) == 0) return false;
            }
            return true;
        }

        function getValidName(sName) {
            sName = "" + sName;
            var npos = serchforspecialchar(sName);
            if(npos >= 0 && npos <= 31) {
                nPos = Math.min(npos, 28);
                sName = sName.substr(0, npos) + "...";
            }
            if(sName.length > 31) {
                sName = sName.substr(0, 28) + "...";
            }
            return sName;
        }
    }

    function showOptionsDialog(bSelectHierarchyLevel) {
        var nHierarchyLevel = 0;
        var binput = false; // Variable to check if input is correct
        var nuserdlg = 0; // Variable to check if the user choose in the dialog the alternative "cancel"
        while(binput == false && !(nuserdlg == 1)) {
            var userdialog = Dialogs.createNewDialogTemplate(0, 0, 475, 120, getString("TEXT_5"));

            // BLUE-13058 Select between RACI and RASCI
            var yDIM = 0;
            var yDIM2 = 5;
            var yDIM3 = 5;
            userdialog.GroupBox(10, 10, 500, 60, getString("TEXT_12"));
            userdialog.OptionGroup("optType");
            userdialog.OptionButton(25, yDIM += 20, 300, 15, getString("TYPE_RASI"), "op_VW");
            userdialog.OptionButton(25, yDIM += 15, 300, 15, getString("TYPE_DMI"), "op_DMI");

            userdialog.Text(100, yDIM2 += 10, 200, 15, getString("TYPE_RASI_INFO_R"));
            userdialog.Text(100, yDIM2 += 10, 200, 15, getString("TYPE_RASI_INFO_A"));
            userdialog.Text(100, yDIM2 += 10, 200, 15, getString("TYPE_RASI_INFO_S"));
            userdialog.Text(100, yDIM2 += 10, 200, 15, getString("TYPE_RASI_INFO_I"));

            userdialog.Text(225, yDIM3 += 10, 280, 15, getString("TYPE_DMI_INFO_D")); //R
            userdialog.Text(225, yDIM3 += 10, 280, 15, "-"); //A
            userdialog.Text(225, yDIM3 += 10, 280, 15, getString("TYPE_DMI_INFO_M")); //C
            userdialog.Text(225, yDIM3 += 10, 280, 15, getString("TYPE_DMI_INFO_I")); //I

            userdialog.GroupBox(10, 80, 500, 60, getString("TEXT_SORT"));
            userdialog.OptionGroup("optSort");
            userdialog.OptionButton(25, yDIM += 55, 300, 15, getString("TEXT_SORT_FLOW"));
            userdialog.OptionButton(25, yDIM += 15, 300, 15, getString("TEXT_SORT_ASCENDING"));
            userdialog.OptionButton(25, yDIM += 15, 300, 15, getString("TEXT_SORT_DESCENDING"));

            //Previous version
            /* userdialog.OptionButton(25, yDIM += 55, 300, 15, getString("TEXT_SORT_ASCENDING"));
            userdialog.OptionButton(25, yDIM += 15, 300, 15, getString("TEXT_SORT_DESCENDING"));
            userdialog.OptionButton(25, yDIM += 15, 300, 15, getString("TEXT_SORT_FLOW")); */
            if(bSelectHierarchyLevel) {
                userdialog.GroupBox(10, 150, 500, 60, getString("TEXT_6"));
                userdialog.Text(25, yDIM += 55, 140, 15, getString("TEXT_6"));
                userdialog.TextBox(185, yDIM, 60, 21, "txtLinkLevels");
            }

            userdialog.OKButton();
            userdialog.CancelButton();
            //userdialog.HelpButton("HID_277051f0_77e9_11dc_0f7d_0014224a1763_dlg_01.hlp");

            var dlg = Dialogs.createUserDialog(userdialog);

            if(isAUDI) {
                dlg.setDlgText("op_DMI", getString("TYPE_DMI") + " (VW)");
                dlg.setDlgEnable("op_DMI", false);
            }

            if(bSelectHierarchyLevel) {
                dlg.setDlgText("txtLinkLevels", nHierarchyLevel);
            }
            nuserdlg = Dialogs.show(__currentDialog = dlg); // Show Dialog and waiting for confirmation with  OK

            if(bSelectHierarchyLevel) {
                nHierarchyLevel = dlg.getDlgText("txtLinkLevels");
                if(isNaN(nHierarchyLevel)) {
                    Dialogs.MsgBox(getString("TEXT_7"), Constants.MSGBOX_BTN_OK, getString("TEXT_8"));
                } else {
                    nHierarchyLevel = parseInt(nHierarchyLevel);
                    if(nHierarchyLevel < 0) {
                        Dialogs.MsgBox(getString("TEXT_9"), Constants.MSGBOX_BTN_OK, getString("TEXT_8"));
                    } else {
                        binput = true;
                    }
                }
                if(!binput) nHierarchyLevel = 0;
            } else {
                binput = true;
            }
            var nMatrixType = dlg.getDlgValue("optType");
            var nSortMethod = dlg.getDlgValue("optSort");

        }
        if(nuserdlg == 0) return null;
        return [nMatrixType, nHierarchyLevel, nSortMethod];
    }

    function outEmptyResult() {
        // oOutputFile = Context.createOutputObject();
        oOutputFile.BeginTable(100, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_LEFT, 0);
        oOutputFile.TableRow();
        oOutputFile.TableCell(getString("TEXT_11"), 100, "Arial", 9, Constants.C_BLACK, Constants.C_TRANSPARENT, 0, Constants.FMT_LEFT | Constants.FMT_VTOP | Constants.FMT_EXCELMODIFY, 0);
        oOutputFile.EndTable("", 100, "Arial", 9, Constants.C_BLACK, Constants.C_TRANSPARENT, 0, Constants.FMT_LEFT | Constants.FMT_VTOP, 0);
        // oOutputFile.WriteReport();
    }

    function isDialogSupported() {
        // Dialog support depends on script runtime environment (STD resp. BP, TC)
        var env = Context.getEnvironment();
        if(env.equals(Constants.ENVIRONMENT_STD)) return true;
        if(env.equals(Constants.ENVIRONMENT_TC)) return SHOW_DIALOGS_IN_CONNECT;
        return false;
    }
    /***********************/
    //Output
    function outTables_VW(arrOuter, sProcessName, bCheckFuncAssignments) {
        var nMAX_COUNT = 13;  //maximum col in width

        if(arrOuter.length <= 0) return;
        arrOuter = sortArray(arrOuter);

        var nCount = 0;
        var bLoop = true;
        var nStart = 0;
        var nEnd = nStart + nMAX_COUNT;
        if(nEnd > arrOuter[0].length) nEnd = arrOuter[0].length;

        while(bLoop) {
            oOutputFile.BeginSection(false, Constants.SECTION_DEFAULT);
            oOutputFile.BeginTable(100, Constants.C_WHITE, Constants.C_TRANSPARENT, Constants.FMT_LEFT, 0);

            oOutputFile.TableRow();
            if(bCheckFuncAssignments) {
                /***********/
                oOutputFile.TableCell(getString("TEXT_2"), 20, "Arial", 9, Constants.C_BLACK, new java.awt.Color(0.65625, 0.8984375, 0.57421875).getRGB(), 0, Constants.FMT_BOLD | Constants.FMT_CENTER | Constants.FMT_VTOP, 0);
                /*************/
            }
            oOutputFile.ResetFrameStyle();
            oOutputFile.SetFrameStyle(Constants.FRAME_BOTTOM, 10) // 0: zeichnet z.B. keine */
            oOutputFile.TableCell(getString("TEXT_FUNCTION"), 30, "Arial", 9, Constants.C_BLACK, RGB(218, 216, 218), 0, Constants.FMT_BOLD | Constants.FMT_CENTER | Constants.FMT_VTOP, 0);
            var col = 1;
            if(oOrgDefs.length > 0)
                col = oOrgDefs.length;

            for(var j = nStart; j < nEnd; j++) {
                
                //horizont Func
                if(nEnd < 7)
                    oOutputFile.TableCell(arrOuter[0][j].orgElemDef.Name(g_nLoc), 10, "Arial", 9, Constants.C_BLACK, RGB(175, 194, 209), 0, Constants.FMT_BOLD | Constants.FMT_CENTER | Constants.FMT_VTOP, 0);
                else
                    oOutputFile.TableCell(arrOuter[0][j].orgElemDef.Name(g_nLoc), 5, "Arial", 9, Constants.C_BLACK, RGB(175, 194, 209), 0, Constants.FMT_BOLD | Constants.FMT_CENTER | Constants.FMT_VERT_UP, 0);
            }

            for(var i = 0; i < arrOuter.length; i++) {
                if(hasFunctionAworth(arrOuter[i]) == true) {
                    oOutputFile.TableRow();

                    if(bCheckFuncAssignments) {
                        oOutputFile.TableCell(getProcessAssignment(arrOuter[i][0].funcDef), 10, "Arial", 9, Constants.C_BLACK, new java.awt.Color(0.65625, 0.8984375, 0.57421875).getRGB(), 0, Constants.FMT_BOLD | Constants.FMT_LEFT | Constants.FMT_VTOP, 0);
                    }
                    oOutputFile.TableCell(arrOuter[i][0].funcDef.Name(g_nLoc), 30, "Arial", 9, Constants.C_BLACK, RGB(231, 235, 235), 0, Constants.FMT_BOLD | Constants.FMT_LEFT | Constants.FMT_VTOP, 0);  //first col func

                    for(var j = nStart; j < nEnd; j++) {
                        if(nEnd <7)
                           oOutputFile.TableCell(arrOuter[i][j].rasciValue, 10, "Arial", 9, Constants.C_BLACK, arrOuter[i][j].colour, 0, Constants.FMT_BOLD | Constants.FMT_CENTER | Constants.FMT_VTOP, 0);
                        else
                           oOutputFile.TableCell(arrOuter[i][j].rasciValue, 5, "Arial", 9, Constants.C_BLACK, arrOuter[i][j].colour, 0, Constants.FMT_BOLD | Constants.FMT_CENTER | Constants.FMT_VTOP, 0);
                      
                    }
                } else {
                    if(bCheckFuncAssignments) {
                        g_aNotAssignedFuncs.add(arrOuter[i][0].funcDef);
                    }
                    //add or xor line
                    /*  if (arrOuter[i][0].funcDef.TypeNum()== 50){
                         
                         oOutputFile.TableRow();
                         oOutputFile.TableCell(arrOuter[i][0].funcDef.Name(g_nLoc),60, "Arial", 9, Constants.C_BLACK, RGB(218, 216, 218), 0, Constants.FMT_BOLD | Constants.FMT_CENTER | Constants.FMT_VTOP, 0);
                         oOutputFile.TableCell("",1,col, "Arial", 9, Constants.C_BLACK, RGB(218, 216, 218), 0, Constants.FMT_BOLD | Constants.FMT_LEFT | Constants.FMT_VTOP, 0);
                         oOutputFile.TableCell("",1 ,4, "Arial", 9, Constants.C_BLACK, RGB(218, 216, 218), 0, Constants.FMT_BOLD | Constants.FMT_LEFT | Constants.FMT_VTOP, 0);
                         
                         oOutputFile.TableRow();
                      }*/
                }
            }

            //desc of rasi
            var colConst = 5;

            var sTableName = sProcessName;
            if(nCount > 0) sTableName = "" + (nCount + 1) + ". " + sProcessName;
            oOutputFile.EndTable("", 100, "Arial", 9, Constants.C_BLACK, Constants.C_TRANSPARENT, 0, Constants.FMT_LEFT | Constants.FMT_VTOP, 0);
            //oOutputFile.OutputLn("", "Arial", 12, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_LEFT, 8);
            //oOutputFile.OutputLn(Constants.FIELD_NEWPAGE, "Arial", 12, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_LEFT, 8);
     
            if(nEnd == arrOuter[0].length) {
                bLoop = false;
            } else {
                nStart = nEnd;
                nEnd = nStart + nMAX_COUNT;
                if(nEnd > arrOuter[0].length) nEnd = arrOuter[0].length;
                nCount++;
            }
            oOutputFile.EndSection();
        }
    }
}