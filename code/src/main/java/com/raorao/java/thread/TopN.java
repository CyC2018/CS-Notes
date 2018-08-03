package com.raorao.java.thread;

import java.util.Iterator;
import java.util.PriorityQueue;

/**
 * 得到TopN的方法（使用优先队列）.
 *
 * @author Xiong Raorao
 * @since 2018-08-03-10:18
 */
public class TopN {

  public static void main(String[] args) {
    PriorityQueue<Integer> p = new PriorityQueue<>(5);
    int[] aa = new int[] {1, 2, 3, 4, 77, 22, 42, 35, 8, 12};
    for (int i : aa) {
      if (p.size() < 5) {
        p.offer(i);
      } else {
        if (i < p.peek()) {
          // do nothing
        } else {
          p.offer(i);
          p.poll();
        }
      }
    }

    Iterator<Integer> iterator = p.iterator();
    while (iterator.hasNext()) {
      System.out.println(iterator.next());
    }
  }
}
