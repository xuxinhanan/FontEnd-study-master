> :heavy_exclamation_mark:  用于并行执行多个 promise，并等待所有 promise 都被 resolved。如果任意的 promise 被 rejected，则 Promise.all 整个将会 rejected。




~~~js
/**
 *@param {Array<any>} promises 通常是一个数组项为Promise的数组，数组项也允许是非Promise类型数据(any)
 * @return {Promise<any[]>} 返回一个Promise。其代理的数据为一个保存所有Promise的结果的数组；如果有一个promise被rejected，则此实例被rejected，其代理的数据是第一个失败promise的reason
 */
function all(promises) {
  return new Promise((resolve, reject) => {
    const result = [];
    if (promises.length === 0) {
      resolve(result);
      return;
    }
    let countPending = promises.length;
    promises.forEach((promise, index) => {
      Promise.resolve(promise).then((value) => {
        // 保证返回的prmoise顺序正确
        result[index] = value;
        countPending--;
        if (countPending === 0) {
          resolve(result);
        }
        // 如果promise被rejected，则调用reject即可
      }, reject);
    });
  });
}
~~~

