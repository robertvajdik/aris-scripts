/* wdxLibrary.js
 * this library provides functions to create .docx report files from ARIS Platform products
 * Copyright (c) 2017 Nikita Martyanov
 * https://github.com/kitmarty/wdxLibrary
 */

var x2006 = JavaImporter(Packages.org.openxmlformats.schemas.wordprocessingml.x2006.main);
var schemasMicrosoftComOfficeOffice = JavaImporter(Packages.schemasMicrosoftComOfficeOffice);
var schemasMicrosoftComVml = JavaImporter(Packages.schemasMicrosoftComVml);

var wdxCounter = {
    FOOTNOTES:          0,
    ENDNOTES:           0,
    FOOTERS:            0,
    HEADERS:            0,
    IMAGES_ID:          0,
    IMAGES_FILE:        0,
    EMBED_FILE:         0,
    BOOKMARK:           0,
    RUN:                0,
    PARAGRAPH:          0,
    SECTION:            0,
    NUMBERING:          0,
    ABSTRACT_NUMBERING: 0
};

var wdxConstants = {
    SCR_SUPERSCRIPT:                x2006.STVerticalAlignRun.SUPERSCRIPT,
    SCR_SUBSCRIPT:                  x2006.STVerticalAlignRun.SUBSCRIPT,
    SCR_BASELINE:                   x2006.STVerticalAlignRun.BASELINE,

    ALIGN_LEFT:                     x2006.STJc.LEFT,
    ALIGN_RIGHT:                    x2006.STJc.RIGHT,
    ALIGN_JUSTIFY:                  x2006.STJc.BOTH,
    ALIGN_CENTER:                   x2006.STJc.CENTER,

    V_ALIGN_AUTO:                   x2006.STTextAlignment.AUTO,
    V_ALIGN_BASELINE:               x2006.STTextAlignment.BASELINE,
    V_ALIGN_BOTTOM:                 x2006.STTextAlignment.BOTTOM,
    V_ALIGN_CENTER:                 x2006.STTextAlignment.CENTER,
    V_ALIGN_TOP:                    x2006.STTextAlignment.TOP,

    //TEXT_DIR_LR_TB:                 x2006.STTextDirection.LR_TB,
   // TEXT_DIR_TB_RL:                 x2006.STTextDirection.TB_RL,
    //TEXT_DIR_BT_LR:                 x2006.STTextDirection.BT_LR,
    //TEXT_DIR_LR_TB_V:               x2006.STTextDirection.LR_TB_V,
    //TEXT_DIR_TB_RL_V:               x2006.STTextDirection.TB_RL_V,
    //TEXT_DIR_TB_LR_V:               x2006.STTextDirection.TB_LR_V,

    UL_DASH:                        x2006.STUnderline.DASH,
    UL_DASH_DOT_DOT_HEAVY:          x2006.STUnderline.DASH_DOT_DOT_HEAVY,
    UL_DASH_DOT_HEAVY:              x2006.STUnderline.DASH_DOT_HEAVY,
    UL_DASH_LONG:                   x2006.STUnderline.DASH_LONG,
    UL_DASH_LONG_HEAVY:             x2006.STUnderline.DASH_LONG_HEAVY,
    UL_DASHED_HEAVY:                x2006.STUnderline.DASHED_HEAVY,
    UL_DOT_DASH:                    x2006.STUnderline.DOT_DASH,
    UL_DOT_DOT_DASH:                x2006.STUnderline.DOT_DOT_DASH,
    UL_DOTTED:                      x2006.STUnderline.DOTTED,
    UL_DOTTED_HEAVY:                x2006.STUnderline.DOTTED_HEAVY,
    UL_DOUBLE:                      x2006.STUnderline.DOUBLE,
    UL_NONE:                        x2006.STUnderline.NONE,
    UL_SINGLE:                      x2006.STUnderline.SINGLE,
    UL_THICK:                       x2006.STUnderline.THICK,
    UL_WAVE:                        x2006.STUnderline.WAVE,
    UL_WAVY_DOUBLE:                 x2006.STUnderline.WAVY_DOUBLE,
    UL_WAVY_HEAVY:                  x2006.STUnderline.WAVY_HEAVY,
    UL_WORDS:                       x2006.STUnderline.WORDS,

    HL_BLACK:                       x2006.STHighlightColor.BLACK,
    HL_BLUE:                        x2006.STHighlightColor.BLUE,
    HL_CYAN:                        x2006.STHighlightColor.CYAN,
    HL_GREEN:                       x2006.STHighlightColor.GREEN,
    HL_MAGENTA:                     x2006.STHighlightColor.MAGENTA,
    HL_RED:                         x2006.STHighlightColor.RED,
    HL_YELLOW:                      x2006.STHighlightColor.YELLOW,
    HL_WHITE:                       x2006.STHighlightColor.WHITE,
    HL_DARK_BLUE:                   x2006.STHighlightColor.DARK_BLUE,
    HL_DARK_CYAN:                   x2006.STHighlightColor.DARK_CYAN,
    HL_DARK_GREEN:                  x2006.STHighlightColor.DARK_GREEN,
    HL_DARK_MAGENTA:                x2006.STHighlightColor.DARK_MAGENTA,
    HL_DARK_RED:                    x2006.STHighlightColor.DARK_RED,
    HL_DARK_YELLOW:                 x2006.STHighlightColor.DARK_YELLOW,
    HL_DARK_GRAY:                   x2006.STHighlightColor.DARK_GRAY,
    HL_LIGHT_GRAY:                  x2006.STHighlightColor.LIGHT_GRAY,
    HL_NONE:                        x2006.STHighlightColor.NONE,

    BREAK_COLUMN:                   x2006.STBrType.COLUMN,
    BREAK_PAGE:                     x2006.STBrType.PAGE,
    BREAK_TEXT_WRAPPING:            x2006.STBrType.TEXT_WRAPPING,

    BREAK_ALL:                      x2006.STBrClear.ALL,
    BREAK_LEFT:                     x2006.STBrClear.LEFT,
    BREAK_NONE:                     x2006.STBrClear.NONE,
    BREAK_RIGHT:                    x2006.STBrClear.RIGHT,

    LN_SPACE_AUTO:                  x2006.STLineSpacingRule.AUTO,
    LN_SPACE_EXACT:                 x2006.STLineSpacingRule.EXACT,
    LN_SPACE_AT_LEAST:              x2006.STLineSpacingRule.AT_LEAST,

    NUMFMT_DECIMAL:                 x2006.STNumberFormat.DECIMAL,
    NUMFMT_UPPER_ROMAN:             x2006.STNumberFormat.UPPER_ROMAN,
    NUMFMT_LOWER_ROMAN:             x2006.STNumberFormat.LOWER_ROMAN,
    NUMFMT_UPPER_LETTER:            x2006.STNumberFormat.UPPER_LETTER,
    NUMFMT_LOWER_LETTER:            x2006.STNumberFormat.LOWER_LETTER,
    NUMFMT_BULLET:                  x2006.STNumberFormat.BULLET,

    //MULTI_LEVEL_TYPE_SINGLE:        x2006.STMultiLevelType.SINGLE_LEVEL,
    //MULTI_LEVEL_TYPE_MULTI:         x2006.STMultiLevelType.MULTILEVEL,
    //MULTI_LEVEL_TYPE_HYBRID:        x2006.STMultiLevelType.HYBRID_MULTILEVEL,

    HDR_FTR_DEFAULT:                x2006.STHdrFtr.DEFAULT,
    HDR_FTR_EVEN:                   x2006.STHdrFtr.EVEN,
    HDR_FTR_FIRST:                  x2006.STHdrFtr.FIRST,

    //SM_NEXT_PAGE:                   x2006.STSectionMark.NEXT_PAGE,
    //SM_NEXT_COLUMN:                 x2006.STSectionMark.NEXT_COLUMN,
    //SM_CONTINUOUS:                  x2006.STSectionMark.CONTINUOUS,
    //SM_EVEN_PAGE:                   x2006.STSectionMark.EVEN_PAGE,
    //SM_ODD_PAGE:                    x2006.STSectionMark.ODD_PAGE,

    BORDER_SINGLE:                  x2006.STBorder.SINGLE,
    BORDER_THICK:                   x2006.STBorder.THICK,
    BORDER_DOUBLE:                  x2006.STBorder.DOUBLE,
    BORDER_DOTTED:                  x2006.STBorder.DOTTED,
    BORDER_DASHED:                  x2006.STBorder.DASHED,
    BORDER_DOT_DASH:                x2006.STBorder.DOT_DASH,

    //TBL_LAYOUT_AUTOFIT:             x2006.STTblLayoutType.AUTOFIT,
    //TBL_LAYOUT_FIXED:               x2006.STTblLayoutType.FIXED,

    TBL_VALIGN_TOP:                 x2006.STVerticalJc.TOP,
    TBL_VALIGN_BOTTOM:              x2006.STVerticalJc.BOTTOM,
    TBL_VALIGN_CENTER:              x2006.STVerticalJc.CENTER,
    TBL_VALIGN_BOTH:                x2006.STVerticalJc.BOTH,

    TBLW_PCT:                       x2006.STTblWidth.PCT,
    TBLW_DXA:                       x2006.STTblWidth.DXA,

    FLD_PAGE:                       "PAGE",
    FLD_PAGES:                      "PAGES",
    FLD_FILENAME:                   "FILENAME",
    FLD_DATE:                       "DATE",
    FLD_TIME:                       "TIME",
    FLD_SECTION:                    "SECTION",
    FLD_SECTIONPAGES:               "SECTIONPAGES",

    STYLE_TYPE_PAR:                 x2006.STStyleType.PARAGRAPH,
    STYLE_TYPE_CHAR:                x2006.STStyleType.CHARACTER,
    STYLE_TYPE_NUM:                 x2006.STStyleType.NUMBERING,
    STYLE_TYPE_TBL:                 x2006.STStyleType.TABLE,

    PAGE_ORIENT_PORTRAIT:           x2006.STPageOrientation.PORTRAIT,
    PAGE_ORIENT_LANDSCAPE:          x2006.STPageOrientation.LANDSCAPE,
    PAGE_SIZE_A4:                   [11900,16840],
    PAGE_SIZE_A3:                   [16840,23800],
    PAGE_SIZE_DEFAULT:              [11900,16840],

    FILE_TYPE_PNG:                  "png",
    FILE_TYPE_JPEG:                 "jpeg",
    FILE_TYPE_EMF:                  "emf",

    FILE_TYPE_DOCX:                 "docx",
    FILE_TYPE_XLSX:                 "xlsx",
    FILE_TYPE_PPTX:                 "pptx"
};

var wdxServConstants = {
    CT_DOCUMENT:        "application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml",
    CT_SETTINGS:        "application/vnd.openxmlformats-officedocument.wordprocessingml.settings+xml",
    CT_FOOTNOTES:       "application/vnd.openxmlformats-officedocument.wordprocessingml.footnotes+xml",
    CT_ENDNOTES:        "application/vnd.openxmlformats-officedocument.wordprocessingml.endnotes+xml",
    CT_STYLES:          "application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml",
    CT_FOOTER:          "application/vnd.openxmlformats-officedocument.wordprocessingml.footer+xml",
    CT_HEADER:          "application/vnd.openxmlformats-officedocument.wordprocessingml.header+xml",
    CT_IMAGE_TEMPLATE:  "image/",
    CT_EMBED_DOCX:      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    CT_EMBED_XSLX:      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    CT_EMBED_PPTX:      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    CT_NUMBERING:       "application/vnd.openxmlformats-officedocument.wordprocessingml.numbering+xml",

    PN_DOCUMENT:        org.apache.poi.openxml4j.opc.PackagingURIHelper.createPartName("/word/document.xml"),
    PN_SETTINGS:        org.apache.poi.openxml4j.opc.PackagingURIHelper.createPartName("/word/settings.xml"),
    PN_FOOTNOTES:       org.apache.poi.openxml4j.opc.PackagingURIHelper.createPartName("/word/footnotes.xml"),
    PN_ENDNOTES:        org.apache.poi.openxml4j.opc.PackagingURIHelper.createPartName("/word/endnotes.xml"),
    PN_STYLES:          org.apache.poi.openxml4j.opc.PackagingURIHelper.createPartName("/word/styles.xml"),
    PN_NUMBERING:       org.apache.poi.openxml4j.opc.PackagingURIHelper.createPartName("/word/numbering.xml"),

    RELT_DOCUMENT:      "http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument",
    RELT_SETTINGS:      "http://schemas.openxmlformats.org/officeDocument/2006/relationships/settings",
    RELT_FOOTNOTES:     "http://schemas.openxmlformats.org/officeDocument/2006/relationships/footnotes",
    RELT_ENDNOTES:      "http://schemas.openxmlformats.org/officeDocument/2006/relationships/endnotes",
    RELT_STYLES:        "http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles",
    RELT_FOOTER:        "http://schemas.openxmlformats.org/officeDocument/2006/relationships/footer",
    RELT_HEADER:        "http://schemas.openxmlformats.org/officeDocument/2006/relationships/header",
    RELT_IMAGE:         "http://schemas.openxmlformats.org/officeDocument/2006/relationships/image",
    RELT_EMBED:         "http://schemas.openxmlformats.org/officeDocument/2006/relationships/package",
    RELT_NUMBERING:     "http://schemas.openxmlformats.org/officeDocument/2006/relationships/numbering",
    RELT_HYPERLINK:     "http://schemas.openxmlformats.org/officeDocument/2006/relationships/hyperlink",

    QNAME_DOCUMENT:     new javax.xml.namespace.QName("http://schemas.openxmlformats.org/wordprocessingml/2006/main", "document"),
    QNAME_SETTINGS:     new javax.xml.namespace.QName("http://schemas.openxmlformats.org/wordprocessingml/2006/main", "settings"),
    QNAME_FOOTNOTES:    new javax.xml.namespace.QName("http://schemas.openxmlformats.org/wordprocessingml/2006/main", "footnotes"),
    QNAME_ENDNOTES:     new javax.xml.namespace.QName("http://schemas.openxmlformats.org/wordprocessingml/2006/main", "endnotes"),
    QNAME_STYLES:       new javax.xml.namespace.QName("http://schemas.openxmlformats.org/wordprocessingml/2006/main", "styles"),
    QNAME_FOOTER:       new javax.xml.namespace.QName("http://schemas.openxmlformats.org/wordprocessingml/2006/main", "ftr"),
    QNAME_HEADER:       new javax.xml.namespace.QName("http://schemas.openxmlformats.org/wordprocessingml/2006/main", "hdr"),
    QNAME_NUMBERING:    new javax.xml.namespace.QName("http://schemas.openxmlformats.org/wordprocessingml/2006/main", "numbering"),

    TM_INTERNAL:        org.apache.poi.openxml4j.opc.TargetMode.INTERNAL,
    TM_EXTERNAL:        org.apache.poi.openxml4j.opc.TargetMode.EXTERNAL,

    SPACEPRESERVE:      org.apache.xmlbeans.impl.xb.xmlschema.SpaceAttribute.Space.PRESERVE,
    SPACEDEFAULT:       org.apache.xmlbeans.impl.xb.xmlschema.SpaceAttribute.Space.DEFAULT,

    IT_DOCUMENT:        "document",
    IT_SETTINGS:        "settings",
    IT_FOOTNOTES:       "footnotes",
    IT_ENDNOTES:        "endnotes",
    IT_SETTINGS:        "styles",
    IT_HEADER:          "header",
    IT_FOOTER:          "footer",
    IT_IMAGE:           "image",
    IT_EMBED:           "embed",
    IT_NUMBERING:       "numbering",

    DOC_DOCDOC:         x2006.DocumentDocument,
    DOC_DOCUMENT:       x2006.CTDocument1,
    DOC_SETTINGS:       x2006.CTSettings,
    DOC_FOOTNOTES:      x2006.CTFootnotes,
    DOC_ENDNOTES:       x2006.CTEndnotes,
    DOC_STYLES:         x2006.CTStyles,
    DOC_HEADER:         x2006.CTHdrFtr,
    DOC_FOOTER:         x2006.CTHdrFtr,
    DOC_NUMBERING:      x2006.CTNumbering,

    CT_SECTION:         x2006.CTSectPr,
    CT_PARAGRAPH:       x2006.CTP,
    CT_RUN:             x2006.CTR,
    CT_TABLE:           x2006.CTTbl,
    CT_ROW:             x2006.CTRow,
    CT_CELL:            x2006.CTTc
};

var wdxServFunctions = {
    getXMLopt: function(QName){
        var xmlOptions = new org.apache.xmlbeans.XmlOptions(/*org.apache.poi.POIXMLTypeLoader.DEFAULT_XML_OPTIONS*/);
        xmlOptions.setSaveSyntheticDocumentElement(QName);
        var map = new java.util.HashMap();
        map.put("http://schemas.openxmlformats.org/wordprocessingml/2006/main","w");
        map.put("http://schemas.openxmlformats.org/officeDocument/2006/relationships","r");
        map.put("urn:schemas-microsoft-com:office:office","o");
        map.put("urn:schemas-microsoft-com:vml","v");
        map.put("urn:schemas-microsoft-com:office:word","w10");
        map.put("http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing","wp");
        map.put("http://schemas.openxmlformats.org/officeDocument/2006/math","m");
        map.put("http://schemas.openxmlformats.org/markup-compatibility/2006","ve");

        xmlOptions.setSaveSuggestedPrefixes(map);
        return xmlOptions;
    },
    getThumbPicture: function(extension,filename){
        var os = new java.io.ByteArrayOutputStream();
        var bi = new java.awt.image.BufferedImage(210,150,2);
        var graphic = bi.getGraphics();
        graphic.setColor(java.awt.Color.WHITE);
        graphic.fillRect(0, 0, 210, 150);
        switch(String(extension)){
            case String("doc"):
            case String("docx"):
                var mainColor = 3752838;
                var letter = "W";
            break;
            case String("xls"):
            case String("xlsx"):
                var mainColor = 3573323;
                var letter = "E";
            break;
            case String("ppt"):
            case String("pptx"):
                var mainColor = 14829859;
                var letter = "P";
            break;
            default:
                var mainColor = 0;
                var letter = "F";
            break;
        }
        graphic.setColor(new java.awt.Color(mainColor));//blue
        graphic.setFont(new java.awt.Font("Serif",java.awt.Font.BOLD,48));
        graphic.drawString(String(letter),60,60);

        graphic.setColor(new java.awt.Color(5066061));//grey
        graphic.drawLine(111,36,135,36);
        graphic.drawLine(111,45,135,45);
        graphic.drawLine(111,54,135,54);
        graphic.drawLine(111,27,135,27);

        if (extension==null) extension="file";
        graphic.setColor(java.awt.Color.BLACK);//black
        graphic.setFont(new java.awt.Font("Serif",java.awt.Font.BOLD,24));
        graphic.drawString(String("."+extension),75,90);

        if (filename!=null){
            graphic.setFont(new java.awt.Font("Serif",java.awt.Font.PLAIN,20));
            graphic.drawString(String(filename),5,120);
        }

        javax.imageio.ImageIO.write(bi, "png", os)
        bi.flush();
        graphic.dispose();
        os.close();

        return os;
    },
    getOutputStream: function(){
        return java.io.ByteArrayOutputStream();
    },
    getOutputFile: function(os){
        return org.apache.poi.openxml4j.opc.OPCPackage.create(os);
    },
    getPartName: function(partName){
        return org.apache.poi.openxml4j.opc.PackagingURIHelper.createPartName(partName);
    },
    getCTByExtension: function(extension){
        switch (String(extension).toLowerCase()){
            case "docx": return wdxServConstants.CT_EMBED_DOCX; break;
            case "xlsx": return wdxServConstants.CT_EMBED_XSLX; break;
            case "pptx": return wdxServConstants.CT_EMBED_PPTX; break;
        }
    },
    getPartByContent: function(mainPart,data,contentType){
        var IOUtils = org.apache.commons.io.IOUtils;
        var partArr = mainPart.getPackage().getPartsByContentType(contentType);
        for (var i=0;i<partArr.size();i++)
            if (java.util.Arrays.equals(IOUtils.toByteArray(partArr.get(i).getInputStream()),data.toByteArray()))
                return partArr.get(i);
    },
    getRelByPart: function(mainPart,part){
        var tRelArr = mainPart.getRelationships();
        for (var i=0;i<tRelArr.size();i++)
            if (String(tRelArr.getRelationship(i).getTargetURI())==String(part.getPartName().getName()))
                return tRelArr.getRelationship(i);
        return null;
    },
    getPart: function(mainPart,partName,contentType,relationType,contentBA){
        try{
            var part = mainPart.createPart(partName, contentType);}
        catch(ex){
            if (contentBA==null)
                var part = mainPart.getPackage().createPart(partName, contentType);
            else{//condition for picture data (and object data); if picture(object) is already in package we have to reuse it
                var part = this.getPartByContent(mainPart,contentBA,contentType);
                if (part!=null){
                    if (this.getRelByPart(mainPart,part)!=null)
                        return [part,this.getRelByPart(mainPart,part)];
                    else
                        return [part,mainPart.addRelationship(part.getPartName(),wdxServConstants.TM_INTERNAL,relationType)];
                }
                else{
                    var part = mainPart.getPackage().createPart(partName, contentType, contentBA);
                    return [part,mainPart.addRelationship(part.getPartName(),wdxServConstants.TM_INTERNAL,relationType)];
                }
            }
        }
        var rel = mainPart.addRelationship(partName,wdxServConstants.TM_INTERNAL,relationType);
        return [part,rel];
    },
    getHyperlinkId: function(mainPart,partName,contentType,relationType,contentBA){

    },
    getItem: function(file,type,data,extension){
        switch (type){
            case wdxServConstants.IT_DOCUMENT:
                return{
                    file:   this.getPart(file,wdxServConstants.PN_DOCUMENT,wdxServConstants.CT_DOCUMENT,wdxServConstants.RELT_DOCUMENT)[0],
                    doc:    x2006.CTBody.Factory.newInstance()
                };
            break;
            case wdxServConstants.IT_SETTINGS:
                return{
                    file:   this.getPart(file,wdxServConstants.PN_SETTINGS,wdxServConstants.CT_SETTINGS,wdxServConstants.RELT_SETTINGS)[0],
                    doc:    wdxServConstants.DOC_SETTINGS.Factory.newInstance()
                };
            break;
            case wdxServConstants.IT_FOOTNOTES:
                return{
                    file:   this.getPart(file,wdxServConstants.PN_FOOTNOTES,wdxServConstants.CT_FOOTNOTES,wdxServConstants.RELT_FOOTNOTES)[0],
                    doc:    wdxServConstants.DOC_FOOTNOTES.Factory.newInstance(),
                    childs: [],
                    collect: function(){
                        for (var i=0;i<this.childs.length;i++)
                            this.doc.addNewFootnote().set(this.childs[i].item);
                    }
                };
            break;
            case wdxServConstants.IT_ENDNOTES:
                return{
                    file:   this.getPart(file,wdxServConstants.PN_ENDNOTES,wdxServConstants.CT_ENDNOTES,wdxServConstants.RELT_ENDNOTES)[0],
                    doc:    wdxServConstants.DOC_ENDNOTES.Factory.newInstance(),
                    childs: [],
                    collect: function(){
                        for (var i=0;i<this.childs.length;i++)
                            this.doc.addNewEndnote().set(this.childs[i].item);
                    }
                };
            break;
            case wdxServConstants.IT_STYLES:
                return{
                    file:   this.getPart(file,wdxServConstants.PN_STYLES,wdxServConstants.CT_STYLES,wdxServConstants.RELT_STYLES)[0],
                    doc:    wdxServConstants.DOC_STYLES.Factory.newInstance(),
                    childs: []
                };
            break;
            case wdxServConstants.IT_FOOTER:
                var tPart = this.getPart(file,this.getPartName("/word/footer"+String(++wdxCounter.FOOTERS)+".xml"),wdxServConstants.CT_FOOTER,wdxServConstants.RELT_FOOTER);
                return{
                    file: tPart[0],
                    doc:    wdxServConstants.DOC_FOOTER.Factory.newInstance(),
                    childs: [],
                    rel: tPart[1]
                };
            break;
            case wdxServConstants.IT_HEADER:
                var tPart = this.getPart(file,this.getPartName("/word/header"+String(++wdxCounter.HEADERS)+".xml"),wdxServConstants.CT_HEADER,wdxServConstants.RELT_HEADER);
                return{
                    file: tPart[0],
                    doc:    wdxServConstants.DOC_HEADER.Factory.newInstance(),
                    childs: [],
                    rel: tPart[1]
                };
            break;
            case wdxServConstants.IT_IMAGE:
                var tPartName = this.getPartName("/word/media/image"+String(++wdxCounter.IMAGES_FILE)+"."+extension);
                if (extension=="emf") extension="x-emf";
                var tPart = this.getPart(file,tPartName,wdxServConstants.CT_IMAGE_TEMPLATE+extension,wdxServConstants.RELT_IMAGE,data);
                if (String(tPart[0].getPartName())!=String(tPartName))
                    wdxCounter.IMAGES_FILE--;
                return{
                    rel: tPart[1]
                };
            break;
            case wdxServConstants.IT_EMBED:
                var tPartName = this.getPartName("/word/embeddings/doc"+String(++wdxCounter.EMBED_FILE)+"."+extension);
                var tPart = this.getPart(file,tPartName,this.getCTByExtension(extension),wdxServConstants.RELT_EMBED,data);
                if (String(tPart[0].getPartName())!=String(tPartName))
                    wdxCounter.EMBED_FILE--;
                return{
                    rel: tPart[1]
                };
            break;
            case wdxServConstants.IT_NUMBERING:
                return{
                    file:   this.getPart(file,wdxServConstants.PN_NUMBERING,wdxServConstants.CT_NUMBERING,wdxServConstants.RELT_NUMBERING)[0],
                    doc:    wdxServConstants.DOC_NUMBERING.Factory.newInstance(),
                    childs: []
                };
            break;
        }
    },
    savePart: function(part,qname){
        if (part==null) return;
        var partOs = part.file.getOutputStream();
        if (qname!=wdxServConstants.QNAME_DOCUMENT)
            part.doc.save(partOs,this.getXMLopt(qname));
        else{
            var tFile = wdxServConstants.DOC_DOCUMENT.Factory.newInstance();
            tFile.addNewBody().set(part.doc);
            part.doc = tFile;
            part.doc.save(partOs,this.getXMLopt(qname));
        }
        partOs.close();
    },
    saveDoc:function(obj){
        if (obj.childs!=null)
            for (var i=0;i<obj.childs.length;i++)
                this.saveDoc(obj.childs[i]);
        if (obj.collect!=null)
            obj.collect();
    },
    getTF:function(value){
        switch (value){
            case true:  return x2006.STOnOff.TRUE;  break;
            case false: return x2006.STOnOff.FALSE; break;
        }
        return value;
    },
    getTopPart:function(obj,name){
        while(obj.parent!=null){
            if (name==null)
                if (obj.item.file!=null)
                    break;
            obj = obj.parent;
        }
        if (name==null) return obj;
        if (obj[name]==null)
            switch (name){
                case "footnotes":   obj.createFootnotes(); break;
                case "endnotes":    obj.createEndnotes(); break;
                case "styles":      obj.createStyles(); break;
                case "settings":    obj.createSettings(); break;
                case "numbering":   obj.createNumbering();break;
            }
        return obj[name];
    },
    getSectionPart: function(oObj){
        if (oObj!=null){
            //if (String(oObj.item.type)==String("T=CT_Section@http://schemas.openxmlformats.org/wordprocessingml/2006/main"))
            if (oObj.item.type==null)
                return oObj
            else
                return this.getSectionPart(oObj.parent)
        }
        return null
    },
    getPictureMaxPercent: function(oObj){
        var tSection = this.getSectionPart(oObj.parent);
        if (tSection==null)
            return 100
        var tPageHeight = tSection.item.getPgSz().getH()//-tSection.item.getPgMar().getLeft()-tSection.item.getPgMar().getRight();
        var tPageWidth = tSection.item.getPgSz().getW()//-tSection.item.getPgMar().getTop()-tSection.item.getPgMar().getBottom();
        var tHeightPercent = tPageHeight/oObj.height/20
        var tWidthPercent = tPageWidth/oObj.width/20
        return Math.min.apply(Math,[tHeightPercent,tWidthPercent])*100
    },
    setProp:function(item,wdxSimpleStyle){
        switch (String(item.type)){
            case String("T=CT_R@http://schemas.openxmlformats.org/wordprocessingml/2006/main"):
                var prop = item.isSetRPr() ? item.getRPr() : item.addNewRPr();
            break;
            case String("T=CT_P@http://schemas.openxmlformats.org/wordprocessingml/2006/main"):
                var prop = item.isSetPPr() ? item.getPPr() : item.addNewPPr();
            break;
            case String("T=CT_Tbl@http://schemas.openxmlformats.org/wordprocessingml/2006/main"):
                var prop = (item.getTblPr()!=null)? item.getTblPr() : item.addNewTblPr();
            break;
            case String("T=CT_Row@http://schemas.openxmlformats.org/wordprocessingml/2006/main"):
                var prop = item.isSetTrPr() ? item.getTrPr() : item.addNewTrPr();
            break;
            case String("T=CT_Tc@http://schemas.openxmlformats.org/wordprocessingml/2006/main"):
                var prop = item.isSetTcPr() ? item.getTcPr() : item.addNewTcPr();
            break;
            /*case String("T=CT_Settings@http://schemas.openxmlformats.org/wordprocessingml/2006/main"):
            case String("T=CT_SectPr@http://schemas.openxmlformats.org/wordprocessingml/2006/main"):
            case String("T=CT_Style@http://schemas.openxmlformats.org/wordprocessingml/2006/main"):
            case String("T=CT_Shd@http://schemas.openxmlformats.org/wordprocessingml/2006/main"):
            case String("T=CT_TblBorders@http://schemas.openxmlformats.org/wordprocessingml/2006/main"):
            case String("T=CT_TblCellMar@http://schemas.openxmlformats.org/wordprocessingml/2006/main"):
            case String("T=CT_TblWidth@http://schemas.openxmlformats.org/wordprocessingml/2006/main"):
            case String("T=CT_TblLayoutType@http://schemas.openxmlformats.org/wordprocessingml/2006/main"):
            case String("T=CT_ShortHexNumber@http://schemas.openxmlformats.org/wordprocessingml/2006/main"):
            case String("T=CT_TblOverlap@http://schemas.openxmlformats.org/wordprocessingml/2006/main"):
            case String("T=CT_Num@http://schemas.openxmlformats.org/wordprocessingml/2006/main"):
            case String("T=CT_AbstractNum@http://schemas.openxmlformats.org/wordprocessingml/2006/main"):
            case String("T=CT_Height@http://schemas.openxmlformats.org/wordprocessingml/2006/main"):
            case String("T=CT_Border@http://schemas.openxmlformats.org/wordprocessingml/2006/main"):
            case String("T=CT_Br@http://schemas.openxmlformats.org/wordprocessingml/2006/main"):
            case String("T=CT_EdnProps@http://schemas.openxmlformats.org/wordprocessingml/2006/main"):
            case String("T=CT_FtnProps@http://schemas.openxmlformats.org/wordprocessingml/2006/main"):
            case String(null):*/
            default:
                var prop = item;
            break;
        }
        for (var key in wdxSimpleStyle){
            switch (String(item.type)){
                case String("paragraph"):
                    switch (key.match(/^[^_]+(?=_)/g)[0]){
                        case "RUN":
                            var prop = item.isSetRPr() ? item.getRPr() : item.addNewRPr();
                        break;
                        case "PAR":
                            var prop = item.isSetPPr() ? item.getPPr() : item.addNewPPr();
                        break;
                        /*case "STYLE":
                            var prop = item
                        break;*/
                    }
                break;
            }
            wdxSimpleStyle[key] = wdxServFunctions.getTF(wdxSimpleStyle[key]);
            switch(key){
                case "RUN_BOLD":
                    var p = prop.isSetB() ? prop.getB() : prop.addNewB();
                    p.setVal(wdxSimpleStyle[key]);
                break;
                case "RUN_BOLD_CS":
                    var p = prop.isSetBCs() ? prop.getBCs() : prop.addNewBCs();
                    p.setVal(wdxSimpleStyle[key]);
                break;
                case "RUN_BDR":
                    var p = prop.isSetBdr() ? prop.getBdr() : prop.addNewBdr();
                    this.setProp(p,wdxSimpleStyle[key]);
                break;
                case "RUN_CAPS":
                    var p = prop.isSetCaps() ? prop.getCaps() : prop.addNewCaps();
                    p.setVal(wdxSimpleStyle[key]);
                break;
                case "RUN_CHAR_SPACE":
                    var p = prop.isSpacing() ? prop.getSpacing() : prop.addNewSpacing();
                    p.setVal(wdxSimpleStyle[key]);
                break;
                case "RUN_COLOR"://RRGGBB(hex)
                    var p = prop.isSetColor() ? prop.getColor() : prop.addNewColor();
                    p.setVal(new java.lang.String(wdxSimpleStyle[key]));
                break;
                case "RUN_DBL_STRIKE":
                    var p = prop.isSetDstrike() ? prop.getDstrike() : prop.addNewDstrike();
                    p.setVal(wdxSimpleStyle[key]);
                break;
                case "RUN_EMBOSSED":
                    var p = prop.isSetEmboss() ? prop.getEmboss() : prop.addNewEmboss();
                    p.setVal(wdxSimpleStyle[key]);
                break;
                case "RUN_FONT":
                    var p = prop.isSetRFonts() ? prop.getRFonts() : prop.addNewRFonts();
                    p.setAscii(new java.lang.String(wdxSimpleStyle[key]));
                    p.setHAnsi(new java.lang.String(wdxSimpleStyle[key]));
                break;
                case "RUN_FONTSIZE":
                    var p = prop.isSetSz() ? prop.getSz() : prop.addNewSz();
                    p.setVal(new java.math.BigInteger(String(wdxSimpleStyle[key])));
                break;
                case "RUN_IMPRINTED":
                    var p = prop.isSetImprint() ? prop.getImprint() : prop.addNewImprint();
                    p.setVal(wdxSimpleStyle[key]);
                break;
                case "RUN_ITALIC":
                    var p = prop.isSetI() ? prop.getI() : prop.addNewI();
                    p.setVal(wdxSimpleStyle[key]);
                break;
                case "RUN_KERNING":
                    var p = prop.isSetKern() ? prop.getKern() : prop.addNewKern();
                    p.setVal(new java.math.BigInteger(String(wdxSimpleStyle[key])));
                break;
                case "RUN_SHADOW":
                    var p = prop.isSetShadow() ? prop.getShadow() : prop.addNewShadow();
                    p.setVal(wdxSimpleStyle[key]);
                break;
                case "RUN_SMALL_CAPS":
                    var p = prop.isSetSmallCaps() ? prop.getSmallCaps() : prop.addNewSmallCaps();
                    p.setVal(wdxSimpleStyle[key]);
                break;
                case "RUN_STRIKE":
                    var p =  prop.isSetStrike() ? prop.getStrike() : prop.addNewStrike();
                    p.setVal(wdxSimpleStyle[key]);
                break;
                case "RUN_UNDERLINE"://wdxConstants.UL_*
                    var p = prop.isSetU() ? prop.getU() : prop.addNewU();
                    p.setVal(wdxSimpleStyle[key]);
                break;
                case "RUN_SCRIPT":  //wdxConstants.SCR_*
                    var p = prop.isSetVertAlign() ? prop.getVertAlign() : prop.addNewVertAlign();
                    p.setVal(wdxSimpleStyle[key]);
                break;
                case "RUN_HIGHLIGHT":
                    var p = prop.isSetHighlight() ? prop.getHighlight() : prop.addNewHighlight();
                    p.setVal(wdxSimpleStyle[key]);
                break;
                case "RUN_TXT":
                    var p = (item.getTArray().length!=0) ? item.getTArray(0) : item.addNewT();
                    p.setStringValue(wdxSimpleStyle[key]);
                    p.setSpace(wdxServConstants.SPACEPRESERVE);
                break;
                //------------------------------------------------------------------------------//
                case "PAR_BIDI":
                    var p = prop.isSetBidi() ? prop.getBidi() : prop.addNewBidi();
                    p.setVal(wdxSimpleStyle[key]);
                break;
                case "PAR_CONT_SPACING"://wdxConstants.LN_SPACE_*
                    var p = prop.isSetContextualSpacing() ? prop.getContextualSpacing() : prop.addNewContextualSpacing();
                    p.setVal(wdxSimpleStyle[key]);
                break;
                case "PAR_IND_FIRST":
                    var p = prop.isSetInd() ? prop.getInd() : prop.addNewInd();
                    p.setFirstLine(new java.math.BigInteger(String(wdxSimpleStyle[key])));
                break;
                case "PAR_IND_LEFT":
                    var p = prop.isSetInd() ? prop.getInd() : prop.addNewInd();
                    p.setLeft(new java.math.BigInteger(String(wdxSimpleStyle[key])));
                break;
                case "PAR_IND_RIGHT":
                    var p = prop.isSetInd() ? prop.getInd() : prop.addNewInd();
                    p.setRight(new java.math.BigInteger(String(wdxSimpleStyle[key])));
                break;
                case "PAR_HANGING":
                    var p = prop.isSetInd() ? prop.getInd() : prop.addNewInd();
                    p.setHanging(new java.math.BigInteger(String(wdxSimpleStyle[key])));
                break;
                case "PAR_SPACE_BEFORE":
                    var p = prop.isSetSpacing() ? prop.getSpacing() : prop.addNewSpacing();
                    p.setBefore(new java.math.BigInteger(String(wdxSimpleStyle[key])));
                break;
                case "PAR_SPACE_AFTER":
                    var p = prop.isSetSpacing() ? prop.getSpacing() : prop.addNewSpacing();
                    p.setAfter(new java.math.BigInteger(String(wdxSimpleStyle[key])));
                break;
                case "PAR_SPACING_RULE"://wdxConstants.LN_SPACE_*
                    var p = prop.isSetSpacing() ? prop.getSpacing() : prop.addNewSpacing();
                    p.setLineRule(wdxSimpleStyle[key]);
                break;
                case "PAR_SPACING":
                    var p = prop.isSetSpacing() ? prop.getSpacing() : prop.addNewSpacing();
                    p.setLine(new java.math.BigInteger(String(wdxSimpleStyle[key])));
                break;
                case "PAR_TOC_LEVEL"://(0-8)
                    var p = prop.isSetOutlineLvl() ? prop.getOutlineLvl() : prop.addNewOutlineLvl();
                    p.setVal(new java.math.BigInteger(String(wdxSimpleStyle[key])));
                break;
                case "PAR_ALIGN":
                    var p = prop.isSetJc() ? prop.getJc() : prop.addNewJc();
                    p.setVal(wdxSimpleStyle[key]);
                break;
                case "PAR_TEXT_DIRECTION":
                    var p = prop.isSetTextDirection() ? prop.getTextDirection() : prop.addNewTextDirection();
                    p.setVal(wdxSimpleStyle[key]);
                break;
                case "PAR_LIST":
                    var p = prop.isSetNumPr() ? prop.getNumPr() : prop.addNewNumPr();
                    var val = x2006.CTDecimalNumber.Factory.newInstance();
                    val.setVal(new java.math.BigInteger(String(wdxSimpleStyle[key])));
                    p.setIlvl(val);
                break;
                case "PAR_LIST_ID":
                    var p = prop.isSetNumPr() ? prop.getNumPr() : prop.addNewNumPr();
                    var val = x2006.CTDecimalNumber.Factory.newInstance();
                    val.setVal(new java.math.BigInteger(String(wdxSimpleStyle[key])));
                    p.setNumId(val);
                break;
                case "PAR_PSTYLE":
                    var p = prop.isSetPStyle() ? prop.getPStyle() : prop.addNewPStyle();
                    p.setVal(String(wdxSimpleStyle[key]));
                break;
                //------------------------------------------------------------------------------//
                case "PAGE_SIZE"://[height,width]
                    var p = prop.isSetPgSz() ? prop.getPgSz() : prop.addNewPgSz();
                    p.isSetOrient() ? p.getOrient() : p.setOrient(wdxConstants.PAGE_ORIENT_PORTRAIT);
                    var orient = p.getOrient();
                    p.setH(new java.math.BigInteger(String(wdxSimpleStyle[key][0])));
                    p.setW(new java.math.BigInteger(String(wdxSimpleStyle[key][1])));
                    this.setProp(prop,{"PAGE_ORIENT":orient});
                break;
                case "PAGE_ORIENT":
                    var p = prop.isSetPgSz() ? prop.getPgSz() : prop.addNewPgSz();
                    var arr = [p.getH(),p.getW()];
                    p.setOrient(wdxSimpleStyle[key]);
                    switch (wdxSimpleStyle[key]){
                        case wdxConstants.PAGE_ORIENT_PORTRAIT:
                            p.setH(new java.math.BigInteger(Math.max.apply(Math,arr)));
                            p.setW(new java.math.BigInteger(Math.min.apply(Math,arr)));
                        break;
                        case wdxConstants.PAGE_ORIENT_LANDSCAPE:
                            p.setH(new java.math.BigInteger(Math.min.apply(Math,arr)));
                            p.setW(new java.math.BigInteger(Math.max.apply(Math,arr)));
                        break;
                    }
                break;
                case "PAGE_COL_COUNT":
                    var p = prop.isSetCols() ? prop.getCols() : prop.addNewCols();
                    p.setNum(new java.math.BigInteger(String(wdxSimpleStyle[key])));
                break;
                case "PAGE_COL_SPACE":
                    var p = prop.isSetCols() ? prop.getCols() : prop.addNewCols();
                    p.setSpace(new java.math.BigInteger(String(wdxSimpleStyle[key])));
                break;
                case "PAGE_MARGIN_LEFT":
                    var p = prop.isSetPgMar() ? prop.getPgMar() : prop.addNewPgMar();
                    p.setLeft(new java.math.BigInteger(String(wdxSimpleStyle[key])));
                break;
                case "PAGE_MARGIN_RIGHT":
                    var p = prop.isSetPgMar() ? prop.getPgMar() : prop.addNewPgMar();
                    p.setRight(new java.math.BigInteger(String(wdxSimpleStyle[key])));
                break;
                case "PAGE_MARGIN_TOP":
                    var p = prop.isSetPgMar() ? prop.getPgMar() : prop.addNewPgMar();
                    p.setTop(new java.math.BigInteger(String(wdxSimpleStyle[key])));
                break;
                case "PAGE_MARGIN_BOTTOM":
                    var p = prop.isSetPgMar() ? prop.getPgMar() : prop.addNewPgMar();
                    p.setBottom(new java.math.BigInteger(String(wdxSimpleStyle[key])));
                break;
                case "PAGE_MARGIN_HEADER":
                    var p = prop.isSetPgMar() ? prop.getPgMar() : prop.addNewPgMar();
                    p.setHeader(new java.math.BigInteger(String(wdxSimpleStyle[key])));
                break;
                case "PAGE_MARGIN_FOOTER":
                    var p = prop.isSetPgMar() ? prop.getPgMar() : prop.addNewPgMar();
                    p.setFooter(new java.math.BigInteger(String(wdxSimpleStyle[key])));
                break;
                case "PAGE_GUTTER":
                    var p = prop.isSetPgMar() ? prop.getPgMar() : prop.addNewPgMar();
                    p.setGutter(new java.math.BigInteger(String(wdxSimpleStyle[key])));
                break;
                case "PAGE_BIDI":
                    var p = prop.isSetBidi() ? prop.getBidi() : prop.addNewBidi();
                    p.setBidi(wdxSimpleStyle[key]);
                break;
                case "SECTION_TITLE"://section has title page which has different header and footer
                    prop.setTitlePg(wdxSimpleStyle[key]);
                break;
                case "SECTION_DOCGRID":
                    var p = prop.isSetDocGrid() ? prop.getDocGrid() : prop.addNewDocGrid();
                    this.setProp(p,wdxSimpleStyle[key]);
                break;
                case "SECTION_FORMPROT":
                    var p = prop.isSetFormProt() ? prop.getFormProt() : prop.addNewFormProt();
                    this.setVal(wdxSimpleStyle[key]);
                break;
                case "SECTION_LNNUMTYPE":
                    var p = prop.isSetLnNumType() ? prop.getLnNumType() : prop.addNewLnNumType();
                    this.setProp(p,wdxSimpleStyle[key]);
                break;
                case "SECTION_NOENDNOTE":
                    var p = prop.isSetNoEndnote() ? prop.getNoEndnote() : prop.addNewNoEndnote();
                    this.setVal(wdxSimpleStyle[key]);
                break;
                case "SECTION_PAPERSRC":
                    var p = prop.isSetPaperSrc() ? prop.getPaperSrc() : prop.addNewPaperSrc();
                    this.setProp(p,wdxSimpleStyle[key]);
                break;
                case "SECTION_PGBORDERS":
                    var p = prop.isSetPgBorders() ? prop.getPgBorders() : prop.addNewPgBorders();
                    this.setProp(p,wdxSimpleStyle[key]);
                break;
                case "SECTION_PGNUMTYPE":
                    var p = prop.isSetPgNumType() ? prop.getPgNumType() : prop.addNewPgNumType();
                    this.setProp(p,wdxSimpleStyle[key]);
                break;
                case "SECTION_PRINTERSETTINGS":
                    var p = prop.isSetPageSettings() ? prop.getPageSettings() : prop.addNewPageSettings();
                    p.setId(String(wdxSimpleStyle[key]));
                break;
                case "SECTION_RTLGUTTER":
                    var p = prop.isSetRtlGutter() ? prop.getRtlGutter() : prop.addNewRtlGutter();
                    p.setVal(wdxSimpleStyle[key]);
                break;
                case "SECTION_TEXTDIRECTION":
                    var p = prop.isSetTextDirection() ? prop.getTextDirection() : prop.addNewTextDirection();
                    p.setVal(wdxSimpleStyle[key]);
                break;
                case "SECTION_TYPE":
                    var p = prop.isSetType() ? prop.getType() : prop.addNewType();
                    p.setVal(wdxSimpleStyle[key]);
                break;
                 case "SECTION_VALIGN":
                    var p = prop.isSetVAlign() ? prop.getVAlign() : prop.addNewVAlign();
                    p.setVal(wdxSimpleStyle[key]);
                break;
                case "SECTION_FOOTNOTE":
                    var p = prop.isSetFootnotePr() ? prop.getFootnotePr() : prop.addNewFootnotePr();
                    this.setProp(p,wdxSimpleStyle[key]);
                break;
                case "SECTION_ENDNOTE":
                    var p = prop.isSetEndnotePr() ? prop.getEndnotePr() : prop.addNewEndnotePr();
                    this.setProp(p,wdxSimpleStyle[key]);
                break;
                //------------------------------------------------------------------------------//
                case "FTN_NUMFMT":
                case "EDN_NUMFMT":
                    var p = prop.isSetNumFmt() ? prop.getNumFmt() : prop.addNewNumFmt();
                    p.setVal(wdxSimpleStyle[key]);
                break;
                case "FTN_NUMRESTART":
                case "EDN_NUMRESTART":
                    var p = prop.isSetNumRestart() ? prop.getNumRestart() : prop.addNewNumRestart();
                    p.setVal(wdxSimpleStyle[key]);
                break;
                case "FTN_NUMSTART":
                case "EDN_NUMSTART":
                    var p = prop.isSetNumStart() ? prop.getNumStart() : prop.addNewNumStart();
                    p.setVal(wdxSimpleStyle[key]);
                break;
                case "FTN_POS":
                case "EDN_POS":
                    var p = prop.isSetPos() ? prop.getPos() : prop.addNewPos();
                    p.setVal(wdxSimpleStyle[key]);
                break;
                //------------------------------------------------------------------------------//
                case "DOCGRID_CHARSPACE":
                    prop.setCharSpace(new java.math.BigInteger(String(wdxSimpleStyle[key])));
                break;
                case "DOCGRID_LINEPITCH":
                    prop.setLinePitch(new java.math.BigInteger(String(wdxSimpleStyle[key])));
                break;
                case "DOCGRID_TYPE":
                    prop.setType(wdxSimpleStyle[key]);
                break;
                //------------------------------------------------------------------------------//
                case "LNNUMTYPE_COUNTBY":
                    prop.setCountBy(new java.math.BigInteger(String(wdxSimpleStyle[key])));
                break;
                case "LNNUMTYPE_DISTANCE":
                    prop.setDistance(new java.math.BigInteger(String(wdxSimpleStyle[key])));
                break;
                case "LNNUMTYPE_RESTART":
                    prop.setRestart(wdxSimpleStyle[key]);
                break;
                case "LNNUMTYPE_START":
                    prop.setStart(new java.math.BigInteger(String(wdxSimpleStyle[key])));
                break;
                //------------------------------------------------------------------------------//
                case "PAPERSRC_FIRST":
                    prop.setFirst(new java.math.BigInteger(String(wdxSimpleStyle[key])));
                break;
                case "PAPERSRC_OTHER":
                    prop.setOther(new java.math.BigInteger(String(wdxSimpleStyle[key])));
                break;
                //------------------------------------------------------------------------------//
                case "PGBORDERS_LEFT":
                    var p = prop.isSetLeft() ? prop.getLeft() : prop.addNewLeft();
                    this.setProp(p,wdxSimpleStyle[key]);
                break;
                case "PGBORDERS_RIGHT":
                    var p = prop.isSetRight() ? prop.getRight() : prop.addNewRight();
                    this.setProp(p,wdxSimpleStyle[key]);
                break;
                case "PGBORDERS_TOP":
                    var p = prop.isSetTop() ? prop.getTop() : prop.addNewTop();
                    this.setProp(p,wdxSimpleStyle[key]);
                break;
                case "PGBORDERS_BOTTOM":
                    var p = prop.isSetBottom() ? prop.getBottom() : prop.addNewBottom();
                    this.setProp(p,wdxSimpleStyle[key]);
                break;
                case "PGBORDERS_DISPLAY":
                    prop.setDisplay(wdxSimpleStyle[key]);
                break;
                case "PGBORDERS_OFFSETFROM":
                    prop.setOffsetFrom(wdxSimpleStyle[key]);
                break;
                case "PGBORDERS_ZORDER":
                    prop.setZOrder(wdxSimpleStyle[key]);
                break;
                //------------------------------------------------------------------------------//
                case "PGNUMTYPE_CHAPSEP":
                    prop.setChapSep(wdxSimpleStyle[key]);
                break;
                case "PGNUMTYPE_CHAPSTYLE":
                    prop.setChapStyle(new java.math.BigInteger(String(wdxSimpleStyle[key])));
                break;
                case "PGNUMTYPE_FMT":
                    prop.setFmt(wdxSimpleStyle[key]);
                break;
                case "PGNUMTYPE_START":
                    prop.setStart(new java.math.BigInteger(String(wdxSimpleStyle[key])));
                break;
                //------------------------------------------------------------------------------//
                case "SET_ZOOM":
                    var p = prop.isSetZoom() ? prop.getZoom() : prop.addNewZoom();
                    p.setPercent(new java.math.BigInteger(String(wdxSimpleStyle[key])));
                break;
                case "SET_EVEN_ODD":
                    var p = prop.isSetEvenAndOddHeaders() ? prop.getEvenAndOddHeaders() : prop.addNewEvenAndOddHeaders();
                    p.setVal(wdxSimpleStyle[key]);
                break;
                case "SET_UPDATE":
                    var p = prop.isSetUpdateFields() ? prop.getUpdateFields() : prop.addNewUpdateFields()
                    p.setVal(wdxSimpleStyle[key]);
                break;
                case "PROP_CREATOR":
                    prop.getPackageProperties().setCreatorProperty(String(wdxSimpleStyle[key]))
                break;
                case "PROP_TITLE":
                    prop.getPackageProperties().setTitleProperty(String(wdxSimpleStyle[key]))
                break;
                case "PROP_CATEGORY":
                    prop.getPackageProperties().setCategoryProperty(String(wdxSimpleStyle[key]))
                break;
                case "PROP_DESCRIPTION":
                    prop.getPackageProperties().setDescriptionProperty(String(wdxSimpleStyle[key]))
                break;
                case "PROP_KEYWORDS":
                    prop.getPackageProperties().setKeywordsProperty(String(wdxSimpleStyle[key]))
                break;
                case "PROP_LASTMODAUTHOR":
                    prop.getPackageProperties().setLastModifiedByProperty(String(wdxSimpleStyle[key]))
                break;
                case "PROP_REVISION":
                    prop.getPackageProperties().setRevisionProperty(String(wdxSimpleStyle[key]))
                break;
                case "PROP_VERSION":
                    prop.getPackageProperties().setVersionProperty(String(wdxSimpleStyle[key]))
                break;
                case "PROP_SUBJECT":
                    prop.getPackageProperties().setSubjectProperty(String(wdxSimpleStyle[key]))
                break;
                //------------------------------------------------------------------------------//
                case "TBL_BORDERS":
                    var p = prop.isSetTblBorders() ? prop.getTblBorders() : prop.addNewTblBorders();
                    this.setProp(p,wdxSimpleStyle[key]);
                break;
                case "TBL_BORDER_TOP":
                    var p = prop.isSetTop() ? prop.getTop() : prop.addNewTop();
                    this.setProp(p,wdxSimpleStyle[key]);
                break;
                case "TBL_SHADING":
                    var p = prop.isSetShd() ? prop.getShd() : prop.addNewShd();
                    this.setProp(p,wdxSimpleStyle[key]);
                break;
                case "TBL_JC":
                    var p = prop.isSetJc() ? prop.getJc() : prop.addNewJc();
                    p.setVal(wdxSimpleStyle[key]);
                break;
                case "TBL_BIDI":
                    var p = prop.isSetBidiVisual() ? prop.getBidiVisual() : prop.addNewBidiVisual();
                    p.setVal(wdxSimpleStyle[key]);
                break;
                case "TBL_CELLMAR":
                    var p = prop.isSetTblCellMar() ? prop.getTblCellMar() : prop.addNewTblCellMar();
                    this.setProp(p,wdxSimpleStyle[key]);
                break;
                case "TBL_CELLSPACING":
                    var p = prop.isSetTblCellSpacing() ? prop.getTblCellSpacing() : prop.addNewTblCellSpacing();
                    this.setProp(p,wdxSimpleStyle[key]);
                break;
                case "TBL_IND":
                    var p = prop.isSetTblInd() ? prop.getTblInd() : prop.addNewTblInd();
                    this.setProp(p,wdxSimpleStyle[key]);
                break;
                case "TBL_LAYOUT":
                    var p = prop.isSetTblLayout() ? prop.getTblLayout() : prop.addNewTblLayout();
                    p.setType(wdxSimpleStyle[key]);
                break;
                case "TBL_LOOK":
                    var p = prop.isSetTblLook() ? prop.getTblLook() : prop.addNewTblLook();
                    p.setVal(wdxSimpleStyle[key]);
                break;
                case "TBL_OVERLAP":
                    var p = prop.isSetTblOverlap() ? prop.getTblOverlap() : prop.addNewTblOverlap();
                    this.setProp(p,wdxSimpleStyle[key]);
                break;
                case "TBL_STYLE":
                    var p = prop.isSetTblStyle() ? prop.getTblStyle() : prop.addNewTblStyle();
                    p.setVal(String(wdxSimpleStyle[key]));
                break;
                case "TBL_WIDTH":
                    var p = prop.isSetTblW() ? prop.getTblW() : prop.addNewTblW();
                    this.setProp(p,wdxSimpleStyle[key]);
                break;
                case "TBL_COLBANDSIZE":
                    var p = prop.isSetTblStyleColBandSize() ? prop.getTblStyleColBandSize() : prop.addNewTblStyleColBandSize();
                    p.setVal(new java.math.BigInteger(String(wdxSimpleStyle[key])));
                break;
                case "TBL_ROWBANDSIZE":
                    var p = prop.isSetTblStyleRowBandSize() ? prop.getTblStyleRowBandSize() : prop.addNewTblStyleRowBandSize();
                    p.setVal(new java.math.BigInteger(String(wdxSimpleStyle[key])));
                break;
                //------------------------------------------------------------------------------//
                case "TBL_BORDER_BOTTOM":
                    var p = prop.isSetBottom() ? prop.getBottom() : prop.addNewBottom();
                    this.setProp(p,wdxSimpleStyle[key]);
                break;
                case "TBL_BORDER_LEFT":
                    var p = prop.isSetLeft() ? prop.getLeft() : prop.addNewLeft();
                    this.setProp(p,wdxSimpleStyle[key]);
                break;
                case "TBL_BORDER_RIGHT":
                    var p = prop.isSetRight() ? prop.getRight() : prop.addNewRight();
                    this.setProp(p,wdxSimpleStyle[key]);
                break;
                case "TBL_BORDER_INSIDEH":
                    var p = prop.isSetInsideH() ? prop.getInsideH() : prop.addNewInsideH();
                    this.setProp(p,wdxSimpleStyle[key]);
                break;
                case "TBL_BORDER_INSIDEV":
                    var p = prop.isSetInsideV() ? prop.getInsideV() : prop.addNewInsideV();
                    this.setProp(p,wdxSimpleStyle[key]);
                break;
                //------------------------------------------------------------------------------//
                case "BORDER_COLOR":
                    prop.setColor(new java.lang.String(wdxSimpleStyle[key]));
                break;
                case "BORDER_FRAME":
                    prop.setFrame(wdxSimpleStyle[key]);
                break;
                case "BORDER_SHADOW":
                    prop.setShadow(wdxSimpleStyle[key]);
                break;
                case "BORDER_SPACE":
                    prop.setSpace(new java.math.BigInteger(String(wdxSimpleStyle[key])));
                break;
                case "BORDER_SZ":
                    prop.setSz(new java.math.BigInteger(String(wdxSimpleStyle[key])));
                break;
                case "BORDER_THEMECOLOR":
                    prop.setThemeColor(wdxSimpleStyle[key]);
                break;
                case "BORDER_STYLE":
                    prop.setVal(wdxSimpleStyle[key]);
                break;
                //------------------------------------------------------------------------------//
                case "TBL_SHADING_COLOR":
                    prop.setColor(new java.lang.String(wdxSimpleStyle[key]));
                break;
                case "TBL_SHADING_FILL":
                    prop.setFill(wdxSimpleStyle[key]);
                break;
                case "TBL_SHADING_THEMECOLOR":
                    prop.setThemeColor(wdxSimpleStyle[key]);
                break;
                case "TBL_SHADING_THEMEFILL":
                    prop.setThemeFill(wdxSimpleStyle[key]);
                break;
                case "TBL_SHADING_STYLE":
                    prop.setVal(String(wdxSimpleStyle[key]));
                break;
                //------------------------------------------------------------------------------//
                case "TBL_CELLMAR_LEFT":
                    var p = prop.isSetLeft() ? prop.getLeft() : prop.addNewLeft();
                    this.setProp(p,wdxSimpleStyle[key]);
                break;
                case "TBL_CELLMAR_RIGHT":
                    var p = prop.isSetRight() ? prop.getRight() : prop.addNewRight();
                    this.setProp(p,wdxSimpleStyle[key]);
                break;
                case "TBL_CELLMAR_TOP":
                    var p = prop.isSetTop() ? prop.getTop() : prop.addNewTop();
                    this.setProp(p,wdxSimpleStyle[key]);
                break;
                case "TBL_CELLMAR_BOTTOM":
                    var p = prop.isSetBottom() ? prop.getBottom() : prop.addNewBottom();
                    this.setProp(p,wdxSimpleStyle[key]);
                break;
                //------------------------------------------------------------------------------//
                case "TBL_S_WIDTH":
                    prop.setW(new java.math.BigInteger(String(wdxSimpleStyle[key])));
                break;
                case "TBL_S_TYPE":
                    prop.setType(wdxSimpleStyle[key]);
                break;
                //------------------------------------------------------------------------------//
                case "CT_HEIGHT_RULE":
                    prop.setHRule(wdxSimpleStyle[key]);
                break;
                case "CT_HEIGHT":
                    prop.setVal(new java.math.BigInteger(String(wdxSimpleStyle[key])));
                break;
                //------------------------------------------------------------------------------//
                case "TBL_ROW_CANTSPLIT":
                    var p = prop.isSetCantSplit() ? prop.getCantSplit() : prop.addNewCantSplit();
                    p.setVal(wdxSimpleStyle[key]);
                break;
                case "TBL_ROW_CNFSTYLE":
                    var p = prop.isSetCnfStyle() ? prop.getCnfStyle() : prop.addNewCnfStyle();
                    p.setVal(wdxSimpleStyle[key]);
                break;
                case "TBL_ROW_DIVID":
                    var p = prop.isSetDivId() ? prop.getDivId() : prop.addNewDivId();
                    var val = x2006.CTDecimalNumber.Factory.newInstance();
                    val.setVal(new java.math.BigInteger(String(wdxSimpleStyle[key])));
                    p.setVal(val);
                break;
                case "TBL_ROW_GRIDAFTER":
                    var p = prop.isSetGridAfter() ? prop.getGridAfter() : prop.addNewGridAfter();
                    var val = x2006.CTDecimalNumber.Factory.newInstance();
                    val.setVal(new java.math.BigInteger(String(wdxSimpleStyle[key])));
                    p.setVal(val);
                break;
                case "TBL_ROW_GRIDBEFORE":
                    var p = prop.isSetGridBefore() ? prop.getGridBefore() : prop.addNewGridBefore();
                    var val = x2006.CTDecimalNumber.Factory.newInstance();
                    val.setVal(new java.math.BigInteger(String(wdxSimpleStyle[key])));
                    p.setVal(val);
                break;
                case "TBL_ROW_HIDDEN":
                    var p = prop.isSetHidden() ? prop.getHidden() : prop.addNewHidden();
                    p.setVal(wdxSimpleStyle[key]);
                break;
                case "TBL_ROW_JC":
                    var p = prop.isSetJc() ? prop.getJc() : prop.addNewJc();
                    p.setVal(wdxSimpleStyle[key]);
                break;
                case "TBL_ROW_CELLSPACING":
                    var p = prop.isSetTblCellSpacing() ? prop.getTblCellSpacing() : prop.addNewTblCellSpacing();
                    this.setProp(p,wdxSimpleStyle[key]);
                break;
                case "TBL_ROW_HEADER":
                    var p = prop.isSetHeader() ? prop.getHeader() : prop.addNewHeader();
                    p.setVal(wdxSimpleStyle[key]);
                break;
                case "TBL_ROW_HEIGHT":
                    var p = prop.isSetTrHeight() ? prop.getTrHeight() : prop.addNewTrHeight();
                    this.setProp(p,wdxSimpleStyle[key]);
                break;
                case "TBL_ROW_WAFTER":
                    var p = prop.isSetWAfter() ? prop.getWAfter() : prop.addNewWAfter();
                    this.setProp(p,wdxSimpleStyle[key]);
                break;
                case "TBL_ROW_WBEFORE":
                    var p = prop.isSetWBefore() ? prop.getWBefore() : prop.addNewWBefore();
                    this.setProp(p,wdxSimpleStyle[key]);
                break;
                //------------------------------------------------------------------------------//
                case "TBL_CELL_CNFSTYLE":
                    var p = prop.isSetCnfStyle() ? prop.getCnfStyle() : prop.addNewCnfStyle();
                    p.setVal(wdxSimpleStyle[key]);
                break;
                case "TBL_CELL_GRIDSPAN":
                    var p = prop.isSetGridSpan() ? prop.getGridSpan() : prop.addNewGridSpan();
                    var val = x2006.CTDecimalNumber.Factory.newInstance();
                    val.setVal(new java.math.BigInteger(String(wdxSimpleStyle[key])));
                    p.setVal(val);
                break;
                case "TBL_CELL_HMERGE":
                    var p = prop.isSetHMerge() ? prop.getHMerge() : prop.addNewHMerge();
                    p.setVal(wdxSimpleStyle[key]);
                break;
                case "TBL_CELL_HIDEMARK":
                    var p = prop.isSetHideMark() ? prop.getHideMark() : prop.addNewHideMark();
                    p.setVal(wdxSimpleStyle[key]);
                break;
                case "TBL_CELL_NOWRAP":
                    var p = prop.isSetNoWrap() ? prop.getNoWrap() : prop.addNewNoWrap();
                    p.setVal(wdxSimpleStyle[key]);
                break;
                case "TBL_CELL_SHADING":
                    var p = prop.isSetShd() ? prop.getShd() : prop.addNewShd();
                    this.setProp(p,wdxSimpleStyle[key]);
                break;
                case "TBL_CELL_BORDERS":
                    var p = prop.isSetTcBorders() ? prop.getTcBorders() : prop.addNewTcBorders();
                    this.setProp(p,wdxSimpleStyle[key]);
                break;
                case "TBL_CELL_FITTEXT":
                    var p = prop.isSetFitText() ? prop.getFitText() : prop.addNewFitText();
                    p.setVal(wdxSimpleStyle[key]);
                break;
                case "TBL_CELL_MAR":
                    var p = prop.isSetTcMar() ? prop.getTcMar() : prop.addNewTcMar();
                    this.setProp(p,wdxSimpleStyle[key]);
                break;
                case "TBL_CELL_WIDTH":
                    var p = prop.isSetTcW() ? prop.getTcW() : prop.addNewTcW();
                    this.setProp(p,wdxSimpleStyle[key]);
                break;
                case "TBL_CELL_DIR":
                    var p = prop.isSetTextDirection() ? prop.getTextDirection() : prop.addNewTextDirection();
                    p.setVal(wdxSimpleStyle[key]);
                break;
                case "TBL_CELL_VALIGN":
                    var p = prop.isSetVAlign() ? prop.getVAlign() : prop.addNewVAlign();
                    p.setVal(wdxSimpleStyle[key]);
                break;
                case "TBL_CELL_VMERGE":
                    var p = prop.isSetVMerge() ? prop.getVMerge() : prop.addNewVMerge();
                    p.setVal(wdxSimpleStyle[key]);
                break;
                //------------------------------------------------------------------------------//
                case "TBL_CELL_BORDER_BOTTOM":
                    var p = prop.isSetBottom() ? prop.getBottom() : prop.addNewBottom();
                    this.setProp(p,wdxSimpleStyle[key]);
                break;
                case "TBL_CELL_BORDER_INSIDEH":
                    var p = prop.isSetInsideH() ? prop.getInsideH() : prop.addNewInsideH();
                    this.setProp(p,wdxSimpleStyle[key]);
                break;
                case "TBL_CELL_BORDER_INSIDEV":
                    var p = prop.isSetInsideV() ? prop.getInsideV() : prop.addNewInsideV();
                    this.setProp(p,wdxSimpleStyle[key]);
                break;
                case "TBL_CELL_BORDER_LEFT":
                    var p = prop.isSetLeft() ? prop.getLeft() : prop.addNewLeft();
                    this.setProp(p,wdxSimpleStyle[key]);
                break;
                case "TBL_CELL_BORDER_RIGHT":
                    var p = prop.isSetRight() ? prop.getRight() : prop.addNewRight();
                    this.setProp(p,wdxSimpleStyle[key]);
                break;
                case "TBL_CELL_BORDER_TL2BR":
                    var p = prop.isSetTl2Br() ? prop.getTl2Br() : prop.addNewTl2Br();
                    this.setProp(p,wdxSimpleStyle[key]);
                break;
                case "TBL_CELL_BORDER_TOP":
                    var p = prop.isSetTop() ? prop.getTop() : prop.addNewTop();
                    this.setProp(p,wdxSimpleStyle[key]);
                break;
                case "TBL_CELL_BORDER_TR2BL":
                    var p = prop.isSetTr2Bl() ? prop.getTr2Bl() : prop.addNewTr2Bl();
                    this.setProp(p,wdxSimpleStyle[key]);
                break;
                //------------------------------------------------------------------------------//
                //TBL_CELL_MAR=TBL_CELLMAR_PROP
                //------------------------------------------------------------------------------//
                case "STYLE_BASED_ON":
                    var p = prop.isSetBasedOn() ? prop.getBasedOn() : prop.addNewBasedOn();
                    p.setVal(wdxSimpleStyle[key]);
                break;
                case "STYLE_NAME":
                    var p = prop.isSetName() ? prop.getName() : prop.addNewName();
                    p.setVal(wdxSimpleStyle[key]);
                    prop.setStyleId(wdxSimpleStyle[key]);
                break;
                case "STYLE_TYPE":
                    prop.setType(wdxSimpleStyle[key]);
                break;
                case "STYLE_PAR":
                    var p = prop.isSetPPr() ? prop.getPPr() : prop.addNewPPr();
                    this.setProp(p,wdxSimpleStyle[key]);
                break;
                case "STYLE_RUN":
                    var p = prop.isSetRPr() ? prop.getRPr() : prop.addNewRPr();
                    this.setProp(p,wdxSimpleStyle[key]);
                break;
                //------------------------------------------------------------------------------//
                case "NUM_ABS_ID":
                    var p = prop.isSetAbstractNumId() ? prop.getAbstractNumId() : prop.addNewAbstractNumId();
                    var val = x2006.CTDecimalNumber.Factory.newInstance();
                    val.setVal(new java.math.BigInteger(String(wdxSimpleStyle[key])));
                    p.setVal(val);
                break;
                case "NUM_ID":
                    var p = prop.isSetNumId() ? prop.getNumId() : prop.addNewNumId();
                    p.setVal(new java.math.BigInteger(String(wdxSimpleStyle[key])));
                break;
                case "NUM_LVL":
                    prop.addNewLvlOverride();
                break;
                case "NUM_ILVL":
                    var p = prop.getLvlOverrideArray(prop.getLvlOverrideArray().length-1);
                    p.setIlvl(new java.math.BigInteger(String(wdxSimpleStyle[key])));
                    var p = p.isSetLvl() ? p.getLvl() : p.addNewLvl();
                    p.setIlvl(new java.math.BigInteger(String(wdxSimpleStyle[key])));
                break;
                case "NUM_FMT":
                    var p = prop.getLvlOverrideArray(prop.getLvlOverrideArray().length-1);
                    var p1 = p.isSetLvl() ? p.getLvl() : p.addNewLvl();
                    var p = p1.isSetNumFmt() ? p1.getNumFmt() : p1.addNewNumFmt();
                    p.setVal(wdxSimpleStyle[key]);
                    //wild hardcode for bullets
                    if (wdxSimpleStyle[key]==wdxConstants.NUMFMT_BULLET){
                        var tPr = p1.isSetRPr() ? p1.getRPr() : p1.addNewRPr();
                        this.setProp(tPr,{RUN_FONT:"Symbol"});
                        var tPr = p1.isSetPPr() ? p1.getPPr() : p1.addNewPPr();
                        this.setProp(tPr,{PAR_IND_FIRST:500});
                    }
                break;
                case "NUM_LVL_START":
                    var p = prop.getLvlOverrideArray(prop.getLvlOverrideArray().length-1);
                    var p = p.isSetLvl() ? p.getLvl() : p.addNewLvl();
                    var val = x2006.CTDecimalNumber.Factory.newInstance();
                    val.setVal(new java.math.BigInteger(String(wdxSimpleStyle[key])));
                    p.setStart(val);
                break;
                case "NUM_LVL_TEXT":
                    var p = prop.getLvlOverrideArray(prop.getLvlOverrideArray().length-1);
                    var p = p.isSetLvl() ? p.getLvl() : p.addNewLvl();
                    var p = p.isSetLvlText() ? p.getLvlText() : p.addNewLvlText();
                    p.setVal(String(wdxSimpleStyle[key]));
                break;
                case "NUM_PSTYLE":
                    var p = prop.getLvlOverrideArray(prop.getLvlOverrideArray().length-1);
                    var p1 = p.isSetLvl() ? p.getLvl() : p.addNewLvl();
                    var tPr = p1.isSetPPr() ? p1.getPPr() : p1.addNewPPr();
                    this.setProp(tPr,wdxSimpleStyle[key]);
                break;
                case "NUM_PSTYLE":
                    var p = prop.getLvlOverrideArray(prop.getLvlOverrideArray().length-1);
                    var p1 = p.isSetLvl() ? p.getLvl() : p.addNewLvl();
                    var tPr = p1.isSetRPr() ? p1.getRPr() : p1.addNewRPr();
                    this.setProp(tPr,wdxSimpleStyle[key]);
                break;
                //------------------------------------------------------------------------------//
                case "ANUM_MULTI_LEVEL_TYPE":
                    var p = prop.isSetMultiLevelType() ? prop.getMultiLevelType() : prop.addNewMultiLevelType();
                    p.setType(wdxSimpleStyle[key]);
                break;
                case "ANUM_NAME":
                    var p = prop.isSetName() ? prop.getName() : prop.addNewName();
                    p.setVal(wdxSimpleStyle[key]);
                break;
                case "ANUM_STYLE_LINK":
                    var p = prop.isSetNumStyleLink() ? prop.getNumStyleLink() : prop.addNewNumStyleLink();
                    p.setVal(wdxSimpleStyle[key]);
                break;
                case "ANUM_STYLE_LINK":
                    var p = prop.isSetNumStyleLink() ? prop.getNumStyleLink() : prop.addNewNumStyleLink();
                    p.setVal(wdxSimpleStyle[key]);
                break;
                case "ANUM_LVL":
                    prop.addNewLvl();
                break;
                case "ANUM_NUM_FMT":
                    var p = prop.getLvlArray(prop.getLvlArray().length-1);
                    var p = p.isSetNumFmt() ? p.getNumFmt() : p.addNewNumFmt();
                    p.setVal(wdxSimpleStyle[key]);
                break;
                //------------------------------------------------------------------------------//
                case "BREAK_TYPE":
                    prop.setType(wdxSimpleStyle[key]);
                break;
                case "BREAK_CLEAR":
                    prop.setCLear(wdxSimpleStyle[key]);
                break;
            }
        }
    }
};

//creates new output .docx object
function wdxWord(){
    this.createSettings =   function(){this.settings = wdxServFunctions.getItem(this.item.file,wdxServConstants.IT_SETTINGS);};
    this.createStyles =     function(){this.styles = wdxServFunctions.getItem(this.item.file,wdxServConstants.IT_STYLES);};
    this.createFootnotes =  function(){this.footnotes = wdxServFunctions.getItem(this.item.file,wdxServConstants.IT_FOOTNOTES);};
    this.createEndnotes =   function(){this.endnotes = wdxServFunctions.getItem(this.item.file,wdxServConstants.IT_ENDNOTES);};
    this.createNumbering =  function(){this.numbering = wdxServFunctions.getItem(this.item.file,wdxServConstants.IT_NUMBERING);};
    this.createSection = function(wdxSimpleStyle){
        for (var i=0;i<this.childs.length;i++)
            this.childs[i].last=false;
        var t = new wdxWordSection(this,wdxSimpleStyle);
        this.childs.push(t);
        return t;
    };
    this.createStyle = function(style){
        if (this.styles==null) this.createStyles();
        var t = new wdxWordStyle(this.styles,style);
        this.styles.childs.push(t);
        return t;
    };
    this.createAbstractNum = function(){
        if (this.numbering==null) this.createNumbering();
        var t = new wdxWordAbstractNum(this.numbering);
        this.numbering.childs.push(t);
        return t;
    };
    this.createNum = function(wdxAbstractNumbering){
        if (this.numbering==null) this.createNumbering();
        var t = new wdxWordNum(this.numbering,wdxAbstractNumbering);
        this.numbering.childs.push(t);
        return t;
    };
    this.getSectionById = function(id){return this.childs[id];};
    this.setSettings = function (wdxSettings){
        this.setStyle = function(style){
            wdxServFunctions.setProp(this.settings.doc,style);
        };
        if (this.settings==null) this.createSettings();
        this.setStyle(wdxSettings);
    };
    this.setProperties = function(wdxProp){
        wdxServFunctions.setProp(this.pack,wdxProp);
    }
    this.writeReport = function(filename){
        if (filename==null){
            filename = Context.getSelectedFile();
            if (Context.getSelectedFormat()==Constants.OutputDOC) filename = filename+"x";
        }
        if (this.footnotes!=null) wdxServFunctions.saveDoc(this.footnotes);
        if (this.styles!=null) wdxServFunctions.saveDoc(this.styles);
        if (this.endnotes!=null)  wdxServFunctions.saveDoc(this.endnotes);
        if (this.numbering!=null) wdxServFunctions.saveDoc(this.numbering);
        wdxServFunctions.saveDoc(this);

        wdxServFunctions.savePart(this.item,wdxServConstants.QNAME_DOCUMENT);
        wdxServFunctions.savePart(this.settings,wdxServConstants.QNAME_SETTINGS);
        wdxServFunctions.savePart(this.styles,wdxServConstants.QNAME_STYLES);
        wdxServFunctions.savePart(this.footnotes,wdxServConstants.QNAME_FOOTNOTES);
        wdxServFunctions.savePart(this.endnotes,wdxServConstants.QNAME_ENDNOTES);
        wdxServFunctions.savePart(this.numbering,wdxServConstants.QNAME_NUMBERING);
        this.pack.close();
        Context.addOutputFile(filename,this.os.toByteArray());
    };

    this.os = wdxServFunctions.getOutputStream();

    this.pack = wdxServFunctions.getOutputFile(this.os);
    //this.pack.getPackageProperties().setCreatorProperty("Generated by wdxLibrary over OpenXML4J");
    this.item = wdxServFunctions.getItem(this.pack,wdxServConstants.IT_DOCUMENT);

    this.childs=[];//sections
    //variables for sequential output
    this.flClosePrevTag = false;
    this.lastOut = this;

    function findLastPart(oObj){
        if (oObj.childs!=null)
            if (oObj.childs.length!=0)
                return findLastPart(oObj.childs[oObj.childs.length-1]);
        return oObj;
    }
    function getWordObject(oObj){
        if (oObj.parent!=null)
            return getWordObject(oObj.parent);
        return oObj;
    }
    function findLastPartWithMethod(oObj,methodName){
        if (oObj!=null){
            if (oObj[methodName]==null)
                return findLastPartWithMethod(oObj.parent,methodName);
            else
                return oObj;
        }
    }
    //methods for sequential output
    this.endTable = function(){
        this.lastOut = findLastPartWithMethod(this.lastOut,"createTable");
    };
    this.endFootnote = function(){
        this.lastOut = findLastPart(getWordObject(this));
    };
    this.endEndnote = function(){
        this.lastOut = findLastPart(getWordObject(this));
    };
    this.endHeader = function(){
        this.lastOut = findLastPartWithMethod(this.lastOut,"createHeader");
    };
    this.endFooter = function(){
        this.lastOut = findLastPartWithMethod(this.lastOut,"createFooter");
    };
    this.outSection = function(style){
        var oObj = this;
        oObj = findLastPartWithMethod(this.lastOut,"createSection");
        this.lastOut = oObj.createSection(style);
        return this.lastOut;
    };
    this.outLine = function(style){
        var oObj = this;
        oObj = findLastPartWithMethod(this.lastOut,"createParagraph");
        this.lastOut = oObj.createParagraph(style);
        return this.lastOut;
    };
    this.outText = function(text,style){
        var oObj = this;
        oObj = findLastPartWithMethod(this.lastOut,"createRun");
        this.lastOut = oObj.createRun(text,style);
        return this.lastOut;
    };
    this.outTable = function(style){
        var oObj = this;
        oObj = findLastPartWithMethod(this.lastOut,"createTable");
        this.lastOut = oObj.createTable(style);
        return this.lastOut;
    };
    this.outRow = function(style){
        var oObj = this;
        oObj = findLastPartWithMethod(this.lastOut,"createRow");
        this.lastOut = oObj.createRow(style);
        return this.lastOut;
    };
    this.outCell = function(style){
        var oObj = this;
        oObj = findLastPartWithMethod(this.lastOut,"createCell");
        this.lastOut = oObj.createCell(style);
        return this.lastOut;
    };
    this.outHyperlink = function(text,internalLink,externalLink,style){
        var oObj = this;
        oObj = findLastPartWithMethod(this.lastOut,"createHyperlink");
        this.lastOut = oObj.createHyperlink(text,internalLink,externalLink,style);
        return this.lastOut;
    };
    this.addBookmarkStart = function(name,hidden){
        var oObj = this;
        oObj = findLastPartWithMethod(this.lastOut,"createStartBookmark");
        return oObj.createStartBookmark(name,hidden);
    };
    this.addBookmarkEnd = function(){
        var oObj = this;
        oObj = findLastPartWithMethod(this.lastOut,"createEndBookmark");
        return oObj.createEndBookmark();
    };
    this.outFootnote = function(style,styleP,styleR){
        var oObj = this;
        oObj = findLastPartWithMethod(this.lastOut,"createFootnote");
        this.lastOut = oObj.createFootnote(style,styleP,styleR).note.ref;
        return this.lastOut;
    };
    this.outEndnote = function(style,styleP,styleR){
        var oObj = this;
        oObj = findLastPartWithMethod(this.lastOut,"createEndnote");
        this.lastOut = oObj.createEndnote(style,styleP,styleR).note.ref;
        return this.lastOut;
    };
    this.outGraphic = function(picData,extension,param1,param2){
        var oObj = this;
        oObj = findLastPartWithMethod(this.lastOut,"createPicture");
        this.lastOut = oObj.createPicture(picData,extension,param1,param2);
        return this.lastOut;
    };
    this.outEmbeddedFile = function(objData,extension){
        var oObj = this;
        oObj = findLastPartWithMethod(this.lastOut,"createObject");
        this.lastOut = oObj.createObject(objData,extension);
        return this.lastOut;
    };
    this.outField = function(field,style,separate){
        var oObj = this;
        oObj = findLastPartWithMethod(this.lastOut,"createField");
        this.lastOut = oObj.createField(field,style,separate);
        return this.lastOut;
    };
    this.outHeader = function(type){
        var oObj = this;
        oObj = findLastPartWithMethod(this.lastOut,"createHeader");
        this.lastOut = oObj.createHeader(type);
        return this.lastOut;
    };
    this.outFooter = function(type){
        var oObj = this;
        oObj = findLastPartWithMethod(this.lastOut,"createFooter");
        this.lastOut = oObj.createFooter(type);
        return this.lastOut;
    };
    this.outBreak = function(style,styleBr){
        var oObj = this;
        oObj = findLastPartWithMethod(this.lastOut,"createBreak");
        this.lastOut = oObj.createBreak(style,styleBr);
        return this.lastOut;
    };
}

function wdxWordSection(parent,wdxSimpleStyle){
    this.setStyle = function(style){
        wdxServFunctions.setProp(this.item,style);
    };
    this.collect = function(){
        for (var i=0;i<this.childs.length;i++){
            if (this.childs[i].item!=null)
                switch (String(this.childs[i].item.type)){
                    case String("T=CT_Bookmark@http://schemas.openxmlformats.org/wordprocessingml/2006/main"): this.parent.item.doc.addNewBookmarkStart().set(this.childs[i].item); break;
                    case String("T=CT_MarkupRange@http://schemas.openxmlformats.org/wordprocessingml/2006/main"): this.parent.item.doc.addNewBookmarkEnd().set(this.childs[i].item); break;
                    case String("T=CT_Tbl@http://schemas.openxmlformats.org/wordprocessingml/2006/main"): this.parent.item.doc.addNewTbl().set(this.childs[i].item); break;
                    default: this.parent.item.doc.addNewP().set(this.childs[i].item); break;
                }
        }
        if (!this.last)
            this.parent.item.doc.addNewP().addNewPPr().addNewSectPr().set(this.item);
        else
            this.parent.item.doc.addNewSectPr().set(this.item);
        for (var i=0;i<this.headers.length;i++){
            wdxServFunctions.saveDoc(this.headers[i]);
            wdxServFunctions.savePart(this.headers[i].item,wdxServConstants.QNAME_HEADER);
        }
        for (var i=0;i<this.footers.length;i++){
            wdxServFunctions.saveDoc(this.footers[i]);
            wdxServFunctions.savePart(this.footers[i].item,wdxServConstants.QNAME_FOOTER);
        }
    };
    this.createHeader = function(type){var t = new wdxWordHeader(this,type); this.headers.push(t); return t;};
    this.createFooter = function(type){var t = new wdxWordFooter(this,type); this.footers.push(t); return t;};
    this.createParagraph = function(wdxSimpleStyle){var t = new wdxWordParagraph(this,wdxSimpleStyle); this.childs.push(t); return t;};
    this.getParagraphById = function(id){return this.childs[id];};
    this.createStartBookmark = function(name,hidden){var t = new wdxWordStartBookmark(this,name,hidden); this.childs.push(t); return t;};
    this.createEndBookmark = function(){var t = new wdxWordEndBookmark(this); this.childs.push(t); return t;};
    this.createHeading = function(text,wdxSimpleStyle){var t = new wdxWordHeading(this,text,wdxSimpleStyle); this.childs.push(t); return t;};
    this.createTOC = function(){var t = new wdxWordTOC(this); this.childs.push(t); return t;};
    this.createTable = function(wdxSimpleStyle){var t = new wdxWordTable(this,wdxSimpleStyle); this.childs.push(t); return t;};

    this.parent = parent;
    this.item = wdxServConstants.CT_SECTION.Factory.newInstance();
    this.setStyle({PAGE_SIZE:wdxConstants.PAGE_SIZE_DEFAULT,PAGE_ORIENT:wdxConstants.PAGE_ORIENT_PORTRAIT});
    this.setStyle({PAGE_MARGIN_LEFT:1700,PAGE_MARGIN_RIGHT:850,PAGE_MARGIN_TOP:1133,PAGE_MARGIN_BOTTOM:1133});
    if (wdxSimpleStyle!=null) this.setStyle(wdxSimpleStyle);
    this.last = true;
    this.childs = [];//paragraphs
    this.headers = [];
    this.footers = [];
}

function wdxWordParagraph(parent,wdxSimpleStyle){
    this.collect = function(){
        for (var i=0;i<this.childs.length;i++)
            switch (String(this.childs[i].item.type)){
                case String("T=CT_Bookmark@http://schemas.openxmlformats.org/wordprocessingml/2006/main"): this.item.addNewBookmarkStart().set(this.childs[i].item); break;
                case String("T=CT_MarkupRange@http://schemas.openxmlformats.org/wordprocessingml/2006/main"): this.item.addNewBookmarkEnd().set(this.childs[i].item); break;
                case String("T=CT_Hyperlink@http://schemas.openxmlformats.org/wordprocessingml/2006/main"): this.item.addNewHyperlink().set(this.childs[i].item); break;
                default: this.item.addNewR().set(this.childs[i].item); break;
            }
    };
    this.setStyle = function(style){
        wdxServFunctions.setProp(this.item,style);
    };
    this.createRun = function(text,wdxSimpleStyle){var t = new wdxWordRun(this,text,wdxSimpleStyle);this.childs.push(t);return t;};
    this.createFootnote = function(wdxSimpleStyle,wdxSimpleStyleP,wdxSimpleStyleR){var t = new wdxWordFootnoteRef(this,wdxSimpleStyle,wdxSimpleStyleP,wdxSimpleStyleR);this.childs.push(t);return t;};
    this.createEndnote = function(wdxSimpleStyle,wdxSimpleStyleP,wdxSimpleStyleR){var t = new wdxWordEndnoteRef(this,wdxSimpleStyle,wdxSimpleStyleP,wdxSimpleStyleR);this.childs.push(t);return t;};
    this.createPicture = function(picData,extension,param1,param2){var t = new wdxWordPicture(this,picData,extension,param1,param2); this.childs.push(t); return t;};
    this.createObject = function(objData,extension){var t = new wdxWordEmbeddedObject(this,objData,extension); this.childs.push(t); return t;};
    this.createField = function(field,wdxSimpleStyle,separate){var t = new wdxWordFieldSimple(this,field,wdxSimpleStyle,separate);this.childs.push(t);return t;};
    this.createHyperlink = function(text,internalLink,externalLink,wdxSimpleStyle){var t = new wdxWordHyperlink(this,text,internalLink,externalLink,wdxSimpleStyle);this.childs.push(t);return t;};
    this.addStartBookmark = function(tID){var t = new wdxWordStartBookmark(this,tID); this.childs.push(t); return t;};
    this.addEndBookmark = function(){var t = new wdxWordEndBookmark(this); this.childs.push(t); return t;};
    this.createBreak = function(wdxWordSimpleBr,wdxWordSimpleR){var t = new wdxWordBreak(this,wdxWordSimpleBr,wdxWordSimpleR);this.childs.push(t);return t;};

    this.getRunById = function(id){return this.childs[id];};

    this.parent = parent;
    this.item = wdxServConstants.CT_PARAGRAPH.Factory.newInstance();

    if (wdxSimpleStyle!=null) this.setStyle(wdxSimpleStyle);
    this.childs = [];//runs
}

function wdxWordRun(parent,text,wdxSimpleStyle){
    this.setText = function(str){wdxServFunctions.setProp(this.item,{"RUN_TXT":str});};
    this.setStyle = function(style){
        wdxServFunctions.setProp(this.item,style);
    };
    //this.createStartBookmark = function(){var t = new wdxWordStartBookmark(this); this.childs.push(t); return t};
    //this.createEndBookmark = function(){var t = new wdxWordEndBookmark(this); this.childs.push(t); return t};
    this.parent = parent;
    this.item = wdxServConstants.CT_RUN.Factory.newInstance();
    if (wdxSimpleStyle!=null) this.setStyle(wdxSimpleStyle);
    if (text!=null) this.setText(text);
}

function wdxWordBreak(parent,wdxSimpleStyleBr,wdxSimpleStyleR){
    this.setStyle = function(style){
        wdxServFunctions.setProp(this.item,style);
    };
    this.setStyleBr = function(style){
        wdxServFunctions.setProp(this.br,style);
    };
    this.parent = parent;
    this.item = wdxServConstants.CT_RUN.Factory.newInstance();
    if (wdxSimpleStyleR!=null) this.setStyle(wdxSimpleStyleR);
    this.br = this.item.addNewBr();
    if (wdxSimpleStyleBr!=null) this.setStyleBr(wdxSimpleStyleBr);
}

function wdxWordFootnoteRef(parent,wdxSimpleStyle,wdxSimpleStyleP,wdxSimpleStyleR){
    this.setStyle = function(style){
        wdxServFunctions.setProp(this.item,style);
    };
    this.parent = parent;
    this.id = ++wdxCounter.FOOTNOTES;
    this.item = wdxServConstants.CT_RUN.Factory.newInstance();
    this.item.addNewFootnoteReference().setId(new java.math.BigInteger(String(this.id)));
    this.setStyle({RUN_SCRIPT:wdxConstants.SCR_SUPERSCRIPT});
    if (wdxSimpleStyle!=null) this.setStyle(wdxSimpleStyle);
    var footnotes = wdxServFunctions.getTopPart(this,"footnotes");
    this.note = new wdxWordFootnote(footnotes,this.id,wdxSimpleStyleP,wdxSimpleStyleR);
    footnotes.childs.push(this.note);
}

function wdxWordFootnote(parent,id,wdxSimpleStyleP,wdxSimpleStyleR){
    this.createParagraph = function(wdxSimpleStyle){var t = new wdxWordParagraph(this,wdxSimpleStyle); this.childs.push(t); return t;};
    this.createTable = function(wdxSimpleStyle){var t = new wdxWordTable(this,wdxSimpleStyle); this.childs.push(t); return t;};
    this.collect = function(){
        for (var i=0;i<this.childs.length;i++)
            switch (String(this.childs[i].item.type)){
                case String("T=CT_Tbl@http://schemas.openxmlformats.org/wordprocessingml/2006/main"): this.item.addNewTbl().set(this.childs[i].item); break;
                default: this.item.addNewP().set(this.childs[i].item); break;
            }
    };
    this.parent = parent;
    this.id = id;
    this.item = x2006.CTFtnEdn.Factory.newInstance();
    this.item.setId(new java.math.BigInteger(String(this.id)));
    this.childs = [];

    this.ref = this.createParagraph(wdxSimpleStyleP).createRun(null,wdxSimpleStyleR);
    this.ref.setStyle({RUN_SCRIPT:wdxConstants.SCR_SUPERSCRIPT});
    this.ref.item.addNewFootnoteRef();
}

function wdxWordEndnoteRef(parent,wdxSimpleStyle,wdxSimpleStyleP,wdxSimpleStyleR){
    this.setStyle = function(style){
        wdxServFunctions.setProp(this.item,style);
    };
    this.parent = parent;
    this.id = ++wdxCounter.ENDNOTES;
    this.item = wdxServConstants.CT_RUN.Factory.newInstance();
    this.item.addNewEndnoteReference().setId(new java.math.BigInteger(String(this.id)));
    this.setStyle({RUN_SCRIPT:wdxConstants.SCR_SUPERSCRIPT});
    if (wdxSimpleStyle!=null) this.setStyle(wdxSimpleStyle);
    var endnotes = wdxServFunctions.getTopPart(this,"endnotes");
    this.note = new wdxWordEndnote(endnotes,this.id,wdxSimpleStyleP,wdxSimpleStyleR);
    endnotes.childs.push(this.note);
}

function wdxWordEndnote(parent,id,wdxSimpleStyleP,wdxSimpleStyleR){
    this.createParagraph = function(wdxSimpleStyle){var t = new wdxWordParagraph(this,wdxSimpleStyle); this.childs.push(t); return t;};
    this.createTable = function(wdxSimpleStyle){var t = new wdxWordTable(this,wdxSimpleStyle); this.childs.push(t); return t;};
    this.collect = function(){
        for (var i=0;i<this.childs.length;i++)
            switch (String(this.childs[i].item.type)){
                case String("T=CT_Tbl@http://schemas.openxmlformats.org/wordprocessingml/2006/main"): this.item.addNewTbl().set(this.childs[i].item); break;
                default: this.item.addNewP().set(this.childs[i].item); break;
            }
    };
    this.parent = parent;
    this.id = id;
    this.item = x2006.CTFtnEdn.Factory.newInstance();
    this.item.setId(new java.math.BigInteger(String(this.id)));
    this.childs = [];

    this.ref = this.createParagraph(wdxSimpleStyleP).createRun(null,wdxSimpleStyleR);
    this.ref.setStyle({RUN_SCRIPT:wdxConstants.SCR_SUPERSCRIPT});
    this.ref.item.addNewEndnoteRef();
}

//type - HDR_FTR_*
function wdxWordHeader(parent,type){
    this.collect = function(){
        for (var i=0;i<this.childs.length;i++)
            switch (String(this.childs[i].item.type)){
                case String("T=CT_Tbl@http://schemas.openxmlformats.org/wordprocessingml/2006/main"): this.item.doc.addNewTbl().set(this.childs[i].item); break;
                default: this.item.doc.addNewP().set(this.childs[i].item); break;
            }
    };
    this.setType = function(type){this.ref.setType(type);};
    this.createParagraph = function(wdxSimpleStyle){var t = new wdxWordParagraph(this,wdxSimpleStyle); this.childs.push(t); return t;};
    this.createTable = function(wdxSimpleStyle){var t = new wdxWordTable(this,wdxSimpleStyle); this.childs.push(t); return t;};
    this.item = wdxServFunctions.getItem(wdxServFunctions.getTopPart(parent).item.file,wdxServConstants.IT_HEADER);
    this.parent = parent;
    this.ref = this.parent.item.addNewHeaderReference();
    this.ref.setId(this.item.rel.getId());
    if (type!=null) this.setType(type);
    this.childs = [];
}

//type - HDR_FTR_*
function wdxWordFooter(parent,type){
    this.collect = function(){
        for (var i=0;i<this.childs.length;i++)
            switch (String(this.childs[i].item.type)){
                case String("T=CT_Tbl@http://schemas.openxmlformats.org/wordprocessingml/2006/main"): this.item.doc.addNewTbl().set(this.childs[i].item); break;
                default: this.item.doc.addNewP().set(this.childs[i].item); break;
            }
    };
    this.setType = function(type){this.ref.setType(type);};
    this.createParagraph = function(wdxSimpleStyle){var t = new wdxWordParagraph(this,wdxSimpleStyle); this.childs.push(t); return t;};
    this.createTable = function(wdxSimpleStyle){var t = new wdxWordTable(this,wdxSimpleStyle); this.childs.push(t); return t;};
    this.item = wdxServFunctions.getItem(wdxServFunctions.getTopPart(parent).item.file,wdxServConstants.IT_FOOTER);
    this.parent = parent;
    this.ref = this.parent.item.addNewFooterReference();
    this.ref.setId(this.item.rel.getId());
    if (type!=null) this.setType(type);
    this.childs = [];
}

function wdxWordPicture(parent,picData,extension,param1,param2){
    this.parent = parent;

    var tData = null;
    if ((picData instanceof com.idsscheer.aris.server.bl.common.reportobjects.aris.logic.AModelPicture)||
        (picData instanceof com.aris.modeling.server.bl.common.reportobjects.aris.logic.AModelPicture)){
        if (this.width==null){
            this.width = picData.getWidth(Constants.SIZE_PIXEL);
            this.height = picData.getHeight(Constants.SIZE_PIXEL);}
        var ba = picData.getAsOneImage(0,0,String(extension))[0];
        tData = new java.io.ByteArrayOutputStream(ba.length);
        tData.write(ba,0,ba.length);
        tData.close();
    }else if (picData instanceof java.io.File){
        var fis = new java.io.FileInputStream(picData);
        if (this.width==null){
            var tempImage = javax.imageio.ImageIO.read(fis);
            this.width = tempImage.getWidth();
            this.height = tempImage.getHeight();}
        var ba = org.apache.commons.io.IOUtils.toByteArray(fis);
        tData = new java.io.ByteArrayOutputStream(ba.length);
        tData.write(ba,0,ba.length);
        fis.close();
        tData.close();
    }else if (picData instanceof java.lang.Object){
        tData = new java.io.ByteArrayOutputStream(picData.length);
        if (this.width==null){
            //var fis = new java.io.ByteArrayInputStream(tData.toByteArray())
            var fis = new java.io.ByteArrayInputStream(picData);
            var tempImage = javax.imageio.ImageIO.read(fis);
            this.width = tempImage.getWidth();
            this.height = tempImage.getHeight();
            fis.close();
        }
        tData.write(picData,0,picData.length);
        tData.close();
    }
    if ((param1!=null)&&(param2!=null)){
        this.width = param1;
        this.height = param2;
        this.percent = 100;
    }else if (param1!=null){
        if (param1==-1)
            this.percent = wdxServFunctions.getPictureMaxPercent(this)
        else
            this.percent = param1;
    }else
        this.percent = 100;
    this.item = wdxServConstants.CT_RUN.Factory.newInstance();
    if (tData!=null){//insert picture
        this.itemPic = wdxServFunctions.getItem(wdxServFunctions.getTopPart(parent).item.file,wdxServConstants.IT_IMAGE,tData,extension);
        this.id = ++wdxCounter.IMAGES_ID;
        var drawing = this.item.addNewDrawing();
        var inline = drawing.addNewInline();
        var graphic = inline.addNewGraphic();
        var graphicData = graphic.addNewGraphicData();
        inline.setDistT(0);
        inline.setDistR(0);
        inline.setDistB(0);
        inline.setDistL(0);
        var docPr = inline.addNewDocPr();
        docPr.setId(this.id);
        docPr.setName("Drawing " + this.id);
        docPr.setDescr("file.png");
        var extent = inline.addNewExtent();
        extent.setCx(this.width*9525/100*this.percent);
        extent.setCy(this.height*9525/100*this.percent);
        var picDoc = org.openxmlformats.schemas.drawingml.x2006.picture.PicDocument.Factory.newInstance();
        var pic = picDoc.addNewPic();
        var nvPicPr = pic.addNewNvPicPr();
        var cNvPr = nvPicPr.addNewCNvPr();
        cNvPr.setId(0);
        cNvPr.setName("Picture " + this.id);
        cNvPr.setDescr("file.png");
        var cNvPicPr = nvPicPr.addNewCNvPicPr();
        cNvPicPr.addNewPicLocks().setNoChangeAspect(true);
        var blipFill = pic.addNewBlipFill();
        var blip = blipFill.addNewBlip();
        blip.setEmbed(this.itemPic.rel.getId());
        blipFill.addNewStretch().addNewFillRect();
        var spPr = pic.addNewSpPr();
        var xfrm = spPr.addNewXfrm();
        var off = xfrm.addNewOff();
        off.setX(0);
        off.setY(0);
        var ext = xfrm.addNewExt();
        ext.setCx(this.width*9525/100*this.percent);
        ext.setCy(this.height*9525/100*this.percent);
        var prstGeom = spPr.addNewPrstGeom();
        prstGeom.setPrst(org.openxmlformats.schemas.drawingml.x2006.main.STShapeType.RECT);
        prstGeom.addNewAvLst();
        graphicData.set(picDoc);
        graphicData.setUri(org.openxmlformats.schemas.drawingml.x2006.picture.CTPicture.type.getName().getNamespaceURI());
    }
}

function wdxWordEmbeddedObject(parent,objData,extension,filename,picData){
    this.parent = parent;
    if (objData instanceof java.io.File){
        var fis = new java.io.FileInputStream(objData);
        var ba = org.apache.commons.io.IOUtils.toByteArray(fis);
        tData = new java.io.ByteArrayOutputStream(ba.length);
        tData.write(ba,0,ba.length);
        fis.close();
        tData.close();
    }else if (objData instanceof java.lang.Object){
        tData = new java.io.ByteArrayOutputStream(objData.length);
        tData.write(objData,0,objData.length);
        tData.close();
    }
    this.item = wdxServConstants.CT_RUN.Factory.newInstance();

    if (tData!=null){
        this.itemObj = wdxServFunctions.getItem(wdxServFunctions.getTopPart(parent).item.file,wdxServConstants.IT_EMBED,tData,extension);
        var tData1=null
        if (picData!=null){
            if (picData instanceof java.io.File){
                var fis = new java.io.FileInputStream(picData);
                var ba = org.apache.commons.io.IOUtils.toByteArray(fis);
                tData1 = new java.io.ByteArrayOutputStream(ba.length);
                tData1.write(ba,0,ba.length);
                fis.close();
                tData1.close();
            }else if (picData instanceof java.lang.Object){
                tData1 = new java.io.ByteArrayOutputStream(picData.length);
                tData1.write(picData,0,picData.length);
                tData1.close();
            }
        }else{
            tData1 = wdxServFunctions.getThumbPicture(extension,filename);
        }
        this.itemPic = wdxServFunctions.getItem(wdxServFunctions.getTopPart(parent).item.file,wdxServConstants.IT_IMAGE,tData1,wdxConstants.FILE_TYPE_PNG);
        var object = this.item.addNewObject();
        var shapeDoc = schemasMicrosoftComVml.ShapeDocument.Factory.newInstance();
        var shape = shapeDoc.addNewShape();
        shape.setId("_x0000_i1025");
        shape.setStyle("width:70pt;height:50pt");
        shape.setOle(schemasMicrosoftComOfficeOffice.STTrueFalseBlank.X);
        shape.setType("#_x0000_t75");
        var imagedata = shape.addNewImagedata();
        imagedata.setTitle("");
        imagedata.setPict(this.itemPic.rel.getId());
        object.set(shapeDoc);

        var object1 = this.item.addNewObject();
        var oleObjDoc = schemasMicrosoftComOfficeOffice.OLEObjectDocument.Factory.newInstance();
        var oleObj = oleObjDoc.addNewOLEObject();
        oleObj.setId(this.itemObj.rel.getId());
        oleObj.setType(schemasMicrosoftComOfficeOffice.STOLEType.EMBED);
        oleObj.setDrawAspect(schemasMicrosoftComOfficeOffice.STOLEDrawAspect.ICON);
        oleObj.setProgID("Word.Document.12");
        oleObj.setObjectID("_1299573545");
        oleObj.setShapeID("_x0000_i1025");
        object1.set(oleObjDoc);
    }
}

function wdxWordFieldSimple(parent,field,wdxSimpleStyle,separate){
    this.setStyle = function(style){
        wdxServFunctions.setProp(this.item,style);
    };
    this.parent = parent;
    this.item = wdxServConstants.CT_RUN.Factory.newInstance();
    var begin = this.item.addNewFldChar();
    begin.setFldCharType(x2006.STFldCharType.BEGIN);
    if (field.indexOf("TOC")!=-1) begin.setDirty(x2006.STOnOff.TRUE);
    var instr = this.item.addNewInstrText();
    instr.setStringValue(field);
    instr.setSpace(wdxServConstants.SPACEPRESERVE);
    if (separate==null)
        var end = this.item.addNewFldChar().setFldCharType(x2006.STFldCharType.END);
    else
        var end = this.item.addNewFldChar().setFldCharType(x2006.STFldCharType.SEPARATE);
    if (wdxSimpleStyle!=null) this.setStyle(wdxSimpleStyle);
}

function wdxWordStyle(parent,wdxSimpleStyle){
    this.collect = function(){
        this.parent.doc.addNewStyle().set(this.item);
    };
    this.setStyle = function(style){
        wdxServFunctions.setProp(this.item,style);
    };
    this.parent = parent;
    this.item = x2006.CTStyle.Factory.newInstance();
    if (wdxSimpleStyle!=null) this.setStyle(wdxSimpleStyle);
}

function wdxWordStartBookmark(parent,name,hidden){
    this.parent = parent;
    this.item = x2006.CTBookmark.Factory.newInstance();
    this.id = ++wdxCounter.BOOKMARK;
    this.name = name;
    if (this.name==null) this.name = String("bookmark");
    if (hidden==true) this.name = String("_")+this.name;
    this.item.setName(String(this.name)+String(this.id));
    this.item.setId(new java.math.BigInteger(String(this.id)));
}

function wdxWordEndBookmark(parent){
    this.parent = parent;
    this.item = x2006.CTMarkupRange.Factory.newInstance();
    this.item.setId(new java.math.BigInteger(String(wdxCounter.BOOKMARK)));
}

function wdxWordHyperlink(parent,text,internalLink,externalLink,wdxSimpleStyle){
    this.collect = function(){
        for (var i=0;i<this.childs.length;i++)
            this.item.addNewR().set(this.childs[i].item);
    };
    var standartLink = {RUN_UNDERLINE:wdxConstants.UL_SINGLE,RUN_COLOR:"0000FF"};
    this.parent = parent;
    this.item = x2006.CTHyperlink.Factory.newInstance();
    if (internalLink!=null)
        this.item.setAnchor(internalLink);
    else if (externalLink!=null){
        var top = this;
        while (top.parent!=null)
            top = top.parent;
        if (top!=null)
            if (top.item!=null)
                if (top.item.file!=null){
                    var rel = top.item.file.addExternalRelationship(externalLink,wdxServConstants.RELT_HYPERLINK);
                    if (rel!=null)
                        this.item.setId(rel.getId());
                }
    }
    this.childs = [];
    var t = new wdxWordRun(this,text,standartLink);
    if (wdxSimpleStyle!=null)
        t.setStyle(wdxSimpleStyle);
    this.childs.push(t);
}

function wdxWordAbstractNum(parent){
    this.collect = function(){
        this.parent.doc.addNewAbstractNum().set(this.item);
    };
    this.setStyle = function(style){
        wdxServFunctions.setProp(this.item,style);
    };
    this.parent = parent;
    this.id = ++wdxCounter.ABSTRACT_NUMBERING;
    this.item = x2006.CTAbstractNum.Factory.newInstance();
    this.item.setAbstractNumId(new java.math.BigInteger(String(this.id)));
}

function wdxWordNum(parent,abstractNum,wdxSimpleStyle){
    this.collect = function(){
        this.parent.doc.addNewNum().set(this.item);
    };
    this.setStyle = function(style){
        wdxServFunctions.setProp(this.item,style);
    };
    this.parent = parent;
    this.id = ++wdxCounter.NUMBERING;
    this.item = x2006.CTNum.Factory.newInstance();
    this.item.setNumId(new java.math.BigInteger(String(this.id)));
    if (abstractNum!=null){
        var val = x2006.CTDecimalNumber.Factory.newInstance();
        val.setVal(new java.math.BigInteger(String(abstractNum.id)));
        this.item.setAbstractNumId(val);
    }
    if (wdxSimpleStyle!=null) this.setStyle(wdxSimpleStyle);
}

function wdxWordTable(parent,wdxSimpleStyle){
    this.collect = function(){
        for (var i=0;i<this.childs.length;i++)
            this.item.addNewTr().set(this.childs[i].item);
    };
    this.setStyle = function(style){
        wdxServFunctions.setProp(this.item,style);
    };
    this.createRow = function(wdxSimpleStyle){var t = new wdxWordRow(this,wdxSimpleStyle);this.childs.push(t);return t;};
    this.parent = parent;
    this.item = wdxServConstants.CT_TABLE.Factory.newInstance();
    if (wdxSimpleStyle!=null) this.setStyle(wdxSimpleStyle);
    this.childs = [];
}

function wdxWordRow(parent,wdxSimpleStyle){
    this.collect = function(){
        for (var i=0;i<this.childs.length;i++)
            this.item.addNewTc().set(this.childs[i].item);
    };
    this.setStyle = function(style){
        wdxServFunctions.setProp(this.item,style);
    };
    this.createCell = function(wdxSimpleStyle){var t = new wdxWordCell(this,wdxSimpleStyle);this.childs.push(t);return t;};
    this.parent = parent;
    this.item = wdxServConstants.CT_ROW.Factory.newInstance();
    if (wdxSimpleStyle!=null) this.setStyle(wdxSimpleStyle);
    this.childs = [];
}

function wdxWordCell(parent,wdxSimpleStyle){
    this.collect = function(){
        for (var i=0;i<this.childs.length;i++)
            this.item.addNewP().set(this.childs[i].item);
    };
    this.setStyle = function(style){
        wdxServFunctions.setProp(this.item,style);
    };
    this.createParagraph = function(wdxSimpleStyle){var t = new wdxWordParagraph(this,wdxSimpleStyle); this.childs.push(t); return t;};
    this.parent = parent;
    this.item = wdxServConstants.CT_CELL.Factory.newInstance();
    if (wdxSimpleStyle!=null) this.setStyle(wdxSimpleStyle);
    this.childs = [];
}