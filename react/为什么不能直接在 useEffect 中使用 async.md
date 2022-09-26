在代码中，我们会使用 async/await 从第三方 API 获取数据。如果你对 async/await 熟悉的话，你会知道，每个 async 函数都会默认返回一个隐式的 promise。但是，**useEffect 不应该返回任何内容**。所以你会在控制台日志中看到以下警告：

> Warning: An effect function must not return anything besides a function, which is used for clean-up. It looks like you wrote useEffect(async () => ...) or returned a Promise. Instead, write the async function inside your effect and call it immediately:

这就是为什么不能直接在 useEffect 中使用 async 函数的原因。因此，我们可以不直接在 useEffect 里使用用 async 函数，需要把函数提取出来，像下面这样：

~~~react
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [data, setData] = useState({ hits: [] });
    
  const fetchData = async () => {
    const result = await axios('http://localhost/api/v1/search?query=redux');
    setData(result.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <ul>
      {data.hits.map(item => (
        <li key={item.objectID}>
          <a href={item.url}>{item.title}</a>
        </li>
      ))}
    </ul>
  );
}

export default App;
~~~

