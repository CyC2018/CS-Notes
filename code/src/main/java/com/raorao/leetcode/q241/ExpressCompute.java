package com.raorao.leetcode.q241;

import java.util.ArrayList;
import java.util.List;

/**
 * 给表达式加括号.
 *
 * 分治法
 *
 * @author Xiong Raorao
 * @since 2018-08-21-17:01
 */
public class ExpressCompute {

  public static void main(String[] args) {
    String input = "2-1-1";
    List<Integer> res = diffWaysToCompute(input);
    res.forEach(e-> System.out.print(e+" "));
  }

  public static List<Integer> diffWaysToCompute(String input) {
    List<Integer> items = new ArrayList<>();
    for (int i = 0; i < input.length(); i++) {
      if (isChar(input, i)) {
        List<Integer> left = diffWaysToCompute(input.substring(0, i));
        List<Integer> right = diffWaysToCompute(input.substring(i + 1));
        for (int l : left) {
          for (int r : right) {
            switch (input.charAt(i)) {
              case '+':
                items.add(l + r);
                break;
              case '-':
                items.add(l - r);
                break;
              case '*':
                items.add(l * r);
                break;
            }
          }
        }
      }
    }
    if (items.size() == 0) {
      items.add(Integer.parseInt(input));
    }
    return items;
  }

  private static boolean isChar(String input, int i) {
    return input.charAt(i) == '+' || input.charAt(i) == '-' || input.charAt(i) == '*';
  }
}
