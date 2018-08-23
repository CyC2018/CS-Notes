package com.raorao.leetcode.q017;

import java.util.ArrayList;
import java.util.List;

/**
 * 电话键盘组合.
 *
 * @author Xiong Raorao
 * @since 2018-08-22-18:46
 */
public class PhoneNumber {

  private final static String[] KEYS = new String[] {"", "", "abc", "def", "ghi", "jkl", "mno",
      "pqrs", "tuv", "wxyz"};

  public static void main(String[] args) {
    List<String> ret = new PhoneNumber().letterCombinations("23");
    System.out.println(ret);

  }

  public List<String> letterCombinations(String digits) {
    List<String> ret = new ArrayList<>();
    int[] index = new int[digits.length()];
    for (int i = 0; i < index.length; i++) {
      index[i] = digits.charAt(i) - '0';
    }
    process(new StringBuilder(), ret, index);
    return ret;
  }

  private void process(StringBuilder prefix, List<String> ret, int[] index) {
    if (prefix.length() == index.length) {
      ret.add(prefix.toString());
      return;
    }
    for (char c : KEYS[index[prefix.length()]].toCharArray()) {
      prefix.append(c);
      process(prefix, ret, index);
      prefix.deleteCharAt(prefix.length() - 1);
    }
  }

}
