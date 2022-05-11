function BaseDialog() {

}

BaseDialog.EMPTY_STRING = "";

BaseDialog.templateWidth = 720;
BaseDialog.templateHeight = 480;
BaseDialog.tableColumnWidth = 25;
BaseDialog.tableOneThirdColumnWidth = 33;
BaseDialog.oneQuaterWidth = Math.floor(BaseDialog.templateWidth / 4);
BaseDialog.threeQuaterWidth = BaseDialog.templateWidth - BaseDialog.oneQuaterWidth;
BaseDialog.oneThirdHeight = Math.floor(BaseDialog.templateHeight / 3);
BaseDialog.twoThirdHeight = BaseDialog.templateHeight - BaseDialog.oneThirdHeight;
BaseDialog.halfHeight = Math.floor(BaseDialog.templateHeight / 2);
BaseDialog.halfWidth = Math.floor(BaseDialog.templateWidth / 2);
BaseDialog.pushButtonWidth = 130;
BaseDialog.pushButtoHeight = 20;
BaseDialog.TOPIC_COMMENTARY_INDEX = 3;
BaseDialog.TOPIC_GUID_INDEX = 4;

BaseDialog.isNullOrEmpty = function (array) {
    return array === undefined || array === null || array.length === 0;
}

BaseDialog.isArisObjectNullOrInvalid = function (object) {
    return object === null || object === undefined || object.IsValid() === false;
}

BaseDialog.isChecked = function (row) {
    var checked = row[0].toLowerCase();
    return checked.localeCompare("true") === 0 ||
        checked.localeCompare("1") === 0;
}

BaseDialog.isNotChecked = function (row) {

    var checked = row[0].toLowerCase();
    return checked.localeCompare("false") === 0 ||
        checked.localeCompare("0") === 0;

}

BaseDialog.accountNameSort = function (itemA, itemB) {
    return itemA[1] > itemB[1] ? 1 : -1;
}

BaseDialog.systemNameSort = function (itemA, itemB) {
    return itemA[0] > itemB[0] ? 1 : -1;
}

BaseDialog.stringSort = function (itemA, itemB) {
    if (itemA < itemB) return -1;
    if (itemA > itemB) return 1;
    return 0;
}

BaseDialog.getDescription = function (guid, locale) {

    var object = ArisData.getActiveDatabase().FindGUID(guid, Constants.CID_OBJDEF);
    if (BaseDialog.isArisObjectNullOrInvalid(object)) return "";

    return object.Attribute(Constants.AT_DESC, locale).getValue();

}

BaseDialog.isArrayEqual = function (arrayA, arrayB) {
    var trash = [];
    arrayA = arrayA.toString().split(',').map(String);
    arrayB = arrayB.toString().split(',').map(String);

    for (var i in arrayA) {
        if (arrayB.indexOf(arrayA[i]) === -1) trash.push(arrayA[i]);
    }
    for (i in arrayB) {
        if (arrayA.indexOf(arrayB[i]) === -1) trash.push(arrayB[i]);
    }
    return trash.length === 0;
}

BaseDialog.accountNameSort = function (itemA, itemB) {
    return itemA[1] > itemB[1] ? 1 : -1;
}

BaseDialog.insertIntoListAttributes = function (table, attributes, attribute) {

    var currentAttribute = attributes.get(attribute);
    if (currentAttribute != null) table.put(attribute, currentAttribute.get());

}

BaseDialog.buildSearchQuery = function (type, content) {

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

BaseDialog.buildAllDomainsList = function (domains, exclude) {

    return domains.filter(
        function (domain) {
            return domain.dc.localeCompare(exclude) !== 0;
        })
        .reduce(function (allDomains, domain) {
            return allDomains.concat([domain.dc, domain.url]);
        }, []);

}

BaseDialog.getMaintainedObjectName = function (object, locale) {
    return BaseDialog.getMaintainedObjectAttribute(object,Constants.AT_NAME,locale);
}

BaseDialog.getMaintainedObjectAttribute = function (object,attribute, locale) {

    if(BaseDialog.isArisObjectNullOrInvalid(object)) return "";
    var nameAttribute = object.Attribute(attribute, locale);
    if (nameAttribute.IsMaintained()) return nameAttribute.getValue();

    var localeToBrowse = SUPPORTED_LANGUAGES.filter(function (language) {
        return language !== locale;
    });
    var objectNames = localeToBrowse.filter(function (language) {
        return object.Attribute(attribute, language).IsMaintained();
    }).map(function (language) {
        var name = object.Attribute(attribute, language).getValue();
        var localeInfo = ArisData.getActiveDatabase().getDbLanguage().convertLocale(language);

        return name + " (" + localeInfo.getLocale().getLanguage().toUpperCase() + ")";
    });

    if (objectNames.length > 0) return objectNames[0];
    return nameAttribute.getValue();
}

BaseDialog.getStringFromStringTable = function (title, localeId) {


    var locales = ArisData.getActiveDatabase().LanguageList().filter(function (language) {
        return localeId === language.LocaleId();
    });

    var content = locales.map(function (locale) {
        var currentLocale = locale.LocaleInfo().getLocale();
        return getString(String(title), currentLocale);
    }).filter(function(content) {
        return content.length > 0 && content.indexOf("String not found") === -1;
    });

    if (content.length > 0) return content[0];
    return title;
}

BaseDialog.getAllStringFromStringTable = function (title) {

    var locales = ArisData.getActiveDatabase().LanguageList().filter(function (language) {
        return SUPPORTED_LANGUAGES.some(function(localeId)
        {
            return localeId === language.LocaleId();
        });
    });

    return locales.map(function (locale) {
        var currentLocale = locale.LocaleInfo().getLocale();
        var content = getString(String(title), currentLocale);

        if (content.length > 0 && content.indexOf("String not found") === -1) return [locale.LocaleInfo().getLocaleID(),content];
        return [locale.LocaleInfo().getLocaleID(),title];
    });

}

BaseDialog.getMaxItemCount = function (arrayOfArray) {

    return arrayOfArray.map(function (array) {
        return array.length;
    }).reduce(function (array, item) {
        return array.concat(item);
    }, []).reduce(function (max, item) {
        return Math.max(max, item);
    }, 0);
}

BaseDialog.prototype.markAllItemsSelected = function (pageNumber, elementIdentifier, checkBoxPosition, state) {

    var table = this.getPageElement(pageNumber, elementIdentifier);
    if (table === null) return false;

    var rows = table.getItems();
    rows.forEach(function (row) {
        row[checkBoxPosition] = state
    });
    table.setItems(rows);
}

BaseDialog.prototype.getPageElement = function (pageNumber, elementIdentifier) {

    var page = this.dialog.getPage(pageNumber);
    if (page === null) return null;
    return page.getDialogElement(elementIdentifier);
}

BaseDialog.prototype.searchText = function (searchingText, cache) {

    var result = [];
    var iterator = cache.keySet().iterator();
    while (iterator.hasNext()) {
        var key = iterator.next();

        if (key.toLowerCase().indexOf(searchingText.toLowerCase()) === -1) continue;
        result.push(cache.get(key));
    }
    return result;
}

BaseDialog.prototype.loadTypedObjOccFromModel = function (model, type) {

    if (model === null) return [];
    if (type === null) return [];

    return model.ObjOccListFilter(type);

}

BaseDialog.prototype.getSpecificConnectionType = function (connectionOccurrences, connectionType) {
    return connectionOccurrences.filter(function (connectionOccurrence) {
        return connectionOccurrence.getDefinition().TypeNum() === connectionType;
    })
}

BaseDialog.prototype.getConnectionReason = function (connectionOccurrences, connectionType, connectionAttribute, locale) {


    var connections = this.getSpecificConnectionType(connectionOccurrences, connectionType);
    if (BaseDialog.isNullOrEmpty(connections)) return BaseDialog.EMPTY_STRING;
    var connectionDefinition = connections[0].getDefinition();
    return connectionDefinition.Attribute(connectionAttribute, locale).IsMaintained() ?
        connectionDefinition.Attribute(connectionAttribute, locale).getValue() :
        BaseDialog.EMPTY_STRING;

}

