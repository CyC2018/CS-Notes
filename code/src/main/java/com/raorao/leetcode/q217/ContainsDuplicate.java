package com.raorao.leetcode.q217;

import java.util.HashMap;
import java.util.Map;

/**
 * 判断是否存在重复元素.
 *
 * @author Xiong Raorao
 * @since 2018-08-31-10:31
 */
public class ContainsDuplicate {

  public static void main(String[] args) {

  }

  public boolean containsDuplicate(int[] nums) {
    Map<Integer, Integer> map = new HashMap<>();
    for (int i : nums) {
      if (map.containsKey(i)) {
        return true;
      } else {
        map.put(i, 1);
      }
    }
    return false;
  }
}
