function personDeleteParameters() {
    this.getParameters = function() {
        return {
            occuranciesType : "46",
            deletePeriod : 3,
            templateFilePath  : "C:\\Datalink\\templates\\Persons.htm",
            inputsFile        : ["C:\\Datalink\\templates\\image_001.png","C:\\Datalink\\templates\\image_002.jpg","C:\\Datalink\\templates\\image_003.jpg","C:\\Datalink\\templates\\image_004.jpg"], 
            emailAddressTo : "ext.pavel.gajdusek@skoda-auto.cz",
            emailAddressCc : "ext.zdenek.kocourek2@skoda-auto.cz;daniel.masek@skoda-auto.cz",
            emailSubject: "Trash person delete report",
            sendLog: true,
            deleteEmptyGroup: true,
            outputFolder : "C:\\Datalink\\reports"
          };
    }
}
