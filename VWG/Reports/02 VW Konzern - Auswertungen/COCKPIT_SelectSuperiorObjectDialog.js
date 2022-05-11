function SelectSuperiorObjectDialog(locale, objects) {
  this.locale = locale;
  this.objects = objects;
  this.dialogResult = {
    isOk: false,
    selected: null,
  }
  
  this.isInValidState = function (pageNumber) {
    return true;
  }
  
  this.init = function () {
    
    var locale = this.locale;
    this.objects = ArisData.sort(this.objects,Constants.AT_NAME,locale);
    var dropListBox = this.getPageElement(0, "SELECT_DIALOG_DROP_LIST_BOX");
   
    var items = this.objects.map(function(objectDefinition){ return objectDefinition.Name(locale)});
    dropListBox.setItems(items);
    dropListBox.setSelection(0);
    this.dialogResult.selected = this.objects[0];
   
  }
  
  this.getResult = function () {
    return this.dialogResult
  }
  
  this.onClose = function (pageNumber, bOk) {
    this.dialogResult.isOk = bOk;
  }
  
  this.getPages = function () {
    
    return [this.createMainPage()];
  }
  
  this.SELECT_DIALOG_DROP_LIST_BOX_selChanged = function (index) {
    
    this.dialogResult.guid = this.objects[index].Name(this.locale);
  }
}

SelectSuperiorObjectDialog.prototype = Object.create(BaseDialog.prototype);
SelectSuperiorObjectDialog.prototype.constructor = SelectSuperiorObjectDialog;


SelectSuperiorObjectDialog.prototype.createMainPage = function () {
  
  var page = Dialogs.createNewDialogTemplate(500, 240, BaseDialog.getStringFromStringTable("SELECT_DIALOG_NAME", this.locale));
  page.GroupBox(5, 5,
                500 - 5, 240 - 5,
                BaseDialog.getStringFromStringTable("SELECT_DIALOG_MAIN_GROUP_BOX", this.locale), "SELECT_DIALOG_MAIN_GROUP_BOX"
  );
  
  page.DropListBox(10, 10, 500 - 20, 20, [], "SELECT_DIALOG_DROP_LIST_BOX");
  return page;
}

