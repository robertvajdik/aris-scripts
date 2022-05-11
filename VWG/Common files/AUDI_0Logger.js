/**
 * Logger utility object
 * ...
 * @author  Jens Schimmelpfennig
 * @version 0.1
 * @constructor
 */
Logger = new function() {
    // root logger instance
    var _logger = new java.util.logging.Logger.getLogger("global");
    var _aFilenameS = new Array();
    
    /**
     * Return a new child logger for the given name
     * @param {String} sLoggerName  Hierarchichal logger name
     * @return                      Child logger instance
     * @type                        org.apache.log4j.Logger
     */
    this.getLogger = function(strLoggerName) {
        return _logger.getLogger(strLoggerName);
    }

    /**
     * Initialize all loggers using a Java properties instance.
     * The properties instance is optional - if no properties are passed,
     * default properties are used.
     * @param {java.util.Properties} properties Logger configuration.
     */
    this.initLogger = function(properties) {
        // check if there are valid properties, otherwise use default
        if (!properties) {
            // no properties given - load them from the default configuration file
            properties = PropertiesProvider.getPropertyStream(java.lang.String("properties_defaultlogger.js"));
            if (null == properties)
                throw(new Error("Error: Could not load default logger configuration file."));
        }
        else if (properties instanceof String || properties instanceof java.lang.String) {
            // no properties given - load them from the default configuration file
            properties = PropertiesProvider.getPropertyStream(java.lang.String(properties));
            if (null == properties)
                throw(new Error("Error: Could not load default logger configuration file."));
        }
                
        // configure loggers according to the properties file       
        //Packages.org.apache.log4j.PropertyConfigurator.configure(properties);
        var oLogManager = java.util.logging.LogManager.getLogManager();
        oLogManager.reset();
        oLogManager.readConfiguration(properties);
        
        //_logger.info("Root logger initialized.");
        
        // check if the log files are to reside on the server or are to be transfered to the client
        /*for (var aKeyS = properties.keys(); aKeyS.hasMoreElements();) {
            var sKey = aKeyS.nextElement() + "";
            
            if (sKey.toLowerCase().indexOf("file.transfer") > 0) {
                // get the respective property
                var sValue = properties.getProperty(sKey);
                if (sValue.equals("true")) {
                    // property set to true -> file is to be transfered to the client
                    // determine file
                    sKey = sKey.substring(0, sKey.lastIndexOf("."));
                    _aFilenameS.push(properties.getProperty(sKey));
                }
            }
        }*/       
    }
    
    /**
     * Close all registered log appenders and remove them. Also releases all log files.
     * Should be called when leaving the report.
     */
    this.closeLogger = function() {
        var oHandlerS = _logger.getHandlers();
        for(var i=0; i < oHandlerS.length; i++){
            oHandlerS[i].flush();
            oHandlerS[i].close();
        }
        for (var i = 0; i < _aFilenameS.length; i++) {
            Context.addOutputFileName("../../../" + _aFilenameS[i], Constants.LOCATION_INTERNAL);
        }
    }
}


/**
 * Properties provider
 * Loads properties from various sources.
 * @author  Jens Schimmelpfennig
 * @constructor
 */
PropertiesProvider = new function() {
    /**
     * <h3>Provider method</h3>
     * Loads properties from various source.<br/>
     * Supported argument types are:<br/>
     * <ul><li>Byte arrays</li><li>Strings (java.lang.String and javascript String)</li><li>java.util.File</li></ul>
     * @param {Object} arg  Argument
     * @return              Java properties instance
     * @type                java.util.Properties
     */
    this.getProperties = function(arg) {
        // properties that are to be loaded
        var properties = new java.util.Properties();

        // check if the argument is a byte array
        if (arg instanceof Array) {
            // byte array, load properties from byte input stream
            properties.load(new java.io.ByteArrayInputStream(arg));

        } else if (arg instanceof String || arg instanceof java.lang.String) {
            // String -> filename within common files
            // try to load from common files
            var aByteS = Context.getFile(arg, Constants.LOCATION_COMMON_FILES);
            if (null != aByteS && aByteS.length > 0) {
                properties = this.getProperties(aByteS); // use the implementation above   
            } else {
                // not found in common files, try to load it from the file system
                try {
                    var file = new java.io.File(arg);
                    if (null != file && file.exists()) {
                        properties = getProperties(file);   
                    }    
                } catch (e) {
                    // not found, etc. ignoring it will result in empty properties to be returned -> acceptable   
                }
            }
        } else if (arg instanceof java.io.File) {
            // file given
            properties.load(new java.io.FileInputStream(arg));
        }

        return properties;        
    }
    
    this.getPropertyStream = function(arg) {
          // check if the argument is a byte array
        if (arg instanceof Array) {
            // byte array, load properties from byte input stream
            return new java.io.ByteArrayInputStream(arg);

        } else if (arg instanceof String || arg instanceof java.lang.String) {
            // String -> filename within common files
            // try to load from common files
            var aByteS = Context.getFile(arg, Constants.LOCATION_COMMON_FILES);
            if (null != aByteS && aByteS.length > 0) {
                return new java.io.ByteArrayInputStream(aByteS);
            } else {
                // not found in common files, try to load it from the file system
                try {
                    var file = new java.io.File(arg);
                    if (null != file && file.exists()) {
                        properties = getProperties(file);   
                    }    
                } catch (e) {
                    // not found, etc. ignoring it will result in empty properties to be returned -> acceptable   
                }
            }
        } else if (arg instanceof java.io.File) {
            // file given
            return new java.io.FileInputStream(arg);
        }

    }
}