package com.raorao.java.althorithm.offer;

/**
 * 二叉树的镜像.
 *
 * @author Xiong Raorao
 * @since 2018-08-16-16:52
 */
public class MirrorTree {

  public static void main(String[] args) {
  }

  public void Mirror(TreeNode root) {
    if (root == null) {
      return;
    }
    if (root.left == null && root.right == null) {
      return;
    }
    TreeNode temp = root.left;
    root.left = root.right;
    root.right = temp;
    Mirror(root.left);
    Mirror(root.right);
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
