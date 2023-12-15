[TOC]



# 发展历程

1. 早期的物理机

2. 虚拟化技术--虚拟机

3. 容器化docker -- 典型的C/S架构，Go语言开发（适合高并发）,[hub.docker.com]()

   ![image-20231129092939522](C:\Users\h00284904\Desktop\image-20231129092939522--dockerArchitecture.png)

   ```sh
   docker pull **
   docker push
   
   docker run -d --name my-tomcat -p 9999:8080 tomcat:8.0
   docker stop **
   
   docker version
   
   docker images/docker ls
   # 取别名
   docker tag
   
   docker ps
   docker rmi -f
   ```

   # Image深入讨论

   ![image-20231129093219217](C:\Users\h00284904\Desktop\image-20231129093219217--Image深入.png)

   在docker中任何一个image：tomcat\redis\mysql，其最底层就是一个最小内核的linux kernel.

   github.com/docker-library

   dockerfile:

   > FROM debian: buster-slim
   >
   > RUN ...
   >
   > CMD [mysqld]

   docker build  [dockerFinleName] .

   

4. 自定义镜像怎么办？

   tomcat、redis、mysql、rocketmq等中间件都已有官方写好了的镜像

   根据image就可以创建出container

   而且image是可以发给不同的人使用的，只要对应机器上安装了DockerEngine即可。

   ``` dockerfile
   FROM openjdk:8
   COPY dockerfile-demo-0.0.1-SNAPSHOT.jar jack-dockerfile-image.jar
   CMD ["java","-jar","jack-dockerfile-image.jar"]
   ```

   

   springboot项目-->image-->container

   ``` shell
   docker build -t jack-dockerfile-image .
   ```

   ```sh
   docker run -d --name sb01 -p 6661:8080 jack-dockerfile-image
   ```

   ```sh
   docker logs [容器名称]
   ```

   

5. image共享给别人使用

   * 需要创建一个镜像

   * 上传到公共的仓库

   * 当前本地需要登录一个公共仓

     ```shell
     sudo docker login -username=hqh registry.cn-hangzhou.aliyuncs.com
     ```

     

   * push到公共仓

     ``` sh
     docker push registry.cn-hangzhou.aliyuncs.com/jack-kubernetes/jack-dockerfile-image
     ```

     

   * 其它人拉取使用

     ``` sh
     docker pull registry.cn-hangzhou.aliyuncs.com/jack-kubernetes/jack-dockerfile-image
     ```

     

   * 

   

   # Container深入探讨

   ![ ](C:\Users\h00284904\Desktop\image-20231129110137511--container.png)

   ```sh
   docker exec -it my-tomcat bash
   cat /etc/issue  
   ```

   能否将已修改的container打包成新的镜像，打包分享给其他人使用----可以。 

   ```sh
   docker commit  [tomcat03] [gupao-customized-tomcat-image]
   ```

   * container常见操作

     ```sh
     docker ps -aq
     docker rm -f conatiner
     docker exec -it 容器名
     docker commit
     # 查看docker占用CPU等资源情况
     docker stats
     # 可以设置container使用资源的上限
     docker run -d --memory 300M --name jack-tomcat-memory-limit tomcat:8.0
     docker run -d --cup-shareds 10 --name jack-tomcat-cpu-limit tomcat:8.0
     ```

     

   * 

6. 为了资源隔离

   * Linux已提供的支持

   ![image-20231129113551798](C:\Users\h00284904\Desktop\image-20231129113551798--linuxKernel.png)

   kernel.org/doc

   * 怎样降低开发或运维人员使用这些技术的门槛--Linux Container(LXC)

     linuxcontainers.org——依然有门槛，更多的还是针对 Linux运维人员，出发点：基于隔离出物理机的资源，为了快速搭建出一个物理机中的虚拟资源

     ​                                   ——未面向app

     docker 在LXC基础上提出了针对具体的app进行隔离解决方案,image,contaner.

     bocker 

   * 

   # Doker数据持久化和网络

   ```sh
   docker volume ls
   # 自定义
   docker volume create 自定义volume名
   docker volume inspect [volume名称]
   docker volume rm -f *
   ```

   

   ## volume数据持久化

   VOLUME /var/lib/mysql，有了VOLUME关键字之后，将容器的/var/lib/mysql实际在对应hosthost上建一个相应目录（在/var/lib/docker/volumes/*下）。

   ```sh
   docker run -d --name hqh-mysql -p 3301:3306 -v hqh-mysql-volume:/var/lib/mysql -e MYSQL_ROOT_PASSWORD=jack666 --privileged mysql:5.7
   ```

   

bind的概念

- -v ~/shop:/usr/local/tomcat/webapps/shop ,少民volume这个层次面试。bind mounting

- 把目录和专门的服务器绑定。

  ## docker中的网络

  https://landscape.cncf.io/?category=container-runtime&grouping=category

  

```sh
# 本地网卡信息
ls /sys/class/net
ip a
ip link

cd /etc/sysconfig/network-scripts
ip addr add ip dev eth0
systemctl restart network
ipup eth0
ipdown eth1

docker network ls
```

不同namespace下的网络

```sh
ip netns add ns1

ip netns add ns2
ip netns add ns3
ip netns list 

ip nets delete ns3 delete ns3

ip netns exec ns1 ip a
ip netns exec ns1 ifup lo

# 创建了veth-ns1和veth-ns2，并成对
ip link add veth-ns1 type veth peer name veth-ns2
# 将各自关联到对应命名空间中
ip link set veth-ns1 netns1 
ip link set veth-ns2 netns2 

ip netns exec ns1  ip addr add 192.168.0.11/24 dev veth-ns1
ip netns exec ns2  ip addr add 192.168.0.12/24 dev veth-ns2

ip netns exec ns1 ip link set veth-ns1 up
ip netns exec ns2 ip link set veth-ns2 up

ip netns exec ns1 ping 192.168.0.12
```

veth pair: virtual ethernet pair,一个虚拟

![image-20231129162902479](C:\Users\h00284904\Desktop\image-20231129162902479--veth.png)

### docker网络之bridge

![image-20231129164624972](C:\Users\h00284904\Desktop\image-20231129164624972--veth2.png)

![image-20231129165011607](C:\Users\h00284904\Desktop\image-20231129165011607--veth4.png)

通过veth-pair彼此之间的通信。

```sh
docker network ls
docker network inspect bridge
# 也可以自定义网侧面
docker network create --subnet=172.18.0.0/24 tomcat-net-name
# 通过docker run命令
docker run -d --name nginx01 -p 6061:80 --network tomcat-net-name

# 将网络添加下
docker network connect tomcat-name-net tomcat2
```

其它模式：none\network ls

各个namespace这间，是共享宿主机分配的带宽，还是分配固定的带宽？——



## 基于Docker搭建MySQL高可用集群

MySQL单机部署--会增加不可用风险，

实现MySQL高可用，搭建MySQL集群，-->伴随要解决数据一致性问题。

### PXC

Percona Xtradb Cluster,percona.com

多主方案+同步复制-->强一制性，

方法(1) 原生 pxc 依赖  一步步手动搭建

（2） docker image方式搭建



![image-20231129174636101](C:\Users\h00284904\Documents\ForWork\学习\docker\docker-mysql.pdf)



```sh
# 获取pxc镜像，其实就相当于获取mysql镜像
docker pull percona/percona-xtradb-cluster:5.7.21

# 设置网络
docker network create -subnet=172.19.0.0/24 pxc-cluster-net bridge

# 数据持久化(后续让容器进行关联)
docker volume create pxc-v1
docker volume create pxc-v2
docker volume create pxc-v3

# 创建容器
docker tag percona/percona-xtradb-clustrer:5.7.21 pxc
docker run -d --name=node1 -p 3301:3306 pxc -e MYSQL_ROOT_PASSWORD=hqh666 -v pxc-v1:/var/lib/mysql -e CLUSTER_NAME=PXC --net=pxc-cluster-net -e XTRBACKUP_PASSWORD=hqh666 pxc

docker run -d --name=node2 -p 3302:3306 pxc -e MYSQL_ROOT_PASSWORD=hqh666 -v pxc-v2:/var/lib/mysql -e CLUSTER_NAME=PXC --net=pxc-cluster-net -e XTRBACKUP_PASSWORD=hqh666 -e CLUSTER_JOIN=node1 pxc


docker run -d --name=node3 -p 3303:3306 pxc -e MYSQL_ROOT_PASSWORD=hqh666 -v pxc-v3:/var/lib/mysql -e CLUSTER_NAME=PXC --net=pxc-cluster-net -e XTRBACKUP_PASSWORD=hqh666 -e CLUSTER_JOIN=node1 pxc
```

InnoDB cluster: 一主多从



## docker compose【一步创建多个容器--单台】-->docker  swarm/Meos/kubernetes【一步创建多个容器--多台】

（1）安装docker-compose

```shell
sudo curl -L "https://github.com/docker/compose/release/download/1.24.1/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
```



（2）定义一个yaml文件

```yaml
version: "3.9"
# service <---->container
services: 
  # 第一个container名字
  web:
    # 本地 image Dockerfile
    build: .
    # -p 5000：5000
    ports:
      - "8000:5000"
  # 第二个container名字
  redis:
    image: "redis:alpine"
    
networks:
  app-net:
    driver: bridge
```



（3）通过docker compose一键启动

```sh
docker compose up
```



## 容器编排&容器管理

如果是docker单机环境，其实docker compose也就够用了

但是因为一台宿主机器资源毕竟有限，所以肯定是希望多台docker组成的集群环境，就需要一起管理容器。

Docker Swarm、Mesos、Kubernetes

* Docker Swarm

  scheduler——调度、计算   

  network

  health

  discovery——manager要知道work node在哪，w-->信息注册到manager
