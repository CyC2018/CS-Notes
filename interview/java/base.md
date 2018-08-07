<!-- TOC -->

- [HashMap ConcurrentHashMap](#hashmap-concurrenthashmap)
- [java this 和 super的用法](#java-this-和-super的用法)
    - [this](#this)
    - [super](#super)
    - [super和this的异同：](#super和this的异同)
- [抽象类和接口](#抽象类和接口)
- [Synchronized 和 volitate区别](#synchronized-和-volitate区别)
- [异常](#异常)
- [String StringBuffer StringBuilder的区别](#string-stringbuffer-stringbuilder的区别)
    - [运行速度：](#运行速度)
    - [线程安全](#线程安全)
    - [总结](#总结)
- [java 如何实现序列化](#java-如何实现序列化)
- [什么是cookie？Session和cookie有什么区别？](#什么是cookiesession和cookie有什么区别)
- [如何避免死锁](#如何避免死锁)
- [进程和线程区别](#进程和线程区别)
- [java 8 新特性](#java-8-新特性)
    - [Stream](#stream)
    - [Optional](#optional)
    - [更好的类型推断](#更好的类型推断)
    - [方法引用](#方法引用)
    - [Lambda 表达式](#lambda-表达式)
    - [接口默认方法](#接口默认方法)
- [参考文档](#参考文档)

<!-- /TOC -->

# HashMap ConcurrentHashMap

HashMap和ConcurrentHashMap的最主要的区别就是前者是线程不安全，后者是线程安全的。在不同的JDK版本中，区别也不一样

JDK1.7中：

HashMap使用**链表法**来实现hash冲突节点的存储。ConcurrentHashMap使用Segment 数组存储数据，Segment 通过继承 ReentrantLock 来进行加锁。

JDK1.8中：

HashMap重复hash值的链表元素超过8个，就改成红黑树实现

ConcurrentHashMap 不用segment,改成CAS+synchronized方法实现。

CAS 的含义是“我认为原有的值应该是什么，如果是，则将原有的值更新为新值，否则不做修改，并告诉我原来的值是多少”

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

# Synchronized 和 volitate区别

[volatile与synchronized的区别](https://www.cnblogs.com/tf-Y/p/5266710.html)

1) volatile本质是在告诉jvm当前变量在寄存器中的值是不确定的,需要从主存中读取,synchronized则是锁定当前变量,只有当前线程可以访问该变量,其他线程被阻塞住.
2) volatile仅能使用在变量级别,synchronized则可以使用在变量,方法.
3) volatile仅能实现变量的修改可见性,而synchronized则可以保证变量的修改可见性和原子性.(**只能保证单个变量的读写原子性，不能保证volatile++这种复合操作的原子性**)
4) volatile不会造成线程的阻塞,而synchronized可能会造成线程的阻塞.
5) 当一个域的值依赖于它之前的值时，volatile就无法工作了，如n=n+1,n++等。如果某个域的值受到其他域的值的限制，那么volatile也无法工作，如Range类的lower和upper边界，必须遵循lower<=upper的限制。
6) 使用volatile而不是synchronized的唯一安全的情况是类中只有一个可变的域。

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

# 如何避免死锁

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

# 参考文档

- [HashMap? ConcurrentHashMap? 相信看完这篇没人能难住你！](https://crossoverjie.top/2018/07/23/java-senior/ConcurrentHashMap/)

- [Java多线程之CAS](https://blog.csdn.net/u010412719/article/details/52053390)

- [Java中this和super的用法总结](https://www.cnblogs.com/hasse/p/5023392.html)