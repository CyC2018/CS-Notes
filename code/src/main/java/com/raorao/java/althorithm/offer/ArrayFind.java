package com.raorao.java.althorithm.offer;

/**
 * t2: 二维数组的查找.
 *
 * @author Xiong Raorao
 * @since 2018-08-16-14:05
 */
public class ArrayFind {

  public static void main(String[] args) {
    int[][] matrix = new int[][]{{1,2,8,9},{2,4,9,12},{4,7,10,13},{6,8,11,15}};
    System.out.println(find(matrix, 1));
  }

  public static boolean find(int[][] arr, int target) {
    if (arr == null || arr.length == 0 || arr[0].length == 0) {
      return false;
    }
    int row = arr.length;
    int col = arr[0].length;
    for (int i = row - 1; i >= 0; i--) {
      for (int j = 0; j < col; j++) {
        if (arr[i][j] > target) {
          break;
        } else if (arr[i][j] == target) {
          return true;
        }
      }
    }
    return false;

  }

}
