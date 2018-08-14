package com.raorao.java.thread;

/**
 * i++ 的原子性证明.
 *
 * @author Xiong Raorao
 * @since 2018-08-14-15:15
 */
public class IPlusPlus {

  private static volatile int index = 0;

  public static void main(String[] args) throws InterruptedException {
    for (int i = 0; i < 10; i++) {
      new Thread(() -> {
        synchronized (IPlusPlus.class){
          for (int j = 0; j < 10000; j++) {
            index++;
          }
        }
        System.out.println(Thread.currentThread().getName() + ", index = " + index);
      }).start();
    }
    Thread.sleep(2000);
    System.out.println(index);
  }

}
