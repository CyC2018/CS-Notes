Prism.languages.fortran = {
	'quoted-number': {
		pattern: /[BOZ](['"])[A-F0-9]+\1/i,
		alias: 'number'
	},
	'string': {
		pattern: /(?:\w+_)?(['"])(?:\1\1|&(?:\r\n?|\n)(?:\s*!.+(?:\r\n?|\n))?|(?!\1).)*(?:\1|&)/,
		inside: {
			'comment': {
				pattern: /(&(?:\r\n?|\n)\s*)!.*/,
				lookbehind: true
			}
		}
	},
	'comment': {
		pattern: /!.*/,
		greedy: true
	},
	'boolean': /\.(?:TRUE|FALSE)\.(?:_\w+)?/i,
	'number': /(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:[ED][+-]?\d+)?(?:_\w+)?/i,
	'keyword': [
		// Types
		/\b(?:INTEGER|REAL|DOUBLE ?PRECISION|COMPLEX|CHARACTER|LOGICAL)\b/i,
		// END statements
		/\b(?:END ?)?(?:BLOCK ?DATA|DO|FILE|FORALL|FUNCTION|IF|INTERFACE|MODULE(?! PROCEDURE)|PROGRAM|SELECT|SUBROUTINE|TYPE|WHERE)\b/i,
		// Statements
		/\b(?:ALLOCATABLE|ALLOCATE|BACKSPACE|CALL|CASE|CLOSE|COMMON|CONTAINS|CONTINUE|CYCLE|DATA|DEALLOCATE|DIMENSION|DO|END|EQUIVALENCE|EXIT|EXTERNAL|FORMAT|GO ?TO|IMPLICIT(?: NONE)?|INQUIRE|INTENT|INTRINSIC|MODULE PROCEDURE|NAMELIST|NULLIFY|OPEN|OPTIONAL|PARAMETER|POINTER|PRINT|PRIVATE|PUBLIC|READ|RETURN|REWIND|SAVE|SELECT|STOP|TARGET|WHILE|WRITE)\b/i,
		// Others
		/\b(?:ASSIGNMENT|DEFAULT|ELEMENTAL|ELSE|ELSEWHERE|ELSEIF|ENTRY|IN|INCLUDE|INOUT|KIND|NULL|ONLY|OPERATOR|OUT|PURE|RECURSIVE|RESULT|SEQUENCE|STAT|THEN|USE)\b/i
	],
	'operator': [
		/\*\*|\/\/|=>|[=\/]=|[<>]=?|::|[+\-*=%]|\.(?:EQ|NE|LT|LE|GT|GE|NOT|AND|OR|EQV|NEQV)\.|\.[A-Z]+\./i,
		{
			// Use lookbehind to prevent confusion with (/ /)
			pattern: /(^|(?!\().)\/(?!\))/,
			lookbehind: true
		}
	],
	'punctuation': /\(\/|\/\)|[(),;:&]/
};