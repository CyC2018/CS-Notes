# Git
<!-- GFM-TOC -->
* [Git](#git)
    * [集中式与分布式](#集中式与分布式) 🔥
    * [中心服务器](#中心服务器)
    * [工作流](#工作流)
    * [分支实现](#分支实现)
    * [冲突](#冲突)
    * [Fast forward](#fast-forward)
    * [储藏（Stashing）](#储藏stashing)
    * [SSH 传输设置](#ssh-传输设置)
    * [.gitignore 文件](#gitignore-文件)
    * [Git 命令一览](#git-命令一览)
    * [参考资料](#参考资料)
<!-- GFM-TOC -->


## 集中式与分布式 🔥

Git 属于分布式版本控制系统，而 SVN 属于集中式。

<div align="center"> <img src="pics/git-centralized-distributed.png" width="760px"/> </div><br>

集中式版本控制只有中心服务器拥有一份代码，而分布式版本控制每个人的电脑上就有一份完整的代码。

集中式版本控制有安全性问题，当中心服务器挂了所有人都没办法工作了。

集中式版本控制需要连网才能工作，如果网速过慢，那么提交一个文件会慢的无法让人忍受。而分布式版本控制不需要连网就能工作。

分布式版本控制新建分支、合并分支操作速度非常快，而集中式版本控制新建一个分支相当于复制一份完整代码。

## 中心服务器

中心服务器用来交换每个用户的修改，没有中心服务器也能工作，但是中心服务器能够 24 小时保持开机状态，这样就能更方便的交换修改。

GitHub 就是一个中心服务器。

## 工作流

新建一个仓库之后，当前目录就成为了工作区，工作区下有一个隐藏目录 .git，它属于 Git 的版本库。

Git 的版本库有一个称为 Stage 的暂存区以及最后的 History 版本库，History 存储所有分支信息，使用一个 HEAD 指针指向当前分支。

<div align="center"> <img src="pics/git-areas.png" width="760px"/> </div><br>

- git add files 把文件的修改添加到暂存区；
- git commit 把暂存区的修改提交到当前分支，提交之后暂存区的内容与这次提交一致；
- git reset -- files 使用当前分支上的修改覆盖暂存区，用来撤销最后一次 git add files；
- git checkout -- files 使用暂存区的修改覆盖工作目录，用来撤销本地修改。

<div align="center"> <img src="pics/git-workflow.png" width="760px"/> </div><br>

可以跳过暂存区域直接从分支中取出修改，或者直接提交修改到分支中。

- git commit -a 直接把所有已跟踪文件的修改添加到暂存区然后执行提交，未跟踪的新文件仍然需要先 git add；
- git checkout HEAD -- files 取出最后一次提交中的文件，同时覆盖暂存区和工作区，可以用来进行回滚操作。

<div align="center"> <img src="pics/git-workflow-skip.png" width="760px"/> </div><br>

## 分支实现

使用指针将每个提交连接成一条时间线，HEAD 指针指向当前分支指针。

<div align="center"> <img src="pics/git-branch-pointer.png" width="760px"/> </div><br>

新建分支是新建一个指针指向时间线的最后一个节点，并让 HEAD 指针指向新分支，表示新分支成为当前分支。

<div align="center"> <img src="pics/git-branch-new.png" width="760px"/> </div><br>

每次提交只会让当前分支指针向前移动，而其它分支指针不会移动。

<div align="center"> <img src="pics/git-branch-commit.png" width="760px"/> </div><br>

合并分支也只需要改变指针即可：切换回 master 后合并 dev，master 直接移动到 dev 所指的提交。这种情况称为快进合并（Fast-forward），两个分支都有新的提交时，合并会生成一个新的提交。

<div align="center"> <img src="pics/git-branch-merge.png" width="760px"/> </div><br>

## 冲突

当两个分支都对同一个文件的同一行进行了修改，在分支合并时就会产生冲突。

<div align="center"> <img src="pics/git-conflict.png" width="760px"/> </div><br>

Git 会使用 \<\<\<\<\<\<\< ，======= ，\>\>\>\>\>\>\> 标记出不同分支的内容，只需要把不同分支中冲突部分修改成一样，删掉这些标记，再执行 git add 和 git commit，就完成了合并。

```text
<<<<<<< HEAD
Creating a new branch is quick & simple.
=======
Creating a new branch is quick AND simple.
>>>>>>> feature1
```

## Fast forward

“快进式合并”（fast-forward merge），会直接将 master 分支指向合并的分支，这种模式下进行分支合并会丢失分支信息，也就不能在分支历史上看出分支信息。

可以在合并时加上 --no-ff 参数来禁用 Fast forward 模式，并且加上 -m 参数让合并时产生一个新的 commit。

```bash
$ git merge --no-ff -m "merge with no-ff" dev
```

<div align="center"> <img src="pics/git-no-ff.png" width="760px"/> </div><br>

## 储藏（Stashing）

在一个分支上操作之后，如果还没有将修改提交到分支上，此时进行切换分支，那么另一个分支上也能看到新的修改。这是因为所有分支都共用一个工作区的缘故。如果这些修改涉及的文件在两个分支上不同，切换会覆盖掉修改，Git 会拒绝切换。

可以使用 git stash 将当前分支的修改储藏起来，此时当前工作区中已跟踪文件的修改都会被存到栈中，工作区回到干净的状态；未跟踪的新文件默认不会储藏，需要加上 -u 选项。此时就可以安全的切换到其它分支上了。

```bash
$ git stash
Saved working directory and index state \ "WIP on master: 049d078 added the index file"
HEAD is now at 049d078 added the index file (To restore them type "git stash apply")
```

该功能可以用于 bug 分支的实现。如果当前正在 dev 分支上进行开发，但是此时 master 上有个 bug 需要修复，但是 dev 分支上的开发还未完成，不想立即提交。在新建 bug 分支并切换到 bug 分支之前就需要使用 git stash 将 dev 分支的未提交修改储藏起来。

## SSH 传输设置

Git 仓库和 GitHub 中心仓库之间可以通过 HTTPS 或者 SSH 加密传输，使用 SSH 时需要配置 SSH Key。

如果用户主目录下没有 .ssh 目录，或者该目录下没有 id_ed25519 和 id_ed25519.pub 这两个文件，可以通过以下命令来创建 SSH Key：

```bash
$ ssh-keygen -t ed25519 -C "youremail@example.com"
```

然后把公钥 id_ed25519.pub 的内容复制到 GitHub “Settings” 的 SSH Keys 中。

## .gitignore 文件

忽略以下文件：

- 操作系统自动生成的文件，比如缩略图；
- 编译生成的中间文件，比如 Java 编译产生的 .class 文件；
- 自己的敏感信息，比如存放口令的配置文件。

不需要全部自己编写，可以到 [https://github.com/github/gitignore](https://github.com/github/gitignore) 中进行查询。

## Git 命令一览

| 用途 | 命令 |
| --- | --- |
| 克隆仓库 | git clone <url> |
| 查看状态 | git status |
| 加入暂存区 | git add <file> |
| 提交 | git commit -m "说明" |
| 查看历史 | git log --oneline --graph |
| 查看改动 | git diff（工作区与暂存区），git diff --staged（暂存区与最新提交） |
| 撤销工作区的修改 | git restore <file> |
| 撤销 git add | git restore --staged <file> |
| 新建并切换分支 | git switch -c dev |
| 切换分支 | git switch master |
| 合并分支 | git merge dev |
| 变基 | git rebase master |
| 临时保存修改 | git stash，之后用 git stash pop 恢复 |
| 撤销最近一次提交，保留修改 | git reset --soft HEAD~1 |
| 回到某个提交，丢弃之后的修改 | git reset --hard <commit> |
| 用一个新提交抵消某次提交 | git revert <commit> |
| 拉取并合并远程分支 | git pull |
| 推送 | git push origin dev |

git restore 和 git switch 是 Git 2.23 加入的命令，分别承担了原来 git checkout 恢复文件和切换分支两种用途。需要注意的是，reset --hard 会丢弃未提交的修改；已经推送到远程的提交，应该用 revert 撤销，而不是 reset 后强制推送。

比较详细的命令列表：http://www.cheat-sheets.org/saved-copy/git-cheat-sheet.pdf

## 参考资料

- [Git - 简明指南](http://rogerdudler.github.io/git-guide/index.zh.html)
- [图解 Git](http://marklodato.github.io/visual-git-guide/index-zh-cn.html)
- [廖雪峰 : Git 教程](https://www.liaoxuefeng.com/wiki/0013739516305929606dd18361248578c67b8067c8c017b000)
- [Learn Git Branching](https://learngitbranching.js.org/)
