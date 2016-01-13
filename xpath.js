(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.xpath = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

/*
 * These models are very heavily based on their JavaRosa counterparts, which live at:
 * https://bitbucket.org/javarosa/javarosa/src/tip/core/src/org/javarosa/xpath/expr/
 *
 */

if (!Function.prototype.bind) {
    // PhantomJS doesn't support bind yet
    Function.prototype.bind = function(oThis) {
        if (typeof this !== 'function') {
            // closest thing possible to the ECMAScript 5
            // internal IsCallable function
            throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
        }

        var aArgs   = Array.prototype.slice.call(arguments, 1),
            fToBind = this,
            fNOP    = function() {},
            fBound  = function() {
                return fToBind.apply(this instanceof fNOP ? this : oThis,
                                     aArgs.concat(Array.prototype.slice.call(arguments)));
            };

        fNOP.prototype = this.prototype;
        fBound.prototype = new fNOP();

        return fBound;
    };
}

var defaultHashtagConfig = {
    // @param namespace - the namespace used in hashtag
    // @return - truthy value
    isValidNamespace: function (namespace) {
        return false;
    },
    // @param hashtagExpr - text of hashtag ex. #form/question
    // @return - the XPath or falsy value if no corresponding XPath found
    hashtagToXPath: function (hashtagExpr) {
        throw new Error("This should be overridden");
    },
    // @param xpath_ - XPath object (can be any of the objects defined in xpm
    // @returns - text representation of XPath in hashtag format (default
    //            implementation is to just return the XPath)
    toHashtag: function (xpath_) {
        return xpath_.toXPath();
    },
};

var makeXPathModels = function(hashtagConfig) {
    var xpm = {};
    xpm.DEBUG_MODE = false;
    hashtagConfig = hashtagConfig || defaultHashtagConfig;

    xpm.debuglog = function () {
        if (xpm.DEBUG_MODE) {
            var string = "";
            Array.prototype.slice.call(arguments).forEach(function (value) {
                string += value + ", ";
            });
            console.log(string);
        }
    };

    xpm.validateAxisName = function(name) {
        for (var i in xpm.XPathAxisEnum) {
            if (xpm.XPathAxisEnum.hasOwnProperty(i) && xpm.XPathAxisEnum[i] === name) {
                return xpm.XPathAxisEnum[i];
            }
        }
        throw name + " is not a valid axis name!";
    };

    // helper function
    var objToXPath = function(something) {
        return something.toXPath();
    };

    var objToHashtag = function (xpath_) {
        if (xpath_ instanceof xpm.HashtagExpr) {
            return xpath_.toHashtag();
        }
        return hashtagConfig.toHashtag(xpath_) || xpath_.toHashtag();
    };

    var objToHashtagWithCombine = function(self, combineFunc) {
        return function () {
            return hashtagConfig.toHashtag(self) || combineFunc(objToHashtag).bind(self)();
        };
    };

    xpm.XPathNumericLiteral = function(value) {
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
            // helper function
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
            return toFixed(this.value.toString());
        };
        this.toHashtag = this.toXPath;
        this.getChildren = function () {
           return [];
        };
        return this;
    };

    xpm.XPathStringLiteral = function(value) {
        var stringDelim = value[0];
        this.value = value = value.substr(1, value.length-2);
        this.stringDelim = stringDelim;

        var toXPathString = function(value) {
            return stringDelim + value + stringDelim;
        };

        this.valueDisplay = toXPathString(value);
        this.toString = function() {
            return "{str:" + this.valueDisplay + "}";
        };
        this.toXPath = function() {
            return this.valueDisplay;
        };
        this.toHashtag = this.toXPath;
        this.getChildren = function () {
           return [];
        };
        return this;
    };

    xpm.XPathVariableReference = function(value) {
        this.value = value;
        this.toString = function() {
            return "{var:" + String(this.value) + "}";
        };
        this.toXPath = function() {
            return "$" + String(this.value);
        };
        this.toHashtag = this.toXPath;
        this.getChildren = function () {
           return [];
        };
    };

    xpm.XPathAxisEnum = {
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

    xpm.XPathTestEnum = {
        NAME: "name",
        NAME_WILDCARD: "*",
        NAMESPACE_WILDCARD: ":*",
        TYPE_NODE: "node()",
        TYPE_TEXT: "text()",
        TYPE_COMMENT: "comment()",
        TYPE_PROCESSING_INSTRUCTION: "processing-instruction"

    };

    xpm.XPathStep = function(definition) {
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
                case xpm.XPathTestEnum.NAME:
                    return String(this.name);
                case xpm.XPathTestEnum.TYPE_PROCESSING_INSTRUCTION:
                    return "processing-instruction(" + (this.literal || "") + ")";
                case xpm.XPathTestEnum.NAMESPACE_WILDCARD:
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
                case xpm.XPathAxisEnum.DESCENDANT_OR_SELF:
                    if (this.test === xpm.XPathTestEnum.TYPE_NODE) {
                        return "//";
                    }
                    break;
                case xpm.XPathAxisEnum.CHILD:
                    axisPrefix = ""; // this is the default
                    break;
                case xpm.XPathAxisEnum.ATTRIBUTE:
                    axisPrefix = "@";
                    break;
                case xpm.XPathAxisEnum.SELF:
                    if (this.test === xpm.XPathTestEnum.TYPE_NODE) {
                        return ".";
                    }
                    break;
                case xpm.XPathAxisEnum.PARENT:
                    if (this.test === xpm.XPathTestEnum.TYPE_NODE) {
                        return "..";
                    }
                    break;
                default:
                   break;
            }
            return axisPrefix + this.testString();
        };
        this.predicateXPath = function (func) {
            if (this.predicates.length > 0) {
                return "[" + this.predicates.map(func).join("][") + "]";
            }
            return "";
        };
        function _combine (transFunc) {
            return function() {
                return this.mainXPath() + this.predicateXPath(transFunc);
            };
        }
        this.toXPath = _combine(objToXPath);
        this.toHashtag = objToHashtagWithCombine(this, _combine);
        this.getChildren = function () {
           return [];
        };

        return this;
    };

    xpm.XPathInitialContextEnum = {
        HASHTAG: "hashtag",
        ROOT: "abs",
        RELATIVE: "rel",
        EXPR: "expr"
    };

    xpm.XPathPathExpr = function(definition) {
        /**
         * an XPath path, which consists mainly of steps
         */
        var self = this;
        this.initial_context = definition.initial_context;
        this.steps = definition.steps || [];
        this.filter = definition.filter;
        this.toString = function() {
            var stringArray = [];
            stringArray.push("{path-expr:");
            stringArray.push(this.initial_context === xpm.XPathInitialContextEnum.EXPR ?
                             String(this.filter) : this.initial_context);
            stringArray.push(",{");
            stringArray.push(this.steps.join(","));
            stringArray.push("}}");
            return stringArray.join("");
        };
        var _combine = function (func) {
            return function () {
                // this helper function only exists so that
                // the two methods below it can call itx
                var parts = self.steps.map(func), ret = [], curPart, prevPart, sep;
                var root = (self.initial_context === xpm.XPathInitialContextEnum.ROOT) ? "/" : "";
                if (self.filter) {
                    parts.splice(0, 0, func(self.filter));
                }
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
        };
        this.toXPath = _combine(objToXPath);
        this.toHashtag = objToHashtagWithCombine(this, _combine);
        // custom function to pull out any filters and just return the root path
        this.pathWithoutPredicates = _combine(function (step) { return step.mainXPath(); });

        this.getChildren = function () {
           return this.steps;
        };

        return this;
    };

    xpm.XPathFuncExpr = function (definition) {
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
        function _combine (transFunc) {
            return function () {
                return this.id + "(" + this.args.map(transFunc).join(", ") + ")";
            };
        }
        this.toXPath = _combine(objToXPath);
        this.toHashtag = objToHashtagWithCombine(this, _combine);
        this.getChildren = function () {
           return this.args;
        };
        return this;
    };

    xpm.XPathFilterExpr = function (definition) {
        /**
         * Representation of an xpath filter expression.
         */
        this.expr = definition.expr;
        this.predicates = definition.predicates || [];
        this.toString = function() {
            var stringArray = [];
            stringArray.push("{filt-expr:", this.expr.toString(), ",{");
            stringArray.push(this.predicates.join(","));
            stringArray.push("}}");
            return stringArray.join("");
        };
        function _combine(transFunc) {
            return function() {
                var predicates = "";
                if (this.predicates.length > 0) {
                    predicates = "[" + this.predicates.map(transFunc).join("][") + "]";
                }
                var expr = objToXPath(this.expr);
                // FIXME should all non-function expressions be parenthesized?
                if (!(this.expr instanceof xpm.XPathFuncExpr)) {
                    expr = "(" + expr + ")";
                }
                return expr + predicates;
            };
        }
        this.toXPath = _combine(objToXPath);
        this.toHashtag = objToHashtagWithCombine(this, _combine);
        this.getChildren = function () {
           return this.predicates;
        };
        return this;
    };

    xpm.HashtagExpr = function (definition) {
        /**
         * an extension of xpath that's not really an xpath
         */
        var self = this;
        this.initial_context = definition.initial_context;
        if (!hashtagConfig.isValidNamespace(definition.namespace)) {
            throw new Error(definition.namespace + " is not a valid # expression");
        }
        this.namespace = definition.namespace;
        this.steps = definition.steps || [];
        this.toString = function() {
            var stringArray = [];
            stringArray.push("{hashtag-expr:");
            stringArray.push(this.namespace);
            stringArray.push(",{");
            stringArray.push(this.steps.join(","));
            stringArray.push("}}");
            return stringArray.join("");
        };
        var _combine = function () {
            var parts = [self.namespace].concat(self.steps),
                ret = [];
            for (var i = 0; i < parts.length; i ++) {
                // hashtag to start then /
                ret.push((i === 0) ? '#' : "/");
                ret.push(parts[i]);
            }
            return ret.join("");
        };
        this.toXPath = function () {
            return hashtagConfig.hashtagToXPath(this.toHashtag());
        };
        this.toHashtag = _combine;
        this.getChildren = function () {
           return [];
        };

        return this;
    };

    // expressions
    xpm.XPathExpressionTypeEnum = {
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

    var expressionTypeEnumToXPathLiteral = xpm.expressionTypeEnumToXPathLiteral = function (val) {
        switch (val) {
            case xpm.XPathExpressionTypeEnum.EQ:
                return "=";
            case xpm.XPathExpressionTypeEnum.MOD:
                return "mod";
            case xpm.XPathExpressionTypeEnum.DIV:
                return "div";
            case xpm.XPathExpressionTypeEnum.UMINUS:
                return "-";
            case xpm.XPathExpressionTypeEnum.UNION:
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
            case xpm.XPathExpressionTypeEnum.OR:
            case xpm.XPathExpressionTypeEnum.AND:
                return "right";
            case xpm.XPathExpressionTypeEnum.EQ:
            case xpm.XPathExpressionTypeEnum.NEQ:
            case xpm.XPathExpressionTypeEnum.LT:
            case xpm.XPathExpressionTypeEnum.LTE:
            case xpm.XPathExpressionTypeEnum.GT:
            case xpm.XPathExpressionTypeEnum.GTE:
            case xpm.XPathExpressionTypeEnum.PLUS:
            case xpm.XPathExpressionTypeEnum.MINUS:
            case xpm.XPathExpressionTypeEnum.MULT:
            case xpm.XPathExpressionTypeEnum.DIV:
            case xpm.XPathExpressionTypeEnum.MOD:
            case xpm.XPathExpressionTypeEnum.UNION:
                return "left";
            case xpm.XPathExpressionTypeEnum.UMINUS:
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
            case xpm.XPathExpressionTypeEnum.OR:
                return 0;
            case xpm.XPathExpressionTypeEnum.AND:
                return 1;
            case xpm.XPathExpressionTypeEnum.EQ:
            case xpm.XPathExpressionTypeEnum.NEQ:
                return 2;
            case xpm.XPathExpressionTypeEnum.LT:
            case xpm.XPathExpressionTypeEnum.LTE:
            case xpm.XPathExpressionTypeEnum.GT:
            case xpm.XPathExpressionTypeEnum.GTE:
                return 3;
            case xpm.XPathExpressionTypeEnum.PLUS:
            case xpm.XPathExpressionTypeEnum.MINUS:
                return 4;
            case xpm.XPathExpressionTypeEnum.MULT:
            case xpm.XPathExpressionTypeEnum.DIV:
            case xpm.XPathExpressionTypeEnum.MOD:
                return 5;
            case xpm.XPathExpressionTypeEnum.UMINUS:
                return 6;
            case xpm.XPathExpressionTypeEnum.UNION:
                return 7;
            default:
                throw("No precedence for " + type);
        }
    };

    var isOp = xpm.isOp = function(someToken) {
        /*
         * Whether something is an operation
         */
        // this is probably breaking an abstraction layer.
        var str = someToken.toString();
        return str.indexOf("{binop-expr:") === 0 || str.indexOf("{unop-expr:") === 0;
    };

    var isLiteral = xpm.isLiteral = function(someToken) {
        return (someToken instanceof xpm.XPathNumericLiteral ||
                someToken instanceof xpm.XPathStringLiteral ||
                someToken instanceof xpm.XPathPathExpr);
    };

    var isSimpleOp = xpm.isSimpleOp = function(someToken) {
        return isOp(someToken) && isLiteral(someToken.left) && isLiteral(someToken.right);
    };

    function printBinOp (func) {
        return function () {
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
            lString = lneedsParens ? "(" + func(this.left) + ")" : func(this.left);
            rString = rneedsParens ? "(" + func(this.right) + ")" : func(this.right);
            return lString + " " + expressionTypeEnumToXPathLiteral(this.type) + " " + rString;
        };
    }

    var binOpToXPath = printBinOp(objToXPath);
    var binOpToHashtag = printBinOp(objToHashtag);

    var binOpChildren = function () {
        return [this.left, this.right];
    };

    xpm.XPathBoolExpr = function(definition) {
        this.type = definition.type;
        this.left = definition.left;
        this.right = definition.right;
        this.toString = binOpToString;
        this.toXPath = binOpToXPath;
        this.toHashtag = binOpToHashtag.bind(this);
        this.getChildren = binOpChildren;
        return this;

    };

    xpm.XPathEqExpr = function(definition) {
        this.type = definition.type;
        this.left = definition.left;
        this.right = definition.right;
        this.toString = binOpToString;
        this.toXPath = binOpToXPath;
        this.toHashtag = binOpToHashtag.bind(this);
        this.getChildren = binOpChildren;
        return this;
    };

    xpm.XPathCmpExpr = function(definition) {
        this.type = definition.type;
        this.left = definition.left;
        this.right = definition.right;
        this.toString = binOpToString;
        this.toXPath = binOpToXPath;
        this.toHashtag = binOpToHashtag.bind(this);
        this.getChildren = binOpChildren;
        return this;
    };

    xpm.XPathArithExpr = function(definition) {
        this.type = definition.type;
        this.left = definition.left;
        this.right = definition.right;
        this.toString = binOpToString;
        this.toXPath = binOpToXPath;
        this.toHashtag = binOpToHashtag.bind(this);
        this.getChildren = binOpChildren;
        return this;
    };

    xpm.XPathUnionExpr = function(definition) {
        this.type = definition.type;
        this.left = definition.left;
        this.right = definition.right;
        this.toString = binOpToString;
        this.toXPath = binOpToXPath;
        this.toHashtag = binOpToHashtag.bind(this);
        this.getChildren = binOpChildren;
        return this;
    };

    xpm.XPathNumNegExpr = function(definition) {
        this.type = definition.type;
        this.value = definition.value;
        this.toString = function() {
            return "{unop-expr:" + this.type + "," + String(this.value) + "}";
        };
        function _combine(transFunc) {
            return function() {
                return "-" + transFunc(this.value);
            };
        }
        this.toXPath = _combine(objToXPath);
        this.toHashtag = _combine(objToHashtag);
        this.getChildren = function () {
           return [this.value];
        };
        return this;
    };

    return xpm;
};

if (typeof require !== 'undefined' && typeof exports !== 'undefined') {
    exports.makeXPathModels = makeXPathModels;
}

},{}],2:[function(require,module,exports){
(function (process){
/* parser generated by jison 0.4.16 */
/*
  Returns a Parser object of the following structure:

  Parser: {
    yy: {}
  }

  Parser.prototype: {
    yy: {},
    trace: function(),
    symbols_: {associative list: name ==> number},
    terminals_: {associative list: number ==> name},
    productions_: [...],
    performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate, $$, _$),
    table: [...],
    defaultActions: {...},
    parseError: function(str, hash),
    parse: function(input),

    lexer: {
        EOF: 1,
        parseError: function(str, hash),
        setInput: function(input),
        input: function(),
        unput: function(str),
        more: function(),
        less: function(n),
        pastInput: function(),
        upcomingInput: function(),
        showPosition: function(),
        test_match: function(regex_match_array, rule_index),
        next: function(),
        lex: function(),
        begin: function(condition),
        popState: function(),
        _currentRules: function(),
        topState: function(),
        pushState: function(condition),

        options: {
            ranges: boolean           (optional: true ==> token location info will include a .range[] member)
            flex: boolean             (optional: true ==> flex-like lexing behaviour where the rules are tested exhaustively to find the longest match)
            backtrack_lexer: boolean  (optional: true ==> lexer regexes are tested in order and for each matching regex the action code is invoked; the lexer terminates the scan when a token is returned by the action code)
        },

        performAction: function(yy, yy_, $avoiding_name_collisions, YY_START),
        rules: [...],
        conditions: {associative list: name ==> set},
    }
  }


  token location info (@$, _$, etc.): {
    first_line: n,
    last_line: n,
    first_column: n,
    last_column: n,
    range: [start_number, end_number]       (where the numbers are indexes into the input string, regular zero-based)
  }


  the parseError function receives a 'hash' object with these members for lexer and parser errors: {
    text:        (matched text)
    token:       (the produced terminal token, if any)
    line:        (yylineno)
  }
  while parser (grammar) errors will also provide these members, i.e. parser errors deliver a superset of attributes: {
    loc:         (yylloc)
    expected:    (string describing the set of expected tokens)
    recoverable: (boolean: TRUE when the parser has a error recovery rule available for this particular error)
  }
*/
var parser = (function(){
var o=function(k,v,o,l){for(o=o||{},l=k.length;l--;o[k[l]]=v);return o},$V0=[1,8],$V1=[1,10],$V2=[1,12],$V3=[1,15],$V4=[1,19],$V5=[1,20],$V6=[1,14],$V7=[1,23],$V8=[1,24],$V9=[1,34],$Va=[1,28],$Vb=[1,29],$Vc=[1,30],$Vd=[1,31],$Ve=[1,32],$Vf=[1,33],$Vg=[1,16],$Vh=[1,17],$Vi=[1,36],$Vj=[1,37],$Vk=[1,38],$Vl=[1,39],$Vm=[1,40],$Vn=[1,41],$Vo=[1,42],$Vp=[1,43],$Vq=[1,44],$Vr=[1,45],$Vs=[1,46],$Vt=[1,47],$Vu=[1,48],$Vv=[1,49],$Vw=[5,12,16,17,18,19,20,21,22,23,24,25,26,27,28,29,32,41],$Vx=[1,53],$Vy=[5,12,16,17,18,19,20,21,22,23,24,25,26,27,28,29,32,34,36,40,41],$Vz=[2,58],$VA=[1,61],$VB=[1,62],$VC=[1,63],$VD=[1,65],$VE=[5,12,16,17,18,19,20,21,22,23,24,25,26,27,28,29,32,34,36,41],$VF=[30,51,52,53,54,55,56],$VG=[5,12,16,17,18,19,20,21,22,23,24,25,26,27,28,32,41],$VH=[5,12,16,17,18,19,32,41],$VI=[5,12,16,17,18,19,20,21,22,23,32,41],$VJ=[5,12,16,17,18,19,20,21,22,23,24,25,32,41],$VK=[12,32],$VL=[5,12,16,17,18,19,20,21,22,23,24,25,26,27,28,29,32,34,41];
var parser = {trace: function trace() { },
yy: {},
symbols_: {"error":2,"xpath_expr":3,"expr":4,"EOF":5,"base_expr":6,"op_expr":7,"path_expr":8,"filter_expr":9,"hashtag_expr":10,"LPAREN":11,"RPAREN":12,"func_call":13,"VAR":14,"literal":15,"OR":16,"AND":17,"EQ":18,"NEQ":19,"LT":20,"LTE":21,"GT":22,"GTE":23,"PLUS":24,"MINUS":25,"MULT":26,"DIV":27,"MOD":28,"UNION":29,"QNAME":30,"arg_list":31,"COMMA":32,"loc_path":33,"SLASH":34,"rel_loc_path":35,"DBL_SLASH":36,"predicate":37,"HASH":38,"hashtag_path":39,"LBRACK":40,"RBRACK":41,"step":42,"step_unabbr":43,"DOT":44,"DBL_DOT":45,"step_body":46,"node_test":47,"axis_specifier":48,"DBL_COLON":49,"AT":50,"WILDCARD":51,"NSWILDCARD":52,"NODETYPE_NODE":53,"NODETYPE_TEXT":54,"NODETYPE_COMMENT":55,"NODETYPE_PROCINSTR":56,"STR":57,"NUM":58,"$accept":0,"$end":1},
terminals_: {2:"error",5:"EOF",11:"LPAREN",12:"RPAREN",14:"VAR",16:"OR",17:"AND",18:"EQ",19:"NEQ",20:"LT",21:"LTE",22:"GT",23:"GTE",24:"PLUS",25:"MINUS",26:"MULT",27:"DIV",28:"MOD",29:"UNION",30:"QNAME",32:"COMMA",34:"SLASH",36:"DBL_SLASH",38:"HASH",40:"LBRACK",41:"RBRACK",44:"DOT",45:"DBL_DOT",49:"DBL_COLON",50:"AT",51:"WILDCARD",52:"NSWILDCARD",53:"NODETYPE_NODE",54:"NODETYPE_TEXT",55:"NODETYPE_COMMENT",56:"NODETYPE_PROCINSTR",57:"STR",58:"NUM"},
productions_: [0,[3,2],[4,1],[4,1],[4,1],[4,1],[4,1],[6,3],[6,1],[6,1],[6,1],[7,3],[7,3],[7,3],[7,3],[7,3],[7,3],[7,3],[7,3],[7,3],[7,3],[7,3],[7,3],[7,3],[7,2],[7,3],[13,4],[13,3],[31,3],[31,1],[8,1],[8,3],[8,3],[8,3],[8,3],[9,2],[9,2],[10,4],[10,2],[39,1],[39,3],[37,3],[33,1],[33,2],[33,2],[33,1],[35,1],[35,3],[35,3],[42,1],[42,1],[42,1],[43,2],[43,1],[46,1],[46,2],[48,2],[48,1],[47,1],[47,1],[47,1],[47,3],[47,3],[47,3],[47,3],[47,4],[15,1],[15,1]],
performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate /* action[1] */, $$ /* vstack */, _$ /* lstack */) {
/* this == yyval */

var $0 = $$.length - 1;
switch (yystate) {
case 1:
 return $$[$0-1]; 
break;
case 2: case 3: case 4: case 5: case 6:
  this.$ = $$[$0]; 
break;
case 7: case 41:
 this.$ = $$[$0-1]; 
break;
case 9:
 this.$ = new yy.xpathmodels.XPathVariableReference($$[$0]); 
break;
case 11:
 this.$ = new yy.xpathmodels.XPathBoolExpr({"type": "or", "left": $$[$0-2], "right": $$[$0]}); 
break;
case 12:
 this.$ = new yy.xpathmodels.XPathBoolExpr({"type": "and", "left": $$[$0-2], "right": $$[$0]}); 
break;
case 13:
 this.$ = new yy.xpathmodels.XPathEqExpr({"type": "==", "left": $$[$0-2], "right": $$[$0]}); 
break;
case 14:
 this.$ = new yy.xpathmodels.XPathEqExpr({"type": "!=", "left": $$[$0-2], "right": $$[$0]}); 
break;
case 15:
 this.$ = new yy.xpathmodels.XPathCmpExpr({"type": "<", "left":$$[$0-2], "right": $$[$0]}); 
break;
case 16:
 this.$ = new yy.xpathmodels.XPathCmpExpr({"type": "<=", "left":$$[$0-2], "right": $$[$0]}); 
break;
case 17:
 this.$ = new yy.xpathmodels.XPathCmpExpr({"type": ">", "left":$$[$0-2], "right": $$[$0]}); 
break;
case 18:
 this.$ = new yy.xpathmodels.XPathCmpExpr({"type": ">=", "left":$$[$0-2], "right": $$[$0]}); 
break;
case 19:
 this.$ = new yy.xpathmodels.XPathArithExpr({"type": "+", "left":$$[$0-2], "right": $$[$0]}); 
break;
case 20:
 this.$ = new yy.xpathmodels.XPathArithExpr({"type": "-", "left":$$[$0-2], "right": $$[$0]}); 
break;
case 21:
 this.$ = new yy.xpathmodels.XPathArithExpr({"type": "*", "left":$$[$0-2], "right": $$[$0]}); 
break;
case 22:
 this.$ = new yy.xpathmodels.XPathArithExpr({"type": "/", "left":$$[$0-2], "right": $$[$0]}); 
break;
case 23:
 this.$ = new yy.xpathmodels.XPathArithExpr({"type": "%", "left":$$[$0-2], "right": $$[$0]}); 
break;
case 24:
 this.$ = new yy.xpathmodels.XPathNumNegExpr({"type": "num-neg", "value":$$[$0]}); 
break;
case 25:
 this.$ = new yy.xpathmodels.XPathUnionExpr({"type": "union", "left":$$[$0-2], "right": $$[$0]}); 
break;
case 26:
 this.$ = new yy.xpathmodels.XPathFuncExpr({id: $$[$0-3], args: $$[$0-1]}); 
break;
case 27:
 this.$ = new yy.xpathmodels.XPathFuncExpr({id: $$[$0-2], args: []}); 
break;
case 28:
 var args = $$[$0-2];
                                      args.push($$[$0]);
                                      this.$ = args; 
break;
case 29:
 this.$ = [$$[$0]]; 
break;
case 31:
 this.$ = new yy.xpathmodels.XPathPathExpr({
                                                                    initial_context: yy.xpathmodels.XPathInitialContextEnum.EXPR,
                                                                    filter: $$[$0-2], steps: $$[$0]}); 
break;
case 32:
 var steps = $$[$0];
                                                      steps.splice(0, 0, new yy.xpathmodels.XPathStep({
                                                                                axis: yy.xpathmodels.XPathAxisEnum.DESCENDANT_OR_SELF, 
                                                                                test: yy.xpathmodels.XPathTestEnum.TYPE_NODE}));
                                                      this.$ = new yy.xpathmodels.XPathPathExpr({
                                                                    initial_context: yy.xpathmodels.XPathInitialContextEnum.EXPR,
                                                                    filter: $$[$0-2], steps: steps}); 
break;
case 33:
 // could eliminate filterExpr wrapper, but this makes tests pass as-is
                                                      var filterExpr = new yy.xpathmodels.XPathFilterExpr({expr: $$[$0-2]});
                                                      this.$ = new yy.xpathmodels.XPathPathExpr({
                                                                    initial_context: yy.xpathmodels.XPathInitialContextEnum.EXPR,
                                                                    filter: filterExpr, steps: $$[$0]}); 
break;
case 34:
 var steps = $$[$0];
                                                      // could eliminate filterExpr wrapper, but this makes tests pass as-is
                                                      var filterExpr = new yy.xpathmodels.XPathFilterExpr({expr: $$[$0-2]});
                                                      steps.splice(0, 0, new yy.xpathmodels.XPathStep({
                                                                                axis: yy.xpathmodels.XPathAxisEnum.DESCENDANT_OR_SELF, 
                                                                                test: yy.xpathmodels.XPathTestEnum.TYPE_NODE}));
                                                      this.$ = new yy.xpathmodels.XPathPathExpr({
                                                                    initial_context: yy.xpathmodels.XPathInitialContextEnum.EXPR,
                                                                    filter: filterExpr, steps: steps}); 
break;
case 35:
 this.$ = new yy.xpathmodels.XPathFilterExpr({expr: $$[$0-1], predicates: [$$[$0]]}); 
break;
case 36:
 var filterExpr = $$[$0-1];
                                        filterExpr.predicates.push($$[$0]);
                                        this.$ = filterExpr; 
break;
case 37:
 this.$ = new yy.xpathmodels.HashtagExpr({initial_context: yy.xpathmodels.XPathInitialContextEnum.HASHTAG,
                                                                      namespace: $$[$0-2],
                                                                      steps: $$[$0]}); 
break;
case 38:
 this.$ = new yy.xpathmodels.HashtagExpr({initial_context: yy.xpathmodels.XPathInitialContextEnum.HASHTAG,
                                                                      namespace: $$[$0],
                                                                      steps: []}); 
break;
case 39:
this.$ = [$$[$0]];
break;
case 40:
var path = $$[$0-2]; path.push($$[$0]); this.$ = path;
break;
case 42:
 this.$ = new yy.xpathmodels.XPathPathExpr({initial_context: yy.xpathmodels.XPathInitialContextEnum.RELATIVE,
                                                                      steps: $$[$0]}); 
break;
case 43:
 this.$ = new yy.xpathmodels.XPathPathExpr({initial_context: yy.xpathmodels.XPathInitialContextEnum.ROOT,
                                                                      steps: $$[$0]}); 
break;
case 44:
 var steps = $$[$0];
                                              // insert descendant step into beginning
                                              steps.splice(0, 0, new yy.xpathmodels.XPathStep({axis: yy.xpathmodels.XPathAxisEnum.DESCENDANT_OR_SELF, 
                                                                                test: yy.xpathmodels.XPathTestEnum.TYPE_NODE}));
                                              this.$ = new yy.xpathmodels.XPathPathExpr({initial_context: yy.xpathmodels.XPathInitialContextEnum.ROOT,
                                                                      steps: steps}); 
break;
case 45:
 this.$ = new yy.xpathmodels.XPathPathExpr({initial_context: yy.xpathmodels.XPathInitialContextEnum.ROOT,
                                                              steps: []});
break;
case 46:
 this.$ = [$$[$0]];
break;
case 47:
 var path = $$[$0-2];
                                            path.push($$[$0]);
                                            this.$ = path; 
break;
case 48:
 var path = $$[$0-2];
                                            path.push(new yy.xpathmodels.XPathStep({axis: yy.xpathmodels.XPathAxisEnum.DESCENDANT_OR_SELF, 
                                                                     test: yy.xpathmodels.XPathTestEnum.TYPE_NODE}));
                                            path.push($$[$0]);
                                            this.$ = path; 
break;
case 49: case 53:
 this.$ = $$[$0]; 
break;
case 50:
 this.$ = new yy.xpathmodels.XPathStep({axis: yy.xpathmodels.XPathAxisEnum.SELF, 
                                                          test: yy.xpathmodels.XPathTestEnum.TYPE_NODE}); 
break;
case 51:
 this.$ = new yy.xpathmodels.XPathStep({axis: yy.xpathmodels.XPathAxisEnum.PARENT, 
                                                          test: yy.xpathmodels.XPathTestEnum.TYPE_NODE}); 
break;
case 52:
 var step = $$[$0-1];
                                            step.predicates.push($$[$0]);
                                            this.$ = step; 
break;
case 54:
 var nodeTest = $$[$0]; // temporary dict with appropriate args
                                          nodeTest.axis = yy.xpathmodels.XPathAxisEnum.CHILD;
                                          this.$ = new yy.xpathmodels.XPathStep(nodeTest); 
break;
case 55:
 var nodeTest = $$[$0];  // temporary dict with appropriate args
                                          nodeTest.axis = $$[$0-1]; // add axis
                                          this.$ = new yy.xpathmodels.XPathStep(nodeTest); 
break;
case 56:
 this.$ = yy.xpathmodels.validateAxisName($$[$0-1]); 
break;
case 57:
 this.$ = yy.xpathmodels.XPathAxisEnum.ATTRIBUTE; 
break;
case 58:
 this.$ = {"test": yy.xpathmodels.XPathTestEnum.NAME, "name": $$[$0]}; 
break;
case 59:
 this.$ = {"test": yy.xpathmodels.XPathTestEnum.NAME_WILDCARD}; 
break;
case 60:
 this.$ = {"test": yy.xpathmodels.XPathTestEnum.NAMESPACE_WILDCARD, "namespace": $$[$0]}; 
break;
case 61:
 this.$ = {"test": yy.xpathmodels.XPathTestEnum.TYPE_NODE}; 
break;
case 62:
 this.$ = {"test": yy.xpathmodels.XPathTestEnum.TYPE_TEXT}; 
break;
case 63:
 this.$ = {"test": yy.xpathmodels.XPathTestEnum.TYPE_COMMENT}; 
break;
case 64:
 this.$ = {"test": yy.xpathmodels.XPathTestEnum.TYPE_PROCESSING_INSTRUCTION, "literal": null}; 
break;
case 65:
 this.$ = {"test": yy.xpathmodels.XPathTestEnum.TYPE_PROCESSING_INSTRUCTION, "literal": $$[$0-1]}; 
break;
case 66:
 this.$ = new yy.xpathmodels.XPathStringLiteral($$[$0]); 
break;
case 67:
 this.$ = new yy.xpathmodels.XPathNumericLiteral($$[$0]); 
break;
}
},
table: [{3:1,4:2,6:3,7:4,8:5,9:6,10:7,11:$V0,13:9,14:$V1,15:11,25:$V2,30:$V3,33:13,34:$V4,35:18,36:$V5,38:$V6,42:21,43:22,44:$V7,45:$V8,46:25,47:26,48:27,50:$V9,51:$Va,52:$Vb,53:$Vc,54:$Vd,55:$Ve,56:$Vf,57:$Vg,58:$Vh},{1:[3]},{5:[1,35],16:$Vi,17:$Vj,18:$Vk,19:$Vl,20:$Vm,21:$Vn,22:$Vo,23:$Vp,24:$Vq,25:$Vr,26:$Vs,27:$Vt,28:$Vu,29:$Vv},o($Vw,[2,2],{37:52,34:[1,50],36:[1,51],40:$Vx}),o($Vw,[2,3]),o($Vw,[2,4]),o($Vw,[2,5],{37:56,34:[1,54],36:[1,55],40:$Vx}),o($Vw,[2,6]),{4:57,6:3,7:4,8:5,9:6,10:7,11:$V0,13:9,14:$V1,15:11,25:$V2,30:$V3,33:13,34:$V4,35:18,36:$V5,38:$V6,42:21,43:22,44:$V7,45:$V8,46:25,47:26,48:27,50:$V9,51:$Va,52:$Vb,53:$Vc,54:$Vd,55:$Ve,56:$Vf,57:$Vg,58:$Vh},o($Vy,[2,8]),o($Vy,[2,9]),o($Vy,[2,10]),{4:58,6:3,7:4,8:5,9:6,10:7,11:$V0,13:9,14:$V1,15:11,25:$V2,30:$V3,33:13,34:$V4,35:18,36:$V5,38:$V6,42:21,43:22,44:$V7,45:$V8,46:25,47:26,48:27,50:$V9,51:$Va,52:$Vb,53:$Vc,54:$Vd,55:$Ve,56:$Vf,57:$Vg,58:$Vh},o($Vw,[2,30]),{30:[1,59]},o($Vy,$Vz,{11:[1,60],49:$VA}),o($Vy,[2,66]),o($Vy,[2,67]),o($Vw,[2,42],{34:$VB,36:$VC}),o($Vw,[2,45],{42:21,43:22,46:25,47:26,48:27,35:64,30:$VD,44:$V7,45:$V8,50:$V9,51:$Va,52:$Vb,53:$Vc,54:$Vd,55:$Ve,56:$Vf}),{30:$VD,35:66,42:21,43:22,44:$V7,45:$V8,46:25,47:26,48:27,50:$V9,51:$Va,52:$Vb,53:$Vc,54:$Vd,55:$Ve,56:$Vf},o($VE,[2,46]),o($VE,[2,49],{37:67,40:$Vx}),o($VE,[2,50]),o($VE,[2,51]),o($Vy,[2,53]),o($Vy,[2,54]),{30:[1,69],47:68,51:$Va,52:$Vb,53:$Vc,54:$Vd,55:$Ve,56:$Vf},o($Vy,[2,59]),o($Vy,[2,60]),{11:[1,70]},{11:[1,71]},{11:[1,72]},{11:[1,73]},o($VF,[2,57]),{1:[2,1]},{4:74,6:3,7:4,8:5,9:6,10:7,11:$V0,13:9,14:$V1,15:11,25:$V2,30:$V3,33:13,34:$V4,35:18,36:$V5,38:$V6,42:21,43:22,44:$V7,45:$V8,46:25,47:26,48:27,50:$V9,51:$Va,52:$Vb,53:$Vc,54:$Vd,55:$Ve,56:$Vf,57:$Vg,58:$Vh},{4:75,6:3,7:4,8:5,9:6,10:7,11:$V0,13:9,14:$V1,15:11,25:$V2,30:$V3,33:13,34:$V4,35:18,36:$V5,38:$V6,42:21,43:22,44:$V7,45:$V8,46:25,47:26,48:27,50:$V9,51:$Va,52:$Vb,53:$Vc,54:$Vd,55:$Ve,56:$Vf,57:$Vg,58:$Vh},{4:76,6:3,7:4,8:5,9:6,10:7,11:$V0,13:9,14:$V1,15:11,25:$V2,30:$V3,33:13,34:$V4,35:18,36:$V5,38:$V6,42:21,43:22,44:$V7,45:$V8,46:25,47:26,48:27,50:$V9,51:$Va,52:$Vb,53:$Vc,54:$Vd,55:$Ve,56:$Vf,57:$Vg,58:$Vh},{4:77,6:3,7:4,8:5,9:6,10:7,11:$V0,13:9,14:$V1,15:11,25:$V2,30:$V3,33:13,34:$V4,35:18,36:$V5,38:$V6,42:21,43:22,44:$V7,45:$V8,46:25,47:26,48:27,50:$V9,51:$Va,52:$Vb,53:$Vc,54:$Vd,55:$Ve,56:$Vf,57:$Vg,58:$Vh},{4:78,6:3,7:4,8:5,9:6,10:7,11:$V0,13:9,14:$V1,15:11,25:$V2,30:$V3,33:13,34:$V4,35:18,36:$V5,38:$V6,42:21,43:22,44:$V7,45:$V8,46:25,47:26,48:27,50:$V9,51:$Va,52:$Vb,53:$Vc,54:$Vd,55:$Ve,56:$Vf,57:$Vg,58:$Vh},{4:79,6:3,7:4,8:5,9:6,10:7,11:$V0,13:9,14:$V1,15:11,25:$V2,30:$V3,33:13,34:$V4,35:18,36:$V5,38:$V6,42:21,43:22,44:$V7,45:$V8,46:25,47:26,48:27,50:$V9,51:$Va,52:$Vb,53:$Vc,54:$Vd,55:$Ve,56:$Vf,57:$Vg,58:$Vh},{4:80,6:3,7:4,8:5,9:6,10:7,11:$V0,13:9,14:$V1,15:11,25:$V2,30:$V3,33:13,34:$V4,35:18,36:$V5,38:$V6,42:21,43:22,44:$V7,45:$V8,46:25,47:26,48:27,50:$V9,51:$Va,52:$Vb,53:$Vc,54:$Vd,55:$Ve,56:$Vf,57:$Vg,58:$Vh},{4:81,6:3,7:4,8:5,9:6,10:7,11:$V0,13:9,14:$V1,15:11,25:$V2,30:$V3,33:13,34:$V4,35:18,36:$V5,38:$V6,42:21,43:22,44:$V7,45:$V8,46:25,47:26,48:27,50:$V9,51:$Va,52:$Vb,53:$Vc,54:$Vd,55:$Ve,56:$Vf,57:$Vg,58:$Vh},{4:82,6:3,7:4,8:5,9:6,10:7,11:$V0,13:9,14:$V1,15:11,25:$V2,30:$V3,33:13,34:$V4,35:18,36:$V5,38:$V6,42:21,43:22,44:$V7,45:$V8,46:25,47:26,48:27,50:$V9,51:$Va,52:$Vb,53:$Vc,54:$Vd,55:$Ve,56:$Vf,57:$Vg,58:$Vh},{4:83,6:3,7:4,8:5,9:6,10:7,11:$V0,13:9,14:$V1,15:11,25:$V2,30:$V3,33:13,34:$V4,35:18,36:$V5,38:$V6,42:21,43:22,44:$V7,45:$V8,46:25,47:26,48:27,50:$V9,51:$Va,52:$Vb,53:$Vc,54:$Vd,55:$Ve,56:$Vf,57:$Vg,58:$Vh},{4:84,6:3,7:4,8:5,9:6,10:7,11:$V0,13:9,14:$V1,15:11,25:$V2,30:$V3,33:13,34:$V4,35:18,36:$V5,38:$V6,42:21,43:22,44:$V7,45:$V8,46:25,47:26,48:27,50:$V9,51:$Va,52:$Vb,53:$Vc,54:$Vd,55:$Ve,56:$Vf,57:$Vg,58:$Vh},{4:85,6:3,7:4,8:5,9:6,10:7,11:$V0,13:9,14:$V1,15:11,25:$V2,30:$V3,33:13,34:$V4,35:18,36:$V5,38:$V6,42:21,43:22,44:$V7,45:$V8,46:25,47:26,48:27,50:$V9,51:$Va,52:$Vb,53:$Vc,54:$Vd,55:$Ve,56:$Vf,57:$Vg,58:$Vh},{4:86,6:3,7:4,8:5,9:6,10:7,11:$V0,13:9,14:$V1,15:11,25:$V2,30:$V3,33:13,34:$V4,35:18,36:$V5,38:$V6,42:21,43:22,44:$V7,45:$V8,46:25,47:26,48:27,50:$V9,51:$Va,52:$Vb,53:$Vc,54:$Vd,55:$Ve,56:$Vf,57:$Vg,58:$Vh},{4:87,6:3,7:4,8:5,9:6,10:7,11:$V0,13:9,14:$V1,15:11,25:$V2,30:$V3,33:13,34:$V4,35:18,36:$V5,38:$V6,42:21,43:22,44:$V7,45:$V8,46:25,47:26,48:27,50:$V9,51:$Va,52:$Vb,53:$Vc,54:$Vd,55:$Ve,56:$Vf,57:$Vg,58:$Vh},{30:$VD,35:88,42:21,43:22,44:$V7,45:$V8,46:25,47:26,48:27,50:$V9,51:$Va,52:$Vb,53:$Vc,54:$Vd,55:$Ve,56:$Vf},{30:$VD,35:89,42:21,43:22,44:$V7,45:$V8,46:25,47:26,48:27,50:$V9,51:$Va,52:$Vb,53:$Vc,54:$Vd,55:$Ve,56:$Vf},o($Vy,[2,35]),{4:90,6:3,7:4,8:5,9:6,10:7,11:$V0,13:9,14:$V1,15:11,25:$V2,30:$V3,33:13,34:$V4,35:18,36:$V5,38:$V6,42:21,43:22,44:$V7,45:$V8,46:25,47:26,48:27,50:$V9,51:$Va,52:$Vb,53:$Vc,54:$Vd,55:$Ve,56:$Vf,57:$Vg,58:$Vh},{30:$VD,35:91,42:21,43:22,44:$V7,45:$V8,46:25,47:26,48:27,50:$V9,51:$Va,52:$Vb,53:$Vc,54:$Vd,55:$Ve,56:$Vf},{30:$VD,35:92,42:21,43:22,44:$V7,45:$V8,46:25,47:26,48:27,50:$V9,51:$Va,52:$Vb,53:$Vc,54:$Vd,55:$Ve,56:$Vf},o($Vy,[2,36]),{12:[1,93],16:$Vi,17:$Vj,18:$Vk,19:$Vl,20:$Vm,21:$Vn,22:$Vo,23:$Vp,24:$Vq,25:$Vr,26:$Vs,27:$Vt,28:$Vu,29:$Vv},o($VG,[2,24],{29:$Vv}),o($Vw,[2,38],{34:[1,94]}),{4:97,6:3,7:4,8:5,9:6,10:7,11:$V0,12:[1,96],13:9,14:$V1,15:11,25:$V2,30:$V3,31:95,33:13,34:$V4,35:18,36:$V5,38:$V6,42:21,43:22,44:$V7,45:$V8,46:25,47:26,48:27,50:$V9,51:$Va,52:$Vb,53:$Vc,54:$Vd,55:$Ve,56:$Vf,57:$Vg,58:$Vh},o($VF,[2,56]),{30:$VD,42:98,43:22,44:$V7,45:$V8,46:25,47:26,48:27,50:$V9,51:$Va,52:$Vb,53:$Vc,54:$Vd,55:$Ve,56:$Vf},{30:$VD,42:99,43:22,44:$V7,45:$V8,46:25,47:26,48:27,50:$V9,51:$Va,52:$Vb,53:$Vc,54:$Vd,55:$Ve,56:$Vf},o($Vw,[2,43],{34:$VB,36:$VC}),o($Vy,$Vz,{49:$VA}),o($Vw,[2,44],{34:$VB,36:$VC}),o($Vy,[2,52]),o($Vy,[2,55]),o($Vy,$Vz),{12:[1,100]},{12:[1,101]},{12:[1,102]},{12:[1,103],57:[1,104]},o([5,12,32,41],[2,11],{16:$Vi,17:$Vj,18:$Vk,19:$Vl,20:$Vm,21:$Vn,22:$Vo,23:$Vp,24:$Vq,25:$Vr,26:$Vs,27:$Vt,28:$Vu,29:$Vv}),o([5,12,16,32,41],[2,12],{17:$Vj,18:$Vk,19:$Vl,20:$Vm,21:$Vn,22:$Vo,23:$Vp,24:$Vq,25:$Vr,26:$Vs,27:$Vt,28:$Vu,29:$Vv}),o($VH,[2,13],{20:$Vm,21:$Vn,22:$Vo,23:$Vp,24:$Vq,25:$Vr,26:$Vs,27:$Vt,28:$Vu,29:$Vv}),o($VH,[2,14],{20:$Vm,21:$Vn,22:$Vo,23:$Vp,24:$Vq,25:$Vr,26:$Vs,27:$Vt,28:$Vu,29:$Vv}),o($VI,[2,15],{24:$Vq,25:$Vr,26:$Vs,27:$Vt,28:$Vu,29:$Vv}),o($VI,[2,16],{24:$Vq,25:$Vr,26:$Vs,27:$Vt,28:$Vu,29:$Vv}),o($VI,[2,17],{24:$Vq,25:$Vr,26:$Vs,27:$Vt,28:$Vu,29:$Vv}),o($VI,[2,18],{24:$Vq,25:$Vr,26:$Vs,27:$Vt,28:$Vu,29:$Vv}),o($VJ,[2,19],{26:$Vs,27:$Vt,28:$Vu,29:$Vv}),o($VJ,[2,20],{26:$Vs,27:$Vt,28:$Vu,29:$Vv}),o($VG,[2,21],{29:$Vv}),o($VG,[2,22],{29:$Vv}),o($VG,[2,23],{29:$Vv}),o($Vw,[2,25]),o($Vw,[2,33],{34:$VB,36:$VC}),o($Vw,[2,34],{34:$VB,36:$VC}),{16:$Vi,17:$Vj,18:$Vk,19:$Vl,20:$Vm,21:$Vn,22:$Vo,23:$Vp,24:$Vq,25:$Vr,26:$Vs,27:$Vt,28:$Vu,29:$Vv,41:[1,105]},o($Vw,[2,31],{34:$VB,36:$VC}),o($Vw,[2,32],{34:$VB,36:$VC}),o($Vy,[2,7]),{30:[1,107],39:106},{12:[1,108],32:[1,109]},o($Vy,[2,27]),o($VK,[2,29],{16:$Vi,17:$Vj,18:$Vk,19:$Vl,20:$Vm,21:$Vn,22:$Vo,23:$Vp,24:$Vq,25:$Vr,26:$Vs,27:$Vt,28:$Vu,29:$Vv}),o($VE,[2,47]),o($VE,[2,48]),o($Vy,[2,61]),o($Vy,[2,62]),o($Vy,[2,63]),o($Vy,[2,64]),{12:[1,110]},o($Vy,[2,41]),o($Vw,[2,37],{34:[1,111]}),o($VL,[2,39]),o($Vy,[2,26]),{4:112,6:3,7:4,8:5,9:6,10:7,11:$V0,13:9,14:$V1,15:11,25:$V2,30:$V3,33:13,34:$V4,35:18,36:$V5,38:$V6,42:21,43:22,44:$V7,45:$V8,46:25,47:26,48:27,50:$V9,51:$Va,52:$Vb,53:$Vc,54:$Vd,55:$Ve,56:$Vf,57:$Vg,58:$Vh},o($Vy,[2,65]),{30:[1,113]},o($VK,[2,28],{16:$Vi,17:$Vj,18:$Vk,19:$Vl,20:$Vm,21:$Vn,22:$Vo,23:$Vp,24:$Vq,25:$Vr,26:$Vs,27:$Vt,28:$Vu,29:$Vv}),o($VL,[2,40])],
defaultActions: {35:[2,1]},
parseError: function parseError(str, hash) {
    if (hash.recoverable) {
        this.trace(str);
    } else {
        function _parseError (msg, hash) {
            this.message = msg;
            this.hash = hash;
        }
        _parseError.prototype = new Error();

        throw new _parseError(str, hash);
    }
},
parse: function parse(input) {
    var self = this, stack = [0], tstack = [], vstack = [null], lstack = [], table = this.table, yytext = '', yylineno = 0, yyleng = 0, recovering = 0, TERROR = 2, EOF = 1;
    var args = lstack.slice.call(arguments, 1);
    var lexer = Object.create(this.lexer);
    var sharedState = { yy: {} };
    for (var k in this.yy) {
        if (Object.prototype.hasOwnProperty.call(this.yy, k)) {
            sharedState.yy[k] = this.yy[k];
        }
    }
    lexer.setInput(input, sharedState.yy);
    sharedState.yy.lexer = lexer;
    sharedState.yy.parser = this;
    if (typeof lexer.yylloc == 'undefined') {
        lexer.yylloc = {};
    }
    var yyloc = lexer.yylloc;
    lstack.push(yyloc);
    var ranges = lexer.options && lexer.options.ranges;
    if (typeof sharedState.yy.parseError === 'function') {
        this.parseError = sharedState.yy.parseError;
    } else {
        this.parseError = Object.getPrototypeOf(this).parseError;
    }
    function popStack(n) {
        stack.length = stack.length - 2 * n;
        vstack.length = vstack.length - n;
        lstack.length = lstack.length - n;
    }
    _token_stack:
        var lex = function () {
            var token;
            token = lexer.lex() || EOF;
            if (typeof token !== 'number') {
                token = self.symbols_[token] || token;
            }
            return token;
        };
    var symbol, preErrorSymbol, state, action, a, r, yyval = {}, p, len, newState, expected;
    while (true) {
        state = stack[stack.length - 1];
        if (this.defaultActions[state]) {
            action = this.defaultActions[state];
        } else {
            if (symbol === null || typeof symbol == 'undefined') {
                symbol = lex();
            }
            action = table[state] && table[state][symbol];
        }
                    if (typeof action === 'undefined' || !action.length || !action[0]) {
                var errStr = '';
                expected = [];
                for (p in table[state]) {
                    if (this.terminals_[p] && p > TERROR) {
                        expected.push('\'' + this.terminals_[p] + '\'');
                    }
                }
                if (lexer.showPosition) {
                    errStr = 'Parse error on line ' + (yylineno + 1) + ':\n' + lexer.showPosition() + '\nExpecting ' + expected.join(', ') + ', got \'' + (this.terminals_[symbol] || symbol) + '\'';
                } else {
                    errStr = 'Parse error on line ' + (yylineno + 1) + ': Unexpected ' + (symbol == EOF ? 'end of input' : '\'' + (this.terminals_[symbol] || symbol) + '\'');
                }
                this.parseError(errStr, {
                    text: lexer.match,
                    token: this.terminals_[symbol] || symbol,
                    line: lexer.yylineno,
                    loc: yyloc,
                    expected: expected
                });
            }
        if (action[0] instanceof Array && action.length > 1) {
            throw new Error('Parse Error: multiple actions possible at state: ' + state + ', token: ' + symbol);
        }
        switch (action[0]) {
        case 1:
            stack.push(symbol);
            vstack.push(lexer.yytext);
            lstack.push(lexer.yylloc);
            stack.push(action[1]);
            symbol = null;
            if (!preErrorSymbol) {
                yyleng = lexer.yyleng;
                yytext = lexer.yytext;
                yylineno = lexer.yylineno;
                yyloc = lexer.yylloc;
                if (recovering > 0) {
                    recovering--;
                }
            } else {
                symbol = preErrorSymbol;
                preErrorSymbol = null;
            }
            break;
        case 2:
            len = this.productions_[action[1]][1];
            yyval.$ = vstack[vstack.length - len];
            yyval._$ = {
                first_line: lstack[lstack.length - (len || 1)].first_line,
                last_line: lstack[lstack.length - 1].last_line,
                first_column: lstack[lstack.length - (len || 1)].first_column,
                last_column: lstack[lstack.length - 1].last_column
            };
            if (ranges) {
                yyval._$.range = [
                    lstack[lstack.length - (len || 1)].range[0],
                    lstack[lstack.length - 1].range[1]
                ];
            }
            r = this.performAction.apply(yyval, [
                yytext,
                yyleng,
                yylineno,
                sharedState.yy,
                action[1],
                vstack,
                lstack
            ].concat(args));
            if (typeof r !== 'undefined') {
                return r;
            }
            if (len) {
                stack = stack.slice(0, -1 * len * 2);
                vstack = vstack.slice(0, -1 * len);
                lstack = lstack.slice(0, -1 * len);
            }
            stack.push(this.productions_[action[1]][0]);
            vstack.push(yyval.$);
            lstack.push(yyval._$);
            newState = table[stack[stack.length - 2]][stack[stack.length - 1]];
            stack.push(newState);
            break;
        case 3:
            return true;
        }
    }
    return true;
}};
/* generated by jison-lex 0.3.4 */
var lexer = (function(){
var lexer = ({

EOF:1,

parseError:function parseError(str, hash) {
        if (this.yy.parser) {
            this.yy.parser.parseError(str, hash);
        } else {
            throw new Error(str);
        }
    },

// resets the lexer, sets new input
setInput:function (input, yy) {
        this.yy = yy || this.yy || {};
        this._input = input;
        this._more = this._backtrack = this.done = false;
        this.yylineno = this.yyleng = 0;
        this.yytext = this.matched = this.match = '';
        this.conditionStack = ['INITIAL'];
        this.yylloc = {
            first_line: 1,
            first_column: 0,
            last_line: 1,
            last_column: 0
        };
        if (this.options.ranges) {
            this.yylloc.range = [0,0];
        }
        this.offset = 0;
        return this;
    },

// consumes and returns one char from the input
input:function () {
        var ch = this._input[0];
        this.yytext += ch;
        this.yyleng++;
        this.offset++;
        this.match += ch;
        this.matched += ch;
        var lines = ch.match(/(?:\r\n?|\n).*/g);
        if (lines) {
            this.yylineno++;
            this.yylloc.last_line++;
        } else {
            this.yylloc.last_column++;
        }
        if (this.options.ranges) {
            this.yylloc.range[1]++;
        }

        this._input = this._input.slice(1);
        return ch;
    },

// unshifts one char (or a string) into the input
unput:function (ch) {
        var len = ch.length;
        var lines = ch.split(/(?:\r\n?|\n)/g);

        this._input = ch + this._input;
        this.yytext = this.yytext.substr(0, this.yytext.length - len);
        //this.yyleng -= len;
        this.offset -= len;
        var oldLines = this.match.split(/(?:\r\n?|\n)/g);
        this.match = this.match.substr(0, this.match.length - 1);
        this.matched = this.matched.substr(0, this.matched.length - 1);

        if (lines.length - 1) {
            this.yylineno -= lines.length - 1;
        }
        var r = this.yylloc.range;

        this.yylloc = {
            first_line: this.yylloc.first_line,
            last_line: this.yylineno + 1,
            first_column: this.yylloc.first_column,
            last_column: lines ?
                (lines.length === oldLines.length ? this.yylloc.first_column : 0)
                 + oldLines[oldLines.length - lines.length].length - lines[0].length :
              this.yylloc.first_column - len
        };

        if (this.options.ranges) {
            this.yylloc.range = [r[0], r[0] + this.yyleng - len];
        }
        this.yyleng = this.yytext.length;
        return this;
    },

// When called from action, caches matched text and appends it on next action
more:function () {
        this._more = true;
        return this;
    },

// When called from action, signals the lexer that this rule fails to match the input, so the next matching rule (regex) should be tested instead.
reject:function () {
        if (this.options.backtrack_lexer) {
            this._backtrack = true;
        } else {
            return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).\n' + this.showPosition(), {
                text: "",
                token: null,
                line: this.yylineno
            });

        }
        return this;
    },

// retain first n characters of the match
less:function (n) {
        this.unput(this.match.slice(n));
    },

// displays already matched input, i.e. for error messages
pastInput:function () {
        var past = this.matched.substr(0, this.matched.length - this.match.length);
        return (past.length > 20 ? '...':'') + past.substr(-20).replace(/\n/g, "");
    },

// displays upcoming input, i.e. for error messages
upcomingInput:function () {
        var next = this.match;
        if (next.length < 20) {
            next += this._input.substr(0, 20-next.length);
        }
        return (next.substr(0,20) + (next.length > 20 ? '...' : '')).replace(/\n/g, "");
    },

// displays the character position where the lexing error occurred, i.e. for error messages
showPosition:function () {
        var pre = this.pastInput();
        var c = new Array(pre.length + 1).join("-");
        return pre + this.upcomingInput() + "\n" + c + "^";
    },

// test the lexed token: return FALSE when not a match, otherwise return token
test_match:function (match, indexed_rule) {
        var token,
            lines,
            backup;

        if (this.options.backtrack_lexer) {
            // save context
            backup = {
                yylineno: this.yylineno,
                yylloc: {
                    first_line: this.yylloc.first_line,
                    last_line: this.last_line,
                    first_column: this.yylloc.first_column,
                    last_column: this.yylloc.last_column
                },
                yytext: this.yytext,
                match: this.match,
                matches: this.matches,
                matched: this.matched,
                yyleng: this.yyleng,
                offset: this.offset,
                _more: this._more,
                _input: this._input,
                yy: this.yy,
                conditionStack: this.conditionStack.slice(0),
                done: this.done
            };
            if (this.options.ranges) {
                backup.yylloc.range = this.yylloc.range.slice(0);
            }
        }

        lines = match[0].match(/(?:\r\n?|\n).*/g);
        if (lines) {
            this.yylineno += lines.length;
        }
        this.yylloc = {
            first_line: this.yylloc.last_line,
            last_line: this.yylineno + 1,
            first_column: this.yylloc.last_column,
            last_column: lines ?
                         lines[lines.length - 1].length - lines[lines.length - 1].match(/\r?\n?/)[0].length :
                         this.yylloc.last_column + match[0].length
        };
        this.yytext += match[0];
        this.match += match[0];
        this.matches = match;
        this.yyleng = this.yytext.length;
        if (this.options.ranges) {
            this.yylloc.range = [this.offset, this.offset += this.yyleng];
        }
        this._more = false;
        this._backtrack = false;
        this._input = this._input.slice(match[0].length);
        this.matched += match[0];
        token = this.performAction.call(this, this.yy, this, indexed_rule, this.conditionStack[this.conditionStack.length - 1]);
        if (this.done && this._input) {
            this.done = false;
        }
        if (token) {
            return token;
        } else if (this._backtrack) {
            // recover context
            for (var k in backup) {
                this[k] = backup[k];
            }
            return false; // rule action called reject() implying the next rule should be tested instead.
        }
        return false;
    },

// return next match in input
next:function () {
        if (this.done) {
            return this.EOF;
        }
        if (!this._input) {
            this.done = true;
        }

        var token,
            match,
            tempMatch,
            index;
        if (!this._more) {
            this.yytext = '';
            this.match = '';
        }
        var rules = this._currentRules();
        for (var i = 0; i < rules.length; i++) {
            tempMatch = this._input.match(this.rules[rules[i]]);
            if (tempMatch && (!match || tempMatch[0].length > match[0].length)) {
                match = tempMatch;
                index = i;
                if (this.options.backtrack_lexer) {
                    token = this.test_match(tempMatch, rules[i]);
                    if (token !== false) {
                        return token;
                    } else if (this._backtrack) {
                        match = false;
                        continue; // rule action called reject() implying a rule MISmatch.
                    } else {
                        // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
                        return false;
                    }
                } else if (!this.options.flex) {
                    break;
                }
            }
        }
        if (match) {
            token = this.test_match(match, rules[index]);
            if (token !== false) {
                return token;
            }
            // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
            return false;
        }
        if (this._input === "") {
            return this.EOF;
        } else {
            return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. Unrecognized text.\n' + this.showPosition(), {
                text: "",
                token: null,
                line: this.yylineno
            });
        }
    },

// return next match that has a token
lex:function lex() {
        var r = this.next();
        if (r) {
            return r;
        } else {
            return this.lex();
        }
    },

// activates a new lexer condition state (pushes the new lexer condition state onto the condition stack)
begin:function begin(condition) {
        this.conditionStack.push(condition);
    },

// pop the previously active lexer condition state off the condition stack
popState:function popState() {
        var n = this.conditionStack.length - 1;
        if (n > 0) {
            return this.conditionStack.pop();
        } else {
            return this.conditionStack[0];
        }
    },

// produce the lexer rule set which is active for the currently active lexer condition state
_currentRules:function _currentRules() {
        if (this.conditionStack.length && this.conditionStack[this.conditionStack.length - 1]) {
            return this.conditions[this.conditionStack[this.conditionStack.length - 1]].rules;
        } else {
            return this.conditions["INITIAL"].rules;
        }
    },

// return the currently active lexer condition state; when an index argument is provided it produces the N-th previous condition state, if available
topState:function topState(n) {
        n = this.conditionStack.length - 1 - Math.abs(n || 0);
        if (n >= 0) {
            return this.conditionStack[n];
        } else {
            return "INITIAL";
        }
    },

// alias for begin(condition)
pushState:function pushState(condition) {
        this.begin(condition);
    },

// return the number of states currently on the stack
stateStackSize:function stateStackSize() {
        return this.conditionStack.length;
    },
options: {},
performAction: function anonymous(yy,yy_,$avoiding_name_collisions,YY_START) {
var YYSTATE=YY_START;
switch($avoiding_name_collisions) {
case 0:/* ignore whitespace */ 
break;
case 1: yy.xpathmodels.debuglog("NODETYPE", yy_.yytext); return "NODETYPE_NODE"; 
break;
case 2: yy.xpathmodels.debuglog("NODETYPE", yy_.yytext); return "NODETYPE_TEXT"; 
break;
case 3: yy.xpathmodels.debuglog("NODETYPE", yy_.yytext); return "NODETYPE_COMMENT"; 
break;
case 4: yy.xpathmodels.debuglog("NODETYPE", yy_.yytext); return "NODETYPE_PROCINSTR"; 
break;
case 5: this.begin("OP_CONTEXT"); yy_.yytext = yy_.yytext.substr(1,yy_.yyleng-1); yy.xpathmodels.debuglog("VAR", yy_.yytext); return "VAR"; 
break;
case 6: this.begin("OP_CONTEXT"); 
                                     yy_.yytext = yy_.yytext.substr(0, yy_.yyleng-2);
                                     yy.xpathmodels.debuglog("NSWILDCARD", yy_.yytext); return "NSWILDCARD"; 
break;
case 7: this.begin("OP_CONTEXT"); yy.xpathmodels.debuglog("QNAME", yy_.yytext); return "QNAME"; 
break;
case 8: this.begin("OP_CONTEXT"); yy.xpathmodels.debuglog("WILDCARD", yy_.yytext); return "WILDCARD"; 
break;
case 9: this.begin("VAL_CONTEXT"); yy.xpathmodels.debuglog("MULT", yy_.yytext); return "MULT"; 
break;
case 10: this.begin("VAL_CONTEXT"); yy.xpathmodels.debuglog("AND", yy_.yytext); return "AND"; 
break;
case 11: this.begin("VAL_CONTEXT"); yy.xpathmodels.debuglog("OR", yy_.yytext); return "OR"; 
break;
case 12: this.begin("VAL_CONTEXT"); yy.xpathmodels.debuglog("DIV", yy_.yytext); return "DIV"; 
break;
case 13: this.begin("VAL_CONTEXT"); yy.xpathmodels.debuglog("MOD", yy_.yytext); return "MOD"; 
break;
case 14: this.begin("OP_CONTEXT"); yy.xpathmodels.debuglog("NUM", yy_.yytext); return "NUM"; 
break;
case 15: this.begin("VAL_CONTEXT"); yy.xpathmodels.debuglog("EQ", yy_.yytext); return "EQ"; 
break;
case 16: this.begin("VAL_CONTEXT"); yy.xpathmodels.debuglog("NEQ", yy_.yytext); return "NEQ"; 
break;
case 17: this.begin("VAL_CONTEXT"); yy.xpathmodels.debuglog("LTE", yy_.yytext); return "LTE"; 
break;
case 18: this.begin("VAL_CONTEXT"); yy.xpathmodels.debuglog("LT", yy_.yytext); return "LT"; 
break;
case 19: this.begin("VAL_CONTEXT"); yy.xpathmodels.debuglog("GTE", yy_.yytext); return "GTE"; 
break;
case 20: this.begin("VAL_CONTEXT"); yy.xpathmodels.debuglog("GT", yy_.yytext); return "GT"; 
break;
case 21: this.begin("VAL_CONTEXT"); yy.xpathmodels.debuglog("PLUS", yy_.yytext); return "PLUS"; 
break;
case 22: this.begin("VAL_CONTEXT"); yy.xpathmodels.debuglog("MINUS", yy_.yytext); return "MINUS"; 
break;
case 23: this.begin("VAL_CONTEXT"); yy.xpathmodels.debuglog("UNION", yy_.yytext); return "UNION"; 
break;
case 24: this.begin("VAL_CONTEXT"); yy.xpathmodels.debuglog("DBL", yy_.yytext); return "DBL_SLASH"; 
break;
case 25: this.begin("VAL_CONTEXT"); yy.xpathmodels.debuglog("SLASH", yy_.yytext); return "SLASH"; 
break;
case 26: this.begin("VAL_CONTEXT"); yy.xpathmodels.debuglog("LBRACK", yy_.yytext); return "LBRACK"; 
break;
case 27: this.begin("OP_CONTEXT");  yy.xpathmodels.debuglog("RBRACK", yy_.yytext); return "RBRACK"; 
break;
case 28: this.begin("VAL_CONTEXT"); yy.xpathmodels.debuglog("LPAREN", yy_.yytext); return "LPAREN"; 
break;
case 29: this.begin("OP_CONTEXT");  yy.xpathmodels.debuglog("RPAREN", yy_.yytext); return "RPAREN"; 
break;
case 30: this.begin("OP_CONTEXT");  yy.xpathmodels.debuglog("DBL", yy_.yytext); return "DBL_DOT"; 
break;
case 31: this.begin("OP_CONTEXT");  yy.xpathmodels.debuglog("DOT", yy_.yytext); return "DOT"; 
break;
case 32: this.begin("VAL_CONTEXT"); yy.xpathmodels.debuglog("AT", yy_.yytext); return "AT"; 
break;
case 33: this.begin("VAL_CONTEXT"); yy.xpathmodels.debuglog("DBL", yy_.yytext); return "DBL_COLON"; 
break;
case 34: this.begin("VAL_CONTEXT"); yy.xpathmodels.debuglog("COMMA", yy_.yytext); return "COMMA"; 
break;
case 35: this.begin("VAL_CONTEXT"); yy.xpathmodels.debuglog("HASH", yy_.yytext); return "HASH"; 
break;
case 36: this.begin("OP_CONTEXT"); yy.xpathmodels.debuglog("STR", yy_.yytext); return "STR"; 
break;
case 37:return 5;
break;
}
},
rules: [/^(?:((\s+)))/,/^(?:node(?=(((\s+))?\()))/,/^(?:text(?=(((\s+))?\()))/,/^(?:comment(?=(((\s+))?\()))/,/^(?:processing-instruction(?=(((\s+))?\()))/,/^(?:\$([A-Za-z_][A-Za-z0-9._-]*(:[A-Za-z_][A-Za-z0-9._-]*)?))/,/^(?:([A-Za-z_][A-Za-z0-9._-]*):\*)/,/^(?:([A-Za-z_][A-Za-z0-9._-]*(:[A-Za-z_][A-Za-z0-9._-]*)?))/,/^(?:\*)/,/^(?:\*)/,/^(?:(and))/,/^(?:(or))/,/^(?:(div))/,/^(?:(mod))/,/^(?:(([0-9])+(\.([0-9])*)?|(\.([0-9])+)))/,/^(?:=)/,/^(?:!=)/,/^(?:<=)/,/^(?:<)/,/^(?:>=)/,/^(?:>)/,/^(?:\+)/,/^(?:-)/,/^(?:\|)/,/^(?:\/\/)/,/^(?:\/)/,/^(?:\[)/,/^(?:\])/,/^(?:\()/,/^(?:\))/,/^(?:\.\.)/,/^(?:\.)/,/^(?:@)/,/^(?:::)/,/^(?:,)/,/^(?:#)/,/^(?:("[^"\""]*"|'[^'\'']*'))/,/^(?:$)/],
conditions: {"INITIAL":{"rules":[0,1,2,3,4,5,6,7,8,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37],"inclusive":true},"OP_CONTEXT":{"rules":[0,1,2,3,4,5,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37],"inclusive":true},"VAL_CONTEXT":{"rules":[0,1,2,3,4,5,6,7,8,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37],"inclusive":true}}
});
return lexer;
})();
parser.lexer = lexer;
function Parser () {
  this.yy = {};
}
Parser.prototype = parser;parser.Parser = Parser;
return new Parser;
})();


if (typeof require !== 'undefined' && typeof exports !== 'undefined') {
exports.parser = parser;
exports.Parser = parser.Parser;
exports.parse = function () { return parser.parse.apply(parser, arguments); };
exports.main = function commonjsMain(args) {
    if (!args[1]) {
        console.log('Usage: '+args[0]+' FILE');
        process.exit(1);
    }
    var source = require('fs').readFileSync(require('path').normalize(args[1]), "utf8");
    return exports.parser.parse(source);
};
if (typeof module !== 'undefined' && require.main === module) {
  exports.main(process.argv.slice(1));
}
}
}).call(this,require('_process'))
},{"_process":5,"fs":3,"path":4}],3:[function(require,module,exports){

},{}],4:[function(require,module,exports){
(function (process){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
    var last = parts[i];
    if (last === '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// Split a filename into [root, dir, basename, ext], unix version
// 'root' is just a slash, or nothing.
var splitPathRe =
    /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
var splitPath = function(filename) {
  return splitPathRe.exec(filename).slice(1);
};

// path.resolve([from ...], to)
// posix version
exports.resolve = function() {
  var resolvedPath = '',
      resolvedAbsolute = false;

  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    var path = (i >= 0) ? arguments[i] : process.cwd();

    // Skip empty and invalid entries
    if (typeof path !== 'string') {
      throw new TypeError('Arguments to path.resolve must be strings');
    } else if (!path) {
      continue;
    }

    resolvedPath = path + '/' + resolvedPath;
    resolvedAbsolute = path.charAt(0) === '/';
  }

  // At this point the path should be resolved to a full absolute path, but
  // handle relative paths to be safe (might happen when process.cwd() fails)

  // Normalize the path
  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function(path) {
  var isAbsolute = exports.isAbsolute(path),
      trailingSlash = substr(path, -1) === '/';

  // Normalize the path
  path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }

  return (isAbsolute ? '/' : '') + path;
};

// posix version
exports.isAbsolute = function(path) {
  return path.charAt(0) === '/';
};

// posix version
exports.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function(p, index) {
    if (typeof p !== 'string') {
      throw new TypeError('Arguments to path.join must be strings');
    }
    return p;
  }).join('/'));
};


// path.relative(from, to)
// posix version
exports.relative = function(from, to) {
  from = exports.resolve(from).substr(1);
  to = exports.resolve(to).substr(1);

  function trim(arr) {
    var start = 0;
    for (; start < arr.length; start++) {
      if (arr[start] !== '') break;
    }

    var end = arr.length - 1;
    for (; end >= 0; end--) {
      if (arr[end] !== '') break;
    }

    if (start > end) return [];
    return arr.slice(start, end - start + 1);
  }

  var fromParts = trim(from.split('/'));
  var toParts = trim(to.split('/'));

  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }

  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push('..');
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength));

  return outputParts.join('/');
};

exports.sep = '/';
exports.delimiter = ':';

exports.dirname = function(path) {
  var result = splitPath(path),
      root = result[0],
      dir = result[1];

  if (!root && !dir) {
    // No dirname whatsoever
    return '.';
  }

  if (dir) {
    // It has a dirname, strip trailing slash
    dir = dir.substr(0, dir.length - 1);
  }

  return root + dir;
};


exports.basename = function(path, ext) {
  var f = splitPath(path)[2];
  // TODO: make this comparison case-insensitive on windows?
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};


exports.extname = function(path) {
  return splitPath(path)[3];
};

function filter (xs, f) {
    if (xs.filter) return xs.filter(f);
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (f(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// String.prototype.substr - negative index don't work in IE8
var substr = 'ab'.substr(-1) === 'b'
    ? function (str, start, len) { return str.substr(start, len) }
    : function (str, start, len) {
        if (start < 0) start = str.length + start;
        return str.substr(start, len);
    }
;

}).call(this,require('_process'))
},{"_process":5}],5:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = setTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            currentQueue[queueIndex].run();
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    clearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (!draining) {
        setTimeout(drainQueue, 0);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],6:[function(require,module,exports){
var parser = require('./parser.js').parser,
    makeXPathModels = require('./models.js').makeXPathModels;

parser.yy.xpathmodels = makeXPathModels();
parser.makeXPathModels = makeXPathModels;

parser.setXPathModels = function(models) {
    parser.yy.xpathmodels = models;
};

module.exports = parser;

},{"./models.js":1,"./parser.js":2}]},{},[6])(6)
});