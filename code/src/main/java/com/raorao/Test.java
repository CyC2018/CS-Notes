package com.raorao;

import afu.org.checkerframework.checker.igj.qual.I;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.Deque;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.PriorityQueue;
import java.util.Random;
import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.BlockingDeque;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentLinkedDeque;
import java.util.concurrent.ConcurrentLinkedQueue;
import java.util.concurrent.DelayQueue;
import java.util.concurrent.LinkedBlockingQueue;
import java.util.concurrent.PriorityBlockingQueue;
import java.util.function.Supplier;
import java.util.stream.Collectors;
import java.util.stream.IntStream;
import java.util.stream.Stream;
import sun.awt.image.ImageWatched.Link;

/**
 * .
 *
 * @author Xiong Raorao
 * @since 2018-08-02-16:46
 */
public class Test {

  private int a;

  public static void main(String[] args) {
    //System.out.println(foo());
    int r = new Test().foo();
    System.out.println(r);
    PriorityBlockingQueue<Integer> aa;
    LinkedBlockingQueue<Integer> ss;
    ss = new LinkedBlockingQueue<>();
    ss.add(1);
    ArrayBlockingQueue<Integer> s;
    LinkedBlockingQueue<Integer> a;
    FileInputStream fis;
    FileOutputStream fos;
    InputStreamReader isr;
    OutputStreamWriter osw;
  }

  public int foo() {
    try {
      System.out.println("sadfasdfasdf");
      return a;
    } catch (Exception e) {
      e.printStackTrace();
      return 3;
    } finally {
      System.out.println("finally: " + ++a);
      return a;
    }
  }
}
