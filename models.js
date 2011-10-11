
/*
 * These models are very heavily based on their JavaRosa counterparts, which live at:
 * https://bitbucket.org/javarosa/javarosa/src/tip/core/src/org/javarosa/xpath/expr/
 * 
 */

var XPathNumericLiteral = function(value) {
    this.value = value;
    this.toString = function() {
        return "{num:" + String(this.value) + "}";
    }
    return this;
};

var XPathStringLiteral = function(value) {
    this.value = value; 
    this.toString = function() {
        return "{str:'" + this.value + "'}"; //TODO: s needs to be escaped (' -> \'; \ -> \\)
    }
    return this;
};

var XPathVariableReference = function(value) {
    this.value = value;
    this.toString = function() {
        return "{var:" + String(this.value) + "}";
    }
}

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
	TYPE_PROCESSING_INSTRUCTION: "proc-instr" 

};

var XPathStep = function(definition) {
/*
 * A step (part of a path)
 * 
 */        
    this.axis = definition.axis;
    this.test = definition.test;
    this.predicates = definition.predicates;
    this.name = definition.name;
    this.namespace = definition.namespace;
    this.literal = definition.literal;
    return this;        
};

var XPathInitialContextEnum = {
    ROOT: "root", 
    RELATIVE: "rel", 
    EXPR: "expr", 
};

var XPathPathExpr = function(definition) {
    /**
     * an XPath path, which consists mainly of steps
     */

    this.initial_context = definition.initial_context;
    this.steps = definition.steps || [];
    this.filter = definition.filter;
    return this;
};


var XPathFuncExpr = function (definition) {
	/**
	 * Representation of an xpath function expression.
	 */
    this.id = definition.id;                   //name of the function
    this.args = definition.args || [];       //argument list
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
    MOD: "%"    
};

var binOpToString = function() {
    return "{binop-expr:" + this.type + "," + String(this.left) + "," + String(this.right) + "}";
}

var XPathBoolExpr = function(definition) {
    this.type = definition.type;
    this.left = definition.left;
    this.right = definition.right;
    this.toString = binOpToString;
    return this;
};

var XPathEqExpr = function(definition) {
    this.type = definition.type;
    this.left = definition.left;
    this.right = definition.right;
    this.toString = binOpToString;
    return this;
};

var XPathCmpExpr = function(definition) {
    this.type = definition.type;
    this.left = definition.left;
    this.right = definition.right;
    this.toString = binOpToString;
    return this;
};
 
var XPathArithExpr = function(definition) {
    this.type = definition.type;
    this.left = definition.left;
    this.right = definition.right;
    this.toString = binOpToString;
    return this;
};

var XPathUnionExpr = function(definition) {
    this.type = definition.type;
    this.left = definition.left;
    this.right = definition.right;
    this.toString = binOpToString;
    return this;
};

var XPathNumNegExpr = function(definition) {
    this.type = definition.type;
    this.value = definition.value;
    this.toString = function() {
        return "{unop-expr:" + this.type + "," + String(this.value) + "}";
    }
    return this;
};
