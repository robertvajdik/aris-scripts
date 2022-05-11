var IDSA = {
 
    hasConfiguration: function() {
        if (Context.getEnvironment() == Constants.ENVIRONMENT_BP) {
            return false;
        }
        return ArisData.hasPropertyConfigSupport();
    },

    isOcc: function(object) {
        return internal_isOcc(object);
    },

    getDef: function(object) {
        if (object.KindNum() == Constants.CID_OBJOCC) return object.ObjDef();
        if (object.KindNum() == Constants.CID_CXNOCC) return object.CxnDef();
        return object;
    },

    getSource: function(oCxn) {
        if (internal_isOcc(oCxn)) {
            return oCxn.SourceObjOcc();
        }
        return oCxn.SourceObjDef();
    },

    getTarget: function(oCxn) {
        if (internal_isOcc(oCxn)) {
            return oCxn.TargetObjOcc();
        }
        return oCxn.TargetObjDef();
    },

    getOrgSymbol: function(object) {
        if (internal_isOcc(object)) {
            return object.OrgSymbolNum();
        }
        return object.getDefaultSymbolNum();
    },

    contains: function(a, obj) {
        var i = a.length;
        while (i--) {
            if (a[i] === obj) {
                return true;
            }
        }
        return false;
    },

    outputNamesWithNewLine: function(pos, objDef, array, typeNum) {
        var str = new String("");
        return str += objDef.Name(g_nLoc) + "|"; /*+ " [" + typeNum + "]*/
    },

    removeLastSemicolon: function(str) {
        if (str.length > 0) {
            var semicolon = str.lastIndexOf("|");
            return str.substring(0, semicolon);
        } else return str;
    },

    isAudiFolder: function(oModel) {
       // for each(var oModel in oModels) {
            var path = oModel.Group().Path(-1, false, true);
            if (path.indexOf("0200") > 0 || path.indexOf("0270") > 0 || path.indexOf("0280") > 0 || path.indexOf("0300") > 0)
                return true;
            else
                return false;
        return false;
    },
    
    /** Checks, if the current attribute is maintained
     * @param {Item} item The item
     * @param {Number} attrNum The Attribute Number
     * @param {Number} nLocale The Language code
    */
     isAttrMaintained: function(item, attrNum, nLocale) {
        if (item === undefined || item === null) return false;
        var attr = item.Attribute(attrNum, nLocale);
        return ((attr.getValue() != null) && (attr.getValue().trim().length() > 0));
    }
    
}

function RGB(r, g, b) {
    return (new java.awt.Color(r / 255.0, g / 255.0, b / 255.0, 1)).getRGB();
}

