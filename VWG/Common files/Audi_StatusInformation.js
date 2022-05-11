var _logger;
var handler;

function WriteOutput(sStatusText,bUpdateStatuswindow){
    _logger.info(sStatusText);
}

function StartLogging(sLogger,sHandler){
    if(_logger==null && handler==null){
        _logger = Logger.getLogger(sLogger);
        _logger.setUseParentHandlers(false);
        handler = new Packages.java.util.logging.FileHandler(sHandler, 5000000, 3, true);
    }
    handler.setFormatter(new Packages.java.util.logging.SimpleFormatter());
    _logger.addHandler(handler);
}

function EndLogging(){
    if(handler!=null){
        handler.close();
        handler.flush();
    }
}