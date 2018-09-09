package com.raorao.interview.bytedance.th9.t3;

import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

/**
 * .
 *
 * @author Xiong Raorao
 * @since 2018-09-09-10:33
 */
public class Main {

  public static void main(String[] args) {
    Scanner scanner = new Scanner(System.in);
    String input = scanner.nextLine();
    System.out.println(restoreIpAddresses(input));
  }

  public static int restoreIpAddresses(String s) {
    List<String> ret = new ArrayList<>();
    process(0, new StringBuilder(), ret, s);
    return ret.size();
  }

  /**
   * @param k 表示当前已经分割的ip段
   */
  private static void process(int k, StringBuilder sb, List<String> ret, String s) {

    if (k == 4 || s.length() == 0) {
      if (k == 4 && s.length() == 0) {
        ret.add(sb.toString());
      }
      return;
    }

    for (int i = 0; i < s.length() && i <= 2; i++) {
      if (i != 0 && s.charAt(0) == '0') {
        break;
      }
      String part = s.substring(0, i + 1);
      if (Integer.valueOf(part) <= 255) {
        if (sb.length() != 0) {
          part = "." + part;
        }
        sb.append(part);
        process(k + 1, sb, ret, s.substring(i + 1));
        sb.delete(sb.length() - part.length(), sb.length());
      }
    }

  }
}
