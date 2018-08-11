package com.raorao.leetcode;

import java.util.Arrays;

/**
 * 分配饼干.
 *
 * @author Xiong Raorao
 * @since 2018-08-11-10:05
 */
public class AssignCookie {

  public static void main(String[] args) {

  }

  private static int process(int[] childrens, int[] cookies) {
    Arrays.sort(childrens);
    Arrays.sort(cookies);
    int child = 0;
    int cookie = 0;
    while (child < childrens.length && cookie < cookies.length) {
      if (childrens[child] <= cookies[child]) {
        child++;
      }
      cookie++;
    }
    return child;
  }
}
