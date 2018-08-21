package com.raorao.leetcode.q763;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 划分字母区间.
 *
 * 输入：划分字母区间来控制
 *
 * @author Xiong Raorao
 * @since 2018-08-21-10:53
 */
public class SplitLetters {

  public static void main(String[] args) {
    String input = "ababcbacadefegdehijhklij";
    List<Integer> list = new SplitLetters().partitionLabels(input);
    list.forEach(e -> System.out.print(e + " "));
  }

  public List<Integer> partitionLabels(String S) {
    List<Integer> ret = new ArrayList<>();
    if (S == null || S.length() == 0) {
      return ret;
    }
    Map<Character, Integer> map = new HashMap<>(); // 统计每个字符最后出现的位置
    for (int i = 0; i < S.length(); i++) {
      map.put(S.charAt(i), i);
    }

    int firstIndex = 0;
    while (firstIndex < S.length()) {
      int lastIndex = firstIndex;
      for (int i = firstIndex; i < S.length() && i <= lastIndex; i++) {
        int index = map.get(S.charAt(i));
        if (index > lastIndex) {
          lastIndex = index;
        }
      }
      ret.add(lastIndex - firstIndex + 1);
      firstIndex = lastIndex + 1;
    }
    return ret;
  }
}
