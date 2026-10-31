"""content.resolve 的测试：笔记更新后题目和天的编号是否保持不变。用法：python3 learn/tests/test_content.py"""
import copy
import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
import content  # noqa: E402


def make(spec):
    """spec: {路线: [(阶段, [(天标题, [(题目, 要点)])])]} → resolve 需要的 routes、days、questions（临时编号）。"""
    routes, days, questions = [], {}, {}
    for rid, stages in spec.items():
        route = {'id': rid, 'title': rid, 'stages': []}
        n = 0
        for stage_title, day_list in stages:
            stage = {'title': stage_title, 'days': []}
            for title, qs in day_list:
                n += 1
                tmp = f'{rid}~{n}'
                ids = []
                for text, points in qs:
                    qid = content.text_id(text)
                    questions.setdefault(qid, {'text': text, 'points': points, 'days': []})['days'].append(tmp)
                    ids.append(qid)
                days[tmp] = {'route': rid, 'title': title, 'questions': ids}
                stage['days'].append(tmp)
            route['stages'].append(stage)
        routes.append(route)
    return routes, days, questions


def run(spec, lock):
    routes, days, questions = make(spec)
    qmap, dmap, changes, new = content.resolve(routes, days, questions, copy.deepcopy(lock))
    by_text = {questions[t]['text']: q for t, q in qmap.items()}
    by_title = {days[t]['title']: d for t, d in dmap.items()}
    return by_text, by_title, changes, new


BASE = {'java': [
    ('基础', [('数据类型', [('Integer 缓存池的范围是多少？', 'Integer.valueOf 在 -128～127 之间返回缓存的对象'),
                         ('String 为什么不可变？', 'value 数组是 final 的，没有修改它的方法，便于缓存哈希值和保证线程安全')]),
             ('关键字', [('final 有哪些用法？', '修饰类不能继承，修饰方法不能重写，修饰变量只能赋值一次')])]),
    ('容器', [('HashMap', [('HashMap 什么时候扩容？', '元素个数超过容量乘以负载因子 0.75 时扩容为两倍'),
                         ('HashMap 的 put 过程是怎样的？', '计算哈希、定位桶、链表或红黑树插入、超过阈值扩容')]),
             ('ConcurrentHashMap', [('ConcurrentHashMap 怎样保证线程安全？', 'JDK 8 用 CAS 加 synchronized 锁住桶的头节点')])]),
]}


class Resolve(unittest.TestCase):
    def setUp(self):
        self.q0, self.d0, changes, self.lock = run(BASE, content.empty_lock())
        self.assertEqual(len(changes['added']['questions']), 6)
        self.assertEqual(list(self.d0.values()), ['java-01', 'java-02', 'java-03', 'java-04'])
        # 第一次建立时题号就是文字的哈希，与早期版本的规则一致
        self.assertEqual(self.q0['String 为什么不可变？'], content.text_id('String 为什么不可变？'))

    def test_same_content_is_stable(self):
        q, d, changes, _ = run(BASE, self.lock)
        self.assertEqual((q, d), (self.q0, self.d0))
        self.assertFalse(content.has_changes(changes))

    def test_rephrased_question_keeps_id(self):
        spec = copy.deepcopy(BASE)
        spec['java'][0][1][0][1][1] = ('String 为什么被设计成不可变的？', spec['java'][0][1][0][1][1][1])
        q, _, changes, _ = run(spec, self.lock)
        self.assertEqual(q['String 为什么被设计成不可变的？'], self.q0['String 为什么不可变？'])
        self.assertEqual(changes['edited']['questions'], [self.q0['String 为什么不可变？']])
        self.assertEqual(changes['added']['questions'], [])

    def test_rewritten_question_with_same_points_keeps_id(self):
        # 问法完全换了，但参考要点没变
        spec = copy.deepcopy(BASE)
        spec['java'][1][1][0][1][0] = ('负载因子是什么？触发扩容的条件呢？', spec['java'][1][1][0][1][0][1])
        q, _, changes, _ = run(spec, self.lock)
        self.assertEqual(q['负载因子是什么？触发扩容的条件呢？'], self.q0['HashMap 什么时候扩容？'])

    def test_points_only_change_is_reported(self):
        spec = copy.deepcopy(BASE)
        spec['java'][0][1][1][1][0] = ('final 有哪些用法？', '修饰类、方法和变量；修饰引用时引用不能变，对象本身可以变')
        q, _, changes, _ = run(spec, self.lock)
        self.assertEqual(q['final 有哪些用法？'], self.q0['final 有哪些用法？'])
        self.assertEqual(changes['edited']['questions'], [self.q0['final 有哪些用法？']])

    def test_unrelated_new_question_gets_new_id(self):
        spec = copy.deepcopy(BASE)
        spec['java'][1][1][1][1].append(('volatile 能保证原子性吗？', '不能，只保证可见性和禁止重排序'))
        q, _, changes, _ = run(spec, self.lock)
        new_id = q['volatile 能保证原子性吗？']
        self.assertNotIn(new_id, self.lock['questions'])
        self.assertEqual(changes['added']['questions'], [new_id])

    def test_deleted_then_restored(self):
        spec = copy.deepcopy(BASE)
        del spec['java'][0][1][1][1][0]
        _, _, changes, lock2 = run(spec, self.lock)
        gone = self.q0['final 有哪些用法？']
        self.assertEqual(changes['retired']['questions'], [gone])
        self.assertEqual(lock2['questions'][gone]['status'], 'retired')
        # 再加回来：恢复原编号，记为新增（恢复）
        q, _, changes, lock3 = run(BASE, lock2)
        self.assertEqual(q['final 有哪些用法？'], gone)
        self.assertEqual(changes['added']['questions'], [gone])
        self.assertEqual(lock3['questions'][gone]['status'], 'active')

    def test_insert_day_in_middle_keeps_later_ids(self):
        spec = copy.deepcopy(BASE)
        spec['java'][0][1].insert(1, ('包装类型', [('自动装箱是怎么实现的？', '编译器调用 valueOf，拆箱调用 xxxValue')]))
        _, d, changes, _ = run(spec, self.lock)
        for title, did in self.d0.items():
            self.assertEqual(d[title], did, title)
        self.assertEqual(d['包装类型'], 'java-05')
        self.assertEqual(changes['added']['days'], ['java-05'])

    def test_renamed_day_keeps_id_by_questions(self):
        spec = copy.deepcopy(BASE)
        spec['java'][1][1][0] = ('HashMap 的实现', spec['java'][1][1][0][1])
        _, d, changes, _ = run(spec, self.lock)
        self.assertEqual(d['HashMap 的实现'], self.d0['HashMap'])
        self.assertEqual(changes['edited']['days'], [self.d0['HashMap']])

    def test_changed_reading_is_reported_for_day(self):
        def with_sig(sigs):
            routes, days, questions = make(BASE)
            for tmp, d in days.items():
                d['sig'] = sigs.get(d['title'], 'same')
            return content.resolve(routes, days, questions, copy.deepcopy(self.lock))
        # 旧的 lock 中没有指纹：只记下，不算修改
        _, dmap, changes, lock = with_sig({})
        self.assertEqual(changes['edited']['days'], [])
        self.assertEqual(lock['days'][self.d0['HashMap']]['sig'], 'same')
        # 之后导读或阅读范围变了：这一天算修改，编号不变
        routes, days, questions = make(BASE)
        for d in days.values():
            d['sig'] = 'changed' if d['title'] == 'HashMap' else 'same'
        _, dmap2, changes, _ = content.resolve(routes, days, questions, lock)
        self.assertEqual(changes['edited']['days'], [self.d0['HashMap']])
        self.assertEqual(set(dmap2.values()), set(self.d0.values()))

    def test_reordered_days_and_stages(self):
        spec = {'java': list(reversed(copy.deepcopy(BASE)['java']))}
        q, d, changes, _ = run(spec, self.lock)
        self.assertEqual((q, d), (self.q0, self.d0))
        self.assertFalse(content.has_changes(changes))

    def test_deleted_day_number_is_not_reused(self):
        spec = copy.deepcopy(BASE)
        del spec['java'][1][1][1]
        _, _, changes, lock2 = run(spec, self.lock)
        self.assertEqual(changes['retired']['days'], ['java-04'])
        spec[ 'java'][1][1].append(('并发容器', [('CopyOnWriteArrayList 适合什么场景？', '读多写少，写时复制整个数组')]))
        _, d, _, _ = run(spec, lock2)
        self.assertEqual(d['并发容器'], 'java-05')

    def test_route_removed_and_added(self):
        spec = {'llm': [('模型', [('注意力', [('为什么除以根号 d？', '点积的方差随维度增大，缩放后 softmax 不会饱和')])])]}
        _, d, changes, lock2 = run(spec, self.lock)
        self.assertEqual(changes['retired']['routes'], ['java'])
        self.assertEqual(changes['added']['routes'], ['llm'])
        self.assertEqual(d['注意力'], 'llm-01')
        self.assertEqual(lock2['routes']['java']['status'], 'retired')
        self.assertEqual(len(changes['retired']['questions']), 6)

    def test_manual_overrides(self):
        spec = copy.deepcopy(BASE)
        spec['java'][0][1][1][1][0] = ('final 修饰引用时，对象还能改吗？', '引用不能指向别的对象，对象本身的字段可以修改')
        q, _, changes, _ = run(spec, self.lock)
        tmp = content.text_id('final 修饰引用时，对象还能改吗？')
        auto = q['final 修饰引用时，对象还能改吗？']
        lock = copy.deepcopy(self.lock)
        if auto == self.q0['final 有哪些用法？']:
            lock['manual']['separate'].append(tmp)
            q, _, changes, _ = run(spec, lock)
            self.assertNotEqual(q['final 修饰引用时，对象还能改吗？'], self.q0['final 有哪些用法？'])
            self.assertEqual(changes['retired']['questions'], [self.q0['final 有哪些用法？']])
        else:
            lock['manual']['map'][tmp] = self.q0['final 有哪些用法？']
            q, _, changes, _ = run(spec, lock)
            self.assertEqual(q['final 修饰引用时，对象还能改吗？'], self.q0['final 有哪些用法？'])

    def test_similar_but_different_questions_are_not_merged(self):
        # 同一天里新增一道相近的题，原来的题仍在：原题沿用编号，新题拿新编号
        spec = copy.deepcopy(BASE)
        spec['java'][1][1][0][1].append(('HashMap 什么时候缩容？', 'HashMap 不会缩容，删除元素后容量不变'))
        q, _, changes, _ = run(spec, self.lock)
        self.assertEqual(q['HashMap 什么时候扩容？'], self.q0['HashMap 什么时候扩容？'])
        self.assertEqual(changes['added']['questions'], [q['HashMap 什么时候缩容？']])
        self.assertEqual(changes['edited']['questions'], [])

    def test_history_record(self):
        spec = copy.deepcopy(BASE)
        del spec['java'][0][1][1]
        _, _, changes, lock2 = run(spec, self.lock)
        content.record(lock2, changes, '2026-11-01')
        self.assertEqual(lock2['history'][-1]['date'], '2026-11-01')
        self.assertEqual(lock2['history'][-1]['retired']['days'], ['java-02'])
        _, _, changes, lock3 = run(spec, lock2)
        content.record(lock3, changes, '2026-11-02')
        self.assertEqual(len(lock3['history']), 1)


if __name__ == '__main__':
    unittest.main(verbosity=1)
