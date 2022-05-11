/** 
* AUDIConfigReader simulates the methods Context:getPrivateProfileString
* and Context:getPrivateProfileInt. It has the same Parameter and expects
* the config file in Common or in the scriptcategory
*/
AUDIConfigReader = new function(){
    var _sFileName = "";
    var _root;
    /**
    * returns the string of the config file. the method assumes that the entry in the config
    * file consists of sEntry+locID, e.g.<FZD1031>
    * @param {String} sSection section of the config file. childnode of the rootnode
    * @param {String} sEntry name of childnode of sSection-node.
    * @param {String} sDefault default value returned in case of an error
    * @param {String} sFilename name of the configfile. config file must be xml
    */
    this.getConfigString = function(sSection,sEntry,sDefault,sFilename){
        var sResult = sDefault;
        if(!sFilename.equals(_sFileName) || _root==null){
            _root = null;
            var file = null;
            try 
            {
                file = Context.getFile(sFilename,Constants.LOCATION_COMMON_FILES);
            }
            catch (e) 
            {
                file = null;
            }
            
            if(file==null || file.length==0){
                try 
                {
                    file = Context.getFile(sFilename,Constants.LOCATION_SCRIPT);
                }
                catch (e) 
                {
                    file = null;
                }
            }
            if(file!=null && file.length>0){
                var doc = Context.getXMLParser(file);
                _root = doc.getRootElement();
                _sFileName = sFilename
            }
        }
        if(_root!=null){
            try{
                sResult = _root.getChild(sSection).getChild(sEntry).getText();
            }catch(e){
                // return default value
            }
        }
            
        return sResult;
    }
    /**
    * returns the string of the config file depending on the selected language. the method
    * assumes that the entry in the config file consists of sEntry+locID, e.g.<FZD1031>
    * @param {String} sSection section of the config file. childnode of the rootnode
    * @param {String} sEntry name of childnode of sSection-node.
    * @param {String} sDefault default value returned in case of an error
    * @param {String} sFilename name of the configfile. config file must be xml
    */
    this.getLanguageDependentConfigString = function(sSection,sEntry,sDefault,sFilename){
        var sResult = sDefault;
        if(!sFilename.equals(_sFileName) || _root==null){
            _root = null;
            var file = Context.getFile(sFilename,Constants.LOCATION_COMMON_FILES);
            if(file==null || file.length==0){
                file = Context.getFile(sFilename,Constants.LOCATION_SCRIPT);
            }
            if(file!=null && file.length>0){
                var doc = Context.getXMLParser(file);
                _root = doc.getRootElement();
                _sFileName = sFilename
            }
        }
        if(_root!=null){
            try{
                sResult = _root.getChild(sSection).getChild(sEntry+Context.getSelectedLanguage()).getText();
            }catch(e){
                // return default value
            }
        }
            
        return sResult;
    }
    
    /**
    * returns the string of the config file depending on the selected language. the method
    * assumes that the entry in the config file consists of sEntry+locID, e.g.<FZD1031>
    * @param {String} sSection section of the config file. childnode of the rootnode
    * @param {String} sEntry name of childnode of sSection-node.
    * @param {String} sDefault default value returned in case of an error
    * @param {Number} nLoc Language for which config string should be read
    * @param {String} sFilename name of the configfile. config file must be xml
    */
    this.getConfigStringByLangID = function(sSection,sEntry,sDefault,nLoc,sFilename){
        var sResult = sDefault;
        if(!sFilename.equals(_sFileName) || _root==null){
            _root = null;
            var file = Context.getFile(sFilename,Constants.LOCATION_COMMON_FILES);
            if(file==null || file.length==0){
                file = Context.getFile(sFilename,Constants.LOCATION_SCRIPT);
            }
            if(file!=null && file.length>0){
                var doc = Context.getXMLParser(file);
                _root = doc.getRootElement();
                _sFileName = sFilename
            }
        }
        if(_root!=null){
            try{
                sResult = _root.getChild(sSection).getChild(sEntry+nLoc).getText();
            }catch(e){
                // return default value
            }
        }
            
        return sResult;
    }
}