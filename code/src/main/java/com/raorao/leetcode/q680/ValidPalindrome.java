package com.raorao.leetcode.q680;

/**
 * 验证回文字符串.
 *
 * @author Xiong Raorao
 * @since 2018-08-20-15:07
 */
public class ValidPalindrome {

  public static void main(String[] args) {
    String input = "abcba";
    boolean res = new ValidPalindrome().validPalindrome(input);
    System.out.println(res);
  }

  public boolean validPalindrome(String s) {
    int i = -1;
    int j = s.length();
    while (++i < --j) {
      if (s.charAt(i) != s.charAt(j)) {
        return isPalindrome(s, i, j - 1) || isPalindrome(s, i + 1, j);
      }
    }
    return true;
  }

  private boolean isPalindrome(String s, int i, int j) {
    while (i < j) {
      if (s.charAt(i++) != s.charAt(j--)) {
        return false;
      }
    }
    return true;
  }
}
