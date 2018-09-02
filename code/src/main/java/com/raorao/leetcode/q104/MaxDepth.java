package com.raorao.leetcode.q104;


import com.raorao.leetcode.TreeNode;

/**
 * 求树的最大深度.
 *
 * @author Xiong Raorao
 * @since 2018-09-02-19:30
 */
public class MaxDepth {

  public int maxDepth(TreeNode root) {
    if (root == null) {
      return 0;
    }
    return Math.max(maxDepth(root.left), maxDepth(root.right)) + 1;
  }

}
