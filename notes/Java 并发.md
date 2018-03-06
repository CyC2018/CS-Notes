<!-- GFM-TOC -->
* [使用线程](#使用线程)
    * [1. 实现 Runnable 接口](#1-实现-runnable-接口)
    * [2. 实现 Callable 接口](#2-实现-callable-接口)
    * [3. 继承 Tread 类](#3-继承-tread-类)
    * [4. 实现接口 vs 继承 Thread](#4-实现接口-vs-继承-thread)
* [Executor](#executor)
* [基础线程机制](#基础线程机制)
    * [1. sleep()](#1-sleep)
    * [2. yield()](#2-yield)
    * [3. join()](#3-join)
    * [4. deamon](#4-deamon)
* [线程之间的协作](#线程之间的协作)
    * [1. 线程通信](#1-线程通信)
    * [2. 线程同步](#2-线程同步)
        * [2.1 synchronized](#21-synchronized)
        * [2.2 Lock](#22-lock)
        * [2.3 BlockingQueue](#23-blockingqueue)
* [线程状态](#线程状态)
* [结束线程](#结束线程)
    * [1. 阻塞](#1-阻塞)
    * [2. 中断](#2-中断)
* [原子性](#原子性)
* [volatile](#volatile)
    * [1. 内存可见性](#1-内存可见性)
    * [2. 禁止指令重排](#2-禁止指令重排)
* [多线程开发良好的实践](#多线程开发良好的实践)
* [未完待续](#未完待续)
* [参考资料](#参考资料)
<!-- GFM-TOC -->


# 使用线程

有三种使用线程的方法：

1. 实现 Runnable 接口；
2. 实现 Callable 接口；
3. 继承 Tread 类；

实现 Runnable 和 Callable 接口的类只能当做一个可以在线程中运行的任务，不是真正意义上的线程，因此最后还需要通过 Thread 来调用。可以说任务是通过线程驱动从而执行的。

## 1. 实现 Runnable 接口

需要实现 run() 方法

通过 Thread 调用 start() 方法来启动线程

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

## 2. 实现 Callable 接口

与 Runnable 相比，Callable 可以有返回值，返回值通过 FutureTask 进行封装。

```java
public  class  MyCallable  implements  Callable<Integer> {
    public Integer call() {
        // ...
    }
    public  static  void  main(String[]  args) {
        MyCallable mc = new MyCallable();
        FutureTask<Integer> ft = new FutureTask<>(mc);
        Thread thread = new Thread(ft);
        thread.start();
        System.out.println(ft.get());
    }
}
```

## 3. 继承 Tread 类

同样也是需要实现 run() 方法，并且最后也是调用 start() 方法来启动线程。

```java
class MyThread extends Thread {
    public void run() {
        // ...
    }
    public  static  void  main(String[]  args) {
        MyThread mt = new MyThread();
        mt.start();
    }
}
```

## 4. 实现接口 vs 继承 Thread

实现接口会更好一些，因为：

1. Java 不支持多重继承，因此继承了 Thread 类就无法继承其它类，但是可以实现多个接口。
2. 类可能只要求可执行即可，继承整个 Thread 类开销会过大。

# Executor

Executor 管理多个异步任务的执行，而无需程序员显示地管理线程的生命周期。

主要有三种 Excutor：

1. CachedTreadPool：一个任务创建一个线程；
2. FixedThreadPool：所有任务只能使用固定大小的线程；
3. SingleThreadExecutor：相当于大小为 1 的 FixedThreadPool。

```java
ExecutorService exec = Executors.newCachedThreadPool();
for(int i = 0; i < 5; i++) {
    exec.execute(new MyRunnable());
}
```

# 基础线程机制

## 1. sleep()

**Thread.sleep(millisec)**  方法会休眠当前正在执行的线程，millisec 单位为毫秒。也可以使用 TimeUnit.TILLISECONDS.sleep(millisec)。

sleep() 可能会抛出 InterruptedException。因为异常不能跨线程传播回 main() 中，因此必须在本地进行处理。线程中抛出的其它异常也同样需要在本地进行处理。

```java
public void run() {
    try {
        // ...
        Thread.sleep(1000);
        // ...
    } catch(InterruptedException e) {
        System.err.println(e);
    }
}
```

## 2. yield()

对静态方法  **Thread.yield()**  的调用声明了当前线程已经完成了生命周期中最重要的部分，可以切换给其它线程来执行。

```java
public void run() {
    // ...
    Thread.yield();
}
```

## 3. join()

在线程中调用另一个线程的  **join()**  方法，会将当前线程挂起，直到目标线程结束。

可以加一个超时参数。

## 4. deamon

后台线程（ **deamon** ）是程序运行时在后台提供服务的线程，并不属于程序中不可或缺的部分。

当所有非后台线程结束时，程序也就终止，同时会杀死所有后台线程。

main() 属于非后台线程。

使用 setDaemon() 方法将一个线程设置为后台线程。

# 线程之间的协作

-  **线程通信** ：保证线程以一定的顺序执行；
-  **线程同步** ：保证线程对临界资源的互斥访问。

线程通信往往是基于线程同步的基础上完成的，因此很多线程通信问题也是线程同步问题。

## 1. 线程通信

**wait()、notify() 和 notifyAll()**  三者实现了线程之间的通信。

wait() 会在等待时将线程挂起，而不是忙等待，并且只有在 notify() 或者 notifyAll() 到达时才唤醒。

sleep() 和 yield() 并没有释放锁，但是 wait() 会释放锁。实际上，只有在同步控制方法或同步控制块里才能调用 wait() 、notify() 和 notifyAll()。

这几个方法属于基类的一部分，而不属于 Thread。

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

1. wait() 是 Object 类的方法，而 sleep() 是 Thread 的静态方法；
2. wait() 会放弃锁，而 sleep() 不会。

## 2. 线程同步

给定一个进程内的所有线程，都共享同一存储空间，这样有好处又有坏处。这些线程就可以共享数据，非常有用。不过，在两个线程同时修改某一资源时，这也会造成一些问题。Java 提供了同步机制，以控制对共享资源的互斥访问。

### 2.1 synchronized

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

### 2.2 Lock

若要实现更细粒度的控制，我们可以使用锁（lock）。

```java
private Lock lock;
public int func(int value) {
    lock.lock();
    // ...
    lock.unlock();
}
```

### 2.3 BlockingQueue

java.util.concurrent.BlockingQueue 接口有以下阻塞队列的实现：

-  **FIFO 队列** ：LinkedBlockingQueue、ArrayListBlockingQueue（固定长度）
-  **优先级队列** ：PriorityBlockingQueue

提供了阻塞的 take() 和 put() 方法：如果队列为空 take() 将一直阻塞到队列中有内容，如果队列为满  put() 将阻塞到队列有空闲位置。它们响应中断，当收到中断请求的时候会抛出 InterruptedException，从而提前结束阻塞状态。

**使用 BlockingQueue 实现生产者消费者问题** 

```java
// 生产者
import java.util.concurrent.BlockingQueue;

public class Producer implements Runnable {
    private BlockingQueue<String> queue;

    public Producer(BlockingQueue<String> queue) {
        this.queue = queue;
    }

    @Override
    public void run() {
        System.out.println(Thread.currentThread().getName() + " is making product...");
        String product = "made by " + Thread.currentThread().getName();
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
import java.util.concurrent.BlockingQueue;

public class Consumer implements Runnable{
    private BlockingQueue<String> queue;

    public Consumer(BlockingQueue<String> queue) {
        this.queue = queue;
    }

    @Override
    public void run() {
        try {
            String  product = queue.take();
            System.out.println(Thread.currentThread().getName() + " is consuming product " + product + "...");
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }
}
```

```java
// 客户端
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.LinkedBlockingQueue;

public class Client {
    public static void main(String[] args) {
        BlockingQueue<String> queue = new LinkedBlockingQueue<>(5);
        for (int i = 0; i < 2; i++) {
            new Thread(new Consumer(queue), "Producer" + i).start();
        }
        for (int i = 0; i < 5; i++) {
            // 只有两个 Product，因此只能消费两个，其它三个消费者被阻塞
            new Thread(new Producer(queue), "Consumer" + i).start();
        }
        for (int i = 2; i < 5; i++) {
            new Thread(new Consumer(queue), "Producer" + i).start();
        }
    }
}
```

```html
// 运行结果
Consumer0 is making product...
Producer0 is consuming product made by Consumer0...
Consumer1 is making product...
Producer1 is consuming product made by Consumer1...
Consumer2 is making product...
Consumer3 is making product...
Consumer4 is making product...
Producer2 is consuming product made by Consumer2...
Producer3 is consuming product made by Consumer3...
Producer4 is consuming product made by Consumer4...
```

# 线程状态

JDK 从 1.5 开始在 Thread 类中增添了 State 枚举，包含以下六种状态：

1.  **NEW** （新建）
2.  **RUNNABLE** （当线程正在运行或者已经就绪正等待 CPU 时间片）
3.  **BLOCKED** （阻塞，线程在等待获取对象同步锁）
4.  **Waiting** （调用不带超时的 wait() 或 join()）
5.  **TIMED_WAITING** （调用 sleep()、带超时的 wait() 或者 join()）
6.  **TERMINATED** （死亡）

<br><div align="center"> <img src="https://github.com/CyC2018/InterviewNotes/blob/master/pics//19f2c9ef-6739-4a95-8e9d-aa3f7654e028.jpg"/> </div><br>

# 结束线程

## 1. 阻塞

一个线程进入阻塞状态可能有以下原因：

1. 调用 Thread.sleep() 方法进入休眠状态；
2. 通过 wait() 使线程挂起，直到线程得到 notify() 或 notifyAll() 消息（或者 java.util.concurrent 类库中等价的 signal() 或 signalAll() 消息；
3. 等待某个 I/O 的完成；
4. 试图在某个对象上调用其同步控制方法，但是对象锁不可用，因为另一个线程已经获得了这个锁。

## 2. 中断

使用中断机制即可终止阻塞的线程。

使用  **interrupt()**  方法来中断某个线程，它会设置线程的中断状态。Object.wait(), Thread.join() 和 Thread.sleep() 三种方法在收到中断请求的时候会清除中断状态，并抛出 InterruptedException。

应当捕获这个 InterruptedException 异常，从而做一些清理资源的操作。

**不可中断的阻塞** 

不能中断 I/O 阻塞和 synchronized 锁阻塞。

**Executor 的中断操作** 

Executor 避免对 Thread 对象的直接操作，但是使用 interrupt() 方法必须持有 Thread 对象。Executor 使用 shutdownNow() 方法来中断所有它里面的所有线程，shutdownNow() 方法会发送 interrupt() 调用给所有线程。

如果只想中断一个线程，那么使用 Executor 的 submit() 而不是 executor() 来启动线程，就可以持有线程的上下文。submit() 将返回一个泛型 Futrue，可以在它之上调用 cancel()，如果将 true 传递给 cancel()，那么它将会发送 interrupt() 调用给特定的线程。

**检查中断** 

通过中断的方法来终止线程，需要线程进入阻塞状态才能终止。如果编写的 run() 方法循环条件为 true，但是该线程不发生阻塞，那么线程就永远无法终止。

interrupt() 方法会设置中断状态，可以通过 interrupted() 方法来检查中断状，从而判断一个线程是否已经被中断。

interrupted() 方法在检查完中断状态之后会清除中断状态，这样做是为了确保一次中断操作只会产生一次影响。

# 原子性

对于除 long 和 double 之外的基本类型变量的读写，可以看成是具有原子性的，以不可分割的步骤操作内存。

JVM 将 64 位变量（long 和 double）的读写当做两个分离的 32 位操作来执行，在两个操作之间可能会发生上下文切换，因此不具有原子性。可以使用  **volatile**  关键字来定义 long 和 double 变量，从而获得原子性。

**AtomicInteger、AtomicLong、AtomicReference**  等特殊的原子性变量类提供了下面形式的原子性条件更新语句，使得比较和更新这两个操作能够不可分割地执行。

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

原子性具有很多复杂问题，应当尽量使用同步而不是原子性。

# volatile

保证了内存可见性和禁止指令重排，没法保证原子性。

## 1. 内存可见性

普通共享变量被修改之后，什么时候被写入主存是不确定的。

volatile 关键字会保证每次修改共享变量之后该值会立即更新到内存中，并且在读取时会从内存中读取值。

synchronized 和 Lock 也能够保证内存可见性。它们能保证同一时刻只有一个线程获取锁然后执行同步代码，并且在释放锁之前会将对变量的修改刷新到主存当中。不过只有对共享变量的 set() 和 get() 方法都加上 synchronized 才能保证可见性，如果只有 set() 方法加了 synchronized，那么 get() 方法并不能保证会从内存中读取最新的数据。

## 2. 禁止指令重排

在 Java 内存模型中，允许编译器和处理器对指令进行重排序，重排序过程不会影响到单线程程序的执行，却会影响到多线程并发执行的正确性。

volatile 关键字通过添加内存屏障的方式来进制指令重排，即重排序时不能把后面的指令放到内存屏障之前。

可以通过 synchronized 和 Lock 来保证有序性，它们保证每个时刻只有一个线程执行同步代码，相当于是让线程顺序执行同步代码，自然就保证了有序性。

# 多线程开发良好的实践

- 给线程命名；
- 最小化同步范围；
- 优先使用 volatile；
- 尽可能使用更高层次的并发工具而非 wait 和 notify() 来实现线程通信，如 BlockingQueue, Semeaphore；
- 多用并发容器，少用同步容器，并发容器壁同步容器的可扩展性更好。
- 考虑使用线程池
- 最低限度的使用同步和锁，缩小临界区。因此相对于同步方法，同步块会更好。

# 未完待续

# 参考资料

- Java 编程思想
- [Java 线程面试题 Top 50](http://www.importnew.com/12773.html)
- [Java 面试专题 - 多线程 & 并发编程 ](https://www.jianshu.com/p/e0c8d3dced8a)
- [可重入内置锁](https://github.com/francistao/LearningNotes/blob/master/Part2/JavaConcurrent/%E5%8F%AF%E9%87%8D%E5%85%A5%E5%86%85%E7%BD%AE%E9%94%81.md)
