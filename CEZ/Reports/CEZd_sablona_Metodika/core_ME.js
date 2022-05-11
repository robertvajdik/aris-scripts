/*
 * Core fro Swimm Lane model
 */
function core_ME(oModel) {

    //nazev Dokumentu Odstranění ID- prefixu z nazvu modela
    var nazevDokumentu = oModel.Name(g_Loc);
    var zpracovatel = oModel.Attribute(attr_zpracovatel, g_Loc).getValue();

    /* Title Page */
    replaceTextInWordDOC("ARIS_NAZEV", nazevDokumentu, "Text_Left_BOLD");
    replaceTextInWordDOC("ARIS_PROCES", "TODO_proces", "Text_Left_BOLD");
    replaceTextInWordDOC("ARIS_GARANT", "TODO_garant", "Text_Left_BOLD");
    replaceTextInWordDOC("ARIS_ZPRACOVATEL", zpracovatel, "Text_Left_BOLD");

    /* Content */
    var mujUcel = oModel.Attribute(Constants.AT_DESC, g_Loc).getValue().trim();
    mujUcel = unifyTextFromARIS(mujUcel);

    replaceTextInWordDOC("ARIS_UCEL", mujUcel, getString("TEXT_STYLE_DEFAULT"));

    //Org. unit list 
    var AD = ArisData.getActiveDatabase()
    var m_usek_gr = AD.FindGUID("2079d371-501d-11ea-4a4f-005056ad7c76", Constants.CID_MODEL); //Úsek Generální ředitel
    var m_userk_finance_aSprava = AD.FindGUID("25482461-501d-11ea-4a4f-005056ad7c76", Constants.CID_MODEL); //Úsek Finance a správa
    var m_userk_rizeni_dis = AD.FindGUID("2a37b8f1-501d-11ea-4a4f-005056ad7c76", Constants.CID_MODEL); //Úsek Řízení distribučních aktiv
    var m_usek_sitove_sluzby = AD.FindGUID("3a520971-501d-11ea-4a4f-005056ad7c76", Constants.CID_MODEL); //Úsek Síťové služby
    var m_userk_provoz = AD.FindGUID("5a37ee31-501d-11ea-4a4f-005056ad7c76", Constants.CID_MODEL); //Úsek Provoz a řízení DS

    var symbolOJ_D0 = getAttributNumber("853f28e0-ad64-11e2-2198-002264fa4604");
    var symbolOJ_D1 = getAttributNumber("c4a1f760-ad64-11e2-2198-002264fa4604");
    var symbolOJ_D2 = getAttributNumber("f2dab310-ad64-11e2-2198-002264fa4604");
    var symbolOJ_D3 = getAttributNumber("054694b0-ad65-11e2-2198-002264fa4604");
    var attr_CisloUtvaru = getAttributNumber("d0c64740-00a4-11e5-5d17-e27d2e316924");

    function getListOJ(model, symbolOJ_D0, symbolOJ_D1, symbolOJ_D2, attr_CisloUtvaru) {
        var arr_user_gr = new Array();
        if (model.IsValid()) {
            var topOccs = model.ObjOccListBySymbol([symbolOJ_D0]);
            for (var r = 0; r < topOccs.length; r++) {
                var cislUtvaru = topOccs[r].ObjDef().Attribute(attr_CisloUtvaru, g_Loc).getValue();
                arr_user_gr.push(cislUtvaru.substring(3, cislUtvaru.length()));
                var D1s = topOccs[r].getConnectedObjOccs([symbolOJ_D1, symbolOJ_D2, symbolOJ_D3]);
                for (var s = 0; s < D1s.length; s++) {
                    var D2s = D1s[s].getConnectedObjOccs([symbolOJ_D1, symbolOJ_D2, symbolOJ_D3]);
                    var cislUtvaru = D1s[s].ObjDef().Attribute(attr_CisloUtvaru, g_Loc).getValue();
                    arr_user_gr.push(cislUtvaru.substring(3, cislUtvaru.length()));
                    for (var t = 0; t < D2s.length; t++) {
                        var cislUtvaru = D2s[t].ObjDef().Attribute(attr_CisloUtvaru, g_Loc).getValue();
                        arr_user_gr.push(cislUtvaru.substring(3, cislUtvaru.length()));
                    }
                }
            }
        }
        return arr_user_gr.sort().toString().split(',').join(', ');
    }

    replaceTextInWordDOC("ARIS_GENERALNI_REDITEL", getListOJ(m_usek_gr, symbolOJ_D0, symbolOJ_D1, symbolOJ_D2, attr_CisloUtvaru), getString("TEXT_STYLE_DEFAULT"));
    replaceTextInWordDOC("ARIS_FINANCE_A_SPRAVA", getListOJ(m_userk_finance_aSprava, symbolOJ_D0, symbolOJ_D1, symbolOJ_D2, attr_CisloUtvaru), getString("TEXT_STYLE_DEFAULT"));
    replaceTextInWordDOC("ARIS_RIZENI_DIS_AKTIV", getListOJ(m_userk_rizeni_dis, symbolOJ_D0, symbolOJ_D1, symbolOJ_D2, attr_CisloUtvaru), getString("TEXT_STYLE_DEFAULT"));
    replaceTextInWordDOC("ARIS_SITOVE_SLUZBY", getListOJ(m_usek_sitove_sluzby, symbolOJ_D0, symbolOJ_D1, symbolOJ_D2, attr_CisloUtvaru), getString("TEXT_STYLE_DEFAULT"));
    replaceTextInWordDOC("ARIS_PROVOZ_A_RIZENI_DS", getListOJ(m_userk_provoz, symbolOJ_D0, symbolOJ_D1, symbolOJ_D2, attr_CisloUtvaru), getString("TEXT_STYLE_DEFAULT"));

    //Matice odpovednosti - Matrix R
    var replace = g_oOut.SetPositionToField("ARIS_TABULKA_ODPOVEDNOSTI", true); //for section 1
    if (replace) {
        g_aModelTypes = initModelTypes();
        g_aRoleTypes = initRoleTypes();
        g_aCxnTypes_R = initCxnTypes_R();

        var oFuncDefs = getFunctionObjects([oModel]);
        //var oRoleDefs = getRoleObjects([oModel]);
        var oRoleDefs = getRoleObjectsFromLane(oModel); //retunr all defs from first column

        var arrOuter = getData(oFuncDefs, oRoleDefs, oModel);
        outTables(arrOuter, oModel.Name(g_Loc), false);
    }

    //Chapter 4
    replaceTextInWordDOC("ARIS_NAZEV_METODIKY", oModel.Name(g_Loc), getString("TEXT_STYLE_HEADER1"));

    //get all Functions
    // Insert tables of functions 
    var replace = g_oOut.SetPositionToField("ARIS_HNIZDA", true);
    if (replace) {

        var aObjFuncsInEPC = oModel.ObjOccListFilter(Constants.OT_FUNC);
        aObjFuncsInEPC = ArisData.sort(aObjFuncsInEPC, attr_KeyIdentifier, Constants.AT_NAME, g_Loc);
        var oRoleOccs = getRoleOccsFromLane(oModel); //retunr all defs from first column

        for (var k = 0; k < aObjFuncsInEPC.length; k++) {
            if (aObjFuncsInEPC[k].SymbolNum() == Constants.ST_FUNC || aObjFuncsInEPC[k].SymbolNum() == Constants.ST_SYS_FUNC_ACT) //335 only fun with green symbols
            {
                var keyIndex = "";
                if(aObjFuncsInEPC[k].ObjDef().Attribute(1208, g_Loc).IsMaintained())
                var keyIndex = " ("+aObjFuncsInEPC[k].ObjDef().Attribute(1208, g_Loc).getValue() + ") ";
                
                var cinnost  = aObjFuncsInEPC[k].ObjDef().Name(g_Loc);
                insertMark_forHeader(keyIndex+cinnost, aObjFuncsInEPC[k].ObjDef().GUID(), getString("TEXT_STYLE_HEADER3_HIDDEN"), getString("TEXT_STYLE_HEADER3"));

                //table for EPC
                provadi_EPC_FromSwimLane.clear();
                spolupracuje_EPC.clear();
                cinnost_EPC.clear();
                vstup_EPC.clear();
                vystup_EPC.clear();

                getAllCxnfromFuncEPC(aObjFuncsInEPC[k], oRoleOccs);
                g_oOut.BeginTable(100, Constants.C_BLACK, Constants.C_WHITE, Constants.FMT_LEFT, 0);

                if (provadi_EPC_FromSwimLane.length > 0) {
                    g_oOut.TableRow();
                    g_oOut.TableCellF("Kdo provádí", 20, "Normal_Text");

                    printRow(provadi_EPC_FromSwimLane, 80);
                    //printCell_withMark(provadi_EPC, 80);
                }
                if (spolupracuje_EPC.length > 0) {
                    g_oOut.TableRow();
                    g_oOut.TableCellF("Spolupracuje", 20, "Normal_Text");
                    printRow(spolupracuje_EPC, 80);
                    //printCell_withMark(spolupracuje_EPC, 80);
                }
                if (cinnost_EPC.length > 0) {
                    g_oOut.TableRow();
                    g_oOut.TableCellF("Krok", 20, "Normal_Text");
                    printRowDesc(cinnost_EPC, 80);
                }
                if (vstup_EPC.length > 0) {
                    g_oOut.TableRow();
                    g_oOut.TableCellF("Vstup", 20, "Normal_Text");
                    printRowDesc(vstup_EPC, 80);
                }
                if (vystup_EPC.length > 0) {
                    g_oOut.TableRow();
                    g_oOut.TableCellF("Výstup", 20, "Normal_Text");
                    printRowDesc(vystup_EPC, 80);
                }
                g_oOut.TableRow();
                g_oOut.EndTable("", 100, getString("TEXT_FONT_DEFAULT"), 11, Constants.C_BLACK, Constants.C_BLACK, 0, Constants.FMT_LEFT, 0);
            }
        } //for
    }

    //6. Zaznamy
    var replace = g_oOut.SetPositionToField("ARIS_ZAZNAMY", true); //for section 1
    if (replace) {

        var arr_zaznamyObjDefs = new Array();
        var oObjOccs = getFuncFromModel(oModel, Constants.ST_FUNC);
        for (var i = 0; i < oObjOccs.length; i++) {
            var oObjOcc = oObjOccs[i];
            var oObjDef = oObjOcc.ObjDef();
            var object_Name = oObjDef.Name(g_Loc);
            
            var inputs = oObjOcc.getConnectedObjOccs([Constants.ST_PERFORM, Constants.ST_CLST, Constants.ST_DOC], Constants.EDGES_INOUT);
            inputs = ArisData.sort(inputs, Constants.AT_NAME, g_Loc)
            for (var j = 0; j < inputs.length; j++) {
                if(inputs[j].ObjDef().Attribute(attr_JeZaznam, g_Loc).IsMaintained()){
                    if(inputs[j].ObjDef().Attribute(attr_JeZaznam, g_Loc).getValue() == "Ano" || inputs[j].ObjDef().Attribute(attr_JeZaznam, 1029).getValue() == true )
                        arr_zaznamyObjDefs.push(inputs[j].ObjDef());
                    }
                }
        }

        arr_zaznamyObjDefs = ArisData.sort(arr_zaznamyObjDefs, Constants.SORT_TYPE, Constants.AT_NAME, g_Loc);
        arr_zaznamyObjDefs = ArisData.Unique(arr_zaznamyObjDefs);

        g_oOut.BeginTable(100, Constants.C_BLACK, Constants.C_WHITE, Constants.FMT_LEFT, 0);
        g_oOut.TableRow();
        g_oOut.TableCellF("Spis znak DT", 5, "Header_VERT_UP");
        g_oOut.TableCellF("Kód", 5, "Header_VERT_UP");
        g_oOut.TableCellF("Název záznamu", 30, "Bold_Text");
        g_oOut.TableCellF("Stupeň důvěrnosti", 10, "Header_VERT_UP");
        g_oOut.TableCellF("Skartační  znak/lhůta", 10, "Header_VERT_UP");
        g_oOut.TableCellF("Místo uložení záznamu", 10, "Header_VERT_UP");
        g_oOut.TableCellF("Poznámka", 30, "Bold_Text");
        g_oOut.TableRow();

        if(arr_zaznamyObjDefs.length == 0){
            g_oOut.TableCellF("-", 7, "Small_Text");
            g_oOut.TableCellF("-", 7, "Small_Text");
            g_oOut.TableCellF("-", 30, "Normal_Text");
            g_oOut.TableCellF("-", 10, "Small_Text");
            g_oOut.TableCellF("-", 10, "Small_Text");
            g_oOut.TableCellF("-", 10, "Small_Text");
            g_oOut.TableCellF("-", 30, "Small_Text");
            g_oOut.TableRow();
        }
        
        for (var j = 0; j < arr_zaznamyObjDefs.length; j++) {
            var desc = "-"

            //TODO attribute true has to be checked, missing in filter
            if (arr_zaznamyObjDefs[j].Attribute(Constants.AT_DESC, g_Loc).IsMaintained())
                desc = arr_zaznamyObjDefs[j].Attribute(Constants.AT_DESC, g_Loc).getValue();

            g_oOut.TableCellF("-", 7, "Small_Text");
            g_oOut.TableCellF(j, 7, "Small_Text");
            g_oOut.TableCellF(arr_zaznamyObjDefs[j].Name(g_Loc), 30, "Normal_Text");
            g_oOut.TableCellF("-", 10, "Small_Text");
            g_oOut.TableCellF("-", 10, "Small_Text");
            g_oOut.TableCellF("-", 10, "Small_Text");
            g_oOut.TableCellF(desc, 30, "Small_Text");
            g_oOut.TableRow();
        }
        g_oOut.EndTable("", 100, getString("TEXT_FONT_DEFAULT"), 11, Constants.C_BLACK, Constants.C_BLACK, 0, Constants.FMT_LEFT, 0);
    }

    //Priloha c 1. Role
    var replace = g_oOut.SetPositionToField("ARIS_PREHLED_ROLI", true); //for section 1
    if (replace) {

        oRoleDefs = ArisData.sort(oRoleDefs, Constants.SORT_TYPE, Constants.AT_NAME, g_Loc);
        oRoleDefs = ArisData.Unique(oRoleDefs);

        g_oOut.BeginTable(100, Constants.C_BLACK, Constants.C_WHITE, Constants.FMT_LEFT, 0);
        g_oOut.TableRow();
        g_oOut.TableCellF("Role", 30, "Bold_Text");
        g_oOut.TableCellF("Pracovní pozice", 70, "Bold_Text");
        g_oOut.TableRow();

        for (var j = 0; j < oRoleDefs.length; j++) {
            var pozice = "-"

            switch (oRoleDefs[j].TypeNum()) {
                case Constants.OT_POS:
                    pozice = oRoleDefs[j].Attribute(attr_cisloPM, g_Loc).getValue();
                    break;
                case Constants.OT_ORG_UNIT:
                    pozice = oRoleDefs[j].Attribute(attr_cisloUtvaru, g_Loc).getValue();
                    break;
                default:
                    pozice = oRoleDefs[j].Attribute(Constants.AT_DESC, g_Loc).getValue();
            }
            g_oOut.TableCellF(oRoleDefs[j].Name(g_Loc), 30, "Normal_Text");
            g_oOut.TableCellF(pozice, 70, "Normal_Text");
            g_oOut.TableRow();
        }
        g_oOut.EndTable("", 100, getString("TEXT_FONT_DEFAULT"), 11, Constants.C_BLACK, Constants.C_BLACK, 0, Constants.FMT_LEFT, 0);
    }
}

/*
 * Get all Func Occ(green) from Model
 */
function getFuncFromModel(model, symbolFunc) {

    var oObjOccs_all = model.ObjOccListBySymbol(symbolFunc);
    oObjOccs_all = ArisData.sort(oObjOccs_all, attr_KeyIdentifier, Constants.AT_NAME, g_Loc);
    var oObjOccs = new Array(); //vyber funkci dle kriteria

    for (var i = 0; i < oObjOccs_all.length; i++) {
        if (oObjOccs_all[i].getColor() == symbolColor_Green) {
            oObjOccs.push(oObjOccs_all[i]);
        }
    }
    oObjOccs = ArisData.sort(oObjOccs, attr_KeyIdentifier, Constants.AT_NAME, g_Loc);
    return oObjOccs;
}

/*
 * Get all Func Occ(green) from Model
 */
function getFuncObjDefFromModel(model, symbolFunc) {

    var oObjOccs_all = model.ObjOccListBySymbol(symbolFunc);
    oObjOccs_all = ArisData.sort(oObjOccs_all, attr_KeyIdentifier, Constants.AT_NAME, g_Loc);
    var oObjDefs = new Array(); //vyber funkci dle kriteria

    for (var i = 0; i < oObjOccs_all.length; i++) {
        if (oObjOccs_all[i].getColor() == symbolColor_Green) {
            oObjDefs.push(oObjOccs_all[i].ObjDef());
        }
    }
    oObjDefs = ArisData.sort(oObjDefs, attr_KeyIdentifier, Constants.AT_NAME, g_Loc);
    return oObjDefs;
}


function replaceTextInWordDOC(docKeyValue, ARISValu, ARISstyle) {
    var replace = g_oOut.SetPositionToField(docKeyValue, true);
    if (replace) {
        g_oOut.OutputF(ARISValu, ARISstyle);
    }
}