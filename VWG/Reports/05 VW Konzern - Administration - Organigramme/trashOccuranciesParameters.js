function trashOccurranciesParameters() {
    this.getParameters = function() {
        return {
            occuranciesType     : "43;45;46",
            modelsType          : "1",
            sendEmail           : true,
            templateFilePath    : "c:\\Datalink\\templates\\Occurrancies.htm",
            inputsFile          : ["C:\\Datalink\\templates\\image_001.png","C:\\Datalink\\templates\\image_002.jpg","C:\\Datalink\\templates\\image_003.jpg","C:\\Datalink\\templates\\image_004.jpg"],
            emailAddressTo      : "michaela.rabarova@volkswagen.sk;alexandra.petrikova@volkswagen.sk",
            emailAddressCc      : "aris@skoda-auto.cz",
            emailSubject        : "DataLink HR Trash object occurrencies report",
            sendReport          : true,
            deleteEmptyGroup    : true,
            outputFolder        : "C:\\Datalink\\reports"
        };
    }
}
