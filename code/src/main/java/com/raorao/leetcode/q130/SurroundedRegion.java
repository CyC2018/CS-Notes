package com.raorao.leetcode.q130;

import java.util.LinkedList;
import java.util.Queue;

/**
 * 被围绕的区域.
 *
 * @author Xiong Raorao
 * @since 2018-08-22-14:53
 */
public class SurroundedRegion {

  private static Queue<Integer> queue = null;
  private static int rows = 0;
  private static int cols = 0;

  public static void main(String[] args) {
    char[][] board = new char[][] {
        {'X', 'X', 'X', 'X'},
        {'X', 'O', 'O', 'X'},
        {'X', 'X', 'O', 'X'},
        {'X', 'O', 'X', 'X'}};
    new SurroundedRegion().solve(board);
  }

  public void solve(char[][] board) {
    if (board.length == 0 || board[0].length == 0) {
      return;
    }
    queue = new LinkedList<Integer>();
    rows = board.length;
    cols = board[0].length;

    for (int i = 0; i < rows; i++) { // **important**
      enqueue(i, 0, board);
      enqueue(i, cols - 1, board);
    }

    for (int j = 1; j < cols - 1; j++) { // **important**
      enqueue(0, j, board);
      enqueue(rows - 1, j, board);
    }

    // 把所有边界为O的元素的位置以及和边界连通的’O‘放到队列中去，已经放入队列的改为'D'
    while (!queue.isEmpty()) {
      int cur = queue.poll();
      int x = cur / cols,
          y = cur % cols;

      if (board[x][y] == 'O') {
        board[x][y] = 'D';
      }

      enqueue(x - 1, y, board);
      enqueue(x + 1, y, board);
      enqueue(x, y - 1, board);
      enqueue(x, y + 1, board);
    }

    for (int i = 0; i < rows; i++) {
      for (int j = 0; j < cols; j++) {
        if (board[i][j] == 'D') {
          board[i][j] = 'O';
        } else if (board[i][j] == 'O') {
          board[i][j] = 'X';
        }
      }
    }

    queue = null;
    board = null;
    rows = 0;
    cols = 0;
  }

  public void enqueue(int x, int y, char[][] board) {
    if (x >= 0 && x < rows && y >= 0 && y < cols && board[x][y] == 'O') {
      queue.offer(x * cols + y);
    }
  }
}
