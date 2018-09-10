package com.raorao.sword;

import java.util.ArrayList;
import java.util.List;

/**
 * 包含Min方法的栈.
 *
 * @author Xiong Raorao
 * @since 2018-09-08-23:26
 */
public class MinStack {

  private List<Integer> data = new ArrayList<>();

  private List<Integer> min = new ArrayList<>();

  public void push(int node) {
    data.add(node);
    if (min.size() == 0) {
      min.add(0);
    } else {
      int m = min();
      if (node < m) {
        min.add(data.size() - 1);
      }
    }
  }

  public void pop() {
    int popIndex = data.size() - 1;
    int minIndex = min.get(min.size() - 1);
    if (popIndex == minIndex) {
      min.remove(min.size() - 1);
    }
    data.remove(data.size() - 1);
  }

  public int top() {
    return data.get(data.size() - 1);
  }

  public int min() {
    int minIndex = min.get(min.size() - 1);
    return data.get(minIndex);
  }
}
