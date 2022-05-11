var SUPPORTED_LANGUAGES = [Constants.LCID_GERMAN, Constants.LCID_ENGLISHUS];

function TogafModelManager(model, sourceObject, locale) {

    if (BaseDialog.isNullOrEmpty(model)) throw new ReferenceError(" variable model is not initialized");
    if (BaseDialog.isArisObjectNullOrInvalid(sourceObject)) throw  new ReferenceError(
        "variable sourceObject is not inicialized");


    this.togafModel = model;

    this.sourceObject = sourceObject;
    this.locale = locale;
    this.sourceObjectOccurrence = null;
}


TogafModelManager.prototype = Object.create(BaseDialog.prototype);
TogafModelManager.prototype.constructor = TogafModelManager;

TogafModelManager.prototype.createConnectionOccurrence = function (occurrence, connectionType, attribute, commentary, isSwitched) {

    var points = [];
    var startX;
    var startY;
    var endX;
    var endY;
    var distance = this.sourceObjectOccurrence.X() - occurrence.X();
    var cxnOcc;


    if (distance < 0) {
        distance = Math.floor((occurrence.X() - (this.sourceObjectOccurrence.X() + this.sourceObjectOccurrence.Width())) / 2.0);
    }
    else {
        distance = Math.floor((this.sourceObjectOccurrence.X() - (occurrence.X() + occurrence.Width())) / 2.0);
    }


    if (isSwitched) {
        startX = occurrence.X();
        startY = occurrence.Y() + Math.floor(occurrence.Height() / 2.0);
        endX = this.sourceObjectOccurrence.X() + this.sourceObjectOccurrence.Width();
        endY = this.sourceObjectOccurrence.Y() + Math.floor(this.sourceObjectOccurrence.Height() / 2.0);


        points.push(new Packages.java.awt.Point(startX, startY));
        points.push(new Packages.java.awt.Point(startX + distance, startY));
        points.push(new Packages.java.awt.Point(startX + distance, endY));
        points.push(new Packages.java.awt.Point(endX, endY));
        cxnOcc = this.togafModel.CreateCxnOcc(this.sourceObjectOccurrence, occurrence, connectionType, points, false, false);
    }
    else {
        startX = this.sourceObjectOccurrence.X() + this.sourceObjectOccurrence.Width();
        startY = this.sourceObjectOccurrence.Y() + Math.floor(this.sourceObjectOccurrence.Height() / 2.0);
        endX = occurrence.X();
        endY = occurrence.Y() + Math.floor(occurrence.Height() / 2.0);


        points.push(new Packages.java.awt.Point(startX, startY));
        points.push(new Packages.java.awt.Point(startX + distance, startY));
        points.push(new Packages.java.awt.Point(startX + distance, endY));
        points.push(new Packages.java.awt.Point(endX, endY));

        cxnOcc = this.togafModel.CreateCxnOcc(occurrence, this.sourceObjectOccurrence, connectionType, points, false, false);
    }
    if (BaseDialog.isArisObjectNullOrInvalid(cxnOcc)) return;
    return this.updateConnectionAttribute(cxnOcc, attribute, commentary);
}
TogafModelManager.prototype.createOccurrence = function (guid, symbol) {
    var definition = ArisData.getActiveDatabase().FindGUID(guid, Constants.CID_OBJDEF);
    if (BaseDialog.isArisObjectNullOrInvalid(definition)) return null;
    return this.togafModel.createObjOcc(symbol, definition, 0, 0);


}
TogafModelManager.prototype.updateConnectionAttribute = function (occurrence, attribute, commentary) {

    if (BaseDialog.isNullOrEmpty(attribute)) return;
    var connectionDefinition = occurrence.getDefinition();
    var descriptionAttribute = connectionDefinition.Attribute(attribute, this.locale);
    if (BaseDialog.isArisObjectNullOrInvalid(descriptionAttribute)) return;
    descriptionAttribute.setValue(commentary);

}
TogafModelManager.prototype.layout = function (input) {
    var those = this;

    if (BaseDialog.isNullOrEmpty(this.togafModel)) return false;
    if (BaseDialog.isNullOrEmpty(this.sourceObject)) return false;


    this.togafModel.setTemplate(TEMPLATE_GUID);
    this.togafModel.ApplyTemplate();
    this.togafModel.ObjOccList().forEach(function (object) {
        those.togafModel.deleteOcc(object, false);
    });
    this.togafModel.getGfxObjects().forEach(function (object) {
        those.togafModel.deleteGfxObj(object);
    });
    this.togafModel.TextOccList().forEach(function (object) {
        those.togafModel.deleteOcc(object, true);
    });
    this.togafModel.Group().ObjDefList()
        .forEach(function (objDef) {
            those.togafModel.Group().Delete(objDef);
        });

    if (input === null || typeof input === 'undefined' || input.length === 0) {
        var group = this.togafModel.Group();
        var parent = group.Parent();
        group.Delete(this.togafModel);
        parent.Delete(group);
        return false;
    }

    if (this.sourceObjectOccurrence === null || typeof this.sourceObjectOccurrence === 'undefined') {
        this.sourceObjectOccurrence = this.createOccurrence(this.sourceObject.GUID(), PRP_Constants.TOGAF_EVENT_SYMBOL);
    }

    var location = this.divideIntoCurrentAndPlanned(input);
    var interfaceOccurrences = [];
    var y = 500;
    var x = 100;

    if (typeof location === "object") {
        Object.keys(location)
              .forEach(function (key) {

                  var currentOccurrence = those.createLinkOfChain(location[key], true);
                  var plannedOccurrence = those.createLinkOfChain(location[key], false);

                  var points = [
                      new Packages.java.awt.Point(currentOccurrence.X() + Math.floor(currentOccurrence.Width() / 2.0),
                          currentOccurrence.Y() + currentOccurrence.Height()),
                      new Packages.java.awt.Point(plannedOccurrence.X() + Math.floor(plannedOccurrence.Width() / 2.0),
                          plannedOccurrence.Y())

                  ]
                  those.togafModel.CreateCxnOcc(currentOccurrence, plannedOccurrence,
                      PRP_Constants.TOGAF_INTERFACE_TO_INTERFACE_CONNECTION_TYPE, points, false, false);
                  var both = [];
                  both.push(currentOccurrence);
                  both.push(plannedOccurrence);
                  interfaceOccurrences.push(both);
              });

        interfaceOccurrences.forEach(function (occurrences) {

            for (var position = 0; position < occurrences.length; position++) {
                var max = those.layoutOneLinkOfChain(occurrences[position], 2000, x, y);
                y = max + 200;
                occurrences[position].SetSize(2000, occurrences[position].Height());
            }

            if (occurrences.length === 2) {
                occurrences[0].Cxns().filter(function (connection) {
                    return connection.getDefinition().TypeNum() === PRP_Constants.TOGAF_INTERFACE_TO_INTERFACE_CONNECTION_TYPE;
                }).forEach(function (connection) {
                    connection.setPoints(those.recalculateYPoints(connection.getSource(), connection.getTarget()));
                });
            }

        });
        ArisData.Save(Constants.SAVE_NOW);

        var interfaces = this.togafModel.ObjOccListFilter(PRP_Constants.TOGAF_INTERFACE_TYPE, PRP_Constants.TOGAF_INTERFACE_SYMBOL);
        var max = interfaces[0].X() + interfaces[0].Width() + this.sourceObjectOccurrence.Width();

        this.sourceObjectOccurrence.SetPosition(max, 500);
        this.sourceObjectOccurrence.Cxns().forEach(function (connection) {
            connection.setPoints(those.recalculatePointsExtra(connection.getSource(), connection.getTarget(), -50));
        });


    }

    var fontStyle = this.findFontStyle("Header Gray", this.locale);
    if (fontStyle !== null) {
        var freeText = this.togafModel.CreateTextOcc(50, 100, Constants.AT_NAME);
        freeText.AttrOccList().forEach(function (attr) {
            attr.setFontStyleSheet(fontStyle);
        });
        var rectangleY = 100 + freeText.Y();
        var line = this.togafModel.createRoundedRectangle(50, rectangleY,
            this.sourceObjectOccurrence.X() + this.sourceObjectOccurrence.Width() + 600, 5);
        line.setRoundness(0, 0);
        line.setFillColor(Constants.C_GRAY);
    }

    return true;


}
TogafModelManager.prototype.findFontStyle = function (fontName, locale) {

    var fonts = ArisData.getActiveDatabase().FontStyleList().filter(function (fontStyle) {
        return fontStyle.Name(locale).localeCompare(fontName) === 0;
    });

    if (!BaseDialog.isNullOrEmpty(fonts)) return fonts[0];
    var fontStyle = ArisData.getActiveDatabase().createFontStyle(fontName, locale, false);
    var font = fontStyle.Font(locale);
    font.setColor(Constants.C_GRAY);
    font.setSize(18);
    font.setStyle(Constants.FMT_BOLD);

    return fontStyle
}
TogafModelManager.prototype.setZOrder = function (zOrder) {
    return function (occurrence) {
        if (!BaseDialog.isArisObjectNullOrInvalid(occurrence)) occurrence.setZOrder(zOrder);
    };
}

//Helper function
TogafModelManager.prototype.divideIntoCurrentAndPlanned = function (input) {

    return input.filter(function (item) {
        return item.location !== null || typeof item.location !== 'undefined';
    }).map(function (item) {

        var object = {};

        object.current = {
            inSystem: item.inCurrentSystem,
            outSystem: item.outCurrentSystem,
            dataObjects: item.currentDataObjects,
            document: item.currentDocument
        };

        object.planned = {
            inSystem: item.inPlannedSystem,
            outSystem: item.outPlannedSystem,
            dataObjects: item.plannedDataObjects,
            document: item.plannedDocument
        };

        object.current.hash = PRP_Helper.hashCode(PRP_Helper.serialize(object.current));
        object.planned.hash = PRP_Helper.hashCode(PRP_Helper.serialize(object.planned));
        object.current.location = item.location;
        object.planned.location = item.location;


        object.location = item.location;
        object.currentHash = object.current.hash;
        object.plannedHash = object.planned.hash;

        return object;
    }).reduce(function (object, item) {

        var currentId = "c" + item.current.hash.toString();
        var plannedId = "p" + item.planned.hash.toString();
        var join = currentId + "_" + plannedId;
        object[join] = object[join] || [];
        object[join].push(item);


        return object;
    }, {});
}
TogafModelManager.prototype.createInterfaceOccurrence = function (name, modelGroup) {
    var locale = this.locale;
    var objDef = modelGroup.GetOrCreateObjDef(PRP_Constants.TOGAF_INTERFACE_TYPE, 2, name, this.locale);

    SUPPORTED_LANGUAGES.filter(function (language) {
        return language !== locale;
    }).forEach(function (language) {
        objDef.Attribute(Constants.AT_NAME, language).setValue(name);
    });
    return this.createOccurrence(objDef.GUID(), PRP_Constants.TOGAF_INTERFACE_SYMBOL);
}
TogafModelManager.prototype.putDetailIntoInterface = function (detail, interfaceOccurrence) {

    var those = this;
    var inSystemOccurrence;
    var outSystemOccurrence;
    var dataObjectsOccurrences = [];
    var documentOccurrence = null;
    var width = 200;
    var height = 0;
    var dataObjectsHeight = 0;
    var dataObjectStartX = 325;

    if (detail.inSystem !== null) {
        inSystemOccurrence = this.createOccurrence(detail.inSystem.object.GUID(), PRP_Constants.TOGAF_IT_SYSTEM_SYMBOL);
        interfaceOccurrence.addEmbeddedObjOcc(inSystemOccurrence, PRP_Constants.TOGAF_INTERFACE_IT_SYSTEM_CONNECTION_TYPE);
        width += inSystemOccurrence.Width();
        height = Math.max(height, inSystemOccurrence.Height());

    }

    if (detail.dataObjects.length > 0) {
        for (var position = 0; position < detail.dataObjects.length; position++) {
            var obj = detail.dataObjects[position];
            var occ = this.createOccurrence(obj.object.GUID(), PRP_Constants.TOGAF_DATA_OBJECT_SYMBOL);
            interfaceOccurrence.addEmbeddedObjOcc(occ, PRP_Constants.TOGAF_INTERFACE_IT_SYSTEM_CONNECTION_TYPE);
            if (position === 0 && inSystemOccurrence !== null && typeof inSystemOccurrence !== 'undefined') width += inSystemOccurrence.Width();
            else if (position === 0) width += occ.Width();
            dataObjectsHeight += (occ.Height());
            dataObjectsOccurrences.push(occ);
        }
        dataObjectsHeight += (detail.dataObjects.length - 1) * 50;
    }

    if (detail.outSystem !== null) {
        outSystemOccurrence = this.createOccurrence(detail.outSystem.object.GUID(), PRP_Constants.TOGAF_IT_SYSTEM_SYMBOL);
        interfaceOccurrence.addEmbeddedObjOcc(outSystemOccurrence, PRP_Constants.TOGAF_INTERFACE_IT_SYSTEM_CONNECTION_TYPE);
        width += outSystemOccurrence.Width();
        height = Math.max(height, inSystemOccurrence.Height());
    }

    if (detail.document !== null) {
        documentOccurrence = this.createOccurrence(detail.document.object.GUID(), PRP_Constants.DOCUMENT_SYMBOL);
        interfaceOccurrence.addEmbeddedObjOcc(documentOccurrence, PRP_Constants.TOGAF_DOCUMENT_INTERFACE_CONNECTION_TYPE);
        if (outSystemOccurrence === null) width += documentOccurrence.Width();
        if (outSystemOccurrence === null) height = Math.max(height, documentOccurrence.Height());


    }

    var totalWidth = interfaceOccurrence.Width() + width;
    var totalHeight = interfaceOccurrence.Height() + Math.max(height, dataObjectsHeight);
    if ((inSystemOccurrence !== null || outSystemOccurrence !== null) && documentOccurrence !== null) totalHeight += documentOccurrence.Height() + 50;

    interfaceOccurrence.SetSize(totalWidth, totalHeight);
    var addY = Math.floor(interfaceOccurrence.Height() / 2.0);

    interfaceOccurrence.getEmbeddedObjOccs().forEach(function (occurrence) {
        var y = occurrence.Y() + addY - Math.floor(occurrence.Height() / 2.0);
        var x = occurrence.X() + 150;
        if (typeof outSystemOccurrence !== 'undefined' && occurrence.IsEqual(outSystemOccurrence)) {
            x = interfaceOccurrence.X() + interfaceOccurrence.Width() - 50 - occurrence.Width();
            occurrence.SetPosition(x, y);
        }
        if (typeof inSystemOccurrence !== 'undefined' && occurrence.IsEqual(inSystemOccurrence)) {
            dataObjectStartX = x + 200 + occurrence.Width();
            occurrence.SetPosition(x, y);

        }
    });

    interfaceOccurrence.getEmbeddedObjOccs().forEach(function (occurrence) {
        if (typeof documentOccurrence !== 'undefined' && occurrence.IsEqual(documentOccurrence)) {
            var y = (interfaceOccurrence.Y() + interfaceOccurrence.Height())- occurrence.Height() - 10;
            var x = (interfaceOccurrence.X() + interfaceOccurrence.Width()) - occurrence.Width() - 10;
            occurrence.SetPosition(x, y);
        }

    });

    var dataObjectStep = 75;
    interfaceOccurrence.getEmbeddedObjOccs().filter(function (occurrence) {
        return dataObjectsOccurrences.some(function (occ) {
            return occurrence.IsEqual(occ);
        })
    }).forEach(function (occurrence) {
        occurrence.SetPosition(dataObjectStartX, occurrence.Y() + dataObjectStep);
        dataObjectStep += occurrence.Height() + 50;
    });

    if (dataObjectsHeight === 0 && typeof inSystemOccurrence !== 'undefined' && typeof outSystemOccurrence !== 'undefined') {
        var points = this.recalculatePoints(inSystemOccurrence, outSystemOccurrence);
        this.togafModel.CreateCxnOcc(inSystemOccurrence, outSystemOccurrence, PRP_Constants.TOGAF_IT_SYSTEM_CONNECTION_TYPE,
            points, false, false);
    }
    if (dataObjectsHeight > 0 && typeof inSystemOccurrence !== 'undefined') {
        dataObjectsOccurrences.forEach(function (occ) {
            var points = those.recalculatePoints(inSystemOccurrence, occ);
            those.togafModel.CreateCxnOcc(inSystemOccurrence, occ, PRP_Constants.TOGAF_IT_SYSTEM_DATA_OBJECT_CONNECTION_TYPE,
                points, false, false);
        })
    }
    if (dataObjectsHeight > 0 && typeof outSystemOccurrence !== 'undefined') {
        dataObjectsOccurrences.forEach(function (occ) {
            var points = those.recalculatePoints(outSystemOccurrence, occ);
            those.togafModel.CreateCxnOcc(occ, outSystemOccurrence, PRP_Constants.TOGAF_DATA_OBJECT_IT_SYSTEM_CONNECTION_TYPE,
                points, false, false);
        })
    }


}
TogafModelManager.prototype.putBrandOrLocationIntoModel = function (detail, modelGroup, interfaceOccurrence) {

    var item = detail;
    var target = interfaceOccurrence;
    var connectionType = item.object.TypeNum() === PRP_Constants.TOGAF_COMMITTEE_OBJECT_TYPE ?
        PRP_Constants.TOGAF_COMMITTEE_TO_INTERFACE_CONNNECTION_TYPE : PRP_Constants.TOGAF_PLANT_OR_BRAND_CONNECTION_TYPE;
    do {
        var type = item.object.TypeNum();
        switch (type) {
            case PRP_Constants.TOGAF_COMMITTEE_OBJECT_TYPE:
                target = this.createBrandOrCompanyOrLocationOccurrence(item.object.GUID(), PRP_Constants.TOGAF_COMMITTEE_SYMBOL,
                    target, connectionType, false);
                break;
            case PRP_Constants.TOGAF_BRAND_TYPE:
                target = this.createBrandOrCompanyOrLocationOccurrence(item.object.GUID(), PRP_Constants.TOGAF_BRAND_SYMBOL, target,
                    connectionType, false);
                break;
            case PRP_Constants.TOGAF_PLANT_TYPE:
                target = this.createBrandOrCompanyOrLocationOccurrence(item.object.GUID(), PRP_Constants.TOGAF_PLANT_SYMBOL, target,
                    connectionType, true);
                break;


        }
        item = item.parent;
        if (type === PRP_Constants.TOGAF_PLANT_TYPE && item.object.TypeNum() === PRP_Constants.TOGAF_BRAND_TYPE) {
            connectionType = PRP_Constants.TOGAF_BRAND_TO_PLANT_CONNECTION_TYPE;
        }
        else if (type === PRP_Constants.TOGAF_BRAND_TYPE && item.object.TypeNum() === PRP_Constants.TOGAF_COMMITTEE_OBJECT_TYPE) {
            connectionType = PRP_Constants.TOGAF_COMMITTE_TO_BRAND_CONNECTION_TYPE;
        }


    } while (item !== null);
}
TogafModelManager.prototype.recalculatePoints = function (source, target) {

    var distance = source.X() - target.X();
    var startX;
    var startY;
    var endX;
    var endY;

    if (distance >= 0) {
        distance = Math.floor((source.X() - (target.X() + target.Width())) / 2.0);
        startX = target.X() + target.Width();
        startY = target.Y() + Math.floor(target.Height() / 2.0);
        endX = source.X();
        endY = source.Y() + Math.floor(source.Height() / 2.0);
    }
    else {
        distance = Math.floor((target.X() - (source.X() + source.Width())) / 2.0);
        startX = source.X() + source.Width();
        startY = source.Y() + Math.floor(source.Height() / 2.0);
        endX = target.X();
        endY = target.Y() + Math.floor(target.Height() / 2.0);
    }

    var points = [];
    points.push(new Packages.java.awt.Point(startX, startY));
    points.push(new Packages.java.awt.Point(startX + distance, startY));
    points.push(new Packages.java.awt.Point(startX + distance, endY));
    points.push(new Packages.java.awt.Point(endX, endY));
    return points;
}
TogafModelManager.prototype.recalculateYPoints = function (source, target) {

    var startX;
    var startY;
    var endX;
    var endY;

    startX = source.X() + Math.floor(source.Width() / 2);
    startY = source.Y() + source.Height();
    endX = target.X() + Math.floor(target.Width() / 2);
    endY = target.Y();

    var points = [];
    points.push(new Packages.java.awt.Point(startX, startY));
    points.push(new Packages.java.awt.Point(endX, endY));
    return points;
}
TogafModelManager.prototype.createLinkOfChain = function (items, isCurrent) {

    var modelGroup = this.togafModel.Group();
    var those = this;
    var name = "PRP| ";
    var sourceName = "None| ";
    var targetName = "None| ";

    if (isCurrent) {
        if (items[0].current.inSystem !== null) {
            sourceName = BaseDialog.getMaintainedObjectName(items[0].current.inSystem.object, this.locale) + "| "
        }
        if (items[0].current.outSystem !== null) {
            targetName = BaseDialog.getMaintainedObjectName(items[0].current.outSystem.object, this.locale) + "| ";
        }
    }
    else {
        if (items[0].planned.inSystem !== null) {
            sourceName = BaseDialog.getMaintainedObjectName(items[0].planned.inSystem.object, this.locale) + "| ";
        }
        if (items[0].planned.outSystem !== null) {
            targetName = BaseDialog.getMaintainedObjectName(items[0].planned.outSystem.object, this.locale) + "| ";
        }
    }
    name = isCurrent ? name + sourceName + targetName + "Current" : name + sourceName + targetName + "Planned";

    var interfaceOccurrence = this.createInterfaceOccurrence(name, modelGroup);

    items
        .map(function (item) {
            return item.location;
        })
        .reduce(function (array, location) {
            var isIn = array.some(function (item) {
                return item.guid.startsWith(location.guid)
            });
            if (!isIn) array.push(location);
            return array;
        }, [])
        .forEach(function (item) {
            those.putBrandOrLocationIntoModel(item, modelGroup, interfaceOccurrence);
        });

    items
        .map(function (item) {
            return isCurrent ? item.current : item.planned;
        })
        .forEach(function (item, index) {
            if (index > 0) return;
            those.putDetailIntoInterface(item, interfaceOccurrence);
        });

    this.createConnectionOccurrence(interfaceOccurrence, PRP_Constants.TOGAF_INTERFACE_CONNECTION_TYPE, null, null,
        false);
    return interfaceOccurrence;
}
TogafModelManager.prototype.layoutOneLinkOfChain = function (link, maxX, startX, startY) {

    var those = this;
    var originalInterfaceXPosition = link.X();
    var originalInterfaceYPosition = link.Y();
    var locations = link.getConnectedObjOccs(
        [PRP_Constants.TOGAF_BRAND_SYMBOL, PRP_Constants.TOGAF_PLANT_SYMBOL, PRP_Constants.TOGAF_COMMITTEE_SYMBOL]);
    locations = ArisData.sort(locations, Constants.AT_NAME, this.locale);
    var sumHeight = locations.reduce(function (sum, location) {
        return sum + location.Height();
    }, 0);
    var interfaceHeight = link.Height();
    var interfaceMiddleY = link.Y() + Math.floor(interfaceHeight / 2.0);
    var sumHalfHeight = Math.floor(sumHeight / 2.0);
    var positionX = startX + (3*(locations[0].Width()+150));
    link.SetPosition(positionX, startY + sumHalfHeight - interfaceMiddleY);
    var distanceX = link.X() - originalInterfaceXPosition;
    var distanceY = link.Y() - originalInterfaceYPosition;
    for (var position = 0; position < locations.length; position++) {

        var location = locations[position];
        var displacementIndex = 2
        this.layoutLocation(location,startX,startY,displacementIndex);

        do {

            var connectedLocations = location.getConnectedObjOccs([PRP_Constants.TOGAF_BRAND_SYMBOL, PRP_Constants.TOGAF_PLANT_SYMBOL, PRP_Constants.TOGAF_COMMITTEE_SYMBOL],Constants.EDGES_IN);
            if (connectedLocations.length > 0) {
                writeLog(sm72tc, "Location " + BaseDialog.getMaintainedObjectName(location.ObjDef(),this.locale) + "contains " + connectedLocations.length + " connected objects","info ")
                displacementIndex = displacementIndex - 1;
                this.layoutLocation(connectedLocations[0], startX,startY,displacementIndex);
                location = connectedLocations[0];
            }
        }
        while(connectedLocations.length > 0);
        startY += location.Height();
    }

    link.getEmbeddedObjOccs().forEach(function (occurrence) {
        occurrence.SetPosition(occurrence.X() + distanceX, occurrence.Y() + distanceY);
    });

    link.getEmbeddedObjOccs().forEach(function (occurrence) {
        occurrence.Cxns().forEach(function (connection) {
            connection.setPoints(those.recalculatePoints(connection.getSource(), connection.getTarget()));
        });
    });
    return Math.max(startY, link.Y() + link.Height() + 150);
}
TogafModelManager.prototype.recalculatePointsExtra = function (source, target, distance) {

    var chooseType = source.X() - target.X();
    var startX;
    var startY;
    var endX;
    var endY;

    if (chooseType >= 0) {
        startX = target.X() + target.Width();
        startY = target.Y() + Math.floor(target.Height() / 2.0);
        endX = source.X();
        endY = source.Y() + Math.floor(source.Height() / 2.0);
    }
    else {
        startX = source.X() + source.Width();
        startY = source.Y() + Math.floor(source.Height() / 2.0);
        endX = target.X();
        endY = target.Y() + Math.floor(target.Height() / 2.0);
    }

    var points = [];
    points.push(new Packages.java.awt.Point(startX, startY));
    points.push(new Packages.java.awt.Point(endX + distance, startY));
    points.push(new Packages.java.awt.Point(endX + distance, endY));
    points.push(new Packages.java.awt.Point(endX, endY));
    return points;
}

TogafModelManager.prototype.getContentOfModel = function () {

    var locale = this.locale;
    var those = this;
    var interfaceConnections = this.togafModel
                                   .ObjOccListFilter(PRP_Constants.TOGAF_INTERFACE_TYPE, PRP_Constants.TOGAF_INTERFACE_SYMBOL)
                                   .filter(function (occurrence) {
                                       return occurrence.Cxns(Constants.EDGES_OUT).some(function (connection) {
                                           return connection.getDefinition()
                                                            .TypeNum() === PRP_Constants.TOGAF_INTERFACE_TO_INTERFACE_CONNECTION_TYPE;
                                       });
                                   });

    return interfaceConnections.map(function (occurrence) {
        var object = {};

        var plannedOccurrence = occurrence.Cxns(Constants.EDGES_OUT).filter(function (connection) {
            return connection.getDefinition().TypeNum() === PRP_Constants.TOGAF_INTERFACE_TO_INTERFACE_CONNECTION_TYPE;
        }).map(function (connection) {
            writeLog(sm72tc, "Connection source " + BaseDialog.getMaintainedObjectName(connection.getSource().ObjDef(), locale),
                "info");
            writeLog(sm72tc, "Connection target " + BaseDialog.getMaintainedObjectName(connection.getTarget().ObjDef(), locale),
                "info");
            return connection.getTarget();
        })[0];

        writeLog(sm72tc, "Current interface " + BaseDialog.getMaintainedObjectName(occurrence.ObjDef(), locale), "info");
        object.current = those.convertInterfaceToObject(occurrence);
        writeLog(sm72tc, "Planned interface " + BaseDialog.getMaintainedObjectName(plannedOccurrence.ObjDef(), locale), "info");
        object.planned = those.convertInterfaceToObject(plannedOccurrence);

        return object;
    });


}
TogafModelManager.prototype.convertInterfaceToObject = function (occurrence) {

    var object = {};
    var locale = this.locale;
    var those = this;
    var dataObjects = occurrence.getEmbeddedObjOccs([PRP_Constants.TOGAF_DATA_OBJECT_SYMBOL])
                                .map(function (dataOccurrence) {
                                    return new Item(BaseDialog
                                            .getMaintainedObjectName(dataOccurrence.ObjDef(), locale),
                                        false,
                                        dataOccurrence.ObjDef(),
                                        null);
                                });

    var inSystems = occurrence.getEmbeddedObjOccs([PRP_Constants.TOGAF_IT_SYSTEM_SYMBOL])
                              .filter(function (itSystemOccurrence) {
                                  return itSystemOccurrence.getConnectedObjOccs(
                                      [PRP_Constants.TOGAF_IT_SYSTEM_SYMBOL, PRP_Constants.TOGAF_DATA_OBJECT_SYMBOL],
                                      Constants.EDGES_OUT).length > 0;
                              })
                              .map(function (itSystemOccurrence) {
                                  return new Item(BaseDialog
                                          .getMaintainedObjectName(itSystemOccurrence.ObjDef(), locale),
                                      false,
                                      itSystemOccurrence.ObjDef(),
                                      null);
                              });

    var outSystems = occurrence.getEmbeddedObjOccs([PRP_Constants.TOGAF_IT_SYSTEM_SYMBOL])
                               .filter(function (itSystemOccurrence) {
                                   return itSystemOccurrence.getConnectedObjOccs(
                                       [PRP_Constants.TOGAF_IT_SYSTEM_SYMBOL, PRP_Constants.TOGAF_DATA_OBJECT_SYMBOL],
                                       Constants.EDGES_OUT).length === 0;
                               })
                               .map(function (itSystemOccurrence) {
                                   return new Item(BaseDialog
                                           .getMaintainedObjectName(itSystemOccurrence.ObjDef(), locale),
                                       false,
                                       itSystemOccurrence.ObjDef(),
                                       null);
                               });

    var locations = occurrence.getConnectedObjOccs(
                                  [PRP_Constants.TOGAF_BRAND_SYMBOL, PRP_Constants.TOGAF_PLANT_SYMBOL, PRP_Constants.TOGAF_COMMITTEE_SYMBOL])
                              .map(function (occurrence) {

                                  var type = occurrence.ObjDef().TypeNum();
                                  switch (type) {
                                      case PRP_Constants.TOGAF_COMMITTEE_OBJECT_TYPE:
                                          return new Item(BaseDialog.getMaintainedObjectName(occurrence.ObjDef(), locale), true,
                                              occurrence.ObjDef(), null);
                                      case PRP_Constants.TOGAF_BRAND_TYPE:
                                      case PRP_Constants.TOGAF_PLANT_TYPE:
                                          return those.reconstructBrandChain(occurrence);
                                      default:
                                          return null;
                                  }
                              });

    var documents = occurrence.getEmbeddedObjOccs([PRP_Constants.DOCUMENT_SYMBOL]).map(function (documentOccurrence) {
        return new Item(BaseDialog.getMaintainedObjectName(documentOccurrence.ObjDef(), locale), false,
            documentOccurrence.ObjDef(), null);
    })

    object.dataObjects = dataObjects;
    object.inSystem = inSystems.length > 0 ? inSystems[0] : null;
    object.outSystem = outSystems.length > 0 ? outSystems[0] : null;
    object.locations = locations;
    object.document = documents.length > 0 ? documents[0] : null;

    return object;
}
TogafModelManager.prototype.createBrandOrCompanyOrLocationOccurrence = function (guid, symbol, target, connectionType, isSwitch) {

    var objOcc = this.createOccurrence(guid, symbol);
    var points = this.recalculatePoints(objOcc, target);

    if (isSwitch) this.togafModel.CreateCxnOcc(target, objOcc, connectionType, points, false, false);
    else this.togafModel.CreateCxnOcc(objOcc, target, connectionType, points, false, false);

    return objOcc;
}
TogafModelManager.prototype.reconstructBrandChain = function (occurrence) {

    var type = occurrence.ObjDef().TypeNum();
    var connections = [];
    var objectSymbol;
    var objectName = BaseDialog.getMaintainedObjectName(occurrence.ObjDef(), this.locale);
    var item = new Item(objectName, false, occurrence.ObjDef(), null);
    if (type !== PRP_Constants.TOGAF_PLANT_TYPE) item.isFolder = true;
    var holder = item;
    do {
        objectSymbol = type === PRP_Constants.TOGAF_PLANT_TYPE ? PRP_Constants.TOGAF_BRAND_SYMBOL : PRP_Constants.TOGAF_COMMITTEE_SYMBOL;
        connections = occurrence.getConnectedObjOccs(objectSymbol);
        if (connections.length > 0) {
            var rootName = BaseDialog.getMaintainedObjectName(connections[0].ObjDef(), this.locale);
            holder.parent = new Item(rootName, true, connections[0].ObjDef(), null);
            holder = holder.parent;
            type = connections[0].ObjDef().TypeNum();
            occurrence = connections[0];
        }
    } while (connections.length !== 0)
    return item;
}
TogafModelManager.prototype.layoutLocation = function (location,startX,startY,displacementIndex) {

    var those = this;
    location.SetPosition(startX + (displacementIndex*(location.Width()+150)), startY);
    location.Cxns().filter(function (connection) {
        return (connection.getDefinition().TypeNum() === PRP_Constants.TOGAF_PLANT_OR_BRAND_CONNECTION_TYPE ||
            connection.getDefinition().TypeNum() === PRP_Constants.TOGAF_COMMITTEE_TO_INTERFACE_CONNNECTION_TYPE ||
        connection.getDefinition().TypeNum() === PRP_Constants.TOGAF_COMMITTE_TO_BRAND_CONNECTION_TYPE ||
        connection.getDefinition().TypeNum() === PRP_Constants.TOGAF_BRAND_TO_PLANT_CONNECTION_TYPE
        );

    }).forEach(function (connection) {

        writeLog(sm72tc, "Connection type " + connection.getDefinition().TypeNum() ,"info");
        writeLog(sm72tc, "Location " + BaseDialog.getMaintainedObjectName(location.ObjDef(),those.locale),"info");
        writeLog(sm72tc, "Connection source  " + BaseDialog.getMaintainedObjectName(connection.getSource().ObjDef(),those.locale),"info");
        writeLog(sm72tc, "Connection target " + BaseDialog.getMaintainedObjectName(connection.getTarget().ObjDef(),those.locale),"info");

        if (connection.getSource().ObjDef().TypeNum() === PRP_Constants.TOGAF_BRAND_TYPE) {
            connection.setPoints(those.recalculatePoints(connection.getSource(), connection.getTarget()));
        }
        if (connection.getTarget().ObjDef().TypeNum() === PRP_Constants.TOGAF_PLANT_TYPE) {
            connection.setPoints(those.recalculatePoints(connection.getSource(), connection.getTarget()));
        }
        if (connection.getSource().ObjDef().TypeNum() === PRP_Constants.TOGAF_COMMITTEE_OBJECT_TYPE) {
            connection.setPoints(those.recalculatePoints(connection.getTarget(), connection.getSource()));
        }

    });
}
