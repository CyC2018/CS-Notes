<!-- TOC -->

- [java 基础](#java-基础)
    - [java 语言基础](#java-语言基础)
    - [IO](#io)
- [jvm](#jvm)
- [java 多线程](#java-多线程)
- [操作系统](#操作系统)
- [计算机网络](#计算机网络)
    - [运输层](#运输层)
- [算法和数结构](#算法和数结构)
    - [HTTP](#http)
- [数据库](#数据库)
- [Linux](#linux)
- [安全](#安全)
- [简历里面的项目](#简历里面的项目)
    - [Storm](#storm)
    - [Zookeeper](#zookeeper)
    - [kafka](#kafka)
    - [hbase](#hbase)
    - [hadoop](#hadoop)
- [开放问题](#开放问题)
- [Others](#others)
    - [memcache](#memcache)

<!-- /TOC -->

# java 基础

## java 语言基础
- java Object 类的常见方法
- java Set Map List 接口和底层实现类的原理
- 抽象类和接口的区别，注意jdk8 接口的新特性
- HashMap 和 ConcurrentHashMap的区别
- String,StringBuffer和StringBuilder的区别
- wait 和 sleep方法的区别
- 动态代理的两种方式，以及区别
- Java序列化的方式
- 传值和传引用的区别，Java是怎么样的，有没有传值引用。
-  @transactional注解在什么情况下会失效，为什么。
-  java 基本类型的自动拆装箱的过程
-  内部类与静态内部类的区别
 

## IO

- java IO 、NIO 、AIO的区别
- nio框架：dubbo的实现原理(了解)
- 

# jvm

- happens before 原理
- Synchronized 在jvm内部是如何实现的
- 类加载过程
- jvm 内存模型
- 强引用、软引用和弱引用的区别
-  volatile 关键字问题
-  jvm 内存结构
-  jvm GC机制，什么情况下触发GC，GC算法有哪些，GC过程如何等等
-  逃逸分析技术
-  标记清除和标记整理算法的理解以及优缺点。
-  eden survivor区的比例，为什么是这个比例，eden survivor的工作过程。
-  JVM如何判断一个对象是否该被GC，可以视为root的都有哪几种类型。
-  Java是否可以GC直接内存
-  双亲委派模型的过程以及优势
-  常见JVM调优参数
-  dump 文件的分析

# java 多线程

- 线程间如何通信
- Synchronized 和 ReentrantLock的区别
- 死锁的产生条件是什么？如何预防死锁？
- 请设计一个死锁例子
-  阻塞队列的实现
-  Excutors 线程池的使用方法
-  Callable和Future的了解
-  notify和notifyall的区别
-  Lock接口有哪些实现类，使用场景是什么。
-  线程池的参数有哪些，在线程池创建一个线程的过程
-  悲观锁，乐观锁，优缺点，CAS有什么缺陷，该如何解决。
-  可重入锁的用处及实现原理，写时复制的过程，读写锁，分段锁（ConcurrentHashMap中的segment）。
- ABC三个线程如何保证顺序执行。
- 线程状态

# 操作系统

- 进程通讯的方式
- 


# 计算机网络

## 运输层

- TCP三次握手，四次挥手
- TCP流量控制，拥塞控制
- TCP 洪泛攻击
- OSI 五层网络协议
- TCP和UDP的区别


# 算法和数结构

- TreeMap如何插入数据：二叉树的左旋，右旋，双旋
- 平衡二叉树的时间复杂度
- Hash算法和二叉树算法分别什么时候用
- 图的广度优先算法和深度优先算法：详见jvm中垃圾回收实现
- B-树和B+树的原理和应用场景
- 十大排序算法的原理和复杂度，最好能够手撕出来。
 

## HTTP

- cookie和session的区别，分布式环境怎么保存用户状态；


# 数据库

- mysql 的索引分类

# Linux

- 

# 安全

- 用过哪些加密算法：对称加密，非对称加密算法；

# 简历里面的项目

## Storm
- storm 的 ACK机制
- storm 的tuple分组机制
- 

## Zookeeper

- ZAB算法的原理
- zookeeper如何实现分布式锁
- zookeeper的选主过程
- zookeeper集群之间如何通讯
- zookeeper的应用场景

## kafka

## hbase

## hadoop


# 开放问题

- 一千万的用户实时排名如何实现
- 五万人并发抢票怎么实现

# Others

## memcache

- 一致性hash算法的实现原理


