//RD

main();

function main() {     
    var g_nLoc = Context.getSelectedLanguage();
    var aSelObjDefs=ArisData.getSelectedObjDefs();    
    var aSelObjOccs=ArisData.getSelectedObjOccs();    
  
    outfile = Context.createOutputObject(Constants.OUTTEXT, Context.getSelectedFile());
    outfile.Init(g_nLoc);
    outfile.DefineF("LOG", "Arial", 10, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_LEFT, 0, 21, 0, 0, 0, 1);
    outfile.DefineF("REPORT1", "Arial", 24, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_BOLD | Constants.FMT_CENTER, 0, 21, 0, 0, 0, 1);
    outfile.DefineF("REPORT2", "Arial", 14, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_LEFT, 0, 21, 0, 0, 0, 1);
    outfile.DefineF("REPORT3", "Arial", 8, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_LEFT, 0, 21, 0, 0, 0, 1);   
    setReportHeaderFooter(outfile, g_nLoc, true, true, true);

    var oObjDef=aSelObjDefs[0];
    var oObjOcc=aSelObjOccs[0];
    var sName=oObjDef.Name(g_nLoc);
    outfile.OutputLnF(sName,"LOG");        
    outfile.OutputLnF("Object type: " + oObjDef.TypeNum() + " - " + oObjDef.Type() + " - " + oObjDef.GUID(),"LOG");        
    outfile.OutputLnF("Symbol type: " + oObjOcc.getSymbol() + " - "+oObjOcc.SymbolName() + " - " + oObjOcc.getSymbolGUID(),"LOG");        
    outfile.OutputLnF("Default symbol type: " + oObjDef.getDefaultSymbolNum() + " - "  + oObjDef.getDefaultSymbolGUID(),"LOG");        

    outfile.OutputLnF("   connection in","LOG");            
    
    var aCnxs=oObjDef.CxnListFilter(Constants.EDGES_IN);  
    if (aCnxs.length>0) {
       for (var i=0;i<aCnxs.length;i++) {        
         var oCnx=aCnxs[i];
         sSourceName='"'+oCnx.SourceObjDef().Name(g_nLoc)+'"';
         outfile.OutputLnF("       "+oCnx.TypeNum()+": "+oCnx.ActiveType()+" - "+sSourceName,"LOG");        
       }  
    }    
    
    outfile.OutputLnF("   connection out","LOG");                
    
    var aCnxs=oObjDef.CxnListFilter(Constants.EDGES_OUT);  
    if (aCnxs.length>0) {
       for (var i=0;i<aCnxs.length;i++) {        
         var oCnx=aCnxs[i];
         sTargetName='"'+oCnx.TargetObjDef().Name(g_nLoc)+'"';         
         outfile.OutputLnF("       "+oCnx.TypeNum()+": "+oCnx.ActiveType()+" - "+sTargetName,"LOG");        
       }  
    }    
    
    outfile.OutputLnF("   connection assignment","LOG");                
    
    var aCnxs=oObjDef.CxnListFilter(Constants.EDGES_ASSIGN);  
    if (aCnxs.length>0) {
       for (var i=0;i<aCnxs.length;i++) {        
         var oCnx=aCnxs[i];
         sTargetName='"'+oCnx.TargetObjDef().Name(g_nLoc)+'"';         
         outfile.OutputLnF("       "+oCnx.TypeNum()+": "+oCnx.ActiveType()+" - "+sTargetName,"LOG");        
       }  
    }     
    
    outfile.OutputLnF("   assigned model","LOG");                
    
    var aModels=oObjDef.AssignedModels();
    if (aModels.length>0) {
       for (var i=0;i<aModels.length;i++) {        
         var oModel=aModels[i];
         sName='"'+oModel.Name(g_nLoc)+'"';         
         outfile.OutputLnF("       "+oModel.TypeNum()+": "+oModel.Type()+" - "+sName,"LOG");        
       }  
    }     

    outfile.OutputLnF("   supperior model","LOG");                
    
    var aObjOccs=oObjDef.OccList();
    if (aObjOccs.length>0) {
      for (var i=0 ; i<aObjOccs.length; i++ ){        
        var oModel=aObjOccs[i].Model();
        var aSupObjs=oModel.SuperiorObjDefs();
        if (aSupObjs.length>0) {
          for (j=0;j<aSupObjs.length;j++) {      
            var oSupObj=aSupObjs[j];
            var sSOName='"'+oSupObj.Name(g_nLoc)+'"';         
            outfile.OutputLnF("       "+oSupObj.TypeNum()+": "+oSupObj.Type()+" - "+sSOName,"LOG");        
            var aSupOcc=oSupObj.OccList();
            if (aSupOcc.length>0) {
              for (var k=0 ; k<aSupOcc.length; k++ ){        
                var oSupModel=aSupOcc[k].Model();
                sName='"'+oSupModel.Name(g_nLoc)+'"';         
                var sSymbol=" ("+aSupOcc[k].getSymbol()+" - "+aSupOcc[k].SymbolName()+") "
                outfile.OutputLnF("          "+oSupModel.TypeNum()+": "+oSupModel.Type()+" - "+sName+sSymbol,"LOG");                 
              }
            }  
          }       
        }     
      }
    }
   
    outfile.OutputLnF("   attributes","LOG");                
       
    aAttrs=oObjDef.AttrList(g_nLoc);
    if (aAttrs.length>0) {
       for (var i=0;i<aAttrs.length;i++) {        
           oAttr=aAttrs[i];
           sNam=oAttr.TypeNum();
           sVal='"'+oAttr.getValue()+'"';
           outfile.OutputLnF("       "+sNam+": "+sVal,"LOG");        
       }
    }   
    
    outfile.WriteReport(Context.getSelectedPath(), Context.getSelectedFile());
}   