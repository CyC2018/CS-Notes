package com.raorao.java.base;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Supplier;

/**
 * Lambda 表达式.
 *
 * @author Xiong Raorao
 * @since 2018-08-06-17:32
 */
public class LambdaTest {

  public static void main(String[] args) {
    foo1();
  }

  public static void foo1() {
    String[] ss = new String[] {"a", "c", "b", "d"};
    List<String> list = Arrays.asList(ss);
    list.forEach(e -> System.out.print(e));
    System.out.println();
    list.sort((e1, e2) -> e2.compareTo(e1));
    list.forEach(System.out::print);
    System.out.println();
    Map<Integer, Integer> map = new HashMap<>();
    for (int i = 0; i < 5; i++) {
      map.put(i, i * i);
    }
    map.forEach((k, v) -> System.out.println("key = " + k + ", value = " + v));

    Thread t = new Thread(()->{
      System.out.println(  "start thread");
      try {
        Thread.sleep(2000);
      } catch (InterruptedException e) {
        e.printStackTrace();
      }
      System.out.println("end thread");
    });
    t.start();
  }
}
