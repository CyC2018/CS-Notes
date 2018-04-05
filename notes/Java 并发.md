<!-- GFM-TOC -->
* [一、使用线程](#一使用线程)
    * [实现 Runnable 接口](#实现-runnable-接口)
    * [实现 Callable 接口](#实现-callable-接口)
    * [继承 Thread 类](#继承-thread-类)
    * [实现接口 VS 继承 Thread](#实现接口-vs-继承-thread)
* [二、基础线程机制](#二基础线程机制)
    * [sleep()](#sleep)
    * [yield()](#yield)
    * [join()](#join)
    * [deamon](#deamon)
* [三、结束线程](#三结束线程)
    * [阻塞](#阻塞)
    * [中断](#中断)
* [四、线程之间的协作](#四线程之间的协作)
    * [同步与通信的概念理解](#同步与通信的概念理解)
    * [线程同步](#线程同步)
    * [线程通信](#线程通信)
* [五、线程状态转换](#五线程状态转换)
* [六、Executor](#六executor)
* [七、内存模型](#七内存模型)
    * [主内存与工作内存](#主内存与工作内存)
    * [内存模型三大特性](#内存模型三大特性)
    * [先行发生原则](#先行发生原则)
* [八、线程安全](#八线程安全)
    * [线程安全分类](#线程安全分类)
    * [线程安全的实现方法](#线程安全的实现方法)
    * [锁优化](#锁优化)
* [九、多线程开发良好的实践](#九多线程开发良好的实践)
* [参考资料](#参考资料)
<!-- GFM-TOC -->


# 一、使用线程

有三种使用线程的方法：

1. 实现 Runnable 接口；
2. 实现 Callable 接口；
3. 继承 Thread 类。

实现 Runnable 和 Callable 接口的类只能当做一个可以在线程中运行的任务，不是真正意义上的线程，因此最后还需要通过 Thread 来调用。可以说任务是通过线程驱动从而执行的。

## 实现 Runnable 接口

需要实现 run() 方法。

通过 Thread 调用 start() 方法来启动线程。

```java
public class MyRunnable implements Runnable {
    public void run() {
        // ...
    }
    public static void main(String[] args) {
        MyRunnable instance = new MyRunnable();
        Tread thread = new Thread(instance);
        thread.start();
    }
}
```

## 实现 Callable 接口

与 Runnable 相比，Callable 可以有返回值，返回值通过 FutureTask 进行封装。

```java
public class MyCallable implements Callable<Integer> {
    public Integer call() {
        // ...
    }
    public static void main(String[]  args) {
        MyCallable mc = new MyCallable();
        FutureTask<Integer> ft = new FutureTask<>(mc);
        Thread thread = new Thread(ft);
        thread.start();
        System.out.println(ft.get());
    }
}
```

## 继承 Thread 类

同样也是需要实现 run() 方法，并且最后也是调用 start() 方法来启动线程。

```java
public class MyThread extends Thread {
    public void run() {
        // ...
    }
    public static void main(String[] args) {
        MyThread mt = new MyThread();
        mt.start();
    }
}
```

## 实现接口 VS 继承 Thread

实现接口会更好一些，因为：

1. Java 不支持多重继承，因此继承了 Thread 类就无法继承其它类，但是可以实现多个接口；
2. 类可能只要求可执行就行，继承整个 Thread 类开销会过大。


# 二、基础线程机制

## sleep()

Thread.sleep(millisec) 方法会休眠当前正在执行的线程，millisec 单位为毫秒。也可以使用 TimeUnit.TILLISECONDS.sleep(millisec)。

sleep() 可能会抛出 InterruptedException。因为异常不能跨线程传播回 main() 中，因此必须在本地进行处理。线程中抛出的其它异常也同样需要在本地进行处理。

```java
public void run() {
    try {
        // ...
        Thread.sleep(1000);
        // ...
    } catch (InterruptedException e) {
        System.err.println(e);
    }
}
```

## yield()

对静态方法 Thread.yield() 的调用声明了当前线程已经完成了生命周期中最重要的部分，可以切换给其它线程来执行。

```java
public void run() {
    // ...
    Thread.yield();
}
```

## join()

在线程中调用另一个线程的 join() 方法，会将当前线程挂起，直到目标线程结束。

可以加一个超时参数。

## deamon

守护线程（deamon）是程序运行时在后台提供服务的线程，并不属于程序中不可或缺的部分。

当所有非后台线程结束时，程序也就终止，同时会杀死所有后台线程。

main() 属于非后台线程。

使用 setDaemon() 方法将一个线程设置为后台线程。

# 三、结束线程

## 阻塞

一个线程进入阻塞状态可能有以下原因：

1. 调用 Thread.sleep() 使线程睡眠；
2. 调用 wait() 使线程挂起，直到线程得到 notify() 或 notifyAll() 消息（或者 java.util.concurrent 类库中等价的 signal() 或 signalAll() 消息；
3. 等待某个 I/O 的完成；
4. 试图在某个对象上调用其同步控制方法，但是对象锁不可用，因为另一个线程已经获得了这个锁。

**阻塞 睡眠 挂起** 

阻塞是一种状态，而睡眠和挂起是一种手段，通过睡眠和挂起可以让一个线程进入阻塞状态。

睡眠和挂起这两种手段的区别是，挂起手段会释放对象锁，而睡眠手段不会。

应该注意的是，睡眠和挂起都可以设置一个等待时间，超过等待时间之后，线程会退出阻塞状态。但是如果不为挂起设置等待时间，那么它只能等到通知的到来才能退出阻塞状态。

## 中断

使用中断机制即可终止阻塞的线程。

使用  **interrupt()**  方法来中断某个线程，它会设置线程的中断状态。Object.wait(), Thread.join() 和 Thread.sleep() 三种方法在收到中断请求的时候会清除中断状态，并抛出 InterruptedException。

应当捕获这个 InterruptedException 异常，从而做一些清理资源的操作。

**1. 不可中断的阻塞** 

不能中断 I/O 阻塞和 synchronized 锁阻塞。

**2. Executor 的中断操作** 

Executor 避免对 Thread 对象的直接操作，使用 shutdownNow() 方法来中断它里面的所有线程，shutdownNow() 方法会发送 interrupt() 调用给所有线程。

如果只想中断一个线程，那么使用 Executor 的 submit() 而不是 executor() 来启动线程，就可以持有线程的上下文。submit() 将返回一个泛型 Futrue，可以在它之上调用 cancel()，如果将 true 传递给 cancel()，那么它将会发送 interrupt() 调用给特定的线程。

**3. 检查中断** 

通过中断的方法来终止线程，需要线程进入阻塞状态才能终止。如果编写的 run() 方法循环条件为 true，但是该线程不发生阻塞，那么线程就永远无法终止。

interrupt() 方法会设置中断状态，可以通过 interrupted() 方法来检查中断状态，从而判断一个线程是否已经被中断。

interrupted() 方法在检查完中断状态之后会清除中断状态，这样做是为了确保一次中断操作只会产生一次影响。

# 四、线程之间的协作

## 同步与通信的概念理解

在操作系统中，有三个概念用来描述进程间的协作关系：

1. 互斥：多个进程在同一时刻只有一个进程能进入临界区；
2. 同步：多个进程按一定顺序执行；
3. 通信：多个进程间的信息传递。

通信是一种手段，它可以用来实现同步。也就是说，通过在多个进程间传递信息，可以控制多个进程以一定顺序执行。

而同步又可以保证互斥。即进程按一定顺序执行，可以保证在同一时刻只有一个进程能访问临界资源。但是同步不止用来实现互斥，例如生成者消费者问题，生产者和消费者进程之间的同步不是用来控制对临界资源的访问。

总结起来就是：通信 -> 同步 -> 互斥。

进程和线程在一定程度上类似，也可以用这些概念来描述。

在 Java 语言中，这些概念描述有些差别：

1. 同步：可以和操作系统的互斥等同；
2. 通信：可以和操作系统的同步等同。

很多时候这三个概念都会混在一起用，不同的文章有不同的解释，不能说哪个是对的哪个是错的，只要自己能理解就行。

## 线程同步

给定一个进程内的所有线程，都共享同一存储空间，这样有好处又有坏处。这些线程就可以共享数据，非常有用。不过，在两个线程同时修改某一资源时，这也会造成一些问题。Java 提供了同步机制，以控制对共享资源的互斥访问。

### 1. synchronized

**同步一个方法** 

使多个线程不能同时访问该方法。

```java
public synchronized void func(String name) {
    // ...
}
```

**同步一个代码块** 

```java
public void func(String name) {
    synchronized(this) {
        // ...
    }
}
```

### 2. ReentrantLock

可以使用 Lock 来对一个语句块进行同步。

```java
private Lock lock;
public int func(int value) {
   try {
       lock.lock();
       // ...
   } finally {
      lock.unlock();
   }
}
```

ReentrantLock 是 java.util.concurrent（J.U.C）包中的锁，相比于 synchronized，它多了一些高级功能：

**等待可中断** 

当持有锁的线程长期不释放锁的时候，正在等待的线程可以选择放弃等待，改为处理其他事情，可中断特性对处理执行时间非常长的同步块很有帮助。

**可实现公平锁** 

公平锁是指多个线程在等待同一个锁时，必须按照申请锁的时间顺序来依次获得锁；而非公平锁则不保证这一点，在锁被释放时，任何一个等待锁的线程都有机会获得锁。synchronized 中的锁是非公平的，ReentrantLock 默认情况下也是非公平的，但可以通过带布尔值的构造函数要求使用公平锁。

**锁绑定多个条件** 

一个 ReentrantLock 对象可以同时绑定多个 Condition 对象，而在 synchronized 中，锁对象的 wait() 和 notify() 或 notifyAll() 方法可以实现一个隐含的条件，如果要和多于一个的条件关联的时候，就不得不额外地添加一个锁，而 ReentrantLock 则无须这样做，只需要多次调用 newCondition() 方法即可。

如果需要使用上述功能，选用 ReentrantLock 是一个很好的选择。从性能上来看，在新版本的 JDK 中对 synchronized 进行了很多优化，例如自旋锁等。目前来看它和 ReentrantLock 的性能基本持平了，因此性能因素不再是选择 ReentrantLock 的理由，而且 synchronized 有更大的优化空间，因此优先考虑 synchronized。

## 线程通信

### 1. wait() notify() notifyAll()

它们都属于 Object 的一部分，而不属于 Thread。

wait() 会在等待时将线程挂起，而不是忙等待，并且只有在 notify() 或者 notifyAll() 到达时才唤醒。可以通过这种机制让一个线程阻塞，直到某种特定条件满足。

sleep() 和 yield() 并没有释放锁，但是 wait() 会释放锁。

只有在同步控制方法或同步控制块里才能调用 wait() 、notify() 和 notifyAll()。

```java
private boolean flag = false;

public synchronized void after() {
    while(flag == false) {
        wait();
        // ...
    }
}

public synchronized void before() {
    flag = true;
    notifyAll();
}
```

**wait() 和 sleep() 的区别** 

这两种方法都能将线程阻塞，一种是使用挂起的方式，一种使用睡眠的方式。

1. wait() 是 Object 类的方法，而 sleep() 是 Thread 的静态方法；
2. 挂起会释放锁，睡眠不会。

### 2. BlockingQueue

java.util.concurrent.BlockingQueue 接口有以下阻塞队列的实现：

-  **FIFO 队列** ：LinkedBlockingQueue、ArrayListBlockingQueue（固定长度）
-  **优先级队列** ：PriorityBlockingQueue

提供了阻塞的 take() 和 put() 方法：如果队列为空 take() 将阻塞，直到队列中有内容；如果队列为满 put() 将阻塞，指到队列有空闲位置。

它们响应中断，当收到中断请求的时候会抛出 InterruptedException，从而提前结束阻塞状态。

是线程安全的。

**使用 BlockingQueue 实现生产者消费者问题** 

```java
// 生产者
public class Producer implements Runnable {
    private BlockingQueue<String> queue;

    public Producer(BlockingQueue<String> queue) {
        this.queue = queue;
    }

    @Override
    public void run() {
        System.out.println(Thread.currentThread().getName() + " is making product.");
        String product = "Made By " + Thread.currentThread().getName();
        try {
            queue.put(product);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }
}
```

```java
// 消费者
public class Consumer implements Runnable {
    private BlockingQueue<String> queue;

    public Consumer(BlockingQueue<String> queue) {
        this.queue = queue;
    }

    @Override
    public void run() {
        try {
            String product = queue.take();
            System.out.println(Thread.currentThread().getName() + " is consuming product." + "( " + product + " )");
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }
}
```

```java
// 客户端
public class Client {
    public static void main(String[] args) {
        BlockingQueue<String> queue = new LinkedBlockingQueue<>(5);
        for (int i = 0; i < 2; i++) {
            new Thread(new Consumer(queue), "Consumer-" + i).start();
        }
        for (int i = 0; i < 5; i++) {
            // 只有两个 Product，因此只能消费两个，其它三个消费者被阻塞
            new Thread(new Producer(queue), "Producer-" + i).start();
        }
        for (int i = 2; i < 5; i++) {
            new Thread(new Consumer(queue), "Consumer-" + i).start();
        }
    }
}
```

```html
// 运行结果
Producer-0 is making product.
Consumer-0 is consuming product.( Made By Producer-0 )
Producer-1 is making product.
Consumer-1 is consuming product.( Made By Producer-1 )
Producer-2 is making product.
Producer-3 is making product.
Producer-4 is making product.
Consumer-2 is consuming product.( Made By Producer-2 )
Consumer-3 is consuming product.( Made By Producer-3 )
Consumer-4 is consuming product.( Made By Producer-4 )
```

# 五、线程状态转换

<div align="center"> <img src="../pics//n2U3N.png" width="800"/> </div><br>

1. 新建（New）：创建后尚未启动；
2. 可运行（Runnale）：可能正在运行，也可能正在等待 CPU 时间片；
3. 无限期等待（Waiting）：等待其它线程显示地唤醒，否则不会被分配 CPU 时间片；
4. 限期等待（Timed Waiting）：无需等待其它线程显示地唤醒，在一定时间之后会被系统自动唤醒；
5. 阻塞（Blocking）：等待获取一个排它锁，如果其线程释放了锁就会结束此状态；
6. 死亡（Terminated）：可以是线程结束任务之后自己结束，或者产生了异常而结束，中断机制就是使用了抛出中断异常的方式让一个阻塞的线程结束。

# 六、Executor

Executor 管理多个异步任务的执行，而无需程序员显示地管理线程的生命周期。

主要有三种 Executor：

1. CachedTreadPool：一个任务创建一个线程；
2. FixedThreadPool：所有任务只能使用固定大小的线程；
3. SingleThreadExecutor：相当于大小为 1 的 FixedThreadPool。

```java
ExecutorService exec = Executors.newCachedThreadPool();
for(int i = 0; i < 5; i++) {
    exec.execute(new MyRunnable());
}
```

# 七、内存模型

## 主内存与工作内存

对处理器上的寄存器进行读写的速度比内存快几个数量级，为了解决这种速度矛盾，在它们之间加入了高速缓存。

所有的变量都存储在主内存中，每个线程还有自己的工作内存，工作内存存储在高速缓存中，保存了被该线程使用到的变量的主内存副本拷贝，线程只能直接操作工作内存中的变量。

<div align="center"> <img src="../pics//600px-Sharedmem.jpg"/> </div><br>

## 内存模型三大特性

### 1. 原子性

Java 内存模型允许虚拟机将没有被 volatile 修饰的 64 位数据（long，double）的读写操作划分为两次 32 位的操作来进行，也就是说对这部分数据的操作可以不具备原子性。

AtomicInteger、AtomicLong、AtomicReference 等特殊的原子性变量类提供了下面形式的原子性条件更新语句，使得比较和更新这两个操作能够不可分割地执行。

```java
boolean compareAndSet(expectedValue, updateValue);
```

AtomicInteger 使用举例：

```java
private AtomicInteger ai = new AtomicInteger(0);

public int next() {
    return ai.addAndGet(2)
}
```

也可以使用 synchronized 同步操作来保证操作具备原子性，它对应的虚拟机字节码指令为 monitorenter 和 monitorexit。

### 2. 可见性

如果没有及时地对主内存与工作内存的数据进行同步，那么就会出现不一致问题。如果存在不一致的问题，一个线程对一个共享数据所做的修改就不能被另一个线程看到。

volatile 可以保证可见性，它在修改一个共享数据时会将该值从工作内存同步到主内存，并且对一个共享数据进行读取时会先从主内存同步到工作内存。

synchronized 也能够保证可见性，他能保证同一时刻只有一个线程获取锁然后执行同步代码，并且在释放锁之前会将对变量的修改刷新到主内存当中。不过只有对共享变量的 set() 和 get() 方法都加上 synchronized 才能保证可见性，如果只有 set() 方法加了 synchronized，那么 get() 方法并不能保证会从内存中读取最新的数据。

### 3. 有序性

在 Java 内存模型中，允许编译器和处理器对指令进行重排序，重排序过程不会影响到单线程程序的执行，却会影响到多线程并发执行的正确性。

volatile 关键字通过添加内存屏障的方式来禁止指令重排，即重排序时不能把后面的指令放到内存屏障之前。

也可以通过 synchronized 来保证有序性，它保证每个时刻只有一个线程执行同步代码，相当于是让线程顺序执行同步代码，自然就保证了有序性。

## 先行发生原则

上面提到了可以用 volatile 和 synchronized 来保证有序性。除此之外，JVM 还规定了先行发生原则，让一个操作无需控制就能先于另一个操作完成。

主要有以下这些原则：

### 1. 单一线程原则

> Single thread rule

在一个线程内，在程序前面的操作先行发生于后面的操作。

<div align="center"> <img src="../pics//single-thread-rule.png"/> </div><br>

### 2. 管程锁定规则

> Monitor Lock Rule

一个 unlock 操作先行发生于后面对同一个锁的 lock 操作。

<div align="center"> <img src="../pics//monitor-lock-rule.png"/> </div><br>

### 3. volatile 变量规则

> Volatile Variable Rule

对一个 volatile 变量的写操作先行发生于后面对这个变量的读操作。

<div align="center"> <img src="../pics//volatile-variable-rule.png"/> </div><br>

### 4. 线程启动规则

> Thread Start Rule

Thread 对象的 start() 方法先行发生于此线程的每一个动作。

<div align="center"> <img src="../pics//thread-start-rule.png"/> </div><br>

### 5. 线程加入规则

> Thread Join Rule

join() 方法返回先行发生于 Thread 对象的结束。

<div align="center"> <img src="../pics//thread-join-rule.png"/> </div><br>

### 6. 线程中断规则

> Thread Interruption Rule

对线程 interrupt() 方法的调用先行发生于被中断线程的代码检测到中断事件的发生，可以通过 Thread.interrupted() 方法检测到是否有中断发生。

### 7. 对象终结规则

> Finalizer Rule

一个对象的初始化完成（构造函数执行结束）先行发生于它的 finalize() 方法的开始。

### 8. 传递性

> Transitivity

如果操作 A 先行发生于操作 B，操作 B 先行发生于操作 C，那么操作 A 先行发生于操作 C。

# 八、线程安全

当多个线程访问一个对象时，如果不用考虑这些线程在运行时环境下的调度和交替执行，也不需要进行额外的同步，或者在调用方进行任何其他的协调操作，调用这个对象的行为都可以获得正确的结果，那这个对象是线程安全的。 《Java Concurrency In Practice》

## 线程安全分类

### 1. 不可变

不可变（Immutable）的对象一定是线程安全的，无论是对象的方法实现还是方法的调用者，都不需要再采取任何的线程安全保障措施，只要一个不可变的对象被正确地构建出来，那其外部的可见状态永远也不会改变，永远也不会看到它在多个线程之中处于不一致的状态。

不可变的类：

- String
- Number 部分子类，如 Long 和 Double 等数值包装类型，BigInteger 和 BigDecimal 等大数据类型。但同为 Number 的子类型的原子类 AtomicInteger 和 AtomicLong 则并非不可变的。

可以使用 final 关键字修饰一个基本数据类型的共享数据，使它具有不可变性。

### 2. 绝对线程安全

在 Java API 中标注自己是线程安全的类，大多数都不是绝对的线程安全。例如Vector 是一个线程安全的容器，它的方法被 synchronized 被修饰同步。即使是这样，也不意味着调用它的时候永远都不再需要同步手段了。

对于下面的代码，在多线程的环境中，如果不在方法调用端做额外的同步措施的话，使用这段代码仍然是不安全的。因为如果另一个线程恰好在错误的时间里删除了一个元素，导致序号 i 已经不再可用的话，再用 i 访问数组就会抛出一个 ArrayIndexOutOfBoundsException。

```java
private static Vector<Integer> vector = new Vector<Integer>();

public static void main(String[] args) {
    while (true) {
        for (int i = 0; i < 10; i++) {
            vector.add(i);
        }

        Thread removeThread = new Thread(new Runnable() {
            @Override
            public void run() {
                for (int i = 0; i < vector.size(); i++) {
                    vector.remove(i);
                }
            }
        });

        Thread printThread = new Thread(new Runnable() {
            @Override
            public void run() {
                for (int i = 0; i < vector.size(); i++) {
                    System.out.println((vector.get(i)));
                }
            }
        });

        removeThread.start();
        printThread.start();

        while (Thread.activeCount() > 20);
    }
}
```

```html
Exception in thread "Thread-132" java.lang.ArrayIndexOutOfBoundsException：
Array index out of range：17
at java.util.Vector.remove（Vector.java：777）
at org.fenixsoft.mulithread.VectorTest$1.run（VectorTest.java：21）
at java.lang.Thread.run（Thread.java：662）
```

如果要保证上面的代码能正确执行下去，就需要对 removeThread 和 printThread 中的方法进行同步。

```java
 Thread removeThread = new Thread(new Runnable() {
    @Override
    public void run() {
        synchronized (vector) {
            for (int i = 0; i < vector.size(); i++) {
                vector.remove(i);
            }
        }
    }
});

Thread printThread = new Thread(new Runnable() {
    @Override
    public void run() {
        synchronized (vector) {
            for (int i = 0; i < vector.size(); i++) {
                System.out.println((vector.get(i)));
            }
        }
    }
});
```

### 3. 相对线程安全

相对的线程安全需要保证对这个对象单独的操作是线程安全的，我们在调用的时候不需要做额外的保障措施，但是对于一些特定顺序的连续调用，就可能需要在调用端使用额外的同步手段来保证调用的正确性。

在 Java 语言中，大部分的线程安全类都属于这种类型，例如 Vector、HashTable、Collections 的 synchronizedCollection() 方法包装的集合等。

### 4. 线程兼容

线程兼容是指对象本身并不是线程安全的，但是可以通过在调用端正确地使用同步手段来保证对象在并发环境中可以安全地使用，我们平常说一个类不是线程安全的，绝大多数时候指的是这一种情况。Java API 中大部分的类都是属于线程兼容的，如与前面的 Vector 和 HashTable 相对应的集合类 ArrayList 和 HashMap 等。

### 5. 线程对立

线程对立是指无论调用端是否采取了同步措施，都无法在多线程环境中并发使用的代码。由于 Java 语言天生就具备多线程特性，线程对立这种排斥多线程的代码是很少出现的，而且通常都是有害的，应当尽量避免。

## 线程安全的实现方法

如何实现线程安全与代码编写有很大的关系，但虚拟机提供的同步和锁机制也起到了非常重要的作用。

### 1. 互斥同步

synchronized 和 ReentrantLock。

### 2. 非阻塞同步

互斥同步最主要的问题就是进行线程阻塞和唤醒所带来的性能问题，因此这种同步也称为阻塞同步（Blocking Synchronization）。

从处理问题的方式上说，互斥同步属于一种悲观的并发策略，总是认为只要不去做正确的同步措施（例如加锁），那就肯定会出现问题，无论共享数据是否真的会出现竞争，它都要进行加锁（这里讨论的是概念模型，实际上虚拟机会优化掉很大一部分不必要的加锁）、用户态核心态转换、维护锁计数器和检查是否有被阻塞的线程需要唤醒等操作。随着硬件指令集的发展，我们有了另外一个选择：基于冲突检测的乐观并发策略，通俗地说，就是先进行操作，如果没有其他线程争用共享数据，那操作就成功了；如果共享数据有争用，产生了冲突，那就再采取其他的补偿措施（最常见的补偿措施就是不断地重试，直到成功为止），这种乐观的并发策略的许多实现都不需要把线程挂起，因此这种同步操作称为非阻塞同步（Non-Blocking Synchronization）。

乐观锁需要操作和冲突检测这两个步骤具备原子性，这里就不能再使用互斥同步来保证了，只能靠硬件来完成。硬件支持的原子性操作最典型的是：比较并交换（Compare-and-Swap，CAS）。

CAS 指令需要有 3 个操作数，分别是内存位置（在 Java 中可以简单理解为变量的内存地址，用 V 表示）、旧的预期值（用 A 表示）和新值（用 B 表示）。CAS 指令执行时，当且仅当 V 符合旧预期值 A 时，处理器用新值 B 更新 V 的值，否则它就不执行更新。但是无论是否更新了 V 的值，都会返回 V 的旧值，上述的处理过程是一个原子操作。

J.U.C 包里面的整数原子类 AtomicInteger，其中的 compareAndSet() 和 getAndIncrement() 等方法都使用了 Unsafe 类的 CAS 操作。

ABA ：如果一个变量 V 初次读取的时候是 A 值，它的值被改成了 B，后来又被改回为 A，那 CAS 操作就会误认为它从来没有被改变过。大部分情况下 ABA 问题不会影响程序并发的正确性，如果需要解决 ABA 问题，改用传统的互斥同步可能会比原子类更高效。

### 3. 无同步方案

要保证线程安全，并不是一定就要进行同步，两者没有因果关系。同步只是保证共享数据争用时的正确性的手段，如果一个方法本来就不涉及共享数据，那它自然就无须任何同步措施去保证正确性，因此会有一些代码天生就是线程安全的。

**可重入代码（Reentrant Code）** 

这种代码也叫做纯代码（Pure Code），可以在代码执行的任何时刻中断它，转而去执行另外一段代码（包括递归调用它本身），而在控制权返回后，原来的程序不会出现任何错误。相对线程安全来说，可重入性是更基本的特性，它可以保证线程安全，即所有的可重入的代码都是线程安全的，但是并非所有的线程安全的代码都是可重入的。

可重入代码有一些共同的特征，例如不依赖存储在堆上的数据和公用的系统资源、用到的状态量都由参数中传入、不调用非可重入的方法等。我们可以通过一个简单的原则来判断代码是否具备可重入性：如果一个方法，它的返回结果是可以预测的，只要输入了相同的数据，就都能返回相同的结果，那它就满足可重入性的要求，当然也就是线程安全的。

**线程本地存储（Thread Local Storage）** 

如果一段代码中所需要的数据必须与其他代码共享，那就看看这些共享数据的代码是否能保证在同一个线程中执行。如果能保证，我们就可以把共享数据的可见范围限制在同一个线程之内，这样，无须同步也能保证线程之间不出现数据争用的问题。

符合这种特点的应用并不少见，大部分使用消费队列的架构模式（如“生产者-消费者”模式）都会将产品的消费过程尽量在一个线程中消费完，其中最重要的一个应用实例就是经典 Web 交互模型中的“一个请求对应一个服务器线程”（Thread-per-Request）的处理方式，这种处理方式的广泛应用使得很多 Web 服务端应用都可以使用线程本地存储来解决线程安全问题。

Java 语言中，如果一个变量要被多线程访问，可以使用 volatile 关键字声明它为“易变的”；如果一个变量要被某个线程独享，Java 中就没有类似 C++中 \_\_declspec（thread）这样的关键字，不过还是可以通过 java.lang.ThreadLocal 类来实现线程本地存储的功能。每一个线程的 Thread 对象中都有一个 ThreadLocalMap 对象，这个对象存储了一组以 ThreadLocal.threadLocalHashCode 为键，以本地线程变量为值的 K-V 值对，ThreadLocal 对象就是当前线程的 ThreadLocalMap 的访问入口，每一个 ThreadLocal 对象都包含了一个独一无二的 threadLocalHashCode 值，使用这个值就可以在线程 K-V 值对中找回对应的本地线程变量。

ThreadLocal 从理论上讲并不是用来解决多线程并发问题的，因为根本不存在多线程竞争。在一些场景 (尤其是使用线程池) 下, 由于 ThreadLocal.ThreadLocalMap 的底层数据结构导致 ThreadLocal 有内存泄漏的情况，尽可能在每次使用 ThreadLocal 后手动调用 remove()，以避免出现 ThreadLocal 经典的内存泄漏甚至是造成自身业务混乱的风险。

## 锁优化

高效并发是从 JDK 1.5 到 JDK 1.6 的一个重要改进，HotSpot 虚拟机开发团队在这个版本上花费了大量的精力去实现各种锁优化技术，如适应性自旋（Adaptive Spinning）、锁消除（Lock Elimination）、锁粗化（Lock Coarsening）、轻量级锁（Lightweight Locking）和偏向锁（Biased Locking）等。这些技术都是为了在线程之间更高效地共享数据，以及解决竞争问题，从而提高程序的执行效率。

### 1. 自旋锁与自适应自旋

前面我们讨论互斥同步的时候，提到了互斥同步对性能最大的影响是阻塞的实现，挂起线程和恢复线程的操作都需要转入内核态完成，这些操作给系统的并发性能带来了很大的压力。同时，虚拟机的开发团队也注意到在许多应用上，共享数据的锁定状态只会持续很短的一段时间，为了这段时间去挂起和恢复线程并不值得。如果物理机器有一个以上的处理器，能让两个或以上的线程同时并行执行，我们就可以让后面请求锁的那个线程 “稍等一下”，但不放弃处理器的执行时间，看看持有锁的线程是否很快就会释放锁。为了让线程等待，我们只需让线程执行一个忙循环（自旋），这项技术就是所谓的自旋锁。

自旋等待本身虽然避免了线程切换的开销，但它是要占用处理器时间的，因此，如果锁被占用的时间很短，自旋等待的效果就会非常好。反之，如果锁被占用的时候很长，那么自旋的线程只会白白消耗处理器资源，而不会做任何有用的工作，反而会带来性能上的浪费。因此，自旋等待的时间必须要有一定的限度，如果自旋超过了限定的次数仍然没有成功获得锁，就应当使用传统的方式去挂起线程了。自旋次数的默认值是 10 次，用户可以使用参数 -XX:PreBlockSpin 来更改。

在 JDK 1.6 中引入了自适应的自旋锁。自适应意味着自旋的时间不再固定了，而是由前一次在同一个锁上的自旋时间及锁的拥有者的状态来决定。如果在同一个锁对象上，自旋等待刚刚成功获得过锁，并且持有锁的线程正在运行中，那么虚拟机就会认为这次自旋也很有可能再次成功，进而它将允许自旋等待持续相对更长的时间，比如 100 个循环。另外，如果对于某个锁，自旋很少成功获得过，那在以后要获取这个锁时将可能省略掉自旋过程，以避免浪费处理器资源。有了自适应自旋，随着程序运行和性能监控信息的不断完善，虚拟机对程序锁的状况预测就会越来越准确，虚拟机就会变得越来越“聪明”了。

### 2. 锁消除

锁消除是指虚拟机即时编译器在运行时，对一些代码上要求同步，但是被检测到不可能存在共享数据竞争的锁进行消除。锁消除的主要判定依据来源于逃逸分析的数据支持，如果判定在一段代码中，堆上的所有数据都不会逃逸出去从而被其他线程访问到，那就可以把他们当做栈上数据对待，认为它们是线程私有的，同步加锁自然就无须进行。

也许读者会有疑问，变量是否逃逸，对于虚拟机来说需要使用数据流分析来确定，但是程序自己应该是很清楚的，怎么会在明知道不存在数据争用的情况下要求同步呢？答案是有许多同步措施并不是程序员自己加入的。同步的代码在 Java 程序中的普遍程度也许超过了大部分读者的想象。下面段非常简单的代码仅仅是输出 3 个字符串相加的结果，无论是源码字面上还是程序语义上都没有同步。

```java
public static String concatString(String s1, String s2, String s3) {
    return s1 + s2 + s3;
}
```

我们也知道，由于 String 是一个不可变的类，对字符串的连接操作总是通过生成新的 String 对象来进行的，因此 Javac 编译器会对 String 连接做自动优化。在 JDK 1.5 之前，会转化为 StringBuffer 对象的连续 append() 操作，在 JDK 1.5 及以后的版本中，会转化为 StringBuilder 对象的连续 append() 操作，即上面的代码可能会变成下面的样子：

```java
public static String concatString(String s1, String s2, String s3) {
    StringBuffer sb = new StringBuffer();
    sb.append(s1);
    sb.append(s2);
    sb.append(s3);
    return sb.toString();
}
```
每个 StringBuffer.append() 方法中都有一个同步块，锁就是 sb 对象。虚拟机观察变量 sb，很快就会发现它的动态作用域被限制在 concatString() 方法内部。也就是说，sb 的所有引用永远不会 “逃逸” 到 concatString() 方法之外，其他线程无法访问到它。因此，虽然这里有锁，但是可以被安全地消除掉，在即时编译之后，这段代码就会忽略掉所有的同步而直接执行了。

### 3. 锁粗化

原则上，我们在编写代码的时候，总是推荐将同步块的作用范围限制得尽量小：只在共享数据的实际作用域中才进行同步。这样是为了使得需要同步的操作数量尽可能变小，如果存在锁竞争，那等待锁的线程也能尽快拿到锁。

大部分情况下，上面的原则都是正确的，但是如果一系列的连续操作都对同一个对象反复加锁和解锁，甚至加锁操作是出现在循环体中，那即使没有线程竞争，频繁地进行互斥同步操作也会导致不必要的性能损耗。

上一节的示例代码中连续的 append() 方法就属于这类情况。如果虚拟机探测到由这样的一串零碎的操作都对同一个对象加锁，将会把加锁同步的范围扩展（粗化）到整个操作序列的外部。对于上一节的示例代码就是扩展到第一个 append() 操作之前直至最后一个 append() 操作之后，这样只需要加锁一次就可以了。

### 4. 轻量级锁

轻量级锁是 JDK 1.6 之中加入的新型锁机制，它名字中的“轻量级”是相对于使用操作系统互斥量来实现的传统锁而言的，因此传统的锁机制就称为“重量级”锁。首先需要强调一点的是，轻量级锁并不是用来代替重要级锁的，它的本意是在没有多线程竞争的前提下，减少传统的重量级锁使用操作系统互斥量产生的性能消耗。

要理解轻量级锁，以及后面会讲到的偏向锁的原理和运作过程，必须从 HotSpot 虚拟机的对象（对象头部分）的内存布局开始介绍。HotSpot 虚拟机的对象头（Object Header）分为两部分信息，第一部分用于存储对象自身的运行时数据，如哈希码（HashCode）、GC 分代年龄（Generational GC Age）等，这部分数据是长度在 32 位和 64 位的虚拟机中分别为 32 bit 和 64 bit，官方称它为“Mark Word”，它是实现轻量级锁和偏向锁的关键。另外一部分用于存储指向方法区对象类型数据的指针，如果是数组对象的话，还会有一个额外的部分用于存储数组长度。

简单地介绍了对象的内存布局后，我们把话题返回到轻量级锁的执行过程上。在代码进入同步块的时候，如果此同步对象没有被锁定（锁标志位为 “01” 状态）虚拟机首先将在当前线程的栈帧中建立一个名为锁记录（Lock Record）的空间，用于存储锁对象目前的 Mark Word 的拷贝（官方把这份拷贝加上了一个 Displaced 前缀，即 Displaced Mark Word）。然后，虚拟机将使用 CAS 操作尝试将对象的 Mark Word 更新为指向 Lock Record 的指针。如果这个更新动作成功了，那么这个线程就拥有了该对象的锁，并且对象 Mark Word 的锁标志位（Mark Word 的最后 2bit）将转变为 “00”，即表示此对象处于轻量级锁定状态。

<div align="center"> <img src="../pics//8cc671f0-7134-44b1-a7b5-6d24fe55e1c1.jpg"/> </div><br>

如果这个更新操作失败了，虚拟机首先会检查对象的 Mark Word 是否指向当前线程的栈帧，如果是的话只说明当前线程已经拥有了这个对象的锁，那就可以直接进入同步块继续执行，否则说明这个锁对象已经被其他线程线程抢占了。如果有两条以上的线程争用同一个锁，那轻量级锁就不再有效，要膨胀为重量级锁，所标志的状态变为“10”，Mark Word 中存储的就是指向重量级锁（互斥量）的指针，后面等待锁的线程也要进入阻塞状态。

上面描述的是轻量级锁的加锁过程，它的解锁过程也是通过 CAS 操作来进行的，如果对象的 Mark Word 仍然指向着线程的锁记录，那就用 CAS 操作把对象当前的 Mark Word 和线程中复制的 Displaced Mark Word 替换回来，如果替换成功，整个同步过程就完成了。如果替换失败，说明有其他线程尝试过获取该锁，那就要释放锁的同时，唤醒被挂起的线程。

轻量级锁能提升程序同步性能的依据是“对于绝大部分的锁，在整个同步周期内都是不存在竞争的”，这是一个经验数据。如果没有竞争，轻量级锁使用 CAS 操作避免了使用互斥量的开销，但如果存在锁竞争，除了互斥量的开销外，还额外发生了 CAS 操作，因此在有竞争的情况下，轻量级锁会比传统的重量级锁更慢。

### 5. 偏向锁

偏向锁也是 JDK 1.6 中引入的一项锁优化，它的目的是消除数据在无竞争情况下的同步原语，进一步提高程序的运行性能。如果说轻量级锁是在无竞争的情况下使用 CAS 操作去消除同步使用的互斥量，那偏向锁就是在无竞争的情况下把整个同步都消除掉，连 CAS 操作都不做了。

偏向锁的“偏”，就是偏心的“偏”、偏袒的“偏”，它的意思是这个锁会偏向于第一个获得它的线程，如果在接下来的执行过程中，该锁没有被其他的线程获取，则持有偏向锁的线程将永远不需要再进行同步。

假设当前虚拟机启用了偏向锁（启用参数 -XX:+UseBiasedLocking，这是 JDK 1.6 的默认值），那么，当锁对象第一次被线程获取的时候，虚拟机将会把对象头中的标志位设为“01”，即偏向模式。同时使用 CAS 操作把获取到这个锁的线程 ID 记录在对象的 Mark Word 之中，如果 CAS 操作成功，持有偏向锁的线程以后每次进入这个锁相关的同步块时，虚拟机都可以不再进行如何同步操作（例如 Locking、Unlocking 及对 Mark Word 的 Update 等）。

当有另外一个线程去尝试获取这个锁时，偏向模式就宣告结束。根据锁对象目前是否处于被锁定的状态，撤销偏向（Revoke Bias）后恢复到未锁定（标志位为“01”）或轻量级锁定（标志位为“00”）的状态，后续的同步操作就如上面介绍的轻量级锁那样执行。偏向锁、轻量级锁的状态转换及对象 Mark Word 的关系如图 13-5 所示。

<div align="center"> <img src="../pics//390c913b-5f31-444f-bbdb-2b88b688e7ce.jpg"/> </div><br>

偏向锁可以提高带有同步但无竞争的程序性能。它同样是一个带有效益权衡（Trade Off）性质的优化，也就是说，它并不一定总是对程序运行有利，如果程序中大多数的锁总是被多个不同的线程访问，那偏向模式就是多余的。在具体问题具体分析的前提下，有时候使用参数 -XX:-UseBiasedLocking 来禁止偏向锁优化反而可以提升性能。

# 九、多线程开发良好的实践

1. 给线程起个有意义的名字，这样可以方便找 Bug；

2. 因为锁花费的代价很高，应该尽可能减小同步范围；

3. 多用同步类少用 wait 和 notify。首先，CountDownLatch, Semaphore, CyclicBarrier 和 Exchanger 这些同步类简化了编码操作，而用 wait 和 notify 很难实现对复杂控制流的控制。其次，这些类是由最好的企业编写和维护在后续的 JDK 中它们还会不断优化和完善，使用这些更高等级的同步工具你的程序可以不费吹灰之力获得优化。

4. 多用并发集合少用同步集合。并发集合比同步集合的可扩展性更好，例如应该使用 ConcurrentHashMap 而不是 Hashttable。

# 参考资料

- BruceEckel. Java 编程思想: 第 4 版 [M]. 机械工业出版社, 2007.
- 周志明. 深入理解 Java 虚拟机 [M]. 机械工业出版社, 2011.
- [线程通信](http://ifeve.com/thread-signaling/#missed_signal)
- [Java 线程面试题 Top 50](http://www.importnew.com/12773.html)
- [BlockingQueue](http://tutorials.jenkov.com/java-util-concurrent/blockingqueue.html)
- [thread state java](https://stackoverflow.com/questions/11265289/thread-state-java)
- [CSC 456 Spring 2012/ch7 MN](http://wiki.expertiza.ncsu.edu/index.php/CSC_456_Spring_2012/ch7_MN)
- [Java - Understanding Happens-before relationship](https://www.logicbig.com/tutorials/core-java-tutorial/java-multi-threading/happens-before.html)
- [6장 Thread Synchronization](https://www.slideshare.net/novathinker/6-thread-synchronization)
