# CS-Notes 网站维护

网站正文来自仓库根目录的 README.md、notes/ 与 assets/。网站的页面、依赖和配图备份保存在 website/ 中，生成结果在 dist/，不会把本地面经数据或工具目录发布出去。

## 生成网站

```bash
python3 -m pip install -r tools/site-requirements.txt
python3 tools/build_site.py
python3 tools/check_site.py
python3 tools/test_site_assets.py
node tools/test_search.cjs
python3 tools/package_site.py
```

需要下载新增的外链图片时，运行 `python3 tools/build_site.py --mirror`。此步骤使用 Python 的证书包 certifi；若未安装，脚本使用系统证书。图片优化依赖 Pillow 的 WebP 支持；不需要优化时可加 `--no-optimize-images`。Node.js 只用于搜索回归检查。网站运行本身只需要静态托管，无需安装 Python 或 Node.js。

构建首先写入临时目录，全部成功后才替换 dist。打包产物默认为 artifacts/cs-notes-static.zip，同时生成 SHA-256 校验文件和版本记录。可用 `--output /目标目录/网站.zip` 指定发布包位置。生成的 ZIP 不包含工作区、旧部署凭据、图片缓存或 Git 数据。

## 预览

```bash
python3 tools/serve_site.py
```

打开 http://127.0.0.1:8768/。检查首页、章节跳转、搜索及配图后，将 dist 文件夹上传到腾讯云 EdgeOne Makers（原 Pages）的对应项目。上传内容只选择 dist，不上传仓库根目录。

预览服务仅监听本机，支持旧 VuePress 文章网址回退至站点入口，与当前 Makers 的单页应用访问方式一致。未注册的资源缺失仍返回 404。

## 配图与依赖

- remote-assets.json 记录原图片链接、本地备份位置及校验信息。
- remote/ 保存网站引用的外链图片，生成时统一改成本地地址。
- vendor/ 保存固定版本的 Docsify、Prism 和复制插件，包含各自的许可证。
- 构建只复制正文实际引用的资源；源码中的旧图片保留在 Git，不必全部上传。
- 已引用的原图片地址仍保留。构建会生成像素逐一验证一致的无损 WebP，在能节省至少 10% 时用于页面加载，原图内容不改动。
- 搜索索引在构建时生成，首次使用搜索时只读取一个带内容哈希的索引文件，不在访客浏览器中请求全部 179 篇 Markdown。
- legacy-routes.json 来自 Windows 旧 VuePress 工程的 168 篇文章目录，保留扩展名、无扩展名等 504 个旧入口；旧工程不作为当前正文来源。
- asset-manifest.json 记录每个发布文件的大小与 SHA-256，check_site.py 会验证全部文件、引用、索引、图片变体与旧链接目标。
- 根域名与 www 域名绑定到同一项目，解析目标以腾讯云项目中的域名管理页面为准。
- 主分支文章更新后，由下述 GitHub Actions 生成并发布；本地打包仍可用于手动恢复。

## 自动更新与发布

`.github/workflows/website.yml` 在 GitHub 云端运行，不依赖个人电脑开机，也不需要购买服务器：

- 北京时间每天 09:17、21:17 检查主分支；master 有新提交时立即触发，也可在 Actions 中手动 Run workflow。
- 每次重新检出最新 master，镜像新增外链图片，生成静态文件，校验全部引用、图片、搜索索引及文件清单。PR 只构建和测试，不使用发布凭据。
- 校验通过后，对比正式站的资产清单；没有变化时检查线上关键文件并跳过重复发布。有变化时使用腾讯云官方 Makers SDK 发布到固定项目 `makers-s7dxi8u5vidy`（`cs-notes`，中国站）。
- 部署必须达到 Success，随后核对正式域名的清单及首页、正文、搜索等 10 个关键文件的实际 SHA-256。校验失败会让任务失败；构建失败不会上传。发布后检查失败时先查看报告和腾讯云部署状态，不自动覆盖或删除旧版本。
- Actions 每次只保存小型报告，保留 7 天，不每天积累约 52 MB 的完整网站 ZIP；原始正文、图片和构建代码保存在 Git 仓库。

首次配置：把腾讯云 Makers API Token 保存为本仓库的 Actions Secret `EDGEONE_API_TOKEN`。令牌属于账号级凭据，不能放进公开源码、网页或日志；定期在腾讯云续期或更换，再更新同名 Secret。删除/撤销令牌会停止后续自动发布，不会删除已发布的网站。可在 Actions 中禁用“网站构建与发布”暂停整条流程。

定时任务要求工作流文件存在于默认分支 master。GitHub 调度可能延迟，公开仓库连续 60 天无活动会自动停用定时工作流，届时需在 Actions 页面重新启用；这不是精确到分钟的可用性承诺。失败通知使用 GitHub 自身的 Actions 通知设置。

参考：[腾讯云 GitHub Actions 发布](https://pages.edgeone.ai/document/using-github-actions)、[Makers SDK](https://pages.edgeone.ai/document/sdk-overview)、[GitHub 定时触发限制](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#schedule)。

## 恢复背景

旧 CloudBase 环境 cyc2018-8g9at08w980cc104 于 2026-06-11 被释放。此次网站根据保留的 GitHub 正文、原 Docsify 页面结构与公开图片恢复。旧环境中没有外部备份的专有数据未包含在恢复范围内。

Windows 的 D:\\__blog__\\vuepress-notes 保留 VuePress 1.7.1 工程，旧生成与部署命令为 vuepress build、cloudbase framework deploy。2026-10-27 在本机参考它的分类、页面配置和旧路径，新增当前的资产生成与校验流程。旧工程中的评论、统计服务和部署认证配置未加入当前网站。
