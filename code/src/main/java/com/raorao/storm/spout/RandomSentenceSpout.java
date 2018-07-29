package com.raorao.storm.spout;

import org.apache.storm.spout.SpoutOutputCollector;
import org.apache.storm.task.TopologyContext;
import org.apache.storm.topology.OutputFieldsDeclarer;
import org.apache.storm.topology.base.BaseRichSpout;
import org.apache.storm.tuple.Fields;
import org.apache.storm.tuple.Values;
import org.apache.storm.utils.Utils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Map;
import java.util.Random;

public class RandomSentenceSpout extends BaseRichSpout {
  private static final Logger LOG = LoggerFactory.getLogger(RandomSentenceSpout.class);

  SpoutOutputCollector _collector;
  Random _rand;


  @Override
  public void open(Map conf, TopologyContext context, SpoutOutputCollector collector) {
    _collector = collector;
    _rand = new Random();
  }

  @Override
  public void nextTuple() {
    Utils.sleep(100);
    String[] sentences = new String[]{sentence("the cow jumped over the moon"), sentence("an apple a day keeps the doctor away"),
        sentence("four score and seven years ago"), sentence("snow white and the seven dwarfs"), sentence("i am at two with nature")};
    final String sentence = sentences[_rand.nextInt(sentences.length)];

    LOG.debug("Emitting tuple: {}", sentence);

    _collector.emit(new Values(sentence));
  }

  protected String sentence(String input) {
    return input;
  }

  @Override
  public void ack(Object id) {
  }

  @Override
  public void fail(Object id) {
  }

  @Override
  public void declareOutputFields(OutputFieldsDeclarer declarer) {
    declarer.declare(new Fields("word"));
  }

  // Add unique identifier to each tuple, which is helpful for debugging
  public static class TimeStamped extends RandomSentenceSpout {
    private final String prefix;

    public TimeStamped() {
      this("");
    }

    public TimeStamped(String prefix) {
      this.prefix = prefix;
    }

    protected String sentence(String input) {
      return prefix + currentDate() + " " + input;
    }

    private String currentDate() {
      return new SimpleDateFormat("yyyy.MM.dd_HH:mm:ss.SSSSSSSSS").format(new Date());
    }
  }
}