/**
 * ARIS 7.2 Script module BPExportUpdate Parameter
 * Author: Manuel Peipe, IDS Scheer Consulting GmbH
 * Date: 2012-12-06
 * Version 1.0.0.0 (2012-07-23| Manuel Peipe) - initial parameters
 * Version 1.0.0.1 (2015-07-13| Robert Vajdik) - initial parameters, Filter GUID
 * Version 1.0.0.2 (2015-10-29| Robert Vajdik) - reinit parameters
 */

function BPExportUpdateParameter() {
    this.getExportParameters = function() {
        return {
        // General Parameters
        "LogMode"           : "append", // LogMode: none, append, new
        "LogfilePath"       : "D:/SoftwareAG/",
        "LogfileName"       : "BPExportUpdate.txt",
        "ExportName"        : "VWG",
        "ExportDescription" : "VWG Export",
        "WebServer"         : "10.217.137.243:80",
      //  "Filter"            : "dd838074-ac29-11d4-85b8-00005a4053ff",
        
        
        // Wizzard Parameters
        "TemplateGUID"          : "",
        "ExportDefaultLangID"   : "1033",
        "EvalFilterGUID"        : "",
        "LanguagePackages"      : "1033,1033,1033;1031,1031,1031",
        "LayoutName"            : "VWG",
        
        // Profil Parameters
        "ProfileName"           : "Profil Publisher Export",
        "ProfileDescription"    : "This profile has been generated by the automatic BPExportUpdate report.",
        "UsePrintScale"         : "false",
        "InitialScale"          : "100",
        "ScaleValues"           : "25,50,75,100,125,150",
        "BlackWhite"            : "false",
        "Transparent"           : "false",
        "ModelSort"             : "0", // sort: 0=alphabetical up, 1=alphabetical down
        "ObjectSort"            : "0", // sort: 0=alphabetical up, 1=alphabetical down
        "AttributeSort"         : "2", // sort: 0=alphabetical up, 1=alphabetical down, 2=methodical
        "LinkList"              : "152,153,154,872,997,2788,2789",
        "CopyDocuments"         : "false",
        "TempFNames"            : "false",
        };
    }
}
