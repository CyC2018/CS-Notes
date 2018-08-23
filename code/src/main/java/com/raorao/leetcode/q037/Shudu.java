package com.raorao.leetcode.q037;

/**
 * 数独问题.
 *
 * @author Xiong Raorao
 * @since 2018-08-23-9:30
 */
public class Shudu {

  private boolean[][] rowsUsed = new boolean[9][10];
  private boolean[][] colsUsed = new boolean[9][10];
  private boolean[][] cubesUsed = new boolean[9][10];
  private char[][] board;

  public static void main(String[] args) {

  }

  public void solveSudoku(char[][] board) {
    this.board = board;
    for (int i = 0; i < 9; i++) {
      for (int j = 0; j < 9; j++) {
        if (board[i][j] == '.') {
          continue;
        }
        int num = board[i][j] - '0';
        rowsUsed[i][num] = true;
        colsUsed[j][num] = true;
        cubesUsed[cubeNum(i, j)][num] = true;
      }
    }

    for (int i = 0; i < 9; i++) {
      for (int j = 0; j < 9; j++) {
        backtracking(i, j);
      }
    }
  }

  private boolean backtracking(int row, int col) {
    while (row < 9 && board[row][col] != '.') {
      row = col == 8 ? row + 1 : row;
      col = col == 8 ? 0 : col + 1;
    }
    if (row == 9) {
      return true;
    }
    for (int num = 1; num <= 9; num++) {
      if (rowsUsed[row][num] || colsUsed[col][num] || cubesUsed[cubeNum(row, col)][num]) {
        continue;
      }
      rowsUsed[row][num] = colsUsed[col][num] = cubesUsed[cubeNum(row, col)][num] = true;
      board[row][col] = (char) (num + '0');
      if (backtracking(row, col)) {
        return true;
      }
      board[row][col] = '.';
      rowsUsed[row][num] = colsUsed[col][num] = cubesUsed[cubeNum(row, col)][num] = false;
    }
    return false;
  }

  private int cubeNum(int i, int j) {
    int r = i / 3;
    int c = j / 3;
    return r * 3 + c;
  }

}
