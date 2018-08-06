package com.raorao.java.thread;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Timer;
import java.util.TimerTask;

/**
 * 定时器.
 *
 * @author Xiong Raorao
 * @since 2018-08-06-13:07
 */
public class TimerTest {
  private static Timer timer = new Timer();

  static class MyTask extends TimerTask{

    @Override
    public void run() {
      System.out.println("运行时间： " + new Date());
    }
  }

  public static void main(String[] args) {
    MyTask task1 = new MyTask();
    try {
      Date taskDate = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").parse("2018-08-06 13:15:00");
      System.out.println("执行时间： " + taskDate.toLocaleString() + "，当前时间" + new Date().toLocaleString());
      timer.schedule(task1, taskDate);
    } catch (ParseException e) {
      e.printStackTrace();
    }
  }
}
