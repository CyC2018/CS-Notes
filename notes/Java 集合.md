<!-- GFM-TOC -->
* [概览](#概览)
    * [1. List](#1-list)
    * [2. Set](#2-set)
    * [3. Queue](#3-queue)
    * [4. Map](#4-map)
    * [5. Java 1.0/1.1 容器](#5-java-1011-容器)
* [集合中的设计模式](#集合中的设计模式)
    * [1. 迭代器模式](#1-迭代器模式)
    * [2. 适配器模式](#2-适配器模式)
* [散列](#散列)
* [源码分析](#源码分析)
    * [1. ArraList](#1-arralist)
    * [2. LinkedList](#2-linkedlist)
    * [3. Vector](#3-vector)
    * [4. HashMap](#4-hashmap)
    * [5. LinkedHashMap](#5-linkedhashmap)
    * [6. ConcurrentHashMap](#6-concurrenthashmap)
* [参考资料](#参考资料)
<!-- GFM-TOC -->

# 概览

![](https://github.com/CyC2018/InterviewNotes/blob/master/pics/ebf03f56-f957-4435-9f8f-0f605661484d.jpg)

容器主要包括 Collection 和 Map 两种，Collection 又包含了 List、Set 以及 Queue。

## 1. List

- ArrayList：使用数组方法，支持随机访问；

- LinkedList：使用链表实现，只能顺序访问，但是可以快速地在中间插入和删除元素。不仅如此，LinkedList 还可以用作栈、队列和双端队列。

## 2. Set

- HashSet：使用 Hash 实现，支持快速查找，但是失去有序性；

- TreeSet：使用树实现，保持有序，但是查找效率不如 HashSet；

- LinkedListHashSet：具有 HashSet 的查找效率，且内部使用链表维护元素的插入顺序，因此具有有序性。

## 3. Queue

只有两个实现：LinkedList 和 PriorityQueue，其中 LinkedList 支持双向队列。

## 4. Map

- HashMap：使用 Hash 实现

- LinkedHashMap：保持有序，顺序为插入顺序或者最近最少使用（LRU）顺序

- TreeMap：基于红黑树实现

- ConcurrentHashMap：线程安全 Map，不涉及同步加锁

## 5. Java 1.0/1.1 容器

对于旧的容器，我们决不应该使用它们，只需要对它们进行了解。

- Vector：和 ArrayList 类似，但它是线程安全的

- HashTable：和 HashMap 类似，但它是线程安全的

# 集合中的设计模式

## 1. 迭代器模式

从概览图可以看到，每个集合类都有一个 Iterator 对象，可以通过这个迭代器对象来遍历集合中的元素。

[Java 中的迭代器模式](https://github.com/CyC2018/InterviewNotes/blob/master/notes/%E8%AE%BE%E8%AE%A1%E6%A8%A1%E5%BC%8F.md#92-java-%E5%86%85%E7%BD%AE%E7%9A%84%E8%BF%AD%E4%BB%A3%E5%99%A8)

## 2. 适配器模式

java.util.Arrays#asList() 可以把数组类型转换为 List 类型。

```java
 List list = Arrays.asList(1, 2, 3);
 int[] arr = {1, 2, 3};
 list = Arrays.asList(arr);
```

# 散列

使用 hasCode() 来返回散列值，使用的是对象的地址。

而 equals() 是用来判断两个对象是否相等的，相等的两个对象散列值一定要相同，但是散列值相同的两个对象不一定相等。

相等必须满足以下五个性质：

1. 自反性
2. 对称性
3. 传递性
4. 一致性（多次调用 x.equals(y)，结果不变）
5. 对任何不是 null 的对象 x 调用 x.equals(nul) 结果都为 false

# 源码分析

建议先阅读 [算法-查找](https://github.com/CyC2018/InterviewNotes/blob/master/notes/%E7%AE%97%E6%B3%95.md#%E7%AC%AC%E4%B8%89%E7%AB%A0-%E6%9F%A5%E6%89%BE) 部分，对集合类源码的理解有很大帮助。


源码下载：[OpenJDK 1.7](http://download.java.net/openjdk/jdk7)

在线阅读：[7u40-b43](http://grepcode.com/snapshot/repository.grepcode.com/java/root/jdk/openjdk/7u40-b43/)

## 1. ArraList

- 使用数组实现

- 具有动态扩容特性，默认容量为 10，并且在添加元素时使用 ensureCapacity() 保证容量足够，如果容量不够，则扩容为原始容量的 1.5 times + 1.

[ArraList.java](https://github.com/CyC2018/InterviewNotes/blob/master/notes/src/ArrayList.java)


## 2. LinkedList

- LinkedList 是基于双向循环链表实现，头结点不包含数据。

![](https://github.com/CyC2018/InterviewNotes/blob/master/pics/d40c90ad-7943-4574-98a8-8027e5523d53.jpg)

- 链表的索引操作需要遍历链表，LinkedList 的 Entry entry(int index) 方法就是索引操作，但是它有一个优化的操作，就是如果 index 在链表前面，那么就从头往后遍历；如果在后面就从后往前遍历。

[LinkedList.java](https://github.com/CyC2018/InterviewNotes/blob/master/notes/src/LinkedList.java)

## 3. Vector

Vector 的很多实现方法都加入了同步语句，因此是线程安全的。

[Vector.java](https://github.com/CyC2018/InterviewNotes/blob/master/notes/src/Vector.java)

## 4. HashMap

- 使用拉链法来解决冲突。

[Vector.java](https://github.com/CyC2018/InterviewNotes/blob/master/notes/src/HashMap.java)


## 5. LinkedHashMap

- 使用双向链表来保存插入的节点，从而维护一个插入顺序。
- 注意源码中的accessOrder标志位，当它false时，表示双向链表中的元素按照Entry插入LinkedHashMap到中的先后顺序排序，即每次put到LinkedHashMap中的Entry都放在双向链表的尾部，这样遍历双向链表时，Entry的输出顺序便和插入的顺序一致，这也是默认的双向链表的存储顺序；当它为true时，表示双向链表中的元素按照访问的先后顺序排列，可以看到，虽然Entry插入链表的顺序依然是按照其put到LinkedHashMap中的顺序，但put和get方法均有调用recordAccess方法（put方法在key相同，覆盖原有的Entry的情况下调用recordAccess方法），该方法判断accessOrder是否为true，如果是，则将当前访问的Entry（put进来的Entry或get出来的Entry）移到双向链表的尾部（key不相同时，put新Entry时，会调用addEntry，它会调用creatEntry，该方法同样将新插入的元素放入到双向链表的尾部，既符合插入的先后顺序，又符合访问的先后顺序，因为这时该Entry也被访问了），否则，什么也不做。最后说说LinkedHashMap是如何实现LRU的。首先，当accessOrder为true时，才会开启按访问顺序排序的模式，才能用来实现LRU算法。我们可以看到，无论是put方法还是get方法，都会导致目标Entry成为最近访问的Entry，因此便把该Entry加入到了双向链表的末尾（get方法通过调用recordAccess方法来实现，put方法在覆盖已有key的情况下，也是通过调用recordAccess方法来实现，在插入新的Entry时，则是通过createEntry中的addBefore方法来实现），这样便把最近使用了的Entry放入到了双向链表的后面，多次操作后，双向链表前面的Entry便是最近没有使用的，这样当节点个数满的时候，删除的最前面的Entry(head后面的那个Entry)便是最近最少使用的Entry。

[LinkedHashMap.java](https://github.com/CyC2018/InterviewNotes/blob/master/notes/src/HashMap.java)

## 6. ConcurrentHashMap

[探索 ConcurrentHashMap 高并发性的实现机制](https://www.ibm.com/developerworks/cn/java/java-lo-concurrenthashmap/)

[ConcurrentHashMap.java](https://github.com/CyC2018/InterviewNotes/blob/master/notes/src/HashMap.java)

# 参考资料

- Java 编程思想
