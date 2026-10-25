# 贡献指南

本仓库是面向复习和面试的技术笔记，内容力求简洁准确。欢迎通过 Issue 或 PR 指出错误、补充内容。

## Issue

指出错误时请写明：

- 文件名和原文；
- 问题所在以及修改建议；
- 依据，优先引用官方文档、规范、论文或源码。

## PR

- 一个 PR 只解决一类问题，例如修正错误和补充内容分开提交；
- 不改动已有的章节结构、标题编号和图片，修改标题时同步更新文件开头的目录；
- 排版遵循 [中文文案排版指北](https://github.com/sparanoid/chinese-copywriting-guidelines/blob/master/README.zh-Hans.md)，中英文之间加空格，使用全角标点；
- 修改代码时在 PR 中说明验证方式，例如测试用例或与暴力解法的对照结果。

## 配图

新图片放在 `notes/pics` 目录，在笔记中用相对路径引用：

```html
<div align="center"> <img src="pics/xxx.png" width="500px"/> </div><br>
```
