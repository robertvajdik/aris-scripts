function runMainDialog(object, corporateKey, cockpitHelper) {
  
  var locale = Context.getSelectedLanguage();
  var dialogFunction = new MainDialog(locale, object, corporateKey, cockpitHelper);
  return Dialogs.showDialog(dialogFunction, Constants.DIALOG_TYPE_PROPERTY, BaseDialog.getStringFromStringTable("COCKPIT_PROJECT_DIALOG_TITLE", locale));
  
}

function MainDialog(locale,
                    mainObject,
                    corporateKey, cockpitHelper
) {
  
  this.corporateKey = corporateKey;
  this.cockpitHelper = cockpitHelper;
  this.managementRevelancePage = new ManagementRelevancePage(locale);
  
  
  this.attributesPage = new GeneralAttributesPage(
    mainObject,
    MainDialog.attributesPageNumber,
    this.cockpitHelper.getProcessIdentifierFolder(this.corporateKey),
    locale,
    this
  );
  
  this.processOwnerInformationPage = new ProcessOwnerInformationPage(
    this.cockpitHelper.getProcessOwnerFolder(this.corporateKey),
    corporateKey,
    locale
  );
  
  this.inputOutputHandlingPage = new InputOutputHandlingPage(
    this.cockpitHelper.getInputOutputFolder(this.corporateKey),
    ArisData.getActiveDatabase(), locale, MainDialog.inputOutputPageNumber, this
  );
  
  this.docummentsHandlingPage = new FolderBrowsingHandlingPage(
    "DMP",
    BaseDialog.getStringFromStringTable("DOCUMENTS_PAGE_TITLE", locale),
    FadModelManager.documentType,
    FadModelManager.documentSymbol,
    this.cockpitHelper.getDocumentFolder(this.corporateKey),
    null,
    ArisData.getActiveDatabase(),
    locale,
    MainDialog.documentPageNumber,
    this
  );
  
  this.objectiveHandlingPage = new ObjectiveHandlingPage(
    BaseDialog.getStringFromStringTable("OBJECTIVES_PAGE_TITLE", locale),
    FadModelManager.objectiveType,
    FadModelManager.objectiveSymbol,
    this.cockpitHelper.getObjectiveFolder(this.corporateKey),
    locale,
    MainDialog.objectivePageNumber,
    this
  );
  
  this.serviceHandlingPage = new FolderBrowsingHandlingPage(
    "SHP",
    BaseDialog.getStringFromStringTable("DESIGN_CHOICES_PAGE_TITLE", locale),
    FadModelManager.serviceType,
    FadModelManager.serviceSymbol,
    this.cockpitHelper.getServiceFolder(this.corporateKey),
    null,
    ArisData.getActiveDatabase(),
    locale,
    MainDialog.servicePageNumber,
    this
  );
  
  this.assumptionHandlingPage = new FolderBrowsingHandlingPage(
    "AHP",
    BaseDialog.getStringFromStringTable("AMOUNT_DRIVERS_PAGE_TITLE", locale),
    FadModelManager.assumptionType,
    FadModelManager.assumptionSymbol,
    this.cockpitHelper.getAssumptionFolder(this.corporateKey),
    null,
    ArisData.getActiveDatabase(),
    locale,
    MainDialog.assumptionPageNumber,
    this
  );
  
  this.bussinessCapabilityHandlingPage = new FolderBrowsingHandlingPage(
    "BCHP",
    BaseDialog.getStringFromStringTable("BUSINESS_CAPABILITIES_PAGE_TITLE", locale),
    FadModelManager.bussinesCapabilityType,
    FadModelManager.bussinesCapabilitySymbol,
    this.cockpitHelper.getBusinessCapabilityFolder(this.corporateKey),
    null,
    ArisData.getActiveDatabase(),
    locale,
    MainDialog.bussinesCapabilityPageNumber,
    this
  );
  
  this.committeesHandlingPage = new FolderBrowsingHandlingPage(
    "CHP",
    BaseDialog.getStringFromStringTable("INTENDED_COMMITTEES_PAGE_TITLE", locale),
    FadModelManager.committeeType,
    FadModelManager.committeeSymbol,
    this.cockpitHelper.getCommitteeFolder(this.corporateKey),
    null,
    ArisData.getActiveDatabase(),
    locale,
    MainDialog.committeePageNumber,
    this
  );
  
  this.gapHandlingPage = new FolderBrowsingHandlingPage(
    "GHP",
    BaseDialog.getStringFromStringTable("OPTIMIZATION_POTENTIALS_PAGE_TITLE", locale),
    FadModelManager.gapType,
    FadModelManager.gapSymbol,
    this.cockpitHelper.getGapFolder(this.corporateKey),
    null,
    ArisData.getActiveDatabase(),
    locale,
    MainDialog.gapPageNumber,
    this
  );
  
  this.itSystemHandlingPage = new FolderBrowsingHandlingPage(
    "ITSHP",
    BaseDialog.getStringFromStringTable("IT_SYSTEMS_PAGE_TITLE", locale),
    FadModelManager.itSystemType,
    FadModelManager.itSystemSymbol,
    this.cockpitHelper.getITSystemFolder(this.corporateKey),
    null,
    ArisData.getActiveDatabase(),
    locale,
    MainDialog.itSystemsPageNumber,
    this
  );
  
  this.requirementHandlingPage = new FolderBrowsingHandlingPage(
    "RQHP",
    BaseDialog.getStringFromStringTable("REQUIREMENTS_PAGE_TITLE", locale),
    FadModelManager.requirementType,
    FadModelManager.requirementSymbol,
    this.cockpitHelper.getRequirementFolder(this.corporateKey),
    null,
    ArisData.getActiveDatabase(),
    locale,
    MainDialog.requirementPageNumber,
    this
  );
  
  this.riskHandlingPage = new FolderBrowsingHandlingPage(
    "RSHP",
    BaseDialog.getStringFromStringTable("RISKS_PAGE_TITLE", locale),
    FadModelManager.riskType,
    FadModelManager.riskSymbol,
    this.cockpitHelper.getRiskFolder(this.corporateKey),
    null,
    ArisData.getActiveDatabase(),
    locale,
    MainDialog.riskPageNumber,
    this
  );
  
  this.weakPointHandlingPage = new FolderBrowsingHandlingPage(
    "WHP",
    BaseDialog.getStringFromStringTable("WEAK_POINTS_PAGE_TITLE", locale),
    FadModelManager.weakPointType,
    FadModelManager.weakPointSymbol,
    this.cockpitHelper.getWeakPointFolder(this.corporateKey),
    null,
    ArisData.getActiveDatabase(),
    locale,
    MainDialog.weakPointPageNumber,
    this
  );
  
  
  this.taskHandlingPage = new FolderBrowsingHandlingPage(
    "TSHP",
    BaseDialog.getStringFromStringTable("RELEVANT_PROCESS_INITIATIVES_PAGE_TITLE", locale),
    FadModelManager.taskType,
    FadModelManager.taskSymbol,
    this.cockpitHelper.getTaskFolder(this.corporateKey),
    null,
    ArisData.getActiveDatabase(),
    locale,
    MainDialog.taskPageNumber,
    this
  );
  
  this.customersTouchPointPage = new FolderBrowsingHandlingPage(
    "CIPHP",
    BaseDialog.getStringFromStringTable("CUSTOMER_INTERACTION_POINT_PAGE_TITLE", locale),
    FadModelManager.customerTouchingPointType,
    FadModelManager.customerTouchingPointSymbol,
    this.cockpitHelper.getCustomerInteractionPointFolder(this.corporateKey),
    null,
    ArisData.getActiveDatabase(),
    locale,
    MainDialog.customerTouchPointsPageNumber,
    this
  )
  
  
  this.locale = locale;
  this.mainObject = mainObject;
  this.dialogResult = {
    
    isOk: false,
    processOwner : null
  }
  
  
  this.getPages = function () {
    var pages = [];
    pages.push(this.attributesPage.createPage());
    pages.push(this.processOwnerInformationPage.createPage());
    pages.push(this.objectiveHandlingPage.createPage());
    pages.push(this.inputOutputHandlingPage.createPage());
    pages.push(this.serviceHandlingPage.createPage());
    pages.push(this.docummentsHandlingPage.createPage());
    pages.push(this.createDividerPage());
    
    pages.push(this.committeesHandlingPage.createPage());
    pages.push(this.assumptionHandlingPage.createPage());
    pages.push(this.gapHandlingPage.createPage());
    pages.push(this.itSystemHandlingPage.createPage());
    pages.push(this.managementRevelancePage.createPage());
    pages.push(this.taskHandlingPage.createPage());
    pages.push(this.createDividerPage());
    
    pages.push(this.requirementHandlingPage.createPage());
    pages.push(this.riskHandlingPage.createPage());
    pages.push(this.weakPointHandlingPage.createPage());
    pages.push(this.bussinessCapabilityHandlingPage.createPage());
    pages.push(this.customersTouchPointPage.createPage());
    
    return pages;
  }
  
  
  this.isInValidState = function (pageNumber) {
    
    
    var documentHandlingPageIsInValidState = this.docummentsHandlingPage.isInValidState(this, this.getFadModel());
    var inputOutputIsInValidState = this.inputOutputHandlingPage.isInValidState(this, this.getFadModel());
    var systemsInformationPageIsInValidState = this.managementRevelancePage.isInValidState(this, this.getFadModel());
    var processOwnerInformationPageIsInValidState = this.processOwnerInformationPage.isInValidState(this, MainDialog.processOwnerPageNumber, this.getFadModel());
    var objectivePageIsInValidState = this.objectiveHandlingPage.isInValidState(this, this.getFadModel());
    var servicePageIsInValidState = this.serviceHandlingPage.isInValidState(this, this.getFadModel());
    var assumptionPageIsInValidState = this.assumptionHandlingPage.isInValidState(this, this.getFadModel());
    var bussinesCapabilityPageIsInValidState = this.bussinessCapabilityHandlingPage.isInValidState(this, this.getFadModel());
    var committeePageIsInValidState = this.committeesHandlingPage.isInValidState(this, this.getFadModel());
    var gapPageIsInValidState = this.gapHandlingPage.isInValidState(this, this.getFadModel());
    var itSystemPageIsInValidState = this.itSystemHandlingPage.isInValidState(this, this.getFadModel());
    var requirementPageIsInValidState = this.requirementHandlingPage.isInValidState(this, this.getFadModel());
    var riskPageIsInValidState = this.riskHandlingPage.isInValidState(this, this.getFadModel());
    var weakPointPageIsInValidState = this.weakPointHandlingPage.isInValidState(this, this.getFadModel());
    var taskPageIsInValidState = this.taskHandlingPage.isInValidState(this, this.getFadModel());
    var ctpPageIsInValidState = this.customersTouchPointPage.isInValidState(this, this.getFadModel());
    var attributePageIsInValidState = this.attributesPage.isInValidState();
    
    
    return documentHandlingPageIsInValidState ||
      systemsInformationPageIsInValidState ||
      processOwnerInformationPageIsInValidState ||
      inputOutputIsInValidState ||
      objectivePageIsInValidState ||
      servicePageIsInValidState ||
      assumptionPageIsInValidState ||
      bussinesCapabilityPageIsInValidState ||
      committeePageIsInValidState ||
      gapPageIsInValidState ||
      itSystemPageIsInValidState ||
      requirementPageIsInValidState ||
      riskPageIsInValidState ||
      weakPointPageIsInValidState ||
      taskPageIsInValidState ||
      ctpPageIsInValidState ||
      attributePageIsInValidState;
  }
  
  this.init = function () {
    
    this.attributesPage.init();
    this.docummentsHandlingPage.init(this.getFadModel());
    this.inputOutputHandlingPage.init(this.getFadModel());
    this.objectiveHandlingPage.init(this.getFadModel());
    this.serviceHandlingPage.init(this.getFadModel());
    
    this.assumptionHandlingPage.init(this.getFadModel());
    this.bussinessCapabilityHandlingPage.init(this.getFadModel());
    this.committeesHandlingPage.init(this.getFadModel());
    this.gapHandlingPage.init(this.getFadModel());
    this.itSystemHandlingPage.init(this.getFadModel());
    this.requirementHandlingPage.init(this.getFadModel());
    this.riskHandlingPage.init(this.getFadModel());
    this.weakPointHandlingPage.init(this.getFadModel());
    this.taskHandlingPage.init(this.getFadModel());
    this.customersTouchPointPage.init((this.getFadModel()));
    this.managementRevelancePage.init(this, MainDialog.managementRelevancePageNumber, this.getFadModel());
    this.dialogResult.processOwner = this.processOwnerInformationPage.init(this, MainDialog.processOwnerPageNumber, this.getFadModel());
    
  }
  
  this.getResult = function () {
    return this.dialogResult;
  }
  
  this.onClose = function (pageNumber, bOk) {
    this.dialogResult.isOk = bOk;
    this.dialogResult.systems = this.getPageElement(MainDialog.managementRelevancePageNumber, "SIF_TABLE").getItems();
    this.dialogResult.inputs = this.inputOutputHandlingPage.getAssignedInputs();
    this.dialogResult.outputs = this.inputOutputHandlingPage.getAssignedOutputs();
    this.dialogResult.objectives = this.objectiveHandlingPage.getAssignedObjects();
    this.dialogResult.services = this.serviceHandlingPage.getAssignedObjects();
    this.dialogResult.assignedDocuments = this.docummentsHandlingPage.getAssignedObjects();
    this.dialogResult.assignedAssumption = this.assumptionHandlingPage.getAssignedObjects();
    this.dialogResult.bussinessCapabilities = this.bussinessCapabilityHandlingPage.getAssignedObjects();
    this.dialogResult.committees = this.committeesHandlingPage.getAssignedObjects();
    this.dialogResult.gaps = this.gapHandlingPage.getAssignedObjects();
    this.dialogResult.itSystems = this.itSystemHandlingPage.getAssignedObjects();
    this.dialogResult.requirement = this.requirementHandlingPage.getAssignedObjects();
    this.dialogResult.risks = this.riskHandlingPage.getAssignedObjects();
    this.dialogResult.weakPoints = this.weakPointHandlingPage.getAssignedObjects();
    this.dialogResult.tasks = this.taskHandlingPage.getAssignedObjects();
    this.dialogResult.objectProperties = this.attributesPage.getResults();
    this.dialogResult.customersTouchingPoints = this.customersTouchPointPage.getAssignedObjects();
    this.dialogResult.topics = null;
    
  }
  
  this.MSIP_MANAGE_BUTTON_pressed = function () {
    try {
      var currentTopics = this.getCurrentFADContent(Constants.OT_KNWLDG_CAT);
      var guid = this.cockpitHelper.getManagementSystemModel(this.corporateKey)
      var mainModel = ArisData.getActiveDatabase().FindGUID(guid, Constants.CID_MODEL);
      var dialogFunction = new SystemsHandlingSubDialog(this.locale, mainModel, currentTopics);
      this.dialog.setSubDialog("MSIP_MANAGE_BUTTON_SUBDIALOG", dialogFunction, Constants.DIALOG_TYPE_ACTION, "Manage Systems");
    } catch (ex) {
      writeLog(sm72tc, "Action MSIP_MANAGE_BUTTON_pressed was running", "info");
      writeLog(sm72tc, "Exception: " + ex + " line number " + ex.lineNumber, "error");
    }
  }
  
  this.MSIP_MANAGE_BUTTON_SUBDIALOG_subDialogClosed = function (subResult, bOk) {
    
    try {
      if (!bOk) return false;
      var records = subResult.selection;
      
      var table = this.getPageElement(MainDialog.managementRelevancePageNumber, "SIF_TABLE");
      if (table === null) return false;
      var locale = this.locale;
      var rows = records.map(function (record) {
        var objectCommentary = record[3];
        var objectName = record[1];
        var objectFullName = record[2];
        var objectDescription = BaseDialog.getDescription(record[4], locale);
        var objectGUID = record[4]
        return [objectName, objectFullName, objectDescription, objectCommentary, objectGUID];
      });
      
      table.setItems(rows);
    } catch (ex) {
      writeLog(sm72tc, "Action MSIP_MANAGE_BUTTON_SUBDIALOG_subDialogClosed was running", "info");
      writeLog(sm72tc, "Exception: " + ex + " line number " + ex.lineNumber, "error");
    }
    
  }
  
  this.POIP_MANAGE_BUTTON_pressed = function () {
    try {
      var currentRole = this.getCurrentFADContent(Constants.OT_PERS_TYPE)[0];
      var processOwnerGroupGUID = this.processOwnerInformationPage.getProcessOwnerGroupGUID();
      var corporateKey = this.processOwnerInformationPage.getCorporateKey();
      var processName = this.dialogResult.processOwner === null ? this.mainObject.Name(this.locale) : this.dialogResult.processOwner.Name(this.locale);

      if(currentRole === null || typeof currentRole === 'undefined') currentRole = this.dialogResult.processOwner;
      writeLog(sm72tc, "Action POIP_MANAGE_BUTTON_pressed was running " + currentRole, "info");
      var dialogFunction = new ProcessOwnerHandlingSubDialog(this.locale, processOwnerGroupGUID, currentRole, processName, corporateKey);
      this.dialog.setSubDialog("POIP_MANAGE_BUTTON_SUBDIALOG", dialogFunction, Constants.DIALOG_TYPE_ACTION, "Manage Process Owner");
    } catch (ex) {
      writeLog(sm72tc, "Action POIP_MANAGE_BUTTON_pressed was running", "info");
      writeLog(sm72tc, "Exception: " + ex + " line number " + ex.lineNumber, "error");
    }
  }
  
  this.POIP_MANAGE_BUTTON_SUBDIALOG_subDialogClosed = function (subResult, bOk) {
    try {
      if (!bOk) return false;
      
      if (subResult.selection.length > 0) {
        var processOwner = ArisData.getActiveDatabase().FindGUID(subResult.selection[0][3], Constants.CID_OBJDEF);
        this.dialogResult.processOwner = BaseDialog.isArisObjectNullOrInvalid(processOwner) ? null : processOwner;
        var responsiblePersonName = processOwner.Attribute(ProcessOwnerHandlingSubDialog.ATT_PROC_RESP, this.locale).getValue();
        this.processOwnerInformationPage.setResponsiblePersonName(this, MainDialog.processOwnerPageNumber, responsiblePersonName);
        this.processOwnerInformationPage.setRoleName(this, MainDialog.processOwnerPageNumber, processOwner.Name(this.locale));
      } else {
        this.dialogResult.processOwner = null;
        this.processOwnerInformationPage.setResponsiblePersonName(this, MainDialog.processOwnerPageNumber, "");
        this.processOwnerInformationPage.setRoleName(this, MainDialog.processOwnerPageNumber, "");
      }
      
    } catch (ex) {
      writeLog(sm72tc, "Action POIP_MANAGE_BUTTON_SUBDIALOG_subDialogClosed was running", "info");
      writeLog(sm72tc, "Exception: " + ex + " line number " + ex.lineNumber, "error");
    }
  }
  
  this.IOHP_SUBGROUPS_TREE_BOX_selChanged = function (selection) {
    try {
      this.inputOutputHandlingPage.treeBoxChangeEvent(selection);
    } catch (ex) {
      writeLog(sm72tc, "Action IOHP_SUBGROUPS_TREE_BOX_selChanged was running", "info");
      writeLog(sm72tc, "Exception: " + ex + " line number " + ex.lineNumber, "error");
    }
  }
  this.IOHP_SEARCH_BOX_changed = function () {
    try {
      this.inputOutputHandlingPage.searchBoxChangeEvent(this);
    } catch (ex) {
      writeLog(sm72tc, "Action IOHP_SEARCH_BOX_changed was running", "info");
      writeLog(sm72tc, "Exception: " + ex + " line number " + ex.lineNumber, "error");
    }
  }
  this.IOHP_ADD_OUTPUT_PUSH_BUTTON_pressed = function () {
    try {
      this.inputOutputHandlingPage.addOutputButtonPressEvent(this, this.getFadModel());
    } catch (ex) {
      writeLog(sm72tc, "Action IOHP_ADD_OUTPUT_PUSH_BUTTON_pressed was running", "info");
      writeLog(sm72tc, "Exception: " + ex + " line number " + ex.lineNumber, "error");
    }
  }
  this.IOHP_ADD_INPUT_PUSH_BUTTON_pressed = function () {
    try {
      this.inputOutputHandlingPage.addInputButtonPressEvent(this, this.getFadModel());
    } catch (ex) {
      writeLog(sm72tc, "Action IOHP_ADD_INPUT_PUSH_BUTTON_pressed was running", "info");
      writeLog(sm72tc, "Exception: " + ex + " line number " + ex.lineNumber, "error");
    }
  }
  this.IOHP_INPUT_DELETE_PUSH_BUTTON_pressed = function () {
    try {
      this.inputOutputHandlingPage.deleteInputButtonPressEvent(this);
    } catch (ex) {
      writeLog(sm72tc, "Action IOHP_INPUT_DELETE_PUSH_BUTTON_pressed was running", "info");
      writeLog(sm72tc, "Exception: " + ex + " line number " + ex.lineNumber, "error");
    }
  }
  this.IOHP_OUTPUT_DELETE_PUSH_BUTTON_pressed = function () {
    try {
      this.inputOutputHandlingPage.deleteOutputButtonPressEvent(this);
    } catch (ex) {
      writeLog(sm72tc, "Action IOHP_OUTPUT_DELETE_PUSH_BUTTON_pressed was running", "info");
      writeLog(sm72tc, "Exception: " + ex + " line number " + ex.lineNumber, "error");
    }
  }
  this.IOHP_NEW_PUSH_BUTTON_pressed = function () {
    try {
      var guid = this.cockpitHelper.getNewInputOutputFolder(this.corporateKey);
      var dialogFunction = new EditOrCreateNewObjectSubDialog(guid, null, FadModelManager.inputType, this.locale, false, MainDialog.inputOutputPageNumber);
      this.dialog.setSubDialog("EDIT_OR_CREATE_SUBDIALOG", dialogFunction, Constants.DIALOG_TYPE_ACTION, "New Product");
    } catch (ex) {
      writeLog(sm72tc, "Action IOHP_NEW_PUSH_BUTTON_pressed was running", "info");
      writeLog(sm72tc, "Exception: " + ex + " line number " + ex.lineNumber, "error");
    }
  }
  this.IOHP_EDIT_PUSH_BUTTON_pressed = function () {
    try {
      var object = this.inputOutputHandlingPage.getSelectedObject();
      var dialogFunction = new EditOrCreateNewObjectSubDialog(null, object, FadModelManager.inputType, this.locale, true, MainDialog.inputOutputPageNumber);
      this.dialog.setSubDialog("EDIT_OR_CREATE_SUBDIALOG", dialogFunction, Constants.DIALOG_TYPE_ACTION, "Edit Product");
    } catch (ex) {
      writeLog(sm72tc, "Action IOHP_EDIT_PUSH_BUTTON_pressed was running", "info");
      writeLog(sm72tc, "Exception: " + ex + " line number " + ex.lineNumber, "error");
    }
    
  }
  this.IOHP_INPUT_EDIT_PUSH_BUTTON_pressed = function () {
    try {
      var object = this.inputOutputHandlingPage.getSelectedInput();
      var dialogFunction = new EditOrCreateNewObjectSubDialog(null, object, FadModelManager.inputType, this.locale, true, MainDialog.inputOutputPageNumber);
      this.dialog.setSubDialog("EDIT_OR_CREATE_SUBDIALOG", dialogFunction, Constants.DIALOG_TYPE_ACTION, "Edit Product");
    } catch (ex) {
      writeLog(sm72tc, "Action IOHP_INPUT_EDIT_PUSH_BUTTON_pressed was running", "info");
      writeLog(sm72tc, "Exception: " + ex + " line number " + ex.lineNumber, "error");
    }
    
  }
  this.IOHP_OUTPUT_EDIT_PUSH_BUTTON_pressed = function () {
    try {
      var object = this.inputOutputHandlingPage.getSelectedOutput();
      var dialogFunction = new EditOrCreateNewObjectSubDialog(null, object, FadModelManager.inputType, this.locale, true, MainDialog.inputOutputPageNumber);
      this.dialog.setSubDialog("EDIT_OR_CREATE_SUBDIALOG", dialogFunction, Constants.DIALOG_TYPE_ACTION, "Edit Product");
    } catch (ex) {
      writeLog(sm72tc, "Action IOHP_OUTPUT_EDIT_PUSH_BUTTON_pressed was running", "info");
      writeLog(sm72tc, "Exception: " + ex + " line number " + ex.lineNumber, "error");
    }
    
  }
  
  
  this.SHP_SUBGROUPS_TREE_BOX_selChanged = function (selection) {
    try {
      this.serviceHandlingPage.treeBoxChangeEvent(selection);
    } catch (ex) {
      writeLog(sm72tc, "Action SHP_SUBGROUPS_TREE_BOX_selChanged was running", "info");
      writeLog(sm72tc, "Exception: " + ex + " line number " + ex.lineNumber, "error");
    }
  }
  this.SHP_ADD_PUSH_BUTTON_pressed = function () {
    try {
      this.serviceHandlingPage.addButtonPressEvent(this.getFadModel());
    } catch (ex) {
      writeLog(sm72tc, "Action SHP_ADD_PUSH_BUTTON_pressed was running", "info");
      writeLog(sm72tc, "Exception: " + ex + " line number " + ex.lineNumber, "error");
    }
  }
  this.SHP_DELETE_PUSH_BUTTON_pressed = function () {
    try {
      this.serviceHandlingPage.deleteButtonPressEvent();
    } catch (ex) {
      writeLog(sm72tc, "Action SHP_DELETE_PUSH_BUTTON_pressed was running", "info");
      writeLog(sm72tc, "Exception: " + ex + " line number " + ex.lineNumber, "error");
    }
  }
  this.SHP_SEARCH_BOX_changed = function () {
    try {
      this.serviceHandlingPage.searchBoxChangeEvent();
    } catch (ex) {
      writeLog(sm72tc, "Action SHP_SEARCH_BOX_changed was running", "info");
      writeLog(sm72tc, "Exception: " + ex + " line number " + ex.lineNumber, "error");
    }
  }
  this.SHP_EDIT_PUSH_BUTTON_pressed = function () {
    try {
      var object = this.serviceHandlingPage.getSelectedObject();
      var dialogFunction = new EditOrCreateNewObjectSubDialog(null, object, FadModelManager.serviceType, this.locale, true, MainDialog.servicePageNumber);
      this.dialog.setSubDialog("EDIT_OR_CREATE_SUBDIALOG", dialogFunction, Constants.DIALOG_TYPE_ACTION, "Edit Design Choice");
    } catch (ex) {
      writeLog(sm72tc, "Action SHP_EDIT_PUSH_BUTTON_pressed was running", "info");
      writeLog(sm72tc, "Exception: " + ex + " line number " + ex.lineNumber, "error");
    }
    
  }
  this.SHP_SECOND_EDIT_PUSH_BUTTON_pressed = function () {
    try {
      var object = this.serviceHandlingPage.getSelectedAssignedObject();
      var dialogFunction = new EditOrCreateNewObjectSubDialog(null, object, FadModelManager.serviceType, this.locale, true, MainDialog.servicePageNumber);
      this.dialog.setSubDialog("EDIT_OR_CREATE_SUBDIALOG", dialogFunction, Constants.DIALOG_TYPE_ACTION, "Edit Design Choice");
    } catch (ex) {
      writeLog(sm72tc, "Action SHP_SECOND_EDIT_PUSH_BUTTON_pressed was running", "info");
      writeLog(sm72tc, "Exception: " + ex + " line number " + ex.lineNumber, "error");
    }
  }
  this.SHP_NEW_PUSH_BUTTON_pressed = function () {
    try {
      var guid = this.cockpitHelper.getNewServiceFolder(this.corporateKey);
      var dialogFunction = new EditOrCreateNewObjectSubDialog(guid, null, FadModelManager.serviceType, this.locale, false, MainDialog.servicePageNumber);
      this.dialog.setSubDialog("EDIT_OR_CREATE_SUBDIALOG", dialogFunction, Constants.DIALOG_TYPE_ACTION, "New Design Choice");
    } catch (ex) {
      writeLog(sm72tc, "Action SHP_NEW_PUSH_BUTTON_pressed was running", "info");
      writeLog(sm72tc, "Exception: " + ex + " line number " + ex.lineNumber, "error");
    }
    
  }
  
  
  this.OHP_SUBGROUPS_TREE_BOX_selChanged = function (selection) {
    try {
      this.objectiveHandlingPage.treeBoxChangeEvent(selection);
    } catch (ex) {
      writeLog(sm72tc, "Action OHP_SUBGROUPS_TREE_BOX_selChanged was running", "info");
      writeLog(sm72tc, "Exception: " + ex + " line number " + ex.lineNumber, "error");
    }
  }
  this.OHP_ADD_PUSH_BUTTON_pressed = function () {
    try {
      this.objectiveHandlingPage.addButtonPressEvent(this.getFadModel());
    } catch (ex) {
      writeLog(sm72tc, "Action OHP_ADD_PUSH_BUTTON_pressed was running", "info");
      writeLog(sm72tc, "Exception: " + ex + " line number " + ex.lineNumber, "error");
    }
  }
  this.OHP_DELETE_PUSH_BUTTON_pressed = function () {
    try {
      this.objectiveHandlingPage.deleteButtonPressEvent();
    } catch (ex) {
      writeLog(sm72tc, "Action OHP_DELETE_PUSH_BUTTON_pressed was running", "info");
      writeLog(sm72tc, "Exception: " + ex + " line number " + ex.lineNumber, "error");
    }
  }
  
  this.OHP_SEARCH_BOX_changed = function () {
    try {
      this.objectiveHandlingPage.searchBoxChangeEvent();
    } catch (ex) {
      writeLog(sm72tc, "Action OHP_SEARCH_BOX_changed was running", "info");
      writeLog(sm72tc, "Exception: " + ex + " line number " + ex.lineNumber, "error");
    }
  }
  this.OHP_EDIT_PUSH_BUTTON_pressed = function () {
    try {
      var object = this.objectiveHandlingPage.getSelectedObject();
      var dialogFunction = new ObjectiveEditSubDialog(object, this.locale, true,
                                                      this.cockpitHelper, this.corporateKey
      );
      this.dialog.setSubDialog("OESD_SUBDIALOG", dialogFunction, Constants.DIALOG_TYPE_ACTION, "Edit objective");
    } catch (ex) {
      writeLog(sm72tc, "Action OHP_EDIT_PUSH_BUTTON_pressed was running", "info");
      writeLog(sm72tc, "Exception: " + ex + " line number " + ex.lineNumber, "error");
    }
    
  }
  this.OHP_SECOND_EDIT_PUSH_BUTTON_pressed = function () {
    try {
      var object = this.objectiveHandlingPage.getSelectedAssignedObject();
      var dialogFunction = new ObjectiveEditSubDialog(object, this.locale, true,
                                                      this.cockpitHelper, this.corporateKey
      );
      this.dialog.setSubDialog("OESD_SUBDIALOG", dialogFunction, Constants.DIALOG_TYPE_ACTION, "Edit objective");
    } catch (ex) {
      writeLog(sm72tc, "Action OHP_SECOND_EDIT_PUSH_BUTTON_pressed was running", "info");
      writeLog(sm72tc, "Exception: " + ex + " line number " + ex.lineNumber, "error");
    }
  }
  this.OHP_NEW_PUSH_BUTTON_pressed = function () {
    try {
      var dialogFunction = new ObjectiveEditSubDialog(null, this.locale, false,
                                                      this.cockpitHelper, this.corporateKey
      );
      this.dialog.setSubDialog("OESD_SUBDIALOG", dialogFunction, Constants.DIALOG_TYPE_ACTION, "New objective");
    } catch (ex) {
      writeLog(sm72tc, "Action OHP_NEW_PUSH_BUTTON_pressed was running", "info");
      writeLog(sm72tc, "Exception: " + ex + " line number " + ex.lineNumber, "error");
    }
    
  }
  this.OESD_SUBDIALOG_subDialogClosed = function (subResult, bOk) {
    
    try {
      if (!subResult.isOk) return false;
      
      var object = subResult.object;
      if (subResult.isEdit) {
        subResult.object.Attribute(Constants.AT_NAME, this.locale).setValue(subResult.newName);
        subResult.object.Attribute(Constants.AT_DESC, this.locale).setValue(subResult.newDescription);
        
      } else {
        var guid = this.cockpitHelper.getNewObjectiveFolder(this.corporateKey);
        var folder = ArisData.getActiveDatabase().FindGUID(guid, Constants.CID_GROUP);
        if (BaseDialog.isArisObjectNullOrInvalid(folder)) return false;
        
        var newObject = folder.GetOrCreateObjDef(FadModelManager.objectiveType, 2, subResult.newName, this.locale);
        if (BaseDialog.isArisObjectNullOrInvalid(newObject)) return false;
        
        if (!BaseDialog.isNullOrEmpty(subResult.newDescription)) {
          newObject.Attribute(Constants.AT_DESC, this.locale).setValue(subResult.newDescription);
        }
        object = newObject;
        
      }
      
      var assignedModels = object.AssignedModels(Constants.MT_KPI_ALLOC_DGM);
      var assignedModel;
      if (BaseDialog.isNullOrEmpty(assignedModels)) {
        
        var objectName = object.Name(locale);
        var group = object.Group();
        assignedModel = group.CreateModel(Constants.MT_KPI_ALLOC_DGM, objectName, locale);
        object.CreateAssignment(assignedModel, true);
      } else {
        assignedModel = assignedModels[0];
      }
      
      var kpiModelManager = new KpiModelManager(assignedModel, object, this.locale);
      kpiModelManager.update(subResult.assignedKPI);
  
      this.reloadPage(MainDialog.objectivePageNumber);
    } catch (ex) {
      writeLog(sm72tc, "Action OESD_SUBDIALOG_subDialogClosed was running", "info");
      writeLog(sm72tc, "Exception: " + ex + " line number " + ex.lineNumber, "error");
    }
  }
  
  
  this.AHP_SUBGROUPS_TREE_BOX_selChanged = function (selection) {
    try {
      this.assumptionHandlingPage.treeBoxChangeEvent(selection);
    } catch (ex) {
      writeLog(sm72tc, "Action AHP_SUBGROUPS_TREE_BOX_selChanged was running", "info");
      writeLog(sm72tc, "Exception: " + ex + " line number " + ex.lineNumber, "error");
    }
  }
  this.AHP_ADD_PUSH_BUTTON_pressed = function () {
    try {
      this.assumptionHandlingPage.addButtonPressEvent(this.getFadModel());
    } catch (ex) {
      writeLog(sm72tc, "Action AHP_ADD_PUSH_BUTTON_pressed was running", "info");
      writeLog(sm72tc, "Exception: " + ex + " line number " + ex.lineNumber, "error");
    }
  }
  this.AHP_DELETE_PUSH_BUTTON_pressed = function () {
    try {
      this.assumptionHandlingPage.deleteButtonPressEvent();
    } catch (ex) {
      writeLog(sm72tc, "Action AHP_DELETE_PUSH_BUTTON_pressed was running", "info");
      writeLog(sm72tc, "Exception: " + ex + " line number " + ex.lineNumber, "error");
    }
  }
  this.AHP_SEARCH_BOX_changed = function () {
    try {
      this.assumptionHandlingPage.searchBoxChangeEvent();
    } catch (ex) {
      writeLog(sm72tc, "Action AHP_SEARCH_BOX_changed was running", "info");
      writeLog(sm72tc, "Exception: " + ex + " line number " + ex.lineNumber, "error");
    }
  }
  this.AHP_EDIT_PUSH_BUTTON_pressed = function () {
    try {
      var object = this.assumptionHandlingPage.getSelectedObject();
      var dialogFunction = new EditOrCreateNewObjectSubDialog(null, object, FadModelManager.assumptionType, this.locale, true, MainDialog.assumptionPageNumber);
      this.dialog.setSubDialog("EDIT_OR_CREATE_SUBDIALOG", dialogFunction, Constants.DIALOG_TYPE_ACTION, "Edit amount driver");
    } catch (ex) {
      writeLog(sm72tc, "Action AHP_EDIT_PUSH_BUTTON_pressed was running", "info");
      writeLog(sm72tc, "Exception: " + ex + " line number " + ex.lineNumber, "error");
    }
    
  }
  this.AHP_SECOND_EDIT_PUSH_BUTTON_pressed = function () {
    try {
      var object = this.assumptionHandlingPage.getSelectedAssignedObject();
      var dialogFunction = new EditOrCreateNewObjectSubDialog(null, object, FadModelManager.assumptionType, this.locale, true, MainDialog.assumptionPageNumber);
      this.dialog.setSubDialog("EDIT_OR_CREATE_SUBDIALOG", dialogFunction, Constants.DIALOG_TYPE_ACTION, "Edit amount driver");
    } catch (ex) {
      writeLog(sm72tc, "Action AHP_SECOND_EDIT_PUSH_BUTTON_pressed was running", "info");
      writeLog(sm72tc, "Exception: " + ex + " line number " + ex.lineNumber, "error");
    }
    
  }
  this.AHP_NEW_PUSH_BUTTON_pressed = function () {
    try {
      var guid = this.cockpitHelper.getNewAssumptionFolder(this.corporateKey);
      var dialogFunction = new EditOrCreateNewObjectSubDialog(guid, null, FadModelManager.assumptionType, this.locale, false, MainDialog.assumptionPageNumber);
      this.dialog.setSubDialog("EDIT_OR_CREATE_SUBDIALOG", dialogFunction, Constants.DIALOG_TYPE_ACTION, "New amount driver");
    } catch (ex) {
      writeLog(sm72tc, "Action AHP_NEW_PUSH_BUTTON_pressed was running", "info");
      writeLog(sm72tc, "Exception: " + ex + " line number " + ex.lineNumber, "error");
    }
    
  }
  
  
  this.BCHP_SUBGROUPS_TREE_BOX_selChanged = function (selection) {
    try {
      this.bussinessCapabilityHandlingPage.treeBoxChangeEvent(selection);
    } catch (ex) {
      writeLog(sm72tc, "Action BCHP_SUBGROUPS_TREE_BOX_selChanged was running", "info");
      writeLog(sm72tc, "Exception: " + ex + " line number " + ex.lineNumber, "error");
    }
  }
  this.BCHP_ADD_PUSH_BUTTON_pressed = function () {
    try {
      this.bussinessCapabilityHandlingPage.addButtonPressEvent(this.getFadModel());
    } catch (ex) {
      writeLog(sm72tc, "Action BCHP_ADD_PUSH_BUTTON_pressed was running", "info");
      writeLog(sm72tc, "Exception: " + ex + " line number " + ex.lineNumber, "error");
    }
  }
  this.BCHP_DELETE_PUSH_BUTTON_pressed = function () {
    try {
      this.bussinessCapabilityHandlingPage.deleteButtonPressEvent();
    } catch (ex) {
      writeLog(sm72tc, "Action BCHP_DELETE_PUSH_BUTTON_pressed was running", "info");
      writeLog(sm72tc, "Exception: " + ex + " line number " + ex.lineNumber, "error");
    }
  }
  this.BCHP_SEARCH_BOX_changed = function () {
    try {
      this.bussinessCapabilityHandlingPage.searchBoxChangeEvent();
    } catch (ex) {
      writeLog(sm72tc, "Action BCHP_SEARCH_BOX_changed was running", "info");
      writeLog(sm72tc, "Exception: " + ex + " line number " + ex.lineNumber, "error");
    }
  }
  this.BCHP_EDIT_PUSH_BUTTON_pressed = function () {
    try {
      var object = this.bussinessCapabilityHandlingPage.getSelectedObject();
      var dialogFunction = new EditOrCreateNewObjectSubDialog(null, object, FadModelManager.bussinesCapabilityType, this.locale, true, MainDialog.bussinesCapabilityPageNumber);
      this.dialog.setSubDialog("EDIT_OR_CREATE_SUBDIALOG", dialogFunction, Constants.DIALOG_TYPE_ACTION, "Edit bussiness capability");
    } catch (ex) {
      writeLog(sm72tc, "Action BCHP_EDIT_PUSH_BUTTON_pressed was running", "info");
      writeLog(sm72tc, "Exception: " + ex + " line number " + ex.lineNumber, "error");
    }
    
  }
  this.BCHP_SECOND_EDIT_PUSH_BUTTON_pressed = function () {
    try {
      var object = this.bussinessCapabilityHandlingPage.getSelectedAssignedObject();
      var dialogFunction = new EditOrCreateNewObjectSubDialog(null, object, FadModelManager.bussinesCapabilityType, this.locale, true, MainDialog.bussinesCapabilityPageNumber);
      this.dialog.setSubDialog("EDIT_OR_CREATE_SUBDIALOG", dialogFunction, Constants.DIALOG_TYPE_ACTION, "Edit bussiness capability");
    } catch (ex) {
      writeLog(sm72tc, "Action BCHP_SECOND_EDIT_PUSH_BUTTON_pressed was running", "info");
      writeLog(sm72tc, "Exception: " + ex + " line number " + ex.lineNumber, "error");
    }
    
  }
  this.BCHP_NEW_PUSH_BUTTON_pressed = function () {
    try {
      var guid = this.cockpitHelper.getNewBusinessCapabilityFolder(this.corporateKey);
      var dialogFunction = new EditOrCreateNewObjectSubDialog(guid, null, FadModelManager.bussinesCapabilityType, this.locale, false, MainDialog.bussinesCapabilityPageNumber);
      this.dialog.setSubDialog("EDIT_OR_CREATE_SUBDIALOG", dialogFunction, Constants.DIALOG_TYPE_ACTION, "New bussiness capability");
    } catch (ex) {
      writeLog(sm72tc, "Action BCHP_NEW_PUSH_BUTTON_pressed was running", "info");
      writeLog(sm72tc, "Exception: " + ex + " line number " + ex.lineNumber, "error");
    }
    
  }
  
  this.CHP_SUBGROUPS_TREE_BOX_selChanged = function (selection) {
    try {
      this.committeesHandlingPage.treeBoxChangeEvent(selection);
    } catch (ex) {
      writeLog(sm72tc, "Action CHP_SUBGROUPS_TREE_BOX_selChanged was running", "info");
      writeLog(sm72tc, "Exception: " + ex + " line number " + ex.lineNumber, "error");
    }
  }
  this.CHP_ADD_PUSH_BUTTON_pressed = function () {
    try {
      this.committeesHandlingPage.addButtonPressEvent(this.getFadModel());
    } catch (ex) {
      writeLog(sm72tc, "Action CHP_ADD_PUSH_BUTTON_pressed was running", "info");
      writeLog(sm72tc, "Exception: " + ex + " line number " + ex.lineNumber, "error");
    }
  }
  this.CHP_DELETE_PUSH_BUTTON_pressed = function () {
    try {
      this.committeesHandlingPage.deleteButtonPressEvent();
    } catch (ex) {
      writeLog(sm72tc, "Action CHP_DELETE_PUSH_BUTTON_pressed was running", "info");
      writeLog(sm72tc, "Exception: " + ex + " line number " + ex.lineNumber, "error");
    }
  }
  this.CHP_SEARCH_BOX_changed = function () {
    try {
      this.committeesHandlingPage.searchBoxChangeEvent();
    } catch (ex) {
      writeLog(sm72tc, "Action CHP_SEARCH_BOX_changed was running", "info");
      writeLog(sm72tc, "Exception: " + ex + " line number " + ex.lineNumber, "error");
    }
  }
  this.CHP_EDIT_PUSH_BUTTON_pressed = function () {
    try {
      var object = this.committeesHandlingPage.getSelectedObject();
      var dialogFunction = new EditOrCreateNewObjectSubDialog(null, object, FadModelManager.committeeType, this.locale, true, MainDialog.committeePageNumber);
      this.dialog.setSubDialog("EDIT_OR_CREATE_SUBDIALOG", dialogFunction, Constants.DIALOG_TYPE_ACTION, "Edit Intended Committee");
    } catch (ex) {
      writeLog(sm72tc, "Action CHP_EDIT_PUSH_BUTTON_pressed was running", "info");
      writeLog(sm72tc, "Exception: " + ex + " line number " + ex.lineNumber, "error");
    }
    
  }
  this.CHP_SECOND_EDIT_PUSH_BUTTON_pressed = function () {
    try {
      var object = this.committeesHandlingPage.getSelectedAssignedObject();
      var dialogFunction = new EditOrCreateNewObjectSubDialog(null, object, FadModelManager.committeeType, this.locale, true, MainDialog.committeePageNumber);
      this.dialog.setSubDialog("EDIT_OR_CREATE_SUBDIALOG", dialogFunction, Constants.DIALOG_TYPE_ACTION, "Edit Intended Committee");
    } catch (ex) {
      writeLog(sm72tc, "Action CHP_SECOND_EDIT_PUSH_BUTTON_pressed was running", "info");
      writeLog(sm72tc, "Exception: " + ex + " line number " + ex.lineNumber, "error");
    }
    
  }
  this.CHP_NEW_PUSH_BUTTON_pressed = function () {
    try {
      var guid = this.cockpitHelper.getNewCommitteeFolder(this.corporateKey)
      var dialogFunction = new EditOrCreateNewObjectSubDialog(guid, null, FadModelManager.committeeType, this.locale, false, MainDialog.committeePageNumber);
      this.dialog.setSubDialog("EDIT_OR_CREATE_SUBDIALOG", dialogFunction, Constants.DIALOG_TYPE_ACTION, "New Intended Committee");
    } catch (ex) {
      writeLog(sm72tc, "Action CHP_NEW_PUSH_BUTTON_pressed was running", "info");
      writeLog(sm72tc, "Exception: " + ex + " line number " + ex.lineNumber, "error");
    }
    
  }
  
  
  this.GHP_SUBGROUPS_TREE_BOX_selChanged = function (selection) {
    try {
      this.gapHandlingPage.treeBoxChangeEvent(selection);
    } catch (ex) {
      writeLog(sm72tc, "Action GHP_SUBGROUPS_TREE_BOX_selChanged was running", "info");
      writeLog(sm72tc, "Exception: " + ex + " line number " + ex.lineNumber, "error");
    }
  }
  this.GHP_ADD_PUSH_BUTTON_pressed = function () {
    try {
      this.gapHandlingPage.addButtonPressEvent(this.getFadModel());
    } catch (ex) {
      writeLog(sm72tc, "Action GHP_ADD_PUSH_BUTTON_pressed was running", "info");
      writeLog(sm72tc, "Exception: " + ex + " line number " + ex.lineNumber, "error");
    }
  }
  this.GHP_DELETE_PUSH_BUTTON_pressed = function () {
    try {
      this.gapHandlingPage.deleteButtonPressEvent();
    } catch (ex) {
      writeLog(sm72tc, "Action GHP_DELETE_PUSH_BUTTON_pressed was running", "info");
      writeLog(sm72tc, "Exception: " + ex + " line number " + ex.lineNumber, "error");
    }
  }
  this.GHP_SEARCH_BOX_changed = function () {
    try {
      this.gapHandlingPage.searchBoxChangeEvent();
    } catch (ex) {
      writeLog(sm72tc, "Action GHP_SEARCH_BOX_changed was running", "info");
      writeLog(sm72tc, "Exception: " + ex + " line number " + ex.lineNumber, "error");
    }
  }
  this.GHP_EDIT_PUSH_BUTTON_pressed = function () {
    try {
      var object = this.gapHandlingPage.getSelectedObject();
      var dialogFunction = new EditOrCreateNewObjectSubDialog(null, object, FadModelManager.gapType, this.locale, true, MainDialog.gapPageNumber);
      this.dialog.setSubDialog("EDIT_OR_CREATE_SUBDIALOG", dialogFunction, Constants.DIALOG_TYPE_ACTION, "Edit Optimization potential");
    } catch (ex) {
      writeLog(sm72tc, "Action GHP_EDIT_PUSH_BUTTON_pressed was running", "info");
      writeLog(sm72tc, "Exception: " + ex + " line number " + ex.lineNumber, "error");
    }
    
  }
  this.GHP_SECOND_EDIT_PUSH_BUTTON_pressed = function () {
    try {
      var object = this.gapHandlingPage.getSelectedAssignedObject();
      var dialogFunction = new EditOrCreateNewObjectSubDialog(null, object, FadModelManager.gapType, this.locale, true, MainDialog.gapPageNumber);
      this.dialog.setSubDialog("EDIT_OR_CREATE_SUBDIALOG", dialogFunction, Constants.DIALOG_TYPE_ACTION, "Edit Optimization potential");
    } catch (ex) {
      writeLog(sm72tc, "Action GHP_SECOND_EDIT_PUSH_BUTTON_pressed was running", "info");
      writeLog(sm72tc, "Exception: " + ex + " line number " + ex.lineNumber, "error");
    }
    
  }
  this.GHP_NEW_PUSH_BUTTON_pressed = function () {
    try {
      var guid = this.cockpitHelper.getNewGapFolder(this.corporateKey);
      var dialogFunction = new EditOrCreateNewObjectSubDialog(guid, null, FadModelManager.gapType, this.locale, false, MainDialog.gapPageNumber);
      this.dialog.setSubDialog("EDIT_OR_CREATE_SUBDIALOG", dialogFunction, Constants.DIALOG_TYPE_ACTION, "New Optimization potential");
    } catch (ex) {
      writeLog(sm72tc, "Action GHP_NEW_PUSH_BUTTON_pressed was running", "info");
      writeLog(sm72tc, "Exception: " + ex + " line number " + ex.lineNumber, "error");
    }
    
  }
  
  
  this.ITSHP_SUBGROUPS_TREE_BOX_selChanged = function (selection) {
    try {
      this.itSystemHandlingPage.treeBoxChangeEvent(selection);
    } catch (ex) {
      writeLog(sm72tc, "Action ITSHP_SUBGROUPS_TREE_BOX_selChanged was running", "info");
      writeLog(sm72tc, "Exception: " + ex + " line number " + ex.lineNumber, "error");
    }
  }
  this.ITSHP_ADD_PUSH_BUTTON_pressed = function () {
    try {
      this.itSystemHandlingPage.addButtonPressEvent(this.getFadModel());
    } catch (ex) {
      writeLog(sm72tc, "Action ITSHP_ADD_PUSH_BUTTON_pressed was running", "info");
      writeLog(sm72tc, "Exception: " + ex + " line number " + ex.lineNumber, "error");
    }
  }
  this.ITSHP_DELETE_PUSH_BUTTON_pressed = function () {
    try {
      this.itSystemHandlingPage.deleteButtonPressEvent();
    } catch (ex) {
      writeLog(sm72tc, "Action ITSHP_DELETE_PUSH_BUTTON_pressed was running", "info");
      writeLog(sm72tc, "Exception: " + ex + " line number " + ex.lineNumber, "error");
    }
  }
  this.ITSHP_SEARCH_BOX_changed = function () {
    try {
      this.itSystemHandlingPage.searchBoxChangeEvent();
    } catch (ex) {
      writeLog(sm72tc, "Action ITSHP_SEARCH_BOX_changed was running", "info");
      writeLog(sm72tc, "Exception: " + ex + " line number " + ex.lineNumber, "error");
    }
  }
  this.ITSHP_EDIT_PUSH_BUTTON_pressed = function () {
    try {
      var object = this.itSystemHandlingPage.getSelectedObject();
      var dialogFunction = new EditOrCreateNewObjectSubDialog(null, object, FadModelManager.itSystemType, this.locale, true, MainDialog.itSystemsPageNumber);
      this.dialog.setSubDialog("EDIT_OR_CREATE_SUBDIALOG", dialogFunction, Constants.DIALOG_TYPE_ACTION, "Edit IT System");
    } catch (ex) {
      writeLog(sm72tc, "Action ITSHP_EDIT_PUSH_BUTTON_pressed was running", "info");
      writeLog(sm72tc, "Exception: " + ex + " line number " + ex.lineNumber, "error");
    }
    
  }
  this.ITSHP_SECOND_EDIT_PUSH_BUTTON_pressed = function () {
    try {
      var object = this.itSystemHandlingPage.getSelectedAssignedObject();
      var dialogFunction = new EditOrCreateNewObjectSubDialog(null, object, FadModelManager.itSystemType, this.locale, true, MainDialog.itSystemsPageNumber);
      this.dialog.setSubDialog("EDIT_OR_CREATE_SUBDIALOG", dialogFunction, Constants.DIALOG_TYPE_ACTION, "Edit IT System");
    } catch (ex) {
      writeLog(sm72tc, "Action ITSHP_SECOND_EDIT_PUSH_BUTTON_pressed was running", "info");
      writeLog(sm72tc, "Exception: " + ex + " line number " + ex.lineNumber, "error");
    }
    
  }
  this.ITSHP_NEW_PUSH_BUTTON_pressed = function () {
    
    try {
      var guid = this.cockpitHelper.getNewITSystemFolder(this.corporateKey);
      var dialogFunction = new EditOrCreateNewObjectSubDialog(guid, null, FadModelManager.itSystemType, this.locale, false, MainDialog.itSystemsPageNumber);
      this.dialog.setSubDialog("EDIT_OR_CREATE_SUBDIALOG", dialogFunction, Constants.DIALOG_TYPE_ACTION, "New IT System");
    } catch (ex) {
      writeLog(sm72tc, "Action ITSHP_NEW_PUSH_BUTTON_pressed was running", "info");
      writeLog(sm72tc, "Exception: " + ex + " line number " + ex.lineNumber, "error");
    }
    
  }
  
  
  this.RQHP_SUBGROUPS_TREE_BOX_selChanged = function (selection) {
    
    try {
      this.requirementHandlingPage.treeBoxChangeEvent(selection);
    } catch (ex) {
      writeLog(sm72tc, "Action RQHP_SUBGROUPS_TREE_BOX_selChanged was running", "info");
      writeLog(sm72tc, "Exception: " + ex + " line number " + ex.lineNumber, "error");
    }
  }
  this.RQHP_ADD_PUSH_BUTTON_pressed = function () {
    try {
      
      this.requirementHandlingPage.addButtonPressEvent(this.getFadModel());
    } catch (ex) {
      writeLog(sm72tc, "Action RQHP_ADD_PUSH_BUTTON_pressed was running", "info");
      writeLog(sm72tc, "Exception: " + ex + " line number " + ex.lineNumber, "error");
    }
  }
  this.RQHP_DELETE_PUSH_BUTTON_pressed = function () {
    try {
      this.requirementHandlingPage.deleteButtonPressEvent();
    } catch (ex) {
      writeLog(sm72tc, "Action RQHP_DELETE_PUSH_BUTTON_pressed was running", "info");
      writeLog(sm72tc, "Exception: " + ex + " line number " + ex.lineNumber, "error");
    }
  }
  this.RQHP_SEARCH_BOX_changed = function () {
    try {
      this.requirementHandlingPage.searchBoxChangeEvent();
    } catch (ex) {
      writeLog(sm72tc, "Action RQHP_SEARCH_BOX_changed was running", "info");
      writeLog(sm72tc, "Exception: " + ex + " line number " + ex.lineNumber, "error");
    }
  }
  this.RQHP_EDIT_PUSH_BUTTON_pressed = function () {
    try {
      var object = this.requirementHandlingPage.getSelectedObject();
      var dialogFunction = new EditOrCreateNewObjectSubDialog(null, object, FadModelManager.requirementType, this.locale, true, MainDialog.requirementPageNumber);
      this.dialog.setSubDialog("EDIT_OR_CREATE_SUBDIALOG", dialogFunction, Constants.DIALOG_TYPE_ACTION, "Edit Requirement");
    } catch (ex) {
      writeLog(sm72tc, "Action RQHP_EDIT_PUSH_BUTTON_pressed was running", "info");
      writeLog(sm72tc, "Exception: " + ex + " line number " + ex.lineNumber, "error");
    }
    
  }
  this.RQHP_SECOND_EDIT_PUSH_BUTTON_pressed = function () {
    try {
      var object = this.requirementHandlingPage.getSelectedAssignedObject();
      var dialogFunction = new EditOrCreateNewObjectSubDialog(null, object, FadModelManager.requirementType, this.locale, true, MainDialog.requirementPageNumber);
      this.dialog.setSubDialog("EDIT_OR_CREATE_SUBDIALOG", dialogFunction, Constants.DIALOG_TYPE_ACTION, "Edit Requirement");
    } catch (ex) {
      writeLog(sm72tc, "Action RQHP_SECOND_EDIT_PUSH_BUTTON_pressed was running", "info");
      writeLog(sm72tc, "Exception: " + ex + " line number " + ex.lineNumber, "error");
    }
    
  }
  this.RQHP_NEW_PUSH_BUTTON_pressed = function () {
    try {
      var guid = this.cockpitHelper.getNewRequirementFolder(this.corporateKey);
      var dialogFunction = new EditOrCreateNewObjectSubDialog(guid, null, FadModelManager.requirementType, this.locale, false, MainDialog.requirementPageNumber);
      this.dialog.setSubDialog("EDIT_OR_CREATE_SUBDIALOG", dialogFunction, Constants.DIALOG_TYPE_ACTION, "New Requirement");
    } catch (ex) {
      writeLog(sm72tc, "Action RQHP_NEW_PUSH_BUTTON_pressed was running", "info");
      writeLog(sm72tc, "Exception: " + ex + " line number " + ex.lineNumber, "error");
    }
  }
  
  
  this.RSHP_SUBGROUPS_TREE_BOX_selChanged = function (selection) {
    try {
      this.riskHandlingPage.treeBoxChangeEvent(selection);
    } catch (ex) {
      writeLog(sm72tc, "Action RSHP_SUBGROUPS_TREE_BOX_selChanged was running", "info");
      writeLog(sm72tc, "Exception: " + ex + " line number " + ex.lineNumber, "error");
    }
  }
  this.RSHP_ADD_PUSH_BUTTON_pressed = function () {
    try {
      this.riskHandlingPage.addButtonPressEvent(this.getFadModel());
    } catch (ex) {
      writeLog(sm72tc, "Action RSHP_ADD_PUSH_BUTTON_pressed was running", "info");
      writeLog(sm72tc, "Exception: " + ex + " line number " + ex.lineNumber, "error");
    }
  }
  this.RSHP_DELETE_PUSH_BUTTON_pressed = function () {
    try {
      this.riskHandlingPage.deleteButtonPressEvent();
    } catch (ex) {
      writeLog(sm72tc, "Action RSHP_DELETE_PUSH_BUTTON_pressed was running", "info");
      writeLog(sm72tc, "Exception: " + ex + " line number " + ex.lineNumber, "error");
    }
  }
  this.RSHP_SEARCH_BOX_changed = function () {
    try {
      this.riskHandlingPage.searchBoxChangeEvent();
    } catch (ex) {
      writeLog(sm72tc, "Action RSHP_SEARCH_BOX_changed was running", "info");
      writeLog(sm72tc, "Exception: " + ex + " line number " + ex.lineNumber, "error");
    }
  }
  this.RSHP_EDIT_PUSH_BUTTON_pressed = function () {
    try {
      var object = this.riskHandlingPage.getSelectedObject();
      var dialogFunction = new EditOrCreateNewObjectSubDialog(null, object, FadModelManager.riskType, this.locale, true, MainDialog.riskPageNumber);
      this.dialog.setSubDialog("EDIT_OR_CREATE_SUBDIALOG", dialogFunction, Constants.DIALOG_TYPE_ACTION, "Edit Risk");
    } catch (ex) {
      writeLog(sm72tc, "Action RSHP_EDIT_PUSH_BUTTON_pressed was running", "info");
      writeLog(sm72tc, "Exception: " + ex + " line number " + ex.lineNumber, "error");
    }
    
  }
  this.RSHP_SECOND_EDIT_PUSH_BUTTON_pressed = function () {
    try {
      var object = this.riskHandlingPage.getSelectedAssignedObject();
      var dialogFunction = new EditOrCreateNewObjectSubDialog(null, object, FadModelManager.riskType, this.locale, true, MainDialog.riskPageNumber);
      this.dialog.setSubDialog("EDIT_OR_CREATE_SUBDIALOG", dialogFunction, Constants.DIALOG_TYPE_ACTION, "Edit Risk");
    } catch (ex) {
      writeLog(sm72tc, "Action RSHP_SECOND_EDIT_PUSH_BUTTON_pressed was running", "info");
      writeLog(sm72tc, "Exception: " + ex + " line number " + ex.lineNumber, "error");
    }
    
  }
  this.RSHP_NEW_PUSH_BUTTON_pressed = function () {
    try {
      var guid = this.cockpitHelper.getNewRiskFolder(this.corporateKey);
      var dialogFunction = new EditOrCreateNewObjectSubDialog(guid, null, FadModelManager.riskType, this.locale, false, MainDialog.riskPageNumber);
      this.dialog.setSubDialog("EDIT_OR_CREATE_SUBDIALOG", dialogFunction, Constants.DIALOG_TYPE_ACTION, "New Risk");
    } catch (ex) {
      writeLog(sm72tc, "Action RSHP_NEW_PUSH_BUTTON_pressed was running", "info");
      writeLog(sm72tc, "Exception: " + ex + " line number " + ex.lineNumber, "error");
    }
    
  }
  
  this.WHP_SUBGROUPS_TREE_BOX_selChanged = function (selection) {
    try {
      this.weakPointHandlingPage.treeBoxChangeEvent(selection);
    } catch (ex) {
      writeLog(sm72tc, "Action WHP_SUBGROUPS_TREE_BOX_selChanged was running", "info");
      writeLog(sm72tc, "Exception: " + ex + " line number " + ex.lineNumber, "error");
    }
  }
  this.WHP_ADD_PUSH_BUTTON_pressed = function () {
    try {
      this.weakPointHandlingPage.addButtonPressEvent(this.getFadModel());
    } catch (ex) {
      writeLog(sm72tc, "Action WHP_ADD_PUSH_BUTTON_pressed was running", "info");
      writeLog(sm72tc, "Exception: " + ex + " line number " + ex.lineNumber, "error");
    }
  }
  this.WHP_DELETE_PUSH_BUTTON_pressed = function () {
    try {
      this.weakPointHandlingPage.deleteButtonPressEvent();
    } catch (ex) {
      writeLog(sm72tc, "Action WHP_DELETE_PUSH_BUTTON_pressed was running", "info");
      writeLog(sm72tc, "Exception: " + ex + " line number " + ex.lineNumber, "error");
    }
  }
  this.WHP_SEARCH_BOX_changed = function () {
    try {
      this.weakPointHandlingPage.searchBoxChangeEvent();
    } catch (ex) {
      writeLog(sm72tc, "Action WHP_SEARCH_BOX_changed was running", "info");
      writeLog(sm72tc, "Exception: " + ex + " line number " + ex.lineNumber, "error");
    }
  }
  this.WHP_EDIT_PUSH_BUTTON_pressed = function () {
    
    try {
      var object = this.weakPointHandlingPage.getSelectedObject();
      var dialogFunction = new EditOrCreateNewObjectSubDialog(null, object, FadModelManager.weakPointType, this.locale, true, MainDialog.weakPointPageNumber);
      this.dialog.setSubDialog("EDIT_OR_CREATE_SUBDIALOG", dialogFunction, Constants.DIALOG_TYPE_ACTION, "Edit Weak point");
    } catch (ex) {
      writeLog(sm72tc, "Action WHP_EDIT_PUSH_BUTTON_pressed was running", "info");
      writeLog(sm72tc, "Exception: " + ex + " line number " + ex.lineNumber, "error");
    }
    
  }
  this.WHP_SECOND_EDIT_PUSH_BUTTON_pressed = function () {
    try {
      var object = this.weakPointHandlingPage.getSelectedAssignedObject();
      var dialogFunction = new EditOrCreateNewObjectSubDialog(null, object, FadModelManager.weakPointType, this.locale, true, MainDialog.weakPointPageNumber);
      this.dialog.setSubDialog("EDIT_OR_CREATE_SUBDIALOG", dialogFunction, Constants.DIALOG_TYPE_ACTION, "Edit Weak point");
    } catch (ex) {
      writeLog(sm72tc, "Action WHP_SECOND_EDIT_PUSH_BUTTON_pressed was running", "info");
      writeLog(sm72tc, "Exception: " + ex + " line number " + ex.lineNumber, "error");
    }
    
  }
  this.WHP_NEW_PUSH_BUTTON_pressed = function () {
    try {
      var guid = this.cockpitHelper.getNewWeakPointFolder(this.corporateKey);
      var dialogFunction = new EditOrCreateNewObjectSubDialog(guid, null, FadModelManager.weakPointType, this.locale, false, MainDialog.weakPointPageNumber);
      this.dialog.setSubDialog("EDIT_OR_CREATE_SUBDIALOG", dialogFunction, Constants.DIALOG_TYPE_ACTION, "New Weak point");
    } catch (ex) {
      writeLog(sm72tc, "Action WHP_NEW_PUSH_BUTTON_pressed was running", "info");
      writeLog(sm72tc, "Exception: " + ex + " line number " + ex.lineNumber, "error");
    }
    
  }
  
  
  this.TSHP_SUBGROUPS_TREE_BOX_selChanged = function (selection) {
    try {
      this.taskHandlingPage.treeBoxChangeEvent(selection);
    } catch (ex) {
      writeLog(sm72tc, "Action TSHP_SUBGROUPS_TREE_BOX_selChanged was running", "info");
      writeLog(sm72tc, "Exception: " + ex + " line number " + ex.lineNumber, "error");
    }
  }
  this.TSHP_ADD_PUSH_BUTTON_pressed = function () {
    try {
      this.taskHandlingPage.addButtonPressEvent(this.getFadModel());
    } catch (ex) {
      writeLog(sm72tc, "Action TSHP_ADD_PUSH_BUTTON_pressed was running", "info");
      writeLog(sm72tc, "Exception: " + ex + " line number " + ex.lineNumber, "error");
    }
  }
  this.TSHP_DELETE_PUSH_BUTTON_pressed = function () {
    try {
      this.taskHandlingPage.deleteButtonPressEvent();
    } catch (ex) {
      writeLog(sm72tc, "Action TSHP_DELETE_PUSH_BUTTON_pressed was running", "info");
      writeLog(sm72tc, "Exception: " + ex + " line number " + ex.lineNumber, "error");
    }
  }
  this.TSHP_SEARCH_BOX_changed = function () {
    try {
      this.taskHandlingPage.searchBoxChangeEvent();
    } catch (ex) {
      writeLog(sm72tc, "Action TSHP_SEARCH_BOX_changed was running", "info");
      writeLog(sm72tc, "Exception: " + ex + " line number " + ex.lineNumber, "error");
    }
  }
  this.TSHP_EDIT_PUSH_BUTTON_pressed = function () {
    try {
      var object = this.taskHandlingPage.getSelectedObject();
      var dialogFunction = new EditOrCreateNewObjectSubDialog(null, object, FadModelManager.taskType, this.locale, true, MainDialog.taskPageNumber);
      this.dialog.setSubDialog("EDIT_OR_CREATE_SUBDIALOG", dialogFunction, Constants.DIALOG_TYPE_ACTION, "Edit Relevant process initiative");
    } catch (ex) {
      writeLog(sm72tc, "Action TSHP_EDIT_PUSH_BUTTON_pressed was running", "info");
      writeLog(sm72tc, "Exception: " + ex + " line number " + ex.lineNumber, "error");
    }
  }
  this.TSHP_SECOND_EDIT_PUSH_BUTTON_pressed = function () {
    try {
      var object = this.taskHandlingPage.getSelectedAssignedObject();
      var dialogFunction = new EditOrCreateNewObjectSubDialog(null, object, FadModelManager.taskType, this.locale, true, MainDialog.taskPageNumber);
      this.dialog.setSubDialog("EDIT_OR_CREATE_SUBDIALOG", dialogFunction, Constants.DIALOG_TYPE_ACTION, "Edit Relevant process initiative");
    } catch (ex) {
      writeLog(sm72tc, "Action TSHP_SECOND_EDIT_PUSH_BUTTON_pressed was running", "info");
      writeLog(sm72tc, "Exception: " + ex + " line number " + ex.lineNumber, "error");
    }
  }
  this.TSHP_NEW_PUSH_BUTTON_pressed = function () {
    
    try {
      var guid = this.cockpitHelper.getNewTaskFolder(this.corporateKey);
      var dialogFunction = new EditOrCreateNewObjectSubDialog(guid, null, FadModelManager.taskType, this.locale, false, MainDialog.taskPageNumber);
      this.dialog.setSubDialog("EDIT_OR_CREATE_SUBDIALOG", dialogFunction, Constants.DIALOG_TYPE_ACTION, "New Relevant process initiative");
    } catch (ex) {
      writeLog(sm72tc, "Action TSHP_NEW_PUSH_BUTTON_pressed was running", "info");
      writeLog(sm72tc, "Exception: " + ex + " line number " + ex.lineNumber, "error");
    }
  }
  
  
  this.DMP_SUBGROUPS_TREE_BOX_selChanged = function (selection) {
    try {
      this.docummentsHandlingPage.treeBoxChangeEvent(selection);
    } catch (ex) {
      writeLog(sm72tc, "Action DMP_SUBGROUPS_TREE_BOX_selChanged was running", "info");
      writeLog(sm72tc, "Exception: " + ex + " line number " + ex.lineNumber, "error");
    }
  }
  this.DMP_ADD_PUSH_BUTTON_pressed = function () {
    try {
      this.docummentsHandlingPage.addButtonPressEvent(this.getFadModel());
    } catch (ex) {
      writeLog(sm72tc, "Action DMP_ADD_PUSH_BUTTON_pressed was running", "info");
      writeLog(sm72tc, "Exception: " + ex + " line number " + ex.lineNumber, "error");
    }
  }
  this.DMP_DELETE_PUSH_BUTTON_pressed = function () {
    try {
      this.docummentsHandlingPage.deleteButtonPressEvent();
    } catch (ex) {
      writeLog(sm72tc, "Action DMP_DELETE_PUSH_BUTTON_pressed was running", "info");
      writeLog(sm72tc, "Exception: " + ex + " line number " + ex.lineNumber, "error");
    }
  }
  this.DMP_SEARCH_BOX_changed = function () {
    try {
      this.docummentsHandlingPage.searchBoxChangeEvent();
    } catch (ex) {
      writeLog(sm72tc, "Action DMP_SEARCH_BOX_changed was running", "info");
      writeLog(sm72tc, "Exception: " + ex + " line number " + ex.lineNumber, "error");
    }
  }
  this.DMP_EDIT_PUSH_BUTTON_pressed = function () {
    try {
      var object = this.docummentsHandlingPage.getSelectedObject();
      var dialogFunction = new EditOrCreateNewObjectSubDialog(null, object, FadModelManager.documentType, this.locale, true, MainDialog.documentPageNumber);
      this.dialog.setSubDialog("EDIT_OR_CREATE_SUBDIALOG", dialogFunction, Constants.DIALOG_TYPE_ACTION, "Edit document");
    } catch (ex) {
      writeLog(sm72tc, "Action DMP_EDIT_PUSH_BUTTON_pressed was running", "info");
      writeLog(sm72tc, "Exception: " + ex + " line number " + ex.lineNumber, "error");
    }
    
  }
  this.DMP_SECOND_EDIT_PUSH_BUTTON_pressed = function () {
    try {
      var object = this.docummentsHandlingPage.getSelectedAssignedObject();
      var dialogFunction = new EditOrCreateNewObjectSubDialog(null, object, FadModelManager.documentType, this.locale, true, MainDialog.documentPageNumber);
      this.dialog.setSubDialog("EDIT_OR_CREATE_SUBDIALOG", dialogFunction, Constants.DIALOG_TYPE_ACTION, "Edit document");
    } catch (ex) {
      writeLog(sm72tc, "Action DMP_SECOND_EDIT_PUSH_BUTTON_pressed was running", "info");
      writeLog(sm72tc, "Exception: " + ex + " line number " + ex.lineNumber, "error");
    }
  }
  this.DMP_NEW_PUSH_BUTTON_pressed = function () {
    
    try {
      var guid = this.cockpitHelper.getNewDocumentFolder(this.corporateKey);
      var dialogFunction = new EditOrCreateNewObjectSubDialog(guid, null, FadModelManager.documentType, this.locale, false, MainDialog.documentPageNumber);
      this.dialog.setSubDialog("EDIT_OR_CREATE_SUBDIALOG", dialogFunction, Constants.DIALOG_TYPE_ACTION, "New document");
    } catch (ex) {
      writeLog(sm72tc, "Action DMP_NEW_PUSH_BUTTON_pressed was running", "info");
      writeLog(sm72tc, "Exception: " + ex + " line number " + ex.lineNumber, "error");
      
    }
    
  }
  
  
  this.CIPHP_SUBGROUPS_TREE_BOX_selChanged = function (selection) {
    try {
      this.customersTouchPointPage.treeBoxChangeEvent(selection);
    } catch (ex) {
      writeLog(sm72tc, "Action CIPHP_SUBGROUPS_TREE_BOX_selChanged was running", "info");
      writeLog(sm72tc, "Exception: " + ex + " line number " + ex.lineNumber, "error");
    }
  }
  this.CIPHP_ADD_PUSH_BUTTON_pressed = function () {
    try {
      this.customersTouchPointPage.addButtonPressEvent(this.getFadModel());
    } catch (ex) {
      writeLog(sm72tc, "Action CIPHP_ADD_PUSH_BUTTON_pressed was running", "info");
      writeLog(sm72tc, "Exception: " + ex + " line number " + ex.lineNumber, "error");
    }
  }
  this.CIPHP_DELETE_PUSH_BUTTON_pressed = function () {
    try {
      this.customersTouchPointPage.deleteButtonPressEvent();
    } catch (ex) {
      writeLog(sm72tc, "Action WHP_DELETE_PUSH_BUTTON_pressed was running", "info");
      writeLog(sm72tc, "Exception: " + ex + " line number " + ex.lineNumber, "error");
    }
  }
  this.CIPHP_SEARCH_BOX_changed = function () {
    try {
      this.customersTouchPointPage.searchBoxChangeEvent();
    } catch (ex) {
      writeLog(sm72tc, "Action WHP_SEARCH_BOX_changed was running", "info");
      writeLog(sm72tc, "Exception: " + ex + " line number " + ex.lineNumber, "error");
    }
  }
  this.CIPHP_EDIT_PUSH_BUTTON_pressed = function () {
    
    try {
      var object = this.customersTouchPointPage.getSelectedObject();
      var dialogFunction = new EditOrCreateNewObjectSubDialog(null, object, FadModelManager.customerTouchingPointType, this.locale, true, MainDialog.customerTouchPointsPageNumber);
      this.dialog.setSubDialog("EDIT_OR_CREATE_SUBDIALOG", dialogFunction, Constants.DIALOG_TYPE_ACTION, "Edit Customer Touching Point");
    } catch (ex) {
      writeLog(sm72tc, "Action CIPHP_EDIT_PUSH_BUTTON_pressed was running", "info");
      writeLog(sm72tc, "Exception: " + ex + " line number " + ex.lineNumber, "error");
    }
    
  }
  this.CIPHP_SECOND_EDIT_PUSH_BUTTON_pressed = function () {
    try {
      var object = this.customersTouchPointPage.getSelectedAssignedObject();
      var dialogFunction = new EditOrCreateNewObjectSubDialog(null, object, FadModelManager.customerTouchingPointType, this.locale, true, MainDialog.customerTouchPointsPageNumber);
      this.dialog.setSubDialog("EDIT_OR_CREATE_SUBDIALOG", dialogFunction, Constants.DIALOG_TYPE_ACTION, "Edit Customer Touching Point");
    } catch (ex) {
      writeLog(sm72tc, "Action CIPHP_SECOND_EDIT_PUSH_BUTTON_pressed was running", "info");
      writeLog(sm72tc, "Exception: " + ex + " line number " + ex.lineNumber, "error");
    }
    
  }
  this.CIPHP_NEW_PUSH_BUTTON_pressed = function () {
    try {
      var guid = this.cockpitHelper.getNewCustomerInteractionPointFolder(this.corporateKey);
      var dialogFunction = new EditOrCreateNewObjectSubDialog(guid, null, FadModelManager.customerTouchingPointType, this.locale, false, MainDialog.customerTouchPointsPageNumber);
      this.dialog.setSubDialog("EDIT_OR_CREATE_SUBDIALOG", dialogFunction, Constants.DIALOG_TYPE_ACTION, "New Customer Touching Point");
    } catch (ex) {
      writeLog(sm72tc, "Action CIPHP_NEW_PUSH_BUTTON_pressed was running", "info");
      writeLog(sm72tc, "Exception: " + ex + " line number " + ex.lineNumber, "error");
    }
    
  }
  
  
  this.EDIT_OR_CREATE_SUBDIALOG_subDialogClosed = function (subResult, bOk) {
    
    try {
      if (!subResult.isOk) return false;
      if (!subResult.isEdit) {
  
        writeLog(sm72tc, "Action EDIT_OR_CREATE_SUBDIALOG_subDialogClosed was running", "info");
        if (!BaseDialog.isNullOrEmpty(subResult.object)) return false;
        writeLog(sm72tc, "Action EDIT_OR_CREATE_SUBDIALOG_subDialogClosed was in creation mode", "info");
  
        var group = ArisData.getActiveDatabase().FindGUID(subResult.folderGUID, Constants.CID_GROUP);
       
        if (BaseDialog.isArisObjectNullOrInvalid(group)) return false;
        writeLog(sm72tc, "Action EDIT_OR_CREATE_SUBDIALOG_subDialogClosed found a group " + subResult.folderGUID, "info");
  
        var object = group.CreateObjDef(subResult.objectType, subResult.newName, this.locale);
        object.Attribute(Constants.AT_DESC, this.locale).setValue(subResult.newDescription);
        this.reloadPage(subResult.page);
        return true;
        
      }
      
      if (BaseDialog.isNullOrEmpty(subResult.object)) return false;
      subResult.object.Attribute(Constants.AT_NAME, this.locale).setValue(subResult.newName);
      subResult.object.Attribute(Constants.AT_DESC, this.locale).setValue(subResult.newDescription);
      this.reloadPage(subResult.page);
    } catch (ex) {
      writeLog(sm72tc, "Action EDIT_OR_CREATE_SUBDIALOG_subDialogClosed was running", "info");
      writeLog(sm72tc, "Exception: " + ex + " line number " + ex.lineNumber, "error");
      
    }
  }
}

MainDialog.prototype = Object.create(BaseDialog.prototype);
MainDialog.prototype.constructor = MainDialog;

MainDialog.attributesPageNumber = 0;
MainDialog.processOwnerPageNumber = 1;
MainDialog.objectivePageNumber = 2;
MainDialog.inputOutputPageNumber = 3; // OT_APPL_SYS_TYPE
MainDialog.servicePageNumber = 4;
MainDialog.documentPageNumber = 5;    // OT_INFO_CARR
MainDialog.dividerPageNumber = 6

MainDialog.committeePageNumber = 7;  // OT_GRP
MainDialog.assumptionPageNumber = 8;  // OT_ASSUMPTION
MainDialog.gapPageNumber = 9; // OT_GAP
MainDialog.itSystemsPageNumber = 10; // OT_APPL_SYS_TYPE
MainDialog.managementRelevancePageNumber = 11;
MainDialog.taskPageNumber = 12;
MainDialog.divider2PageNumber = 13

MainDialog.requirementPageNumber = 14
MainDialog.riskPageNumber = 15;
MainDialog.weakPointPageNumber = 16;
MainDialog.bussinesCapabilityPageNumber = 17;  // OT_IS_FUNC
MainDialog.customerTouchPointsPageNumber = 18;


MainDialog.prototype.getCurrentFADContent = function (contentObjectType) {
  
  var existingFadModels = this.mainObject.AssignedModels(Constants.MT_FUNC_ALLOC_DGM);
  if (BaseDialog.isNullOrEmpty(existingFadModels)) return [];
  
  return this.loadTypedObjOccFromModel(existingFadModels[0], contentObjectType);
}

MainDialog.prototype.getFadModel = function () {
  
  var existingFadModels = this.mainObject.AssignedModels(Constants.MT_FUNC_ALLOC_DGM);
  if (BaseDialog.isNullOrEmpty(existingFadModels)) return null;
  if (BaseDialog.isArisObjectNullOrInvalid(existingFadModels[0])) return null;
  
  return existingFadModels[0];
}

MainDialog.prototype.createDividerPage = function () {
  
  var page = Dialogs.createNewDialogTemplate(BaseDialog.templateWidth, BaseDialog.templateHeight, "═════════════════════");
  page.Text(5, BaseDialog.halfHeight, BaseDialog.templateWidth - 5, 60, BaseDialog.getStringFromStringTable("DIVIDER_PAGE_LABEL_TEXT", this.locale), "INFO_TEXT");
  return page;
}

MainDialog.prototype.reloadPage = function (page) {
  
  switch (page) {
    
    case MainDialog.objectivePageNumber:
      this.objectiveHandlingPage.init(this.getFadModel());
      break;
    case MainDialog.inputOutputPageNumber:
      this.inputOutputHandlingPage.init(this.getFadModel());
      break;
    case MainDialog.servicePageNumber:
      this.serviceHandlingPage.init(this.getFadModel());
      break;
    case MainDialog.gapPageNumber:
      this.gapHandlingPage.init(this.getFadModel());
      break;
    case MainDialog.documentPageNumber:
      this.docummentsHandlingPage.init(this.getFadModel());
      break;
    case MainDialog.assumptionPageNumber:
      this.assumptionHandlingPage.init((this.getFadModel()));
      break;
    case MainDialog.bussinesCapabilityPageNumber :
      this.bussinessCapabilityHandlingPage.init(this.getFadModel());
      break;
    case MainDialog.committeePageNumber:
      this.committeesHandlingPage.init(this.getFadModel());
      break;
    case MainDialog.itSystemsPageNumber:
      this.itSystemHandlingPage.init(this.getFadModel());
      break;
    case MainDialog.requirementPageNumber:
      this.requirementHandlingPage.init(this.getFadModel());
      break;
    case MainDialog.riskPageNumber:
      this.riskHandlingPage.init(this.getFadModel());
      break;
    case MainDialog.weakPointPageNumber:
      this.weakPointHandlingPage.init(this.getFadModel());
      break;
    case MainDialog.taskPageNumber:
      this.taskHandlingPage.init(this.getFadModel());
      break;
    case MainDialog.customerTouchPointsPageNumber:
      this.customersTouchPointPage.init(this.getFadModel());
      break;
    default:
      writeLog(sm72tc,"Page(" + page + ") for reloading was not found","error");
      break;
  }
}
