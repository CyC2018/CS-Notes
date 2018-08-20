package com.raorao.leetcode.q345;

import java.util.Arrays;
import java.util.List;

/**
 * 反转元音字母.
 *
 * @author Xiong Raorao
 * @since 2018-08-20-11:32
 */
public class ReverseVowels {

  private List<Character> vowels = Arrays.asList('a', 'e', 'i', 'o', 'u', 'A', 'E', 'I', 'O', 'U');

  public static void main(String[] args) {
    String input = "hello";
    String out = new ReverseVowels().reverseVowels(input);
    System.out.println(out);
  }

  public String reverseVowels(String s) {
    int i = 0;
    int j = s.length() - 1;
    char[] result = new char[s.length()];
    while (i <= j) {
      char ci = s.charAt(i);
      char cj = s.charAt(j);
      if (!vowels.contains(ci)) {
        result[i++] = ci;
      } else if (!vowels.contains(cj)) {
        result[j--] = cj;
      } else {
        result[i++] = cj;
        result[j--] = ci;
      }
    }
    return new String(result);
  }
}
