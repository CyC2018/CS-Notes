package com.raorao.leetcode.q392;

/**
 * 判断是否为子序列.
 *
 * @author Xiong Raorao
 * @since 2018-08-21-15:13
 */
public class SubSequence {

  public static void main(String[] args) {
    String s = "abc";
    String t = "ahbgdc";
    System.out.println(new SubSequence().isSubsequence2(s, t));
  }

  /**
   * 贪心法，一个一个检索
   */
  public boolean isSubsequence(String s, String t) {
    int index = -1;
    for (char c : s.toCharArray()) {
      index = t.indexOf(c, index + 1);
      if (index == -1) {
        return false;
      }
    }
    return true;
  }

  public boolean isSubsequence2(String s, String t) {
    int is = 0;
    int it = 0;
    while (is < s.length() && it < t.length()) {
      if (s.charAt(is) == t.charAt(it)) {
        is++;
        it++;
      } else {
        it++;
      }
    }
    return is == s.length();
  }
}
