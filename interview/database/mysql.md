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
- [java jdbc 接口](#java-jdbc-接口)
- [数据库索引](#数据库索引)
    - [索引类型](#索引类型)
    - [索引比较](#索引比较)
    - [数据库引擎](#数据库引擎)
    - [索引创建](#索引创建)
    - [索引实现方式](#索引实现方式)

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

# java jdbc 接口

Statement 每次执行sql语句，数据库都要执行sql语句的编译 ，最好用于仅执行一次查询并返回结果的情形，效率高于PreparedStatement.

PreparedStatement是预编译的，使用PreparedStatement有几个好处

a. 在执行可变参数的一条SQL时，PreparedStatement比Statement的效率高，因为DBMS预编译一条SQL当然会比多次编译一条SQL的效率要高。

b. 安全性好，有效防止Sql注入等问题。

c.  对于多次重复执行的语句，使用PreparedStament效率会更高一点，并且在这种情况下也比较适合使用batch；

d.  代码的可读性和可维护性。

CallableStatement接口扩展 PreparedStatement，用来调用存储过程,它提供了对输出和输入/输出参数的支持。CallableStatement 接口还具有对 PreparedStatement 接口提供的输入参数的支持。


# 数据库索引

## 索引类型

1、唯一索引 UNIQUE

create unique index stusno on student(sno);

2、主键索引 primary key

数据库表经常有一列或列组合，其值唯一标识表中的每一行。该列称为表的主键。

CREATE TABLE mytable( ID INT NOT NULL, username VARCHAR(16) NOT NULL, PRIMARY KEY(ID) );  

3、聚集索引（也叫聚簇索引）：cluster

在聚集索引中，表中行的物理顺序与键值的逻辑（索引）顺序相同。一个表只能包含一个聚集索引。

聚集索引中，表数据和主键是一起存储的，主键索引的叶结点存储行数据(包含了主键值)，二级索引的叶结点存储行的主键值。使用的是B+树作为索引的存储结构，非叶子节点都是索引关键字，但非叶子节点中的关键字中不存储对应记录的具体内容或内容地址。叶子节点上的数据是主键与具体记录(数据内容)。

4、非聚集索引

对于非聚簇索引表来说（右图），表数据和索引是分成两部分存储的，主键索引和二级索引存储上没有任何区别。使用的是B+树作为索引的存储结构，所有的节点都是索引，叶子节点存储的是索引+索引对应的记录的地址。

![](https://upload-images.jianshu.io/upload_images/2836699-d062eac68af5cd31?imageMogr2/auto-orient/strip%7CimageView2/2/w/696/format/webp)

5、普通索引

create index index_birthday on user_info(birthday);

## 索引比较

聚簇索引的优点：

1、当你需要取出一定范围内的数据时，用聚簇索引和非聚簇索引好

2、当通过聚簇索引查找目标数据时理论上比非聚簇索引要快，因为非聚簇索引定位到对应主键时还要多一次目标记录寻址,即多一次I/O。

聚簇索引的缺点：

1.插入速度严重依赖于插入顺序，按照主键的顺序插入是最快的方式，否则将会出现页分裂，严重影响性能。因此，对于InnoDB表，我们一般都会定义一个自增的ID列为主键。

2.更新主键的代价很高，因为将会导致被更新的行移动。因此，对于InnoDB表，我们一般定义主键为不可更新。

3.二级索引访问需要两次索引查找，第一次找到主键值，第二次根据主键值找到行数据。
二级索引的叶节点存储的是主键值，而不是行指针（非聚簇索引存储的是指针或者说是地址），这是为了减少当出现行移动或数据页分裂时二级索引的维护工作，但会让二级索引占用更多的空间。

4.采用聚簇索引插入新值比采用非聚簇索引插入新值的速度要慢很多，因为插入要保证主键不能重复，判断主键不能重复，采用的方式在不同的索引下面会有很大的性能差距，聚簇索引遍历所有的叶子节点，非聚簇索引也判断所有的叶子节点，但是聚簇索引的叶子节点除了带有主键还有记录值，记录的大小往往比主键要大的多。这样就会导致聚簇索引在判定新记录携带的主键是否重复时进行昂贵的I/O代价。


## 数据库引擎

InnoDB: Mysql 默认的数据库引擎，采用聚簇索。

MyISAM 不管是主键索引，还是二级索引使用的都是非聚簇索引。

## 索引创建

``` sql

// 创建索引
create index index_birthday on user_info(birthday);

// 查询生日在1991年11月1日出生用户的用户名

select user_name from user_info where birthday = '1991-11-1'
```

执行逻辑如下：

首先，通过非聚集索引index_birthday查找birthday等于1991-11-1的所有记录的主键ID值

然后，通过得到的主键ID值执行聚集索引查找，找到主键ID值对就的真实数据（数据行）存储的位置

最后， 从得到的真实数据中取得user_name字段的值返回， 也就是取得最终的结果

## 索引实现方式

1、B+树

多路搜索树

2、散列索引

就是通过散列函数来定位的一种索引，不过很少有单独使用散列索引的，反而是散列文件组织用的比较多。

3、位图索引

位图索引是一种针对多个字段的简单查询设计一种特殊的索引，适用范围比较小，只适用于字段值固定并且值的种类很少的情况，比如性别，只能有男和女，或者级别，状态等等，并且只有在同时对多个这样的字段查询时才能体现出位图的优势。