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

原文的头像、徽章、许可证图标和 GitHub 附件等 18 个外链继续沿用，依赖原服务可用性。构建生成的是静态文件；目前不包含每日定时配置、腾讯云上传代码或部署凭据。

## 验证

Node.js 22+ 用于搜索与更新回归检查。生成后，在仓库根目录运行：

```bash
python3 website/builder/check.py
python3 website/builder/test_site_assets.py
node website/builder/test_search.cjs
python3 website/builder/verify_updates.py
```

verify_updates.py 在临时副本中修改文章、替换配图、新增文章与图片，检查搜索索引更新，并模拟缺图、链接校验失败。测试结束自动清理副本，原始快照不改动。

页面模板保留手机分类导航、折叠目录、搜索和旧文章入口兼容；固定版本的浏览器依赖及许可证保存在 templates/vendor 中。
