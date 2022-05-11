/**
 * Copyright (C) 2020 Software AG, Darmstadt, Germany and/or Software AG USA Inc., Reston, VA, USA,
 * and/or its subsidiaries and/or its affiliates and/or their licensors.
 *
 * Use, reproduction, transfer, publication or disclosure is prohibited
 * except as specifically provided for in your License Agreement with Software AG.
 *
 * Version: 10.0.12.0.1470486
 */


//INITIALIZATION////////////////////
var commonUtils = new commonUtils();
////////////////////////////////////


//////////////////////////////////////////////////////////////////////////////////////////////////////////
//                           ALL CLASSES AND METHODS STRUCTURE                                          //
//////////////////////////////////////////////////////////////////////////////////////////////////////////
/*


***dialog templates, buffers for dialog values, ...
-------------------------------------------------------------------------------
commonUtils
commonUtils.dialogs
            dialogs.doubleListBoxDriver
                    doubleListBoxDriver.template(pa_cxnSource,pa_cxnSelected,phm_cxnDlgStringTable);
                    doubleListBoxDriver.buffer(pb_init,pa_cxnSourceList,pa_cxnSelectedList);                                                               
                
            dialogs.formatGraphic.template(pi_number,phm_stringTable)
                    formatGraphic.buffer(pi_number)

                

                
***searching for objects, occurences, cxns through the databases, groups, models
--------------------------------------------------------------------------------
commonUtils.search
            search.searchObjDefsByType(pa_selectedDBs, pa_selectedGRPs, pa_selectedMDLs,phs_objTypes)    //in dbs and/or groups and/or models ...done
            search.searchObjOccsByType(pa_selectedDBs, pa_selectedGRPs, pa_selectedMDLs,phs_objTypes)    //in dbs and/or groups and/or models ...done        
            search.searchObjOccsBySymbol(a_objOccSymbols,a_dbs,a_groups,a_models, b_recursively)         //in dbs and/or groups and/or models and recursively (false/true)...to be done
            search.searchCxnDefsByType(a_CxnDefTypes,a_dbs,a_groups,a_models, b_recursively)             //in dbs and/or groups and/or models and recursively (false/true)...to be done
            search.searchConnectedObjDef(objDef(), cxnDef());
            search.searchConnectedobjOcc(objOcc(), cxnOcc());
	         search.searchConnectedObjOccs(objOcc, aCxnOcc);
            search.searchConnectedObjCxn(ObjOcc, CxnNum);
            search.searchConnectedObjOccsByCxnTypeNum(objOcc, [cxnTypeNums])
            search.getAllOutNodes(objOcc,structure)                                                       //returns all out nodes for obj occ
            search.graph.getAllOutNodes(objOcc,structure)
            search.graph.pathFinder(oModel,structure)




        
       
***colors
--------------------------------------------------------------------------------
commonUtils.color.setColor(int R, int G, int B)
            color.setColor(str "GRAY", int %)
        
***bool
--------------------------------------------------------------------------------        
commonUtils.bool
            bool.isInteger(parameter) ....done so only implement to object from function
            bool.isString(parameter)  ....to be done
            bool.isArray(paramenter)  ....to be done
        
***output
--------------------------------------------------------------------------------
commonUtils.output
            output.setOutput(p_output, p_lang, p_orientation)        
            output.setBasicFormat(p_output)
            output.setHeaderFooter(outfile, nloc, bDisplayServer, bDisplayDatabase, bDisplayUser)
            output.beginTable(p_output)
            output.endTable(p_output)
            output.writeOutput(p_output)

***array
commonUtils.array
            array.clearDuplicities(p_array)          
            array.contains(p_array,p_element)

            array.sort.sortAlphabetic
            array.sort.sortNumeric

            array.sort.sortByType
            array.sort.sortByName

            array.sort.sortObjOccByObjDefType
            array.sort.sortObjOccByObjDefName
            array.sort.sortObjOccByModelType
            array.sort.sortObjOccByModelName

            array.sort.sortCxnOccByCxnDefActiveType
            array.sort.sortCxnOccByCxnDefPassiveType
            array.sort.sortCxnOccByModelType
            array.sort.sortCxnOccByModelName


***planned structure of classes
commonUtils.ArisObject
commonUtils.ArisObject.Attr
commonUtils.ArisObject.AttrOcc
commonUtils.ArisObject.Font
commonUtils.ArisObject.MethodFilter
commonUtils.ArisObject.Picture

commonUtils.ArisObject.Occ
commonUtils.ArisObject.Occ.ConnectableOcc
commonUtils.ArisObject.Occ.ConnectableOcc.ObjOcc
commonUtils.ArisObject.Occ.ConnectableOcc.CxnOcc
commonUtils.ArisObject.Occ.TextOcc
commonUtils.ArisObject.Occ.ComObjocc

commonUtils.ArisObject.Item

commonUtils.ArisObject.Item.ConnectableDef
commonUtils.ArisObject.Item.ConnectableDef.ObjDef
commonUtils.ArisObject.Item.ConnectableDef.CxnDef

commonUtils.ArisObject.Item.Database
commonUtils.ArisObject.Item.Group
commonUtils.ArisObject.Item.Model
commonUtils.ArisObject.Item.Lane
commonUtils.ArisObject.Item.Language
commonUtils.ArisObject.Item.FontStyle
commonUtils.ArisObject.Item.User
commonUtils.ArisObject.Item.UserGroup
commonUtils.ArisObject.Item.TextDef



          

*/
//////////////////////////////////////////////////////////////////////////////////////////////////////////
//Array - methods extensions
//////////////////////////////////////////////////////////////////////////////////////////////////////////
//list
//array.clear()
//array.contains(p_element)
//array.getIndex(p_element)
//array.copy()
//array.clearDuplicities()



/**
 *removes all elements from an array
 *@return an array of removed elements
 *@type Array
 *@param -
 *@addon
 */
Array.prototype.clear = function()
{ 
  return this.splice(0);  
}

/**
 *returns true if array contains an element or false if not. 
 *@return boolean
 *@type boolean
 *@param {-} p_element an element which should be find in the Array
 *@addon 
 */                           
Array.prototype.contains = function(p_element)
{
 for(var i=0; i < this.length; i++)
  {
    if(this[i].toString().equals(p_element.toString())) return true;
  }
 return false;
} 


/**
 *returns the index of an element in the Array
 *@return Integer
 *@type Integer
 *@param {-} p_element an element of an array
 *@addon 
 */
Array.prototype.getIndex = function(p_element)
{
  for(var i=0; i < this.length; i++)
  {
    if(p_element.toString().equals(this[i].toString())) return new Number(i);
  }
}    


/**
 *create copy of an array
 *@return new Array as copy
 *@type Array
 *@param -
 *@addon 
 */
Array.prototype.copy = function()
{
  return this.slice(0);  
}


/**
 *removes all doubled occurances of elements from an array. For example [1,1,2,3,4,4,5].clearDuplicities => [1,2,3,4,5]
 *@return length of the new array
 *@type Integer
 *@param -
 *@addon 
 */
Array.prototype.clearDuplicities = function()
{
  var a_temp = this.copy();
  this.clear();
  for(var i=0; i < a_temp.length; i++){
    if(!this.contains(a_temp[i])) this.push(a_temp[i])
  }    
  return this.length;      
}

/**
 *removes p_element from an array
 *@return index which had p_element in an array
 *@type Integer
 *@param {-} p_element an element of an array
 */
Array.prototype.remove = function(p_element){
  var index = this.getIndex(p_element);
  this.splice(index,1);    
  return index;
}

/**
 *adds an element (p_element) at the and an array. The difference between method <b>push</b> and <b>add</b> is that method array.add(p_element) checks first if the array doesnt contains the element already and adds the element to an array only in case it will have unique occurance in there.
 *@return new length of the array
 *@type Integer
 *@param {-} p_element an element which is going to be added to an array
 */
Array.prototype.add = function(p_element){
  if(!this.contains(p_element)){
    this.push(p_element);
  }  
return this.length;
}
                           

//////////////////////////////////////////////////////////////////////////////////////////////////////////
//String - methods extensions                                                                           //
//////////////////////////////////////////////////////////////////////////////////////////////////////////                           


//////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                     ALL CLASSES AND METHODS                                          //
//////////////////////////////////////////////////////////////////////////////////////////////////////////





//*commonUtils - base class*
//**************************





/**
 *<i>commonUtils</i>
 */
function commonUtils(){ 
/**
 *see {@link bool} <br /> 
 *@type class 
 */    
this.bool      = new bool();    
/**
 *see {@link attsall} <br /> 
 *@type class 
 */  
this.attsall   = new attsall();
/**
 *@type property 
 */    
this.language  = Context.getSelectedLanguage();  
/**
 *see {@link dialogs} <br />
 *@type class 
 */  
this.dialogs   = new dialogs();
/**
 *see {@link otuput} <br />
 *@type class 
 */  
this.output    = new output();
/**
 *see {@link color} <br />
 *@type class 
 */  
this.color     = new color();
/**
 *@private 
 *@type class 
 */  
this.array     = new array();
/**
 *see {@link search} <br />
 *@type class 
 */  
this.search    = new search();
/**
 *see {@link sort} <br />
 *@type class 
 */  
this.sort      = new sort();
}





//*commonUtils.bool*
//******************
/**   
 *<i><commonUtils.bool</i><br />
 *see {@link bool}
 *@base commonUtils
 */
function bool(){   
this.isInteger = isInteger; //function(){return isInteger();}//isInteger
}




//*commonUtils.attsall*
//*********************
/**
 *see {@link attsall}<br />
 *<i>commonUtils.attsall</i><br />
 *@base commonUtils 
 */
function attsall(){   
this.formatString = f_formatString;
}





//*commonUtils.dialogs*
//*********************

/**
 *<i>commonUtils.dialogs<i/><br />
 *see {@link dialogs}<br />
 *see {@link formatGraphic}<br />
 *see {@link listBoxDriver}<br />    
 *@base commonUtils 
 */
function dialogs(){
this.listBoxDriver  = new listBoxDriver();
this.formatGraphic  = new formatGraphic();
} 





//*commonUtils.dialogs.listboxDriver*
//***********************************
/**
 *conains methods to create template and buffer for listBox driver dialog
 *see {@link listBoxDriver} <br />
 *<i>commonUtils.dialogs.listBoxDriver</i><br />
 *@base dialogs
 */
function listBoxDriver(){
this.template = f_listBoxDriverTemplate       //doubleListBoxDriver(pa_cxnSource,pa_cxnSelected,phm_cxnDlgStringTable)
this.buffer   = f_listBoxDriverBuffer         //doubleListBoxBuffer(pa_cxnSourceList)
}





//*commonUtils.dialogs.formatGraphic*
//***********************************

/**
 *conains methods to create template and buffer for {@link formatGraphic} <br />
 *see {@link formatGraphic}
 *<i>commonUtils.dialogs.formatGraphic</i><br />
 *@base dialogs
 */
function formatGraphic(){
this.template = f_graphicDlgTemplates    
this.buffer   = f_graphicDlgBuffers    
}





//*commonUtils.search*
//********************           

/**
 *<i>commonUtils.search</i><br />
 *@base commonUtils
 */
function search(){    
this.searchConnectedObjDef              = f_getConnectedObjDef;
this.searchConnectedObjOcc              = f_getConnectedObjOcc;
this.searchConnectedObjOccs             = f_getConnectedObjOccs;
this.searchConnectedObjCxn              = f_searchConnectedObjCxn;
this.searchConnectedObjOccsByCxnTypeNum = f_getConnectedObjOccsByCxnTypeNum;
this.searchObjDefsByType                = f_searchObjDefsByType;
this.searchObjOccsByType                = f_searchObjOccsByType;
this.getAllOutNodes                     = f_getAllOutNodes;
this.getAllNodes                        = f_getAllNodes;
//this.getAllInNodes                    = f_getAllInNodes ....to be done
this.getAllOutEdgesLogical              = f_edgesOutLogical;
this.getAllInEdgesLogical               = f_edgesInLogical;
this.findRoots                          = f_findRootObjOccs;
this.findLeaves                         = f_findLeafObjOccs;
this.graph                              = new graph()
}  





//*commonUtils.search.graph*
//**************************

/**
 *<i>commonUtils.search.graph</i><br />
 *see {@link graph} 
 *@base search
 */
function graph(){   
this.getAllOutNodes         = f_getAllOutNodes;             //function(objOcc,structure){return f_getAllOutNodes(objOcc,structure);}
this.getAllNodes            = f_getAllNodes;
this.ModelAnalyzer          = f_ModelAnalysator;            //function(p_model,p_structure){return f_ModelAnalysator(p_model,p_structure);}
this.pathFinder             = f_modelGraphAnalysator;       //function(p_model,p_structure){return f_modelGraphAnalysator(p_model,p_structure);}
}





//*commonUtils.color*
//*******************

/**
 *<i>commonUtils.color</i><br />
 *see {@link color} 
 *@base commonUtils
 */
function color(){
this.setColor  = setColor; //parameters{int R, int G, int B) or (str "GRAY", int %)                
}           





//*commonUtils.output*
//********************

/**
 *<i>commonUtils.output</i><br />
 *@base commonUtils
 */
function output(){
this.setOutput          = setOutput             //function(p_output, p_lang, p_orientation) {return setOutput(p_output, p_lang, p_orientation)}                          
this.setBasicFormat     = setBasicFormat        //function(p_output){return setBasicFormat(p_output)}                         
this.beginTable         = beginTable            //function(p_output){return beginTable(p_output)}
this.endTable           = endTable              //function(p_output){return endTable(p_output)}
this.writeOutput        = writeOutput           //function(p_output){return writeOutput(p_output)}                       
}




//*commonUtils.sort*
//******************

/**
 *<i>commonUtils.sort</i><br />
 *@base commonUtils
 */
function sort(){
this.sortNumeric                     = f_sortNumeric                    //function(a,b) {return f_sortNumeric(a,b);} 
this.sortAphabetic                   = f_sortAlphabetic                 //function(a,b) {return f_sortAlphabetic(a,b);} 

this.sortByType                      = f_sortByType                     //function(a,b) {return f_sortByType(a,b);} 
this.sortByName                      = f_sortByName                     //function(a,b) {return f_sortByName(a,b);}    

this.sortObjOccByModelType           = f_sortObjOccByModelType          //function(a,b) {return f_sortObjOccByModelType(a,b);}    
this.sortObjOccByModelName           = f_sortObjOccByModelName          //function(a,b) {return f_sortObjOccByModelName(a,b);} 
this.sortObjOccByObjDefType          = f_sortObjOccByObjDefType         //function(a,b) {return f_sortObjOccByObjDefType(a,b);} 
this.sortObjOccByObjDefName          = f_sortObjOccByObjDefName         //function(a,b) {return f_sortObjOccByObjDefName(a,b);} 
this.sortObjOccByPosition            = f_sortObjOccByPosition           //function(a,b) {return f_sortObjOccByPosition(a,b);}

this.sortCxnOccByModelType           = f_sortCxnOccByModelType          //function(a,b) {return f_sortCxnOccByModelType(a,b);}    
this.sortCxnOccByModelName           = f_sortCxnOccByModelName          //function(a,b) {return f_sortCxnOccByModelName(a,b);} 
this.sortCxnOccByCxnDefPassiveType   = f_sortCxnOccByCxnDefPassiveType  //function(a,b) {return f_sortCxnOccByCxnDefPassiveType(a,b);} 
this.sortCxnOccByCxnDefActiveType    = f_sortCxnOccByCxnDefActiveType   //function(a,b) {return f_sortCxnOccByCxnDefActiveType(a,b);} 

this.sortCxnOccByTargetObjDefName    = f_sortCxnOccByTargetObjDefName
this.sortCxnOccBySourceObjDefName    = f_sortCxnOccBySourceObjDefName

this.sortCxnOccByTargetObjDefNameLogical = f_sortCxnOccByTargetObjDefNameLogical;
this.sortCxnOccBySourceObjDefNameLogical = f_sortCxnOccBySourceObjDefNameLogical;

}





//*commonUtils.array*
//*******************

/**
 *Do not use!!! Use class Array directly!!!
 *<i>commonUtils.array</i>
 *@private
 *@deprecated
 */
function array(){
this.clearDuplicities = function(p_array){return clearDuplicitiesInArray(p_array);}
this.contains         = function(p_array,p_element){return arrayContainsElement(p_array,p_element)}
this.sort             = new sort();
}
             
             
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//OBJECTS FOR INTERNAL USAGE - not documented                                                                               //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//list of paper formats for formatGraphic 2 dialog
/**
 *@private
 */
function paperFormatType(sName, nWidth, nHeight) {
   this.sName = sName;
   this.nWidth = nWidth;
   this.nHeight = nHeight;
   return this;
}

/**
 *@private
 */
function paperFormats(){
    a_paperFormats      = new Array();
    a_paperFormats[0]   = new paperFormatType("User-Defined", 0, 0);          // userdefined
    a_paperFormats[1]   = new paperFormatType("A3", 297, 420);                 // A3
    a_paperFormats[2]   = new paperFormatType("A4", 210, 297);                 // A4
    a_paperFormats[3]   = new paperFormatType("A5", 148, 210);                 // A5
    a_paperFormatNames = new Array();     
    return a_paperFormats;
}
            
/////////////////////////////////////////////////////////////////////////////////////////////////////////
//INTERNAL FUNCTIONS - not part of documentation                                                       //
/////////////////////////////////////////////////////////////////////////////////////////////////////////
/**
 *list of connections they should be followed against their direction (the real hierarchical source is the target and the target is the source)
 *@private
 */
function reverseCxnList(){  
var hm_reverseCxns = new java.util.HashSet();
  //cxns in ORG CHARTS model type  
    hm_reverseCxns.add(Constants.CT_OCCUPIES); 
    //hm_reverseCxns.add(Constants.CT_GENERAL_2); 
    hm_reverseCxns.add(Constants.CT_IS_ASSIG_1);
    hm_reverseCxns.add(Constants.CT_EXEC_5); 
    hm_reverseCxns.add(Constants.CT_IS_ORG_RSPN);      

return hm_reverseCxns;    
}
            

            
            
/**
 *@private
 */            
//////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                           GLOBALS                                                    //
//////////////////////////////////////////////////////////////////////////////////////////////////////////




var ga_paperFormats      = new paperFormats()
var ga_paperFormatNames = new Array();
    for (var i = 0; i < ga_paperFormats.length; i++) ga_paperFormatNames.push(ga_paperFormats[i].sName);


var ghm_cxnDlgBuffer = new java.util.HashMap();
    ghm_cxnDlgBuffer.put("cxnSourceList",0);
    ghm_cxnDlgBuffer.put("cxnSelectedList",0);
    ghm_cxnDlgBuffer.put("addAllButton",0);
    ghm_cxnDlgBuffer.put("addButton",0);   
    ghm_cxnDlgBuffer.put("removeButton",0);   
    ghm_cxnDlgBuffer.put("removeAllButton",0);   
    
var ghm_graphicDlg1Buffer = new java.util.HashMap();    
    ghm_graphicDlg1Buffer.put("og_color",    0);       
    ghm_graphicDlg1Buffer.put("og_scaling",  0);       
    ghm_graphicDlg1Buffer.put("og_margins",  0);       
    ghm_graphicDlg1Buffer.put("txt_scaling","100");
    ghm_graphicDlg1Buffer.put("cancelPressed", false);    
    

var ghm_graphicDlg2Buffer = new java.util.HashMap();
    ghm_graphicDlg2Buffer.put("txt_width","210");       //dlg.getDlgText("txt_width"));
    ghm_graphicDlg2Buffer.put("txt_height","297");      //dlg.getDlgText("txt_height"));
    ghm_graphicDlg2Buffer.put("txt_top","0");      
    ghm_graphicDlg2Buffer.put("txt_bottom","0");       
    ghm_graphicDlg2Buffer.put("txt_left","0");              
    ghm_graphicDlg2Buffer.put("txt_right","0");
    ghm_graphicDlg2Buffer.put("og_orientation",0);
    




//////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                         ALL FUNCTIONS                                                //
//////////////////////////////////////////////////////////////////////////////////////////////////////////


/**
 *sorts array of objects by their type, use as parameter in method sort() <br />
 *<i>commonUtils.sort.sortByType</i><br />   
 *@return -1 || 0 || 1
 *@type Number
 *@param    
 */
function f_sortByType(a,b){
  var typeA    = a.Type()
  var typeB    = b.Type();

  if(typeA.toString() > typeB.toString()) return  1;
  if(typeA.toString() < typeB.toString()) return -1;   
  return 0;
}


/**
 *sorts array of objects by their name, use as parameter in method sort() <br />
 *<i>commonUtils.sort.sortByName</i><br />
 *@return -1 || 0 || 1
 *@type Number
 *@param    
 */
function f_sortByName(a,b){
  var nameA    = a.Name(Context.getSelectedLanguage())
  var nameB    = b.Name(Context.getSelectedLanguage());

  if(nameA.toString() > nameB.toString()) return  1;
  if(nameA.toString() < nameB.toString()) return -1;   
  return 0;
}


/**
 *sorts array obj obj occs by their model types, use as parameter in method sort() <br />
 *<i>commonUtils.sort.sortObjOccByModelType</i> <br />
 *@return -1 || 0 || 1
 *@type Number
 *@param    
 */
function f_sortObjOccByModelType(a,b){
  var modelA    = a.Model().Type();
  var modelB    = b.Model().Type();

  if(modelA.toString() > modelB.toString()) return  1;
  if(modelA.toString() < modelB.toString()) return -1;   
  return 0;
}

/**
 *sorts array of obj occs by their model Names, use as parameter in method sort() <br />
 *<i>commonUtils.sort.sortObjOccByModelName</i> <br />
 *@return -1 || 0 || 1
 *@type Number
 *@param
 */
function f_sortObjOccByModelName(a,b){
  var modelA    = a.Model().Name(Context.getSelectedLanguage());
  var modelB    = b.Model().Name(Context.getSelectedLanguage());

  if(modelA.toString() > modelB.toString()) return  1;
  if(modelA.toString() < modelB.toString()) return -1;   
  return 0;
}


/**
 *sorts array of cxn occs by their model names, use as parameter in method sort() <br />
 *<i>commonUtils.sort.sortCxnOccByModelName</i> <br />
 *@return -1 || 0 || 1
 *@type Number
 *@param
 */
function f_sortCxnOccByModelName(a,b){
var modelA = a.SourceObjOcc().Model().Name(Context.getSelectedLanguage());
var modelB = b.SourceObjOcc().Model().Name(Context.getSelectedLanguage()) ;

  if(modelA.toString() > modelB.toString()) return  1;
  if(modelA.toString() < modelB.toString()) return -1;   
  return 0;
} 

/**
 *sorts array of cxn occs by their model types, use as parameter in method sort()<br />
 *<i>commonUtils.sort.sortCxnOccByModelType</i><br />
 *@return -1 || 0 || 1
 *@type Number
 *@param  
 */
function f_sortCxnOccByModelType(a,b){
var modelA = a.SourceObjOcc().Model().Type();
var modelB = b.SourceObjOcc().Model().Type();

  if(modelA.toString() > modelB.toString()) return  1;
  if(modelA.toString() < modelB.toString()) return -1;   
  return 0;
} 



/**
 *sorts array of cxn occs by their definition passive types, use as parameter in method sort()<br />
 *<i>commonUtils.sort.sortCxnOccByCxnDefPassiveType</i><br />
 *@return -1 || 0 || 1
 *@type Number
 *@param  
 */
function f_sortCxnOccByCxnDefPassiveType(a,b){
var cxnDefA = a.CxnDef().PassiveType();
var cxnDefB = b.CxnDef().PassiveType();

  if(cxnDefA.toString() > cxnDefB.toString()) return  1;
  if(cxnDefA.toString() < cxnDefB.toString()) return -1;   
  return 0;
} 


/**
 *sorts array of cxn occs by their definition active type, use as parameter in method sort()<br />
 *<i>commonUtils.sort.sortCxnOccByCxnDefActiveType</i><br />
 *@return -1 || 0 || 1
 *@type Number
 *@param 
 */
function f_sortCxnOccByCxnDefActiveType(a,b){
var cxnDefA = a.CxnDef().ActiveType();
var cxnDefB = b.CxnDef().ActiveType();

  if(cxnDefA.toString() > cxnDefB.toString()) return  1;
  if(cxnDefA.toString() < cxnDefB.toString()) return -1;   
  return 0;
} 



/**
 *sorts array alphabetic, use as paramter in method sort() <br />
 *<i>commonUtils.sort.sortAlphabetic</i><br />
 *@return -1 || 0 || 1
 *@type Number
 *@param  
 */
function f_sortAlphabetic(a,b){
  if(a.toString() > b.toString()) return  1;
  if(a.toString() < b.toString()) return -1;   
  return 0;
} 


/**
 *sorts array numeric, use as parameter in method sort()<br />
 *<i>commonUtils.sort.sortNumeric</i><br />
 *@return -1 || 0 || 1
 *@type Number
 *@param  
 */
function f_sortNumeric(a,b){
var n_a = new Number(a);
var n_b = new Number(b);   
  if(n_a > n_b) return  1;
  if(n_a < n_b) return -1;   
  return 0;
} 


/**
 *sorts array of obj occs by their definition names, use as parameter in method sort()<br />
 *<i>commonUtils.sort.sortObjOccByDefName</i><br />
 *@return -1 || 0 || 1
 *@type Number
 *@param 
 */
function f_sortObjOccByObjDefName(a,b){
  var aName    = a.ObjDef().Name(Context.getSelectedLanguage());
  var bName    = b.ObjDef().Name(Context.getSelectedLanguage());
  //var stringTmp  = new java.lang.String(a_Name); 
  //if(stringTmp.compareTo(new java.lang.String(b_Name)) < 0) return -1;
  //if(stringTmp.compareTo(new java.lang.String(b_Name)) > 0) return 1;
  if(aName.toString() > bName.toString()) return 1;
  if(aName.toString() < bName.toString()) return -1;   
  return 0;
} 


/**
 *sorts array of obj occs by their definition types, use as parameter in method sort()<br />
 *<i>commonUtils.sort.sortObjOccByObjDefType</i><br />
 *@return -1 || 0 || 1
 *@type Number
 *@param  
 */
function f_sortObjOccByObjDefType(a,b){
  var a_Model    = a.ObjDef().Type();
  var b_Model    = b.Objdef().Type();
  var stringTmp  = new java.lang.String(a_Model); 
  
  if(stringTmp.compareTo(new java.lang.String(b_Model)) < 0) return -1;
  if(stringTmp.compareTo(new java.lang.String(b_Model)) > 0) return 1;
  
  return 0;
} 

/**
 *sorts array of obj occs by their position, use as parameter in method sort()<br />
 *<i>commonUtils.sort.sortObjOccByPosition</i><br />
 *@return -1 || 0 || 1
 *@position
 *@param  
 */
function f_sortObjOccByPosition(a,b){
  if( a.Y() < b.Y() )   return -1;
  if( (a.Y() == b.Y()) && (a.X() < b.X()) ) return -1;
  if( (a.Y() == b.Y()) && (a.X() > b.X()) ) return 1;
  if( a.Y() > b.Y() )   return 1;
  
  return 0;
} 

/**
 *analyse the graph and returns all unique threads as list of arrays<br />
 *<i>commonUtils.search.graph.ModelAnalyser(model,structure)</i><br />
 *@return array of aAllThreads [[]]
 *@type 2D Array 
 *@param {ArisObject}   p_model         Aris object model
 *@param {Integer}      p_structure     Constants.EDGES_INOUT, Constants.EDGES_IN, Constants.EDGES_OUT
 */
function f_ModelAnalysator(p_model,p_structure){ //return all existing unique threads of obj occs from model as Array of Arrays
//p_model = object model
//p_structure:  Constants.EDGES_INOUT          Evaluate all relationships.
//              Constants.EDGES_OUT            Only evaluate incomming relevant relationships.
//              Constants.EDGES_IN             Only evaluate outgoing relevant relationships.
    function isVisited(p_oNode){
        if(aVisited.contains(p_oNode) == true) return true;
        return false;
    }

    function isStartNode(p_oNode){
        if(aStartOccs.contains(p_oNode) == true) return true;
        return false;
    }

    function getNodes(p_objOccs,p_structure){
        if( aEDGES.contains(p_structure) == true )  return commonUtils.search.getAllOutNodes(p_objOccs, p_structure);
        if( aCONNS.contains(p_structure) == true )  return commonUtils.search.getAllNodes(p_objOccs, p_structure);
        return new Array();
    }

    function getNoVisNoThrd(p_aSucc){
        var aOut    = new Array();
        for(var i=0; i< p_aSucc.length; i++){
            if( (isVisited(p_aSucc[i]) == false) && (aActThread.contains(p_aSucc[i]) == false) )    aOut.push(p_aSucc[i]);
        }
        return aOut;
    }
    
    function getRealStartNodes(p_aStNodes){
        var aStOut  = new Array();
        var aEmpty  = new Array();
        var minY    = 0;
        var minX    = 0;
        if(p_aStNodes.length > 0){
            minY    = p_aStNodes[0].Y();
            minX    = p_aStNodes[0].X();
        }
        if(p_aStNodes.length > 0){
            aStOut.push(p_aStNodes[0]);
        }
        
        for(var i=1; i<p_aStNodes.length; i++){
            if( (minY > p_aStNodes[i].Y()) && (minX >= p_aStNodes[i].X()) ){
                aStOut  = aEmpty;
                minY    = p_aStNodes[i].Y();
                aStOut.push(p_aStNodes[i]);
            }
            if(minY == p_aStNodes[i].Y()){
                aStOut.push(p_aStNodes[i]);
            }
        }
        
        return aStOut;
    }
    
    function recursion(){
        if(aActThread.length == 0)  return;// END of recursion

        var oActObj     = aActThread[(aActThread.length-1)];
        var aSuccs      = getNodes( oActObj, p_structure);
        var aUnvisited  = getNoVisNoThrd(aSuccs);
        aUnvisited      = aUnvisited.sort(commonUtils.array.sort.sortObjOccByPosition);
        
        for(var i=0; i<aUnvisited.length; i++){
            aActThread.push(aUnvisited[i]);
            recursion();
        }//END::for_i
        if( (aUnvisited.length == 0) ){//&& (isStartNode(oActObj)== false) ){
            aAllThreads.push(aActThread.copy());
        }//END::if_aUnvisited_
        aVisited.push(oActObj);
        aActThread.pop();
        
        return;
    }//END::fnc_recursion
  
    var aEDGES      = [Constants.EDGES_ALL, Constants.EDGES_NONSTRUCTURE, Constants.EDGES_STRUCTURE];
    var aCONNS      = [Constants.EDGES_INOUT, Constants.EDGES_OUT, Constants.EDGES_IN];
    var aAllThreads = new Array();
    var aActThread  = new Array();
    var empty       = new Array();
    var aVisited    = new Array();
    var aStartOccs  = null;

    try{
        if(p_model.TypeNum() != Constants.MT_ORG_CHRT){
            p_model.BuildGraph(true);
            aStartOccs  = p_model.StartNodeList();
            aStartOccs  = getRealStartNodes(aStartOccs);
        }
        else{
            aStartOccs  = commonUtils.search.findRoots(p_model);
        }
    }
    catch(e){aStartOccs = new Array();}
    
    for(var i=0; i < aStartOccs.length; i++){
        aActThread  = new Array();
        aVisited    = new Array();
        aActThread.push(aStartOccs[i]);
        recursion();
    }  //END::for_i

    return aAllThreads;
}

/**
 *analyse the graph and returns all unique threads as list of arrays<br />
 *<i>commonUtils.search.graph.pathFinder(model,structure)</i><br />
 *@return array of threads [[]]
 *@type 2D Array 
 *@param {ArisObject}   p_model         Aris object model
 *@param {Integer}      p_structure     Constants.EDGES_ALL, Constants.EDGES_STRUCTURE, Constants.EDGES_NONSTRUCTURE
 */
function f_modelGraphAnalysator(p_model,p_structure){ //return all existing unique threads of obj occs from model graph as Array of Arrays
//p_model = object model
//structure: Constants.EDGES_ALL           Evaluate all relationships.
//           Constants.EDGES_STRUCTURE    Only evaluate structurally relevant relationships.
//           Constants.EDGES_NONSTRUCTURE Only evaluate structurally non-relevant relationships.
  
  function clear(p_threads){
  var p_threadsCopy = p_threads;    
  var a_temp        = new Array();
  var isUnique      = true;
    for(var i=0; i < p_threadsCopy.length; i++){
      var stringi = p_threadsCopy[i].toString();
      for(var j=0; j < p_threads.length; j++){
        var stringj = p_threads[j].toString();
        if(stringj.search(stringi) >= 0 && !stringi.equals(stringj)) isUnique = false;
      }
    isUnique == true ? a_temp.push(p_threadsCopy[i]) : isUnique = true;  
    }
  return a_temp;
  }
  function recursion(/*ancessors,threads,thread*/){//paramterers = hasMap(keys: ancessors,thread,thread)
    var curAncessors  = ancessors;
    var curThread     = thread;
  
    for(var i=0; i < curAncessors.length; i++){
      //continue = do not follow if repeated object = cycle   
      if(thread.toString().search(curAncessors[i]) >= 0){
        threads.push(thread.concat(empty));      
        continue;
      }
      //follow the thread = follow ancessor
      else{
        ancessors = commonUtils.search.getAllOutNodes(curAncessors[i],p_structure);      
        //follow thread = follow ancessor
        if(ancessors.length > 0){
          thread.push(curAncessors[i])
          recursion();
        }   
        //stop the thread + add thread to threads
        else{
         threads.push(thread.concat(curAncessors[i]));
         continue;
        }
      }
    }
    if(thread.length > 1)thread.pop();
    return;
  }
var threads   = new Array();
var thread    = new Array();
var ancessors = new Array();
var empty     = new Array();
var objOccs;
    try{
     objOccs = p_model.ObjOccList();
     objOccs = objOccs.sort(commonUtils.array.sort.sortObjOccByObjDefName);
    }
    catch(e){objOccs = new Array();}
    
//var parameters    = new parameters();

    for(var i=0; i < objOccs.length; i++){
      thread = new Array();    
      thread.push(objOccs[i]);
      ancessors = commonUtils.search.getAllOutNodes(objOccs[i],p_structure);
    if(ancessors.length > 0) recursion();
    else threads.push(thread);
  }  
// !!!!! 

threads = clear(threads);
return threads;
}

/**
 *returns connected objDef():... .../known/objDef() -- /known/cxnDef()-- /unknown/<b>objDef()</b> <br />
 *<i>commonUtils.search.searchConnectedObjDef(objDef,cxnDef)</i><br />
 *@return conected objDef 
 *@type ObjDef 
 *@param {ArisObject}   objDef      object Definition
 *@param {ArisObject}   cxnDef      attached connection definition
 */
function f_getConnectedObjDef(objDef,cxnDef){
var myObj = ((cxnDef.SourceObjDef().IsEqual(objDef)) ? cxnDef.TargetObjDef() : cxnDef.SourceObjDef());
return myObj;
}


/**
 *returns connected objOcc()  /known/objOcc() -- /known/cxnOcc()-- /unknown/<b>objOcc()</b> <br />
 *<i>commonUtils.search.searchConnectedObjOcc(objOcc,cxnOcc)</i><br />
 *@return connected objOcc
 *@type ObjOcc 
 *@param {ArisObject}   objOcc      object occurance
 *@param {ArisObject}   cxnOcc      attached connection occurance 
 */
function f_getConnectedObjOcc(objOcc,cxnOcc){
return myObj = ((cxnOcc.SourceObjOcc().IsEqual(objOcc)) ? cxnOcc.TargetObjOcc() : cxnOcc.SourceObjOcc());
}

/**
 *returns connected objOccs()  /known/objOcc() -- /known/cxnOcc()-- /unknown/<b>objOcc()</b> <br />
 *<i>commonUtils.search.searchConnectedObjOccs(objOcc,[cxnOcc])</i><br />
 *@return connected objOccs
 *@type ObjOcc 
 *@param {ArisObject}   objOcc      object occurrence
 *@param {Array}        cxnOcc      attached connection occurrences
 */
function f_getConnectedObjOccs(objOcc,aCxnOcc){
    var aOutCxns    = new Array();
    
    for(var i=0; i<aCxnOcc.length; i++){
        var myObj = ((aCxnOcc[i].SourceObjOcc().IsEqual(objOcc)) ? aCxnOcc[i].TargetObjOcc() : aCxnOcc[i].SourceObjOcc());
        if( aOutCxns.contains(myObj) == false )   aOutCxns.push(myObj);
    }

    return aOutCxns;
}

/**
 *returns CxnOcc specified by CxnTypeNum connected to ObjOcc<br />
 *<i>commonUtils.search.searchConnectedObjCxn(ObjOcc, Connection Type)</i><br />
 *@return list of connected ObjOcc Cxns [array]
 *@type Array
 *@param {ArisObject}   ObjOcc         object occurance
 *@param {Array}        CxnTypeNum     list of cxn Types [array]
 */
function f_searchConnectedObjCxn(p_ObjOcc, p_aCxnNums){
    var aAllCxns    = p_ObjOcc.CxnOccList();
    var aOutCxns    = new Array();
    
    for(var i=0; i<aAllCxns.length; i++){
        if( p_aCxnNums.contains( (aAllCxns[i]).CxnDef().TypeNum() ) == true ) 
            aOutCxns.push( aAllCxns[i] );
    }

    return aOutCxns;
}

/**
 *finds all connected obj occs connected via specified cxnOcc types<br />
 *<i>commonUtils.search.searchConnectedObjOccsByCxnTypeNum(ObjOcc,array of connection types)</i><br />
 *@return list of connected ObjOccs aa [array]
 *@type Array 
 *@param {Array}    objOcc          object occurance
 *@param {Array}    a_cxnTypeNums   list of cxn Types [array]
 */
function f_getConnectedObjOccsByCxnTypeNum(objOcc,a_cxnTypeNums){
var allCxns          = objOcc.CxnOccList();
var chosenCxns       = new Array();
var connectedObjOccs = new Array();

  for(var i=0; i<allCxns.length;i++){
    for(var j=0; j<a_cxnTypeNums.length; j++){  
      if(allCxns[i].CxnDef().TypeNum() == a_cxnTypeNums[j]) chosenCxns.push(allCxns[i]);
    }  
  }
  for(var i=0; i<chosenCxns.length;i++){
    connectedObjOccs.push(commonUtils.search.searchConnectedObjOcc(objOcc,chosenCxns[i]));
  }

return connectedObjOccs;  
}


/**
 *@method returns all target objects following Constants.EDGES_OUT<br />
 *<i>commonUtils.search.getAllOutNodes</i><br />
 *@return array of obj occs
 *@type Array
 *@param {ArisObject}   p_objocc      object occurance
 *@param {Integer}      p_structure   (Constants.EDGES_ALL, Constants.EDGES_STRUCTURE, Constants.EDGES_NONSTRUCTURE)
 */
function f_getAllOutNodes(p_objOcc,p_structure){
  try{    
    var outEdges  = p_objOcc.OutEdges(p_structure);
    var outNodes  = new Array();
    for(var j=0; j < outEdges.length; j++){
      outNodes.push(commonUtils.search.searchConnectedObjOcc(p_objOcc,outEdges[j]));    
    }
  }    
  catch(e){
    outNodes = new Array();
  }    
return outNodes;  
}

/**
 *@method returns all target objects following Constants.EDGES_OUT<br />
 *<i>commonUtils.search.getAllNodes</i><br />
 *@return array of obj occs
 *@type Array
 *@param {ArisObject}   p_objocc      object occurance
 *@param {Integer}      p_structure   (Constants.EDGES_INOUT, Constants.EDGES_IN, Constants.EDGES_OUT)
 */
function f_getAllNodes(p_objOcc,p_structure){
  try{    
    var aEdges  = p_objOcc.Cxns(p_structure);
    var aNodes  = new Array();
    for(var j=0; j < aEdges.length; j++){
      aNodes.push(commonUtils.search.searchConnectedObjOcc(p_objOcc,aEdges[j]));
    }
  }    
  catch(e){
    aNodes = new Array();
  }    
return aNodes;
}

/**
 *sets the java RGB color or nuance of gray (0-100) parameters{int R, int G, int B) or (str "GRAY", int %) <br />
 *<i>commonUtils.color.setColor({int R, int G, int B) or (str "GRAY", int %)})</i><br />     
 *@return java.awt.color
 *@type java.awt.color     
 *@param arguments (int R, int G, int B) or (str "GRAY", int %)
 */
function setColor(/*parameters set: (int R, int G, int B) or (str "GRAY", int %) */){
var red,green,blue,myColor;

  if(arguments.length == 3){
    red   = (Math.round((100/255)*arguments[0]))/100;
    green = (Math.round((100/255)*arguments[1]))/100;
    blue  = (Math.round((100/255)*arguments[2]))/100;
  } 
  if(arguments.length == 2){
   red   = (100-arguments[1])/100; 
   green = (100-arguments[1])/100; 
   blue  = (100-arguments[1])/100;
  }
myColor = new java.awt.Color(red, green, blue).getRGB();  
return myColor;  
}


/**
 *@deprecated
 *@private
 */
function setColor2(pa_arguments){
var red,green,blue,myColor;

  if(pa_arguments.length == 3){
    red   = (Math.round((100/255)*pa_arguments[0]))/100;
    green = (Math.round((100/255)*pa_arguments[1]))/100;
    blue  = (Math.round((100/255)*pa_arguments[2]))/100;
  } 
  if(pa_arguments.length == 2){
   red   = (100-pa_arguments[1])/100; 
   green = (100-pa_arguments[1])/100; 
   blue  = (100-pa_arguments[1])/100;
  }
myColor = new java.awt.Color(red, green, blue).getRGB();  
return myColor;  
}


/**
 *finds all obj defs of chosen types in selected databases, groups or models <br />
 *<i>commonUtils.search.searchObjDefsByType(pa_selectedDBs, pa_selectedGRPs, pa_selectedMDLs,phs_objTypes)</i><br />
 *@return HashSet of obj defs
 *@type java.util.HashSet()  
 *@param {Array}                pa_selectedDBs      ArisData.getSelectedDatabases(), or empty array [] <br />
 *@param {Array}                pa_selectedGrps     ArisData.getSelectedGroups(), or empty array [] <br />
 *@param {Array}                pa_selectedMDLs     ArisData.getSelectedModels(), or empty array [] <br />
 *@param {java.util.HashSet}    phs_objTypes        java.util.HashSet() of obj def type nums (Constants.OT_...) <br />     
 */
function f_searchObjDefsByType(pa_selectedDBs, pa_selectedGRPs, pa_selectedMDLs,phs_objTypes){
   
  var  a_objDefs  = new Array();
  var hs_objDefs = new java.util.HashSet();

  //if databases are selected
  for(var i=0; i < pa_selectedDBs.length; i++){
    var rootGroup = pa_selectedDBs[i].RootGroup();
    for(var j=0; j < phs_objTypes.toArray().length; j++){
      var a_objDefs = a_objDefs.concat(rootGroup.ObjDefList(true,phs_objTypes.toArray()[j]));    
    }
  }
  //if groups are selected
  for(var i=0; i < pa_selectedGRPs.length; i++){
    for(var j=0; j < phs_objTypes.toArray().length; j++){
      var a_objDefs = a_objDefs.concat(ga_selectedGRPs[i].ObjDefList(true,phs_objTypes.toArray()[j]));    
    }
  }
  //if models are selected
  for(var i=0; i < pa_selectedMDLs.length; i++){
    for(var j=0; j < phs_objTypes.toArray().length; j++){
      var a_objDefs = a_objDefs.concat(pa_selectedMDLs[i].ObjDefListFilter(phs_objTypes.toArray()[j]));    
    }
  }
  
  for(var i=0; i < a_objDefs.length; i++){     
     hs_objDefs.add(a_objDefs[i]);
  }  

return hs_objDefs;
}


/**
 *finds all obj occs of chosen types in selected databases, groups or models <br /> 
 *<i>commonUtils.search.searchObjOccsByType(pa_selectedDBs, pa_selectedGRPs, pa_selectedMDLs,phs_objTypes)</i><br />
 *@return HashSet of obj occs
 *@type java.util.HashSet()  
 *@param {Array}                pa_selectedDBs      ArisData.getSelectedDatabases(), or empty array [] <br />
 *@param {Array}                pa_selectedGrps     ArisData.getSelectedGroups(), or empty array [] <br /> 
 *@param {Array}                pa_selectedMDLs     ArisData.getSelectedModels(), or empty array [] <br />
 *@param {java.util.HashSet}    phs_objTypes        java.util.HashSet() of obj def type nums (Constants.OT_...) <br />     
 */
function f_searchObjOccsByType(pa_selectedDBs, pa_selectedGRPs, pa_selectedMDLs,phs_objTypes){
  var hs_objDefs = commonUtils.search.searchObjDefsByType(pa_selectedDBs, pa_selectedGRPs, pa_selectedMDLs,phs_objTypes);
  var hs_objOccs = java.util.HashSet();

  var hs_objDefsIter = hs_objDefs.iterator();
    while(hs_objDefsIter.hasNext()){
      var curObjDef = hs_objDefsIter.next();
      var a_ObjOccs = curObjDef.OccList();
      for(var i=0; i < a_ObjOccs.length; i++){
        hs_objOccs.add(a_ObjOccs[i])
      }
    }
  return hs_objOccs;
}    





/**
 *Creates template for list box driver dialog<br />
 *commonUtils.dialogs.listBoxDriver.template(pa_cxnSource,pa_cxnSelected,phm_cxnDlgStringTable) <br />
 *@return  object dialog template
 *@type object 
 *@param {Array}                pa_cxnSource        array for source list box - must be set
 *@param {Array}                pa_cxnSelected      array for selected list box, defaultly is an empty array[]    
 *@param {java.util.HashMap}    phm_stringTable     strings for localization
 *<br />
 *<u>copy following into your code to get phm_stringTable</u>
 *<br />
 *hm_stringCxnDlgStringTable = new java.util.HashMap();<br />
 *hm_stringCxnDlgStringTable.put("caption","");<br />
 *hm_stringCxnDlgStringTable.put("header","");<br />   
 *hm_stringCxnDlgStringTable.put("addAll","");<br />   
 *hm_stringCxnDlgStringTable.put("add","");<br />   
 *hm_stringCxnDlgStringTable.put("remove","");<br />   
 *hm_stringCxnDlgStringTable.put("removeAll","");<br />   
 *<br />
 *<u>example of listBoxdriver dialog template</u>
 *<br /> 
 *<img src="img/listBoxDriver.png" />
 */
function f_listBoxDriverTemplate(pa_cxnSource,pa_cxnSelected,phm_stringTable){

  try{
    pa_cxnSource.length
  }
  catch(e){
    var pa_cxnSource   = new Array(); 
  }
  
  try{
    pa_cxnSelected.length 
  }
  catch(e){
    var pa_cxnSelected = new Array()
  }

//localization:
var s_selectCxnForReport = new String();
var s_allListedCxns      = new String();
var s_addAll             = new String();
var s_add                = new String();
var s_remove             = new String();
var s_removeAll          = new String();

   //example template of string table for this dialog !!!
   //hm_stringCxnDlgStringTable = new java.util.HashMap();
   //hm_stringCxnDlgStringTable.put("caption","")
   //hm_stringCxnDlgStringTable.put("header","")   
   //hm_stringCxnDlgStringTable.put("addAll","")   
   //hm_stringCxnDlgStringTable.put("add","")   
   //hm_stringCxnDlgStringTable.put("remove","")   
   //hm_stringCxnDlgStringTable.put("removeAll","")   

   
  var currentDialog = Dialogs.createNewDialogTemplate(840,120,phm_stringTable.get("caption"),"doubleListBoxDriverHandler"); 
	  currentDialog.Text       (10,10,320,21, phm_stringTable.get("header"),"text1");
      currentDialog.ListBox    (10,40,350,100, pa_cxnSource.sort(),"cxnSourceList",1);
	  currentDialog.ListBox    (500,40,350,100,pa_cxnSelected.sort(),"cxnSelectedList",1);
	  currentDialog.PushButton (380,50,100,15, phm_stringTable.get("addAll"),"addAllButton");
	  currentDialog.PushButton (380,70,100,15, phm_stringTable.get("add"),"addButton");
	  currentDialog.PushButton (380,90,100,15, phm_stringTable.get("remove"),"removeButton");
	  currentDialog.PushButton (380,110,100,15,phm_stringTable.get("removeAll"),"removeAllButton");    
	  currentDialog.OKButton   ();
      currentDialog.CancelButton ();
  return currentDialog;   
}






/**
 *Creates buffer /hashMap/ for dialog template dialog<br />
 *<i>commonUtils.dialogs.listBoxDriver.buffer(pa_cxnSource)</i> <br />
 *@return dialog buffer (hashMap)
 *@type java.util.hashMap()  
 *@param {Array} pa_cxnSourceList array for source list box must be set
 *<br />
 *<u>Key set for doubleListBoxBuffer:</u><br />
 *<br />
 *<table border="1" width="300px" style="text-align: left;">
 *<tr><th>Key</th><th>default Value</th></tr>  
 *<tr><td>"cxnSource"</td><td>pa_cxnSourceList</td></tr> 
 *<tr><td>"cxnSelectedList"</td><td>[]</td></tr> 
 *</table> 
 */
function f_listBoxDriverBuffer(pa_cxnSourceList){

  var ghm_cxnDlgBuffer = new java.util.HashMap();
      ghm_cxnDlgBuffer.put("cxnSourceList",pa_cxnSourceList);
      ghm_cxnDlgBuffer.put("cxnSelectedList",new Array(0));

return ghm_cxnDlgBuffer; 
} 





/** 
 *buffer for graphic dialog<br />
 *example of use: graphicDialog_1 = commonUtils.dialogs.formatGraphic.buffer(pi_nubmer) // pi_number = 1 or 2  <br />
 *@return hashMap
 *@type java.util.hashMap()
 *@param {Number} pi_number (1 or 2 )
 *<br />  
 *<u>Key set of format graphic buffer type 2:</u><br />
 *<br />
 *<table border="1" width="300px" style="text-align: left;">
 *<tr><th>Key</th><th>Default Value</th></tr>
 *<tr><td>"txt_width"</td><td>"210"</td></tr>
 *<tr><td>"txt_height"</td><td>"297"</td></tr> 
 *<tr><td>"txt_top"</td><td>"30"</td></tr> 
 *<tr><td>"txt_bottom"</td><td>"30"</td></tr> 
 *<tr><td>"txt_left"</td><td>"20"</td></tr> 
 *<tr><td>"txt_right"</td><td>"20"</td></tr> 
 *<tr><td>"og_orientation"</td><td>1</td></tr>  
 *<tr><td>"dlb_paperFormat"</td><td>2</td></tr> 
 *</table> 
 *<br />  
 *<u>Key set of format graphic buffer type 1:</u><br />
 *<br />
 *<table border="1" width="300px" style="text-align: left;">
 *<tr><th>Key</th><th>default Value</th></tr>  
 *<tr><td>"og_color"</td><td>"0"</td></tr> 
 *<tr><td>"og_scaling"</td><td>"0"</td></tr> 
 *<tr><td>"og_margins"</td><td>"0"</td></tr> 
 *<tr><td>"txt_scaling"</td><td>"100"</td></tr> 
 *<tr><td>"cancelPressed"</td><td>false</td></tr>  
 *</table> 
 */
function f_graphicDlgBuffers(pi_number){    
  switch(pi_number){
    case 2:   
    //var ghm_graphicDlg2Buffer = new java.util.hashMap();     
       ghm_graphicDlg2Buffer.put("txt_width","210");       //dlg.getDlgText("txt_width"));
       ghm_graphicDlg2Buffer.put("txt_height","297");      //dlg.getDlgText("txt_height"));
       ghm_graphicDlg2Buffer.put("txt_top","30");      
       ghm_graphicDlg2Buffer.put("txt_bottom","30");       
       ghm_graphicDlg2Buffer.put("txt_left","20");              
       ghm_graphicDlg2Buffer.put("txt_right","20");
       ghm_graphicDlg2Buffer.put("og_orientation",1); 
       ghm_graphicDlg2Buffer.put("dlb_paperFormat",2);
    return ghm_graphicDlg2Buffer;                   
    break;

    case 1:
    default:
    //var ghm_graphicDlg1Buffer = new java.util.HashMap();    
       ghm_graphicDlg1Buffer.put("og_color","0");       
       ghm_graphicDlg1Buffer.put("og_scaling","0");       
       ghm_graphicDlg1Buffer.put("og_margins","0");       
       ghm_graphicDlg1Buffer.put("txt_scaling","100");
       ghm_graphicDlg1Buffer.put("cancelPressed", false);    
    return ghm_graphicDlg1Buffer;
    break;
  }       
}






/**
 *@private
 *handler for doubleListBoxDriver(pa_cxnSource,pa_cxnSelected,pi_lang,ps_caption,ps_header)<br />
 *!!! NO PART OF DOCUMENTATION !!!<br />
 *@return boolean
 *@type boolean 
 *@param dlgitem
 *@param action
 *@param suppvalue
 *@requires commonUtils.dialogs.listboxDriver.template() 
 */
function doubleListBoxDriverHandler(dlgitem,action,suppvalue){
  var result = false;
  var element;                         //an element of array
  var a_cxnOnMove   = new Array();     //an array of currently selected elements from source or selected array
  var a_cxnSource   = dlg.getDlgListBoxArray("cxnSourceList"); 
  var a_cxnSelected = dlg.getDlgListBoxArray("cxnSelectedList");
  
  switch (action){
    case 1:
      dlg.setDlgEnable("addAllButton",true);
      dlg.setDlgEnable("addButton", false);
      dlg.setDlgEnable("removeButton", false);   
      dlg.setDlgEnable("removeAllButton", true);                                   
    break;    
    case 2:
      switch(dlgitem){
        case "OK":
        case "Cancel":
          result = false;
        break;
        
        case "cxnSourceList":
          dlg.setDlgEnable("addButton", true);
          dlg.setDlgEnable("addAllButton",true)
          dlg.setDlgEnable("removeButton", false);                 
          dlg.setDlgEnable("removeAllButton", true);                             
          result = true;
        break;
        
        case "cxnSelectedList":
          dlg.setDlgEnable("addButton", false);        
          dlg.setDlgEnable("addAllButton", true);
          dlg.setDlgEnable("removeButton", true);                 
          dlg.setDlgEnable("removeAllButton", true);                             
          result = true;
        break;
        
        case "addAllButton":
          dlg.setDlgEnable("addButton", false);
          dlg.setDlgEnable("addAllButton",true)
          dlg.setDlgEnable("removeButton", false);                 
          dlg.setDlgEnable("removeAllButton", true);                             
          a_cxnSelected =  dlg.getDlgListBoxArray("cxnSelectedList").concat(dlg.getDlgListBoxArray("cxnSourceList"));          
          a_cxnSelected.sort()
          a_cxnSource   =  new Array();
          dlg.setDlgListBoxArray("cxnSelectedList", a_cxnSelected);          
          dlg.setDlgListBoxArray("cxnSourceList", a_cxnSource);                    
          result = true;          
        break;
        
        case "removeAllButton":
          dlg.setDlgEnable("addButton", false);
          dlg.setDlgEnable("addAllButton",true)
          dlg.setDlgEnable("removeButton", false);                 
          dlg.setDlgEnable("removeAllButton", true);                             
          
          a_cxnSource   =  dlg.getDlgListBoxArray("cxnSourceList").concat(dlg.getDlgListBoxArray("cxnSelectedList"));          
          a_cxnSource.sort();
          a_cxnSelected =  new Array();
          dlg.setDlgListBoxArray("cxnSelectedList", a_cxnSelected);          
          dlg.setDlgListBoxArray("cxnSourceList", a_cxnSource);                    
          result = true;          
        break;        
        
        case "addButton":
          dlg.setDlgEnable("addButton", false);
          dlg.setDlgEnable("addAllButton",true)
          dlg.setDlgEnable("removeButton", false);                 
          dlg.setDlgEnable("removeAllButton", true);                             
          
          a_cxnSource   = dlg.getDlgListBoxArray("cxnSourceList");
          a_cxnSelected = dlg.getDlgListBoxArray("cxnSelectedList");        
          a_cxnOnMove   = dlg.getDlgSelection("cxnSourceList");        
          for(var i=0; i < a_cxnOnMove.length; i++){
            element = a_cxnSource[a_cxnOnMove[i]];
            a_cxnSelected.push(element);
          }                
          a_cxnSelected.sort();
          dlg.setDlgListBoxArray("cxnSelectedList", a_cxnSelected);        
          for(var i=0; i < a_cxnOnMove.length; i++){      
            var currIndex = a_cxnOnMove[i];              
            a_cxnSource.splice(currIndex,1,"******DeleteIt******");
          }            
          var a_temp = new Array();
          for(var i=0; i < a_cxnSource.length; i++){
            if(a_cxnSource[i] != "******DeleteIt******") a_temp.push(a_cxnSource[i]);
          }
          a_cxnSource = a_temp;
          a_cxnSource.sort();          
          dlg.setDlgListBoxArray("cxnSourceList", a_cxnSource);        
          result = true;
          break;
                   
        case "removeButton":
          dlg.setDlgEnable("addButton", false);
          dlg.setDlgEnable("addAllButton",true)
          dlg.setDlgEnable("removeButton", false);                 
          dlg.setDlgEnable("removeAllButton", true);                             
          
          a_cxnSource   = dlg.getDlgListBoxArray("cxnSourceList");
          a_cxnSelected = dlg.getDlgListBoxArray("cxnSelectedList");        
          a_cxnOnMove   = dlg.getDlgSelection("cxnSelectedList");        
          for(var i=0; i < a_cxnOnMove.length; i++){
            element = (a_cxnSelected[a_cxnOnMove[i]])
            a_cxnSource.push(element);
            a_cxnSource.sort();
          }                
          dlg.setDlgListBoxArray("cxnSourceList", a_cxnSource);        
          for(var i=0; i < a_cxnOnMove.length; i++){      
            var currIndex = a_cxnOnMove[i];
            a_cxnSelected.splice(currIndex,1,"*****DeleteIt*****");
          }      
          var a_temp = new Array();
          for(var i=0; i < a_cxnSelected.length; i++){
            if(a_cxnSelected[i] != "*****DeleteIt*****") a_temp.push(a_cxnSelected[i]);
          }
          a_cxnSelected = a_temp;
          a_cxnSelected.sort();          
          dlg.setDlgListBoxArray("cxnSelectedList", a_cxnSelected);        
          result = true;
        break;                    
      }
  }
return result;
}





/**
 *creates template for graphic dialogs<br />
 *<i>commonUtils.dialogs.formatGraphic.template(pi_number,phm_graphicDlgStringTable)</i><br /> 
 *@return graphic dialog template
 *@type object
 *@param {Integer}              pi_number                   specify which type of graphic dialog template will be created
 *@param {java.Util.HashMap}    phm_graphicDlgStringTable   hashMap of strings for localization <br />
 *<br />
 *<u>copy following into your code:</u><br />
 *<br />
 *phm_graphicDlgStringTable  =  new  java.util.HashMap();<br />
 *<br />
 *<u>for format graphic template type 1</u><br />
 *phm_graphicDlgStringTable.put("caption2","Report")<br />
 *phm_graphicDlgStringTable.put("header3","Please use the following options to display the model graphic.")<br />
 *phm_graphicDlgStringTable.put("header4","Press OK to end your selection.")<br />
 *phm_graphicDlgStringTable.put("color","Color")<br />
 *phm_graphicDlgStringTable.put("colored","Colored")<br />
 *phm_graphicDlgStringTable.put("blackAndWhite","Black and White")<br />
 *phm_graphicDlgStringTable.put("scaling","Scaling")<br />
 *phm_graphicDlgStringTable.put("userDefined","User-Defined");<br />
 *phm_graphicDlgStringTable.put("scaleToFitPageSize","Scale to fit page size");<br />
 *phm_graphicDlgStringTable.put("modelPrintScale", "Model print scale");<br />
 *phm_graphicDlgStringTable.put("cut", "Cut");<br />
 *phm_graphicDlgStringTable.put("cutObjectsAtMargin", "Cut objects at margin");<br />
 *phm_graphicDlgStringTable.put("overlayObjectsBeyondMargin", "Overlay objects beyond margin");<br />
 *<br />  
 *<u>for format graphic template type 2</u><br />
 *phm_graphicDlgStringTable.put("caption1","Report");<br />
 *phm_graphicDlgStringTable.put("header1","Please select the page layout.")<br />
 *phm_graphicDlgStringTable.put("header2","Press OK to end your selection.")<br />
 *phm_graphicDlgStringTable.put("margins","Margins")<br />
 *phm_graphicDlgStringTable.put("top","Top")<br />
 *phm_graphicDlgStringTable.put("bottom","Bottom")<br />
 *phm_graphicDlgStringTable.put("left","Left")<br />
 *phm_graphicDlgStringTable.put("right","Right")<br />
 *phm_graphicDlgStringTable.put("paperFormat","Paper format")<br />
 *phm_graphicDlgStringTable.put("width","Width")<br />
 *phm_graphicDlgStringTable.put("height","Height")<br />
 *phm_graphicDlgStringTable.put("orientation","Orientation")<br />
 *phm_graphicDlgStringTable.put("portrait","Portrait")<br />
 *phm_graphicDlgStringTable.put("landscape","Landscape")<br />
 */
function f_graphicDlgTemplates(pi_number,phm_graphicDlgStringTable){
    
  switch (pi_number){   
      
      
    case 2:  
    
      var userdialog = Dialogs.createNewDialogTemplate(520, 280, phm_graphicDlgStringTable.get("caption1"),"graphicDlg2Handler");       // %GRID:10,7,1,1
          userdialog.Text(10, 10, 460, 15, phm_graphicDlgStringTable.get("header1"));
          userdialog.Text(10, 25, 460, 15, phm_graphicDlgStringTable.get("header2"));
          userdialog.GroupBox(10, 49, 240, 180, phm_graphicDlgStringTable.get("margins"));
          userdialog.Text(20, 70, 100, 15,phm_graphicDlgStringTable.get("top"));
          userdialog.TextBox(120, 67, 40, 20, "txt_top"); //"Text0"
          userdialog.Text(170, 70, 25, 15, "mm");        
          userdialog.Text(20, 100, 100, 15, phm_graphicDlgStringTable.get("bottom"));
          userdialog.TextBox(120, 97, 40, 20, "txt_bottom"); //Text2
          userdialog.Text(170, 100, 25, 15, "mm");
          userdialog.Text(20, 130, 100, 15, phm_graphicDlgStringTable.get("left"));
          userdialog.TextBox(120, 127, 40, 20, "txt_left"); //Text4
          userdialog.Text(170, 130, 25, 15, "mm"); 
          userdialog.Text(20, 160, 100, 15, phm_graphicDlgStringTable.get("right"));
          userdialog.TextBox(120, 157, 40, 20, "txt_right"); //Text5
          userdialog.Text(170, 160, 25, 15, "mm");
          userdialog.GroupBox(270, 49, 240, 180, phm_graphicDlgStringTable.get("paperFormat"));
          userdialog.DropListBox(280, 67, 220, 70, ga_paperFormatNames, "dlb_paperFormat");
          userdialog.Text(280, 100, 100, 14, phm_graphicDlgStringTable.get("width"));
          userdialog.TextBox(380, 97, 40, 21, "txt_width"); //Text1
          userdialog.Text(430, 100, 30, 14, "mm");
          userdialog.Text(280, 130, 100, 14, phm_graphicDlgStringTable.get("height"));
          userdialog.TextBox(380, 127, 40, 21, "txt_height"); //Text3
          userdialog.Text(430, 130, 30, 14, "mm");
          userdialog.GroupBox(280, 161, 220, 60, phm_graphicDlgStringTable.get("orientation"));
          userdialog.OptionGroup("og_orientation");
          userdialog.OptionButton(300, 180, 150, 15, phm_graphicDlgStringTable.get("portrait"));
          userdialog.OptionButton(300, 200, 150, 15, phm_graphicDlgStringTable.get("landscape"));
          userdialog.OKButton();
          userdialog.CancelButton();          
       return userdialog;          
    break;
    
    case 1:
    default:
      var userdialog = Dialogs.createNewDialogTemplate(700, 310, phm_graphicDlgStringTable.get("caption2"),"graphicDlg1Handler");      
          // %GRID:10,7,1,1
          userdialog.Text(10, 10, 460, 15, phm_graphicDlgStringTable.get("header3"));
          userdialog.Text(10, 25, 460, 15, phm_graphicDlgStringTable.get("header4"));
          userdialog.GroupBox(7, 50, 686, 55, phm_graphicDlgStringTable.get("color"));
          userdialog.OptionGroup("og_color");
          userdialog.OptionButton(20, 65, 580, 15,phm_graphicDlgStringTable.get("colored"));
          userdialog.OptionButton(20, 80, 580, 15,phm_graphicDlgStringTable.get("blackAndWhite"));
          userdialog.GroupBox(7, 120, 686, 85, phm_graphicDlgStringTable.get("scaling"));
          userdialog.TextBox(200, 132, 60, 20, "txt_scaling");
          userdialog.Text(280, 135, 50, 15, " %");
          userdialog.OptionGroup("og_scaling");
          userdialog.OptionButton(20, 135, 180, 15, phm_graphicDlgStringTable.get("userDefined"));
          userdialog.OptionButton(20, 150, 80, 15, "100%");
          userdialog.OptionButton(20, 165, 580, 15, phm_graphicDlgStringTable.get("scaleToFitPageSize"));
          userdialog.OptionButton(20, 182, 660, 15, phm_graphicDlgStringTable.get("modelPrintScale"));
          userdialog.GroupBox(7, 220, 686, 55, phm_graphicDlgStringTable.get("cut"));
          userdialog.OptionGroup("og_margins");
          userdialog.OptionButton(20, 235, 580, 15, phm_graphicDlgStringTable.get("cutObjectsAtMargin"));
          userdialog.OptionButton(20, 250, 580, 15, phm_graphicDlgStringTable.get("overlayObjectsBeyondMargin"));
          userdialog.OKButton();
          userdialog.CancelButton();
      return userdialog;          
    break;       
  }  
}      





/**
 *@private 
 *handler for formatGraphic dialog 1 <br />
 *!!!NOT PART OF DOCUMENTATION!!! <br />
 *@return boolean  
 *@type boolean 
 *@param dlgItem
 *@param action
 *@param suppValue
 *@requires formatGraphic.template 1  
 */
function graphicDlg1Handler(dlgItem,action,suppValue){
b_result = false;
  switch(action){
    case 1:   
      b_result = false;
    break;
    
    case 2:
      switch(dlgItem){
    //  case "OK":
        case "Cancel":
        ghm_graphicDlg1Buffer.put("cancelPressed", true);
        //result = false;
        break;                
      }  
    break;    
  }    
return b_result;
}






/**
 *@private 
 *handler for formatGraphic dialog 2<br />
 *!!!NOT PART OF DOCUMENTATION!!! <br />
 *@return boolean  
 *@type boolean 
 *@param dlgItem
 *@param action
 *@param suppValue
 *@requires formatGraphic.template 2  
 */
function graphicDlg2Handler(dlgitem, action, suppvalue){
  var b_result = false;
  
  switch(action) {
    case 1:     
      //set orientation (landscape/normal)
      if(dlg.getDlgText("txt_width") <= dlg.getDlgText("txt_height")) dlg.setDlgValue("og_orientation", 0);
      else dlg.setDlgValue("og_orientation", 1);

      var b_found = false;
      //set the current paper format according to values in width, and height text boxes
      for(var i=0; i < ga_paperFormats.length; i++) {
       if (((new java.lang.String(dlg.getDlgText("txt_width")).equals(new java.lang.String(ga_paperFormats[i].nWidth))) && 
            (new java.lang.String(dlg.getDlgText("txt_height")).equals(new java.lang.String(ga_paperFormats[i].nHeight)))) || 
           ((new java.lang.String(dlg.getDlgText("txt_height")).equals(new java.lang.String(ga_paperFormats[i].nWidth))) &&
            (new java.lang.String(dlg.getDlgText("txt_width")).equals(new java.lang.String(ga_paperFormats[i].nHeight))))) {
                
            dlg.setDlgValue("dlb_paperFormat", i);
            b_found = true;
            break;
        }
      }
      //set width and height for user defined. -> if no height and width from text boxes suits for any paper format type
      if (!b_found) {
        dlg.setDlgValue("dlb_paperFormat", 0);

        if (dlg.getDlgText("txt_width") <= dlg.getDlgText("txt_height")) {
            ga_paperFormats[0].nWidth =  dlg.getDlgText("txt_width");
            ga_paperFormats[0].nHeight = dlg.getDlgText("txt_height");
        }
        else {
            ga_paperFormats[0].nWidth =  dlg.getDlgText("txt_height");
            ga_paperFormats[0].nHeight = dlg.getDlgText("txt_width");
        }
      }
      break;
     
    case 2:
      switch(dlgitem) {
        case "og_Orientation":
			if ((suppvalue == 0 && (dlg.getDlgText("txt_width") > dlg.getDlgText("txt_height"))) ||
                (suppvalue == 1 && (dlg.getDlgText("txt_width") < dlg.getDlgText("txt_height")))) {
        
                var sValue = dlg.getDlgText("txt_width");
                dlg.setDlgText("txt_width", dlg.getDlgText("txt_height"));
                dlg.setDlgText("txt_height", sValue);
            }
        break;

        case "dlb_paperFormat":
          if (suppvalue >= 0 && suppvalue < ga_paperFormats.length) {
            if (dlg.getDlgValue("og_Orientation") == 0) {
                dlg.setDlgText("txt_width", new String(ga_paperFormats[suppvalue].nWidth));
                dlg.setDlgText("txt_height", new String(ga_paperFormats[suppvalue].nHeight));
            }
            else {
                dlg.setDlgText("txt_width", new String(ga_paperFormats[suppvalue].nHeight));
                dlg.setDlgText("txt_height", new String(ga_paperFormats[suppvalue].nWidth));
            }
          }
          break;

      }
      break;

  }
 
  return b_result;
}





/**
 *Checks wether the parameter value is integer or not <br />
 *<i>commonUtils.bool.isInteger(parameter)</i>
 *@return true/false
 *@type boolean 
 *@param {-} p_value tested value
 */    
function isInteger(p_value){
var  p_value = new Number(p_value);
  
  if(Math.floor(p_value) == p_value) return true;
  else return false;
}





/**
 *Method sets default properties of output object. Width, height, orientation, TOC. Output object must be created first<br />
 *<i>commonUtils.output.setOutput(p_output,p_lang,p_orientation)</i><br /> 
 *@return  output object
 *@type Aris object
 *@param {ArisObject}   p_output        Context.createOutputObject()
 *@param {Number}       p_lang          Constants.getSelectedLanguage()<br />
 *@param {String}       p_orientation   "portrait" or "landscape" <br />
 *@requires Context.createOutputObject() 
 */
function setOutput(p_output,p_lang, p_orientation/*portrait/landscape*/){
  p_output.Init(p_lang);
  
  var width  = new Number();
  var height = new Number();
  switch(p_orientation){       
    case "landscape":
      width  = 297;
      height = 210;   
    break;
    
    case "portrait":
    default:  
      width  = 210;
      height = 297;
    break;     
  }
  
  //layout
  p_output.SetPageWidth(width);
  p_output.SetPageHeight(height);
  p_output.SetLeftMargin(10);
  p_output.SetRightMargin(10);
  p_output.SetTopMargin(20);
  p_output.SetBottomMargin(20);
  p_output.SetDistHeader(3);//10);
  p_output.SetDistFooter(10);
  p_output.SetAutoTOCNumbering(true);  

return p_output;   
}



/**
 *method sets basic formats for headers,captions,subCaptions,normal text in output object <br />
 *<i>commonUtils.output.setBasicFormat</i><br /> 
 *@return modified output object
 *@type object
 *@param {ArisObject}   p_output    Context.createOutputObject()
 *@requires Context.createOutputObject() 
 */ 
function setBasicFormat(p_output){
  //go_outfile.DefineF("basic", "Arial", 12, Constants.C_BLACK,    Constants.C_TRANSPARENT, Constants.FMT_LEFT, 0, 0, 0, 0, 0, 1);
var blue   = commonUtils.color.setColor(53,140,203);
var gray15 = commonUtils.color.setColor("GRAY",15);
var gray05 = commonUtils.color.setColor("GRAY",5);

  p_output.DefineF("header" ,    "Arial", 12, Constants.C_BLUE_GREY, Constants.C_TRANSPARENT,     Constants.FMT_LEFT|Constants.FMT_BOLD, 0, 0, 0, 0, 0, 1);                                  
  p_output.DefineF("caption",    "Arial", 10, Constants.C_BLACK,     blue,       Constants.FMT_LEFT|Constants.FMT_BOLD, 0, 0, 0, 0, 0, 1);     
  p_output.DefineF("subCaption", "Arial", 10, Constants.C_BLACK,     gray15,       Constants.FMT_LEFT|Constants.FMT_BOLD, 0, 0, 0, 0, 0, 1);     
  p_output.DefineF("basic"  ,    "Arial", 10, Constants.C_BLACK,     gray05,       Constants.FMT_LEFT                   , 0, 0, 0, 0, 0, 1);  

return p_output;  
}



/**
 *begins table in output object with default settings, output object must be created first.
 *<i>commonUtils.otuput.beginTable(p_output)</i><br /> 
 *@return modified output object
 *@type object
 *@param {ArisObject}   p_output    Context.createOutputObject()
 *@requires outputObject Context.createOutputObject() 
 */
function beginTable(p_output){
p_output.BeginTable(100, Constants.C_WHITE, Constants.C_TRANSPARENT, Constants.FMT_CENTER, 0);
}





/**
 *begins table in output object with default settings, output object must be created first and {@link #beginTable} must be called first.<br />
 *<i>commonUtils.output.endTable(p_output)</i><br /> 
 *@return modified output object
 *@type object
 *@param {ArisObject}   p_output    Context.createOutputObject()
 *@requires outputObject Context.createOutputObject() 
 */
function endTable(p_output){
p_output.EndTable (" ", 100,"Arial", 12, Constants.C_BLACK, Constants.C_TRANSPARENT, 0, Constants.FMT_LEFT | Constants.FMT_VTOP, 0);
} 






/**
 *writes data from output object to selected file in selected format, output object must be created first<br />
 *<i>commonUtils.output.writeOutput(p_output)</i><br />
 *@return -
 *@type -
 *@param {ArisObject}   p_output    Context.createOutputObject()
 *@requires outputObject Context.createOutputObject() 
 */
function writeOutput(p_output){
if(p_output != null) p_output.WriteReport();
}






/**
 *@private
 *@deprecated 
 *clear duplicities from an array<br />
 *<i>commonUtils.array.clearDuplicities(p_array)</i><br />  
 *@return unique array  
 *@type array  
 *@param {Array}    p_array  
 */
function clearDuplicitiesInArray(p_array){
var a_result = new Array()
  for(var i=0; i < p_array.length; i++){
    if(!commonUtils.array.contains(a_result,p_array[i])) a_result.push(p_array[i])
  }
return a_result
}



/**
 *@private
 *@deprecated 
 *checks wether and array contains some element<br />
 *<i>commonUtils.array.contains(p_array,p_element)</i><br />  
 *@return unique array  
 *@type array  
 *@param {Array}     p_array
 *@param {-}         p_element 
 */
function arrayContainsElement(p_array,p_element){
var s_element = p_element.toString();
  for(var i=0; i < p_array.length; i++){
    var s_arrayi = p_array[i].toString();    
    if(s_arrayi.equals(s_element)){
      return true;
    }
  }    
return false;
}



/**
 *returns only logical out edges (follows the hierarchy down)  the connections are followed by their meaning not only by their direction<br />
 *<i>commonUtils.search.getAllOutEdgesLogical</i><br /> 
 *@return   list of "logical" outgoing connections as Array
 *@type array
 *@param {ArisObject}   p_objOcc      object occurance
 *@param {Integer}      p_mdlType     model type (Constants.MT_....)
 *@param {Integer}      p_structure   structure (EDGES_ALL, EDGES_STRUCTURE, EDGES_NONSTRUCTURE)  
 */
function f_edgesOutLogical(p_objOcc,p_mdlType,p_structure){
//parameters:
//p_objOcc:     selected object occurance
//p_mdlType:    model type in which occures p_objOcc
//p_structure:  Constants.EDGES_ALL, Constants.EDGES_STRUCTURE, Constants.EDGES_NONSTRUCTURE
  
  var hm_filter = new java.util.HashSet(); 

  switch(p_mdlType){
    case Constants.MT_ORG_CHRT:
      //hm_filter.add(Constants.CT_OCCUPIES); 
      //hm_filter.add(Constants.CT_GENERAL_2); 
      //hm_filter.add(Constants.CT_IS_ASSIG_1);
      //hm_filter.add(Constants.CT_EXEC_5); 
      //hm_filter.add(Constants.CT_IS_ORG_RSPN);
      hm_filter.add(Constants.CT_IS_ASSIG_1);
      //hm_filter.add(Constants.CT_IS_CRT_BY);
      hm_filter.add(Constants.CT_OCCUPIES);
      hm_filter.add(Constants.CT_EXEC_5);
    break;
    
    default:
    break
  }
  //get all connections
  var a_cxnOccsAll = p_objOcc.Cxns(Constants.EDGES_INOUT,p_structure) 

  //filter connections
  var a_cxnOccsFiltered = new Array();
  for(var i=0;i<a_cxnOccsAll.length;i++){
    if(hm_filter.contains(a_cxnOccsAll[i].CxnDef().TypeNum())){ 
      if(a_cxnOccsAll[i].TargetObjOcc().IsEqual(p_objOcc)) a_cxnOccsFiltered.push(a_cxnOccsAll[i])
    }     
    else{
      if(a_cxnOccsAll[i].SourceObjOcc().IsEqual(p_objOcc)) a_cxnOccsFiltered.push(a_cxnOccsAll[i])
    }      
  }

  //return filtered connection
  return a_cxnOccsFiltered;  
}





/**
 *returns only logical incoming edges (follows the hierarchy up) the connections are followed by their meaning not only by their direction<br />
 *<i>commonUtils.search.getAllInEdgesLogical</i><br /> 
 *@return   list of "logical" incoming connections as Array
 *@type array
 *@param {ArisObject}   p_objOcc      obj occurance
 *@param {Integer}      p_mdltype     model type (Constants.MT_....)
 *@param {Integer}      p_structure   structure (EDGES_ALL, EDGES_STRUCTURE, EDGES_NONSTRUCTURE)  
 */
function f_edgesInLogical(p_objOcc,p_mdlType,p_structure){
//parameters:
//p_objOcc:     selected object occurance
//p_mdlType:    model type in which occures p_objOcc
//p_structure:  Constants.EDGES_ALL, Constants.EDGES_STRUCTURE, Constants.EDGES_NONSTRUCTURE
  
  var hm_filter = new java.util.HashSet(); 

  switch(p_mdlType){
    case Constants.MT_ORG_CHRT:
      hm_filter.add(Constants.CT_OCCUPIES); 
      //hm_filter.add(Constants.CT_GENERAL_2); 
      hm_filter.add(Constants.CT_IS_ASSIG_1);
      hm_filter.add(Constants.CT_EXEC_5);       
      hm_filter.add(Constants.CT_IS_ORG_RSPN);
    break;
    
    default:
    break
  }
  //get all connections
  var a_cxnOccsAll = p_objOcc.Cxns(Constants.EDGES_INOUT,p_structure) 

  //filter connections
  var a_cxnOccsFiltered = new Array();
  for(var i=0;i<a_cxnOccsAll.length;i++){
    if(hm_filter.contains(a_cxnOccsAll[i].CxnDef().TypeNum())){ 
      if(a_cxnOccsAll[i].SourceObjOcc().IsEqual(p_objOcc)) a_cxnOccsFiltered.push(a_cxnOccsAll[i])
    }     
    else{
      if(a_cxnOccsAll[i].TargetObjOcc().IsEqual(p_objOcc)) a_cxnOccsFiltered.push(a_cxnOccsAll[i])
    }      
  }

  //return filtered connection
  return a_cxnOccsFiltered;  
}





/**
 *retunrs all relevant root objects of any graph in chosen model<br />
 *<i>commonUtils.search.findRoots</i><br /> 
 *@return list of root objects as Array
 *@type array
 *@param {Aris object}  p_model     model which will be searched for all roots   
 */
function f_findRootObjOccs(p_model){
//p_model.BuildGraph(true);
//return p_model.StartNodeList();

//All objects which have cxns but no "logical" incoming connections
//get all obj occs from model
  var a_objOccs = p_model.ObjOccList()
  var a_roots   = new Array();
  if(a_objOccs.length == 0) return [];
  if(a_objOccs.length == 1) return a_objOccs;
  if(a_objOccs.length  > 1){
    for(var i=0; i<a_objOccs.length; i++){
      if(commonUtils.search.getAllInEdgesLogical(a_objOccs[i],p_model.TypeNum(),Constants.EDGES_ALL).length == 0) a_roots.push(a_objOccs[i]);
    }
    return a_roots;
  }
return []  
} 



/**
 *retunrs all relevant leaf objects of any graph in chosen model<br />
 *<i>commonUtils.search.findLeaves</i><br /> 
 *@return list of leaf objects as Array
 *@type array
 *@param {Aris object}  p_model     model which will be searched for all leaves
 */
function f_findLeafObjOccs(p_model){
//p_model.BuildGraph(true);
//return p_model.StartNodeList();

//All objects which have cxns but no "logical" outgoing connections
//get all obj occs from model
  var a_objOccs = p_model.ObjOccList()
  var a_leaves   = new Array();
  if(a_objOccs.length == 0) return [];
  if(a_objOccs.length == 1) return a_objOccs;
  if(a_objOccs.length  > 1){
    for(var i=0; i<a_objOccs.length; i++){
      if(commonUtils.search.getAllOutEdgesLogical(a_objOccs[i],p_model.TypeNum(),Constants.EDGES_ALL).length == 0) a_leaves.push(a_objOccs[i]);
    }
    return a_leaves;
  }
return []  
} 



/**
 *formats a string e.g.: var s = "&#64;1 and &#64;2 are swimming in the &#64;3" => commonUtils.attsall.formatString(s,[Natasha,Lucy,pool]) => return: Natasha and Lucy are swimming in the pool. <br />
 *<i>commonUtils.attsall.formatString(ps_string,pa_vars)</i><br />
 *@return formated string
 *@type string 
 *@param {string}   ps_string   is the string which will be modified
 *@param {array}    pa_vars     is list of strings for replace placeholders in modified string  
 */
function f_formatString(ps_string,pa_vars){
  ps_string = new String(ps_string);
  for(var i=0; i<pa_vars.length;i++){      
     ps_string = ps_string.replace("@"+i, pa_vars[i]);    
  }
return ps_string;  
}


/**
 *sorts array of cxn occurances by their Target object definition Names - use as paramater in method sort()<br />
 *<i>commonUtils.sort.sortCxnOccByTargetObjDefName</i><br />
 *@return -1 || 0 || 1
 *@type Integer
 *@param
 */
function f_sortCxnOccByTargetObjDefName(a,b){
var a_target = a.TargetObjOcc().ObjDef().Name(Context.getSelectedLanguage());
var b_target = b.TargetObjOcc().Objdef().Name(Context.getSelectedLanugage());

  if(a_target > b_target) return  1;
  if(a_target < b_target) return -1;   
    
return 0; 
} 

/**
 *sorts array of cxn occurances by their source object definition Names - use as paramater in method sort()<br />
 *<i>commonUtils.sort.sortCxnOccByTargetObjDefName</i><br />
 *@return -1 || 0 || 1
 *@type Integer
 *@param
 */
function f_sortCxnOccBySourceObjDefName(a,b){
var a_source = a.SourceObjOcc().ObjDef().Name(Context.getSelectedLanguage());
var b_source = b.SourceObjOcc().Objdef().Name(Context.getSelectedLanugage());

  if(a_source > b_source) return  1;
  if(a_source < b_source) return -1;   
    
return 0; 
}

/**
 *sorts array of cxn occurances by their "real" target object definition Names. The target object is chosen by the meaning not by the cxn direction only - use as paramater in method sort()<br />
 *<i>commonUtils.sort.sortCxnOccByTargetObjDefNameLogical</i><br />
 *@return -1 || 0 || 1
 *@type Integer
 *@param
 */
function f_sortCxnOccByTargetObjDefNameLogical(a,b){
var hm_reverseCxns = reverseCxnList();

a_target = (  hm_reverseCxns.contains(a.CxnDef().TypeNum())  ) ? a.SourceObjOcc().ObjDef().Name(Context.getSelectedLanguage()) : a.TargetObjOcc().ObjDef().Name(Context.getSelectedLanguage());
b_target = (  hm_reverseCxns.contains(b.CxnDef().TypeNum())  ) ? b.SourceObjOcc().ObjDef().Name(Context.getSelectedLanguage()) : b.TargetObjOcc().ObjDef().Name(Context.getSelectedLanguage());


  if(a_target > b_target) return  1;
  if(a_target < b_target) return -1;   
    
return 0; 
} 

/**
 *sorts array of cxn occurances by their "real" source object definition Names. The source object is chosen by the meaning not by the cxn direction only - use as paramater in method sort()<br />
 *<i>commonUtils.sort.sortCxnOccBySourceObjDefNameLogical</i><br />
 *@return -1 || 0 || 1
 *@type Integer
 *@param
 */
function f_sortCxnOccBySourceObjDefNameLogical(a,b){
var hm_reverseCxns = reverseCxns();

a_source = (  hm_reverseCxns.contains(a.CxnDef().TypeNum())  ) ? a.TargetObjOcc().ObjDef().Name(Context.getSelectedLanguage()) : a.SourceObjOcc().ObjDef().Name(Context.getSelectedLanguage());
b_source = (  hm_reverseCxns.contains(b.CxnDef().TypeNum())  ) ? b.TargetObjOcc().ObjDef().Name(Context.getSelectedLanguage()) : b.SourceObjOcc().ObjDef().Name(Context.getSelectedLanguage());


  if(a_source > b_source) return  1;
  if(a_source < b_source) return -1;   
    
return 0; 
} 
