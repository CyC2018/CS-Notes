# Java 容器 - 进阶
<!-- GFM-TOC -->
* [Java 容器 - 进阶](#java-容器---进阶)
    * [三、源码分析](#三源码分析)
        * [ArrayList](#arraylist)
        * [HashMap](#hashmap)
        * [ConcurrentHashMap](#concurrenthashmap)
        * [WeakHashMap](#weakhashmap)
    * [参考资料](#参考资料)
<!-- GFM-TOC -->


## 三、源码分析

以下源码基于 JDK 1.8；标题写明 JDK 1.7 的小节和 ConcurrentHashMap 的 size 操作基于 JDK 7u 的最终版本。

### ArrayList

#### 序列化

主线见[Java 容器 · ArrayList 的序列化](Java%20容器.md#4-序列化)。

elementData 用 transient 修饰，不参与默认的序列化：

```java
transient Object[] elementData; // non-private to simplify nested class access
```

writeObject() 和 readObject() 只处理前 size 个元素。writeObject() 末尾比较 modCount，期间发生了结构修改就抛出 ConcurrentModificationException，即主线中的 [Fail-Fast](Java%20容器.md#5-fail-fast)。

```java
private void readObject(java.io.ObjectInputStream s)
    throws java.io.IOException, ClassNotFoundException {
    elementData = EMPTY_ELEMENTDATA;

    // Read in size, and any hidden stuff
    s.defaultReadObject();

    // Read in capacity
    s.readInt(); // ignored

    if (size > 0) {
        // be like clone(), allocate array based upon size not capacity
        ensureCapacityInternal(size);

        Object[] a = elementData;
        // Read in all elements in the proper order.
        for (int i=0; i<size; i++) {
            a[i] = s.readObject();
        }
    }
}
```

```java
private void writeObject(java.io.ObjectOutputStream s)
    throws java.io.IOException{
    // Write out element count, and any hidden stuff
    int expectedModCount = modCount;
    s.defaultWriteObject();

    // Write out size as capacity for behavioural compatibility with clone()
    s.writeInt(size);

    // Write out all elements in the proper order.
    for (int i=0; i<size; i++) {
        s.writeObject(elementData[i]);
    }

    if (modCount != expectedModCount) {
        throw new ConcurrentModificationException();
    }
}
```

序列化时需要使用 ObjectOutputStream 的 writeObject() 将对象转换为字节流并输出。对象的类定义了私有的 writeObject() 时，ObjectOutputStream 通过反射调用它，由它代替默认的序列化过程；ArrayList 的 writeObject() 先用 defaultWriteObject() 写出 size 等非 transient 字段，再逐个写出元素。反序列化使用的是 ObjectInputStream 的 readObject() 方法，原理类似。

```java
ArrayList list = new ArrayList();
ObjectOutputStream oos = new ObjectOutputStream(new FileOutputStream(file));
oos.writeObject(list);
```

### HashMap

#### 计算数组容量

主线见[Java 容器 · 计算数组容量](Java%20容器.md#7-计算数组容量)。

HashMap 构造函数允许用户传入的容量不是 2 的 n 次方，因为它可以自动地将传入的容量转换为 2 的 n 次方。

先考虑如何求一个数的掩码，对于 10010000，它的掩码为 11111111，可以使用以下方法得到：

```text
mask |= mask >> 1    11011000
mask |= mask >> 2    11111110
mask |= mask >> 4    11111111
```

mask+1 是大于原始数字的最小的 2 的 n 次方。

```text
num     10010000
mask+1 100000000
```

以下是 HashMap 中计算数组容量的代码：

```java
static final int tableSizeFor(int cap) {
    int n = cap - 1;
    n |= n >>> 1;
    n |= n >>> 2;
    n |= n >>> 4;
    n |= n >>> 8;
    n |= n >>> 16;
    return (n < 0) ? 1 : (n >= MAXIMUM_CAPACITY) ? MAXIMUM_CAPACITY : n + 1;
}
```

代码先减 1，是为了让本来就是 2 的幂的值保持不变：传入 16 时 n 为 15，结果仍为 16，不减 1 会得到 32。JDK 21 改为 -1 >>> Integer.numberOfLeadingZeros(cap - 1)，一步得到同样的掩码，结果相同。

#### JDK 1.7 的 HashMap

主线以 JDK 8 为准，两者的区别见[Java 容器 · HashMap](Java%20容器.md#hashmap)。以下源码取自 JDK 7u 的最终版本，省略了泛型的类型转换。

Entry 有 hash、key、value、next 四个字段，table 是 Entry 数组：

```java
transient Entry[] table = EMPTY_TABLE;

static class Entry<K,V> implements Map.Entry<K,V> {
    final K key;
    V value;
    Entry<K,V> next;
    int hash;

    Entry(int h, K k, V v, Entry<K,V> n) {
        value = v;
        next = n;
        key = k;
        hash = h;
    }
}
```

put() 先在桶中查找相同的键，找不到再调用 addEntry() 插入。键为 null 时由 putForNullKey() 放在第 0 个桶：

```java
public V put(K key, V value) {
    if (table == EMPTY_TABLE) {
        inflateTable(threshold);
    }
    // 键为 null 单独处理
    if (key == null)
        return putForNullKey(value);
    int hash = hash(key);
    // 确定桶下标
    int i = indexFor(hash, table.length);
    // 先找出是否已经存在键为 key 的键值对，如果存在的话就更新这个键值对的值为 value
    for (Entry<K,V> e = table[i]; e != null; e = e.next) {
        Object k;
        if (e.hash == hash && ((k = e.key) == key || key.equals(k))) {
            V oldValue = e.value;
            e.value = value;
            e.recordAccess(this);
            return oldValue;
        }
    }

    modCount++;
    // 插入新键值对
    addEntry(hash, key, value, i);
    return null;
}

private V putForNullKey(V value) {
    for (Entry<K,V> e = table[0]; e != null; e = e.next) {
        if (e.key == null) {
            V oldValue = e.value;
            e.value = value;
            e.recordAccess(this);
            return oldValue;
        }
    }
    modCount++;
    addEntry(0, null, value, 0);
    return null;
}
```

addEntry() 在插入前判断是否扩容：size 大于等于 threshold、并且要插入的桶不为空时，容量扩为原来的两倍，再重新计算桶下标。createEntry() 使用头插法，新的键值对插在链表的头部：

```java
void addEntry(int hash, K key, V value, int bucketIndex) {
    if ((size >= threshold) && (null != table[bucketIndex])) {
        resize(2 * table.length);
        hash = (null != key) ? hash(key) : 0;
        bucketIndex = indexFor(hash, table.length);
    }

    createEntry(hash, key, value, bucketIndex);
}

void createEntry(int hash, K key, V value, int bucketIndex) {
    Entry<K,V> e = table[bucketIndex];
    // 头插法，链表头部指向新的键值对
    table[bucketIndex] = new Entry<>(hash, key, value, e);
    size++;
}
```

hash() 对 hashCode 做四次移位和异或。hashSeed 默认为 0，只有设置了 jdk.map.althashing.threshold、并且容量达到这个值时才启用替代哈希，这时 String 键改用 sun.misc.Hashing.stringHash32()。indexFor() 用与运算代替取模：

```java
final int hash(Object k) {
    int h = hashSeed;
    if (0 != h && k instanceof String) {
        return sun.misc.Hashing.stringHash32((String) k);
    }

    h ^= k.hashCode();

    // This function ensures that hashCodes that differ only by
    // constant multiples at each bit position have a bounded
    // number of collisions (approximately 8 at default load factor).
    h ^= (h >>> 20) ^ (h >>> 12);
    return h ^ (h >>> 7) ^ (h >>> 4);
}

static int indexFor(int h, int length) {
    return h & (length-1);
}
```

resize() 创建新数组，transfer() 把旧数组中的节点逐个取出，重新计算桶下标后头插到新数组中，同一个桶中节点的顺序会反转。rehash 只在替代哈希的开关变化时为 true，默认为 false。两个线程同时执行 transfer() 时链表可能成环，过程见[Java 容器 · 线程安全](Java%20容器.md#10-线程安全)。

```java
void resize(int newCapacity) {
    Entry[] oldTable = table;
    int oldCapacity = oldTable.length;
    if (oldCapacity == MAXIMUM_CAPACITY) {
        threshold = Integer.MAX_VALUE;
        return;
    }

    Entry[] newTable = new Entry[newCapacity];
    transfer(newTable, initHashSeedAsNeeded(newCapacity));
    table = newTable;
    threshold = (int)Math.min(newCapacity * loadFactor, MAXIMUM_CAPACITY + 1);
}

void transfer(Entry[] newTable, boolean rehash) {
    Entry[] src = table;
    int newCapacity = newTable.length;
    for (int j = 0; j < src.length; j++) {
        Entry<K,V> e = src[j];
        while(null != e) {
            Entry<K,V> next = e.next;
            if (rehash) {
                e.hash = null == e.key ? 0 : hash(e.key);
            }
            int i = indexFor(e.hash, newCapacity);
            e.next = newTable[i];
            newTable[i] = e;
            e = next;
        }
    }
}
```


### ConcurrentHashMap

#### JDK 1.7 的存储结构

主线见[Java 容器 · JDK 1.8 的改动](Java%20容器.md#3-jdk-18-的改动)，以下源码取自 JDK 7u 的最终版本。

每个 Segment 维护着一个 HashEntry 数组，HashEntry 的 value 和 next 用 volatile 修饰，读操作通常不需要加锁：

```java
static final class HashEntry<K,V> {
    final int hash;
    final K key;
    volatile V value;
    volatile HashEntry<K,V> next;
}
```

Segment 继承自 ReentrantLock。

```java
static final class Segment<K,V> extends ReentrantLock implements Serializable {

    private static final long serialVersionUID = 2249069246763182397L;

    static final int MAX_SCAN_RETRIES =
        Runtime.getRuntime().availableProcessors() > 1 ? 64 : 1;

    transient volatile HashEntry<K,V>[] table;

    transient int count;

    transient int modCount;

    transient int threshold;

    final float loadFactor;
}
```

```java
final Segment<K,V>[] segments;
```

默认的并发级别为 16，Segment 数组的长度为 16。构造时只创建第 0 个 Segment，其余由 ensureSegment() 在第一次用到时创建。

```java
static final int DEFAULT_CONCURRENCY_LEVEL = 16;
```


#### size 操作

这是 JDK 1.7 的实现，主线见[Java 容器 · JDK 1.8 的改动](Java%20容器.md#3-jdk-18-的改动)，JDK 1.8 的计数方式见[Java 容器 · size 操作](Java%20容器.md#2-size-操作)。

每个 Segment 维护了一个 count 变量来统计该 Segment 中的键值对个数。

```java
/**
 * The number of elements. Accessed only either within locks
 * or among other volatile reads that maintain visibility.
 */
transient int count;
```

在执行 size 操作时，需要遍历所有 Segment 然后把 count 累计起来。

ConcurrentHashMap 在执行 size 操作时先尝试不加锁，每一轮同时累加各 Segment 的 count 和 modCount。相邻两轮的 modCount 之和相同，说明统计期间没有修改，这一轮的 count 之和就是正确的。只比较 count 不够：一次删除加一次插入后元素个数不变，但 modCount 变了。

RETRIES_BEFORE_LOCK 为 2，retries 初始值为 -1，因此不加锁最多统计 3 轮；3 轮中都没有相邻两轮一致时，第 4 轮统计前对每个 Segment 加锁，加锁后不会再有修改，统计结果一定正确。

```java
/**
 * Number of unsynchronized retries in size and containsValue
 * methods before resorting to locking. This is used to avoid
 * unbounded retries if tables undergo continuous modification
 * which would make it impossible to obtain an accurate result.
 */
static final int RETRIES_BEFORE_LOCK = 2;

public int size() {
    // Try a few times to get accurate count. On failure due to
    // continuous async changes in table, resort to locking.
    final Segment<K,V>[] segments = this.segments;
    int size;
    boolean overflow; // true if size overflows 32 bits
    long sum;         // sum of modCounts
    long last = 0L;   // previous sum
    int retries = -1; // first iteration isn't retry
    try {
        for (;;) {
            // 超过尝试次数，则对每个 Segment 加锁
            if (retries++ == RETRIES_BEFORE_LOCK) {
                for (int j = 0; j < segments.length; ++j)
                    ensureSegment(j).lock(); // force creation
            }
            sum = 0L;
            size = 0;
            overflow = false;
            for (int j = 0; j < segments.length; ++j) {
                Segment<K,V> seg = segmentAt(segments, j);
                if (seg != null) {
                    sum += seg.modCount;
                    int c = seg.count;
                    if (c < 0 || (size += c) < 0)
                        overflow = true;
                }
            }
            // 相邻两轮的 modCount 之和相同，说明统计期间没有修改
            if (sum == last)
                break;
            last = sum;
        }
    } finally {
        if (retries > RETRIES_BEFORE_LOCK) {
            for (int j = 0; j < segments.length; ++j)
                segmentAt(segments, j).unlock();
        }
    }
    return overflow ? Integer.MAX_VALUE : size;
}
```

### WeakHashMap

#### ConcurrentCache

主线见[Java 容器 · WeakHashMap](Java%20容器.md#weakhashmap)。

Tomcat 中的 ConcurrentCache 使用了 WeakHashMap 来实现缓存功能。

ConcurrentCache 采取的是分代缓存：

- 新放入的对象放在 eden 中，eden 使用 ConcurrentHashMap 实现，强引用其中的对象，不会被回收；
- eden 满了以后，其中的对象整批移入 longterm，longterm 使用 WeakHashMap 实现，键没有其它强引用时会被垃圾收集器回收；
- 当调用 get() 方法时，会先从 eden 区获取，如果没有找到的话再到 longterm 获取，当从 longterm 获取到就把对象放入 eden 中，从而保证经常被访问的节点不容易被回收；
- 当调用 put() 方法时，如果 eden 的大小达到了 size，就将 eden 中的所有对象都放入 longterm 中，再清空 eden。

WeakHashMap 不是线程安全的，eden 是 ConcurrentHashMap 并不能保护它，所以访问 longterm 时都要用 synchronized (longterm) 加锁。以下代码取自 Tomcat 9 的 org.apache.el.util.ConcurrentCache，省略了注释：

```java
public final class ConcurrentCache<K, V> {

    private final int size;

    private final Map<K, V> eden;

    private final Map<K, V> longterm;

    public ConcurrentCache(int size) {
        this.size = size;
        this.eden = new ConcurrentHashMap<>(size);
        this.longterm = new WeakHashMap<>(size);
    }

    public V get(K k) {
        V v = this.eden.get(k);
        if (v == null) {
            synchronized (longterm) {
                v = this.longterm.get(k);
            }
            if (v != null) {
                this.eden.put(k, v);
            }
        }
        return v;
    }

    public void put(K k, V v) {
        if (this.eden.size() >= size) {
            synchronized (longterm) {
                this.longterm.putAll(this.eden);
            }
            this.eden.clear();
        }
        this.eden.put(k, v);
    }
}
```

## 参考资料

- [JDK 8 源码 java.util](https://github.com/openjdk/jdk8u/tree/master/jdk/src/share/classes/java/util)
- [JDK 7u 源码：HashMap.java](https://github.com/openjdk/jdk7u/blob/master/jdk/src/share/classes/java/util/HashMap.java)
- [JDK 7u 源码：ConcurrentHashMap.java](https://github.com/openjdk/jdk7u/blob/master/jdk/src/share/classes/java/util/concurrent/ConcurrentHashMap.java)
- [JDK 21 源码：ArrayList.java](https://github.com/openjdk/jdk21u/blob/master/src/java.base/share/classes/java/util/ArrayList.java)
- [JDK 21 源码：HashMap.java](https://github.com/openjdk/jdk21u/blob/master/src/java.base/share/classes/java/util/HashMap.java)
- [Tomcat 9 源码：ConcurrentCache.java](https://github.com/apache/tomcat/blob/9.0.x/java/org/apache/el/util/ConcurrentCache.java)
