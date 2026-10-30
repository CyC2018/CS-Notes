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
        * [第 66 天：系统设计题的思路与即时通讯](#第-66-天系统设计题的思路与即时通讯)
        * [第 67 天：订单与支付](#第-67-天订单与支付)
<!-- GFM-TOC -->


## 一、说明

适合会 Java 语法、准备 Java 后端面试的读者，每天约 1～1.5 小时；没有计算机基础的先学[零基础](学习路线%20-%20零基础.md)。

每天先读完阅读范围，再不看笔记回答自测题，答完展开参考要点核对；动手练习对照预期的结果；算法题先独立做 20～30 分钟，做不出来再看题解。自测答得上来、动手结果与预期一致、算法题提交通过，这一天就完成了。选读可以跳过。

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
| [64](#第-64-天docker) | Docker | Docker：解决的问题～镜像与容器 | 32. 最长有效括号 |
| [65](#第-65-天kubernetes) | Kubernetes | Docker：Kubernetes | 4. 寻找两个正序数组的中位数 |
| [66](#第-66-天系统设计题的思路与即时通讯) | 系统设计题的思路与即时通讯 | 系统设计基础：系统设计题的思路～即时通讯 | 124. 二叉树中的最大路径和 |
| [67](#第-67-天订单与支付) | 订单与支付 | 系统设计基础：订单与支付 | 72. 编辑距离 |

## 四、Java 基础

### 第 1 天：数据类型与 String

从基本类型和包装类型开始。缓存池解释了 Integer 用 == 比较时 127 和 128 结果不同的原因；String 的不可变是后面理解常量池和线程安全的前提。

阅读：《Java 基础》从[数据类型](Java%20基础.md#一数据类型)读到[String, StringBuffer and StringBuilder](Java%20基础.md#string-stringbuffer-and-stringbuilder)。

自测：

1. String、StringBuffer 和 StringBuilder 有什么区别？（见[String, StringBuffer and StringBuilder](Java%20基础.md#string-stringbuffer-and-stringbuilder)）
2. String 为什么设计成不可变的？（见[不可变的好处](Java%20基础.md#不可变的好处)）
3. Integer a = 127, b = 127 时 a == b 的结果是什么？换成 128 呢？（见[缓存池](Java%20基础.md#缓存池)）

<details>
<summary>参考要点</summary>

1. 可变性：String 不可变，StringBuffer 和 StringBuilder 可变；线程安全：String 因不可变而线程安全，StringBuffer 的方法用 synchronized 同步，StringBuilder 不加锁，单线程拼接时用它；循环中拼接字符串应在循环外建一个 StringBuilder 调用 append()，用 + 每次都会创建新对象并复制内容。
2. 哈希值不变，只需计算一次，适合做 HashMap 的键；String Pool 中多个引用共享同一个对象，只有不可变才能这样共享；作为网络连接等参数时不会被中途改掉；不可变的对象天然线程安全。
3. 127 时为 true，128 时为 false；自动装箱调用 Integer.valueOf()，值在缓存池范围 -128～127 内时返回 IntegerCache 中的同一个对象，超出范围时 new 一个新对象；启动参数 -XX:AutoBoxCacheMax 可以调大上界。

</details>

动手：运行[附录 A1](Java%20基础.md#a1-包装类型的缓存池)的代码，对照 Integer.valueOf() 的实现解释 127 和 128 的结果为什么不同。

预期：Integer、Long、Short、Character 都是 127 时为 true、128 时为 false，Float、Double 为 false；Integer.valueOf() 只在 -128～127 内返回缓存数组中的对象；加 -XX:AutoBoxCacheMax=1000 后只有 Integer 的 128 变为 true，其它包装类型的缓存范围固定。

算法（哈希表，简单）：[1. 两数之和](https://leetcode.cn/problems/two-sum/)，题解见[数组中两个数的和为给定值](Leetcode%20题解%20-%20哈希表.md#1-数组中两个数的和为给定值)。

明天：第 2 天，常量池与运算（Java 基础：String Pool～运算）。

### 第 2 天：常量池与运算

常量池决定了两个相同的字面量是不是同一个对象。运算一节中最常被问到的是参数传递。

阅读：《Java 基础》从[String Pool](Java%20基础.md#string-pool)读到[运算](Java%20基础.md#三运算)。

自测：

1. new String("abc") 会创建几个对象？（见[new String("abc")](Java%20基础.md#new-stringabc)）
2. Java 是值传递还是引用传递？（见[参数传递](Java%20基础.md#参数传递)）

<details>
<summary>参考要点</summary>

1. String Pool 中还没有 "abc" 时创建两个：字面量 "abc" 在 String Pool 中（HotSpot 通常在第一次执行对应的 ldc 时创建），另一个是 new 在堆中创建的对象；Pool 中已有 "abc" 时只新建堆中的一个；两个对象共享同一个 value 数组。
2. 值传递；传入对象时复制的是对象的地址，方法中修改对象的字段会影响原对象；方法中让形参指向新对象，方法外的引用不变。

</details>

动手：运行[附录 A2](Java%20基础.md#a2-字符串的存储)的代码，观察字面量和 new 出来的字符串是否共享同一个字节数组。

预期：s1 == s2 为 true，s1 == s3 为 false，s3.intern() == s1 为 true；s1.value == s3.value 为 true，new 出来的字符串与字面量共享同一个字节数组。

算法（哈希表，中等）：[128. 最长连续序列](https://leetcode.cn/problems/longest-consecutive-sequence/)，题解见[最长连续序列](Leetcode%20题解%20-%20哈希表.md#4-最长连续序列)。

明天：第 3 天，关键字与 Object 的方法（Java 基础：关键字～Object 通用方法）。

### 第 3 天：关键字与 Object 的方法

static 一节的初始化顺序可以对照代码自己推一遍。equals() 和 hashCode() 的约定是理解 HashMap 的前提；clone() 掌握深拷贝与浅拷贝的区别即可。

阅读：《Java 基础》从[关键字](Java%20基础.md#四关键字)读到[Object 通用方法](Java%20基础.md#五object-通用方法)。

自测：

1. == 和 equals() 有什么区别？（见[等价与相等](Java%20基础.md#2-等价与相等)）
2. 重写 equals() 时为什么必须重写 hashCode()？（见[hashCode()](Java%20基础.md#hashcode)）
3. 浅拷贝和深拷贝有什么区别？怎样实现深拷贝？（见[clone()](Java%20基础.md#clone)）

<details>
<summary>参考要点</summary>

1. 基本类型用 == 比较值，没有 equals()；引用类型的 == 判断两个变量是否引用同一个对象，equals() 判断两个对象是否等价，例如两个 new Integer(1) 用 == 为 false、equals() 为 true。
2. 约定是等价的两个对象哈希值必须相同；HashMap、HashSet 先用 hashCode() 确定桶并比较哈希值，相等才调用 equals()；只重写 equals() 时两个等价对象的哈希值通常不同，会被当成两个键存入。
3. 浅拷贝的引用类型字段与原对象指向同一个对象；深拷贝要把对象图中的可变对象逐层复制，String 这类不可变对象可以共享，例如订单的商品列表要复制列表本身和其中的每个商品；用 clone() 实现时先调用 super.clone()，再为可变的引用字段新建对象并复制内容；clone() 需要实现 Cloneable、处理异常和类型转换，更推荐拷贝构造函数或拷贝工厂。

</details>

动手：写一个只重写了 equals()、没有重写 hashCode() 的类，把两个相等的对象放进 HashSet，观察 size() 的结果，再补上 hashCode() 对比。

预期：只重写 equals() 时 size() 为 2，补上 hashCode() 后为 1。

算法（哈希表，中等）：[560. 和为 K 的子数组](https://leetcode.cn/problems/subarray-sum-equals-k/)，题解见[和为 K 的子数组](Leetcode%20题解%20-%20哈希表.md#5-和为-k-的子数组)。

明天：第 4 天，继承与多态（面向对象思想：三大特性；Java 基础：继承）。

### 第 4 天：继承与多态

先读面向对象的三大特性，再读 Java 中的实现：访问权限、抽象类与接口、重写与重载。多态一节说明了运行时怎样找到被调用的方法。

阅读：《面向对象思想》的[三大特性](面向对象思想.md#一三大特性)；《Java 基础》的[继承](Java%20基础.md#六继承)。

自测：

1. 抽象类和接口有什么区别？分别用在什么场景？（见[比较](Java%20基础.md#3-比较)、[使用选择](Java%20基础.md#4-使用选择)）
2. 重载和重写有什么区别？（见[重写与重载](Java%20基础.md#重写与重载)）
3. 多态是怎么实现的？（见[多态](面向对象思想.md#多态)）

<details>
<summary>参考要点</summary>

1. 设计上抽象类是 IS-A 关系，接口是 LIKE-A 关系，只提供方法契约；一个类可以实现多个接口，只能继承一个抽象类；接口的字段只能是 static final，成员默认 public，抽象类没有这些限制；相关类共享代码、需要非 public 成员或非常量字段时用抽象类，让不相关的类具备同一行为（例如 Comparable）时用接口，多数情况接口优先。
2. 重写发生在子类与父类之间，方法声明相同，访问权限不能更小，返回类型与父类相同或为其子类型（基本类型必须相同），抛出的受检异常只能是父类方法声明的异常或其子类型；重载指一个类中（包括从父类继承来的方法）方法名相同，参数类型、个数、顺序至少一个不同，只有返回值不同不算重载；重载在编译时按参数的静态类型选定，重写在运行时按对象的实际类型选定。
3. 运行时多态需要继承或实现接口、重写和向上转型；通过类类型的引用调用编译成 invokevirtual 加符号引用，通过接口类型的引用调用用 invokeinterface，运行时按对象的实际类型选择方法，称为动态分派；HotSpot 为每个类维护虚方法表（vtable），按固定槽位取方法入口，接口调用用 itable；重载在编译时按静态类型确定，称为静态分派。

</details>

动手：按[附录 A1](面向对象思想.md#a1-方法调用的字节码)的步骤，用 javap -c 查看重载和重写分别编译成了哪条调用指令。

预期：instrument.play() 编译成 invokevirtual Instrument.play:()V；两个重载的 show() 都是 invokestatic，描述符按参数的静态类型分别为 (LInstrument;)V 和 (LWind;)V；private 和 final 方法也用 invokevirtual。

算法（数组，中等）：[54. 螺旋矩阵](https://leetcode.cn/problems/spiral-matrix/)，题解见[剑指 Offer 29](29.%20顺时针打印矩阵.md)。

明天：第 5 天，反射、异常、泛型与新特性（Java 基础：反射～特性）。

### 第 5 天：反射、异常、泛型与新特性

反射是 Spring 等框架的基础，读时留意它的代价。异常一节重点看 finally 与 return 的执行顺序；Java 与 C++ 的比较可以略读。

阅读：《Java 基础》从[反射](Java%20基础.md#七反射)读到[特性](Java%20基础.md#十一特性)。选读：[对象操作](Java%20IO.md#五对象操作)。

自测：

1. 反射的原理是什么？有哪些应用场景？（见[反射](Java%20基础.md#七反射)）
2. try 和 catch 中有 return 时，finally 还会执行吗？返回值是什么？（见[异常](Java%20基础.md#八异常)）
3. 什么是泛型擦除？（见[泛型](Java%20基础.md#九泛型)）

<details>
<summary>参考要点</summary>

1. 类加载时 JVM 根据 .class 文件创建 Class 对象，反射通过它在运行时取得类的信息，类名可以到运行时才确定；用 Field 读写字段，Method 的 invoke() 调用方法，Constructor 的 newInstance() 创建对象；应用：Spring 创建 Bean 并注入、MyBatis 写入结果字段、JUnit 调用 @Test 方法、JDK 动态代理；缺点是有性能开销（框架会缓存 Method 对象），类名和方法名写成字符串、失去编译期检查，JDK 16 起默认不能反射访问 JDK 内部的私有成员，会破坏封装。
2. 会执行，finally 在离开 try 语句之前执行；返回值在执行 finally 之前已经保存，返回基本类型时 finally 修改变量不影响返回值，返回引用时能看到对对象的修改；finally 中的 return 会覆盖返回值并吞掉异常；调用 System.exit()、kill -9 或 JVM 崩溃时 finally 不执行。
3. 泛型只在编译时检查类型，编译后类型参数替换为上界（没有上界时为 Object），取出元素处由编译器插入强制类型转换；运行时 List<String> 和 List<Integer> 是同一个类，所以类型参数不能是基本类型，不能 new T() 或用 instanceof List<String>；类、字段、方法声明上的泛型信息保存在 Signature 属性中，可以通过反射读取。

</details>

动手：运行[附录 A6](Java%20基础.md#a6-finally-的执行顺序与返回值)的代码，先预测每个方法的返回值再对照输出。

预期：pay() 依次输出 try、catch、finally 后返回 2；primitive() 返回 1，reference() 返回 [try, finally]，override() 返回 -1；System.exit(0) 之后 finally 没有输出。

算法（数组，中等）：[56. 合并区间](https://leetcode.cn/problems/merge-intervals/)，题解见[合并区间](Leetcode%20题解%20-%20数组与矩阵.md#13-合并区间)。

综合题：设计一个 Order 类作为 HashMap 的键：需要重写哪些方法？字段为什么最好用 final？要复制一个订单时用浅拷贝还是深拷贝？（见[equals()](Java%20基础.md#equals)、[hashCode()](Java%20基础.md#hashcode)、[final](Java%20基础.md#final)、[clone()](Java%20基础.md#clone)、[内存溢出与内存泄漏](Java%20虚拟机.md#内存溢出与内存泄漏)）

<details>
<summary>答题思路</summary>

1. 重写 equals() 和 hashCode()，两者用同一组关键字段（例如订单号）比较和计算，hashCode() 可以用 Objects.hash()。
2. HashMap 先按 hashCode() 定位桶，哈希值相等再调用 equals()，只重写 equals() 会存入重复的键。
3. 参与比较的字段用 final：放入 HashMap 后如果字段被修改，哈希值随之改变，按新哈希值定位不到原来的桶，键就取不出来了。
4. 复制订单时，含有可变的引用字段（例如商品列表）要深拷贝，否则副本和原订单共享同一个列表；推荐用拷贝构造函数或拷贝工厂代替 clone()。

</details>

明天：第 6 天，集合与 List（Java 容器：集合概览～CopyOnWriteArrayList）。

## 五、Java 容器

### 第 6 天：集合与 List

先看集合框架的全貌，再看 List 的几种实现。Vector 已经很少使用，前三小节可以略读，它的替代方案一节讲了 ArrayList 为什么线程不安全，要细读；ArrayList 的扩容和 fail-fast 要读懂。

阅读：《Java 容器》从[集合概览](Java%20容器.md#一概览)读到[CopyOnWriteArrayList](Java%20容器.md#copyonwritearraylist)。

自测：

1. ArrayList 和 LinkedList 有什么区别？分别用在什么场景？（见[与 ArrayList 的比较](Java%20容器.md#2-与-arraylist-的比较)）
2. ArrayList 是怎样扩容的？（见[扩容](Java%20容器.md#2-扩容)）
3. 线程安全的 List 有哪些？CopyOnWriteArrayList 适合什么场景？（见[Vector](Java%20容器.md#vector)、[CopyOnWriteArrayList](Java%20容器.md#copyonwritearraylist)）

<details>
<summary>参考要点</summary>

1. ArrayList 基于动态数组，支持随机访问，插入删除要移动元素；LinkedList 基于双向链表，插入删除只改指针，但要先遍历到插入位置；10 万个元素中间插入 1 万次，ArrayList 约 50 ms，LinkedList 约 0.8～1 秒，只有头部插入 LinkedList 明显更快；多数场景用 ArrayList，头尾频繁增删用 ArrayDeque 或 LinkedList。
2. 添加元素时容量不够就调用 grow()，新容量为 oldCapacity + (oldCapacity >> 1)，约 1.5 倍；无参构造的容量依次为 0、10、15、22、33；扩容用 Arrays.copyOf() 复制整个数组，能预估大小时创建时就指定容量。
3. 线程安全的 List 有 Vector、Collections.synchronizedList() 和 CopyOnWriteArrayList；CopyOnWriteArrayList 写操作加锁并在复制的新数组上进行，写完再替换原数组，读不加锁；适合读多写少的场景，缺点是写时内存约翻倍，写入期间读到的可能是旧数组，迭代器也看不到创建后的修改。

</details>

动手：运行[附录 A1](Java%20容器.md#a1-arraylist-的扩容与常见陷阱)和[附录 A3](Java%20容器.md#a3-arraylist-的并发写入)的代码，观察扩容时数组长度的变化，以及并发写入时丢失的元素。

预期：容量依次变为 0、10、15、22、33；8 个线程各添加 10 万个元素后 size 每轮不同（15 万～58 万），多数轮次出现 null，偶尔抛出 ArrayIndexOutOfBoundsException，synchronizedList 每次都是 800000。

算法（双指针，简单）：[88. 合并两个有序数组](https://leetcode.cn/problems/merge-sorted-array/)，题解见[归并两个有序数组](Leetcode%20题解%20-%20双指针.md#5-归并两个有序数组)。

明天：第 7 天，HashMap（Java 容器：HashMap）。

### 第 7 天：HashMap

HashMap 是 Java 面试中问得最多的容器。按存储结构、put、桶下标、扩容的顺序读，计算数组容量一节可以略读。

阅读：《Java 容器》的[HashMap](Java%20容器.md#hashmap)。选读：[进阶：HashMap](Java%20容器%20-%20进阶.md#hashmap)。

自测：

1. HashMap 的 put() 过程是怎样的？（见[put 操作](Java%20容器.md#3-put-操作)）
2. HashMap 是怎样扩容的？为什么容量是 2 的幂？（见[扩容-基本原理](Java%20容器.md#5-扩容-基本原理)、[扩容-重新计算桶下标](Java%20容器.md#6-扩容-重新计算桶下标)、[确定桶下标](Java%20容器.md#4-确定桶下标)）
3. HashMap 为什么线程不安全？（见[线程安全](Java%20容器.md#10-线程安全)）

<details>
<summary>参考要点</summary>

1. 用 hash() 计算哈希值，table 为空时先 resize() 创建数组；用 (n - 1) & hash 求桶下标，桶为空直接放入；头节点是 TreeNode 就在红黑树中插入，否则遍历链表，键相同则替换旧值，否则接到链表尾部，已有 8 个节点时调用 treeifyBin()；size 大于 threshold 时扩容。
2. 插入后 size 大于 threshold（capacity × 0.75）时容量翻倍，默认 16 时放入第 13 个键后变为 32；扩容时按 hash & oldCap 是否为 0 把节点分到 j 和 j + oldCap 两个位置，保持相对顺序；容量是 2 的幂时，hash & (capacity - 1) 只保留 hash 的低位，hash 非负时与 hash % capacity 相同（hash 为负时 % 可能得到负数，与运算仍是合法下标），位运算比取模快，扩容也只需看一位；长度不是 2 的幂时 length - 1 中有为 0 的位，一部分桶永远用不到。
3. 两个线程同时向同一个空桶插入，后写的覆盖先写的，size++ 也不是原子操作，8 个线程各插 10 万个键 size 远少于 80 万；JDK 1.7 并发扩容时头插法可能让链表成环，get 死循环；JDK 1.8 改为尾插法，但仍会丢数据，转红黑树时还可能破坏树结构；多线程用 ConcurrentHashMap。

</details>

动手：运行[附录 A4](Java%20容器.md#a4-hashmap-链表转红黑树)的代码，观察桶中节点在什么时候从链表变成红黑树，又在什么时候变回来。

预期：所有键哈希相同时，放入第 9 个键容量扩为 32、第 10 个扩为 64，第 11 个才转为 TreeNode；逐个删除到剩 3 个键时转回链表；扩容拆分后每个桶不超过 6 个节点也转回链表。

算法（双指针，中等）：[15. 三数之和](https://leetcode.cn/problems/3sum/)，题解见[三数之和](Leetcode%20题解%20-%20双指针.md#8-三数之和)。

明天：第 8 天，ConcurrentHashMap 与 LinkedHashMap（Java 容器：ConcurrentHashMap～WeakHashMap）。

### 第 8 天：ConcurrentHashMap 与 LinkedHashMap

ConcurrentHashMap 重点比较 JDK 1.7 的分段锁和 1.8 的桶级锁，再看清单个键的操作原子、组合起来不原子的区别。LinkedHashMap 按访问顺序排列时可以直接实现 LRU 缓存；WeakHashMap 可以略读。

阅读：《Java 容器》从[ConcurrentHashMap](Java%20容器.md#concurrenthashmap)读到[WeakHashMap](Java%20容器.md#weakhashmap)。选读：[进阶：ConcurrentHashMap](Java%20容器%20-%20进阶.md#concurrenthashmap)。

自测：

1. ConcurrentHashMap 怎样保证线程安全？JDK 1.7 和 1.8 有什么区别？（见[JDK 1.8 的改动](Java%20容器.md#3-jdk-18-的改动)）
2. ConcurrentHashMap 是怎样扩容的？size() 为什么不精确？（见[JDK 1.8 的改动](Java%20容器.md#3-jdk-18-的改动)、[size 操作](Java%20容器.md#2-size-操作)）
3. 怎样用 LinkedHashMap 实现 LRU 缓存？（见[LRU 缓存](Java%20容器.md#lru-缓存)）

<details>
<summary>参考要点</summary>

1. JDK 1.7 用分段锁，Segment 继承 ReentrantLock，默认 16 个，最多 16 个线程同时写，并发度创建后不能改；JDK 1.8 去掉 Segment，用 Node 数组加链表或红黑树，空桶用 CAS 插入，非空桶用 synchronized 锁住头节点，锁粒度缩小到桶；get 不加锁，靠 volatile 读到最新值。
2. 元素个数达到 sizeCtl（容量的 0.75 倍）时创建 2 倍的新数组，多个线程用 CAS 修改 transferIndex 领取至少 16 个桶从后往前迁移，迁移完的桶放入 ForwardingNode，put 遇到它会先尝试帮忙迁移，再到新数组中插入；元素个数分散在 baseCount 和多个 CounterCell 中，size() 不加锁求和，期间其它线程可能在增减，所以只是估计值。
3. 继承 LinkedHashMap，构造时把 accessOrder 设为 true，每次访问把节点移到链表尾部，链表头部就是最久未使用的节点；重写 removeEldestEntry()，size() 超过容量时返回 true，插入后移除头部节点。

</details>

动手：运行[附录 A2](Java%20容器.md#a2-hashmap-的并发写入)的代码，再把 HashMap 换成 ConcurrentHashMap 运行一次，对比 size 的结果。

预期：HashMap 的 size 每次不同（例如 111068、323870），远少于 80 万，还可能抛出 ClassCastException 或线程卡在 treeify() 中；ConcurrentHashMap 每次都是 800000。

算法（双指针，中等）：[11. 盛最多水的容器](https://leetcode.cn/problems/container-with-most-water/)。

综合题：实现一个容量固定的本地缓存：选用哪种容器？怎样淘汰最久没有访问的数据？多个线程同时访问时要注意什么？（见[LRU 缓存](Java%20容器.md#lru-缓存)、[ConcurrentHashMap](Java%20容器.md#concurrenthashmap)）

<details>
<summary>答题思路</summary>

1. 选 LinkedHashMap：accessOrder 设为 true 维护访问顺序，重写 removeEldestEntry() 在 size() 超过容量时返回 true。
2. 每次 get 都会把节点移到链表尾部，put 后移除链表头部即最久未访问的数据。
3. LinkedHashMap 不是线程安全的，get 也会修改链表，多线程访问时所有读写都要加锁，例如用 Collections.synchronizedMap() 包装。
4. 换成 ConcurrentHashMap 可以并发读写，但它不维护访问顺序，并且只保证单个操作原子，先查再放要用 putIfAbsent、compute 等方法。

</details>

明天：第 9 天，线程与线程池（Java 并发：使用线程～基础线程机制）。

## 六、Java 并发

### 第 9 天：线程与线程池

先看创建线程的几种方式，再看线程池。ThreadPoolExecutor 一节是本章的重点：核心参数、任务提交后的处理顺序和拒绝策略都要能讲清。

阅读：《Java 并发》从[使用线程](Java%20并发.md#一使用线程)读到[基础线程机制](Java%20并发.md#二基础线程机制)。

自测：

1. 线程池的核心参数有哪些？（见[ThreadPoolExecutor](Java%20并发.md#threadpoolexecutor)）
2. 提交一个任务后，线程池是怎样处理的？为什么先放进队列，队列满了才创建新线程？（见[ThreadPoolExecutor](Java%20并发.md#threadpoolexecutor)）
3. 线程池有哪些拒绝策略？怎样选择？（见[ThreadPoolExecutor](Java%20并发.md#threadpoolexecutor)）

<details>
<summary>参考要点</summary>

1. corePoolSize 核心线程数，maximumPoolSize 最大线程数；keepAliveTime 和 unit：超出核心线程数的线程空闲多久后回收；workQueue 保存等待任务的阻塞队列，threadFactory 创建线程，常用来起名字；handler 拒绝策略，线程数达到最大且队列已满时处理新提交的任务。
2. 线程数小于核心线程数时新建线程执行，否则放入队列，队列满且线程数小于最大线程数时新建线程执行当前任务，都不满足就执行拒绝策略；先排队是因为线程比排队的任务昂贵：核心线程承担平时的负载，队列缓冲短时高峰；队列也满了说明负载持续超出处理能力，才临时增加线程，高峰过后空闲的线程被回收。
3. AbortPolicy（默认）抛出 RejectedExecutionException，CallerRunsPolicy 由提交任务的线程自己执行，DiscardPolicy 直接丢弃，DiscardOldestPolicy 丢弃队列中最早的任务再提交；不能丢且提交方能处理失败时用 Abort，能接受变慢时用 CallerRuns，Netty 的 I/O 线程这类不能阻塞的线程除外；允许丢失的统计上报用 Discard，只关心最新数据时用 DiscardOldest；线程池关闭后再提交，CallerRuns 会直接丢弃任务，submit() 返回的 Future 永远不会完成。

</details>

动手：读懂正文中的 SimplePool，运行[附录 A6](Java%20并发.md#a6-简化版线程池)的代码，说出它与 ThreadPoolExecutor 相比少了哪些功能。

预期：每次都是 3 个任务完成，任务 2 的异常不会让工作线程退出，关闭后的提交被拒绝；与 ThreadPoolExecutor 相比少了按需创建线程、最大线程数与空闲超时回收、可选的拒绝策略，以及用 ctl 记录的运行状态。

算法（滑动窗口，中等）：[3. 无重复字符的最长子串](https://leetcode.cn/problems/longest-substring-without-repeating-characters/)，题解见[无重复字符的最长子串](Leetcode%20题解%20-%20双指针.md#11-无重复字符的最长子串)。

明天：第 10 天，中断与互斥同步（Java 并发：中断～互斥同步）。

### 第 10 天：中断与互斥同步

中断是让线程停下来的协作方式，线程池的 shutdownNow() 就靠它实现。互斥同步重点比较 synchronized 和 ReentrantLock。

阅读：《Java 并发》从[中断](Java%20并发.md#三中断)读到[互斥同步](Java%20并发.md#四互斥同步)。

自测：

1. 怎样停止一个正在运行的线程？（见[中断](Java%20并发.md#三中断)）
2. shutdown() 和 shutdownNow() 有什么区别？（见[Executor 的中断操作](Java%20并发.md#executor-的中断操作)）
3. synchronized 和 ReentrantLock 有什么区别？（见[synchronized 与 ReentrantLock 的比较](Java%20并发.md#比较)）

<details>
<summary>参考要点</summary>

1. 靠协作：其它线程设置 volatile 停止标记或调用 interrupt()，由线程自己检查后在合适的位置结束；线程在 sleep()、wait()、join() 中时 interrupt() 使其抛出 InterruptedException，捕获后是否结束由代码决定，只设停止标记唤醒不了它；循环中没有这类调用时，用 interrupted() 检查中断标记后退出；interrupt() 不能中断等待 synchronized 锁的阻塞，平台线程阻塞在传统 I/O 上时通常也不响应；Thread.stop() 可能留下修改了一半的数据，JDK 20 起直接抛出 UnsupportedOperationException；线程池中可以用 Future 的 cancel(true) 中断单个任务。
2. shutdown() 后不再接受新任务，已提交的任务继续执行完，本身不阻塞，需要等待时调用 awaitTermination()；shutdownNow() 相当于对每个线程调用 interrupt()，并返回队列中还没有执行的任务。
3. synchronized 由 JVM 实现，ReentrantLock 由 JDK 基于 AQS 实现，性能大致相同；ReentrantLock 支持等待可中断、公平锁和绑定多个 Condition，synchronized 都不支持；ReentrantLock 必须在 finally 中 unlock()，synchronized 由 JVM 保证释放；不需要这些功能时优先用 synchronized，但 JDK 21 的虚拟线程在 synchronized 中阻塞会固定载体线程，包住 I/O 的临界区改用 ReentrantLock（JDK 24 起基本不再固定）。

</details>

动手：运行[附录 A2](Java%20并发.md#a2-公平锁与非公平锁)的代码，比较公平锁与非公平锁的耗时。

预期：两种锁的 count 都是 1600000，非公平锁约 55 ms，公平锁约 3 秒；非公平锁加锁时先 CAS 抢一次，刚释放锁的线程能立即再次获得，公平锁发现有线程在等就排到队尾，几乎每次加锁都换一个线程，唤醒和调度的开销更大。

算法（字符串，简单）：[415. 字符串相加](https://leetcode.cn/problems/add-strings/)，题解见[字符串加法](Leetcode%20题解%20-%20数学.md#2-字符串加法)。

明天：第 11 天，线程协作与线程状态（Java 并发：线程之间的协作～线程状态）。

### 第 11 天：线程协作与线程状态

wait() 和 notify() 必须在 synchronized 中调用，读时想一想为什么。线程状态之间的转换可以对照前面几节的方法来理解。

阅读：《Java 并发》从[线程之间的协作](Java%20并发.md#五线程之间的协作)读到[线程状态](Java%20并发.md#六线程状态)。

自测：

1. wait() 和 sleep() 有什么区别？（见[wait() notify() notifyAll()](Java%20并发.md#wait-notify-notifyall)）
2. 线程有哪些状态？状态之间怎样转换？（见[线程状态](Java%20并发.md#六线程状态)）
3. 两个线程交替打印 1～100 怎样实现？（见[交替打印](Java%20并发.md#交替打印)）

<details>
<summary>参考要点</summary>

1. wait() 是 Object 的方法，sleep() 是 Thread 的静态方法；wait() 会释放锁，sleep() 不会；wait() 只能在同步方法或同步块中调用，否则抛出 IllegalMonitorStateException；不带超时的 wait() 要等 notify()、notifyAll() 唤醒（也可能虚假唤醒），sleep() 到时间自动返回，两者都可以被 interrupt() 打断。
2. NEW 是创建后还没有启动，start() 后进入 RUNNABLE，可能正在运行，也可能在等 CPU；等待进入 synchronized 时为 BLOCKED，拿到锁后回到 RUNNABLE；无参的 wait()、join() 和 park() 进入 WAITING，等其它线程唤醒（被 notify() 唤醒后要先重新竞争锁，这时为 BLOCKED），sleep() 和带超时的 wait()、join() 进入 TIMED_WAITING，时间到自动唤醒；执行完或因异常结束为 TERMINATED，等待 ReentrantLock 的线程是 WAITING 而不是 BLOCKED。
3. 用共享变量记录轮到哪个线程，没轮到的线程 wait()，轮到的线程打印后改变轮次并 notifyAll()；等待条件用 while 而不是 if，被唤醒时要重新检查是否轮到自己；也可以用两个 Semaphore 传递许可，第一个初始为 1、第二个为 0，打印后释放对方的许可。

</details>

动手：不看笔记，分别用 wait()/notify() 和 Semaphore 实现两个线程交替打印 1～100，再与[交替打印](Java%20并发.md#交替打印)一节的写法对比。

预期：两种写法都按 1、2、3……100 的顺序由两个线程交替输出，每个数只出现一次，打印完后程序正常结束。

算法（字符串，中等）：[165. 比较版本号](https://leetcode.cn/problems/compare-version-numbers/)，题解见[比较版本号](Leetcode%20题解%20-%20字符串.md#12-比较版本号)。

明天：第 12 天，J.U.C 的常用组件（Java 并发：J.U.C - AQS～J.U.C - 其它组件）。

### 第 12 天：J.U.C 的常用组件

AQS 一节先看 state 和等待队列怎样实现 ReentrantLock 的加锁、重入和排队，公平锁与非公平锁的区别和代价也在这里。之后是 J.U.C 中常用的工具类，重点是 CountDownLatch、CyclicBarrier、CompletableFuture 和 BlockingQueue 的用途，ForkJoin 可以略读。

阅读：《Java 并发》从[J.U.C - AQS](Java%20并发.md#七juc---aqs)读到[J.U.C - 其它组件](Java%20并发.md#八juc---其它组件)。

自测：

1. CountDownLatch 和 CyclicBarrier 有什么区别？（见[CyclicBarrier](Java%20并发.md#cyclicbarrier)）
2. CompletableFuture 解决了 Future 的什么问题？（见[CompletableFuture](Java%20并发.md#completablefuture)）
3. 怎样用 BlockingQueue 实现生产者消费者？（见[BlockingQueue](Java%20并发.md#blockingqueue)）

<details>
<summary>参考要点</summary>

1. CountDownLatch 让一个或多个线程等待其它线程：countDown() 使计数减 1，减到 0 时唤醒 await() 的线程，计数不能重置；CyclicBarrier 让多个线程互相等待，全部调用 await() 到达后一起继续，计数自动恢复，可以用于下一轮，还可以指定全部到达时执行的 barrierAction。
2. Future 只能用 get() 阻塞等待结果，多个任务有依赖时要自己写等待逻辑；CompletableFuture 可以注册回调，用 thenApply、thenCompose 串联，用 thenCombine 合并，用 exceptionally、handle 处理异常；带 Async 的方法不传线程池时在 ForkJoinPool.commonPool() 中执行（并行度小于 2 时每个任务新建一个线程），阻塞的 I/O 任务应传入自己的线程池。
3. 用有界的 ArrayBlockingQueue 作为共享缓冲区；生产者调用 put()，队列满时阻塞；消费者调用 take()，队列空时阻塞，不需要自己写 wait()/notify()。

</details>

动手：用 CompletableFuture 并行查询“商品信息”和“库存”两个模拟接口（各 sleep 200 毫秒），合并结果后输出，比较串行和并行的总耗时。

预期：串行约 400 ms，并行约 200 ms，两种写法合并出的结果相同。

算法（链表，简单）：[206. 反转链表](https://leetcode.cn/problems/reverse-linked-list/)，题解见[链表反转](Leetcode%20题解%20-%20链表.md#2-链表反转)。

明天：第 13 天，Java 内存模型与 volatile（Java 并发：线程不安全示例～Java 内存模型）。

### 第 13 天：Java 内存模型与 volatile

从一个线程不安全的例子开始，Java 内存模型解释了问题的来源：原子性、可见性和有序性。内存间交互操作可以略读，volatile 和先行发生原则要读懂。

阅读：《Java 并发》从[线程不安全示例](Java%20并发.md#九线程不安全示例)读到[Java 内存模型](Java%20并发.md#十java-内存模型)。

自测：

1. volatile 能保证什么？为什么 volatile 修饰的 i++ 仍然不安全？（见[volatile](Java%20并发.md#volatile)、[可见性](Java%20并发.md#2-可见性)）
2. volatile 和 synchronized 有什么区别？（见[volatile](Java%20并发.md#volatile)）
3. 什么是先行发生（happens-before）原则？（见[先行发生原则](Java%20并发.md#先行发生原则)）

<details>
<summary>参考要点</summary>

1. volatile 保证可见性（写入对之后读取的线程立即可见）和有序性（volatile 写之前的读写不会被重排序到写之后，volatile 读之后的读写不会被重排序到读之前）；单次读写是原子的，long、double 也不会被拆成两次，但不保证 i++ 这类复合操作的原子性：i++ 是读取、加 1、写回三步，两个线程可能读到同一个旧值，各自加 1 后写回，只增加了 1；读-改-写操作要用锁或原子类。
2. volatile 只修饰变量，保证可见性和有序性，不保证复合操作的原子性，线程不会阻塞；synchronized 修饰方法和代码块，同一时刻只有一个线程执行，同时保证原子性、可见性和有序性，竞争时线程阻塞；状态标志、发布数据用 volatile，单个变量的读-改-写可以用原子类，多个变量一起修改通常用锁。
3. Java 内存模型用先行发生关系定义可见性：A 先行发生于 B，A 的结果对 B 可见，不要求 A 在时间上先执行；规则有单一线程、管程锁定（unlock 先于之后对同一锁的 lock）、volatile 变量（写先于之后的读）、线程启动、线程加入、线程中断、对象终结和传递性；例如写 data 后再写 volatile 的 ready，读到 ready 的线程一定能看到 data。

</details>

动手：运行[附录 A3](Java%20并发.md#a3-volatile-与循环条件)的代码，分别不加和加上 volatile，观察循环能否结束。

预期：不加 volatile 时主线程把 stop 置为 true 3 秒后 worker 仍在循环，3 次都一样；加上 volatile 后 worker 很快结束。

算法（链表，简单）：[21. 合并两个有序链表](https://leetcode.cn/problems/merge-two-sorted-lists/)，题解见[归并两个有序的链表](Leetcode%20题解%20-%20链表.md#3-归并两个有序的链表)。

明天：第 14 天，线程安全与 CAS（Java 并发：线程安全～非阻塞同步）。

### 第 14 天：线程安全与 CAS

线程安全的实现方式有不可变、互斥同步、非阻塞同步和无同步方案四类。本节重点是 CAS：它的原理、ABA 问题，以及乐观锁和悲观锁的取舍。

阅读：《Java 并发》从[线程安全](Java%20并发.md#十一线程安全)读到[非阻塞同步](Java%20并发.md#非阻塞同步)。

自测：

1. 什么是线程安全？怎样保证线程安全？（见[线程安全](Java%20并发.md#十一线程安全)）
2. CAS 的原理是什么？ABA 问题怎么解决？（见[CAS](Java%20并发.md#1-cas)、[ABA](Java%20并发.md#3-aba)）
3. 乐观锁和悲观锁有什么区别？（见[乐观锁与悲观锁](Java%20并发.md#4-乐观锁与悲观锁)）

<details>
<summary>参考要点</summary>

1. 多个线程不管以何种方式访问一个类，调用方不需要额外同步都能表现正确；根源是多个线程读写共享的可变数据；做法：不可变对象，互斥同步（synchronized、ReentrantLock），非阻塞同步（CAS、原子类），无同步方案（栈封闭、ThreadLocal）。
2. CAS 有内存地址 V、预期值 A、新值 B 三个操作数，V 等于 A 时才更新为 B，由处理器指令（x86 上带 lock 前缀的 cmpxchg）保证原子性，失败时不阻塞线程、只返回 false，由调用方决定重试还是放弃，incrementAndGet() 等方法在内部循环重试；ABA 指值从 A 改为 B 又改回 A，CAS 误以为没变，会让无锁栈这类结构出错；用 AtomicStampedReference 给引用加版本号，每次修改加 1，持有旧版本号的 CAS 会失败。
3. 悲观锁访问前先加锁，例如 synchronized、ReentrantLock、SELECT ... FOR UPDATE；乐观锁不加锁直接操作，提交时检查是否被改过，改过就重试，例如 CAS 和数据库版本号（UPDATE ... WHERE version = 1 影响 0 行时重试）；读多写少、冲突少时用乐观锁，写多、冲突频繁时用悲观锁。

</details>

动手：运行[附录 A4](Java%20并发.md#a4-atomiclong-与-longadder)的代码，观察线程数增加时 AtomicLong 和 LongAdder 的耗时差距。

预期：1 个线程时两者都约 70 ms；8 个线程时 AtomicLong 约 3.5～5.1 秒，LongAdder 约 0.10～0.12 秒，结果都是 80000000。

算法（链表，简单）：[141. 环形链表](https://leetcode.cn/problems/linked-list-cycle/)，题解见[判断链表是否存在环](Leetcode%20题解%20-%20双指针.md#6-判断链表是否存在环)。

明天：第 15 天，ThreadLocal 与锁优化（Java 并发：无同步方案～多线程开发良好的实践）。

### 第 15 天：ThreadLocal 与锁优化

ThreadLocal 重点看它的数据结构、内存泄漏的原因，以及线程池复用线程时的数据串用。锁优化讲 JVM 怎样降低 synchronized 的开销，按轻量级锁、偏向锁、锁升级的过程读。

阅读：《Java 并发》从[无同步方案](Java%20并发.md#无同步方案)读到[多线程开发良好的实践](Java%20并发.md#十三多线程开发良好的实践)。

自测：

1. ThreadLocal 为什么可能导致内存泄漏？（见[线程本地存储（Thread Local Storage）](Java%20并发.md#2-线程本地存储thread-local-storage)）
2. synchronized 的底层是怎样实现的？（见[锁的实现](Java%20并发.md#1-锁的实现)、[轻量级锁](Java%20并发.md#轻量级锁)）
3. 说一下 synchronized 的锁升级过程。（见[锁升级的过程](Java%20并发.md#锁升级的过程)）

<details>
<summary>参考要点</summary>

1. ThreadLocalMap 的 Entry 对 key（ThreadLocal 对象）是弱引用，对 value 是强引用；ThreadLocal 没有其它强引用时 key 在 GC 后变为 null，value 仍被线程的 Map 引用；这样的陈旧条目要等这个线程之后调用 set()、remove() 或 get() 未命中时才可能被清理，不保证及时，static final 的 ThreadLocal 一直强可达，弱引用不起作用；复用线程还会让后一个请求读到前一个请求的数据；用完在 finally 中调用 remove()。
2. 同步块编译为 monitorenter 和 monitorexit，另有异常处理器保证抛出异常时也释放锁，同步方法用 ACC_SYNCHRONIZED 标志；没有竞争时是轻量级锁，用 CAS 把 Mark Word 换成指向栈中 Lock Record 的指针；有竞争时膨胀为 ObjectMonitor，_owner 指向持有锁的线程，_recursions 记录重入次数，抢不到锁的线程进入 _cxq、_EntryList 阻塞，调用 wait() 的线程进入 _WaitSet。
3. JDK 21 中依次为无锁（Mark Word 末尾 01）、轻量级锁（CAS 换成 Lock Record 指针，末尾 00）、重量级锁（其它线程持有锁时 CAS 失败，膨胀为 ObjectMonitor，末尾 10，先自适应自旋，抢不到再阻塞）；偏向锁 JDK 15 起默认禁用、之后被移除；空闲的 ObjectMonitor 会被回收，对象头恢复为无锁，所以“只能升级不能降级”不准确。

</details>

动手：运行[附录 A1](Java%20并发.md#a1-三种锁在读多写少时的耗时)的代码，比较 ReentrantLock、ReentrantReadWriteLock 和 StampedLock 在读多写少时的耗时。

预期：读多写少时独占锁（附录中为 ReentrantLock）约 370～440 ms，ReentrantReadWriteLock 约 140～170 ms，StampedLock 乐观读约 50～70 ms；持有读锁时获取写锁失败，写锁可以降级为读锁。

算法（链表，简单）：[160. 相交链表](https://leetcode.cn/problems/intersection-of-two-linked-lists/)，题解见[找出两个链表的交点](Leetcode%20题解%20-%20链表.md#1-找出两个链表的交点)。

综合题：用多个线程模拟秒杀扣减库存：分别用不加锁、synchronized、AtomicInteger 实现，比较结果是否正确，说明各自的取舍。（见[线程不安全示例](Java%20并发.md#九线程不安全示例)、[比较](Java%20并发.md#比较)、[CAS](Java%20并发.md#1-cas)）

<details>
<summary>答题思路</summary>

1. 不加锁：读库存、判断、减 1 不是原子操作，两个线程可能读到同一个值，扣减次数丢失或超卖，与 1000 个线程自增得到 997 的原因相同。
2. synchronized：判断和扣减放在同一个同步块中，结果正确；竞争时线程阻塞，吞吐受限，同时要修改库存和其它变量时通常用锁（也可以把它们放进一个不可变对象，用 AtomicReference 整体替换）。
3. AtomicInteger：用 CAS 循环，读出当前值，大于 0 才 compareAndSet 为当前值减 1，失败就重试；线程不阻塞，但冲突激烈时重试多、浪费 CPU，且只能保证一个变量的原子更新。
4. 库存在数据库中时，可以用版本号乐观锁：UPDATE ... WHERE version = ? 影响 0 行就重读重试，并限制重试次数。

</details>

明天：第 16 天，运行时数据区域（Java 虚拟机：运行时数据区域）。

## 七、Java 虚拟机

### 第 16 天：运行时数据区域

先分清哪些区域是线程私有的、哪些是共享的。堆和栈的区别、对象的创建过程都是常见问题。

阅读：《Java 虚拟机》的[运行时数据区域](Java%20虚拟机.md#一运行时数据区域)。

自测：

1. JVM 的内存区域有哪些？哪些是线程私有的？（见[运行时数据区域](Java%20虚拟机.md#一运行时数据区域)）
2. 堆和栈有什么区别？（见[堆和栈的区别](Java%20虚拟机.md#堆和栈的区别)）
3. 对象的创建过程是怎样的？（见[对象的创建与内存布局](Java%20虚拟机.md#对象的创建与内存布局)）

<details>
<summary>参考要点</summary>

1. 程序计数器、Java 虚拟机栈和本地方法栈是线程私有的，随线程创建和销毁；堆和方法区被所有线程共享，JDK 8 起方法区由本地内存中的元空间实现；另有 NIO 使用的直接内存；除程序计数器外都可能抛出 OutOfMemoryError，两种栈还可能抛出 StackOverflowError。
2. 栈中是方法调用的栈帧（局部变量、操作数、返回地址），堆中是对象和数组；每个线程有自己的栈，堆被所有线程共享，只有堆中的对象有线程安全问题；栈帧在方法返回时销毁，堆中的对象由垃圾收集器回收；栈大小由 -Xss 设置，太深抛出 StackOverflowError，堆由 -Xms、-Xmx 设置，放不下抛出 OutOfMemoryError。
3. 类加载检查，类没有加载或初始化就先完成类加载过程；分配内存：内存规整时用指针碰撞，有碎片时用空闲列表，每个线程先在 Eden 中的 TLAB 里分配以避免加锁；把实例字段初始化为零值，再设置对象头（Mark Word 和类型指针）；执行构造方法。

</details>

动手：运行[附录 A2](Java%20虚拟机.md#a2-逃逸分析)的代码，比较开启和关闭逃逸分析时的耗时与 GC 次数。

预期：默认开启逃逸分析时 2 亿个 Point 没有触发 GC，约 130 ms；加上 -XX:-DoEscapeAnalysis 后发生 13 次 GC，约 335 ms。

算法（链表，中等）：[92. 反转链表 II](https://leetcode.cn/problems/reverse-linked-list-ii/)。

明天：第 17 天，对象存活与垃圾收集算法（Java 虚拟机：垃圾收集～Stop The World）。

### 第 17 天：对象存活与垃圾收集算法

先判断哪些对象可以回收，再看怎样回收。引用类型中弱引用最常被问到，ThreadLocal 就用到了它。

阅读：《Java 虚拟机》从[垃圾收集](Java%20虚拟机.md#二垃圾收集)读到[Stop The World](Java%20虚拟机.md#stop-the-world)。

自测：

1. 怎样判断一个对象可以被回收？哪些对象可以作为 GC Roots？（见[可达性分析算法](Java%20虚拟机.md#2-可达性分析算法)）
2. 强引用、软引用、弱引用、虚引用有什么区别？（见[引用类型](Java%20虚拟机.md#引用类型)）
3. 垃圾收集为什么要 Stop The World？（见[Stop The World](Java%20虚拟机.md#stop-the-world)）

<details>
<summary>参考要点</summary>

1. 引用计数无法处理循环引用，JVM 使用可达性分析：从 GC Roots 出发搜索，不可达的对象可以被回收；GC Roots 包括虚拟机栈中的参数和局部变量、JNI 引用的对象、类静态属性和常量引用的对象、被 synchronized 持有的锁对象和还没有结束的线程。
2. 从 GC Roots 出发沿强引用可达的对象不会被回收，只是互相强引用、从 GC Roots 不可达的仍会被回收；只被软引用（SoftReference）关联的对象在即将内存溢出前一定被回收，其它时候 HotSpot 按多久没被访问决定是否清除；只被弱引用（WeakReference）关联的对象在下一次回收它所在区域的 GC 时一定被回收，例如 ThreadLocalMap 的 key；虚引用（PhantomReference）不影响对象的存活，get() 总是返回 null，配合引用队列在对象被回收时收到通知。
3. 可达性分析要遍历对象之间的引用，用户线程同时修改引用可能漏掉存活的对象；复制和整理算法还要移动对象、修改指向它的引用；用户线程运行到安全点才暂停，CMS、G1 把耗时最长的标记改为并发执行来缩短停顿。

</details>

动手：运行[附录 A5](Java%20虚拟机.md#a5-threadlocalmap-的弱引用)的代码，观察 GC 之后 Entry 的 key 和 value 分别是否被回收。

预期：GC 之后 Entry 还在，key 变为 null，value 仍被引用；之后通过其它 ThreadLocal 调用 set()，第 2 次调用后这个 Entry 才被清除。

算法（链表，中等）：[143. 重排链表](https://leetcode.cn/problems/reorder-list/)，题解见[重排链表](Leetcode%20题解%20-%20链表.md#12-重排链表)。

明天：第 18 天，垃圾收集器（Java 虚拟机：垃圾收集器）。

### 第 18 天：垃圾收集器

每种收集器关注它在哪些阶段停顿。Serial、ParNew、Parallel 了解即可，重点是 CMS 和 G1。

阅读：《Java 虚拟机》的[垃圾收集器](Java%20虚拟机.md#垃圾收集器)。

自测：

1. 有哪些垃圾收集器？各自适合什么场景？（见[垃圾收集器](Java%20虚拟机.md#垃圾收集器)）
2. CMS 和 G1 有什么区别？（见[G1 收集器](Java%20虚拟机.md#7-g1-收集器)）
3. G1 怎样控制停顿时间？（见[G1 收集器](Java%20虚拟机.md#7-g1-收集器)）

<details>
<summary>参考要点</summary>

1. Serial 单线程、简单高效，适合单核和小内存，只有 1 个处理器时 JDK 21 仍默认用它；Parallel Scavenge 加 Parallel Old 以吞吐量为目标，适合后台计算；CMS 并发收集老年代，停顿短，但有碎片和浮动垃圾，JDK 14 已移除；G1 是 JDK 9 起的默认收集器，按 Region 回收、停顿可预测，适合大内存的在线服务，ZGC 的停顿通常不超过 1 毫秒，但要给堆留出余量。
2. 回收范围：CMS 只回收老年代，要与 ParNew 配合，G1 用 Region 统一管理新生代和老年代；碎片：CMS 用标记 - 清除，碎片多时只能 Full GC，G1 把存活对象复制到空闲的 Region，普通对象不产生碎片（Humongous 对象需要连续的 Region，可能因找不到连续空间而提前 Full GC）；停顿：CMS 的停顿无法控制，G1 按停顿时间目标挑选要回收的 Region；并发标记：CMS 用增量更新，G1 用原始快照（SATB）。
3. 把堆分成大小相等的 Region，每个 Region 可以单独回收；记录每个 Region 的回收耗时和能回收的空间，维护优先列表，优先回收价值最大的 Region；每次混合回收挑选的老年代 Region 数量受 MaxGCPauseMillis（默认 200 ms）限制；靠调整新生代大小满足目标，所以不要用 -Xmn 固定新生代。

</details>

动手：按[附录 A3](Java%20虚拟机.md#a3-不同收集器的停顿)的方法，用 -Xlog:gc 分别运行 Serial、Parallel 和 G1，比较停顿时间。

预期：128 MB 堆下 Serial 停顿 39 次、共 90.4 ms、最长 9.14 ms，Parallel 75 次、共 96.8 ms、最长 5.16 ms，G1 84 次、共 40.0 ms、最长 2.01 ms 且没有 Full GC；G1 停顿次数多但每次最短。

算法（链表，中等）：[19. 删除链表的倒数第 N 个结点](https://leetcode.cn/problems/remove-nth-node-from-end-of-list/)，题解见[删除链表的倒数第 n 个节点](Leetcode%20题解%20-%20链表.md#5-删除链表的倒数第-n-个节点)。

明天：第 19 天，三色标记与内存分配（Java 虚拟机：三色标记～内存分配与回收策略）。

### 第 19 天：三色标记与内存分配

三色标记解释了并发标记为什么会漏标，以及 CMS 和 G1 各自的解决办法。内存分配一节回答对象什么时候进入老年代、什么时候触发 Full GC。

阅读：《Java 虚拟机》从[三色标记](Java%20虚拟机.md#三色标记)读到[内存分配与回收策略](Java%20虚拟机.md#三内存分配与回收策略)。

自测：

1. 三色标记中的漏标是怎样发生的？CMS 和 G1 分别怎样解决？（见[三色标记](Java%20虚拟机.md#三色标记)）
2. 对象在什么情况下进入老年代？（见[内存分配策略](Java%20虚拟机.md#内存分配策略)）
3. Full GC 在什么情况下触发？（见[Full GC 的触发条件](Java%20虚拟机.md#full-gc-的触发条件)）

<details>
<summary>参考要点</summary>

1. 并发标记时，用户线程让已经是黑色的对象引用了白色对象，同时删除了从灰色对象到它的所有引用，这个白色对象不会再被访问，标记结束后被当成垃圾回收；CMS 用增量更新，写入引用时写屏障把卡标记为脏，重新标记时重新扫描；G1 用原始快照（SATB），删除或覆盖引用前写屏障记录旧值并当作存活。
2. 经过多次 Minor GC 后年龄达到 MaxTenuringThreshold；动态年龄判定（以 Serial 为例，G1 和 Parallel 的计算方式不同）：Minor GC 结束时从小到大累加 Survivor 中各年龄对象的大小，超过 Survivor 一半时，取这个年龄和 MaxTenuringThreshold 中较小的值作为新阈值，下一次 Minor GC 时大于或等于它的对象晋升；Minor GC 时 Survivor 放不下的存活对象直接进入老年代；大对象直接进入老年代（Serial 的 PretenureSizeThreshold，G1 中超过 Region 一半的 Humongous 对象）。
3. 调用 System.gc()，规范上只是建议，HotSpot 默认会执行一次 Full GC，-XX:+DisableExplicitGC 可以禁用；老年代空间不足，例如大对象、长期存活的对象不断进入，或者空间分配担保失败，G1 中是混合回收来不及释放、复制时找不到空闲 Region，或 Humongous 对象找不到连续的 Region；JDK 7 及以前永久代不足，JDK 8 起元空间达到阈值（日志原因为 Metadata GC Threshold）时 Serial 和 Parallel 进行 Full GC，G1 先扩大元空间并启动并发标记卸载类，扩大失败才 Full GC；CMS 发生 Concurrent Mode Failure。

</details>

动手：运行[附录 A6](Java%20虚拟机.md#a6-默认的收集器与-g1-的-region-大小)的命令，查看本机默认的收集器和 G1 的 Region 大小。

预期：默认（多核）为 UseG1GC，-XX:ActiveProcessorCount=1 时为 UseSerialGC；Region 大小为 -Xmx128m 和 1g 时 1 MB，4g 时 2 MB，16g 时 8 MB，64g 时 32 MB。

算法（链表，中等）：[82. 删除排序链表中的重复元素 II](https://leetcode.cn/problems/remove-duplicates-from-sorted-list-ii/)，题解见[剑指 Offer 18.2](18.2%20删除链表中重复的结点.md)。

明天：第 20 天，类加载机制（Java 虚拟机：类加载机制）。

### 第 20 天：类加载机制

类加载过程中的准备和初始化最容易混淆，重点看静态变量在这两个阶段各被赋了什么值。双亲委派和打破它的例子是常见的追问。

阅读：《Java 虚拟机》的[类加载机制](Java%20虚拟机.md#四类加载机制)。

自测：

1. 类加载的过程是怎样的？（见[类加载过程](Java%20虚拟机.md#类加载过程)）
2. 什么是双亲委派模型？为什么需要它？（见[双亲委派模型](Java%20虚拟机.md#双亲委派模型)）
3. 怎样打破双亲委派？有哪些实际的例子？（见[打破双亲委派](Java%20虚拟机.md#4-打破双亲委派)）

<details>
<summary>参考要点</summary>

1. 加载：按全限定名取得字节流，转换为方法区的运行时结构，生成 Class 对象；验证字节流符合规范、不危害虚拟机；准备：为类变量分配内存并设为零值（基本类型或 String、用常量表达式初始化的 static final 常量不经 <clinit>() 直接取 ConstantValue 的值，《深入理解 Java 虚拟机》把这一步归在准备阶段，JVMS SE 21 写在初始化过程中）；解析：把常量池中的符号引用替换为直接引用；初始化：执行 <clinit>()，即类变量赋值和静态语句块，父类先于子类，多线程下只有一个线程执行。
2. 类加载器先把加载请求交给父加载器，父加载器无法完成时才自己加载；好处是基础类统一，例如自己写的 java.lang.Object 不会替换启动类加载器加载的那个，程序中所有的 Object 都是同一个类；父加载器已经加载过的类不会重复加载，避免同一个类出现两个互不相等的 Class 对象。
3. 重写 loadClass()，先自己加载、找不到再交给父加载器；例子：JDBC 的 DriverManager 由平台类加载器加载，通过 ServiceLoader 用线程上下文类加载器加载 classpath 上的驱动；Tomcat 每个应用的 WebappClassLoader 先在本应用中查找，不同应用可以用同一个库的不同版本；热部署用新的类加载器加载修改后的类。

</details>

动手：运行[附录 A7](Java%20虚拟机.md#a7-打破双亲委派)的代码，说出 DriverManager 是怎样加载到第三方驱动的。

预期：DriverManager 由 PlatformClassLoader 加载，线程上下文类加载器是 AppClassLoader，找到的 DemoDriver 也由 AppClassLoader 加载；两个 ChildFirstLoader 加载的 Greeter 分别输出 v1、v2，g1 == g2 为 false；定义 java.lang.Greeter 抛出 SecurityException。

算法（链表，中等）：[142. 环形链表 II](https://leetcode.cn/problems/linked-list-cycle-ii/)，题解见[剑指 Offer 23](23.%20链表中环的入口结点.md)。

明天：第 21 天，线上问题排查（Java 虚拟机：线上问题排查；Linux：线上问题排查）。

### 第 21 天：线上问题排查

把前面几天的内容用到排查中：先用 Linux 命令找到问题进程，再用 JDK 的工具找到具体的线程和对象。

阅读：《Java 虚拟机》的[线上问题排查](Java%20虚拟机.md#五线上问题排查)；《Linux》的[线上问题排查](Linux.md#十一线上问题排查)。

自测：

1. 线上出现 OOM 怎样排查？（见[内存溢出与内存泄漏](Java%20虚拟机.md#内存溢出与内存泄漏)）
2. CPU 占用过高怎样定位到具体的代码？（见[CPU 占用过高](Java%20虚拟机.md#cpu-占用过高)）
3. 做过哪些 JVM 调优？（见[JVM 调优](Java%20虚拟机.md#jvm-调优)）

<details>
<summary>参考要点</summary>

1. 先看错误信息判断是哪块内存：Java heap space、GC overhead limit exceeded、Metaspace、direct buffer memory、unable to create native thread；元空间、直接内存、线程创建失败分别检查类的生成与卸载、堆外内存的释放、线程数和容器的限制，不能靠增大堆解决；Java heap space 时，启动时加 -XX:+HeapDumpOnOutOfMemoryError 保存堆转储，或用 jcmd <pid> GC.heap_dump 导出；用 MAT 按 Retained Heap 排序，查看大对象到 GC Roots 的引用链；引用链不该存在就是内存泄漏，改代码，否则增大堆或减少一次加载的数据。
2. top 找到 CPU 占用高的 Java 进程；top -H -p <pid> 找到占用最高的线程 ID；jstack <pid> 导出线程栈，按 nid 找到这个线程（JDK 18 前 nid 是十六进制，要先用 printf "%x" 转换）；查看它正在执行的代码，常见是死循环或频繁 GC。
3. 先明确目标（在线服务看最长停顿，批处理看吞吐量），默认用 G1 并开启 GC 日志观察；-Xms 与 -Xmx 设为相同，-Xmx 要给元空间、线程栈、直接内存等堆外内存留出余量，不能等于容器的内存，按需设置 MaxGCPauseMillis、MaxMetaspaceSize、HeapDumpOnOutOfMemoryError；频繁 Full GC 时用 jstat -gcutil 看老年代使用率，降不下来查泄漏，能降下来就增大堆或调整新生代；GC 问题多数是代码造成的，只调参数解决不了。

</details>

动手：运行[附录 A8](Java%20虚拟机.md#a8-元空间溢出)的代码复现元空间溢出；再写一个死循环线程，在 Linux 或 Linux 容器中按[CPU 占用过高](Java%20虚拟机.md#cpu-占用过高)一节的步骤用 top 和 jstack 找到它（macOS 的 top 没有 -H 选项）。

预期：MetaLeak 加载约 2600 个 Plugin 类后抛出 OutOfMemoryError: Metaspace；死循环线程在 top -H 中 CPU 接近 100%，在 jstack 中按 nid 找到它，状态为 RUNNABLE，栈顶就是死循环所在的那一行。

算法（链表，中等）：[148. 排序链表](https://leetcode.cn/problems/sort-list/)，题解见[链表排序](Leetcode%20题解%20-%20链表.md#14-链表排序)。

综合题：线上服务每隔几小时发生一次 Full GC，最后因为 OOM 重启：先看哪些数据？可能有哪些原因？怎样验证？（见[内存溢出与内存泄漏](Java%20虚拟机.md#内存溢出与内存泄漏)、[Full GC 的触发条件](Java%20虚拟机.md#full-gc-的触发条件)、[JVM 调优](Java%20虚拟机.md#jvm-调优)）

<details>
<summary>答题思路</summary>

1. 先看数据：GC 日志中 Full GC 的原因和前后的堆占用，jstat -gcutil 中老年代使用率（O）和 FGC 的变化，OOM 的错误信息。
2. 每次 Full GC 后老年代占用越来越高，说明对象一直无法回收，可能是内存泄漏：静态集合只增不删、ThreadLocal 没有 remove()、连接没有关闭、HashMap 的键被修改后删不掉。
3. Full GC 后能降下来，说明堆对正常负载偏小，或者大对象、过早晋升的对象太多；日志原因为 Metadata GC Threshold 时检查是否动态生成大量的类。
4. 验证：开启 HeapDumpOnOutOfMemoryError 或用 jcmd 导出堆转储，用 MAT 按 Retained Heap 找到大对象和引用链；泄漏较慢时每隔一段时间执行 jcmd GC.class_histogram，看哪些类的实例数持续增长，它会先触发一次 Full GC，分析日志时要把这些 Full GC 区分出来。
5. 定位后修改代码；确实需要更多内存时再增大堆，修改后对比 GC 日志确认 Full GC 消失。

</details>

明天：第 22 天，事务、并发一致性与锁（数据库系统原理：事务～封锁）。

## 八、MySQL

### 第 22 天：事务、并发一致性与锁

先理解事务的四个性质和并发时会出现的问题，再看数据库怎样用锁解决。封锁协议是教材中的理论，可以略读；MySQL 中的锁一节对应实际使用。

阅读：《数据库系统原理》从[事务](数据库系统原理.md#一事务)读到[封锁](数据库系统原理.md#三封锁)。

自测：

1. ACID 分别是什么？InnoDB 怎样保证它们？（见[事务](数据库系统原理.md#一事务)）
2. 脏读、不可重复读和幻读有什么区别？（见[并发一致性问题](数据库系统原理.md#二并发一致性问题)）
3. MySQL 中有哪些锁？意向锁有什么用？（见[MySQL 中的锁](数据库系统原理.md#mysql-中的锁)、[封锁类型](数据库系统原理.md#封锁类型)）

<details>
<summary>参考要点</summary>

1. 原子性：要么全部成功，要么全部回滚，InnoDB 用 undo log 记录修改前的值来回滚；一致性：事务前后满足约束和业务规则，由另外三者和主键、唯一索引等约束共同保证，业务规则还要应用自己维护；隔离性：未提交的修改对其它事务不可见，写操作加锁，普通读用 MVCC 读快照；持久性：提交后不丢失，先写 redo log，提交时刷盘，崩溃后重放。
2. 脏读是读到了其它事务还没有提交的数据，对方回滚后读到的就是不存在的值；不可重复读是同一事务两次读同一行结果不同，因为中间有事务修改并提交了这一行；幻读是两次读同一范围时行数变了，因为中间有事务插入了新行。
3. 全局读锁（FLUSH TABLES WITH READ LOCK）；表级的表锁、元数据锁（MDL）、意向锁和自增锁；行级的记录锁、间隙锁、Next-Key Lock 和插入意向锁，加在索引上；意向锁 IS、IX 是表锁，加行锁前先加，要锁整张表时只需检查表上有没有意向锁，不必逐行检查。

</details>

动手：开两个 mysql 客户端，按[附录 A1](数据库系统原理.md#a1-并发一致性问题)的步骤复现脏读和不可重复读。

预期：脏读：B 为 READ UNCOMMITTED 时读到 A 未提交的 200，A 回滚后读到 100；不可重复读：B 为 READ COMMITTED 时第二次读到 200，REPEATABLE READ 时仍是 100。

算法（链表，中等）：[2. 两数相加](https://leetcode.cn/problems/add-two-numbers/)，同类题见[链表求和](Leetcode%20题解%20-%20链表.md#7-链表求和)。

明天：第 23 天，隔离级别与 MVCC（数据库系统原理：隔离级别～多版本并发控制）。

### 第 23 天：隔离级别与 MVCC

隔离级别规定了并发的事务能看到什么，MVCC 是 InnoDB 实现提交读和可重复读的方式，重点是 ReadView 的可见性判断。

阅读：《数据库系统原理》从[隔离级别](数据库系统原理.md#四隔离级别)读到[多版本并发控制](数据库系统原理.md#五多版本并发控制)。

自测：

1. 四种隔离级别分别解决了哪些问题？（见[隔离级别](数据库系统原理.md#四隔离级别)）
2. MVCC 的原理是什么？ReadView 怎样判断可见性？（见[版本号](数据库系统原理.md#版本号)、[Undo 日志](数据库系统原理.md#undo-日志)、[ReadView](数据库系统原理.md#readview)）
3. 快照读和当前读有什么区别？（见[快照读与当前读](数据库系统原理.md#快照读与当前读)）

<details>
<summary>参考要点</summary>

1. 未提交读三种问题都可能出现；提交读避免脏读；可重复读再避免不可重复读，InnoDB 用 MVCC 和 Next-Key Lock 在很大程度上也避免了幻读，是 MySQL 的默认级别；可串行化三种都能避免，InnoDB 在显式事务中把普通 SELECT 变成 FOR SHARE，读写互相阻塞，并发度最低。
2. 每行有隐藏列 DB_TRX_ID（最后修改它的事务 ID）和 DB_ROLL_PTR，旧版本通过回滚指针串在 undo log 中，读不加锁；ReadView 记录创建时未提交的事务列表、其中的最小 ID 和下一个要分配的 ID：版本的 TRX_ID 是自己或小于最小 ID 时可见，大于等于下一个 ID 时不可见，在两者之间则不在列表中才可见；不可见就沿回滚指针找上一个版本；提交读每次快照读都创建新的 ReadView，可重复读整个事务复用第一次快照读时创建的那个。
3. 快照读是普通 SELECT，读 MVCC 快照，不加锁；当前读是 INSERT、UPDATE、DELETE 和 SELECT ... FOR SHARE / FOR UPDATE，读最新版本并加锁；可重复读下同一事务混用时，快照读看不到快照建立后其它事务提交的新行，当前读却能看到并修改它们，修改后本事务的快照读也能看到这些行。

</details>

动手：按[附录 A4](数据库系统原理.md#a4-快照读与当前读混用)的步骤，观察同一个事务中快照读和当前读看到的数据为什么不同。

预期：A 第二次快照读仍然只看到 id 1、2，UPDATE 是当前读，Rows matched 为 3，改了 B 新插入的第 3 行，之后 A 的快照读看到 1、2、3；A 一开始用 FOR UPDATE 读时，B 的插入被阻塞到超时（ERROR 1205）。

算法（设计，中等）：[146. LRU 缓存](https://leetcode.cn/problems/lru-cache/)，题解见[LRU](缓存.md#七lru)。

明天：第 24 天，Next-Key Lock 与死锁（数据库系统原理：Next-Key Locks；计算机操作系统 - 死锁：MySQL 死锁）。

### 第 24 天：Next-Key Lock 与死锁

Next-Key Lock 是 InnoDB 在可重复读下防止幻读的方法，加锁范围要结合例子推一遍。间隙锁也是 MySQL 死锁的常见原因。

阅读：《数据库系统原理》的[Next-Key Locks](数据库系统原理.md#六next-key-locks)；《计算机操作系统 - 死锁》的[MySQL 死锁](计算机操作系统%20-%20死锁.md#2-mysql-死锁)。选读：[关系数据库设计理论](数据库系统原理.md#七关系数据库设计理论)、[ER 图](数据库系统原理.md#八er-图)。

自测：

1. InnoDB 在可重复读级别下怎样避免幻读？（见[Next-Key Locks](数据库系统原理.md#六next-key-locks)）
2. 间隙锁锁住的是什么范围？（见[Gap Locks](数据库系统原理.md#gap-locks)）
3. 遇到过 MySQL 死锁吗？怎样排查？（见[MySQL 死锁](计算机操作系统%20-%20死锁.md#2-mysql-死锁)）

<details>
<summary>参考要点</summary>

1. 快照读靠 MVCC：可重复读复用同一个 ReadView，看不到其它事务新插入的行；当前读靠 Next-Key Lock：锁住扫描到的记录和记录之间的间隙，其它事务无法在范围内插入；同一事务中快照读和当前读混用时仍会出现幻读。
2. 间隙锁锁住索引记录之间的开区间，不包含记录本身，只阻止插入，间隙锁之间互不冲突；Next-Key Lock 是记录锁加前面的间隙，为前开后闭区间，例如 c 有 10、11、13、20 时为 (10, 11]、(11, 13] 等；c 为普通索引时 c = 11 FOR UPDATE 锁住 (10, 11] 和 (11, 13)，唯一索引并且记录存在时只锁这一条记录。
3. 常见原因：两个事务按相反的顺序更新同一组行，或者“先查有没有，没有再插入”时拿到了同一个间隙锁，插入意向锁与对方的间隙锁冲突；InnoDB 检测到死锁后回滚其中一个事务，应用要重试；排查：看 SHOW ENGINE INNODB STATUS 的 LATEST DETECTED DEADLOCK，打开 innodb_print_all_deadlocks 记录每次死锁，锁等待时查 performance_schema.data_locks 和 data_lock_waits；避免：按相同顺序访问行、缩短事务、给条件列建索引、靠唯一索引判重。

</details>

动手：按[附录 A5](数据库系统原理.md#a5-next-key-locks-的加锁范围)的步骤，用 performance_schema.data_locks 查看一条范围查询加了哪些锁。

预期：c = 11 FOR UPDATE 时 idx_c 上有 11 的 Next-Key Lock（X）、13 前的间隙锁（X,GAP）和主键 2 的记录锁，只有插入 c = 12 被阻塞；BETWEEN 10 AND 20 时锁到 supremum，插入 9、12、14、21 都被阻塞；改为唯一索引后 c = 11 只锁一条记录（查询不存在的值时仍加间隙锁）。

算法（栈和队列，简单）：[20. 有效的括号](https://leetcode.cn/problems/valid-parentheses/)，题解见[用栈实现括号匹配](Leetcode%20题解%20-%20栈和队列.md#4-用栈实现括号匹配)。

明天：第 25 天，B+ 树与索引的类型（MySQL：B+ Tree 原理～索引的优点）。

### 第 25 天：B+ 树与索引的类型

先看 B+ 树为什么适合放在磁盘上，再看 InnoDB 的聚簇索引和二级索引。回表是理解后面覆盖索引的前提。

阅读：《MySQL》从[B+ Tree 原理](MySQL.md#b-tree-原理)读到[索引的优点](MySQL.md#索引的优点)。

自测：

1. MySQL 为什么用 B+ 树做索引，而不用 B 树、红黑树或哈希表？（见[与红黑树的比较](MySQL.md#3-与红黑树的比较)、[与 B Tree 的比较](MySQL.md#4-与-b-tree-的比较)、[哈希索引](MySQL.md#2-哈希索引)）
2. 聚簇索引和二级索引有什么区别？什么是回表？（见[B+Tree 索引](MySQL.md#1-btree-索引)）
3. 主键索引、唯一索引和普通索引有什么区别？（见[主键索引、唯一索引与普通索引](MySQL.md#5-主键索引唯一索引与普通索引)）

<details>
<summary>参考要点</summary>

1. 数据在磁盘上，要让读磁盘的次数最少；红黑树是二叉树，200 万行约 21 层，B+ 树的一个节点是 16 KB 的页，有几百上千个子节点，200 万行只有 3 层；B 树每个节点都存数据，B+ 树只有叶子存数据，内部节点能放下更多 key，叶子用指针相连，便于范围查询，每次查找都走到叶子，I/O 次数稳定；哈希索引只支持等值查找，不能用于排序和范围查询。
2. InnoDB 的聚簇索引就是主键索引（没有主键时用第一个非空唯一索引，再没有就用隐藏的行 ID），叶子节点保存整行数据，一张表只有一个；二级索引的叶子节点保存索引列和主键值；通过二级索引查其它列时，先查到主键，再到聚簇索引中查出整行，称为回表；查询的列都在二级索引中时不需要回表（覆盖索引）。
3. 主键索引一张表只有一个，列不能为 NULL，在 InnoDB 中就是聚簇索引；唯一索引的值不能重复，但可以有多个 NULL，普通索引没有唯一约束，两者在 InnoDB 中通常是二级索引；查询速度差别很小，唯一索引等值查询找到一条就停止，普通索引要多读一条；写入时普通索引可以用 change buffer，唯一索引要先读出页检查是否重复。

</details>

动手：按[附录 A1](MySQL.md#a1-主键索引的高度)的方法，查出一张 200 万行的表主键索引的高度。

预期：根页 PAGE_LEVEL 为 2，主键索引共 3 层；根页有 27 条记录，指向 27 个中间页，叶子页约 2.4 万个，每页约 80 行。

算法（栈和队列，简单）：[232. 用栈实现队列](https://leetcode.cn/problems/implement-queue-using-stacks/)，题解见[用栈实现队列](Leetcode%20题解%20-%20栈和队列.md#1-用栈实现队列)。

明天：第 26 天，索引的使用（MySQL：索引的使用条件～索引失效）。

### 第 26 天：索引的使用

这几节是建索引和排查慢查询的依据：什么时候建索引、联合索引怎样安排列的顺序、哪些写法会让索引失效。

阅读：《MySQL》从[索引的使用条件](MySQL.md#索引的使用条件)读到[索引失效](MySQL.md#索引失效)。

自测：

1. 什么是最左前缀原则？联合索引 (a, b, c) 只用到 a 和 c 时能走索引吗？（见[多列索引](MySQL.md#2-多列索引)）
2. 哪些情况下索引会失效？（见[索引失效](MySQL.md#索引失效)）
3. 建索引有哪些原则？（见[索引的使用条件](MySQL.md#索引的使用条件)）

<details>
<summary>参考要点</summary>

1. 联合索引先按第一列排序，第一列相同再按第二列，所以条件要从最左列开始连续使用才能用索引定位，与 WHERE 中的书写顺序无关；(a, b, c) 只用到 a 和 c 时能走索引，但只用 a 定位，c 在定位到的范围内逐条判断，借助索引下推可以在索引上过滤，减少回表。
2. 没有从联合索引的最左列开始，或者依赖联合索引中范围条件之后的列缩小扫描范围（范围条件带等号时例外）；对索引列使用函数（例如 DATE(create_time)），或者发生隐式类型转换（例如字符串列与数字比较）；LIKE 以 % 开头，OR 的一侧没有索引；匹配的行太多，优化器估算全表扫描更快，常见于 !=、NOT IN 和大范围的条件；这些是普通索引上的常见情况，只查索引中的列时可能改为扫描整个索引，缺少最左列时 8.0.13 起可能用跳跃扫描，对表达式建函数索引后函数条件也能走索引。
3. 给经常出现在 WHERE、JOIN、ORDER BY、GROUP BY 中并且区分度高的列建索引，状态这类区分度低的列单独建索引作用不大，但总是查询占比很少的值时索引仍然有效；多个条件常一起出现时建联合索引，等值列在前、排序列其次、范围列最后；尽量让高频查询用上覆盖索引；索引不是越多越好，有 (a, b) 时 (a) 是冗余的，主键用较短的自增整数。

</details>

动手：按[附录 A6](MySQL.md#a6-联合索引的扫描范围)的表结构，自己写几条会让联合索引失效的查询，用 EXPLAIN 验证。

预期：写出的失效查询 EXPLAIN 中 type 为 ALL 或 key_len 变短，改写后 type 变为 ref 或 range；key_len 与用到的列对应：只用 user_id 为 4，加上 status 为 5，三列都用上为 10。

算法（栈和队列，简单）：[155. 最小栈](https://leetcode.cn/problems/min-stack/)，题解见[最小值栈](Leetcode%20题解%20-%20栈和队列.md#3-最小值栈)。

明天：第 27 天，查询性能优化（MySQL：查询性能优化）。

### 第 27 天：查询性能优化

按执行过程、Explain、慢查询排查的顺序读。慢查询的定位与优化一节给出了从找出慢 SQL 到验证效果的完整步骤。

阅读：《MySQL》的[查询性能优化](MySQL.md#二查询性能优化)。

自测：

1. 线上出现慢 SQL，怎样排查和优化？（见[慢查询的定位与优化](MySQL.md#慢查询的定位与优化)）
2. EXPLAIN 主要看哪些字段？Using filesort 和 Using temporary 表示什么？（见[使用 Explain 进行分析](MySQL.md#使用-explain-进行分析)）
3. 深分页为什么慢？怎样优化？（见[深分页](MySQL.md#深分页)）

<details>
<summary>参考要点</summary>

1. 找出：开启慢查询日志，long_query_time 线上调到 1 秒或更低，对比 Rows_examined 和 Rows_sent，用 mysqldumpslow 或 sys.statement_analysis 按语句归类；分析：用 EXPLAIN 和 EXPLAIN ANALYZE 看执行计划，常见原因有索引失效、回表太多、filesort 和临时表、连接列没有索引、等锁（Lock_time 大）、统计信息不准；修改：建合适的索引或改写语句，再对比执行计划和耗时，例如加覆盖索引后从 237 ms 降到 20 ms。
2. type（const、eq_ref、ref、range、index、ALL，从好到差）、key 和 possible_keys、key_len（用到了联合索引的前几列）、rows（估算扫描行数）、Extra；Using filesort 表示无法利用索引的顺序，需要额外排序；Using temporary 表示用了临时表，常见于 GROUP BY 的列无法利用索引的顺序，或者 GROUP BY 和 ORDER BY 的列不一致。
3. LIMIT 1000000, 10 要先找出前 1000010 行再丢弃前 100 万行，走二级索引要回表上百万次，优化器改为全表扫描加排序，200 万行约 1.5 秒；延迟关联先在覆盖索引上查出这一页的主键，只回表 10 次，约 81 ms；游标分页记住上一页最后一行的排序值和主键，从它之后取 10 行，约 0.2 ms，但不能跳页；也可以限制翻页深度。

</details>

动手：在一张 100 万行以上的表上（可以用脚本批量插入），按[附录 A5](MySQL.md#a5-深分页的耗时)的方法比较 LIMIT 1000000, 10、延迟关联和游标分页三种写法的耗时。

预期：200 万行的表上 LIMIT 1000000, 10 约 1.5 秒（全表扫描加排序），延迟关联约 80 ms，游标分页不到 1 ms，三种写法返回的 10 行相同。

算法（栈和队列，中等）：[394. 字符串解码](https://leetcode.cn/problems/decode-string/)，题解见[字符串解码](Leetcode%20题解%20-%20栈和队列.md#7-字符串解码)。

明天：第 28 天，存储引擎、切分与复制（MySQL：存储引擎～MySQL 复制）。

### 第 28 天：存储引擎、切分与复制

存储引擎重点比较 InnoDB 和 MyISAM，数据类型可以略读。分库分表要清楚它解决什么问题、又带来什么问题；复制是读写分离的基础。

阅读：《MySQL》从[存储引擎](MySQL.md#三存储引擎)读到[MySQL 复制](MySQL.md#六复制)。

自测：

1. InnoDB 和 MyISAM 有什么区别？（见[InnoDB 与 MyISAM 的比较](MySQL.md#比较)）
2. 分库分表之后会遇到哪些问题？（见[Sharding 存在的问题](MySQL.md#sharding-存在的问题)）
3. 主从复制的过程是怎样的？读写分离有什么问题？（见[MySQL 复制](MySQL.md#六复制)）

<details>
<summary>参考要点</summary>

1. InnoDB 支持事务和外键，MyISAM 不支持；MyISAM 只有表锁，InnoDB 还支持行锁；InnoDB 支持在线热备份，MyISAM 崩溃后更容易损坏，恢复也更慢；InnoDB 的主键索引是聚簇索引，MyISAM 的索引都是非聚簇索引，叶子节点保存行的地址。
2. 跨分片的事务要用分布式事务，跨分片的连接要拆成单表查询在应用中连接；不能再用自增主键，改用雪花算法等分布式 ID；不带分片键的查询要查所有分片，可以用基因法、映射表或按另一个维度再存一份，跨分片的深分页改用游标分页；增加分片要迁移数据，常用双写迁移。
3. 主库把修改写入 binlog，由 binlog dump 线程发给从库；从库的 I/O 线程写入中继日志，SQL 线程读取并重放，8.0.27 起默认 4 个工作线程并行重放；读写分离的问题是默认异步复制带来的复制延迟，刚写完就读从库可能读到旧数据；写后的读和实时性要求高的读走主库，或者写入后记下 GTID，读从库前用 WAIT_FOR_EXECUTED_GTID_SET 等从库执行完，再在新开始的事务或快照中读取，超时就改读主库；监控延迟，延迟过大的从库暂停分配读请求；半同步复制只保证从库收到了 binlog，不保证已经执行，解决不了读到旧数据。

</details>

算法（栈和队列，中等）：[739. 每日温度](https://leetcode.cn/problems/daily-temperatures/)，题解见[数组中元素与下一个比它大的元素之间的距离](Leetcode%20题解%20-%20栈和队列.md#5-数组中元素与下一个比它大的元素之间的距离)。

明天：第 29 天，日志（MySQL：MySQL 的日志）。

### 第 29 天：日志

redo log、undo log 和 binlog 分别用于崩溃恢复、回滚和复制。最后一节用一条 UPDATE 把三种日志串起来。

阅读：《MySQL》的[MySQL 的日志](MySQL.md#七日志)。

自测：

1. redo log、undo log 和 binlog 有什么区别？（见[MySQL 的日志](MySQL.md#七日志)）
2. 为什么需要两阶段提交？（见[两阶段提交](MySQL.md#两阶段提交)）
3. 一条 UPDATE 语句执行时，三种日志是怎样写的？（见[更新语句的执行过程](MySQL.md#更新语句的执行过程)）

<details>
<summary>参考要点</summary>

1. undo log 由 InnoDB 写，记录修改前的旧版本，用于回滚和 MVCC；redo log 由 InnoDB 写，记录对数据页的修改，空间固定、循环写，用于崩溃恢复；binlog 由 Server 层写，记录行的修改或 SQL 语句，追加写，用于主从复制和恢复到指定时间点。
2. 事务要同时写 redo log 和 binlog，只写成功一个就崩溃会让主从不一致，例如 redo log 写了而 binlog 没写，主库保留修改，从库却收不到；两阶段提交：先写 redo log 并刷盘进入 prepare 状态，再写 binlog 并刷盘（带 Xid），最后在 redo log 中标记提交；崩溃恢复时 prepare 状态的事务在 binlog 中找到 Xid 就提交，否则回滚。
3. 以 UPDATE orders SET status = 3 WHERE id = 1024 为例：按主键找到这一行，页不在缓冲池就先读入，并加 X 锁；旧值写入 undo log，修改缓冲池中的数据页并生成 redo log 放入 redo log buffer，执行器把修改写入 binlog cache；提交时按两阶段提交把 redo log 和 binlog 刷盘，释放锁并返回；脏页之后由后台线程写回磁盘。

</details>

动手：执行 SHOW VARIABLES LIKE 'innodb_flush_log_at_trx_commit' 和 SHOW VARIABLES LIKE 'sync_binlog'，结合[redo log](MySQL.md#redo-log)和[两阶段提交](MySQL.md#两阶段提交)两节说明两个参数都为 1 时每次提交会把哪些日志刷到磁盘，改成 0 或 2 有什么风险。

预期：两个参数默认都是 1，每次提交时 redo log 和 binlog 都刷盘；innodb_flush_log_at_trx_commit 为 2 时操作系统崩溃或断电可能丢失约 1 秒的事务，为 0 时 MySQL 进程崩溃也会丢失；sync_binlog 为 0 或大于 1 时 binlog 不保证每次提交都刷盘，操作系统崩溃或断电时可能丢失已提交事务的 binlog，从库和按时间点恢复都缺少这些事务。

算法（二分查找，简单）：[704. 二分查找](https://leetcode.cn/problems/binary-search/)，题解见[正常实现](Leetcode%20题解%20-%20二分查找.md#正常实现)。

综合题：订单表有 2000 万行，按用户查询最近的订单很慢：怎样分析原因？建什么索引？数据继续增长怎么办？（见[慢查询的定位与优化](MySQL.md#慢查询的定位与优化)、[索引优化](MySQL.md#索引优化)、[切分](MySQL.md#五切分)）

<details>
<summary>答题思路</summary>

1. 先找原因：从慢查询日志中找到这条语句，对比 Rows_examined 和 Rows_sent，用 EXPLAIN 和 EXPLAIN ANALYZE 查看是否走了索引、是否有 Using filesort 和大量回表。
2. 建联合索引 (user_id, create_time)：等值条件的 user_id 在前，排序的 create_time 在后，WHERE user_id = ? ORDER BY create_time DESC LIMIT 10 直接倒序扫描索引，不需要 filesort，只读 10 行。
3. 只查需要的列，必要时把这些列加入索引成为覆盖索引；翻页用游标分页，不用大偏移量的 LIMIT。
4. 单表行数本身不是瓶颈（3 层 B+ 树约能放 6000 万行，每行约 1 KB 时约 1100 万行），只是读压力大时先用读写分离和缓存。
5. 写入量或数据量超出单机能力时按 user_id 分库分表，按用户查询只访问一个分片，同时处理分布式 ID、不带分片键的查询（基因法、映射表）和数据迁移。

</details>

明天：第 30 天，Redis 的数据类型（Redis：Redis 概述～Redis 的数据类型）。

## 九、Redis 与缓存

### 第 30 天：Redis 的数据类型

先看 Redis 和 MySQL 的分工，再看五种基本类型和 BITMAP、HyperLogLog。每种类型想一个自己用得上的场景。

阅读：《Redis》从[Redis 概述](Redis.md#一概述)读到[Redis 的数据类型](Redis.md#二数据类型)。

自测：

1. Redis 有哪些数据类型？分别用在什么场景？（见[Redis 的数据类型](Redis.md#二数据类型)）
2. Redis 和 MySQL 有什么区别？（见[与 MySQL 的区别](Redis.md#与-mysql-的区别)）
3. 一亿用户每天的签到状态怎样存储？（见[BITMAP](Redis.md#bitmap)）

<details>
<summary>参考要点</summary>

1. STRING 缓存对象、计数器、分布式锁，LIST 按插入顺序两端读写，例如最新 N 条消息、简单的消息队列；SET 去重和求交集、并集，例如标签、共同好友，HASH 保存对象的多个字段，例如用户信息、购物车；ZSET 按分值排序和范围查找，例如排行榜、按时间排序的 Feed；BITMAP、HyperLogLog 用于签到和 UV 统计，GEO 用于附近的门店，Stream 用于带消费者组的消息。
2. 数据位置：Redis 全部在内存中，容量受内存限制，MySQL 在磁盘上，缓冲池只缓存热点页；查询：Redis 只能按键访问数据结构，MySQL 用 SQL 按任意条件查询、联表和聚合；事务和持久性：MySQL 满足 ACID，提交后不丢数据，Redis 事务中的命令出错不回滚，开启 AOF everysec 也可能丢失最近 1 秒的写入；通常 MySQL 存业务数据，Redis 作缓存。
3. 用位图：每天一个键 active:{日期}，offset 为用户的连续序号，签到时 SETBIT 为 1，1 亿用户每天 12.5 MB、一年约 4.6 GB；BITCOUNT 统计当天的人数，BITOP 求多天的交集和并集；也可以每人每月一个键 sign:{用户 ID}:{年月}，便于查一个人的签到，但大量小键的开销大，每人每年一个键时 1 亿用户约 15 GB；用户 ID 稀疏时先转换为连续的序号。

</details>

动手：按[附录 A7](Redis.md#a7-bitmap-的签到和日活)的命令记录一个用户一个月的签到，用 BITCOUNT 统计签到天数。

预期：BITCOUNT 返回这个月签到的天数（笔记例子中 1～28 号签到了 23 天）；TYPE 为 string，一个月的键 STRLEN 只有 4 字节。

算法（二分查找，中等）：[33. 搜索旋转排序数组](https://leetcode.cn/problems/search-in-rotated-sorted-array/)。

明天：第 31 天，使用场景与底层结构（Redis：Redis 的使用场景～Redis 的数据结构）。

### 第 31 天：使用场景与底层结构

使用场景把上一天的数据类型落到具体业务中。底层结构重点看编码的转换和跳跃表。

阅读：《Redis》从[Redis 的使用场景](Redis.md#三使用场景)读到[Redis 的数据结构](Redis.md#四数据结构)。选读：[进阶：Redis 的数据结构](Redis%20-%20进阶.md#四数据结构)。

自测：

1. 怎样用 Redis 实现排行榜？（见[排行榜](Redis.md#排行榜)）
2. ZSET 的底层为什么用跳表？（见[跳跃表](Redis.md#跳跃表)）
3. Redis 的字典是怎样扩容的？（见[进阶：字典](Redis%20-%20进阶.md#字典)）

<details>
<summary>参考要点</summary>

1. 用 ZSET，成员是用户或文章 ID，分值是分数或点赞数；ZINCRBY 加分，ZREVRANGE key 0 9 WITHSCORES 取前 10 名，ZREVRANK 查名次（从 0 开始），都是 O(logN)；分值相同时按成员名的字典序排，要先达到的排前面可以把时间编进分值；前 10 名是热点键时，可以在本地缓存中保存 1 秒。
2. 跳表在有序链表上加多层索引，每个节点以 1/4 的概率升一层，查找、插入、删除的期望复杂度都是 O(logN)；与平衡树相比，插入删除只改前驱指针，不需要旋转，范围查询找到起点后沿底层链表遍历，实现也更简单；数据在内存中，不需要 B+ 树那样减少磁盘 I/O；每个指针记录跨度，ZRANK 也是 O(logN)。
3. 字典是拉链法的哈希表，桶数为 2 的幂；键数达到桶数时扩容（有子进程执行 BGSAVE 或 AOF 重写时要达到 4 倍），新表大小为不小于键数加 1 的 2 的幂；采用渐进式 rehash：同时保留新旧两张表，之后每次增删改查顺便迁移一个桶，serverCron 也定期迁移，期间新键只写入新表，查找和删除时两张表都可能要查，迁移完后新表替换旧表。

</details>

动手：用 redis-cli 实现[排行榜](Redis.md#排行榜)一节中的例子：ZADD 写入几个用户的分数，用 ZREVRANGE 取前 3 名，用 ZREVRANK 查某个用户的名次。

预期：ZREVRANGE key 0 2 WITHSCORES 按分值从高到低返回前 3 名及分数；ZREVRANK 返回某个用户的名次，分数最高的为 0。

算法（二分查找，中等）：[34. 在排序数组中查找元素的第一个和最后一个位置](https://leetcode.cn/problems/find-first-and-last-position-of-element-in-sorted-array/)，题解见[查找区间](Leetcode%20题解%20-%20二分查找.md#6-查找区间)。

明天：第 32 天，过期、淘汰、持久化与事务（Redis：Redis 与 Memcached～Redis 事务）。

### 第 32 天：过期、淘汰、持久化与事务

与 Memcached 的比较可以略读。过期删除和内存淘汰是两件事：前者清理过期的键，后者在内存不够时腾出空间。持久化重点比较 RDB 和 AOF。

阅读：《Redis》从[Redis 与 Memcached](Redis.md#五redis-与-memcached)读到[Redis 事务](Redis.md#九事务)。

自测：

1. 过期的键怎样删除？内存满了有哪些淘汰策略？（见[键的过期时间](Redis.md#六键的过期时间)、[数据淘汰策略](Redis.md#七数据淘汰策略)）
2. RDB 和 AOF 有什么区别？（见[Redis 持久化](Redis.md#八持久化)）
3. Lua 脚本为什么能保证原子性？（见[Lua 脚本](Redis.md#lua-脚本)）

<details>
<summary>参考要点</summary>

1. 惰性删除：访问键时检查，过期就删除并当作不存在；定期删除：每秒 10 次，每次抽 20 个设置了过期时间的键，过期的超过 10% 就继续下一批，每次最多占 25% 的 CPU；内存达到 maxmemory 后按淘汰策略处理，有 volatile 和 allkeys 两个范围的 lru、lfu、random，以及 volatile-ttl 和默认的 noeviction（SET 这类可能增加内存的命令返回 OOM 错误，GET、DEL 照常执行），Redis 4.0 到 7.x 共 8 种，8.6 又增加了按最近修改时间淘汰的 allkeys-lrm、volatile-lrm；只作缓存时常用 allkeys-lru。
2. RDB 由 fork 出的子进程把某一时刻的全部数据写入紧凑的二进制文件，适合备份、恢复快，但会丢失最后一次快照之后的数据，可能有几分钟；AOF 把写命令追加到文件，everysec 时约丢 1 秒，文件更大，需要定期重写；Redis 7.0 起 AOF 的基础文件默认用 RDB 格式（混合持久化）；数据重要时两种都开启，重启时用 AOF 恢复。
3. Redis 用一个线程执行命令，执行脚本期间不处理其它客户端的命令，整个脚本就像一条命令，可以根据前一条命令的结果决定后续操作，例如先 GET 再判断是否 INCR；这里的原子性是不被打断，不是出错回滚，中途出错时已执行的写命令不会回滚。

</details>

动手：开启 AOF 后对同一个键执行 100 次 INCR，查看 appendonlydir 目录中的文件；执行 BGREWRITEAOF 后再查看一次，对照[AOF 持久化](Redis.md#aof-持久化)一节说明基础文件和增量文件的变化。

预期：appendonlydir 中有基础文件（.base.rdb）、增量文件（.incr.aof）和清单文件（.manifest），100 次 INCR 都追加在增量文件中；BGREWRITEAOF 后生成编号加 1 的新基础文件，只保存键的当前值，同时换成新的增量文件，清单文件随之更新，旧的基础文件和增量文件被删除。

算法（二分查找，中等）：[153. 寻找旋转排序数组中的最小值](https://leetcode.cn/problems/find-minimum-in-rotated-sorted-array/)，题解见[旋转数组的最小数字](Leetcode%20题解%20-%20二分查找.md#5-旋转数组的最小数字)。

明天：第 33 天，线程模型、复制与集群（Redis：Redis 的事件～Redis 分片）。

### 第 33 天：线程模型、复制与集群

单线程为什么快是 Redis 的高频题。复制、Sentinel、Cluster 依次解决数据备份、故障转移和容量扩展的问题。

阅读：《Redis》从[Redis 的事件](Redis.md#十事件)读到[Redis 分片](Redis.md#十三分片)。选读：[进阶：Redis 的事件](Redis%20-%20进阶.md#十事件)、[一个简单的论坛系统分析](Redis.md#十四一个简单的论坛系统分析)。

自测：

1. Redis 是单线程的吗？为什么单线程也这么快？（见[单线程为什么快](Redis.md#单线程为什么快)）
2. 哨兵怎样发现主节点下线并选出新的主节点？（见[Sentinel](Redis.md#十二sentinel)）
3. Redis Cluster 怎样分配数据？扩容时怎样迁移？（见[Redis Cluster](Redis.md#redis-cluster)）

<details>
<summary>参考要点</summary>

1. 执行命令是单线程的，6.0 起可以开启 I/O 多线程处理网络读写，关闭文件、AOF 刷盘、UNLINK 释放大键由后台线程完成；快的原因：数据在内存中，单线程不用加锁、没有线程切换，I/O 多路复用让一个线程处理大量连接，小数据用紧凑的编码；瓶颈通常在网络，50 个连接逐条 GET 约 16 万次/秒，流水线约 160 万次/秒。
2. 主观下线：某个哨兵在 down-after-milliseconds 内没有收到主节点的有效回复；客观下线：认为它下线的哨兵数达到 quorum，再由哨兵投票选出领头哨兵负责故障转移；选新主：排除断线太久的从节点，依次比较优先级（replica-priority 越小越优先）、复制偏移量（越大数据越新）和运行 ID；对选中的从节点执行 REPLICAOF NO ONE，其它从节点改为复制它，旧主节点恢复后成为从节点。
3. 键空间分为 16384 个哈希槽，CRC16(key) % 16384 计算键所属的槽，每个主节点负责一部分槽；访问了不负责这个槽的节点会收到 MOVED 重定向，客户端缓存槽映射；多键命令要求键在同一个槽，可以用 {} 哈希标签；扩容时按键迁移槽：源节点标记 MIGRATING、目标节点标记 IMPORTING，用 MIGRATE 分批搬键，已迁走的键返回 ASK，客户端先发 ASKING 再访问目标节点，全部迁完后用 CLUSTER SETSLOT 把槽分给新节点。

</details>

动手：按[附录 A4](Redis.md#a4-redis-cluster)的步骤在本机搭建 3 主 3 从的集群，用 CLUSTER KEYSLOT 查看几个键落在哪个槽。

预期：槽分配为 7001：0～5460，7002：5461～10922，7003：10923～16383；user:1001、{user:1001}:cart、{user:1001}:orders 都在槽 5712，向 7001 写 user:1001 会收到 MOVED 5712 127.0.0.1:7002。

算法（排序与堆，中等）：[215. 数组中的第 K 个最大元素](https://leetcode.cn/problems/kth-largest-element-in-an-array/)，题解见[Kth Element](Leetcode%20题解%20-%20排序.md#1-kth-element)。

明天：第 34 天，缓存的位置与三种问题（缓存：缓存特征～缓存雪崩）。

### 第 34 天：缓存的位置与三种问题

前几章介绍缓存的特征和位置，多级缓存一节重点读。穿透、击穿、雪崩都是请求越过缓存打到数据库，区别在于原因。

阅读：《缓存》从[缓存特征](缓存.md#一缓存特征)读到[缓存雪崩](缓存.md#缓存雪崩)。

自测：

1. 缓存穿透、击穿和雪崩有什么区别？分别怎样解决？（见[缓存问题](缓存.md#四缓存问题)）
2. 本地缓存和 Redis 怎样配合使用？（见[多级缓存](缓存.md#多级缓存)）
3. 布隆过滤器的原理是什么？为什么会误判？（见[缓存穿透](缓存.md#缓存穿透)）

<details>
<summary>参考要点</summary>

1. 穿透：查询缓存和数据库都不存在的数据，用参数校验、布隆过滤器拦截，空值缓存兜底；击穿：单个热点键过期，用互斥锁只让一个请求查库，或逻辑过期返回旧值、后台重建；雪崩：大量键同时过期或缓存宕机，用随机过期时间、主从加哨兵或集群、本地缓存、限流熔断。
2. 先查本地缓存（Caffeine），未命中查 Redis，再未命中查数据库并逐级回填；本地读取约 21 纳秒、Redis 约 68 微秒，热点放本地还能分散单个 Redis 节点的压力；更新后删 Redis，并广播消息删除各实例的本地缓存，本地再设约 30 秒过期兜底；只放读多写少、能接受短暂不一致的数据。
3. 用 k 个哈希函数把 Key 映射到位数组的 k 个位置并置 1，查询时有一位为 0 就一定不存在，全为 1 则可能存在；误判是因为这些位可能都被其它 Key 置为 1；每个 Key 占 10 位、k = 7 时误判率约 0.82%，插入数超过预期后迅速上升，且不能删除元素。

</details>

动手：阅读[附录 A5](缓存.md#a5-缓存击穿的三种做法)，比较三种做法查询数据库的次数和请求的耗时。

预期：不加保护时查询数据库 68～100 次、耗时中位数 158～408 ms，互斥锁只查 1 次、中位数约 88～102 ms，逻辑过期也只查 1 次、中位数约 12～14 ms，但 100 个请求返回的都是旧值。

算法（排序与堆，中等）：[347. 前 K 个高频元素](https://leetcode.cn/problems/top-k-frequent-elements/)，题解见[出现频率最多的 k 个元素](Leetcode%20题解%20-%20排序.md#1-出现频率最多的-k-个元素)。

明天：第 35 天，缓存一致性与一致性哈希（缓存：缓存一致性～LRU）。

### 第 35 天：缓存一致性与一致性哈希

缓存一致性要讲清为什么先更新数据库再删缓存，以及仍然存在的不一致窗口。一致性哈希解决节点增减时大量缓存失效的问题；最后手写一个 LRU。

阅读：《缓存》从[缓存一致性](缓存.md#缓存一致性)读到[LRU](缓存.md#七lru)。

自测：

1. 怎样保证缓存与数据库的一致性？（见[缓存一致性](缓存.md#缓存一致性)）
2. 什么是大 Key 和热 Key？怎样处理？（见[大 Key 与热 Key](缓存.md#大-key-与热-key)）
3. 一致性哈希解决了什么问题？虚拟节点有什么用？（见[一致性哈希](缓存.md#六一致性哈希)）

<details>
<summary>参考要点</summary>

1. 用 Cache Aside：读未命中时查数据库并写回缓存，写时先更新数据库（事务提交之后）再删除缓存；删除而不是更新缓存，避免并发写到达缓存的顺序与数据库不同；删除失败或慢读写回旧值时仍会不一致，用过期时间兜底，加上延迟双删、消息队列重试或订阅 binlog 删除；只能最终一致，余额、库存直接读写数据库。
2. 大 Key 是值很大的键（几 MB 的字符串、几十万元素的集合），会阻塞单线程、占带宽、造成数据倾斜，用 --bigkeys 发现，拆成小键，删除用 UNLINK、分批用 HSCAN 读；热 Key 是访问量远高于其它的键，请求集中到一个节点，淘汰策略为 LFU 时用 --hotkeys 发现，否则在客户端或代理中统计，用本地缓存或复制成多个键分散读取。
3. 取模分布在节点数变化时几乎所有键都要迁移，一致性哈希把节点和键放在哈希环上，键存到顺时针第一个节点，增删节点只影响相邻节点，4 个节点扩到 5 个约 18% 的键迁移；节点少时分布不均（最多 44.7%、最少 9.0%），每个节点放 150 个虚拟节点后占比在 22.8%～27.0%。

</details>

动手：不看笔记手写 LRU 缓存（哈希表加双向链表），在力扣 146 题提交通过后，再与[LRU](缓存.md#七lru)一节的实现对比。

预期：在力扣 146 题提交通过，get 和 put 都是 O(1)：访问的节点移到链表头部，超出容量时删除链表尾部的节点并从哈希表中移除。

算法（排序与堆，中等）：[912. 排序数组（手写快速排序）](https://leetcode.cn/problems/sort-an-array/)，题解见[快速排序](算法%20-%20排序.md#快速排序)。

综合题：商品详情页的 QPS 很高：怎样设计缓存的读写流程？热点商品的缓存过期时怎样避免数据库被压垮？价格修改后多久能看到新值？（见[多级缓存](缓存.md#多级缓存)、[缓存击穿](缓存.md#缓存击穿)、[缓存一致性](缓存.md#缓存一致性)）

<details>
<summary>答题思路</summary>

1. 读：本地缓存 → Redis → 数据库，逐级回填，详情页读多写少，适合放本地缓存。
2. 写：先更新数据库，再删除 Redis 中的键，并广播消息删除各实例的本地缓存。
3. 热点过期：互斥锁只让一个请求查库，或用逻辑过期直接返回旧值、后台重建，过期时间加随机值避免同时失效；用逻辑过期时写请求不删除键，而是把值中的过期时间改为已过期，否则删除后同样会击穿。
4. 多久看到新值：正常情况下删除后的下一次读取就能看到；本地缓存的广播丢失时，要等本地缓存过期（例如 30 秒）；Redis 删除失败或慢读请求写回了旧值时，要等 Redis 键的过期时间，并且从旧值写回时算起，所以没有统一的上限，用删除重试、延迟双删或订阅 binlog 缩短窗口。

</details>

明天：第 36 天，TCP 的连接管理（计算机网络 - 传输层：UDP 和 TCP 的特点～TCP 的四次挥手）。

## 十、计算机网络

### 第 36 天：TCP 的连接管理

先比较 TCP 和 UDP，再看 TCP 首部中的序号和确认号，它们是理解握手和挥手的基础。TIME_WAIT 和 CLOSE_WAIT 是线上排查中常见的问题。

阅读：《计算机网络 - 传输层》从[UDP 和 TCP 的特点](计算机网络%20-%20传输层.md#udp-和-tcp-的特点)读到[TCP 的四次挥手](计算机网络%20-%20传输层.md#tcp-的四次挥手)。

自测：

1. 三次握手的过程是怎样的？为什么不是两次？（见[TCP 的三次握手](计算机网络%20-%20传输层.md#tcp-的三次握手)、[三次握手的原因](计算机网络%20-%20传输层.md#三次握手的原因)）
2. 为什么 TIME_WAIT 要等待 2MSL？（见[TIME_WAIT](计算机网络%20-%20传输层.md#time_wait)）
3. 服务器上出现大量 TIME_WAIT 或 CLOSE_WAIT 是什么原因？（见[大量 TIME_WAIT 与 CLOSE_WAIT](计算机网络%20-%20传输层.md#大量-time_wait-与-close_wait)）

<details>
<summary>参考要点</summary>

1. 客户端发 SYN（序号 x），服务器回 SYN+ACK（序号 y、确认号 x+1），客户端回 ACK（确认号 y+1），双方进入 ESTABLISHED；双方的初始序号都要得到对方确认，两次握手时服务器的序号得不到确认；第三次握手还能让客户端对滞留的旧连接请求回 RST，避免服务器多打开一个连接。
2. 保证最后一个 ACK 能到达：ACK 丢失时对方会重传 FIN，2MSL 正好覆盖 ACK 的 1 MSL 加重传 FIN 的 1 MSL；让本连接的旧报文都从网络中消失，不干扰同一四元组的新连接；Linux 中固定为 60 秒。
3. TIME_WAIT 在主动关闭方，多由短连接引起；发起连接的一方每个 TIME_WAIT 占用本地端口 60 秒，连接同一目标时每秒新建约 470 个连接就会耗尽默认的 28232 个端口（服务器一侧的 TIME_WAIT 共用监听端口，不消耗本地端口），用长连接或连接池、把 tcp_tw_reuse 设为 1（默认值 2 只对回环地址生效）、扩大端口范围解决；CLOSE_WAIT 在被动关闭方，是应用没有调用 close()，多为异常分支没关连接或连接池借出未还，要改代码。

</details>

动手：用 tcpdump 或 Wireshark 抓一次 curl http://example.com 的数据包，找出三次握手和四次挥手的报文，记下每个报文的序号和确认号。

预期：握手为 SYN（seq=x）、SYN+ACK（seq=y，ack=x+1）、ACK（ack=y+1）三个报文，挥手为双方各一个 FIN 及其 ACK，被动关闭方立即 close() 时 ACK 与 FIN 合并，只看到三个报文。

算法（二叉树，简单）：[101. 对称二叉树](https://leetcode.cn/problems/symmetric-tree/)，题解见[树的对称](Leetcode%20题解%20-%20树.md#9-树的对称)。

明天：第 37 天，可靠传输与拥塞控制（计算机网络 - 传输层：TCP 可靠传输～在 UDP 上实现可靠传输）。

### 第 37 天：可靠传输与拥塞控制

按确认与重传、滑动窗口、流量控制、拥塞控制的顺序读，注意流量控制和拥塞控制分别在保护谁。

阅读：《计算机网络 - 传输层》从[TCP 可靠传输](计算机网络%20-%20传输层.md#tcp-可靠传输)读到[在 UDP 上实现可靠传输](计算机网络%20-%20传输层.md#在-udp-上实现可靠传输)。

自测：

1. TCP 怎样保证可靠传输？（见[TCP 可靠传输](计算机网络%20-%20传输层.md#tcp-可靠传输)）
2. 拥塞控制和流量控制有什么区别？（见[TCP 拥塞控制](计算机网络%20-%20传输层.md#tcp-拥塞控制)）
3. 什么是粘包？怎样解决？（见[TCP 粘包与拆包](计算机网络%20-%20传输层.md#tcp-粘包与拆包)）

<details>
<summary>参考要点</summary>

1. 检验和：出错的报文段直接丢弃；序号和累积确认：去重、排序，SACK 告诉发送方收到了哪些区间；重传：超时重传（RTO 按 RTT 动态计算、超时后翻倍），或收到 3 个重复确认时快重传；滑动窗口、流量控制和拥塞控制让发送速率不超过接收方和网络的能力。
2. 流量控制保护接收方：接收方在确认报文的窗口字段中通告缓冲区剩余空间，为 0 时发送方停止发送；拥塞控制保护整个网络：发送方维护拥塞窗口 cwnd，用慢开始、拥塞避免、快重传、快恢复调节；实际发送窗口取 cwnd 和接收窗口中的较小值。
3. TCP 面向字节流，不保留应用写入的边界，一次读取可能读到两条消息拼在一起（粘包）或半条消息（拆包）；原因有按缓冲区现有数据读取、Nagle 合并小数据、超过 MSS 被分段；在应用层约定边界：固定长度、分隔符或长度字段（长度要限制上限）；UDP 面向报文，没有粘包。

</details>

动手：在 Linux 上按[附录 A1](计算机网络%20-%20传输层.md#a1-tcp-与-udp-发送位置更新)的方法给回环网卡加上时延和丢包（tc qdisc add dev lo root netem delay 25ms loss 1%），用 python3 -m http.server 8000 提供一个几百 MB 的文件，再用 curl 从 127.0.0.1:8000 下载；下载时反复执行 ss -ti sport = :8000，查看服务器一侧（发送方）连接的 cwnd、rtt 和 retrans，对照[TCP 拥塞控制](计算机网络%20-%20传输层.md#tcp-拥塞控制)一节解释 cwnd 的变化。

预期：服务器一侧的 rtt 约 50 ms，cwnd 从初始值（约 10 个报文段）开始迅速增大，之后增长放缓；retrans 增加（出现丢包）时 cwnd 随之减小再重新增长；客户端一侧主要在接收数据，它的 cwnd 不反映下载方向的拥塞控制。

算法（二叉树，简单）：[104. 二叉树的最大深度](https://leetcode.cn/problems/maximum-depth-of-binary-tree/)，题解见[树的高度](Leetcode%20题解%20-%20树.md#1-树的高度)。

明天：第 38 天，HTTP 基础（HTTP：HTTP 基础概念～HTTP 首部）。

### 第 38 天：HTTP 基础

这几章是 HTTP 报文的基本格式。方法和首部字段可以略读，常见的状态码要记住。

阅读：《HTTP》从[HTTP 基础概念](HTTP.md#一基础概念)读到[HTTP 首部](HTTP.md#四http-首部)。

自测：

1. HTTP 请求报文和响应报文由哪几部分组成？（见[请求和响应报文](HTTP.md#请求和响应报文)）
2. 301、302、304、502、504 分别表示什么？（见[HTTP 状态码](HTTP.md#三http-状态码)）
3. PUT 和 PATCH 有什么区别？（见[PUT](HTTP.md#put)、[PATCH](HTTP.md#patch)）

<details>
<summary>参考要点</summary>

1. 请求报文：请求行（方法、URL、协议版本）、请求首部、空行、请求主体；响应报文：状态行（协议版本、状态码、原因短语）、响应首部、空行、响应主体。
2. 301 永久重定向，没有缓存指令时默认可被浏览器缓存，适合域名迁移；302 临时重定向，默认不缓存；304 表示条件请求（If-None-Match、If-Modified-Since）的资源没有变化，不带响应体；502 是网关从上游收到无效响应（后端出错或不可达），504 是网关等待上游超时（后端太慢）。
3. PUT 创建或完全替换目标资源；PATCH 只对资源做部分修改。

</details>

动手：用 curl -v 访问一个网站，指出请求行、请求首部、状态行和响应首部，再用 curl -I 只获取响应首部。

预期：curl -v 中以 > 开头的是请求行（GET / HTTP/1.1）和请求首部，以 < 开头的是状态行（HTTP/1.1 200 OK）和响应首部，curl -I 只输出状态行和响应首部，没有响应体。

算法（二叉树，中等）：[102. 二叉树的层序遍历](https://leetcode.cn/problems/binary-tree-level-order-traversal/)，题解见[剑指 Offer 32.2](32.2%20把二叉树打印成多行.md)。

明天：第 39 天，连接管理与 Cookie（HTTP：连接管理～Cookie）。

### 第 39 天：连接管理与 Cookie

长连接减少了建立连接的次数。Cookie 一节篇幅较长，重点是 Session、JWT，以及 Cookie、Session 和 Token 的区别。

阅读：《HTTP》从[连接管理](HTTP.md#连接管理)读到[Cookie](HTTP.md#cookie)。

自测：

1. 什么是长连接？HTTP/1.1 怎样复用连接？（见[连接管理](HTTP.md#连接管理)）
2. Cookie、Session 和 Token 有什么区别？（见[Cookie 与 Session 选择](HTTP.md#10-cookie-与-session-选择)、[JWT](HTTP.md#11-jwt)）
3. Cookie 有哪些和安全相关的属性？（见[HttpOnly](HTTP.md#6-httponly)、[Secure](HTTP.md#7-secure)）

<details>
<summary>参考要点</summary>

1. 长连接指一个 TCP 连接上进行多次 HTTP 通信，省去每次建连的开销；HTTP/1.1 默认长连接，要断开时发送 Connection: close，之前的版本要用 Connection: Keep-Alive；服务器在连接空闲一段时间后关闭它（Nginx 默认 75 秒），这和 TCP 的保活探测不是一回事；同一连接上的请求按顺序收发，流水线因队头阻塞未被浏览器启用，HTTP/2 用多路复用解决。
2. Cookie 是保存在浏览器、每次请求自动携带的小块数据（约 4 KB）；Session 把状态存在服务器（如 Redis），Cookie 只带 Session ID，删除 Session 就能让用户下线，集群要共享；Token（如 JWT）把状态放在带签名的令牌中，服务无需保存会话就能验证，但过期前无法主动失效，常用短期访问令牌加刷新令牌，需要立即失效时把令牌 ID 放入 Redis 黑名单，这又回到了在服务器保存状态。
3. HttpOnly 禁止 JavaScript 读取，减少 XSS 窃取；Secure 只通过 HTTPS 发送；SameSite 限制跨站请求携带（Strict 都不带，Lax 只允许顶级导航的 GET，None 都带但必须同时设置 Secure），防范 CSRF；Domain、Path 限定发送范围，Expires、Max-Age 控制有效期。

</details>

动手：用浏览器的开发者工具查看一个网站登录后响应中的 Set-Cookie，找出其中的 HttpOnly、Secure 和 SameSite 属性。

预期：登录后响应中有形如 Set-Cookie: <名称>=<值>; Path=/; Secure; HttpOnly; SameSite=Lax 的首部，保存登录状态的 Cookie 通常带 HttpOnly 和 Secure。

算法（二叉树，中等）：[103. 二叉树的锯齿形层序遍历](https://leetcode.cn/problems/binary-tree-zigzag-level-order-traversal/)，题解见[剑指 Offer 32.3](32.3%20按之字形顺序打印二叉树.md)。

明天：第 40 天，缓存、WebSocket 与跨域（HTTP：HTTP 缓存～跨域）。

### 第 40 天：缓存、WebSocket 与跨域

HTTP 缓存分为强缓存和协商缓存。内容协商到通信数据转发几节可以略读；WebSocket 和跨域是 Web 开发中常遇到的问题。

阅读：《HTTP》从[HTTP 缓存](HTTP.md#缓存)读到[跨域](HTTP.md#跨域)。

自测：

1. 强缓存和协商缓存有什么区别？（见[强缓存与协商缓存](HTTP.md#5-强缓存与协商缓存)）
2. WebSocket 和 HTTP 有什么区别？什么时候用 SSE？（见[WebSocket](HTTP.md#websocket)）
3. 什么是跨域？怎样解决？（见[跨域](HTTP.md#跨域)）

<details>
<summary>参考要点</summary>

1. 强缓存：在 max-age（或 Expires）规定的有效期内直接使用本地缓存，不发请求；协商缓存：缓存过期或响应带 no-cache 时，带上 If-None-Match 或 If-Modified-Since 向服务器确认，没变化返回 304、只传首部；常见做法是 HTML 用 no-cache，带内容哈希的 JS、CSS 设很长的 max-age。
2. HTTP 是请求-响应模式，服务器不能主动发消息；WebSocket 由一次 HTTP 升级（101）而来，之后在同一个 TCP 连接上全双工传输帧；SSE 是 text/event-stream 的普通 HTTP 响应，只能服务器推送，浏览器的 EventSource 断线后自动重连（它只能发 GET，用 fetch 读取响应流时要自己重连）；只需服务器推送（如大模型逐字输出）用 SSE，双方都要随时发消息（聊天）用 WebSocket。
3. 同源指协议、域名、端口都相同，浏览器禁止脚本读取其它源的响应（简单请求仍会发出并在服务器上执行）；常用 CORS：服务器返回 Access-Control-Allow-Origin，非简单请求先发 OPTIONS 预检，带 Cookie 时不能用 *；也可以用同源的反向代理转发；JSONP 只支持 GET，已被 CORS 取代。

</details>

动手：用 curl -I 请求一个静态资源（例如 https://www.baidu.com/favicon.ico），记下响应中的 ETag，再用 -H 把它放进 If-None-Match 首部请求一次，观察 304 响应，并与[附录 A2](HTTP.md#a2-强缓存与协商缓存)中 b.js 的第 2 次请求对照。

预期：第一次请求返回 200 和 ETag，带上相同的 If-None-Match 再请求返回 304 Not Modified；把 ETag 改动一个字符再请求，返回 200。

算法（二叉树，中等）：[236. 二叉树的最近公共祖先](https://leetcode.cn/problems/lowest-common-ancestor-of-a-binary-tree/)，题解见[二叉树的最近公共祖先](Leetcode%20题解%20-%20树.md#5-二叉树的最近公共祖先)。

明天：第 41 天，HTTPS（HTTP：HTTPS）。

### 第 41 天：HTTPS

HTTPS 在 HTTP 和 TCP 之间加了一层 TLS。按加密、认证、握手的顺序读，握手一节要能对着报文讲出每一步做了什么。

阅读：《HTTP》的[HTTPS](HTTP.md#六https)。

自测：

1. HTTPS 的握手过程是怎样的？（见[TLS 握手](HTTP.md#tls-握手)）
2. HTTPS 为什么同时使用对称加密和非对称加密？（见[加密](HTTP.md#加密)）
3. 证书是怎样验证的？根证书有什么用？（见[认证](HTTP.md#认证)）

<details>
<summary>参考要点</summary>

1. 以 TLS 1.2 的 ECDHE 为例：ClientHello 带客户端随机数、密码套件列表和 SNI；服务器回 ServerHello（选定套件、服务器随机数）、证书链和 ServerKeyExchange（ECDHE 公钥及证书私钥的签名）；客户端验证证书和签名后发出自己的 ECDHE 公钥，双方算出预主密钥，结合两个随机数派生会话密钥，再互发 Finished 校验握手未被篡改；TLS 1.2 要 2 个 RTT，TLS 1.3 在 ClientHello 中直接带公钥，只要 1 个 RTT。
2. 对称加密快，但无法安全地把密钥交给对方；非对称加密的公钥可以公开传输（是否属于对方要靠证书验证），但运算慢（RSA-2048 私钥解密不到 0.4 MB/s，AES-128-GCM 加密约 6 GB/s）；所以用非对称方式协商或传输会话密钥，再用对称加密传输数据；现在大多用 ECDHE 协商会话密钥，证书的密钥只用于签名，TLS 1.3 已删除 RSA 密钥交换。
3. CA 用私钥对证书内容（域名、公钥、有效期等）的哈希值签名，客户端用上一级证书的公钥验证，内容改一个字节就会失败；沿证书链逐级验证，顶端必须是预装在系统或浏览器中的根证书，根证书自签名，是信任的起点；还要检查有效期、吊销状态和域名是否在证书的 Subject Alternative Name 中。

</details>

动手：按[附录 A7](HTTP.md#a7-证书链与密码套件)的方法，用 openssl s_client 连接一个网站，找出协商出的 TLS 版本、密码套件和证书链。

预期：Protocol 一行为协商出的版本（如 TLSv1.2），Cipher 一行为密码套件（如 ECDHE-RSA-AES128-GCM-SHA256），证书链按 depth=2、1、0 列出根证书、中间证书和网站证书，Verify return code 为 0 (ok)。

算法（二叉树，中等）：[199. 二叉树的右视图](https://leetcode.cn/problems/binary-tree-right-side-view/)。

明天：第 42 天，HTTP 的版本、GET 与 POST、DNS（HTTP：HTTP/1.1 新特性～GET 和 POST 比较；计算机网络 - 应用层：域名系统）。

### 第 42 天：HTTP 的版本、GET 与 POST、DNS

HTTP/2 和 HTTP/3 分别解决了 HTTP/1.1 的哪些问题是常见的追问。GET 和 POST 的区别要从语义讲起，而不只是参数的位置。

阅读：《HTTP》从[HTTP/1.1 新特性](HTTP.md#七http11-新特性)读到[GET 和 POST 比较](HTTP.md#九get-和-post-比较)；《计算机网络 - 应用层》的[域名系统](计算机网络%20-%20应用层.md#域名系统)。

自测：

1. HTTP/2 相比 HTTP/1.1 有哪些改进？（见[HTTP/2.0](HTTP.md#八http20)）
2. GET 和 POST 有什么区别？（见[GET 和 POST 比较](HTTP.md#九get-和-post-比较)）
3. DNS 的解析过程是怎样的？（见[域名系统](计算机网络%20-%20应用层.md#域名系统)）

<details>
<summary>参考要点</summary>

1. 二进制分帧：报文拆成 HEADERS 帧和 DATA 帧，一个 TCP 连接承载多个流，帧交错发送，不再需要多个连接；首部压缩：双方维护首部字段表并用 Huffman 编码；服务端推送（Chrome 106 起默认禁用）；TCP 层的队头阻塞仍在，HTTP/3 改用基于 UDP 的 QUIC 解决。
2. 语义：GET 获取资源，POST 传输实体主体；GET 安全且幂等，POST 会改变服务器状态，不幂等；参数放在哪里只是惯例，GET 参数通常在 URL 中（要编码，长度受浏览器和服务器的限制，例如 Nginx 默认请求行不超过 8 KB），POST 在主体中，但抓包同样能看到，并不更安全；GET 响应可缓存，POST 多数不可缓存。
3. 先查浏览器缓存、系统缓存和 hosts，未命中则向本地 DNS 服务器递归查询；本地 DNS 服务器依次迭代询问根服务器、顶级域服务器，它们只返回下一级服务器的地址，最后由权威服务器返回 IP；各级结果按 TTL 缓存；一般用 UDP 53 端口，响应超过 UDP 报文的长度上限（不用 EDNS 时为 512 字节）被截断，或做全量区域传送（AXFR）时用 TCP。

</details>

动手：用 dig +trace 查询一个域名，对照[域名系统](计算机网络%20-%20应用层.md#域名系统)一节说出每一级服务器返回了什么。

预期：依次看到根服务器返回顶级域（如 com）服务器的 NS 记录，顶级域服务器返回该域名权威服务器的 NS 记录，权威服务器返回最终的 A 记录（或先返回 CNAME），每条记录都带 TTL。

算法（二叉树，中等）：[105. 从前序与中序遍历序列构造二叉树](https://leetcode.cn/problems/construct-binary-tree-from-preorder-and-inorder-traversal/)，题解见[剑指 Offer 7](7.%20重建二叉树.md)。

明天：第 43 天，从输入 URL 到显示页面（计算机网络 - 应用层：Web 页面请求过程；攻击技术：跨站脚本攻击～SQL 注入攻击）。

### 第 43 天：从输入 URL 到显示页面

Web 页面请求过程把前几天的内容串了起来。攻击技术中 XSS、CSRF 和 SQL 注入各自利用了什么、怎样防范要分清。

阅读：《计算机网络 - 应用层》的[Web 页面请求过程](计算机网络%20-%20应用层.md#web-页面请求过程)；《攻击技术》从[跨站脚本攻击](攻击技术.md#一跨站脚本攻击)读到[SQL 注入攻击](攻击技术.md#三sql-注入攻击)。

自测：

1. 从输入 URL 到页面显示经历了哪些过程？（见[Web 页面请求过程](计算机网络%20-%20应用层.md#web-页面请求过程)）
2. XSS 和 CSRF 有什么区别？分别怎样防范？（见[XSS](攻击技术.md#概念)、[XSS 的防范](攻击技术.md#防范手段)、[CSRF](攻击技术.md#概念-1)、[CSRF 的防范](攻击技术.md#防范手段-1)）
3. 怎样防止 SQL 注入？（见[SQL 注入的防范](攻击技术.md#防范手段-2)）

<details>
<summary>参考要点</summary>

1. 解析 URL，有未过期的缓存直接使用；DNS 解析得到 IP；TCP 三次握手，HTTPS 再做 TLS 握手；发送 HTTP 请求，经负载均衡或反向代理转给应用服务器，响应是重定向时对新地址重走一遍；浏览器解析 HTML 构建 DOM 树、解析 CSS 构建 CSSOM，合成渲染树后布局、绘制，遇到 CSS、JS、图片另发请求，普通脚本会暂停 HTML 的解析；连接保留一段时间供复用。
2. XSS 把恶意脚本注入网页，利用用户对网站的信任，可窃取 Cookie、冒用身份，防范：输出时按上下文转义、富文本白名单过滤、Cookie 设 HttpOnly、CSP 禁止内联脚本；CSRF 诱导浏览器带着登录状态访问目标网站执行操作，利用网站对浏览器的信任，防范：校验随机 Token、SameSite Cookie、检查 Referer 和 Origin、敏感操作要求重新输入密码或短信验证码。
3. 使用参数化查询（PreparedStatement、MyBatis 的 #{}），SQL 结构先确定，参数只当作数据；表名、列名、ORDER BY 字段不能用占位符，用白名单校验；数据库账号只授予最小权限。

</details>

算法（二叉树，中等）：[98. 验证二叉搜索树](https://leetcode.cn/problems/validate-binary-search-tree/)。

综合题：在浏览器输入 https://example.com 并回车，按 DNS、TCP、TLS、HTTP 的顺序说出每一步发送了什么，以及在哪些地方可能变慢。（见[Web 页面请求过程](计算机网络%20-%20应用层.md#web-页面请求过程)、[TCP 的三次握手](计算机网络%20-%20传输层.md#tcp-的三次握手)、[TLS 握手](HTTP.md#tls-握手)）

<details>
<summary>答题思路</summary>

1. DNS：查浏览器、系统缓存和 hosts，再由本地 DNS 服务器迭代询问根、顶级域和权威服务器，缓存未命中时多出几次往返。
2. TCP：三次握手 1 个 RTT，SYN 丢失要等超时重传（约 1 秒）。
3. TLS：交换 Hello、证书和密钥，TLS 1.3 需要 1 个 RTT、TLS 1.2 需要 2 个，还要验证证书链。
4. HTTP：发送加密的请求，等待服务器处理返回首字节，再加载 CSS、JS、图片；RTT 200 ms 时实测 TCP 连接约 0.20 秒建立、TLS 约 0.41 秒完成、首字节约 0.62 秒到达。
5. 变慢的地方：DNS 未命中、RTT 大或丢包重传、服务器处理慢、资源多且大，对应用 DNS 缓存、连接复用、TLS 1.3 与会话恢复、HTTP 缓存和 CDN 改善。

</details>

明天：第 44 天，进程与线程（计算机操作系统 - 进程管理：进程与线程～进程状态的切换）。

## 十一、操作系统

### 第 44 天：进程与线程

进程和线程的区别是操作系统中问得最多的问题。协程一节说明了 Java 21 为什么引入虚拟线程。

阅读：《计算机操作系统 - 进程管理》从[进程与线程](计算机操作系统%20-%20进程管理.md#进程与线程)读到[进程状态的切换](计算机操作系统%20-%20进程管理.md#进程状态的切换)。

自测：

1. 进程和线程有什么区别？（见[进程与线程的区别](计算机操作系统%20-%20进程管理.md#3-区别)）
2. 上下文切换有哪些开销？（见[上下文切换](计算机操作系统%20-%20进程管理.md#4-上下文切换)）
3. 协程和线程有什么区别？Java 的虚拟线程是怎样实现的？（见[协程](计算机操作系统%20-%20进程管理.md#5-协程)）

<details>
<summary>参考要点</summary>

1. 进程是资源分配的基本单位，线程是调度的基本单位，同一进程的线程共享地址空间和文件描述符；创建进程的开销远大于线程，切换进程还要切换地址空间，开销更大；线程间直接读写共享数据，进程间要借助 IPC；进程相互隔离，一个线程段错误会终止整个进程。
2. 保存当前线程的寄存器、程序计数器、栈指针，恢复另一个线程的值；切换到另一个进程还要切换页表，TLB 和 CPU 缓存中原来的映射和数据大多用不上、要重新加载（有 PCID 时 TLB 不必全部清空），这部分间接开销通常更大，工作集很小时两者几乎没有差别；实测一次切换约 1.1 微秒（其中还包含一次 write 和一次 read）。
3. 协程在用户态由运行时调度，Go 和 Java 虚拟线程把大量协程映射到少量线程上（M:N），Python asyncio 则在一个线程的事件循环中执行，切换不陷入内核、内存占用小，可以大量创建，但同一线程上的协程不能并行；虚拟线程是 JVM 实现的有栈协程，由 ForkJoinPool 的平台线程（默认等于 CPU 核数）执行，阻塞 I/O 时卸载，栈帧以栈块对象存入堆，就绪后再挂载到某个平台线程继续执行；JDK 21 中在 synchronized 内阻塞无法卸载，JDK 24 起基本消除。

</details>

动手：运行[附录 A2](计算机操作系统%20-%20进程管理.md#a2-平台线程与虚拟线程的开销)的代码，比较创建 1 万个平台线程和虚拟线程的耗时与内存。

预期：1 万个平台线程启动约 1.4 秒、RSS 增加约 290 MB，1 万个虚拟线程约 30 毫秒、RSS 增加约 40 MB（堆中每个约 2 KB），100 万个虚拟线程约 0.5 秒、堆增加约 690 MB。

算法（回溯与搜索，中等）：[200. 岛屿数量](https://leetcode.cn/problems/number-of-islands/)，题解见[矩阵中的连通分量数目](Leetcode%20题解%20-%20搜索.md#2-矩阵中的连通分量数目)。

明天：第 45 天，系统调用、进程同步与通信（计算机操作系统 - 概述：系统调用；计算机操作系统 - 进程管理：进程调度算法～进程通信）。

### 第 45 天：系统调用、进程同步与通信

系统调用解释了用户态和内核态之间的切换。调度算法和经典同步问题可以略读，重点是信号量和进程间的通信方式。

阅读：《计算机操作系统 - 概述》的[系统调用](计算机操作系统%20-%20概述.md#系统调用)；《计算机操作系统 - 进程管理》从[进程调度算法](计算机操作系统%20-%20进程管理.md#进程调度算法)读到[进程通信](计算机操作系统%20-%20进程管理.md#进程通信)。选读：[进阶：经典同步问题](计算机操作系统%20-%20进程管理%20-%20进阶.md#经典同步问题)。

自测：

1. 什么是用户态和内核态？什么时候会切换？（见[系统调用](计算机操作系统%20-%20概述.md#系统调用)）
2. 进程间通信有哪些方式？（见[进程通信](计算机操作系统%20-%20进程管理.md#进程通信)）
3. 信号量是怎样实现同步与互斥的？（见[信号量](计算机操作系统%20-%20进程管理.md#3-信号量)）

<details>
<summary>参考要点</summary>

1. 内核运行在特权级 0（内核态），应用运行在 3 级（用户态），特权指令只能在内核态执行，用户态也只能访问本进程的用户空间，以保护内核和其它进程；系统调用（如读写文件、创建进程）、异常（如缺页）和外中断会从用户态进入内核态；一次系统调用约 165 ns，是普通函数调用的近 180 倍，但不一定发生上下文切换。
2. 管道：单向，一般用于父子或兄弟这类有共同祖先的进程，FIFO（命名管道）去掉了这个限制；消息队列：独立于读写进程存在，可按类型接收；共享内存：同一物理页映射到多个进程，不用复制，最快，要配合信号量同步；套接字：可用于不同机器之间。
3. 信号量是整型变量，down（P）在大于 0 时减 1、等于 0 时睡眠，up（V）加 1 并唤醒等待者，两者是原语；取值只有 0、1 的二值信号量可以当作互斥量，进入临界区前 down、离开时 up（但信号量可以由别的进程 up，互斥锁只能由加锁的线程释放）；同步用计数信号量，例如生产者-消费者用 empty、full 计数，且要先 down(empty) 再 down(mutex)，反过来会死锁。

</details>

动手：运行[附录 A1](计算机操作系统%20-%20概述.md#a1-普通函数调用与系统调用的耗时)的代码，比较普通函数调用和系统调用的耗时。

预期：普通函数调用约 1 ns，glibc 的 getppid() 约 167 ns、直接陷入约 165 ns，系统调用约为函数调用的近 180 倍，经 vDSO 的 clock_gettime 约 18 ns，绕过 vDSO 约 202 ns。

算法（回溯与搜索，中等）：[46. 全排列](https://leetcode.cn/problems/permutations/)，题解见[排列](Leetcode%20题解%20-%20搜索.md#5-排列)。

明天：第 46 天，死锁（计算机操作系统 - 死锁：必要条件～程序中的死锁）。

### 第 46 天：死锁

四个必要条件是预防死锁的出发点。银行家算法可以略读，最后一节的 Java 线程死锁和 MySQL 死锁对应实际排查。

阅读：《计算机操作系统 - 死锁》从[必要条件](计算机操作系统%20-%20死锁.md#必要条件)读到[程序中的死锁](计算机操作系统%20-%20死锁.md#程序中的死锁)。

自测：

1. 死锁的四个必要条件是什么？（见[必要条件](计算机操作系统%20-%20死锁.md#必要条件)）
2. 怎样避免死锁？实际开发中最常用哪种方法？（见[死锁预防](计算机操作系统%20-%20死锁.md#死锁预防)）
3. 线上的 Java 程序发生死锁，怎样定位？（见[Java 线程死锁](计算机操作系统%20-%20死锁.md#1-java-线程死锁)）

<details>
<summary>参考要点</summary>

1. 互斥：资源要么已分配给一个进程，要么可用；占有和等待：已持有资源的进程还能请求新资源；不可抢占：资源只能由持有者显式释放；环路等待：多个进程形成环，每个都在等下一个持有的资源。
2. 设计时破坏任一必要条件：一次申请全部资源（破坏占有和等待，利用率低）、申请失败就释放已有资源（破坏不可抢占，如 tryLock 超时）、资源编号后按顺序加锁（破坏环路等待）；最常用的是按固定顺序加锁，代价最小，例如转账时总是先锁 id 小的账户。
3. 用阻塞式的锁时，死锁线程几乎不耗 CPU（例如等待 synchronized 的线程处于 BLOCKED），现象是 CPU 低而请求全部卡住；用 jstack 或 jcmd <pid> Thread.print 打印线程栈，末尾会报告 Found one Java-level deadlock，列出各线程等待的锁和持有者；程序中也可以定时调用 ThreadMXBean.findDeadlockedThreads() 检测并告警，但它检测不到包含虚拟线程的死锁环和 Semaphore 这类不可重入锁的自死锁；JVM 不会自动解除死锁，卡在 synchronized 上的线程无法中断，通常只能重启，所以要靠固定加锁顺序或 tryLock 预防。

</details>

动手：运行[附录 A1](计算机操作系统%20-%20死锁.md#a1-java-线程死锁)的代码，用 jstack 找到互相等待的两个线程。

预期：原写法每次都卡住（stuck），jstack 末尾报告 Found one Java-level deadlock：T1 等待的锁被 T2 持有，T2 等待的锁被 T1 持有，两者都是 BLOCKED，改为按 id 顺序加锁后都能完成，两个余额仍为 1000。

算法（回溯与搜索，中等）：[93. 复原 IP 地址](https://leetcode.cn/problems/restore-ip-addresses/)，题解见[IP 地址划分](Leetcode%20题解%20-%20搜索.md#2-ip-地址划分)。

明天：第 47 天，内存管理（计算机操作系统 - 内存管理：虚拟内存～分页与分段的比较）。

### 第 47 天：内存管理

虚拟内存让每个进程有独立的地址空间。分页的地址转换和页面置换算法是重点，LRU 在缓存中还会再出现。

阅读：《计算机操作系统 - 内存管理》从[虚拟内存](计算机操作系统%20-%20内存管理.md#虚拟内存)读到[分页与分段的比较](计算机操作系统%20-%20内存管理.md#分页与分段的比较)。

自测：

1. 什么是虚拟内存？为什么需要它？（见[虚拟内存](计算机操作系统%20-%20内存管理.md#虚拟内存)）
2. 有哪些页面置换算法？（见[页面置换算法](计算机操作系统%20-%20内存管理.md#页面置换算法)）
3. 分页和分段有什么区别？（见[分页与分段的比较](计算机操作系统%20-%20内存管理.md#分页与分段的比较)）

<details>
<summary>参考要点</summary>

1. 虚拟内存让每个进程看到独立、连续的地址空间，程序使用虚拟地址，由硬件和操作系统按页翻译成物理地址；它让程序可以比物理内存大（只把用到的页放在内存中），隔离各进程并按页设置权限，简化加载（物理内存不必连续），还能让多个进程共享同一物理页。
2. OPT 换出最长时间不再访问的页，缺页最少但无法实现，只作对照；LRU 换出最近最久未使用的页，维护链表代价高；FIFO 换出最先进入的页，可能换出常用页，第二次机会和时钟算法用访问位 R 改进它，NRU 按 R、M 位分类换出；同一序列 3 个物理块时 OPT、LRU、FIFO 分别缺页 9、12、15 次。
3. 分页对程序员透明，分段要显式划分；分页是一维地址空间，分段是二维的；页大小固定，段大小可变；分页为了实现虚拟内存，分段为了按逻辑划分程序和数据、便于共享和保护；分页没有外部碎片，但每个段或区域的最后一页可能用不满，形成内部碎片，分段会留下大小不一的空闲块，形成外部碎片（x86-64 的 Linux 只用分页）。

</details>

动手：运行[附录 A3](计算机操作系统%20-%20内存管理.md#a3-进程的地址空间布局)的代码，查看 /proc/<pid>/maps 中代码段、堆和栈的位置。

预期：maps 中 r-xp 的可执行文件区域是代码段，之后 rw-p 的是数据段和 BSS，[heap] 紧随其后，1 MB 的 malloc 和共享库在中间的映射区，[stack] 在最高处，再运行一次起始地址都变，上下顺序不变。

算法（回溯与搜索，中等）：[22. 括号生成](https://leetcode.cn/problems/generate-parentheses/)，题解见[括号生成](Leetcode%20题解%20-%20搜索.md#16-括号生成)。

明天：第 48 天，I/O 多路复用（Socket：I/O 模型～I/O 复用）。

### 第 48 天：I/O 多路复用

先区分五种 I/O 模型，再看 select、poll 和 epoll 的差别。epoll 的两种工作模式是常见的追问。

阅读：《Socket》从[I/O 模型](Socket.md#一io-模型)读到[I/O 复用](Socket.md#二io-复用)。选读：[NIO](Java%20IO.md#七nio)。

自测：

1. select、poll 和 epoll 有什么区别？（见[select、poll 与 epoll 的比较](Socket.md#比较)、[epoll](Socket.md#epoll)）
2. epoll 的水平触发和边缘触发有什么区别？（见[工作模式](Socket.md#工作模式)）
3. BIO、NIO 和 AIO 有什么区别？（见[五大 I/O 模型比较](Socket.md#五大-io-模型比较)）

<details>
<summary>参考要点</summary>

1. select 每次调用都要把描述符集合复制到内核并逐个检查，开销与描述符数成正比，只能监听编号小于 1024 的描述符；poll 用 pollfd 数组，没有 1024 限制，但同样每次复制和遍历；epoll 用 epoll_ctl 把描述符注册到内核的红黑树中只复制一次，就绪时由回调加入就绪链表，epoll_wait 只返回就绪的事件；监听 1 万个描述符、只有 1 个就绪时，poll 每次约 1.6 ms，epoll_wait 约 0.21 µs，但 epoll 只能在 Linux 上使用。
2. LT（默认）只要描述符仍可读，每次 epoll_wait 都会报告；ET 只在有新数据到达时报告一次，必须用非阻塞描述符并循环读到 EAGAIN，否则剩下的数据不会再触发事件，连接停住；ET 减少了重复通知，但要防止一个连接长时间占住线程。
3. BIO 对应阻塞式 I/O，线程阻塞在 read 上，每个连接要一个线程；NIO 对应 I/O 复用，Channel 设为非阻塞，一个线程在 Selector.select() 上等待多个连接中任意一个就绪（Linux 上用 epoll 实现）；AIO 对应异步 I/O 的编程方式，数据复制到应用的缓冲区后才通知应用，但 Linux 上的 JDK 实际用 epoll 加线程池实现；BIO、NIO 在复制数据时仍会阻塞，属于同步 I/O。

</details>

动手：运行[附录 A2](Socket.md#a2-lt-与-et-的读取过程)的代码，观察水平触发和边缘触发下每次 epoll_wait 返回后读到的数据。

预期：LT 下 3 次 epoll_wait 依次读到 1024、1024、952 字节后第 4 次超时，ET 每次只读一次时第 2 次 epoll_wait 就超时、剩 1976 字节，ET 循环读时一次事件内读完 1024、1024、952 字节后返回 EAGAIN。

算法（回溯与搜索，中等）：[78. 子集](https://leetcode.cn/problems/subsets/)，题解见[子集](Leetcode%20题解%20-%20搜索.md#11-子集)。

综合题：一个 Java 服务要同时维持 10 万个长连接：用每个连接一个线程的方式会遇到什么问题？用 epoll 或虚拟线程怎样解决？（见[上下文切换](计算机操作系统%20-%20进程管理.md#4-上下文切换)、[epoll](Socket.md#epoll)、[协程](计算机操作系统%20-%20进程管理.md#5-协程)）

<details>
<summary>答题思路</summary>

1. 每连接一个线程：10 万个线程各要独立的栈（x64 默认预留 1 MB，实际也有约 30 KB），内存达数 GB，创建慢，还受线程数上限限制。
2. 大部分连接空闲，线程频繁阻塞和唤醒，CPU 时间大量花在上下文切换上。
3. epoll：少量线程（如 Netty 的主从 Reactor）用 epoll_wait 等待，描述符只注册一次，每次只返回就绪的连接，开销与连接总数无关；要调大文件描述符上限，事件处理中不能长时间阻塞。
4. 虚拟线程：保留每连接一个线程的同步写法，阻塞 I/O 时从平台线程卸载，每个只在堆中占约 2 KB，少量平台线程就能承载 10 万个连接；JDK 21 中避免在 synchronized 内阻塞，限制并发用信号量。

</details>

明天：第 49 天，IoC 与 Bean（Spring：IoC 与 Bean）。

## 十二、Spring 与设计模式

### 第 49 天：IoC 与 Bean

IoC 一节先说明为什么需要容器。Bean 的生命周期要能对照调用栈说出实例化、属性填充和初始化的先后；循环依赖的重点是三级缓存为什么不能只用两级。

阅读：《Spring》的[IoC 与 Bean](Spring.md#一ioc-与-bean)。

自测：

1. Bean 的生命周期是怎样的？（见[Bean 的生命周期](Spring.md#bean-的生命周期)）
2. Spring 怎样解决循环依赖？为什么需要三级缓存？（见[循环依赖](Spring.md#循环依赖)）
3. 单例 Bean 是线程安全的吗？（见[Bean 的作用域与线程安全](Spring.md#bean-的作用域与线程安全)）

<details>
<summary>参考要点</summary>

1. 实例化（反射调用构造函数）→ 属性填充 → Aware 回调 → BeanPostProcessor 的 before 方法 → 初始化（@PostConstruct、afterPropertiesSet()、init-method）→ BeanPostProcessor 的 after 方法，AOP 在这里替换为代理；容器关闭时依次调用 @PreDestroy、destroy()、destroy-method。
2. 只能解决字段或 Setter 注入的单例：A 实例化后把生成提前引用的工厂放入三级缓存，注入 B 时 B 通过工厂拿到 A 的提前引用（放入二级缓存），A 初始化完成后进入一级缓存；需要第三级是因为 A 可能要被 AOP 代理，工厂被调用时才提前创建代理，保证 B 拿到的与容器中最终的对象相同；构造器注入和 prototype 的循环依赖无法解决，Spring Boot 2.6 起默认禁止。
3. 不一定：Spring 不做同步，是否安全取决于有没有可变的成员变量；只持有其它 Bean 引用的 Controller、Service 是安全的，把请求数据存进成员变量就会互相覆盖；数据放在局部变量中，必须共享时用 AtomicInteger 等线程安全的类，每个线程各自的数据放在 ThreadLocal 中。

</details>

动手：按[附录 A3](Spring.md#a3-bean-创建的调用栈)的方法，在一个 Bean 的构造方法和 setter 方法中分别打印调用栈，找出 createBeanInstance 和 populateBean 的位置，说明实例化和属性注入的先后。

预期：构造函数的栈中 doCreateBean 调用 createBeanInstance、经 Constructor.newInstance 反射创建对象，Setter 的栈中 doCreateBean 调用 populateBean、经 postProcessProperties 和 Method.invoke 注入，构造函数先打印，即先实例化再注入。

算法（回溯与搜索，中等）：[39. 组合总和](https://leetcode.cn/problems/combination-sum/)，题解见[组合求和](Leetcode%20题解%20-%20搜索.md#8-组合求和)。

明天：第 50 天，AOP 与事务（Spring：AOP～事务）。

### 第 50 天：AOP 与事务

AOP 基于动态代理，自调用时切面不生效的原因也在这里。事务是 AOP 的一个应用，读完原理再看事务失效的几种情况会更容易理解。

阅读：《Spring》从[AOP](Spring.md#二aop)读到[事务](Spring.md#三事务)。

自测：

1. AOP 的原理是什么？JDK 动态代理和 CGLIB 有什么区别？（见[动态代理](Spring.md#动态代理)）
2. Spring 事务的原理是什么？为什么加了 @Transactional 就有事务了？（见[事务的实现原理](Spring.md#事务的实现原理)）
3. 哪些情况下 @Transactional 会失效？（见[事务失效](Spring.md#事务失效)）

<details>
<summary>参考要点</summary>

1. Spring AOP 基于动态代理：容器中保存代理对象，调用时先执行切面逻辑，再调用原始对象的方法；JDK 动态代理要求目标类实现接口，代理类继承 Proxy 并实现同样的接口，只能代理接口方法；CGLIB 生成目标类的子类、重写方法，无法代理 final 类，以及 final、static 和 private 方法；Spring Boot 默认用 CGLIB。
2. 带 @Transactional 的 Bean 被代理，调用时 TransactionInterceptor 读取事务属性；事务管理器从连接池取连接、setAutoCommit(false)，绑定到当前线程的 ThreadLocal，JdbcTemplate、MyBatis 优先使用这个连接，所以方法中的 SQL 都在同一个事务里；方法正常返回则提交，抛出符合规则的异常则回滚，最后恢复连接设置并归还。
3. 不经过代理：自调用、对象不是 Spring 管理的；无法代理：CGLIB 无法重写 final、static、private 方法，JDK 动态代理只拦截接口中声明的方法；异常没有传到代理：被捕获后未重新抛出；不符合回滚规则：抛出受检异常而没配 rollbackFor；不在事务连接上：新线程中操作数据库、引擎不支持事务（MyISAM）。

</details>

动手：写一个类，在方法 a() 中调用本类带 @Transactional 的方法 b()，验证 b() 的事务没有生效，再按[自调用](Spring.md#自调用)一节的方法修复。

预期：从外部调用 a()，b() 写入数据后抛出 RuntimeException，数据没有回滚，把 b() 移到另一个 Bean（或通过注入的自身代理调用）后，同样的异常使写入被回滚。

算法（动态规划，简单）：[121. 买卖股票的最佳时机](https://leetcode.cn/problems/best-time-to-buy-and-sell-stock/)，题解见[买卖股票最大的收益](Leetcode%20题解%20-%20贪心思想.md#5-买卖股票最大的收益)。

明天：第 51 天，Spring Boot、Spring MVC 与 MyBatis（Spring：Spring Boot 自动配置～Spring 中的设计模式）。

### 第 51 天：Spring Boot、Spring MVC 与 MyBatis

自动配置是 Spring Boot 的核心，启动流程说明了自动配置、内嵌的 Tomcat 和 Runner 分别在哪一步执行。MyBatis 一节中 #{} 和 ${} 的区别与 SQL 注入有关。

阅读：《Spring》从[Spring Boot 自动配置](Spring.md#四spring-boot-自动配置)读到[Spring 中的设计模式](Spring.md#七spring-中的设计模式)。

自测：

1. Spring Boot 的自动配置是怎样实现的？（见[Spring Boot 自动配置](Spring.md#四spring-boot-自动配置)）
2. Spring MVC 处理一个请求的过程是怎样的？（见[请求的处理过程](Spring.md#请求的处理过程)）
3. MyBatis 中 #{} 和 ${} 有什么区别？（见[#{} 和 ${} 的区别](Spring.md#-和--的区别)）

<details>
<summary>参考要点</summary>

1. @SpringBootApplication 包含 @EnableAutoConfiguration；启动时读取各 jar 中 META-INF/spring/...AutoConfiguration.imports（2.7 之前为 spring.factories）列出的自动配置类；大多数自动配置类带 @ConditionalOnClass、@ConditionalOnMissingBean 等条件注解，条件满足才生效；自动配置在用户的 Bean 注册之后处理，用户定义的 Bean 优先。
2. DispatcherServlet 统一接收请求，HandlerMapping 找到处理方法和拦截器；依次执行拦截器的 preHandle，返回 false 就停止；HandlerAdapter 转换参数、调用 Controller，再把返回值转换为响应（如 JSON）；倒序执行 postHandle（Controller 抛出异常时跳过）；返回视图名时由 ViewResolver 渲染；最后倒序执行 preHandle 返回 true 的拦截器的 afterCompletion，异常时也执行。
3. #{} 被替换为占位符 ?，参数通过 PreparedStatement 单独传给数据库，不会改变 SQL 结构；${} 把参数直接拼进 SQL，传入 1024 OR 1=1 就让条件恒为真，造成 SQL 注入；${} 只用于表名、列名、ORDER BY 字段，并用白名单校验。

</details>

动手：新建一个 Spring Boot 3 项目，启动时加上 --debug，在条件评估报告中找到 DataSourceAutoConfiguration 生效或不生效的原因。

预期：CONDITIONS EVALUATION REPORT 中，没有 JDBC 相关依赖时 DataSourceAutoConfiguration 在 Negative matches 中，原因是 @ConditionalOnClass 找不到所需的类，引入 spring-boot-starter-jdbc 和数据库驱动后出现在 Positive matches 中。

算法（动态规划，简单）：[70. 爬楼梯](https://leetcode.cn/problems/climbing-stairs/)，题解见[爬楼梯](Leetcode%20题解%20-%20动态规划.md#1-爬楼梯)。

明天：第 52 天，设计模式（设计模式 - 目录：设计模式前言；设计模式  - 单例：单例（Singleton）；设计模式 - 策略：策略（Strategy）；面向对象思想：设计原则）。

### 第 52 天：设计模式

先看前言中下单流程用到的几种模式，再读单例和策略两篇。设计原则说明了这些模式背后的目标。

阅读：《设计模式 - 目录》的[设计模式前言](设计模式%20-%20目录.md#一前言)；《设计模式  - 单例》的[单例（Singleton）](设计模式%20%20-%20单例.md#单例singleton)；《设计模式 - 策略》的[策略（Strategy）](设计模式%20-%20策略.md#9-策略strategy)；《面向对象思想》的[设计原则](面向对象思想.md#三设计原则)。选读：[工厂方法](设计模式%20-%20工厂方法.md)、[代理](设计模式%20-%20代理.md)、[装饰](设计模式%20-%20装饰.md)、[观察者](设计模式%20-%20观察者.md)、[模板方法](设计模式%20-%20模板方法.md)、[责任链](设计模式%20-%20责任链.md)。

自测：

1. 单例模式有哪几种写法？双重检查锁为什么要加 volatile？（见[实现](设计模式%20%20-%20单例.md#实现)）
2. 项目中用过哪些设计模式？举一个例子。（见[项目中的用法](设计模式%20-%20目录.md#项目中的用法)）
3. Spring 中用到了哪些设计模式？（见[Spring 中的设计模式](Spring.md#七spring-中的设计模式)）

<details>
<summary>参考要点</summary>

1. 写法有懒汉式（线程不安全）、饿汉式、方法加 synchronized、双重校验锁、静态内部类、枚举（还能防反射和反序列化）；new Singleton() 分为分配内存、初始化、赋值给引用三步，可能被重排序为先赋值再初始化，另一个线程在外层判空时就会拿到未初始化的对象，volatile 禁止这种重排序。
2. 例如下单校验用责任链：参数、限购、黑名单、库存各写一个 OrderValidator 实现类，用 @Order 排序，OrderService 注入 List 依次调用，不通过就抛异常；新增校验只需再写一个实现类，OrderService 不用改；类似地，运费和支付渠道用策略加工厂，支付成功后的通知用观察者。
3. 工厂（BeanFactory、FactoryBean）和单例（默认的 singleton 作用域）；代理：AOP 的 JdkDynamicAopProxy、CglibAopProxy；模板方法：JdbcTemplate、TransactionTemplate；还有观察者（ApplicationEvent、@EventListener）、适配器（HandlerAdapter）、责任链（拦截器链）和策略（InstantiationStrategy）。

</details>

动手：把一段按支付方式（微信、支付宝、银行卡）分支的 if-else 改写成策略模式，并用 Spring 的 Map<String, PayStrategy> 注入所有实现。

预期：每种支付方式一个 PayStrategy 实现类，用 @Component("WECHAT") 这样的名称标注，注入的 Map 以 Bean 名称为 key，按支付方式取出策略调用、未知方式抛异常，结果与原 if-else 一致，新增支付方式只需加一个类。

算法（动态规划，中等）：[53. 最大子数组和](https://leetcode.cn/problems/maximum-subarray/)，题解见[子数组最大的和](Leetcode%20题解%20-%20贪心思想.md#10-子数组最大的和)。

综合题：用户下单接口中，Controller 调用 Service，Service 带有 @Transactional 并调用了日志切面：从请求到达 DispatcherServlet 到事务提交，依次经过了哪些对象和代理？（见[请求的处理过程](Spring.md#请求的处理过程)、[动态代理](Spring.md#动态代理)、[事务的实现原理](Spring.md#事务的实现原理)）

<details>
<summary>答题思路</summary>

1. DispatcherServlet 收到请求，HandlerMapping 找到 Controller 方法和拦截器，执行 preHandle，HandlerAdapter 转换参数后调用 Controller。
2. Controller 中注入的 Service 是代理对象（Spring Boot 默认为 CGLIB 子类），调用先进入代理，按 @Order 执行通知链，事务切面默认优先级最低，日志切面指定了 @Order(1) 这类较小的值时在外层，事务在日志切面里面（都不指定时先后不确定）。
3. TransactionInterceptor 让事务管理器取连接、关闭自动提交并绑定到当前线程，再调用原始 Service 对象的方法，其中的 SQL 都用这个连接。
4. 方法正常返回则提交（运行时异常则回滚），归还连接，再执行日志切面的后置逻辑。
5. 正常返回 Controller 后，HandlerAdapter 把返回值写成 JSON，倒序执行 postHandle、afterCompletion；异常传出 Controller 时跳过 postHandle，仍执行 preHandle 返回 true 的拦截器的 afterCompletion。

</details>

明天：第 53 天，微服务（微服务：从单体到微服务～网关）。

## 十三、分布式与消息队列

### 第 53 天：微服务

按拆分、组件、注册中心、服务调用、网关的顺序读。服务调用一节回答了实例下线和注册中心宕机时会发生什么。

阅读：《微服务》从[从单体到微服务](微服务.md#一从单体到微服务)读到[网关](微服务.md#五网关)。选读：[配置中心](微服务.md#六配置中心)、[链路追踪](微服务.md#八链路追踪)、[负载均衡](集群.md#一负载均衡)。

自测：

1. Spring Cloud 有哪些常用组件？（见[组件](微服务.md#组件)）
2. 注册中心宕机后，服务之间还能调用吗？（见[注册中心宕机](微服务.md#注册中心宕机)）
3. 有哪些负载均衡策略？（见[负载均衡策略](微服务.md#负载均衡策略)）

<details>
<summary>参考要点</summary>

1. 注册与配置：Nacos，或 Eureka 加 Spring Cloud Config；负载均衡和调用：Spring Cloud LoadBalancer、OpenFeign；网关和熔断：Spring Cloud Gateway、Resilience4j 或 Sentinel；分布式事务和链路追踪：Seata、Micrometer Tracing。
2. 已经运行的服务还能调用，实例列表缓存在本地；新启动的服务默认注册失败直接退出，关闭 fail-fast 能启动，但没有实例列表，调用报 No servers available；所以不会立刻影响线上调用，但无法扩容和发布，生产环境要集群部署。
3. Spring Cloud LoadBalancer 默认轮询，也可以改为随机，两者都不考虑机器差异；启用 NacosLoadBalancer 后优先选同集群的实例，再按权重随机（权重 3:1 时 400 次约为 303:97）；还可以实现 ReactorServiceInstanceLoadBalancer 自定义规则。

</details>

算法（动态规划，中等）：[5. 最长回文子串](https://leetcode.cn/problems/longest-palindromic-substring/)，题解见[最长回文子串](Leetcode%20题解%20-%20字符串.md#10-最长回文子串)。

明天：第 54 天，分布式锁（分布式：分布式锁）。

### 第 54 天：分布式锁

三种实现各有代价：数据库简单但性能低，Redis 快但要处理过期和续期，ZooKeeper 可靠但写入要同步到多数节点、性能较低。重点是 Redis 的实现和 Redisson 的看门狗；RedLock 一节说明了带过期时间的锁为什么仍可能被两个客户端同时持有，以及怎样用栅栏令牌兜底。

阅读：《分布式》的[分布式锁](分布式.md#一分布式锁)。

自测：

1. 用 Redis 怎样实现分布式锁？为什么加锁和设置过期时间要用一条命令？（见[Redis 的 SET NX 指令](分布式.md#redis-的-set-nx-指令)）
2. 锁过期了业务还没执行完怎么办？（见[Redis 的 SET NX 指令](分布式.md#redis-的-set-nx-指令)）
3. 数据库、Redis、ZooKeeper 三种实现怎样选择？（见[三种实现的对比](分布式.md#三种实现的对比)）

<details>
<summary>参考要点</summary>

1. 用 SET lock_key unique_value NX PX 30000 加锁，键不存在才成功，并同时设置过期时间；释放时用 Lua 脚本先比较 value 再删除，避免误删别人的锁；分成 SETNX 和 EXPIRE 两条命令时，执行完 SETNX 后进程崩溃，锁就永远不会过期。
2. 过期时间取正常耗时的几倍，难以估计时由后台线程续期，例如 Redisson 看门狗：lock() 不指定过期时间时先设 30 秒，每 10 秒检查一次，锁仍是自己的就重置为 30 秒，进程崩溃后最多 30 秒释放；锁内操作都要设超时，否则卡住的线程会被一直续期；GC 暂停时仍可能两个客户端同时持锁，要用递增的栅栏令牌拒绝旧写入。
3. 数据库：实现简单，性能低；Redis：性能最高，适合高并发，但主从切换、进程暂停时可能两个客户端同时持锁；ZooKeeper：写入要同步到多数节点，性能较低但更可靠，还能提供栅栏令牌，适合一致性要求高、并发不大的场景。

</details>

动手：按[附录 A3](分布式.md#a3-redisson-的可重入与看门狗)的方法，观察 Redisson 的锁在业务执行期间是怎样自动续期的。

预期：lock() 后 PTTL 约 30000 并逐渐减小，约每 10 秒被重置回 30 秒附近，持有 30 秒锁一直存在，lock(10s) 不续期、约 10 秒后键消失，进程崩溃后约 30 秒过期，其它客户端能拿到锁。

算法（动态规划，中等）：[300. 最长递增子序列](https://leetcode.cn/problems/longest-increasing-subsequence/)，题解见[最长递增子序列](Leetcode%20题解%20-%20动态规划.md#1-最长递增子序列)。

明天：第 55 天，分布式事务与 CAP（分布式：分布式事务～BASE）。

### 第 55 天：分布式事务与 CAP

2PC 让所有参与者一起提交或回滚，代价是参与者要持有锁等待协调者；TCC、Saga 和本地消息表用最终一致换取可用性。CAP 一节说明了为什么出现网络分区时只能在一致性和可用性之间选择。

阅读：《分布式》从[分布式事务](分布式.md#二分布式事务)读到[BASE](分布式.md#四base)。选读：[Paxos](分布式.md#五paxos)、[Raft](分布式.md#六raft)。

自测：

1. 2PC 有什么问题？（见[2PC](分布式.md#2pc)）
2. TCC 和本地消息表分别适合什么场景？（见[TCC](分布式.md#tcc)、[本地消息表](分布式.md#本地消息表)）
3. 什么是 CAP？为什么分区容忍性必须满足？（见[CAP](分布式.md#三cap)）

<details>
<summary>参考要点</summary>

1. 同步阻塞：参与者准备后一直持有锁，等待协调者的决定；单点问题：协调者在提交阶段故障时，已同意的参与者既不能提交也不能回滚，只能等待；数据不一致：协调者只发出部分 Commit 就崩溃；太过保守：准备阶段任一参与者失败、回复中止或超时，整个事务都要回滚；用数据库的 XA 实现时每个参与者都要支持 XA，Redis、Kafka、RocketMQ 和一般的 HTTP 接口无法直接参与。
2. TCC 由业务实现 Try（预留资源，如冻结库存）、Confirm、Cancel，不长期持有数据库锁，适合一致性要求较高、能改造出三个接口的资源操作，如库存、资金；本地消息表把消息和业务数据写在同一个本地事务中，再投递给对方幂等执行，失败只能重试，适合能接受最终一致的后续操作，如下单后发券、加积分。
3. C 指线性一致性，A 指发给未故障节点的请求都能在有限时间内得到非错误响应，P 指出现网络分区时系统仍能运行；网络不可靠，分区无法避免，所以 P 必须满足，CAP 实际是分区发生时在 C 和 A 之间选择：拒绝请求（CP，如 ZooKeeper）或返回可能过期的数据（AP，如 Eureka）；没有分区时 C 和 A 可以兼得。

</details>

算法（动态规划，中等）：[1143. 最长公共子序列](https://leetcode.cn/problems/longest-common-subsequence/)，题解见[最长公共子序列](Leetcode%20题解%20-%20动态规划.md#1-最长公共子序列)。

明天：第 56 天，RPC、分布式 ID 与幂等（分布式：RPC～幂等）。

### 第 56 天：RPC、分布式 ID 与幂等

RPC 一节对比了它和 HTTP 的取舍。雪花算法要注意时钟回拨；幂等是重试、重复提交和重复消费的共同解法。

阅读：《分布式》从[RPC](分布式.md#七rpc)读到[幂等](分布式.md#九幂等)。选读：[分布式定时任务](分布式.md#十分布式定时任务)。

自测：

1. RPC 和 HTTP 有什么区别？（见[RPC 与 HTTP](分布式.md#rpc-与-http)）
2. 雪花算法是怎样生成 ID 的？时钟回拨怎么办？（见[雪花算法](分布式.md#雪花算法)）
3. 怎样保证接口的幂等？（见[幂等](分布式.md#九幂等)）

<details>
<summary>参考要点</summary>

1. HTTP 是协议，RPC 是调用方式，RPC 可以基于自定义 TCP 协议（Dubbo）或 HTTP（gRPC 基于 HTTP/2）；内部服务多用 RPC 框架：序列化更紧凑（同样的参数 Protobuf 5 字节、JSON 25 字节）、长连接复用、内置服务治理、按接口生成代码；HTTP + JSON 通用、可读，适合对外接口。
2. 64 位依次为 1 位符号位、41 位毫秒时间戳、10 位机器 ID、12 位序号，同一毫秒内序号递增，4096 个用完就等到下一毫秒；时钟回拨几毫秒时等时钟追上（Leaf 在 5 ms 以内等待两倍的差值），较大时报错并摘除实例；lastTime 只在内存中，重启后发现不了回拨，要把时间持久化，例如 Leaf 每 3 秒把本机时间写入 ZooKeeper，启动时本机时间比记录的还早就不启动；机器 ID 在启动时从 ZooKeeper、数据库等领取。
3. 先确定幂等键：客户端在确认页生成 request_id，重试都带着它，或用业务唯一标识（如支付交易号）；判断和处理要原子：唯一索引（重复插入报 1062，返回第一次的结果）、状态机条件更新、版本号乐观锁（重试沿用第一次读到的版本号）、Token（DEL 返回 1 才处理，只能挡住重复点击，最终去重仍靠业务唯一约束）；先查再插、分布式锁都不能代替幂等。

</details>

动手：按[附录 A4](分布式.md#a4-重复提交与唯一索引)的步骤，用唯一索引拦住重复提交的订单。

预期：每轮 10 个线程并发提交同一个 request_id，先查后插的写法每轮创建 2～3 个订单，直接 INSERT 依靠唯一索引时每轮只创建 1 个，其余 9 次报错 1062。

算法（动态规划，中等）：[322. 零钱兑换](https://leetcode.cn/problems/coin-change/)，题解见[找零钱的最少硬币数](Leetcode%20题解%20-%20动态规划.md#4-找零钱的最少硬币数)。

明天：第 57 天，消息队列的作用与可靠性（消息队列：消息模型～消息队列的可靠性）。

### 第 57 天：消息队列的作用与可靠性

先看消息队列用来做什么，以及它和 RPC 调用怎样选择。可靠性要分发送端、队列和接收端三段来看。

阅读：《消息队列》从[消息模型](消息队列.md#一消息模型)读到[消息队列的可靠性](消息队列.md#三可靠性)。

自测：

1. 消息队列有什么作用？什么时候用 RPC，什么时候用消息队列？（见[使用场景](消息队列.md#二使用场景)、[与 RPC 调用的区别](消息队列.md#与-rpc-调用的区别)）
2. 怎样保证消息不丢失？（见[消息队列的可靠性](消息队列.md#三可靠性)）
3. 怎样避免重复消费？（见[接收端的可靠性](消息队列.md#接收端的可靠性)）

<details>
<summary>参考要点</summary>

1. 作用：异步处理（注册后发验证邮件）、流量削峰（消费者按处理能力拉取）、应用解耦（支付成功发一条消息，积分、物流、短信各自订阅）；下一步依赖调用结果、被调用方不可用时调用方也应失败，用 RPC，如支付前扣库存；结果可以稍后产生或有多个接收方，用消息队列，如支付后加积分。
2. 发送端：等待确认并重试（Kafka 用 acks=all，检查回调，退出前 flush），要与业务一致时用本地消息表或事务消息；存储端：持久化加多副本（min.insync.replicas，不允许落后副本当选 Leader）；消费端：处理完再提交偏移量或 ack；关键业务再定期对账补发。
3. 处理完才确认，崩溃后会重复投递，所以消费逻辑要幂等：用业务唯一标识（订单号加事件类型，不用消息 ID）作去重键，在同一个本地事务中先写去重表再执行业务，主键冲突就直接确认；有状态的业务用条件更新（WHERE status = 'UNPAID'）；Kafka 的恰好一次不能代替业务幂等。

</details>

动手：阅读[附录 A2](消息队列.md#a2-重复消费)，说出消费者在哪一步被杀死导致了重复扣款，再按[接收端的可靠性](消息队列.md#接收端的可靠性)一节的方法设计去重。

预期：消费者完成 3 笔扣款后、自动提交偏移量（默认每 5 秒）之前被 kill -9，组的偏移量仍为空，约 45 秒后重启的消费者又收到这 3 条消息、重复扣款，去重方法是在同一个本地事务中先插入去重表（键如 order:1024:pay）再扣款，重复消息报 1062 后回滚并直接确认。

算法（动态规划，中等）：[64. 最小路径和](https://leetcode.cn/problems/minimum-path-sum/)，题解见[矩阵的最小路径和](Leetcode%20题解%20-%20动态规划.md#1-矩阵的最小路径和)。

明天：第 58 天，顺序、积压与延迟消息（消息队列：顺序性～延迟消息与死信队列）。

### 第 58 天：顺序、积压与延迟消息

顺序只在单个分区（队列）内成立，同一订单的消息要靠发送端按 key 路由、接收端单线程消费才能保持有序。处理积压前先区分是生产突增还是消费变慢；延迟消息一节以订单 30 分钟未支付自动取消为例。

阅读：《消息队列》从[顺序性](消息队列.md#四顺序性)读到[延迟消息与死信队列](消息队列.md#六延迟消息与死信队列)。

自测：

1. 怎样保证消息按顺序消费？（见[顺序性](消息队列.md#四顺序性)）
2. 消息大量积压时怎样处理？（见[消息堆积](消息队列.md#五消息堆积)）
3. 怎样实现订单 30 分钟未支付自动取消？（见[延迟消息](消息队列.md#延迟消息)）

<details>
<summary>参考要点</summary>

1. 消息队列只保证单个队列（Kafka 的分区）内有序；发送端按业务 Key（如订单号）把同一业务的消息发到同一个队列；接收端一个队列只由一个线程顺序消费，Kafka 中一个分区只分给组内一个消费者，RabbitMQ 用单个消费者或单活跃消费者；生产者重试可能让后发的消息先写入，Kafka 默认开启的幂等生产者用序号避免了这种乱序；分区数改变后同一 key 可能落到别的分区，要预先规划分区数。
2. 先区分生产突增（峰值后可自然消化）还是消费变慢（下游变慢、反复重试、频繁重平衡），先修复消费变慢的原因，失败消息转入死信队列；扩容消费者（Kafka 普通消费者组、RocketMQ 4.x 中超过分区或队列数的消费者会空闲），或批量写库、线程池并行（同一 key 交给同一线程）；分区不够时转发到分区更多的新主题，不重要的消息降级跳过；积压接近保留时间（Kafka 默认 7 天）前先转存。
3. 下单时发一条 30 分钟后投递的延迟消息，到期后消费者用条件更新取消订单（WHERE status = 'UNPAID'），重复或晚到的消息不会取消已支付的订单，要求高的业务再用低频扫描兜底；用户已付款、回调还没到时本地仍是待支付，所以取消前要先向支付平台关单，平台返回已支付就按支付成功处理；RocketMQ 4.x 有 30m 延迟级别，5.x 可指定任意时间，RabbitMQ 用 TTL 加死信队列；也可以用 Redis 有序集合，分值为到期时间，后台线程取到期成员，多实例用 ZREM 返回 1 决定由谁处理。

</details>

动手：按[附录 A3](消息队列.md#a3-消费积压)的输出，说出每个分区积压了多少条消息，LAG 一列是怎样算出来的。

预期：分区 0、1、2 分别积压 9237、9577、8186 条，LAG = LOG-END-OFFSET - CURRENT-OFFSET（日志末尾偏移量减去组已提交的偏移量），例如 11186 - 3000 = 8186。

算法（动态规划，中等）：[198. 打家劫舍](https://leetcode.cn/problems/house-robber/)，题解见[强盗抢劫](Leetcode%20题解%20-%20动态规划.md#2-强盗抢劫)。

明天：第 59 天，Kafka（消息队列：Kafka）。

### 第 59 天：Kafka

开头对比了 Kafka、RabbitMQ 和 RocketMQ 的存储、消费方式和选型，之后按分区与消费者组、副本、存储、吞吐量的顺序读。副本与可靠性一节说明了 acks、ISR 和 min.insync.replicas 怎样配合保证消息不丢。

阅读：《消息队列》的[Kafka](消息队列.md#七kafka)。

自测：

1. Kafka 为什么吞吐量高？（见[为什么吞吐量高](消息队列.md#为什么吞吐量高)）
2. Kafka 的副本机制怎样保证可靠性？（见[副本与可靠性](消息队列.md#副本与可靠性)）
3. 消费者组中的消费者比分区多时会怎样？（见[分区与消费者组](消息队列.md#分区与消费者组)）

<details>
<summary>参考要点</summary>

1. 顺序写和页缓存：消息只追加到日志末尾，写入页缓存即可，不要求每条消息刷盘，确认条件仍由 acks 决定，可靠性靠多副本；批量：同一分区的消息攒成批次传输、写入和复制，关闭批量后吞吐从每秒约 6 万条降到约 6600 条；零拷贝：broker 用 sendfile 把日志直接发到 Socket；分区并行：多个分区分布在不同 broker 上。
2. 每个分区有一个 Leader 和多个 Follower，与 Leader 保持同步的副本组成 ISR，Leader 故障时从 ISR 中选新 Leader；生产者设 acks=all，ISR 中的副本都写入才确认；配合 min.insync.replicas=2，ISR 不足时拒绝写入，常用 3 副本加这两项配置；幂等生产者用生产者 ID 和序号去掉重试造成的重复。
3. 组内每个分区只分配给一个消费者，多出来的消费者分不到分区，只能空闲，例如 3 个分区启动 4 个消费者，其中一个分到 0 个分区；分区数决定了一个组的最大消费并行度；Kafka 4.2 起的共享组没有这个限制，但不保证顺序。

</details>

动手：阅读[附录 A1](消息队列.md#a1-批量对吞吐量的影响)，说明关闭批量（batch.size=0）后吞吐量和延迟怎样变化，为什么。

预期：默认配置（批量）每秒约 5.7 万～6.8 万条、平均延迟 21～54 ms；batch.size=0、linger.ms=0 关闭批量后每秒只有约 6500～6800 条，平均延迟升到约 1.4 秒；原因是每条消息单独成为一个批次，网络请求、写日志和副本复制的次数大幅增加，发不出去的请求在生产者端排队，所以吞吐下降的同时延迟也升高。

算法（双指针，困难）：[42. 接雨水](https://leetcode.cn/problems/trapping-rain-water/)，题解见[接雨水](Leetcode%20题解%20-%20双指针.md#9-接雨水)。

综合题：下单后需要扣库存、发优惠券、发短信：哪些步骤放在同一个事务中，哪些通过消息队列异步完成？消息丢失或重复时分别会怎样？（见[异步处理](消息队列.md#异步处理)、[本地消息表](分布式.md#本地消息表)、[幂等](分布式.md#九幂等)）

<details>
<summary>答题思路</summary>

1. 同步：创建订单和扣库存决定下单是否成功，同一个库时放在一个本地事务中，跨服务时用 RPC 并配合 TCC 等分布式事务。
2. 异步：发券、发短信不影响下单结果，在下单事务中写本地消息表（或用 RocketMQ 事务消息），提交后投递到消息队列，由各自的消费者处理。
3. 丢失：事务提交后直接发消息可能失败，导致没发券、没短信；本地消息表会不断重发，消费端处理完再提交偏移量，再加对账补发。
4. 重复：重发和消费者崩溃都会重复投递，可能重复发券、发短信；消费者以“订单号加事件类型”为幂等键，发券时去重记录与发券在同一个本地事务中写入，调用短信服务时把幂等键传给下游去重。
5. 下游失败时订单已提交、无法回滚，只能重试或人工处理，所以只有允许最终一致的步骤才异步化。

</details>

明天：第 60 天，性能与可用性（系统设计基础：性能～安全性）。

## 十四、系统设计

### 第 60 天：性能与可用性

性能指标中的分位数比平均值更能反映用户的感受。限流、降级与熔断一节较长，三者的区别和各自的触发条件是重点；安全性中的接口防刷以短信验证码为例，把限流用在了具体的接口上。

阅读：《系统设计基础》从[性能](系统设计基础.md#一性能)读到[安全性](系统设计基础.md#五安全性)。选读：[集群下的 Session 管理](集群.md#二集群下的-session-管理)。

自测：

1. 常用的限流算法有哪些？分别有什么特点？（见[限流算法](系统设计基础.md#1-限流算法)）
2. 限流、熔断和降级有什么区别？熔断器怎样从打开恢复到关闭？（见[限流、降级与熔断](系统设计基础.md#限流降级与熔断)、[熔断](系统设计基础.md#3-熔断)）
3. QPS、TPS 和 TP99 分别是什么意思？（见[性能指标](系统设计基础.md#性能指标)）

<details>
<summary>参考要点</summary>

1. 固定窗口：每个窗口一个计数器，最简单，但窗口边界处最多放行 2 倍；滑动窗口：统计往前一个窗口内的请求，精确，但每个请求存一条记录；漏桶：排队后按固定速率处理，最平滑，突发要等待，适合保护处理能力固定的下游；令牌桶：按固定速率放令牌，允许不超过桶容量的突发，Guava RateLimiter 按这种方式实现，它还让当前请求先通过、把欠下的等待算到下一个请求上。
2. 限流保护自己，拒绝超出处理能力的请求；熔断针对下游，持续失败时暂停调用，避免线程被拖住、故障扩散；降级决定这时返回什么，如缓存、默认值或关闭非核心功能；熔断器失败率达到阈值时打开，打开一段时间后的下一次调用使其进入半开，放行少量试探请求，失败率低于阈值则关闭，否则重新打开。
3. QPS 是每秒处理的请求数，衡量吞吐量；TPS 是每秒处理的事务数，一个事务可能包含多次请求或多条 SQL；TP99 是响应时间的 99 分位，即 99% 的请求不超过这个时间，比平均值更能反映慢请求。

</details>

动手：运行[附录 A14](系统设计基础.md#a14-guava-的-ratelimiter)的代码，比较 acquire() 和 tryAcquire() 在令牌不足时的行为。

预期：新建后连续 acquire() 第 1 次不等待、之后每次等待约 0.2 秒，空闲 2 秒后前 6 次都不等待、第 7 次等待约 0.2 秒，令牌不足时 tryAcquire() 立即返回 false。

算法（滑动窗口，困难）：[239. 滑动窗口最大值](https://leetcode.cn/problems/sliding-window-maximum/)，题解见[剑指 Offer 59](59.%20滑动窗口的最大值.md)。

明天：第 61 天，秒杀与抢红包（系统设计基础：秒杀系统）。

### 第 61 天：秒杀与抢红包

秒杀把前面学过的缓存、消息队列和数据库锁组合在一起。防止超卖和库存一致两节回答了最常见的追问；红包和抽奖是同类场景。

阅读：《系统设计基础》的[秒杀系统](系统设计基础.md#六秒杀系统)。

自测：

1. 秒杀系统怎样防止超卖？悲观锁、乐观锁和条件更新各有什么问题？（见[防止超卖的几种做法](系统设计基础.md#防止超卖的几种做法)）
2. Redis 预扣库存成功、订单却创建失败，怎样保证两边一致？（见[Redis 与数据库的库存一致](系统设计基础.md#redis-与数据库的库存一致)）
3. 抢红包时金额怎样拆分？（见[抢红包](系统设计基础.md#3-抢红包)）

<details>
<summary>参考要点</summary>

1. 让“判断库存”和“扣减库存”成为一个整体；悲观锁 FOR UPDATE 正确，但锁持有到事务提交，其它请求排队；乐观锁同时读到同一版本的请求只有一个成功，有库存也会失败（150 人抢 100 件，重试 3 次也只卖出 48～57 件），适合冲突少的场景；条件更新 WHERE stock > 0 不需重试，但同一行更新仍串行，所以先用 Redis 挡住大部分请求，条件更新作为最后防线。
2. 以数据库的库存和订单为准，Redis 库存只是闸门，允许暂时少卖，数据库条件更新始终保留；发送消息明确失败时执行反向脚本回补，发送超时（消息可能已送达）或应用宕机交给对账，也可以用事务消息；订单因业务原因失败时回补 Redis，异常失败靠消息重试，唯一索引防止重复建单；回补先 SREM 已购集合、返回 1 才加库存，允许再次抢购时还要核对请求 ID；Redis 主从切换丢失扣减时由数据库兜底，因数据库库存不足失败的请求，确认这个用户没有订单后只移出已购集合、不加回库存；活动后对账。
3. 金额用整数分表示；二倍均值法：剩余 R 分、还有 k 份时，本份在 1 到 2R ÷ k − 1 分之间均匀随机，最后一份拿走剩余全部，每份至少 1 分；每个位置的期望相同，越靠后波动越大；可以发红包时预先拆好放入 Redis 列表，抢时 LPOP。

</details>

动手：按[附录 A1](系统设计基础.md#a1-秒杀)的方法，分别用 Lua 脚本和先 GET 再 DECR 的写法并发扣减 100 件库存，核对成功次数是否超过 100、剩余库存是否变为负数。

预期：Lua 脚本成功 100、库存不足 1800、重复购买 100、剩余库存 0，没有超卖；先 GET 再 DECR 时成功 106～114 次、剩余库存 -6～-14，出现超卖。

算法（滑动窗口，困难）：[76. 最小覆盖子串](https://leetcode.cn/problems/minimum-window-substring/)，题解见[最小覆盖子串](Leetcode%20题解%20-%20双指针.md#10-最小覆盖子串)。

明天：第 62 天，海量数据、短链与 Feed 流（系统设计基础：海量数据处理～Feed 流）。

### 第 62 天：海量数据、短链与 Feed 流

这三章都是常见的场景题。海量数据处理的思路是分而治之；短链重点看短码怎样生成、跳转用 301 还是 302，Feed 流重点看推拉模式的取舍和游标分页。

阅读：《系统设计基础》从[海量数据处理](系统设计基础.md#七海量数据处理)读到[Feed 流](系统设计基础.md#九feed-流)。

自测：

1. 100 GB 的日志中每行是一个 URL，内存只有 4 GB，怎样找出出现次数最多的 10 个？（见[出现次数最多的 K 个](系统设计基础.md#出现次数最多的-k-个)）
2. 短链跳转用 301 还是 302？（见[跳转用 301 还是 302](系统设计基础.md#跳转用-301-还是-302)）
3. Feed 流用推模式还是拉模式？（见[拉模式与推模式](系统设计基础.md#拉模式与推模式)）

<details>
<summary>参考要点</summary>

1. 按 hash(url) % 100 切成 100 个约 1 GB 的小文件，相同的 URL 一定在同一个文件中；逐个文件用 HashMap 统计次数，用小顶堆取出前 10 个；再用小顶堆从 100 × 10 个候选中选出全局前 10 个；某个文件中不同的 URL 仍然太多、HashMap 放不下时，换哈希函数对它再切分。
2. 301 永久跳转，没有缓存指令时也可能被浏览器缓存，之后不再请求短链服务，已缓存的跳转无法撤回；302 临时跳转，默认不缓存，统计点击时再加 Cache-Control: private, no-store；需要统计点击、修改目标地址或设置有效期时用 302，只想减轻服务端压力时用 301。
3. 拉模式（读扩散）发帖只写一次，读时合并所有关注者的发件箱，关注越多读越慢；推模式（写扩散）发帖写入每个粉丝的收件箱，读很快，但粉丝越多写越多（1000 万粉丝单节点约 50 秒）；实际推拉结合：普通用户推，大 V 由粉丝读时拉取合并，只推给活跃粉丝，收件箱只保留最近若干条。

</details>

动手：阅读[附录 A2](系统设计基础.md#a2-短链跳转)，说明浏览器第二次访问返回 301 的短链时为什么没有请求服务器，这对统计点击量有什么影响。

预期：301 的响应被浏览器缓存，第二次访问 /a 时浏览器直接请求 /target，服务器只收到一次 /a，而 302 的 /b 两次都到达服务器，所以 301 会漏掉后续点击，需要统计点击量时用 302。

算法（链表，困难）：[25. K 个一组翻转链表](https://leetcode.cn/problems/reverse-nodes-in-k-group/)，题解见[K 个一组翻转链表](Leetcode%20题解%20-%20链表.md#11-k-个一组翻转链表)。

明天：第 63 天，高并发系统的设计（系统设计基础：高并发系统的设计）。

### 第 63 天：高并发系统的设计

本章以一个具体的系统为例，从容量估算讲到读写路径和压测。读时把每一步和前面学过的组件对应起来。

阅读：《系统设计基础》的[高并发系统的设计](系统设计基础.md#十高并发系统的设计)。

自测：

1. 设计一个系统前，怎样估算需要的机器和存储？（见[容量估算](系统设计基础.md#容量估算)、[分库分表的时机](系统设计基础.md#3-分库分表的时机)、[压测与容量规划](系统设计基础.md#压测与容量规划)）
2. QPS 突然增长到原来的 10 倍，应该先做什么？（见[QPS 突增 10 倍时先做什么](系统设计基础.md#qps-突增-10-倍时先做什么)）
3. 怎样做压测和容量规划？（见[压测与容量规划](系统设计基础.md#压测与容量规划)）

<details>
<summary>参考要点</summary>

1. 先把日流量换算成高峰时的 QPS：日 PV 6 亿平均约 6944 QPS，高峰一小时占 6% 时这一小时平均约 1 万 QPS，大促按 10 倍设计为 10 万，小时内的秒级突发还要留余量；机器数 = 峰值 QPS ÷（单实例拐点 QPS × 目标利用率），再按可用区取整，一个可用区故障时其余实例仍要低于拐点；存储按每天的增量乘以保存时间估算，例如日下单 1200 万、一年约 44 亿行，分库分表主要由数据量决定。
2. 先确认流量性质：看来源 IP、User-Agent 和接口分布，区分真实增长、爬虫和重试风暴；先保护再扩容：网关限流、关闭非核心功能、熔断慢依赖；逐层查看 QPS、CPU、连接池、慢 SQL、Redis 延迟，找出瓶颈；扩容无状态的应用实例，事后复盘更新容量模型。
3. 逐步增加并发，记录吞吐量、P99、错误率和 CPU，找到吞吐不再增长、延迟陡升的拐点，重复多次取中位数；环境、数据量和请求参数的分布要接近生产，读写先分开压再混合，大促前做带标记、写影子库的全链路压测；结论要说明哪一层先到拐点、原因是什么，饱和的资源不一定是根因，例如连接池占满可能是 SQL 在等行锁；实例数 = 峰值 QPS ÷（单实例拐点 × 目标利用率），再用 CPU 使用率校准。

</details>

算法（链表，困难）：[23. 合并 K 个升序链表](https://leetcode.cn/problems/merge-k-sorted-lists/)，题解见[合并 K 个有序链表](Leetcode%20题解%20-%20链表.md#13-合并-k-个有序链表)。

明天：第 64 天，Docker（Docker：解决的问题～镜像与容器）。

### 第 64 天：Docker

一到四章介绍 Docker 解决什么问题，可以快速读过；实现原理一节的命名空间和 cgroup 要细读，它解释了容器为什么比虚拟机轻、隔离性又为什么更弱。镜像与容器一节的 Dockerfile 写法和问题排查是实际工作中最常用的部分。

阅读：《Docker》从[解决的问题](Docker.md#一解决的问题)读到[镜像与容器](Docker.md#六镜像与容器)。

自测：

1. Docker 和虚拟机有什么区别？（见[与虚拟机的比较](Docker.md#二与虚拟机的比较)、[Docker 的实现原理](Docker.md#五实现原理)）
2. 怎样写一个体积小、构建快的 Dockerfile？（见[用 Dockerfile 构建镜像](Docker.md#用-dockerfile-构建镜像)）
3. 容器启动后马上退出，怎样排查？（见[容器的常见问题排查](Docker.md#容器的常见问题排查)）

<details>
<summary>参考要点</summary>

1. 虚拟机模拟硬件并运行完整的操作系统，启动慢，占用大量资源，一台机器只能运行几十个；容器是宿主机上用命名空间隔离、用 cgroup 限制资源的普通进程，启动快，一台机器可运行成千上万个；容器共享宿主机内核，更轻量，但隔离性更弱。
2. 多阶段构建：编译阶段用 Maven 和 JDK，最终阶段只把 jar 复制到 JRE 镜像，镜像从约 680 MB 降到约 236 MB；用 -alpine、-slim 等小的基础镜像，下载、安装和清理写在同一条 RUN 中；变化少的步骤放前面，先复制 pom.xml 下载依赖再复制源码，改源码后重新构建只需约 6 秒；用 .dockerignore 排除 target、.git。
3. 容器跟随 1 号进程，主进程结束容器就退出；用 docker ps -a 看退出码，docker logs 看报错（如 MySQL 没设 MYSQL_ROOT_PASSWORD），docker inspect 看是否 OOMKilled；常见原因还有启动命令把服务放到后台（nginx 没加 daemon off）、缺少依赖库或 CPU 架构不一致。

</details>

动手：为一个 Spring Boot 项目写多阶段构建的 Dockerfile，对比单阶段和多阶段构建的镜像大小。

预期：多阶段构建的镜像只含 JRE 和 jar，约 236 MB，在 Maven 镜像中单阶段构建并运行的镜像约 680 MB，多出了 JDK、Maven 和下载的依赖。

算法（栈和队列，困难）：[32. 最长有效括号](https://leetcode.cn/problems/longest-valid-parentheses/)，题解见[最长有效括号](Leetcode%20题解%20-%20动态规划.md#3-最长有效括号)。

明天：第 65 天，Kubernetes（Docker：Kubernetes）。

### 第 65 天：Kubernetes

Kubernetes 重点看 Pod 的创建过程、Service 和 Ingress 的作用，以及 Pod 异常时怎样排查。

阅读：《Docker》的[Kubernetes](Docker.md#七kubernetes)。选读：[大文件上传](系统设计基础.md#十一大文件上传)、[权限系统](系统设计基础.md#十二权限系统)。

自测：

1. 创建一个 Pod 时，Kubernetes 内部经过了哪些步骤？（见[Pod 的创建过程](Docker.md#pod-的创建过程)）
2. Service 和 Ingress 有什么区别？（见[Service 与 Ingress](Docker.md#service-与-ingress)）
3. Pod 一直处于 CrashLoopBackOff 状态，怎样排查？（见[Pod 异常状态的排查](Docker.md#pod-异常状态的排查)）

<details>
<summary>参考要点</summary>

1. 各组件都通过 API Server 协作：kubectl 提交 Deployment，API Server 校验后写入 etcd；Deployment 和 ReplicaSet 控制器依次创建 ReplicaSet 和未指定节点的 Pod，调度器过滤、打分后把节点写入 nodeName；该节点的 kubelet 通过 CRI 让 containerd 创建沙箱（pause 容器持有网络命名空间，CNI 分配 IP），拉取镜像并启动容器；就绪探针通过后 Pod 变为 Ready，被加入 Service 的后端，kube-proxy 更新转发规则。
2. Service 工作在传输层，用标签选出一组 Pod，提供固定的虚拟 IP 和域名，由 kube-proxy 写成 iptables 或 IPVS 规则转发，有 ClusterIP、NodePort、LoadBalancer 等类型；Ingress 是 HTTP 路由规则，按域名和路径把请求分给不同的 Service，由 Ingress 控制器执行，多个 HTTP 服务共用一个入口。
3. 容器启动后反复退出，重启等待按 10 秒、20 秒、40 秒翻倍，最长 5 分钟；kubectl describe pod 看事件和退出码，kubectl logs --previous 看上一次退出前的日志（如配置错误）；退出码 137、原因 OOMKilled 时检查内存 limits 与 JVM 堆和堆外内存。

</details>

算法（二分查找，困难）：[4. 寻找两个正序数组的中位数](https://leetcode.cn/problems/median-of-two-sorted-arrays/)，题解见[两个有序数组的中位数](Leetcode%20题解%20-%20二分查找.md#7-两个有序数组的中位数)。

明天：第 66 天，系统设计题的思路与即时通讯（系统设计基础：系统设计题的思路～即时通讯）。

### 第 66 天：系统设计题的思路与即时通讯

这两章是开放的设计题。点赞系统演示了回答的顺序：先问清需求、估算规模，再从简单方案出发找瓶颈；即时通讯的重点是消息怎样做到不丢、不重、不乱序，以及一台机器能维持多少个长连接。

阅读：《系统设计基础》从[系统设计题的思路](系统设计基础.md#十三系统设计题的思路)读到[即时通讯](系统设计基础.md#十四即时通讯)。

自测：

1. 面试中遇到“设计一个点赞系统”这类开放题，应该按什么顺序回答？（见[系统设计题的思路](系统设计基础.md#十三系统设计题的思路)）
2. 聊天消息怎样做到不丢失、不重复、不乱序？离线期间的消息怎样补上？（见[消息的可靠投递](系统设计基础.md#消息的可靠投递)）
3. 一台服务器能支撑多少个长连接？瓶颈在哪里？（见[单机能支撑多少连接](系统设计基础.md#单机能支撑多少连接)）

<details>
<summary>参考要点</summary>

1. 先明确需求：要支持的功能、规模和哪些数据不能出错，例如点赞不能重复计、点赞数允许延迟几秒；再估算高峰时的读写量和存储：日活 2000 万、每人每天点赞 5 次时，高峰小时写约 1700 次/秒、读约 3.3 万次/秒，点赞关系每年约 4 TB；然后定义接口和表，(user_id, video_id) 作主键让重复点赞插入失败；先给出单库事务的简单方案，再按估算找瓶颈逐个改进：热门视频的计数行锁改为 Redis 计数加合并写回，读多加缓存，数据量大按 user_id 分片；最后说明哪些数据准确、哪些最终一致，以及 Redis 宕机时怎么办；追问流量再涨 10 倍时，回到估算重新算每一层的量，看哪一层先超过上限。
2. 不丢、不重：发送方为每条消息生成 msg_id，服务端存储后回复 ACK，超时没收到就用同一个 msg_id 重发，服务端用 (sender_id, msg_id) 唯一索引去重；不乱序：服务端为每个会话分配递增的 seq，接收方按 seq 排序，不按各机器的时间；离线：推送只负责通知，接收方记住连续收齐的最大 seq（例如 58），重连时拉取它之后的消息，收到 61 而本地只到 58 时补拉中间的 59、60；用 INCR 分配 seq 时写入失败会留下补不到的空号，后分配的也可能先写入，要求序号连续时在一个事务中把会话的最大序号加 1 并插入消息。
3. TCP 连接由四元组区分，服务端所有连接共用一个监听端口，65535 不是服务端的上限，端口数只限制发起连接的一方（同一个源 IP 到同一个目的地址约 2.8 万个）；服务端的瓶颈是文件描述符（调大 ulimit -n）、内存（实测每个空闲连接约 5 KB，10 万个约 500 MB）以及消息量带来的 CPU 和带宽；用 epoll 一个线程就能管理 10 万个连接，再配合应用层心跳及时清理已经断开的连接。

</details>

动手：按[附录 A21](系统设计基础.md#a21-点赞系统)建 video_like 表，分别用 INSERT 和 INSERT IGNORE 重复点赞同一个视频，比较两者的结果；再用 EXPLAIN 查看查询一页视频是否点过时用到的索引。

预期：第二次 INSERT 报错 ERROR 1062 Duplicate entry '...' for key 'video_like.PRIMARY'；INSERT IGNORE 不报错，影响 0 行；EXPLAIN 中 type 为 ref，按 user_id 等值查找，扫描的行数约等于这个用户点过赞的视频数。

算法（二叉树，困难）：[124. 二叉树中的最大路径和](https://leetcode.cn/problems/binary-tree-maximum-path-sum/)。

明天：第 67 天，订单与支付（系统设计基础：订单与支付）。

### 第 67 天：订单与支付

本章把条件更新、延迟消息和幂等用在订单与支付上，难点是订单服务和支付平台之间没有共同的事务。超时关单的三步和关单与付款同时发生的时序图要细读；对账是前面各环节都漏掉时的兜底；转账一节回到数据库的行锁，可以和秒杀中防止超卖的条件更新对照着看。

阅读：《系统设计基础》的[订单与支付](系统设计基础.md#十五订单与支付)。

自测：

1. 订单超时未支付要自动关闭，关单时用户恰好付了款，怎样保证两边一致？（见[超时关单](系统设计基础.md#超时关单)）
2. 支付回调重复到达或并发到达时，怎样保证只发一次货？（见[支付回调与重复支付](系统设计基础.md#支付回调与重复支付)）
3. A 给 B 转账的同时 B 给 A 转账，怎样避免死锁，又不让余额扣成负数？（见[转账与余额扣减](系统设计基础.md#转账与余额扣减)）

<details>
<summary>参考要点</summary>

1. 关单以支付平台为准，分三步：先用条件更新把订单从待支付改为关单中，影响 0 行就按当前状态处理；再调用平台的关单接口，成功或订单已关闭时改为已关闭，在同一个事务中回补库存；关单失败时查单，已支付就按支付成功处理（与回调走同一段代码），订单不存在可以关闭，结果不明保持关单中，由扫描任务稍后重做；只改本地状态的话，用户打开旧的支付页面仍能付款；下单时把同一个截止时间作为 time_expire 传给平台，否则平台默认 7 天内都能支付；回调在关单中到达时仍然有效。
2. 先验签，核对商户号、订单号、金额与本地订单一致，并确认交易状态是支付成功，再把三件事放在同一个事务中：以交易号为主键插入去重表，重复的通知报 1062 后回滚；用 UPDATE ... WHERE status IN ('UNPAID', 'CLOSING') 改为已支付，影响 1 行才继续；写入发货消息；重复的通知也要应答成功，否则平台会继续重发；先查状态再更新的写法，同一笔通知并发到达 10 次时会发 10 次货。
3. 按账户 ID 从小到大加锁，两个方向的转账都先锁 id 小的行，就不会互相等待（实验中每 480 笔的死锁从约 70～100 次降为 0），只有涉及同一账户的转账在这一行的锁上排队，不是串行化；余额判断写在条件中：UPDATE account SET balance = balance - 100 WHERE id = 1 AND balance >= 100，影响 0 行说明余额不足、回滚，先读出余额在应用中算好再写回会互相覆盖；客户端生成的请求号作主键，死锁回滚或超时重试也只成功一次；每次变动写流水，用期初余额加流水合计核对当前余额。

</details>

动手：阅读[附录 A23](系统设计基础.md#a23-超时关单与支付回调)的输出，说明只改本地状态的写法为什么会出现平台已付、本地已关，先向平台关单、失败只等回调的写法又为什么会有订单停在待支付。

预期：只改本地状态的写法，到期时把订单改为已关闭，但平台上的交易仍然可以支付，用户在关单前后付款时就出现平台已付、本地已关（300 轮中二百多轮），只能退款；先向平台关单、失败只等回调的写法，关单因用户已付款而失败后只等回调，回调又有 10% 丢失，订单就停在待支付（300 轮中二十多轮），要靠查单或对账补上；按三步的写法关单失败时查单，300 轮全部一致。

算法（动态规划，困难）：[72. 编辑距离](https://leetcode.cn/problems/edit-distance/)，题解见[编辑距离](Leetcode%20题解%20-%20动态规划.md#2-编辑距离)。

综合题：设计一个秒杀系统：从页面、网关、服务、缓存、消息队列到数据库，每一层分别做什么来扛住流量、防止超卖？出现故障时怎样降级？（见[秒杀系统](系统设计基础.md#六秒杀系统)、[读路径的逐层分流](系统设计基础.md#读路径的逐层分流)、[限流、降级与熔断](系统设计基础.md#限流降级与熔断)）

<details>
<summary>答题思路</summary>

1. 页面和网关：商品信息放 CDN，开售前按钮置灰，提交后禁止重复点击，网关按用户和接口限流、拦截刷单。
2. 服务和缓存：秒杀服务独立部署；开售前把库存加载到 Redis，用 Lua 脚本原子地判断是否已购、判断库存并扣减，没有库存直接返回已抢完。
3. 消息队列：扣减成功的请求写入消息队列，订单服务按处理能力消费，用户轮询下单结果。
4. 数据库：条件更新 WHERE stock > 0 兜底防超卖，（用户 ID，商品 ID）唯一索引保证一人一单并让重复消费幂等，以数据库为准回补 Redis 并对账。
5. 降级：依赖持续失败时熔断，库存服务被熔断时详情页显示“有货”、下单以数据库为准，关闭评论等非核心功能，无法降级时快速失败提示稍后再试。

</details>
