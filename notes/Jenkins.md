按Git的学习之旅的安排

# Jenkins简介

Java开发的开源软件--一定需要**jdk环境**

持续集成工具，用于监控持续重复的工作--假设没有Jenkins的话会怎样--**手动**build、**手动**部署？

官网： https://jenkins.io 

# Jenkins的下载与安装

必须要java8。

jenkins.msi---Windows平台中，直接双击安装 ，比较方便。

jenkins.war---web项目，java -jar jenkins.war或直接放到tomcat等web容器的web-app下面，启动tomcat.

安装配置默认插件、配置等。 

 ![image-20231128105304073](..\assets\image-20231128105304073--Jenkins.png)

# Jenkins的工作流程

1. 如何帮助我们自动完成这些工作的呢---->Jenkins的工作流程

![image-20231128110758572](..\assets\image-20231128110758572--Jenkins工作流.png)

![image-20231128112504570](..\assets\image-20231128112504570--Jenkins-work.png)

1. 

2. 拉取代码机制

   > 让Jenkins任务对应一个仓，到该拉取代码。

3. 项目构建与发布

   

4. 自动集成发布--不需要手动让Jenkins去拉取、构建和部署。

    
