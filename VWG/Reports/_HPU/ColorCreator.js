function ColorCreator() {

}

ColorCreator.prototype.createBackgroundColor = function(red, green, blue) {
    var javaColor = new java.awt.Color(red / 255.0, green / 255.0, blue / 255.0, 1);
    var rgb = javaColor.getRGB();
    return rgb & 0xFFFFFF;
};

ColorCreator.prototype.createColor = function(red,green,blue) {
    return new java.awt.Color(red / 255.0, green / 255.0, blue / 255.0, 1);
};
