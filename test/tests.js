/*
 * This test package is heavily adapted from the previous test suite:
 * https://bitbucket.org/javarosa/javarosa/src/tip/core/test/org/javarosa/xpath/test/XPathParseTest.java
 * 
 */

var runCommon = function(testcases) {
    for (var i in testcases) {
        if (testcases.hasOwnProperty(i)) {
            try {
                equal(xpath.parse(i).toString(), testcases[i], "" + i + " parsed correctly.");
            } catch(err) {
                ok(false, "" + err + " for input: " + i);
            }
        }
    }
};
                
var runFailures = function(testcases) {
    for (var i in testcases) {
        if (testcases.hasOwnProperty(i)) {
            var tmpFunc = function() {
                xpath.parse(i);
            }
            raises(tmpFunc, testcases[i], "" + i + " correctly failed to parse.");
        }
    }    
}

test("null expressions", function () {
    runFailures({
        "": null,
        "     ": null,
        "  \t \n  \r ": null
    });
});

test("numbers", function() {
    runCommon({
        "10": "{num:10}",
        "123.": "{num:123}",
 		"734.04": "{num:734.04}",
		"0.12345": "{num:0.12345}",
		".666": "{num:0.666}",
		"00000333.3330000": "{num:333.333}",
		"1230000000000000000000": "{num:1.23e+21}",
		"0.00000000000000000123": "{num:1.23e-18}",
		"0": "{num:0}",
		"0.": "{num:0}",
		".0": "{num:0.0}",
		"0.0": "{num:0}"
    });
});

test("null expressions", function () {
    runFailures({
        "": null,
        "     ": null,
        "  \t \n  \r ": null
    });
});

test("strings", function () {
    runCommon({
		"\"\"": "{str:''}",
		"\"   \"": "{str:'   '}",
		"''": "{str:''}",
		"'\"'": "{str:'\"'}",
		"\"'\"": "{str:'''}",
		"'mary had a little lamb'": "{str:'mary had a little lamb'}"
    });
    runFailures({
        "'unterminated string...": null,
    });
});

test("variables", function () {
    runCommon({
		"$var": "{var:var}",
		"$qualified:name": "{var:qualified:name}"
    });
    runFailures({
        "$x:*": null,
        "$": null,
        "$$asdf": null
    });
});

test("parens nesting", function () {
    runCommon({
        "(5)": "{num:5}",
        "(( (( (5 )) )))  ": "{num:5}",
    });
    runFailures({
        ")": null,
        "(": null,
        "()": null,
        "(((3))": null
    });
});

test("operators", function () {
    runCommon({
        "5 + 5": "{binop-expr:+,{num:5},{num:5}}",
        "-5": "{unop-expr:num-neg,{num:5}}",
        "- 5": "{unop-expr:num-neg,{num:5}}",
        "----5": "{unop-expr:num-neg,{unop-expr:num-neg,{unop-expr:num-neg,{unop-expr:num-neg,{num:5}}}}}",
        "6 * - 7": "{binop-expr:*,{num:6},{unop-expr:num-neg,{num:7}}}",
        "0--0": "{binop-expr:-,{num:0},{unop-expr:num-neg,{num:0}}}",             
        "5 * 5": "{binop-expr:*,{num:5},{num:5}}",
        "5 div 5": "{binop-expr:/,{num:5},{num:5}}",
        "5 mod 5": "{binop-expr:%,{num:5},{num:5}}",
        "3mod4": "{binop-expr:%,{num:3},{num:4}}",
        "5 divseparate-token": "{binop-expr:/,{num:5},{path-expr:rel,{{step:child,separate-token}}}}", //not quite sure if this is legal xpath or not, but it *can* be parsed unambiguously
        "5 = 5": "{binop-expr:==,{num:5},{num:5}}",
        "5 != 5": "{binop-expr:!=,{num:5},{num:5}}",
        "5 < 5": "{binop-expr:<,{num:5},{num:5}}",
        "5 <= 5": "{binop-expr:<=,{num:5},{num:5}}",
        "5 > 5": "{binop-expr:>,{num:5},{num:5}}",
        "5 >= 5": "{binop-expr:>=,{num:5},{num:5}}",
        "5 and 5": "{binop-expr:and,{num:5},{num:5}}",
        "5 or 5": "{binop-expr:or,{num:5},{num:5}}",
        "5 | 5": "{binop-expr:union,{num:5},{num:5}}"
    });
    runFailures({
        "+-": null,
        "5/5": null,
        "5%5": null,
        "5 == 5": null,
        "5 <> 5": null,
        ">=": null,
        "'asdf'!=": null
    });
});

test("operator associativity", function () {
    runCommon({
        "1 or 2 or 3": "{binop-expr:or,{num:1},{binop-expr:or,{num:2},{num:3}}}",
        "1 and 2 and 3": "{binop-expr:and,{num:1},{binop-expr:and,{num:2},{num:3}}}",
        "1 = 2 != 3 != 4 = 5": "{binop-expr:==,{binop-expr:!=,{binop-expr:!=,{binop-expr:==,{num:1},{num:2}},{num:3}},{num:4}},{num:5}}",
        "1 < 2 >= 3 <= 4 > 5": "{binop-expr:>,{binop-expr:<=,{binop-expr:>=,{binop-expr:<,{num:1},{num:2}},{num:3}},{num:4}},{num:5}}",
        "1 + 2 - 3 - 4 + 5": "{binop-expr:+,{binop-expr:-,{binop-expr:-,{binop-expr:+,{num:1},{num:2}},{num:3}},{num:4}},{num:5}}",
        "1 mod 2 div 3 div 4 * 5": "{binop-expr:*,{binop-expr:/,{binop-expr:/,{binop-expr:%,{num:1},{num:2}},{num:3}},{num:4}},{num:5}}",
        "1|2|3": "{binop-expr:union,{binop-expr:union,{num:1},{num:2}},{num:3}}",
        
    });
    
});

test("operator precedence", function () {
    runCommon({
        "1 < 2 = 3 > 4 and 5 <= 6 != 7 >= 8 or 9 and 10":
                "{binop-expr:or,{binop-expr:and,{binop-expr:==,{binop-expr:<,{num:1},{num:2}},{binop-expr:>,{num:3},{num:4}}},{binop-expr:!=,{binop-expr:<=,{num:5},{num:6}},{binop-expr:>=,{num:7},{num:8}}}},{binop-expr:and,{num:9},{num:10}}}",
        "1 * 2 + 3 div 4 < 5 mod 6 | 7 - 8":
                "{binop-expr:<,{binop-expr:+,{binop-expr:*,{num:1},{num:2}},{binop-expr:/,{num:3},{num:4}}},{binop-expr:-,{binop-expr:%,{num:5},{binop-expr:union,{num:6},{num:7}}},{num:8}}}",
        "- 4 * 6": "{binop-expr:*,{unop-expr:num-neg,{num:4}},{num:6}}",
        "6*(3+4)and(5or2)": "{binop-expr:and,{binop-expr:*,{num:6},{binop-expr:+,{num:3},{num:4}}},{binop-expr:or,{num:5},{num:2}}}",
    });
    runFailures({
        "8|-9": null //disallowed by the xpath spec
    });
});


test("template", function () {
    runCommon({});
    runFailures({});
});
