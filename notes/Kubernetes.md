[TOC]

# Kubernetes

多节点之间的container管理 & 编排。

https://docs.docker.com/get-started/overview/



相同功能的有docker swarm、mesos。

## POD

一个或多个容器的最小操作单元

## ReplicaSet

通过一组字段。维护和管理POD。

may never need to manupulate ReplicaSet，use Deployment instead

![image-20231130152959672](C:\Users\h00284904\Documents\ForWork\学习\kubernetes\image-20231130152959672--ReplicaSet及Deployment.png)

## Label

标签和选择算符

## Service

![image-20231130153923991](C:\Users\h00284904\Documents\ForWork\学习\kubernetes\image-20231130153923991--Service.png)



## node

Kubernetes中的工作节点。 

![image-20231130154534477](C:\Users\h00284904\Documents\ForWork\学习\kubernetes\image-20231130154534477--node和Kubernetes集群.png)

![image-20231130154628846](C:\Users\h00284904\Documents\ForWork\学习\kubernetes\image-20231130154628846--Kubernetes集群架构.png)

kubectl: k8s集群的入口  创建poid  各种资源 kubectl ---> kubectl create pod nginx-pod --image=nginx:latest

master 认证授权： 对于整个k8s集群是否有操作权限，或者有什么样的权限

master节点 api server: 接受kubectl的命令，检查语法是否有错误，  

scheduler: 调度， 判断w1\w2 …节点是否满足pod资源分配要求（带宽、内存、CPU）

> 说明： 集群中，master节点一般不承担创建业务的pod.系统pod一般都创建在master节点上。



## 搭建K8s集群



## K8s存储相关的内容及进阶

``` sh
exportfs及exportfs -r

systemctl restart rpcbind & systemctl enable rpcbind

showmount
```





https://note.youdao.com/s/CPsWTGBI

CI/CD

Docker与Kubernetes

