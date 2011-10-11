
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

test("template", function () {
    runCommon({});
    runFailures({});
});
