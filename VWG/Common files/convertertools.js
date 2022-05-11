/**
 * Copyright (C) 2017 Software AG Darmstadt, Germany and/or Software AG USA Inc., Reston, VA, USA,
 * and/or its subsidiaries and/or its affiliates and/or their licensors.
 *
 * Use, reproduction, transfer, publication or disclosure is prohibited
 * except as specifically provided for in your License Agreement with Software AG.
 */

/**
 * Convertertools.js
 */

/**
 * VB-Konstanten (fuer Messagebox etc.)
 */
var vbCrLf             = "\r\n";
var vbCr               = "\r";
var vbLf               = "\n";
var vbTab              = "\t";

var vbCritical 	       =   16;
var vbQuestion         =   32;
var vbExclamation      =   48;
var vbInformation      =   64;
var vbOK               =    1;
var vbCancel           =    2;
var vbAbort            =    3;
var vbRetry            =    4;
var vbIgnore           =    5;
var vbYes              =    6;
var vbNo               =    7;
var vbOKOnly           =    0;
var vbOKCancel         =    1;
var vbAbortRetryIgnore =    2;
var vbYesNoCancel      =    3;
var vbYesNo            =    4;
var vbRetryCancel      =    5;
var vbDefaultButton1   =    0;
var vbDefaultButton2   =  256;
var vbDefaultButton3   =  512;
var vbApplicationModal =    0;
var vbSystemModal      = 4096;


var vbUpperCase    =   1;
var vbLowerCase    =   2;
var vbProperCase   =   3;
var vbWide         =   4;
var vbNarrow       =   8;
var vbKatakana     =  16;
var vbHiragana     =  32;
var vbUnicode 	   =  64;
var vbFromUnicode  = 128;

var vbNormal       =   0;
var vbReadOnly     =   1;
var vbHidden       =   2;
var vbSystem       =   4;
var vbVolume       =   8;
var vbDirectory    =  16;
var vbArchive      =  32;



function vbVal(str) {
  return parseFloat(str);
}


function __toBool(val)
{
  if(val==true)
    return true;
  else if(val==false)
    return false;
  else return (val != 0);
}


function __toByte(val)
{
  if(typeof(val)=="object")
    val = "" + val;
    
  if(typeof(val)=="string")
  {
    if(val.substr(0,2)=="&H" || val.substr(0,2)=="&h")
      return __roundToU8(parseInt(val.substr(2),16));
    else if(val.substr(0,2)=="&O" || val.substr(0,2)=="&o")
      return __roundToU8(parseInt(val.substr(2),8));
    else
      return __roundToU8(parseInt(val));
  }
  return __roundToU8(val);
}

function __roundToU8(val)
{
  if(typeof(val)!="number")
    return 0;
  if(val<=0)
    return 0;
  if(val>256)
    return 256;
  return Math.floor(val);
}

function __roundToS16(val)
{
  if(typeof(val)!="number")
    return 0;
  if(val<-32768)
    val = 0;
  if(val>32767)
    val = 0;
  if(val==0)
    return 0;
  return Math.floor(val);
}


function __toCurrency(val)
{
  return parseFloat(val);
}


function __toDate(val)
{
  return new Date(val);
}


function __toDecimal(val)
{
  return parseFloat(val);
}


function __toDouble(val)
{
  return parseFloat(val);
}


function __toInteger(val)
{
    // TANR 259037 - because problems with userdefined model, symbol or attribute types 
    return __toLong(val);
/*    
  if(typeof(val)=="object")
    val = "" + val;
    
  if(typeof(val)=="string")
  {
    if(val.substr(0,2)=="&H" || val.substr(0,2)=="&h")
      return __roundToS16(parseInt(val.substr(2),16));
    else if(val.substr(0,2)=="&O" || val.substr(0,2)=="&o")
      return __roundToS16(parseInt(val.substr(2),8));
    else
      return __roundToS16(parseInt(val));
  }
  return __roundToS16(val);
*/  
}


function __toLong(val)
{
  if(typeof(val)=="object")
    val = "" + val;
    
  if(typeof(val)=="string")
  {
    if(val.substr(0,2)=="&H" || val.substr(0,2)=="&h")
      return parseInt(val.substr(2),16);
    else if(val.substr(0,2)=="&O" || val.substr(0,2)=="&o")
      return parseInt(val.substr(2),8);
    else
      return parseInt(val);
  }
  else if(typeof(val)=="number")
    return parseInt(""+val);
  return 0;
}



function __toSingle(val)
{
  return parseFloat(val);
}


function __toString(val)
{
  if(val==null)
    return "null";

  else
    return val.toString();
}

function __toFixedString(val, maxLen)
{
  var str = __toString(val);
  if(str.length<=maxLen)
    return str;
  return str.substr(0,maxLen);
}


function __toNumeric(val)
{
  if(typeof(val)=="object")
    val = "" + val;
    
  if(typeof(val)=="string")
  {
    if(val.substr(0,2)=="&H" || val.substr(0,2)=="&h")
      return parseInt(val.substr(2),16);
    else if(val.substr(0,2)=="&O" || val.substr(0,2)=="&o")
      return parseInt(val.substr(2),8);
    else
      return parseFloat(val);
  }
  else if(typeof(val)=="number")
    return val;

  return 0;
}

__ommittedOptionalParam = function ()
{
  this.name = "ommitted optional param";
}

// map
__map = function()
{
//  this.map = new java.util.HashMap();
  this.map = new java.util.TreeMap();       // MWZ, 05.01.2006 - Call-ID 110850
  this.mapcontents = new Array();
}

__map.prototype.Insert = function(key, object)
{
  this.map.put(key,object);
  this.mapcontents[this.mapcontents.length] = key;
  this.length = this.map.size(); //for converted scripts which access the length as a property
}

__map.prototype.iterator = function()
{
  return this.map.keySet().iterator();
}

__map.prototype.Count = function()
{
  return this.map.size();
}

__map.prototype.length = function()
{
  return this.map.size();
}

__map.prototype.Get = function(key)
{
  return this.map.get(key);
}

__map.prototype.ValueAt = function(idx)
{
  return this.map.get(this.mapcontents[idx]);
}

__map.prototype.ContainsKey = function(key)
{
  return (this.map.containsKey(key));
}

__map.prototype.KeyAt = function(idx)
{
  return this.mapcontents[idx];
}

__map.prototype.Remove = function(key)
{
  var idx = -1;
  for(var i=0;i<this.mapcontents.length;i++) {
    if(this.mapcontents[i]==key) {
    
      idx = i; break; 
    }
  }
  
  if(idx==-1) {
    return false;
  }
  
  var tmp = new Array();
  for(i=0;i<idx;i++) {
    tmp[i] = this.mapcontents[i];
  }
  for(i=idx+1;i<this.mapcontents.length;i++) {
    tmp[i-1] = this.mapcontents[i];
  }
  this.mapcontents = tmp;
  this.map.remove(key);
  this.length = this.map.size(); //for converted scripts which access the length as a property
  
  return true;
}

__map.prototype.IndexOf = function(key)
{
  var idx = -1;
  for(var i=0;i<this.mapcontents.length;i++) {
    if(this.mapcontents[i]==key) {
      idx = i; break; 
    }
  }
  return idx;
}

// end map


function vbDateAdd(interval, number, dateExpr) 
{
  if(interval=="yyyy") {
  	return new Date(dateExpr.getTime() + (365*24*60*60*1000));
  }
  else if(interval=="q") {
  }
  else if(interval=="m") {
  	if(dateExpr.getMonth()==11) {
  	  return new Date(dateExpr.getFullYear()+1,0,dateExpr.getDate());
  	} else {
  	  return new Date(dateExpr.getFullYear(),dateExpr.getMonth(),dateExpr.getDate());
  	}
  	return new Date(dateExpr.getTime() + (365*24*60*60*1000));
  }
  else if(interval=="y") {
  	return new Date(dateExpr.getTime() + (24*60*60*1000));
  }
  else if(interval=="d") {
  	return new Date(dateExpr.getFullYear(),dateExpr.getMonth(),dateExpr.getDate()+1);
  }
  else if(interval=="w") {
  	return new Date(dateExpr.getTime() + (7*24*60*60*1000));
  }
  else if(interval=="ww") {
    if(dateExpr.getDay()==6) {
      return DateExpr;
    } else {
  	  return new Date(dateExpr.getTime() + (24*60*60*1000));
    }
  }
  else if(interval=="h") {
    return new Date(dateExpr.getTime() + (60*60*1000));
  }
  else if(interval=="m") {
    return new Date(dateExpr.getTime() + (60*1000));
  }
  else if(interval=="s") {
    return new Date(dateExpr.getTime() + 1000);
  }
  
  return dateExpr;
}



function vbDateDiff(interval, dateExpr1, dateExpr2) {
  var diff = dateExpr2.getTime() - dateExpr1.getTime();
  var d_diff = new Date(diff);
  
  if(interval=="yyyy") {
    return d_diff.getFullYear();
  }
  else if(interval=="q") {
    return d_diff.getTime() / (91*24*60*60*1000);
  }
  else if(interval=="m") {
    return d_diff.getFullYear() * 12 + d_diff.getMonth();
  }
  else if(interval=="y") {
    return d_diff.getTime() / (24*60*60*1000);
  }
  else if(interval=="d") {
    return d_diff.getTime() / (24*60*60*1000);
  }
  else if(interval=="w") {
    return d_diff.getTime() / (24*60*60*1000);
  }
  else if(interval=="ww") {
    return d_diff.getTime() / (7*24*60*60*1000);
  }
  else if(interval=="h") {
    return d_diff.getTime() / (60*60*1000);
  }
  else if(interval=="m") {
    return d_diff.getTime() / (60*1000);
  }
  else if(interval=="s") {
    return d_diff.getTime() / 1000;
  }
  
  return 0;
}



function vbDatePart(interval, dateExpr) {
  if(interval=="yyyy") {
    return dateExpr.getFullYear();
  }
  else if(interval=="q") {
    return (dateExpr.getMonth()<4 ? 1 : (dateExpr.getMonth()<7 ? 2 : (dateExpr.getMonth() < 10 ? 3 : 4 )));
  }
  else if(interval=="m") {
    return dateExpr.getMonth();
  }
  else if(interval=="y") {
    return dateExpr.getDate();
  }
  else if(interval=="d") {
    return dateExpr.getDate();
  }
  else if(interval=="w") {
    return dateExpr.getDay();
  }
  else if(interval=="ww") {
    return dateExpr.getWeek();
  }
  else if(interval=="h") {
    return dateExpr.getHour();
  }
  else if(interval=="m") {
    return dateExpr.getMinute();
  }
  else if(interval=="s") {
    return dateExpr.getSecond();
  }
}


function vbDateSerial(year, month, day) {
  return new Date(year, month, day);
}

function vbTimeSerial(hour, minute, second) {
  var d = new Date();
  d.setHours(hour);
  d.setMinutes(minute);
  d.setSeconds(second);
  return d;
}


function vbDateValue(txtDate) {
  return new Date(txtDate);
}


function vbDay(dateExpr) {
  return dateExpr.getDate();
}


function vbMonth(dateExpr) {
  return dateExpr.getMonth()+1;
}


function vbMonthName(monthNum) {
  var _d = new Date(2004,monthNum-1,1);
  var d = new java.util.Date(_d.getTime());
  var sdf = new java.text.SimpleDateFormat("MMMMM");
  return sdf.format(d);
}


function vbYear(dateExpr) {
  return dateExpr.getFullYear();
}


function vbSecond(dateExpr) {
  return dateExpr.getSeconds();
}

function vbMinute(dateExpr) {
  return dateExpr.getMinutes();
}

function vbHour(dateExpr) {
  return dateExpr.getHours();
}

function vbTimer() {
  var dateExpr = new Date();
  var prevMidnight = new Date(dateExpr.getFullYear(), dateExpr.getMonth(), dateExpr.getDate());
  return (dateExpr.getTime() - prevMidnight.getTime()) / 1000;
}


function vbNow() {
  return new Date();
}


function vbTimeValue(timeExpr) {
  return new Date(timeExpr);
}

function vbWeekday(dateExpr) {
  return dateExpr.getDay();
}

function vbWeekdayName(weekday, bAbbrev) {
  var dateExpr = new Date(2005,7,weekday);
  var d = new java.util.Date(dateExpr.getTime());
  var sdf = new java.text.SimpleDateFormat((bAbbrev==null||!bAbbrev)?"EEEEE":"E");
  return sdf.format(d);
}


function __getArrayInfo(arr)
{
  if(arr != undefined)
  {
    if(typeof(arr)=="object" && arr.constructor.toString().indexOf("__isHolder")!=-1)
      arr = arr.value;
    
    try
    {
        //liefert fuer NativeArrays einen Fehler...dann haben wir auch keine ArrayInfo:)
        if(arr.__arrayInfo != undefined)
          return arr.__arrayInfo;
    }
    catch(e)
    {
    }
    
  }
}

function __registerArrayInfo(arr, arrInfo)
{
  if(typeof(arr)=="object" && arr.constructor.toString().indexOf("__isHolder")!=-1)
    arr = arr.value;
  arr.__arrayInfo = arrInfo;
}

function unregisterArrayInfo(arr, arrInfo) {
  if(typeof(arr)=="object" && arr.constructor.toString().indexOf("__isHolder")!=-1)
    arr = arr.value;
  arr.__arrayInfo = null;
}

function __createArray()
{
  var initValue = null;
  if(arguments.length==1)
    return new Array();
  else if(arguments.length>1)
    initValue = arguments[0];
  return __initArray(new __ArrayInfo(), initValue);
}

function __getArrayIndex(arr, dim, idx)
{
  var arrInfo = __getArrayInfo(arr);
  if(arrInfo==null || (dim==1 && arrInfo.dimensions.length==0))
    return idx;
  return arrInfo.getArrayIndex(dim, idx);
}

function __getLBound(arr, dim)
{
  var arrInfo = __getArrayInfo(arr);
  if(arrInfo==null || (dim==1 && arrInfo.dimensions.length==0))
    return 0;
  return arrInfo.getLowerBound(dim);
}

function __getUBound(arr, dim)
{
  if (arr == undefined) {
      return 0;
  }
  var arrInfo = __getArrayInfo(arr);
  if(arrInfo==null || (dim==1 && arrInfo.dimensions.length==0))
//    return arr.length==0 ? 0 : arr.length-1;
    return arr.length-1;
  return arrInfo.getUpperBound(dim);
}

function __arrlength(arr)
{
  if(typeof(arr)=="object" && arr.constructor.toString().indexOf("__isHolder")!=-1)
    arr = arr.value;
  return arr.length; 
}

/**
 * Initialisiert Array mit angegebener Info und dem Initialisierungswert in initValue
 * @return
 */
function __initArray(arrayInfo, initValue)
{
  var numDims = arrayInfo.dimensions.length;
  var bIsUserTypeArray = initValue==null ? false : (initValue.constructor.toString().indexOf("__usertype_")!=-1);

  // Erhaelt die Menge der Arrays, die zu initialisieren sind.
  var toInitialize = new Array();
  // Startmenge fuer Initialisierung umfasst das Ergebnis-Array
  toInitialize[toInitialize.length] = new Array();

  var resultArray = toInitialize[0];
  // alert("1. resultArray has length " + resultArray.length);
  // alert("1. toInitialize[0] has length " + toInitialize[0].length);

  // Initialisierung der Dimensionen
  for(var i=0;i<numDims;i++)
  {
    var nextToInitialize = new Array();

    var dimInfo = arrayInfo.getDimension(i+1);
    // alert("dimInfo.upperBound="+dimInfo.upperBound);
    var dimLength = dimInfo.upperBound - dimInfo.lowerBound + 1; // Anzahl Elemente in der Dimension

    //alert("__initArray, i="+i+", dimLength="+dimLength);
    // Alle zu initialisierenden Array bearbeiten
    for(var j=0;j<toInitialize.length;j++)
    {
      // Initialisieren mit Wert (letzte Dimension) oder Arrays (sonst)
      for(var k=0;k<dimLength;k++)
      {
        //alert("__initArray, initialisiere k="+k);
        if(i<numDims-1)
        {
          toInitialize[j][k] = new Array();
          nextToInitialize[nextToInitialize.length] = toInitialize[j][k];
        }
        else
        {
          if(bIsUserTypeArray)
          	initValue = initValue.__createNew();
          toInitialize[j][k] = initValue;
        }
      }
    }

    toInitialize = nextToInitialize;
  }

  //alert("resultArray's content: "+getArrayString(resultArray));
  // alert("2. toInitialize[0] has length " + toInitialize[0].length);

  __registerArrayInfo(resultArray, arrayInfo);

  return resultArray;
}


function __redimArray(arr, newArrInfo, initValue, bPreserve)
{
  var arrInfo = __getArrayInfo(arr);
  if(arrInfo==null)
    arrInfo = newArrInfo;
  else
    arrInfo.reDimension(newArrInfo);
  
  var newArr = __initArray(newArrInfo, initValue);
  if(bPreserve)
    __copyArrayRec(arr, newArr, newArrInfo, 1);
  return newArr;
}


function __copyArrayRec(arr, newArr, newArrInfo, dim)
{
  if(typeof(arr)=="object" && arr.constructor.toString().indexOf("__isHolder")!=-1)
    arr = arr.value;

  var dimInfo = newArrInfo.dimensions[dim-1];
  var newArrLen = dimInfo.upperBound - dimInfo.lowerBound + 1;
  
  for(var i=0;i<arr.length&&i<newArrLen;i++)
  {
    newArr[i] = arr[i];
    if(dim<newArrInfo.dimensions.length)
      __copyArrayRec(arr[i], newArr[i], newArrInfo, dim+1);
  }
}


function getArrayString(arr)
{
  var str = "";

  for(var i=0;i<arr.length;i++)
  {
    str += "["+i+"]: "+arr[i]+"  ";
  }
  return str;
}



/**
 * Konstruktor fuer Array-Info-Objekte
 * @return
 */
__ArrayInfo = function ()
{
  //alert("__ArrayInfo: "+arguments.length+" arguments");
  this.dimensions = new Array();
  var dimCounter = 0;
  for(var i=0;i<arguments.length;i+=2)
  {
    this.dimensions[dimCounter++] = new __ArrayInfo_DimInfo(arguments[i],arguments[i+1]);
  }

  //alert("created __ArrayInfo with "+this.dimensions.length+ " dimensions");

}


/**
 * Zugriff auf Dimension in Array-Info-Objekt
 */
__ArrayInfo.prototype.getDimension = function(idx)
{
  //alert("getDimension("+idx+")");
  return this.dimensions[idx-1];
}


/**
 * Array-Info-Objekt redimensionieren
 */
__ArrayInfo.prototype.reDimension = function(arrInfo)
{
  this.dimensions = arrInfo.dimensions;
}


/**
 * Liefert gemappten Index der angegebenen Dimension
 * @return
 */
__ArrayInfo.prototype.getArrayIndex = function(dim, idx)
{
  var mappedIndex = 0;
  var dimInfo = this.getDimension(dim);
  return idx - dimInfo.lowerBound;
}


/**
 * Liefert untere Grenze der angegebenen Dimension
 * @return
 */
__ArrayInfo.prototype.getLowerBound = function(dim)
{
  var mappedIndex = 0;
  var dimInfo = this.getDimension(dim);
  return dimInfo.lowerBound;
}


/**
 * Liefert obere Grenze der angegebenen Dimension
 * @return
 */
__ArrayInfo.prototype.getUpperBound = function(dim)
{
  var mappedIndex = 0;
  var dimInfo = this.getDimension(dim);
  return dimInfo.upperBound;
}


/**
 * Konstruktor fuer Array-Info-Dimensions-Info-Objekte
 * @return
 */
__ArrayInfo_DimInfo = function (l, u)
{
  this.lowerBound = l;
  this.upperBound = u;
}


function cleanarray(arrHolder) {
  arrHolder.value = new Array();
	unregisterArrayInfo(arrHolder.value);
}


__EndScriptException = function()
{
  this.name = "__EndScriptException";
}


/**
* JS-Implementierung fuer VB-Trim-Funktion
* @param string String der getrimmt werden soll
* @return getrimmter String
*/
function vbTrim(string)
{
  if(string==null)
    return null;

  if (typeof string != "string")
    return string;

  var res = string;
  var ch = res.substring(0, 1);

  while (ch == " ")
  {
    res = res.substring(1, res.length);
    ch = res.substring(0, 1);
  }

  ch = res.substring(res.length-1, res.length);
  while (ch == " ")
  {
     res = res.substring(0, res.length-1);
     ch = res.substring(res.length-1, res.length);
  }
  while (res.indexOf("  ") != -1)
     res = res.substring(0, res.indexOf("  ")) + res.substring(res.indexOf("  ")+1, res.length);

  return res;
}


/**
* JS-Implementierung fuer VB-LTrim-Funktion
* @param string String der links-getrimmt werden soll
* @return getrimmter String
*/
function vbLTrim(string)
{
  if(string==null)
    return null;

  if (typeof string != "string")
    return string;

  while(""+string.charAt(0)==" "&&string.length>0)
    string=string.substring(1,string.length);

  return string;
}


/**
* JS-Implementierung fuer VB-RTrim-Funktion
* @param string String der rechts-getrimmt werden soll
* @return getrimmter String
*/
function vbRTrim(string)
{
  if(string==null)
    return null;

  if (typeof string != "string")
    return string;

  while(""+string.charAt(string.length-1)==" "&&string.length>0)
    string=string.substring(0,string.length-1);

  return string;
}


/**
* JS-Implementierung fuer VB-StrReverse-Funktion
* @param string String der umgekehrt werden soll
* @return umgekehrter String
*/
function vbStrReverse(string)
{
  if(string==null)
    return null;

  if (typeof string != "string")
    return string;

  var reversed = "";
  var arr;
  arr = string.split("");

  for(var i = string.length -1 ; i >= 0 ; i--)
    reversed += arr[i];

  return reversed;
}


function vbStrConv(stringOrArray, convMod)
{
  switch(convMod)
  {
    case vbUpperCase: return vbToUpperCase(stringOrArray);
    case vbLowerCase: return vbToLowerCase(stringOrArray);

    case vbProperCase:
    case vbWide:
    case vbNarrow:
    case vbKatakana:
    case vbHiragana:
    case vbUnicode:
    case vbFromUnicode:
      throw "unsupported conversion mode "+convMode+" in function vbStrConv";
    default:
      throw "illegal conversion mode "+convMode+" in function vbStrConv";
  }
}


/**
* JS-Implementierungf fuer VB-UCase-Funktion
* @param string String, der in Grossbuchstaben umgewandelt werden soll
* @return umgewandelter String
*/
function vbToUpperCase(string)
{
  if(string==null)
    return null;

  if (typeof string != "string")
    return string;

  return string.toUpperCase();
}


/**
* JS-Implementierungf fuer VB-LCase-Funktion
* @param string String, der in Kleinbuchstaben umgewandelt werden soll
* @return umgewandelter String
*/
function vbToLowerCase(string)
{
  if(string==null)
    return null;

  string = "" + string;

  if (typeof string != "string")
    return string;

  return string.toLowerCase();
}


function vbReplace()
{
  if(arguments.length<3)
    throw "argument error: vbReplace expects at least 3 arguments";

  var string      = arguments[0];
  string = "" + string;
  var pattern     = arguments[1];
  var replacement = arguments[2];
  var startIndex  = 0;
  var count       = -1;

  if(arguments.length==4||arguments.length==5)
  {
    if(typeof(arguments[3]) != "__ommittedOptionalParam")
      startIndex = (0+arguments[3] - 1);
    if(arguments.length==5)
    {
      if(typeof(arguments[4]) != "__ommittedOptionalParam")
        count = 0+arguments[4];
    }
  }
  else if(arguments.length>5)
    throw "argument error: vbReplace expects at most 5 arguments";

  if(string==null)
    return null;

  if(typeof(string) != "string")
    return string;

  // TANR 242052
  if(typeof(pattern) != "string"){return string;}
  else if(pattern==""){return string;}

  var result = string.substr(0,startIndex);
  var tail   = string.substr(startIndex);
  var numReplacements = 0;

  //alert("string length is "+string.length + ",  pos 5 is '"+string.charAt(5)+"'");

  for(;;)
  {
    if(numReplacements++ == count)
      break;

    var idx = tail.indexOf(pattern);
    if(idx==-1)
    {
      //alert("pattern '"+pattern+"' not found in round #"+numReplacements);
      break;
    }
    else
    {
      //alert("pattern '"+pattern+"' found starting at pos "+idx);
    }

    //alert("idx is "+idx+", pattern length is "+pattern.length);

    var newTail = tail.substr(idx+pattern.length);
    //alert("newTail is '"+newTail+"' ("+newTail.length+" chars)");
    var head = "";
    if(idx>0)
      head = tail.substr(0,idx);

    //alert("result= '" + result + "' ("+result.length+" chars) + '" + head + "' ("+head.length+" chars) + '"+ replacement + "' ("+replacement.length+" chars)");

    result = result + head + replacement;

    tail = newTail;
  }

  var r = result + tail;

  //alert("returning '"+result +"' ("+result.length+" chars) + '"+ tail+"' ("+tail.length+" chars) = '"+r+"' ("+r.length+" chars)" );

  return r;
}


function vbAsc(string)
{
  if(string==null)
    return null;

  string = "" + string;

  if(typeof(string) != "string")
    return string;

  if(string.length==0)
    return 0;

  return string.charCodeAt(0);
}


function vbAscB(string)
{
  if(string==null)
    return null;

  string = "" + string;

  if(typeof(string) != "string")
    return string;

  if(string.length==0)
    return 0;

  return string.charCodeAt(0);
}



function vbAscW(string)
{
  if(string==null)
    return null;

  string = "" + string;

  if(typeof(string) != "string")
    return string;

  if(string.length==0)
    return 0;

  return string.charCodeAt(0);
}


function vbChr(c)
{
  if(c==null)
    return null;

  if(typeof(c) != "number")
    return c;

  return String.fromCharCode(c);
}


function vbChrB(c)
{
  if(c==null)
    return null;

  if(typeof(c) != "number")
    return c;

  return String.fromCharCode(c);
}


function vbChrW(c)
{
  if(c==null)
    return null;

  if(typeof(c) != "number")
    return c;

  return String.fromCharCode(c);
}


function vbInStr()
{
  var startIdx = 1;
  var string = "";
  var pattern = "";

  if(arguments.length==2)
  {
    string = arguments[0];
    pattern = arguments[1];
  }
  else if(arguments.length==3)
  {
    startIdx = arguments[0];
    string = arguments[1];
    pattern = arguments[2];
  }
  else
    throw "argument error: vbInStr expects 2 or 3 arguments";

  string = "" + string;

  return string.indexOf(pattern, startIdx-1)+1;
}


function vbInStrB()
{
  if(arguments.length==2)
    return vbInStr(arguments[0],arguments[1]);
  else if(arguments.length==3)
    return vbInStr(arguments[0],arguments[1],arguments[2]);
  else
    throw "argument error: vbInStrB expects 2 or 3 arguments";
}


function vbInStrRev()
{
  var string = "";
  var pattern = "";
  var startIdx = 1;

  if(arguments.length==2)
  {
    string = arguments[0];
    pattern = arguments[1];
  }
  else if(arguments.length==3)
  {
    string = arguments[0];
    pattern = arguments[1];
    startIdx = arguments[2];
  }
  else
    throw "argument error: vbInStrRev expects 2 or 3 arguments";

  string = "" + string;

  string = string.substr(startIdx-1);
  return string.lastIndexOf(pattern)+startIdx;
}

function vbLeft(string, len)
{
  if(string==null)
    return null;

  if(typeof(string) == "object")
	  string = ""+string.toString();

  string = "" + string;

  if(typeof(string) != "string")
    return "";

  if (len <= 0)
    return "";

  if (len > string.length)
    return string;

  return string.substring(0, len);
}


function vbLeftB(string, len)
{
  return vbLeft(string, Math.floor(len/2));
}


function vbRight(string, len)
{
  if(string==null)
    return null;

  if(typeof(string) == "object")
	  string = ""+string.toString();

  string = "" + string;

  if(typeof(string) != "string")
    return "";

  if (len <= 0)
    return "";

  if (len > string.length)
    return string;

  return string.substring(string.length-len);
}

function vbRightB(string, len)
{
  return vbRight(string, Math.floor(len/2));
}


function vbMid()
{
  var string  = "";
  var index   = 0;
  var len     = 0;

  if(arguments.length==2)
  {
    string = arguments[0];
    index  = arguments[1];
    len = string.length;
  }
  else if(arguments.length==3)
  {
    string = arguments[0];
    index  = arguments[1];
    len    = arguments[2];
  }
  else
    throw "argument error: vbMid expects 2 or 3 arguments";


  if(string==null)
    return null;

  if(typeof(string) == "object")
	  string = ""+string.toString();
	  
  string = "" + string;

  if(typeof(string) != "string")
    return "";

  return string.substr(index-1,len);
}


function vbMidB()
{
  if(arguments.length==2)
    return vbMid(arguments[0], Math.floor(arguments[1]/2));
  else if(arguments.length==3)
    return vbMid(arguments[0], Math.floor(arguments[1]/2), Math.floor(arguments[2]/2));
  else
    throw "argument error: vbMidB expects 2 or 3 arguments";
}


/**
* Liefert Dezimal-Darstellung als String
* @param num Zahl
* @return String
*/
function vbStr(num)
{
  return ""+num;
}


/**
* Liefert Hexadezimal-Darstellung als String
* @param num Zahl
* @return String
*/
function vbHex(num)
{
  return num.toString(16).toUpperCase();
}



/**
* Liefert Oktal-Darstellung als String
* @param num Zahl
* @return String
*/
function vbOct(num)
{
  return num.toString(8);
}



/**
* Liefert Laenge des Strings
* @param string String
* @return Laenge
*/
function vbLen(string)
{
  if(string==null)
    return null;

  if(typeof(string) == "object")
	  string = ""+string.toString();

  string = "" + string;

  if(typeof(string) != "string")
    return 0;

  return string.length;
}

/**
* Liefert Byte-Laenge des Strings
* @param string String
* @return Laenge
*/
function vbLenB(string)
{
  if(string==null)
    return null;

  if(typeof(string) == "object")
	  string = ""+string.toString();

  string = "" + string;

  if(typeof(string) != "string")
    return 0;

  return 2*string.length;
}


/**
*  Liefert String mit Leerzeichen
* @param num Anzahl Leerzeichen
* @return String
*/
function vbSpace(num)
{
  if(num==null)
    return null;

  if(typeof(num) != "number")
    return "";

  var string = "";

  for(var i=0;i<num;i++)
    string = string + " ";

  return string;
}


/**
*  Liefert String mit Zeichen aus dem Muster
* @param num Anzahl Leerzeichen
* @param pat Muster, erstes Zeichen wird verwandt
* @return String
*/
function vbString(num, pat)
{
  if(num==null)
    return null;

  if(pat==null)
    return null;

  if(typeof(num) != "number")
    return "";

  if(typeof(pat) != "string")
    return "";

  if(pat.length==0)
    return "";

  var ch = pat.charAt(0);

  var string = "";

  for(var i=0;i<num;i++)
    string = string + ch;

  return string;
}


/**
* Fuert Stringvergleich durch (2-3 Parameter)
* @param lhs 1. String
* @param rhs 2. String
* @param compMod [OPTIONAL] Vergleichsmodus, 0=binaer,1=lexikographisch
* @return
*/
function vbStrComp()
{
  var lhs = "";
  var rhs = "";
  var compMode = 0;

  if(arguments.length==2)
  {
    lhs = ""+arguments[0];
    rhs = ""+arguments[1];
  }
  else if(arguments.length==3)
  {
    lhs      = ""+arguments[0];
    rhs      = ""+arguments[1];
    compMode = 0+arguments[2];
  }

  if(lhs==null||rhs==null||compMode==null)
    return null;

  lhs = "" + lhs;
  rhs = "" + rhs;

  if(typeof(lhs) == "object")
	  lhs = lhs.toString();

  if(typeof(rhs) == "object")
	  rhs = rhs.toString();

  if( (typeof(lhs) != "string") || (typeof(rhs) != "string")|| (typeof(compMode)!="number"))
    return 0;

  if(compMode==0)
  {
    var tmp_lhs = new java.lang.String(lhs);
    var res = tmp_lhs.compareTo(new java.lang.String(rhs));
    return (res < 0) ? -1 : ((res > 0) ? 1 : 0);      
  }
  else if(compMode==1)
  {
    var tmp_lhs = new java.lang.String(lhs);
    var res = tmp_lhs.compareToIgnoreCase(new java.lang.String(rhs));
    return (res < 0) ? -1 : ((res > 0) ? 1 : 0);
  }
  else throw "argument error: vbStrComp expects compMode 0 or 1";
}


var __remove_blank_pattern = java.util.regex.Pattern.compile("\\s");

/**
* Entfernt Leerzeichen aus dem String
*
*/
function __removeblanks(str) {
    var m = __remove_blank_pattern.matcher(new java.lang.String(str));
    return "" + m.replaceAll('');
}

/**
* Rundung auf naechstniedrige Ganzzahl, naechsthoehere bei negativen Werten
* @param val Wert, der gerundet wird
* @return Ergebnis der Rundung
*/
function vbFix(val)
{
  if(val==null)
    return null;

  var numVal = 0+val;

  if(numVal<0)
    numVal++;

  return Math.floor(numVal);
}

/**
* Rundung auf Dezimalstellen
* @param val Wert, der gerundet wird
* @param places [OPTIONAL] Anzahl Dezimalstellen
* @return Ergebnis der Rundung
*/
function vbRound()
{
  var val    = 0;
  var places = 0;
  if(arguments.length==1)
  {
    val = arguments[0];
  }
  else if(arguments.length==2)
  {
    val    = arguments[0];
    places = arguments[1];
  }
  else
    throw "argument error: vbRound expects 1 or 2 arguments";

  if(val==null)
    return null;

  if(places==null)
    places = 0;

  var numVal    = val;
  var numPlaces = places == 0 ? -1 : places;

  var s = val.toString();
  var idxDot = s.lastIndexOf(".");
  if(idxDot==-1) {
    return val;
  }
  var rem = s.substr(idxDot+numPlaces+1, s.length);
  if(rem.length==0) {
    return val;
  }
  
  var bBreakAtDot = false;
  
  var n = rem.charAt(0);
  if(n==".") {
    n = rem.charAt(1);
    bBreakAtDot = true;
  }
  var nextDigit = __toLong(n);
  var nAddVal = val < 0 ? -1 : 1;
  if(nextDigit<5) {
    return __toLong(s.substr(0,idxDot+places));
  } else {
    if(bBreakAtDot) {
      return parseFloat( s.substr(0,idxDot+places-1) + (__toLong(s.charAt(idxDot+places-1))+nAddVal).toString());
    } else {
      return parseFloat( s.substr(0,idxDot+places) + (__toLong(s.charAt(idxDot+places))+nAddVal).toString());
    }
  }
}


/**
* Vorzeichen-Ermittlung
* @param num Zahl, deren Vorzeichen zu ermitteln ist
* @return 1 bei positiver Zahl, -1 bei negativer Zahl, 0 bei 0
*/
function vbSgn(num)
{
  if(num==null)
    return null;
  if(typeof(num) != "number")
    return 0;
  if(num<0)
    return -1;
  else if(num==0)
    return 0;
  return 1;
}


/**
* Pseudo-Zufallszahlen ermitteln
* @param num [OPTIONAL]
* @return Pseudo-Zufallszahl
*/
function vbRnd()
{
  var num;
  if(arguments.length==0)
    num = 1;
  else if(arguments.length==1)
    num = arguments[0];
  else
    throw "argument error: vbRnd expects 0 or 1 arguments";

  if(num<0)
    _randSeed = num;
  else if(num==0)
    return __lastRandomNumber;

  return __generateRandomNumber();
}


function vbRandomize()
{
  var seed;
  if(arguments.length==0)
    seed = (new Date()).getTime();
  else if(arguments.length==1)
    seed = arguments[0];
  else
    throw "argument error: vbRandomize expects 0 or 1 arguments";
  __initRandomizer(seed);
}

var __lastRandomNumber;
var __randSeed = (new Date()).getTime();
var __randR    = Math.pow(2, 32);
var __randArr  = new Array(10);
var __randIdx  = 1;

function __initRandomizer(seed)
{
  __randSeed = seed;
  __randIdx  = 1;

}

function __generateRandomNumber()
{
  if(__randIdx==10)
    __randIdx = 1;

  __randArr[__randIdx] = StrT(__SeedRand(), 1, 3);
  __lastRandomNumber = __randArr[__randIdx++];

  return __lastRandomNumber;
}


function __SeedRand()
{
  return (__randSeed = (134775813 * __randSeed + 1) % __randR) / __randR;
}


function Prfx(Q, L, c)
{
  var s = Q+"" // ??
  if (c.length>0) while (s.length<L) { s = c+s } ;
  return s;
}


function StrU(X, M, N)
{
  var T, S=new String(Math.round(X*Number("1e"+N)))
  if (/\D/.test(S)) { return ''+X } // cannot cope
  with (new String(Prfx(S, M+N, '0')))
    return substring(0, T=(length-N)) + '.' + substring(T)
}


function StrT(X, M, N)
{
  return Prfx(StrU(X, 1, N), M+N+2, ' ')
}


function vbFormat(value, strFormat)
{
  var decFormat = new java.text.DecimalFormat(""+strFormat);
  return decFormat.format(value);
}


function vbRgb(rVal, gVal, bVal)
{
  var s = __rgb(rVal, gVal, bVal);
  if(s==null)
  return 0;
  return parseInt(s,16);
}

function __rgb(rVal, gVal, bVal)
{
  if(rVal==null || gVal==null || bVal==null)
    return null;

  if(typeof(rVal)!="number" || typeof(gVal)!="number" || typeof(bVal)!="number")
    return "000000";
  var sR = String(vbHex(rVal));
  if(sR.length==1)
    sR = "0" + sR;
  else if(sR.length!=2)
    return "000000";

  var sG = String(vbHex(gVal));
  if(sG.length==1)
    sG = "0" + sG;
  else if(sG.length!=2)
    return "000000";

  var sB = String(vbHex(bVal));
  if(sB.length==1)
    sB = "0" + sB;
  else if(sB.length!=2)
    return "000000";

  return sR + sG + sB;
}


function vbIIf(bExpr, expr1, expr2)
{
  if(bExpr)
    return expr1;
  return expr2;
}


function __choose()
{
  if(arguments.length<=1)
    throw "argument error: __choose expects at least 2 arguments";

  var idx = arguments[0];
  if(idx==null)
    return null;

  if(typeof(idx)!="number")
    idx = 0;

  if(idx<=0 || idx>=arguments.length)
    throw "argument error: index "+idx+"in __choose unsupported";

  return arguments[idx];
}


function __qbColor(num)
{
  if(num==null)
    return null;

  if(typeof(num)!="number")
    num = 0;

  switch(num)
  {
    case 0:     // black
      return "000000";

    case 1:     // blue
      return "0000FF";

    case 2:     // green
      return "00FF00";

    case 3:     // cyan
      return "00FFFF";

    case 4:     // red
      return "FF0000";

    case 5:     // magenta
      return "FF00FF";

    case 6:     // yellow
      return "FFFF00";

    case 7:     // white
      return "C0C0C0";

    case 8:     // gray
      return "808080";

    case 9:     // light blue
      return "000080";

    case 10:    // light green
      return "008000";

    case 11: 	// light cyan
      return "008080";

    case 12: 	// light red
      return "800000";

    case 13:	// light magenta
      return "800080";

    case 14: 	// light yellow
      return "808000";

    case 15:    // bright white
      return "FFFFFF";

    default:
      return "000000";
  }
}


//////////////////
//
// Umwandlungs-Funktionen
//

function vbIsNumeric(val)
{
  if(val==null)
    return false;
  var str = ""+val;
  str = str.replace(/^\s*|\s*$/g,"");
  if(str.length==0) 
    return false;
  return ! isNaN(str);
}

function vbIsArray(val)
{
    if(val==null)
        return false;
    if(val.constructor == undefined)
        return false;
  
  return (val.constructor.toString().indexOf("Array") != -1)
}

function vbIsEmpty(val)
{
  if(val==null)
    return false;
  return typeof(val)=="undefined";
}

function vbIsDate(val)
{
  if(val==null)
    return false;
  return (val.constructor.toString().indexOf("Date") != -1)
}

function vbIsNull(val)
{
  return (typeof(val)!="undefined" && val==null);
}

function vbIsNothing(val)
{
  return (typeof(val)=="object" && val==null);
}

function vbIsObject(val)
{
  return (typeof(val)=="object");
}

//
//////////////////


function __sort()
{
  if(arguments.length<3||arguments.length>5)
    throw "argument error: __sort expects at 3 to 5 arguments";

  var arr = arguments[0];
  
  if(typeof(arr)=="object" && arr.constructor.toString().indexOf("__isHolder")!=-1)
    arr = arr.value;
  
  if(arr==null||!vbIsArray(arr)||arr.length==0)
    return arr;
  if(arguments.length==3)
    return ArisData.sort(arr,arguments[1],arguments[2]);
  else if(arguments.length==4)
    return ArisData.sort(arr,arguments[1],arguments[2],arguments[3]);
  else if(arguments.length==5)
    return ArisData.sort(arr,arguments[1],arguments[2],arguments[3],arguments[4]);
  else
    return arr;
}


function __delete(arr, obj)
{
  if(typeof(arr)=="object" && arr.constructor.toString().indexOf("__isHolder")!=-1)
    arr = arr.value;
    
  if(arr==null||!vbIsArray(arr)||arr.length==0)
    return arr;

  if(!isNaN(obj)) {
    /*
    tmp = new Array();
    var j;
    for(j=0;j<obj;j++)
      tmp[tmp.length] = arr[j];
    for(j=obj+1;j<arr.length;j++)
      tmp[tmp.length] = arr[j];
    return tmp;
    */
    for(j=obj+1;j<arr.length;j++) {
      arr[j-1] = arr[j];
    }
    arr.length = arr.length - 1;
  
  } else {
//    var tmp = null;
    for(var i=0;i<arr.length;i++) {
      if(arr[i]==obj) {
        /*
        tmp = new Array();
        var j;
        for(j=0;j<i;j++)
          tmp[tmp.length] = arr[j];
        for(j=i+1;j<arr.length;j++)
          tmp[tmp.length] = arr[j];
        return tmp;
        */
        for(j=i+1;j<arr.length;j++) {
          arr[j-1] = arr[j];
        }
        arr.length = arr.length - 1;
        break;
      }
    }
  }
  return arr;
}


function __clearArray(arr) 
{
  if(typeof(arr)=="object" && arr.constructor.toString().indexOf("__isHolder")!=-1) {
    arr.value = new Array();
  }
}


//all elements in this array are made unique,
//if arr contains arrays itself, __unique is applied to all contained arrays (and not to arr)
function __unique(arr)
{
    if( arr==undefined )
        return arr;
    if(typeof(arr)=="object" && arr.constructor.toString().indexOf("__isHolder")!=-1)
        arr = arr.value;
    
    if(arr==null||!vbIsArray(arr)||arr.length==0)
        return arr;
  
    //test, if this is an array of arrays -> make all contained arrays unique instead of "arr"
    if( vbIsArray(arr[0]) )
    {
        for(var i=0; i<arr.length; i++)
        {
            arr[i] = __unique(arr[i]); // handle arrays at any depth
        }
        return arr;
    }
    return ArisData.Unique(arr);
}


function __inCaseRange(val, lower, upper)
{
  return (val>=lower) && (val <=upper);
}


function __arrayAdd(arr, val)
{
  if(typeof(arr)=="object" && arr.constructor.toString().indexOf("__isHolder")!=-1)
    arr = arr.value;
    
  if(arr==null||!vbIsArray(arr))
    return;
    
  arr[arr.length] = val;
}

function __arrayAddIndex(arr, val, idx)
{
  if(typeof(arr)=="object" && arr.constructor.toString().indexOf("__isHolder")!=-1)
    arr = arr.value;
    
  if(arr==null||!vbIsArray(arr))
    return;
    
  arr[idx] = val;
}


function __shortcuts(obj, kindNum) {
  var shortcuts = obj.ShortCuts(kindNum);
  var mappedShortcuts = new Array();
  for( var i = 0; i<shortcuts.length;i++) {
  	if(kindNum == Constants.SEARCH_MODEL) {
      mappedShortcuts[i] = shortcuts[i].getTargetModel();
    }
    else if(kindNum == Constants.SEARCH_OBJDEF) {
      mappedShortcuts[i] = shortcuts[i].getTargetObject();
    }
  }
  return mappedShortcuts;
}


//////////////////////////////
//
// Implementierung Dateioperationen
//
//

var __fileStreamInfoMap = new java.util.HashMap();

__fileStreamInfo = function (fileName, fileMode, accessMode, lockMode, recordLength, streamNum, stream)
{
  this.fileName     = fileName;
  this.fileMode     = fileMode;
  this.accessMode   = accessMode;
  this.lockMode     = lockMode;
  this.recordLength = recordLength;
  this.streamNum    = streamNum;
  this.stream       = stream;
}

var __fileMode_Input  = 1;
var __fileMode_Output = 2;
var __fileMode_Append = 3;
var __fileMode_Binary = 4;
var __fileMode_Random = 5;

var __fileAccessMode_Read      = 1;
var __fileAccessMode_Write     = 2;
var __fileAccessMode_ReadWrite = 3;

function __closeOpenFiles()
{
  var it = __fileStreamInfoMap.values().iterator();
  while(it.hasNext())
  {
    var fileStreamInfoMap = it.next();
    var stream = fileStreamInfo.stream;
    stream.close();
  }
}


function __closeFile(streamNum)
{
  var oldStreamInfo = __fileStreamInfoMap.get(streamNum);
  if(oldStreamInfo==null)
    throw "file with stream #"+streamNum+" isn't open";

  var stream = oldStreamInfo.stream;
  stream.close();

  __fileStreamInfoMap.remove(oldStreamInfo);
}


/**
* Oeffnet Datei
* @param fileName Dateiname
* @param mode Zugriffsmodus
* @param accessMode Zugriffsmodus
* @param lockMode Sperrmodus
* @param recordLength Satzlaenge
* @param streamNum Stream-Nummer
*/

function __openFile(fileName, mode, accessMode, lockMode, recordLength, streamNum)
{
  var stream;

  var oldStreamInfo = __fileStreamInfoMap.get(streamNum);
  if(oldStreamInfo!=null)
  {
    stream = oldStreamInfo.stream;
    stream.close();
  }

  stream = null;

  switch(mode)
  {
    case __fileMode_Input:
      stream = new java.io.FileReader(fileName);
      break;

    case __fileMode_Output:
      stream = new java.io.FileWriter(fileName, false);
      break;

    case __fileMode_Append:
      stream = new java.io.FileWriter(fileName, true);
      break;

    case __fileMode_Binary:
    {
      switch(accessMode)
      {
        case __fileAccessMode_Read:
          stream = new java.io.FileInputStream(fileName);
        break;

        case __fileAccessMode_Write:
          stream = new java.io.FileOutputStream(fileName, false);
        break;

        case __fileAccessMode_ReadWrite:
          stream = new java.io.FileOutputStream(fileName, true);
        break;

        default:
          throw "INTERNAL ERROR (ILLEGAL ACCESS MODE "+accessMode+")";
      }
    }
    break;

    case __fileModeRandom:
      break;

    default:
      throw "INTERNAL ERROR (ILLEGAL MODE "+mode+")";
  }

  var fileStreamInfo = new __fileStreamInfo(fileName, mode, accessMode, lockMode, recordLength, streamNum, stream);

  __fileStreamInfoMap.put(streamNum, fileStreamInfo);
}


function __printToFile()
{
  if(arguments.length<2)
    throw "argument error: __printToFile expects at least 2 arguments";

  var streamNum = arguments[0];

  var streamInfo = __fileStreamInfoMap.get(streamNum);
  if(streamInfo==null)
    throw "file error: file stream #" + streamNum + " wasn't found";

  var stream = streamInfo.stream;

  for(var i=1;i<arguments.length;i++)
  {
    stream.write(__toString(arguments[i]));
  }
}


function __convertForWrite(val)
{
  if(val==null)
    return "#NULL#";

  if(typeof(val)=="string")
    return "\""+val+"\"";

  if(typeof(val)=="boolean")
  {
    if(val==true)
      return "#TRUE#";
    return "#FALSE#";
  }

  if(val.constructor.toString().indexOf("Date") != -1)
    return "#date "+val.toString()+"#";

  return val.toString();
}


function __writeToFile()
{
  if(arguments.length<2)
    throw "argument error: __writeToFile expects at least 2 arguments";

  var streamNum = arguments[0];

  var streamInfo = __fileStreamInfoMap.get(streamNum);
  if(streamInfo==null)
    throw "file error: file stream #" + streamNum + " wasn't found";

  var stream = streamInfo.stream;

  for(var i=1;i<arguments.length;i++)
  {
    stream.write(__convertForWrite(arguments[i])+" ");
  }
}

function __inputFromFile()
{
  if(arguments.length<2)
    throw "argument error: __writeToFile expects at least 2 arguments";

  var streamNum = arguments[0];

  var streamInfo = __fileStreamInfoMap.get(streamNum);
  if(streamInfo==null)
    throw "file error: file stream #" + streamNum + " wasn't found";

  var stream = streamInfo.stream;

  for(var i=1;i<arguments.length;i++)
  {
    __inputItemFromStream(stream, arguments[i]);
  }
}


function __lineInputFromFile(streamNum)
{
  var streamNum = arguments[0];

  var streamInfo = __fileStreamInfoMap.get(streamNum);
  if(streamInfo==null)
    throw "file error: file stream #" + streamNum + " wasn't found";

  var stream = streamInfo.stream;

  var line = "";
  var input = new __holder("");
  var numRead = 1;
  while(input.value!="\n" && numRead==1)
  {
    numRead = __readSingleCharFromStream(stream, input);
    if(input.value!="\n" && numRead==1)
      line = line + input.value;
  }
  return line;
}

function __eof(streamNum)
{
  var streamInfo = __fileStreamInfoMap.get(streamNum);
  if(streamInfo==null)
    throw "file error: file stream #" + streamNum + " wasn't found";

  var stream = streamInfo.stream;
  return stream.ready();
}

function __fileAttr(streamNum, code)
{
  var streamInfo = __fileStreamInfoMap.get(streamNum);
  if(streamInfo==null)
    throw "file error: file stream #" + streamNum + " wasn't found";

  switch(code)
  {
    case 1:
    {
      switch(streamInfo.fileMode)
      {
        case __fileMode_Input:  return 1;
        case __fileMode_Output: return 2;
        case __fileMode_Random: return 4;
        case __fileMode_Append: return 8;
        case __fileMode_Binary: return 32;
        default:
          throw "file error: illegal file mode #"+streamInfo.fileMode;
      }
    }
    break;

    case 2:
      return streamNum;
  }
  return 0;
}


function __fileCopy(srcName, trgName)
{
    var source = new java.io.File(srcName);
    var dest = new java.io.File(trgName);
    
    var FC_in = null;
    var FC_out = null;
    
    try {
        FC_in = new java.io.FileInputStream(source).getChannel();
        FC_out = new java.io.FileOutputStream(dest).getChannel();

        var buf = FC_in.map(java.nio.channels.FileChannel.MapMode.READ_ONLY, 0, FC_in.size());

        FC_out.write(buf);
    } catch(e) {
        
    } finally {
        if (FC_in != null)  FC_in.close();
        if (FC_out != null) FC_out.close();
    }
}


function __fileDateTime(fileName)
{
  var file = new java.io.File(fileName);
  return new Date(file.lastModified());
}

function __fileLength(fileName)
{
  var file = new java.io.File(fileName);
  return file.length();
}


function __deleteFile(fileName)
{
    Context.deleteFile(fileName);
}


function __createDirectory(fileName)
{
  var file = new java.io.File(fileName);
  file.mkdir();
}

function __renameFile(oldFileName, newFileName)
{
  var file = new java.io.File(oldFileName);
  file.renameTo(new java.io.File(newFileName));
}

function __readSingleCharFromStream(stream, holder)
{
  var cbuff = java.lang.reflect.Array.newInstance(java.lang.Character.TYPE,1);
  var numRead = stream.read(cbuff);
  if(numRead == 1)
  {
    var charVal = (new java.lang.String(cbuff)).toString();
    holder.value = charVal.substr(0,1);
  }
  return numRead;
}

function __inputItemFromStream(stream, holder)
{
  var input = new __holder(" ");
  var numRead = 1;
  while(input.value==" " && numRead==1)
    numRead = __readSingleCharFromStream(stream, input);

  if(input.value=="\"")
  {
    var string = "";
    numRead = 1;
    input.value = "";
    while(input.value != "\"" && numRead==1)
    {
      numRead = __readSingleCharFromStream(stream, input);
      if(input.value != "\"" && numRead==1)
        string = string+input.value;
    }
    holder.value = string;
  }
  else if(input.value == "#")
  {
    var encoded = "";
    numRead = 1;
    input.value = "";
    while(input.value!="#" && numRead == 1)
    {
      numRead = __readSingleCharFromStream(stream, input);
      if(input.value!="#" && numRead==1)
        encoded = encoded+input.value;
    }

    if(encoded=="TRUE")
      holder.value = true;
    else if(encoded=="FALSE")
      holder.value = false;
    else if(encoded.indexOf("date")!=-1)
    {
      var dateString = encoded.substr(5);
      holder.value = dateString;
    }
    else
      throw "INTERNAL ERROR: encoded value";
  }
  else
  {
    var numericString = "";
    numRead = 1;
    while(numericString!=" " && numRead==1)
    {
      numRead = __readSingleCharFromStream(stream, input);
      if(numRead==1)
        numericString = numericString+input.value;
    }
    if(numericString.indexOf(".")==-1)
      holder.value = parseInt(numericString);
    else
      holder.value = parseFloat(numericString);
  }
}


var __dirSearchPattern = null;
var __lastDirSearchIndex = 0;

function vbDir()
{
  if(arguments.length>2)
    throw "argument error: __choose expects at most 2 arguments";

  var pattern = arguments[0];
  if(pattern==null)
    pattern = __dirSearchPattern;
  else
  {
    dirSearchPattern = pattern;
    lastDirSearchIndex = 0;
  }
    
  var attrib = null;
  if(arguments.length==2)
    attrib = arguments[1];
  if(attrib==null)
    attrib = 0;
  
  var file = new java.io.File(pattern);
  var fileNames = file.list();
  if(fileNames!=null)
  {
    if(fileNames.length > __lastDirSearchIndex)
      return fileNames[__lastDirSearchIndex++];
  }
  return "";
}



function vbGetLocaleInfo(pLocaleId)
{
  var languages = ArisData.getActiveDatabase().LanguageList();
  for(var i=0;i<languages.length;i++) {
    if (languages[i].LocaleId() == pLocaleId) {
      return languages[i].Name(Context.getSelectedLanguage()); 
    }
  }
  return "";
}


function __getContext()
{
  return Context;
}

/**
 * Ende der convertertools.js
 */




