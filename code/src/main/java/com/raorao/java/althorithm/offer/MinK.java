package com.raorao.java.althorithm.offer;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.PriorityQueue;

/**
 * 求最小的k个数.
 *
 * @author Xiong Raorao
 * @since 2018-08-16-17:31
 */
public class MinK {


  public static void main(String[] args) {
    int[] test = new int[]{4,5,1,6,2,7,3,8};
    minK(test, 8);
  }

  private static ArrayList<Integer> minK(int[] input, int k) {
    ArrayList<Integer> ret = new ArrayList<>();
    if (k == 0 || input == null || input.length == 0 || k > input.length) {
      return ret;
    }
    PriorityQueue<Integer> queue = new PriorityQueue<>(k, Comparator.reverseOrder());
    for (int i = 0; i < input.length; i++) {
      if( i < k){
        queue.add(input[i]);
      }else {
        if (input[i] < queue.peek()) {
          queue.poll();
          queue.add(input[i]);
        }
      }
    }
    while (!queue.isEmpty()){
      ret.add(queue.poll());
    }
    return ret;
  }


}
