
var validateAxisName = function(name) {
    for (var i in XPathAxisEnum) {
        if (XPathAxisEnum.hasOwnProperty(i) && XPathAxisEnum[i] === name) {
            return XPathAxisEnum[i];
        }
    }
    throw name + " is not a valid axis name!";
}

