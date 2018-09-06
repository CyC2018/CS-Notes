package com.raorao.sword;

/**
 * 旋转数组的最小数字，平多多面试题.
 *
 * @author Xiong Raorao
 * @since 2018-09-06-11:38
 */
public class Solution06 {

  public int minNumberInRotateArray(int[] array) {
    return find(array, 0, array.length - 1);
  }

  private int find(int[] array, int start, int end) {

    if (end - start == 1) {
      return array[end];
    }

    int mid = start + (end - start) / 2;
    if (array[start] <= array[mid]) {
      // mid 属于旋转过去的
      start = mid;
    } else if (array[end] >= array[mid]) {
      end = mid;
    }
    return find(array, start, end);
  }
}
