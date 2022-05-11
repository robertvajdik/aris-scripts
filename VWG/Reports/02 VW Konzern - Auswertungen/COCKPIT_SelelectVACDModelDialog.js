function SelectVACDModelDialog(locale, object) {
    this.locale = locale;
    this.object = object;
    this.vacds = [];
    this.dialogResult = {
        isOk: false,
        guid: null,
    }
    
    this.isInValidState = function (pageNumber) {
        return true;
    }
    
    this.init = function () {
        var locale = this.locale;
        this.vacds = this.object.AssignedModels(Constants.MT_VAL_ADD_CHN_DGM);
        var items = this.vacds.map(function(model) {
            return BaseDialog.getMaintainedObjectName(model,locale);
        })
        var  dropListBox = this.getPageElement(0,"SELECT_DIALOG_DROP_LIST_BOX");
        dropListBox.setItems(items);
        dropListBox.setSelection(0);
        this.dialogResult.guid = this.vacds[0].GUID();
        this.setPicture(0);
    }
    
    this.getResult = function () {
        return this.dialogResult
    }
    
    this.onClose = function(pageNumber, bOk) {
        this.dialogResult.isOk = bOk;
    }
    
    this.getPages = function () {
        
        return [this.createMainPage()];
    }
    
    this.SELECT_DIALOG_DROP_LIST_BOX_selChanged = function (index) {
        
        this.dialogResult.guid = this.vacds[index].GUID();
        this.setPicture(index)
    }
}

SelectVACDModelDialog.prototype = Object.create(BaseDialog.prototype);
SelectVACDModelDialog.prototype.constructor = SelectVACDModelDialog;


SelectVACDModelDialog.prototype.createMainPage = function () {
    
    var page = Dialogs.createNewDialogTemplate(500, 240, BaseDialog.getStringFromStringTable("SELECT_DIALOG_NAME", this.locale));
    page.GroupBox(5, 5,
                  500 - 5, 240 - 5,
                  BaseDialog.getStringFromStringTable("SELECT_DIALOG_MAIN_GROUP_BOX", this.locale), "SELECT_DIALOG_MAIN_GROUP_BOX"
    );
    
    page.DropListBox(10, 10, 500 - 20, 20, [], "SELECT_DIALOG_DROP_LIST_BOX");
    page.Picture(10,30,500-20,220,"SELECTED_MODEL_PICTURE");
    return page;
}

SelectVACDModelDialog.prototype.setPicture = function (index) {
    
    var model = this.vacds[index];
    var picture = model.Graphic(false,false,this.locale);
    var pictureElement = this.getPageElement(0,"SELECTED_MODEL_PICTURE");
    
    var dummyOutput = Context.createOutputObject();
    var sfileName = model.GUID() + ".png";
    picture.setZoom(20);
    picture.Save(dummyOutput, sfileName);
    
    var data = Context.getFile(sfileName, Constants.LOCATION_OUTPUT);
    pictureElement.setPicture(data,"png");
    Context.deleteFile(sfileName);
}
