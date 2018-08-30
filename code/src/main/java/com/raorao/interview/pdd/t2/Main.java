package com.raorao.interview.pdd.t2;

import java.util.Scanner;

/**
 * .
 *
 * @author Xiong Raorao
 * @since 2018-08-30-20:01
 */
public class Main {

  public static void main(String[] args) {
    Scanner scanner = new Scanner(System.in);
    Main m = new Main();
    int N = scanner.nextInt();
    int M = scanner.nextInt();
    char[][] chessBoard = new char[N][];
    for (int i = 0; i < N; i++) {
      chessBoard[i] = scanner.next().toCharArray();
    }
    m.process(chessBoard, N, M);

  }

  public void process(char[][] chess, int N, int M) {
    for (int i = 0; i < M; i++) {
      int position = -1;
      for (int j = N - 1; j >= 0; j--) {
        if (chess[j][i] == 'x') {
          position = j;
        } else if (chess[j][i] == 'o') {
          chess[j][i] = '.';
          if (position != -1 && position - 1 >= 0) {
            chess[--position][i] = 'o';
          }
        }
      }
    }
    for (int i = 0; i < N; i++) {
      for (int j = 0; j < M; j++) {
        System.out.print(chess[i][j]);
      }
      System.out.println();
    }
  }


}
