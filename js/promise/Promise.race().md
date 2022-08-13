>:heavy_exclamation_mark:   race（竞赛）：只等待其中一个 `settled` 的 `promise`（不关注其 resolved 还是 rejected） 并获取其结果。



~~~js
/**
 * @param {Array<Promise>} promises
 * @return {Promise}
 */
function race(promises) {
  return new Promise((resolve, reject) => {
    promises.forEach((promise) => {
      // 给每个promise注册给当前返回的promise置值的回调
      promise.then(resolve, reject);
    })
  })
}
~~~

