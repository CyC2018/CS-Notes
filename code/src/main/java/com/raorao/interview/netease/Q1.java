package com.raorao.interview.netease;

import java.util.Scanner;

/**
 * Clock.
 *
 * link: https://www.nowcoder.com/question/next?pid=11647029&qid=117516&tid=17351209
 *
 * 修改不满足时钟的条件，得到最小的值
 *
 * @author Xiong Raorao
 * @since 2018-08-08-10:56
 */
public class Q1 {

  public static void main(String[] args) {
    Scanner scanner = new Scanner(System.in);
    while (scanner.hasNext()) {
      int count = scanner.nextInt();
      String[] arr = new String[count];
      for (int i = 0; i < count; i++) {
        arr[i] = scanner.next();
      }
      process(arr);
    }
  }

  private static void process(String[] arr) {
    if (arr == null || arr.length == 0) {
      return;
    }
    for (int i = 0; i < arr.length; i++) {
      process(arr[i]);
    }
  }

  private static boolean[] isLeagle(String str) {
    String[] items = str.split(":");
    boolean[] res = new boolean[] {true, true, true};
    if (Integer.parseInt(items[0]) > 23) {
      res[0] = false;
    }
    if (Integer.parseInt(items[1]) > 59) {
      res[1] = false;
    }
    if (Integer.parseInt(items[2]) > 59) {
      res[2] = false;
    }
    return res;
  }

  private static void process(String str) {
    boolean[] judges = isLeagle(str);
    String[] items = str.split(":");
    StringBuilder sb = new StringBuilder();
    if (judges[0]) {
      sb.append(items[0]).append(":");
    } else {
      sb.append("0").append(items[0].substring(1)).append(":");
    }
    if (judges[1]) {
      sb.append(items[1]).append(":");
    } else {
      sb.append("0").append(items[1].substring(1)).append(":");
    }
    if (judges[2]) {
      sb.append(items[2]);
    } else {
      sb.append("0").append(items[2].substring(1));
    }
    System.out.println(sb.toString());
  }


}
