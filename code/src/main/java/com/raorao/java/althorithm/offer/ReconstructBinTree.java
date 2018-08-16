package com.raorao.java.althorithm.offer;


/**
 * 重建二叉树.
 *
 * 输入二叉树的前序、中序遍历的结果，重建二叉树
 *
 * @author Xiong Raorao
 * @since 2018-08-16-14:44
 */
public class ReconstructBinTree {

  public static void main(String[] args) {
    int[] pre = new int[] {1, 2, 4, 7, 3, 5, 6, 8};
    int[] in = new int[] {4, 7, 2, 1, 5, 3, 8, 6};
    TreeNode node = reConstructBinaryTree(pre, in);
  }

  public static TreeNode reConstructBinaryTree(int[] pre, int[] in) {
    if (pre == null || in == null || pre.length != in.length) {
      return null;
    }
    return construct(pre, 0, pre.length - 1, in, 0, in.length - 1);
  }

  private static TreeNode construct(int[] pre, int preStart, int preEnd, int[] in, int inStart,
      int inEnd) {
    if (preStart > preEnd || inStart > inEnd) {
      return null;
    }
    int rootVal = pre[preStart];
    TreeNode root = new TreeNode(rootVal);
    for (int i = 0; i < in.length; i++) {
      if (in[i] == rootVal) {
        int leftLength = i - inStart;
        root.left = construct(pre, preStart + 1, preStart + leftLength, in, inStart, i - 1);
        root.right = construct(pre, preStart + leftLength + 1, preEnd, in, i + 1, inEnd);
        break;
      }
    }
    return root;
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
