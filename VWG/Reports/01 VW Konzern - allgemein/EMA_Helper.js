function EMA_Helper() {

}


EMA_Helper.isChecked = function (row) {
    var checked = row[0].toLowerCase();
    return checked.localeCompare("true") === 0 ||
        checked.localeCompare("1") === 0;
}

EMA_Helper.isNotChecked = function(row) {

    var checked = row[0].toLowerCase();
    return checked.localeCompare("false") === 0 ||
        checked.localeCompare("0") === 0;

}

EMA_Helper.accountNameSort = function (itemA, itemB) {
    return itemA[1] > itemB[1] ? 1 : -1;
}

EMA_Helper.systemNameSort = function (itemA, itemB) {
    return itemA[0] > itemB[0] ? 1 : -1;
}

EMA_Helper.buildSearchQuery = function (type, content) {

    var ldapQuery = "(&(objectCategory=person)(objectClass=user))";
    if (content instanceof Array) {
        return "";
    }

    return [ldapQuery.slice(0, ldapQuery.length() - 1),
        "(",
        type,
        "=",
        content,
        ")",
        ldapQuery.slice(ldapQuery.length() - 1)].join("");
}
EMA_Helper.buildAllDomainsList = function (domains, exclude) {

    return domains.filter(
        function (domain) {
            return domain.dc.localeCompare(exclude) !== 0;
        })
        .reduce(function (allDomains, domain) {
            writeLog(sm72tc,"Domain object " + domain.toString(),"info");
            allDomains.push([domain.dc,domain.url,domain.referral]);
            return allDomains;
        }, []);

}

EMA_Helper.insertIntoListAttributes = function(table,attributes,attribute) {

    var currentAttribute = attributes.get(attribute);
    if (currentAttribute != null) table.put(attribute, currentAttribute.get());

}

EMA_Helper.findItemByText = function(text,searchingContext) {

    var result = [];
    var pattern = new RegExp("^(" + text + ".*?)","i");
    var iterator = searchingContext.keySet().iterator();
    while (iterator.hasNext()) {
        var key = iterator.next();

        if (key.match(pattern) === null) continue;
        result.push(searchingContext.get(key));
    }
    return result;
}

EMA_Helper.fillManagementTable  = function (guids,commentaries,dialog,tableName) {

    if ( String(guids).length > 0) {
        var partsCommentary = String(commentaries).split(";");
        var partsGUID = String(guids).split(";");
        var content=[];
        partsGUID.forEach(function(part,index){

            var object = ArisData.getActiveDatabase().FindGUID(part,Constants.CID_OBJDEF);
            if (object.IsValid()) {
                var name = object.Attribute(Constants.AT_NAME,g_nLoc).getValue();
                var fullName = object.Attribute(Constants.AT_NAME_FULL,g_nLoc).getValue();
                var description = object.Attribute(Constants.AT_DESC,g_nLoc).getValue();
                var commentary = "";
                if (partsCommentary.length > 0) {
                    commentary = String(partsCommentary[index]).split("|")[1];
                }
                content.push(name);
                content.push(fullName);
                content.push(description);
                content.push(commentary);



            }
        });
        dialog.setDlgListBoxArray(tableName,content);
    }
}

EMA_Helper.createManagementGuidString = function(items) {
    var result = "";

    items.forEach(function(item) {
        result += item[4] + ";";
    })

    if (result.length > 0) result = result.substring(0,result.length-1);
    return result;
}

EMA_Helper.createManagementCommentaryString = function(items) {
    var result = "";

    items.forEach(function(item) {
        result += item[1] + "|" + item[3] + ";";
    })

    if (result.length > 0) result = result.substring(0,result.length-1);
    return result;
}

EMA_Helper.isFirstRowFilled = function(model,statusSymbol,locale) {

    var oLaneList = model.GetLanes(Constants.LANE_HORIZONTAL);
    oLaneList = ArisData.sort(oLaneList, Constants.SORT_GEOMETRIC, Constants.SORT_NONE, Constants.SORT_NONE, locale);
    var firstLane = oLaneList[0];
    oLaneList = model.GetLanes(Constants.LANE_VERTICAL);
    oLaneList = ArisData.sort(oLaneList, Constants.SORT_X, Constants.SORT_NONE, Constants.SORT_NONE, locale);
    var firstLaneVertical = oLaneList[0];
    var isStatusObjectInLane = firstLane.ObjOccs().some(function(objOcc) {
        return objOcc.SymbolNum() === statusSymbol;
    });
    if (isStatusObjectInLane) return firstLane.ObjOccs(firstLaneVertical).length > 0 ;
    return firstLane.ObjOccs(firstLaneVertical).length > 0 || firstLane.ObjOccs().length > 0;
}
