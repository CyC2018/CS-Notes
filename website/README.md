# CS-Notes 静态网站构建

只读获取 GitHub 最新 master 的文章和图片，生成可独立部署的静态目录。文章和原图仍由仓库统一维护，构建不下载另一套图床备份，也不向 GitHub 写入数据。

## 生成与预览

需要 Python 3.12+。在仓库根目录运行：

```bash
python3 -m pip install -r website/requirements.txt
python3 website/refresh.py
python3 website/builder/serve.py
```

打开 http://127.0.0.1:8769/。预览服务只监听本机，只提供 website/dist 中的生成文件。

refresh.py 使用独立浅层 Git 缓存读取最新 master，并生成源码快照。缓存的推送地址已停用。临时目录内完成生成和校验后才替换 website/dist；缺图或站内链接校验失败时保留上一版产物。

源码缓存、upstream、dist、图片优化缓存、版本记录和验证报告均已忽略，不加入提交。

## 图片来源与发布

旧 COS 图片 URL 如果能在当前源码中唯一匹配原文件名，构建时就改用对应仓库文件；同名不唯一或没有匹配时保留原外链。当前内容的 246 个旧图床配图均能匹配，不复制另一套图片到源码中。

生成时只收集页面实际引用的文件。无损 WebP 经逐像素校验，只有能节省至少 10% 才使用；原图仍保留在生成目录，仓库原文件不改动。搜索索引在构建时生成，访客首次搜索只加载一个索引文件。

发布时应把整个 website/dist（或内容位于 ZIP 根目录的压缩包）上传到静态托管，网页和图片一起上传。访客从网站域名读取图片，无需另建 COS/TOS 图床或替换一套对象存储链接。

原文的头像、徽章、许可证图标和 GitHub 附件等 18 个外链继续沿用，依赖原服务可用性。构建生成的是静态文件，自动上传步骤与凭据配置见下文。

## 验证

Node.js 22+ 用于搜索检查和自动发布。生成后，在仓库根目录运行：

```bash
python3 website/builder/check.py
python3 website/builder/test_site_assets.py
node website/builder/test_search.cjs
python3 website/builder/verify_updates.py
```

verify_updates.py 在临时副本中修改文章、替换配图、新增文章与图片，检查搜索索引更新，并模拟缺图、链接校验失败。测试结束自动清理副本，原始快照不改动。

页面模板保留手机分类导航、折叠目录、搜索和旧文章入口兼容；固定版本的浏览器依赖及许可证保存在 templates/vendor 中。

## 自动更新与发布

`.github/workflows/website.yml` 在 master 提交后、北京时间每天 09:17 和 21:17，以及手动 Run workflow 时运行。PR 仅验证合并后的源码，不读取部署凭据。CI 使用 `refresh.py --from-checkout` 从已检出的 Git 提交生成，源码中未提交的本机文件不会进入产物。

通过图片、引用和搜索检查后，使用 Python 标准库生成可重复的 UTF-8 发布包，再由腾讯云官方 Makers SDK 原样上传到现有 cs-notes 项目，包含整个 website/dist 的网页和图片。固定项目 ID 和中国站，上传前核对项目名称。清单与正式站一致时检查正式文件并跳过重复发布；有变化时等待腾讯云部署 Success，再核对正式域名的版本清单及 15 个关键页面/资源的实际 SHA-256，覆盖中文、空格文件名、图片清单、原图和优化配图。

发布包由 `python3 website/deploy/package_site.py` 在构建后生成到忽略的 `.cache/site-release.zip`，仅包含已校验清单中的文件；打包阶段不传入令牌。SDK 的目录打包在当前平台解包后会将中文名转成 `#U…`，因此使用 SDK 的 archive 参数上传标准 ZIP，保留原有中文网址。

本机检查发布保护（不需要令牌、不会上传）：

```bash
npm ci --prefix website/deploy --ignore-scripts
npm test --prefix website/deploy
python3 website/deploy/test_package_site.py
```

发布令牌只在仓库 Actions Secret `EDGEONE_API_TOKEN` 中配置，并仅传入可信 master 的发布步骤，不写入源码、网页、日志或报告。构建/校验失败时不会上传；发布后的域名检查失败会让任务失败，需查看部署记录后处理。删除令牌会停止后续发布，已经上线的网站不会被删除。

工作流只保留小型版本报告 7 天，不每天积累完整网站归档。图片优化缓存与产物不进入 Git。

GitHub 调度可能延迟；公开仓库连续 60 天没有活动时会自动停用定时工作流，届时需在 Actions 页面重新启用。可在 Actions 中禁用该工作流暂停自动更新。

参考：[Makers SDK](https://pages.edgeone.ai/document/sdk-overview)、[GitHub 定时规则](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#schedule)。
