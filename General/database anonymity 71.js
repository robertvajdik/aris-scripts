
var g_nloc = Context.getSelectedLanguage()

var zahl_group = 0; 
var zahl_model = 0; 
var zahl_obj = 0;
var zahl_user = 0;
var zahl_ugroup = 0;

main();

function main() {
    var oselecteddatabases = ArisData.getSelectedDatabases();
    for(var i = 0; i < oselecteddatabases.length; i++) {
        var oselecteddatabase = oselecteddatabases[i];
        
        var olanguagelist = oselecteddatabase.LanguageList();

        var omaingroup = oselecteddatabase.RootGroup();
        makeanonymous_groups(omaingroup, olanguagelist);

        makeanonymous_usersandusergroups(oselecteddatabase);
    }
}

function makeanonymous_groups(ogroup, olanguagelist) {
    changegroupname(ogroup, olanguagelist);
    makeanonymous_modelsandobjects(ogroup, olanguagelist);
    
    var ogrouplist = ogroup.Childs();
    for(var i = 0; i < ogrouplist.length; i++) {  
        makeanonymous_groups(ogrouplist[i], olanguagelist);
    }
}


function makeanonymous_modelsandobjects(ogroup, olanguagelist) {
  var omodellist = ogroup.ModelList();
  for(var i = 0; i < omodellist.length; i++) {
      var omodel = omodellist[i];
      
      changemodelname(omodel, olanguagelist);
      deletemaintainedattributes(omodel);
  }
  
  var oobjectlist = ogroup.ObjDefList();
  for(var i = 0; i < oobjectlist.length; i++) {
      var oobj = oobjectlist[i];
      
      changeobjectname(oobj, olanguagelist);
      deletemaintainedattributes(oobj);
  }
}

function makeanonymous_usersandusergroups(odb) {
    var ouserlist = odb.UserList();
    for(var i = 0; i < ouserlist.length; i++) {
        var ouser = ouserlist[i];
        if (! (ouser.IsSystemUser() && vbStrComp(ouser.Name(g_nloc), "system", 1) == 0)) {
            
            ouser.Attribute(Constants.AT_NAME_LGINDEP, g_nloc).setValue("user_" + __toString(zahl_user));
            zahl_user = zahl_user + 1;
        }
//        deletemaintainedattributes(ouser);
    }

    var ousergrouplist = odb.UserGroupList();
    for(var i = 0; i < ousergrouplist.length; i++) {
        var ousergroup = ousergrouplist[i];
        ousergroup.Attribute(Constants.AT_NAME_LGINDEP, g_nloc).setValue("userGroup_" + __toString(zahl_ugroup));
        zahl_ugroup = zahl_ugroup + 1;
        
//        deletemaintainedattributes(ousergroup);
    }
}

function changegroupname(ogroup, olanguagelist) {
    for(var i = 0; i < olanguagelist.length; i++) {
        var nloc = olanguagelist[i].localeId();
        ogroup.Attribute(Constants.AT_NAME, nloc).setValue("group_" + __toString(zahl_group));
    }
    zahl_group = zahl_group + 1;
}

function changemodelname(omodel, olanguagelist) {
    for(var i = 0; i < olanguagelist.length; i++) {
        var nloc = olanguagelist[i].localeId();
        omodel.Attribute(Constants.AT_NAME, nloc).setValue("model_" + __toString(zahl_model));
    }
    zahl_model = zahl_model + 1;
}

function changeobjectname(oobj, olanguagelist) {
    for(var i = 0; i < olanguagelist.length; i++) {
        var nloc = olanguagelist[i].localeId();
        oobj.Attribute(Constants.AT_NAME, nloc).setValue("object_" + __toString(zahl_obj));
    }
    zahl_obj = zahl_obj + 1;
}

function deletemaintainedattributes(oitem) {
    var oattrlist = oitem.AttrList(g_nloc);
    for(var i = 0; i < oattrlist.length; i++) {
        var oattr = oattrlist[i];
        
        if (oattr.TypeNum() != Constants.AT_NAME || oattr.TypeNum() != Constants.AT_NAME_LGINDEP) {
            
            oattr.Delete();
        }
    }
}
