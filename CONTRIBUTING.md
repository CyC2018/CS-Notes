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

配图需要加 CyC2018 浅水印，包括整张图斜向平铺的淡色文字和右下角的标识。启用仓库自带的 Git 钩子后，提交时会自动给 `notes/pics` 下新增或修改的 PNG、JPEG 图片加水印，已加过的图片会跳过：

```bash
git config core.hooksPath tools/hooks
```

PR 中新增或修改的配图如果没有水印，GitHub Actions 的“配图水印检查”会失败并给出提示。

也可以手动执行，依赖 Pillow：

```bash
python3 tools/watermark.py notes/pics/xxx.png
python3 tools/watermark.py --check notes/pics/xxx.png   # 只检查
```

示意图建议保留可编辑的源文件。`tools/diagram/src` 中的 SVG 可以用以下命令渲染成 `notes/pics` 下同名的 PNG，需要本机安装 Chrome、Edge 或 Chromium：

```bash
python3 tools/diagram/build.py xxx
```
