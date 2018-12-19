module.exports = {
	// Double quoted: interpolation
	'"$foo"': '<span class="token string gstring">"<span class="token expression"><span class="token punctuation">$</span>foo</span>"</span>',
	'"${42}"': '<span class="token string gstring">"<span class="token expression"><span class="token punctuation">$</span><span class="token punctuation">{</span><span class="token number">42</span><span class="token punctuation">}</span></span>"</span>',
	// Triple double quoted: interpolation
	'"""$foo"""': '<span class="token string gstring">"""<span class="token expression"><span class="token punctuation">$</span>foo</span>"""</span>',
	'"""${42}"""': '<span class="token string gstring">"""<span class="token expression"><span class="token punctuation">$</span><span class="token punctuation">{</span><span class="token number">42</span><span class="token punctuation">}</span></span>"""</span>',
	// Slashy string: interpolation
	'/$foo/': '<span class="token string regex">/<span class="token expression"><span class="token punctuation">$</span>foo</span>/</span>',
	'/${42}/': '<span class="token string regex">/<span class="token expression"><span class="token punctuation">$</span><span class="token punctuation">{</span><span class="token number">42</span><span class="token punctuation">}</span></span>/</span>',
	// Dollar slashy string: interpolation
	'$/$foo/$': '<span class="token string gstring">$/<span class="token expression"><span class="token punctuation">$</span>foo</span>/$</span>',
	'$/${42}/$': '<span class="token string gstring">$/<span class="token expression"><span class="token punctuation">$</span><span class="token punctuation">{</span><span class="token number">42</span><span class="token punctuation">}</span></span>/$</span>',

	// Double quoted: no interpolation (escaped)
	'"\\$foo \\${42}"': '<span class="token string gstring">"\\$foo \\${42}"</span>',
	// Triple double quoted: no interpolation (escaped)
	'"""\\$foo \\${42}"""': '<span class="token string gstring">"""\\$foo \\${42}"""</span>',
	// Slashy string: no interpolation (escaped)
	'/\\$foo \\${42}/': '<span class="token string regex">/\\$foo \\${42}/</span>',
	// Dollar slashy string: no interpolation (escaped)
	'$/$$foo $${42}/$': '<span class="token string gstring">$/$$foo $${42}/$</span>',

	// Single quoted string: no interpolation
	'\'$foo ${42}\'': '<span class="token string">\'$foo ${42}\'</span>',
	// Triple single quoted string: no interpolation
	'\'\'\'$foo ${42}\'\'\'': '<span class="token string">\'\'\'$foo ${42}\'\'\'</span>'
};