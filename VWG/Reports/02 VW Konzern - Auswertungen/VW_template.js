//Output 20210412-final
function outTables_VW(arrOuter, sProcessName, bCheckFuncAssignments) {
    var nMAX_COUNT = 250;

    if (arrOuter.length <= 0) return;
    arrOuter = sortArray(arrOuter);

    var nCount = 0;
    var bLoop = true;
    var nStart = 0;
    var nEnd = nStart + nMAX_COUNT;
    if (nEnd > arrOuter[0].length) nEnd = arrOuter[0].length;

    while (bLoop) {
        oOutputFile.BeginTable(100, Constants.C_WHITE, Constants.C_TRANSPARENT, Constants.FMT_LEFT, 0);
        oOutputFile.TableRow();
        if (bCheckFuncAssignments) {
            /***********/
            oOutputFile.TableCell(getString("TEXT_2"), 20, getString("FONT"), 10, Constants.C_BLACK, new java.awt.Color(0.65625, 0.8984375, 0.57421875).getRGB(), 0, Constants.FMT_BOLD | Constants.FMT_CENTER | Constants.FMT_VTOP, 0);
            /*************/
        }
        oOutputFile.ResetFrameStyle();
        oOutputFile.SetFrameStyle(Constants.FRAME_BOTTOM, 10) // 0: zeichnet z.B. keine */
        oOutputFile.TableCell(getString("TEXT_FUNCTION"), 80, getString("FONT"), 10, Constants.C_BLACK, RGB(218, 216, 218), 0, Constants.FMT_BOLD | Constants.FMT_CENTER | Constants.FMT_VTOP, 0);
        var col = 1;
        if (oOrgDefs.length > 0)
            col = oOrgDefs.length;

        for (var j = nStart; j < nEnd; j++) {
            //horizont Func
            oOutputFile.TableCell(arrOuter[0][j].orgElemDef.Name(g_nLoc), 10, getString("FONT"), 10, Constants.C_BLACK, RGB(175,194,209), 0, Constants.FMT_BOLD | Constants.FMT_CENTER | Constants.FMT_VTOP, 0);
        }

        oOutputFile.TableCell(getString("TEXT_COL_SYSTEM"), 25, getString("FONT"), 10, Constants.C_BLACK, RGB(218, 216, 218), 0, Constants.FMT_BOLD | Constants.FMT_CENTER | Constants.FMT_VTOP, 0);
        oOutputFile.TableCell(getString("TEXT_COL_INPUT"), 50, getString("FONT"), 10, Constants.C_BLACK, RGB(218, 216, 218), 0, Constants.FMT_BOLD | Constants.FMT_CENTER | Constants.FMT_VTOP, 0);
        oOutputFile.TableCell(getString("TEXT_COL_OUTPUT"), 50, getString("FONT"), 10, Constants.C_BLACK, RGB(218, 216, 218), 0, Constants.FMT_BOLD | Constants.FMT_CENTER | Constants.FMT_VTOP, 0);
        oOutputFile.TableCell(getString("TEXT_COL_DESC"), 30, getString("FONT"), 10, Constants.C_BLACK, RGB(218, 216, 218), 0, Constants.FMT_BOLD | Constants.FMT_CENTER | Constants.FMT_VTOP, 0);


        //control list of flow func
        /*for (var i = 0; i < arry_objcs.length; i++) {
                oOutputFile.TableCell(arry_objcs[i].Name(-1), 10, getString("FONT"), 10, Constants.C_BLACK, new java.awt.Color(0.65625, 0.8984375, 0.57421875).getRGB(), 0, Constants.FMT_BOLD | Constants.FMT_LEFT | Constants.FMT_VTOP, 0);
                oOutputFile.TableRow();
        }*/

        for (var i = 0; i < arrOuter.length; i++) {
            if (hasFunctionAworth(arrOuter[i]) == true) {
                oOutputFile.TableRow();

                if (bCheckFuncAssignments) {
                    oOutputFile.TableCell(getProcessAssignment(arrOuter[i][0].funcDef), 10, getString("FONT"), 10, Constants.C_BLACK, new java.awt.Color(0.65625, 0.8984375, 0.57421875).getRGB(), 0, Constants.FMT_BOLD | Constants.FMT_LEFT | Constants.FMT_VTOP, 0);
                }
                oOutputFile.TableCell(arrOuter[i][0].funcDef.Name(g_nLoc), 60, getString("FONT"), 10, Constants.C_BLACK, RGB(231, 235, 235), 0, Constants.FMT_BOLD | Constants.FMT_LEFT | Constants.FMT_VTOP, 0);

                for (var j = nStart; j < nEnd; j++) {
                    oOutputFile.TableCell(arrOuter[i][j].rasciValue, 10, getString("FONT"), 10, Constants.C_BLACK, arrOuter[i][j].colour, 0, Constants.FMT_BOLD | Constants.FMT_CENTER | Constants.FMT_VTOP, 0);
                }

                var funDef = arrOuter[i][0].funcDef
                var FAD_model = funDef.AssignedModels([Constants.MT_FUNC_ALLOC_DGM])
               /* if(FAD_model.length == 1){
                    var icxndefs = funDef.CxnList(Constants.EDGES_IN, [oSelModels[0],FAD_model[0]]);
                    var ocxndefs = funDef.CxnList(Constants.EDGES_OUT, [oSelModels[0],FAD_model[0]]);
                
                }else{*/
                var icxndefs = funDef.CxnListFilter(Constants.EDGES_IN);
                var ocxndefs = funDef.CxnListFilter(Constants.EDGES_OUT);

                icxndefs = ArisData.Unique(icxndefs);
                ocxndefs = ArisData.Unique(ocxndefs);
                
                icxndefs = ArisData.sort(icxndefs, Constants.SORT_TYPE, Constants.AT_NAME, Constants.SORT_NONE, g_nLoc);
                ocxndefs = ArisData.sort(ocxndefs, Constants.SORT_TYPE, Constants.AT_NAME, Constants.SORT_NONE, g_nLoc);
                
                var systems = new String("");
                var input = new String("");
                var cnxsDesc = new String("");

                for (var r = 0; r < icxndefs.length;r++) {
                    var descAttr = icxndefs[r].Attribute(Constants.AT_DESC, g_nLoc).getValue();

                    var srcobj = IDSA.getSource(icxndefs[r]);
                    var typeNum = srcobj.TypeNum();
                    if (IDSA.contains([Constants.OT_RULE], typeNum) == true) // NO XOR
                     continue;
                    
                    if(FAD_model.length > 0 ){
                        var occs = srcobj.OccList([oSelModels[0],FAD_model[0]]); //202104 added FAD diagrams
                    }else
                        var occs = srcobj.OccListInModel(oSelModels[0]); //hack get occ from model
                  
                    if (occs.length > 0) {
                        //systems
                        if (IDSA.contains([Constants.OT_APPL_SYS_TYPE], typeNum) == true) { // IT System
                            systems += IDSA.outputNamesWithNewLine(r, srcobj, icxndefs, typeNum);
                        }
                        if (IDSA.contains([Constants.OT_INFO_CARR, Constants.OT_CLST, Constants.OT_PERF /*Constants.OT_PERS_TYPE, Constants.OT_ORG_UNIT, Constants.OT_GRP*/], typeNum) == true) {
                             input += IDSA.outputNamesWithNewLine(r, srcobj, icxndefs, typeNum);
                        }
                        if (IDSA.contains(g_aOrgTypes, typeNum) == true) {
                            if (IDSA.isAttrMaintained(icxndefs[r], Constants.AT_DESC, g_nLoc))
                               cnxsDesc += descAttr + "|";
                        }
                    }
                }

                var output = new String("");
                for (var s = 0; s < ocxndefs.length;s++) {
                    var descAttr = ocxndefs[s].Attribute(Constants.AT_DESC, g_nLoc).getValue();
                   
                    var srcobj = IDSA.getTarget(ocxndefs[s]);
                    var typeNum = srcobj.TypeNum();
                    if (IDSA.contains([Constants.OT_RULE], typeNum) == true) // NO XOR
                      continue;
                  
                    //var occs = srcobj.OccListInModel(oSelModels[0]);
                     if(FAD_model.length > 0 ){
                        var occs = srcobj.OccList([oSelModels[0],FAD_model[0]]); //202104 added FAD diagrams
                    }else
                        var occs = srcobj.OccListInModel(oSelModels[0]); //hack get occ from model
                  
                    
                    if (occs.length > 0) {
                        //systems
                        if (IDSA.contains([Constants.OT_APPL_SYS_TYPE], typeNum) == true) { // IT System
                            systems += IDSA.outputNamesWithNewLine(s, srcobj, ocxndefs, typeNum);
                        }
                        if (IDSA.contains([Constants.OT_INFO_CARR, Constants.OT_CLST, Constants.OT_PERF /*Constants.OT_PERS_TYPE, Constants.OT_ORG_UNIT, Constants.OT_GRP*/], typeNum) == true) {
                          output += IDSA.outputNamesWithNewLine(s, srcobj, ocxndefs, typeNum);
                        }
                        if (IDSA.contains(g_aOrgTypes, typeNum) == true) {
                            if (IDSA.isAttrMaintained(icxndefs[r], Constants.AT_DESC, g_nLoc))
                               cnxsDesc += descAttr + "|";
                        }
                        
                    }
                }

                oOutputFile.TableCell(IDSA.removeLastSemicolon(systems), 25, getString("FONT"), 10, Constants.C_BLACK, RGB(231, 235, 235), 0, Constants.FMT_BOLD | Constants.FMT_LEFT | Constants.FMT_VTOP, 0);
                oOutputFile.TableCell(IDSA.removeLastSemicolon(input), 50, getString("FONT"), 10, Constants.C_BLACK, RGB(231, 235, 235), 0, Constants.FMT_BOLD | Constants.FMT_LEFT | Constants.FMT_VTOP, 0);
                oOutputFile.TableCell(IDSA.removeLastSemicolon(output), 50, getString("FONT"), 10, Constants.C_BLACK, RGB(231, 235, 235), 0, Constants.FMT_BOLD | Constants.FMT_LEFT | Constants.FMT_VTOP, 0);
                // var funcDesc = arrOuter[i][0].funcDef.Attribute(Constants.AT_DESC, g_nLoc).getValue();
                oOutputFile.TableCell(IDSA.removeLastSemicolon(cnxsDesc), 30, getString("FONT"), 10, Constants.C_BLACK, RGB(231, 235, 235), 0, Constants.FMT_LEFT | Constants.FMT_VTOP, 0);

            } else {
                if (bCheckFuncAssignments) {
                    g_aNotAssignedFuncs.add(arrOuter[i][0].funcDef);
                }
                //add or xor line
                /*  if (arrOuter[i][0].funcDef.TypeNum()== 50){
                     
                     oOutputFile.TableRow();
                     oOutputFile.TableCell(arrOuter[i][0].funcDef.Name(g_nLoc),60, getString("FONT"), 10, Constants.C_BLACK, RGB(218, 216, 218), 0, Constants.FMT_BOLD | Constants.FMT_CENTER | Constants.FMT_VTOP, 0);
                     oOutputFile.TableCell("",1,col, getString("FONT"), 10, Constants.C_BLACK, RGB(218, 216, 218), 0, Constants.FMT_BOLD | Constants.FMT_LEFT | Constants.FMT_VTOP, 0);
                     oOutputFile.TableCell("",1 ,4, getString("FONT"), 10, Constants.C_BLACK, RGB(218, 216, 218), 0, Constants.FMT_BOLD | Constants.FMT_LEFT | Constants.FMT_VTOP, 0);
                     
                     oOutputFile.TableRow();
                  }*/
            }
        }
        
       //desc of rasi
       var colConst =5;
       
       if (bRASI) { 
        oOutputFile.TableRow();
        oOutputFile.ResetFrameStyle();
        setFrame(0, 0, 0, 0); //T, L, R, B
        oOutputFile.TableCell("", 1, (col + colConst), getString("FONT"), 10, Constants.C_BLACK, RGB(255, 255, 255), 0, Constants.FMT_LEFT | Constants.FMT_VTOP, 0);

        oOutputFile.TableRow();
        oOutputFile.TableCell(getString("NOTE_R"), 1, (col + colConst), getString("FONT"), 10, Constants.C_BLACK, RGB(255, 255, 255), 0, Constants.FMT_LEFT | Constants.FMT_VTOP, 0);
        oOutputFile.TableRow();
        oOutputFile.TableCell(getString("NOTE_A"), 1, (col + colConst), getString("FONT"), 10, Constants.C_BLACK, RGB(255, 255, 255), 0, Constants.FMT_LEFT | Constants.FMT_VTOP, 0);
        oOutputFile.TableRow();
        oOutputFile.TableCell(getString("NOTE_S"), 1, (col + colConst), getString("FONT"), 10, Constants.C_BLACK, RGB(255, 255, 255), 0, Constants.FMT_LEFT | Constants.FMT_VTOP, 0);
        oOutputFile.TableRow();

        oOutputFile.ResetFrameStyle();
        setFrame(0, 0, 15, 15); //T, L, R, B
        oOutputFile.TableCell(getString("NOTE_I"), 1, (col + colConst), getString("FONT"), 10, Constants.C_BLACK, RGB(255, 255, 255), 0, Constants.FMT_LEFT | Constants.FMT_VTOP, 0);
        }else{ //DMI
         oOutputFile.TableRow();
        oOutputFile.ResetFrameStyle();
        setFrame(0, 0, 0, 0); //T, L, R, B
        oOutputFile.TableCell("", 1, (col + colConst), getString("FONT"), 10, Constants.C_BLACK, RGB(255, 255, 255), 0, Constants.FMT_LEFT | Constants.FMT_VTOP, 0);

        oOutputFile.TableRow();
        oOutputFile.TableCell(getString("NOTE_D"), 1, (col + colConst), getString("FONT"), 10, Constants.C_BLACK, RGB(255, 255, 255), 0, Constants.FMT_LEFT | Constants.FMT_VTOP, 0);
        oOutputFile.TableRow();
        oOutputFile.TableCell(getString("NOTE_M"), 1, (col + colConst), getString("FONT"), 10, Constants.C_BLACK, RGB(255, 255, 255), 0, Constants.FMT_LEFT | Constants.FMT_VTOP, 0);
        oOutputFile.TableRow();

        oOutputFile.ResetFrameStyle();
        setFrame(0, 0, 15, 15); //T, L, R, B
        oOutputFile.TableCell(getString("NOTE_I"), 1, (col + colConst), getString("FONT"), 10, Constants.C_BLACK, RGB(255, 255, 255), 0, Constants.FMT_LEFT | Constants.FMT_VTOP, 0);
      
        
        }

        var sTableName = sProcessName;
        if (nCount > 0) sTableName = "" + (nCount + 1) + ". " + sProcessName;
        oOutputFile.EndTable(sTableName, 100, getString("FONT"), 10, Constants.C_BLACK, Constants.C_TRANSPARENT, 0, Constants.FMT_LEFT | Constants.FMT_VTOP, 0);

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