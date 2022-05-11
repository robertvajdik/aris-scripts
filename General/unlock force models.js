 /**
  * @fileoverview
  * Force unlock models
  *
  * @author <a href="mailto:robert.vadjdik@idsa.cz">Robert Vajdik</a><br>
  * @version 1.1 : -> 20190227 
  *                   
  */
  
 var g_Output = Context.createOutputObject();
 var g_loc = Context.getSelectedLanguage();
 var models = ArisData.getSelectedModels()
 var models_asSystem = new Array();

 var oLockComp = Context.getComponent("Locking");

 outfile = Context.createOutputObject(Constants.OUTTEXT, Context.getSelectedFile());
 outfile.Init(g_loc);
 outfile.DefineF("LOG", "Arial", 10, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_LEFT, 0, 21, 0, 0, 0, 1);
 outfile.DefineF("REPORT1", "Arial", 24, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_BOLD | Constants.FMT_CENTER, 0, 21, 0, 0, 0, 1);
 outfile.DefineF("REPORT2", "Arial", 14, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_LEFT, 0, 21, 0, 0, 0, 1);
 outfile.DefineF("REPORT3", "Arial", 8, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_LEFT, 0, 21, 0, 0, 0, 1);
 outfile.OutputLnF("----Script for unlocking models and objects of models---", "LOG");
 setReportHeaderFooter(outfile, g_loc, true, true, true);



 var DB = ArisData.getActiveDatabase();
 if (ArisData.ActiveUser().Name(-1) != "system") { //under Entire Method
     var db_admin = ArisData.openDatabase(DB.Name(-1), "system", "{encrypted}06cdb9c114172e87f8002735e319b28b", "dd838074-ac29-11d4-85b8-00005a4053ff", Context.getSelectedLanguage(), false);

     for (var m = 0; m < models.length; m++) {
         var sGUID = models[m].GUID();
         var foundModel = db_admin.FindGUID(sGUID, Constants.CID_MODEL);
         if (foundModel != null)
             models_asSystem.push(foundModel);
     }

 }

 function main() {
     if (models_asSystem.length > 0)
         models = models_asSystem

     for (var i = 0; i < models.length; i++) {
         var model = models[i];
         var allObjDefs = model.ObjDefList();
         var lockowner = model.getLockOwner();

         var lockInfo = oLockComp.getLockInfo(model);

         var groupName = lockInfo.getGroupName();
         var lockState = lockInfo.getLockState(); // 0unlock,1 model,2 include objectes
         var lockname = lockInfo.getName();

         outfile.OutputLnF("Model: " + model.Name(g_loc), "LOG");
         outfile.OutputLnF("  Model Owner: " + lockowner, "LOG");
         outfile.OutputLnF("  Group Name: " + groupName, "LOG");
         outfile.OutputLnF("  Lock State: " + lockState, "LOG");

         if (lockState == 1) {
             var unlockResult = oLockComp.unlock(model, true);
             if (unlockResult.Success()) {
                 outfile.OutputLnF("  ----Model was unlock--- ", "LOG");
             } else {
                 var errorCode = unlockResult.getErrorCode();
                 var errorMessage = unlockResult.getErrorMessage();
                 var faiedItemsInfo = unlockResult.getFailedItemsInfo();
                 var failedModelsInfo = unlockResult.getFailedModelsInfo();
                 var failedObjDefsInfo = unlockResult.getFailedObjDefsInfo();

                 outfile.OutputLnF("  Model errorCode: " + errorCode, "LOG");
                 outfile.OutputLnF("  Model errorMessage: " + errorMessage, "LOG");
                 outfile.OutputLnF("  Model faiedItemsInfo: " + faiedItemsInfo.getErrorMessage(), "LOG");
                 outfile.OutputLnF("  Model failedModelsInfo: " + failedModelsInfo.getErrorMessage(), "LOG");
                 outfile.OutputLnF("  Model failedObjDefsInfo: " + failedObjDefsInfo.getErrorMessage(), "LOG");
             }
         }


         if (lockState == 2) {

             var unlockResult = oLockComp.unlock(model, true);
             if (unlockResult.Success()) {
                 outfile.OutputLnF("  ----Model was unlock--- ", "LOG");
             } else {
                 outfile.OutputLnF("  ----Error in Model--- ", "LOG");
                 var errorCode = unlockResult.getErrorCode();
                 var errorMessage = unlockResult.getErrorMessage();
                 var faiedItemsInfo = unlockResult.getFailedItemsInfo();
                 var failedModelsInfo = unlockResult.getFailedModelsInfo();
                 var failedObjDefsInfo = unlockResult.getFailedObjDefsInfo();

                 outfile.OutputLnF("  Model errorCode: " + errorCode, "LOG");
                 outfile.OutputLnF("  Model errorMessage: " + errorMessage, "LOG");
                 outfile.OutputLnF("  Model faiedItemsInfo: " + faiedItemsInfo.getErrorMessage(), "LOG");
                 outfile.OutputLnF("  Model failedModelsInfo: " + failedModelsInfo.getErrorMessage(), "LOG");
                 outfile.OutputLnF("  Model failedObjDefsInfo: " + failedObjDefsInfo.getErrorMessage(), "LOG");
             }

             allObjDefs = ArisData.sort(allObjDefs, Constants.AT_NAME, Context.getSelectedLanguage())
             for (var o = 0; o < allObjDefs.length; o++) {
                 outfile.OutputLnF("  Object: " + allObjDefs[o].Name(g_loc), "LOG");

                 var unlockResult = oLockComp.unlock(allObjDefs[o], true);
                 if (unlockResult.Success()) {
                     outfile.OutputLnF("  ----Object was unlock--- ", "LOG");
                 } else {
                     outfile.OutputLnF("  ----Error in Object--- ", "LOG");
                     var errorCode = unlockResult.getErrorCode();
                     var errorMessage = unlockResult.getErrorMessage();
                     // var faiedItemsInfo = unlockResult.getFailedItemsInfo();
                     // var failedModelsInfo = unlockResult.getFailedModelsInfo();
                     // var failedObjDefsInfo = unlockResult.getFailedObjDefsInfo();

                     outfile.OutputLnF("  Object errorCode: " + errorCode, "LOG");
                     outfile.OutputLnF("  Object errorMessage: " + errorMessage, "LOG");
                     //   outfile.OutputLnF("  Model faiedItemsInfo: " + faiedItemsInfo.getErrorMessage  ( ) , "LOG");
                     //  outfile.OutputLnF("  Model failedModelsInfo: " + failedModelsInfo.getErrorMessage  ( ) , "LOG");
                     //  outfile.OutputLnF("  Model failedObjDefsInfo: " + failedObjDefsInfo.getErrorMessage  ( ) , "LOG");
                 }
             }
         }
     }
     outfile.WriteReport(Context.getSelectedPath(), Context.getSelectedFile());
 }

 main();