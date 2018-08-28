package com.raorao.java.althorithm.union;

/**
 * 合并优先.
 *
 * @author Xiong Raorao
 * @since 2018-08-27-9:50
 */
public class QuickUnionUF extends UF {

  public QuickUnionUF(int N) {
    super(N);
  }

  @Override
  public int find(int p) {
    if (p >= id.length) {
      return -1;
    }
    while (p != id[p]) {
      p = id[p];
    }
    return p;
  }

  @Override
  public void union(int p, int q) {

    int pRoot = find(p);
    int qRoot = find(q);

    if (pRoot != qRoot) {
      id[pRoot] = qRoot;
    }
  }
}
