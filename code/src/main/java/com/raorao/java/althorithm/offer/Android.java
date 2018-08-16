package com.raorao.java.althorithm.offer;

/**
 * 机器人运动范围.
 *
 * @author Xiong Raorao
 * @since 2018-08-16-19:37
 */
public class Android {

  public static void main(String[] args) {

  }

  public int movingCount(int threshold, int rows, int cols) {
    boolean[] visited = new boolean[rows * cols];
    for (int i = 0; i < rows * cols; i++) {
      visited[i] = false;
    }
    return helper(threshold, rows, cols, 0, 0, visited);
  }

  private int helper(int threshold, int rows, int cols, int row, int col, boolean[] visited) {
    int count = 0;
    if (check(threshold, rows, cols, row, col, visited)) {
      count = 1 + helper(threshold, rows, cols, row - 1, col, visited) +
          helper(threshold, rows, cols, row + 1, col, visited)
          + helper(threshold, rows, cols, row, col - 1, visited)
          + helper(threshold, rows, cols, row, col + 1, visited);
    }
    return count;
  }

  private boolean check(int threshold, int rows, int cols, int row, int col, boolean[] visited) {
    if (getSum(row) + getSum(col) <= threshold && !visited[row * cols + col] && row < rows
        && col < cols && row >= 0 && col >= 0) {
      return true;
    }
    return false;
  }

  private int getSum(int a) {
    int sum = 0;
    while (a > 0) {
      sum += a % 10;
      a /= 10;
    }
    return sum;
  }
}
