
/* DON'T EDIT THIS FILE UNLESS YOU KNOW WHAT YOU'RE DOING */

/* This jison grammar file is based off of the javarosa grammar file which can be found here:
 * https://bitbucket.org/javarosa/javarosa/src/tip/core/src/org/javarosa/xpath/parser/xpath.grammar
 *
 * Also see the associated lex file:
 * https://bitbucket.org/javarosa/javarosa/src/tip/core/src/org/javarosa/xpath/parser/xpath.flex
 *
 * To build run:
 *   $ ./bin/jison xpath.jison xpath.jisonlex
 */



/* 
 *  TODO Code?
 */

%right OR
%right AND
%left EQ NEQ
%left LT LTE GT GTE
%left PLUS MINUS
%left MULT DIV MOD
%nonassoc UMINUS
%left UNION

%%

xpath_expr:  expr EOF   { return $1; }
    ;

 
expr:   base_expr                   {  $$ = $1; } /* not necessary as this is the default */
    |   op_expr                     {  $$ = $1; }
    |   path_expr                   {  $$ = $1; }
    ;

base_expr:  LPAREN expr RPAREN            { $$ = $2; }
        |   func_call                
        |   VAR                   
        |   literal               
        ;

op_expr: expr OR expr               { $$ = new XPathBoolExpr({"type": "or", "left": $1, "right": $3}); }
    |   expr AND expr               { $$ = new XPathBoolExpr({"type": "and", "left": $1, "right": $3}); }
    |   expr EQ expr                { $$ = new XPathEqExpr({"type": "eq", "left": $1, "right": $3}); }
    |   expr NEQ expr               { $$ = new XPathEqExpr({"type": "neq", "left": $1, "right": $3}); }
    |   expr LT expr                { $$ = new XPathCmpExpr({"type": "lt", "left":$1, "right": $3}); }
    |   expr LTE expr               { $$ = new XPathCmpExpr({"type": "lte", "left":$1, "right": $3}); }
    |   expr GT expr                { $$ = new XPathCmpExpr({"type": "gt", "left":$1, "right": $3}); }
    |   expr GTE expr               { $$ = new XPathCmpExpr({"type": "gte", "left":$1, "right": $3}); }
    |   expr PLUS expr              { $$ = new XPathArithExpr({"type": "plus", "left":$1, "right": $3}); }
    |   expr MINUS expr             { $$ = new XPathArithExpr({"type": "minus", "left":$1, "right": $3}); }
    |   expr MULT expr              { $$ = new XPathArithExpr({"type": "mult", "left":$1, "right": $3}); }
    |   expr DIV expr               { $$ = new XPathArithExpr({"type": "div", "left":$1, "right": $3}); }
    |   expr MOD expr               { $$ = new XPathArithExpr({"type": "mod", "left":$1, "right": $3}); }
    |   MINUS expr %prec UMINUS     { $$ = new XPathNumNegExpr({"type": "uminus", "val":$1}); }
    |   expr UNION expr             { $$ = new XPathUnionExpr({"type": "union", "left":$1, "right": $3}); } 
    ;

func_call:  QNAME LPAREN arg_list RPAREN   { $$ = new XPathFuncExpr({id: $1, args: $3}); } 
        |   QNAME LPAREN RPAREN            { $$ = new XPathFuncExpr({id: $1, args: []}); } 
        ;

arg_list:   arg_list COMMA expr     { var args = $1;
                                      args.push($3);
                                      $$ = args; }         
        |   expr                    { $$ = [$1]; }
        ;

path_expr:  loc_path
        ; 

/* This is commented out because there might be a bug in jison that thinks this is ambiguous
 * when in fact it's not. The first group belongs as part of the path_expr. The second should
 * be added as a new filter_expr.
 */

/*
        |   filter_expr SLASH rel_loc_path          { $$ = "fe.unwrapPathExpr(rlp)"; }
        |   filter_expr DBL_SLASH rel_loc_path      { $$ = "fe.unwrapPathExpr(Vprepend(rlp, XPathStep.ABBR_DESCENDANTS()))"; }
        ;

filter_expr:  filter_expr predicate     { $$ = "Vappend(fe.v, p); RESULT = fe;" }
|   base_expr                   { $$ = "new vectorWrapper(be);"; } ***** THIS IS THE LINE THAT BREAKS *****  
        ;
*/ 

predicate:   LBRACK expr RBRACK            { $$ = $1; }
        ;


loc_path:   rel_loc_path                    { $$ = new XPathPathExpr({initial_context: XPathInitialContextEnum.RELATIVE,
                                                                      steps: $1}); }
        |   SLASH rel_loc_path              { $$ = new XPathPathExpr({initial_context: XPathInitialContextEnum.ROOT,
                                                                      steps: $2}); }
        |   DBL_SLASH rel_loc_path          { var steps = $2;
                                              // insert descendant step into beginning
                                              steps.splice(0, 0, new XPathStep({axis: XPathAxisEnum.DESCENDANT, 
                                                                                test: XPathTestEnum.TYPE_NODE}));
                                              $$ = new XPathPathExpr({initial_context: XPathInitialContextEnum.ROOT,
                                                                      steps: steps}); }
        |   SLASH                   { $$ = new XPathPathExpr({initial_context: XPathInitialContextEnum.ROOT,
                                                              steps: []});}
        ;

rel_loc_path: step                        { $$ = [$1];}
        |   rel_loc_path SLASH step       { var path = $1;
                                            path.push($3);
                                            $$ = path; }
        |   rel_loc_path DBL_SLASH step   { var path = $1;
                                            path.push(new XPathStep({axis: XPathAxisEnum.DESCENDANT, 
                                                                     test: XPathTestEnum.TYPE_NODE}));
                                            path.push($3);
                                            $$ = path; }
        ;

step:   step_unabbr                 { $$ = $1; }
    |   DOT                         { $$ = new XPathStep({axis: XPathAxisEnum.SELF, 
                                                          test: XPathTestEnum.TYPE_NODE}); }
    |   DBL_DOT                     { $$ = new XPathStep({axis: XPathAxisEnum.PARENT, 
                                                          test: XPathTestEnum.TYPE_NODE}); }
    ;

step_unabbr:  step_unabbr predicate       { var step = $1;
                                            step.predicate = $2;
                                            $$ = step; }
        |   step_body                { $$ = $1; }
        ;

step_body: node_test                    { var nodeTest = $1; // temporary dict with appropriate args
                                          $$ = new XPathStep(nodeTest); }
        |   axis_specifier node_test    { var nodeTest = $1;  // temporary dict with appropriate args
                                          nodeTest.axis = $1; // add axis
                                          $$ = new XPathStep(nodeTest); }
        ;

axis_specifier:  QNAME DBL_COLON           { $$ = validateAxisName($1); }
        |   AT                  { $$ = XPathAxisEnum.ATTRIBUTE; }
        ;

node_test:  QNAME                 { $$ = {"test": XPathTestEnum.NAME, "name": $1}; }
        |   WILDCARD                { $$ = {"test": XPathTestEnum.NAME_WILDCARD}; }
        |   NSWILDCARD              { $$ = {"test": XPathTestEnum.NAMESPACE_WILDCARD}; }
        |   NODETYPE_NODE LPAREN RPAREN     { $$ = {"test": XPathTestEnum.TYPE_NODE}; }
        |   NODETYPE_TEXT LPAREN RPAREN     { $$ = {"test": XPathTestEnum.TYPE_TEXT}; }
        |   NODETYPE_COMMENT LPAREN RPAREN      { $$ = {"test": XPathTestEnum.TYPE_COMMENT}; }
        |   NODETYPE_PROCINSTR LPAREN STR RPAREN  { $$ = {"test": XPathTestEnum.TYPE_PROCESSING_INSTRUCTION, "literal": $3}; }
        ;

literal: STR                       { $$ = new XPathStringLiteral($1); }
    |   NUM                       { $$ = new XPathNumericLiteral(Number($1)); }
    ;
  