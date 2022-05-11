//*****************************
//      Daniel Masek            
//      Skoda Auto a.s.           
//******************************

/*
Skoda Auto Logger based on LOG4J2 library which creates log at specified path and at users output folder if it is required
Notice that loger class must be unique for each instance of FileLogger!
Do not forget to call descructor in the end of your script for FileLogger!
*/

// ----------------------------------------------------    
// Initiate File Logger
// ----------------------------------------------------  
function getLog4jFileLogger(loggerclass, logfilename, logfilepath, loggerlayout, loggerlevel) {
    
    var loglass = getUniqueLoggerclass(loggerclass)
    var level = getLevels(loggerlevel);
    var context = new org.apache.logging.log4j.LogManager.getContext(false);
    var config = context.getConfiguration();
    var layout = setLayout(loggerlayout);
    var appender = setFileAppender(logfilename, logfilepath, layout, config);

    appender.start();
    config.addAppender(appender);

    var appenderrefs = setAppenderRefs();
    var loggerconfig = setLoggerConfig(loglass, level, appenderrefs, config);

    loggerconfig.addAppender(appender, null, null);
    config.addLogger(loglass, loggerconfig);
    context.updateLoggers();

    logger = new org.apache.logging.log4j.LogManager.getLogger(loglass);

    return logger;
}

// ----------------------------------------------------    
// Initiate File Roller Logger
// ----------------------------------------------------  
function getLog4jRollerLogger(loggerclass, logfilename, logfilepath, logarchivepath, loggerlayout, loggersize, loggerlevel) {
    var level = getLevels(loggerlevel);
    var context = new org.apache.logging.log4j.LogManager.getContext(false);
    var config = context.getConfiguration();
    var infofilter = setInfofilter();
    var layout = setLayout(loggerlayout);
    var triggerpolicy = setPolicy(loggersize);
    var rolloverstrategy = setRollerStrategy(config);
    var rollerappender = setRollerAppender(logfilename, logfilepath, logarchivepath, triggerpolicy, rolloverstrategy, layout, infofilter, config);

    rollerappender.start();
    config.addAppender(rollerappender);

    var appenderrefs = setAppenderRefs();
    var loggerconfig = setLoggerConfig(loggerclass, level, appenderrefs, config);

    loggerconfig.addAppender(rollerappender, null, null);
    config.addLogger(loggerclass, loggerconfig);
    context.updateLoggers();

    rollerlogger = new org.apache.logging.log4j.LogManager.getLogger(loggerclass);

    return rollerlogger;

}
// ----------------------------------------------------    
// Generate Datetime index
// ----------------------------------------------------     
function getUniqueLogfilename(logfilename, logfilesuffix) {

    var timeformat = new java.text.SimpleDateFormat('yyyyMMddHHmmss');
    var now = new Date();
    var date = timeformat.format(now);

    return logfilename + date + logfilesuffix;
}

// ----------------------------------------------------    
// Generate Unique logger class
// ----------------------------------------------------     
function getUniqueLoggerclass(loggerclass) {
    const classseparator = ".";
    if (new org.apache.logging.log4j.LogManager.exists(loggerclass)){
        return loggerclass+classseparator+makeId(5);
    }else{
        return loggerclass;
    }   
}
// ----------------------------------------------------    
// Generate Random Idenfier
// ----------------------------------------------------  
function makeId(IDlength) {
   var result           = '';
   var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   var charactersLength = characters.length;
   for ( var i = 0; i < IDlength; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}


// ----------------------------------------------------    
// Convert string to LOG4J values
// ----------------------------------------------------      
function getLevels(loggerlevel) {

    switch (loggerlevel) {
        case 'trace':
            return org.apache.logging.log4j.Level.TRACE;
        case 'debug':
            return org.apache.logging.log4j.Level.DEBUG;
        case 'info':
            return org.apache.logging.log4j.Level.INFO;
        case 'warn':
            return org.apache.logging.log4j.Level.WARN;
        case 'error':
            return org.apache.logging.log4j.Level.ERROR;
        case 'fatal':
            return org.apache.logging.log4j.Level.FATAL;
        case 'all':
            return org.apache.logging.log4j.Level.ALL;

    }
}

// ----------------------------------------------------    
// Create LOG4J log Infofilter
// ----------------------------------------------------           
function setInfofilter() {

    return new org.apache.logging.log4j.core.filter.ThresholdFilter.createFilter(org.apache.logging.log4j.Level.ALL, org.apache.logging.log4j.core.Filter.Result.ACCEPT, org.apache.logging.log4j.core.Filter.Result.ACCEPT)
}
// ----------------------------------------------------    
// Create LOG4J log Layout
// ----------------------------------------------------           
function setLayout(loggerlayout) {

    return new org.apache.logging.log4j.core.layout.PatternLayout.newBuilder().withPattern(loggerlayout).build();
}

// ----------------------------------------------------    
// Create LOG4J log TriggerPolicy
// ----------------------------------------------------           
function setPolicy(size) {

    return new org.apache.logging.log4j.core.appender.rolling.SizeBasedTriggeringPolicy.createPolicy(size);
}

// ----------------------------------------------------    
// Create LOG4J log Rollerstrategy
// ----------------------------------------------------           
function setRollerStrategy(config) {

    const compreslevel = java.util.zip.Deflater.DEFAULT_COMPRESSION;

    return new org.apache.logging.log4j.core.appender.rolling.DefaultRolloverStrategy.createStrategy("40000", "1", "1", compreslevel, null, true, config);
}

// ----------------------------------------------------    
// Create LOG4J FileRoller appender
// ----------------------------------------------------     
function setRollerAppender(logfile, logfilepath, logarchivepath, triggerpolicy, rolloverstrategy, layout, fileinfofilter, config) {

    return new org.apache.logging.log4j.core.appender.RollingFileAppender.createAppender(logfilepath + logfile,
        logarchivepath + logfile + "rolling-%d{MM-dd-yy_hhmm}.log.zip",
        "true",
        "RollingFile",
        "true",
        "40000000",
        "true",
        triggerpolicy,
        rolloverstrategy,
        layout,
        fileinfofilter,
        "true",
        "true",
        "",
        config);
}

// ----------------------------------------------------    
// Create LOG4J File appender
// ----------------------------------------------------     
function setFileAppender(logfile, logfilepath, layout, config) {

    return new org.apache.logging.log4j.core.appender.FileAppender.createAppender(logfilepath + logfile, "false", "false", "File", "true",
        "true", "false", "4000", layout, null, "false", null, config);
}

// ----------------------------------------------------    
// Create LOG4J Appender referals
// ----------------------------------------------------         
function setAppenderRefs() {
    var appenderref = new org.apache.logging.log4j.core.config.AppenderRef.createAppenderRef("File", null, null);
    var appenderrefs = new Array();

    appenderrefs.push(appenderref);

    return appenderrefs;
}

// ----------------------------------------------------    
// Create LOG4J Configuration
// ----------------------------------------------------         
function setLoggerConfig(loggerclass, loggerlevel, appenderrefs, config) {

    return new org.apache.logging.log4j.core.config.LoggerConfig.createLogger("false", org.apache.logging.log4j.Level.ALL, loggerclass, "true", appenderrefs, null, config, null);
}

// ----------------------------------------------------    
// Write log function
// ----------------------------------------------------
function writeLog(logger, message, level) {

    switch (level) {
        case 'trace':
            logger.trace(message);
            break;
        case 'debug':
            logger.debug(message);
            break;
        case 'info':
            logger.info(message);
            break;
        case 'warn':
            logger.warn(message);
            break;
        case 'error':
            logger.error(message);
            break;
        case 'fatal':
            logger.fatal(message);
            break;

    }
}
// ----------------------------------------------------    
// Exit LOG4J logger
// ----------------------------------------------------     
function exitLog4jFileLogger(logger) {
    var context = logger.getContext();
    var config = context.getConfiguration();

    config.removeLogger(logger.getName());
    context.updateLoggers();
}

// ----------------------------------------------------    
// SAG - Save Log File to remote user's direcotory
// ----------------------------------------------------
function copyLogFile(logfilename) {

    try {
        var inputStream = null;
        var source = new Packages.java.io.File(logfilename);

        inputStream = new Packages.java.io.FileInputStream(source);

        var outputSAP = Context.createOutputObject();

        Context.setSelectedFile(source.getName());

        var buffer = Packages.java.lang.reflect.Array.newInstance(Packages.java.lang.Byte.TYPE, source.length());
        var i = inputStream.read(buffer);

        inputStream.close();
        inputStream = null;
        Context.setFile(source.getName(), Constants.LOCATION_OUTPUT, buffer)

    } catch (e) {
        if (inputStream != null) inputStream.close();

        return null;
    }
}