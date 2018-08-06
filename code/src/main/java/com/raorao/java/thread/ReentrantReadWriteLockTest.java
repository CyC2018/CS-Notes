package com.raorao.java.thread;

import java.util.concurrent.locks.ReentrantReadWriteLock;

/**
 * 读写锁测试.
 *
 * @author Xiong Raorao
 * @since 2018-08-06-11:48
 */
public class ReentrantReadWriteLockTest {

  private ReentrantReadWriteLock lock = new ReentrantReadWriteLock();

  public void read(){
    lock.readLock().lock(); // 读锁
    System.out.println("获得读锁 " + Thread.currentThread().getName() + " " + System.currentTimeMillis());
    try {
      Thread.sleep(2000);
    } catch (InterruptedException e) {
      e.printStackTrace();
    }finally {
      lock.readLock().unlock();
    }
  }

  public void write(){
    lock.writeLock().lock(); // 写锁
    System.out.println("获得写锁 " + Thread.currentThread().getName() + " " + System.currentTimeMillis());
    try {
      Thread.sleep(2000);
    } catch (InterruptedException e) {
      e.printStackTrace();
    }finally {
      lock.writeLock().unlock();
    }
  }

  public static void main(String[] args) {
    // 1. 读读共享, A 和 B 同时获得锁
    ReentrantReadWriteLockTest test = new ReentrantReadWriteLockTest();
    Thread t1 = new Thread(()-> {
      Thread.currentThread().setName("A");
      test.read();
    });
    Thread t2 = new Thread(()-> {
      Thread.currentThread().setName("B");
      test.read();
    });
    t1.start();
    t2.start();

    // 2. 写写互斥, D线程比C线程落后两秒执行
    t1 = new Thread(()->{
      Thread.currentThread().setName("C");
      test.write();
    });
    t2 = new Thread(()->{
      Thread.currentThread().setName("D");
      test.write();
    });
    t1.start();
    t2.start();

  }


}
