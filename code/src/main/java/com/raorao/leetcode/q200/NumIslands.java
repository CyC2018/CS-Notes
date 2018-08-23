package com.raorao.leetcode.q200;

/**
 * 求岛屿的个数.
 *
 * @author Xiong Raorao
 * @since 2018-08-22-16:53
 */
public class NumIslands {

  private final int[][] directions = new int[][] {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};

  public static void main(String[] args) {
    char[][] grid = new char[][] {
        {'1', '1', '1', '1', '0'},
        {'1', '1', '0', '1', '0'},
        {'1', '1', '0', '0', '0'},
        {'0', '0', '0', '0', '0'}};
    int result = new NumIslands().numIslands(grid);
    System.out.println(result);
  }

  public int numIslands(char[][] grid) {
    if (grid == null || grid.length == 0) {
      return 0;
    }
    int m = grid.length;
    int n = grid[0].length;
    int islandNum = 0;
    for (int i = 0; i < m; i++) {
      for (int j = 0; j < n; j++) {
        if (grid[i][j] == '1') {
          dfs(grid, i, j);
          islandNum++;
        }
      }
    }
    return islandNum;
  }

  private void dfs(char[][] grid, int i, int j) {
    if (i < 0 || i >= grid.length || j < 0 || j >= grid[0].length || grid[i][j] == '0') {
      return;
    }
    grid[i][j] = '0';
    for (int[] d : directions) {
      dfs(grid, i + d[0], j + d[1]);
    }
  }
}
