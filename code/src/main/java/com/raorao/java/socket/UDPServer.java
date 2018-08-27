package com.raorao.java.socket;

import java.io.IOException;
import java.net.DatagramPacket;
import java.net.DatagramSocket;
import java.net.InetAddress;

/**
 * .
 *
 * @author Xiong Raorao
 * @since 2018-08-27-22:19
 */
public class UDPServer {

  public static void main(String[] args) throws IOException {
    DatagramSocket serverSocket = new DatagramSocket(9876);
    byte[] receiveData = new byte[1024];

    byte[] sendData;

    while(true){

      DatagramPacket receivePacket = new DatagramPacket(receiveData,receiveData.length);

      serverSocket.receive(receivePacket);

      String sentence = new String(receivePacket.getData());

      InetAddress IPAddress = receivePacket.getAddress();

      int port = receivePacket.getPort();

      String capitalized = sentence.toUpperCase();

      sendData = capitalized.getBytes();

      DatagramPacket sendPacket = new DatagramPacket(sendData,sendData.length,IPAddress,port);

      serverSocket.send(sendPacket);
      System.out.println("Recived: " + sentence +  "from " + IPAddress + ":" + port);
      System.out.println("Send back:" + capitalized);
    }

  }
}
