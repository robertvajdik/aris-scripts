/**
 * Copyright (C) 2020 Software AG, Darmstadt, Germany and/or Software AG USA Inc., Reston, VA, USA,
 * and/or its subsidiaries and/or its affiliates and/or their licensors.
 *
 * Use, reproduction, transfer, publication or disclosure is prohibited
 * except as specifically provided for in your License Agreement with Software AG.
 *
 * Version: 10.0.12.0.1470486
 */

var PSU_GROUP_AT_IDENTIFIER = Constants.AT_REFERENCE_ID;

var PSM_MODEL_TYPE  = Constants.MT_SYS_LAY_OUT_PLAN;

var UNIT_OBJ_TYPES    = [Constants.OT_PROCESS_SUPPORT_UNIT];
var ALLOC_OBJ_TYPES   = [Constants.OT_APPL_SYS_TYPE, Constants.OT_APPL_SYS, Constants.OT_APPL_SYS_CLS];
var COLHEAD_OBJ_TYPES = [Constants.OT_FUNC, Constants.OT_IS_FUNC, Constants.OT_FUNC_CLUSTER];
var ROWHEAD_OBJ_TYPES = [Constants.OT_GRP, Constants.OT_ORG_UNIT, Constants.OT_ORG_UNIT_TYPE, Constants.OT_PERS, 
                         Constants.OT_PERS_TYPE, Constants.OT_POS, Constants.OT_LOC, Constants.OT_PERF];

var ALLOC_CXN_TYPES   = [Constants.CT_BELONGS_TO_PROC_SUPPORT_UNIT];
var COLHEAD_CXN_TYPES = [Constants.CT_CAN_SUPP_1];
var ROWHEAD_CXN_TYPES = [Constants.CT_CAN_BE_USER, Constants.CT_CAN_BE_LOC_AT, Constants.CT_CAN_SUPP_1];

var PSM_ATTR_TYPES  = [Constants.AT_MACRO_SUPPORT, Constants.AT_PROCESS_SUPPORT_VIEW, Constants.AT_ANALYSIS_DATE, 
                       Constants.AT_LAST_GENERATED_VIEW_PSM, Constants.AT_LAST_UPDATE_PSM, Constants.AT_CHANGE_HISTORY, Constants.AT_FREEZE_MODEL];
var UNIT_ATTR_TYPES = [Constants.AT_NAME, Constants.AT_PROCESSING_TYPE, Constants.AT_REM, Constants.AT_LAST_CHNG_2,
                       Constants.AT_NAME_FULL, Constants.AT_SRC, Constants.AT_CHANGE_HISTORY];
var ALLOC_CXN_ATTR_TYPES = [Constants.AT_PROC_SUPPORT_STATUS, Constants.AT_START_PLAN_PHASE_IN, Constants.AT_PHASE_IN_PLAN,
                            Constants.AT_PHASE_IN_AS_IS, Constants.AT_START_PLAN_PHASE_OUT, Constants.AT_PHASE_OUT_PLAN, 
                            Constants.AT_PHASE_OUT_AS_IS, Constants.AT_TO_BE, Constants.AT_DESC];
var g_oDefaultSymbols = new java.util.HashMap();
g_oDefaultSymbols.put(Constants.OT_FUNC,[Constants.ST_FUNC]);
g_oDefaultSymbols.put(Constants.OT_IS_FUNC,[Constants.ST_IS_FUNC]);
g_oDefaultSymbols.put(Constants.OT_FUNC_CLUSTER,[Constants.ST_IS_FUNC_DISTRICT]);
g_oDefaultSymbols.put(Constants.OT_ORG_UNIT,[Constants.ST_ORG_UNIT_2]);
g_oDefaultSymbols.put(Constants.OT_ORG_UNIT_TYPE,[Constants.ST_ORG_UNIT_TYPE_1]);
g_oDefaultSymbols.put(Constants.OT_POS,[Constants.ST_POS]);
g_oDefaultSymbols.put(Constants.OT_GRP,[Constants.ST_GRP]);
g_oDefaultSymbols.put(Constants.OT_PERS_TYPE,[Constants.ST_EMPL_TYPE]);
g_oDefaultSymbols.put(Constants.OT_PERS,[Constants.ST_PERS_INT]);
g_oDefaultSymbols.put(Constants.OT_PERF,[Constants.ST_PERFORM]);
g_oDefaultSymbols.put(Constants.OT_LOC,[Constants.ST_LOC_1]);
g_oDefaultSymbols.put(Constants.OT_APPL_SYS_TYPE,[Constants.ST_APPL_SYS_TYPE_2]);
g_oDefaultSymbols.put(Constants.OT_APPL_SYS,[Constants.ST_APPL_SYS_2]);
g_oDefaultSymbols.put(Constants.OT_APPL_SYS_CLS,[Constants.ST_APPL_SYS_CLS_2]);  


var iSymbolScaleFactor = 1;  //Will be reset if psmReportConfig.xml contains <SymbolScaleFactor></SymbolScaleFactor>
var iCurrentSymbolScaleFactor = 1;  //Will be reset if psmReportConfig.xml contains <SymbolScaleFactor></SymbolScaleFactor>
var iPaletteGuid = getPaletteGuid();    // AGA-10251
setGlobalLayoutDimVars(iCurrentSymbolScaleFactor);

function setGlobalLayoutDimVars(p_iSymbolScaleFactor){
    var defaultAstHeight = isOldPalette() ? 60 : 62;
    var defaultAstWidth = isOldPalette() ? 250 : 400;
    
    astHeight = defaultAstHeight * p_iSymbolScaleFactor;
    astWidth = defaultAstWidth* p_iSymbolScaleFactor;
    astDimension = new java.awt.Dimension(astWidth, astHeight);
    funcDimension = new java.awt.Dimension(astWidth, 3 * astHeight);
    locDimension = new java.awt.Dimension(astWidth, 2.5 * astHeight);
    offsetVert = 20 * p_iSymbolScaleFactor;
    offsetHori = 22 * p_iSymbolScaleFactor;
    laneWidth = 1 * astWidth + 2 * offsetHori + 5;
    laneHeight = 1 * astWidth + 2 * offsetVert + 5;
}  

function isOldPalette() {
    return compareString(iPaletteGuid, "77788534-58b0-49cd-886c-965135949e74") == 0;
}

function getPaletteGuid() {
    var defaultPaletteGuid = "77788534-58b0-49cd-886c-965135949e74";
    var paletteGuid = "";
    if (isMacroRunning()) {
        var oDB = getMacroDatabase();
        if (oDB != null && oDB != undefined) {
            paletteGuid = Designer.getPaletteGUID(oDB);
        }
    } else {
        var oDB = ArisData.getActiveDatabase();
        if (oDB != null && oDB != undefined && oDB.IsValid()) {
            paletteGuid = oDB.getPaletteGUID();
        }
    }
    if (paletteGuid == null || paletteGuid == "") return defaultPaletteGuid;
    return paletteGuid;
    
    function getMacroDatabase() {
        if (Context.getSelectedDatabases().length > 0) {
            return Context.getSelectedDatabases()[0];
        }
        return Context.getLoginInfo(getMacroSelection()[0]).getDatabase();
        
        function getMacroSelection() {
            var selection = Context.getSelectedModels();
            if (selection.length == 0) selection = Context.getSelectedObjects();
            if (selection.length == 0) selection = Context.getSelectedObjOccs();
            if (selection.length == 0) selection = Context.getSelectedGroups();
            return selection;
        }
    }
}

function isMacroRunning() {
    var env = Context.getEnvironment();
    return env == "MACRO";
}  

function isUnitObj(p_iTypeNum){
    return UNIT_OBJ_TYPES.indexOf(p_iTypeNum) >= 0;
}
function isAssignedObj(p_iTypeNum){
    return ALLOC_OBJ_TYPES.indexOf(p_iTypeNum) >= 0;
}
function isColHeaderObj(p_iTypeNum){
    return COLHEAD_OBJ_TYPES.indexOf(p_iTypeNum) >= 0;
}
function isRowHeaderObj(p_iTypeNum){
    return ROWHEAD_OBJ_TYPES.indexOf(p_iTypeNum) >= 0;
}
function isAssignmentCxn(p_iTypeNum){
    return ALLOC_CXN_TYPES.indexOf(p_iTypeNum) >= 0;
}
function isColHeaderCxn(p_iTypeNum){
    return COLHEAD_CXN_TYPES.indexOf(p_iTypeNum) >= 0;
}
function isRowHeaderCxn(p_iTypeNum){
    return ROWHEAD_CXN_TYPES.indexOf(p_iTypeNum) >= 0;
}
function isHeaderObj(p_iTypeNum){
    return isColHeaderObj(p_iTypeNum) || isRowHeaderObj(p_iTypeNum);
}

function getHeaderTypes(p_oFilter, bIsColHeader) {
    var aHeaderTypes = new Array();
    var objTypeSet = new java.util.HashSet();

    var aSymbolTypes = p_oFilter.Symbols(Constants.MT_SYS_LAY_OUT_PLAN);
    for (var i = 0; i < aSymbolTypes.length; i++) {
        var objType = p_oFilter.SymbolObjType(aSymbolTypes[i]);
        if (objTypeSet.add(objType)) {
            if (bIsColHeader) {
                if (isColHeaderObj(objType)) aHeaderTypes.push(objType);
            } else {
                if (isRowHeaderObj(objType)) aHeaderTypes.push(objType);
            }
        }
    }
    return aHeaderTypes;
}

function psmConfig(p_bMacro, p_oFilter){
    var oConfigMap = new java.util.HashMap();
    var isMacro = p_bMacro;
    var mFilter = null;
    var useDefDefaultSymbols = false;
    if (isMacro != null) {
        if (isMacro) mFilter = Context.getArisMethod();
        else mFilter = ArisData.ActiveFilter();
    } else {
        mFilter = p_oFilter;
    }    
    var aObjectTypeList = new Array();
    var aObjectTypeListNames = new Array();
    objectFilterList();
    resetSymbolScaleFactor();
    this.isUseDefDefaultSymbols = function(){
        return useDefDefaultSymbols;
    }
    this.isValidAllocation = function(oObj){
        var oWrapper = objWrapperMacro;
        if (!isMacro) oWrapper = objWrapperReport;
        return isValidAllocationInternal(new oWrapper(oObj));
    }
    this.getAObjectTypeList = function(){
        return aObjectTypeList;
    }
    this.getAObjectTypeListNames = function(){
        return aObjectTypeListNames;
    }
    this.getPsuGroup = function(){
        var oPsuGroup = findPsuGroup();
        if (oPsuGroup != null) return oPsuGroup;
        // No such group found
        var oPsuParentGroup = getMainGroup();
        var psuParentGroupGuid = getConfigEntry();
        if (psuParentGroupGuid != null && psuParentGroupGuid != "") {  // AGA-7183, AGA-9636
            var oGroup =  findGroupByGuid(psuParentGroupGuid);
            if (oGroup != null) oPsuParentGroup = oGroup;
        }
        return createPsuGroup(oPsuParentGroup);
        
        function getConfigEntry() {
            var oRoot = getRoot();
            if (oRoot != null) {        
                var oChild = oRoot.getChild("PsuParentGroup");
                if (oChild != null) return oChild.getText();
            }
            return null;
        }
        function createPsuGroup(parentGroup) {
            var oPsuGroup = null;
            var sName = mFilter.ObjTypeName(Constants.OT_PROCESS_SUPPORT_UNIT);
            if (isMacro) {    
                var oDB = Context.getLoginInfo(parentGroup).getDatabase();
                oPsuGroup = Explorer.createGroup(parentGroup, sName);
                Designer.setAttributePersistent(oPsuGroup, PSU_GROUP_AT_IDENTIFIER, new java.lang.String(parseInt(Constants.OT_PROCESS_SUPPORT_UNIT)), null);                       
                var oDBLanguages = Designer.getAllDBLanguages(oDB);
                for (var i=0;i<oDBLanguages.length;i++){
                    var oLang = oDBLanguages[i];            
                    Designer.setAttributePersistent(oPsuGroup, Constants.AT_NAME, sName, oLang);            
                } 
            } else {
                var oDB = ArisData.getActiveDatabase();
                var nLocale = Context.getSelectedLanguage();
                oPsuGroup = parentGroup.CreateChildGroup(sName, nLocale);
                oPsuGroup.Attribute(PSU_GROUP_AT_IDENTIFIER, nLocale).setValue(parseInt(Constants.OT_PROCESS_SUPPORT_UNIT));
                var oDBLanguages = oDB.LanguageList();
                for (var i=0;i<oDBLanguages.length;i++){
                    var oLang = oDBLanguages[i].LocaleId();;   
                    oPsuGroup.Attribute(Constants.AT_NAME, oLang).setValue(sName);        
                } 
            }            
            return oPsuGroup;            
        }
        function findGroupByGuid(sGroupGuid) {
            if (isMacro) {
                return Designer.getGroupByGUID(getDatabase(), sGroupGuid);
            }
            var oGroup = getDatabase().FindGUID(sGroupGuid, Constants.CID_GROUP);
            if (oGroup != null && oGroup.IsValid()) return oGroup;
            return null;
        }
        function findPsuGroup() {
            var oPsuGroups = null;
            var sAttrValue = new java.lang.String(parseInt(Constants.OT_PROCESS_SUPPORT_UNIT));
            if (isMacro) {
                oPsuGroups = Search.searchGroups(getMainGroup(), "*", Constants.SEARCH_OPTION_RECURSIVE | Constants.SEARCH_OPTION_MATCH_PATTERN, true, 
                                                 Constants.SEARCH_OPTION_CASE_SENSITIVE, [Constants.SEARCH_ATTR_OPERATOR_EQUALS], 
                                                 [PSU_GROUP_AT_IDENTIFIER], [sAttrValue]);
            } else {
                oPsuGroups = getDatabase().Find(Constants.SEARCH_GROUP, PSU_GROUP_AT_IDENTIFIER, Context.getSelectedLanguage(), sAttrValue, Constants.SEARCH_CMP_CASESENSITIVE | Constants.SEARCH_CMP_EQUAL);
            }
            if (oPsuGroups.length > 0) return oPsuGroups[0];
            return null;
        }
        function getMainGroup() {
            if (isMacro)  return Explorer.getMainGroup(getDatabase());
            return getDatabase().RootGroup();
        }
        function getDatabase() {
            if (isMacro) return getMacroDatabase();
            return ArisData.getActiveDatabase();

            function getMacroDatabase() {
                if (Context.getSelectedDatabases().length > 0) {
                    return Context.getSelectedDatabases()[0];
                }
                return Context.getLoginInfo(getMacroSelection()[0]).getDatabase();
                
                function getMacroSelection() {
                    var selection = Context.getSelectedModels();
                    if (selection.length == 0) selection = Context.getSelectedObjects();
                    if (selection.length == 0) selection = Context.getSelectedObjOccs();
                    if (selection.length == 0) selection = Context.getSelectedGroups();
                    return selection;
                }
            }
        }  
    }    
    this.ignoreCheckBox_ToBe = function(){
        var oRoot = getRoot();
        if (oRoot != null) {        
            var oChild = oRoot.getChild("ignoreCheckBox_ToBe");
            if (oChild != null) return (StrComp(oChild.getText(), "true") == 0 || StrComp(oChild.getText(), "True") == 0);
        }
        return false;
    }
    function isValidAllocationInternal(oWrapper){        
        var result = false;
        var nTypeNum = oWrapper.getTypeNum();
        if (oConfigMap.containsKey(nTypeNum)){
            var config = oConfigMap.get(nTypeNum);
            if (config.nAT != null && config.aAVTs != null){
                if (config.aAVTs[0] == -1){
                   if (oWrapper.isNotMaintained(config.nAT)) result=true;
                } else {    
                    var nAttrTypeNum = oWrapper.getAttributeValue(config.nAT)
                    for (var i = 0; i < config.aAVTs.length; i++) {
                        if (nAttrTypeNum == config.aAVTs[i]) result = true;
                    }
                }    
            } else result = true;
        }
        return result
    }
    function objectFilterList(){
        var oRoot = getRoot();
        if (oRoot!=null){
            var oConfigs = oRoot.getChildren();        
            var oConfigsItr = oConfigs.iterator();
            while(oConfigsItr.hasNext()){
                addConfig(oConfigsItr.next());  
            }
        }    
        if (oConfigMap.size()==0) {
            oConfigMap.put(Constants.OT_APPL_SYS_TYPE,new CONFIG(Constants.OT_APPL_SYS_TYPE,Constants.AT_SYSTEM_TYPE,new Array(Constants.AVT_SYSTEM_TYPE_SYSTEM,Constants.AVT_SYSTEM_TYPE_SERVICE)));
            aObjectTypeList.push(Constants.OT_APPL_SYS_TYPE);
            aObjectTypeListNames.push(mFilter.ObjTypeName(Constants.OT_APPL_SYS_TYPE));
        }    
    }     
    function resetSymbolScaleFactor(){            
        var oRoot = getRoot();
        if (oRoot != null) {   
           var oChild = oRoot.getChild("SymbolScaleFactor");
           if (oChild != null) {
               var newSymbolScaleFactor = oChild.getText();
               if (!isNaN(newSymbolScaleFactor) && newSymbolScaleFactor>=1  && newSymbolScaleFactor<=3) {
                  iSymbolScaleFactor = newSymbolScaleFactor;
                  //setGlobalLayoutDimVars(iSymbolScaleFactor);
               }    
           }
        }
    }  
    function getRoot(){
        try {
            var root = null;
            var builder = new Packages.org.jdom.input.SAXBuilder(false);
            var configFileData = Context.getFile("psmReportConfig.xml", 0/*Constants.LOCATION_COMMON_FILES*/);
                if (configFileData.length > 0){
                //var configFileString = new java.lang.String(configFileData, "UTF-8");
                var configInputStream = new java.io.ByteArrayInputStream(configFileData);
                var doc = builder.build(configInputStream);
                root = doc.getRootElement();
            }    
            return root;
        } catch (e) {
            if (isMacro) Context.MsgBox("Fehler : "+ e.toString(),"Konfigurationsdatei");
            else Dialogs.MsgBox("Fehler : "+ e.toString());
            return null
        }
    }
    function changeDefaultSymbols(oPsmSymbols){        
        var oPsmSymbolsLst = oPsmSymbols.getChildren();        
        var oPsmSymbolsItr = oPsmSymbolsLst.iterator();
        while(oPsmSymbolsItr.hasNext()){
            changeDefaultSymbol(oPsmSymbolsItr.next());  
        }
    }
    function changeDefaultSymbol(oPsmSymbol){
        oOT = oPsmSymbol.getChild("OT");
        if (oOT!=null) {
            nOT = Constants[oOT.getText()];
            if (g_oDefaultSymbols.containsKey(nOT)){  
                oST = oPsmSymbol.getChild("ST");
                if (oST !=null) {   
                    var aNewDefaultSymbols = [];
                    aSTs = oST.getText().split(",");
                    for (var i = 0; i< aSTs.length; i++){
                        sST = new java.lang.String(aSTs[i]).trim();
                        nST = Constants[sST];
                        if (nST==null) nST = mFilter.UserDefinedSymbolTypeNum(sST)  
                        if (nST!=null) {
                            aNewDefaultSymbols.push(nST); 
                        }   
                    }
                    if (aNewDefaultSymbols.length>0) g_oDefaultSymbols.put(nOT,aNewDefaultSymbols);
                }
            }    
        }
    }
    function addConfig(config){
        var nAT = null;
        var aAVTs = null;
        var sConfig = "" + config.getName();
        if (sConfig.equals("AST")||sConfig.equals("AS")||sConfig.equals("ASC")){
            var oOT = config.getChild("OT");
            if (oOT != null) {
                var nOT = Constants[oOT.getText()];
                if (nOT!=null){    
                    var oAT = config.getChild("AT");
                    if (oAT != null){ 
                        var sAT = oAT.getText();
                        nAT = getATNum(sAT);//Constants[oAT.getText()];
                        if (nAT!=null){
                            var oAVT = config.getChild("AVT");
                            if (oAVT != null) aAVTs = getAVTs(sAT,oAVT.getText());
                        }    
                    }  
                    aObjectTypeList.push(nOT);                     
                    var oNameKey = config.getChild("NAMEKEY");
                    if (oNameKey!=null) {
                        var sNameKey = "" + sConfig;
                        try {
                            sNameKey = getString(sConfig)
                        } catch (e) { 
                            if (isMacro) Context.MsgBox("Fehler : "+ e.toString(),"Konfigurationsdatei  "+ getString(sConfig));
                            else Dialogs.MsgBox("Fehler : "+ e.toString()+"  "+ getString(sConfig));   
                        }    
                         aObjectTypeListNames.push(sNameKey);
                    } else aObjectTypeListNames.push(mFilter.ObjTypeName(nOT));                            
                    oConfigMap.put(nOT,new CONFIG(nOT,nAT,aAVTs));
                }                 
            }
        } else if (sConfig.equals("PsmSymbols")){
            if (config.getAttributeValue("useDefDefaultSymbols")!=null && config.getAttributeValue("useDefDefaultSymbols").equals("true")) useDefDefaultSymbols = true;
            changeDefaultSymbols(config);
        }   
    }
    function getAVTs(sAT,sAVT){  
        var aAVTs = null;                
        sAVT = sAVT.trim();                      
        if (sAVT != "") {                       
            aAVTs = new Array();
            if (sAVT == -1) {
               aAVTs.push(sAVT); 
            } else {    
                var sAVTs = sAVT.split(",");
                for (var i = 0; i < sAVTs.length; i++) {
                    sAVTs[i]=new java.lang.String(sAVTs[i]).trim();
                    sAVT = getAVTNum(sAT,sAVTs[i]);
                    if (sAVT!=null) aAVTs.push(sAVT);
                }
            }    
        }
        return aAVTs;
    }
    function CONFIG(nOT, nAT, aAVTs) {
        this.nOT = nOT;
        this.nAT = nAT;
        this.aAVTs = aAVTs;
    }
    
    function getATNum(p_sAT){
        var typeNum = Constants[p_sAT];
        if (typeNum==null) {
            typeNum = mFilter.UserDefinedAttributeTypeNum(p_sAT);
        } 
        return typeNum;
    }
    
    function getAVTNum(p_sAT,p_sAVT){
        var typeNum = Constants[p_sAVT];
        if (typeNum==null) {
            typeNum = mFilter.UserDefinedAttributeValueTypeNum(p_sAT,p_sAVT);
        }
        return typeNum;
    }  
    this.getDefaultSymbol = function(objTypeNum) { 
        var defaultSymbol = g_oDefaultSymbols.get(objTypeNum)[0]; 
        if ((defaultSymbol == null || !mFilter.IsValidSymbol(PSM_MODEL_TYPE, defaultSymbol))) {
            var oSymbols = mFilter.Symbols(PSM_MODEL_TYPE, objTypeNum);
            oSymbols = ([].concat(oSymbols)).sort(sortSymbol); // must be sorted numerically because otherwise the results would differ for macros and reports
            for (var i=0;i<oSymbols.length; i++){
                defaultSymbol = oSymbols[i];
                if (mFilter.IsValidSymbol(PSM_MODEL_TYPE, defaultSymbol)) {
                    break;
                }    
            }
        }
        return defaultSymbol;
        
        function sortSymbol(a, b) {
            return a-b;
        }
    }     
    this.getDefaultSymbols = function(objTypeNum) { 
        var defaultSymbols = g_oDefaultSymbols.get(objTypeNum); 
        if ((defaultSymbols == null || defaultSymbols.length == 0 || !mFilter.IsValidSymbol(PSM_MODEL_TYPE, defaultSymbols[0]))) {
            var oSymbols = mFilter.Symbols(PSM_MODEL_TYPE, objTypeNum);
            oSymbols = ([].concat(oSymbols)).sort(sortSymbol); // must be sorted numerically because otherwise the results would differ for macros and reports
            defaultSymbols = [];
            for (var i=0;i<oSymbols.length; i++){
                defaultSymbols.push = oSymbols[i];
            }
        }
        return defaultSymbols;
        
        function sortSymbol(a, b) {
            return a-b;
        }
    }       
    this.getDefDefaultSymbol = function(p_oObjDef){
        var iDefaultSymbolTypeNum = getDefaultSymbolWrapper(p_oObjDef);
        var iTypeNum = getTypeNum(p_oObjDef);
        if (useDefDefaultSymbols && iDefaultSymbolTypeNum != null && iDefaultSymbolTypeNum != 0) {
            if (mFilter.IsValidSymbol(PSM_MODEL_TYPE, iDefaultSymbolTypeNum) && hasAllCxns(iDefaultSymbolTypeNum,iTypeNum)) return iDefaultSymbolTypeNum
            else return this.getDefaultSymbol(iTypeNum);    
        } else {
            return this.getDefaultSymbol(iTypeNum);
        }
    }     
    function getTypeNum(p_oObjDef){
        if (isMacro){
            return p_oObjDef.getType();
        } else {
            return p_oObjDef.getTypeNum();
        }           
    }
    function getDefaultSymbolWrapper(p_oObjDef){
        if (isMacro){
            return Designer.getDefaultSymbol(p_oObjDef);
        } else {
            return p_oObjDef.getDefaultSymbol();
        }           
    }    
    function hasCxn4(p_iSym1,p_iSym2,isValidCxn){ 
        var aCxnTypes = mFilter.CxnTypes(Constants.MT_SYS_LAY_OUT_PLAN,p_iSym1, p_iSym2);
        for (var i=0; i < aCxnTypes.length;i++){
            if (isValidCxn(aCxnTypes[i])) return true;  
        }    
        return false;
    }
    function hasCxns4(p_iSym1,p_iSym2,isValidCxn){  
        return (hasCxn4(p_iSym1,p_iSym2,isValidCxn) || hasCxn4(p_iSym2,p_iSym1,isValidCxn));
    }
    function hasAllColCxns(p_iSym){
        if (!hasCxns4(Constants.ST_PROCESS_SUPPORT_UNIT,p_iSym,isColHeaderCxn)) return false;
        if (!hasCxns4(Constants.ST_PROCESS_SUPPORT_UNIT_1,p_iSym,isColHeaderCxn)) return false;
        return true;
    }
    function hasAllRowCxns(p_iSym){
        if (!hasCxns4(Constants.ST_PROCESS_SUPPORT_UNIT,p_iSym,isRowHeaderCxn)) return false;
        if (!hasCxns4(Constants.ST_PROCESS_SUPPORT_UNIT_1,p_iSym,isRowHeaderCxn)) return false;
        return true;
    }
    function hasAllCxns(p_iDefaultSymbolTypeNum,p_iTypeNum){
        if (isColHeaderObj(p_iTypeNum)) {
            return hasAllColCxns(p_iDefaultSymbolTypeNum);
        } else {
            return hasAllRowCxns(p_iDefaultSymbolTypeNum);
        }
    }
}  
function objWrapperMacro(oObj){
    var oObjDef = oObj;
    if (oObj.getItemKind() == Constants.CID_OBJOCC) {
        oObjDef = Designer.getDefinition(oObj);
    }
    this.getTypeNum = function(){
        return oObjDef.getType();
    }    
    this.getAttributeValue = function(nAT){
        var value = null;
        var oAttr = Designer.getAttribute(oObjDef, nAT, null);
        if (oAttr!=null){
            value = oAttr.getValue();
        }
        return value;
    } 
    this.isNotMaintained = function(nAT){
        return (this.getAttributeValue(nAT)==null)
    }
}    
function objWrapperReport(oObj){
    var oObjDef = oObj;
    var language = Context.getSelectedLanguage();
    if (oObj.KindNum() == Constants.CID_OBJOCC) {
        oObjDef = oObj.ObjDef();
    }
    this.getTypeNum = function(){
        return oObjDef.TypeNum();
    }    
    this.getAttributeValue = function(nAT){
        var value = null;        
        var oAttr = oObjDef.Attribute(nAT, language);
        if (oAttr.IsValid() && oAttr.IsMaintained()) {
            value = oAttr.MeasureUnitTypeNum();
        }
        return value;
    }  
    this.isNotMaintained = function(nAT){
        var oAttr = oObjDef.Attribute(nAT, language);
        if (oAttr!=null){
            return !(oAttr.IsValid() && oAttr.IsMaintained());
        }
        return false;
    }      
}
function checkFilter(p_oFilter){
    if (p_oFilter) this.oFilter = p_oFilter;
    else this.oFilter = Context.getArisMethod();
    this.colHeaderTypes = new Array();
    this.rowHeaderTypes = new Array();
    this.allocTypes = new Array();
    this.psmAttrTypes = PSM_ATTR_TYPES;
    this.psuAttrTypes = UNIT_ATTR_TYPES;
    this.allocCxnAttrTypes = ALLOC_CXN_ATTR_TYPES;

    this.bPSU = this.oFilter.IsValidModelType(Constants.MT_SYS_LAY_OUT_PLAN) && 
                this.oFilter.IsValidSymbol(Constants.MT_SYS_LAY_OUT_PLAN, Constants.ST_PROCESS_SUPPORT_UNIT) && 
                this.oFilter.IsValidSymbol(Constants.MT_SYS_LAY_OUT_PLAN, Constants.ST_PROCESS_SUPPORT_UNIT_1);    
    this.getObjTypes = function() {         
        var objTypeSet = new java.util.HashSet();
        var aSymbolTypes = this.oFilter.Symbols(Constants.MT_SYS_LAY_OUT_PLAN);
        for (var i = 0; i < aSymbolTypes.length; i++) {
            var objType = this.oFilter.SymbolObjType(aSymbolTypes[i]);
            if (objTypeSet.add(objType)) {
                if (isColHeaderObj(objType)) this.colHeaderTypes.push(objType);
                else if (isRowHeaderObj(objType)) this.rowHeaderTypes.push(objType);
                else if (isAssignedObj(objType)) this.allocTypes.push(objType);
            }
        }
    }
    this.containsSymbols = function(p_aObjTypes){
        for (var i=0; i < p_aObjTypes.length;i++){
            var iObjType = p_aObjTypes[i];
            var iSymType = parseInt((new psmConfig(null/*p_bMacro*/, this.oFilter)).getDefaultSymbol(iObjType));
            if (!this.oFilter.IsValidSymbol(Constants.MT_SYS_LAY_OUT_PLAN,iSymType)) return false;
        }
        return true;
    }
    this.hasAttributes4 = function(p_itemKind,p_ItemType, p_aAttributes){  
        for (var i=0; i < p_aAttributes.length;i++){
            if (!this.oFilter.IsValidAttrType(p_itemKind,p_ItemType,p_aAttributes[i])) return false;
        }
        return true;
    }    
    this.hasAllAttribute = function(){
        if (!this.hasAttributes4(Constants.CID_MODEL,Constants.MT_SYS_LAY_OUT_PLAN, this.psmAttrTypes)) return false;
        if (!this.hasAttributes4(Constants.CID_OBJDEF,Constants.OT_PROCESS_SUPPORT_UNIT, this.psuAttrTypes)) return false;
        if (!this.hasAttributes4(Constants.CID_CXNDEF,Constants.CT_BELONGS_TO_PROC_SUPPORT_UNIT, this.allocCxnAttrTypes)) return false;
        return true;
    }
    this.hasCxn4 = function(p_iSym1,p_aSym2,isValidCxn){ 
        var aCxnTypes = this.oFilter.CxnTypes(Constants.MT_SYS_LAY_OUT_PLAN,p_iSym1, p_aSym2);
        for (var i=0; i < aCxnTypes.length;i++){
            if (isValidCxn(aCxnTypes[i])) return true;  
        }    
        return false;
    }
    this.hasCxns4 = function(p_iSym1,p_aObjTypes,isValidCxn){    
        var result = true;
        for (var i=0; i < p_aObjTypes.length;i++){            
            var iObjType = p_aObjTypes[i];
            var iSym2 = parseInt((new psmConfig(null/*p_bMacro*/, this.oFilter)).getDefaultSymbol(iObjType));
            result = result && (this.hasCxn4(p_iSym1,iSym2,isValidCxn) || this.hasCxn4(iSym2,p_iSym1,isValidCxn));
        }   
        return result;
    }
    this.hasAllCxns = function(){
        if (!this.hasCxns4(Constants.ST_PROCESS_SUPPORT_UNIT,this.colHeaderTypes,isColHeaderCxn)) return false;
        if (!this.hasCxns4(Constants.ST_PROCESS_SUPPORT_UNIT_1,this.colHeaderTypes,isColHeaderCxn)) return false;
        if (!this.hasCxns4(Constants.ST_PROCESS_SUPPORT_UNIT,this.rowHeaderTypes,isRowHeaderCxn)) return false;
        if (!this.hasCxns4(Constants.ST_PROCESS_SUPPORT_UNIT_1,this.rowHeaderTypes,isRowHeaderCxn)) return false;
        if (!this.hasCxns4(Constants.ST_PROCESS_SUPPORT_UNIT,this.allocTypes,isAssignmentCxn)) return false;        
        for (var i=0; i < this.allocTypes.length;i++){
            var iObjType = this.allocTypes[i];
            var iSymType = parseInt((new psmConfig(null/*p_bMacro*/, this.oFilter)).getDefaultSymbol(iObjType));
            if (!this.hasCxns4(iSymType,this.colHeaderTypes,dummy)) return false;
            if (!this.hasCxns4(iSymType,this.rowHeaderTypes,dummy)) return false;
        }
        function dummy(dummy){
            return true
        }
        return true;
    }
    this.isValidPSMFilter = function(){
        bValid = this.oFilter.IsFullMethod();
        if (!bValid && this.bPSU && this.hasAllAttribute()) {
            this.getObjTypes();
            if (this.colHeaderTypes.length>0 && this.rowHeaderTypes.length>0 && this.allocTypes.length>0){
                if (this.containsSymbols(this.colHeaderTypes) && this.containsSymbols(this.rowHeaderTypes) && this.containsSymbols(this.allocTypes)){
                    bValid = this.hasAllCxns();                    
                }                
            }
        }
        return bValid;
    }
}

// functions moved from 'psmReport.js'
function doCheckDate(datestring, bMultiple) {
    if (bMultiple && compareString(datestring, differentValues) == 0) return true;    
    
    var isValid = false;
    if( (""+datestring).length == 10 ) {            // length of 'MM/dd/yyyy' = 10, BLUE-18196
        var dateArray = datestring.split("/");
        if (dateArray.length == 3) {
            var mm = parseInt(getDayOrMonth(dateArray[0]));
            var dd = parseInt(getDayOrMonth(dateArray[1]));
            var yyyy = parseInt(dateArray[2]);
            
            if (yyyy > 0) {
                if (mm > 0 && mm <= 12 && dd > 0) {
                    if ((mm == 1 || mm == 3 || mm == 5 || mm == 7 || mm == 8 || mm == 10 || mm == 12) && dd <= 31) {
                        isValid = true;
                    }
                    else if ((mm == 4 || mm == 6 || mm == 9 || mm == 11) && dd <= 30) {
                        isValid = true;
                    }
                    else if ((mm == 2) && dd <= (28 + getLeapYear(yyyy))) {
                        isValid = true;
                    }
                }
            }
        }
    }
    else if (datestring == "") {
        isValid = true;
    }
    return isValid;
    
    function getLeapYear(yyyy) {
        // returns 1 if leap year, else 0
        if ((yyyy % 4) == 0) {
            if ((yyyy % 100) == 0) {
                if ((yyyy % 400) == 0) return 1;
                return 0;
            }
            return 1;
        } 
        return 0;
    }
}

function getDayOrMonth(p_sDate) {
 
    if (p_sDate.substr(0,1) == "0") {
        return p_sDate.substr(1,1);
    }
    return p_sDate;
}

function compareString(str1, str2) {
    var x = new java.lang.String(str1);
    var y = new java.lang.String(str2);

    return x.compareTo(y);
}

