// semantick check config
var g_loc_CZ = 1029;
var g_loc_EN = 1033;
var g_loc_DE = 1031;
var g_ReadingRights = [
	Constants.AR_NORIGHTS,
	Constants.AR_SUBMIT,
	Constants.AR_SUBMIT + Constants.AR_COLLABORATE,
	Constants.AR_READ_COLLABORATE,
	Constants.AR_READ_SUBMIT_COLLABORATE
];

//Attributes
const attr_processLevel = getAttributNumber("eba01f80-0b57-11e8-375a-54ee7539b247");
const ATTR_Identifier = Constants.AT_ID; //identifier
const ATTR_ReqPriority = getAttributNumber("2e647d70-b4b5-11eb-7c48-005056af6d0b");
const ATTR_Addon = getAttributNumber("ac44bf11-ba3d-11eb-7c48-005056af6d0b");
const ATTR_Uncertainty = getAttributNumber("a3dc85d1-bd6f-11eb-7c48-005056af6d0b");
const ATTR_ReqCategory = getAttributNumber("fb81bfb1-b4ca-11eb-7c48-005056af6d0b");
const ATTR_ReqCategoryValueWRICEF = "fb8da693-b4ca-11eb-7c48-005056af6d0b";
const ATTR_RICEFW_ID = getAttributNumber("b75e2d71-b4cd-11eb-7c48-005056af6d0b");
const ATTR_RICEFW_Type = getAttributNumber("2bcc4ef1-b4cc-11eb-7c48-005056af6d0b");
//const ATTR_OutOfScopeProcess = getAttributNumber("2415bbf1-3ca4-11ec-2e39-005056af6d0b"); //Is out of scope   RV 11.01.2022
const ATTR_OutOfScopeProcess = -1; //Is out of scope   RV 11.01.2022

//SAP Attributes
const ATTR_SAPFUNCTYPE = Constants.AT_SAP_FUNC_TYPE;
const ATTR_SAPMODELTYPE = Constants.AT_SAP_MOD_TYPE;
const ATTR_SAPCOMP = Constants.AT_SOLAR_SAP_COMPONENT;
// Attribute value
const ATVAL_FOLDER = ArisData.ActiveFilter().AttrValueType(Constants.AT_SAP_FUNC_TYPE, Constants.AVT_SM72_FOLDER); //Folder = object of Top level model
const ATVAL_SCENARIO = ArisData.ActiveFilter().AttrValueType(Constants.AT_SAP_FUNC_TYPE, Constants.AVT_SCEN); //Scenario
const ATVAL_PROCESS = ArisData.ActiveFilter().AttrValueType(Constants.AT_SAP_FUNC_TYPE, Constants.AVT_PROC_1); //Process
const ATVAL_PRC_STP_ORG = ArisData.ActiveFilter().AttrValueType(Constants.AT_SAP_FUNC_TYPE, Constants.AVT_SM72_REPOSITORY_STEP); //Process step original
const ATVAL_PRC_STP = ArisData.ActiveFilter().AttrValueType(Constants.AT_SAP_FUNC_TYPE, Constants.AVT_SOLAR_PROCESS_STEP); //Process step 
const ATVAL_PROJECT = ArisData.ActiveFilter().AttrValueType(Constants.AT_SAP_FUNC_TYPE, Constants.AVT_SOLAR_PROJECT) //Project
const ATVAL_PROCESSTEP_LIB = ArisData.ActiveFilter().AttrValueType(Constants.AT_SAP_FUNC_TYPE, Constants.AVT_SM72_STEP_REPOSITORY_FOLDER) //Process step lib
const ATVAL_SYNCPROJ_PREFIX = 'SM72_TEST_PROJECT_SYNC:'
const ATVAL_TRANS4M_LOGCOMP = ["ZSAP_ERP_TEMPLATE_ET2K","ZSAP_EWM_TEMPLATE_ET2K","ZSAP_MANUAL_TEMPLATE_ET2K"];
//SAP components SOP
const ATVAL_SAPCOMP_ERP = 'ZSAP_ERP_TEMPLATE_ET2K';
const ATVAL_SAPCOMP_EWM = 'ZSAP_EWM_TEMPLATE_ET2K';
const ATVAL_SAPCOMP_MANUAL = 'ZSAP_MANUAL_TEMPLATE_ET2K';
//Object types
const OBJ_SYS = Constants.OT_APPL_SYS_TYPE;
const OBJ_ORG = Constants.OT_ORG_UNIT;
const OBJ_GRP = Constants.OT_GRP;
const OBJ_ROL = Constants.OT_PERS_TYPE;
const OBJ_DOC = Constants.OT_INFO_CARR;
const OBJ_SCR = Constants.OT_SCRN;
const OBJ_CLST = Constants.OT_CLST;
const OBJ_REQ = Constants.OT_REQUIREMENT;
const OBJ_PRCSTP = Constants.OT_FUNC;
const OBJ_ITSYS = Constants.OT_APPL_SYS_TYPE;
//Symbols
const SY_PROCESINTERFACE = Constants.ST_PRCS_IF;
const SY_PROC_SHADOW = Constants.ST_SOLAR_SL_VAC_OCC;
const SY_PROC_VAD = Constants.ST_VAL_ADD_CHN_SML_2;
const SY_PROC_VADSTART = Constants.ST_VAL_ADD_CHN_SML_1;
const SY_PROC_SAP = Constants.ST_SOLAR_VAC;
const SY_PRCSTP_MANUAL = Constants.ST_FUNC;
const SY_PRCSTP_SAPFUNCTION = Constants.ST_SOLAR_FUNC;
const SY_PRCSTP_SAPAUTO = "e0374061-c773-11e2-2738-a44fca2ed293"; 
const SY_PRCSTP_SAPINTER = "4c8032e1-c774-11e2-2738-a44fca2ed293";
const SY_PRCSTP_SUBTRANS = "d580e690-c772-11e2-2738-a44fca2ed293";
const SY_PRCSTP_SAPAUTO_num = ArisData.ActiveFilter().UserDefinedSymbolTypeNum("e0374061-c773-11e2-2738-a44fca2ed293"); 
const SY_PRCSTP_SAPINTER_num =  ArisData.ActiveFilter().UserDefinedSymbolTypeNum("4c8032e1-c774-11e2-2738-a44fca2ed293");
const SY_PRCSTP_SUBTRANS_num =  ArisData.ActiveFilter().UserDefinedSymbolTypeNum("d580e690-c772-11e2-2738-a44fca2ed293");
const SY_PRCSTP_SHADOW = Constants.ST_SOLAR_SL_OCC;
var symbolsWithShadow = [Constants.ST_SOLAR_SL_OCC, Constants.ST_SOLAR_SL_VAC_OCC, Constants.ST_SOLAR_FUNC_SHORTCUT, Constants.ST_SOLAR_VAC_SHORTCUT];
//SAP Libraries
//Target Sync library models SOP
const M_SAP_ERP_Autofunction = '7f18cca1-7901-11e8-4557-005056af26e2';
const M_SAP_ERP_Function = '8c4aa331-7901-11e8-4557-005056af26e2';
const M_SAP_ERP_Interfacefunction = '97007d41-7901-11e8-4557-005056af26e2';
const M_SAP_EWM_Autofunction = 'b652fba2-7901-11e8-4557-005056af26e2';
const M_SAP_EWM_Function = 'b1cb50a2-7901-11e8-4557-005056af26e2';
const M_SAP_EWM_Interfacefunction = 'abc12452-7901-11e8-4557-005056af26e2';
const M_MANUAL_STEPS = 'f4c01c51-78fd-11e8-4557-005056af26e2';
const g_ProcessStepLibModelGUID = "34d27c82-0194-11ec-2e36-005056af6d0b";
//Master data groups
const g_ProcessGroupGUID = "";
const g_ProcessStepGroupGUID = "";
//Model types
const MT_VAD = Constants.MT_VAL_ADD_CHN_DGM;
const MT_FAD = Constants.MT_FUNC_ALLOC_DGM;
const MT_FLOW = Constants.MT_EEPC;
var aFilter = ArisData.ActiveFilter();
var objectTypeName_SYS = aFilter.getItemTypeName(Constants.CID_OBJDEF, Constants.OT_APPL_SYS_TYPE);
var objectTypeName_CLST = aFilter.getItemTypeName(Constants.CID_OBJDEF, Constants.OT_CLST);
var objectTypeName_SCR = aFilter.getItemTypeName(Constants.CID_OBJDEF, Constants.OT_SCRN);
var objectTypeName_REQ = aFilter.getItemTypeName(Constants.CID_OBJDEF, OBJ_REQ);
const COLUMN_X_WIDTH = 20; //Superior object
const COLUMN_0_WIDTH = 50; //Model name
const COLUMN_1_WIDTH = 25; //Model GUID
const COLUMN_2_WIDTH = 20; //Model SAP ID
const COLUMN_3_WIDTH = 20; //Rule label (number)
const COLUMN_4_WIDTH = 60; //Rule Name
const COLUMN_5_WIDTH = 20; //control result (e.g. !, X, Ok)
const COLUMN_6_WIDTH = 40; //Object Name
const COLUMN_7_WIDTH = 60; //Rule description
var OPTION_MODE = "option_mode";

//var EPC_models = [Constants.MT_EEPC, Constants.MT_EEPC_COLUMN, Constants.MT_EEPC_INST, Constants.MT_EEPC_MAT, Constants.MT_EEPC_ROW, Constants.MT_EEPC_TAB, Constants.MT_EEPC_TAB_HORIZONTAL];

function styles(outfile){
    outfile.DefineF("REPORT1", "Arial", 24, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_BOLD | Constants.FMT_CENTER, 0, 21, 0, 0, 0, 1);
    outfile.DefineF("REPORT2", "Arial", 14, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_LEFT, 0, 21, 0, 0, 0, 1);
    outfile.DefineF("REPORT3", "Arial", 8, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_LEFT, 0, 21, 0, 0, 0, 1);

    outfile.DefineF("RULE_HEADER", "Arial", 10, Constants.C_BLACK,  Constants.C_GREY_80_PERCENT,  Constants.FMT_BOLD | Constants.FMT_CENTER | Constants.FMT_VTOP, 0, 21, 0, 0, 0, 1);    
    outfile.DefineF("TABLE_CELL", "Arial", 10, Constants.C_BLACK, Constants.C_WHITE, Constants.FMT_CENTER | Constants.FMT_VTOP, 0, 21, 0, 0, 0, 1);    
    outfile.DefineF("TABLE_CELL_LEFT", "Arial", 10, Constants.C_BLACK, Constants.C_WHITE,  Constants.FMT_LEFT | Constants.FMT_VTOP, 0, 21, 0, 0, 0, 1);    
   
    outfile.DefineF("TABLE_CELL_GREY", "Arial", 10, Constants.C_GREY_80_PERCENT, Constants.C_WHITE, Constants.FMT_CENTER | Constants.FMT_VTOP, 0, 21, 0, 0, 0, 1);    
    outfile.DefineF("TABLE_CELL_GREEN", "Arial", 10, Constants.C_BLACK, Constants.C_GREEN,  Constants.FMT_CENTER | Constants.FMT_VTOP,  0, 21, 0, 0, 0, 1);    
    outfile.DefineF("TABLE_CELL_RED", "Arial", 10, Constants.C_BLACK, Constants.C_RED, Constants.FMT_CENTER | Constants.FMT_VTOP, 0, 21, 0, 0, 0, 1);    
    outfile.DefineF("TABLE_CELL_ORANGE", "Arial", 10, Constants.C_BLACK, Constants.C_ORANGE, Constants.FMT_CENTER | Constants.FMT_VTOP, 0, 21, 0, 0, 0, 1);    

}

function getAttributNumber(attr_GUID) {
	var attr_Num = ArisData.ActiveFilter().UserDefinedAttributeTypeNum(attr_GUID);
	if (attr_Num == -1) {
		var filtrName = ArisData.ActiveFilter().Name(-1);
		Dialogs.MsgBox("GUID \"" + attr_GUID + "\" doesnt exist in Filter " + filtrName, Constants.MSGBOX_ICON_ERROR + 512, "Message from Report");
		//  Context.setScriptError(Constants.ERR_CANCEL);
		return -1;
	} else {
		return attr_Num; //ok
	}
}

function getSettings() {
	var Settings = new Array();
	// Process step
	var Item = {};
	Item.SuperiorObjTypes = [OBJ_PRCSTP];
	Item.SuperiorObjDefSymbols = [SY_PROC_VAD,SY_PROC_VAD,SY_PROCESINTERFACE,SY_PROC_VADSTART];
	Item.SuperiorObjAttrAndValues = [
		[ATTR_SAPFUNCTYPE, [ATVAL_PROCESS]]
	];
	Item.SuperiorModelTypes = [MT_FLOW];
	Item.SuperiorModelAttrAndValues = [
		[ATTR_SAPMODELTYPE, [ATVAL_PROCESS]]
	];
	Item.ObjTypes = [OBJ_PRCSTP];
	Item.ObjSymbols = [SY_PRCSTP_MANUAL, SY_PRCSTP_SAPFUNCTION, SY_PRCSTP_SAPAUTO,SY_PRCSTP_SAPAUTO_num, SY_PRCSTP_SAPINTER, SY_PRCSTP_SAPINTER_num,SY_PRCSTP_SUBTRANS_num, SY_PRCSTP_SUBTRANS];
	Item.ObjAttrAndValues = [
		[ATTR_SAPFUNCTYPE, [ATVAL_PRC_STP_ORG]],
		[ATTR_SAPCOMP, ATVAL_TRANS4M_LOGCOMP]
	];
	Item.ObjLibModelGUID = [
        //Manual steps
        [M_MANUAL_STEPS,[SY_PRCSTP_MANUAL], [[ATTR_SAPCOMP, [ATVAL_SAPCOMP_MANUAL]]]],
        //ERP Autofunction
        [M_SAP_ERP_Autofunction,[SY_PRCSTP_SAPAUTO_num], [[ATTR_SAPCOMP, [ATVAL_SAPCOMP_ERP]]]],
        //ERP SAP Function
        [M_SAP_ERP_Function,[SY_PRCSTP_SAPFUNCTION,SY_PRCSTP_SUBTRANS_num], [[ATTR_SAPCOMP, [ATVAL_SAPCOMP_ERP]]]],
        //ERP Interface
        [M_SAP_ERP_Interfacefunction,[SY_PRCSTP_SAPINTER_num], [[ATTR_SAPCOMP, [ATVAL_SAPCOMP_ERP]]]],
        //EWM Autofunction
        [M_SAP_EWM_Autofunction,[SY_PRCSTP_SAPAUTO_num], [[ATTR_SAPCOMP, [ATVAL_SAPCOMP_EWM]]]],
        //EWM SAP Function
        [M_SAP_EWM_Function,[SY_PRCSTP_SAPFUNCTION,SY_PRCSTP_SUBTRANS_num], [[ATTR_SAPCOMP, [ATVAL_SAPCOMP_EWM]]]],
        //EWM Interface
        [M_SAP_EWM_Interfacefunction,[SY_PRCSTP_SAPINTER_num], [[ATTR_SAPCOMP, [ATVAL_SAPCOMP_EWM]]]]
    ];
    Item.ObjLibModelSymbols = [SY_PROC_SAP];
    Item.ObjLibModelAttrAndValues = [
        [ATTR_SAPMODELTYPE, ATVAL_PROCESSTEP_LIB]
    ];
	Item.ObjLibModelSymbol = SY_PROC_SAP;
	Item.ObjMasterGroupGUID = [
        //MAN Steps
        ["d99931b1-ae13-11ec-3030-005056af6d0b", [SY_PRCSTP_MANUAL],
            [
                [ATTR_SAPCOMP, [ATVAL_SAPCOMP_MANUAL]]
            ]
        ],
		//ERP Autofunction
        ["b253d791-ae18-11ec-3030-005056af6d0b", [SY_PRCSTP_SAPAUTO_num],
            [
                [ATTR_SAPCOMP, [ATVAL_SAPCOMP_ERP]]
            ]
        ],
        //ERP SAP Function
        ["b872eb71-ae18-11ec-3030-005056af6d0b", [SY_PRCSTP_SAPFUNCTION,SY_PRCSTP_SUBTRANS_num],
            [
                [ATTR_SAPCOMP, [ATVAL_SAPCOMP_ERP]]
            ]
        ],
        //ERP Interface
        ["bd76cb51-ae18-11ec-3030-005056af6d0b", [SY_PRCSTP_SAPINTER_num],
            [
                [ATTR_SAPCOMP, [ATVAL_SAPCOMP_ERP]]
            ]
        ],
        //EWM Autofunction
        ["c5c2aa40-ae18-11ec-3030-005056af6d0b", [SY_PRCSTP_SAPAUTO_num],
            [
                [ATTR_SAPCOMP, [ATVAL_SAPCOMP_EWM]]
            ]
        ],
        //EWM SAP Function
        ["c5c2aa43-ae18-11ec-3030-005056af6d0b", [SY_PRCSTP_SAPFUNCTION,SY_PRCSTP_SUBTRANS_num],
            [
                [ATTR_SAPCOMP, [ATVAL_SAPCOMP_EWM]]
            ]
        ],
        //EWM Interface
        ["c5c2aa46-ae18-11ec-3030-005056af6d0b", [SY_PRCSTP_SAPINTER_num],
            [
                [ATTR_SAPCOMP, [ATVAL_SAPCOMP_EWM]]
            ]
        ]
    ];
	Item.ObjConnections = [
		[SY_PRCSTP_SAPFUNCTION, [
			//[OBJ_ROL, 1], //RFC Jan Petersen/Aileen Mehrtens (DE) <aileen.mehrtens@pwc.com>
			[OBJ_ITSYS, 1]
		]],
		[SY_PRCSTP_SAPAUTO, [
			[OBJ_ITSYS, 1]
		]],
		[SY_PRCSTP_SAPINTER, [
			[OBJ_ITSYS, 2]
		]]
	];
	Item.SubordinatedModelTypes = [MT_FAD];
	Item.SubordinatedModelAttrAndValues = [
		[ATTR_SAPMODELTYPE, [ATVAL_PRC_STP_ORG]]
	];
	Settings.push(Item);
	// Process
	var Item = {};
	Item.SuperiorObjTypes = [OBJ_PRCSTP];
	Item.SuperiorObjDefSymbols = [SY_PROC_VAD,SY_PROC_VADSTART];
	Item.SuperiorObjAttrAndValues = [
		[ATTR_SAPFUNCTYPE, [ATVAL_SCENARIO]]
	];
	Item.SuperiorModelTypes = [MT_VAD];
	Item.SuperiorModelAttrAndValues = [
		[ATTR_SAPMODELTYPE, [ATVAL_SCENARIO]]
	];
	Item.ObjTypes = [OBJ_PRCSTP];
	Item.ObjSymbols = [SY_PROC_VAD];
	Item.ObjAttrAndValues = [
    [ATTR_SAPFUNCTYPE, [ATVAL_PROCESS]]
	];
	Item.ObjLibModelGUID = "";
	Item.ObjLibModelSymbol = "";
	Item.ObjMasterGroupGUID = "";
	Item.ObjConnections = [];
	Item.SubordinatedModelTypes = [MT_FLOW, MT_FAD];
	Item.SubordinatedModelAttrAndValues = [
		[ATTR_SAPMODELTYPE, [ATVAL_PROCESS]]
	];
	Settings.push(Item);
	// Scenario
	var Item = {};
	Item.SuperiorObjTypes = [OBJ_PRCSTP];
	Item.SuperiorObjDefSymbols = [SY_PROC_VAD];
	Item.SuperiorObjAttrAndValues = [
		[ATTR_SAPFUNCTYPE, [ATVAL_FOLDER]]
	];
	Item.SuperiorModelTypes = [MT_VAD];
	Item.SuperiorModelAttrAndValues = [
		[ATTR_SAPMODELTYPE, [ATVAL_FOLDER]]
	];
	Item.ObjTypes = [OBJ_PRCSTP];
	Item.ObjSymbols = [SY_PROC_VAD];
	Item.ObjAttrAndValues = [
		[ATTR_SAPFUNCTYPE, [ATVAL_SCENARIO]]
	];
	Item.ObjLibModelGUID = "";
	Item.ObjLibModelSymbol = "";
	Item.ObjMasterGroupGUID = "";
	Item.ObjConnections = [];
	Item.SubordinatedModelTypes = [MT_FAD];
	Item.SubordinatedModelAttrAndValues = [
		[ATTR_SAPMODELTYPE, [ATVAL_SCENARIO]]
	];
	Settings.push(Item);
	//Folder-Project
	var Item = {};
	Item.SuperiorObjTypes = [OBJ_PRCSTP];
	Item.SuperiorObjDefSymbols = [SY_PROC_VAD];
	Item.SuperiorObjAttrAndValues = [
		[ATTR_SAPFUNCTYPE, [ATVAL_PROJECT]]
	];
	Item.SuperiorModelTypes = [MT_VAD];
	Item.SuperiorModelAttrAndValues = [
		[ATTR_SAPMODELTYPE, [ATVAL_PROJECT]]
	];
	Item.ObjTypes = [OBJ_PRCSTP];
	Item.ObjSymbols = [SY_PROC_VAD];
	Item.ObjAttrAndValues = [
		[ATTR_SAPFUNCTYPE, [ATVAL_FOLDER]]
	];
	Item.ObjLibModelGUID = "";
	Item.ObjLibModelSymbol = "";
	Item.ObjMasterGroupGUID = "";
	Item.ObjConnections = [];
	Item.SubordinatedModelTypes = [MT_FAD];
	Item.SubordinatedModelAttrAndValues = [
		[ATTR_SAPMODELTYPE, [ATVAL_FOLDER]]
	];
	Settings.push(Item);
	return Settings;
}
//output report´s symbols
const okSymbol = "✓ ";
const koSymbol = "✗ ";
const warningSymbol = "!";

//help function to get list of attributes from settings 
function getMandatoryAttrOverviewFromConfig(artifact) {
    var artifactsAttrList = "";
    if (artifact == "objects") {
        SemanticCheckConfig[artifact].forEach(function(item){
            var artifactAttrList = new Array();
            var itemSymb = item["symbolNum"];
            var itemType = item["typeNum"];
            if (itemSymb != undefined) { //object types with specific symbols
                var SymbolNameList = new Array();
                itemSymb.forEach(function(symbol){
                    SymbolNameList.push(aFilter.SymbolName(symbol));
                });
                if (item["mandatoryAttributes"] != undefined) {
                    item["mandatoryAttributes"].forEach(function(attribute){
                        artifactAttrList.push(aFilter.AttrTypeName(attribute["typeNum"]));
                    });
                    artifactsAttrList = artifactsAttrList + aFilter.ObjTypeName(itemType) + " [" + SymbolNameList.toString() + "]: " + artifactAttrList.toString() + "\n";
                }
            } else { //object types with undifined symbols (all symbols)
                if (item["mandatoryAttributes"] != undefined) {
                    item["mandatoryAttributes"].forEach(function(attribute){
                        artifactAttrList.push(aFilter.AttrTypeName(attribute["typeNum"]));
                    });
                    artifactsAttrList = artifactsAttrList + aFilter.ObjTypeName(itemType) + ": " + artifactAttrList.toString() + "\n";
                }
            }
        });
        return artifactsAttrList.replace(/,/g, ", ");
    } else if (artifact == "models") {
        SemanticCheckConfig[artifact].forEach(function(item){
            var artifactAttrList = new Array();
            if (item["mandatoryAttributes"] != undefined) {
                item["mandatoryAttributes"].forEach(function(attribute){
                    artifactAttrList.push(aFilter.AttrTypeName(attribute));
                });
                artifactsAttrList = artifactsAttrList + item["alias"] + ": " + artifactAttrList.toString() + "\n";
                }
        });
        return artifactsAttrList.replace(/,/g, ", ");
    } else return null;

}
//config
var SemanticCheckConfig = {
    commonSettings: [
        {
        tagName: "EWM", //not used
        //list of rules
        ruleListVACDs: [0, 4, 2, 11, 14, 15, 17, 18], 
        ruleListEPCs: [0, 1, 2, 3, 4, 5, 8, 9, 10, 11, 12, 13, 14, 15, 17, 18, 20, 21],
        ruleListFADs: [0, 2, 3, 6, 11, 15, 17, 18, 21, 22],
        
        VACD_models:[Constants.MT_VAL_ADD_CHN_DGM],
        EPC_models: [Constants.MT_EEPC, Constants.MT_EEPC_COLUMN, Constants.MT_EEPC_INST, Constants.MT_EEPC_MAT, Constants.MT_EEPC_ROW, Constants.MT_EEPC_TAB, Constants.MT_EEPC_TAB_HORIZONTAL],
        FAD_models:[Constants.MT_FUNC_ALLOC_DGM],
        }
    ],
    rules: [
        {
            ruleID: "rule_0",
            ruleNum: 0, //rule number visible in both sheets
            ruleName: getString("TEXT_RULE_0"), // rule Name visible in both sheets
            ruleDesc: getString("TEXT_RULE_0_DETAIL"), // Detail description of rule visible in Rule Overview sheet
        },
        {
            ruleID: "rule_1",
            ruleNum: 1, //rule number visible in both sheets
            ruleName: getString("TEXT_RULE_1"), // rule Name visible in both sheets
            ruleDesc: getString("TEXT_RULE_1_DETAIL"), // Detail description of rule visible in Rule Overview sheet
        },
        {
            ruleID: "rule_2",
            ruleNum: 2,
            ruleName: getString("TEXT_RULE_2"),
            ruleDesc: "",
        },
        {
            ruleID: "rule_3",
            ruleNum: 3,
            ruleName: getString("TEXT_RULE_3"),
            ruleDesc: getString("TEXT_RULE_3_DETAIL"),
        },
        {
            ruleID: "rule_4",
            ruleNum: 4,
            ruleName: getString("TEXT_RULE_4"),
            ruleDesc: "",
        },
        {
            ruleID: "rule_5",
            ruleNum: 5,
            ruleName: getString("TEXT_RULE_5"),
            ruleDesc: "",
        },
        {
            ruleID: "rule_51",
            ruleNum: 5, //subrule
            ruleName: getString("TEXT_RULE_51"),
            ruleDesc: getString("TEXT_RULE_51_DETAIL"),
            rulesOverviewBlacklisk: true,
        },
        {
            ruleID: "rule_52",
            ruleNum: 5, //subrule
            ruleName: getString("TEXT_RULE_52"),
            ruleDesc: getString("TEXT_RULE_52_DETAIL"),
            rulesOverviewBlacklisk: true,
        },
        {
            ruleID: "rule_53",
            ruleNum: 5, //subrule
            ruleName: getString("TEXT_RULE_53"),
            ruleDesc: getString("TEXT_RULE_53_DETAIL"),
            rulesOverviewBlacklisk: true,
        },
        {
            ruleID: "rule_6",
            ruleNum: 6,
            ruleName: getString("TEXT_RULE_6"),
            ruleDesc: "",
        },
        {
            ruleID: "rule_7",
            ruleNum: 7,
            ruleName: getString("TEXT_RULE_7"),
            ruleDesc: "",
        },
        {
            ruleID: "rule_8",
            ruleNum: 8,
            ruleName: getString("TEXT_RULE_8"),
            ruleDesc: getString("TEXT_RULE_8_DETAIL"),
        },
        {
            ruleID: "rule_81", //subrule
            ruleNum: 8,
            ruleName: getString("TEXT_RULE_8_PROCESS_INTERFACE_CHECK"),
            ruleDesc: getString("TEXT_RULE_8_DETAIL"),
            rulesOverviewBlacklisk: true,
        },
        {
            ruleID: "rule_82", //subrule
            ruleNum: 8,
            ruleName: getString("TEXT_RULE_8_DETAIL_START"),
            ruleDesc: getString("TEXT_RULE_8_DETAIL"),
            rulesOverviewBlacklisk: true,
        },
        {
            ruleID: "rule_83", //subrule
            ruleNum: 8,
            ruleName: getString("TEXT_RULE_8_DETAIL_END"),
            ruleDesc: getString("TEXT_RULE_8_DETAIL"),
            rulesOverviewBlacklisk: true,
        },
        {
            ruleID: "rule_9",
            ruleNum: 9,
            ruleName: getString("TEXT_RULE_9"),
            ruleDesc: getString("TEXT_RULE_9_DETAIL"),
        },
        {
            ruleID: "rule_10",
            ruleNum: 10,
            ruleName: getString("TEXT_RULE_10"),
            ruleDesc: getString("TEXT_RULE_10_DETAIL"),
        },
        {
            ruleID: "rule_mandatoryObjectAttrs",
            ruleNum: 11,
            ruleName: getString("TEXT_RULE_11"),
            ruleDesc: getString("TEXT_RULE_11_DETAIL"),
            ruleDescAddInfo: "objects",
        },
        {
            ruleID: "rule_12",
            ruleNum: 12,
            ruleName: getString("TEXT_RULE_12"),
            ruleDesc: "",
        },
        {
            ruleID: "rule_13",
            ruleNum: 13,
            ruleName: getString("TEXT_RULE_13"),
            ruleDesc: getString("TEXT_RULE_13_DETAIL"),
        },
        {
            ruleID: "rule_14",
            ruleNum: 14,
            ruleName: getString("TEXT_RULE_14"),
            ruleDesc: getString("TEXT_RULE_14_DETAIL"),
        },
        {
            ruleID: "rule_mandatoryModelAttrs",
            ruleNum: 15,
            ruleName: getString("TEXT_RULE_MANDATORY_MODEL_ATTRS"),
            ruleDesc: getString("TEXT_RULE_MANDATORY_MODEL_ATTRS_DETAIL"),
            ruleDescAddInfo: "models",
        },
        {
            ruleID: "rule_linked_dataObjects_PRPs",
            ruleNum: 16,
            ruleName: getString("TEXT_RULE_LINKING_DATAOBJECT_INTERFACE"),
            ruleDesc: getString("TEXT_RULE_LINKING_DATAOBJECT_INTERFACE_DETAIL"),
        },
        {
            ruleID: "rule_SAP_Object_rules",
            ruleNum: 17,
            ruleName: getString("TEXT_RULE_17"),
            ruleDesc: getString("TEXT_RULE_17_DETAIL"),
        },
        {
            ruleID: "rule_SAP_Model_rules",
            ruleNum: 18,
            ruleName: getString("TEXT_RULE_SAP_MODEL_ATTRS_LABEL"),
            ruleDesc: getString("TEXT_RULE_SAP_MODEL_ATTRS_INFO"),
        },
        {
            ruleID: "rule_ProcessStepConnections_rules",
            ruleNum: 19,
            ruleName: getString("TEXT_RULE_19"),
            ruleDesc: getString("TEXT_RULE_19_INFO"),
        },
         {
            ruleID: "rule_SAP_Libraries_rules",
            ruleNum: 20,
            ruleName: getString("TEXT_RULE_20"),
            ruleDesc: getString("TEXT_RULE_20_INFO"),
        },
        {
            ruleID: "rule_SAP_MasteGroups_rules",
            ruleNum: 21,
            ruleName: getString("TEXT_RULE_21"),
            ruleDesc: getString("TEXT_RULE_21_INFO"),
        },
        {
            ruleID: "rule_satelitesObjects_inLibrary_rule",
            ruleNum: 22,
            ruleName: getString("TEXT_RULE_22"),
            ruleDesc: getString("TEXT_RULE_22_INFO"),
        },
   ],
    models: [
        {
            alias: "VACD models",
            typeNum: [Constants.MT_VAL_ADD_CHN_DGM],
            mandatoryAttributes: [Constants.AT_NAME, Constants.AT_DESC, ATTR_Identifier],
            minObjects: 0, // formula: > number
            maxObjects: 15, // formula: <= number
            min_maxObjectsEvalSymbol: "warning",
            satelitesLibrary_typeNum: [],
        },
        {
            alias: "FAD models",
            typeNum: [Constants.MT_FUNC_ALLOC_DGM],
            mandatoryAttributes: [Constants.AT_NAME],
            minObjects: 0, // formula: > number
            maxObjects: 1, // formula: <= number
            min_maxObjectsEvalSymbol: "ko",
            satelitesLibrary_typeNum: [OBJ_ROL],
        },
        {
            alias: "EPC models",
            typeNum: [Constants.MT_EEPC, Constants.MT_EEPC_COLUMN, Constants.MT_EEPC_INST, Constants.MT_EEPC_MAT, Constants.MT_EEPC_ROW, Constants.MT_EEPC_TAB, Constants.MT_EEPC_TAB_HORIZONTAL],
            mandatoryAttributes: [Constants.AT_NAME],
            minObjects: 0, // formula: > number
            maxObjects: 15, // formula: <= number
            min_maxObjectsEvalSymbol: "warning",
            satelitesLibrary_typeNum: [],
       }
    ],
    objects: [
        {
            alias: "ProcessStep",
            typeNum: [OBJ_PRCSTP],
            symbolNum: [SY_PRCSTP_MANUAL, SY_PRCSTP_SAPFUNCTION, SY_PRCSTP_SAPAUTO_num, SY_PRCSTP_SAPINTER_num, SY_PRCSTP_SUBTRANS_num],
            //mandatoryAttributes: [Constants.AT_NAME,Constants.AT_DESC, attr_processLevel, ATTR_Identifier], //[Desc + Identifier: only for VACD + FAD] Constants.OT_FUNC && ([Constants.MT_VAL_ADD_CHN_DGM, Constants.MT_FUNC_ALLOC_DGM].contains(model.TypeNum()) == true)
            mandatoryAttributes: [        
                /* { 
                    typeNum: Constants.AT_NAME,
                    evalFunction: {
                        "arguments": "attribute",
                        "body": "return attribute.IsMaintained();"
                    }
                }, */       
                { 
                    typeNum: Constants.AT_DESC,
                    evalFunction: {
                        "arguments": "attribute",
                        "body": "return attribute.IsMaintained();"
                    },
                },
                { 
                    typeNum: ATTR_Identifier,
                    evalFunction: {
                        "arguments": "attribute",
                        "body": "return attribute.IsMaintained();"
                    }
                }, 
            ],
            
            PSsymbols:[[Constants.OT_FUNC],[SY_PRCSTP_MANUAL, SY_PRCSTP_SAPFUNCTION, SY_PRCSTP_SAPAUTO, SY_PRCSTP_SAPINTER, SY_PRCSTP_SUBTRANS]],
            PSmandatoryAttributes:[[Constants.OT_FUNC][Constants.AT_NAME,Constants.AT_DESC]],        
            ObjAttrAndValues: [
                [ATTR_SAPFUNCTYPE, ATVAL_PRC_STP_ORG],
                [ATTR_SAPCOMP, ATVAL_TRANS4M_LOGCOMP]
            ],
            SuperiorObjTypes: [OBJ_PRCSTP],
            SuperiorObjDefSymbols: [SY_PROC_VAD],
            SuperiorObjAttrAndValues: [ATTR_SAPFUNCTYPE, ATVAL_PROCESS],
            SuperiorModelTypes: [MT_FLOW],
            SuperiorModelAttrAndValues: [ATTR_SAPMODELTYPE, ATVAL_PROCESS],
            ObjLibModelGUID: "34d27c82-0194-11ec-2e36-005056af6d0b",
            ObjLibModelSymbol: SY_PROC_SAP,
            ObjMasterGroupGUID: "07780bd1-8893-11eb-7c47-005056af6d0b",
            ObjConnections: [
                [SY_PRCSTP_SAPFUNCTION, [
                    //[OBJ_ROL, 1], //RFC Jan Petersen/Aileen Mehrtens (DE) <aileen.mehrtens@pwc.com>
                    [OBJ_ITSYS, 1]
                ]],
                [SY_PRCSTP_SAPAUTO, [
                    [OBJ_ITSYS, 1]
                ]],
                [SY_PRCSTP_SAPINTER, [
                    [OBJ_ITSYS, 2]
                ]]
            ]
        },
        {
            alias: "Process",
            typeNum: [OBJ_PRCSTP],
            symbolNum: [SY_PROC_VAD],
            mandatoryAttributes: [        
                /* { 
                    typeNum: Constants.AT_NAME,
                    evalFunction: {
                        "arguments": "attribute",
                        "body": "return attribute.IsMaintained();"
                    }
                }, */       
                { 
                    typeNum: Constants.AT_DESC,
                    evalFunction: {
                        "arguments": "attribute",
                        "body": "return attribute.IsMaintained();"
                    },
                },
                { 
                    typeNum: ATTR_Identifier,
                    evalFunction: {
                        "arguments": "attribute",
                        "body": "return attribute.IsMaintained();"
                    }
                }, 
            ],
        },
        {
            alias: "Requirement",
            typeNum: [OBJ_REQ],
            //symbolNum: is not defiened => only object type is taken into account (symbol regardeless)
            mandatoryAttributes: [        
                /* { 
                    typeNum: Constants.AT_NAME,
                    evalFunction: {
                        "arguments": "attribute",
                        "body": "return attribute.IsMaintained();"
                    }
                }, */       
                { 
                    typeNum: Constants.AT_DESC,
                    evalFunction: {
                        "arguments": "attribute",
                        "body": "return attribute.IsMaintained();"
                    },
                },
            ],
        },
        {
            alias: "Role",
            typeNum: [OBJ_ROL],
            //symbolNum: is not defiened => only object type is taken into account (symbol regardeless)
            ObjLibModelGUID: "21c319a0-d417-11e7-45d9-0050568107bf",
        },
        {
            alias: "Screen",
            typeNum: [OBJ_SCR],
            mandatoryAttributes: [        
                /* { 
                    typeNum: Constants.AT_NAME,
                    evalFunction: {
                        "arguments": "attribute",
                        "body": "return attribute.IsMaintained();"
                    }
                }, */       
                { 
                    typeNum: Constants.AT_TRANS_CODE,
                    evalFunction: {
                        "arguments": "attribute",
                        "body": "return attribute.IsMaintained();"
                    },
                },
                { 
                    typeNum: Constants.AT_SOLAR_SAP_COMPONENT,
                    evalFunction: {
                        "arguments": "attribute",
                        "body": "return attribute.IsMaintained();"
                    }
                }, 
            ],
        }
    ],
    objects2: [ //not used approach
        {
            "{Document}": {
                typeNum: OBJ_DOC,
                symbolNum:  [],
                mandatoryAttributes: [Constants.AT_NAME,Constants.AT_DESC], //AT_DESC only for FAD
                rules: {
                    // rules for object
                    "{SuperiorModelTypes}": {
                        type: [],
                        attributes: [],
                    }
                }               
            }
            
        }
    ]
};
    
    
  