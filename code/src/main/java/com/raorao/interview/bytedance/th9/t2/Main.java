package com.raorao.interview.bytedance.th9.t2;

import java.util.Scanner;

/**
 * .
 *
 * @author Xiong Raorao
 * @since 2018-09-09-10:11
 */
public class Main {

  private static int[][] matrix;
  private static int[][] direction = {{0, 1}, {0, -1}, {1, 0}, {-1, 0}};
  private static int m;

  public static void main(String[] args) {
    Scanner scanner = new Scanner(System.in);
    m = scanner.nextInt();
    matrix = new int[m][m];
    for (int i = 0; i < m; i++) {
      for (int j = 0; j < m; j++) {
        matrix[i][j] = scanner.nextInt();
      }
    }

    int count = 0;
    if(m == 0){
      System.out.println(0);
    }
    for (int i = 0; i<m; i++){
      for (int j = 0; j<m;j++){
        if (matrix[i][j] != 0){
          dfs(i,j);
          count++;
        }
      }
    }
    System.out.println(count);

  }

  private static void dfs(int i , int j) {
    if(i <0 || i >= m || j < 0 || j >= m || matrix[i][j] == 0){
      return;
    }
    matrix[i][j] = 0;
    for (int[] d : direction){
      dfs(i+d[0], j+ d[1]);
    }
  }
}
