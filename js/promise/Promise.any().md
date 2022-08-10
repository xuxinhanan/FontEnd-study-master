>:heavy_exclamation_mark::heavy_exclamation_mark: **用于获取首个 resolved 的 `promise` 的值[^1]。**



不像 `Promise.all()` 会返回一组值那样，any 只能得到一个 resolved 值。

同时，也不像 `Promise.race()` 总是返回第一个 settled 值（resolved 或 rejected），这个方法返回的是第一个 resolved 值。这个方法将会忽略掉所有的被 rejected 的 `promise`。



~~~js
/**
 * @param {Array<Promise>} promises
 * @return {Promise}
 */
function any(promises) {
  if (!promises.length) throw new AggregateError("No Promise passed");

  return new Promise((resolve, reject) => {
    let settledCount = 0, errors = [];
    promises.forEach((promise, index) => promise
      .then(data => resolve(data))
      .catch(err => {
        errors[index] = err;
        if (++settledCount === promises.length) reject(new AggregateError(
          'No Promise in Promise.any was resolved',
          errors
        ))
      })
    )
  })
}
~~~





[^1]: 只要有一个 `promise` 被 resolved 了，那么此方法就会提前结束，而不会继续等待其他的 `promise` 全部 settled。如果给出的 promise 都 rejected，那么返回的 promise 会带有 `AggregateError`这个特殊的 error 对象，在其 `errors` 属性中存储着所有 promise error。

