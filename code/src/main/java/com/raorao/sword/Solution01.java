package com.raorao.sword;

/**
 * .
 *
 * @author Xiong Raorao
 * @since 2018-09-06-10:04
 */
public class Solution01 {

  public boolean Find(int target, int[][] array) {
    if (array == null || array[0].length == 0) {
      return false;
    }
    int m = array.length;
    int n = array[0].length;
    for (int i = m - 1; i >= 0; i--) {
      for (int j = 0; j < n; j++) {
        if (target < array[i][j]) {
          break;
        }
        if (target == array[i][j]) {
          return true;
        }
      }
    }
    return false;
  }
}
