DomainConfigReader = new function() 
{
    var _filename = "";
    var _xmlRoot;
	var sEntry = "Row";
  
    this.getConfigurations = function(sSection,sEntry,filename)
    {
        this.init(filename);
        var Configuration = new Array();
        var ConfigurationItem = new Array();
        
        var xmlConfiguration = _xmlRoot.getChild(sSection).getChildren(sEntry)
        for (var i = 0; i< xmlConfiguration.size();i++) 
        {
        var xmlConfigurationItem = xmlConfiguration.get(i).getChildren();
        for (var ii = 0; ii< xmlConfigurationItem.size();ii++)
        {
        ConfigurationItem.push(xmlConfigurationItem.get(ii).getValue());
        }
        Configuration.push(ConfigurationItem);
        ConfigurationItem = Array();
        }
        return Configuration;
        
    }
	
	this.init = function(filename) 
    {
        if (_xmlRoot == null) this.initXmlFile(filename);
    }
    
    this.initXmlFile = function(filename)
    {
        _xmlRoot = null;
        var file = null;
        try 
        {
            file = Context.getFile(filename,Constants.LOCATION_COMMON_FILES);
        }
        catch (e) 
        {
            file = null;
        }
        
        if(file==null || file.length==0)
        {
            try 
            {
                file = Context.getFile(filename,Constants.LOCATION_SCRIPT);
            }
            catch (e) 
            {
                file = null;
            }
        }
        var doc = Context.getXMLParser(file);
        _xmlRoot = doc.getRootElement();
        _filename = filename
        return true;
    }
	
}