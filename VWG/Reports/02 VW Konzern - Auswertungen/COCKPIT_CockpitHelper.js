
function CockpitHelper(database) {

  this.subGroups = database.RootGroup().Childs();
  this.xmlConfiguration = Context.getFile("ModellObjektDialog.xml", Constants.LOCATION_COMMON_FILES);
  this.xmlRoot = null;
}

CockpitHelper.BaseCorporateKey = "0000";

CockpitHelper.prototype.getCorporateKey = function(model,locale) {

    if (BaseDialog.isNullOrEmpty(this.subGroups)) return CockpitHelper.BaseCorporateKey;

    var modelGroup = model.Group();

    var found = this.subGroups.filter(function(group) {
        return modelGroup.IsChildGroupOf(group);
    });


    if (found.length === 0 || found.length > 1) return CockpitHelper.BaseCorporateKey;
    var corporateGroupName = found[0].Name(locale);
    return corporateGroupName.length < 5 ? CockpitHelper.BaseCorporateKey : corporateGroupName.substring(0,4);
}

CockpitHelper.prototype.getXMLChild = function(child) {

    if (this.xmlConfiguration === null || this.xmlConfiguration.length === 0) return "";
    if (this.xmlRoot === null) this.xmlRoot = Context.getXMLParser(this.xmlConfiguration).getRootElement();
    return this.xmlRoot.getChild(child);
}

CockpitHelper.prototype.getCockpitChildText = function(corporateKey, child) {

    var corporateConfiguration = this.getXMLChild("a"+ corporateKey);
    if (corporateConfiguration === null) return "";
    return corporateConfiguration.getChild("Cockpit").getChildText(child);
}

CockpitHelper.prototype.getChildText = function(corporateKey, child) {

    var corporateConfiguration = this.getXMLChild("a"+ corporateKey);
    if (corporateConfiguration === null) return "";
    return corporateConfiguration.getChildText(child);
}

CockpitHelper.prototype.getManagementTopicModel = function(corporateKey) {

    return this.getChildText(corporateKey,"ManagementTopics");
}

CockpitHelper.prototype.getManagementSystemModel = function(corporateKey) {

    return this.getChildText(corporateKey,"ManagementSystems");
}

CockpitHelper.prototype.getDocumentFolder = function (corporateKey) {
    return this.getCockpitChildText(corporateKey,"Document");
}

CockpitHelper.prototype.getNewDocumentFolder = function (corporateKey) {
    return this.getCockpitChildText(corporateKey,"newDocument");
}

CockpitHelper.prototype.getProcessOwnerFolder = function (corporateKey) {
    return this.getCockpitChildText(corporateKey,"processOwner");
}

CockpitHelper.prototype.getInputOutputFolder = function (corporateKey) {
    return this.getCockpitChildText(corporateKey,"InputOutput");
}

CockpitHelper.prototype.getNewInputOutputFolder = function (corporateKey) {
    return this.getCockpitChildText(corporateKey,"newInputOutput");
}

CockpitHelper.prototype.getObjectiveFolder = function(corporateKey) {
    return this.getCockpitChildText(corporateKey,"Objective");
}

CockpitHelper.prototype.getNewObjectiveFolder = function (corporateKey) {
    return this.getCockpitChildText(corporateKey,"newObjective");
}

CockpitHelper.prototype.getServiceFolder = function (corporateKey) {
    return this.getCockpitChildText(corporateKey,"Service");
}

CockpitHelper.prototype.getNewServiceFolder = function(corporateKey) {
    return this.getCockpitChildText(corporateKey,"newService");
}

CockpitHelper.prototype.getAssumptionFolder = function(corporateKey) {
    return this.getCockpitChildText(corporateKey,"Assumption");
}

CockpitHelper.prototype.getNewAssumptionFolder = function(corporateKey) {
    return this.getCockpitChildText(corporateKey,"newAssumption");
}

CockpitHelper.prototype.getBusinessCapabilityFolder = function(corporateKey) {
    return this.getCockpitChildText(corporateKey,"BusinessCapability");
}

CockpitHelper.prototype.getNewBusinessCapabilityFolder = function(corporateKey) {
    return this.getCockpitChildText(corporateKey,"newBusinessCapability");
}

CockpitHelper.prototype.getCommitteeFolder = function(corporateKey) {
    return this.getCockpitChildText(corporateKey,"Committee");
}

CockpitHelper.prototype.getNewCommitteeFolder = function(corporateKey) {
    return this.getCockpitChildText(corporateKey,"newCommittee");
}




CockpitHelper.prototype.getGapFolder = function(corporateKey) {
    return this.getCockpitChildText(corporateKey,"Gap");
}

CockpitHelper.prototype.getNewGapFolder = function(corporateKey) {
    return this.getCockpitChildText(corporateKey,"newGap");
}

CockpitHelper.prototype.getITSystemFolder = function(corporateKey) {
    return this.getCockpitChildText(corporateKey,"ITSystem");
}

CockpitHelper.prototype.getNewITSystemFolder = function(corporateKey) {
    return this.getCockpitChildText(corporateKey,"newITSystem");
}

CockpitHelper.prototype.getRequirementFolder = function(corporateKey) {
    return this.getCockpitChildText(corporateKey,"Requirement");
}

CockpitHelper.prototype.getNewRequirementFolder = function(corporateKey) {
    return this.getCockpitChildText(corporateKey,"newRequirement");
}

CockpitHelper.prototype.getRiskFolder = function(corporateKey) {
    return this.getCockpitChildText(corporateKey,"Risk");
}

CockpitHelper.prototype.getNewRiskFolder = function(corporateKey) {
    return this.getCockpitChildText(corporateKey,"newRisk");
}

CockpitHelper.prototype.getWeakPointFolder = function(corporateKey) {
    return this.getCockpitChildText(corporateKey,"Weakpoint");
}

CockpitHelper.prototype.getNewWeakPointFolder = function(corporateKey) {
    return this.getCockpitChildText(corporateKey,"newWeakPoint");
}

CockpitHelper.prototype.getTaskFolder = function(corporateKey) {
    return this.getCockpitChildText(corporateKey,"Task");
}

CockpitHelper.prototype.getNewTaskFolder = function(corporateKey) {
    return this.getCockpitChildText(corporateKey,"newTask");
}

CockpitHelper.prototype.getProcessIdentifierFolder = function(corporateKey) {
    return this.getCockpitChildText(corporateKey,"ProcessIdentifier");
}

CockpitHelper.prototype.getKPIFolder = function (corporateKey) {
    return this.getCockpitChildText(corporateKey,"KPI");
}

CockpitHelper.prototype.getNewKPIFolder = function (corporateKey) {
    return this.getCockpitChildText(corporateKey, "newKPI");

}