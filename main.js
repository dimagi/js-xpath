var parser = require('./parser.js').parser,
    models = require('./models.js');

parser.yy.xpathmodels = models.xpathmodels;
parser.makeXPathModels = models.makeXPathModels;

parser.setXPathModels = function(models) {
    parser.yy.xpathmodels = models;
};

window.xpath = parser;
