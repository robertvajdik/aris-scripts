/*****************************************************************************************
 * @fileoverview
 * Diese Report erstellt ein QM Handbuch nach den Vorgaben von AUDI AG<br/><br/>
 * 
 * Konvertaiert am 03.09.2007 von David Meli, IDS Scheer AG
 * 
 * @author <a href="mailto:david.meli@ids-scheer.com">David Meli</a><br/><br/>
 *
 * verwendete Dateien:<br/>
 * ->Audi_CommonFunctionality.js
 *
 * 07.08.09 CLLE - Bugfix:
 *                 Erfolgsfaktoren werden ueber Methode Audi_HelperClass:getObjectFromAttribute
 *                 ausgelesen.
 *                 Erfolgsfaktoren werden nicht mehr mehrfach ausgegeben.
 *                 Prozesszweck aus uebergeordnetem Objekt wird ausgegeben
 * 29.09.10 KLBI Change
 *                  Einordnung in die Prozesslandschaft: Ausgabe nur noch ID statt Name und ID
 * 22.10.10 RSO/KLBI Change
 *                  Ausgabe bei Vorgänger- und Nachfolgeprozess auf ID anstelle Name und ID geändert (Zeile 1152 und 1157 --> Defet 1263)
 * 18.10.12 Manuel Peipe
 *                  Absicherung Filename ohne Umbrüche und doppelte Leerzeichen (ensureFileName...)
 *                  Schreibfehler unter Regelungen korrigiert
 * 11.12.12 Manuel Peipe
 *                 Report Copy For BP without Dialog, DIALOG_MODE = false
 * 31.01.13 Manuel Peipe
 *                 Determination of DIALOG_MODE, Im BP Modus werden aus Performance Gründen keine Hinterlegungen mehr ausgewertet
 * 07.03.13 Manuel Peipe
 *                 Fix error, when running in hungarian interface language
 * 2013-03-28 Manuel Peipe
 *                 Erweiterung um ungarische Übersetzungen der Sprachbausteine
 * 2013-05-07 Manuel Peipe
 *                 CR: Ausgabe Geltungsbereich vorgezogen; CR: Kommentartext zu Dokumentation entfernt
 *                 CR: Ergänzung Text, Verteiler; CR: Ausgabe Empfehlung und fachlicher Ersteller
 *                 Optimierung: Code Reengineering; Performance Optimierung
 *                 CR: QM-Grundsätze; Schnittstellenausgabe; Steuerungs- und Unterstützungsprozesse
 *                 CR: Zweck und Ziel; Prozessgrafik
 * 2013-06-17 Manuel Peipe
 *                 Bugfix: Nicht belegt ausgeben, falls Gesellschaften oder Standorte nicht gepflegt
 *                 Hinweistext unter Geltungsbereich entfernt; Prozessstandard mittig
 * 2013-08-23 Manuel Peipe
 *                 Integration Ungarische Übersetzungen
 * 2013-09-09 Manuel Peipe
 *                 Laufwerk B:\ (Citrix-Mapping) auf C:\Temp\ARIS\ ausgeben
 *                 Anpassungen englische Bausteine; Anpassung Hinweis untergeordnete Modelle mit ausgeben (Formulierung Herr Peter)
 * 2013-10-09 Manuel Peipe
 *                 Laufwerksmapping rückgängig, keine Änderung notwendig
 * 2013-10-18 Manuel Peipe
 *                 Anpassung keine Links auf Grafikdokumente; Bestätigung Dateipfad in Messagebox am Reportende
 * 2013-10-28 Manuel Peipe
 *                 Links wieder eingebaut; zusätzlicher Hinweistext
 * 2013-11-27 Manuel Peipe: - Ausgabe Überschriftszeile zum Gesamtprozesszweck
 * 2015-10-07 Zdeněk Kocourek - Update & introducing new symbols (conventions valid since 1.11.2015), cut off symbol "Vorgängerprozess" and "Nachfolgeprozess" (those are not more valid)
 * 2016-08-xx Zdeněk Kocourek - New version for Audi only (new PS valid since September 2016)
 ******************************************************************************************/
var DIALOG_MODE = Context.getEnvironment().equals("STD"); // Dialogs only in Standard, not in BusinessPublisher!

var GFX_CORRWIDTH = 9;
var GFX_CORRHEIGHT = 45;
var GFX_SIZE = -1;

// Anmerkung:
// zu GFX_size:
// 	 -1 heißt Grafik nicht skalieren sondern immer auf eine Seite!
// 	 -10 heißt Grafik in Druckzoom (printscaling) auszugeben!
// 	 alle anderen Zahlen sind Prozentangabe und können zwischen 10 und 1000 sein

// zu GFX_corrWidth und GFX_corrHeight:
// 	 ist eine Zahl in Pixeln die von der berechneten Seitenbreite bzw -höhe
// 	 abgezogen wird, sollte die grafik also zu klein sein muss die Zahl kleiner
//   gewählt werden ist sie Grafik zu groß, muß die Zahl größer gewählt werden


var g_fMethod = ArisData.getActiveDatabase().ActiveFilter();
//try{ var SYM_PROCESS_INTERFACE_IN  = g_fMethod.UserDefinedSymbolTypeNum("fed9bed0-9e8d-11d8-5173-0020e06e9e46"); }catch(e){ var SYM_PROCESS_INTERFACE_IN  = 721231; } // Vorgängerprozess
//try{ var SYM_PROCESS_INTERFACE_OUT = g_fMethod.UserDefinedSymbolTypeNum("b955b990-9e8d-11d8-5173-0020e06e9e46"); }catch(e){ var SYM_PROCESS_INTERFACE_OUT = 590159; } // Nachfolgeprozess
//try{ var SYM_STAT                  = g_fMethod.UserDefinedSymbolTypeNum("354abbb0-57b7-11e5-255f-0017a4773c28"); }catch(e){ var SYM_STAT                  = 1638735; } // Statusobjekt - old version of IdSC code
try {
    var SYM_FUNC = g_fMethod.UserDefinedSymbolTypeNum("53de0160-57ba-11e5-255f-0017a4773c28");
} catch (e) {
    var SYM_FUNC = 1769807;
} // Prozess(-schritt)
try {
    var SYM_FUNC1 = g_fMethod.UserDefinedSymbolTypeNum("6412dec0-57ba-11e5-255f-0017a4773c28");
} catch (e) {
    var SYM_FUNC1 = 1507663;
} // Leistungsprozess
try {
    var SYM_FUNC2 = g_fMethod.UserDefinedSymbolTypeNum("e61d6d90-57ba-11e5-255f-0017a4773c28");
} catch (e) {
    var SYM_FUNC2 = 1704271;
} // Steuerungsprozess
try {
    var SYM_FUNC3 = g_fMethod.UserDefinedSymbolTypeNum("e61d6d90-57ba-11e5-255f-0017a4773c28");
} catch (e) {
    var SYM_FUNC3 = 1704271;
} // Steuerungsprozess (WKD)
try {
    var SYM_FUNC4 = g_fMethod.UserDefinedSymbolTypeNum("b343b280-57ba-11e5-255f-0017a4773c28");
} catch (e) {
    var SYM_FUNC4 = 1835343;
} // Unterstützungsprozess
try {
    var SYM_FUNC5 = g_fMethod.UserDefinedSymbolTypeNum("b343b280-57ba-11e5-255f-0017a4773c28");
} catch (e) {
    var SYM_FUNC5 = 1835343;
} // Unterstützungsprozess (WKD)

//var STAUDI_PROCESS_INTERFACE_IN     = VWAudiConstants.SYM_PRC_IF_IN; // cut off
//var STAUDI_PROCESS_INTERFACE_OUT    = VWAudiConstants.SYM_PRC_IF_OUT; // cut off
var STAUDI_CONTROL_PROCESS = VWAudiConstants.SYM_PS_CONTROL;
var STAUDI_CONTROL_PROCESS_WKD = VWAudiConstants.SYM_WKD_CONTROL;
var STAUDI_SUPPORT_PROCESS = VWAudiConstants.SYM_PS_SUPPORT;
var STAUDI_SUPPORT_PROCESS_WKD = VWAudiConstants.SYM_WKD_SUPPORT;
var SYM_STAT = VWAudiConstants.SYM_STAT_OBJ;
var STAUDI_STATUS_OBJECT = VWAudiConstants.SYM_STAT_OBJ;
var STAUDI_PROCESS_INTERFACE = VWAudiConstants.SYM_PRC_INTERFACE;
var STAUDI_PROCESS_INTERFACE2 = VWAudiConstants.SYM_PRC_INTERFACE2;

var SPACING_1 = 15;
var SPACING_2 = 25;
var SPACING_3 = 30;
var SPACING_4 = 18;
var SPACING_5 = 12;

var MOD_PROC = Constants.MT_EEPC_ROW;
var MOD_FAD = Constants.MT_FUNC_ALLOC_DGM;
var MOD_ORG = Constants.MT_ORG_CHRT;

var OBJ_FUNC = Constants.OT_FUNC;
var OBJ_SYS = Constants.OT_APPL_SYS_TYPE;
var OBJ_ORG = Constants.OT_ORG_UNIT;
var OBJ_ROL = Constants.OT_PERS_TYPE;
var OBJ_DOC = Constants.OT_INFO_CARR;

var ATTR_DESC = VWAudiConstants.ATT_DESC; // Beschreibung/Definition
var ATTR_TITLE1 = VWAudiConstants.ATT_AKV_TITLE; // Titel 1
var ATTR_VA = VWAudiConstants.ATT_BOOL_DOCISVA; // Wahr oder Falsch das Dokument ist eine VA
var ATTR_ZWECK = VWAudiConstants.ATT_PROC_PURPOSE; // Prozesszweck
var ATTR_NAME_FULL = VWAudiConstants.ATT_NAME_FULL

// # Modellattribute
var ATTR_CREATOR = VWAudiConstants.ATT_CREATOR_TEAM; // Verfasser/Erstellerteam
var ATTR_RESP = VWAudiConstants.ATT_PROC_RESP; // Prozessverantwortlicher
var ATTR_DIENST = VWAudiConstants.ATT_CHANGE_SERVICE; // Änderungsdinst
var ATTR_AKZ = VWAudiConstants.ATT_GLOSSARY; // Begriffe/Abkürzungen
var ATTR_ZUSTAE = VWAudiConstants.ATT_COMPENTENCY; // Zuständigkeiten
var ATTR_MGMTGRUND = VWAudiConstants.ATT_MGMT_POLICY; // Management-Grundsatz
var ATTR_VERTEILER = VWAudiConstants.ATT_DISTR_LIST; // Zusätzliche Verteiler
var ATTR_GESELLSCH = VWAudiConstants.ATT_SCOPE_COMPANY; // Geltungsbereich - Gesellschaft
var ATTR_WERK = VWAudiConstants.ATT_SCOPE_FACTORY; // Geltungsbereich - Werk
var ATTR_EF = VWAudiConstants.ATT_CSF; // Kritischer Erfolgsfaktor - mit allen Kennzahlen und Attriuben
var ATTR_NR = VWAudiConstants.ATT_ID; // Prozessschritt-Nr.
var ATTR_NAME = VWAudiConstants.ATT_NAME; // Name
var ATTR_PROZESSNR = VWAudiConstants.ATT_ID; //AT_UA_TXT_244; //Prozessnummer
var ATTR_QPM = VWAudiConstants.ATT_PROC_MODELER; // QPM (Name)
var ATTR_VERSION = VWAudiConstants.ATT_PROC_VERSION; // Prozessversion
var ATTR_HISTORY = VWAudiConstants.ATT_CHANGE_HISTORY; // Änderungshistorie
var ATTR_EBENE = VWAudiConstants.ATT_LEVEL; // Ebene
var ATTR_Empfehlung = VWAudiConstants.ATT_RECOMMENDATION; // Empfehlung
var ATTR_Proc_Creator = VWAudiConstants.ATT_PROC_CREATOR; //Fachlicher Ersteller -> MUSS
var ATTR_Proc_Creator_Mail = VWAudiConstants.ATT_PROC_CREATOR_MAIL; //Fachlicher Ersteller (E-Mail) -> MUSS
var ATTR_MODEL_STATUS = VWAudiConstants.ATT_MODEL_STATUS; // Modellstatus aus RCM
var ATTR_SINCE = VWAudiConstants.ATT_SINCE; // Gültig ab
var ATTR_KSU_UNTERLAGENKLASSE_AUDI = VWAudiConstants.ATT_KSU_UNTERLAGENKLASSE_AUDI; // KSU Unterlagenklasse Audi
var ATTR_ANLAGEN_GUID = VWAudiConstants.ATT_ANLAGEN_GUID; // Anlagen_GUID - Dokumente
var ATTR_MITGELTENDE_DOK_NUM = VWAudiConstants.ATT_MITGELTENDE_DOK_GUID; // Mitgeltende Dokumente_GUID 
var ATTR_WEITERFUHRENDE_DOK_NUM = VWAudiConstants.ATT_WEITERFUHRENDE_DOK_GUID; // Weiterführende Dokumente_GUID
var ATTR_CONFIRM_DATE = VWAudiConstants.ATT_CONFIRM_DATE; // Abstimmungsstand (Abstimmungsdatum)


// Felder die gefüllt werden müssen. Ansonsten erhält das Dokument den Status "Entwurf"
var g_requiredAttr = new Array(ATTR_PROZESSNR, ATTR_EBENE, ATTR_NAME, ATTR_GESELLSCH, ATTR_WERK, ATTR_CREATOR, ATTR_RESP, ATTR_VERSION, ATTR_QPM, ATTR_Proc_Creator);

var g_nLoc = Context.getSelectedLanguage();
var g_sLoc = ArisData.getActiveDatabase().getDbLanguage().LocaleInfo().getLocale().getLanguage() + ""; //String(g_nLoc)
var g_Zoom = 0;
var g_Outfile = null;
var g_VistitedModels = new java.util.HashSet();

var g_oAudiHlp = new Audi_HelperClass();

var ROLE_FILTER = getString("ROLE_FILTER_1", g_sLoc) + " " + getString("ROLE_FILTER_2", g_sLoc); // diese Rollen werden nicht ausgelesen

// var audiLogo = "AudiLogo.png";

/********************************************************************************
 * Fuegt einer übergebenen Liste mit Objektdefinitionen weitere Objektdefinitionen
 * eines Modells hinzu. Die Objektdefintioen müssen dabei einem bestimmten Typ
 * entsprechen. 
 *
 * @param Modell
 * @param Liste mit Objektdefinitionen
 * @param Typnummer
 *
 * return Liste mit Objektdefintionen
 **********************************************************************************/
function addObjectsFromNonFzds(oModels, oCurrentObjDefList, typeNr) {

    // aus den zusaetzlih eingesammelten Modellen
    for (var i = 0; i < oModels.length; i++) {
        var oModel = oModels[i];
        var oObjs = oModel.ObjDefList();
        for (var j = 0; j < (oObjs.length - 1); j++) {
            var oObj = oObjs[j];
            if (oObj.TypeNum() == typeNr) {
                oCurrentObjDefList.push(oObj);
            }
        }
    }

    // aus den Hinterlegungen der Modelle
    for (i = 0; i < oModels.length; i++) {
        var oModel = oModels[i];
        var oOccs = oModel.ObjOccList();
        for (var j = 0; j < oOccs.length; j++) {
            var oOcc = oOccs[j];
            if (oOcc.ObjDef().TypeNum() == Constants.OT_FUNC && (oOcc.OrgSymbolNum() != STAUDI_PROCESS_INTERFACE || oOcc.OrgSymbolNum() != STAUDI_PROCESS_INTERFACE2)) {
                oObjs = getFromFzd(oOcc.ObjDef(), typeNr);
                for (k = 0; k < oObjs.length; k++) {
                    oObj = oObjs[k];
                    oCurrentObjDefList.push(oObj);
                }
            }
        }
    }
    return oCurrentObjDefList;
}

/********************************************************************************
 * Ermittelt aus einer Liste von Ausprägungen die zugeordnenten Modelle.
 * 
 * @param{ObjOcc} Liste von Ausprägungen vom Typ OT_FUNC
 *
 * @return Liste von Modellen 
 **********************************************************************************/
function getNonAssignedModels(oCurrentModelOccList) {

    var oNonAssignedModels = new Array();

    for (var i = 0; i < oCurrentModelOccList.length; i++) {
        var oModelOcc = oCurrentModelOccList[i];
        if (!isProcessInterface(oModelOcc.getSymbol()) && !isStatus(oModelOcc.getSymbol())) {
            var oTempModelList = oModelOcc.ObjDef().AssignedModels();
            for (var j = 0; j < oTempModelList.length; j++) {
                var oTempModel = oTempModelList[j];
                if (oTempModel.TypeNum() != Constants.MT_FUNC_ALLOC_DGM) {
                    // keine Funktionshinterlegungsdiagramme
                    oNonAssignedModels.push(oTempModel);
                }
            }
        }
    }
    return oNonAssignedModels;
}

/********************************************************************************
 * Erzeugt die Formatvorlage für die Ausgabe.
 *
 * @param Ausgabedatei
 **********************************************************************************/
function createOutputTemplate(g_Outfile) {

    g_Outfile.DefineF(getString("WORD_TEMPLATE_FORMATTING_1"), "Audi Type", 11, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_LEFT, 0, 0, 0, 0, 0, 1);
    g_Outfile.DefineF(getString("WORD_TEMPLATE_FORMATTING_2"), "Audi Type", 12, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_LEFT, 0, 0, 0, 0, 0, 1);
    g_Outfile.DefineF(getString("WORD_TEMPLATE_FORMATTING_3"), "Audi Type", 12, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_BOLD | Constants.FMT_LEFT, 0, 0, 0, 0, 0, 1);
    g_Outfile.DefineF(getString("WORD_TEMPLATE_FORMATTING_4"), "Audi Type", 11, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_BOLD | Constants.FMT_LEFT, 0, 0, 2, 2, 0, 1);
    g_Outfile.DefineF(getString("WORD_TEMPLATE_FORMATTING_5"), "Audi Type", 12, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_BOLD | Constants.FMT_LEFT, 0, 0, 2, 0, 0, 1);
    g_Outfile.DefineF(getString("WORD_TEMPLATE_FORMATTING_6"), "Audi Type", 12, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_BOLD | Constants.FMT_LEFT, 0, 0, 4, 2, 0, 1);
    g_Outfile.DefineF(getString("WORD_TEMPLATE_FORMATTING_7"), "Audi Type", 10, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_UNDERLINE | Constants.FMT_LEFT, 0, 0, 0, 2, 0, 1);
    g_Outfile.DefineF(getString("WORD_TEMPLATE_FORMATTING_8"), "Audi Type", 12, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_BOLD | Constants.FMT_LEFT, 0, 0, 2, 1, 0, 1);
    g_Outfile.DefineF(getString("WORD_TEMPLATE_FORMATTING_9"), "Audi Type", 8, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_LEFT, 0, 0, 0, 0, 0, 1);
    g_Outfile.DefineF(getString("WORD_TEMPLATE_FORMATTING_10"), "Audi Type", 8, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_LEFT | Constants.FMT_BOLD, 0, 0, 0, 0, 0, 1);

}

/********************************************************************************
 * Erezugt Kopf- unf Fußzeile des Dokuments.
 *
 * @param Ausgabedatei
 * @param ausgewähltes Modell
 **********************************************************************************/
function createHeaderAndFooter(g_Outfile, oModel) {

    // Erzeugung der Kopfzeile
    g_Outfile.BeginHeader();
    g_Outfile.BeginTable(100, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_LEFT, 0);
    g_Outfile.TableRow();
    setNewFrameStyle(g_Outfile, [1, 0, 0, 0]); //show only button frame of cell
    g_Outfile.TableCell("", 80, "Audi Type Extended", 8, Constants.C_BLACK, Constants.C_TRANSPARENT, 0, Constants.FMT_LEFT | Constants.FMT_VTOP, 0);
    /*    var sFachlicherErsteller = oModel.Attribute(ATTR_Proc_Creator, g_nLoc).getValue();
        if (sFachlicherErsteller.equals("")) {
            sFachlicherErsteller = "N.N.";
        }
        g_Outfile.Output(getString("TXT_NAME",g_sLoc) + ": " + sFachlicherErsteller + "\n", "Arial", 11, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_BOLD | Constants.FMT_LEFT, 0);
        g_Outfile.Output(getString("TXT_ORGUNIT",g_sLoc) + ": \n", "Arial", 11, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_BOLD | Constants.FMT_LEFT, 0);
        g_Outfile.Output(getString("TXT_PHONE",g_sLoc) + ": \n", "Arial", 11, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_BOLD | Constants.FMT_LEFT, 0);
        g_Outfile.Output(getString("TXT_STATUS",g_sLoc) + ": \n", "Arial", 11, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_BOLD | Constants.FMT_LEFT, 0);
        g_Outfile.Output(getString("TXT_VERSION",g_sLoc) + ": " + oModel.Attribute(ATTR_VERSION, g_nLoc).getValue() + "\n", "Arial", 11, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_BOLD | Constants.FMT_LEFT, 0);
        g_Outfile.TableCell("", 55, "Arial", 8, Constants.C_BLACK, Constants.C_TRANSPARENT, 0, Constants.FMT_CENTER, 0); */
    g_Outfile.OutputLn("", "Audi Type Extended", 8, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_LEFT, 0);
    if (oModel.Attribute(ATTR_EBENE, g_nLoc).getValue().equals("6")) {
        g_Outfile.OutputLn(getString("TXT_WORK_INSTRUCTIONS", g_sLoc), "Audi Type Extended", 20, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_LEFT, 0);
    } else {
        g_Outfile.OutputLn(getString("TXT_PROCESS_STANDARD", g_sLoc), "Audi Type Extended", 20, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_LEFT, 0);
    }
    g_Outfile.OutputLn("", "Audi Type Extended", 8, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_LEFT, 0);

    g_Outfile.TableCell("", 20, "Arial", 8, Constants.C_TRANSPARENT, Constants.C_TRANSPARENT, 0, Constants.FMT_CENTER | Constants.FMT_VCENTER, 0);
    var sCoporate = getCorporateKey(oModel, g_nLoc);
    var sLogo = AUDIConfigReader.getConfigString("CompanyLogo", "a" + sCoporate, "MISSING", "AUDI_Config.xml");
    if (sLogo.equals("MISSING"))
        g_Outfile.Output("<No Logo defined for company>", "Arial", 10, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_LEFT, 0);
    else if (Context.getFile(sLogo, Constants.LOCATION_COMMON_FILES).length == 0)
        g_Outfile.Output("<Logo " + sLogo + " not available>", "Arial", 10, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_LEFT, 0);
    else
        g_Outfile.OutGraphic(Context.createPicture(sLogo), -1, 25, 25);
    // ProzessKennung row
    g_Outfile.TableRow();
    setNewFrameStyle(g_Outfile, [0, 0, 0, 0]);
    g_Outfile.TableCell("", 100, "Audi Type", 16, Constants.C_BLACK, Constants.C_TRANSPARENT, 0, Constants.FMT_LEFT, 0);
    var sProzessKennung = getProcessMark(oModel.Attribute(ATTR_PROZESSNR, g_nLoc).getValue(), oModel.Attribute(ATTR_EBENE, g_nLoc).getValue());
    g_Outfile.OutputLn(sProzessKennung + "_" + oModel.Attribute(ATTR_EBENE, g_nLoc).getValue() + "_" + oModel.Attribute(ATTR_NAME, g_nLoc).getValue(), "Audi Type", 16, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_BOLD | Constants.FMT_LEFT, 0);
    if (isDraft(oModel)) {
        g_Outfile.Output(getString("TXT_DRAFT", g_sLoc), "Audi Type", 16, Constants.C_RED, Constants.C_TRANSPARENT, Constants.FMT_BOLD | Constants.FMT_CENTER, 0);
    }

    g_Outfile.EndTable("", 100, "Audi Type", 8, Constants.C_TRANSPARENT, Constants.C_TRANSPARENT, 0, Constants.FMT_LEFT | Constants.FMT_VTOP, 0);
    setNewFrameStyle(g_Outfile, [1, 1, 1, 1]); //set style of frame cell for any further table 


    g_Outfile.EndHeader();

    // Erzeugung der Fusszeile
    g_Outfile.BeginFooter();

    var sFachlicherErsteller = oModel.Attribute(ATTR_Proc_Creator, g_nLoc).getValue();
    if (sFachlicherErsteller.equals("")) {
        sFachlicherErsteller = "N.N.";
    }
    //Further pages
    g_Outfile.BeginTable(100, Constants.C_TRANSPARENT, Constants.C_TRANSPARENT, Constants.FMT_LEFT, 0);
    g_Outfile.TableRow();
    g_Outfile.TableCell("", 80, "Arial", 8, Constants.C_TRANSPARENT, Constants.C_TRANSPARENT, 0, Constants.FMT_LEFT | Constants.FMT_VTOP, 0);
    var sAttr_ksu_unterlagenklasse = oModel.Attribute(ATTR_KSU_UNTERLAGENKLASSE_AUDI, g_nLoc).getValue();
    if (sAttr_ksu_unterlagenklasse.equals("")) {
        sAttr_ksu_unterlagenklasse = "N.N.";
    }
    g_Outfile.Output(getString("TXT_KSU_TITLE", g_sLoc) + ": " + sAttr_ksu_unterlagenklasse + "\n", "Arial", 8, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_LEFT, 0);
    g_Outfile.TableCell("", 20, "Arial", 8, Constants.C_TRANSPARENT, Constants.C_TRANSPARENT, 0, Constants.FMT_LEFT | Constants.FMT_VTOP, 0);
    g_Outfile.Output(getString("TXT_PAGE", g_sLoc) + ": ", "Arial", 9, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_LEFT, 0);
    g_Outfile.OutputField(Constants.FIELD_PAGE, "Arial", 9, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_LEFT);
    g_Outfile.Output(" " + getString("TXT_FROM", g_sLoc) + " ", "Arial", 9, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_LEFT, 0);
    g_Outfile.OutputField(Constants.FIELD_NUMPAGES, "Arial", 9, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_LEFT);
    g_Outfile.EndTable("", 100, "Arial", 8, Constants.C_TRANSPARENT, Constants.C_TRANSPARENT, 0, Constants.FMT_LEFT | Constants.FMT_VTOP, 0);

    /*
    g_Outfile.BeginTable(100, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_LEFT, 0);
    g_Outfile.TableRow();
    g_Outfile.TableCell("", 20, "Arial", 8, Constants.C_TRANSPARENT, Constants.C_TRANSPARENT, 0, Constants.FMT_CENTER| Constants.FMT_VERT_UP, 0);
    g_Outfile.Output("bb" , "Arial", 8, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_CENTER, 0);
    g_Outfile.EndTable("", 100, "Arial", 8, Constants.C_TRANSPARENT, Constants.C_TRANSPARENT, 0, Constants.FMT_LEFT | Constants.FMT_VTOP, 0);
**/

    /*
  //Further pages - left placed frame
    g_Outfile.Output("", "Arial", 8, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_LEFT, 0);
    g_Outfile.OutputField(Constants.FIELD_FILENAME, "Arial", 8, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_LEFT);
    g_Outfile.OutputLn(": " + getString("TXT_KSU_TITLE",g_sLoc) + " " + oModel.Attribute(ATTR_KSU_UNTERLAGENKLASSE_AUDI, g_nLoc).getValue(), "Arial", 8, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_LEFT, 0);
    g_Outfile.OutputLn(getString("TEXT_CREATOR_2",g_sLoc) + ": " + sFachlicherErsteller, "Arial", 8, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_LEFT, 0);
    g_Outfile.OutputLn(getString("TXT_VERSION",g_sLoc) + ": "  + oModel.Attribute(ATTR_VERSION, g_nLoc).getValue() + "; " + getString("TXT_STATUS",g_sLoc) + ": " + oModel.Attribute(ATTR_CONFIRM_DATE, g_nLoc).getValue(), "Arial", 8, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_LEFT, 0);
*/
    g_Outfile.EndFooter();
}

/********************************************************************************
 * Erezugt Kopf- unf Fußzeile des Dokuments.
 *
 * @param Ausgabedatei
 * @param ausgewähltes Modell
 **********************************************************************************/
function createHeaderAndFooter_CoverPage(g_Outfile, oModel) {

    // Erzeugung der Kopfzeile
    g_Outfile.BeginHeader();
    g_Outfile.BeginTable(100, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_LEFT, 0);
    g_Outfile.TableRow();
    setNewFrameStyle(g_Outfile, [1, 0, 0, 0]); //show only button frame of cell
    g_Outfile.TableCell("", 80, "Audi Type Extended", 8, Constants.C_BLACK, Constants.C_TRANSPARENT, 0, Constants.FMT_LEFT | Constants.FMT_VTOP, 0);
    /*    var sFachlicherErsteller = oModel.Attribute(ATTR_Proc_Creator, g_nLoc).getValue();
        if (sFachlicherErsteller.equals("")) {
            sFachlicherErsteller = "N.N.";
        }
        g_Outfile.Output(getString("TXT_NAME",g_sLoc) + ": " + sFachlicherErsteller + "\n", "Arial", 11, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_BOLD | Constants.FMT_LEFT, 0);
        g_Outfile.Output(getString("TXT_ORGUNIT",g_sLoc) + ": \n", "Arial", 11, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_BOLD | Constants.FMT_LEFT, 0);
        g_Outfile.Output(getString("TXT_PHONE",g_sLoc) + ": \n", "Arial", 11, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_BOLD | Constants.FMT_LEFT, 0);
        g_Outfile.Output(getString("TXT_STATUS",g_sLoc) + ": \n", "Arial", 11, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_BOLD | Constants.FMT_LEFT, 0);
        g_Outfile.Output(getString("TXT_VERSION",g_sLoc) + ": " + oModel.Attribute(ATTR_VERSION, g_nLoc).getValue() + "\n", "Arial", 11, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_BOLD | Constants.FMT_LEFT, 0);
        g_Outfile.TableCell("", 55, "Arial", 8, Constants.C_BLACK, Constants.C_TRANSPARENT, 0, Constants.FMT_CENTER, 0); */
    g_Outfile.OutputLn("", "Audi Type Extended", 8, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_LEFT, 0);
    if (oModel.Attribute(ATTR_EBENE, g_nLoc).getValue().equals("6")) {
        g_Outfile.OutputLn(getString("TXT_WORK_INSTRUCTIONS", g_sLoc), "Audi Type Extended", 20, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_LEFT, 0);
    } else {
        g_Outfile.OutputLn(getString("TXT_PROCESS_STANDARD", g_sLoc), "Audi Type Extended", 20, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_LEFT, 0);
    }
    g_Outfile.OutputLn("", "Audi Type Extended", 8, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_LEFT, 0);

    g_Outfile.TableCell("", 20, "Arial", 8, Constants.C_TRANSPARENT, Constants.C_TRANSPARENT, 0, Constants.FMT_CENTER | Constants.FMT_VCENTER, 0);
    var sCoporate = getCorporateKey(oModel, g_nLoc);
    var sLogo = AUDIConfigReader.getConfigString("CompanyLogo", "a" + sCoporate, "MISSING", "AUDI_Config.xml");
    if (sLogo.equals("MISSING"))
        g_Outfile.Output("<No Logo defined for company>", "Arial", 10, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_LEFT, 0);
    else if (Context.getFile(sLogo, Constants.LOCATION_COMMON_FILES).length == 0)
        g_Outfile.Output("<Logo " + sLogo + " not available>", "Arial", 10, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_LEFT, 0);
    else
        g_Outfile.OutGraphic(Context.createPicture(sLogo), -1, 25, 25);
    // ProzessKennung row
    g_Outfile.TableRow();
    setNewFrameStyle(g_Outfile, [0, 0, 0, 0]);
    g_Outfile.TableCell("", 100, "Audi Type", 16, Constants.C_BLACK, Constants.C_TRANSPARENT, 0, Constants.FMT_LEFT, 0);
    var sProzessKennung = getProcessMark(oModel.Attribute(ATTR_PROZESSNR, g_nLoc).getValue(), oModel.Attribute(ATTR_EBENE, g_nLoc).getValue());
    g_Outfile.OutputLn(sProzessKennung + "_" + oModel.Attribute(ATTR_EBENE, g_nLoc).getValue() + "_" + oModel.Attribute(ATTR_NAME, g_nLoc).getValue(), "Audi Type", 16, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_BOLD | Constants.FMT_LEFT, 0);
    if (isDraft(oModel)) {
        g_Outfile.Output(getString("TXT_DRAFT", g_sLoc), "Audi Type", 16, Constants.C_RED, Constants.C_TRANSPARENT, Constants.FMT_BOLD | Constants.FMT_CENTER, 0);
    }
    setNewFrameStyle(g_Outfile, [1, 1, 1, 1]); //set style of frame cell for any further table 
    g_Outfile.EndTable("", 100, "Audi Type", 8, Constants.C_TRANSPARENT, Constants.C_TRANSPARENT, 0, Constants.FMT_LEFT | Constants.FMT_VTOP, 0);


    g_Outfile.EndHeader();

    // Erzeugung der Fusszeile
    g_Outfile.BeginFooter();
    //First page
    g_Outfile.BeginTable(100, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_LEFT, 0);
    g_Outfile.TableRow();
    g_Outfile.TableCell("", 40, "Arial", 9, Constants.C_BLACK, Constants.C_TRANSPARENT, 0, Constants.FMT_LEFT | Constants.FMT_VTOP, 0);
    var sFachlicherErsteller = oModel.Attribute(ATTR_Proc_Creator, g_nLoc).getValue();
    if (sFachlicherErsteller.equals("")) {
        sFachlicherErsteller = "N.N.";
    }
    g_Outfile.Output(getString("TXT_NAME", g_sLoc) + "\n", "Arial", 9, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_BOLD | Constants.FMT_LEFT, 0);
    g_Outfile.Output(sFachlicherErsteller, "Arial", 9, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_LEFT, 0);
    g_Outfile.TableCell("", 20, "Arial", 9, Constants.C_BLACK, Constants.C_TRANSPARENT, 0, Constants.FMT_LEFT | Constants.FMT_VTOP, 0);
    g_Outfile.Output(getString("TXT_STATUS", g_sLoc) + ": \n", "Arial", 9, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_BOLD | Constants.FMT_LEFT, 0);
    g_Outfile.Output(oModel.Attribute(ATTR_CONFIRM_DATE, g_nLoc).getValue(), "Arial", 9, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_LEFT, 0);
    g_Outfile.TableCell("", 20, "Arial", 9, Constants.C_BLACK, Constants.C_TRANSPARENT, 0, Constants.FMT_LEFT | Constants.FMT_VTOP, 0);
    g_Outfile.Output(getString("TXT_VERSION", g_sLoc) + ": \n", "Arial", 9, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_BOLD | Constants.FMT_LEFT, 0);
    g_Outfile.Output(oModel.Attribute(ATTR_VERSION, g_nLoc).getValue(), "Arial", 9, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_LEFT, 0);
    g_Outfile.TableCell("", 20, "Arial", 9, Constants.C_BLACK, Constants.C_TRANSPARENT, 0, Constants.FMT_LEFT | Constants.FMT_VTOP, 0);
    g_Outfile.Output("\n" + getString("TXT_PAGE", g_sLoc) + ": ", "Arial", 9, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_LEFT, 0);
    g_Outfile.OutputField(Constants.FIELD_PAGE, "Arial", 9, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_LEFT);
    g_Outfile.Output(" " + getString("TXT_FROM", g_sLoc) + " ", "Arial", 9, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_LEFT, 0);
    g_Outfile.OutputField(Constants.FIELD_NUMPAGES, "Arial", 9, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_LEFT);
    g_Outfile.TableRow();
    g_Outfile.TableCell("", 40, "Arial", 9, Constants.C_BLACK, Constants.C_TRANSPARENT, 0, Constants.FMT_LEFT | Constants.FMT_VTOP, 0);
    g_Outfile.Output(getString("TXT_PROCESSOWNER", g_sLoc) + "\n", "Arial", 9, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_BOLD | Constants.FMT_LEFT, 0);
    g_Outfile.Output(oModel.Attribute(ATTR_RESP, g_nLoc).getValue(), "Arial", 9, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_LEFT, 0);
    g_Outfile.TableCell("", 20, "Arial", 9, Constants.C_BLACK, Constants.C_TRANSPARENT, 0, Constants.FMT_LEFT | Constants.FMT_VTOP, 0);
    g_Outfile.Output(getString("TXT_FREIGABE_DATUM", g_sLoc) + ":\n", "Arial", 9, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_BOLD | Constants.FMT_LEFT, 0);
    g_Outfile.Output("", "Arial", 9, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_LEFT, 0);
    g_Outfile.TableCell("", 20, "Arial", 9, Constants.C_BLACK, Constants.C_TRANSPARENT, 0, Constants.FMT_LEFT | Constants.FMT_VTOP, 0);
    g_Outfile.Output(getString("TXT_SIGNATURE", g_sLoc) + ":\n", "Arial", 9, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_BOLD | Constants.FMT_LEFT, 0);
    g_Outfile.TableCell("", 20, "Arial", 9, Constants.C_BLACK, Constants.C_TRANSPARENT, 0, Constants.FMT_LEFT | Constants.FMT_VTOP, 0);
    g_Outfile.Output(getString("TXT_VALIDSINCE", g_sLoc) + ":\n", "Arial", 9, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_BOLD | Constants.FMT_LEFT, 0);
    g_Outfile.Output(oModel.Attribute(ATTR_SINCE, g_nLoc).getValue(), "Arial", 9, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_LEFT, 0);
    g_Outfile.EndTable("", 100, "Arial", 9, Constants.C_BLACK, Constants.C_TRANSPARENT, 0, Constants.FMT_LEFT | Constants.FMT_VTOP, 0);

    g_Outfile.EndFooter();
}

function setNewFrameStyle(p_Output, p_Style) {
    p_Output.ResetFrameStyle();
    p_Output.SetFrameStyle(Constants.FRAME_BOTTOM, p_Style[0]);
    p_Output.SetFrameStyle(Constants.FRAME_LEFT, p_Style[1]);
    p_Output.SetFrameStyle(Constants.FRAME_RIGHT, p_Style[2]);
    p_Output.SetFrameStyle(Constants.FRAME_TOP, p_Style[3]);
} //END::setNewFrameStyle()

function getProcessMark(sProzNr, sLevel) {
    var sTmp = "_" + sLevel + "_";
    var lIndex = sProzNr.indexOf(sTmp)
    if (lIndex > -1) {
        return sProzNr.substring(0, lIndex);
    }
    return "";
}

/*****************************************************************************************************************
 * Löscht alle Zeilenumrüche aus einer Zeichenkette.
 *
 * @param Zeichenkette
 *
 * @return Zeichenkette ohne Zeilenumbrüche
 *****************************************************************************************************************/
function deleteCRLF(sValue) {

    if (sValue != null) {
        sValue = sValue.replace(/\r\n/g, "");
    }
    return sValue;
}

/*****************************************************************************************************************
 * Prüft, ob es sich bei einem Symbol um eine Prozessschnittstelle handelt.
 *
 * @param Symbol
 *
 * @return true, wenn es sich um eine Processschnittstelle handelt, ansonsten false. 
 *****************************************************************************************************************/
function isProcessInterface(iSymbol) {

    var bFunctionResult = false;
    if (iSymbol == STAUDI_PROCESS_INTERFACE || iSymbol == STAUDI_PROCESS_INTERFACE2) {
        bFunctionResult = true;
    }
    return bFunctionResult;
}

/*****************************************************************************************************************
 * Prüft, ob das Modell ein Entwurf ist. D.h. Pflichtfelder sind nicht alle gefüllt.
 *
 * @param Modell
 *
 * @return true, wenn nicht alle Pflichtfelder gefüllt sind, ansonsten false. 
 *****************************************************************************************************************/
function isDraft(oModel) {

    for (var i = 0; i < g_requiredAttr.length; i++) {
        var iAttribTypeNum = g_requiredAttr[i];
        var sAttribValue = oModel.Attribute(iAttribTypeNum, g_nLoc).getValue();
        if (sAttribValue.equals(""))
            return true;
    }
    return false;
}

/********************************************************************************
 * Prüft, ob es sich bei einem Symbol um eine Statusobjekt handelt.
 *
 * @param Symbol
 *
 * @return true, wenn es sich um eine Statusobjekt handelt, ansonsten false. 
 **********************************************************************************/
function isStatus(iSymbol) {

    var bFunctionResult = false;
    if (iSymbol == SYM_STAT) {
        bFunctionResult = true;
    }
    return bFunctionResult;
}

/********************************************************************************
 * Prüft, ob das Attribut eines Items einen boolschen Wert beinhaltet.
 *
 * @param Item
 * @param Atttribut
 *
 * @return Ist boolscher Wert?  
 **********************************************************************************/
function isAttributeBooleanValue(oItem, lAttr) {

    var functionResult = false;

    // AttrBaseType = ABT_BOOL ?
    if ((ArisData.getActiveDatabase().ActiveFilter().AttrBaseType(lAttr) == Constants.ABT_BOOL)) {
        var oAttribute = oItem.Attribute(lAttr, g_nLoc);
        if (oAttribute.IsMaintained()) {
            if (oAttribute.MeasureUnitTypeNum() == Constants.AVT_ONE || oAttribute.MeasureUnitTypeNum() == Constants.AVT_TRUE_2) {
                // Bool attribute is maintained and True
                functionResult = true;
            }
        }
    }

    return functionResult;
}

/********************************************************************************
 * Gibt Dokuemtenübersicht aus.
 *
 * @param Ausgabedatei
 * @param ausgewähltes Modell
 * @param Liste von Modellen (mit FZDs)
 **********************************************************************************/
/* function createFurtherOrgInformations(g_Outfile, oModel, oAllModels) {

    var iJoinedCellWidth = SPACING_1 + SPACING_2 + SPACING_3 + SPACING_4 + SPACING_5;  
    
    g_Outfile.Output("", "Arial", 5, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_CENTER, 0);
    
    g_Outfile.BeginTable(100, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_LEFT, 0);
    
    g_Outfile.TableRow();
    g_Outfile.TableCell("", iJoinedCellWidth, "Arial", 8, Constants.C_BLACK, Constants.C_TRANSPARENT, 0, Constants.FMT_LEFT, 0);
    g_Outfile.OutputLnF(getString("TXT_PROCESSOWNER",g_sLoc) + " /" + getTab() + getTab() + getString("TXT_VALIDATED_AT",g_sLoc) + ":" + getTab() + getTab() + getTab() + getString("TXT_SIGNATURE",g_sLoc) + getTab() + getTab() + getTab() + getTab() + getString("TXT_ORGUNIT_MANAGER",g_sLoc) + ":", getString("WORD_TEMPLATE_FORMATTING_4"));
    g_Outfile.OutputLnF(oModel.Attribute(ATTR_RESP, g_nLoc).getValue(), getString("WORD_TEMPLATE_FORMATTING_2"));
    g_Outfile.OutputLnF("", getString("WORD_TEMPLATE_FORMATTING_2"));
    
    g_Outfile.TableRow();
    g_Outfile.TableCell("", iJoinedCellWidth, "Arial", 8, Constants.C_BLACK, Constants.C_TRANSPARENT, 0, Constants.FMT_LEFT, 0);
    g_Outfile.OutputLnF(getString("TXT_CREATION_TEAM",g_sLoc) + ":", getString("WORD_TEMPLATE_FORMATTING_4"));
    g_Outfile.Output((oModel.Attribute(ATTR_CREATOR, g_nLoc).getValue() + "\n"), "Arial", 12, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_LEFT, 0);
    
    g_Outfile.TableRow();
    g_Outfile.TableCell("", iJoinedCellWidth, "Arial", 8, Constants.C_BLACK, Constants.C_TRANSPARENT, 0, Constants.FMT_LEFT, 0);
    g_Outfile.OutputLnF(getString("TXT_QM_ELEMENTS",g_sLoc) + ": ", getString("WORD_TEMPLATE_FORMATTING_4")); */
//    g_Outfile.OutputLnF("", getString("WORD_TEMPLATE_FORMATTING_2"));
/* var sMGMTGRUND = oModel.Attribute(ATTR_MGMTGRUND, g_nLoc).getValue();
    if (!sMGMTGRUND.equals("")) {
        g_Outfile.Output((sMGMTGRUND + "\n"), "Arial", 12, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_LEFT, 0);
    } else {
        g_Outfile.OutputLn(getString("TXT_NOT_SPECIFIED",g_sLoc), "Arial", 12, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_LEFT, 0);
    }
    
    g_Outfile.TableRow();
    g_Outfile.TableCell("", iJoinedCellWidth, "Arial", 8, Constants.C_BLACK, Constants.C_TRANSPARENT, 0, Constants.FMT_LEFT, 0);
    g_Outfile.OutputLnF(getString("TXT_HEADLINE4",g_sLoc) + ":", getString("WORD_TEMPLATE_FORMATTING_4")); 
    //g_Outfile.Output(getString("TXT_AMBIT_COMMENT",g_sLoc) + "\n\n", "Arial", 10, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_LEFT, 0);
    //g_Outfile.Output("", "Arial", 5, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_BOLD | Constants.FMT_LEFT, 0);
    var sGesellschaften = oModel.Attribute(ATTR_GESELLSCH, g_nLoc).getValue();
    var sWerke = oModel.Attribute(ATTR_WERK, g_nLoc).getValue();
    if (!sGesellschaften.equals("") || !sWerke.equals("")) {
        // Gesellschaften oder Werke sind angegeben
        var sCompanies = getString("TXT_AMBIT_VALID_FOR",g_sLoc) + ": " + (sGesellschaften.equals("") ? getString("TXT_NOT_SPECIFIED",g_sLoc) : sGesellschaften);
        g_Outfile.OutputLnF(sCompanies.replace("\r\n",", "), getString("WORD_TEMPLATE_FORMATTING_1"));
        var sLocation = getString("TXT_LOCATION",g_sLoc) + ": " + (sWerke.equals("") ? getString("TXT_NOT_SPECIFIED",g_sLoc) : sWerke);
        g_Outfile.OutputLnF(sLocation.replace("\r\n",", "), getString("WORD_TEMPLATE_FORMATTING_1"));
    } else {
        g_Outfile.OutputLn(getString("TXT_NOT_SPECIFIED",g_sLoc), "Arial", 12, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_LEFT, 0);
    }

    g_Outfile.TableRow();
    g_Outfile.TableCell("", iJoinedCellWidth, "Arial", 8, Constants.C_BLACK, Constants.C_TRANSPARENT, 0, Constants.FMT_LEFT, 0);
    g_Outfile.OutputLnF(getString("TXT_DISTRIBUTION_LIST",g_sLoc) + ":", getString("WORD_TEMPLATE_FORMATTING_5")); // Temp1
    g_Outfile.Output(getString("TXT_DISTRIBUTION_LIST_HINT",g_sLoc) + "\n\n", "Arial", 10, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_LEFT, 0);
    
    var sRoles = getRoles(oAllModels, oModel);
    if (!sRoles.equals("")) {
        g_Outfile.Output(deleteCRLF(sRoles), "Arial", 12, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_LEFT, 0);
    }
    
    // Empfehlung für Beteiligungsgesellschaften
    g_Outfile.TableRow();
    g_Outfile.TableCell("", iJoinedCellWidth, "Arial", 8, Constants.C_BLACK, Constants.C_TRANSPARENT, 0, Constants.FMT_LEFT, 0);
    g_Outfile.OutputLnF(getString("TXT_RECOMMENDATION",g_sLoc) + ":", getString("WORD_TEMPLATE_FORMATTING_5")); // Temp1
    g_Outfile.OutputLn(getString("TXT_RECOMMENDATION_DESC",g_sLoc) + "\n", "Arial", 10, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_LEFT, 0);
    var sEmpfehlung = oModel.Attribute(ATTR_Empfehlung, g_nLoc).getValue();
    if (!sEmpfehlung.equals("")) {
        g_Outfile.OutputLnF(sEmpfehlung, getString("WORD_TEMPLATE_FORMATTING_1"));
    } else {
        g_Outfile.OutputLn(getString("TXT_NOT_SPECIFIED",g_sLoc), "Arial", 12, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_LEFT, 0);
    }
    
    
      
    g_Outfile.TableRow();
    g_Outfile.TableCell("", iJoinedCellWidth, "Arial", 8, Constants.C_BLACK, Constants.C_TRANSPARENT, 0, Constants.FMT_LEFT, 0);
    g_Outfile.OutputF(getString("TXT_CHANGE_SERVICE",g_sLoc), getString("WORD_TEMPLATE_FORMATTING_4"));
    var sRevisionService = oModel.Attribute(ATTR_DIENST, g_nLoc).getValue();
    if (sRevisionService.equals("")) {
        sRevisionService = "N.N.";
    }
    g_Outfile.OutputF("\n"+getString("TXT_CHANGE_SERVICE_HINT1",g_sLoc) + " " + sRevisionService + " " + getString("TXT_CHANGE_SERVICE_HINT2",g_sLoc), getString("WORD_TEMPLATE_FORMATTING_1"));

    g_Outfile.TableRow();
    g_Outfile.TableCell("", iJoinedCellWidth, "Arial", 8, Constants.C_BLACK, Constants.C_TRANSPARENT, 0, Constants.FMT_LEFT, 0);
    g_Outfile.OutputF(getString("TXT_HISTORY",g_sLoc), getString("WORD_TEMPLATE_FORMATTING_4"));
    g_Outfile.OutputF("\n"+oModel.Attribute(ATTR_HISTORY, g_nLoc).getValue(),getString("WORD_TEMPLATE_FORMATTING_1"));   

    var oHistory = readHistoryEntry(oModel.Attribute(ATTR_HISTORY, g_nLoc).getValue());    
    for(var j = 0; j < oHistory.length; j++) {
        g_Outfile.TableRow();
        g_Outfile.TableCellF(getString("TXT_VERSION",g_sLoc) + ": "  + oModel.Attribute(ATTR_VERSION, g_nLoc).getValue(), SPACING_1 + SPACING_5, getString("WORD_TEMPLATE_FORMATTING_1"));
        g_Outfile.TableCellF(oHistory[j][1], SPACING_2 + SPACING_3 + SPACING_4, getString("WORD_TEMPLATE_FORMATTING_1"));
    }

    g_Outfile.EndTable("", 100, "Arial", 8, Constants.C_TRANSPARENT, Constants.C_TRANSPARENT, 0, Constants.FMT_LEFT | Constants.FMT_VTOP, 0);
    g_Outfile.OutputField(Constants.FIELD_NEWPAGE, "Arial", 11, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_BOLD | Constants.FMT_LEFT);     
} */

/********************************************************************************
 *  Überprüft, ob eine Zeichenkette ein gültiges Datum darstellt.
 *
 * @param Datum als Zeichenkette
 * @return Gültiges Datum?
 **********************************************************************************/
function checkDate(sDate, loc) {
    var bIsDate = false;
    try {
        /*
        var iDay = sDate.substr(0,2);
        var iMonth = sDate.substr(3,2);
        var iYear = sDate.substr(6,4);
        var iHours = sDate.substr(11,2);
        var iMinutes = sDate.substr(14,2);
        */
        var isDate = false;
        var oDate = new Date(sDate);
        if (!isNaN(oDate.getTime()))
            bIsDate = true;
    } catch (e) {
        // Nothing to do
    }
    return bIsDate;
}
/********************************************************************************
 *  Gibt den am Modell gepflegten Prozesszweck aus. 
 *
 * @param Ausgabedatei
 * @param ausgewähltes Modell
 **********************************************************************************/
function createProcessPurpose(g_Outfile, oModelInfo, nChapter) {
    g_Outfile.OutputLnF(nChapter + ".   " + getString("TXT_HEADLINE2", g_sLoc), getString("WORD_TEMPLATE_FORMATTING_6"));

    // Prozesszweck aus übergeordnetem Prozess(schritt)
    /* g_OutfileWrapper.writeSectionTitle(getString("TXT_PROCESS_PURPOSE_SUPERIOR",g_sLoc) + ":");
    var isSet = false;
    for each(var oObjDef in oModelInfo.oSuperObjDef) {
        isSet = outputProcessPurposeForItem(oObjDef, true) || isSet;
    }
    if (! isSet) {
        g_Outfile.OutputLn(getString("TXT_NOT_SPECIFIED",g_sLoc), "Arial", 12, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_LEFT, 8);
    } */

    // Prozesszweck aus Modell
    //g_OutfileWrapper.writeSectionTitle(getString("TXT_PROCESS_PURPOSE_MAIN",g_sLoc) + ":");
    isSet = outputProcessPurposeForItem(oModelInfo.oModel, true);
    if (!isSet) {
        g_Outfile.OutputLn(getString("TXT_NOT_SPECIFIED", g_sLoc), "Arial", 12, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_LEFT, 8);
    }

    // Prozesszweck aus Prozessschritten
    /* g_OutfileWrapper.writeSectionTitle(getString("TXT_PROCESS_PURPOSE_STEPS",g_sLoc) + ":");
    isSet = false;
    for each(var oObjDef in oModelInfo.oRegularFuncDefList) {
        isSet = outputProcessPurposeForItem(oObjDef, true) || isSet;
    }
    if (! isSet) {
        g_Outfile.OutputLn(getString("TXT_NOT_SPECIFIED",g_sLoc), "Arial", 12, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_LEFT, 8);
    }

    g_Outfile.OutputLnF("", getString("WORD_TEMPLATE_FORMATTING_2")); */
}

function outputProcessPurposeForItem(oItem, bWriteItemTitle) {
    var isSet = false;
    var sValue = oItem.Attribute(ATTR_ZWECK, g_nLoc).getValue();
    if (!sValue.equals("")) {
        if (bWriteItemTitle) {
            g_Outfile.OutputLn(getString("TXT_PURPOSE_FOR", g_sLoc) + " '" + oItem.Name(g_nLoc) + "':", "Audi Type", 11, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_LEFT, 0);
        }
        g_Outfile.OutputLn(sValue, "Audi Type", 11, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_LEFT, 8);
        isSet = true;
    }
    return isSet;
}

/**
 * Gibt alle am Modell gepflgten Erfolgsfaktoren aus.
 *
 * @param Ausgabedatei
 * @param {ObjDef[]} odFunctionS Funktionen deren Erfolgsfaktoren ausgegeben werden.
 * @param {java.util.HashMap} Liste von Erfolgsfaktoren key: GUID; value: Erfolgsfaktor[]
 * @param {Model} ausgewähltes Model
 */
function createProcessGoals(g_Outfile, oModelInfo, oModel, nChapter) {
    g_Outfile.OutputLnF(nChapter + ".   " + getString("TXT_HEADLINE3", g_sLoc), getString("WORD_TEMPLATE_FORMATTING_6"));
    g_Outfile.Output("", "Arial", 5, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_BOLD | Constants.FMT_LEFT, 0);

    // goal of superior process steps
    /*     g_OutfileWrapper.writeSectionTitle(getString("TXT_PROCESS_GOAL_SUPERIOR",g_sLoc) + ":");
        g_OutfileWrapper.writeProcessGoal_BeginTable();
        var isSet = false;
        for each(var oFuncDef in oModelInfo.oSuperObjDef) {
            isSet = outputErfolgsfaktorenForItem(oFuncDef, true) || isSet;
        }
        if (! isSet) {
            g_OutfileWrapper.writeProcessGoal_Row(getString("TXT_NOT_SPECIFIED",g_sLoc), "", "");
        }
        g_OutfileWrapper.EndTable(); */

    // goal of process model
    //g_OutfileWrapper.writeSectionTitle(getString("TXT_PROCESS_GOAL_MAIN",g_sLoc) + ":");
    g_OutfileWrapper.writeProcessGoal_BeginTable();
    isSet = outputErfolgsfaktorenForItem(oModelInfo.oModel, false);
    if (!isSet) {
        g_OutfileWrapper.writeProcessGoal_Row(getString("TXT_NOT_SPECIFIED", g_sLoc), "", "");
    }
    g_OutfileWrapper.EndTable();

    // goal of process steps
    /*     g_OutfileWrapper.writeSectionTitle(getString("TXT_PROCESS_GOAL_STEPS",g_sLoc) + ":");
        g_OutfileWrapper.writeProcessGoal_BeginTable();
        isSet = false;
        for each(var oFuncDef in oModelInfo.oRegularFuncDefList) {
            isSet = outputErfolgsfaktorenForItem(oFuncDef, true) || isSet;
        }
        if (! isSet) {
            g_OutfileWrapper.writeProcessGoal_Row(getString("TXT_NOT_SPECIFIED",g_sLoc), "", "");
        }
        g_OutfileWrapper.EndTable(); */
}

function outputErfolgsfaktorenForItem(oItem, bWriteItemTitle) {
    var isSet = false;
    var oErfolgsfaktoren = g_oAudiHlp.getObjectFromAttribute("Erfolgsfaktor", oItem, ATTR_EF, g_nLoc);
    if (bWriteItemTitle && oErfolgsfaktoren.length > 0) {
        g_OutfileWrapper.writeProcessGoal_Row(getString("TXT_GOAL_FOR", g_sLoc) + " " + oItem.Name(g_nLoc), "", "");
    }
    for each(var tEF in oErfolgsfaktoren) {
        if (!tEF.sName.trim().equals("")) {
            var bKZ = false;
            var tKennS = tEF.tKennzahlen;
            for each(var tKenn in tKennS) {
                if (!tKenn.sBezeichnung.trim().equals("")) {
                    bKZ = true;
                    g_OutfileWrapper.writeProcessGoal_Row(tEF.sName, tKenn.sBezeichnung + "\n" + tKenn.sDefinition, tKenn.sSollwert);
                    isSet = true;
                }
            }
            if (!bKZ) {
                g_OutfileWrapper.writeProcessGoal_Row(tEF.sName, "", "");
                isSet = true;
            }
        }
    }
    return isSet;
}

/********************************************************************************
 * Ermittelt alle Rollen zu den angebebenen Modellen.
 *
 * @param Ausgabedatei
 * @param ausgewähltes Modell
 * @param Liste von Modellen (mit FZDs)
 **********************************************************************************/
function createRoles(g_Outfile, oModel, allModels, nChapter) {
    g_Outfile.OutputLnF(nChapter + ".   " + getString("TXT_HEADLINE6", g_sLoc), getString("WORD_TEMPLATE_FORMATTING_6"));
    g_Outfile.OutputLnF(getString("TXT_ROLES_COMMENT", g_sLoc), getString("WORD_TEMPLATE_FORMATTING_1"));

    var sOesAndRoles = getOrgUnitsAndRolesFromModelsAsString(allModels);
    if (!oModel.Attribute(ATTR_ZUSTAE, g_nLoc).getValue().equals("")) {
        sOesAndRoles += "\n" + oModel.Attribute(ATTR_ZUSTAE, g_nLoc).getValue().replace(";", "; ");
    }
    if (!sOesAndRoles.equals("")) {
        g_Outfile.OutputLnF(sOesAndRoles, getString("WORD_TEMPLATE_FORMATTING_1"));
    } else {
        g_Outfile.OutputLn(getString("TXT_NOT_SPECIFIED", g_sLoc), "Audi Type", 11, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_LEFT, 8);
    }

}

/********************************************************************************
 * Gibt alle Abhänigkeiten des Modells zu übergeordneten Modellen bzw. zu Vorgänger-
 * und Nachfolgermodellen aus.
 *
 * @param Ausgabedatei
 * @param ausgewähltes Modell
 **********************************************************************************/
function createProcessDependenciesOverview(g_Outfile, oModelInfo, nChapter) {

    g_Outfile.OutputLnF(nChapter + ".   " + getString("TXT_HEADLINE1", g_sLoc), getString("WORD_TEMPLATE_FORMATTING_6"));

    // Übergeordneter Prozess
    g_Outfile.OutputLnF(getString("TXT_SUPERORDINATE_PROCESS", g_sLoc) + ":", getString("WORD_TEMPLATE_FORMATTING_4"));
    var oTempModelList = getParentModels(oModelInfo.oModel);
    oTempModelList = ArisData.sort(oTempModelList, 1, g_nLoc);
    if (oTempModelList.length > 0) {
        for each(oTempModel in oTempModelList) {
            //g_Outfile.OutputLn("- " + oTempModel.Attribute(ATTR_NAME, g_nLoc).GetValue(true) + " " + oTempModel.Attribute(ATTR_NR, g_nLoc).GetValue(true), "Arial", 12, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_LEFT, 7);
            var sIdentifier = getProcessNameForModel(oTempModel);
            g_OutfileWrapper.writeListItem(sIdentifier, "");
        }
    } else {
        g_Outfile.OutputLn(getString("TXT_NOT_SPECIFIED", g_sLoc), "Audi Type", 11, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_LEFT, 8);
    }

    // Vorgängermodelle ermitteln
    g_Outfile.OutputLnF(getString("TXT_PROCESSES_PRE", g_sLoc) + ":", getString("WORD_TEMPLATE_FORMATTING_4"))
    if (oModelInfo.oIncomingInterfaceFuncDefList.length > 0) {
        for each(var oIncomingInterfaceFuncDef in oModelInfo.oIncomingInterfaceFuncDefList) {
            outputInterfaceInfo(oIncomingInterfaceFuncDef, g_Outfile);
        }
    } else {
        g_Outfile.OutputLn(getString("TXT_NOT_SPECIFIED", g_sLoc), "Audi Type", 11, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_LEFT, 8);
    }

    // Nachfolgermodell ermitteln
    g_Outfile.OutputLnF(getString("TXT_PROCESSES_SUC", g_sLoc) + ":", getString("WORD_TEMPLATE_FORMATTING_4"));
    if (oModelInfo.oOutgoingInterfaceFuncDefList.length > 0) {
        for each(var oOutgoingInterfaceFuncDef in oModelInfo.oOutgoingInterfaceFuncDefList) {
            outputInterfaceInfo(oOutgoingInterfaceFuncDef, g_Outfile);
        }
    } else {
        g_Outfile.OutputLn(getString("TXT_NOT_SPECIFIED", g_sLoc), "Audi Type", 11, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_LEFT, 8);
    }

    // Steuerungsprozesse
    g_Outfile.OutputLnF(getString("TXT_PROCESSES_CONTROL", g_sLoc) + ":", getString("WORD_TEMPLATE_FORMATTING_4"));
    if (oModelInfo.oControlingProcessFuncDefList.length > 0) {
        for each(var oProcessFuncDef in oModelInfo.oControlingProcessFuncDefList) {
            outputProcessInfo(oProcessFuncDef, g_Outfile);
        }
    } else {
        g_Outfile.OutputLn(getString("TXT_NOT_SPECIFIED", g_sLoc), "Audi Type", 11, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_LEFT, 8);
    }

    // Unterstützungsprozesse
    g_Outfile.OutputLnF(getString("TXT_PROCESSES_SUPPORTING", g_sLoc) + ":", getString("WORD_TEMPLATE_FORMATTING_4"));
    if (oModelInfo.oSupportingProcessFuncDefList.length > 0) {
        for each(var oProcessFuncDef in oModelInfo.oSupportingProcessFuncDefList) {
            outputProcessInfo(oProcessFuncDef, g_Outfile);
        }
    } else {
        g_Outfile.OutputLn(getString("TXT_NOT_SPECIFIED", g_sLoc), "Audi Type", 11, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_LEFT, 8);
    }
}

function outputInterfaceInfo(oInterfaceFuncDef, g_Outfile) {
    var oAssignedModelList = oInterfaceFuncDef.AssignedModels();

    if (oAssignedModelList.length > 0) {
        for each(var oAssignedModel in oAssignedModelList) {
            if (oAssignedModel.TypeNum() == Constants.MT_FUNC_ALLOC_DGM) {
                // Sonderfall: Falls hinterlegtes Funktionszuordnungsdiagramm --> Ausgabe der Informationsträger VA (war so in Vorgängerversion bisher implementiert!?)
                var oInfoCarrierObjDefList = oAssignedModel.ObjDefListFilter(OBJ_DOC);
                for each(var oInfoCarrierObjDef in oInfoCarrierObjDefList) {
                    if (isAttributeBooleanValue(oInfoCarrierObjDef, ATTR_VA)) {
                        var sIdentifier = oInfoCarrierObjDef.Attribute(ATTR_NAME, g_nLoc).GetValue(true) + " " + oInfoCarrierObjDef.Attribute(ATTR_TITLE1, g_nLoc).GetValue(true);
                        g_OutfileWrapper.writeListItem(sIdentifier, "");
                    }
                }
            } else {
                //oModelResultS.push(oAssigendModel.Attribute(ATTR_NAME, g_nLoc).GetValue(true)  + " " + oAssigendModel.Attribute(ATTR_NR, g_nLoc).GetValue(true) );
                var sIdentifier = getProcessNameForModel(oAssignedModel);
                var sHintText = isModelRCMReleased(oAssignedModel) ? "" : " (" + getString("TXT_MODEL_NOT_RELEASED", g_sLoc) + ")";
                g_OutfileWrapper.writeListItem(sIdentifier, sHintText);
            }
        }
    } else {
        //oModelResultS.push((oCurrentObj.ObjDef().Attribute(ATTR_NAME, g_nLoc).GetValue(true)) + " " + oCurrentObj.ObjDef().Attribute(ATTR_NR, g_nLoc).GetValue(true) );
        var sIdentifier = oInterfaceFuncDef.Name(g_nLoc);
        var sHintText = " (" + getString("TXT_MODEL_NONEXISTENT", g_sLoc) + ")";
        g_OutfileWrapper.writeListItem(sIdentifier, sHintText);
    }
}

function outputProcessInfo(oObjDef, g_Outfile) {
    var oAssignedModelList = oObjDef.AssignedModels();

    if (oAssignedModelList.length > 0) {
        for each(var oAssignedModel in oAssignedModelList) {
            var sIdentifier = getProcessNameForModel(oAssignedModel);
            var sHintText = isModelRCMReleased(oAssignedModel) ? "" : " (" + getString("TXT_MODEL_NOT_RELEASED", g_sLoc) + ")";
            g_OutfileWrapper.writeListItem(sIdentifier, sHintText);
        }
    } else {
        var sIdentifier = oObjDef.Name(g_nLoc);
        var sHintText = " (" + getString("TXT_MODEL_NONEXISTENT", g_sLoc) + ")";
        g_OutfileWrapper.writeListItem(sIdentifier, sHintText);
    }
}

function getProcessNameForModel(oModel) {
    var sProcessName = "";
    var sIdentifier = oModel.Attribute(ATTR_NR, g_nLoc).GetValue(true);
    if (sIdentifier.equals("")) {
        // kein Identifier gepflegt
        sProcessName = oModel.Name(g_nLoc);
    } else {
        // Ebene im Identifizierer finden
        var sLevel = "_" + oModel.Attribute(ATTR_EBENE, g_nLoc).GetValue(true) + "_";
        var nIndex = sIdentifier.search(sLevel);
        if (nIndex > -1) {
            var sPrefix = sIdentifier.substring(0, nIndex + sLevel.length);
            sProcessName = sPrefix + oModel.Name(g_nLoc);
        } else {
            sProcessName = sIdentifier + " [" + oModel.Name(g_nLoc) + "]";
        }
    }
    return sProcessName;
}

function isModelRCMReleased(oModel) {
    var nRCMStatusValueTypeNum = oModel.Attribute(ATTR_MODEL_STATUS, g_nLoc).MeasureUnitTypeNum();
    var bIsReleased = (nRCMStatusValueTypeNum == VWAudiConstants.AVT_MODEL_STATUS_RELEASED || nRCMStatusValueTypeNum == VWAudiConstants.AVT_MODEL_STATUS_READYFORRELEASE);
    return bIsReleased;
}

/********************************************************************************
 * Ermittelt alle in den Modellen ausgeprägten Dokumente und gibt bei einer 
 * Anzahl > 0 eine entsprechendne Hinweistext aus.
 *
 * @param Ausgabedatei
 * @param ausgewähltes Modell
 * @param Liste der im ausgewählten Modell ausgeprägten Objektdefinitionen
 * @param Objektdefinitionen des übergeordneten Modells
 * @param Liste von Modellen (ohne FZDs)
 * @param FZDs hinzufügen?
 **********************************************************************************/
function createProvisions(g_Outfile, oModel, oModelDefList, oSuperObjDef, oNonAssignedModels, bAddAssigned, nChapter) {
    g_Outfile.OutputLnF(nChapter + ".   " + getString("TXT_HEADLINE7", g_sLoc), getString("WORD_TEMPLATE_FORMATTING_6"));
    g_Outfile.OutputLnF(getString("TXT_PROVISIONS_COMMENT", g_sLoc), getString("WORD_TEMPLATE_FORMATTING_1"));
    if (!oModel.Attribute(ATTR_DESC, g_nLoc).getValue().equals("")) {
        g_Outfile.OutputLnF("\n" + oModel.Attribute(ATTR_DESC, g_nLoc).getValue(), getString("WORD_TEMPLATE_FORMATTING_1"));
    }

    var oDocs = new Array();
    // Docs aus ausgewaehltem Model bestimmen
    for (var o = 0; o < oModelDefList.length; o++) {
        var oDoc = oModelDefList[o];
        if (oDoc.TypeNum() == OBJ_DOC) {
            oDocs.push(oDoc);
        }
    }
    // Docs aus FZD ermitteln
    var oAssigendDocs = getAssigendDocs(oSuperObjDef);
    for (var o = 0; o < oAssigendDocs.length; o++) {
        oDoc = oAssigendDocs[o];
        oDocs.push(oDoc);
    }
    if (bAddAssigned) {
        // zusaetzliche Objecte hinzufügen
        oDocs = addObjectsFromNonFzds(oNonAssignedModels, oDocs, OBJ_DOC);
    }

    oDocs = ArisData.Unique(oDocs);

    if (oDocs.length > 0) {
        //g_Outfile.OutputLnF("\n" + getString("TXT_PROVISIONS_COMMENT",g_sLoc), getString("WORD_TEMPLATE_FORMATTING_1"));
        oDocs = ArisData.sort(oDocs, VWAudiConstants.ATT_NAME, g_nLoc);
    } else {
        g_Outfile.OutputLn("\n" + getString("TXT_NOT_SPECIFIED", g_sLoc), "Audi Type", 11, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_LEFT, 8);
    }
    return oDocs;
}

/********************************************************************************
 * Gibt alle am Modell gepflegten Begriffe aus.
 *
 * @param Ausgabedatei
 * @param ausgewähltes Modell
 **********************************************************************************/
function createDefinition(g_Outfile, oModel, nChapter) {
    g_Outfile.OutputLnF(nChapter + ".   " + getString("TXT_HEADLINE5", g_sLoc), getString("WORD_TEMPLATE_FORMATTING_6"));
    g_Outfile.Output("", "Audi Type", 5, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_BOLD | Constants.FMT_LEFT, 0);
    g_Outfile.BeginTable(100, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_LEFT, 0);
    g_Outfile.TableRow();
    g_Outfile.TableCellF(getString("TXT_SHORTCUT", g_sLoc), SPACING_2, getString("WORD_TEMPLATE_FORMATTING_4"));
    g_Outfile.TableCellF(getString("TXT_DECRIPTION_EXPLANATION", g_sLoc), SPACING_1 + SPACING_3 + SPACING_4 + SPACING_5, getString("WORD_TEMPLATE_FORMATTING_4"));

    var oItems = readBegriffe(oModel.Attribute(ATTR_AKZ, g_nLoc).getValue());
    if (oItems.length > 0) {
        for (var n = 0; n < oItems.length; n++) {
            g_Outfile.TableRow();
            g_Outfile.TableCellF(oItems[n]["Item"], SPACING_2, getString("WORD_TEMPLATE_FORMATTING_1"));
            g_Outfile.TableCellF(oItems[n]["Desc"], SPACING_1 + SPACING_3 + SPACING_4 + SPACING_5, getString("WORD_TEMPLATE_FORMATTING_1"));
        }
    } else {
        g_Outfile.TableRow();
        g_Outfile.TableCellF(getString("TXT_NOT_SPECIFIED", g_sLoc), SPACING_2, getString("WORD_TEMPLATE_FORMATTING_1"));
        g_Outfile.TableCellF("", SPACING_3 + SPACING_1 + SPACING_4 + SPACING_5, getString("WORD_TEMPLATE_FORMATTING_1"));
    }
    g_Outfile.EndTable("", 100, "Audi Type", 8, Constants.C_TRANSPARENT, Constants.C_TRANSPARENT, 0, Constants.FMT_LEFT | Constants.FMT_VTOP, 0);
}

/********************************************************************************
 * Gibt den am Modell gepflegten Geltungsbereich aus.
 *
 * @param Ausgabedatei
 * @param ausgewähltes Modell
 **********************************************************************************/
/* function  createAmbit(g_Outfile, oModel) {
    g_Outfile.OutputLnF("4.   "  + getString("TXT_HEADLINE4",g_sLoc), getString("WORD_TEMPLATE_FORMATTING_6"));
    g_Outfile.OutputLnF(getString("TXT_AMBIT_COMMENT",g_sLoc), getString("WORD_TEMPLATE_FORMATTING_7"));
    g_Outfile.Output("", "Audi Type", 5, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_BOLD | Constants.FMT_LEFT, 0);
    
    if (!oModel.Attribute(ATTR_GESELLSCH, g_nLoc).getValue().equals("") || !oModel.Attribute(ATTR_WERK, g_nLoc).getValue().equals("")) {
        var sCompanies = getString("TXT_AMBIT_VALID_FOR",g_sLoc) + ": " + oModel.Attribute(ATTR_GESELLSCH, g_nLoc).getValue();
        g_Outfile.OutputLnF(sCompanies.replace("\r\n",", "), getString("WORD_TEMPLATE_FORMATTING_1"));
        var sLocation = getString("TXT_LOCATION",g_sLoc) + ": " + oModel.Attribute(ATTR_WERK, g_nLoc).getValue();
        g_Outfile.OutputLnF(sLocation.replace("\r\n",", "), getString("WORD_TEMPLATE_FORMATTING_1"));
    } else {
        g_Outfile.OutputLn(getString("TXT_NOT_SPECIFIED",g_sLoc), "Audi Type", 11, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_LEFT, 8);
    }
} */

/********************************************************************************
 * Erstellt Ausgabe der in den Modellen ausgepägten Dokumentationen. 
 *
 * @param Ausgabedatei
 * @param ausgewähltes Modell
 * @param Liste von Dokumenten
 **********************************************************************************/
function createDocumentation(g_Outfile, oModel, oDocs, nChapter) {
    g_Outfile.OutputLnF(nChapter + ".   " + getString("TXT_HEADLINE8", g_sLoc), getString("WORD_TEMPLATE_FORMATTING_6"));

    //SubChapter Anlagen
    g_Outfile.OutputLnF(nChapter + ".1  " + getString("TXT_HEADLINE8_1", g_sLoc), getString("WORD_TEMPLATE_FORMATTING_4"));
    g_Outfile.OutputLnF(getString("TXT_DOCUMENTATION_COMMENT_1", g_sLoc), getString("WORD_TEMPLATE_FORMATTING_1"));
    g_Outfile.Output("", "Audi Type", 5, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_BOLD | Constants.FMT_LEFT, 0);
    g_Outfile.BeginTable(100, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_LEFT, 0);
    g_Outfile.TableRow();
    g_Outfile.TableCellF(getString("TXT_DOCUMENT", g_sLoc), SPACING_2, getString("WORD_TEMPLATE_FORMATTING_4"));
    g_Outfile.TableCellF(getString("TXT_DESCRIPTION", g_sLoc), SPACING_3 + SPACING_1 + SPACING_4 + SPACING_5, getString("WORD_TEMPLATE_FORMATTING_4"));

    var attr_Model_ANLAGEN_DOK = oModel.Attribute(ATTR_ANLAGEN_GUID, -1).getValue();
    var arr_ANLAGEN_DOK = new Array();
    arr_ANLAGEN_DOK = attr_Model_ANLAGEN_DOK.split(";");

    var objDef_ANLAGEN = new Array();
    for (var i = 0; i < arr_ANLAGEN_DOK.length; i++) {
        var foundObj = ArisData.getActiveDatabase().FindGUID(arr_ANLAGEN_DOK[i], Constants.CID_OBJDEF); //documents
        if (foundObj != null && foundObj.IsValid())
            objDef_ANLAGEN.push(foundObj);
    }

    if (objDef_ANLAGEN.length > 0) {
        for (var o = 0; o < objDef_ANLAGEN.length; o++) {
            var oDoc_ANLAGEN = objDef_ANLAGEN[o];
            g_Outfile.TableRow();
            g_Outfile.TableCellF(oDoc_ANLAGEN.Attribute(ATTR_NAME, g_nLoc).getValue(), SPACING_2, getString("WORD_TEMPLATE_FORMATTING_1"));
            if (oDoc_ANLAGEN.Attribute(ATTR_TITLE1, g_nLoc).getValue().equals("")) {
                g_Outfile.TableCellF(oDoc_ANLAGEN.Attribute(ATTR_DESC, g_nLoc).getValue(), SPACING_3 + SPACING_1 + SPACING_4 + SPACING_5, getString("WORD_TEMPLATE_FORMATTING_1"));
            } else {
                g_Outfile.TableCellF(oDoc_ANLAGEN.Attribute(ATTR_TITLE1, g_nLoc).getValue() + "\n" + oDoc_ANLAGEN.Attribute(ATTR_DESC, g_nLoc).getValue(), SPACING_3 + SPACING_1 + SPACING_4 + SPACING_5, getString("WORD_TEMPLATE_FORMATTING_1"));
            }
        }
    } else {
        g_Outfile.TableRow();
        g_Outfile.TableCellF(getString("TXT_NOT_SPECIFIED", g_sLoc), SPACING_2, getString("WORD_TEMPLATE_FORMATTING_1"));
        g_Outfile.TableCellF("", SPACING_3 + SPACING_1 + SPACING_4 + SPACING_5, getString("WORD_TEMPLATE_FORMATTING_1"));
    }
    g_Outfile.EndTable("", 100, "Audi Type", 8, Constants.C_TRANSPARENT, Constants.C_TRANSPARENT, 0, Constants.FMT_LEFT | Constants.FMT_VTOP, 0);
    g_Outfile.OutputLnF("", getString("WORD_TEMPLATE_FORMATTING_1"));

    //SubChapter Mitgeltende Dokumentation
    g_Outfile.OutputLnF(nChapter + ".1  " + getString("TXT_HEADLINE8_2", g_sLoc), getString("WORD_TEMPLATE_FORMATTING_4"));
    g_Outfile.OutputLnF(getString("TXT_DOCUMENTATION_COMMENT_2", g_sLoc), getString("WORD_TEMPLATE_FORMATTING_1"));
    g_Outfile.Output("", "Audi Type", 5, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_BOLD | Constants.FMT_LEFT, 0);
    g_Outfile.BeginTable(100, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_LEFT, 0);
    g_Outfile.TableRow();
    g_Outfile.TableCellF(getString("TXT_DOCUMENT", g_sLoc), SPACING_2, getString("WORD_TEMPLATE_FORMATTING_4"));
    g_Outfile.TableCellF(getString("TXT_DESCRIPTION", g_sLoc), SPACING_3 + SPACING_1 + SPACING_4 + SPACING_5, getString("WORD_TEMPLATE_FORMATTING_4"));

    var attr_Model_MITGELTENDE_DOK = oModel.Attribute(ATTR_MITGELTENDE_DOK_NUM, -1).getValue();
    var arr_MITGELTENDE_DOK = new Array();
    arr_MITGELTENDE_DOK = attr_Model_MITGELTENDE_DOK.split(";");

    var objDef_MITGELTENDE = new Array();
    for (var i = 0; i < arr_MITGELTENDE_DOK.length; i++) {
        var foundObj = ArisData.getActiveDatabase().FindGUID(arr_MITGELTENDE_DOK[i], Constants.CID_OBJDEF); //documents
        if (foundObj != null && foundObj.IsValid())
            objDef_MITGELTENDE.push(foundObj);
    }

    if (objDef_MITGELTENDE.length > 0) {
        for (var o = 0; o < objDef_MITGELTENDE.length; o++) {
            var oDoc_MITGELTENDE = objDef_MITGELTENDE[o];
            g_Outfile.TableRow();
            g_Outfile.TableCellF(oDoc_MITGELTENDE.Attribute(ATTR_NAME, g_nLoc).getValue(), SPACING_2, getString("WORD_TEMPLATE_FORMATTING_1"));
            if (oDoc_MITGELTENDE.Attribute(ATTR_TITLE1, g_nLoc).getValue().equals("")) {
                g_Outfile.TableCellF(oDoc_MITGELTENDE.Attribute(ATTR_DESC, g_nLoc).getValue(), SPACING_3 + SPACING_1 + SPACING_4 + SPACING_5, getString("WORD_TEMPLATE_FORMATTING_1"));
            } else {
                g_Outfile.TableCellF(oDoc_MITGELTENDE.Attribute(ATTR_TITLE1, g_nLoc).getValue() + "\n" + oDoc_MITGELTENDE.Attribute(ATTR_DESC, g_nLoc).getValue(), SPACING_3 + SPACING_1 + SPACING_4 + SPACING_5, getString("WORD_TEMPLATE_FORMATTING_1"));
            }
        }
    } else {
        g_Outfile.TableRow();
        g_Outfile.TableCellF(getString("TXT_NOT_SPECIFIED", g_sLoc), SPACING_2, getString("WORD_TEMPLATE_FORMATTING_1"));
        g_Outfile.TableCellF("", SPACING_3 + SPACING_1 + SPACING_4 + SPACING_5, getString("WORD_TEMPLATE_FORMATTING_1"));
    }
    g_Outfile.EndTable("", 100, "Audi Type", 8, Constants.C_TRANSPARENT, Constants.C_TRANSPARENT, 0, Constants.FMT_LEFT | Constants.FMT_VTOP, 0);
    g_Outfile.OutputLnF("", getString("WORD_TEMPLATE_FORMATTING_1"));

    //SubChapter Weiterführende Dokumentation
    g_Outfile.OutputLnF(nChapter + ".3  " + getString("TXT_HEADLINE8_3", g_sLoc), getString("WORD_TEMPLATE_FORMATTING_4"));
    g_Outfile.OutputLnF(getString("TXT_DOCUMENTATION_COMMENT_3", g_sLoc), getString("WORD_TEMPLATE_FORMATTING_1"));
    g_Outfile.Output("", "Audi Type", 5, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_BOLD | Constants.FMT_LEFT, 0);

    g_Outfile.BeginTable(100, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_LEFT, 0);
    g_Outfile.TableRow();
    g_Outfile.TableCellF(getString("TXT_DOCUMENT", g_sLoc), SPACING_2, getString("WORD_TEMPLATE_FORMATTING_4"));
    g_Outfile.TableCellF(getString("TXT_DESCRIPTION", g_sLoc), SPACING_3 + SPACING_1 + SPACING_4 + SPACING_5, getString("WORD_TEMPLATE_FORMATTING_4"));

    var attr_Model_WEITERFUHRENDE_DOK = oModel.Attribute(ATTR_WEITERFUHRENDE_DOK_NUM, -1).getValue();
    var arr_WEITERFUHRENDE_DOK = new Array();
    arr_WEITERFUHRENDE_DOK = attr_Model_WEITERFUHRENDE_DOK.split(";");

    var objDef_WEITERFUHRENDE = new Array();
    for (var i = 0; i < arr_WEITERFUHRENDE_DOK.length; i++) {
        var foundObj = ArisData.getActiveDatabase().FindGUID(arr_WEITERFUHRENDE_DOK[i], Constants.CID_OBJDEF); //documents
        if (foundObj != null && foundObj.IsValid())
            objDef_WEITERFUHRENDE.push(foundObj);
    }

    if (objDef_WEITERFUHRENDE.length > 0) {
        for (var o = 0; o < objDef_WEITERFUHRENDE.length; o++) {
            var oDoc_WEITERFUHRENDE = objDef_WEITERFUHRENDE[o];
            g_Outfile.TableRow();
            g_Outfile.TableCellF(oDoc_WEITERFUHRENDE.Attribute(ATTR_NAME, g_nLoc).getValue(), SPACING_2, getString("WORD_TEMPLATE_FORMATTING_1"));
            if (oDoc_WEITERFUHRENDE.Attribute(ATTR_TITLE1, g_nLoc).getValue().equals("")) {
                g_Outfile.TableCellF(oDoc_WEITERFUHRENDE.Attribute(ATTR_DESC, g_nLoc).getValue(), SPACING_3 + SPACING_1 + SPACING_4 + SPACING_5, getString("WORD_TEMPLATE_FORMATTING_1"));
            } else {
                g_Outfile.TableCellF(oDoc_WEITERFUHRENDE.Attribute(ATTR_TITLE1, g_nLoc).getValue() + "\n" + oDoc_WEITERFUHRENDE.Attribute(ATTR_DESC, g_nLoc).getValue(), SPACING_3 + SPACING_1 + SPACING_4 + SPACING_5, getString("WORD_TEMPLATE_FORMATTING_1"));
            }
        }
    } else {
        g_Outfile.TableRow();
        g_Outfile.TableCellF(getString("TXT_NOT_SPECIFIED", g_sLoc), SPACING_2, getString("WORD_TEMPLATE_FORMATTING_1"));
        g_Outfile.TableCellF("", SPACING_3 + SPACING_1 + SPACING_4 + SPACING_5, getString("WORD_TEMPLATE_FORMATTING_1"));
    }
    g_Outfile.EndTable("", 100, "Audi Type", 8, Constants.C_TRANSPARENT, Constants.C_TRANSPARENT, 0, Constants.FMT_LEFT | Constants.FMT_VTOP, 0);
}

/********************************************************************************
 *  Erstellt Ausgabe der in den Modellen ausgeprägten Anwedungssysteme.
 * 
 * @param Ausgabedatei
 * @param ausgewähltes Modell
 * @param übergeordnete Objektdefinitionen
 * @param Liste von Modellen (ohne FZDs)
 * @param FZDs hinzufügen?
 **********************************************************************************/
function createITSystemOverview(g_Outfile, oModelDefList, oSuperObjDef, oNonAssignedModels, bAddAssigned, nChapter) {

    g_Outfile.OutputLnF(nChapter + ".   " + getString("TXT_HEADLINE9", g_sLoc), getString("WORD_TEMPLATE_FORMATTING_6"));

    // IT-Systeme aus Modell
    var oSyss = new Array();
    for (o = 0; o < oModelDefList.length; o++) {
        var oSys = oModelDefList[o];
        if (oSys.TypeNum() == OBJ_SYS) {
            oSyss.push(oSys);
        }
    }

    var oAssigendSys = getAssigendSys(oSuperObjDef);
    // IT-Systeme aus FZDs
    for (o = 0; o < oAssigendSys.length; o++) {
        oSys = oAssigendSys[o];
        oSyss.push(oSys);
    }

    if (bAddAssigned) {
        // zusaetzliche Modelle
        oSyss = addObjectsFromNonFzds(oNonAssignedModels, oSyss, OBJ_SYS);
    }

    oSyss = ArisData.Unique(oSyss);

    g_Outfile.BeginTable(100, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_LEFT, 0);
    g_Outfile.TableRow();
    g_Outfile.TableCellF(getString("TXT_IT_SYSTEM", g_sLoc), SPACING_2, getString("WORD_TEMPLATE_FORMATTING_4"));
    g_Outfile.TableCellF(getString("TXT_FULLNAME", g_sLoc), SPACING_3 + SPACING_1 + SPACING_4 + SPACING_5, getString("WORD_TEMPLATE_FORMATTING_4"));

    var bValueIsNotSet = true;
    if (oSyss.length > 0) {
        ArisData.sort(oSyss, VWAudiConstants.ATT_NAME, g_nLoc);
        for (var o = 0; o < oSyss.length; o++) {
            bValueIsNotSet = false;
            osys = oSyss[o];
            g_Outfile.TableRow();
            g_Outfile.TableCellF(osys.Attribute(ATTR_NAME, g_nLoc).getValue(), SPACING_2, getString("WORD_TEMPLATE_FORMATTING_1"));
            g_Outfile.TableCellF(osys.Attribute(ATTR_NAME_FULL, g_nLoc).getValue(), SPACING_3 + SPACING_1 + SPACING_4 + SPACING_5, getString("WORD_TEMPLATE_FORMATTING_1"));
        }
    }

    if (bValueIsNotSet) {
        g_Outfile.TableRow();
        g_Outfile.TableCellF(getString("TXT_NOT_SPECIFIED", g_sLoc), SPACING_2, getString("WORD_TEMPLATE_FORMATTING_1"));
        g_Outfile.TableCellF("", SPACING_3 + SPACING_1 + SPACING_4 + SPACING_5, getString("WORD_TEMPLATE_FORMATTING_1"));
    }

    g_Outfile.EndTable("", 100, "Audi Type", 8, Constants.C_TRANSPARENT, Constants.C_TRANSPARENT, 0, Constants.FMT_LEFT | Constants.FMT_VTOP, 0);
}

/********************************************************************************
 *  Erstellt Änderungsdienst, Erstellerteam, Geltungsbereich.
 * 
 * @param Ausgabedatei
 * @param ausgewähltes Modell
 * @param Liste von Modellen (ohne FZDs)
 **********************************************************************************/
function createChangeOverview(g_Outfile, oModel, nChapter) {
    g_Outfile.OutputLnF(nChapter + ".   " + getString("TXT_HEADLINE10", g_sLoc), getString("WORD_TEMPLATE_FORMATTING_6"));
    //Subchapter Änderungsdienst
    g_Outfile.OutputLnF(getString("TXT_CHANGE_SERVICE", g_sLoc), getString("WORD_TEMPLATE_FORMATTING_4"));
    g_Outfile.Output("", "Audi Type", 5, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_BOLD | Constants.FMT_LEFT, 0);
    var sRevisionService = oModel.Attribute(ATTR_DIENST, g_nLoc).getValue();
    if (sRevisionService.equals("")) {
        sRevisionService = "N.N.";
    }
    g_Outfile.OutputF(getString("TXT_CHANGE_SERVICE_HINT1", g_sLoc) + " " + sRevisionService + " " + getString("TXT_CHANGE_SERVICE_HINT2", g_sLoc) + "\n", getString("WORD_TEMPLATE_FORMATTING_1"));
    //Subchapter Änderungsdienst - Änderungshistorie
    g_Outfile.OutputLnF("\n" + getString("TXT_HISTORY", g_sLoc) + ":", getString("WORD_TEMPLATE_FORMATTING_4"));
    g_Outfile.BeginTable(100, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_LEFT, 0);
    g_Outfile.TableRow();
    g_Outfile.TableCellF(getString("TXT_VERSION", g_sLoc), SPACING_1, getString("WORD_TEMPLATE_FORMATTING_4"));
    g_Outfile.TableCellF(getString("TXT_STATUS", g_sLoc), SPACING_1, getString("WORD_TEMPLATE_FORMATTING_4"));
    g_Outfile.TableCellF(getString("TXT_CHANGE", g_sLoc), SPACING_1 + SPACING_2 + SPACING_4 + SPACING_5, getString("WORD_TEMPLATE_FORMATTING_4"));
    g_Outfile.EndTable("", 100, "Audi Type", 8, Constants.C_TRANSPARENT, Constants.C_TRANSPARENT, 0, Constants.FMT_LEFT | Constants.FMT_VTOP, 0);

    //Subchapter Änderungsdienst - Erstellerteam
    g_Outfile.OutputLnF("\n" + getString("TXT_CREATION_TEAM", g_sLoc) + ":", getString("WORD_TEMPLATE_FORMATTING_4"));
    g_Outfile.Output((oModel.Attribute(ATTR_CREATOR, g_nLoc).getValue() + "\n"), "Audi Type", 11, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_LEFT, 0);

    //Subchapter Geltungsbereich
    g_Outfile.OutputLnF("\n" + getString("TXT_HEADLINE4", g_sLoc), getString("WORD_TEMPLATE_FORMATTING_4"));
    //g_Outfile.OutputLnF(getString("TXT_AMBIT_COMMENT",g_sLoc), getString("WORD_TEMPLATE_FORMATTING_1"));
    g_Outfile.Output("", "Audi Type", 5, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_LEFT, 0);
    if (!oModel.Attribute(ATTR_GESELLSCH, g_nLoc).getValue().equals("") || !oModel.Attribute(ATTR_WERK, g_nLoc).getValue().equals("")) {
        var sCompanies = getString("TXT_AMBIT_VALID_FOR", g_sLoc) + ": " + oModel.Attribute(ATTR_GESELLSCH, g_nLoc).getValue();
        g_Outfile.OutputLnF(sCompanies.replace("\r\n", ", "), getString("WORD_TEMPLATE_FORMATTING_1"));
        var sLocation = oModel.Attribute(ATTR_WERK, g_nLoc).getValue();
        g_Outfile.OutputLnF(getString("TXT_LOCATION", g_sLoc) + ": \n", getString("WORD_TEMPLATE_FORMATTING_1"));
        g_Outfile.OutputLnF(sLocation.replace("\r\n", ", "), getString("WORD_TEMPLATE_FORMATTING_1"));
    } else {
        g_Outfile.OutputLnF(getString("TXT_NOT_SPECIFIED", g_sLoc), getString("WORD_TEMPLATE_FORMATTING_1"));
    }

    //Subchapter Empfohlener Geltungsbereich
    g_Outfile.OutputLnF(getString("TXT_RECOMMENDATION", g_sLoc) + ":", getString("WORD_TEMPLATE_FORMATTING_4"));
    g_Outfile.Output("", "Audi Type", 5, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_LEFT, 0);
    g_Outfile.OutputLnF(getString("TXT_RECOMMENDATION_DESC", g_sLoc) + "\n", getString("WORD_TEMPLATE_FORMATTING_1"));
    var sEmpfehlung = oModel.Attribute(ATTR_Empfehlung, g_nLoc).getValue();
    if (!sEmpfehlung.equals("")) {
        g_Outfile.OutputLnF(sEmpfehlung, getString("WORD_TEMPLATE_FORMATTING_1"));
    } else {
        g_Outfile.OutputLnF(getString("TXT_NOT_SPECIFIED", g_sLoc), getString("WORD_TEMPLATE_FORMATTING_1"));
    }

}

/********************************************************************************
 *  Erstellt Verteiler = OEs distribution list.
 * 
 * @param Ausgabedatei
 * @param ausgewähltes Modell
 * @param Liste von Modellen (ohne FZDs)
 **********************************************************************************/
function createDistributionOverview(g_Outfile, oModel, nChapter) {
    g_Outfile.OutputLnF(nChapter + ".   " + getString("TXT_DISTRIBUTION_LIST", g_sLoc), getString("WORD_TEMPLATE_FORMATTING_6"));
    g_Outfile.OutputLnF(getString("TXT_DISTRIBUTION_LIST_HINT", g_sLoc), getString("WORD_TEMPLATE_FORMATTING_1"));
   // g_Outfile.Output("", "Audi Type", 5, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_BOLD | Constants.FMT_LEFT, 0);
    g_Outfile.OutputLnF("", getString("WORD_TEMPLATE_FORMATTING_1"));
    
    var sVerteiler = oModel.Attribute(ATTR_VERTEILER, g_nLoc).getValue();
    var arr_Verteiler = new Array();
    var arr_Header = new Array();
    var myHashMap = new Packages.java.util.HashMap();


    if (sVerteiler.length() > 0) {
        var arr_Verteiler = new Array();
        arr_Verteiler = sVerteiler.split(";");
        arr_Verteiler = getUniqueAndSorted(arr_Verteiler);
        
        for (var r = 0; r < arr_Verteiler.length; r++) {
            var sName = arr_Verteiler[r].trim();
            var foundObjs = ArisData.getActiveDatabase().Find(Constants.SEARCH_OBJDEF, Constants.OT_ORG_UNIT, Constants.AT_NAME, g_nLoc, sName, Constants.SEARCH_CMP_EQUAL)
             for (objIndex in foundObjs ) {
                var foundObj = foundObjs[objIndex];
                if (foundObj != null && foundObj.IsValid()) {
                    var path_DE = foundObj.Group().Path(1031); //path in DE
                    if (path_DE.indexOf("006 Organisation") > 0) {
                        var aCnxs = foundObj.CxnListFilter(Constants.EDGES_IN);
                        for (var t = 0; t < aCnxs.length; t++) {
                            if (aCnxs[t].TypeNum() == 3) {
                                sKey = sName;
                                sValue = aCnxs[t].SourceObjDef().Name(g_nLoc); //superior objs
                                
                                myHashMap.put(sKey, sValue);
                                arr_Header.push(sValue);
                            }
                        }
                    }
                }
            } //if
        }
    }

    /*
      Make unique and sorted arry
      */

    function getUniqueAndSorted(oItemList) {
        oItemList = ArisData.Unique(oItemList);
        oItemList = ArisData.sort(oItemList, 1, g_nLoc);
        return oItemList;
    }

    /*
    Get all keys assigned by value from HashMap
    */
    function getKeysByValue(myHashMap, value) {
        var keysByValue = new Array();
        var keys = new Packages.java.util.HashMap();

        for (var entry = myHashMap.keySet().iterator(); entry.hasNext();) {
            var valueMAP = entry.next();
            var key = myHashMap.get(valueMAP);
            if (StrComp(value, key) == 0) {
                keysByValue.push(valueMAP);
            }
        } //for
        return keysByValue.sort();
    }

    arr_Header = getUniqueAndSorted(arr_Header);
    //  arr_Header = ArisData.Unique(arr_Header);
    //  arr_Header = ArisData.sort(arr_Header, VWAudiConstants.ATT_NAME, g_nLoc);

    g_Outfile.BeginTable(100, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_LEFT, 0);
    g_Outfile.TableRow();

    if (arr_Header.length > 0) {
        for (var i = 0; i < arr_Header.length; i++) { //header
            var header = arr_Header[i];
            g_Outfile.TableCellF(getString("TXT_GB")+ " " + header, SPACING_1, getString("WORD_TEMPLATE_FORMATTING_10"));
        }
        g_Outfile.TableRow();
        for (var j = 0; j < arr_Header.length; j++) { //2nd row
            var header = arr_Header[j];
            var rowValues = getKeysByValue(myHashMap, header);
            if (rowValues != null) {
                rowValues = rowValues.toString().replace(",", "\n");
                g_Outfile.TableCellF(rowValues, SPACING_1, getString("WORD_TEMPLATE_FORMATTING_9"));
            } else {
                g_Outfile.TableCellF("-", SPACING_1, getString("WORD_TEMPLATE_FORMATTING_9"));
            }
        } //for
        g_Outfile.TableRow();
    } else {
        g_Outfile.TableRow();
        g_Outfile.TableCellF(getString("TXT_NOT_SPECIFIED", g_sLoc), SPACING_2, getString("WORD_TEMPLATE_FORMATTING_1"));
        g_Outfile.TableCellF("", SPACING_3 + SPACING_1 + SPACING_4 + SPACING_5, getString("WORD_TEMPLATE_FORMATTING_1"));
    }
    g_Outfile.EndTable("", 100, "Audi Type", 8, Constants.C_TRANSPARENT, Constants.C_TRANSPARENT, 0, Constants.FMT_LEFT | Constants.FMT_VTOP, 0);

}

/********************************************************************************
 *  Erstellt Modellgrafiken.
 * 
 * @param Ausgabedatei
 * @param ausgewähltes Modell
 * @param Liste von Modellen (ohne FZDs)
 * @param FZDs hinzufügen?
 **********************************************************************************/
function createModelGraphics(g_Outfile, oModel, oNonAssignedModels, bAddAssigned, bSeparateModelGraphic, sPath) {

    // neue Seite
    g_Outfile.OutputField(Constants.FIELD_NEWPAGE, "Arial", 11, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_BOLD | Constants.FMT_LEFT);

    if (bSeparateModelGraphic) {
        // generate model graphic pdf and output link
        g_Outfile.OutputLnF(getString("TXT_MODEL_GRAPHIC_SEPARATED", g_sLoc), getString("WORD_TEMPLATE_FORMATTING_1"));
        g_Outfile.OutputLnF(Context.getSelectedPath(), getString("WORD_TEMPLATE_FORMATTING_1"));
        g_Outfile.OutputLnF("", getString("WORD_TEMPLATE_FORMATTING_1"));
        g_Outfile.OutputLnF(getString("TXT_MODEL_GRAPHIC_LINKHINT", g_sLoc), getString("WORD_TEMPLATE_FORMATTING_1"));
        g_Outfile.OutputLnF("", getString("WORD_TEMPLATE_FORMATTING_1"));

        insertGeneratedModelGraphicLink(oModel, sPath);

    } else {
        // output graphic
        if (oModel.TypeNum() == MOD_PROC) {
            g_Outfile.OutputLnF(getString("TXT_MODEL_GRAPHIC_HINT", g_sLoc), getString("WORD_TEMPLATE_FORMATTING_1"));
        }
        g_Outfile.OutGraphic(oModel.Graphic(false, false, g_nLoc), gZoom, (((g_Outfile.GetPageWidth() - g_Outfile.GetLeftMargin()) - g_Outfile.GetRightMargin()) - GFX_CORRWIDTH), (((g_Outfile.GetPageHeight() - g_Outfile.GetTopMargin()) - g_Outfile.GetBottomMargin()) - GFX_CORRHEIGHT));
    }

    // Grafiken der hinterlegten Modelle ausgeben
    if (bAddAssigned) {
        for (var o = 0; o < oNonAssignedModels.length; o++) {
            var oTempModel = oNonAssignedModels[o];
            if (bSeparateModelGraphic) {
                // generate model graphic pdf and output link
                insertGeneratedModelGraphicLink(oTempModel, sPath);

            } else {
                // output further model graphic
                g_Outfile.OutputField(Constants.FIELD_NEWPAGE, "Audi Type", 11, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_BOLD | Constants.FMT_LEFT);
                g_Outfile.OutGraphic(oTempModel.Graphic(false, false, g_nLoc), gZoom, (((g_Outfile.GetPageWidth() - g_Outfile.GetLeftMargin()) - g_Outfile.GetRightMargin()) - GFX_CORRWIDTH), (((g_Outfile.GetPageHeight() - g_Outfile.GetTopMargin()) - g_Outfile.GetBottomMargin()) - GFX_CORRHEIGHT));
            }
        }
    }
}

function insertGeneratedModelGraphicLink(oSelectedModel, sPath) {
    var sModelName = oSelectedModel.Name(g_nLoc) + "";
    sFileName = ensureFileName(sModelName) + ".pdf";

    generateModelGraphicPDF(oSelectedModel, sFileName, sModelName);
    g_Outfile.OutputLink(sModelName, "file://" + sPath + sFileName, "Audi Type", "11", 0, Constants.C_TRANSPARENT, Constants.FMT_LEFT);
    g_Outfile.OutputLnF("", getString("WORD_TEMPLATE_FORMATTING_1"));
}

function generateModelGraphicPDF(oModel, sFileName, sHeaderName) {
    var oPDFGraphic = new PDFGraphic();
    oPDFGraphic.init(sFileName, sHeaderName);
    oPDFGraphic.generateContent(oModel, g_nLoc);
    oPDFGraphic.closeDocument();
    Context.addOutputFileName(sFileName, Constants.LOCATION_OUTPUT);
}

/********************************************************************************
 *  Ermittelt alle Rollen die mit den übergebenen Objekten verknüft sind.
 *
 * @param Liste mit Objektdefinitionen
 *
 * @return Liste mit Rollen
 **********************************************************************************/
function getAssigendRoles(oCurrentObjDef) {

    var oRoleList = new Array();

    var oObjOccList = oCurrentObjDef.OccList();
    for (var i = 0; i < oObjOccList.length; i++) {
        var oCurrentOcc = oObjOccList[i];
        var oCxnList = oCurrentOcc.InEdges(Constants.EDGES_ALL);
        for (var j = 0; j < oCxnList.length; j++) {
            var oCurrentCxn = oCxnList[j];
            if (oCurrentCxn.SourceObjOcc().ObjDef().TypeNum() == OBJ_ROL) {
                oRoleList.push(oCurrentCxn.SourceObjOcc().ObjDef());
            }
        }
    }
    return ArisData.Unique(oRoleList);
}

/********************************************************************************
 * Ermittelt das FZD zu einem Objekt und liefert alle darin enthaltenen 
 * Objektdefinitionen.
 *
 * @param Objektdefinition
 * @param Typ des Modells
 *
 * @return Liste mit Objektdefinitionen
 **********************************************************************************/
function getFromFzd(oFunction, typeNr) {

    var oResultList = new Array();

    var oOccs = oFunction.OccList();
    for (var i = 0; i < oOccs.length; i++) {
        var oOcc = oOccs[i];
        var oModel = oOcc.Model();
        if (oModel.TypeNum() == Constants.MT_FUNC_ALLOC_DGM) {
            var oObjs = oModel.ObjDefList();
            for (j = 0; j < oObjs.length; j++) {
                var oObj = oObjs[j];
                if (oObj.TypeNum() == typeNr) {
                    oResultList.push(oObj);
                }
            }
        }
    }

    return oResultList;
}

/********************************************************************************
 *  Ermittelt alle Dokumente die mit den übergebenen Objekten verknüft sind.
 *
 * @param Liste mit Objektdefinitionen
 *
 * @return Liste mit Dokumenten
 **********************************************************************************/
function getAssigendDocs(oCurrentObjDefs) {

    var oDocList = new Array();

    for (var i = 0; i < oCurrentObjDefs.length; i++) {
        var oTempObjDef = oCurrentObjDefs[i];
        var oObjOccList = oTempObjDef.OccList();
        for (var j = 0; j < oObjOccList.length; j++) {
            var oCurrOcc = oObjOccList[j];
            var oCxnlist = oCurrOcc.InEdges(Constants.EDGES_ALL);
            for (k = 0; k < oCxnlist.length; k++) {
                oCurrCxn = oCxnlist[k];
                if (oCurrCxn.SourceObjOcc().ObjDef().TypeNum() == OBJ_DOC) {
                    oDocList.push(oCurrCxn.SourceObjOcc().ObjDef());
                }
            }
        }
    }

    return ArisData.Unique(oDocList);
}

/********************************************************************************
 *  Ermittelt alle Organisationseinheiten die mit den übergebenen Objekten verknüft sind.
 *
 * @param Liste mit Objektdefinitionen
 *
 * @return Liste mit Organisationseinheiten
 **********************************************************************************/
function getAssigendOrgUnits(oCurrentObjDef) {

    var oOrgUnitList = new Array();
    var oObjOccList = oCurrentObjDef.OccList();

    for (var i = 0; i < oObjOccList.length; i++) {
        var oCurrOcc = oObjOccList[i];
        var oCxnlist = oCurrOcc.InEdges(Constants.EDGES_ALL);
        for (var j = 0; j < oCxnlist.length; j++) {
            oCurrCxn = oCxnlist[j];
            if (oCurrCxn.SourceObjOcc().ObjDef().TypeNum() == OBJ_ORG) {
                oOrgUnitList.push(oCurrCxn.SourceObjOcc().ObjDef());
            }
        }
    }

    return ArisData.Unique(oOrgUnitList);
}

/********************************************************************************
 *  Ermittelt alle Anwendungssysteme die mit übergebenen Objekten verknüpft sind.
 *
 * @param Liste mit Objektdefinitionen
 * 
 * @return Liste mit Anwendungssystemen
 **********************************************************************************/
function getAssigendSys(oCurrentObjDefs) {

    var oSysList = new Array();

    for (var i = 0; i < oCurrentObjDefs.length; i++) {
        var oTempObjDef = oCurrentObjDefs[i];
        var oObjOccList = oTempObjDef.OccList();
        for (var j = 0; j < oObjOccList.length; j++) {
            var oCurrOcc = oObjOccList[j];
            var oCxnlist = oCurrOcc.InEdges(Constants.EDGES_ALL);
            for (k = 0; k < oCxnlist.length; k++) {
                oCurrCxn = oCxnlist[k];
                if (oCurrCxn.SourceObjOcc().ObjDef().TypeNum() == OBJ_SYS) {
                    oSysList.push(oCurrCxn.SourceObjOcc().ObjDef());
                }
            }
        }
    }

    return ArisData.Unique(oSysList);
}
/********************************************************************************
 *  Liefert eine Zeichenkette die ein Tab representiert zurück.
 *
 * @retrun Tab Zeichenkette
 **********************************************************************************/
function getTab() {
    return "      ";
    //return "\u0009";
}

/********************************************************************************
 *  Liefert die zu Rollen gehörenden Organisationseinheiten.   
 *
 * @param Liste von Rollen Ausprägungen
 *
 * @return Liste von Organisationseinheiten
 **********************************************************************************/
function getTargetObjOccFromRoleOccs(oRoleOccs) {

    var resultObjOccList = new Array();
    for (var i = 0; i < oRoleOccs.length; i++) {
        var oRoleOcc = oRoleOccs[i];
        if (oRoleOcc.Model().TypeNum() == MOD_ORG) {
            var oOutCxns = oRoleOcc.OutEdges(Constants.EDGES_ALL);
            for (j = 0; j < oOutCxns.length; j++) {
                var oOutCxn = oOutCxns[j];
                var oTargetObjOcc = oOutCxn.TargetObjOcc();
                if (oTargetObjOcc.ObjDef().TypeNum() == OBJ_ORG) {
                    resultObjOccList.push(oTargetObjOcc.ObjDef());
                }
            }
        }
    }
    return resultObjOccList;
}

/********************************************************************************
 * Ermittelt alle Organisationseinheiten und Rollen des ausgewählten Modells sowie
 * alle Hinterlegungen in weiteren Modellen.
 *
 * @param Liste von Modellen
 * @param ausgewähltes Modell
 *
 * @return Organisationseinheiten und Rollen als Zeichenkette
 **********************************************************************************/
function getOrgUnitsFromModels(oCurrentModels, oModel) {

    var oOrgUnitList = new Array();
    var returnStringArray = new Array();

    for (var i = 0; i < oCurrentModels.length; i++) {
        var oCurrentModel = oCurrentModels[i];
        var oObjDefList = oModel.ObjDefList();
        for (var j = 0; j < oObjDefList.length; j++) {
            var oObjDef = oObjDefList[j];
            if (oObjDef.TypeNum() == OBJ_ORG) {
                // alle Org Units
                oOrgUnitList.push(oObjDef);
            } else if (oObjDef.TypeNum() == OBJ_ROL) {
                // alle Rollen
                var oRoleOccs = oObjDef.OccList();
                oOrgUnitList = oOrgUnitList.concat(getTargetObjOccFromRoleOccs(oRoleOccs));
            } else if (oObjDef.TypeNum() == OBJ_FUNC) {
                var oAssignedRoles = getAssigendRoles(oObjDef);
                // alle Funktionen nach Hinterlegten Rollen absuchen
                for (var k = 0; k < oAssignedRoles.length; k++) {
                    var oAssignedRole = oAssignedRoles[k];
                    var oRoleOccs = oAssignedRole.OccList();
                    oOrgUnitList = oOrgUnitList.concat(getTargetObjOccFromRoleOccs(oRoleOccs));
                }
                oAssignedRoles = getAssigendOrgUnits(oObjDef);
                for (var l = 0; l < oAssignedRoles.length; l++) {
                    var oAssignedRole = oAssignedRoles[l];
                    var name = oAssignedRole.Name(g_nLoc);
                    oOrgUnitList.push(oAssignedRole);
                }
            }
        }
    }

    oOrgUnitList = ArisData.Unique(oOrgUnitList);
    oOrgUnitList = ArisData.sort(oOrgUnitList, VWAudiConstants.ATT_NAME, g_nLoc);
    var sOrgUnits = "";

    for (var j = 0; j < oOrgUnitList.length; j++) {
        var oObjDef = oOrgUnitList[j];
        returnStringArray.push(oObjDef.Attribute(ATTR_NAME, g_nLoc).GetValue(true));
    }

    return returnStringArray;
}

/********************************************************************************
 *  Führt Formatierungsausfgaben auf einer Zeichenkette mit Rollen aus.
 *
 * @ param Liste von Modellen
 * @ param ausgewähltes Modell
 *
 * @return Rollen als Zeichenkette
 **********************************************************************************/
function getRoles(oModelList, oModel) {
    var sRoles = "";
    var roleStringArray = getOrgUnitsFromModels(oModelList, oModel);
    // andere Modelle
    for (var i = 0; i < oModelList.length; i++) {
        var oTempModel = oModelList[i];
        var sTemp = oTempModel.Attribute(ATTR_VERTEILER, g_nLoc).GetValue(true);
        if (!sTemp.equals("")) {
            var sRoleS = sTemp.split(";");
            roleStringArray = roleStringArray.concat(sRoleS);
        }
    }
    roleStringArray.sort();
    var isWritten = false;
    for (var i = 0; i < roleStringArray.length; i++) {
        var sTemp = roleStringArray[i];
        if (isWritten) sRoles += ", ";
        sRoles += sTemp;
        isWritten = true;
    }
    return sRoles;
}

/*****************************************************************************************************************
 * Ermittelt alle Vorgänger-, Nachfolger-Modelle eines Modells.
 *
 * @param Modell
 * @param Vorgänger-Modelle ermitteln? True liefert alle untergeordnete, false alle übergeordneten Modell
 *
 * @return Vorgänger-, Nachfolger-Modelle
 *****************************************************************************************************************/
function getModels(oModel, isParent) {
    var oObjOccList = oModel.ObjOccListFilter(OBJ_FUNC);
    var sResult = "";
    var oModelResultS = new Array();

    oObjOccList = ArisData.sort(oObjOccList, Constants.SORT_X, Constants.SORT_Y, g_nLoc);

    for (var i = 0; i < oObjOccList.length; i++) {
        var oCurrentObj = oObjOccList[i];
        if (isProcessInterface(oCurrentObj.SymbolNum())) {
            var bHasValidEdge = false;
            if (isParent) {
                bHasValidEdge = oCurrentObj.OutDegree(Constants.EDGES_STRUCTURE) > 0;
            } else {
                bHasValidEdge = oCurrentObj.InDegree(Constants.EDGES_STRUCTURE) > 0;
            }
            // Hat die Prozessschnittstelle keine eingehenden/ausgehenden Kanten
            if (bHasValidEdge) {
                var oAssigendModels = oCurrentObj.ObjDef().AssignedModels();
                if (oAssigendModels.length > 0) {
                    for (var j = 0; j < oAssigendModels.length; j++) {
                        var oAssigendModel = oAssigendModels[j];
                        if (oAssigendModel.TypeNum() == Constants.MT_FUNC_ALLOC_DGM) {
                            var oObjDefList = oAssigendModel.ObjDefListFilter(OBJ_DOC);
                            for (k = 0; k < oObjDefList.length; k++) {
                                oObjDef = oObjDefList[k];
                                if (isAttributeBooleanValue(oObjDef, ATTR_VA)) {
                                    oModelResultS.push((oObjDef.Attribute(ATTR_NAME, g_nLoc).GetValue(true)) + " " + oObjDef.Attribute(ATTR_TITLE1, g_nLoc).GetValue(true));
                                }
                            }
                        } else {
                            //oModelResultS.push(oAssigendModel.Attribute(ATTR_NAME, g_nLoc).GetValue(true)  + " " + oAssigendModel.Attribute(ATTR_NR, g_nLoc).GetValue(true) );
                            oModelResultS.push(oAssigendModel.Attribute(ATTR_NR, g_nLoc).GetValue(true));
                        }
                    }
                } else {
                    //oModelResultS.push((oCurrentObj.ObjDef().Attribute(ATTR_NAME, g_nLoc).GetValue(true)) + " " + oCurrentObj.ObjDef().Attribute(ATTR_NR, g_nLoc).GetValue(true) );
                    oModelResultS.push(oCurrentObj.ObjDef().Attribute(ATTR_NR, g_nLoc).GetValue(true));
                }
            }
        }
    }

    return oModelResultS;
}

/*****************************************************************************************************************
 * Ermittelt alle übergeordneten Modelle eines Modells.
 *
 * @param Modell
 *
 * @return Liste mit übergeordneten Modellen
 *****************************************************************************************************************/
function getParentModels(oModel) {

    var oParentModels = new Array()
    var oSuperObjDefs = oModel.SuperiorObjDefs();

    // Erstellen der Liste mit Ausprägungen des übergeordenten Objektes
    for (var i = 0; i < oSuperObjDefs.length; i++) {
        var oSuperObjDef = oSuperObjDefs[i];
        var oSuperOccs = oSuperObjDef.OccList();
        for (var j = 0; j < oSuperOccs.length; j++) {
            var oSuperOcc = oSuperOccs[j];
            if (!(isProcessInterface(oSuperOcc.SymbolNum()) || isStatus(oSuperOcc.SymbolNum()))) {
                var oCurrentModel = oSuperOcc.Model();
                if (!(oModel.IsEqual(oCurrentModel) || oCurrentModel.TypeNum() == MOD_FAD)) {
                    oParentModels.push(oCurrentModel);
                }
            }
        }
    }

    return ArisData.Unique(oParentModels);
}

/********************************************************************************
 * Ermittelt alle Organisationsheiten und Rollen zu Modellen.
 *
 * @param Liste mit Modellen
 *
 * @return Rollen und Organisationseinheiten als Zeichenkette
 **********************************************************************************/
function getOrgUnitsAndRolesFromModelsAsString(oModelList) {

    var sResult = "";
    var oRoleList = new Array();

    for (var i = 0; i < oModelList.length; i++) {
        var oModel = oModelList[i];

        var oObjDefList = oModel.ObjDefList();
        // alle Rollen zusammensuchen
        for (j = 0; j < oObjDefList.length; j++) {
            var oObjDef = oObjDefList[j];
            if (ROLE_FILTER.indexOf(oObjDef.Name(g_nLoc).trim()) < 0) {
                // Rollenname ist nicht in Filter enthalten
                if (oObjDef.TypeNum() == OBJ_ROL) {
                    oRoleList.push(oObjDef);
                } else if (oObjDef.TypeNum() == OBJ_FUNC) {
                    var oRoles = getAssigendRoles(oObjDef);
                    for (var k = 0; k < oRoles.length; k++) {
                        var oRole = oRoles[k];
                        if (ROLE_FILTER.indexOf(oRole.Name(g_nLoc).trim()) < 0) {
                            // Rollenname ist nicht in Filter enthalten
                            oRoleList.push(oRole);
                        }
                    }
                }
            }
        }
    }
    oRoleList = ArisData.Unique(oRoleList);
    oRoleList = ArisData.sort(oRoleList, VWAudiConstants.ATT_NAME, g_nLoc);

    // Rolle zu Rolle, Rolle zu OE
    for (var j = 0; j < oRoleList.length; j++) {
        var oObjDef = oRoleList[j];
        // suche auch alle Rollen in ausfuehrenden Rollen zusammen
        if (sResult.equals("")) {
            sResult = roleToRole(oObjDef);
        } else {
            var sTemp = roleToRole(oObjDef);
            if (!sTemp.equals(""))
                sResult += "\n" + sTemp;
        }
    }

    return sResult;
}

/********************************************************************************
 * Startmethode des Reports
 **********************************************************************************/
function main() {
    var oSelectedModels = ArisData.getSelectedModels();

    if (oSelectedModels.length > 1) {
        if (DIALOG_MODE) {
            Dialogs.MsgBox(getString("ERROR_MSG_ONLY_ONE_MODEL"));
        }
        return;
    }
    var oModel = oSelectedModels[0];

    var sModelIdentifier = oModel.Attribute(VWAudiConstants.ATT_ID, g_nLoc).getValue() + "";
    if (!sModelIdentifier.equals("")) {
        var file = Context.getSelectedFile();
        var filetype = ".";
        if (file.indexOf(".") >= 0) {
            filetype = file.substring(file.indexOf("."), file.length());
        }
        var sFileName = sModelIdentifier;
        if (!containsIllegalChars(sFileName + "")) {
            sFileName = ensureFileName(sFileName);
            Context.setSelectedFile((sFileName + filetype));
        } else {
            if (DIALOG_MODE) {
                Dialogs.MsgBox(getString("ERROR_MSG_ILLEGALCHAR"));
            }
            return;
        }
    }

    var bAddAssigned = false;
    var bSeparateModelGraphic = false;
    if (DIALOG_MODE) {
        var oOptionDialog = new OptionDialog();
        var oDialogResult = Dialogs.showDialog(oOptionDialog, Constants.DIALOG_TYPE_ACTION, getString("DLG_OPTION_TITLE", g_sLoc));
        if (oDialogResult.resultOK == false) {
            return;
        }
        bAddAssigned = oDialogResult.bIncludeAssignedModels;
        bSeparateModelGraphic = oDialogResult.bSeparateModelGraphic;

        /*
        if ( Dialogs.MsgBox(getString("DLG_MESSAGE_ADD_ASSIGNED"), Constants.MSGBOX_BTN_YESNO, "") == Constants.MSGBOX_RESULT_YES) {
            bAddAssigned = true;
        }
        */
    }

    g_Outfile = Context.createOutputObject(Context.getSelectedFormat(), Context.getSelectedFile());
    g_Outfile.Init(g_nLoc);
    g_OutfileWrapper = new OutfileWrapper();
    g_OutfileWrapper.init(g_Outfile);

    gZoom = (GFX_SIZE == -10) ? oModel.getPrintScale() : GFX_SIZE;

    var oModelInfo = new ModelInfo(oModel);

    var oSuperObjDef = oModel.SuperiorObjDefs();
    var oFuncOccList = oModel.ObjOccListFilter(Constants.OT_FUNC);
    for each(var oFuncOcc in oFuncOccList) {
        if (!(isProcessInterface(oFuncOcc.SymbolNum()) || isStatus(oFuncOcc.SymbolNum()))) {
            oSuperObjDef.push(oFuncOcc.ObjDef());
        }
    }
    oSuperObjDef = ArisData.Unique(oSuperObjDef);

    var oNonAssignedModels = new Array();
    if (bAddAssigned)
        oNonAssignedModels = getNonAssignedModels(oFuncOccList);

    var allModels = [oModel];
    for (var j = 0; j < oNonAssignedModels.length; j++) {
        allModels.push(oNonAssignedModels[j]);
    }

    // Erzeugen der Formatvorlage
    createOutputTemplate(g_Outfile);
    // Setzen der Dokumenten Parameter
    setOutputParameter(g_Outfile);
    // Kopf- und Fusszeile erzeugen
    g_Outfile.BeginSection(false, Constants.SECTION_COVER)
    createHeaderAndFooter_CoverPage(g_Outfile, oModel); //Header for CoverPage
    // Dokumenten Intro erzeugen
    //createFurtherOrgInformations(g_Outfile, oModel, allModels);


    var nChapter = 1;
    // Übersicht Prozesszweck erstelle    
    createProcessPurpose(g_Outfile, oModelInfo, nChapter++);

    // Übersicht über Processsziel, Kritischer Erfolgsfaktor, Kennzahl und Sollwert  erstellen 
    createProcessGoals(g_Outfile, oModelInfo, oModel, nChapter++);
    // Übersicht Zuständigkeiten / Schnittstellenvereinbarung erzeugen
    //  createRoles(g_Outfile, oModel, allModels, nChapter++);
    // Prozessübersicht erstellen
    createProcessDependenciesOverview(g_Outfile, oModelInfo, nChapter++);

    g_Outfile.EndSection(); // End of ConverPage
    g_Outfile.BeginSection(false, Constants.SECTION_DEFAULT)
    createHeaderAndFooter(g_Outfile, oModel);

    // Übersicht Regelungen erzeugen
    var oModelDefList = oModel.ObjDefList();
    var oDocs = createProvisions(g_Outfile, oModel, oModelDefList, oSuperObjDef, oNonAssignedModels, bAddAssigned, nChapter++);
    // Übersicht Geltungsbereich erzeugen
    // createAmbit(g_Outfile, oModel);
    // Übersicht Begriffsbestimmungen erzeugen
    createDefinition(g_Outfile, oModel, nChapter++);
    // Übersicht Weiterführende Dokumentation erstellen
    createDocumentation(g_Outfile, oModel, oDocs, nChapter++);
    // Übersicht IT-Systeme erzeugen
    createITSystemOverview(g_Outfile, oModelDefList, oSuperObjDef, oNonAssignedModels, bAddAssigned, nChapter++);
    // Übersicht Änderungsdienst, Erstellerteam, Geltungsbereich
    createChangeOverview(g_Outfile, oModel, nChapter++);
    // Übersicht Verteiler (OE)
    createDistributionOverview(g_Outfile, oModel, nChapter++);

    // Modell-Grafiken erzeugen
    var sGraphicPath = Context.getSelectedPath();
    createModelGraphics(g_Outfile, oModel, oNonAssignedModels, bAddAssigned, bSeparateModelGraphic, sGraphicPath);
    g_Outfile.EndSection();
    if (DIALOG_MODE) {
        var sTitle = getString("MESSAGE_GRAPHICFILES_TITLE");
        var sText = getString("MESSAGE_GRAPHICFILES_INFO") + "\n" + sGraphicPath;
        Dialogs.MsgBox(sText, Constants.MSGBOX_ICON_INFORMATION, sTitle);
    }

    // Dokument erzeugen
    g_Outfile.WriteReport();
}

function ModelInfo(oModel) {
    this.oModel = oModel;

    this.oIncomingInterfaceFuncDefList = new Array();
    this.oOutgoingInterfaceFuncDefList = new Array();
    this.oControlingProcessFuncDefList = new Array();
    this.oSupportingProcessFuncDefList = new Array();
    this.oStatusFuncDefList = new Array();
    this.oRegularFuncDefList = new Array();
    this.oSuperObjDef = new Array();

    this.init = function() {
        var oFuncOccList = this.oModel.ObjOccListFilter(Constants.OT_FUNC);

        for each(var oFuncOcc in oFuncOccList) {
            var nSym = oFuncOcc.SymbolNum();
            if (nSym == STAUDI_PROCESS_INTERFACE2 || nSym == STAUDI_PROCESS_INTERFACE) {
                // Process interface
                var bIncomingInterface = oFuncOcc.OutDegree(Constants.EDGES_STRUCTURE) > 0;
                if (bIncomingInterface) {
                    this.oIncomingInterfaceFuncDefList.push(oFuncOcc.ObjDef());
                }
                var bOutgoingInterface = oFuncOcc.InDegree(Constants.EDGES_STRUCTURE) > 0;
                if (bOutgoingInterface) {
                    this.oOutgoingInterfaceFuncDefList.push(oFuncOcc.ObjDef());
                }

            } else if (nSym == STAUDI_CONTROL_PROCESS || nSym == STAUDI_CONTROL_PROCESS_WKD) {
                // Steuerungsprozesse
                this.oControlingProcessFuncDefList.push(oFuncOcc.ObjDef());

            } else if (nSym == STAUDI_SUPPORT_PROCESS || nSym == STAUDI_SUPPORT_PROCESS_WKD) {
                // Unterstützungsprozesse
                this.oSupportingProcessFuncDefList.push(oFuncOcc.ObjDef());

            } else if (nSym == STAUDI_STATUS_OBJECT) {
                // Status Objekt
                this.oStatusFuncDefList.push(oFuncOcc.ObjDef());

            } else {
                this.oRegularFuncDefList.push(oFuncOcc.ObjDef());

            }
        }
        this.oSuperObjDef = this.oModel.SuperiorObjDefs();

        this.oIncomingInterfaceFuncDefList = this.getUniqueAndSorted(this.oIncomingInterfaceFuncDefList);
        this.oOutgoingInterfaceFuncDefList = this.getUniqueAndSorted(this.oOutgoingInterfaceFuncDefList);
        this.oControlingProcessFuncDefList = this.getUniqueAndSorted(this.oControlingProcessFuncDefList);
        this.oSupportingProcessFuncDefList = this.getUniqueAndSorted(this.oSupportingProcessFuncDefList);
        this.oStatusFuncDefList = this.getUniqueAndSorted(this.oStatusFuncDefList);
        this.oRegularFuncDefList = this.getUniqueAndSorted(this.oRegularFuncDefList);
    }

    this.getUniqueAndSorted = function(oItemList) {
        oItemList = ArisData.Unique(oItemList);
        oItemList = ArisData.sort(oItemList, 1, g_nLoc);
        return oItemList;
    }

    this.init();
}

function ensureFileName(sName) {
    // remove line breaks
    sName = sName.replace(/\n\r/g, " ");
    sName = sName.replace(/\r\n/g, " ");
    sName = sName.replace(/\r/g, " ");
    sName = sName.replace(/\n/g, " ");

    // trim
    while ((sName.length > 0) && (sName.substr(0, 1) == " ")) {
        sName = sName.substr(1, sName.length - 1);
    }

    // remove spaces
    sName = sName.replace(/ /g, "_");

    // remove German Umlauts
    sName = sName.replace(/ä/g, "ae");
    sName = sName.replace(/ö/g, "oe");
    sName = sName.replace(/ü/g, "ue");
    sName = sName.replace(/Ä/g, "Ae");
    sName = sName.replace(/Ö/g, "Oe");
    sName = sName.replace(/Ü/g, "Ue");

    // remove slashes
    sName = sName.replace(/\//g, "_");
    sName = sName.replace(/\\/g, "_");

    return sName;
}

function containsIllegalChars(sTextToCheck) {
    if (sTextToCheck.indexOf("\"") > -1)
        return true;
    if (sTextToCheck.indexOf("/") > -1)
        return true;
    if (sTextToCheck.indexOf("\\") > -1)
        return true;
    if (sTextToCheck.indexOf("?") > -1)
        return true;
    if (sTextToCheck.indexOf(":") > -1)
        return true;
    if (sTextToCheck.indexOf("|") > -1)
        return true;
    if (sTextToCheck.indexOf("*") > -1)
        return true;
    if (sTextToCheck.indexOf("<") > -1)
        return true;
    if (sTextToCheck.indexOf(">") > -1)
        return true;
    return false;
}

/********************************************************************************
 * Formatiert die Werte aus dem Attribut Begriffe/Abkürzungen und liefert diese 
 * als Liste zurück.
 *
 * @param Begriffe/Abkürzungen als Zeichenkette
 *
 * @return Liste mit Begriffe/-Objekten
 **********************************************************************************/
function readBegriffe(sValue) {

    var oResultList = new Array();
    var lIndex = 0;
    var lListIndex = 0;

    if (sValue.length == 0) {
        return oResultList;
    }

    while (lIndex < sValue.length()) {
        var lStartItem = sValue.substring(lIndex, sValue.length()).indexOf("<");
        var lEndItem = 0;
        if (lStartItem >= 0) {
            oResultList[lListIndex] = new Object();
            var sItem = "";
            lStartItem += lIndex;
            lEndItem = sValue.substring(lIndex, sValue.length()).indexOf(">") + lIndex;
            if (lEndItem > 0) {
                sItem = sValue.substring(lStartItem + 1, lEndItem);
                lIndex = lEndItem;
            } else {
                sItem = sValue.substring(lStartItem + 1, sValue.length());
                lIndex = sValue.length();
            }

            var lStartDesc = lEndItem + 1;
            var lEndDesc = sValue.substring(lIndex, sValue.length()).indexOf("<") + lIndex;
            var sDesc = "";
            if (lEndDesc - lIndex >= 0) {
                sDesc = sValue.substring(lStartDesc, lEndDesc);
                lIndex = lEndDesc;
            } else {
                sDesc = sValue.substring(lStartDesc, sValue.length());
                lIndex = sValue.length();
            }

            while (sDesc.substr(0, 2).equals("\r\n")) {
                sDesc = sDesc.substring(2, sDesc.length());
                sDesc = sDesc.trim();
            }

            while (sDesc.substr(sDesc.length() - 2, 2).equals("\r\n")) {
                sDesc = sDesc.substring(0, sDesc.length() - 2);
                sDesc = sDesc.trim();
            }

            oResultList[lListIndex]["Item"] = sItem;
            oResultList[lListIndex]["Desc"] = sDesc;
            lListIndex += 1;
        } else {
            oResultList[0] = new Object();
            oResultList[lListIndex]["Item"] = "";
            oResultList[lListIndex]["Desc"] = sValue;
            lIndex = sValue.length();
        }
    }
    return oResultList;
}

/********************************************************************************
 *  Formatiert die Werte aus dem Attribut Änderungshistorie und liefert diese Liste zurück.
 *
 * @param Änderungshistorie als Zeichenkette
 *
 * @return Liste mit Historie-Objekten
 **********************************************************************************/
function readHistoryEntry(sHistory) {

    var oReturn = new Array();
    var iEntries = 0;
    var sTempHistory = sHistory;
    var iTempLength = sTempHistory.length();

    while (iTempLength > 0) {
        var lTime = (sTempHistory.substring(0, sTempHistory.length())).indexOf(":");
        if (lTime > 0) {
            if (checkDate(sTempHistory.substr((lTime - 14), 17))) {

                var sVersion = sTempHistory.substr(0, 5) + " " + getString("TXT_DATE_FROM", g_sLoc) + " " + sTempHistory.substr((lTime - 13), 10);

                var lIndexStart = sTempHistory.indexOf("\r\n") + 2;
                var lIndexEnd = sTempHistory.indexOf("\r\n\r\n");
                var sComment = "";
                if (lIndexEnd > 0) {
                    sComment = sTempHistory.substring(lIndexStart, lIndexEnd);
                    sTempHistory = sTempHistory.substring(lIndexEnd + 4, sTempHistory.length());
                    iTempLength = sTempHistory.length();
                } else {
                    sComment = sTempHistory.substring(lIndexStart, sTempHistory.length());
                    iTempLength = 0;
                }

                oReturn[iEntries] = new Object();
                oReturn[iEntries][0] = sVersion;
                oReturn[iEntries][1] = sComment;

                iEntries += 1;
            } else {
                iTempLength = 0;
            }
        } else {
            iTempLength = 0;
        }
    }
    return oReturn;
}


/********************************************************************************
 * Sammelt die Rolle zu Rolle und Rolle zu OE Beziehungen zur uebergebenen Rolle.
 * 
 * @param Rolle
 *
 * @return alle gefunden Rollen
 **********************************************************************************/

function roleToRole(oRole) {
    var sResult = "";

    if (!g_VistitedModels.contains(oRole.GUID())) {
        // noch nicht bearbeitet
        g_VistitedModels.add(oRole.GUID());

        var oNewRoles = new Array();
        var oRoleOccs = oRole.OccList();
        var oExecutiveRoles = new Array();
        var sExecutive = "";
        for (var i = 0; i < oRoleOccs.length; i++) {
            var oObjOcc = oRoleOccs[i];
            var oTempRoles = new Array();
            // lokale ueberpruefung auf doppelte Rollen / OEs
            if (oObjOcc.Model().TypeNum() == MOD_ORG) {
                var oCxnIn = oObjOcc.OutEdges(Constants.EDGES_ALL);
                for (var j = 0; j < oCxnIn.length; j++) {
                    var oCxn = oCxnIn[j];
                    var oTargetOcc = oCxn.TargetObjOcc();
                    if (oTargetOcc.ObjDef().TypeNum() == OBJ_ROL && ROLE_FILTER.indexOf(oTargetOcc.ObjDef().Name(g_nLoc)) < 0 && oTempRoles.join(" ").indexOf(oTargetOcc.ObjDef().GUID()) < 0) {
                        oTempRoles.push(oTargetOcc.ObjDef().GUID());
                        //sExecutive += oTargetOcc.ObjDef().Attribute(ATTR_NAME, g_nLoc).GetValue(true) + ", ";
                        oNewRoles.push(oTargetOcc.ObjDef());
                        oExecutiveRoles.push(oTargetOcc.ObjDef());
                    }
                }
            }
        }

        oExecutiveRoles = ArisData.sort(oExecutiveRoles, VWAudiConstants.ATT_NAME, g_nLoc);
        for (var i = 0; i < oExecutiveRoles.length; i++) {
            var oObjDef = oExecutiveRoles[i];
            sExecutive += oObjDef.Attribute(ATTR_NAME, g_nLoc).GetValue(true) + ", ";
        }

        if (sExecutive.substring(sExecutive.length - 2, sExecutive.length).equals(", ")) {
            sExecutive = sExecutive.substring(0, sExecutive.length - 2);
        }

        if (!sExecutive.equals("")) {
            sResult = "- " + getString("TXT_ROLE_HINT_PART1", g_sLoc) + " " + oRole.Attribute(ATTR_NAME, g_nLoc).GetValue(true) + " " + getString("TXT_ROLE_HINT_PART2", g_sLoc) + " " + sExecutive;
        }

        // Rollen zu OEs
        var oExecutiveRoles = new Array();
        sExecutive = "";
        for (var i = 0; i < oRoleOccs.length; i++) {
            var oObjOcc = oRoleOccs[i];
            if (oObjOcc.Model().TypeNum() == MOD_ORG) {
                var oCxnIn = oObjOcc.OutEdges(Constants.EDGES_ALL);
                for (var j = 0; j < oCxnIn.length; j++) {
                    var oCxn = oCxnIn[j];
                    var oTempRoles = new Array();
                    // lokale ueberpruefung auf doppelte Rollen / OEs
                    var oTargetOcc = oCxn.TargetObjOcc();
                    if (oTargetOcc.ObjDef().TypeNum() == OBJ_ORG && ROLE_FILTER.indexOf(oTargetOcc.ObjDef().Name(g_nLoc)) < 0 && oTempRoles.join(" ").indexOf(oTargetOcc.ObjDef().GUID()) < 0) {
                        oTempRoles.push(oTargetOcc.ObjDef().GUID());
                        oExecutiveRoles.push(oTargetOcc.ObjDef());
                        //sExecutive += oTargetOcc.ObjDef().Attribute(ATTR_NAME, g_nLoc).getValue() + ", ";
                    }
                }
            }
        }

        oExecutiveRoles = ArisData.sort(oExecutiveRoles, VWAudiConstants.ATT_NAME, g_nLoc);
        for (var i = 0; i < oExecutiveRoles.length; i++) {
            var oObjDef = oExecutiveRoles[i];
            sExecutive += oObjDef.Attribute(ATTR_NAME, g_nLoc).GetValue(true) + ", ";
        }

        if (sExecutive.substring(sExecutive.length - 2, sExecutive.length).equals(", ")) {
            sExecutive = sExecutive.substring(0, sExecutive.length - 2);
        }

        if (!sExecutive.equals("")) {
            (!sResult.equals(""))
            sResult += "\n";
            sResult += "- " + getString("TXT_ROLE_HINT_PART1", g_sLoc) + " " + oRole.Attribute(ATTR_NAME, g_nLoc).GetValue(true) + " " + getString("TXT_ROLE_HINT_PART3", g_sLoc) + " " + sExecutive;
        }


        // alle gefundenen Rollen, weiter betrachten
        oNewRoles = ArisData.Unique(oNewRoles);
        oNewRoles = ArisData.sort(oNewRoles, VWAudiConstants.ATT_NAME, g_nLoc)
        var sTempResult = "";
        for (var i = 0; i < oNewRoles.length; i++) {
            oNewRole = oNewRoles[i];
            var sTemp = roleToRole(oNewRole);
            if (!sTemp.equals("")) {
                sTempResult += "\n" + sTemp;
            }
        }
        sResult += sTempResult;
    }
    return sResult;
}

/********************************************************************************
 * Setzt Layout-Parameter für die Ausgabe.
 *
 * @param Ausgabedatei
 **********************************************************************************/
function setOutputParameter(g_Outfile) {

    g_Outfile.SetPageWidth(210);
    g_Outfile.SetPageHeight(297);
    g_Outfile.SetLeftMargin(25);
    g_Outfile.SetRightMargin(15);
    if (Context.getSelectedFormat() == Constants.OUTPDF) {
        g_Outfile.SetTopMargin(45);
        g_Outfile.SetBottomMargin(40);
    }
    g_Outfile.SetDistHeader(5);
    g_Outfile.SetDistFooter(5);
}

/********************************************************************************
* Spaltet eine Zeichenkette anhand des übergebenen Trenners in Teile auf.
* 
* @param aufzuspaltende Zeichenkette
* @param Trenner

* @return aufgespaltene Zeichenketten
**********************************************************************************/
function splitTextLine(sText, sDelimiter) {
    var resultArray = sText.split(sDelimiter);
    return resultArray;
}

// Beginn Ausführung Report 
try {
    //Aufruf der Main-Methode
    main();
} catch (e) {
    var sMessage = "Error";
    if (e instanceof String || e instanceof java.lang.String) {
        if (DIALOG_MODE) {
            Dialogs.MsgBox(e);
        }
    } else if (e.name.equals("__EndScriptException")) {
        // Nothing to do
    } else {
        if (e.lineNumber)
            sMessage = sMessage + ", line " + e.lineNumber;
        sMessage = sMessage + ": ";
        if (e.toString)
            sMessage = sMessage + e.toString();
        else sMessage = sMessage + e;

        if (DIALOG_MODE) {
            Dialogs.MsgBox(sMessage);
        }
    }
}

function OutfileWrapper() {
    this.oOutfile = null;

    this.init = function(oOutfile) {
        this.oOutfile = oOutfile;
    }

    this.writeSectionTitle = function(sTitle) {
        this.oOutfile.OutputLnF(sTitle, getString("WORD_TEMPLATE_FORMATTING_8"));
    }

    this.writeListItem = function(sText, sHintText) {
        if (sHintText.equals("")) {
            this.oOutfile.OutputLn("- " + sText, "Arial", 12, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_LEFT, 7);
        } else {
            this.oOutfile.Output("- " + sText, "Arial", 12, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_LEFT, 7);
            this.oOutfile.OutputLn(sHintText, "Arial", 12, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_LEFT | Constants.FMT_ITALIC, 7);
        }
    }

    this.writeProcessGoal_BeginTable = function() {
        this.oOutfile.BeginTable(100, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_LEFT, 0);
        this.oOutfile.TableRow();
        this.oOutfile.TableCellF(getString("TXT_PROCESS_GOAL", g_sLoc), SPACING_3 + SPACING_4, getString("WORD_TEMPLATE_FORMATTING_4"));
        this.oOutfile.TableCellF(getString("TXT_BUSINESS_RATIO", g_sLoc), SPACING_1 + SPACING_2, getString("WORD_TEMPLATE_FORMATTING_4"));
        this.oOutfile.TableCellF(getString("TXT_DESIRED_VALUE", g_sLoc), SPACING_5, getString("WORD_TEMPLATE_FORMATTING_4"));
    }

    this.writeProcessGoal_Row = function(sCell1, sCell2, sCell3) {
        this.oOutfile.TableRow();
        this.oOutfile.TableCellF(sCell1, SPACING_3 + SPACING_4, getString("WORD_TEMPLATE_FORMATTING_1"));
        this.oOutfile.TableCellF(sCell2, SPACING_1 + SPACING_2, getString("WORD_TEMPLATE_FORMATTING_1"));
        this.oOutfile.TableCellF(sCell3, SPACING_5, getString("WORD_TEMPLATE_FORMATTING_1"));
    }

    this.EndTable = function() {
        this.oOutfile.EndTable("", 100, "Audi Type", 8, Constants.C_TRANSPARENT, Constants.C_TRANSPARENT, 0, Constants.FMT_LEFT | Constants.FMT_VTOP, 0);
    }
}

function DialogResult() {
    this.resultOK = false;
    this.bIncludeAssignedModels = false;
    this.bSeparateModelGraphic = false;
}

function OptionDialog() {
    this.oDialogResult = new DialogResult();

    //all member functions except for getPages can access the property "dialog" of the dialog class. Type is "UserDialog" (see help).
    //example: this.dialog.getPage(0)

    // returns DialogTemplate[] (see help) or the dialog XML ID
    // non-optional
    this.getPages = function() {
        var iDialogTemplate1 = Dialogs.createNewDialogTemplate(250, 100, "First page");
        var nOffsetX = 20;
        var nOffsetY = 20;

        iDialogTemplate1.CheckBox(nOffsetX, nOffsetY, 400, 20, getString("DLG_OPTION_ASSIGNED_MODELS", g_sLoc), "CHECK_INCLUDEASSIGNED");
        iDialogTemplate1.CheckBox(nOffsetX, nOffsetY + 30, 400, 20, getString("DLG_OPTION_SEPARATE_GRPAHIC", g_sLoc), "CHECK_SEPARATEGRAPHIC");

        return [iDialogTemplate1];
    }

    //initialize dialog pages (are already created and pre-initialized with static data from XML or template)
    //parameter: Array of DialogPage
    //see Help: DialogPage
    //user can set control values
    //optional
    this.init = function(aPages) {
        //use this function also to store the page data locally (for example to access it in "onClose")
        var oDialogElement = aPages[0].getDialogElement("CHECK_INCLUDEASSIGNED");
        oDialogElement.setChecked(false);

        oDialogElement = aPages[0].getDialogElement("CHECK_SEPARATEGRAPHIC");
        oDialogElement.setChecked(false);
    }

    // returns true if the page is in a valid state. In this case OK, Finish, or Next is enabled.
    // called each time a dialog value is changed by the user (button pressed, list selection, text field value, table entry, radio button,...)
    // pageNumber: the current page number, 0-based
    this.isInValidState = function(pageNumber) {
        return true;
    }

    // returns true if the "Finish" or "Ok" button should be visible on this page.
    // pageNumber: the current page number, 0-based
    // optional. if not present: always true
    this.canFinish = function(pageNumber) {
        return true;
    }

    // returns true if the user can switch to another page.
    // pageNumber: the current page number, 0-based
    // optional. if not present: always true
    this.canChangePage = function(pageNumber) {
        return true;
    }

    //called after ok/finish has been pressed and the current state data has been applied
    //can be used to update your data
    // pageNumber: the current page number
    // bOK: true=Ok/finish, false=cancel pressed
    //optional
    this.onClose = function(pageNumber, bOk) {
        this.oDialogResult.resultOK = bOk;
    }

    //the result of this function is returned as result of Dialogs.showDialog(). Can be any object.
    //optional
    this.getResult = function() {
        var oDialogElement = this.dialog.getPage(0).getDialogElement("CHECK_INCLUDEASSIGNED");
        this.oDialogResult.bIncludeAssignedModels = oDialogElement.isChecked();

        oDialogElement = this.dialog.getPage(0).getDialogElement("CHECK_SEPARATEGRAPHIC");
        this.oDialogResult.bSeparateModelGraphic = oDialogElement.isChecked();

        return this.oDialogResult;
    }

    //other methods (all optional): on[ControlID]_pressed, _focusChanged(boolean lost=false, gained=true), _changed for edit and toggle buttons, _selChanged(int[] newSelection)
}

function PDFGraphic() {
    this.oOutput = null;
    this.sHeaderName = ""

    this.init = function(sFileName, sHeaderName) {

        Context.setProperty("use-new-output", false);
        this.oOutput = Context.createOutputObject(Constants.OUTPDF, sFileName);

        this.oOutput.DefineF("Standard", "Arial", 11, this.RGB(0, 0, 0), Constants.C_TRANSPARENT, Constants.FMT_LEFT | Constants.FMT_VTOP, 0, 0, 0, 0, 0, 1)

        this.oOutput.SetPageWidth(841.5);
        this.oOutput.SetPageHeight(594.4);
        this.oOutput.SetLeftMargin(30);
        this.oOutput.SetRightMargin(30);
        this.oOutput.SetTopMargin(20);
        this.oOutput.SetBottomMargin(20);
        this.oOutput.SetDistHeader(10);
        this.oOutput.SetDistFooter(10);
        this.oOutput.SetAutoTOCNumbering(true);

        this.sHeaderName = sHeaderName;
        this.setFooter();
    }

    this.setHeader = function() {
        this.oOutput.BeginHeader();
        this.oOutput.BeginParagraphF("Standard");
        this.oOutput.OutputLn(this.sHeaderName, "Arial", 11, this.RGB(0, 0, 0), Constants.C_TRANSPARENT, Constants.FMT_LEFT, 0);
        this.oOutput.EndParagraph();
        this.oOutput.EndHeader();
    }

    this.setFooter = function() {
        this.oOutput.BeginFooter();
        this.oOutput.EndFooter();
    }

    this.generateContent = function(oModel, nLoc) {
        var picture = oModel.Graphic(false, false, nLoc);
        var nGWidth = picture.getWidth(Constants.SIZE_LOMETRIC) / 10;
        var nGHeight = picture.getHeight(Constants.SIZE_LOMETRIC) / 10;

        // define a minimum size (for very small models) of 5cm x 5cm
        nGWidth = Math.max(50, nGWidth);
        nGHeight = Math.max(50, nGHeight);

        // AGA-13846 Otherwise to high memory usage up to 6GB
        // define a maximum size (for very small models) of 3m x 3m 
        var widthCorrection = this.oOutput.GetLeftMargin() + this.oOutput.GetRightMargin();
        var heightCorrection = this.oOutput.GetTopMargin() + this.oOutput.GetBottomMargin() + this.oOutput.GetDistFooter() + this.oOutput.GetDistHeader();
        nGWidth = Math.min(841.5 - widthCorrection, nGWidth); // A1 corrections
        nGHeight = Math.min(594.4 - heightCorrection, nGHeight); // A1 corrections

        var sectionHeight = nGHeight + this.oOutput.GetTopMargin() + this.oOutput.GetBottomMargin() + 5;
        var sectionWidth = nGWidth + this.oOutput.GetLeftMargin() + this.oOutput.GetRightMargin();
        sectionHeight = Math.max(594.4, sectionHeight); // A1 corrections
        sectionWidth = Math.max(841.5, sectionWidth); // A1 corrections
        this.oOutput.BeginSection(sectionHeight, sectionWidth, this.oOutput.GetDistHeader(), this.oOutput.GetDistFooter(), this.oOutput.GetLeftMargin(), this.oOutput.GetLeftMargin(), this.oOutput.GetTopMargin(), this.oOutput.GetBottomMargin(), false, Constants.SECTION_DEFAULT);
        this.setHeader();
        this.oOutput.OutGraphic(picture, -1, nGWidth, nGHeight);
        this.oOutput.EndSection();
    }

    this.closeDocument = function() {
        this.oOutput.WriteReport();
    }

    this.RGB = function(r, g, b) {
        return (new java.awt.Color(r / 255.0, g / 255.0, b / 255.0, 1)).getRGB() & 0xFFFFFF;

    }
}