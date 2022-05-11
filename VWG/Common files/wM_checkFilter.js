/**
 * Copyright (C) 2020 Software AG, Darmstadt, Germany and/or Software AG USA Inc., Reston, VA, USA,
 * and/or its subsidiaries and/or its affiliates and/or their licensors.
 *
 * Use, reproduction, transfer, publication or disclosure is prohibited
 * except as specifically provided for in your License Agreement with Software AG.
 *
 * Version: 10.0.12.0.1470486
 */

/*
 * Script: wM_checkFilter
 */

var debugMode = false;

var global_FileName = Context.getProperty("FILTER_CONTENT_FILENAME");
if (global_FileName == null) {
    global_FileName = "Filter-Content of wm Integration.xml"; //"Filter-Content.xml";
}

const c_FileName    = global_FileName;
const c_FilterData  = "FilterData";
const c_Model       = "Model";
const c_Obj         = "Obj";
const c_CxnDef      = "CxnDef";
const c_Cxn         = "Cxn";
const c_Sym         = "Sym";
const c_Ass         = "Ass";
const c_Attr        = "Attr";
const c_mtn         = "mtn";
const c_otn         = "otn";
const c_cbtn        = "cbtn";
const c_sn          = "sn";
const c_ssn         = "ssn";
const c_dsn         = "dsn";
const c_ikn         = "ikn";
const c_itn         = "itn";
const c_atn         = "atn";

CXN_TYPE = function (p_cxnTypeNum, p_srcSymbolNum, p_trgSymbolNum) {
    this.cxnTypeNum = p_cxnTypeNum;
    this.srcSymbolNum = p_srcSymbolNum;
    this.trgSymbolNum = p_trgSymbolNum;
}

function checkFilter(oFilter) {
    var result;
    //Context.writeLog(formatstring2("Check filter: @1 (@2)...", oFilter.Name(Context.getSelectedLanguage()), oFilter.GUID()));

    if (oFilter.IsFullMethod()) {
        result = true;
    } else {
        var fileData = Context.getFile(c_FileName, Constants.LOCATION_SCRIPT);
        var xmlDoc = Context.getXMLParser(fileData);
        if (xmlDoc == null || !xmlDoc.isValid())  return false;

        var xmlRoot = xmlDoc.getRootElement();
        if (StrComp(xmlRoot.getName(), c_FilterData) != 0) return false;

        result = checkElements_Model();
        result = result && checkElements_Obj();
        result = result && checkElements_Sym();
        result = result && checkElements_CxnDef();
        result = result && checkElements_Cxn();
        result = result && checkElements_Ass();
        result = result && checkElements_Attr();
    }
    Context.writeLog((result) ? "successful" : "NOT successful");
    return result;

    function checkElements_Model() {
        return checkItems(oFilter.ModelTypes(Constants.ARISVIEW_ALL), c_Model, c_mtn);
    }

    function checkElements_Obj() {
        return checkItems(oFilter.ObjTypes(), c_Obj, c_otn);
    }

    function checkElements_CxnDef() {
        return checkItems(oFilter.GetTypes(Constants.CID_CXNDEF), c_CxnDef, c_cbtn);
    }

    function checkItems(aTypeNums, elementName, attrName) {
        var result = true;
        aTypeNums = [].concat(aTypeNums);

        var xmlElements = xmlRoot.getChildren(elementName);
        if (xmlElements != null) {
            var it = xmlElements.iterator();
            while (it.hasNext()) {
                var xmlElement = it.next();
                var typeNum = getTypeNum(xmlElement, attrName);

                if (aTypeNums.indexOf(typeNum) < 0) {
                    writeError(xmlElement);
                    result = false;
                    break;
                }
            }
        }
        return result;
    }

    function checkElements_Sym() {
        var result = true;
        var xmlElements = xmlRoot.getChildren(c_Sym);
        if (xmlElements != null) {
            var it = xmlElements.iterator();
            while (it.hasNext()) {
                var xmlElement = it.next();
                var modelTypeNum = getTypeNum(xmlElement, c_mtn);
                var symbolNum = getTypeNum(xmlElement, c_sn);

                if (!isValidSymbol(modelTypeNum, symbolNum)) {
                    writeError(xmlElement);
                    result = false;
                    break;
                }
            }
        }
        return result;

        function isValidSymbol(modelTypeNum, symbolNum) {
            if (oFilter.IsValidSymbol(modelTypeNum, symbolNum)) return true;
            var userdefinedSymbolNums = [].concat(oFilter.getUserDefinedSymbols(symbolNum));
            for (var i = 0; i < userdefinedSymbolNums.length; i++) {
                if (oFilter.IsValidSymbol(modelTypeNum, userdefinedSymbolNums[i])) return true;
            }
            return false;
        }
    }

    function checkElements_Cxn() {
        var result = true;
        var xmlElements = xmlRoot.getChildren(c_Cxn);
        if (xmlElements != null) {
            var it = xmlElements.iterator();
            while (it.hasNext()) {
                var xmlElement = it.next();
                var modelTypeNum = getTypeNum(xmlElement, c_mtn);
                var srcSymbolNum = getTypeNum(xmlElement, c_ssn);
                var trgSymbolNum = getTypeNum(xmlElement, c_dsn);
                var cxnTypeNum = getTypeNum(xmlElement, c_cbtn);

                if (!isValidCxn(modelTypeNum, srcSymbolNum, trgSymbolNum, cxnTypeNum)) {
                    writeError(xmlElement);
                    result = false;
                    break;
                }
            }
        }
        return result;

        function isValidCxn(modelTypeNum, srcSymbolNum, trgSymbolNum, cxnTypeNum) {
            var aCxnTypeNums = [].concat(oFilter.CxnTypes(modelTypeNum, srcSymbolNum, trgSymbolNum));
            if (aCxnTypeNums.indexOf(cxnTypeNum) >= 0) return true;
            var userdefinedSrcSymbolNums = [].concat(oFilter.getUserDefinedSymbols(srcSymbolNum));
            var userdefinedTrgSymbolNums = [].concat(oFilter.getUserDefinedSymbols(trgSymbolNum));

            if (userdefinedSrcSymbolNums.length > 0 || userdefinedTrgSymbolNums.length > 0) {
                userdefinedSrcSymbolNums.push(srcSymbolNum);
                userdefinedTrgSymbolNums.push(trgSymbolNum);

                for (var i = 0; i < userdefinedSrcSymbolNums.length; i++) {
                    var userdefinedSrcSymbolNum = userdefinedSrcSymbolNums[i];
                    for (var j = 0; j < userdefinedTrgSymbolNums.length; j++) {
                        var userdefinedTrgSymbolNum = userdefinedTrgSymbolNums[j];

                        var aCxnTypeNums = [].concat(oFilter.CxnTypes(modelTypeNum, userdefinedSrcSymbolNum, userdefinedTrgSymbolNum));
                        if (aCxnTypeNums.indexOf(cxnTypeNum) >= 0) return true;
                    }
                }
            }
            return false;
        }
    }


    function checkElements_Ass() {
        var result = true;
        var xmlElements = xmlRoot.getChildren(c_Ass);
        if (xmlElements != null) {
            var it = xmlElements.iterator();
            while (it.hasNext()) {
                var xmlElement = it.next();
                var itemKindNum = getTypeNum(xmlElement, c_ikn);
                var itemTypeNum = getTypeNum(xmlElement, c_itn);
                var modelTypeNum = getTypeNum(xmlElement, c_mtn);
                var aModelTypeNums = oFilter.Assignments(itemKindNum, itemTypeNum);

                if (aModelTypeNums.indexOf(modelTypeNum) < 0) {
                    writeError(xmlElement);
                    result = false;
                    break;
                }
            }
        }
        return result;
    }

    function checkElements_Attr() {
        var result = true;
        var xmlElements = xmlRoot.getChildren(c_Attr);
        if (xmlElements != null) {
            var it = xmlElements.iterator();
            while (it.hasNext()) {
                var xmlElement = it.next();
                var itemKindNum = getTypeNum(xmlElement, c_ikn);
                var itemTypeNum = getTypeNum(xmlElement, c_itn);
                var attrTypeNum = getTypeNum(xmlElement, c_atn);

                if (!oFilter.IsValidAttrType(itemKindNum, itemTypeNum, attrTypeNum)) {
                    writeError(xmlElement);
                    result = false;
                    break;
                }
            }
        }
        return result;
    }

    function writeError(xmlElement) {
        Context.writeLog("MISSING: " + (new org.jdom.output.XMLOutputter).outputString(xmlElement));
    }
}

function getTypeNum(xmlElement, attrName) {
    return parseInt(xmlElement.getAttribute(attrName).getValue());
}

function getAllowedModelListInConfig() {
    return getAllowedItemListInConfig(c_Model, c_mtn);
}

function getAllowedObjListInConfig() {
    return getAllowedItemListInConfig(c_Obj, c_otn);
}

function getAllowedCxnDefListInConfig() {
    return getAllowedItemListInConfig(c_CxnDef, c_cbtn);
}

function getAllowedItemListInConfig(itemName, attrName) {
    var setAllowedItems = new java.util.HashSet();

    var fileData = Context.getFile(c_FileName, Constants.LOCATION_SCRIPT);
    var xmlDoc = Context.getXMLParser(fileData);
    if (xmlDoc == null || !xmlDoc.isValid())  return null;

    var xmlRoot = xmlDoc.getRootElement();
    if (StrComp(xmlRoot.getName(), c_FilterData) != 0) return null;

    var xmlElements = xmlRoot.getChildren(itemName);
    if (xmlElements != null) {
        var it = xmlElements.iterator();
        while (it.hasNext()) {
            var xmlElement = it.next();
            var itemTypeNum = getTypeNum(xmlElement, attrName);

            setAllowedItems = addItemToSet(setAllowedItems, itemTypeNum);
        }
    }
    return setAllowedItems;

    function addItemToSet(setAllowedItems, itemTypeNum) {
        setAllowedItems.add(new java.lang.Integer(itemTypeNum));
        return setAllowedItems;
    }
}

function getAllowedSymbolListInConfig() {
    var mapAllowedSymbols = new java.util.HashMap();

    var fileData = Context.getFile(c_FileName, Constants.LOCATION_SCRIPT);
    var xmlDoc = Context.getXMLParser(fileData);
    if (xmlDoc == null || !xmlDoc.isValid())  return null;

    var xmlRoot = xmlDoc.getRootElement();
    if (StrComp(xmlRoot.getName(), c_FilterData) != 0) return null;

    var xmlElements = xmlRoot.getChildren(c_Sym);
    if (xmlElements != null) {
        var it = xmlElements.iterator();
        while (it.hasNext()) {
            var xmlElement = it.next();
            var modelTypeNum = getTypeNum(xmlElement, c_mtn);
            var symbolNum = getTypeNum(xmlElement, c_sn);

            mapAllowedSymbols = addSymbolToMap(mapAllowedSymbols, modelTypeNum, symbolNum);
        }
    }
    return mapAllowedSymbols;

    function addSymbolToMap(mapAllowedSymbols, modelTypeNum, symbolNum) {
        var key = new java.lang.Integer(modelTypeNum);
        var value = [symbolNum];
        if (mapAllowedSymbols.containsKey(key)) {
            value = value.concat(mapAllowedSymbols.get(key));
        }
        mapAllowedSymbols.put(key, value);
        return mapAllowedSymbols;
    }
}

function getAllowedCxnListInConfig() {
    var mapAllowedCxns = new java.util.HashMap();

    var fileData = Context.getFile(c_FileName, Constants.LOCATION_SCRIPT);
    var xmlDoc = Context.getXMLParser(fileData);
    if (xmlDoc == null || !xmlDoc.isValid())  return null;

    var xmlRoot = xmlDoc.getRootElement();
    if (StrComp(xmlRoot.getName(), c_FilterData) != 0) return null;

    var xmlElements = xmlRoot.getChildren(c_Cxn);
    if (xmlElements != null) {
        var it = xmlElements.iterator();
        while (it.hasNext()) {
            var xmlElement = it.next();
            var modelTypeNum = getTypeNum(xmlElement, c_mtn);
            var srcSymbolNum = getTypeNum(xmlElement, c_ssn);
            var trgSymbolNum = getTypeNum(xmlElement, c_dsn);
            var cxnTypeNum = getTypeNum(xmlElement, c_cbtn);

            mapAllowedCxns = addCxnToMap(mapAllowedCxns, modelTypeNum, cxnTypeNum, srcSymbolNum, trgSymbolNum);
        }
    }
    return mapAllowedCxns;

    function addCxnToMap(mapAllowedCxns, modelTypeNum, cxnTypeNum, srcSymbolNum, trgSymbolNum) {
        var key = new java.lang.Integer(modelTypeNum);
        var oCxn = new CXN_TYPE(cxnTypeNum, srcSymbolNum, trgSymbolNum);
        var value = [oCxn];
        if (mapAllowedCxns.containsKey(key)) {
            value = value.concat(mapAllowedCxns.get(key));
        }
        mapAllowedCxns.put(key, value);
        return mapAllowedCxns;
    }
}

function getAllowedObjAssListInConfig() {
    var mapAllowedObjAss = new java.util.HashMap();

    var fileData = Context.getFile(c_FileName, Constants.LOCATION_SCRIPT);
    var xmlDoc = Context.getXMLParser(fileData);
    if (xmlDoc == null || !xmlDoc.isValid())  return null;

    var xmlRoot = xmlDoc.getRootElement();
    if (StrComp(xmlRoot.getName(), c_FilterData) != 0) return null;

    var xmlElements = xmlRoot.getChildren(c_Ass);
    if (xmlElements != null) {
        var it = xmlElements.iterator();
        while (it.hasNext()) {
            var xmlElement = it.next();
            var itemKindNum = getTypeNum(xmlElement, c_ikn);
            var itemTypeNum = getTypeNum(xmlElement, c_itn);
            var modelTypeNum = getTypeNum(xmlElement, c_mtn);

            if (itemKindNum != Constants.CID_OBJDEF) continue;

            mapAllowedObjAss = addObjAssToMap(mapAllowedObjAss, itemTypeNum, modelTypeNum);
        }
    }
    return mapAllowedObjAss;

    function addObjAssToMap(mapAllowedObjAss, objTypeNum, modelTypeNum) {
        var key = new java.lang.Integer(objTypeNum);
        var value = [modelTypeNum];
        if (mapAllowedObjAss.containsKey(key)) {
            value = value.concat(mapAllowedObjAss.get(key));
        }
        mapAllowedObjAss.put(key, value);
        return mapAllowedObjAss;
    }
}

function isAllowedItemInConfig(setAllowedItems, itemTypeNum) {
    if (setAllowedItems.contains(new java.lang.Integer(itemTypeNum))) {
        return true;
    }
    return false;
}

function isAllowedSymbolInConfig(mapAllowedSymbols, modelTypeNum, symbolNum) {
    var key = new java.lang.Integer(modelTypeNum);
    if (mapAllowedSymbols.containsKey(key)) {
        aSymbolNums = mapAllowedSymbols.get(key);
        for (var i = 0; i < aSymbolNums.length; i++) {
            if (aSymbolNums[i] == symbolNum) return true;
        }
    }
    return false;
}

function isAllowedCxnInConfig(mapAllowedCxns, modelTypeNum, cxnTypeNum, srcSymbolNum, trgSymbolNum) {
    var key = new java.lang.Integer(modelTypeNum);
    if (mapAllowedCxns.containsKey(key)) {
        aCxns = mapAllowedCxns.get(key);
        for (var i = 0; i < aCxns.length; i++) {
            oCxn = aCxns[i];
            if (oCxn.cxnTypeNum == cxnTypeNum &&
                oCxn.srcSymbolNum == srcSymbolNum &&
                oCxn.trgSymbolNum == trgSymbolNum) return true;
        }
    }
    return false;
}

function isAllowedObjAssInConfig(mapAllowedObjAss, objTypeNum, modelTypeNum) {
    var key = new java.lang.Integer(objTypeNum);
    if (mapAllowedObjAss.containsKey(key)) {
        aModelTypeNums = mapAllowedObjAss.get(key);
        for (var i = 0; i < aModelTypeNums.length; i++) {
            if (aModelTypeNums[i] == modelTypeNum) return true;
        }
    }
    return false;
}

if (debugMode) {
    try {
        if (checkFilter(ArisData.ActiveFilter())) {
            Context.setProperty("SUCCESS", true);
        } else {
            Context.setProperty("SUCCESS", false);
        }
    } catch (e) {
        var message = e.message;

        if (message == null) {
            message = "Unexpected error";
        }

        Context.setProperty("SUCCESS", false);
        Context.setProperty("ERROR_MESSAGE", message);
    }
}
