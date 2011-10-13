/*
 * This test package is heavily adapted from the previous test suite:
 * https://bitbucket.org/javarosa/javarosa/src/tip/core/test/org/javarosa/xpath/test/XPathParseTest.java
 * 
 */

var runGeneratorTests = function(testcases) {
    var parsed;
    for (var i in testcases) {
        if (testcases.hasOwnProperty(i)) {
            try {
                parsed = xpath.parse(i);
                equal(parsed.toXPath(), testcases[i], "" + i + " generated correctly.");
                // It seems reasonable to expect that the generated xpath
                // should parse back to the same object, although this may 
                // not always hold true.
                equal(parsed.toString(), xpath.parse(parsed.toXPath()).toString(), "" + i + " produced same result when reparsed.");
            } catch(err) {
                ok(false, "" + err + " for input: " + i);
            }
        }
    }
};

test("generator numbers", function() {
    runGeneratorTests({
        "123.": "123.",
        "734.04": "734.04",
        "0.12345": "0.12345",
        ".666": "0.666",
        "00000333.3330000": "333.333",
        "1230000000000000000000": "1230000000000000000000",
        "0.00000000000000000123": "0.00000000000000000123",
        "0": "0",
        "0.": "0.",
        ".0": "0.",
        "0.0": "0."
    });
});


test("generator strings", function () {
    runGeneratorTests({
        "\"\"": "''",
        "\"   \"": "'   '",
        "''": "''",
        "'\"'": "'\"'",
        "\"'\"": "\"'\"",
        "'mary had a little lamb'": "'mary had a little lamb'"
    });
});

test("generator variables", function () {
    runGeneratorTests({
		"$var": "$var",
		"$qualified:name": "$qualified:name"
    });
});


test("generator parens nesting", function () {
    runGeneratorTests({
        "(5)": "5",
        "(( (( (5 )) )))  ": "5",
    });
});

test("generator operators", function () {
    runGeneratorTests({
        "5 + 5": "5 + 5",
        "-5": "-5",
        "- 5": "-5",
        "----5": "----5",
        "6 * - 7": "6 * -7",
        "0--0": "0 - -0",             
        "5 * 5": "5 * 5",
        "5 div 5": "5 div 5",
        "5 mod 5": "5 mod 5",
        "3mod4": "3 mod 4",
        "3 mod6": "3 mod 6",
        "3mod 7": "3 mod 7",
        "5 divseparate-token": "5 div separate-token", //not quite sure if this is legal xpath or not, but it *can* be parsed unambiguously
        "5 = 5": "5 = 5",
        "5 != 5": "5 != 5",
        "5 < 5": "5 < 5",
        "5 <= 5": "5 <= 5",
        "5 > 5": "5 > 5",
        "5 >= 5": "5 >= 5",
        "5 and 5": "5 and 5",
        "5 or 5": "5 or 5",
        "5 | 5": "5 | 5"
    });
});

test("generator operator associativity", function () {
    runGeneratorTests({
        "1 or 2 or 3": "1 or 2 or 3",
        "1 and 2 and 3": "1 and 2 and 3",
        "1 = 2 != 3 != 4 = 5": "1 = 2 != 3 != 4 = 5",
        "1 < 2 >= 3 <= 4 > 5": "1 < 2 >= 3 <= 4 > 5",
        "1 + 2 - 3 - 4 + 5": "1 + 2 - 3 - 4 + 5",
        "1 mod 2 div 3 div 4 * 5": "1 mod 2 div 3 div 4 * 5",
        "1|2|3": "1 | 2 | 3",
    });
    
});

test("generator operator precedence", function () {
    runGeneratorTests({
        "1 < 2 = 3 > 4 and 5 <= 6 != 7 >= 8 or 9 and 10": "1 < 2 = 3 > 4 and 5 <= 6 != 7 >= 8 or 9 and 10",
        "1 * 2 + 3 div 4 < 5 mod 6 | 7 - 8": "1 * 2 + 3 div 4 < 5 mod 6 | 7 - 8",
        "- 4 * 6": "-4 * 6",
        "6*(3+4)and(5or2)": "6 * (3 + 4) and (5 or 2)",
        "(1 - 2) - 3": "1 - 2 - 3",        
        "1 - (2 - 3)": "1 - (2 - 3)"
    });
});


test("generator function calls", function () {
    runGeneratorTests({
        "function()": "function()",
        "func:tion()": "func:tion()",
        "function(   )": "function()",
        "function (5)": "function(5)",
        "function   ( 5, 'arg', 4 * 12)": "function(5, 'arg', 4 * 12)",
        "4andfunc()": "4 and func()",
    });
});


//test("generator function calls that are actually node tests", function () {
//    runGeneratorTests({
//        "node()": "{path-expr:rel,{{step:child,node()}}}",
//        "text()": "{path-expr:rel,{{step:child,text()}}}",
//        "comment()": "{path-expr:rel,{{step:child,comment()}}}",
//        "processing-instruction()": "{path-expr:rel,{{step:child,proc-instr()}}}",
//        "processing-instruction('asdf')": "{path-expr:rel,{{step:child,proc-instr('asdf')}}}",
//    });
//    runFailures({
//        "node(5)": null,
//        "text('str')": null,
//        "comment(name)": null,
//        "processing-instruction(5)": null,
//        "processing-instruction('asdf','qwer')": null,
//        "child::func()": null,
//    });
//});
//
//test("generator filter expressions", function () {
//    runGeneratorTests({
//        "bunch-o-nodes()[3]": "{filt-expr:{func-expr:bunch-o-nodes,{}},{{num:3}}}",
//        "bunch-o-nodes()[3]['predicates'!='galore']": "{filt-expr:{func-expr:bunch-o-nodes,{}},{{num:3},{binop-expr:!=,{str:'predicates'},{str:'galore'}}}}",
//        "(bunch-o-nodes)[3]": "{filt-expr:{path-expr:rel,{{step:child,bunch-o-nodes}}},{{num:3}}}",
//        "bunch-o-nodes[3]": "{path-expr:rel,{{step:child,bunch-o-nodes,{{num:3}}}}}",
//    });
//    runFailures({});
//});
//
//test("generator path steps", function () {
//    runGeneratorTests({
//        ".": "{path-expr:rel,{{step:self,node()}}}",
//        "..": "{path-expr:rel,{{step:parent,node()}}}",
//    });
//    runFailures({
//        "..[4]": null,
//        "preceding::..": null,
//    });
//});
//
//test("generator name tests", function () {
//    runGeneratorTests({
//        "name": "{path-expr:rel,{{step:child,name}}}",
//        "qual:name": "{path-expr:rel,{{step:child,qual:name}}}",
//        "_rea--ll:y.funk..y_N4M3": "{path-expr:rel,{{step:child,_rea--ll:y.funk..y_N4M3}}}",
//        "namespace:*": "{path-expr:rel,{{step:child,namespace:*}}}",
//        "*": "{path-expr:rel,{{step:child,*}}}",
//        "*****": "{binop-expr:*,{binop-expr:*,{path-expr:rel,{{step:child,*}}},{path-expr:rel,{{step:child,*}}}},{path-expr:rel,{{step:child,*}}}}",            
//    });
//    runFailures({
//        "a:b:c": null,
//        "inv#lid_N~AME": null,
//        ".abc": null,
//        "5abc": null,
//    });
//});
//
//test("generator axes", function () {
//    runGeneratorTests({
//        "child::*": "{path-expr:rel,{{step:child,*}}}",
//        "parent::*": "{path-expr:rel,{{step:parent,*}}}",
//        "descendant::*": "{path-expr:rel,{{step:descendant,*}}}",
//        "ancestor::*": "{path-expr:rel,{{step:ancestor,*}}}",
//        "following-sibling::*": "{path-expr:rel,{{step:following-sibling,*}}}",
//        "preceding-sibling::*": "{path-expr:rel,{{step:preceding-sibling,*}}}",
//        "following::*": "{path-expr:rel,{{step:following,*}}}",
//        "preceding::*": "{path-expr:rel,{{step:preceding,*}}}",
//        "attribute::*": "{path-expr:rel,{{step:attribute,*}}}",
//        "namespace::*": "{path-expr:rel,{{step:namespace,*}}}",
//        "self::*": "{path-expr:rel,{{step:self,*}}}",
//        "descendant-or-self::*": "{path-expr:rel,{{step:descendant-or-self,*}}}",
//        "ancestor-or-self::*": "{path-expr:rel,{{step:ancestor-or-self,*}}}",
//        "@attr": "{path-expr:rel,{{step:attribute,attr}}}",
//        "@*": "{path-expr:rel,{{step:attribute,*}}}",
//        "@ns:*": "{path-expr:rel,{{step:attribute,ns:*}}}",
//    });
//    runFailures({
//        "bad-axis::*": null,
//        "::*": null,
//        "child::.": null,
//        "@attr::*": null
//    });
//});
//
//test("generator predicates", function () {
//    runGeneratorTests({
//        "descendant::node()[@attr='blah'][4]": "{path-expr:rel,{{step:descendant,node(),{{binop-expr:==,{path-expr:rel,{{step:attribute,attr}}},{str:'blah'}},{num:4}}}}}",
//    });
//    runFailures({
//        "[2+3]": null,
//    });
//});
//
//test("generator paths", function () {
//    runGeneratorTests({
//        "rel/ative/path": "{path-expr:rel,{{step:child,rel},{step:child,ative},{step:child,path}}}",
//        "/abs/olute/path['etc']": "{path-expr:abs,{{step:child,abs},{step:child,olute},{step:child,path,{{str:'etc'}}}}}",
//        "filter()/expr/path": "{path-expr:{filt-expr:{func-expr:filter,{}},{}},{{step:child,expr},{step:child,path}}}",
//        "fil()['ter']/expr/path": "{path-expr:{filt-expr:{func-expr:fil,{}},{{str:'ter'}}},{{step:child,expr},{step:child,path}}}",
//        "(another-filter)/expr/path": "{path-expr:{filt-expr:{path-expr:rel,{{step:child,another-filter}}},{}},{{step:child,expr},{step:child,path}}}",
//        "/": "{path-expr:abs,{}}",
//        "//all": "{path-expr:abs,{{step:descendant-or-self,node()},{step:child,all}}}",
//        "a/.//../z": "{path-expr:rel,{{step:child,a},{step:self,node()},{step:descendant-or-self,node()},{step:parent,node()},{step:child,z}}}",
//        "6andpath": "{binop-expr:and,{num:6},{path-expr:rel,{{step:child,path}}}}",
//    
//    });
//    runFailures({
//        "rel/ative/path/": null,
//        "filter-expr/(must-come)['first']": null,
//        "//": null,
//    });
//});
//
//test("generator real world examples", function () {
//    runGeneratorTests({
//        "/patient/sex = 'male' and /patient/age > 15": "{binop-expr:and,{binop-expr:==,{path-expr:abs,{{step:child,patient},{step:child,sex}}},{str:'male'}},{binop-expr:>,{path-expr:abs,{{step:child,patient},{step:child,age}}},{num:15}}}",
//        "../jr:hist-data/labs[@type=\"cd4\"]": "{path-expr:rel,{{step:parent,node()},{step:child,jr:hist-data},{step:child,labs,{{binop-expr:==,{path-expr:rel,{{step:attribute,type}}},{str:'cd4'}}}}}}",
//        "function_call(26*(7+3), //*, /im/child::an/ancestor::x[3][true()]/path)": "{func-expr:function_call,{{binop-expr:*,{num:26},{binop-expr:+,{num:7},{num:3}}},{path-expr:abs,{{step:descendant-or-self,node()},{step:child,*}}},{path-expr:abs,{{step:child,im},{step:child,an},{step:ancestor,x,{{num:3},{func-expr:true,{}}}},{step:child,path}}}}}"             
//    });
//});
//
//test("generator template", function () {
//    runGeneratorTests({});
//    runFailures({});
//});
