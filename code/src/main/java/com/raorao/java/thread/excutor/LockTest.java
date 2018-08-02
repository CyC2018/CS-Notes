package com.raorao.java.thread.excutor;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.locks.Condition;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.LockSupport;
import java.util.concurrent.locks.ReentrantLock;

/**
 * 可重入锁测试.
 *
 * @author Xiong Raorao
 * @since 2018-08-02-11:14
 */
public class LockTest {

  private Lock lock = new ReentrantLock();

  public static void main(String[] args) {
    LockTest test = new LockTest();
    ExecutorService service = Executors.newFixedThreadPool(3);
    for(int i = 0 ; i < 3 ; i ++){
      service.submit(() -> test.func());
    }


  }

  public void func() {
    lock.lock();
    try {
      for (int i = 0; i < 10; i++) {
        System.out.print(i + " ");
      }
    } finally {
      lock.unlock(); // 确保释放锁，从而避免发生死锁。
    }
  }
}
