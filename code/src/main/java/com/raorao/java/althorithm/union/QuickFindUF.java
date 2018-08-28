package com.raorao.java.althorithm.union;

/**
 * 查找优先的并查集.
 *
 * @author Xiong Raorao
 * @since 2018-08-27-9:47
 */
public class QuickFindUF extends UF {

  public QuickFindUF(int N) {
    super(N);
  }


  @Override
  public int find(int p) {
    if (p >= id.length) {
      return -1;
    }
    return id[p];
  }


  @Override
  public void union(int p, int q) {

    int pID = find(p);
    int qID = find(q);

    if (pID == qID) {
      return;
    }

    for (int i = 0; i < id.length; i++) {
      if (id[i] == pID) {
        id[i] = qID;
      }
    }
  }
}
