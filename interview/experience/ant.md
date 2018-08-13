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

HashSet是使用哈希表（hash table）实现的，其中的元素是无序的。HashSet的add、remove、contains方法 的时间复杂度为常量O(1)。

TreeSet使用树形结构（算法书中的红黑树red-black tree）实现的。TreeSet中的元素是可排序的，但add、remove和contains方法的时间复杂度为O(log(n))。TreeSet还提供了first()、last()、headSet()、tailSet()等方法来操作排序后的集合。

LinkedHashSet介于HashSet和TreeSet之间。它基于一个由链表实现的哈希表，保留了元素插入顺序。LinkedHashSet中基本方法的时间复杂度为O(1)。

20、TreeSet 对存入对数据有什么要求呢？

21、HashSet 的底层实现呢

22、TreeSet 底层源码有看过吗？

23、HashSet 是不是线程安全的？为什么不是线程安全的？

HashSet不是线程安全的，没有使用锁机制。

24、Java 中有哪些线程安全的 Map？

> ConcurrentHashMap HashTable

25、Concurrenthashmap 是怎么做到线程安全的？

> 1.7 采用Segment 的方式存储数据，Segment继承了ReentrantLock
1.8 采用 Synchronized + CAS 的方式实现了线程安全

26、HashTable 你了解过吗？

HashTable 相比HashMap，实现了线程安全，但是

27、如何保证线程安全问题？

> 1. 悲观锁（Synchronized, ReentrantLock)，也叫互斥同步
2. 乐观锁（CAS），也叫非互斥同步
3. 无同步方案（可重入代码，栈封闭，Thread Local Storage)

28、synchronized、lock

29、volatile 的原子性问题？为什么 i++ 这种不支持原子性？从计算机原理的设计来讲下不能保证原子性的原因

30、happens before 原理

31、cas 操作

32、lock 和 synchronized 的区别？

33、公平锁和非公平锁

34、Java 读写锁

35、读写锁设计主要解决什么问题？

36、你项目除了写 Java 代码，还有前端代码，那你知道前端有哪些框架吗？

37、MySQL 分页查询语句

38、MySQL 事务特性和隔离级别

39、不可重复读会出现在什么场景？

40、sql having 的使用场景

41、前端浏览器地址的一个 http 请求到后端整个流程是怎么样？能够说下吗？

42、http 默认端口，https 默认端口

43、DNS 你知道是干嘛的吗？

44、你们开发用的 ide 是啥？你能说下 idea 的常用几个快捷键吧？

45、代码版本管理你们用的是啥？

46、git rebase 和 merge 有什么区别？

47、你们公司加班多吗？

48、后面一起聊 high 了，之间扯了些蛋，哈哈哈
