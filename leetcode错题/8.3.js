function MyPromise(executor) {
  this.status = "pending"
  this.value = null
  this.reason = null
  this.onFulfilledCallbacks = []
  this.onRejectedCallbacks = []

  const resolve = (value) => {
    if ((this.status = "pending")) {
      queueMicrotask(() => {
        this.value = value
        this.status = "fulfilled"

        this.onFulfilledCallbacks.forEach((func) => {
          func(this.value)
        })
      })
    }
  }

  const reject = (reason) => {
    if ((this.status = "pending")) {
      queueMicrotask(() => {
        this.reason = reason
        this.status = "rejected"

        this.onRejectedCallbacks.forEach((func) => {
          func(this.reason)
        })
      })
    }
  }

  try {
    executor(resolve, reject)
  } catch (e) {
    reject(e)
  }
}

// 挂到原型上，就不需要每次实例化都新创建一个 then 方法，以便节省内存
MyPromise.prototype.then = function (onfulfilled, onrejected) {
  //
  onfulfilled = typeof onfulfilled === "function" ? onfulfilled : (data) => data
  onrejected =
    typeof onrejected === "function"
      ? onrejected
      : (errorValue) => {
          throw errorValue
        }
  if ((this.status = "pending")) {
    return new MyPromise((resolve, reject) => {
      this.onFulfilledCallbacks.push(() => {
        try {
          let res = onfulfilled(this.value)
          resolve(res)
        } catch (e) {
          reject(e)
        }
      })
      this.onRejectedCallbacks.push(() => {
        try {
          let reason = onfulfilled(this.result)
          resolve(reason)
        } catch (e) {
          reject(e)
        }
      })
    })
  }
  if (this.status === "fulfilled") {
    return new MyPromise((resolve, reject) => {
      queueMicrotask(() => {
        try {
          let res = onfulfilled(this.value)
          resolve(res)
        } catch (e) {
          reject(e)
        }
      })
    })
  }
  if (this.status === "rejected") {
    return new MyPromise((resolve, reject) => {
      queueMicrotask(() => {
        try {
          let res = onrejected(this.reason)
          // promise2 的置值逻辑，无论 onFulfilled与 onRejected 返回的是什么值，都将作为「成功值 (value) 」调用 promise2 的 resolve 置值器为 promise2 置值。
          resolve(res)
        } catch (e) {
          reject(e)
        }
      })
    })
  }
}
