function emailParameters() {
    this.getParameters = function() {
        return {
            sendEmail           : true,
            successTemplateFilePath    : "c:\\Datalink\\templates\\Success.html",
            errorTemplateFilePath    : "c:\\Datalink\\templates\\Error.html",
            // DM Edit
            successTemplateFilePathGeneral    : "c:\\Datalink\\templates\\SuccessGeneral.html",
            errorTemplateFilePathGeneral    : "c:\\Datalink\\templates\\ErrorGeneral.html",
            inputsFile                  : ["C:\\Datalink\\templates\\image_001.png","C:\\Datalink\\templates\\image_002.jpg","C:\\Datalink\\templates\\image_003.jpg","C:\\Datalink\\templates\\image_005.jpg"],
            emailAddressTo              : "Eva.Vasickova@skoda-auto.cz;Katerina.Stadnikova@skoda-auto.cz",
            //emailAddressTo              : "ext.Zdenek.Kocourek2@skoda-auto.cz;ext.pavel.gajdusek@skoda-auto.cz",
            emailAddressCc              : "aris@skoda-auto.cz",
            emailSubject                : "Informace o importu data do systému ARIS",
            // DM Edit
            emailSubjectHRsuccess       : "Úspěšný import organizačních jednotek do ARIS!",
            emailSubjectHRerror         : "Neúspěšný import organizačních jednotek do ARIS!",
            emailSubjectPODsuccess      : "Úspěšný importu dokumentů do ARIS!",
            emailSubjectPODerror        : "Neúspěšný importu dokumentů do ARIS!",
            
          };
    }
}
