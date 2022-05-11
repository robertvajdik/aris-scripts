function Item(name, isFolder, object, parent) {
    this.name = String(name);
    this.parent = parent;
    this.isFolder = isFolder;
    this.object = object;
    this.children = [];
    this.treeIndex = -1;
    this.guid = PRP_Helper.hashCode(this.name);
    if (!BaseDialog.isArisObjectNullOrInvalid(object)) this.guid = String(object.GUID());


}

Item.prototype.addChild = function (item) {

    var isIn = this.children.some(function (child) {
        return child.name.localeCompare(item.name) === 0;
    });

    if (!isIn) this.children.push(item);
}

Item.prototype.clone = function () {

    var clone;
    if (this.parent !== null) clone = new Item(this.name, this.isFolder, this.object, this.parent);
    else clone = new Item(this.name, this.isFolder, this.object, null);

    clone.children = this.children.map(function (item) {
        return item.clone();
    });

    return clone;

}