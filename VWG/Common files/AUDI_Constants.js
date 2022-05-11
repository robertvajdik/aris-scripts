/**
 * ARIS 9.8 Module "AUDI_Constants.js"
 * @author: IDS Scheer Consulting GmbH
 * @version 1.0.0 ()
 * @version 2.0.0 (2012-12-11| Manuel Peipe)
 *   - catch exceptions, if attributes do not exist in configuration
 * @version 2.1.0 (2013-05-06| Manuel Peipe)
 *   - Erweiterung CRs GQ: Neue Attribute ATT_PROC_CREATOR, ATT_PROC_CREATOR_MAIL, ATT_RECOMMENDATION
 *   - Erweiterung CRs GQ: definition of value for attr Status
 * @version 2.2.0 (2015-09-18| Zdeněk Kocourek IDS Advisory)
 *   - update ARIS method (symbols, attributes... R2) constants releted for new conventions (valid since 1.11.2015)
  * @version 2.3.0 (2015-10-16| Zdeněk Kocourek IDS Advisory)
 *   - update ARIS method (symbols, attributes... R2 + Symbols bar reviewed) constants releted for new conventions (valid since 1.11.2015)
*/

VWAudiConstants = new function(){
    var fMethod = ArisData.ActiveFilter();
    
    this.fMethod = ArisData.ActiveFilter();
    this.checkUserDefinedAttributeValueTypeNum = function(nAttrTypeNum, sAttrValGuid) {
        nRet = -1;
        try {
            nRet = this.fMethod.UserDefinedAttributeValueTypeNum(this.fMethod.UserDefinedAttributeTypeGUID(nAttrTypeNum), sAttrValGuid);
        } catch(ex) {}
        return nRet;
    }
    
    
    //Fehlende Attribute (müssen noch angelegt werden) Stand 17.02.2014
    this.ATT_KENNUNG    = Constants.AT_ID; //Prozesskennung
    this.ATT_MODELLIERER_OE = fMethod.UserDefinedAttributeTypeNum("308e1c50-825e-11de-7e09-001a6b3c78e6");    //Modellierer (OE) 
    this.ATT_DATUM_PRUEFUNG = -1    //Datum der Prüfung
    this.ATT_PRUEFER = -1    //Prüfer
    this.ATT_STATUS_PRUEFUNG = -1 //Status der Prüfung
    this.ATT_QM_BEAUFTRAGTER = fMethod.UserDefinedAttributeTypeNum("1b11c660-825e-11de-7e09-001a6b3c78e6"); //Qualitätsbeauftragter / QM-Berater
    this.ATT_FACHL_ANSPRECH = fMethod.UserDefinedAttributeTypeNum("06f50810-c77c-11e2-1e28-0017a4771c06"); //fachlicher Ansprechpartner
    
    // attribute constants
    this.ATT_AUTHOR         = fMethod.UserDefinedAttributeTypeNum("ca55c1f0-8261-11de-7e09-001a6b3c78e6"); // Verfasser [AT_AUTH]
    this.ATT_CONSULTINGSTATUS = fMethod.UserDefinedAttributeTypeNum("ced97a70-10ad-11df-7ad6-000c296ae13f"); // Beratungsstatus [AT_UA_VAL_139]
    this.ATT_CONTACT_PERS   = fMethod.UserDefinedAttributeTypeNum("f4f83fe0-8253-11de-7e09-001a6b3c78e6"); // Contact Person
    this.ATT_CXN_TYPE       = fMethod.UserDefinedAttributeTypeNum("66c74fb0-8256-11de-7e09-001a6b3c78e6"); // Kantentyp
    this.ATT_LEVEL          = fMethod.UserDefinedAttributeTypeNum("f3c83970-8255-11de-7e09-001a6b3c78e6"); // Ebene 
    this.ATT_LINK_SLA       = fMethod.UserDefinedAttributeTypeNum("c6104be0-8268-11de-7e09-001a6b3c78e6"); // Link zum SLA-Tool [AT_UA_TXT_132]
    this.ATT_MANAGER        = fMethod.UserDefinedAttributeTypeNum("dc4d37e0-8256-11de-7e09-001a6b3c78e6"); // Leiter
    this.ATT_MINISYM_1      = fMethod.UserDefinedAttributeTypeNum("dd92d640-8261-11de-7e09-001a6b3c78e6"); // Minisymbole Gruppe 1
    this.ATT_MINISYM_2      = fMethod.UserDefinedAttributeTypeNum("e8bad310-8261-11de-7e09-001a6b3c78e6"); // Minisymbole Gruppe 2
    this.ATT_MODEL_OE_SHORT = fMethod.UserDefinedAttributeTypeNum("cd874fa0-825d-11de-7e09-001a6b3c78e6"); // Modell OE Kurzzeichen (Steuerung AKV) Objekt Attribut
    this.ATT_MODEL_STATUS   = fMethod.UserDefinedAttributeTypeNum("53b46ac0-fa1a-11de-7ad6-000c296ae13f"); // Modellstatus Status [AT_UA_VAL_3]
    this.ATT_NAME_FULL      = fMethod.UserDefinedAttributeTypeNum("995534b0-8256-11de-7e09-001a6b3c78e6"); // Langbezeichnung Neu
    this.ATT_NAME_FULL_ST   = Constants.AT_NAME_FULL; // Langbezeichnung ARIS Standard    
    this.ATT_NAME_SHORT     = fMethod.UserDefinedAttributeTypeNum("812a7220-969d-11e1-304e-00216a734540"); // Kurzname (Short name)
    this.ATT_OE_TYPENUM     = fMethod.UserDefinedAttributeTypeNum("086a6260-825e-11de-7e09-001a6b3c78e6"); // OE Typnummer
    this.ATT_OE_VALID_UNTIL = fMethod.UserDefinedAttributeTypeNum("f348af90-825d-11de-7e09-001a6b3c78e6"); // OE gueltig bis
    this.ATT_PROC_COORDINATOR = fMethod.UserDefinedAttributeTypeNum("1b11c660-825e-11de-7e09-001a6b3c78e6"); // Prozesskoordinator (Name)
    this.ATT_PROC_COORDINATOR_ID = fMethod.UserDefinedAttributeTypeNum("18578dc1-a872-11e9-50ea-005056af6d0b"); //Prozesskoordinator ID (login) LDAP
    this.ATT_PROC_COORDINATOR_MAIL = fMethod.UserDefinedAttributeTypeNum("55ab8660-d819-11de-3622-0025b3c0da68"); // PK (E-Mail) [AT_UA_TXT_140]
    this.ATT_PROC_MODELER   = fMethod.UserDefinedAttributeTypeNum("308e1c50-825e-11de-7e09-001a6b3c78e6"); // Prozessmodellierer [AT_UA_TXT_141]
    this.ATT_PROC_MODELER_ID = fMethod.UserDefinedAttributeTypeNum("ff761041-ca51-11e9-50ea-005056af6d0b"); // Prozessmodellierer (login) LDAP
    this.ATT_PROC_MODELER_MAIL = fMethod.UserDefinedAttributeTypeNum("7c3c6b50-d819-11de-3622-0025b3c0da68"); //PM (E-Mail) [AT_UA_TXT_142]
    this.ATT_PROC_RESP      = fMethod.UserDefinedAttributeTypeNum("4584c780-825e-11de-7e09-001a6b3c78e6"); // Prozessverantwortlicher [AT_PERS_RESP]
    this.ATT_PROC_RESP_ID      = fMethod.UserDefinedAttributeTypeNum("50002b71-a871-11e9-50ea-005056af6d0b"); // Prozessverantwortlicher LDAP Benutzerkonto (login)
    this.ATT_PROC_RESP_MAIL = fMethod.UserDefinedAttributeTypeNum("a2076830-d819-11de-3622-0025b3c0da68"); //Prozessverantwortlicher (E-Mail) [AT_UA_TXT_143]
    this.ATT_PROC_CREATOR   = fMethod.UserDefinedAttributeTypeNum("06f50810-c77c-11e2-1e28-0017a4771c06"); // Fachlicher Ersteller
    this.ATT_PROC_CREATOR_MAIL = fMethod.UserDefinedAttributeTypeNum("20c9bba0-c77c-11e2-1e28-0017a4771c06"); // Fachlicher Ersteller (E-Mail)
    this.ATT_PROC_CREATOR_ID   = fMethod.UserDefinedAttributeTypeNum("90e06ea1-ca51-11e9-50ea-005056af6d0b"); // Fachlicher Ersteller (login) LDAP
    this.ATT_PROC_VERSION   = fMethod.UserDefinedAttributeTypeNum("9f3efd60-fa1b-11de-7ad6-000c296ae13f"); // Prozessversion [AT_UA_TXT_7 / 5073da00-825e-11de-7e09-001a6b3c78e6]
    this.ATT_PROCESSING_FLAG = fMethod.UserDefinedAttributeTypeNum("93537430-8253-11de-7e09-001a6b3c78e6"); // Bearbeitungskennzeichen
    this.ATT_PROCESSING_FLAG_STAT_OBJ = fMethod.UserDefinedAttributeTypeNum("53b46ac0-fa1a-11de-7ad6-000c296ae13f"); // Bearbeitungskennzeichen_Status_Objekt [AT_UA_TXT_6]
    this.ATT_RELEASE_STAT   = fMethod.UserDefinedAttributeTypeNum("e4a312d0-825f-11de-7e09-001a6b3c78e6"); // Release-Stand
    this.ATT_SAPID_PARENT   = fMethod.UserDefinedAttributeTypeNum("14c9bbd0-8260-11de-7e09-001a6b3c78e6"); // SAP ID Parent
    this.ATT_SEQUENCE_FLAG  = fMethod.UserDefinedAttributeTypeNum("fd87d400-8252-11de-7e09-001a6b3c78e6"); // Ablaufkennzeichen fuer Objekte [AT_UA_TXT_16]
    this.ATT_SOFTWARE_VENDOR = fMethod.UserDefinedAttributeTypeNum("0c311510-8263-11de-7e09-001a6b3c78e6"); // Hersteller der Anwendung [AT_MNFCT_1]
    this.ATT_SOFTWARE_VERSION = fMethod.UserDefinedAttributeTypeNum("1da24300-8263-11de-7e09-001a6b3c78e6"); // Version Softwaresystem
    this.ATT_SORT_CRIT      = fMethod.UserDefinedAttributeTypeNum("f91b22b0-8260-11de-7e09-001a6b3c78e6"); // Sortierkriterium fuer OE Layout [AT_UA_TXT_30]
    this.ATT_STD_DOC        = fMethod.UserDefinedAttributeTypeNum("83a983f0-1f9f-11df-7c02-000c296ae13f"); // Standarddokument [AT_UA_VAL_61]
    this.ATT_STATUS_LIB_AFTERUPDATE = fMethod.UserDefinedAttributeTypeNum("37d6a6d0-88c6-11de-7e09-001a6b3c78e6"); // Status Stammdatum nach Update
    this.ATT_SYSTEM_MARK    = fMethod.UserDefinedAttributeTypeNum("03420330-8261-11de-7e09-001a6b3c78e6"); // Systemkennzeichen [AT_SHORT_DESC]
    this.ATT_SYSTEM_RESP    = fMethod.UserDefinedAttributeTypeNum("0b01a7b0-8261-11de-7e09-001a6b3c78e6"); // Systemverantwortlicher
    this.ATT_SYSTEMS        = fMethod.UserDefinedAttributeTypeNum("2d254870-8256-11de-7e09-001a6b3c78e6"); // IT-Systeme
    this.ATT_TYPE           = fMethod.UserDefinedAttributeTypeNum("bf351820-8261-11de-7e09-001a6b3c78e6"); // Type (AT_TYPE), Kocourek: GUID is missing on ARIS I1 IDSA Server, on ARIS 7.2 = 3542245, User attribute Multi-line text (editable, language-independent))
    this.ATT_PROC_SEQUENCE_NUM = fMethod.UserDefinedAttributeTypeNum("d6da9a61-8a31-11e6-0d25-005056af6d0b"); // Prozess-Ordnungsnummer
    this.ATT_KSU_UNTERLAGENKLASSE = fMethod.UserDefinedAttributeTypeNum("559e3b91-8a32-11e6-0d25-005056af6d0b"); // KSU Unterlagenklasse VW
    this.ATT_KSU_UNTERLAGENKLASSE_AUDI = fMethod.UserDefinedAttributeTypeNum("bbd38be1-8a32-11e6-0d25-005056af6d0b"); // KSU Unterlagenklasse Audi
    this.ATT_ANLAGEN_GUID = fMethod.UserDefinedAttributeTypeNum("111eb890-8a33-11e6-0d25-005056af6d0b"); // Anlagen_GUID - Dokumente
    this.ATT_MITGELTENDE_DOK_GUID = fMethod.UserDefinedAttributeTypeNum("6a23b8f1-8a33-11e6-0d25-005056af6d0b"); // Mitgeltende Dokumente_GUID 
    this.ATT_WEITERFUHRENDE_DOK_GUID = fMethod.UserDefinedAttributeTypeNum("9f30a7b1-8a33-11e6-0d25-005056af6d0b"); // Weiterführende Dokumente_GUID
    this.ATT_PHONE_NUM = Constants.AT_PHONE_NUM; // Telefonnummer
    this.ATT_FACHLICHER_ERSTELLER_OE = fMethod.UserDefinedAttributeTypeNum("f3f0d271-8a33-11e6-0d25-005056af6d0b"); // Fachlicher Ersteller OE
    this.ATT_SUPERIOR_PROCESS_TXT = fMethod.UserDefinedAttributeTypeNum("43224270-8a34-11e6-0d25-005056af6d0b"); // Übergeordneter Prozess
    this.ATT_PREDECESSOR_PROCESS_TXT = fMethod.UserDefinedAttributeTypeNum("9aa054b1-8a34-11e6-0d25-005056af6d0b"); // Vorgängerprozesse
    this.ATT_SUCCESSOR_PROCESS_TXT = fMethod.UserDefinedAttributeTypeNum("db300a70-8a34-11e6-0d25-005056af6d0b"); // Nachfolgeprozesse
    this.ATT_GB_BPM_GUID = fMethod.UserDefinedAttributeTypeNum("29949281-5553-11e9-50ea-005056af6d0b"); //GB-BPM approver
    this.ATT_GB_BPM_EMAIL_GUID = fMethod.UserDefinedAttributeTypeNum("e8b95f61-5553-11e9-50ea-005056af6d0b"); //GB-BPM e-mail
    this.ATT_GB_BPM_ID = fMethod.UserDefinedAttributeTypeNum("aa84ee01-a871-11e9-50ea-005056af6d0b"); //GB-BPM Benutzerkonto (login) LDAP
    //this.ATT_MNG_SYS = fMethod.UserDefinedAttributeTypeNum("a5d55c01-5f05-11ea-50ea-005056af6d0b"); //Management systems (lang independent, editable)
    this.ATT_MNG_SYS = fMethod.UserDefinedAttributeTypeNum("a1f8d2a1-637a-11ea-50ea-005056af6d0b"); //Management systems (lang dependent, editable)
    this.ATT_MNG_SYS_GUID = fMethod.UserDefinedAttributeTypeNum("461400e1-5f06-11ea-50ea-005056af6d0b"); //Management systems  (lang independent)
    this.ATT_MNG_TOPIC = fMethod.UserDefinedAttributeTypeNum("13f7fa81-637a-11ea-50ea-005056af6d0b"); //Management topics  (lang dependent)
    this.ATT_MNG_TOPIC_GUID = fMethod.UserDefinedAttributeTypeNum("01d8cf51-5f06-11ea-50ea-005056af6d0b"); //Management topics  (lang independent)
    this.ATT_SEQUENCE_SORT  = fMethod.UserDefinedAttributeTypeNum("4930e7e1-53fb-11ea-0517-005056af26e2"); //Sequence number (Sorting)
    this.ATT_QM_CREATOR_TEAM    = fMethod.UserDefinedAttributeTypeNum("65169f01-908a-11eb-7c47-005056af6d0b"); //QM-Erstellerteammitglied (QM-Enabler / FBK-QM)
    this.ATT_QM_CREATOR_TEAM_ID = fMethod.UserDefinedAttributeTypeNum("8feafa01-908a-11eb-7c47-005056af6d0b"); //QM-Erstellerteammitglied (QM-Enabler / FBK-QM) ID
    this.ATT_QM_CONSULTANT      = fMethod.UserDefinedAttributeTypeNum("39eab8b1-908b-11eb-7c47-005056af6d0b"); //QM-Berater_in
    this.ATT_QM_CONSULTANT_ID   = fMethod.UserDefinedAttributeTypeNum("6e05cd61-908b-11eb-7c47-005056af6d0b"); //QM-Berater_in ID
    this.ATT_QM_DECL_INVALIDITY   = fMethod.UserDefinedAttributeTypeNum("7769ed91-a1b7-11eb-7c47-005056af6d0b"); //Ungültigkeitserklärung / Declaration of invalidity
    this.ATT_OES_CREATOR_DISTLIST   = fMethod.UserDefinedAttributeTypeNum("c3b64ae1-e4a6-11eb-7c53-005056af6d0b"); // Gespeicherte OEs-Ersteller-Verteiler-Zuordnung
    this.ATT_RISK_ASSIGNMENT   = fMethod.UserDefinedAttributeTypeNum("49de6241-f43f-11eb-7c53-005056af6d0b"); // Risk assignment TO Process model
    
    this.ATT_KSU_UNTERLAGENKLASSE_VW_VALUE1 = "56025493-8a32-11e6-0d25-005056af6d0b"; // KSU Unterlagenklasse VW - Werte 1
    this.ATT_KSU_UNTERLAGENKLASSE_VW_VALUE2 = "5604c595-8a32-11e6-0d25-005056af6d0b"; // KSU Unterlagenklasse VW - Werte 2
    this.ATT_KSU_UNTERLAGENKLASSE_AUDI_VALUE1 = "bbdd01c3-8a32-11e6-0d25-005056af6d0b"; // KSU Unterlagenklasse Audi - Werte 1
    this.ATT_KSU_UNTERLAGENKLASSE_AUDI_VALUE2 = "bbdd01cb-8a32-11e6-0d25-005056af6d0b"; // KSU Unterlagenklasse Audi - Werte 2

    this.ATT_CONFIDENTIALITY_LEVEL_VW = fMethod.UserDefinedAttributeTypeNum("a28f4b31-df26-11e6-0d25-005056af6d0b"); // Vertraulichkeitsstufe VW (Confidentiality level)
    this.ATT_CONFIDENTIALITY_LEVEL_VW_VALUE1 = "a2a4a7f3-df26-11e6-0d25-005056af6d0b"; // Vertraulichkeitsstufe VW - Werte 1
    this.ATT_CONFIDENTIALITY_LEVEL_VW_VALUE2 = "a2a4a7fb-df26-11e6-0d25-005056af6d0b"; // Vertraulichkeitsstufe VW - Werte 2
    this.ATT_CONFIDENTIALITY_LEVEL_VW_VALUE3 = "a2a4a803-df26-11e6-0d25-005056af6d0b"; // Vertraulichkeitsstufe VW - Werte 3
    this.ATT_CONFIDENTIALITY_LEVEL_VW_VALUE4 = "a2a4a80b-df26-11e6-0d25-005056af6d0b"; // Vertraulichkeitsstufe VW - Werte 4        
    
    this.ATT_GDPR = fMethod.UserDefinedAttributeTypeNum("856ba031-1d90-11e9-50ea-005056af6d0b"); //DSVGO-GDPR
    this.ATT_GDPR_VALUE_0 = "e3fb8913-6369-11ea-50ea-005056af6d0b"; //No GDPR data
    this.ATT_GDPR_VALUE_1 = "85812403-1d90-11e9-50ea-005056af6d0b"; //Personal data
    this.ATT_GDPR_VALUE_2 = "8581240b-1d90-11e9-50ea-005056af6d0b"; //Sensitive Personal data
    this.ATT_GDPR_REASON = fMethod.UserDefinedAttributeTypeNum("32031e61-759a-11ea-50ea-005056af6d0b"); //GDPR Reason/Comment

    this.ATT_FOLDER_RESP    = fMethod.UserDefinedAttributeTypeNum("53c46c71-764a-11e9-50ea-005056af6d0b"); // ARIS group owner, ARIS Ordnerverantwortlicher

    this.ATT_NAME           = Constants.AT_NAME;
    this.ATT_ID             = Constants.AT_ID;
    this.ATT_SAPID          = Constants.AT_SAP_ID2;
    this.ATT_OE_TYPENAME    = Constants.AT_UA_TXT_28;
    this.ATT_EMPL           = Constants.AT_UA_TXT_41; // Mitarbeiter
    this.ATT_LUSER          = Constants.AT_LUSER;
    this.ATT_LNC_TITLE1     = Constants.AT_LNC_TITLE1;
    this.ATT_AKV_LINK       = Constants.AT_EXT_1;
    this.ATT_LINK2          = Constants.AT_EXT_2;
    this.ATT_LINK3          = Constants.AT_EXT_3;
    this.ATT_LINK4          = Constants.AT_LINK;
    this.ATT_AKV_TITLE      = Constants.AT_TITL1;
    this.ATT_TITLE2         = Constants.AT_TITL2;
    this.ATT_TITLE3         = Constants.AT_TITL3;
    this.ATT_TITLE4         = Constants.AT_TITL4;
    this.ATT_DEPL_YEAR      = Constants.AT_USER_ATTR_INT10; // Einsatzjahr
    this.ATT_CRITICALITY    = Constants.AT_CRITICALITY;
    this.ATT_SYSTEM_STATUS_TYPE  = Constants.AT_UA_VAL_250; // Systemstatus (Type)
    this.ATT_SYSTEM_STATE   = Constants.AT_SYSTEM_STATE;
    this.ATT_OPERATION_PHASE_END = Constants.AT_OPERATION_PHASE_END;
    this.ATT_DEACTIVATION_PHASE_END = Constants.AT_DEACTIVATION_PHASE_END;
    this.ATT_STATUS_INCIDENT_PROC = Constants.AT_UA_VAL_35; // Incident Prozessstatus
    this.ATT_PROCESSING_TYPE = Constants.AT_PROCESSING_TYPE;
    this.ATT_PROC_SUPPORT_STATUS = Constants.AT_PROC_SUPPORT_STATUS;

    this.ATT_OPEN_QUESTION  = Constants.AT_UA_TXT_131;  // Offene Fragen zum Prozessschritt
    this.ATT_REM            = Constants.AT_REM;         // Bemerkung
    this.ATT_SINCE          = Constants.AT_SINCE;       // seit
    this.ATT_REL_ON         = Constants.AT_REL_ON;      // Freigegeben am
    this.ATT_ROLE           = Constants.AT_UA_TXT_20;   // Rolle in der Funktion
    this.ATT_DOC            = Constants.AT_UA_TXT_18;   // Dokumente in der Funktion
    this.ATT_GO_TYPE        = fMethod.UserDefinedAttributeTypeNum("317ba898-7df8-11da-0c60-cf8e338f9a0b");// Geschaeftsobjekttyp [AT_UA_VAL_1]

    this.ATT_WP             = Constants.AT_UA_TXT_126;  // Schwachstellen
    this.ATT_CSF            = Constants.AT_UA_TXT_117;  // Erfolgsfaktor
    this.ATT_VARIANT        = Constants.AT_UA_TXT_114;  // Varianten
    this.ATT_PROJECTS       = Constants.AT_UA_TXT_133   // Projekte
    this.ATT_DISTR_LIST     = Constants.AT_UA_TXT_21;   // Zusaetzliche Verteiler
    this.ATT_DISTR_GUID     = Constants.AT_UA_TXT_22;   // Zusaetzliche Verteiler - nur die GUIDs fuer Liste
    this.ATT_ADD_DOC        = Constants.AT_UA_TXT_23;   // Weiterfuehrende Dokumente - nur GUIDs wahrscheinlich ueberfluessig
    this.ATT_STATUS_SINCE   = fMethod.UserDefinedAttributeTypeNum("317ba9b2-7df8-11da-0c60-cf8e338f9a0b"); // gültig ab datumsFeld für das Statusobjekt
    this.ATT_DESC           = Constants.AT_DESC;
    this.ATT_RANGE          = Constants.AT_UA_TXT_26;   // Spanne
    this.ATT_VALENCY        = Constants.AT_UA_TXT_27;   // Wertigkeit A-E
    this.ATT_BOOL_DOCISVA   = Constants.AT_USER_ATTR_BOOL_5; // Dokument ist eine VA
    this.ATT_FUNC_FOR_PROCSTEP = Constants.AT_UA_TXT_130; // Funktionen zum Prozessschritt
    this.ATT_PREV_PROC      = Constants.AT_UA_TXT_109;  // Erzeugerprozess
    this.ATT_PREV_APPL      = Constants.AT_UA_TXT_119;  // Erzeugeranwendung
    this.ATT_CREATOR_TEAM   = Constants.AT_UA_TXT_5;    // Verfasser/Erstellerteam
    this.ATT_CREATOR_TEAM_ID= fMethod.UserDefinedAttributeTypeNum("4fa02691-a870-11e9-50ea-005056af6d0b"); // Verfasser/Erstellerteam (login) LDAP
    this.ATT_VALID_UNITL    = Constants.AT_VALID_UNTIL; // geultig bis
    this.ATT_CONFIRM_DATE   = fMethod.UserDefinedAttributeTypeNum("317ba9b3-7df8-11da-0c60-cf8e338f9a0b"); // Abstimmungsdatum (Abstimmungsstand)
    this.ATT_ACTUAL_TRG     = Constants.AT_USER_ATTR3;  // Ist/SOll
    this.ATT_ARCHIVE        = Constants.AT_USER_ATTR4;  // Archiv
    this.ATT_PROC_GOAL      = Constants.AT_UA_TXT_3     // Prozessziel
    this.ATT_PROC_GOAL_COMMENT = Constants.AT_UA_TXT_113; //Zielkommentar
    this.ATT_PROC_NOT_PUBLISH = Constants.AT_USER_ATTR_BOOL_4; //Prozess soll nicht veröffentlicht werden.
    this.ATT_PROC_PURPOSE   = Constants.AT_USER_ATTR2   // Prozesszweck - This under ARIS 9 is visible under 317ba882-7df8-11da-0c60-cf8e338f9a0b only
    this.ATT_CHANGE_HISTORY = Constants.AT_UA_TXT_8; //Änderungshistorie
    this.ATT_CHANGE_SERVICE = Constants.AT_UA_TXT_9; //Änderungsdienst
    this.ATT_GLOSSARY       = Constants.AT_UA_TXT_10; //Begriffe/AbkUErzungen
    this.ATT_COMPENTENCY    = Constants.AT_UA_TXT_11; //Zustaendigkeiten
    this.ATT_MGMT_POLICY    = Constants.AT_UA_TXT_13; //Management-Grundsatz [String]
    this.ATT_MGMT_POLICY_2  = fMethod.UserDefinedAttributeTypeNum("9b8c1621-945d-11ea-3cf0-005056af6d0b"); //Management-Grundsatz [list of values]
    this.ATT_MGMT_POLICY_2_VALUE1 = "9b9f28f3-945d-11ea-3cf0-005056af6d0b";
    this.ATT_MGMT_POLICY_2_VALUE2 = "9ba199f7-945d-11ea-3cf0-005056af6d0b";
    this.ATT_MGMT_POLICY_2_VALUE3 = "9ba199ff-945d-11ea-3cf0-005056af6d0b";    
    this.ATT_MGMT_POLICY_2_VALUE4 = "9ba19a07-945d-11ea-3cf0-005056af6d0b";    
    this.ATT_MGMT_POLICY_2_VALUE5 = "9ba19a0f-945d-11ea-3cf0-005056af6d0b";
    this.ATT_MGMT_POLICY_2_VALUE6 = "9ba19a17-945d-11ea-3cf0-005056af6d0b";
    this.ATT_MGMT_POLICY_2_VALUE7 = "9ba19a1f-945d-11ea-3cf0-005056af6d0b";
    this.ATT_MGMT_POLICY_2_VALUE8 = "9ba19a27-945d-11ea-3cf0-005056af6d0b";
    this.ATT_MGMT_POLICY_2_VALUE9 = "9ba19a2f-945d-11ea-3cf0-005056af6d0b";
    this.ATT_MGMT_POLICY_2_VALUE10 = "9ba19a37-945d-11ea-3cf0-005056af6d0b";
    this.ATT_MGMT_POLICY_2_VALUE11 = "9ba19a3f-945d-11ea-3cf0-005056af6d0b";
    this.ATT_MGMT_POLICY_2_VALUE12 = "9ba19a47-945d-11ea-3cf0-005056af6d0b";
    this.ATT_MGMT_POLICY_2_VALUE13 = "9ba19a4f-945d-11ea-3cf0-005056af6d0b";
    this.ATT_MGMT_POLICY_2_VALUE14 = "9ba19a57-945d-11ea-3cf0-005056af6d0b";
    this.ATT_MGMT_POLICY_2_VALUE15 = "9ba19a5f-945d-11ea-3cf0-005056af6d0b";
    this.ATT_MGMT_POLICY_2_VALUE16 = "9ba19a67-945d-11ea-3cf0-005056af6d0b";
    this.ATT_SCOPE_COMPANY  = Constants.AT_UA_TXT_14; // Geltungsbereich Gesellschaft
    this.ATT_SCOPE_FACTORY  = Constants.AT_UA_TXT_15; // Geltungsbereich - Werk
    this.ATT_SCOPE_CORE_PLANT = fMethod.UserDefinedAttributeTypeNum("f2f3e6f1-5875-11ea-50ea-005056af6d0b"); // 01 Geltungsbereich (haupt Werke von Marke)
    this.ATT_SCOPE_PLANT_OTHER = fMethod.UserDefinedAttributeTypeNum("adad0301-587b-11ea-50ea-005056af6d0b"); // 02 Erweiterter Geltungsbereich (Werke von Marke)
    this.ATT_ESCOPE_MARK_COMPANY = fMethod.UserDefinedAttributeTypeNum("f9a58f21-587b-11ea-50ea-005056af6d0b"); // 03 Erweiterter Geltungsbereich (Marken im Konzern)
    this.ATT_ESCOPE_FURTHER_COMPANY = fMethod.UserDefinedAttributeTypeNum("69450a31-587d-11ea-50ea-005056af6d0b"); // 04 Erweiterter Geltungsbereich (Beteiligungsgesellschaften im Konzern)
    this.ATT_RECOMMENDATION = fMethod.UserDefinedAttributeTypeNum("31bd86c0-c77d-11e2-1e28-0017a4771c06"); // Empfehlung
    this.ATT_RESPONSIBLE    = Constants.AT_UA_TXT_111; // Verantwortlicher
    this.ATT_IO_STATUS      = Constants.AT_UA_VAL_110; // Status Informationsobjekt
    this.ATT_SYSTEMTYPE     = Constants.AT_UA_VAL_221; // Systemtyp
    this.ATT_EMAIL_ADDR     = Constants.AT_EMAIL_ADDR;
    this.ATT_MODEL_LAYOUT_PROCESS_MARKER = Constants.AT_UA_TXT_203;
    this.ATT_CONTEXT_DGM_FLAG = Constants.AT_USER_ATTR_BOOL_143; // Kontextdiagrammkennzeichen
    this.ATT_SUPPORT_TYPE   = Constants.AT_SUPPORT_TYPE;
    this.ATT_OE_OUTOFDATE   = Constants.AT_USER_ATTR_BOOL10; // OE Kennzeichen alt (User attribute Boolean 10, GUID: 317ba8ba-7df8-11da-0c60-cf8e338f9a0b
    this.ATT_PHONE_NUM      = Constants.AT_PHONE_NUM;
    
    
    this.ATT_CHANGE_HISTORY_ITSYSTEM = Constants.AT_CHANGE_HISTORY; //Constants.AT_UA_TXT_99; // Aenderungshistorie IT-System
    this.ATT_CLASSIFICATION = Constants.AT_UA_VAL_224; // Klassifizierung
    this.ATT_PDF_PROCESS_MARKER = Constants.AT_UA_TXT_202 // Pdf Process Marker
    this.ATT_COMPONENT_TYPE = Constants.AT_UA_VAL_241; // Komponententyp
    this.ATT_STATUS_STANDARDIZATION = Constants.AT_STATUS_STANDARDIZATION // Status Standardisierung
    this.ATT_PROPOSER       = Constants.AT_UA_TXT_210; // Antragsteller
    this.ATT_REM_DATASEC    = Constants.AT_UA_TXT_62; // Bemerkung Datenschutz
    this.ATT_NOTES_DATASEC  = Constants.AT_UA_TXT_154; // notizen Datenschutz
    this.ATT_TRANSMISSION   = Constants.AT_USER_ATTR_BOOL_50; // Übermittlung an Drittstaaten
    this.ATT_DATA_CATEGORY  = Constants.AT_UA_VAL_309; // Datenkategorie
    this.ATT_EXP_OF_DATA    = Constants.AT_UA_TXT_33; // Datenfrist
    this.ATT_REASON_DATAEXP = Constants.AT_UA_TXT_35; // begruendung zur datenfrist
    this.ATT_CONFIDENTIALTY = Constants.AT_UA_VAL_14; // Vertraulichkeit
    this.ATT_ADVISORY_DATACLASS = Constants.AT_USER_ATTR_BOOL_103; // Beratung erfolgt (Datenklassifizierung)
    this.ATT_ADVISORY_INTEGRITY = Constants.AT_USER_ATTR_BOOL_104; // Beratung erfolgt (Integrietaet)
    this.ATT_ADVISORY_TRACABILITY = Constants.AT_USER_ATTR_BOOL_105; // Beratung erfolgt (Nachweisbarkeit)
    this.ATT_INTEGRITY      = Constants.AT_UA_VAL_242; // INtegritaet)
    this.ATT_TRACABILITY    = Constants.AT_UA_VAL_243 // Nachweisbarkeit
    this.ATT_PREDEC_SYSTEM  = Constants.AT_UA_TXT_194; // Vorgaengersystem
    this.ATT_FUTURE_SYSTEM  = Constants.AT_UA_TXT_195; // Nachfolgersystem
    this.ATT_INDIVIDUAL_DEVELOPMENT = Constants.AT_INDIVIDUAL_DEVELOPMENT;
    this.ATT_SOURCECODE_AVAILABLE = Constants.AT_USER_ATTR_BOOL_7; // Quellcode verfuegbar
    this.ATT_ENCRYPTION     = Constants.AT_UA_VAL_312; // verwendete Verschluesselung
    this.ATT_AUTHENTICATION = Constants.AT_UA_VAL_311;
    this.ATT_AUTHORISATION  = Constants.AT_UA_VAL_13;
    this.ATT_OTHER_ENCRYPTION = Constants.AT_USER_ATTR_BOOL_102;
    this.ATT_ARCH_ELEMENT   = Constants.AT_ARCH_ELEMENT;    
    this.ATT_START_PLAN_PHASE_IN = Constants.AT_START_PLAN_PHASE_IN
    this.ATT_PHASE_IN_PLAN  = Constants.AT_PHASE_IN_PLAN
    this.ATT_PHASE_IN_AS_IS = Constants.AT_PHASE_IN_AS_IS;
    this.ATT_START_PLAN_PHASE_OUT = Constants.AT_START_PLAN_PHASE_OUT;
    this.ATT_PHASE_OUT_PLAN  = Constants.AT_PHASE_OUT_PLAN;
    this.ATT_PHASE_OUT_AS_IS = Constants.AT_PHASE_OUT_AS_IS;
    this.ATT_TO_BE           = Constants.AT_TO_BE;
    this.ATT_QUADRANT        = Constants.AT_QUADRANT;
    this.ATT_DO_CLASSIFIER   = Constants.AT_UA_VAL_237; // Datenobjekt Klassifizierer
    this.ATT_DO_TYPE         = Constants.AT_UA_VAL_232; // Datenobjekt Klasse/Attribut
    this.ATT_RISK_SOURCE_TYPE   = fMethod.UserDefinedAttributeTypeNum("e66f5de1-f43e-11eb-7c53-005056af6d0b"); // Risk source type
        this.ATT_RISK_SOURCE_TYPE_VALUE_OPT1   = "e6afc243-f43e-11eb-7c53-005056af6d0b"; // Option 1: Freetext-Risiko
        this.ATT_RISK_SOURCE_TYPE_VALUE_OPT2   = "e6afc24b-f43e-11eb-7c53-005056af6d0b"; // Option 2: RiskRadar/IKS
        this.ATT_RISK_SOURCE_TYPE_VALUE_OPT3   = "c8751653-f45b-11eb-7c53-005056af6d0b"; // Option 3: Erfasstes Risiko über Dokumente

    //Merge from SuE to KuV attributes - Source element GUID SUE2KUV
    this.ATT_SOURCE_ELEMENT_GUID = fMethod.UserDefinedAttributeTypeNum("d6ed9a21-4fc8-11e9-50ea-005056af6d0b");

    this.ATT_SOURCE_ELEMENT_GUID_MCOPY = fMethod.UserDefinedAttributeTypeNum("c1dae511-8c19-11e9-50ea-005056af6d0b"); //GUID of source model in case of model copy by script - Source element GUID (Model copy)

    //DataImport
    this.ATT_TECH_STEP_NO = fMethod.UserDefinedAttributeTypeNum("4f97c270-a65d-11e0-35df-0021709e8cf4");//Techn. step number
    this.ATT_PROCEDURE = fMethod.UserDefinedAttributeTypeNum("4a47c411-6def-11ea-50ea-005056af6d0b");//Procedure
    this.ATT_DATA_SOURCE = fMethod.UserDefinedAttributeTypeNum("1cad75d1-6df0-11ea-50ea-005056af6d0b");//Data source
    this.ATT_DATA_DRAIN = fMethod.UserDefinedAttributeTypeNum("915b9111-6def-11ea-50ea-005056af6d0b");//Data Drain

    this.AVT_SYSTEMTYPE_APPLSYS     = Constants.AVT_VALUE_3401; // Systemtyp:Anwendungssystem [4808]
    this.AVT_SYSTEMTYPE_ITCOMP      = Constants.AVT_VALUE_3402; // IT-Komponente [4809]
    this.AVT_SUPPORT_TYPE_SYS_RESP  = Constants.AVT_SUPPORT_TYPE_SYS_RESP; // [4790]
    this.AVT_SUPPORT_TYPE_FREE      = Constants.AVT_SUPPORT_TYPE_FREE_12;
    this.AVT_SUPPORT_TYPE_SUBST_SYS_RESP = Constants.AVT_SUPPORT_TYPE_SUBST_SYS_RESP;
    this.AVT_SUPPORT_TYPE_OPERATION_RESP = Constants.AVT_SUPPORT_TYPE_OPERATION_RESP;
    this.AVT_SUPPORT_TYPE_SUBST_OPERATION_RESP = Constants.AVT_SUPPORT_TYPE_SUBST_OPERATION_RESP;
    this.AVT_SUPPORT_TYPE_FACILITY_OPERATOR = Constants.AVT_SUPPORT_TYPE_FACILITY_OPERATOR;
    this.AVT_SUPPORT_TYPE_1ST       = Constants.AVT_SUPPORT_TYPE_1ST;
    this.AVT_SUPPORT_TYPE_2ND       = Constants.AVT_SUPPORT_TYPE_2ND;
    this.AVT_SUPPORT_TYPE_3RD       = Constants.AVT_SUPPORT_TYPE_3RD;
    this.AVT_SUPPORT_TYPE_SYS_INTEGRATOR = Constants.AVT_SUPPORT_TYPE_SYS_INTEGRATOR;
    this.AVT_SUPPORT_TYPE_HOTLINE   = Constants.AVT_SUPPORT_TYPE_HOTLINE;
    this.AVT_COMPONENT_TYPE_ITCOMP  = Constants.AVT_VALUE_3461;  //[4868]
    this.AVT_COMPONENT_TYPE_ARCHITECTURE = Constants.AVT_VALUE_3462; //[4869]
    this.AVT_SATUS_STD_NONSTD       = Constants.AVT_STATUS_STANDARDIZATION_NON_STANDARD; //[4772]
    this.AVT_PROCSUPPORTSTATUS_PHASEINPLAN = Constants.AVT_TO_BE_PHASED_IN; //[5636]
    this.AVT_PROCSUPPORTSTATUS_PHASEDINSINCE = Constants.AVT_PHASED_IN // [5637]
    this.AVT_PROCSUPPORTSTATUS_PHASEOUTPLAN = Constants.AVT_TO_BE_PHASED_OUT; //[5638]
    this.AVT_PROCSUPPORTSTATUS_PHASEDOUTSINCE = Constants.AVT_PHASED_OUT //[5639]
    this.AVT_MODEL_STATUS_RELEASED      = this.checkUserDefinedAttributeValueTypeNum(this.ATT_MODEL_STATUS, "53b6dbc3-fa1a-11de-7ad6-000c296ae13f"); // freigegeben AVT_VALUE_14
    this.AVT_MODEL_STATUS_READYFORRELEASE = this.checkUserDefinedAttributeValueTypeNum(this.ATT_MODEL_STATUS, "53b6dbc0-fa1a-11de-7ad6-000c296ae13f"); // ready for release

    this.AVT_DO_CLASSIFIER_STANDARDIZED = this.checkUserDefinedAttributeValueTypeNum(this.ATT_DO_CLASSIFIER, "0140fae5-91b7-11db-0883-a9b67d408a47");
    this.AVT_DO_TYPE_CLASS              = this.checkUserDefinedAttributeValueTypeNum(this.ATT_DO_TYPE, "0140fad4-91b7-11db-0883-a9b67d408a47");
    this.AVT_STD_DOC_USERMANUAL         = this.checkUserDefinedAttributeValueTypeNum(this.ATT_STD_DOC, "36c17245-1fa0-11df-7c02-000c296ae13f"); // Benutzerhandbuch [AVT_VALUE_654]
    this.AVT_STD_DOC_DATASECCONCEPT     = this.checkUserDefinedAttributeValueTypeNum(this.ATT_STD_DOC, "36c17243-1fa0-11df-7c02-000c296ae13f"); // Dantensicherungskonzept [AVT_VALUE_656]
    this.AVT_STD_DOC_MORELINKS          = this.checkUserDefinedAttributeValueTypeNum(this.ATT_STD_DOC ,"36c17241-1fa0-11df-7c02-000c296ae13f"); // weitere Links [AVT_VALUE_658]
    this.AVT_STD_DOC_COMPONENTMODEL     = this.checkUserDefinedAttributeValueTypeNum(this.ATT_STD_DOC, "36c1724b-1fa0-11df-7c02-000c296ae13f"); // architekturmodell [AVT_VALUE_659]
    this.AVT_STD_DOC_SYSTEMCOMMITTEE    = this.checkUserDefinedAttributeValueTypeNum(this.ATT_STD_DOC, "36c1724a-1fa0-11df-7c02-000c296ae13f"); // Systemausschuss /Datenschutz [AVT_VALUE_660]
    this.AVT_STD_DOC_OPMODEL            = this.checkUserDefinedAttributeValueTypeNum(this.ATT_STD_DOC, "36c17248-1fa0-11df-7c02-000c296ae13f"); // operationales Modell [AVT_VALUE_662]
    this.AVT_STD_DOC_CALLLINKSYSTEM     = this.checkUserDefinedAttributeValueTypeNum(this.ATT_STD_DOC, "36c17247-1fa0-11df-7c02-000c296ae13f"); // Linkaufruf System [AVT_VALUE_663]
    this.AVT_STD_DOC_PROCDESCINCIDENT   = this.checkUserDefinedAttributeValueTypeNum(this.ATT_STD_DOC, "36c17246-1fa0-11df-7c02-000c296ae13f"); // Incidentprozess Beschreibung [AVT_VALUE_664]
    
    //Workaround, da Attributwerte (noch) nicht in eingestellter Reihenfolge ausgelesen werden können
    this.AVT_MODEL_STATUS_VALUES = new Array();
    this.AVT_MODEL_STATUS_VALUES.push(this.checkUserDefinedAttributeValueTypeNum(this.ATT_MODEL_STATUS, "53b6dbc1-fa1a-11de-7ad6-000c296ae13f")); // in Bearbeitung
    this.AVT_MODEL_STATUS_VALUES.push(this.checkUserDefinedAttributeValueTypeNum(this.ATT_MODEL_STATUS, "53b6dbc2-fa1a-11de-7ad6-000c296ae13f")); // fertig zur Pruefung
    this.AVT_MODEL_STATUS_VALUES.push(this.checkUserDefinedAttributeValueTypeNum(this.ATT_MODEL_STATUS, "53b6dbc0-fa1a-11de-7ad6-000c296ae13f")); // fertig zur Freigabe
    this.AVT_MODEL_STATUS_VALUES.push(this.checkUserDefinedAttributeValueTypeNum(this.ATT_MODEL_STATUS, "53b6dbc3-fa1a-11de-7ad6-000c296ae13f")); // freigegeben
    this.AVT_MODEL_STATUS_VALUES.push(this.checkUserDefinedAttributeValueTypeNum(this.ATT_MODEL_STATUS, "53b6dbc4-fa1a-11de-7ad6-000c296ae13f")); // zu ueberarbeiten
     
    // symbol constants    [New conventions since 1/11/2015]
    //this.SYM_PROC_STEP_N1   = fMethod.UserDefinedSymbolTypeNum("a8575b80-8158-11e4-5006-b7d8c0bff8d4"); // Process step [New conventions since 1/11/2015] - testing purpose only
    this.SYM_PROC_STEP_N2   = fMethod.UserDefinedSymbolTypeNum("8c0e1c10-73e8-11e5-4d5c-005056af7044"); // Prozessschritt mit Hinterlegung
    this.SYM_PROC_STEP      = fMethod.UserDefinedSymbolTypeNum("53de0160-57ba-11e5-255f-0017a4773c28"); // Prozessschritt
    this.SYM_PROC_STEP_2    = fMethod.UserDefinedSymbolTypeNum("8c0e1c10-73e8-11e5-4d5c-005056af7044"); // Prozessschritt mit Hinterlegung (not working for Enter object attributes)
    this.SYM_STAT_OBJ       = fMethod.UserDefinedSymbolTypeNum("354abbb0-57b7-11e5-255f-0017a4773c28"); // Statussymbol [New conventions since 1/11/2015]
    this.SYM_STAT_OBJ_BPMN  = fMethod.UserDefinedSymbolTypeNum("bb311580-a6cf-11ec-302e-005056af6d0b"); // Statussymbol for eBPMN 1-2022 [based on New conventions since 1/11/2015]
    this.SYM_OE_STD         = fMethod.UserDefinedSymbolTypeNum("0ab65310-57bb-11e5-255f-0017a4773c28"); // Org. Einheit [Org unite]
    this.SYM_OE_SIMPLE      = fMethod.UserDefinedSymbolTypeNum("0ab65310-57bb-11e5-255f-0017a4773c28"); // Standardsymbol (simpel) [Org unite]
    this.SYM_OE_SPLIT       = fMethod.UserDefinedSymbolTypeNum("0ab65310-57bb-11e5-255f-0017a4773c28"); // Alternativsymbol (unterteilt unten) [Org unite]
    this.SYM_PS_PERFORMANCE = fMethod.UserDefinedSymbolTypeNum("6412dec0-57ba-11e5-255f-0017a4773c28"); // Leistungsprozess []
    this.SYM_PS_HIERARCHY   = fMethod.UserDefinedSymbolTypeNum("c83fcee1-73e8-11e5-4d5c-005056af7044"); // Prozesss mit Hinterlegung
    this.SYM_PS_CONTROL     = fMethod.UserDefinedSymbolTypeNum("e61d6d90-57ba-11e5-255f-0017a4773c28"); // steuerungsprozess []
    this.SYM_WKD_CONTROL    = fMethod.UserDefinedSymbolTypeNum("e61d6d90-57ba-11e5-255f-0017a4773c28"); // Steuerungsprozess WKD [steuerungsprozess]
    this.SYM_PS_SUPPORT     = fMethod.UserDefinedSymbolTypeNum("b343b280-57ba-11e5-255f-0017a4773c28"); // Unterstützungsprozess []
    this.SYM_WKD_SUPPORT    = fMethod.UserDefinedSymbolTypeNum("b343b280-57ba-11e5-255f-0017a4773c28"); // Unterstützungsprozess []
    this.SYM_PRC_IF_IN      = fMethod.UserDefinedSymbolTypeNum("6412dec0-57ba-11e5-255f-0017a4773c28"); // Vorgaengerprozess [Process]
    this.SYM_PRC_IF_OUT     = fMethod.UserDefinedSymbolTypeNum("6412dec0-57ba-11e5-255f-0017a4773c28"); // Nachfolgerprozess [Process]
    this.SYM_PRC_INTERFACE  = fMethod.UserDefinedSymbolTypeNum("7bc638f0-57ba-11e5-255f-0017a4773c28"); // Process interface (for Create Process standards script)
    this.SYM_PRC_INTERFACE2 = fMethod.UserDefinedSymbolTypeNum("9676fb91-8159-11e4-5006-b7d8c0bff8d4"); // Process interface with hierarchy (for Create Process standards script)
    this.SYM_INFO_OBJECT    = fMethod.UserDefinedSymbolTypeNum("8d5b0039-342b-4418-8a4a-4be3c29e719e"); // abgeleitetes Informationsobjekt [262157] =Data cluster (EN)
    this.SYM_DO_CLASS_STD   = fMethod.UserDefinedSymbolTypeNum("58156de6-003b-47eb-99b0-0db9bfa239e4"); // standardisiertes Datenobjekt (Klasse)
    this.SYM_GO             = fMethod.UserDefinedSymbolTypeNum("b7f2d820-57b9-11e5-255f-0017a4773c28"); // Geschäftsobjekt [65537]
    this.SYM_Document       = fMethod.UserDefinedSymbolTypeNum("616efeb0-73e4-11e5-255f-0017a4773c28"); // Dokument
    this.SYM_IT_System      = fMethod.UserDefinedSymbolTypeNum("01119050-57ba-11e5-255f-0017a4773c28"); // EDV System (Application system type = IT System))
    this.SYM_Group          = fMethod.UserDefinedSymbolTypeNum("8f618f50-57b9-11e5-255f-0017a4773c28"); // Committee
    this.SYM_Role           = fMethod.UserDefinedSymbolTypeNum("9cb23880-57b9-11e5-255f-0017a4773c28"); // Role
    this.SYM_Freigabe       = fMethod.UserDefinedSymbolTypeNum("f7028f11-8159-11e4-5006-b7d8c0bff8d4"); // Freigabe
    this.SYM_Milestone      = fMethod.UserDefinedSymbolTypeNum("381ce720-57ba-11e5-255f-0017a4773c28"); // Milestone
    this.SYM_Location       = Constants.ST_LOC_1; // Location
    this.SYM_DataCluster    = Constants.ST_CLST; //Data object (cluster)
    this.SYM_ManagSystem    = Constants.ST_KNWLDG_CAT_1; //Knowledge category
    this.SYM_GDPR_DSVGO     = Constants.ST_KNWLDG_CAT_1; //Knowledge category
    this.SYM_ManagTopic     = Constants.ST_TECH_TERM; //Post id (technical term)
    
/** symbol constants    [New conventions since 1/11/2015 R1 - replaced by symbols set up on ARIS7.2 Environment] (back-up)
    this.SYM_PROC_STEP      = fMethod.UserDefinedSymbolTypeNum("a8575b80-8158-11e4-5006-b7d8c0bff8d4"); // Prozess(-schritt) [New conventions since 1/11/2015] 
    this.SYM_PROC_STEP_2    = fMethod.UserDefinedSymbolTypeNum("1f519ec1-815a-11e4-5006-b7d8c0bff8d4"); // Prozess(-schritt) geteilt [New conventions since 1/11/2015]
    this.SYM_STAT_OBJ       = fMethod.UserDefinedSymbolTypeNum("209f2800-1ff8-11e5-3739-000c293052e4"); // Statussymbol [New conventions since 1/11/2015]
    this.SYM_OE_STD         = fMethod.UserDefinedSymbolTypeNum("f69bf581-7f1e-11e4-5006-b7d8c0bff8d4"); // Org. Einheit [Org unite]
    this.SYM_OE_SIMPLE      = fMethod.UserDefinedSymbolTypeNum("f69bf581-7f1e-11e4-5006-b7d8c0bff8d4"); // Standardsymbol (simpel) [Org unite]
    this.SYM_OE_SPLIT       = fMethod.UserDefinedSymbolTypeNum("f69bf581-7f1e-11e4-5006-b7d8c0bff8d4"); // Alternativsymbol (unterteilt unten) [Org unite]
    this.SYM_PS_PERFORMANCE = fMethod.UserDefinedSymbolTypeNum("13e698e0-0398-11e5-2960-000c293052e4"); // Leistungsprozess []
    this.SYM_PS_CONTROL     = fMethod.UserDefinedSymbolTypeNum("0ba35001-0399-11e5-2960-000c293052e4"); // steuerungsprozess []
    this.SYM_WKD_CONTROL    = fMethod.UserDefinedSymbolTypeNum("0ba35001-0399-11e5-2960-000c293052e4"); // Steuerungsprozess WKD [steuerungsprozess]
    this.SYM_PS_SUPPORT     = fMethod.UserDefinedSymbolTypeNum("c495eba0-0398-11e5-2960-000c293052e4"); // Unterstützungsprozess []
    this.SYM_WKD_SUPPORT    = fMethod.UserDefinedSymbolTypeNum("c495eba0-0398-11e5-2960-000c293052e4"); // Unterstützungsprozess []
    this.SYM_PRC_IF_IN      = fMethod.UserDefinedSymbolTypeNum("13e698e0-0398-11e5-2960-000c293052e4"); // Vorgaengerprozess [Process]
    this.SYM_PRC_IF_OUT     = fMethod.UserDefinedSymbolTypeNum("13e698e0-0398-11e5-2960-000c293052e4"); // Nachfolgerprozess [Process]
    this.SYM_INFO_OBJECT    = fMethod.UserDefinedSymbolTypeNum("8d5b0039-342b-4418-8a4a-4be3c29e719e"); // abgeleitetes Informationsobjekt [262157]
    this.SYM_DO_CLASS_STD   = fMethod.UserDefinedSymbolTypeNum("58156de6-003b-47eb-99b0-0db9bfa239e4"); // standardisiertes Datenobjekt (Klasse)
    this.SYM_GO             = fMethod.UserDefinedSymbolTypeNum("cb64e2e1-8154-11e4-5006-b7d8c0bff8d4"); // Geschäftsobjekt [65537]
    conventions valid till 1/11/2015 (back-up)
    this.SYM_PROC_STEP      = fMethod.UserDefinedSymbolTypeNum("bfae9b20-ef6b-11d8-26c5-0002a5439e1d"); // Prozess(-schritt) [917839] 
    this.SYM_PROC_STEP_2    = fMethod.UserDefinedSymbolTypeNum("650b20d0-a41b-11d8-6f52-003005190929"); // Prozess(-schritt) geteilt [65871] 
    this.SYM_STAT_OBJ       = fMethod.UserDefinedSymbolTypeNum("d1b0db50-fbe9-11d8-26c5-0002a5439e1d"); // Old Statussymbol [983375] 
    this.SYM_OE_STD         = fMethod.UserDefinedSymbolTypeNum("7ee8d060-d634-11d8-26c5-0002a5439e1d"); // Org. Einheit [65680]
    this.SYM_OE_SIMPLE      = fMethod.UserDefinedSymbolTypeNum("3f6aacc0-856f-11d9-26c5-0002a5439e1d"); // Standardsymbol (simpel) [131216]
    this.SYM_OE_SPLIT       = fMethod.UserDefinedSymbolTypeNum("558b8010-856f-11d9-26c5-0002a5439e1d"); // Alternativsymbol (unterteilt unten) [196752]
    this.SYM_PS_PERFORMANCE = fMethod.UserDefinedSymbolTypeNum("75d427e0-a41b-11d8-6f52-003005190929"); // Leistungsprozess [131407]
    this.SYM_PS_CONTROL     = fMethod.UserDefinedSymbolTypeNum("c56b85a0-a41b-11d8-6f52-003005190929"); // steuerungsprozess [459087]
    this.SYM_WKD_CONTROL    = fMethod.UserDefinedSymbolTypeNum("d16af6b0-a41b-11d8-6f52-003005190929"); // Steuerungsprozess WKD [524623]
    this.SYM_PS_SUPPORT     = fMethod.UserDefinedSymbolTypeNum("b5417db0-a41b-11d8-6f52-003005190929"); // Unterstützungsprozess [393551]
    this.SYM_WKD_SUPPORT    = fMethod.UserDefinedSymbolTypeNum("a6e1d580-a41b-11d8-6f52-003005190929"); // Unterstützungsprozess [328015]
    this.SYM_PRC_IF_IN      = fMethod.UserDefinedSymbolTypeNum("fed9bed0-9e8d-11d8-5173-0020e06e9e46"); // Vorgaengerprozess [721231]
    this.SYM_PRC_IF_OUT     = fMethod.UserDefinedSymbolTypeNum("b955b990-9e8d-11d8-5173-0020e06e9e46"); // Nachfolgerprozess [655695]
    this.SYM_INFO_OBJECT    = fMethod.UserDefinedSymbolTypeNum("8d5b0039-342b-4418-8a4a-4be3c29e719e"); // abgeleitetes Informationsobjekt [262157]
    this.SYM_DO_CLASS_STD   = fMethod.UserDefinedSymbolTypeNum("58156de6-003b-47eb-99b0-0db9bfa239e4"); // standardisiertes Datenobjekt (Klasse)
    this.SYM_GO             = fMethod.UserDefinedSymbolTypeNum("2648ff20-a41b-11d8-6f52-003005190929"); // Geschäftsobjekt [65537]    
 */
 
    // modeltypes
    this.MOD_IO_DO_ALLOCATION = fMethod.UserDefinedModelTypeNum("56905910-5c4d-11dc-16a8-0015c55bb491"); // Informations-/Datenzuordnungsmodell (abgeleitet IE-Datenmodell)
}