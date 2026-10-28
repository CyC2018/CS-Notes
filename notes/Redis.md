# Redis
<!-- GFM-TOC -->
* [Redis](#redis)
    * [一、概述](#一概述)
        * [与 MySQL 的区别](#与-mysql-的区别)
    * [二、数据类型](#二数据类型)
        * [STRING](#string)
        * [LIST](#list)
        * [SET](#set)
        * [HASH](#hash)
        * [ZSET](#zset)
    * [三、数据结构](#三数据结构)
        * [对象编码](#对象编码)
        * [字典](#字典)
        * [跳跃表](#跳跃表)
    * [四、使用场景](#四使用场景)
        * [计数器](#计数器)
        * [缓存](#缓存)
        * [查找表](#查找表)
        * [消息队列](#消息队列)
        * [会话缓存](#会话缓存)
        * [分布式锁实现](#分布式锁实现)
        * [排行榜](#排行榜)
        * [其它](#其它)
    * [五、Redis 与 Memcached](#五redis-与-memcached)
        * [数据类型](#数据类型)
        * [数据持久化](#数据持久化)
        * [分布式](#分布式)
        * [内存管理机制](#内存管理机制)
    * [六、键的过期时间](#六键的过期时间)
    * [七、数据淘汰策略](#七数据淘汰策略)
    * [八、持久化](#八持久化)
        * [RDB 持久化](#rdb-持久化)
        * [AOF 持久化](#aof-持久化)
    * [九、事务](#九事务)
        * [Lua 脚本](#lua-脚本)
    * [十、事件](#十事件)
        * [文件事件](#文件事件)
        * [时间事件](#时间事件)
        * [事件的调度与执行](#事件的调度与执行)
        * [单线程为什么快](#单线程为什么快)
    * [十一、复制](#十一复制)
        * [连接过程](#连接过程)
        * [主从链](#主从链)
    * [十二、Sentinel](#十二sentinel)
    * [十三、分片](#十三分片)
        * [Redis Cluster](#redis-cluster)
    * [十四、一个简单的论坛系统分析](#十四一个简单的论坛系统分析)
        * [文章信息](#文章信息)
        * [点赞功能](#点赞功能)
        * [对文章进行排序](#对文章进行排序)
    * [附录：实测](#附录实测)
        * [A1 MySQL 与 Redis 的主键查询](#a1-mysql-与-redis-的主键查询)
        * [A2 排行榜](#a2-排行榜)
        * [A3 单线程的吞吐量和 CPU 时间](#a3-单线程的吞吐量和-cpu-时间)
        * [A4 Redis Cluster](#a4-redis-cluster)
        * [A5 Sentinel 故障转移](#a5-sentinel-故障转移)
        * [A6 SDS 的空间预分配](#a6-sds-的空间预分配)
        * [A7 热点计数](#a7-热点计数)
    * [参考资料](#参考资料)
<!-- GFM-TOC -->


## 一、概述

Redis 是速度非常快的非关系型（NoSQL）内存键值数据库，可以存储键和五种不同类型的值之间的映射。

键的类型只能为字符串，值支持五种基本数据类型：字符串、列表、集合、哈希、有序集合，此外还有位图、HyperLogLog、地理空间、流（Stream）等类型。

Redis 支持很多特性，例如将内存中的数据持久化到硬盘中，使用复制来扩展读性能，使用分片来扩展写性能。

### 与 MySQL 的区别

- 数据位置：Redis 的数据全部在内存中，容量受内存大小限制；MySQL 的数据在磁盘上，内存中的缓冲池只缓存经常访问的页；
- 查询方式：Redis 只能按键访问，值是字符串、哈希、有序集合等数据结构；MySQL 用 SQL 按任意条件查询、联表和聚合，靠索引加速；
- 事务：MySQL 的事务满足 ACID，出错可以回滚；Redis 的事务只保证一组命令依次执行、不被其它客户端的命令插入，其中一条命令执行出错时，其它命令不会回滚，见 [九、事务](#九事务)；
- 持久性：MySQL 默认在事务提交时把 redo log 刷到磁盘，提交成功的数据不会因为宕机丢失；Redis 即使开启 AOF 并设置为 everysec，宕机时也可能丢失最近一秒左右的写入。

数据都在内存中时，MySQL 按主键查询也很快。用 50 个连接分别执行 20 万次同一条主键查询和同一个键的 GET，两者每秒都能处理 13 万～17 万次，但 MySQL 用了约 6 个 CPU 核心，每次查询消耗约 36 微秒的 CPU 时间；Redis 只用 1 个核心，每次约 7 微秒（MySQL 8.0、Redis 7.4 实测，见[附录 A1](#a1-mysql-与-redis-的主键查询)）。Redis 的优势在于开销小、延迟稳定，以及计数器、排行榜这类 MySQL 不擅长的数据结构；需要持久保存、按多种条件查询的业务数据仍然放在 MySQL 中。两者通常一起使用，Redis 作为缓存，见 [缓存与数据库的一致性](缓存.md#缓存一致性)。

## 二、数据类型

| 数据类型 | 可以存储的值 | 操作 |
| :--: | :--: | :--: |
| STRING | 字符串、整数或者浮点数 | 对整个字符串或者字符串的其中一部分执行操作<br> 对整数和浮点数执行自增或者自减操作 |
| LIST | 列表 | 从两端压入或者弹出元素 <br> 对单个或者多个元素进行修剪，<br> 只保留一个范围内的元素 |
| SET | 无序集合 | 添加、获取、移除单个元素<br> 检查一个元素是否存在于集合中<br> 计算交集、并集、差集<br> 从集合里面随机获取元素 |
| HASH | 包含键值对的无序哈希表 | 添加、获取、移除单个键值对<br> 获取所有键值对<br> 检查某个键是否存在|
| ZSET | 有序集合 | 添加、获取、删除元素<br> 根据分值范围或者成员来获取元素<br> 计算一个键的排名 |

### STRING

<div align="center"> <img src="pics/redis-string.png" width="480px"/> </div><br>

```text
> set user:1001:name alice
OK
> get user:1001:name
"alice"
> set page:views 41
OK
> incr page:views
(integer) 42
> del user:1001:name
(integer) 1
> get user:1001:name
(nil)
```

### LIST

<div align="center"> <img src="pics/redis-list.png" width="480px"/> </div><br>

```text
> rpush orders:queue 1024 1025 1026
(integer) 3
> lpush orders:queue 1023
(integer) 4
> lrange orders:queue 0 -1
1) "1023"
2) "1024"
3) "1025"
4) "1026"
> lindex orders:queue -1
"1026"
> lpop orders:queue
"1023"
> lrange orders:queue 0 -1
1) "1024"
2) "1025"
3) "1026"
```

### SET

<div align="center"> <img src="pics/redis-set.png" width="480px"/> </div><br>

```text
> sadd article:7:tags redis cache nosql redis
(integer) 3
> smembers article:7:tags
1) "redis"
2) "cache"
3) "nosql"
> sismember article:7:tags mysql
(integer) 0
> sismember article:7:tags redis
(integer) 1
> srem article:7:tags nosql
(integer) 1
> sadd article:8:tags redis mysql
(integer) 2
> sinter article:7:tags article:8:tags
1) "redis"
```

### HASH

<div align="center"> <img src="pics/redis-hash.png" width="480px"/> </div><br>

```text
> hset user:1001 name alice age 25 city hangzhou
(integer) 3
> hget user:1001 name
"alice"
> hincrby user:1001 age 1
(integer) 26
> hdel user:1001 city
(integer) 1
> hgetall user:1001
1) "name"
2) "alice"
3) "age"
4) "26"
```

### ZSET

<div align="center"> <img src="pics/redis-zset.png" width="480px"/> </div><br>

```text
> zadd rank:score 92 alice 85 bob 97 carol
(integer) 3
> zrange rank:score 0 -1 withscores
1) "bob"
2) "85"
3) "alice"
4) "92"
5) "carol"
6) "97"
> zrange rank:score 0 1 rev withscores
1) "carol"
2) "97"
3) "alice"
4) "92"
> zrangebyscore rank:score 90 100
1) "alice"
2) "carol"
> zincrby rank:score 10 bob
"95"
> zrange rank:score 0 -1 rev withscores
1) "carol"
2) "97"
3) "bob"
4) "95"
5) "alice"
6) "92"
```

## 三、数据结构

### 对象编码

同一种数据类型会根据元素的数量和大小选择不同的底层结构，称为编码，可以用 OBJECT ENCODING 查看。元素少时使用 listpack，它把所有元素连续地存放在一块内存中，节省内存，查找时虽然要逐个比较，但元素很少时并不慢；元素增多后转换为查找更快的结构。以下是在 Redis 7.4 上用默认配置验证的结果：

| 类型 | 元素少时 | 超过阈值后 | 阈值 |
| --- | --- | --- | --- |
| STRING | int（整数）、embstr | raw | 44 字节 |
| LIST | listpack | quicklist（多个 listpack 组成的链表） | 单个 listpack 超过 8 KB |
| HASH | listpack | hashtable | 512 个字段，或者有值超过 64 字节 |
| SET | intset（全是整数）、listpack | hashtable | 整数 512 个，其它 128 个 |
| ZSET | listpack | skiplist（跳跃表 + 字典） | 128 个成员，或者有成员超过 64 字节 |

例如一个 HASH 有 512 个字段时编码为 listpack，再写入一个字段就变为 hashtable。ZSET 转换后同时使用跳跃表和字典：字典按成员查分数，跳跃表按分数排序和范围查询。

字符串的内容保存在简单动态字符串（Simple Dynamic String, SDS）中，它在字符数组前面记录了已用的长度 len 和分配的容量 alloc：

- 取长度是 O(1)，不用像 C 字符串那样遍历到 \0；
- 按 len 而不是 \0 判断结尾，可以保存任意二进制数据；
- 追加时空间不够才重新分配，并且多分配一些：新长度小于 1 MB 时分配新长度的 2 倍，否则多分配 1 MB，连续追加时不用每次都重新分配内存。

例如对 60 字节、没有剩余空间的字符串再 APPEND 1 字节，SDS 按 2 × 61 = 122 字节申请（内存分配器向上取整为 128 字节），追加后剩余 63 字节；对 2040000 字节的字符串追加后剩余约 1 MB（Redis 7.4 实测，见[附录 A6](#a6-sds-的空间预分配)）。embstr 编码把对象头和 SDS 放在同一块内存中，只需分配一次，44 字节的上限正好让两者一起放进 64 字节；它是只读的，APPEND 等修改会先把它转为 raw。

### 字典

键空间、HASH 和 SET 的 hashtable 编码、ZSET 中按成员查分数的部分，都是用字典（dict）实现的。字典是一个哈希表，用拉链法解决哈希冲突：桶的数量是 2 的幂，键的哈希值与桶数减 1 做位与得到桶的下标，落在同一个桶的键用链表连起来。

键越来越多时链表变长，查找变慢，需要扩大桶数组并把所有键重新放一遍，称为 rehash。Redis 用一个线程执行命令，一个有几百万个键的字典一次性 rehash 会让服务器停顿很久，所以采用渐进式 rehash：

- 字典中有两张哈希表 ht_table[0] 和 ht_table[1]，平时只用 ht_table[0]；
- 键的数量达到桶数时扩容，ht_table[1] 的大小为不小于键数加 1 的 2 的幂；有子进程在执行 BGSAVE 或 AOF 重写时，为了减少写时复制的内存页，要达到桶数的 4 倍才扩容；
- 键的数量不超过桶数的 1/8 时缩容，过程相同；
- rehashidx 记录迁移到了哪个桶，之后每次对这个字典增删改查，都顺便把一个桶中的所有键迁移到 ht_table[1]，serverCron 也会定期花不超过 1 毫秒继续迁移；
- 迁移期间新写入的键只放入 ht_table[1]，查找和删除时两张表都可能要查；
- 全部迁移完成后，ht_table[1] 变为 ht_table[0]，rehashidx 恢复为 -1。

<div align="center"> <img src="pics/redis-rehash.png" width="760px"/> </div><br>

以上依据 Redis 7.4 的 dict.c。Redis 7.0 之前的两张表是 dict 中的 dictht ht[2]，渐进式 rehash 的过程相同。

### 跳跃表

跳跃表（skiplist）是有序集合在成员较多时的底层结构，它在一条有序链表上增加了多层索引。

最底层是包含所有成员、按分值排序的链表。每个节点插入时随机决定层数：以 1/4 的概率升高一层，最多 32 层。所以大约每 4 个节点有 1 个出现在第 2 层，每 16 个节点有 1 个出现在第 3 层，平均每个节点约 1.33 个指针。

查找时从最高层开始向右走，下一个节点比目标大时下降一层，直到最底层。每层平均只走几步，查找、插入和删除的期望时间复杂度都是 O(logN)。下图演示了查找 26 的过程。

<div align="center"> <img src="pics/redis-skiplist.png" width="760px"/> </div><br>

与红黑树等平衡树相比，跳跃表有以下优点：

- 插入和删除只需要修改每一层前驱节点的指针，不需要旋转等操作来维护平衡；
- 范围查询方便，找到起点后沿最底层链表向后遍历即可，ZRANGEBYSCORE 就是这样实现的；
- 实现和调试更简单。

Redis 的跳跃表还在每个指针上记录了跨度，即这一步跳过了多少个节点，查找时把经过的跨度相加就得到排名，所以 ZRANK 也是 O(logN)。

## 四、使用场景

### 计数器

可以对字符串执行 INCR、INCRBY 等命令实现计数器，例如文章的阅读数、接口的调用次数。

命令在服务器上原子执行，多个客户端同时加 1 不会丢失更新；数据在内存中，也适合这种频繁读写的场景。

如果直接在数据库中计数，所有请求都要更新同一行，行锁让这些更新只能一个接一个地执行。对同一行执行 UPDATE counter SET cnt = cnt + 1，MySQL 用 1、8、50 个连接时每秒都只有 5000～7000 次；Redis 的 INCR 用 50 个连接每秒约 10 万次（MySQL 8.0、Redis 7.4 实测，见[附录 A7](#a7-热点计数)）。

常用的做法是在 Redis 中计数，再定期把计数写回数据库。单个计数仍然太热时，可以拆成多个键，例如 views:1024:0～views:1024:9，每次随机给其中一个加 1，读取时求和。点赞这类每个用户只能计一次的计数，还要记录点过赞的用户，见下文的 [点赞功能](#点赞功能)。

### 缓存

将热点数据放到内存中，设置内存的最大使用量以及淘汰策略来保证缓存的命中率，见 [缓存](缓存.md)。

### 查找表

例如 DNS 记录就很适合使用 Redis 进行存储。

查找表和缓存类似，也是利用了 Redis 快速的查找特性。但是查找表的内容不能失效，而缓存的内容可以失效，因为缓存不作为可靠的数据来源。

### 消息队列

List 可以用 LPUSH 写入消息，用 BRPOP 阻塞地读取消息。但消息被取出后就从列表中删除，消费者处理失败时消息会丢失，也不能让多个消费者组各自消费一遍。

Redis 5.0 加入的流（Stream）支持消费者组和确认：XREADGROUP 读取的消息在 XACK 确认之前一直保存在待处理列表中，消费者宕机后可以由其它消费者认领。对可靠性和消息堆积量要求高的场景，仍然使用 Kafka、RocketMQ 等消息中间件，见 [消息队列](消息队列.md)。

### 会话缓存

可以使用 Redis 来统一存储多台应用服务器的会话信息。

当应用服务器不再存储用户的会话信息，也就不再具有状态，一个用户可以请求任意一个应用服务器，从而更容易实现高可用性以及可伸缩性。

### 分布式锁实现

在分布式场景下，无法使用单机环境下的锁来对多个节点上的进程进行同步。

可以使用 SET 命令的 NX 和 PX 选项实现单实例的分布式锁，除此之外，还可以使用官方提出的 RedLock 算法在多个独立实例上实现分布式锁，详见 [分布式](分布式.md)。

### 排行榜

有序集合按分值排序，正好用来实现排行榜：成员是文章或用户的 ID，分值是点赞数或销量。

```text
ZINCRBY rank:likes 1 article:1001                  -- 点赞一次，分值加 1
ZREVRANGE rank:likes 0 9 WITHSCORES                -- 前 10 名
ZREVRANK rank:likes article:1001                   -- 第几名，从 0 开始
```

向一个有序集合写入 100 万个成员，占用约 105 MB 内存；查前 10 名、查某个成员的排名和加分都是 O(logN) 的操作，SLOWLOG 记录的服务器执行时间只有几微秒（Redis 7.4 实测，见[附录 A2](#a2-排行榜)）。

分值相同时，Redis 按成员名的字典序排列，而业务上通常要求先达到这个分数的排在前面。可以把时间编进分值：分值 = 点赞数 × 10<sup>10</sup> + (10<sup>10</sup> − 达到这个点赞数的秒级时间戳)。例如 article:1001 和 article:1002 都是 520 个赞，时间戳分别为 1793000000 和 1793000300，分值为 5208207000000 和 5208206999700，先达到的 article:1001 排在前面。需要注意的是，分值是双精度浮点数，只能精确表示 2<sup>53</sup> 以内的整数，这种写法下点赞数不能超过约 90 万，更大时要缩短时间部分的位数。

排行榜被大量用户同时查看时，前 10 名这个键会成为热点。前几名的变化不需要实时反映给每个用户，可以在应用的本地缓存中保存 1 秒，大部分请求不再访问 Redis，见 [多级缓存](缓存.md#多级缓存)。

### 其它

Set 可以实现交集、并集等操作，从而实现共同好友等功能。

## 五、Redis 与 Memcached

两者都是非关系型内存键值数据库，主要有以下不同：

### 数据类型

Memcached 仅支持字符串类型，而 Redis 支持五种不同的数据类型，可以更灵活地解决问题。

### 数据持久化

Redis 支持两种持久化策略：RDB 快照和 AOF 日志，而 Memcached 不支持持久化。

### 分布式

Memcached 不支持分布式，只能通过在客户端使用一致性哈希来实现分布式存储，这种方式在存储和查询时都需要先在客户端计算一次数据所在的节点。

Redis Cluster 实现了分布式的支持。

### 内存管理机制

- Redis 和 Memcached 的数据都一直存储在内存中。Redis 曾经支持把很久没用的 value 交换到磁盘（虚拟内存），但是该特性已经在 2.6 版本移除；
- Memcached 将内存分割成特定长度的块来存储数据，避免了频繁分配和释放造成的内存碎片。但是这种方式会使得内存的利用率不高，例如块的大小为 128 字节，只存储 100 字节的数据，那么剩下的 28 字节就浪费掉了。

## 六、键的过期时间

Redis 可以为每个键设置过期时间。过期的键不会在过期的瞬间被删除，而是通过两种策略清除：惰性删除，在访问键时检查它是否过期，过期就删除；定期删除，后台每秒执行 10 次（由 hz 配置），每次随机抽取一部分设置了过期时间的键进行检查，删除其中已经过期的键。

对于 HASH 这种容器，Redis 7.4 之前只能为整个键设置过期时间，7.4 开始可以使用 HEXPIRE 等命令为单个字段设置过期时间。

## 七、数据淘汰策略

可以设置内存最大使用量，当内存使用量超出时，会施行数据淘汰策略。

Redis 4.0 之后具体有 8 种淘汰策略：

| 策略 | 描述 |
| :--: | :--: |
| volatile-lru | 从已设置过期时间的数据集中挑选最近最少使用的数据淘汰 |
| volatile-ttl | 从已设置过期时间的数据集中挑选将要过期的数据淘汰 |
|volatile-random | 从已设置过期时间的数据集中任意选择数据淘汰 |
| allkeys-lru | 从所有数据集中挑选最近最少使用的数据淘汰 |
| allkeys-random | 从所有数据集中任意选择数据进行淘汰 |
| volatile-lfu | 从已设置过期时间的数据集中挑选最不经常使用的数据淘汰 |
| allkeys-lfu | 从所有数据集中挑选最不经常使用的数据淘汰 |
| noeviction | 禁止驱逐数据 |

默认策略是 noeviction：内存达到上限后，写命令返回错误，读命令照常执行。

作为内存数据库，出于对性能和内存消耗的考虑，Redis 的淘汰算法实际实现上并非针对所有 key，而是每次抽样一小部分（maxmemory-samples，默认 5 个）并且从中选出被淘汰的 key。

使用 Redis 缓存数据时，为了提高缓存命中率，需要保证缓存数据都是热点数据。可以将内存最大使用量设置为热点数据占用的内存量，然后启用 allkeys-lru 淘汰策略，将最近最少使用的数据淘汰。

Redis 4.0 引入了 volatile-lfu 和 allkeys-lfu 淘汰策略，LFU 策略通过统计访问频率，将访问频率最少的键值对淘汰。

## 八、持久化

Redis 是内存型数据库，为了保证数据在断电后不会丢失，需要将内存中的数据持久化到硬盘上。

### RDB 持久化

将某个时间点的所有数据都存放到硬盘上。

执行 BGSAVE 或满足 save 配置的条件时，Redis fork 一个子进程把内存中的数据写入 RDB 文件，主进程继续处理命令。fork 之后父子进程共享同一份内存页，主进程修改某一页时操作系统才复制这一页（写时复制），所以生成快照期间写入越多，额外占用的内存越多。

可以将快照复制到其它服务器从而创建具有相同数据的服务器副本。

如果系统发生故障，将会丢失最后一次创建快照之后的数据。

如果数据量很大，保存快照的时间会很长。

### AOF 持久化

将写命令添加到 AOF 文件（Append Only File）的末尾。

使用 AOF 持久化需要设置同步选项，从而确保写命令同步到磁盘文件上的时机。这是因为对文件进行写入并不会马上将内容同步到磁盘上，而是先存储到缓冲区，然后由操作系统决定什么时候同步到磁盘。有以下同步选项：

| 选项 | 同步频率 |
| :--: | :--: |
| always | 每个写命令都同步 |
| everysec | 每秒同步一次 |
| no | 让操作系统来决定何时同步 |

- always 选项会严重降低服务器的性能；
- everysec 选项比较合适，可以保证系统崩溃时只会丢失一秒左右的数据，并且 Redis 每秒执行一次同步对服务器性能几乎没有任何影响；
- no 选项并不能给服务器性能带来多大的提升，而且也会增加系统崩溃时数据丢失的数量。

随着服务器写请求的增多，AOF 文件会越来越大。Redis 提供了一种将 AOF 重写的特性，能够去除 AOF 文件中的冗余写命令。

重写同样由子进程完成，它不读取旧的 AOF 文件，而是按内存中的当前数据生成最少的命令。Redis 7.0 起 AOF 由多个文件组成：重写生成的基础文件，以及之后追加写命令的增量文件。

<div align="center"> <img src="pics/redis-aof-rewrite.png" width="760px"/> </div><br>

配置项 aof-use-rdb-preamble 默认开启，重写生成的基础文件使用 RDB 格式，称为混合持久化：重启时先载入 RDB 部分，再重放增量文件中的命令，兼顾了 RDB 恢复快和 AOF 丢失数据少的优点。两种持久化都开启时，重启后使用 AOF 恢复，因为它的数据通常更完整。

两种方式的对比：

- 丢失的数据：RDB 丢失最后一次快照之后的写入，按 save 配置可能是几分钟；AOF 使用 everysec 时约丢失 1 秒；
- 文件和恢复：RDB 是紧凑的二进制快照，适合备份，数据量大时恢复也快；AOF 记录的是命令，文件通常更大；
- 开销：RDB 只在生成快照时 fork 子进程，数据量大时 fork 本身可能让主进程停顿；AOF 每次写入都要追加，并且需要定期重写。

## 九、事务

一个事务包含了多个命令，服务器在执行事务期间，不会改去执行其它客户端的命令请求。

事务中的命令会先被服务器放入队列，EXEC 时依次执行。流水线（Pipelining）是另一个概念，指客户端不等待响应就连续发送多条命令，从而减少网络往返次数，事务通常和流水线一起使用。

Redis 最简单的事务实现方式是使用 MULTI 和 EXEC 命令将事务操作包围起来。

Redis 的事务不支持回滚：EXEC 时某条命令执行出错，其它命令照常执行。例如 name 的值是字符串 alice，对它执行 INCR 会出错，但同一事务中的两条 SET 都生效：

```text
> multi
OK
> set city hangzhou
QUEUED
> incr name
QUEUED
> set age 25
QUEUED
> exec
1) OK
2) (error) ERR value is not an integer or out of range
3) OK
```

命令入队时就能发现的错误（例如命令不存在），EXEC 会放弃整个事务，返回 EXECABORT。

WATCH 可以实现乐观锁：EXEC 之前被 WATCH 的键被其它客户端修改，EXEC 返回 nil，事务中的命令都不执行，由客户端决定是否重试。

### Lua 脚本

事务中的命令在 EXEC 时才一起执行，不能根据前一条命令的结果决定下一条做什么。Lua 脚本可以做到这一点，并且整个脚本原子执行，执行期间不会插入其它客户端的命令。

例如每个用户每天最多领 3 张券，键为 coupon:1001，有效期一天：

```lua
local n = tonumber(redis.call('GET', KEYS[1]) or '0')
if n >= tonumber(ARGV[1]) then
  return 0
end
redis.call('INCR', KEYS[1])
if n == 0 then
  redis.call('EXPIRE', KEYS[1], ARGV[2])
end
return n + 1
```

用 redis-cli --eval coupon.lua coupon:1001 , 3 86400 连续执行 4 次，返回值依次为 1、2、3、0。如果在客户端先 GET 再 INCR，两个请求可能同时读到 2，都领到第 3 张。

需要注意的是：

- 脚本中途出错时，之前执行的写命令不会回滚，之后的命令不再执行；
- 脚本执行期间服务器不处理其它命令，脚本要短，不要在其中遍历大集合；
- 脚本用到的键要通过 KEYS 传入，集群模式下这些键必须在同一个槽中；
- 可以先用 SCRIPT LOAD 把脚本缓存在服务器上，之后用 EVALSHA 加脚本的 SHA1 调用，不用每次发送脚本内容。

## 十、事件

Redis 服务器是一个事件驱动程序。

### 文件事件

服务器通过套接字与客户端或者其它服务器进行通信，文件事件就是对套接字操作的抽象。

Redis 基于 Reactor 模式开发了自己的网络事件处理器，使用 I/O 多路复用程序来同时监听多个套接字，并将到达的事件传送给文件事件分派器，分派器会根据套接字产生的事件类型调用相应的事件处理器。

<div align="center"> <img src="pics/redis-file-event.png" width="760px"/> </div><br>

### 时间事件

服务器有一些操作需要在给定的时间点执行，时间事件是对这类定时操作的抽象。

时间事件又分为：

- 定时事件：是让一段程序在指定的时间之内执行一次；
- 周期性事件：是让一段程序每隔指定时间就执行一次。

Redis 将所有时间事件都放在一个无序链表中，通过遍历整个链表查找出已到达的时间事件，并调用相应的事件处理器。

### 事件的调度与执行

服务器需要不断监听文件事件的套接字才能得到待处理的文件事件，但是不能一直监听，否则时间事件无法在规定的时间内执行，因此监听时间应该根据距离现在最近的时间事件来决定。

事件调度与执行由 aeProcessEvents 函数负责，伪代码如下：

```python
def aeProcessEvents():
    # 获取到达时间离当前时间最接近的时间事件
    time_event = aeSearchNearestTimer()
    # 计算最接近的时间事件距离到达还有多少毫秒
    remaind_ms = time_event.when - unix_ts_now()
    # 如果事件已到达，那么 remaind_ms 的值可能为负数，将它设为 0
    if remaind_ms < 0:
        remaind_ms = 0
    # 根据 remaind_ms 的值，创建 timeval
    timeval = create_timeval_with_ms(remaind_ms)
    # 阻塞并等待文件事件产生，最大阻塞时间由传入的 timeval 决定
    aeApiPoll(timeval)
    # 处理所有已产生的文件事件
    processFileEvents()
    # 处理所有已到达的时间事件
    processTimeEvents()
```

将 aeProcessEvents 函数置于一个循环里面，加上初始化和清理函数，就构成了 Redis 服务器的主函数，伪代码如下：

```python
def main():
    # 初始化服务器
    init_server()
    # 一直处理事件，直到服务器关闭为止
    while server_is_not_shutdown():
        aeProcessEvents()
    # 服务器关闭，执行清理操作
    clean_server()
```

从事件处理的角度来看，服务器运行流程如下：

<div align="center"> <img src="pics/redis-event-loop.png" width="600px"/> </div><br>

### 单线程为什么快

Redis 用一个线程执行所有命令，仍然很快，原因主要有以下几点：

- 数据在内存中，一条 GET 只需要查一次哈希表；
- 单线程执行命令，不需要加锁，也没有线程切换的开销；
- I/O 多路复用让一个线程同时处理大量连接；
- 按数据的大小选择不同的编码，例如元素少时用紧凑的 listpack。

用 redis-benchmark 测试，50 个连接逐条发送 GET，每秒约 16 万次；每次连续发送 16 条命令（流水线）时，每秒约 160 万次。逐条发送 100 万次 GET 时，服务器消耗的 CPU 时间中内核态 5.1 秒、用户态 1.0 秒：大部分时间花在网络读写的系统调用上，解析和执行一条命令只需要 1 微秒左右（Redis 7.4 实测，见[附录 A3](#a3-单线程的吞吐量和-cpu-时间)）。

所以 Redis 的瓶颈通常是网络和内存，而不是 CPU。Redis 6.0 加入了 I/O 多线程（io-threads，默认关闭），开启后默认只把写回客户端交给 I/O 线程，读取和解析请求还需要再打开 io-threads-do-reads；命令仍由主线程逐个执行，单条命令的原子性不变。此外，关闭文件、AOF 刷盘和 UNLINK 释放大键的内存这些耗时操作由后台线程完成。

## 十一、复制

通过使用 REPLICAOF host port 命令来让一个服务器成为另一个服务器的从服务器（5.0 之前为 SLAVEOF，现已弃用）。

一个从服务器只能有一个主服务器，并且不支持主主复制。

### 连接过程

1. 主服务器创建快照文件，发送给从服务器，并在发送期间使用缓冲区记录执行的写命令。快照文件发送完毕之后，开始向从服务器发送存储在缓冲区中的写命令；

2. 从服务器丢弃所有旧数据，载入主服务器发来的快照文件，之后从服务器开始接受主服务器发来的写命令；

3. 主服务器每执行一次写命令，就向从服务器发送相同的写命令。

Redis 7.0 起默认不把快照写入磁盘，而是直接通过网络发送给从服务器（repl-diskless-sync yes）。

以上是第一次连接时的全量复制。从服务器断线重连后，会带上复制 ID 和自己已经复制到的偏移量发送 PSYNC 命令：如果主服务器的复制积压缓冲区（默认 1 MB）中还保存着之后的写命令，就只发送缺少的部分，称为部分重同步；否则重新进行全量复制。写入量大、断线时间长时，可以调大 repl-backlog-size，避免频繁全量复制。

### 主从链

随着负载不断上升，主服务器可能无法很快地更新所有从服务器，或者重新连接和重新同步从服务器将导致系统超载。为了解决这个问题，可以创建一个中间层来分担主服务器的复制工作。中间层的服务器是最上层服务器的从服务器，又是最下层服务器的主服务器。

<div align="center"> <img src="pics/redis-replica-chain.png" width="720px"/> </div><br>

## 十二、Sentinel

Sentinel（哨兵）可以监听集群中的服务器，并在主服务器进入下线状态时，自动从从服务器中选举出新的主服务器。

通常部署 3 个或以上的哨兵，故障转移的过程如下：

1. 主观下线：某个哨兵在 down-after-milliseconds 内没有收到主服务器的有效回复，认为它下线；
2. 客观下线：认为主服务器下线的哨兵数达到配置的 quorum，确认它下线；
3. 选出领头哨兵：哨兵之间投票，得到多数哨兵投票的一个负责这次故障转移，避免多个哨兵同时操作；
4. 选择新的主服务器：排除断线太久的从服务器，再依次比较优先级（replica-priority，越小越优先）、复制偏移量（数据越新越好）和运行 ID；
5. 切换：让选中的从服务器执行 REPLICAOF NO ONE，其它从服务器改为复制它，客户端从哨兵查询到新的地址；原来的主服务器恢复后成为从服务器。

<div align="center"> <img src="pics/redis-sentinel-failover.png" width="760px"/> </div><br>

down-after-milliseconds 为 5 秒时，从主服务器宕机到客户端查到新地址约 6 秒，其中 5 秒是超时检测。新的主服务器保留了旧的复制 ID，另一个从服务器转向它时只需要部分重同步，只发送了 156 字节的积压数据；重启的旧主服务器复制 ID 不匹配，只能全量复制（Redis 7.4 实测，见[附录 A5](#a5-sentinel-故障转移)）。

需要注意的是，主从之间是异步复制，切换时还没有复制到从服务器的写入会丢失。网络分区时，旧的主服务器还可能继续接受写入（脑裂），恢复后它变为从服务器，这段时间的写入也会丢失。可以配置 min-replicas-to-write 1 和 min-replicas-max-lag 10：延迟不超过 10 秒的从服务器少于 1 个时，主服务器拒绝写入并返回 NOREPLICAS，把丢失的范围限制在 10 秒左右。

## 十三、分片

分片是将数据划分为多个部分的方法，可以将数据存储到多台机器里面，这种方法在解决某些问题时可以获得线性级别的性能提升。

假设有 4 个 Redis 实例 R0，R1，R2，R3，还有很多表示用户的键 user:1，user:2，... ，有不同的方式来选择一个指定的键存储在哪个实例中。

- 最简单的方式是范围分片，例如用户 id 从 0\~1000 的存储到实例 R0 中，用户 id 从 1001\~2000 的存储到实例 R1 中，等等。但是这样需要维护一张映射范围表，维护操作代价很高。
- 还有一种方式是哈希分片，使用 CRC32 哈希函数将键转换为一个数字，再对实例数量求模就能知道应该存储的实例。

根据执行分片的位置，可以分为三种分片方式：

- 客户端分片：客户端使用一致性哈希等算法决定键应当分布到哪个节点；
- 代理分片：将客户端请求发送到代理上，由代理转发请求到正确的节点上；
- 服务器分片：Redis Cluster，使用 CRC16(key) % 16384 计算键所属的哈希槽，再把 16384 个哈希槽分配给各个节点。

### Redis Cluster

Redis 有三种常见的部署方式，解决的问题不同：

- 主从复制：从服务器复制主服务器的数据，分担读请求，主服务器宕机后需要手动切换；
- Sentinel：在主从复制的基础上自动监控和故障转移，但仍然只有一个主服务器负责写入，数据量受单机内存限制；
- Redis Cluster：把数据分散到多个主节点上，每个主节点有自己的从节点，同时解决容量和高可用的问题。

Redis Cluster 把键空间分为 16384 个哈希槽，每个主节点负责一部分槽。下图是一个 3 主 3 从的集群（Redis 7.4 实测，见[附录 A4](#a4-redis-cluster)）：

<div align="center"> <img src="pics/redis-cluster.png" width="720px"/> </div><br>

- 客户端向不负责这个槽的节点发送命令时，会收到 MOVED 重定向。例如 user:1001 所在的槽 5712 属于 7002，发给 7001 会收到 MOVED 5712 127.0.0.1:7002。客户端会缓存槽与节点的对应关系，之后直接访问正确的节点；
- 一条命令涉及多个键时，这些键必须在同一个槽中，否则报错 CROSSSLOT，Lua 脚本也是如此。可以用哈希标签（hash tag）让相关的键落到同一个槽：只有 {} 中的部分参与计算，{user:1001}:cart 和 {user:1001}:orders 都在槽 5712；
- 主节点宕机后，它的一个从节点会被选为新的主节点。cluster-node-timeout 为 5 秒时，停掉一个主节点后，这部分槽约 7～9 秒无法写入。

需要注意的是，主从之间是异步复制，主节点宕机前刚写入、还没有复制到从节点的数据会丢失，所以 Redis Cluster 不保证强一致性。

## 十四、一个简单的论坛系统分析

该论坛系统功能如下：

- 可以发布文章；
- 可以对文章进行点赞；
- 在首页可以按文章的发布时间或者文章的点赞数进行排序显示。

### 文章信息

文章包括标题、作者、赞数等信息，在关系型数据库中很容易构建一张表来存储这些信息，在 Redis 中可以使用 HASH 来存储每种信息以及其对应的值的映射。

Redis 没有关系型数据库中的表这一概念来将同种类型的数据存放在一起，而是使用命名空间的方式来实现这一功能。键名的前面部分存储命名空间，后面部分的内容存储 ID，通常使用 : 来进行分隔。例如下面的 HASH 的键名为 article:1001，其中 article 为命名空间，ID 为 1001。

<div align="center"> <img src="pics/redis-article-hash.png" width="560px"/> </div><br>

### 点赞功能

当有用户为一篇文章点赞时，除了要对该文章的 votes 字段进行加 1 操作，还必须记录该用户已经对该文章进行了点赞，防止用户点赞次数超过 1。可以建立文章的已投票用户集合来进行记录。

为了节约内存，规定一篇文章发布满一周之后，就不能再对它进行投票，而文章的已投票集合也会被删除，可以为文章的已投票集合设置一个一周的过期时间就能实现这个规定。

<div align="center"> <img src="pics/redis-article-vote.png" width="760px"/> </div><br>

### 对文章进行排序

为了按发布时间和点赞数进行排序，可以建立一个文章发布时间的有序集合和一个文章点赞数的有序集合。两个有序集合的成员都是文章 ID，分值分别是发布时间和点赞数，按分值倒序取前 10 个就是首页要显示的文章。

<div align="center"> <img src="pics/redis-article-zsets.png" width="760px"/> </div><br>

## 附录：实测

以下实验的环境均为 Apple M1 Pro（10 核）、macOS，客户端和服务器在同一台机器上，Redis 7.4.1 从源码编译，使用默认配置，不开启持久化。

### A1 MySQL 与 Redis 的主键查询

MySQL 8.0.44，orders 表有 200 万行，要查的行已在缓冲池中。两边都用 50 个连接执行 20 万次，各做 3 轮。MySQL 的 CPU 时间是 mysqld 进程执行前后的 CPU 时间之差，Redis 的是 INFO cpu 中 used_cpu_sys 与 used_cpu_user 之和的差。

```bash
mysqlslap -uroot --concurrency=50 --iterations=1 --number-of-queries=200000 \
  --create-schema=demo --query="SELECT * FROM orders WHERE id = 1024"
redis-benchmark -c 50 -n 200000 -q GET order:1024
```

```text
== 第 1 轮 MySQL
  Average number of seconds to run all queries: 1.155 seconds
墙钟 1.21 s，mysqld CPU 7.20 s，QPS 165707，每次 36.0 us，平均占用 6.0 核
== 第 1 轮 Redis
GET order:1024: 165425.97 requests per second, p50=0.231 msec
redis-server CPU 1.21 s，每次 6.0 us
== 第 2 轮 MySQL
  Average number of seconds to run all queries: 1.111 seconds
墙钟 1.16 s，mysqld CPU 7.34 s，QPS 172026，每次 36.7 us，平均占用 6.3 核
== 第 2 轮 Redis
GET order:1024: 153727.91 requests per second, p50=0.247 msec
redis-server CPU 1.30 s，每次 6.5 us
== 第 3 轮 MySQL
  Average number of seconds to run all queries: 1.101 seconds
墙钟 1.15 s，mysqld CPU 7.16 s，QPS 173683，每次 35.8 us，平均占用 6.2 核
== 第 3 轮 Redis
GET order:1024: 131926.12 requests per second, p50=0.287 msec
redis-server CPU 1.49 s，每次 7.4 us
```

### A2 排行榜

用 redis-py 写入同分排序的例子和 100 万个成员，分值是 0～100 万的随机整数，用流水线每 1 万条提交一次：

```python
def score(likes, ts):
    return likes * 10**10 + (10**10 - ts)

r.zadd('rank:likes', {'article:1001': score(520, 1793000000),
                      'article:1002': score(520, 1793000300),
                      'article:1003': score(980, 1793000600)})
print(r.zrevrange('rank:likes', 0, 2, withscores=True))

pipe = r.pipeline(transaction=False)
for i in range(1_000_000):
    pipe.zadd('rank:big', {f'u:{i}': random.randint(0, 10**6)})
    if i % 10000 == 9999:
        pipe.execute()
pipe.execute()
```

内存是写入前后 INFO memory 中 used_memory 的差。之后执行 CONFIG SET slowlog-log-slower-than 0，让 SLOWLOG 记录所有命令，再把 ZREVRANGE rank:big 0 9 WITHSCORES、ZREVRANK rank:big u:123456、ZINCRBY rank:big 1 u:123456 各执行 5 次：

```text
[('article:1003', 9808206999400.0), ('article:1001', 5208207000000.0), ('article:1002', 5208206999700.0)]
100 万成员内存 104.7 MB
OBJECT ENCODING rank:big -> skiplist
SLOWLOG 中的执行时间（微秒）
zrevrange [5, 3, 2, 3, 4]
zrevrank [4, 3, 3, 3, 3]
zincrby [5, 5, 4, 6, 7]
```

### A3 单线程的吞吐量和 CPU 时间

```bash
redis-benchmark -c 50 -n 1000000 -t get -P 1 -q
redis-benchmark -c 50 -n 1000000 -t get -P 16 -q
# 每次测试前后各执行一次 INFO cpu，取 used_cpu_sys、used_cpu_user 的差
```

```text
== -P 1
GET: 162522.34 requests per second, p50=0.231 msec
服务器 CPU：used_cpu_sys +5.13 s，used_cpu_user +1.00 s
== -P 16
GET: 1618123.00 requests per second, p50=0.415 msec
服务器 CPU：used_cpu_sys +0.28 s，used_cpu_user +0.34 s
```

### A4 Redis Cluster

6 个节点 7001～7006 都以 --cluster-enabled yes --cluster-node-timeout 5000 启动，然后创建 3 主 3 从的集群：

```bash
redis-cli --cluster create 127.0.0.1:7001 127.0.0.1:7002 127.0.0.1:7003 \
  127.0.0.1:7004 127.0.0.1:7005 127.0.0.1:7006 --cluster-replicas 1 --cluster-yes
```

槽的分配为 7001：0～5460，7002：5461～10922，7003：10923～16383。

```text
> redis-cli -p 7001 cluster keyslot user:1001
5712
> redis-cli -p 7001 cluster keyslot {user:1001}:cart
5712
> redis-cli -p 7001 cluster keyslot {user:1001}:orders
5712
> redis-cli -p 7001 set user:1001 alice
MOVED 5712 127.0.0.1:7002
> redis-cli -p 7002 set user:1001 alice
OK
> redis-cli -p 7002 mset user:1001:cart a user:1001:orders b
CROSSSLOT Keys in request don't hash to the same slot
> redis-cli -p 7002 mset {user:1001}:cart a {user:1001}:orders b
OK
> redis-cli -p 7002 eval "return redis.call('mset', KEYS[1], 'a', KEYS[2], 'b')" 2 user:1001:cart user:1001:orders
CROSSSLOT Keys in request don't hash to the same slot
```

然后 kill -9 7002，每 100 毫秒向它的从节点写一次 user:1001，直到返回 OK。下面是第 3 次实验的输出，3 次实验分别在 7.1、8.7、8.8 秒后恢复写入：

```text
== 7002 的从节点：7006
8.8 s 后写入成功，之前失败 73 次，最后一次失败前的返回为 CLUSTERDOWN The cluster is down
* FAIL message received from ... about ...
* Start of election delayed for 738 milliseconds (rank #0, offset 138).
* Starting a failover election for epoch 7.
* Failover election won: I'm the new master.
> redis-cli -p 7006 get user:1001
bob
```

### A5 Sentinel 故障转移

1 主 6400、2 从 6401 和 6402，3 个哨兵 26400～26402，哨兵的配置：

```text
sentinel monitor mymaster 127.0.0.1 6400 2
sentinel down-after-milliseconds mymaster 5000
sentinel failover-timeout mymaster 60000
```

向 6400 写入 order:1024 后 kill -9 6400，每 100 毫秒用 SENTINEL get-master-addr-by-name mymaster 查询主服务器地址。下面的时间相对于 kill -9，日志取自 3 个哨兵中最先记录该事件的一个：

```text
== kill -9 6400 后 6.20 s，SENTINEL get-master-addr-by-name 返回 127.0.0.1:6401
 5.02 s  哨兵 26402  # +sdown master mymaster 127.0.0.1 6400
 5.10 s  哨兵 26400  # +odown master mymaster 127.0.0.1 6400 #quorum 2/2
 5.18 s  哨兵 26400  # +elected-leader master mymaster 127.0.0.1 6400
 5.24 s  哨兵 26400  # +selected-slave slave 127.0.0.1:6401 127.0.0.1 6401 @ mymaster 127.0.0.1 6400
 6.13 s  哨兵 26400  # +promoted-slave slave 127.0.0.1:6401 127.0.0.1 6401 @ mymaster 127.0.0.1 6400
 6.18 s  哨兵 26401  # +switch-master mymaster 127.0.0.1 6400 127.0.0.1 6401
> GET order:1024（新的主服务器 6401）
paid
```

重启 6400 后，新的主服务器 6401 的日志：

```text
* Partial resynchronization request from 127.0.0.1:6402 accepted. Sending 156 bytes of backlog starting from offset 2495.
* Partial resynchronization not accepted: Replication ID mismatch (Replica asked for 'f16e5fc0...', my replication IDs are 'ac108f0e...' and '48696b86...')
> 6400 的角色
role:slave
master_port:6401
> CONFIG SET min-replicas-to-write 3 后写入（只有 2 个从服务器）
NOREPLICAS Not enough good replicas to write.
```

### A6 SDS 的空间预分配

Redis 7.4.1（内存分配器为 libc），启动时加 --enable-debug-command yes，用 DEBUG SDSLEN 查看值的 len、avail（剩余空间）和实际分配的内存：

```text
SET s（50 字节）              val_sds_len:50, val_sds_avail:10, val_zmalloc: 64       encoding raw
APPEND s 10 字节              val_sds_len:60, val_sds_avail:0, val_zmalloc: 64
APPEND s 1 字节               val_sds_len:61, val_sds_avail:63, val_zmalloc: 128
SET big（2000000 字节）       val_sds_len:2000000, val_sds_avail:31606, val_zmalloc: 2031616
APPEND big 40000 字节         val_sds_len:2040000, val_sds_avail:1072950, val_zmalloc: 3112960
SET 44 字节 encoding embstr，SET 45 字节 encoding raw
```

对应的源码在 sds.c 的 _sdsMakeRoomFor()：剩余空间足够时直接返回；否则新长度小于 SDS_MAX_PREALLOC（1 MB）时乘以 2，不小于时加上 1 MB。SET 50 字节时的 10 字节、SET 大字符串时的 31606 字节剩余空间来自内存分配器的取整和协议缓冲区，不是预分配。

### A7 热点计数

MySQL 8.0.44（innodb_flush_log_at_trx_commit 和 sync_binlog 都为 1），Redis 7.4.1，Apple M1 Pro。MySQL 用多个进程同时执行自动提交的 UPDATE counter SET cnt = cnt + 1 WHERE id = 1，最后核对 cnt；Redis 用 redis-benchmark 对同一个键执行 INCR：

```text
MySQL 1 个连接共更新 5000 次：0.92 s，5437 次/秒，cnt = 5000
MySQL 8 个连接共更新 16000 次：2.21 s，7251 次/秒，cnt = 16000
MySQL 50 个连接共更新 20000 次：3.72 s，5383 次/秒，cnt = 20000

$ redis-benchmark -p 6395 -c <连接数> -n 200000 --csv incr counter:1
1 个连接   "incr counter:1","11020.50",...
8 个连接   "incr counter:1","50213.41",...
50 个连接  "incr counter:1","101368.47",...
```

## 参考资料

- Carlson J L. Redis in Action [M]. Manning, 2013.
- [黄健宏. Redis 设计与实现 [M]. 机械工业出版社, 2014.](http://redisbook.com/index.html)
- [REDIS IN ACTION](https://web.archive.org/web/20210421115011/https://redislabs.com/ebook/foreword/)
- [Skip Lists: Done Right](https://ticki.github.io/blog/skip-lists-done-right/)
- [论述 Redis 和 Memcached 的差异](http://www.cnblogs.com/loveincode/p/7411911.html)
- [Redis 3.0 中文版- 分片](http://wiki.jikexueyuan.com/project/redis-guide)
- [Redis 应用场景](http://www.scienjus.com/redis-use-case/)
- [Key eviction | Redis](https://redis.io/docs/latest/develop/reference/eviction/)
- [EXPIRE | Redis](https://redis.io/docs/latest/commands/expire/)
- [Redis Streams](https://redis.io/docs/latest/develop/data-types/streams/)
- [Redis: Scale with Redis Cluster](https://redis.io/docs/latest/operate/oss_and_stack/management/scaling/)
- [High availability with Redis Sentinel](https://redis.io/docs/latest/operate/oss_and_stack/management/sentinel/)
- [Redis replication](https://redis.io/docs/latest/operate/oss_and_stack/management/replication/)
- [Redis persistence](https://redis.io/docs/latest/operate/oss_and_stack/management/persistence/)
- [Transactions | Redis](https://redis.io/docs/latest/develop/interact/transactions/)
- [Scripting with Lua | Redis](https://redis.io/docs/latest/develop/interact/programmability/eval-intro/)
- [Redis 7.4.1 源码 dict.c](https://github.com/redis/redis/blob/7.4.1/src/dict.c)
- [Redis 7.4.1 源码 t_zset.c](https://github.com/redis/redis/blob/7.4.1/src/t_zset.c)
- [Redis 7.4.1 源码 sds.c](https://github.com/redis/redis/blob/7.4.1/src/sds.c)
