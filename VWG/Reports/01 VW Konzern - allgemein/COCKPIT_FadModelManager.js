FadModelManager.topicConnectionType = Constants.CT_IS_CHCKD_BY;
FadModelManager.systemConnectionType = Constants.CT_IS_NEEDED_BY;
FadModelManager.processOwnerConnectionType = Constants.CT_DECD_ON;
FadModelManager.documentConnectionType = Constants.CT_PROV_INP_FOR;
FadModelManager.inputConnectionType = Constants.CT_IS_USED_BY_1;
FadModelManager.outputConnectionType = Constants.CT_HAS_OUT;
FadModelManager.objectiveConnectionType = Constants.CT_SUPP_3;
FadModelManager.serviceConnectionType = Constants.CT_CAN_SUPP_1;
FadModelManager.assumptionConnectionType = Constants.CT_INFLUENCES; //CT_CONC_3 replaced by cost driver
FadModelManager.bussinesCapabilityConnectionType = Constants.CT_CAN_SUPP_1;
FadModelManager.committeeConnectionType = Constants.CT_IS_DP_RESP_1;
FadModelManager.gapConnectionType = Constants.CT_CONC_3;
FadModelManager.itSystemConnectionType = Constants.CT_CAN_SUPP_1;
FadModelManager.requirementConnectionType = Constants.CT_REFS_TO_2;
FadModelManager.riskConnectionType = Constants.CT_OCCUR;
FadModelManager.weakPointConnectionType = Constants.CT_OCCUR;
FadModelManager.taskConnectionType = Constants.CT_REFS_TO_2;
FadModelManager.kpiConnectionType = Constants.CT_MEASURED_BY;
FadModelManager.customerTouchingPointConnectionType = Constants.CT_IS_RELATED_TO_1;

FadModelManager.systemType = Constants.OT_KNWLDG_CAT;
FadModelManager.topicType = Constants.OT_TECH_TRM;
FadModelManager.documentType = Constants.OT_INFO_CARR;
FadModelManager.processOwnerType = Constants.OT_PERS_TYPE;
FadModelManager.inputType = Constants.OT_PERF;
FadModelManager.outputType = Constants.OT_PERF;
FadModelManager.objectiveType = Constants.OT_OBJECTIVE;
FadModelManager.serviceType = Constants.OT_FUNC_CLUSTER;
FadModelManager.assumptionType = Constants.OT_COST_DRIVER; //OT_ASSUMPTION replaced by cost driver
FadModelManager.bussinesCapabilityType = Constants.OT_IS_FUNC;
FadModelManager.committeeType = Constants.OT_GRP;
FadModelManager.gapType = Constants.OT_GAP;
FadModelManager.itSystemType = Constants.OT_APPL_SYS_TYPE;
FadModelManager.requirementType = Constants.OT_REQUIREMENT;
FadModelManager.riskType = Constants.OT_RISK;
FadModelManager.weakPointType = Constants.OT_RISK;
FadModelManager.taskType = Constants.OT_FUNC_INST;
FadModelManager.kpiType = Constants.OT_KPI;
FadModelManager.customerTouchingPointType = Constants.OT_CUSTOMER_TOUCHPOINT;


FadModelManager.systemSymbol = Constants.ST_KNWLDG_CAT_1;
FadModelManager.topicSymbol = Constants.ST_TECH_TERM;
FadModelManager.documentSymbol = Constants.ST_DOC;
FadModelManager.processOwnerSymbol = Constants.ST_EMPL_TYPE;
FadModelManager.inputSymbol = Constants.ST_PERFORM;
FadModelManager.outputSymbol = Constants.ST_PERFORM;
FadModelManager.objectiveSymbol = Constants.ST_OBJCTV;
FadModelManager.serviceSymbol = Constants.ST_IS_FUNC_ZONE;
FadModelManager.assumptionSymbol = Constants.ST_COST_DRIVER; //ST_ASSUMPTION replaced by cost driver
FadModelManager.bussinesCapabilitySymbol = Constants.ST_IS_FUNC;
FadModelManager.committeeSymbol = Constants.ST_GRP;
FadModelManager.gapSymbol = Constants.ST_GAP;
FadModelManager.itSystemSymbol = Constants.ST_APPL_SYS_TYPE;
FadModelManager.requirementSymbol = Constants.ST_REQUIREMENT;
FadModelManager.riskSymbol = Constants.ST_RISK_1;
FadModelManager.weakPointSymbol = Constants.ST_WEAK_POINT;
FadModelManager.taskSymbol = Constants.ST_FUNC_INST;
FadModelManager.kpiSymbol = Constants.ST_KPI;
FadModelManager.customerTouchingPointSymbol = Constants.ST_CUSTOMER_TOUCHPOINT;

FadModelManager.descriptionAttribute = Constants.AT_DESC;

FadModelManager.templateGUID = "90035e81-4129-11d4-857d-00005a4053ff";


function FadModelManager(model, sourceObject, locale) {
    
    if (BaseDialog.isNullOrEmpty(model)) throw new ReferenceError(" variable model is not initialized");
    if (BaseDialog.isArisObjectNullOrInvalid(sourceObject)) throw  new ReferenceError("variable sourceObject is not inicialized");
    
    
    this.fadModel = model;
    
    this.sourceObject = sourceObject;
    this.locale = locale;
    this.sourceObjectOccurrence = model.ObjOccListFilter(sourceObject.TypeNum())[0];
    
    
}

FadModelManager.prototype = Object.create(BaseDialog.prototype);
FadModelManager.prototype.constructor = FadModelManager;

FadModelManager.prototype.addOrUpdateObjects = function (input, objectType, connectionType, symbol, isSingle, isSwitched) {
    
    if (BaseDialog.isArisObjectNullOrInvalid(this.fadModel)) return false;
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
                those.fadModel.deleteOcc(occurrence, false);
            })
        }
    }
}

FadModelManager.prototype.addOrUpdateTable = function (inputs, objectType, connectionType, attribute, symbol) {
    
    if (BaseDialog.isArisObjectNullOrInvalid(this.fadModel)) return false;
    if (BaseDialog.isNullOrEmpty(inputs)) return false;
    
    var objectOccurrences = this.getOccurrence(objectType);
    var currentOccurrences = inputs.filter(function (input) {
        return objectOccurrences.some(function (occurrence) {
            return occurrence.ObjDef().GUID().indexOf(input[BaseDialog.TOPIC_GUID_INDEX]) === 0;
        });
    });
    
    var newObjects = inputs.filter(function (input) {
        
        if (BaseDialog.isNullOrEmpty(objectOccurrences)) return true;
        return !objectOccurrences.some(function (occurrence) {
            return occurrence.ObjDef().GUID().indexOf(input[BaseDialog.TOPIC_GUID_INDEX]) === 0;
        });
    });
    var those = this;
    
    if (!BaseDialog.isNullOrEmpty(currentOccurrences)) {
        currentOccurrences.forEach(function (occurrence) {
            var sameOccurrences = objectOccurrences.filter(function (occ) {
                return occ.ObjDef().GUID().indexOf(occurrence[BaseDialog.TOPIC_GUID_INDEX]) === 0;
            });
            if (BaseDialog.isNullOrEmpty(sameOccurrences)) return;
            var currentOccurrence = sameOccurrences[0];
            those.processObject(currentOccurrence, connectionType, attribute, occurrence[BaseDialog.TOPIC_COMMENTARY_INDEX]);
        });
    }
    
    newObjects.forEach(function (object) {
        var occurrence = those.createOccurrence(object[BaseDialog.TOPIC_GUID_INDEX], symbol);
        //TODO throw exception and log it;
        if (BaseDialog.isArisObjectNullOrInvalid(occurrence)) return;
        those.processObject(occurrence, connectionType, attribute, object[BaseDialog.TOPIC_COMMENTARY_INDEX]);
    });
    
    var remains = objectOccurrences.filter(function (occurrence) {
        return !inputs.some(function (input) {
            return occurrence.ObjDef().GUID().indexOf(input[BaseDialog.TOPIC_GUID_INDEX]) === 0;
        })
    })
    
    
    remains.forEach(function (ocuurrence) {
        those.fadModel.deleteOcc(ocuurrence, false);
    })
    
    return true;
}

FadModelManager.prototype.delete = function (objectType, objectSymbol) {
    
    if (BaseDialog.isArisObjectNullOrInvalid(this.fadModel)) return false;
    if (BaseDialog.isNullOrEmpty(objectType)) return false;
    if (BaseDialog.isNullOrEmpty(objectSymbol)) return false;
    
    var occurrences = this.fadModel.ObjOccListFilter(objectType, objectSymbol);
    
    if (BaseDialog.isNullOrEmpty(occurrences)) return false;
    
    var fadModel = this.fadModel;
    occurrences.forEach(function (occurrence) {
        if (!BaseDialog.isArisObjectNullOrInvalid(occurrence)) fadModel.deleteOcc(occurrence, false);
        
    })
}

FadModelManager.prototype.deleteByConnection = function (objectType,objectSymbol,connectionType) {
    
    if (BaseDialog.isArisObjectNullOrInvalid(this.fadModel)) return false;
    if (BaseDialog.isNullOrEmpty(objectType)) return false;
    if (BaseDialog.isNullOrEmpty(objectSymbol)) return false;
    
    var occurrences = this.fadModel.ObjOccListFilter(objectType, objectSymbol)
      .filter(function(occurrence){
          return occurrence.CxnOccList().some(function (connectionOccurrence) {
              return connectionOccurrence.getDefinition().TypeNum() === connectionType;
          });
      });
    
    if (BaseDialog.isNullOrEmpty(occurrences)) return false;
    
    var fadModel = this.fadModel;
    occurrences.forEach(function (occurrence) {
        if (!BaseDialog.isArisObjectNullOrInvalid(occurrence)) fadModel.deleteOcc(occurrence, false);
        
    })
}

FadModelManager.prototype.deleteRemains = function (objects, objectType, objectSymbol, connectionType) {
    
    if (BaseDialog.isArisObjectNullOrInvalid(this.fadModel)) return false;
    if (BaseDialog.isNullOrEmpty(objects)) return false;
    if (BaseDialog.isNullOrEmpty(objectType)) return false;
    if (BaseDialog.isNullOrEmpty(objectSymbol)) return false;
    
    var occurrences = this.fadModel.ObjOccListFilter(objectType, objectSymbol);
    
    if (BaseDialog.isNullOrEmpty(occurrences)) return false;
    
    if (connectionType !== null) {
        occurrences = occurrences.filter(function (occurrence) {
            return occurrence.CxnOccList().some(function (connectionOccurrence) {
                return connectionOccurrence.getDefinition().TypeNum() === connectionType;
            });
        });
    }
    
    var fadModel = this.fadModel;
    
    var toDelete = occurrences.filter(function (occurrence) {
        return !objects.some(function (object) {
            return String(object.GUID()).equals(String(occurrence.ObjDef().GUID()));
        })
    });
    
    toDelete.forEach(function (occurrence) {
        if (!BaseDialog.isArisObjectNullOrInvalid(occurrence)) fadModel.deleteOcc(occurrence, false);
    })
}

FadModelManager.prototype.getOccurrence = function (type) {
    if (BaseDialog.isArisObjectNullOrInvalid(this.fadModel)) return [];
    return this.fadModel.ObjOccListFilter(type);
    
}

FadModelManager.prototype.processObject = function (occurrence, connectionType, attribute, commentary, isSwitched) {
    
    if (connectionType === null) return false;
    var connections = occurrence.Cxns();
    var foundConnections = this.getSpecificConnectionType(connections, connectionType);
    if (BaseDialog.isNullOrEmpty(foundConnections)) {
        this.createConnectionOccurrence(occurrence, connectionType, attribute, commentary, isSwitched);
    } else {
        this.updateConnectionOccurrence(foundConnections[0], attribute, commentary);
    }
}

FadModelManager.prototype.createConnectionOccurrence = function (occurrence, connectionType, attribute, commentary, isSwitched) {
    
    
    var connectionOccurrence = isSwitched ?
      this.fadModel.CreateCxnOcc(this.sourceObjectOccurrence, occurrence, connectionType, [], false, true)
      : this.fadModel.CreateCxnOcc(occurrence, this.sourceObjectOccurrence, connectionType, [], false, true);
    // TODO throw exception and log it;
    if (BaseDialog.isArisObjectNullOrInvalid(connectionOccurrence)) return;
    return this.updateConnectionAttribute(connectionOccurrence, attribute, commentary);
}

FadModelManager.prototype.updateConnectionOccurrence = function (occurrence, attribute, commentary) {
    
    if (attribute === null) return false;
    var connectionDefinition = occurrence.getDefinition();
    var descriptionAttribute = connectionDefinition.Attribute(attribute, this.locale);
    // TODO thow exception and log it;
    if (BaseDialog.isArisObjectNullOrInvalid(descriptionAttribute)) return;
    descriptionAttribute.setValue(commentary);
}

FadModelManager.prototype.createOccurrence = function (guid, symbol) {
    var definition = ArisData.getActiveDatabase().FindGUID(guid, Constants.CID_OBJDEF);
    if (BaseDialog.isArisObjectNullOrInvalid(definition)) return null;
    return this.fadModel.createObjOcc(symbol, definition, 0, 0);
    
    
}

FadModelManager.prototype.updateConnectionAttribute = function (occurrence, attribute, commentary) {
    
    if (BaseDialog.isNullOrEmpty(attribute)) return;
    var connectionDefinition = occurrence.getDefinition();
    var descriptionAttribute = connectionDefinition.Attribute(attribute, this.locale);
    // TODO thow exception and log it;
    if (BaseDialog.isArisObjectNullOrInvalid(descriptionAttribute)) return;
    descriptionAttribute.setValue(commentary);
    
}

FadModelManager.prototype.layout = function () {
    
    if (BaseDialog.isNullOrEmpty(this.fadModel)) return false;
    if (BaseDialog.isNullOrEmpty(this.sourceObjectOccurrence)) return false;
    
    
    this.fadModel.setTemplate(FadModelManager.templateGUID);
    this.fadModel.ApplyTemplate();
    
    
    var processOwner = this.fadModel.ObjOccListFilter(FadModelManager.processOwnerType, FadModelManager.processOwnerSymbol);
    var operationProcessObjectives = this.fadModel.ObjOccListFilter(FadModelManager.objectiveType, FadModelManager.objectiveSymbol);
    
    var aboveObjectsArray = [processOwner, operationProcessObjectives];
    var aboveObjectsMaxWidth = this.findMaxWidth(aboveObjectsArray);
    var aboveObjectsMaxHeight = this.findMaxHeight(aboveObjectsArray);
    var maxCount = BaseDialog.getMaxItemCount(aboveObjectsArray);
    
    
    var correctY = 1300 + Math.floor(maxCount * aboveObjectsMaxHeight);
    
    this.sourceObjectOccurrence.SetSize(2562, 236);
    this.sourceObjectOccurrence.SetPosition(1500, correctY);
    
    var those = this;
    this.fadModel.getGfxObjects().forEach(function (object) {
        those.fadModel.deleteGfxObj(object);
    });
    this.fadModel.TextOccList().forEach(function (object) {
        those.fadModel.deleteOcc(object, true);
    })
    
    
    var fontStyle = this.findFontStyle("Header Gray", this.locale);
    if (fontStyle !== null) {
        var freeText = this.fadModel.CreateTextOcc(50, 100, Constants.AT_NAME);
        freeText.AttrOccList().forEach(function (attr) {
            attr.setFontStyleSheet(fontStyle);
        });
        var rectangleY = 100 + freeText.Y();
        var line = this.fadModel.createRoundedRectangle(50, rectangleY, this.sourceObjectOccurrence.X() + this.sourceObjectOccurrence.Width() + 600, 5);
        line.setRoundness(0, 0);
        line.setFillColor(Constants.C_GRAY);
        
        
    }
    
    var sourceObjectWidth = this.sourceObjectOccurrence.Width();
    var oneFifth = Math.floor(sourceObjectWidth / 20);
    
    var purposeY = this.placeProcessPurpose();
    
    
    this.arrangeAbove(processOwner, aboveObjectsMaxWidth, this.sourceObjectOccurrence.X() + 2 * oneFifth, purposeY - 300, "PROCESS_OWNER");
    this.arrangeAbove(operationProcessObjectives, aboveObjectsMaxWidth, this.sourceObjectOccurrence.X() + 2 * oneFifth + 2 * Math.floor(5.3 * oneFifth),
                      purposeY - 300, "OPERATIONAL_PROCESS_OBJECTIVES");
    
    
    //Place below main object
    var services = this.fadModel.ObjOccListFilter(FadModelManager.serviceType, FadModelManager.serviceSymbol);
    var gaps = this.fadModel.ObjOccListFilter(FadModelManager.gapType, FadModelManager.gapSymbol)
    var systems = this.fadModel.ObjOccListFilter(FadModelManager.systemType, FadModelManager.systemSymbol);
    var documents = this.fadModel.ObjOccListFilter(FadModelManager.documentType, FadModelManager.documentSymbol);
    
    var belowObjecsArray = [services, gaps, systems, documents];
    var belowObjectsMaxWidth = this.findMaxWidth(belowObjecsArray);
    
    
    //Place up to main object
    
    
    var sourceObjectConnectionY = this.sourceObjectOccurrence.Y() + this.sourceObjectOccurrence.Height() + 300;
    var segmentOne = this.sourceObjectOccurrence.X() + 2 * oneFifth;
    var segmentTwo = this.sourceObjectOccurrence.X() + 2 * oneFifth + Math.floor(5.3 * oneFifth);
    var segmentThree = this.sourceObjectOccurrence.X() + 2 * oneFifth + 2 * Math.floor(5.3 * oneFifth);
    var segmentFour = this.sourceObjectOccurrence.X() + 2 * oneFifth + 3 * Math.floor(5.3 * oneFifth);
    
    
    var inputY = this.updateOutputs();
    var outputY = this.updateInputs();
    
    
    var serviceY = this.arrangeBelow(services, belowObjectsMaxWidth, segmentOne, sourceObjectConnectionY, segmentOne, sourceObjectConnectionY, "FAD_DESIGN_CHOICES")
    var gapY = this.arrangeBelow(gaps, belowObjectsMaxWidth, segmentTwo, sourceObjectConnectionY, segmentTwo, sourceObjectConnectionY, "OPTIMIZATION_POTENTIAL")
    var systemY = this.arrangeBelow(systems, belowObjectsMaxWidth, segmentThree, sourceObjectConnectionY, segmentThree, sourceObjectConnectionY, "RELEVANT_MANG_SYSTEMS")
    var documentY = this.arrangeBelow(documents, belowObjectsMaxWidth, segmentFour, sourceObjectConnectionY, segmentFour, sourceObjectConnectionY, "GUIDELINES_DOCUMENTATION")
    
    var lineStarY = Math.max.apply(null, [serviceY, gapY, systemY, documentY,inputY,outputY]);
    
    var line = this.fadModel.createRoundedRectangle(200, lineStarY + 200, this.sourceObjectOccurrence.X() + this.sourceObjectOccurrence.Width() + 400, 5);
    line.setRoundness(0, 0);
    line.setFillColor(Constants.C_GRAY);
    
    
    var itSystems = this.fadModel.ObjOccListFilter(FadModelManager.itSystemType, FadModelManager.itSystemSymbol);
    var amountDrivers = this.fadModel.ObjOccListFilter(FadModelManager.assumptionType, FadModelManager.assumptionSymbol);
    var relevantProcessInitiatives = this.fadModel.ObjOccListFilter(FadModelManager.taskType, FadModelManager.taskSymbol);
    var businessCapabilities = this.fadModel.ObjOccListFilter(FadModelManager.bussinesCapabilityType, FadModelManager.bussinesCapabilitySymbol);
    var risks = this.fadModel.ObjOccListFilter(FadModelManager.riskType, FadModelManager.riskSymbol)
      .filter(function (occurrence) {
          return occurrence.CxnOccList().some(function (connectionOccurrence) {
              return connectionOccurrence.getDefinition().TypeNum() === FadModelManager.riskConnectionType;
          });
      });
    var committees = this.fadModel.ObjOccListFilter(FadModelManager.committeeType, FadModelManager.committeeSymbol);
    
    var belowLineObjecsArray = [itSystems, amountDrivers, relevantProcessInitiatives, businessCapabilities, committees];
    var belowLineObjectsMaxWidth = this.findMaxWidth(belowLineObjecsArray);
    
    var rowSegmentOne = this.sourceObjectOccurrence.X() - Math.floor(3.25 * oneFifth);
    var rowSegmentSix = this.sourceObjectOccurrence.X() + Math.floor(23.25 * oneFifth);
    
    
    var startY = line.getY() + 200;
    var itSystemY = this.arrangeBelow(itSystems, belowLineObjectsMaxWidth, rowSegmentOne, startY, segmentOne, sourceObjectConnectionY, "IT_SYSTEMS");
    
    var amountDriverY = this.arrangeBelow(amountDrivers, belowLineObjectsMaxWidth, segmentOne, startY, segmentOne, sourceObjectConnectionY, "AMOUNT_DRIVERS");
    var relevantY = this.arrangeBelow(relevantProcessInitiatives, belowLineObjectsMaxWidth, segmentTwo, startY, segmentTwo, sourceObjectConnectionY, "RELEVANT_PROCESS_INITIATIVES");
    var businessY = this.arrangeBelow(businessCapabilities, belowLineObjectsMaxWidth, segmentThree, startY, segmentThree, sourceObjectConnectionY, "BUSINESS_CAPABILITIES");
    var riskY = this.arrangeBelow(risks, belowLineObjectsMaxWidth, segmentFour, startY, segmentFour, sourceObjectConnectionY, "RISKS");
    
    var comitteeY = this.arrangeBelow(committees, belowLineObjectsMaxWidth, rowSegmentSix, startY, segmentFour, sourceObjectConnectionY, "INTENDED_COMMITTEES");
    
    
    var nextRowY = Math.max.apply(null, [itSystemY, amountDriverY, relevantY, businessY, riskY, comitteeY]);
    
    var requirements = this.fadModel.ObjOccListFilter(FadModelManager.requirementType, FadModelManager.requirementSymbol);
    var weakPoints = this.fadModel.ObjOccListFilter(FadModelManager.weakPointType, FadModelManager.weakPointSymbol)
      .filter(function (occurrence) {
          return occurrence.CxnOccList().some(function (connectionOccurrence) {
              return connectionOccurrence.getDefinition().TypeNum() === FadModelManager.weakPointConnectionType;
          });
      });
    var customersTouchingPoints = this.fadModel.ObjOccListFilter(FadModelManager.customerTouchingPointType, FadModelManager.customerTouchingPointSymbol);
    
    
    belowLineObjecsArray = [requirements, weakPoints, customersTouchingPoints];
    belowLineObjectsMaxWidth = this.findMaxWidth(belowLineObjecsArray);
    
    
    var requirementsY = this.arrangeBelow(requirements, belowLineObjectsMaxWidth, segmentOne, nextRowY + 200, segmentOne, sourceObjectConnectionY, "REQUIREMENTS");
    var weakPointsY = this.arrangeBelow(weakPoints, belowLineObjectsMaxWidth, segmentTwo, nextRowY + 200, segmentTwo, sourceObjectConnectionY, "WEAK_POINTS");
    var customersTouchingPointsY = this.arrangeBelow(customersTouchingPoints,belowLineObjectsMaxWidth,segmentThree,nextRowY + 200, segmentThree,sourceObjectConnectionY,"FAD_CUSTOMER_TOUCHING_POINTS")
    
    
    
    
    this.fadModel.ObjOccList().forEach(this.setZOrder(1000));
    this.fadModel.TextOccList().forEach(this.setZOrder(980));
    this.fadModel.getGfxObjects().forEach(function(occurrence){
        if (!BaseDialog.isArisObjectNullOrInvalid(occurrence)) {
            if (occurrence.getZOrder() !== 980)  occurrence.setZOrder(960);
        }
    });
    this.fadModel.CxnOccList().forEach(this.setZOrder(940));
    
    ArisData.Save(Constants.SAVE_NOW);
    
    var isEmpty = this.fadModel.ObjOccList().filter(function(occurrence) {
        return !occurrence.IsEqual(those.sourceObjectOccurrence);
    }).length === 0;
    if (!isEmpty) return true;
    
    var group = this.fadModel.Group();
    if (BaseDialog.isArisObjectNullOrInvalid(group)) return true;
    group.Delete(this.fadModel);
    
    if (BaseDialog.isNullOrEmpty(group.Childs()) && BaseDialog.isNullOrEmpty(group.ModelList()) && BaseDialog.isNullOrEmpty(group.ObjDefList()) ) {
        
        var parentGroup = group.Group();
        if (BaseDialog.isArisObjectNullOrInvalid(parentGroup))  return true;
        parentGroup.Delete(group);
    }
}

FadModelManager.prototype.updateOutputs = function () {
    
    var outputsOccurrences = this.fadModel.ObjOccListFilter(FadModelManager.outputType, FadModelManager.outputSymbol)
      .filter(function (occurrence) {
          return occurrence.CxnOccList().some(function (connectionOccurrence) {
              return connectionOccurrence.getDefinition().TypeNum() === FadModelManager.outputConnectionType;
          });
      });
    var occurrenceWidth = Math.max.apply(Math, outputsOccurrences.map(function (occurrence) {
        return occurrence.Width();
    }));
    var outputX = this.sourceObjectOccurrence.X() + this.sourceObjectOccurrence.Width() + 500;
    var sourceYMiddle = this.sourceObjectOccurrence.Y() + Math.floor(this.sourceObjectOccurrence.Height() / 2);
    var sourceX = this.sourceObjectOccurrence.X() + this.sourceObjectOccurrence.Width();
    var totalHeight = outputsOccurrences.reduce(function (number, occurrenceB) {
        return number + occurrenceB.Height();
    }, 0);
    var centerHeight = Math.floor(totalHeight / 2);
    var half = Math.ceil(outputsOccurrences.length / 2);
    var top = outputsOccurrences.splice(0, half);
    var bottom = outputsOccurrences.splice(-half);
    var topY = sourceYMiddle - centerHeight;
    
    var those = this;
    top.forEach(function (occurrence) {
        occurrence.SetPosition(outputX, topY);
        those.setRightPoints(occurrence, outputX, sourceX, sourceYMiddle);
        topY += occurrence.Height();
        
    });
    
    bottom.forEach(function (occurrence) {
        occurrence.SetPosition(outputX, topY);
        those.setRightPoints(occurrence, outputX, sourceX, sourceYMiddle);
        topY += occurrence.Height();
    });
    
    if (top.length > 0 || bottom.length > 0) {
        this.createDescriptionRectangle(outputX, sourceYMiddle - centerHeight, occurrenceWidth, topY - (sourceYMiddle - centerHeight), "OUTPUTS");
    }
    
    return topY;
}

FadModelManager.prototype.updateInputs = function () {
    
    var outputsOccurrences = this.fadModel.ObjOccListFilter(FadModelManager.inputType, FadModelManager.inputSymbol)
      .filter(function (occurrence) {
          return occurrence.CxnOccList().some(function (connectionOccurrence) {
              return connectionOccurrence.getDefinition().TypeNum() === FadModelManager.inputConnectionType;
          });
      });
    
    var occurrenceWidth = Math.max.apply(Math, outputsOccurrences.map(function (occurrence) {
        return occurrence.Width();
    }));
    var outputX = this.sourceObjectOccurrence.X() - occurrenceWidth - 500;
    var sourceYMiddle = this.sourceObjectOccurrence.Y() + Math.floor(this.sourceObjectOccurrence.Height() / 2);
    var sourceX = this.sourceObjectOccurrence.X();
    var totalHeight = outputsOccurrences.reduce(function (number, occurrenceB) {
        return number + occurrenceB.Height();
    }, 0);
    var centerHeight = Math.floor(totalHeight / 2);
    var half = Math.ceil(outputsOccurrences.length / 2);
    var top = outputsOccurrences.splice(0, half);
    var bottom = outputsOccurrences.splice(-half);
    var topY = sourceYMiddle - centerHeight;
    
    var those = this;
    top.forEach(function (occurrence) {
        occurrence.SetPosition(outputX, topY);
        those.setLeftPoints(occurrence, outputX + occurrence.Width(), sourceX, sourceYMiddle);
        topY += occurrence.Height();
        
    });
    bottom.forEach(function (occurrence) {
        occurrence.SetPosition(outputX, topY);
        those.setLeftPoints(occurrence, outputX + occurrence.Width(), sourceX, sourceYMiddle);
        topY += occurrence.Height();
    });
    
    if (top.length > 0 || bottom.length > 0) {
        this.createDescriptionRectangle(outputX, sourceYMiddle - centerHeight, occurrenceWidth, topY - (sourceYMiddle - centerHeight), "INPUTS");
    }
    return topY;
    
}

FadModelManager.prototype.setRightPoints = function (occurrence, outputX, sourceX, sourceYMiddle) {
    
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

FadModelManager.prototype.setLeftPoints = function (occurrence, outputX, sourceX, sourceYMiddle) {
    
    var middleX = Math.floor((sourceX - outputX) / 2);
    var points = [
        
        new Packages.java.awt.Point(outputX, occurrence.Y() + Math.floor(occurrence.Height() / 2)),
        new Packages.java.awt.Point(outputX + middleX, occurrence.Y() + Math.floor(occurrence.Height() / 2)),
        new Packages.java.awt.Point(outputX + middleX, sourceYMiddle),
        new Packages.java.awt.Point(sourceX, sourceYMiddle)
    
    ];
    
    occurrence.CxnOccList().forEach(function (connection) {
        connection.setPoints(points);
    });
}

FadModelManager.prototype.findMaxWidth = function (input) {
    
    var max = input.map(function (items) {
        // Map occurreence to array of its width
        return items.map(function (item) {
            return item.Width();
        });
    }).reduce(function (array, item) {
        return array.concat(item);
    }, []).reduce(function (max, item) {
        return Math.max(max, item);
    }, -1);
    
    return max;
}

FadModelManager.prototype.findMaxHeight = function (input) {
    
    var max = input.map(function (items) {
        // Map occurreence to array of its width
        return items.map(function (item) {
            return item.Height();
        });
    }).reduce(function (array, item) {
        return array.concat(item);
    }, []).reduce(function (max, item) {
        return Math.max(max, item);
    }, -1);
    
    return max;
}

FadModelManager.prototype.arrangeBelow = function (objects, maxWidth, startX, startY, endX, endY, description) {
    
    var y = startY;
    var x = startX - Math.floor(maxWidth / 2);
    objects.forEach(function (occurrence) {
        
        occurrence.SetPosition(x, y);
        y += occurrence.Height();
        
        var points = [
            new Packages.java.awt.Point(startX, occurrence.Y()),
            new Packages.java.awt.Point(startX, endY - 200),
            new Packages.java.awt.Point(endX, endY - 200),
            new Packages.java.awt.Point(endX, endY),
        
        ];
        
        occurrence.CxnOccList().forEach(function (connection) {
            connection.setPoints(points);
        });
        
    });
    
    if (objects.length > 0) {
        var rectangle = this.createDescriptionRectangle(x, startY, maxWidth, y - startY, description);
        return rectangle.getY() + rectangle.getHeight();
    }
    return startY;
}

FadModelManager.prototype.arrangeAbove = function (objects, maxWidth, startX, connectionY, description) {
    
    var y = connectionY;
    var x = startX - Math.floor(maxWidth / 2);
    
    objects.forEach(function (occurrence) {
        
        occurrence.SetPosition(x, y);
        y -= occurrence.Height();
        
        var points = [
            new Packages.java.awt.Point(startX, occurrence.Y() + occurrence.Height()),
            new Packages.java.awt.Point(startX, connectionY)
        ];
        occurrence.CxnOccList().forEach(function (connection) {
            connection.setPoints(points);
        });
        
    });
    
    if (description !== null && objects.length > 0) {
        this.createDescriptionRectangle(x, y + objects[0].Height(), maxWidth, connectionY - y - Math.floor(objects[0].Height() / 2) + 100, description);
    }
}

FadModelManager.prototype.findFontStyle = function (fontName, locale) {
    
    var fonts = ArisData.getActiveDatabase().FontStyleList().filter(function (fontStyle) {
        return fontStyle.Name(locale).localeCompare(fontName) === 0;
    });
    
    if (!BaseDialog.isNullOrEmpty(fonts)) return fonts[0];
    return null;
}

FadModelManager.prototype.createDescriptionRectangle = function (x, y, width, height, description) {
    
    var database = ArisData.getActiveDatabase();
    var strings = BaseDialog.getAllStringFromStringTable(description);
    var fontStyle = this.findFontStyle("CockpitTitleText", this.locale);
    
    if (BaseDialog.isArisObjectNullOrInvalid(database)) return null;
    
    var textDefName = this.fadModel.Name(this.locale) + description;
    var textDefinition = database.CreateTextDef(textDefName, this.locale);
    
    
    strings.forEach(function (pair) {
        textDefinition.Attribute(Constants.AT_NAME, pair[0]).setValue(pair[1]);
        
    });
    
    var rectangle = this.fadModel.createRoundedRectangle(x - 100, y - 100, 200 + width, 200 + height);
    rectangle.setRoundness(0, 0);
    rectangle.setFillColor(Constants.C_WHITE);
    rectangle.setPenStyle(Constants.PS_DOT);
    rectangle.setZOrder(0);
    
    
    var freeText = this.fadModel.CreateTextOcc(x - 50, y - 50, textDefinition);
    if (!BaseDialog.isNullOrEmpty(fontStyle)) {
        freeText.AttrOccList().forEach(function (attr) {
            attr.setFontStyleSheet(fontStyle);
        });
    }
    return rectangle;
}

FadModelManager.prototype.setZOrder = function (zOrder) {
    return function (occurrence) {
        if (!BaseDialog.isArisObjectNullOrInvalid(occurrence)) occurrence.setZOrder(zOrder);
    };
}

FadModelManager.prototype.placeProcessPurpose = function () {
    
    
    
    var database = ArisData.getActiveDatabase();
    var fontStyle = this.findFontStyle("CockpitTitleText", this.locale);
    
    var attributeOccurrence = this.sourceObjectOccurrence.AttrOcc(OBJECT_PROCESS_PURPOSE_ATTRIBUTE);
    attributeOccurrence.Create(Constants.ATTROCC_PORT_FREE,fontStyle);
    
    
    var titleTextDefName = this.fadModel.Name(this.locale) + "GNA_PROCESS_PURPOSE_TEXT_TITLE";
    var titleTextDef = database.CreateTextDef(titleTextDefName, this.locale);
    
    
    var stringTableTitleText = BaseDialog.getAllStringFromStringTable("GNA_PROCESS_PURPOSE_TEXT_TITLE");
    stringTableTitleText.forEach(function (pair) {
        titleTextDef.Attribute(Constants.AT_NAME, pair[0]).setValue(pair[1]);
        
    });
    
    var titleFreeText = this.fadModel.CreateTextOcc(this.sourceObjectOccurrence.X(), this.sourceObjectOccurrence.Y() - 400, titleTextDef);
    
    if (!BaseDialog.isNullOrEmpty(fontStyle)) {
        titleFreeText.AttrOccList().forEach(function (attr) {
            attr.setFontStyleSheet(fontStyle);
        });
    }
    
    attributeOccurrence.SetPortOptions(Constants.ATTROCC_PORT_FREE, Constants.ATTROCC_NAME);
    attributeOccurrence.setAlignment(Constants.ATTROCC_ALIGN_LEFT);
    attributeOccurrence.SetOffset(0, -400);
    attributeOccurrence.setFontStyleSheet(this.findFontStyle("_Object: Standard Attribute Placement", this.locale));
    
    var options = attributeOccurrence.GetPortOptions();
    var height = 400;
    var x = this.sourceObjectOccurrence.X();
    var y = this.sourceObjectOccurrence.Y() - height - 200;
    var width = this.sourceObjectOccurrence.Width();
    var rectangle = this.fadModel.createRoundedRectangle(x, y, width, height+150);
    
    attributeOccurrence.setTextBoxSize(width, height);
    options[1] = options[1] & ~(Constants.ATTROCC_NAME);
    attributeOccurrence.SetPortOptions(options[0], options[1])
    
    rectangle.setRoundness(0, 0);
    rectangle.setFillColor(Constants.C_WHITE);
    rectangle.setPenStyle(Constants.PS_NULL);
    
    
    titleFreeText.SetPosition(x, rectangle.getY()+50);
    
    var line = this.fadModel.createRoundedRectangle(this.sourceObjectOccurrence.X(), rectangle.getY() + 75, this.sourceObjectOccurrence.Width(), 5);
    line.setRoundness(0, 0);
    line.setFillColor(Constants.C_GRAY);
    line.setZOrder(980);
    
    
    return rectangle.getY();
    
}
