/****************************************************************************************************************/
/*  Author:         RV                                                                                          */
/*  Organisation:   IDS Scheer AG/Software AG                                                                   */
/*  Year:           2011                                                                                        */  
/*  Organisation:   Output model infromation                                                                    */                                                                                                                 
/****************************************************************************************************************/

var file  = "Report_RSC.xls"; 
var g_nloc;
var outfile;
main();

function main()
{   
    g_nloc = Context.getSelectedLanguage();
    outfile = Context.createOutputObject(Context.getSelectedFormat(), file);
    outfile.Init(g_nloc);

    outfile.DefineF("REPORT1", "Arial", 24, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_BOLD | Constants.FMT_CENTER, 0, 21, 0, 0, 0, 1);
    outfile.DefineF("REPORT2", "Arial", 14, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_LEFT, 0, 21, 0, 0, 0, 1);
    outfile.DefineF("REPORT3", "Arial", 8, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_LEFT, 0, 21, 0, 0, 0, 1);

    //setReportHeaderFooter(outfile, g_nloc, true, true, true);

    // vystup    
    var omodels = new Array(); 
    var tmodels = ArisData.getSelectedModels();  
    var ogroups = ArisData.getSelectedGroups();

  
    if (ogroups.length > 0 || tmodels.length > 0) {
      if (tmodels.length > 0){
        for(var i=0; i<tmodels.length; i++) {
           omodels.push(tmodels[i]);  //vybrane modely
        }      
      } 
      for (var i=0 ; i<ogroups.length; i++ ){        
         GetModels(ogroups[i],omodels);        
      }
         outfile.BeginTable(100, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_LEFT, 0);
         outfile.TableRow();          
         outfile.TableCell(getString("TEXT_1"), 33, "Arial", 10, Constants.C_BLACK, Constants.C_LIGHT_BLUE, 0, Constants.FMT_BOLD | Constants.FMT_LEFT | Constants.FMT_VTOP, 0);                      
         outfile.TableCell(getString("TEXT_2"), 33, "Arial", 10, Constants.C_BLACK, Constants.C_LIGHT_BLUE, 0, Constants.FMT_BOLD | Constants.FMT_LEFT | Constants.FMT_VTOP, 0);                      
         outfile.TableCell(getString("TEXT_3"), 33, "Arial", 10, Constants.C_BLACK, Constants.C_LIGHT_BLUE, 0, Constants.FMT_BOLD | Constants.FMT_LEFT | Constants.FMT_VTOP, 0);                      
               
         
      if (omodels.length>0) {                
          omodels = ArisData.sort(omodels, Constants.AT_NAME, g_nloc);    // trideni modelu                   

           for (var i=0 ; i<omodels.length; i++ ) {
               var name = omodels[i].Attribute(1, g_nloc).getValue();        //name of model
               var creator = omodels[i].Attribute(1009, g_nloc).getValue(); //creator
               var description = omodels[i].Attribute(9, g_nloc).getValue(); //description
             
                outfile.TableRow(); 
                outfile.TableCell(name,    33, "Arial", 10, Constants.C_BLACK, Constants.C_WHITE, 0, Constants.FMT_BOLD | Constants.FMT_LEFT | Constants.FMT_VTOP, 0);                               
                outfile.TableCell(creator,  33, "Arial", 10, Constants.C_BLACK, Constants.C_WHITE, 0, Constants.FMT_BOLD | Constants.FMT_LEFT | Constants.FMT_VTOP, 0);                               
                outfile.TableCell(description,  33, "Arial", 10, Constants.C_BLACK, Constants.C_WHITE, 0, Constants.FMT_BOLD | Constants.FMT_LEFT | Constants.FMT_VTOP, 0);                               
              
                outfile.TableRow();

                }     
                //jmeno listu
                outfile.EndTable(getString("TEXT_4"), 100, "Arial", 12, Constants.C_GREY_50_PERCENT, Constants.C_TRANSPARENT, 0, Constants.FMT_LEFT | Constants.FMT_ITALIC, 0);
                outfile.WriteReport(Context.getSelectedPath(), Context.getSelectedFile());
        }  
      else  
            Dialogs.MsgBox(getString("TEXT_5") , Constants.MSGBOX_ICON_INFORMATION , Context.getScriptInfo(Constants.SCRIPT_NAME) );                              
    }
    else
            Dialogs.MsgBox(getString("TEXT_6") , Constants.MSGBOX_ICON_INFORMATION , Context.getScriptInfo(Constants.SCRIPT_NAME) );

    //ok dialog
    var cestaKsouboru = Context.getSelectedPath();                                            
    Dialogs.MsgBox(getString("TEXT_7") +Context.getScriptInfo(Constants.SCRIPT_NAME)+getString("TEXT_8")+cestaKsouboru+file, Constants.MSGBOX_ICON_INFORMATION , Context.getScriptInfo(Constants.SCRIPT_NAME) );
     
}

function GetModels(agroup,amodels)
// Vrátí modely pro zadanou skupinu, rekurzivní průchod do hloubky. 
// Vstup: startovací skupina - agroup a nadeklarované prázdné pole - amodels
// Výstupem je naplněné pole - amodels. 
{
   var ocurrmodels = agroup.ModelList();
   if (ocurrmodels.length>0) {
     for(var i=0; i<ocurrmodels.length; i++) {
       amodels.push(ocurrmodels[i]);  
     }    
   }

   var ochildren=agroup.Childs();
    if ((ochildren.length>0)) {
      for (var i=0; i<ochildren.length; i++ ) {
         GetModels(ochildren[i],amodels);
      }
    }  
}



