//Convert type of model
//RV 2016 09
//added createOcc allow diagonals
//added cxnOcc setLineStyle
var DIALOG_MODE = Context.getEnvironment().equals(Constants.ENVIRONMENT_STD);
var g_loc = Context.getSelectedLanguage(); // Variable for determining the ID of the current language.

//var sourceTypeModel  = Constants.MT_VAL_ADD_CHN_DGM];
var destTypeModel = Constants.MT_EEPC;
var modelPrefix = "OLD_VACD ";
var symbolRule1 = [105, 335]; // convert symbol

var cxnRule1 = [118, 118]; // predchazi(is predecessor of) >> predchazi(is predecessor of)
var cxnRule2 = [39, 663]; // je procesne nadrizen >> vymenuje informace s
var counter = 0;

function main() {
    var outfile = Context.createOutputObject(Constants.OUTTEXT, Context.getSelectedFile());
    outfile.Init(g_loc);
    outfile.DefineF("LOG", "Arial", 10, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_LEFT, 0, 21, 0, 0, 0, 1);
    outfile.DefineF("REPORT1", "Arial", 24, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_BOLD | Constants.FMT_CENTER, 0, 21, 0, 0, 0, 1);
    outfile.DefineF("REPORT2", "Arial", 14, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_LEFT, 0, 21, 0, 0, 0, 1);
    outfile.DefineF("REPORT3", "Arial", 8, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_LEFT, 0, 21, 0, 0, 0, 1);
    setReportHeaderFooter(outfile, g_loc, true, true, true);

    var models = ArisData.getSelectedModels();
    if (models.length > 0) {

        for (var m = 0; m < models.length; m++) {
            var model = models[m];
            var source_model_name = model.Name(g_loc);
            var source_model_nameCZ = model.Name(1029);
            var source_model_nameDE = model.Name(1031);
            var source_model_nameUS = model.Name(1033);
            var source_model_nameEng = model.Name(2057);
            if (source_model_name.indexOf(modelPrefix) > -1) { //skip prefix
                model.Attribute(Constants.AT_NAME, g_loc).setValue(source_model_nameCZ);
                model.Attribute(Constants.AT_NAME, g_loc).setValue(source_model_nameDE);
                model.Attribute(Constants.AT_NAME, g_loc).setValue(source_model_nameUS);
            } else {
                model.Attribute(Constants.AT_NAME, g_loc).setValue(modelPrefix + source_model_nameCZ);
                model.Attribute(Constants.AT_NAME, g_loc).setValue(modelPrefix + source_model_nameDE);
                model.Attribute(Constants.AT_NAME, g_loc).setValue(modelPrefix + source_model_nameUS);
            }
            outfile.OutputLnF("Source Model [TypeNum]: " + model.Name(g_loc) + "[" + model.TypeNum() + "]", "LOG");

            var objDefs_VACD = model.ObjDefList();
            var occs_source_Model = model.ObjOccList();
            var gfxObjs = model.getGfxObjects();
            var superObjs = model.getSuperiorObjDefs();
            var comObjOccs = model.ComObjOccs();
            var textOccList = model.TextOccList();
            var grid = model.getGrid();
            var bgColor = model.getBgColor()


            var group = model.Group();
            // var groupName = "_"+group.Name(g_loc)+"_EPC";
            // var subgroup = group.CreateChildGroup ( groupName,  g_loc ) ;
            var source_model_name = source_model_name.replace(modelPrefix, "");
            var model_EPC = group.CreateModel(destTypeModel, source_model_name, g_loc);
            counter++;
            if (model_EPC != null)
                outfile.OutputLnF("Create Destination Model [TypeNum]: " + model_EPC.Name(g_loc) + "[" + model_EPC.TypeNum() + "]", "LOG");

            model_EPC.setGrid(grid);
            model_EPC.setBgColor(bgColor);

            var cxnHashMap = new Packages.java.util.HashMap();
            var cxnGUIDHashMap = new Packages.java.util.HashMap();
            var matrixObjsGUIDtoNewOcc = new Packages.java.util.HashMap();

            occs_source_Model = ArisData.sort(occs_source_Model, Constants.SORT_X, Constants.SORT_Y, g_loc);
            for (var i = 0; i < occs_source_Model.length; i++) {
                var occSource = occs_source_Model[i];
                var sourcGUID = occs_source_Model[i].ObjDef().GUID();
                var sourceName = occSource.ObjDef().Name(-1);
                var symbolNum = occSource.SymbolNum();
                var objDefVACD = occSource.ObjDef();
                var iX = occSource.X();
                var iY = occSource.Y();
                var width = occSource.Width()
                var heigth = occSource.Height();
                var zOrder = occSource.getZOrder();
                var cxns = occSource.CxnOccList();

                //style of occ
                var attrOccSource = occSource.AttrOcc(Constants.AT_NAME);
                var fontStyleSource = attrOccSource.FontStyleSheet()
                var port = attrOccSource.GetPortOptions();

                if (symbolNum == symbolRule1[0]) {
                    symbolNum = symbolRule1[1];
                }

                var occDest = model_EPC.createObjOcc(symbolNum, objDefVACD, iX, iY, false, false);
                var fontStyle_default = ArisData.getActiveDatabase().defaultFontStyle();
                var oAttrOcc = occDest.AttrOcc(Constants.AT_NAME);
                if (occDest.IsValid()) {
                    occDest.SetSize(width, heigth);
                    occDest.setZOrder(zOrder);
                    // occDest.ObjDef().Attribute(Constants.AT_NAME,g_loc).setValue(source_model_name);

                    if (!oAttrOcc.Exist()) {
                        oAttrOcc.Create(port[0], fontStyleSource); //important !! deleted name in occ
                    }
                    //maping sourceOCC and newOcc
                    matrixObjsGUIDtoNewOcc.put(occSource, occDest);
                }
            }

            //create cxns outputs
            createCxnInDestModel(occs_source_Model, matrixObjsGUIDtoNewOcc, model_EPC);
            /*copy pictures*/
            //CopyOccList(textOccList, model_EPC); //only for ARIS 9.5.4 > 
            /*copy freetxts*/
            CopyOccList(textOccList, model_EPC);
        }
    }
    ArisData.getActiveDatabase().clearCaches(); // BLUE-5456

    outfile.OutputLnF("\nSelected models: " + models.length + " Copied models: " + counter, "LOG");
    outfile.OutputLnF("Script is done!", "LOG");
    outfile.WriteReport(Context.getSelectedPath(), Context.getSelectedFile());

    Dialogs.MsgBox("Hit F5 for refresh DB content.")
}






/*Create cxn between occs
*/

function createCxnInDestModel(occs_source_Model, matrixObjsGUIDtoNewOcc, model_EPC) {
    for (var r = 0; r < occs_source_Model.length; r++) {
        var occSource = occs_source_Model[r];
        var sourceName = occSource.ObjDef().Name(-1);
        var ocurrentobjdef = occSource.ObjDef()

        var arrCxnOut_TargetOccs = new Array();
        //var oCxnList = occSource.OutEdges(Constants.EDGES_ALL);
        var ocxnoccs = occSource.CxnOccList();

        if (ocxnoccs.length > 0) {
            ocxnoccs = ArisData.sort(ocxnoccs, Constants.AT_TYPE_6, Constants.SORT_NONE, Constants.SORT_NONE, g_loc);
            for (var j = 0; j < (ocxnoccs.length - 1) + 1; j++) {
                ocurrentcxnocc = ocxnoccs[j];
                ocurrentcxn = ocurrentcxnocc.CxnDef();
                var cxnOut_typNum = ocurrentcxnocc.CxnDef().TypeNum();

                // Current object = target object.
                if (ocurrentobjdef.IsEqual(ocurrentcxn.TargetObjDef())) {
                    true
                    // ooutfile.value.OutputLn(ocurrentcxn.PassiveType(), getString("TEXT21"), 12, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_LEFT, 30);
                    // ooutfile.value.OutputLn(ocurrentcxn.SourceObjDef().Type() + ": " + ocurrentcxn.SourceObjDef().Name(nloc), getString("TEXT21"), 12, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_LEFT, 40);
                }
                // Current object = source object.                          
                else {
                    //ooutfile.value.OutputLn(ocurrentcxn.ActiveType(), getString("TEXT21"), 12, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_LEFT, 30);
                    //  ooutfile.value.OutputLn(ocurrentcxn.TargetObjDef().Type() + ": " + ocurrentcxn.TargetObjDef().Name(nloc), getString("TEXT21"), 12, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_LEFT, 35);
                    var cxnOut_typNum = ocurrentcxnocc.CxnDef().TypeNum();
                    var cxnOut_Points = ocurrentcxnocc.getPoints();
                    var cxnOut_Occ = ocurrentcxnocc.TargetObjOcc();
                    var cxnOut_LineStyle = ocurrentcxnocc.getLineStyle();

                    if (cxnOut_typNum == cxnRule1[0]) { //change def type
                        cxnOut_typNum = cxnRule1[1];
                    }
                    if (cxnOut_typNum == cxnRule2[0]) { //change def type
                        cxnOut_typNum = cxnRule2[1];
                    }

                    arrCxnOut_TargetOccs.push(cxnOut_typNum, cxnOut_Points, ocurrentcxnocc.TargetObjOcc(), cxnOut_LineStyle);

                }
            }

            var occSourceInNewModel = matrixObjsGUIDtoNewOcc.get(occSource);
            for (var s = 0; s < arrCxnOut_TargetOccs.length; s += 4) {
                var new_cxnOut_typNum = arrCxnOut_TargetOccs[s];
                var new_cxnOut_Points = arrCxnOut_TargetOccs[s + 1];
                var new_cxnOut_Occ = arrCxnOut_TargetOccs[s + 2];
                var new_cxnOut_LineStyle = arrCxnOut_TargetOccs[s + 3];
                var occTargetInNewModel = matrixObjsGUIDtoNewOcc.get(new_cxnOut_Occ);

                // CreateCxnOcc ( boolean bCreateNewDef, ObjOcc ScrObjOcc, ObjOcc TrgObjOcc, int CxnType, Point[] PointList )  
                // var aCxnCreated = model_EPC.CreateCxnOcc(false, occSourceInNewModel,occTargetInNewModel,  new_cxnOut_typNum, new_cxnOut_Points);
                // CreateCxnOcc ( ObjOcc ScrObjOcc, ObjOcc TrgObjOcc, int CxnType, Point[] PointList, boolean bDiagonal, boolean bCreateNewDef ) 
                var aCxnCreated = model_EPC.CreateCxnOcc(occSourceInNewModel, occTargetInNewModel, new_cxnOut_typNum, new_cxnOut_Points, true, false);
                if (CxnCreated = null) {
                    //vazba nevytvorena
                    outfile.OutputLnF(" in: destinaton Model CxnOcc is not created! Between Source Occ:" + occSourceInNewModel.ObjDef().Name(g_loc) + " Targe Occ: " + occTargetInNewModel.ObjDef().Name(g_loc), "LOG");
                    return 0;
                } else {
                    var aLineStyleSet = aCxnCreated.setLineStyle(new_cxnOut_LineStyle);
                    if (!aLineStyleSet)
                        outfile.OutputLnF(" cannot setLineStyle  between cxn of source occ: " + occSourceInNewModel.ObjDef().Name(g_loc) + " and Targe Occ: " + occTargetInNewModel.ObjDef().Name(g_loc), "LOG");
                }
            }
        }
    }//for

}

/*copy Pictures*/
function copyPictures(comObjOccs, destModel) {

    for (var i = 0; i < comObjOccs.length; i++) {
        var comObjOcc = comObjOccs[i];
        var cX = comObjOcc.X();
        var cY = comObjOcc.Y();
        var image = comObjOcc.Image().getImageData(Constants.IMAGE_FORMAT_PNG);
        var imageType = comObjOcc.Type();

        //ARIS 9.5. SR4 or latest version
        destModel.createPicture(cX, cY, comObjOcc.Width(), comObjOcc.Height(), image, Constants.IMAGE_FORMAT_PNG)
    }
}

/*Create Occ List in model
FreeText Attr Text in model
*/

function CopyOccList(textOccList, destModel) {
    for (var t = 0; t < textOccList.length; t++) {
        var textOcc = textOccList[t];
        var textDef = textOcc.TextDef();
        var textOcc_ZOrder = textOcc.getZOrder();
        var displayAsPostIt = textOcc.getDisplayAsPostIt();
        var alignment = textOcc.getAlignment();

        var textOcc_X = textOcc.X();
        var textOcc_Y = textOcc.Y();

        var occText = destModel.CreateTextOcc(textOcc_X, textOcc_Y, textDef);
        if (occText != null) {
            var new_displayAsPostIt = occText.setDisplayAsPostIt(displayAsPostIt);
            //  var new_alignment  = textOcc.setAlignment(alignment);
        }
    }
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