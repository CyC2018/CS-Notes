package com.raorao.interview.netease;

import java.util.Scanner;
import java.util.Stack;

/**
 * 会话列表问题.
 *
 * @author Xiong Raorao
 * @since 2018-08-08-11:55
 */
public class Q2 {

  public static void main(String[] args) {
    Scanner scanner = new Scanner(System.in);
    while (scanner.hasNext()) {
      int group = Integer.parseInt(scanner.nextLine());
      String[] res = new String[group];
      for (int i = 0; i < group; i++) {
        int size = Integer.parseInt(scanner.nextLine());
        String[] ss = scanner.nextLine().split(" ");
        int[] arr = new int[size];
        for (int j = 0; j < size; j++) {
          arr[j] = Integer.parseInt(ss[j]);
        }
        res[i] = process(arr);
      }
      for (int i = 0; i < group; i++) {
        System.out.println(res[i]);
      }
    }
  }

  private static String process(int[] arr) {
    if (arr == null || arr.length == 0) {
      return null;
    }
    int length = arr.length;
    Stack<Integer> s1 = new Stack<>();
    Stack<Integer> s2 = new Stack<>();
    for (int i = 0; i < length; i++) {
      if (!s1.isEmpty() && arr[i] == s1.peek()) {
        continue;
      }
      if (s1.contains(arr[i])) {
        Integer t;
        while ((t = s1.pop()) != arr[i]) {
          s2.push(t);
        }
        while (!s2.isEmpty()) {
          s1.push(s2.pop());
        }
        s1.push(t);
      } else {
        s1.push(arr[i]);
      }
    }
    int size = s1.size();
    StringBuilder sb = new StringBuilder();
    for (int i = 0; i < size; i++) {
      sb.append(s1.pop()).append(" ");
    }
    return sb.toString().trim();
  }
}
