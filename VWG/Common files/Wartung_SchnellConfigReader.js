SchnellConfigReader = new function() 
{
    var _filename = "";
    var _xmlRoot;
  
  this.getSectionValueByAttributeValue = function(sSection,sEntry,sAttribute,sValue,filename)
    {
        this.init(filename); 
        var xmlElements = _xmlRoot.getChild(sSection).getChildren(sEntry)
        for (var i = 0; i< xmlElements.size();i++) 
        {
            if (xmlElements.get(i).getAttribute(sAttribute).getValue() == sValue) return xmlElements.get(i).getValue();   
        }
        return null;
    }
  
    this.getConfigSectionAttributeByEntryValue = function(sSection,sEntry,sAttribute,sValue,filename)
    {
        this.init(filename); 
        var xmlElements = _xmlRoot.getChild(sSection).getChildren(sEntry)
        for (var i = 0; i< xmlElements.size();i++) 
        {
            if (xmlElements.get(i).getValue() == sValue) return xmlElements.get(i).getAttribute(sAttribute).getValue();   
        }
        return null;
    }
  
  
    this.getConfigSectionAttributeByValue = function(sSection,sEntry,sAttribute,sValue,filename)
    {
        this.init(filename); 
        var xmlElements = _xmlRoot.getChild(sSection).getChildren(sEntry)
        for (var i = 0; i< xmlElements.size();i++) 
        {
            if (xmlElements.get(i).getText() === sValue) return xmlElements.get(i).getAttribute(sAttribute).getValue();   
        }
        return null;
    }
  
    this.getConfigAttribute = function(sSection,sEntry,sAttribute,filename)
    {
        this.init(filename);      
        var xmlElement = this.getConfigEntryChild(sSection,sEntry);
        if (xmlElement == null) return null;
        return xmlElement.getAttribute(sAttribute).getValue();
    }
    
    this.getConfigAttributeBy = function(sSection,sEntry,sFilter,sAttribute,filename)
    {
        this.init(filename);      
        var xmlElements = _xmlRoot.getChild(sSection).getChildren(sEntry)
        for (var i = 0; i< xmlElements.size();i++) 
        {
             if (xmlElements.get(i).getAttribute(sAttribute).getValue() == sFilter) return xmlElements.get(i).getAttribute(sAttribute).getValue();
        }
        return null
    }
    
    this.getConfigSectionAsList = function(sSection,sEntry,filename) {
        this.init(filename); 
        var xmlElements = _xmlRoot.getChild(sSection).getChildren(sEntry)
        var result = new Array();
        for (var i = 0; i< xmlElements.size();i++) 
        {
            result.push(xmlElements.get(i).getText());
        }
        return result
    }
    
    this.getConfigSectionEx = function(sSection,sChild,sEntry,filename)
    {
        this.init(filename); 
        return this.getConfigEntryChild(sSection,sChild).getChild(sEntry).getText();
    }
    
  
    this.getConfigSection = function(sSection,sEntry,filename)
    {
        this.init(filename); 
        var result = this.getConfigEntryChild(sSection,sEntry).getText();
        return result;
    }
    
    this.getConfigEntryChild = function(sSection,sEntry) 
    {
        return _xmlRoot.getChild(sSection).getChild(sEntry);
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