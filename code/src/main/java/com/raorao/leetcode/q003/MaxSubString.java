package com.raorao.leetcode.q003;

import java.util.HashMap;
import java.util.Map;

/**
 * 无重复的最长子串.
 *
 * @author Xiong Raorao
 * @since 2018-08-20-19:31
 */
public class MaxSubString {

  public static void main(String[] args) {
    String input = "abcabcbb";
    int result = new MaxSubString().lengthOfLongestSubstring(input);
    System.out.println(result);
  }

  public int lengthOfLongestSubstring(String s) {
    if (s == null || s.length() == 0) {
      return 0;
    }
    Map<Character, Integer> map = new HashMap<>();
    int result = 1;
    int count = 0;
    for (int i = 0; i < s.length(); i++) {
      if (!map.containsKey(s.charAt(i))) {
        map.put(s.charAt(i), i);
        count++;
      } else {
        count = 0;
        i = map.get(s.charAt(i));
        map.clear();
      }
      if (result < count) {
        result = count;
      }
    }
    return result;
  }

}
