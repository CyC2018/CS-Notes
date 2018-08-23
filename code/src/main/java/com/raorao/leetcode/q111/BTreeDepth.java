package com.raorao.leetcode.q111;


import java.util.LinkedList;
import java.util.Queue;

/**
 * 求二叉树的最小深度.
 *
 * @author Xiong Raorao
 * @since 2018-08-22-14:33
 */
public class BTreeDepth {

  public static void main(String[] args) {

  }

  public int minDepth(TreeNode root) {
    Queue<TreeNode> queue = new LinkedList<>();
    if (root == null) {
      return 0;
    }
    queue.add(root);
    int level = 1;
    while (!queue.isEmpty()) {
      int levelSize = queue.size();
      while (levelSize-- > 0) {
        TreeNode node = queue.poll();
        if (node != null) {
          if (node.left != null) {
            queue.add(node.left);
          }
          if (node.right != null) {
            queue.add(node.right);
          }
          if (node.left == null && node.right == null) {
            return level;
          }
        }
      }
      level++;
    }
    return level;
  }

  public class TreeNode {

    int val;
    TreeNode left;
    TreeNode right;

    TreeNode(int x) {
      val = x;
    }
  }
}
