> :heavy_exclamation_mark:  `Promise.allSettled` 等待所有的 promise 都被 settle，无论结果如何。



当有多个彼此不依赖的异步任务成功完成时，或者想知道每个`promise`的结果时，通常使用它。

相比之下，`Promise.all()` 更适合彼此相互依赖或者在其中任何一个`reject`时立即结束。

~~~js
/**
 * @param {Array<any>} promises 可以包含非Promise类型数据
 * @return {Promise<Array<{status: 'fulfilled', value: any} | {status: 'rejected', reason: any}>>} 返回的Promise代理的数据为每个promise的结果
 */
function allSettled(promises) {
  return new Promise((resolve) => {
    const result = [];
    let waitFor = promises.length;
    if (waitFor === 0) {
      resolve(result);
    }
    promises.forEach((promise, index) => {
      Promise.resolve(promise).then(value => result[index] = { status: 'fulfilled', value })
      .catch((reason) => result[index] = { status: 'rejected', reason })
      .finally(() => {
        waitFor--;
        if (waitFor === 0) {
          resolve(result);
        }
      })
    })
  })
}
~~~

