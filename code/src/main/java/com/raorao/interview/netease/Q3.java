package com.raorao.interview.netease;

import java.util.Scanner;

/**
 * 字符迷阵.
 *
 * @author Xiong Raorao
 * @since 2018-08-08-16:29
 */
public class Q3 {

  public static void main(String[] args) {
    Word[] words = read();
    for (Word word : words) {
      String target = word.val;
      int sum = 0;
      char[] tc = target.toCharArray();
      for (int i = 0; i < word.row; i++) {
        for (int j = 0; j < word.col; j++) {
          if (word.matrix[i][j] == tc[0]) {
            sum += count(word, i, j, target);
          }
        }
      }
      System.out.println(sum);
    }
  }

  private static int count(Word word, int i, int j, String target) {
    int count = 0;
    int length = target.length();
    // 右边
    if (j + length <= word.col) {
      String temp = new String(word.matrix[i], j, length);
      if (temp.equals(target)) {
        count++;
      }
    }
    // 下面
    if (i + length <= word.row) {
      char[] temp = new char[length];
      for (int k = 0; k < length; k++) {
        temp[k] = word.matrix[i + k][j];
      }
      if (target.equals(new String(temp))) {
        count++;
      }
    }

    // 右下斜线
    if (j + length <= word.col && i + length <= word.row) {
      char[] temp = new char[length];
      for (int k = 0; k < length; k++) {
        temp[k] = word.matrix[i + k][j + k];
      }
      if (target.equals(new String(temp))) {
        count++;
      }
    }
    return count;
  }

  private static Word[] read() {
    Scanner scanner = new Scanner(System.in);
    int count = scanner.nextInt();
    Word[] res = new Word[count];
    for (int i = 0; i < count; i++) {
      int m = scanner.nextInt();
      int n = scanner.nextInt();
      res[i] = new Word();
      res[i].matrix = new char[m][n];
      res[i].row = m;
      res[i].col = n;
      for (int j = 0; j < m; j++) {
        res[i].matrix[j] = scanner.next().toCharArray();
      }
      res[i].val = scanner.next();
    }
    return res;
  }

  private static class Word {

    int row;
    int col;
    String val;
    char[][] matrix;
  }
}
