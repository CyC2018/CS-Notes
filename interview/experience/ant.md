# 蚂蚁金服面经

## 蚂蚁金服二面

原文：http://www.54tianzhisheng.cn/2018/07/31/alipay02/

1、自我介绍、工作经历、技术栈

2、项目中你学到了什么技术？（把三项目具体描述了很久）

3、微服务划分的粒度

4、微服务的高可用怎么保证的？

5、常用的负载均衡，该怎么用，你能说下吗？

>答：负载均衡的算法实现主要有：
轮询、加权轮询、最少链接、加权最少链接、随机算法、源地址哈希算法。

> 通常负载均衡用于无状态的应用服务器，平衡服务器的压力，实现服务的高可用性。

6、网关能够为后端服务带来哪些好处？

> 答：网关服务是单一访问点，并充当多项服务的代理，服务网关启用了跨所有服务的路由转发、过滤和公共处理等条件。可以做到统一接入、流量管控、安全防护、业务隔离等功能。

<div align="center"><img src="http://p179cyr45.bkt.clouddn.com/17-12-21/11334157.jpg" width = "50%" /></div>

7、Spring Bean 的生命周期

8、xml 中配置的 init、destroy 方法怎么可以做到调用具体的方法？

9、反射的机制

> 答: java的反射机制能够获取对象的所有构造方法,所有的成员变量,泛型类型

[参考链接](https://blog.csdn.net/gdutxiaoxu/article/details/68947735)

10、Object 类中的方法

- getClass()
- hashCode()
- equals()
- toString()
- notify()
- notifyAll()
- wait()

11、hashcode 和 equals 方法常用地方

> 答: hashcode 和 equals 都是Object类的方法，hashcode用来求哈希码，返回的是一个int整数，这个哈希码的作用是确定该对象在哈希表中的索引位置。equals方法通常用于判断两个对象是否相等。**类的equal函数返回true，则hashcode一定相等；但类的hashcode相等，不一定得到对象相等**

> 在创建类的散列表的时候（HashMap,HashTable,HashSet等），hashcode()和equals()函数是有关系的，在这种情况下,若要判断两个对象是否相等，除了要覆盖equals方法，也要覆盖hashcode方法。

12、对象比较是否相同

> 答：使用“==”判断对象是否是同一个对象（比较地址），使用equals函数比较对象的值是否相等。

13、hashmap put 方法存放的时候怎么判断是否是重复的

> 答：首先计算key的hash值，然后计算hash值和hashMap的数组长度-1的与值，如果对应的位置没有元素，则存放到该位置，否则将该点插入到原来有的位置的前面（链表法），如果超过8个元素，则将链表改为红黑树（1.8+）

14、Object toString 方法常用的地方，为什么要重写该方法

> 答：经常用在输出对象值的时候，重写该方法可以便于对象的格式化输出。

15、Set 和 List 区别？

> Set 存储不重复的数据，且无序。List可以存储重复数据，且有序。

16、ArrayList 和 LinkedList 区别

> ArrayList底层是数组实现的，随机访问快，但是插入和删除慢。
> LinkedList底层是链表实现的，随机访问慢，但是插入和删除快。

17、如果存取相同的数据，ArrayList 和 LinkedList 谁占用空间更大？

> 显然是ArrayList 占用空间更大，因为ArrayList内部采用的是数据存储。没当数据达到数组的长度，就会将数组长度增长为原来的1.5倍。

ArrayList 数组增长的源码。
``` java
    private void grow(int minCapacity) {
        // overflow-conscious code
        int oldCapacity = elementData.length;
        int newCapacity = oldCapacity + (oldCapacity >> 1);
        if (newCapacity - minCapacity < 0)
            newCapacity = minCapacity;
        if (newCapacity - MAX_ARRAY_SIZE > 0)
            newCapacity = hugeCapacity(minCapacity);
        // minCapacity is usually close to size, so this is a win:
        elementData = Arrays.copyOf(elementData, newCapacity);
    }
```

18、Set 存的顺序是有序的吗？

> 无序的, 数据的存入和取出无序。其中TreeSet会对Set的元素进行排序。

19、常见 Set 的实现有哪些？

> HashSet, TreeSet, LinkedHashSet

> HashSet是使用哈希表（hash table）实现的，其中的元素是无序的。HashSet的add、remove、contains方法 的时间复杂度为常量O(1)。

> TreeSet使用树形结构（算法书中的红黑树red-black tree）实现的。TreeSet中的元素是可排序的，但add、remove和contains方法的时间复杂度为O(log(n))。TreeSet还提供了first()、last()、headSet()、tailSet()等方法来操作排序后的集合。

> LinkedHashSet介于HashSet和TreeSet之间。它基于一个由链表实现的哈希表，保留了元素插入顺序。LinkedHashSet中基本方法的时间复杂度为O(1)。

20、TreeSet 对存入对数据有什么要求呢？

> TreeSet是一个有序集合，TreeSet中的元素将按照升序排列，缺省是按照自然排序进行排列，意味着TreeSet中的元素要实现Comparable接口。或者有一个自定义的比较器。 

21、HashSet 的底层实现呢

> HashSet实现Set接口，由哈希表（实际上是一个HashMap实例）支持。它不保证set 的迭代顺序；特别是它不保证该顺序恒久不变。此类允许使用null元素。

22、TreeSet 底层源码有看过吗？

23、HashSet 是不是线程安全的？为什么不是线程安全的？

> HashSet不是线程安全的，没有使用锁机制。

24、Java 中有哪些线程安全的 Map？

> ConcurrentHashMap HashTable SynchronizedMap

    private Map<String, Object> map = Collections.synchronizedMap(new HashMap<String, Object>());

25、Concurrenthashmap 是怎么做到线程安全的？

> 1.7 采用Segment 的方式存储数据，Segment继承了ReentrantLock
1.8 采用 Synchronized + CAS 的方式实现了线程安全

26、HashTable 你了解过吗？

> HashTable 相比HashMap，出现的早（1.1），实现了线程安全，但是HashTable 继承的是Dictionary抽象类,对HashMap的一些方法做了同步处理。

27、如何保证线程安全问题？

> 1. 悲观锁（Synchronized, ReentrantLock)，也叫互斥同步
2. 乐观锁（CAS），也叫非互斥同步
3. 无同步方案（可重入代码，栈封闭，Thread Local Storage， final)

28、synchronized、lock

> synchronized 是jvm实现的一个互斥锁，lock是jdk提供的一个锁机制。

29、volatile 的原子性问题？为什么 i++ 这种不支持原子性？从计算机原理的设计来讲下不能保证原子性的原因

> 被volatile修饰的变量在每次写入之后，将处理器缓存回写到内存中，一个春利器的焕春会写到内存会导致其他处理器的缓存无效。

> i++ 不属于原子操作,通过查看字节码会发现，i++的操作是分步的，如下：

``` java
void f1();
Code:
0: aload_0
1: dup
2: getfield #2; //Field i:I
5: iconst_1
6: iadd
7: putfield #2; //Field i:I
10: return
```

> 因此，在多线程的情况下，i++的指令是分步的，所以不管是多少次i++,最终只能加一次

``` 
package com.raorao.java.thread;

/**
 * i++ 的原子性证明.
 *
 * @author Xiong Raorao
 * @since 2018-08-14-15:15
 */
public class IPlusPlus {

  private static volatile int index = 0;

  public static void main(String[] args) throws InterruptedException {
    for (int i = 0; i < 10; i++) {
      new Thread(() -> {
        synchronized (IPlusPlus.class){
          for (int j = 0; j < 10000; j++) {
            index++;
          }
        }
        System.out.println(Thread.currentThread().getName() + ", index = " + index);
      }).start();
    }
    Thread.sleep(2000);
    System.out.println(index);
  }

}

```

如果不采用synchronized 的话，最终输出的结果是小雨100000的。

30、happens before 原理

> happens before 是 JMM中最核心的概念，happens before 用来指定两个操作之间的执行顺序，JMM通过happens before 来保证跨线程的内存可见性保证（如果A线程的写操作a和B线程的读操作b存在happens before，尽管a和b操作在不同的线程中执行，但是JMM保证a操作对b可见。

31、cas 操作

> CAS 的语义是指：如果发现一个数的预期值和现在读取到的值相等，则将更新新值，否则不执行更新。但是无论是否更新了变量的值，返回的依旧是变量的旧值，CAS也是原子操作。

32、lock 和 synchronized 的区别？

> 一个是jdk实现的，一个是jvm实现的，都是互斥锁

33、公平锁和非公平锁

> 公平锁指的是多个线程在等待同一个锁时，必须按照申请所的时间顺序来依次获得锁，而非公平锁不能保证这一点。synchronized 锁是非公平的，ReentrantLock 可以在初始化的时候，通过带布尔值的构造函数来实现公平锁。

34、Java 读写锁

> Java 读写锁包含了了两个锁，一个是读操作的锁，称为共享锁；一个是写操作的锁，称为排它锁。也就是说多个读锁之间不互斥，读锁和写锁以及写锁和写锁之间是互斥的。相关类ReentrantReadWriteLock类。

35、读写锁设计主要解决什么问题？

> 提高读操作的速度吧。我想的

36、你项目除了写 Java 代码，还有前端代码，那你知道前端有哪些框架吗？

37、MySQL 分页查询语句

> 使用limit关键字， select * from table_name limit 0,5 ; 表示查询表的前5条数据

38、MySQL 事务特性和隔离级别

**事务的基本要素（ACID）：**

1. 原子性(Atomicity): 事务开始后所有操作，要么全部做完，要么全部不做，不可能停滞在中间环节。事务执行过程中出错，会回滚到事务开始前的状态，所有的操作就像没有发生一样。也就是说事务是一个不可分割的整体，就像化学中学过的原子，是物质构成的基本单位。

2. 一致性（Consistency）：事务开始前和结束后，数据库的完整性约束没有被破坏 。比如A向B转账，不可能A扣了钱，B却没收到。

3. 隔离性（Isolation）：同一时间，只允许一个事务请求同一数据，不同的事务之间彼此没有任何干扰。比如A正在从一张银行卡中取钱，在A取钱的过程结束前，B不能向这张卡转账。

4. 持久性（Durability）：事务完成后，事务对数据库的所有更新将被保存到数据库，不能回滚。

**事务的并发问题：**

1、脏读：事务A读取了事务B更新的数据，然后B回滚操作，那么A读取到的数据是脏数据

2、不可重复读：事务 A 多次读取同一数据，事务 B 在事务A多次读取的过程中，对数据作了更新并提交，导致事务A多次读取同一数据时，结果 不一致。

3、幻读：系统管理员A将数据库中所有学生的成绩从具体分数改为ABCDE等级，但是系统管理员B就在这个时候插入了一条具体分数的记录，当系统管理员A改结束后发现还有一条记录没有改过来，就好像发生了幻觉一样，这就叫幻读。

小结：不可重复读的和幻读很容易混淆，不可重复读侧重于修改，幻读侧重于新增或删除。解决不可重复读的问题只需锁住满足条件的行，解决幻读需要锁表

**Mysql事务隔离级别：**

事务隔离级别	| 脏读	| 不可重复读	| 幻读
---|---|---|---
读未提交（read-uncommitted）	| 是 | 	是	| 是
不可重复读（read-committed）	| 否 |	是	| 是
可重复读（repeatable-read）     | 否 |  否  | 是
串行化（serializable）	        | 否 |  否  | 否

39、不可重复读会出现在什么场景？

事务 A 多次读取同一数据，事务 B 在事务A多次读取的过程中，对数据作了更新并提交，导致事务A多次读取同一数据时，结果 不一致。

40、sql having 的使用场景

> 给分组设置条件

41、前端浏览器地址的一个 http 请求到后端整个流程是怎么样？能够说下吗？

> 首先将请求的URL的域名部分解析成ip地址，然后建立HTTP链接，发起请求，服务器给出响应，浏览器负责将响应的内容解析成Web页面。

42、http 默认端口，https 默认端口

> 80 443

43、DNS 你知道是干嘛的吗？

> 解析域名

44、你们开发用的 ide 是啥？你能说下 idea 的常用几个快捷键吧？

45、代码版本管理你们用的是啥？

> git

46、git rebase 和 merge 有什么区别？

> rebase 是在上一个分支的后面加上自己的分支，merge则是合并分支

47、你们公司加班多吗？

48、后面一起聊 high 了，之间扯了些蛋，哈哈哈
