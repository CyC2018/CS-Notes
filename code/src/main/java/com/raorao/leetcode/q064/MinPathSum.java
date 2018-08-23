package com.raorao.leetcode.q064;

import java.util.Arrays;

/**
 * 矩阵最小路径和.
 *
 * @author Xiong Raorao
 * @since 2018-08-23-10:56
 */
public class MinPathSum {

  public static void main(String[] args) {
    int[][] grid = new int[][] {
        {1, 3, 1},
        {1, 5, 1},
        {4, 2, 1}};
    int res = new MinPathSum().minPathSum(grid);
    System.out.println(res);
  }

  public int minPathSum(int[][] grid) {
    if (grid == null) {
      return 0;
    }
    int rowLen = grid.length;
    int colLen = grid[0].length;
    int[] res = new int[colLen + 1];
    Arrays.fill(res, Integer.MAX_VALUE);
    res[1] = 0;
    for (int i = 1; i <= rowLen; i++) {
      for (int j = 1; j <= colLen; j++) {
        //当前点的最小路径和为 : 从左边和上边选择最小的路径和再加上当前点的值
        //res[j]没更新之前就表示i-1行到第j个元素的最小路径和
        //因为是从左往右更新,res[j-1]表示i行第j-1个元素的最小路径和
        res[j] = Math.min(res[j], res[j - 1]) + grid[i - 1][j - 1];
      }
    }
    return res[colLen];
  }
}
