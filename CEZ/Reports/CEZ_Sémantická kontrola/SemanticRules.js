/**************************** Rule 0 ***********************/
function rule_0(model, modelName, modelGuid) {
    var objOccList_func = new Array();
    if (([Constants.MT_VAL_ADD_CHN_DGM].contains(g_model_typeNum) == true)) { //VACD
        var oOcc = model.ObjOccListFilter([Constants.OT_FUNC]);
        for (var i = 0; i < oOcc.length; i++) {
            objOccList_func.push(oOcc[i]);
        }
    }
    if ((EPC_models.contains(g_model_typeNum) == true)) { //EPC
        var oOcc = model.ObjOccListFilter([Constants.OT_FUNC]);
        for (var i = 0; i < oOcc.length; i++) {
            //if (oOcc[i].SymbolNum() != SYM_PROCESS_INTERFACE && oOcc[i].SymbolNum() != SYM_PROCESS_INTERFACE2 && oOcc[i].SymbolNum() != SYM_STAT) { ///exclude interfrace & header object
            if (oOcc[i].SymbolNum() != SYM_PROCESS_INTERFACE && oOcc[i].SymbolNum() != SYM_PROCESS_INTERFACE2) { ///exclude interfrace
                objOccList_func.push(oOcc[i]);
            }
        } //for
    }
    if (([Constants.MT_FUNC_ALLOC_DGM].contains(g_model_typeNum) == true)) { //FAD
        var oOcc = model.ObjOccListFilter([Constants.OT_FUNC]);
        for (var i = 0; i < oOcc.length; i++) {
            objOccList_func.push(oOcc[i]);
        }
        if (objOccList_func.length == 1) //only one func is allowed
            return true;
    }
    if (objOccList_func.length > 0 && objOccList_func.length <= 15) {
        ok_output(modelName, modelGuid, getString("TEXT_RULE_0_LABEL"), getString("TEXT_RULE_0"), "", "");
        /* outfile.TableCellF("✓ ", 20, "TABLE_CELL_GREEN");
        outfile.TableCellF("", 40, "TABLE_CELL");
        outfile.TableCellF(getString("RULE_0") + objOccList_func.length, 100, "TABLE_CELL_LEFT"); */
        return true;
    } else {
        ko_output(modelName, modelGuid, getString("TEXT_RULE_0_LABEL"), getString("TEXT_RULE_0"), "", "");
        // return false;
    }
}
/**************************** Rule 0 ***********************/
/**************************** Rule 1 ***********************/
// -------------------------------
// Subroutine OnlyOneInOutRelationShip sem_check output objects if the objectfrom the type function or event has more then one in- or output relationship.
// EvaluStruct = struct with the evaluate informations
// -------------------------------
// 477	CT_SUCCEED
// 676	CT_ARCHIMATE_LINKS
//  Process interface rule 9 =  Process interface i has occurence in VACD & object attr Process level = 3
//  var CheckedAttr_ProcessLevel = aFilter.UserDefinedAttributeTypeNum("eba01f100-0b57-11e8-375a-54ee7539b247"); //Process level of Function object type
function rule_1(model, modelName, modelGuid) {
    var hashMap_funcTofunc = new Packages.java.util.HashMap();
    var oobjoccs = model.ObjOccListFilter(Constants.OT_EVT);
    var odummyoccs = model.ObjOccListFilter(Constants.OT_FUNC);
    // check the relationships
    for (var i = 0; i < oobjoccs.length; i++) {
        var nincxns = oobjoccs[i].InDegree(Constants.EDGES_STRUCTURE);
        var noutcxns = oobjoccs[i].OutDegree(Constants.EDGES_STRUCTURE);
        var outcxns = oobjoccs[i].OutEdges(Constants.EDGES_STRUCTURE);
        if (noutcxns >= 1) {
            for (var j = 0; j < outcxns.length; j++) {
                var targetOccs = outcxns[j].TargetObjOcc();
                if (targetOccs.OrgSymbolNum() == Constants.ST_EV) hashMap_funcTofunc.put(oobjoccs[i].ObjDef(), targetOccs.ObjDef());
            } //for
        }
    }
    // var ooutobjects = ArisData.sort(ooutobjects, Constants.SORT_TYPE, Constants.AT_NAME, Constants.SORT_NONE, g_loc);
    if (hashMap_funcTofunc.size() > 0) {
        for (var entry = hashMap_funcTofunc.keySet().iterator(); entry.hasNext();) {
            var value = entry.next();
            var key = hashMap_funcTofunc.get(value);
            var objectName_source = value.Name(g_loc);
            var objectName_target = key.Name(g_loc);
            ko_output(modelName, modelGuid, getString("TEXT_RULE_6_LABEL"), getString("TEXT_RULE_1"), objectName_source, " >> " + objectName_target);
        }
    } else {
        ok_output(modelName, modelGuid, getString("TEXT_RULE_6_LABEL"), getString("TEXT_RULE_1"), "", "");
    }
}
/**************************** Rule 1 ***********************/
/**************************** Rule 2 ***********************/
//The naming of the objects are correct (unnamed objects)
function rule_2(allObjDefList, modelName, modelGuid) {
    var isOk = true;
    // var langList = ArisData.getActiveDatabase().LanguageList();   
    for (var i = 0; i < allObjDefList.length; i++) {
        /* Method 1*/
        SUPPORTED_LANGUAGES.forEach(function(language) {
            var sName = allObjDefList[i].Attribute(Constants.AT_NAME, language).getValue();
            var g_sLang = String(ArisData.getActiveDatabase().getDbLanguage().convertLocale(language).getLocale().getLanguage());
            var typeNum = allObjDefList[i].TypeNum();
            if (sName == "") {
                isOk = false;
                var sAnyName = getAnyNameOfObjDef(allObjDefList[i]);
                if (sAnyName.length > 0) ko_output(modelName, modelGuid, getString("TEXT_RULE_2"), getString("TEXT_RULE2_NAME") + g_sLang + " for:" + sAnyName + "\nTypeNum [" + g_omethodfilter.ObjTypeName(typeNum) + "] ", "GUID: " + allObjDefList[i].GUID());
                else ko_output(modelName, modelGuid, getString("TEXT_RULE_2"), getString("TEXT_RULE2_NAME") + g_sLang + "\nTypeNum [" + g_omethodfilter.ObjTypeName(typeNum) + "] ", "GUID: " + allObjDefList[i].GUID());
            }
            //   ko_output(modelName, modelGuid, getString("TEXT_RULE_2_LABEL"), getString("TEXT_RULE_2"), "", "");
        });
    }

    function getAnyNameOfObjDef(objDef) {
        //return name in selected lang if is maintn. 
        if (objDef.Attribute(Constants.AT_NAME, g_loc).IsMaintained()) {
            return objDef.Attribute(Constants.AT_NAME, g_loc).getValue() + " (" + locale + ")";
        }
        // if selec lang is not maint then get any readable name
        for (var j = 0; j < langList.length; j++) {
            var localeID = langList[j].LocaleInfo().getLocaleID();
            var locale = langList[j].LocaleInfo().getLocale();
            if (objDef.Attribute(Constants.AT_NAME, localeID).IsMaintained()) {
                return objDef.Attribute(Constants.AT_NAME, localeID).getValue() + " (" + locale + ")";
            }
        } //for
        return "";
    }
    if (isOk) {
        ok_output(modelName, modelGuid, getString("TEXT_RULE_2_LABEL"), getString("TEXT_RULE_2"), "", "");
    }
}
/**************************** Rule 2 ***********************/
/**************************** Rule 3 ***********************/
//Symbols are located correctly
function rule_3(model, allObjOccs, modelName, modelGuid) {
    var funcs_inModel = model.ObjOccListFilter(Constants.OT_FUNC);
    funcs_inModel = ArisData.sort(funcs_inModel, Constants.AT_NAME, g_loc);
    var isOk = true;
    for (var i = 0; i < funcs_inModel.length; i++) {
        var func = funcs_inModel[i];
        if ((func.SymbolNum() != SYM_PROCESS_INTERFACE || func.SymbolNum() != SYM_PROCESS_INTERFACE2)) { //non interface
            var object_Name = func.ObjDef().Name(g_loc);
            var func_X = func.X();
            var func_Y = func.Y();
            var incxns = func.Cxns(Constants.EDGES_IN, Constants.EDGES_NONSTRUCTURE);
            var nincxns = func.InDegree(Constants.EDGES_NONSTRUCTURE);
            var outcxns = func.Cxns(Constants.EDGES_OUT, Constants.EDGES_NONSTRUCTURE);
            var noutcxns = func.OutDegree(Constants.EDGES_NONSTRUCTURE);
            var incxns_struc = func.Cxns(Constants.EDGES_IN, Constants.EDGES_STRUCTURE);
            var nincxns_struc = func.InDegree(Constants.EDGES_STRUCTURE);
            var outcxns_struc = func.Cxns(Constants.EDGES_OUT, Constants.EDGES_STRUCTURE);
            var noutcxns_struc = func.OutDegree(Constants.EDGES_STRUCTURE);
            if (([Constants.MT_FUNC_ALLOC_DGM].contains(g_model_typeNum) == true)) { //FAD
                //Roles at the right
                var Role_IsConnected = checkIfFuncRoleisAtRight(nincxns, incxns, func_X);
                if (nincxns >= 1) {
                    if (Role_IsConnected) { //check if Role exist
                        ko_output(modelName, modelGuid, getString("TEXT_RULE_3_LABEL"), getString("TEXT_RULE_3"), object_Name, getString("TEXT_RULE_3_ROLES_USED"));
                        isOk = false;
                    } else if (Role_IsConnected == false) {
                        // ko_output(modelName,modelGuid,getString("TEXT_RULE_3_LABEL"), getString("TEXT_RULE_3"), object_Name, getString("TEXT_RULE_3_KO_ROLES"));
                    }
                }
                /*  //IT System is Connected
                 var IT_SystemIsConnected = checkIfFuncHasITSystem(nincxns, incxns);
                 if (IT_SystemIsConnected) {
                   //  ok_output(getString("TEXT_RULE_3_LABEL"), getString("TEXT_RULE_3"), object_Name, getString("TEXT_RULE_3_OK_ITSYSTEM"));
                 } else if(IT_SystemIsConnected == false) {
                     ko_output(modelName,modelGuid,getString("TEXT_RULE_3_LABEL"), getString("TEXT_RULE_3"), object_Name, getString("TEXT_RULE_3_KO_ITSYSTEM"));
                 }
                 //Informationobject is Connected
                 var Informationsobject_IsConnected = checkIfFuncHasInformationsObject(nincxns_struc, incxns_struc, noutcxns_struc, outcxns_struc);
                 if (Informationsobject_IsConnected) {
                   //  ok_output(getString("TEXT_RULE_3_LABEL"), getString("TEXT_RULE_3"), object_Name, getString("TEXT_RULE_3_OK_INFORMATIONSOBJECT"));
                 } else if(Informationsobject_IsConnected == false) {
                     ko_output(modelName,modelGuid,getString("TEXT_RULE_3_LABEL"), getString("TEXT_RULE_3"), object_Name, getString("TEXT_RULE_3_KO_INFORMATIONSOBJECT"));
                 }

                 //Mask is Connected
                 var Mask_IsConnected = checkIfFuncHasMask(noutcxns_struc, outcxns_struc);
                 if (Mask_IsConnected) {
                   //  ok_output(getString("TEXT_RULE_3_LABEL"), getString("TEXT_RULE_3"), object_Name, getString("TEXT_RULE_3_OK_OBJTYPE_CONNECTED"));
                 } else if(Mask_IsConnected == false) {
                     ko_output(modelName,modelGuid,getString("TEXT_RULE_3_LABEL"), getString("TEXT_RULE_3"), object_Name, getString("TEXT_RULE_3_OK_OBJTYPE_CONNECTED"));
                 } */
            }
            if (([Constants.MT_EEPC, Constants.MT_EEPC_COLUMN, Constants.MT_EEPC_INST, Constants.MT_EEPC_MAT, Constants.MT_EEPC_ROW, Constants.MT_EEPC_TAB, Constants.MT_EEPC_TAB_HORIZONTAL].contains(g_model_typeNum) == true)) { //EPC
                //Roles at the right for EPC
                var Role_IsConnected = checkIfFuncRoleisAtRight(nincxns, incxns, func_X);
                if (nincxns >= 1) {
                    if (Role_IsConnected) { //check if Role exist
                        // ok_output(getString("TEXT_RULE_3_LABEL"), getString("TEXT_RULE_3"), object_Name, getString("TEXT_RULE_3_OK_ROLES"));
                    } else if (Role_IsConnected == false) {
                        ko_output(modelName, modelGuid, getString("TEXT_RULE_3_LABEL"), getString("TEXT_RULE_3"), object_Name, getString("TEXT_RULE_3_KO_ROLES"));
                        isOk = false;
                    }
                } else {
                    //  warning_output(getString("TEXT_RULE_3_LABEL"), getString("TEXT_RULE_3"), "", getString("TEXT_RULE_3_ROLES_USED") + ' "' + object_Name + '"');
                }
                //IT System is Connected in EPC (= wrong)
                var IT_SystemIsConnected = checkIfFuncHasObjectType(nincxns, incxns, noutcxns, outcxns, OBJ_SYS);
                if (IT_SystemIsConnected) {
                    ko_output(modelName, modelGuid, getString("TEXT_RULE_3_LABEL"), getString("TEXT_RULE_3"), object_Name, getString("TEXT_RULE_3_OK_OBJTYPE_CONNECTED") + objectTypeName_SYS);
                    isOk = false;
                }
                //Data object (Cluster) is Connected
                var Informationsobject_IsConnected = checkIfFuncHasObjectType(nincxns, incxns, noutcxns, outcxns, OBJ_CLST);
                if (Informationsobject_IsConnected) {
                    ko_output(modelName, modelGuid, getString("TEXT_RULE_3_LABEL"), getString("TEXT_RULE_3"), object_Name, getString("TEXT_RULE_3_OK_OBJTYPE_CONNECTED") + objectTypeName_CLST);
                    isOk = false;
                }
                //Mask is Connected
                var Mask_IsConnected = checkIfFuncHasObjectType(nincxns, incxns, noutcxns, outcxns, OBJ_SCR);
                if (Mask_IsConnected) {
                    ko_output(modelName, modelGuid, getString("TEXT_RULE_3_LABEL"), getString("TEXT_RULE_3"), object_Name, getString("TEXT_RULE_3_OK_OBJTYPE_CONNECTED") + objectTypeName_SCR);
                    isOk = false;
                }
                //Requirement is Connected
                var Mask_IsConnected = checkIfFuncHasObjectType(nincxns, incxns, noutcxns, outcxns, OBJ_REQ);
                if (Mask_IsConnected) {
                    ko_output(modelName, modelGuid, getString("TEXT_RULE_3_LABEL"), getString("TEXT_RULE_3"), object_Name, getString("TEXT_RULE_3_OK_OBJTYPE_CONNECTED") + objectTypeName_REQ);
                    isOk = false;
                }
            } //EPC
        } //no ST_PRCS_IF
    }
    if (isOk) {
        ok_output(modelName, modelGuid, getString("TEXT_RULE_3_LABEL"), getString("TEXT_RULE_3"), "", "");
    }
}

function checkIfFuncHasObjectType(nincxns, incxns, noutcxns, outcxns, otype) {
    var inOK = false;
    var outOK = false
    if (nincxns >= 1) {
        for (var i = 0; i < incxns.length; i++) {
            var sourceOcc = incxns[i].SourceObjOcc();
            if (sourceOcc.ObjDef().TypeNum() == otype) { //at least one object type
                //return true;
                inOK = true;
            }
        } //for
    }
    if (noutcxns >= 1) {
        for (var i = 0; i < outcxns.length; i++) {
            var sourceOcc = outcxns[i].TargetObjOcc();
            if (sourceOcc.ObjDef().TypeNum() == otype) { //at least one object type
                // return true;
                outOK = true;
            }
        } //for
    }
    if (inOK == true || outOK == true) {
        return true;
    } else {
        return false;
    }
}

function checkIfFuncRoleisAtRight(nincxns, incxns, func_X) {
    if (nincxns >= 1) {
        for (var i = 0; i < incxns.length; i++) {
            var occSource = incxns[i].SourceObjOcc()
            var occSource_X = occSource.X();
            var occSource_Y = occSource.Y();
            if (occSource.SymbolNum() == Constants.ST_EMPL_TYPE) {
                if (occSource_X > func_X) {
                    return true;
                } else return false;
            }
        } //for
    }
    return null;
}
/**************************** Rule 3 ***********************/
/**************************** Rule 4 ***********************/
// The modelheader (status) object is used
function rule_4(model, allObjOccs, modelName, modelGuid) {
    var isHeaderExist = false;
    var oOcc = model.ObjOccListFilter([Constants.OT_POLICY]);
    for (var i = 0; i < oOcc.length; i++) {
        if (oOcc[i].SymbolNum() == SYM_HEADER) { //symbol header
            isHeaderExist = true;
        }
    } //for
    var isExistNadrizenyModel = false;
    var isExistModelVydanDokumentem = false;
    var isExistOrgJentoka = false;
    if (isHeaderExist) {
        var groups = model.getGroupings();
        for (var i = 0; i < groups.length; i++) {
            var members = groups[i].getMembers();
            for (var j = 0; j < members.length; j++) {
                var occ = members[j].getItemKind();
                if (occ == Constants.CID_OBJOCC) { //Constants.CID_OBJOCC 30002
                    if (members[j].SymbolNum() == Constants.ST_PRCS_IF) {
                        isExistNadrizenyModel = true;
                        g_headerObjsGUID.push(members[j].ObjDef().GUID());
                    }
                    if (members[j].SymbolNum() == SYM_DOCKNWLDG_HEADER) {
                        isExistModelVydanDokumentem = true;
                        g_headerObjsGUID.push(members[j].ObjDef().GUID());
                    }
                    if (members[j].SymbolNum() == 3) {
                        isExistOrgJentoka = true;
                        g_headerObjsGUID.push(members[j].ObjDef().GUID());
                    }
                }
            } //for
        } //for
    }
    if (isHeaderExist) {
        if (isExistNadrizenyModel && isExistModelVydanDokumentem && isExistOrgJentoka) {
            ok_output(modelName, modelGuid, getString("TEXT_RULE_4_LABEL"), getString("TEXT_RULE_4"), "", "");
        } else ko_output(modelName, modelGuid, getString("TEXT_RULE_4_LABEL"), getString("TEXT_RULE_4"), "", "");
    } else {
        ko_output(modelName, modelGuid, getString("TEXT_RULE_4_LABEL"), getString("TEXT_RULE_4"), "", "");
    }
}
/**************************** Rule 4 ***********************/
/**************************** Rule 5 ***********************/
//Check if the connector rules are used correctly
function rule_5(model, modelName, modelGuid) {
    var oeventoccs = model.ObjOccListFilter(Constants.OT_EVT); // Geschäftsobjekt (Event)
    var ofuncoccs = model.ObjOccListFilter(Constants.OT_FUNC);
    var oconnectoroccs = model.ObjOccListFilter(Constants.OT_RULE);
    var isOk = true;
    // Logical operators (connectors) - XOR, OR
    if (oconnectoroccs.length > 0) {
        oconnectoroccs = ArisData.sort(oconnectoroccs, Constants.SORT_TYPE, Constants.AT_NAME, Constants.SORT_NONE, g_loc);
        for (var r = 0; r < oconnectoroccs.length; r++) {
            var obeforobj = new Array();
            var obehindobj = new Array();
            var connector_Name = oconnectoroccs[r].SymbolName();
            var connector_Num = oconnectoroccs[r].SymbolNum();
            var nincxns = oconnectoroccs[r].InDegree(Constants.EDGES_STRUCTURE);
            var noutcxns = oconnectoroccs[r].OutDegree(Constants.EDGES_STRUCTURE);
            var incxns = oconnectoroccs[r].InEdges(Constants.EDGES_STRUCTURE);
            var outcxns = oconnectoroccs[r].OutEdges(Constants.EDGES_STRUCTURE);
            getobjbefor(oconnectoroccs[r], obeforobj);
            getobjbehind(oconnectoroccs[r], obehindobj);
            if (nincxns == 1 && noutcxns == 1) {
                var sourceObjOcc = obeforobj[0];
                var targetObjOcc = obehindobj[0];
                var sourceObjOccName = sourceObjOcc.ObjDef().Name(g_loc) + " [" + aFilter.SymbolName(sourceObjOcc.SymbolNum()) + "]";
                var targetObjOccName = targetObjOcc.ObjDef().Name(g_loc) + " [" + aFilter.SymbolName(targetObjOcc.SymbolNum()) + "]";
                ko_output(modelName, modelGuid, getString("TEXT_RULE_5_LABEL"), "Volně ložený operátor bez následného dělení", sourceObjOccName + "-" + connector_Name + "-" + targetObjOccName, "Volně ložený operátor bez následného dělení.");
                isOk = false;
            }
            if (nincxns > 0 && noutcxns == 0) {
                //TODO vypsat vsechny vstupy
                var sourceObjOcc = obeforobj[0];
                var sourceObjOccName = sourceObjOcc.ObjDef().Name(g_loc) + " [" + aFilter.SymbolName(sourceObjOcc.SymbolNum()) + "]";
                ko_output(modelName, modelGuid, getString("TEXT_RULE_5_LABEL"), "Dělení procesu bez použití operátoru", sourceObjOccName + "-" + connector_Name, "Dělení procesu bez použití operátoru.");
                isOk = false;
            }
            if (nincxns == 0 && noutcxns > 0) {
                //TODO vypsat vsechny vystupy
                var targetObjOcc = obehindobj[0];
                var targetObjOccName = targetObjOcc.ObjDef().Name(g_loc) + " [" + aFilter.SymbolName(targetObjOcc.SymbolNum()) + "]";
                ko_output(modelName, modelGuid, getString("TEXT_RULE_5_LABEL"), "Dělení procesu bez použití operátoru", connector_Name + "-" + targetObjOccName, "Dělení procesu bez použití operátoru.");
                isOk = false;
            }
            /* !rozdelovaci operatory! 1 vstup, 2> vystupu*/
            if (nincxns == 1 && noutcxns > 1) { //operator mergine incoming process flows (>1) into one outgoing branch (1)
                if (connector_Num == Symb_AND) { //AND
                    var isAllFunsOnInComming = true;
                    var sAllFunsOnInComming = "";
                    var event = 0;
                    var activity = 0;
                    for (var u = 0; u < obehindobj.length; u++) { //after operator
                        if (obehindobj[u].SymbolNum() == Constants.ST_FUNC) {
                            activity++;
                        }
                        if (obehindobj[u].SymbolNum() == Constants.ST_EV) {
                            event++;
                        }
                    }
                    var sourceObjOcc = obeforobj[0];
                    var sourceObjOccName = sourceObjOcc.ObjDef().Name(g_loc) + " [" + aFilter.SymbolName(sourceObjOcc.SymbolNum()) + "]";
                    if (sourceObjOcc.SymbolNum() == Constants.ST_EV && (event > 0 && activity > 0)) {
                        ko_output(modelName, modelGuid, getString("TEXT_RULE_5_LABEL"), formatstring1(getString("TEXT_RULE_5X_OPERATOR_ROZDELOVACI"), connector_Name), sourceObjOccName, /* formatstring1(getString("TEXT_RULE_5X_ROZDELOVACI_MIX"), sourceObjOccName)*/ "Není možné, aby v modelu nastaly 2 události po sobě.");
                        isOk = false;
                    }
                } //AND
                if (connector_Num == Symb_XOR || connector_Num == Symb_OR) { //XOR, OR
                    var isAllFunsOnInComming = true;
                    var sAllFunsOnInComming = "";
                    var event = 0;
                    var activity = 0;
                    for (var u = 0; u < obehindobj.length; u++) { //after operator
                        if (obehindobj[u].SymbolNum() == Constants.ST_FUNC) {
                            activity++;
                        }
                        if (obehindobj[u].SymbolNum() == Constants.ST_EV) {
                            event++;
                        }
                    }
                    var sourceObjOcc = obeforobj[0];
                    var sourceObjOccName = sourceObjOcc.ObjDef().Name(g_loc) + " [" + aFilter.SymbolName(sourceObjOcc.SymbolNum()) + "]";
                    // all funcs 
                    if (sourceObjOcc.SymbolNum() == Constants.ST_FUNC && (activity > 0 && event == 0)) {
                        ko_output(modelName, modelGuid, getString("TEXT_RULE_5_LABEL"), formatstring1(getString("TEXT_RULE_5X_OPERATOR_ROZDELOVACI"), connector_Name), sourceObjOccName, /*formatstring2(getString("TEXT_RULE_5X_ALLFUNCS"), sourceObjOccName, connector_Name)*/ "Po dělení v operátoru XOR/OR musí nastat 2 události, které vyjadřují stavy po dělení.");
                        isOk = false;
                    }
                    //udalost, 2 func
                    if (sourceObjOcc.SymbolNum() == Constants.ST_EV && (event == 0 && activity > 0)) {
                        ko_output(modelName, modelGuid, getString("TEXT_RULE_5_LABEL"), formatstring1(getString("TEXT_RULE_5X_OPERATOR_ROZDELOVACI"), connector_Name), sourceObjOccName, /*formatstring2(getString("TEXT_RULE_5X_ROZDELOVACI_EV_THEN_ALLFUNCS"), sourceObjOccName, connector_Name)*/ "Není možné dělit operátorem XOR/OR po události, protože událost není nositelem informace (podmínky) pro dělení.");
                        isOk = false;
                    }
                    //cinnost, mix
                    if (sourceObjOcc.SymbolNum() == Constants.ST_FUNC && (event > 0 && activity > 0)) {
                        ko_output(modelName, modelGuid, getString("TEXT_RULE_5_LABEL"), formatstring1(getString("TEXT_RULE_5X_OPERATOR_ROZDELOVACI"), connector_Name), sourceObjOccName, /*formatstring2(getString("TEXT_RULE_5X_ROZDELOVACI_MIX"), sourceObjOccName, connector_Name)*/ "Po dělení v operátoru XOR/OR musí nastat 2 události, které vyjadřují stavy po dělení.");
                        isOk = false;
                    }
                    //udalost, mix
                    if (sourceObjOcc.SymbolNum() == Constants.ST_EV && (event > 0 && activity > 0)) {
                        ko_output(modelName, modelGuid, getString("TEXT_RULE_5_LABEL"), formatstring1(getString("TEXT_RULE_5X_OPERATOR_ROZDELOVACI"), connector_Name), sourceObjOccName, /*formatstring2(getString("TEXT_RULE_5X_ROZDELOVACI_MIX"), sourceObjOccName, connector_Name) */ "3 chyby: Není možné dělit operátorem XOR/OR po události, protože událost není nositelem informace (podmínky) pro dělení. \n+ Po dělení v operátoru XOR/OR musí nastat 2 události, které vyjadřují stavy po dělení.\n+ Není možné, aby v modelu nastaly 2 události po sobě.");
                        isOk = false;
                    }
                } //XOR
            } //rozdelovaci
            /* !slucovaci operatory! 2 > vstupy, 1 vystup */
            if (nincxns > 1 && noutcxns == 1) { //operator mergine incoming process flows (>1) into one outgoing branch (1)
                if (connector_Num == Symb_XOR || connector_Num == Symb_OR) { //XOR, OR
                    var isAllFunsOnInComming = true;
                    var sAllFunsOnInComming = "";
                    var event = 0;
                    var activity = 0;
                    for (var u = 0; u < obeforobj.length; u++) { //after operator
                        if (obeforobj[u].SymbolNum() == Constants.ST_FUNC) {
                            sAllFunsOnInComming += obeforobj[u].ObjDef().Name(g_loc) + "; ";
                            activity++;
                        }
                        if (obeforobj[u].SymbolNum() == Constants.ST_EV) {
                            isAllFunsOnInComming = false;
                            event++;
                        }
                    }
                    var behindOcc = obehindobj[0];
                    var behindOccName = behindOcc.ObjDef().Name(g_loc) + " [" + aFilter.SymbolName(behindOcc.SymbolNum()) + "]";
                    // if(connector_Num == Symb_XOR ){
                    if (behindOcc.SymbolNum() == Constants.ST_EV && (activity > 0 && event == 0)) {
                        ko_output(modelName, modelGuid, getString("TEXT_RULE_5_LABEL"), formatstring1(getString("TEXT_RULE_5X_OPERATOR_SLUCOVANI"), connector_Name), behindOccName, /*formatstring2(getString("TEXT_RULE_5X_EVENT_ALLFUNCS"), behindOccName, connector_Name)*/ "Operátorem XOR/OR není možné slučovat 2 různé činnosti do jednoho stavu, protože tyto 2 různé činnosti nabývají 2 různých stavů.");
                        isOk = false;
                    }
                    //}
                    //mix, udalost
                    if (behindOcc.SymbolNum() == Constants.ST_EV && (event > 0 && activity > 0)) {
                        ko_output(modelName, modelGuid, getString("TEXT_RULE_5_LABEL"), formatstring1(getString("TEXT_RULE_5X_OPERATOR_SLUCOVANI"), connector_Name), behindOccName, /*formatstring1(getString("TEXT_RULE_5X_SLUCOVACI_MIX"), behindOccName)*/ "Není možné, aby v modelu nastaly 2 události po sobě.");
                        isOk = false;
                    }
                } //XOR, OR
                if (connector_Num == Symb_AND) { //AND
                    var isAllFunsOnInComming = true;
                    var sAllFunsOnInComming = "";
                    var event = 0;
                    var activity = 0;
                    for (var u = 0; u < obeforobj.length; u++) { //after operator
                        if (obeforobj[u].SymbolNum() == Constants.ST_FUNC) {
                            sAllFunsOnInComming += obeforobj[u].ObjDef().Name(g_loc) + "; ";
                            activity++;
                        }
                        if (obeforobj[u].SymbolNum() == Constants.ST_EV) {
                            isAllFunsOnInComming = false;
                            event++;
                        }
                    }
                    var behindOcc = obehindobj[0];
                    var behindOccName = behindOcc.ObjDef().Name(g_loc) + " [" + aFilter.SymbolName(behindOcc.SymbolNum()) + "]";
                    if (behindOcc.SymbolNum() == Constants.ST_EV && (event > 0 && activity > 0)) {
                        ko_output(modelName, modelGuid, getString("TEXT_RULE_5_LABEL"), formatstring1(getString("TEXT_RULE_5X_OPERATOR_SLUCOVANI"), connector_Name), behindOccName, formatstring1(getString("TEXT_RULE_5X_SLUCOVACI_MIX"), behindOccName) + " Není možné, aby v modelu nastaly 2 události po sobě.");
                        isOk = false;
                    }
                } //AND
            }
        }
    }

    ////rule 13 merged into rule 5
    // The Function & Event objects wit > 1 cxns
    var oeventoccs = model.ObjOccListFilter(Constants.OT_EVT); // Geschäftsobjekt (Event)
    var ofuncoccs = model.ObjOccListFilter(Constants.OT_FUNC);
    var oevenfuntoccs = oeventoccs.concat(ofuncoccs);

    var oObjOccs = ArisData.sort(oevenfuntoccs, Constants.SORT_TYPE, Constants.AT_NAME, Constants.SORT_NONE, g_loc);
    for (var i = 0; i < oObjOccs.length; i++) {
        if (oObjOccs[i].SymbolNum() != SYM_PROCESS_INTERFACE || oObjOccs[i].SymbolNum() != SYM_PROCESS_INTERFACE2) { ///excuse interfrace

            // var testName = oObjOccs[i].ObjDef().Name(g_loc);
            var noutcxns = oObjOccs[i].OutDegree(Constants.EDGES_STRUCTURE);
            var nincxns = oObjOccs[i].InDegree(Constants.EDGES_STRUCTURE);
            if (noutcxns > 1 || nincxns > 1) {

                //addional step
                var hasMultipleInterface = false;
                var cnxs = oObjOccs[i].Cxns(Constants.EDGES_OUT, Constants.EDGES_ALL);
                for (var c = 0; c < cnxs.length; c++) { // multi interface is allowed from funcs
                    var target = cnxs[c].getTarget();
                    if (target.SymbolNum() == SYM_PROCESS_INTERFACE || target.SymbolNum() == SYM_PROCESS_INTERFACE) {
                        hasMultipleInterface = true;
                    }
                }

                var cnxs = oObjOccs[i].Cxns(Constants.EDGES_IN, Constants.EDGES_ALL);
                for (var c = 0; c < cnxs.length; c++) { // multi interface is allowed from funcs
                    var source = cnxs[c].getSource();
                    // var sourceName = source.ObjDef().Name(-1);
                    // var targetName = target.ObjDef().Name(-1);
                    if (source.SymbolNum() == SYM_PROCESS_INTERFACE || source.SymbolNum() == SYM_PROCESS_INTERFACE) {
                        hasMultipleInterface = true;
                    }
                }

                if (!hasMultipleInterface) {
                    ko_output(modelName, modelGuid, getString("TEXT_RULE_5_LABEL"), getString("TEXT_RULE_13"), oObjOccs[i].ObjDef().Name(g_loc) + " [" + oObjOccs[i].SymbolName() + "] ", "");
                    isOk = false;
                }

            }
        }
        //  }
    } //for
    if (isOk) {
        ok_output(modelName, modelGuid, getString("TEXT_RULE_5_LABEL"), getString("TEXT_RULE_5"), "", "");
    }
}
// -------------------------------
// Subroutine GetObjBefor sem_check modul of the SemCheck SequenceToConnector and ConnectionNumberAtConnector which give the objects befor a rule without a name.
// oCurrConnectorOcc = current connector.
// oBeforObj = objects before the rule
// -------------------------------
function getobjbefor(ocurrconnectorocc, obeforobj) {
    oinedges = ocurrconnectorocc.InEdges(Constants.EDGES_STRUCTURE);
    if (oinedges.length > 0) {
        for (var i = 0; i < oinedges.length; i++) {
            if (oinedges[i].Cxn().SourceObjDef().TypeNum() == Constants.OT_RULE && oinedges[i].Cxn().SourceObjDef().Name(g_loc) == "") {
                obeforobj.push(oinedges[i].SourceObjOcc());
                getobjbefor(oinedges[i].SourceObjOcc(), obeforobj);
            } else {
                obeforobj.push(oinedges[i].SourceObjOcc());
            }
        }
    }
}
// -------------------------------
// Subroutine GetObjBehind sem_check modul of the SemCheck SequenceToConnector and ConnectionNumberAtConnector which give the objects behind a rule without a name.
// oCurrConnectorOcc = current connector.
// oBehindObj = objects behind the rule
// -------------------------------
function getobjbehind(ocurrconnectorocc, obehindobj) {
    var ooutedges = ocurrconnectorocc.OutEdges(Constants.EDGES_STRUCTURE);
    if (ooutedges.length > 0) {
        for (var i = 0; i < ooutedges.length; i++) {
            if (ooutedges[i].Cxn().TargetObjDef().TypeNum() == Constants.OT_RULE && ooutedges[i].Cxn().TargetObjDef().Name(g_loc) == "") {
                obehindobj.push(ooutedges[i].TargetObjOcc());
                getobjbehind(ooutedges[i].TargetObjOcc(), obehindobj);
            } else {
                obehindobj.push(ooutedges[i].TargetObjOcc());
            }
        }
    }
}
/**************************** Rule 5 ***********************/
/**************************** Rule 6 ***********************/
//Name of Modell is similar than name of superior objec
function rule_6(model, modelName, modelGuid) {
    var isOk = true;
    var modelName = model.Name(g_loc); // TODO chceck in currect lang
    var superiorObjects = model.SuperiorObjDefs();
    superiorObjects = ArisData.sort(superiorObjects, Constants.SORT_TYPE, Constants.AT_NAME, g_loc);
    for (var i = 0; i < superiorObjects.length; i++) {
        var superiorObject = superiorObjects[i];
        var superiorObjectName = superiorObject.Name(g_loc);
        var objType = superiorObject.TypeNum();
        if ([Constants.OT_FUNC].contains(objType) == true && modelName != superiorObjectName) {
            //ko_output(modelName, modelGuid, getString("TEXT_RULE_1_LABEL"), getString("TEXT_RULE_6"), superiorObjectName + " [" + aFilter.SymbolName(superiorObject.getDefaultSymbolNum()) + "] ", "");
            ko_output(modelName, modelGuid, getString("TEXT_RULE_1_LABEL"), getString("TEXT_RULE_6"), superiorObjectName, "");
            isOk = false;
        }
    } //for
    if (isOk) {
        ok_output(modelName, modelGuid, getString("TEXT_RULE_1_LABEL"), getString("TEXT_RULE_6"), "", "");
    }
}
/**************************** Rule 6 ***********************/
/**************************** Rule 7 ***********************/
//Description of objects maintained objects
function rule_7(model, modelName, modelGuid) {
    var isOk = true;
    var greenProcessOcc = 16777215;

    //TODO hack, improve it, assume that all occs has same symbol
    function getColorOfOcc(occsInModel) {
        for (var j = 0; j < occsInModel.length; j++) {
            return occsInModel[j].getFillColor();
        }
    }
    //TODO hack, improve it, assume that all occs has same symbol
    function getSymbolNum(occsInModel) {
        for (var j = 0; j < occsInModel.length; j++) {
            return occsInModel[j].SymbolNum();
        }
    }
    function getSymbolTypeName(occsInModel) {
        for (var j = 0; j < occsInModel.length; j++) {
            return occsInModel[j].SymbolName();
        }
    }

    allObjDefList = model.ObjDefList();
    allObjDefList = ArisData.sort(allObjDefList, Constants.SORT_TYPE, Constants.AT_NAME, Constants.SORT_NONE, g_loc);
    var filter = ArisData.ActiveFilter()
    for (var i = 0; i < allObjDefList.length; i++) {
        var objDef = allObjDefList[i];
        var occsInModel = objDef.OccListInModel(model);
        var fillColor = getColorOfOcc(occsInModel);
        var objOcc_symbolNum = getSymbolNum(occsInModel);
        var objOcc_symbolTypeName = getSymbolTypeName(occsInModel);

        var objectName = objDef.Attribute(Constants.AT_NAME, g_loc).getValue().replace("\n", "");
        var objectName_EN = objDef.Attribute(Constants.AT_NAME, g_loc_EN).getValue();
        var objectName_DE = objDef.Attribute(Constants.AT_NAME, g_loc_DE).getValue();
        //check attr Name
        if (objectName == "") {
            ko_output(modelName, modelGuid, getString("TEXT_RULE_7_LABEL"), getString("TEXT_RULE_7"), "DE: " + objectName_DE + "\nEN: " + objectName_EN + "\n[" + objDef.Type() + "](" + occsInModel.length + ")", getString("TEXT_RULE_7_NO_ATTR_TYPE") + aFilter.getItemTypeName(Constants.CID_ATTRDEF, Constants.AT_NAME) + " [GUID: " + allObjOccs[i].ObjDef().GUID() + "] ");
            isOk = false;
        }
        var g_model_typeNum = model.TypeNum();



        //if ([Constants.OT_EVT, Constants.OT_FUNC, Constants.OT_INFO_CARR, Constants.OT_PERS_TYPE, Constants.OT_REQUIREMENT].contains(objDef.TypeNum()) == true) {
        //Org. Unite
        if ([Constants.OT_ORG_UNIT].contains(objDef.TypeNum()) == true) {
            //check attr Číslo útvaru
            var nameObj_uniteNumber = objDef.Attribute(attr_uniteNumber, g_loc).getValue();
            if (!nameObj_uniteNumber.length() > 0) {
                ko_output(modelName, modelGuid, getString("TEXT_RULE_7_LABEL"), getString("TEXT_RULE_7"), objectName + " [" + objOcc_symbolTypeName + "]", getString("TEXT_RULE_7_NO_ATTR_TYPE") + aFilter.getItemTypeName(Constants.CID_ATTRDEF, attr_uniteNumber));
                isOk = false;
            }
            //check attr Číslo PM
            var nameObj_positionNumber = objDef.Attribute(attr_positionNumber, g_loc).getValue();
            if (!nameObj_positionNumber.length() > 0) {
                ko_output(modelName, modelGuid, getString("TEXT_RULE_7_LABEL"), getString("TEXT_RULE_7"), objectName + " [" + objOcc_symbolTypeName + "]", getString("TEXT_RULE_7_NO_ATTR_TYPE") + aFilter.getItemTypeName(Constants.CID_ATTRDEF, attr_positionNumber));
                isOk = false;
            }
            //check attr Vedoucí útvaru
            var nameObj_uniteManager = objDef.Attribute(attr_uniteManager, g_loc).getValue();
            if (!nameObj_uniteManager.length() > 0) {
                ko_output(modelName, modelGuid, getString("TEXT_RULE_7_LABEL"), getString("TEXT_RULE_7"), objectName + " [" + objOcc_symbolTypeName + "]", getString("TEXT_RULE_7_NO_ATTR_TYPE") + aFilter.getItemTypeName(Constants.CID_ATTRDEF, attr_uniteManager));
                isOk = false;
            }
            //check attr Vedoucí útvaru (jméno)
            var nameObj_uniteManagerName = objDef.Attribute(attr_uniteManagerName, g_loc).getValue();
            if (!nameObj_uniteManagerName.length() > 0) {
                ko_output(modelName, modelGuid, getString("TEXT_RULE_7_LABEL"), getString("TEXT_RULE_7"), objectName + " [" + objOcc_symbolTypeName + "]", getString("TEXT_RULE_7_NO_ATTR_TYPE") + aFilter.getItemTypeName(Constants.CID_ATTRDEF, attr_uniteManagerName));
                isOk = false;
            }
            //check attr Úroveň řízení
            var nameObj_uniteLevel = objDef.Attribute(attr_uniteLevel, g_loc).getValue();
            if (!nameObj_uniteLevel.length() > 0) {
                ko_output(modelName, modelGuid, getString("TEXT_RULE_7_LABEL"), getString("TEXT_RULE_7"), objectName + " [" + objOcc_symbolTypeName + "]", getString("TEXT_RULE_7_NO_ATTR_TYPE") + aFilter.getItemTypeName(Constants.CID_ATTRDEF, attr_uniteLevel));
                isOk = false;
            }
            //check attr DataLink Status RV202103
            var nameObj_DLStatus = objDef.Attribute(attr_DL_Status, g_loc).getValue();
            if (!nameObj_DLStatus.length() > 0) {
                ko_output(modelName, modelGuid, getString("TEXT_RULE_7_LABEL"), getString("TEXT_RULE_7"), objectName + " [" + objOcc_symbolTypeName + "]", getString("TEXT_RULE_7_NO_ATTR_TYPE") + aFilter.getItemTypeName(Constants.CID_ATTRDEF, attr_DL_Status));
                isOk = false;
            }
            //check attr DataLink ID
            var nameObj_DLId = objDef.Attribute(attr_DL_ID, g_loc).getValue();
            if (!nameObj_DLId.length() > 0) {
                ko_output(modelName, modelGuid, getString("TEXT_RULE_7_LABEL"), getString("TEXT_RULE_7"), objectName + " [" + objOcc_symbolTypeName + "]", getString("TEXT_RULE_7_NO_ATTR_TYPE") + aFilter.getItemTypeName(Constants.CID_ATTRDEF, attr_DL_ID));
                isOk = false;
            }
        }
        //EPC model type
        if (([Constants.MT_EEPC, Constants.MT_EEPC_COLUMN, Constants.MT_EEPC_INST, Constants.MT_EEPC_MAT, Constants.MT_EEPC_ROW, Constants.MT_EEPC_TAB, Constants.MT_EEPC_TAB_HORIZONTAL].contains(g_model_typeNum) == true)) { //EPC
            if ([Constants.OT_EVT, Constants.OT_RULE, Constants.OT_ORG_UNIT, Constants.OT_POS, Constants.OT_FUNC, Constants.OT_POLICY].contains(objDef.TypeNum()) == false) { //no desc for event, rest yes
                //check attr Description
                var nameObj_desc = objDef.Attribute(attr_Desc, g_loc).getValue();
                if (!nameObj_desc.length() > 0) {
                    ko_output(modelName, modelGuid, getString("TEXT_RULE_7_LABEL"), getString("TEXT_RULE_7"), objectName + " [" + objOcc_symbolTypeName + "]", getString("TEXT_RULE_7_NO_ATTR_TYPE") + aFilter.getItemTypeName(Constants.CID_ATTRDEF, attr_Desc));
                    isOk = false;
                }
            }
            //if ([Constants.OT_EVT, Constants.OT_FUNC, Constants.OT_INFO_CARR, Constants.OT_PERS_TYPE, Constants.OT_REQUIREMENT].contains(objDef.TypeNum()) == true) {
            if ([Constants.OT_FUNC].contains(objDef.TypeNum()) == true && (fillColor == symbolColor_Green)) {
                //Činnost kapitoly
                /* 8.12 kontrolovat cislo kapitoly u hnizda, ne u rozhrani*/
                
                var nameObj_desc = objDef.Attribute(attr_Desc, g_loc).getValue();
                if (nameObj_desc.length() == 0) {
                    ko_output(modelName, modelGuid, getString("TEXT_RULE_7_LABEL"), getString("TEXT_RULE_7"), objectName + " [" + objOcc_symbolTypeName + "]", getString("TEXT_RULE_7_NO_ATTR_TYPE") + aFilter.getItemTypeName(Constants.CID_ATTRDEF, attr_Desc));
                    isOk = false;
                }
                
                
                var nameObj_desc = objDef.Attribute(attr_chapter, g_loc).getValue();
                if (!nameObj_desc.length() > 0) {
                    ko_output(modelName, modelGuid, getString("TEXT_RULE_7_LABEL"), getString("TEXT_RULE_7"), objectName + " [" + objOcc_symbolTypeName + "]", getString("TEXT_RULE_7_NO_ATTR_TYPE") + aFilter.getItemTypeName(Constants.CID_ATTRDEF, attr_chapter));
                    isOk = false;
                }
            }
            if ([Constants.OT_POS].contains(objDef.TypeNum()) == true) {
                //check attr DataLink Status
                var nameObj_DLStatus = objDef.Attribute(attr_DL_Status, g_loc).getValue();
                if (!nameObj_DLStatus.length() > 0) {
                    ko_output(modelName, modelGuid, getString("TEXT_RULE_7_LABEL"), getString("TEXT_RULE_7"), objectName + " [" + objOcc_symbolTypeName + "]", getString("TEXT_RULE_7_NO_ATTR_TYPE") + aFilter.getItemTypeName(Constants.CID_ATTRDEF, attr_DL_Status));
                    isOk = false;
                }
                //check attr DataLink ID
                var nameObj_DLId = objDef.Attribute(attr_DL_ID, g_loc).getValue();
                if (!nameObj_DLId.length() > 0) {
                    ko_output(modelName, modelGuid, getString("TEXT_RULE_7_LABEL"), getString("TEXT_RULE_7"), objectName + " [" + objOcc_symbolTypeName + "]", getString("TEXT_RULE_7_NO_ATTR_TYPE") + aFilter.getItemTypeName(Constants.CID_ATTRDEF, attr_DL_ID));
                    isOk = false;
                }
                //check attr Číslo PM
                var nameObj_positionNumber = objDef.Attribute(attr_positionNumber, g_loc).getValue();
                if (!nameObj_positionNumber.length() > 0) {
                    ko_output(modelName, modelGuid, getString("TEXT_RULE_7_LABEL"), getString("TEXT_RULE_7"), objectName + " [" + objOcc_symbolTypeName + "]", getString("TEXT_RULE_7_NO_ATTR_TYPE") + aFilter.getItemTypeName(Constants.CID_ATTRDEF, attr_positionNumber));
                    isOk = false;
                }
                //check attr Misto Vykonu prace
                var attr_txt = objDef.Attribute(attr_MistoVykonuPrace, g_loc).getValue();
                if (!attr_txt.length() > 0) {
                    ko_output(modelName, modelGuid, getString("TEXT_RULE_7_LABEL"), getString("TEXT_RULE_7"), objectName + " [" +
                        objDef.Type() + "](" + occsInModel.length + ")", getString("TEXT_RULE_7_NO_ATTR_TYPE") + aFilter.getItemTypeName(Constants.CID_ATTRDEF, attr_MistoVykonuPrace));
                    isOk = false;
                }
                //check attr Nákladové středisko ID
                var attr_txt = objDef.Attribute(attr_NakladoveStrediskoID, g_loc).getValue();
                if (!attr_txt.length() > 0) {
                    ko_output(modelName, modelGuid, getString("TEXT_RULE_7_LABEL"), getString("TEXT_RULE_7"), objectName + " [" + objOcc_symbolTypeName + "]", getString("TEXT_RULE_7_NO_ATTR_TYPE") + aFilter.getItemTypeName(Constants.CID_ATTRDEF, attr_NakladoveStrediskoID));
                    isOk = false;
                }
            }
            //RV 8.12.
            if ([Constants.OT_PERS_TYPE].contains(objDef.TypeNum()) == true) {
                //check attr Typ Procesni Role
                var nameObj = objDef.Attribute(attr_TypProcesniRole, g_loc).getValue();
                if (nameObj.length() == 0) {
                    ko_output(modelName, modelGuid, getString("TEXT_RULE_7_LABEL"), getString("TEXT_RULE_7"), objectName + " [" + objOcc_symbolTypeName + "]", getString("TEXT_RULE_7_NO_ATTR_TYPE") + aFilter.getItemTypeName(Constants.CID_ATTRDEF, attr_TypProcesniRole));
                    isOk = false;
                }
            }
            if ([Constants.OT_DOC_KNWLDG].contains(objDef.TypeNum()) == true) {
                //check attr Nadpis 1
                var attr_txt = objDef.Attribute(attr_Title1, g_loc).getValue();
                if (!attr_txt.length() > 0) {
                    ko_output(modelName, modelGuid, getString("TEXT_RULE_7_LABEL"), getString("TEXT_RULE_7"), objectName + " [" + objOcc_symbolTypeName + "]", getString("TEXT_RULE_7_NO_ATTR_TYPE") + aFilter.getItemTypeName(Constants.CID_ATTRDEF, attr_Title1));
                    isOk = false;
                }
                //check attr Odkaz 1
                var attr_txt = objDef.Attribute(attr_Link1, g_loc).getValue();
                if (!attr_txt.length() > 0) {
                    ko_output(modelName, modelGuid, getString("TEXT_RULE_7_LABEL"), getString("TEXT_RULE_7"), objectName + " [" + objOcc_symbolTypeName + "]", getString("TEXT_RULE_7_NO_ATTR_TYPE") + aFilter.getItemTypeName(Constants.CID_ATTRDEF, attr_Link1));
                    isOk = false;
                }
            }
        } //EPC
        //VACD model type
        if (([Constants.MT_VAL_ADD_CHN_DGM].contains(g_model_typeNum) == true)) {
            if ([Constants.OT_EVT, Constants.OT_RULE, Constants.OT_ORG_UNIT, Constants.OT_FUNC, Constants.OT_POLICY].contains(objDef.TypeNum()) == false) { //no desc for event, rules, org. unit
                //check attr Description
                var nameObj_desc = objDef.Attribute(attr_Desc, g_loc).getValue();
                if (!nameObj_desc.length() > 0) {
                    ko_output(modelName, modelGuid, getString("TEXT_RULE_7_LABEL"), getString("TEXT_RULE_7"), objectName + " [" + objOcc_symbolTypeName + "]", getString("TEXT_RULE_7_NO_ATTR_TYPE") + aFilter.getItemTypeName(Constants.CID_ATTRDEF, attr_Desc));
                    isOk = false;
                }
            }
            //Process steps
            if ([Constants.OT_FUNC].contains(objDef.TypeNum()) == true && objOcc_symbolNum == SYM_Process_Step) {
                //check attr Chapter #
                var nameObj_chapter = objDef.Attribute(attr_chapter, g_loc).getValue();
                if (!nameObj_chapter.length() > 0) {
                    ko_output(modelName, modelGuid, getString("TEXT_RULE_7_LABEL"), getString("TEXT_RULE_7"), objectName + " [" + objOcc_symbolTypeName + "]", getString("TEXT_RULE_7_NO_ATTR_TYPE") + aFilter.getItemTypeName(Constants.CID_ATTRDEF, attr_chapter));
                    isOk = false;
                }
            }
            //Processes
            if ([Constants.OT_FUNC].contains(objDef.TypeNum()) == true && (objOcc_symbolNum == SYM_Process_WithHieararchy || objOcc_symbolNum == SYM_Process_WithoutHieararchy) && (fillColor == symbolColor_Green)) {
                //check attr Description
                var nameObj_desc = objDef.Attribute(attr_Desc, g_loc).getValue();
                if (!nameObj_desc.length() > 0) {
                    ko_output(modelName, modelGuid, getString("TEXT_RULE_7_LABEL"), getString("TEXT_RULE_7"), objectName + " [" + objOcc_symbolTypeName + "]", getString("TEXT_RULE_7_NO_ATTR_TYPE") + aFilter.getItemTypeName(Constants.CID_ATTRDEF, attr_Desc));
                    isOk = false;
                }
                //check attr Koordinátor DCŘ - jméno
                var nameObj_coordinatorDCR = objDef.Attribute(attr_coordinatorDCR, g_loc).getValue();
                if (!nameObj_coordinatorDCR.length() > 0) {
                    ko_output(modelName, modelGuid, getString("TEXT_RULE_7_LABEL"), getString("TEXT_RULE_7"), objectName + " [" + objOcc_symbolTypeName + "]", getString("TEXT_RULE_7_NO_ATTR_TYPE") + aFilter.getItemTypeName(Constants.CID_ATTRDEF, attr_coordinatorDCR));
                    isOk = false;
                }
                //check attr Level
                var nameObj_level = objDef.Attribute(attr_level, g_loc).getValue();
                if (!nameObj_level.length() > 0) {
                    ko_output(modelName, modelGuid, getString("TEXT_RULE_7_LABEL"), getString("TEXT_RULE_7"), objectName + " [" + objOcc_symbolTypeName + "]", getString("TEXT_RULE_7_NO_ATTR_TYPE") + aFilter.getItemTypeName(Constants.CID_ATTRDEF, attr_level));
                    isOk = false;
                }
                //check attr Členění procesu
                var nameObj_cleneni = objDef.Attribute(attr_cleneni, g_loc).getValue();
                if (!nameObj_cleneni.length() > 0) {
                    ko_output(modelName, modelGuid, getString("TEXT_RULE_7_LABEL"), getString("TEXT_RULE_7"), objectName + " [" + objOcc_symbolTypeName + "]", getString("TEXT_RULE_7_NO_ATTR_TYPE") + aFilter.getItemTypeName(Constants.CID_ATTRDEF, attr_cleneni));
                    isOk = false;
                }
                //check attr Title 1
                var nameObj_title1 = objDef.Attribute(attr_Title1, g_loc).getValue();
                if (!nameObj_title1.length() > 0) {
                    ko_output(modelName, modelGuid, getString("TEXT_RULE_7_LABEL"), getString("TEXT_RULE_7"), objectName + " [" + objOcc_symbolTypeName + "]", getString("TEXT_RULE_7_NO_ATTR_TYPE") + aFilter.getItemTypeName(Constants.CID_ATTRDEF, attr_Title1));
                    isOk = false;
                }
                //check attr Link 1
                var nameObj_link1 = objDef.Attribute(attr_Link1, g_loc).getValue();
                if (!nameObj_link1.length() > 0) {
                    ko_output(modelName, modelGuid, getString("TEXT_RULE_7_LABEL"), getString("TEXT_RULE_7"), objectName + " [" + objOcc_symbolTypeName + "]", getString("TEXT_RULE_7_NO_ATTR_TYPE") + aFilter.getItemTypeName(Constants.CID_ATTRDEF, attr_Link1));
                    isOk = false;
                }
                //check attr Vliv Procesu na JB a RO //202103
                var nameObj_vlivPrc = objDef.Attribute(attr_vlivPrc, g_loc).getValue();
                if (!nameObj_vlivPrc.length() > 0) {
                    ko_output(modelName, modelGuid, getString("TEXT_RULE_7_LABEL"), getString("TEXT_RULE_7"), objectName + " [" + objOcc_symbolTypeName + "]", getString("TEXT_RULE_7_NO_ATTR_TYPE") + aFilter.getItemTypeName(Constants.CID_ATTRDEF, attr_vlivPrc));
                    isOk = false;
                }
                //check attr Zdůvodnění (JB a RO) //202103
                var nameObj_zduvodneni = objDef.Attribute(attr_zduvodneni, g_loc).getValue();
                if (!nameObj_zduvodneni.length() > 0) {
                    ko_output(modelName, modelGuid, getString("TEXT_RULE_7_LABEL"), getString("TEXT_RULE_7"), objectName + " [" + objOcc_symbolTypeName + "]", getString("TEXT_RULE_7_NO_ATTR_TYPE") + aFilter.getItemTypeName(Constants.CID_ATTRDEF, attr_zduvodneni));
                    isOk = false;
                }
            }
            //Performance, KPI
           /* if ([Constants.OT_PERF].contains(objDef.TypeNum()) == true || [Constants.OT_KPI].contains(objDef.TypeNum()) == true) {
                //check attr Description
                var nameObj_desc = objDef.Attribute(attr_Desc, g_loc).getValue();
                if (!nameObj_desc.length() > 0) {
                    ko_output_warning(modelName, modelGuid, getString("TEXT_RULE_7_LABEL"), getString("TEXT_RULE_7"), objectName + " [" + objOcc_symbolTypeName + "]", getString("TEXT_RULE_7_NO_ATTR_TYPE") + aFilter.getItemTypeName(Constants.CID_ATTRDEF, attr_Desc));
                    isOk = false;
                }
            }*/
            //RV 8.12.
            if ([Constants.OT_KPI].contains(objDef.TypeNum()) == true) {
                //check attr Typ Ukazatele
                var nameObj = objDef.Attribute(attr_TypUkazatele, g_loc).getValue();
                if (nameObj.length() == 0) {
                    ko_output(modelName, modelGuid, getString("TEXT_RULE_7_LABEL"), getString("TEXT_RULE_7"), objectName + " [" + objOcc_symbolTypeName + "]", getString("TEXT_RULE_7_NO_ATTR_TYPE") + aFilter.getItemTypeName(Constants.CID_ATTRDEF, attr_TypUkazatele));
                    isOk = false;
                }
            }
        }
    } //for
    if (isOk) {
        ok_output(modelName, modelGuid, getString("TEXT_RULE_7_LABEL"), getString("TEXT_RULE_7"), "", "");
    }
    /*   var isOk = true;
        for (var i = 0; i < allObjDefList.length; i++) {
            var objDef = allObjDefList[i];
            if ([Constants.OT_EVT, Constants.OT_FUNC, Constants.OT_INFO_CARR, Constants.OT_PERS_TYPE, Constants.OT_REQUIREMENT].contains(objDef.TypeNum()) == true) {
                var nameObj = objDef.Name(g_loc);
                var nameObj_desc = objDef.Attribute(Constants.AT_DESC, g_loc).getValue();

                if (nameObj_desc.length() > 0) {
                    // ok_output2(getString("TEXT_RULE_7_LABEL"), getString("TEXT_RULE_7"), nameObj, getString("TEXT_VALUE") + nameObj_desc);
                } else {
                ko_output_warning(modelName, modelGuid, getString("TEXT_RULE_7_LABEL"), getString("TEXT_RULE_7"), nameObj +" [" +objDef.Type() + "] ", getString("TEXT_7_DETAILS"));
                    isOk = false;
                }
            }
        } //for
        if (isOk) {
            ok_output(modelName, modelGuid, getString("TEXT_RULE_7_LABEL"), getString("TEXT_RULE_7"), "", "");
        }
*/
}
/**************************** Rule 7 ***********************/
/**************************** Rule 8 ***********************/
//Process Interface sem_check
function rule_8(model, allObjOccs, modelName, modelGuid) {
    var isOk = true;
    var oobjoccs = null;
    model.BuildGraph(true);
    // check start nodes
    oobjoccs = model.StartNodeList();
    if (oobjoccs.length > 0) {
        oobjoccs = ArisData.sort(oobjoccs, Constants.SORT_TYPE, Constants.AT_NAME, Constants.SORT_NONE, g_loc);
        for (var j = 0; j < oobjoccs.length; j++) {
            if (!(oobjoccs[j].ObjDef().TypeNum() == Constants.OT_EVT || oobjoccs[j].SymbolNum() == SYM_PROCESS_INTERFACE || oobjoccs[j].SymbolNum() == SYM_PROCESS_INTERFACE2)) {
                var nameObject = oobjoccs[j].ObjDef().Name(g_loc);
                var objOcc_symbolNum = oobjoccs[j].SymbolNum();
                ko_output(modelName, modelGuid, getString("TEXT_RULE_8_LABEL"), getString("TEXT_RULE_8"), nameObject + " [" + aFilter.SymbolName(objOcc_symbolNum) + "] ", getString("TEXT_RULE_8A_1_START"));
                isOk = false;
            }
        }
    }
    // check end nodes
    var oobjoccs = model.EndNodeList();
    if (oobjoccs.length > 0) {
        oobjoccs = ArisData.sort(oobjoccs, Constants.SORT_TYPE, Constants.AT_NAME, Constants.SORT_NONE, g_loc);
        for (var j = 0; j < (oobjoccs.length - 1) + 1; j++) {
            if (!(oobjoccs[j].ObjDef().TypeNum() == Constants.OT_EVT || oobjoccs[j].SymbolNum() == SYM_PROCESS_INTERFACE || oobjoccs[j].SymbolNum() == SYM_PROCESS_INTERFACE2)) {
                var nameObject = oobjoccs[j].ObjDef().Name(g_loc);
                var objOcc_symbolNum = oobjoccs[j].SymbolNum();
                ko_output(modelName, modelGuid, getString("TEXT_RULE_8_LABEL"), getString("TEXT_RULE_8"), nameObject + " [" + aFilter.SymbolName(objOcc_symbolNum) + "] ", getString("TEXT_RULE_8_1_END"));
                isOk = false;
            }
        }
    }
    if (isOk) {
        ok_output(modelName, modelGuid, getString("TEXT_RULE_8_LABEL"), getString("TEXT_RULE_8"), "", "");
    }
}
/**************************** Rule 9 ***********************/
//   Check Start- and end nodes if it is Event or Process interface
/**************************** Rule 9 ***********************/
function rule_9(model, modelName, modelGuid) {
    var isOk = true;
    // Subrutine: Process interface is a copy of Process object comming form upper process level models.
    // The Level attr of this model has to < upper level process of Process interface
    /*          var ofuncoccs = model.ObjOccListFilter(Constants.OT_FUNC);

             if (ofuncoccs.length > 0) {

                 ofuncoccs = ArisData.sort(ofuncoccs, Constants.SORT_TYPE, Constants.AT_NAME, Constants.SORT_NONE, g_loc);
                 for (var i = 0; i < ofuncoccs.length; i++) {
                     var func = ofuncoccs[i];
                     var funcObjDef = ofuncoccs[i].ObjDef();
                     if (func.SymbolNum() == SYM_PROCESS_INTERFACE || func.SymbolNum() == SYM_PROCESS_INTERFACE2) { //interface only
                         var object_Name = funcObjDef.Name(g_loc);
                         var evaModelProcessLevel = model.Attribute(attr_processLevel, g_loc).getValue(); // Level attr of the current Model
                         var parentModelsList = getParentModels(model);
                        // parentModelsList = parentModelsList.ModelListFilter(Constants.MT_EEPC, Constants.MT_EEPC_ROW);
                         parentModelsList = ArisData.sort(parentModelsList, 1, g_loc); //List of all Parent models of the Process interface placed in EPC
                         if (parentModelsList.length > 0){
                             var parentModelProcessLevel = new Array();
                             for (var j = 0; j < parentModelsList.length; j++) {
                                 //if (([Constants.MT_EEPC, Constants.MT_EEPC_ROW].contains(parentModelsList) == true)) { //ToDo EPC only
                                     var temp = parentModelsList[j].Attribute(attr_processLevel, g_loc).getValue(); //Level attr of the all Process interface Parent Models (could be > 1)
                                     parentModelProcessLevel.push(temp);
                                 //}
                             }
                             var maxparentModelProcessLevel = Math.max.apply(null, parentModelProcessLevel); // Find Max value of Level attributes - get the lowest Parent level model of the Process interface
                             if (evaModelProcessLevel < maxparentModelProcessLevel){
                                 ko_output(modelName,modelGuid,getString("TEXT_RULE_9_LABEL"), getString("TEXT_RULE_9_PROCESS_INTERFACE_CHECK"), object_Name, getString("TEXT_RULE_9_PROCESS_INTERFACE_PROCESS_LEVEL") + ": " + maxparentModelProcessLevel);
                             }
                         }
                     else if (parentModelsList.length == 0 && evaModelProcessLevel != 0) {
                             ko_output(modelName,modelGuid,getString("TEXT_RULE_9_LABEL"), getString("TEXT_RULE_9_PROCESS_INTERFACE_CHECK"), object_Name, getString("TEXT_RULE_9_PROCESS_INTERFACE_NOEPC"));
                         }

                     } //if
                 } //for
             }
     */
    //Part 1- Subrutine: Process interface has occurence in assigned EPC model
    /*  var ofuncoccs = model.ObjOccListFilter(Constants.OT_FUNC);
       if (ofuncoccs.length > 0) {
           ofuncoccs = ArisData.sort(ofuncoccs, Constants.SORT_TYPE, Constants.AT_NAME, Constants.SORT_NONE, g_loc);
           for (var i = 0; i < ofuncoccs.length; i++) {
               var func = ofuncoccs[i];
               var funcObjDef = ofuncoccs[i].ObjDef();
               if (func.SymbolNum() == SYM_PROCESS_INTERFACE || func.SymbolNum() == SYM_PROCESS_INTERFACE2) { //interface
                   var object_Name = funcObjDef.Name(g_loc);
                   var assignedModelsEPC = funcObjDef.AssignedModels([Constants.MT_EEPC, Constants.MT_EEPC_COLUMN, Constants.MT_EEPC_INST, Constants.MT_EEPC_MAT, Constants.MT_EEPC_ROW, Constants.MT_EEPC_TAB, Constants.MT_EEPC_TAB_HORIZONTAL]);
                   var objOcc_symbolNum = func.SymbolNum();
                   if (assignedModelsEPC.length == 0) {
                       ko_output(modelName, modelGuid, getString("TEXT_RULE_9_LABEL"), getString("TEXT_RULE_9_PROCESS_INTERFACE_CHECK"), object_Name + " [" + aFilter.SymbolName(objOcc_symbolNum) + "] ", getString("TEXT_RULE_9_PROCESS_INTERFACE_NOEPC"));
                       isOk = false;
                   }
               } //if
           } //for
       }*/
    //part 2 check start process interfaces
    //Process interface is connected to an event of the predecessor or successor process
    model.BuildGraph(true);
    // check start nodes
    var oobjoccs = model.StartNodeList();
    if (oobjoccs.length > 0) {
        oobjoccs = ArisData.sort(oobjoccs, Constants.SORT_TYPE, Constants.AT_NAME, Constants.SORT_NONE, g_loc);
        for (var i = 0; i < oobjoccs.length; i++) {
            if ((oobjoccs[i].SymbolNum() == SYM_PROCESS_INTERFACE || oobjoccs[i].SymbolNum() == SYM_PROCESS_INTERFACE2)) {
                var prcs_if = oobjoccs[i].ObjDef();
                var nameObject = prcs_if.Name(g_loc);
                var objOcc_symbolNum = oobjoccs[i].SymbolNum();
                var assignedModelsEPC = prcs_if.AssignedModels([Constants.MT_EEPC, Constants.MT_EEPC_COLUMN, Constants.MT_EEPC_INST, Constants.MT_EEPC_MAT, Constants.MT_EEPC_ROW, Constants.MT_EEPC_TAB, Constants.MT_EEPC_TAB_HORIZONTAL]);
                var connectedEvent = new Array();
                connectedEvent = getConnectedEventFromStratPrcsInOfStartNode(oobjoccs[i]);
                if (assignedModelsEPC.length > 0 && connectedEvent != null) {
                    for (var j = 0; j < connectedEvent.length; j++) {
                        var connectedEventObjDef = connectedEvent[j].ObjDef();
                        var connectedEventName = connectedEventObjDef.Name(g_loc);
                        for (var m = 0; m < assignedModelsEPC.length; m++) {
                            var assignedModelEPC = assignedModelsEPC[m];
                            var occListModels_inEPC = connectedEventObjDef.OccListInModel(assignedModelEPC);
                            if (occListModels_inEPC.length > 0) {
                                // ok_output(getString("TEXT_RULE_9_LABEL"), getString("TEXT_RULE_9_DETAIL_START"), getString("TEXT_RULE_9_PRCIF") + nameObject, "\n" + getString("TEXT_RULE_9_EVENT") + connectedEventName + getString("TEXT_RULE_8_OK_EPCMODEL") + assignedModelEPC.Name(g_loc));
                            } else {
                                ko_output(modelName, modelGuid, getString("TEXT_RULE_9_LABEL"), getString("TEXT_RULE_9_DETAIL_START"), nameObject + " [" + aFilter.SymbolName(objOcc_symbolNum) + "] ", getString("TEXT_RULE_9_EVENT") + connectedEventName + getString("TEXT_RULE_9_NO_EPCMODELOCC_ENDEVT"))
                                isOk = false;
                            }
                        } //for
                    } //for
               // } else if (connectedEvent != null && assignedModelsEPC.length == 0) {
                    //RV interface without assigment is OK 
                    //var connectedEventName = "";
                    //if (connectedEvent.length > 0) {
                    //    connectedEventName = connectedEvent[0].ObjDef().Name(g_loc);
                    //}
                    // ko_output(modelName, modelGuid, getString("TEXT_RULE_9_LABEL"), getString("TEXT_RULE_9_DETAIL_START"), nameObject + " [" + aFilter.SymbolName(objOcc_symbolNum) + "] ", getString("TEXT_RULE_9_EVENT") + connectedEventName + getString("TEXT_RULE_9_NO_EPCMODELOCC_ENDEVT"))
                    // isOk = false;
                } else {
                    //  ko_output(modelName, modelGuid, getString("TEXT_RULE_9_LABEL"), getString("TEXT_RULE_9_DETAIL_END"), nameObject + " [" + aFilter.SymbolName(objOcc_symbolNum) + "] ", getString("TEXT_RULE_9_NO_FOLLOW_EVENT"));
                    //    isOk = false;
                }
            }
        }
    }
    //part 2 check end process interfaces
    //Process interface is connected to an event of the predecessor or successor process
    //model.BuildGraph(true);
    // check start nodes
    var oobjoccs = model.EndNodeList();
    if (oobjoccs.length > 0) {
        oobjoccs = ArisData.sort(oobjoccs, Constants.SORT_TYPE, Constants.AT_NAME, Constants.SORT_NONE, g_loc);
        for (var i = 0; i < oobjoccs.length; i++) {
            if ((oobjoccs[i].SymbolNum() == SYM_PROCESS_INTERFACE || oobjoccs[i].SymbolNum() == SYM_PROCESS_INTERFACE2)) {
                var prcs_if = oobjoccs[i].ObjDef();
                var nameObject = prcs_if.Name(g_loc);
                var objOcc_symbolNum = oobjoccs[i].SymbolNum();
                var assignedModelsEPC = prcs_if.AssignedModels([Constants.MT_EEPC, Constants.MT_EEPC_COLUMN, Constants.MT_EEPC_INST, Constants.MT_EEPC_MAT, Constants.MT_EEPC_ROW, Constants.MT_EEPC_TAB, Constants.MT_EEPC_TAB_HORIZONTAL]);
                var connectedEvent = new Array();
                connectedEvent = getConnectedEventFromEndPrcsInOfEndNode(oobjoccs[i]);
                if (connectedEvent != null && assignedModelsEPC.length > 0) {
                    for (var j = 0; j < connectedEvent.length; j++) {
                        var connectedEventObjDef = connectedEvent[j].ObjDef();
                        var connectedEventName = connectedEventObjDef.Name(g_loc);
                        for (var m = 0; m < assignedModelsEPC.length; m++) {
                            var assignedModelEPC = assignedModelsEPC[m];
                            var occListModels_inEPC = connectedEventObjDef.OccListInModel(assignedModelEPC);
                            if (occListModels_inEPC.length > 0) {
                                // ok_output(getString("TEXT_RULE_9_LABEL"), getString("TEXT_RULE_9_DETAIL_START"), getString("TEXT_RULE_9_PRCIF") + nameObject, "\n" + getString("TEXT_RULE_9_EVENT") + connectedEventName + getString("TEXT_RULE_8_OK_EPCMODEL") + assignedModelEPC.Name(g_loc));
                            } else {
                                ko_output(modelName, modelGuid, getString("TEXT_RULE_9_LABEL"), getString("TEXT_RULE_9_DETAIL_END"), nameObject + " [" + aFilter.SymbolName(objOcc_symbolNum) + "] ", getString("TEXT_RULE_9_EVENT") + connectedEventName + getString("TEXT_RULE_9_NO_EPCMODELOCC_STARTEVT"))
                                isOk = false;
                            }
                        } //for
                    } //for
                //} else if (connectedEvent != null && assignedModelsEPC.length == 0) {
                    //RV interface without assigment is OK 
                    // ko_output(modelName, modelGuid, getString("TEXT_RULE_9_LABEL"), getString("TEXT_RULE_9_DETAIL_START"), nameObject + " [" + aFilter.SymbolName(objOcc_symbolNum) + "] ", getString("TEXT_RULE_9_EVENT") + connectedEventName + getString("TEXT_RULE_9_NO_EPCMODELOCC_ENDEVT"))
                    // isOk = false;
                } else {
                    //  ko_output(modelName, modelGuid, getString("TEXT_RULE_9_LABEL"), getString("TEXT_RULE_9_DETAIL_END"), nameObject + " [" + aFilter.SymbolName(objOcc_symbolNum) + "] ", getString("TEXT_RULE_9_NO_FOLLOW_EVENT"))
                    //  isOk = false;
                }
            }
        }
    }
    if (isOk) {
        ok_output(modelName, modelGuid, getString("TEXT_RULE_9_LABEL"), getString("TEXT_RULE_9"), "", "");
    }
    //Start node Process interface is connected to an event
    function getConnectedEventFromStratPrcsInOfStartNode(procInterface) {
        var incxns = procInterface.InDegree(Constants.EDGES_STRUCTURE);
        var outcxs = procInterface.OutEdges(Constants.EDGES_STRUCTURE);
        var events_arr = new Array();
        if (incxns == 0 && outcxs.length > 0) {
            for (var i = 0; i < outcxs.length; i++) { //source objects
                var targetObjOcc = outcxs[i].TargetObjOcc();
                if (targetObjOcc.ObjDef().TypeNum() == Constants.OT_EVT) {
                    events_arr.push(targetObjOcc);
                }
                //if (incx.length == 0 && (targetObjOcc.SymbolNum() == Symb_XOR || targetObjOcc.SymbolNum() == Symb_OR || targetObjOcc.SymbolNum() == Symb_AND)) {
                if (targetObjOcc.ObjDef().TypeNum() == Constants.OT_RULE) {
                    var ruleObj = targetObjOcc;
                    // var incx = ruleObj.InEdges(Constants.EDGES_STRUCTURE);
                    var noutcxns = ruleObj.OutDegree(Constants.EDGES_STRUCTURE);
                    var outcxns = ruleObj.OutEdges(Constants.EDGES_STRUCTURE);
                    if (noutcxns >= 1) {
                        for (var k = 0; k < outcxns.length; k++) { //after operator
                            var outcxn = outcxns[k];
                            var targetObjcOcc = outcxn.TargetObjOcc();
                            if (targetObjcOcc.ObjDef().TypeNum() == Constants.OT_EVT) {
                                events_arr.push(targetOjOcc);
                            }
                        } //for
                    }
                } //if
            } //for
        }
        if (events_arr.length > 0) return events_arr;
    }
    //End node Process interface is connected to an event
    function getConnectedEventFromEndPrcsInOfEndNode(procInterface) {
        var incxns = procInterface.InEdges(Constants.EDGES_STRUCTURE);
        var outncxs = procInterface.OutDegree(Constants.EDGES_STRUCTURE);
        var events_arr = new Array();
        if (incxns.length > 0 && outncxs == 0) {
            for (var i = 0; i < incxns.length; i++) { //source objects
                var sourceObjOcc = incxns[i].SourceObjOcc();
                if (sourceObjOcc.ObjDef().TypeNum() == Constants.OT_EVT) {
                    events_arr.push(sourceObjOcc);
                }
                //if (incx.length > 0 && (sourceObjOcc.SymbolNum() == Symb_XOR || sourceObjOcc.SymbolNum() == Symb_OR || sourceObjOcc.SymbolNum() == Symb_AND)) {
                if (sourceObjOcc.ObjDef().TypeNum() == Constants.OT_RULE) {
                    var ruleObj = sourceObjOcc;
                    // var incx = ruleObj.InEdges(Constants.EDGES_STRUCTURE);
                    var nincxns = ruleObj.InDegree(Constants.EDGES_STRUCTURE);
                    var incxns = ruleObj.InEdges(Constants.EDGES_STRUCTURE);
                    if (nincxns >= 1) {
                        for (var j = 0; j < incxns.length; j++) { //after operator
                            var incxn = incxns[j];
                            var sourceObjcOcc = incxn.SourceObjOcc();
                            if (sourceObjcOcc.ObjDef().TypeNum() == Constants.OT_EVT) {
                                events_arr.push(sourceObjOcc);
                            }
                        } //for
                    }
                } //if
            } //for
        }
        if (events_arr.length > 0) return events_arr;
    }
}
/*****************************************************************************************************************
 * Ermittelt alle übergeordneten Modelle eines Modells.
 *
 * @param Modell
 *
 * @return Liste mit übergeordneten Modellen
 *****************************************************************************************************************/
function getParentModels(oModel) {
    var oParentModels = new Array()
    var oSuperObjDefs = oModel.SuperiorObjDefs();
    // Erstellen der Liste mit Ausprägungen des übergeordenten Objektes
    for (var i = 0; i < oSuperObjDefs.length; i++) {
        var oSuperObjDef = oSuperObjDefs[i];
        var oSuperOccs = oSuperObjDef.OccList();
        for (var j = 0; j < oSuperOccs.length; j++) {
            var oSuperOcc = oSuperOccs[j];
            if (!(isProcessInterface(oSuperOcc.SymbolNum()) || isStatus(oSuperOcc.SymbolNum()))) {
                var oCurrentModel = oSuperOcc.Model();
                if (!(oModel.IsEqual(oCurrentModel) || oCurrentModel.TypeNum() == Constants.MT_FUNC_ALLOC_DGM)) {
                    oParentModels.push(oCurrentModel);
                }
            }
        }
    }
    return ArisData.Unique(oParentModels);
}
/********************************************************************************
 * Prüft, ob es sich bei einem Symbol um eine Statusobjekt handelt.
 *
 * @param Symbol
 *
 * @return true, wenn es sich um eine Statusobjekt handelt, ansonsten false.
 **********************************************************************************/
function isStatus(iSymbol) {
    var bFunctionResult = false;
    if (iSymbol == SYM_STAT) {
        bFunctionResult = true;
    }
    return bFunctionResult;
}
/*****************************************************************************************************************
 * Prüft, ob es sich bei einem Symbol um eine Prozessschnittstelle handelt.
 *
 * @param Symbol
 *
 * @return true, wenn es sich um eine Processschnittstelle handelt, ansonsten false.
 *****************************************************************************************************************/
function isProcessInterface(iSymbol) {
    var bFunctionResult = false;
    if (iSymbol == SYM_PROCESS_INTERFACE || iSymbol == SYM_PROCESS_INTERFACE2) {
        bFunctionResult = true;
    }
    return bFunctionResult;
}
/**************************** Rule 9 **********************/
/**************************** Rule 10 **********************/
//All remaining events are definition copies -
//it means that Eventes without Process interface (I/O) shall have no more 1 occ in the same and other model(s)
/**
 *  returns TRUE if it is start event
 */
function isStartEvent1(p_oEvent) {
    if (p_oEvent == null) return false;
    var incx = p_oEvent.InEdges(Constants.EDGES_STRUCTURE);
    var outcx = p_oEvent.OutEdges(Constants.EDGES_STRUCTURE);
    if ((incx.length == 0 && outcx.length > 0) || (incx.length > 0 && incx[0].SourceObjOcc().OrgSymbolNum() == SYM_PROCESS_INTERFACE) || (incx.length > 0 && incx[0].SourceObjOcc().OrgSymbolNum() == SYM_PROCESS_INTERFACE2)) return true;
    return false;
}
/**
 *  returns TRUE if it is end event
 */
function isEndEvent1(p_oEvent) {
    if (p_oEvent == null) return false;
    var incx = p_oEvent.InEdges(Constants.EDGES_STRUCTURE);
    var outcx = p_oEvent.OutEdges(Constants.EDGES_STRUCTURE);
    if ((incx.length > 0 && outcx.length == 0) || (outcx.length > 0 && outcx[0].TargetObjOcc().OrgSymbolNum() == SYM_PROCESS_INTERFACE) || (outcx.length > 0 && outcx[0].TargetObjOcc().OrgSymbolNum() == SYM_PROCESS_INTERFACE2)) return true;
    return false;
}

function rule_10(allObjOccs, model, modelName, modelGuid) {
    var isOk = true;
    var events = new Array();
    for (var i = 0; i < allObjOccs.length; i++) {
        var oOcc = allObjOccs[i];
        var objDef = oOcc.ObjDef();
        if (objDef.TypeNum() == Constants.OT_EVT) {
            if (oOcc.SymbolNum() != Constants.ST_PRCS_IF) {
                var nameEvent = objDef.Name(g_loc);
                var isStartEvent = isStartEvent1(oOcc);
                var isEndtEvent = isEndEvent1(oOcc);
                if (isStartEvent == false && isEndtEvent == false) {
                    events.push(oOcc.ObjDef())
                }
            }
        }
    }
    if (events.length > 0) {
        events = ArisData.Unique(events);
        for (var j = 0; j < events.length; j++) {
            var nameEvent = events[j].Name(g_loc);
            var all_occs_inModel = events[j].OccListInModel(model);
            all_occs_inModel = ArisData.sort(all_occs_inModel, Constants.AT_NAME, g_loc);
            //continue;
            if (all_occs_inModel.length > 1) {
                for (var k = 0; k < all_occs_inModel.length; k++) {
                    var modelName = all_occs_inModel[k].Model().Name(g_loc);
                    var objOcc_symbolNum = all_occs_inModel[k].SymbolNum();
                    ko_output(modelName, modelGuid, getString("TEXT_RULE_10_LABEL"), getString("TEXT_RULE_10"), nameEvent + " [" + aFilter.SymbolName(objOcc_symbolNum) + "] ", getString("TEXT_RULE_10_NUMBER") + '" ' + modelName + '": ' + all_occs_inModel.length);
                    isOk = false;
                } //for
            }
            /* else {
                                ok_output(getString("TEXT_RULE_10_LABEL"), getString("TEXT_RULE_10"), nameEvent, "");
                            } */
        } //for
    }
    if (isOk) {
        ok_output(modelName, modelGuid, getString("TEXT_RULE_10_LABEL"), getString("TEXT_RULE_10"), "", "");
    }
}
/**************************** Rule 10 ***********************/
/**************************** Rule 11 ***********************/
//Check mandatory modell attributes fullfillment
function rule_11(model, modelName, modelGuid) {
    var isOk = true;
    var modelName = model.Name(g_loc); //Model name
    //Model name
    if (!model.Attribute(Constants.AT_NAME, g_loc).IsMaintained()) {
        ko_output(modelName, modelGuid, getString("TEXT_RULE_11_LABEL"), getString("TEXT_RULE_11"), "", getString("TEXT_ATTNAME") + aFilter.AttrTypeName(Constants.AT_NAME) + ", " + getString("TEXT_VALUE") + "N/A");
        isOk = false;
    }
    //EPC model type
    if (([Constants.MT_EEPC, Constants.MT_EEPC_COLUMN, Constants.MT_EEPC_INST, Constants.MT_EEPC_MAT, Constants.MT_EEPC_ROW, Constants.MT_EEPC_TAB, Constants.MT_EEPC_TAB_HORIZONTAL].contains(g_model_typeNum) == true)) { //EPC
        //Model attr check: Účel PP, Rozsah závaznosti PP, Mail na koordinátora, Model vydán dokumentem 
        /* if (!model.Attribute(attr_purposePP, g_loc).IsMaintained()) {
             //ko_output(modelName, modelGuid, getString("TEXT_RULE_11_LABEL"), getString("TEXT_RULE_11"), "", getString("TEXT_RULE_7_NO_ATTR_TYPE") + aFilter.getItemTypeName(Constants.CID_ATTRDEF, attr_purposePP) + ", " + getString("TEXT_VALUE") + "N/A");
             ko_output(modelName, modelGuid, getString("TEXT_RULE_11_LABEL"), getString("TEXT_RULE_11"), "", getString("TEXT_RULE_7_NO_ATTR_TYPE") + aFilter.getItemTypeName(Constants.CID_ATTRDEF, attr_purposePP));
             isOk = false;
         }
         if (!model.Attribute(attr_rozsahZavaznostiPP, g_loc).IsMaintained()) {
             ko_output(modelName, modelGuid, getString("TEXT_RULE_11_LABEL"), getString("TEXT_RULE_11"), "", getString("TEXT_RULE_7_NO_ATTR_TYPE") + aFilter.getItemTypeName(Constants.CID_ATTRDEF, attr_rozsahZavaznostiPP));
             isOk = false;
         }
         if (!model.Attribute(attr_coordinatorMail, g_loc).IsMaintained()) {
             ko_output(modelName, modelGuid, getString("TEXT_RULE_11_LABEL"), getString("TEXT_RULE_11"), "", getString("TEXT_RULE_7_NO_ATTR_TYPE") + aFilter.getItemTypeName(Constants.CID_ATTRDEF, attr_coordinatorMail));
             isOk = false;
         }*/
        if (!model.Attribute(attr_issuedByDoc, g_loc).IsMaintained()) {
            ko_output(modelName, modelGuid, getString("TEXT_RULE_11_LABEL"), getString("TEXT_RULE_11"), "", getString("TEXT_RULE_7_NO_ATTR_TYPE") + aFilter.getItemTypeName(Constants.CID_ATTRDEF, attr_issuedByDoc));
            isOk = false;
        }
    }
    //VACD model type
    if (([Constants.MT_VAL_ADD_CHN_DGM].contains(g_model_typeNum) == true)) {
        //Model attr check: Účel SM, Rozsah závaznosti SM, Mail na koordinátora, Model vydán dokumentem
        /* if (!model.Attribute(attr_purposeSM, g_loc).IsMaintained()) {
             ko_output(modelName, modelGuid, getString("TEXT_RULE_11_LABEL"), getString("TEXT_RULE_11"), "", getString("TEXT_RULE_7_NO_ATTR_TYPE") + aFilter.getItemTypeName(Constants.CID_ATTRDEF, attr_purposeSM));
             isOk = false;
         }
         if (!model.Attribute(attr_rozsahZavaznostiSM, g_loc).IsMaintained()) {
             ko_output(modelName, modelGuid, getString("TEXT_RULE_11_LABEL"), getString("TEXT_RULE_11"), "", getString("TEXT_RULE_7_NO_ATTR_TYPE") + aFilter.getItemTypeName(Constants.CID_ATTRDEF, attr_rozsahZavaznostiSM));
             isOk = false;
         }
         if (!model.Attribute(attr_coordinatorMail, g_loc).IsMaintained()) {
             ko_output(modelName, modelGuid, getString("TEXT_RULE_11_LABEL"), getString("TEXT_RULE_11"), "", getString("TEXT_RULE_7_NO_ATTR_TYPE") + aFilter.getItemTypeName(Constants.CID_ATTRDEF, attr_coordinatorMail));
             isOk = false;
         }*/
        if (!model.Attribute(attr_issuedByDoc, g_loc).IsMaintained()) {
            ko_output(modelName, modelGuid, getString("TEXT_RULE_11_LABEL"), getString("TEXT_RULE_11"), "", getString("TEXT_RULE_7_NO_ATTR_TYPE") + aFilter.getItemTypeName(Constants.CID_ATTRDEF, attr_issuedByDoc));
            isOk = false;
        }
    }
    if (isOk) {
        ok_output(modelName, modelGuid, getString("TEXT_RULE_11_LABEL"), getString("TEXT_RULE_11"), "", "");
    }
}
/**************************** Rule 11 ***********************/
/**************************** Rule 12 ***********************/
// The objects without cxn
function rule_12(model, allObjOccs, modelName, modelGuid) {
    var isOk = true;

    function hasRowInterface(oOcc) {
        if (VLaneList.length > 1) {
            for (var v = 0; v < VLaneList.length; v++) {
                if (VLaneList[v].Start() == 0) { //first column
                    for (var h = 0; h < HLaneList.length; h++) {
                        /* if (oOcc.ObjDef().TypeNum() == Constants.OT_INFO_CARR) { //added - doc can be only in frist row
                            if (HLaneList[0].IsObjOccOfLane(oOcc)) {
                                return true;
                            } else return false;
                        } */
                        if (([OBJ_GRP, OBJ_ROL, OBJ_ORG].contains(oOcc.ObjDef().TypeNum()) == true)) { //find role
                            var hasInterface = false;
                            if (HLaneList[h].IsObjOccOfLane(oOcc)) { //check if role exist in first column and xrow
                                if (!VLaneList[0].IsObjOccOfLane(oOcc)) { //occ is not in first row
                                    return false;
                                }
                                for (var i = 0; i < allObjOccs.length; i++) {
                                    if (([SYM_PROCESS_INTERFACE, SYM_PROCESS_INTERFACE2].contains(allObjOccs[i].SymbolNum()) == true)) { //find interface
                                        if (HLaneList[h].IsObjOccOfLane(allObjOccs[i]) && VLaneList[v].IsObjOccOfLane(allObjOccs[i]) == false) { //check if interface exist in same row
                                            //  hasInterface = true;
                                            return true;
                                        }
                                    }
                                } //if   
                            }; //for 
                        } else return false;
                    }
                } //end first column
            }
        }
        return false;
    }
    if (([Constants.MT_EEPC_ROW, Constants.MT_EEPC_TAB_HORIZONTAL, Constants.MT_EEPC_COLUMN].contains(model.TypeNum()) == true)) { //Constants.MT_EEPC_TAB_HORIZONTAL,  Constants.MT_EEPC_COLUMN
        var VLaneList = model.GetLanes(Constants.LANE_VERTICAL);
        var HLaneList = model.GetLanes(Constants.LANE_HORIZONTAL);
        for (var i = 0; i < allObjOccs.length; i++) {
            var objDef = allObjOccs[i].ObjDef();
            var objDefName = allObjOccs[i].ObjDef().Name(-1);
            var objOcc_symbolNum = allObjOccs[i].SymbolNum();
            //  if (allObjOccs[i].SymbolNum() != SYM_STAT && objDef.TypeNum() != Constants.OT_INFO_CARR) { //exclude symbol status & Documents - ToDo: exclude Docs maintained only by Enter model attribute macro
            if ([Constants.ST_OPR_OR_1, Constants.ST_OPR_XOR_1, SYM_HEADER, SYM_DOCKNWLDG_HEADER, SYM_PROCESS_INTERFACE].contains(objOcc_symbolNum) == false) { //no desc for event, reset yes
                if (g_headerObjsGUID.contains(objDef.GUID()) == false) { //exclude objects from header
                    if (objOcc_symbolNum != SYM_HEADER && objOcc_symbolNum != SYM_DOCKNWLDG_HEADER && objOcc_symbolNum != SYM_PROCESS_INTERFACE && objDef.TypeNum() != OBJ_ORG) { //exclude header objects
                        var noutcxns = allObjOccs[i].OutDegree(Constants.EDGES_NONSTRUCTURE);
                        var nincxns = allObjOccs[i].InDegree(Constants.EDGES_NONSTRUCTURE);
                        if (noutcxns == 0 && nincxns == 0) {
                            if (!hasRowInterface(allObjOccs[i])) {
                                ko_output(modelName, modelGuid, getString("TEXT_RULE_12_LABEL"), getString("TEXT_RULE_12"), objDef.Name(g_loc) + " [" + aFilter.SymbolName(objOcc_symbolNum) + "] ", "");
                                isOk = false;
                            }
                        }
                        //RV if Proudc/Service has only cxn to interface and no cxn to fun error
                        /* if (objOcc_symbolNum == Constants.ST_CLST) { //Cluster EPC
                             if (noutcxns == 0 && nincxns == 1) {
                                 ko_output(modelName, modelGuid, getString("TEXT_RULE_12_LABEL"), getString("TEXT_RULE_12"), allObjOccs[i].ObjDef().Name(g_loc) + " [" + aFilter.SymbolName(objOcc_symbolNum) + "] ", "");
                                 isOk = false;
                             }
                         }*/
                    }
                }
            }
        }
    } else { //no swimlanes
        for (var i = 0; i < allObjOccs.length; i++) {
            var objDef = allObjOccs[i].ObjDef();
            var objDefName = allObjOccs[i].ObjDef().Name(g_loc);
            //ko_output_warning(modelName, modelGuid, getString("TEXT_RULE_12_LABEL"), getString("TEXT_RULE_12"), allObjOccs[i].ObjDef().Name(g_loc) , "");
            var objOcc_symbolNum = allObjOccs[i].SymbolNum();
            // var noutcxns = allObjOccs[i].OutDegree(Constants.EDGES_NONSTRUCTURE); //only visible cnx
            // var nincxns = allObjOccs[i].InDegree(Constants.EDGES_NONSTRUCTURE);
            //RV 20211213, all types of cnxs
            var noutcxns = allObjOccs[i].OutDegree(Constants.EDGES_ALL); //only visible cnx
            var nincxns = allObjOccs[i].InDegree(Constants.EDGES_ALL);
            //RV 20211213 - MTPH Vykon has one input, one output
            if ([Constants.ST_PERFORM].contains(objOcc_symbolNum) == true) {
                /* if (!(noutcxns == 1 && nincxns == 1)) {
                     ko_output(modelName, modelGuid, getString("TEXT_RULE_12_LABEL"), getString("TEXT_RULE_12"), allObjOccs[i].ObjDef().Name(g_loc) + " [" + aFilter.SymbolName(objOcc_symbolNum) + "] ", getString("TEXT_RULE_12_CNX_ONEIN_ONEOUT"));
                     isOk = false;
                 }*/
                var funcs = allObjOccs[i].getConnectedObjOccs(Constants.ST_VAL_ADD_CHN_SML_2);
                var isGreenFun = false;
                for (var j = 0; j < funcs.length; j++) {
                    if (funcs[j].getColor() == symbolColor_Green) {
                        isGreenFun = true;
                    }
                }
                if (funcs.length == 0) {
                    ko_output(modelName, modelGuid, getString("TEXT_RULE_12_LABEL"), getString("TEXT_RULE_12"), allObjOccs[i].ObjDef().Name(g_loc) + " [" + aFilter.SymbolName(objOcc_symbolNum) + "] ", getString("TEXT_RULE_12_MTPH_VYKON_NOCNX_FUNC"));
                    isOk = false;
                } else if (funcs.length > 0 && isGreenFun == false) {
                    ko_output(modelName, modelGuid, getString("TEXT_RULE_12_LABEL"), getString("TEXT_RULE_12"), allObjOccs[i].ObjDef().Name(g_loc) + " [" + aFilter.SymbolName(objOcc_symbolNum) + "] ", getString("TEXT_RULE_12_MTPH_VYKON_NOCNX_FUNC"));
                    isOk = false;
                }
            }
            //RV 20211213 - EPC Cluseter has one output
            if ([Constants.ST_CLST].contains(objOcc_symbolNum) == true) {
                var func = allObjOccs[i].getConnectedObjOccs(Constants.ST_FUNC);
                if (func.length == 0) {
                    ko_output(modelName, modelGuid, getString("TEXT_RULE_12_LABEL"), getString("TEXT_RULE_12"), allObjOccs[i].ObjDef().Name(g_loc) + " [" + aFilter.SymbolName(objOcc_symbolNum) + "] ", getString("TEXT_RULE_12_EPC_CLUSTER_NOCNX_FUNC"));
                    isOk = false;
                }
            }
            if ([Constants.ST_PERFORM, Constants.ST_CLST, Constants.ST_OPR_OR_1, Constants.ST_OPR_XOR_1, SYM_HEADER, SYM_DOCKNWLDG_HEADER, SYM_PROCESS_INTERFACE].contains(objOcc_symbolNum) == false) { //no desc for event, reset yes
                if (g_headerObjsGUID.contains(objDef.GUID()) == false) { //exclude objects from header
                    //if (objOcc_symbolNum != SYM_HEADER && objOcc_symbolNum != SYM_DOCKNWLDG_HEADER && objOcc_symbolNum != SYM_PROCESS_INTERFACE && objDef.TypeNum() != OBJ_ORG) { //exclude header objects
                    //  var noutcxns = allObjOccs[i].OutDegree(Constants.EDGES_ALL);
                    //  var nincxns = allObjOccs[i].InDegree(Constants.EDGES_ALL);
                    if (noutcxns == 0 && nincxns == 0) {
                        ko_output(modelName, modelGuid, getString("TEXT_RULE_12_LABEL"), getString("TEXT_RULE_12"), allObjOccs[i].ObjDef().Name(g_loc) + " [" + aFilter.SymbolName(objOcc_symbolNum) + "] ", getString("TEXT_RULE_12_NOCNX_DETAIL"));
                        isOk = false;
                    }
                }
            }
        } //for       
    }
    if (isOk) {
        ok_output(modelName, modelGuid, getString("TEXT_RULE_12_LABEL"), getString("TEXT_RULE_12"), "", "");
    }
}
/**************************** Rule 12 ***********************/
/**************************** Rule 13 ***********************/
// The Function & Event objects wit > 1 cxns
function rule_13(model, modelName, modelGuid) {
    /*  var isOk = true;
      var oeventoccs = model.ObjOccListFilter(Constants.OT_EVT); // Geschäftsobjekt (Event)
      var ofuncoccs = model.ObjOccListFilter(Constants.OT_FUNC);
      var oevenfuntoccs = oeventoccs.concat(ofuncoccs);
      var oOcc = ArisData.sort(oevenfuntoccs, Constants.SORT_TYPE, Constants.AT_NAME, Constants.SORT_NONE, g_loc);
      for (var i = 0; i < oOcc.length; i++) {

          var noutcxns = oOcc[i].OutDegree(Constants.EDGES_STRUCTURE);
          var nincxns = oOcc[i].InDegree(Constants.EDGES_STRUCTURE);
 
          if (noutcxns > 1 || nincxns > 1) {
              ko_output(modelName, modelGuid, getString("TEXT_RULE_13_LABEL"), getString("TEXT_RULE_13"), oOcc[i].ObjDef().Name(g_loc) + " [" + oOcc[i].SymbolName() + "] ", "");
              isOk = false;
          }
          //  }
      } //for

      if (isOk) {
          ok_output(modelName, modelGuid, getString("TEXT_RULE_13_LABEL"), getString("TEXT_RULE_13"), "", "");
      }*/
}
/**************************** Rule 13 ***********************/
/**************************** Rule 14 ***********************/
// The objects which have a relationships connected with two ocurranes of the same definition
function rule_14(model, allObjOccs, modelName, modelGuid) {
    var isOk = true;
    if (allObjOccs.length > 0) {
        var oOcc = ArisData.sort(allObjOccs, Constants.SORT_TYPE, Constants.AT_NAME, Constants.SORT_NONE, g_loc);
        var ocxnoccs = null;
        for (var i = 0; i < oOcc.length; i++) {
            //if (oOcc[i].SymbolNum() != SYM_STAT ) { //exclude symbol status
            ocxnoccs = oOcc[i].CxnOccList();
            if (ocxnoccs.length > 0) {
                ocxnoccs = ArisData.Unique(ocxnoccs);
                for (h = 0; h < (ocxnoccs.length - 1) + 1; h++) {
                    if (ocxnoccs[h].Cxn().SourceObjDef().IsEqual(ocxnoccs[h].Cxn().TargetObjDef())) {
                        ko_output(modelName, modelGuid, getString("TEXT_RULE_14_LABEL"), getString("TEXT_RULE_14"), oOcc[i].ObjDef().Name(g_loc) + " [" + oOcc[i].SymbolName() + "] ", getString("TEXT_RULE_14_ITSELF_CXN"));
                        isOk = false;
                    }
                }
            }
            // }
        } //for
    } //if
    if (isOk) {
        ok_output(modelName, modelGuid, getString("TEXT_RULE_14_LABEL"), getString("TEXT_RULE_14"), "", "");
    }
}
/**************************** Rule 14 ***********************/
/**************************** Rule 15 ***********************/
// Check the correctnes of the model Process level attribute.
function rule_15(model, allObjects, modelName, modelGuid) {
    var isOk = true;
    // Subrutine: The Level attr of this model has to be < upper level process
    var parentModelsList = getParentModels(model);
    parentModelsList = ArisData.sort(parentModelsList, 1, g_loc); //List of all Parent models of the Process interface placed in EPC
    if (parentModelsList.length > 0) {
        var parentModelProcessLevel = new Array();
        for (var j = 0; j < parentModelsList.length; j++) {
            //if (([Constants.MT_EEPC, Constants.MT_EEPC_ROW].contains(parentModelsList) == true)) { //ToDo EPC only
            var temp = parentModelsList[j].Attribute(attr_processLevel, g_loc).getValue(); //Level attr of the all Process interface Parent Models (could be > 1)
            parentModelProcessLevel.push(temp);
            //}
        }
        var evaModelProcessLevel = model.Attribute(attr_processLevel, g_loc).getValue(); // Level attr of the current Model
        var maxparentModelProcessLevel = Math.max.apply(null, parentModelProcessLevel); // Find Max value of Level attributes - get the lowest Parent level model of the Process interface
        if (evaModelProcessLevel < maxparentModelProcessLevel && maxparentModelProcessLevel > 0) {
            ko_output(modelName, modelGuid, getString("TEXT_RULE_15_LABEL"), getString("TEXT_RULE_15"), "", getString("TEXT_RULE_15_PROCESS_LEVEL") + ": " + evaModelProcessLevel + getString("TEXT_RULE_15_PARENT") + maxparentModelProcessLevel);
            isOk = false;
        } else if (!(maxparentModelProcessLevel > 0)) {
            ko_output(modelName, modelGuid, getString("TEXT_RULE_15_LABEL"), getString("TEXT_RULE_15"), "", getString("TEXT_RULE_15_NOPARENT_ATTVALUE"));
            isOk = false;
        }
    } else if (parentModelsList.length == 0) {
        ko_output(modelName, modelGuid, getString("TEXT_RULE_15_LABEL"), getString("TEXT_RULE_15"), "", getString("TEXT_NO_PARENT_MODEL"));
        isOk = false;
    }
    /*         if (ofuncoccs.length > 0) {

                 ofuncoccs = ArisData.sort(ofuncoccs, Constants.SORT_TYPE, Constants.AT_NAME, Constants.SORT_NONE, g_loc);
                 for (var i = 0; i < ofuncoccs.length; i++) {
                     var func = ofuncoccs[i];
                     var funcObjDef = ofuncoccs[i].ObjDef();
                     if (func.SymbolNum() == SYM_PROCESS_INTERFACE || func.SymbolNum() == SYM_PROCESS_INTERFACE2) { //interface only
                         var object_Name = funcObjDef.Name(g_loc);
                         var evaModelProcessLevel = model.Attribute(attr_processLevel, g_loc).getValue(); // Level attr of the current Model
                         var parentModelsList = getParentModels(model);
                        // parentModelsList = parentModelsList.ModelListFilter(Constants.MT_EEPC, Constants.MT_EEPC_ROW);
                         parentModelsList = ArisData.sort(parentModelsList, 1, g_loc); //List of all Parent models of the Process interface placed in EPC
                         if (parentModelsList.length > 0){
                             var parentModelProcessLevel = new Array();
                             for (var j = 0; j < parentModelsList.length; j++) {
                                 //if (([Constants.MT_EEPC, Constants.MT_EEPC_ROW].contains(parentModelsList) == true)) { //ToDo EPC only
                                     var temp = parentModelsList[j].Attribute(attr_processLevel, g_loc).getValue(); //Level attr of the all Process interface Parent Models (could be > 1)
                                     parentModelProcessLevel.push(temp);
                                 //}
                             }
                             var maxparentModelProcessLevel = Math.max.apply(null, parentModelProcessLevel); // Find Max value of Level attributes - get the lowest Parent level model of the Process interface
                             if (evaModelProcessLevel < maxparentModelProcessLevel){
                                 ko_output(modelName,modelGuid,getString("TEXT_RULE_9_LABEL"), getString("TEXT_RULE_9_PROCESS_INTERFACE_CHECK"), object_Name, getString("TEXT_RULE_9_PROCESS_INTERFACE_PROCESS_LEVEL") + ": " + maxparentModelProcessLevel);
                             }
                         }
                     else if (parentModelsList.length == 0 && evaModelProcessLevel != 0) {
                             ko_output(modelName,modelGuid,getString("TEXT_RULE_9_LABEL"), getString("TEXT_RULE_9_PROCESS_INTERFACE_CHECK"), object_Name, getString("TEXT_RULE_9_PROCESS_INTERFACE_NOEPC"));
                         }

                     } //if
                 } //for
             } */
    if (isOk) {
        ok_output(modelName, modelGuid, getString("TEXT_RULE_15_LABEL"), getString("TEXT_RULE_15"), "", "");
    }
}
/**************************** Rule 15 ***********************/
/**************************** Rule 16 ***********************/
// Existence rule: check whether objects in evalutaed model exists (occ) in Stammdaten (dedicated models)
function rule_16(model, modelName, modelGuid) {
    var isOk = true;
    var sGUID = "";
    //IT Systems in Stammdaten
    var osysoccs = model.ObjOccListFilter(Constants.OT_APPL_SYS_TYPE); // IT systems
    osysoccs = ArisData.Unique(osysoccs);
    if (osysoccs.length > 0) {
        osysoccs = ArisData.sort(osysoccs, Constants.SORT_TYPE, Constants.AT_NAME, Constants.SORT_NONE, g_loc);
        getListOfSystemModels();
        for (var i = 0; i < osysoccs.length; i++) {
            var osys_objDef = osysoccs[i].ObjDef();
            var nameSys = osys_objDef.Name(g_loc);
            var isOccFoundInModel = checkObjoccInListOfSystems(osysoccs[i]);
            if (isOccFoundInModel == false && sGUID != osys_objDef.GUID()) {
                ko_output(modelName, modelGuid, getString("TEXT_RULE_16_LABEL"), getString("TEXT_RULE_16"), nameSys + " [" + aFilter.SymbolName(SYM_SYS) + "] ", getString("TEXT_RULE_16_NOT_IN_MASTERDATA"));
                isOk = false;
                sGUID = osys_objDef.GUID();
            }
        } // for
    }
    //Documents in Stammdaten
    var odococcs = model.ObjOccListFilter(OBJ_DOC); // Documents
    odococcs = ArisData.Unique(odococcs);
    if (odococcs.length > 0) {
        odococcs = ArisData.sort(odococcs, Constants.SORT_TYPE, Constants.AT_NAME, Constants.SORT_NONE, g_loc);
        var objTypeModelList = null;
        getListOfNonSystemModels(OBJ_DOC);
        for (var i = 0; i < odococcs.length; i++) {
            var odoc_objDef = odococcs[i].ObjDef();
            var nameObjType = odoc_objDef.Name(g_loc);
            var isOccFoundInModel = checkObjoccInListOfNonSystems(odococcs[i]);
            if (isOccFoundInModel == false && sGUID != odoc_objDef.GUID()) {
                ko_output(modelName, modelGuid, getString("TEXT_RULE_16_LABEL"), getString("TEXT_RULE_16"), nameObjType + " [" + aFilter.SymbolName(SYM_Doc) + "] ", getString("TEXT_RULE_16_NOT_IN_MASTERDATA"));
                isOk = false;
                sGUID = odoc_objDef.GUID();
            }
        } // for
    }
    // Org. Unites (OEs) in Stammdaten
    var oorgoccs = model.ObjOccListFilter(OBJ_ORG);
    oorgoccs = ArisData.Unique(oorgoccs);
    if (oorgoccs.length > 0) {
        oorgoccs = ArisData.sort(oorgoccs, Constants.SORT_TYPE, Constants.AT_NAME, Constants.SORT_NONE, g_loc);
        var objTypeModelList = null;
        getListOfNonSystemModels(OBJ_ORG);
        for (var i = 0; i < oorgoccs.length; i++) {
            var oorg_objDef = oorgoccs[i].ObjDef();
            var nameObjType = oorg_objDef.Name(g_loc);
            var isOccFoundInModel = checkObjoccInListOfNonSystems(oorgoccs[i]);
            if (isOccFoundInModel == false && sGUID != oorg_objDef.GUID()) {
                ko_output(modelName, modelGuid, getString("TEXT_RULE_16_LABEL"), getString("TEXT_RULE_16"), nameObjType + " [" + aFilter.SymbolName(SYM_ORG) + "] ", getString("TEXT_RULE_16_NOT_IN_MASTERDATA"));
                isOk = false;
                sGUID = oorg_objDef.GUID();
            }
        } // for
    }
    // Committee in Stammdaten
    var ocommoccs = model.ObjOccListFilter(OBJ_GRP);
    ocommoccs = ArisData.Unique(ocommoccs);
    if (ocommoccs.length > 0) {
        ocommoccs = ArisData.sort(ocommoccs, Constants.SORT_TYPE, Constants.AT_NAME, Constants.SORT_NONE, g_loc);
        var objTypeModelList = null;
        getListOfNonSystemModels(OBJ_GRP);
        for (var i = 0; i < ocommoccs.length; i++) {
            var ocomm_objDef = ocommoccs[i].ObjDef();
            var nameObjType = ocomm_objDef.Name(g_loc);
            var isOccFoundInModel = checkObjoccInListOfNonSystems(ocommoccs[i]);
            if (isOccFoundInModel == false && sGUID != ocomm_objDef.GUID()) {
                ko_output(modelName, modelGuid, getString("TEXT_RULE_16_LABEL"), getString("TEXT_RULE_16"), nameObjType + " [" + aFilter.SymbolName(SYM_GRP) + "] ", getString("TEXT_RULE_16_NOT_IN_MASTERDATA"));
                isOk = false;
                sGUID = ocomm_objDef.GUID();
            }
        } // for
    }
    // Roles in Stammdaten
    var oroleoccs = model.ObjOccListFilter(OBJ_ROL); // Documents
    oroleoccs = ArisData.Unique(oroleoccs);
    if (oroleoccs.length > 0) {
        oroleoccs = ArisData.sort(oroleoccs, Constants.SORT_TYPE, Constants.AT_NAME, Constants.SORT_NONE, g_loc);
        var objTypeModelList = null;
        getListOfNonSystemModels(OBJ_ROL);
        for (var i = 0; i < oroleoccs.length; i++) {
            var orole_objDef = oroleoccs[i].ObjDef();
            var nameObjType = orole_objDef.Name(g_loc);
            var isOccFoundInModel = checkObjoccInListOfNonSystems(oroleoccs[i]);
            if (isOccFoundInModel == false && sGUID != orole_objDef.GUID()) {
                ko_output(modelName, modelGuid, getString("TEXT_RULE_16_LABEL"), getString("TEXT_RULE_16"), nameObjType + " [" + aFilter.SymbolName(SYM_ROL) + "] ", getString("TEXT_RULE_16_NOT_IN_MASTERDATA"));
                isOk = false;
                sGUID = orole_objDef.GUID();
            }
        } // for
    }
    if (isOk) {
        ok_output(modelName, modelGuid, getString("TEXT_RULE_16_LABEL"), getString("TEXT_RULE_16"), "", "");
    }
}
/**************************** Rule 16 ***********************/
/**************************** Rule 17 ***********************/
// Assignment rule: check whether Process object in top level process models are without detail process models
function rule_17(model, modelName, modelGuid) {
    var ofuncoccs = model.ObjOccListFilter(Constants.OT_FUNC);
    var isOk = true;
    if (ofuncoccs.length > 0) {
        ofuncoccs = ArisData.sort(ofuncoccs, Constants.SORT_TYPE, Constants.AT_NAME, Constants.SORT_NONE, g_loc);
        for (var i = 0; i < ofuncoccs.length; i++) {
            var func = ofuncoccs[i];
            var funcObjDef = ofuncoccs[i].ObjDef();
            //   if (func.SymbolNum() == SYM_Process_Support || func.SymbolNum() == SYM_Process_Control || func.SymbolNum() == SYM_Process_WithHieararchy || func.SymbolNum() == SYM_Process_WithoutHieararchy) { //Process type symbols only
            var object_Name = funcObjDef.Name(g_loc);
            var assignedModelsEPC = funcObjDef.AssignedModels([Constants.MT_EEPC, Constants.MT_EEPC_COLUMN, Constants.MT_EEPC_INST, Constants.MT_EEPC_MAT, Constants.MT_EEPC_ROW, Constants.MT_EEPC_TAB, Constants.MT_EEPC_TAB_HORIZONTAL]);
            if (assignedModelsEPC.length == 0) {
                ko_output(modelName, modelGuid, getString("TEXT_RULE_17_LABEL"), getString("TEXT_RULE_17"), object_Name, getString("TEXT_RULE_17_NO_ASSIGNS"));
                isOk = false;
            }
            //  } //if
        } //for
    }
    if (isOk) {
        ok_output(modelName, modelGuid, getString("TEXT_RULE_17_LABEL"), getString("TEXT_RULE_17"), "", "");
    }
}
/**************************** Rule 17 ***********************/
/**************************** Rule 3a ***********************/
// Assignment rule: check whether Process model is placed in \Main group\<company fodler>\001 .... (in Unternehmensprozessmodell) and not in other subfolders as 003 Modellierungsprojekte, 004 etc.
function rule_3a(model, modelName, modelGuid) {
    var correctPath_de = "001 Unternehmensprozessmodell" // /Hauptgruppe/0200 Audi/001 Unternehmensprozessmodell
    var currentPath = model.Group().Path(g_loc_DE);
    var isOK = true;
    if (currentPath.length() > 0) {
        if (currentPath.indexOf(correctPath_de) == -1) {
            ko_output(modelName, modelGuid, getString("TEXT_RULE_3_LABEL"), getString("TEXT_RULE_3A"), "", getString("TEXT_RULE_3A_IMPROPER_TREE"));
            //  ko_output(modelName, modelGuid, getString("TEXT_RULE_16_LABEL"), getString("TEXT_RULE_16"), nameObjType, "[" + aFilter.SymbolName(SYM_ROL) + "] " + getString("TEXT_RULE_16_NOT_IN_MASTERDATA"));
            isOK = false;
        }
    }
    if (isOK) {
        ok_output(modelName, modelGuid, getString("TEXT_RULE_3_LABEL"), getString("TEXT_RULE_3A"), "", "");
    }
}
/**************************** Rule 3a ***********************/
/**************************** Rule 18 ***********************/
//Check keeping standard object formating - object size + font settings without changes
function rule_18(allObjOccs, model) {
    var isOK = true;
    var isValidTempate = true;
    var modelTemplateGUID = model.getTemplate();
    var modelName = model.Name(g_loc); //name of model
    var modelGuid = model.GUID();
    const colorBlack = rgbToHex(0, 0, 0); // RGB(0,0,0);
    const blackColor = 0;
    const colorWhite = rgbToHex(0, 0, 0); // RGB(255,255,255);
    const colorRed = rgbToHex(255, 0, 0); // RGB(255,0,0);
    const redColor = 16711680;
    if (g_validTemplates.contains(modelTemplateGUID) != true) {
        for (var i = 0; i < aConfigTemplates.length; i++) {
            if (aConfigTemplates[i].getGUID() == modelTemplateGUID) ko_output(modelName, modelGuid, getString("TEXT_RULE_18_LABEL"), getString("TEXT_RULE_18"), aConfigTemplates[i].getName(), getString("TEXT_RULE_18_TEMPLATE"));
            isValidTempate = false;
        }
        // return 0; //done with rule 18
    }
    var isWidthOK = true;
    var isNameOK = true;
    var isMinisyboleOK = true;
    var isTemplateOK = true;
    for (var i = 0; i < allObjOccs.length; i++) {
        var objOcc = allObjOccs[i];
        var objDef = objOcc.ObjDef();
        var nameObj = objDef.Name(g_loc);
        var objOcc_symbolNum = objOcc.SymbolNum();
        var occ_width = objOcc.Width();
        //part 1: improper object size (width)   
        function checkWidth(occ_width, arrWidths) {
            if ((arrWidths.contains(occ_width) != true)) {
                ko_output(modelName, modelGuid, getString("TEXT_RULE_18_LABEL"), getString("TEXT_RULE_18"), nameObj + " [" + aFilter.SymbolName(objOcc_symbolNum) + "] ", getString("TEXT_RULE_18_IMPROPER_WIDTH") + " v:" + objOcc.Height() + " š:" + objOcc.Width());
                return false;
            } else return true;
        }
        //part 2: improper object font formatting (object name) = target: Arial 8
        function checkFontFormat(objDef, attrNum, arrFontSize, arrFont, arrFontColor) {
            var attrName = objDef.Attribute(attrNum, g_loc);
            if (!attrName.getHTMLFormattedValue().containsOnlyPlainText()) { //is customized
                var html = attrName.getHTMLFormattedValue().getHTML();
                var fontSizeIndex = html.indexOf("font-size");
                if (fontSizeIndex > -1) {
                    var endWith = html.substring(fontSizeIndex, html.length());
                    fontSize = html.substring(fontSizeIndex + "font-size".length + 1, fontSizeIndex + endWith.indexOf("pt;"));
                    if (fontSize != arrFontSize) {
                        ko_output(modelName, modelGuid, getString("TEXT_RULE_18_LABEL"), getString("TEXT_RULE_18"), nameObj + " [" + aFilter.SymbolName(objOcc_symbolNum) + "] ", getString("TEXT_RULE_18_IMPROPER_FONT_FORMAT") + " vel:" + fontSize + ": " + aFilter.AttrTypeName(attrNum));
                        return false;
                    }
                }
                var fontColorIndex = html.indexOf("color");
                if (fontColorIndex > -1) {
                    var endWith = html.substring(fontColorIndex, html.length());
                    var fontColor = html.substring(fontColorIndex + "color".length + 1, fontColorIndex + endWith.indexOf(";"));
                    if (fontColor != arrFontColor) {
                        ko_output(modelName, modelGuid, getString("TEXT_RULE_18_LABEL"), getString("TEXT_RULE_18"), nameObj + " [" + aFilter.SymbolName(objOcc_symbolNum) + "] ", getString("TEXT_RULE_18_IMPROPER_FONT_FORMAT") + " barva: " + fontColor + ": " + aFilter.AttrTypeName(attrNum));
                        return false;
                    }
                }
                var fontNameIndex = html.indexOf("font-family");
                if (fontNameIndex > -1) {
                    var endWith = html.substring(fontNameIndex, html.length());
                    var fontName = html.substring(fontNameIndex + "font-family".length + 1, fontNameIndex + endWith.indexOf(";"));
                    if (fontName != arrFont) {
                        ko_output(modelName, modelGuid, getString("TEXT_RULE_18_LABEL"), getString("TEXT_RULE_18"), nameObj + " [" + aFilter.SymbolName(objOcc_symbolNum) + "] ", getString("TEXT_RULE_18_IMPROPER_FONT_FORMAT") + " font: " + fontName + +": " + aFilter.AttrTypeName(attrNum));
                        return false;
                    }
                }
                var fontItalic = html.indexOf("<i>");
                if (fontItalic > -1) {
                    ko_output(modelName, modelGuid, getString("TEXT_RULE_18_LABEL"), getString("TEXT_RULE_18"), nameObj + " [" + aFilter.SymbolName(objOcc_symbolNum) + "] ", getString("TEXT_RULE_18_IMPROPER_FONT_FORMAT") + ": " + aFilter.AttrTypeName(attrNum));
                    return false;
                }
                var fontBold = html.indexOf("<b>");
                if (fontBold > -1) {
                    ko_output(modelName, modelGuid, getString("TEXT_RULE_18_LABEL"), getString("TEXT_RULE_18"), nameObj + " [" + aFilter.SymbolName(objOcc_symbolNum) + "] ", getString("TEXT_RULE_18_IMPROPER_FONT_FORMAT") + ": " + aFilter.AttrTypeName(attrNum));
                    return false;
                }
                var fontUnderline = html.indexOf("<u>");
                if (fontUnderline > -1) {
                    ko_output(modelName, modelGuid, getString("TEXT_RULE_18_LABEL"), getString("TEXT_RULE_18"), nameObj + " [" + aFilter.SymbolName(objOcc_symbolNum) + "] ", getString("TEXT_RULE_18_IMPROPER_FONT_FORMAT") + ": " + aFilter.AttrTypeName(attrNum));
                    return false;
                }
                var fontCrossOut = html.indexOf("<strike>"); //preskrle pismo
                if (fontCrossOut > -1) {
                    ko_output(modelName, modelGuid, getString("TEXT_RULE_18_LABEL"), getString("TEXT_RULE_18"), nameObj + " [" + aFilter.SymbolName(objOcc_symbolNum) + "] ", getString("TEXT_RULE_18_IMPROPER_FONT_FORMAT") + ": " + aFilter.AttrTypeName(attrNum));
                    return false;
                }
            }
            return true;
        }
        //check if template is correct
        function checkFontFormatBasedTemplate(objOcc, attrNum, arrFontSize, arrFont, arrFontColor) {
            var fontTemplateSize = getFontSize(objOcc, attrNum);
            if (fontTemplateSize != arrFontSize) {
                ko_output(modelName, modelGuid, getString("TEXT_RULE_18_LABEL"), getString("TEXT_RULE_18"), nameObj + " [" + aFilter.SymbolName(objOcc_symbolNum) + "] ", getString("TEXT_RULE_18_IMPROPER_FONT_FORMAT") + ": " + aFilter.AttrTypeName(attrNum));
                return false;
            }
            var fontTemplate = getFont(objOcc, attrNum);
            if (fontTemplate != arrFont) {
                ko_output(modelName, modelGuid, getString("TEXT_RULE_18_LABEL"), getString("TEXT_RULE_18"), nameObj + " [" + aFilter.SymbolName(objOcc_symbolNum) + "] ", getString("TEXT_RULE_18_IMPROPER_FONT_FORMAT") + ": " + aFilter.AttrTypeName(attrNum));
                return false;
            }
            var fontTemplateColor = getFontColor(objOcc, attrNum);
            if (fontTemplateColor != arrFontColor) {
                ko_output(modelName, modelGuid, getString("TEXT_RULE_18_LABEL"), getString("TEXT_RULE_18"), nameObj + " [" + aFilter.SymbolName(objOcc_symbolNum) + "] ", getString("TEXT_RULE_18_IMPROPER_FONT_FORMAT") + ": " + aFilter.AttrTypeName(attrNum));
                return false;
            }
            var fontStyle = getFontStyle(objOcc, attrNum); //undeline, bold, italic ..
            if (fontStyle != 1) {
                ko_output(modelName, modelGuid, getString("TEXT_RULE_18_LABEL"), getString("TEXT_RULE_18"), nameObj + " [" + aFilter.SymbolName(objOcc_symbolNum) + "] ", getString("TEXT_RULE_18_IMPROPER_FONT_FORMAT") + ": " + aFilter.AttrTypeName(attrNum));
                return false;
            }
            return true;
        }
        switch (objOcc_symbolNum) {
            //symbols
            /*  case SYM_STAT:
                 isWidthOK = checkWidth(occ_width, [1668]);
                 break; */
            case Symb_XOR:
                isNameOK = checkWidth(occ_width, [100]);
                break;
            case Symb_OR:
                isWidthOK = checkWidth(occ_width, [100]);
                break;
            case Symb_AND:
                isWidthOK = checkWidth(occ_width, [100]);
                break;
            case SYM_PROCESS_INTERFACE:
                isWidthOK = checkWidth(occ_width, [261]);
                isNameOK = checkFontFormat(objDef, Constants.AT_NAME, 8, "Arial", colorBlack);
                isTemplateOK = checkFontFormatBasedTemplate(objOcc, Constants.AT_NAME, 8, "Arial", blackColor);
                break;
            case SYM_PROCESS_INTERFACE2:
                isWidthOK = checkWidth(occ_width, [292]);
                isNameOK = checkFontFormat(objDef, Constants.AT_NAME, 8, "Arial", colorBlack);
                isTemplateOK = checkFontFormatBasedTemplate(objOcc, Constants.AT_NAME, 8, "Arial", blackColor);
                break;
            case SYM_Doc:
                isWidthOK = checkWidth(occ_width, [312, 240]);
                isNameOK = checkFontFormat(objDef, Constants.AT_NAME, 8, "Arial", colorBlack);
                isTemplateOK = checkFontFormatBasedTemplate(objOcc, Constants.AT_NAME, 8, "Arial", blackColor);
                break;
            case SYM_ORG: //->position
                isWidthOK = checkWidth(occ_width, [311]);
                isNameOK = checkFontFormat(objDef, Constants.AT_NAME, 8, "Arial", colorBlack);
                isTemplateOK = checkFontFormatBasedTemplate(objOcc, Constants.AT_NAME, 8, "Arial", blackColor);
                break;
            case SYM_ROL:
                isWidthOK = checkWidth(occ_width, [312]);
                isNameOK = checkFontFormat(objDef, Constants.AT_NAME, 8, "Arial", colorBlack);
                isTemplateOK = checkFontFormatBasedTemplate(objOcc, Constants.AT_NAME, 8, "Arial", blackColor);
                break;
            case SYM_SYS:
                isWidthOK = checkWidth(occ_width, [248, 249, 250]);
                isNameOK = checkFontFormat(objDef, Constants.AT_NAME, 8, "Arial", colorBlack);
                isTemplateOK = checkFontFormatBasedTemplate(objOcc, Constants.AT_NAME, 8, "Arial", blackColor);
                break;
            case SYM_EVT:
                isWidthOK = checkWidth(occ_width, [287]);
                isNameOK = checkFontFormat(objDef, Constants.AT_NAME, 8, "Arial", colorBlack);
                isTemplateOK = checkFontFormatBasedTemplate(objOcc, Constants.AT_NAME, 8, "Arial", blackColor);
                break;
                /* case SYM_Process_Support:
                    isWidthOK = checkWidth(occ_width, [273]);
                    isNameOK = checkFontFormat(objDef, Constants.AT_NAME, 8, "Arial", colorBlack);
                    isTemplateOK = checkFontFormatBasedTemplate(objOcc, Constants.AT_NAME, 8, "Arial", blackColor);
                    break;
                case SYM_Process_Control:
                    isWidthOK = checkWidth(occ_width, [273]);
                    isNameOK = checkFontFormat(objDef, Constants.AT_NAME, 8, "Arial", colorBlack);
                    isTemplateOK = checkFontFormatBasedTemplate(objOcc, Constants.AT_NAME, 8, "Arial", blackColor);
                    break; */
            case SYM_Process_WithHieararchy:
                isWidthOK = checkWidth(occ_width, [311, 499, 500]);
                isNameOK = checkFontFormat(objDef, Constants.AT_NAME, 8, "Arial", colorBlack);
                isTemplateOK = checkFontFormatBasedTemplate(objOcc, Constants.AT_NAME, 8, "Arial", blackColor);
                break;
            case SYM_Process_WithoutHieararchy:
                isWidthOK = checkWidth(occ_width, [311, 499, 500]);
                isNameOK = checkFontFormat(objDef, Constants.AT_NAME, 8, "Arial", colorBlack);
                isTemplateOK = checkFontFormatBasedTemplate(objOcc, Constants.AT_NAME, 8, "Arial", blackColor);
                break;
                /*  case SYM_Process_StepHierarchy:
                     isWidthOK = checkWidth(occ_width, [262]);
                     isNameOK = checkFontFormat(objDef, Constants.AT_NAME, 8, "Arial", colorBlack);
                     isTemplateOK = checkFontFormatBasedTemplate(objOcc, Constants.AT_NAME, 8, "Arial", blackColor);
                     break; */
            case SYM_Process_Step:
                isWidthOK = checkWidth(occ_width, [311]);
                isNameOK = checkFontFormat(objDef, Constants.AT_NAME, 8, "Arial", colorBlack);
                isTemplateOK = checkFontFormatBasedTemplate(objOcc, Constants.AT_NAME, 8, "Arial", blackColor);
                break;
                /*   case SYM_Process_Release:
                       isWidthOK = checkWidth(occ_width, [348]);
                       isNameOK = checkFontFormat(objDef, Constants.AT_NAME, 8, "Arial", colorBlack);
                       isTemplateOK = checkFontFormatBasedTemplate(objOcc, Constants.AT_NAME, 8, "Arial", blackColor);
                       break;
                    case SYM_MILESTONE:
                       isWidthOK = checkWidth(occ_width, [220]);
                       isNameOK = checkFontFormat(objDef, Constants.AT_NAME, 7, "Arial", colorWhite);
                       isTemplateOK = checkFontFormatBasedTemplate(objOcc, Constants.AT_NAME, 7, "Arial", blackColor);
                       break; */
            case SYM_GRP:
                isWidthOK = checkWidth(occ_width, [311]);
                isNameOK = checkFontFormat(objDef, Constants.AT_NAME, 8, "Arial", colorBlack);
                isTemplateOK = checkFontFormatBasedTemplate(objOcc, Constants.AT_NAME, 8, "Arial", blackColor);
                break;
            default:
                // code block 
        }
        //part 3: minisymbole check
        //for attr: Minisymbole Gruppe 1 = Minisymbole 12, standard, Black         attr_Minisymbole_Group1
        //for attr: Minisymbole Gruppe 2 = Minisymbole 12, standard, Red           attr_Minisymbole_Group2
        /* if (objDef.Attribute(attr_Minisymbole_Group1, g_loc).IsMaintained()) {
            if (!objDef.Attribute(attr_Minisymbole_Group1, g_loc).getHTMLFormattedValue().containsOnlyPlainText()) { //is edited
                isMinisyboleOK = checkFontFormat(objDef, attr_Minisymbole_Group1, 12, "Arial", colorBlack);
            }
            isTemplateOK = checkFontFormatBasedTemplate(objOcc, attr_Minisymbole_Group1, 12, "Minisymbole", blackColor);
        }
        if (objDef.Attribute(attr_Minisymbole_Group2, g_loc).IsMaintained()) {
            if (!objDef.Attribute(attr_Minisymbole_Group2, g_loc).getHTMLFormattedValue().containsOnlyPlainText()) { //is edited
                isMinisyboleOK = checkFontFormat(objDef, attr_Minisymbole_Group2, 12, "Arial", colorRed);
            }
            isTemplateOK = checkFontFormatBasedTemplate(objOcc, attr_Minisymbole_Group2, 12, "Minisymbole", redColor);
        } */
        if (!isWidthOK || !isNameOK || !isTemplateOK) isOK = false;
    } //for
    if (isValidTempate) {
        if (isOK) {
            ok_output(modelName, modelGuid, getString("TEXT_RULE_18_LABEL"), getString("TEXT_RULE_18"), "", "");
        }
    }
}
/*based ont tempalte*/
function getFontColor(objOcc, attrNum) {
    //Get the attribute definition from the current object occurrence 
    var Attr_Occ = objOcc.AttrOcc(attrNum);
    //Get the color of the font from the attribute
    var Attr_Font_Color = Attr_Occ.getFontStyleSheet().Font(g_loc).Color();
    return Attr_Font_Color;
}

function getFontSize(objOcc, attrNum) {
    //Get the attribute definition from the current object occurrence 
    var Attr_Occ = objOcc.AttrOcc(attrNum);
    //Get the color of the font from the attribute
    //   var Attr_Font_Size1 = Attr_Occ.FontStyleSheet()
    var Attr_Font_Size = Attr_Occ.getFontStyleSheet().Font(g_loc).Size();
    return Attr_Font_Size;
}

function getFont(objOcc, attrNum) {
    //Get the attribute definition from the current object occurrence 
    var Attr_Occ = objOcc.AttrOcc(attrNum);
    //Get the color of the font from the attribute
    var Attr_Font = Attr_Occ.getFontStyleSheet().Font(g_loc_DE).Name();
    return Attr_Font;
}

function getFontStyle(objOcc, attrNum) {
    //Get the attribute definition from the current object occurrence 
    var Attr_Occ = objOcc.AttrOcc(attrNum);
    //Get the color of the font from the attribute
    var Attr_Style = Attr_Occ.getFontStyleSheet().Font(g_loc).Style();
    return Attr_Style;
}
/* end based on template*/
function RGB(r, g, b) {
    return (new java.awt.Color(r / 255.0, g / 255.0, b / 255.0, 1)).getRGB() & 0xFFFFFF;
}

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}
/**************************** Rule 18 ***********************/
/**************************** Rule 19 ***********************/
//Check connections placement between objects
function rule_19(allObjOccs, modelName, modelGuid) {
    var isOK = true;
    allObjOccs = ArisData.sort(allObjOccs, Constants.SORT_Y, Constants.SORT_X, g_loc); //sort by X, Y
    for (var i = 0; i < allObjOccs.length; i++) {
        var objOcc = allObjOccs[i];
        var objDef = objOcc.ObjDef();
        var objOcc_symbolNum = objOcc.SymbolNum();
        var nameObj = objDef.Name(g_loc);
        var occ_X = objOcc.X();
        var occ_Y = objOcc.Y();
        var occ_width = objOcc.Width();
        var occ_height = objOcc.Height();
        // all connections for events, process steps, process interface or process steps 
        //TODO check objOcc
        if (objDef.TypeNum() == Constants.OT_EVT || objOcc.SymbolNum() == SYM_PROCESS_INTERFACE || objOcc.SymbolNum() == SYM_PROCESS_INTERFACE2 ||
            // objOcc.SymbolNum() == SYM_Process_Release ||
            objOcc.SymbolNum() == SYM_Process_Step ||
            //objOcc.SymbolNum() == SYM_Process_StepHierarchy ||
            // objOcc.SymbolNum() == SYM_STAT || nema mit zadne vazby
            //epc swimm line zleva doprava
            //objOcc.SymbolNum() == SYM_Process_Support ||
            //objOcc.SymbolNum() == SYM_Process_Control ||
            objOcc.SymbolNum() == SYM_Process_WithHieararchy || objOcc.SymbolNum() == SYM_Process_WithoutHieararchy) {
            var outcxns = objOcc.OutEdges(Constants.EDGES_STRUCTURE);
            var incxns = objOcc.InEdges(Constants.EDGES_STRUCTURE);
            var nincxns = objOcc.InDegree(Constants.EDGES_STRUCTURE);
            var noutcxns = objOcc.OutDegree(Constants.EDGES_STRUCTURE);
            /*
             * check side of cxn 
             */
            //todo check occ output or input
            // var cxnOccLists = objOcc.CxnOccList();
            var arry_cnxs_unique = new Array();
            checkCnx(incxns, 1); //in cnxs
            checkCnx(outcxns, 0); //out cnxs
        }
    } //for
    function isTop(occ_Y, cxn_Y) {
        if (occ_Y == cxn_Y) return true;
        else return false;
    }

    function isBottom(occ_Y, occ_height, cxn_Y) {
        if (occ_Y + occ_height == cxn_Y) return true;
        else return false;
    }

    function isLeft(occ_X, cxn_X) {
        if (occ_X == cxn_X) return true;
        else return false;
    }

    function isRight(occ_X, occ_width, cxn_X) {
        if (occ_X + occ_width == cxn_X) return true;
        else return false;
    }
    //in out
    function checkCnx(cxns, cxn_direction) {
        var cnxUnique = new Array();
        //  var cnxUniqueOUT = new Array();
        for (var o = 0; o < cxns.length; o++) {
            var cxnOcc = cxns[o];
            var GUID_cnx = cxnOcc.CxnDef().GUID();
            var targetOcc = cxnOcc.TargetObjOcc();
            var targetOcc_sybolNum = targetOcc.SymbolNum();
            var sourceOcc = cxnOcc.SourceObjOcc();
            var sourceOcc_sybolNum = sourceOcc.SymbolNum();
            // if (![SYM_ROL, SYM_SYS].contains(targetOcc_sybolNum)) {
            //     if (![SYM_ROL, SYM_SYS].contains(sourceOcc_sybolNum)) {
            var points = cxnOcc.getPoints();
            for (var k = 0; k < points.length; k++) {
                var cxn_X = points[k].getX();
                var cxn_Y = points[k].getY();
                istop = isTop(occ_Y, cxn_Y);
                isbottom = isBottom(occ_Y, occ_height, cxn_Y); //ok
                isleft = isLeft(occ_X, cxn_X);
                isright = isRight(occ_X, occ_width, cxn_X); //ok
                if ((istop || isbottom || isleft || isright) == true) {
                    if (!cnxUnique.contains(GUID_cnx)) {
                        //Swimming-line diagram = all connections for events, process steps, process interface or process steps with hierarchy must be from left side for incoming connection and right side for out-coming connections.
                        if ([Constants.MT_EEPC_ROW].contains(g_model_typeNum)) {
                            if (noutcxns > 0 && cxn_direction == 0) {
                                if (istop || isbottom) {
                                    isOK = false;
                                    ko_output(modelName, modelGuid, getString("TEXT_RULE_19_LABEL"), getString("TEXT_RULE_19"), nameObj + " [" + aFilter.SymbolName(objOcc_symbolNum) + "] ", getString("TEXT_RULE_19_NO_CXN_FROM_RIGHT") + " -> " + targetOcc.ObjDef().Name(g_loc) + " [" + aFilter.SymbolName(targetOcc_sybolNum) + "]");
                                    cnxUnique.push(GUID_cnx);
                                }
                            } else if (nincxns > 0 && cxn_direction == 1) {
                                if (istop || isbottom) {
                                    isOK = false;
                                    ko_output(modelName, modelGuid, getString("TEXT_RULE_19_LABEL"), getString("TEXT_RULE_19"), nameObj + " [" + aFilter.SymbolName(objOcc_symbolNum) + "] ", getString("TEXT_RULE_19_NO_CXN_FROM_LEFT") + " -> " + sourceOcc.ObjDef().Name(g_loc) + " [" + aFilter.SymbolName(sourceOcc_sybolNum) + "]");
                                    cnxUnique.push(GUID_cnx);
                                }
                            }
                        }
                        // EPC (Flow chart) diagram = all connections for events, process steps ... must be on the top for incoming connections and on the button for out-coming connection           
                        //if ([Constants.MT_EEPC, Constants.MT_EEPC_COLUMN, Constants.MT_EEPC_INST, Constants.MT_EEPC_MAT, Constants.MT_EEPC_TAB, Constants.MT_EEPC_TAB_HORIZONTAL].contains(g_model_typeNum)) {
                        if ([Constants.MT_EEPC].contains(g_model_typeNum)) {
                            if (noutcxns > 0 && cxn_direction == 0) {
                                if (isright || isleft) {
                                    isOK = false;
                                    ko_output(modelName, modelGuid, getString("TEXT_RULE_19_LABEL"), getString("TEXT_RULE_19"), nameObj + " [" + aFilter.SymbolName(objOcc_symbolNum) + "] ", getString("TEXT_RULE_19_NO_CXN_FROM_BOTTOM") + " -> " + targetOcc.ObjDef().Name(g_loc) + " [" + aFilter.SymbolName(targetOcc_sybolNum) + "]");
                                    cnxUnique.push(GUID_cnx);
                                }
                            } else if (nincxns > 0 && cxn_direction == 1) {
                                if (isright || isleft) {
                                    isOK = false;
                                    ko_output(modelName, modelGuid, getString("TEXT_RULE_19_LABEL"), getString("TEXT_RULE_19"), nameObj + " [" + aFilter.SymbolName(objOcc_symbolNum) + "] ", getString("TEXT_RULE_19_NO_CXN_FROM_TOP") + " -> " + sourceOcc.ObjDef().Name(g_loc) + " [" + aFilter.SymbolName(sourceOcc_sybolNum) + "]");
                                    cnxUnique.push(GUID_cnx);
                                }
                            }
                        }
                    }
                }
            } //if
            //   }
            //  } //if   
        } //for 
    }
    if (isOK) {
        ok_output(modelName, modelGuid, getString("TEXT_RULE_19_LABEL"), getString("TEXT_RULE_19"), "", "");
    }
}
/**************************** Rule 19 ***********************/
/**************************** Rule 20 ***********************/



function rule_20(model, modelName, modelGuid) {

    if (isEPC) {
        var oObjDefs = model.ObjDefListBySymbols([Constants.ST_CLST, Constants.ST_DOC]);
    } else {
        var oObjDefs = model.ObjDefListBySymbols([Constants.ST_PERFORM]);
    }
    var isOk = true;
    if (oObjDefs.length > 0) {
        oObjDefs = ArisData.sort(oObjDefs, Constants.SORT_TYPE, Constants.AT_NAME, Constants.SORT_NONE, g_loc);
        var oObjDefs = ArisData.Unique(oObjDefs);
        for (var i = 0; i < oObjDefs.length; i++) {
            var oObjDef = oObjDefs[i]
            var object_Name = oObjDef.Name(g_loc);
            var object_TypeNum = oObjDef.TypeNum();
            var occsInModel = oObjDef.OccListInModel(model);
            //var occsInModel = oObjDef.OccList(model);
  
           //RV 20221603
           var skip =false;
        
            // skip check clusters without hiearchy
            skip = hasAssginedModel(occsInModel);
             if(skip){
                continue;
            }
            
            
            var countIN = 0;
            var countOUT = 0;

            var cxns_ins = oObjDef.CxnListFilter(Constants.EDGES_IN);
            for (var j = 0; j < cxns_ins.length; j++) {
                var occs_in = cxns_ins[j].OccList();
                for (var k = 0; k < occs_in.length; k++) {
                    if (occs_in[k].getSource().getColor() == symbolColor_Green) {
                        countIN++;
                    }
                }
            }

            var cxns_outs = oObjDef.CxnListFilter(Constants.EDGES_OUT);
            for (var j = 0; j < cxns_outs.length; j++) {
                var occs_out = cxns_outs[j].OccList();
                for (var k = 0; k < occs_out.length; k++) {
                    if (occs_out[k].getTarget().getColor() == symbolColor_Green) {
                        countOUT++;
                    }
                }
            }

            //TODO pouze jeden vysktyt, je to chyba?
           
            
            if (countIN > 0 && countOUT == 0) {
               if (isEPC) ko_output(modelName, modelGuid, getString("TEXT_RULE_20_LABEL"), getString("TEXT_RULE_20_EPC"), object_Name + " [" + oObjDef.Type() + "](" + occsInModel.length + ")", "");
                else ko_output(modelName, modelGuid, getString("TEXT_RULE_20_LABEL"), getString("TEXT_RULE_20_MTPH"), object_Name + " [" + oObjDef.Type() + "](" + occsInModel.length + ")", "");
                isOk = false;
            }
            if (countOUT > 0 && countIN == 0) {
                if (isEPC) ko_output(modelName, modelGuid, getString("TEXT_RULE_20_LABEL"), getString("TEXT_RULE_20_EPC"), object_Name + " [" + oObjDef.Type() + "](" + occsInModel.length + ")", "");
                else ko_output(modelName, modelGuid, getString("TEXT_RULE_20_LABEL"), getString("TEXT_RULE_20_MTPH"), object_Name + " [" + oObjDef.Type() + "](" + occsInModel.length + ")", "");
                isOk = false;
            }
        } //for
    } //for    

    if (isOk) {
        if (isEPC) ok_output(modelName, modelGuid, getString("TEXT_RULE_20_LABEL"), getString("TEXT_RULE_20_EPC"), "", "");
        else ok_output(modelName, modelGuid, getString("TEXT_RULE_20_LABEL"), getString("TEXT_RULE_20_MTPH"), "", "");
    }

    
    
       function hasAssginedModel(occsInModel){
            for (var j = 0; j < occsInModel.length;j++) {
                
          var procesOrRozhrani = occsInModel[j].getConnectedObjOccs([Constants.ST_VAL_ADD_CHN_SML_2, Constants.ST_PRCS_IF], Constants.EDGES_INOUT);
            if(procesOrRozhrani.length > 0){
                 for (var k = 0; k < procesOrRozhrani.length; k++) {
                     if(procesOrRozhrani[k].SymbolNum() ==Constants.ST_VAL_ADD_CHN_SML_2 && procesOrRozhrani[k].getColor() == Constants.C_WHITE ||procesOrRozhrani[k].SymbolNum()==Constants.ST_PRCS_IF ){
                        var checkName = procesOrRozhrani[k].ObjDef().Name(g_loc);
                        var aModels = procesOrRozhrani[k].ObjDef().AssignedModels();
                        if(aModels.length == 0){
                            return  true;
                            }
                        }
                    }//for
                } 
            }
            return false;
       }
    
}
/**************************** Rule 20 ***********************/
/**************************** Rule 21 ***********************/
function rule_21(model, modelName, modelGuid) {
    var activeDB = ArisData.getActiveDatabase();
    var oOrg = model.ObjDefListFilter(Constants.OT_ORG_UNIT);
    if (isEPC) {
        var oPosition = model.ObjDefListFilter(Constants.OT_POS); //funkcni misto
        var oRole = model.ObjDefListFilter(Constants.OT_PERS_TYPE);
    }
    var isOk = true;
    if (oOrg.length > 0) {
        oOrg = ArisData.sort(oOrg, Constants.SORT_TYPE, Constants.AT_NAME, Constants.SORT_NONE, g_loc);
        var DatalinkLibraryDepartmentGroupGUID = "5502dfd1-0f79-11e6-5a90-000c293052e4"; //Utvary
        var departmentGroup = activeDB.FindGUID(DatalinkLibraryDepartmentGroupGUID, Constants.CID_GROUP)
        for (var i = 0; i < oOrg.length; i++) {
            var oObjDef = oOrg[i];
            var object_Name = oObjDef.Name(g_loc);
            var path = oObjDef.Group().Path(g_loc_CZ, true);
            //check attr DataLink ID
            var nameObj_DLId = oObjDef.Attribute(attr_DL_ID, g_loc).getValue();
            if (path.indexOf(departmentGroup.Path(g_loc_CZ)) == -1) {
                ko_output(modelName, modelGuid, getString("TEXT_RULE_21_LABEL"), getString("TEXT_RULE_21"), object_Name + " [" + oObjDef.Type() + "]", path + "\\" + object_Name + "\nDL ID:" + nameObj_DLId);
                isOk = false;
            }
        } //for
    }
    if (oPosition != null) {
        oPosition = ArisData.sort(oPosition, Constants.SORT_TYPE, Constants.AT_NAME, Constants.SORT_NONE, g_loc);
        var DatalinkLibraryPositionsGroupGUID = "55578f81-0f79-11e6-5a90-000c293052e4"; //Pracovni mista
        var departmentGroup = activeDB.FindGUID(DatalinkLibraryPositionsGroupGUID, Constants.CID_GROUP)
        for (var i = 0; i < oPosition.length; i++) {
            var oObjDef = oPosition[i];
            var object_Name = oObjDef.Name(g_loc);
            //check attr DataLink ID
            var nameObj_DLId = oObjDef.Attribute(attr_DL_ID, g_loc).getValue();
            var path = oObjDef.Group().Path(g_loc_CZ, true);
            if (path.indexOf(departmentGroup.Path(g_loc_CZ)) == -1) {
                ko_output(modelName, modelGuid, getString("TEXT_RULE_21_LABEL"), getString("TEXT_RULE_21"), object_Name + " [" + oObjDef.Type() + "]", path + "\\" + object_Name + "\nDL ID:" + nameObj_DLId);
                isOk = false;
            }
        } //for
    }
    /*
    if (oRole != null) {
        oRole = ArisData.sort(oRole, Constants.SORT_TYPE, Constants.AT_NAME, Constants.SORT_NONE, g_loc);
        var DatalinkLibraryRoleGroupGUID = "75886761-8be7-11e8-7ad3-005056ad77da"; //Procesní role
        var departmentGroup = activeDB.FindGUID(DatalinkLibraryRoleGroupGUID, Constants.CID_GROUP)
        for (var i = 0; i < oRole.length; i++) {
            var oObjDef = oRole[i];
            var object_Name = oObjDef.Name(g_loc);
            //check attr DataLink ID
            var nameObj_DLId = oObjDef.Attribute(attr_DL_ID, g_loc).getValue();
            var path = oObjDef.Group().Path(g_loc_CZ, true);
            if (path.indexOf(departmentGroup.Path(g_loc_CZ)) == -1) {
                ko_output(modelName, modelGuid, getString("TEXT_RULE_21_LABEL"), getString("TEXT_RULE_21"), object_Name + " [" + oObjDef.Type() + "]", path + "\\" + object_Name + "\nDL ID:" + nameObj_DLId);
                isOk = false;
            }
        } //for
    }*/
    if (isOk) {
        ok_output(modelName, modelGuid, getString("TEXT_RULE_21_LABEL"), getString("TEXT_RULE_21"), "", "");
    }
}
/**************************** Rule 21 ***********************/

/**************************** Rule 22 ***********************/
var isOk1 = true;

function rule_22a(model, modelName, modelGuid) {
    var isOk = true;
    var modelGUID = model.GUID();
    var output_vykonCluster_IN = new Array();
   
    if (isEPC) {
        var oObjOccs = getFuncFromModel(model, Constants.ST_FUNC);
    } else { //MTPH
        var oObjOccs = getFuncFromModel(model, Constants.ST_VAL_ADD_CHN_SML_2);
    }
    for (var i = 0; i < oObjOccs.length; i++) {
        var oObjOcc = oObjOccs[i];
        var oObjDef = oObjOcc.ObjDef();
        var object_Name = oObjDef.Name(g_loc);
        var vykonCluster_IN = oObjOcc.getConnectedObjOccs([Constants.ST_PERFORM, Constants.ST_CLST, Constants.ST_DOC], Constants.EDGES_IN);
        vykonCluster_IN = ArisData.sort(vykonCluster_IN, Constants.SORT_Y, Constants.AT_NAME, g_loc)
        for (var j = 0; j < vykonCluster_IN.length; j++) {
            var vykonCluster_IN_Occ = vykonCluster_IN[j];
            var vykonCluster_IN_ObjDef = vykonCluster_IN[j].ObjDef();
            var vykonCluster_IN_Name = vykonCluster_IN_ObjDef.Name(g_loc);
            var pathObj = vykonCluster_IN_ObjDef.Group().Path(g_loc_CZ, true);
            
            //RV 20221603
            var skip =false;
            var procesOrRozhrani = vykonCluster_IN_Occ.getConnectedObjOccs([Constants.ST_VAL_ADD_CHN_SML_2, Constants.ST_PRCS_IF], Constants.EDGES_IN);
            if(procesOrRozhrani.length > 0){
                 for (var k = 0; k < procesOrRozhrani.length; k++) {
                   var aModels = procesOrRozhrani[k].ObjDef().AssignedModels();
                    if(aModels.length == 0){
                      skip = true;
                    }
                }
            }
        
        // skip check clusters without hiearchy
        if(skip){
            continue;
        }
         
            var occsModel = vykonCluster_IN_ObjDef.OccListInModel(model);
            occsModel = ArisData.sort(occsModel, Constants.AT_NAME, g_loc)

            /*if (occsModel.length == 1) { //faster
                var pathObj = occsModel[0].ObjDef().Group().Path(g_loc_CZ, true);
                var modelPath = occsModel[0].Model().Group().Path(g_loc_CZ, true);

                if (pathObj != modelPath) { //neshoda
                    isOk = false;
                    if (isEPC)
                        ko_output(modelName, modelGuid, getString("TEXT_RULE_22A_LABEL"), getString("TEXT_RULE_22_EPC_INPUT"), vykonCluster_IN_Name + " [" + vykonCluster_IN_ObjDef.Type() + "]", getString("TEXT_RULE_22_INPUT_DESC"));
                    else
                        ko_output(modelName, modelGuid, getString("TEXT_RULE_22A_LABEL"), getString("TEXT_RULE_22_MTPH_INPUT"), vykonCluster_IN_Name + " [" + vykonCluster_IN_ObjDef.Type() + "]", getString("TEXT_RULE_22_INPUT_DESC"));
                }
            }*/
            if (occsModel.length > 0) {
                var pathObj;
                var modelPath;
                var isAlsoOnOutput = false;
                for (var k = 0; k < occsModel.length; k++) {
                    pathObj = occsModel[k].ObjDef().Group().Path(g_loc_CZ, true);
                    modelPath = occsModel[k].Model().Group().Path(g_loc_CZ, true);
                    var func = occsModel[k].getConnectedObjOccs([Constants.ST_FUNC, Constants.ST_VAL_ADD_CHN_SML_2], Constants.EDGES_IN);
                    for (var l = 0; l < func.length; l++) {
                        if (func[l].getColor() == symbolColor_Green) {
                            isAlsoOnOutput = true;
                        }
                    }
                }
                if (isAlsoOnOutput == false) { // 1 a vice vstupu bez vystupu
                    if (pathObj == modelPath) {
                        isOk = false;
                        if (isEPC){
                              output_vykonCluster_IN.push(vykonCluster_IN_ObjDef);
                           // ko_output(modelName, modelGuid, "puvodni"+ getString("TEXT_RULE_22A_LABEL"), getString("TEXT_RULE_22_EPC_INPUT"), vykonCluster_IN_Name + " [" + vykonCluster_IN_ObjDef.Type() + "]", formatstring1(getString("TEXT_RULE_22_INPUT_DESC"), vykonCluster_IN_ObjDef.Type()));
                        }else{
                            output_vykonCluster_IN.push(vykonCluster_IN_ObjDef);
                            //ko_output(modelName, modelGuid, "puvodni"+getString("TEXT_RULE_22A_LABEL"), getString("TEXT_RULE_22_MTPH_INPUT"), vykonCluster_IN_Name + " [" + vykonCluster_IN_ObjDef.Type() + "]", formatstring1(getString("TEXT_RULE_22_INPUT_DESC"), vykonCluster_IN_ObjDef.Type()));
                        }
                   }
                }
            }
        }
    }
    
    //remove duplicty from output    
    output_vykonCluster_IN = ArisData.sort(output_vykonCluster_IN, Constants.AT_NAME, g_loc);
    output_vykonCluster_IN = ArisData.Unique(output_vykonCluster_IN);

    for (var o = 0; o < output_vykonCluster_IN.length; o++) {
        var occsInModel = output_vykonCluster_IN[o].OccListInModel(model);
        ko_output(modelName, modelGuid, getString("TEXT_RULE_22A_LABEL"), getString("TEXT_RULE_22_EPC_OUTPUT"), output_vykonCluster_IN[o].Name(g_loc) + " [" + output_vykonCluster_IN[o].Type() + "]"/*(" + occsInModel.length + ")"*/, formatstring1(getString("TEXT_RULE_22_OUTPUT_DESC"), output_vykonCluster_IN[o].Type()));
    }
    
    if (isOk) {
        if (isEPC) ok_output(modelName, modelGuid, getString("TEXT_RULE_22A_LABEL"), getString("TEXT_RULE_22_EPC_INPUT"), "", "");
        else ok_output(modelName, modelGuid, getString("TEXT_RULE_22A_LABEL"), getString("TEXT_RULE_22_MTPH_INPUT"), "", "");
    }
}


function rule_22b(model, modelName, modelGuid) {
    var isOk = true;
    var output_vykonCluster_OUT = new Array();
    var counter = 0;
    var modelPath = model.Group().Path(g_loc_CZ, true);
    var modelGUID = model.GUID();

    var strRemove = "Hlavní skupina\\2. Procesní model ČEZ, a. s.";
    var strRemove = "Hlavní skupina";
    var sharedLib = "6. Knihovna sdílených objektů";
    if (isEPC) {
        var oObjOccs = getFuncFromModel(model, Constants.ST_FUNC);
    } else { //MTPH
        var oObjOccs = getFuncFromModel(model, Constants.ST_VAL_ADD_CHN_SML_2);
    }


    for (var i = 0; i < oObjOccs.length; i++) {
        var oObjOcc = oObjOccs[i];
        var oObjDef = oObjOcc.ObjDef();
        var object_Name = oObjDef.Name(g_loc);
        var vykonCluster_OUT = oObjOcc.getConnectedObjOccs([Constants.ST_PERFORM, Constants.ST_CLST, Constants.ST_DOC], Constants.EDGES_OUT);
        // var vykon_OUT = oObjOcc.getConnectedObjOccs([Constants.ST_PERFORM], Constants.EDGES_OUT);
        vykonCluster_OUT = ArisData.sort(vykonCluster_OUT, Constants.SORT_Y, Constants.AT_NAME, g_loc);
        for (var j = 0; j < vykonCluster_OUT.length; j++) {
            var vykonCluster_OUT_Occ = vykonCluster_OUT[j];
            var vykonCluster_OUT_ObjDef = vykonCluster_OUT[j].ObjDef();
            var vykonCluster_OUT_Name = vykonCluster_OUT_ObjDef.Name(g_loc);
            var pathObj = vykonCluster_OUT_ObjDef.Group().Path(g_loc_CZ, true);

            // if (pathObj.indexOf(sharedLib) > 0) { //skip sharedLib
            // continue;
            // }
            //var occsAll = vykonCluster_IN_ObjDef.OccList();
            var occsInModel = vykonCluster_OUT_ObjDef.OccListInModel(model);

            // var diffOccsNotInModel = [];
            // for (var c = 0; c < occsInModel.length; c++) {
            // if ((occsAll.containsOccID(occsInModel[c]) == true)) { //VACD
            // diffOccsNotInModel.push(occsInModel[c])
            // }
            // }

            if (occsInModel.length > 0) {
                var pathObj1;
                var modelPath1;
                // var isAlsoOnOutput = false;
                for (var k = 0; k < occsInModel.length; k++) {
                    var occ = occsInModel[k];
                    //if (modelGUID != occsInModel[k].Model().GUID()) {
                    var controlName = occ.ObjDef().Name(g_loc);
                    var modelName = occ.Model().Name(-1);

                    pathObj1 = occ.ObjDef().Group().Path(g_loc_CZ, true);
                    modelPath1 = occ.Model().Group().Path(g_loc_CZ, true);
                    // var func = occ.getConnectedObjOccs([Constants.ST_FUNC, Constants.ST_VAL_ADD_CHN_SML_2], Constants.EDGES_IN);
                    // for (var l = 0; l < func.length; l++) {
                    // if (func[l].getColor() == symbolColor_Green) {
                    // isAlsoOnOutput = true;
                    // }
                    // }
                    //  }
                } //for

                //    if (isAlsoOnOutput) { // 1 a vice vstupu bez vystupu
                if (pathObj1 != modelPath1) {
                    isOk = false;
                    if (isEPC) {
                        output_vykonCluster_OUT.push(vykonCluster_OUT_ObjDef);
                        //ko_output(modelName, modelGuid,"yy" +counter+ getString("TEXT_RULE_22B_LABEL"), getString("TEXT_RULE_22_EPC_OUTPUT"), vykonCluster_OUT_Name + " [" + vykonCluster_OUT_ObjDef.Type() + "]", formatstring1(getString("TEXT_RULE_22_OUTPUT_DESC"), vykonCluster_OUT_ObjDef.Type()));
                    } else {
                        output_vykonCluster_OUT.push(vykonCluster_OUT_ObjDef);
                        // ko_output(modelName, modelGuid,"yy"+ getString("TEXT_RULE_22B_LABEL"), getString("TEXT_RULE_22_MTPH_OUTPUT"), vykonCluster_OUT_Name + " [" + vykonCluster_OUT_ObjDef.Type() + "]", formatstring1(getString("TEXT_RULE_22_OUTPUT_DESC"), vykonCluster_OUT_ObjDef.Type()));
                    }
                }
                //  } //if
            }
        }
    }

    //remove duplicty from output 
    output_vykonCluster_OUT = ArisData.sort(output_vykonCluster_OUT, Constants.AT_NAME, g_loc);
    output_vykonCluster_OUT = ArisData.Unique(output_vykonCluster_OUT);

    for (var o = 0; o < output_vykonCluster_OUT.length; o++) {
        var occsInModel = output_vykonCluster_OUT[o].OccListInModel(model);
        ko_output(modelName, modelGuid, getString("TEXT_RULE_22B_LABEL"), getString("TEXT_RULE_22_EPC_OUTPUT"), output_vykonCluster_OUT[o].Name(g_loc) + " [" + output_vykonCluster_OUT[o].Type() + "]"/*(" + occsInModel.length + ")"*/, formatstring1(getString("TEXT_RULE_22_OUTPUT_DESC"), output_vykonCluster_OUT[o].Type()));
    }

     //show duplicity
    // var current = null;
    // var count = 0;
    // 
    // for(var i = 0; i < output_vykonCluster_OUT.length; i++)
    // {
    // if(output_vykonCluster_OUT[i].GUID() != current)
    // {
    // if(count > 0)
    // {
    // //document.write(current + " " + count + "<br/>");
    // ko_output(modelName, modelGuid,"ss" +counter+ getString("TEXT_RULE_22B_LABEL"), getString("TEXT_RULE_22_EPC_OUTPUT"), output_vykonCluster_OUT[i].Name(g_loc) + " [" + output_vykonCluster_OUT[i].Type() + "]("+count+")", formatstring1(getString("TEXT_RULE_22_OUTPUT_DESC"), output_vykonCluster_OUT[i].Type()));
    // 
    // }
    // current = output_vykonCluster_OUT[i].GUID();
    // count = 1;
    // }
    // else
    // {
    // count++;
    // }
    // }
    // 
    // if(count > 0)
    // {
    // // document.write(current + " " + count);
    // //ko_output(modelName, modelGuid,"ss" +counter+ getString("TEXT_RULE_22B_LABEL"), getString("TEXT_RULE_22_EPC_OUTPUT"), output_vykonCluster_OUT[i].Name(g_loc) + " [" + output_vykonCluster_OUT[i].Type() + "]("+count+")", formatstring1(getString("TEXT_RULE_22_OUTPUT_DESC"), output_vykonCluster_OUT[i].Type()));
    // 
    // }
    // 


    if (isOk) {
        if (isEPC) ok_output(modelName, modelGuid, getString("TEXT_RULE_22B_LABEL"), getString("TEXT_RULE_22_EPC_OUTPUT"), "", "");
        else ok_output(modelName, modelGuid, getString("TEXT_RULE_22B_LABEL"), getString("TEXT_RULE_22_MTPH_OUTPUT"), "", "");
    }

}

/*************************** Rule 22 ***********************/
/*

const dif1 = [1,2,3,4,5,6].diff( [3,4,5] );  
dif1; // => [1, 2, 6]    
 const fruits = ['apple', 'banana', 'mango', 'guava'];

function checkAvailability(arr, val) {
  return arr.some(function(arrVal) {
    return val === arrVal;
  });
}

checkAvailability(fruits, 'kela');   // false
checkAvailability(fruits, 'banana'); // true  

**/
/**************************** Rule 23 ***********************/
function rule_23(model, modelName, modelGuid) {
    var oObjOccs = getFuncFromModel(model, Constants.ST_VAL_ADD_CHN_SML_2);
    var isOk = true;
    var sProcesni = ArisData.ActiveFilter().AttrValueType(attr_TypUkazatele, procesni)
    var sProduktovy = ArisData.ActiveFilter().AttrValueType(attr_TypUkazatele, produktovy);
    if (oObjOccs.length > 0) {
        for (var i = 0; i < oObjOccs.length; i++) {
            var oObjOcc = oObjOccs[i];
            var object_Name = oObjOcc.ObjDef().Name(g_loc);
            var count = 0;
            var countProcesni = 0;
            var countProduktovy = 0;
            var cxns = oObjOcc.Cxns(Constants.EDGES_OUT, Constants.EDGES_ALL);
            for (var j = 0; j < cxns.length; j++) {
                var targetObjOcc = cxns[j].TargetObjOcc()
                if (targetObjOcc.SymbolNum() == Constants.ST_KPI) {
                    var typUkazatele = targetObjOcc.ObjDef().Attribute(attr_TypUkazatele, g_loc).getValue();
                    if (typUkazatele == sProcesni) countProcesni++;
                    if (typUkazatele == sProduktovy) countProduktovy++;
                    count++;
                }
            }
            if (count < 2) { //two and more KPIS are allowed 
                ko_output(modelName, modelGuid, getString("TEXT_RULE_23_LABEL"), getString("TEXT_RULE_23"), object_Name + " [" + oObjOcc.SymbolName() + "]", getString("TEXT_RULE_23_DETAIL"));
                isOk = false;
            }
            if (count >= 2) {
                if (countProcesni < 1 && countProduktovy < 1) { //two and more KPIS are allowed 
                    ko_output(modelName, modelGuid, getString("TEXT_RULE_23_LABEL"), getString("TEXT_RULE_23"), object_Name + " [" + oObjOcc.SymbolName() + "]", getString("TEXT_RULE_23_TYPY_UKAZATELE"));
                    isOk = false;
                }
            }
        }
    }
    if (isOk) {
        ok_output(modelName, modelGuid, getString("TEXT_RULE_23_LABEL"), getString("TEXT_RULE_23"), "", "");
    }
}
/**************************** Rule 23 ***********************/
/**************************** Rule 23 ***********************/
/*
 * Kontrola vícenásobné vazby "provádí" objektu (procesní role, funkční místo, organizační jednotka) napojené na objekt typu činnost
 */
function rule_vicenasobnaVazbaNaCinnost(model, modelName, modelGuid) {
    const SM_symbolColor_Funkce = 9895830; //occ.getColor() //only green func
    var isOk = true;
    var oObjOccs = model.ObjOccListBySymbol(Constants.ST_FUNC);
   // oObjOccs = ArisData.sort(oObjOccs, Constants.AT_NAME, Constants.SORT_NONE, g_loc);
    oObjOccs = ArisData.sort(oObjOccs, Constants.AT_NAME, attr_chapter, g_loc);
    for (var i = 0; i < oObjOccs.length; i++) {
        var oObjDef = oObjOccs[i].ObjDef();
        var object_Name = oObjDef.Name(g_loc);
        var countCnx = 0;
        var sourceNames = "";
        if (oObjOccs[i].getColor() == symbolColor_Green) {
            var cxns = oObjOccs[i].CxnOccList();
            for (var j = 0; j < cxns.length; j++) {
                if (cxns[j].getDefinition().TypeNum() == Constants.CT_EXEC_1 || cxns[j].getDefinition().TypeNum() == Constants.CT_EXEC_2) { //provádí
                    var sourceOcc = cxns[j].getSource();
                     if ([Constants.ST_JOB_DESC, Constants.ST_POS, Constants.ST_ORG_UNIT_1, Constants.ST_PERS_EXT].contains(sourceOcc.SymbolNum())) {
                        countCnx++;
                        sourceNames += sourceOcc.ObjDef().Name(g_loc) + "[" + sourceOcc.ObjDef().Type() + "] ";
                    }
                }
            } //for
            if (countCnx > 1){ 
             
                if(oObjDef.Attribute(attr_chapter, g_loc).IsMaintained())
                    var chapterKey = oObjDef.Attribute(attr_chapter, g_loc).getValue() + " ";
             
            ko_output_warning(modelName, modelGuid, getString("TEXT_RULE_24_LABEL"), getString("TEXT_RULE_24"), chapterKey + object_Name + " [" + oObjDef.Type() + "]", "Počet vazeb: " + countCnx + " " + sourceNames);
            isOk = false;
            }
        }
    }
    if (isOk) {
        ok_output(modelName, modelGuid, getString("TEXT_RULE_24_LABEL"), getString("TEXT_RULE_24"), "", "");
    }
}

function createFirstSheetHeader() {
    outfile.BeginTable(100, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_LEFT, 0);
    outfile.TableRow();
    outfile.TableCellF(getString("TEXT_MODEL_NAME"), 50, "RULE_HEADER");
    outfile.TableCellF(getString("TEXT_GUID"), 20, "RULE_HEADER");
    // outfile.TableCellF(getString("TEXT_SAP_ID"), 50, "RULE_HEADER");
    outfile.TableCellF(getString("TEXT_RULES"), 20, "RULE_HEADER");
    outfile.TableCellF(getString("TEXT_RULE_NAME"), 60, "RULE_HEADER");
    outfile.TableCellF(getString("TEXT_CHECK_RESULT"), 50, "RULE_HEADER");
    //20190416 RV
    outfile.TableCellF(getString("TEXT_OBJECT_NAME"), 50, "RULE_HEADER");
    outfile.TableCellF(getString("TEXT_DETAILS"), 50, "RULE_HEADER");
}

function createFirstSheetFooter(name_m) {
    outfile.TableRow();
    //jmeno listu
    outfile.EndTable(name_m, 100, "Arial", 12, Constants.C_GREY_25_PERCENT, Constants.C_TRANSPARENT, 0, Constants.FMT_LEFT | Constants.FMT_ITALIC, 0);
}

function createRuleOverviewSheet() {
    outfile.BeginTable(100, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_LEFT, 0);
    outfile.TableRow();
    outfile.TableCellF(getString("TEXT_RULE_NUM"), 20, "RULE_HEADER");
    // outfile.TableCellF(getString("TEXT_RULE_IS_ACTIVE"), 20, "RULE_HEADER");
    outfile.TableCellF(getString("TEXT_RULE_NAME"), 80, "RULE_HEADER");
    outfile.TableCellF(getString("TEXT_RULE_DETAIL"), 120, "RULE_HEADER");
    outfile.TableRow();


    for (var j = 0; j < rulesToExecute.length; j++) {
        var rule = rulesToExecute[j];
        switch (rule) {
            case 0:
                // rule_0(model, name_m, GUID_m); // Max 15 Process steps inside a Model	                             Script rule 0

                outfile.TableCellF(0, 20, "TABLE_CELL");
                // if ((rulesToExecute.contains(0) == true)) outfile.TableCellF("✓", 20, "TABLE_CELL_GREEN");
                //  else outfile.TableCellF("✗", 20, "TABLE_CELL_RED");
                outfile.TableCellF(getString("TEXT_RULE_0"), 60, "TABLE_CELL_LEFT");
                outfile.TableCellF(getString("TEXT_RULE_0_DETAIL"), 120, "TABLE_CELL_LEFT");
                outfile.TableRow();
                break;
            case 1:
                // rule_6(model, name_m, GUID_m); // Name of Modell is similar than name of superior object
                outfile.TableCellF(1, 20, "TABLE_CELL");
                //if ((rulesToExecute.contains(1) == true)) outfile.TableCellF("✓", 20, "TABLE_CELL_GREEN");
                //else outfile.TableCellF("✗", 20, "TABLE_CELL_RED");
                outfile.TableCellF(getString("TEXT_RULE_6"), 60, "TABLE_CELL_LEFT");
                if (isEPC) {
                    outfile.TableCellF(getString("TEXT_RULE_6_DETAIL_EPC"), 120, "TABLE_CELL_LEFT");
                } else outfile.TableCellF(getString("TEXT_RULE_6_DETAIL_VACD"), 120, "TABLE_CELL_LEFT");
                outfile.TableRow();
                break;
            case 2:
                // rule_2(allObjDefList, name_m, GUID_m); // The naming of the objects are correct (unnamed objects)	     Script rule 2
                outfile.TableCellF(2, 20, "TABLE_CELL");
                outfile.TableCellF(getString("TEXT_RULE_2"), 60, "TABLE_CELL_LEFT");
                outfile.TableCellF("", 120, "TABLE_CELL_LEFT");
                outfile.TableRow();
                break;
            case 3:
                //rule_3(model, allObjOccs, name_m, GUID_m); // Symbols are located correctly  (Roles at the right, Requirements, System, Transaction Data inside the FAD
                //rule_3a(model, name_m, GUID_m); //Check if the model is placed in 001 … folder and not in 003 Modellierungsprojekte
                outfile.TableCellF(3, 20, "TABLE_CELL");
                outfile.TableCellF(getString("TEXT_RULE_3A"), 60, "TABLE_CELL_LEFT");
                outfile.TableCellF(getString("TEXT_RULE_3A_DETAIL"), 120, "TABLE_CELL_LEFT");
                outfile.TableRow();

                break;
            case 4:
                // rule_4(model, allObjOccs, name_m, GUID_m); // The model header is used
                outfile.TableCellF(4, 20, "TABLE_CELL");
                // if ((rulesToExecute.contains(4) == true)) outfile.TableCellF("✓", 20, "TABLE_CELL_GREEN");
                // else outfile.TableCellF("✗", 20, "TABLE_CELL_RED");
                outfile.TableCellF(getString("TEXT_RULE_4"), 60, "TABLE_CELL_LEFT");
                outfile.TableCellF(getString("TEXT_RULE_4_DETAIL"), 120, "TABLE_CELL_LEFT");
                outfile.TableRow()
                break;
            case 5:
                //rule_5(model, name_m, GUID_m); // Check if the connector rules are used correctly
                outfile.TableCellF(5, 20, "TABLE_CELL");
                //if ((rulesToExecute.contains(5) == true)) outfile.TableCellF("✓", 20, "TABLE_CELL_GREEN");
                //else outfile.TableCellF("✗", 20, "TABLE_CELL_RED");
                outfile.TableCellF(getString("TEXT_RULE_5"), 60, "TABLE_CELL_LEFT");
                outfile.TableCellF(getString("TEXT_RULE_5_DETAIL") + "\n" + getString("TEXT_RULE_13_DETAIL"), 120, "TABLE_CELL_LEFT");
                outfile.TableRow();
                break;
            case 6:
                // rule_1(model, name_m, GUID_m); // Event can't follow event                                          Script rule 1
                outfile.TableCellF(6, 20, "TABLE_CELL");
                outfile.TableCellF(getString("TEXT_RULE_6"), 60, "TABLE_CELL_LEFT");
                outfile.TableCellF("", 120, "TABLE_CELL_LEFT");
                outfile.TableRow();
                outfile.TableCellF(6, 20, "TABLE_CELL");
                if ((rulesToExecute.contains(6) == true)) outfile.TableCellF("✓", 20, "TABLE_CELL_GREEN");
                else outfile.TableCellF("✗", 20, "TABLE_CELL_RED");
                outfile.TableCellF(getString("TEXT_RULE_1"), 60, "TABLE_CELL_LEFT");
                outfile.TableCellF(getString("TEXT_RULE_1_DETAIL"), 120, "TABLE_CELL_LEFT");
                outfile.TableRow();
                break;
            case 7:
                //rule_7(allObjOccs, name_m, GUID_m); // Description of objects is maintained                 Script rule 7
                outfile.TableCellF(7, 20, "TABLE_CELL");
                // if ((rulesToExecute.contains(7) == true)) outfile.TableCellF("✓", 20, "TABLE_CELL_GREEN");
                // else outfile.TableCellF("✗", 20, "TABLE_CELL_RED");
                outfile.TableCellF(getString("TEXT_RULE_7"), 60, "TABLE_CELL_LEFT");
                outfile.TableCellF(getString("TEXT_RULE_7_DETAIL"), 120, "TABLE_CELL_LEFT");
                outfile.TableRow();
                break;
            case 8:
                //rule_8(model, allObjOccs, name_m, GUID_m); // Process Interface
                outfile.TableCellF(8, 20, "TABLE_CELL");
                // if ((rulesToExecute.contains(8) == true)) outfile.TableCellF("✓", 20, "TABLE_CELL_GREEN");
                // else outfile.TableCellF("✗", 20, "TABLE_CELL_RED");
                outfile.TableCellF(getString("TEXT_RULE_8"), 60, "TABLE_CELL_LEFT");
                outfile.TableCellF(getString("TEXT_RULE_8_DETAIL"), 120, "TABLE_CELL_LEFT");
                outfile.TableRow();
                break;
            case 9:
                // rule_9(model, name_m, GUID_m); // Start- and end nodes shall be Event or Process interface
                outfile.TableCellF(9, 20, "TABLE_CELL");
                //if ((rulesToExecute.contains(9) == true)) outfile.TableCellF("✓", 20, "TABLE_CELL_GREEN");
                //else outfile.TableCellF("✗", 20, "TABLE_CELL_RED");
                outfile.TableCellF(getString("TEXT_RULE_9"), 60, "TABLE_CELL_LEFT");
                outfile.TableCellF(getString("TEXT_RULE_9_DETAIL"), 120, "TABLE_CELL_LEFT");
                outfile.TableRow();
                break;
            case 10:
                // rule_10(allObjOccs, model, name_m, GUID_m); // All remaining events are definition copies
                outfile.TableCellF(10, 20, "TABLE_CELL");
                // if ((rulesToExecute.contains(10) == true)) outfile.TableCellF("✓", 20, "TABLE_CELL_GREEN");
                // else outfile.TableCellF("✗", 20, "TABLE_CELL_RED");
                outfile.TableCellF(getString("TEXT_RULE_10"), 60, "TABLE_CELL_LEFT");
                outfile.TableCellF(getString("TEXT_RULE_10_DETAIL"), 120, "TABLE_CELL_LEFT");
                outfile.TableRow();
                break;
            case 11:
                // rule_11(model, name_m, GUID_m); // Check mandatory modell attributes (fullfillment)
                outfile.TableCellF(11, 20, "TABLE_CELL");
                // if ((rulesToExecute.contains(11) == true)) outfile.TableCellF("✓", 20, "TABLE_CELL_GREEN");
                // else outfile.TableCellF("✗", 20, "TABLE_CELL_RED");
                outfile.TableCellF(getString("TEXT_RULE_11"), 60, "TABLE_CELL_LEFT");
                outfile.TableCellF(getString("TEXT_RULE_11_DETAIL"), 120, "TABLE_CELL_LEFT");
                outfile.TableRow();
                break;
            case 12:
                // rule_12(model, allObjOccs, name_m, GUID_m); // Check objects withou cxn
                outfile.TableCellF(12, 20, "TABLE_CELL");
                // if ((rulesToExecute.contains(12) == true)) outfile.TableCellF("✓", 20, "TABLE_CELL_GREEN");
                // else outfile.TableCellF("✗", 20, "TABLE_CELL_RED");
                outfile.TableCellF(getString("TEXT_RULE_12"), 60, "TABLE_CELL_LEFT");
                outfile.TableCellF(getString("TEXT_RULE_12_DETAIL"), 120, "TABLE_CELL_LEFT");
                outfile.TableRow();
                break;
            case 13:
                //rule_13(model, name_m, GUID_m); // Check function & Event objects with >1 cxns
                outfile.TableCellF(13, 20, "TABLE_CELL");
                if ((rulesToExecute.contains(13) == true))
                    outfile.TableCellF("✓", 20, "TABLE_CELL_GREEN");
                else
                    outfile.TableCellF("✗", 20, "TABLE_CELL_RED");
                outfile.TableCellF(getString("TEXT_RULE_13"), 60, "TABLE_CELL_LEFT");
                outfile.TableCellF(getString("TEXT_RULE_13_DETAIL"), 120, "TABLE_CELL_LEFT");
                outfile.TableRow();
                break;
            case 14:
                // rule_14(model, allObjOccs, name_m, GUID_m); // Check objects which have a relationships connected with two ocurranes of the same definition
                outfile.TableCellF(14, 20, "TABLE_CELL");
                //if ((rulesToExecute.contains(14) == true)) outfile.TableCellF("✓", 20, "TABLE_CELL_GREEN");
                //else outfile.TableCellF("✗", 20, "TABLE_CELL_RED");
                outfile.TableCellF(getString("TEXT_RULE_14"), 60, "TABLE_CELL_LEFT");
                outfile.TableCellF(getString("TEXT_RULE_14_DETAIL"), 120, "TABLE_CELL_LEFT");
                outfile.TableRow();
                break;
            case 15:
                // rule_15(model, allObjOccs, name_m, GUID_m); // Check the correctness of the process Level model attribute.
                outfile.TableCellF(15, 20, "TABLE_CELL");
                outfile.TableCellF(getString("TEXT_RULE_15"), 60, "TABLE_CELL_LEFT");
                outfile.TableCellF("", 120, "TABLE_CELL_LEFT");
                outfile.TableRow();
                break;
            case 16:
                // rule_16(model, name_m, GUID_m); // Checks whether all objects of type Committee, Role, OE, IT system and Document contained in process models are in Master data (diagrams)
                outfile.TableCellF(16, 20, "TABLE_CELL");
                outfile.TableCellF(getString("TEXT_RULE_16"), 60, "TABLE_CELL_LEFT");
                outfile.TableCellF(getString("TEXT_RULE_16_DETAIL"), 120, "TABLE_CELL_LEFT");
                outfile.TableRow();
                break;
            case 17:
                // rule_17(model, name_m, GUID_m); //Process object in top level process models without detail process models
                outfile.TableCellF(17, 20, "TABLE_CELL");
                // if ((rulesToExecute.contains(17) == true)) outfile.TableCellF("✓", 20, "TABLE_CELL_GREEN");
                // else outfile.TableCellF("✗", 20, "TABLE_CELL_RED");
                outfile.TableCellF(getString("TEXT_RULE_17"), 60, "TABLE_CELL_LEFT");
                outfile.TableCellF(getString("TEXT_RULE_17_DETAIL"), 120, "TABLE_CELL_LEFT");
                outfile.TableRow();
                break;
            case 18:
                // rule_18(allObjOccs, model); //Check keeping standard object formating - object size + font settings without changes 
                outfile.TableCellF(18, 20, "TABLE_CELL");
                //if ((rulesToExecute.contains(18) == true)) outfile.TableCellF("✓", 20, "TABLE_CELL_GREEN");
                //else outfile.TableCellF("✗", 20, "TABLE_CELL_RED");
                outfile.TableCellF(getString("TEXT_RULE_18"), 60, "TABLE_CELL_LEFT");
                outfile.TableCellF(getString("TEXT_RULE_18_DETAIL"), 120, "TABLE_CELL_LEFT");
                outfile.TableRow();
                break;
            case 19:
                //  rule_19(allObjOccs, name_m, GUID_m); //Check connections placement between objects
                outfile.TableCellF(19, 20, "TABLE_CELL");
                //if ((rulesToExecute.contains(19) == true)) outfile.TableCellF("✓", 20, "TABLE_CELL_GREEN");
                //else outfile.TableCellF("✗", 20, "TABLE_CELL_RED");
                outfile.TableCellF(getString("TEXT_RULE_19"), 60, "TABLE_CELL_LEFT");
                outfile.TableCellF(getString("TEXT_RULE_19_DETAIL"), 120, "TABLE_CELL_LEFT");
                outfile.TableRow();
                break;
            case 20:
                //  rule_20(model, name_m, GUID_m); //Check I/O cxns 
                outfile.TableCellF(20, 20, "TABLE_CELL");
                // if ((rulesToExecute.contains(20) == true)) outfile.TableCellF("✓", 20, "TABLE_CELL_GREEN");
                // else outfile.TableCellF("✗", 20, "TABLE_CELL_RED");
                if (isEPC)
                    outfile.TableCellF(getString("TEXT_RULE_20_EPC"), 60, "TABLE_CELL_LEFT");
                else
                    outfile.TableCellF(getString("TEXT_RULE_20_MTPH"), 60, "TABLE_CELL_LEFT");

                if (isEPC) outfile.TableCellF(getString("TEXT_RULE_20_DETAIL_EPC"), 120, "TABLE_CELL_LEFT");
                else outfile.TableCellF(getString("TEXT_RULE_20_DETAIL_MTPH"), 120, "TABLE_CELL_LEFT");
                outfile.TableRow();
                break;
            case 21:
                //  rule_21(model, name_m, GUID_m); //DataLink objdef in Library
                outfile.TableCellF(21, 20, "TABLE_CELL");
                // if ((rulesToExecute.contains(21) == true)) outfile.TableCellF("✓", 20, "TABLE_CELL_GREEN");
                // else outfile.TableCellF("✗", 20, "TABLE_CELL_RED");
                outfile.TableCellF(getString("TEXT_RULE_21"), 60, "TABLE_CELL_LEFT");
                outfile.TableCellF(getString("TEXT_RULE_21_DETAIL"), 120, "TABLE_CELL_LEFT");
                outfile.TableRow();
                break;
            case "22a":
                // rule_22(model, name_m, GUID_m); //Object in folder model
                outfile.TableCellF("22a", 20, "TABLE_CELL");
                //if ((rulesToExecute.contains(22) == true)) outfile.TableCellF("✓", 20, "TABLE_CELL_GREEN");
                // else outfile.TableCellF("✗", 20, "TABLE_CELL_RED");
                if (isEPC)
                    outfile.TableCellF(getString("TEXT_RULE_22_EPC_INPUT"), 60, "TABLE_CELL_LEFT");
                else
                    outfile.TableCellF(getString("TEXT_RULE_22_MTPH_INPUT"), 60, "TABLE_CELL_LEFT");

                outfile.TableCellF(getString("TEXT_RULE_22_DETAIL_INPUT"), 120, "TABLE_CELL_LEFT");
                outfile.TableRow();
                break;
            case "22b":
                // rule_22(model, name_m, GUID_m); //Object in folder model
                outfile.TableCellF("22b", 20, "TABLE_CELL");
                //if ((rulesToExecute.contains(22) == true)) outfile.TableCellF("✓", 20, "TABLE_CELL_GREEN");
                // else outfile.TableCellF("✗", 20, "TABLE_CELL_RED");
                if (isEPC)
                    outfile.TableCellF(getString("TEXT_RULE_22_EPC_OUTPUT"), 60, "TABLE_CELL_LEFT");
                else
                    outfile.TableCellF(getString("TEXT_RULE_22_MTPH_OUTPUT"), 60, "TABLE_CELL_LEFT");

                outfile.TableCellF(getString("TEXT_RULE_22_DETAIL_OUTPUT"), 120, "TABLE_CELL_LEFT");
                outfile.TableRow();
                break;

            case 23:
                // rule_23(model, name_m, GUID_m); //Kontrola ukazatele procesu
                outfile.TableCellF(23, 20, "TABLE_CELL");
                //if ((rulesToExecute.contains(23) == true)) outfile.TableCellF("✓", 20, "TABLE_CELL_GREEN");
                //else outfile.TableCellF("✗", 20, "TABLE_CELL_RED");
                outfile.TableCellF(getString("TEXT_RULE_23"), 60, "TABLE_CELL_LEFT");
                outfile.TableCellF(getString("TEXT_RULE_23_DETAIL"), 120, "TABLE_CELL_LEFT");
                outfile.TableRow();
                break;
            case 24:
                // rule_vicenasobnaVazbaNaCinnost(model, name_m, GUID_m); //Kontrola vícenásobné vazby "provádí" objektu (procesní role, funkční místo, organizační jednotka) napojené na objekt typu činnost
                outfile.TableCellF(24, 20, "TABLE_CELL");
                // if ((rulesToExecute.contains(24) == true)) outfile.TableCellF("✓", 20, "TABLE_CELL_GREEN");
                // else outfile.TableCellF("✗", 20, "TABLE_CELL_RED");
                outfile.TableCellF(getString("TEXT_RULE_24"), 60, "TABLE_CELL_LEFT");
                outfile.TableCellF(getString("TEXT_RULE_24_DETAIL"), 120, "TABLE_CELL_LEFT");
                outfile.TableRow();
                break;
        }
    }
    //jmeno listu
    outfile.EndTable(getString("TEXT_RULES_OVERVIEW"), 100, "Arial", 12, Constants.C_GREY_50_PERCENT, Constants.C_TRANSPARENT, 0, Constants.FMT_LEFT | Constants.FMT_ITALIC, 0);
}

/**
 * Genreal status row to xls
 */
function ok_output(modelName, modelGuid, ruleLabel, rule, object, detailInfo) {
    outfile.TableCellF(modelName + " (" + model_type + ")", 50, "TABLE_CELL_GREY");
    outfile.TableCellF(modelGuid, 20, "TABLE_CELL_GREY_CENTER");
    //outfile.TableCellF("", 25, "TABLE_CELL");
    outfile.TableCellF(ruleLabel, 22, "TABLE_CELL");
    outfile.TableCellF(rule, 60, "TABLE_CELL_LEFT");
    outfile.TableCellF("✓ ", 20, "TABLE_CELL_GREEN");
    //2019041 RV added obejct name
    outfile.TableCellF(object, 40, "TABLE_CELL_LEFT");
    //if (object == "" || object == "-") {
    outfile.TableCellF(detailInfo, 100, "TABLE_CELL_LEFT");
    //} else
    // outfile.TableCellF(/*'"' + object + '" '*/ + detailInfo, 100, "TABLE_CELL_LEFT");
    outfile.TableRow();
}

function ok_output2(ruleLabel, rule, object, detailInfo) {
    outfile.TableCellF("", 50, "Arial", 10, Constants.C_BLACK, Constants.C_WHITE, 0, Constants.FMT_BOLD | Constants.FMT_LEFT | Constants.FMT_VTOP, 0);
    outfile.TableCellF("", 20, "TABLE_CELL");
    //outfile.TableCellF("", 25, "TABLE_CELL");
    outfile.TableCellF(ruleLabel, 22, "TABLE_CELL");
    outfile.TableCellF(rule, 60, "TABLE_CELL_LEFT");
    outfile.TableCellF("✓ ", 20, "TABLE_CELL_GREEN");
    //2019041 RV added obejct name
    outfile.TableCellF(object, 40, "TABLE_CELL_LEFT");
    if (object == "" || object == "-") {
        outfile.TableCellF(detailInfo, 100, "TABLE_CELL_LEFT");
    } else outfile.TableCellF( /*'"' + object + '", ' +*/ detailInfo, 100, "TABLE_CELL_LEFT");
    outfile.TableRow();
}

function ko_output(modelName, modelGuid, ruleLabel, rule, object, detailInfo) {
    outfile.TableCellF(modelName + " (" + model_type + ")", 50, "TABLE_CELL_GREY");
    outfile.TableCellF(modelGuid, 20, "TABLE_CELL_GREY_CENTER");
    //outfile.TableCellF("", 25, "TABLE_CELL");
    outfile.TableCellF(ruleLabel, 22, "TABLE_CELL");
    outfile.TableCellF(rule, 60, "TABLE_CELL_LEFT");
    outfile.TableCellF("✗ ", 20, "TABLE_CELL_RED");
    //2019041 RV added object name
    outfile.TableCellF(object, 40, "TABLE_CELL_LEFT");
    if (object == "" || object == "-") {
        outfile.TableCellF(detailInfo, 60, "TABLE_CELL_LEFT");
    } else outfile.TableCellF( /*'"' + object + '" ' +*/ detailInfo, 100, "TABLE_CELL_LEFT");
    outfile.TableRow();
}

function ko_output_warning(modelName, modelGuid, ruleLabel, rule, object, detailInfo) {
    outfile.TableCellF(modelName + " (" + model_type + ")", 50, "TABLE_CELL_GREY");
    outfile.TableCellF(modelGuid, 20, "TABLE_CELL_GREY_CENTER");
    //outfile.TableCellF("", 25, "TABLE_CELL");
    outfile.TableCellF(ruleLabel, 22, "TABLE_CELL");
    outfile.TableCellF(rule, 60, "TABLE_CELL_LEFT");
    outfile.TableCellF("! ", 20, "TABLE_CELL_ORANGE");
    //2019041 RV added object name
    outfile.TableCellF(object, 40, "TABLE_CELL_LEFT");
    if (object == "" || object == "-") {
        outfile.TableCellF(detailInfo, 60, "TABLE_CELL_LEFT");
    } else outfile.TableCellF( /*'"' + object + '" ' +*/ detailInfo, 100, "TABLE_CELL_LEFT");
    outfile.TableRow();
}

function ko_output2(modelName, modelGuid, ruleLabel, rule, object, detailInfo, obeforobj, obehindobj) {
    var sbeforobj = "";
    var sbehindobj = "";
    for (var i = 0; i < obeforobj.length; i++) {
        if (i < obeforobj.length - 1) sbeforobj += obeforobj[i].ObjDef().Name(g_loc) + ", ";
        else sbeforobj += obeforobj[i].ObjDef().Name(g_loc);
    }
    for (var j = 0; j < obehindobj.length; j++) {
        if (j < obehindobj.length - 1) sbehindobj += obehindobj[j].ObjDef().Name(g_loc) + ", ";
        else sbehindobj += obehindobj[j].ObjDef().Name(g_loc);
    }
    outfile.TableCellF(modelName + " (" + model_type + ")", 50, "TABLE_CELL_GREY");
    outfile.TableCellF(modelGuid, 20, "TABLE_CELL_GREY_CENTER");
    //outfile.TableCellF("", 20, "TABLE_CELL");
    outfile.TableCellF(ruleLabel, 22, "TABLE_CELL");
    outfile.TableCellF(rule, 60, "TABLE_CELL_LEFT");
    outfile.TableCellF("? ", 20, "TABLE_CELL_RED");
    //2019041 RV added obejct name
    outfile.TableCellF(object, 40, "TABLE_CELL_LEFT");
    outfile.TableCellF( /*'" ' + detailInfo + " " +*/ getString("TEXT_RULE_5_CNX_OBJECS_BEFORE") + " " + sbeforobj + " " + getString("TEXT_RULE_5_CNX_OBJECS_BEHIND") + " " + sbehindobj, 100, "TABLE_CELL_LEFT");
    outfile.TableRow();
}