package com.raorao.java.althorithm.union;

/**
 * 加权快速合并.
 *
 * @author Xiong Raorao
 * @since 2018-08-27-9:52
 */
public class WeightedQuickUnionUF extends UF {

  // 保存节点的数量信息
  private int[] sz;

  public WeightedQuickUnionUF(int N) {
    super(N);
    this.sz = new int[N];
    for (int i = 0; i < N; i++) {
      this.sz[i] = 1;
    }
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

    int i = find(p);
    int j = find(q);

    if (i == j) {
      return;
    }

    if (sz[i] < sz[j]) {
      id[i] = j;
      sz[j] += sz[i];
    } else {
      id[j] = i;
      sz[i] += sz[j];
    }
  }
}
