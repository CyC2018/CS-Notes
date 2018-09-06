package com.raorao.sword;

import java.util.Stack;

/**
 * .
 *
 * @author Xiong Raorao
 * @since 2018-09-06-11:36
 */
public class Solution05 {

  Stack<Integer> stack1 = new Stack<Integer>();
  Stack<Integer> stack2 = new Stack<Integer>();

  public void push(int node) {
    stack1.push(node);
  }

  public int pop() {
    int ret;
    if (!stack2.isEmpty()) {
      ret = stack2.pop();
    } else {
      while (!stack1.isEmpty()) {
        stack2.push(stack1.pop());
      }
      ret = stack2.pop();
    }
    return ret;
  }
}
