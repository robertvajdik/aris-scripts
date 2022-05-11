/**
 * Copyright (C) 2018 Software AG, Darmstadt, Germany and/or Software AG USA Inc., Reston, VA, USA,
 * and/or its subsidiaries and/or its affiliates and/or their licensors.
 *
 * Use, reproduction, transfer, publication or disclosure is prohibited
 * except as specifically provided for in your License Agreement with Software AG.
 */

/**
* This file is imported by "Import Visio VDX files" report.
* This file version should serve as a default implementation and as an example.
* 
* For customized imports, this file should be copied and the import 
* of the script "Import Visio VDX files" should be changed from this file to the customized file.
*
* Doing so, an export of "Import Visio VDX files" including its imports (js, shapes & mapping) will contain
* the complete customized visio import solution to REPLACE the original scripts on customer's side.
**/

var _currentMappingID = new java.lang.String()

//helper functions
function isCrossFunctionalFlowChartImport()
{
    return _currentMappingID.startsWith("XFUNC")
}

function isBasicFlowChartImport()
{
    return _currentMappingID.startsWith("BASFLO")
}

function isBPMN2Import()
{
    return _currentMappingID.startsWith("BPMN 2") || _currentMappingID.startsWith("BPMN ");
}


/**
 * visio: T_Visio after calling initVisioFile, before model import begins
 * sSourceDiagramType: identifier of visio source diagram type (e.g. "XFUNC_M.VST")
 * nArisModelType: ARIS model type to be created
 *
 * return value: ARIS model type to be created, -1 to cancel import
*/
function postInitStep(visio, sSourceDiagramType, nArisModelType)
{
    _currentMappingID = new java.lang.String( sSourceDiagramType );
    return nArisModelType;
}

/**
 * called after an ARIS ObjOcc has been created.
 * returns true if the original shape color from the Visio diagram should be used for the ARIS symbol
 * true keeps the original color but may lead to ugly ARIS models
*/
function shouldUseVisioFillColor(nSymbolNum)
{
    if(_currentMappingID.startsWith("GENERIC"))
        return true;
      
    if(isCrossFunctionalFlowChartImport()) //is curomized handling needed?
    {            
        if(nSymbolNum==Constants.ST_RISK_1 || nSymbolNum==Constants.ST_REQUIREMENT)
            return true;
        
        return nSymbolNum<=0; //true only for free form shapes, false for all ARIS symbols
    }

    return nSymbolNum<=0; //true only for free form shapes, false for all ARIS symbols
}

/**
 * called to get an object definition.
 * The default behaviour creates a new ObjectDefinition each time.
 * More sophisticated solutions may make use of the Occ/Def concept and create new defs only if they not exist yet in group/database
 *
 * oGroup: the current group where the model has been created
 * nObjectType: type of the object to be created. see Constants.OT_xyz
 * nSymbolType: symbol type of the object to be created. see Constants.ST_xyz. This is provided by the caller as additional information..
 * sName: name of the object to be created
 * locale of the name. normally a caller would use the provided value from g_nLoc here
*/
function createNewObjDef(oGroup, nObjectType, nSymbolType, sName, localeID)
{
    return oGroup.CreateObjDef(nObjectType, sName, localeID)
}

/**
 * called for a Shape element which has no master assigned (script line: 958).
 * By default this element would be imported as graphic shape without semantic.
 * p_visio: T_Visio object
 * p_mapReferenceShape: map: (String) numeric Master-Shape ID --> 
 * visShapeToProcess: VIS_ShapeToProcess, pre initialized with .vShape = VShape  // .bIsGrouping = false // .bIsFreeFormText = true // .nSymbol = 0
*/
function postProcessShapeWithoutMaster(p_visio, p_mapReferenceShape, visShapeToProcess)
{
    if(!isCrossFunctionalFlowChartImport()) //is curomized handling needed?
        return;
    
    //this is how to get the mapped symbol num of a master shape (by numeric master ID sMaster):
    //var masterSymbolNum = p_mapReferenceShape.get(javaInt.valueOf(sMaster)).getMasterSymbolNum()
    
    //XML namespace for visio file elements: p_visio.getNamespace()
    var geom = p_visio.getLoader().getShapeGeometry(visShapeToProcess.vShape)
    if(geom!=null)
    {    
        //check for yellow triangle with red border --> governance
        var moveTos = geom.lstMoveTo;
        var lineTos = geom.lstLineTo;
        if(moveTos!=null && lineTos!=null)
        {
            if(moveTos.size()>0 && lineTos.size()>0)
            {
                var color = p_visio.getLoader().getShapeLineColor( visShapeToProcess.vShape )
                if(color!=null)
                {
                    if(color.equalsIgnoreCase("#ff0000"))
                    {
                        visShapeToProcess.bIsFreeFormText = false
                        visShapeToProcess.nSymbol = Constants.ST_BUSINESS_POLICY
                        return;
                    }
                    else if(lineTos.size()==4)
                    {
                        var fillColor = p_visio.getLoader().getShapeFillForeground(visShapeToProcess.vShape)
                        if(fillColor!=null)
                        {
                            if(fillColor.equalsIgnoreCase("#38557a"))
                            {
                                visShapeToProcess.bIsFreeFormText = false
                                visShapeToProcess.nSymbol = Constants.ST_REQUIREMENT
                                return;                                    
                            }
                            if(fillColor.equalsIgnoreCase("#ab9ac0"))
                            {
                                visShapeToProcess.bIsFreeFormText = false
                                visShapeToProcess.nSymbol = Constants.ST_REQUIREMENT
                                return;                                    
                            }
                            if(fillColor.equalsIgnoreCase("#9dbb61"))
                            {
                                visShapeToProcess.bIsFreeFormText = false
                                visShapeToProcess.nSymbol = Constants.ST_REQUIREMENT
                                return;                                    
                            }
                        }
                    }
                }
            }
        }
        
        //check for yellow circle --> Risk
        var geoShape = geom.lstEllipse
        if(geoShape!=null && geoShape.size()>0 )
        {
            var sColor = p_visio.getLoader().getShapeFillBkgnd(visShapeToProcess.vShape)
            if(sColor!=null && sColor.equalsIgnoreCase("#ffff3c"))
            {
                visShapeToProcess.bIsFreeFormText = false
                visShapeToProcess.nSymbol = Constants.ST_RISK_1 //yellow circle
                return;
            }  
            sColor = p_visio.getLoader().getShapeFillForeground(visShapeToProcess.vShape)
            if(sColor!=null) 
            {
                if(sColor.equalsIgnoreCase("#ff0000"))
                {
                    visShapeToProcess.bIsFreeFormText = false
                    visShapeToProcess.nSymbol = Constants.ST_RISK_1//red circle
                    return;
                }
                if(sColor.equalsIgnoreCase("#ffc000"))
                {
                    visShapeToProcess.bIsFreeFormText = false
                    visShapeToProcess.nSymbol = Constants.ST_RISK_1//orange circle
                    return;
                }
                if(sColor.equalsIgnoreCase("#00b050"))
                {
                    visShapeToProcess.bIsFreeFormText = false
                    visShapeToProcess.nSymbol = Constants.ST_RISK_1//green circle
                    return;
                }
            }                 
        }//ellipse
         
    }//geom
}

/**
 * called to evaluate sub shapes of a mapped symbol.
 * At this point of time the model and the occ are already created in ARIS.
 *
 * p_visio T_Visio, especially for p_visio.getNamespace()
 * p_visShape VIS_Shape: visShape.nID = shape ID number // visShape.sNameU = nameU of shape // visShape.ocShape = ARIS ObjOcc // visShape.bObjOcc = true
 * p_visShapeToProcess VIS_ShapeToProcess, pre initialized with .vShape = shape element // .bIsGrouping = false // .bIsFreeFormText = true // .nSymbol = 0
 *
 * return value "bSubShapesProcessed" : true if the subshapes were processed an should not considered by the default implementation any more (this would aggregate subshape texts in AT_NAME)
*/
function processSubShapesOfArisObject(p_visio, p_visShape, p_visShapeToProcess)
{
    if(isBPMN2Import())
    {
        if(p_visShape.ocShape==null)
            return false;
        
        var arisSymbolType = p_visShape.ocShape.getSymbol()
        if(arisSymbolType==Constants.ST_BPMN_TASK) //only refinement for generic task symbol here
            return handleBPMNTask(p_visio, p_visShape, p_visShapeToProcess);
        if(arisSymbolType==Constants.ST_BPMN_START_EVENT || arisSymbolType==Constants.ST_BPMN_END_EVENT || arisSymbolType==Constants.ST_BPMN_INTERMEDIATE_EVENT)
            return handleBPMNEvent(arisSymbolType, p_visio, p_visShape, p_visShapeToProcess);
        if(arisSymbolType==Constants.ST_BPMN_RULE_1)
            return handleBPMNGateway(p_visio, p_visShape, p_visShapeToProcess);
        
    }
    
    if(!isCrossFunctionalFlowChartImport()) //is curomized handling needed?
        return false;
    
    
    var lstShape = p_visio.getLoader().getChildShapes( p_visShapeToProcess.vShape )//VShape[]
    for(var itShape in lstShape)
    {
        var vShape = lstShape[itShape];
        var sText = vShape.getText()
        if(sText.length>0)
        {
            sText = removeBadCRLFCharacterFromText(sText)
            if(p_visShape==null)
            {
                var x = 1; //stop here!
            }
            if(p_visShape.ocShape==null)
            {
                var x = 1; //stop here!
            }
            
            if(isNumberAndDots(sText) && ArisData.ActiveFilter().IsValidAttrType(Constants.CID_OBJDEF, p_visShape.ocShape.ObjDef().TypeNum(), Constants.AT_HIER_NUM))
            {
                p_visShape.ocShape.ObjDef().Attribute(Constants.AT_HIER_NUM, g_nLoc, false).setValue(sText);
                var attrOcc = p_visShape.ocShape.AttrOcc(Constants.AT_HIER_NUM)
                attrOcc.Create(Constants.ATTROCC_CENTERTOP, ArisData.getActiveDatabase().defaultFontStyle())

                var attrOccName = p_visShape.ocShape.AttrOcc(Constants.AT_NAME)
                attrOccName.SetPortOptions(Constants.ATTROCC_CENTERBOTTOM, 0);
            }
            else
            {
                var attr = p_visShape.ocShape.ObjDef().Attribute(Constants.AT_NAME, g_nLoc, false) 
                var sOldValue = "" + attr.getValue();
                if(sOldValue.length>0)
                    sOldValue = sOldValue + "\n" + sText;
                else
                    sOldValue = sText;
                attr.setValue( sOldValue );
            }
        }
    }
    
    return true;
    
    function handleBPMNEvent(arisSymbolType, p_visio, p_visShape, p_visShapeToProcess)
    {
        var nDefTaskSymbol = null

        // Interrupting;Non-Interrupting for intermediate events on the border of functions
        var sInterruptingValue = getPropValue(p_visShapeToProcess.vShape, "Interrupting", p_visio)//e.g. in ML RSPA Tech Proc V2 sample:
        var bNonInterrupting = sInterruptingValue.indexOf("non-interrupting")==0;        

        if(arisSymbolType==Constants.ST_BPMN_START_EVENT)
        {
            var sTriggerValue = getPropValue(p_visShapeToProcess.vShape, "StartEventTrigger", p_visio)//e.g. in ML RSPA Tech Proc V2 sample:
            // None;Message;Timer;     Signal;Escalation;Conditional;Error;Compensation;Multiple;Parallel Multiple
            if(sTriggerValue.indexOf("message")==0)
                nDefTaskSymbol = bNonInterrupting?Constants.ST_BPMN_MESSAGE_START_NI:Constants.ST_BPMN_MESSAGE_START_EVENT;
            if(sTriggerValue.indexOf("timer")==0)
                nDefTaskSymbol = bNonInterrupting?Constants.ST_BPMN_TIMER_START_NI:Constants.ST_BPMN_TIMER_START_EVENT;
            if(sTriggerValue.indexOf("signal")==0)
                nDefTaskSymbol = bNonInterrupting?Constants.ST_BPMN_SIGNAL_START_NI:Constants.ST_BPMN_SIGNAL_START_EVENT;
            if(sTriggerValue.indexOf("escalation")==0)
                nDefTaskSymbol = bNonInterrupting?Constants.ST_BPMN_ESCALATION_START_NI:Constants.ST_BPMN_ESCALATION_START;
            if(sTriggerValue.indexOf("conditional")==0)
                nDefTaskSymbol = bNonInterrupting?Constants.ST_BPMN_CONDITIONAL_START_NI:Constants.ST_BPMN_RULE_START_EVENT;
            if(sTriggerValue.indexOf("error")==0)
                nDefTaskSymbol = Constants.ST_BPMN_ERROR_START;
            if(sTriggerValue.indexOf("compensation")==0)
                nDefTaskSymbol = Constants.ST_BPMN_COMPENSATION_START;
            if(sTriggerValue.indexOf("multiple")==0)
                nDefTaskSymbol = bNonInterrupting?Constants.ST_BPMN_MULTIPLE_START_NI:Constants.ST_BPMN_MULTIPLE_START_EVENT;
            if(sTriggerValue.indexOf("parallel multiple")==0)
                nDefTaskSymbol = bNonInterrupting?Constants.ST_BPMN_PARALLEL_MULTIPLE_START_NI:Constants.ST_BPMN_PARALLEL_MULTIPLE_START;
        }
        else if( arisSymbolType==Constants.ST_BPMN_END_EVENT )
        {
            var sTriggerValue = getPropValue(p_visShapeToProcess.vShape, "EndEventResult", p_visio)//e.g. in ML MS Visio KS sample:
            // None;Message;Terminate;Signal;Escalation;Error;Cancel;Compensation;Multiple
            if(sTriggerValue.indexOf("message")==0)
                nDefTaskSymbol = Constants.ST_BPMN_MESSAGE_END_EVENT;
            if(sTriggerValue.indexOf("terminate")==0)
                nDefTaskSymbol = Constants.ST_BPMN_TERMINATE_END_EVENT;
            if(sTriggerValue.indexOf("signal")==0)
                nDefTaskSymbol = Constants.ST_BPMN_SIGNAL_END_EVENT;
            if(sTriggerValue.indexOf("escalation")==0)
                nDefTaskSymbol = Constants.ST_BPMN_ESCALATION_END;
            if(sTriggerValue.indexOf("error")==0)
                nDefTaskSymbol = Constants.ST_BPMN_ERROR_END_EVENT;
            if(sTriggerValue.indexOf("cancel")==0)
                nDefTaskSymbol = Constants.ST_BPMN_CANCEL_END_EVENT;
            if(sTriggerValue.indexOf("compensation")==0)
                nDefTaskSymbol = Constants.ST_BPMN_COMPENSATION_END_EVENT;
            if(sTriggerValue.indexOf("multiple")==0)
                nDefTaskSymbol = Constants.ST_BPMN_MULTIPLE_END_EVENT;
        }
        else if (arisSymbolType==Constants.ST_BPMN_INTERMEDIATE_EVENT)
        {
            //only interdiate:
            var sCatchingValue = getPropValue(p_visShapeToProcess.vShape, "CatchingOrThrowing", p_visio)//e.g. in ML RSPA Tech Proc V2 sample:
            // Catching;Throwing
            var bCatching = sCatchingValue.indexOf("catching")==0;  

            var sTriggerValue = getPropValue(p_visShapeToProcess.vShape, "IntermediateEventTrigger", p_visio)//e.g. in ML RSPA Tech Proc V2 sample:
            // None;Message;Timer;Link;Signal;Escalation;Conditional;Error;Compensation;Multiple;Parallel Multiple;Cancel

            if(sTriggerValue.indexOf("message")==0)
            {
                if(bNonInterrupting)
                    nDefTaskSymbol = Constants.ST_BPMN_MESSAGE_INTERMEDIATE_NI;
                else
                    nDefTaskSymbol = bCatching ? Constants.ST_BPMN_MESSAGE_INTERMEDIATE_CATCH:Constants.ST_BPMN_MESSAGE_INTERMEDIATE_THROW;
            }
            if(sTriggerValue.indexOf("timer")==0)
                nDefTaskSymbol = bNonInterrupting?Constants.ST_BPMN_TIMER_INTERMEDIATE_NI:Constants.ST_BPMN_TIMER_INTERMEDIATE_EVENT;
            if(sTriggerValue.indexOf("link")==0)
                nDefTaskSymbol = bCatching ? Constants.ST_BPMN_LINK_INTERMEDIATE_CATCH:Constants.ST_BPMN_LINK_INTERMEDIATE_THROW;
            if(sTriggerValue.indexOf("signal")==0)
            {
                if(bNonInterrupting)
                    nDefTaskSymbol = Constants.ST_BPMN_SIGNAL_INTERMEDIATE_NI;
                else
                    nDefTaskSymbol = bCatching ? Constants.ST_BPMN_SIGNAL_INTERMEDIATE_EVENT:Constants.ST_BPMN_SIGNAL_INTERMEDIATE_THROW;
            }
            if(sTriggerValue.indexOf("escalation")==0)
            {
                if(bNonInterrupting)
                    nDefTaskSymbol = Constants.ST_BPMN_ESCALATION_INTERMEDIATE_NI;
                else
                    nDefTaskSymbol = bCatching ? Constants.ST_BPMN_ESCALATION_INTERMEDIATE_CATCH:Constants.ST_BPMN_ESCALATION_INTERMEDIATE_THROW;
            }
            if(sTriggerValue.indexOf("conditional")==0)
                nDefTaskSymbol = bNonInterrupting?Constants.ST_BPMN_CONDITIONAL_INTERMEDIATE_NI:Constants.ST_BPMN_RULE_INTERMEDIATE_EVENT;
            if(sTriggerValue.indexOf("error")==0)
                nDefTaskSymbol = Constants.ST_BPMN_ERROR_INTERMEDIATE_EVENT;
            if(sTriggerValue.indexOf("cancel")==0)
                nDefTaskSymbol = Constants.ST_BPMN_CANCEL_INTERMEDIATE_EVENT;
            if(sTriggerValue.indexOf("compensation")==0)
                nDefTaskSymbol = bCatching ? Constants.ST_BPMN_COMPENSATION_INTERMEDIATE_CATCH:Constants.ST_BPMN_COMPENSATION_INTERMEDIATE_THROW;
            if(sTriggerValue.indexOf("multiple")==0)
            {
                if(bNonInterrupting)
                    nDefTaskSymbol = Constants.ST_BPMN_MULTIPLE_INTERMEDIATE_NI;
                else
                    nDefTaskSymbol = bCatching ? Constants.ST_BPMN_MULTIPLE_INTERMEDIATE_CATCH:Constants.ST_BPMN_MULTIPLE_INTERMEDIATE_THROW;
            }
            if(sTriggerValue.indexOf("parallel multiple")==0)
            {
                nDefTaskSymbol = bNonInterrupting ? Constants.ST_BPMN_PARALLEL_MULTIPLE_INTERMEDIATE_NI : Constants.ST_BPMN_PARALLEL_MULTIPLE_INTERMEDIATE;
            }
        }
        
        if(nDefTaskSymbol!=null)
        {
            p_visShape.ocShape.setSymbol(nDefTaskSymbol)
            return true;
        }
        return false;
    }
    
    function handleBPMNGateway(p_visio, p_visShape, p_visShapeToProcess)
    {
        var sExplicitTaskTypeValue = getPropValue(p_visShapeToProcess.vShape, "GatewayType", p_visio)//e.g. in ML Pizza sample
        var nDefTaskSymbol = null
        if(sExplicitTaskTypeValue.indexOf("exclusive")==0)
            nDefTaskSymbol = Constants.ST_BPMN_RULE_XOR_3;
        if(sExplicitTaskTypeValue.indexOf("parallel")==0)
            nDefTaskSymbol = Constants.ST_BPMN_RULE_AND_1;
        if(sExplicitTaskTypeValue.indexOf("inclusive")==0)
            nDefTaskSymbol = Constants.ST_BPMN_RULE_OR_1;
        if(sExplicitTaskTypeValue.indexOf("event based")==0)
            nDefTaskSymbol = Constants.ST_BPMN_RULE_XOR_4;
        if(sExplicitTaskTypeValue.indexOf("complex")==0)
            nDefTaskSymbol = Constants.ST_BPMN_RULE_COMPLEX_1;
        
        if(nDefTaskSymbol!=null)
        {
            p_visShape.ocShape.setSymbol(nDefTaskSymbol)
            return true;
        }
        return false;
    }
    function handleBPMNTask(p_visio, p_visShape, p_visShapeToProcess)
    {
        var sExplicitTaskTypeValue = getPropValue(p_visShapeToProcess.vShape, "TaskType", p_visio)//e.g. in ML Pizza sample
        var nDefTaskSymbol = null
        if(sExplicitTaskTypeValue.indexOf("user")==0)
            nDefTaskSymbol = Constants.ST_BPMN_USER_TASK;
        else if(sExplicitTaskTypeValue.indexOf("service")==0)
            nDefTaskSymbol = Constants.ST_BPMN_SERVICE_TASK;
        else if(sExplicitTaskTypeValue.indexOf("send")==0)
            nDefTaskSymbol = Constants.ST_BPMN_SEND_TASK;
        else if(sExplicitTaskTypeValue.indexOf("receive")==0)
            nDefTaskSymbol = Constants.ST_BPMN_RECEIVE_TASK;
        else if(sExplicitTaskTypeValue.indexOf("manual")==0)
            nDefTaskSymbol = Constants.ST_BPMN_MANUAL_TASK;
        else if(sExplicitTaskTypeValue.indexOf("script")==0)
            nDefTaskSymbol = Constants.ST_BPMN_SCRIPT_TASK;
        else if(sExplicitTaskTypeValue.indexOf("business rule")==0)
            nDefTaskSymbol = Constants.ST_BPMN_BUSINESS_RULE_TASK;
        
        if(nDefTaskSymbol!=null)
        {
            p_visShape.ocShape.setSymbol(nDefTaskSymbol)
            return true;
        }
        
        
        //try to identify specific task symbol by examining subshapes for additional info
        var vShapes = p_visio.getLoader().getChildShapes(p_visShapeToProcess.vShape)
        for(var itShape in vShapes )
        {
            var vShape = vShapes[itShape]
            var sNameU = vShape.getNameU();
            if(sNameU!=null)
            {
                var sText = new java.lang.String(sNameU);
                if(sText.toLowerCase().indexOf("systemdefinedicon")>=0)
                {
                    var nTaskSymbol = null
                    var sIconPropValue = getPropValue(vShape, "path", p_visio)
                    if(sIconPropValue.indexOf("send")>0)
                        nTaskSymbol = Constants.ST_BPMN_SEND_TASK;
                    else if(sIconPropValue.indexOf("receive")>0)
                        nTaskSymbol = Constants.ST_BPMN_RECEIVE_TASK;
                    else if(sIconPropValue.indexOf("user")>0)
                        nTaskSymbol = Constants.ST_BPMN_USER_TASK;
                    else if(sIconPropValue.indexOf("service")>0)
                        nTaskSymbol = Constants.ST_BPMN_SERVICE_TASK;

                    if(nTaskSymbol!=null)
                        p_visShape.ocShape.setSymbol(nTaskSymbol)

                    return true;
                }
                else if(sText.toLowerCase().indexOf("loopmarker")>=0)
                {
                    p_visShape.ocShape.ObjDef().Attribute( Constants.AT_BPMN_LOOP_TYPE_2, Context.getSelectedLanguage() ).setValue(Constants.AVT_BPMN_STANDARD_LOOP)
                }
            }
        }
        return false;
    }

    function getPropValue(vShape, sPropNameU, p_visio)
    {
        var sValue = p_visio.getLoader().getShapeProperty(vShape, sPropNameU)
        return sValue.toLowerCase();
    }
    
    function removeBadCRLFCharacterFromText(sText)
    {
        var idx = searchFor8232(sText);
        while (idx >= 0) {
            var sNewText = sText.substring(0, idx) + "\n" + sText.substring(idx+1, sText.length)
            sText = sNewText;
            
            idx = searchFor8232(sText);
        }
        return sText;
    }

    function searchFor8232(sText) {
        for (var i = 0; i < sText.length; i++) {
            if (sText.charCodeAt(i) == 8232) 
                return i;
        }
        return -1;
    }

    function isNumberAndDots(sText)
    {
        for(var i=0; i<sText.length; i++)
            if( (sText[i]<'0' || sText[i]>'9') && sText[i]!='.')
                return false;
        
        return true;
    }    
}

/**
 * called to add information for particular created ARIS objects using the information from corresponding shapes
 * At this point of time the model and the occ are already created in ARIS.
 *
 * p_visio: T_Visio, especially for p_visio.getNamespace()
 * p_listAllCreatedShapes: LinkedList of T_Shape2Aris=(shapeToProcess VIS_ShapeToProcess + shapeArisOcc VIS_Shape)
 *     VIS_Shape: visShape.nID = shape ID number // visShape.sNameU = nameU of shape // visShape.ocShape = ARIS ObjOcc // visShape.bObjOcc 
 *     VIS_ShapeToProcess, pre initialized with .vShape = VShape // .bIsGrouping  // .bIsFreeFormText  // .nSymbol
*/
function postProcessCreatedObjects(p_tVisio, p_listAllCreatedShapes)
{
    if(!isCrossFunctionalFlowChartImport()) //is curomized handling needed?
        return;
    
    var laneAsArisSymbol = p_tVisio.getSymbolByNameU("Swimlane")
    if(laneAsArisSymbol==null)
        return;    
    
    var itShape = p_listAllCreatedShapes.iterator()
    while(itShape.hasNext() )
    {
        var createdShape = itShape.next(); //T_Shape2Aris
        
        //this fixes the model generation "bug" if the controls + events were also assigned to the OrgUnit:
        if("shape".equalsIgnoreCase(createdShape.shapeArisOcc.sNameU))
            continue;
        if(Constants.ST_EV==createdShape.shapeArisOcc.ocShape.SymbolNum())
            continue;
        if(Constants.ST_INFO_CARR==createdShape.shapeArisOcc.ocShape.SymbolNum())
            continue;
        //Visio assigns some controls to the wrong lane (because they are modeled this way)
        if(Constants.ST_CONTR==createdShape.shapeArisOcc.ocShape.SymbolNum())
            continue;
        
        var mapShapeUserProperties = createdShape.shapeToProcess.properties; //here visio stores the connection between object and swimlane *sic
        var nameLane = mapShapeUserProperties.get("Function") //the name of the user property. value is the name of the swimlane or null if this does not apply to the shape        
        if(nameLane!=null)
        {            
            var cxnType = p_tVisio.getMapping().getCxnType("Swimlane", createdShape.shapeArisOcc.sNameU)            
            if(cxnType>0)
            {
                
                var arisModel = createdShape.shapeArisOcc.ocShape.Model()                
                var aSwimLaneOccs = arisModel.ObjOccListFilter(nameLane, g_nLoc);
                for(var i=0; i<aSwimLaneOccs.length; i++) //should always be 1
                {
                    var cxnOcc = arisModel.CreateCxnOcc( aSwimLaneOccs[i], createdShape.shapeArisOcc.ocShape, cxnType, getPoints(aSwimLaneOccs[i], createdShape.shapeArisOcc.ocShape), false, false)
                    if(cxnOcc!=null)
                        cxnOcc.setVisible(false);
                }
            }            
        }       
    }
    
}

function getPoints(srcObjOcc,  trgObjOcc) {
    var point1 = new java.awt.Point(srcObjOcc.X(), srcObjOcc.Y() + srcObjOcc.Height()/2);         
    var point2 = new java.awt.Point(trgObjOcc.X() + trgObjOcc.Width()/2, srcObjOcc.Y() + srcObjOcc.Height()/2);         
    var point3 = new java.awt.Point(trgObjOcc.X() + trgObjOcc.Width()/2, trgObjOcc.Y() + trgObjOcc.Height());         
    return [point1, point2, point3];
}

const c_bDeleteOriginalEPCs = false

/**
 * This function is called after the (internal) import of a model is complete.
 * modelNew: created ARIS model after import
 * 
 * return value: model to be opened in ARIS after import finished. null if no model should be opened.
*/
function postProcessCreatedModel(modelNew, vPage, p_loader)
{
    if(isCrossFunctionalFlowChartImport()) //is curomized handling needed?
        return postProcessCrossFunctionalFlowchart(modelNew, vPage, p_loader);

    if(isBasicFlowChartImport())
         return postProcessBasicFlowChart(modelNew, vPage, p_loader);
     
   return modelNew;
}

function isBPMN2TargetModel(modelType)
{
    var TYPES = bpmnSupport.getBPMNModelTypes()
    for(var i in TYPES)
    {
        if(modelType == TYPES[i])
            return true;
    }
    return false;
}

function postProcessCrossFunctionalFlowchart(modelNew, vPage, p_loader)
{
    Context.writeStatus("Postprocessing...")
    ArisData.Save(Constants.SAVE_ONDEMAND)
    addMissingCxns(modelNew)
    removeSpacesAndLineBreak(modelNew)
    ArisData.Save(Constants.SAVE_NOW)
    
    if(pageUsesSwimlanes( vPage, p_loader) && !isBPMN2TargetModel(modelNew.TypeNum()) )
    {
        modelNewRowEPC = generateRowModel(modelNew)
        if(modelNewRowEPC!=null)
        {
            layoutRowModel(modelNewRowEPC)
        
            replaceSymbols(modelNewRowEPC)
            if(!c_bDeleteOriginalEPCs) 
            {
                replaceSymbols(modelNew)
                fixAttributePlacementsInRowModel(modelNew, false)
            }
            
            fixAttributePlacementsInRowModel(modelNewRowEPC, true)
            //removeOccsWithoutRelations(modelNewRowEPC) //looks nicer but maybe deletes important objects
            
            copyFFT2RowModel(modelNew, modelNewRowEPC)
            if(c_bDeleteOriginalEPCs)
                modelNew.Group().Delete(modelNew)
            
            //ArisData.Save(Constants.SAVE_NOW)
            //consolidateModel(modelNewRowEPC)
            
            ArisData.Save(Constants.SAVE_NOW)
            ArisData.Save(Constants.SAVE_AUTO)
            return modelNewRowEPC;
        }
        else
        {
            replaceSymbols(modelNew)
            fixAttributePlacementsInRowModel(modelNew, false)
            ArisData.Save(Constants.SAVE_NOW)
            return modelNew;
        }
    }
    else
    {
        replaceSymbols(modelNew)
        fixAttributePlacementsInRowModel(modelNew, false)
        ArisData.Save(Constants.SAVE_NOW)
        return modelNew;
    }
}

function postProcessBasicFlowChart(modelNew, vPage, p_loader)
{
    Context.writeStatus("Postprocessing...")
    ArisData.Save(Constants.SAVE_ONDEMAND)
    fixAttributePlacementsInRowModel(modelNew, false)
    ArisData.Save(Constants.SAVE_NOW)
    return modelNew;
}

//
// postprocessing helpers follow here:
//

function pageUsesSwimlanes(vPage, p_loader)
{
    var aShapes = p_loader.getPageShapes(vPage)
    for(var iShape in aShapes )
    {
        var vShape = aShapes[iShape];
        var sNameU = vShape.getNameU();
        if(sNameU!=null)
        {
            var sText = new java.lang.String(sNameU);
            if(sText.indexOf("CFF Cont")>=0 || sText.indexOf("Swimlane")>=0)
                return true;
        }
    }
    return false;
}

function layoutRowModel(modelNewRowEPC)
{
    resizeStandardSymbols(modelNewRowEPC) //do the layout with standard symbols which have the size of the userdef symbols -> work around method bug

    ArisData.Save(Constants.SAVE_NOW) //designer reloads...
    
    var layoutOptions = ArisData.getModelOptions().getLayoutParameters(modelNewRowEPC.TypeNum())
    setParams(layoutOptions)
    
    modelNewRowEPC.doLayout()
    modelNewRowEPC.changeFlag(Constants.MODEL_LAYOUTONOPEN, false); //do not destroy our nice layout
    
    function setParams(layoutParams) {
        layoutParams.setSpacingX(50);               // Minimum object spacing - Horizontally
        layoutParams.setSpacingY(20);               // Minimum object spacing - Vertically
        layoutParams.setScaleObjects(true);         // Scale objects
        layoutParams.setMinimizeCxnAnchors(true);   // Minimize connection anchor points
                                                    // Allow connection alignment acroos objects
        layoutParams.setHorizontalLayout(true);     // Horizontal layout
        layoutParams.setInsertSpace(true);          // Insert space when applying part layout
        layoutParams.setLongestPathPosition(1);     // Alignment -> Longest path - centered (1)
        layoutParams.setArrangeSatellites(2);       // Satellites arrangement -> vertically=2
        layoutParams.setRootNodePosition(1);        // Root node position -> 1: place single roots lower
                                                    // Margins - Top margin
                                                    // Margins - Left margin
    }    
}


const START_EVENTS = [Constants.ST_BPMN_START_EVENT,Constants.ST_BPMN_MESSAGE_START_EVENT,Constants.ST_BPMN_SIGNAL_START_EVENT,Constants.ST_BPMN_TIMER_START_EVENT,Constants.ST_BPMN_ERROR_START,Constants.ST_BPMN_RULE_START_EVENT,Constants.ST_BPMN_ESCALATION_START,Constants.ST_BPMN_COMPENSATION_START,Constants.ST_BPMN_MULTIPLE_START_EVENT,Constants.ST_BPMN_PARALLEL_MULTIPLE_START ];   
    
const ACTIVITY_TYPE_TASK_SYMBOLS = [Constants.ST_BPMN_TASK,Constants.ST_BPMN_BUSINESS_RULE_TASK,Constants.ST_BPMN_MANUAL_TASK_2,
        Constants.ST_BPMN_RECEIVE_TASK,Constants.ST_BPMN_SCRIPT_TASK,Constants.ST_BPMN_SEND_TASK,Constants.ST_BPMN_SERVICE_TASK,
        Constants.ST_BPMN_USER_TASK,Constants.ST_BPMN_SUB_PROCESS_COLLAPSED,Constants.ST_BPMN_TRANSACTION_COLLAPSED_1,
        Constants.ST_BPMN_EVENT_SUBPROCESS_COLLAPSED,Constants.ST_BPMN_CALL_ACTIVITY_COLLAPSED,Constants.ST_BPMN_SUBPROCESS,
        Constants.ST_BPMN_TRANSACTION,Constants.ST_BPMN_EVENT_SUBPROCESS,Constants.ST_BPMN_CALL_ACTIVITY,Constants.ST_BPMN_CALL_ACTIVITY_COLLAPSED];

const EVENT_SYMBOL_ATTR_VALUE = [
    [ [Constants.ST_BPMN_START_EVENT, Constants.ST_BPMN_INTERMEDIATE_EVENT,Constants.ST_BPMN_END_EVENT], Constants.AVT_NONE_1], //None
    [ [Constants.ST_BPMN_ESCALATION_START, Constants.ST_BPMN_ESCALATION_START_NI, Constants.ST_BPMN_ESCALATION_INTERMEDIATE_THROW,
       Constants.ST_BPMN_ESCALATION_INTERMEDIATE_CATCH, Constants.ST_BPMN_ESCALATION_INTERMEDIATE_NI, Constants.ST_BPMN_ESCALATION_END], Constants.AVT_BPMN_EV_TYPE_ESCALATION], //Escalation
    [ [Constants.ST_BPMN_RULE_START_EVENT, Constants.ST_BPMN_CONDITIONAL_START_NI,Constants.ST_BPMN_RULE_INTERMEDIATE_EVENT,Constants.ST_BPMN_CONDITIONAL_INTERMEDIATE_NI], Constants.AVT_BPMN_EV_TYPE_RULE], //Conditional
    [ [Constants.ST_BPMN_SIGNAL_START_EVENT, Constants.ST_BPMN_SIGNAL_START_NI, Constants.ST_BPMN_SIGNAL_INTERMEDIATE_EVENT,
       Constants.ST_BPMN_SIGNAL_INTERMEDIATE_THROW, Constants.ST_BPMN_SIGNAL_INTERMEDIATE_NI], Constants.AVT_BPMN_EV_TYPE_SIGNAL], //Signal
    [ [Constants.ST_BPMN_ERROR_START, Constants.ST_BPMN_ERROR_INTERMEDIATE_EVENT,Constants.ST_BPMN_ERROR_END_EVENT], Constants.AVT_BPMN_EV_TYPE_EXCEPTION], //Error
    [ [Constants.ST_BPMN_CANCEL_INTERMEDIATE_EVENT, Constants.ST_BPMN_CANCEL_END_EVENT], Constants.AVT_BPMN_EV_TYPE_CANCEL], //Cancel
    [ [Constants.ST_BPMN_COMPENSATION_START, Constants.ST_BPMN_COMPENSATION_INTERMEDIATE_THROW, Constants.ST_BPMN_COMPENSATION_INTERMEDIATE_CATCH,
       Constants.ST_BPMN_COMPENSATION_END_EVENT], Constants.AVT_BPMN_EV_TYPE_COMPENSATION], //Compensation
    [ [Constants.ST_BPMN_LINK_INTERMEDIATE_CATCH, Constants.ST_BPMN_LINK_INTERMEDIATE_THROW], Constants.AVT_BPMN_EV_TYPE_LINK], //Link
    [ [Constants.ST_BPMN_MESSAGE_START_EVENT, Constants.ST_BPMN_MESSAGE_START_NI, Constants.ST_BPMN_MESSAGE_INTERMEDIATE_CATCH,
       Constants.ST_BPMN_MESSAGE_INTERMEDIATE_NI, Constants.ST_BPMN_MESSAGE_INTERMEDIATE_THROW, Constants.ST_BPMN_MESSAGE_END_EVENT], Constants.AVT_BPMN_EV_TYPE_MESSAGE], //Message
    [ [Constants.ST_BPMN_MULTIPLE_START_EVENT, Constants.ST_BPMN_MULTIPLE_START_NI, Constants.ST_BPMN_MULTIPLE_INTERMEDIATE_CATCH,
       Constants.ST_BPMN_MULTIPLE_INTERMEDIATE_THROW, Constants.ST_BPMN_MULTIPLE_INTERMEDIATE_NI, Constants.ST_BPMN_MULTIPLE_END_EVENT,
       Constants.ST_BPMN_PARALLEL_MULTIPLE_START, Constants.ST_BPMN_PARALLEL_MULTIPLE_START_NI, Constants.ST_BPMN_PARALLEL_MULTIPLE_INTERMEDIATE, 
       Constants.ST_BPMN_PARALLEL_MULTIPLE_INTERMEDIATE_NI], Constants.AVT_BPMN_EV_TYPE_MULTIPLE], //Multiple
    [ [Constants.ST_BPMN_TERMINATE_END_EVENT], Constants.AVT_BPMN_EV_TYPE_TERMINATE], //Terminate
    [ [Constants.ST_BPMN_TIMER_START_EVENT, Constants.ST_BPMN_TIMER_START_NI, Constants.ST_BPMN_TIMER_INTERMEDIATE_EVENT,
       Constants.ST_BPMN_TIMER_INTERMEDIATE_NI], Constants.AVT_BPMN_EV_TYPE_TIMER] //Timer
    ];

function fixBPMNTypeAttributes(model)
{
    var setTaskSymbols = new java.util.HashSet()
    for(var i in ACTIVITY_TYPE_TASK_SYMBOLS)
        setTaskSymbols.add(ACTIVITY_TYPE_TASK_SYMBOLS[i])

    var gv_Lang = Context.getSelectedLanguage()
    var aOccs = model.ObjOccList()        
    for(var i in aOccs)   
    {
        var nSymbol = aOccs[i].OrgSymbolNum()
        if(setTaskSymbols.contains(nSymbol))
        {
            
            aOccs[i].ObjDef().Attribute(Constants.AT_BPMN_ACTIVITY_TYPE, gv_Lang ).setValue(Constants.AVT_BPMN_TASK)
            
            if(nSymbol==Constants.ST_BPMN_TASK)
                aOccs[i].ObjDef().Attribute(Constants.AT_BPMN_TASK_TYPE_2, gv_Lang ).setValue(Constants.AVT_BPMN_TASK_TYPE_ABSTRACT)     
            if(nSymbol==Constants.ST_BPMN_BUSINESS_RULE_TASK)
                aOccs[i].ObjDef().Attribute(Constants.AT_BPMN_TASK_TYPE_2, gv_Lang ).setValue(Constants.AVT_BPMN_TASK_TYPE_BUSINESS_RULE)     
            if(nSymbol==Constants.ST_BPMN_MANUAL_TASK_2)
                aOccs[i].ObjDef().Attribute(Constants.AT_BPMN_TASK_TYPE_2, gv_Lang ).setValue(Constants.AVT_BPMN_TASK_TYPE_MANUAL)     
            if(nSymbol==Constants.ST_BPMN_RECEIVE_TASK)
                aOccs[i].ObjDef().Attribute(Constants.AT_BPMN_TASK_TYPE_2, gv_Lang ).setValue(Constants.AVT_BPMN_TASK_TYPE_RECEIVE)     
            if(nSymbol==Constants.ST_BPMN_SCRIPT_TASK)
                aOccs[i].ObjDef().Attribute(Constants.AT_BPMN_TASK_TYPE_2, gv_Lang ).setValue(Constants.AVT_BPMN_TASK_TYPE_SCRIPT)     
            if(nSymbol==Constants.ST_BPMN_SEND_TASK)
                aOccs[i].ObjDef().Attribute(Constants.AT_BPMN_TASK_TYPE_2, gv_Lang ).setValue(Constants.AVT_BPMN_TASK_TYPE_SEND)     
            if(nSymbol==Constants.ST_BPMN_SERVICE_TASK)
                aOccs[i].ObjDef().Attribute(Constants.AT_BPMN_TASK_TYPE_2, gv_Lang ).setValue(Constants.AVT_BPMN_TASK_TYPE_SERVICE)     
            if(nSymbol==Constants.ST_BPMN_USER_TASK)
                aOccs[i].ObjDef().Attribute(Constants.AT_BPMN_TASK_TYPE_2, gv_Lang ).setValue(Constants.AVT_BPMN_TASK_TYPE_USER)     
        }
        else
        {
            //check event symbols
            var bHandled = false;
            for(var j in EVENT_SYMBOL_ATTR_VALUE)
            {
                var aSymbols = EVENT_SYMBOL_ATTR_VALUE[j][0]
                var nValue   = EVENT_SYMBOL_ATTR_VALUE[j][1]
                for(var iSym in aSymbols)
                {
                    if(aSymbols[iSym]==nSymbol)
                    {
                        aOccs[i].ObjDef().Attribute(Constants.AT_BPMN_EVENT_DEFINITION, gv_Lang ).setValue(nValue)   
                        bHandled = true;
                        break;
                    }
                }
                if(bHandled)
                    break;
            }
        }
    }
}

 
function fixAttributePlacementsInRowModel(oModel, bAddCxnAttr)
{
    var font = getDefaultFont()
    updateAttrPlacements(getFunctions(oModel));
    updateAttrPlacementsIC(getInfoCarriersAndGateways(oModel));
    
    if(bAddCxnAttr)
    {
        updateCxnAttrPlacements( oModel.CxnOccList() )
    }

    function updateAttrPlacements(oOccList) {
        for (var i in oOccList) {
            var oOcc = oOccList[i];
            
            var oAttrOcc = oOcc.AttrOcc(Constants.AT_HIER_NUM);
            if (!oAttrOcc.Exist()) 
                oAttrOcc.Create(Constants.ATTROCC_CENTERTOP, font);
            oAttrOcc.SetPortOptions(Constants.ATTROCC_CENTERTOP, Constants.ATTROCC_TEXT);
            
            var oAttrOcc = oOcc.AttrOcc(Constants.AT_NAME);
            if (!oAttrOcc.Exist()) 
                oAttrOcc.Create(Constants.ATTROCC_CENTERBOTTOM, font);
            oAttrOcc.SetPortOptions(Constants.ATTROCC_CENTERBOTTOM, Constants.ATTROCC_TEXT);
        }
    }

    function updateAttrPlacementsIC(oOccList) {
        for (var i in oOccList) {
            var oOcc = oOccList[i];
            
            var oAttrOcc = oOcc.AttrOcc(Constants.AT_NAME);
            if (!oAttrOcc.Exist()) 
                oAttrOcc.Create(Constants.ATTROCC_CENTER, font);
            oAttrOcc.SetPortOptions(Constants.ATTROCC_CENTER, Constants.ATTROCC_TEXT);
        }
    }
    
    function updateCxnAttrPlacements(oCxnOccs)
    {
        for (var i in oCxnOccs) {
            var oOcc = oCxnOccs[i];
            
            var oAttrOcc = oOcc.AttrOcc(Constants.AT_CXN_ROLE);
            if (!oAttrOcc.Exist()) 
                oAttrOcc.Create(Constants.ATTROCC_TOP, font);
        }
    }
    
    function getFunctions(oModel) {
        return oModel.ObjOccListBySymbol([Constants.ST_FUNC]);
    }
    
    function getInfoCarriersAndGateways(oModel) {
        return oModel.ObjOccListBySymbol([Constants.ST_INFO_CARR, Constants.ST_BPMN_RULE, Constants.ST_OPR_RULE]);
    }

    function getDefaultFont() {
        var ofontstylelist = ArisData.getActiveDatabase().FontStyleList();
        for (var i = 0 ; i < ofontstylelist.length ; i++ ) {
            if (ofontstylelist[i].IsDefaultFontStyle()) {
                return ofontstylelist[i];
            }
        }
        return ofontstylelist[0];
    }
    
}

function addMissingCxns(oModel)
{
    var diffY = 10;
    
    var oRisks = getRisks(oModel);
    var oIstars = getIstars(oModel);
    var oControls = getControls(oModel);
    var oPolicies = getPolicies(oModel);
    var oInfoCarriers = getInfoCarriers(oModel);     
    
    var oFunctions = getFunctions(oModel);
    for (var j in oFunctions) {
        var oFunction = oFunctions[j];
        
        addMissingCxns(oFunction, oRisks, Constants.CT_OCCUR);
        addMissingCxns(oFunction, oControls, Constants.CT_IS_PERFORMED_AT);
        addMissingCxns(oFunction, oPolicies, Constants.CT_AFFECTS);
        addMissingCxns(oFunction, oInfoCarriers, Constants.CT_PROV_INP_FOR); 
        addMissingCxns(oFunction, oIstars, Constants.CT_REFS_TO_2); 
        
        //connect the CONTROLs to the correct OrgUnit-->otherwise ModelGeneration of row model assigns them to another lane because they are function ObjDefs with no OrgUnit assigned!
        var connectedControls = oFunction.getConnectedObjOccs(Constants.ST_CONTR)
        var connectedOrgUnits = oFunction.getConnectedObjOccs([Constants.ST_ORG_UNIT_1,Constants.ST_ORG_UNIT_2,Constants.ST_ORG_UNIT_3])
        if(connectedOrgUnits.length>0) //should always be 1
        {
            for(var i=0; i<connectedControls.length; i++)
            {
                var cxnOcc = oModel.CreateCxnOcc(connectedOrgUnits[0], connectedControls[i], Constants.CT_EXEC_1, getPoints(connectedOrgUnits[0], connectedControls[i]), false, false)
                if(cxnOcc!=null)
                    cxnOcc.setVisible(false);
            }
        } 
    }  
    
    function addMissingCxns(oFunction, oOccList, nCxnType) {
        
        var oNeighbourOccs = filterOccs(oFunction, oOccList); 
        for (var i in oNeighbourOccs) {
            var oNeighbour = oNeighbourOccs[i];
            
            var oCxn = oModel.CreateCxnOcc(oNeighbour, oFunction, nCxnType, getPointList(oNeighbour, oFunction))
            //if (oCxn.IsValid()) oCxn.setVisible(false);
        }

        function getPointList(oSrc, oTrg) {
            var xPos = oSrc.X() + oSrc.Width()/2;
            var point1, point2;
            if (oSrc.Y() < oTrg.Y()) {
                point1 = new java.awt.Point(xPos, oSrc.Y() + oSrc.Height());
                point2 = new java.awt.Point(xPos, oTrg.Y());
            } else {
                point1 = new java.awt.Point(xPos, oSrc.Y());
                point2 = new java.awt.Point(xPos, oTrg.Y() + oTrg.Height());
            }
            return [point1, point2];
        }
    }
    

    function filterOccs(oFunction, oOccList) {
        var oNeighbourOccs = new Array()
        
        var xLeft = oFunction.X();
        var xRight = oFunction.X() + oFunction.Width();
        var yTop = oFunction.Y();
        var yBottom = oFunction.Y() + oFunction.Height();
        
        for (;;) {
            var oNeighbour = getNeighbour();
            if (oNeighbour != null) {
                oNeighbourOccs.push(oNeighbour);
            } else {
                break;
            }
        }
        return oNeighbourOccs;
        
        function getNeighbour() {
            for (var i in oOccList) {
                var oOcc = oOccList[i];
                if (isAlreadyInList(oOcc)) continue;
    
                var xPosL = oOcc.X();
                var xPosR = oOcc.X() + oOcc.Width();
                var yPosT = oOcc.Y();
                var yPosB = oOcc.Y() + oOcc.Height();
                
                if (isRelevantOcc()) {
                    yTop = Math.min(yTop, yPosT);
                    yBottom = Math.max(yBottom, yPosB);
                    
                    return oOcc;
                }
            }
            return null;
            
            function isAlreadyInList(oOcc) {
                for (var i in oNeighbourOccs) {
                    if (oOcc.IsEqual(oNeighbourOccs[i])) return true;
                }
                return false;
            } 
            
            function isRelevantOcc() {
                // xPos
                if (xPosR < xLeft) return false;
                if (xPosL > xRight) return false;
                
                // yPos
                if ( (yPosT > yTop) && (yPosT <= (yBottom + diffY)) ) return true;
                if ( (yPosB < yBottom) && (yPosB >= (yTop - diffY)) ) return true;
                return false;
            }
        }
    }
    
    function getFunctions(oModel) {
        return oModel.ObjOccListBySymbol([Constants.ST_FUNC]);
    }
    
    function getRisks(oModel) {
        return sortY(oModel.ObjOccListFilter(Constants.OT_RISK));
    }
    
    function getIstars(oModel) {
        return sortY(oModel.ObjOccListFilter(Constants.OT_REQUIREMENT));
    }
    
    function getPolicies(oModel) {
        return sortY(oModel.ObjOccListFilter(Constants.OT_POLICY));
    }

    function getInfoCarriers(oModel) {
        return sortY(oModel.ObjOccListFilter(Constants.OT_INFO_CARR));
    }
    
    function getControls(oModel) {
        var oControls = new Array();
        var oFuncs = oModel.ObjOccListFilter(Constants.OT_FUNC);
        
        for (var i in oFuncs) {
            var oFunc = oFuncs[i];
            if (oFunc.OrgSymbolNum() == Constants.ST_CONTR) {
                oControls.push(oFunc);
            }
        }
        return sortY(oControls);
    }
    
    function sortY(oOccList) {
        return ArisData.sort(oOccList, Constants.SORT_Y, g_nLoc);
    }
}


function removeSpacesAndLineBreak(oModel)
{
    replaceSpacesAndLineBreaks(getRisks(oModel));
    replaceSpacesAndLineBreaks(getControls(oModel));
    replaceSpacesAndLineBreaks(getPolicies(oModel));

    function replaceSpacesAndLineBreaks(oOccList) {
        for (var i in oOccList) {
            var oOcc = oOccList[i];
            var oAttrName = oOcc.ObjDef().Attribute(Constants.AT_NAME, g_nLoc);
            var sName = oAttrName.getValue();
            var sNameNew = new java.lang.String(oOcc.ObjDef().Name(g_nLoc));
            sNameNew = sNameNew.replaceAll(" ","");
            if (StrComp(sName, sNameNew) != 0) {
                oAttrName.setValue(sNameNew);
            }
        }        
    }
    
    function getRisks(oModel) {
        return oModel.ObjOccListFilter(Constants.OT_RISK);
    }
    
    function getPolicies(oModel) {
        return oModel.ObjOccListFilter(Constants.OT_POLICY);
    }
    
    function getControls(oModel) {
        var oControls = new Array();
        var oFuncs = oModel.ObjOccListFilter(Constants.OT_FUNC);
        
        for (var i in oFuncs) {
            var oFunc = oFuncs[i];
            if (oFunc.OrgSymbolNum() == Constants.ST_CONTR) {
                oControls.push(oFunc);
            }
        }
        return oControls;
    }    
}

function resizeStandardSymbols(oModel)
{
    const c_nWidth  = 225;
    const c_nHeight = 75;
    
    
    var oRisks = getRisks(oModel);
    resize(oRisks);
    
    var oIstars = getIstars(oModel);
    resize(oIstars);
    
    var oControls = getControls(oModel);
    resize(oControls);

    var oPolicies = getPolicies(oModel);
    resize(oPolicies);
    
    updateGateways(getGateways(oModel));
    
    
    function resize(oOccList) {
        for (var i in oOccList) {
            oOccList[i].SetSize(c_nWidth, c_nHeight);
        }        
    }
    
    function updateGateways(oOccList) {
        for (var i in oOccList) {
            var oOcc = oOccList[i];
            oOcc.SetSize(298, 298);
            var oAttrOcc = oOcc.AttrOcc(Constants.AT_NAME);
            if (!oAttrOcc.Exist()) 
                oAttrOcc.Create(Constants.ATTROCC_CENTER, getDefaultFont());
            oAttrOcc.SetPortOptions(Constants.ATTROCC_CENTER, Constants.ATTROCC_TEXT);
        }        
    }
        
    function getRisks(oModel) {
        return oModel.ObjOccListBySymbol([Constants.ST_RISK_1]);
    }

    function getIstars(oModel) {
        return oModel.ObjOccListBySymbol([Constants.ST_REQUIREMENT]);
    }
    
    function getControls(oModel) {
        return oModel.ObjOccListBySymbol([Constants.ST_CONTR]);
    }
    
    function getPolicies(oModel) {
        return oModel.ObjOccListBySymbol([Constants.ST_BUSINESS_POLICY]);
    }
    
    function getGateways(oModel) {
        return oModel.ObjOccListBySymbol([Constants.ST_BPMN_RULE]);
    }
    
    function getDefaultFont() {
        var ofontstylelist = ArisData.getActiveDatabase().FontStyleList();
        for (var i = 0 ; i < ofontstylelist.length ; i++ ) {
            if (ofontstylelist[i].IsDefaultFontStyle()) {
                return ofontstylelist[i];
            }
        }
        return ofontstylelist[0];
    }
        
}

// replace the original symbols (which look really ugly when resized to a small size) by user-defined symbols
function replaceSymbols(oModel)
{
    /*
    var bUpdateSize = true
    
    var oRisks = getRisks(oModel);
    replaceSymbols(oRisks, "2e0d97d1-93c5-11e3-3031-d7decc551aea", 78, 78);
    
    var oIstars = getIstars(oModel);
    replaceSymbols(oIstars, "6e529790-97b8-11e3-551d-82bb7c83db73", 78, 78);
    
    var oControls = getControls(oModel);
    replaceSymbols(oControls, "26832231-93c7-11e3-3031-d7decc551aea", 112, 84);

    var oPolicies = getPolicies(oModel);
    replaceSymbols(oPolicies, "9a2ff6e1-93c2-11e3-3031-d7decc551aea", 100, 80);

    function replaceSymbols(oOccList, sSymbolGuid, nWidth, nHeight) {
        for (var i in oOccList) {
            var oOcc = oOccList[i];
            if (oOcc.setSymbolGUID(sSymbolGuid)) {
                if (bUpdateSize) oOcc.SetSize(nWidth, nHeight);
            }
        }        
    }
    
    function getRisks(oModel) {
        return oModel.ObjOccListBySymbol([Constants.ST_RISK_1]);
    }
    
    function getIstars(oModel) {
        return oModel.ObjOccListBySymbol([Constants.ST_REQUIREMENT]);
    }
    
    function getControls(oModel) {
        return oModel.ObjOccListBySymbol([Constants.ST_CONTR]);
    }
    
    function getPolicies(oModel) {
        return oModel.ObjOccListBySymbol([Constants.ST_BUSINESS_POLICY]);
    }
    */
}

function generateRowModel(oModel)
{
    var modelGeneration = Context.getComponent("ModelGeneration")
    if(modelGeneration!=null)
    {
        var options = modelGeneration.createModelGenerationOptions();
        options.setExpandModelDepth(0)
        options.setExpandModelDepthForProcesInterfaces(0)
        options.onlyCxnsWithOccs(true)
        options.multipleOccs(true)
        options.hideProcessInterfaces(false)
        
        var models = ArisData.createTypedArray(Constants.CID_MODEL)
        models.push(oModel)
        
        modelNewRowEPC = modelGeneration.generateModel(models, oModel.Name(g_nLoc),Constants.MT_EEPC_ROW, oModel.Group(), options)        
        if(modelNewRowEPC!=null)
        {
            modelNewRowEPC.setAttrOccHandling(Constants.ATTROCCHANDLING_BREAKATTR)        
            return modelNewRowEPC;
        }
    }
    return null; //model generation failed
}

function copyFFT2RowModel(modelSource, modelTarget)
{
    //copy FFTs from OrgModel to new model
    var fftsOrgModel     = modelSource.TextOccList()

    var lanes = sort(modelTarget.GetLanes(Constants.LANE_HORIZONTAL))
    var lastLane = lanes[lanes.length -1]
    var yNew = lastLane.Start() + (lastLane.End()-lastLane.Start())/2

    var lanesV = sort(modelTarget.GetLanes(Constants.LANE_VERTICAL))
    var xFirstLaneEnd = lanesV[0].End()

    for (var i in fftsOrgModel) {
        var oFFT = fftsOrgModel[i];
        var fftDef = oFFT.TextDef();
        var text = "" + fftDef.Name(g_nLoc)
        if( text.indexOf("Risk")>=0 || text.indexOf("Control")>=0)
        {
            modelTarget.CreateTextOcc(xFirstLaneEnd + oFFT.X(), yNew, fftDef)
        }
    }
    
    function sort(lanes) {
        return ArisData.sort(lanes, Constants.SORT_GEOMETRIC, g_nLoc);
    }
}

function consolidateModel(modelNewRowEPC)
{
    consolidateObjects(filterObjDefs(modelNewRowEPC.Group().ObjDefList()));
    
    function filterObjDefs(oObjDefList) {
        var oFilteredObjDefs = new Array();
    
        for (var i = 0; i < oObjDefList.length; i++) {
            var oObjDef = oObjDefList[i];
            if (oObjDef.TypeNum() == Constants.OT_EVT || oObjDef.TypeNum() == Constants.OT_RULE) {
                continue;
            }
            oFilteredObjDefs.push(oObjDef);        
        }
        return oFilteredObjDefs;
    }
    
    function consolidateObjects(oObjDefList) {
        var mapObjDefs = initMap(oObjDefList);
    
        var iter = mapObjDefs.entrySet().iterator()
        while(iter.hasNext()) {
            var entry = iter.next();
 
            try {   
                var aObjDefs = entry.getValue();
                if (aObjDefs.length > 1) {
                    var oMasterDef = aObjDefs[0];
                    var aSlaveDefs = getSlaves(aObjDefs);
        
                    oMasterDef.Consolidate(aSlaveDefs, true/*bDeleteSlaves*/, true/*bAttrMerge*/, true/*bMultipleCxnConsolidate*/);
                }
            }
            catch(e)
            {
                Context.writeLog("Consolidation failed for an object. Message: "+e.message)
            }
        }
    
        function initMap(oObjDefList) {
            var mapObjDefs = new java.util.HashMap();
            for (var i = 0; i < oObjDefList.length; i++) {
                var oObjDef = oObjDefList[i];
                var oAttrName = oObjDef.Attribute(Constants.AT_NAME, g_nLoc);
                if (!oAttrName.IsMaintained()) {
                    continue;   // Ignore untitled objects
                }
                var key = oObjDef.TypeNum() + "_" + oAttrName.getValue();
                var value = new Array();
                
                if (mapObjDefs.containsKey(key)) {
                    value = mapObjDefs.get(key);
                }
                value.push(oObjDef);
                mapObjDefs.put(key, value);
            }
            return mapObjDefs;
        }
        
        function getSlaves(aObjDefs) {
            var aSlaveDefs = new Array();
            for (var i = 1; i < aObjDefs.length; i++) {
                aSlaveDefs.push(aObjDefs[i]);
            }
            return aSlaveDefs;        
        }
    }
}

function getAttributeCofiguration(SourceType){
var result = new Array();    
var modelconflist = _mappinghelper.getElementsByTagName("model");
for (var i = 0; i < modelconflist.getLength(); i++) {
var modelconf = modelconflist.item(i);
if (modelconf.getAttribute("id") == SourceType){
var attributes = modelconf.getElementsByTagName("attributes");
for (var ii = 0; ii < attributes.getLength(); ii++) {
var attrs = attributes.item(ii);
result.push(attrs.getElementsByTagName("attr"));
}
   
}
    
}
return result;   
}