// Config
var aFilter = ArisData.ActiveFilter();  
Context.setProperty("excel-formulas-allowed", false); //default value is provided by server setting (tenant-specific): "abs.report.excel-formulas-allowed" 
  
const SYM_HEADER = aFilter.UserDefinedSymbolTypeNum("7e92f051-99b8-11e6-4183-000c293052e4") //Model Header symbol - main symbol (container)
const SYM_DOCKNWLDG_HEADER = aFilter.UserDefinedSymbolTypeNum("7163ae60-f60e-11e3-01aa-002264fa4604"); //Model Header - nested object Documented knwldg symbol
const TYPY_UKAZATELE = 2062; //aFilter.UserDefinedSymbolTypeNum("317baa2f-7df8-11da-0c60-cf8e338f9a0b"); //Model Header - nested object Documented knwldg symbol

const SYM_FUNKCNI_MISTO = aFilter.UserDefinedSymbolTypeNum("bf0be63d-40ae-4b93-9f18-8076c80a502b"); //Model Header - nested object Documented knwldg symbol
const SYM_ORG_JEDNOTKA = aFilter.UserDefinedSymbolTypeNum("a2de3df1-e4f2-4369-a2ef-d00cbf68022e"); //Model Header - nested object Documented knwldg symbol

    
    
function styles(outfile){
    outfile.DefineF("REPORT1", "Arial", 24, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_BOLD | Constants.FMT_CENTER, 0, 21, 0, 0, 0, 1);
    outfile.DefineF("REPORT2", "Arial", 14, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_LEFT, 0, 21, 0, 0, 0, 1);
    outfile.DefineF("REPORT3", "Arial", 8, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_LEFT, 0, 21, 0, 0, 0, 1);

    outfile.DefineF("RULE_HEADER", "Arial", 10, Constants.C_WHITE,  setColor(249,72,0),  Constants.FMT_BOLD | Constants.FMT_CENTER | Constants.FMT_VTOP, 0, 21, 0, 0, 0, 1);    
    outfile.DefineF("RULE_HEADER_LEFT", "Arial", 10, Constants.C_WHITE,  setColor(249,72,0),  Constants.FMT_BOLD | Constants.FMT_LEFT | Constants.FMT_VTOP, 0, 21, 0, 0, 0, 1);    
    
    outfile.DefineF("TABLE_CELL", "Arial", 10, Constants.C_BLACK, Constants.C_WHITE, Constants.FMT_CENTER | Constants.FMT_VTOP, 0, 21, 0, 0, 0, 1);    
    outfile.DefineF("TABLE_CELL_LEFT", "Arial", 10, Constants.C_BLACK, Constants.C_WHITE,  Constants.FMT_LEFT | Constants.FMT_VTOP, 0, 21, 0, 0, 0, 1);    
    outfile.DefineF("TABLE_CELL_LEFT_RED", "Arial", 10, Constants.C_BLACK, Constants.C_RED,  Constants.FMT_LEFT | Constants.FMT_VTOP, 0, 21, 0, 0, 0, 1);    
    
    //outfile.DefineF("TABLE_CELL_BOLD", "Arial", 10, Constants.C_GREY_80_PERCENT, Constants.C_WHITE, Constants.FMT_BOLD | Constants.FMT_LEFT | Constants.FMT_VTOP, 0, 21, 0, 0, 0, 1);    
   
    outfile.DefineF("TABLE_CELL_GREY_CENTER", "Arial", 10, Constants.C_GREY_80_PERCENT, Constants.C_WHITE, Constants.FMT_CENTER | Constants.FMT_VTOP, 0, 21, 0, 0, 0, 1);    
    outfile.DefineF("TABLE_CELL_GREY", "Arial", 10, Constants.C_GREY_80_PERCENT, Constants.C_WHITE, Constants.FMT_LEFT | Constants.FMT_VTOP, 0, 21, 0, 0, 0, 1);    
    outfile.DefineF("TABLE_CELL_GREEN", "Arial", 10, Constants.C_BLACK, Constants.C_GREEN,  Constants.FMT_CENTER | Constants.FMT_VTOP,  0, 21, 0, 0, 0, 1);    
    outfile.DefineF("TABLE_CELL_RED", "Arial", 10, Constants.C_BLACK, Constants.C_RED, Constants.FMT_CENTER | Constants.FMT_VTOP, 0, 21, 0, 0, 0, 1);    
    outfile.DefineF("TABLE_CELL_ORANGE", "Arial", 10, Constants.C_BLACK, Constants.C_ORANGE, Constants.FMT_CENTER | Constants.FMT_VTOP, 0, 21, 0, 0, 0, 1);    
    outfile.DefineF("TABLE_CELL_LEFT_ORANGE", "Arial", 10, Constants.C_BLACK, Constants.C_ORANGE, Constants.FMT_LEFT | Constants.FMT_VTOP, 0, 21, 0, 0, 0, 1);    
}    