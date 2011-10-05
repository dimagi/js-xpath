
/* DON'T EDIT THIS FILE UNLESS YOU KNOW WHAT YOU'RE DOING */

/* This jison grammar file is based off of the javarosa grammar file which can be found here:
 * https://bitbucket.org/javarosa/javarosa/src/tip/core/src/org/javarosa/xpath/parser/xpath.grammar
 */

/* 
 *
 *  TODO Code
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

expr:   base_expr                   {  $$ = $1; } /* not necessary as this is the default */
    |   op_expr                     {  $$ = $1; }
    |   path_expr                   {  $$ = $1; }
    ;

base_expr:  LPAREN expr RPAREN            { $$ = $2; }
        |   func_call                
        |   VAR                   
        |   literal               
        ;

op_expr: expr OR expr               { $$ = {"expr": "or", "left": $1, "right": $3}; }
    |   expr AND expr               { $$ = {"expr": "and", "left": $1, "right": $3}; }
    |   expr EQ expr                { $$ = {"expr": "eq", "left": $1, "right": $3}; }
    |   expr NEQ expr               { $$ = {"expr": "neq", "left": $1, "right": $3}; }
    |   expr LTE expr               { $$ = {"expr": "lte", "left":$1, "right": $3}; }
    |   expr GT expr                { $$ = {"expr": "gt", "left":$1, "right": $3}; }
    |   expr GTE expr               { $$ = {"expr": "gte", "left":$1, "right": $3}; }
    |   expr PLUS expr              { $$ = {"expr": "plus", "left":$1, "right": $3}; }
    |   expr MINUS expr             { $$ = {"expr": "minus", "left":$1, "right": $3}; }
    |   expr MULT expr              { $$ = {"expr": "mult", "left":$1, "right": $3}; }
    |   expr DIV expr               { $$ = {"expr": "div", "left":$1, "right": $3}; }
    |   expr MOD expr               { $$ = {"expr": "mod", "left":$1, "right": $3}; }
    |   MINUS expr %prec UMINUS     { $$ = {"expr": "neg", "val":$1}; }
          
    |   expr UNION expr             { $$ = {"expr": "union", "left":$1, "right": $3}; } /* TODO: this is definitely wrong */
    ;

func_call:  QNAME LPAREN arg_list RPAREN   { $$ = "fixme"; } /* TODO: this is wrong */
        |   QNAME LPAREN RPAREN            { $$ = "fixme"; } /* TODO: this is wrong */
        ;

arg_list:   arg_list COMMA expr     { $$ = "fixme"; }  /* TODO: this is likely wrong */
        |   expr                    { $$ = "fixme"; }         /* TODO: this is likely wrong */
        ;

path_expr:  loc_path
        ; 

/* This is commented out because there might be a bug in jison that thinks this is ambiguous
 * when in fact it's not.
 */

/*
        |   filter_expr SLASH rel_loc_path          { $$ = "fe.unwrapPathExpr(rlp)"; }
        |   filter_expr DBL_SLASH rel_loc_path      { $$ = "fe.unwrapPathExpr(Vprepend(rlp, XPathStep.ABBR_DESCENDANTS()))"; }
        ;

filter_expr:  filter_expr predicate     { $$ = "Vappend(fe.v, p); RESULT = fe;" }
|   base_expr                   { $$ = "new vectorWrapper(be);"; } 
        ;
*/ 
predicate:   LBRACK expr RBRACK            { $$ = $1; }
        ;


loc_path:   rel_loc_path                    { $$ = "new XPathPathExpr(XPathPathExpr.INIT_CONTEXT_RELATIVE, getStepArr(rlp))"; }
        |   SLASH rel_loc_path              { $$ = "new XPathPathExpr(XPathPathExpr.INIT_CONTEXT_ROOT, getStepArr(rlp))"; }
        |   DBL_SLASH rel_loc_path          { $$ = "new XPathPathExpr(XPathPathExpr.INIT_CONTEXT_ROOT, getStepArr(Vprepend(rlp, XPathStep.ABBR_DESCENDANTS())))"; }
        |   SLASH                   { $$ = "new XPathPathExpr(XPathPathExpr.INIT_CONTEXT_ROOT, new XPathStep[0])"; }
        ;

rel_loc_path: step                  { $$ = "Vappend(null, s)"; }
        |   rel_loc_path SLASH step       { $$ = "Vappend(rlp, s)"; }
        |   rel_loc_path DBL_SLASH step   { $$ = "Vappend(Vappend(rlp, XPathStep.ABBR_DESCENDANTS()), s)"; }
        ;

step:   step_unabbr                   { $$ = "s.unwrapStep()"; }
    |   DOT                     { $$ = "XPathStep.ABBR_SELF()"; }
    |   DBL_DOT                     { $$ = "XPathStep.ABBR_PARENT()"; }
    ;

step_unabbr:  step_unabbr predicate       { "Vappend(s.v, p); RESULT = s"; }
        |   step_body                { $$ = "new vectorWrapper(sb)"; }
        ;

step_body: node_test                { $$ = "nt.generateStep(XPathStep.AXIS_CHILD)"; }
        |   axis_specifier node_test       { $$ = "nt.generateStep(a.intValue())"; }
        ;

axis_specifier:  QNAME DBL_COLON           { $$ = "new Integer(validateAxisName(q.toString()))"; }
        |   AT                  { $$ = "new Integer(XPathStep.AXIS_ATTRIBUTE)"; }
        ;

node_test:  QNAME                 { $$ = "new tempNodeTest(XPathStep.TEST_NAME, q)"; }
        |   WILDCARD                { $$ = "new tempNodeTest(XPathStep.TEST_NAME_WILDCARD)"; }
        |   NSWILDCARD              { $$ = "new tempNodeTest(XPathStep.TEST_NAMESPACE_WILDCARD, nwc)"; }
        |   NODETYPE_NODE LPAREN RPAREN     { $$ = "new tempNodeTest(XPathStep.TEST_TYPE_NODE)"; }
        |   NODETYPE_TEXT LPAREN RPAREN     { $$ = "new tempNodeTest(XPathStep.TEST_TYPE_TEXT)"; }
        |   NODETYPE_COMMENT LPAREN RPAREN      { $$ = "new tempNodeTest(XPathStep.TEST_TYPE_COMMENT)"; }
        |   NODETYPE_PROCINSTR LPAREN STR RPAREN  { $$ = "new tempNodeTest(XPathStep.TEST_TYPE_PROCESSING_INSTRUCTION, s)"; }
        ;

literal: STR                       { $$ = "new XPathStringLiteral(s)"; }
    |   NUM                       { $$ = {"expr": "num", "val":$1}; }
    ;
  