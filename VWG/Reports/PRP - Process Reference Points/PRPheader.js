/**
 *  function setReportHeaderFooterPPM customized
 *  set report header and footer settings
 *  @param outfile  					output file
 *  @param nloc     					locale
 *  @param bDisplayServer			flag for writing server name
 *  @param bDisplayDatabase		flag for writing database name
 *  @param bDisplayUser				flag for writing user name
 */
function setReportHeaderFooterPRP(outfile, nloc, bDisplayServer, bDisplayDatabase, bDisplayUser) {
	var ocurrentuser = null; // Current user.
	// graphics used in header
	var pictleft = null;
	var pictright = null;
	//  pictleft  = Context.createPicture(Constants.IMAGE_LOGO_LEFT);
	pictright = Context.createPicture("VWAGLogo_PS.png");
	// pictright = Context.createPicture(Constants.IMAGE_LOGO_RIGHT);
	// header + footer settings
	outfile.BeginHeader();
	outfile.BeginTable(100, Constants.C_TRANSPARENT, Constants.C_TRANSPARENT, Constants.FMT_LEFT, 0);
	outfile.TableRow();
	outfile.TableCell(getString("TEXT_NAME") , 74, "Arial", 12, Constants.C_BLACK, Constants.C_TRANSPARENT, 0, Constants.FMT_LEFT | Constants.FMT_VCENTER | Constants.FMT_BOLD, 0);
	outfile.TableCell("", 26, "Arial", 12, Constants.C_BLACK, Constants.C_TRANSPARENT, 0, Constants.FMT_CENTER | Constants.FMT_VCENTER, 0);
	
    outfile.OutGraphic(pictright, -1, 40, 15);
	//outfile.OutputLn(" ", "Arial", 10, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_CENTER, 0);
	// outfile.Output(getString("TEXT_COMPANY"), "Arial", 9, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_CENTER, 0);
	outfile.EndTable("", 100, "Arial", 10, Constants.C_BLACK, Constants.C_TRANSPARENT, 0, Constants.FMT_LEFT | Constants.FMT_VTOP, 0);
	outfile.EndHeader();
	outfile.BeginFooter();
	outfile.BeginTable(100, Constants.C_TRANSPARENT, Constants.C_TRANSPARENT, Constants.FMT_LEFT, 0); //Constants.C_BLACK color of border
	outfile.TableRow();
	outfile.TableCell(getString("TEXT_FOOTHER"), 26, getString("TEXT_FONT_DEFAULT"), 10, Constants.C_BLACK, Constants.C_TRANSPARENT, 0, Constants.FMT_CENTER | Constants.FMT_VCENTER, 0);
	outfile.TableCell("", 48,  getString("TEXT_FONT_DEFAULT"), 10, Constants.C_BLACK, Constants.C_TRANSPARENT, 0, Constants.FMT_CENTER | Constants.FMT_VCENTER, 0);
	    
    //new date format
    var formatterStatus = new Packages.java.text.SimpleDateFormat("dd.MM.yyyy HH:MM");
    date = formatterStatus.format(new Date());
    outfile.Output(date, getString("TEXT_FONT_DEFAULT"), 10, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_CENTER, 0);
	
    //outfile.OutputField(Constants.FIELD_DATE, getString("TEXT_FONT_DEFAULT"), 10, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_CENTER);
	//outfile.Output(" ", "Arial", 10, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_CENTER, 0);
	//outfile.OutputField(Constants.FIELD_TIME, getString("TEXT_FONT_DEFAULT"), 10, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_CENTER);
	//outfile.TableCell((Context.getSelectedPath() + Context.getSelectedFile()), 48, "Arial", 10, Constants.C_BLACK, Constants.C_TRANSPARENT, 0, Constants.FMT_CENTER | Constants.FMT_VCENTER, 0);
	outfile.TableCell("", 26, getString("TEXT_FONT_DEFAULT"), 10, Constants.C_BLACK, Constants.C_TRANSPARENT, 0, Constants.FMT_CENTER | Constants.FMT_VCENTER, 0);
	outfile.Output(getString("TEXT_PAGE"), getString("TEXT_FONT_DEFAULT"), 10, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_CENTER, 0);
	outfile.OutputField(Constants.FIELD_PAGE, "Arial", 10, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_CENTER);
	outfile.Output(getString("TEXT_PAGES_FROM"), getString("TEXT_FONT_DEFAULT"), 10, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_CENTER, 0);
	outfile.OutputField(Constants.FIELD_NUMPAGES, getString("TEXT_FONT_DEFAULT"), 10, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_CENTER);
	outfile.EndTable("", 100, getString("TEXT_FONT_DEFAULT"), 10, Constants.C_BLACK, Constants.C_TRANSPARENT, 0, Constants.FMT_LEFT | Constants.FMT_VTOP, 0);
	outfile.EndFooter();
	/*
	  // Headline
	  outfile.OutputLnF("", "REPORT1");
	  outfile.OutputLnF("Sestava", "REPORT1");
	  outfile.OutputLnF("", "REPORT1");
	*/
	// Information header (if enabled) 
	if (bDisplayServer) outfile.OutputLnF(("Server: " + ArisData.getActiveDatabase().ServerName()), "REPORT2");
	if (bDisplayDatabase) outfile.OutputLnF(("Database: " + ArisData.getActiveDatabase().Name(nloc)), "REPORT2");
	if (bDisplayUser) outfile.OutputLnF(("User: " + ArisData.getActiveUser().Name(nloc)), "REPORT2");
	if (bDisplayServer || bDisplayDatabase || bDisplayUser) outfile.OutputLnF("", "REPORT2");
}