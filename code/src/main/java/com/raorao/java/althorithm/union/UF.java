package com.raorao.java.althorithm.union;

/**
 * 并查集.
 *
 * @author Xiong Raorao
 * @since 2018-08-27-9:46
 */
public abstract class UF {

  protected int[] id;

  public UF(int N) {
    id = new int[N];
    for (int i = 0; i < N; i++) {
      id[i] = i;
    }
  }

  public boolean connected(int p, int q) {
    return find(p) == find(q);
  }

  public abstract int find(int p);

  public abstract void union(int p, int q);
}
