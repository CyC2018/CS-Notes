```markdown
# Leetcode 题解 - 排序

## 快速选择

快速选择是一种用于解决 **第 K 个元素** 问题的算法，即在给定的数组中寻找第 K 大或第 K 小的元素。它的实现方式类似于快速排序的 partition 方法。为了避免最坏情况下的时间复杂度达到 O(N<sup>2</sup>)，我们需要在每次选择基准元素时打乱输入数组。

## 堆

堆是一种特殊的树形数据结构，常用于解决 **Top K 元素** 问题，即从一组数据中找到前 K 个最小或最大元素。

### 1. Kth Element

215. Kth Largest Element in an Array (Medium)

[Leetcode](https://leetcode.com/problems/kth-largest-element-in-an-array/description/) / [力扣](https://leetcode-cn.com/problems/kth-largest-element-in-an-array/description/)

### 示例

```text
输入: [3,2,1,5,6,4] 和 k = 2
输出: 5
```

题目描述：找到数组中倒数第 K 个元素。

#### 解法一：排序

我们可以使用排序来解决这个问题，时间复杂度为 O(N log N)，空间复杂度为 O(1)。

```java
public int findKthLargest(int[] nums, int k) {
    Arrays.sort(nums);
    return nums[nums.length - k]; // 返回倒数第 K 个元素
}
```

#### 解法二：堆

我们也可以使用堆来找寻倒数第 K 个元素，时间复杂度为 O(N log K)，空间复杂度为 O(K)。

```java
import java.util.PriorityQueue;

public int findKthLargest(int[] nums, int k) {
    PriorityQueue<Integer> pq = new PriorityQueue<>(); // 小顶堆
    for (int val : nums) {
        pq.add(val); // 将元素添加到堆中
        if (pq.size() > k)  // 如果堆大小大于 K，移除堆顶元素
            pq.poll();
    }
    return pq.peek(); // 堆顶元素即为第 K 大元素
}
```

#### 解法三：快速选择

快速选择算法的时间复杂度为 O(N)，空间复杂度为 O(1)。

```java
public int findKthLargest(int[] nums, int k) {
    k = nums.length - k; // 转换为寻找第 K 小元素
    int left = 0, right = nums.length - 1;
    while (left < right) {
        int pivotIndex = partition(nums, left, right);
        if (pivotIndex == k) {
            break; // 找到第 K 小元素
        } else if (pivotIndex < k) {
            left = pivotIndex + 1; // 搜索右子数组
        } else {
            right = pivotIndex - 1; // 搜索左子数组
        }
    }
    return nums[k]; // 返回第 K 小元素
}

// 分区函数
private int partition(int[] arr, int left, int right) {
    int pivot = arr[left]; // 选择第一个元素作为基准
    int i = left, j = right + 1; // i 从左边，j 从右边
    while (true) {
        while (i < right && arr[++i] < pivot); // 找到大于或等于基准的元素
        while (j > left && arr[--j] > pivot); // 找到小于或等于基准的元素
        if (i >= j) break; // i 和 j 交叉，停止分区
        swap(arr, i, j); // 交换找到的两个元素
    }
    swap(arr, left, j); // 将基准元素放到正确的位置
    return j; // 返回基准元素的最终位置
}

private void swap(int[] arr, int i, int j) {
    int temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp; // 交换数组中的两个元素
}
```

## 桶排序

### 1. 出现频率最多的 k 个元素

347. Top K Frequent Elements (Medium)

[Leetcode](https://leetcode.com/problems/top-k-frequent-elements/description/) / [力扣](https://leetcode-cn.com/problems/top-k-frequent-elements/description/)

### 示例

```text
给定数组 [1,1,1,2,2,3] 和 k = 2，返回 [1,2]。
```

我们可以使用桶排序的策略，设置多个桶，每个桶存放具有相同频率的元素。桶的索引对应频率。通过遍历桶，我们可以在 O(N) 的时间内获取到出现频率最高的 k 个元素。

```java
import java.util.*;

public int[] topKFrequent(int[] nums, int k) {
    Map<Integer, Integer> frequencyMap = new HashMap<>();
    for (int num : nums) {
        frequencyMap.put(num, frequencyMap.getOrDefault(num, 0) + 1); // 记录每个数字的频率
    }
    
    List<Integer>[] buckets = new ArrayList[nums.length + 1]; // 创建桶
    for (int key : frequencyMap.keySet()) {
        int frequency = frequencyMap.get(key);
        if (buckets[frequency] == null) {
            buckets[frequency] = new ArrayList<>();
        }
        buckets[frequency].add(key); // 将数字放入对应频率的桶中
    }
    
    List<Integer> topK = new ArrayList<>();
    for (int i = buckets.length - 1; i >= 0 && topK.size() < k; i--) {
        if (buckets[i] != null) {
            topK.addAll(buckets[i].subList(0, Math.min(k - topK.size(), buckets[i].size())));
        }
    }

    return topK.stream().mapToInt(i -> i).toArray(); // 返回 top K 元素的数组
}
```

### 2. 按照字符出现次数对字符串排序

451. Sort Characters By Frequency (Medium)

[Leetcode](https://leetcode.com/problems/sort-characters-by-frequency/description/) / [力扣](https://leetcode-cn.com/problems/sort-characters-by-frequency/description/)

### 示例

```text
输入: "tree"
输出: "eert"
```

在这个问题中，我们同样可以使用桶排序的想法来实现。我们首先获取每个字符的频率，然后将它们根据频率进行排序。

```java
import java.util.*;

public String frequencySort(String s) {
    Map<Character, Integer> frequencyMap = new HashMap<>();
    for (char c : s.toCharArray()) {
        frequencyMap.put(c, frequencyMap.getOrDefault(c, 0) + 1); // 记录每个字符频率
    }

    List<Character>[] frequencyBuckets = new ArrayList[s.length() + 1]; // 创建频率桶
    for (char c : frequencyMap.keySet()) {
        int freq = frequencyMap.get(c);
        if (frequencyBuckets[freq] == null) {
            frequencyBuckets[freq] = new ArrayList<>();
        }
        frequencyBuckets[freq].add(c); // 将字符放入对应频率的桶中
    }

    StringBuilder sortedString = new StringBuilder();
    for (int i = frequencyBuckets.length - 1; i >= 0; i--) {
        if (frequencyBuckets[i] != null) {
            for (char c : frequencyBuckets[i]) {
                for (int j = 0; j < i; j++) { // 频率 i 的字符出现 i 次
                    sortedString.append(c);
                }
            }
        }
    }
    return sortedString.toString(); // 返回排序后的字符串
}
```

## 荷兰国旗问题

荷兰国旗问题涉及三种颜色的元素。该算法旨在将这些元素按颜色从小到大排列。通过三向切分的快速排序，我们能有效的将数组分为小于、等于和大于基准元素的三个部分。

### 1. 按颜色进行排序

75. Sort Colors (Medium)

[Leetcode](https://leetcode.com/problems/sort-colors/description/) / [力扣](https://leetcode-cn.com/problems/sort-colors/description/)

### 示例

```text
输入: [2,0,2,1,1,0]
输出: [0,0,1,1,2,2]
```

我们的目标是将含有 0、1、2 的数组进行排序。我们使用双指针的方法来完成这个任务。

```java
public void sortColors(int[] nums) {
    int zeroIndex = -1; // 记录 0 的位置
    int oneIndex = 0;   // 当前处理的元素索引
    int twoIndex = nums.length; // 记录 2 的位置

    while (oneIndex < twoIndex) {
        if (nums[oneIndex] == 0) {
            swap(nums, ++zeroIndex, oneIndex++); // 0 移到前面
        } else if (nums[oneIndex] == 2) {
            swap(nums, --twoIndex, oneIndex); // 2 移到后面
        } else {
            oneIndex++; // 处理 1，不做交换
        }
    }
}

private void swap(int[] nums, int i, int j) {
    int temp = nums[i];
    nums[i] = nums[j];
    nums[j] = temp; // 交换 nums[i] 和 nums[j]
}
```

这个方法能在 O(N) 的时间复杂度内完成排序，并且只需要 O(1) 的额外空间。
```