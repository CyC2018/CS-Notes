<!-- TOC -->

- [HashMap ConcurrentHashMap Hashtable](#hashmap-concurrenthashmap-hashtable)
    - [为什么HashMap线程不安全](#为什么hashmap线程不安全)
    - [如何线程安全的使用hashmap](#如何线程安全的使用hashmap)
    - [TreeMap、HashMap、LindedHashMap的区别](#treemaphashmaplindedhashmap的区别)
- [try catch finally](#try-catch-finally)
- [java this 和 super的用法](#java-this-和-super的用法)
    - [this](#this)
    - [super](#super)
    - [super和this的异同：](#super和this的异同)
- [抽象类和接口](#抽象类和接口)
- [java 重写和重载的区别](#java-重写和重载的区别)
- [Synchronized 和 volitate区别](#synchronized-和-volitate区别)
- [Synchronized 的内部实现](#synchronized-的内部实现)
- [异常](#异常)
- [String StringBuffer StringBuilder的区别](#string-stringbuffer-stringbuilder的区别)
    - [运行速度：](#运行速度)
    - [线程安全](#线程安全)
    - [总结](#总结)
- [java 如何实现序列化](#java-如何实现序列化)
- [什么是cookie？Session和cookie有什么区别？](#什么是cookiesession和cookie有什么区别)
- [死锁的产生以及如何避免](#死锁的产生以及如何避免)
    - [死锁产生条件](#死锁产生条件)
    - [死锁避免](#死锁避免)
    - [死锁产生的例子](#死锁产生的例子)
    - [死锁解除](#死锁解除)
- [finalize()方法](#finalize方法)
- [JVM内存分配策略、各个代区、GC类别](#jvm内存分配策略各个代区gc类别)
    - [各个代区](#各个代区)
    - [GC类别](#gc类别)
    - [分配策略](#分配策略)
    - [触发条件](#触发条件)
- [进程和线程区别](#进程和线程区别)
- [java 8 新特性](#java-8-新特性)
    - [Stream](#stream)
    - [Optional](#optional)
    - [更好的类型推断](#更好的类型推断)
    - [方法引用](#方法引用)
    - [Lambda 表达式](#lambda-表达式)
    - [接口默认方法](#接口默认方法)
- [socket 编程](#socket-编程)
- [Java 集合类的底层实现](#java-集合类的底层实现)
- [.class 和 getclass的区别](#class-和-getclass的区别)
    - [加载时机不同](#加载时机不同)
    - [静态内部类](#静态内部类)
- [参考文档](#参考文档)

<!-- /TOC -->

# HashMap ConcurrentHashMap Hashtable

HashMap和ConcurrentHashMap的最主要的区别就是前者是线程不安全，后者是线程安全的。在不同的JDK版本中，区别也不一样

JDK1.7中：

HashMap使用**链表法**来实现hash冲突节点的存储。ConcurrentHashMap使用Segment 数组存储数据，Segment 通过继承 ReentrantLock 来进行加锁。

JDK1.8中：

HashMap重复hash值的链表元素超过8个，就改成红黑树实现

ConcurrentHashMap 不用segment,改成CAS+synchronized方法实现。

CAS 的含义是“我认为原有的值应该是什么，如果是，则将原有的值更新为新值，否则不做修改，并告诉我原来的值是多少”

Hashtable 继承自陈旧的Directory，使用synchronized 同步，但是**不允许key和value为空**

Hashtable使用Enumeration，HashMap使用Iterator

HashMap 的迭代器：遍历的时候，根据Node数组的索引自然顺序，forEach
Hashtable 除了Iterator,自己实现了迭代器Enumeration，但是是从Node的**尾部到头部**开始遍历，不一样

hashtable elements() 方法获取的迭代器的下一个元素

``` java
@SuppressWarnings("unchecked")
        public T nextElement() {
            Entry<?,?> et = entry;
            int i = index; // index 为元素的长度
            Entry<?,?>[] t = table;
            /* Use locals for faster loop iteration */
            while (et == null && i > 0) {
                et = t[--i];
            }
            entry = et;
            index = i;
            if (et != null) {
                Entry<?,?> e = lastReturned = entry;
                entry = e.next;
                return type == KEYS ? (T)e.key : (type == VALUES ? (T)e.value : (T)e);
            }
            throw new NoSuchElementException("Hashtable Enumerator");
        }

```

HashTable虽然性能上不如ConcurrentHashMap，但并不能完全被取代，两者的迭代器的一致性不同的，HashTable的迭代器是强一致性的，而ConcurrentHashMap是弱一致的。 

ConcurrentHashMap的get，clear，iterator 都是弱一致性的。 Doug Lea 也将这个判断留给用户自己决定是否使用ConcurrentHashMap。

弱一致性的意思就是，put一个元素进去之后，不是马上对该元素可见。

## 为什么HashMap线程不安全

HashMap 在并发执行 put 操作时会引起死循环，导致 CPU 利用率接近100%。因为多线程会导致 HashMap 的 Node 链表形成环形数据结构，一旦形成环形数据结构，Node 的 next 节点永远不为空，就会在获取 Node 时产生死循环。

## 如何线程安全的使用hashmap

三种方法：

``` java
Map<String, String> hashtable = new Hashtable<>();
//synchronizedMap
Map<String, String> synchronizedHashMap = Collections.synchronizedMap(new HashMap<String, String>());
//ConcurrentHashMap
Map<String, String> concurrentHashMap = new ConcurrentHashMap<>();
```

## TreeMap、HashMap、LindedHashMap的区别

LinkedHashMap可以保证HashMap集合有序，存入的顺序和取出的顺序一致。LinekdHashMap的Entry继承自HashMap.Node, 提供了双向指针。

LinkedHashMap 继承了HashMap，hashmap预留了三个函数，便于linkedHashMap对元素进行后续操作，下面三个函数在LinkedHashMap都有实现。

``` java
    // Callbacks to allow LinkedHashMap post-actions
    void afterNodeAccess(Node<K,V> p) { }
    void afterNodeInsertion(boolean evict) { }
    void afterNodeRemoval(Node<K,V> p) { }
```

TreeMap实现SortMap接口，能够把它保存的记录根据键排序,默认是按键值的升序排序，也可以指定排序的比较器，当用Iterator遍历TreeMap时，得到的记录是排过序的。

HashMap不保证顺序，即为无序的，具有很快的访问速度。
HashMap最多只允许一条记录的键为Null;允许多条记录的值为 Null。

HashMap不支持线程的同步。
我们在开发的过程中使用HashMap比较多，在Map中在Map 中插入、删除和定位元素，HashMap 是最好的选择。

但如果您要按自然顺序或自定义顺序遍历键，那么TreeMap会更好。

如果需要输出的顺序和输入的相同,那么用LinkedHashMap 可以实现,它还可以按读取顺序来排列。

总结：其实联系到三种hashmap的底层实现原理，很容易想到，TreeMap 的底层使用的是二叉堆来实现的，自然能够保证自动排序，HashMap底层使用数组实现，使用迭代器遍历的话，是根据key的hash值在存储表的索引来确定的，是无序的。LinkedHashMap底层使用的链表来存储数据，可根据插入的顺序来读取数据。

# try catch finally

try?catch?finally，try里有return，finally还执行么？

肯定会执行。finally{}块的代码。 只有在try{}块中包含遇到System.exit(0)。 之类的导致Java虚拟机直接退出的语句才会不执行。

当程序执行try{}遇到return时，程序会先执行return语句，但并不会立即返回——也就是把return语句要做的一切事情都准备好，也就是在将要返回、但并未返回的时候，程序把执行流程转去执行finally块，当finally块执行完成后就直接返回刚才return语句已经准备好的结果。

# java this 和 super的用法

## this 

this是自身的一个对象，代表对象本身，可以理解为：指向对象本身的一个指针。 

this 的用法主要有三种：

- 普通的直接引用，this 相当于当前对象本身
- 形参与成员名字重名，用this来区分
- 引用构造函数 （**必须放在构造函数的第一行**）

``` java
class Person {
    private int age = 10;
    public Person(){
    System.out.println("初始化年龄："+age);
}
    public int GetAge(int age){
        this.age = age;
        return this.age;
    }
}
```

## super

super 指的是自己超（父）类对象的一个指针，而这个超类指的是离自己最近的一个父类。

super 也有三种用法：

- 普通的直接引用
- 子类中的成员变量或方法与父类中的成员变量或方法同名
- 引用构造函数

``` java
class Country {
    String name;
    void value() {
       name = "China";
    }
}
  
class City extends Country {
    String name;
    void value() {
    name = "Shanghai";
    super.value();      //调用父类的方法
    System.out.println(name);
    System.out.println(super.name);
    }
  
    public static void main(String[] args) {
       City c=new City();
       c.value();
       }
}
```

**super 作为引用构造函数的时候，必须放在第一行**

``` java
class Person { 
    public static void prt(String s) { 
       System.out.println(s); 
    } 
   
    Person() { 
       prt("父类·无参数构造方法： "+"A Person."); 
    }//构造方法(1) 
    
    Person(String name) { 
       prt("父类·含一个参数的构造方法： "+"A person's name is " + name); 
    }//构造方法(2) 
} 
    
public class Chinese extends Person { 
    Chinese() { 
       super(); // 调用父类构造方法（1） 
       prt("子类·调用父类”无参数构造方法“： "+"A chinese coder."); 
    } 
    
    Chinese(String name) { 
       super(name);// 调用父类具有相同形参的构造方法（2） 
       prt("子类·调用父类”含一个参数的构造方法“： "+"his name is " + name); 
    } 
    
    Chinese(String name, int age) { 
       this(name);// 调用具有相同形参的构造方法（3） 
       prt("子类：调用子类具有相同形参的构造方法：his age is " + age); 
    } 
    
    public static void main(String[] args) { 
       Chinese cn = new Chinese(); 
       cn = new Chinese("codersai"); 
       cn = new Chinese("codersai", 18); 
    } 
}
```

## super和this的异同：

super（参数）：调用基类中的某一个构造函数（应该为构造函数中的第一条语句） 
this（参数）：调用本类中另一种形成的构造函数（应该为构造函数中的第一条语句）
super:　它引用当前对象的直接父类中的成员（用来访问直接父类中被隐藏的父类中成员数据或函数，基类与派生类中有相同成员定义时如：super.变量名    super.成员函数据名（实参）
this：它代表当前对象名（在程序中易产生二义性之处，应使用this来指明当前对象；如果函数的形参与类中的成员数据同名，这时需用this来指明成员变量名）
调用super()必须写在子类构造方法的第一行，否则编译不通过。每个子类构造方法的第一条语句，都是隐含地调用super()，如果父类没有这种形式的构造函数，那么在编译的时候就会报错。
super()和this()类似,区别是，super()从子类中调用父类的构造方法，this()在同一类内调用其它方法。
super()和this()均需放在构造方法内第一行。
尽管可以用this调用一个构造器，但却不能调用两个。
this和super不能同时出现在一个构造函数里面，因为this必然会调用其它的构造函数，其它的构造函数必然也会有super语句的存在，所以在同一个构造函数里面有相同的语句，就失去了语句的意义，编译器也不会通过。
this()和super()都指的是对象，所以，均不可以在static环境中使用。包括：static变量,static方法，static语句块。
从本质上讲，this是一个指向本对象的指针, 然而super是一个Java关键字。

# 抽象类和接口

抽象类与接口：

抽象类和抽象方法都使用 abstract 进行声明。抽象类一般会包含抽象方法，抽象方法一定位于抽象类中。
抽象类和普通类最大的区别是，抽象类不能被实例化，需要继承抽象类才能实例化其子类。

接口是抽象类的延伸，在 Java 8 之前，它可以看成是一个完全抽象的类，也就是说它不能有任何的方法实现。
从 Java 8 开始，接口也可以拥有默认的方法实现，这是因为不支持默认方法的接口的维护成本太高了。在 Java 8
之前，如果一个接口想要添加新的方法，那么要修改所有实现了该接口的类。

接口的成员（字段 + 方法）默认都是 public 的，并且不允许定义为 private 或者 protected。
接口的字段默认都是 static 和 final 的。

抽象类和接口的比较
  |    | 抽象类 | 接口
  --- | ---| ---
  设计| IS-A, 满足里式替换原则| LIKE-A, 提供一个方法实现契约
  使用| 单继承| 多实现
  字段| 无限制| static or final
  方法| 无限制| public

如何使用：

使用抽象类：

需要在几个相关的类中共享代码。
需要能控制继承来的方法和域的访问权限，而不是都为 public。
需要继承非静态（non-static）和非常量（non-final）字段。

使用接口：

需要让不相关的类都实现一个方法，例如不相关的类都可以实现 Compareable 接口中的 compareTo() 方法；
需要使用多重继承，例如Runnable接口实现线程类

java 类可以继承一个抽象类，实现多个接口，都不能被实例化

- 1. 抽象类

抽象类定义为包含抽象方法的类(*不包含抽象方法，仅用abstract修饰的类也可以是抽象类，只不过没有抽象方法设计成的抽象类没多大意义*)，使用abstrac关键字修饰。

抽象类为继承而设计，抽象方法必须为public或protected,缺省默认为public，抽象类不能被实例化，如果一个类继承一个抽象类，必须实现所有的抽象方法，否则子类也必须定义为抽象类。

- 2. 接口

接口定义为提供别人调用的方法或函数，java中使用interface定义，接口可以含有变量和方法，但是变量会被隐式指定为public static final变量，方法则会被隐式地指定为public abstrac方法，变量和方法也仅仅只能如此，否则会编译错误。

抽象类实现接口的时候，可以不实现接口的抽象方法。

- 3. 区别

| |抽象类 | 接口
---|--- | ---
构造函数| 有| 无
普通成员变量| 有 | 无
非abstract 方法 | 有  | 无
访问修饰符 | public, protected | 默认也只能是public
静态方法 | 有 | 无
静态成员变量 | 访问类型任意 | 默认也只能是public static final
其他| 单继承 | 多实现

**语法层面讲**

1）抽象类可以提供成员方法的实现细节，而接口中只能存在public abstract 方法；
2）抽象类中的成员变量可以是各种类型的，而接口中的成员变量只能是public static final类型的；
3）接口中不能含有静态代码块以及静态方法，而抽象类可以有静态代码块和静态方法；
4）一个类只能继承一个抽象类，而一个类却可以实现多个接口。

**设计层面上的区别**

1）抽象类是对一种事物的抽象，即对类抽象，而接口是对行为的抽象。抽象类是对整个类整体进行抽象，包括属性、行为，但是接口却是对类局部（行为）进行抽象。举个简单的例子，飞机和鸟是不同类的事物，但是它们都有一个共性，就是都会飞。那么在设计的时候，可以将飞机设计为一个类Airplane，将鸟设计为一个类Bird，但是不能将 飞行 这个特性也设计为类，因此它只是一个行为特性，并不是对一类事物的抽象描述。此时可以将 飞行 设计为一个接口Fly，包含方法fly( )，然后Airplane和Bird分别根据自己的需要实现Fly这个接口。然后至于有不同种类的飞机，比如战斗机、民用飞机等直接继承Airplane即可，对于鸟也是类似的，不同种类的鸟直接继承Bird类即可。从这里可以看出，继承是一个 "是不是"的关系，而 接口 实现则是 "有没有"的关系。如果一个类继承了某个抽象类，则子类必定是抽象类的种类，而接口实现则是有没有、具备不具备的关系，比如鸟是否能飞（或者是否具备飞行这个特点），能飞行则可以实现这个接口，不能飞行就不实现这个接口。

2）设计层面不同，抽象类作为很多子类的父类，它是一种模板式设计。而接口是一种行为规范，它是一种辐射式设计。什么是模板式设计？最简单例子，大家都用过ppt里面的模板，如果用模板A设计了ppt B和ppt C，ppt B和ppt C公共的部分就是模板A了，如果它们的公共部分需要改动，则只需要改动模板A就可以了，不需要重新对ppt B和ppt C进行改动。而辐射式设计，比如某个电梯都装了某种报警器，一旦要更新报警器，就必须全部更新。也就是说对于抽象类，如果需要添加新的方法，可以直接在抽象类中添加具体的实现，子类可以不进行变更；而对于接口则不行，如果接口进行了变更，则所有实现这个接口的类都必须进行相应的改动。

参考文档： https://www.cnblogs.com/dolphin0520/p/3811437.html

# java 重写和重载的区别

**方法重载发生在编译器，方法重写发生在运行期。**

**方法重写的原则：**

- 重写方法的方法名称、参数列表必须与原方法的相同，返回类型可以相同也可以是原类型的子类型(从Java SE5开始支持)。
- 重写方法不能比原方法访问性差（即访问权限不允许缩小）。
- 重写方法不能比原方法抛出更多的异常。
- 被重写的方法不能是final类型，因为final修饰的方法是无法重写的。
- 被重写的方法不能为private，否则在其子类中只是新定义了一个方法，并没有对其进行重写。
- 被重写的方法不能为static。如果父类中的方法为静态的，而子类中的方法不是静态的，但是两个方法除了这一点外其他都满足重写条件，那么会发生编译错误；反之亦然。即使父类和子类中的方法都是静态的，并且满足重写条件，但是仍然不会发生重写，因为静态方法是在编译的时候把静态方法和类的引用类型进行匹配。
- 重写是发生在运行时的，因为编译期编译器不知道并且没办法确定该去调用哪个方法，JVM会在代码运行的时候作出决定。

**方法重载的原则：**

- 方法名称必须相同。
- 参数列表必须不同（个数不同、或类型不同、参数类型排列顺序不同等）。
- 方法的返回类型可以相同也可以不相同。
- 仅仅返回类型不同不足以成为方法的重载。
- 重载是发生在编译时的，因为编译器可以根据参数的类型来选择使用哪个方法。

** 重写和重载的不同：**
- 方法重写要求参数列表必须一致，而方法重载要求参数列表必须不一致。
- 方法重写要求返回类型必须一致(或为其子类型)，方法重载对此没有要求。
- 方法重写只能用于子类重写父类的方法，方法重载用于同一个类中的所有方法。
- 方法重写对方法的访问权限和抛出的异常有特殊的要求，而方法重载在这方面没有任何限制。
- 父类的一个方法只能被子类重写一次，而一个方法可以在所有的类中可以被重载多次。
- 重载是编译时多态，重写是运行时多态。

# Synchronized 和 volitate区别

[volatile与synchronized的区别](https://www.cnblogs.com/tf-Y/p/5266710.html)

1) volatile本质是在告诉jvm当前变量在寄存器中的值是不确定的,需要从主存中读取,synchronized则是锁定当前变量,只有当前线程可以访问该变量,其他线程被阻塞住.
2) volatile仅能使用在变量级别,synchronized则可以使用在变量,方法.
3) volatile仅能实现变量的修改可见性,而synchronized则可以保证变量的修改可见性和原子性.(**只能保证单个变量的读写原子性，不能保证volatile++这种复合操作的原子性**)
4) volatile不会造成线程的阻塞,而synchronized可能会造成线程的阻塞.
5) 当一个域的值依赖于它之前的值时，volatile就无法工作了，如n=n+1,n++等。如果某个域的值受到其他域的值的限制，那么volatile也无法工作，如Range类的lower和upper边界，必须遵循lower<=upper的限制。
6) 使用volatile而不是synchronized的唯一安全的情况是类中只有一个可变的域。

# Synchronized 的内部实现

通过javap反编译代码可以看到，对于同步方法，JVM采用**ACC_SYNCHRONIZED**标记符来实现同步。 对于同步代码块。JVM采用**monitorenter、monitorexit**两个指令来实现同步。

# 异常

Throwable 可以用来表示任何可以作为异常抛出的类，分为两种： Error 和 Exception。其中 Error 用来表示 JVM 无法处理的错误，Exception 分为两种：

受检异常 ：需要用 try...catch... 语句捕获并进行处理，并且可以从异常中恢复；
非受检异常 ：是程序运行时错误，例如除 0 会引发 Arithmetic Exception，此时程序奔溃并且无法恢复。
![throwable](img/Throwable.png)  

[java入门之异常处理](https://www.tianmaying.com/tutorial/Java-Exception)

# String StringBuffer StringBuilder的区别

## 运行速度：

StingBuilder > StringBuffer > String

String为字符串常量，而StringBuilder和StringBuffer均为字符串变量，即String对象一旦创建之后该对象是不可更改的，但后两者的对象是变量，是可以更改的

``` java
String str = "abc";
str = str + "de";// 原来的"abc"没了，下次GC会被回收掉，创建了一个新的str变量

```

## 线程安全

在线程安全上，StringBuilder是线程不安全的，而StringBuffer是线程安全的

如果一个StringBuffer对象在字符串缓冲区被多个线程使用时，StringBuffer中很多方法可以带有synchronized关键字，所以可以保证线程是安全的，但StringBuilder的方法则没有该关键字，所以不能保证线程安全，有可能会出现一些错误的操作。所以如果要进行的操作是多线程的，那么就要使用StringBuffer，但是在单线程的情况下，还是建议使用速度比较快的StringBuilder。

## 总结

String：适用于少量的字符串操作的情况

StringBuilder：适用于单线程下在字符缓冲区进行大量操作的情况

StringBuffer：适用多线程下在字符缓冲区进行大量操作的情况


# java 如何实现序列化

OutputStream.writeObject方法可以实现java对象的序列化，如果想要java自动实现，则需要实现Serializable接口

# 什么是cookie？Session和cookie有什么区别？

Cookie是会话技术,将用户的信息保存到浏览器的对象.

区别：

(1)cookie数据存放在客户的浏览器上，session数据放在服务器上
(2)cookie不是很安全，别人可以分析存放在本地的COOKIE并进行COOKIE欺骗,如果主要考虑到安全应当使用session
(3)session会在一定时间内保存在服务器上。当访问增多，会比较占用你服务器的性能，如果主要考虑到减轻服务器性能方面，应当使用COOKIE
(4)单个cookie在客户端的限制是3K，就是说一个站点在客户端存放的COOKIE不能3K。

结论：

将登陆信息等重要信息存放为SESSION;其他信息如果需要保留，可以放在COOKIE中

# 死锁的产生以及如何避免

## 死锁产生条件

死锁的发生必须满足以下四个条件：

互斥条件：一个资源每次只能被一个进程使用。

请求与保持条件：一个进程因请求资源而阻塞时，对已获得的资源保持不放。

不剥夺条件：进程已获得的资源，在末使用完之前，不能强行剥夺。

循环等待条件：若干进程之间形成一种头尾相接的循环等待资源关系。

三种用于避免死锁的技术：

加锁顺序（线程按照一定的顺序加锁）

加锁时限（线程尝试获取锁的时候加上一定的时限，超过时限则放弃对该锁的请求，并释放自己占有的锁）

死锁检测

（死锁原因及如何避免更深理解移步：http://blog.csdn.net/ls5718/article/details/51896159）

## 死锁避免

(1)打破互斥条件：允许进程同时访问某些资源，但是，有的资源不允许被同时访问，就像打印机，这是由资源的本身来决定的，所以这个方法并没有什么实用的价值。

(2)打破不可抢占的条件：就是说允许进程强行从资源的占有者那里抢夺资源。这种方法实现起来很困难，会降低性能。

(3)打破占有申请条件：可以实现资源预先分配策略，在进程运行前一次性向系统申请他所需要的全部资源。如果进程所需的资源不能满足，则不分配任何资源，进程暂时不运行。(问题：1.在很多时候，一个进程在执行之前不可能知道它所有的全部资源，进程在执行的过程中，是动态的。2.资源利用率低。3.降低进程的并发性，因为资源有效，有加上存在浪费，能分配的所需全部资源的进程个数必然很少。)

(4)打破循环等待条件：实行资源的有序分配策略，把资源事先分类编号，按号分配，使进程在申请，占用资源时候不能形成环路，所有进程对资源的请求必须严格按照资源号递增的顺序提出，进程占用了小号的资源，才能申请大号资源。就会形成环路。(缺点：限制进程对资源的请求，同时对系统中的所有资源合理编号也是很有困难的，增加额外的系统开销。)

## 死锁产生的例子

进程A占有对象1的锁，进程B占有对象2的锁，进程A需要对象2的锁才能继续执行，所以进程A会等待进程B释放对象2的锁，而进程B需要对象1的锁才能继续执行，同样会等待进程A释放对象1的锁，由于这两个进程都不释放已占有的锁，所以导致他们进入无限等待中。

``` java

// LockTest.java
import java.util.Date;
 
public class LockTest {
   public static String obj1 = "obj1";
   public static String obj2 = "obj2";
   public static void main(String[] args) {
      LockA la = new LockA();
      new Thread(la).start();
      LockB lb = new LockB();
      new Thread(lb).start();
   }
}
class LockA implements Runnable{
   public void run() {
      try {
         System.out.println(new Date().toString() + " LockA 开始执行");
         while(true){
            synchronized (LockTest.obj1) {
               System.out.println(new Date().toString() + " LockA 锁住 obj1");
               Thread.sleep(3000); // 此处等待是给B能锁住机会
               synchronized (LockTest.obj2) {
                  System.out.println(new Date().toString() + " LockA 锁住 obj2");
                  Thread.sleep(60 * 1000); // 为测试，占用了就不放
               }
            }
         }
      } catch (Exception e) {
         e.printStackTrace();
      }
   }
}
class LockB implements Runnable{
   public void run() {
      try {
         System.out.println(new Date().toString() + " LockB 开始执行");
         while(true){
            synchronized (LockTest.obj2) {
               System.out.println(new Date().toString() + " LockB 锁住 obj2");
               Thread.sleep(3000); // 此处等待是给A能锁住机会
               synchronized (LockTest.obj1) {
                  System.out.println(new Date().toString() + " LockB 锁住 obj1");
                  Thread.sleep(60 * 1000); // 为测试，占用了就不放
               }
            }
         }
      } catch (Exception e) {
         e.printStackTrace();
      }
   }
}
```

程序输出：

Mon Jul 16 22:40:18 CST 2018LockA 开始执行
Mon Jul 16 22:40:18 CST 2018 LockA 锁住 obj1
Mon Jul 16 22:40:18 CST 2018 LockB 开始执行
Mon Jul 16 22:40:18 CST 2018 LockB 锁住 obj2

## 死锁解除

为了解决这个问题，我们不使用显示的去锁，我们用信号量去控制。

信号量可以控制资源能被多少线程访问，这里我们指定只能被一个线程访问，就做到了类似锁住。而信号量可以指定去获取的超时时间，我们可以根据这个超时时间，去做一个额外处理。

对于无法成功获取的情况，一般就是重复尝试，或指定尝试的次数，也可以马上退出。

``` java
import java.util.Date;
import java.util.concurrent.Semaphore;
import java.util.concurrent.TimeUnit;
 
public class UnLockTest {
   public static String obj1 = "obj1";
   public static final Semaphore a1 = new Semaphore(1);
   public static String obj2 = "obj2";
   public static final Semaphore a2 = new Semaphore(1);
 
   public static void main(String[] args) {
      LockAa la = new LockAa();
      new Thread(la).start();
      LockBb lb = new LockBb();
      new Thread(lb).start();
   }
}
class LockAa implements Runnable {
   public void run() {
      try {
         System.out.println(new Date().toString() + " LockA 开始执行");
         while (true) {
            if (UnLockTest.a1.tryAcquire(1, TimeUnit.SECONDS)) {
               System.out.println(new Date().toString() + " LockA 锁住 obj1");
               if (UnLockTest.a2.tryAcquire(1, TimeUnit.SECONDS)) {
                  System.out.println(new Date().toString() + " LockA 锁住 obj2");
                  Thread.sleep(60 * 1000); // do something
               }else{
                  System.out.println(new Date().toString() + "LockA 锁 obj2 失败");
               }
            }else{
               System.out.println(new Date().toString() + "LockA 锁 obj1 失败");
            }
            UnLockTest.a1.release(); // 释放
            UnLockTest.a2.release();
            Thread.sleep(1000); // 马上进行尝试，现实情况下do something是不确定的
         }
      } catch (Exception e) {
         e.printStackTrace();
      }
   }
}
class LockBb implements Runnable {
   public void run() {
      try {
         System.out.println(new Date().toString() + " LockB 开始执行");
         while (true) {
            if (UnLockTest.a2.tryAcquire(1, TimeUnit.SECONDS)) {
               System.out.println(new Date().toString() + " LockB 锁住 obj2");
               if (UnLockTest.a1.tryAcquire(1, TimeUnit.SECONDS)) {
                  System.out.println(new Date().toString() + " LockB 锁住 obj1");
                  Thread.sleep(60 * 1000); // do something
               }else{
                  System.out.println(new Date().toString() + "LockB 锁 obj1 失败");
               }
            }else{
               System.out.println(new Date().toString() + "LockB 锁 obj2 失败");
            }
            UnLockTest.a1.release(); // 释放
            UnLockTest.a2.release();
            Thread.sleep(10 * 1000); // 这里只是为了演示，所以tryAcquire只用1秒，而且B要给A让出能执行的时间，否则两个永远是死锁
         }
      } catch (Exception e) {
         e.printStackTrace();
      }
   }
}
```

# finalize()方法

finalize()方法什么时候被调用?析构函数(finalization)的目的是什么？

调用时机：当垃圾回收器要宣告一个对象死亡时，至少要经过两次标记过程：如果对象在进行可达性分析后发现没有和GC Roots相连接的引用链，就会被第一次标记，并且判断是否执行finalizer( )方法，如果对象覆盖finalizer()方法且未被虚拟机调用过，那么这个对象会被放置在F-Queue队列中，并在稍后由一个虚拟机自动建立的低优先级的Finalizer线程区执行触发finalizer( )方法，但不承诺等待其运行结束。

finalization的目的：对象逃脱死亡的最后一次机会。（只要重新与引用链上的任何一个对象建立关联即可。）但是不建议使用，运行代价高昂，不确定性大，且无法保证各个对象的调用顺序。可用try-finally或其他替代。

GC决定回收某对象的时候，就会运行对象的finalize()方法，一般情况下不用重写该方法。

最主要的用途是，回收特殊渠道申请的内存，**native方法**。例如使用JNI调用C++程序的时候，finalize()方法就回收这部分的内存。

# JVM内存分配策略、各个代区、GC类别

## 各个代区

> 年轻代(Young Generation)：

所有新生对象首先放在年轻代中。年轻代的目标就是尽可能快速的收集掉那些生
命周期短的对象。年轻代分三个区。一个Eden区，两个 Survivor区(一般而言)。大部分对象在
Eden区中生成。当Eden区满时，还存活的对象将被复制到Survivor区（两个中的一个），当这
个 Survivor区满时，此区的存活对象将被复制到另外一个Survivor区，当这个Survivor去也满了
的时候，从第一个Survivor区复制过来的并且此时还存活的对象，将被复制“年老区
(Tenured)”。需要注意，Survivor的两个区是对称的，没先后关系，所以同一个区中可能同时
存在从Eden复制过来对象，和从前一个Survivor复制过来的对象，而复制到年老区的只有从第
一个Survivor去过来的对象。而且，Survivor区总有一个是空的。同时，根据程序需要，
Survivor区是可以配置为多个的（多于两个），这样可以增加对象在年轻代中的存在时间，减
少被放到年老代的可能。

> 年老代(Old Generation)：

在年轻代中经历了N次垃圾回收后仍然存活的对象，就会被放到年老代中。因此，可以认
为年老代中存放的都是一些生命周期较长的对象。

> 永久代(Permanent Generation):

用于存放静态文件，如今Java类、方法等。持久代对垃圾回收没有显著影响，但是有些应 
用可能动态生成或者调用一些class，例如Hibernate 等，在这种时候需要设置一个比较大的持 
久代空间来存放这些运行过程中新增的类。持久代大小通过-XX:MaxPermSize=<N>进行设置.

## GC类别

- Minor GC: 从年轻代空间（包括 Eden 和 Survivor 区域）回收内存被称为 Minor GC, 因大多数新生对象生命周期很短，所以MinorGC通常很频繁，回收速度也较快;
- FullGC: 针对整个新生代、老生代、元空间（metaspace，java8以上版本取代永久代(perm gen)）的全局范围的GC, 执行频率低，回收速度慢。
- Major GC: 定义不清楚，有的地方同FullGC，有的地方指的是清理永久代。

## 分配策略

1. 对象优先在Eden分配

一般情况下，对象会在新生代的Eden区分配，Eden区没有足够空间时，虚拟机会 发起一次MinorGC；当MinorGC时，若无法放入survivor空间，就会再通过分配担保机制转移到老年代中；

2. 大对象直接进入老年代

大对象是指需要连续内存空间的对象，最典型的大对象是那种很长的字符串以及数组。
经常出现大对象会提前触发垃圾收集以获取足够的连续空间分配给大对象。
-XX:PretenureSizeThreshold，大于此值的对象直接在老年代分配，避免在 Eden 区和 Survivor 区之间的大量内存复制。

3. 长期存活的对象进入老年代

通过 -XX:MaxTenuringThreshold参数设置；每MinorGC一次还存活在Survivor中，则年龄加1；

4. 动态对象年龄判定

虚拟机并不是永远地要求对象的年龄必须达到 MaxTenuringThreshold 才能晋升老年代，如果在 Survivor 区中相同年龄所有对象大小的总和大于 Survivor 空间的一半，则年龄大于或等于该年龄的对象可以直接进入老年代，无需等到 MaxTenuringThreshold 中要求的年龄。

5. 空间分配担保

在发生 Minor GC 之前，虚拟机先检查老年代最大可用的连续空间是否大于新生代所有对象总空间，如果条件成立的话，那么 Minor GC 可以确认是安全的；如果不成立的话虚拟机会查看 HandlePromotionFailure 设置值是否允许担保失败，如果允许那么就会继续检查老年代最大可用的连续空间是否大于历次晋升到老年代对象的平均大小，如果大于，将尝试着进行一次 Minor GC，尽管这次 Minor GC 是有风险的；如果小于，或者 HandlePromotionFailure 设置不允许冒险，那这时也要改为进行一次 Full GC。

## 触发条件

MinorGC: Eden区满时触发；FullGC也会伴随有MinorGC；通常会使得Old gen变大；

FullGC：
a. MinorGC触发前，检查历次进入老年代的平均大小，若小于则FullGC；（老年代空间担保失败）
b. 如果有永久代（perm gen），在不足哆分配时，触发FullGC；
c. 调用System.gc()，提醒JVM FullGC，但不可控；

# 进程和线程区别

**定义：**

进程：具有一定的独立功能的程序关于某个数据集合上的一次运行活动，进程是系统进行资源分配和调度的一个独立的单位

线程：进程的一个实体，是CPU调度和分派的基本单位,它是比进程更小的能独立运行的基本单位.线程自己基本上不拥有系统资源,只拥有一点在运行中必不可少的资源(如程序计数器,一组寄存器和栈),但是它可与同属一个进程的其他的线程共享进程所拥有的全部资源。

- 关系：

一个线程可以创建和撤销另一个线程;同一个进程中的多个线程之间可以并发执行.

相对进程而言，线程是一个更加接近于执行体的概念，它可以与同进程中的其他线程共享数据，但拥有自己的栈空间，拥有独立的执行序列。

- 区别：
进程和线程的主要差别在于它们是不同的操作系统资源管理方式。进程有独立的地址空间，一个进程崩溃后，在保护模式下不会对其它进程产生影响，而线程只是一个进程中的不同执行路径。线程有自己的堆栈和局部变量，但线程之间没有单独的地址空间，一个线程死掉就等于整个进程死掉，所以多进程的程序要比多线程的程序健壮，但在进程切换时，耗费资源较大，效率要差一些。但对于一些要求同时进行并且又要共享某些变量的并发操作，只能用线程，不能用进程。

1) 简而言之,一个程序至少有一个进程,一个进程至少有一个线程.

2) 线程的划分尺度小于进程，使得多线程程序的并发性高。

3) 另外，进程在执行过程中拥有独立的内存单元，而多个线程共享内存，从而极大地提高了程序的运行效率。

4) 线程在执行过程中与进程还是有区别的。每个独立的线程有一个程序运行的入口、顺序执行序列和程序的出口。但是线程不能够独立执行，必须依存在应用程序中，由应用程序提供多个线程执行控制。

5) 从逻辑角度来看，多线程的意义在于一个应用程序中，有多个执行部分可以同时执行。但操作系统并没有将多个线程看做多个独立的应用，来实现进程的调度和管理以及资源分配。这就是进程和线程的重要区别。

- 优缺点：
线程和进程在使用上各有优缺点：

线程执行开销小，但不利于资源的管理和保护；

而进程正相反。

同时，线程适合于在SMP机器上运行，而进程则可以跨机器迁移。

# java 8 新特性

## Stream

Java 8 中的 Stream 是对集合（Collection）对象功能的增强，它专注于对集合对象进行各种非常便利、高效的聚合操作（aggregate operation），或者大批量数据操作 (bulk data operation)。Stream API 借助于同样新出现的 Lambda 表达式，极大的提高编程效率和程序可读性。同时它提供串行和并行两种模式进行汇聚操作，并发模式能够充分利用多核处理器的优势，使用 fork/join 并行方式来拆分任务和加速处理过程。通常编写并行代码很难而且容易出错, 但使用 Stream API 无需编写一行多线程的代码，就可以很方便地写出高性能的并发程序。


## Optional

Google Guava 库中引入了Optional 作为解决空指针异常的一种方式，不赞成代码被null检查的代码污染，期望程序员写整洁的代码。java 8 中因此引入了Optional。

``` java
Optional< String > fullName = Optional.ofNullable( null );
System.out.println( "Full Name is set? " + fullName.isPresent() );        
System.out.println( "Full Name: " + fullName.orElseGet( () -> "[none]" ) );
System.out.println( fullName.map( s -> "Hey " + s + "!" ).orElse( "Hey Stranger!" ) );
```

## 更好的类型推断

``` java
Map<Integer, Integer> map = new HashMap<>(); // 不需要在HashMap中指定key 和 value的类型
```

## 方法引用

方法引用提供了一个很有用的语义来直接访问类或者实例的已经存在的方法或者构造方法。结合Lambda表达式，方法引用使语法结构紧凑简明。不需要复杂的引用。

下面我们用Car 这个类来做示例，Car这个类有不同的方法定义。让我们来看看java 8支持的4种方法引用。

``` java
public static class Car {
    public static Car create( final Supplier< Car > supplier ) {
        return supplier.get();
    }              
 
    public static void collide( final Car car ) {
        System.out.println( "Collided " + car.toString() );
    }
 
    public void follow( final Car another ) {
        System.out.println( "Following the " + another.toString() );
    }
 
    public void repair() {
        System.out.println( "Repaired " + this.toString() );
    }
}
```

- 1、构造引用

语法是：Class::new ，对于泛型来说语法是：Class<T >::new，请注意构造方法没有参数:

``` java
final Car car = Car.create( Car::new );
final List< Car > cars = Arrays.asList( car );
```

- 2、静态方法引用

语法是：Class::static_method请注意这个静态方法只支持一个类型为Car的参数。

``` java
cars.forEach( Car::collide );
```

- 3、类实例的方法引用

语法是：Class::method请注意方法没有参数。

``` java
cars.forEach( Car::repair );
```

- 4、引用特殊类的方法

语法是：instance::method，请注意只接受Car类型的一个参数。

``` java
final Car police = Car.create( Car::new );
cars.forEach( police::follow );
```

## Lambda 表达式

Lambda 表达式是java8的一个特性，支持函数式接口。它允许我们将一个函数当作方法的参数（传递函数），或者说把代码当作数据，这是每个函数式编程者熟悉的概念。很多基于JVM平台的语言一开始就支持Lambda表达式，但是Java程序员没有选择，只能使用匿名内部类来替代Lambda表达式。

``` java
package com.raorao.java.base;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Lambda 表达式.
 *
 * @author Xiong Raorao
 * @since 2018-08-06-17:32
 */
public class LambdaTest {

  public static void main(String[] args) {
    foo1();
  }

  public static void foo1() {
    String[] ss = new String[] {"a", "c", "b", "d"};
    List<String> list = Arrays.asList(ss);
    list.forEach(e -> System.out.print(e));
    System.out.println();
    list.sort((e1, e2) -> e2.compareTo(e1));
    list.forEach(System.out::print);
    System.out.println();
    Map<Integer, Integer> map = new HashMap<>();
    for (int i = 0; i < 5; i++) {
      map.put(i, i * i);
    }
    map.forEach((k, v) -> System.out.println("key = " + k + ", value = " + v));

    Thread t = new Thread(()->{
      System.out.println(  "start thread");
      try {
        Thread.sleep(2000);
      } catch (InterruptedException e) {
        e.printStackTrace();
      }
      System.out.println("end thread");
    });
    t.start();
  }
}
```

## 接口默认方法

jdk 1.8 开始，接口支持**默认和静态**方法，默认方法和抽象方法的区别是抽象方法必须要被实现，默认方法不是。作为替代方式，接口可以提供一个默认的方法实现，所有这个接口的实现类都会通过继承得倒这个方法（如果有需要也可以重写这个方法），让我们来看看下面的例子：

``` java
private interface Defaulable {
    // Interfaces now allow default methods, the implementer may or
    // may not implement (override) them.
    default String notRequired() {
        return "Default implementation";
    }
}
 
private static class DefaultableImpl implements Defaulable {
}
 
private static class OverridableImpl implements Defaulable {
    @Override
    public String notRequired() {
        return "Overridden implementation";
    }
}

private interface DefaulableFactory {
    // Interfaces now allow static methods
    static Defaulable create( Supplier< Defaulable > supplier ) {
        return supplier.get();
    }
}
```

接口Defaulable使用default关键字声明了一个默认方法notRequired()，类DefaultableImpl实现了Defaulable接口，没有对默认方法做任何修改。另外一个类OverridableImpl重写类默认实现，提供了自己的实现方法。

**默认和静态方法 主要是为了扩充接口的方法，否则，所有实现了该接口的类都需要重新实现新方法**

# socket 编程

[socket 编程](https://www.cnblogs.com/rocomp/p/4790340.html)

# Java 集合类的底层实现

[参考文档](https://blog.csdn.net/qq_25868207/article/details/55259978)

# .class 和 getclass的区别

最明显的一个区别是，.class 可以直接从类名获取，.getClass() 是一个对象实例的方法。

## 加载时机不同

Class.forName(),getClass()在运行时加载；

Class.class是在编译器加载，即.class是静态加载，

.getClass()是动态加载。

## 静态内部类

Iterator it = s.iterator();得到的it的真正类型是KeyIterator，是Iterator的子类，按常理来说应该可以执行next()方法，但是值得注意的是，KeyIterator是hashmap的内部类，JAVA给的提示是cannot access a member of class java.util.HashMap$KeyIterator withmodifiers "public"

从上面的那些例子上也能看出，除内部类外的其他类的应用上.class功能完全等于.getClass()!只是一个是用类直接获得的，一个是用实例获得的。


# 参考文档

- [HashMap? ConcurrentHashMap? 相信看完这篇没人能难住你！](https://crossoverjie.top/2018/07/23/java-senior/ConcurrentHashMap/)

- [Java多线程之CAS](https://blog.csdn.net/u010412719/article/details/52053390)

- [Java中this和super的用法总结](https://www.cnblogs.com/hasse/p/5023392.html)