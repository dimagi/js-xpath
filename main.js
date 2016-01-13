var parser = require('./parser.js').parser,
    makeXPathModels = require('./models.js').makeXPathModels;

parser.yy.xpathmodels = makeXPathModels();
parser.makeXPathModels = makeXPathModels;

parser.setXPathModels = function(models) {
    parser.yy.xpathmodels = models;
};

window.xpath = parser;
