package com.raorao.java.io.nio;

import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.net.InetSocketAddress;
import java.net.ServerSocket;
import java.nio.ByteBuffer;
import java.nio.channels.FileChannel;
import java.nio.channels.SelectionKey;
import java.nio.channels.Selector;
import java.nio.channels.ServerSocketChannel;
import java.nio.channels.SocketChannel;
import java.util.Iterator;
import java.util.Set;

/**
 * NIO 应用类.
 *
 * @author Xiong Raorao
 * @since 2018-08-07-10:02
 */
public class NIOMain {

  public static void main(String[] args) throws IOException {
    //fastCopy("E:\\test.mkv", "D:\\test.mkv");
    selector();
  }

  public static void fastCopy(String src, String dst) throws IOException {
    FileInputStream fin = new FileInputStream(src);      /* 获取源文件的输入字节流 */
    FileChannel fcin = fin.getChannel();                 /* 获取输入字节流的文件通道 */
    FileOutputStream fout = new FileOutputStream(dst);  /* 获取目标文件的输出字节流 */
    FileChannel fcout = fout.getChannel();               /* 获取输出字节流的通道 */
    ByteBuffer buffer = ByteBuffer.allocateDirect(1024); /* 为缓冲区分配 1024 个字节 */
    while (true) {
      int r = fcin.read(buffer);                       /* 从输入通道中读取数据到缓冲区中 */
      if (r == -1) {                                   /* read() 返回 -1 表示 EOF */
        break;
      }
      buffer.flip();                                   /* 切换读写 */
      fcout.write(buffer);                             /* 把缓冲区的内容写入输出文件中 */
      buffer.clear();                                  /* 清空缓冲区 */
    }
  }

  /**
   * nio 选择器的使用方法。只有套接字的Channel 才能被配置为非阻塞，FileChannel 不行，这里采用SocketChannel 来测试。
   */
  public static void selector() throws IOException {
    Selector selector = Selector.open();
    ServerSocketChannel ssChannel = ServerSocketChannel.open();
    ssChannel.configureBlocking(false); // 配置非阻塞
    ssChannel.register(selector, SelectionKey.OP_ACCEPT); // 注册选择器

    ServerSocket serverSocket = ssChannel.socket();
    InetSocketAddress address = new InetSocketAddress("127.0.0.1", 8888);
    serverSocket.bind(address);

    while (true) {
      selector.select();
      Set<SelectionKey> keys = selector.selectedKeys();
      Iterator<SelectionKey> keyIterator = keys.iterator();
      while (keyIterator.hasNext()) {
        SelectionKey key = keyIterator.next();
        if (key.isAcceptable()) {
          ServerSocketChannel ssChannel1 = (ServerSocketChannel) key.channel();
          // 服务器会为每个新连接创建一个 SocketChannel
          SocketChannel sChannel = ssChannel1.accept();
          sChannel.configureBlocking(false);
          // 这个新连接主要用于从客户端读取数据
          sChannel.register(selector, SelectionKey.OP_READ);
        } else if (key.isReadable()) {
          SocketChannel sChannel = (SocketChannel) key.channel();
          System.out.println(readDataFromSocketChannel(sChannel));
          sChannel.close();
        }
        keyIterator.remove();
      }
    }
  }

  private static String readDataFromSocketChannel(SocketChannel sChannel) throws IOException {
    ByteBuffer buffer = ByteBuffer.allocate(1024);
    StringBuilder data = new StringBuilder();
    while (true) {
      buffer.clear();
      int n = sChannel.read(buffer);
      if (n == -1) {
        break;
      }
      buffer.flip();
      int limit = buffer.limit();// 这个地方limit表示的是缓冲区有数据部分实际的末尾部分，小于等于缓冲区容量1024.
      char[] dst = new char[limit];
      for (int i = 0; i < limit; i++) {
        dst[i] = (char) buffer.get(i);
      }
      data.append(dst);
      buffer.clear();
    }
    return data.toString();
  }
}
