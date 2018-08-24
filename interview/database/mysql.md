<!-- TOC -->

- [mysql 分区](#mysql-分区)
    - [分区语法](#分区语法)
    - [分区类型](#分区类型)
    - [分区优点](#分区优点)
    - [根据range(范围)分区](#根据range范围分区)
    - [根据List分区](#根据list分区)
    - [根据哈希分区](#根据哈希分区)
    - [修改分区](#修改分区)
- [事务管理](#事务管理)
- [MySQL 事务特性和隔离级别](#mysql-事务特性和隔离级别)
    - [事务的基本要素（ACID）：](#事务的基本要素acid)
    - [事务的并发问题：](#事务的并发问题)
    - [Mysql事务隔离级别：](#mysql事务隔离级别)

<!-- /TOC -->

# mysql 分区

使用 partition by 来实现表的分区。

## 分区语法

``` sql
create table t(id int,name varchar(20)) engine=myisam partition by range(id);
```

## 分区类型

分区具有如下4种类型：

- Range分区：是对一个连续性的行值，按范围进行分区；比如：id小于100；id大于100小于200；
- List分区：跟range分区类似，不过它存放的是一个离散值的集合。
- Hash分区：对用户定义的表达式所返回的值来进行分区。可以写partitions (分区数目)，或直接使用分区语句,比如partition p0 values in…..。
- Key分区：与hash分区类似，只不过分区支持一列或多列，并且MySQL服务器自身提供hash函数。

## 分区优点

1. 可以提高数据库的性能；
2. 对大表(行较多)的维护更快、更容易，因为数据分布在不同的逻辑文件上；
3. 删除分区或它的数据是容易的，因为它不影响其他表。

## 根据range(范围)分区

``` sql
create table orders_range
(
id int auto_increment primary key,
customer_surname varchar (30),
store_id int,
salesperson_id int,
order_Date date,
note varchar(500)
)  engine=myisam
partition by range(id)
(
partition p0 values less than(5),
partition p1 values less than(10),
partition p3 values less than(15)
);
```

## 根据List分区

``` sql 
create table orders_list
(
id int auto_increment,
customer_surname varchar(30),
store_id int,
salesperson_id int,
order_Date date,
note varchar(500),
index idx(id)
) engine=myisam  partition by list(store_id)
(
partition p0 values in(1,3),
partition p1 values in2,4,6),
partition p3 values in(10)
);
```

## 根据哈希分区

``` sql 
按hash进行分区：
create table orders_hash
(
id int auto_increment primary key,
cutomer_surname varchar(30),
store_id int,
salesperon_id int,
order_date date,
note varcahr(500)
) engine=myisam  partition by hash(id) partitions 4;
```

## 修改分区

使用alter命令来修改表的分区

``` sql

// 添加分区
Alter
table
orders_range
add
partition
(
Partition p5 values less than(maxvalue)
)

// 删除分区
Alter table orders_range remove partitioning;
```

参考链接：
- [MYSQL之水平分区----MySQL partition分区I（5.1）](https://www.cnblogs.com/aipiaoborensheng/p/6394702.html)

# 事务管理

- 事务（transaction）指一组 SQL 语句；
- 回退（rollback）指撤销指定 SQL 语句的过程；
- 提交（commit）指将未存储的 SQL 语句结果写入数据库表；
- 保留点（savepoint）指事务处理中设置的临时占位符（placeholder），你可以对它发布回退（与回退整个事务处理不同）。

不能回退 SELECT 语句，回退 SELECT 语句也没意义；也不能回退 CREATE 和 DROP 语句。

MySQL 的事务提交默认是隐式提交，每执行一条语句就把这条语句当成一个事务然后进行提交。当出现 START TRANSACTION 语句时，会关闭隐式提交；当 COMMIT 或 ROLLBACK 语句执行后，事务会自动关闭，重新恢复隐式提交。

通过设置 autocommit 为 0 可以取消自动提交；autocommit 标记是针对每个连接而不是针对服务器的。

如果没有设置保留点，ROLLBACK 会回退到 START TRANSACTION 语句处；如果设置了保留点，并且在 ROLLBACK 中指定该保留点，则会回退到该保留点。

# MySQL 事务特性和隔离级别

## 事务的基本要素（ACID）：

1. 原子性(Atomicity): 事务开始后所有操作，要么全部做完，要么全部不做，不可能停滞在中间环节。事务执行过程中出错，会回滚到事务开始前的状态，所有的操作就像没有发生一样。也就是说事务是一个不可分割的整体，就像化学中学过的原子，是物质构成的基本单位。

2. 一致性（Consistency）：事务开始前和结束后，数据库的完整性约束没有被破坏 。比如A向B转账，不可能A扣了钱，B却没收到。

3. 隔离性（Isolation）：同一时间，只允许一个事务请求同一数据，不同的事务之间彼此没有任何干扰。比如A正在从一张银行卡中取钱，在A取钱的过程结束前，B不能向这张卡转账。

4. 持久性（Durability）：事务完成后，事务对数据库的所有更新将被保存到数据库，不能回滚。

## 事务的并发问题：

0、丢失修改：T1 和 T2 两个事务都对一个数据进行修改，T1 先修改，T2 随后修改，T2 的修改覆盖了 T1 的修改。

1、脏读：事务A读取了事务B更新的数据，然后B回滚操作，那么A读取到的数据是脏数据

2、不可重复读：事务 A 多次读取同一数据，事务 B 在事务A多次读取的过程中，对数据作了更新并提交，导致事务A多次读取同一数据时，结果不一致。

3、幻读：系统管理员A将数据库中所有学生的成绩从具体分数改为ABCDE等级，但是系统管理员B就在这个时候插入了一条具体分数的记录，当系统管理员A改结束后发现还有一条记录没有改过来，就好像发生了幻觉一样，这就叫幻读。

小结：不可重复读的和幻读很容易混淆，不可重复读侧重于修改，幻读侧重于新增或删除。解决不可重复读的问题只需锁住满足条件的行，解决幻读需要锁表

## Mysql事务隔离级别：

事务隔离级别	| 脏读	| 不可重复读	| 幻读
---|---|---|---
读未提交（read-uncommitted）	| 是 | 	是	| 是
不可重复读（read-committed）	| 否 |	是	| 是
可重复读（repeatable-read）     | 否 |  否  | 是
串行化（serializable）	        | 否 |  否  | 否