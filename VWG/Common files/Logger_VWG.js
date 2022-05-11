function Logfile() {
    var writer = null;

    this.init = function(sLogMode, sPath, sPrefixName) {
        var sLogfileName = "";
        
        if (sLogMode == "append") {
            sLogfileName = sPrefixName; // + ".txt";
        } else if (sLogMode == "new") {
            sLogfileName = sPrefixName + "[" + getCurrentDateString() + "].txt";
        }
        
        if (sLogfileName != "") {
            var sLogFile = sPath + sLogfileName;
            
            if (sPath != "") {
                try {
                    var file = new java.File(sLogFile);
                    writer = new java.BufferedWriter(new java.FileWriter(file, true));
                } catch (ex) {
                    writer = null;
                }
            }
        }
    }
    
    this.writeLogEntry = function(sType, sMessage) {
        if (writer != null) {
            var sText = new java.String(getCurrentDateString() + "   " + sType + ": " + sMessage);
            writer.write(sText, 0, sText.length());
            writer.newLine();
            writer.flush();
        }
    }
    
    this.close = function() {
        if (writer != null) {
            writer.flush();
            writer.close();
        }
    }
}

function getCurrentDateString() {
    return new java.SimpleDateFormat("[dd/MM/yyyy HH:mm:ss]").format(new java.Date());
}