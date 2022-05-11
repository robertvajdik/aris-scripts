function PRP_Helper() {

}



PRP_Helper.getObjectConnectionHierarchy = function (object, kind, connectionType) {


    var possibleConnections;
    var possibleCandidates;
    var flowChartModels = PRP_Helper.getSpecificModels(object, Constants.MT_EEPC);
    if (flowChartModels.length > 0) {

        if (kind === PRP_Constants.SUCCESSOR) {
            possibleConnections = object.CxnList(Constants.EDGES_OUT, flowChartModels).filter(function (connection) {
                return connection.TypeNum() === connectionType && connection.TargetObjDef().
                    TypeNum() === Constants.OT_FUNC;
            });
            if (possibleConnections.length === 0) return null;
            possibleCandidates = possibleConnections.map(function (connection) {
                return connection.TargetObjDef();
            }).filter(function (objectDefinition) {
                var occurrencesInModels = objectDefinition.OccList(flowChartModels);
                if (occurrencesInModels.length > 0) {
                    return occurrencesInModels.some(function (occurrence) {
                        return occurrence.SymbolNum() === Constants.ST_PRCS_IF;
                    });
                }
                return false;
            });
        } else {
            possibleConnections = object.CxnList(Constants.EDGES_IN, flowChartModels).filter(function (connection) {
                return connection.TypeNum() === connectionType && connection.SourceObjDef().
                    TypeNum() === Constants.OT_FUNC;
            });
            if (possibleConnections.length === 0) return null;
            possibleCandidates = possibleConnections.map(function (connection) {
                return connection.SourceObjDef();
            }).filter(function (objectDefinition) {
                var occurrencesInModels = objectDefinition.OccList(flowChartModels);
                if (occurrencesInModels.length > 0) {
                    return occurrencesInModels.some(function (occurrence) {
                        return occurrence.SymbolNum() === Constants.ST_PRCS_IF;
                    });
                }
                return false;
            });
        }

        return possibleCandidates.length > 0 ? possibleCandidates[0] : null;
    }

    var bpmnModels = PRP_Helper.getSpecificModels(object, Constants.MT_BPMN_PROCESS_DIAGRAM);
    if (bpmnModels.length > 0) {
        if (kind === PRP_Constants.SUCCESSOR) {
            possibleConnections = object.CxnList(Constants.EDGES_OUT, flowChartModels).filter(function (connection) {
                return connection.TypeNum() === connectionType && connection.TargetObjDef().
                    TypeNum() === Constants.OT_FUNC;
            });
            if (possibleConnections.length === 0) return null;
            possibleCandidates = possibleConnections.map(function (connection) {
                return connection.TargetObjDef();
            }).filter(function (objectDefinition) {
                var occurrencesInModels = objectDefinition.OccList(flowChartModels);
                if (occurrencesInModels.length > 0) {
                    return occurrencesInModels.some(function (occurrence) {
                        return occurrence.SymbolNum() === Constants.ST_BPMN_SUBPROCESS;
                    });
                }
                return false;
            });
        } else {
            possibleConnections = object.CxnList(Constants.EDGES_IN, flowChartModels).filter(function (connection) {
                return connection.TypeNum() === connectionType && connection.SourceObjDef().
                    TypeNum() === Constants.OT_FUNC;
            });
            if (possibleConnections.length === 0) return null;
            possibleCandidates = possibleConnections.map(function (connection) {
                return connection.SourceObjDef();
            }).filter(function (objectDefinition) {
                var occurrencesInModels = objectDefinition.OccList(flowChartModels);
                if (occurrencesInModels.length > 0) {
                    return occurrencesInModels.some(function (occurrence) {
                        return occurrence.SymbolNum() === Constants.ST_BPMN_SUBPROCESS;
                    });
                }
                return false;
            });
        }

        return possibleCandidates.length > 0 ? possibleCandidates[0] : null;

    }


    var eBpmnModels = PRP_Helper.getSpecificModels(object, Constants.MT_ENTERPRISE_BPMN_PROCESS);
    if (eBpmnModels.length > 0) {
        if (kind === PRP_Constants.SUCCESSOR) {
            possibleConnections = object.CxnList(Constants.EDGES_OUT, flowChartModels).filter(function (connection) {
                return connection.TypeNum() === connectionType && connection.TargetObjDef().
                    TypeNum() === Constants.OT_FUNC;
            });
            if (possibleConnections.length === 0) return null;
            possibleCandidates = possibleConnections.map(function (connection) {
                return connection.TargetObjDef();
            }).filter(function (objectDefinition) {
                var occurrencesInModels = objectDefinition.OccList(flowChartModels);
                if (occurrencesInModels.length > 0) {
                    return occurrencesInModels.some(function (occurrence) {
                        return occurrence.SymbolNum() === Constants.ST_BPMN_SUBPROCESS;
                    });
                }
                return false;
            });
        } else {
            possibleConnections = object.CxnList(Constants.EDGES_IN, flowChartModels).filter(function (connection) {
                return connection.TypeNum() === connectionType && connection.SourceObjDef().
                    TypeNum() === Constants.OT_FUNC;
            });
            if (possibleConnections.length === 0) return null;
            possibleCandidates = possibleConnections.map(function (connection) {
                return connection.SourceObjDef();
            }).filter(function (objectDefinition) {
                var occurrencesInModels = objectDefinition.OccList(flowChartModels);
                if (occurrencesInModels.length > 0) {
                    return occurrencesInModels.some(function (occurrence) {
                        return occurrence.SymbolNum() === Constants.ST_BPMN_SUBPROCESS;
                    });
                }
                return false;
            });
        }

        return possibleCandidates.length > 0 ? possibleCandidates[0] : null;

    }

    return null;


}

PRP_Helper.getProcessOwner = function (inputObject,locale) {

    if (BaseDialog.isArisObjectNullOrInvalid(inputObject)) return "";

    var fadModels =  inputObject.AssignedModels(PRP_Constants.FAD_MODEL_TYPE);
    if (fadModels.length > 0) {
       var fadModel = fadModels[0];
       var objDefinitions = fadModel.ObjDefList().filter(function(objDef) {return objDef.IsEqual(inputObject)})
           .filter(function(objDef) {return objDef.CxnListFilter(Constants.EDGES_INOUT,PRP_Constants.PROCESS_OWNER_CONNECTION_TYPE).length > 0});

       if (objDefinitions.length === 1) {
           var role = objDefinitions[0].CxnListFilter(Constants.EDGES_INOUT,PRP_Constants.PROCESS_OWNER_CONNECTION_TYPE)[0];
           return BaseDialog.getMaintainedObjectName(role.SourceObjDef(),locale);
       }
       if (objDefinitions.length > 1) {

           return PRP_Constants.MULTIPLE_PROCESS_OWNERS_ERROR_MESSAGE;
       }
   }

   var processOwnerAttribute = inputObject.Attribute(PRP_Constants.PROCESS_OWNER_ATTRIBUTE,locale);
    if (processOwnerAttribute.IsMaintained()) {
      return processOwnerAttribute.getValue();
    }

    // pokud vice najit vzdy pouze jeden jinak error
    // Test na EPC a BPMN Ent
    var models = inputObject.AssignedModels(PRP_Constants.EPC_MODEL_TYPE);
    var processOwner;
    if (models.length > 0){

        processOwner = this.checkAttributeOccurrence(models,locale);
        if (processOwner !== null) return processOwner;
    }

    models = inputObject.AssignedModels(PRP_Constants.BPMN_COLLABORATION_DIAGRAM_MODEL_TYPE);
    if (models.length > 0){

        processOwner = this.checkAttributeOccurrence(models,locale);
        if (processOwner !== null) return processOwner;
    }

    models = inputObject.AssignedModels(PRP_Constants.BPMN_PROCESS_DIAGRAM_MODEL_TYPE);
    if (models.length > 0){

        processOwner = this.checkAttributeOccurrence(models,locale);
        if (processOwner !== null) return processOwner;
    }


   return "";
}

PRP_Helper.getSpecificModels = function (object, modelType) {
    return object.OccList().filter(function (occurrence) {
        return occurrence.Model().TypeNum() === modelType;
    }).map(function (occurrence) {
        return occurrence.Model();
    });
}

PRP_Helper.hashCode = function (string) {
    return String(Packages.com.google.common.hash.Hashing.sha256().
        hashString(string, Packages.java.nio.charset.StandardCharsets.UTF_8).toString());
}
PRP_Helper.addChildIntoTree = function (treeElement, name, parent, index) {
    return treeElement.addChild(parent, name, index++);
}
PRP_Helper.onlyFolder = function (item) {
    return item.isFolder;
}
PRP_Helper.addSubItem = function (treeElement, parent, index) {
    return function (subItem) {
        subItem.treeIndex = index;
        PRP_Helper.addChildIntoTree(treeElement, subItem.name, parent, index);
    }
}
PRP_Helper.serialize = function serialize(obj) {
    if (Array.isArray(obj)) {
        return JSON.stringify(obj.map(function (i) {
            return PRP_Helper.serialize(i);
        }));
    } else if (typeof obj === 'object' && obj !== null) {
        return Object.keys(obj).sort().filter(function (k) {
            return !k.startsWith("object") && !k.startsWith("children");
        }).map(function (k) {
            return k + ':' + PRP_Helper.serialize(obj[k]);
        }).join('|');
    }

    return obj;
}
PRP_Helper.loadCompanies = function (modelGUID, locale) {

    var model = ArisData.getActiveDatabase().FindGUID(modelGUID, Constants.CID_MODEL);
    if (BaseDialog.isArisObjectNullOrInvalid(model)) return [];

    var orgUnitSymbols = ArisData.ActiveFilter().Symbols(model.TypeNum(), Constants.OT_ORG_UNIT);
    var locationSymbols = ArisData.ActiveFilter().Symbols(model.TypeNum(), Constants.OT_LOC);

    var brands = model.ObjOccListFilter(-1, PRP_Constants.BRAND_SYMBOL_STD);
    brands = ArisData.sort(brands, Constants.AT_NAME, locale);
    if (brands.length === 0) return [];
    brands = brands.filter(function (brand) {
        return brand.getConnectedObjOccs(orgUnitSymbols, Constants.EDGES_OUT).length > 0;
    })

    var structure = [];
    brands.forEach(function (brand) {
        var brandName = String(BaseDialog.getMaintainedObjectName(brand.ObjDef(), locale)).replace(/\n/g, " ")
        var item = new Item(brandName, true, brand.ObjDef(), null);
        var children = brand.getConnectedObjOccs(orgUnitSymbols, Constants.EDGES_OUT).map(function (occurrence) {
            var companyName = String(BaseDialog.getMaintainedObjectName(occurrence.ObjDef(), locale)).
                replace(/\n/g, " ");
            var company = new Item(companyName, true, occurrence.ObjDef(), item);
            var plants = occurrence.getConnectedObjOccs(locationSymbols, Constants.EDGES_OUT).
                map(function (locationOccurrence) {
                    var locationName = String(BaseDialog.getMaintainedObjectName(locationOccurrence.ObjDef(), locale)).
                        replace(/\n/g, " ");
                    return new Item(locationName, false, locationOccurrence.ObjDef(), company);
                })
            plants.forEach(function (plant) {
                company.addChild(plant);
            })
            return company;
        })
        children.forEach(function (child) {
            item.addChild(child);
        });
        structure.push(item);
    });
    return structure;

}
PRP_Constants.nullItemHash = PRP_Helper.hashCode(PRP_Helper.serialize({
    inSystem: null,
    outSystem: null,
    dataObjects: []
}));

PRP_Helper.checkAttributeOccurrence = function(models,locale) {

    var modelsWithAttribute = models.filter(function(model) {

        return model.Attribute(PRP_Constants.PROCESS_OWNER_ATTRIBUTE,locale).IsMaintained();
    });

    if (modelsWithAttribute.length === 1 ) {
        return modelsWithAttribute[0].Attribute(PRP_Constants.PROCESS_OWNER_ATTRIBUTE,locale).getValue();
    }
    if (modelsWithAttribute.length > 1) {
        return PRP_Constants.MULTIPLE_PROCESS_OWNERS_ERROR_MESSAGE;
    }

    return null;
}