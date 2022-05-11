//config for semantic check

var SemanticCheckConfig = [
    commonSettings =  new Array({
        langId: Context.getSelectedLanguage(),
        tagName: "CEZ",
        ruleListVACDs: [1, 4, 7, 11, 12, 18, 20, 21, "22a", "22b", 23], //list of rules
        ruleListEPCs:  [1, 4, 5, 7, 8, 9, 11, 12, 18, 20, 21, "22a", "22b", 24],
        ruleListFADs:  [0, 7],
        
        VACD_models:[Constants.MT_VAL_ADD_CHN_DGM],
        EPC_models: [Constants.MT_EEPC, Constants.MT_EEPC_COLUMN, Constants.MT_EEPC_INST, Constants.MT_EEPC_MAT, Constants.MT_EEPC_ROW, Constants.MT_EEPC_TAB, Constants.MT_EEPC_TAB_HORIZONTAL],
        FAD_models:[Constants.MT_FUNC_ALLOC_DGM],
        
        okSymbol: "✓ ",
        koSymbol: "✗ ",
        warningSymbol: "!",                    
    })
];
      
    
var g_validTemplates = ["14912740-08b9-11da-2af9-00110a9e9e18", "3b558a10-0bfc-11df-60f7-002264fa4604", "30dee710-8131-11e0-5735-002170f7d593"];
        
function styles(outfile){
    outfile.DefineF("REPORT1", "Arial", 24, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_BOLD | Constants.FMT_CENTER, 0, 21, 0, 0, 0, 1);
    outfile.DefineF("REPORT2", "Arial", 14, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_LEFT, 0, 21, 0, 0, 0, 1);
    outfile.DefineF("REPORT3", "Arial", 8, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_LEFT, 0, 21, 0, 0, 0, 1);

    outfile.DefineF("RULE_HEADER", "Arial", 10, Constants.C_BLACK,  Constants.C_GREY_80_PERCENT,  Constants.FMT_BOLD | Constants.FMT_CENTER | Constants.FMT_VTOP, 0, 21, 0, 0, 0, 1);    
    outfile.DefineF("TABLE_CELL", "Arial", 10, Constants.C_BLACK, Constants.C_WHITE, Constants.FMT_CENTER | Constants.FMT_VTOP, 0, 21, 0, 0, 0, 1);    
    outfile.DefineF("TABLE_CELL_LEFT", "Arial", 10, Constants.C_BLACK, Constants.C_WHITE,  Constants.FMT_LEFT | Constants.FMT_VTOP, 0, 21, 0, 0, 0, 1);    
    //outfile.DefineF("TABLE_CELL_BOLD", "Arial", 10, Constants.C_GREY_80_PERCENT, Constants.C_WHITE, Constants.FMT_BOLD | Constants.FMT_LEFT | Constants.FMT_VTOP, 0, 21, 0, 0, 0, 1);    
   
    outfile.DefineF("TABLE_CELL_GREY_CENTER", "Arial", 10, Constants.C_GREY_80_PERCENT, Constants.C_WHITE, Constants.FMT_CENTER | Constants.FMT_VTOP, 0, 21, 0, 0, 0, 1);    
    outfile.DefineF("TABLE_CELL_GREY", "Arial", 10, Constants.C_GREY_80_PERCENT, Constants.C_WHITE, Constants.FMT_LEFT | Constants.FMT_VTOP, 0, 21, 0, 0, 0, 1);    
    outfile.DefineF("TABLE_CELL_GREEN", "Arial", 10, Constants.C_BLACK, Constants.C_GREEN,  Constants.FMT_CENTER | Constants.FMT_VTOP,  0, 21, 0, 0, 0, 1);    
    outfile.DefineF("TABLE_CELL_RED", "Arial", 10, Constants.C_BLACK, Constants.C_RED, Constants.FMT_CENTER | Constants.FMT_VTOP, 0, 21, 0, 0, 0, 1);    
    outfile.DefineF("TABLE_CELL_ORANGE", "Arial", 10, Constants.C_BLACK, Constants.C_ORANGE, Constants.FMT_CENTER | Constants.FMT_VTOP, 0, 21, 0, 0, 0, 1);    

}

var g_loc_CZ = 1029;
var g_loc_EN = 1033;
var g_loc_DE = 1031;

var OBJ_SYS = Constants.OT_APPL_SYS_TYPE;
var OBJ_ORG = Constants.OT_ORG_UNIT;
var OBJ_GRP = Constants.OT_GRP;
var OBJ_ROL = Constants.OT_PERS_TYPE;
var OBJ_DOC = Constants.OT_INFO_CARR;
var OBJ_SCR = Constants.OT_SCRN;
var OBJ_CLST = Constants.OT_CLST;
var OBJ_REQ = Constants.OT_REQUIREMENT;
const OBJ_DOC_KNWLDG = Constants.OT_DOC_KNWLDG;

//const symbolColor_Funkce = 9895830; //occ.getColor() //only green func
const symbolColor_Green = RGB(150, 255, 150);


var aFilter = ArisData.ActiveFilter();
var objectTypeName_SYS = aFilter.getItemTypeName(Constants.CID_OBJDEF, Constants.OT_APPL_SYS_TYPE);
var objectTypeName_CLST = aFilter.getItemTypeName(Constants.CID_OBJDEF, Constants.OT_CLST);
var objectTypeName_SCR = aFilter.getItemTypeName(Constants.CID_OBJDEF, Constants.OT_SCRN);
var objectTypeName_REQ = aFilter.getItemTypeName(Constants.CID_OBJDEF, OBJ_REQ);

//var attr_processLevel = getAttributNumber("eba01f80-0b57-11e8-375a-54ee7539b247");
//var attr_processLevel = VWAudiConstants.ATT_LEVEL; // Ebene


//const SYM_STAT = VWAudiConstants.SYM_STAT_OBJ;
const Symb_XOR = Constants.ST_OPR_XOR_1;
const Symb_OR = Constants.ST_OPR_OR_1;
const Symb_AND = Constants.ST_OPR_AND_1;
const SYM_PROCESS_INTERFACE = Constants.ST_PRCS_IF;
const SYM_PROCESS_INTERFACE2 = Constants.ST_PRCS_IF; //dummy
const SYM_Doc = Constants.ST_DOC;
const SYM_ORG = Constants.ST_POS // Position
const SYM_GRP = Constants.ST_PERS_EXT; //Person extern
const SYM_ROL = Constants.ST_JOB_DESC;
const SYM_SYS = Constants.ST_APPL_SYS_TYPE;
const SYM_EVT = Constants.ST_EV;

//const SYM_Process_Support = Constants.SYM_PS_SUPPORT;
//const SYM_Process_Control = Constants.SYM_PS_CONTROL;
const SYM_Process_WithHieararchy = Constants.ST_VAL_ADD_CHN_SML_2;
const SYM_Process_WithoutHieararchy = Constants.ST_VAL_ADD_CHN_SML_1;

//const SYM_Process_StepHierarchy = Constants.ST_FUNC_ACT; // Function (actual)
const SYM_Process_Step = Constants.ST_FUNCtot; // Prozessschritt
//const SYM_Process_Release = Constants.SYM_Freigabe; // Freigabe
//const SYM_MILESTONE = Constants.SYM_Milestone; //Milestone
const SYM_HEADER = aFilter.UserDefinedSymbolTypeNum("7e92f051-99b8-11e6-4183-000c293052e4") //Model Header symbol - main symbol (container)
const SYM_DOCKNWLDG_HEADER = aFilter.UserDefinedSymbolTypeNum("7163ae60-f60e-11e3-01aa-002264fa4604"); //Model Header - nested object Documented knwldg symbol
const TYPY_UKAZATELE = 2062; //aFilter.UserDefinedSymbolTypeNum("317baa2f-7df8-11da-0c60-cf8e338f9a0b"); //Model Header - nested object Documented knwldg symbol

const SYM_FUNKCNI_MISTO = aFilter.UserDefinedSymbolTypeNum("bf0be63d-40ae-4b93-9f18-8076c80a502b"); //Model Header - nested object Documented knwldg symbol
const SYM_ORG_JEDNOTKA = aFilter.UserDefinedSymbolTypeNum("a2de3df1-e4f2-4369-a2ef-d00cbf68022e"); //Model Header - nested object Documented knwldg symbol



//Attributes
const attr_Desc = Constants.AT_DESC;
const attr_Title1 = Constants.AT_TITL1; //Nadpis 1
const attr_Link1 = Constants.AT_EXT_1; //Odkaz 1
const attr_chapter = aFilter.UserDefinedAttributeTypeNum("317ba88f-7df8-11da-0c60-cf8e338f9a0b"); //Číslo kapitoly
const attr_coordinatorDCR = aFilter.UserDefinedAttributeTypeNum("317ba9de-7df8-11da-0c60-cf8e338f9a0b"); //Koordinátor DCŘ - jméno
const attr_level = aFilter.UserDefinedAttributeTypeNum("d3e8f7e1-a165-11e9-7cc4-005056ad7c76"); //Úroveň
const attr_cleneni = aFilter.UserDefinedAttributeTypeNum("2d8d64c1-7862-11e9-7cc4-005056ad7c76"); //Členění procesu
const attr_vlivPrc = aFilter.UserDefinedAttributeTypeNum("317ba9ee-7df8-11da-0c60-cf8e338f9a0b"); //Vliv Procesu na JB a RO
const attr_zduvodneni = aFilter.UserDefinedAttributeTypeNum("317ba9f0-7df8-11da-0c60-cf8e338f9a0b"); //Zdůvodnění (JB a RO)
const attr_uniteNumber = aFilter.UserDefinedAttributeTypeNum("d0c64740-00a4-11e5-5d17-e27d2e316924"); //Číslo útvaru
const attr_positionNumber = aFilter.UserDefinedAttributeTypeNum("916cc791-00a4-11e5-5d17-e27d2e316924"); //Číslo PM
const attr_uniteManager = aFilter.UserDefinedAttributeTypeNum("317baa11-7df8-11da-0c60-cf8e338f9a0b"); //Vedoucí útvaru
const attr_uniteManagerName = aFilter.UserDefinedAttributeTypeNum("2bac1541-8ac0-11e5-5eb6-000c293052e4"); //Vedoucí útvaru (jméno)
const attr_uniteLevel = aFilter.UserDefinedAttributeTypeNum("e7f4bee1-07e2-11e8-7ad3-005056ad77da"); //Úroveň řízení
const attr_DL_ID = aFilter.UserDefinedAttributeTypeNum("d61f42a0-2f22-11de-7933-005056c00008"); //DataLink ID
const attr_DL_Status = aFilter.UserDefinedAttributeTypeNum("dede07a0-2f22-11de-7933-005056c00008"); //DataLink Status
const attr_purposePP = aFilter.UserDefinedAttributeTypeNum("317ba8a3-7df8-11da-0c60-cf8e338f9a0b"); //Účel PP
const attr_rozsahZavaznostiPP = aFilter.UserDefinedAttributeTypeNum("317ba8a4-7df8-11da-0c60-cf8e338f9a0b"); //Rozsah závaznosti PP
const attr_coordinatorMail = aFilter.UserDefinedAttributeTypeNum("317ba88e-7df8-11da-0c60-cf8e338f9a0b"); //Mail na koordinátora
const attr_issuedByDoc = aFilter.UserDefinedAttributeTypeNum("317ba8ad-7df8-11da-0c60-cf8e338f9a0b"); //Model vydán dokumentem
const attr_purposeSM = aFilter.UserDefinedAttributeTypeNum("317ba89f-7df8-11da-0c60-cf8e338f9a0b"); //Účel SM
const attr_rozsahZavaznostiSM = aFilter.UserDefinedAttributeTypeNum("317ba8a0-7df8-11da-0c60-cf8e338f9a0b"); //Rozsah závaznosti SM

//EPC
const attr_MistoVykonuPrace = aFilter.UserDefinedAttributeTypeNum("22520530-8ac1-11e5-5eb6-000c293052e4"); //Místo výkonu práce
const attr_NakladoveStrediskoID = aFilter.UserDefinedAttributeTypeNum("445f9f01-0ae4-11ea-7cc4-005056ad7c76"); //Nákladové středisko ID


//EPC - Procesni Role 8.12
const attr_TypProcesniRole = aFilter.UserDefinedAttributeTypeNum("a98824b1-4917-11ec-4a66-005056ad7c76"); // Typ procesní role
//MTPH - Ukazatel 8.12
const attr_TypUkazatele = aFilter.UserDefinedAttributeTypeNum("c658a1f1-3b07-11ec-4a66-005056ad7c76"); // Typ ukazatele
const procesni = aFilter.UserDefinedAttributeValueTypeNum("c658a1f1-3b07-11ec-4a66-005056ad7c76", "c66488db-3b07-11ec-4a66-005056ad7c76"); //Typ Ukazatele, value -procesni
const produktovy = aFilter.UserDefinedAttributeValueTypeNum("c658a1f1-3b07-11ec-4a66-005056ad7c76", "c66488d3-3b07-11ec-4a66-005056ad7c76") //Typ Ukazatele, value -proudktovy

/* old test
//EPC - Procesni Role 8.12
const attr_TypProcesniRole = aFilter.UserDefinedAttributeTypeNum("a98824b1-4917-11ec-4a66-005056ad7c76"); // Typ procesní role
//MTPH - Ukazatel 8.12
const attr_TypUkazatele = aFilter.UserDefinedAttributeTypeNum("b4f64871-3b04-11ec-15fe-005056ad5575"); // Typ ukazatele
const procesni = aFilter.UserDefinedAttributeValueTypeNum("b4f64871-3b04-11ec-15fe-005056ad5575", "b504a053-3b04-11ec-15fe-005056ad5575"); //Typ Ukazatele, value -procesni
const produktovy = aFilter.UserDefinedAttributeValueTypeNum("b4f64871-3b04-11ec-15fe-005056ad5575", "b504a05b-3b04-11ec-15fe-005056ad5575") //Typ Ukazatele, value -proudktovy

*/
   