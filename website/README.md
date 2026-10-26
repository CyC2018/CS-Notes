# CS-Notes 网站维护

网站正文来自仓库根目录的 README.md、notes/ 与 assets/。网站的页面、依赖和配图备份保存在 website/ 中，生成结果在 dist/，不会把本地面经数据或工具目录发布出去。

## 生成网站

```bash
python3 tools/build_site.py
python3 tools/check_site.py
```

需要重新下载新增的外链图片时，运行 `python3 tools/build_site.py --mirror`。此步骤需要 Python 的证书包 certifi；若未安装，脚本使用系统证书。网站运行本身只需要静态托管，无需安装 Python 或 Node.js。

## 预览

```bash
python3 -m http.server 8768 --bind 127.0.0.1 --directory dist
```

打开 http://127.0.0.1:8768/。检查首页、章节跳转、搜索及配图后，将 dist 文件夹上传到腾讯云 EdgeOne Makers（原 Pages）的对应项目。上传内容只选择 dist，不上传仓库根目录。

## 配图与依赖

- remote-assets.json 记录原图片链接、本地备份位置及校验信息。
- remote/ 保存网站引用的外链图片，生成时统一改成本地地址。
- vendor/ 保存固定版本的 Docsify、Prism 和复制插件，包含各自的许可证。
- 根域名与 www 域名绑定到同一项目，解析目标以腾讯云项目中的域名管理页面为准。
- 更新原仓库文章后需要重新生成并上传；直接上传项目目前没有自动同步 Git 提交。

## 恢复背景

旧 CloudBase 环境 cyc2018-8g9at08w980cc104 于 2026-06-11 被释放。此次网站根据保留的 GitHub 正文、原 Docsify 页面结构与公开图片恢复。旧环境中没有外部备份的专有数据未包含在恢复范围内。
