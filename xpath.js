/* Jison generated parser */
var xpath = (function(){

var parser = {trace: function trace() { },
yy: {},
symbols_: {"error":2,"xpath_expr":3,"expr":4,"EOF":5,"base_expr":6,"op_expr":7,"path_expr":8,"LPAREN":9,"RPAREN":10,"func_call":11,"VAR":12,"literal":13,"OR":14,"AND":15,"EQ":16,"NEQ":17,"LTE":18,"GT":19,"GTE":20,"PLUS":21,"MINUS":22,"MULT":23,"DIV":24,"MOD":25,"UNION":26,"QNAME":27,"arg_list":28,"COMMA":29,"loc_path":30,"predicate":31,"LBRACK":32,"RBRACK":33,"rel_loc_path":34,"SLASH":35,"DBL_SLASH":36,"step":37,"step_unabbr":38,"DOT":39,"DBL_DOT":40,"step_body":41,"node_test":42,"axis_specifier":43,"DBL_COLON":44,"AT":45,"WILDCARD":46,"NSWILDCARD":47,"NODETYPE_NODE":48,"NODETYPE_TEXT":49,"NODETYPE_COMMENT":50,"NODETYPE_PROCINSTR":51,"STR":52,"NUM":53,"$accept":0,"$end":1},
terminals_: {2:"error",5:"EOF",9:"LPAREN",10:"RPAREN",12:"VAR",14:"OR",15:"AND",16:"EQ",17:"NEQ",18:"LTE",19:"GT",20:"GTE",21:"PLUS",22:"MINUS",23:"MULT",24:"DIV",25:"MOD",26:"UNION",27:"QNAME",29:"COMMA",32:"LBRACK",33:"RBRACK",35:"SLASH",36:"DBL_SLASH",39:"DOT",40:"DBL_DOT",44:"DBL_COLON",45:"AT",46:"WILDCARD",47:"NSWILDCARD",48:"NODETYPE_NODE",49:"NODETYPE_TEXT",50:"NODETYPE_COMMENT",51:"NODETYPE_PROCINSTR",52:"STR",53:"NUM"},
productions_: [0,[3,2],[4,1],[4,1],[4,1],[6,3],[6,1],[6,1],[6,1],[7,3],[7,3],[7,3],[7,3],[7,3],[7,3],[7,3],[7,3],[7,3],[7,3],[7,3],[7,3],[7,2],[7,3],[11,4],[11,3],[28,3],[28,1],[8,1],[31,3],[30,1],[30,2],[30,2],[30,1],[34,1],[34,3],[34,3],[37,1],[37,1],[37,1],[38,2],[38,1],[41,1],[41,2],[43,2],[43,1],[42,1],[42,1],[42,1],[42,3],[42,3],[42,3],[42,4],[13,1],[13,1]],
performAction: function anonymous(yytext,yyleng,yylineno,yy,yystate,$$,_$) {

var $0 = $$.length - 1;
switch (yystate) {
case 1: typeof console !== 'undefined' ? console.log($$[$0-1]) : print($$[$0-1]);
                          return $$[$0-1]; 
break;
case 2:  this.$ = $$[$0]; 
break;
case 3:  this.$ = $$[$0]; 
break;
case 4:  this.$ = $$[$0]; 
break;
case 5: this.$ = $$[$0-1]; 
break;
case 9: this.$ = {"expr": "or", "left": $$[$0-2], "right": $$[$0]}; 
break;
case 10: this.$ = {"expr": "and", "left": $$[$0-2], "right": $$[$0]}; 
break;
case 11: this.$ = {"expr": "eq", "left": $$[$0-2], "right": $$[$0]}; 
break;
case 12: this.$ = {"expr": "neq", "left": $$[$0-2], "right": $$[$0]}; 
break;
case 13: this.$ = {"expr": "lte", "left":$$[$0-2], "right": $$[$0]}; 
break;
case 14: this.$ = {"expr": "gt", "left":$$[$0-2], "right": $$[$0]}; 
break;
case 15: this.$ = {"expr": "gte", "left":$$[$0-2], "right": $$[$0]}; 
break;
case 16: this.$ = {"expr": "plus", "left":$$[$0-2], "right": $$[$0]}; 
break;
case 17: this.$ = {"expr": "minus", "left":$$[$0-2], "right": $$[$0]}; 
break;
case 18: this.$ = {"expr": "mult", "left":$$[$0-2], "right": $$[$0]}; 
break;
case 19: this.$ = {"expr": "div", "left":$$[$0-2], "right": $$[$0]}; 
break;
case 20: this.$ = {"expr": "mod", "left":$$[$0-2], "right": $$[$0]}; 
break;
case 21: this.$ = {"expr": "uminus", "val":$$[$0-1]}; 
break;
case 22: this.$ = {"expr": "union", "left":$$[$0-2], "right": $$[$0]}; 
break;
case 23: this.$ = {"expr": "func_call", "args": $$[$0-1], "random": foo()}; 
break;
case 24: this.$ = {"expr": "func_call", "args": []}; 
break;
case 25: var args = $$[$0-2];
                                      args.push($$[$0]);
                                      this.$ = args; 
break;
case 26: this.$ = [$$[$0]]; 
break;
case 28: this.$ = $$[$0-2]; 
break;
case 29: this.$ = $$[$0]; 
break;
case 30: var path = $$[$0];
                                              path.type = "abs";
                                              this.$ = path; 
break;
case 31: this.$ = "new XPathPathExpr(XPathPathExpr.INIT_CONTEXT_ROOT, getStepArr(Vprepend(rlp, XPathStep.ABBR_DESCENDANTS())))"; 
break;
case 32: this.$ = {"expr": "loc_path", "type": "abs", "steps": []}; 
break;
case 33: this.$ = {"expr": "loc_path", "type": "rel", "steps": [$$[$0]]}; 
break;
case 34: var path = $$[$0-2];
                                            path.steps.push($$[$0]);
                                            this.$ = path; 
break;
case 35: this.$ = "Vappend(Vappend(rlp, XPathStep.ABBR_DESCENDANTS()), s)"; 
break;
case 36: this.$ = $$[$0]; 
break;
case 37: this.$ = {"expr": "step", "val": {"expr": "node_test", "class": "SELF"}}; 
break;
case 38: this.$ = {"expr": "step", "val": {"expr": "node_test", "class": "PARENT"}}; 
break;
case 39: var step = $$[$0-1];
                                            step.predicate = $$[$0];
                                            this.$ = step; 
break;
case 40: this.$ = $$[$0]; 
break;
case 41: this.$ = {"expr": "step", "val": $$[$0]}; 
break;
case 42: this.$ = {"expr": "step", "axis": $$[$0-1], "val": $$[$0]}; 
break;
case 43: this.$ = validateAxisName($$[$0-1]); 
break;
case 44: this.$ = XPathAxisEnum.ATTRIBUTE; 
break;
case 45: this.$ = {"type": "node_test", "class": "NAME", "val": $$[$0]}; 
break;
case 46: this.$ = {"type": "node_test", "class": "WILDCARD"}; 
break;
case 47: this.$ = {"type": "node_test", "class": "NSWILDCARD"}; 
break;
case 48: this.$ = {"type": "node_test", "class": "NODE"}; 
break;
case 49: this.$ = {"type": "node_test", "class": "TEXT"}; 
break;
case 50: this.$ = {"type": "node_test", "class": "COMMENT"}; 
break;
case 51: this.$ = {"type": "node_test", "class": "PROCESSING_INSTRUCTION", "val": $$[$0-1]}; 
break;
case 52: this.$ = new XPathStringLiteral($$[$0]); 
break;
case 53: this.$ = new XPathNumericLiteral(Number($$[$0])); 
break;
}
},
table: [{3:1,4:2,6:3,7:4,8:5,9:[1,6],11:7,12:[1,8],13:9,22:[1,10],27:[1,12],30:11,34:15,35:[1,16],36:[1,17],37:18,38:19,39:[1,20],40:[1,21],41:22,42:23,43:24,45:[1,31],46:[1,25],47:[1,26],48:[1,27],49:[1,28],50:[1,29],51:[1,30],52:[1,13],53:[1,14]},{1:[3]},{5:[1,32],14:[1,33],15:[1,34],16:[1,35],17:[1,36],18:[1,37],19:[1,38],20:[1,39],21:[1,40],22:[1,41],23:[1,42],24:[1,43],25:[1,44],26:[1,45]},{5:[2,2],10:[2,2],14:[2,2],15:[2,2],16:[2,2],17:[2,2],18:[2,2],19:[2,2],20:[2,2],21:[2,2],22:[2,2],23:[2,2],24:[2,2],25:[2,2],26:[2,2],29:[2,2],33:[2,2]},{5:[2,3],10:[2,3],14:[2,3],15:[2,3],16:[2,3],17:[2,3],18:[2,3],19:[2,3],20:[2,3],21:[2,3],22:[2,3],23:[2,3],24:[2,3],25:[2,3],26:[2,3],29:[2,3],33:[2,3]},{5:[2,4],10:[2,4],14:[2,4],15:[2,4],16:[2,4],17:[2,4],18:[2,4],19:[2,4],20:[2,4],21:[2,4],22:[2,4],23:[2,4],24:[2,4],25:[2,4],26:[2,4],29:[2,4],33:[2,4]},{4:46,6:3,7:4,8:5,9:[1,6],11:7,12:[1,8],13:9,22:[1,10],27:[1,12],30:11,34:15,35:[1,16],36:[1,17],37:18,38:19,39:[1,20],40:[1,21],41:22,42:23,43:24,45:[1,31],46:[1,25],47:[1,26],48:[1,27],49:[1,28],50:[1,29],51:[1,30],52:[1,13],53:[1,14]},{5:[2,6],10:[2,6],14:[2,6],15:[2,6],16:[2,6],17:[2,6],18:[2,6],19:[2,6],20:[2,6],21:[2,6],22:[2,6],23:[2,6],24:[2,6],25:[2,6],26:[2,6],29:[2,6],33:[2,6]},{5:[2,7],10:[2,7],14:[2,7],15:[2,7],16:[2,7],17:[2,7],18:[2,7],19:[2,7],20:[2,7],21:[2,7],22:[2,7],23:[2,7],24:[2,7],25:[2,7],26:[2,7],29:[2,7],33:[2,7]},{5:[2,8],10:[2,8],14:[2,8],15:[2,8],16:[2,8],17:[2,8],18:[2,8],19:[2,8],20:[2,8],21:[2,8],22:[2,8],23:[2,8],24:[2,8],25:[2,8],26:[2,8],29:[2,8],33:[2,8]},{4:47,6:3,7:4,8:5,9:[1,6],11:7,12:[1,8],13:9,22:[1,10],27:[1,12],30:11,34:15,35:[1,16],36:[1,17],37:18,38:19,39:[1,20],40:[1,21],41:22,42:23,43:24,45:[1,31],46:[1,25],47:[1,26],48:[1,27],49:[1,28],50:[1,29],51:[1,30],52:[1,13],53:[1,14]},{5:[2,27],10:[2,27],14:[2,27],15:[2,27],16:[2,27],17:[2,27],18:[2,27],19:[2,27],20:[2,27],21:[2,27],22:[2,27],23:[2,27],24:[2,27],25:[2,27],26:[2,27],29:[2,27],33:[2,27]},{5:[2,45],9:[1,48],10:[2,45],14:[2,45],15:[2,45],16:[2,45],17:[2,45],18:[2,45],19:[2,45],20:[2,45],21:[2,45],22:[2,45],23:[2,45],24:[2,45],25:[2,45],26:[2,45],29:[2,45],32:[2,45],33:[2,45],35:[2,45],36:[2,45],44:[1,49]},{5:[2,52],10:[2,52],14:[2,52],15:[2,52],16:[2,52],17:[2,52],18:[2,52],19:[2,52],20:[2,52],21:[2,52],22:[2,52],23:[2,52],24:[2,52],25:[2,52],26:[2,52],29:[2,52],33:[2,52]},{5:[2,53],10:[2,53],14:[2,53],15:[2,53],16:[2,53],17:[2,53],18:[2,53],19:[2,53],20:[2,53],21:[2,53],22:[2,53],23:[2,53],24:[2,53],25:[2,53],26:[2,53],29:[2,53],33:[2,53]},{5:[2,29],10:[2,29],14:[2,29],15:[2,29],16:[2,29],17:[2,29],18:[2,29],19:[2,29],20:[2,29],21:[2,29],22:[2,29],23:[2,29],24:[2,29],25:[2,29],26:[2,29],29:[2,29],33:[2,29],35:[1,50],36:[1,51]},{5:[2,32],10:[2,32],14:[2,32],15:[2,32],16:[2,32],17:[2,32],18:[2,32],19:[2,32],20:[2,32],21:[2,32],22:[2,32],23:[2,32],24:[2,32],25:[2,32],26:[2,32],27:[1,53],29:[2,32],33:[2,32],34:52,37:18,38:19,39:[1,20],40:[1,21],41:22,42:23,43:24,45:[1,31],46:[1,25],47:[1,26],48:[1,27],49:[1,28],50:[1,29],51:[1,30]},{27:[1,53],34:54,37:18,38:19,39:[1,20],40:[1,21],41:22,42:23,43:24,45:[1,31],46:[1,25],47:[1,26],48:[1,27],49:[1,28],50:[1,29],51:[1,30]},{5:[2,33],10:[2,33],14:[2,33],15:[2,33],16:[2,33],17:[2,33],18:[2,33],19:[2,33],20:[2,33],21:[2,33],22:[2,33],23:[2,33],24:[2,33],25:[2,33],26:[2,33],29:[2,33],33:[2,33],35:[2,33],36:[2,33]},{5:[2,36],10:[2,36],14:[2,36],15:[2,36],16:[2,36],17:[2,36],18:[2,36],19:[2,36],20:[2,36],21:[2,36],22:[2,36],23:[2,36],24:[2,36],25:[2,36],26:[2,36],29:[2,36],31:55,32:[1,56],33:[2,36],35:[2,36],36:[2,36]},{5:[2,37],10:[2,37],14:[2,37],15:[2,37],16:[2,37],17:[2,37],18:[2,37],19:[2,37],20:[2,37],21:[2,37],22:[2,37],23:[2,37],24:[2,37],25:[2,37],26:[2,37],29:[2,37],33:[2,37],35:[2,37],36:[2,37]},{5:[2,38],10:[2,38],14:[2,38],15:[2,38],16:[2,38],17:[2,38],18:[2,38],19:[2,38],20:[2,38],21:[2,38],22:[2,38],23:[2,38],24:[2,38],25:[2,38],26:[2,38],29:[2,38],33:[2,38],35:[2,38],36:[2,38]},{5:[2,40],10:[2,40],14:[2,40],15:[2,40],16:[2,40],17:[2,40],18:[2,40],19:[2,40],20:[2,40],21:[2,40],22:[2,40],23:[2,40],24:[2,40],25:[2,40],26:[2,40],29:[2,40],32:[2,40],33:[2,40],35:[2,40],36:[2,40]},{5:[2,41],10:[2,41],14:[2,41],15:[2,41],16:[2,41],17:[2,41],18:[2,41],19:[2,41],20:[2,41],21:[2,41],22:[2,41],23:[2,41],24:[2,41],25:[2,41],26:[2,41],29:[2,41],32:[2,41],33:[2,41],35:[2,41],36:[2,41]},{27:[1,58],42:57,46:[1,25],47:[1,26],48:[1,27],49:[1,28],50:[1,29],51:[1,30]},{5:[2,46],10:[2,46],14:[2,46],15:[2,46],16:[2,46],17:[2,46],18:[2,46],19:[2,46],20:[2,46],21:[2,46],22:[2,46],23:[2,46],24:[2,46],25:[2,46],26:[2,46],29:[2,46],32:[2,46],33:[2,46],35:[2,46],36:[2,46]},{5:[2,47],10:[2,47],14:[2,47],15:[2,47],16:[2,47],17:[2,47],18:[2,47],19:[2,47],20:[2,47],21:[2,47],22:[2,47],23:[2,47],24:[2,47],25:[2,47],26:[2,47],29:[2,47],32:[2,47],33:[2,47],35:[2,47],36:[2,47]},{9:[1,59]},{9:[1,60]},{9:[1,61]},{9:[1,62]},{27:[2,44],46:[2,44],47:[2,44],48:[2,44],49:[2,44],50:[2,44],51:[2,44]},{1:[2,1]},{4:63,6:3,7:4,8:5,9:[1,6],11:7,12:[1,8],13:9,22:[1,10],27:[1,12],30:11,34:15,35:[1,16],36:[1,17],37:18,38:19,39:[1,20],40:[1,21],41:22,42:23,43:24,45:[1,31],46:[1,25],47:[1,26],48:[1,27],49:[1,28],50:[1,29],51:[1,30],52:[1,13],53:[1,14]},{4:64,6:3,7:4,8:5,9:[1,6],11:7,12:[1,8],13:9,22:[1,10],27:[1,12],30:11,34:15,35:[1,16],36:[1,17],37:18,38:19,39:[1,20],40:[1,21],41:22,42:23,43:24,45:[1,31],46:[1,25],47:[1,26],48:[1,27],49:[1,28],50:[1,29],51:[1,30],52:[1,13],53:[1,14]},{4:65,6:3,7:4,8:5,9:[1,6],11:7,12:[1,8],13:9,22:[1,10],27:[1,12],30:11,34:15,35:[1,16],36:[1,17],37:18,38:19,39:[1,20],40:[1,21],41:22,42:23,43:24,45:[1,31],46:[1,25],47:[1,26],48:[1,27],49:[1,28],50:[1,29],51:[1,30],52:[1,13],53:[1,14]},{4:66,6:3,7:4,8:5,9:[1,6],11:7,12:[1,8],13:9,22:[1,10],27:[1,12],30:11,34:15,35:[1,16],36:[1,17],37:18,38:19,39:[1,20],40:[1,21],41:22,42:23,43:24,45:[1,31],46:[1,25],47:[1,26],48:[1,27],49:[1,28],50:[1,29],51:[1,30],52:[1,13],53:[1,14]},{4:67,6:3,7:4,8:5,9:[1,6],11:7,12:[1,8],13:9,22:[1,10],27:[1,12],30:11,34:15,35:[1,16],36:[1,17],37:18,38:19,39:[1,20],40:[1,21],41:22,42:23,43:24,45:[1,31],46:[1,25],47:[1,26],48:[1,27],49:[1,28],50:[1,29],51:[1,30],52:[1,13],53:[1,14]},{4:68,6:3,7:4,8:5,9:[1,6],11:7,12:[1,8],13:9,22:[1,10],27:[1,12],30:11,34:15,35:[1,16],36:[1,17],37:18,38:19,39:[1,20],40:[1,21],41:22,42:23,43:24,45:[1,31],46:[1,25],47:[1,26],48:[1,27],49:[1,28],50:[1,29],51:[1,30],52:[1,13],53:[1,14]},{4:69,6:3,7:4,8:5,9:[1,6],11:7,12:[1,8],13:9,22:[1,10],27:[1,12],30:11,34:15,35:[1,16],36:[1,17],37:18,38:19,39:[1,20],40:[1,21],41:22,42:23,43:24,45:[1,31],46:[1,25],47:[1,26],48:[1,27],49:[1,28],50:[1,29],51:[1,30],52:[1,13],53:[1,14]},{4:70,6:3,7:4,8:5,9:[1,6],11:7,12:[1,8],13:9,22:[1,10],27:[1,12],30:11,34:15,35:[1,16],36:[1,17],37:18,38:19,39:[1,20],40:[1,21],41:22,42:23,43:24,45:[1,31],46:[1,25],47:[1,26],48:[1,27],49:[1,28],50:[1,29],51:[1,30],52:[1,13],53:[1,14]},{4:71,6:3,7:4,8:5,9:[1,6],11:7,12:[1,8],13:9,22:[1,10],27:[1,12],30:11,34:15,35:[1,16],36:[1,17],37:18,38:19,39:[1,20],40:[1,21],41:22,42:23,43:24,45:[1,31],46:[1,25],47:[1,26],48:[1,27],49:[1,28],50:[1,29],51:[1,30],52:[1,13],53:[1,14]},{4:72,6:3,7:4,8:5,9:[1,6],11:7,12:[1,8],13:9,22:[1,10],27:[1,12],30:11,34:15,35:[1,16],36:[1,17],37:18,38:19,39:[1,20],40:[1,21],41:22,42:23,43:24,45:[1,31],46:[1,25],47:[1,26],48:[1,27],49:[1,28],50:[1,29],51:[1,30],52:[1,13],53:[1,14]},{4:73,6:3,7:4,8:5,9:[1,6],11:7,12:[1,8],13:9,22:[1,10],27:[1,12],30:11,34:15,35:[1,16],36:[1,17],37:18,38:19,39:[1,20],40:[1,21],41:22,42:23,43:24,45:[1,31],46:[1,25],47:[1,26],48:[1,27],49:[1,28],50:[1,29],51:[1,30],52:[1,13],53:[1,14]},{4:74,6:3,7:4,8:5,9:[1,6],11:7,12:[1,8],13:9,22:[1,10],27:[1,12],30:11,34:15,35:[1,16],36:[1,17],37:18,38:19,39:[1,20],40:[1,21],41:22,42:23,43:24,45:[1,31],46:[1,25],47:[1,26],48:[1,27],49:[1,28],50:[1,29],51:[1,30],52:[1,13],53:[1,14]},{4:75,6:3,7:4,8:5,9:[1,6],11:7,12:[1,8],13:9,22:[1,10],27:[1,12],30:11,34:15,35:[1,16],36:[1,17],37:18,38:19,39:[1,20],40:[1,21],41:22,42:23,43:24,45:[1,31],46:[1,25],47:[1,26],48:[1,27],49:[1,28],50:[1,29],51:[1,30],52:[1,13],53:[1,14]},{10:[1,76],14:[1,33],15:[1,34],16:[1,35],17:[1,36],18:[1,37],19:[1,38],20:[1,39],21:[1,40],22:[1,41],23:[1,42],24:[1,43],25:[1,44],26:[1,45]},{5:[2,21],10:[2,21],14:[2,21],15:[2,21],16:[2,21],17:[2,21],18:[2,21],19:[2,21],20:[2,21],21:[2,21],22:[2,21],23:[2,21],24:[2,21],25:[2,21],26:[1,45],29:[2,21],33:[2,21]},{4:79,6:3,7:4,8:5,9:[1,6],10:[1,78],11:7,12:[1,8],13:9,22:[1,10],27:[1,12],28:77,30:11,34:15,35:[1,16],36:[1,17],37:18,38:19,39:[1,20],40:[1,21],41:22,42:23,43:24,45:[1,31],46:[1,25],47:[1,26],48:[1,27],49:[1,28],50:[1,29],51:[1,30],52:[1,13],53:[1,14]},{27:[2,43],46:[2,43],47:[2,43],48:[2,43],49:[2,43],50:[2,43],51:[2,43]},{27:[1,53],37:80,38:19,39:[1,20],40:[1,21],41:22,42:23,43:24,45:[1,31],46:[1,25],47:[1,26],48:[1,27],49:[1,28],50:[1,29],51:[1,30]},{27:[1,53],37:81,38:19,39:[1,20],40:[1,21],41:22,42:23,43:24,45:[1,31],46:[1,25],47:[1,26],48:[1,27],49:[1,28],50:[1,29],51:[1,30]},{5:[2,30],10:[2,30],14:[2,30],15:[2,30],16:[2,30],17:[2,30],18:[2,30],19:[2,30],20:[2,30],21:[2,30],22:[2,30],23:[2,30],24:[2,30],25:[2,30],26:[2,30],29:[2,30],33:[2,30],35:[1,50],36:[1,51]},{5:[2,45],10:[2,45],14:[2,45],15:[2,45],16:[2,45],17:[2,45],18:[2,45],19:[2,45],20:[2,45],21:[2,45],22:[2,45],23:[2,45],24:[2,45],25:[2,45],26:[2,45],29:[2,45],32:[2,45],33:[2,45],35:[2,45],36:[2,45],44:[1,49]},{5:[2,31],10:[2,31],14:[2,31],15:[2,31],16:[2,31],17:[2,31],18:[2,31],19:[2,31],20:[2,31],21:[2,31],22:[2,31],23:[2,31],24:[2,31],25:[2,31],26:[2,31],29:[2,31],33:[2,31],35:[1,50],36:[1,51]},{5:[2,39],10:[2,39],14:[2,39],15:[2,39],16:[2,39],17:[2,39],18:[2,39],19:[2,39],20:[2,39],21:[2,39],22:[2,39],23:[2,39],24:[2,39],25:[2,39],26:[2,39],29:[2,39],32:[2,39],33:[2,39],35:[2,39],36:[2,39]},{4:82,6:3,7:4,8:5,9:[1,6],11:7,12:[1,8],13:9,22:[1,10],27:[1,12],30:11,34:15,35:[1,16],36:[1,17],37:18,38:19,39:[1,20],40:[1,21],41:22,42:23,43:24,45:[1,31],46:[1,25],47:[1,26],48:[1,27],49:[1,28],50:[1,29],51:[1,30],52:[1,13],53:[1,14]},{5:[2,42],10:[2,42],14:[2,42],15:[2,42],16:[2,42],17:[2,42],18:[2,42],19:[2,42],20:[2,42],21:[2,42],22:[2,42],23:[2,42],24:[2,42],25:[2,42],26:[2,42],29:[2,42],32:[2,42],33:[2,42],35:[2,42],36:[2,42]},{5:[2,45],10:[2,45],14:[2,45],15:[2,45],16:[2,45],17:[2,45],18:[2,45],19:[2,45],20:[2,45],21:[2,45],22:[2,45],23:[2,45],24:[2,45],25:[2,45],26:[2,45],29:[2,45],32:[2,45],33:[2,45],35:[2,45],36:[2,45]},{10:[1,83]},{10:[1,84]},{10:[1,85]},{52:[1,86]},{5:[2,9],10:[2,9],14:[1,33],15:[1,34],16:[1,35],17:[1,36],18:[1,37],19:[1,38],20:[1,39],21:[1,40],22:[1,41],23:[1,42],24:[1,43],25:[1,44],26:[1,45],29:[2,9],33:[2,9]},{5:[2,10],10:[2,10],14:[2,10],15:[1,34],16:[1,35],17:[1,36],18:[1,37],19:[1,38],20:[1,39],21:[1,40],22:[1,41],23:[1,42],24:[1,43],25:[1,44],26:[1,45],29:[2,10],33:[2,10]},{5:[2,11],10:[2,11],14:[2,11],15:[2,11],16:[2,11],17:[2,11],18:[1,37],19:[1,38],20:[1,39],21:[1,40],22:[1,41],23:[1,42],24:[1,43],25:[1,44],26:[1,45],29:[2,11],33:[2,11]},{5:[2,12],10:[2,12],14:[2,12],15:[2,12],16:[2,12],17:[2,12],18:[1,37],19:[1,38],20:[1,39],21:[1,40],22:[1,41],23:[1,42],24:[1,43],25:[1,44],26:[1,45],29:[2,12],33:[2,12]},{5:[2,13],10:[2,13],14:[2,13],15:[2,13],16:[2,13],17:[2,13],18:[2,13],19:[2,13],20:[2,13],21:[1,40],22:[1,41],23:[1,42],24:[1,43],25:[1,44],26:[1,45],29:[2,13],33:[2,13]},{5:[2,14],10:[2,14],14:[2,14],15:[2,14],16:[2,14],17:[2,14],18:[2,14],19:[2,14],20:[2,14],21:[1,40],22:[1,41],23:[1,42],24:[1,43],25:[1,44],26:[1,45],29:[2,14],33:[2,14]},{5:[2,15],10:[2,15],14:[2,15],15:[2,15],16:[2,15],17:[2,15],18:[2,15],19:[2,15],20:[2,15],21:[1,40],22:[1,41],23:[1,42],24:[1,43],25:[1,44],26:[1,45],29:[2,15],33:[2,15]},{5:[2,16],10:[2,16],14:[2,16],15:[2,16],16:[2,16],17:[2,16],18:[2,16],19:[2,16],20:[2,16],21:[2,16],22:[2,16],23:[1,42],24:[1,43],25:[1,44],26:[1,45],29:[2,16],33:[2,16]},{5:[2,17],10:[2,17],14:[2,17],15:[2,17],16:[2,17],17:[2,17],18:[2,17],19:[2,17],20:[2,17],21:[2,17],22:[2,17],23:[1,42],24:[1,43],25:[1,44],26:[1,45],29:[2,17],33:[2,17]},{5:[2,18],10:[2,18],14:[2,18],15:[2,18],16:[2,18],17:[2,18],18:[2,18],19:[2,18],20:[2,18],21:[2,18],22:[2,18],23:[2,18],24:[2,18],25:[2,18],26:[1,45],29:[2,18],33:[2,18]},{5:[2,19],10:[2,19],14:[2,19],15:[2,19],16:[2,19],17:[2,19],18:[2,19],19:[2,19],20:[2,19],21:[2,19],22:[2,19],23:[2,19],24:[2,19],25:[2,19],26:[1,45],29:[2,19],33:[2,19]},{5:[2,20],10:[2,20],14:[2,20],15:[2,20],16:[2,20],17:[2,20],18:[2,20],19:[2,20],20:[2,20],21:[2,20],22:[2,20],23:[2,20],24:[2,20],25:[2,20],26:[1,45],29:[2,20],33:[2,20]},{5:[2,22],10:[2,22],14:[2,22],15:[2,22],16:[2,22],17:[2,22],18:[2,22],19:[2,22],20:[2,22],21:[2,22],22:[2,22],23:[2,22],24:[2,22],25:[2,22],26:[2,22],29:[2,22],33:[2,22]},{5:[2,5],10:[2,5],14:[2,5],15:[2,5],16:[2,5],17:[2,5],18:[2,5],19:[2,5],20:[2,5],21:[2,5],22:[2,5],23:[2,5],24:[2,5],25:[2,5],26:[2,5],29:[2,5],33:[2,5]},{10:[1,87],29:[1,88]},{5:[2,24],10:[2,24],14:[2,24],15:[2,24],16:[2,24],17:[2,24],18:[2,24],19:[2,24],20:[2,24],21:[2,24],22:[2,24],23:[2,24],24:[2,24],25:[2,24],26:[2,24],29:[2,24],33:[2,24]},{10:[2,26],14:[1,33],15:[1,34],16:[1,35],17:[1,36],18:[1,37],19:[1,38],20:[1,39],21:[1,40],22:[1,41],23:[1,42],24:[1,43],25:[1,44],26:[1,45],29:[2,26]},{5:[2,34],10:[2,34],14:[2,34],15:[2,34],16:[2,34],17:[2,34],18:[2,34],19:[2,34],20:[2,34],21:[2,34],22:[2,34],23:[2,34],24:[2,34],25:[2,34],26:[2,34],29:[2,34],33:[2,34],35:[2,34],36:[2,34]},{5:[2,35],10:[2,35],14:[2,35],15:[2,35],16:[2,35],17:[2,35],18:[2,35],19:[2,35],20:[2,35],21:[2,35],22:[2,35],23:[2,35],24:[2,35],25:[2,35],26:[2,35],29:[2,35],33:[2,35],35:[2,35],36:[2,35]},{14:[1,33],15:[1,34],16:[1,35],17:[1,36],18:[1,37],19:[1,38],20:[1,39],21:[1,40],22:[1,41],23:[1,42],24:[1,43],25:[1,44],26:[1,45],33:[1,89]},{5:[2,48],10:[2,48],14:[2,48],15:[2,48],16:[2,48],17:[2,48],18:[2,48],19:[2,48],20:[2,48],21:[2,48],22:[2,48],23:[2,48],24:[2,48],25:[2,48],26:[2,48],29:[2,48],32:[2,48],33:[2,48],35:[2,48],36:[2,48]},{5:[2,49],10:[2,49],14:[2,49],15:[2,49],16:[2,49],17:[2,49],18:[2,49],19:[2,49],20:[2,49],21:[2,49],22:[2,49],23:[2,49],24:[2,49],25:[2,49],26:[2,49],29:[2,49],32:[2,49],33:[2,49],35:[2,49],36:[2,49]},{5:[2,50],10:[2,50],14:[2,50],15:[2,50],16:[2,50],17:[2,50],18:[2,50],19:[2,50],20:[2,50],21:[2,50],22:[2,50],23:[2,50],24:[2,50],25:[2,50],26:[2,50],29:[2,50],32:[2,50],33:[2,50],35:[2,50],36:[2,50]},{10:[1,90]},{5:[2,23],10:[2,23],14:[2,23],15:[2,23],16:[2,23],17:[2,23],18:[2,23],19:[2,23],20:[2,23],21:[2,23],22:[2,23],23:[2,23],24:[2,23],25:[2,23],26:[2,23],29:[2,23],33:[2,23]},{4:91,6:3,7:4,8:5,9:[1,6],11:7,12:[1,8],13:9,22:[1,10],27:[1,12],30:11,34:15,35:[1,16],36:[1,17],37:18,38:19,39:[1,20],40:[1,21],41:22,42:23,43:24,45:[1,31],46:[1,25],47:[1,26],48:[1,27],49:[1,28],50:[1,29],51:[1,30],52:[1,13],53:[1,14]},{5:[2,28],10:[2,28],14:[2,28],15:[2,28],16:[2,28],17:[2,28],18:[2,28],19:[2,28],20:[2,28],21:[2,28],22:[2,28],23:[2,28],24:[2,28],25:[2,28],26:[2,28],29:[2,28],32:[2,28],33:[2,28],35:[2,28],36:[2,28]},{5:[2,51],10:[2,51],14:[2,51],15:[2,51],16:[2,51],17:[2,51],18:[2,51],19:[2,51],20:[2,51],21:[2,51],22:[2,51],23:[2,51],24:[2,51],25:[2,51],26:[2,51],29:[2,51],32:[2,51],33:[2,51],35:[2,51],36:[2,51]},{10:[2,25],14:[1,33],15:[1,34],16:[1,35],17:[1,36],18:[1,37],19:[1,38],20:[1,39],21:[1,40],22:[1,41],23:[1,42],24:[1,43],25:[1,44],26:[1,45],29:[2,25]}],
defaultActions: {32:[2,1]},
parseError: function parseError(str, hash) {
    throw new Error(str);
},
parse: function parse(input) {
    var self = this,
        stack = [0],
        vstack = [null], // semantic value stack
        lstack = [], // location stack
        table = this.table,
        yytext = '',
        yylineno = 0,
        yyleng = 0,
        recovering = 0,
        TERROR = 2,
        EOF = 1;

    //this.reductionCount = this.shiftCount = 0;

    this.lexer.setInput(input);
    this.lexer.yy = this.yy;
    this.yy.lexer = this.lexer;
    if (typeof this.lexer.yylloc == 'undefined')
        this.lexer.yylloc = {};
    var yyloc = this.lexer.yylloc;
    lstack.push(yyloc);

    if (typeof this.yy.parseError === 'function')
        this.parseError = this.yy.parseError;

    function popStack (n) {
        stack.length = stack.length - 2*n;
        vstack.length = vstack.length - n;
        lstack.length = lstack.length - n;
    }

    function lex() {
        var token;
        token = self.lexer.lex() || 1; // $end = 1
        // if token isn't its numeric value, convert
        if (typeof token !== 'number') {
            token = self.symbols_[token] || token;
        }
        return token;
    };

    var symbol, preErrorSymbol, state, action, a, r, yyval={},p,len,newState, expected;
    while (true) {
        // retreive state number from top of stack
        state = stack[stack.length-1];

        // use default actions if available
        if (this.defaultActions[state]) {
            action = this.defaultActions[state];
        } else {
            if (symbol == null)
                symbol = lex();
            // read action for current state and first input
            action = table[state] && table[state][symbol];
        }

        // handle parse error
        if (typeof action === 'undefined' || !action.length || !action[0]) {

            if (!recovering) {
                // Report error
                expected = [];
                for (p in table[state]) if (this.terminals_[p] && p > 2) {
                    expected.push("'"+this.terminals_[p]+"'");
                }
                var errStr = '';
                if (this.lexer.showPosition) {
                    errStr = 'Parse error on line '+(yylineno+1)+":\n"+this.lexer.showPosition()+'\nExpecting '+expected.join(', ');
                } else {
                    errStr = 'Parse error on line '+(yylineno+1)+": Unexpected " +
                                  (symbol == 1 /*EOF*/ ? "end of input" :
                                              ("'"+(this.terminals_[symbol] || symbol)+"'"));
                }
                this.parseError(errStr,
                    {text: this.lexer.match, token: this.terminals_[symbol] || symbol, line: this.lexer.yylineno, loc: yyloc, expected: expected});
            }

            // just recovered from another error
            if (recovering == 3) {
                if (symbol == EOF) {
                    throw new Error(errStr || 'Parsing halted.');
                }

                // discard current lookahead and grab another
                yyleng = this.lexer.yyleng;
                yytext = this.lexer.yytext;
                yylineno = this.lexer.yylineno;
                yyloc = this.lexer.yylloc;
                symbol = lex();
            }

            // try to recover from error
            while (1) {
                // check for error recovery rule in this state
                if ((TERROR.toString()) in table[state]) {
                    break;
                }
                if (state == 0) {
                    throw new Error(errStr || 'Parsing halted.');
                }
                popStack(1);
                state = stack[stack.length-1];
            }

            preErrorSymbol = symbol; // save the lookahead token
            symbol = TERROR;         // insert generic error symbol as new lookahead
            state = stack[stack.length-1];
            action = table[state] && table[state][TERROR];
            recovering = 3; // allow 3 real symbols to be shifted before reporting a new error
        }

        // this shouldn't happen, unless resolve defaults are off
        if (action[0] instanceof Array && action.length > 1) {
            throw new Error('Parse Error: multiple actions possible at state: '+state+', token: '+symbol);
        }

        switch (action[0]) {

            case 1: // shift
                //this.shiftCount++;

                stack.push(symbol);
                vstack.push(this.lexer.yytext);
                lstack.push(this.lexer.yylloc);
                stack.push(action[1]); // push state
                symbol = null;
                if (!preErrorSymbol) { // normal execution/no error
                    yyleng = this.lexer.yyleng;
                    yytext = this.lexer.yytext;
                    yylineno = this.lexer.yylineno;
                    yyloc = this.lexer.yylloc;
                    if (recovering > 0)
                        recovering--;
                } else { // error just occurred, resume old lookahead f/ before error
                    symbol = preErrorSymbol;
                    preErrorSymbol = null;
                }
                break;

            case 2: // reduce
                //this.reductionCount++;

                len = this.productions_[action[1]][1];

                // perform semantic action
                yyval.$ = vstack[vstack.length-len]; // default to $$ = $1
                // default location, uses first token for firsts, last for lasts
                yyval._$ = {
                    first_line: lstack[lstack.length-(len||1)].first_line,
                    last_line: lstack[lstack.length-1].last_line,
                    first_column: lstack[lstack.length-(len||1)].first_column,
                    last_column: lstack[lstack.length-1].last_column
                };
                r = this.performAction.call(yyval, yytext, yyleng, yylineno, this.yy, action[1], vstack, lstack);

                if (typeof r !== 'undefined') {
                    return r;
                }

                // pop off stack
                if (len) {
                    stack = stack.slice(0,-1*len*2);
                    vstack = vstack.slice(0, -1*len);
                    lstack = lstack.slice(0, -1*len);
                }

                stack.push(this.productions_[action[1]][0]);    // push nonterminal (reduce)
                vstack.push(yyval.$);
                lstack.push(yyval._$);
                // goto new state = table[STATE][NONTERMINAL]
                newState = table[stack[stack.length-2]][stack[stack.length-1]];
                stack.push(newState);
                break;

            case 3: // accept
                return true;
        }

    }

    return true;
}};/* Jison generated lexer */
var lexer = (function(){

var lexer = ({EOF:1,
parseError:function parseError(str, hash) {
        if (this.yy.parseError) {
            this.yy.parseError(str, hash);
        } else {
            throw new Error(str);
        }
    },
setInput:function (input) {
        this._input = input;
        this._more = this._less = this.done = false;
        this.yylineno = this.yyleng = 0;
        this.yytext = this.matched = this.match = '';
        this.conditionStack = ['INITIAL'];
        this.yylloc = {first_line:1,first_column:0,last_line:1,last_column:0};
        return this;
    },
input:function () {
        var ch = this._input[0];
        this.yytext+=ch;
        this.yyleng++;
        this.match+=ch;
        this.matched+=ch;
        var lines = ch.match(/\n/);
        if (lines) this.yylineno++;
        this._input = this._input.slice(1);
        return ch;
    },
unput:function (ch) {
        this._input = ch + this._input;
        return this;
    },
more:function () {
        this._more = true;
        return this;
    },
pastInput:function () {
        var past = this.matched.substr(0, this.matched.length - this.match.length);
        return (past.length > 20 ? '...':'') + past.substr(-20).replace(/\n/g, "");
    },
upcomingInput:function () {
        var next = this.match;
        if (next.length < 20) {
            next += this._input.substr(0, 20-next.length);
        }
        return (next.substr(0,20)+(next.length > 20 ? '...':'')).replace(/\n/g, "");
    },
showPosition:function () {
        var pre = this.pastInput();
        var c = new Array(pre.length + 1).join("-");
        return pre + this.upcomingInput() + "\n" + c+"^";
    },
next:function () {
        if (this.done) {
            return this.EOF;
        }
        if (!this._input) this.done = true;

        var token,
            match,
            col,
            lines;
        if (!this._more) {
            this.yytext = '';
            this.match = '';
        }
        var rules = this._currentRules();
        for (var i=0;i < rules.length; i++) {
            match = this._input.match(this.rules[rules[i]]);
            if (match) {
                lines = match[0].match(/\n.*/g);
                if (lines) this.yylineno += lines.length;
                this.yylloc = {first_line: this.yylloc.last_line,
                               last_line: this.yylineno+1,
                               first_column: this.yylloc.last_column,
                               last_column: lines ? lines[lines.length-1].length-1 : this.yylloc.last_column + match[0].length}
                this.yytext += match[0];
                this.match += match[0];
                this.matches = match;
                this.yyleng = this.yytext.length;
                this._more = false;
                this._input = this._input.slice(match[0].length);
                this.matched += match[0];
                token = this.performAction.call(this, this.yy, this, rules[i],this.conditionStack[this.conditionStack.length-1]);
                if (token) return token;
                else return;
            }
        }
        if (this._input === "") {
            return this.EOF;
        } else {
            this.parseError('Lexical error on line '+(this.yylineno+1)+'. Unrecognized text.\n'+this.showPosition(), 
                    {text: "", token: null, line: this.yylineno});
        }
    },
lex:function lex() {
        var r = this.next();
        if (typeof r !== 'undefined') {
            return r;
        } else {
            return this.lex();
        }
    },
begin:function begin(condition) {
        this.conditionStack.push(condition);
    },
popState:function popState() {
        return this.conditionStack.pop();
    },
_currentRules:function _currentRules() {
        return this.conditions[this.conditionStack[this.conditionStack.length-1]].rules;
    }});
lexer.performAction = function anonymous(yy,yy_,$avoiding_name_collisions,YY_START) {

var YYSTATE=YY_START
switch($avoiding_name_collisions) {
case 0: this.begin("OP_CONTEXT"); return "WILDCARD"; 
break;
case 1: this.begin("OP_CONTEXT"); return "QNAME"; 
break;
case 2: this.begin("OP_CONTEXT"); return "NSWILDCARD"; 
break;
case 3: this.begin("VAL_CONTEXT"); return "MULT"; 
break;
case 4: this.begin("VAL_CONTEXT"); return "AND"; 
break;
case 5: this.begin("VAL_CONTEXT"); return "OR"; 
break;
case 6: this.begin("VAL_CONTEXT"); return "DIV"; 
break;
case 7: this.begin("VAL_CONTEXT"); return "MOD"; 
break;
case 8: this.begin("VAL_CONTEXT"); return "EQ"; 
break;
case 9: this.begin("VAL_CONTEXT"); return "NEQ"; 
break;
case 10: this.begin("VAL_CONTEXT"); return "LT"; 
break;
case 11: this.begin("VAL_CONTEXT"); return "GT"; 
break;
case 12: this.begin("VAL_CONTEXT"); return "LTE"; 
break;
case 13: this.begin("VAL_CONTEXT"); return "GTE"; 
break;
case 14: this.begin("VAL_CONTEXT"); return "PLUS"; 
break;
case 15: this.begin("VAL_CONTEXT"); return "MINUS"; 
break;
case 16: this.begin("VAL_CONTEXT"); return "UNION"; 
break;
case 17: this.begin("VAL_CONTEXT"); return "SLASH"; 
break;
case 18: this.begin("VAL_CONTEXT"); return "DBL_SLASH"; 
break;
case 19: this.begin("VAL_CONTEXT"); return "LBRACK"; 
break;
case 20: this.begin("OP_CONTEXT");  return "RBRACK"; 
break;
case 21: this.begin("VAL_CONTEXT"); return "LPAREN"; 
break;
case 22: this.begin("OP_CONTEXT");  return "RPAREN"; 
break;
case 23: this.begin("OP_CONTEXT");  return "DOT"; 
break;
case 24: this.begin("OP_CONTEXT");  return "DBL_DOT"; 
break;
case 25: this.begin("VAL_CONTEXT"); return "AT"; 
break;
case 26: this.begin("VAL_CONTEXT"); return "DBL_COLON"; 
break;
case 27: this.begin("VAL_CONTEXT"); return "COMMA"; 
break;
case 28: return "NODETYPE_NODE"; 
break;
case 29: return "NODETYPE_TEXT"; 
break;
case 30: return "NODETYPE_COMMENT"; 
break;
case 31: return "NODETYPE_PROCINSTR"; 
break;
case 32: this.begin("OP_CONTEXT"); return "VAR"; 
break;
case 33: this.begin("OP_CONTEXT"); return "NUM"; 
break;
case 34: this.begin("OP_CONTEXT"); yy_.yytext = yy_.yytext.substr(1,yy_.yyleng-2); return "STR"; 
break;
case 35:/* ignore whitespace */ 
break;
case 36:return 5;
break;
}
};
lexer.rules = [/^\*/,/^[A-Za-z_][A-Za-z0-9._-]*(:[A-Za-z_][A-Za-z0-9._-]*)?/,/^[A-Za-z_][A-Za-z0-9._-]*\*/,/^\*/,/^and\b/,/^or\b/,/^div\b/,/^mod\b/,/^=/,/^!=/,/^</,/^>/,/^<=/,/^>=/,/^\+/,/^-/,/^\|/,/^\//,/^\/\//,/^\[/,/^\]/,/^\(/,/^\)/,/^\./,/^\.\./,/^@/,/^::/,/^,/,/^node(?=\s+?)\(/,/^text(?=\s+?)\(/,/^comment(?=\s+?)\(/,/^processing-instruction(?=\s+?)\(/,/^\$[A-Za-z_][A-Za-z0-9._-]*(:[A-Za-z_][A-Za-z0-9._-]*)?/,/^[0-9]+(\.[0-9]*)?|\.[0-9]+/,/^"[^"\""]*"|\\'[^"\'"]*\\'/,/^\s+/,/^$/];
lexer.conditions = {"INITIAL":{"rules":[0,1,2,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36],"inclusive":true},"OP_CONTEXT":{"rules":[3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36],"inclusive":true},"VAL_CONTEXT":{"rules":[0,1,2,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36],"inclusive":true}};return lexer;})()
parser.lexer = lexer;
return parser;
})();
if (typeof require !== 'undefined' && typeof exports !== 'undefined') {
exports.parser = xpath;
exports.parse = function () { return xpath.parse.apply(xpath, arguments); }
exports.main = function commonjsMain(args) {
    if (!args[1])
        throw new Error('Usage: '+args[0]+' FILE');
    if (typeof process !== 'undefined') {
        var source = require('fs').readFileSync(require('path').join(process.cwd(), args[1]), "utf8");
    } else {
        var cwd = require("file").path(require("file").cwd());
        var source = cwd.join(args[1]).read({charset: "utf-8"});
    }
    return exports.parser.parse(source);
}
if (typeof module !== 'undefined' && require.main === module) {
  exports.main(typeof process !== 'undefined' ? process.argv.slice(1) : require("system").args);
}
}