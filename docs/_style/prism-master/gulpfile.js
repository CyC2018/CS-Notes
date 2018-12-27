var gulp   = require('gulp'),
	rename = require('gulp-rename'),
	uglify = require('gulp-uglify'),
	header = require('gulp-header'),
	concat = require('gulp-concat'),
	replace = require('gulp-replace'),
	fs = require('fs'),

	paths  = {
		componentsFile: 'components.json',
		componentsFileJS: 'components.js',
		components: ['components/**/*.js', '!components/index.js', '!components/**/*.min.js'],
		main: [
			'components/prism-core.js',
			'components/prism-markup.js',
			'components/prism-css.js',
			'components/prism-clike.js',
			'components/prism-javascript.js',
			'plugins/file-highlight/prism-file-highlight.js'
		],
		plugins: ['plugins/**/*.js', '!plugins/**/*.min.js'],
		showLanguagePlugin: 'plugins/show-language/prism-show-language.js',
		autoloaderPlugin: 'plugins/autoloader/prism-autoloader.js',
		changelog: 'CHANGELOG.md'
	},

	componentsPromise = new Promise(function (resolve, reject) {
		fs.readFile(paths.componentsFile, {
			encoding: 'utf-8'
		}, function (err, data) {
			if (!err) {
				resolve(JSON.parse(data));
			} else {
				reject(err);
			}
		});
	});

gulp.task('components', function() {
	return gulp.src(paths.components)
		.pipe(uglify())
		.pipe(rename({ suffix: '.min' }))
		.pipe(gulp.dest('components'));
});

gulp.task('build', function() {
	return gulp.src(paths.main)
		.pipe(header('\n/* **********************************************\n' +
			'     Begin <%= file.relative %>\n' +
			'********************************************** */\n\n'))
		.pipe(concat('prism.js'))
		.pipe(gulp.dest('./'));
});

gulp.task('plugins', ['languages-plugins'], function() {
	return gulp.src(paths.plugins)
		.pipe(uglify())
		.pipe(rename({ suffix: '.min' }))
		.pipe(gulp.dest('plugins'));
});

gulp.task('components-json', function (cb) {
	componentsPromise.then(function (data) {
		data = 'var components = ' + JSON.stringify(data) + ';\n' +
			'if (typeof module !== \'undefined\' && module.exports) { module.exports = components; }';
		fs.writeFile(paths.componentsFileJS, data, cb);
	});
});

gulp.task('watch', function() {
	gulp.watch(paths.components, ['components', 'build']);
	gulp.watch(paths.plugins, ['plugins', 'build']);
});

gulp.task('languages-plugins', function (cb) {
	componentsPromise.then(function (data) {
		var languagesMap = {};
		var dependenciesMap = {};
		for (var p in data.languages) {
			if (p !== 'meta') {
				var title = data.languages[p].displayTitle || data.languages[p].title;
				var ucfirst = p.substring(0, 1).toUpperCase() + p.substring(1);
				if (title !== ucfirst) {
					languagesMap[p] = title;
				}

				for (var name in data.languages[p].aliasTitles) {
					languagesMap[name] = data.languages[p].aliasTitles[name];
				}

				if(data.languages[p].require) {
					dependenciesMap[p] = data.languages[p].require;
				}
			}
		}

		var jsonLanguagesMap = JSON.stringify(languagesMap);
		var jsonDependenciesMap = JSON.stringify(dependenciesMap);

		var tasks = [
			{plugin: paths.showLanguagePlugin, map: jsonLanguagesMap},
			{plugin: paths.autoloaderPlugin, map: jsonDependenciesMap}
		];

		var cpt = 0;
		var l = tasks.length;
		var done = function() {
			cpt++;
			if(cpt === l) {
				cb && cb();
			}
		};

		tasks.forEach(function(task) {
			var stream = gulp.src(task.plugin)
				.pipe(replace(
					/\/\*languages_placeholder\[\*\/[\s\S]*?\/\*\]\*\//,
					'/*languages_placeholder[*/' + task.map + '/*]*/'
				))
				.pipe(gulp.dest(task.plugin.substring(0, task.plugin.lastIndexOf('/'))));

			stream.on('error', done);
			stream.on('end', done);
		});
	});
});

gulp.task('changelog', function (cb) {
	return gulp.src(paths.changelog)
		.pipe(replace(
			/#(\d+)(?![\d\]])/g,
			'[#$1](https://github.com/PrismJS/prism/issues/$1)'
		))
		.pipe(replace(
			/\[[\da-f]+(?:, *[\da-f]+)*\]/g,
			function (match) {
				return match.replace(/([\da-f]{7})[\da-f]*/g, '[`$1`](https://github.com/PrismJS/prism/commit/$1)');
			}
		))
		.pipe(gulp.dest('.'));
});

gulp.task('default', ['components', 'components-json', 'plugins', 'build']);
