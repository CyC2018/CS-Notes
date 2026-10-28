# 学习路线 - Java 后端
<!-- GFM-TOC -->
* [学习路线 - Java 后端](#学习路线---java-后端)
    * [一、说明](#一说明)
    * [二、开始之前](#二开始之前)
    * [三、每天的安排](#三每天的安排)
    * [四、Java 基础](#四java-基础)
        * [第 1 天：数据类型与 String](#第-1-天数据类型与-string)
        * [第 2 天：常量池与运算](#第-2-天常量池与运算)
        * [第 3 天：关键字与 Object 的方法](#第-3-天关键字与-object-的方法)
        * [第 4 天：继承与多态](#第-4-天继承与多态)
        * [第 5 天：反射、异常、泛型与新特性](#第-5-天反射异常泛型与新特性)
    * [五、Java 容器](#五java-容器)
        * [第 6 天：集合与 List](#第-6-天集合与-list)
        * [第 7 天：HashMap](#第-7-天hashmap)
        * [第 8 天：ConcurrentHashMap 与 LinkedHashMap](#第-8-天concurrenthashmap-与-linkedhashmap)
    * [六、Java 并发](#六java-并发)
        * [第 9 天：线程与线程池](#第-9-天线程与线程池)
        * [第 10 天：中断与互斥同步](#第-10-天中断与互斥同步)
        * [第 11 天：线程协作与线程状态](#第-11-天线程协作与线程状态)
        * [第 12 天：J.U.C 的常用组件](#第-12-天juc-的常用组件)
        * [第 13 天：Java 内存模型与 volatile](#第-13-天java-内存模型与-volatile)
        * [第 14 天：线程安全与 CAS](#第-14-天线程安全与-cas)
        * [第 15 天：ThreadLocal 与锁优化](#第-15-天threadlocal-与锁优化)
    * [七、Java 虚拟机](#七java-虚拟机)
        * [第 16 天：运行时数据区域](#第-16-天运行时数据区域)
        * [第 17 天：对象存活与垃圾收集算法](#第-17-天对象存活与垃圾收集算法)
        * [第 18 天：垃圾收集器](#第-18-天垃圾收集器)
        * [第 19 天：三色标记与内存分配](#第-19-天三色标记与内存分配)
        * [第 20 天：类加载机制](#第-20-天类加载机制)
        * [第 21 天：线上问题排查](#第-21-天线上问题排查)
    * [八、MySQL](#八mysql)
        * [第 22 天：事务、并发一致性与锁](#第-22-天事务并发一致性与锁)
        * [第 23 天：隔离级别与 MVCC](#第-23-天隔离级别与-mvcc)
        * [第 24 天：Next-Key Lock 与死锁](#第-24-天next-key-lock-与死锁)
        * [第 25 天：B+ 树与索引的类型](#第-25-天b-树与索引的类型)
        * [第 26 天：索引的使用](#第-26-天索引的使用)
        * [第 27 天：查询性能优化](#第-27-天查询性能优化)
        * [第 28 天：存储引擎、切分与复制](#第-28-天存储引擎切分与复制)
        * [第 29 天：日志](#第-29-天日志)
    * [九、Redis 与缓存](#九redis-与缓存)
        * [第 30 天：Redis 的数据类型](#第-30-天redis-的数据类型)
        * [第 31 天：使用场景与底层结构](#第-31-天使用场景与底层结构)
        * [第 32 天：过期、淘汰、持久化与事务](#第-32-天过期淘汰持久化与事务)
        * [第 33 天：线程模型、复制与集群](#第-33-天线程模型复制与集群)
        * [第 34 天：缓存的位置与三种问题](#第-34-天缓存的位置与三种问题)
        * [第 35 天：缓存一致性与一致性哈希](#第-35-天缓存一致性与一致性哈希)
    * [十、计算机网络](#十计算机网络)
        * [第 36 天：TCP 的连接管理](#第-36-天tcp-的连接管理)
        * [第 37 天：可靠传输与拥塞控制](#第-37-天可靠传输与拥塞控制)
        * [第 38 天：HTTP 基础](#第-38-天http-基础)
        * [第 39 天：连接管理与 Cookie](#第-39-天连接管理与-cookie)
        * [第 40 天：缓存、WebSocket 与跨域](#第-40-天缓存websocket-与跨域)
        * [第 41 天：HTTPS](#第-41-天https)
        * [第 42 天：HTTP 的版本、GET 与 POST、DNS](#第-42-天http-的版本get-与-postdns)
        * [第 43 天：从输入 URL 到显示页面](#第-43-天从输入-url-到显示页面)
    * [十一、操作系统](#十一操作系统)
        * [第 44 天：进程与线程](#第-44-天进程与线程)
        * [第 45 天：系统调用、进程同步与通信](#第-45-天系统调用进程同步与通信)
        * [第 46 天：死锁](#第-46-天死锁)
        * [第 47 天：内存管理](#第-47-天内存管理)
        * [第 48 天：I/O 多路复用](#第-48-天io-多路复用)
    * [十二、Spring 与设计模式](#十二spring-与设计模式)
        * [第 49 天：IoC 与 Bean](#第-49-天ioc-与-bean)
        * [第 50 天：AOP 与事务](#第-50-天aop-与事务)
        * [第 51 天：Spring Boot、Spring MVC 与 MyBatis](#第-51-天spring-bootspring-mvc-与-mybatis)
        * [第 52 天：设计模式](#第-52-天设计模式)
    * [十三、分布式与消息队列](#十三分布式与消息队列)
        * [第 53 天：微服务](#第-53-天微服务)
        * [第 54 天：分布式锁](#第-54-天分布式锁)
        * [第 55 天：分布式事务与 CAP](#第-55-天分布式事务与-cap)
        * [第 56 天：RPC、分布式 ID 与幂等](#第-56-天rpc分布式-id-与幂等)
        * [第 57 天：消息队列的作用与可靠性](#第-57-天消息队列的作用与可靠性)
        * [第 58 天：顺序、积压与延迟消息](#第-58-天顺序积压与延迟消息)
        * [第 59 天：Kafka](#第-59-天kafka)
    * [十四、系统设计](#十四系统设计)
        * [第 60 天：性能与可用性](#第-60-天性能与可用性)
        * [第 61 天：秒杀与抢红包](#第-61-天秒杀与抢红包)
        * [第 62 天：海量数据、短链与 Feed 流](#第-62-天海量数据短链与-feed-流)
        * [第 63 天：高并发系统的设计](#第-63-天高并发系统的设计)
        * [第 64 天：Docker](#第-64-天docker)
        * [第 65 天：Kubernetes](#第-65-天kubernetes)
<!-- GFM-TOC -->


## 一、说明

适合会 Java 语法、准备 Java 后端面试的读者，每天约 1～1.5 小时；没有计算机基础的先学[零基础](学习路线%20-%20零基础.md)。

每天先读完阅读范围，再不看笔记回答自测题，答完打开链接核对。选读可以跳过；算法题先独立做 20～30 分钟，做不出来再看题解。

## 二、开始之前

本路线不讲语法。开始前先确认能独立写出下面 5 个程序：

1. 定义订单类 Order（订单号、用户 ID、以分为单位的金额、状态），把 3 个订单放进 List，按金额从高到低排序后打印；
2. 用 HashMap 统计一组菜名中每道菜的份数，按份数从多到少输出；
3. 逐行读取 orders.txt，每行是“订单号,金额”，累加总金额，格式不对的行打印行号后跳过；
4. 用枚举表示订单状态 CREATED、PAID、SHIPPED、REFUNDED，写一个方法判断两个状态之间能否转换；
5. 定义接口 Discount 和两个实现类（满 30 减 5、打九折），分别计算同一笔订单优惠后的金额。

写不出来的，先补对应的语法：类与 List 排序、Map、文件读写与异常、枚举与 switch、接口与多态。

## 三、每天的安排

| 天 | 主题 | 阅读 | 算法 |
| :-: | --- | --- | --- |
|  | **Java 基础** |  |  |
| [1](#第-1-天数据类型与-string) | 数据类型与 String | Java 基础：数据类型～String, StringBuffer and StringBuilder | 1. 两数之和 |
| [2](#第-2-天常量池与运算) | 常量池与运算 | Java 基础：String Pool～运算 | 128. 最长连续序列 |
| [3](#第-3-天关键字与-object-的方法) | 关键字与 Object 的方法 | Java 基础：关键字～Object 通用方法 | 560. 和为 K 的子数组 |
| [4](#第-4-天继承与多态) | 继承与多态 | 面向对象思想：三大特性；Java 基础：继承 | 54. 螺旋矩阵 |
| [5](#第-5-天反射异常泛型与新特性) | 反射、异常、泛型与新特性 | Java 基础：反射～特性 | 56. 合并区间 |
|  | **Java 容器** |  |  |
| [6](#第-6-天集合与-list) | 集合与 List | Java 容器：集合概览～CopyOnWriteArrayList | 88. 合并两个有序数组 |
| [7](#第-7-天hashmap) | HashMap | Java 容器：HashMap | 15. 三数之和 |
| [8](#第-8-天concurrenthashmap-与-linkedhashmap) | ConcurrentHashMap 与 LinkedHashMap | Java 容器：ConcurrentHashMap～WeakHashMap | 11. 盛最多水的容器 |
|  | **Java 并发** |  |  |
| [9](#第-9-天线程与线程池) | 线程与线程池 | Java 并发：使用线程～基础线程机制 | 3. 无重复字符的最长子串 |
| [10](#第-10-天中断与互斥同步) | 中断与互斥同步 | Java 并发：中断～互斥同步 | 415. 字符串相加 |
| [11](#第-11-天线程协作与线程状态) | 线程协作与线程状态 | Java 并发：线程之间的协作～线程状态 | 165. 比较版本号 |
| [12](#第-12-天juc-的常用组件) | J.U.C 的常用组件 | Java 并发：J.U.C - AQS～J.U.C - 其它组件 | 206. 反转链表 |
| [13](#第-13-天java-内存模型与-volatile) | Java 内存模型与 volatile | Java 并发：线程不安全示例～Java 内存模型 | 21. 合并两个有序链表 |
| [14](#第-14-天线程安全与-cas) | 线程安全与 CAS | Java 并发：线程安全～非阻塞同步 | 141. 环形链表 |
| [15](#第-15-天threadlocal-与锁优化) | ThreadLocal 与锁优化 | Java 并发：无同步方案～多线程开发良好的实践 | 160. 相交链表 |
|  | **Java 虚拟机** |  |  |
| [16](#第-16-天运行时数据区域) | 运行时数据区域 | Java 虚拟机：运行时数据区域 | 92. 反转链表 II |
| [17](#第-17-天对象存活与垃圾收集算法) | 对象存活与垃圾收集算法 | Java 虚拟机：垃圾收集～Stop The World | 143. 重排链表 |
| [18](#第-18-天垃圾收集器) | 垃圾收集器 | Java 虚拟机：垃圾收集器 | 19. 删除链表的倒数第 N 个结点 |
| [19](#第-19-天三色标记与内存分配) | 三色标记与内存分配 | Java 虚拟机：三色标记～内存分配与回收策略 | 82. 删除排序链表中的重复元素 II |
| [20](#第-20-天类加载机制) | 类加载机制 | Java 虚拟机：类加载机制 | 142. 环形链表 II |
| [21](#第-21-天线上问题排查) | 线上问题排查 | Java 虚拟机：线上问题排查；Linux：线上问题排查 | 148. 排序链表 |
|  | **MySQL** |  |  |
| [22](#第-22-天事务并发一致性与锁) | 事务、并发一致性与锁 | 数据库系统原理：事务～封锁 | 2. 两数相加 |
| [23](#第-23-天隔离级别与-mvcc) | 隔离级别与 MVCC | 数据库系统原理：隔离级别～多版本并发控制 | 146. LRU 缓存 |
| [24](#第-24-天next-key-lock-与死锁) | Next-Key Lock 与死锁 | 数据库系统原理：Next-Key Locks；计算机操作系统 - 死锁：MySQL 死锁 | 20. 有效的括号 |
| [25](#第-25-天b-树与索引的类型) | B+ 树与索引的类型 | MySQL：B+ Tree 原理～索引的优点 | 232. 用栈实现队列 |
| [26](#第-26-天索引的使用) | 索引的使用 | MySQL：索引的使用条件～索引失效 | 155. 最小栈 |
| [27](#第-27-天查询性能优化) | 查询性能优化 | MySQL：查询性能优化 | 394. 字符串解码 |
| [28](#第-28-天存储引擎切分与复制) | 存储引擎、切分与复制 | MySQL：存储引擎～MySQL 复制 | 739. 每日温度 |
| [29](#第-29-天日志) | 日志 | MySQL：MySQL 的日志 | 704. 二分查找 |
|  | **Redis 与缓存** |  |  |
| [30](#第-30-天redis-的数据类型) | Redis 的数据类型 | Redis：Redis 概述～Redis 的数据类型 | 33. 搜索旋转排序数组 |
| [31](#第-31-天使用场景与底层结构) | 使用场景与底层结构 | Redis：Redis 的使用场景～Redis 的数据结构 | 34. 在排序数组中查找元素的第一个和最后一个位置 |
| [32](#第-32-天过期淘汰持久化与事务) | 过期、淘汰、持久化与事务 | Redis：Redis 与 Memcached～Redis 事务 | 153. 寻找旋转排序数组中的最小值 |
| [33](#第-33-天线程模型复制与集群) | 线程模型、复制与集群 | Redis：Redis 的事件～Redis 分片 | 215. 数组中的第 K 个最大元素 |
| [34](#第-34-天缓存的位置与三种问题) | 缓存的位置与三种问题 | 缓存：缓存特征～缓存雪崩 | 347. 前 K 个高频元素 |
| [35](#第-35-天缓存一致性与一致性哈希) | 缓存一致性与一致性哈希 | 缓存：缓存一致性～LRU | 912. 排序数组（手写快速排序） |
|  | **计算机网络** |  |  |
| [36](#第-36-天tcp-的连接管理) | TCP 的连接管理 | 计算机网络 - 传输层：UDP 和 TCP 的特点～TCP 的四次挥手 | 101. 对称二叉树 |
| [37](#第-37-天可靠传输与拥塞控制) | 可靠传输与拥塞控制 | 计算机网络 - 传输层：TCP 可靠传输～在 UDP 上实现可靠传输 | 104. 二叉树的最大深度 |
| [38](#第-38-天http-基础) | HTTP 基础 | HTTP：HTTP 基础概念～HTTP 首部 | 102. 二叉树的层序遍历 |
| [39](#第-39-天连接管理与-cookie) | 连接管理与 Cookie | HTTP：连接管理～Cookie | 103. 二叉树的锯齿形层序遍历 |
| [40](#第-40-天缓存websocket-与跨域) | 缓存、WebSocket 与跨域 | HTTP：HTTP 缓存～跨域 | 236. 二叉树的最近公共祖先 |
| [41](#第-41-天https) | HTTPS | HTTP：HTTPS | 199. 二叉树的右视图 |
| [42](#第-42-天http-的版本get-与-postdns) | HTTP 的版本、GET 与 POST、DNS | HTTP：HTTP/1.1 新特性～GET 和 POST 比较；计算机网络 - 应用层：域名系统 | 105. 从前序与中序遍历序列构造二叉树 |
| [43](#第-43-天从输入-url-到显示页面) | 从输入 URL 到显示页面 | 计算机网络 - 应用层：Web 页面请求过程；攻击技术：跨站脚本攻击～SQL 注入攻击 | 98. 验证二叉搜索树 |
|  | **操作系统** |  |  |
| [44](#第-44-天进程与线程) | 进程与线程 | 计算机操作系统 - 进程管理：进程与线程～进程状态的切换 | 200. 岛屿数量 |
| [45](#第-45-天系统调用进程同步与通信) | 系统调用、进程同步与通信 | 计算机操作系统 - 概述：系统调用；计算机操作系统 - 进程管理：进程调度算法～进程通信 | 46. 全排列 |
| [46](#第-46-天死锁) | 死锁 | 计算机操作系统 - 死锁：必要条件～程序中的死锁 | 93. 复原 IP 地址 |
| [47](#第-47-天内存管理) | 内存管理 | 计算机操作系统 - 内存管理：虚拟内存～分页与分段的比较 | 22. 括号生成 |
| [48](#第-48-天io-多路复用) | I/O 多路复用 | Socket：I/O 模型～I/O 复用 | 78. 子集 |
|  | **Spring 与设计模式** |  |  |
| [49](#第-49-天ioc-与-bean) | IoC 与 Bean | Spring：IoC 与 Bean | 39. 组合总和 |
| [50](#第-50-天aop-与事务) | AOP 与事务 | Spring：AOP～事务 | 121. 买卖股票的最佳时机 |
| [51](#第-51-天spring-bootspring-mvc-与-mybatis) | Spring Boot、Spring MVC 与 MyBatis | Spring：Spring Boot 自动配置～Spring 中的设计模式 | 70. 爬楼梯 |
| [52](#第-52-天设计模式) | 设计模式 | 设计模式 - 目录：设计模式前言；设计模式  - 单例：单例（Singleton）；设计模式 - 策略：策略（Strategy）；面向对象思想：设计原则 | 53. 最大子数组和 |
|  | **分布式与消息队列** |  |  |
| [53](#第-53-天微服务) | 微服务 | 微服务：从单体到微服务～网关 | 5. 最长回文子串 |
| [54](#第-54-天分布式锁) | 分布式锁 | 分布式：分布式锁 | 300. 最长递增子序列 |
| [55](#第-55-天分布式事务与-cap) | 分布式事务与 CAP | 分布式：分布式事务～BASE | 1143. 最长公共子序列 |
| [56](#第-56-天rpc分布式-id-与幂等) | RPC、分布式 ID 与幂等 | 分布式：RPC～幂等 | 322. 零钱兑换 |
| [57](#第-57-天消息队列的作用与可靠性) | 消息队列的作用与可靠性 | 消息队列：消息模型～消息队列的可靠性 | 64. 最小路径和 |
| [58](#第-58-天顺序积压与延迟消息) | 顺序、积压与延迟消息 | 消息队列：顺序性～延迟消息与死信队列 | 198. 打家劫舍 |
| [59](#第-59-天kafka) | Kafka | 消息队列：Kafka | 42. 接雨水 |
|  | **系统设计** |  |  |
| [60](#第-60-天性能与可用性) | 性能与可用性 | 系统设计基础：性能～安全性 | 239. 滑动窗口最大值 |
| [61](#第-61-天秒杀与抢红包) | 秒杀与抢红包 | 系统设计基础：秒杀系统 | 76. 最小覆盖子串 |
| [62](#第-62-天海量数据短链与-feed-流) | 海量数据、短链与 Feed 流 | 系统设计基础：海量数据处理～Feed 流 | 25. K 个一组翻转链表 |
| [63](#第-63-天高并发系统的设计) | 高并发系统的设计 | 系统设计基础：高并发系统的设计 | 23. 合并 K 个升序链表 |
| [64](#第-64-天docker) | Docker | Docker：解决的问题～镜像与容器 | 124. 二叉树中的最大路径和 |
| [65](#第-65-天kubernetes) | Kubernetes | Docker：Kubernetes | 72. 编辑距离 |

## 四、Java 基础

### 第 1 天：数据类型与 String

从基本类型和包装类型开始。缓存池解释了 Integer 用 == 比较时 127 和 128 结果不同的原因；String 的不可变是后面理解常量池和线程安全的前提。

阅读：《Java 基础》从[数据类型](Java%20基础.md#一数据类型)读到[String, StringBuffer and StringBuilder](Java%20基础.md#string-stringbuffer-and-stringbuilder)。

自测：

1. String、StringBuffer 和 StringBuilder 有什么区别？（见[String, StringBuffer and StringBuilder](Java%20基础.md#string-stringbuffer-and-stringbuilder)）
2. String 为什么设计成不可变的？（见[不可变的好处](Java%20基础.md#不可变的好处)）
3. Integer a = 127, b = 127 时 a == b 的结果是什么？换成 128 呢？（见[缓存池](Java%20基础.md#缓存池)）

动手：运行[附录 A1](Java%20基础.md#a1-包装类型的缓存池)的代码，对照 Integer.valueOf() 的实现解释 127 和 128 的结果为什么不同。

算法（哈希表，简单）：[1. 两数之和](https://leetcode.cn/problems/two-sum/)，题解见[数组中两个数的和为给定值](Leetcode%20题解%20-%20哈希表.md#1-数组中两个数的和为给定值)。

### 第 2 天：常量池与运算

常量池决定了两个相同的字面量是不是同一个对象。运算一节中最常被问到的是参数传递。

阅读：《Java 基础》从[String Pool](Java%20基础.md#string-pool)读到[运算](Java%20基础.md#三运算)。

自测：

1. new String("abc") 会创建几个对象？（见[new String("abc")](Java%20基础.md#new-stringabc)）
2. Java 是值传递还是引用传递？（见[参数传递](Java%20基础.md#参数传递)）

动手：运行[附录 A2](Java%20基础.md#a2-字符串的存储)的代码，观察字面量和 new 出来的字符串是否共享同一个字节数组。

算法（哈希表，中等）：[128. 最长连续序列](https://leetcode.cn/problems/longest-consecutive-sequence/)，题解见[最长连续序列](Leetcode%20题解%20-%20哈希表.md#4-最长连续序列)。

### 第 3 天：关键字与 Object 的方法

static 一节的初始化顺序可以对照代码自己推一遍。equals() 和 hashCode() 的约定是理解 HashMap 的前提；clone() 掌握深拷贝与浅拷贝的区别即可。

阅读：《Java 基础》从[关键字](Java%20基础.md#四关键字)读到[Object 通用方法](Java%20基础.md#五object-通用方法)。

自测：

1. == 和 equals() 有什么区别？（见[等价与相等](Java%20基础.md#2-等价与相等)）
2. 重写 equals() 时为什么必须重写 hashCode()？（见[hashCode()](Java%20基础.md#hashcode)）
3. 浅拷贝和深拷贝有什么区别？怎样实现深拷贝？（见[clone()](Java%20基础.md#clone)）

动手：写一个只重写了 equals()、没有重写 hashCode() 的类，把两个相等的对象放进 HashSet，观察 size() 的结果，再补上 hashCode() 对比。

算法（哈希表，中等）：[560. 和为 K 的子数组](https://leetcode.cn/problems/subarray-sum-equals-k/)，题解见[和为 K 的子数组](Leetcode%20题解%20-%20哈希表.md#5-和为-k-的子数组)。

### 第 4 天：继承与多态

先读面向对象的三大特性，再读 Java 中的实现：访问权限、抽象类与接口、重写与重载。多态一节说明了运行时怎样找到被调用的方法。

阅读：《面向对象思想》的[三大特性](面向对象思想.md#一三大特性)；《Java 基础》的[继承](Java%20基础.md#六继承)。

自测：

1. 抽象类和接口有什么区别？分别用在什么场景？（见[比较](Java%20基础.md#3-比较)、[使用选择](Java%20基础.md#4-使用选择)）
2. 重载和重写有什么区别？（见[重写与重载](Java%20基础.md#重写与重载)）
3. 多态是怎么实现的？（见[多态](面向对象思想.md#多态)）

动手：按[附录 A1](面向对象思想.md#a1-方法调用的字节码)的步骤，用 javap -c 查看重载和重写分别编译成了哪条调用指令。

算法（数组，中等）：[54. 螺旋矩阵](https://leetcode.cn/problems/spiral-matrix/)，题解见[剑指 Offer 29](29.%20顺时针打印矩阵.md)。

### 第 5 天：反射、异常、泛型与新特性

反射是 Spring 等框架的基础，读时留意它的代价。异常一节重点看 finally 与 return 的执行顺序；Java 与 C++ 的比较可以略读。

阅读：《Java 基础》从[反射](Java%20基础.md#七反射)读到[特性](Java%20基础.md#十一特性)。选读：[对象操作](Java%20IO.md#五对象操作)。

自测：

1. 反射的原理是什么？有哪些应用场景？（见[反射](Java%20基础.md#七反射)）
2. try 和 catch 中有 return 时，finally 还会执行吗？返回值是什么？（见[异常](Java%20基础.md#八异常)）
3. 什么是泛型擦除？（见[泛型](Java%20基础.md#九泛型)）

动手：运行[附录 A6](Java%20基础.md#a6-finally-的执行顺序与返回值)的代码，先预测每个方法的返回值再对照输出。

算法（数组，中等）：[56. 合并区间](https://leetcode.cn/problems/merge-intervals/)，题解见[合并区间](Leetcode%20题解%20-%20数组与矩阵.md#13-合并区间)。

综合题：设计一个 Order 类作为 HashMap 的键：需要重写哪些方法？字段为什么最好用 final？要复制一个订单时用浅拷贝还是深拷贝？（见[equals()](Java%20基础.md#equals)、[hashCode()](Java%20基础.md#hashcode)、[final](Java%20基础.md#final)、[clone()](Java%20基础.md#clone)）

## 五、Java 容器

### 第 6 天：集合与 List

先看集合框架的全貌，再看 List 的几种实现。Vector 已经很少使用，可以略读；ArrayList 的扩容和 fail-fast 要读懂。

阅读：《Java 容器》从[集合概览](Java%20容器.md#一概览)读到[CopyOnWriteArrayList](Java%20容器.md#copyonwritearraylist)。

自测：

1. ArrayList 和 LinkedList 有什么区别？分别用在什么场景？（见[与 ArrayList 的比较](Java%20容器.md#2-与-arraylist-的比较)）
2. ArrayList 是怎样扩容的？（见[扩容](Java%20容器.md#2-扩容)）
3. 线程安全的 List 有哪些？CopyOnWriteArrayList 适合什么场景？（见[CopyOnWriteArrayList](Java%20容器.md#copyonwritearraylist)）

动手：运行[附录 A1](Java%20容器.md#a1-arraylist-的扩容与常见陷阱)和[附录 A3](Java%20容器.md#a3-arraylist-的并发写入)的代码，观察扩容时数组长度的变化，以及并发写入时丢失的元素。

算法（双指针，简单）：[88. 合并两个有序数组](https://leetcode.cn/problems/merge-sorted-array/)，题解见[归并两个有序数组](Leetcode%20题解%20-%20双指针.md#5-归并两个有序数组)。

### 第 7 天：HashMap

HashMap 是 Java 面试中问得最多的容器。按存储结构、put、桶下标、扩容的顺序读，计算数组容量一节可以略读。

阅读：《Java 容器》的[HashMap](Java%20容器.md#hashmap)。选读：[进阶：HashMap](Java%20容器%20-%20进阶.md#hashmap)。

自测：

1. HashMap 的 put() 过程是怎样的？（见[put 操作](Java%20容器.md#3-put-操作)）
2. HashMap 是怎样扩容的？为什么容量是 2 的幂？（见[扩容-基本原理](Java%20容器.md#5-扩容-基本原理)、[确定桶下标](Java%20容器.md#4-确定桶下标)）
3. HashMap 为什么线程不安全？（见[线程安全](Java%20容器.md#10-线程安全)）

动手：运行[附录 A4](Java%20容器.md#a4-hashmap-链表转红黑树)的代码，观察桶中节点在什么时候从链表变成红黑树，又在什么时候变回来。

算法（双指针，中等）：[15. 三数之和](https://leetcode.cn/problems/3sum/)，题解见[三数之和](Leetcode%20题解%20-%20双指针.md#8-三数之和)。

### 第 8 天：ConcurrentHashMap 与 LinkedHashMap

ConcurrentHashMap 重点比较 JDK 1.7 的分段锁和 1.8 的桶级锁。LinkedHashMap 按访问顺序排列时可以直接实现 LRU 缓存；WeakHashMap 可以略读。

阅读：《Java 容器》从[ConcurrentHashMap](Java%20容器.md#concurrenthashmap)读到[WeakHashMap](Java%20容器.md#weakhashmap)。选读：[进阶：ConcurrentHashMap](Java%20容器%20-%20进阶.md#concurrenthashmap)。

自测：

1. ConcurrentHashMap 怎样保证线程安全？JDK 1.7 和 1.8 有什么区别？（见[JDK 1.8 的改动](Java%20容器.md#3-jdk-18-的改动)）
2. ConcurrentHashMap 是怎样扩容的？size() 为什么不精确？（见[JDK 1.8 的改动](Java%20容器.md#3-jdk-18-的改动)）
3. 怎样用 LinkedHashMap 实现 LRU 缓存？（见[LRU 缓存](Java%20容器.md#lru-缓存)）

动手：运行[附录 A2](Java%20容器.md#a2-hashmap-的并发写入)的代码，再把 HashMap 换成 ConcurrentHashMap 运行一次，对比 size 的结果。

算法（双指针，中等）：[11. 盛最多水的容器](https://leetcode.cn/problems/container-with-most-water/)。

综合题：实现一个容量固定的本地缓存：选用哪种容器？怎样淘汰最久没有访问的数据？多个线程同时访问时要注意什么？（见[LRU 缓存](Java%20容器.md#lru-缓存)、[ConcurrentHashMap](Java%20容器.md#concurrenthashmap)）

## 六、Java 并发

### 第 9 天：线程与线程池

先看创建线程的几种方式，再看线程池。ThreadPoolExecutor 一节是本章的重点：核心参数、任务提交后的处理顺序和拒绝策略都要能讲清。

阅读：《Java 并发》从[使用线程](Java%20并发.md#一使用线程)读到[基础线程机制](Java%20并发.md#二基础线程机制)。

自测：

1. 线程池的核心参数有哪些？（见[ThreadPoolExecutor](Java%20并发.md#threadpoolexecutor)）
2. 提交一个任务后，线程池是怎样处理的？为什么先放进队列，队列满了才创建新线程？（见[ThreadPoolExecutor](Java%20并发.md#threadpoolexecutor)）
3. 线程池有哪些拒绝策略？怎样选择？（见[ThreadPoolExecutor](Java%20并发.md#threadpoolexecutor)）

动手：读懂正文中的 SimplePool，运行[附录 A6](Java%20并发.md#a6-简化版线程池)的代码，说出它与 ThreadPoolExecutor 相比少了哪些功能。

算法（滑动窗口，中等）：[3. 无重复字符的最长子串](https://leetcode.cn/problems/longest-substring-without-repeating-characters/)，题解见[剑指 Offer 48](48.%20最长不含重复字符的子字符串.md)。

### 第 10 天：中断与互斥同步

中断是让线程停下来的协作方式，线程池的 shutdownNow() 就靠它实现。互斥同步重点比较 synchronized 和 ReentrantLock。

阅读：《Java 并发》从[中断](Java%20并发.md#三中断)读到[互斥同步](Java%20并发.md#四互斥同步)。

自测：

1. 怎样停止一个正在运行的线程？（见[中断](Java%20并发.md#三中断)）
2. shutdown() 和 shutdownNow() 有什么区别？（见[Executor 的中断操作](Java%20并发.md#executor-的中断操作)）
3. synchronized 和 ReentrantLock 有什么区别？（见[synchronized 与 ReentrantLock 的比较](Java%20并发.md#比较)）

动手：运行[附录 A2](Java%20并发.md#a2-公平锁与非公平锁)的代码，比较公平锁与非公平锁的耗时并解释原因。

算法（字符串，简单）：[415. 字符串相加](https://leetcode.cn/problems/add-strings/)，题解见[字符串加法](Leetcode%20题解%20-%20数学.md#2-字符串加法)。

### 第 11 天：线程协作与线程状态

wait() 和 notify() 必须在 synchronized 中调用，读时想一想为什么。线程状态之间的转换可以对照前面几节的方法来理解。

阅读：《Java 并发》从[线程之间的协作](Java%20并发.md#五线程之间的协作)读到[线程状态](Java%20并发.md#六线程状态)。

自测：

1. wait() 和 sleep() 有什么区别？（见[wait() notify() notifyAll()](Java%20并发.md#wait-notify-notifyall)）
2. 线程有哪些状态？状态之间怎样转换？（见[线程状态](Java%20并发.md#六线程状态)）
3. 两个线程交替打印 1～100 怎样实现？（见[交替打印](Java%20并发.md#交替打印)）

动手：不看笔记，分别用 wait()/notify() 和 Semaphore 实现两个线程交替打印 1～100，再与[交替打印](Java%20并发.md#交替打印)一节的写法对比。

算法（字符串，中等）：[165. 比较版本号](https://leetcode.cn/problems/compare-version-numbers/)，题解见[比较版本号](Leetcode%20题解%20-%20字符串.md#12-比较版本号)。

### 第 12 天：J.U.C 的常用组件

这两章介绍 J.U.C 中常用的工具类，重点是 CountDownLatch、CyclicBarrier、CompletableFuture 和 BlockingQueue 的用途，ForkJoin 可以略读。

阅读：《Java 并发》从[J.U.C - AQS](Java%20并发.md#七juc---aqs)读到[J.U.C - 其它组件](Java%20并发.md#八juc---其它组件)。

自测：

1. CountDownLatch 和 CyclicBarrier 有什么区别？（见[CyclicBarrier](Java%20并发.md#cyclicbarrier)）
2. CompletableFuture 解决了 Future 的什么问题？（见[CompletableFuture](Java%20并发.md#completablefuture)）
3. 怎样用 BlockingQueue 实现生产者消费者？（见[BlockingQueue](Java%20并发.md#blockingqueue)）

动手：用 CompletableFuture 并行查询“商品信息”和“库存”两个模拟接口（各 sleep 200 毫秒），合并结果后输出，比较串行和并行的总耗时。

算法（链表，简单）：[206. 反转链表](https://leetcode.cn/problems/reverse-linked-list/)，题解见[链表反转](Leetcode%20题解%20-%20链表.md#2-链表反转)。

### 第 13 天：Java 内存模型与 volatile

从一个线程不安全的例子开始，Java 内存模型解释了问题的来源：原子性、可见性和有序性。内存间交互操作可以略读，volatile 和先行发生原则要读懂。

阅读：《Java 并发》从[线程不安全示例](Java%20并发.md#九线程不安全示例)读到[Java 内存模型](Java%20并发.md#十java-内存模型)。

自测：

1. volatile 能保证什么？为什么 volatile 修饰的 i++ 仍然不安全？（见[volatile](Java%20并发.md#volatile)、[可见性](Java%20并发.md#2-可见性)）
2. volatile 和 synchronized 有什么区别？（见[volatile](Java%20并发.md#volatile)）
3. 什么是先行发生（happens-before）原则？（见[先行发生原则](Java%20并发.md#先行发生原则)）

动手：运行[附录 A3](Java%20并发.md#a3-volatile-与循环条件)的代码，分别不加和加上 volatile，观察循环能否结束。

算法（链表，简单）：[21. 合并两个有序链表](https://leetcode.cn/problems/merge-two-sorted-lists/)，题解见[归并两个有序的链表](Leetcode%20题解%20-%20链表.md#3-归并两个有序的链表)。

### 第 14 天：线程安全与 CAS

线程安全的实现方式有不可变、互斥同步、非阻塞同步和无同步方案四类。本节重点是 CAS：它的原理、ABA 问题，以及乐观锁和悲观锁的取舍。

阅读：《Java 并发》从[线程安全](Java%20并发.md#十一线程安全)读到[非阻塞同步](Java%20并发.md#非阻塞同步)。

自测：

1. 什么是线程安全？怎样保证线程安全？（见[线程安全](Java%20并发.md#十一线程安全)）
2. CAS 的原理是什么？ABA 问题怎么解决？（见[CAS](Java%20并发.md#1-cas)、[ABA](Java%20并发.md#3-aba)）
3. 乐观锁和悲观锁有什么区别？（见[乐观锁与悲观锁](Java%20并发.md#4-乐观锁与悲观锁)）

动手：运行[附录 A4](Java%20并发.md#a4-atomiclong-与-longadder)的代码，观察线程数增加时 AtomicLong 和 LongAdder 的耗时差距。

算法（链表，简单）：[141. 环形链表](https://leetcode.cn/problems/linked-list-cycle/)，题解见[判断链表是否存在环](Leetcode%20题解%20-%20双指针.md#6-判断链表是否存在环)。

### 第 15 天：ThreadLocal 与锁优化

ThreadLocal 重点看它的数据结构和内存泄漏的原因。锁优化讲 JVM 怎样降低 synchronized 的开销，按轻量级锁、偏向锁、锁升级的过程读。

阅读：《Java 并发》从[无同步方案](Java%20并发.md#无同步方案)读到[多线程开发良好的实践](Java%20并发.md#十三多线程开发良好的实践)。

自测：

1. ThreadLocal 为什么可能导致内存泄漏？（见[线程本地存储（Thread Local Storage）](Java%20并发.md#2-线程本地存储thread-local-storage)）
2. synchronized 的底层是怎样实现的？（见[锁的实现](Java%20并发.md#1-锁的实现)、[轻量级锁](Java%20并发.md#轻量级锁)）
3. 说一下 synchronized 的锁升级过程。（见[锁升级的过程](Java%20并发.md#锁升级的过程)）

动手：运行[附录 A1](Java%20并发.md#a1-三种锁在读多写少时的耗时)的代码，比较 synchronized、ReentrantReadWriteLock 和 StampedLock 在读多写少时的耗时。

算法（链表，简单）：[160. 相交链表](https://leetcode.cn/problems/intersection-of-two-linked-lists/)，题解见[找出两个链表的交点](Leetcode%20题解%20-%20链表.md#1-找出两个链表的交点)。

综合题：用多个线程模拟秒杀扣减库存：分别用不加锁、synchronized、AtomicInteger 实现，比较结果是否正确，说明各自的取舍。（见[线程不安全示例](Java%20并发.md#九线程不安全示例)、[比较](Java%20并发.md#比较)、[CAS](Java%20并发.md#1-cas)）

## 七、Java 虚拟机

### 第 16 天：运行时数据区域

先分清哪些区域是线程私有的、哪些是共享的。堆和栈的区别、对象的创建过程都是常见问题。

阅读：《Java 虚拟机》的[运行时数据区域](Java%20虚拟机.md#一运行时数据区域)。

自测：

1. JVM 的内存区域有哪些？哪些是线程私有的？（见[运行时数据区域](Java%20虚拟机.md#一运行时数据区域)）
2. 堆和栈有什么区别？（见[堆和栈的区别](Java%20虚拟机.md#堆和栈的区别)）
3. 对象的创建过程是怎样的？（见[对象的创建与内存布局](Java%20虚拟机.md#对象的创建与内存布局)）

动手：运行[附录 A2](Java%20虚拟机.md#a2-逃逸分析)的代码，比较开启和关闭逃逸分析时的耗时与 GC 次数。

算法（链表，中等）：[92. 反转链表 II](https://leetcode.cn/problems/reverse-linked-list-ii/)。

### 第 17 天：对象存活与垃圾收集算法

先判断哪些对象可以回收，再看怎样回收。引用类型中弱引用最常被问到，ThreadLocal 就用到了它。

阅读：《Java 虚拟机》从[垃圾收集](Java%20虚拟机.md#二垃圾收集)读到[Stop The World](Java%20虚拟机.md#stop-the-world)。

自测：

1. 怎样判断一个对象可以被回收？哪些对象可以作为 GC Roots？（见[可达性分析算法](Java%20虚拟机.md#2-可达性分析算法)）
2. 强引用、软引用、弱引用、虚引用有什么区别？（见[引用类型](Java%20虚拟机.md#引用类型)）
3. 垃圾收集为什么要 Stop The World？（见[Stop The World](Java%20虚拟机.md#stop-the-world)）

动手：运行[附录 A5](Java%20虚拟机.md#a5-threadlocalmap-的弱引用)的代码，观察 GC 之后 Entry 的 key 和 value 分别是否被回收。

算法（链表，中等）：[143. 重排链表](https://leetcode.cn/problems/reorder-list/)，题解见[重排链表](Leetcode%20题解%20-%20链表.md#12-重排链表)。

### 第 18 天：垃圾收集器

每种收集器关注它在哪些阶段停顿。Serial、ParNew、Parallel 了解即可，重点是 CMS 和 G1。

阅读：《Java 虚拟机》的[垃圾收集器](Java%20虚拟机.md#垃圾收集器)。

自测：

1. 有哪些垃圾收集器？各自适合什么场景？（见[垃圾收集器](Java%20虚拟机.md#垃圾收集器)）
2. CMS 和 G1 有什么区别？（见[G1 收集器](Java%20虚拟机.md#7-g1-收集器)）
3. G1 怎样控制停顿时间？（见[G1 收集器](Java%20虚拟机.md#7-g1-收集器)）

动手：按[附录 A3](Java%20虚拟机.md#a3-不同收集器的停顿)的方法，用 -Xlog:gc 分别运行 Serial、Parallel 和 G1，比较停顿时间。

算法（链表，中等）：[19. 删除链表的倒数第 N 个结点](https://leetcode.cn/problems/remove-nth-node-from-end-of-list/)，题解见[删除链表的倒数第 n 个节点](Leetcode%20题解%20-%20链表.md#5-删除链表的倒数第-n-个节点)。

### 第 19 天：三色标记与内存分配

三色标记解释了并发标记为什么会漏标，以及 CMS 和 G1 各自的解决办法。内存分配一节回答对象什么时候进入老年代、什么时候触发 Full GC。

阅读：《Java 虚拟机》从[三色标记](Java%20虚拟机.md#三色标记)读到[内存分配与回收策略](Java%20虚拟机.md#三内存分配与回收策略)。

自测：

1. 三色标记中的漏标是怎样发生的？CMS 和 G1 分别怎样解决？（见[三色标记](Java%20虚拟机.md#三色标记)）
2. 对象在什么情况下进入老年代？（见[内存分配策略](Java%20虚拟机.md#内存分配策略)）
3. Full GC 在什么情况下触发？（见[Full GC 的触发条件](Java%20虚拟机.md#full-gc-的触发条件)）

动手：运行[附录 A6](Java%20虚拟机.md#a6-默认的收集器与-g1-的-region-大小)的命令，查看本机默认的收集器和 G1 的 Region 大小。

算法（链表，中等）：[82. 删除排序链表中的重复元素 II](https://leetcode.cn/problems/remove-duplicates-from-sorted-list-ii/)，题解见[剑指 Offer 18.2](18.2%20删除链表中重复的结点.md)。

### 第 20 天：类加载机制

类加载过程中的准备和初始化最容易混淆，重点看静态变量在这两个阶段各被赋了什么值。双亲委派和打破它的例子是常见的追问。

阅读：《Java 虚拟机》的[类加载机制](Java%20虚拟机.md#四类加载机制)。

自测：

1. 类加载的过程是怎样的？（见[类加载过程](Java%20虚拟机.md#类加载过程)）
2. 什么是双亲委派模型？为什么需要它？（见[双亲委派模型](Java%20虚拟机.md#双亲委派模型)）
3. 怎样打破双亲委派？有哪些实际的例子？（见[打破双亲委派](Java%20虚拟机.md#4-打破双亲委派)）

动手：运行[附录 A7](Java%20虚拟机.md#a7-打破双亲委派)的代码，说出 DriverManager 是怎样加载到第三方驱动的。

算法（链表，中等）：[142. 环形链表 II](https://leetcode.cn/problems/linked-list-cycle-ii/)，题解见[剑指 Offer 23](23.%20链表中环的入口结点.md)。

### 第 21 天：线上问题排查

把前面几天的内容用到排查中：先用 Linux 命令找到问题进程，再用 JDK 的工具找到具体的线程和对象。

阅读：《Java 虚拟机》的[线上问题排查](Java%20虚拟机.md#五线上问题排查)；《Linux》的[线上问题排查](Linux.md#十一线上问题排查)。

自测：

1. 线上出现 OOM 怎样排查？（见[内存溢出与内存泄漏](Java%20虚拟机.md#内存溢出与内存泄漏)）
2. CPU 占用过高怎样定位到具体的代码？（见[CPU 占用过高](Java%20虚拟机.md#cpu-占用过高)）
3. 做过哪些 JVM 调优？（见[JVM 调优](Java%20虚拟机.md#jvm-调优)）

动手：运行[附录 A8](Java%20虚拟机.md#a8-元空间溢出)的代码复现元空间溢出；再写一个死循环线程，按[CPU 占用过高](Java%20虚拟机.md#cpu-占用过高)一节的步骤用 top 和 jstack 找到它。

算法（链表，中等）：[148. 排序链表](https://leetcode.cn/problems/sort-list/)，题解见[链表排序](Leetcode%20题解%20-%20链表.md#14-链表排序)。

综合题：线上服务每隔几小时发生一次 Full GC，最后因为 OOM 重启：先看哪些数据？可能有哪些原因？怎样验证？（见[内存溢出与内存泄漏](Java%20虚拟机.md#内存溢出与内存泄漏)、[Full GC 的触发条件](Java%20虚拟机.md#full-gc-的触发条件)、[JVM 调优](Java%20虚拟机.md#jvm-调优)）

## 八、MySQL

### 第 22 天：事务、并发一致性与锁

先理解事务的四个性质和并发时会出现的问题，再看数据库怎样用锁解决。封锁协议是教材中的理论，可以略读；MySQL 中的锁一节对应实际使用。

阅读：《数据库系统原理》从[事务](数据库系统原理.md#一事务)读到[封锁](数据库系统原理.md#三封锁)。

自测：

1. ACID 分别是什么？InnoDB 怎样保证它们？（见[事务](数据库系统原理.md#一事务)）
2. 脏读、不可重复读和幻读有什么区别？（见[并发一致性问题](数据库系统原理.md#二并发一致性问题)）
3. MySQL 中有哪些锁？意向锁有什么用？（见[MySQL 中的锁](数据库系统原理.md#mysql-中的锁)、[封锁类型](数据库系统原理.md#封锁类型)）

动手：开两个 mysql 客户端，按[附录 A1](数据库系统原理.md#a1-并发一致性问题)的步骤复现脏读和不可重复读。

算法（链表，中等）：[2. 两数相加](https://leetcode.cn/problems/add-two-numbers/)，同类题见[链表求和](Leetcode%20题解%20-%20链表.md#7-链表求和)。

### 第 23 天：隔离级别与 MVCC

隔离级别规定了并发的事务能看到什么，MVCC 是 InnoDB 实现提交读和可重复读的方式，重点是 ReadView 的可见性判断。

阅读：《数据库系统原理》从[隔离级别](数据库系统原理.md#四隔离级别)读到[多版本并发控制](数据库系统原理.md#五多版本并发控制)。

自测：

1. 四种隔离级别分别解决了哪些问题？（见[隔离级别](数据库系统原理.md#四隔离级别)）
2. MVCC 的原理是什么？ReadView 怎样判断可见性？（见[ReadView](数据库系统原理.md#readview)）
3. 快照读和当前读有什么区别？（见[快照读与当前读](数据库系统原理.md#快照读与当前读)）

动手：按[附录 A4](数据库系统原理.md#a4-快照读与当前读混用)的步骤，观察同一个事务中快照读和当前读看到的数据为什么不同。

算法（设计，中等）：[146. LRU 缓存](https://leetcode.cn/problems/lru-cache/)，题解见[LRU](缓存.md#七lru)。

### 第 24 天：Next-Key Lock 与死锁

Next-Key Lock 是 InnoDB 在可重复读下防止幻读的方法，加锁范围要结合例子推一遍。间隙锁也是 MySQL 死锁的常见原因。

阅读：《数据库系统原理》的[Next-Key Locks](数据库系统原理.md#六next-key-locks)；《计算机操作系统 - 死锁》的[MySQL 死锁](计算机操作系统%20-%20死锁.md#2-mysql-死锁)。选读：[关系数据库设计理论](数据库系统原理.md#七关系数据库设计理论)、[ER 图](数据库系统原理.md#八er-图)。

自测：

1. InnoDB 在可重复读级别下怎样避免幻读？（见[Next-Key Locks](数据库系统原理.md#next-key-locks)）
2. 间隙锁锁住的是什么范围？（见[Gap Locks](数据库系统原理.md#gap-locks)）
3. 遇到过 MySQL 死锁吗？怎样排查？（见[MySQL 死锁](计算机操作系统%20-%20死锁.md#2-mysql-死锁)）

动手：按[附录 A5](数据库系统原理.md#a5-next-key-locks-的加锁范围)的步骤，用 performance_schema.data_locks 查看一条范围查询加了哪些锁。

算法（栈和队列，简单）：[20. 有效的括号](https://leetcode.cn/problems/valid-parentheses/)，题解见[用栈实现括号匹配](Leetcode%20题解%20-%20栈和队列.md#4-用栈实现括号匹配)。

### 第 25 天：B+ 树与索引的类型

先看 B+ 树为什么适合放在磁盘上，再看 InnoDB 的聚簇索引和二级索引。回表是理解后面覆盖索引的前提。

阅读：《MySQL》从[B+ Tree 原理](MySQL.md#b-tree-原理)读到[索引的优点](MySQL.md#索引的优点)。

自测：

1. MySQL 为什么用 B+ 树做索引，而不用 B 树、红黑树或哈希表？（见[与红黑树的比较](MySQL.md#3-与红黑树的比较)、[与 B Tree 的比较](MySQL.md#4-与-b-tree-的比较)、[哈希索引](MySQL.md#2-哈希索引)）
2. 聚簇索引和二级索引有什么区别？什么是回表？（见[B+Tree 索引](MySQL.md#1-btree-索引)）
3. 主键索引、唯一索引和普通索引有什么区别？（见[主键索引、唯一索引与普通索引](MySQL.md#5-主键索引唯一索引与普通索引)）

动手：按[附录 A1](MySQL.md#a1-主键索引的高度)的方法，查出一张 200 万行的表主键索引的高度。

算法（栈和队列，简单）：[232. 用栈实现队列](https://leetcode.cn/problems/implement-queue-using-stacks/)，题解见[用栈实现队列](Leetcode%20题解%20-%20栈和队列.md#1-用栈实现队列)。

### 第 26 天：索引的使用

这几节是建索引和排查慢查询的依据：什么时候建索引、联合索引怎样安排列的顺序、哪些写法会让索引失效。

阅读：《MySQL》从[索引的使用条件](MySQL.md#索引的使用条件)读到[索引失效](MySQL.md#索引失效)。

自测：

1. 什么是最左前缀原则？联合索引 (a, b, c) 只用到 a 和 c 时能走索引吗？（见[多列索引](MySQL.md#2-多列索引)）
2. 哪些情况下索引会失效？（见[索引失效](MySQL.md#索引失效)）
3. 建索引有哪些原则？（见[索引的使用条件](MySQL.md#索引的使用条件)）

动手：按[附录 A6](MySQL.md#a6-联合索引的扫描范围)的表结构，自己写几条会让联合索引失效的查询，用 EXPLAIN 验证。

算法（栈和队列，简单）：[155. 最小栈](https://leetcode.cn/problems/min-stack/)，题解见[最小值栈](Leetcode%20题解%20-%20栈和队列.md#3-最小值栈)。

### 第 27 天：查询性能优化

按执行过程、Explain、慢查询排查的顺序读。慢查询的定位与优化一节给出了从找出慢 SQL 到验证效果的完整步骤。

阅读：《MySQL》的[查询性能优化](MySQL.md#二查询性能优化)。

自测：

1. 线上出现慢 SQL，怎样排查和优化？（见[慢查询的定位与优化](MySQL.md#慢查询的定位与优化)）
2. EXPLAIN 主要看哪些字段？Using filesort 和 Using temporary 表示什么？（见[使用 Explain 进行分析](MySQL.md#使用-explain-进行分析)）
3. 深分页为什么慢？怎样优化？（见[深分页](MySQL.md#深分页)）

动手：在一张 100 万行以上的表上（可以用脚本批量插入），按[附录 A5](MySQL.md#a5-深分页的耗时)的方法比较 LIMIT 1000000, 10、延迟关联和游标分页三种写法的耗时。

算法（栈和队列，中等）：[394. 字符串解码](https://leetcode.cn/problems/decode-string/)，题解见[字符串解码](Leetcode%20题解%20-%20栈和队列.md#7-字符串解码)。

### 第 28 天：存储引擎、切分与复制

存储引擎重点比较 InnoDB 和 MyISAM，数据类型可以略读。分库分表要清楚它解决什么问题、又带来什么问题；复制是读写分离的基础。

阅读：《MySQL》从[存储引擎](MySQL.md#三存储引擎)读到[MySQL 复制](MySQL.md#六复制)。

自测：

1. InnoDB 和 MyISAM 有什么区别？（见[InnoDB 与 MyISAM 的比较](MySQL.md#比较)）
2. 分库分表之后会遇到哪些问题？（见[Sharding 存在的问题](MySQL.md#sharding-存在的问题)）
3. 主从复制的过程是怎样的？读写分离有什么问题？（见[MySQL 复制](MySQL.md#六复制)）

算法（栈和队列，中等）：[739. 每日温度](https://leetcode.cn/problems/daily-temperatures/)，题解见[数组中元素与下一个比它大的元素之间的距离](Leetcode%20题解%20-%20栈和队列.md#5-数组中元素与下一个比它大的元素之间的距离)。

### 第 29 天：日志

redo log、undo log 和 binlog 分别用于崩溃恢复、回滚和复制。最后一节用一条 UPDATE 把三种日志串起来。

阅读：《MySQL》的[MySQL 的日志](MySQL.md#七日志)。

自测：

1. redo log、undo log 和 binlog 有什么区别？（见[MySQL 的日志](MySQL.md#七日志)）
2. 为什么需要两阶段提交？（见[两阶段提交](MySQL.md#两阶段提交)）
3. 一条 UPDATE 语句执行时，三种日志是怎样写的？（见[更新语句的执行过程](MySQL.md#更新语句的执行过程)）

动手：执行 SHOW VARIABLES LIKE 'innodb_flush_log_at_trx_commit' 和 SHOW VARIABLES LIKE 'sync_binlog'，结合[redo log](MySQL.md#redo-log)一节说明两个参数都为 1 时每次提交会把哪些日志刷到磁盘，改成 0 或 2 有什么风险。

算法（二分查找，简单）：[704. 二分查找](https://leetcode.cn/problems/binary-search/)，题解见[正常实现](Leetcode%20题解%20-%20二分查找.md#正常实现)。

综合题：订单表有 2000 万行，按用户查询最近的订单很慢：怎样分析原因？建什么索引？数据继续增长怎么办？（见[慢查询的定位与优化](MySQL.md#慢查询的定位与优化)、[索引优化](MySQL.md#索引优化)、[切分](MySQL.md#五切分)）

## 九、Redis 与缓存

### 第 30 天：Redis 的数据类型

先看 Redis 和 MySQL 的分工，再看五种基本类型和 BITMAP、HyperLogLog。每种类型想一个自己用得上的场景。

阅读：《Redis》从[Redis 概述](Redis.md#一概述)读到[Redis 的数据类型](Redis.md#二数据类型)。

自测：

1. Redis 有哪些数据类型？分别用在什么场景？（见[Redis 的数据类型](Redis.md#二数据类型)）
2. Redis 和 MySQL 有什么区别？（见[与 MySQL 的区别](Redis.md#与-mysql-的区别)）
3. 一亿用户每天的签到状态怎样存储？（见[BITMAP](Redis.md#bitmap)）

动手：按[附录 A7](Redis.md#a7-bitmap-的签到和日活)的命令记录一个用户一个月的签到，用 BITCOUNT 统计签到天数。

算法（二分查找，中等）：[33. 搜索旋转排序数组](https://leetcode.cn/problems/search-in-rotated-sorted-array/)。

### 第 31 天：使用场景与底层结构

使用场景把上一天的数据类型落到具体业务中。底层结构重点看编码的转换和跳跃表。

阅读：《Redis》从[Redis 的使用场景](Redis.md#三使用场景)读到[Redis 的数据结构](Redis.md#四数据结构)。选读：[进阶：Redis 的数据结构](Redis%20-%20进阶.md#四数据结构)。

自测：

1. 怎样用 Redis 实现排行榜？（见[排行榜](Redis.md#排行榜)）
2. ZSET 的底层为什么用跳表？（见[跳跃表](Redis.md#跳跃表)）
3. Redis 的字典是怎样扩容的？（见[字典](Redis.md#字典)）

动手：用 redis-cli 实现[排行榜](Redis.md#排行榜)一节中的例子：ZADD 写入几个用户的分数，用 ZREVRANGE 取前 3 名，用 ZREVRANK 查某个用户的名次。

算法（二分查找，中等）：[34. 在排序数组中查找元素的第一个和最后一个位置](https://leetcode.cn/problems/find-first-and-last-position-of-element-in-sorted-array/)，题解见[查找区间](Leetcode%20题解%20-%20二分查找.md#6-查找区间)。

### 第 32 天：过期、淘汰、持久化与事务

与 Memcached 的比较可以略读。过期删除和内存淘汰是两件事：前者清理过期的键，后者在内存不够时腾出空间。持久化重点比较 RDB 和 AOF。

阅读：《Redis》从[Redis 与 Memcached](Redis.md#五redis-与-memcached)读到[Redis 事务](Redis.md#九事务)。

自测：

1. 过期的键怎样删除？内存满了有哪些淘汰策略？（见[键的过期时间](Redis.md#六键的过期时间)、[数据淘汰策略](Redis.md#七数据淘汰策略)）
2. RDB 和 AOF 有什么区别？（见[Redis 持久化](Redis.md#八持久化)）
3. Lua 脚本为什么能保证原子性？（见[Lua 脚本](Redis.md#lua-脚本)）

动手：开启 AOF 后对同一个键执行 100 次 INCR，查看 appendonlydir 目录中的文件；执行 BGREWRITEAOF 后再查看一次，对照[AOF 持久化](Redis.md#aof-持久化)一节说明基础文件和增量文件的变化。

算法（二分查找，中等）：[153. 寻找旋转排序数组中的最小值](https://leetcode.cn/problems/find-minimum-in-rotated-sorted-array/)，题解见[旋转数组的最小数字](Leetcode%20题解%20-%20二分查找.md#5-旋转数组的最小数字)。

### 第 33 天：线程模型、复制与集群

单线程为什么快是 Redis 的高频题。复制、Sentinel、Cluster 依次解决数据备份、故障转移和容量扩展的问题。

阅读：《Redis》从[Redis 的事件](Redis.md#十事件)读到[Redis 分片](Redis.md#十三分片)。选读：[进阶：Redis 的事件](Redis%20-%20进阶.md#十事件)、[一个简单的论坛系统分析](Redis.md#十四一个简单的论坛系统分析)。

自测：

1. Redis 是单线程的吗？为什么单线程也这么快？（见[单线程为什么快](Redis.md#单线程为什么快)）
2. 哨兵怎样发现主节点下线并选出新的主节点？（见[Sentinel](Redis.md#十二sentinel)）
3. Redis Cluster 怎样分配数据？扩容时怎样迁移？（见[Redis Cluster](Redis.md#redis-cluster)）

动手：按[附录 A4](Redis.md#a4-redis-cluster)的步骤在本机搭建 3 主 3 从的集群，用 CLUSTER KEYSLOT 查看几个键落在哪个槽。

算法（排序与堆，中等）：[215. 数组中的第 K 个最大元素](https://leetcode.cn/problems/kth-largest-element-in-an-array/)，题解见[Kth Element](Leetcode%20题解%20-%20排序.md#1-kth-element)。

### 第 34 天：缓存的位置与三种问题

前几章介绍缓存的特征和位置，多级缓存一节重点读。穿透、击穿、雪崩都是请求越过缓存打到数据库，区别在于原因。

阅读：《缓存》从[缓存特征](缓存.md#一缓存特征)读到[缓存雪崩](缓存.md#缓存雪崩)。

自测：

1. 缓存穿透、击穿和雪崩有什么区别？分别怎样解决？（见[缓存问题](缓存.md#四缓存问题)）
2. 本地缓存和 Redis 怎样配合使用？（见[多级缓存](缓存.md#多级缓存)）
3. 布隆过滤器的原理是什么？为什么会误判？（见[缓存穿透](缓存.md#缓存穿透)）

动手：阅读[附录 A5](缓存.md#a5-缓存击穿的三种做法)，比较三种做法查询数据库的次数和请求的耗时。

算法（排序与堆，中等）：[347. 前 K 个高频元素](https://leetcode.cn/problems/top-k-frequent-elements/)，题解见[出现频率最多的 k 个元素](Leetcode%20题解%20-%20排序.md#1-出现频率最多的-k-个元素)。

### 第 35 天：缓存一致性与一致性哈希

缓存一致性要讲清为什么先更新数据库再删缓存，以及仍然存在的不一致窗口。一致性哈希解决节点增减时大量缓存失效的问题；最后手写一个 LRU。

阅读：《缓存》从[缓存一致性](缓存.md#缓存一致性)读到[LRU](缓存.md#七lru)。

自测：

1. 怎样保证缓存与数据库的一致性？（见[缓存一致性](缓存.md#缓存一致性)）
2. 什么是大 Key 和热 Key？怎样处理？（见[大 Key 与热 Key](缓存.md#大-key-与热-key)）
3. 一致性哈希解决了什么问题？虚拟节点有什么用？（见[一致性哈希](缓存.md#六一致性哈希)）

动手：不看笔记手写 LRU 缓存（哈希表加双向链表），在力扣 146 题提交通过后，再与[LRU](缓存.md#七lru)一节的实现对比。

算法（排序与堆，中等）：[912. 排序数组（手写快速排序）](https://leetcode.cn/problems/sort-an-array/)，题解见[快速排序](算法%20-%20排序.md#快速排序)。

综合题：商品详情页的 QPS 很高：怎样设计缓存的读写流程？热点商品的缓存过期时怎样避免数据库被压垮？价格修改后多久能看到新值？（见[多级缓存](缓存.md#多级缓存)、[缓存击穿](缓存.md#缓存击穿)、[缓存一致性](缓存.md#缓存一致性)）

## 十、计算机网络

### 第 36 天：TCP 的连接管理

先比较 TCP 和 UDP，再看 TCP 首部中的序号和确认号，它们是理解握手和挥手的基础。TIME_WAIT 和 CLOSE_WAIT 是线上排查中常见的问题。

阅读：《计算机网络 - 传输层》从[UDP 和 TCP 的特点](计算机网络%20-%20传输层.md#udp-和-tcp-的特点)读到[TCP 的四次挥手](计算机网络%20-%20传输层.md#tcp-的四次挥手)。

自测：

1. 三次握手的过程是怎样的？为什么不是两次？（见[三次握手的原因](计算机网络%20-%20传输层.md#三次握手的原因)）
2. 为什么 TIME_WAIT 要等待 2MSL？（见[TIME_WAIT](计算机网络%20-%20传输层.md#time_wait)）
3. 服务器上出现大量 TIME_WAIT 或 CLOSE_WAIT 是什么原因？（见[大量 TIME_WAIT 与 CLOSE_WAIT](计算机网络%20-%20传输层.md#大量-time_wait-与-close_wait)）

动手：用 tcpdump 或 Wireshark 抓一次 curl http://example.com 的数据包，找出三次握手和四次挥手的报文，记下每个报文的序号和确认号。

算法（二叉树，简单）：[101. 对称二叉树](https://leetcode.cn/problems/symmetric-tree/)，题解见[树的对称](Leetcode%20题解%20-%20树.md#9-树的对称)。

### 第 37 天：可靠传输与拥塞控制

按确认与重传、滑动窗口、流量控制、拥塞控制的顺序读，注意流量控制和拥塞控制分别在保护谁。

阅读：《计算机网络 - 传输层》从[TCP 可靠传输](计算机网络%20-%20传输层.md#tcp-可靠传输)读到[在 UDP 上实现可靠传输](计算机网络%20-%20传输层.md#在-udp-上实现可靠传输)。

自测：

1. TCP 怎样保证可靠传输？（见[TCP 可靠传输](计算机网络%20-%20传输层.md#tcp-可靠传输)）
2. 拥塞控制和流量控制有什么区别？（见[TCP 拥塞控制](计算机网络%20-%20传输层.md#tcp-拥塞控制)）
3. 什么是粘包？怎样解决？（见[TCP 粘包与拆包](计算机网络%20-%20传输层.md#tcp-粘包与拆包)）

动手：在 Linux 上用 scp 或 curl 传输一个大文件，同时执行 ss -ti 查看这个连接的 cwnd、rtt 和 retrans，对照[TCP 拥塞控制](计算机网络%20-%20传输层.md#tcp-拥塞控制)一节解释 cwnd 的变化。

算法（二叉树，简单）：[104. 二叉树的最大深度](https://leetcode.cn/problems/maximum-depth-of-binary-tree/)，题解见[树的高度](Leetcode%20题解%20-%20树.md#1-树的高度)。

### 第 38 天：HTTP 基础

这几章是 HTTP 报文的基本格式。方法和首部字段可以略读，常见的状态码要记住。

阅读：《HTTP》从[HTTP 基础概念](HTTP.md#一基础概念)读到[HTTP 首部](HTTP.md#四http-首部)。

自测：

1. HTTP 请求报文和响应报文由哪几部分组成？（见[请求和响应报文](HTTP.md#请求和响应报文)）
2. 301、302、304、502、504 分别表示什么？（见[HTTP 状态码](HTTP.md#三http-状态码)）
3. PUT 和 PATCH 有什么区别？（见[HTTP 方法](HTTP.md#二http-方法)）

动手：用 curl -v 访问一个网站，指出请求行、请求首部、状态行和响应首部，再用 curl -I 只获取响应首部。

算法（二叉树，中等）：[102. 二叉树的层序遍历](https://leetcode.cn/problems/binary-tree-level-order-traversal/)，题解见[剑指 Offer 32.2](32.2%20把二叉树打印成多行.md)。

### 第 39 天：连接管理与 Cookie

长连接减少了建立连接的次数。Cookie 一节篇幅较长，重点是 Session、JWT，以及 Cookie、Session 和 Token 的区别。

阅读：《HTTP》从[连接管理](HTTP.md#连接管理)读到[Cookie](HTTP.md#cookie)。

自测：

1. 什么是长连接？HTTP/1.1 怎样复用连接？（见[连接管理](HTTP.md#连接管理)）
2. Cookie、Session 和 Token 有什么区别？（见[Cookie](HTTP.md#cookie)）
3. Cookie 有哪些和安全相关的属性？（见[Cookie](HTTP.md#cookie)）

动手：用浏览器的开发者工具查看一个网站登录后响应中的 Set-Cookie，找出其中的 HttpOnly、Secure 和 SameSite 属性。

算法（二叉树，中等）：[103. 二叉树的锯齿形层序遍历](https://leetcode.cn/problems/binary-tree-zigzag-level-order-traversal/)，题解见[剑指 Offer 32.3](32.3%20按之字形顺序打印二叉树.md)。

### 第 40 天：缓存、WebSocket 与跨域

HTTP 缓存分为强缓存和协商缓存。内容协商到通信数据转发几节可以略读；WebSocket 和跨域是 Web 开发中常遇到的问题。

阅读：《HTTP》从[HTTP 缓存](HTTP.md#缓存)读到[跨域](HTTP.md#跨域)。

自测：

1. 强缓存和协商缓存有什么区别？（见[HTTP 缓存](HTTP.md#缓存)）
2. WebSocket 和 HTTP 有什么区别？什么时候用 SSE？（见[WebSocket](HTTP.md#websocket)）
3. 什么是跨域？怎样解决？（见[跨域](HTTP.md#跨域)）

动手：按[附录 A2](HTTP.md#a2-强缓存与协商缓存)的方法，用 curl 带上 If-None-Match 请求同一个资源，观察 304 响应。

算法（二叉树，中等）：[236. 二叉树的最近公共祖先](https://leetcode.cn/problems/lowest-common-ancestor-of-a-binary-tree/)，题解见[二叉树的最近公共祖先](Leetcode%20题解%20-%20树.md#5-二叉树的最近公共祖先)。

### 第 41 天：HTTPS

HTTPS 在 HTTP 和 TCP 之间加了一层 TLS。按加密、认证、握手的顺序读，握手一节要能对着报文讲出每一步做了什么。

阅读：《HTTP》的[HTTPS](HTTP.md#六https)。

自测：

1. HTTPS 的握手过程是怎样的？（见[TLS 握手](HTTP.md#tls-握手)）
2. HTTPS 为什么同时使用对称加密和非对称加密？（见[加密](HTTP.md#加密)）
3. 证书是怎样验证的？根证书有什么用？（见[认证](HTTP.md#认证)）

动手：按[附录 A4](HTTP.md#a4-tls-握手)的方法，用 openssl s_client 连接一个网站，找出协商出的 TLS 版本、密码套件和证书链。

算法（二叉树，中等）：[199. 二叉树的右视图](https://leetcode.cn/problems/binary-tree-right-side-view/)。

### 第 42 天：HTTP 的版本、GET 与 POST、DNS

HTTP/2 和 HTTP/3 分别解决了 HTTP/1.1 的哪些问题是常见的追问。GET 和 POST 的区别要从语义讲起，而不只是参数的位置。

阅读：《HTTP》从[HTTP/1.1 新特性](HTTP.md#七http11-新特性)读到[GET 和 POST 比较](HTTP.md#九get-和-post-比较)；《计算机网络 - 应用层》的[域名系统](计算机网络%20-%20应用层.md#域名系统)。

自测：

1. HTTP/2 相比 HTTP/1.1 有哪些改进？（见[HTTP/2.0](HTTP.md#八http20)）
2. GET 和 POST 有什么区别？（见[GET 和 POST 比较](HTTP.md#九get-和-post-比较)）
3. DNS 的解析过程是怎样的？（见[域名系统](计算机网络%20-%20应用层.md#域名系统)）

动手：用 dig +trace 查询一个域名，对照[域名系统](计算机网络%20-%20应用层.md#域名系统)一节说出每一级服务器返回了什么。

算法（二叉树，中等）：[105. 从前序与中序遍历序列构造二叉树](https://leetcode.cn/problems/construct-binary-tree-from-preorder-and-inorder-traversal/)，题解见[剑指 Offer 7](7.%20重建二叉树.md)。

### 第 43 天：从输入 URL 到显示页面

Web 页面请求过程把前几天的内容串了起来。攻击技术中 XSS、CSRF 和 SQL 注入各自利用了什么、怎样防范要分清。

阅读：《计算机网络 - 应用层》的[Web 页面请求过程](计算机网络%20-%20应用层.md#web-页面请求过程)；《攻击技术》从[跨站脚本攻击](攻击技术.md#一跨站脚本攻击)读到[SQL 注入攻击](攻击技术.md#三sql-注入攻击)。

自测：

1. 从输入 URL 到页面显示经历了哪些过程？（见[Web 页面请求过程](计算机网络%20-%20应用层.md#web-页面请求过程)）
2. XSS 和 CSRF 有什么区别？分别怎样防范？（见[防范手段](攻击技术.md#防范手段)、[防范手段](攻击技术.md#防范手段-1)）
3. 怎样防止 SQL 注入？（见[防范手段](攻击技术.md#防范手段-2)）

算法（二叉树，中等）：[98. 验证二叉搜索树](https://leetcode.cn/problems/validate-binary-search-tree/)。

综合题：在浏览器输入 https://example.com 并回车，按 DNS、TCP、TLS、HTTP 的顺序说出每一步发送了什么，以及在哪些地方可能变慢。（见[Web 页面请求过程](计算机网络%20-%20应用层.md#web-页面请求过程)、[TCP 的三次握手](计算机网络%20-%20传输层.md#tcp-的三次握手)、[TLS 握手](HTTP.md#tls-握手)）

## 十一、操作系统

### 第 44 天：进程与线程

进程和线程的区别是操作系统中问得最多的问题。协程一节说明了 Java 21 为什么引入虚拟线程。

阅读：《计算机操作系统 - 进程管理》从[进程与线程](计算机操作系统%20-%20进程管理.md#进程与线程)读到[进程状态的切换](计算机操作系统%20-%20进程管理.md#进程状态的切换)。

自测：

1. 进程和线程有什么区别？（见[进程与线程的区别](计算机操作系统%20-%20进程管理.md#3-区别)）
2. 上下文切换有哪些开销？（见[上下文切换](计算机操作系统%20-%20进程管理.md#4-上下文切换)）
3. 协程和线程有什么区别？Java 的虚拟线程是怎样实现的？（见[协程](计算机操作系统%20-%20进程管理.md#5-协程)）

动手：运行[附录 A2](计算机操作系统%20-%20进程管理.md#a2-平台线程与虚拟线程的开销)的代码，比较创建 1 万个平台线程和虚拟线程的耗时与内存。

算法（回溯与搜索，中等）：[200. 岛屿数量](https://leetcode.cn/problems/number-of-islands/)，题解见[矩阵中的连通分量数目](Leetcode%20题解%20-%20搜索.md#2-矩阵中的连通分量数目)。

### 第 45 天：系统调用、进程同步与通信

系统调用解释了用户态和内核态之间的切换。调度算法和经典同步问题可以略读，重点是信号量和进程间的通信方式。

阅读：《计算机操作系统 - 概述》的[系统调用](计算机操作系统%20-%20概述.md#系统调用)；《计算机操作系统 - 进程管理》从[进程调度算法](计算机操作系统%20-%20进程管理.md#进程调度算法)读到[进程通信](计算机操作系统%20-%20进程管理.md#进程通信)。选读：[进阶：经典同步问题](计算机操作系统%20-%20进程管理%20-%20进阶.md#经典同步问题)。

自测：

1. 什么是用户态和内核态？什么时候会切换？（见[系统调用](计算机操作系统%20-%20概述.md#系统调用)）
2. 进程间通信有哪些方式？（见[进程通信](计算机操作系统%20-%20进程管理.md#进程通信)）
3. 信号量是怎样实现同步与互斥的？（见[信号量](计算机操作系统%20-%20进程管理.md#3-信号量)）

动手：运行[附录 A1](计算机操作系统%20-%20概述.md#a1-普通函数调用与系统调用的耗时)的代码，比较普通函数调用和系统调用的耗时。

算法（回溯与搜索，中等）：[46. 全排列](https://leetcode.cn/problems/permutations/)，题解见[排列](Leetcode%20题解%20-%20搜索.md#5-排列)。

### 第 46 天：死锁

四个必要条件是预防死锁的出发点。银行家算法可以略读，最后一节的 Java 线程死锁和 MySQL 死锁对应实际排查。

阅读：《计算机操作系统 - 死锁》从[必要条件](计算机操作系统%20-%20死锁.md#必要条件)读到[程序中的死锁](计算机操作系统%20-%20死锁.md#程序中的死锁)。

自测：

1. 死锁的四个必要条件是什么？（见[必要条件](计算机操作系统%20-%20死锁.md#必要条件)）
2. 怎样避免死锁？实际开发中最常用哪种方法？（见[死锁预防](计算机操作系统%20-%20死锁.md#死锁预防)）
3. 线上的 Java 程序发生死锁，怎样定位？（见[Java 线程死锁](计算机操作系统%20-%20死锁.md#1-java-线程死锁)）

动手：运行[附录 A1](计算机操作系统%20-%20死锁.md#a1-java-线程死锁)的代码，用 jstack 找到互相等待的两个线程。

算法（回溯与搜索，中等）：[93. 复原 IP 地址](https://leetcode.cn/problems/restore-ip-addresses/)，题解见[IP 地址划分](Leetcode%20题解%20-%20搜索.md#2-ip-地址划分)。

### 第 47 天：内存管理

虚拟内存让每个进程有独立的地址空间。分页的地址转换和页面置换算法是重点，LRU 在缓存中还会再出现。

阅读：《计算机操作系统 - 内存管理》从[虚拟内存](计算机操作系统%20-%20内存管理.md#虚拟内存)读到[分页与分段的比较](计算机操作系统%20-%20内存管理.md#分页与分段的比较)。

自测：

1. 什么是虚拟内存？为什么需要它？（见[虚拟内存](计算机操作系统%20-%20内存管理.md#虚拟内存)）
2. 有哪些页面置换算法？（见[页面置换算法](计算机操作系统%20-%20内存管理.md#页面置换算法)）
3. 分页和分段有什么区别？（见[分页与分段的比较](计算机操作系统%20-%20内存管理.md#分页与分段的比较)）

动手：运行[附录 A3](计算机操作系统%20-%20内存管理.md#a3-进程的地址空间布局)的代码，查看 /proc/<pid>/maps 中代码段、堆和栈的位置。

算法（回溯与搜索，中等）：[22. 括号生成](https://leetcode.cn/problems/generate-parentheses/)。

### 第 48 天：I/O 多路复用

先区分五种 I/O 模型，再看 select、poll 和 epoll 的差别。epoll 的两种工作模式是常见的追问。

阅读：《Socket》从[I/O 模型](Socket.md#一io-模型)读到[I/O 复用](Socket.md#二io-复用)。选读：[NIO](Java%20IO.md#七nio)。

自测：

1. select、poll 和 epoll 有什么区别？（见[select、poll 与 epoll 的比较](Socket.md#比较)）
2. epoll 的水平触发和边缘触发有什么区别？（见[工作模式](Socket.md#工作模式)）
3. BIO、NIO 和 AIO 有什么区别？（见[五大 I/O 模型比较](Socket.md#五大-io-模型比较)）

动手：运行[附录 A2](Socket.md#a2-lt-与-et-的读取过程)的代码，观察水平触发和边缘触发下每次 epoll_wait 返回后读到的数据。

算法（回溯与搜索，中等）：[78. 子集](https://leetcode.cn/problems/subsets/)，题解见[子集](Leetcode%20题解%20-%20搜索.md#11-子集)。

综合题：一个 Java 服务要同时维持 10 万个长连接：用每个连接一个线程的方式会遇到什么问题？用 epoll 或虚拟线程怎样解决？（见[上下文切换](计算机操作系统%20-%20进程管理.md#4-上下文切换)、[epoll](Socket.md#epoll)、[协程](计算机操作系统%20-%20进程管理.md#5-协程)）

## 十二、Spring 与设计模式

### 第 49 天：IoC 与 Bean

IoC 一节先说明为什么需要容器。Bean 的生命周期和循环依赖要能结合调用栈讲清。

阅读：《Spring》的[IoC 与 Bean](Spring.md#一ioc-与-bean)。

自测：

1. Bean 的生命周期是怎样的？（见[Bean 的生命周期](Spring.md#bean-的生命周期)）
2. Spring 怎样解决循环依赖？为什么需要三级缓存？（见[循环依赖](Spring.md#循环依赖)）
3. 单例 Bean 是线程安全的吗？（见[Bean 的作用域与线程安全](Spring.md#bean-的作用域与线程安全)）

动手：按[附录 A3](Spring.md#a3-bean-创建的调用栈)的方法，在一个 Bean 的构造方法和 setter 方法中分别打印调用栈，找出 createBeanInstance 和 populateBean 的位置，说明实例化和属性注入的先后。

算法（回溯与搜索，中等）：[39. 组合总和](https://leetcode.cn/problems/combination-sum/)，题解见[组合求和](Leetcode%20题解%20-%20搜索.md#8-组合求和)。

### 第 50 天：AOP 与事务

AOP 基于动态代理，自调用时切面不生效的原因也在这里。事务是 AOP 的一个应用，读完原理再看事务失效的几种情况会更容易理解。

阅读：《Spring》从[AOP](Spring.md#二aop)读到[事务](Spring.md#三事务)。

自测：

1. AOP 的原理是什么？JDK 动态代理和 CGLIB 有什么区别？（见[动态代理](Spring.md#动态代理)）
2. Spring 事务的原理是什么？为什么加了 @Transactional 就有事务了？（见[事务的实现原理](Spring.md#事务的实现原理)）
3. 哪些情况下 @Transactional 会失效？（见[事务失效](Spring.md#事务失效)）

动手：写一个类，在方法 a() 中调用本类带 @Transactional 的方法 b()，验证 b() 的事务没有生效，再按[自调用](Spring.md#自调用)一节的方法修复。

算法（动态规划，简单）：[121. 买卖股票的最佳时机](https://leetcode.cn/problems/best-time-to-buy-and-sell-stock/)，题解见[买卖股票最大的收益](Leetcode%20题解%20-%20贪心思想.md#5-买卖股票最大的收益)。

### 第 51 天：Spring Boot、Spring MVC 与 MyBatis

自动配置是 Spring Boot 的核心。MyBatis 一节中 #{} 和 ${} 的区别与 SQL 注入有关。

阅读：《Spring》从[Spring Boot 自动配置](Spring.md#四spring-boot-自动配置)读到[Spring 中的设计模式](Spring.md#七spring-中的设计模式)。

自测：

1. Spring Boot 的自动配置是怎样实现的？（见[Spring Boot 自动配置](Spring.md#四spring-boot-自动配置)）
2. Spring MVC 处理一个请求的过程是怎样的？（见[请求的处理过程](Spring.md#请求的处理过程)）
3. MyBatis 中 #{} 和 ${} 有什么区别？（见[#{} 和 ${} 的区别](Spring.md#-和--的区别)）

动手：新建一个 Spring Boot 3 项目，启动时加上 --debug，在条件评估报告中找到 DataSourceAutoConfiguration 生效或不生效的原因。

算法（动态规划，简单）：[70. 爬楼梯](https://leetcode.cn/problems/climbing-stairs/)，题解见[爬楼梯](Leetcode%20题解%20-%20动态规划.md#1-爬楼梯)。

### 第 52 天：设计模式

先看前言中下单流程用到的几种模式，再读单例和策略两篇。设计原则说明了这些模式背后的目标。

阅读：《设计模式 - 目录》的[设计模式前言](设计模式%20-%20目录.md#一前言)；《设计模式  - 单例》的[单例（Singleton）](设计模式%20%20-%20单例.md#单例singleton)；《设计模式 - 策略》的[策略（Strategy）](设计模式%20-%20策略.md#9-策略strategy)；《面向对象思想》的[设计原则](面向对象思想.md#三设计原则)。选读：[工厂方法](设计模式%20-%20工厂方法.md)、[代理](设计模式%20-%20代理.md)、[装饰](设计模式%20-%20装饰.md)、[观察者](设计模式%20-%20观察者.md)、[模板方法](设计模式%20-%20模板方法.md)、[责任链](设计模式%20-%20责任链.md)。

自测：

1. 单例模式有哪几种写法？双重检查锁为什么要加 volatile？（见[实现](设计模式%20%20-%20单例.md#实现)）
2. 项目中用过哪些设计模式？举一个例子。（见[项目中的用法](设计模式%20-%20目录.md#项目中的用法)）
3. Spring 中用到了哪些设计模式？（见[Spring 中的设计模式](Spring.md#七spring-中的设计模式)）

动手：把一段按支付方式（微信、支付宝、银行卡）分支的 if-else 改写成策略模式，并用 Spring 的 Map<String, PayStrategy> 注入所有实现。

算法（动态规划，中等）：[53. 最大子数组和](https://leetcode.cn/problems/maximum-subarray/)，题解见[子数组最大的和](Leetcode%20题解%20-%20贪心思想.md#10-子数组最大的和)。

综合题：用户下单接口中，Controller 调用 Service，Service 带有 @Transactional 并调用了日志切面：从请求到达 DispatcherServlet 到事务提交，依次经过了哪些对象和代理？（见[请求的处理过程](Spring.md#请求的处理过程)、[动态代理](Spring.md#动态代理)、[事务的实现原理](Spring.md#事务的实现原理)）

## 十三、分布式与消息队列

### 第 53 天：微服务

按拆分、组件、注册中心、服务调用、网关的顺序读。服务调用一节回答了实例下线和注册中心宕机时会发生什么。

阅读：《微服务》从[从单体到微服务](微服务.md#一从单体到微服务)读到[网关](微服务.md#五网关)。选读：[配置中心](微服务.md#六配置中心)、[链路追踪](微服务.md#八链路追踪)、[负载均衡](集群.md#一负载均衡)。

自测：

1. Spring Cloud 有哪些常用组件？（见[组件](微服务.md#组件)）
2. 注册中心宕机后，服务之间还能调用吗？（见[注册中心宕机](微服务.md#注册中心宕机)）
3. 有哪些负载均衡策略？（见[负载均衡策略](微服务.md#负载均衡策略)）

算法（动态规划，中等）：[5. 最长回文子串](https://leetcode.cn/problems/longest-palindromic-substring/)，题解见[最长回文子串](Leetcode%20题解%20-%20字符串.md#10-最长回文子串)。

### 第 54 天：分布式锁

三种实现各有代价：数据库简单但性能低，Redis 快但要处理过期和续期，Zookeeper 可靠但部署重。重点是 Redis 的实现和 Redisson 的看门狗。

阅读：《分布式》的[分布式锁](分布式.md#一分布式锁)。

自测：

1. 用 Redis 怎样实现分布式锁？为什么加锁和设置过期时间要用一条命令？（见[Redis 的 SET NX 指令](分布式.md#redis-的-set-nx-指令)）
2. 锁过期了业务还没执行完怎么办？（见[Redis 的 SET NX 指令](分布式.md#redis-的-set-nx-指令)）
3. 数据库、Redis、Zookeeper 三种实现怎样选择？（见[三种实现的对比](分布式.md#三种实现的对比)）

动手：按[附录 A3](分布式.md#a3-redisson-的可重入与看门狗)的方法，观察 Redisson 的锁在业务执行期间是怎样自动续期的。

算法（动态规划，中等）：[300. 最长递增子序列](https://leetcode.cn/problems/longest-increasing-subsequence/)，题解见[最长递增子序列](Leetcode%20题解%20-%20动态规划.md#1-最长递增子序列)。

### 第 55 天：分布式事务与 CAP

2PC 保证强一致但会阻塞，TCC、Saga 和本地消息表用最终一致换取可用性。CAP 一节说明了为什么出现网络分区时只能在一致性和可用性之间选择。

阅读：《分布式》从[分布式事务](分布式.md#二分布式事务)读到[BASE](分布式.md#四base)。选读：[Paxos](分布式.md#五paxos)、[Raft](分布式.md#六raft)。

自测：

1. 2PC 有什么问题？（见[2PC](分布式.md#2pc)）
2. TCC 和本地消息表分别适合什么场景？（见[TCC](分布式.md#tcc)、[本地消息表](分布式.md#本地消息表)）
3. 什么是 CAP？为什么分区容忍性必须满足？（见[权衡](分布式.md#权衡)）

算法（动态规划，中等）：[1143. 最长公共子序列](https://leetcode.cn/problems/longest-common-subsequence/)，题解见[最长公共子序列](Leetcode%20题解%20-%20动态规划.md#1-最长公共子序列)。

### 第 56 天：RPC、分布式 ID 与幂等

RPC 一节对比了它和 HTTP 的取舍。雪花算法要注意时钟回拨；幂等是重试、重复提交和重复消费的共同解法。

阅读：《分布式》从[RPC](分布式.md#七rpc)读到[幂等](分布式.md#九幂等)。选读：[分布式定时任务](分布式.md#十分布式定时任务)。

自测：

1. RPC 和 HTTP 有什么区别？（见[RPC 与 HTTP](分布式.md#rpc-与-http)）
2. 雪花算法是怎样生成 ID 的？时钟回拨怎么办？（见[雪花算法](分布式.md#雪花算法)）
3. 怎样保证接口的幂等？（见[幂等](分布式.md#九幂等)）

动手：按[附录 A4](分布式.md#a4-重复提交与唯一索引)的步骤，用唯一索引拦住重复提交的订单。

算法（动态规划，中等）：[322. 零钱兑换](https://leetcode.cn/problems/coin-change/)，题解见[找零钱的最少硬币数](Leetcode%20题解%20-%20动态规划.md#4-找零钱的最少硬币数)。

### 第 57 天：消息队列的作用与可靠性

先看消息队列用来做什么，以及它和 RPC 调用怎样选择。可靠性要分发送端、队列和接收端三段来看。

阅读：《消息队列》从[消息模型](消息队列.md#一消息模型)读到[消息队列的可靠性](消息队列.md#三可靠性)。

自测：

1. 消息队列有什么作用？什么时候用 RPC，什么时候用消息队列？（见[使用场景](消息队列.md#二使用场景)、[与 RPC 调用的区别](消息队列.md#与-rpc-调用的区别)）
2. 怎样保证消息不丢失？（见[消息队列的可靠性](消息队列.md#三可靠性)）
3. 怎样避免重复消费？（见[接收端的可靠性](消息队列.md#接收端的可靠性)）

动手：阅读[附录 A2](消息队列.md#a2-重复消费)，说出消费者在哪一步被杀死导致了重复扣款，再按[接收端的可靠性](消息队列.md#接收端的可靠性)一节的方法设计去重。

算法（动态规划，中等）：[64. 最小路径和](https://leetcode.cn/problems/minimum-path-sum/)，题解见[矩阵的最小路径和](Leetcode%20题解%20-%20动态规划.md#1-矩阵的最小路径和)。

### 第 58 天：顺序、积压与延迟消息

顺序性、积压和延迟消息都是业务中常遇到的问题。处理积压前先区分是生产突增还是消费变慢。

阅读：《消息队列》从[顺序性](消息队列.md#四顺序性)读到[延迟消息与死信队列](消息队列.md#六延迟消息与死信队列)。

自测：

1. 怎样保证消息按顺序消费？（见[顺序性](消息队列.md#四顺序性)）
2. 消息大量积压时怎样处理？（见[消息堆积](消息队列.md#五消息堆积)）
3. 怎样实现订单 30 分钟未支付自动取消？（见[延迟消息](消息队列.md#延迟消息)）

动手：按[附录 A3](消息队列.md#a3-消费积压)的输出，说出每个分区积压了多少条消息，LAG 一列是怎样算出来的。

算法（动态规划，中等）：[198. 打家劫舍](https://leetcode.cn/problems/house-robber/)，题解见[强盗抢劫](Leetcode%20题解%20-%20动态规划.md#2-强盗抢劫)。

### 第 59 天：Kafka

按分区与消费者组、副本、存储、吞吐量的顺序读。副本与可靠性一节说明了 acks 和 ISR 怎样保证消息不丢。

阅读：《消息队列》的[Kafka](消息队列.md#七kafka)。

自测：

1. Kafka 为什么吞吐量高？（见[为什么吞吐量高](消息队列.md#为什么吞吐量高)）
2. Kafka 的副本机制怎样保证可靠性？（见[副本与可靠性](消息队列.md#副本与可靠性)）
3. 消费者组中的消费者比分区多时会怎样？（见[分区与消费者组](消息队列.md#分区与消费者组)）

动手：阅读[附录 A1](消息队列.md#a1-批量对吞吐量的影响)，说明 batch.size 和 linger.ms 是怎样影响吞吐量和延迟的。

算法（双指针，困难）：[42. 接雨水](https://leetcode.cn/problems/trapping-rain-water/)，题解见[接雨水](Leetcode%20题解%20-%20双指针.md#9-接雨水)。

综合题：下单后需要扣库存、发优惠券、发短信：哪些步骤放在同一个事务中，哪些通过消息队列异步完成？消息丢失或重复时分别会怎样？（见[异步处理](消息队列.md#异步处理)、[本地消息表](分布式.md#本地消息表)、[幂等](分布式.md#九幂等)）

## 十四、系统设计

### 第 60 天：性能与可用性

性能指标中的分位数比平均值更能反映用户的感受。限流、降级与熔断一节较长，三者的区别和各自的触发条件是重点。

阅读：《系统设计基础》从[性能](系统设计基础.md#一性能)读到[安全性](系统设计基础.md#五安全性)。选读：[集群下的 Session 管理](集群.md#二集群下的-session-管理)。

自测：

1. 常用的限流算法有哪些？分别有什么特点？（见[限流算法](系统设计基础.md#1-限流算法)）
2. 限流、熔断和降级有什么区别？熔断器怎样从打开恢复到关闭？（见[熔断](系统设计基础.md#3-熔断)、[降级](系统设计基础.md#4-降级)）
3. QPS、TPS 和 TP99 分别是什么意思？（见[性能指标](系统设计基础.md#性能指标)）

动手：运行[附录 A14](系统设计基础.md#a14-guava-的-ratelimiter)的代码，比较 acquire() 和 tryAcquire() 在令牌不足时的行为。

算法（滑动窗口，困难）：[239. 滑动窗口最大值](https://leetcode.cn/problems/sliding-window-maximum/)，题解见[剑指 Offer 59](59.%20滑动窗口的最大值.md)。

### 第 61 天：秒杀与抢红包

秒杀把前面学过的缓存、消息队列和数据库锁组合在一起。防止超卖和库存一致两节回答了最常见的追问；红包和抽奖是同类场景。

阅读：《系统设计基础》的[秒杀系统](系统设计基础.md#六秒杀系统)。

自测：

1. 秒杀系统怎样防止超卖？悲观锁、乐观锁和条件更新各有什么问题？（见[防止超卖的几种做法](系统设计基础.md#防止超卖的几种做法)）
2. Redis 预扣库存成功、订单却创建失败，怎样保证两边一致？（见[Redis 与数据库的库存一致](系统设计基础.md#redis-与数据库的库存一致)）
3. 抢红包时金额怎样拆分？（见[同类场景：抢券、抢红包与抽奖](系统设计基础.md#同类场景抢券抢红包与抽奖)）

动手：按[附录 A1](系统设计基础.md#a1-秒杀)的方法，用 Lua 脚本扣减库存，并发请求后核对库存和订单数是否一致。

算法（滑动窗口，困难）：[76. 最小覆盖子串](https://leetcode.cn/problems/minimum-window-substring/)，题解见[最小覆盖子串](Leetcode%20题解%20-%20双指针.md#10-最小覆盖子串)。

### 第 62 天：海量数据、短链与 Feed 流

这三章都是常见的场景题。海量数据处理的思路是分而治之；短链和 Feed 流重点看存储方式和推拉模式的取舍。

阅读：《系统设计基础》从[海量数据处理](系统设计基础.md#七海量数据处理)读到[Feed 流](系统设计基础.md#九feed-流)。

自测：

1. 100 GB 的日志中每行是一个 URL，内存只有 4 GB，怎样找出出现次数最多的 10 个？（见[出现次数最多的 K 个](系统设计基础.md#出现次数最多的-k-个)）
2. 短链跳转用 301 还是 302？（见[跳转用 301 还是 302](系统设计基础.md#跳转用-301-还是-302)）
3. Feed 流用推模式还是拉模式？（见[拉模式与推模式](系统设计基础.md#拉模式与推模式)）

动手：阅读[附录 A2](系统设计基础.md#a2-短链跳转)，说明浏览器第二次访问返回 301 的短链时为什么没有请求服务器，这对统计点击量有什么影响。

算法（链表，困难）：[25. K 个一组翻转链表](https://leetcode.cn/problems/reverse-nodes-in-k-group/)，题解见[K 个一组翻转链表](Leetcode%20题解%20-%20链表.md#11-k-个一组翻转链表)。

### 第 63 天：高并发系统的设计

本章以一个具体的系统为例，从容量估算讲到读写路径和压测。读时把每一步和前面学过的组件对应起来。

阅读：《系统设计基础》的[高并发系统的设计](系统设计基础.md#十高并发系统的设计)。

自测：

1. 设计一个系统前，怎样估算需要的机器和存储？（见[容量估算](系统设计基础.md#容量估算)）
2. QPS 突然增长到原来的 10 倍，应该先做什么？（见[QPS 突增 10 倍时先做什么](系统设计基础.md#qps-突增-10-倍时先做什么)）
3. 怎样做压测和容量规划？（见[压测与容量规划](系统设计基础.md#压测与容量规划)）

算法（链表，困难）：[23. 合并 K 个升序链表](https://leetcode.cn/problems/merge-k-sorted-lists/)，题解见[合并 K 个有序链表](Leetcode%20题解%20-%20链表.md#13-合并-k-个有序链表)。

### 第 64 天：Docker

前几章介绍 Docker 解决什么问题，可以略读。镜像与容器一节的 Dockerfile 写法和问题排查是实际工作中最常用的部分。

阅读：《Docker》从[解决的问题](Docker.md#一解决的问题)读到[镜像与容器](Docker.md#六镜像与容器)。

自测：

1. Docker 和虚拟机有什么区别？（见[与虚拟机的比较](Docker.md#二与虚拟机的比较)）
2. 怎样写一个体积小、构建快的 Dockerfile？（见[用 Dockerfile 构建镜像](Docker.md#用-dockerfile-构建镜像)）
3. 容器启动后马上退出，怎样排查？（见[容器的常见问题排查](Docker.md#容器的常见问题排查)）

动手：为一个 Spring Boot 项目写多阶段构建的 Dockerfile，对比单阶段和多阶段构建的镜像大小。

算法（二叉树，困难）：[124. 二叉树中的最大路径和](https://leetcode.cn/problems/binary-tree-maximum-path-sum/)。

### 第 65 天：Kubernetes

Kubernetes 重点看 Pod 的创建过程、Service 和 Ingress 的作用，以及 Pod 异常时怎样排查。

阅读：《Docker》的[Kubernetes](Docker.md#七kubernetes)。选读：[大文件上传](系统设计基础.md#十一大文件上传)、[权限系统](系统设计基础.md#十二权限系统)。

自测：

1. 创建一个 Pod 时，Kubernetes 内部经过了哪些步骤？（见[Pod 的创建过程](Docker.md#pod-的创建过程)）
2. Service 和 Ingress 有什么区别？（见[Service 与 Ingress](Docker.md#service-与-ingress)）
3. Pod 一直处于 CrashLoopBackOff 状态，怎样排查？（见[Pod 异常状态的排查](Docker.md#pod-异常状态的排查)）

算法（动态规划，困难）：[72. 编辑距离](https://leetcode.cn/problems/edit-distance/)，题解见[编辑距离](Leetcode%20题解%20-%20动态规划.md#2-编辑距离)。

综合题：设计一个秒杀系统：从页面、网关、服务、缓存、消息队列到数据库，每一层分别做什么来扛住流量、防止超卖？出现故障时怎样降级？（见[秒杀系统](系统设计基础.md#六秒杀系统)、[读路径的逐层分流](系统设计基础.md#读路径的逐层分流)、[限流、降级与熔断](系统设计基础.md#限流降级与熔断)）
