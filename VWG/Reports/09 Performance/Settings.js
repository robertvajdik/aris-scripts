function Settings() {
    this.ExportParameters = null;

    this.init = function() {
        var oBPExportUpdateParameter = new PerformaceParameters();
        this.ExportParameters = oBPExportUpdateParameter.getPerformaceParameters();
    }

    this.getStringParam = function(sParamKey) {
        // Key found in property?
        var sValue = Context.getProperty(sParamKey);
        if (sValue == null) {
            // key found in Parameters?
            sValue = this.ExportParameters[sParamKey];
            if (sValue == null) {
                sValue = "";
                g_oLogfile.writeLogEntry("Warning", "Missing parameter '" + sParamKey + "'!");
            }
        }
        return sValue;
    }

    this.getIntParam = function(sParamKey) {
        var nValue = -1;

        var sValue = this.getStringParam(sParamKey);
        try {
            nValue = parseInt(sValue);
        } catch (ex) {
            g_oLogfile.writeLogEntry("Warning", "Unexpected value for Parameter '" + sParamKey + "'! Value is not numeric!");
        }
        return nValue;
    }

    this.getBoolParam = function(sParamKey) {
        var bValue = false;

        var sValue = this.getStringParam(sParamKey);
        if (sValue.equals("true")) {
            bValue = true;
        } else if (sValue.equals("false")) {
            bValue = false;
        } else {
            g_oLogfile.writeLogEntry("Warning", "Unexpected value for Parameter '" + sParamKey + "'! Value is not boolean!");
        }
        return bValue;
    }

    this.getIntArrayParam = function(sParamKey) {
        var anValue = new Array();

        var sValue = this.getStringParam(sParamKey);
        var asArray = HLP_getArrayFromString(sValue, ",");
        for each(var sString in asArray) {
            var nTmp = Number(sString);
            if (!isNaN(nTmp)) {
                anValue.push(nTmp);
            }
        }
        return anValue;
    }

    this.getAttrTypeNumArrayParam = function(sParamKey) {
        var anValue = new Array();

        var sValue = this.getStringParam(sParamKey);
        var asArray = HLP_getArrayFromString(sValue, ",");
        for each(var sString in asArray) {
            var oAttrTypeWrapper = new AttrTypeWrapper();
            var nTmp = oAttrTypeWrapper.initByText(sString);
            if (nTmp > 0) {
                anValue.push(nTmp);
            } else {
                g_oLogfile.writeLogEntry("Warning", "Unexpected value for type num in Parameter '" + sParamKey + "'! " + oAttrTypeWrapper.sMessage);
            }
        }

        return anValue;
    }

    this.getLanguageCombinations = function() {
        var atLanguageCombination = new Array();

        var sValue = this.getStringParam("LanguagePackages");
        if (sValue != null && !sValue.equals("")) {
            var combinations = sValue.split(";");
            for each(var combi in combinations) {
                var tmplang = combi.split(",");
                if (tmplang.length == 3) {
                    var nDBLang = parseInt(tmplang[0]);
                    var nUILang = parseInt(tmplang[1]);
                    var nMethodLang = parseInt(tmplang[2]);

                    if (!isNaN(nDBLang) && !isNaN(nUILang) && !isNaN(nMethodLang)) {
                        atLanguageCombination.push(new LanguageCombination(nDBLang, nUILang, nMethodLang));
                    } else {
                        g_oLogfile.writeLogEntry("Warning", "Unexpected value for language in Parameter 'LanguagePackages'! Combi: '" + combi + "'");
                    }
                } else {
                    g_oLogfile.writeLogEntry("Warning", "Unexpected count of languages in Parameter 'LanguagePackages'! Combi: '" + combi + "'");
                }
            }
        }

        return atLanguageCombination;
    }

    this.ensurePropertyAsString = function(sPropertyName) {
        var sValue = Context.getProperty(sPropertyName);
        if (sValue == null) {
            sValue = "";
        }
        return sValue;
    }
}


