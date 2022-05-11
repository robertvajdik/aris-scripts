function emailParameters() {
    this.getParameters = function() {
        return {
            sendEmail           : true,
            successTemplateFilePath    : "c:\\Datalink\\templates\\SuccessAudiExport.html",
            errorTemplateFilePath    : "c:\\Datalink\\templates\\ErrorAudiExport.html",
            inputsFile          : ["C:\\Datalink\\templates\\image_001.png","C:\\Datalink\\templates\\image_002.jpg","C:\\Datalink\\templates\\image_003.jpg","C:\\Datalink\\templates\\image_005.jpg"],
            emailAddressTo      : "daniel.masek@skoda-auto.cz;ext.pavel.gajdusek@skoda-auto.cz;ext.zdenek.kocourek@skoda-auto.cz;pavel.gajdusek@idsa.cz",
            emailAddressCc      : "aris@skoda-auto.cz",
            emailSubjectSuccess       : "Export AUDI XML done without error",
            emailSubjectError         : "Export AUDI XML done with error"
        };
    }
}
