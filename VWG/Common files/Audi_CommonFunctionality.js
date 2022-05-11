/**
 * ARIS 7.2 Script Modul Audi_CommonFunctionality.js
 * Author: IDS Scheer Consulting GmbH
 * Date: 2012-10-19
 * Version 1.0.0.0 (| ) - initial script
 * Version 1.0.0.1 (2012-12-13| Manuel Peipe)
 *    - improved getCorporateKey: much faster and executable in ABP due to error in using API "IsChildGroupOf"
 * Version 1.0.0.2 (2017-13-07| Robert Vajdik)  
 *    - add UMC komponent to get usergroup
 * Version 1.0.0.3 (2019-01-01| Robert Vajdik)  
 oAudi_HelperClass.checkRights  validation of access rights
 */

var UMC         = Context.getComponent("UMC"); 
var users = UMC.getAllUsers();
    
/**
 * Assembles rgb color values into rgb color
 * @param {int} r   Red value
 * @param {int} g   Green value
 * @param {int} b   Blue value
 * @return          RGB color value
 * @type            long
 */
function rgb(r, g, b) {
    return r<<16|g<<8|b;
}

/**
 * trim Methode fuer Javascript Strings
 * @param {String} sString string, der getrimmed werden soll.
 * @return trimmed String
 * @type String
 */
function trim(sString) {
    sTrimmedString = sString.replace(/^\s+|\s+$/g, "");
    return sTrimmedString;
}

String.prototype.trim = function() { return ""+new java.lang.String(this).trim(); }
String.prototype.isGUID = function() { return (String(this).toLowerCase().match(/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/)!=null) }

/**
* @class Klasse um Schwachstelle-Objekte abzulegen. Schwachstellen werden als String in einem Attribut gespeichert.
*/
function Schwachstelle(){
    this.sDesc = "";
    this.sDegree = "";
    this.sApproval = "";
    this.sCause = "";
    this.sPrio = "";
    this.intP = 0;
    this.intF = 0;
    this.intI = 0;
    this.intT = 0;
    this.intA = 0;
    this.intS = 0;
    
    this.toString = function(){
        return this.sDesc;
    }
    
    this.init = function(){
        
    }
    
    this.getTextualRepresentation = function(){
        var sValS = new Array(11);
        sValS[0] = this.sDesc;
        sValS[1] = this.sDegree;
        sValS[2] = this.sApproval.replace("\r\n",";");
        sValS[3] = this.sCause.replace("\r\n",";");
        sValS[4] = this.IntP;
        sValS[5] = this.IntF;
        sValS[6] = this.IntI;
        sValS[7] = this.IntT;
        sValS[8] = this.IntA;
        sValS[9] = this.IntS;
        sValS[10] = this.sPrio;
        return sValS.join("~");
    }
}
/**
* @class Klasse um Erfolgsfaktor-Objekte abzulegen. Erfolgsfaktor werden als String in einem Attribut gespeichert.
* tKennzahlen ist eine Liste von Kennzahl-Objekten
*/
function Erfolgsfaktor(){
    this.sName = "";
    /**
    * @type Kennzahl[]
    */
    this.tKennzahlen = new Array();
    this.getTextualRepresentation = function(){
        var sValS = new Array();
        sValS.push(this.sName);
        for(var i=0;i<this.tKennzahlen.length;i++){
            sValS.push(this.tKennzahlen[i].getTextualRepresentation());
        }
        return sValS.join("~");
    }
    
    this.getNamesOfKennzahlen = function(){
        var sNames = new Array();
        for (var i=0;i<this.tKennzahlen.length;i++){
            sNames.push(this.tKennzahlen[i].toString());
        }
        return sNames;
    }
    
    this.addKennzahl = function(tKZ){
        this.tKennzahlen.unshift(tKZ);
    }
    
    /**
    * loescht den Erfolgsfaktor aus tErfolgsfaktoren an der Position index.
    * @param {Number} index index des zu löschenden Erfolgsfaktor.
    */
    this.deleteKennzahl = function(index){
        if(index>-1 && index<this.tKennzahlen.length){
            var updated = new Array();
            for(var i=0;i<this.tKennzahlen.length;i++){
                if(i!=index)
                    updated.push(this.tKennzahlen[i]);
            }
            this.tKennzahlen = updated;
        }
    }

    this.toString = function(){
        return this.sName.replace("\r\n", " ");
    }
}
/**
* @class Klasse um Kennzahl-Objekte abzulegen. Kennzahlen werden als String in einem Attribut gespeichert.
*/
function Kennzahl(){
    this.sBezeichnung =" ";
    this.lKategorie = 0;
    this.sDefinition =" ";
    this.sSollwert =" "; // sSollwertN
    this.sIstWert =" "; //sIstwertN
    this.sGrenzwert =" "; //sFreqT
    this.sWer =" "; // sSollwertT
    this.sWie =" "; // sIstwertT
    this.sPrio =" ";
    this.sFreq =" "; // sFreqN
    this.bSysGenKZ = false;
    
    this.getTextualRepresentation = function(){
        var sValS = new Array(11);
        sValS[0] = this.sBezeichnung;
        sValS[1] = this.lKategorie;
        sValS[2] = this.sDefinition;
        sValS[3] = this.sSollwert;
        sValS[4] = this.sPrio;
        sValS[5] = this.sFreq;
        sValS[6] = (this.bSysGenKZ==true)? "1" : "0";
        sValS[7] = this.sIstWert;
        sValS[8] = this.sGrenzwert;
        sValS[9] = this.sWer;
        sValS[10] = this.sWie;
        return sValS.join(";");
    }
    
    this.toString = function(){
        return this.sBezeichnung;
    }
}

/**
* @class Klasse um Projekt-Objekte abzulegen. Projekte werden als String in einem Attribut gespeichert.
*/
function Projekt(){
    this.sName = "";
    this.sLeiter = "";
    this.sDesc = "";
    this.sStart = "";
    this.sEnd = "";
    
    this.toString = function(){
        return this.sName;
    }
    
    this.getTextualRepresentation = function(){
        var sValS = new Array(5);
        sValS[0] = this.sName;
        sValS[1] = this.sLeiter;
        sValS[2] = this.sDesc;
        sValS[3] = this.sStart;
        sValS[4] = this.sEnd;
        return sValS.join("~");
    }
}
/**
* @class Klasse um Varianten-Objekte abzulegen. Varianten werden als String in einem Attribut gespeichert.
*/
function Variante(){
    this.sName = "";
    this.sAmount = "";
    this.sDesc = "";
    
    this.toString = function(){
        return this.sName;
    }
    
    this.getTextualRepresentation = function(){
        var sValS = new Array(3);
        sValS[0] = this.sName;
        sValS[1] = this.sAmount;
        sValS[2] = this.sDesc;
        return sValS.join("~");
    }
}
/**
* @class Klasse um PFITA-Objekte abzulegen. Pfita-Objekte werden als String in einem Attribut gespeichert.
*/
TPfita = function(){
	this.sFunction = "";
	this.sGO = "";
	this.sRem = "";
	this.sFuncReq = "";
    
    this.toString = function(){
        return (this.sGO + " " + this.sFunction);
    }
    
    this.getTextualRepresentation = function(){
        var sValS = new Array(4);
        sValS[0] = this.sFunction;
        sValS[1] = this.sGO;
        sValS[2] = this.sRem;
        sValS[3] = this.sFuncReq;
        return sValS.join("~");
    }
}               
/** 
 * Audi_HelperClass ist eine Klasse, die allgemein verwendete Funktionen.
 */
function Audi_HelperClass(){
    
    /**
     * checkRights prueft ob user uUserToCheck das Recht nRightToCheckt auf die 
     * Gruppe gCheck hat.
     * @param {Group} gCheck Gruppe fuer die Zugriffsrecht geprueft wird.
     * @param {User} uUserToCheck Benutzer für den direkte Berechtigung und
     * Gruppenberechtigung geprueft wird.
     * @param {Number} nRightToCheck Recht auf das geprueft wird. Zur Auswahl stehen 
     * alle Rechte Konstanten z.B. AR_WRITE, AR_READ, usw.
     * @returns {Group}
         
        AR_COLLABORATE
        Access privileges of users: comment/collaborate privilege 
         
        AR_DELETE
        Access privileges of users: delete privileges 
         
        AR_NORIGHTS
        Access privileges of users: no privileges 
         
        AR_READ
        Access privileges of users: read privileges 
         
        AR_READ_COLLABORATE
        Access privileges of users: read and comment/collaborate privileges 
         
        AR_READ_SUBMIT
        Access privileges of users: read,submit privileges 
         
        AR_READ_SUBMIT_COLLABORATE
        Access privileges of users: read, submit and comment/collaborate privileges 
         
        AR_READ_SUBMIT_WRITE 
        Access privileges of users: read, submit, write privileges 
         
        AR_READ_SUBMIT_WRITE_DELETE
        Access privileges of users: read, submit, write, delete privileges 
         
        AR_READ_WRITE
        Access privileges of users: read and write privileges 
         
        AR_READ_WRITE_DELETE
        Access privileges of users: read, write, delete privileges 
         
        AR_SUBMIT
        Access privileges of users: submit privileges 
         
        AR_WRITE
        Access privileges of users: write privileges 
         
        B_ACCESS_DELETE
        Deprecated. Same as AR_DELETE 
         
        B_ACCESS_NORIGHTS
        Deprecated. Same as AR_NORIGHTS. 
         
        B_ACCESS_READ
        Deprecated. Same as AR_READ 
        
        B_ACCESS_WRITE
        Deprecated. Same as AR_WRITE
     */
    this.checkRights = function(gCheck,uUserToCheck,nRightToChecks){
  
      if (nRightToChecks.length > 0) {
          for (var i = 0; i < nRightToChecks.length; i++) {
              var nRightToCheck = nRightToChecks[i];
                if (uUserToCheck.AccessRights(gCheck, true) == nRightToCheck)
                    return true;
                } //for
      }
      if (nRightToChecks == Constants.AR_WRITE) { //old Compatibility 
          if (uUserToCheck.AccessRights(gCheck, true) >= nRightToChecks) {
              return true;
          }
      }
      return false;
        
        /*
           if ((uUserToCheck.AccessRights(gCheck) & nRightToCheck) == nRightToCheck)
                return true;
            var ugUserS = uUserToCheck.UserGroups();
            for(var i=0;i<ugUserS.length;i++){
                if((ugUserS[i].AccessRights(gCheck) & nRightToCheck) == nRightToCheck)
                    return true;
            }
            //RV fix 2018308 uUserToCheck.UserGroups() return null
           var hm_userGroups = new Packages.java.util.HashMap(); //list of all usergroups in DB
           var user_Groups = ArisData.getActiveDatabase().UserGroupList();
                for(var i=0;i<user_Groups.length;i++){
                  hm_userGroups.put(user_Groups[i].Name(g_nLoc), user_Groups[i])
                }
         
         
            var uUserToCheck_GUID = uUserToCheck.GUID(); 
            var user_UMC = UMC.getUserById (uUserToCheck_GUID); //get user from UMC
            var usergroups = UMC.getAssignedUsergroupsForUser(user_UMC); //get assinged user group from UMC
            for(var i=0;i<usergroups.size();i++){
                var isLDAP = usergroups.get(i).isLDAP();
                var groupName = usergroups.get(i);
                var ugUser = hm_userGroups.get(groupName.toString());  // has match userGroup from UMC and DB
               
                if(ugUser!=null){
                    if((ugUser.AccessRights(gCheck) & nRightToCheck) == nRightToCheck); //check rights
                       return true;
                }
            }//for
            
            return false;
           */
    }
    
    
    /**
     * GetFADGroup Legt die korrekte Unter-Gruppe für das FZD fest.
     * @param {Item} item Aktuelle Funktion für die ein FZD angelegt werden soll.
     * @param {Group} gBaseFAD Hauptgruppe aller FZDs.
     * @returns {Group}
     */
    this.getFADGroup = function(gMainSubGroupS, item, gBaseFAD){
        // Check which subgroup of the main group includes the item
        for (var i = 0; i < gMainSubGroupS.length; i++){
            var oGroup = gMainSubGroupS[i];
            if (item.Group().IsChildGroupOf(oGroup)){
                var sName = oGroup.Name(g_nLoc);
                
                // Find the subgroup of gBaseFAD with the same name as oGroup
                var oSubGroupList = gBaseFAD.Childs();
                for (var j = 0; j < oSubGroupList.length; j++){
                    var oSubGroup = oSubGroupList[j];
                    
                    // check if the name of the sub group is the same name as the 'main' group
                    if (oSubGroup.Name(g_nLoc).equals(sName)){
                        return oSubGroup;
                    }
                }
            }
        }
        
        return null;
    }
    /**
     * getFontStyleByName gibt den gesuchten FontStyle zurueck.
     * @param {String} sName Name des gesuchten FontStyle.
     * @param {int} lRefLang Sprache des gesuchten FontStyle (in welcher Sprache ist der uebergebene Name).
     * @param {Boolean} bWithFallback if true or null, DefaultFont is returned if no fontstyle with name sName is available.
     *                          if false , null is returned if fontstyle could not be found.
     * @return der gesuchte FontStyle. Wenn es keinen FontStyle mit dem Namen gibt, wird der DefaultFontStyle zurueckgegeben.
     * type FontStyle
     */
    this.getFontStyleByName = function(sName,lRefLang,bWithFallback){
        var m_db = ArisData.getActiveDatabase();
        var m_fontList = m_db.FontStyleList();
        var oFontStyle = (bWithFallback==null || bWithFallback==true)? m_db.defaultFontStyle(): null;
        for (var i=0;i<m_fontList.length;i++){
            if(m_fontList[i].Name(lRefLang).equals(sName)){
                oFontStyle = m_fontList[i];
                break;
            }
        }
        return oFontStyle;
    }
    /**
     * getRootOcc gibt das erste Wurzelobjekt eines Modells zurueck.
     * @param {Model} oModel Das Modell fuer das das Wurzelobjekt gefunden werden soll.
     * @return Das Wurzelobjekt, das gefunden wurde, oder null, wenn kein Wurzelobjekt gefunden wurde.
     * type ObjOcc
     */
    this.getRootOcc = function (oModel){
        var oOccList = oModel.ObjOccList();
        for(var i=0;i<oOccList.length;i++){
            if(oOccList[i].InEdges(Constants.EDGES_ALL).length==0){
                return oOccList[i];
            }
        }
        return null;
    }
    /**
     * getConnectedTargetOccsByType gibt die Zielauspraeungen einer Objektauspraegung. 
     * Beruecksichtigt werden nur Zielobjekte mit dem entsprechenden Objekttyp.
     * @param {ObjOcc} oSrcOcc Auspraegung fuer die Zielobjekt gefunden werden sollen.
     * @param {int} lObjType Objekttypnummer der gesuchten Zielobjekte.
     * @returns {ObjOcc[]} Liste der gefundenen Zielobjektauspraegungen.
     */
    this.getConnectedTargetOccsByType = function(oSrcOcc,lObjType){
        var fMethod = ArisData.ActiveFilter();
        var symbols = fMethod.Symbols(oSrcOcc.Model().TypeNum(),lObjType);
        var ccTrgS = oSrcOcc.getConnectedObjOccs(symbols,Constants.EDGES_OUT);
        return ccTrgS;
    }
    /**
    * Methode um Schwachstellen, Projekte, Varianten,Pfita und Erfolgsfaktoren aus einem Attribut zu lesen. Die Methode vereint 
    * die Methoden "read_WeakPoints_from_attribute", "read_Varianten_from_attribute", "read_Projekte_from_attribute", 
    * "read_Erfolgsfaktoren_from_attribute" und "read_Pfita_from_attribute" aus den VB-Vesionen der Reports.
    * @param {String} sObjType Objektart, die gesucht wird. Moegliche Werte sind: "Erfolgsfaktor", "Schwachstelle", 
    * "Projekt", "Variante" oder "Pfita".
    * @param {ObjDef} oObjDef Objektdefinition des Objekts fuer das Attributobjekte gesucht werden.
    * @param {Number} lAttrTypNum Attributtypnummer, des Attributs, in dem die gesuchten Objekte definiert ist.
    * @param {Number} nLoc Sprache, in der die Objekte ausgelesen wird.
    * @returns {Object[]} Liste identifizierten Objekten, die den Inhalt des Attributs wiederspiegelt oder leere Liste.
    * Die Objekte sind vom Typ Schwachstellen, Erfolgsfaktor, Projekt oder Variante, je nach dem welcher Objekttyp sObjType
    * gesucht wurde.
    */
    this.getObjectFromAttribute = function(sObjType,oObjDef,lAttrTypNum,nLoc){
        var arResultList = new Array();
        if (sObjType.equals("Erfolgsfaktor")){
            arResultList = getErfolgsfaktoren(oObjDef,lAttrTypNum,nLoc);
        }else{
            var sAttrVal = oObjDef.Attribute(lAttrTypNum,nLoc).GetValue(false);
            if(!sAttrVal.equals("")){
                var arObjects = sAttrVal.split("<->");
                for(var i=0;i<arObjects.length;i++){
                    var arParams = arObjects[i].split("~");
                    var nLength = arParams.length;
                    var tObj;
                    switch(sObjType){
                        case "Schwachstelle":
                            tObj = new Schwachstelle();
                            tObj.sDesc = (nLength>0)? arParams[0]: "";
                            tObj.sDegree = (nLength>1)? arParams[1]: "";
                            tObj.sApproval = (nLength>2)? arParams[2]: "";
                            tObj.sCause = (nLength>3)? arParams[3]: "";
                            tObj.IntP = (nLength>4)? parseInt(arParams[4]): 0;
                            tObj.IntF = (nLength>5)? parseInt(arParams[5]): 0;
                            tObj.IntI = (nLength>6)? parseInt(arParams[6]): 0;
                            tObj.IntT = (nLength>7)? parseInt(arParams[7]): 0;
                            tObj.IntA = (nLength>8)? parseInt(arParams[8]): 0;
                            tObj.IntS = (nLength>9)? parseInt(arParams[9]): 0;
                            tObj.sPrio = (nLength>10)? arParams[10]: "";
                            break;
                        case "Projekt":
                            tObj = new Projekt();
                            tObj.sName = (nLength>0)? arParams[0]: "";
                            tObj.sLeiter = (nLength>1)? arParams[1]: "";
                            tObj.sDesc = (nLength>2)? arParams[2]: "";
                            tObj.sStart = (nLength>3)? arParams[3]: "";
                            tObj.sEnd = (nLength>4)? arParams[4]: "";
                            break;
                        case "Variante":
                            tObj = new Variante();
                            tObj.sName = (nLength>0)? arParams[0]: "";
                            tObj.sAmount = (nLength>1)? arParams[1]: "";
                            tObj.sDesc = (nLength>2)? arParams[2]: "";
                            break;
                        case "Pfita":
                            tObj = new TPfita();
                            tObj.sFunction = (nLength>0)? arParams[0]: "";
                            tObj.sGO = (nLength>1)? arParams[1]: "";
                            tObj.sRem = (nLength>2)? arParams[2]: "";
                            tObj.sFuncReq = (nLength>3)? arParams[3]: "";
                            break;
                    }
                    if(tObj!=null){
                        arResultList.push(tObj);
                    }
                }
            }
        }
        return arResultList;
    }
    
    /**
    * Liest Erfolgsfaktoren aus einem Objekt
    * @param {ObjDef} oObjDef Objektdefinition zu dem die Erfolgfaktoren ausgelesen werden.
    * @param {Number} lAttrTypNum Attributtypnummer, des Attributs, in dem die Erfolgsfaktoren definiert ist.
    * @param {Number} nLoc Sprache, in der die Erfolgsfaktoren ausgelesen wird.
    * @returns {Erfolgsfaktor[]} Liste von Erfolgsfaktorenobjekten, die den Inhalt des Attributs wiederspiegelt oder leere Liste.
    */
    function getErfolgsfaktoren(oObjDef,lAttrTypNum,nLoc){
    	var sAttrVal = oObjDef.Attribute(lAttrTypNum, nLoc).GetValue(false);
		var arErfolgsfaktoren = new Array();

	    if(!sAttrVal.equals("")){
    		var arObjects = sAttrVal.split("<->");
    		for(var i=0;i<arObjects.length;i++){
                if(!arObjects[i].equals("")){
                    var arParams = arObjects[i].split("~");
                    var nLength = arParams.length;
                    var tEF = new Erfolgsfaktor();
                    tEF.sName = (nLength>0)? arParams[0]: "";
                
                    //Jetzt kommen die Kennzahlen
                    var arKennzahlen = new Array();
                    for(var ii=1;ii<nLength;ii++){
                        if(!arParams[ii].equals("")){
                            var arKennzahl = arParams[ii].split(";");
                            var kzLength = arKennzahl.length;
                            
                            var tKZ = new Kennzahl();
                            tKZ.sBezeichnung = (kzLength>0)? arKennzahl[0]: " ";
                            tKZ.lKategorie = (kzLength>1)? arKennzahl[1]: 0;
                            tKZ.sDefinition = (kzLength>2)? arKennzahl[2]: " ";
                            tKZ.sSollwert= (kzLength>3)? arKennzahl[3]: " ";
                            tKZ.sPrio= (kzLength>4)? arKennzahl[4]: " ";
                            tKZ.sFreq= (kzLength>5)? arKennzahl[5]: " ";
                            tKZ.bSysGenKZ = (kzLength>6 && arKennzahl[6].equals("0"))? false: true;
                            tKZ.sIstWert= (kzLength>7)? arKennzahl[7]: " ";
                            tKZ.sGrenzwert= (kzLength>8)? arKennzahl[8]: " ";
                            tKZ.sWer= (kzLength>9)? arKennzahl[9]: " ";
                            tKZ.sWie= (kzLength>10)? arKennzahl[10]: " ";
                            arKennzahlen.push(tKZ);
                        }
                    }
                    tEF.tKennzahlen = arKennzahlen;
                    arErfolgsfaktoren.push(tEF);
                }
		    }
        }
        return arErfolgsfaktoren;
    }
}

/**
 * sortOccsByAttrList ist eine Sortierfunktion, die eine Liste von Objektauspraegungen nach den Attributen 
 * AT_UA_TXT_30, AT_NAME, AT_UA_TXT_26 sortiert.
 * @param {ObjOcc} a Objektauspraegung 1
 * @param {ObjOcc} b Objektausrpaegung 2
 * @return 0, wenn Attributwerte gleich sind; 1, wenn Objektauspraegung a einen hoeheren Wert hat; -1, wenn Objektauspraegung b einen hoeheren Wert hat.
 * type Number
 */
function sortOccsByAttrList(a,b){
    if(a.ObjDef().Attribute(VWAudiConstants.ATT_SORT_CRIT,g_nLoc).GetValue(true)==b.ObjDef().Attribute(VWAudiConstants.ATT_SORT_CRIT,g_nLoc).GetValue(true)){
        if(a.ObjDef().Name(g_nLoc)==b.ObjDef().Name(g_nLoc)){
            if(a.ObjDef().Attribute(VWAudiConstants.ATT_RANGE,g_nLoc).GetValue(true)==b.ObjDef().Attribute(VWAudiConstants.ATT_RANGE,g_nLoc).GetValue(true)){
                return 0;
            }else if (a.ObjDef().Attribute(VWAudiConstants.ATT_RANGE,g_nLoc).GetValue(true)>b.ObjDef().Attribute(VWAudiConstants.ATT_RANGE,g_nLoc).GetValue(true)){
                return 1;
            }else{
                return -1;
            }
        }else if (a.ObjDef().Name(g_nLoc)>b.ObjDef().Name(g_nLoc)){
            return 1;
        }else{
            return -1;
        }
    }else if (a.ObjDef().Attribute(VWAudiConstants.ATT_SORT_CRIT,g_nLoc).GetValue(true)>b.ObjDef().Attribute(VWAudiConstants.ATT_SORT_CRIT,g_nLoc).GetValue(true)){
        return 1;
    }else{
        return -1;
    }
}

/**
 * sortOccsByX ist eine Sortierfunktion, die eine Liste von Objektauspraegungen nach ihrer X-Position sortiert. Die Auspraegungen
 * mit dem kleinsten X-Wert stehen vorne in der Liste, die mit dem groessten stehen am Ende der Liste.
 * @param {ObjOcc} a Objektauspraegung 1
 * @param {ObjOcc} b Objektausrpaegung 2
 * @return 0, wenn Attributwerte gleich sind; 1, wenn Objektauspraegung a einen hoeheren Wert hat; -1, wenn Objektauspraegung b einen hoeheren Wert hat.
 * type Number
 */
function sortOccsByX(a,b){
    if(a.X()==b.X()){
       return 0;
    }else if (a.X()>b.X()){
        return 1;
    }else{
        return -1;
    }
}

/**
 * sortOccsByYX ist eine Sortierfunktion, die eine Liste von Objektauspraegungen nach ihrer Y-Position und dann nach ihrer
 * X-Position sortiert. Die Auspraegungen mit dem kleinsten X-Wert stehen vorne in der Liste, die mit dem groessten stehen 
 * am Ende der Liste.
 * @param {ObjOcc} a Objektauspraegung 1
 * @param {ObjOcc} b Objektausrpaegung 2
 * @return 0, wenn Attributwerte gleich sind; 1, wenn Objektauspraegung a einen hoeheren Wert hat; -1, wenn Objektauspraegung b einen hoeheren Wert hat.
 * type Number
 */
function sortOccsByYX(a,b){
    if(a.Y()==b.Y()){
        if(a.X()==b.X()){
           return 0;
        }else if (a.X()>b.X()){
            return 1;
        }else{
            return -1;
        }
    }else if (a.Y()>b.Y()){
        return 1;
    }else{
        return -1;
    }
}

/**
 * sortOccsByXY ist eine Sortierfunktion, die eine Liste von Objektauspraegungen nach ihrer X-Position und dann nach ihrer
 * Y-Position sortiert. Die Auspraegungen mit dem kleinsten X-Wert stehen vorne in der Liste, die mit dem groessten stehen 
 * am Ende der Liste.
 * @param {ObjOcc} a Objektauspraegung 1
 * @param {ObjOcc} b Objektausrpaegung 2
 * @return 0, wenn Attributwerte gleich sind; 1, wenn Objektauspraegung a einen hoeheren Wert hat; -1, wenn Objektauspraegung b einen hoeheren Wert hat.
 * type Number
 */
function sortOccsByXY(a,b){
    if(a.X()==b.X()){
        if(a.Y()==b.Y()){
           return 0;
        }else if (a.Y()>b.Y()){
            return 1;
        }else{
            return -1;
        }
    }else if (a.X()>b.X()){
        return 1;
    }else{
        return -1;
    }
}
/**
 * sortOccsByY ist eine Sortierfunktion, die eine Liste von Objektauspraegungen nach ihrer Y-Position sortiert. Die Auspraegungen
 * mit dem kleinsten Y-Wert stehen vorne in der Liste, die mit dem groessten stehen am Ende der Liste.
 * @param {ObjOcc} a Objektauspraegung 1
 * @param {ObjOcc} b Objektausrpaegung 2
 * @return 0, wenn Auspraegungen an der selben Y-Position stehen; 1, wenn Objektauspraegung a einen hoeheren Wert hat; -1, wenn Objektauspraegung b einen hoeheren Wert hat.
 * type Number
 */
function sortOccsByY(a,b){
    if(a.Y()==b.Y()){
       return 0;
    }else if (a.Y()>b.Y()){
        return 1;
    }else{
        return -1;
    }
}
/**
* sortLaneByStart ist eine Sortierfunktion, die eine Liste von Lanes nach ihrer Start-Position sortiert. Die Lane mit dem kleinsten
 * Startwert steht an erster Position in der Liste.
 * @param {ObjOcc} a Objektauspraegung 1
 * @param {ObjOcc} b Objektausrpaegung 2
 * @return 0, wenn der Startwert gleich sind; 1, wenn Lane a einen hoeheren Wert hat; -1, wenn Lane b einen hoeheren Wert hat.
 * type Number
 */
function sortLaneByStart(a,b){
    if(a.Start()==b.Start()){
       return 0;
    }else if (a.Start()>b.Start()){
        return 1;
    }else{
        return -1;
    }
}

/**
* sortItemByName ist eine Sortierfunktion, die eine Liste von Items Namen sortiert.
 * @param {Item} a Item 1
 * @param {Item} b Item 2
 * @return 0, wenn die Namen gleich sind; 1, wenn Name a einen hoeheren Wert hat; -1, wenn Namen b einen hoeheren Wert hat.
 * type Number
 */
function sortItemByName(a,b){
    if(a.Name(-1).toLowerCase()==b.Name(-1).toLowerCase()){
       return 0;
    }else if (a.Name(-1).toLowerCase()>b.Name(-1).toLowerCase()){
        return 1;
    }else{
        return -1;
    }
}

function sortOccsByName(a,b){
    if(a.ObjDef().Name(-1).toLowerCase()==b.ObjDef().Name(-1).toLowerCase()){
       return 0;
    }else if (a.ObjDef().Name(-1).toLowerCase()>b.ObjDef().Name(-1).toLowerCase()){
        return 1;
    }else{
        return -1;
    }
}

/**
* getLangDependGroupPath ist eine Funktion, die den sprachenabhängigen Pfad ermittelt
 * @param 
 * @deprecated
 */

function getLangDependGroupPath(XMLnode) {
var langDependConfigFile =  "AUDI_Config.xml"

// mögliche Werte für XMLnode: GroupPathFZD, ...
    return Context.getPrivateProfileString("General", XMLnode+(Context.getSelectedLanguage()), "nodefault", langDependConfigFile);
    
}

/**
* method to check to which company the element oItem belongs. the method returns the company identifier.
* the identifier is the first part of the company groupname. ' ' is the delimiter.
* if no company identifier is found 0000 is returned.
*/
function getCorporateKey(oItem,nLoc) {
    var sGroupName = "";

    var oRootGroup = oItem.Database().RootGroup();
    var oGroup = getTopGroup(oItem.Group(), oRootGroup);
    if (oGroup != null && oGroup.IsValid()) {
        sGroupName = oGroup.Name(nLoc)+"";
    }
    sGroupName = (sGroupName.indexOf(" ")>0)? sGroupName.substring(0,sGroupName.indexOf(" ")): "0000";
    
    return sGroupName;
}

// returns the top group in the path of the child group
function getTopGroup(oChild, oRootGroup) {
    var oReturn = null;
    var oParent = oChild.Parent();
    if (oParent.IsValid() && !oParent.equals(oRootGroup)) {
        oReturn = getTopGroup(oParent, oRootGroup);
    } else {
        oReturn = oChild;
    }
    return oReturn;
}
