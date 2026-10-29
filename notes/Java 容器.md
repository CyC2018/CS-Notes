# Java 容器
<!-- GFM-TOC -->
* [Java 容器](#java-容器)
    * [一、概览](#一概览) 🔥
        * [Collection](#collection)
        * [Map](#map)
    * [二、容器中的设计模式](#二容器中的设计模式)
        * [迭代器模式](#迭代器模式)
        * [适配器模式](#适配器模式)
    * [三、源码分析](#三源码分析)
        * [ArrayList](#arraylist) 🔥
        * [LinkedList](#linkedlist)
        * [Vector](#vector)
        * [CopyOnWriteArrayList](#copyonwritearraylist)
        * [HashMap](#hashmap) 🔥🔥
        * [ConcurrentHashMap](#concurrenthashmap) 🔥🔥
        * [LinkedHashMap](#linkedhashmap)
        * [WeakHashMap](#weakhashmap)
    * [附录：实测](#附录实测)
        * [A1 ArrayList 的扩容与常见陷阱](#a1-arraylist-的扩容与常见陷阱)
        * [A2 HashMap 的并发写入](#a2-hashmap-的并发写入)
        * [A3 ArrayList 的并发写入](#a3-arraylist-的并发写入)
        * [A4 HashMap 链表转红黑树](#a4-hashmap-链表转红黑树)
        * [A5 HashMap 的扩容时机与 Hashtable](#a5-hashmap-的扩容时机与-hashtable)
    * [参考资料](#参考资料)
<!-- GFM-TOC -->


## 一、概览 🔥

容器主要包括 Collection 和 Map 两种，Collection 存储着对象的集合，而 Map 存储着键值对（两个对象）的映射表。

### Collection

<div align="center"> <img src="pics/jcol-collection.png" width="760px"/> </div><br>

#### 1. Set

- TreeSet：基于红黑树实现，支持有序性操作，例如根据一个范围查找元素的操作。但是查找效率不如 HashSet，HashSet 查找的时间复杂度为 O(1)，TreeSet 则为 O(logN)；
- HashSet：基于哈希表实现，支持快速查找，但不支持有序性操作。并且失去了元素的插入顺序信息，也就是说使用 Iterator 遍历 HashSet 得到的结果是不确定的；
- LinkedHashSet：具有 HashSet 的查找效率，并且内部使用双向链表维护元素的插入顺序。

#### 2. List

- ArrayList：基于动态数组实现，支持随机访问；
- Vector：和 ArrayList 类似，但它是线程安全的；
- LinkedList：基于双向链表实现，只能顺序访问，但是可以快速地在链表中间插入和删除元素。不仅如此，LinkedList 还可以用作栈、队列和双向队列。

#### 3. Queue

- LinkedList：可以用它来实现双向队列；
- PriorityQueue：基于堆结构实现，可以用它来实现优先队列。

### Map

<div align="center"> <img src="pics/jcol-map.png" width="760px"/> </div><br>

- TreeMap：基于红黑树实现；
- HashMap：基于哈希表实现；
- Hashtable：和 HashMap 类似，但它是线程安全的，这意味着同一时刻多个线程同时写入 Hashtable 不会导致数据不一致。它是遗留类，不应该去使用它，而是使用 ConcurrentHashMap 来支持线程安全。ConcurrentHashMap 的效率更高，因为它不会锁住整个表：JDK 1.7 使用分段锁，JDK 1.8 只锁住一个桶；
- LinkedHashMap：使用双向链表来维护元素的顺序，顺序为插入顺序或者最近最少使用（LRU）顺序。

上面的 ArrayList、LinkedList、HashMap 等常用容器都不是线程安全的。需要在多个线程之间共享时，线程安全的容器主要有以下三类：

- 同步容器：Vector、Hashtable，以及用 Collections.synchronizedList()、synchronizedMap() 包装出来的容器，所有方法共用一把锁，同一时刻只有一个线程能访问；
- 写时复制容器：CopyOnWriteArrayList、CopyOnWriteArraySet，写操作复制整个数组，读操作不加锁，适合读多写少的场景；
- 并发容器：ConcurrentHashMap、ConcurrentSkipListMap（按键排序）、ConcurrentLinkedQueue，以及 ArrayBlockingQueue 等阻塞队列（见 [BlockingQueue](Java%20并发.md#blockingqueue)），用 CAS 和更细粒度的锁让多个线程同时访问。

只在一个线程中使用的容器，例如方法中的局部变量，不需要线程安全，直接使用 ArrayList、HashMap，没有加锁的开销。


## 二、容器中的设计模式

### 迭代器模式

<div align="center"> <img src="pics/jcol-iterator.png" width="760px"/> </div><br>

Collection 继承了 Iterable 接口，其中的 iterator() 方法能够产生一个 Iterator 对象，通过这个对象就可以迭代遍历 Collection 中的元素。

从 JDK 1.5 之后可以使用 foreach 方法来遍历实现了 Iterable 接口的聚合对象。

```java
List<String> list = new ArrayList<>();
list.add("a");
list.add("b");
for (String item : list) {
    System.out.println(item);
}
```

### 适配器模式

java.util.Arrays#asList() 可以把数组类型转换为 List 类型。

```java
@SafeVarargs
public static <T> List<T> asList(T... a)
```

应该注意的是 asList() 的参数为泛型的变长参数，不能使用基本类型数组作为参数，只能使用相应的包装类型数组。

```java
Integer[] arr = {1, 2, 3};
List list = Arrays.asList(arr);
```

也可以使用以下方式调用 asList()：

```java
List list = Arrays.asList(1, 2, 3);
```

asList() 返回的是数组的一个视图，而不是一个新的 ArrayList，使用时需要注意（JDK 21 实测，见[附录 A1](#a1-arraylist-的扩容与常见陷阱)）：

- 长度固定：可以 set()，但调用 add()、remove() 会抛出 UnsupportedOperationException；
- 与数组共用存储：修改原数组后，List 中的元素也跟着改变；
- 传入 int[] 这样的基本类型数组时，整个数组被当成一个元素，得到的 List 长度为 1。

需要一个可以修改的列表时，用 new ArrayList<>(Arrays.asList(arr)) 复制一份。

## 三、源码分析

如果没有特别说明，以下源码分析基于 JDK 1.8。JDK 21 中这些类的主要逻辑没有变化，有差异的地方单独说明。

### ArrayList 🔥


#### 1. 概览

因为 ArrayList 是基于数组实现的，所以支持快速随机访问。RandomAccess 接口标识着该类支持快速随机访问。

```java
public class ArrayList<E> extends AbstractList<E>
        implements List<E>, RandomAccess, Cloneable, java.io.Serializable
```

数组的默认大小为 10。用无参构造函数创建时，elementData 先指向一个长度为 0 的共享空数组，第一次添加元素时才分配长度为 10 的数组。

```java
private static final int DEFAULT_CAPACITY = 10;
```

<div align="center"> <img src="pics/jcol-arraylist.png" width="760px"/> </div><br>

#### 2. 扩容

添加元素时使用 ensureCapacityInternal() 方法来保证容量足够，如果不够时，需要使用 grow() 方法进行扩容，新容量的大小为 `oldCapacity + (oldCapacity >> 1)`，即 oldCapacity+oldCapacity/2。其中 oldCapacity >> 1 需要取整，所以新容量大约是旧容量的 1.5 倍（oldCapacity 为偶数就是 1.5 倍，为奇数就是 1.5 倍减 0.5）。例如依次添加元素时，容量的变化为 0、10、15、22、33（JDK 21 实测，见[附录 A1](#a1-arraylist-的扩容与常见陷阱)）。JDK 21 的 grow() 改为调用 ArraysSupport.newLength() 计算新容量，增长的规则相同。

扩容操作需要调用 `Arrays.copyOf()` 把原数组整个复制到新数组中，这个操作代价很高，因此最好在创建 ArrayList 对象时就指定大概的容量大小，减少扩容操作的次数。

```java
public boolean add(E e) {
    ensureCapacityInternal(size + 1);  // Increments modCount!!
    elementData[size++] = e;
    return true;
}

private void ensureCapacityInternal(int minCapacity) {
    if (elementData == DEFAULTCAPACITY_EMPTY_ELEMENTDATA) {
        minCapacity = Math.max(DEFAULT_CAPACITY, minCapacity);
    }
    ensureExplicitCapacity(minCapacity);
}

private void ensureExplicitCapacity(int minCapacity) {
    modCount++;
    // overflow-conscious code
    if (minCapacity - elementData.length > 0)
        grow(minCapacity);
}

private void grow(int minCapacity) {
    // overflow-conscious code
    int oldCapacity = elementData.length;
    int newCapacity = oldCapacity + (oldCapacity >> 1);
    if (newCapacity - minCapacity < 0)
        newCapacity = minCapacity;
    if (newCapacity - MAX_ARRAY_SIZE > 0)
        newCapacity = hugeCapacity(minCapacity);
    // minCapacity is usually close to size, so this is a win:
    elementData = Arrays.copyOf(elementData, newCapacity);
}
```

#### 3. 删除元素

需要调用 System.arraycopy() 将 index+1 后面的元素都复制到 index 位置上，该操作的时间复杂度为 O(N)，可以看到 ArrayList 删除元素的代价是非常高的。

```java
public E remove(int index) {
    rangeCheck(index);
    modCount++;
    E oldValue = elementData(index);
    int numMoved = size - index - 1;
    if (numMoved > 0)
        System.arraycopy(elementData, index+1, elementData, index, numMoved);
    elementData[--size] = null; // clear to let GC do its work
    return oldValue;
}
```

#### 4. 序列化

保存元素的数组 elementData 用 transient 修饰，不参与默认的序列化。ArrayList 实现了 writeObject() 和 readObject()，只序列化前 size 个实际存放的元素，数组中空闲的位置不写出；反序列化时按 size 而不是原来的容量分配数组。源码见[进阶：序列化](Java%20容器%20-%20进阶.md#序列化)。

#### 5. Fail-Fast

modCount 用来记录 ArrayList 结构发生变化的次数。结构发生变化是指添加或者删除至少一个元素的所有操作，或者是调整内部数组的大小，仅仅只是设置元素的值不算结构发生变化。

在进行序列化或者迭代等操作时，需要比较操作前后 modCount 是否改变，如果改变了需要抛出 ConcurrentModificationException。代码参考[进阶：序列化](Java%20容器%20-%20进阶.md#序列化)中的 writeObject() 方法。

最常见的情况是在 foreach 循环中删除元素。foreach 编译后使用迭代器，list.remove() 改变了 modCount，迭代器下一次调用 next() 时就会抛出异常。应该使用迭代器自己的 remove()，或者 removeIf()：

```java
for (String s : list) {
    if (s.equals("a")) list.remove(s);    // ConcurrentModificationException
}

Iterator<String> it = list.iterator();
while (it.hasNext()) {
    if (it.next().equals("a")) it.remove();
}

list.removeIf(s -> s.equals("a"));
```


### LinkedList

#### 1. 概览

基于双向链表实现，使用 Node 存储链表节点信息。

```java
private static class Node<E> {
    E item;
    Node<E> next;
    Node<E> prev;
}
```

每个链表存储了 first 和 last 指针：

```java
transient Node<E> first;
transient Node<E> last;
```

<div align="center"> <img src="pics/jcol-linkedlist.png" width="760px"/> </div><br>

#### 2. 与 ArrayList 的比较

ArrayList 基于动态数组实现，LinkedList 基于双向链表实现。ArrayList 和 LinkedList 的区别可以归结为数组和链表的区别：

- 数组支持随机访问，但插入删除的代价很高，需要移动大量元素；
- 链表不支持随机访问，但插入删除只需要改变指针。

需要注意的是，链表在中间插入前要先遍历到插入位置，这一步也是 O(N) 的，而且要逐个访问分散在内存中的节点；数组移动元素用的是 System.arraycopy()，一次复制一整块连续内存。例如在 10 万个元素的中间插入 1 万次，ArrayList 约 50 ms，LinkedList 约 0.8～1 秒；只有在头部插入时 LinkedList 才明显更快（JDK 21 实测，见[附录 A1](#a1-arraylist-的扩容与常见陷阱)）。所以大多数场景下应该使用 ArrayList，需要在头尾频繁插入删除时使用 ArrayDeque 或 LinkedList。

### Vector

#### 1. 同步

它的实现与 ArrayList 类似，但是使用了 synchronized 进行同步。

```java
public synchronized boolean add(E e) {
    modCount++;
    ensureCapacityHelper(elementCount + 1);
    elementData[elementCount++] = e;
    return true;
}

public synchronized E get(int index) {
    if (index >= elementCount)
        throw new ArrayIndexOutOfBoundsException(index);

    return elementData(index);
}
```

#### 2. 扩容

Vector 的构造函数可以传入 capacityIncrement 参数，它的作用是在扩容时使容量 capacity 增长 capacityIncrement。如果这个参数的值小于等于 0，扩容时每次都令 capacity 为原来的两倍。

```java
public Vector(int initialCapacity, int capacityIncrement) {
    super();
    if (initialCapacity < 0)
        throw new IllegalArgumentException("Illegal Capacity: "+
                                           initialCapacity);
    this.elementData = new Object[initialCapacity];
    this.capacityIncrement = capacityIncrement;
}
```

```java
private void grow(int minCapacity) {
    // overflow-conscious code
    int oldCapacity = elementData.length;
    int newCapacity = oldCapacity + ((capacityIncrement > 0) ?
                                     capacityIncrement : oldCapacity);
    if (newCapacity - minCapacity < 0)
        newCapacity = minCapacity;
    if (newCapacity - MAX_ARRAY_SIZE > 0)
        newCapacity = hugeCapacity(minCapacity);
    elementData = Arrays.copyOf(elementData, newCapacity);
}
```

调用没有 capacityIncrement 的构造函数时，capacityIncrement 值被设置为 0，也就是说默认情况下 Vector 每次扩容时容量都会翻倍。

```java
public Vector(int initialCapacity) {
    this(initialCapacity, 0);
}

public Vector() {
    this(10);
}
```

#### 3. 与 ArrayList 的比较

- Vector 是同步的，因此开销就比 ArrayList 要大，访问速度更慢。最好使用 ArrayList 而不是 Vector，因为同步操作完全可以由程序员自己来控制；
- Vector 每次扩容请求其大小的 2 倍（也可以通过构造函数设置增长的容量），而 ArrayList 是 1.5 倍。

#### 4. 替代方案

ArrayList 不是线程安全的。JDK 21 的 add() 先读出 size 记为 s，容量不够时扩容，然后写入 elementData[s]，最后把 size 设为 s + 1，这几步之间没有同步：

- 两个线程读到同一个 s，写入同一个位置，一个元素被覆盖，size 也只增加了 1；
- 一个线程扩容后换成了新数组，另一个线程仍然写入旧数组，这次写入丢失，新数组中的这个位置留下 null；
- 一个线程读到的 size 已被其它线程增加到超过它手中旧数组的长度，写入时抛出 ArrayIndexOutOfBoundsException。

例如 8 个线程各添加 10 万个元素，30 轮中 size 在 15 万～58 万之间，大多数轮次中出现了上百到数万个 null，有 3 轮抛出了 ArrayIndexOutOfBoundsException；同样的操作用 Collections.synchronizedList() 每次都是 80 万（JDK 21 实测，见[附录 A3](#a3-arraylist-的并发写入)）。

可以使用 `Collections.synchronizedList();` 得到一个线程安全的 ArrayList。

```java
List<String> list = new ArrayList<>();
List<String> synList = Collections.synchronizedList(list);
```

也可以使用 concurrent 并发包下的 CopyOnWriteArrayList 类。

```java
List<String> list = new CopyOnWriteArrayList<>();
```

### CopyOnWriteArrayList

#### 1. 读写分离

写操作在一个复制的数组上进行，读操作还是在原始数组中进行，读写分离，互不影响。

写操作需要加锁，防止并发写入时导致写入数据丢失。

写操作结束之后需要把原始数组指向新的复制数组。JDK 21 中写操作改为用 synchronized 加锁，过程相同。

```java
public boolean add(E e) {
    final ReentrantLock lock = this.lock;
    lock.lock();
    try {
        Object[] elements = getArray();
        int len = elements.length;
        Object[] newElements = Arrays.copyOf(elements, len + 1);
        newElements[len] = e;
        setArray(newElements);
        return true;
    } finally {
        lock.unlock();
    }
}

final void setArray(Object[] a) {
    array = a;
}
```

```java
@SuppressWarnings("unchecked")
private E get(Object[] a, int index) {
    return (E) a[index];
}
```

#### 2. 适用场景

CopyOnWriteArrayList 在写操作的同时允许读操作，大大提高了读操作的性能，因此很适合读多写少的应用场景。

但是 CopyOnWriteArrayList 有其缺陷：

- 内存占用：在写操作时需要复制一个新的数组，使得内存占用为原来的两倍左右；
- 数据不一致：读操作不能读取实时性的数据，因为部分写操作的数据还未同步到读数组中。

所以 CopyOnWriteArrayList 不适合内存敏感以及对实时性要求很高的场景。

### HashMap 🔥🔥

为了便于理解，以下源码分析以 JDK 1.7 为主。JDK 1.8 主要有以下变化，JDK 21 与 JDK 1.8 相同：

- 数组元素由 Entry 改为 Node，链表长度达到 8 时转为红黑树，见第 8 节；
- 新的键值对插入链表尾部，而不是头部；
- 计算哈希值时只做一次扰动：(h = key.hashCode()) ^ (h >>> 16)，把高 16 位异或到低 16 位，让高位也参与决定桶下标；
- 扩容时不再逐个重新计算桶下标，而是按哈希值新增的那一位把链表拆成两条，分别放在原位置和原位置 + 旧容量，见第 6 节。

#### 1. 存储结构

内部包含了一个 Entry 类型的数组 table。Entry 存储着键值对。它包含了四个字段，从 next 字段可以看出 Entry 是一个链表。即数组中的每个位置被当成一个桶，一个桶存放一个链表。HashMap 使用拉链法来解决冲突，同一个链表中存放哈希值对桶的数量取模结果相同的 Entry。

<div align="center"> <img src="pics/jcol-hashmap.png" width="760px"/> </div><br>

```java
transient Entry[] table;
```

```java
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

    public final K getKey() {
        return key;
    }

    public final V getValue() {
        return value;
    }

    public final V setValue(V newValue) {
        V oldValue = value;
        value = newValue;
        return oldValue;
    }

    public final boolean equals(Object o) {
        if (!(o instanceof Map.Entry))
            return false;
        Map.Entry e = (Map.Entry)o;
        Object k1 = getKey();
        Object k2 = e.getKey();
        if (k1 == k2 || (k1 != null && k1.equals(k2))) {
            Object v1 = getValue();
            Object v2 = e.getValue();
            if (v1 == v2 || (v1 != null && v1.equals(v2)))
                return true;
        }
        return false;
    }

    public final int hashCode() {
        return Objects.hashCode(getKey()) ^ Objects.hashCode(getValue());
    }

    public final String toString() {
        return getKey() + "=" + getValue();
    }
}
```

#### 2. 拉链法的工作原理

```java
HashMap<String, String> map = new HashMap<>();
map.put("K1", "V1");
map.put("K2", "V2");
map.put("K3", "V3");
```

- 新建一个 HashMap，默认大小为 16；
- 插入 &lt;K1,V1\> 键值对，先计算 K1 的 hashCode，为了便于说明，假设为 115（实际上 "K1".hashCode() 是 2374），使用除留余数法得到所在的桶下标 115%16=3；
- 插入 &lt;K2,V2\> 键值对，假设 K2 的 hashCode 为 118，使用除留余数法得到所在的桶下标 118%16=6；
- 插入 &lt;K3,V3\> 键值对，假设 K3 的 hashCode 也为 118，使用除留余数法得到所在的桶下标 118%16=6，插在 &lt;K2,V2\> 前面。

应该注意到链表的插入是以头插法方式进行的，例如上面的 &lt;K3,V3\> 不是插在 &lt;K2,V2\> 后面，而是插入在链表头部。JDK 1.8 改成了尾插法。

查找需要分成两步进行：

- 计算键值对所在的桶；
- 在链表上顺序查找，时间复杂度显然和链表的长度成正比。

<div align="center"> <img src="pics/jcol-chaining.png" width="760px"/> </div><br>

拉链法之外，解决哈希冲突的常见方法还有：

- 开放定址法：冲突时按固定的规则在数组中寻找下一个空位，例如线性探测依次检查下一个位置。JDK 中的 ThreadLocalMap 和 IdentityHashMap 使用线性探测；
- 再哈希法：冲突时换一个哈希函数重新计算位置。

开放定址法的元素都存放在数组中，没有链表节点的开销，但装载因子必须较低，否则探测序列会很长；删除时也不能直接把位置置空，否则会截断其它元素的探测序列，ThreadLocalMap 删除元素后要把后面同一段中的元素重新放置。HashMap 采用拉链法，装载因子可以达到 0.75，删除只需修改链表，冲突严重时还可以把链表转为红黑树。

#### 3. put 操作

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
```

HashMap 允许插入键为 null 的键值对。但是因为无法调用 null 的 hashCode() 方法，也就无法确定该键值对的桶下标，只能通过强制指定一个桶下标来存放。HashMap 使用第 0 个桶存放键为 null 的键值对。

```java
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

使用链表的头插法，也就是新的键值对插在链表的头部，而不是链表的尾部。

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

```java
Entry(int h, K k, V v, Entry<K,V> n) {
    value = v;
    next = n;
    key = k;
    hash = h;
}
```

JDK 1.8 的 put() 调用 putVal()，过程如下：

1. 用 hash() 计算哈希值；table 为空时先调用 resize() 创建数组，数组到第一次 put 时才分配；
2. 用 (n - 1) & hash 计算桶下标，桶为空时直接放入新节点；
3. 桶不为空时，头节点是 TreeNode 就在红黑树中查找或插入，否则遍历链表，找到相同的键就用新值替换旧值并返回旧值，找不到就把新节点接在链表尾部，接上之前链表已有 8 个节点时调用 treeifyBin()，见第 8 节；
4. 新增了节点时 size 加 1，大于 threshold 就调用 resize() 扩容，见第 5、6 节。

判断键相同的条件是哈希值相等，并且两个键是同一个对象或者 equals() 返回 true，所以作为键的类要同时重写 hashCode() 和 equals()。

#### 4. 确定桶下标

很多操作都需要先确定一个键值对所在的桶下标。

```java
int hash = hash(key);
int i = indexFor(hash, table.length);
```

##### 4.1 计算哈希值

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
```

JDK 1.8 简化为一次扰动：

```java
static final int hash(Object key) {
    int h;
    return (key == null) ? 0 : (h = key.hashCode()) ^ (h >>> 16);
}
```

##### 4.2 取模

令 x = 1\<\<4，即 x 为 2 的 4 次方，它具有以下性质：

```text
x   : 00010000
x-1 : 00001111
```

令一个数 y 与 x-1 做与运算，可以去除 y 位级表示的第 4 位以上数：

```text
y       : 10110010
x-1     : 00001111
y&(x-1) : 00000010
```

这个性质和 y 对 x 取模效果是一样的：

```text
y   : 10110010
x   : 00010000
y%x : 00000010
```

位运算的代价比求模运算小得多，因此在进行这种计算时用位运算的话能带来更高的性能。

确定桶下标的最后一步是将 key 的哈希值对桶个数取模：hash%capacity，如果能保证 capacity 为 2 的 n 次方，那么就可以将这个操作转换为位运算。

```java
static int indexFor(int h, int length) {
    return h & (length-1);
}
```

#### 5. 扩容-基本原理

设 HashMap 的 table 长度为 M，需要存储的键值对数量为 N，如果哈希函数满足均匀性的要求，那么每条链表的长度大约为 N/M，因此查找的复杂度为 O(N/M)。

为了让查找的成本降低，应该使 N/M 尽可能小，因此需要保证 M 尽可能大，也就是说 table 要尽可能大。HashMap 采用动态扩容来根据当前的 N 值来调整 M 值，使得空间效率和时间效率都能得到保证。

和扩容相关的参数主要有：capacity、size、threshold 和 load_factor。

| 参数 | 含义 |
| :--: | :-- |
| capacity | table 的容量大小，默认为 16。需要注意的是 capacity 必须保证为 2 的 n 次方。|
| size | 键值对数量。 |
| threshold | size 的临界值。JDK 1.7 中 size 大于等于 threshold、并且要插入的桶不为空时扩容；JDK 1.8 中插入后 size 大于 threshold 时扩容。 |
| loadFactor | 装载因子，table 能够使用的比例，threshold = (int)(capacity* loadFactor)。 |

```java
static final int DEFAULT_INITIAL_CAPACITY = 16;

static final int MAXIMUM_CAPACITY = 1 << 30;

static final float DEFAULT_LOAD_FACTOR = 0.75f;

transient Entry[] table;

transient int size;

int threshold;

final float loadFactor;

transient int modCount;
```

例如默认容量 16、装载因子 0.75 时 threshold 为 12，放入第 13 个键后容量变为 32，放入第 25 个键后变为 64（JDK 21 实测，见[附录 A5](#a5-hashmap-的扩容时机与-hashtable)）。

装载因子取 0.75 是时间和空间的折中（HashMap 的 Javadoc）：调大可以少占内存，但链表变长，查找变慢；调小则扩容更频繁，空着的桶更多。装载因子为 0.75 时，桶中的节点数近似服从参数为 0.5 的泊松分布，约 98.6% 的桶只有 0～2 个节点，见第 8 节。

能预估键的数量时，应该在创建时指定容量，避免多次扩容。需要注意的是，构造函数的参数是容量而不是键数：new HashMap<>(1000) 的容量为 1024、threshold 为 768，放入 1000 个键时仍会扩容一次；JDK 19 起的 HashMap.newHashMap(1000) 按装载因子换算出容量 2048，不再扩容（JDK 21 实测，见[附录 A5](#a5-hashmap-的扩容时机与-hashtable)）。

从下面的添加元素代码中可以看出，当需要扩容时，令 capacity 为原来的两倍。

```java
void addEntry(int hash, K key, V value, int bucketIndex) {
    Entry<K,V> e = table[bucketIndex];
    table[bucketIndex] = new Entry<>(hash, key, value, e);
    if (size++ >= threshold)
        resize(2 * table.length);
}
```

扩容使用 resize() 实现，需要注意的是，扩容操作同样需要把 oldTable 的所有键值对重新插入 newTable 中，因此这一步是很费时的。

```java
void resize(int newCapacity) {
    Entry[] oldTable = table;
    int oldCapacity = oldTable.length;
    if (oldCapacity == MAXIMUM_CAPACITY) {
        threshold = Integer.MAX_VALUE;
        return;
    }
    Entry[] newTable = new Entry[newCapacity];
    transfer(newTable);
    table = newTable;
    threshold = (int)(newCapacity * loadFactor);
}

void transfer(Entry[] newTable) {
    Entry[] src = table;
    int newCapacity = newTable.length;
    for (int j = 0; j < src.length; j++) {
        Entry<K,V> e = src[j];
        if (e != null) {
            src[j] = null;
            do {
                Entry<K,V> next = e.next;
                int i = indexFor(e.hash, newCapacity);
                e.next = newTable[i];
                newTable[i] = e;
                e = next;
            } while (e != null);
        }
    }
}
```

#### 6. 扩容-重新计算桶下标

在进行扩容时，需要把键值对重新计算桶下标，从而放到对应的桶上。在前面提到，HashMap 使用 hash%capacity 来确定桶下标。HashMap capacity 为 2 的 n 次方这一特点能够极大降低重新计算桶下标操作的复杂度。

假设原数组长度 capacity 为 16，扩容之后 new capacity 为 32：

```text
capacity     : 00010000
new capacity : 00100000
```

对于一个 Key，它的哈希值 hash 在第 5 位：

- 为 0，那么 hash%00010000 = hash%00100000，桶位置和原来一致；
- 为 1，hash%00100000 = hash%00010000 + 16，桶位置是原位置 + 16。

JDK 1.8 的 resize() 就利用了这个性质：遍历旧桶中的链表，按 (hash & oldCap) 是否为 0 把节点分到 lo、hi 两条链表，分别放到新数组的 j 和 j + oldCap 位置，链表中节点的相对顺序保持不变。

<div align="center"> <img src="pics/hashmap-resize.png" width="620px"/> </div><br>

#### 7. 计算数组容量

HashMap 构造函数允许传入的容量不是 2 的 n 次方，tableSizeFor() 会把它向上取为大于等于它的最小的 2 的 n 次方，例如传入 17 时容量为 32，传入 16 时仍为 16。这个计算只用移位和或运算，过程见[进阶：计算数组容量](Java%20容器%20-%20进阶.md#计算数组容量)。

#### 8. 链表转红黑树

从 JDK 1.8 开始，向一个桶中添加元素时，如果链表中已经有 8 个节点（TREEIFY_THRESHOLD），会先检查数组长度：小于 64（MIN_TREEIFY_CAPACITY）时只进行扩容，否则把链表转换为红黑树。例如所有键的 hashCode() 都相同时，放入第 9 个键时容量从 16 扩为 32，第 10 个键时扩为 64，第 11 个键时才转为红黑树（JDK 21 实测，见[附录 A4](#a4-hashmap-链表转红黑树)）。数组较小时，冲突多半是桶太少造成的，扩容就能把链表拆开，所以先扩容。

引入红黑树是为了限制最坏情况：hashCode() 分布很差，或者被人故意构造成相同的值时，大量键落在同一个桶中，在链表中查找退化为 O(N)，红黑树则为 O(logN)。

阈值取 8，是因为 hashCode() 足够随机时，一个桶中很难积累 8 个节点：装载因子为 0.75 时，桶中的节点数近似服从参数为 0.5 的泊松分布，一个桶中恰好有 8 个节点的概率约为 0.00000006（HashMap 源码注释）。TreeNode 的大小约为普通节点的两倍，正常情况下用不到它，也就不必付出这部分内存。

红黑树转回链表的阈值是 6 而不是 8，两个阈值之间留出余量，避免节点数在 8 附近增减时反复转换。需要注意的是，6 只用于扩容时拆分树：拆分后的节点数不超过 6 就转回链表。删除节点时按树的形状判断，根节点缺少左子节点或右子节点，或者根的左子节点没有左子节点时，转回链表，例如上面的例子再放入第 12 个键，然后逐个删除，剩 3 个键时才转回链表。

选择红黑树而不是 AVL 树，是因为红黑树只要求大致平衡，插入和删除时需要的旋转更少，适合桶中元素不断增删的场景；代价是红黑树的高度比 AVL 树稍高，查找时多比较的次数很少。B+ 树为磁盘设计，用很大的节点减少读取磁盘的次数，不适合内存中只有几个节点的桶。

#### 9. 与 Hashtable 的比较

- 线程安全：Hashtable 的方法都用 synchronized 修饰，所有操作共用一把锁；HashMap 不加锁，不是线程安全的；
- null：HashMap 允许一个键为 null、任意多个值为 null，Hashtable 的键和值都不能为 null，否则抛出 NullPointerException；
- 容量与下标：HashMap 默认容量 16，每次扩为 2 倍，用位运算计算下标；Hashtable 默认容量 11，每次扩为 2n + 1，用 (hash & 0x7FFFFFFF) % length 取模，也不对 hashCode 做扰动（JDK 21 实测 Hashtable 依次扩为 23、47、95，见[附录 A5](#a5-hashmap-的扩容时机与-hashtable)）；
- 哈希冲突：HashMap 的链表过长时转为红黑树，Hashtable 始终使用链表；
- 迭代：两者 keySet()、values() 等视图的迭代器都是 fail-fast 的，只有 Hashtable 的 keys()、elements() 返回的 Enumeration 不是；
- 顺序：两者都不保证遍历的顺序，并且扩容后顺序可能改变。

Hashtable 是 JDK 1.0 的遗留类，需要线程安全时使用 ConcurrentHashMap。需要按顺序遍历时，按插入顺序用 LinkedHashMap，按键的大小用 TreeMap：TreeMap 基于红黑树，查找和插入为 O(logN)，支持 firstKey()、subMap() 这类按范围的操作；HashMap 平均为 O(1)，不支持这些操作。

#### 10. 线程安全

HashMap 不是线程安全的。例如两个线程同时向同一个空桶插入，都判断桶为空，后写入的会覆盖先写入的；size++ 也不是原子操作。用 8 个线程各插入 10 万个不同的键，HashMap 的 size 每次都不同，例如 111068、323870，远少于 80 万；同样的操作 ConcurrentHashMap 每次都是 800000（JDK 21 实测，见[附录 A2](#a2-hashmap-的并发写入)）。

JDK 1.7 的问题更严重：两个线程同时扩容时，头插法会把链表的顺序反转，可能让链表形成环，之后在这个桶上的 get 会陷入死循环。JDK 1.8 改为尾插法，扩容时保持链表原来的顺序，不会再因为头插法成环，但并发写入仍然会丢失数据；链表转为红黑树时还可能破坏树的结构，实测中出现过线程抛出 ClassCastException，以及线程在 TreeNode.treeify() 中一直循环不返回的情况（见[附录 A2](#a2-hashmap-的并发写入)）。多线程环境应该使用 ConcurrentHashMap。

### ConcurrentHashMap 🔥🔥

第 1、2 节是 JDK 1.7 的实现，JDK 1.8 的改动见第 3 节。

#### 1. 存储结构

<div align="center"> <img src="pics/jcol-chm7.png" width="760px"/> </div><br>

```java
static final class HashEntry<K,V> {
    final int hash;
    final K key;
    volatile V value;
    volatile HashEntry<K,V> next;
}
```

ConcurrentHashMap 和 HashMap 实现上类似，最主要的差别是 ConcurrentHashMap 采用了分段锁（Segment），每个分段锁维护着几个桶（HashEntry），多个线程可以同时访问不同分段锁上的桶，从而使其并发度更高（并发度就是 Segment 的个数）。

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

默认的并发级别为 16，也就是说默认创建 16 个 Segment。

```java
static final int DEFAULT_CONCURRENCY_LEVEL = 16;
```

#### 2. size 操作

每个 Segment 用 count 记录自己的键值对个数，size() 要把所有 Segment 的 count 加起来。它先不加锁统计，相邻两次统计时各 Segment 的 modCount 之和相同，就认为结果正确；不加锁尝试 3 次仍不一致，再对所有 Segment 加锁后统计。源码见[进阶：size 操作](Java%20容器%20-%20进阶.md#size-操作)。

#### 3. JDK 1.8 的改动

JDK 1.7 使用分段锁机制来实现并发更新操作，核心类为 Segment，它继承自重入锁 ReentrantLock，并发度与 Segment 数量相等。

JDK 1.8 去掉了 Segment，和 HashMap 一样使用 Node 数组加链表（或红黑树），锁的粒度缩小到每个桶。put 的过程如下：

1. 用 spread() 计算哈希值，把 hashCode 的高 16 位异或到低 16 位，让高位也参与决定桶下标；
2. 如果桶是空的，用 CAS 把新节点放进去，不加锁。CAS 失败说明有其它线程刚刚放入了节点，重新循环；
3. 如果桶的头节点是 ForwardingNode（哈希值为 MOVED），说明正在扩容，当前线程先帮忙迁移数据；
4. 否则用 synchronized 锁住桶的头节点，在链表或红黑树中插入或更新，链表长度达到 8 时转为红黑树，数组长度小于 64 时则只扩容；
5. 最后更新元素个数。

get 不加锁：数组元素通过 Unsafe 的 volatile 方式读取，节点的 val 和 next 都是 volatile，能读到其它线程写入的最新值。

去掉 Segment 是因为 JDK 1.7 的并发度在创建时由 concurrencyLevel 确定，之后不能改变，默认的 16 个 Segment 最多允许 16 个线程同时写。JDK 1.8 锁住的是单个桶，并发度随扩容增大，两个线程更新不同的键时争用同一把锁的概率约为 1 / (8 × 元素个数)（源码注释）；而且最常见的往空桶中插入只用一次 CAS，不需要加锁。

用 synchronized 锁住头节点，而不是给每个桶配一个 ReentrantLock，源码注释给出的理由是不想为每个桶多分配一个锁对象，用已有的头节点作为锁最省空间。加锁之后还要检查头节点是否仍是原来的节点，因为它可能已经被删除，或者这个桶已经被迁移。

扩容的过程：

1. 元素个数达到 sizeCtl（容量的 0.75 倍）时，一个线程创建 2 倍大小的新数组，开始迁移；
2. 迁移从数组末尾向前进行，每个线程用 CAS 修改 transferIndex，领取一段还没有迁移的桶，每段至少 16 个，不同线程领到的范围不会重叠；
3. 迁移一个桶时锁住它的头节点，按 hash & n 把节点分到新数组的 i 和 i + n 两个位置，与 HashMap 的拆分方法相同，然后在旧桶中放入 ForwardingNode；
4. 所有桶迁移完后，table 指向新数组，sizeCtl 更新为新容量的 0.75 倍。

迁移期间，get 遇到 ForwardingNode 时到新数组中查找，还没有迁移的桶照常在旧数组中读取；put 遇到 ForwardingNode 时先调用 helpTransfer() 领取一段桶帮忙迁移，完成后再到新数组中插入。迁移时创建新的节点，不修改旧节点的 next，所以正在旧链表上遍历的 get 不受影响。

与 JDK 1.7 相比的其它变化：

- 计数：元素个数保存在 baseCount 和一组 CounterCell 中，竞争激烈时不同线程更新不同的 CounterCell，size() 把它们加起来，与 LongAdder 的思路相同。求和时不加锁，其它线程可能正在增减，所以返回的是一个估计值，Javadoc 中也说明并发修改时它与实际个数可能不同；
- 扩容：JDK 1.7 中每个 Segment 在自己的锁内各自扩容；JDK 1.8 中多个线程可以一起迁移整个数组，过程见上文。

需要注意的是，ConcurrentHashMap 的键和值都不能为 null。HashMap 中 get 返回 null 时，可以再用 containsKey 判断是键不存在还是值为 null；在并发环境下，这两次调用之间其它线程可能修改了数据，结果无法确定，所以干脆不允许 null。另外，ConcurrentHashMap 只保证单个操作是原子的，先 get 再 put 这样的组合操作仍然要用 putIfAbsent、compute 等原子方法。

### LinkedHashMap

#### 存储结构

继承自 HashMap，因此具有和 HashMap 一样的快速查找特性。

```java
public class LinkedHashMap<K,V> extends HashMap<K,V> implements Map<K,V>
```

内部维护了一个双向链表，用来维护插入顺序或者 LRU 顺序。

```java
/**
 * The head (eldest) of the doubly linked list.
 */
transient LinkedHashMap.Entry<K,V> head;

/**
 * The tail (youngest) of the doubly linked list.
 */
transient LinkedHashMap.Entry<K,V> tail;
```

accessOrder 决定了顺序，默认为 false，此时维护的是插入顺序。

```java
final boolean accessOrder;
```

LinkedHashMap 最重要的是以下用于维护顺序的函数，它们会在 put、get 等方法中调用。

```java
void afterNodeAccess(Node<K,V> p) { }
void afterNodeInsertion(boolean evict) { }
```

#### afterNodeAccess()

当一个节点被访问时，如果 accessOrder 为 true，则会将该节点移到链表尾部。也就是说指定为 LRU 顺序之后，在每次访问一个节点时，会将这个节点移到链表尾部，保证链表尾部是最近访问的节点，那么链表首部就是最近最久未使用的节点。

```java
void afterNodeAccess(Node<K,V> e) { // move node to last
    LinkedHashMap.Entry<K,V> last;
    if (accessOrder && (last = tail) != e) {
        LinkedHashMap.Entry<K,V> p =
            (LinkedHashMap.Entry<K,V>)e, b = p.before, a = p.after;
        p.after = null;
        if (b == null)
            head = a;
        else
            b.after = a;
        if (a != null)
            a.before = b;
        else
            last = b;
        if (last == null)
            head = p;
        else {
            p.before = last;
            last.after = p;
        }
        tail = p;
        ++modCount;
    }
}
```

#### afterNodeInsertion()

在 put 等操作之后执行，当 removeEldestEntry() 方法返回 true 时会移除最老的节点，也就是链表首部节点 first。

evict 只有在构建 Map 的时候才为 false，在这里为 true。

```java
void afterNodeInsertion(boolean evict) { // possibly remove eldest
    LinkedHashMap.Entry<K,V> first;
    if (evict && (first = head) != null && removeEldestEntry(first)) {
        K key = first.key;
        removeNode(hash(key), key, null, false, true);
    }
}
```

removeEldestEntry() 默认为 false，如果需要让它为 true，需要继承 LinkedHashMap 并且覆盖这个方法的实现，这在实现 LRU 的缓存中特别有用，通过移除最近最久未使用的节点，从而保证缓存空间足够，并且缓存的数据都是热点数据。

```java
protected boolean removeEldestEntry(Map.Entry<K,V> eldest) {
    return false;
}
```

#### LRU 缓存

以下是使用 LinkedHashMap 实现的一个 LRU 缓存：

- 设定最大缓存空间 MAX_ENTRIES 为 3；
- 使用 LinkedHashMap 的构造函数将 accessOrder 设置为 true，开启 LRU 顺序；
- 覆盖 removeEldestEntry() 方法实现，在节点多于 MAX_ENTRIES 就会将最近最久未使用的数据移除。

```java
class LRUCache<K, V> extends LinkedHashMap<K, V> {
    private static final int MAX_ENTRIES = 3;

    protected boolean removeEldestEntry(Map.Entry eldest) {
        return size() > MAX_ENTRIES;
    }

    LRUCache() {
        super(MAX_ENTRIES, 0.75f, true);
    }
}
```

```java
public static void main(String[] args) {
    LRUCache<Integer, String> cache = new LRUCache<>();
    cache.put(1, "a");
    cache.put(2, "b");
    cache.put(3, "c");
    cache.get(1);
    cache.put(4, "d");
    System.out.println(cache.keySet());
}
```

```text
[3, 1, 4]
```

### WeakHashMap

#### 存储结构

WeakHashMap 的 Entry 继承自 WeakReference，键被 WeakReference 关联，没有其它强引用时，键在下一次垃圾收集时会被回收，对应的 Entry 随后从 Map 中清除。

WeakHashMap 主要用来实现缓存，通过使用 WeakHashMap 来引用缓存对象，由 JVM 对这部分缓存进行回收。

```java
private static class Entry<K,V> extends WeakReference<Object> implements Map.Entry<K,V>
```

Tomcat 的 ConcurrentCache 就是这样用的：常用的对象放在 ConcurrentHashMap 中，不常用的对象放在 WeakHashMap 中，由垃圾收集器回收，实现见[进阶：ConcurrentCache](Java%20容器%20-%20进阶.md#concurrentcache)。


## 附录：实测

以下实验的环境为 Apple M1 Pro（10 核）、macOS，JDK 为 Adoptium OpenJDK 21.0.13。

### A1 ArrayList 的扩容与常见陷阱

用反射读取 elementData 的长度，运行时需要加上 --add-opens java.base/java.util=ALL-UNNAMED：

```java
Field f = ArrayList.class.getDeclaredField("elementData");
f.setAccessible(true);
ArrayList<String> list = new ArrayList<>();
for (int i = 1; i <= 23; i++) {
    list.add("e" + i);
    int cap = ((Object[]) f.get(list)).length;    // 容量变化时打印
}
```

```text
new ArrayList<>()：容量 0
添加第 1 个元素后：容量 10，size 1
添加第 11 个元素后：容量 15，size 11
添加第 16 个元素后：容量 22，size 16
添加第 23 个元素后：容量 33，size 23
```

正文中 foreach 删除元素和 Arrays.asList() 的几种用法：

```text
foreach 中 remove：ConcurrentModificationException
Iterator.remove：[b, c]
removeIf：[b, c]
asList set：[10, 2, 3]
asList add：UnsupportedOperationException
修改数组后 list：[100, 2, 3]
Arrays.asList(int[]).size()：1
```

ArrayList 与 LinkedList 的插入：先放入 10 万个元素，再执行 list.add(list.size() / 2, i) 1 万次；另外从空列表开始执行 list.add(0, i) 10 万次：

```text
round 0: 10 万个元素中间插入 1 万次 ArrayList 51 ms，LinkedList 844 ms；头部插入 10 万次 ArrayList 445 ms，LinkedList 2 ms
round 1: 10 万个元素中间插入 1 万次 ArrayList 47 ms，LinkedList 1029 ms；头部插入 10 万次 ArrayList 441 ms，LinkedList 3 ms
round 2: 10 万个元素中间插入 1 万次 ArrayList 47 ms，LinkedList 831 ms；头部插入 10 万次 ArrayList 441 ms，LinkedList 0 ms
```

### A2 HashMap 的并发写入

8 个线程各插入 10 万个不同的键（线程 t 插入 t × 100000 到 t × 100000 + 99999），结束后查看 size：

```java
for (int t = 0; t < 8; t++) {
    int base = t * 100_000;
    pool.submit(() -> { for (int i = 0; i < 100_000; i++) map.put(base + i, i); });
}
```

```text
HashMap size=111068  ConcurrentHashMap size=800000
HashMap size=323870  ConcurrentHashMap size=800000
HashMap size=732440  ConcurrentHashMap size=800000
```

改用守护线程，每轮最多等待 10 秒，记录没有结束的线程停在哪里。两次运行的输出（节选）：

```text
Exception in thread "putter-6" java.lang.ClassCastException: class java.util.HashMap$Node cannot be cast to class java.util.HashMap$TreeNode
	at java.base/java.util.HashMap$TreeNode.moveRootToFront(HashMap.java:1994)
	at java.base/java.util.HashMap$TreeNode.treeify(HashMap.java:2110)
	at java.base/java.util.HashMap.treeifyBin(HashMap.java:778)
run 0: size=278394 stuckThreads=0

run 0: size=263620 stuckThreads=4
  putter-4 at java.base/java.util.HashMap$TreeNode.treeify(HashMap.java:2107) / java.base/java.util.HashMap$TreeNode.split(HashMap.java:2339)
```

### A3 ArrayList 的并发写入

8 个线程各向同一个 ArrayList 添加 10 万个元素，捕获 add() 抛出的异常，结束后统计 size 和 null 元素的个数，共 30 轮：

```java
for (int t = 0; t < 8; t++) {
    ts[t] = new Thread(() -> {
        for (int i = 0; i < 100_000; i++) {
            try { list.add(i); } catch (Exception e) { errors.incrementAndGet(); }
        }
    });
    ts[t].start();
}
```

```text
round 0: size=155642，null 元素 5540，异常 1 次 [ArrayIndexOutOfBoundsException]
round 1: size=160142，null 元素 768，异常 0 次 []
round 2: size=295557，null 元素 40378，异常 0 次 []
……
round 19: size=584393，null 元素 0，异常 0 次 []
round 21: size=379448，null 元素 17821，异常 1 次 [ArrayIndexOutOfBoundsException]
round 24: size=373831，null 元素 5434，异常 1 次 [ArrayIndexOutOfBoundsException]
round 29: size=541149，null 元素 91379，异常 0 次 []
synchronizedList: size=800000
```

### A4 HashMap 链表转红黑树

Key 的 hashCode() 都返回 42，并实现了 Comparable。每次放入或删除后，用反射查看数组的长度和 42 号桶中头节点的类型，运行时需要加上 --add-opens java.base/java.util=ALL-UNNAMED：

```java
record Key(int id) implements Comparable<Key> {
    @Override public int hashCode() { return 42; }
    @Override public int compareTo(Key o) { return Integer.compare(id, o.id); }
}

HashMap<Key, Integer> map = new HashMap<>();
for (int i = 1; i <= 12; i++) map.put(new Key(i), i);      // 每次放入后打印
for (int i = 12; i >= 1; i--) map.remove(new Key(i));      // 每次删除后打印
```

只打印了发生变化的行：

```text
放入第 1 个键后：容量 16，桶中节点类型 Node
放入第 9 个键后：容量 32，桶中节点类型 Node
放入第 10 个键后：容量 64，桶中节点类型 Node
放入第 11 个键后：容量 64，桶中节点类型 TreeNode
删除后剩 3 个键：容量 64，桶中节点类型 Node
```

扩容拆分树：容量 64 时放入 10 个哈希值为 42 或 106 的键（各 5 个），它们都在 42 号桶中，组成红黑树；再放入其它键触发扩容，容量变为 128 后它们分到 42 和 106 两个桶，每个桶 5 个节点，都转回了链表：

```text
容量 64：42 号桶 TreeNode
扩容到 128 后：42 号桶 Node，106 号桶 Node
```

源码注释中的泊松分布概率 e<sup>-0.5</sup> × 0.5<sup>k</sup> / k!，按 k = 0～8 计算：

```text
0 0.60653066
1 0.30326533
2 0.07581633
3 0.01263606
4 0.00157951
5 0.00015795
6 0.00001316
7 0.00000094
8 0.00000006
```

### A5 HashMap 的扩容时机与 Hashtable

用反射读取 table 的长度和 threshold，运行时需要加上 --add-opens java.base/java.util=ALL-UNNAMED。依次放入 Integer 键，只打印容量变化的行；再分别用 new HashMap<>(n) 和 HashMap.newHashMap(n) 放入 n 个键，统计扩容次数：

```java
HashMap<Integer, Integer> m = new HashMap<>();
for (int i = 1; i <= 25; i++) m.put(i, i);              // 容量变化时打印

HashMap<Integer, Integer> a = new HashMap<>(1000);       // 放入 1000 个键，记录容量变化的次数
HashMap<Integer, Integer> b = HashMap.newHashMap(1000);

Hashtable<Integer, Integer> h = new Hashtable<>();
for (int i = 1; i <= 40; i++) h.put(i, i);              // 容量变化时打印
h.put(null, 1);
h.put(1, null);
```

```text
new HashMap<>()：容量 0，threshold 0
放入第 1 个键后：容量 16，threshold 12
放入第 13 个键后：容量 32，threshold 24
放入第 25 个键后：容量 64，threshold 48
放入 12 个键：new HashMap<>(12) 最终容量 16，期间扩容 0 次；HashMap.newHashMap(12) 最终容量 16，期间扩容 0 次
放入 1000 个键：new HashMap<>(1000) 最终容量 2048，期间扩容 1 次；HashMap.newHashMap(1000) 最终容量 2048，期间扩容 0 次
new Hashtable<>()：容量 11
Hashtable 放入第 9 个键后：容量 23
Hashtable 放入第 18 个键后：容量 47
Hashtable 放入第 36 个键后：容量 95
Hashtable put(null, 1)：NullPointerException
Hashtable put(1, null)：NullPointerException
HashMap 放入 null 键和 null 值：{null=v, k=null}
```

## 参考资料

- Eckel B. Java 编程思想 [M]. 机械工业出版社, 2002.
- [Java Collection Framework](https://www.w3resource.com/java-tutorial/java-collections.php)
- [Iterator 模式](https://openhome.cc/Gossip/DesignPattern/IteratorPattern.htm)
- [Java 8 系列之重新认识 HashMap](https://tech.meituan.com/java_hashmap.html)
- [What is difference between HashMap and Hashtable in Java?](http://javarevisited.blogspot.hk/2010/10/difference-between-hashmap-and.html)
- [The principle of ConcurrentHashMap analysis](http://www.programering.com/a/MDO3QDNwATM.html)
- [探索 ConcurrentHashMap 高并发性的实现机制](https://www.ibm.com/developerworks/cn/java/java-lo-concurrenthashmap/)
- [HashMap 相关面试题及其解答](https://www.jianshu.com/p/75adf47958a7)
- [HashMap (Java SE 21)](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/HashMap.html)
- [Hashtable (Java SE 21)](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/Hashtable.html)
- [ConcurrentHashMap (Java SE 21)](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/concurrent/ConcurrentHashMap.html)
- [JDK 21 源码：ConcurrentHashMap.java](https://github.com/openjdk/jdk21u/blob/master/src/java.base/share/classes/java/util/concurrent/ConcurrentHashMap.java)
- [Java 集合细节（二）：asList 的缺陷](http://wiki.jikexueyuan.com/project/java-enhancement/java-thirtysix.html)
- [Java Collection Framework – The LinkedList Class](https://javaconceptoftheday.com/java-collection-framework-linkedlist-class/)
- [JDK 21 源码：HashMap.java](https://github.com/openjdk/jdk21u/blob/master/src/java.base/share/classes/java/util/HashMap.java)
- [JDK 21 源码：ArrayList.java](https://github.com/openjdk/jdk21u/blob/master/src/java.base/share/classes/java/util/ArrayList.java)
- [JDK 21 源码：ThreadLocal.java](https://github.com/openjdk/jdk21u/blob/master/src/java.base/share/classes/java/lang/ThreadLocal.java)
- [JDK 8 源码 java.util](https://github.com/openjdk/jdk8u/tree/master/jdk/src/share/classes/java/util)
- [Java SE 21 API: Arrays.asList](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/Arrays.html#asList(T...))
- [Java SE 21 API: ArrayDeque](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/ArrayDeque.html)
