package com.raorao.java.thread;

import java.util.concurrent.locks.Condition;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

/**
 * 可重入锁测试.
 *
 * @author Xiong Raorao
 * @since 2018-08-06-10:27
 */
public class ReentrantLockTest {

  private Lock lock = new ReentrantLock();
  private Condition conditionA = lock.newCondition();
  private Condition conditionB = lock.newCondition();

  public static void main(String[] args) throws InterruptedException {
    ReentrantLockTest test = new ReentrantLockTest();
    new Thread(() -> test.testLock()).start();
    new Thread(() -> test.testLock()).start();

    Thread t = new Thread(() -> test.awaitA());
    t.start();
    Thread.sleep(2000);
    test.signalA();

  }

  public void awaitA() {
    lock.lock();
    try {
      System.out.println("before awaitA at " + System.currentTimeMillis());
      conditionA.await(); // 在此之前必须获得锁，不然报错illegalMonitorStateException 错误
      System.out.println("after awaitA at " + System.currentTimeMillis());
    } catch (InterruptedException e) {
      e.printStackTrace();
    } finally {
      lock.unlock();
      System.out.println(" 释放锁 awaitA ");
    }
  }

  public void signalA() {
    lock.lock();
    try {
      System.out.println("signalA at " + System.currentTimeMillis());
      conditionA.signal(); // 在此之前必须获得锁，不然报错illegalMonitorStateException 错误
      System.out.println("signalA over at " + System.currentTimeMillis());
    } finally {
      lock.unlock();
      System.out.println(" 释放锁 signalA ");
    }
  }

  public void testLock() {
    lock.lock();
    for (int i = 0; i < 5; i++) {
      System.out.print(i + " ");
    }
    System.out.println();
    lock.unlock();
  }
}
