function emailParameters() {
    this.getParameters = function() {
        return {
            sendEmail           : true,
            successTemplateFilePath    : "c:\\Datalink\\templates\\Success.html",
            errorTemplateFilePath    : "c:\\Datalink\\templates\\Error.html",
            successTemplateFilePathGeneral    : "c:\\Datalink\\templates\\SuccessGeneral.html",
            errorTemplateFilePathGeneral    : "c:\\Datalink\\templates\\ErrorGeneral.html",
            inputsFile          : ["C:\\Datalink\\templates\\image_001.png","C:\\Datalink\\templates\\image_002.jpg","C:\\Datalink\\templates\\image_003.jpg","C:\\Datalink\\templates\\image_005.jpg"],
            //emailAddressTo      : "ext.pavel.gajdusek@skoda-auto.cz;ext.Zdenek.Kocourek2@skoda-auto.cz;daniel.masek@skoda-auto.cz",
            emailAddressTo      : "Eva.Vasickova@skoda-auto.cz;Katerina.Stadnikova@skoda-auto.cz;Adam.Kudrnac@skoda-auto.cz",
            emailAddressTo_EventStorm : "ext.Zdenek.Kocourek2@skoda-auto.cz",
            emailAddressTo_P2P        : "daniel.masek@skoda-auto.cz",
            emailAddressCc      : "aris@skoda-auto.cz",
            emailSubject                     : "Informace o importu IT systémů ze systému LeanIX do systému ARIS",
            //emailSubjectEN                   : "Notification of IT Systems synchronisation from LeanIX to ARIS",
            emailSubjectLeanIXsuccess        : "Úspěšný import IT systémů ze systému LeanIX do ARIS!",
            emailSubjectLeanIXerror          : "Neúspěšný import IT systémů ze systému LeanIX do ARIS!",
            emailSubjectLeanIXsuccess_EN : "Successful import of IT systems from LeanIX to ARIS!",
            emailSubjectLeanIXerror_EN   : "Unsuccessful import of IT systems from LeanIX to ARIS!",
            
            //emailSubjectIS_EventStorm        : "Informace o importu IT systémů ze systému LeanIX do systému ARIS",
            emailSubjectSuccessIS_EventStorm : "Successful import of IT systems from LeanIX to ARIS - Eventstorm DB!",
            emailSubjectErrorIS_EventStorm   : "Unsuccessful import of IT systems from LeanIX to ARIS - Eventstorm DB!",
            emailSubjectSuccessCAP_EventStorm : "Successful import of Capabilites from LeanIX to ARIS - Eventstorm DB!",
            emailSubjectErrorCAP_EventStorm   : "Unsuccessful import of Capabilites from LeanIX to ARIS - Eventstorm DB!",
        };
    }
}
