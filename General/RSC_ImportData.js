/****************************************************************************************************************/
/*  Author:         RV                                                                                          */
/*  Organisation:   IDS Scheer AG/Software AG                                                                   */
/*  Year:           2011                                                                                        */  
/*  Organisation:   Input model infromation                                                                    */                                                                                                                 
/****************************************************************************************************************/

var file  = "Report_RSC.xls"; 
var g_nloc;
var outfile;
var statusOK = false;
main();
var poleModelu=new Array();
function main()
{
    g_nloc = Context.getSelectedLanguage();  
    outlog = Context.createOutputObject(Constants.OUTTEXT, "LOG.TXT"); //logovaci soubor
    outlog.Init(g_nloc);
    outlog.DefineF(file, "Arial", 10, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_LEFT, 0, 21, 0, 0, 0, 1);
    
    var oDatabase = ArisData.getActiveDatabase();    
    var importfile = Dialogs.getFilePath(Context.getSelectedPath() + file,"*.xls","","Select all files to be openend",0);

    if ((importfile != null) ) { // if Excel file is selected

        poleModelu=oDatabase.Find(Constants.SEARCH_MODEL);  
        
        var xlsReader = Context.getExcelReader(importfile[0].getData());           
        var xlsSheets = xlsReader.getSheets();
        var xlsReviewSheet = xlsSheets[0];
        var iCurrentRow=1;
        
        var name,creator,description;        
        while (xlsReviewSheet.getCell(iCurrentRow,0) != null) //go through Excel list
        {
            name      = xlsReviewSheet.getCell(iCurrentRow,0).getCellValue();
            creator   = xlsReviewSheet.getCell(iCurrentRow,1).getCellValue();
            description = xlsReviewSheet.getCell(iCurrentRow,2).getCellValue();
 

                for (var i=0 ; i<poleModelu.length; i++ ) 
                {
                if(poleModelu[i].Name(g_nloc)==name)
                {
                         statusOK = true;
                         var attr = poleModelu[i].Attribute(1009, g_nloc);
                         if(attr == ""){
                                Dialogs.MsgBox(getString("TEXT_3") +name + neobsahuje , Constants.MSGBOX_ICON_INFORMATION , Context.getScriptInfo(Constants.SCRIPT_NAME) );
                                statusOK = false; break;
                         }
                            attr.setValue(creator); // set descripiton
                         
                         
                         var attr = poleModelu[i].Attribute(9, g_nloc);
                         if(attr == ""){
                                Dialogs.MsgBox(getString("TEXT_3") +name + neobsahuje , Constants.MSGBOX_ICON_INFORMATION , Context.getScriptInfo(Constants.SCRIPT_NAME) );
                                statusOK = false; break;
                         }
                            attr.setValue(description); // set descripiton
                                                    
                }
            }
             iCurrentRow++;
        }// end while
    }//end if         
         ResultDialog(statusOK);
}


function ResultDialog(statusOK)
{
    if(statusOK == true){
    //ok dialog
     var cestaKsouboru = Context.getSelectedPath();                                            
            Dialogs.MsgBox(getString("TEXT_1") +Context.getScriptInfo(Constants.SCRIPT_NAME)+getString("TEXT_2"), Constants.MSGBOX_ICON_INFORMATION , Context.getScriptInfo(Constants.SCRIPT_NAME) );                                        
        }else{
            Dialogs.MsgBox(getString("TEXT_6"), Constants.MSGBOX_ICON_INFORMATION , Context.getScriptInfo(Constants.SCRIPT_NAME) );                                              
        }
}