<!-- TOC -->

- [java基础](#java基础)
    - [java 语言基础](#java-语言基础)
        - [java自动拆装箱：](#java自动拆装箱)
        - [java 四种引用及其应用场景](#java-四种引用及其应用场景)
        - [foreach与正常for循环效率对比](#foreach与正常for循环效率对比)
        - [java反射的作用于原理](#java反射的作用于原理)
- [数据库](#数据库)
    - [truncate与 delete区别](#truncate与-delete区别)
    - [B+树索引和哈希索引的区别](#b树索引和哈希索引的区别)

<!-- /TOC -->

# java基础

## java 语言基础

### java自动拆装箱：

自动装箱是将一个java定义的基本数据类型赋值给相应封装类的变量。 拆箱与装箱是相反的操作，自动拆箱则是将一个封装类的变量赋值给相应基本数据类型的变量。

### java 四种引用及其应用场景

1、强引用
最普遍的一种引用方式，如String s = "abc"，变量s就是字符串“abc”的强引用，只要强引用存在，则垃圾回收器就不会回收这个对象。

2、软引用（SoftReference）
用于描述还有用但非必须的对象，如果内存足够，不回收，如果内存不足，则回收。一般用于实现内存敏感的高速缓存，软引用可以和引用队列ReferenceQueue联合使用，如果软引用的对象被垃圾回收，JVM就会把这个软引用加入到与之关联的引用队列中。

3、弱引用（WeakReference）
弱引用和软引用大致相同，弱引用与软引用的区别在于：只具有弱引用的对象拥有更短暂的生命周期。在垃圾回收器线程扫描它所管辖的内存区域的过程中，一旦发现了只具有弱引用的对象，不管当前内存空间足够与否，都会回收它的内存。

4、虚引用（PhantomReference）
就是形同虚设，与其他几种引用都不同，虚引用并不会决定对象的生命周期。如果一个对象仅持有虚引用，那么它就和没有任何引用一样，在任何时候都可能被垃圾回收器回收。 虚引用主要用来跟踪对象被垃圾回收器回收的活动。


虚引用与软引用和弱引用的一个区别在于：
虚引用必须和引用队列 （ReferenceQueue）联合使用。当垃圾回收器准备回收一个对象时，如果发现它还有虚引，就会在回收对象的内存之前，把这个虚引用加入到与之关联的引用队列中。

### foreach与正常for循环效率对比

用for循环arrayList 10万次花费时间：5毫秒。
用foreach循环arrayList 10万次花费时间：7毫秒。
用for循环linkList 10万次花费时间：4481毫秒。
用foreach循环linkList 10万次花费时间：5毫秒。
循环ArrayList时，普通for循环比foreach循环花费的时间要少一点。
循环LinkList时，普通for循环比foreach循环花费的时间要多很多。
当我将循环次数提升到一百万次的时候，循环ArrayList，普通for循环还是比foreach要快一点；但是普通for循环在循环LinkList时，程序直接卡死。
ArrayList：ArrayList是采用数组的形式保存对象的，这种方式将对象放在连续的内存块中，所以插入和删除时比较麻烦，查询比较方便。
LinkList：LinkList是将对象放在独立的空间中，而且每个空间中还保存下一个空间的索引，也就是数据结构中的链表结构，插入和删除比较方便，但是查找很麻烦，要从第一个开始遍历。

结论：
**需要循环数组结构的数据时，建议使用普通for循环，因为for循环采用下标访问，对于数组结构的数据来说，采用下标访问比较好。
需要循环链表结构的数据时，一定不要使用普通for循环，这种做法很糟糕，数据量大的时候有可能会导致系统崩溃。**

链表：使用foreach
数组：使用for循环

### java反射的作用于原理

Java 反射是可以让我们在运行时，通过一个类的Class对象来获取它获取类的方法、属性、父类、接口等类的内部信息的机制。

这种动态获取信息以及动态调用对象的方法的功能称为JAVA的反射。

# 数据库

##  truncate与 delete区别

TRUNCATE TABLE 在功能上与不带 WHERE 子句的 DELETE 语句相同：二者均删除表中的全部行。但 TRUNCATE TABLE 比 DELETE 速度快，且使用的系统和事务日志资源少。 DELETE 语句每次删除一行，并在事务日志中为所删除的每行记录一项。
TRUNCATE TABLE 通过释放存储表数据所用的数据页来删除数据，并且只在事务日志中记录页的释放。 TRUNCATE,DELETE,DROP 放在一起比较：
TRUNCATE TABLE ：删除内容、释放空间但不删除定义。
DELETE TABLE: 删除内容不删除定义，不释放空间。
DROP TABLE ：删除内容和定义，释放空间

## B+树索引和哈希索引的区别

B+树是一个平衡的多叉树，从根节点到每个叶子节点的高度差值不超过1，而且同层级的节点间有指针相互链接，是有序的

![](https://mmbiz.qpic.cn/mmbiz_jpg/UtWdDgynLdYnMu5lfXNAYzW0PPSOB8Pss8E5IlpSXicQbuCj5p3fN1vGtKkdUgeZ4IvYBx4IlFMLI4peDFvTV2w/640?wx_fmt=jpeg&tp=webp&wxfrom=5&wx_lazy=1)

哈希索引就是采用一定的哈希算法，把键值换算成新的哈希值，检索时不需要类似B+树那样从根节点到叶子节点逐级查找，只需一次哈希算法即可,是无序的

![](https://mmbiz.qpic.cn/mmbiz_jpg/UtWdDgynLdYnMu5lfXNAYzW0PPSOB8PsAdicCricepbjicRIBIOlKdDPWlHroEiaYVgdDgicMMWbsuIlmmA4kOEVVog/640?wx_fmt=jpeg&tp=webp&wxfrom=5&wx_lazy=1)

**优势对比：**
