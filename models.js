
/*
 * These models are very heavily based on their JavaRosa counterparts, which live at:
 * https://bitbucket.org/javarosa/javarosa/src/tip/core/src/org/javarosa/xpath/expr/
 * 
 */

var toFixed = function (x) {
  /*
   * Convert scientific notation formatted numbers to their decimal
   * counterparts
   *
   * HT: http://stackoverflow.com/questions/1685680/how-to-avoid-scientific-notation-for-large-numbers-in-javascript
   */
  var e;
  if (x < 1.0) {
    e = parseInt(x.toString().split('e-')[1]);
    if (e) {
        x *= Math.pow(10,e-1);
        x = '0.' + (new Array(e)).join('0') + x.toString().substring(2);
    }
  } else {
    e = parseInt(x.toString().split('+')[1]);
    if (e > 20) {
        e -= 20;
        x /= Math.pow(10,e);
        x += (new Array(e+1)).join('0');
    }
  }
  return x;
};

var objToXPath = function(something) {
    return something.toXPath();
};

var XPathNumericLiteral = function(value) {
    /*
     * This is shockingly complicated for what should be simple thanks to 
     * javascript number arithmetic.
     * 
     * Use the big number library to hold the value, which will hold
     * large integers properly. For everything else, do the best rounding
     * we can when exporting, since xpath doesn't like scientific notation
     * 
     */
    this.value = SchemeNumber(value);
    this.toString = function() {
        return "{num:" + this.value.toString() + "}";
    };
    this.toXPath = function() {
        return toFixed(this.value.toString());
    };
    return this;
};

var toXPathString = function(value) {
    /*
     * XPath doesn't support escaping, so all we do is check for quotation 
     * marks and if we find them, use the other kind.
     *  
     */
    if (value.indexOf("'") !== -1) {
        // it has an apostrophe so wrap it in double quotes
        return '"' + value + '"';
    } else {
        // it doesn't have an apostrophe so use single quotes, it could still
        // have a double quote
        return "'" + value + "'";
    }
};

var XPathStringLiteral = function(value) {
    this.value = value; 
    this.valueDisplay = toXPathString(value);
    this.toString = function() {
        return "{str:" + this.valueDisplay + "}"; 
    };
    this.toXPath = function() {
        return this.valueDisplay;
    };
    return this;
};

var XPathVariableReference = function(value) {
    this.value = value;
    this.toString = function() {
        return "{var:" + String(this.value) + "}";
    };
    this.toXPath = function() {
        return "$" + String(this.value);
    };
    
};

var XPathAxisEnum = {
    CHILD: "child",
    DESCENDANT: "descendant",
    PARENT: "parent",
    ANCESTOR: "ancestor",
    FOLLOWING_SIBLING: "following-sibling",
    PRECEDING_SIBLING: "preceding-sibling",
    FOLLOWING: "following",
    PRECEDING: "preceding",
    ATTRIBUTE: "attribute",
    NAMESPACE: "namespace",
    SELF: "self",
    DESCENDANT_OR_SELF: "descendant-or-self",
    ANCESTOR_OR_SELF: "ancestor-or-self"
};

var XPathTestEnum = {
	NAME: "name", 
	NAME_WILDCARD: "*", 
	NAMESPACE_WILDCARD: ":*", 
	TYPE_NODE: "node()", 
	TYPE_TEXT: "text()", 
	TYPE_COMMENT: "comment()", 
	TYPE_PROCESSING_INSTRUCTION: "processing-instruction" 

};

    
var XPathStep = function(definition) {
	/*
	 * A step (part of a path)
	 * 
	 */        
    this.axis = definition.axis;
    this.test = definition.test;
    this.predicates = definition.predicates || [];
    this.name = definition.name;
    this.namespace = definition.namespace;
    this.literal = definition.literal;
    
    this.testString = function () {
         switch(this.test) {
            case XPathTestEnum.NAME:
                return String(this.name);           
            case XPathTestEnum.TYPE_PROCESSING_INSTRUCTION:
                return "processing-instruction(" + (this.literal ? "\'" + this.literal + "\'" : "") + ")";
            case XPathTestEnum.NAMESPACE_WILDCARD:
                return this.namespace + ":*";
            default:
                return this.test || null;
         }
    };
    
    this.toString = function() {
        var stringArray = [];
                
        stringArray.push("{step:");
	    stringArray.push(String(this.axis));
	    stringArray.push(",");
	    stringArray.push(this.testString());
	    if (this.predicates.length > 0) {
            stringArray.push(",{");
            stringArray.push(this.predicates.join(","));
            stringArray.push("}");
	    }
	    
	    stringArray.push("}");
	    return stringArray.join("");
    };
    
    this.mainXPath = function () {
        var axisPrefix = this.axis + "::"; // this is the default
        // Use the abbreviated syntax to shorten the axis
        // or in some cases the whole thing
        switch (this.axis) {
            case XPathAxisEnum.DESCENDANT_OR_SELF:
                if (this.test === XPathTestEnum.TYPE_NODE) {
                    return "//";
                }
                break;
            case XPathAxisEnum.CHILD:
                axisPrefix = ""; // this is the default
                break;
            case XPathAxisEnum.ATTRIBUTE:
                axisPrefix = "@";
                break;
            case XPathAxisEnum.SELF:
                if (this.test === XPathTestEnum.TYPE_NODE) {
                    return ".";
                }
                break;
            case XPathAxisEnum.PARENT:
                if (this.test === XPathTestEnum.TYPE_NODE) {
                    return "..";
                }
                break;
            default:
               break;
        }
        return axisPrefix + this.testString();
    };
    this.predicateXPath = function () {
        if (this.predicates.length > 0) {
            return "[" + this.predicates.map(objToXPath).join("][") + "]"; 
        }
        return "";
    };
    this.toXPath = function() {
        return this.mainXPath() + this.predicateXPath();
    };
    return this;        
};

var XPathInitialContextEnum = {
    ROOT: "abs", 
    RELATIVE: "rel", 
    EXPR: "expr"
};

var XPathPathExpr = function(definition) {
    /**
     * an XPath path, which consists mainly of steps
     */

    this.initial_context = definition.initial_context;
    this.steps = definition.steps || [];
    this.filter = definition.filter;
    this.toString = function() {
        var stringArray = [];
        stringArray.push("{path-expr:");
        stringArray.push(this.initial_context === XPathInitialContextEnum.EXPR ? 
                         String(this.filter) : this.initial_context);
        stringArray.push(",{");
        stringArray.push(this.steps.join(","));
        stringArray.push("}}");
        return stringArray.join("");
    };
    this.toXPath = function() {
        var parts = this.steps.map(objToXPath), ret = [], curPart, prevPart, sep;
        var root = (this.initial_context === XPathInitialContextEnum.ROOT) ? "/" : "";
        if (parts.length === 0) {
            return root;
        }
        for (var i = 0; i < parts.length; i ++) {
            curPart = parts[i];
            if (curPart !== "//" && prevPart !== "//") {
                // unless the current part starts with a slash, put slashes between
                // parts. the only exception to this rule is at the beginning, 
                // when we only use a slash if it's an absolute path
                sep = (i === 0) ? root : "/";
                ret.push(sep);
            }
            ret.push(curPart);
            prevPart = curPart;
        }
        return ret.join("");
    };
    return this;
};


var XPathFuncExpr = function (definition) {
	/**
	 * Representation of an xpath function expression.
	 */
    this.id = definition.id;                 //name of the function
    this.args = definition.args || [];       //argument list
    this.toString = function() {
        var stringArray = [];
        stringArray.push("{func-expr:", String(this.id), ",{");
        stringArray.push(this.args.join(","));
        stringArray.push("}}");
        return stringArray.join("");
    };
    this.toXPath = function() {
        return this.id + "(" + this.args.map(objToXPath).join(", ") + ")";
    };
    return this;
};


// expressions

var XPathExpressionTypeEnum = {
    /*
     * These aren't yet really used anywhere, but they are correct.
     * They correlate with the "type" field in the parser for ops.
     * 
     */
    AND: "and", 
    OR: "or",
    EQ: "==",
    NEQ: "!=",
    LT: "<",
    LTE: "<=",
    GT: ">",
    GTE: ">=",
    PLUS: "+",
    MINUS: "-",
    MULT: "*",
    DIV: "/",
    MOD: "%",
    UMINUS: "num-neg",
    UNION: "union"
};

var expressionTypeEnumToXPathLiteral = function (val) {
    switch (val) {
        case XPathExpressionTypeEnum.EQ:
            return "=";
        case XPathExpressionTypeEnum.MOD:
            return "mod";
        case XPathExpressionTypeEnum.DIV:
            return "div";
        case XPathExpressionTypeEnum.UMINUS:
            return "-";
        case XPathExpressionTypeEnum.UNION:
            return "|";
        default:
            return val;
    }
};

var binOpToString = function() {
    return "{binop-expr:" + this.type + "," + String(this.left) + "," + String(this.right) + "}";
};

var getOrdering = function(type) {
    
    switch(type) {
        case XPathExpressionTypeEnum.OR:
        case XPathExpressionTypeEnum.AND:
            return "right";
        case XPathExpressionTypeEnum.EQ:
        case XPathExpressionTypeEnum.NEQ:
        case XPathExpressionTypeEnum.LT:
        case XPathExpressionTypeEnum.LTE:
        case XPathExpressionTypeEnum.GT:
        case XPathExpressionTypeEnum.GTE:
        case XPathExpressionTypeEnum.PLUS:
        case XPathExpressionTypeEnum.MINUS:
        case XPathExpressionTypeEnum.MULT:
        case XPathExpressionTypeEnum.DIV:
        case XPathExpressionTypeEnum.MOD:
        case XPathExpressionTypeEnum.UNION:
            return "left";
        case XPathExpressionTypeEnum.UMINUS:
            return "nonassoc";
        default:
            throw("No order for " + type);
    }
};

var getPrecedence = function(type) {
    // we need to mimic the structure defined in the jison file
    //%right OR
    //%right AND
    //%left EQ NEQ
    //%left LT LTE GT GTE
    //%left PLUS MINUS
    //%left MULT DIV MOD
    //%nonassoc UMINUS
    //%left UNION
    switch(type) {
        case XPathExpressionTypeEnum.OR:
            return 0;
        case XPathExpressionTypeEnum.AND:
            return 1;
	    case XPathExpressionTypeEnum.EQ:
	    case XPathExpressionTypeEnum.NEQ:
	        return 2;
	    case XPathExpressionTypeEnum.LT:
	    case XPathExpressionTypeEnum.LTE:
	    case XPathExpressionTypeEnum.GT:
	    case XPathExpressionTypeEnum.GTE:
	        return 3;
	    case XPathExpressionTypeEnum.PLUS:
	    case XPathExpressionTypeEnum.MINUS:
	        return 4;
	    case XPathExpressionTypeEnum.MULT:
	    case XPathExpressionTypeEnum.DIV:
	    case XPathExpressionTypeEnum.MOD:
	        return 5;
	    case XPathExpressionTypeEnum.UMINUS:
	        return 6;
	    case XPathExpressionTypeEnum.UNION:
	        return 7;
        default:
            throw("No precedence for " + type);
    }     
};

var isOp = function(someToken) {
    /*
     * Whether something is an operation
     */
    // this is probably breaking an abstraction layer.
    var str = someToken.toString();
    return str.indexOf("{binop-expr:") === 0 || str.indexOf("{unop-expr:") === 0;
};

var binOpToXPath = function() {
    var prec = getPrecedence(this.type), lprec, rprec, lneedsParens = false, rneedsParens = false,
        lString, rString;
    // if the child has higher precedence we can omit parens
    // if they are the same then we can omit
    // if they tie, we look to the ordering
    if (isOp(this.left)) {
        lprec = getPrecedence(this.left.type);
        lneedsParens = (lprec > prec) ? false : (lprec !== prec) ? true : (getOrdering(this.type) === "right");
    } 
    if (isOp(this.right)) {
        rprec = getPrecedence(this.right.type);
        rneedsParens = (rprec > prec) ? false : (rprec !== prec) ? true : (getOrdering(this.type) === "left");
    } 
    lString = lneedsParens ? "(" + this.left.toXPath() + ")" : this.left.toXPath();
    rString = rneedsParens ? "(" + this.right.toXPath() + ")" : this.right.toXPath();
    return lString + " " + expressionTypeEnumToXPathLiteral(this.type) + " " + rString;
};

var XPathBoolExpr = function(definition) {
    this.type = definition.type;
    this.left = definition.left;
    this.right = definition.right;
    this.toString = binOpToString;
    this.toXPath = binOpToXPath;
    return this;
};

var XPathEqExpr = function(definition) {
    this.type = definition.type;
    this.left = definition.left;
    this.right = definition.right;
    this.toString = binOpToString;
    this.toXPath = binOpToXPath;
    return this;
};

var XPathCmpExpr = function(definition) {
    this.type = definition.type;
    this.left = definition.left;
    this.right = definition.right;
    this.toString = binOpToString;
    this.toXPath = binOpToXPath;
    return this;
};
 
var XPathArithExpr = function(definition) {
    this.type = definition.type;
    this.left = definition.left;
    this.right = definition.right;
    this.toString = binOpToString;
    this.toXPath = binOpToXPath;
    return this;
};

var XPathUnionExpr = function(definition) {
    this.type = definition.type;
    this.left = definition.left;
    this.right = definition.right;
    this.toString = binOpToString;
    this.toXPath = binOpToXPath;
    return this;
};

var XPathNumNegExpr = function(definition) {
    this.type = definition.type;
    this.value = definition.value;
    this.toString = function() {
        return "{unop-expr:" + this.type + "," + String(this.value) + "}";
    };
    this.toXPath = function() {
        return "-" + this.value.toXPath();
    };
    return this;
};
