> 键的**类型**、键的**顺序**、**可迭代**、**长度**、**性能**等方面的差异。





|          |      | Map                                                          | Object                                                       |
| :------- | ---- | :----------------------------------------------------------- | ------------------------------------------------------------ |
| 意外的键 |      | `Map` 默认情 况不包含任何键。只包含显式插入的键。            | 一个 `Object` 有一个原型, 原型链上的键名有可能和你自己在对象上的设置的键名产生冲突。<br />**备注：**虽然从 ES5 开始可以用 [`Object.create(null)`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/create) 来创建一个没有原型的对象，但是这种用法不太常见。 |
| 键的类型 |      | 一个 `Map` 的键可以是**任意值**，包括函数、对象或任意基本类型。 | 一个 `Object` 的键必须是一个 [`String`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String) 或是 [`Symbol`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol)。 |
| 键的顺序 |      | `Map` 中的 key 是有序的。                                    |                                                              |
| Size     |      | `Map` 的键值对个数可以轻易地通过 [`size`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Map/size) 属性获取。 | `Object` 的键值对个数只能手动计算.                           |
| 迭代     |      | `Map` 是 [可迭代的](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Iteration_protocols) 的，所以可以直接被迭代。 | `Object` 没有实现 [迭代协议](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Iteration_protocols#the_iterable_protocol)，所以使用 JavaSctipt 的 **for...of 表达式并不能直接迭代对象。**备注：对象可以实现迭代协议，或者你可以使用 [`Object.keys`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/keys) 或 [`Object.entries`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/entries)。[for...in](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/for...in) 表达式允许你迭代一个对象的*可枚举*属性。 |
| 性能     |      | 在频繁增删键值对的场景下表现更好。                           | 在频繁添加和删除键值对的场景下未作出优化。                   |

**尽管如此，有时候利用 Object 来代替 Map 会有奇效（存、取代码更简单）。**