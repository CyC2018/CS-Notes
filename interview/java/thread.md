<!-- TOC -->

- [CountDownLatch的用法](#countdownlatch的用法)
- [线程创建](#线程创建)
- [线程间协作](#线程间协作)
    - [join](#join)
    - [wait](#wait)
    - [interrupt](#interrupt)
    - [Condition](#condition)
- [Executor 框架](#executor-框架)
    - [Executor 主要的类和接口](#executor-主要的类和接口)
        - [ThreadPoolExecutor](#threadpoolexecutor)
        - [newFixedThreadPool](#newfixedthreadpool)
        - [newSingleThreadExecutor](#newsinglethreadexecutor)
        - [newScheduledThreadPool](#newscheduledthreadpool)
        - [newCachedThreadPool](#newcachedthreadpool)
        - [Future 接口](#future-接口)
        - [ScheduledThreadPoolExecutor](#scheduledthreadpoolexecutor)
- [参考文档](#参考文档)

<!-- /TOC -->

# CountDownLatch的用法

CountDownLatch 是一个同步工具类，用来协调多个线程之间的同步，或者说起到线程之间的通信。

如果想当前线程在别的线程执行完毕后执行，可以使用CountDownLatch。

``` java
/**<p><b>Sample usage:</b> Here is a pair of classes in which a group
 * of worker threads use two countdown latches:
 * <ul>
 * <li>The first is a start signal that prevents any worker from proceeding
 * until the driver is ready for them to proceed;
 * <li>The second is a completion signal that allows the driver to wait
 * until all workers have completed.
 * </ul>
 *
 *  <pre> {@code
 * class Driver { // ...
 *   void main() throws InterruptedException {
 *     CountDownLatch startSignal = new CountDownLatch(1);
 *     CountDownLatch doneSignal = new CountDownLatch(N);
 *
 *     for (int i = 0; i < N; ++i) // create and start threads
 *       new Thread(new Worker(startSignal, doneSignal)).start();
 *
 *     doSomethingElse();            // don't let run yet
 *     startSignal.countDown();      // let all threads proceed
 *     doSomethingElse();
 *     doneSignal.await();           // wait for all to finish
 *   }
 * }
 *
 * class Worker implements Runnable {
 *   private final CountDownLatch startSignal;
 *   private final CountDownLatch doneSignal;
 *   Worker(CountDownLatch startSignal, CountDownLatch doneSignal) {
 *     this.startSignal = startSignal;
 *     this.doneSignal = doneSignal;
 *   }
 *   public void run() {
 *     try {
 *       startSignal.await();
 *       doWork();
 *       doneSignal.countDown();
 *     } catch (InterruptedException ex) {} // return;
 *   }
 *
 *   void doWork() { ... }
 * }}</pre>

```

# 线程创建

线程创建通常有3中方法：
- 继承 Thread 类
- 实现 Runnable 接口
- 实现 Callable 接口

实现 Runnable 接口来创建一个线程：

``` java
public class MyThread extends Thread {

  public static void main(String[] args) {
    Thread t1 = new MyThread();
    t1.start();
    Thread t2 = new Thread(new MyThread2());
    t2.start();
    Callable call = new MyCallable();
    FutureTask<String> task = new FutureTask<String>(call);
    Thread t3 =  new Thread(task);
    t3.start();
  }

  @Override
  public void run() {
    System.out.println("线程运行中---------extends");
  }

  static class MyThread2 implements Runnable{

    @Override
    public void run() {
      System.out.println("线程运行中------runnable");
    }
  }

  static class MyCallable implements Callable{

    @Override
    public String call() throws Exception {
      System.out.println("线程运行中------callable");
      return "call over!";
    }
  }
}
```

# 线程间协作

## join

在线程中调用另一个线程的 join() 方法，会将当前线程挂起，而不是忙等待，直到目标线程结束。

对于以下代码，虽然 b 线程先启动，但是因为在 b 线程中调用了 a 线程的 join() 方法，b 线程会等待 a 线程结束才继续执行，因此最后能够保证 a 线程的输出先于 b 线程的输出。

``` java
public class JoinExample {

    public static void main(String[] args) {
        JoinExample example = new JoinExample();
        example.test();
    }
    private class A extends Thread {
        @Override
        public void run() {
            System.out.println("A");
        }
    }

    private class B extends Thread {

        private A a;

        B(A a) {
            this.a = a;
        }

        @Override
        public void run() {
            try {
                a.join();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            System.out.println("B");
        }
    }

    public void test() {
        A a = new A();
        B b = new B(a);
        b.start();
        a.start();
    }
}
```

## wait

wait 方法会使得当前线程进入等待状态，使用 wait() 挂起期间，线程会释放锁。这是因为，如果没有释放锁，那么其它线程就无法进入对象的同步方法或者同步控制块中，那么就无法执行 notify() 或者 notifyAll() 来唤醒挂起的线程，造成死锁。

wait() 和 sleep() 的区别

- wait() 是 Object 的方法，而 sleep() 是 Thread 的静态方法；
- wait() 会释放锁，sleep() 不会。

## interrupt

线程中断的方法有两种：

1. 使用 interrupted()来作为线程循环执行的判断条件

``` java
public class InterruptExample {

    private static class MyThread2 extends Thread {
        @Override
        public void run() {
            while (!interrupted()) {
                // ..
            }
            System.out.println("Thread end");
        }
    }
}
```

2. 使用InterruptedException

通过调用一个线程的 interrupt() 来中断该线程，如果该线程处于阻塞、限期等待或者无限期等待状态，那么就会抛出 InterruptedException，从而提前结束该线程。但是不能中断 I/O 阻塞和 synchronized 锁阻塞

对于以下代码，在 main() 中启动一个线程之后再中断它，由于线程中调用了 Thread.sleep() 方法，因此会抛出一个 InterruptedException，从而提前结束线程，不执行之后的语句。

``` java
public class InterruptExample {

    private static class MyThread1 extends Thread {
        @Override
        public void run() {
            try {
                Thread.sleep(2000);
                System.out.println("Thread run");
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }
}
public static void main(String[] args) throws InterruptedException {
    Thread thread1 = new MyThread1();
    thread1.start();
    thread1.interrupt();
    System.out.println("Main run");
}
```

## Condition

java.util.concurrent 类库中提供了 Condition 类来实现线程之间的协调，可以在 Condition 上调用 await() 方法使线程等待，其它线程调用 signal() 或 signalAll() 方法唤醒等待的线程。相比于 wait() 这种等待方式，await() 可以指定等待的条件，因此更加灵活。

``` java
public class AwaitSignalExample {
    private Lock lock = new ReentrantLock();
    private Condition condition = lock.newCondition();

    public void before() {
        lock.lock();
        try {
            System.out.println("before");
            condition.signalAll();
        } finally {
            lock.unlock();
        }
    }

    public void after() {
        lock.lock();
        try {
            condition.await();
            System.out.println("after");
        } catch (InterruptedException e) {
            e.printStackTrace();
        } finally {
            lock.unlock();
        }
    }
}
```

# Executor 框架

Executor 框架主要由3大部分组成，如下：

![](img/TIM截图20180801171519.jpg)

- 任务

被执行的任务需要实现 Runnable 或者 Callable接口

- 任务的执行

任务执行的核心接口 Executor, 以及继承自 Executor 的 ExecutorService 接口。 Executor 框架有两个关键类实现了 ExecutorService 接口(ThreadPoolExecutor 和 ScheduledThreadPoolExecutor)

- 异步计算的结果

![](img/TIM截图20180801172104.jpg)

Future 接口和 FutureTask 类

## Executor 主要的类和接口

类和接口 | 说明 
--- | ---
Executor | 一个接口，其定义了一个接收Runnable对象的方法executor，其方法签名为executor(Runnable command), Executor 框架的基础，它将任务的提交和任务的执行分离开来
ExecutorService | 是一个比Executor使用更广泛的子类接口，其提供了生命周期管理的方法，以及可跟踪一个或多个异步任务执行状况返回Future的方法
AbstractExecutorService | ExecutorService执行方法的默认实现
ThreadPoolExecutor | 线程池的核心实现类，用来执行被提交的任务。通过调用Executors以下静态工厂方法来创建线程池并返回一个ExecutorService对象
ScheduledExecutorService | 一个可定时调度任务的接口
ScheduledThreadPoolExecutor | ScheduledExecutorService 的实现类， 可以在给定的延迟后运行命令，或者定期执行命令， 比 Timer更加灵活，功能更加强大。

### ThreadPoolExecutor

ThreadPoolExecutor 使用 Executors来创建，提供了4种类型的ThreadPoolExectuor, 分别是 newFixedThreadPool 、 newSingleThreadExecutor 、newScheduledThreadPool、 newCachedThreadPool.

- 构造函数

``` java
/**
 * Creates a new {@code ThreadPoolExecutor} with the given initial
 * parameters.
 *
 * @param corePoolSize the number of threads to keep in the pool, even
 *        if they are idle, unless {@code allowCoreThreadTimeOut} is set
 * @param maximumPoolSize the maximum number of threads to allow in the
 *        pool
 * @param keepAliveTime when the number of threads is greater than
 *        the core, this is the maximum time that excess idle threads
 *        will wait for new tasks before terminating.
 * @param unit the time unit for the {@code keepAliveTime} argument
 * @param workQueue the queue to use for holding tasks before they are
 *        executed.  This queue will hold only the {@code Runnable}
 *        tasks submitted by the {@code execute} method.
 * @param threadFactory the factory to use when the executor
 *        creates a new thread
 * @param handler the handler to use when execution is blocked
 *        because the thread bounds and queue capacities are reached
 * @throws IllegalArgumentException if one of the following holds:<br>
 *         {@code corePoolSize < 0}<br>
 *         {@code keepAliveTime < 0}<br>
 *         {@code maximumPoolSize <= 0}<br>
 *         {@code maximumPoolSize < corePoolSize}
 * @throws NullPointerException if {@code workQueue}
 *         or {@code threadFactory} or {@code handler} is null
 */
public ThreadPoolExecutor(int corePoolSize,
                          int maximumPoolSize,
                          long keepAliveTime,
                          TimeUnit unit,
                          BlockingQueue<Runnable> workQueue,
                          ThreadFactory threadFactory,
                          RejectedExecutionHandler handler)
```

**参数说明：**

corePoolSize：核心线程数，如果运行的线程少于corePoolSize，则创建新线程来执行新任务，即使线程池中的其他线程是空闲的
 
maximumPoolSize:最大线程数，可允许创建的线程数，corePoolSize和maximumPoolSize设置的边界自动调整池大小：
corePoolSize <运行的线程数< maximumPoolSize:仅当队列满时才创建新线程
corePoolSize=运行的线程数= maximumPoolSize：创建固定大小的线程池
 
keepAliveTime:如果线程数多于corePoolSize,则这些多余的线程的空闲时间超过keepAliveTime时将被终止
 
unit:keepAliveTime参数的时间单位
 
workQueue:保存任务的阻塞队列，与线程池的大小有关：
  当运行的线程数少于corePoolSize时，在有新任务时直接创建新线程来执行任务而无需再进队列
  当运行的线程数等于或多于corePoolSize，在有新任务添加时则选加入队列，不直接创建线程
  当队列满时，在有新任务时就创建新线程
 
threadFactory:使用ThreadFactory创建新线程，默认使用defaultThreadFactory创建线程
 
handle:定义处理被拒绝任务的策略，默认使用ThreadPoolExecutor.AbortPolicy,任务被拒绝时将抛出RejectExecutorException

### newFixedThreadPool

创建可重用且固定线程数的线程池，如果线程池中的所有线程都处于活动状态，此时再提交任务就在队列中等待，直到有可用线程；如果线程池中的某个线程由于异常而结束时，线程池就会再补充一条新线程。

``` java
public static ExecutorService newFixedThreadPool(int nThreads) {
    return new ThreadPoolExecutor(nThreads, nThreads,
                                  0L, TimeUnit.MILLISECONDS,
                                  //使用一个基于FIFO排序的阻塞队列，在所有corePoolSize线程都忙时新任务将在队列中等待
                                  new LinkedBlockingQueue<Runnable>());
}
```

### newSingleThreadExecutor

创建一个单线程的Executor，如果该线程因为异常而结束就新建一条线程来继续执行后续的任务

``` java
public static ExecutorService newSingleThreadExecutor() {
   return new FinalizableDelegatedExecutorService
                     //corePoolSize和maximumPoolSize都等于，表示固定线程池大小为1
                        (new ThreadPoolExecutor(1, 1,
                                                0L, TimeUnit.MILLISECONDS,
                                                new LinkedBlockingQueue<Runnable>()));
}
```

### newScheduledThreadPool

创建一个可延迟执行或定期执行的线程池

``` java
/**
 * Creates a new {@code ScheduledThreadPoolExecutor} with the
 * given core pool size.
 *
 * @param corePoolSize the number of threads to keep in the pool, even
 *        if they are idle, unless {@code allowCoreThreadTimeOut} is set
 * @throws IllegalArgumentException if {@code corePoolSize < 0}
 */
public ScheduledThreadPoolExecutor(int corePoolSize) {
    super(corePoolSize, Integer.MAX_VALUE,
          DEFAULT_KEEPALIVE_MILLIS, MILLISECONDS,
          new DelayedWorkQueue());
}
```

使用 scheduledThread 来模拟心跳：

``` java
public class HeartBeat {
    public static void main(String[] args) {
        ScheduledExecutorService executor = Executors.newScheduledThreadPool(5);
        Runnable task = new Runnable() {
            public void run() {
                System.out.println("HeartBeat.........................");
            }
        };
        executor.scheduleAtFixedRate(task,5,3, TimeUnit.SECONDS);   //5秒后第一次执行，之后每隔3秒执行一次
    }
}
```

### newCachedThreadPool

创建可缓存的线程池，如果线程池中的线程在60秒未被使用就将被移除，在执行新的任务时，当线程池中有之前创建的可用线程就重用可用线程，否则就新建一条线程

``` java
public static ExecutorService newCachedThreadPool() {
    return new ThreadPoolExecutor(0, Integer.MAX_VALUE,
                                  60L, TimeUnit.SECONDS,
                                  //使用同步队列，将任务直接提交给线程
                                  new SynchronousQueue<Runnable>());
}
```

例子：

``` java
public class ThreadPoolTest {
    public static void main(String[] args) throws InterruptedException {
     ExecutorService threadPool = Executors.newCachedThreadPool();//线程池里面的线程数会动态变化，并可在线程线被移除前重用
        for (int i = 1; i <= 3; i ++) {
            final  int task = i;   //10个任务
            TimeUnit.SECONDS.sleep(1);
            threadPool.execute(new Runnable() {    //接受一个Runnable实例
                public void run() {
                        System.out.println("线程名字： " + Thread.currentThread().getName() +  "  任务名为： "+task);
                }
            });
        }
    }
}

```

输出：（为每个任务新建一条线程，共创建了3条线程）
线程名字： pool-1-thread-1 任务名为： 1
线程名字： pool-1-thread-2 任务名为： 2
线程名字： pool-1-thread-3 任务名为： 3
去掉第6行的注释其输出如下：（始终重复利用一条线程，因为newCachedThreadPool能重用可用线程）
线程名字： pool-1-thread-1 任务名为： 1
线程名字： pool-1-thread-1 任务名为： 2
线程名字： pool-1-thread-1 任务名为： 3

### Future 接口

Future 接口和实现了Future接口的FutureTask类用来表示异步计算的结果。当我们把Runnable 或者 Callable 接口的实现类提交给ThreadPoolExecutor时，Exector会返回给FutureTask对象

### ScheduledThreadPoolExecutor

ScheduledThreadPoolExecutor 继承自 ThreadPoolExecutor, 主要用来在给定的延迟后运行任务。 主要包含3个成员变量：

- long: time ; 表示这个任务将要被执行的具体时间
- long: sequenceNumber; 表示这个任务被添加到SheduledThreadPoolExecutor 中的序号
- long：period; 表示任务执行的间隔周期

该类采用了DelyQueue，封装了一个优先队列，该队列会对队列中的SheduledFutureTask 进行排序。time小的会排在前面，如果time相同，则会比较sequenceNumber, 就是说如果两个任务的执行时间相同，谁先提交就谁先执行

# 参考文档

- [java并发编程--Executor框架](https://www.cnblogs.com/MOBIN/p/5436482.html)