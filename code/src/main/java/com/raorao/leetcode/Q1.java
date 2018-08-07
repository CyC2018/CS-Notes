package com.raorao.leetcode;

/**
 * 二叉树最短路径.
 *
 * 题目描述：Given a binary tree, find its minimum depth.The minimum depth is the number of nodes along
 * the shortest path from the root node down to the nearest leaf node.
 *
 * @author Xiong Raorao
 * @since 2018-08-07-17:01
 */
public class Q1 {


  public static void main(String[] args) {

  }

  /**
   思路：
   递归，若为空树返回0；
   若左子树为空，则返回右子树的最小深度+1；（加1是因为要加上根这一层，下同）
   若右子树为空，则返回左子树的最小深度+1；
   若左右子树均不为空，则取左、右子树最小深度的较小值，+1；
   * @param root
   * @return
   */
  public int run(TreeNode root) {
    if (root == null) {
      return 0;
    }

    if (root.left == null) {
      return run(root.right) + 1;
    }
    if (root.right == null) {
      return run(root.left) + 1;
    }
    return run(root.left) < run(root.right) ? run(root.left) + 1 : run(root.right) + 1;
  }

  static class TreeNode {

    int val;
    TreeNode left;
    TreeNode right;

    TreeNode(int x) {
      val = x;
    }
  }
}
