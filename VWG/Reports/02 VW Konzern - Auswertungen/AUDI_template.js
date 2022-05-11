function outTables_AUDI(arrOuter, sProcessName, bCheckFuncAssignments) {
    var nMAX_COUNT = 250;

    if (arrOuter.length <= 0) return;

    arrOuter = sortArray(arrOuter);
    var nCount = 0;
    var bLoop = true;
    var nStart = 0;
    var nEnd = nStart + nMAX_COUNT;
    if (nEnd > arrOuter[0].length) nEnd = arrOuter[0].length;

    while (bLoop) {
        oOutputFile.BeginTable(100, RGB(174, 170, 170), Constants.C_TRANSPARENT, Constants.FMT_LEFT, 0);
        oOutputFile.TableRow();
        var wEptyCell = 2;
        if (bCheckFuncAssignments) {
            oOutputFile.TableCell(getString("TEXT_2"), 20, getString("FONT"), 10, Constants.C_BLACK, new java.awt.Color(0.65625, 0.8984375, 0.57421875).getRGB(), 0, Constants.FMT_BOLD | Constants.FMT_CENTER | Constants.FMT_VTOP, 0);
        }
        oOutputFile.ResetFrameStyle();
        setFrame(0, 0, 0, 15); //T, L, R, B   

        oOutputFile.SetFrameStyle(Constants.FRAME_BOTTOM, 15) // 0: zeichnet z.B. keine */
        var colConst = 8;
        var col = 1;
        if (oOrgDefs.length > 0)
            col = oOrgDefs.length;

        oOutputFile.TableCell("RASI", 1, (col + colConst - 1), getString("FONT"), 28, Constants.C_BLACK, RGB(255, 255, 255), 0, Constants.FMT_BOLD | Constants.FMT_LEFT | Constants.FMT_VTOP, 0);
        oOutputFile.TableCell("Version 1.0", 20, getString("FONT"), 11, Constants.C_BLACK, RGB(255, 255, 255), 0, Constants.FMT_RIGHT | Constants.FMT_VTOP, 0);
        /********************************************************************************************** new row **********************************************************************************************/

        oOutputFile.TableRow();
        oOutputFile.ResetFrameStyle();
        setFrame(0, 0, 0, 15); //T, L, R, 

        oOutputFile.TableRow();
        oOutputFile.ResetFrameStyle();
        setFrame(0, 0, 0, 15); //T, L, R, B   
        oOutputFile.TableCell(getString("AUDI_TEXT_FUNCTION"), 80, getString("FONT"), 16, Constants.C_BLACK, RGB(255, 255, 255), 0, Constants.FMT_BOLD | Constants.FMT_LEFT | Constants.FMT_VTOP, 0);
        oOutputFile.ResetFrameStyle();
        setFrame(0, 0, 0, 0); //T, L, R, B   

        oOutputFile.TableCell("", wEptyCell, getString("FONT"), 16, Constants.C_BLACK, RGB(255, 255, 255), 0, Constants.FMT_BOLD | Constants.FMT_LEFT | Constants.FMT_VTOP, 0);
        oOutputFile.ResetFrameStyle();
        setFrame(0, 0, 0, 15); //T, L, R, B   

        oOutputFile.TableCell(getString("AUDI_ROLES"), 1, col, getString("FONT"), 16, Constants.C_BLACK, RGB(255, 255, 255), 0, Constants.FMT_BOLD | Constants.FMT_LEFT | Constants.FMT_VTOP, 0);
        oOutputFile.ResetFrameStyle();
        setFrame(0, 0, 0, 0); //T, L, R, B   
        oOutputFile.TableCell("", wEptyCell, getString("FONT"), 16, Constants.C_BLACK, RGB(255, 255, 255), 0, Constants.FMT_BOLD | Constants.FMT_LEFT | Constants.FMT_VTOP, 0);
        oOutputFile.ResetFrameStyle();
        setFrame(0, 0, 0, 15); //T, L, R, B   
        oOutputFile.TableCell(getString("AUDI_TEXT_COL_DESC"), 80, getString("FONT"), 16, Constants.C_BLACK, RGB(255, 255, 255), 0, Constants.FMT_BOLD | Constants.FMT_LEFT | Constants.FMT_VTOP, 0);
        oOutputFile.ResetFrameStyle();
        setFrame(0, 0, 0, 0); //T, L, R, B   
        oOutputFile.TableCell("", wEptyCell, getString("FONT"), 16, Constants.C_BLACK, RGB(255, 255, 255), 0, Constants.FMT_BOLD | Constants.FMT_LEFT | Constants.FMT_VTOP, 0);
        oOutputFile.ResetFrameStyle();
        setFrame(0, 0, 0, 15); //T, L, R, B   
        oOutputFile.TableCell(getString("AUDI_STAND"), 20, getString("FONT"), 16, Constants.C_BLACK, RGB(255, 255, 255), 0, Constants.FMT_BOLD | Constants.FMT_LEFT | Constants.FMT_VTOP, 0);

        oOutputFile.ResetFrameStyle();
        setFrame(0, 0, 0, 0); //T, L, R, B   
        oOutputFile.TableCell("", wEptyCell, getString("FONT"), 16, RGB(187, 10, 48), RGB(255, 255, 255), 0, Constants.FMT_BOLD | Constants.FMT_LEFT | Constants.FMT_VTOP, 0);
      
        oOutputFile.ResetFrameStyle();
        setFrame(0, 0, 0, 15); //T, L, R, B   
        oOutputFile.TableCell("", 20, getString("FONT"), 16, Constants.C_BLACK, RGB(255, 255, 255), 0, Constants.FMT_BOLD | Constants.FMT_LEFT | Constants.FMT_VTOP, 0);

        /********************************************************************************************** new row **********************************************************************************************/
        oOutputFile.TableRow();
        oOutputFile.ResetFrameStyle();
        setFrame(0, 0, 0, 0); //T, L, R, B
        oOutputFile.TableCell("", 1, col + colConst, getString("FONT"), 3, Constants.C_BLACK, RGB(255, 255, 255), 0, Constants.FMT_LEFT | Constants.FMT_VTOP, 0);

        /********************************************************************************************** new row **********************************************************************************************/
       
       
        oOutputFile.TableRow();
        oOutputFile.ResetFrameStyle();
        setFrame(0, 0, 0, 0); //T, L, R, 

        oOutputFile.TableRow();
        oOutputFile.ResetFrameStyle();
        setFrame(0, 0, 0, 0); //T, L, R, B   
        oOutputFile.TableCell("", 80, getString("FONT"), 11, Constants.C_BLACK, RGB(255, 255, 255), 0, Constants.FMT_BOLD | Constants.FMT_LEFT | Constants.FMT_VTOP, 0);
        oOutputFile.ResetFrameStyle();
        setFrame(0, 0, 0, 0); //T, L, R, B   

        oOutputFile.TableCell("", wEptyCell, getString("FONT"), 11, Constants.C_BLACK, RGB(255, 255, 255), 0, Constants.FMT_BOLD | Constants.FMT_LEFT | Constants.FMT_VTOP, 0);
        
        for (var j = nStart; j < nEnd; j++) {
            //horizont Func
            oOutputFile.ResetFrameStyle();
            setFrame(0, 0, 15, 0); //T, L, R, B 
            oOutputFile.TableCell(arrOuter[0][j].orgElemDef.Name(g_nLoc), 11, getString("FONT"), 10, Constants.C_BLACK, RGB(255, 255, 255), 0, Constants.FMT_BOLD | Constants.FMT_CENTER | Constants.FMT_VTOP, 0);
        }
        
       // oOutputFile.TableCell(getString("AUDI_ROLES"), 1, col, getString("FONT"), 11, Constants.C_BLACK, RGB(255, 255, 255), 0, Constants.FMT_BOLD | Constants.FMT_LEFT | Constants.FMT_VTOP, 0);
        oOutputFile.ResetFrameStyle();
        setFrame(0, 0, 0, 0); //T, L, R, B   
        oOutputFile.TableCell("", wEptyCell, getString("FONT"), 11, Constants.C_BLACK, RGB(255, 255, 255), 0, Constants.FMT_BOLD | Constants.FMT_LEFT | Constants.FMT_VTOP, 0);
        oOutputFile.ResetFrameStyle();
        setFrame(0, 0, 0, 0); //T, L, R, B   
        oOutputFile.TableCell("", 80, getString("FONT"), 11, Constants.C_BLACK, RGB(255, 255, 255), 0, Constants.FMT_BOLD | Constants.FMT_LEFT | Constants.FMT_VTOP, 0);
        oOutputFile.ResetFrameStyle();
        setFrame(0, 0, 0, 0); //T, L, R, B   
        oOutputFile.TableCell("", wEptyCell, getString("FONT"), 11, Constants.C_BLACK, RGB(255, 255, 255), 0, Constants.FMT_BOLD | Constants.FMT_LEFT | Constants.FMT_VTOP, 0);
        oOutputFile.ResetFrameStyle();
        setFrame(0, 0, 0, 0); //T, L, R, B   
        oOutputFile.TableCell("", 20, getString("FONT"), 11, Constants.C_BLACK, RGB(255, 255, 255), 0, Constants.FMT_BOLD | Constants.FMT_LEFT | Constants.FMT_VTOP, 0);

        oOutputFile.ResetFrameStyle();
        setFrame(0, 0, 0, 0); //T, L, R, B   
        oOutputFile.TableCell("", wEptyCell, getString("FONT"), 11, RGB(187, 10, 48), RGB(255, 255, 255), 0, Constants.FMT_BOLD | Constants.FMT_LEFT | Constants.FMT_VTOP, 0);
      
        oOutputFile.ResetFrameStyle();
        setFrame(0, 0, 0, 0); //T, L, R, B   
        oOutputFile.TableCell("", 20, getString("FONT"), 11, Constants.C_BLACK, RGB(255, 255, 255), 0, Constants.FMT_BOLD | Constants.FMT_LEFT | Constants.FMT_VTOP, 0);

      

        /********************************************************************************************** new row **********************************************************************************************/
      
       oOutputFile.TableRow();
        oOutputFile.ResetFrameStyle();
        setFrame(0, 0, 0, 0); //T, L, R, B
        oOutputFile.TableCell("", 1, col + colConst, getString("FONT"), wEptyCell, RGB(255, 255, 255), RGB(255, 255, 255), 0, Constants.FMT_LEFT | Constants.FMT_VTOP, 0);

        for (var i = 0; i < arrOuter.length; i++) {
            if (hasFunctionAworth(arrOuter[i]) == true) {
                oOutputFile.TableRow();

                if (bCheckFuncAssignments) {
                    oOutputFile.TableCell(getProcessAssignment(arrOuter[i][0].funcDef), 10, getString("FONT"), 10, Constants.C_BLACK, new java.awt.Color(0.65625, 0.8984375, 0.57421875).getRGB(), 0, Constants.FMT_BOLD | Constants.FMT_LEFT | Constants.FMT_VTOP, 0);
                }

                oOutputFile.ResetFrameStyle();
                setFrame(0, 0, 0, 15); //T, L, R, B
                oOutputFile.TableCell(arrOuter[i][0].funcDef.Name(g_nLoc), 80, getString("FONT"), 10, Constants.C_BLACK, RGB(255, 255, 255), 0, Constants.FMT_BOLD | Constants.FMT_LEFT | Constants.FMT_VTOP, 0);
                oOutputFile.ResetFrameStyle();
                setFrame(0, 0, 0, 0); //T, L, R, B
                oOutputFile.TableCell("", wEptyCell, getString("FONT"), 10, Constants.C_BLACK, RGB(255, 255, 255), 0, Constants.FMT_BOLD | Constants.FMT_LEFT | Constants.FMT_VTOP, 0);

                for (var j = nStart; j < nEnd; j++) {
                    setFrame(15, 15, 15, 15); //T, L, R, B
                    oOutputFile.TableCell(arrOuter[i][j].rasciValue, 10, getString("FONT"), 10, Constants.C_BLACK, arrOuter[i][j].colour, 0, Constants.FMT_BOLD | Constants.FMT_CENTER | Constants.FMT_VTOP, 0);
                }
                //sloupecek za tab
                oOutputFile.ResetFrameStyle();
                setFrame(0, 0, 0, 0); //T, L, R, B
                oOutputFile.TableCell("", wEptyCell, getString("FONT"), 10, Constants.C_BLACK, RGB(255, 255, 255), 0, Constants.FMT_BOLD | Constants.FMT_LEFT | Constants.FMT_VTOP, 0);

                var funDef = arrOuter[i][0].funcDef
                var icxndefs = funDef.CxnListFilter(Constants.EDGES_IN);
                icxndefs = ArisData.sort(icxndefs, Constants.SORT_TYPE, Constants.AT_NAME, Constants.SORT_NONE, g_nLoc);
                var ocxndefs = funDef.CxnListFilter(Constants.EDGES_OUT);
                ocxndefs = ArisData.sort(ocxndefs, Constants.SORT_TYPE, Constants.AT_NAME, Constants.SORT_NONE, g_nLoc);

                var input = new String("");
                var cnxsDesc = new String("");

                for (var r = 0; r < icxndefs.length;r++) {
                    // var ocxndef = IDSA.getDef(icxndefs[r]);
                    var descAttr = icxndefs[r].Attribute(Constants.AT_DESC, g_nLoc).getValue();

                    var srcobj = IDSA.getSource(icxndefs[r]);
                    var typeNum = srcobj.TypeNum();
                    if (IDSA.contains([Constants.OT_RULE], typeNum) == true) // NO XOR
                        continue;

                    var occs = srcobj.OccListInModel(oSelModels[0]); //hack get occ from model
                    if (occs.length > 0) {
                        if (IDSA.contains([Constants.OT_INFO_CARR, Constants.OT_CLST], typeNum) == true) {
                            input += IDSA.outputNamesWithNewLine(r, srcobj, icxndefs, typeNum);
                        }
                        if (IDSA.contains(g_aOrgTypes, typeNum) == true) {
                            if (IDSA.isAttrMaintained(icxndefs[r], Constants.AT_DESC, g_nLoc))
                                cnxsDesc += descAttr + ";";
                        }
                    }
                }

                var output = new String("");
                for (var s =0; s < ocxndefs.length; s++) {
                    var descAttr = ocxndefs[s].Attribute(Constants.AT_DESC, g_nLoc).getValue();
                    var srcobj = IDSA.getTarget(ocxndefs[s]);
                    var typeNum = srcobj.TypeNum();
                    if (IDSA.contains([Constants.OT_RULE], typeNum) == true) // NO XOR
                        continue;

                    var occs = srcobj.OccListInModel(oSelModels[0]);
                    if (occs.length > 0) {
                        if (IDSA.contains([Constants.OT_INFO_CARR, Constants.OT_CLST], typeNum) == true) {
                            output += IDSA.outputNamesWithNewLine(s, srcobj, ocxndefs, typeNum);
                        }
                        if (IDSA.contains(g_aOrgTypes, typeNum) == true) {
                            if (IDSA.isAttrMaintained(icxndefs[r], Constants.AT_DESC, g_nLoc))
                                cnxsDesc += descAttr + ";";
                        }
                    }
                }

                oOutputFile.ResetFrameStyle();
                setFrame(0, 0, 0, 15); //T, L, R, B
                oOutputFile.TableCell(IDSA.removeLastSemicolon(cnxsDesc), 80, getString("FONT"), 10, Constants.C_BLACK, RGB(255, 255, 255), 0, Constants.FMT_LEFT | Constants.FMT_VTOP, 0);

                setFrame(0, 0, 0, 0); //T, L, R, B
                oOutputFile.TableCell("", wEptyCell, getString("FONT"), 10, Constants.C_BLACK, RGB(255, 255, 255), 0, Constants.FMT_BOLD | Constants.FMT_LEFT | Constants.FMT_VTOP, 0);

                oOutputFile.TableCell("", 20, getString("FONT"), 10, Constants.C_BLACK, RGB(255, 255, 255), 0, Constants.FMT_LEFT | Constants.FMT_VTOP, 0);
                oOutputFile.ResetFrameStyle();

                setFrame(0, 0, 0, 0); //T, L, R, B
                oOutputFile.TableCell("", wEptyCell, getString("FONT"), 10, Constants.C_BLACK, RGB(255, 255, 255), 0, Constants.FMT_BOLD | Constants.FMT_LEFT | Constants.FMT_VTOP, 0);

                setFrame(0, 0, 0, 0); //T, L, R, B
                oOutputFile.TableCell("", 20, getString("FONT"), 10, Constants.C_BLACK, RGB(255, 255, 255), 0, Constants.FMT_LEFT | Constants.FMT_VTOP, 0);

            } else {
                if (bCheckFuncAssignments) {
                    g_aNotAssignedFuncs.add(arrOuter[i][0].funcDef);
                }
                //add or xor line
                /*  if (arrOuter[i][0].funcDef.TypeNum()== 50){
                     oOutputFile.TableRow();
                     oOutputFile.TableCell(arrOuter[i][0].funcDef.Name(g_nLoc),60, getString("FONT"), 10, Constants.C_BLACK, RGB(255, 255, 255), 0, Constants.FMT_BOLD | Constants.FMT_CENTER | Constants.FMT_VTOP, 0);
                     oOutputFile.TableCell("",1 ,col, getString("FONT"), 10, Constants.C_BLACK, RGB(255, 255, 255), 0, Constants.FMT_BOLD | Constants.FMT_LEFT | Constants.FMT_VTOP, 0);
                     oOutputFile.TableCell("",1 ,3, getString("FONT"), 10, Constants.C_BLACK, RGB(255, 255, 255), 0, Constants.FMT_BOLD | Constants.FMT_LEFT | Constants.FMT_VTOP, 0);
                     oOutputFile.TableRow();
                  }*/
            }
        }

        //note
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

        var sTableName = sProcessName;
        if (nCount > 0) sTableName = "" + (nCount + 1) + ". " + sProcessName;
        oOutputFile.EndTable(sTableName, 100, getString("FONT"), 10, Constants.C_RED, Constants.C_TRANSPARENT, 0, Constants.FMT_LEFT | Constants.FMT_VTOP, 0);

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