package com.raorao.java.althorithm;

import java.util.LinkedHashMap;
import java.util.Map;

/**
 * 缓存算法的实现 .
 *
 * LinkedHashMap的一个构造函数，当参数accessOrder为true时，即会按照访问顺序排序，最近访问的放在最前，最早访问的放在后面
 *
 * @author Xiong Raorao
 * @since 2018-09-10-11:53
 */
public class LRU<K, V> extends LinkedHashMap<K, V> {

  private final int MAX_CACHE_SIZE;

  public LRU(int cacheSize) {
    super((int) Math.ceil(cacheSize / 0.75) + 1, 0.75f, true);
    MAX_CACHE_SIZE = cacheSize;
  }

  @Override
  protected boolean removeEldestEntry(Map.Entry eldest) {
    return size() > MAX_CACHE_SIZE;
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    for (Map.Entry<K, V> entry : entrySet()) {
      sb.append(String.format("%s:%s ", entry.getKey(), entry.getValue()));
    }
    return sb.toString();
  }
}
