 /**
  * @fileoverview
  * Dieser Report Variante kopiert die gewählten Modelle oder Objekten.
  *
  * @author <a href="mailto:robert.vadjik@idsa.cz">Robert Vajdik</a><br>
  * @version 1.1 : -> Mehrsprachigkeit
  *                   
  */
 //method filter we are working with
 var g_omethodfilter = ArisData.getActiveDatabase().ActiveFilter();
 var g_nloc = Context.getSelectedLanguage();

 //group for predefined objects
 var initFolder = "";
 //if user pressed Cancel button
 var CancelIsPressed = false;
 //if user wants to change the predefined group
 var bShowGroupSelectionDialog = false;

 //if we should inform user that some object moves are non-successful
 //because of right violations
 var bShowEndMsg = false;

 // alte Modelle sichern
 var oModels = ArisData.getSelectedModels();
 var oOccs = ArisData.getSelectedObjOccs();
 var oObjDefs = ArisData.getSelectedObjDefs();
 //Selected group OID for predefined folder
 var targetGroup;

 if (oOccs.length > 0) {
     for (var i = 0; i < oOccs.length; i++) {
         oObjDefs.push(oOccs[i].ObjDef());
     } //for
 }

 var oMerge = Context.getComponent("Merge");
 if (!(typeof(oMerge) == "object" && oMerge != null)) {
     Dialogs.MsgBox(getString("TEXT_20"));
     throw new __EndScriptException();
 }


 function main() {
     init();
     outfile = Context.createOutputObject(Constants.OUTTEXT, Context.getSelectedFile());
     outfile.Init(g_nloc);
     outfile.DefineF("LOG", "Arial", 10, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_LEFT, 0, 21, 0, 0, 0, 1);
     outfile.DefineF("REPORT1", "Arial", 24, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_BOLD | Constants.FMT_CENTER, 0, 21, 0, 0, 0, 1);
     outfile.DefineF("REPORT2", "Arial", 14, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_LEFT, 0, 21, 0, 0, 0, 1);
     outfile.DefineF("REPORT3", "Arial", 8, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_LEFT, 0, 21, 0, 0, 0, 1);

     outfile.OutputLnF("----Variant Copy Model(s) or Object(s)----", "LOG");
     setReportHeaderFooter(outfile, g_nloc, true, true, true);


     if (!g_omethodfilter.IsFullMethod()) {
         dResult = Dialogs.MsgBox(getString("INFO_1"),
             Constants.MSGBOX_BTN_YESNO + Constants.MSGBOX_ICON_QUESTION, getString("SCRIPT_NAME"));
         if (dResult == Constants.MSGBOX_RESULT_NO) {
             Context.setScriptError(Constants.ERR_CANCEL);
             return;
         }
     }
     nDialogResult = ShowMoveOptionsDialog();
     if (CancelIsPressed == true) {
         Context.setScriptError(Constants.ERR_CANCEL);
         return;
     }
     //variant copy
     if (CancelIsPressed == false) {
         makeaVariantCopy();
     }

     if (bShowEndMsg) {
         //inform the user if some objects were not moved due to right violations and/or method filer violations
         Dialogs.MsgBox(getString("INFO_2"),
             Constants.MSGBOX_BTN_OK + Constants.MSGBOX_ICON_INFORMATION,
             getString("INFO_2"));
     } else {
         //inform the user if all objects were moved 
         Dialogs.MsgBox(getString("INFO_3"),
             Constants.MSGBOX_BTN_OK + Constants.MSGBOX_ICON_INFORMATION,
             getString("SCRIPT_NAME"));
     }
     outfile.WriteReport(Context.getSelectedPath(), Context.getSelectedFile());
 }


 function ShowMoveOptionsDialog() {
     //main dialog for setting options for move objects   
     var xD = 910;
     var yD = 110;
     var MoveOptionsDialog = Dialogs.createNewDialogTemplate(xD, yD, getString("SCRIPT_NAME"), "ProcessMoveOptionsDlgEvents");
     //MoveOptionsDialog.GroupBox(0, 0, 780, 308, "Options for moving object definitions", "opt_gb");
     MoveOptionsDialog.GroupBox(5, 5, xD - 5, 90, getString("STEP1"), "groups_gb");
     MoveOptionsDialog.Text(20, 20, 800, 14, getString("TARGETGROUP_DESC"), "Text3");
     // MoveOptionsDialog.GroupBox(15, 33, 725, 16, "", "pre_def_group_gb");
     MoveOptionsDialog.TextBox(20, 35, xD - 50, 28, "pre_def_group_tb");
     MoveOptionsDialog.PushButton(20, 66, 200, 16, getString("SELECT_GROUP"), "predef_grp_btn");
     MoveOptionsDialog.GroupBox(5, 110, xD - 5, 90, getString("STEP2"), "obg_gb");
     MoveOptionsDialog.Text(15, 120, 400, 14, getString("TEXT_DESC"), "mod_prty_comment");
     MoveOptionsDialog.TextBox(15, 140, 250, 28, "VAR_TEXTBOX"); //ANUBIS entry 331692

     // MoveOptionsDialog.Text(15,115 , 720, 14, baseGroup.Path(g_nloc), "path");
     //userdialog.TextBox(220, 20, 60, 21, "VAR_TEXTBOX");
     /*        MoveOptionsDialog.Text(15, 95, 233, 36, getString("OBJ_TO_PREDEF_GRP"), "ot_to_predef_grp_comment");
             MoveOptionsDialog.Text(295, 95, 233, 36, getString("OBJ_TO_MOVE_TO_MODEL"), "ot_comment");
             MoveOptionsDialog.Text(545, 95, 233, 36, getString("MODEL_PRTY"), "predef_grp_comment");
             MoveOptionsDialog.ListBox(15, 131, 233, 170, [], "predef_ot_lb");//ot_predef_names ANUBIS entry 331692
             MoveOptionsDialog.ListBox(295, 131, 233, 170, [], "ot_lb");//ANUBIS entry 331692
             MoveOptionsDialog.ListBox(545, 131, 233, 170, [], "mt_lb");//ANUBIS entry 331692
             MoveOptionsDialog.PushButton(253, 191, 35, 16, ">", "add_ot_btn");
             MoveOptionsDialog.PushButton(253, 211, 35, 16, "<", "del_ot_btn");
             MoveOptionsDialog.PushButton(622, 305, 35, 16, "/\\", "up_btn");
             MoveOptionsDialog.PushButton(660, 305, 35, 16, "\\/", "down_btn");
             MoveOptionsDialog.CheckBox(10, 350, 240, 15, getString("SUBGROUP_COMMENT"), "subgroups_cb");*/
     MoveOptionsDialog.OKButton();
     MoveOptionsDialog.CancelButton();
     //  MoveOptionsDialog.HelpButton("HID_d10e4b80_8bc7_11dc_54ef_0014c2e1019c_dlg_01.hlp");  

     var dMoveOptionsDialog = Dialogs.createUserDialog(MoveOptionsDialog);
     CurrDlg = dMoveOptionsDialog;


     //the main group of the database is an initial value for a pre-defined group
     initFolder = baseGroup.Path(g_nloc); // (ArisData.getActiveDatabase().FindOID(FID)).Name(g_nloc);
     targetGroup = CurrDlg.getDlgText("VAR_TEXTBOX");
     if (targetGroup == null) {
         targetGroup = initFolder;
     } else {
         targetGroup = baseGroup.CreateChildGroup(targetGroup, g_nloc);
     }


     //loop until the user decides that all options are set
     //and switch between the main dialog and group selection dialog
     for (;;) {
         bShowGroupSelectionDialog = false;
         nMoveOptionsDialog = Dialogs.show(CurrDlg);
         // Displays dialog and waits for the confirmation with OK.
         if (nMoveOptionsDialog == 0) {
             return nMoveOptionsDialog;
         }
         //if the user decides to change the pre-defined group
         //he will get the group selection dialog

         if (bShowGroupSelectionDialog) {
             FID1 = FID;
             //OID of a group selected by user
             FID = Dialogs.BrowseArisItems(getString("SCRIPT_NAME"),
                 getString("SELECT_PREDEF_GROUP"),
                 ArisData.getActiveDatabase().ServerName(),
                 ArisData.getActiveDatabase().Name(g_nloc),
                 Constants.CID_GROUP);
             //user pressed Cancel in the BrowseArisItems dialog
             // - so we restore the previous OID
             if (FID == "") FID = FID1;
             //predefined group to place objects
            // initFolder = (ArisData.getActiveDatabase().FindOID(FID)).Name(g_nloc);
             initFolder = getTargetGroup(FID);
             continue;
         }
         break;
     }
     TargetGroup = CurrDlg.getDlgText("VAR_TEXTBOX");
     return nMoveOptionsDialog;
 }

  function getTargetGroup(sStr) {
     var arr = sStr.split(";");
     for (var i = 0; i < arr.length; i++) {
         var oTargetGroup = ArisData.getActiveDatabase().FindOID(arr[i]);

         if (oTargetGroup.KindNum() == Constants.CID_GROUP){
            targetGroup = oTargetGroup;
            return oTargetGroup.Path(g_nloc);
         }
     } //for
 }
 
 //function for processing the main dialog events
 function ProcessMoveOptionsDlgEvents(dlgitem, action, suppvalue) {

     switch (action) {
         case 1:
             //after folder selection or during the first displaying of the dialog
             CurrDlg.setDlgText("pre_def_group_tb", initFolder);
             break;
             return false;
         case 2:
             switch (dlgitem) {
                 //object types listbox   
                 case "subgroups_cb":
                     bRecurs = (CurrDlg.getDlgValue(dlgitem) == 1);
                     return false;
                 case "ot_lb":
                     ind = CurrDlg.getDlgValue("ot_lb");
                     //set a list of model names correspondent to selected object type name
                     CurrDlg.setDlgListBoxArray("mt_lb", mt_pref_names[ind]);
                     //select 1st line in the model types listbox
                     if (mt_lb_names.length > 0) CurrDlg.setDlgValue("mt_lb", 0);
                     //and enable/disable up/down buttons 
                     //according to number of model listbox strings
                     SetModelDialogButtons();
                     return true;
                     break;
                 case "OK":
                     return false;
                     break;
                 case "Cancel":
                     CancelIsPressed = true;
                     return false;
                     break;
                 case "predef_grp_btn":
                     //open a groupselectiondialog 
                     bShowGroupSelectionDialog = true;
                     return false;
                     break;
                     /*  case "up_btn":
                           //selected object and model name
                           o_mt = CurrDlg.getDlgValue("ot_lb");
                           n_mt = CurrDlg.getDlgValue("mt_lb");
                           mt_lb_names = CurrDlg.getDlgListBoxArray("mt_lb");
                           if (n_mt > 0) {
                               //move a model name up in the model list
                               mt_lb_names1 = MoveItemUpDown(mt_lb_names, n_mt, true);
                               //refill the model listbox and change selection 
                               CurrDlg.setDlgListBoxArray("mt_lb", mt_lb_names1);
                               CurrDlg.setDlgValue("mt_lb", n_mt - 1);
                               //renew arrays of model order preference according to current listbox data
                               mt_pref_names[o_mt] = mt_lb_names1;
                               mt_pref_numbers[o_mt] = CorrelateNumbersToNames(mt_lb_names, Constants.CID_MODEL);
                           }
                           SetModelDialogButtons();
                           return true;
                           break;
                       case "down_btn":
                           //selected object and model name
                           o_mt = CurrDlg.getDlgValue("ot_lb");
                           n_mt = CurrDlg.getDlgValue("mt_lb");
                           mt_lb_names = CurrDlg.getDlgListBoxArray("mt_lb");
                           if (n_mt < mt_lb_names.length - 1) {
                               //move a model name down in the model list
                               mt_lb_names1 = MoveItemUpDown(mt_lb_names, n_mt, false);
                               //refill the model listbox and change selection 
                               CurrDlg.setDlgListBoxArray("mt_lb", mt_lb_names1);
                               CurrDlg.setDlgValue("mt_lb", n_mt + 1);
                               //renew arrays of model order preference according to current listbox data
                               mt_pref_names[o_mt] = mt_lb_names1;
                               mt_pref_numbers[o_mt] = CorrelateNumbersToNames(mt_lb_names, Constants.CID_MODEL);
                           }
                           SetModelDialogButtons();
                           return true;
                           break;
                       case "add_ot_btn":
                           //current data in both object listboxes
                           var n_ot = CurrDlg.getDlgValue("predef_ot_lb");
                           if (n_ot < 0) n_ot = 0; // BLUE-5310 - Set selection in the left list box (= list box with objects to be moved to the selected target group)              
                           ot_predef_names = CurrDlg.getDlgListBoxArray("predef_ot_lb");
                           ot_pref_names = CurrDlg.getDlgListBoxArray("ot_lb");
                           //add selected obj name from the predefined list of object types
                           //to the list of object types to be moved
                           new_name = ot_predef_names[n_ot];
                           ot_pref_names.push(new_name);
                           //and delete it from the predefined list of object types  
                           ot_predef_names.splice(n_ot, 1);
                           //sort both lists alphabetically
                           ot_pref_names.sort(SortByJSstring);
                           ot_predef_names.sort(SortByJSstring);
                           //renew listboxes and selections
                           CurrDlg.setDlgListBoxArray("ot_lb", ot_pref_names);
                           CurrDlg.setDlgListBoxArray("predef_ot_lb", ot_predef_names);
                           CurrDlg.setDlgValue("predef_ot_lb", Math.min(n_ot, ot_predef_names.length - 1));
                           ot_pref_numbers = CorrelateNumbersToNames(ot_pref_names, Constants.CID_OBJDEF);
                           ot_predef_numbers = CorrelateNumbersToNames(ot_predef_names, Constants.CID_OBJDEF);
                           //renew model type preference arrays             
                           ot_num = FindElementInArray(ot_pref_names, new_name);
                           CurrDlg.setDlgValue("ot_lb", Math.max(0, ot_num));
                           // setiings for model lisbox and lists of model number priorities
                           if (ot_num >= 0) {
                               mt_lb_names = SetStringsForModelListbox(ot_pref_numbers[ot_num]);
                               CurrDlg.setDlgListBoxArray("mt_lb", mt_lb_names);
                               CurrDlg.setDlgValue("mt_lb", 0);
                               SetModelDialogButtons();
                               if (mt_lb_names.length >= 0) {
                                   mt_lb_numbers = CorrelateNumbersToNames(mt_lb_names, Constants.CID_MODEL);
                                   mt_pref_numbers.splice(ot_num, 0, mt_lb_numbers);
                                   mt_pref_names.splice(ot_num, 0, mt_lb_names);
                               }
                           }
                           //enable/disable buttons    
                           CurrDlg.setDlgEnable("del_ot_btn", true);
                           if (ot_predef_numbers.length <= 0) CurrDlg.setDlgEnable("add_ot_btn", false);
                           return true;
                           break;
                       case "del_ot_btn":
                           //current data in both object listboxes
                           ot_predef_names = CurrDlg.getDlgListBoxArray("predef_ot_lb");
                           ot_pref_names = CurrDlg.getDlgListBoxArray("ot_lb");
                           var n_ot1 = CurrDlg.getDlgValue("ot_lb");
                           //insert selected obj type to the list of predefined object types 
                           new_name = ot_pref_names[n_ot1];
                           ot_predef_names.push(new_name);
                           //and delete it from the  list of object types to be moved to models
                           ot_pref_names.splice(n_ot1, 1);
                           //and delete this from model type lists, too
                           mt_pref_names.splice(n_ot1, 1);
                           mt_pref_numbers.splice(n_ot1, 1);
                           //sort both lists alphabetically
                           //ot_pref_names.sort(SortByJSstring);       
                           ot_predef_names.sort(SortByJSstring);
                           //renew listboxes and selections
                           CurrDlg.setDlgListBoxArray("ot_lb", ot_pref_names);
                           CurrDlg.setDlgListBoxArray("predef_ot_lb", ot_predef_names);
                           CurrDlg.setDlgSelection("predef_ot_lb", 0); // BLUE-5310 - Set selection in the left list box (= list box with objects to be moved to the selected target group)
                           newnum = Math.min(n_ot1, ot_pref_names.length - 1)
                           CurrDlg.setDlgValue("ot_lb", newnum);
                           ot_pref_numbers = CorrelateNumbersToNames(ot_pref_names, Constants.CID_OBJDEF);
                           ot_predef_numbers = CorrelateNumbersToNames(ot_predef_names, Constants.CID_OBJDEF);
                           //renew model listbox and buttons
                           if (ot_pref_numbers.length > 0) {
                               ind = CurrDlg.getDlgValue("ot_lb");
                               //set a list of model names correspondent to selected object type name
                               //bug fixed here - N.E.
                               CurrDlg.setDlgListBoxArray("mt_lb", mt_pref_names[ind]);
                           } else {
                               CurrDlg.setDlgListBoxArray("mt_lb", []);
                               CurrDlg.setDlgEnable("del_ot_btn", false);
                           }
                           CurrDlg.setDlgEnable("add_ot_btn", true);
                           //renew model type preference arrays 
                           SetModelDialogButtons();
                           return true;
                           break;*/
                 case "mt_lb":
                     SetModelDialogButtons();
                     return false;
                     break;
             }
             break;
     }
     return false;
 }


 ////////////////////////////////////////////////////////////////
 //Logger-Implementierung
 function AUDI_Logger() {
     try {
         // init logger - custom configuration properties (without properties file)
         _logger = Logger.getLogger("com.audi.report.logging.VariantCopy");
         _logger.setUseParentHandlers(false);
         var handler = new java.util.logging.FileHandler("D:/log/VariantCopy%g.log", 50000, 3, true)
         handler.setFormatter(new java.util.logging.SimpleFormatter());
         _logger.addHandler(handler);
         _logger.info(getString("LOG_1"));
         //Aufruf der Main-Methode

         // try{
         main();
         // }
         // catch(e){
         // Dialogs.MsgBox(e);
         // Dialogs.MsgBox(getString("TEXT_30"), Constants.MSGBOX_BTN_OK|Constants.MSGBOX_ICON_ERROR|0, getString("LOG_3"));
         // }
         _logger.info(getString("LOG_2"));
         handler.close();
         handler.flush();

     } catch (e) {
         var sMessage = getString("LOG_3");
         if (e instanceof String || e instanceof java.lang.String) {
             sMessage = e;
         } else {
             if (e.lineNumber)
                 sMessage = sMessage + ", line " + e.lineNumber;

             sMessage = sMessage + ": ";
             if (e.toString)
                 sMessage = sMessage + e.toString();
             else sMessage = sMessage + e;
         }
         if (null != _logger) {
             _logger.info(sMessage);
             Dialogs.MsgBox(sMessage);
         } else Dialogs.MsgBox(sMessage);

     } finally {
         // close logger
         if (null != _logger) {
             _logger.info(getString("LOG_3"));
         }
         // shutdown active loggers
         Logger.closeLogger();
     }
 }

/*Get a base group*/
 function init() {
     if (oModels.length > 0) {
         baseGroup = oModels[0].Group();
     }
     if (oObjDefs.length > 0) {
         baseGroup = oObjDefs[0].Group();
     }
     if (oOccs.length > 0) {
         baseGroup = oOccs.ObjDef()[0].Group();
     }
     FID = baseGroup.ObjectID();
 }
/*core*/
 function makeaVariantCopy() {

     if (oModels != null) { //user selected models
         for (var lz1 = 0; lz1 < oModels.length; lz1++) {
             var oModel = oModels[lz1];
             var oModGroup = oModel.Group();
             Context.addActionResult(Constants.ACTION_UPDATE, "", oModGroup);

             // var oAudi_HelperClass = new Audi_HelperClass();
             // if (!oModGroup.IsEqual(oTempGroup) && oAudi_HelperClass.checkRights(oModGroup, oActUser, Constants.AR_WRITE)) {
             //   _logger.info(oModel.Name(g_nLoc) + getString("TEXT_27"));


             var result = oMerge.createVariant([oModels[lz1]], targetGroup);
             outfile.OutputLnF("Vartinatní kopie status: " + " \n" + result + "\n" + "Target group: " + targetGroup.Path(g_nloc), "LOG");
             //  } else {
             //       Dialogs.MsgBox("No rights to write");
             //  }
         }
     }

     if (oObjDefs != null) { //user selected objs
         var objDefsArr = new Array();
         oObjDefs.sort(new ArraySortComparator(Constants.SORT_OBJDEF_NAME, Constants.SORT_NONE, Constants.SORT_NONE, g_nloc).compare);
         for (var j = 0; j < oObjDefs.length; j++) {
             var result = oMerge.createVariant([oObjDefs[j]], targetGroup);
             outfile.OutputLnF("Vartinatní kopie status: " + " \n" + result + "\n" + "Target group: " + targetGroup.Path(g_nloc), "LOG");
         }
     }
 }
 AUDI_Logger();