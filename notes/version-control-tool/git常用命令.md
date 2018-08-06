git 常用命令

`git help`

## Branch related

### 1. 创建分支

* 根据当前分支创建新分支

  `git branch newBranchName`

* 创建并切换分支

`git checkout -b branchName`

* 根据其他远程分支创建新分支

`git branch newBranchName origin/ohterBranchName `

* 根据其他远程分支创建新分支并切换分支

`git checkout -b newBranchName origin/otherBranchName`

* 重命名分支

`git branch -m oldBranchName newBranchName`

### 2. 提交分支

* 提交分支到远程库

`git push origin branchName`

* 是否提交成功：查看远程端所有分支

`git branch -r`

* 查看本地分支

`git branch`

* 查看本地和远程分支

`git branch -a`

### 3. 删除分支

* 删除本地未提交分支

`git branch -d branchName`

* 删除远程分支

`git branch -r -d origin/branchName`

`git push origin :branchName`**冒号前有空格**

* 批量删除本地分支

`git branch -a | grep -v -E 'master|develop' | xargs git branch -D`

* 批量删除远程分支

`git branch -r| grep -v -E 'master|develop' | sed 's/origin\///g' | xargs -I {} git push origin :{}`

> 如果有些分支无法删除，是因为远程分支的缓存问题，可以使用`git remote prune`

* 批量删除本地tag

`git tag | xargs -I {} git tag -d {}`

* 批量删除远程tag

`git tag | xargs -I {} git push origin :refs/tags/{}`

*Ps:用到命令说明*

*grep -v -E 排除master 和 develop*

*-v 排除*
*-E 使用正则表达式*

*xargs 将前面的值作为参数传入 `git branch -D` 后面*

*-I {} 使用占位符 来构造 后面的命令*

*强制删除把-d 换成-D*

### 4. 切换分支

`git checkout branchName`

*切换分支时需要将修改过的文件全部提交*

### 5. 合并分支

----

* 将开发中的分支（branchName）合并到主分支(branchName)
* 首先切换到主分支`git checkout origin/branchName`
* 合并`git merge newBranchName`

----

* 将开发中的分支（branchName）合并到主分支(branchName),不保留日志
* 首先切换到主分支`git checkout origin/branchName`
* 合并`git rebase newBranchName`

----

* 保存之前的分支历史合并`git merge -no -ff newBranchName`

### 6. 撤销

* 撤销最近一次提交

`git reset HEAD^`

### 7. 查看各分支最后一次提交

`git branch -v`

### 8. 查看列出详细信息，在每一个名字后面列出其远程url

`git remote -v`

----

## file related

### 1. git stash命令

`git stash`命令用于将更改储藏在脏工作目录中

`git stash list`列索储藏的修改

`git stash show`进行检查

`git stash apply` 恢复

`git stash drop stash@{0}`移除存储

### 2. git clone 

`git clone <版本库的网址>`将存储库克隆到本地仓库

`git clone <版本库的网址> <本地目录名>`指定克隆的目录

`git remote add upstream fork.url`添加fork的源路径，方便同步源代码

### 3. Git init/git add

`git init` 初始化一个工作区

`git add fieName`添加文件到暂存区

`git add .`将文件的修改，文件的新建，添加到暂存区

`git add -u`将文件的修改、文件的删除，添加到暂存区

`git add -A`将文件的修改，文件的删除，文件的新建，添加到暂存区

---

**远程仓库地址操作**

---

`git remote add origin git@github.com:athc/ath_auth.git`将本地仓库和远程仓库连接起来

`git remote set-url origin  git@github.com:athc/ath-cloud.git`修改远程仓库地址

或分两步先删除

`git remote rm origin`先删除远程仓库地址

`git remote add origin  git@github.com:athc/ath-cloud.git`添加远程仓库地址

---

### 4. git commit#git reset#git rm#git mv

`git commit -m 'message'`提交添加的文件

`git commit -a -m 'message'` 相当于git add -A +git commit

git reset将当前HEAD 复位到指定状态，一般用于撤销操作

`git reset fileName`或`git reset HEAD fileName`回退文件

`git reset HEAD^`回退版本，一个**^**表示一个版本，可以多个，另外也可以使用`git reset HEAD~n`这种形式

`git reset commit-id`回退某一个commit-ID的提交



Git rm命令用于从工作区和索引中删除文件

`git rm Documentation/\*.txt`从documentation目录及其任何子目录下的索引中删除所有.txt文件



Git mv命令用于移动或重命名文件，目录或符号链接

`git text.txt mydir`把text.txt 移动到mydir目录，这条命令相当于以下执行

```
$ mv test.txt mydir/
$ git rm test.txt
$ git add mydir
```

### 5. git status#git log #git show#git diff

`git status`命令用于显示工作目录和暂存区的状态。使用此命令能看到那些修改被暂存到了, 哪些没有, 哪些文件没有被Git tracked到

`git status -uno`只列出所有已经被git管理的切被修改但是没提交的文件



git log命令用于显示提交日志信息

`git log -3`查看最近三次提交日志

`git log`查看提交日志

`git log --no-merges`显示提交记录但是跳过合并的



`git show`命令用于显示各种类型的对象



`git diff`命令用于显示提交和工作树等之间的更改。此命令比较的是工作目录中当前文件和暂存区域快照之间的差异,也就是修改之后还没有暂存起来的变化内容



`git checkout -b newBrach origin/master`从远程分支取回到本地分支

如：

`git checkout -b dev/1.5.4 origin/dev/1.5.4`从远程dev/1.5.4分支取得到本地分支/dev/1.5.4



### 5. Git fetch #git pull # git merge

`git fetch`命令用于从另一个存储库下载对象和引用

`git fetch`可以同步远程分支信息

`git pull`命令用于从另一个存储库或本地分支获取并集成(整合),在默认模式下，`git pull`是`git fetch`后跟`git merge FETCH_HEAD`的缩写。

`git push origin localBranchName` 将本地分支push到远程分支

`git pull`命令用于从另一个存储库或本地分支获取并集成(整合)。`git pull`命令的作用是：取回远程主机某个分支的更新，再与本地的指定分支合并，它的完整格式稍稍有点复杂





### 







