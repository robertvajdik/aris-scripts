function ExcelDetailSheetWriter(excel, position, counter, paths,
                                 eventFrequencyAttribute,processFrequencyAttribute,attributeName,processAvgTimeAttribute,
                                 locale,styleStorage) {
    this.sheet = null;
    this.counter = counter;
    this.paths = paths;
    this.excel = excel;
    this.position = position;
    this.styleStorage = styleStorage;
    this.index = 0;
    this.eventFrequencyAnnual = eventFrequencyAttribute;
    this.attributeName = attributeName;
    this.processFrequencyAttribute = processFrequencyAttribute;
    this.attributeAvaregeProcTime = processAvgTimeAttribute;
    this.locale = locale;

    this.init = function () {
        var fullName = getString("TEXT_SHEET_DETAIL") + " " + this.counter;
        this.sheet = new ExcelSheetHandler(fullName, this.excel);
    };

    this.writeHeader = function (model) {

        var modelName = model.Attribute(this.attributeName, this.locale).getValue();
        this.index = 0;

        this.sheet.createCell(this.index,0);
        this.sheet.setCellValue(this.index,0,modelName);
        this.sheet.setCellStyle(this.index,0,this.styleStorage.getNameStyle());
        this.sheet.setRegion(0,7,this.index,this.index);

        this.index = this.index + 1;

        this.sheet.createCell(this.index, 0);
        this.sheet.createCell(this.index, 1);
        this.sheet.createCell(this.index, 2);
        this.sheet.createCell(this.index, 3);
        this.sheet.createCell(this.index, 4);
        this.sheet.createCell(this.index, 5);
        this.sheet.createCell(this.index, 6);
        this.sheet.createCell(this.index, 7);


        this.sheet.setCellValue(this.index, 0, getString("TEXT_INSTANCE"));
        this.sheet.setCellValue(this.index, 1, getString("TEXT_PROCESS_FLOW_SEQUENCE"));
        this.sheet.setCellValue(this.index, 2, getString("TEXT_OBJECT_TYPE"));
        this.sheet.setCellValue(this.index, 3, getString("TEXT_PROCEES_BRANCH"));
        this.sheet.setCellValue(this.index, 4, getString("TEXT_FREQUENCY_ANNUALLY"));
        this.sheet.setCellValue(this.index, 5, getString("TEXT_AVG_PROCESSING_TIME"));
        this.sheet.setCellValue(this.index, 6, getString("TEXT_PROCESS_INSTANCES"));
        this.sheet.setCellValue(this.index, 7, getString("TEXT_ALL_AVG_PROCESSING_TIME"));


        this.sheet.setColumnWidth(0, 2000);
        this.sheet.setColumnWidth(1, 27000);
        this.sheet.setColumnWidth(2, 4200);
        this.sheet.setColumnWidth(3, 2700);
        this.sheet.setColumnWidth(4, 4200);
        this.sheet.setColumnWidth(5, 4200);
        this.sheet.setColumnWidth(6, 4200);
        this.sheet.setColumnWidth(7, 5200);

        this.sheet.setCellStyle(this.index, 0, this.styleStorage.getHeaderStyle());
        this.sheet.setCellStyle(this.index, 1, this.styleStorage.getHeaderStyle());
        this.sheet.setCellStyle(this.index, 2, this.styleStorage.getHeaderStyle());
        this.sheet.setCellStyle(this.index, 3, this.styleStorage.getHeaderStyle());
        this.sheet.setCellStyle(this.index, 4, this.styleStorage.getHeaderStyle());
        this.sheet.setCellStyle(this.index, 5, this.styleStorage.getHeaderStyle());
        this.sheet.setCellStyle(this.index, 6, this.styleStorage.getHeaderStyle());
        this.sheet.setCellStyle(this.index, 7, this.styleStorage.getHeaderStyle());

        this.index = this.index + 1;

    };

    this.writeInput = function () {
        if (this.paths === null) return;
        var iterator = this.paths.entrySet().iterator();
        var processFrequency = 0.0;
        var sumRowBegin = this.index;
        var volumeRow = -1;

        while (iterator.hasNext()) {
            var input = iterator.next();

            this.putProcessInstance(parseInt(input.getKey()));
            this.index = this.index + 1;
            sumRowBegin = this.index;
            var occurrencesIterator = input.getValue().iterator();
            while (occurrencesIterator.hasNext()) {
                var occurrence = occurrencesIterator.next();
                //if (occurrence.ObjDef().TypeNum() === 22 && occurrence.SymbolNum() === SYM_PROCESS_INTERFACE) continue;
                if (occurrence.ObjDef().TypeNum() === 18) {
                    var value = occurrence.ObjDef().Attribute(this.eventFrequencyAnnual, this.locale).getValue();
                    if (value.length() > 0) {
                        processFrequency = value;
                        volumeRow = this.index + 1;
                    }
                    
                }
                var objectType = occurrence.ObjDef().TypeNum();
                if (objectType === 18) {
                    this.putObject18Info(occurrence,processFrequency);
                }
                if (objectType === 50)
                {
                    this.putObject50Info();
                }
                if (objectType !== 18 && objectType !== 50) {
                    this.putOtherObjectInfo(occurrence,volumeRow);
                }
                this.putObjectDescription(input.getKey(),occurrence);
                if (objectType === 50) {
                    this.sheet.setCellStyle(this.index,1,this.styleStorage.getOperatorStyle());
                }
                this.index = this.index + 1;
    
            }

            this.putProcessInstanceTotal(sumRowBegin+1, this.index);
            this.index = this.index + 2;
            volumeRow =  -1;
            processFrequency = 0.0;
        }
    };

    this.putOtherObjectInfo = function (occurrence,volumeRow) {

        this.sheet.createCell(this.index,4);
        this.sheet.createCell(this.index,5);
        this.sheet.createCell(this.index,6);
        this.sheet.createCell(this.index,7);

        var localFrequencyAnnualAttribute = occurrence.ObjDef().Attribute(this.processFrequencyAttribute,this.locale);

        if (localFrequencyAnnualAttribute.IsMaintained()) {
            this.sheet.setCellValue(this.index,4,parseInt(localFrequencyAnnualAttribute.getValue()));
        }
        else {
             this.sheet.setCellValue(this.index,4,parseInt("1.00"));
        }

        this.sheet.setCellValue(this.index,5, this.valueToHours(occurrence));

        if (volumeRow !== -1)  this.sheet.setCellFormula(this.index,6, "$E$" + volumeRow + "*E" + (this.index+1));

        this.sheet.setCellFormula(this.index,7,"G" + (this.index + 1) + "*F" + (this.index+1));

   
        this.sheet.setCellStyle(this.index,4,this.styleStorage.getNormalNumericStyle());
        this.sheet.setCellStyle(this.index,5,this.styleStorage.getNormalNumericStyle());
        this.sheet.setCellStyle(this.index,6,this.styleStorage.getNormalNumericStyle());
        this.sheet.setCellStyle(this.index,7,this.styleStorage.getNormalNumericStyle());
    };

    this.putObject50Info = function () {

        this.sheet.createCell(this.index,4);
        this.sheet.createCell(this.index,5);
        this.sheet.createCell(this.index,6);
        this.sheet.createCell(this.index,7);

        this.sheet.setCellValue(this.index,4,"");
        this.sheet.setCellValue(this.index,5,"");
        this.sheet.setCellValue(this.index,6,"");
        this.sheet.setCellValue(this.index,7,"");

        //this.sheet.setCellStyle(this.index,1,this.styleStorage.getOperatorStyle());
        this.sheet.setCellStyle(this.index,4,this.styleStorage.getNormalStyle());
        this.sheet.setCellStyle(this.index,5,this.styleStorage.getNormalStyle());
        this.sheet.setCellStyle(this.index,6,this.styleStorage.getNormalStyle());
        this.sheet.setCellStyle(this.index,7,this.styleStorage.getNormalStyle());
    };

    this.putObject18Info = function(occurrence,processFrequency) {

        this.sheet.createCell(this.index,4);
        this.sheet.createCell(this.index,5);
        this.sheet.createCell(this.index,6);
        this.sheet.createCell(this.index,7);

        this.sheet.setCellStyle(this.index,4,this.styleStorage.getYellowNumericStyle());
        this.sheet.setCellStyle(this.index,5,this.styleStorage.getYellowNumericStyle());
        this.sheet.setCellStyle(this.index,6,this.styleStorage.getYellowNumericStyle());
        this.sheet.setCellStyle(this.index,7,this.styleStorage.getYellowStyle());

        var localFrequencyAnnualAttribute = occurrence.ObjDef().Attribute(this.eventFrequencyAnnual,this.locale);

        if (localFrequencyAnnualAttribute.IsMaintained()) {
            this.sheet.setCellValue(this.index,4,parseInt(localFrequencyAnnualAttribute.getValue()));
        }

        this.sheet.setCellValue(this.index,6,parseInt(processFrequency));

    };

    this.putObjectDescription = function (key,occurrence) {

        this.sheet.createCell(this.index,0);
        this.sheet.createCell(this.index,1);
        this.sheet.createCell(this.index,2);
        this.sheet.createCell(this.index,3);


        var type = occurrence.ObjDef().Type();
        var name = occurrence.ObjDef().Attribute(this.attributeName,this.locale).getValue();

        this.sheet.setCellValue(this.index,0,key);
        this.sheet.setCellValue(this.index,1,name);
        this.sheet.setCellValue(this.index,2,type);

        this.sheet.setCellStyle(this.index,0,this.styleStorage.getCenteredStyle());
        this.sheet.setCellStyle(this.index,1,this.styleStorage.getNormalStyle());
        this.sheet.setCellStyle(this.index,2,this.styleStorage.getNormalStyle());
        this.sheet.setCellStyle(this.index,3,this.styleStorage.getNormalStyle());



    };

    this.putProcessInstance = function (counter) {
        var processInstance = "Process Instance " + counter;

        this.sheet.createCell(this.index, 0);
        this.sheet.createCell(this.index, 1);
        this.sheet.createCell(this.index, 2);
        this.sheet.createCell(this.index, 3);
        this.sheet.createCell(this.index, 4);
        this.sheet.createCell(this.index, 5);
        this.sheet.createCell(this.index, 6);
        this.sheet.createCell(this.index, 7);

        this.sheet.setCellValue(this.index, 1, processInstance);

        this.sheet.setCellStyle(this.index, 0, this.styleStorage.getGrayStyle());
        this.sheet.setCellStyle(this.index, 1, this.styleStorage.getGrayStyle());
        this.sheet.setCellStyle(this.index, 2, this.styleStorage.getGrayStyle());
        this.sheet.setCellStyle(this.index, 3, this.styleStorage.getGrayStyle());
        this.sheet.setCellStyle(this.index, 4, this.styleStorage.getGrayStyle());
        this.sheet.setCellStyle(this.index, 5, this.styleStorage.getGrayStyle());
        this.sheet.setCellStyle(this.index, 6, this.styleStorage.getGrayStyle());
        this.sheet.setCellStyle(this.index, 7, this.styleStorage.getGrayStyle());
    };

    this.putProcessInstanceTotal = function (begin, end) {

        this.sheet.createCell(this.index, 0);
        this.sheet.createCell(this.index, 1);
        this.sheet.createCell(this.index, 2);
        this.sheet.createCell(this.index, 3);
        this.sheet.createCell(this.index, 4);
        this.sheet.createCell(this.index, 5);
        this.sheet.createCell(this.index, 6);
        this.sheet.createCell(this.index, 7);

        this.sheet.setCellValue(this.index, 1, "Process Instance Total");
        this.sheet.setCellFormula(this.index, 7,"SUM(H" + begin + ":H" + end + ")");


        this.sheet.setCellStyle(this.index, 0, this.styleStorage.getRedStyle());
        this.sheet.setCellStyle(this.index, 1, this.styleStorage.getRedStyle());
        this.sheet.setCellStyle(this.index, 2, this.styleStorage.getRedStyle());
        this.sheet.setCellStyle(this.index, 3, this.styleStorage.getRedStyle());
        this.sheet.setCellStyle(this.index, 4, this.styleStorage.getRedStyle());
        this.sheet.setCellStyle(this.index, 5, this.styleStorage.getRedStyle());
        this.sheet.setCellStyle(this.index, 6, this.styleStorage.getRedStyle());
        this.sheet.setCellStyle(this.index, 7, this.styleStorage.getRedNumericStyle());

    };

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
    };



}