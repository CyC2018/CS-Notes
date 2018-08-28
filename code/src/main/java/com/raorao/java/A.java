package com.raorao.java;

import io.netty.buffer.ByteBuf;
import java.nio.ByteBuffer;
import java.nio.ByteOrder;
import java.util.Arrays;

/**
 * .
 *
 * @author Xiong Raorao
 * @since 2018-08-10-23:27
 */
public class A {

  public static void main(String[] args) {
    ByteBuffer bb = ByteBuffer.wrap(new byte[12]);

    bb.asCharBuffer().put("abcdef");
    System.out.println(Arrays.toString(bb.array()));

    // 反转缓冲区
    bb.rewind();
    // 设置字节存储次序
    bb.order(ByteOrder.BIG_ENDIAN);
    bb.asCharBuffer().put("abcdef");
    System.out.println(Arrays.toString(bb.array()));

    // 反转缓冲区
    bb.rewind();
    // 设置字节存储次序
    bb.order(ByteOrder.LITTLE_ENDIAN);
    bb.asCharBuffer().put("abcdef");
    System.out.println(Arrays.toString(bb.array()));
  }
}
