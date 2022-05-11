//******************************
//      Daniel Masek            
//      Skoda Auto a.s.           
//******************************

// ----------------------------------------------------
// manage basic ADS feature with required ARIS Document administration
// ----------------------------------------------------


function ADSManager(){
    
// ----------------------------------------------------
// get ADS Folder
// ----------------------------------------------------
var SystemUser = 'system';
// system user with Docuement administration permissions
var SystemPWD = '{encrypted}5a4115507256dbf3fc1360d45f997ac3'
// users password
var EntireMethode = 'dd838074-ac29-11d4-85b8-00005a4053ff';
// entire method filter


this.assignADSPriviledges = function (tDB,tUser, tGroup){
var result = false;
var ActiveDB = this.getActiveDB(tDB);
var SystemDB = this.loginSystem(ActiveDB);
if (SystemDB != null){
var TargetGroup = this.getUserGroups(SystemDB,tUser, tGroup);
if (TargetGroup !=''){
result = TargetGroup.AssignUser(tUser);
}
this.logoutSystem(SystemDB);
}
return result;
}

this.unassignADSPriviledges = function (tDB,tUser, tGroup){
var result = false;
var ActiveDB = this.getActiveDB(tDB);
var SystemDB = this.loginSystem(ActiveDB);
if (SystemDB != null){
var TargetGroup = this.getUserGroups(SystemDB,tUser, tGroup);
if (TargetGroup !=''){
result = TargetGroup.UnassignUser(tUser);
}
this.logoutSystem(SystemDB);
}
return result;
}

this.getUserGroups = function(ActiveDB,tUser,tGroup){

var tListOfUserGroups = ActiveDB.UserGroupList();

for (var i = 0; i < tListOfUserGroups.length; i++){
        if (tListOfUserGroups[i].Name(-1).toString().toLowerCase() == tGroup.toLowerCase()){
        return tListOfUserGroups[i];
        }
        }
}

// ----------------------------------------------------
// login as System
// ----------------------------------------------------
this.loginSystem = function(ActiveDB){

return ArisData.openDatabase(ActiveDB, SystemUser, SystemPWD, EntireMethode, -1, true);

}
// ----------------------------------------------------
// logout as System
// ----------------------------------------------------
this.logoutSystem = function(SystemDB){

	if (SystemDB != null && SystemDB.IsValid()) {
                return SystemDB.close();
	}

}
// ----------------------------------------------------
// get Database from list
// ----------------------------------------------------
this.getActiveDB = function(tDB){

        var DBList = ArisData.GetDatabaseNames();
        for (var i = 0; i < DBList.length; i++) {
            if (DBList[i].toString() == tDB.Name(-1)) {
                return DBList[i];
            }
        }



}


}

