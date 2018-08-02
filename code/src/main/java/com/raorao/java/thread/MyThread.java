package com.raorao.java.thread;

import java.util.concurrent.Callable;
import java.util.concurrent.FutureTask;

/**
 * 线程类.
 *
 * @author Xiong Raorao
 * @since 2018-08-01-15:40
 */
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
