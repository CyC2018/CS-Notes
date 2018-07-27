# java基础

## HashMap和ConcurrentHashMap

HashMap和ConcurrentHashMap的最主要的区别就是前者是线程不安全，后者是线程安全的。在不同的JDK版本中，区别也不一样

JDK1.7中：

HashMap使用**链表法**来实现hash冲突节点的存储。ConcurrentHashMap使用Segment 数组存储数据，Segment 通过继承 ReentrantLock 来进行加锁。

JDK1.8中：

HashMap重复hash值的链表元素超过8个，就改成红黑树实现

ConcurrentHashMap 不用segment,改成CAS+synchronized方法实现。

CAS 的含义是“我认为原有的值应该是什么，如果是，则将原有的值更新为新值，否则不做修改，并告诉我原来的值是多少”

参考文档：

- [HashMap? ConcurrentHashMap? 相信看完这篇没人能难住你！](https://crossoverjie.top/2018/07/23/java-senior/ConcurrentHashMap/)

- [Java多线程之CAS](https://blog.csdn.net/u010412719/article/details/52053390)