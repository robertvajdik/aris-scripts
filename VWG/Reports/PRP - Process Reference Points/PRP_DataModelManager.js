function DataModelManager(model, sourceObject, locale) {

    this.model = model;
    this.locale = locale;
    this.sourceObject = sourceObject;
    this.sourceObjectOccurrence = null;
}


DataModelManager.prototype = Object.create(BaseDialog.prototype);
DataModelManager.prototype.constructor = DataModelManager;


DataModelManager.prototype.addOrUpdateObjects = function (input, objectType, connectionType, symbol, isSingle,
    isSwitched) {

    if (BaseDialog.isArisObjectNullOrInvalid(this.model)) return false;
    if (BaseDialog.isNullOrEmpty(input)) return false;

    var objectOccurrences = this.getOccurrence(objectType);
    var currentOccurrences = objectOccurrences.filter(function (occurrence) {
        return occurrence.ObjDef().GUID().indexOf(input.GUID()) === 0;
    })

    if (BaseDialog.isNullOrEmpty(currentOccurrences)) {

        var occurrence = this.createOccurrence(input.GUID(), symbol);
        if (BaseDialog.isArisObjectNullOrInvalid(occurrence)) return false;
        this.processObject(occurrence, connectionType, null, null, isSwitched);

    } else {
        this.processObject(currentOccurrences[0], connectionType, null, null, isSwitched);
    }

    if (isSingle) {
        if (!BaseDialog.isNullOrEmpty(objectOccurrences) && BaseDialog.isNullOrEmpty(currentOccurrences)) {
            var those = this;
            objectOccurrences.filter(function (occurrence) {
                those.model.deleteOcc(occurrence, false);
            })
        }
    }
}

DataModelManager.prototype.delete = function (objectType, objectSymbol) {

    if (BaseDialog.isArisObjectNullOrInvalid(this.model)) return false;
    if (BaseDialog.isNullOrEmpty(objectType)) return false;
    if (BaseDialog.isNullOrEmpty(objectSymbol)) return false;


    var occurrences = this.model.ObjOccListFilter(objectType, objectSymbol);
if (BaseDialog.isNullOrEmpty(occurrences)) return false;

    var fadModel = this.model;
    occurrences.forEach(function (occurrence) {
        if (!BaseDialog.isArisObjectNullOrInvalid(occurrence)) fadModel.deleteOcc(occurrence, false);

    })
}

DataModelManager.prototype.deleteRemains = function (objects, objectType, objectSymbol, connectionType) {

    if (BaseDialog.isArisObjectNullOrInvalid(this.model)) return false;
    if (BaseDialog.isNullOrEmpty(objects)) return false;
    if (BaseDialog.isNullOrEmpty(objectType)) return false;
    if (BaseDialog.isNullOrEmpty(objectSymbol)) return false;

    var occurrences = this.model.ObjOccListFilter(objectType, objectSymbol);

    if (BaseDialog.isNullOrEmpty(occurrences)) return false;

    if (connectionType !== null) {
        occurrences = occurrences.filter(function (occurrence) {
            return occurrence.CxnOccList().some(function (connectionOccurrence) {
                return connectionOccurrence.getDefinition().TypeNum() === connectionType;
            });
        });
    }

    var fadModel = this.model;

    var toDelete = occurrences.filter(function (occurrence) {
        return !objects.some(function (object) {
            return String(object.GUID()).equals(String(occurrence.ObjDef().GUID()));
        })
    });

    toDelete.forEach(function (occurrence) {
        if (!BaseDialog.isArisObjectNullOrInvalid(occurrence)) fadModel.deleteOcc(occurrence, false);
    })
}

DataModelManager.prototype.getOccurrence = function (type) {
    if (BaseDialog.isArisObjectNullOrInvalid(this.model)) return [];
    return this.model.ObjOccListFilter(type);

}

DataModelManager.prototype.processObject = function (occurrence, connectionType, attribute, commentary, isSwitched) {

    if (connectionType === null) return false;
    var connections = occurrence.Cxns();
    var foundConnections = this.getSpecificConnectionType(connections, connectionType);
    if (BaseDialog.isNullOrEmpty(foundConnections)) {
        this.createConnectionOccurrence(occurrence, connectionType, attribute, commentary, isSwitched);
    } else {
        this.updateConnectionOccurrence(foundConnections[0], attribute, commentary);
    }
}

DataModelManager.prototype.createConnectionOccurrence = function (occurrence, connectionType, attribute, commentary,
    isSwitched) {


    var connectionOccurrence = isSwitched ?
        this.model.CreateCxnOcc(this.sourceObjectOccurrence, occurrence, connectionType, [], false, true)
        : this.model.CreateCxnOcc(occurrence, this.sourceObjectOccurrence, connectionType, [], false, true);
    // TODO throw exception and log it;
    if (BaseDialog.isArisObjectNullOrInvalid(connectionOccurrence)) return;
    return this.updateConnectionAttribute(connectionOccurrence, attribute, commentary);
}

DataModelManager.prototype.updateConnectionOccurrence = function (occurrence, attribute, commentary) {

    if (attribute === null) return false;
    var connectionDefinition = occurrence.getDefinition();
    var descriptionAttribute = connectionDefinition.Attribute(attribute, this.locale);
    // TODO thow exception and log it;
    if (BaseDialog.isArisObjectNullOrInvalid(descriptionAttribute)) return;
    descriptionAttribute.setValue(commentary);
}

DataModelManager.prototype.createOccurrence = function (guid, symbol) {
    var definition = ArisData.getActiveDatabase().FindGUID(guid, Constants.CID_OBJDEF);
    if (BaseDialog.isArisObjectNullOrInvalid(definition)) return null;
    return this.model.createObjOcc(symbol, definition, 0, 0);


}

DataModelManager.prototype.updateConnectionAttribute = function (occurrence, attribute, commentary) {

    if (BaseDialog.isNullOrEmpty(attribute)) return;
    var connectionDefinition = occurrence.getDefinition();
    var descriptionAttribute = connectionDefinition.Attribute(attribute, this.locale);
    // TODO thow exception and log it;
    if (BaseDialog.isArisObjectNullOrInvalid(descriptionAttribute)) return;
    descriptionAttribute.setValue(commentary);

}

DataModelManager.prototype.update = function (inputs) {

    var those = this;
    this.sourceObjectOccurrence = this.model.ObjOccListFilter(this.sourceObject.TypeNum())[0];
    if (this.sourceObjectOccurrence === null || typeof this.sourceObjectOccurrence === 'undefined') {
        this.sourceObjectOccurrence = this.createOccurrence(this.sourceObject.GUID(),
            PRP_Constants.TOGAF_DATA_OBJECT_SYMBOL);
    }

    if (!BaseDialog.isNullOrEmpty(inputs)) {
        inputs.forEach(function (input) {
            those.addOrUpdateObjects(input, PRP_Constants.RELEVANT_OBJECT_TYPE,
                PRP_Constants.RELEVANT_OBJECT_CONNECTION_TYPE, PRP_Constants.RELEVANT_OBJECT_SYMBOL, false, true);
        });
        this.deleteRemains(inputs, PRP_Constants.RELEVANT_OBJECT_TYPE, PRP_Constants.RELEVANT_OBJECT_SYMBOL,
            PRP_Constants.RELEVANT_OBJECT_CONNECTION_TYPE);
    } else this.delete(PRP_Constants.RELEVANT_OBJECT_TYPE, PRP_Constants.RELEVANT_OBJECT_SYMBOL);

    this.layout();

    var isEmpty = this.model.ObjOccList().filter(function (occurrence) {
        return !occurrence.IsEqual(those.sourceObjectOccurrence);
    }).length === 0;

    if (!isEmpty) return true;

    var group = this.model.Group();
    if (BaseDialog.isArisObjectNullOrInvalid(group)) return true;
    group.Delete(this.model);

    if (BaseDialog.isNullOrEmpty(group.Childs()) && BaseDialog.isNullOrEmpty(
        group.ModelList()) && BaseDialog.isNullOrEmpty(group.ObjDefList())) {

        var parentGroup = group.Group();
        if (BaseDialog.isArisObjectNullOrInvalid(parentGroup)) return true;
        parentGroup.Delete(group);
    }


}

DataModelManager.prototype.layout = function () {

    if (BaseDialog.isNullOrEmpty(this.model)) return false;
    if (BaseDialog.isNullOrEmpty(this.sourceObjectOccurrence)) return false;


    this.model.setTemplate(TEMPLATE_GUID);
    this.model.ApplyTemplate();

    this.sourceObjectOccurrence.SetPosition(750, 750);


    var those = this;

    this.model.getGfxObjects().forEach(function (object) {
        those.model.deleteGfxObj(object);
    });
    this.model.TextOccList().forEach(function (object) {
        those.model.deleteOcc(object, true);
    })


    var fontStyle = this.findFontStyle("Header Gray", this.locale);
    if (fontStyle !== null) {
        var freeText = this.model.CreateTextOcc(50, 100, Constants.AT_NAME);
        freeText.AttrOccList().forEach(function (attr) {
            attr.setFontStyleSheet(fontStyle);
        });
        var rectangleY = 100 + freeText.Y();
        var line = this.model.createRoundedRectangle(50, rectangleY,
            this.sourceObjectOccurrence.X() + this.sourceObjectOccurrence.Width() + 600, 5);
        line.setRoundness(0, 0);
        line.setFillColor(Constants.C_GRAY);


    }

    var occurrences = this.model.ObjOccListFilter(PRP_Constants.RELEVANT_OBJECT_TYPE, PRP_Constants.RELEVANT_OBJECT_SYMBOL);
    if (BaseDialog.isNullOrEmpty(occurrences)) return false;

    var maxWidth = Math.max.apply(Math, occurrences.map(function (occurrence) {
        return occurrence.Width();
    }));


    var sourceX = this.sourceObjectOccurrence.X() + this.sourceObjectOccurrence.Width();
    var sourceYMiddle = this.sourceObjectOccurrence.Y() + Math.floor(this.sourceObjectOccurrence.Height() / 2);
    var startX = this.sourceObjectOccurrence.X() + this.sourceObjectOccurrence.Width() + 400;
    var startY = this.sourceObjectOccurrence.Y();

    occurrences.forEach(function (occurrence) {

        occurrence.SetPosition(startX, startY);
        those.setRightPoints(occurrence, startX, sourceX, sourceYMiddle);
        startY += occurrence.Height();


    });

    if (occurrences.length > 0) {
        this.createDescriptionRectangle(startX,
            sourceYMiddle - 3 * Math.floor(this.sourceObjectOccurrence.Height() / 2),
            maxWidth,
            startY - (sourceYMiddle - 3 * Math.floor(this.sourceObjectOccurrence.Height() / 2)),
            "Attributes");
    }


    this.model.ObjOccList().forEach(this.setZOrder(1000));
    this.model.TextOccList().forEach(this.setZOrder(980));
    this.model.getGfxObjects().forEach(function (occurrence) {
        if (!BaseDialog.isArisObjectNullOrInvalid(occurrence)) {
            if (occurrence.getZOrder() !== 980) occurrence.setZOrder(960);
        }
    });
    this.model.CxnOccList().forEach(this.setZOrder(940));

    ArisData.Save(Constants.SAVE_NOW);
}

DataModelManager.prototype.findFontStyle = function (fontName, locale) {

    var fonts = ArisData.getActiveDatabase().FontStyleList().filter(function (fontStyle) {
        return fontStyle.Name(locale).localeCompare(fontName) === 0;
    });

    if (!BaseDialog.isNullOrEmpty(fonts)) return fonts[0];
    return null;
}

DataModelManager.prototype.setRightPoints = function (occurrence, outputX, sourceX, sourceYMiddle) {

    var middleX = Math.floor((outputX - sourceX) / 2);
    var points = [

        new Packages.java.awt.Point(sourceX, sourceYMiddle),
        new Packages.java.awt.Point(sourceX + middleX, sourceYMiddle),
        new Packages.java.awt.Point(outputX + middleX, occurrence.Y() + Math.floor(occurrence.Height() / 2)),
        new Packages.java.awt.Point(outputX, occurrence.Y() + Math.floor(occurrence.Height() / 2))

    ];

    occurrence.CxnOccList().forEach(function (connection) {
        connection.setPoints(points);
    });
}

DataModelManager.prototype.createDescriptionRectangle = function (x, y, width, height, description) {

    var database = ArisData.getActiveDatabase();
    var strings = BaseDialog.getAllStringFromStringTable(description);
    var fontStyle = this.findFontStyle("CockpitTitleText", this.locale);

    if (BaseDialog.isArisObjectNullOrInvalid(database)) return null;

    var textDefName = this.model.Name(this.locale) + description;
    var textDefinition = database.CreateTextDef(textDefName, this.locale);


    strings.forEach(function (pair) {
        textDefinition.Attribute(Constants.AT_NAME, pair[0]).setValue(pair[1]);

    });

    var rectangle = this.model.createRoundedRectangle(x - 100, y - 50, 200 + width, 150 + height);
    rectangle.setRoundness(0, 0);
    rectangle.setFillColor(Constants.C_WHITE);
    rectangle.setPenStyle(Constants.PS_DOT);
    rectangle.setZOrder(0);


    var freeText = this.model.CreateTextOcc(x - 50, y + 50, textDefinition);
    if (!BaseDialog.isNullOrEmpty(fontStyle)) {
        freeText.AttrOccList().forEach(function (attr) {
            attr.setFontStyleSheet(fontStyle);
        });
    }
    return rectangle;
}

DataModelManager.prototype.setZOrder = function (zOrder) {
    return function (occurrence) {
        if (!BaseDialog.isArisObjectNullOrInvalid(occurrence)) occurrence.setZOrder(zOrder);
    };
}
