package com.raorao.leetcode.q695;

/**
 * 岛屿的最大面积.
 *
 * @author Xiong Raorao
 * @since 2018-08-22-16:06
 */
public class MaxArea {

  private final int[][] directions = new int[][] {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};

  public static void main(String[] args) {
    int[][] grid = new int[][] {
        {0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0},
        {0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0},
        {0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0},
        {0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 0, 0},
        {0, 1, 0, 0, 1, 1, 0, 0, 1, 1, 1, 0, 0},
        {0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0},
        {0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0},
        {0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0}};

    int result = new MaxArea().maxAreaOfIsland(grid);
    System.out.println(result);
  }

  public int maxAreaOfIsland(int[][] grid) {
    int maxArea = 0;
    if (grid == null || grid.length == 0) {
      return 0;
    }
    int row = grid.length;
    int col = grid[0].length;
    for (int i = 0; i < row; i++) {
      for (int j = 0; j < col; j++) {
        maxArea = Math.max(maxArea, dfs(grid, i, j));
      }
    }
    return maxArea;

  }

  private int dfs(int[][] grid, int m, int n) {
    if (m < 0 || m >= grid.length || n < 0 || n >= grid[0].length || grid[m][n] == 0) {
      return 0;
    }
    int area = 1;
    grid[m][n] = 0; // 统计过了就置零
    for (int[] d : directions) {
      area += dfs(grid, m + d[0], n + d[1]);
    }
    return area;
  }
}
