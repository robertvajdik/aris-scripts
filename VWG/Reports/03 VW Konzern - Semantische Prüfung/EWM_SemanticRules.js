/**************************** Rule 0 ***********************/
function rule_0(ruleNumber, ruleID, model, model_typeNum, objOccList_func) {
    var isOk = true;

    SemanticCheckConfig["models"].forEach(function(item){
        var modelType = item["typeNum"];
        //if (item["typeNum"] == model_typeNum) {
        if ((modelType.contains(model_typeNum)) == true) {
            if (objOccList_func.length > item["minObjects"] && objOccList_func.length <= item["maxObjects"]) {
                //ok_output
            } else {
  			    if (item["min_maxObjectsEvalSymbol"] == "warning") {
                    warning_output(model, ruleNumber, ruleID, "", getString("RULE_0") + objOccList_func.length);
                } else {
                    ko_output(model, ruleNumber, ruleID, "", getString("RULE_0") + objOccList_func.length);
                }
                isOk = false;
            }
        }
    });
    
  	if (isOk) {
  		ok_output(model, ruleNumber, ruleID, "", "");
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
  //  var CheckedAttr_ProcessLevel = ArisData.ActiveFilter().UserDefinedAttributeTypeNum("eba01f100-0b57-11e8-375a-54ee7539b247"); //Process level of Function object type
  function rule_1(ruleNumber, ruleID, model, superiorObject) {
  	var hashMap_funcTofunc = new Packages.java.util.HashMap();
  	var oobjoccs = model.ObjOccListFilter(Constants.OT_EVT);
  	var odummyoccs = model.ObjOccListFilter(OBJ_PRCSTP);
  	// check the relationships
  	for (var i = 0; i < oobjoccs.length; i++) {
  		var nincxns = (oobjoccs[i].InDegree(Constants.EDGES_STRUCTURE));
  		var noutcxns = (oobjoccs[i].OutDegree(Constants.EDGES_STRUCTURE));
  		var outcxns = oobjoccs[i].OutEdges(Constants.EDGES_STRUCTURE);
  		if (noutcxns >= 1) {
  			for (var j = 0; j < outcxns.length; j++) {
  				var targetOccs = outcxns[j].TargetObjOcc();
  				if (targetOccs.OrgSymbolNum() == Constants.ST_EV)
  					hashMap_funcTofunc.put(oobjoccs[i].ObjDef(), targetOccs.ObjDef());
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
  			ko_output(model, ruleNumber, ruleID, objectName_source, " >> " + objectName_target); //formatstring1(getString("TEXT_RULE_11"), objectName_target)
  		}
  	} else {
  		ok_output(model, ruleNumber, ruleID, "", "");
  	}
  }
  /**************************** Rule 1 ***********************/
  /**************************** Rule 2 ***********************/
  //The naming of the objects are correct (unnamed objects)
  function rule_2(ruleNumber, ruleID, model,allObjOccs) {
  	var namesOK = true;
  	for (var i = 0; i < allObjOccs.length; i++) {
  		var objectName = allObjOccs[i].ObjDef().Attribute(Constants.AT_NAME, g_loc).getValue();
  		var objectName_EN = allObjOccs[i].ObjDef().Attribute(Constants.AT_NAME, g_loc_EN).getValue();
  		var objectName_DE = allObjOccs[i].ObjDef().Attribute(Constants.AT_NAME, g_loc_DE).getValue();
  		var objOcc_sybolNum = allObjOccs[i].SymbolNum();
  		/* if (objectName.length() > 0) {
  		    ok_output(getString("TEXT_RULE_2_LABEL"), getString("TEXT_RULE_2"), objectName, "");
  		} */
  		if ((objectName == "" || objectName == "default") && allObjOccs[i].ObjDef().TypeNum() != Constants.OT_RULE && allObjOccs[i].ObjDef().TypeNum() != Constants.OT_TECH_TRM) {
  			//ko_output(superiorObject, modelName, modelGuid, sapId, getString("TEXT_RULE_2_LABEL"), getString("TEXT_RULE_2"), objectName, "");
  			ko_output(model, ruleNumber, ruleID, formatstring3(getString("TEXT_RULE_2_KO"), objectName_DE, objectName_EN, g_omethodfilter.SymbolName(objOcc_sybolNum)), "GUID: " + allObjOccs[i].ObjDef().GUID());
            
  			namesOK = false;
  		}
  	}
  	if (namesOK) {
  		ok_output(model, ruleNumber, ruleID, "", "");
  	}
  }
  /**************************** Rule 2 ***********************/
  /**************************** Rule 3 ***********************/
  //Symbols are located correctly
  function rule_3(ruleNumber, ruleID, model, allObjOccs, model_typeNum) {
  	var isOk = true;
  	var funcs_inModel = model.ObjOccListFilter(OBJ_PRCSTP);
  	funcs_inModel = ArisData.sort(funcs_inModel, Constants.AT_NAME, g_loc);
  	for (var i = 0; i < funcs_inModel.length; i++) {
  		var func = funcs_inModel[i];
  		if ((func.OrgSymbolNum() != Constants.ST_PRCS_IF)) { //non interface
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
  			if ((FAD_models.contains(model_typeNum) == true)) { //FAD
  				//Roles at the right
  				/* var Role_IsConnected = checkIfFuncRoleisAtRight(nincxns_struc, incxns_struc, func_X);
  				if (nincxns_struc >= 1) {
  					if (Role_IsConnected) { //check if Role exist
  						ko_output(model, ruleNumber, ruleID, object_Name, getString("TEXT_RULE_3_ROLES_USED"));
  						isOk = false;
  					} else if (Role_IsConnected == false) {
  						// ko_output(model, ruleNumber, ruleID, object_Name, getString("TEXT_RULE_3_KO_ROLES"));
  					}
  				} */
  				var objectTypesToCheck = [OBJ_ROL];
                objectTypesToCheck.forEach(function(objectType){
                    var ObjecttypeIsConnected = checkIfFuncHasObjectType(nincxns_struc, incxns_struc, noutcxns_struc, outcxns_struc, objectType);
                    if (ObjecttypeIsConnected) {
                        warning_output(model, ruleNumber, ruleID, object_Name, getString("TEXT_RULE_3_ROLES_USED"));
                        isOk = false;
  				    }
                });
  			}
  			if ((EPC_models.contains(model_typeNum) == true)) { //EPC
  				//Roles at the right for EPC
  				var Role_IsConnected = checkIfFuncRoleisAtRight(nincxns, incxns, func_X);
  				if (nincxns >= 1) {
  					if (Role_IsConnected) { //check if Role exist
  						// ok_output(getString("TEXT_RULE_3_LABEL"), getString("TEXT_RULE_3"), object_Name, getString("TEXT_RULE_3_OK_ROLES"));
  					} else if (Role_IsConnected == false) {
  						ko_output(model, ruleNumber, ruleID, object_Name, getString("TEXT_RULE_3_KO_ROLES"));
  						isOk = false;
  					}
  				} else {
  					//  warning_output(getString("TEXT_RULE_3_LABEL"), getString("TEXT_RULE_3"), "", getString("TEXT_RULE_3_ROLES_USED") + ' "' + object_Name + '"');
  				}
  				var objectTypesToCheck = [OBJ_SYS, OBJ_CLST, OBJ_SCR, OBJ_REQ];
                objectTypesToCheck.forEach(function(objectType){
                    var ObjecttypeIsConnected = checkIfFuncHasObjectType(nincxns, incxns, noutcxns, outcxns, objectType);
                    if (ObjecttypeIsConnected) {
                        ko_output(model, ruleNumber, ruleID, object_Name, formatstring1(getString("TEXT_RULE_3_OK_OBJTYPE_CONNECTED"), aFilter.getItemTypeName(Constants.CID_OBJDEF, objectType)));
                        isOk = false;
  				    }
                });
                
  			} //EPC
  		} //no ST_PRCS_IF
  	}
  	if (isOk) {
  		ok_output(model, ruleNumber, ruleID, "", "");
  	}
  }

  function checkIfFuncHasObjectType(nincxns, incxns, noutcxns, outcxns, otype) {
  	var inOK = false;
  	var outOK = false;
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
  			var occSource = incxns[i].SourceObjOcc();
  			var occSource_X = occSource.X();
  			var occSource_Y = occSource.Y();
  			if (occSource.SymbolNum() == Constants.ST_EMPL_TYPE) {
  				if (occSource_X > func_X) {
  					return true;
  				} else
  					return false;
  			}
  		} //for
  	}
  	return null;
  }
  /**************************** Rule 3 ***********************/
  /**************************** Rule 4 ***********************/
  // The title fragment is available (model header is used)
  function rule_4(ruleNumber, ruleID, model) {
  	var header_zOrderConst = 7; //24
  	var header_NumOfObjConst = 6;
  	var aGfxObjects = model.getGroupings();
  	var isHeaderExist = false;
  	for (var i = 0; i < aGfxObjects.length; i++) {
  		var aGfxObject = aGfxObjects[i];
  		var zOrder = aGfxObject.getZOrder();
  		var members = aGfxObject.getMembers();
  		if (zOrder >= header_zOrderConst && members.length == header_NumOfObjConst) {
  		    ok_output(model, ruleNumber, ruleID, "", "");
  			isHeaderExist = true;
  		} else {
  			isHeaderExist = false;
  			//ko_output(model, ruleNumber, ruleID, "-", "");
  		}
  	}
  	if (!isHeaderExist)
  		ko_output(model, ruleNumber, ruleID, "", getString("TEXT_RULE_4_KO"));
  }
  /**************************** Rule 4 ***********************/
  /**************************** Rule 5 ***********************/
  //Check if the connector rules are used correctly
  function rule_5(ruleNumber, ruleID, model, ofuncoccs) {
  	var isOk = true;
  	var oeventoccs = model.ObjOccListFilter(Constants.OT_EVT);
  	//var ofuncoccs = model.ObjOccListFilter(OBJ_PRCSTP);
  	var oconnectoroccs = model.ObjOccListFilter(Constants.OT_RULE);
  	if (oeventoccs.length > 0) {
  		oeventoccs = ArisData.sort(oeventoccs, Constants.SORT_TYPE, Constants.AT_NAME, Constants.SORT_NONE, g_loc);
  		for (var i = 0; i < oeventoccs.length; i++) {
  			var event = oeventoccs[i];
  			var object_Name = event.ObjDef().Name(g_loc);
  			var ooutcxns = event.OutEdges(Constants.EDGES_STRUCTURE);
  			//rule from EVENT via AND, OR, XOR to FUNC
  			if (ooutcxns.length > 0) {
  				for (var j = 0; j < ooutcxns.length; j++) {
  					if (ooutcxns[j].TargetObjOcc().OrgSymbolNum() == Constants.ST_OPR_OR_1 || ooutcxns[j].TargetObjOcc().OrgSymbolNum() == Constants.ST_OPR_XOR_1) { //not for AND
  						var ncxncount = 0;
  						oruleobj = ooutcxns[j].TargetObjOcc(); //Operators OR, XOR, AND
  						var noutcxns = oruleobj.OutDegree(Constants.EDGES_STRUCTURE);
  						var outcxns = oruleobj.OutEdges(Constants.EDGES_STRUCTURE);
  						var nincxns = oruleobj.InDegree(Constants.EDGES_STRUCTURE);
  						if (nincxns == 1 && noutcxns > 1) { //operator spliting incoming process flow (1) into new branches (>1)
  							ko_output(model, ruleNumber, "rule_52", object_Name, getString("TEXT_RULE_52_EVENT_OPERATORS_1")); //What ever Successors are not correct (Event, Function, Operator)
  							isOk = false;
  						} else if (nincxns > 1 && noutcxns == 1) { //operator mergine incoming process flows (>1) into one outgoing branch (1)
  							for (var k = 0; k < outcxns.length; k++) { //after operator
  								var outcxn = outcxns[k];
  								var targetObjOcc = outcxn.TargetObjOcc();
  								if (targetObjOcc.ObjDef().TypeNum() != OBJ_PRCSTP) {
  									/* ok_output(getString("TEXT_RULE_5_LABEL"), getString("TEXT_RULE_5"), object_Name, getString("TEXT_RULE_5_FUNC_AFTER_OPERATORS"));
                                    } else { */
  									ko_output(model, ruleNumber, "rule_52", object_Name, getString("TEXT_RULE_52_EVENT_OPERATORS_2")); //Successors are not Functions
  									isOk = false;
  								}
  							} //for
  						} else { // other combinations e.g. Event -> OR, XOR with no following objects, 1 Event -> OR, XOR -> 1 object etc.
  							ko_output(model, ruleNumber, "rule_52", object_Name, getString("TEXT_RULE_52_EVENT_OPERATORS_WHATEVER"));
  							isOk = false;
  						}
  					}
  				} //for
  			}
  		}
  	} //if
  	if (ofuncoccs.length > 0) {
  		oruleoccs = ArisData.sort(ofuncoccs, Constants.SORT_TYPE, Constants.AT_NAME, Constants.SORT_NONE, g_loc);
  		for (var i = 0; i < oruleoccs.length; i++) {
  			var func = ofuncoccs[i];
  			var object_Name = func.ObjDef().Name(g_loc);
  			var ooutcxns = func.OutEdges(Constants.EDGES_STRUCTURE);
            //rule from FUNC via AND, OR, XOR to EVENT
            if (ooutcxns.length > 0) {
                for (var j = 0; j < ooutcxns.length; j++) {
                    if (ooutcxns[j].TargetObjOcc().OrgSymbolNum() == Constants.ST_OPR_OR_1 || ooutcxns[j].TargetObjOcc().OrgSymbolNum() == Constants.ST_OPR_XOR_1) {
                        var ncxncount = 0;
                        oruleobj = ooutcxns[j].TargetObjOcc(); //Operators OR, XOR
                        var noutcxns = oruleobj.OutDegree(Constants.EDGES_STRUCTURE);
                        var outcxns = oruleobj.OutEdges(Constants.EDGES_STRUCTURE);
                        var nincxns = oruleobj.InDegree(Constants.EDGES_STRUCTURE);
                        if (nincxns == 1 && noutcxns > 1) { //operator spliting incoming process flow (1) into new branches (>1)
                            for (var k = 0; k < outcxns.length; k++) { //after operator
                                var outcxn = outcxns[k];
                                var targetObjOcc = outcxn.TargetObjOcc();
                                if (targetObjOcc.ObjDef().TypeNum() != Constants.OT_EVT) { //No Function is allowed after [Function -> OR/XOR] triggering new branches
                                    /* ok_output(getString("TEXT_RULE_5_LABEL"), getString("TEXT_RULE_5"), object_Name, getString("TEXT_RULE_5_EVENT_AFTER_OPERATORS"));
                                    } else { */
                                    ko_output(model, ruleNumber, "rule_53", object_Name, "- " + getString("TEXT_RULE_53_FCE_OPERATORS_1"));
                                    isOk = false;
                                }
                            } //for
                        } else if (nincxns > 1 && noutcxns == 1) { //operator merge incoming process flows (>1) into one outgoing branch (1): Simplfified EPC modelling conventions only (EWM)
                            for (var k = 0; k < outcxns.length; k++) { //after operator
                                var outcxn = outcxns[k];
                                var targetObjOcc = outcxn.TargetObjOcc();
                                if (targetObjOcc.ObjDef().TypeNum() != Constants.OT_EVT) { //No Function is allowed after [Function -> OR/XOR] merging branches: Simplified modelling conventions (e.g. EWM) related only
                                    /* ok_output(getString("TEXT_RULE_5_LABEL"), getString("TEXT_RULE_5"), object_Name, getString("TEXT_RULE_5_EVENT_AFTER_OPERATORS"));
                                    } else { */
                                    ko_output(model, ruleNumber, "rule_53", object_Name, "- " + getString("TEXT_RULE_53_FCE_OPERATORS_2"));
                                    isOk = false;
                                }
                            } //for
                        } else { // other combinations e.g. Function -> OR, XOR with no following objects, 1 Function -> OR, XOR -> 1 object etc.
                            ko_output(model, ruleNumber, "rule_53", object_Name, "- " + getString("TEXT_RULE_53_FCE_OPERATORS_WHATEVER"));
                            isOk = false;
                        }
                    }
                } //for
            }
  		}
  	} //if
  	// Logical operators (connectors) - check the number of I/O cxn
  	if (oconnectoroccs.length > 0) {
  		oconnectoroccs = ArisData.sort(oconnectoroccs, Constants.SORT_TYPE, Constants.AT_NAME, Constants.SORT_NONE, g_loc);
  		for (var r = 0; r < oconnectoroccs.length; r++) {
  			var obeforobj = [];
  			var obehindobj = [];
  			var symbol_Name = oconnectoroccs[r].SymbolName();
  			nincxns = oconnectoroccs[r].InDegree(Constants.EDGES_STRUCTURE);
  			noutcxns = oconnectoroccs[r].OutDegree(Constants.EDGES_STRUCTURE);
  			if (!((nincxns == 1 && noutcxns > 1) || (noutcxns == 1 && nincxns > 1))) {
  				getobjbefor(oconnectoroccs[r], obeforobj);
  				getobjbehind(oconnectoroccs[r], obehindobj);
  				// outnumberatconnector(obeforobj.value, oconnectoroccs[j], obehindobj.value, bfirst, evalustruct.oevamodels[i], nrulecount, (evalustruct.nmodelid[i] + 1), evalustruct, outputObject);
                ko_output(model,ruleNumber, "rule_51", formatstring1(getString("TEXT_RULE_SYMBOL_NAME"), symbol_Name), "- " + getString("TEXT_RULE_5_CNX_INPUT_OUTPUT"), obeforobj, obehindobj);
                //  				ko_output2(modelName, model_identifier, modelGuid, sapId, ruleNumber, "rule_51", formatstring1(getString("TEXT_RULE_SYMBOL_NAME"), symbol_Name), "- " + getString("TEXT_RULE_5_CNX_INPUT_OUTPUT"), obeforobj, obehindobj);
  				isOk = false;
  			}
  			//ok_output(ruleNumber, symbol_Name, getString("TEXT_RULE_5_CNX_INPUT_OUTPUT_OK"));
  		}
  	}
  	if (isOk) {
  		ok_output(model, ruleNumber, ruleID, "", "")
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
  function rule_6(ruleNumber, ruleID, model) {
  	var modelName = model.Name(g_loc); // TODO chceck in currect lang
  	var superiorObjects = model.SuperiorObjDefs();
  	for (var i = 0; i < superiorObjects.length; i++) {
  		var superObjec = superiorObjects[i];
  		var superiorObjectName = superObjec.Name(g_loc);
  		if (modelName == superiorObjectName) {
  			ok_output(model, ruleNumber, ruleID, "", "");
  		} else {
  			ko_output(model, ruleNumber, ruleID, "", "");
  		}
  	}
  }
  /**************************** Rule 6 ***********************/
  /**************************** Rule 7 ***********************/
  //Description of objects maintained objects
  function rule_7(ruleNumber, ruleID, model, allObjDefList ) {
  	var isOk = true;
  	for (var i = 0; i < allObjDefList.length; i++) {
  		var objDef = allObjDefList[i];
  		//if ([Constants.OT_EVT, Constants.OT_FUNC, Constants.OT_INFO_CARR, Constants.OT_PERS_TYPE, Constants.OT_REQUIREMENT].contains(objDef.TypeNum()) == true) {
  		if ([OBJ_PRCSTP, Constants.OT_REQUIREMENT].contains(objDef.TypeNum()) == true) {
  			var nameObj = objDef.Name(g_loc);
  			var nameObj_desc = objDef.Attribute(Constants.AT_DESC, g_loc).getValue();
  			if (nameObj_desc.length() > 0) {
  				//ok_output(getString("TEXT_RULE_7_LABEL"), getString("TEXT_RULE_7"), nameObj, ": " + nameObj_desc);
  			} else {
  				ko_output(model, ruleNumber, ruleID, nameObj, getString("TEXT_7_DETAILS"));
  				isOk = false;
  			}
  		}
  	} //for
  	if (isOk) {
  		ok_output(model, ruleNumber, ruleID, "", "");
  	}
  }
  /**************************** Rule 7 ***********************/
  /**************************** Rule 8 ***********************/
  //Process Interface sem_check
  function rule_8(ruleNumber, ruleID, model, allObjOccs) {
  	//Process interface is a copy of a L3 Process object
  	var ofuncoccs = model.ObjOccListFilter(OBJ_PRCSTP);
  	var isOk = true;
  	if (ofuncoccs.length > 0) {
  		ofuncoccs = ArisData.sort(ofuncoccs, Constants.SORT_TYPE, Constants.AT_NAME, Constants.SORT_NONE, g_loc);
  		for (var i = 0; i < ofuncoccs.length; i++) {
  			var func = ofuncoccs[i];
  			var funcObjDef = ofuncoccs[i].ObjDef();
  			if (func.SymbolNum() == Constants.ST_PRCS_IF) { //interface
  				var object_Name = funcObjDef.Name(g_loc);
  				if (!funcObjDef.Attribute(ATTR_OutOfScopeProcess, g_loc).IsMaintained() || funcObjDef.Attribute(ATTR_OutOfScopeProcess, g_loc).getValue().length() === 0) { //exclude process interfaces marked as out of scope (ba attr)
  					var processLevel = funcObjDef.Attribute(attr_processLevel, g_loc).getValue();
  					var assignedModelsEPC = funcObjDef.AssignedModels(EPC_models);
  					//var assignedModelsVACD = funcObjDef.AssignedModels([Constants.MT_VAL_ADD_CHN_DGM]); //ToDo: má kontrolovat výskyt v libovoelném VACD, ne připojené lib. VACD!
  					var occListInModels = funcObjDef.OccList(); //List of models where obj is occuring
  					var occListInModelsVACD = [];
  					for (var k = 0; k < occListInModels.length; k++) { // get list of VACD model types only
  						if (occListInModels[k].Model().TypeNum() == Constants.MT_VAL_ADD_CHN_DGM) {
  							occListInModelsVACD.push(occListInModels[k]);
  						}
  					}
  					if (processLevel == 5 && occListInModelsVACD.length > 0 && assignedModelsEPC.length > 0) {
  						// ok_output(getString("TEXT_RULE_8_LABEL"), getString("TEXT_RULE_8_PROCESS_INTERFACE_CHECK"), object_Name, getString("TEXT_RULE_8_PROCESS_INTERFACE_PROCESS_LEVEL") + ": " + processLevel);
  					}
  					if (processLevel != 5) {
  						ko_output(model, ruleNumber, "rule_81", object_Name, formatstring1(getString("TEXT_RULE_8_PROCESS_INTERFACE_PROCESS_LEVEL"), processLevel));
  						isOk = false;
  					}
  					if (assignedModelsEPC.length == 0) {
  						ko_output(model, ruleNumber, "rule_81", object_Name, getString("TEXT_RULE_8_PROCESS_INTERFACE_NOEPC"));
  						isOk = false;
  					}
  					if (occListInModelsVACD.length == 0) {
  						ko_output(model, ruleNumber, "rule_81", object_Name, getString("TEXT_RULE_8_PROCESS_INTERFACE_NOVACD"));
  						isOk = false;
  					}
  				}
  			} //if
  		} //for
  	}
  	//part 2 check start process interfaces
  	//Process interface is connected to an event of the predecessor or successor process
  	model.BuildGraph(true);
  	// check start nodes
  	var oobjoccs = model.StartNodeList();
  	if (oobjoccs.length > 0) {
  		oobjoccs = ArisData.sort(oobjoccs, Constants.SORT_TYPE, Constants.AT_NAME, Constants.SORT_NONE, g_loc);
  		for (var i = 0; i < oobjoccs.length; i++) {
  			if (oobjoccs[i].OrgSymbolNum() == Constants.ST_PRCS_IF) {
  				var prcs_if = oobjoccs[i].ObjDef();
  				if (!prcs_if.Attribute(ATTR_OutOfScopeProcess, g_loc).IsMaintained() || prcs_if.Attribute(ATTR_OutOfScopeProcess, g_loc).getValue().length() === 0) { //exclude process interfaces marked as out of scope (ba attr)
  					var nameObject = prcs_if.Name(g_loc);
  					var assignedModelsEPC = prcs_if.AssignedModels(EPC_models);
  					var connectedEvent = [];
  					connectedEvent = getConnectedEventFromStratPrcsInOfStartNode(oobjoccs[i]);
  					if (assignedModelsEPC.length > 0 && connectedEvent != null) {
  						for (var j = 0; j < connectedEvent.length; j++) {
  							var connectedEventObjDef = connectedEvent[j].ObjDef();
  							var connectedEventName = connectedEventObjDef.Name(g_loc);
  							for (var m = 0; m < assignedModelsEPC.length; m++) {
  								var assignedModelEPC = assignedModelsEPC[m];
  								var occListModels_inEPC = connectedEventObjDef.OccListInModel(assignedModelEPC);
  								if (occListModels_inEPC.length > 0) {
  									// ok_output(getString("TEXT_RULE_8_LABEL"), getString("TEXT_RULE_8_DETAIL_START"), getString("TEXT_RULE_8_PRCIF") + nameObject, "\n" + getString("TEXT_RULE_8_EVENT") + connectedEventName + getString("TEXT_RULE_8_OK_EPCMODEL") + assignedModelEPC.Name(g_loc));
  								} else {
  									ko_output(model, ruleNumber, "rule_82", formatstring1(getString("TEXT_RULE_8_PRCIF"), nameObject), formatstring1(getString("TEXT_RULE_8_NO_EPCMODELOCC_ENDEVT"), connectedEventName));
  									isOk = false;
  								}
  							} //for
  						} //for
  					} else if (connectedEvent != null && assignedModelsEPC == 0) {
  						ko_output(model, ruleNumber, "rule_82", formatstring1(getString("TEXT_RULE_8_PRCIF"), nameObject), formatstring1(getString("TEXT_RULE_8_NO_EPCMODELOCC_ENDEVT"), connectedEventName));
  						isOk = false;
  					} else {
  						ko_output(model, ruleNumber, "rule_83", formatstring1(getString("TEXT_RULE_8_PRCIF"), nameObject), getString("TEXT_RULE_8_NO_FOLLOW_EVENT"));
  						isOk = false;
  					}
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
  			if (oobjoccs[i].OrgSymbolNum() == Constants.ST_PRCS_IF) {
  				var prcs_if = oobjoccs[i].ObjDef();
  				if (!prcs_if.Attribute(ATTR_OutOfScopeProcess, g_loc).IsMaintained() || prcs_if.Attribute(ATTR_OutOfScopeProcess, g_loc).getValue().length() === 0) { //exclude process interfaces marked as out of scope (ba attr)
  					var nameObject = prcs_if.Name(g_loc);
  					var assignedModelsEPC = prcs_if.AssignedModels(EPC_models);
  					var connectedEvent = [];
  					connectedEvent = getConnectedEventFromEndPrcsInOfEndNode(oobjoccs[i]);
  					if (connectedEvent != null && assignedModelsEPC.length > 0) {
  						for (var j = 0; j < connectedEvent.length; j++) {
  							var connectedEventObjDef = connectedEvent[j].ObjDef();
  							var connectedEventName = connectedEventObjDef.Name(g_loc);
  							for (var m = 0; m < assignedModelsEPC.length; m++) {
  								var assignedModelEPC = assignedModelsEPC[m];
  								var occListModels_inEPC = connectedEventObjDef.OccListInModel(assignedModelEPC);
  								if (occListModels_inEPC.length > 0) {
  									// ok_output(getString("TEXT_RULE_8_LABEL"), getString("TEXT_RULE_8_DETAIL_START"), getString("TEXT_RULE_8_PRCIF") + nameObject, "\n" + getString("TEXT_RULE_8_EVENT") + connectedEventName + getString("TEXT_RULE_8_OK_EPCMODEL") + assignedModelEPC.Name(g_loc));
  								} else {
  									ko_output(model, ruleNumber, "rule_83", formatstring1(getString("TEXT_RULE_8_PRCIF"), nameObject), formatstring1(getString("TEXT_RULE_8_NO_EPCMODELOCC_STARTEVT"), connectedEventName));
  									isOk = false;
  								}
  							} //for
  						} //for
  					} else if (connectedEvent != null && assignedModelsEPC == 0) {
  						ko_output(model, ruleNumber, "rule_82", formatstring1(getString("TEXT_RULE_8_PRCIF"), nameObject), formatstring1(getString("TEXT_RULE_8_NO_EPCMODELOCC_ENDEVT"), connectedEventName));
  						isOk = false;
  					} else {
  						ko_output(model, ruleNumber, "rule_83", formatstring1(getString("TEXT_RULE_8_PRCIF"), nameObject), getString("TEXT_RULE_8_NO_FOLLOW_EVENT"));
  						isOk = false;
  					}
  				}
  			}
  		}
  	}
  	if (isOk) {
  		ok_output(model, ruleNumber, ruleID, "", "");
  	}
  }
  //Start node Process interface is connected to an event
  function getConnectedEventFromStratPrcsInOfStartNode(procInterface) {
  	var incxns = procInterface.InDegree(Constants.EDGES_STRUCTURE);
  	var outcxs = procInterface.OutEdges(Constants.EDGES_STRUCTURE);
  	var events_arr = [];
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
  							events_arr.push(targetObjcOcc);
  						}
  					} //for
  				}
  			} //if
  		} //for
  	}
  	if (events_arr.length > 0)
  		return events_arr;
  }
  //End node Process interface is connected to an event
  function getConnectedEventFromEndPrcsInOfEndNode(procInterface) {
  	var incxns = procInterface.InEdges(Constants.EDGES_STRUCTURE);
  	var outncxs = procInterface.OutDegree(Constants.EDGES_STRUCTURE);
  	var events_arr = [];
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
  							events_arr.push(sourceObjcOcc);
  						}
  					} //for
  				}
  			} //if
  		} //for
  	}
  	if (events_arr.length > 0)
  		return events_arr;
  }
  /**************************** Rule 9 ***********************/
  //   Check Start- and end nodes if it is Event or Process interface
  /**************************** Rule 9 ***********************/
  function rule_9(ruleNumber, ruleID, model) {
  	var isOk = true;
  	var oobjoccs = null;
  	model.BuildGraph(true);
  	// check start nodes
  	oobjoccs = model.StartNodeList();
  	if (oobjoccs.length > 0) {
  		oobjoccs = ArisData.sort(oobjoccs, Constants.SORT_TYPE, Constants.AT_NAME, Constants.SORT_NONE, g_loc);
  		for (var j = 0; j < oobjoccs.length; j++) {
  			if (!(oobjoccs[j].ObjDef().TypeNum() == Constants.OT_EVT || oobjoccs[j].OrgSymbolNum() == Constants.ST_PRCS_IF)) {
  				var nameObject = oobjoccs[j].ObjDef().Name(g_loc);
  				ko_output(model, ruleNumber, ruleID, nameObject, getString("TEXT_RULE_9_1_START"));
  				isOk = false;
  			}
  		}
  	}
  	// check end nodes
  	var oobjoccs = model.EndNodeList();
  	if (oobjoccs.length > 0) {
  		oobjoccs = ArisData.sort(oobjoccs, Constants.SORT_TYPE, Constants.AT_NAME, Constants.SORT_NONE, g_loc);
  		for (var j = 0; j < (oobjoccs.length - 1) + 1; j++) {
  			if (!(oobjoccs[j].ObjDef().TypeNum() == Constants.OT_EVT || oobjoccs[j].OrgSymbolNum() == Constants.ST_PRCS_IF)) {
  				var nameObject = oobjoccs[j].ObjDef().Name(g_loc);
  				ko_output(model, ruleNumber, ruleID, nameObject, getString("TEXT_RULE_9_1_END"));
  				isOk = false;
  			}
  		}
  	}
  	if (isOk) {
  		ok_output(model, ruleNumber, ruleID, "", "");
  	}
  }
  /**************************** Rule 9 ***********************/
  /**************************** Rule 10 **********************/
  //All remaining events are definition copies -
  //it means that Eventes without Process interface (I/O) shall have no more 1 occ in the same and other model(s)
  function rule_10(ruleNumber, ruleID, model, allObjOccs) {
  	var events = [];
  	var isOk = true;
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
  					ko_output(model, ruleNumber, ruleID, nameEvent, formatstring2(getString("TEXT_RULE_10_NUMBER"), modelName, all_occs_inModel.length)); 
  					isOk = false;
  				} //for
  			}
  			/* else {
  			                    ok_output(getString("TEXT_RULE_10_LABEL"), getString("TEXT_RULE_10"), nameEvent, "");
  			                } */
  		} //for
  	}
  	/**
  	 *  returns TRUE if it is start event
  	 */
  	function isStartEvent1(p_oEvent) {
  		if (p_oEvent == null) return false;
  		var incx = p_oEvent.InEdges(Constants.EDGES_STRUCTURE);
  		var outcx = p_oEvent.OutEdges(Constants.EDGES_STRUCTURE);
  		if ((incx.length == 0 && outcx.length > 0) ||
  			(incx.length > 0 && incx[0].SourceObjOcc().OrgSymbolNum() == Constants.ST_PRCS_IF))
  			return true;
  		return false;
  	}
  	/**
  	 *  returns TRUE if it is end event
  	 */
  	function isEndEvent1(p_oEvent) {
  		if (p_oEvent == null) return false;
  		var incx = p_oEvent.InEdges(Constants.EDGES_STRUCTURE);
  		var outcx = p_oEvent.OutEdges(Constants.EDGES_STRUCTURE);
  		if ((incx.length > 0 && outcx.length == 0) ||
  			(outcx.length > 0 && outcx[0].TargetObjOcc().OrgSymbolNum() == Constants.ST_PRCS_IF))
  			return true;
  		return false;
  	}
  	if (isOk) {
  		ok_output(model, ruleNumber, ruleID, "", "");
  	}
  }
  /**************************** Rule 11 **********************/
  //Check mandatory object attributes fullfillment
  //incl. Screen object type (OT_SCRN) must have attr: SAP Transaction code (AT_TRANS_CODE) & SAP Component (AT_SOLAR_SAP_COMPONENT)
  function rule_mandatoryObjectAttrs(ruleNumber, ruleID, model, allObjOccs) {
  	var isOk = true;

  	for (var i = 0; i < allObjOccs.length; i++) {
  		var oOcc = allObjOccs[i];
  		var objDef = oOcc.ObjDef();
  		var nameObj = objDef.Name(g_loc);

        SemanticCheckConfig["objects"].forEach(function(item){
            var itemSymb = item["symbolNum"];
            var itemType = item["typeNum"];
            if (itemType.contains(objDef.TypeNum()) == true && itemSymb != undefined) { //object types with undifined symbols (all symbols)
                    item["mandatoryAttributes"].forEach(function(attribute){
                        if (attribute["evalFunction"] !== undefined ) {
                            var evalFunction = new Function(attribute["evalFunction"]["arguments"],attribute["evalFunction"]["body"]);
                            var evalution = evalFunction(objDef.Attribute(attribute["typeNum"],-1));
                            if (evalution) {
                            //ok_output(getString("TEXT_RULE_MANDATORY_MODEL_ATTRS_LABEL"), getString("TEXT_RULE_MANDATORY_MODEL_ATTRS"), getString("TEXT_ATTNAME") + aFilter.AttrTypeName(Constants.AT_NAME) + ", " + getString("TEXT_VALUE") + modelName, "");
                            } else {
                                ko_output(model, ruleNumber, ruleID, nameObj, formatstring1(getString("TEXT_RULE_17_KO"), aFilter.AttrTypeName(attribute["typeNum"])));
                                isOk = false;
                            }
                        }
                    });
            } else if (itemType.contains(objDef.TypeNum()) == true && itemSymb != undefined) { //object types with specific symbols
                if (itemSymb.contains(oOcc.SymbolNum()) == true) { 
                    item["mandatoryAttributes"].forEach(function(attribute){
                        if (attribute["evalFunction"] !== undefined ) {
                            var evalFunction = new Function(attribute["evalFunction"]["arguments"],attribute["evalFunction"]["body"]);
                            var evalution = evalFunction(objDef.Attribute(attribute["typeNum"],-1));
                            if (evalution) {
                            //ok_output(getString("TEXT_RULE_MANDATORY_MODEL_ATTRS_LABEL"), getString("TEXT_RULE_MANDATORY_MODEL_ATTRS"), getString("TEXT_ATTNAME") + aFilter.AttrTypeName(Constants.AT_NAME) + ", " + getString("TEXT_VALUE") + modelName, "");
                            } else {
                                ko_output(model, ruleNumber, ruleID, nameObj, formatstring1(getString("TEXT_RULE_17_KO"), aFilter.AttrTypeName(attribute["typeNum"])));
                                isOk = false;
                            }
                        }
                    });
                }
            }
        });
  	}
    
    if (isOk) {
  		ok_output(model, ruleNumber, ruleID, "", "");
  	}
  }
  /**************************** Rule 11 **********************/
  /**************************** Rule 12 ***********************/
  // The objects without cxn
  function rule_12(ruleNumber, ruleID, model, allObjOccs) {
  	var isOk = true;
  	var oOcc = ArisData.sort(allObjOccs, Constants.SORT_TYPE, Constants.AT_NAME, Constants.SORT_NONE, g_loc);
  	for (var i = 0; i < oOcc.length; i++) {
  		if (oOcc[i].ObjDef().TypeNum() != Constants.OT_TECH_TRM) {
  			var noutcxns = oOcc[i].OutDegree(Constants.EDGES_ALL);
  			var nincxns = oOcc[i].InDegree(Constants.EDGES_ALL);
  			/* if (noutcxns != 0 || nincxns != 0) {
  			    ok_output(getString("TEXT_RULE_12_LABEL"), getString("TEXT_RULE_12"), oOcc[i].ObjDef().Name(g_loc)+ ", in: " + nincxns + ", out: " + noutcxns, "");
  			} else { */
  			if (noutcxns == 0 && nincxns == 0) {
  				ko_output(model, ruleNumber, ruleID, oOcc[i].ObjDef().Name(g_loc), "");
  				isOk = false;
  			}
  		}
  	} //for
  	if (isOk) {
  		ok_output(model, ruleNumber, ruleID, "", "");
  	}
  }
  /**************************** Rule 12 ***********************/
  /**************************** Rule 13 ***********************/
  // The Function & Event objects wit > 1 cxns
  function rule_13(ruleNumber, ruleID, model) {
  	var isOk = true;
  	var oeventoccs = model.ObjOccListFilter(Constants.OT_EVT); // Geschäftsobjekt (Event)
  	var ofuncoccs = model.ObjOccListFilter(OBJ_PRCSTP);
  	var oevenfuntoccs = oeventoccs.concat(ofuncoccs);
  	var oOcc = ArisData.sort(oevenfuntoccs, Constants.SORT_TYPE, Constants.AT_NAME, Constants.SORT_NONE, g_loc);
  	for (var i = 0; i < oOcc.length; i++) {
  		var noutcxns = oOcc[i].OutDegree(Constants.EDGES_STRUCTURE);
  		var nincxns = oOcc[i].InDegree(Constants.EDGES_STRUCTURE);
  		/* if (noutcxns != 0 || nincxns != 0) {
  		    ok_output(getString("TEXT_RULE_12_LABEL"), getString("TEXT_RULE_12"), oOcc[i].ObjDef().Name(g_loc)+ ", in: " + nincxns + ", out: " + noutcxns, "");
  		} else { */
  		if (noutcxns > 1 || nincxns > 1) {
  			ko_output(model, ruleNumber, ruleID,oOcc[i].ObjDef().Name(g_loc) + "\n[" +  oOcc[i].SymbolName() + "]", "");
  			isOk = false;
  		}
  	} //for
  	if (isOk) {
  		ok_output(model, ruleNumber, ruleID, "", "");
  	}
  }
  /**************************** Rule 13 ***********************/
  /**************************** Rule 14 ***********************/
  // The objects which have a relationships connected with two ocurranes of the same definition
  function rule_14(ruleNumber, ruleID, model, allObjOccs) {
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
  						ko_output(model, ruleNumber, ruleID, oOcc[i].ObjDef().Name(g_loc) + "\n[" +  oOcc[i].SymbolName() + "]", getString("TEXT_RULE_14_ITSELF_CXN"));
  						isOk = false;
  					}
  				}
  			}
  			// }
  		} //for
  	} //if
  	if (isOk) {
  		ok_output(model, ruleNumber, ruleID, "", "");
  	}
  }
  /**************************** Rule 14 ***********************/
  /**************************** Rule Mandatory Model Attributes ***********************/
  //Check mandatory modell attributes fullfillment
  function rule_mandatoryModelAttrs(ruleNumber, ruleID, model, model_typeNum) {
  	var isOk = true;

    SemanticCheckConfig["models"].forEach(function(item){
        var modelType = item["typeNum"];
        //if (item["typeNum"] == model_typeNum) {
        if ((modelType.contains(model_typeNum)) == true) { 
            item["mandatoryAttributes"].forEach(function(attribute){
                if (model.Attribute(attribute,-1).IsMaintained()) {
                    //ok_output(getString("TEXT_RULE_MANDATORY_MODEL_ATTRS_LABEL"), getString("TEXT_RULE_MANDATORY_MODEL_ATTRS"), getString("TEXT_ATTNAME") + aFilter.AttrTypeName(Constants.AT_NAME) + ", " + getString("TEXT_VALUE") + modelName, "");
                } else {
                    ko_output(model, ruleNumber, ruleID, "", formatstring1(getString("TEXT_RULE_17_KO"), aFilter.AttrTypeName(attribute)));
                    isOk = false;
                }
            });
        }
    });
    
  	if (isOk) {
  		ok_output(model, ruleNumber, ruleID, "", "");
  	}
  }
  /**************************** Rule Mandatory Model Attributes ***********************/
  /**************************** Rule Linking of the data object passed in the Process reference point / interface. ***********************/
  function rule_linked_dataObjects_PRPs(ruleNumber, ruleID, model, allObjOccs) {
  	var isOk = true;
  	model.BuildGraph(true);
  	// check events conntected from start nodes part 1
  	var oobjoccs = model.StartNodeList();
  	if (oobjoccs.length > 0) {
  		oobjoccs = ArisData.sort(oobjoccs, Constants.SORT_TYPE, Constants.AT_NAME, Constants.SORT_NONE, g_loc);
  		for (var i = 0; i < oobjoccs.length; i++) {
  			if (oobjoccs[i].OrgSymbolNum() == Constants.ST_PRCS_IF) {
  				var connectedEvent = getConnectedEventFromStratPrcsInOfStartNode(oobjoccs[i]);
  				if (connectedEvent == null || !connectedEvent.isValid) {
  					//skip PRCS_IF without cxn
  				} else {
  					for (var j = 0; j < connectedEvent.length; j++) {
  						var connectedEventDef = connectedEvent[j].ObjDef();
  						var connectedEventDefName = connectedEvent[j].ObjDef().Name(g_loc);
  						var assignedModelsTOGAF = connectedEventDef.AssignedModels([Constants.MT_TOGAF_DIAGRAM]);
  						if (assignedModelsTOGAF.length > 0) {
  							//check cnx to PRPs
  							var occsInTOG = connectedEventDef.OccListInModel(assignedModelsTOGAF[0]);
  							var foundCLST = false;
  							for (var k = 0; k < occsInTOG.length; k++) {
  								var cnxs = occsInTOG[k].Cxns(Constants.EDGES_OUT, Constants.EDGES_STRUCTURE);
  								for (var OUT = 0; OUT < cnxs.length; OUT++) {
  									if (cnxs[OUT].TargetObjOcc().OrgSymbolNum() == Constants.ST_CLST)
  										foundCLST = true;
  								}
  								//TODO check In cnx if is allowed
  								/* var cnxs =  occsInTOG[k]. Cxns (Constants.EDGES_IN , Constants.EDGES_STRUCTURE );
  								 for (var IN = 0; IN < cnxs.length; IN++) {
  								      if (cnxs[IN].SourceObjOcc().OrgSymbolNum() == Constants.ST_CLST)
  								          foundCLST = true;
  								 }*/
  								if (foundCLST == false) {
  									isOk = false;
  									ko_output(model, ruleNumber, ruleID, connectedEventDefName, getString("TEXT_RULE_LINKING_DATAOBJECT_INTERFACE_NO_DATA"));
  								}
  							}
  						} else { //no TOPGAF assigned
  							ko_output(model, ruleNumber, ruleID, connectedEventDefName, getString("TEXT_RULE_LINKING_DATAOBJECT_INTERFACE_NO_TOGAF"));
  							isOk = false;
  						}
  					}
  				}
  			}
  		}
  	}
  	// check events conntected from end nodes part 2
  	var oobjoccs = model.EndNodeList();
  	if (oobjoccs.length > 0) {
  		oobjoccs = ArisData.sort(oobjoccs, Constants.SORT_TYPE, Constants.AT_NAME, Constants.SORT_NONE, g_loc);
  		for (var i = 0; i < oobjoccs.length; i++) {
  			if (oobjoccs[i].OrgSymbolNum() == Constants.ST_PRCS_IF) {
  				var connectedEvent = getConnectedEventFromEndPrcsInOfEndNode(oobjoccs[i]);
  				if (connectedEvent == null || !connectedEvent.isValid) {
  					//skip PRCS_IF without cxn
  				} else {
  					for (var j = 0; j < connectedEvent.length; j++) {
  						var connectedEventDef = connectedEvent[j].ObjDef();
  						var connectedEventDefName = connectedEvent[j].ObjDef().Name(g_loc);
  						var assignedModelsTOGAF = connectedEventDef.AssignedModels([Constants.MT_TOGAF_DIAGRAM]);
  						if (assignedModelsTOGAF.length > 0) {
  							//check cnx to PRPs
  							var occsInTOG = connectedEventDef.OccListInModel(assignedModelsTOGAF[0]);
  							var foundCLST = false;
  							for (var k = 0; k < occsInTOG.length; k++) {
  								var cnxs = occsInTOG[k].Cxns(Constants.EDGES_OUT, Constants.EDGES_STRUCTURE);
  								for (var OUT = 0; OUT < cnxs.length; OUT++) {
  									if (cnxs[OUT].TargetObjOcc().OrgSymbolNum() == Constants.ST_CLST)
  										foundCLST = true;
  								}
  								//TODO check In cnx if is allowed
  								/* var cnxs =  occsInTOG[k]. Cxns (Constants.EDGES_IN , Constants.EDGES_STRUCTURE );
  								 for (var IN = 0; IN < cnxs.length; IN++) {
  								      if (cnxs[IN].SourceObjOcc().OrgSymbolNum() == Constants.ST_CLST)
  								          foundCLST = true;
  								 }*/
  								if (foundCLST == false) {
  									isOk = false;
  									ko_output(model, ruleNumber, ruleID, connectedEventDefName, getString("TEXT_RULE_LINKING_DATAOBJECT_INTERFACE_NO_DATA"));
  								}
  							} //for
  						} else { //no TOPGAF assigned
  							ko_output(model, ruleNumber, ruleID, connectedEventDefName, getString("TEXT_RULE_LINKING_DATAOBJECT_INTERFACE_NO_TOGAF"));
  							isOk = false;
  						}
  					}
  				}
  			}
  		}
  	}
  	if (isOk) {
  		ok_output(model, ruleNumber, ruleID, "", "");
  	}
  }
  /**************************** Rule Linking of the data object passed in the Process reference point / interface. ***********************/
  /**************************** Rule 17 ***********************/
  /**************************** Rule Mandatory SAP Object Attributes ***********************/
  //Check mandatory object attributes
  function rule_SAP_Object_rules(ruleNumber, ruleID, model, allObjOccs, settings, isFixing) {
  	var isOk = true;
  	var isSettingOK = false;
  	for (var i = 0; i < allObjOccs.length; i++) {
  		var itemSettings = geItemSettings(model, allObjOccs[i], settings);
  		if (itemSettings != null) {
  			isSettingOK = true;
  			for (var ii = 0; ii < itemSettings.ObjAttrAndValues.length; ii++) {
                if (itemSettings.ObjAttrAndValues[ii][1].length == 0){
                    if (!allObjOccs[i].ObjDef().Attribute(itemSettings.ObjAttrAndValues[ii][0], g_loc).IsMaintained()) {
                        // ko_not maintained any value
                        do_output(model, ruleNumber, ruleID, allObjOccs[i].ObjDef().Name(g_loc), formatstring1(getString("TEXT_RULE_17_KO"), aFilter.AttrTypeName(itemSettings.ObjAttrAndValues[ii][0])), koSymbol, Constants.C_RED);
                        isOk = false
                    }
                }else if (itemSettings.ObjAttrAndValues[ii][1].length == 1){
                    if(itemSettings.ObjAttrAndValues[ii][1].toString() == allObjOccs[i].ObjDef().Attribute(itemSettings.ObjAttrAndValues[ii][0], g_loc).getValue().toString()) {
  						// ok_output 
  					} else {
                        // ko_incorrect value
                    do_output(model, ruleNumber, ruleID, allObjOccs[i].ObjDef().Name(g_loc), formatstring1(getString("TEXT_RULE_17_KO"), aFilter.AttrTypeName(itemSettings.ObjAttrAndValues[ii][0])), koSymbol, Constants.C_RED);
                    isOk = false;
  					}
  				} else {
                    if (itemSettings.ObjAttrAndValues[ii][1].toString().indexOf(allObjOccs[i].ObjDef().Attribute(itemSettings.ObjAttrAndValues[ii][0], g_loc).getValue().toString()) == -1){
                        // ko_valie doesnot fit
                        do_output(model, ruleNumber, ruleID, allObjOccs[i].ObjDef().Name(g_loc), formatstring1(getString("TEXT_RULE_17_KO"), aFilter.AttrTypeName(itemSettings.ObjAttrAndValues[ii][0])), koSymbol, Constants.C_RED);
                        isOk = false
                    }
                  
  				}
  			}
  		}
  	}
  	if (isOk && isSettingOK) {
  		do_output(model, ruleNumber, ruleID, "", "", okSymbol, Constants.C_GREEN);
  		// ok_output
  	}
  	if (isOk && !isSettingOK) do_output(model, ruleNumber, ruleID, "", getString("TEXT_RULE_SETRTTING_FAILED"), koSymbol, Constants.C_RED);
  }
  /**************************** Rule 17 ***********************/
  /**************************** Rule 18 ***********************/
  /**************************** Rule Mandatory SAP Model Attributes ***********************/
  //Check mandatory model attributes    
  function rule_SAP_Model_rules(ruleNumber, ruleID, model, settings) {
  	var isOk = true;
  	var itemSettings = geItemSettings(model, null, settings);
  	if (itemSettings != null) {
        var modelType = model.TypeNum();
        if (modelType == MT_FAD) var ModellAttrSetting = itemSettings.SubordinatedModelAttrAndValues;
        else var ModellAttrSetting = itemSettings.SuperiorModelAttrAndValues;
  		for (var ii = 0; ii < ModellAttrSetting.length; ii++) {
  			if (model.Attribute(ModellAttrSetting[ii][0], g_loc).IsMaintained()) {
             if (ModellAttrSetting[ii][1].length == 0){
                    if (!model.Attribute(ModellAttrSetting[ii][0], g_loc).IsMaintained()) {
                        // ko_not maintained any value
                    do_output(model, ruleNumber, ruleID, "", formatstring3(getString("TEXT_RULE_17_KOVALUE"), aFilter.AttrTypeName(ModellAttrSetting[ii][0]), model.Attribute(ModellAttrSetting[ii][0], g_loc).getValue(), ModellAttrSetting[ii][1]), koSymbol, Constants.C_RED);
                    isOk = false;
                    }
                }else if (ModellAttrSetting[ii][1].length == 1){
                    if(ModellAttrSetting[ii][1].toString() == model.Attribute(ModellAttrSetting[ii][0], g_loc).getValue().toString()) {
  						// ok_output 
  					} else {
                        // ko_incorrect value
                    do_output(model, ruleNumber, ruleID, "", formatstring3(getString("TEXT_RULE_17_KOVALUE"), aFilter.AttrTypeName(ModellAttrSetting[ii][0]), model.Attribute(ModellAttrSetting[ii][0], g_loc).getValue(), ModellAttrSetting[ii][1]), koSymbol, Constants.C_RED);
                    isOk = false;
  					}
  				} else {
                    if (ModellAttrSetting[ii][1].toString().indexOf(model.Attribute(ModellAttrSetting[ii][0], g_loc).getValue().toString()) == -1){
                        // ko_valie doesnot fit
                    do_output(model, ruleNumber, ruleID, "", formatstring3(getString("TEXT_RULE_17_KOVALUE"), aFilter.AttrTypeName(ModellAttrSetting[ii][0]), model.Attribute(ModellAttrSetting[ii][0], g_loc).getValue(), ModellAttrSetting[ii][1]), koSymbol, Constants.C_RED);
                    isOk = false;
                    }
                  
  				}
                

  			} else {
                // ko_not maintained
                do_output(model, ruleNumber, ruleID, "", formatstring1(getString("TEXT_RULE_17_KO"), aFilter.AttrTypeName(ModellAttrSetting[ii][0])), koSymbol, Constants.C_RED);
                isOk = false;
  			}
  		}
  		if (isOk) {
  			do_output(model, ruleNumber, ruleID, "", "", okSymbol, Constants.C_GREEN);
  			// ok_output
  		}
  	} else {
  		do_output(model, ruleNumber, ruleID, "", getString("TEXT_RULE_SETRTTING_FAILED"), koSymbol, Constants.C_RED);
  	}
  }
  /**************************** Rule 18 ***********************/
  /**************************** Rule 19 ***********************/
  /**************************** Process steps relations ***********************/
  //Check process steps connections       
  function rule_ProcessStepConnections_rules(ruleNumber, ruleID, model, allObjOccs, settings) {
  	var isOk = true;
  	var isSettingOK = false;
  	for (var i = 0; i < allObjOccs.length; i++) {
  		var itemSettings = geItemSettings(model, allObjOccs[i], settings);
  		if (itemSettings != null) {
  			isSettingOK = true;
  			if (itemSettings.ObjConnections.length > 0) {
  				//Go through connection options
  				for (var ii = 0; ii < itemSettings.ObjConnections.length; ii++) {
  					//Check if objects is complience with defined connection rules
  					if (allObjOccs[i].getSymbolGUID() != "")
  						var ObjSymbol = allObjOccs[i].getSymbolGUID();
  					else
  						var ObjSymbol = allObjOccs[i].getSymbol();
  					if (ObjSymbol == itemSettings.ObjConnections[ii][0]) {
  						var CnxList = allObjOccs[i].Cxns(Constants.EDGES_INOUT);
  						for (var iii = 0; iii < itemSettings.ObjConnections[ii][1].length; iii++) {
  							var subresult = getConnectedObjs(CnxList, itemSettings.ObjConnections[ii][1][iii][0]);
  							if (subresult.length != itemSettings.ObjConnections[ii][1][iii][1]) {
  								var isOk = false;
  								do_output(model, ruleNumber, ruleID, allObjOccs[i].ObjDef().Name(g_loc), formatstring3(getString("TEXT_RULE_19_KO"), allObjOccs[i].ObjDef().Name(g_loc), itemSettings.ObjConnections[ii][1][iii][1], aFilter.ObjTypeName(itemSettings.ObjConnections[ii][1][iii][0])), koSymbol, Constants.C_RED);
  							}
  						}
  					}
  				}
  			}
  		}
  	}
  	if (isOk && isSettingOK) {
  		do_output(model, getString("TEXT_RULE_19_LABEL"), getString("TEXT_RULE_19"), "", "", okSymbol, Constants.C_GREEN);
  		// ok_output
  		if (isOk && !isSettingOK) do_output(model, ruleNumber, ruleID, allObjOccs[i].ObjDef().Name(g_loc), getString("TEXT_RULE_SETRTTING_FAILED"), koSymbol, Constants.C_RED);
  	}
  }

  function getConnectedObjs(CnxList, ObjType) {
  	var result = new Array();
  	for (var i = 0; i < CnxList.length; i++) {
  		var Source = CnxList[i].getSource().ObjDef();
  		var Target = CnxList[i].getTarget().ObjDef();
  		if (Source.TypeNum() == ObjType) result = result.concat(Source);
  		if (Target.TypeNum() == ObjType) result = result.concat(Target);
  	}
  	return result;
  }
  /**************************** Rule 19 ***********************/
  /**************************** Rule 20 ***********************/
  /**************************** Assign Process steps into Process step Library ***********************/
  //Check assignment of process steps into Process step Library       
function rule_SAP_Libraries_rules(ruleNumber, ruleID, model, allObjOccs, settings, isFixing) {
    var isOk = true;
    var isSettingOK = false;
    var isIssuedObjDef = new Array();
    for (var i = 0; i < allObjOccs.length; i++) {
        var itemSettings = geItemSettings(model, allObjOccs[i], settings);
        if (itemSettings != null) {
            isSettingOK = true;
            if (itemSettings.ObjLibModelGUID != "") {
                var IsLib = new Array();
                var IsMissingLib = new Array();
                var IsWrong = new Array();
                for (var ii = 0; ii < itemSettings.ObjLibModelGUID.length; ii++) {
                    var LibModelbyGUID = db.FindGUID(itemSettings.ObjLibModelGUID[ii][0]);
                    if (LibModelbyGUID.IsValid()) {
                        var IsOccLib = allObjOccs[i].ObjDef().OccList([LibModelbyGUID]);
                    } else var IsOccLib = [];
                    var IsDefSym = indexOfArray(allObjOccs[i].ObjDef().getDefaultSymbolNum(), itemSettings.ObjLibModelGUID[ii][1]);
                    var IsAttrs = CheckObjAttr(allObjOccs[i].ObjDef(), itemSettings.ObjLibModelGUID[ii][2]);
                    if (IsOccLib.length == 1 && IsDefSym && IsAttrs.length == 0) IsLib.push([ii, LibModelbyGUID]);
                    else if (IsOccLib.length == 0 && IsDefSym && IsAttrs.length == 0) IsMissingLib.push([ii, LibModelbyGUID]);
                    else if (IsOccLib.length == 1 && ( !IsDefSym || !IsAttrs.length == 0)) IsWrong.push([ii, LibModelbyGUID]);
                }
                if (IsLib.length == 1 && IsMissingLib.length == 0 && IsWrong.length == 0) {
                    //Is OK
                } else if (IsLib.length == 0 && IsMissingLib.length == 1 && IsWrong.length == 0) {
                    if (isIssuedObjDef.toString().indexOf(allObjOccs[i].ObjDef().GUID()) == -1){
                    do_output(model, ruleNumber, ruleID, "", formatstring2(getString("TEXT_RULE_20_KO"), allObjOccs[i].ObjDef().Name(g_loc), IsMissingLib[0][1].Name(g_loc)), koSymbol, Constants.C_RED);
                    isOk = false;
                    isIssuedObjDef.push(allObjOccs[i].ObjDef().GUID());
                    }
                } else if ((IsLib.length >= 1 || IsMissingLib.length == 1) && IsWrong.length >= 1) {
                    if (isIssuedObjDef.toString().indexOf(allObjOccs[i].ObjDef().GUID()) == -1){
                    var RightModel = getRightLib(IsLib,IsMissingLib);
                    do_output(model, ruleNumber, ruleID, "", formatstring3(getString("TEXT_RULE_20_KO2"), allObjOccs[i].ObjDef().Name(g_loc),IsLib.length + IsWrong.length,RightModel[0][1].Name(g_loc)), koSymbol, Constants.C_RED);
                    isOk = false;
                    isIssuedObjDef.push(allObjOccs[i].ObjDef().GUID());
                    }
                } 
            }

        }
    }

if (isOk && isSettingOK) {
    do_output(model, ruleNumber, ruleID, "", "", okSymbol, Constants.C_GREEN);
    // ok_output
}
if (isOk && !isSettingOK) do_output(model, getString("TEXT_RULE_20_LABEL"), getString("TEXT_RULE_20"), "", getString("TEXT_RULE_SETRTTING_FAILED"), koSymbol, Constants.C_RED);
}
  /**************************** Rule 20 ***********************/
  /**************************** Rule 21 ***********************/
  /**************************** Assign Objects into Master Groups ***********************/
  //Check assignment of process steps into Process step Library       
  function rule_SAP_MasteGroups_rules(ruleNumber, ruleID, model, allObjOccs, settings, isFixing) {
  	var isOk = true;
  	var isSettingOK = true;
  	for (var i = 0; i < allObjOccs.length; i++) {
  		var itemSettings = geItemSettings(model, allObjOccs[i], settings);
  		if (itemSettings != null) {
  			if (itemSettings.ObjMasterGroupGUID != "") {
  				var LipGroupGUID = getMasterGroup(allObjOccs[i], itemSettings);
                var LibGroup = db.FindGUID(LipGroupGUID);
  				if (LibGroup.IsValid()) {
  					if (LibGroup.GUID().toString() != allObjOccs[i].ObjDef().Group().GUID().toString()) {
  						var OrgGroup = allObjOccs[i].ObjDef().Group();
  						if (checkActiveUserRights(g_User, allObjOccs[i].ObjDef().Group())) {
  							isOk = false;
  							if (isFixing) {
  								if (!checkActiveUserRights(g_User, LibGroup)) {
  									writeLog(adsclog, "Assigning user: " + g_User + " into user group '010100|0|0 Libraries|7b7a7dc1-8892-11eb-7c47-005056af6d0b|U|RWD'.", "info");
  									var GrantingRights = g_RightsManager.assignADSPriviledges(db, g_User, "010100|0|0 Libraries|7b7a7dc1-8892-11eb-7c47-005056af6d0b|U|RWD");
  									if (!GrantingRights) {
  										writeLog(adsclog, "Assigning user: " + g_User + " into user group '010100|0|0 Libraries|7b7a7dc1-8892-11eb-7c47-005056af6d0b|U|RWD' failed.", "error");
  										var isFixed = false;
  									} else {
  										db.refreshObjects(db.GroupList(LibGroup), true);
  										var isFixed = allObjOccs[i].ObjDef().ChangeGroup(LibGroup);
  										if (isFixed) {
  											isOk = false;
  											do_output(model, ruleNumber, ruleID, allObjOccs[i].ObjDef().Name(g_loc), formatstring2(getString("TEXT_RULE_21_WARNINGOK"), allObjOccs[i].ObjDef().Name(g_loc), LibGroup.Name(g_loc)), okSymbol, Constants.C_ORANGE);
  											writeLog(adsclog, "Object '" + allObjOccs[i].ObjDef().Name(g_loc) + " with GUID '" + allObjOccs[i].ObjDef().GUID() + "' has been moved from group '" + OrgGroup.Name(g_loc) + "' with path '" + OrgGroup.Path(g_loc) + "' into master data group '" + LibGroup.Name(g_loc) + "' with path '" + LibGroup.Path(g_loc) + "'.", "warn");
  										} else {
  											isOk = false;
  											writeLog(adsclog, "Failed moving object '" + allObjOccs[i].ObjDef().Name(g_loc) + " with GUID '" + allObjOccs[i].ObjDef().GUID + "' from group '" + OrgGroup.Name(g_loc) + "' with path '" + OrgGroup.Path(g_loc) + "' into master data group '" + LibGroup.Name(g_loc) + "' with path '" + LibGroup.Path(g_loc) + "'.", "error");
  											do_output(model, ruleNumber, ruleID, allObjOccs[i].ObjDef().Name(g_loc), formatstring2(getString("TEXT_RULE_21_WARNINGKO"), allObjOccs[i].ObjDef().Name(g_loc), LibGroup.Name(g_loc)), koSymbol, Constants.C_RED);
  										}
  										var RemovingRights = g_RightsManager.unassignADSPriviledges(db, g_User, "010100|0|0 Libraries|7b7a7dc1-8892-11eb-7c47-005056af6d0b|U|RWD");
  										if (RemovingRights) {
  											writeLog(adsclog, "User: " + g_User + " unassigned from user group '010100|0|0 Libraries|7b7a7dc1-8892-11eb-7c47-005056af6d0b|U|RWD'.", "info");
  										} else {
  											writeLog(adsclog, "Unassigning user: " + g_User + " from user group '010100|0|0 Libraries|7b7a7dc1-8892-11eb-7c47-005056af6d0b|U|RWD' failed.", "error");
  										}
  									}
  								} else {
  									var OrgGroup = allObjOccs[i].ObjDef().Group();
  									var isFixed = allObjOccs[i].ObjDef().ChangeGroup(LibGroup);
  									ArisData.Save(Constants.SAVE_NOW);
  								}
  							} else {
  								do_output(model, ruleNumber, ruleID, allObjOccs[i].ObjDef().Name(g_loc), formatstring2(getString("TEXT_RULE_21_KO"), allObjOccs[i].ObjDef().Name(g_loc), LibGroup.Name(g_loc)), koSymbol, Constants.C_RED);
  							}
  						} else {
  							//mising user rights
  							isOk = false;
  							do_output(model, ruleNumber, ruleID, allObjOccs[i].ObjDef().Name(g_loc), formatstring2(getString("TEXT_RULE_21_WARNINGKO"), allObjOccs[i].ObjDef().Name(g_loc), LibGroup.Name(g_loc)) + " " + getString("TEXT_AUTHORIZATION_ISSUE"), koSymbol, Constants.C_RED);
  							writeLog(adsclog, "Failed moving object '" + allObjOccs[i].ObjDef().Name(g_loc) + " with GUID '" + allObjOccs[i].ObjDef().GUID() + "' from group '" + OrgGroup.Name(g_loc) + "' with path '" + OrgGroup.Path(g_loc) + "' into master data group '" + LibGroup.Name(g_loc) + "' with path '" + LibGroup.Path(g_loc) + "' due to mussign authorization for source folder.", "error");
  						}
  					}
  				}
  			}
  		}
  	}
  	if (isOk && isSettingOK) {
  		do_output(model, ruleNumber, ruleID, "", "", okSymbol, Constants.C_GREEN);
  		// ok_output
  	}
  	if (isOk && !isSettingOK) do_output(model, ruleNumber, ruleID, "", getString("TEXT_RULE_SETRTTING_FAILED"), koSymbol, Constants.C_RED);
  }

  function checkActiveUserRights(tUser, tGroup) {
  	var result = true;
  	var UserRight = tUser.AccessRights(tGroup, true);
  	for (var i = 0; i < g_ReadingRights.length; i++) {
  		if (g_ReadingRights[i] == UserRight) result = false;
  	}
  	return result;
  }
  /**************************** Rule 21 ***********************/
  
  /**************************** Rule 22 ***********************/
  // Existence rule: check whether satelites objects are from Library models (master data)
  
  function rule_satelitesObjects_inLibrary_rule(ruleNumber, ruleID, model, model_typeNum) {
    var isOk = true;
    var sGUID = "";
    SemanticCheckConfig["models"].forEach(function(item){
        var modelType = item["typeNum"];
        if ((modelType.contains(model_typeNum)) == true) {
            if (item["satelitesLibrary_typeNum"] !== undefined && item["satelitesLibrary_typeNum"] != null) { //find object type in Model settings
                item["satelitesLibrary_typeNum"].forEach(function(satelite){
                    
                    // Satelites in Stammdaten
                    var oroleoccs = model.ObjOccListFilter(satelite);
                    oroleoccs = ArisData.Unique(oroleoccs);
                    if (oroleoccs.length > 0) {
                        oroleoccs = ArisData.sort(oroleoccs, Constants.SORT_TYPE, Constants.AT_NAME, Constants.SORT_NONE, g_loc);
                        var objTypeModelList = null;
                        getListLibraryModels(satelite);
                        for (var i = 0; i < oroleoccs.length; i++) {
                            var orole_objDef = oroleoccs[i].ObjDef();
                            var nameObjType = orole_objDef.Name(g_loc);
                            var isOccFoundInModel = checkObjoccInListOfNonSystems(oroleoccs[i]);
                            if (isOccFoundInModel == false && sGUID != orole_objDef.GUID()) {
                                ko_output(model, ruleNumber, ruleID, nameObjType + "\n[" + oroleoccs[i].SymbolName() + "] ", getString("TEXT_RULE_22_NOT_IN_MASTERDATA"));
                                isOk = false;
                                sGUID = orole_objDef.GUID();
                            }
                        } // for
                    }
    
                });
            }
        }
    });
        
    if (isOk) {
       ok_output(model, ruleNumber, ruleID, "", "");
    }
  }
  /**************************** Rule 22 ***********************/
  
    /**
     *   returns the list of the Master data models
     */
    
    function getListLibraryModels(objType) {
        var cGroup = null;
            
        //find property in Objects settings
        SemanticCheckConfig["objects"].forEach(function(itemObj){
            var objectType = itemObj["typeNum"];
            if ((objectType.contains(objType)) == true) {
                if (itemObj["ObjLibModelGUID"] !== undefined) {
                    cGroup = db.FindGUID(itemObj["ObjLibModelGUID"], Constants.CID_GROUP);
                    if (cGroup != null && cGroup.IsValid()) {
                        objTypeModelList = cGroup.ModelList();
                        var childGroups = cGroup.Childs();
                        //add models from subgroups
                        for (var i = 0; i < childGroups.length; i++) {
                            var groupModels = childGroups[i].ModelList();
                            for (var j = 0; j < groupModels.length; j++) {
                                objTypeModelList.push(groupModels[j]);
                            }
                        }
                    }
                    return objTypeModelList;
                
                }
            }
        });
        
        
    }

    /**
    *   check objType objocc in the List of Non IT systems models (masterdata)
    */
    function checkObjoccInListOfNonSystems(objOcc) {
        if (objTypeModelList != null) {
            var objObj = objOcc.ObjDef();
            for (var j = 0; j < objTypeModelList.length; j++) {
                var modelObjType = objTypeModelList[j];
                var occListInModel = objObj.OccListInModel(modelObjType);
                if (occListInModel.length > 0) {
                    return true;
                }
            } // for
        }
        return false;
    }
  
  	function createFirstSheetHeader() {
		outfile.BeginTable(100, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_LEFT, 0);
		outfile.TableRow();
		outfile.TableCellF(getString("TEXT_SUPERIOR_OBJECT"), 50, "RULE_HEADER");
		outfile.TableCellF(getString("TEXT_MODEL_NAME"), 50, "RULE_HEADER");
		outfile.TableCellF(getString("TEXT_MODEL_IDENTIFIER"),80, "RULE_HEADER");
		outfile.TableCellF(getString("TEXT_GUID"), 50, "RULE_HEADER");
		outfile.TableCellF(getString("TEXT_SAP_ID"), 50, "RULE_HEADER");
		outfile.TableCellF(getString("TEXT_RULES"), 25, "RULE_HEADER");
		outfile.TableCellF(getString("TEXT_RULE_NAME"), 90, "RULE_HEADER");
		outfile.TableCellF(getString("TEXT_CHECK_RESULT"), 50, "RULE_HEADER");
		outfile.TableCellF(getString("TEXT_OBJECTNAME"), 50, "RULE_HEADER");
		outfile.TableCellF(getString("TEXT_DETAILS"), 50, "RULE_HEADER");
	}

	function createFirstSheetFooter(name_m) {
		outfile.TableRow();
		//jmeno listu
		outfile.EndTable(name_m, 100, "Arial", 12, Constants.C_GREY_80_PERCENT, Constants.C_TRANSPARENT, 0, Constants.FMT_LEFT | Constants.FMT_ITALIC, 0);
	}

	function createRuleOverviewSheet() {
        //Todo: deactivate 0, 3, 4, 7, 16, 19, 20
        const ruleRelavancyWidht = 12;
		outfile.BeginTable(100, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_LEFT, 0);
		outfile.TableRow();
		outfile.TableCellF(getString("TEXT_RULE_NUM"), 20, "RULE_HEADER");
        outfile.TableCellF(getString("TEXT_RULE_RELEVANCY_VACD"), ruleRelavancyWidht, "RULE_HEADER");
        outfile.TableCellF(getString("TEXT_RULE_RELEVANCY_EPC"), ruleRelavancyWidht, "RULE_HEADER");
        outfile.TableCellF(getString("TEXT_RULE_RELEVANCY_FAD"), ruleRelavancyWidht, "RULE_HEADER");
		outfile.TableCellF(getString("TEXT_RULE_NAME"), 80, "RULE_HEADER");
		outfile.TableCellF(getString("TEXT_RULE_DETAIL"), 120, "RULE_HEADER");
		outfile.TableRow();
        // get unique rule list
        const ruleListString = ruleListVACDs + ruleListEPCs + ruleListFADs;
        var ruleList = ruleListString.split(",");
        ruleList = ArisData.Unique(ruleList);
        
        SemanticCheckConfig["rules"].forEach(function(item){
            if (ruleList.contains(item["ruleNum"]) == true && item["rulesOverviewBlacklisk"] == undefined) {
                outfile.TableCellF(item["ruleNum"], 20, "TABLE_CELL");
                if (ruleListVACDs.contains(item["ruleNum"]) == true) outfile.TableCellF(okSymbol, ruleRelavancyWidht, "TABLE_CELL"); 
                else outfile.TableCellF("", ruleRelavancyWidht, "TABLE_CELL");
                if (ruleListEPCs.contains(item["ruleNum"]) == true) outfile.TableCellF(okSymbol, ruleRelavancyWidht, "TABLE_CELL");
                else outfile.TableCellF("", ruleRelavancyWidht, "TABLE_CELL");
                if (ruleListFADs.contains(item["ruleNum"]) == true) outfile.TableCellF(okSymbol, ruleRelavancyWidht, "TABLE_CELL");
                else outfile.TableCellF("", ruleRelavancyWidht, "TABLE_CELL");
                outfile.TableCellF(item["ruleName"], 60, "TABLE_CELL_LEFT");
                if (item["ruleDescAddInfo"] !== undefined && getMandatoryAttrOverviewFromConfig(item["ruleDescAddInfo"]) != null) outfile.TableCellF(item["ruleDesc"] + "\n" + getMandatoryAttrOverviewFromConfig(item["ruleDescAddInfo"]), 120, "TABLE_CELL_LEFT");
                else if (item["ruleDescAddInfo"] !== undefined && getMandatoryAttrOverviewFromConfig(item["ruleDescAddInfo"]) == null) outfile.TableCellF(item["ruleDesc"] + "\n" + item["ruleDescAddInfo"], 120, "TABLE_CELL_LEFT");
                else outfile.TableCellF(item["ruleDesc"], 120, "TABLE_CELL_LEFT");
                outfile.TableRow();
            }
        });
		//sheet name
		outfile.EndTable(getString("TEXT_RULES_OVERVIEW"), 100, "Arial", 12, Constants.C_GREY_50_PERCENT, Constants.C_TRANSPARENT, 0, Constants.FMT_LEFT | Constants.FMT_ITALIC, 0);
	}
    
	/**
	 * Genreal status row to xls
	 */
	function do_output(model, ruleNumber, ruleID, object, detailInfo, infostring, cellcolour) {
        
        var model_identifier = model.Attribute(ATTR_Identifier, g_loc).getValue();
        var SAP_ID = model.Attribute(Constants.AT_SAP_ID2, g_loc).getValue();
        
		outfile.TableCellF(superiorObject, COLUMN_X_WIDTH, "TABLE_CELL_GREY");
		outfile.TableCell(model.Name(g_loc) + " (" + model.Type() + ")", COLUMN_0_WIDTH, "Arial", 10, Constants.C_GREY_80_PERCENT, Constants.C_WHITE, 0, Constants.FMT_LEFT | Constants.FMT_VTOP, 0);
		outfile.TableCellF(model_identifier, COLUMN_1_WIDTH, "TABLE_CELL_GREY");
		outfile.TableCellF(model.GUID(), COLUMN_1_WIDTH, "TABLE_CELL_GREY");
		outfile.TableCellF(SAP_ID, COLUMN_2_WIDTH, "TABLE_CELL_GREY");
		outfile.TableCellF(getString("TEXT_RULE") + getRuleSettings(ruleID, "ruleNum"), COLUMN_3_WIDTH, "TABLE_CELL");
		outfile.TableCellF(getRuleSettings(ruleID, "ruleName"), COLUMN_4_WIDTH, "TABLE_CELL_LEFT");
		outfile.TableCell(infostring, COLUMN_5_WIDTH, "Arial", 10, Constants.C_BLACK, cellcolour, 0, Constants.FMT_CENTER | Constants.FMT_VTOP, 0);
		outfile.TableCellF(object, COLUMN_6_WIDTH, "TABLE_CELL_LEFT");
		outfile.TableCellF(detailInfo, COLUMN_7_WIDTH, "TABLE_CELL_LEFT");
		outfile.TableRow();
	}

	function ok_output(model, ruleNumber, ruleID, object, detailInfo) {
		
		var model_identifier = model.Attribute(ATTR_Identifier, g_loc).getValue();
        var SAP_ID = model.Attribute(Constants.AT_SAP_ID2, g_loc).getValue();
	
        
        outfile.TableCellF(superiorObject, COLUMN_X_WIDTH, "TABLE_CELL_GREY");
		outfile.TableCell(model.Name(g_loc) + " (" + model.Type() + ")", COLUMN_0_WIDTH, "Arial", 10, Constants.C_GREY_80_PERCENT, Constants.C_WHITE, 0, Constants.FMT_LEFT | Constants.FMT_VTOP, 0);
		outfile.TableCellF(model_identifier, COLUMN_1_WIDTH, "TABLE_CELL_GREY");
		outfile.TableCellF(model.GUID(), COLUMN_1_WIDTH, "TABLE_CELL_GREY");
		outfile.TableCellF(SAP_ID, COLUMN_2_WIDTH, "TABLE_CELL_GREY");
		outfile.TableCellF(getString("TEXT_RULE") + getRuleSettings(ruleID, "ruleNum"), COLUMN_3_WIDTH, "TABLE_CELL");
		outfile.TableCellF(getRuleSettings(ruleID, "ruleName"), COLUMN_4_WIDTH, "TABLE_CELL_LEFT");
		outfile.TableCellF(okSymbol, COLUMN_5_WIDTH, "TABLE_CELL_GREEN");
		outfile.TableCellF(object, COLUMN_6_WIDTH, "TABLE_CELL_LEFT");
		if (object == "" || object == "-") {
			outfile.TableCellF(detailInfo, COLUMN_7_WIDTH, "TABLE_CELL_LEFT");
		} else
			outfile.TableCellF(detailInfo, COLUMN_7_WIDTH, "TABLE_CELL_LEFT");
		outfile.TableRow();
	}

	function ko_output(model, ruleNumber, ruleID, object, detailInfo) {
        var model_identifier = model.Attribute(ATTR_Identifier, g_loc).getValue();
        var SAP_ID = model.Attribute(Constants.AT_SAP_ID2, g_loc).getValue();
	
        
		outfile.TableCellF(superiorObject, COLUMN_X_WIDTH, "TABLE_CELL_GREY");
		outfile.TableCell(model.Name(g_loc) + " (" + model.Type() + ")", COLUMN_0_WIDTH, "Arial", 10, Constants.C_GREY_80_PERCENT, Constants.C_WHITE, 0, Constants.FMT_LEFT | Constants.FMT_VTOP, 0);
		outfile.TableCellF(model_identifier, COLUMN_1_WIDTH, "TABLE_CELL_GREY");
		outfile.TableCellF(model.GUID(), COLUMN_1_WIDTH, "TABLE_CELL_GREY");
		outfile.TableCellF(SAP_ID, COLUMN_2_WIDTH, "TABLE_CELL_GREY");
		outfile.TableCellF(getString("TEXT_RULE") + getRuleSettings(ruleID, "ruleNum"), COLUMN_3_WIDTH, "TABLE_CELL");
		outfile.TableCellF(getRuleSettings(ruleID, "ruleName"), COLUMN_4_WIDTH, "TABLE_CELL_LEFT");
		outfile.TableCellF(koSymbol, COLUMN_5_WIDTH, "TABLE_CELL_RED");
		outfile.TableCellF(object, COLUMN_6_WIDTH, "TABLE_CELL_LEFT");
		if (object == "" || object == "-") {
			outfile.TableCellF(detailInfo, COLUMN_7_WIDTH, "TABLE_CELL_LEFT");
		} else
			outfile.TableCellF(detailInfo, COLUMN_7_WIDTH, "TABLE_CELL_LEFT");
		outfile.TableRow();
	}

//    function ko_output2(modelName, model_identifier, modelGuid, sapId, ruleNumber, ruleID, object, detailInfo, obeforobj, obehindobj) {

    function ko_output2(model, ruleNumber, ruleID, object, detailInfo, obeforobj, obehindobj) {		
        var model_identifier = model.Attribute(ATTR_Identifier, g_loc).getValue();
        var SAP_ID = model.Attribute(Constants.AT_SAP_ID2, g_loc).getValue();
	
        
        var sbeforobj = "";
		var sbehindobj = "";
		for (var i = 0; i < obeforobj.length; i++) {
			if (i < obeforobj.length - 1)
				sbeforobj += obeforobj[i].ObjDef().Name(g_loc) + ", ";
			else
				sbeforobj += obeforobj[i].ObjDef().Name(g_loc);
		}
		for (var j = 0; j < obehindobj.length; j++) {
			if (j < obehindobj.length - 1)
				sbehindobj += obehindobj[j].ObjDef().Name(g_loc) + ", ";
			else
				sbehindobj += obehindobj[j].ObjDef().Name(g_loc);
		}
		outfile.TableCellF(superiorObject, COLUMN_X_WIDTH, "TABLE_CELL_GREY");
		outfile.TableCell(model.Name(g_loc) + " (" + model.Type() + ")", COLUMN_0_WIDTH, "Arial", 10, Constants.C_GREY_80_PERCENT, Constants.C_WHITE, 0, Constants.FMT_LEFT | Constants.FMT_VTOP, 0);
		outfile.TableCellF(model_identifier, COLUMN_1_WIDTH, "TABLE_CELL_GREY")
		outfile.TableCellF(model.GUID(), COLUMN_1_WIDTH, "TABLE_CELL_GREY");
		outfile.TableCellF(SAP_ID, COLUMN_2_WIDTH, "TABLE_CELL_GREY");
		outfile.TableCellF(getString("TEXT_RULE") + getRuleSettings(ruleID, "ruleNum"), COLUMN_3_WIDTH, "TABLE_CELL");
		outfile.TableCellF(getRuleSettings(ruleID, "ruleName"), COLUMN_4_WIDTH, "TABLE_CELL_LEFT");
		outfile.TableCellF(koSymbol, COLUMN_5_WIDTH, "TABLE_CELL_RED");
		outfile.TableCellF(object, COLUMN_6_WIDTH, "TABLE_CELL_LEFT");
		outfile.TableCellF(detailInfo + " " + getString("TEXT_RULE_5_CNX_OBJECS_BEFORE") + " " + sbeforobj + " " + getString("TEXT_RULE_5_CNX_OBJECS_BEFORE") + " " + sbehindobj, COLUMN_7_WIDTH, "TABLE_CELL_LEFT");
		outfile.TableRow();
	}

	function warning_output(model, ruleNumber, ruleID, object, detailInfo) {
        var model_identifier = model.Attribute(ATTR_Identifier, g_loc).getValue();
        var SAP_ID = model.Attribute(Constants.AT_SAP_ID2, g_loc).getValue();
	
        
		outfile.TableCellF(superiorObject, COLUMN_X_WIDTH, "TABLE_CELL_GREY");
		outfile.TableCell(model.Name(g_loc) + " (" + model.Type() + ")", COLUMN_0_WIDTH, "Arial", 10, Constants.C_GREY_80_PERCENT, Constants.C_WHITE, 0, Constants.FMT_LEFT | Constants.FMT_VTOP, 0);
		outfile.TableCellF(model_identifier, COLUMN_1_WIDTH, "TABLE_CELL_GREY");
		outfile.TableCellF(model.GUID(), COLUMN_1_WIDTH, "TABLE_CELL_GREY");
		outfile.TableCellF(SAP_ID, COLUMN_2_WIDTH, "TABLE_CELL_GREY");
		outfile.TableCellF(getString("TEXT_RULE") + getRuleSettings(ruleID, "ruleNum"), COLUMN_3_WIDTH, "TABLE_CELL");
		outfile.TableCellF(getRuleSettings(ruleID, "ruleName"), COLUMN_4_WIDTH, "TABLE_CELL_LEFT");
		outfile.TableCellF(warningSymbol, COLUMN_5_WIDTH, "TABLE_CELL_ORANGE");
		outfile.TableCellF(object, COLUMN_6_WIDTH, "TABLE_CELL_LEFT");
		if (object == "" || object == "-") {
			outfile.TableCellF(detailInfo, COLUMN_7_WIDTH, "TABLE_CELL_LEFT");
		} else
			outfile.TableCellF(detailInfo, COLUMN_7_WIDTH, "TABLE_CELL_LEFT");
		outfile.TableRow();
	}
    
    function indexOfArray(item, Arr){
result = false;
if (Arr != null){
if (Arr.length == 0){
result = true;
}else{
for (var i = 0; i < Arr.length; i++){
if (item.toString() == Arr[i].toString()) result = true;
}
}
}
return result;    
}

function CheckObjAttr(tObjDef,tItemSettings){
var result = new Array();
for (var i = 0; i < tItemSettings.length; i++){
var IsObjAttrs = checkSpecificAttrValue([tObjDef], tItemSettings[i][0], tItemSettings);
if (!IsObjAttrs) result.push(tObjDef,tItemSettings[i][0]);
}
return result;
}

function getRightLib(Arr1,Arr2){
if (Arr1.length == 1 && Arr2.length ==0) return Arr1;
else if (Arr1.length == 0 && Arr2.length ==1) return Arr2;
else return Arr1;
}

function getMasterGroup(tObjOcc, tItemSettings) {
    var result = "";
    for (var i = 0; i < tItemSettings.ObjMasterGroupGUID.length; i++) {
        var IsDefSymGUID = indexOfArray(tObjOcc.ObjDef().getDefaultSymbolGUID(), tItemSettings.ObjMasterGroupGUID[i][1]);
        var IsDefSymNum = indexOfArray(tObjOcc.ObjDef().getDefaultSymbolNum(), tItemSettings.ObjMasterGroupGUID[i][1]);
        var IsAttrs = CheckObjAttr(tObjOcc.ObjDef(), tItemSettings.ObjMasterGroupGUID[i][2]);
        if ((IsDefSymGUID || IsDefSymNum) && IsAttrs.length == 0) result = tItemSettings.ObjMasterGroupGUID[i][0];
    }
    return result;
}