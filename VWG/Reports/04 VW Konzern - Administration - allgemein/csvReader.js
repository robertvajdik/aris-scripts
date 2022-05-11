function csvReader(byteArray,separator,encoding) {

    this.byteArray = byteArray;
    this.separator = separator;
    this.encoding = encoding;

    this.getContent = function () {

        var records = new Packages.java.util.ArrayList();
        var inputStream = new Packages.java.io.ByteArrayInputStream(this.byteArray);
        var scanner = new Packages.java.util.Scanner(inputStream,this.encoding);
        while(scanner.hasNextLine()) {
            records.add(this.getRecordFromLine(scanner.nextLine()))
        }
        scanner.close();
        return records;
    };


    this.getRecordFromLine = function(line) {

        var values = new Packages.java.util.ArrayList();
        var rowScanner = new Packages.java.util.Scanner(line);
        rowScanner.useDelimiter(this.separator);
        while(rowScanner.hasNext()) {
            values.add(rowScanner.next());
        }
        rowScanner.close();
        return values;
    }
}