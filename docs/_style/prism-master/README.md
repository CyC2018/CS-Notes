# [Prism](http://prismjs.com/)

[![Build Status](https://travis-ci.org/PrismJS/prism.svg?branch=master)](https://travis-ci.org/PrismJS/prism)

Prism is a lightweight, robust, elegant syntax highlighting library. It's a spin-off project from [Dabblet](http://dabblet.com/).

You can learn more on http://prismjs.com/.

Why another syntax highlighter?: http://lea.verou.me/2012/07/introducing-prism-an-awesome-new-syntax-highlighter/#more-1841

More themes for Prism: https://github.com/PrismJS/prism-themes

## Contribute to Prism!

Prism depends on community contributions to expand and cover a wider array of use cases. If you like it, considering giving back by sending a pull request. Here are a few tips:

- Read the [documentation](http://prismjs.com/extending.html). Prism was designed to be extensible.
- Do not edit `prism.js`, it’s just the version of Prism used by the Prism website and is built automatically. Limit your changes to the unminified files in the components/ folder. The minified files are also generated automatically.
- The build system uses [gulp](https://github.com/gulpjs/gulp) to minify the files and build `prism.js`. Having gulp installed, you just need to run the command `gulp`.
- Please follow the code conventions used in the files already. For example, I use [tabs for indentation and spaces for alignment](http://lea.verou.me/2012/01/why-tabs-are-clearly-superior/). Opening braces are on the same line, closing braces on their own line regardless of construct. There is a space before the opening brace. etc etc.
- Please try to err towards more smaller PRs rather than few huge PRs. If a PR includes changes I want to merge and changes I don't, handling it becomes difficult.
- My time is very limited these days, so it might take a long time to review longer PRs (short ones are usually merged very quickly), especially those modifying the Prism Core. This doesn't mean your PR is rejected.
- If you contribute a new language definition, you will be responsible for handling bug reports about that language definition.
- If you add a new language definition, theme or plugin, you need to add it to `components.json` as well and rebuild Prism by running `gulp`, so that it becomes available to the download build page.

Thank you so much for contributing!!

## Translations

* [![中文说明](http://awesomes.oss-cn-beijing.aliyuncs.com/readme.png)](http://www.awesomes.cn/repo/PrismJS/prism)
