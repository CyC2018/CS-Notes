package com.raorao.java.thread.excutor;

import java.util.concurrent.Executor;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.FutureTask;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.ScheduledThreadPoolExecutor;
import javax.sound.midi.Soundbank;
import javax.sound.midi.Track;

/**
 * Executor框架.
 *
 * @author Xiong Raorao
 * @since 2018-08-01-16:32
 */
public class MyExecutor {

  public static void main(String[] args) {
    ExecutorService service = Executors.newFixedThreadPool(3);
    for(int i = 0; i < 3; i++){
     service.submit(new MyRunnable("thread-" + i));
    }
    service.shutdown();
  }

  static class MyRunnable implements Runnable{

    private String name;

    public MyRunnable(String name) {
      this.name = name;
    }

    @Override
    public void run() {
      System.out.println(name + " start ...");
      try {
        Thread.sleep(2000);
      } catch (InterruptedException e) {
        e.printStackTrace();
      }
      System.out.println(name + " end ...");
    }
  }
}
