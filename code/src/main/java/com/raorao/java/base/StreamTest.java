package com.raorao.java.base;


import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.Random;
import java.util.function.Supplier;
import java.util.stream.Collectors;
import java.util.stream.Stream;

/**
 * java 8 Stream.
 *
 * @author Xiong Raorao
 * @since 2018-08-06-17:29
 */
public class StreamTest {

  public static void main(String[] args) {
    Stream<String> stream = Stream.of("a", "b", "c");
    List<String> list = Arrays.asList("hello", "world");
    List<Integer> intList = Arrays.asList(1, 3, 12, 4, 8, 9, -1);

    // 大写
    List<String> uppercase = list.stream().map(String::toUpperCase)
        .collect(Collectors.toList()); // 类实例的方法引用，没有传入参数
    List<String> uppercase2 = list.stream().map((e) -> e + "a").collect(Collectors.toList());
    uppercase.forEach(System.out::println);
    uppercase2.forEach(System.out::println);

    // 平方数
    List<Integer> square = intList.stream().map((e) -> e * e).collect(Collectors.toList());
    square.forEach((e) -> System.out.print(e + " "));
    System.out.println();

    // 一对多
    Stream<List<Integer>> inputStream = Stream.of(
        Arrays.asList(1),
        Arrays.asList(2, 3),
        Arrays.asList(4, 5, 6)
    );
    Stream<Integer> outputStream = inputStream.
        flatMap((childList) -> childList.stream());
    outputStream.forEach(e -> System.out.print(e + " "));

    // 过滤器
    // 1. 选择偶数
    List<Integer> evenNumber = intList.stream().filter(e -> e % 2 == 0)
        .collect(Collectors.toList());
    evenNumber.forEach((e) -> System.out.print(e + " "));
    System.out.println();

    // 2. find first
    //intList = new ArrayList<>();
    Optional<Integer> first = intList.stream().findFirst();
    System.out.println(first.orElse(0));

    /**
     * reduce, 组合元素。
     * 它提供一个起始值（种子），然后依照运算规则（BinaryOperator），
     * 和前面 Stream 的第一个、第二个、第 n 个元素组合。从这个意义上说，字符串拼接、数值的 sum、min、max、average 都是特殊的 reduce。
     */
    // 1. 字符串拼接
    //Optional<String> ss = stream.reduce((a, b) -> a + b);
    //System.out.println(ss.orElse(null));
    String s2 = stream.reduce("", (a, b) -> a +  "-" + b );
    System.out.println(s2);

    // 2. 数值相加
    Optional<Integer> sum = intList.stream().reduce((a, b) -> a + b);
    System.out.println(sum.orElse(0));

    // 3. min
    int min = intList.stream().mapToInt(e -> e).min().getAsInt();
    System.out.println("min: " + min);

    // 自己生成流
    Stream.iterate(0, n -> n + 3).limit(10).forEach((e) -> System.out.print(e + " "));
    // 生成随机数
    Random seed = new Random();
    Supplier<Integer> random = seed::nextInt;
    Stream.generate(random).limit(10).forEach(System.out::println);

  }

}
