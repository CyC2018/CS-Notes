package com.raorao.leetcode.q347;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;
import java.util.stream.Collectors;

/**
 * 前K个出现频率最高的元素.
 *
 * @author Xiong Raorao
 * @since 2018-08-21-8:55
 */
public class TopKFrequent {

  public static void main(String[] args) {
    int[] input = new int[] {1, 1, 1, 2, 2, 3};
    int k = 2;
    List<Integer> list = new TopKFrequent().topKFrequent(input, k);
    list.forEach(e -> System.out.print(e + " "));
  }

  /**
   * 对map的value进行降序排列，得到前K个就行了
   */
  public List<Integer> topKFrequent(int[] nums, int k) {
    List<Integer> ret = new ArrayList<>();
    TreeMap<Integer, Integer> map = new TreeMap<>();
    Arrays.stream(nums).forEach(e -> map.put(e, map.getOrDefault(e, 0) + 1));
    List<Map.Entry<Integer, Integer>> tmp = map.entrySet().stream()
        .sorted((e1, e2) -> e2.getValue() - e1.getValue()).collect(Collectors.toList());
    for (int i = 0; i < k; i++) {
      ret.add(tmp.get(i).getKey());
    }
    return ret;
  }
}
