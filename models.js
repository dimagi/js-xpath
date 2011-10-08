
/*
 * These models are very heavily based on their JavaRosa counterparts, which live at:
 * https://bitbucket.org/javarosa/javarosa/src/tip/core/src/org/javarosa/xpath/expr/
 * 
 */

var XPathNumericLiteral = function(value) {
    this.value = value; 
    return this;
};

var XPathStringLiteral = function(value) {
    this.value = value; 
    return this;
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
	TYPE_PROCESSING_INSTRUCTION: "proc-instr" 

};

var XPathStep = function(axis, test, predicates, name, namespace, literal) {
/*        
    
        public static XPathStep ABBR_SELF () {
                return new XPathStep(AXIS_SELF, TEST_TYPE_NODE);
        }

        public static XPathStep ABBR_PARENT () {
                return new XPathStep(AXIS_PARENT, TEST_TYPE_NODE);
        }

        public static XPathStep ABBR_DESCENDANTS () {
                return new XPathStep(AXIS_DESCENDANT_OR_SELF, TEST_TYPE_NODE);
        }
*/
    this.axis = axis;
    this.test = test;
    this.predicates = predicates;
    this.name = name;
    this.namespace = namespace;
    this.literal = literal;
    return this;        
}