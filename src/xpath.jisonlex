WhiteSpace          \s+
Digit               [0-9]
Letter              [A-Za-z]
NameStartChar       [A-Za-z_]
NameTrailChar       [A-Za-z0-9._-]
NCName              [A-Za-z_][A-Za-z0-9._-]*
QName               [A-Za-z_][A-Za-z0-9._-]*(":"[A-Za-z_][A-Za-z0-9._-]*)?

%s INITIAL OP_CONTEXT VAL_CONTEXT
      
%%


<VAL_CONTEXT,INITIAL>"*"           { this.begin("OP_CONTEXT"); return "WILDCARD"; }
<VAL_CONTEXT,INITIAL>{QName}       { this.begin("OP_CONTEXT"); return "QNAME"; } 
<VAL_CONTEXT,INITIAL>{NCName}:\*   { this.begin("OP_CONTEXT"); return "NSWILDCARD"; }

<OP_CONTEXT>"*"                    { this.begin("VAL_CONTEXT"); return "MULT"; }
<OP_CONTEXT>"and"                  { this.begin("VAL_CONTEXT"); return "AND"; }
<OP_CONTEXT>"or"                   { this.begin("VAL_CONTEXT"); return "OR"; }
<OP_CONTEXT>"div"                  { this.begin("VAL_CONTEXT"); return "DIV"; }
<OP_CONTEXT>"mod"                  { this.begin("VAL_CONTEXT"); return "MOD"; }


<*>{Digit}+("."{Digit}*)?|"."{Digit}+              { this.begin("OP_CONTEXT"); return "NUM"; }
<*>"\""[^"\""]*"\""|'\''[^'\'']*'\''               { this.begin("OP_CONTEXT"); yytext = yytext.substr(1,yyleng-2); return "STR"; }



<*>"="         { this.begin("VAL_CONTEXT"); return "EQ"; }
<*>"!="        { this.begin("VAL_CONTEXT"); return "NEQ"; }
<*>"<"         { this.begin("VAL_CONTEXT"); return "LT"; }
<*>">"         { this.begin("VAL_CONTEXT"); return "GT"; }
<*>"<="        { this.begin("VAL_CONTEXT"); return "LTE"; }
<*>">="        { this.begin("VAL_CONTEXT"); return "GTE"; }
<*>"+"         { this.begin("VAL_CONTEXT"); return "PLUS"; }
<*>"-"         { this.begin("VAL_CONTEXT"); return "MINUS"; }
<*>"|"         { this.begin("VAL_CONTEXT"); return "UNION"; }
<*>"//"        { this.begin("VAL_CONTEXT"); return "DBL_SLASH"; }
<*>"/"         { this.begin("VAL_CONTEXT"); return "SLASH"; }
<*>"["         { this.begin("VAL_CONTEXT"); return "LBRACK"; }
<*>"]"         { this.begin("OP_CONTEXT");  return "RBRACK"; }
<*>"("         { this.begin("VAL_CONTEXT"); return "LPAREN"; }
<*>")"         { this.begin("OP_CONTEXT");  return "RPAREN"; }
<*>"."         { this.begin("OP_CONTEXT");  return "DOT"; }
<*>".."        { this.begin("OP_CONTEXT");  return "DBL_DOT"; }
<*>"@"         { this.begin("VAL_CONTEXT"); return "AT"; }
<*>"::"        { this.begin("VAL_CONTEXT"); return "DBL_COLON"; }
<*>","         { this.begin("VAL_CONTEXT"); return "COMMA"; }

<*>"node"/{WhiteSpace}?"("                        { return "NODETYPE_NODE"; }
<*>"text"/{WhiteSpace}?"("                        { return "NODETYPE_TEXT"; }

<*>"comment"/{WhiteSpace}?"("                     { return "NODETYPE_COMMENT"; }
<*>"processing-instruction"/{WhiteSpace}?"("      { return "NODETYPE_PROCINSTR"; }
<*>"$"{QName}                                      { this.begin("OP_CONTEXT"); yytext = yytext.substr(1,yyleng-1); return "VAR"; }

<*>{WhiteSpace}                         /* ignore whitespace */ 
<*><<EOF>>                              return 'EOF';




