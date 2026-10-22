```markdown
# Leetcode 题解 - 哈希表

哈希表以 O(N) 的空间复杂度存储数据，并且可以在 O(1) 的时间复杂度内进行查找和操作，使其在解决许多编程问题时非常高效。

在 Java 中，**HashSet** 用于存储唯一的元素集合，能够快速地检查某个元素是否存在于集合中。如果要处理的元素是有限且范围较小的，例如仅小写字母（26 个字母），则可以使用一个长度为 26 的布尔数组来表示每个字母的存在性，这样可以将空间复杂度降低到 O(1)。

**HashMap** 则主要用于存储键值对，可以有效地建立元素之间的映射关系。利用 HashMap 进行计数统计时，键是元素，值是计数。在某些场景中还可以利用 HashMap 来实现内容的压缩及其他转换。比如在简化 URL 的系统中，可以通过 HashMap 存储简化后的 URL 和原始 URL 的映射，以便在展示简化 URL 的同时，能够根据简化 URL 找到原始 URL。

## 1. 数组中两个数的和为给定值

题目：**Two Sum (简单)**

[Leetcode](https://leetcode.com/problems/two-sum/description/) / [力扣](https://leetcode-cn.com/problems/two-sum/description/)

解决这个问题的一个有效方法是使用一个 HashMap 存储数组元素与其索引的映射。在遍历数组时，我们可以通过判断 HashMap 中是否存在 `target - nums[i]` 来找到所需的两个数。该方法的时间复杂度为 O(N)，空间复杂度为 O(N)，利用空间换取时间可以有效提高性能。

```java
public int[] twoSum(int[] nums, int target) {
    HashMap<Integer, Integer> indexForNum = new HashMap<>(); // 创建 HashMap 存储元素及索引
    for (int i = 0; i < nums.length; i++) {
        // 检查是否存在 target - 当前元素
        if (indexForNum.containsKey(target - nums[i])) {
            return new int[]{indexForNum.get(target - nums[i]), i}; // 找到目标值的两个索引
        } else {
            indexForNum.put(nums[i], i); // 将当前元素及索引存入 HashMap
        }
    }
    return null; // 若未找到，则返回 null
}
```

## 2. 判断数组是否含有重复元素

题目：**Contains Duplicate (简单)**

[Leetcode](https://leetcode.com/problems/contains-duplicate/description/) / [力扣](https://leetcode-cn.com/problems/contains-duplicate/description/)

利用 HashSet 的特性，我们可以快速地判断数组中是否含有重复元素。当我们将一个元素加入到 HashSet 中时，如果该元素已存在，添加操作会失败。通过检查集合的大小与数组长度，我们就可以快速得出数组中是否含有重复元素。

```java
public boolean containsDuplicate(int[] nums) {
    Set<Integer> set = new HashSet<>(); // 创建一个 HashSet 存储唯一元素
    for (int num : nums) {
        set.add(num); // 尝试添加元素
    }
    return set.size() < nums.length; // 如果集合大小小于数组长度，则表示有重复元素
}
```

## 3. 最长和谐序列

题目：**Longest Harmonious Subsequence (简单)**

[Leetcode](https://leetcode.com/problems/longest-harmonious-subsequence/description/) / [力扣](https://leetcode-cn.com/problems/longest-harmonious-subsequence/description/)

在一个和谐序列中，序列的最大数与最小数之差必须为 1。因此我们可以使用 HashMap 来记录数组中每个元素的出现次数，再通过遍历 HashMap 来查找所有和谐序列的长度。

```java
public int findLHS(int[] nums) {
    Map<Integer, Integer> countForNum = new HashMap<>(); // 存储每个元素的频率
    for (int num : nums) {
        countForNum.put(num, countForNum.getOrDefault(num, 0) + 1); // 统计每个元素的出现次数
    }
    int longest = 0; // 用于记录最长和谐序列的长度
    for (int num : countForNum.keySet()) {
        // 检查是否存在 num + 1
        if (countForNum.containsKey(num + 1)) {
            longest = Math.max(longest, countForNum.get(num) + countForNum.get(num + 1)); // 更新最长和谐序列长度
        }
    }
    return longest; // 返回最长和谐序列的长度
}
```

## 4. 最长连续序列

题目：**Longest Consecutive Sequence (困难)**

[Leetcode](https://leetcode.com/problems/longest-consecutive-sequence/description/) / [力扣](https://leetcode-cn.com/problems/longest-consecutive-sequence/description/)

此问题要求在 O(N) 的时间复杂度下求解。我们可以使用 HashMap 存储每个元素，同时通过递归检测每个元素的连续序列的长度。

```java
public int longestConsecutive(int[] nums) {
    Map<Integer, Integer> countForNum = new HashMap<>(); // 存储每个数的出现情况
    for (int num : nums) {
        countForNum.put(num, 1); // 初始化每个元素的初始长度为 1
    }
    for (int num : nums) {
        // 向前查找并更新连续序列的长度
        forward(countForNum, num);
    }
    return maxCount(countForNum); // 返回最大长度
}

private int forward(Map<Integer, Integer> countForNum, int num) {
    if (!countForNum.containsKey(num)) {
        return 0; // 如果当前数字不在 map 中，返回 0
    }
    int cnt = countForNum.get(num); // 获取当前数字的连续计数
    if (cnt > 1) {
        return cnt; // 如果计数大于 1，直接返回
    }
    // 向前递归查找连续数字的长度并更新计数
    cnt = forward(countForNum, num + 1) + 1;
    countForNum.put(num, cnt); // 更新当前数字的计数
    return cnt; // 返回当前数字的计数
}

private int maxCount(Map<Integer, Integer> countForNum) {
    int max = 0; // 最大连续序列长度
    for (int num : countForNum.keySet()) {
        max = Math.max(max, countForNum.get(num)); // 更新最大于当前最大值
    }
    return max; // 返回最大长度
}
```

以上是针对常见哈希表相关问题的详细解答。希望这些示例和解释能帮助您更好地理解哈希表的使用以及如何在实际问题中应用它们。
```