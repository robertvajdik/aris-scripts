/**
 * Copyright (C) 2020 Software AG, Darmstadt, Germany and/or Software AG USA Inc., Reston, VA, USA,
 * and/or its subsidiaries and/or its affiliates and/or their licensors.
 *
 * Use, reproduction, transfer, publication or disclosure is prohibited
 * except as specifically provided for in your License Agreement with Software AG.
 *
 * Version: 10.0.12.0.1470486
 */

const COL_SAG_BLUE_1 = getColorByRGB( 31,  57,  86);  // #1f3956
const COL_SAG_BLUE_2 = getColorByRGB(  0, 112, 150);  // #007096
const COL_SAG_BLUE_3 = getColorByRGB(  5, 137, 161);  // #0589a1
const COL_SAG_GREY_1 = getColorByRGB(242, 242, 242);  // #f2f2f2
const COL_SAG_GREY_2 = getColorByRGB(166, 166, 166);  // #a6a6a6
 
function getColorByRGB(R, G, B) {
    return (new java.awt.Color(R/255.0 ,G/255.0, B/255.0, 1)).getRGB() & 0xFFFFFF;
} 

/*************************************************************************************************/
// How to select evaluated models or objects in semantic check profiles (function getElements())
// = true: In this group and all subgroups
// = false: Only in this group
const c_SEMCHECK_RECURSIVE = false;
/*************************************************************************************************/

const IMAGESPACE = 20 //space in mm to keep free below images for possible lines above/below the image

// deprecated - do not use, use java.awt.Point instead
var PublicInterface = JavaImporter(Packages.com.aris.modeling.common.serverremoteapi.cscommon.webreportbase.reportobjects);

// used by converted dialog functions:
var __currentDialog   = null;

// holder concept to emulate call-by-reference:
//usage: var myVar;
//       var myRef = new __holder(myVar)
__holder = function (val)
{
  this.value = val;
  this.__isHolder = true;
}

__holder.prototype.getValue = function()
{
  return this.value;
}

//ArraySortComparator, usage:
//myArray.sort(new ArraySortComparator(Constants.AT_NAME, Constants.SORT_NONE, Constants.SORT_NONE, locale).compare );
ArraySortComparator = function(p_kriterium1, p_kriterium2, p_kriterium3, p_localeID)
{
    lastComparator = ArisData.getComparator(p_kriterium1, p_kriterium2, p_kriterium3, p_localeID);
    return this;
}
var lastComparator;
ArraySortComparator.prototype.compare = function(arisElementA, arisElementB)
{
  return lastComparator.compare(arisElementA, arisElementB);
}

// our version of the Date object used for "time" only, with overloaded toString():
__time = function()
{
  this.d = new Date();
}

__time.prototype.toString = function()
{
  var h = this.d.getHours();
  if(h<10) h = "0"+h;
  var m = this.d.getMinutes();
  if(m<10) m = "0"+m;
  var s = this.d.getSeconds();
  if(s<10) s = "0"+s;
  return h+":"+m+":"+s;
}

// our version of the Date object, with overloaded toString():
__date = function()
{
  this.d = new Date();
}

__date.prototype.toString = function()
{
  return this.d.getDate()+"."+(this.d.getMonth()+1)+"."+(this.d.getYear()/*+1900*/);
}


//
// ----------------------------------------------------------------------------
// Compare two strings. 
// Result:
//  -1  Str1 is less than Str2. 
//   0  Str1 is equal to Str2. 
//   1  Str1 is greater than Str2. 
// ----------------------------------------------------------------------------
function StrComp(Str1, Str2) {
    var tmp_Str1 = new java.lang.String(Str1);
    var res = tmp_Str1.compareTo(new java.lang.String(Str2));
    return (res < 0) ? -1 : ((res > 0) ? 1 : 0);      
}

// 
// ----------------------------------------------------------------------------
// Subroutine GraphicDialogs
// This sub is used for the dialogs of the settings for the graphic output.
// Parameter
// g_oOutFile = The global output object.
// bCheckUserDialog = 'Variable for checking which entries the user made in the user dialog.
// ----------------------------------------------------------------------------

function tPaperFormatType(sName, nWidth, nHeight) {
    this.sName = sName;
    this.nWidth = nWidth;
    this.nHeight = nHeight;
    return this;
} 

var g_tPaperFormat = new Array();   // Array of 'tPaperFormatType'
var g_sPaperFormat = new Array();   // String-Array

function graphicdialogs(g_ooutfile, bcheckuserdialog)
{
  var binput = false;   // Variable for checking whether the input is a number.
  var nuserdlg1 = 0;   // Variable for the first user dialog.
  var nuserdlg3 = 0;   // Variable for the third user dialog.

  var bmodelcolor = new __holder(false); 
  var nscaleoption = new __holder(0); 
  var bcutofthegraphic = new __holder(false); 
  var ntop = new __holder(0); 
  var nbottom = new __holder(0); 
  var nleft = new __holder(0); 
  var nright = new __holder(0); 
  var nwidth = new __holder(0); 
  var nheight = new __holder(0); 
  var nscalevalue = new __holder(0); 

  // Default settings
  binput = false;
  // Check format
  switch(Context.getSelectedFormat()) {
    case Constants.OUTTABLE:
    case Constants.OutputXLS:
    case Constants.OutputXLSX:
    case Constants.OUTTEXT:
      changeexgraph(g_ooutfile, bcheckuserdialog);
    break;
  }

  if (bcheckuserdialog.value) {
    inputfromregistry(bmodelcolor, nscaleoption, bcutofthegraphic, ntop, nbottom, nleft, nright, nwidth, nheight, nscalevalue, g_ooutfile, true);
    // askoption1

    var ndlg_options1 = 0; 
    var ndlg_options3 = 0; 
    var ndlg_options4 = 0; 

    while (binput == false) {
      var userdialog = Dialogs.createNewDialogTemplate(700, 310, "Grafika formázása", "GraphicDialogsFunc_Dlg1");      
      // %GRID:10,7,1,1
      userdialog.Text(10, 10, 460, 15, "Használja a következő opciókat a modell grafika megjelenítéséhez.");
      userdialog.Text(10, 25, 460, 15, "A kiválasztás befejezéséhez kattintson az „OK” gombra.");
      userdialog.GroupBox(7, 50, 686, 55, "Szín");
      userdialog.OptionGroup("options1");
      userdialog.OptionButton(20, 65, 580, 15, "Színes");
      userdialog.OptionButton(20, 80, 580, 15, "Fekete-fehér");
      userdialog.GroupBox(7, 120, 686, 85, "Skálázás");
      userdialog.TextBox(200, 132, 60, 20, "Text0");
      userdialog.Text(280, 135, 50, 15, " %");
      userdialog.OptionGroup("options3");
      userdialog.OptionButton(20, 135, 180, 15, "Felhasználó által definiált");
      userdialog.OptionButton(20, 150, 80, 15, "100%");
      userdialog.OptionButton(20, 165, 580, 15, "Arányosan nagy");
      userdialog.OptionButton(20, 182, 660, 15, "Modell nyomtatási méret");
      userdialog.GroupBox(7, 220, 686, 55, "Cut");
      userdialog.OptionGroup("options4");
      userdialog.OptionButton(20, 235, 580, 15, "Margóobjektumok levágása");
      userdialog.OptionButton(20, 250, 580, 15, "Objektumok átfedése a margónál");
      userdialog.OKButton();
      userdialog.CancelButton();
//      userdialog.HelpButton("HID_atsall_dlg_01.hlp");

      var dlg = Dialogs.createUserDialog(userdialog); 
      if (bmodelcolor.value == false) {
        dlg.setDlgValue("options1", 0);
      }
      else {
        dlg.setDlgValue("options1", 1);
      }

      dlg.setDlgValue("options3", nscaleoption.value);
      if (bcutofthegraphic.value == true) {
        dlg.setDlgValue("options4", 0);
      }
      else {
        dlg.setDlgValue("options4", 1);
      }

      dlg.setDlgText("Text0", new String(nscalevalue.value));
      nuserdlg1 = parseInt(Dialogs.show( __currentDialog = dlg));
      // Showing dialog and waiting for confirmation with OK
      nscaleoption.value = parseInt(dlg.getDlgValue("options3"));
      if (dlg.getDlgValue("options3") == 0) {
        if ( !(isNaN(dlg.getDlgText("Text0"))) ) {
          nscalevalue.value = parseInt(dlg.getDlgText("Text0"));
          if (nscalevalue.value >= 10 && nscalevalue.value <= 400) {    // BLUE-10197 Adapted to the allowed values in Designer 
            binput = true;
          }
          else {
                        Dialogs.MsgBox("Adjon meg egy intézkedést < 400.", 0, "Riport");
          }

        }
        else {
                    Dialogs.MsgBox("Adjon meg egy intézkedést.", 0, "Riport");
        }

      }
      else {
        binput = true;
      }


      // Modified for WebDesigner
      ndlg_options1 = parseInt(dlg.getDlgValue("options1"));
      ndlg_options3 = parseInt(dlg.getDlgValue("options3"));
      ndlg_options4 = parseInt(dlg.getDlgValue("options4"));
    }
    
    if (! (nuserdlg1 == 0)) {
      inputfromregistry(bmodelcolor, nscaleoption, bcutofthegraphic, ntop, nbottom, nleft, nright, nwidth, nheight, nscalevalue, g_ooutfile, false);

      if (! (Context.getSelectedFormat() == Constants.OUTHTML)) {
      // (No page settings for HTML output)

        if (ndlg_options3 != 3) {
        // Modified for WebDesigner
          // If dlg.options3 <> 3 Then
          // Page settings.
          g_ooutfile.value.SetPageWidth(nwidth.value);
          g_ooutfile.value.SetPageHeight(nheight.value);
          g_ooutfile.value.SetLeftMargin(nleft.value);
          g_ooutfile.value.SetRightMargin(nright.value);
          g_ooutfile.value.SetTopMargin(ntop.value);
          g_ooutfile.value.SetBottomMargin(nbottom.value);
        }
        else {
          nwidth.value = parseInt(g_ooutfile.value.GetPageWidth());
          nheight.value = parseInt(g_ooutfile.value.GetPageHeight());
          nleft.value = parseInt(g_ooutfile.value.GetLeftMargin());
          nright.value = parseInt(g_ooutfile.value.GetRightMargin());
          ntop.value = parseInt(g_ooutfile.value.GetTopMargin());
          nbottom.value = parseInt(g_ooutfile.value.GetBottomMargin());
        }


        binput = false;

        while (binput == false) {
          // askoption 3 for the page options
          var userdialog = Dialogs.createNewDialogTemplate(520, 280, "Riport", "GraphicDialogsFunc_Dlg3");       // %GRID:10,7,1,1
          userdialog.Text(10, 10, 460, 15, "Adja meg a lap elrendezését.");
          userdialog.Text(10, 25, 460, 15, "A kiválasztás befejezéséhez kattintson az „OK” gombra.");
          userdialog.GroupBox(10, 49, 240, 180, "Margók");
          userdialog.Text(20, 70, 100, 15, "Fent");
          userdialog.TextBox(120, 67, 40, 20, "Text0");
          userdialog.Text(170, 70, 25, 15, "mm");
          userdialog.Text(20, 100, 100, 15, "Lent");
          userdialog.TextBox(120, 97, 40, 20, "Text2");
          userdialog.Text(170, 100, 25, 15, "mm");
          userdialog.Text(20, 130, 100, 15, "Balra");
          userdialog.TextBox(120, 127, 40, 20, "Text4");
          userdialog.Text(170, 130, 25, 15, "mm");
          userdialog.Text(20, 160, 100, 15, "Jobbra");
          userdialog.TextBox(120, 157, 40, 20, "Text5");
          userdialog.Text(170, 160, 25, 15, "mm");
          userdialog.GroupBox(270, 49, 240, 180, "Papírformátum");
          userdialog.DropListBox(280, 67, 220, 70, g_sPaperFormat, "VAR_PaperFormat");
          userdialog.Text(280, 100, 100, 14, "Szélesség");
          userdialog.TextBox(380, 97, 40, 21, "Text1");
          userdialog.Text(430, 100, 30, 14, "mm");
          userdialog.Text(280, 130, 100, 14, "Magasság");
          userdialog.TextBox(380, 127, 40, 21, "Text3");
          userdialog.Text(430, 130, 30, 14, "mm");
          userdialog.GroupBox(280, 155, 220, 55, "Tájolás");
          userdialog.OptionGroup("VAR_Orientation");
          userdialog.OptionButton(300, 170, 150, 15, "Álló");
          userdialog.OptionButton(300, 190, 150, 15, "Fekvő");
          userdialog.OKButton();
          userdialog.CancelButton();
//          userdialog.HelpButton("HID_atsall_dlg_02.hlp");          

          var dlg3 = Dialogs.createUserDialog(userdialog); 
          dlg3.setDlgText("Text0", new String(ntop.value));
          dlg3.setDlgText("Text2", new String(nbottom.value));
          dlg3.setDlgText("Text4", new String(nleft.value));
          dlg3.setDlgText("Text5", new String(nright.value));
          dlg3.setDlgText("Text1", new String(nwidth.value));
          dlg3.setDlgText("Text3", new String(nheight.value));
          nuserdlg3 = Dialogs.show( __currentDialog = dlg3);
          // Showing dialog and waiting for confirmation with OK
          if ( isNaN(dlg3.getDlgText("Text0")) || isNaN(dlg3.getDlgText("Text1")) || isNaN(dlg3.getDlgText("Text2")) || isNaN(dlg3.getDlgText("Text3")) || isNaN(dlg3.getDlgText("Text4")) || isNaN(dlg3.getDlgText("Text5")) ) {
                        Dialogs.MsgBox("Adjon meg egy intézkedést.", 0, "Riport");
          }
          else {
            binput = true;
            ntop.value = parseInt(parseInt(dlg3.getDlgText("Text0")));
            nbottom.value = parseInt(parseInt(dlg3.getDlgText("Text2")));
            nleft.value = parseInt(parseInt(dlg3.getDlgText("Text4")));
            nright.value = parseInt(parseInt(dlg3.getDlgText("Text5")));
            nwidth.value = parseInt(parseInt(dlg3.getDlgText("Text1")));
            nheight.value = parseInt(parseInt(dlg3.getDlgText("Text3")));
          }

        }

        // Page settings.
        g_ooutfile.value.SetPageWidth(nwidth.value);
        g_ooutfile.value.SetPageHeight(nheight.value);
        g_ooutfile.value.SetLeftMargin(nleft.value);
        g_ooutfile.value.SetRightMargin(nright.value);
        g_ooutfile.value.SetTopMargin(ntop.value);
        g_ooutfile.value.SetBottomMargin(nbottom.value);

      }
      else {
        nuserdlg3 = - 1;
        // -1: like OK button was pressed
      }

    }
    else {
      nuserdlg3 = 1;
    }


    if (ndlg_options1 == 0) {
    // Modified for WebDesigner
      // If dlg.options1 = 0 Then
      bmodelcolor.value = false;
    }
    else {
      bmodelcolor.value = true;
    }


    if (ndlg_options4 == 0) {
    // Modified for WebDesigner
      // If dlg.options4 = 0 Then
      bcutofthegraphic.value = true;
    }
    else {
      bcutofthegraphic.value = false;
    }


    if (nuserdlg1 == 0 || nuserdlg3 == 0) {
      bcheckuserdialog.value = false;
    }
    else {
      bcheckuserdialog.value = true;
    }

    if (bcheckuserdialog.value == true) {
      outputintoregistry(bmodelcolor.value, nscaleoption.value, bcutofthegraphic.value, ntop.value, nbottom.value, nleft.value, nright.value, nwidth.value, nheight.value, nscalevalue.value);
    }

  }

}

function GraphicDialogsFunc_Dlg1(dlgitem, action, suppvalue)
{
    switch(action) {
        case 1:
            if (Context.getSelectedFormat() == Constants.OUTHTML) {
                __currentDialog.setDlgEnable("options4", false);
            }
            break;
    }
    return false;
}


function GraphicDialogsFunc_Dlg3(dlgitem, action, suppvalue)
{
  var __functionResult = false;

  switch(action) {
    case 1:
      g_tPaperFormat[0] = new tPaperFormatType("Felhasználó által definiált", 0, 0);      // userdefined
      g_tPaperFormat[1] = new tPaperFormatType("A3", 297, 420);                 // A3
      g_tPaperFormat[2] = new tPaperFormatType("A4", 210, 297);                 // A4
      g_tPaperFormat[3] = new tPaperFormatType("A5", 148, 210);                 // A5
      g_tPaperFormat[4] = new tPaperFormatType("Letter", 216, 280);             // Letter
      g_tPaperFormat[5] = new tPaperFormatType("Legal", 216, 356);              // Legal

      for (var i = 0 ; i < g_tPaperFormat.length ; i++ ) {
        g_sPaperFormat[i] = g_tPaperFormat[i].sName;
      }
      __currentDialog.setDlgListBoxArray("VAR_PaperFormat", g_sPaperFormat);

      if (__currentDialog.getDlgText("Text1") <= __currentDialog.getDlgText("Text3")) {
            __currentDialog.setDlgValue("VAR_Orientation", 0);
      }
      else {
            __currentDialog.setDlgValue("VAR_Orientation", 1);
      }

      var bfound = false; 
      
      for (var i = 0 ; i < g_tPaperFormat.length ; i++ ) {
       if (((new java.lang.String(__currentDialog.getDlgText("Text1")).equals(new java.lang.String(g_tPaperFormat[i].nWidth))) && 
            (new java.lang.String(__currentDialog.getDlgText("Text3")).equals(new java.lang.String(g_tPaperFormat[i].nHeight)))) || 
           ((new java.lang.String(__currentDialog.getDlgText("Text3")).equals(new java.lang.String(g_tPaperFormat[i].nWidth))) &&
            (new java.lang.String(__currentDialog.getDlgText("Text1")).equals(new java.lang.String(g_tPaperFormat[i].nHeight))))) {
                
            __currentDialog.setDlgValue("VAR_PaperFormat", i);
            bfound = true;
            break;
        }
      }
      if (! (bfound)) {
        __currentDialog.setDlgValue("VAR_PaperFormat", 0);

        if (__currentDialog.getDlgText("Text1") <= __currentDialog.getDlgText("Text3")) {
            g_tPaperFormat[0].nWidth =  __currentDialog.getDlgText("Text1");
            g_tPaperFormat[0].nHeight = __currentDialog.getDlgText("Text3");
        }
        else {
            g_tPaperFormat[0].nWidth =  __currentDialog.getDlgText("Text3");
            g_tPaperFormat[0].nHeight = __currentDialog.getDlgText("Text1");
        }
      }
      break;
      
    case 2:
      switch(dlgitem) {
        case "VAR_Orientation":
			if ((suppvalue == 0 && (__currentDialog.getDlgText("Text1") > __currentDialog.getDlgText("Text3"))) ||
                (suppvalue == 1 && (__currentDialog.getDlgText("Text1") < __currentDialog.getDlgText("Text3")))) {
        
                var sValue = __currentDialog.getDlgText("Text1");
                __currentDialog.setDlgText("Text1", __currentDialog.getDlgText("Text3"));
                __currentDialog.setDlgText("Text3", sValue);
            }
        break;
        case "VAR_PaperFormat":
          if (suppvalue >= 0 && suppvalue < g_tPaperFormat.length) {
            if (__currentDialog.getDlgValue("VAR_Orientation") == 0) {
                __currentDialog.setDlgText("Text1", new String(g_tPaperFormat[suppvalue].nWidth));
                __currentDialog.setDlgText("Text3", new String(g_tPaperFormat[suppvalue].nHeight));
            }
            else {
                __currentDialog.setDlgText("Text1", new String(g_tPaperFormat[suppvalue].nHeight));
                __currentDialog.setDlgText("Text3", new String(g_tPaperFormat[suppvalue].nWidth));
            }
          }
          break;
      }
      break;
  }
  return __functionResult;
}

// ----------------------------------------------------------------------------
// Subroutine InPutFromRegistry
// This subprogram is used for reading the predefined values of the registry when outputting graphics.
// Parameter
// bModelColor =  Variable for representing the model graphic ( False = colored / True = black and white ).
// nScaleOption = Variable for registering the selected scaling mode ( 0 = scaling in	XXX%, 1 = adapted to page,  2 = use print scale of the models).
// bCutOfTheGraphic = Variable for registering how the graphic will be cut ( True = objects were cut / False = cascade ).
// nTop = Variable for the top page margin.
// nBottom = Variable for the bottom page margin.
// nLeft = Variable for the left page margin.
// nRight = Variable for the right page margin.
// nWidth = Variable for the page width.
// nHeight = Variable for the page height.
// nScaleValue = Variable for registering the scaling in percent if this mode was selected.
// bCheck = True, display the first part of the user dialog / false, display the second part.
// ----------------------------------------------------------------------------

function inputfromregistry(bmodelcolor, nscaleoption, bcutofthegraphic, ntop, nbottom, nleft, nright, nwidth, nheight, nscalevalue, g_ooutfile, bcheck)
{
  if (bcheck) {
    var sdummy = "";     // Variable in which the read-in strings are intermediately stored.

    sdummy = new String(Context.getProfileString("SCRIPT_atsall", "ModelColor", "-1"));
    if (sdummy == "-1") {
      bmodelcolor.value = false;
    }
    else {
      bmodelcolor.value = true;
    }

    nscaleoption.value = parseInt(parseInt(Context.getProfileString("SCRIPT_atsall", "ScaleOption", "0")));
    nscalevalue.value = parseInt(parseInt(Context.getProfileString("SCRIPT_atsall", "ScaleValue", "100")));
    sdummy = new String(Context.getProfileString("SCRIPT_atsall", "CutOfTheGraphic", "-1"));
    if (sdummy == "-1") {
      bcutofthegraphic.value = false;
    }
    else {
      bcutofthegraphic.value = true;
    }

  }
  else {
// Anubis 301983 / Page settings no longer saved in 'user registry'
      nwidth.value = parseInt(g_ooutfile.value.GetPageWidth());
      nheight.value = parseInt(g_ooutfile.value.GetPageHeight());
      nleft.value = parseInt(g_ooutfile.value.GetLeftMargin());
      nright.value = parseInt(g_ooutfile.value.GetRightMargin());
      ntop.value = parseInt(g_ooutfile.value.GetTopMargin());
      nbottom.value = parseInt(g_ooutfile.value.GetBottomMargin());
/*      
    sdummy = new String(Context.getProfileString("SCRIPT_atsall", "GraphicSettings", "-1"));
    if (sdummy == "-1" || nscaleoption.value == 3) {
      nwidth.value = parseInt(g_ooutfile.value.GetPageWidth());
      nheight.value = parseInt(g_ooutfile.value.GetPageHeight());
      nleft.value = parseInt(g_ooutfile.value.GetLeftMargin());
      nright.value = parseInt(g_ooutfile.value.GetRightMargin());
      ntop.value = parseInt(g_ooutfile.value.GetTopMargin());
      nbottom.value = parseInt(g_ooutfile.value.GetBottomMargin());

    }
    else {
      ntop.value = parseInt(Context.getProfileString("SCRIPT_atsall", "Top", new String(g_ooutfile.value.GetTopMargin())));
      nbottom.value = parseInt(Context.getProfileString("SCRIPT_atsall", "Bottom", new String(g_ooutfile.value.GetBottomMargin())));
      nleft.value = parseInt(Context.getProfileString("SCRIPT_atsall", "Left", new String(g_ooutfile.value.GetLeftMargin())));
      nright.value = parseInt(Context.getProfileString("SCRIPT_atsall", "Right", new String(g_ooutfile.value.GetRightMargin())));
      nwidth.value = parseInt(Context.getProfileString("SCRIPT_atsall", "Width", new String(g_ooutfile.value.GetPageWidth())));
      nheight.value = parseInt(Context.getProfileString("SCRIPT_atsall", "Height", new String(g_ooutfile.value.GetPageHeight())));
    }
*/
  }

}


// ----------------------------------------------------------------------------
// Subroutine OutPutIntoRegistry
// This subprogram is used to write the values that were selected at the graphic output into the registry.
// Parameter
// bModelColor =  Variable for representing the model graphic ( False = colored / True = black and white ).
// nScaleOption = Variable for registering the selected scaling mode ( 0 = scaling in	XXX%, 1 = adapted to page,  2 = use print scale of the models).
// bCutOfTheGraphic = Variable for registering how the graphic will be cut ( True = objects were cut / False = cascade ).
// nTop = Variable for the top page margin.
// nBottom = Variable for the bottom page margin.
// nLeft = Variable for the left page margin.
// nRight = Variable for the right page margin.
// nWidth = Variable for the page width.
// nHeight = Variable for the page height.
// nScaleValue = Variable for registering the scaling in percent if this mode was selected.
// ----------------------------------------------------------------------------
function outputintoregistry(bmodelcolor, nscaleoption, bcutofthegraphic, ntop, nbottom, nleft, nright, nwidth, nheight, nscalevalue)
{
  Context.writeProfileString("SCRIPT_atsall", "GraphicSettings", "1");
  if (bmodelcolor == false) {
    Context.writeProfileString("SCRIPT_atsall", "ModelColor", "-1");
  }
  else {
    Context.writeProfileString("SCRIPT_atsall", "ModelColor", "1");
  }

  Context.writeProfileString("SCRIPT_atsall", "ScaleOption", new String(nscaleoption));
  if (bcutofthegraphic == false) {
    Context.writeProfileString("SCRIPT_atsall", "CutOfTheGraphic", "-1");
  }
  else {
    Context.writeProfileString("SCRIPT_atsall", "CutOfTheGraphic", "1");
  }

  if (nscaleoption != 3) {
// Anubis 301983 / Page settings no longer saved in 'user registry'
/*      
    Context.writeProfileString("SCRIPT_atsall", "Top", new String(ntop));
    Context.writeProfileString("SCRIPT_atsall", "Bottom", new String(nbottom));
    Context.writeProfileString("SCRIPT_atsall", "Left", new String(nleft));
    Context.writeProfileString("SCRIPT_atsall", "Right", new String(nright));
    Context.writeProfileString("SCRIPT_atsall", "Width", new String(nwidth));
    Context.writeProfileString("SCRIPT_atsall", "Height", new String(nheight));
*/    
    Context.writeProfileString("SCRIPT_atsall", "ScaleValue", new String(nscalevalue));
  }

}


// ----------------------------------------------------------------------------
// Subroutine ExtensionSelect
// This subprogram is used if a table output was selected for reports with text output.
// To inform the user and to carry out the necessary changes.
// Parameter
// sExtension = file extension
// bCheckUserDialog = Variable for checking whether the user has chosen Cancel in the dialog boxes.
// ----------------------------------------------------------------------------
function extensionselect(sextension, bcheckuserdialog)
{


  var nuserdlg = 0;   // Variable for the user dialog box
  var userdialog = Dialogs.createNewDialogTemplate(0, 0, 700, 170, "Riport");
  // %GRID:10,7,1,1
  userdialog.Text(10, 10, 650, 15, "A riport nem tudja a megadott kimenetet létrehozni.");
  userdialog.Text(10, 25, 460, 15, "Válassza ki az új opciót. A kiválasztás befejezéséhez kattintson az „OK” gombra.");
  userdialog.GroupBox(7, 50, 686, 85, "Kimeneti opciók");
  userdialog.OptionGroup("options1");
  userdialog.OptionButton(20, 65, 580, 15, "Rich Text formátum (*.rtf)");
  userdialog.OptionButton(20, 80, 580, 15, "HTML-fájl (*.htm)");
  userdialog.OptionButton(20, 95, 580, 15, "Szövegfájl (*.txt)");
  userdialog.OptionButton(20, 110, 580, 15, "Word dokumentum (*.doc)");
  userdialog.OKButton();
  userdialog.CancelButton();
//  userdialog.HelpButton("HID_atsall_dlg_03.hlp");  

  var dlg = Dialogs.createUserDialog(userdialog); 
  dlg.setDlgValue("options1", 2);
  nuserdlg = Dialogs.show( __currentDialog = dlg);
  // Showing dialog and waiting for confirmation with OK
  if (nuserdlg == 0) {
    bcheckuserdialog.value = false;
  }
  else {
    bcheckuserdialog.value = true;
  }

  switch(dlg.getDlgValue("options1")) {
    case 0:
      sextension.value = "rtf";
    break;
    case 1:
      sextension.value = "htm";
    break;
    case 2:
      sextension.value = "txt";
    break;
    case 3:
      sextension.value = "doc";
    break;
  }

}


// ----------------------------------------------------------------------------
// Subroutine ChangeExtension
// This subprogram is used to change data extension.
// Parameter
// sSourceString = String that will be changed( file name + data extension).
// sExtension = new data extension.
// ----------------------------------------------------------------------------
function changeextension(ssourcestring, sextension)
{
  var nlength = 0; 
  var sresultstring = ""; 

  nlength = (new String(ssourcestring)).length;
  sresultstring = (new String(ssourcestring)).substr(0, nlength - 3);
  sresultstring = sresultstring + sextension;

  return sresultstring;
}


// --------------------------------------------------
// Subroutine Round2
// Subprogram that cuts a double after the second decimal digit and rounds correspondingly.
// Parameter
// nDigit = Double that is processed.
// --------------------------------------------------

function round2(ndigit)
{
  var nint = 0; 
  var nremainder = 0.0; 

  ndigit = parseFloat(ndigit) * 100.0;
  nint = parseInt(ndigit);
  nremainder = ndigit - nint;
  if (nremainder == 0.5) {
    nremainder = nremainder + 0.01;
  }

  return (nint + Math.round(nremainder)) / 100;
}


// -------------------------------
// Subroutine DeleteElements to delete all elements in an object, model, group, or cxn-list.
// Parameter
// oElements = List of the elements.
// -------------------------------
function deleteelements(oelements)
{
  if(typeof(oelements)=="object" && oelements.constructor.toString().indexOf("__isHolder")!=-1) {
    oelements.value = new Array();
  }
}


// -------------------------------
// Subroutine CopyOfAList for copying a list of objects.
// Parameter
// ListToInsert = List which is created.
// ListToCopy = List with objects that is to be copied.
// -------------------------------
function copyofalist(listtoinsert, listtocopy)
{
  for (var  i = 0 ; i < listtocopy.length ; i++ ){
    listtoinsert[listtoinsert.length] = listtocopy[i];
  }
}



// ----------------------------------------------------------------------------
// Subroutine ChangeExGraph
// This sub is used if a report with graphic will be generated and if the output format is not rtf, html, doc.
// Parameter
// g_oOutFile = The global output object.
// bCheckUserDialog = 'Variable for checking which entries the user made in the user dialog.
// ----------------------------------------------------------------------------
function changeexgraph(g_ooutfile, bcheckuserdialog)
{


  var nuserdlg = 0;   // Variable for the user dialog box
  var nlength = 0; 
  var sresultstring = ""; 
  var sextension = ""; 
  var sfilestring = ""; 
  var userdialog = Dialogs.createNewDialogTemplate(0, 0, 700, 152, "Riport");
  // %GRID:10,7,1,1
  userdialog.Text(10, 10, 650, 15, "Nem lehetséges a megadott opciók szerinti grafikával a riport létrehozása.");
  userdialog.Text(10, 25, 460, 15, "Válassza ki az új opciót. A kiválasztás befejezéséhez kattintson az „OK” gombra.");
  userdialog.GroupBox(7, 50, 686, 67, "Kimeneti opciók");
  userdialog.OptionGroup("options1");
  userdialog.OptionButton(20, 65, 580, 15, "Rich Text formátum (*.rtf)");
  userdialog.OptionButton(20, 80, 580, 15, "HTML-fájl (*.htm)");
  userdialog.OptionButton(20, 95, 580, 15, "Word dokumentum (*.doc)");
  userdialog.OKButton();
  userdialog.CancelButton();
//  userdialog.HelpButton("HID_atsall_dlg_04.hlp");
  
  var dlg = Dialogs.createUserDialog(userdialog); 
  dlg.setDlgValue("options1", 2);
  nuserdlg = Dialogs.show( __currentDialog = dlg);
  // Showing dialog and waiting for confirmation with OK
  if (nuserdlg == 0) {
    bcheckuserdialog.value = false;
  }
  else {
    bcheckuserdialog.value = true;
  }

  switch(dlg.getDlgValue("options1")) {
    case 0:
      sextension = "rtf";
    break;
    case 1:
      sextension = "htm";
    break;
    case 2:
      sextension = "doc";
    break;
  }

  // Correct the file extension
  sfilestring = new String(Context.getSelectedFile());//to js-String
  nlength = sfilestring.length;
  sresultstring = sfilestring.substr(0, (nlength - 3));
  sresultstring = sresultstring + sextension;
  Context.setSelectedFile(sresultstring);
  // Correct the output format
  switch(sextension) {
    case "rtf":
      Context.setSelectedFormat(Constants.OUTRTF);
    break;
    case "htm":
      Context.setSelectedFormat(Constants.OUTHTML);
    break;
    case "doc":
      Context.setSelectedFormat(Constants.OUTWORD);
    break;
  }

//  g_ooutfile.value.Init(Context.getSelectedFormat(), Context.getSelectedLanguage()) 
}


// ----------------------------------------------------------------------------
// Subroutine GraphicOut
// This sub is used for the output of a graphic.
// Parameter
// g_oOutFile = The global output object.
// oCurrentModel = Current model.
// ------------------------------------------------------------------------
function graphicout(g_ooutfile, ocurrentmodel)
{
  var bmodelcolor = new __holder(false); 
  var nscaleoption = new __holder(0); 
  var bcutofthegraphic = new __holder(false); 
  var ntop = new __holder(0); 
  var nbottom = new __holder(0); 
  var nleft = new __holder(0); 
  var nright = new __holder(0); 
  var nwidth = new __holder(0); 
  var nheight = new __holder(0); 
  var nscalevalue = new __holder(0); 
  var nmodelzoom = 0;
  var aPicSize  = new Array();
  // Input from registry.
  inputfromregistry(bmodelcolor, nscaleoption, bcutofthegraphic, ntop, nbottom, nleft, nright, nwidth, nheight, nscalevalue, g_ooutfile, true);
  inputfromregistry(bmodelcolor, nscaleoption, bcutofthegraphic, ntop, nbottom, nleft, nright, nwidth, nheight, nscalevalue, g_ooutfile, false);
  switch(nscaleoption.value) {
    case 0:
      nmodelzoom = parseInt(nscalevalue.value);
    break;
    case 1:
      nmodelzoom = 100;
    break;
    case 2:
      nmodelzoom = - 1;
      aPicSize   = fitPageScale( g_ooutfile.value, ocurrentmodel.Graphic(bcutofthegraphic.value, bmodelcolor.value, Context.getSelectedLanguage()) );
    break;
    case 3:
      // ''			nModelZoom = oCurrentModel.Zoom()
      nmodelzoom = parseInt(ocurrentmodel.getPrintScale());
    break;
  }

  if( (nmodelzoom == -1) && (Context.getSelectedFormat() == Constants.OUTHTML) ){
      g_ooutfile.value.OutGraphic(ocurrentmodel.Graphic(bcutofthegraphic.value, bmodelcolor.value, Context.getSelectedLanguage()), nmodelzoom, aPicSize["WIDTH"]*10, aPicSize["HEIGHT"]*10);
  }
  else{
      g_ooutfile.value.OutGraphic(ocurrentmodel.Graphic(bcutofthegraphic.value, bmodelcolor.value, Context.getSelectedLanguage()), nmodelzoom, ((nwidth.value - nleft.value) - nright.value), (((nheight.value - ntop.value) - nbottom.value) - IMAGESPACE));      
  }
}

function fitPageScale(p_Output, p_Pict){
    var nPicWidth   = p_Pict.getWidth(Constants.SIZE_LOMETRIC) / 10 ;
    var nPicHeight  = p_Pict.getHeight(Constants.SIZE_LOMETRIC) / 10 ;
    var nDispHeight = p_Output.GetPageHeight() - p_Output.GetTopMargin() - p_Output.GetBottomMargin() - IMAGESPACE;
    var nDispWidth  = p_Output.GetPageWidth() - p_Output.GetLeftMargin() - p_Output.GetRightMargin();
    var aSize       = new Array();
    var nZoom       = 1;
    
    if( (nDispHeight < nPicHeight) || (nDispWidth < nPicWidth) ){
        var nHZoom  = nPicHeight / nDispHeight;
        var nWZoom  = nPicWidth / nDispWidth;
        if( nHZoom < nWZoom )   { nZoom = nWZoom; }
        if( nHZoom > nWZoom )   { nZoom = nHZoom; }
    }

    aSize["NZOOM"]  = nZoom;
    aSize["WIDTH"]  = nPicWidth / nZoom;
    aSize["HEIGHT"] = nPicHeight / nZoom;
    
    return aSize;
}


// ----------------------------------------------------------------------------
// Function NumCut
// This function is used for cutting a double and obtaining the value in front of the comma.
// Parameter
// nDigit = The double that will be cut.
// ------------------------------------------------------------------------
function numcut(ndigit)
{
  var __functionResult = 0;
  var ncutnum = 0; 
  ncutnum = parseInt(Math.floor(ndigit)  / Math.floor(1) );
  if (ndigit > ncutnum) {
    __functionResult = ncutnum;
  }
  else {
    __functionResult = (ncutnum - 1);
  }

  return __functionResult;
}


// -------------------------------
// Function IsElementInList for checking whether the element is contained in the list.
// Parameter
// oCurrElement = Current element.
// oElements = List of the elements.
// nIndex = Position within the list.
// -------------------------------
function iselementinlist(ocurrelement, oelements, nindex)
{
  var __functionResult = false;
  var i = 0; 
  __functionResult = false;
  for ( i = 0 ; i < oelements.length  ; i++ ){
    if (ocurrelement.IsEqual(oelements[i])) {
      __functionResult = true;
      nindex.value = i;
      break;
    }

  }

  return __functionResult;
}


// ----------------------------------------------------------------------------
// Function CutString31
// This function cuts a string if it is has more than 31 characters.
// Parameter
// sOutString =String to be cut.
// nIndex = TAB index (starts at 0)
// ----------------------------------------------------------------------------
function cutstring31(soutstring, nindex)
{
  var sindex = new String(nindex) + ". "; 

  var soutstr = sindex + soutstring;
  var npos = serchforspecialchar(soutstr);
  
  if (npos >= 0 && npos <= 31 ) 
  {
    npos = Math.min(npos, 28);
    soutstr = soutstr.substr(0, npos);
    soutstr = soutstr + "...";
  }
  else 
  {
    if (soutstr.length > 31) 
    {
      soutstr = soutstr.substr(0, 28);
      soutstr = soutstr + "...";
    }
  }

  return soutstr;
}


// ----------------------------------------------------------------------------
// Function SearchForSpecialChar
// This function searches for special characters.
// Parameter
// sOutString = string in which is searched.
// return value: first index of special char
//               -1 if no special char found
// ----------------------------------------------------------------------------
function serchforspecialchar(soutstring)
{
    var scharset = new Array(":", "/", "\\", "*", "?", "[", "]");
    var npos = soutstring.length;
    
    for (var i = 0 ; i < scharset.length ; i++ )
    {
        var npos1 = soutstring.indexOf(scharset[i]);
        if(npos1>=0)
        {
            npos = Math.min(npos, npos1)
        }
    }
    
    if(npos == soutstring.length)
        return -1;
    else
        return npos;
}




function formatstring1(stext, svalue1)
{
  // ----------------------------------------------------------------------------
  // Function FormatString1
  // This function replaces '@X' in String 'sText' with 'sValueX'
  // ----------------------------------------------------------------------------
  return (new String(stext)).replace("@1", svalue1)
}

function formatstring2(stext, svalue1, svalue2)
{
  // ----------------------------------------------------------------------------
  // Function FormatString2
  // This function replaces '@X' in String 'sText' with 'sValueX'
  // ----------------------------------------------------------------------------
  var snewtext = (new String(stext)).replace("@1", svalue1); // ensure we have a js-String
  snewtext = snewtext.replace("@2", svalue2);

  return snewtext;
}




function formatstring3(stext, svalue1, svalue2, svalue3)
{
  // ----------------------------------------------------------------------------
  // Function FormatString3
  // This function replaces '@X' in String 'sText' with 'sValueX'
  // ----------------------------------------------------------------------------

  var snewtext = (new String(stext)).replace("@1", svalue1); // ensure we have a js-String
  snewtext = snewtext.replace("@2", svalue2);
  snewtext = snewtext.replace("@3", svalue3);

  return snewtext;
}


  // ----------------------------------------------------------------------------
  // Sub GetListOf_Groups
  // 
  // Parameter
  // oGroupList = List of groups (modified)
  // oCurrentGroup = Current Group
  // bRecursive = if (bRecursive = True) then search for child groups
  // ----------------------------------------------------------------------------
function getlistof_groups(ogrouplist, ocurrentgroup, brecursive)
{
  var ochildgroups = null; 
  var i = 0; 

  ogrouplist.value.push( ocurrentgroup );
  // Add current group to list

  if (brecursive.value) {
    // Search for child groups of the group.
    ochildgroups = ocurrentgroup.Childs();

    for ( i = 0 ; i < ochildgroups.length ; i++ )
    {
        getlistof_groups(ogrouplist, ochildgroups[i], brecursive);
    }

    ochildgroups = null;
  }


}

  // ----------------------------------------------------------------------------
  // Sub GetListOf_Models
  // 
  // Parameter
  // oModelList = List of models (modified)
  // oGroupList = List of groups
  // ----------------------------------------------------------------------------
function getlistof_models(omodellist, ogrouplist)
{
  var ocurrentmodels = null; 
  var i = 0;   
  var j = 0; 

    for ( i = 0 ; i < ogrouplist.length ; i++ )
    {
      ocurrentmodels = ogrouplist[i].ModelList();

      for ( j = 0 ; j < ocurrentmodels.length ; j++ )
      {
          // Add current model to list
          omodellist.push( ocurrentmodels[j] );
      }
      ocurrentmodels = null;
    }
}


  // ----------------------------------------------------------------------------
  // Sub GetListOf_Objects
  // 
  // Parameter
  // oObjDefList = List of ObjDefs (modified)
  // oGroupList = List of groups
  // ----------------------------------------------------------------------------
function getlistof_objects(oobjdeflist, ogrouplist)
{
    var ocurrentobjdefs = null; 
    var i = 0;   
    var j = 0; 

    for ( i = 0 ; i < ogrouplist.length ; i++ )
    {
      ocurrentobjdefs = ogrouplist[i].ObjDefList();
      for ( j = 0 ; j < ocurrentobjdefs.length; j++ )
      {
          // Add current ObjDef to list
          oobjdeflist.push(ocurrentobjdefs[j]);
      }
      ocurrentobjdefs = null;
    }
}



  // ----------------------------------------------------------------------------
  // Sub GetListOf_Cxns
  // 
  // Parameter
  // oCxnList = List of CxnDefs  (modified)
  // oObjDefList = List of ObjDefs
  // ----------------------------------------------------------------------------
function getlistof_cxns(ocxnlist, oobjdeflist)
{
  var ocurrentcxns = null; 
  var i = 0;   
  var j = 0; 

    for ( i = 0 ; i < oobjdeflist.length ; i++ )
    {
      ocurrentcxns = oobjdeflist[i].CxnList(Constants.EDGES_INOUT);

      for ( j = 0 ; j < ocurrentcxns.length; j++ )
      {
          ocxnlist.push( ocurrentcxns[j] );
          // Add current ObjDef to list
      }

      ocurrentcxns = null;
    }
}

  // ----------------------------------------------------------------------------
  // Sub GetListOf_Shortcuts
  // 
  // Parameter
  // oShortcutList = List of Shortcuts (modified)
  // oGroupList = List of groups
  // ----------------------------------------------------------------------------
function getlistof_shortcuts(oshortcutlist, ogrouplist) {
    if (ogrouplist.length > 0) {
        for (var i = 0 ; i < ogrouplist.length ; i++ ) {
            var ocurrentgroup = ogrouplist[i];
            var ocurrentshortcuts = ocurrentgroup.Shortcuts(0, false);
            
            if (ocurrentshortcuts.length > 0) {
                for (var j = 0 ; j < ocurrentshortcuts.length ; j++ ) {
                    oshortcutlist.push( ocurrentshortcuts[j] );             // Add current shortcut to list
                }
            }
        }
    }
}


//deprecated:
function getremoteentryfromreg()
{
  return false;
}


function isboolattributetrue(oitem, nattrtypenum, nlocaleid)
{
  // ----------------------------------------------------------------------------
  // Function IsBoolAttributeTrue()
  // 
  // Check: Attribute is bool attribute, is maintained and is TRUE
  // 
  // Parameter
  // oItem = Item object
  // nAttrTypeNum = Attribute type number
  // nLocaleID = Locale ID
  // ----------------------------------------------------------------------------

    // AttrBaseType = ABT_BOOL ?
    if (ArisData.getActiveDatabase().ActiveFilter().AttrBaseType(nattrtypenum) == Constants.ABT_BOOL) {
        var attrValues = ArisData.getActiveDatabase().ActiveFilter().AttrValueTypeNums(nattrtypenum);
        if (attrValues.length == 2) {
            var refValue;                      // refValue is the geater value
            if (attrValues[0] > attrValues[1]) {
                refValue = attrValues[0];
            } else {
                refValue = attrValues[1];        
            }
            
            var oattribute = oitem.Attribute(nattrtypenum, nlocaleid);
            if (oattribute.IsMaintained()) {
                if (oattribute.MeasureUnitTypeNum() == refValue) {      
                    return true;                // Bool attribute is maintained and TRUE
                }
            }
        }
    }
    return false;
}


function isboolattributefalse(oitem, nattrtypenum, nlocaleid)
{
  // ----------------------------------------------------------------------------
  // Function IsBoolAttributeFalse()
  // 
  // Check: Attribute is bool attribute, is maintained and is FALSE
  // 
  // Parameter
  // oItem = Item object
  // nAttrTypeNum = Attribute type number
  // nLocaleID = Locale ID
  // ----------------------------------------------------------------------------

    // AttrBaseType = ABT_BOOL ?
    if (ArisData.getActiveDatabase().ActiveFilter().AttrBaseType(nattrtypenum) == Constants.ABT_BOOL) {
        var attrValues = ArisData.getActiveDatabase().ActiveFilter().AttrValueTypeNums(nattrtypenum);
        if (attrValues.length == 2) {
            var refValue;                       // refValue is the lesser value
            if (attrValues[0] < attrValues[1]) {
                refValue = attrValues[0];
            } else {
                refValue = attrValues[1];        
            }
            
            var oattribute = oitem.Attribute(nattrtypenum, nlocaleid);
            if (oattribute.IsMaintained()) {
                if (oattribute.MeasureUnitTypeNum() == refValue) {      
                    return true;                // Bool attribute is maintained and FALSE
                }
            }
        }
    }
    return false;
}


function graphicdialogs_default(g_ooutfile, bcheckuserdialog)
{
  // ----------------------------------------------------------------------------
  // Subroutine GraphicDefault_Default
  // Default settings for the graphic output.
  // Parameter
  // g_oOutFile = The global output object.
  // bCheckUserDialog = True
  // 
  // see also:	GraphicOut_Default
  // ----------------------------------------------------------------------------

  bcheckuserdialog.value = true;

  // Check format
  switch(Context.getSelectedFormat()) {
    case Constants.OUTTABLE:
    case Constants.OutputXLS:
    case Constants.OutputXLSX:
    case Constants.OUTTEXT:

      // Correct the file extension: RTF
      // SelectedFile = Left(SelectedFile,Len(SelectedFile)-3) + "rtf"
      Context.setSelectedFormat(Constants.OUTRTF);
      g_ooutfile = Context.createOutputObject(Context.getSelectedFormat(), Context.getSelectedFile());
      g_ooutfile.Init(g_nloc);

    break;
  }


}




function graphicout_default(g_ooutfile, ocurrentmodel)
{
  // ----------------------------------------------------------------------------
  // Subroutine GraphicOut_Default
  // This sub is used for the output of a graphic with default settings.
  // Parameter
  // g_oOutFile = The global output object.
  // oCurrentModel = Current model.
  // 
  // see also:	GraphicDialogs_Default
  // ------------------------------------------------------------------------

  var bmodelcolor = false; 
  var bcutofthegraphic = false; 
  var ntop = 0; 
  var nbottom = 0; 
  var nleft = 0; 
  var nright = 0; 
  var nwidth = 0; 
  var nheight = 0; 
  var nmodelzoom = 0; 


  bmodelcolor = false;
  bcutofthegraphic = true;
  nmodelzoom = parseInt(ocurrentmodel.Zoom());

  ntop = parseInt(g_ooutfile.GetTopMargin());
  nbottom = parseInt(g_ooutfile.GetBottomMargin());
  nleft = parseInt(g_ooutfile.GetLeftMargin());
  nright = parseInt(g_ooutfile.GetRightMargin());
  nwidth = parseInt(g_ooutfile.GetPageWidth());
  nheight = parseInt(g_ooutfile.GetPageHeight());


  g_ooutfile.OutGraphic(ocurrentmodel.Graphic(bcutofthegraphic, bmodelcolor, Context.getSelectedLanguage()), nmodelzoom, ((nwidth - nleft) - nright), (((nheight - ntop) - nbottom) - IMAGESPACE));

}


function sortcxnsbysourcename(ocxnlist, nlocaleid)
{
  var __functionResult = false;
  // ----------------------------------------------------------------------------
  // Function SortCxnsBySourceName
  // This function sorts the Cxn-(Occ-)List by the name of the source object
  // Parameter
  // oCxnList = CxnList
  // nLocaleID = Locale
  // ----------------------------------------------------------------------------

  var ocurrentcxn = null; 
  var i = 0; 
  var skey = ""; 
  var bisocclist = false; 
  var bsort = false; 

  if (ocxnlist.value.length > 0) {
    // Parameter is cxn-(occ-)list?
    if ((ocxnlist.value[0].KindNum() == Constants.CID_CXNDEF || ocxnlist.value[0].KindNum() == Constants.CID_CXNOCC)) {
      bsort = true;

      if (ocxnlist.value[0].KindNum() == Constants.CID_CXNOCC) {
        bisocclist = true;
      }

      var mcxnmap = new java.util.TreeMap(); 

      // Write Key-value-pairs to map
      for ( i = 0 ; i < ocxnlist.value.length; i++ ){
        ocurrentcxn = ocxnlist.value[i];

        if (bisocclist) {
          skey = ocurrentcxn.Cxn().SourceObjDef().Name(nlocaleid);
        }
        else {
          skey = ocurrentcxn.SourceObjDef().Name(nlocaleid);
        }


        skey = new String(skey) + ocurrentcxn.ObjectID(0);
        // Add ObjectId, cause different cxns may have the same source(name) as key
        mcxnmap.put(skey, ocurrentcxn);
        // Insert Key (= name of source) and value (= cxn)

        ocurrentcxn = null;
      }


      var onewcxnlist = new Array( mcxnmap.size() );
      // Get (new) sorted cxn-list
      var it = mcxnmap.values().iterator();
      var i = 0;
      while (it.hasNext()) {
        onewcxnlist[i] = it.next();
        i++;
      }

      ocxnlist.value = onewcxnlist;
    }

  }


  __functionResult = bsort;

  return __functionResult;
}




function sortcxnsbytargetname(ocxnlist, nlocaleid)
{
  var __functionResult = false;
  // ----------------------------------------------------------------------------
  // Function SortCxnsByTargetName
  // This function sorts the Cxn-(Occ-)List by the name of the target object
  // Parameter
  // oCxnList = CxnList
  // nLocaleID = Locale
  // ----------------------------------------------------------------------------

  var ocurrentcxn = null; 
  var i = 0; 
  var skey = ""; 
  var bisocclist = false; 
  var bsort = false; 

  if (ocxnlist.value.length > 0) {
    // Parameter is cxn-(occ-)list?
    if ((ocxnlist.value[0].KindNum() == Constants.CID_CXNDEF || ocxnlist.value[0].KindNum() == Constants.CID_CXNOCC)) {
      bsort = true;

      if (ocxnlist.value[0].KindNum() == Constants.CID_CXNOCC) {
        bisocclist = true;
      }

      var mcxnmap = new java.util.TreeMap(); 

      // Write Key-value-pairs to map
      for ( i = 0 ; i < (ocxnlist.value.length - 1)+1 ; i++ ){
        ocurrentcxn = ocxnlist.value[i];

        if (bisocclist) {
          skey = ocurrentcxn.Cxn().TargetObjDef().Name(nlocaleid);
        }
        else {
          skey = ocurrentcxn.TargetObjDef().Name(nlocaleid);
        }


        skey = new String(skey) + ocurrentcxn.ObjectID(0);
        // Add ObjectId, cause different cxns may have the same source(name) as key
        mcxnmap.put(skey, ocurrentcxn);
        // Insert Key (= name of target) and value (= cxn)

        ocurrentcxn = null;
      }


      var onewcxnlist = new Array( mcxnmap.size() );
      // Get (new) sorted cxn-list
      var it = mcxnmap.values().iterator();
      var i = 0;
      while (it.hasNext()) {
        onewcxnlist[i] = it.next();
        i++;
      }

      ocxnlist.value = onewcxnlist;
    }
  }


  __functionResult = bsort;

  return __functionResult;
}




function sortcxnsbysourceortargetname(ocxnlist, oobject, nlocaleid)
{
  var __functionResult = false;
  // ----------------------------------------------------------------------------
  // Function SortCxnsBySourceOrTargetName
  // This function sorts the Cxn-(Occ-)List by the name of the object
  // (source or target), which is unequal oObject
  // Parameter
  // oCxnList = CxnList
  // oObject = source or target object of the cxn list
  // nLocaleID = Locale
  // ----------------------------------------------------------------------------

  var ocurrentcxn = null; 
  var i = 0; 
  var skey = ""; 
  var bisocclist = false; 
  var bsort = false; 

  if (ocxnlist.value.length > 0) {
    // Parameter is cxn-(occ-)list?
    if ((ocxnlist.value[0].KindNum() == Constants.CID_CXNDEF || ocxnlist.value[0].KindNum() == Constants.CID_CXNOCC)) {
      bsort = true;

      if (ocxnlist.value[0].KindNum() == Constants.CID_CXNOCC) {
        bisocclist = true;
      }

      var mcxnmap = new java.util.TreeMap(); 

      // Write Key-value-pairs to map
      for ( i = 0 ; i < (ocxnlist.value.length - 1)+1 ; i++ ){
        ocurrentcxn = ocxnlist.value[i];

        if (bisocclist) {
          if (oobject.IsEqual(ocurrentcxn.SourceObjOcc())) {
          // oObject = cxn source?
            skey = ocurrentcxn.Cxn().TargetObjDef().Name(nlocaleid);
          }
          else {
            skey = ocurrentcxn.Cxn().SourceObjDef().Name(nlocaleid);
          }

        }
        else {
          if (oobject.IsEqual(ocurrentcxn.SourceObjDef())) {
          // oObject = cxn source?
            skey = ocurrentcxn.TargetObjDef().Name(nlocaleid);
          }
          else {
            skey = ocurrentcxn.SourceObjDef().Name(nlocaleid);
          }

        }


        skey = new String(skey) + ocurrentcxn.ObjectID(0);
        // Add ObjectId, cause different cxns may have the same source(name) as key
        mcxnmap.put(skey, ocurrentcxn);
        // Insert Key (= name of target) and value (= cxn)

        ocurrentcxn = null;
      }


      var onewcxnlist = new Array( mcxnmap.size() );
      // Get (new) sorted cxn-list
      var it = mcxnmap.values().iterator();
      var i = 0;
      while (it.hasNext()) {
        onewcxnlist[i] = it.next();
        i++;
      }

      ocxnlist.value = onewcxnlist;
    }

  }


  __functionResult = bsort;

  return __functionResult;
}




// /////////////Semantic Checks //////////////////
// Software AG

var SEMCHECK_PARAM_NAME      = "name";
var SEMCHECK_PARAM_DESC      = "desc";
var SEMCHECK_PARAM_OBJTYPE   = "object_type";
var SEMCHECK_PARAM_MODTYPE   = "model_type";
var SEMCHECK_PARAM_CXNTYPE   = "type";
var SEMCHECK_PARAM_SMT       = "source_model_types";
var SEMCHECK_PARAM_DMT       = "target_model_types";
var SEMCHECK_PARAM_SOT       = "source_object_type";
var SEMCHECK_PARAM_DOT       = "target_object_type";
var SEMCHECK_PARAM_CT        = "cxn_types";
var SEMCHECK_PARAM_CONJ      = "conjunction";
var SEMCHECK_PARAM_COUNT     = "count";
var SEMCHECK_PARAM_AT        = "attr_type_count";
var SEMCHECK_PARAM_AT_INFO   = "attr_type_";
var SEMCHECK_PARAM_REGEXP    = "regular_expression";
var SEMCHECK_PARAM_CASESENS  = "case_sensitive";
var SEMCHECK_PARAM_IGNSPACE  = "ignore_space";
var SEMCHECK_PARAM_MIN       = "min";
var SEMCHECK_PARAM_MAX       = "max";


var SEMCHECK_PARAMVAL_AND    = "and";
var SEMCHECK_PARAMVAL_OR     = "or";
var SEMCHECK_PARAMVAL_XOR    = "xor";

var SEMCHECK_PARAMVAL_MAINT     = "+";
var SEMCHECK_PARAMVAL_NOTMAINT  = "-";
var SEMCHECK_PARAMVAL_EQ        = "=";
var SEMCHECK_PARAMVAL_LT        = "<";
var SEMCHECK_PARAMVAL_GT        = ">";

__usertype_rulestructbas = function() {
    this.sname = "";
    this.sdesc = "";
    this.nnum = 0;
}

__usertype_groupstructbas = function() {
    this.sname = "";
    this.sdesc = "";
    this.rule = new Array();
}



// --------------------------------------------------------------
// Subroutine OutStatistic for the output of the staststic.
// Parameter
// oModels = list of the selected models
// sRulenameList = list with the names of the rules
// sObjString = string with Modell/Objekt
// nStatistic = array wiith the statistic values
// --------------------------------------------------------------
function outstatistic(omodels, srulenamelist, sobjstring, nstatistic, outputObject, nsemloc)
{
  var ocurrentmodel = null; 

  var i = undefined;   var j = 0; 
  var nfirstcellwidth = 0; 
  var ncellwidth = 0; 
  var nindex = 0; 
  var nmaxcount = 0; 
  var nmodelcount = 0; 
  var nstart = 0; 
  var nend = 0; 
  var ssheetname = ""; 
  var soutstring = ""; 

  nmodelcount = omodels.length - 1;
  if (Context.getSelectedFormat() == Constants.OutputXLS || Context.getSelectedFormat() == Constants.OutputXLSX) {
    nmaxcount = 254;
  }
  else {
    nmaxcount = 9;
  }


  // Cell size
  if (nmodelcount < nmaxcount) {
    ncellwidth = numcut(60 / (omodels.length));
    nfirstcellwidth = 100 - ((ncellwidth * omodels.length));
  }
  else {
    ncellwidth = numcut(60 / (nmaxcount + 1));
    nfirstcellwidth = 100 - (ncellwidth * (nmaxcount + 1));
  }


  // rules/models
  outputObject.OutputLn("", "Arial", 14, 0, - 1, 9, 0);
  outputObject.OutputField(5, "Arial", 12, 0, - 1, 16);
  outputObject.OutputLn("", "Arial", 14, 0, - 1, 9, 0);

  nindex = 0;
  nstart = 0;
  if (nmodelcount < nmaxcount) {
    nend = nmodelcount;
  }
  else {
    nend = nstart + nmaxcount;
  }


  while (nstart <= nmodelcount) {
    outputObject.BeginTable(100, 0, - 1, 8, 0);

    // tablehead
    outputObject.TableRow();
    outputObject.TableCell((("Szabály/" + sobjstring) + " No."), nfirstcellwidth, "Arial", 12, 0, 8421504, 0, 137, 0);
    for ( i = nstart ; i < nend+1 ; i++ ){
      outputObject.TableCell(new String(i + 1), ncellwidth, "Arial", 12, 0, 8421504, 0, 145, 0);
    }


    // tablebody
    for ( i = 0 ; i < srulenamelist.length ; i++ ){
      outputObject.TableRow();
      outputObject.TableCell( new String(i + 1) + ". " + srulenamelist[i], nfirstcellwidth, "Arial", 12, 0, - 1, 0, 137, 0);

      for ( j = nstart ; j < nend+1 ; j++ ){
        if (nstatistic[i][j] == - 1) {
          soutstring = "-";
        }
        else {
          soutstring = new String(nstatistic[i] [j]);
        }

        outputObject.TableCell(soutstring, ncellwidth, "Arial", 12, 0, - 1, 0, 144, 0);
      }

    }


    nindex = nindex + 1;

    ssheetname = "Statisztikák - szabály";
    if ((nindex > 1)) {
      ssheetname = ssheetname + " (" + new String(nindex) + ")";
    }

    outputObject.EndTable(ssheetname, 100, "Arial", 10, 0, - 1, 0, 136, 0);

    outputObject.OutputLn("", "Arial", 14, 0, - 1, 9, 0);
    outputObject.OutputField(5, "Arial", 12, 0, - 1, 16);
    outputObject.OutputLn("", "Arial", 14, 0, - 1, 9, 0);

    nstart = nend + 1;
    if (nmodelcount < ((nstart + nmaxcount))) {
      nend = nmodelcount;
    }
    else {
      nend = nstart + nmaxcount;
    }

  }


  // model infos
  outputObject.BeginTable(100, 0, - 1, 8, 0);
  // tablehead
  outputObject.TableRow();
  outputObject.TableCell((sobjstring + " No."), 10, "Arial", 12, 0, 8421504, 0, 137, 0);
  outputObject.TableCell("Név", 30, "Arial", 12, 0, 8421504, 0, 137, 0);
  outputObject.TableCell("Típus", 30, "Arial", 12, 0, 8421504, 0, 137, 0);
  outputObject.TableCell("Csoport", 30, "Arial", 12, 0, 8421504, 0, 137, 0);
  // tablebody
  for ( i = 0 ; i < (omodels.length - 1)+1 ; i++ ){
    ocurrentmodel = omodels[i];
    outputObject.TableRow();
    outputObject.TableCell(new String((i + 1)), 10, "Arial", 12, 0, - 1, 0, 136, 0);
    outputObject.TableCell(ocurrentmodel.Name(nsemloc), 30, "Arial", 12, 0, - 1, 0, 136, 0);
    outputObject.TableCell(ocurrentmodel.Type(), 30, "Arial", 12, 0, - 1, 0, 136, 0);
    outputObject.TableCell(ocurrentmodel.Group().Path(nsemloc), 30, "Arial", 12, 0, - 1, 0, 136, 0);
    ocurrentmodel = null;
  }

  outputObject.EndTable(("Statisztikák - " + sobjstring), 100, "Arial", 10, 0, - 1, 0, 136, 0);
}




//////////////////////////////////////////////////////////////////////
//
//   Funktionen fuer Kopf- und Fusszeile
//
// MJ 040720 fuer Skriptintegration / AP3
//
//////////////////////////////////////////////////////////////////////


/**
 *  function setReportHeaderFooter
 *  set report header and footer settings
 *  @param outfile  					output file
 *  @param nloc     					locale
 *  @param sTitle
 *  @param bDisplayServer			flag for writing server name
 *  @param bDisplayDatabase		flag for writing database name
 *  @param bDisplayUser				flag for writing user name
 */
function setReportHeaderFooter(outfile, nloc, bDisplayServer, bDisplayDatabase, bDisplayUser)
{
    var sTitle = Context.getScriptInfo(Constants.SCRIPT_TITLE);
    setReportHeaderFooterWithTitle(outfile, nloc, bDisplayServer, bDisplayDatabase, bDisplayUser, sTitle)
}

function setReportHeaderFooterWithTitle(outfile, nloc, bDisplayServer, bDisplayDatabase, bDisplayUser, sTitle)  // BLUE-11195
{
	// BLUE-17783 Update report header/footer
    var borderColor = getColorByRGB( 23, 118, 191);
    
    // graphics used in header
    var pictleft  = Context.createPicture(Constants.IMAGE_LOGO_LEFT);
    var pictright = Context.createPicture(Constants.IMAGE_LOGO_RIGHT);
    
    // header + footer settings
    setFrameStyle(outfile, Constants.FRAME_BOTTOM);
    
    outfile.BeginHeader();
    outfile.BeginTable(100, borderColor, Constants.C_TRANSPARENT, Constants.FMT_LEFT, 0);
    outfile.TableRow();
    outfile.TableCell("", 26, "Arial", 12, Constants.C_BLACK, Constants.C_TRANSPARENT, 0, Constants.FMT_CENTER | Constants.FMT_VCENTER, 0);
    outfile.OutGraphic(pictleft, - 1, 40, 15);
    outfile.TableCell(sTitle, 48, "Arial", 12, Constants.C_BLACK, Constants.C_TRANSPARENT, 0, Constants.FMT_CENTER | Constants.FMT_VCENTER, 0);
    outfile.TableCell("", 26, "Arial", 12, Constants.C_BLACK, Constants.C_TRANSPARENT, 0, Constants.FMT_CENTER | Constants.FMT_VCENTER, 0);
    outfile.OutGraphic(pictright, - 1, 40, 15);
    outfile.EndTable("", 100, "Arial", 10, Constants.C_BLACK, Constants.C_TRANSPARENT, 0, Constants.FMT_LEFT | Constants.FMT_VTOP, 0);
    outfile.EndHeader();
    
    setFrameStyle(outfile, Constants.FRAME_TOP);
    
    outfile.BeginFooter();
    outfile.BeginTable(100, borderColor, Constants.C_TRANSPARENT, Constants.FMT_LEFT, 0);
    outfile.TableRow();
    outfile.TableCell("", 26, "Arial", 10, Constants.C_BLACK, Constants.C_TRANSPARENT, 0, Constants.FMT_CENTER | Constants.FMT_VCENTER, 0);
    outfile.OutputField(Constants.FIELD_DATE, "Arial", 10, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_CENTER);
    outfile.Output(" ", "Arial", 10, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_CENTER, 0);
    outfile.OutputField(Constants.FIELD_TIME, "Arial", 10, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_CENTER);
    outfile.TableCell(Context.getSelectedFile(), 48, "Arial", 10, Constants.C_BLACK, Constants.C_TRANSPARENT, 0, Constants.FMT_CENTER | Constants.FMT_VCENTER, 0);
    outfile.TableCell("", 26, "Arial", 10, Constants.C_BLACK, Constants.C_TRANSPARENT, 0, Constants.FMT_CENTER | Constants.FMT_VCENTER, 0);
    outfile.Output("Oldal ", "Arial", 10, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_CENTER, 0);
    outfile.OutputField(Constants.FIELD_PAGE, "Arial", 10, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_CENTER);
    outfile.Output(" / ", "Arial", 10, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_CENTER, 0);
    outfile.OutputField(Constants.FIELD_NUMPAGES, "Arial", 10, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_CENTER);
    outfile.EndTable("", 100, "Arial", 10, Constants.C_BLACK, Constants.C_TRANSPARENT, 0, Constants.FMT_LEFT | Constants.FMT_VTOP, 0);
    outfile.EndFooter();
    
    outfile.ResetFrameStyle();
    
    // Information header (if enabled)
    if(bDisplayServer)
        outfile.OutputLnF(("Kiszolgáló: " + ArisData.getActiveDatabase().ServerName()), "REPORT2");
    
    if(bDisplayDatabase)
        outfile.OutputLnF(("Adatbázis: " + ArisData.getActiveDatabase().Name(nloc)), "REPORT2");
    
    if(bDisplayUser)
        outfile.OutputLnF(("Felhasználó: " + ArisData.getActiveUser().Name(nloc)), "REPORT2");
    
    if(bDisplayServer||bDisplayDatabase||bDisplayUser)
        outfile.OutputLnF("", "REPORT2");
    
    
    function setFrameStyle(outfile, iFrame) { 
        outfile.SetFrameStyle(Constants.FRAME_TOP, 0); 
        outfile.SetFrameStyle(Constants.FRAME_LEFT, 0); 
        outfile.SetFrameStyle(Constants.FRAME_RIGHT, 0); 
        outfile.SetFrameStyle(Constants.FRAME_BOTTOM, 0);
        
        outfile.SetFrameStyle(iFrame, 50, Constants.BRDR_NORMAL);
    }    
}


/**
 *  function writeTableHeader
 *  writes table header for specified column headings
 *  @param outfile     file to write header to
 *  @param colHeadings array with column headings
 *  @param fontSize    font size
 */
function writeTableHeader(outfile, colHeadings, fontSize)
{
  writeTableHeaderWithColor(outfile, colHeadings, fontSize, Constants.C_TRANSPARENT, Constants.C_BLACK);
}


/**
 *  function writeTableHeader
 *  writes table header for specified column headings
 *  @param outfile     file to write header to
 *  @param colHeadings array with column headings
 *  @param fontSize    font size
 *  @param backColor   background color
 *  @param textColor   text color
 */
function writeTableHeaderWithColor(outfile, colHeadings, fontSize, backColor, textColor)
{
    outfile.TableRow();
    
    var colWidth_default = Math.round((100.0 / colHeadings.length) - 0.5);
    var colSum = 0;
    var colWidth = 0;
    
    for(var i = 0; i < colHeadings.length; i++) {
        if (i < colHeadings.length - 1) {
            colWidth = colWidth_default;
        } else {
            colWidth = 100 - colSum;
        }
        outfile.TableCell(colHeadings[i], colWidth, "Arial", fontSize, textColor, backColor, 0, Constants.FMT_BOLD | Constants.FMT_LEFT | Constants.FMT_VTOP, 0);
        colSum = colSum + colWidth;
    }
}



/**
 *  function writeTableHeader
 *  writes table header for specified column headings
 *  @param outfile     file to write header to
 *  @param colHeadings array with column headings
 *  @param fontSize    font size
 *  @param backColor   background color
 *  @param textColor   text color
 *  @param widths      array with column widths
 */
function writeTableHeaderWithColorWidths(outfile, colHeadings, fontSize, backColor, textColor, colWidths)
{
  outfile.TableRow();
  
  for(var i=0;i<colHeadings.length;i++)
    outfile.TableCell(colHeadings[i], colWidths[i], "Arial", fontSize, textColor, backColor, 0, Constants.FMT_BOLD | Constants.FMT_LEFT | Constants.FMT_VTOP, 0);
}



/**
 *  function writeTableHeaderVertColumn
 *  writes table header for specified column headings
 *  columns with index after firstVertColIdx are printed vertically
 *  @param outfile     			file to write header to
 *  @param colHeadings		 	array with column headings
 *  @param fontSize    			font size
 *  @param firstVertColIdx  index of first column to write vertically
 */
function writeTableHeaderVert(outfile, colHeadings, fontSize, firstVertColIdx)
{
  writeTableHeaderVertWithColor(outfile, colHeadings, fontSize, firstVertColIdx, Constants.C_TRANSPARENT, Constants.C_BLACK)
}

function writeTableHeaderVertWithColor(outfile, colHeadings, fontSize, firstVertColIdx, backColor, textColor)
{
    outfile.TableRow();
    
    var colWidth_default = Math.round((100.0 / colHeadings.length) - 0.5);
    var colSum = 0;
    var colWidth = 0;
    
    var nDefaultFlags = Constants.FMT_BOLD | Constants.FMT_LEFT | Constants.FMT_VTOP;
    for(var i = 0; i < colHeadings.length; i++) {
        var nFlags = (i<firstVertColIdx) ? nDefaultFlags : (nDefaultFlags | Constants.FMT_VERT_UP);

        if (i < colHeadings.length - 1) {
            colWidth = colWidth_default;
        } else {
            colWidth = 100 - colSum;
        }
        outfile.TableCell(colHeadings[i], colWidth, "Arial", fontSize, textColor, backColor, 0, nFlags, 0);
        colSum = colSum + colWidth;
    }
}


/**
 *  function writeTableHeaderWidths
 *  writes table header for specified column headings and widths
 *  @param outfile     file to write header to
 *  @param colHeadings array with column headings
 *  @param colWidths   array with column widths
 *  @param fontSize    font size
 */
function writeTableHeaderWidths(outfile, colHeadings, colWidths, fontSize)
{
  outfile.TableRow();
 
  for(var i=0;i<colHeadings.length;i++)
    outfile.TableCell(colHeadings[i], colWidths[i], "Arial", fontSize, Constants.C_BLACK, Constants.C_TRANSPARENT, 0, Constants.FMT_BOLD | Constants.FMT_LEFT | Constants.FMT_VTOP, 0);
}

/**
 *  function getTableCellColor_Head
 *  gets color of table headlines
 */
function getTableCellColor_Head() {
    return COL_SAG_BLUE_1;
} 

/**
 *  function getTableCellColor_Bk
 *  gets color of table cell background (default: transparent)
 */
function getTableCellColor_Bk(p_bColored) {
    if (p_bColored)
        return COL_SAG_BLUE_2;
        
    return Constants.C_TRANSPARENT;    
} 

/**
 *  function getTableCellColor_Font
 *  gets color of table cell font (default: black)
 */
function getTableCellColor_Font(p_bColored) {
    if (p_bColored)
        return Constants.C_WHITE;

    return Constants.C_BLACK;    
}

/**
 *  function getTableCellColor_AttrBk
 *  gets color of table cell background (default: transparent)
 *  (for attribute output)
 */
function getTableCellColor_AttrBk(p_bColored) {
    if (p_bColored)
        return COL_SAG_GREY_1;
        
    return Constants.C_TRANSPARENT;    
} 

// Sets dialog value with value from config file
function ReadSettingsDlgValue(dlg, sSection, sField, nDefault) {
    dlg.setDlgValue(sField, Context.getProfileInt(sSection, sField, nDefault));
}

// Writes dialog value to config file
function WriteSettingsDlgValue(dlg, sSection, sField) {
    var nValue = dlg.getDlgValue(sField);
    if (nValue < 0) nValue = 0;                             // Anubis 363675
    Context.writeProfileInt(sSection, sField, nValue);
}

// Sets dialog text with text from config file
function ReadSettingsDlgText(dlg, sSection, sField, sDefault) {
    dlg.setDlgText(sField, Context.getProfileString(sSection, sField, sDefault));
}

// Writes dialog text to config file
function WriteSettingsDlgText(dlg, sSection, sField) {
    Context.writeProfileString(sSection, sField, dlg.getDlgText(sField));
}

// Sets index of dialog list box by number from config file 
function ReadSettingsListBoxByNumber(dlg, sSection, sField, nDefault, aList) {
    var nIndex = 0;
    var nValue = Context.getProfileInt(sSection, sField, nDefault);
    for (var i = 0 ; i < aList.length ; i++ ) {
        if (nValue == aList[i])  {
            nIndex = i;
            break;
        }
    }
    dlg.setDlgValue(sField, nIndex);    
}

// Writes value of dialog list box to config file
function WriteSettingsListBoxByNumber(dlg, sSection, sField, aList) {
    var nValue = aList[dlg.getDlgValue(sField)];
    if (nValue != null) Context.writeProfileInt(sSection, sField, nValue);
}

// Sets index of dialog list box by string from config file
function ReadSettingsListBoxByString(dlg, sSection, sField, sDefault, aList) {
    var nIndex = 0;
    var sValue = Context.getProfileString(sSection, sField, sDefault);
    for (var i = 0 ; i < aList.length ; i++ ) {
        if (StrComp(sValue, aList[i]) == 0)  {
            nIndex = i;
            break;
        }
    }
    dlg.setDlgValue(sField, nIndex);    
}

// Writes value of dialog list box to config file
function WriteSettingsListBoxByString(dlg, sSection, sField, aList) {
    var sValue = aList[dlg.getDlgValue(sField)];
    if (sValue != null) Context.writeProfileString(sSection, sField, sValue);
}

// Returns an array with the specified and user-defined model type numbers
function getModelTypesIncludingUserDefined(p_nOrgModelTypeNum) {
    var aModelTypes = new Array();
    aModelTypes.push(p_nOrgModelTypeNum);
    
    if (!ArisData.getActiveDatabase().ActiveFilter().isUserDefinedModelType(p_nOrgModelTypeNum)) {
        var aUserdefModelTypes = ArisData.getActiveDatabase().ActiveFilter().getUserDefinedModelTypes(p_nOrgModelTypeNum);
        for (var i = 0; i < aUserdefModelTypes.length; i++) {    
            aModelTypes.push(aUserdefModelTypes[i]);
        }
    }
    return aModelTypes;
}

// Returns an array with the specified and user-defined symbol numbers
function getSymbolsIncludingUserDefined(p_nOrgSymbolNum) {
    var aSymbols = new Array();
    aSymbols.push(p_nOrgSymbolNum);
    
    if (!ArisData.getActiveDatabase().ActiveFilter().isUserDefinedSymbol(p_nOrgSymbolNum)) {
        var aUserdefSymbols = ArisData.getActiveDatabase().ActiveFilter().getUserDefinedSymbols(p_nOrgSymbolNum);
        for (var i = 0; i < aUserdefSymbols.length; i++) {    
            aSymbols.push(aUserdefSymbols[i]);
        }
    }
    return aSymbols;
}

/***************************************************************************************************************
 ****************************************  Semanticheck functions **********************************************
 *  - Information Marks
 *  - Improvement Proposals
 *  - Statistic
 ***************************************************************************************************************/

var cDUMMY_OID = "00####0#####0##";

/*
    mapOCCURENCES;
    
    key   = Object GUID
    value = List of occurences
*/
 
function semCheck_setOccurences(mapOCCURENCES, oObj, oOccList) {
    var key = oObj.GUID();
    var value = oOccList;
    
    if (mapOCCURENCES.containsKey(key)) {
        value = value.concat(mapOCCURENCES.get(key));
    }
    mapOCCURENCES.put(key, value); 
}
 
function semCheck_getOccurences(mapOCCURENCES, oObjDef) {
    var key = oObjDef.GUID();
    
    if (mapOCCURENCES.containsKey(key)) {
        return mapOCCURENCES.get(key);
    }
    return new Array();
}

/*
    mapINFOMARKS:
    
	key   = Model GUID
	value = HashMap: key   = OID of (wrong) occurrence (*)
                     value = error texts
                     
    (*) This is the OID of the object or cxn occurrence in the model, which should be marked, 
        or a dummy OID (= "00####0#####0##") in case of infomarks of models.                     
*/

function semCheck_setInfoMark(mapINFOMARKS, mapOCCURENCES, oObject, sError) {
    var oOccList = new Array();
    var bIsModel = false;
    
    switch(oObject.KindNum()) {
        case Constants.CID_OBJOCC:
        case Constants.CID_CXNOCC:            
        oOccList.push(oObject);
        break;
        case Constants.CID_OBJDEF:
        case Constants.CID_CXNDEF:            
        oOccList = semCheck_getOccurences(mapOCCURENCES, oObject);
        break;
        case Constants.CID_MODEL:
        bIsModel = true;
        break;
    }
    if (bIsModel) {
        var key1 = oObject.GUID();      // oObject = Model
        var key2 = cDUMMY_OID;
        
        semCheck_setInfoMark2(mapINFOMARKS, key1, key2, sError);
        
    } else {
        for (var i = 0; i < oOccList.length; i++) {
            var oOcc = oOccList[i];
            var key1 = oOcc.Model().GUID();
            var key2 = oOcc.ObjectID();
            
            semCheck_setInfoMark2(mapINFOMARKS, key1, key2, sError);
        }
    }
    
    function semCheck_setInfoMark2(mapINFOMARKS, key1, key2, sError) {
        var value1;                     // = inner HashMap
        var value2 = sError;
        
        if (mapINFOMARKS.containsKey(key1)) {
            value1 = mapINFOMARKS.get(key1);
            if (value1.containsKey(key2)) {
                value2 = value1.get(key2) + "\n" + value2;
            } 
        } else {
            value1 = new java.util.HashMap();
        }
        value1.put(key2, value2);        
        mapINFOMARKS.put(key1, value1); 
    }
}

function semCheck_initInfoMark(mapINFOMARKS, oModels) {
    for (var i = 0; i < oModels.length; i++) {     
        if (oModels[i].KindNum() == Constants.CID_MODEL) {
            var key1 = oModels[i].GUID();
            if (!mapINFOMARKS.containsKey(key1)) {
                mapINFOMARKS.put(key1, new java.util.HashMap());     
            }
        }
    }
}

function semCheck_outInfoMarks(mapINFOMARKS) {

    var property = Context.getProperty("semcheckInfoMarks");
    if (property == null) return;
    if (StrComp(property, "true") != 0) return;

    var nLocale = Context.getSelectedLanguage();
    var oDB = ArisData.getActiveDatabase();        
    
    var modelSet = mapINFOMARKS.keySet(); 
    var iter = modelSet.iterator();
    while (iter.hasNext()) {
        var key = iter.next();
        var value = mapINFOMARKS.get(key);
        
        var oModel = oDB.FindGUID(key, Constants.CID_MODEL);
        oModel.OpenModel(nLocale, true);
        oModel.ClearError();
        
        var occSet = value.keySet();
        var iter2 = occSet.iterator();
        while (iter2.hasNext()) {
            var key2 = iter2.next();
            var value2 = new String(value.get(key2));
            value2 = "<html>" + value2.replace(/\n/g, "<br>") + "</html>"
            
            if (StrComp(key2, cDUMMY_OID) != 0) {
                var oOcc = oDB.FindOID(key2);
                oModel.ShowError(oOcc, value2);
            } else {
                // Show errors of model (todo)
                /*oModel.ShowError(oModel, value2);*/
            }
        }
    }                
}    

/*
    mapPROPOSALS;
    
    key   = Model or object GUID
    value = error texts
*/

function semCheck_setProposal(mapPROPOSALS, oItem, sError) {
    var key = oItem.GUID();
    var value = sError;
    
    if (mapPROPOSALS.containsKey(key)) {
        value = mapPROPOSALS.get(key) + "\n" + value;
    }
    mapPROPOSALS.put(key, value); 
}
 
function semCheck_outProposals(mapPROPOSALS) {
    
    var property = Context.getProperty("semcheckProposals");
    if (property == null) return;
    if (StrComp(property, "true") != 0) return;
    
    var nLocale = Context.getSelectedLanguage();
    var oDB = ArisData.getActiveDatabase();
    var sUser = oDB.ActiveUser().Name(nLocale);
    var sDate = java.text.DateFormat.getDateTimeInstance().format(new java.util.Date());
    
    var itemSet = mapPROPOSALS.keySet(); 
    var iter = itemSet.iterator();
    while (iter.hasNext()) {
        var key = iter.next();
        var value = mapPROPOSALS.get(key);
        
        var oItem = oDB.FindGUID(key);
        var oAttr = oItem.Attribute(Constants.AT_IMPROVE, nLocale);
        if (oAttr.IsValid()) {
            var sProposal = "\n" + sUser + "/" + sDate + "\n" + value;
            oAttr.setValue(oAttr.getValue() + sProposal);
        }
        // Anubis 333713        
        var oAttr = oItem.Attribute(Constants.AT_STATUS, nLocale);
        if (oAttr.IsValid() && !oAttr.IsMaintained()) {
            oAttr.setValue(oDB.ActiveFilter().AttrValueType(Constants.AVT_NOT_ASSIGN));
        }
        // BLUE-4758
        oAttr = oItem.Attribute(Constants.AT_RESPON, nLocale);
        if (oAttr.IsValid() && !oAttr.IsMaintained()) {
            oAttr.setValue(ArisData.getActiveUser().Name(0));
        }
    }                
}       

/*
    mapSTATISTIC:

	key   = RuleType GUID
	value = HashMap: key   = Rule GUID
                     value = HashMap: key   = Model or object GUID
                                      value = Number of errors (*)

    (*) The number of errors is initialized with '-1'. This value means, 
        that this rule couldn't be evaluated with this model/object.
*/

function semCheck_initStatistic(mapSTATISTIC, sRuleTypeGuid, sRuleGuid, oItemList) {
    for (var i = 0; i < oItemList.length; i++) {    
        semCheck_setStatistic(mapSTATISTIC, sRuleTypeGuid, sRuleGuid, oItemList[i], -1);
    }
}
 
function semCheck_setStatistic(mapSTATISTIC, sRuleTypeGuid, sRuleGuid, oItem, nError) {
    var key1 = sRuleTypeGuid;
    var value1; // = inner HashMap
    var key2 = sRuleGuid;
    var value2; // = inner HashMap (2.)
    var key3 = oItem.GUID();
    var value3 = nError;
    
    if (mapSTATISTIC.containsKey(key1)) {
        var value1 = mapSTATISTIC.get(key1);    // = inner HashMap
        if (value1.containsKey(key2)) {
            value2 = value1.get(key2);          // = inner HashMap (2.)
        } else {
            value2 = new java.util.LinkedHashMap();     // BLUE-17157
        }
    } else {
        value2 = new java.util.LinkedHashMap();         // BLUE-17157
        value1 = new java.util.LinkedHashMap();         // BLUE-17157            
    }
    value2.put(key3, new java.lang.Integer(value3));
    value1.put(key2, value2);
    mapSTATISTIC.put(key1, value1); 
} 

function semCheck_outStatistic(mapSTATISTIC, mapRULEKINDNAMES, outputObject, aStrings) {

    function semCheck_ITEM(p_sGuid, p_nIndex) {
        this.sGuid = p_sGuid;
        this.nIndex = p_nIndex;
        return this;
    }

    function semCheck_STATISTIC(p_sRuleName) {
        this.sRuleName = p_sRuleName;
        this.entries = new Array();
        return this;
    }

    var property = Context.getProperty("semcheckStatistics");
    if (property == null) return;
    if (StrComp(property, "true") != 0) return;

    outputObject.BeginTable(100, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_LEFT, 0);
    outputObject.TableRow();            
    outputObject.TableCell(aStrings[1], 100, aStrings[0], 12, Constants.C_BLACK, Constants.C_GREY_80_PERCENT, 0, Constants.FMT_LEFT | Constants.FMT_VTOP | Constants.FMT_EXCELMODIFY, 0);
    
    var nLocale = Context.getSelectedLanguage();
    var oDB = ArisData.getActiveDatabase();
    
    var ruleKindSet = mapSTATISTIC.keySet(); 
    var iter = ruleKindSet.iterator();
    while (iter.hasNext()) {
        var key = iter.next();
        var value = mapSTATISTIC.get(key);
        
        outputObject.TableRow()            
        outputObject.TableCell("", 100, aStrings[0], 10, Constants.C_BLACK, Constants.C_TRANSPARENT, 0, Constants.FMT_LEFT | Constants.FMT_EXCELMODIFY, 0);
        outputObject.TableRow();
        outputObject.TableCell(semCheck_getRuleKindName(mapRULEKINDNAMES, key), 100, aStrings[0], 12, Constants.C_BLACK, Constants.C_GREY_80_PERCENT, 0, Constants.FMT_LEFT | Constants.FMT_VTOP | Constants.FMT_EXCELMODIFY, 0);
        
        var aItems = semCheck_getItemsOfRule(value);
        var aStatistic = semCheck_getStatisticOfRule(key, value);
        
        var nMaxCount = 10;
        var nItemCount = aItems.length;
        if (Context.getSelectedFormat() == Constants.OutputXLS || Context.getSelectedFormat() == Constants.OutputXLSX) nMaxCount = 254;
        
        // Cell size
        var nCellWidth;
        var nFirstCellWidth;
        if (nItemCount < nMaxCount) {
            nCellWidth = numcut(60 / nItemCount);
            nFirstCellWidth = 100 - (nCellWidth * nItemCount);
        } else {
            nCellWidth = numcut(60 / nMaxCount);
            nFirstCellWidth = 100 - (nCellWidth * nMaxCount);
        }
        
        var nStart = 0;
        var nEnd = 0;
        if (nItemCount < nMaxCount) {
            nEnd = nItemCount;
        } else {
            nEnd = nStart + nMaxCount;
        }
        
        while (nStart < nItemCount) {
            if (nStart > 0) {
                outputObject.TableRow()            
                outputObject.TableCell("", 100, aStrings[0], 10, Constants.C_BLACK, Constants.C_TRANSPARENT, 0, Constants.FMT_LEFT | Constants.FMT_EXCELMODIFY, 0);
            }
            outputObject.TableRow();
            outputObject.TableCell(aStrings[2], nFirstCellWidth, aStrings[0], 10, Constants.C_BLACK, Constants.C_GRAY, 0, Constants.FMT_BOLD | Constants.FMT_LEFT | Constants.FMT_EXCELMODIFY, 0);
            
            // table header
            for (var j = nStart; j < nEnd; j++) {
                outputObject.TableCell(aItems[j].nIndex.toString(), nCellWidth, aStrings[0], 10, Constants.C_BLACK, Constants.C_GRAY, 0, Constants.FMT_BOLD | Constants.FMT_CENTER | Constants.FMT_EXCELMODIFY, 0);
            }
            // table body
            for (var i = 0; i < aStatistic.length; i++) {
                outputObject.TableRow();
                outputObject.TableCell(aStatistic[i].sRuleName, nFirstCellWidth, aStrings[0], 10, Constants.C_BLACK, Constants.C_TRANSPARENT, 0, Constants.FMT_LEFT | Constants.FMT_EXCELMODIFY, 0);
                
                for (var j = nStart; j < nEnd; j++) {
                    outputObject.TableCell(aStatistic[i].entries[j], nCellWidth, aStrings[0], 10, Constants.C_BLACK, Constants.C_TRANSPARENT, 0, Constants.FMT_CENTER | Constants.FMT_EXCELMODIFY, 0);
                }
            }
            nStart = nEnd;
            if (nItemCount < nStart + nMaxCount) {
                nEnd = nItemCount;
            } else {
                nEnd = nStart + nMaxCount;
            }
        }
        // legend        
        outputObject.TableRow()            
        outputObject.TableCell("", 100, aStrings[0], 10, Constants.C_BLACK, Constants.C_TRANSPARENT, 0, Constants.FMT_LEFT | Constants.FMT_EXCELMODIFY, 0);
        outputObject.TableRow()            
        outputObject.TableCell(aStrings[3], 10, aStrings[0], 10, Constants.C_BLACK, Constants.C_GRAY, 0, Constants.FMT_LEFT | Constants.FMT_EXCELMODIFY, 0);
        outputObject.TableCell(aStrings[4], 30, aStrings[0], 10, Constants.C_BLACK, Constants.C_GRAY, 0, Constants.FMT_LEFT | Constants.FMT_EXCELMODIFY, 0);        
        outputObject.TableCell(aStrings[5], 30, aStrings[0], 10, Constants.C_BLACK, Constants.C_GRAY, 0, Constants.FMT_LEFT | Constants.FMT_EXCELMODIFY, 0);                      
        outputObject.TableCell(aStrings[6], 30, aStrings[0], 10, Constants.C_BLACK, Constants.C_GRAY, 0, Constants.FMT_LEFT | Constants.FMT_EXCELMODIFY, 0);                      
        
        for (var i = 0; i < aItems.length; i++) {            
            outputObject.TableRow()            
            outputObject.TableCell(aItems[i].nIndex.toString(), 10, aStrings[0], 10, Constants.C_BLACK, Constants.C_TRANSPARENT, 0, Constants.FMT_LEFT | Constants.FMT_VTOP | Constants.FMT_EXCELMODIFY, 0);
            var oItem = oDB.FindGUID(aItems[i].sGuid)
            outputObject.TableCell(oItem.Name(nLocale), 30, aStrings[0], 10, Constants.C_BLACK, Constants.C_TRANSPARENT, 0, Constants.FMT_LEFT | Constants.FMT_VTOP | Constants.FMT_EXCELMODIFY, 0);        
            outputObject.TableCell(oItem.Type(), 30, aStrings[0], 10, Constants.C_BLACK, Constants.C_TRANSPARENT, 0, Constants.FMT_LEFT | Constants.FMT_VTOP | Constants.FMT_EXCELMODIFY, 0);                      
            outputObject.TableCell(oItem.Group().Path(nLocale), 30, aStrings[0], 10, Constants.C_BLACK, Constants.C_TRANSPARENT, 0, Constants.FMT_LEFT | Constants.FMT_VTOP | Constants.FMT_EXCELMODIFY, 0);                      
        }
    }
    outputObject.EndTable(semCheck_getTabName(aStrings[1]), 100, aStrings[0], 10, Constants.C_BLACK, Constants.C_TRANSPARENT, 0, Constants.FMT_LEFT | Constants.FMT_VTOP, 0);   // BLUE-11813
    
    function semCheck_getStatisticEntry(itemKey, itemMap) {
        if (!itemMap.containsKey(itemKey)) 
            return "";
        var value = itemMap.get(itemKey);
        if (value < 0) 
            return "-";
        return value.toString();
    }
    
    function semCheck_getItemsOfRule(ruleMap) {
        var aItems = new Array();
        var nIndex = 1;
        
        ruleSet = ruleMap.keySet();
        var ruleIter = ruleSet.iterator();
        while (ruleIter.hasNext()) {
            var ruleKey = ruleIter.next();
            var itemMap = ruleMap.get(ruleKey);
            
            var itemSet = itemMap.keySet();
            var itemIter = itemSet.iterator();
            while (itemIter.hasNext()) {
                var itemKey = itemIter.next();
                
                if (!semCheck_IsGuidInList(itemKey, aItems))
                    aItems.push(new semCheck_ITEM(itemKey, new java.lang.Integer(nIndex)))
                nIndex++;
            }
        }
        return aItems;

        function semCheck_IsGuidInList(sGuid, aItems) {
            for (var i = 0; i < aItems.length; i++) {
                if (StrComp(sGuid, aItems[i].sGuid) == 0) {
                    return true;
                }
            }
            return false;
        }
    }
    
    function semCheck_getStatisticOfRule(ruleKindKey, ruleMap) {
        var aStatistic = new Array();
        
        ruleSet = ruleMap.keySet();
        var ruleIter = ruleSet.iterator();
        while (ruleIter.hasNext()) {
            var ruleKey = ruleIter.next();
            var itemMap = ruleMap.get(ruleKey);
            
            aStatistic.push(new semCheck_STATISTIC(getConfiguration("" + ruleKindKey).getRuleName(ruleKey)))
            
            var itemSet = itemMap.keySet();
            var itemIter = itemSet.iterator();
            while (itemIter.hasNext()) {
                var itemKey = itemIter.next();
                
                aStatistic[aStatistic.length-1].entries.push(semCheck_getStatisticEntry(itemKey, itemMap));
            }
        }
        return aStatistic;
    }
    
    function semCheck_getRuleKindName(rulekindMap, key) {
        if (!rulekindMap.containsKey(key)) {
            return "";
        }
        return rulekindMap.get(key);
    }
}

function semCheck_outErrorProperties(sRuleKindID, sName) {
    Context.setProperty("semcheckError", "true");
    Context.setProperty("semcheckError_" + sRuleKindID, sName);
}

// Filters the items with the selected context type nums 
function semCheck_getFilteredSelection(selection) {
    if (selection.length == 0) {
        return selection;
    }
    return semCheck_getFilteredItems(selection);
    
    // Filters the items with the specific type nums
    function semCheck_getFilteredItems(aItems) {
        var nKindNum = aItems[0].KindNum();
        var aTypeNums = Context.getDefinedItemTypes(nKindNum);
        
        if (aTypeNums.length == 0 || (aTypeNums.length == 1 && aTypeNums[0] == -1)) {
            // All/None type nums selected
            return aItems;
        }
        
        var setTypeNums = new java.util.HashSet();
        for (var i = 0; i < aTypeNums.length; i++) {
            setTypeNums.add(java.lang.Integer.valueOf(aTypeNums[i]));
        }
        
        var aFilteredItems = new Array();
        for (var i = 0; i < aItems.length; i++) {
            var aItem = aItems[i];
            if (setTypeNums.contains(java.lang.Integer.valueOf(aItem.TypeNum()))) {
                aFilteredItems.push(aItem);
            } else {
                // BLUE-15171 Include derived model types
                if ( aItem.KindNum() == Constants.CID_MODEL && setTypeNums.contains(java.lang.Integer.valueOf(aItem.OrgModelTypeNum())) ) {
                    aFilteredItems.push(aItem);
                }
            }            
        }
        return aFilteredItems;
    }    
}

function semCheck_getTabName(sTabName) {    // BLUE-11813
    if (Context.getSelectedFormat() != Constants.OutputXLS && Context.getSelectedFormat() != Constants.OutputXLSX) return "";
    
    sTabName = "" + replaceNotAllowedChars(sTabName);
    if (sTabName.length > 31) sTabName = sTabName.substr(0,28) + "...";     
    return sTabName;

    function replaceNotAllowedChars(sTabName) {
        var aForbidden = new Array(":", "/", "\\", "*", "?", "[", "]");
        var sReplacement = "_";

        var sTabName = ""+sTabName;
        for (var i in aForbidden) {
            var sPattern = ""+aForbidden[i];
            for(;;) {
                var idx = sTabName.indexOf(sPattern); 
                if (idx < 0) break;                

                var sTmp = sTabName.substr(0,idx) + sReplacement + sTabName.substr(idx+sPattern.length);
                sTabName = sTmp;
            }
        }
        return sTabName;
    }
}

/***************************************************************************************************************
 ****************************************  Namespace "ATSALL"  *************************************************
 *  isGuid()
 ***************************************************************************************************************/

var ATSALL = function() {
    
    // Checks, whether it's a GUID
    function isGuid(p_sGuid) {
        var sGuid = new String(p_sGuid);
        if (sGuid.length != 36) return false;
        if (sGuid.charAt(8)  != '-') return false;
        if (sGuid.charAt(13) != '-') return false;
        if (sGuid.charAt(18) != '-') return false;
        if (sGuid.charAt(23) != '-') return false;    
        return true;
    }
    
    return {
//      'key': function,
        'isGuid' : isGuid
    }
}();


/***************************************************************************************************************/


/***************************************************************************************************************
 *************************************  Namespace "SAG_INTERNAL"  **********************************************

 * DO NOT USE IN CUSTOMIZED SCRIPTS * DO NOT MODIFY * CAN BE CHANGED OR REMOVED BY SOFTWARE AG AT ANY TIME *
 
 * hasConfiguration() 
 * getInventoryCxns(oObjOcc, aCxnTypes, cxnKind) 
 * getInventoryObjects(oObjOcc, aObjTypes)
 * getOppositeObject(cxnDef, objDef)
 * isOcc(object)
 * getDef(object)
 * getSource(oCxn)
 * getTarget(oCxn)
 * getOrgSymbol(object)
 ***************************************************************************************************************/

var SAG_INTERNAL = {

    hasConfiguration: function() {
        if (Context.getEnvironment() == Constants.ENVIRONMENT_BP) {
            return false;
        }
        return ArisData.hasPropertyConfigSupport();
    },
    
    getInventoryCxns: function(/*oObjOcc, aCxnTypes, cxnKind*/) {
        var oObjOcc = arguments[0];
        var cxnKind = arguments.length > 2 ? arguments[2] : Constants.EDGES_INOUT;
        
        var inventoryCxns = internal_getCxnsWithInventoryFlag(oObjOcc, cxnKind);
        
        if (arguments.length == 1) {
            return inventoryCxns;
        }
        var aCxnTypes = arguments[1];
        return internal_filterByType(inventoryCxns, aCxnTypes);
    },
    
    getInventoryObjects: function(/*oObjOcc, aObjTypes*/) {
        var oObjOcc = arguments[0];
        var inventoryObjects = internal_getObjectsWithInventoryFlag(oObjOcc);
        
        if (arguments.length == 1) {
            return inventoryObjects;        
        }
        var aObjTypes = arguments[1];
        return internal_filterByType(inventoryObjects, aObjTypes);
    },
    
    getOppositeObject: function(cxnDef, objDef) {
        return internal_getOppositeObjDef(cxnDef, objDef);
    },
    
    isOcc: function(object) {
        return internal_isOcc(object);
    },
    
    getDef: function(object) {
        if (object.KindNum() == Constants.CID_OBJOCC) return object.ObjDef();
        if (object.KindNum() == Constants.CID_CXNOCC) return object.CxnDef();
        return object;
    },
    
    getSource: function(oCxn) {
        if (internal_isOcc(oCxn)) {
            return oCxn.SourceObjOcc();
        }
        return oCxn.SourceObjDef();
    },
    
    getTarget: function(oCxn) {
        if (internal_isOcc(oCxn)) {
            return oCxn.TargetObjOcc();
        }
        return oCxn.TargetObjDef();
    },
    
    getOrgSymbol: function(object) {
        if (internal_isOcc(object)) {
            return object.OrgSymbolNum();
        }
        return object.getDefaultSymbolNum();
    }
}

function internal_getCxnsWithInventoryFlag(oObjOcc, cxnKind) {
    var result = ArisData.createTypedArray();
    var cxns = oObjOcc.ObjDef().CxnList(cxnKind);
    for (var i=0; i<cxns.length; i++) {
        var cxn = cxns[i];
        if (cxn.isInventoryCxn() && internal_hasNoOccInModel(cxn, oObjOcc.Model())) {
            result.push(cxn);
        }
    }
    return result;
}

function internal_getObjectsWithInventoryFlag(oObjOcc) {
    var result = ArisData.createTypedArray();
    var cxns = internal_getCxnsWithInventoryFlag(oObjOcc, Constants.EDGES_INOUT);
    for (var i=0; i<cxns.length; i++) {
        var cxn = cxns[i];
        var oppositeObjDef = internal_getOppositeObjDef(cxn, oObjOcc.ObjDef());
        if (internal_hasNoOccInModel(oppositeObjDef, oObjOcc.Model())) {
            result.push(oppositeObjDef);    
        }
    }
    return ArisData.Unique(result);
}

function internal_filterByType(itemList, types) {
    if (types == null) {
        return itemList;
    }
    var filteredItems = new Array();
    for (var i=0; i<itemList.length; i++) {
        var item = itemList[i];
        var itemType = item.TypeNum();
        for (var t=0; t<types.length; t++) {
            if (itemType == types[t]) {
                filteredItems.push(item);
            }
        }
    }
    return filteredItems;
}

function internal_hasNoOccInModel(item, oModel) {
    return item.OccList([oModel]).length == 0;
}

function internal_getOppositeObjDef(cxnDef, objDef) {
    if (cxnDef.TargetObjDef().IsEqual(objDef)) {
        return cxnDef.SourceObjDef();
    } 
    return cxnDef.TargetObjDef();    
}

function internal_isOcc(object) {
    return (object.KindNum() == Constants.CID_OBJOCC || object.KindNum() == Constants.CID_CXNOCC);
}

/***************************************************************************************************************/
