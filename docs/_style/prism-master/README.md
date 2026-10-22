# Prism 文档

[![构建状态](https://travis-ci.org/PrismJS/prism.svg?branch=master)](https://travis-ci.org/PrismJS/prism)

Prism 是一个轻量级、强大而优雅的语法高亮库。它是从 [Dabblet](http://dabblet.com/) 演变而来的项目。

您可以在 http://prismjs.com/ 上了解更多信息。

## 为什么要另一个语法高亮工具？

您可以阅读更多关于 Prism 的介绍：[介绍 Prism：一个出色的新语法高亮工具](http://lea.verou.me/2012/07/introducing-prism-an-awesome-new-syntax-highlighter/#more-1841)。

## 更多 Prism 主题

查看更多可用的主题：[Prism 主题库](https://github.com/PrismJS/prism-themes)。

## 如何为 Prism 做贡献！

Prism 依赖社区的贡献来扩展和覆盖更广泛的使用案例。如果您喜欢这个项目，请考虑通过提交拉取请求来回馈社区。以下是一些建议：

- 阅读 [文档](http://prismjs.com/extending.html)。Prism 设计得很灵活，可以轻松扩展。
- 请勿编辑 `prism.js` 文件，它只是 Prism 网站所使用的版本，自动构建的。请将更改限制在 `components/` 文件夹中的未压缩文件中。压缩文件也是自动生成的。
- 构建系统使用 [gulp](https://github.com/gulpjs/gulp) 来压缩文件和构建 `prism.js`。安装 gulp 之后，只需运行 `gulp` 命令。
- 请遵循现有文件中的代码约定。例如，我使用 [制表符用于缩进，空格用于对齐](http://lea.verou.me/2012/01/why-tabs-are-clearly-superior/)。打开的花括号在同一行，关闭的花括号独占一行（无论构造如何）。在打开的花括号之前留有一个空格，等等。
- 请尽量提交较小的拉取请求，而不是少数几个大的请求。如果一个请求包含我想合并的更改和我不想合并的更改，那么处理起来会很困难。
- 我的时间非常有限，因此长时间的拉取请求可能会需要很长时间来审查（短请求通常会快速合并），尤其是那些修改 Prism 核心的请求。这并不意味着您的请求被拒绝。
- 如果您贡献新的语言定义，您将负责处理有关该语言定义的错误报告。
- 如果添加新的语言定义、主题或插件，您需要将其添加到 `components.json` 中，并通过运行 `gulp` 重建 Prism，以便它能够在下载构建页面中可用。

非常感谢您的贡献！！

## 翻译

若希望进一步提升本翻译内容的清晰度和可理解性，请参考原文，并确保语言的准确性与术语的一致性。所有编辑需以能够直接应用到新文件的格式呈现。