(function(){

if (
	typeof self !== 'undefined' && !self.Prism ||
	typeof global !== 'undefined' && !global.Prism
) {
	return;
}

Prism.hooks.add('before-highlight', function(env) {
	var tokens = env.grammar;

	if (!tokens) return;

	tokens.tab = /\t/g;
	tokens.crlf = /\r\n/g;
	tokens.lf = /\n/g;
	tokens.cr = /\r/g;
	tokens.space = / /g;
});
})();
