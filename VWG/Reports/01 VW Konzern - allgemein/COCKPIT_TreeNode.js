function TreeNode(group, objects, locale) {
    this.group = group;
    this.groupGUID = group.GUID();
    this.objects = objects;
    this.children = [];
    this.treeIndex = 0;
    this.locale = locale;
    this.groupName = this.getGroupName(locale);

}

TreeNode.prototype.getObjects = function () {
    return this.objects;
}

TreeNode.prototype.getGroupName = function (locale) {
    return BaseDialog.getMaintainedObjectName(this.group,locale);
}