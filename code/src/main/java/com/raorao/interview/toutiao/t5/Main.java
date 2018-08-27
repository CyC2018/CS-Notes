package com.raorao.interview.toutiao.t5;

import java.util.Scanner;

/**
 * .
 *
 * @author Xiong Raorao
 * @since 2018-08-25-11:30
 */
public class Main {

  private static final String ERR = "cannot_answer";

  public static void main(String[] args) {
    Scanner scanner = new Scanner(System.in);
    String[] line1 = scanner.nextLine().split(" ");
    int n = Integer.parseInt(line1[0]);
    int m = Integer.parseInt(line1[1]);
    char[] y = new char[n];
    int[] k = new int[n];
    char[] x = new char[n];
    char[][] q = new char[m][2];
    for (int i = 0; i < n; i++) {
      String line = scanner.nextLine();
      String[] eq = line.split(" = ");
      y[i] = eq[0].charAt(0);
      String[] eq2 = eq[1].split(" - ");
      k[i] = Integer.parseInt(eq2[0]);
      x[i] = eq2[1].charAt(0);
    }
    for (int i = 0; i < m; i++) {
      String line = scanner.nextLine();
      String[] eq = line.split(" - ");
      q[i][0] = eq[0].charAt(0);
      q[i][1] = eq[1].charAt(0);
    }

    String[] ret = new String[2];
    for (int i = 0; i < m; i++) {
      ret[i] = process(y, k, x, q[i]);
    }
    for (String s : ret) {
      System.out.println(s);
    }
  }

  private static String process(char[] y, int[] k, char[] x, char[] q) {
    int index1 = getIndex(y, q[0]);
    int index2 = getIndex(x, q[1]);
    if (index1 != -1 && index2 != -1 && index1 != index2) {
      int res = k[index1] - k[index2];
      return String.valueOf(res);
    }
    return ERR;
  }

  private static int getIndex(char[] chars, int q) {
    for (int i = 0; i < chars.length; i++) {
      if (q == chars[i]) {
        return i;
      }
    }
    return -1;
  }

}
