package com.raorao.interview.netease.q2;

import java.util.Scanner;

/**
 * 分苹果问题， N堆苹果，从左往右数第x个，求第x个在第几堆里面（堆从1开始算） .
 *
 * @author Xiong Raorao
 * @since 2018-08-11-16:09
 */
public class Main {

  public static void main(String[] args) {
    Scanner scanner = new Scanner(System.in);
    int n = Integer.parseInt(scanner.nextLine());
    int[] apples = new int[n];
    String[] temp = scanner.nextLine().split(" ");
    for (int i = 0; i < n; i++) {
      apples[i] = Integer.parseInt(temp[i]);
    }
    int m = Integer.parseInt(scanner.nextLine());
    int[] queries = new int[m];
    temp = scanner.nextLine().split(" ");
    for (int i = 0; i < m; i++) {
      queries[i] = Integer.parseInt(temp[i]);
    }
    process(apples, n, queries, m);
  }

  private static void process(int[] apples, int n, int[] queries, int m) {
    int[] acc = new int[n];
    acc[0] = apples[0];
    for (int i = 1; i < n; i++) {
      acc[i] = acc[i - 1] + apples[i];
    }
    for (int i = 0; i < m; i++) {
//      for (int j = 0; j < n; j++) {
//        if (queries[i] <= acc[j]) {
//          System.out.println(j + 1);
//          break;
//        }
//      }
      System.out.println(part(0, n - 1, acc, queries[i]) + 1);
    }
  }

  private static int part(int left, int right, int[] acc, int query) {
    int mid = (left + right) / 2;
    if (mid == 0) {
      return 0;
    }
    if(left == right ){
      return left;
    }
    if ( mid < acc.length && query <= acc[mid] && query <= acc[mid + 1] && query >= acc[mid - 1]) {
      return mid;
    }
    if (query > acc[mid]) {
      left = mid + 1;
      return part(left, right, acc, query);
    }
    if (query < acc[mid]) {
      right = mid - 1;
      return part(left, right, acc, query);
    }
    return 0;
  }

}
