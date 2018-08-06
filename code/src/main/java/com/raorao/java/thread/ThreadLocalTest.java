/*
 * Copyright (c) 2018.  Xiong Raorao. All rights reserved.
 * Project Name: book-notes
 * File Name: Test.java
 * Date: 18-7-25 下午5:32
 * Author: Xiong Raorao
 */

package com.raorao.java.thread;

/**
 * .
 *
 * @author Xiong Raorao
 * @since 2018-07-25-17:32
 */
public class ThreadLocalTest {
  private static ThreadLocal<Integer> local = new ThreadLocal<>();
  public static void main(String[] args) throws InterruptedException {
    Thread t1 = new Thread(() -> {
      System.out.println(" I am t1");
      local.set(1);
      try {
        Thread.sleep(2000);
        System.out.println("t1 value: "  + local.get());
      } catch (InterruptedException e) {
        e.printStackTrace();
      }
    });
    Thread.sleep(2000);
    Thread t2 = new Thread(() -> {
      System.out.println("I am t2");
      System.out.println("before set , I get " + local.get());
      try {
        Thread.sleep(2000);
        local.set(2);
        System.out.println("set after 2 s, I get " + local.get());
      } catch (InterruptedException e) {
        e.printStackTrace();
      }
    });
    t2.start();
    t1.start();// 无论怎么更换两个线程的启动顺序，得到的值是不一样的
  }
}
