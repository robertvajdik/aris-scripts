function ExcelBasicSheetWriter(excel, attributeName,eventFrequencyAttribute,processFrequencyAttribute,processAvgTimeAttribute, locale, styleStorage) {
    
    this.excel = excel;
    this.attributeName = attributeName;
    this.eventFrequencyAnnual = eventFrequencyAttribute;
    
    this.processFrequencyAttribute = processFrequencyAttribute;
    this.attributeAvaregeProcTime = processAvgTimeAttribute;
    this.locale = locale;
    this.styleStorage = styleStorage;
    this.index = 0;
    this.totalSumIndexes = [];
    
    this.init = function () {
        
        this.index = 0;
        this.sheet = new ExcelSheetHandler(getString("TEXT_SHEET_BASIC"), this.excel);
    };
    
    this.writeHeader = function (model) {
        
        var modelName = model.Attribute(this.attributeName, this.locale).getValue();
        
        
        this.sheet.createCell(this.index, 0);
        this.sheet.setCellValue(this.index, 0, modelName);
        this.sheet.setCellStyle(this.index, 0, this.styleStorage.getNameStyle());
        this.sheet.setRegion(0, 6, this.index, this.index);
        
        this.index = this.index + 1;
        
        this.sheet.createCell(this.index, 0);
        this.sheet.createCell(this.index, 1);
        this.sheet.createCell(this.index, 2);
        this.sheet.createCell(this.index, 3);
        this.sheet.createCell(this.index, 4);
        this.sheet.createCell(this.index, 5);
        this.sheet.createCell(this.index, 6);
        
        this.sheet.setCellValue(this.index, 0, getString("TEXT_PROCESS_FLOW_SEQUENCE"));
        this.sheet.setCellValue(this.index, 1, getString("TEXT_OBJECT_TYPE"));
        this.sheet.setCellValue(this.index, 2, getString("TEXT_PROCEES_BRANCH"));
        this.sheet.setCellValue(this.index, 3, getString("TEXT_FREQUENCY_ANNUALLY"));
        this.sheet.setCellValue(this.index, 4, getString("TEXT_AVG_PROCESSING_TIME"));
        this.sheet.setCellValue(this.index, 5, getString("TEXT_PROCESS_INSTANCES"));
        this.sheet.setCellValue(this.index, 6, getString("TEXT_ALL_AVG_PROCESSING_TIME"));
        
        
        this.sheet.setCellStyle(this.index, 0, this.styleStorage.getHeaderStyle());
        this.sheet.setCellStyle(this.index, 1, this.styleStorage.getHeaderStyle());
        this.sheet.setCellStyle(this.index, 2, this.styleStorage.getHeaderStyle());
        this.sheet.setCellStyle(this.index, 3, this.styleStorage.getHeaderStyle());
        this.sheet.setCellStyle(this.index, 4, this.styleStorage.getHeaderStyle());
        this.sheet.setCellStyle(this.index, 5, this.styleStorage.getHeaderStyle());
        this.sheet.setCellStyle(this.index, 6, this.styleStorage.getHeaderStyle());
        
        this.sheet.setColumnWidth(0, 27000);
        this.sheet.setColumnWidth(1, 4200);
        this.sheet.setColumnWidth(2, 2700);
        this.sheet.setColumnWidth(3, 4200);
        this.sheet.setColumnWidth(4, 4200);
        this.sheet.setColumnWidth(5, 4200);
        this.sheet.setColumnWidth(6, 4200);
        
        this.index = this.index + 1;
        
    };
    
    
    this.writeInput = function (inputItems) {
        
        var process_frequency = 0.0;
        var volumeRow = -1;
        var sumRowBegin = this.index;
        var keys = inputItems.keySet();
        var it = keys.iterator();
        
        while (it.hasNext()) {
            var key = it.next();
            var items = inputItems.get(key);
            for (var listPosition = 0; listPosition < items.size(); listPosition++) {
                var item = items.get(listPosition);
                if (item.objOcc === null && item.withOutBussinesObject === true) {
                    volumeRow = -2;
                    var temp = this.calculateSumProcessFrequency(item);
                    if (temp > 0.0) process_frequency = temp;
                    continue;
                    
                } else if (item.objOcc.ObjDef().TypeNum() === 18) {
                    var value = item.objOcc.ObjDef().Attribute(this.eventFrequencyAnnual, this.locale).getValue();
                    if (value.length() > 0) {
                        process_frequency = value;
                        volumeRow = this.index;
                    }
                }
                
                this.sheet.createCell(this.index,0);
                this.sheet.createCell(this.index,1);
                this.sheet.createCell(this.index,2);
                this.sheet.createCell(this.index,3);
                this.sheet.createCell(this.index,4);
                this.sheet.createCell(this.index,5);
                this.sheet.createCell(this.index,6);
                
                this.sheet.setCellValue(this.index,0,item.objOcc.ObjDef().Name(this.locale));
                this.sheet.setCellValue(this.index,1,item.objOcc.ObjDef().Type());
                this.sheet.setCellValue(this.index,2,key);
                
                this.sheet.setCellStyle(this.index,0,this.styleStorage.getNormalStyle());
                this.sheet.setCellStyle(this.index,1,this.styleStorage.getNormalStyle());
                this.sheet.setCellStyle(this.index,2,this.styleStorage.getNormalStyle());
                this.sheet.setCellStyle(this.index,3,this.styleStorage.getNormalNumericStyle());
                this.sheet.setCellStyle(this.index,4,this.styleStorage.getNormalNumericStyle());
                this.sheet.setCellStyle(this.index,5,this.styleStorage.getNormalNumericStyle());
                this.sheet.setCellStyle(this.index,6,this.styleStorage.getNormalNumericStyle());
                
                
                if (item.objOcc.ObjDef().TypeNum() === 18) {
                    this.sheet.setCellStyle(this.index,3,this.styleStorage.getYellowNumericStyle());
                    this.sheet.setCellStyle(this.index,4,this.styleStorage.getYellowNumericStyle());
                    this.sheet.setCellStyle(this.index,5,this.styleStorage.getYellowNumericStyle());
                    this.sheet.setCellStyle(this.index,6,this.styleStorage.getYellowNumericStyle());
                    if (item.objOcc.ObjDef().Attribute(this.eventFrequencyAnnual, this.locale).getValue().length() > 0) {
                        this.sheet.setCellValue(this.index,3,parseInt(item.objOcc.ObjDef().Attribute(this.eventFrequencyAnnual, this.locale).getValue()));
                        
                    }
                    this.sheet.setCellValue(this.index, 5,parseInt(process_frequency));
                    
                }else if (item.objOcc.ObjDef().TypeNum() === 50) {
                    this.sheet.setCellStyle(this.index,0,this.styleStorage.getOperatorStyle());
                    
                    
                } else {
                    var localFrequencyAnnualAttribute = item.objOcc.ObjDef().Attribute(this.processFrequencyAttribute,this.locale);
                    
                    if (localFrequencyAnnualAttribute.IsMaintained()) {
                        this.sheet.setCellValue(this.index,3,parseInt(localFrequencyAnnualAttribute.getValue()));
                    }
                    else {
                        this.sheet.setCellValue(this.index,3,parseInt("1.00"));
                    }
                  
                    this.sheet.setCellStyle(this.index,3,this.styleStorage.getNormalNumericStyle());
                    if (volumeRow === -2) {
                        var totalHours = valueToHour(item.objOcc);
                        this.sheet.setCellValue(this.index,4,totalHours);
                        this.sheet.setCellFormula(this.index,5,process_frequency + "*D" + (this.index+1));
                        this.sheet.setCellFormula(this.index,6,"F" + (this.index+1) + "*E" + (this.index+1));
                    } else if (volumeRow > -1) {
                        var totalHours = valueToHour(item.objOcc);
                        this.sheet.setCellValue(this.index,4,totalHours);
                        this.sheet.setCellFormula(this.index,5,"$D$" + (volumeRow+1) + "*D" + (this.index+1));
                        this.sheet.setCellFormula(this.index,6,"F" + (this.index+1) + "*E" + (this.index+1));
                        
                        
                    }
                    
                }
                
                
                this.index = this.index + 1;
                
            }
        }
        
        this.sheet.createCell(this.index,0);
        this.sheet.createCell(this.index,1);
        this.sheet.createCell(this.index,2);
        this.sheet.createCell(this.index,3);
        this.sheet.createCell(this.index,4);
        this.sheet.createCell(this.index,5);
        this.sheet.createCell(this.index,6);
        
        this.sheet.setCellValue(this.index, 0, "Process total");
        this.sheet.setCellFormula(this.index,6,"SUM(G" + (sumRowBegin +1)+ ":G" + (this.index) + ")")
        
        this.sheet.setCellStyle(this.index,0,this.styleStorage.getRedStyle());
        this.sheet.setCellStyle(this.index,1,this.styleStorage.getRedStyle());
        this.sheet.setCellStyle(this.index,2,this.styleStorage.getRedStyle());
        this.sheet.setCellStyle(this.index,3,this.styleStorage.getRedStyle());
        this.sheet.setCellStyle(this.index,4,this.styleStorage.getRedStyle());
        this.sheet.setCellStyle(this.index,5,this.styleStorage.getRedStyle());
        this.sheet.setCellStyle(this.index,6,this.styleStorage.getRedNumericStyle());
        this.totalSumIndexes.push(this.index+1); 
        
        
        this.index = this.index + 3;
    };
    
    this.calculateSumProcessFrequency = function (item) {
        var summary = 0.0;
        for (var i = 0; i < item.lastBussinesObjects.size(); i++) {
            var value = item.lastBussinesObjects.get(i).ObjDef().Attribute(this.eventFrequencyAnnual, this.locale).getValue();
            if (value.length() > 0) {
                summary += parseFloat(value);
            }
        }
        return summary;
    }
    
    this.writeTotalSum = function() {
        
        this.sheet.createCell(this.index,0);
        this.sheet.createCell(this.index,1);
        this.sheet.createCell(this.index,2);
        this.sheet.createCell(this.index,3);
        this.sheet.createCell(this.index,4);
        this.sheet.createCell(this.index,5);
        this.sheet.createCell(this.index,6);
        
        this.sheet.setCellValue(this.index, 0, "All processes total");
        var formulaText = "SUM("
        for(var position = 0; position < this.totalSumIndexes.length; position++) {
            formulaText += "$G$"+this.totalSumIndexes[position] + ",";
        }
        formulaText = formulaText.substring(0,formulaText.length-1);
        formulaText += ")"
         this.sheet.setCellFormula(this.index,6,formulaText)
        
        this.sheet.setCellStyle(this.index,0,this.styleStorage.getRedStyle());
        this.sheet.setCellStyle(this.index,1,this.styleStorage.getRedStyle());
        this.sheet.setCellStyle(this.index,2,this.styleStorage.getRedStyle());
        this.sheet.setCellStyle(this.index,3,this.styleStorage.getRedStyle());
        this.sheet.setCellStyle(this.index,4,this.styleStorage.getRedStyle());
        this.sheet.setCellStyle(this.index,5,this.styleStorage.getRedStyle());
        this.sheet.setCellStyle(this.index,6,this.styleStorage.getRedNumericStyle());
    }
    
    this.valueToHours = function(occurrence) {
        var measuredValue = occurrence.ObjDef().Attribute(this.attributeAvaregeProcTime, g_loc).getValue();
        if (measuredValue.length() === 0) return 0.0;
        var splitted = measuredValue.split(":");
        var result = 0.0;
        for(position = 0; position < splitted.length; position++) {
            var part = parseFloat(splitted[position]);
            if (position === 0) result += (24 * part);
            if (position === 1) result += (1 * part);
            if (position === 2)  result += (part / 60.0);
            if (position === 3) result += ( (part / 60.0 )/60.0);
            
        }
        
        return result;
    }
    
}