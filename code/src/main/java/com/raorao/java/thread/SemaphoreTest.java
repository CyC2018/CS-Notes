package com.raorao.java.thread;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Semaphore;

/**
 * .
 *
 * @author Xiong Raorao
 * @since 2018-09-04-17:30
 */
public class SemaphoreTest {

  public static void main(String[] args) {
    Semaphore semaphore = new Semaphore(3);
    ExecutorService service = Executors.newCachedThreadPool();
    for (int i = 0; i < 100; i++) {
      service.submit(() -> {
        try {
          semaphore.acquire();
          System.out.println("可用线程数：" + semaphore.availablePermits());
        } catch (InterruptedException e1) {
          e1.printStackTrace();
        } finally {
          semaphore.release();
        }
      });
    }
    service.shutdown();
  }
}
