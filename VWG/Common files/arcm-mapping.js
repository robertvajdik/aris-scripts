/**
 * Copyright (C) 2020 Software AG, Darmstadt, Germany and/or Software AG USA Inc., Reston, VA, USA,
 * and/or its subsidiaries and/or its affiliates and/or their licensors.
 *
 * Use, reproduction, transfer, publication or disclosure is prohibited
 * except as specifically provided for in your License Agreement with Software AG.
 *
 * Version: 10.0.12.0.1470486
 */

var g_mappingFileName = "aris2arcm-mapping.xml";
var g_xmlConfigReader = null;

//---------------------------------------------------------------------------------------
//--------------------------------- MAPPING PARSING -------------------------------------

/*---------------------------------------------------------------------------------------
 * Tries to initialize the XMLParser for the aris2arcm mapping file in this order:
 * 1. The mapping file under "Common files"
 * 2. The mapping file in the calling report's category folder
 * 3. The selection by the user
 * If initialisation succeeds then the global variable g_xmlConfigReader is set and ready to use
 * If it fails then the corresponding error String is thrown.
---------------------------------------------------------------------------------------*/
function initConfigReader() {
    
    if (g_xmlConfigReader != null && g_xmlConfigReader.isValid()) {return;}
    
    var configFile = null;
    try {
        //1. read standard mapping file from "Common files"
        try {
            configFile = Context.getFile(g_mappingFileName, Constants.LOCATION_COMMON_FILES);
        } catch (e) {
            //ignore NPE if file could not be found
        }    
        if (configFile != null) { 
            g_xmlConfigReader = Context.getXMLParser(configFile);
            if(g_xmlConfigReader.isValid() == true) {
                return;
            }
        }
        
        //2. read standard mapping file from the calling report's category folder
        try {
            configFile = Context.getFile(g_mappingFileName, Constants.LOCATION_SCRIPT);
        } catch (e) {
            //ignore NPE if file could not be found
        } 
        if (configFile != null) { 
            g_xmlConfigReader = Context.getXMLParser(configFile);
            if(g_xmlConfigReader.isValid() == true) {
                return;
            }
        }
        
        //3. read mapping file by user selection dialog
        configFile = getImportFile();
        if (configFile == null) {
            return;
        }
        g_xmlConfigReader = Context.getXMLParser(configFile);
       
    } catch (e) {
        var sErrorMsg = e.toString();   
        if (g_bRemoteCalled) {
            Context.setProperty(g_errorMessageProperty, sErrorMsg);
        } else {
            Dialogs.MsgBox(sErrorMsg, Constants.MSGBOX_BTN_OK | Constants.MSGBOX_ICON_ERROR, "The mapping file '" + g_mappingFileName + "' could not be parsed");
        }
    }
    
}

/*---------------------------------------------------------------------------------------
    Browse dialog for selection of mapping file
---------------------------------------------------------------------------------------*/
function getImportFile() {
    var sdefname = "";
    var sdefext = "*.xml!!XML Document|*.xml||";
    var sdefdir = "";
    var stitle = getString("TEXT_1");
    
    var file = null;
    var files = Dialogs.BrowseForFiles(sdefname, sdefext, sdefdir, stitle, 0);
    
    if (files != null && files.length > 0) { file = files[0] }
    if (file != null) {
        return file.getData(); // getData() needed for returning the selected file as Byte[];
    } else {
        return null;    
    }
}