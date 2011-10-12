WhiteSpace          (\s+)
Digit               [0-9]
Letter              [A-Za-z]
NameStartChar       [A-Za-z_]
NameTrailChar       [A-Za-z0-9._-]
NCName              [A-Za-z_][A-Za-z0-9._-]*
QName               [A-Za-z_][A-Za-z0-9._-]*(":"[A-Za-z_][A-Za-z0-9._-]*)?

%s INITIAL OP_CONTEXT VAL_CONTEXT
      
%%

<*>{WhiteSpace}                         /* ignore whitespace */ 

<*>"node"/({WhiteSpace}?"(")                     { console.log("NODETYPE", yytext); return "NODETYPE_NODE"; }
<*>"text"/({WhiteSpace}?"(")                     { console.log("NODETYPE", yytext); return "NODETYPE_TEXT"; }

<*>"comment"/({WhiteSpace}?"(")                  { console.log("NODETYPE", yytext); return "NODETYPE_COMMENT"; }
<*>"processing-instruction"/({WhiteSpace}?"(")   { console.log("NODETYPE", yytext); return "NODETYPE_PROCINSTR"; }

<*>"$"{QName}                                      { this.begin("OP_CONTEXT"); yytext = yytext.substr(1,yyleng-1); console.log("VAR", yytext); return "VAR"; }

<VAL_CONTEXT,INITIAL>{NCName}":*"  { this.begin("OP_CONTEXT"); 
                                     yytext = yytext.substr(0, yyleng-2);
                                     console.log("NSWILDCARD", yytext); return "NSWILDCARD"; }
<VAL_CONTEXT,INITIAL>{QName}       { this.begin("OP_CONTEXT"); console.log("QNAME", yytext); return "QNAME"; } 
<VAL_CONTEXT,INITIAL>"*"           { this.begin("OP_CONTEXT"); console.log("WILDCARD", yytext); return "WILDCARD"; }

<OP_CONTEXT>"*"                    { this.begin("VAL_CONTEXT"); console.log("MULT", yytext); return "MULT"; }
<OP_CONTEXT>("and")                  { this.begin("VAL_CONTEXT"); console.log("AND", yytext); return "AND"; }
<OP_CONTEXT>("or")                   { this.begin("VAL_CONTEXT"); console.log("OR", yytext); return "OR"; }
<OP_CONTEXT>("div")                  { this.begin("VAL_CONTEXT"); console.log("DIV", yytext); return "DIV"; }
<OP_CONTEXT>("mod")                  { this.begin("VAL_CONTEXT"); console.log("MOD", yytext); return "MOD"; }

<*>{Digit}+("."{Digit}*)?|"."{Digit}+              { this.begin("OP_CONTEXT"); console.log("NUM", yytext); return "NUM"; }


<*>"="         { this.begin("VAL_CONTEXT"); console.log("EQ", yytext); return "EQ"; }
<*>"!="        { this.begin("VAL_CONTEXT"); console.log("NEQ", yytext); return "NEQ"; }
<*>"<="        { this.begin("VAL_CONTEXT"); console.log("LTE", yytext); return "LTE"; }
<*>"<"         { this.begin("VAL_CONTEXT"); console.log("LT", yytext); return "LT"; }
<*>">="        { this.begin("VAL_CONTEXT"); console.log("GTE", yytext); return "GTE"; }
<*>">"         { this.begin("VAL_CONTEXT"); console.log("GT", yytext); return "GT"; }
<*>"+"         { this.begin("VAL_CONTEXT"); console.log("PLUS", yytext); return "PLUS"; }
<*>"-"         { this.begin("VAL_CONTEXT"); console.log("MINUS", yytext); return "MINUS"; }
<*>"|"         { this.begin("VAL_CONTEXT"); console.log("UNION", yytext); return "UNION"; }
<*>"//"        { this.begin("VAL_CONTEXT"); console.log("DBL", yytext); return "DBL_SLASH"; }
<*>"/"         { this.begin("VAL_CONTEXT"); console.log("SLASH", yytext); return "SLASH"; }
<*>"["         { this.begin("VAL_CONTEXT"); console.log("LBRACK", yytext); return "LBRACK"; }
<*>"]"         { this.begin("OP_CONTEXT");  console.log("RBRACK", yytext); return "RBRACK"; }
<*>"("         { this.begin("VAL_CONTEXT"); console.log("LPAREN", yytext); return "LPAREN"; }
<*>")"         { this.begin("OP_CONTEXT");  console.log("RPAREN", yytext); return "RPAREN"; }
<*>".."        { this.begin("OP_CONTEXT");  console.log("DBL", yytext); return "DBL_DOT"; }
<*>"."         { this.begin("OP_CONTEXT");  console.log("DOT", yytext); return "DOT"; }
<*>"@"         { this.begin("VAL_CONTEXT"); console.log("AT", yytext); return "AT"; }
<*>"::"        { this.begin("VAL_CONTEXT"); console.log("DBL", yytext); return "DBL_COLON"; }
<*>","         { this.begin("VAL_CONTEXT"); console.log("COMMA", yytext); return "COMMA"; }


<*>"\""[^"\""]*"\""|'\''[^'\'']*'\''               { this.begin("OP_CONTEXT"); yytext = yytext.substr(1,yyleng-2); return "STR"; }


<*><<EOF>>                              return 'EOF';




