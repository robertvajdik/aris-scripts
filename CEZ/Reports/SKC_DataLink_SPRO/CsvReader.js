function CsvReader() {

    this.directory = "";
}

CsvReader.COMMA_DELIMITER = ";"

CsvReader.prototype.isInScanMode = function() {
    return !this.directory.equals("");
}

CsvReader.prototype.deleteFiles = function () {

    var file =  new Packages.java.io.File(this.directory);
    Packages.org.apache.commons.io.FileUtils.cleanDirectory(file);

}
CsvReader.prototype.scanFile = function (directory) {

    this.directory = directory;
    var files = Packages.java.nio.file.Files.list(Packages.java.nio.file.Paths.get(directory)).toArray();

    var file = files.filter(function (file) {
        return org.apache.commons.io.FilenameUtils.getExtension(file).equals("csv");
    });
    if (file.length === 0) return [];
    this.scannedFiles = files.map(function (item) {
        return item;
    });
    return this.readFile(String(file[0].toString()));

}

CsvReader.prototype.readFile = function (filePath) {

    var records = [];
    var file;
    var scanner;

    try {

        if (typeof filePath !== 'string') {

            file = new Packages.java.io.ByteArrayInputStream(filePath.getData());
        } else {
            file = new Packages.java.io.File(filePath);
        }
        scanner = new Packages.java.util.Scanner(file, "UTF-8");

        while (scanner.hasNextLine()) {
            var values = this.getRecordFromLine(scanner.nextLine());
            if (values !== null) records.push(values);

        }
    } catch (ex) {


    } finally {

        if (scanner !== undefined && scanner !== null) scanner.close();
    }


    return records;
}

CsvReader.prototype.getRecordFromLine = function (line) {

    var values = [];
    var scanner = new Packages.java.util.Scanner(line);

    try {
        scanner.useDelimiter(CsvReader.COMMA_DELIMITER);
        while (scanner.hasNext()) {
            values.push(scanner.next());
        }
    } catch (ex) {
        values = [];
    } finally {
        if (scanner !== null) scanner.close();
    }
    return values;
}