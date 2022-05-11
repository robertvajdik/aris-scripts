function OverviewSelectPage(locationPage, dataObjectPage, itSystemPage, documentPage, assignedItems, pageNumber, locale, dialog) {

    this.pageNumber = pageNumber;
    this.locale = locale;
    this.dialog = dialog;
    this.locationPage = locationPage;
    this.dataObjectPage = dataObjectPage;
    this.itSystemPage = itSystemPage;
    this.documentPage = documentPage;
    this.assignedItems = this.createAssignItems(assignedItems);
    this.oldAssignedItems = this.createAssignItems(assignedItems);


}

OverviewSelectPage.prototype = Object.create(BaseDialog.prototype);
OverviewSelectPage.prototype.constructor = OverviewSelectPage;

OverviewSelectPage.prototype.createPage = function () {

    var height = Math.floor(1.05 * (BaseDialog.templateHeight - 5) / 3.0);
    var width = Math.floor(1.25 * (BaseDialog.templateWidth - 5) / 3.0);

    var page = Dialogs.createNewDialogTemplate(BaseDialog.templateWidth, BaseDialog.templateHeight,
        BaseDialog.getStringFromStringTable("OVERVIEW_PAGE_TITLE", this.locale));

    page.GroupBox(5, 5, width - 5, height - 5, BaseDialog.getStringFromStringTable("LOCATION_GROUP_TITLE", this.locale),
        "OVS_LOCATION_GROUP");

    page.Table(7, 12, width - 9, height - 14, ["X", "Location", "..."],
        [Constants.TABLECOLUMN_BOOL_EDIT, Constants.TABLECOLUMN_SINGLELINE, Constants.TABLECOLUMN_SINGLELINE],
        [10, 89, 1], "OSP_LOCATION_TABLE", Constants.TABLE_STYLE_DEFAULT);


    page.GroupBox(5 + width + 5, 5, 2 * (width - 5), height - 5,
        BaseDialog.getStringFromStringTable("DATA_OBJECT_GROUP_TITLE", this.locale),
        "OVS_DATA_OBJECT_GROUP");
    page.Table(7 + width + 5, 12, 2 * (width - 5) - 6, height - 14, ["Data object", "Current", "Planned", "..."],
        [Constants.TABLECOLUMN_SINGLELINE, Constants.TABLECOLUMN_BOOL_EDIT, Constants.TABLECOLUMN_BOOL_EDIT, Constants.TABLECOLUMN_SINGLELINE],
        [79, 10, 10, 1], "OSP_DATA_OBJECT_TABLE", Constants.TABLE_STYLE_DEFAULT);


    page.GroupBox(5, 5 + height, 2 * width, height - 5,
        BaseDialog.getStringFromStringTable("OVS_IT_SYSTEMS_GROUP_TITLE", this.locale), "OVS_IT_SYSTEMS_GROUP");

    page.Table(8, 12 + height, (2 * width) - 6, height - 14,
        [
            BaseDialog.getStringFromStringTable("IT_SYSTEM_INFO_TABLE_COLUMN_NAME", this.locale),
            BaseDialog.getStringFromStringTable("IT_SYSTEM_INFO_TABLE_COLUMN_IN_CURRENT", this.locale),
            BaseDialog.getStringFromStringTable("IT_SYSTEM_INFO_TABLE_COLUMN_IN_PLANNED", this.locale),
            BaseDialog.getStringFromStringTable("IT_SYSTEM_INFO_TABLE_COLUMN_OUT_CURRENT", this.locale),
            BaseDialog.getStringFromStringTable("IT_SYSTEM_INFO_TABLE_COLUMN_OUT_PLANNED", this.locale),
            "..."
        ],
        [
            Constants.TABLECOLUMN_SINGLELINE,
            Constants.TABLECOLUMN_BOOL_EDIT,
            Constants.TABLECOLUMN_BOOL_EDIT,
            Constants.TABLECOLUMN_BOOL_EDIT,
            Constants.TABLECOLUMN_BOOL_EDIT,
            Constants.TABLECOLUMN_SINGLELINE
        ],
        [39, 15, 15, 15, 15, 1],
        "OSP_IT_SYSTEM_TABLE",
        Constants.TABLE_STYLE_DEFAULT);

    page.GroupBox(10 + (2 * width), 5 + height, width - 5, height - 5,
        BaseDialog.getStringFromStringTable("OVS_IDDS_GROUP_TITLE", this.locale), "OVS_IDDS_GROUP");


    page.Table(14 + (2 * width), 12 + height, width - 11, height - 14, ["IDD", "Current", "Planned", "..."],
        [Constants.TABLECOLUMN_SINGLELINE, Constants.TABLECOLUMN_BOOL_EDIT, Constants.TABLECOLUMN_BOOL_EDIT, Constants.TABLECOLUMN_SINGLELINE],
        [59, 20, 20, 1], "OSP_IDD_OBJECT_TABLE", Constants.TABLE_STYLE_DEFAULT)


    page.GroupBox(5, 2 * (5 + height), 3 * width, height - 5,
        BaseDialog.getStringFromStringTable("OVS_OVERVIEW_GROUP_TITLE", this.locale), "OVS_OVERVIEW_GROUP");

    page.PushButton(10, 2 * (5 + height) + 4, BaseDialog.pushButtonWidth, BaseDialog.pushButtoHeight,
        BaseDialog.getStringFromStringTable("ADD_BUTTON_TEXT", this.locale), "OVS_ADD_PUSH_BUTTON"
    );
    page.PushButton(10 + BaseDialog.pushButtonWidth + 5, 2 * (5 + height) + 4, BaseDialog.pushButtonWidth, BaseDialog.pushButtoHeight,
        BaseDialog.getStringFromStringTable("DELETE_BUTTON_TEXT", this.locale), "OVS_REMOVE_PUSH_BUTTON"
    );


    page.Table(7, 2 * (5 + height) + BaseDialog.pushButtoHeight + 8, (3 * width) - 7, height - 16 - BaseDialog.pushButtoHeight,
        [
            BaseDialog.getStringFromStringTable("IT_SYSTEM_INFO_TABLE_COLUMN_LOCATION", this.locale),
            BaseDialog.getStringFromStringTable("IT_SYSTEM_INFO_TABLE_COLUMN_IN_CURRENT", this.locale),
            BaseDialog.getStringFromStringTable("IT_SYSTEM_INFO_TABLE_COLUMN_IN_PLANNED", this.locale),
            BaseDialog.getStringFromStringTable("IT_SYSTEM_INFO_TABLE_COLUMN_DOCUMENT_CURRENT", this.locale),
            BaseDialog.getStringFromStringTable("IT_SYSTEM_INFO_TABLE_COLUMN_DATA_CURRENT", this.locale),
            BaseDialog.getStringFromStringTable("IT_SYSTEM_INFO_TABLE_COLUMN_DATA_PLANNED", this.locale),
            BaseDialog.getStringFromStringTable("IT_SYSTEM_INFO_TABLE_COLUMN_DOCUMENT_PLANNED", this.locale),
            BaseDialog.getStringFromStringTable("IT_SYSTEM_INFO_TABLE_COLUMN_OUT_CURRENT", this.locale),
            BaseDialog.getStringFromStringTable("IT_SYSTEM_INFO_TABLE_COLUMN_OUT_PLANNED", this.locale),
            "hash"
        ],
        [
            Constants.TABLECOLUMN_MULTILINE,
            Constants.TABLECOLUMN_MULTILINE,
            Constants.TABLECOLUMN_MULTILINE,
            Constants.TABLECOLUMN_MULTILINE,
            Constants.TABLECOLUMN_MULTILINE,
            Constants.TABLECOLUMN_MULTILINE,
            Constants.TABLECOLUMN_MULTILINE,
            Constants.TABLECOLUMN_MULTILINE,
            Constants.TABLECOLUMN_MULTILINE,
            Constants.TABLECOLUMN_SINGLELINE

        ],
        [11, 11, 11, 11, 11, 11, 11,11,11, 1],
        "OSP_OVERVIEW_TABLE",
        Constants.TABLE_STYLE_DEFAULT | Constants.TABLE_STYLE_HEIGHT_2X);


    return page;
}
OverviewSelectPage.prototype.init = function () {

    var locationTable = this.dialog.getPageElement(this.pageNumber, "OSP_LOCATION_TABLE");
    var locationItems = this.locationPage.assignedItems.map(function (item) {
        var name = item.parent !== null ? item.parent.name + " " + item.name : item.name;
        return [false, name, item.guid];
    })
    if (locationTable.getItems().length > 0) {
        var allLocations = locationTable.getItems().concat(locationItems);
        locationItems = allLocations.reduce(function (array, item) {
            var isIn = array.some(function (subItem) {
                return item[1].localeCompare(subItem[1]) === 0;
            });
            if (!isIn) array.push(item);

            return array;
        }, []);
    }

    locationTable.setItems(locationItems);

    var dataTable = this.dialog.getPageElement(this.pageNumber, "OSP_DATA_OBJECT_TABLE");
    var dataItems = this.dataObjectPage.assignedItems.map(function (item) {
        return [item.name, false, false, item.guid];
    });
    if (dataTable.getItems().length > 0) {

        var allDataItems = dataTable.getItems().concat(dataItems);

        dataItems = allDataItems.reduce(function (array, item) {
            var isIn = array.some(function (subItem) {
                return item[3].localeCompare(subItem[3]) === 0;
            });
            if (!isIn) array.push(item);

            return array;
        }, []);

    }
    dataTable.setItems(dataItems);

    var itSystemsTable = this.dialog.getPageElement(this.pageNumber, "OSP_IT_SYSTEM_TABLE");
    var itSystemsItems = this.itSystemPage.assignedItems.map(function (item) {
        return [item.name, false, false, false, false, item.guid];
    });
    if (itSystemsTable.getItems().length > 0) {

        var allItSystems = itSystemsTable.getItems().concat(itSystemsItems);

        itSystemsItems = allItSystems.reduce(function (array, item) {
            var isIn = array.some(function (subItem) {
                return item[5].localeCompare(subItem[5]) === 0;
            });
            if (!isIn) array.push(item);

            return array;
        }, []);

    }
    itSystemsTable.setItems(itSystemsItems);

    var documentTable = this.dialog.getPageElement(this.pageNumber, "OSP_IDD_OBJECT_TABLE");
    var documentItems = this.documentPage.assignedItems.map(function (item) {
        return [item.name, false, false, item.guid];
    });
    if (documentTable.getItems().length > 0) {

        var allDocumentItems = documentTable.getItems().concat(dataItems);

        documentItems = allDocumentItems.reduce(function (array, item) {
            var isIn = array.some(function (subItem) {
                return item[3].localeCompare(subItem[3]) === 0;
            });
            if (!isIn) array.push(item);

            return array;
        }, []);

    }
    documentTable.setItems(documentItems);

    if (this.assignedItems.length > 0) {
        var overviewTable = this.dialog.getPageElement(this.pageNumber, "OSP_OVERVIEW_TABLE");
        overviewTable.setItems(this.mapAssignedItems());
    }
}

//Helpers functions
OverviewSelectPage.prototype.checkValidCombinations = function () {
    var locationTable = this.dialog.getPageElement(this.pageNumber, "OSP_LOCATION_TABLE");
    var itSystemsTable = this.dialog.getPageElement(this.pageNumber, "OSP_IT_SYSTEM_TABLE");
    var documentTable = this.dialog.getPageElement(this.pageNumber, "OSP_IDD_OBJECT_TABLE");

    var selectedLocations = locationTable.getItems().filter(function (item) {
        return String(item[0]) === '1';
    });

    var inCurrentSystems = itSystemsTable.getItems().filter(function (item) {
        return String(item[1]) === '1';
    });
    var inPlannedSystems = itSystemsTable.getItems().filter(function (item) {
        return String(item[2]) === '1';
    });
    var outCurrentSystems = itSystemsTable.getItems().filter(function (item) {
        return String(item[3]) === '1';
    });
    var outPlannedSystems = itSystemsTable.getItems().filter(function (item) {
        return String(item[4]) === '1';
    });

    var currentDocuments = documentTable.getItems().filter(function (item) {
        return String(item[1]) === '1';
    });
    var plannedDocuments = documentTable.getItems().filter(function (item) {
        return String(item[2]) === '1';
    });

    var maxDocumentCount = Math.max.apply(null, [currentDocuments.length, plannedDocuments.length]);
    var maxCount = Math.max.apply(null,
        [inCurrentSystems.length, outCurrentSystems.length, inPlannedSystems.length, outPlannedSystems.length]);

    return maxDocumentCount <= 1 && maxCount <= 1 && selectedLocations.length > 0;
}
OverviewSelectPage.prototype.findCurrentItem = function (items, filter) {
    var foundItems = items.filter(function (item) {
        if (typeof item.guid === "number") return item.guid === filter;
        return item.guid.indexOf(filter) === 0;
    });
    return foundItems.length === 1 ? foundItems[0] : null;
}
OverviewSelectPage.prototype.mapAssignedItems = function () {
    var those = this;
    var result = [];

    this.assignedItems.forEach(function (item) {

        var maxDataObjectsCount = Math.max.apply(null, [item.currentDataObjects.length, item.plannedDataObjects.length]);
        var locationName = those.getItemName(item.location);
        var outCurrentSystemName = item.outCurrentSystem !== null ? item.outCurrentSystem.name : "";
        var outPlannedSystemName = item.outPlannedSystem !== null ? item.outPlannedSystem.name : "";
        var inCurrentSystemName = item.inCurrentSystem !== null ? item.inCurrentSystem.name : "";
        var inPlannedSystemName = item.inPlannedSystem !== null ? item.inPlannedSystem.name : "";
        var currentDocument = item.currentDocument !== null ? item.currentDocument.name : "";
        var plannedDocument = item.plannedDocument !== null ? item.plannedDocument.name : "";
        var hash = item.hash;
        if (maxDataObjectsCount > 0) {
            for (var position = 0; position < maxDataObjectsCount; position++) {
                var currentDataObjectName = item.currentDataObjects.length < maxDataObjectsCount ? "" : item.currentDataObjects[position].name;
                var plannedDataObjectName = item.plannedDataObjects.length < maxDataObjectsCount ? "" : item.plannedDataObjects[position].name;

                result.push(
                    [locationName,
                        inCurrentSystemName, inPlannedSystemName,currentDocument, currentDataObjectName, plannedDataObjectName, plannedDocument, outCurrentSystemName, outPlannedSystemName, hash]);
            }
        }
        else {
            result.push(
                [locationName, inCurrentSystemName, inPlannedSystemName,currentDocument, "", "", plannedDocument, outCurrentSystemName, outPlannedSystemName, hash]);
        }
    })
    result.sort(function (itemA, itemB) {
        return itemA[0] - itemB[0];
    })

    return result;
}
OverviewSelectPage.prototype.getItemName = function (item) {

    if (item === null || typeof item === "undefined") return "";

    if (item.parent !== null && typeof item.parent !== 'undefined') return item.parent.name + " " + item.name;
    return item.name;
}
OverviewSelectPage.prototype.createAssignItems = function (input) {
    return input.reduce(function (array, object) {

        for (var position = 0; position < object.current.locations.length; position++) {
            var assignObject = {};

            assignObject.location = object.current.locations[position];
            assignObject.inCurrentSystem = object.current.inSystem;
            assignObject.outCurrentSystem = object.current.outSystem;
            assignObject.inPlannedSystem = object.planned.inSystem;
            assignObject.outPlannedSystem = object.planned.outSystem;
            assignObject.currentDataObjects = object.current.dataObjects;
            assignObject.plannedDataObjects = object.planned.dataObjects;
            assignObject.currentDocument = object.current.document;
            assignObject.plannedDocument = object.planned.document;


            assignObject.hash = PRP_Helper.hashCode(PRP_Helper.serialize(assignObject))

            array.push(assignObject);

        }
        return array;

    }, []);
}
OverviewSelectPage.prototype.isChanged = function () {

    if (this.oldAssignedItems.length !== this.assignedItems.length) return true;
    var those = this;
    return this.oldAssignedItems.every(function (item) {
        return !those.assignedItems.some(function (subItem) {
            return item.hash.startsWith(subItem.hash);
        });
    }) && this.assignedItems.length > 0;

}
//Events
OverviewSelectPage.prototype.addButtonPressEvent = function () {

    var locationTable = this.dialog.getPageElement(this.pageNumber, "OSP_LOCATION_TABLE");
    var dataTable = this.dialog.getPageElement(this.pageNumber, "OSP_DATA_OBJECT_TABLE");
    var itSystemsTable = this.dialog.getPageElement(this.pageNumber, "OSP_IT_SYSTEM_TABLE");
    var overviewTable = this.dialog.getPageElement(this.pageNumber, "OSP_OVERVIEW_TABLE");
    var documentTable = this.dialog.getPageElement(this.pageNumber, "OSP_IDD_OBJECT_TABLE");

    var selectedLocations = locationTable.getItems().filter(function (item) {
        return String(item[0]) === '1';
    });
    var currentDataObjects = dataTable.getItems().filter(function (item) {
        return String(item[1]) === '1';
    });
    var plannedDataObjects = dataTable.getItems().filter(function (item) {
        return String(item[2]) === '1';
    });
    var inCurrentSystems = itSystemsTable.getItems().filter(function (item) {
        return String(item[1]) === '1';
    });
    var inPlannedSystems = itSystemsTable.getItems().filter(function (item) {
        return String(item[2]) === '1';
    });
    var outCurrentSystems = itSystemsTable.getItems().filter(function (item) {
        return String(item[3]) === '1';
    });
    var outPlannedSystems = itSystemsTable.getItems().filter(function (item) {
        return String(item[4]) === '1';
    });
    var currentDocuments = documentTable.getItems().filter(function (item){ return String(item[1])==='1'});
    var plannedDocuments = documentTable.getItems().filter(function (item){ return String(item[2])==='1'});

    var objects = [];
    var those = this;
    for (var locationPosition = 0; locationPosition < selectedLocations.length; locationPosition++) {
        var object = {};
        object.location = this.findCurrentItem(this.locationPage.assignedItems, selectedLocations[locationPosition][2]);

        if (inCurrentSystems.length === 1) object.inCurrentSystem = this.findCurrentItem(this.itSystemPage.assignedItems,
            inCurrentSystems[0][5]);
        else object.inCurrentSystem = null;

        if (inPlannedSystems.length === 1) object.inPlannedSystem = this.findCurrentItem(this.itSystemPage.assignedItems,
            inPlannedSystems[0][5]);
        else object.inPlannedSystem = null;

        if (outCurrentSystems.length === 1) object.outCurrentSystem = this.findCurrentItem(this.itSystemPage.assignedItems,
            outCurrentSystems[0][5]);
        else object.outCurrentSystem = null;

        if (outPlannedSystems.length === 1) object.outPlannedSystem = this.findCurrentItem(this.itSystemPage.assignedItems,
            outPlannedSystems[0][5]);
        else object.outPlannedSystem = null;

        if (currentDataObjects.length > 0) object.currentDataObjects = currentDataObjects.map(function (item) {
            return those.findCurrentItem(those.dataObjectPage.assignedItems, item[3]);
        });
        else object.currentDataObjects = [];

        if (plannedDataObjects.length > 0) object.plannedDataObjects = plannedDataObjects.map(function (item) {
            return those.findCurrentItem(those.dataObjectPage.assignedItems, item[3]);
        });
        else object.plannedDataObjects = [];

        if (currentDocuments.length > 0) object.currentDocument = currentDocuments.map(function (item) {
            return those.findCurrentItem(those.documentPage.assignedItems, item[3]);
        })[0];
        else object.currentDocument = null;

        if (plannedDocuments.length > 0) object.plannedDocument = plannedDocuments.map(function (item) {
            return those.findCurrentItem(those.documentPage.assignedItems, item[3]);
        })[0];
        else object.plannedDocument = null;


        var s = PRP_Helper.serialize(object)
        object.hash = PRP_Helper.hashCode(s);
        objects.push(object);

    }

    this.assignedItems = this.assignedItems.reduce(function (array, item) {
        var isIn = array.some(function (subItem) {
            return subItem.hash.startsWith(item.hash);
        });
        if (!isIn) array.push(item);
        return array;
    }, objects);

    overviewTable.setItems(this.mapAssignedItems());
}
OverviewSelectPage.prototype.isInValidState = function () {

    var overviewTable = this.dialog.getPageElement(this.pageNumber, "OSP_OVERVIEW_TABLE");
    var addButton = this.dialog.getPageElement(this.pageNumber, "OVS_ADD_PUSH_BUTTON");
    var removeButton = this.dialog.getPageElement(this.pageNumber, "OVS_REMOVE_PUSH_BUTTON");

    removeButton.setEnabled(true);
    addButton.setEnabled(true);

    var isValidCombinations = this.checkValidCombinations();
    if (!isValidCombinations) addButton.setEnabled(false);

    if (overviewTable.getSelection() === null ||
        overviewTable.getSelection().length === 0) removeButton.setEnabled(false);

}
OverviewSelectPage.prototype.removeButtonPressEvent = function () {

    var overviewTable = this.dialog.getPageElement(this.pageNumber, "OSP_OVERVIEW_TABLE");

    var selection = overviewTable.getSelection();
    var those = this;
    selection.forEach(function (index) {
        var selected = overviewTable.getItems()[index];
        those.assignedItems = those.assignedItems.filter(function (subItem) {
            return !String(subItem.hash).startsWith(selected[9]);
        });
    });

    overviewTable.setItems(this.mapAssignedItems());
}



