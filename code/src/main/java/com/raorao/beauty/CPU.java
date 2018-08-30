package com.raorao.beauty;

/**
 * .
 *
 * @author Xiong Raorao
 * @since 2018-08-29-17:36
 */
public class CPU {

  public static void main(String[] args) {
    int busyTime = 20;
    int idleTime = busyTime / 2;
    long startTime = 0;
    while (true) {
      startTime = System.currentTimeMillis();
      // busy loop
      while ((System.currentTimeMillis() - startTime) <= busyTime)
        ;
      // idle loop
      try {
        Thread.sleep(idleTime);
      } catch (InterruptedException e) {
        System.out.println(e);
      }
    }
  }
}
