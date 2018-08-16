package com.raorao.java.althorithm.offer;

/**
 * 判断树的子结构.
 *
 * @author Xiong Raorao
 * @since 2018-08-16-16:33
 */
public class SubTree {

  public static void main(String[] args) {

  }

  public boolean HasSubtree(TreeNode root1, TreeNode root2) {
    boolean result = false;
    if (root1 != null && root2 != null) {
      if (root1.val == root2.val) {
        result = doesTree1HaveTree2(root1, root2);
      }
      if (!result) {
        result = HasSubtree(root1.left, root2);
      }
      if (!result) {
        result = HasSubtree(root1.right, root2);
      }
    }
    return result;
  }

  // 当两个树的根节点相同的时候，两个树
  private boolean doesTree1HaveTree2(TreeNode root1, TreeNode root2) {
    if (root1 == null && root2 == null) {
      return true;
    }
    if (root1 == null) {
      return false;// 空节点不会包含其他子节点
    }
    if (root2 == null) {
      return true; // 空节点是任何节点的子节点
    }
    if (root1.val != root2.val) {
      return false;
    }

    return doesTree1HaveTree2(root1.left, root2.left) && doesTree1HaveTree2(root1.right,
        root2.right);
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
