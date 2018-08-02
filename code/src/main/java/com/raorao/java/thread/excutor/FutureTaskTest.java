package com.raorao.java.thread.excutor;

import afu.org.checkerframework.checker.igj.qual.I;
import com.raorao.java.thread.excutor.MyExecutor.MyRunnable;
import java.util.concurrent.Callable;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.concurrent.FutureTask;
import javax.sound.midi.Soundbank;
import org.omg.PortableServer.THREAD_POLICY_ID;

/**
 * futureTask测试.
 *
 * @author Xiong Raorao
 * @since 2018-08-02-11:16
 */
public class FutureTaskTest {

  public static void main(String[] args) throws ExecutionException, InterruptedException {
    Integer result = 0;
    FutureTask<Integer> task1 = new FutureTask<>(new MyRunnable("future thread"), result);
//    task1.run();
//    System.out.println(task1.get());

//    FutureTask<Integer> task2 = new FutureTask<>(new MyCallable(5));
//    task2.run();
//    System.out.println(task2.get());
    ExecutorService service = Executors.newFixedThreadPool(1);
    Future<Integer> res = service.submit(new MyCallable(5));
    System.out.println(res.get());
    System.out.println("ok");
    Thread.sleep(2000);
    service.shutdown();
  }

  static class MyCallable implements Callable<Integer>{

    private Integer res = 0;
    public MyCallable(Integer a) {
      res = a;
    }

    @Override
    public Integer call() throws Exception {
      //Thread.sleep(2000);
      wait(2000);
      return res * res;
    }
  }
}
