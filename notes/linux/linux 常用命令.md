# linux 常用命令

### 1. 文件查找

`find / -name file.txt`  根据名称查找 **/**目录下的file.tx文件

`find . -name "*.xml"`递归查找所有的XML文件

`find ./ -size 0 | xargs rm -f &` 删除大小为零的文件

`ls -l | grep '.jar'` 查找当前目录中的所有jar文件

`grep 'test' d*`显示所有以d开头的文件中包含test的行

`grep 'test' aa bb cc` 显示在aa bb cc 中匹配test的行

`grep '[a-z]\{5\}' aa` 显示所有包含每个字符串至少有五个连续小写字符的字符串的行



### 2. 复制文件命令

`cp source dest` 复制文件

`cp -r sourceFolser targetFolder `递归复制文件夹

`cp scp sourecFile romoteUserName@remoteIp:remoteAddr` 远程拷贝



### 3. 打包和压缩命令

`tar -xvf file.tar -C /tmp`将压缩包解压到**/tmp**目录下

`tar -xvf file.tar`解压文件

`tar -tf file.tar`显示一个包中的内容

`tar -cvf  /tmp/test.tar /etc`将**/etc** 目录下的档案全部打包成为 /tmp/test.tar 

bunzip ,仅打包，不压缩：打包压缩 `tar -cvf /tmp/test.tar /et`

`zip file.zip file`创建一个zip格式的压缩包

`rar a file.rar file`创建一个rar压缩包

`rar x file.rar`解压rar包



#### 4. 创建目录

`mkdir newFolder`创建目录



### 5. 查看文件 

`ls`

`ll`

`ls -al`查看文件包含隐藏文件

`pwd`查看当前工作目录

`rm -rf  abc/*`递归删除**abc**下所有文件**慎用！此操作没有提示**



### 6. 移动文件

`mv /abc/file /def`将file移动到def 文件夹下

`mv oldFile newFile`重命名



### 7. 切换用户

` su -username`



### 8. 修改文件权限

`chord 777 file.txt` 修改file文件权限为-rwxrwxrwxr表示读、w表示写、x表示可执行 



### 9. 进程

`netstat -tln | grep 8080` 查看端口8080的使用情况

`ps -ef | grep 'tomcat'` 查看全部tomcat 进程

`ps aux` 查看所有进程

`kill -9 pid`杀死pid进程



### 10. 远程登陆

`ssh -p22 root@ip`ssh登陆用户名为root端口为22