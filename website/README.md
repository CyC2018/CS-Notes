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

源码缓存、upstream、dist、图片优化缓存、版本记录和验证报告均已忽略，不加入提交。图片优化缓存按 Pillow 版本隔离，云端恢复缓存时也要求依赖版本匹配。

## 图片来源与发布

旧 COS 图片 URL 如果能在当前源码中唯一匹配原文件名，构建时就改用对应仓库文件；同名不唯一或没有匹配时保留原外链。当前内容的 246 个旧图床配图均能匹配，不复制另一套图片到源码中。

生成时只收集页面实际引用的文件。无损 WebP 经逐像素校验，只有能节省至少 10% 才使用；原图仍保留在生成目录，仓库原文件不改动。首页标识图片优先加载，其余正文图片默认延迟加载，保留作者显式指定的 loading 属性。搜索索引在构建时生成，访客首次搜索只加载一个索引文件；标准化文本缓存供后续搜索复用，不改变原索引。

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

学习站（定级、每日计划、间隔复习）的代码不在本仓库，网站工作流从私有仓库检出到 learn/；learn/ 存在时，build.py 调用 learn/build.py 生成到 dist/learn/，随网站一起发布，并在首页、侧边栏和三条学习路线的文章开头加入口，学习站中有题的笔记在文章末尾提示“读完练一练”（search-paths.js 中的 CS_NOTES_LEARN_TOPICS 记录每篇笔记的题数）；不存在时只构建笔记，没有入口。

## 自动更新与发布

`.github/workflows/website.yml` 在 master 提交后、北京时间每天 09:17 和 21:17，以及手动 Run workflow 时运行。PR 仅验证合并后的源码，不读取部署凭据。CI 使用 `refresh.py --from-checkout` 从已检出的 Git 提交生成，源码中未提交的本机文件不会进入产物。

通过图片、引用和搜索检查后，发布脚本先校验本地检查清单，再比较正式站版本。无变化时核对正式文件，跳过打包、凭据读取和上传。有变化时从当前产物重新生成可重复的 UTF-8 发布包，逐文件检查字节和哈希，再由腾讯云官方 Makers SDK 原样上传到现有 cs-notes 项目，避免误用旧 ZIP。固定项目 ID 和中国站，上传前核对项目名称。

等待腾讯云部署 Success 后，再校验正式域名的清单及关键页面/资源的实际 SHA-256。文章样本按当前清单选取，覆盖 ASCII、中文和空格；配图存在时检查原图和优化图片。不绑定特定文章名称，也不要求不存在的优化图片。首页等必要文件在本地缺失时即失败，先于凭据读取和上传。

自动发布在确认有变化后调用 `package_site.py`，生成忽略的 `.cache/site-release.zip`；打包子进程不接收发布令牌。需要手工生成 ZIP 时也可在构建后运行 `python3 website/deploy/package_site.py`，内容仅含已校验清单中的文件。SDK 的目录打包在当前平台解包后会将中文名转成 `#U…`，因此使用 SDK 的 archive 参数上传标准 ZIP，保留原有中文网址。

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
