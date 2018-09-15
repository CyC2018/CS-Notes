package com.raorao.sword;

/**
 * .
 *
 * @author Xiong Raorao
 * @since 2018-09-12-23:54
 */
public class MatrixPath {

  private static final int[][] directions = {{0, 1}, {0, -1}, {-1, 0}, {1, 0}};
  private int m;
  private int n;

  public static void main(String[] args) {
    char[] input = "ABCESFCSADEE".toCharArray();
    int rows = 3;
    int cols = 4;
    char[] str = "ABCCED".toCharArray();

    boolean res = new MatrixPath().hasPath(input, rows, cols, str);
    System.out.println(res);
  }

  public boolean hasPath(char[] matrix, int rows, int cols, char[] str) {
    if (matrix == null || matrix.length == 0 || str == null || str.length == 0) {
      return false;
    }

    m = rows;
    n = cols;
    char[][] grid = new char[m][n];
    for (int i = 0; i < m; i++) {
      for (int j = 0; j < n; j++) {
        grid[i][j] = matrix[i*n + j];
      }
    }
    boolean[][] visited = new boolean[m][n];
    for (int r = 0; r < m; r++) {
      for (int c = 0; c < n; c++) {
        if (backtracking(grid, r, c, visited, 0, str)) {
          return true;
        }
      }
    }
    return false;
  }

  public boolean backtracking(char[][] grid, int r, int c, boolean[][] visited, int curLen,
      char[] str) {

    if(curLen == str.length){
      return true;
    }

    if (r < 0 || r >= m || c < 0 || c >= n || grid[r][c] != str[curLen] || visited[r][c]) {
      return false;
    }

    visited[r][c] = true;
    for (int[] d : directions) {
      if (backtracking(grid, r + d[0], c + d[1], visited, curLen + 1, str)) {
        return true;
      }
    }
    visited[r][c] = false;
    return false;
  }
}
