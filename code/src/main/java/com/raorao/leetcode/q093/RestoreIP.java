package com.raorao.leetcode.q093;

import java.util.ArrayList;
import java.util.List;

/**
 * ip地址的划分.
 *
 * @author Xiong Raorao
 * @since 2018-08-22-20:38
 */
public class RestoreIP {

  public static void main(String[] args) {
    String input = "25525511135";
    List<String> ret = new RestoreIP().restoreIpAddresses(input);
    ret.forEach(e -> System.out.print(e + " "));
  }

  public List<String> restoreIpAddresses(String s) {
    List<String> ret = new ArrayList<>();
    process(0, new StringBuilder(), ret, s);
    return ret;
  }

  /**
   * @param k 表示当前已经分割的ip段
   */
  private void process(int k, StringBuilder sb, List<String> ret, String s) {

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
