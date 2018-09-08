package com.raorao.interview.netease.t1;

import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

/**
 * .
 *
 * @author Xiong Raorao
 * @since 2018-09-08-15:52
 */
public class Main {

  public static void main(String[] args) {
    Scanner scanner = new Scanner(System.in);
    int t = scanner.nextInt();
    List<Integer[]> list = new ArrayList<>();
    for (int i = 0; i < t; i++) {
      Integer[] ret = compute(scanner.nextInt(), scanner.nextInt());
      list.add(ret);
    }
    for (Integer[] i : list) {
      System.out.println(i[0] + " " + i[1]);
    }
  }

  private static Integer[] compute(int n, int k) {
    Integer[] ret = new Integer[2];
    ret[0] = 0;
    ret[1] = 0;
    if (k <= 1) {
      return ret;
    }
    ret[0] = 0;
    if (k <= n / 2) {
      ret[1] = k - 1;
    } else {
      ret[1] = n - k;
    }
    return ret;
  }

}
