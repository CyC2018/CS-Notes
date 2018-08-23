package com.raorao.leetcode.q079;

/**
 * 在矩阵中寻找字符串.
 *
 * @author Xiong Raorao
 * @since 2018-08-23-7:44
 */
public class WordSearch {

  private static final int[][] direction = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};
  private static int m;
  private static int n;

  public static void main(String[] args) {
    char[][] input = new char[][] {
        {'A', 'B', 'C', 'E'},
        {'S', 'F', 'C', 'S'},
        {'A', 'D', 'E', 'E'},
    };
    String word = "ABCCED";
    System.out.println(new WordSearch().exist(input, word));
  }

  public boolean exist(char[][] board, String word) {
    if (board == null || board.length == 0) {
      return false;
    }
    m = board.length;
    n = board[0].length;
    boolean[][] hasVisited = new boolean[m][n];
    for (int i = 0; i < m; i++) {
      for (int j = 0; j < n; j++) {
        if (back(board, 0, i, j, hasVisited, word)) {
          return true;
        }
      }
    }
    return false;
  }

  private boolean back(char[][] board, int current, int i, int j, boolean[][] hasVisited,
      String word) {
    if (current == word.length()) {
      return true;
    }
    if (i < 0 || i >= m || j < 0 || j >= n || board[i][j] != word.charAt(current)
        || hasVisited[i][j]) {
      return false;
    }
    hasVisited[i][j] = true;
    for (int[] d : direction) {
      if (back(board, current + 1, i + d[0], j + d[1], hasVisited, word)) {
        return true;
      }
    }
    hasVisited[i][j] = false;
    return false;
  }


}
