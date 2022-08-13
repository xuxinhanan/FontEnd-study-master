> :heavy_exclamation_mark:  `finally(callback)` 类似于 `then(callback, callback)`，因为当 promise settled 时 `callback` 就会执行：无论 promise 被 resolve 还是 reject。





~~~js
/**
 * @param {Promise<any>} promise
 * @param {() => void} onFinally
 * @returns {Promise<any>}
 */
async function myFinally(promise, onFinally) {
  try {
    const val = await promise;
    await onFinally();
    return val;
  } catch(error) {
    await onFinally();
    throw error;
  }
}
~~~

