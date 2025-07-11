var xpath = require('../src/main.js');

(function() {
    function makeXPathConfig(validHashtagNamespaces, translationDict) {
        return {
            isValidNamespace: function (value) {
                return validHashtagNamespaces.indexOf(value) !== -1;
            },
            hashtagToXPath: function (hashtagExpr) {
                if (translationDict[hashtagExpr]) {
                    return translationDict[hashtagExpr];
                }
                throw new Error("Can't translate this hashtag to an XPath");
            },
            toHashtag: function (xpath_) {
                function toHashtag(xpathExpr) {
                    for (var key in translationDict) {
                        if (translationDict.hasOwnProperty(key)) {
                            if (translationDict[key] === xpathExpr)
                                return key;
                        }
                    }
                    return null;
                }

                return toHashtag(xpath_.toXPath());
            },
        };
    }

    var runCommon = function(assert, testcases, validHashtagNamespaces) {
        xpath.setXPathModels(xpath.makeXPathModels(makeXPathConfig(validHashtagNamespaces, {})));
        for (var i in testcases) {
            if (testcases.hasOwnProperty(i)) {
                try {
                    assert.equal(xpath.parse(i).toString(), testcases[i], "" + i + " parsed correctly.");
                } catch(err) {
                    assert.ok(false, "" + err + " for input: " + i);
                }
            }
        }
    };
    var runFailures = function(assert, testcases, validHashtagNamespaces) {
        function tmpFunc() {
            xpath.parse(i);
        }
        xpath.setXPathModels(xpath.makeXPathModels(makeXPathConfig(validHashtagNamespaces, {})));
        for (var i in testcases) {
            if (testcases.hasOwnProperty(i)) {
                assert.throws(tmpFunc, testcases[i], "" + i + " correctly failed to parse.");
            }
        }
    };
    var runGeneratorTests = function(assert, testcases, translationDict, namespaces) {
        xpath.setXPathModels(xpath.makeXPathModels(makeXPathConfig(namespaces, translationDict)));
        var parsed;
        for (var i in testcases) {
            if (testcases.hasOwnProperty(i)) {
                try {
                    parsed = xpath.parse(i);
                    assert.equal(parsed.toXPath(), testcases[i], "" + i + " generated correctly.");
                    // It seems reasonable to expect that the generated xpath
                    // should parse back to the same object, although this may 
                    // not always hold true.
                    assert.equal(parsed.toString(), xpath.parse(parsed.toHashtag()).toString(), "" + i + " produced same result when reparsed.");
                } catch(err) {
                    assert.ok(false, "" + err + " for input: " + i);
                }
            }
        }
    };

    QUnit.test("hashtag parsing", function (assert) {
        var namespaces = ['form', 'case'];
        runCommon(assert, {
            "#form/question": "{hashtag-expr:form,{question}}",
            "#form/group/question": "{hashtag-expr:form,{group,question}}",
            "#case/type/prop": "{hashtag-expr:case,{type,prop}}",
        }, namespaces);
        runFailures(assert, {
            "#": null,
            "#case/type/prop[filter=filter]": null,
            "#/case/type/prop": null,
            "#whale/orca": null,
        }, namespaces);
    });

    QUnit.test("generator hashtags", function (assert) {
        var transDict = {
                '#form/question': '/data/question',
                '#form/group/question': '/data/group/question',
                '#case/question': "instance('casedb')/cases/case[@case_id = case_id]/question",
            },
            testCases = {
                "#form/question": "/data/question",
                "#form/group/question": "/data/group/question",
                "#form/question = #case/question": "/data/question = instance('casedb')/cases/case[@case_id = case_id]/question",
                "#form/question     =    #case/question": "/data/question = instance('casedb')/cases/case[@case_id = case_id]/question",
                "/data/filtered[@id = #form/question]": "/data/filtered[@id = /data/question]"
            };

        runGeneratorTests(assert, testCases, transDict, ['form', 'case']);
    });

    QUnit.test("hashtags with no xpath", function(assert) {
        xpath.setXPathModels(xpath.makeXPathModels(makeXPathConfig(['form', 'case'], {})));

        var testcases = {
            "#form/question1": "/data/question1",
        };
        var parsed;
        for (var i in testcases) {
            if (testcases.hasOwnProperty(i)) {
                parsed = xpath.parse(i);
                assert.ok(true, i + " correctly parsed");
                try {
                    parsed.toXPath();
                    assert.ok(false, "This should not be translatable");
                } catch(err) {
                    assert.ok(true, err);
                }
            }
        }
    });

    QUnit.test("from xpath to hashtag", function(assert) {
        var translationDict = {
                '#form': '/data',
                '#form/question': '/data/question',
                '#form/question2': '/data/question2',
                '#form/group/question': '/data/group/question',
                '#case/question': "instance('casedb')/cases/case[@case_id = case_id]/question",
            };

        xpath.setXPathModels(xpath.makeXPathModels(makeXPathConfig(['form', 'case'], translationDict)));

        var testcases = {
            "/data": "#form",
            "/data/question": "#form/question",
            "/data/question + /data/question2": "#form/question + #form/question2",
            "/data/question = instance('casedb')/cases/case[@case_id = case_id]/question": "#form/question = #case/question",
            "/data/filtered[/data/question = 1]": "/data/filtered[#form/question = 1]",
            "function   ( 5, 'arg', 4 * 12, /data/filtered[/data/question = 1])": "function(5, 'arg', 4 * 12, /data/filtered[#form/question = 1])",
            "bunch-o-nodes()[3][/data/question !='galore']": "bunch-o-nodes()[3][#form/question != 'galore']",
            "-some-function(/data/question)": "-some-function(#form/question)",
        };

        var parsed;
        for (var i in testcases) {
            if (testcases.hasOwnProperty(i)) {
                parsed = xpath.parse(i);
                assert.ok(true, i + " correctly parsed");
                assert.equal(parsed.toHashtag(), testcases[i]);
            }
        }
    });
})();
