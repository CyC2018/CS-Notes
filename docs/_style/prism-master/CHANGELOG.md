# Prism Changelog

## 1.15.0 (2018-06-16)

### 新组件

* __模板工具包 2__ ([#1418](https://github.com/PrismJS/prism/issues/1418)) [[`e063992`](https://github.com/PrismJS/prism/commit/e063992)]
* __XQuery__ ([#1411](https://github.com/PrismJS/prism/issues/1411)) [[`e326cb0`](https://github.com/PrismJS/prism/commit/e326cb0)]
* __TAP__ ([#1430](https://github.com/PrismJS/prism/issues/1430)) [[`8c2b71f`](https://github.com/PrismJS/prism/commit/8c2b71f)]

### 更新组件

* __HTTP__
	* 绝对路径是有效的请求 URI ([#1388](https://github.com/PrismJS/prism/issues/1388)) [[`f6e81cb`](https://github.com/PrismJS/prism/commit/f6e81cb)]
* __Kotlin__
	* 添加 Kotlin 关键字及其数字模式的修改 ([#1389](https://github.com/PrismJS/prism/issues/1389)) [[`1bf73b0`](https://github.com/PrismJS/prism/commit/1bf73b0)]
	* 添加 `typealias` 关键字 ([#1437](https://github.com/PrismJS/prism/issues/1437)) [[`a21fdee`](https://github.com/PrismJS/prism/commit/a21fdee)]
* __JavaScript__
	* 改进正则表达式模式 [[`5b043cf`](https://github.com/PrismJS/prism/commit/5b043cf)]
	* 支持模板字符串内部一层嵌套。修复 [#1397](https://github.com/PrismJS/prism/issues/1397) [[`db2d0eb`](https://github.com/PrismJS/prism/commit/db2d0eb)]
* __Elixir__
	* Elixir：修复属性消耗标点符号。修复 [#1392](https://github.com/PrismJS/prism/issues/1392) [[`dac0485`](https://github.com/PrismJS/prism/commit/dac0485)]
* __Bash__
	* 更改保留关键字引用 ([#1396](https://github.com/PrismJS/prism/issues/1396)) [[`b94f01f`](https://github.com/PrismJS/prism/commit/b94f01f)]
* __PowerShell__
	* 允许字符串内表达式中的一层嵌套。修复 [#1407](https://github.com/PrismJS/prism/issues/1407) [[`9272d6f`](https://github.com/PrismJS/prism/commit/9272d6f)]
* __JSX__
	* 允许 JSX 标签内两个级别的嵌套。修复 [#1408](https://github.com/PrismJS/prism/issues/1408) [[`f1cd7c5`](https://github.com/PrismJS/prism/commit/f1cd7c5)]
	* 添加对片段简写语法的支持。修复 [#1421](https://github.com/PrismJS/prism/issues/1421) [[`38ce121`](https://github.com/PrismJS/prism/commit/38ce121)]
* __Pascal__
	* 将 `objectpascal` 添加为 `pascal` 的别名 ([#1426](https://github.com/PrismJS/prism/issues/1426)) [[`a0bfc84`](https://github.com/PrismJS/prism/commit/a0bfc84)]
* __Swift__
	* 修复 Swift 的 `protocol` 关键字 ([#1440](https://github.com/PrismJS/prism/issues/1440)) [[`081e318`](https://github.com/PrismJS/prism/commit/081e318)]

### 更新插件

* __文件高亮__
	* 修复导致下载按钮在每个代码块上显示的问题。[[`cd22499`](https://github.com/PrismJS/prism/commit/cd22499)]
	* 简化文件高亮插件的语言正则表达式 ([#1399](https://github.com/PrismJS/prism/issues/1399)) [[`7bc9a4a`](https://github.com/PrismJS/prism/commit/7bc9a4a)]
* __显示语言__
	* 如果块语言未设置，则不处理语言 ([#1410](https://github.com/PrismJS/prism/issues/1410)) [[`c111869`](https://github.com/PrismJS/prism/commit/c111869)]
* __自动加载器__
	* ASP.NET 应该要求 C# [[`fa328bb`](https://github.com/PrismJS/prism/commit/fa328bb)]
* __行号__
	* 使行号样式更加特定 ([#1434](https://github.com/PrismJS/prism/issues/1434), [#1435](https://github.com/PrismJS/prism/issues/1435)) [[`9ee4f54`](https://github.com/PrismJS/prism/commit/9ee4f54)]

### 更新主题

* 向其余主题添加 .token.class-name ([#1360](https://github.com/PrismJS/prism/issues/1360)) [[`f356dfe`](https://github.com/PrismJS/prism/commit/f356dfe)]

### 其他变化

* __网站__
	* 现在网站通过 HTTPS 加载！
	* 使用 HTTPS / 规范 URLs ([#1390](https://github.com/PrismJS/prism/issues/1390)) [[`95146c8`](https://github.com/PrismJS/prism/commit/95146c8)]
	* 添加 Angular 教程链接 [[`c436a7c`](https://github.com/PrismJS/prism/commit/c436a7c)]
	* 使用 rel="icon" 而不是 rel="shortcut icon" ([#1398](https://github.com/PrismJS/prism/issues/1398)) [[`d95f8fb`](https://github.com/PrismJS/prism/commit/d95f8fb)]
	* 修复下载页面不处理来自重下载 URL 多个依赖项的问题 [[`c2ff248`](https://github.com/PrismJS/prism/commit/c2ff248)]
	* 更新 Node & Webpack 的文档 [[`1e99e96`](https://github.com/PrismJS/prism/commit/1e99e96)]
* 处理 `loadLanguages()` 中的可选依赖项 ([#1417](https://github.com/PrismJS/prism/issues/1417)) [[`84935ac`](https://github.com/PrismJS/prism/commit/84935ac)]
* 添加中文翻译 [[`f2b1964`](https://github.com/PrismJS/prism/commit/f2b1964)]

## 1.14.0 (2018-04-11)

### 新组件
* __GEDCOM__ ([#1385](https://github.com/PrismJS/prism/issues/1385)) [[`6e0b20a`](https://github.com/PrismJS/prism/commit/6e0b20a)]
* __Lisp__ ([#1297](https://github.com/PrismJS/prism/issues/1297)) [[`46468f8`](https://github.com/PrismJS/prism/commit/46468f8)]
* __Markup Templating__ ([#1367](https://github.com/PrismJS/prism/issues/1367)) [[`5f9c078`](https://github.com/PrismJS/prism/commit/5f9c078)]
* __Soy__ ([#1387](https://github.com/PrismJS/prism/issues/1387)) [[`b4509bf`](https://github.com/PrismJS/prism/commit/b4509bf)]
* __Velocity__ ([#1378](https://github.com/PrismJS/prism/issues/1378)) [[`5a524f7`](https://github.com/PrismJS/prism/commit/5a524f7)]
* __Visual Basic__ ([#1382](https://github.com/PrismJS/prism/issues/1382)) [[`c673ec2`](https://github.com/PrismJS/prism/commit/c673ec2)]
* __WebAssembly__ ([#1386](https://github.com/PrismJS/prism/issues/1386)) [[`c28d8c5`](https://github.com/PrismJS/prism/commit/c28d8c5)]

### 更新组件
* __Bash__:
	* 添加 curl 至常用函数列表。关闭 [#1160](https://github.com/PrismJS/prism/issues/1160) [[`1bfc084`](https://github.com/PrismJS/prism/commit/1bfc084)]
* __C-like__:
	* 使单行注释贪婪。修复 [#1337](https://github.com/PrismJS/prism/issues/1337)。确保 [#1340](https://github.com/PrismJS/prism/issues/1340) 保持固定。 [[`571f2c5`](https://github.com/PrismJS/prism/commit/571f2c5)]
* __C#__:
	* 更通用的类名高亮。修复 [#1365](https://github.com/PrismJS/prism/issues/1365) [[`a6837d2`](https://github.com/PrismJS/prism/commit/a6837d2)]
	* 更具体的类名高亮。修复 [#1371](https://github.com/PrismJS/prism/issues/1371) [[`0a95f69`](https://github.com/PrismJS/prism/commit/0a95f69)]
* __Eiffel__:
	* 修复逐字字符串。修复 [#1379](https://github.com/PrismJS/prism/issues/1379) [[`04df41b`](https://github.com/PrismJS/prism/commit/04df41b)]
* __Elixir__
	* 使正则表达式贪婪，删除注释黑客。更新已知失败和测试。 [[`e93d61f`](https://github.com/PrismJS/prism/commit/e93d61f)]
* __ERB__:
	* 在 NodeJS 上使高亮正常工作 ([#1367](https://github.com/PrismJS/prism/issues/1367)) [[`5f9c078`](https://github.com/PrismJS/prism/commit/5f9c078)]
* __Fortran__:
	* 使单行注释贪婪。更新已知失败和测试。 [[`c083b78`](https://github.com/PrismJS/prism/commit/c083b78)]
* __Handlebars__:
	* 使在 NodeJS 上高亮正常工作 ([#1367](https://github.com/PrismJS/prism/issues/1367)) [[`5f9c078`](https://github.com/PrismJS/prism/commit/5f9c078)]
* __Java__:
	* 添加对泛型的支持。修复 [#1351](https://github.com/PrismJS/prism/issues/1351) [[`a5cf302`](https://github.com/PrismJS/prism/commit/a5cf302)]
* __JavaScript__:
	* 添加对常量的支持。修复 [#1348](https://github.com/PrismJS/prism/issues/1348) [[`9084481`](https://github.com/PrismJS/prism/commit/9084481)]
	* 改进正则表达式匹配 [[`172d351`](https://github.com/PrismJS/prism/commit/172d351)]
* __JSX__:
	* 修复空对象的高亮。修复 [#1364](https://github.com/PrismJS/prism/issues/1364) [[`b26bbb8`](https://github.com/PrismJS/prism/commit/b26bbb8)]
* __Monkey__:
	* 使注释贪婪。更新已知失败和测试。 [[`d7b2b43`](https://github.com/PrismJS/prism/commit/d7b2b43)]
* __PHP__:
	* 在 NodeJS 上使高亮正常工作 ([#1367](https://github.com/PrismJS/prism/issues/1367)) [[`5f9c078`](https://github.com/PrismJS/prism/commit/5f9c078)]
* __Puppet__:
	* 使 heredoc，注释，正则表达式和字符串贪婪。更新已知失败和测试。 [[`0c139d1`](https://github.com/PrismJS/prism/commit/0c139d1)]
* __Q__:
	* 使注释贪婪。更新已知失败和测试。 [[`a0f5081`](https://github.com/PrismJS/prism/commit/a0f5081)]
* __Ruby__:
	* 使多行注释贪婪，删除单行注释黑客。更新已知失败和测试。 [[`b0e34fb`](https://github.com/PrismJS/prism/commit/b0e34fb)]
* __SQL__:
	* 添加缺失的关键字。修复 [#1374](https://github.com/PrismJS/prism/issues/1374) [[`238b195`](https://github.com/PrismJS/prism/commit/238b195)]

### 更新插件
* __命令行__:
	* 命令行：允许使用 data-filter-output 属性指定输出前缀。 ([#856](https://github.com/PrismJS/prism/issues/856)) [[`094d546`](https://github.com/PrismJS/prism/commit/094d546)]
* __文件高亮__:
	* 在工具栏插件与文件高亮结合时，增加提供下载按钮的选项。修复 [#1030](https://github.com/PrismJS/prism/issues/1030) [[`9f22952`](https://github.com/PrismJS/prism/commit/9f22952)]

### 更新主题
* __默认__:
	* 达到 AA 对比度比例标准 ([#1296](https://github.com/PrismJS/prism/issues/1296)) [[`8aea939`](https://github.com/PrismJS/prism/commit/8aea939)]

### 其他变化
* 网站：从主页移除损坏的第三方教程 [[`0efd6e1`](https://github.com/PrismJS/prism/commit/0efd6e1)]
* 文档：在 NodeJS 部分的主页提及 `loadLanguages()` 函数。关闭 [#972](https://github.com/PrismJS/prism/issues/972)，关闭 [#593](https://github.com/PrismJS/prism/issues/593) [[`4a14d20`](https://github.com/PrismJS/prism/commit/4a14d20)]
* 核心：贪婪模式应该始终与整个字符串匹配。修复 [#1355](https://github.com/PrismJS/prism/issues/1355) [[`294efaa`](https://github.com/PrismJS/prism/commit/294efaa)]
* Crystal：更新已知失败。[[`e1d2d42`](https://github.com/PrismJS/prism/commit/e1d2d42)]
* D：更新已知失败和测试。[[`13d9991`](https://github.com/PrismJS/prism/commit/13d9991)]
* Markdown：更新已知失败。[[`5b6c76d`](https://github.com/PrismJS/prism/commit/5b6c76d)]
* Matlab：更新已知失败。[[`259b6fc`](https://github.com/PrismJS/prism/commit/259b6fc)]
* 网站：移除不存在的失败锚点。重新措辞主页使其不那么误导。[[`8c0911a`](https://github.com/PrismJS/prism/commit/8c0911a)]
* 网站：在 FAQ 中添加指向保留标记插件的链接[[`e8cb6d4`](https://github.com/PrismJS/prism/commit/e8cb6d4)]
* 测试套件：vm.runInNewContext() 中的内存泄漏问题似乎已修复。[[`9a4b6fa`](https://github.com/PrismJS/prism/commit/9a4b6fa)]恢复[[`9bceece`](https://github.com/PrismJS/prism/commit/9bceece)，[`7c7602b`](https://github.com/PrismJS/prism/commit/7c7602b)]
* Gulp：不要压缩 `components/index.js` [[`689227b`](https://github.com/PrismJS/prism/commit/689227b)]
* 网站：修复下载页面的主题选择，特别是当主题在查询字符串或哈希中时。[[`b4d3063`](https://github.com/PrismJS/prism/commit/b4d3063)]
* 更新 JSPM 配置以包含未压缩的组件。关闭 [#995](https://github.com/PrismJS/prism/issues/995) [[`218f160`](https://github.com/PrismJS/prism/commit/218f160)]
* 核心：修复支持包含破折号 `-` 的语言别名 [[`659ea31`](https://github.com/PrismJS/prism/commit/659ea31)]

（在后续系统中继续进行更新以保持一致性。）