function ExcelSummarySheetWriter(excel, position,counter,paths,attributeName,locale,styleStorage) {

    this.sheet = null;
    this.counter = counter;
    this.excel = excel;
    this.position = position;
    this.counter = counter;
    this.locale = locale;
    this.styleStorage = styleStorage;
    this.paths = paths;
    this.attributeName = attributeName;
    this.index = 0;


    this.init = function () {
        var fullName = getString("TEXT_SHEET_SUMMARY") + " " + this.counter;
        this.sheet = new ExcelSheetHandler(fullName,this.excel);
    };

    this.writeHeader = function (model) {

        var modelName = model.Attribute(this.attributeName, this.locale).getValue();
        this.index = 0;

        this.sheet.createCell(this.index,0);
        this.sheet.setCellValue(this.index,0,modelName);
        this.sheet.setCellStyle(this.index,0,this.styleStorage.getNameStyle());
        this.sheet.setRegion(0,4,this.index,this.index);

        this.index = this.index + 1;

        this.sheet.createCell(this.index, 0);
        this.sheet.createCell(this.index, 1);

        this.sheet.setCellValue(this.index, 0, getString("TEXT_PROCESS_FLOW_SEQUENCE"));
        this.sheet.setCellValue(this.index, 1, getString("TEXT_ALL_AVG_PROCESSING_TIME"));

        this.sheet.setColumnWidth(0, 27000);
        this.sheet.setColumnWidth(1, 5200);

        this.sheet.setCellStyle(this.index, 0, this.styleStorage.getHeaderStyle());
        this.sheet.setCellStyle(this.index, 1, this.styleStorage.getHeaderStyle());

        this.index = this.index + 1;
    };

    this.writeTop5Header = function() {

        this.sheet.createCell(this.index, 0);
        this.sheet.createCell(this.index, 1);

        this.sheet.setCellValue(this.index, 0, "TOP 5 - The most time consuming process steps per Instance");
        this.sheet.setCellValue(this.index, 1, getString("TEXT_ALL_AVG_PROCESSING_TIME"));

        this.sheet.setColumnWidth(0, 27000);
        this.sheet.setColumnWidth(1, 5200);

        this.sheet.setCellStyle(this.index, 0, this.styleStorage.getHeaderStyle());
        this.sheet.setCellStyle(this.index, 1, this.styleStorage.getHeaderStyle());

        this.index = this.index + 1;
    };

    this.writeTop5Steps = function (steps) {

        var innerArray = new Packages.java.util.ArrayList();
        var set = steps.keySet();
        var it = set.iterator();
        while (it.hasNext()) {
            var item = it.next();
            for (var position = 0; position < steps.get(item).size(); position++) {
                var object = steps.get(item).get(position);

                    innerArray.add(object);
           }
        }
        var temp = innerArray.toArray().sort(compareTotalTimeObject);
        for (var position = 0; position < 5; position++) {
            if (position < temp.length) {

                this.sheet.createCell(this.index,0);
                this.sheet.setCellValue(this.index,0, temp[position].objOcc.ObjDef().Name(this.locale));
                this.sheet.setCellStyle(this.index,0,this.styleStorage.getNormalStyle());


                this.sheet.createCell(this.index,1);
                  if (!isNaN(temp[position].averageProcessingAllTime)) {
                this.sheet.setCellValue(this.index,1, temp[position].averageProcessingAllTime);
                }
                else {
                     this.sheet.setCellValue(this.index,1, "0.00");
                }
                this.sheet.setCellStyle(this.index,1,this.styleStorage.getNormalNumericStyle());
        

                this.index = this.index + 1;
            }

        }
    };

    this.writeInput = function() {
        var entrySet = this.paths.entrySet();
        var it = entrySet.iterator();
        var beginAverageRow = this.index;
        var maxMin = new Packages.java.util.ArrayList(this.paths.size());

        while (it.hasNext()) {
            var item = it.next();
            var sum = 0.0;
            for (var position = 0; position < item.getValue().size(); position++) {
                var inner = item.getValue().get(position);
                if (inner === null) continue;
                for (var innerPosition = 0; innerPosition < inner.size(); innerPosition++) {
                    var object = inner.get(innerPosition);
                    if (!isNaN(object.averageProcessingAllTime)) {
                        sum += object.averageProcessingAllTime;
                    }
                }
            }
            maxMin.add({
                "processInstance": item.getKey(),
                "totalSum": sum,
                "rowIndex": this.index
            });
            this.sheet.createCell(this.index,0);
            this.sheet.createCell(this.index,1);

            this.sheet.setCellValue(this.index, 0,"Process Instance " + parseInt(item.getKey()));
            this.sheet.setCellValue(this.index, 1,sum);

            this.sheet.setCellStyle(this.index,0,this.styleStorage.getGrayStyle());
            this.sheet.setCellStyle(this.index,1,this.styleStorage.getRedNumericStyle());
            sum = 0;
            this.index = this.index+2;
        }
        this.sheet.createCell(this.index,0);
        this.sheet.setCellValue(this.index, 0,getString("TEXT_AVERAGE_SUM"));
        this.sheet.setCellStyle(this.index,0,this.styleStorage.getLightGrayStyle());

        this.sheet.createCell(this.index,1);
        this.sheet.setCellFormula(this.index, 1,"AVERAGE(B" + (beginAverageRow + 1) + ":B" + (this.index-1) + ")");
        this.sheet.setCellStyle(this.index,1,this.styleStorage.getLightRedNumericStyle());

        this.sheet.createCell(this.index,2);
        this.sheet.setCellValue(this.index, 2,"Mean");
        this.sheet.setCellStyle(this.index,2,this.styleStorage.getLightRedStyle());

        var descending = maxMin.toArray().sort(compare);
        var min = descending[0];
        var max = descending[descending.length - 1];

        this.sheet.createCell(max.rowIndex,2);
        this.sheet.setCellValue(max.rowIndex,2,"Max");
        this.sheet.setCellStyle(max.rowIndex,2,this.styleStorage.getLightRedStyle());

        this.sheet.createCell(max.rowIndex,3);
        this.sheet.setCellValue(max.rowIndex,3,"Critical");
        this.sheet.setCellStyle(max.rowIndex,3,this.styleStorage.getLightRedStyle());

        this.sheet.createCell(min.rowIndex,2);
        this.sheet.setCellValue(min.rowIndex,2,"Min");
        this.sheet.setCellStyle(min.rowIndex,2,this.styleStorage.getLightRedStyle());

        this.sheet.createCell(min.rowIndex,3);
        this.sheet.setCellValue(min.rowIndex,3,"Critical");
        this.sheet.setCellStyle(min.rowIndex,3,this.styleStorage.getLightRedStyle());

        this.index = this.index + 3;

        this.writeTop5Header();

        for (var position = 0; position < maxMin.size(); position++) {
            var item = maxMin.get(position);

            this.sheet.createCell(this.index,0);
            this.sheet.setCellValue(this.index,0,"Process Instance " + parseInt(item.processInstance));
            this.sheet.setCellStyle(this.index,0,this.styleStorage.getGrayStyle());

            this.sheet.createCell(this.index,1);
            this.sheet.setCellValue(this.index,1,item.totalSum);
            this.sheet.setCellStyle(this.index,1,this.styleStorage.getRedNumericStyle());

            this.index = this.index + 1;

            this.writeTop5Steps(this.paths.get(item.processInstance));

          
        }

    }
}