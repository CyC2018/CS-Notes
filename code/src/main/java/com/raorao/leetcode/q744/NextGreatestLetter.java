package com.raorao.leetcode.q744;

/**
 * 寻找大于给定元素的最小元素.
 *
 * @author Xiong Raorao
 * @since 2018-08-21-16:23
 */
public class NextGreatestLetter {

  public char nextGreatestLetter(char[] letters, char target) {
    int n = letters.length;
    int l = 0, h = n - 1;
    while (l <= h) {
      int m = l + (h - l) / 2;
      if (letters[m] <= target) {
        l = m + 1;
      } else {
        h = m - 1;
      }
    }
    return l < n ? letters[l] : letters[0];
  }
}
